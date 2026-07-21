import { resolve } from "node:path";
import { loadEnvFile } from "node:process";

try {
  loadEnvFile();
} catch (error) {
  if ((error as { code?: string }).code !== "ENOENT") throw error;
}

const isProduction = process.env.NODE_ENV === "production";
const fallbackSecret = "local-development-secret-change-before-production-2026";
const jwtSecret = process.env.JWT_SECRET ?? fallbackSecret;
const supabaseUrl = process.env.SUPABASE_URL?.trim() ?? "";
const supabasePublishableKey = (process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY)?.trim() ?? "";
const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY?.trim() ?? "";
const davyVoiceId = process.env.DAVY_VOICE_ID?.trim() ?? "";

if (isProduction && jwtSecret.length < 32) {
  throw new Error("JWT_SECRET doit contenir au moins 32 caractères en production.");
}

export const config = {
  host: process.env.HOST ?? "127.0.0.1",
  port: Number(process.env.PORT ?? 3333),
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:4173",
  databasePath: resolve(process.env.DATABASE_PATH ?? "./data/excellence.db"),
  jwtSecret,
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL ?? "15m",
  refreshTokenDays: Number(process.env.REFRESH_TOKEN_DAYS ?? 30),
  supabaseUrl,
  supabasePublishableKey,
  elevenLabsApiKey,
  davyVoiceId,
  davyVoiceModelId: process.env.DAVY_VOICE_MODEL_ID?.trim() || "eleven_multilingual_v2",
  davyVoiceConfigured: Boolean(elevenLabsApiKey && davyVoiceId),
  dataProvider: supabaseUrl && supabasePublishableKey ? "supabase" as const : "sqlite" as const,
  isProduction,
};
