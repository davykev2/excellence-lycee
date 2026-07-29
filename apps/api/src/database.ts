import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { config } from "./config.js";
import { storeItems } from "./storeCatalog.js";

mkdirSync(dirname(config.databasePath), { recursive: true });

export const database = new Database(config.databasePath);
database.pragma("journal_mode = WAL");
database.pragma("foreign_keys = ON");

database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'content_editor', 'admin')),
    audience TEXT NOT NULL DEFAULT 'student' CHECK (audience IN ('student', 'parent', 'teacher')),
    level_id TEXT NOT NULL,
    photo_url TEXT,
    email_verified_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    revoked_at TEXT,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS refresh_tokens_user_idx ON refresh_tokens(user_id);
  CREATE INDEX IF NOT EXISTS refresh_tokens_expiry_idx ON refresh_tokens(expires_at);

  CREATE TABLE IF NOT EXISTS lesson_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    path_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    xp_awarded INTEGER NOT NULL DEFAULT 20 CHECK (xp_awarded >= 0),
    best_score INTEGER NOT NULL DEFAULT 20 CHECK (best_score BETWEEN 0 AND 20),
    attempt_count INTEGER NOT NULL DEFAULT 1 CHECK (attempt_count >= 1),
    completed_at TEXT NOT NULL,
    UNIQUE(user_id, path_id, lesson_id)
  );

  CREATE INDEX IF NOT EXISTS lesson_progress_user_idx ON lesson_progress(user_id);

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    subject_id TEXT,
    metadata_json TEXT,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS audit_logs_actor_idx ON audit_logs(actor_user_id);

  CREATE TABLE IF NOT EXISTS lesson_contents (
    id TEXT PRIMARY KEY,
    path_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
    draft_version INTEGER NOT NULL DEFAULT 1,
    published_version INTEGER,
    published_payload_json TEXT,
    created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    published_at TEXT,
    UNIQUE(path_id, lesson_id)
  );

  CREATE INDEX IF NOT EXISTS lesson_contents_status_idx
    ON lesson_contents(status, updated_at DESC);

  CREATE TABLE IF NOT EXISTS lesson_content_revisions (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL REFERENCES lesson_contents(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    payload_json TEXT NOT NULL,
    note TEXT,
    created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL,
    UNIQUE(document_id, version)
  );

  CREATE INDEX IF NOT EXISTS lesson_content_revisions_document_idx
    ON lesson_content_revisions(document_id, version DESC);

  CREATE TABLE IF NOT EXISTS arena_exercise_levels (
    id TEXT PRIMARY KEY,
    level_id TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    lesson_key TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    stage_number INTEGER NOT NULL CHECK (stage_number > 0),
    payload_json TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
    draft_version INTEGER NOT NULL DEFAULT 1 CHECK (draft_version > 0),
    published_version INTEGER,
    published_payload_json TEXT,
    created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    published_at TEXT,
    UNIQUE(level_id, subject_id, lesson_key, difficulty, stage_number)
  );

  CREATE INDEX IF NOT EXISTS arena_exercise_levels_target_idx
    ON arena_exercise_levels(level_id, subject_id, lesson_key, difficulty, stage_number);
  CREATE INDEX IF NOT EXISTS arena_exercise_levels_status_idx
    ON arena_exercise_levels(status, updated_at DESC);

  CREATE TABLE IF NOT EXISTS arena_exercise_level_revisions (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL REFERENCES arena_exercise_levels(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    payload_json TEXT NOT NULL,
    note TEXT,
    created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL,
    UNIQUE(document_id, version)
  );

  CREATE INDEX IF NOT EXISTS arena_exercise_level_revisions_document_idx
    ON arena_exercise_level_revisions(document_id, version DESC);

  CREATE TABLE IF NOT EXISTS message_threads (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL CHECK (length(subject) BETWEEN 1 AND 120),
    created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    last_message_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS message_thread_members (
    thread_id TEXT NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TEXT NOT NULL,
    last_read_at TEXT,
    muted INTEGER NOT NULL DEFAULT 0 CHECK (muted IN (0, 1)),
    archived INTEGER NOT NULL DEFAULT 0 CHECK (archived IN (0, 1)),
    PRIMARY KEY (thread_id, user_id)
  );

  CREATE INDEX IF NOT EXISTS message_thread_members_user_idx
    ON message_thread_members(user_id, archived, thread_id);

  CREATE TABLE IF NOT EXISTS user_presence (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    last_seen_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS user_presence_last_seen_idx
    ON user_presence(last_seen_at DESC);

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
    sender_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    body TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 2000),
    reply_to_id TEXT REFERENCES messages(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL,
    edited_at TEXT,
    deleted_at TEXT
  );

  CREATE INDEX IF NOT EXISTS messages_thread_created_idx
    ON messages(thread_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS messages_sender_idx
    ON messages(sender_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS global_messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    body TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 2000),
    reply_to_id TEXT REFERENCES global_messages(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL,
    edited_at TEXT,
    deleted_at TEXT
  );

  CREATE INDEX IF NOT EXISTS global_messages_created_idx
    ON global_messages(created_at DESC);
  CREATE INDEX IF NOT EXISTS global_messages_sender_idx
    ON global_messages(sender_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS lesson_reactions (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    path_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    reaction TEXT NOT NULL CHECK (reaction IN ('useful', 'love', 'clear', 'confusing')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (user_id, path_id, lesson_id)
  );

  CREATE INDEX IF NOT EXISTS lesson_reactions_target_idx
    ON lesson_reactions(path_id, lesson_id);

  CREATE TABLE IF NOT EXISTS lesson_comments (
    id TEXT PRIMARY KEY,
    path_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    author_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    body TEXT NOT NULL CHECK (length(trim(body)) BETWEEN 1 AND 1000),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS lesson_comments_target_idx
    ON lesson_comments(path_id, lesson_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS store_items (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('frame', 'theme', 'badge', 'title')),
    title TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS store_purchases (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL REFERENCES store_items(id) ON DELETE CASCADE,
    price_paid INTEGER NOT NULL CHECK (price_paid >= 0),
    created_at TEXT NOT NULL,
    UNIQUE(user_id, item_id)
  );

  CREATE INDEX IF NOT EXISTS store_purchases_user_idx ON store_purchases(user_id);

  CREATE TABLE IF NOT EXISTS bac_exam_settings (
    exam_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    question_count INTEGER NOT NULL CHECK (question_count > 0),
    subject_published INTEGER NOT NULL DEFAULT 0 CHECK (subject_published IN (0, 1)),
    results_published INTEGER NOT NULL DEFAULT 0 CHECK (results_published IN (0, 1)),
    answer_key_json TEXT NOT NULL DEFAULT '{}',
    corrections_json TEXT NOT NULL DEFAULT '{}',
    updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bac_exam_submissions (
    id TEXT PRIMARY KEY,
    exam_id TEXT NOT NULL REFERENCES bac_exam_settings(exam_id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    answers_json TEXT NOT NULL,
    submitted_at TEXT NOT NULL,
    UNIQUE(exam_id, user_id)
  );

  CREATE INDEX IF NOT EXISTS bac_exam_submissions_user_idx
    ON bac_exam_submissions(user_id, submitted_at DESC);
`);

const bacExamSettingsColumns = database.prepare("PRAGMA table_info(bac_exam_settings)").all() as Array<{ name: string }>;
if (!bacExamSettingsColumns.some((column) => column.name === "subject_published")) {
  database.exec("ALTER TABLE bac_exam_settings ADD COLUMN subject_published INTEGER NOT NULL DEFAULT 0 CHECK (subject_published IN (0, 1))");
}

database.prepare(`
  INSERT INTO bac_exam_settings (
    exam_id, title, duration_minutes, question_count, subject_published, results_published,
    answer_key_json, corrections_json, updated_at
  ) VALUES (?, ?, ?, ?, 0, 0, '{}', '{}', ?)
  ON CONFLICT(exam_id) DO UPDATE SET
    title = excluded.title,
    duration_minutes = excluded.duration_minutes,
    question_count = excluded.question_count
`).run(
  "bac-ci-2024-level-test",
  "Concours BAC & BT 2024 — Test de niveau",
  180,
  69,
  new Date().toISOString(),
);

// Aligne la table catalogue SQLite sur la source de vérité JS (apps/api/src/storeCatalog.ts).
const upsertStoreItem = database.prepare(`
  INSERT INTO store_items (id, category, title, price, active, sort_order)
  VALUES (@id, @category, @title, @price, 1, @sort_order)
  ON CONFLICT(id) DO UPDATE SET
    category = excluded.category,
    title = excluded.title,
    price = excluded.price,
    active = excluded.active,
    sort_order = excluded.sort_order
`);
database.transaction(() => {
  storeItems.forEach((item, index) => {
    upsertStoreItem.run({ ...item, sort_order: index });
  });
})();

const userColumns = database.prepare("PRAGMA table_info(users)").all() as Array<{ name: string }>;
if (!userColumns.some((column) => column.name === "audience")) {
  database.exec("ALTER TABLE users ADD COLUMN audience TEXT NOT NULL DEFAULT 'student' CHECK (audience IN ('student', 'parent', 'teacher'))");
}

const progressColumns = database.prepare("PRAGMA table_info(lesson_progress)").all() as Array<{ name: string }>;
if (!progressColumns.some((column) => column.name === "best_score")) {
  database.exec("ALTER TABLE lesson_progress ADD COLUMN best_score INTEGER NOT NULL DEFAULT 20 CHECK (best_score BETWEEN 0 AND 20)");
}
if (!progressColumns.some((column) => column.name === "attempt_count")) {
  database.exec("ALTER TABLE lesson_progress ADD COLUMN attempt_count INTEGER NOT NULL DEFAULT 1 CHECK (attempt_count >= 1)");
}

export type UserRole = "student" | "teacher" | "content_editor" | "admin";
export type AccountAudience = "student" | "parent" | "teacher";

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: UserRole;
  audience: AccountAudience;
  level_id: string;
  photo_url: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export function publicUser(user: UserRow) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    accountType: user.audience,
    levelId: user.level_id,
    photoUrl: user.photo_url ?? undefined,
    emailVerified: Boolean(user.email_verified_at),
  };
}

export function writeAuditLog(actorUserId: string | null, action: string, subjectId?: string, metadata?: unknown) {
  database.prepare(`
    INSERT INTO audit_logs (id, actor_user_id, action, subject_id, metadata_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), actorUserId, action, subjectId ?? null, metadata ? JSON.stringify(metadata) : null, new Date().toISOString());
}
