import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { terminalCLimitsContinuityDocument as course } from "../apps/web/src/data/courseDocuments/terminalCLimitsContinuityDocument";
import { terminalCLimitsContinuityPath as path } from "../apps/web/src/data/terminalCLimitsContinuityPath";
import { appRouteUrl, readAppRoute } from "../apps/web/src/routing/appRoute";
import {
  documentAnswerStatus, documentAssessmentScore, documentDraftKey, parseDocumentNumber, restoreDocumentDraft,
} from "../apps/web/src/features/lesson/document/documentAssessment";

const questions = course.evaluations.flatMap(group => group.questions);
const topics = course.sections.flatMap(section => section.topics);

test("le document reprend les quatre rubriques et les 17 pages sans dépendre des anciens niveaux", () => {
  assert.deepEqual(course.sections.map(section => section.title), ["Limite", "Continuité", "Étude d’une branche infinie", "Fonction puissance d’exposant rationnel"]);
  assert.deepEqual(course.sections.map(section => section.topics.length), [7, 8, 3, 2]);
  assert.deepEqual([...new Set(topics.flatMap(topic => topic.pages))].sort((a, b) => a - b), course.source.summaryPages);
  assert.deepEqual(course.evaluations.flatMap(group => group.pages).filter((page, index, pages) => pages.indexOf(page) === index), [15, 16, 17]);
  assert.equal(questions.length, 7);
  assert.equal(course.evaluations.flatMap(group => group.writtenTasks ?? []).length, 1);
  assert.equal(course.evaluations.flatMap(group => group.examples).length, 6);
  assert.equal(topics.filter(topic => topic.interaction).length, 2);
  assert.equal(path.theme.title, "Analyse et probabilité");
});

test("les dix ids, poids, questions et liens historiques restent intacts", () => {
  const lessons = path.modules.flatMap(module => module.lessons);
  assert.deepEqual(lessons.map(lesson => lesson.id), Object.keys(course.legacyAnchors));
  assert.deepEqual(lessons.map(lesson => lesson.xp), [50, 55, 60, 65, 70, 75, 80, 85, 85, 85]);
  assert.equal(lessons.flatMap(lesson => lesson.questions ?? [lesson.question]).length, 73);
  assert.ok(Object.values(course.legacyAnchors).every(id => topics.some(topic => topic.id === id)));
  assert.deepEqual(course.levelIds, ["terminale-c"]);
});

test("les sous-questions des exemples ont chacune leur énoncé et leur correction", () => {
  const examples = topics.flatMap(topic => topic.examples ?? []);
  const first = examples.find(example => example.id === "reference-examples")!;
  assert.equal(first.solution, undefined);
  assert.deepEqual(first.parts?.map(part => part.label), ["a)", "b)", "c)", "d)"]);
  assert.deepEqual(first.parts?.map(part => part.id), ["reference-a", "reference-b", "reference-c", "reference-d"]);
  for (const part of first.parts ?? []) {
    assert.ok(part.prompt.length > 10);
    assert.ok(part.solution.includes("**Car :**"));
    assert.ok(part.solution.includes("\\lim"));
  }
  for (const id of ["sum-examples", "product-examples", "quotient-examples", "rational-asymptotes", "axis-branches"]) {
    assert.equal(examples.find(example => example.id === id)?.parts?.length, 2);
  }
  const allExamples = [...examples, ...course.evaluations.flatMap(group => group.examples)];
  for (const example of allExamples) assert.equal(Boolean(example.solution) !== Boolean(example.parts?.length), true, example.id);
  const ids = allExamples.flatMap(example => example.parts?.map(part => part.id) ?? []);
  assert.equal(new Set(ids).size, ids.length);
});

test("la rédaction garde les propriétés distinctes et les méthodes des corrigés du support", () => {
  const monotone = topics.find(topic => topic.id === "monotone-limit")!.body;
  for (const number of [1, 2, 3, 4]) assert.ok(monotone.includes(`### Propriété ${number}`));
  const comparison = topics.find(topic => topic.id === "comparison-limit")!.body;
  assert.ok(comparison.includes("### Propriété 1"));
  assert.ok(comparison.includes("### Propriété 2"));
  const composition = topics.find(topic => topic.id === "composition-limit")!.body;
  assert.ok(composition.includes("### Propriété"));
  assert.ok(composition.includes("### Conséquences"));
  const worked = course.evaluations[0].examples;
  for (const [index, method] of ["factorisation", "expression conjuguée", "nombre dérivé", "changement d’écriture"].entries()) {
    assert.ok(worked[index].solution?.includes(method));
  }
  const root = course.evaluations[2].examples[0];
  assert.deepEqual(root.parts?.map(part => part.id), ["bracketing-by-sweep", "bracketing-by-bisection"]);
});

test("le dernier exercice utilise l’intervalle juste, sans notice éditoriale publique", () => {
  const text = JSON.stringify(course);
  assert.doesNotMatch(text, /coquille|document imprime|erreur du|Excellence rétablit|corrigé par Excellence/i);
  assert.ok(text.includes("2x^3+5x-1=0"));
  const alpha = questions.find(question => question.id === "bracketing-alpha")!;
  assert.deepEqual(alpha.answer, { kind: "interval", lower: 0.19, upper: 0.2, variable: "α" });
  assert.ok(2 * 0.19 ** 3 + 5 * 0.19 - 1 < 0);
  assert.ok(2 * 0.2 ** 3 + 5 * 0.2 - 1 > 0);
  assert.ok(text.includes("3^{-36/35}"));
  for (const question of questions) assert.ok(topics.some(topic => topic.id === question.topicId));
});

test("les titres mathématiques conservent leurs commandes et passent par le rendu de formules", () => {
  const examples = [...topics.flatMap(topic => topic.examples ?? []), ...course.evaluations.flatMap(group => group.examples)];
  assert.equal(examples.find(example => example.id === "radicals-worked")?.title, String.raw`Tenir compte du signe en $-\infty$`);
  assert.equal(examples.find(example => example.id === "quotient-examples")?.title, "Quotients en $-1$");
  assert.equal(examples.find(example => example.id === "zero-intercept")?.title, "Le cas où $b=0$");
  const screen = readFileSync(new URL("../apps/web/src/features/lesson/document/LessonDocumentScreen.tsx", import.meta.url), "utf8");
  const evaluation = readFileSync(new URL("../apps/web/src/features/lesson/document/DocumentEvaluation.tsx", import.meta.url), "utf8");
  for (const source of [screen, evaluation]) assert.ok(source.includes("<MathText>{example.title}</MathText>"));
  for (const field of ["section.title", "topic.title", "topic.interaction.title"]) assert.ok(screen.includes(`<MathText>{${field}}</MathText>`));
  assert.ok(evaluation.includes("<MathText>{group.title}</MathText>"));
});

test("la saisie accepte virgules, signes Unicode, décimaux et fractions sans exécuter de code", () => {
  for (const [text, expected] of [["0,20", 0.2], ["−0,75", -0.75], ["3/5", 0.6], ["+1,0", 1]] as const) assert.equal(parseDocumentNumber(text), expected);
  for (const text of ["", "Infinity", "NaN", "1/0", "1+1", "alert(1)", "0.2abc", "1/2/3"]) assert.equal(parseDocumentNumber(text), null);
  assert.equal(documentAnswerStatus(questions[0], "1,00"), "correct");
  assert.equal(documentAnswerStatus(questions[0], "2/2"), "correct");
  const infinity = questions.find(question => question.id === "radicals-a")!;
  for (const text of ["−∞", "-infini", "-infinity", "-\\infty"]) assert.equal(documentAnswerStatus(infinity, text), "correct");
  assert.equal(documentAnswerStatus(infinity, "+∞"), "incorrect");
});

test("les encadrements exigent les deux bonnes bornes consécutives", () => {
  const question = questions.find(question => question.id === "bracketing-beta")!;
  assert.equal(documentAnswerStatus(question, { lower: "3/5", upper: "0,7" }), "correct");
  assert.equal(documentAnswerStatus(question, { lower: "0,6", upper: "" }), "unanswered");
  assert.equal(documentAnswerStatus(question, { lower: "0,7", upper: "0,6" }), "incorrect");
  assert.equal(documentAnswerStatus(question, { lower: "0", upper: "1" }), "incorrect");
  assert.equal(documentAnswerStatus(question, "0,6 < beta < 0,7"), "unanswered");
});

test("le bilan pondéré corrige uniquement les réponses objectives, jamais la rédaction", () => {
  const answers = Object.fromEntries(questions.map(question => [question.id, question.answer.kind === "short" ? question.answer.accepted[0] : { lower: String(question.answer.lower), upper: String(question.answer.upper) }]));
  assert.deepEqual(documentAssessmentScore(questions, answers), { earned: 9, possible: 9, correct: 7, total: 7, percentage: 100, outOf20: 20 });
  assert.equal(documentAssessmentScore(questions, {}).outOf20, 0);
  assert.equal(documentAssessmentScore(questions, { "bracketing-alpha": { lower: "0,19", upper: "0,20" } }).outOf20, 4.4);
  assert.equal(documentAnswerStatus(questions[0], ""), "unanswered");
  assert.equal(documentAnswerStatus(questions[0], "7"), "incorrect");
});

test("le brouillon est borné, versionné et cloisonné par utilisateur/parcours", () => {
  const key = documentDraftKey("élève:a", path.id, course);
  assert.notEqual(key, documentDraftKey("élève:b", path.id, course));
  assert.notEqual(key, documentDraftKey("élève:a", "autre", course));
  assert.notEqual(key, documentDraftKey("élève:a", path.id, { ...course, version: 2 }));
  const restored = restoreDocumentDraft(JSON.stringify({ answers: { "indeterminate-a": "1", "bracketing-alpha": { lower: "0,19", upper: "0,20" }, secret: "no" }, written: { "alpha-existence-uniqueness": "Mon raisonnement", secret: "no" }, submitted: true }), course);
  assert.deepEqual(Object.keys(restored.answers), ["indeterminate-a", "bracketing-alpha"]);
  assert.deepEqual(Object.keys(restored.written), ["alpha-existence-uniqueness"]);
  assert.equal(restored.submitted, true);
  assert.deepEqual(restoreDocumentDraft("{broken", course), { answers: {}, written: {}, submitted: false });
  assert.equal((restoreDocumentDraft(JSON.stringify({ answers: { "indeterminate-a": "a".repeat(2000) } }), course).answers["indeterminate-a"] as string).length, 500);
});

test("l’onglet évaluation survit à F5 sans changer les anciens liens", () => {
  const pathname = `/parcours/${path.id}`;
  const route = readAppRoute({ pathname, search: "?matiere=mathematics&vue=evaluation" }, { navigation: "home" });
  assert.equal(route.courseTab, "assessment");
  assert.equal(appRouteUrl(route, ""), `${pathname}?matiere=mathematics&vue=evaluation`);
  assert.equal(readAppRoute({ pathname, search: "" }, { navigation: "home" }).courseTab, undefined);
  assert.equal(appRouteUrl({ ...route, courseTab: "summary" }, "?vue=evaluation"), `${pathname}?matiere=mathematics`);
  assert.equal(readAppRoute({ pathname: "/parcours", search: "?vue=evaluation" }, { navigation: "home" }).courseTab, undefined);
});

test("le nouveau lecteur ne présente aucun niveau ou parcours gamifié", () => {
  const screen = readFileSync(new URL("../apps/web/src/features/lesson/document/LessonDocumentScreen.tsx", import.meta.url), "utf8");
  const evaluation = readFileSync(new URL("../apps/web/src/features/lesson/document/DocumentEvaluation.tsx", import.meta.url), "utf8");
  assert.match(screen, /role="tablist"/);
  assert.match(screen, /Résumé de la leçon/);
  assert.match(screen, /Questions d’évaluation/);
  assert.doesNotMatch(screen, /getPathLessons|\.modules\.map|J’ai compris|Niveau \{/);
  assert.match(evaluation, /<del><MathText>/);
  assert.match(evaluation, /Pas de réponse/);
  assert.match(evaluation, /Refaire mes erreurs/);
  assert.match(evaluation, /n’est pas notée automatiquement/);
  assert.doesNotMatch(evaluation, /progress\/attempt|xpAwarded|submitAttempt/);
});
