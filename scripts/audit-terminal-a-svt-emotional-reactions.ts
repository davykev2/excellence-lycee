import assert from "node:assert/strict";
import { terminalSvtPaths } from "../apps/web/src/data/terminalSvtPaths";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const rawPath = terminalSvtPaths.find((item) => item.id === "terminale-svt-l1-emotional-reactions");
assert.ok(rawPath, "Le parcours des réactions émotionnelles est introuvable.");

const path = applyLessonXpBudget(rawPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "terminale-svt-l1-emotional-reactions-overview",
  "terminale-svt-l1-emotional-reactions-manifestations",
  "terminale-svt-l1-emotional-reactions-causes-stressors",
  "terminale-svt-l1-emotional-reactions-nervous-regulation",
  "terminale-svt-l1-emotional-reactions-hormonal-regulation",
  "terminale-svt-l1-emotional-reactions-mission-finale",
];
const expectedXp = [1080, 1490, 1620, 1760, 1890, 2160];
const expectedQuestionCounts = [5, 8, 8, 8, 10, 9];

assert.deepEqual(path.levelIds, ["terminale-a"]);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants historiques ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 48);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_100));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 4);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 2);
assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === "SVT TA_L1_Les réactions émotionnelles chez lHomme.pdf"),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 48);
assert.ok(questions.every((question) => question.options.length >= 2));
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.filter((question) => question.sourceLabel?.includes("page 10")).length >= 9);
assert.ok(new Set(questions.map((question) => question.correctIndex)).size >= 3, "Les bonnes réponses ne doivent pas toutes occuper la même position.");

const serialized = JSON.stringify(path);
assert.ok(!/[ÃÂ]|â€™|â€“|â†/.test(serialized), "Du texte mal décodé a été introduit.");
assert.ok(!serialized.includes("sujets très agressifs"), "La formulation stigmatisante du document ne doit pas être republiée.");
assert.ok(serialized.includes("rétrocontrôle négatif"));
assert.ok(serialized.includes("Figure originale redessinée"));

console.log("Audit SVT Tle A L1 valide : 6 niveaux, 48 questions, 2 schémas originaux et 10 000 XP.");
