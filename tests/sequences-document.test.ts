import assert from "node:assert/strict";
import test from "node:test";
import { terminalCSequencesDocument as course } from "../apps/web/src/data/courseDocuments/terminalCSequencesDocument";
import { terminalCSequencesPath as path } from "../apps/web/src/data/terminalCSequencesPath";
import { terminalDMathematicsPaths } from "../apps/web/src/data/terminalDMathPaths";
import { documentAnswerStatus, documentAssessmentScore, documentDraftKey, restoreDocumentDraft } from "../apps/web/src/features/lesson/document/documentAssessment";

const topics = course.sections.flatMap(section => section.topics), questions = course.evaluations.flatMap(group => group.questions);
test("Pyramide L6 : huit rubriques, dix sous-sections, trois méthodes ; path L12 intact", () => {
  assert.equal(path.id, "terminale-c-math-l12-sequences"); assert.equal(path.chapterNumber, 12);
  assert.equal(path.theme.title, "Analyse et probabilité"); assert.equal(path.courseDocument, course);
  assert.equal(course.sections.length, 8); assert.equal(topics.length, 10); assert.equal(course.evaluations.length, 3);
  assert.equal(topics.flatMap(topic => topic.examples ?? []).length, 7); assert.equal(course.evaluations.flatMap(group => group.examples).length, 3);
  assert.equal(questions.length, 3); assert.equal(course.evaluations.flatMap(group => group.writtenTasks ?? []).length, 4);
  assert.equal(course.source.lessonLabel, "Tome 1 · Leçon 6"); assert.deepEqual(course.levelIds, ["terminale-c"]);
  assert.deepEqual(course.source.summaryPages, [146, 147, 148, 149]); assert.deepEqual(course.source.evaluationPages, [150, 151, 152]);
});
test("les huit IDs/poids et les79 questions historiques sont conservés,contenu partagé avec D", () => {
  const lessons = path.modules.flatMap(module => module.lessons);
  assert.deepEqual(lessons.map(lesson => lesson.id), Object.keys(course.legacyAnchors));
  assert.deepEqual(lessons.map(lesson => lesson.xp), [50, 55, 60, 65, 70, 75, 80, 85]);
  assert.equal(lessons.flatMap(lesson => lesson.questions ?? [lesson.question]).length, 79);
  assert.deepEqual(topics.flatMap(topic => topic.legacyLessonIds ?? []).sort(), lessons.map(lesson => lesson.id).sort());
  for (const topic of topics) for (const id of topic.legacyLessonIds ?? []) assert.equal(course.legacyAnchors[id], topic.id);
  const d = terminalDMathematicsPaths.find(item => item.id === "terminale-d-math-l09-sequences")!;
  assert.ok(d); assert.deepEqual(d.courseDocument?.levelIds, ["terminale-d"]);
  assert.strictEqual(d.courseDocument?.sections, course.sections);
  assert.strictEqual(d.courseDocument?.evaluations, course.evaluations);
});
test("conditions de composition, point fixe, signes et bornes sont explicites", () => {
  const body = (id: string) => topics.find(topic => topic.id === id)!.body;
  assert.match(body("seq-usual-summary"), /q=1/); assert.match(body("seq-usual-summary"), /n-p\+1/);
  assert.match(body("seq-monotonicity-summary"), /strictement positifs/);
  assert.match(body("seq-limit-summary"), /u_n\\ne a/);
  assert.match(body("seq-recursion-summary"), /continue en/); assert.match(body("seq-recursion-summary"), /fermé/);
  assert.match(body("seq-geometric-summary"), /u_0=0/);
  assert.match(body("seq-comparison-summary"), /u_n\\to-\\infty/);
  assert.match(body("seq-growth-summary"), /alpha<0/);
  const example = course.evaluations[2].examples[0];
  assert.match(example.prompt, /frac12u_n\+4/); assert.match(example.parts![0].solution, /u_n\\le8/);
  assert.match(example.parts![3].solution, /ell=8/);
  // A recurrence with +4 has fixed point8, not4.
  let u = 2; for (let n = 0; n < 15; n++) { assert.ok(Math.abs(u - (8 - 6 * .5 ** n)) < 1e-12); u = u / 2 + 4; assert.ok(u <= 8); }
});
test("les exemples séparent leurs parties, les preuves ont une grille sans note automatique", () => {
  const examples = [...topics.flatMap(topic => topic.examples ?? []), ...course.evaluations.flatMap(group => group.examples)];
  const ids = examples.flatMap(example => [example.id, ...example.parts?.map(part => part.id) ?? []]);
  assert.equal(new Set(ids).size, ids.length);
  for (const example of examples) {
    assert.equal(Boolean(example.solution) !== Boolean(example.parts?.length), true);
    for (const part of example.parts ?? []) { assert.ok(part.prompt); assert.ok(part.solution.length > 40, part.id); }
  }
  for (const group of course.evaluations) {
    assert.ok(group.statement);
    for (const item of [...group.questions, ...group.writtenTasks ?? []]) assert.ok(topics.some(topic => topic.id === item.topicId));
    for (const task of group.writtenTasks ?? []) { assert.ok(task.model.length > 200); assert.ok(task.criteria.length >= 3); if (task.beforeQuestionId) assert.ok(group.questions.some(q => q.id === task.beforeQuestionId)); }
  }
  const { source, ...visible } = course;
  assert.ok(source.editorialNotes?.length); assert.doesNotMatch(JSON.stringify(visible), /coquille|Excellence rétablit|Solution commentée/i);
});
test("trois résultats objectifs seulement, variantes et brouillons par compte", () => {
  const answers = Object.fromEntries(questions.map(q => [q.id, q.answer.kind === "short" ? q.answer.accepted[0] : ""]));
  assert.deepEqual(documentAssessmentScore(questions, answers), { earned: 3, possible: 3, correct: 3, total: 3, percentage: 100, outOf20: 20 });
  assert.equal(documentAnswerStatus(questions[0], "0,5"), "correct");
  assert.equal(documentAnswerStatus(questions[2], "(√5-1)/2"), "correct");
  assert.equal(documentAnswerStatus(questions[2], "(sqrt(5)+1)/2"), "incorrect");
  assert.equal(documentAnswerStatus(questions[1], ""), "unanswered");
  const task = course.evaluations[0].writtenTasks![0];
  const draft = restoreDocumentDraft(JSON.stringify({ answers: { ...answers, unknown: "20" }, written: { [task.id]: "x".repeat(20000) }, submitted: true, score: 100 }), course);
  assert.equal(Object.keys(draft.answers).length, 3); assert.equal(draft.written[task.id].length, 10000);
  assert.notEqual(documentDraftKey("a", path.id, course), documentDraftKey("b", path.id, course));
});
