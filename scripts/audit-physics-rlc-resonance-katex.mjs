import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const source = readFileSync(
  new URL("../apps/web/src/data/terminalCDRlcResonancePath.ts", import.meta.url),
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

const path = module.exports.rlcIntensityResonancePath;
const lessons = path.modules.flatMap((item) => item.lessons);
const expectedIds = [
  "resonance-experimental-curve",
  "resonance-frequency-condition",
  "resonance-bandwidth-three-db",
  "resonance-quality-selectivity",
  "resonance-overvoltage-applications",
  "resonance-official-evaluation-audit",
  "resonance-official-exercises-one-three",
  "resonance-characterization-lab-mission",
  "resonance-oscilloscope-radio-mission",
];
const expectedWeights = [45, 55, 65, 75, 85, 95, 105, 115, 130];
const expectedQuestionCounts = [13, 13, 13, 13, 13, 15, 16, 16, 15];
const questionCount = lessons.reduce((total, lesson) => total + (lesson.questions?.length ?? 0), 0);

assert.equal(path.id, "terminale-cd-rlc-intensity-resonance");
assert.deepEqual(path.levelIds, ["terminale-c", "terminale-d"]);
assert.equal(path.chapterNumber, 14);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants de la leçon ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedWeights, "Les poids XP Web ont changé.");
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La répartition des exercices a changé.",
);
assert.equal(questionCount, 127, "La leçon doit publier 127 réponses évaluables.");
assert.ok(
  lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_500),
  "Chaque niveau doit conserver un cours substantiel.",
);
assert.ok(
  lessons.every((lesson) => ["numeric", "curve", "schema", "diagram", "timeline"].includes(lesson.interaction.kind ?? "numeric")),
  "Une interaction inattendue a remplacé les dispositifs pédagogiques de la leçon.",
);
assert.ok(
  lessons.filter((lesson) => lesson.source?.fidelity === "faithful-corrected").length >= 7,
  "Les corrections documentées du PDF ont disparu.",
);
assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === "Tle D PHY L14 Résonance d’intensité by Tehua.pdf"),
  "La référence au document source a changé.",
);
assert.equal(
  lessons.find((lesson) => lesson.id === "resonance-experimental-curve")?.interaction.rule.points.length,
  22,
  "Les 22 mesures de la première courbe ne sont plus toutes disponibles.",
);
assert.equal(
  lessons.find((lesson) => lesson.id === "resonance-characterization-lab-mission")?.interaction.rule.points.length,
  13,
  "Les 13 mesures de l’exercice 4 ne sont plus toutes disponibles.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "resonance-experimental-curve")?.concept.bodyMarkdown ?? "",
  /92\{,\}0\$ MHz|92\{,\}0\$ \*\*MHz\*\*/,
  "La correction MHz de la situation RTI n’est plus visible.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "resonance-official-exercises-one-three")?.concept.bodyMarkdown ?? "",
  /202\{,\}6\\ \\mu\\text\{F\}/,
  "La capacité corrigée de l’exercice 1 n’est plus visible.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "resonance-official-evaluation-audit")?.concept.bodyMarkdown ?? "",
  /Aucun circuit RLC idéal unique/,
  "L’incompatibilité de la situation d’évaluation n’est plus explicitée.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "resonance-characterization-lab-mission")?.concept.bodyMarkdown ?? "",
  /2\{,\}49\\ \\mu\\text\{F\}/,
  "La capacité restaurée de l’exercice 4 n’est plus visible.",
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

assert.ok(formulaCount >= 110, "La richesse scientifique de la leçon a diminué : " + formulaCount + " formules.");
console.log("KaTeX valide : " + formulaCount + " formules, " + lessons.length + " niveaux et " + questionCount + " questions.");
