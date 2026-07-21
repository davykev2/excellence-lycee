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
import { authenticateWithSupabase, supabaseConfigured } from "./supabase.js";

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
          accessToken,
        };
        return;
      } catch {
        return reply.code(401).send({ error: "UNAUTHORIZED", message: "Session invalide ou expirée." });
      }
    }

    try {
      await request.jwtVerify();
      request.authContext = {
        id: request.user.sub,
        email: request.user.email,
        role: request.user.role,
      };
    } catch {
      return reply.code(401).send({ error: "UNAUTHORIZED", message: "Authentification requise." });
    }
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
    return reply.code(publicStatus).send({
      error: "INTERNAL_ERROR",
      message: publicMessage,
    });
  });

  return app;
}
