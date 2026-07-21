import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { database } from "../database.js";
import {
  getSupabaseClassLeaderboard,
  supabaseConfigured,
  type LeaderboardPeriod,
  type LeaderboardSummary,
} from "../supabase.js";

const leaderboardQuerySchema = z.object({
  period: z.enum(["week", "month", "all-time"]).default("week"),
});

interface ClassMemberRow {
  id: string;
  name: string;
  photoUrl: string | null;
  levelId: string;
}

interface ClassProgressRow {
  userId: string;
  xpAwarded: number;
  completedAt: string;
}

function startOfPeriod(period: LeaderboardPeriod) {
  if (period === "all-time") return null;
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  if (period === "month") {
    start.setUTCDate(1);
    return start;
  }
  const daysSinceMonday = (start.getUTCDay() + 6) % 7;
  start.setUTCDate(start.getUTCDate() - daysSinceMonday);
  return start;
}

function currentStreak(completedAt: string[]) {
  const activeDays = [...new Set(completedAt.map((value) => value.slice(0, 10)))].sort().reverse();
  if (activeDays.length === 0) return 0;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const latest = new Date(`${activeDays[0]}T00:00:00.000Z`);
  const ageInDays = Math.round((today.getTime() - latest.getTime()) / 86_400_000);
  if (ageInDays > 1) return 0;

  let streak = 1;
  let previous = latest;
  for (const day of activeDays.slice(1)) {
    const current = new Date(`${day}T00:00:00.000Z`);
    if (Math.round((previous.getTime() - current.getTime()) / 86_400_000) !== 1) break;
    streak += 1;
    previous = current;
  }
  return streak;
}

function getSqliteClassLeaderboard(userId: string, period: LeaderboardPeriod) {
  const viewer = database.prepare("SELECT level_id AS levelId FROM users WHERE id = ?").get(userId) as { levelId: string } | undefined;
  if (!viewer) return null;

  const members = database.prepare(`
    SELECT id, name, photo_url AS photoUrl, level_id AS levelId
    FROM users
    WHERE level_id = ? AND audience = 'student'
  `).all(viewer.levelId) as ClassMemberRow[];
  const progress = database.prepare(`
    SELECT progress.user_id AS userId, progress.xp_awarded AS xpAwarded, progress.completed_at AS completedAt
    FROM lesson_progress AS progress
    INNER JOIN users ON users.id = progress.user_id
    WHERE users.level_id = ? AND users.audience = 'student'
  `).all(viewer.levelId) as ClassProgressRow[];

  const startsAt = startOfPeriod(period);
  const entries: LeaderboardSummary[] = members.map((member) => {
    const memberProgress = progress.filter((entry) => entry.userId === member.id);
    const periodProgress = startsAt
      ? memberProgress.filter((entry) => new Date(entry.completedAt) >= startsAt)
      : memberProgress;
    return {
      id: member.id,
      name: member.name,
      photoUrl: member.photoUrl ?? undefined,
      score: periodProgress.reduce((sum, entry) => sum + entry.xpAwarded, 0),
      completedLessons: periodProgress.length,
      streakDays: currentStreak(memberProgress.map((entry) => entry.completedAt)),
      rank: 0,
      isCurrentLearner: member.id === userId,
      levelId: member.levelId,
    };
  });

  return entries
    .sort((left, right) => right.score - left.score || right.streakDays - left.streakDays || left.name.localeCompare(right.name, "fr"))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export async function leaderboardRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: app.authenticate }, async (request, reply) => {
    const parsed = leaderboardQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Période de classement invalide." });
    }

    const entries = supabaseConfigured
      ? await getSupabaseClassLeaderboard(request.authContext.accessToken!, parsed.data.period)
      : getSqliteClassLeaderboard(request.authContext.id, parsed.data.period);
    if (!entries) {
      return reply.code(404).send({ error: "PROFILE_NOT_FOUND", message: "Profil introuvable." });
    }

    return {
      period: parsed.data.period,
      levelId: entries[0]?.levelId ?? null,
      entries,
      updatedAt: new Date().toISOString(),
    };
  });
}
