import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { navigationItems } from "../apps/web/src/config/navigation.ts";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function source(relativePath: string) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

function collectSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? collectSourceFiles(path) : [path];
  });
}

test("la route /soutenir reste publique et indépendante de la reprise de session", () => {
  const appSource = source("apps/web/src/App.tsx");
  const supportRouteIndex = appSource.indexOf('normalizedPath === "/soutenir"');

  assert.match(appSource, /lazy\(\(\) => import\("\.\/features\/support\/SupportScreen"\)\)/);
  assert.ok(supportRouteIndex >= 0, "La route publique /soutenir doit être déclarée dans App.tsx.");
  assert.ok(supportRouteIndex < appSource.indexOf("if (loading)"), "Le soutien ne doit pas attendre la session.");
  assert.ok(supportRouteIndex < appSource.indexOf("if (!user)"), "Le soutien ne doit pas exiger un compte.");
});

test("le soutien reste contextuel et ne devient pas un onglet principal ou mobile", () => {
  assert.equal(
    navigationItems.some((item) => item.id === ("support" as typeof item.id) || /soutenir|don|café/i.test(item.label)),
    false,
  );

  const navigationTypes = source("apps/web/src/domain/learning.ts");
  assert.doesNotMatch(navigationTypes, /\|\s*"support"/);

  const authSource = source("apps/web/src/features/auth/AuthScreen.tsx");
  const dashboardSource = source("apps/web/src/features/dashboard/Dashboard.tsx");
  const profileSource = source("apps/web/src/features/profile/ProfileScreen.tsx");
  const learningAppSource = source("apps/web/src/LearningApp.tsx");

  assert.match(authSource, /href="\/soutenir"/);
  assert.match(dashboardSource, /<SupportCard\s+location="dashboard"\s+onOpen=\{onOpenSupport\}/);
  assert.match(profileSource, /<SupportCard\s+location="profile"\s+onOpen=\{onOpenSupport\}/);
  assert.equal((learningAppSource.match(/onOpenSupport=\{\(\) => window\.location\.assign\("\/soutenir"\)\}/g) ?? []).length, 2);
});

test("l'interface présente le don comme volontaire, sans avantage pédagogique", () => {
  const supportSource = source("apps/web/src/features/support/SupportScreen.tsx");

  assert.match(supportSource, /Contribution volontaire\./);
  assert.match(supportSource, /Si tu es mineur, demande l’accord d’un parent/);
  assert.match(supportSource, /Aucun contenu, XP ou classement n’en dépend/);
  assert.match(supportSource, /Tu choisis et confirmes le montant directement sur Wave\./);
  assert.match(supportSource, /La contribution ne remplace aucun paiement scolaire/);
});

test("le lien marchand ouvre Wave sans fabriquer de confirmation de paiement", () => {
  const supportSource = source("apps/web/src/features/support/SupportScreen.tsx");

  assert.match(supportSource, /https:\/\/pay\.wave\.com\/m\/M_ci_M4N-baBQdy32\/c\/ci\//);
  assert.match(supportSource, /href=\{waveMerchantPaymentUrl\}/);
  assert.match(supportSource, /referrerPolicy="no-referrer"/);
  assert.doesNotMatch(supportSource, /target="_blank"/);
  assert.doesNotMatch(supportSource, /apiRequest|\/donations\/|result\.status === "paid"/);
  assert.doesNotMatch(supportSource, /paiement (?:a bien été|est) confirm(?:é|ée)/i);
  assert.match(supportSource, /seul le reçu affiché par Wave confirme le paiement/);
  assert.match(supportSource, /bouton Retour de ton navigateur/);
});

test("aucun secret Wave ou Supabase privilégié n'entre dans le bundle apprenant", () => {
  const frontendRoot = resolve(projectRoot, "apps/web/src");
  const sourceExtensions = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);
  const combinedSource = collectSourceFiles(frontendRoot)
    .filter((path) => sourceExtensions.has(extname(path)))
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");

  for (const forbiddenSecret of [
    "WAVE_API_KEY",
    "WAVE_API_SIGNING_SECRET",
    "WAVE_REQUEST_SIGNING_SECRET",
    "WAVE_WEBHOOK_SIGNING_SECRET",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_SECRET_KEY",
    "sb_secret_",
  ]) {
    assert.equal(combinedSource.includes(forbiddenSecret), false, `${forbiddenSecret} ne doit jamais être référencé dans apps/web/src.`);
  }
});
