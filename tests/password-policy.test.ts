import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { passwordSchema } from "../apps/api/src/passwordPolicy.ts";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const testDirectoryPrefix = resolve(tmpdir(), "excellence-password-policy-");
const testDirectory = mkdtempSync(join(tmpdir(), "excellence-password-policy-"));

process.env.NODE_ENV = "test";
process.env.SUPABASE_URL = "";
process.env.SUPABASE_PUBLISHABLE_KEY = "";
process.env.SUPABASE_ANON_KEY = "";
process.env.DATABASE_PATH = join(testDirectory, "auth.sqlite");
process.env.JWT_SECRET = "test-only-password-policy-secret-that-is-long-enough";
process.env.RESEND_API_KEY = "";
process.env.EMAIL_FROM = "";

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
  const resolvedDirectory = resolve(testDirectory);
  assert.ok(
    resolvedDirectory.startsWith(testDirectoryPrefix) && resolvedDirectory !== resolve(tmpdir()),
    `Unexpected temporary directory: ${resolvedDirectory}`,
  );
  rmSync(resolvedDirectory, { recursive: true, force: true });
});

async function register(email: string, password: string) {
  const response = await app.inject({
    method: "POST",
    url: "/auth/register",
    payload: {
      name: "Compte test",
      email,
      password,
      levelId: "terminale-c",
      accountType: "student",
    },
  });
  return { response, body: response.json() as Record<string, unknown> };
}

async function login(email: string, password: string) {
  return app.inject({
    method: "POST",
    url: "/auth/login",
    payload: { email, password },
  });
}

test("lettres, chiffres, symboles et mélanges sont tous des formats valides", () => {
  for (const password of ["abcdef", "123456", "!!!!!!", "Ab1!xy"]) {
    assert.equal(passwordSchema.safeParse(password).success, true, `Format refusé à tort : ${password}`);
  }
});

test("l'inscription accepte un mot de passe numérique sans règle de composition", async () => {
  const email = "digits-only-password@example.test";
  const { response, body } = await register(email, "123456");
  assert.equal(response.statusCode, 201);
  assert.equal(typeof body.accessToken, "string");
  assert.equal((await login(email, "123456")).statusCode, 200);
});

test("la politique conserve seulement les bornes techniques de Supabase", async () => {
  const tooShort = await register("short-password@example.test", "12345");
  assert.equal(tooShort.response.statusCode, 400);
  assert.match(String(tooShort.body.message), /au moins 6 caractères/i);

  const tooLong = await register("long-password@example.test", "a".repeat(73));
  assert.equal(tooLong.response.statusCode, 400);
  assert.match(String(tooLong.body.message), /72 caractères/i);
});

test("le changement accepte un mot de passe composé uniquement de symboles", async () => {
  const email = "symbols-only-password@example.test";
  const created = await register(email, "abcdef");
  assert.equal(created.response.statusCode, 201);

  const changed = await app.inject({
    method: "POST",
    url: "/auth/password/change",
    headers: { authorization: `Bearer ${String(created.body.accessToken)}` },
    payload: { currentPassword: "abcdef", password: "!!!!!!" },
  });

  assert.equal(changed.statusCode, 200);
  assert.equal((await login(email, "abcdef")).statusCode, 401);
  assert.equal((await login(email, "!!!!!!")).statusCode, 200);
});

test("les interfaces ne réintroduisent aucune exigence de complexité", () => {
  const authSource = readFileSync(resolve(projectRoot, "apps/web/src/features/auth/AuthScreen.tsx"), "utf8");
  const profileSource = readFileSync(resolve(projectRoot, "apps/web/src/features/profile/ChangePasswordSection.tsx"), "utf8");
  const combined = `${authSource}\n${profileSource}`;

  assert.doesNotMatch(combined, /minLength=\{10\}|10 caractères|avec une majuscule|avec une minuscule|et un chiffre/i);
  assert.match(authSource, /au format libre/);
  assert.match(profileSource, /au format libre/);
});
