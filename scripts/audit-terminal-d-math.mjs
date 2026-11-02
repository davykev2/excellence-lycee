import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";
import { loadStatisticsDocument } from "./load-statistics-document.mjs";
import { loadBarycenterDocument } from "./load-barycenter-document.mjs";
import { loadDivisibilityDocument } from "./load-divisibility-document.mjs";
import { loadSpaceDocument } from "./load-space-document.mjs";
import { loadConicsDocument } from "./load-conics-document.mjs";
import { loadComplexDocument } from "./load-complex-document.mjs";
import { loadGcdDocument } from "./load-gcd-document.mjs";

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
const lcmGcdPath = loadTypeScript("apps/web/src/data/terminalCLcmGcdPath.ts",{"./courseDocuments/terminalCGcdDocument":loadGcdDocument(loadTypeScript)});
const limitsDocument = loadTypeScript("apps/web/src/data/courseDocuments/terminalCLimitsContinuityDocument.ts", {
  "./terminalCLimitsSummary": loadTypeScript("apps/web/src/data/courseDocuments/terminalCLimitsSummary.ts"),
  "./terminalCLimitsEvaluations": loadTypeScript("apps/web/src/data/courseDocuments/terminalCLimitsEvaluations.ts"),
});
const limitsPath = loadTypeScript("apps/web/src/data/terminalCLimitsContinuityPath.ts", {
  "./courseDocuments/terminalCLimitsContinuityDocument": limitsDocument,
});
const barycenterPath = loadTypeScript("apps/web/src/data/terminalCBarycenterPath.ts",{"./courseDocuments/terminalCBarycenterDocument":loadBarycenterDocument(loadTypeScript)});
const divisibilityPath = loadTypeScript("apps/web/src/data/terminalCDivisibilityPath.ts",{"./courseDocuments/terminalCDivisibilityDocument":loadDivisibilityDocument(loadTypeScript)});
const derivativesDocument = loadTypeScript("apps/web/src/data/courseDocuments/terminalCDerivativesDocument.ts", {
  "./terminalCDerivativesSummary": loadTypeScript("apps/web/src/data/courseDocuments/terminalCDerivativesSummary.ts"),
  "./terminalCDerivativesEvaluations": loadTypeScript("apps/web/src/data/courseDocuments/terminalCDerivativesEvaluations.ts"),
});
const derivativesPath = loadTypeScript("apps/web/src/data/terminalCDerivativesPath.ts", {
  "./courseDocuments/terminalCDerivativesDocument": derivativesDocument,
});
const spaceGeometryPath = loadTypeScript("apps/web/src/data/terminalCSpaceGeometryPath.ts",{"./courseDocuments/terminalCSpaceDocument":loadSpaceDocument(loadTypeScript)});
const primitivesDocument = loadTypeScript("apps/web/src/data/courseDocuments/terminalCPrimitivesDocument.ts", {
  "./terminalCPrimitivesSummary": loadTypeScript("apps/web/src/data/courseDocuments/terminalCPrimitivesSummary.ts"),
  "./terminalCPrimitivesEvaluations": loadTypeScript("apps/web/src/data/courseDocuments/terminalCPrimitivesEvaluations.ts"),
});
const primitivesPath = loadTypeScript("apps/web/src/data/terminalCPrimitivesPath.ts", {
  "./courseDocuments/terminalCPrimitivesDocument": primitivesDocument,
});
const conicsPath = loadTypeScript("apps/web/src/data/terminalCConicsPath.ts",{"./courseDocuments/terminalCConicsDocument":loadConicsDocument(loadTypeScript)});
const logarithmsDocument = loadTypeScript("apps/web/src/data/courseDocuments/terminalCLogarithmsDocument.ts", {
  "./terminalCLogarithmsSummary": loadTypeScript("apps/web/src/data/courseDocuments/terminalCLogarithmsSummary.ts"),
  "./terminalCLogarithmsEvaluations": loadTypeScript("apps/web/src/data/courseDocuments/terminalCLogarithmsEvaluations.ts"),
});
const logarithmsPath = loadTypeScript("apps/web/src/data/terminalCLogarithmsPath.ts", {
  "./courseDocuments/terminalCLogarithmsDocument": logarithmsDocument,
});
const complexNumbersPath = loadTypeScript("apps/web/src/data/terminalCComplexNumbersPath.ts",{"./courseDocuments/terminalCComplexDocument":loadComplexDocument(loadTypeScript)});
const exponentialPowerDocument = loadTypeScript("apps/web/src/data/courseDocuments/terminalCExponentialPowerDocument.ts", {
  "./terminalCExponentialPowerSummary": loadTypeScript("apps/web/src/data/courseDocuments/terminalCExponentialPowerSummary.ts"),
  "./terminalCExponentialPowerEvaluations": loadTypeScript("apps/web/src/data/courseDocuments/terminalCExponentialPowerEvaluations.ts"),
});
const exponentialPowerPath = loadTypeScript("apps/web/src/data/terminalCExponentialPowerPath.ts", {
  "./courseDocuments/terminalCExponentialPowerDocument": exponentialPowerDocument,
});
const sequencesDocument = loadTypeScript("apps/web/src/data/courseDocuments/terminalCSequencesDocument.ts", {
  "./terminalCSequencesSummary": loadTypeScript("apps/web/src/data/courseDocuments/terminalCSequencesSummary.ts"),
  "./terminalCSequencesEvaluations": loadTypeScript("apps/web/src/data/courseDocuments/terminalCSequencesEvaluations.ts"),
});
const sequencesPath = loadTypeScript("apps/web/src/data/terminalCSequencesPath.ts", {
  "./courseDocuments/terminalCSequencesDocument": sequencesDocument,
});
const complexGeometryPath = loadTypeScript("apps/web/src/data/terminalCComplexGeometryPath.ts");
const isometriesPath = loadTypeScript("apps/web/src/data/terminalCIsometriesPath.ts");
const integralDocument = loadTypeScript("apps/web/src/data/courseDocuments/terminalCIntegralDocument.ts", {
  "./terminalCIntegralSummaryA": loadTypeScript("apps/web/src/data/courseDocuments/terminalCIntegralSummaryA.ts"),
  "./terminalCIntegralSummaryB": loadTypeScript("apps/web/src/data/courseDocuments/terminalCIntegralSummaryB.ts"),
  "./terminalCIntegralEvaluations": loadTypeScript("apps/web/src/data/courseDocuments/terminalCIntegralEvaluations.ts"),
});
const integralCalculusPath = loadTypeScript("apps/web/src/data/terminalCIntegralCalculusPath.ts", {
  "./courseDocuments/terminalCIntegralDocument": integralDocument,
  "./officialMathPathBuilder": builder,
});
const directSimilaritiesPath = loadTypeScript("apps/web/src/data/terminalCDirectSimilaritiesPath.ts");
const probabilityDocument = loadTypeScript("apps/web/src/data/courseDocuments/terminalCProbabilityDocument.ts", {
  "./terminalCProbabilitySummaryA": loadTypeScript("apps/web/src/data/courseDocuments/terminalCProbabilitySummaryA.ts"),
  "./terminalCProbabilitySummaryB": loadTypeScript("apps/web/src/data/courseDocuments/terminalCProbabilitySummaryB.ts"),
  "./terminalCProbabilityEvaluations": loadTypeScript("apps/web/src/data/courseDocuments/terminalCProbabilityEvaluations.ts"),
});
const probabilityPath = loadTypeScript("apps/web/src/data/terminalCProbabilityPath.ts", {
  "./courseDocuments/terminalCProbabilityDocument": probabilityDocument,
});
const differentialDocument = loadTypeScript("apps/web/src/data/courseDocuments/terminalCDifferentialDocument.ts", {
  "./terminalCDifferentialSummary": loadTypeScript("apps/web/src/data/courseDocuments/terminalCDifferentialSummary.ts"),
  "./terminalCDifferentialEvaluations": loadTypeScript("apps/web/src/data/courseDocuments/terminalCDifferentialEvaluations.ts"),
});
const differentialEquationsPath = loadTypeScript("apps/web/src/data/terminalCDifferentialEquationsPath.ts", {
  "./courseDocuments/terminalCDifferentialDocument": differentialDocument,
});
const statisticsPath = loadTypeScript("apps/web/src/data/terminalCStatisticsPath.ts",{
  "./courseDocuments/terminalCStatisticsDocument":loadStatisticsDocument(loadTypeScript),
});
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
  "./terminalCComplexNumbersPath": complexNumbersPath,
  "./terminalCExponentialPowerPath": exponentialPowerPath,
});
const c11to15 = loadTypeScript("apps/web/src/data/terminalCMathPaths11to15.ts", {
  "./officialMathPathBuilder": builder,
  "./terminalCLcmGcdPath": lcmGcdPath,
  "./terminalCSequencesPath": sequencesPath,
  "./terminalCComplexGeometryPath": complexGeometryPath,
  "./terminalCIsometriesPath": isometriesPath,
  "./terminalCIntegralCalculusPath": integralCalculusPath,
});
const c16to19 = loadTypeScript("apps/web/src/data/terminalCMathPaths16to19.ts", {
  "./officialMathPathBuilder": builder,
  "./terminalCDirectSimilaritiesPath": directSimilaritiesPath,
  "./terminalCProbabilityPath": probabilityPath,
  "./terminalCDifferentialEquationsPath": differentialEquationsPath,
  "./terminalCStatisticsPath": statisticsPath,
});
const dModule = loadTypeScript("apps/web/src/data/terminalDMathPaths.ts", {
  "./terminalCDMathSharing": loadTypeScript("apps/web/src/data/terminalCDMathSharing.ts"),
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
