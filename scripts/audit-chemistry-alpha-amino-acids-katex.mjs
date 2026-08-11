import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const source = readFileSync(new URL("../apps/web/src/data/terminalDAlphaAminoAcidsPath.ts", import.meta.url), "utf8");
const javaScript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const module = { exports: {} };
new Function("exports", "module", "require", javaScript)(module.exports, module, () => {
  throw new Error("Dépendance inattendue pendant l'audit KaTeX.");
});

const path = module.exports.alphaAminoAcidsPath;
const lessons = path.modules.flatMap((item) => item.lessons);
const expectedIds = [
  "alpha-amino-structure-nomenclature",
  "alpha-amino-zwitterion-acid-base",
  "peptide-bond-condensation-hydrolysis",
  "peptide-selective-synthesis",
  "alpha-amino-composition-identification",
  "dipeptide-molar-mass",
  "peptides-proteins-biuret",
  "alpha-amino-final-mission",
];
const expectedWeights = [45, 55, 60, 70, 75, 80, 75, 95];
const expectedQuestionCounts = [10, 12, 13, 14, 14, 14, 12, 15];
const questionCount = lessons.reduce((total, lesson) => total + (lesson.questions?.length ?? 0), 0);

assert.equal(path.id, "terminale-d-chemistry-alpha-amino-acids");
assert.deepEqual(path.levelIds, ["terminale-d"]);
assert.equal(path.chapterNumber, 21);
assert.equal(path.theme.title, "Chimie organique");
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants de la leçon ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedWeights, "Les poids XP Web ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.questions?.length ?? 0), expectedQuestionCounts, "La répartition des exercices a changé.");
assert.equal(questionCount, 104, "La leçon doit publier 104 réponses évaluables.");
assert.equal(path.estimatedMinutes, 212, "La durée de la progression a changé.");
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_400), "Chaque niveau doit conserver un cours substantiel.");
assert.ok(lessons.every((lesson) => ["diagram", "timeline"].includes(lesson.interaction.kind ?? "numeric")), "Une interaction inattendue a remplacé les cartes pédagogiques.");
assert.equal(lessons.filter((lesson) => lesson.source?.fidelity === "faithful-corrected").length, 8, "Les corrections documentées du PDF ont disparu.");
assert.ok(lessons.every((lesson) => lesson.source?.documentTitle === "TleD_CH_L12_Acides alpha aminés.pdf"), "La référence au document source a changé.");
assert.match(lessons.find((lesson) => lesson.id === "alpha-amino-zwitterion-acid-base")?.concept.bodyMarkdown ?? "", /milieu basique[\s\S]+anion/, "La correction de la forme anionique a disparu.");
assert.match(lessons.find((lesson) => lesson.id === "peptide-selective-synthesis")?.concept.bodyMarkdown ?? "", /Protéger[\s\S]+Activer[\s\S]+Coupler[\s\S]+Déprotéger/, "La démarche de synthèse sélective a disparu.");
assert.match(lessons.find((lesson) => lesson.id === "alpha-amino-composition-identification")?.concept.bodyMarkdown ?? "", /40\{,\}45[\s\S]+35\{,\}96[\s\S]+C_3H_7NO_2/, "L'identification par composition massique a disparu.");
assert.match(lessons.find((lesson) => lesson.id === "dipeptide-molar-mass")?.concept.bodyMarkdown ?? "", /2\\times14[\s\S]+M\(R\)=188-173=15/, "La correction du bilan massique a disparu.");

for (const lesson of lessons) {
  for (const question of lesson.questions ?? []) {
    if (question.type === "short-answer") assert.ok(question.acceptedAnswers?.length, `Réponse courte sans réponse acceptée : ${lesson.id}`);
    else assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length, `QCM invalide : ${lesson.id}`);
  }
}

const strings = [];
function collectStrings(value, location = "path") {
  if (typeof value === "string") strings.push([location, value]);
  else if (Array.isArray(value)) value.forEach((item, index) => collectStrings(item, location + "[" + index + "]"));
  else if (value && typeof value === "object") Object.entries(value).forEach(([key, item]) => collectStrings(item, location + "." + key));
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
