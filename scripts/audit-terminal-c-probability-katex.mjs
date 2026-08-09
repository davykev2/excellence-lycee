import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const source = readFileSync(
  new URL("../apps/web/src/data/terminalCProbabilityPath.ts", import.meta.url),
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

const path = module.exports.terminalCProbabilityPath;
const lessons = path.modules.flatMap((item) => item.lessons);
const expectedIds = [
  "conditional-probability",
  "product-independence",
  "partition-total-probability",
  "random-variable-law",
  "expectation-variance",
  "bernoulli-binomial",
  "binomial-parameters",
  "cumulative-distribution",
];
const expectedWeights = [50, 55, 60, 65, 70, 75, 80, 85];
const questionCount = lessons.reduce((total, lesson) => total + (lesson.questions?.length ?? 1), 0);

assert.deepEqual(
  lessons.map((lesson) => lesson.id),
  expectedIds,
  "Les identifiants historiques de la leçon 17 ont changé.",
);
assert.deepEqual(
  lessons.map((lesson) => lesson.xp),
  expectedWeights,
  "Les poids XP historiques de la leçon 17 ont changé.",
);
assert.equal(questionCount, 132, "Le nombre de questions publiées a changé sans mise à jour du descriptif.");
assert.ok(
  lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_400),
  "Un niveau est trop compact pour être considéré comme enrichi.",
);
assert.ok(
  lessons.every((lesson) => (lesson.questions?.length ?? 0) >= 12),
  "Chaque niveau doit proposer un entraînement substantiel.",
);
assert.equal(
  lessons.filter((lesson) => lesson.interaction.kind === "diagram").length,
  6,
  "Les six diagrammes interactifs de la leçon doivent rester présents.",
);
assert.equal(
  lessons.filter((lesson) => lesson.interaction.kind === "schema").length,
  2,
  "Les deux schémas interactifs de la leçon doivent rester présents.",
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
const unrepairedFormulaFragments = [
  "Age0",
  "Ble1",
  "kge0",
  "kne0",
  "nle10",
  "Vge0",
];

for (const [location, value] of strings) {
  for (const match of value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)) {
    formulaCount += 1;
    const tex = match[1] ?? match[2];
    const unrepairedFragment = unrepairedFormulaFragments.find((fragment) => tex.includes(fragment));
    if (unrepairedFragment) {
      errors.push({ location, tex, message: "Commande TeX non restaurée : " + unrepairedFragment });
      continue;
    }
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(tex)) {
      errors.push({ location, tex, message: "Caractère de contrôle résiduel dans la formule." });
      continue;
    }
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

console.log(
  "KaTeX valide : " +
    formulaCount +
    " formules contrôlées dans " +
    lessons.length +
    " niveaux et " +
    questionCount +
    " questions.",
);
