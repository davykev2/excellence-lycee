import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const webSourcePath = resolve(projectRoot, "apps/web/src/data/terminalAMathFaithfulCoursePaths.ts");
const apiSourcePath = resolve(projectRoot, "apps/api/src/curriculum.ts");

const webJavaScript = ts.transpileModule(readFileSync(webSourcePath, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const module = { exports: {} };
new Function("exports", "module", webJavaScript)(module.exports, module);

const paths = module.exports.terminalAAdditionalMathPaths;
if (!Array.isArray(paths) || paths.length !== 8) {
  throw new Error(`8 parcours complémentaires attendus, ${paths?.length ?? 0} reçus.`);
}

const apiSource = readFileSync(apiSourcePath, "utf8");
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
for (const path of paths) {
  const levels = path.modules.flatMap((moduleItem) => moduleItem.lessons);
  const ids = new Set();
  for (const level of levels) {
    if (ids.has(level.id)) throw new Error(`Identifiant dupliqué : ${path.id}:${level.id}`);
    ids.add(level.id);
    if (!level.questions?.length) throw new Error(`Exercice manquant : ${path.id}:${level.id}`);
    if (!level.source?.documentTitle || !level.source?.pages) throw new Error(`Source manquante : ${path.id}:${level.id}`);
    const apiWeight = apiRewards.get(`${path.id}:${level.id}`);
    if (apiWeight !== level.xp) {
      throw new Error(`Poids incohérent pour ${path.id}:${level.id} (web=${level.xp}, api=${apiWeight ?? "absent"}).`);
    }
  }

  const normalized = normalize(levels);
  const totalXp = [...normalized.values()].reduce((sum, xp) => sum + xp, 0);
  if (totalXp !== 10_000) throw new Error(`Budget incorrect pour ${path.id}: ${totalXp} XP.`);
  report.push({ path: path.id, levels: levels.length, questions: levels.reduce((sum, level) => sum + level.questions.length, 0), totalXp });
}

console.table(report);
