import { readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { loadEnvFile } from "node:process";

try {
  loadEnvFile();
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
const samplePath = resolve(process.argv[2] ?? "data/voice-private/davy-voice-optimized.wav");

if (!apiKey) {
  console.error("ELEVENLABS_API_KEY manque dans apps/api/.env.");
  process.exit(1);
}

const form = new FormData();
form.append("name", "Davy — Excellence Lycée");
form.append("description", "Voix officielle masculine et chaleureuse de Davy, avec autorisation du propriétaire archivée séparément.");
form.append("labels", JSON.stringify({ language: "fr", accent: "ivoirien", gender: "male", use_case: "education" }));
form.append("remove_background_noise", "false");
form.append("files", new Blob([readFileSync(samplePath)], { type: "audio/wav" }), basename(samplePath));

const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
  method: "POST",
  headers: { "xi-api-key": apiKey },
  body: form,
});

const payload = await response.json().catch(() => ({}));
if (!response.ok || !payload.voice_id) {
  console.error("Création de la voix impossible.", payload);
  process.exit(1);
}

const resultPath = resolve("data/voice-private/voice-result.json");
writeFileSync(resultPath, JSON.stringify({
  createdAt: new Date().toISOString(),
  provider: "elevenlabs",
  voiceId: payload.voice_id,
  requiresVerification: Boolean(payload.requires_verification),
}, null, 2));

console.log(`Voix Davy créée : ${payload.voice_id}`);
console.log(`Ajoute DAVY_VOICE_ID=${payload.voice_id} dans apps/api/.env puis redémarre l'API.`);
