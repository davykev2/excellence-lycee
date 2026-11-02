import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { passwordRecoveryRedirectUrl } from "../apps/api/src/passwordRecoveryUrl";

test("le lien envoyé pointe sur le formulaire public de récupération", () => {
  for (const site of ["https://excellence-lycee.vercel.app", "https://excellence-lycee.vercel.app/", "https://excellence-lycee.vercel.app/ancien?vue=lecons#cours"]) {
    assert.equal(passwordRecoveryRedirectUrl(site, true), "https://excellence-lycee.vercel.app/?auth=recovery");
  }
});

test("la production refuse localhost et les liens non HTTPS", () => {
  for (const site of ["http://localhost:4173", "https://localhost", "https://app.localhost", "https://127.0.0.1", "https://127.0.0.2:4174", "https://[::1]", "https://0.0.0.0", "http://excellence-lycee.vercel.app", "ftp://example.com", "javascript:alert(1)", "https://user:password@example.com", "not-an-address"]) {
    assert.throws(() => passwordRecoveryRedirectUrl(site, true));
  }
});

test("le développement garde son adresse locale de récupération", () => {
  assert.equal(passwordRecoveryRedirectUrl("http://127.0.0.2:4174", false), "http://127.0.0.2:4174/?auth=recovery");
});

test("Supabase reçoit la vraie adresse publique, pas le réglage CORS webOrigin", () => {
  const source = readFileSync(new URL("../apps/api/src/supabase.ts", import.meta.url), "utf8");
  const reset = source.slice(source.indexOf("export async function requestSupabasePasswordReset"), source.indexOf("async function applySupabasePassword"));
  assert.match(reset, /resetPasswordForEmail\(email/);
  assert.match(reset, /redirectTo: passwordRecoveryRedirectUrl\(config\.publicWebUrl, config\.isProduction\)/);
  assert.doesNotMatch(reset, /config\.webOrigin|request\.headers|localhost/);
});
