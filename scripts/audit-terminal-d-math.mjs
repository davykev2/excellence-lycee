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
const c01to05 = loadTypeScript("apps/web/src/data/terminalCMathPaths01to05.ts", {
  "./officialMathPathBuilder": builder,
  "./terminalCLimitsContinuityPath": limitsPath,
  "./terminalCBarycenterPath": barycenterPath,
  "./terminalCDivisibilityPath": divisibilityPath,
  "./terminalCDerivativesPath": derivativesPath,
  "./terminalCSpaceGeometryPath": spaceGeometryPath,
});
const c06to10 = loadTypeScript("apps/web/src/data/terminalCMathPaths06to10.ts", {
  "./officialMathPathBuilder": builder,
  "./terminalCPrimitivesPath": primitivesPath,
  "./terminalCConicsPath": conicsPath,
  "./terminalCLogarithmsPath": logarithmsPath,
});
const c11to15 = loadTypeScript("apps/web/src/data/terminalCMathPaths11to15.ts", { "./officialMathPathBuilder": builder });
const c16to19 = loadTypeScript("apps/web/src/data/terminalCMathPaths16to19.ts", { "./officialMathPathBuilder": builder });
const dModule = loadTypeScript("apps/web/src/data/terminalDMathPaths.ts", {
  "./terminalCMathPaths01to05": c01to05,
  "./terminalCMathPaths06to10": c06to10,
  "./terminalCMathPaths11to15": c11to15,
  "./terminalCMathPaths16to19": c16to19,
});

const cRewards = loadTypeScript("apps/api/src/terminalCMathRewards.ts");
const dRewards = loadTypeScript("apps/api/src/terminalDMathRewards.ts", { "./terminalCMathRewards.js": cRewards });
const paths = dModule.terminalDMathematicsPaths;
const apiPaths = new Map(dRewards.terminalDMathLessonIds.map(([pathId, ids]) => [pathId, [...ids]]));

const migration = readFileSync(resolve(root, "supabase/migrations/20260722001000_terminal_d_math_complete_courses.sql"), "utf8");
const logarithmsMigration = readFileSync(resolve(root, "supabase/migrations/20260724050000_terminal_c_logarithms_expansion.sql"), "utf8");
const sqlMappings = new Map();
for (const match of migration.matchAll(/\('([^']+)',\s*'(terminale-c-math-[^']+)'\)/g)) {
  sqlMappings.set(match[1], match[2]);
}

if (!Array.isArray(paths) || paths.length !== 12) throw new Error(`12 parcours attendus, ${paths?.length ?? 0} reçus.`);
if (apiPaths.size !== 12) throw new Error(`12 parcours API attendus, ${apiPaths.size} reçus.`);
if (sqlMappings.size !== 12) throw new Error(`12 correspondances SQL attendues, ${sqlMappings.size} reçues.`);
if (!logarithmsMigration.includes("'terminale-d-math-l05-logarithms'")) {
  throw new Error("La migration des logarithmes ne réaligne pas le parcours miroir de Terminale D.");
}

function normalize(levels) {
  const totalWeight = levels.reduce((sum, level) => sum + level.xp, 0);
  const base = levels.map((level) => Math.floor(1000 * level.xp / totalWeight));
  return (base.reduce((sum, value) => sum + value, 0) + 1000 - base.reduce((sum, value) => sum + value, 0)) * 10;
}

const report = [];
let levelCount = 0;
paths.forEach((path, index) => {
  if (path.chapterNumber !== index + 1) throw new Error(`Numérotation incorrecte : ${path.id}.`);
  if (path.levelIds.length !== 1 || path.levelIds[0] !== "terminale-d") throw new Error(`Classe incorrecte : ${path.id}.`);
  const levels = path.modules.flatMap((module) => module.lessons);
  const webIds = levels.map((level) => level.id);
  if (JSON.stringify(webIds) !== JSON.stringify(apiPaths.get(path.id))) throw new Error(`Décalage Web/API : ${path.id}.`);
  if (!sqlMappings.has(path.id)) throw new Error(`Correspondance SQL absente : ${path.id}.`);
  levels.forEach((level, levelIndex) => {
    if (!level.questions?.length) throw new Error(`Exercice absent : ${path.id}:${level.id}.`);
    if (!level.source?.documentTitle?.startsWith("TD Maths")) throw new Error(`Source Terminale D absente : ${path.id}:${level.id}.`);
    if (level.xp !== cRewards.terminalCMathRewardWeight(levelIndex)) throw new Error(`Poids XP incohérent : ${path.id}:${level.id}.`);
  });
  const totalXp = normalize(levels);
  if (totalXp !== 10_000) throw new Error(`Budget incorrect : ${path.id} = ${totalXp} XP.`);
  levelCount += levels.length;
  report.push({ lesson: index + 1, path: path.id, levels: levels.length, exercises: levels.length, totalXp });
});

if (levelCount !== 113) throw new Error(`113 niveaux attendus, ${levelCount} reçus.`);
console.table(report);
console.log(`Audit réussi : 12 leçons, ${levelCount} niveaux, ${levelCount} exercices et 120 000 XP.`);
