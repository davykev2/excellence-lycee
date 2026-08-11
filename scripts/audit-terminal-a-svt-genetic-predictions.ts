import assert from "node:assert/strict";
import { terminalSvtPaths } from "../apps/web/src/data/terminalSvtPaths";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const rawPath = terminalSvtPaths.find((item) => item.id === "terminale-svt-l6-genetic-predictions");
assert.ok(rawPath, "Le parcours sur les prévisions génétiques est introuvable.");

const path = applyLessonXpBudget(rawPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "terminale-svt-l6-genetic-predictions-overview",
  "terminale-svt-l6-genetic-predictions-pedigree-method",
  "terminale-svt-l6-genetic-predictions-sickle-cell",
  "terminale-svt-l6-genetic-predictions-hemophilia-x-linked",
  "terminale-svt-l6-genetic-predictions-screening-counseling",
  "terminale-svt-l6-genetic-predictions-mission-finale",
];
const expectedXp = [1080, 1490, 1620, 1760, 1890, 2160];
const expectedQuestionCounts = [9, 10, 12, 10, 10, 12];

assert.deepEqual(path.levelIds, ["terminale-a"]);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants historiques ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 63);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_500));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 3);
assert.ok(
  lessons.every(
    (lesson) => lesson.source?.documentTitle === "SVT TA_L6_Les prévisions génétiques.pdf",
  ),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 63);
assert.ok(questions.every((question) => question.options.length >= 2));
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.filter((question) => question.sourceLabel?.includes("page")).length >= 29);
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
assert.ok(serialized.includes("électrophorèse sépare des hémoglobines"));
assert.ok(serialized.includes("Le numéro 5 apparaît sans symbole"));
assert.ok(serialized.includes("facteurs VIII ou IX"));
assert.ok(serialized.includes("10-13 semaines"));
assert.ok(serialized.includes("libre et éclairée"));
assert.ok(serialized.includes("Figure originale") || serialized.includes("figure originale"));

console.log("Audit SVT Tle A L6 valide : 6 niveaux, 63 questions, 3 schémas originaux et 10 000 XP.");
