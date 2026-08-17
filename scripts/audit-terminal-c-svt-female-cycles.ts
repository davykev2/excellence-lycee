import assert from "node:assert/strict";
import { terminalCSvtFemaleCyclesPath } from "../apps/web/src/data/terminalCSvtFemaleCyclesPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const path = applyLessonXpBudget(terminalCSvtFemaleCyclesPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "cycle-landmarks-menarche",
  "ovarian-cycle-follicle-ovulation",
  "uterine-cycle-endometrium",
  "pituitary-ovarian-hormone-curves",
  "experimental-control-ovary-pituitary",
  "hypothalamic-pituitary-ovarian-axis",
  "negative-positive-feedback",
  "rabbit-endometrium-assessment",
  "integrated-cycle-final-mission",
];
const expectedXp = [670, 810, 890, 960, 1040, 1110, 1260, 1480, 1780];
const expectedQuestionCounts = [10, 10, 10, 10, 10, 10, 10, 13, 12];

assert.equal(path.id, "terminale-c-svt-l7-female-sexual-cycles");
assert.deepEqual(path.levelIds, ["terminale-c"]);
assert.equal(path.chapterNumber, 7);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 95);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_400));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "timeline").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "curve").length, 2);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 1);
assert.ok(
  lessons.every(
    (lesson) => lesson.source?.documentTitle === "SVT Tle C_L7_Les cycles sexuels  chez la femme.pdf",
  ),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 95);
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.filter((question) => question.sourceLabel?.includes("page")).length >= 7);

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
assert.ok(shortAnswers.length >= 9);
assert.ok(shortAnswers.every((question) => (question.acceptedAnswers?.length ?? 0) > 0));

const serialized = JSON.stringify(path);
const mojibakeMarkers = ["ÃƒÂ©", "ÃƒÂ¨", "ÃƒÂª", "ÃƒÂ´", "ÃƒÂ®", "ÃƒÂ§", "Ã¢â‚¬â„¢", "Ã¢â‚¬Å“", "Ã¢â‚¬", "Ã‚Â°", "Ã‚Âµ", "ï¿½"];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(!serialized.includes("⃗"), "Une flèche combinante illisible a été introduite.");
assert.ok(serialized.includes("à 15 ans"));
assert.ok(serialized.includes("10 à 12 heures"));
assert.ok(serialized.includes("36 heures"));
assert.ok(serialized.includes("hCG"));
assert.ok(serialized.includes("inhibine"));
assert.ok(serialized.includes("estradiol puis progestérone"));
assert.ok(serialized.includes("2, 3, 4 et 6"));
assert.ok(serialized.includes("interstitielles"));
assert.ok(serialized.includes("Courbe originale en indice relatif"));
assert.ok(serialized.includes("Représentation pédagogique originale"));

console.log("Audit SVT Tle C L7 valide : 9 niveaux, 95 questions, 9 interactions originales et 10 000 XP.");
