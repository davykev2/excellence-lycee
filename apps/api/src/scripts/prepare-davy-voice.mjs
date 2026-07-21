import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const sourcePath = process.argv[2];
const authorizationPath = process.argv[3];

if (!sourcePath || !authorizationPath) {
  console.error('Usage: npm run voice:prepare -- "chemin/voix.m4a" "chemin/autorisation.m4a"');
  process.exit(1);
}

if (!ffmpegPath) {
  console.error("FFmpeg n'est pas disponible sur cette plateforme.");
  process.exit(1);
}

const outputDirectory = resolve("data/voice-private");
const outputPath = resolve(outputDirectory, "davy-voice-optimized.wav");
const consentCopyPath = resolve(outputDirectory, "voice-owner-authorization.m4a");
mkdirSync(outputDirectory, { recursive: true });

// The supplied recording is 4:53. These sentence-boundary segments preserve
// neutral narration, educational vocabulary and Davy's warmer encouragement
// while keeping the IVC reference below the recommended three-minute ceiling.
const filter = [
  "[0:a]atrim=start=0.44:end=94.17,asetpts=N/SR/TB[s0]",
  "[0:a]atrim=start=113.73:end=149.19,asetpts=N/SR/TB[s1]",
  "[0:a]atrim=start=253.94:end=291.56,asetpts=N/SR/TB[s2]",
  "[s0][s1][s2]concat=n=3:v=0:a=1,highpass=f=70,lowpass=f=14500,loudnorm=I=-19:TP=-2:LRA=7[out]",
].join(";");

const result = spawnSync(ffmpegPath, [
  "-hide_banner",
  "-loglevel", "warning",
  "-y",
  "-i", resolve(sourcePath),
  "-filter_complex", filter,
  "-map", "[out]",
  "-ar", "48000",
  "-ac", "1",
  "-c:a", "pcm_s16le",
  outputPath,
], { stdio: "inherit" });

if (result.status !== 0) process.exit(result.status ?? 1);

copyFileSync(resolve(authorizationPath), consentCopyPath);

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

writeFileSync(resolve(outputDirectory, "recording-manifest.json"), JSON.stringify({
  preparedAt: new Date().toISOString(),
  voiceSample: {
    file: basename(outputPath),
    sha256: sha256(outputPath),
    format: "PCM 16-bit, 48 kHz, mono",
    targetLoudness: "-19 LUFS",
    targetTruePeak: "-2 dBTP",
    processing: ["sentence-boundary selection", "70 Hz high-pass", "14.5 kHz low-pass", "loudness normalization"],
  },
  authorization: {
    file: basename(consentCopyPath),
    sha256: sha256(consentCopyPath),
    publishedWithApplication: false,
  },
}, null, 2));

console.log(`Voix optimisée : ${outputPath}`);
console.log(`Autorisation archivée hors publication : ${consentCopyPath}`);
