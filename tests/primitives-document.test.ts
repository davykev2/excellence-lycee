import assert from "node:assert/strict";
import test from "node:test";
import { terminalCPrimitivesDocument as course } from "../apps/web/src/data/courseDocuments/terminalCPrimitivesDocument";
import { terminalCPrimitivesPath as path } from "../apps/web/src/data/terminalCPrimitivesPath";
import { terminalDMathematicsPaths } from "../apps/web/src/data/terminalDMathPaths";
import { documentAnswerStatus, documentAssessmentScore, documentDraftKey, restoreDocumentDraft } from "../apps/web/src/features/lesson/document/documentAssessment";

const topics = course.sections.flatMap(section => section.topics);
const questions = course.evaluations.flatMap(group => group.questions);
const lessons = path.modules.flatMap(module => module.lessons);

test("Pyramide leçon 3 : résumé complet en quatre rubriques et trois méthodes sans renuméroter L06", () => {
  assert.equal(path.id, "terminale-c-math-l06-primitives");
  assert.equal(path.chapterNumber, 6);
  assert.equal(path.theme.title, "Analyse et probabilité");
  assert.equal(path.courseDocument, course);
  assert.equal(course.source.lessonLabel, "Tome 1 · Leçon 3");
  assert.deepEqual(course.levelIds, ["terminale-c"]);
  assert.deepEqual(course.sections.map(section => section.topics.length), [3, 1, 1, 2]);
  assert.deepEqual(course.source.summaryPages, [83, 84, 85]);
  assert.deepEqual([...new Set(topics.flatMap(topic => topic.pages))], [83, 84, 85]);
  assert.deepEqual(course.source.evaluationPages, [86, 87]);
  assert.equal(topics.flatMap(topic => topic.examples ?? []).length, 5);
  assert.equal(course.evaluations.flatMap(group => group.examples).length, 3);
  assert.equal(questions.length, 3);
  assert.equal(course.evaluations.flatMap(group => group.writtenTasks ?? []).length, 3);
});

test("les 13 identifiants, poids, 101 questions historiques et les fils de feedback sont conservés", () => {
  assert.deepEqual(lessons.map(lesson => lesson.id), Object.keys(course.legacyAnchors));
  assert.deepEqual(lessons.map(lesson => lesson.xp), [50, 55, 60, 65, 70, 75, 80, 85, 85, 85, 85, 85, 85]);
  assert.equal(lessons.flatMap(lesson => lesson.questions ?? [lesson.question]).length, 101);
  assert.deepEqual(topics.flatMap(topic => topic.legacyLessonIds ?? []).sort(), lessons.map(lesson => lesson.id).sort());
  for (const topic of topics) for (const id of topic.legacyLessonIds ?? []) assert.equal(course.legacyAnchors[id], topic.id);
  const d = terminalDMathematicsPaths.find(item => item.id === "terminale-d-math-l04-primitives")!;
  assert.ok(d);
  assert.deepEqual(d.courseDocument?.levelIds, ["terminale-d"]);
  assert.strictEqual(d.courseDocument?.sections, course.sections);
  assert.strictEqual(d.courseDocument?.evaluations, course.evaluations);
  assert.equal(d.modules.flatMap(module => module.lessons).length, 13);
});

test("puissances, composées et unicité gardent les bonnes hypothèses et coefficients", () => {
  const body = (id: string) => topics.find(topic => topic.id === id)!.body;
  assert.match(body("primitive-definition-summary"), /F'\(x\)=f\(x\)/);
  assert.match(body("primitive-existence-summary"), /continue sur un intervalle/);
  assert.match(body("primitive-family-summary"), /plusieurs intervalles/);
  assert.match(body("primitive-initial-summary"), /unique primitive/);
  assert.match(body("primitive-usual-summary"), /r\\ne-1/);
  assert.match(body("primitive-usual-summary"), /\| \$\\sin x\$ \| \$-\\cos x\+C\$/);
  assert.match(body("primitive-composites-summary"), /\\cos u\\ne0/);
  assert.match(body("primitive-composites-summary"), /u>0/);
  const examples = topics.at(-1)!.examples![0].parts!;
  assert.equal(examples.length, 3);
  assert.match(examples[2].solution, /F\(x\)=2\\sqrt\{3x\+5\}/);
  assert.match(examples[2].solution, /2\\times\\frac3/);
  assert.match(course.evaluations[2].examples[0].parts![1].solution, /-\\frac\{35\}\{12\}/);
});

test("les exemples séparent chaque sous-question et n’affichent aucun commentaire de fabrication", () => {
  const examples = [...topics.flatMap(topic => topic.examples ?? []), ...course.evaluations.flatMap(group => group.examples)];
  const ids = examples.flatMap(example => [example.id, ...(example.parts?.map(part => part.id) ?? [])]);
  assert.equal(new Set(ids).size, ids.length);
  for (const example of examples) {
    assert.equal(Boolean(example.solution) !== Boolean(example.parts?.length), true);
    for (const part of example.parts ?? []) assert.ok(part.solution.length > 70);
  }
  const { source, ...visible } = course;
  assert.ok(source.editorialNotes!.some(note => note.includes("facteur 2")));
  assert.doesNotMatch(JSON.stringify(visible), /coquille|support imprime|Excellence rétablit|erreur du document|niveau \d/i);
  for (const group of course.evaluations) {
    assert.ok(group.statement);
    for (const question of group.questions) assert.ok(topics.some(topic => topic.id === question.topicId));
    for (const task of group.writtenTasks ?? []) assert.ok(topics.some(topic => topic.id === task.topicId));
  }
});

test("diagnostic limité aux trois réponses objectives ; écritures, brouillons et versions séparés", () => {
  assert.equal(documentAnswerStatus(questions[0], "OUI"), "correct");
  assert.equal(documentAnswerStatus(questions[1], "non"), "incorrect");
  assert.equal(documentAnswerStatus(questions[2], "2/2"), "correct");
  assert.equal(documentAnswerStatus(questions[2], ""), "unanswered");
  const answers = Object.fromEntries(questions.map(question => [question.id, question.answer.kind === "short" ? question.answer.accepted[0] : ""]));
  assert.deepEqual(documentAssessmentScore(questions, answers), { earned: 3, possible: 3, correct: 3, total: 3, percentage: 100, outOf20: 20 });
  const task = course.evaluations[2].writtenTasks![0];
  const draft = restoreDocumentDraft(JSON.stringify({ answers: { ...answers, invalid: "20" }, written: { [task.id]: "x".repeat(20000) }, submitted: true, score: 100 }), course);
  assert.equal(Object.keys(draft.answers).length, 3);
  assert.equal(draft.written[task.id].length, 10000);
  assert.notEqual(documentDraftKey("a", path.id, course), documentDraftKey("b", path.id, course));
  assert.notEqual(documentDraftKey("a", path.id, course), documentDraftKey("a", path.id, { ...course, version: 2 }));
});
