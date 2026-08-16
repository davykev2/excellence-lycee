import assert from "node:assert/strict";
import { terminalCSvtCellEnergyPath } from "../apps/web/src/data/terminalCSvtCellEnergyPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const path = applyLessonXpBudget(terminalCSvtCellEnergyPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "aerobic-respiration-experiment",
  "anaerobic-fermentation-experiment",
  "respiration-fermentation-comparison",
  "mitochondrion-evidence-structure",
  "glycolysis-stage",
  "pyruvate-krebs-cycle",
  "respiratory-chain-atp-balance",
  "isolated-mitochondria-assessment",
  "muscle-energy-mission",
];
const expectedXp = [680, 830, 900, 980, 1050, 1200, 1280, 1430, 1650];
const expectedQuestionCounts = [10, 11, 10, 10, 11, 11, 10, 9, 12];

assert.equal(path.id, "terminale-c-svt-l3-cell-energy-production");
assert.deepEqual(path.levelIds, ["terminale-c"]);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 94);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_400));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 5);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 1);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "timeline").length, 1);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "curve").length, 2);
assert.ok(
  lessons.every(
    (lesson) => lesson.source?.documentTitle === "SVT Tle C_L3_La production dénergie par la cellule.pdf",
  ),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 94);
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.filter((question) => question.sourceLabel?.includes("page")).length >= 22);

const choices = questions.filter((question) => question.type === "choice");
const shortAnswers = questions.filter((question) => question.type === "short-answer");
assert.ok(choices.every((question) => question.options.length >= 2));
assert.ok(
  choices.every(
    (question) => question.correctIndex >= 0 && question.correctIndex < question.options.length,
  ),
  "Une bonne réponse sort de la liste des propositions.",
);
assert.deepEqual(
  [...new Set(choices.map((question) => question.correctIndex))].sort(),
  [0, 1, 2, 3],
  "Les bonnes réponses doivent occuper les quatre positions.",
);
assert.ok(shortAnswers.length >= 10);
assert.ok(shortAnswers.every((question) => (question.acceptedAnswers?.length ?? 0) > 0));

const serialized = JSON.stringify(path);
const mojibakeMarkers = ["ÃƒÂ©", "ÃƒÂ¨", "ÃƒÂª", "ÃƒÂ´", "ÃƒÂ®", "ÃƒÂ§", "Ã¢â‚¬â„¢", "Ã¢â‚¬Å“", "Ã¢â‚¬", "Ã‚Â°", "Ã‚Âµ", "ï¿½"];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(!serialized.includes("⃗"), "Les vecteurs doivent utiliser du LaTeX et non le caractère combiné U+20D7.");
assert.ok(serialized.includes("complexe pyruvate-déshydrogénase"));
assert.ok(serialized.includes("accepteur final d’électrons"));
assert.ok(serialized.includes("environ 30 à 32 ATP"));
assert.ok(serialized.includes("fermentation lactique"));
assert.ok(serialized.includes("actine–myosine"));
assert.ok(serialized.includes("9,5 mg/L"));
assert.ok(serialized.includes("Figure originale"));

const formulas = lessons.flatMap((lesson) =>
  [...(lesson.concept.bodyMarkdown ?? "").matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)]
    .map((match) => match[1] ?? match[2]),
);
assert.ok(formulas.length >= 35, "Les formules scientifiques du cours ne sont plus toutes présentes.");
assert.ok(
  formulas.every((formula) => !/(?<!\\)\b(?:mathrm|text)\s*\{/.test(formula)),
  "Une commande KaTeX a perdu son antislash dans une chaîne TypeScript.",
);
assert.ok(formulas.some((formula) => formula.includes("\\mathrm{C_6H_{12}O_6")));
assert.ok(formulas.some((formula) => formula.includes("2\\,C_2H_5OH + 2\\,CO_2")));
assert.ok(formulas.some((formula) => formula.includes("\\mathrm{O_2 + 4\\,e^-")));
assert.ok(formulas.some((formula) => formula.includes("2{,}5\\ ATP")));

console.log("Audit SVT Tle C L3 valide : 9 niveaux, 94 questions, 9 interactions originales et 10 000 XP.");
