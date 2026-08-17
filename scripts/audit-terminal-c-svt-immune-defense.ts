import assert from "node:assert/strict";
import { terminalCSvtImmuneDefensePath } from "../apps/web/src/data/terminalCSvtImmuneDefensePath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const path = applyLessonXpBudget(terminalCSvtImmuneDefensePath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "barriers-innate-immunity",
  "inflammation-recruitment",
  "phagocytosis-infection-spread",
  "complement-innate-effectors",
  "adaptive-specificity-experiments",
  "antibodies-humoral-immunity",
  "cellular-immunity-lymphoid-organs",
  "grafts-self-nonself-hla",
  "antigen-presentation-clonal-selection",
  "adaptive-effectors-memory",
  "newborn-immunity-final-mission",
];
const expectedXp = [540, 600, 660, 780, 840, 900, 900, 1030, 1090, 1210, 1450];
const expectedQuestionCounts = [10, 10, 10, 10, 11, 11, 10, 10, 10, 10, 14];

assert.equal(path.id, "terminale-c-svt-l5-immune-defense");
assert.deepEqual(path.levelIds, ["terminale-c"]);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 116);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_400));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 5);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "timeline").length, 4);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 1);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "curve").length, 1);
assert.ok(
  lessons.every(
    (lesson) => lesson.source?.documentTitle === "SVT Tle C_L5_Le système de défense de lorganisme.pdf",
  ),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 116);
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.filter((question) => question.sourceLabel?.includes("page")).length >= 10);

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
assert.ok(shortAnswers.length >= 11);
assert.ok(shortAnswers.every((question) => (question.acceptedAnswers?.length ?? 0) > 0));

const serialized = JSON.stringify(path);
const mojibakeMarkers = ["ÃƒÂ©", "ÃƒÂ¨", "ÃƒÂª", "ÃƒÂ´", "ÃƒÂ®", "ÃƒÂ§", "Ã¢â‚¬â„¢", "Ã¢â‚¬Å“", "Ã¢â‚¬", "Ã‚Â°", "Ã‚Âµ", "ï¿½"];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(serialized.includes("phagolysosome"));
assert.ok(serialized.includes("C3b"));
assert.ok(serialized.includes("IgM et certaines IgG"));
assert.ok(serialized.includes("anatoxine"));
assert.ok(serialized.includes("T CD4"));
assert.ok(serialized.includes("T CD8"));
assert.ok(serialized.includes("cellules dendritiques"));
assert.ok(serialized.includes("co-stimulation"));
assert.ok(serialized.includes("perforine"));
assert.ok(serialized.includes("granzymes"));
assert.ok(serialized.includes("apoptose"));
assert.ok(serialized.includes("IgG maternelles"));
assert.ok(serialized.includes("fenêtre de vulnérabilité"));
assert.ok(serialized.includes("toutes les substances immunitaires du sérum ne sont pas des anticorps"));
assert.ok(serialized.includes("Courbe originale en indice relatif"));
assert.ok(serialized.includes("Figure originale annotée"));

console.log("Audit SVT Tle C L5 valide : 11 niveaux, 116 questions, 11 interactions originales et 10 000 XP.");
