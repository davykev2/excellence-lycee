import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog";
import { terminalDSvtSkeletalMusclePath } from "../apps/web/src/data/terminalDSvtSkeletalMusclePath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const path = applyLessonXpBudget(terminalDSvtSkeletalMusclePath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "muscle-organ-to-fiber",
  "sarcomere-bands-myofilaments",
  "sarcomere-sliding-contraction",
  "excitation-calcium-coupling",
  "actomyosin-cross-bridge-cycle",
  "action-potential-muscle-twitch",
  "summation-tetanus-fatigue",
  "rapid-atp-regeneration",
  "glycolysis-respiration-energy",
  "official-muscle-assessment-mission",
];
const expectedXp = [550, 670, 790, 850, 910, 980, 1100, 1220, 1340, 1590];

assert.equal(path.id, "terminale-d-svt-l3-skeletal-muscle");
assert.deepEqual(path.levelIds, ["terminale-d"]);
assert.equal(path.chapterNumber, 3);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.equal(lessons.length, 10);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_800));
assert.ok(lessons.every((lesson) => lesson.interaction), "Chaque niveau doit conserver son interaction.");
assert.ok(
  lessons.every(
    (lesson) => lesson.source?.documentTitle === "SVT TD_L3_Le fonctionnement du muscle strié squelettique.pdf",
  ),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));
assert.ok(lessons.every((lesson) => (lesson.source?.corrections.length ?? 0) >= 3));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.ok(questions.length >= 100, "La banque d’évaluation doit conserver au moins 100 réponses.");
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.filter((question) => question.sourceLabel?.includes("page")).length >= 18);

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
  && lesson.title === "Le fonctionnement du muscle strié squelettique"
));
assert.equal(catalogLesson?.pathId, path.id, "La carte du programme n’ouvre plus le parcours publié.");

const serialized = JSON.stringify(path);
const mojibakeMarkers = ["ÃƒÂ©", "ÃƒÂ¨", "ÃƒÂª", "ÃƒÂ´", "ÃƒÂ®", "ÃƒÂ§", "Ã¢â‚¬â„¢", "Ã¢â‚¬Å“", "Ã¢â‚¬", "Ã‚Â°", "Ã‚Âµ", "ï¿½"];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(!serialized.includes("⃗"), "Une flèche combinante illisible a été introduite.");
assert.ok(!serialized.includes("src/assets"), "Une image publiée a été ajoutée au lieu d’un schéma original.");
assert.ok(serialized.includes("bande A"));
assert.ok(serialized.includes("bande I"));
assert.ok(serialized.includes("zone H"));
assert.ok(serialized.includes("troponine C"));
assert.ok(serialized.includes("SERCA"));
assert.ok(serialized.includes("créatine kinase"));
assert.ok(serialized.includes("30 à 32 ATP"));
assert.ok(serialized.includes("11,9"));
assert.ok(serialized.includes("35 mV"));
assert.ok(serialized.includes("réponse graduée"));

const formulas = lessons.flatMap((lesson) =>
  [...(lesson.concept.bodyMarkdown ?? "").matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)]
    .map((match) => match[1] ?? match[2]),
);
assert.ok(formulas.length >= 3, "Les trois équations bioénergétiques du cours ne sont plus toutes présentes.");
assert.ok(
  formulas.every((formula) => !/(?<!\\)\b(?:mathrm|text|frac)\s*\{/.test(formula)),
  "Une commande KaTeX a perdu son antislash dans une chaîne TypeScript.",
);
for (const formula of formulas) {
  katex.renderToString(formula, { throwOnError: true, strict: "error" });
}

const migration = readFileSync(
  new URL("../supabase/migrations/20260818030000_svt_d_skeletal_muscle_path.sql", import.meta.url),
  "utf8",
);
assert.ok(migration.includes(path.id));
assert.ok(migration.includes(JSON.stringify(expectedIds)));
assert.ok(migration.includes("array[45, 55, 65, 70, 75, 80, 90, 100, 110, 130]"));
assert.ok(migration.includes("550 / 670 / 790 / 850 / 910 / 980 / 1100 / 1220 / 1340 / 1590"));

console.log(`Audit SVT Tle D L3 valide : 10 niveaux, ${questions.length} réponses, 10 interactions originales et 10 000 XP.`);
