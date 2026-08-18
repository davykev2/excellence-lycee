import assert from "node:assert/strict";
import { terminalCSvtHumanHeredityPath } from "../apps/web/src/data/terminalCSvtHumanHeredityPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const path = applyLessonXpBudget(terminalCSvtHumanHeredityPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "pedigree-method-notation",
  "albinism-recessive-evidence",
  "albinism-autosomal-test",
  "brachydactyly-dominant-autosomal",
  "abo-codominance-polyallelism",
  "red-green-x-linked-recessive",
  "inheritance-mode-decision-method",
  "official-two-pedigrees-assessment",
  "nodules-pedigree-final-mission",
];
const expectedXp = [630, 770, 910, 980, 1050, 1190, 1260, 1470, 1740];
const expectedQuestionCounts = [10, 10, 10, 10, 10, 10, 10, 13, 13];

assert.equal(path.id, "terminale-c-svt-l8-human-heredity");
assert.deepEqual(path.levelIds, ["terminale-c"]);
assert.equal(path.chapterNumber, 8);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 96);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_600));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 5);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "timeline").length, 2);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 2);
assert.ok(
  lessons.every(
    (lesson) => lesson.source?.documentTitle === "SVT Tle C_L8_La transmission dun caractère héréditaire chez lHomme.pdf",
  ),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 96);
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.filter((question) => question.sourceLabel?.includes("page")).length >= 20);

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
const mojibakeMarkers = ["ÃƒÂ©", "ÃƒÂ¨", "ÃƒÂª", "ÃƒÂ´", "ÃƒÂ®", "ÃƒÂ`", "Ã¢â‚¬â„¢", "Ã¢â‚¬Å“", "Ã¢â‚¬", "Ã‚Â°", "Ã‚Âµ", "ï¿½"];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(!serialized.includes("⃗"), "Une flèche combinante illisible a été introduite.");
assert.ok(serialized.includes("hémizygote"));
assert.ok(serialized.includes("chromosome 9"));
assert.ok(serialized.includes("polyallélisme"));
assert.ok(serialized.includes("groupe A"));
assert.ok(serialized.includes("1/64"));
assert.ok(serialized.includes("rare ne signifie pas impossible"));
assert.ok(serialized.includes("Leçon 7"));
assert.ok(serialized.includes("Représentation pédagogique originale"));

const formulaCount = (serialized.match(/\$[^$]+\$/g) ?? []).length;
assert.ok(formulaCount >= 120, `La couverture mathématique et génétique a régressé : ${formulaCount} formules.`);

console.log("Audit SVT Tle C L8 valide : 9 niveaux, 96 questions, 9 interactions originales et 10 000 XP.");
