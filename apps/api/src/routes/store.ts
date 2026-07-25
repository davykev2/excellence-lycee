import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { database, writeAuditLog } from "../database.js";
import { GOLD_XP_RATE, storeItems } from "../storeCatalog.js";
import {
  getSupabaseStoreWallet,
  purchaseSupabaseStoreItem,
  supabaseConfigured,
  writeSupabaseAudit,
} from "../supabase.js";

const purchaseSchema = z.object({
  itemId: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
});

function getSqliteWallet(userId: string) {
  const { totalXp } = database
    .prepare("SELECT COALESCE(SUM(xp_awarded), 0) AS totalXp FROM lesson_progress WHERE user_id = ?")
    .get(userId) as { totalXp: number };
  const { spent } = database
    .prepare("SELECT COALESCE(SUM(price_paid), 0) AS spent FROM store_purchases WHERE user_id = ?")
    .get(userId) as { spent: number };
  const owned = database
    .prepare("SELECT item_id AS itemId FROM store_purchases WHERE user_id = ?")
    .all(userId) as Array<{ itemId: string }>;
  return {
    goldBalance: Math.floor(totalXp / GOLD_XP_RATE) - spent,
    goldSpent: spent,
    totalXp,
    ownedItemIds: owned.map((row) => row.itemId),
  };
}

export async function storeRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: app.authenticate }, async (request) => {
    const wallet = supabaseConfigured
      ? await getSupabaseStoreWallet(request.authContext.accessToken!)
      : getSqliteWallet(request.authContext.id);
    return { ...wallet, goldRate: GOLD_XP_RATE, items: storeItems };
  });

  app.post("/purchase", { preHandler: app.authenticate }, async (request, reply) => {
    const parsed = purchaseSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Article invalide." });
    }
    const { itemId } = parsed.data;

    if (supabaseConfigured) {
      const result = await purchaseSupabaseStoreItem(request.authContext.accessToken!, itemId);
      await writeSupabaseAudit(
        request.authContext.accessToken!,
        request.authContext.id,
        "store.purchase",
        itemId,
        { goldBalance: result.goldBalance },
      ).catch((error) => request.log.warn(error, "Supabase audit log failed"));
      return reply.code(201).send(result);
    }

    const item = database
      .prepare("SELECT price FROM store_items WHERE id = ? AND active = 1")
      .get(itemId) as { price: number } | undefined;
    if (!item) {
      return reply.code(404).send({ error: "ITEM_NOT_FOUND", message: "Article introuvable dans la boutique." });
    }
    const owned = database
      .prepare("SELECT 1 FROM store_purchases WHERE user_id = ? AND item_id = ?")
      .get(request.authContext.id, itemId);
    if (owned) {
      return reply.code(409).send({ error: "ALREADY_OWNED", message: "Tu possèdes déjà cet article." });
    }
    const wallet = getSqliteWallet(request.authContext.id);
    if (wallet.goldBalance < item.price) {
      return reply.code(400).send({ error: "INSUFFICIENT_GOLD", message: "Solde d’or insuffisant." });
    }
    database
      .prepare("INSERT INTO store_purchases (id, user_id, item_id, price_paid, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(randomUUID(), request.authContext.id, itemId, item.price, new Date().toISOString());
    writeAuditLog(request.authContext.id, "store.purchase", itemId, { price: item.price });
    return reply.code(201).send({ goldBalance: wallet.goldBalance - item.price, itemId });
  });
}
