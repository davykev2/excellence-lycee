import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type {
  ArenaExerciseLevelDocument,
  ArenaExerciseLevelPayload,
  ArenaExerciseStatus,
  PublishedArenaExerciseLevel,
} from "../arenaExercises.js";
import { database, writeAuditLog } from "../database.js";
import {
  listSupabaseEditorArenaExerciseLevels,
  listSupabasePublishedArenaExerciseLevels,
  saveSupabaseArenaExerciseLevel,
  supabaseConfigured,
  updateSupabaseArenaExerciseLevelStatus,
  writeSupabaseAudit,
} from "../supabase.js";

const exerciseSchema = z.object({
  id: z.string().trim().regex(/^[a-zA-Z0-9-]{4,80}$/),
  title: z.string().trim().min(2).max(160),
  statementMarkdown: z.string().trim().min(1).max(25_000),
  correctionMarkdown: z.string().trim().min(1).max(25_000),
});

const payloadSchema = z.object({
  levelId: z.string().regex(/^(seconde|premiere|terminale)-(a|c|d)$/),
  subjectId: z.enum(["mathematics", "physics-chemistry", "french", "english", "svt", "philosophy", "history-geography"]),
  lessonKey: z.string().trim().regex(/^[a-z0-9-]{3,180}$/),
  lessonTitle: z.string().trim().min(2).max(240),
  difficulty: z.enum(["easy", "medium", "hard"]),
  stageNumber: z.number().int().min(1).max(99),
  title: z.string().trim().min(2).max(180),
  instructionsMarkdown: z.string().trim().max(6_000),
  exercises: z.array(exerciseSchema).min(1).max(30),
}).superRefine((payload, context) => {
  if (new Set(payload.exercises.map((exercise) => exercise.id)).size !== payload.exercises.length) {
    context.addIssue({ code: "custom", message: "Chaque exercice doit avoir un identifiant unique." });
  }
});

const saveSchema = z.object({
  documentId: z.string().uuid().optional(),
  payload: payloadSchema,
  note: z.string().trim().max(240).optional(),
});

const listSchema = z.object({
  levelId: z.string().regex(/^(seconde|premiere|terminale)-(a|c|d)$/),
  subjectId: z.string().min(2).max(80),
  lessonKey: z.string().regex(/^[a-z0-9-]{3,180}$/).optional(),
});

const documentParamsSchema = z.object({ documentId: z.string().uuid() });
const statusSchema = z.object({ status: z.enum(["draft", "review", "published"]) });

interface LocalArenaExerciseLevelRow {
  id: string;
  level_id: string;
  subject_id: string;
  lesson_key: string;
  difficulty: "easy" | "medium" | "hard";
  stage_number: number;
  payload_json: string;
  status: ArenaExerciseStatus;
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

function requireContentManager(request: FastifyRequest, reply: FastifyReply) {
  if (request.authContext.role !== "admin" && request.authContext.role !== "content_editor") {
    reply.code(403).send({ error: "FORBIDDEN", message: "Accès à l’atelier d’exercices requis." });
    return false;
  }
  return true;
}

function parsePayload(value: string) {
  return JSON.parse(value) as ArenaExerciseLevelPayload;
}

function localDocument(row: LocalArenaExerciseLevelRow): ArenaExerciseLevelDocument {
  return {
    id: row.id,
    ...parsePayload(row.payload_json),
    status: row.status,
    draftVersion: row.draft_version,
    publishedVersion: row.published_version ?? undefined,
    hasPublishedVersion: Boolean(row.published_payload_json),
    createdBy: row.created_by ?? undefined,
    updatedByName: row.updated_by_name ?? undefined,
    updatedAt: row.updated_at,
    publishedAt: row.published_at ?? undefined,
  };
}

function localDocumentById(documentId: string) {
  return database.prepare(`
    SELECT arena_exercise_levels.*, users.name AS updated_by_name
    FROM arena_exercise_levels
    LEFT JOIN users ON users.id = arena_exercise_levels.updated_by
    WHERE arena_exercise_levels.id = ?
  `).get(documentId) as LocalArenaExerciseLevelRow | undefined;
}

function listLocalEditorDocuments(userId: string, isAdmin: boolean) {
  const rows = database.prepare(`
    SELECT arena_exercise_levels.*, users.name AS updated_by_name
    FROM arena_exercise_levels
    LEFT JOIN users ON users.id = arena_exercise_levels.updated_by
    ${isAdmin ? "" : "WHERE arena_exercise_levels.created_by = ?"}
    ORDER BY arena_exercise_levels.updated_at DESC
  `).all(...(isAdmin ? [] : [userId])) as LocalArenaExerciseLevelRow[];
  return rows.map(localDocument);
}

function listLocalPublished(filters: z.infer<typeof listSchema>) {
  // A contributor can prepare a new draft without hiding the version that is
  // already available to learners. The published copy is deliberately stored
  // apart from the mutable draft.
  const clauses = ["level_id = ?", "subject_id = ?", "published_payload_json IS NOT NULL"];
  const values: string[] = [filters.levelId, filters.subjectId];
  if (filters.lessonKey) {
    clauses.push("lesson_key = ?");
    values.push(filters.lessonKey);
  }
  const rows = database.prepare(`
    SELECT * FROM arena_exercise_levels
    WHERE ${clauses.join(" AND ")}
    ORDER BY lesson_key,
      CASE difficulty WHEN 'easy' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
      stage_number
  `).all(...values) as LocalArenaExerciseLevelRow[];
  return rows.flatMap<PublishedArenaExerciseLevel>((row) => row.published_payload_json
    ? [{
        id: row.id,
        ...parsePayload(row.published_payload_json),
        version: row.published_version ?? row.draft_version,
        publishedAt: row.published_at ?? row.updated_at,
      }]
    : []);
}

function saveLocalDocument(
  actor: { id: string; role: "student" | "teacher" | "content_editor" | "admin" },
  input: z.infer<typeof saveSchema>,
) {
  return database.transaction(() => {
    const target = input.payload;
    const existing = input.documentId
      ? database.prepare("SELECT * FROM arena_exercise_levels WHERE id = ?").get(input.documentId) as LocalArenaExerciseLevelRow | undefined
      : database.prepare(`
          SELECT * FROM arena_exercise_levels
          WHERE level_id = ? AND subject_id = ? AND lesson_key = ? AND difficulty = ? AND stage_number = ?
        `).get(target.levelId, target.subjectId, target.lessonKey, target.difficulty, target.stageNumber) as LocalArenaExerciseLevelRow | undefined;

    if (input.documentId && !existing) throw Object.assign(new Error("Niveau d’exercices introuvable."), { statusCode: 404 });
    if (existing && actor.role !== "admin" && existing.created_by !== actor.id) {
      throw Object.assign(new Error("Ce brouillon appartient à un autre contributeur."), { statusCode: 403 });
    }
    if (existing && (
      existing.level_id !== target.levelId
      || existing.subject_id !== target.subjectId
      || existing.lesson_key !== target.lessonKey
      || existing.difficulty !== target.difficulty
      || existing.stage_number !== target.stageNumber
    )) throw Object.assign(new Error("La cible d’un brouillon existant ne peut pas être déplacée."), { statusCode: 409 });

    const now = new Date().toISOString();
    const documentId = existing?.id ?? randomUUID();
    const version = (existing?.draft_version ?? 0) + 1;
    const payloadJson = JSON.stringify(target);
    if (existing) {
      database.prepare(`
        UPDATE arena_exercise_levels
        SET payload_json = ?, status = 'draft', draft_version = ?, updated_by = ?, updated_at = ?
        WHERE id = ?
      `).run(payloadJson, version, actor.id, now, documentId);
    } else {
      database.prepare(`
        INSERT INTO arena_exercise_levels (
          id, level_id, subject_id, lesson_key, difficulty, stage_number, payload_json,
          status, draft_version, created_by, updated_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?)
      `).run(
        documentId, target.levelId, target.subjectId, target.lessonKey, target.difficulty,
        target.stageNumber, payloadJson, version, actor.id, actor.id, now, now,
      );
    }
    database.prepare(`
      INSERT INTO arena_exercise_level_revisions (id, document_id, version, payload_json, note, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(randomUUID(), documentId, version, payloadJson, input.note ?? "Sauvegarde du brouillon", actor.id, now);
    writeAuditLog(actor.id, "arena.exercise_level.save", documentId, {
      levelId: target.levelId, subjectId: target.subjectId, lessonKey: target.lessonKey,
      difficulty: target.difficulty, stageNumber: target.stageNumber, version,
    });
    return localDocument(localDocumentById(documentId)!);
  })();
}

function setLocalStatus(
  actor: { id: string; role: "student" | "teacher" | "content_editor" | "admin" },
  documentId: string,
  status: ArenaExerciseStatus,
) {
  const existing = database.prepare("SELECT * FROM arena_exercise_levels WHERE id = ?").get(documentId) as LocalArenaExerciseLevelRow | undefined;
  if (!existing) throw Object.assign(new Error("Niveau d’exercices introuvable."), { statusCode: 404 });
  if (actor.role !== "admin" && existing.created_by !== actor.id) throw Object.assign(new Error("Accès refusé."), { statusCode: 403 });
  if (status === "published" && actor.role !== "admin") throw Object.assign(new Error("Seul un administrateur peut publier."), { statusCode: 403 });
  const now = new Date().toISOString();
  const publish = status === "published";
  database.prepare(`
    UPDATE arena_exercise_levels SET status = ?,
      published_payload_json = CASE WHEN ? THEN payload_json ELSE published_payload_json END,
      published_version = CASE WHEN ? THEN draft_version ELSE published_version END,
      published_at = CASE WHEN ? THEN ? ELSE published_at END,
      updated_by = ?, updated_at = ? WHERE id = ?
  `).run(status, publish ? 1 : 0, publish ? 1 : 0, publish ? 1 : 0, now, actor.id, now, documentId);
  writeAuditLog(actor.id, `arena.exercise_level.${status}`, documentId);
  return localDocument(localDocumentById(documentId)!);
}

export async function arenaExerciseRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: app.authenticate }, async (request, reply) => {
    const parsed = listSchema.safeParse(request.query);
    if (!parsed.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message });
    const levels = supabaseConfigured
      ? await listSupabasePublishedArenaExerciseLevels(request.authContext.accessToken!, parsed.data)
      : listLocalPublished(parsed.data);
    return { levels };
  });

  app.get("/editor", { preHandler: app.authenticate }, async (request, reply) => {
    if (!requireContentManager(request, reply)) return;
    const levels = supabaseConfigured
      ? await listSupabaseEditorArenaExerciseLevels(request.authContext.accessToken!)
      : listLocalEditorDocuments(request.authContext.id, request.authContext.role === "admin");
    return { levels };
  });

  app.put("/editor", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 120, timeWindow: "1 hour" } },
  }, async (request, reply) => {
    if (!requireContentManager(request, reply)) return;
    const parsed = saveSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message });
    const level = supabaseConfigured
      ? await saveSupabaseArenaExerciseLevel(request.authContext.accessToken!, parsed.data.documentId, parsed.data.payload, parsed.data.note)
      : saveLocalDocument(request.authContext, parsed.data);
    if (supabaseConfigured) {
      await writeSupabaseAudit(request.authContext.accessToken!, request.authContext.id, "arena.exercise_level.save", level.id, {
        levelId: level.levelId, subjectId: level.subjectId, lessonKey: level.lessonKey,
        difficulty: level.difficulty, stageNumber: level.stageNumber, version: level.draftVersion,
      }).catch((error) => request.log.warn(error, "Arena exercise audit failed"));
    }
    return { level };
  });

  app.post("/editor/:documentId/status", { preHandler: app.authenticate }, async (request, reply) => {
    if (!requireContentManager(request, reply)) return;
    const params = documentParamsSchema.safeParse(request.params);
    const body = statusSchema.safeParse(request.body);
    if (!params.success || !body.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: params.error?.issues[0]?.message ?? body.error?.issues[0]?.message });
    }
    if (body.data.status === "published" && request.authContext.role !== "admin") {
      return reply.code(403).send({ error: "FORBIDDEN", message: "Seul un administrateur peut publier." });
    }
    const level = supabaseConfigured
      ? await updateSupabaseArenaExerciseLevelStatus(request.authContext.accessToken!, params.data.documentId, body.data.status)
      : setLocalStatus(request.authContext, params.data.documentId, body.data.status);
    if (supabaseConfigured) {
      await writeSupabaseAudit(request.authContext.accessToken!, request.authContext.id, `arena.exercise_level.${body.data.status}`, level.id)
        .catch((error) => request.log.warn(error, "Arena exercise status audit failed"));
    }
    return { level };
  });
}
