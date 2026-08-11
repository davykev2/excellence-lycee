import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const source = readFileSync(
  new URL("../apps/web/src/data/terminalDAminesPath.ts", import.meta.url),
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

const path = module.exports.aminesPath;
const lessons = path.modules.flatMap((item) => item.lessons);
const expectedIds = [
  "amine-definition-classes",
  "amine-nomenclature-isomers",
  "amine-basicity",
  "amine-nucleophilicity-alkylation",
  "amine-formula-mass-percentage",
  "amine-hofmann-synthesis",
  "amine-identification-mission",
];
const expectedWeights = [45, 55, 60, 65, 75, 80, 95];
const expectedQuestionCounts = [12, 16, 10, 14, 11, 10, 13];
const questionCount = lessons.reduce((total, lesson) => total + (lesson.questions?.length ?? 0), 0);

assert.equal(path.id, "terminale-d-chemistry-amines");
assert.deepEqual(path.levelIds, ["terminale-d"]);
assert.equal(path.chapterNumber, 18);
assert.equal(path.theme.title, "Chimie organique");
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants de la leçon ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedWeights, "Les poids XP Web ont changé.");
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La répartition des exercices a changé.",
);
assert.equal(questionCount, 86, "La leçon doit publier 86 réponses évaluables.");
assert.equal(path.estimatedMinutes, 173, "La durée de la progression a changé.");
assert.ok(
  lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_200),
  "Chaque niveau doit conserver un cours substantiel.",
);
assert.ok(
  lessons.every((lesson) => ["diagram", "timeline"].includes(lesson.interaction.kind ?? "numeric")),
  "Une interaction inattendue a remplacé les cartes pédagogiques de la leçon.",
);
assert.equal(
  lessons.filter((lesson) => lesson.source?.fidelity === "faithful-corrected").length,
  6,
  "Les corrections documentées du PDF ont disparu.",
);
assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === "TleD_CH_L3_ Les amines.pdf"),
  "La référence au document source a changé.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "amine-nomenclature-isomers")?.concept.bodyMarkdown ?? "",
  /huit[\s\S]+N-méthylpropan-2-amine/,
  "L'isomère oublié de C4H11N a disparu.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "amine-nucleophilicity-alkylation")?.concept.bodyMarkdown ?? "",
  /ion alkylammonium[\s\S]+déprotonation/,
  "La correction du bilan d'alkylation a disparu.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "amine-formula-mass-percentage")?.concept.bodyMarkdown ?? "",
  /1400[\s\S]+23\{,\}7[\s\S]+59\{,\}07/,
  "Le calcul massique officiel a disparu.",
);
assert.match(
  lessons.find((lesson) => lesson.id === "amine-hofmann-synthesis")?.concept.bodyMarkdown ?? "",
  /tétraéthylammonium[\s\S]+triéthylamine/,
  "La synthèse de l'exercice 4 a disparu.",
);

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

if (errors.length) {
  console.error(JSON.stringify(errors, null, 2));
  process.exit(1);
}

assert.ok(formulaCount >= 100, "La richesse scientifique de la leçon a diminué : " + formulaCount + " formules.");
console.log("KaTeX valide : " + formulaCount + " formules, " + lessons.length + " niveaux et " + questionCount + " questions.");
