import assert from "node:assert/strict";
import { terminalCSvtMuscleEnergyPath } from "../apps/web/src/data/terminalCSvtMuscleEnergyPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const path = applyLessonXpBudget(terminalCSvtMuscleEnergyPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "muscle-fiber-organization",
  "sarcomere-bands-filaments",
  "sarcomere-shortening-evidence",
  "excitation-calcium-coupling",
  "actomyosin-cross-bridge-cycle",
  "immediate-atp-regeneration",
  "glycolysis-lactate-respiration",
  "muscle-heat-production",
  "trained-untrained-lactate-assessment",
  "muscle-response-fatigue-mission",
];
const expectedXp = [610, 680, 750, 880, 1020, 1090, 1160, 950, 1290, 1570];
const expectedQuestionCounts = [10, 11, 10, 11, 12, 10, 12, 9, 10, 12];

assert.equal(path.id, "terminale-c-svt-l4-muscle-energy-use");
assert.deepEqual(path.levelIds, ["terminale-c"]);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 107);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_700));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 4);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 1);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "timeline").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "curve").length, 2);
assert.ok(
  lessons.every(
    (lesson) => lesson.source?.documentTitle === "SVT Tle C_L4_Lutilisation de lénergie par la cellule musculaire.pdf",
  ),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 107);
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
assert.ok(shortAnswers.length >= 10);
assert.ok(shortAnswers.every((question) => (question.acceptedAnswers?.length ?? 0) > 0));

const serialized = JSON.stringify(path);
const mojibakeMarkers = ["ÃƒÂ©", "ÃƒÂ¨", "ÃƒÂª", "ÃƒÂ´", "ÃƒÂ®", "ÃƒÂ§", "Ã¢â‚¬â„¢", "Ã¢â‚¬Å“", "Ã¢â‚¬", "Ã‚Â°", "Ã‚Âµ", "ï¿½"];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(!serialized.includes("⃗"), "Les vecteurs doivent utiliser du LaTeX et non le caractère combiné U+20D7.");
assert.ok(serialized.includes("troponine C"));
assert.ok(serialized.includes("fixation de l’ATP"));
assert.ok(serialized.includes("créatine kinase"));
assert.ok(serialized.includes("2 ATP nets"));
assert.ok(serialized.includes("30 à 32 ATP"));
assert.ok(serialized.includes("secousse musculaire"));
assert.ok(serialized.includes("tout ou rien"));
assert.ok(serialized.includes("multifactorielle"));
assert.ok(serialized.includes("mission de synthèse reconstruite"));
assert.ok(serialized.includes("Figure originale annotée"));

const formulas = lessons.flatMap((lesson) =>
  [...(lesson.concept.bodyMarkdown ?? "").matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)]
    .map((match) => match[1] ?? match[2]),
);
assert.ok(formulas.length >= 12, "Les formules scientifiques du cours ne sont plus toutes présentes.");
assert.ok(
  formulas.every((formula) => !/(?<!\\)\b(?:mathrm|text)\s*\{/.test(formula)),
  "Une commande KaTeX a perdu son antislash dans une chaîne TypeScript.",
);
assert.ok(formulas.some((formula) => formula.includes("\\mathrm{Ca^{2+}_{RS}")));
assert.ok(formulas.some((formula) => formula.includes("\\mathrm{ATP + H_2O")));
assert.ok(formulas.some((formula) => formula.includes("\\mathrm{2\\,ADP")));
assert.ok(formulas.some((formula) => formula.includes("\\mathrm{phosphocréatine")));
assert.ok(formulas.some((formula) => formula.includes("30 à 32 ATP")) === false, "Le texte français ne doit pas être injecté dans une formule KaTeX.");

console.log("Audit SVT Tle C L4 valide : 10 niveaux, 107 questions, 10 interactions originales et 10 000 XP.");
