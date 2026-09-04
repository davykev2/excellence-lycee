import { createHmac } from "node:crypto";
import { z } from "zod";

const WAVE_API_BASE_URL = "https://api.wave.com";
const DEFAULT_TIMEOUT_MS = 8_000;

const waveCheckoutSessionSchema = z.object({
  id: z.string().min(1).max(80),
  amount: z.string().regex(/^[1-9]\d*$/).refine((value) => Number.isSafeInteger(Number(value))),
  checkout_status: z.enum(["open", "complete", "expired"]),
  client_reference: z.string().max(255).nullable().optional(),
  currency: z.string().length(3),
  payment_status: z.enum(["processing", "cancelled", "succeeded"]),
  transaction_id: z.string().min(1).max(120).nullable().optional(),
  wave_launch_url: z.string().url(),
  when_completed: z.string().min(1).nullable().optional(),
  when_created: z.string().min(1).optional(),
  when_expires: z.string().min(1).optional(),
}).passthrough();

const waveCheckoutSearchSchema = z.object({
  result: z.array(waveCheckoutSessionSchema),
}).passthrough();

export type WaveCheckoutSession = z.infer<typeof waveCheckoutSessionSchema>;

export type CreateWaveCheckoutInput = {
  amountXof: number;
  clientReference: string;
  successUrl: string;
  errorUrl: string;
};

export type WaveCheckoutClient = {
  searchByClientReference(clientReference: string): Promise<WaveCheckoutSession[]>;
  createCheckout(input: CreateWaveCheckoutInput): Promise<WaveCheckoutSession>;
};

export class WaveCheckoutError extends Error {
  constructor(
    readonly code: "WAVE_UNAVAILABLE" | "WAVE_INVALID_RESPONSE",
    message: string,
    readonly statusCode = 502,
  ) {
    super(message);
    this.name = "WaveCheckoutError";
  }
}

export function validateWaveLaunchUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new WaveCheckoutError("WAVE_INVALID_RESPONSE", "Wave a renvoyé une adresse de paiement invalide.");
  }

  if (
    url.protocol !== "https:"
    || url.hostname !== "pay.wave.com"
    || (url.port !== "" && url.port !== "443")
    || url.username
    || url.password
  ) {
    throw new WaveCheckoutError("WAVE_INVALID_RESPONSE", "Wave a renvoyé une adresse de paiement non autorisée.");
  }

  return url.toString();
}

function parseCheckoutSession(payload: unknown) {
  const parsed = waveCheckoutSessionSchema.safeParse(payload);
  if (!parsed.success) {
    throw new WaveCheckoutError("WAVE_INVALID_RESPONSE", "La réponse reçue de Wave est incomplète.");
  }
  validateWaveLaunchUrl(parsed.data.wave_launch_url);
  return parsed.data;
}

async function parseJsonResponse(response: Response) {
  try {
    return await response.json() as unknown;
  } catch {
    throw new WaveCheckoutError("WAVE_INVALID_RESPONSE", "Wave a renvoyé une réponse illisible.");
  }
}

export function createWaveCheckoutClient(options: {
  apiKey: string;
  signingSecret?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  now?: () => number;
}): WaveCheckoutClient {
  const apiKey = options.apiKey.trim();
  if (!apiKey) throw new Error("Une clé API Wave serveur est requise.");

  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const signingSecret = options.signingSecret?.trim() ?? "";
  const now = options.now ?? Date.now;

  async function request(path: string, init?: RequestInit) {
    try {
      const rawBody = typeof init?.body === "string" ? init.body : "";
      const headers = new Headers(init?.headers);
      headers.set("Accept", "application/json");
      headers.set("Authorization", `Bearer ${apiKey}`);
      if (signingSecret) {
        const timestamp = Math.floor(now() / 1_000);
        const signature = createHmac("sha256", signingSecret)
          .update(`${timestamp}${rawBody}`)
          .digest("hex");
        headers.set("Wave-Signature", `t=${timestamp},v1=${signature}`);
      }
      const response = await fetchImpl(`${WAVE_API_BASE_URL}${path}`, {
        ...init,
        headers,
        signal: init?.signal ?? AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        throw new WaveCheckoutError(
          "WAVE_UNAVAILABLE",
          "Le service de paiement Wave est momentanément indisponible.",
          response.status === 429 ? 503 : 502,
        );
      }
      return await parseJsonResponse(response);
    } catch (error) {
      if (error instanceof WaveCheckoutError) throw error;
      throw new WaveCheckoutError("WAVE_UNAVAILABLE", "Impossible de joindre Wave pour le moment.", 503);
    }
  }

  return {
    async searchByClientReference(clientReference) {
      const query = new URLSearchParams({ client_reference: clientReference });
      const payload = await request(`/v1/checkout/sessions/search?${query.toString()}`);
      const parsed = waveCheckoutSearchSchema.safeParse(payload);
      if (!parsed.success) {
        throw new WaveCheckoutError("WAVE_INVALID_RESPONSE", "La réponse de recherche Wave est incomplète.");
      }
      return parsed.data.result.map(parseCheckoutSession);
    },

    async createCheckout(input) {
      const body = JSON.stringify({
        amount: String(input.amountXof),
        currency: "XOF",
        client_reference: input.clientReference,
        success_url: input.successUrl,
        error_url: input.errorUrl,
      });
      const payload = await request("/v1/checkout/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      return parseCheckoutSession(payload);
    },
  };
}

export function donationStatusFromWave(session: WaveCheckoutSession): "pending" | "paid" | "failed" | "expired" {
  if (session.checkout_status === "complete" && session.payment_status === "succeeded") return "paid";
  if (session.checkout_status === "expired") return "expired";
  if (session.payment_status === "cancelled") return "failed";
  return "pending";
}
