import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const source = readFileSync(
  new URL("../apps/web/src/data/terminalCDChargedParticlePath.ts", import.meta.url),
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
    throw new Error("Dépendance inattendue pendant l'audit KaTeX.");
  },
);

const path = module.exports.chargedParticlePath;
const lessons = path.modules.flatMap((item) => item.lessons);
const expectedIds = [
  "charged-particle-lorentz-force",
  "charged-particle-lorentz-orientation",
  "charged-particle-circular-motion",
  "charged-particle-magnetic-deflection",
  "charged-particle-mass-spectrograph",
  "charged-particle-cyclotron-principle",
  "charged-particle-cyclotron-energy",
  "charged-particle-wien-filter",
  "charged-particle-instruments-mission",
];
const expectedWeights = [45, 55, 65, 75, 85, 95, 105, 115, 130];
const expectedQuestionCounts = [10, 10, 12, 10, 12, 12, 12, 10, 12];
const questionCount = lessons.reduce((total, lesson) => total + (lesson.questions?.length ?? 0), 0);

assert.equal(path.id, "terminale-cd-charged-particle-magnetic-field");
assert.deepEqual(path.levelIds, ["terminale-c", "terminale-d"]);
assert.equal(path.chapterNumber, 7);
assert.deepEqual(path.chapterNumberByLevel, { "terminale-c": 7, "terminale-d": 6 });
assert.equal(path.theme.title, "Électricité");
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants de la leçon ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedWeights, "Les poids XP Web ont changé.");
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La répartition des exercices a changé.",
);
assert.equal(questionCount, 100, "La leçon doit publier 100 réponses évaluables.");
assert.equal(path.estimatedMinutes, 244, "La durée de la progression a changé.");
assert.ok(
  lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_800),
  "Chaque niveau doit conserver un cours substantiel.",
);
assert.ok(
  lessons.every((lesson) => ["orbit", "schema", "diagram", "timeline"].includes(lesson.interaction.kind ?? "numeric")),
  "Une interaction inattendue a remplacé les dispositifs pédagogiques de la leçon.",
);
assert.equal(
  lessons.filter((lesson) => lesson.source?.fidelity === "faithful-corrected").length,
  9,
  "Les corrections documentées du PDF ont disparu.",
);
assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === "Mouvement d'une particule chargée dans un champ magnétique uniforme.pdf"),
  "La référence au document source a changé.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "charged-particle-circular-motion")?.concept.bodyMarkdown ?? "",
  /module[\s\S]+vecteur[\s\S]+ne l'est pas/,
  "La correction de l'accélération vectorielle a disparu.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "charged-particle-magnetic-deflection")?.concept.bodyMarkdown ?? "",
  /1\{,\}61\\times10\^\{-2\}/,
  "Le calcul de la déflexion officielle a disparu.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "charged-particle-mass-spectrograph")?.concept.bodyMarkdown ?? "",
  /20\{,\}4\\ \\mathrm\{cm\}/,
  "La séparation des ions bromure a disparu.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "charged-particle-cyclotron-energy")?.concept.bodyMarkdown ?? "",
  /2\{,\}48\\times10\^\{-12\}/,
  "L'énergie maximale du cyclotron a disparu.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "charged-particle-instruments-mission")?.concept.bodyMarkdown ?? "",
  /6\{,\}26\\ \\mathrm\{mm\}/,
  "La séparation isotopique de la mission a disparu.",
);
assert.doesNotMatch(source, /\u20d7/u, "Une flèche combinante illisible a été ajoutée au contenu brut.");

for (const lesson of lessons) {
  for (const question of lesson.questions ?? []) {
    if (question.type === "short-answer") {
      assert.ok(question.acceptedAnswers?.length, `Réponse courte sans réponse acceptée : ${lesson.id}`);
    } else {
      assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length, `QCM invalide : ${lesson.id}`);
    }
  }
}

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

for (const [index, lesson] of lessons.entries()) {
  const tex = lesson.interaction.formulaTex;
  if (!tex) continue;
  formulaCount += 1;
  try {
    katex.renderToString(tex, { displayMode: false, throwOnError: true, strict: "error" });
  } catch (error) {
    errors.push({
      location: "path.modules[0].lessons[" + index + "].interaction.formulaTex",
      tex,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

if (errors.length) {
  console.error(JSON.stringify(errors, null, 2));
  process.exit(1);
}

assert.ok(formulaCount >= 90, "La richesse scientifique de la leçon a diminué : " + formulaCount + " formules.");
console.log("KaTeX valide : " + formulaCount + " formules, " + lessons.length + " niveaux et " + questionCount + " questions.");
