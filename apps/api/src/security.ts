import { createHash, randomBytes, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import type { FastifyInstance, FastifyReply } from "fastify";
import { config } from "./config.js";
import { database, type UserRow } from "./database.js";

export const refreshCookieName = "excellence_refresh";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

function hashRefreshToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createRefreshToken(userId: string) {
  const token = randomBytes(48).toString("base64url");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + config.refreshTokenDays * 24 * 60 * 60 * 1000);
  database.prepare(`
    INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(randomUUID(), userId, hashRefreshToken(token), expiresAt.toISOString(), now.toISOString());
  return token;
}

export function findRefreshSession(token: string) {
  return database.prepare(`
    SELECT refresh_tokens.id AS refresh_id, refresh_tokens.user_id, refresh_tokens.expires_at,
      refresh_tokens.revoked_at, users.*
    FROM refresh_tokens
    JOIN users ON users.id = refresh_tokens.user_id
    WHERE refresh_tokens.token_hash = ?
  `).get(hashRefreshToken(token)) as (UserRow & {
    refresh_id: string;
    user_id: string;
    expires_at: string;
    revoked_at: string | null;
  }) | undefined;
}

export function rotateRefreshToken(refreshId: string, userId: string) {
  return database.transaction(() => {
    database.prepare("UPDATE refresh_tokens SET revoked_at = ? WHERE id = ?").run(new Date().toISOString(), refreshId);
    return createRefreshToken(userId);
  })();
}

export function revokeRefreshToken(token: string) {
  database.prepare("UPDATE refresh_tokens SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL")
    .run(new Date().toISOString(), hashRefreshToken(token));
}

export function revokeAllUserSessions(userId: string) {
  database.prepare("UPDATE refresh_tokens SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL")
    .run(new Date().toISOString(), userId);
}

export function setRefreshCookie(reply: FastifyReply, token: string) {
  reply.setCookie(refreshCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.isProduction,
    path: "/",
    maxAge: config.refreshTokenDays * 24 * 60 * 60,
  });
}

export function clearRefreshCookie(reply: FastifyReply) {
  reply.clearCookie(refreshCookieName, { path: "/" });
}

export function signAccessToken(app: FastifyInstance, user: UserRow) {
  return app.jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    { expiresIn: config.accessTokenTtl },
  );
}
