import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import { config } from "./config.js";
import { authRoutes } from "./routes/auth.js";
import { userRoutes } from "./routes/users.js";
import { progressRoutes } from "./routes/progress.js";
import { leaderboardRoutes } from "./routes/leaderboard.js";
import { contentRoutes } from "./routes/content.js";
import { companionRoutes } from "./routes/companion.js";
import { messageRoutes } from "./routes/messages.js";
import { statsRoutes } from "./routes/stats.js";
import { arenaExerciseRoutes } from "./routes/arenaExercises.js";
import { lessonFeedbackRoutes } from "./routes/lessonFeedback.js";
import { storeRoutes } from "./routes/store.js";
import { bacExamRoutes } from "./routes/bacExam.js";
import { notificationRoutes } from "./routes/notifications.js";
import { homeworkRoutes } from "./routes/homework.js";
import { donationRoutes } from "./routes/donations.js";
import { authenticateWithSupabase, supabaseConfigured } from "./supabase.js";
import { database, type UserRole } from "./database.js";

export async function buildApp() {
  const app = Fastify({ logger: true, trustProxy: config.isProduction });
  await app.register(cors, { origin: config.webOrigin, credentials: true });
  await app.register(cookie);
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(rateLimit, { global: false });
  await app.register(jwt, { secret: config.jwtSecret });

  app.decorateRequest("authContext");

  app.decorate("authenticate", async function authenticate(request, reply) {
    if (supabaseConfigured) {
      const authorization = request.headers.authorization;
      const accessToken = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
      if (!accessToken) {
        return reply.code(401).send({ error: "UNAUTHORIZED", message: "Authentification requise." });
      }
      try {
        const context = await authenticateWithSupabase(accessToken);
        request.authContext = {
          id: context.id,
          email: context.email,
          role: context.role,
          accountType: context.user.accountType,
          levelId: context.user.levelId,
          accessToken,
        };
        return;
      } catch {
        return reply.code(401).send({ error: "UNAUTHORIZED", message: "Session invalide ou expirée." });
      }
    }

    try {
      await request.jwtVerify();
      const profile = database.prepare("SELECT level_id AS levelId, role, audience AS accountType FROM users WHERE id = ?").get(request.user.sub) as {
        levelId: string;
        role: UserRole;
        accountType: "student" | "parent" | "teacher";
      } | undefined;
      if (!profile) {
        return reply.code(401).send({ error: "UNAUTHORIZED", message: "Session invalide ou expirée." });
      }
      request.authContext = {
        id: request.user.sub,
        email: request.user.email,
        role: profile.role,
        accountType: profile.accountType,
        levelId: profile.levelId,
      };
    } catch {
      return reply.code(401).send({ error: "UNAUTHORIZED", message: "Authentification requise." });
    }
  });

  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);
    if (reply.sent) return;
    const statusCode = typeof error === "object" && error && "statusCode" in error && typeof error.statusCode === "number"
      ? error.statusCode
      : 500;
    const publicStatus = statusCode < 500 ? statusCode : 500;
    const publicMessage = publicStatus < 500 && error instanceof Error
      ? error.message
      : "Une erreur interne est survenue.";
    const domainCode = publicStatus < 500 && typeof error === "object" && error && "code" in error
      && typeof error.code === "string" && /^[A-Z][A-Z0-9_]{2,79}$/.test(error.code)
      ? error.code
      : "INTERNAL_ERROR";
    return reply.code(publicStatus).send({
      error: domainCode,
      message: publicMessage,
    });
  });

  app.get("/health", async () => ({ status: "ok", service: "excellence-api", dataProvider: config.dataProvider }));
  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(userRoutes, { prefix: "/users" });
  await app.register(progressRoutes, { prefix: "/progress" });
  await app.register(leaderboardRoutes, { prefix: "/leaderboard" });
  await app.register(contentRoutes, { prefix: "/content" });
  await app.register(companionRoutes, { prefix: "/companion" });
  await app.register(messageRoutes, { prefix: "/messages" });
  await app.register(statsRoutes, { prefix: "/stats" });
  await app.register(arenaExerciseRoutes, { prefix: "/arena-exercises" });
  await app.register(lessonFeedbackRoutes, { prefix: "/lesson-feedback" });
  await app.register(storeRoutes, { prefix: "/store" });
  await app.register(bacExamRoutes, { prefix: "/bac-exams" });
  await app.register(notificationRoutes, { prefix: "/notifications" });
  await app.register(homeworkRoutes, { prefix: "/homeworks" });
  await app.register(donationRoutes, { prefix: "/donations" });

  return app;
}
