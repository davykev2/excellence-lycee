import assert from "node:assert/strict";
import { terminalSvtPaths } from "../apps/web/src/data/terminalSvtPaths";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const rawPath = terminalSvtPaths.find((item) => item.id === "terminale-svt-l7-protein-biosynthesis");
assert.ok(rawPath, "Le parcours sur la biosynthèse des protéines est introuvable.");

const path = applyLessonXpBudget(rawPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "terminale-svt-l7-protein-biosynthesis-overview",
  "terminale-svt-l7-protein-biosynthesis-molecular-actors",
  "terminale-svt-l7-protein-biosynthesis-genetic-code",
  "terminale-svt-l7-protein-biosynthesis-transcription",
  "terminale-svt-l7-protein-biosynthesis-translation",
  "terminale-svt-l7-protein-biosynthesis-mission-finale",
];
const expectedXp = [1080, 1490, 1620, 1760, 1890, 2160];
const expectedQuestionCounts = [9, 10, 12, 13, 13, 14];

assert.deepEqual(path.levelIds, ["terminale-a"]);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants historiques ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 71);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_500));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 3);
assert.ok(
  lessons.every(
    (lesson) => lesson.source?.documentTitle === "SVT TA_L7_La biosynthèse des protéines.pdf",
  ),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 71);
assert.ok(questions.every((question) => question.options.length >= 2));
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.filter((question) => question.sourceLabel?.includes("page")).length >= 30);
assert.ok(
  questions.every(
    (question) => question.correctIndex >= 0 && question.correctIndex < question.options.length,
  ),
  "Une bonne réponse sort de la liste des propositions.",
);
assert.deepEqual(
  [...new Set(questions.map((question) => question.correctIndex))].sort(),
  [0, 1, 2, 3],
  "Les bonnes réponses doivent occuper les quatre positions.",
);

const serialized = JSON.stringify(path);
const mojibakeMarkers = ["ÃƒÂ©", "ÃƒÂ¨", "ÃƒÂª", "ÃƒÂ´", "ÃƒÂ®", "ÃƒÂ§", "Ã¢â‚¬â„¢", "Ã¢â‚¬Å“", "Ã¢â‚¬", "Ã‚Â°", "Ã‚Âµ", "ï¿½"];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(!serialized.includes("⃗"), "Les vecteurs doivent utiliser du LaTeX et non le caractère combiné U+20D7.");
assert.ok(serialized.includes("ARN polymérase"));
assert.ok(serialized.includes("brin matrice/transcrit"));
assert.ok(serialized.includes("quasi universel"));
assert.ok(serialized.includes("facteur de libération"));
assert.ok(serialized.includes("Cys–Tyr–Ile–Gln–Asn–Cys–Pro–Leu–Gly"));
assert.ok(serialized.includes("UGC→UGU silencieuse"));
assert.ok(serialized.includes("mélange thymine et uracile"));
assert.ok(serialized.includes("Figure originale") || serialized.includes("figure originale"));

console.log("Audit SVT Tle A L7 valide : 6 niveaux, 71 questions, 3 schémas originaux et 10 000 XP.");
