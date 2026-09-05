import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { terminalPhilosophyPaths } from "../apps/web/src/data/terminalPhilosophyPaths";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const rawPath = terminalPhilosophyPaths.find((path) => path.id === "terminale-philo-l1-dissertation");
assert.ok(rawPath, "La dissertation philosophique doit rester publiée.");

const rawLessons = rawPath.modules.flatMap((module) => module.lessons);
const path = applyLessonXpBudget(rawPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "terminale-philo-l1-dissertation-overview",
  "terminale-philo-l1-dissertation-study-subject",
  "terminale-philo-l1-dissertation-problematisation",
  "terminale-philo-l1-dissertation-introduction",
  "terminale-philo-l1-dissertation-development-conclusion",
  "terminale-philo-l1-dissertation-mission-finale",
];
const expectedRawWeights = [40, 55, 60, 65, 70, 80];
const expectedXp = [1080, 1490, 1620, 1760, 1890, 2160];
const expectedQuestions = [2, 6, 6, 6, 7, 6];
const expectedActivityCounts = [1, 1, 1, 2, 1, 2];
const expectedPages = ["1–2", "1 et 4", "1–4", "2", "2–3", "5–7"];

assert.equal(path.presentation, "continuous-course");
assert.equal(path.subjectId, "philosophy");
assert.deepEqual(path.levelIds, ["terminale-a", "terminale-c", "terminale-d"]);
assert.equal(path.chapterNumber, 1);
assert.equal(path.title, "La dissertation philosophique");
assert.deepEqual(rawLessons.map((lesson) => lesson.xp), expectedRawWeights);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds);
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp);
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(lessons.map((lesson) => lesson.questions?.length ?? 1), expectedQuestions);
assert.equal(expectedQuestions.reduce((total, count) => total + count, 0), 33);
assert.deepEqual(lessons.map((lesson) => lesson.courseActivities?.length ?? 0), expectedActivityCounts);
assert.deepEqual(lessons.map((lesson) => lesson.source?.pages), expectedPages);
assert.ok(lessons.every((lesson) => lesson.source?.documentTitle.includes("La dissertation philosophique")));
assert.ok(lessons.every((lesson) => lesson.source?.section.trim()));

const activities = lessons.flatMap((lesson) => lesson.courseActivities ?? []);
assert.equal(activities.length, 8);
assert.equal(new Set(activities.map((activity) => activity.id)).size, activities.length);
assert.equal(activities.filter((activity) => activity.kind === "categorize").length, 2);
assert.equal(activities.filter((activity) => activity.kind === "ordering").length, 2);
assert.equal(activities.filter((activity) => activity.kind === "guided-writing").length, 4);

for (const activity of activities) {
  assert.ok(activity.title.trim().length >= 18);
  assert.ok(activity.instruction.trim().length >= 35);
  assert.ok(activity.sourceLabel?.trim());
  if (activity.kind === "categorize") {
    const groupIds = new Set(activity.groups.map((group) => group.id));
    assert.equal(groupIds.size, activity.groups.length);
    assert.ok(activity.items.length >= 6);
    assert.equal(new Set(activity.items.map((item) => item.id)).size, activity.items.length);
    assert.ok(activity.items.every((item) => groupIds.has(item.correctGroupId)));
    assert.ok(activity.items.every((item) => item.explanation.trim().length >= 28));
  } else if (activity.kind === "ordering") {
    const itemIds = activity.items.map((item) => item.id);
    assert.deepEqual([...activity.correctOrder].sort(), [...itemIds].sort());
    assert.notDeepEqual(itemIds, activity.correctOrder, "L’ordre initial doit être réellement mélangé.");
    assert.ok(activity.items.every((item) => item.detail.trim().length >= 25));
    assert.ok(activity.explanation.trim().length >= 40);
  } else {
    assert.ok(activity.prompts.length >= 1);
    assert.ok(activity.criteria.length >= 4);
    assert.equal(new Set(activity.prompts.map((prompt) => prompt.id)).size, activity.prompts.length);
    assert.equal(new Set(activity.criteria.map((criterion) => criterion.id)).size, activity.criteria.length);
    assert.ok(activity.prompts.every((prompt) => prompt.placeholder.trim().length >= 18));
    assert.ok(activity.criteria.every((criterion) => criterion.hint.trim().length >= 25));
    assert.ok(activity.modelMarkdown.trim().length >= 180);
  }
}

const activityData = JSON.stringify(activities);
assert.ok(!activityData.includes('"points"'), "Un atelier du cours continu ne doit attribuer aucun point.");
assert.ok(!activityData.includes('"correctIndex"'), "Une production libre ne doit pas recevoir de verdict textuel automatique.");
assert.ok(!activityData.includes('"acceptedAnswers"'), "Une production philosophique ne se corrige pas par égalité de chaîne.");

const bodyMarkdown = lessons.map((lesson) => lesson.concept.bodyMarkdown ?? "").join("\n");
for (const required of [
  "Étude parcellaire",
  "Reformulation",
  "Proposition pédagogique Excellence",
  "La technique est-elle nuisible",
  "amorce",
  "Axe → Argument → Référence",
  "Le travail humanise-t-il",
  "Manuscrits de 1844",
  "Tout travail travaille à faire l’homme",
  "Synthèse possible",
]) {
  assert.ok(bodyMarkdown.includes(required), "Élément fidèle absent du cours : " + required);
}
assert.ok(!bodyMarkdown.toLocaleLowerCase("fr").includes("situation d’apprentissage"));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 33);
assert.ok(questions.every((question) => question.options.length === 4));
assert.ok(questions.every((question) => question.correctIndex >= 0 && question.correctIndex < question.options.length));
assert.ok(questions.every((question) => question.explanation.trim()));

const serialized = JSON.stringify(path);
for (const marker of ["ÃƒÂ©", "ÃƒÂ¨", "Ã¢â‚¬", "ï¿½", "�"]) {
  assert.ok(!serialized.includes(marker), "Texte mal décodé détecté : " + marker);
}
assert.ok(!serialized.includes("data:image"));
assert.ok(!serialized.includes("/assets/"));

const dataFile = new URL("../apps/web/src/data/terminalPhilosophyPaths.ts", import.meta.url);
const practiceFile = new URL("../apps/web/src/features/lesson/CoursePracticePanel.tsx", import.meta.url);
assert.ok(statSync(dataFile).size < 250_000, "Le module Philosophie dépasse le budget source de 250 ko.");
assert.ok(statSync(practiceFile).size < 80_000, "Le composant d’atelier est devenu trop volumineux.");

const factorySource = readFileSync(new URL("../apps/web/src/data/philosophyPathFactory.ts", import.meta.url), "utf8");
const readerSource = readFileSync(new URL("../apps/web/src/features/lesson/ContinuousCourseScreen.tsx", import.meta.url), "utf8");
const practiceSource = readFileSync(practiceFile, "utf8");
const practiceCss = readFileSync(new URL("../apps/web/src/styles/course-practice.css", import.meta.url), "utf8");
assert.ok(factorySource.includes("presentation: course.presentation"));
assert.ok(factorySource.includes("courseActivities: section.courseActivities"));
assert.ok(factorySource.includes("source: mission.source"));
assert.ok(readerSource.includes("<CoursePracticePanel lesson={lesson} />"));
assert.ok(!readerSource.match(/J[’']ai compris|niveau suivant|Gagner[^\n]*XP|Débloquer/i));
assert.ok(practiceSource.includes("Excellence ne lui attribue aucune note automatique"));
assert.ok(practiceSource.includes("l’activité fonctionne aussi sans glisser-déposer"));
assert.ok(practiceSource.includes('aria-live="polite"'));
assert.ok(practiceCss.includes("@media (max-width: 560px)"));
assert.ok(practiceCss.includes("min-height: 44px"));
assert.ok(practiceCss.includes("font-size: 1rem"));

console.log(
  "Audit Philosophie Terminale L1 vert : "
  + lessons.length
  + " parties, "
  + questions.length
  + " questions historiques, "
  + activities.length
  + " ateliers non notés et 10 000 XP préservés.",
);
