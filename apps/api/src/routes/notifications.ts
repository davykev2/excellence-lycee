import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { config } from "../config.js";
import { database } from "../database.js";
import {
  buildUnsubscribeUrl,
  emailAudiences,
  escapeHtml,
  readUnsubscribeToken,
  renderBroadcastEmail,
  sendEmails,
  type BroadcastRecipient,
  type EmailAudience,
  type SendOutcome,
} from "../email.js";
import {
  countSupabaseBroadcastAudience,
  getSupabaseBroadcastAudience,
  listSupabaseBroadcasts,
  recordSupabaseBroadcast,
  supabaseConfigured,
  unsubscribeSupabaseProfile,
} from "../supabase.js";

const audienceSchema = z.object({
  audience: z.enum(["students", "students-and-parents", "everyone"]),
});

const broadcastSchema = z.object({
  audience: z.enum(["students", "students-and-parents", "everyone"]),
  subject: z.string().trim().min(3).max(160),
  body: z.string().trim().min(10).max(5000),
  // Verrou anti-envoi accidentel : le client renvoie le nombre qu'il a affiché,
  // le serveur recalcule et refuse si la cible a bougé entre-temps.
  confirmRecipientCount: z.number().int().min(1),
});

const unsubscribeSchema = z.object({
  token: z.string().trim().min(8).max(512),
});

/* -------------------------------------------------------------------------
 * Repli SQLite — mêmes filtres que les fonctions Supabase.
 * ---------------------------------------------------------------------- */

function sqliteAudienceClause(audience: EmailAudience) {
  if (audience === "students") return "role = 'student' AND audience = 'student'";
  if (audience === "students-and-parents") return "role = 'student'";
  return "1 = 1";
}

function sqliteAudience(audience: EmailAudience): BroadcastRecipient[] {
  return database.prepare(`
    SELECT id, email, name FROM users
    WHERE email_opt_out = 0 AND email IS NOT NULL AND email <> '' AND ${sqliteAudienceClause(audience)}
    ORDER BY created_at
  `).all() as BroadcastRecipient[];
}

function sqliteAudienceCount(audience: EmailAudience): number {
  const row = database.prepare(`
    SELECT COUNT(*) AS total FROM users
    WHERE email_opt_out = 0 AND email IS NOT NULL AND email <> '' AND ${sqliteAudienceClause(audience)}
  `).get() as { total: number };
  return row.total;
}

function sqliteRecordBroadcast(
  actorUserId: string,
  audience: EmailAudience,
  subject: string,
  body: string,
  recipients: BroadcastRecipient[],
  outcomes: SendOutcome[],
) {
  const broadcastId = randomUUID();
  const now = new Date().toISOString();
  const sent = outcomes.filter((outcome) => outcome.status === "sent").length;

  database.transaction(() => {
    database.prepare(`
      INSERT INTO email_broadcasts (id, actor_user_id, audience, subject, body, recipient_count, sent_count, failed_count, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(broadcastId, actorUserId, audience, subject, body, recipients.length, sent, outcomes.length - sent, now);

    const insertDelivery = database.prepare(`
      INSERT INTO email_deliveries (id, broadcast_id, user_id, kind, email, status, provider_message_id, error, created_at)
      VALUES (?, ?, ?, 'broadcast', ?, ?, ?, ?, ?)
    `);
    outcomes.forEach((outcome, index) => {
      insertDelivery.run(
        randomUUID(), broadcastId, recipients[index]?.id ?? null, outcome.to,
        outcome.status, outcome.providerMessageId ?? null, outcome.error ?? null, now,
      );
    });
  })();

  return broadcastId;
}

function sqliteBroadcastHistory(limit: number) {
  return database.prepare(`
    SELECT b.id, b.audience, b.subject, b.recipient_count AS recipientCount,
           b.sent_count AS sentCount, b.failed_count AS failedCount,
           COALESCE(u.name, 'Administration') AS authorName, b.created_at AS createdAt
    FROM email_broadcasts b
    LEFT JOIN users u ON u.id = b.actor_user_id
    ORDER BY b.created_at DESC
    LIMIT ?
  `).all(limit);
}

function sqliteUnsubscribe(userId: string) {
  const result = database.prepare("UPDATE users SET email_opt_out = 1 WHERE id = ?").run(userId);
  return result.changes > 0;
}

/* -------------------------------------------------------------------------
 * Page de confirmation du désabonnement (rendue par l'API, sans session).
 * ---------------------------------------------------------------------- */

function unsubscribePage(title: string, message: string) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(title)} — Excellence Lycée</title></head>
<body style="margin:0;padding:48px 16px;background:#f2efe7;font-family:'Segoe UI',Helvetica,Arial,sans-serif">
  <div style="max-width:520px;margin:0 auto;background:#fffdf9;border:1px solid #e4ddcf;border-radius:18px;overflow:hidden">
    <div style="background:#0a2b62;padding:18px 24px;color:#fffdf9;font-size:17px;font-weight:700">Excellence Lycée</div>
    <div style="padding:26px 24px;color:#0a2b62">
      <h1 style="margin:0 0 12px;font-size:19px">${escapeHtml(title)}</h1>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.6">${escapeHtml(message)}</p>
      <a href="${escapeHtml(config.publicWebUrl)}" style="display:inline-block;padding:12px 22px;background:#fb6b16;color:#fff;border-radius:12px;font-weight:700;text-decoration:none">Retour à Excellence Lycée</a>
    </div>
  </div>
</body></html>`;
}

export async function notificationRoutes(app: FastifyInstance) {
  const requireAdmin = (role: string) => role === "admin";

  app.get("/status", { preHandler: app.authenticate }, async (request, reply) => {
    if (!requireAdmin(request.authContext.role)) {
      return reply.code(403).send({ error: "FORBIDDEN", message: "Accès réservé à l’administration." });
    }
    return {
      configured: config.emailConfigured,
      from: config.emailConfigured ? config.emailFrom : null,
      publicWebUrl: config.publicWebUrl,
    };
  });

  app.get("/audience", { preHandler: app.authenticate }, async (request, reply) => {
    if (!requireAdmin(request.authContext.role)) {
      return reply.code(403).send({ error: "FORBIDDEN", message: "Accès réservé à l’administration." });
    }
    const parsed = audienceSchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Cible de diffusion inconnue." });
    }
    const count = supabaseConfigured
      ? await countSupabaseBroadcastAudience(request.authContext.accessToken!, parsed.data.audience)
      : sqliteAudienceCount(parsed.data.audience);
    return { audience: parsed.data.audience, count };
  });

  app.get("/history", { preHandler: app.authenticate }, async (request, reply) => {
    if (!requireAdmin(request.authContext.role)) {
      return reply.code(403).send({ error: "FORBIDDEN", message: "Accès réservé à l’administration." });
    }
    const items = supabaseConfigured
      ? await listSupabaseBroadcasts(request.authContext.accessToken!, 10)
      : sqliteBroadcastHistory(10);
    return { items };
  });

  app.post("/broadcast", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 3, timeWindow: "1 hour" } },
  }, async (request, reply) => {
    if (!requireAdmin(request.authContext.role)) {
      return reply.code(403).send({ error: "FORBIDDEN", message: "Accès réservé à l’administration." });
    }
    const parsed = broadcastSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: "VALIDATION_ERROR",
        message: "Le sujet doit faire au moins 3 caractères et le message au moins 10.",
      });
    }
    if (!config.emailConfigured) {
      return reply.code(503).send({
        error: "EMAIL_NOT_CONFIGURED",
        message: "L’envoi d’e-mails n’est pas encore activé : il faut d’abord vérifier un domaine d’expédition.",
      });
    }

    const { audience, subject, body, confirmRecipientCount } = parsed.data;
    const recipients = supabaseConfigured
      ? await getSupabaseBroadcastAudience(request.authContext.accessToken!, audience)
      : sqliteAudience(audience);

    // Le verrou : la liste a pu changer entre l'affichage et la validation.
    if (recipients.length !== confirmRecipientCount) {
      return reply.code(409).send({
        error: "RECIPIENT_COUNT_MISMATCH",
        message: `La cible a changé depuis l’affichage : ${recipients.length} destinataire(s) au lieu de ${confirmRecipientCount}. Vérifie puis reconfirme.`,
        actualCount: recipients.length,
      });
    }
    if (recipients.length === 0) {
      return reply.code(400).send({ error: "EMPTY_AUDIENCE", message: "Aucun destinataire pour cette cible." });
    }

    const outcomes = await sendEmails(recipients.map((recipient) => {
      const unsubscribeUrl = buildUnsubscribeUrl(recipient.id);
      const rendered = renderBroadcastEmail({ name: recipient.name, subject, body, unsubscribeUrl });
      return {
        to: recipient.email,
        subject,
        html: rendered.html,
        text: rendered.text,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      };
    }));

    const deliveries = outcomes.map((outcome, index) => ({
      userId: recipients[index]?.id ?? null,
      email: outcome.to,
      status: outcome.status,
      providerMessageId: outcome.providerMessageId ?? null,
      error: outcome.error ?? null,
    }));

    if (supabaseConfigured) {
      await recordSupabaseBroadcast(
        request.authContext.accessToken!, audience, subject, body, recipients.length, deliveries,
      );
    } else {
      sqliteRecordBroadcast(request.authContext.id, audience, subject, body, recipients, outcomes);
    }

    const sent = outcomes.filter((outcome) => outcome.status === "sent").length;
    const failed = outcomes.length - sent;
    request.log.info({ audience, sent, failed }, "Email broadcast finished");
    return { recipientCount: recipients.length, sent, failed };
  });

  // Lien des e-mails : ni session, ni jeton d'API. Le GET sert au clic humain,
  // le POST au « one-click » que Gmail déclenche depuis l'en-tête List-Unsubscribe.
  const handleUnsubscribe = async (
    rawToken: unknown,
    reply: { code: (status: number) => { type: (value: string) => { send: (payload: string) => unknown } } },
  ) => {
    const parsed = unsubscribeSchema.safeParse({ token: rawToken });
    const userId = parsed.success ? readUnsubscribeToken(parsed.data.token) : null;
    if (!userId) {
      return reply.code(400).type("text/html; charset=utf-8").send(
        unsubscribePage("Lien invalide", "Ce lien de désabonnement n’est pas valide ou a été tronqué par ta messagerie."),
      );
    }
    if (supabaseConfigured) {
      await unsubscribeSupabaseProfile(userId);
    } else {
      sqliteUnsubscribe(userId);
    }
    return reply.code(200).type("text/html; charset=utf-8").send(
      unsubscribePage(
        "C’est fait",
        "Tu ne recevras plus les annonces par e-mail. Les réponses de l’administration à tes propres avis continueront de t’être envoyées.",
      ),
    );
  };

  app.get("/unsubscribe", async (request, reply) =>
    handleUnsubscribe((request.query as { token?: string }).token, reply as never));

  app.post("/unsubscribe", async (request, reply) =>
    handleUnsubscribe(
      (request.query as { token?: string }).token ?? (request.body as { token?: string } | undefined)?.token,
      reply as never,
    ));

  app.get("/audiences", { preHandler: app.authenticate }, async (request, reply) => {
    if (!requireAdmin(request.authContext.role)) {
      return reply.code(403).send({ error: "FORBIDDEN", message: "Accès réservé à l’administration." });
    }
    return { audiences: emailAudiences };
  });
}
