import type { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";
import { config } from "../config.js";
import {
  createWaveCheckoutClient,
  donationStatusFromWave,
  validateWaveLaunchUrl,
  WaveCheckoutError,
  type WaveCheckoutClient,
  type WaveCheckoutSession,
} from "../waveCheckout.js";

export const DONATION_MIN_AMOUNT_XOF = 100;
export const DONATION_MAX_AMOUNT_XOF = 1_000_000;
export const DONATION_SUGGESTED_AMOUNTS_XOF = [500, 1_000, 2_000, 5_000, 10_000] as const;

const donationBodySchema = z.object({
  requestId: z.string().uuid(),
  amountXof: z.number().int().min(DONATION_MIN_AMOUNT_XOF).max(DONATION_MAX_AMOUNT_XOF),
}).strict();

const donationReferencePattern = /^excellence-lycee-donation-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const donationParamsSchema = z.object({
  reference: z.string().regex(donationReferencePattern),
}).strict();

type DonationRoutesOptions = {
  client?: WaveCheckoutClient;
  configured?: boolean;
  publicWebUrl?: string;
};

type CheckoutResult = { session: WaveCheckoutSession; created: boolean };

class DonationRouteError extends Error {
  constructor(readonly statusCode: number, readonly code: string, message: string) {
    super(message);
    this.name = "DonationRouteError";
  }
}

function donationReference(requestId: string) {
  return `excellence-lycee-donation-${requestId.toLowerCase()}`;
}

function resolveHttpsOrigin(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

function redirectUrls(origin: string, reference: string) {
  const success = new URL("/soutenir", origin);
  success.searchParams.set("donation", "success");
  success.searchParams.set("reference", reference);
  const error = new URL("/soutenir", origin);
  error.searchParams.set("donation", "error");
  error.searchParams.set("reference", reference);
  return { successUrl: success.toString(), errorUrl: error.toString() };
}

function selectExactSession(sessions: WaveCheckoutSession[], reference: string) {
  const exact = sessions.filter((session) => session.client_reference === reference);
  return exact.find((session) => donationStatusFromWave(session) === "paid")
    ?? exact.find((session) => donationStatusFromWave(session) === "pending")
    ?? exact[0];
}

function validateSessionAmount(session: WaveCheckoutSession, amountXof: number) {
  if (session.currency !== "XOF" || Number(session.amount) !== amountXof) {
    throw new DonationRouteError(
      409,
      "DONATION_REFERENCE_CONFLICT",
      "Cette demande de don existe déjà avec un autre montant.",
    );
  }
}

function sendCheckoutError(app: FastifyInstance, reply: FastifyReply, error: unknown) {
  if (error instanceof DonationRouteError || error instanceof WaveCheckoutError) {
    app.log.warn({ code: error.code, statusCode: error.statusCode }, "Échec sécurisé du paiement Wave");
    return reply.code(error.statusCode).send({ error: error.code, message: error.message });
  }
  app.log.error({ err: error }, "Échec inattendu du paiement Wave");
  return reply.code(500).send({ error: "INTERNAL_ERROR", message: "Une erreur interne est survenue." });
}

export async function donationRoutes(app: FastifyInstance, options: DonationRoutesOptions = {}) {
  const publicOrigin = resolveHttpsOrigin(options.publicWebUrl ?? config.publicWebUrl);
  const client = options.client ?? (config.waveConfigured
    ? createWaveCheckoutClient({
      apiKey: config.waveApiKey,
      signingSecret: config.waveApiSigningSecret,
    })
    : undefined);
  const available = (options.configured ?? config.waveConfigured) && Boolean(client) && Boolean(publicOrigin);
  const inFlight = new Map<string, { amountXof: number; promise: Promise<CheckoutResult> }>();

  app.get("/config", {
    config: { rateLimit: { max: 120, timeWindow: "1 minute" } },
  }, async (_request, reply) => {
    reply.header("Cache-Control", "no-store");
    return {
      available,
      currency: "XOF" as const,
      suggestedAmounts: [...DONATION_SUGGESTED_AMOUNTS_XOF],
      minAmount: DONATION_MIN_AMOUNT_XOF,
      maxAmount: DONATION_MAX_AMOUNT_XOF,
    };
  });

  app.post("/checkout", {
    config: { rateLimit: { max: 5, timeWindow: "10 minutes" } },
  }, async (request, reply) => {
    reply.header("Cache-Control", "no-store");
    const body = donationBodySchema.safeParse(request.body);
    if (!body.success) {
      return reply.code(400).send({
        error: "VALIDATION_ERROR",
        message: `Le montant doit être un entier compris entre ${DONATION_MIN_AMOUNT_XOF} et ${DONATION_MAX_AMOUNT_XOF} F CFA.`,
      });
    }
    if (!available || !client || !publicOrigin) {
      return reply.code(503).send({
        error: "WAVE_NOT_CONFIGURED",
        message: "Les dons Wave ne sont pas encore disponibles.",
      });
    }

    const reference = donationReference(body.data.requestId);
    const running = inFlight.get(reference);
    if (running && running.amountXof !== body.data.amountXof) {
      return reply.code(409).send({
        error: "DONATION_REFERENCE_CONFLICT",
        message: "Cette demande de don est déjà utilisée avec un autre montant.",
      });
    }

    const promise = running?.promise ?? (async (): Promise<CheckoutResult> => {
      const sessions = await client.searchByClientReference(reference);
      const existing = selectExactSession(sessions, reference);
      if (existing) {
        validateSessionAmount(existing, body.data.amountXof);
        return { session: existing, created: false };
      }

      const urls = redirectUrls(publicOrigin, reference);
      const session = await client.createCheckout({
        amountXof: body.data.amountXof,
        clientReference: reference,
        ...urls,
      });
      if (session.client_reference !== reference) {
        throw new WaveCheckoutError("WAVE_INVALID_RESPONSE", "Wave n’a pas confirmé la référence du don.");
      }
      validateSessionAmount(session, body.data.amountXof);
      return { session, created: true };
    })();

    if (!running) {
      inFlight.set(reference, { amountXof: body.data.amountXof, promise });
      void promise.finally(() => {
        if (inFlight.get(reference)?.promise === promise) inFlight.delete(reference);
      }).catch(() => undefined);
    }

    try {
      const result = await promise;
      const waveLaunchUrl = validateWaveLaunchUrl(result.session.wave_launch_url);
      return reply.code(result.created ? 201 : 200).send({ reference, waveLaunchUrl });
    } catch (error) {
      return sendCheckoutError(app, reply, error);
    }
  });

  app.get("/:reference/status", {
    config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    reply.header("Cache-Control", "no-store");
    const params = donationParamsSchema.safeParse(request.params);
    if (!params.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Référence de don invalide." });
    }
    if (!available || !client) {
      return reply.code(503).send({
        error: "WAVE_NOT_CONFIGURED",
        message: "Les dons Wave ne sont pas encore disponibles.",
      });
    }

    try {
      const sessions = await client.searchByClientReference(params.data.reference);
      const session = selectExactSession(sessions, params.data.reference);
      if (!session) {
        return reply.code(404).send({ error: "DONATION_NOT_FOUND", message: "Ce don est introuvable." });
      }

      const result: {
        status: "pending" | "paid" | "failed" | "expired";
        amountXof?: number;
        currency?: string;
        transactionId?: string;
        completedAt?: string;
      } = {
        status: donationStatusFromWave(session),
        amountXof: Number(session.amount),
        currency: session.currency,
      };
      if (session.transaction_id) result.transactionId = session.transaction_id;
      if (session.when_completed) result.completedAt = session.when_completed;
      return result;
    } catch (error) {
      return sendCheckoutError(app, reply, error);
    }
  });
}
