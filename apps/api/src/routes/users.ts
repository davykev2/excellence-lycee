import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { database, publicUser, type UserRow, writeAuditLog } from "../database.js";
import {
  authenticateWithSupabase,
  deleteSupabaseProfilePhoto,
  listSupabaseAdminUsers,
  supabaseConfigured,
  updateSupabaseAdminProfileLevel,
  updateSupabaseAdminProfileRole,
  updateSupabaseProfile,
  uploadSupabaseProfilePhoto,
  writeSupabaseAudit,
} from "../supabase.js";

const validLevels = new Set([
  "seconde-a", "seconde-c", "premiere-a", "premiere-c", "premiere-d",
  "terminale-a", "terminale-c", "terminale-d",
]);

const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  photoUrl: z.string().url().max(500).nullable().optional(),
});

const profilePhotoSchema = z.object({
  dataUrl: z.string().max(2_100_000).regex(/^data:image\/(?:jpeg|png|webp);base64,[a-zA-Z0-9+/=\r\n]+$/, "Image invalide."),
});

const maxProfilePhotoBytes = 1_500_000;

function decodeProfilePhoto(dataUrl: string) {
  const separator = dataUrl.indexOf(",");
  const mimeType = dataUrl.slice(5, dataUrl.indexOf(";")) as "image/jpeg" | "image/png" | "image/webp";
  const bytes = Buffer.from(dataUrl.slice(separator + 1), "base64");
  if (bytes.length === 0 || bytes.length > maxProfilePhotoBytes) throw new Error("La photo optimisée ne doit pas dépasser 1,5 Mo.");
  const validJpeg = mimeType === "image/jpeg" && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const validPng = mimeType === "image/png" && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const validWebp = mimeType === "image/webp" && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  if (!validJpeg && !validPng && !validWebp) throw new Error("Le contenu du fichier image est invalide.");
  return { bytes: new Uint8Array(bytes), mimeType };
}

const adminUpdateLevelSchema = z.object({
  levelId: z.string().refine((value) => validLevels.has(value), "Niveau ou série invalide."),
});

const adminUpdateRoleSchema = z.object({
  role: z.enum(["student", "teacher", "content_editor", "admin"]),
});

const userIdParamsSchema = z.object({
  userId: z.string().uuid("Identifiant utilisateur invalide."),
});

export async function userRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: app.authenticate }, async (request, reply) => {
    if (request.authContext.role !== "admin") {
      return reply.code(403).send({ error: "FORBIDDEN", message: "Accès administrateur requis." });
    }

    if (supabaseConfigured) {
      const users = await listSupabaseAdminUsers(request.authContext.accessToken!);
      return { users };
    }

    const users = database.prepare(`
      SELECT users.*,
        COUNT(lesson_progress.id) AS completed_lessons,
        COALESCE(SUM(lesson_progress.xp_awarded), 0) AS total_xp,
        COALESCE(MAX(lesson_progress.completed_at), users.updated_at) AS last_active_at
      FROM users
      LEFT JOIN lesson_progress ON lesson_progress.user_id = users.id
      GROUP BY users.id
      ORDER BY users.created_at DESC
    `).all() as Array<UserRow & {
      completed_lessons: number;
      total_xp: number;
      last_active_at: string;
    }>;

    return {
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        accountType: user.audience,
        levelId: user.level_id,
        photoUrl: user.photo_url ?? undefined,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastActiveAt: user.last_active_at,
        completedLessons: user.completed_lessons,
        totalXp: user.total_xp,
      })),
    };
  });

  app.patch("/:userId/level", { preHandler: app.authenticate }, async (request, reply) => {
    if (request.authContext.role !== "admin") {
      return reply.code(403).send({ error: "FORBIDDEN", message: "Accès administrateur requis." });
    }
    const params = userIdParamsSchema.safeParse(request.params);
    if (!params.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: params.error.issues[0]?.message });
    }
    const body = adminUpdateLevelSchema.safeParse(request.body);
    if (!body.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: body.error.issues[0]?.message });
    }

    if (supabaseConfigured) {
      const user = await updateSupabaseAdminProfileLevel(
        request.authContext.accessToken!,
        params.data.userId,
        body.data.levelId,
      );
      return { user };
    }

    const now = new Date().toISOString();
    const result = database.prepare("UPDATE users SET level_id = ?, updated_at = ? WHERE id = ?")
      .run(body.data.levelId, now, params.data.userId);
    if (result.changes === 0) {
      return reply.code(404).send({ error: "USER_NOT_FOUND", message: "Profil introuvable." });
    }
    writeAuditLog(request.authContext.id, "admin.profile.level.update", params.data.userId, {
      levelId: body.data.levelId,
    });
    return { user: { id: params.data.userId, levelId: body.data.levelId, updatedAt: now } };
  });

  app.patch("/:userId/role", { preHandler: app.authenticate }, async (request, reply) => {
    if (request.authContext.role !== "admin") {
      return reply.code(403).send({ error: "FORBIDDEN", message: "Accès administrateur requis." });
    }
    const params = userIdParamsSchema.safeParse(request.params);
    const body = adminUpdateRoleSchema.safeParse(request.body);
    if (!params.success || !body.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: params.error?.issues[0]?.message ?? body.error?.issues[0]?.message });
    }
    if (params.data.userId === request.authContext.id && body.data.role !== "admin") {
      return reply.code(400).send({ error: "SELF_DEMOTION_BLOCKED", message: "Tu ne peux pas retirer ton propre accès administrateur." });
    }
    if (supabaseConfigured) {
      const user = await updateSupabaseAdminProfileRole(
        request.authContext.accessToken!,
        params.data.userId,
        body.data.role,
      );
      return { user };
    }

    const now = new Date().toISOString();
    const result = database.prepare("UPDATE users SET role = ?, updated_at = ? WHERE id = ?")
      .run(body.data.role, now, params.data.userId);
    if (result.changes === 0) return reply.code(404).send({ error: "USER_NOT_FOUND", message: "Profil introuvable." });
    writeAuditLog(request.authContext.id, "admin.profile.role.update", params.data.userId, { role: body.data.role });
    return { user: { id: params.data.userId, role: body.data.role, updatedAt: now } };
  });

  app.get("/me", { preHandler: app.authenticate }, async (request, reply) => {
    if (supabaseConfigured) {
      const context = await authenticateWithSupabase(request.authContext.accessToken!);
      return { user: context.user };
    }
    const user = database.prepare("SELECT * FROM users WHERE id = ?").get(request.authContext.id) as UserRow | undefined;
    if (!user) return reply.code(404).send({ error: "USER_NOT_FOUND", message: "Compte introuvable." });
    return { user: publicUser(user) };
  });

  app.post("/me/photo", {
    preHandler: app.authenticate,
    bodyLimit: 2_300_000,
    config: { rateLimit: { max: 10, timeWindow: "1 hour" } },
  }, async (request, reply) => {
    const parsed = profilePhotoSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message });
    let photo: ReturnType<typeof decodeProfilePhoto>;
    try {
      photo = decodeProfilePhoto(parsed.data.dataUrl);
    } catch (error) {
      return reply.code(400).send({ error: "INVALID_PROFILE_PHOTO", message: error instanceof Error ? error.message : "Image invalide." });
    }
    if (supabaseConfigured) {
      const user = await uploadSupabaseProfilePhoto(request.authContext.accessToken!, request.authContext.id, photo);
      await writeSupabaseAudit(request.authContext.accessToken!, request.authContext.id, "profile.photo.update", request.authContext.id, { mimeType: photo.mimeType }).catch((error) => request.log.warn(error, "Supabase audit log failed"));
      return { user };
    }
    const now = new Date().toISOString();
    database.prepare("UPDATE users SET photo_url = ?, updated_at = ? WHERE id = ?").run(parsed.data.dataUrl, now, request.authContext.id);
    const user = database.prepare("SELECT * FROM users WHERE id = ?").get(request.authContext.id) as UserRow;
    writeAuditLog(request.authContext.id, "profile.photo.update", request.authContext.id, { mimeType: photo.mimeType });
    return { user: publicUser(user) };
  });

  app.delete("/me/photo", { preHandler: app.authenticate }, async (request) => {
    if (supabaseConfigured) {
      const user = await deleteSupabaseProfilePhoto(request.authContext.accessToken!, request.authContext.id);
      await writeSupabaseAudit(request.authContext.accessToken!, request.authContext.id, "profile.photo.delete", request.authContext.id).catch((error) => request.log.warn(error, "Supabase audit log failed"));
      return { user };
    }
    const now = new Date().toISOString();
    database.prepare("UPDATE users SET photo_url = NULL, updated_at = ? WHERE id = ?").run(now, request.authContext.id);
    const user = database.prepare("SELECT * FROM users WHERE id = ?").get(request.authContext.id) as UserRow;
    writeAuditLog(request.authContext.id, "profile.photo.delete", request.authContext.id);
    return { user: publicUser(user) };
  });

  app.patch("/me", { preHandler: app.authenticate }, async (request, reply) => {
    const parsed = updateProfileSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message });
    if (supabaseConfigured) {
      const user = await updateSupabaseProfile(request.authContext.accessToken!, request.authContext.id, parsed.data);
      await writeSupabaseAudit(
        request.authContext.accessToken!,
        request.authContext.id,
        "profile.update",
        request.authContext.id,
        { fields: ["name", "photoUrl"] },
      ).catch((error) => request.log.warn(error, "Supabase audit log failed"));
      return { user };
    }
    const now = new Date().toISOString();
    database.prepare("UPDATE users SET name = ?, photo_url = ?, updated_at = ? WHERE id = ?")
      .run(parsed.data.name, parsed.data.photoUrl ?? null, now, request.authContext.id);
    const user = database.prepare("SELECT * FROM users WHERE id = ?").get(request.authContext.id) as UserRow;
    writeAuditLog(request.authContext.id, "profile.update", request.authContext.id, { fields: ["name", "photoUrl"] });
    return { user: publicUser(user) };
  });
}
