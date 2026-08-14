import assert from "node:assert/strict";
import { terminalCSvtDrugsPath } from "../apps/web/src/data/terminalCSvtDrugsPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const path = applyLessonXpBudget(terminalCSvtDrugsPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "experimental-effects",
  "normal-synapse",
  "stimulant-mechanisms",
  "inhibitory-modulation",
  "health-social-prevention",
  "amphetamine-cocaine-assessment",
  "consolidation-vocabulary",
  "cocaine-dopamine-mission",
];
const expectedXp = [770, 940, 1110, 1200, 1280, 1370, 1540, 1790];
const expectedQuestionCounts = [9, 10, 10, 10, 10, 9, 10, 11];

assert.equal(path.id, "terminale-c-svt-l2-drugs-nervous-system");
assert.deepEqual(path.levelIds, ["terminale-c"]);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 79);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_500));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 4);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 2);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "timeline").length, 1);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "curve").length, 1);
assert.ok(
  lessons.every(
    (lesson) => lesson.source?.documentTitle === "SVT Tle C_L2_Les drogues et le système nerveux.pdf",
  ),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 79);
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.filter((question) => question.sourceLabel?.includes("page")).length >= 25);

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
assert.ok(shortAnswers.length >= 7);
assert.ok(shortAnswers.every((question) => (question.acceptedAnswers?.length ?? 0) > 0));

const serialized = JSON.stringify(path);
const mojibakeMarkers = ["ÃƒÂ©", "ÃƒÂ¨", "ÃƒÂª", "ÃƒÂ´", "ÃƒÂ®", "ÃƒÂ§", "Ã¢â‚¬â„¢", "Ã¢â‚¬Å“", "Ã¢â‚¬", "Ã‚Â°", "Ã‚Âµ", "ï¿½"];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(!serialized.includes("⃗"), "Les vecteurs doivent utiliser du LaTeX et non le caractère combiné U+20D7.");
assert.ok(serialized.includes("transporteur de dopamine DAT"));
assert.ok(serialized.includes("substance P"));
assert.ok(serialized.includes("enképhalines"));
assert.ok(serialized.includes("5-HT2A"));
assert.ok(serialized.includes("45–60 %"));
assert.ok(serialized.includes("230 %"));
assert.ok(serialized.includes("personne qui consomme une substance"));
assert.ok(serialized.includes("Figure originale") || serialized.includes("figure originale"));

const formulas = lessons.flatMap((lesson) =>
  [...(lesson.concept.bodyMarkdown ?? "").matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)]
    .map((match) => match[1] ?? match[2]),
);
assert.ok(formulas.length >= 10, "Les formules scientifiques du cours ne sont plus toutes présentes.");
assert.ok(
  formulas.every((formula) => !/(?<!\\)\b(?:mathrm|text)\s*\{/.test(formula)),
  "Une commande KaTeX a perdu son antislash dans une chaîne TypeScript.",
);
assert.ok(formulas.includes("\\mathrm{Ca^{2+}}"));
assert.ok(formulas.includes("5\\text{-HT}_{2A}"));
assert.ok(formulas.includes("230\\,\\%"));

console.log("Audit SVT Tle C L2 valide : 8 niveaux, 79 questions, 8 interactions originales et 10 000 XP.");
