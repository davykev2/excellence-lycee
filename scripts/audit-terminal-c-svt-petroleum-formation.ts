import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { terminalCSvtPetroleumFormationPath } from "../apps/web/src/data/terminalCSvtPetroleumFormationPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";
import { getLessonReward, getPathRewardTotal } from "../apps/api/src/curriculum";

const path = applyLessonXpBudget(terminalCSvtPetroleumFormationPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "ivorian-sedimentary-basin-location",
  "source-reservoir-seal-rocks",
  "organic-deposition-kerogen",
  "thermal-maturation-hydrocarbons",
  "primary-secondary-migration",
  "fluid-sorting-reservoir-trap",
  "stratigraphic-structural-mixed-traps",
  "official-gap-order-exercises",
  "anticline-wells-final-mission",
];
const expectedXp = [620, 750, 820, 960, 1030, 1160, 1300, 1510, 1850];
const expectedQuestionCounts = [10, 10, 10, 10, 10, 10, 10, 12, 13];

assert.equal(path.id, "terminale-c-svt-l9-petroleum-formation");
assert.deepEqual(path.levelIds, ["terminale-c"]);
assert.equal(path.chapterNumber, 9);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.equal(getPathRewardTotal(path.id), 10_000, "Le budget de l’API a changé.");
assert.ok(
  lessons.every((lesson) => getLessonReward(path.id, lesson.id) === lesson.xp),
  "Le registre API n’est plus aligné avec le frontend.",
);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 95);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_700));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "timeline").length, 3);
assert.ok(
  lessons.every(
    (lesson) => lesson.source?.documentTitle === "SVT Tle C_L9_La mise en place des gisements pétrolifères.pdf",
  ),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));
assert.ok(lessons.every((lesson) => (lesson.source?.corrections.length ?? 0) >= 3));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 95);
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
assert.ok(shortAnswers.length >= 9);
assert.ok(shortAnswers.every((question) => (question.acceptedAnswers?.length ?? 0) > 0));

const serialized = JSON.stringify(path);
const mojibakeMarkers = ["ÃƒÂ©", "ÃƒÂ¨", "ÃƒÂª", "ÃƒÂ´", "ÃƒÂ®", "ÃƒÂ§", "Ã¢â‚¬â„¢", "Ã¢â‚¬Å“", "Ã¢â‚¬", "Ã‚Â°", "Ã‚Âµ", "ï¿½"];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(!serialized.includes("⃗"), "Une flèche combinante illisible a été introduite.");
assert.ok(serialized.includes("Baleine"));
assert.ok(serialized.includes("Assouindé"));
assert.ok(serialized.includes("bassin, bloc et gisement"));
assert.ok(serialized.includes("roche couverture imperméable"));
assert.ok(serialized.includes("migration primaire"));
assert.ok(serialized.includes("migration secondaire"));
assert.ok(serialized.includes("3 → 2 → 4 → 1"));
assert.ok(serialized.includes("A = gaz ; B = pétrole"));
assert.ok(serialized.includes("Si aucune entrave n’est rencontrée"));
assert.ok(serialized.includes("Croquis pédagogique original"));
assert.ok(serialized.includes("Coupe pédagogique originale"));

const migration = readFileSync(
  resolve("supabase/migrations/20260821120000_svt_petroleum_formation_path.sql"),
  "utf8",
);
assert.ok(migration.includes(path.id));
assert.ok(expectedIds.every((id) => migration.includes(id)));
assert.ok(migration.includes("array[45, 55, 60, 70, 75, 85, 95, 110, 135]"));
assert.ok(migration.includes("620 / 750 / 820 / 960 / 1030 / 1160 / 1300 / 1510 / 1850 = 10 000"));

const formulas = lessons.flatMap((lesson) =>
  [...(lesson.concept.bodyMarkdown ?? "").matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)]
    .map((match) => match[1] ?? match[2]),
);
assert.ok(formulas.includes("\\rho_{gaz} < \\rho_{pétrole} < \\rho_{eau}"));
assert.ok(
  formulas.every((formula) => !/(?<!\\)\b(?:rho|mathrm|text)\s*(?:_|\{)/.test(formula)),
  "Une commande KaTeX a perdu son antislash dans une chaîne TypeScript.",
);

for (const lesson of lessons.filter((candidate) => candidate.interaction.kind === "schema")) {
  const interaction = lesson.interaction;
  if (interaction.kind !== "schema") continue;
  assert.ok(interaction.shapes.length >= 8, `Schéma trop pauvre : ${lesson.id}`);
  assert.ok(interaction.hotspots.length >= 5, `Repères insuffisants : ${lesson.id}`);
  assert.ok(interaction.caption?.toLocaleLowerCase("fr").includes("original"));
}

console.log("Audit SVT Tle C L9 valide : 9 niveaux, 95 questions, 9 interactions originales et 10 000 XP.");
