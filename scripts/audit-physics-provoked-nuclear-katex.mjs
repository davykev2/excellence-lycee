import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const source = readFileSync(
  new URL("../apps/web/src/data/terminalCDProvokedNuclearPath.ts", import.meta.url),
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

const path = module.exports.provokedNuclearPath;
const lessons = path.modules.flatMap((item) => item.lessons);
const expectedIds = [
  "provoked-nuclear-mass-defect",
  "provoked-nuclear-binding-energy",
  "provoked-nuclear-fission-chain",
  "provoked-nuclear-fusion-transmutation",
  "provoked-nuclear-energy-balance",
  "provoked-nuclear-iodine-yttrium-exercise",
  "provoked-nuclear-carbon-beta-exercise",
  "provoked-nuclear-breeder-safety",
  "provoked-nuclear-uranium-mission",
];
const expectedWeights = [45, 55, 65, 75, 85, 95, 105, 115, 130];
const expectedQuestionCounts = [12, 13, 14, 14, 14, 14, 14, 15, 17];
const questionCount = lessons.reduce((total, lesson) => total + (lesson.questions?.length ?? 0), 0);

assert.equal(path.id, "terminale-cd-provoked-nuclear");
assert.deepEqual(path.levelIds, ["terminale-c", "terminale-d"]);
assert.equal(path.chapterNumber, 19);
assert.deepEqual(path.chapterNumberByLevel, { "terminale-c": 19, "terminale-d": 15 });
assert.equal(path.theme.title, "Réactions nucléaires");
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants de la leçon ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedWeights, "Les poids XP Web ont changé.");
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La répartition des exercices a changé.",
);
assert.equal(questionCount, 127, "La leçon doit publier 127 réponses évaluables.");
assert.equal(path.estimatedMinutes, 233, "La durée de la progression a changé.");
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
  lessons.every((lesson) => lesson.source?.documentTitle === "Leçon 19 (TC) / 15 (TD) - Réactions nucléaires provoquées.pdf"),
  "La référence au document source a changé.",
);
assert.equal(
  lessons.find((lesson) => lesson.id === "provoked-nuclear-binding-energy")?.interaction.rule.points.length,
  7,
  "La courbe de cohésion a perdu des points.",
);
assert.equal(
  lessons.find((lesson) => lesson.id === "provoked-nuclear-breeder-safety")?.interaction.rule.points.length,
  5,
  "La courbe de révision des demi-vies a perdu des points.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "provoked-nuclear-fusion-transmutation")?.concept.bodyMarkdown ?? "",
  /transmutation provoquée[\s\S]+pas d'une fusion/,
  "La correction de classement K-39 + alpha a disparu.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "provoked-nuclear-iodine-yttrium-exercise")?.concept.bodyMarkdown ?? "",
  /b=94[\s\S]+0\{,\}18898[\s\S]+176\{,\}03/,
  "Les corrections de l'exercice iode-yttrium ont disparu.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "provoked-nuclear-carbon-beta-exercise")?.concept.bodyMarkdown ?? "",
  /\\bar\\nu_e[\s\S]+\\nu_e[\s\S]+gamma/,
  "Les neutrinos ou la précision sur gamma ont disparu.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "provoked-nuclear-uranium-mission")?.concept.bodyMarkdown ?? "",
  /x=39[\s\S]+0\{,\}215[\s\S]+200\{,\}27[\s\S]+8\{,\}21\\times10\^\{13\}/,
  "Les calculs corrigés de la mission uranium ont disparu.",
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

assert.ok(formulaCount >= 100, "La richesse scientifique de la leçon a diminué : " + formulaCount + " formules.");
console.log("KaTeX valide : " + formulaCount + " formules, " + lessons.length + " niveaux et " + questionCount + " questions.");
