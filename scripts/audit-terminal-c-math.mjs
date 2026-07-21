import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadTypeScript(relativePath, dependencies = {}) {
  const source = readFileSync(resolve(root, relativePath), "utf8");
  const javaScript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  const localRequire = (specifier) => {
    if (specifier in dependencies) return dependencies[specifier];
    throw new Error(`Dépendance non déclarée pour l'audit : ${specifier}`);
  };
  new Function("exports", "module", "require", javaScript)(module.exports, module, localRequire);
  return module.exports;
}

const builder = loadTypeScript("apps/web/src/data/officialMathPathBuilder.ts");
const pathModules = [
  "apps/web/src/data/terminalCMathPaths01to05.ts",
  "apps/web/src/data/terminalCMathPaths06to10.ts",
  "apps/web/src/data/terminalCMathPaths11to15.ts",
  "apps/web/src/data/terminalCMathPaths16to19.ts",
].map((file) => loadTypeScript(file, { "./officialMathPathBuilder": builder }));

const paths = pathModules.flatMap((module, index) => module[`terminalCMathPaths${index === 0 ? "01to05" : index === 1 ? "06to10" : index === 2 ? "11to15" : "16to19"}`]);
const apiRegistry = loadTypeScript("apps/api/src/terminalCMathRewards.ts");
const apiPaths = new Map(apiRegistry.terminalCMathLessonIds.map(([pathId, ids]) => [pathId, [...ids]]));

const migration = readFileSync(resolve(root, "supabase/migrations/20260721235900_terminal_c_math_complete_courses.sql"), "utf8");
const sqlPaths = new Map();
for (const match of migration.matchAll(/\('([^']+)',\s*'(\[[^']+\])'\)/g)) {
  sqlPaths.set(match[1], JSON.parse(match[2]));
}

if (paths.length !== 19) throw new Error(`19 parcours attendus, ${paths.length} reçus.`);
if (apiPaths.size !== 19) throw new Error(`19 parcours API attendus, ${apiPaths.size} reçus.`);
if (sqlPaths.size !== 19) throw new Error(`19 parcours SQL attendus, ${sqlPaths.size} reçus.`);

function normalizedTotal(levels) {
  const weights = levels.map((level) => Math.max(1, level.xp));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const baseUnits = weights.map((weight) => Math.floor(1000 * weight / totalWeight));
  return (baseUnits.reduce((sum, units) => sum + units, 0) + (1000 - baseUnits.reduce((sum, units) => sum + units, 0))) * 10;
}

const report = [];
const allLevelKeys = new Set();
paths.forEach((path, pathIndex) => {
  if (path.chapterNumber !== pathIndex + 1) throw new Error(`Numéro incorrect pour ${path.id}.`);
  if (!path.levelIds.includes("terminale-c")) throw new Error(`Niveau Terminale C absent pour ${path.id}.`);
  const levels = path.modules.flatMap((module) => module.lessons);
  const webIds = levels.map((level) => level.id);
  const expectedApiIds = apiPaths.get(path.id);
  const expectedSqlIds = sqlPaths.get(path.id);
  if (JSON.stringify(webIds) !== JSON.stringify(expectedApiIds)) throw new Error(`Décalage Web/API : ${path.id}.`);
  if (JSON.stringify(webIds) !== JSON.stringify(expectedSqlIds)) throw new Error(`Décalage Web/SQL : ${path.id}.`);

  levels.forEach((level, index) => {
    const key = `${path.id}:${level.id}`;
    if (allLevelKeys.has(key)) throw new Error(`Identifiant dupliqué : ${key}.`);
    allLevelKeys.add(key);
    if (!level.questions?.length) throw new Error(`Exercice absent : ${key}.`);
    if (!level.source?.documentTitle || !level.source?.pages) throw new Error(`Source absente : ${key}.`);
    const expectedWeight = apiRegistry.terminalCMathRewardWeight(index);
    if (level.xp !== expectedWeight) throw new Error(`Poids incohérent : ${key} (Web ${level.xp}, API ${expectedWeight}).`);
  });

  const totalXp = normalizedTotal(levels);
  if (totalXp !== 10_000) throw new Error(`Budget incorrect pour ${path.id}: ${totalXp} XP.`);
  report.push({ lesson: path.chapterNumber, path: path.id, levels: levels.length, exercises: levels.length, totalXp });
});

if (allLevelKeys.size !== 147) throw new Error(`147 niveaux attendus, ${allLevelKeys.size} reçus.`);
console.table(report);
console.log(`Audit réussi : 19 leçons, ${allLevelKeys.size} niveaux, 147 exercices et 190 000 XP.`);
