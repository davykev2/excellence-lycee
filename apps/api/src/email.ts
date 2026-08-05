import { createHmac, timingSafeEqual } from "node:crypto";
import { config } from "./config.js";

/**
 * Envoi d'e-mails par Resend, appelé directement en HTTP comme la voix de Davy
 * appelle ElevenLabs — aucun SDK à embarquer.
 *
 * Tout est inerte tant que `config.emailConfigured` est faux : Resend exige un
 * domaine vérifié, et le projet n'en a pas encore. Les appelants doivent donc
 * toujours tester `emailConfigured` et rendre un refus explicite plutôt que de
 * laisser filer une erreur générique.
 */

const RESEND_BATCH_URL = "https://api.resend.com/emails/batch";
/** Limite du point d'entrée batch de Resend. */
const BATCH_SIZE = 100;
/** Resend limite à 2 requêtes/seconde : on laisse une marge entre deux lots. */
const DELAY_BETWEEN_BATCHES_MS = 600;
const MAX_ATTEMPTS = 3;

/** Cibles proposées dans l'écran de diffusion. */
export type EmailAudience = "students" | "students-and-parents" | "everyone";

export const emailAudiences: EmailAudience[] = ["students", "students-and-parents", "everyone"];

export interface BroadcastRecipient {
  id: string;
  email: string;
  name: string;
}

export interface OutgoingEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
}

export interface SendOutcome {
  to: string;
  status: "sent" | "failed";
  providerMessageId?: string;
  error?: string;
}

const wait = (ms: number) => new Promise((done) => setTimeout(done, ms));

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function sendOneBatch(batch: OutgoingEmail[]): Promise<SendOutcome[]> {
  const payload = batch.map((message) => ({
    from: config.emailFrom,
    to: [message.to],
    subject: message.subject,
    html: message.html,
    text: message.text,
    ...(config.emailReplyTo ? { reply_to: config.emailReplyTo } : {}),
    ...(message.headers ? { headers: message.headers } : {}),
  }));

  let lastError = "Envoi impossible.";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    let response: Response;
    try {
      response = await fetch(RESEND_BATCH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.resendApiKey}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30_000),
      });
    } catch (reason) {
      lastError = reason instanceof Error ? reason.message : "Réseau indisponible.";
      if (attempt < MAX_ATTEMPTS) await wait(DELAY_BETWEEN_BATCHES_MS * attempt);
      continue;
    }

    if (response.ok) {
      const body = await response.json().catch(() => null) as { data?: { id?: string }[] } | null;
      // Resend renvoie les identifiants dans l'ordre d'envoi.
      return batch.map((message, index) => ({
        to: message.to,
        status: "sent" as const,
        providerMessageId: body?.data?.[index]?.id,
      }));
    }

    lastError = (await response.text().catch(() => "")).slice(0, 300) || `HTTP ${response.status}`;

    // 429 = quota atteint (le plan gratuit plafonne à 100 e-mails/jour), 5xx =
    // incident passager : dans les deux cas une nouvelle tentative a du sens.
    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt === MAX_ATTEMPTS) break;

    const retryAfter = Number(response.headers.get("retry-after"));
    await wait(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : DELAY_BETWEEN_BATCHES_MS * attempt * 2);
  }

  return batch.map((message) => ({ to: message.to, status: "failed" as const, error: lastError }));
}

/**
 * Envoie les messages par lots. Ne lève jamais : un échec partiel est une
 * information à journaliser et à présenter, pas une exception à propager.
 */
export async function sendEmails(messages: OutgoingEmail[]): Promise<SendOutcome[]> {
  if (!config.emailConfigured) {
    return messages.map((message) => ({
      to: message.to,
      status: "failed" as const,
      error: "Envoi d'e-mails non configuré.",
    }));
  }

  const outcomes: SendOutcome[] = [];
  const batches = chunk(messages, BATCH_SIZE);
  for (const [index, batch] of batches.entries()) {
    if (index > 0) await wait(DELAY_BETWEEN_BATCHES_MS);
    outcomes.push(...await sendOneBatch(batch));
  }
  return outcomes;
}

/* --------------------------------------------------------------------------
 * Désabonnement : jeton signé, sans table ni expiration à gérer.
 * ----------------------------------------------------------------------- */

function signature(userId: string) {
  return createHmac("sha256", config.jwtSecret).update(`unsubscribe:${userId}`).digest("base64url");
}

export function buildUnsubscribeUrl(userId: string) {
  const token = `${Buffer.from(userId).toString("base64url")}.${signature(userId)}`;
  return `${config.publicWebUrl.replace(/\/+$/, "")}/api/notifications/unsubscribe?token=${encodeURIComponent(token)}`;
}

export function readUnsubscribeToken(token: string): string | null {
  const [encodedId, provided] = token.split(".");
  if (!encodedId || !provided) return null;
  let userId: string;
  try {
    userId = Buffer.from(encodedId, "base64url").toString("utf8");
  } catch {
    return null;
  }
  if (!userId) return null;

  const expected = Buffer.from(signature(userId));
  const candidate = Buffer.from(provided);
  if (expected.length !== candidate.length) return null;
  return timingSafeEqual(expected, candidate) ? userId : null;
}

/* --------------------------------------------------------------------------
 * Gabarits — ivoire et marine de la direction « Cap Ivoire ».
 * ----------------------------------------------------------------------- */

const NAVY = "#0a2b62";
const IVORY = "#fffdf9";
const ORANGE = "#fb6b16";
const MUTED = "#5b6b86";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraphs(body: string) {
  return escapeHtml(body)
    .split(/\n{2,}/)
    .map((block) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${NAVY}">${block.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function shell(inner: string, footer: string) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:24px 12px;background:#f2efe7;font-family:'Segoe UI',Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:${IVORY};border-radius:18px;overflow:hidden;border:1px solid #e4ddcf">
    <tr><td style="background:${NAVY};padding:18px 24px">
      <span style="color:${IVORY};font-size:17px;font-weight:700;letter-spacing:0.2px">Excellence Lycée</span>
    </td></tr>
    <tr><td style="padding:26px 24px">${inner}</td></tr>
    <tr><td style="padding:16px 24px 22px;border-top:1px solid #e9e2d5;font-size:12px;line-height:1.5;color:${MUTED}">${footer}</td></tr>
  </table>
</body></html>`;
}

function button(url: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px 0"><tr><td style="background:${ORANGE};border-radius:12px">
    <a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 22px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none">${escapeHtml(label)}</a>
  </td></tr></table>`;
}

export function renderBroadcastEmail(input: { name: string; subject: string; body: string; unsubscribeUrl: string }) {
  const firstName = input.name.trim().split(/\s+/)[0] || input.name.trim() || "à toi";
  const appUrl = config.publicWebUrl;
  const html = shell(
    `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${NAVY}">Bonjour ${escapeHtml(firstName)},</p>
     ${paragraphs(input.body)}
     ${button(appUrl, "Ouvrir Excellence Lycée")}`,
    `Tu reçois ce message parce que tu as un compte sur Excellence Lycée.<br />
     <a href="${escapeHtml(input.unsubscribeUrl)}" style="color:${MUTED}">Ne plus recevoir les annonces</a>`,
  );
  const text = [
    `Bonjour ${firstName},`,
    "",
    input.body,
    "",
    `Ouvrir Excellence Lycée : ${appUrl}`,
    "",
    `Ne plus recevoir les annonces : ${input.unsubscribeUrl}`,
  ].join("\n");
  return { html, text };
}

export function renderFeedbackReplyEmail(input: {
  name: string;
  adminName: string;
  message: string;
  location: string;
}) {
  const firstName = input.name.trim().split(/\s+/)[0] || input.name.trim() || "à toi";
  const inboxUrl = `${config.publicWebUrl}/messages`;
  const html = shell(
    `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${NAVY}">Bonjour ${escapeHtml(firstName)},</p>
     <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${NAVY}">
       L'administration a répondu à l'avis que tu as laissé sur <strong>${escapeHtml(input.location)}</strong>.
     </p>
     <blockquote style="margin:0 0 14px;padding:12px 16px;background:#f7f2e7;border-left:3px solid ${ORANGE};font-size:14px;line-height:1.6;color:${NAVY}">
       ${escapeHtml(input.message).replace(/\n/g, "<br />")}
     </blockquote>
     ${button(inboxUrl, "Voir dans ma boîte de réception")}
     <p style="margin:0;font-size:13px;line-height:1.6;color:${MUTED}">— ${escapeHtml(input.adminName)}, administration Excellence Lycée</p>`,
    "Ce message t'est envoyé parce que tu as laissé un avis sur une leçon. Il ne s'agit pas d'une annonce générale.",
  );
  const text = [
    `Bonjour ${firstName},`,
    "",
    `L'administration a répondu à l'avis que tu as laissé sur ${input.location}.`,
    "",
    input.message,
    "",
    `Voir dans ma boîte de réception : ${inboxUrl}`,
    "",
    `— ${input.adminName}, administration Excellence Lycée`,
  ].join("\n");
  return { html, text };
}
