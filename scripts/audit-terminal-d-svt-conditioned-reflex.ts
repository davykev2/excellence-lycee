import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog";
import { terminalDSvtConditionedReflexPath } from "../apps/web/src/data/terminalDSvtConditionedReflexPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const expectedIds = [
  "reflex-response-foundations",
  "pavlov-conditioning-experiment",
  "conditioned-reflex-acquisition",
  "temporal-association-repetition",
  "reinforcement-conditioning-maintenance",
  "extinction-spontaneous-recovery",
  "generalization-discrimination",
  "cortical-plasticity-neural-pathways",
  "conditioned-reflex-applications-limits",
  "conditioned-reflex-final-mission",
];
const expectedWeights = [45, 55, 65, 70, 75, 80, 90, 100, 110, 130];
const expectedXp = [550, 670, 790, 850, 910, 980, 1100, 1220, 1340, 1590];
const expectedQuestionCounts = [11, 11, 11, 11, 11, 11, 11, 11, 11, 21];

const rawLessons = terminalDSvtConditionedReflexPath.modules.flatMap((module) => module.lessons);
assert.deepEqual(
  rawLessons.map((lesson) => lesson.xp),
  expectedWeights,
  "Les poids bruts Web ont divergé du manifeste API/Supabase.",
);

const path = applyLessonXpBudget(terminalDSvtConditionedReflexPath);
const lessons = path.modules.flatMap((module) => module.lessons);

assert.equal(path.id, "terminale-d-svt-l1-conditioned-reflex");
assert.equal(path.subjectId, "svt");
assert.deepEqual(path.levelIds, ["terminale-d"]);
assert.equal(path.chapterNumber, 1);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 120);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 2_500));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 6);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "timeline").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "curve").length, 1);
assert.equal(lessons.filter((lesson) => lesson.interaction).length, 10);
assert.ok(
  lessons.every(
    (lesson) => lesson.source?.documentTitle === "SVT TD_L1_Le reflexe conditionnel.pdf",
  ),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));
assert.ok(lessons.every((lesson) => (lesson.source?.corrections.length ?? 0) >= 3));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 120);
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.equal(
  questions.filter((question) => question.sourceLabel?.toLocaleLowerCase("fr").includes("page")).length,
  16,
  "La traçabilité des évaluations vers les pages officielles a changé.",
);

const choices = questions.filter((question) => question.type === "choice");
const shortAnswers = questions.filter((question) => question.type === "short-answer");
assert.equal(choices.length, 109);
assert.equal(shortAnswers.length, 11);
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
assert.ok(shortAnswers.every((question) => (question.acceptedAnswers?.length ?? 0) > 0));

const catalogLesson = curriculumLessonTitles.find((lesson) => (
  lesson.levelId === "terminale-d"
  && lesson.subjectId === "svt"
  && lesson.title === "Le réflexe conditionnel"
));
assert.equal(catalogLesson?.sequence, 1, "La leçon n’est plus la première carte SVT de Terminale D.");
assert.equal(catalogLesson?.pathId, path.id, "La carte du programme n’ouvre plus le parcours publié.");

const serialized = JSON.stringify(path);
const mojibakeMarkers = [
  "ÃƒÂ©", "ÃƒÂ¨", "ÃƒÂª", "ÃƒÂ´", "ÃƒÂ®", "ÃƒÂ§", "Ã¢â‚¬â„¢", "Ã¢â‚¬Å“", "Ã¢â‚¬", "Ã‚Â°", "Ã‚Âµ", "ï¿½",
  "Ã©", "Ã¨", "Ãª", "Ã´", "Ã®", "Ã§", "â€™", "â€œ", "â€", "Â°", "Âµ", "�",
];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(!serialized.includes("⃗"), "Une flèche combinante illisible a été introduite.");
assert.ok(!serialized.includes("src/assets"), "Une image publiée a été ajoutée au lieu d’un schéma original.");
assert.ok(!serialized.includes("/assets/"), "Une image publiée a été ajoutée au lieu d’un schéma original.");
assert.ok(!serialized.includes("!["), "Un scan a été intégré au cours au lieu d’une figure pédagogique originale.");
assert.ok(!serialized.includes("<img"), "Une image externe a été intégrée au cours.");
assert.ok(!serialized.includes("data:image"), "Une image encodée a été intégrée au cours.");

const corrections = lessons
  .flatMap((lesson) => lesson.source?.corrections ?? [])
  .join(" ");
assert.match(corrections, /centre la moelle[^.]{0,180}réflexes spinaux/i);
assert.match(corrections, /moelle épinière[^.]{0,180}relais obligatoire[^.]{0,180}VII\/IX/i);
assert.match(corrections, /essais 5 à 9, non 5 à 10/i);
assert.match(corrections, /extinction[^.]{0,180}apprentissage inhibiteur/i);
assert.match(corrections, /récupération spontanée[^.]{0,180}effacement/i);
assert.match(corrections, /généralisation et discrimination[^.]{0,180}SC\+\/SC−/i);

assert.ok(serialized.includes("noyaux salivatoires du tronc cérébral"));
assert.ok(serialized.includes("nerfs VII/IX"));
assert.ok(serialized.includes("essais 5 à 9"));
assert.ok(serialized.includes("récupération spontanée"));
assert.ok(serialized.includes("généralisation"));
assert.ok(serialized.includes("discrimination"));

const formulaTexts = lessons.flatMap((lesson) => [
  lesson.concept.bodyMarkdown ?? "",
  lesson.concept.notation ?? "",
  lesson.concept.example ?? "",
  ...(lesson.questions ?? []).flatMap((question) => [
    question.prompt,
    question.explanation,
    ...question.options,
  ]),
]);
const formulas = formulaTexts.flatMap((text) =>
  [...text.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)].map((match) => match[1] ?? match[2]),
);
for (const lesson of lessons) {
  if (lesson.interaction.kind === "curve" && lesson.interaction.formulaTex) {
    formulas.push(lesson.interaction.formulaTex);
  }
}
assert.ok(
  formulas.every((formula) => !/(?<!\\)\b(?:mathrm|text|frac)\s*\{/.test(formula)),
  "Une commande KaTeX a perdu son antislash dans une chaîne TypeScript.",
);
for (const formula of formulas) {
  katex.renderToString(formula, { throwOnError: true, strict: "error" });
}

const migration = readFileSync(
  new URL("../supabase/migrations/20260818060000_svt_d_conditioned_reflex_path.sql", import.meta.url),
  "utf8",
);
assert.ok(migration.includes(path.id));
assert.ok(migration.includes(JSON.stringify(expectedIds)));
assert.ok(migration.includes("array[45, 55, 65, 70, 75, 80, 90, 100, 110, 130]"));
assert.ok(migration.includes("550 / 670 / 790 / 850 / 910 / 980 / 1100 / 1220 / 1340 / 1590"));

console.log("Audit SVT Tle D L1 valide : 10 niveaux, 120 questions, 10 interactions originales et 10 000 XP.");
