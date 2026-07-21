import type { FastifyInstance } from "fastify";
import { database } from "../database.js";
import { getSupabasePublicStats, supabaseConfigured } from "../supabase.js";

export async function statsRoutes(app: FastifyInstance) {
  app.get("/public", {
    config: { rateLimit: { max: 60, timeWindow: "1 minute" } },
  }, async (_request, reply) => {
    const stats = supabaseConfigured
      ? await getSupabasePublicStats()
      : {
          registeredUsers: Number((database.prepare("SELECT COUNT(*) AS count FROM users").get() as { count: number }).count),
        };

    reply.header("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return stats;
  });
}

