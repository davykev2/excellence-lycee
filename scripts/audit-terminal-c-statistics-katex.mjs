import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const source = readFileSync(
  new URL("../apps/web/src/data/terminalCStatisticsPath.ts", import.meta.url),
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

const path = module.exports.terminalCStatisticsPath;
const lessons = path.modules.flatMap((item) => item.lessons);
const expectedIds = [
  "scatter-plot",
  "mean-point",
  "covariance",
  "correlation",
  "regression-lines",
  "statistical-estimation",
];
const expectedWeights = [50, 55, 60, 65, 70, 75];
const expectedQuestionCounts = [14, 11, 12, 14, 15, 17];
const questionCount = lessons.reduce((total, lesson) => total + (lesson.questions?.length ?? 1), 0);

assert.deepEqual(
  lessons.map((lesson) => lesson.id),
  expectedIds,
  "Les identifiants historiques de la leçon 19 ont changé.",
);
assert.deepEqual(
  lessons.map((lesson) => lesson.xp),
  expectedWeights,
  "Les poids XP historiques de la leçon 19 ont changé.",
);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La répartition des exercices entre les niveaux a changé.",
);
assert.equal(questionCount, 83, "Le nombre de questions publiées a changé sans mise à jour du descriptif.");

const bodyLengths = lessons.map((lesson) => lesson.concept.bodyMarkdown?.length ?? 0);
assert.ok(
  bodyLengths.every((length) => length >= 1_100),
  "Un niveau est trop compact pour être considéré comme enrichi : " + bodyLengths.join(", ") + ".",
);
assert.ok(
  lessons.every((lesson) => (lesson.questions?.length ?? 0) >= 11),
  "Chaque niveau doit proposer un entraînement substantiel.",
);
assert.equal(
  lessons.filter((lesson) => lesson.interaction.kind === "schema").length,
  1,
  "Le nuage de points interactif doit rester présent.",
);
assert.equal(
  lessons.filter((lesson) => lesson.interaction.kind === "diagram").length,
  3,
  "Les trois cartes interactives de méthode doivent rester présentes.",
);
assert.equal(
  lessons.filter((lesson) => lesson.interaction.kind === "curve").length,
  2,
  "Les deux droites interactives doivent rester présentes.",
);
assert.equal(
  lessons.filter((lesson) => lesson.source?.fidelity === "faithful-corrected").length,
  5,
  "Les cinq groupes de corrections explicites du document source ont disparu.",
);
assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === "TC Maths leçon 19 Statistiques.pdf"),
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
  if (value.includes("\u20d7")) {
    errors.push({ location, tex: value, message: "Flèche combinante Unicode interdite." });
  }
  for (const match of value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)) {
    formulaCount += 1;
    const tex = match[1] ?? match[2];
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
      errors.push({
        location,
        tex,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

if (errors.length) {
  console.error(JSON.stringify(errors, null, 2));
  process.exit(1);
}

assert.ok(formulaCount >= 220, "La richesse mathématique de la leçon a diminué : " + formulaCount + " formules.");
console.log(
  "KaTeX valide : " +
    formulaCount +
    " formules contrôlées dans " +
    lessons.length +
    " niveaux et " +
    questionCount +
    " questions.",
);
