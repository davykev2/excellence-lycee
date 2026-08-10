import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const source = readFileSync(
  new URL("../apps/web/src/data/terminalCDSpontaneousNuclearPath.ts", import.meta.url),
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

const path = module.exports.spontaneousNuclearPath;
const lessons = path.modules.flatMap((item) => item.lessons);
const expectedIds = [
  "spontaneous-nuclear-rutherford-structure",
  "spontaneous-nuclear-nuclides-isotopes-unit",
  "spontaneous-nuclear-emissions",
  "spontaneous-nuclear-conservation-alpha",
  "spontaneous-nuclear-beta-gamma-application",
  "spontaneous-nuclear-decay-law",
  "spontaneous-nuclear-half-life-curve",
  "spontaneous-nuclear-activity-dating",
  "spontaneous-nuclear-polonium-mission",
];
const expectedWeights = [45, 55, 65, 75, 85, 95, 105, 115, 130];
const expectedQuestionCounts = [12, 13, 14, 14, 14, 14, 14, 15, 17];
const questionCount = lessons.reduce((total, lesson) => total + (lesson.questions?.length ?? 0), 0);

assert.equal(path.id, "terminale-cd-spontaneous-nuclear");
assert.deepEqual(path.levelIds, ["terminale-c", "terminale-d"]);
assert.equal(path.chapterNumber, 18);
assert.deepEqual(path.chapterNumberByLevel, { "terminale-c": 18, "terminale-d": 14 });
assert.equal(path.theme.title, "Réactions nucléaires");
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants de la leçon ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedWeights, "Les poids XP Web ont changé.");
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La répartition des exercices a changé.",
);
assert.equal(questionCount, 127, "La leçon doit publier 127 réponses évaluables.");
assert.equal(path.estimatedMinutes, 230, "La durée de la progression a changé.");
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
  lessons.every((lesson) => lesson.source?.documentTitle === "Leçon 18 (TCE) 14 (TD) - Réactions nucléaires spontanées.pdf"),
  "La référence au document source a changé.",
);
assert.equal(
  lessons.find((lesson) => lesson.id === "spontaneous-nuclear-decay-law")?.interaction.rule.points.length,
  11,
  "La courbe exponentielle a perdu des points.",
);
assert.equal(
  lessons.find((lesson) => lesson.id === "spontaneous-nuclear-half-life-curve")?.interaction.rule.points.length,
  5,
  "La courbe des demi-vies a perdu des points.",
);
assert.equal(
  lessons.find((lesson) => lesson.id === "spontaneous-nuclear-polonium-mission")?.interaction.rule.points.length,
  6,
  "La linéarisation du polonium a perdu des mesures.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "spontaneous-nuclear-beta-gamma-application")?.concept.bodyMarkdown ?? "",
  /\\nu_e[\s\S]+\\bar\{\\nu\}_e[\s\S]+\^\{210\}_\{84\}/,
  "Les neutrinos ou l'activité officielle corrigée ont disparu.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "spontaneous-nuclear-decay-law")?.concept.bodyMarkdown ?? "",
  /\\ln\\left\(\\frac\{N\(t\)\}\{N_0\}\\right\)=-\\lambda t/,
  "La constante d'intégration corrigée n'est plus matérialisée.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "spontaneous-nuclear-half-life-curve")?.concept.bodyMarkdown ?? "",
  /4\{,\}5\\times10\^9[\s\S]+7\{,\}0\\times10\^8/,
  "La correction de la demi-vie de l'uranium 235 a disparu.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "spontaneous-nuclear-polonium-mission")?.concept.bodyMarkdown ?? "",
  /209\{,\}9368[\s\S]+0\{,\}0058[\s\S]+5\{,\}3998[\s\S]+138\{,\}7/,
  "Les calculs officiels corrigés du polonium ne sont plus complets.",
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

assert.ok(formulaCount >= 230, "La richesse scientifique de la leçon a diminué : " + formulaCount + " formules.");
console.log("KaTeX valide : " + formulaCount + " formules, " + lessons.length + " niveaux et " + questionCount + " questions.");
