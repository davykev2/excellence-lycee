import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";

const source = readFileSync(
  new URL("../apps/web/src/data/terminalCDLaplaceLawPath.ts", import.meta.url),
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

const path = module.exports.laplaceLawPath;
const lessons = path.modules.flatMap((item) => item.lessons);
const expectedIds = [
  "laplace-force-experiments",
  "laplace-vector-law-characteristics",
  "laplace-force-direction",
  "laplace-force-magnitude",
  "cotton-balance-measurement",
  "laplace-force-applications",
  "official-laplace-exercises",
  "laplace-measurement-equilibrium-mission",
];
const expectedWeights = [45, 55, 60, 65, 75, 80, 95, 115];
const expectedQuestionCounts = [7, 8, 8, 9, 8, 8, 12, 16];
const questionCount = lessons.reduce((total, lesson) => total + (lesson.questions?.length ?? 0), 0);

assert.equal(path.id, "terminale-cd-laplace-law");
assert.deepEqual(path.levelIds, ["terminale-c", "terminale-d"]);
assert.equal(path.chapterNumber, 8);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants de la leçon 08 ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedWeights, "Les poids XP Web ont changé.");
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La répartition des exercices a changé.",
);
assert.equal(questionCount, 76, "La leçon doit publier 76 réponses évaluables.");
assert.ok(
  lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 850),
  "Chaque niveau doit conserver un cours substantiel.",
);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "curve").length, 2);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 2);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "timeline").length, 1);
assert.equal(lessons.filter((lesson) => lesson.source?.fidelity === "faithful-corrected").length, 2);
assert.equal(
  lessons.find((lesson) => lesson.id === "laplace-force-magnitude")?.interaction.formulaTex,
  "F(\\alpha)=1{,}20\\lvert\\sin\\alpha\\rvert",
  "La formule interactive F(α) a perdu ses commandes LaTeX.",
);
assert.equal(
  lessons.find((lesson) => lesson.id === "laplace-measurement-equilibrium-mission")?.interaction.formulaTex,
  "I\\,(\\mathrm{A})\\approx1{,}6\\,m\\,(\\mathrm{g})",
  "La formule interactive I=f(m) a perdu ses commandes LaTeX.",
);
assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === "TleD_PHY_L8_Loi de Laplace.pdf"),
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
      location: `path.modules[0].lessons[${index}].interaction.formulaTex`,
      tex,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

if (errors.length) {
  console.error(JSON.stringify(errors, null, 2));
  process.exit(1);
}

assert.ok(formulaCount >= 55, "La richesse scientifique de la leçon a diminué : " + formulaCount + " formules.");
console.log(`KaTeX valide : ${formulaCount} formules, ${lessons.length} niveaux et ${questionCount} questions.`);
