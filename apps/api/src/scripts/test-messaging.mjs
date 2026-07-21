import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const testDatabase = resolve(`data/messaging-integration-${process.pid}.db`);
process.env.SUPABASE_URL = "";
process.env.SUPABASE_PUBLISHABLE_KEY = "";
process.env.DATABASE_PATH = testDatabase;
process.env.JWT_SECRET = "messaging-integration-test-secret-2026";

const [{ buildApp }, { database }] = await Promise.all([
  import("../../dist/app.js"),
  import("../../dist/database.js"),
]);

const app = await buildApp();
await app.ready();

const now = new Date().toISOString();
const learnerA = randomUUID();
const learnerB = randomUUID();
const insertUser = database.prepare(`
  INSERT INTO users (id, email, password_hash, name, role, audience, level_id, created_at, updated_at)
  VALUES (?, ?, 'test', ?, 'student', 'student', 'terminale-a', ?, ?)
`);
insertUser.run(learnerA, "a@messages.test", "Awa", now, now);
insertUser.run(learnerB, "b@messages.test", "Koffi", now, now);

const tokenA = app.jwt.sign({ sub: learnerA, email: "a@messages.test", role: "student" });
const tokenB = app.jwt.sign({ sub: learnerB, email: "b@messages.test", role: "student" });
const auth = (token) => ({ authorization: `Bearer ${token}` });

try {
  const recipients = await app.inject({ method: "GET", url: "/messages/recipients", headers: auth(tokenA) });
  assert.equal(recipients.statusCode, 200);
  assert.equal(recipients.json().recipients[0].id, learnerB);

  const created = await app.inject({
    method: "POST",
    url: "/messages/threads",
    headers: auth(tokenA),
    payload: { recipientId: learnerB, subject: "Révision fonctions", body: "Peux-tu vérifier ma méthode ?" },
  });
  assert.equal(created.statusCode, 201, created.body);
  const threadId = created.json().threadId;

  const inboxB = await app.inject({ method: "GET", url: "/messages/threads", headers: auth(tokenB) });
  assert.equal(inboxB.json().threads[0].unreadCount, 1);

  const firstMessages = await app.inject({ method: "GET", url: `/messages/threads/${threadId}/messages`, headers: auth(tokenB) });
  assert.equal(firstMessages.statusCode, 200);
  const firstMessageId = firstMessages.json().messages[0].id;
  assert.equal(firstMessages.json().messages[0].isMine, false);

  const markedRead = await app.inject({ method: "POST", url: `/messages/threads/${threadId}/read`, headers: auth(tokenB) });
  assert.equal(markedRead.statusCode, 204);

  const replied = await app.inject({
    method: "POST",
    url: `/messages/threads/${threadId}/messages`,
    headers: auth(tokenB),
    payload: { body: "Oui, envoie ton calcul.", replyToId: firstMessageId },
  });
  assert.equal(replied.statusCode, 201, replied.body);
  const replyId = replied.json().messageId;

  const inboxA = await app.inject({ method: "GET", url: "/messages/threads", headers: auth(tokenA) });
  assert.equal(inboxA.json().threads[0].unreadCount, 1);

  const edited = await app.inject({ method: "PATCH", url: `/messages/messages/${replyId}`, headers: auth(tokenB), payload: { body: "Oui, envoie-moi ton calcul." } });
  assert.equal(edited.statusCode, 200);

  const afterEdit = await app.inject({ method: "GET", url: `/messages/threads/${threadId}/messages`, headers: auth(tokenA) });
  assert.equal(afterEdit.json().messages[1].body, "Oui, envoie-moi ton calcul.");
  assert.equal(afterEdit.json().messages[1].replyTo.id, firstMessageId);

  const removed = await app.inject({ method: "DELETE", url: `/messages/messages/${replyId}`, headers: auth(tokenB) });
  assert.equal(removed.statusCode, 204);
  const afterDelete = await app.inject({ method: "GET", url: `/messages/threads/${threadId}/messages`, headers: auth(tokenA) });
  assert.equal(afterDelete.json().messages[1].body, "Message supprimé");

  const preferences = await app.inject({ method: "PATCH", url: `/messages/threads/${threadId}/preferences`, headers: auth(tokenB), payload: { muted: true, archived: true } });
  assert.equal(preferences.statusCode, 200);
  const activeInbox = await app.inject({ method: "GET", url: "/messages/threads", headers: auth(tokenB) });
  assert.equal(activeInbox.json().threads.length, 0);
  const archives = await app.inject({ method: "GET", url: "/messages/threads?archived=true", headers: auth(tokenB) });
  assert.equal(archives.json().threads[0].archived, true);
  assert.equal(archives.json().threads[0].muted, true);

  console.log(JSON.stringify({ ok: true, scenarios: 10, threadId }));
} finally {
  await app.close();
  database.close();
  for (const path of [testDatabase, `${testDatabase}-wal`, `${testDatabase}-shm`]) {
    if (existsSync(path)) rmSync(path);
  }
}
