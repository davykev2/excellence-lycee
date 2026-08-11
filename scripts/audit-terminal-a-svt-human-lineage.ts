import assert from "node:assert/strict";
import { terminalSvtPaths } from "../apps/web/src/data/terminalSvtPaths";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const rawPath = terminalSvtPaths.find((item) => item.id === "terminale-svt-l4-human-lineage");
assert.ok(rawPath, "Le parcours sur l’évolution de la lignée humaine est introuvable.");

const path = applyLessonXpBudget(rawPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "terminale-svt-l4-human-lineage-overview",
  "terminale-svt-l4-human-lineage-cranial-transformations",
  "terminale-svt-l4-human-lineage-bipedal-stature",
  "terminale-svt-l4-human-lineage-molecular-parentage",
  "terminale-svt-l4-human-lineage-evolution-theories",
  "terminale-svt-l4-human-lineage-mission-finale",
];
const expectedXp = [1080, 1490, 1620, 1760, 1890, 2160];
const expectedQuestionCounts = [11, 11, 11, 11, 11, 13];

assert.deepEqual(path.levelIds, ["terminale-a"]);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants historiques ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 68);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_500));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 3);
assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === "SVT TA_L4_Lévolution de la lignée humaine.pdf"),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 68);
assert.ok(questions.every((question) => question.options.length >= 2));
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.filter((question) => question.sourceLabel?.includes("page")).length >= 20);
assert.deepEqual(
  [...new Set(questions.map((question) => question.correctIndex))].sort(),
  [0, 1, 2, 3],
  "Les bonnes réponses doivent occuper les quatre positions.",
);

const serialized = JSON.stringify(path);
const mojibakeMarkers = ["Ã©", "Ã¨", "Ãª", "Ã´", "Ã®", "Ã§", "Â°", "Âµ", "â€™", "â€œ", "â€", "â†", "Å“"];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(serialized.includes("évolution humaine est buissonnante"));
assert.ok(serialized.includes("bras relativement plus courts"));
assert.ok(serialized.includes("abréviation internationale de la tyrosine est **TYR**"));
assert.ok(serialized.includes("mutations ne sont pas « orientées par la sélection »"));
assert.ok(serialized.includes("volume cérébral seul ne suffit pas à mesurer l’intelligence"));
assert.ok(serialized.includes("Figure originale") || serialized.includes("Schéma original"));

console.log("Audit SVT Tle A L4 valide : 6 niveaux, 68 questions, 3 schémas originaux et 10 000 XP.");
