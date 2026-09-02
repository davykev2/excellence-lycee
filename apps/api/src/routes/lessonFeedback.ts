import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";
import { config } from "../config.js";
import { database, writeAuditLog, type UserRole } from "../database.js";
import { getLessonReward } from "../curriculum.js";
import { renderFeedbackReplyEmail, sendEmails } from "../email.js";
import { startSqliteThread } from "./messages.js";
import {
  createSupabaseLessonComment,
  deleteSupabaseLessonComment,
  editSupabaseLessonComment,
  getSupabaseAdminFeedbackFeed,
  getSupabaseLessonFeedback,
  getSupabaseProfileContact,
  recordSupabaseEmailDelivery,
  setSupabaseLessonCommentReaction,
  setSupabaseLessonReaction,
  startSupabaseMessageThread,
  supabaseConfigured,
  writeSupabaseAudit,
} from "../supabase.js";
import {
  commentReactionValues,
  lessonReactionValues,
  type AdminFeedbackItem,
  type CommentReaction,
  type CommentReactionSummary,
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
const commentReactionSchema = z.object({ reaction: z.enum(commentReactionValues).nullable() });
const commentSchema = z.object({ body: z.string().trim().min(1).max(1000) });
const feedQuerySchema = z.object({ limit: z.coerce.number().int().min(1).max(100).optional() });
const feedbackReplySchema = z.object({
  recipientId: z.string().uuid("Destinataire invalide."),
  subject: z.string().trim().min(2, "Ajoute un objet.").max(120),
  /** Message complet déposé dans la conversation privée. */
  body: z.string().trim().min(1, "Écris ton message.").max(2000),
  /** Uniquement les mots de l'administration, cités dans l'e-mail. */
  replyMessage: z.string().trim().min(1).max(2000),
  /** Libellé lisible du niveau concerné, affiché dans l'e-mail. */
  location: z.string().trim().min(1).max(200),
});

interface SqliteFeedRow {
  kind: "comment" | "reaction" | "comment_reaction";
  id: string;
  pathId: string;
  lessonId: string;
  authorId: string | null;
  authorName: string;
  authorPhotoUrl: string | null;
  authorRole: UserRole;
  body: string | null;
  reaction: LessonReaction | CommentReaction | null;
  commentId: string | null;
  commentBody: string | null;
  commentAuthorName: string | null;
  createdAt: string;
}

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

interface SqliteCommentReactionRow {
  commentId: string;
  reaction: CommentReaction;
  count: number;
  adminCount: number;
}

function emptyCommentReactions(): CommentReactionSummary {
  return {
    counts: { like: 0, love: 0, helpful: 0 },
    adminCounts: { like: 0, love: 0, helpful: 0 },
    total: 0,
  };
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
  const commentReactionRows = database.prepare(`
    SELECT reaction.comment_id AS commentId, reaction.reaction,
      SUM(CASE WHEN profile.role <> 'admin' THEN 1 ELSE 0 END) AS count,
      SUM(CASE WHEN profile.role = 'admin' THEN 1 ELSE 0 END) AS adminCount
    FROM lesson_comment_reactions reaction
    JOIN lesson_comments comment ON comment.id = reaction.comment_id
    LEFT JOIN users profile ON profile.id = reaction.user_id
    WHERE comment.path_id = ? AND comment.lesson_id = ?
    GROUP BY reaction.comment_id, reaction.reaction
  `).all(pathId, lessonId) as SqliteCommentReactionRow[];
  const ownCommentReactionRows = database.prepare(`
    SELECT reaction.comment_id AS commentId, reaction.reaction
    FROM lesson_comment_reactions reaction
    JOIN lesson_comments comment ON comment.id = reaction.comment_id
    WHERE reaction.user_id = ? AND comment.path_id = ? AND comment.lesson_id = ?
  `).all(userId, pathId, lessonId) as Array<{ commentId: string; reaction: CommentReaction }>;
  const commentReactions = new Map<string, CommentReactionSummary>();
  commentReactionRows.forEach((row) => {
    const summary = commentReactions.get(row.commentId) ?? emptyCommentReactions();
    summary.counts[row.reaction] = Number(row.count);
    summary.adminCounts[row.reaction] = Number(row.adminCount);
    summary.total += Number(row.count) + Number(row.adminCount);
    commentReactions.set(row.commentId, summary);
  });
  ownCommentReactionRows.forEach((row) => {
    const summary = commentReactions.get(row.commentId) ?? emptyCommentReactions();
    summary.myReaction = row.reaction;
    commentReactions.set(row.commentId, summary);
  });
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
      reactions: commentReactions.get(row.id) ?? emptyCommentReactions(),
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

function sqliteAdminFeed(limit: number): AdminFeedbackItem[] {
  const rows = database.prepare(`
    SELECT * FROM (
      SELECT 'comment' AS kind, c.id AS id, c.path_id AS pathId, c.lesson_id AS lessonId,
        c.author_user_id AS authorId, COALESCE(u.name, 'Utilisateur supprimé') AS authorName,
        u.photo_url AS authorPhotoUrl, COALESCE(u.role, 'student') AS authorRole,
        c.body AS body, NULL AS reaction, NULL AS commentId, NULL AS commentBody,
        NULL AS commentAuthorName, c.created_at AS createdAt
      FROM lesson_comments c
      LEFT JOIN users u ON u.id = c.author_user_id
      WHERE u.role = 'student' AND u.audience = 'student'
      UNION ALL
      SELECT 'reaction' AS kind, r.user_id || ':' || r.path_id || ':' || r.lesson_id AS id,
        r.path_id AS pathId, r.lesson_id AS lessonId, r.user_id AS authorId,
        COALESCE(u.name, 'Utilisateur supprimé') AS authorName, u.photo_url AS authorPhotoUrl,
        COALESCE(u.role, 'student') AS authorRole, NULL AS body, r.reaction AS reaction,
        NULL AS commentId, NULL AS commentBody, NULL AS commentAuthorName, r.updated_at AS createdAt
      FROM lesson_reactions r
      LEFT JOIN users u ON u.id = r.user_id
      WHERE u.role = 'student' AND u.audience = 'student'
      UNION ALL
      SELECT 'comment_reaction' AS kind, r.user_id || ':' || r.comment_id AS id,
        c.path_id AS pathId, c.lesson_id AS lessonId, r.user_id AS authorId,
        COALESCE(u.name, 'Utilisateur supprimé') AS authorName, u.photo_url AS authorPhotoUrl,
        COALESCE(u.role, 'student') AS authorRole, NULL AS body, r.reaction AS reaction,
        r.comment_id AS commentId, c.body AS commentBody,
        COALESCE(comment_author.name, 'Utilisateur supprimé') AS commentAuthorName,
        r.updated_at AS createdAt
      FROM lesson_comment_reactions r
      JOIN lesson_comments c ON c.id = r.comment_id
      LEFT JOIN users u ON u.id = r.user_id
      LEFT JOIN users comment_author ON comment_author.id = c.author_user_id
      WHERE u.role = 'student' AND u.audience = 'student'
    )
    ORDER BY createdAt DESC
    LIMIT ?
  `).all(limit) as SqliteFeedRow[];
  return rows.map((row) => ({
    kind: row.kind,
    id: row.id,
    pathId: row.pathId,
    lessonId: row.lessonId,
    authorId: row.authorId ?? undefined,
    authorName: row.authorName,
    authorPhotoUrl: row.authorPhotoUrl ?? undefined,
    authorRole: row.authorRole,
    body: row.body ?? undefined,
    reaction: row.reaction ?? undefined,
    commentId: row.commentId ?? undefined,
    commentBody: row.commentBody ?? undefined,
    commentAuthorName: row.commentAuthorName ?? undefined,
    createdAt: row.createdAt,
  }));
}

export async function lessonFeedbackRoutes(app: FastifyInstance) {
  // Flux de notifications pour l'administration : réactions et commentaires récents,
  // tous niveaux confondus. Route statique enregistrée avant les routes paramétriques.
  app.get("/admin/feed", { preHandler: app.authenticate }, async (request, reply) => {
    if (request.authContext.role !== "admin" && request.authContext.role !== "content_editor") {
      return reply.code(403).send({ error: "FORBIDDEN", message: "Accès réservé à l’administration." });
    }
    const parsed = feedQuerySchema.safeParse(request.query);
    if (!parsed.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Paramètre invalide." });
    const limit = parsed.data.limit ?? 40;
    const items = supabaseConfigured
      ? await getSupabaseAdminFeedbackFeed(request.authContext.accessToken!, limit)
      : sqliteAdminFeed(limit);
    return { items };
  });

  /**
   * Réponse de l'administration à un avis, depuis la cloche.
   *
   * La conversation privée reste la source de vérité : elle est créée d'abord, et
   * l'e-mail qui la signale est au mieux. Un incident chez Resend ne doit jamais
   * faire croire à l'administration que sa réponse n'est pas partie.
   */
  app.post("/admin/reply", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    if (request.authContext.role !== "admin") {
      return reply.code(403).send({ error: "FORBIDDEN", message: "Accès réservé à l’administration." });
    }
    const parsed = feedbackReplySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message });
    }
    const { recipientId, subject, body, replyMessage, location } = parsed.data;

    const threadInput = { recipientId, subject, body };
    const threadId = supabaseConfigured
      ? await startSupabaseMessageThread(request.authContext.accessToken!, threadInput)
      : startSqliteThread(request.authContext.id, threadInput);
    if (threadId === null) return reply.code(404).send({ error: "RECIPIENT_NOT_FOUND", message: "Destinataire introuvable." });
    if (threadId === false) return reply.code(403).send({ error: "RECIPIENT_NOT_ALLOWED", message: "Tu ne peux pas écrire à ce destinataire." });

    let emailSent = false;
    if (config.emailConfigured) {
      try {
        const contact = supabaseConfigured
          ? await getSupabaseProfileContact(request.authContext.accessToken!, recipientId)
          : (database.prepare("SELECT email, name FROM users WHERE id = ?").get(recipientId) as { email: string; name: string } | undefined) ?? null;

        if (contact?.email) {
          // Le nom de l'administration vient de la base, jamais du client.
          const author = supabaseConfigured
            ? await getSupabaseProfileContact(request.authContext.accessToken!, request.authContext.id)
            : (database.prepare("SELECT email, name FROM users WHERE id = ?").get(request.authContext.id) as { email: string; name: string } | undefined) ?? null;

          const rendered = renderFeedbackReplyEmail({
            name: contact.name,
            adminName: author?.name?.trim() || "L’administration",
            message: replyMessage,
            location,
          });
          const [outcome] = await sendEmails([{
            to: contact.email,
            subject: `Réponse de l’administration — ${location}`.slice(0, 160),
            html: rendered.html,
            text: rendered.text,
          }]);
          emailSent = outcome?.status === "sent";

          if (supabaseConfigured) {
            await recordSupabaseEmailDelivery(
              request.authContext.accessToken!, recipientId, contact.email,
              emailSent ? "sent" : "failed", outcome?.providerMessageId, outcome?.error,
            ).catch((reason) => request.log.warn(reason, "Email delivery log failed"));
          } else {
            database.prepare(`
              INSERT INTO email_deliveries (id, broadcast_id, user_id, kind, email, status, provider_message_id, error, created_at)
              VALUES (?, NULL, ?, 'feedback_reply', ?, ?, ?, ?, ?)
            `).run(
              randomUUID(), recipientId, contact.email, emailSent ? "sent" : "failed",
              outcome?.providerMessageId ?? null, outcome?.error ?? null, new Date().toISOString(),
            );
          }
        }
      } catch (reason) {
        request.log.warn(reason, "Feedback reply email failed");
      }
    }

    return reply.code(201).send({ threadId, emailSent });
  });

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

  app.put("/comments/:commentId/reaction", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 60, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const params = commentIdSchema.safeParse(request.params);
    const body = commentReactionSchema.safeParse(request.body);
    if (!params.success || !body.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Réaction au commentaire invalide." });
    }
    const { commentId } = params.data;
    if (supabaseConfigured) {
      const result = await setSupabaseLessonCommentReaction(
        request.authContext.accessToken!,
        commentId,
        body.data.reaction,
      );
      await writeSupabaseAudit(
        request.authContext.accessToken!,
        request.authContext.id,
        "lesson.comment.reaction",
        commentId,
        { reaction: body.data.reaction },
      ).catch((error) => request.log.warn(error, "Supabase comment reaction audit failed"));
      return result;
    }
    const comment = database.prepare(`
      SELECT path_id AS pathId, lesson_id AS lessonId
      FROM lesson_comments
      WHERE id = ?
    `).get(commentId) as { pathId: string; lessonId: string } | undefined;
    if (!comment) {
      return reply.code(404).send({ error: "COMMENT_NOT_FOUND", message: "Commentaire introuvable." });
    }
    if (!ensurePublishedLevel(comment.pathId, comment.lessonId, reply)) return;
    const current = database.prepare(`
      SELECT reaction FROM lesson_comment_reactions
      WHERE comment_id = ? AND user_id = ?
    `).get(commentId, request.authContext.id) as { reaction: CommentReaction } | undefined;
    if (body.data.reaction === null || body.data.reaction === current?.reaction) {
      database.prepare("DELETE FROM lesson_comment_reactions WHERE comment_id = ? AND user_id = ?")
        .run(commentId, request.authContext.id);
    } else {
      const now = new Date().toISOString();
      database.prepare(`
        INSERT INTO lesson_comment_reactions (comment_id, user_id, reaction, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(comment_id, user_id)
        DO UPDATE SET reaction = excluded.reaction, updated_at = excluded.updated_at
      `).run(commentId, request.authContext.id, body.data.reaction, now, now);
    }
    writeAuditLog(request.authContext.id, "lesson.comment.reaction", commentId, {
      reaction: body.data.reaction,
      pathId: comment.pathId,
      lessonId: comment.lessonId,
    });
    return sqliteFeedback(request.authContext.id, request.authContext.role, comment.pathId, comment.lessonId);
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
