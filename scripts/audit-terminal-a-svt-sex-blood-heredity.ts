import assert from "node:assert/strict";
import { terminalSvtPaths } from "../apps/web/src/data/terminalSvtPaths";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const rawPath = terminalSvtPaths.find((item) => item.id === "terminale-svt-l5-sex-blood-heredity");
assert.ok(rawPath, "Le parcours sur l’hérédité du sexe et du groupe sanguin est introuvable.");

const path = applyLessonXpBudget(rawPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "terminale-svt-l5-sex-blood-heredity-overview",
  "terminale-svt-l5-sex-blood-heredity-abo-alleles",
  "terminale-svt-l5-sex-blood-heredity-abo-crosses",
  "terminale-svt-l5-sex-blood-heredity-sex-chromosomes",
  "terminale-svt-l5-sex-blood-heredity-sex-cross",
  "terminale-svt-l5-sex-blood-heredity-mission-finale",
];
const expectedXp = [1080, 1490, 1620, 1760, 1890, 2160];
const expectedQuestionCounts = [9, 10, 10, 9, 10, 11];

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
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_500));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 3);
assert.ok(
  lessons.every(
    (lesson) => lesson.source?.documentTitle === "SVT TA_L5_Lhérédité du sexe et du groupe sanguin chez lHomme.pdf",
  ),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 59);
assert.ok(questions.every((question) => question.options.length >= 2));
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.filter((question) => question.sourceLabel?.includes("page")).length >= 24);
assert.deepEqual(
  [...new Set(questions.map((question) => question.correctIndex))].sort(),
  [0, 1, 2, 3],
  "Les bonnes réponses doivent occuper les quatre positions.",
);

const serialized = JSON.stringify(path);
const mojibakeMarkers = ["Ã©", "Ã¨", "Ãª", "Ã´", "Ã®", "Ã§", "â€™", "â€œ", "â€", "Â°", "Âµ", "�"];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(serialized.includes("gène ABO est situé sur le chromosome 9"));
assert.ok(serialized.includes("ne prouve pas à lui seul une paternité"));
assert.ok(serialized.includes("RhD, les autres anticorps"));
assert.ok(serialized.includes("ni faute, ni volonté, ni mérite"));
assert.ok(serialized.includes("un seul type relativement au chromosome sexuel"));
assert.ok(serialized.includes("page 8 ne contient qu’un titre"));
assert.ok(serialized.includes("Figure originale") || serialized.includes("figure originale"));

console.log("Audit SVT Tle A L5 valide : 6 niveaux, 59 questions, 3 schémas originaux et 10 000 XP.");
