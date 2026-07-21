import { createHash } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { config } from "../config.js";

const speechSchema = z.object({
  text: z.string().trim().min(1).max(800),
});

const audioCache = new Map<string, Buffer>();
const maxCachedMessages = 128;

function cacheKey(text: string) {
  return createHash("sha256")
    .update(`${config.davyVoiceId}:${config.davyVoiceModelId}:${text}`)
    .digest("hex");
}

function rememberAudio(key: string, audio: Buffer) {
  if (audioCache.size >= maxCachedMessages) {
    const oldestKey = audioCache.keys().next().value;
    if (oldestKey) audioCache.delete(oldestKey);
  }
  audioCache.set(key, audio);
}

export async function companionRoutes(app: FastifyInstance) {
  app.get("/voice", { preHandler: app.authenticate }, async () => ({
    available: config.davyVoiceConfigured,
    voice: config.davyVoiceConfigured ? "davy-official" : "system-fallback",
  }));

  app.post("/speech", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const parsed = speechSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Le message vocal de Davy est invalide." });
    }
    if (!config.davyVoiceConfigured) {
      return reply.code(503).send({ error: "DAVY_VOICE_UNAVAILABLE", message: "La voix officielle de Davy n'est pas encore activée." });
    }

    const key = cacheKey(parsed.data.text);
    const cached = audioCache.get(key);
    if (cached) {
      return reply
        .header("Content-Type", "audio/mpeg")
        .header("Cache-Control", "private, max-age=86400")
        .header("X-Davy-Voice", "official-cache")
        .send(cached);
    }

    const providerResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(config.davyVoiceId)}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": config.elevenLabsApiKey,
        },
        body: JSON.stringify({
          text: parsed.data.text,
          model_id: config.davyVoiceModelId,
          voice_settings: {
            stability: 0.58,
            similarity_boost: 0.86,
            style: 0.18,
            use_speaker_boost: true,
          },
        }),
        signal: AbortSignal.timeout(20_000),
      },
    );

    if (!providerResponse.ok) {
      const providerMessage = await providerResponse.text().catch(() => "");
      request.log.error({ status: providerResponse.status, providerMessage: providerMessage.slice(0, 500) }, "Davy voice provider failed");
      return reply.code(502).send({ error: "DAVY_VOICE_PROVIDER_ERROR", message: "La voix officielle de Davy est momentanément indisponible." });
    }

    const audio = Buffer.from(await providerResponse.arrayBuffer());
    rememberAudio(key, audio);
    return reply
      .header("Content-Type", "audio/mpeg")
      .header("Cache-Control", "private, max-age=86400")
      .header("X-Davy-Voice", "official")
      .send(audio);
  });
}
