import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { getLessonReward, getPathRewardTotal } from "../apps/api/src/curriculum";
import { terminalDSvtImmuneDefensePath } from "../apps/web/src/data/terminalDSvtImmuneDefensePath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const expectedIds = [
  "barriers-innate-defense",
  "inflammation-recruitment",
  "phagocytosis-complement",
  "adaptive-specificity-transfer-experiments",
  "antibodies-humoral-response",
  "lymphocytes-lymphoid-organs",
  "grafts-self-nonself-hla",
  "antigen-presentation-clonal-expansion",
  "adaptive-effectors-memory-cooperation",
  "immune-defense-final-mission",
] as const;
const expectedRawWeights = [45, 55, 65, 70, 75, 80, 90, 100, 110, 130];
const expectedXp = [550, 670, 790, 850, 910, 980, 1100, 1220, 1340, 1590];
const expectedQuestionCounts = [10, 11, 11, 10, 11, 11, 11, 10, 11, 14];
const expectedDocumentTitle = "SVT TD_L6_Le systeme de defense de lorganisme.pdf";

const rawLessons = terminalDSvtImmuneDefensePath.modules.flatMap((module) => module.lessons);
assert.equal(terminalDSvtImmuneDefensePath.id, "terminale-d-svt-l11-immune-defense");
assert.equal(terminalDSvtImmuneDefensePath.subjectId, "svt");
assert.deepEqual(terminalDSvtImmuneDefensePath.levelIds, ["terminale-d"]);
assert.equal(terminalDSvtImmuneDefensePath.chapterNumber, 11);
assert.deepEqual(terminalDSvtImmuneDefensePath.theme, {
  number: 2,
  title: "La défense de l’organisme et son dysfonctionnement",
});
assert.equal(terminalDSvtImmuneDefensePath.modules.length, 1);
assert.deepEqual(rawLessons.map((lesson) => lesson.id), expectedIds);
assert.equal(new Set(rawLessons.map((lesson) => lesson.id)).size, expectedIds.length);
assert.ok(rawLessons.every((lesson) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(lesson.id)));
assert.deepEqual(rawLessons.map((lesson) => lesson.xp), expectedRawWeights);
assert.deepEqual(rawLessons.map((lesson) => lesson.questions?.length ?? 0), expectedQuestionCounts);
assert.equal(
  terminalDSvtImmuneDefensePath.estimatedMinutes,
  rawLessons.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
);

const path = applyLessonXpBudget(terminalDSvtImmuneDefensePath);
const lessons = path.modules.flatMap((module) => module.lessons);
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp);
assert.equal(lessons.reduce((sum, lesson) => sum + lesson.xp, 0), 10_000);
assert.equal(getPathRewardTotal(path.id), 10_000, "Le budget API doit rester normalisé à 10 000 XP.");
assert.ok(
  lessons.every((lesson) => getLessonReward(path.id, lesson.id) === lesson.xp),
  "Le registre API doit rester aligné avec le frontend.",
);
assert.ok(lessons.every((lesson) => lesson.durationMinutes > 0));
assert.ok(lessons.every((lesson) => lesson.question === lesson.questions?.[0]));

for (const lesson of lessons) {
  assert.equal(lesson.source?.documentTitle, expectedDocumentTitle);
  assert.equal(lesson.source?.fidelity, "faithful-corrected");
  assert.ok(lesson.source?.pages.trim());
  assert.ok(lesson.source?.section.trim());
  assert.ok((lesson.source?.corrections.length ?? 0) >= 4);
  assert.ok((lesson.concept.bodyMarkdown?.length ?? 0) >= 1_700, lesson.id + " : cours trop court");
  assert.ok((lesson.method.steps?.length ?? 0) >= 4);
}

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 110);
assert.equal(new Set(questions.map((question) => question.prompt)).size, questions.length);
assert.ok(questions.every((question) => question.prompt.trim().length >= 12));
assert.ok(questions.every((question) => question.explanation.trim().length >= 20));
assert.ok(questions.every((question) => question.sourceLabel?.trim()));

const choices = questions.filter((question) => question.type === "choice");
const shortAnswers = questions.filter((question) => question.type === "short-answer");
const fourOptionChoices = choices.filter((question) => question.options.length === 4);
const binaryChoices = choices.filter((question) => question.options.length === 2);
assert.equal(choices.length, 100);
assert.equal(shortAnswers.length, 10);
assert.equal(fourOptionChoices.length, 90);
assert.equal(binaryChoices.length, 10);
assert.ok(fourOptionChoices.every((question) => new Set(question.options).size === 4));
assert.ok(binaryChoices.every((question) => (
  question.options[0] === "Vrai"
  && question.options[1] === "Faux"
  && (question.correctIndex === 0 || question.correctIndex === 1)
)));
assert.ok(shortAnswers.every((question) => (
  question.options.length === 0
  && (question.acceptedAnswers?.length ?? 0) >= 4
)));

const fourOptionPositions = [0, 1, 2, 3].map((position) => (
  fourOptionChoices.filter((question) => question.correctIndex === position).length
));
assert.deepEqual(fourOptionPositions, [23, 23, 22, 22]);
assert.equal(binaryChoices.filter((question) => question.correctIndex === 0).length, 5);
assert.equal(binaryChoices.filter((question) => question.correctIndex === 1).length, 5);

const officialQuestions = questions.filter((question) => question.sourceLabel?.startsWith("Source officielle •"));
const guidedQuestions = questions.filter((question) => question.sourceLabel?.startsWith("Vérification guidée •"));
assert.equal(officialQuestions.length, 54);
assert.equal(guidedQuestions.length, 56);
assert.equal(officialQuestions.length + guidedQuestions.length, questions.length);

const interactions = lessons.map((lesson) => lesson.interaction);
assert.equal(interactions.filter((interaction) => interaction.kind === "diagram").length, 3);
assert.equal(interactions.filter((interaction) => interaction.kind === "schema").length, 3);
assert.equal(interactions.filter((interaction) => interaction.kind === "timeline").length, 4);
for (const interaction of interactions) {
  if (interaction.kind === "diagram") {
    assert.ok(interaction.nodes.length >= 5);
    assert.equal(new Set(interaction.nodes.map((node) => node.id)).size, interaction.nodes.length);
    assert.ok(interaction.nodes.every((node) => node.role.trim() && node.detail.trim()));
  }
  if (interaction.kind === "timeline") {
    assert.ok(interaction.items.length >= 6);
    assert.ok(interaction.items.every((item) => item.label.trim() && item.detail.trim()));
  }
  if (interaction.kind === "schema") {
    assert.ok(interaction.shapes.length >= 10);
    assert.ok(interaction.hotspots.length >= 5);
    assert.equal(new Set(interaction.hotspots.map((hotspot) => hotspot.id)).size, interaction.hotspots.length);
  }
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectStrings);
  return [];
}

const allStrings = collectStrings(path);
const scientificText = allStrings.join("\n");
const courseText = lessons.map((lesson) => lesson.concept.bodyMarkdown ?? "").join("\n");
const serialized = JSON.stringify(path);
assert.deepEqual(JSON.parse(serialized), path);
for (const required of [
  "neutrophiles",
  "phagolysosome",
  "voie classique",
  "lectines",
  "alternative",
  "C3b",
  "C5b-C9",
  "IgM",
  "toxine inactivée",
  "HLA I",
  "HLA II",
  "peptide-HLA",
  "co-stimulation",
  "CD40-CD40L",
  "T CD4",
  "T CD8",
  "perforine",
  "granzymes",
  "apoptose",
  "antirétroviral",
  "sepsis",
]) {
  assert.ok(scientificText.includes(required), "Notion scientifique absente : " + required);
}
for (const forbidden of [
  "le foie oppose une dernière résistance",
  "perforine est une enzyme",
  "toutes les substances immunitaires du sérum sont des anticorps",
  "survécu grâce à une réponse naturelle",
  "les antibiotiques traitent tous les virus",
]) {
  assert.ok(!scientificText.toLocaleLowerCase("fr").includes(forbidden), "Formulation erronée conservée : " + forbidden);
}
assert.ok(!courseText.includes("réticence"));
assert.ok(!courseText.includes("campagne de sensibilisation"));
assert.ok(!serialized.includes("data:image"));
assert.ok(!serialized.includes("!["));
assert.ok(!serialized.includes("\u20d7"));
assert.ok(!serialized.includes("\ufffd"));

const corrections = lessons.flatMap((lesson) => lesson.source?.corrections ?? []).join("\n");
for (const correction of [
  "neutrophiles",
  "IgM",
  "inactivée",
  "HLA",
  "facteur H",
  "granzymes",
  "antirétroviral",
  "antibiotiques",
]) {
  assert.ok(corrections.includes(correction), "Correction non tracée : " + correction);
}

const modulePath = fileURLToPath(
  new URL("../apps/web/src/data/terminalDSvtImmuneDefensePath.ts", import.meta.url),
);
const moduleSource = readFileSync(modulePath, "utf8");
assert.ok(Buffer.byteLength(moduleSource, "utf8") < 250_000);
for (const marker of [
  "ÃƒÂ©",
  "ÃƒÂ¨",
  "ÃƒÂª",
  "ÃƒÂ´",
  "ÃƒÂ®",
  "ÃƒÂ§",
  "Ã¢â‚¬",
  "Ã‚Â°",
  "Ã‚Âµ",
  "ï¿½",
]) {
  assert.ok(!moduleSource.includes(marker), "Texte mal décodé détecté : " + marker);
}

const catalog = readFileSync(
  new URL("../apps/web/src/data/curriculumCatalog.ts", import.meta.url),
  "utf8",
);
const loader = readFileSync(
  new URL("../apps/web/src/data/learningPathLoader.ts", import.meta.url),
  "utf8",
);
const registry = readFileSync(
  new URL("../apps/web/src/data/learningPaths.ts", import.meta.url),
  "utf8",
);
assert.ok(catalog.includes(`pathId: "${path.id}"`), "La carte du catalogue n’ouvre pas L11.");
assert.ok(loader.includes("terminalDSvtImmuneDefensePath"), "Le chargeur différé n’importe pas L11.");
assert.ok(registry.includes("terminalDSvtImmuneDefensePath"), "Le registre Web intégral n’importe pas L11.");

const migration = readFileSync(
  new URL("../supabase/migrations/20260827010000_svt_d_immune_defense_path.sql", import.meta.url),
  "utf8",
);
assert.ok(migration.includes(path.id));
assert.ok(migration.includes(JSON.stringify(expectedIds)));
assert.ok(migration.includes("array[45, 55, 65, 70, 75, 80, 90, 100, 110, 130]"));
assert.ok(migration.includes("550 / 670 / 790 / 850 / 910 / 980 / 1100 / 1220 / 1340 / 1590 = 10 000"));
assert.match(migration, /create temporary table/i);
assert.match(migration, /on conflict\s*\(path_id, lesson_id\)\s*do update/i);
assert.match(migration, /1000\s*-\s*sum\(base_units\)/i);
assert.doesNotMatch(migration, /\bdelete\b/i, "Une création de parcours ne doit supprimer aucune récompense.");

console.log(
  "Audit SVT Terminale D L11 vert : "
  + lessons.length
  + " niveaux, "
  + questions.length
  + " réponses ("
  + officialQuestions.length
  + " officielles), "
  + interactions.length
  + " interactions, 10 000 XP.",
);
