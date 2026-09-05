import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { getLessonReward, getPathRewardTotal } from "../apps/api/src/curriculum";
import { terminalFrenchLiteraryDissertationPath as rawPath } from "../apps/web/src/data/terminalFrenchLiteraryDissertationPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const path = applyLessonXpBudget(rawPath);
const rawLessons = rawPath.modules.flatMap((module) => module.lessons);
const lessons = path.modules.flatMap((module) => module.lessons);
const pathId = "terminale-french-l2-literary-dissertation";
const suffixes = [
  "overview-barreme",
  "analyze-subject",
  "find-ideas",
  "build-plan",
  "write-introduction",
  "write-development",
  "write-conclusion",
  "bac-2025-workshop",
] as const;
const expectedIds = suffixes.map((suffix) => `${pathId}-${suffix}`);
const expectedWeights = [40, 55, 60, 65, 70, 80, 75, 95];
const expectedXp = [740, 1020, 1110, 1200, 1300, 1480, 1390, 1760];
const expectedPages = [
  "Progression p.12 et p.15 ; sujet p.3 ; barème p.10",
  "Sujet p.3 ; corrigé p.4",
  "Corrigé p.5-9",
  "Corrigé p.5-9",
  "Corrigé p.5 ; barème p.10",
  "Progression p.12/15 ; corrigé p.5-9 ; barème p.10",
  "Corrigé p.9 ; barème p.10",
  "Sujet p.3 ; corrigé p.4-9 ; barème p.10",
];

assert.equal(path.id, pathId);
assert.equal(path.subjectId, "french");
assert.equal(path.presentation, "continuous-course");
assert.deepEqual(path.levelIds, ["terminale-a", "terminale-c", "terminale-d"]);
assert.equal(path.chapterNumber, 2);
assert.equal(path.title, "La dissertation littéraire");
assert.deepEqual(rawLessons.map((lesson) => lesson.id), expectedIds);
assert.deepEqual(rawLessons.map((lesson) => lesson.xp), expectedWeights);
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp);
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.equal(getPathRewardTotal(pathId), 10_000);
lessons.forEach((lesson) => {
  assert.equal(getLessonReward(pathId, lesson.id), lesson.xp, `Registre API décalé : ${lesson.id}`);
});

assert.deepEqual(lessons.map((lesson) => lesson.questions?.length ?? 0), [4, 4, 4, 4, 4, 4, 4, 4]);
const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 32);
assert.ok(questions.every((question) => question.options.length === 4));
assert.ok(questions.every((question) => question.correctIndex >= 0 && question.correctIndex < 4));
assert.ok(questions.every((question) => question.explanation.trim().length >= 18));
assert.ok(questions.every((question) => question.sourceLabel?.trim()));

assert.deepEqual(lessons.map((lesson) => lesson.courseActivities?.length ?? 0), [1, 1, 1, 1, 1, 1, 1, 1]);
const activities = lessons.flatMap((lesson) => lesson.courseActivities ?? []);
assert.equal(activities.length, 8);
assert.equal(new Set(activities.map((activity) => activity.id)).size, activities.length);
assert.equal(activities.filter((activity) => activity.kind === "categorize").length, 2);
assert.equal(activities.filter((activity) => activity.kind === "ordering").length, 2);
assert.equal(activities.filter((activity) => activity.kind === "guided-writing").length, 4);

for (const activity of activities) {
  assert.ok(activity.title.trim().length >= 18);
  assert.ok(activity.instruction.trim().length >= 25);
  assert.ok(activity.sourceLabel?.trim());
  if (activity.kind === "categorize") {
    const groups = new Set(activity.groups.map((group) => group.id));
    assert.ok(activity.items.length >= 4);
    assert.ok(activity.items.every((item) => groups.has(item.correctGroupId)));
    assert.equal(new Set(activity.items.map((item) => item.id)).size, activity.items.length);
    assert.ok(activity.items.every((item) => item.explanation.trim().length >= 15));
  } else if (activity.kind === "ordering") {
    const itemIds = activity.items.map((item) => item.id);
    assert.deepEqual([...activity.correctOrder].sort(), [...itemIds].sort());
    assert.notDeepEqual(itemIds, activity.correctOrder, "L’ordre initial doit être mélangé.");
    assert.ok(activity.explanation.trim().length >= 35);
  } else {
    assert.ok(activity.prompts.length >= 3);
    assert.ok(activity.criteria.length >= 4);
    assert.equal(new Set(activity.prompts.map((prompt) => prompt.id)).size, activity.prompts.length);
    assert.equal(new Set(activity.criteria.map((criterion) => criterion.id)).size, activity.criteria.length);
    assert.ok(activity.prompts.every((prompt) => prompt.placeholder.trim().length >= 18));
    assert.ok(activity.criteria.every((criterion) => criterion.hint.trim().length >= 18));
    assert.ok(activity.modelMarkdown.trim().length >= 220);
  }
}

const activityData = JSON.stringify(activities);
for (const forbidden of ['"points"', '"correctIndex"', '"acceptedAnswers"', '"xp"']) {
  assert.ok(!activityData.includes(forbidden), `Notation automatique interdite dans les ateliers : ${forbidden}`);
}

const conclusionWriting = activities.find(
  (activity) => activity.kind === "guided-writing" && activity.id === "write-bac-conclusion",
);
assert.ok(conclusionWriting?.kind === "guided-writing");
assert.equal(
  conclusionWriting.prompts.find((prompt) => prompt.id === "opening")?.optional,
  true,
  "L’ouverture facultative doit rester facultative dans les données.",
);

assert.deepEqual(lessons.map((lesson) => lesson.source?.pages), expectedPages);
assert.deepEqual(
  lessons.map((lesson) => lesson.source?.fidelity),
  ["adapted", "adapted", "faithful-corrected", "adapted", "adapted", "adapted", "adapted", "adapted"],
);
assert.ok(lessons.every((lesson) => lesson.source?.documentTitle.includes("Baccalauréat 2025")));
assert.ok(lessons[0].source?.documentTitle.includes("DPFC"));
assert.ok(lessons[5].source?.documentTitle.includes("DPFC"));
assert.ok(lessons.filter((_, index) => index !== 0 && index !== 5).every((lesson) => !lesson.source?.documentTitle.includes("DPFC")));
assert.ok(lessons.every((lesson) => lesson.source?.section.trim()));

const body = lessons.map((lesson) => lesson.concept.bodyMarkdown ?? "").join("\n");
for (const required of [
  "Henri Queffélec",
  "Les Nouvelles littéraires",
  "16 janvier 1961",
  "expliquer et discuter",
  "Introduction",
  "Développement",
  "Conclusion",
  "Présentation et soin",
  "Les Soleils des indépendances",
  "Les Frasques d’Ebinto",
  "La Planète des singes",
  "astéroïde B612",
  "ouverture facultative",
  "correcteur humain",
]) {
  assert.ok(body.toLocaleLowerCase("fr").includes(required.toLocaleLowerCase("fr")), `Contenu essentiel absent : ${required}`);
}
assert.ok(!body.toLocaleLowerCase("fr").includes("situation d’apprentissage"));
assert.ok(
  body.includes("À éviter") && body.includes("Depuis la nuit des temps"),
  "La formule passe-partout doit rester citée uniquement comme erreur à éviter.",
);
assert.ok(body.includes("| Introduction | **3**"));
assert.ok(body.includes("| Développement | **12**"));
assert.ok(body.includes("| Conclusion | **3**"));
assert.ok(body.includes("| Présentation et soin | **2**"));
assert.ok(body.includes("| Faits culturels |") && body.includes("*Les Soleils des indépendances*"));
assert.ok(body.includes("| Faits politiques |") && body.includes("*On se chamaille pour un siège*"));
assert.ok(body.includes("problématique ou une annonce du plan"));
assert.ok(!body.includes("Grille nationale d’auto-évaluation"));
assert.ok(!body.toLocaleLowerCase("fr").includes("plan officiel"));

const serialized = JSON.stringify(path);
for (const marker of ["ÃƒÂ©", "ÃƒÂ¨", "Ã¢â‚¬", "ï¿½", "�"]) {
  assert.ok(!serialized.includes(marker), `Texte mal décodé : ${marker}`);
}
assert.ok(!serialized.includes("data:image"));
assert.ok(!serialized.includes("/assets/"));

const dataFile = new URL("../apps/web/src/data/terminalFrenchLiteraryDissertationPath.ts", import.meta.url);
assert.ok(statSync(dataFile).size < 250_000, "Le module Français dépasse 250 ko.");

const migration = readFileSync(
  new URL("../supabase/migrations/20260905120000_terminal_french_literary_dissertation_path.sql", import.meta.url),
  "utf8",
);
assert.ok(migration.includes(pathId));
expectedIds.forEach((id) => assert.ok(migration.includes(id), `Id absent de la migration : ${id}`));
assert.ok(migration.includes("array[40, 55, 60, 65, 70, 80, 75, 95]"));

const readerSource = readFileSync(
  new URL("../apps/web/src/features/lesson/ContinuousCourseScreen.tsx", import.meta.url),
  "utf8",
);
const practiceSource = readFileSync(
  new URL("../apps/web/src/features/lesson/CoursePracticePanel.tsx", import.meta.url),
  "utf8",
);
assert.ok(readerSource.includes("storageScope="));
assert.ok(practiceSource.includes("localStorage.setItem(storageKey"));
assert.ok(practiceSource.includes("localStorage.removeItem(storageKey"));
assert.ok(practiceSource.includes("window.setTimeout"));
assert.ok(practiceSource.includes("prompt.optional"));
assert.ok(practiceSource.includes("sauvegardé uniquement sur cet appareil"));
assert.ok(!readerSource.includes(".slice(0, 2)"), "Toutes les questions d’une partie doivent être affichées.");
assert.ok(!readerSource.match(/J[’']ai compris|niveau suivant|Gagner[^\n]*XP|Débloquer/i));

console.log(
  `Audit Français Terminale vert : ${lessons.length} parties, ${questions.length} vérifications, `
  + `${activities.length} ateliers non notés et 10 000 XP.`,
);
