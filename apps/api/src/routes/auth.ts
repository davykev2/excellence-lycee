import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";
import { database, publicUser, type UserRow, writeAuditLog } from "../database.js";
import {
  clearRefreshCookie,
  createRefreshToken,
  findRefreshSession,
  hashPassword,
  refreshCookieName,
  revokeAllUserSessions,
  revokeRefreshToken,
  rotateRefreshToken,
  setRefreshCookie,
  signAccessToken,
  verifyPassword,
} from "../security.js";
import {
  loginWithSupabase,
  logoutFromSupabase,
  changeSupabasePassword,
  confirmSupabasePasswordReset,
  refreshWithSupabase,
  registerWithSupabase,
  requestSupabasePasswordReset,
  SupabaseOperationError,
  supabaseConfigured,
} from "../supabase.js";

const validLevels = new Set([
  "seconde-a", "seconde-c", "premiere-a", "premiere-c", "premiere-d",
  "terminale-a", "terminale-c", "terminale-d",
]);

const passwordSchema = z.string().min(10).max(128)
  .regex(/[a-z]/, "Le mot de passe doit contenir une minuscule.")
  .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule.")
  .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre.");

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(180),
  password: passwordSchema,
  levelId: z.string().refine((value) => validLevels.has(value), "Niveau ou série invalide."),
  accountType: z.enum(["student", "parent", "teacher"]),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(128),
});

const passwordResetRequestSchema = z.object({
  email: z.string().trim().email().max(180),
});

const passwordResetConfirmSchema = z.object({
  accessToken: z.string().min(40).max(4096),
  password: passwordSchema,
});

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  password: passwordSchema,
});

function invalidPayload(reply: FastifyReply, error: z.ZodError) {
  return reply.code(400).send({
    error: "VALIDATION_ERROR",
    message: error.issues[0]?.message ?? "Informations invalides.",
    fields: error.flatten().fieldErrors,
  });
}

function supabaseFailure(reply: FastifyReply, error: unknown) {
  if (!(error instanceof SupabaseOperationError)) {
    return reply.code(500).send({ error: "SUPABASE_ERROR", message: "Le service d’authentification est momentanément indisponible." });
  }
  const normalized = `${error.code ?? ""} ${error.message}`.toLocaleLowerCase("fr");
  if (normalized.includes("already") || normalized.includes("registered") || normalized.includes("exists")) {
    return reply.code(409).send({ error: "EMAIL_EXISTS", message: "Un compte utilise déjà cette adresse e-mail." });
  }
  if (normalized.includes("invalid login") || normalized.includes("invalid credentials")) {
    return reply.code(401).send({ error: "INVALID_CREDENTIALS", message: "Adresse e-mail ou mot de passe incorrect." });
  }
  if (normalized.includes("email not confirmed")) {
    return reply.code(403).send({ error: "EMAIL_NOT_CONFIRMED", message: "Confirme d’abord ton adresse e-mail, puis reconnecte-toi." });
  }
  const status = error.status >= 400 && error.status < 500 ? error.status : 500;
  return reply.code(status).send({
    error: error.code ?? "SUPABASE_ERROR",
    message: status < 500 ? error.message : "Le service d’authentification est momentanément indisponible.",
  });
}

function bearerToken(authorization: string | undefined) {
  return authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : undefined;
}

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", { config: { rateLimit: { max: 8, timeWindow: "1 minute" } } }, async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body);
    if (!parsed.success) return invalidPayload(reply, parsed.error);

    if (supabaseConfigured) {
      try {
        const result = await registerWithSupabase(parsed.data);
        if (result.emailConfirmationRequired) {
          return reply.code(202).send({ emailConfirmationRequired: true, email: result.email });
        }
        setRefreshCookie(reply, result.refreshToken);
        return reply.code(201).send({ accessToken: result.accessToken, user: result.user });
      } catch (error) {
        return supabaseFailure(reply, error);
      }
    }

    const email = parsed.data.email.toLocaleLowerCase("fr");
    const exists = database.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (exists) return reply.code(409).send({ error: "EMAIL_EXISTS", message: "Un compte utilise déjà cette adresse e-mail." });

    const now = new Date().toISOString();
    const user: UserRow = {
      id: randomUUID(),
      email,
      password_hash: await hashPassword(parsed.data.password),
      name: parsed.data.name,
      role: parsed.data.accountType === "teacher" ? "teacher" : "student",
      audience: parsed.data.accountType,
      level_id: parsed.data.levelId,
      photo_url: null,
      email_verified_at: null,
      created_at: now,
      updated_at: now,
    };

    database.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, audience, level_id, photo_url, email_verified_at, created_at, updated_at)
      VALUES (@id, @email, @password_hash, @name, @role, @audience, @level_id, @photo_url, @email_verified_at, @created_at, @updated_at)
    `).run(user);

    const refreshToken = createRefreshToken(user.id);
    setRefreshCookie(reply, refreshToken);
    writeAuditLog(user.id, "auth.register", user.id, { accountType: user.audience });
    return reply.code(201).send({ accessToken: signAccessToken(app, user), user: publicUser(user) });
  });

  app.post("/login", { config: { rateLimit: { max: 10, timeWindow: "1 minute" } } }, async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) return invalidPayload(reply, parsed.error);
    if (supabaseConfigured) {
      try {
        const result = await loginWithSupabase(parsed.data.email, parsed.data.password);
        setRefreshCookie(reply, result.refreshToken);
        return { accessToken: result.accessToken, user: result.user };
      } catch (error) {
        return supabaseFailure(reply, error);
      }
    }
    const user = database.prepare("SELECT * FROM users WHERE email = ?").get(parsed.data.email.toLocaleLowerCase("fr")) as UserRow | undefined;
    if (!user || !(await verifyPassword(parsed.data.password, user.password_hash))) {
      return reply.code(401).send({ error: "INVALID_CREDENTIALS", message: "Adresse e-mail ou mot de passe incorrect." });
    }
    const refreshToken = createRefreshToken(user.id);
    setRefreshCookie(reply, refreshToken);
    writeAuditLog(user.id, "auth.login", user.id);
    return { accessToken: signAccessToken(app, user), user: publicUser(user) };
  });

  app.post("/password-reset/request", {
    config: { rateLimit: { max: 4, timeWindow: "15 minutes" } },
  }, async (request, reply) => {
    const parsed = passwordResetRequestSchema.safeParse(request.body);
    if (!parsed.success) return invalidPayload(reply, parsed.error);

    if (!supabaseConfigured) {
      return reply.code(503).send({
        error: "PASSWORD_RESET_UNAVAILABLE",
        message: "La récupération du mot de passe est momentanément indisponible.",
      });
    }

    try {
      await requestSupabasePasswordReset(parsed.data.email.toLocaleLowerCase("fr"));
      // Réponse volontairement identique, que le compte existe ou non.
      return reply.code(202).send({
        message: "Si un compte utilise cette adresse, un lien de récupération vient d’être envoyé.",
      });
    } catch (error) {
      request.log.error(error, "Password recovery email failed");
      return reply.code(503).send({
        error: "PASSWORD_RESET_UNAVAILABLE",
        message: "Le lien n’a pas pu être envoyé pour le moment. Réessaie dans quelques minutes.",
      });
    }
  });

  app.post("/password-reset/confirm", {
    config: { rateLimit: { max: 8, timeWindow: "15 minutes" } },
  }, async (request, reply) => {
    const parsed = passwordResetConfirmSchema.safeParse(request.body);
    if (!parsed.success) return invalidPayload(reply, parsed.error);

    if (!supabaseConfigured) {
      return reply.code(503).send({
        error: "PASSWORD_RESET_UNAVAILABLE",
        message: "La récupération du mot de passe est momentanément indisponible.",
      });
    }

    try {
      await confirmSupabasePasswordReset(parsed.data.accessToken, parsed.data.password);
      clearRefreshCookie(reply);
      return reply.code(200).send({ message: "Ton mot de passe a été modifié. Tu peux maintenant te connecter." });
    } catch (error) {
      request.log.warn(error, "Password recovery confirmation failed");
      return reply.code(400).send({
        error: "PASSWORD_RECOVERY_LINK_INVALID",
        message: "Ce lien de récupération est invalide ou expiré. Demande un nouveau lien.",
      });
    }
  });

  app.post("/password/change", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 6, timeWindow: "15 minutes" } },
  }, async (request, reply) => {
    const parsed = passwordChangeSchema.safeParse(request.body);
    if (!parsed.success) return invalidPayload(reply, parsed.error);
    if (parsed.data.currentPassword === parsed.data.password) {
      return reply.code(400).send({
        error: "PASSWORD_UNCHANGED",
        message: "Le nouveau mot de passe doit être différent de l’actuel.",
      });
    }

    const { email } = request.authContext;

    if (supabaseConfigured) {
      try {
        await changeSupabasePassword(email, parsed.data.currentPassword, parsed.data.password, request.authContext.id);
      } catch (error) {
        if (error instanceof SupabaseOperationError && error.code === "INVALID_CURRENT_PASSWORD") {
          return reply.code(401).send({
            error: "INVALID_CURRENT_PASSWORD",
            message: "Le mot de passe actuel est incorrect.",
          });
        }
        return supabaseFailure(reply, error);
      }
      clearRefreshCookie(reply);
      return reply.code(200).send({ message: "Ton mot de passe a été modifié. Reconnecte-toi avec le nouveau." });
    }

    const user = database.prepare("SELECT * FROM users WHERE id = ?").get(request.authContext.id) as UserRow | undefined;
    if (!user || !(await verifyPassword(parsed.data.currentPassword, user.password_hash))) {
      return reply.code(401).send({
        error: "INVALID_CURRENT_PASSWORD",
        message: "Le mot de passe actuel est incorrect.",
      });
    }

    database
      .prepare("UPDATE users SET password_hash = ? WHERE id = ?")
      .run(await hashPassword(parsed.data.password), user.id);
    revokeAllUserSessions(user.id);
    writeAuditLog(user.id, "auth.password.change", user.id);
    clearRefreshCookie(reply);
    return reply.code(200).send({ message: "Ton mot de passe a été modifié. Reconnecte-toi avec le nouveau." });
  });

  app.post("/refresh", { config: { rateLimit: { max: 30, timeWindow: "1 minute" } } }, async (request, reply) => {
    const token = request.cookies[refreshCookieName];
    if (!token) return reply.code(401).send({ error: "SESSION_REQUIRED", message: "Session absente." });
    if (supabaseConfigured) {
      try {
        const result = await refreshWithSupabase(token);
        setRefreshCookie(reply, result.refreshToken);
        return { accessToken: result.accessToken, user: result.user };
      } catch {
        clearRefreshCookie(reply);
        return reply.code(401).send({ error: "SESSION_EXPIRED", message: "La session a expiré." });
      }
    }
    const session = findRefreshSession(token);
    if (!session) {
      clearRefreshCookie(reply);
      return reply.code(401).send({ error: "SESSION_INVALID", message: "Session invalide." });
    }
    if (session.revoked_at) {
      revokeAllUserSessions(session.user_id);
      clearRefreshCookie(reply);
      return reply.code(401).send({ error: "SESSION_REUSED", message: "La session a été révoquée par sécurité." });
    }
    if (new Date(session.expires_at).getTime() <= Date.now()) {
      revokeRefreshToken(token);
      clearRefreshCookie(reply);
      return reply.code(401).send({ error: "SESSION_EXPIRED", message: "La session a expiré." });
    }
    const nextToken = rotateRefreshToken(session.refresh_id, session.user_id);
    setRefreshCookie(reply, nextToken);
    return { accessToken: signAccessToken(app, session), user: publicUser(session) };
  });

  app.post("/logout", async (request, reply) => {
    const token = request.cookies[refreshCookieName];
    if (supabaseConfigured) {
      await logoutFromSupabase(bearerToken(request.headers.authorization), token);
      clearRefreshCookie(reply);
      return reply.code(204).send();
    }
    if (token) revokeRefreshToken(token);
    clearRefreshCookie(reply);
    return reply.code(204).send();
  });
}
