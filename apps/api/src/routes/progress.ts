import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { database, writeAuditLog } from "../database.js";
import { getLessonReward } from "../curriculum.js";
import {
  getSupabaseProgress,
  submitSupabaseLevelAttempt,
  supabaseConfigured,
  writeSupabaseAudit,
} from "../supabase.js";

const attemptSchema = z.object({
  pathId: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  lessonId: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  scoreOutOf20: z.number().int().min(0).max(20),
});

interface StoredProgress {
  id: string;
  xpAwarded: number;
  bestScore: number;
  attemptCount: number;
}

export async function progressRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: app.authenticate }, async (request) => {
    if (supabaseConfigured) return getSupabaseProgress(request.authContext.accessToken!, request.authContext.id);
    const lessons = database.prepare(`
      SELECT path_id AS pathId, lesson_id AS lessonId, xp_awarded AS xpAwarded,
        best_score AS bestScore, attempt_count AS attemptCount, completed_at AS completedAt
      FROM lesson_progress WHERE user_id = ? ORDER BY completed_at ASC
    `).all(request.authContext.id);
    const totals = database.prepare(`
      SELECT COUNT(*) AS completedLessons, COALESCE(SUM(xp_awarded), 0) AS totalXp
      FROM lesson_progress WHERE user_id = ?
    `).get(request.authContext.id);
    return { lessons, totals };
  });

  app.post("/attempt", { preHandler: app.authenticate }, async (request, reply) => {
    const parsed = attemptSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Résultat de niveau invalide." });
    const { pathId, lessonId, scoreOutOf20 } = parsed.data;
    const lessonReward = getLessonReward(pathId, lessonId);
    if (lessonReward === undefined) return reply.code(404).send({ error: "LESSON_NOT_FOUND", message: "Ce niveau n’existe pas dans le programme publié." });

    if (supabaseConfigured) {
      const result = await submitSupabaseLevelAttempt(request.authContext.accessToken!, pathId, lessonId, scoreOutOf20);
      await writeSupabaseAudit(
        request.authContext.accessToken!,
        request.authContext.id,
        "level.attempt",
        lessonId,
        { pathId, scoreOutOf20, xpDelta: result.xpDelta, bestScore: result.bestScore },
      ).catch((error) => request.log.warn(error, "Supabase audit log failed"));
      return reply.code(result.xpDelta > 0 ? 201 : 200).send(result);
    }

    const existing = database.prepare(`
      SELECT id, xp_awarded AS xpAwarded, best_score AS bestScore, attempt_count AS attemptCount
      FROM lesson_progress WHERE user_id = ? AND path_id = ? AND lesson_id = ?
    `).get(request.authContext.id, pathId, lessonId) as StoredProgress | undefined;
    const desiredXp = scoreOutOf20 === 20 ? lessonReward : scoreOutOf20 >= 10 ? Math.floor(lessonReward / 2) : 0;
    const nextBestScore = Math.max(existing?.bestScore ?? 0, scoreOutOf20);
    const nextAttemptCount = (existing?.attemptCount ?? 0) + 1;

    if (existing) {
      const nextXp = Math.max(existing.xpAwarded, desiredXp);
      const xpDelta = nextXp - existing.xpAwarded;
      database.prepare("UPDATE lesson_progress SET xp_awarded = ?, best_score = ?, attempt_count = ? WHERE id = ?")
        .run(nextXp, nextBestScore, nextAttemptCount, existing.id);
      writeAuditLog(request.authContext.id, "level.attempt", lessonId, { pathId, scoreOutOf20, xpDelta, bestScore: nextBestScore });
      return {
        passed: scoreOutOf20 >= 10,
        improved: xpDelta > 0,
        xpDelta,
        xpAwarded: nextXp,
        bestScore: nextBestScore,
        attemptCount: nextAttemptCount,
      };
    }

    if (scoreOutOf20 < 10) {
      writeAuditLog(request.authContext.id, "level.attempt", lessonId, { pathId, scoreOutOf20, xpDelta: 0 });
      return { passed: false, improved: false, xpDelta: 0, xpAwarded: 0, bestScore: scoreOutOf20, attemptCount: 1 };
    }

    const id = randomUUID();
    database.prepare(`
      INSERT INTO lesson_progress (id, user_id, path_id, lesson_id, xp_awarded, best_score, attempt_count, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?)
    `).run(id, request.authContext.id, pathId, lessonId, desiredXp, scoreOutOf20, new Date().toISOString());
    writeAuditLog(request.authContext.id, "level.attempt", lessonId, { pathId, scoreOutOf20, xpDelta: desiredXp, bestScore: scoreOutOf20 });
    return reply.code(201).send({ passed: true, improved: true, xpDelta: desiredXp, xpAwarded: desiredXp, bestScore: scoreOutOf20, attemptCount: 1 });
  });
}
