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
const limitsPath = loadTypeScript("apps/web/src/data/terminalCLimitsContinuityPath.ts");
const barycenterPath = loadTypeScript("apps/web/src/data/terminalCBarycenterPath.ts");
const divisibilityPath = loadTypeScript("apps/web/src/data/terminalCDivisibilityPath.ts");
const derivativesPath = loadTypeScript("apps/web/src/data/terminalCDerivativesPath.ts");
const spaceGeometryPath = loadTypeScript("apps/web/src/data/terminalCSpaceGeometryPath.ts");
const primitivesPath = loadTypeScript("apps/web/src/data/terminalCPrimitivesPath.ts");
const conicsPath = loadTypeScript("apps/web/src/data/terminalCConicsPath.ts");
const logarithmsPath = loadTypeScript("apps/web/src/data/terminalCLogarithmsPath.ts");
const complexNumbersPath = loadTypeScript("apps/web/src/data/terminalCComplexNumbersPath.ts");
const exponentialPowerPath = loadTypeScript("apps/web/src/data/terminalCExponentialPowerPath.ts");
const lcmGcdPath = loadTypeScript("apps/web/src/data/terminalCLcmGcdPath.ts");
const sequencesPath = loadTypeScript("apps/web/src/data/terminalCSequencesPath.ts");
const complexGeometryPath = loadTypeScript("apps/web/src/data/terminalCComplexGeometryPath.ts");
const isometriesPath = loadTypeScript("apps/web/src/data/terminalCIsometriesPath.ts");
const integralCalculusPath = loadTypeScript("apps/web/src/data/terminalCIntegralCalculusPath.ts", {
  "./officialMathPathBuilder": builder,
});
const directSimilaritiesPath = loadTypeScript("apps/web/src/data/terminalCDirectSimilaritiesPath.ts");
const probabilityPath = loadTypeScript("apps/web/src/data/terminalCProbabilityPath.ts");
const differentialEquationsPath = loadTypeScript("apps/web/src/data/terminalCDifferentialEquationsPath.ts");
const statisticsPath = loadTypeScript("apps/web/src/data/terminalCStatisticsPath.ts");
const pathModules = [
  loadTypeScript("apps/web/src/data/terminalCMathPaths01to05.ts", {
    "./officialMathPathBuilder": builder,
    "./terminalCLimitsContinuityPath": limitsPath,
    "./terminalCBarycenterPath": barycenterPath,
    "./terminalCDivisibilityPath": divisibilityPath,
    "./terminalCDerivativesPath": derivativesPath,
    "./terminalCSpaceGeometryPath": spaceGeometryPath,
  }),
  loadTypeScript("apps/web/src/data/terminalCMathPaths06to10.ts", {
    "./officialMathPathBuilder": builder,
    "./terminalCPrimitivesPath": primitivesPath,
    "./terminalCConicsPath": conicsPath,
    "./terminalCLogarithmsPath": logarithmsPath,
    "./terminalCComplexNumbersPath": complexNumbersPath,
    "./terminalCExponentialPowerPath": exponentialPowerPath,
  }),
  loadTypeScript("apps/web/src/data/terminalCMathPaths11to15.ts", {
    "./officialMathPathBuilder": builder,
    "./terminalCLcmGcdPath": lcmGcdPath,
    "./terminalCSequencesPath": sequencesPath,
    "./terminalCComplexGeometryPath": complexGeometryPath,
    "./terminalCIsometriesPath": isometriesPath,
    "./terminalCIntegralCalculusPath": integralCalculusPath,
  }),
  loadTypeScript("apps/web/src/data/terminalCMathPaths16to19.ts", {
    "./officialMathPathBuilder": builder,
    "./terminalCDirectSimilaritiesPath": directSimilaritiesPath,
    "./terminalCProbabilityPath": probabilityPath,
    "./terminalCDifferentialEquationsPath": differentialEquationsPath,
    "./terminalCStatisticsPath": statisticsPath,
  }),
];

const paths = pathModules.flatMap((module, index) => module[`terminalCMathPaths${index === 0 ? "01to05" : index === 1 ? "06to10" : index === 2 ? "11to15" : "16to19"}`]);
const apiRegistry = loadTypeScript("apps/api/src/terminalCMathRewards.ts");
const apiPaths = new Map(apiRegistry.terminalCMathLessonIds.map(([pathId, ids]) => [pathId, [...ids]]));

const sqlPaths = new Map();
const migrationFiles = [
  "supabase/migrations/20260721235900_terminal_c_math_complete_courses.sql",
  "supabase/migrations/20260723120000_terminal_c_limits_continuity_mission.sql",
  "supabase/migrations/20260723213000_terminal_c_barycenter_mission.sql",
  "supabase/migrations/20260723230000_terminal_c_divisibility_expansion.sql",
  "supabase/migrations/20260724010000_terminal_c_derivatives_expansion.sql",
  "supabase/migrations/20260724020000_terminal_c_space_geometry_expansion.sql",
  "supabase/migrations/20260724030000_terminal_c_d_primitives_expansion.sql",
  "supabase/migrations/20260724040000_terminal_c_conics_expansion.sql",
  "supabase/migrations/20260724050000_terminal_c_logarithms_expansion.sql",
];
for (const migrationFile of migrationFiles) {
  const migration = readFileSync(resolve(root, migrationFile), "utf8");
  for (const match of migration.matchAll(/\(\s*'([^']+)',\s*'(\[[^']+\])'\s*\)/g)) {
    if (match[1].startsWith("terminale-c-math-")) sqlPaths.set(match[1], JSON.parse(match[2]));
  }
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
  report.push({
    lesson: path.chapterNumber,
    path: path.id,
    levels: levels.length,
    questions: levels.reduce((sum, level) => sum + (level.questions?.length ?? 0), 0),
    totalXp,
  });
});

if (allLevelKeys.size !== 182) throw new Error(`182 niveaux attendus, ${allLevelKeys.size} reçus.`);
console.table(report);
console.log(`Audit réussi : 19 leçons, ${allLevelKeys.size} niveaux et 190 000 XP.`);
