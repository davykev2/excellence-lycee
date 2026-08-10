import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const source = readFileSync(
  new URL("../apps/web/src/data/terminalCCorpuscularLightPath.ts", import.meta.url),
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

const path = module.exports.corpuscularLightPath;
const lessons = path.modules.flatMap((item) => item.lessons);
const expectedIds = [
  "corpuscular-light-photoelectric-photons",
  "corpuscular-light-planck-einstein",
  "corpuscular-light-quantized-transitions-spectra",
  "corpuscular-light-hydrogen-levels-ionization",
  "corpuscular-light-sodium-evaluation",
  "corpuscular-light-capture-concepts",
  "corpuscular-light-hydrogen-transition-lab",
  "corpuscular-light-absorption-thresholds",
  "corpuscular-light-balmer-mission",
];
const expectedWeights = [45, 55, 65, 75, 85, 95, 105, 115, 130];
const expectedQuestionCounts = [13, 13, 14, 14, 13, 14, 15, 15, 16];
const questionCount = lessons.reduce((total, lesson) => total + (lesson.questions?.length ?? 0), 0);

assert.equal(path.id, "terminale-c-corpuscular-light");
assert.deepEqual(path.levelIds, ["terminale-c"]);
assert.equal(path.chapterNumber, 17);
assert.equal(path.theme.title, "La lumière : onde ou particule");
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants de la leçon ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedWeights, "Les poids XP Web ont changé.");
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La répartition des exercices a changé.",
);
assert.equal(questionCount, 127, "La leçon doit publier 127 réponses évaluables.");
assert.equal(path.estimatedMinutes, 246, "La durée de la progression a changé.");
assert.ok(
  lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_500),
  "Chaque niveau doit conserver un cours substantiel.",
);
assert.ok(
  lessons.every((lesson) => ["curve", "schema", "diagram", "timeline"].includes(lesson.interaction.kind ?? "numeric")),
  "Une interaction inattendue a remplacé les dispositifs pédagogiques de la leçon.",
);
assert.equal(
  lessons.filter((lesson) => lesson.source?.fidelity === "faithful-corrected").length,
  9,
  "Les corrections documentées du PDF ont disparu.",
);
assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === "Tle D PHY L17 Modèle corpusculaire Lumière by Tehua.pdf"),
  "La référence au document source a changé.",
);
assert.equal(
  lessons.find((lesson) => lesson.id === "corpuscular-light-planck-einstein")?.interaction.rule.points.length,
  6,
  "La courbe photoélectrique a perdu des points.",
);
assert.equal(
  lessons.find((lesson) => lesson.id === "corpuscular-light-hydrogen-levels-ionization")?.interaction.rule.points.length,
  8,
  "La courbe des niveaux de l'hydrogène a perdu des points.",
);
assert.equal(
  lessons.find((lesson) => lesson.id === "corpuscular-light-capture-concepts")?.interaction.rule.points.length,
  8,
  "La courbe énergie-longueur d'onde a perdu des points.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "corpuscular-light-sodium-evaluation")?.concept.bodyMarkdown ?? "",
  /589[\s\S]+2\{,\}105[\s\S]+0\{,\}86/,
  "La situation corrigée du sodium n'est plus complète.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "corpuscular-light-capture-concepts")?.concept.bodyMarkdown ?? "",
  /3\{,\}00\\times10\^8[\s\S]+91\{,\}2\\ \\text\{nm\}/,
  "La célérité et la longueur d'onde corrigées de l'exercice 1 ont disparu.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "corpuscular-light-hydrogen-transition-lab")?.concept.bodyMarkdown ?? "",
  /13\{,\}6[\s\S]+656[\s\S]+121\{,\}7/,
  "L'exercice 3 corrigé n'est plus complet.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "corpuscular-light-absorption-thresholds")?.concept.bodyMarkdown ?? "",
  /12\{,\}75[\s\S]+18[\s\S]+4\{,\}4\\ \\text\{eV\}/,
  "La décision excitation-ionisation de l'exercice 4 a disparu.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "corpuscular-light-balmer-mission")?.concept.bodyMarkdown ?? "",
  /656[\s\S]+486[\s\S]+434[\s\S]+410[\s\S]+Rayleigh/,
  "La série de Balmer ou la correction documentaire a disparu.",
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

assert.ok(formulaCount >= 150, "La richesse scientifique de la leçon a diminué : " + formulaCount + " formules.");
console.log("KaTeX valide : " + formulaCount + " formules, " + lessons.length + " niveaux et " + questionCount + " questions.");
