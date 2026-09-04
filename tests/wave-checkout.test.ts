import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import {
  createWaveCheckoutClient,
  donationStatusFromWave,
  validateWaveLaunchUrl,
  WaveCheckoutError,
  type WaveCheckoutSession,
} from "../apps/api/src/waveCheckout.ts";

const requestId = "10000000-0000-4000-8000-000000000001";
const reference = `excellence-lycee-donation-${requestId}`;
const testDirectoryPrefix = resolve(tmpdir(), "excellence-wave-test-");
const testDirectory = mkdtempSync(join(tmpdir(), "excellence-wave-test-"));

process.env.NODE_ENV = "test";
process.env.SUPABASE_URL = "";
process.env.SUPABASE_PUBLISHABLE_KEY = "";
process.env.SUPABASE_ANON_KEY = "";
process.env.DATABASE_PATH = join(testDirectory, "wave.sqlite");
process.env.JWT_SECRET = "test-only-wave-jwt-secret-that-is-long-enough";
process.env.RESEND_API_KEY = "";
process.env.EMAIL_FROM = "";
process.env.WAVE_API_KEY = "wave_test_server_secret";
process.env.WAVE_API_SIGNING_SECRET = "wave_test_server_signing_secret";
process.env.PUBLIC_WEB_URL = "https://excellence-lycee.vercel.app";

const originalFetch = globalThis.fetch;
let waveFetch: typeof fetch = async () => {
  throw new Error("Un appel Wave simulé n'a pas été préparé pour ce test.");
};
globalThis.fetch = ((input, init) => waveFetch(input, init)) as typeof fetch;

let app: Awaited<ReturnType<(typeof import("../apps/api/src/app.ts"))["buildApp"]>>;
let database: (typeof import("../apps/api/src/database.ts"))["database"];

test.before(async () => {
  const appModule = await import("../apps/api/src/app.ts");
  const databaseModule = await import("../apps/api/src/database.ts");
  app = await appModule.buildApp();
  database = databaseModule.database;
});

test.after(async () => {
  await app?.close();
  database?.close();
  globalThis.fetch = originalFetch;
  const resolvedDirectory = resolve(testDirectory);
  assert.ok(
    resolvedDirectory.startsWith(testDirectoryPrefix) && resolvedDirectory !== resolve(tmpdir()),
    `Unexpected temporary directory: ${resolvedDirectory}`,
  );
  rmSync(resolvedDirectory, { recursive: true, force: true });
});

function session(overrides: Partial<WaveCheckoutSession> = {}): WaveCheckoutSession {
  return {
    id: "cos-test-checkout",
    amount: "1000",
    checkout_status: "open",
    client_reference: reference,
    currency: "XOF",
    payment_status: "processing",
    transaction_id: null,
    wave_launch_url: "https://pay.wave.com/c/cos-test-checkout",
    when_completed: null,
    when_created: "2026-09-04T10:00:00Z",
    when_expires: "2026-09-04T10:30:00Z",
    ...overrides,
  };
}

function jsonResponse(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

test("le client recherche d'abord la référence et garde la clé dans l'en-tête serveur", async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fetchImpl: typeof fetch = async (input, init) => {
    calls.push({ url: String(input), init });
    return jsonResponse({ result: [session()] });
  };
  const signingSecret = "wave_test_signing_secret";
  const now = 1_788_530_000_000;
  const client = createWaveCheckoutClient({ apiKey: "wave_test_secret", signingSecret, fetchImpl, now: () => now });
  const result = await client.searchByClientReference(reference);

  assert.equal(result.length, 1);
  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.url, `https://api.wave.com/v1/checkout/sessions/search?client_reference=${reference}`);
  assert.equal(new Headers(calls[0]?.init?.headers).get("Authorization"), "Bearer wave_test_secret");
  const expectedSignature = createHmac("sha256", signingSecret).update("1788530000").digest("hex");
  assert.equal(
    new Headers(calls[0]?.init?.headers).get("Wave-Signature"),
    `t=1788530000,v1=${expectedSignature}`,
  );
  assert.doesNotMatch(calls[0]?.url ?? "", /wave_test_secret/);
  assert.doesNotMatch(JSON.stringify(calls), /wave_test_signing_secret/);
});

test("la création envoie le montant XOF sous forme de chaîne et des retours HTTPS", async () => {
  let capturedBody = "";
  let capturedHeaders = new Headers();
  const fetchImpl: typeof fetch = async (_input, init) => {
    capturedBody = String(init?.body);
    capturedHeaders = new Headers(init?.headers);
    return jsonResponse(session());
  };
  const signingSecret = "wave_test_signing_secret";
  const client = createWaveCheckoutClient({
    apiKey: "wave_test_secret",
    signingSecret,
    fetchImpl,
    now: () => 1_788_530_000_000,
  });

  await client.createCheckout({
    amountXof: 1000,
    clientReference: reference,
    successUrl: `https://excellence-lycee.vercel.app/soutenir?donation=success&reference=${reference}`,
    errorUrl: `https://excellence-lycee.vercel.app/soutenir?donation=error&reference=${reference}`,
  });

  assert.deepEqual(JSON.parse(capturedBody), {
    amount: "1000",
    currency: "XOF",
    client_reference: reference,
    success_url: `https://excellence-lycee.vercel.app/soutenir?donation=success&reference=${reference}`,
    error_url: `https://excellence-lycee.vercel.app/soutenir?donation=error&reference=${reference}`,
  });
  const expectedSignature = createHmac("sha256", signingSecret)
    .update(`1788530000${capturedBody}`)
    .digest("hex");
  assert.equal(capturedHeaders.get("Wave-Signature"), `t=1788530000,v1=${expectedSignature}`);
  assert.doesNotMatch(JSON.stringify([...capturedHeaders]), /wave_test_signing_secret/);
});

test("seul le domaine HTTPS pay.wave.com est accepté pour payer", () => {
  assert.equal(validateWaveLaunchUrl("https://pay.wave.com/c/cos-test"), "https://pay.wave.com/c/cos-test");
  assert.throws(
    () => validateWaveLaunchUrl("https://pay.wave.com.evil.test/c/cos-test"),
    (error) => error instanceof WaveCheckoutError && error.code === "WAVE_INVALID_RESPONSE",
  );
  assert.throws(() => validateWaveLaunchUrl("http://pay.wave.com/c/cos-test"), WaveCheckoutError);
});

test("la configuration publique ne révèle aucun secret", async () => {
  const response = await app.inject({ method: "GET", url: "/donations/config" });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), {
    available: true,
    currency: "XOF",
    suggestedAmounts: [500, 1000, 2000, 5000, 10000],
    minAmount: 100,
    maxAmount: 1000000,
  });
  assert.doesNotMatch(response.body, /wave_test_server_secret|wave_test_server_signing_secret|apiKey|signingSecret/i);
});

test("une même requestId retrouve le checkout existant sans recréer un paiement", async () => {
  let searches = 0;
  let creates = 0;
  waveFetch = async (input) => {
    if (String(input).includes("/search?")) {
      searches += 1;
      return jsonResponse({ result: [session()] });
    }
    creates += 1;
    return jsonResponse(session());
  };

  const response = await app.inject({
    method: "POST",
    url: "/donations/checkout",
    payload: { requestId, amountXof: 1000 },
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), {
    reference,
    waveLaunchUrl: "https://pay.wave.com/c/cos-test-checkout",
  });
  assert.equal(searches, 1);
  assert.equal(creates, 0);
});

test("sans checkout existant, la route en crée un avec des retours HTTPS", async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  waveFetch = async (input, init) => {
    calls.push({ url: String(input), init });
    if (String(input).includes("/search?")) return jsonResponse({ result: [] });
    return jsonResponse(session());
  };

  const response = await app.inject({
    method: "POST",
    url: "/donations/checkout",
    payload: { requestId, amountXof: 1000 },
  });

  assert.equal(response.statusCode, 201);
  assert.deepEqual(response.json(), {
    reference,
    waveLaunchUrl: "https://pay.wave.com/c/cos-test-checkout",
  });
  assert.equal(calls.length, 2);
  const payload = JSON.parse(String(calls[1]?.init?.body));
  assert.equal(payload.client_reference, reference);
  assert.equal(payload.amount, "1000");
  assert.match(payload.success_url, /^https:\/\/excellence-lycee\.vercel\.app\/soutenir\?/);
  assert.match(payload.error_url, /^https:\/\/excellence-lycee\.vercel\.app\/soutenir\?/);
});

test("un montant invalide est refusé avant tout appel Wave", async () => {
  let calls = 0;
  waveFetch = async () => {
    calls += 1;
    return jsonResponse({ result: [] });
  };
  const response = await app.inject({
    method: "POST",
    url: "/donations/checkout",
    payload: { requestId, amountXof: 99.5 },
  });
  assert.equal(response.statusCode, 400);
  assert.equal(calls, 0);
});

test("le retour navigateur ne confirme jamais un don : seul l'état Wave exact le fait", async () => {
  let current = session();
  waveFetch = async () => jsonResponse({ result: [current] });

  const pending = await app.inject({
    method: "GET",
    url: `/donations/${reference}/status?donation=success`,
  });
  assert.equal(pending.statusCode, 200);
  assert.equal(pending.json().status, "pending");

  current = session({
    checkout_status: "complete",
    payment_status: "succeeded",
    transaction_id: "T_TEST",
    when_completed: "2026-09-04T10:04:00Z",
  });
  const paid = await app.inject({ method: "GET", url: `/donations/${reference}/status` });
  assert.deepEqual(paid.json(), {
    status: "paid",
    amountXof: 1000,
    currency: "XOF",
    transactionId: "T_TEST",
    completedAt: "2026-09-04T10:04:00Z",
  });
});

test("le mapping distingue paiement annulé et session expirée", () => {
  assert.equal(donationStatusFromWave(session()), "pending");
  assert.equal(donationStatusFromWave(session({ payment_status: "cancelled" })), "failed");
  assert.equal(donationStatusFromWave(session({ checkout_status: "expired" })), "expired");
  assert.equal(donationStatusFromWave(session({ checkout_status: "complete", payment_status: "processing" })), "pending");
});
