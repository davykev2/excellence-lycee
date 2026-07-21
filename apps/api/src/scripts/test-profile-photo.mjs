import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const testDatabase = resolve(`data/profile-photo-integration-${process.pid}.db`);
process.env.SUPABASE_URL = "";
process.env.SUPABASE_PUBLISHABLE_KEY = "";
process.env.DATABASE_PATH = testDatabase;
process.env.JWT_SECRET = "profile-photo-integration-test-secret-2026";

const [{ buildApp }, { database }] = await Promise.all([
  import("../../dist/app.js"),
  import("../../dist/database.js"),
]);

const app = await buildApp();
await app.ready();
const userId = randomUUID();
const now = new Date().toISOString();
database.prepare(`
  INSERT INTO users (id, email, password_hash, name, role, audience, level_id, created_at, updated_at)
  VALUES (?, 'photo@test.local', 'test', 'Davy Kev', 'admin', 'teacher', 'terminale-a', ?, ?)
`).run(userId, now, now);
const token = app.jwt.sign({ sub: userId, email: "photo@test.local", role: "admin" });
const headers = { authorization: `Bearer ${token}` };
const png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

try {
  const uploaded = await app.inject({ method: "POST", url: "/users/me/photo", headers, payload: { dataUrl: png } });
  assert.equal(uploaded.statusCode, 200, uploaded.body);
  assert.equal(uploaded.json().user.photoUrl, png);

  const invalid = await app.inject({ method: "POST", url: "/users/me/photo", headers, payload: { dataUrl: "data:image/png;base64,AAAA" } });
  assert.equal(invalid.statusCode, 400);

  const removed = await app.inject({ method: "DELETE", url: "/users/me/photo", headers });
  assert.equal(removed.statusCode, 200, removed.body);
  assert.equal(removed.json().user.photoUrl, undefined);

  const stored = database.prepare("SELECT photo_url FROM users WHERE id = ?").get(userId);
  assert.equal(stored.photo_url, null);
  console.log(JSON.stringify({ ok: true, scenarios: 4 }));
} finally {
  await app.close();
  database.close();
  for (const suffix of ["", "-shm", "-wal"]) {
    const path = `${testDatabase}${suffix}`;
    if (existsSync(path)) rmSync(path, { force: true });
  }
}
