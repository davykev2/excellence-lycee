import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { AUTH_ACCOUNT_AVAILABILITY, isAuthAccountTypeEnabled } from "../apps/web/src/config/authAccess";
import type { AccountType } from "../apps/web/src/domain/auth";

const source = readFileSync(new URL("../apps/web/src/features/auth/AuthScreen.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../apps/web/src/styles/onboarding-training.css", import.meta.url), "utf8");

test("seul le choix Élève est ouvert tant que les espaces adultes ne sont pas construits", () => {
  assert.deepEqual(AUTH_ACCOUNT_AVAILABILITY, { student: true, parent: false, teacher: false });
  assert.ok(Object.isFrozen(AUTH_ACCOUNT_AVAILABILITY));
  assert.equal(isAuthAccountTypeEnabled("student"), true);
  for (const type of ["parent", "teacher", null, undefined, "admin" as AccountType]) {
    assert.equal(isAuthAccountTypeEnabled(type), false);
  }
});

test("les trois cartes sont conservées, avec désactivation native, cadenas et Bientôt", () => {
  for (const id of ["student", "parent", "teacher"]) assert.ok(source.includes(`id: "${id}" as const`));
  assert.match(source, /const enabled = isAuthAccountTypeEnabled\(id\)/);
  assert.match(source, /disabled=\{!enabled\}[^\n]+data-account-type=\{id\}/);
  assert.match(source, /onboarding-choice-status">Bientôt/);
  assert.match(source, /enabled \? <ArrowRight[^\n]+: <LockKey[^\n]+aria-hidden="true"/);
});

test("sélection, changement de mode et envoi ne peuvent pas ouvrir un choix fermé", () => {
  assert.match(source, /chooseAccountType = \(nextAccountType: AccountType\) => \{\s+if \(!isAuthAccountTypeEnabled\(nextAccountType\)\) return;/);
  assert.match(source, /chooseMode = \(nextMode: AuthMode\) => \{\s+if \(!isAuthAccountTypeEnabled\(accountType\)\) return;/);
  assert.match(source, /event\.preventDefault\(\);\s+if \(!isAuthAccountTypeEnabled\(accountType\)\) return;\s+setSubmitting\(true\)/);
  assert.match(source, /if \(!isAuthAccountTypeEnabled\(accountType\)\) setAccountType\("student"\)/);
});

test("connexion et récupération existantes sont préservées sans changer les comptes ni les rôles", () => {
  assert.match(source, /if \(mode === "login"\) await login\(\{ email, password \}\)/);
  assert.match(source, /await requestPasswordReset\(email\)/);
  assert.match(source, /await confirmPasswordReset\(passwordRecovery\.accessToken, newPassword\)/);
  assert.doesNotMatch(source, /deleteUser|updateUser|signOut\(/);
});

test("les cartes fermées restent lisibles et n’ont pas d’animation de survol", () => {
  assert.match(css, /button:not\(:disabled\):hover/);
  assert.match(css, /\.onboarding-account-grid > button:disabled \{[^}]+opacity: 1;[^}]+transform: none;/);
  assert.match(css, /\.onboarding-choice-status \{[^}]+font-style: normal;/);
});
