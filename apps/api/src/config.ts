import { resolve } from "node:path";
import { loadEnvFile } from "node:process";

try {
  loadEnvFile();
} catch (error) {
  if ((error as { code?: string }).code !== "ENOENT") throw error;
}

const isProduction = process.env.NODE_ENV === "production";
const fallbackSecret = "local-development-secret-change-before-production-2026";

export function resolveJwtSecret(environment: NodeJS.ProcessEnv, production: boolean) {
  const configuredSecret = environment.JWT_SECRET?.trim();
  if (production && !configuredSecret) {
    throw new Error("JWT_SECRET doit être défini explicitement en production.");
  }

  const secret = configuredSecret || fallbackSecret;
  if (production && secret.length < 32) {
    throw new Error("JWT_SECRET doit contenir au moins 32 caractères en production.");
  }
  return secret;
}

export function resolveDataProvider(environment: NodeJS.ProcessEnv, production: boolean) {
  const url = environment.SUPABASE_URL?.trim() ?? "";
  const publishableKey = (environment.SUPABASE_PUBLISHABLE_KEY ?? environment.SUPABASE_ANON_KEY)?.trim() ?? "";
  const partiallyConfigured = Boolean(url) !== Boolean(publishableKey);

  if (partiallyConfigured) {
    throw new Error("SUPABASE_URL et SUPABASE_PUBLISHABLE_KEY doivent être définis ensemble.");
  }
  if (production && !url) {
    throw new Error("Supabase doit être configuré explicitement en production.");
  }
  return url ? "supabase" as const : "sqlite" as const;
}

const jwtSecret = resolveJwtSecret(process.env, isProduction);
const supabaseUrl = process.env.SUPABASE_URL?.trim() ?? "";
const supabasePublishableKey = (process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY)?.trim() ?? "";
const dataProvider = resolveDataProvider(process.env, isProduction);
const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY?.trim() ?? "";
const davyVoiceId = process.env.DAVY_VOICE_ID?.trim() ?? "";
const resendApiKey = process.env.RESEND_API_KEY?.trim() ?? "";
// Resend exige un domaine vérifié : tant que le porteur n'en a pas, EMAIL_FROM
// reste vide et tout l'envoi est inerte plutôt que de partir en erreur.
const emailFrom = process.env.EMAIL_FROM?.trim() ?? "";

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
  dataProvider,
  isProduction,
};
