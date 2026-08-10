import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const source = readFileSync(
  new URL("../apps/web/src/data/terminalCWaveLightPath.ts", import.meta.url),
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

const path = module.exports.waveLightPath;
const lessons = path.modules.flatMap((item) => item.lessons);
const expectedIds = [
  "wave-light-diffraction-observation",
  "wave-light-diffraction-geometry",
  "wave-light-young-interference",
  "wave-light-path-difference-fringes",
  "wave-light-electromagnetic-spectrum",
  "wave-light-official-evaluation-laser",
  "wave-light-official-young-diffraction",
  "wave-light-frequency-table-lab",
  "wave-light-measurement-spectrum-mission",
];
const expectedWeights = [45, 55, 65, 75, 85, 95, 105, 115, 130];
const expectedQuestionCounts = [13, 13, 14, 14, 13, 14, 15, 15, 16];
const questionCount = lessons.reduce((total, lesson) => total + (lesson.questions?.length ?? 0), 0);

assert.equal(path.id, "terminale-c-wave-light");
assert.deepEqual(path.levelIds, ["terminale-c"]);
assert.equal(path.chapterNumber, 16);
assert.equal(path.theme.title, "La lumière : onde ou particule");
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
  lessons.every((lesson) => ["curve", "schema", "diagram", "timeline"].includes(lesson.interaction.kind ?? "numeric")),
  "Une interaction inattendue a remplacé les dispositifs pédagogiques de la leçon.",
);
assert.ok(
  lessons.filter((lesson) => lesson.source?.fidelity === "faithful-corrected").length >= 8,
  "Les corrections documentées du PDF ont disparu.",
);
assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === "Tle D PHY L16 Modèle ondulatoire de la lumière by Tehua.pdf"),
  "La référence au document source a changé.",
);
assert.equal(
  lessons.find((lesson) => lesson.id === "wave-light-diffraction-geometry")?.interaction.rule.points.length,
  7,
  "La courbe de largeur de diffraction a perdu des points.",
);
assert.equal(
  lessons.find((lesson) => lesson.id === "wave-light-path-difference-fringes")?.interaction.rule.points.length,
  81,
  "La figure d’interférences n’est plus suffisamment précise.",
);
assert.equal(
  lessons.find((lesson) => lesson.id === "wave-light-frequency-table-lab")?.interaction.rule.points.length,
  9,
  "La courbe spectrale a perdu des points.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "wave-light-official-evaluation-laser")?.concept.bodyMarkdown ?? "",
  /678\{,\}75[\s\S]+679/,
  "La longueur d’onde corrigée du pointeur n’est plus visible.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "wave-light-frequency-table-lab")?.concept.bodyMarkdown ?? "",
  /420[\s\S]+550[\s\S]+600[\s\S]+750/,
  "Le tableau spectral corrigé n’est plus visible.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "wave-light-frequency-table-lab")?.concept.bodyMarkdown ?? "",
  /0\{,\}10\\\s+\\text\{mm\}/,
  "La largeur de fente corrigée en millimètres n’est plus visible.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "wave-light-measurement-spectrum-mission")?.concept.bodyMarkdown ?? "",
  /3\{,\}15\\times10\^\{-3\}[\s\S]+630\\\s+\\text\{nm\}/,
  "La puissance de dix corrigée de la mission n’est plus visible.",
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

assert.ok(formulaCount >= 180, "La richesse scientifique de la leçon a diminué : " + formulaCount + " formules.");
console.log("KaTeX valide : " + formulaCount + " formules, " + lessons.length + " niveaux et " + questionCount + " questions.");
