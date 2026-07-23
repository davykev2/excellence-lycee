import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";
import { database, writeAuditLog, type UserRole } from "../database.js";
import { getLessonReward } from "../curriculum.js";
import {
  createSupabaseLessonComment,
  deleteSupabaseLessonComment,
  editSupabaseLessonComment,
  getSupabaseLessonFeedback,
  setSupabaseLessonReaction,
  supabaseConfigured,
  writeSupabaseAudit,
} from "../supabase.js";
import {
  lessonReactionValues,
  type LessonFeedbackComment,
  type LessonFeedbackSummary,
  type LessonReaction,
} from "../lessonFeedback.js";

const targetSchema = z.object({
  pathId: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  lessonId: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
});
const commentIdSchema = z.object({ commentId: z.string().uuid() });
const reactionSchema = z.object({ reaction: z.enum(lessonReactionValues).nullable() });
const commentSchema = z.object({ body: z.string().trim().min(1).max(1000) });

interface SqliteCommentRow {
  id: string;
  authorId: string | null;
  authorName: string;
  authorPhotoUrl: string | null;
  authorRole: UserRole;
  body: string;
  createdAt: string;
  updatedAt: string;
}

function ensurePublishedLevel(pathId: string, lessonId: string, reply: FastifyReply) {
  if (getLessonReward(pathId, lessonId) !== undefined) return true;
  reply.code(404).send({
    error: "LESSON_NOT_FOUND",
    message: "Ce niveau n’existe pas dans le programme publié.",
  });
  return false;
}

function sqliteFeedback(userId: string, role: UserRole, pathId: string, lessonId: string): LessonFeedbackSummary {
  const reactionRows = database.prepare(`
    SELECT reaction, COUNT(*) AS count
    FROM lesson_reactions
    WHERE path_id = ? AND lesson_id = ?
    GROUP BY reaction
  `).all(pathId, lessonId) as Array<{ reaction: LessonReaction; count: number }>;
  const counts: Record<LessonReaction, number> = { useful: 0, love: 0, clear: 0, confusing: 0 };
  reactionRows.forEach((row) => { counts[row.reaction] = Number(row.count); });
  const ownReaction = database.prepare(`
    SELECT reaction FROM lesson_reactions
    WHERE user_id = ? AND path_id = ? AND lesson_id = ?
  `).get(userId, pathId, lessonId) as { reaction: LessonReaction } | undefined;
  const commentCount = Number((database.prepare(`
    SELECT COUNT(*) AS count FROM lesson_comments
    WHERE path_id = ? AND lesson_id = ?
  `).get(pathId, lessonId) as { count: number }).count);
  const rows = database.prepare(`
    SELECT c.id, c.author_user_id AS authorId, COALESCE(u.name, 'Utilisateur supprimé') AS authorName,
      u.photo_url AS authorPhotoUrl, COALESCE(u.role, 'student') AS authorRole,
      c.body, c.created_at AS createdAt, c.updated_at AS updatedAt
    FROM lesson_comments c
    LEFT JOIN users u ON u.id = c.author_user_id
    WHERE c.path_id = ? AND c.lesson_id = ?
    ORDER BY c.created_at DESC
    LIMIT 50
  `).all(pathId, lessonId) as SqliteCommentRow[];
  const comments: LessonFeedbackComment[] = rows.map((row) => {
    const isMine = row.authorId === userId;
    return {
      id: row.id,
      authorId: row.authorId ?? undefined,
      authorName: row.authorName,
      authorPhotoUrl: row.authorPhotoUrl ?? undefined,
      authorRole: row.authorRole,
      body: row.body,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt === row.createdAt ? undefined : row.updatedAt,
      isMine,
      canEdit: isMine,
      canDelete: isMine || role === "admin",
    };
  });
  return {
    reactions: {
      counts,
      total: Object.values(counts).reduce((sum, value) => sum + value, 0),
      myReaction: ownReaction?.reaction,
    },
    comments,
    commentCount,
  };
}

export async function lessonFeedbackRoutes(app: FastifyInstance) {
  app.get("/:pathId/:lessonId", { preHandler: app.authenticate }, async (request, reply) => {
    const parsed = targetSchema.safeParse(request.params);
    if (!parsed.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Niveau invalide." });
    const { pathId, lessonId } = parsed.data;
    if (!ensurePublishedLevel(pathId, lessonId, reply)) return;
    if (supabaseConfigured) {
      return getSupabaseLessonFeedback(request.authContext.accessToken!, pathId, lessonId);
    }
    return sqliteFeedback(request.authContext.id, request.authContext.role, pathId, lessonId);
  });

  app.put("/:pathId/:lessonId/reaction", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 60, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const target = targetSchema.safeParse(request.params);
    const body = reactionSchema.safeParse(request.body);
    if (!target.success || !body.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Réaction invalide." });
    }
    const { pathId, lessonId } = target.data;
    if (!ensurePublishedLevel(pathId, lessonId, reply)) return;
    if (supabaseConfigured) {
      const result = await setSupabaseLessonReaction(request.authContext.accessToken!, pathId, lessonId, body.data.reaction);
      await writeSupabaseAudit(request.authContext.accessToken!, request.authContext.id, "lesson.reaction", lessonId, {
        pathId,
        reaction: body.data.reaction,
      }).catch((error) => request.log.warn(error, "Supabase feedback audit failed"));
      return result;
    }
    const current = database.prepare(`
      SELECT reaction FROM lesson_reactions WHERE user_id = ? AND path_id = ? AND lesson_id = ?
    `).get(request.authContext.id, pathId, lessonId) as { reaction: LessonReaction } | undefined;
    if (body.data.reaction === null || body.data.reaction === current?.reaction) {
      database.prepare("DELETE FROM lesson_reactions WHERE user_id = ? AND path_id = ? AND lesson_id = ?")
        .run(request.authContext.id, pathId, lessonId);
    } else {
      const now = new Date().toISOString();
      database.prepare(`
        INSERT INTO lesson_reactions (user_id, path_id, lesson_id, reaction, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, path_id, lesson_id)
        DO UPDATE SET reaction = excluded.reaction, updated_at = excluded.updated_at
      `).run(request.authContext.id, pathId, lessonId, body.data.reaction, now, now);
    }
    writeAuditLog(request.authContext.id, "lesson.reaction", lessonId, { pathId, reaction: body.data.reaction });
    return sqliteFeedback(request.authContext.id, request.authContext.role, pathId, lessonId);
  });

  app.post("/:pathId/:lessonId/comments", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 12, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const target = targetSchema.safeParse(request.params);
    const body = commentSchema.safeParse(request.body);
    if (!target.success || !body.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Le commentaire doit contenir entre 1 et 1 000 caractères." });
    }
    const { pathId, lessonId } = target.data;
    if (!ensurePublishedLevel(pathId, lessonId, reply)) return;
    if (supabaseConfigured) {
      await createSupabaseLessonComment(request.authContext.accessToken!, pathId, lessonId, body.data.body);
      await writeSupabaseAudit(request.authContext.accessToken!, request.authContext.id, "lesson.comment.create", lessonId, { pathId })
        .catch((error) => request.log.warn(error, "Supabase feedback audit failed"));
      return reply.code(201).send(await getSupabaseLessonFeedback(request.authContext.accessToken!, pathId, lessonId));
    }
    const id = randomUUID();
    const now = new Date().toISOString();
    database.prepare(`
      INSERT INTO lesson_comments (id, path_id, lesson_id, author_user_id, body, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, pathId, lessonId, request.authContext.id, body.data.body, now, now);
    writeAuditLog(request.authContext.id, "lesson.comment.create", id, { pathId, lessonId });
    return reply.code(201).send(sqliteFeedback(request.authContext.id, request.authContext.role, pathId, lessonId));
  });

  app.patch("/comments/:commentId", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const params = commentIdSchema.safeParse(request.params);
    const body = commentSchema.safeParse(request.body);
    if (!params.success || !body.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Commentaire invalide." });
    }
    if (supabaseConfigured) {
      const updated = await editSupabaseLessonComment(request.authContext.accessToken!, params.data.commentId, body.data.body);
      if (!updated) return reply.code(404).send({ error: "COMMENT_NOT_FOUND", message: "Commentaire introuvable ou non modifiable." });
      return { updated: true };
    }
    const comment = database.prepare("SELECT author_user_id AS authorId FROM lesson_comments WHERE id = ?")
      .get(params.data.commentId) as { authorId: string } | undefined;
    if (!comment || comment.authorId !== request.authContext.id) {
      return reply.code(404).send({ error: "COMMENT_NOT_FOUND", message: "Commentaire introuvable ou non modifiable." });
    }
    database.prepare("UPDATE lesson_comments SET body = ?, updated_at = ? WHERE id = ?")
      .run(body.data.body, new Date().toISOString(), params.data.commentId);
    writeAuditLog(request.authContext.id, "lesson.comment.edit", params.data.commentId);
    return { updated: true };
  });

  app.delete("/comments/:commentId", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const params = commentIdSchema.safeParse(request.params);
    if (!params.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Commentaire invalide." });
    if (supabaseConfigured) {
      const deleted = await deleteSupabaseLessonComment(request.authContext.accessToken!, params.data.commentId);
      if (!deleted) return reply.code(404).send({ error: "COMMENT_NOT_FOUND", message: "Commentaire introuvable ou non supprimable." });
      await writeSupabaseAudit(
        request.authContext.accessToken!,
        request.authContext.id,
        "lesson.comment.delete",
        params.data.commentId,
      ).catch((error) => request.log.warn(error, "Supabase feedback audit failed"));
    } else {
      const comment = database.prepare("SELECT author_user_id AS authorId FROM lesson_comments WHERE id = ?")
        .get(params.data.commentId) as { authorId: string } | undefined;
      if (!comment || (comment.authorId !== request.authContext.id && request.authContext.role !== "admin")) {
        return reply.code(404).send({ error: "COMMENT_NOT_FOUND", message: "Commentaire introuvable ou non supprimable." });
      }
      database.prepare("DELETE FROM lesson_comments WHERE id = ?").run(params.data.commentId);
      writeAuditLog(request.authContext.id, "lesson.comment.delete", params.data.commentId);
    }
    return reply.code(204).send();
  });
}
