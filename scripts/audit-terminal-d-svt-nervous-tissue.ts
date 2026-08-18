import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import { terminalDSvtNervousTissuePath } from "../apps/web/src/data/terminalDSvtNervousTissuePath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const path = applyLessonXpBudget(terminalDSvtNervousTissuePath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "nerve-tissue-organization",
  "resting-membrane-potential",
  "action-potential-ionic-phases",
  "excitability-rheobase-chronaxie",
  "all-or-none-nerve-recruitment",
  "refractory-period-propagation-direction",
  "conduction-speed-myelination",
  "synapse-types-motor-endplate",
  "chemical-synaptic-transmission",
  "pain-morphine-final-mission",
];
const expectedXp = [550, 670, 790, 850, 910, 980, 1100, 1220, 1340, 1590];
const expectedQuestionCounts = [10, 10, 10, 10, 10, 10, 10, 10, 10, 12];

assert.equal(path.id, "terminale-d-svt-l2-nervous-tissue");
assert.deepEqual(path.levelIds, ["terminale-d"]);
assert.equal(path.chapterNumber, 2);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 102);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_800));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 2);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 4);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "timeline").length, 2);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "curve").length, 2);
assert.ok(
  lessons.every(
    (lesson) => lesson.source?.documentTitle === "SVT TD_L2_Le fonctionnement du  tissu nerveux.pdf",
  ),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));
assert.ok(lessons.every((lesson) => (lesson.source?.corrections.length ?? 0) >= 3));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 102);
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

const serialized = JSON.stringify(path);
const mojibakeMarkers = ["ÃƒÂ©", "ÃƒÂ¨", "ÃƒÂª", "ÃƒÂ´", "ÃƒÂ®", "ÃƒÂ§", "Ã¢â‚¬â„¢", "Ã¢â‚¬Å“", "Ã¢â‚¬", "Ã‚Â°", "Ã‚Âµ", "ï¿½"];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(!serialized.includes("⃗"), "Une flèche combinante illisible a été introduite.");
assert.ok(!serialized.includes("src/assets"), "Une image publiée a été ajoutée au lieu d’un schéma original.");
assert.ok(serialized.includes("oligodendrocytes"));
assert.ok(serialized.includes("canaux de fuite"));
assert.ok(serialized.includes("inactivation des canaux Na⁺"));
assert.ok(serialized.includes("0,6 ms"));
assert.ok(serialized.includes("potentiel d’action composé"));
assert.ok(serialized.includes("neurone sensitif pseudounipolaire"));
assert.ok(serialized.includes("1 000 µm"));
assert.ok(serialized.includes("récepteurs nicotiniques"));
assert.ok(serialized.includes("g-c-a-d-b-f-e"));
assert.ok(serialized.includes("substance P"));
assert.ok(serialized.includes("Aδ"));
assert.ok(serialized.includes("dépression respiratoire"));
assert.ok(serialized.includes("figure pédagogique originale") || serialized.includes("Figure pédagogique originale"));

const formulas = lessons.flatMap((lesson) =>
  [...(lesson.concept.bodyMarkdown ?? "").matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)]
    .map((match) => match[1] ?? match[2]),
);
assert.ok(formulas.length >= 20, "Les formules scientifiques du cours ne sont plus toutes présentes.");
assert.ok(
  formulas.every((formula) => !/(?<!\\)\b(?:mathrm|text|frac)\s*\{/.test(formula)),
  "Une commande KaTeX a perdu son antislash dans une chaîne TypeScript.",
);
assert.ok(formulas.some((formula) => formula.includes("V_m=V_{\\text{intérieur}}")));
assert.ok(formulas.some((formula) => formula.includes("3\\,\\mathrm{Na^+}")));
assert.ok(formulas.some((formula) => formula.includes("\\frac{\\Delta d}{\\Delta t}")));
assert.ok(formulas.some((formula) => formula.includes("g\\rightarrow c")));
for (const formula of formulas) {
  katex.renderToString(formula, { throwOnError: true, strict: "error" });
}

const migration = readFileSync(
  new URL("../supabase/migrations/20260818020000_svt_d_nervous_tissue_path.sql", import.meta.url),
  "utf8",
);
assert.ok(migration.includes(path.id));
assert.ok(migration.includes('["nerve-tissue-organization","resting-membrane-potential","action-potential-ionic-phases","excitability-rheobase-chronaxie","all-or-none-nerve-recruitment","refractory-period-propagation-direction","conduction-speed-myelination","synapse-types-motor-endplate","chemical-synaptic-transmission","pain-morphine-final-mission"]'));
assert.ok(migration.includes("array[45, 55, 65, 70, 75, 80, 90, 100, 110, 130]"));
assert.ok(migration.includes("550 / 670 / 790 / 850 / 910 / 980 / 1100 / 1220 / 1340 / 1590"));

console.log("Audit SVT Tle D L2 valide : 10 niveaux, 102 questions, 10 interactions originales et 10 000 XP.");
