import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { database, type UserRow, writeAuditLog } from "../database.js";
import type { GlobalMessageSummary, MessageRecipientSummary, MessageThreadSummary, ThreadMessageSummary } from "../messaging.js";
import {
  deleteSupabaseGlobalMessage,
  deleteSupabaseMessage,
  editSupabaseGlobalMessage,
  editSupabaseMessage,
  getSupabaseThreadMessages,
  listSupabaseGlobalMessages,
  listSupabaseMessageRecipients,
  listSupabaseMessageThreads,
  markSupabaseThreadRead,
  sendSupabaseGlobalMessage,
  sendSupabaseThreadMessage,
  startSupabaseMessageThread,
  supabaseConfigured,
  updateSupabaseThreadPreferences,
} from "../supabase.js";

const idParamsSchema = z.object({ id: z.string().uuid("Conversation invalide.") });
const messageIdParamsSchema = z.object({ messageId: z.string().uuid("Message invalide.") });
const listThreadsQuerySchema = z.object({
  archived: z.enum(["true", "false"]).default("false").transform((value) => value === "true"),
});
const recipientsQuerySchema = z.object({ search: z.string().trim().max(80).optional().default("") });
const globalMessagesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).optional().default(150),
});
const createThreadSchema = z.object({
  recipientId: z.string().uuid("Destinataire invalide."),
  subject: z.string().trim().min(2, "Ajoute un objet.").max(120),
  body: z.string().trim().min(1, "Écris ton message.").max(2000),
});
const sendMessageSchema = z.object({
  body: z.string().trim().min(1, "Écris ton message.").max(2000),
  replyToId: z.string().uuid("Réponse invalide.").nullable().optional(),
});
const editMessageSchema = z.object({ body: z.string().trim().min(1).max(2000) });
const preferencesSchema = z.object({ muted: z.boolean().optional(), archived: z.boolean().optional() })
  .refine((value) => value.muted !== undefined || value.archived !== undefined, "Aucune préférence à modifier.");

const ONLINE_WINDOW_MS = 2 * 60 * 1000;

function asRecipient(user: UserRow, lastSeenAt?: string | null): MessageRecipientSummary {
  const lastSeenTime = lastSeenAt ? Date.parse(lastSeenAt) : Number.NaN;
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    accountType: user.audience,
    levelId: user.level_id,
    photoUrl: user.photo_url ?? undefined,
    online: Number.isFinite(lastSeenTime) && Date.now() - lastSeenTime <= ONLINE_WINDOW_MS,
    lastSeenAt: lastSeenAt ?? undefined,
  };
}

function canMessage(actor: UserRow, recipient: UserRow) {
  if (actor.id === recipient.id) return false;
  const actorIsStaff = ["teacher", "content_editor", "admin"].includes(actor.role);
  const recipientIsStaff = ["teacher", "content_editor", "admin"].includes(recipient.role);
  if (actor.role === "admin" || recipientIsStaff) return true;
  if (actor.audience === "parent") return false;
  if (actorIsStaff) return actor.level_id === recipient.level_id;
  return recipient.audience === "student" && actor.level_id === recipient.level_id;
}

function sqliteUser(userId: string) {
  return database.prepare("SELECT * FROM users WHERE id = ?").get(userId) as UserRow | undefined;
}

function listSqliteRecipients(userId: string, search: string) {
  const actor = sqliteUser(userId);
  if (!actor) return [];
  const normalized = search.toLocaleLowerCase("fr");
  const rows = database.prepare(`
    SELECT users.*, user_presence.last_seen_at
    FROM users
    LEFT JOIN user_presence ON user_presence.user_id = users.id
    ORDER BY
      CASE WHEN user_presence.last_seen_at >= ? THEN 0 ELSE 1 END,
      user_presence.last_seen_at DESC,
      users.name COLLATE NOCASE ASC
  `).all(new Date(Date.now() - ONLINE_WINDOW_MS).toISOString()) as Array<UserRow & { last_seen_at: string | null }>;
  return rows
    .filter((recipient) => canMessage(actor, recipient))
    .map((recipient) => asRecipient(recipient, recipient.last_seen_at))
    .filter((recipient) => !normalized || `${recipient.name} ${recipient.role} ${recipient.levelId}`.toLocaleLowerCase("fr").includes(normalized));
}

function touchSqlitePresence(userId: string) {
  database.prepare(`
    INSERT INTO user_presence (user_id, last_seen_at)
    VALUES (?, ?)
    ON CONFLICT(user_id) DO UPDATE SET last_seen_at = excluded.last_seen_at
  `).run(userId, new Date().toISOString());
}

interface SqliteThreadRow {
  id: string;
  subject: string;
  created_at: string;
  updated_at: string;
  participant_id: string;
  participant_name: string;
  participant_role: UserRow["role"];
  participant_audience: UserRow["audience"];
  participant_level_id: string;
  participant_photo_url: string | null;
  last_message_body: string | null;
  last_message_sender_id: string | null;
  last_message_created_at: string | null;
  last_message_deleted_at: string | null;
  unread_count: number;
  muted: number;
  archived: number;
}

function listSqliteThreads(userId: string, includeArchived: boolean): MessageThreadSummary[] {
  const rows = database.prepare(`
    SELECT thread.id, thread.subject, thread.created_at, thread.updated_at,
      other.user_id AS participant_id, profile.name AS participant_name,
      profile.role AS participant_role, profile.audience AS participant_audience,
      profile.level_id AS participant_level_id, profile.photo_url AS participant_photo_url,
      latest.body AS last_message_body, latest.sender_id AS last_message_sender_id,
      latest.created_at AS last_message_created_at, latest.deleted_at AS last_message_deleted_at,
      self.muted, self.archived,
      (
        SELECT COUNT(*) FROM messages unread
        WHERE unread.thread_id = thread.id
          AND unread.sender_id IS NOT ?
          AND (
            (self.last_read_at IS NULL AND unread.created_at >= self.joined_at)
            OR (self.last_read_at IS NOT NULL AND unread.created_at > self.last_read_at)
          )
      ) AS unread_count
    FROM message_thread_members self
    JOIN message_threads thread ON thread.id = self.thread_id
    JOIN message_thread_members other ON other.thread_id = thread.id AND other.user_id <> self.user_id
    JOIN users profile ON profile.id = other.user_id
    LEFT JOIN messages latest ON latest.id = (
      SELECT recent.id FROM messages recent WHERE recent.thread_id = thread.id
      ORDER BY recent.created_at DESC LIMIT 1
    )
    WHERE self.user_id = ? AND (? = 1 OR self.archived = 0)
    ORDER BY thread.last_message_at DESC
  `).all(userId, userId, includeArchived ? 1 : 0) as SqliteThreadRow[];

  return rows.map((row) => ({
    id: row.id,
    subject: row.subject,
    participant: {
      id: row.participant_id,
      name: row.participant_name,
      role: row.participant_role,
      accountType: row.participant_audience,
      levelId: row.participant_level_id,
      photoUrl: row.participant_photo_url ?? undefined,
    },
    lastMessage: {
      body: row.last_message_deleted_at ? "Message supprimé" : row.last_message_body ?? "Nouvelle conversation",
      senderId: row.last_message_sender_id ?? undefined,
      createdAt: row.last_message_created_at ?? row.created_at,
      deleted: Boolean(row.last_message_deleted_at),
    },
    unreadCount: Number(row.unread_count),
    muted: Boolean(row.muted),
    archived: Boolean(row.archived),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

interface SqliteMessageRow {
  id: string;
  thread_id: string;
  sender_id: string | null;
  sender_name: string | null;
  sender_photo_url: string | null;
  body: string;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
  reply_to_id: string | null;
  reply_body: string | null;
  reply_deleted_at: string | null;
  reply_sender_name: string | null;
  read_by_recipient: number;
}

function getSqliteMessages(userId: string, threadId: string): ThreadMessageSummary[] | null {
  const membership = database.prepare("SELECT 1 FROM message_thread_members WHERE thread_id = ? AND user_id = ?")
    .get(threadId, userId);
  if (!membership) return null;
  const rows = database.prepare(`
    SELECT message.*, sender.name AS sender_name, sender.photo_url AS sender_photo_url,
      reply.body AS reply_body, reply.deleted_at AS reply_deleted_at,
      reply_sender.name AS reply_sender_name,
      EXISTS (
        SELECT 1 FROM message_thread_members reader
        WHERE reader.thread_id = message.thread_id AND reader.user_id <> message.sender_id
          AND reader.last_read_at >= message.created_at
      ) AS read_by_recipient
    FROM (
      SELECT * FROM messages WHERE thread_id = ? ORDER BY created_at DESC LIMIT 150
    ) message
    LEFT JOIN users sender ON sender.id = message.sender_id
    LEFT JOIN messages reply ON reply.id = message.reply_to_id
    LEFT JOIN users reply_sender ON reply_sender.id = reply.sender_id
    ORDER BY message.created_at ASC
  `).all(threadId) as SqliteMessageRow[];
  return rows.map((row) => ({
    id: row.id,
    threadId: row.thread_id,
    senderId: row.sender_id ?? undefined,
    senderName: row.sender_name ?? "Utilisateur supprimé",
    senderPhotoUrl: row.sender_photo_url ?? undefined,
    body: row.deleted_at ? "Message supprimé" : row.body,
    createdAt: row.created_at,
    editedAt: row.edited_at ?? undefined,
    deletedAt: row.deleted_at ?? undefined,
    isMine: row.sender_id === userId,
    readByRecipient: Boolean(row.read_by_recipient),
    replyTo: row.reply_to_id ? {
      id: row.reply_to_id,
      body: row.reply_deleted_at ? "Message supprimé" : row.reply_body ?? "Message indisponible",
      senderName: row.reply_sender_name ?? "Utilisateur supprimé",
      deleted: Boolean(row.reply_deleted_at),
    } : undefined,
  }));
}

export function startSqliteThread(userId: string, input: z.infer<typeof createThreadSchema>) {
  const actor = sqliteUser(userId);
  const recipient = sqliteUser(input.recipientId);
  if (!actor || !recipient) return null;
  if (!canMessage(actor, recipient)) return false;
  const threadId = randomUUID();
  const messageId = randomUUID();
  const now = new Date().toISOString();
  database.transaction(() => {
    database.prepare(`INSERT INTO message_threads (id, subject, created_by, created_at, updated_at, last_message_at) VALUES (?, ?, ?, ?, ?, ?)`)
      .run(threadId, input.subject, userId, now, now, now);
    const insertMember = database.prepare(`INSERT INTO message_thread_members (thread_id, user_id, joined_at, last_read_at) VALUES (?, ?, ?, ?)`);
    insertMember.run(threadId, userId, now, now);
    insertMember.run(threadId, recipient.id, now, null);
    database.prepare(`INSERT INTO messages (id, thread_id, sender_id, body, created_at) VALUES (?, ?, ?, ?, ?)`)
      .run(messageId, threadId, userId, input.body, now);
  })();
  writeAuditLog(userId, "message.thread.create", threadId, { recipientId: recipient.id });
  return threadId;
}

function sendSqliteMessage(userId: string, threadId: string, body: string, replyToId?: string | null) {
  const membership = database.prepare("SELECT 1 FROM message_thread_members WHERE thread_id = ? AND user_id = ?")
    .get(threadId, userId);
  if (!membership) return null;
  if (replyToId) {
    const reply = database.prepare("SELECT 1 FROM messages WHERE id = ? AND thread_id = ?").get(replyToId, threadId);
    if (!reply) return false;
  }
  const messageId = randomUUID();
  const now = new Date().toISOString();
  database.transaction(() => {
    database.prepare(`INSERT INTO messages (id, thread_id, sender_id, body, reply_to_id, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
      .run(messageId, threadId, userId, body, replyToId ?? null, now);
    database.prepare("UPDATE message_threads SET updated_at = ?, last_message_at = ? WHERE id = ?").run(now, now, threadId);
    database.prepare("UPDATE message_thread_members SET archived = 0 WHERE thread_id = ?").run(threadId);
    database.prepare("UPDATE message_thread_members SET last_read_at = ? WHERE thread_id = ? AND user_id = ?").run(now, threadId, userId);
  })();
  return messageId;
}

interface SqliteGlobalMessageRow {
  id: string;
  sender_id: string | null;
  sender_name: string | null;
  sender_photo_url: string | null;
  sender_role: UserRow["role"] | null;
  sender_level_id: string | null;
  body: string;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
  reply_to_id: string | null;
  reply_body: string | null;
  reply_deleted_at: string | null;
  reply_sender_name: string | null;
}

function listSqliteGlobalMessages(userId: string, limit: number): GlobalMessageSummary[] {
  const rows = database.prepare(`
    SELECT message.*, sender.name AS sender_name, sender.photo_url AS sender_photo_url,
      sender.role AS sender_role, sender.level_id AS sender_level_id,
      reply.body AS reply_body, reply.deleted_at AS reply_deleted_at,
      reply_sender.name AS reply_sender_name
    FROM (
      SELECT * FROM global_messages ORDER BY created_at DESC LIMIT ?
    ) message
    LEFT JOIN users sender ON sender.id = message.sender_id
    LEFT JOIN global_messages reply ON reply.id = message.reply_to_id
    LEFT JOIN users reply_sender ON reply_sender.id = reply.sender_id
    ORDER BY message.created_at ASC
  `).all(limit) as SqliteGlobalMessageRow[];

  return rows.map((row) => ({
    id: row.id,
    threadId: "global",
    senderId: row.sender_id ?? undefined,
    senderName: row.sender_name ?? "Utilisateur supprimé",
    senderPhotoUrl: row.sender_photo_url ?? undefined,
    senderRole: row.sender_role ?? "student",
    senderLevelId: row.sender_level_id ?? "",
    body: row.deleted_at ? "Message supprimé" : row.body,
    createdAt: row.created_at,
    editedAt: row.edited_at ?? undefined,
    deletedAt: row.deleted_at ?? undefined,
    isMine: row.sender_id === userId,
    readByRecipient: false,
    replyTo: row.reply_to_id ? {
      id: row.reply_to_id,
      body: row.reply_deleted_at ? "Message supprimé" : row.reply_body ?? "Message indisponible",
      senderName: row.reply_sender_name ?? "Utilisateur supprimé",
      deleted: Boolean(row.reply_deleted_at),
    } : undefined,
  }));
}

function sendSqliteGlobalMessage(userId: string, body: string, replyToId?: string | null) {
  if (replyToId && !database.prepare("SELECT 1 FROM global_messages WHERE id = ?").get(replyToId)) return false;
  const messageId = randomUUID();
  database.prepare(`
    INSERT INTO global_messages (id, sender_id, body, reply_to_id, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(messageId, userId, body, replyToId ?? null, new Date().toISOString());
  return messageId;
}

function editSqliteGlobalMessage(userId: string, messageId: string, body: string) {
  return database.prepare(`
    UPDATE global_messages SET body = ?, edited_at = ?
    WHERE id = ? AND sender_id = ? AND deleted_at IS NULL
  `).run(body, new Date().toISOString(), messageId, userId).changes > 0;
}

function deleteSqliteGlobalMessage(userId: string, messageId: string) {
  const actor = sqliteUser(userId);
  if (!actor) return false;
  const result = actor.role === "admin"
    ? database.prepare("UPDATE global_messages SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL")
        .run(new Date().toISOString(), messageId)
    : database.prepare("UPDATE global_messages SET deleted_at = ? WHERE id = ? AND sender_id = ? AND deleted_at IS NULL")
        .run(new Date().toISOString(), messageId, userId);
  if (result.changes > 0) writeAuditLog(userId, "global_message.delete", messageId);
  return result.changes > 0;
}

export async function messageRoutes(app: FastifyInstance) {
  app.get("/global", { preHandler: app.authenticate }, async (request, reply) => {
    const parsed = globalMessagesQuerySchema.safeParse(request.query);
    if (!parsed.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Limite invalide." });
    const messages = supabaseConfigured
      ? await listSupabaseGlobalMessages(request.authContext.accessToken!, parsed.data.limit)
      : listSqliteGlobalMessages(request.authContext.id, parsed.data.limit);
    return { messages, updatedAt: new Date().toISOString() };
  });

  app.post("/global", { preHandler: app.authenticate, config: { rateLimit: { max: 30, timeWindow: "1 minute" } } }, async (request, reply) => {
    const body = sendMessageSchema.safeParse(request.body);
    if (!body.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: body.error.issues[0]?.message });
    const messageId = supabaseConfigured
      ? await sendSupabaseGlobalMessage(request.authContext.accessToken!, body.data.body, body.data.replyToId)
      : sendSqliteGlobalMessage(request.authContext.id, body.data.body, body.data.replyToId);
    if (messageId === false) return reply.code(400).send({ error: "REPLY_NOT_FOUND", message: "Le message cité est introuvable." });
    return reply.code(201).send({ messageId });
  });

  app.patch("/global/:messageId", { preHandler: app.authenticate }, async (request, reply) => {
    const params = messageIdParamsSchema.safeParse(request.params);
    const body = editMessageSchema.safeParse(request.body);
    if (!params.success || !body.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: params.error?.issues[0]?.message ?? body.error?.issues[0]?.message });
    const changed = supabaseConfigured
      ? await editSupabaseGlobalMessage(request.authContext.accessToken!, params.data.messageId, body.data.body)
      : editSqliteGlobalMessage(request.authContext.id, params.data.messageId, body.data.body);
    if (!changed) return reply.code(404).send({ error: "MESSAGE_NOT_FOUND", message: "Message introuvable ou non modifiable." });
    return { updated: true };
  });

  app.delete("/global/:messageId", { preHandler: app.authenticate }, async (request, reply) => {
    const params = messageIdParamsSchema.safeParse(request.params);
    if (!params.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: params.error.issues[0]?.message });
    const changed = supabaseConfigured
      ? await deleteSupabaseGlobalMessage(request.authContext.accessToken!, params.data.messageId)
      : deleteSqliteGlobalMessage(request.authContext.id, params.data.messageId);
    if (!changed) return reply.code(404).send({ error: "MESSAGE_NOT_FOUND", message: "Message introuvable ou déjà supprimé." });
    return reply.code(204).send();
  });

  app.get("/recipients", { preHandler: app.authenticate }, async (request, reply) => {
    const parsed = recipientsQuerySchema.safeParse(request.query);
    if (!parsed.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Recherche invalide." });
    if (!supabaseConfigured) touchSqlitePresence(request.authContext.id);
    const recipients = supabaseConfigured
      ? await listSupabaseMessageRecipients(request.authContext.accessToken!, parsed.data.search)
      : listSqliteRecipients(request.authContext.id, parsed.data.search);
    return { recipients };
  });

  app.get("/threads", { preHandler: app.authenticate }, async (request, reply) => {
    const parsed = listThreadsQuerySchema.safeParse(request.query);
    if (!parsed.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Filtre invalide." });
    const threads = supabaseConfigured
      ? await listSupabaseMessageThreads(request.authContext.accessToken!, parsed.data.archived)
      : listSqliteThreads(request.authContext.id, parsed.data.archived);
    return { threads, updatedAt: new Date().toISOString() };
  });

  app.post("/threads", { preHandler: app.authenticate, config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => {
    const parsed = createThreadSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message });
    const threadId = supabaseConfigured
      ? await startSupabaseMessageThread(request.authContext.accessToken!, parsed.data)
      : startSqliteThread(request.authContext.id, parsed.data);
    if (threadId === null) return reply.code(404).send({ error: "RECIPIENT_NOT_FOUND", message: "Destinataire introuvable." });
    if (threadId === false) return reply.code(403).send({ error: "RECIPIENT_NOT_ALLOWED", message: "Tu ne peux pas écrire à ce destinataire." });
    return reply.code(201).send({ threadId });
  });

  app.get("/threads/:id/messages", { preHandler: app.authenticate }, async (request, reply) => {
    const params = idParamsSchema.safeParse(request.params);
    if (!params.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: params.error.issues[0]?.message });
    const messages = supabaseConfigured
      ? await getSupabaseThreadMessages(request.authContext.accessToken!, params.data.id)
      : getSqliteMessages(request.authContext.id, params.data.id);
    if (!messages) return reply.code(404).send({ error: "THREAD_NOT_FOUND", message: "Conversation introuvable." });
    return { messages };
  });

  app.post("/threads/:id/messages", { preHandler: app.authenticate, config: { rateLimit: { max: 40, timeWindow: "1 minute" } } }, async (request, reply) => {
    const params = idParamsSchema.safeParse(request.params);
    const body = sendMessageSchema.safeParse(request.body);
    if (!params.success || !body.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: params.error?.issues[0]?.message ?? body.error?.issues[0]?.message });
    const messageId = supabaseConfigured
      ? await sendSupabaseThreadMessage(request.authContext.accessToken!, params.data.id, body.data.body, body.data.replyToId)
      : sendSqliteMessage(request.authContext.id, params.data.id, body.data.body, body.data.replyToId);
    if (messageId === null) return reply.code(404).send({ error: "THREAD_NOT_FOUND", message: "Conversation introuvable." });
    if (messageId === false) return reply.code(400).send({ error: "REPLY_NOT_FOUND", message: "Le message cité est introuvable." });
    return reply.code(201).send({ messageId });
  });

  app.post("/threads/:id/read", { preHandler: app.authenticate }, async (request, reply) => {
    const params = idParamsSchema.safeParse(request.params);
    if (!params.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: params.error.issues[0]?.message });
    const changed = supabaseConfigured
      ? await markSupabaseThreadRead(request.authContext.accessToken!, params.data.id)
      : database.prepare("UPDATE message_thread_members SET last_read_at = ? WHERE thread_id = ? AND user_id = ?")
          .run(new Date().toISOString(), params.data.id, request.authContext.id).changes > 0;
    if (!changed) return reply.code(404).send({ error: "THREAD_NOT_FOUND", message: "Conversation introuvable." });
    return reply.code(204).send();
  });

  app.patch("/threads/:id/preferences", { preHandler: app.authenticate }, async (request, reply) => {
    const params = idParamsSchema.safeParse(request.params);
    const body = preferencesSchema.safeParse(request.body);
    if (!params.success || !body.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: params.error?.issues[0]?.message ?? body.error?.issues[0]?.message });
    const changed = supabaseConfigured
      ? await updateSupabaseThreadPreferences(request.authContext.accessToken!, params.data.id, body.data)
      : database.prepare(`UPDATE message_thread_members SET muted = COALESCE(?, muted), archived = COALESCE(?, archived) WHERE thread_id = ? AND user_id = ?`)
          .run(body.data.muted === undefined ? null : Number(body.data.muted), body.data.archived === undefined ? null : Number(body.data.archived), params.data.id, request.authContext.id).changes > 0;
    if (!changed) return reply.code(404).send({ error: "THREAD_NOT_FOUND", message: "Conversation introuvable." });
    return { updated: true };
  });

  app.patch("/messages/:messageId", { preHandler: app.authenticate }, async (request, reply) => {
    const params = messageIdParamsSchema.safeParse(request.params);
    const body = editMessageSchema.safeParse(request.body);
    if (!params.success || !body.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: params.error?.issues[0]?.message ?? body.error?.issues[0]?.message });
    const changed = supabaseConfigured
      ? await editSupabaseMessage(request.authContext.accessToken!, params.data.messageId, body.data.body)
      : database.prepare("UPDATE messages SET body = ?, edited_at = ? WHERE id = ? AND sender_id = ? AND deleted_at IS NULL")
          .run(body.data.body, new Date().toISOString(), params.data.messageId, request.authContext.id).changes > 0;
    if (!changed) return reply.code(404).send({ error: "MESSAGE_NOT_FOUND", message: "Message introuvable ou non modifiable." });
    return { updated: true };
  });

  app.delete("/messages/:messageId", { preHandler: app.authenticate }, async (request, reply) => {
    const params = messageIdParamsSchema.safeParse(request.params);
    if (!params.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: params.error.issues[0]?.message });
    const changed = supabaseConfigured
      ? await deleteSupabaseMessage(request.authContext.accessToken!, params.data.messageId)
      : database.prepare("UPDATE messages SET deleted_at = ? WHERE id = ? AND sender_id = ? AND deleted_at IS NULL")
          .run(new Date().toISOString(), params.data.messageId, request.authContext.id).changes > 0;
    if (!changed) return reply.code(404).send({ error: "MESSAGE_NOT_FOUND", message: "Message introuvable ou déjà supprimé." });
    writeAuditLog(request.authContext.id, "message.delete", params.data.messageId);
    return reply.code(204).send();
  });
}
