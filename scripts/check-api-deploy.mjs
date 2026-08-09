#!/usr/bin/env node
/**
 * L'API n'est PAS redéployée par un push : elle doit l'être à la main. Or
 * plusieurs sessions travaillent sur ce dépôt, et chacune ne connaît que ses
 * propres déploiements. Comparer l'historique git à « mon dernier déploiement »
 * conduit donc à de faux diagnostics — erreur réellement commise le 09/08/2026,
 * où un 404 en production a été annoncé alors qu'une autre session avait
 * déployé 43 secondes après son commit.
 *
 * La seule source de vérité est l'alias public : ce script demande à Vercel
 * quel déploiement il sert réellement, et compare son horodatage à la date du
 * dernier commit touchant `apps/api/`.
 *
 *   node scripts/check-api-deploy.mjs
 *
 * Sortie 0 : l'API est à jour. Sortie 1 : elle est en retard, redéployer avec
 *   cd apps/api && npx vercel deploy --prod --yes
 */

import { execFileSync } from "node:child_process";

const ALIAS = "excellence-lycee-api.vercel.app";
const API_DIR = "apps/api";

const run = (command, args, options = {}) =>
  execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...options }).trim();

function lastApiCommit() {
  const raw = run("git", ["log", "-1", "--format=%H%x09%ct%x09%s", "--", API_DIR]);
  if (!raw) return null;
  const [sha, epoch, subject] = raw.split("\t");
  return { sha: sha.slice(0, 7), at: new Date(Number(epoch) * 1000), subject };
}

function servedDeployment() {
  // `npx vercel` écrit sa bannière sur stderr : seul stdout porte le JSON.
  const raw = run("npx", ["--yes", "vercel@latest", "inspect", ALIAS, "--json"], { shell: true });
  const json = JSON.parse(raw.slice(raw.indexOf("{")));
  return { id: json.id, at: new Date(json.createdAt), state: json.readyState, target: json.target };
}

function humanDelay(fromDate, toDate) {
  const minutes = Math.round((toDate - fromDate) / 60000);
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} h`;
  return `${Math.round(minutes / 1440)} j`;
}

const commit = lastApiCommit();
if (!commit) {
  console.log("Aucun commit ne touche apps/api/ — rien à vérifier.");
  process.exit(0);
}

let deployment;
try {
  deployment = servedDeployment();
} catch (error) {
  console.error(`Impossible d'interroger Vercel : ${error.message.split("\n")[0]}`);
  console.error("Vérifie que tu es connecté (npx vercel login).");
  process.exit(2);
}

const format = (date) => date.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });

console.log(`Dernier commit sur ${API_DIR}/ : ${commit.sha}  ${format(commit.at)}  ${commit.subject}`);
console.log(`Déploiement servi par l'alias : ${deployment.id}  ${format(deployment.at)}  ${deployment.state}`);
console.log("");

if (deployment.state !== "READY" || deployment.target !== "production") {
  console.log(`⚠️  Le déploiement servi n'est pas une production prête (${deployment.state}, ${deployment.target}).`);
  process.exit(1);
}

if (deployment.at >= commit.at) {
  console.log(`✅ API à jour — déployée ${humanDelay(commit.at, deployment.at)} après le dernier commit qui la concerne.`);
  process.exit(0);
}

const behind = run("git", ["log", "--oneline", `${commit.sha}~1..HEAD`, "--", API_DIR]).split("\n").filter(Boolean);
console.log(`❌ API en retard de ${humanDelay(deployment.at, commit.at)} sur le code.`);
console.log(`   ${behind.length} commit(s) touchant ${API_DIR}/ ne sont pas déployés :`);
behind.forEach((line) => console.log(`     ${line}`));
console.log("");
console.log("   Redéployer :  cd apps/api && npx vercel deploy --prod --yes");
process.exit(1);
