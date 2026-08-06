import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const source = readFileSync(
  new URL("../apps/web/src/data/terminalCLcmGcdPath.ts", import.meta.url),
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

const path = module.exports.terminalCLcmGcdPath;
const lessons = path.modules.flatMap((item) => item.lessons);
const expectedIds = [
  "common-multiples-lcm",
  "common-divisors-gcd",
  "euclidean-algorithm",
  "bezout-identity",
  "gauss-theorem",
  "gcd-lcm-relation",
  "diophantine-solvability",
  "diophantine-congruences",
];
const expectedWeights = [50, 55, 60, 65, 70, 75, 80, 85];

assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants historiques de la leçon 11 ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedWeights, "Les poids XP historiques de la leçon 11 ont changé.");

const questionCount = lessons.reduce((total, lesson) => total + (lesson.questions?.length ?? 1), 0);
assert.equal(questionCount, 36, "La leçon 11 doit publier exactement les 36 réponses évaluables du dossier validé.");

const strings = [];

function collectStrings(value, location = "path") {
  if (typeof value === "string") {
    strings.push([location, value]);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${location}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => collectStrings(item, `${location}.${key}`));
  }
}

collectStrings(path);

const errors = [];
let formulaCount = 0;

for (const [location, value] of strings) {
  for (const match of value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)) {
    formulaCount += 1;
    const tex = match[1] ?? match[2];
    try {
      katex.renderToString(tex, {
        displayMode: Boolean(match[1]),
        throwOnError: true,
        strict: "error",
      });
    } catch (error) {
      errors.push({ location, tex, message: error instanceof Error ? error.message : String(error) });
    }
  }
}

if (errors.length) {
  console.error(JSON.stringify(errors, null, 2));
  process.exit(1);
}

console.log(`KaTeX valide : ${formulaCount} formules contrôlées dans ${lessons.length} niveaux et ${questionCount} questions.`);
