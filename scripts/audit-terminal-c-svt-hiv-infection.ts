import assert from "node:assert/strict";
import { terminalCSvtHivInfectionPath } from "../apps/web/src/data/terminalCSvtHivInfectionPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const path = applyLessonXpBudget(terminalCSvtHivInfectionPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "virion-structure",
  "cd4-entry-fusion",
  "reverse-transcription-integration",
  "viral-expression-assembly",
  "acute-infection-seroconversion",
  "chronic-phase-aids",
  "transmission-prevention-treatment",
  "official-sequence-gap-exercises",
  "mother-child-diagnosis-final-mission",
];
const expectedXp = [640, 780, 920, 990, 1060, 1210, 1280, 1420, 1700];
const expectedQuestionCounts = [11, 11, 11, 11, 12, 11, 11, 13, 15];

assert.equal(path.id, "terminale-c-svt-l6-hiv-infection");
assert.deepEqual(path.levelIds, ["terminale-c"]);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 106);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_500));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "timeline").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 1);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "curve").length, 2);
assert.ok(
  lessons.every(
    (lesson) => lesson.source?.documentTitle === "SVT Tle C_L6_Linfection de lorganisme par le VIH.pdf",
  ),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 106);
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.filter((question) => question.sourceLabel?.includes("page")).length >= 9);

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
assert.ok(!serialized.includes("⃗"), "Une flèche combinante illisible a été introduite.");
assert.ok(serialized.includes("CCR5"));
assert.ok(serialized.includes("CXCR4"));
assert.ok(serialized.includes("protéase"));
assert.ok(serialized.includes("fenêtre sérologique"));
assert.ok(serialized.includes("200 cellules par millimètre cube"));
assert.ok(serialized.includes("indétectable = intransmissible"));
assert.ok(serialized.includes("72 heures"));
assert.ok(serialized.includes("IgG maternelles"));
assert.ok(serialized.includes("moins de 18 mois"));
assert.ok(serialized.includes("2 - 4 - 3 - 5 - 1"));
assert.ok(serialized.includes("Figure pédagogique originale"));
assert.ok(serialized.includes("Courbe originale en indice relatif"));

console.log("Audit SVT Tle C L6 valide : 9 niveaux, 106 questions, 9 interactions originales et 10 000 XP.");
