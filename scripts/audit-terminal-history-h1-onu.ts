import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { terminalHistoryPaths } from "../apps/web/src/data/terminalHistoryPaths";
import { terminalHistoryUnitedNationsPath } from "../apps/web/src/data/terminalHistoryUnitedNationsPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const expectedIds = [
  "terminale-hg-h1-united-nations-overview",
  "terminale-hg-h1-united-nations-guided-creation-principles",
  "terminale-hg-h1-united-nations-guided-organs",
  "terminale-hg-h1-united-nations-guided-assessment-part-1",
  "terminale-hg-h1-united-nations-guided-assessment-part-2",
  "terminale-hg-h1-united-nations-mission-finale",
] as const;
const expectedRawWeights = [40, 55, 60, 65, 70, 80];
const expectedXp = [1080, 1490, 1620, 1760, 1890, 2160];
const expectedQuestionCounts = [2, 13, 13, 13, 13, 13];
const expectedDocumentTitle = "Tle H1-LOrganisation des Nations Unies(ONU).pdf";

const rawLessons = terminalHistoryUnitedNationsPath.modules.flatMap((module) => module.lessons);
assert.equal(terminalHistoryUnitedNationsPath.id, "terminale-hg-h1-united-nations");
assert.equal(terminalHistoryUnitedNationsPath.subjectId, "history-geography");
assert.deepEqual(terminalHistoryUnitedNationsPath.levelIds, ["terminale-a", "terminale-c", "terminale-d"]);
assert.equal(terminalHistoryUnitedNationsPath.chapterNumber, 1);
assert.deepEqual(terminalHistoryUnitedNationsPath.theme, {
  number: 1,
  title: "Les relations internationales de 1945 à nos jours",
});
assert.equal(terminalHistoryUnitedNationsPath.modules.length, 1);
assert.deepEqual(rawLessons.map((lesson) => lesson.id), expectedIds);
assert.equal(new Set(rawLessons.map((lesson) => lesson.id)).size, expectedIds.length);
assert.deepEqual(rawLessons.map((lesson) => lesson.xp), expectedRawWeights);
assert.deepEqual(rawLessons.map((lesson) => lesson.questions?.length ?? 0), expectedQuestionCounts);
assert.equal(
  terminalHistoryUnitedNationsPath.estimatedMinutes,
  rawLessons.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
);

const path = applyLessonXpBudget(terminalHistoryUnitedNationsPath);
const lessons = path.modules.flatMap((module) => module.lessons);
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp);
assert.equal(lessons.reduce((sum, lesson) => sum + lesson.xp, 0), 10_000);
assert.ok(lessons.every((lesson) => lesson.durationMinutes > 0));
assert.ok(lessons.every((lesson) => (
  lesson.question.prompt === lesson.questions?.[0]?.prompt
  && lesson.question.correctIndex === lesson.questions?.[0]?.correctIndex
)));

const minimumBodyLengths = [0, 3_500, 3_300, 1_900, 2_200, 1_800];
for (const [index, lesson] of lessons.entries()) {
  assert.equal(lesson.source?.documentTitle, expectedDocumentTitle);
  assert.equal(lesson.source?.fidelity, "faithful-corrected");
  assert.ok(lesson.source?.pages.trim());
  assert.ok(lesson.source?.section.trim());
  assert.ok((lesson.source?.corrections.length ?? 0) >= 2);
  assert.ok(
    (lesson.concept.bodyMarkdown?.length ?? 0) >= minimumBodyLengths[index],
    lesson.id + " : cours trop court",
  );
  assert.ok((lesson.method.steps?.length ?? 0) >= 4);

  const questions = lesson.questions ?? [];
  assert.equal(new Set(questions.map((question) => question.prompt)).size, questions.length);
  for (const question of questions) {
    assert.ok(question.prompt.trim().length >= 12);
    assert.ok(question.explanation.trim().length >= 20);
    assert.ok(question.options.length >= 2);
    assert.equal(new Set(question.options).size, question.options.length);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length);
  }
}

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 67);

const sourceCounts = {
  activity1: questions.filter((question) => question.sourceLabel?.startsWith("Activité d’application n°1")).length,
  activity2: questions.filter((question) => question.sourceLabel?.startsWith("Activité d’application n°2")).length,
  activity3: questions.filter((question) => question.sourceLabel?.startsWith("Activité d’application n°3")).length,
  exercise1: questions.filter((question) => question.sourceLabel?.startsWith("Exercice d’application 1")).length,
  exercise2: questions.filter((question) => question.sourceLabel?.startsWith("Exercice d’application 2")).length,
  situations: questions.filter((question) => question.sourceLabel?.startsWith("Situation d’évaluation")).length,
};
assert.deepEqual(sourceCounts, {
  activity1: 6,
  activity2: 5,
  activity3: 7,
  exercise1: 5,
  exercise2: 6,
  situations: 9,
});
assert.equal(Object.values(sourceCounts).reduce((sum, count) => sum + count, 0), 38);

const interactions = lessons.map((lesson) => lesson.interaction);
assert.equal(interactions.filter((interaction) => interaction.kind === "timeline").length, 3);
assert.equal(interactions.filter((interaction) => interaction.kind === "diagram").length, 3);
for (const interaction of interactions) {
  if (interaction.kind === "timeline") {
    assert.ok(interaction.items.length >= 3);
    assert.ok(interaction.items.every((item) => item.label.trim() && item.detail.trim()));
  }
  if (interaction.kind === "diagram") {
    assert.ok(interaction.nodes.length >= 6);
    assert.equal(new Set(interaction.nodes.map((node) => node.id)).size, interaction.nodes.length);
    assert.ok(interaction.nodes.every((node) => node.label.trim() && node.detail.trim()));
  }
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectStrings);
  return [];
}

const serialized = JSON.stringify(path);
const lessonText = collectStrings(path).join("\n");
const courseText = lessons.map((lesson) => lesson.concept.bodyMarkdown ?? "").join("\n");
assert.equal(JSON.parse(serialized).id, path.id);
for (const required of [
  "Roosevelt, Churchill et Staline",
  "25 avril 1945",
  "26 juin 1945",
  "24 octobre 1945",
  "neuf voix",
  "Palaos",
  "1994",
  "CNUCED",
  "OMC",
  "UNTSO",
  "MINUCI",
  "ONUCI",
  "Forces de maintien de la paix des Nations Unies",
  "TPIR",
  "Rwanda",
  "Ignacio Ramonet",
  "Richard Falk",
]) {
  assert.ok(lessonText.includes(required), "Repère corrigé absent : " + required);
}
for (const forbidden of [
  "Truman, Churchill et Staline",
  "Le GATT devient la CNUCED",
  "ONUCI en 2003",
  "TPIR pour le Burundi",
]) {
  assert.ok(!courseText.includes(forbidden), "Formulation erronée conservée dans le cours : " + forbidden);
}
assert.ok(!serialized.includes("data:image"));
assert.ok(!serialized.includes("!["));
assert.ok(!serialized.includes("\ufffd"));

const corrections = lessons.flatMap((lesson) => lesson.source?.corrections ?? []).join("\n");
for (const correction of [
  "Truman",
  "Mao",
  "San Francisco",
  "abstention",
  "Timor oriental",
  "GATT",
  "UNTSO",
  "ONUCI",
  "TPIR",
  "veto n’a pas disparu",
]) {
  assert.ok(corrections.includes(correction), "Correction non tracée : " + correction);
}

const modulePath = fileURLToPath(
  new URL("../apps/web/src/data/terminalHistoryUnitedNationsPath.ts", import.meta.url),
);
assert.ok(statSync(modulePath).size < 250_000, "Le module H1 dépasse le budget source de 250 ko.");
const moduleSource = readFileSync(modulePath, "utf8");
for (const marker of ["ÃƒÂ©", "ÃƒÂ¨", "Ã¢â‚¬", "ï¿½"]) {
  assert.ok(!moduleSource.includes(marker), "Texte mal décodé détecté : " + marker);
}

assert.equal(
  terminalHistoryPaths.filter((candidate) => candidate.id === path.id).length,
  1,
  "H1 doit être présente une seule fois dans l’agrégateur Histoire.",
);
assert.equal(terminalHistoryPaths[0]?.id, path.id, "H1 doit rester la première leçon d’Histoire.");

console.log(
  "Audit Histoire Terminale H1 ONU vert : "
  + lessons.length
  + " niveaux, "
  + questions.length
  + " réponses (38 issues des évaluations du PDF), "
  + interactions.length
  + " interactions, 10 000 XP.",
);
