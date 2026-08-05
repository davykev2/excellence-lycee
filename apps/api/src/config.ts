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
const resendApiKey = process.env.RESEND_API_KEY?.trim() ?? "";
// Resend exige un domaine vérifié : tant que le porteur n'en a pas, EMAIL_FROM
// reste vide et tout l'envoi est inerte plutôt que de partir en erreur.
const emailFrom = process.env.EMAIL_FROM?.trim() ?? "";

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
  resendApiKey,
  emailFrom,
  emailReplyTo: process.env.EMAIL_REPLY_TO?.trim() ?? "",
  // Adresse publique du frontend, utilisée pour les liens des e-mails. En local
  // elle vaut l'origine du serveur Vite ; en production, le domaine Vercel.
  publicWebUrl: (process.env.PUBLIC_WEB_URL?.trim() || process.env.WEB_ORIGIN?.trim() || "http://localhost:4173").replace(/\/+$/, ""),
  emailConfigured: Boolean(resendApiKey && emailFrom),
  dataProvider: supabaseUrl && supabasePublishableKey ? "supabase" as const : "sqlite" as const,
  isProduction,
};
