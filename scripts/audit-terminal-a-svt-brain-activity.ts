import assert from "node:assert/strict";
import { terminalSvtPaths } from "../apps/web/src/data/terminalSvtPaths";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const rawPath = terminalSvtPaths.find((item) => item.id === "terminale-svt-l2-brain-activity");
assert.ok(rawPath, "Le parcours de l’activité cérébrale est introuvable.");

const path = applyLessonXpBudget(rawPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "terminale-svt-l2-brain-activity-overview",
  "terminale-svt-l2-brain-activity-cerebral-areas",
  "terminale-svt-l2-brain-activity-movement-preparation",
  "terminale-svt-l2-brain-activity-movement-execution",
  "terminale-svt-l2-brain-activity-memory",
  "terminale-svt-l2-brain-activity-mission-finale",
];
const expectedXp = [1080, 1490, 1620, 1760, 1890, 2160];
const expectedQuestionCounts = [6, 14, 10, 8, 12, 9];

assert.deepEqual(path.levelIds, ["terminale-a"]);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants historiques ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 59);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_200));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 3);
assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === "SVT TA_L2_Lactivité cérébrale chez lHomme.pdf"),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 59);
assert.ok(questions.every((question) => question.options.length >= 2));
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.filter((question) => question.sourceLabel?.includes("page")).length >= 25);
assert.ok(new Set(questions.map((question) => question.correctIndex)).size >= 4, "Les bonnes réponses ne doivent pas toutes occuper la même position.");

const serialized = JSON.stringify(path);
assert.ok(!/[ÃƒÃ‚]|â€™|â€“|â†/.test(serialized), "Du texte mal décodé a été introduit.");
assert.ok(serialized.includes("Figure originale redessinée"));
assert.ok(serialized.includes("plasticité synaptique"));
assert.ok(serialized.includes("réactivation coordonnée de réseaux neuronaux"));
assert.ok(serialized.includes("Le sillon de Rolando est présenté avec son nom moderne"));
assert.ok(serialized.includes("l’activation indique seulement le recrutement des réseaux moteurs testés"));

console.log("Audit SVT Tle A L2 valide : 6 niveaux, 59 questions, 3 schémas originaux et 10 000 XP.");
