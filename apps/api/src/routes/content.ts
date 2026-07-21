import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type {
  LessonContentDocument,
  LessonContentPayload,
  LessonContentRevision,
  LessonContentStatus,
  PublishedLessonContent,
} from "../content.js";
import { database, writeAuditLog } from "../database.js";
import {
  listSupabaseAdminLessonContents,
  listSupabaseLessonContentRevisions,
  listSupabasePublishedLessonContents,
  restoreSupabaseLessonContentRevision,
  saveSupabaseLessonContent,
  supabaseConfigured,
  updateSupabaseLessonContentStatus,
  writeSupabaseAudit,
} from "../supabase.js";

const questionSchema = z.object({
  type: z.enum(["choice", "short-answer"]).optional(),
  prompt: z.string().trim().min(3).max(600),
  options: z.array(z.string().trim().min(1).max(400)).max(6),
  correctIndex: z.number().int().min(0).max(5),
  acceptedAnswers: z.array(z.string().trim().min(1).max(300)).max(12).optional(),
  points: z.number().int().min(1).max(20).optional(),
  sourceLabel: z.string().trim().max(180).optional(),
  explanation: z.string().trim().min(3).max(1200),
}).superRefine((question, context) => {
  if (question.type === "short-answer") {
    if (!question.acceptedAnswers?.length) context.addIssue({ code: "custom", message: "Une réponse courte doit avoir au moins une réponse acceptée." });
    return;
  }
  if (question.options.length < 2 || question.correctIndex >= question.options.length) {
    context.addIssue({ code: "custom", message: "Une question à choix doit avoir au moins deux propositions et une bonne réponse valide." });
  }
});

const sourceSchema = z.object({
  documentTitle: z.string().trim().min(2).max(240),
  pages: z.string().trim().min(1).max(80),
  section: z.string().trim().min(2).max(240),
  fidelity: z.enum(["faithful", "faithful-corrected", "adapted"]),
  corrections: z.array(z.string().trim().min(2).max(600)).max(20),
});

const payloadSchema = z.object({
  title: z.string().trim().min(2).max(180),
  summary: z.string().trim().min(5).max(500),
  eyebrow: z.string().trim().min(2).max(120),
  bodyMarkdown: z.string().trim().min(1).max(50000),
  keyPoint: z.string().trim().min(3).max(1200),
  example: z.string().trim().min(3).max(2000),
  questions: z.array(questionSchema).min(1).max(20),
  source: sourceSchema.optional(),
});

const saveSchema = z.object({
  pathId: z.string().regex(/^[a-z0-9-]{3,160}$/),
  lessonId: z.string().regex(/^[a-z0-9-]{3,220}$/),
  payload: payloadSchema,
  note: z.string().trim().max(180).optional(),
});

const statusSchema = z.object({
  status: z.enum(["draft", "review", "published"]),
  unpublish: z.boolean().optional(),
});

const documentParamsSchema = z.object({ documentId: z.string().min(8).max(80) });
const restoreSchema = z.object({ revisionId: z.string().min(8).max(80) });

interface LocalLessonContentRow {
  id: string;
  path_id: string;
  lesson_id: string;
  payload_json: string;
  status: LessonContentStatus;
  draft_version: number;
  published_version: number | null;
  published_payload_json: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  updated_by_name?: string | null;
}

interface LocalRevisionRow {
  id: string;
  document_id: string;
  version: number;
  payload_json: string;
  note: string | null;
  created_by: string | null;
  created_at: string;
  created_by_name?: string | null;
}

function parsePayload(value: string) {
  return JSON.parse(value) as LessonContentPayload;
}

function localDocument(row: LocalLessonContentRow): LessonContentDocument {
  return {
    id: row.id,
    pathId: row.path_id,
    lessonId: row.lesson_id,
    ...parsePayload(row.payload_json),
    status: row.status,
    draftVersion: row.draft_version,
    publishedVersion: row.published_version ?? undefined,
    hasPublishedVersion: Boolean(row.published_payload_json),
    updatedAt: row.updated_at,
    publishedAt: row.published_at ?? undefined,
    updatedByName: row.updated_by_name ?? undefined,
  };
}

function localRevision(row: LocalRevisionRow): LessonContentRevision {
  return {
    id: row.id,
    documentId: row.document_id,
    version: row.version,
    payload: parsePayload(row.payload_json),
    note: row.note ?? undefined,
    createdAt: row.created_at,
    createdByName: row.created_by_name ?? undefined,
  };
}

function requireContentManager(request: FastifyRequest, reply: FastifyReply) {
  if (request.authContext.role !== "admin" && request.authContext.role !== "content_editor") {
    reply.code(403).send({ error: "FORBIDDEN", message: "Accès à l’édition des contenus requis." });
    return false;
  }
  return true;
}

function listLocalAdminContents() {
  const rows = database.prepare(`
    SELECT lesson_contents.*, users.name AS updated_by_name
    FROM lesson_contents
    LEFT JOIN users ON users.id = lesson_contents.updated_by
    ORDER BY lesson_contents.updated_at DESC
  `).all() as LocalLessonContentRow[];
  return rows.map(localDocument);
}

function saveLocalContent(actorUserId: string, input: z.infer<typeof saveSchema>) {
  return database.transaction(() => {
    const existing = database.prepare("SELECT * FROM lesson_contents WHERE path_id = ? AND lesson_id = ?")
      .get(input.pathId, input.lessonId) as LocalLessonContentRow | undefined;
    const now = new Date().toISOString();
    const documentId = existing?.id ?? randomUUID();
    const nextVersion = (existing?.draft_version ?? 0) + 1;
    const payloadJson = JSON.stringify(input.payload);
    if (existing) {
      database.prepare(`
        UPDATE lesson_contents
        SET payload_json = ?, status = ?, draft_version = ?, updated_by = ?, updated_at = ?
        WHERE id = ?
      `).run(payloadJson, existing.status === "published" ? "draft" : existing.status, nextVersion, actorUserId, now, documentId);
    } else {
      database.prepare(`
        INSERT INTO lesson_contents (
          id, path_id, lesson_id, payload_json, status, draft_version,
          created_by, updated_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?)
      `).run(documentId, input.pathId, input.lessonId, payloadJson, nextVersion, actorUserId, actorUserId, now, now);
    }
    database.prepare(`
      INSERT INTO lesson_content_revisions (id, document_id, version, payload_json, note, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(randomUUID(), documentId, nextVersion, payloadJson, input.note ?? "Sauvegarde automatique", actorUserId, now);
    writeAuditLog(actorUserId, "admin.lesson_content.save", documentId, { pathId: input.pathId, lessonId: input.lessonId, version: nextVersion });
    const row = database.prepare(`
      SELECT lesson_contents.*, users.name AS updated_by_name
      FROM lesson_contents LEFT JOIN users ON users.id = lesson_contents.updated_by
      WHERE lesson_contents.id = ?
    `).get(documentId) as LocalLessonContentRow;
    return localDocument(row);
  })();
}

export async function contentRoutes(app: FastifyInstance) {
  app.get("/published", { preHandler: app.authenticate }, async (request) => {
    if (supabaseConfigured) {
      return { contents: await listSupabasePublishedLessonContents(request.authContext.accessToken!) };
    }
    const rows = database.prepare(`
      SELECT * FROM lesson_contents
      WHERE published_payload_json IS NOT NULL
      ORDER BY published_at DESC
    `).all() as LocalLessonContentRow[];
    const contents: PublishedLessonContent[] = rows.flatMap((row) => row.published_payload_json
      ? [{
          pathId: row.path_id,
          lessonId: row.lesson_id,
          ...parsePayload(row.published_payload_json),
          version: row.published_version ?? row.draft_version,
          publishedAt: row.published_at ?? row.updated_at,
        }]
      : []);
    return { contents };
  });

  app.get("/admin", { preHandler: app.authenticate }, async (request, reply) => {
    if (!requireContentManager(request, reply)) return;
    const contents = supabaseConfigured
      ? await listSupabaseAdminLessonContents(request.authContext.accessToken!)
      : listLocalAdminContents();
    return { contents };
  });

  app.put("/admin", { preHandler: app.authenticate }, async (request, reply) => {
    if (!requireContentManager(request, reply)) return;
    const parsed = saveSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message });
    }
    const content = supabaseConfigured
      ? await saveSupabaseLessonContent(request.authContext.accessToken!, request.authContext.id, parsed.data)
      : saveLocalContent(request.authContext.id, parsed.data);
    if (supabaseConfigured) {
      await writeSupabaseAudit(request.authContext.accessToken!, request.authContext.id, "admin.lesson_content.save", content.id, {
        pathId: parsed.data.pathId,
        lessonId: parsed.data.lessonId,
        version: content.draftVersion,
      }).catch((error) => request.log.warn(error, "Content audit failed"));
    }
    return { content };
  });

  app.post("/admin/:documentId/status", { preHandler: app.authenticate }, async (request, reply) => {
    if (!requireContentManager(request, reply)) return;
    const params = documentParamsSchema.safeParse(request.params);
    const body = statusSchema.safeParse(request.body);
    if (!params.success || !body.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: params.error?.issues[0]?.message ?? body.error?.issues[0]?.message });
    }
    if ((body.data.status === "published" || body.data.unpublish) && request.authContext.role !== "admin") {
      return reply.code(403).send({ error: "FORBIDDEN", message: "Seul un administrateur peut publier ou dépublier." });
    }
    let content: LessonContentDocument;
    if (supabaseConfigured) {
      content = await updateSupabaseLessonContentStatus(
        request.authContext.accessToken!,
        request.authContext.id,
        params.data.documentId,
        body.data.status,
        body.data.unpublish,
      );
      await writeSupabaseAudit(request.authContext.accessToken!, request.authContext.id, `admin.lesson_content.${body.data.status}`, content.id, {
        version: content.draftVersion,
        unpublish: body.data.unpublish ?? false,
      }).catch((error) => request.log.warn(error, "Content audit failed"));
    } else {
      const current = database.prepare("SELECT * FROM lesson_contents WHERE id = ?").get(params.data.documentId) as LocalLessonContentRow | undefined;
      if (!current) return reply.code(404).send({ error: "CONTENT_NOT_FOUND", message: "Contenu introuvable." });
      const now = new Date().toISOString();
      const publish = body.data.status === "published";
      const clearPublication = Boolean(body.data.unpublish);
      database.prepare(`
        UPDATE lesson_contents SET
          status = ?,
          published_payload_json = ?,
          published_version = ?,
          published_at = ?,
          updated_by = ?,
          updated_at = ?
        WHERE id = ?
      `).run(
        body.data.status,
        publish ? current.payload_json : clearPublication ? null : current.published_payload_json,
        publish ? current.draft_version : clearPublication ? null : current.published_version,
        publish ? now : clearPublication ? null : current.published_at,
        request.authContext.id,
        now,
        current.id,
      );
      writeAuditLog(request.authContext.id, `admin.lesson_content.${body.data.status}`, current.id, { unpublish: clearPublication });
      content = listLocalAdminContents().find((item) => item.id === current.id)!;
    }
    return { content };
  });

  app.get("/admin/:documentId/revisions", { preHandler: app.authenticate }, async (request, reply) => {
    if (!requireContentManager(request, reply)) return;
    const params = documentParamsSchema.safeParse(request.params);
    if (!params.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: params.error.issues[0]?.message });
    const revisions = supabaseConfigured
      ? await listSupabaseLessonContentRevisions(request.authContext.accessToken!, params.data.documentId)
      : (database.prepare(`
          SELECT lesson_content_revisions.*, users.name AS created_by_name
          FROM lesson_content_revisions
          LEFT JOIN users ON users.id = lesson_content_revisions.created_by
          WHERE document_id = ? ORDER BY version DESC LIMIT 50
        `).all(params.data.documentId) as LocalRevisionRow[]).map(localRevision);
    return { revisions };
  });

  app.post("/admin/:documentId/restore", { preHandler: app.authenticate }, async (request, reply) => {
    if (!requireContentManager(request, reply)) return;
    const params = documentParamsSchema.safeParse(request.params);
    const body = restoreSchema.safeParse(request.body);
    if (!params.success || !body.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: params.error?.issues[0]?.message ?? body.error?.issues[0]?.message });
    }
    let content: LessonContentDocument;
    if (supabaseConfigured) {
      content = await restoreSupabaseLessonContentRevision(request.authContext.accessToken!, request.authContext.id, params.data.documentId, body.data.revisionId);
    } else {
      const restoredContent = database.transaction(() => {
        const current = database.prepare("SELECT * FROM lesson_contents WHERE id = ?").get(params.data.documentId) as LocalLessonContentRow | undefined;
        const revision = database.prepare("SELECT * FROM lesson_content_revisions WHERE id = ? AND document_id = ?")
          .get(body.data.revisionId, params.data.documentId) as LocalRevisionRow | undefined;
        if (!current || !revision) return null;
        const nextVersion = current.draft_version + 1;
        const now = new Date().toISOString();
        database.prepare("UPDATE lesson_contents SET payload_json = ?, status = 'draft', draft_version = ?, updated_by = ?, updated_at = ? WHERE id = ?")
          .run(revision.payload_json, nextVersion, request.authContext.id, now, current.id);
        database.prepare("INSERT INTO lesson_content_revisions (id, document_id, version, payload_json, note, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
          .run(randomUUID(), current.id, nextVersion, revision.payload_json, `Restauration de la version ${revision.version}`, request.authContext.id, now);
        writeAuditLog(request.authContext.id, "admin.lesson_content.restore", current.id, { restoredVersion: revision.version, nextVersion });
        return listLocalAdminContents().find((item) => item.id === current.id)!;
      })() as LessonContentDocument | null;
      if (!restoredContent) return reply.code(404).send({ error: "REVISION_NOT_FOUND", message: "Version introuvable." });
      content = restoredContent;
    }
    return { content };
  });
}
