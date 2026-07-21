import { randomUUID } from "node:crypto";
import { database, type UserRow } from "../database.js";
import { hashPassword } from "../security.js";

const email = process.env.ADMIN_EMAIL?.trim().toLocaleLowerCase("fr");
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim() || "Administration Excellence";

if (!email || !password || password.length < 12) {
  throw new Error("Définissez ADMIN_EMAIL et un ADMIN_PASSWORD d’au moins 12 caractères.");
}

const existing = database.prepare("SELECT id FROM users WHERE email = ?").get(email) as { id: string } | undefined;
const now = new Date().toISOString();
const passwordHash = await hashPassword(password);

if (existing) {
  database.prepare("UPDATE users SET role = 'admin', password_hash = ?, updated_at = ? WHERE id = ?")
    .run(passwordHash, now, existing.id);
  console.log(`Compte administrateur mis à jour : ${email}`);
} else {
  const user: UserRow = {
    id: randomUUID(), email, password_hash: passwordHash, name, role: "admin", audience: "teacher", level_id: "seconde-c",
    photo_url: null, email_verified_at: now, created_at: now, updated_at: now,
  };
  database.prepare(`
    INSERT INTO users (id, email, password_hash, name, role, audience, level_id, photo_url, email_verified_at, created_at, updated_at)
    VALUES (@id, @email, @password_hash, @name, @role, @audience, @level_id, @photo_url, @email_verified_at, @created_at, @updated_at)
  `).run(user);
  console.log(`Compte administrateur créé : ${email}`);
}
