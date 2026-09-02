import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

const testDirectoryPrefix = resolve(tmpdir(), "excellence-feedback-test-");
const testDirectory = mkdtempSync(join(tmpdir(), "excellence-feedback-test-"));

process.env.NODE_ENV = "test";
process.env.SUPABASE_URL = "";
process.env.SUPABASE_PUBLISHABLE_KEY = "";
process.env.SUPABASE_ANON_KEY = "";
process.env.DATABASE_PATH = join(testDirectory, "feedback.sqlite");
process.env.JWT_SECRET = "test-only-feedback-jwt-secret-that-is-long-enough";
process.env.RESEND_API_KEY = "";
process.env.EMAIL_FROM = "";

type TestUser = {
  id: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "content_editor" | "admin";
  audience: "student" | "parent" | "teacher";
};

const users = {
  awa: {
    id: "00000000-0000-4000-8000-000000000001",
    email: "awa.feedback@example.test",
    name: "Awa Élève",
    role: "student",
    audience: "student",
  },
  koffi: {
    id: "00000000-0000-4000-8000-000000000002",
    email: "koffi.feedback@example.test",
    name: "Koffi Élève",
    role: "student",
    audience: "student",
  },
  teacher: {
    id: "00000000-0000-4000-8000-000000000003",
    email: "teacher.feedback@example.test",
    name: "Mme Professeure",
    role: "teacher",
    audience: "teacher",
  },
  parent: {
    id: "00000000-0000-4000-8000-000000000004",
    email: "parent.feedback@example.test",
    name: "Parent Koffi",
    role: "student",
    audience: "parent",
  },
  admin: {
    id: "00000000-0000-4000-8000-000000000005",
    email: "admin.feedback@example.test",
    name: "Administration",
    role: "admin",
    audience: "teacher",
  },
  editor: {
    id: "00000000-0000-4000-8000-000000000006",
    email: "editor.feedback@example.test",
    name: "Équipe éditoriale",
    role: "content_editor",
    audience: "teacher",
  },
} satisfies Record<string, TestUser>;

const pathId = "terminale-svt-l1-emotional-reactions";
const lessonId = `${pathId}-overview`;

let app: Awaited<ReturnType<(typeof import("../apps/api/src/app.ts"))["buildApp"]>>;
let database: (typeof import("../apps/api/src/database.ts"))["database"];

function authorization(user: TestUser) {
  const token = app.jwt.sign({ sub: user.id, email: user.email, role: user.role });
  return { authorization: `Bearer ${token}` };
}

async function jsonRequest(
  user: TestUser,
  options: { method: "GET" | "POST" | "PUT"; url: string; payload?: unknown },
) {
  const response = await app.inject({ ...options, headers: authorization(user) });
  return { response, body: response.json() as Record<string, any> };
}

test.before(async () => {
  const appModule = await import("../apps/api/src/app.ts");
  const databaseModule = await import("../apps/api/src/database.ts");
  app = await appModule.buildApp();
  database = databaseModule.database;

  const insertUser = database.prepare(`
    INSERT INTO users (
      id, email, password_hash, name, role, audience, level_id,
      photo_url, email_verified_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'terminale-a', NULL, ?, ?, ?)
  `);
  const now = new Date().toISOString();
  for (const user of Object.values(users)) {
    insertUser.run(user.id, user.email, "unused-test-password-hash", user.name, user.role, user.audience, now, now, now);
  }
});

test.after(async () => {
  await app?.close();
  database?.close();
  const resolvedDirectory = resolve(testDirectory);
  assert.ok(
    resolvedDirectory.startsWith(`${testDirectoryPrefix}`) && resolvedDirectory !== resolve(tmpdir()),
    `Unexpected temporary directory: ${resolvedDirectory}`,
  );
  rmSync(resolvedDirectory, { recursive: true, force: true });
});

test("admin reactions stay separate and the bell only surfaces real learners", async () => {
  const awaComment = await jsonRequest(users.awa, {
    method: "POST",
    url: `/lesson-feedback/${pathId}/${lessonId}/comments`,
    payload: { body: "La correction de ce niveau m’a vraiment aidée." },
  });
  assert.equal(awaComment.response.statusCode, 201);
  const comment = awaComment.body.comments.find((item: any) => item.authorId === users.awa.id);
  assert.ok(comment?.id, "The learner comment should be returned by the feedback endpoint.");

  for (const [user, body] of [
    [users.teacher, "Commentaire enseignant hors cloche élève."],
    [users.parent, "Commentaire parent hors cloche élève."],
  ] as const) {
    const result = await jsonRequest(user, {
      method: "POST",
      url: `/lesson-feedback/${pathId}/${lessonId}/comments`,
      payload: { body },
    });
    assert.equal(result.response.statusCode, 201);
  }

  for (const [user, reaction] of [
    [users.awa, "useful"],
    [users.koffi, "clear"],
    [users.teacher, "love"],
    [users.parent, "confusing"],
  ] as const) {
    const result = await jsonRequest(user, {
      method: "PUT",
      url: `/lesson-feedback/${pathId}/${lessonId}/reaction`,
      payload: { reaction },
    });
    assert.equal(result.response.statusCode, 200);
  }

  for (const [user, reaction] of [
    [users.koffi, "like"],
    [users.teacher, "love"],
    [users.parent, "like"],
    [users.editor, "love"],
    [users.admin, "helpful"],
  ] as const) {
    const result = await jsonRequest(user, {
      method: "PUT",
      url: `/lesson-feedback/comments/${comment.id}/reaction`,
      payload: { reaction },
    });
    assert.equal(result.response.statusCode, 200);
  }

  const summary = await jsonRequest(users.awa, {
    method: "GET",
    url: `/lesson-feedback/${pathId}/${lessonId}`,
  });
  assert.equal(summary.response.statusCode, 200);
  const updatedComment = summary.body.comments.find((item: any) => item.id === comment.id);
  assert.deepEqual(updatedComment.reactions.counts, { like: 2, love: 2, helpful: 0 });
  assert.deepEqual(updatedComment.reactions.adminCounts, { like: 0, love: 0, helpful: 1 });
  assert.equal(updatedComment.reactions.total, 5);

  const forbiddenFeed = await jsonRequest(users.awa, { method: "GET", url: "/lesson-feedback/admin/feed?limit=100" });
  assert.equal(forbiddenFeed.response.statusCode, 403);

  const editorFeed = await jsonRequest(users.editor, { method: "GET", url: "/lesson-feedback/admin/feed?limit=100" });
  assert.equal(editorFeed.response.statusCode, 200);

  const adminFeed = await jsonRequest(users.admin, { method: "GET", url: "/lesson-feedback/admin/feed?limit=100" });
  assert.equal(adminFeed.response.statusCode, 200);
  assert.ok(adminFeed.body.items.length >= 4);
  assert.deepEqual(
    [...new Set(adminFeed.body.items.map((item: any) => item.authorId))].sort(),
    [users.awa.id, users.koffi.id].sort(),
  );
  assert.deepEqual(
    [...new Set(adminFeed.body.items.map((item: any) => item.kind))].sort(),
    ["comment", "comment_reaction", "reaction"],
  );

  const replyPayload = {
    recipientId: users.koffi.id,
    subject: "Retour sur ton avis de correction",
    body: "Bonjour Koffi, merci pour ton avis. Nous avons clarifié la correction.",
    replyMessage: "Merci pour ton avis. Nous avons clarifié la correction.",
    location: "Réactions émotionnelles — repères essentiels",
  };
  const editorReply = await jsonRequest(users.editor, {
    method: "POST",
    url: "/lesson-feedback/admin/reply",
    payload: replyPayload,
  });
  assert.equal(editorReply.response.statusCode, 403);

  const adminReply = await jsonRequest(users.admin, {
    method: "POST",
    url: "/lesson-feedback/admin/reply",
    payload: replyPayload,
  });
  assert.equal(adminReply.response.statusCode, 201);
  assert.equal(adminReply.body.emailSent, false);
  assert.match(adminReply.body.threadId, /^[0-9a-f-]{36}$/);

  const threads = await jsonRequest(users.koffi, { method: "GET", url: "/messages/threads?archived=false" });
  assert.equal(threads.response.statusCode, 200);
  const thread = threads.body.threads.find((item: any) => item.id === adminReply.body.threadId);
  assert.equal(thread.subject, replyPayload.subject);
  assert.equal(thread.participant.role, "admin");
  assert.equal(thread.unreadCount, 1);

  const messages = await jsonRequest(users.koffi, {
    method: "GET",
    url: `/messages/threads/${adminReply.body.threadId}/messages`,
  });
  assert.equal(messages.response.statusCode, 200);
  assert.equal(messages.body.messages.length, 1);
  assert.equal(messages.body.messages[0].body, replyPayload.body);
  assert.equal(messages.body.messages[0].isMine, false);
});

test("the Supabase migration carries the same separation and learner-only contract", () => {
  const migrationPath = resolve(
    import.meta.dirname,
    "../supabase/migrations/20260830110000_lesson_feedback_admin_reactions_feed.sql",
  );
  const sql = readFileSync(migrationPath, "utf8");
  assert.match(sql, /create or replace function public\.get_mastery_lesson_feedback/);
  assert.match(sql, /create or replace function public\.get_admin_mastery_feedback_feed/);
  assert.equal(sql.match(/reactor\.role <> 'admin'/g)?.length, 3);
  assert.equal(sql.match(/profile\.role = 'student'/g)?.length, 3);
  assert.equal(sql.match(/profile\.account_type = 'student'/g)?.length, 3);
  assert.match(sql, /notify pgrst, 'reload schema'/);
});
