import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const source = readFileSync(
  new URL("../apps/web/src/data/terminalCDFreeMechanicalOscillationsPath.ts", import.meta.url),
  "utf8",
);
const javaScript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const module = { exports: {} };

new Function("exports", "module", "require", javaScript)(
  module.exports,
  module,
  () => {
    throw new Error("Dépendance inattendue pendant l’audit KaTeX.");
  },
);

const path = module.exports.freeMechanicalOscillationsPath;
const lessons = path.modules.flatMap((item) => item.lessons);
const expectedIds = [
  "free-oscillation-basics",
  "spring-mass-force-model",
  "free-oscillation-equation",
  "harmonic-solution-initial-conditions",
  "oscillation-graphs-phase",
  "mechanical-energy-conservation",
  "official-fixation-exercises",
  "suspension-oscillator-mission",
];
const expectedWeights = [45, 55, 65, 70, 70, 80, 90, 105];
const expectedQuestionCounts = [6, 6, 6, 6, 6, 6, 7, 8];
const questionCount = lessons.reduce((total, lesson) => total + (lesson.questions?.length ?? 0), 0);

assert.equal(path.id, "terminale-cd-free-mechanical-oscillations");
assert.deepEqual(path.levelIds, ["terminale-c", "terminale-d"]);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants de la leçon 05 ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedWeights, "Les poids XP Web ont changé.");
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La répartition des exercices a changé.",
);
assert.equal(questionCount, 51, "La leçon doit publier 51 réponses évaluables.");
assert.ok(
  lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 900),
  "Chaque niveau doit conserver un cours substantiel.",
);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "curve").length, 2);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 1);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 2);
assert.equal(lessons.filter((lesson) => lesson.source?.fidelity === "faithful-corrected").length, 5);
assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === "TleD_PHY_L5_Oscillations mécaniques libres.pdf"),
  "La référence au document officiel a changé.",
);

const strings = [];
function collectStrings(value, location = "path") {
  if (typeof value === "string") {
    strings.push([location, value]);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, location + "[" + index + "]"));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => collectStrings(item, location + "." + key));
  }
}
collectStrings(path);

const errors = [];
let formulaCount = 0;
for (const [location, value] of strings) {
  for (const match of value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)) {
    formulaCount += 1;
    const tex = match[1] ?? match[2];
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(tex)) {
      errors.push({ location, tex, message: "Caractère de contrôle résiduel." });
      continue;
    }
    try {
      katex.renderToString(tex, { displayMode: Boolean(match[1]), throwOnError: true, strict: "error" });
    } catch (error) {
      errors.push({ location, tex, message: error instanceof Error ? error.message : String(error) });
    }
  }
}

if (errors.length) {
  console.error(JSON.stringify(errors, null, 2));
  process.exit(1);
}

assert.ok(formulaCount >= 85, "La richesse scientifique de la leçon a diminué : " + formulaCount + " formules.");
console.log(`KaTeX valide : ${formulaCount} formules, ${lessons.length} niveaux et ${questionCount} questions.`);
