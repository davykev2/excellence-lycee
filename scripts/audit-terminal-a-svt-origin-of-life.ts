import assert from "node:assert/strict";
import { terminalSvtPaths } from "../apps/web/src/data/terminalSvtPaths";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const rawPath = terminalSvtPaths.find((item) => item.id === "terminale-svt-l3-origin-of-life");
assert.ok(rawPath, "Le parcours sur l’origine de la vie est introuvable.");

const path = applyLessonXpBudget(rawPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "terminale-svt-l3-origin-of-life-overview",
  "terminale-svt-l3-origin-of-life-early-earth-evidence",
  "terminale-svt-l3-origin-of-life-photosynthesis-oxygenation",
  "terminale-svt-l3-origin-of-life-extreme-environments",
  "terminale-svt-l3-origin-of-life-experimental-origin",
  "terminale-svt-l3-origin-of-life-mission-finale",
];
const expectedXp = [1080, 1490, 1620, 1760, 1890, 2160];
const expectedQuestionCounts = [7, 10, 10, 9, 12, 10];

assert.deepEqual(path.levelIds, ["terminale-a"]);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants historiques ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 58);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_800));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 3);
assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === "SVT TA_L3_Lorigine de la vie.pdf"),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 58);
assert.ok(questions.every((question) => question.options.length >= 2));
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.filter((question) => question.sourceLabel?.includes("page")).length >= 30);
assert.equal(new Set(questions.map((question) => question.correctIndex)).size, 4, "Les bonnes réponses doivent occuper les quatre positions.");

const serialized = JSON.stringify(path);
const mojibakeMarkers = ["Ã©", "Ã¨", "Ãª", "Ã´", "Ã®", "Ã§", "Â°", "Âµ", "â€™", "â€œ", "â€", "â†", "Å“"];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(serialized.includes("Figure originale redessinée"));
assert.ok(serialized.includes("Sulfolobus"));
assert.ok(serialized.includes("photosynthèse oxygénique dépend de la lumière"));
assert.ok(serialized.includes("Grande Oxygénation"));
assert.ok(serialized.includes("Un coacervat est une gouttelette"));
assert.ok(serialized.includes("transition exacte vers la première cellule reste inconnue"));
assert.ok(serialized.includes("compartiment, information, énergie, autorégulation et reproduction"));

console.log("Audit SVT Tle A L3 valide : 6 niveaux, 58 questions, 3 schémas originaux et 10 000 XP.");
