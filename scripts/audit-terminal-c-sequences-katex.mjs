import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const source = readFileSync(
  new URL("../apps/web/src/data/terminalCSequencesPath.ts", import.meta.url),
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

const path = module.exports.terminalCSequencesPath;
const lessons = path.modules.flatMap((item) => item.lessons);
const expectedIds = [
  "sequence-induction",
  "sequence-monotonicity",
  "sequence-limit-algebra",
  "monotone-convergence",
  "reference-sequences",
  "sequence-growth",
  "small-angle-sequence",
  "recursive-sequence-limit",
];
const expectedWeights = [50, 55, 60, 65, 70, 75, 80, 85];

assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants historiques de la leçon 12 ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedWeights, "Les poids XP historiques de la leçon 12 ont changé.");
assert.equal(path.chapterNumber, 12, "La numérotation de la leçon 12 a changé.");
assert.deepEqual(path.levelIds, ["terminale-c"], "La leçon doit rester rattachée à la Terminale C.");

const questionCount = lessons.reduce((total, lesson) => total + (lesson.questions?.length ?? 1), 0);
assert.equal(questionCount, 79, "La leçon 12 doit publier exactement 79 réponses évaluables.");

for (const lesson of lessons) {
  assert.ok(
    (lesson.concept.bodyMarkdown?.length ?? 0) >= 900,
    `Le niveau ${lesson.id} n’est pas suffisamment enrichi.`,
  );
  assert.equal(lesson.source?.documentTitle, "TC Maths leçon 12 Suites numériques.pdf");
  assert.ok(lesson.source?.pages, `Pages sources absentes pour ${lesson.id}.`);
  assert.ok((lesson.questions?.length ?? 0) >= 4, `Le niveau ${lesson.id} ne contient pas assez d’exercices.`);
}

assert.ok(
  !lessons.some((lesson) => lesson.concept.bodyMarkdown?.includes("SITUATION D’APPRENTISSAGE")),
  "La situation d’apprentissage introductive ne doit pas être reproduite dans le cours.",
);

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
