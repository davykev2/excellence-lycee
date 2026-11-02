import assert from "node:assert/strict";
import test from "node:test";
import { terminalCLogarithmsDocument as course } from "../apps/web/src/data/courseDocuments/terminalCLogarithmsDocument";
import { terminalCLogarithmsPath as path } from "../apps/web/src/data/terminalCLogarithmsPath";
import { terminalDMathematicsPaths } from "../apps/web/src/data/terminalDMathPaths";
import { documentAnswerStatus, documentAssessmentScore, documentDraftKey, restoreDocumentDraft } from "../apps/web/src/features/lesson/document/documentAssessment";

const topics = course.sections.flatMap(section => section.topics), lessons = path.modules.flatMap(module => module.lessons);
const questions = course.evaluations.flatMap(group => group.questions);

test("Pyramide L4 : cinq rubriques et trois méthodes sans déplacer le path historique L08", () => {
  assert.equal(path.id, "terminale-c-math-l08-logarithms"); assert.equal(path.chapterNumber, 8);
  assert.equal(path.theme.title, "Analyse et probabilité"); assert.equal(path.courseDocument, course);
  assert.equal(course.source.lessonLabel, "Tome 1 · Leçon 4"); assert.deepEqual(course.levelIds, ["terminale-c"]);
  assert.deepEqual(course.sections.map(section => section.topics.length), [1, 1, 3, 2, 1]);
  assert.deepEqual(course.source.summaryPages, [101, 102, 103]);
  assert.deepEqual(course.source.evaluationPages, [104, 105]);
  assert.deepEqual([...new Set(topics.flatMap(topic => topic.pages))], [101, 102, 103]);
  assert.equal(topics.flatMap(topic => topic.examples ?? []).length, 8);
  assert.equal(course.evaluations.flatMap(group => group.examples).length, 3);
  assert.equal(questions.length, 5); assert.equal(course.evaluations.flatMap(group => group.writtenTasks ?? []).length, 2);
});

test("les 11 IDs,105 questions,poids et fils historiques sont intacts ; contenu partagé C/D", () => {
  assert.deepEqual(lessons.map(lesson => lesson.id), Object.keys(course.legacyAnchors));
  assert.deepEqual(lessons.map(lesson => lesson.xp), [50, 55, 60, 65, 70, 75, 80, 85, 85, 85, 85]);
  assert.equal(lessons.flatMap(lesson => lesson.questions ?? [lesson.question]).length, 105);
  assert.deepEqual(topics.flatMap(topic => topic.legacyLessonIds ?? []).sort(), lessons.map(lesson => lesson.id).sort());
  for (const topic of topics) for (const id of topic.legacyLessonIds ?? []) assert.equal(course.legacyAnchors[id], topic.id);
  const d = terminalDMathematicsPaths.find(item => item.id === "terminale-d-math-l05-logarithms")!;
  assert.ok(d); assert.deepEqual(d.courseDocument?.levelIds, ["terminale-d"]);
  assert.strictEqual(d.courseDocument?.sections, course.sections);
  assert.strictEqual(d.courseDocument?.evaluations, course.evaluations);
  assert.equal(d.modules.flatMap(module => module.lessons).length, 11);
});

test("positivité, valeurs absolues, bases et six limites de référence sont explicitement conservées", () => {
  const body = (id: string) => topics.find(topic => topic.id === id)!.body;
  assert.match(body("log-definition-summary"), /unique primitive/);
  assert.match(body("log-definition-summary"), /strictement croissante/);
  assert.match(body("log-algebra-summary"), /a>0/);
  assert.match(body("log-algebra-summary"), /r\\in\\mathbb Q/);
  assert.match(body("log-limits-summary"), /h\\to0/);
  assert.doesNotMatch(body("log-limits-summary"), /h\\to1/);
  assert.match(body("log-derivative-summary"), /ne s’annule pas/);
  assert.match(body("log-derivative-summary"), /\\ln\(-u\)/);
  assert.match(body("log-primitives-summary"), /\\ln\|u\|\+C/);
  assert.match(body("log-bases-summary"), /a\\ne1/);
  assert.match(body("log-bases-summary"), /strictement décroissante/);
  const graph = topics.find(topic => topic.interaction)!.interaction;
  assert.equal(graph?.kind, "curve");
  if (graph?.kind === "curve") {
    assert.deepEqual(graph.rule, { kind: "affine-plus-log", slope: 0, intercept: 0, coefficient: 1 });
    assert.equal(graph.guides?.length, 3); assert.ok(graph.marker.min > 0);
  }
});

test("les exemples séparent leurs points et les notes de source restent internes", () => {
  const examples = [...topics.flatMap(topic => topic.examples ?? []), ...course.evaluations.flatMap(group => group.examples)];
  const ids = examples.flatMap(example => [example.id, ...(example.parts?.map(part => part.id) ?? [])]);
  assert.equal(new Set(ids).size, ids.length);
  for (const example of examples) {
    assert.equal(Boolean(example.solution) !== Boolean(example.parts?.length), true, example.id);
    for (const part of example.parts ?? []) assert.ok(part.solution.length > 40, part.id);
  }
  const { source, ...visible } = course;
  assert.ok(source.editorialNotes!.some(note => note.includes("privé de -2")));
  assert.doesNotMatch(JSON.stringify(visible), /coquille|support imprime|Excellence rétablit|Solution commentée/i);
  for (const group of course.evaluations) {
    assert.ok(group.statement);
    for (const question of group.questions) assert.ok(topics.some(topic => topic.id === question.topicId));
    for (const task of group.writtenTasks ?? []) assert.ok(topics.some(topic => topic.id === task.topicId));
  }
});

test("diagnostic sur cinq réponses seulement, domaines stricts et brouillons cloisonnés", () => {
  assert.equal(documentAnswerStatus(questions[0], "+∞"), "correct");
  assert.equal(documentAnswerStatus(questions[0], "-∞"), "incorrect");
  assert.equal(documentAnswerStatus(questions[1], ""), "unanswered");
  assert.equal(documentAnswerStatus(questions[2], { lower: "-1", upper: "1" }), "correct");
  assert.equal(documentAnswerStatus(questions[2], { lower: "0", upper: "1" }), "incorrect");
  assert.equal(documentAnswerStatus(questions[3], "-4/6"), "correct");
  assert.equal(documentAnswerStatus(questions[4], "2/6"), "correct");
  const answers = Object.fromEntries(questions.map(question => [question.id, question.answer.kind === "short" ? question.answer.accepted[0] : { lower: "-1", upper: "1" }]));
  assert.deepEqual(documentAssessmentScore(questions, answers), { earned: 5, possible: 5, correct: 5, total: 5, percentage: 100, outOf20: 20 });
  const task = course.evaluations[1].writtenTasks![0];
  const draft = restoreDocumentDraft(JSON.stringify({ answers: { ...answers, invalid: "20" }, written: { [task.id]: "x".repeat(20000) }, submitted: true, score: 100 }), course);
  assert.equal(Object.keys(draft.answers).length, 5); assert.equal(draft.written[task.id].length, 10000);
  assert.notEqual(documentDraftKey("a", path.id, course), documentDraftKey("b", path.id, course));
});
