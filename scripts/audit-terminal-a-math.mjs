import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadTypeScript(relativePath) {
  const source = readFileSync(resolve(root, relativePath), "utf8");
  const javaScript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  new Function("exports", "module", javaScript)(module.exports, module);
  return module.exports;
}

const polynomial = loadTypeScript("apps/web/src/data/terminalAPolynomialRationalPath.ts");
const probability = loadTypeScript("apps/web/src/data/terminalAProbabilityPath.ts");
const logarithm = loadTypeScript("apps/web/src/data/terminalANaturalLogPath.ts");
const exponential = loadTypeScript("apps/web/src/data/terminalAExponentialPath.ts");
const sequences = loadTypeScript("apps/web/src/data/terminalASequencesPath.ts");
const statistics = loadTypeScript("apps/web/src/data/terminalAStatisticsPath.ts");
const linearSystems = loadTypeScript("apps/web/src/data/terminalALinearSystemsPath.ts");
const primitives = loadTypeScript("apps/web/src/data/terminalAPrimitivesIntegralsPath.ts");

const paths = [
  polynomial.terminalAPolynomialRationalPath,
  probability.terminalA1ProbabilityPath,
  probability.terminalA2ProbabilityPath,
  logarithm.terminalANaturalLogPath,
  exponential.terminalAExponentialPath,
  sequences.terminalASequencesPath,
  statistics.terminalABivariateStatisticsPath,
  linearSystems.terminalALinearSystemsPath,
  primitives.terminalAPrimitivesIntegralsPath,
];

if (paths.some((path) => !path) || paths.length !== 9) {
  throw new Error(`9 parcours Terminale A attendus, ${paths.filter(Boolean).length} reçus.`);
}

const apiSource = readFileSync(resolve(root, "apps/api/src/curriculum.ts"), "utf8");
const apiRewards = new Map();
for (const match of apiSource.matchAll(/\["(terminale-a[^":]*):([^"]+)",\s*(\d+)\]/g)) {
  apiRewards.set(`${match[1]}:${match[2]}`, Number(match[3]));
}

function normalize(levels) {
  const totalWeight = levels.reduce((sum, level) => sum + level.xp, 0);
  const allocations = levels.map((level, index) => {
    const rawUnits = 1000 * level.xp / totalWeight;
    const baseUnits = Math.floor(rawUnits);
    return { ...level, index, baseUnits, fraction: rawUnits - baseUnits };
  });
  const remaining = 1000 - allocations.reduce((sum, item) => sum + item.baseUnits, 0);
  const bonuses = new Set(
    [...allocations]
      .sort((a, b) => b.fraction - a.fraction || a.id.localeCompare(b.id) || a.index - b.index)
      .slice(0, remaining)
      .map((item) => item.index),
  );
  return new Map(allocations.map((item) => [item.id, (item.baseUnits + (bonuses.has(item.index) ? 1 : 0)) * 10]));
}

const report = [];
let levelCount = 0;
let questionCount = 0;
for (const path of paths) {
  const levels = path.modules.flatMap((moduleItem) => moduleItem.lessons);
  const ids = new Set();
  for (const level of levels) {
    if (ids.has(level.id)) throw new Error(`Identifiant dupliqué : ${path.id}:${level.id}`);
    ids.add(level.id);
    const questions = level.questions?.length ?? 0;
    if (questions === 0) throw new Error(`Exercice manquant : ${path.id}:${level.id}`);
    if (!level.source?.documentTitle || !level.source?.pages) throw new Error(`Source manquante : ${path.id}:${level.id}`);
    const apiWeight = apiRewards.get(`${path.id}:${level.id}`);
    if (apiWeight !== level.xp) {
      throw new Error(`Poids incohérent pour ${path.id}:${level.id} (web=${level.xp}, api=${apiWeight ?? "absent"}).`);
    }
    questionCount += questions;
  }

  const totalXp = [...normalize(levels).values()].reduce((sum, xp) => sum + xp, 0);
  if (totalXp !== 10_000) throw new Error(`Budget incorrect pour ${path.id}: ${totalXp} XP.`);
  levelCount += levels.length;
  report.push({ path: path.id, levels: levels.length, questions: levels.reduce((sum, level) => sum + level.questions.length, 0), totalXp });
}

if (levelCount !== 85) throw new Error(`85 niveaux attendus, ${levelCount} reçus.`);
if (questionCount !== 497) throw new Error(`497 questions attendues, ${questionCount} reçues.`);

console.table(report);
console.log(`Audit réussi : 8 leçons officielles, 9 parcours, ${levelCount} niveaux, ${questionCount} questions et 90 000 XP.`);
