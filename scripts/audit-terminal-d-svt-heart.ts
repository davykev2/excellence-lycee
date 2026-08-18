import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog";
import { terminalDSvtHeartPath } from "../apps/web/src/data/terminalDSvtHeartPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const rawLessons = terminalDSvtHeartPath.modules.flatMap((module) => module.lessons);
assert.deepEqual(
  rawLessons.map((lesson) => lesson.xp),
  [45, 55, 65, 70, 75, 85, 90, 95, 105, 130],
  "Les poids bruts Web ont divergé du manifeste API/Supabase.",
);

const path = applyLessonXpBudget(terminalDSvtHeartPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "heart-isolated-automaticity",
  "heart-conduction-system",
  "pacemaker-myocyte-potentials",
  "cardiac-cycle-mechanics",
  "ecg-electromechanical-coupling",
  "autonomic-efferent-control",
  "baroreflex-sino-aortic",
  "loewi-chemical-mediation",
  "cardiac-mediators-pharmacology",
  "heart-function-final-mission",
];
const expectedXp = [550, 670, 800, 860, 920, 1040, 1100, 1170, 1290, 1600];
const expectedQuestionCounts = [10, 10, 11, 10, 11, 10, 10, 10, 10, 12];

assert.equal(path.id, "terminale-d-svt-l4-heart");
assert.equal(path.subjectId, "svt");
assert.deepEqual(path.levelIds, ["terminale-d"]);
assert.equal(path.chapterNumber, 4);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 104);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_800));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 2);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "timeline").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "curve").length, 2);
assert.ok(
  lessons.every(
    (lesson) => lesson.source?.documentTitle === "SVT TD_L4_Le fonctionnement du coeur.pdf",
  ),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));
assert.ok(lessons.every((lesson) => (lesson.source?.corrections.length ?? 0) >= 3));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 104);
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(
  questions.filter((question) => question.sourceLabel?.includes("page")).length >= 20,
  "Les exercices officiels ne sont plus suffisamment traçables jusqu’aux pages sources.",
);

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

const catalogLesson = curriculumLessonTitles.find((lesson) => (
  lesson.levelId === "terminale-d"
  && lesson.subjectId === "svt"
  && lesson.title === "Le fonctionnement du cœur"
));
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
assert.ok(serialized.includes("figure pédagogique originale") || serialized.includes("Figure pédagogique originale"));

const corrections = lessons
  .flatMap((lesson) => lesson.source?.corrections ?? [])
  .join(" ");
assert.match(corrections, /pacemaker dominant/i);
assert.match(corrections, /rythme d[’']échappement/i);
assert.match(corrections, /dissociation atrioventriculaire/i);
assert.match(corrections, /courant I_f|courant \$I_f\$/i);
assert.match(corrections, /pas (?:une phase de )?[«\"]?\s*latence|terme [«\"]?\s*latence/i);
assert.match(corrections, /réfractaire[^.]{0,120}(?:sommation|tétan)/i);
assert.match(corrections, /intervalle (?:PR|PQ)/i);
assert.match(corrections, /événement électrique[^.]{0,120}(?:précède|avant)/i);
assert.match(corrections, /barorécepteur[^.]{0,160}(?:étirement|pression)/i);
assert.match(corrections, /noradrénaline/i);
assert.match(corrections, /médullosurrénale/i);
assert.match(corrections, /ergotoxine[^.]{0,200}(?:historique|propranolol)/i);
assert.match(corrections, /Vagusstoff|substance vagale/i);
assert.match(corrections, /échappement vagal[^.]{0,200}(?:acétylcholinestérase|pacemaker)/i);

assert.ok(serialized.includes("nœud sinusal"));
assert.ok(serialized.includes("nœud atrioventriculaire"));
assert.ok(serialized.includes("faisceau de His"));
assert.ok(serialized.includes("réseau de Purkinje"));
assert.ok(serialized.includes("complexe QRS") || serialized.includes("Complexe QRS"));
assert.ok(serialized.includes("repolarisation ventriculaire"));
assert.ok(serialized.includes("acétylcholine"));
assert.ok(serialized.includes("noradrénaline"));
assert.ok(serialized.includes("baroréflexe"));
assert.ok(serialized.includes("Loewi"));

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
assert.ok(formulas.length >= 20, "Les formules scientifiques du cours ne sont plus toutes présentes.");
assert.ok(
  formulas.every((formula) => !/(?<!\\)\b(?:mathrm|text|frac)\s*\{/.test(formula)),
  "Une commande KaTeX a perdu son antislash dans une chaîne TypeScript.",
);
for (const formula of formulas) {
  katex.renderToString(formula, { throwOnError: true, strict: "error" });
}

const migration = readFileSync(
  new URL("../supabase/migrations/20260818040000_svt_d_heart_path.sql", import.meta.url),
  "utf8",
);
assert.ok(migration.includes(path.id));
assert.ok(migration.includes('["heart-isolated-automaticity","heart-conduction-system","pacemaker-myocyte-potentials","cardiac-cycle-mechanics","ecg-electromechanical-coupling","autonomic-efferent-control","baroreflex-sino-aortic","loewi-chemical-mediation","cardiac-mediators-pharmacology","heart-function-final-mission"]'));
assert.ok(migration.includes("array[45, 55, 65, 70, 75, 85, 90, 95, 105, 130]"));
assert.ok(migration.includes("550 / 670 / 800 / 860 / 920 / 1040 / 1100 / 1170 / 1290 / 1600"));

console.log("Audit SVT Tle D L4 valide : 10 niveaux, 104 questions, 10 interactions originales et 10 000 XP.");
