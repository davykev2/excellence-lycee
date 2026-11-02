import assert from "node:assert/strict";
import test from "node:test";
import { terminalCExponentialPowerDocument as course } from "../apps/web/src/data/courseDocuments/terminalCExponentialPowerDocument";
import { terminalCExponentialPowerPath as path } from "../apps/web/src/data/terminalCExponentialPowerPath";
import { terminalDMathematicsPaths } from "../apps/web/src/data/terminalDMathPaths";
import { documentAnswerStatus, documentAssessmentScore, documentDraftKey, restoreDocumentDraft } from "../apps/web/src/features/lesson/document/documentAssessment";

const topics = course.sections.flatMap(section => section.topics), questions = course.evaluations.flatMap(group => group.questions);
test("Pyramide L5 : sept rubriques, onze sous-sections et quatre méthodes, sans renuméroter L10", () => {
  assert.equal(path.id, "terminale-c-math-l10-exponential-power"); assert.equal(path.chapterNumber, 10);
  assert.equal(path.theme.title, "Analyse et probabilité"); assert.equal(path.courseDocument, course);
  assert.equal(course.sections.length, 7); assert.equal(topics.length, 11); assert.equal(course.evaluations.length, 4);
  assert.equal(topics.flatMap(topic => topic.examples ?? []).length, 8); assert.equal(course.evaluations.flatMap(group => group.examples).length, 4);
  assert.equal(questions.length, 4); assert.equal(course.evaluations.flatMap(group => group.writtenTasks ?? []).length, 2);
  assert.equal(course.source.lessonLabel, "Tome 1 · Leçon 5"); assert.deepEqual(course.levelIds, ["terminale-c"]);
  assert.deepEqual(course.source.summaryPages, [124, 125, 126, 127, 128]); assert.deepEqual(course.source.evaluationPages, [129, 130]);
  assert.deepEqual([...new Set(topics.flatMap(topic => topic.pages))], [124, 125, 126, 127, 128]);
});
test("les huit IDs/poids,128 questions et fils de feedback demeurent intacts ; contenu partagé C/D", () => {
  const lessons = path.modules.flatMap(module => module.lessons);
  assert.deepEqual(lessons.map(lesson => lesson.id), Object.keys(course.legacyAnchors));
  assert.deepEqual(lessons.map(lesson => lesson.xp), [50, 55, 60, 65, 70, 75, 80, 85]);
  assert.equal(lessons.flatMap(lesson => lesson.questions ?? [lesson.question]).length, 128);
  assert.deepEqual(topics.flatMap(topic => topic.legacyLessonIds ?? []).sort(), lessons.map(lesson => lesson.id).sort());
  for (const topic of topics) for (const id of topic.legacyLessonIds ?? []) assert.equal(course.legacyAnchors[id], topic.id);
  const d = terminalDMathematicsPaths.find(item => item.id === "terminale-d-math-l07-exponential-power")!;
  assert.ok(d); assert.deepEqual(d.courseDocument?.levelIds, ["terminale-d"]);
  assert.strictEqual(d.courseDocument?.sections, course.sections);
  assert.strictEqual(d.courseDocument?.evaluations, course.evaluations);
});
test("positivité, bases, comparaisons et primitives sont explicites, avec deux courbes natives", () => {
  const body = (id: string) => topics.find(topic => topic.id === id)!.body;
  assert.match(body("exp-definition-summary"), /bijection réciproque/);
  assert.match(body("exp-definition-summary"), /e\^x>0/);
  assert.match(body("exp-base-summary"), /a=1/);
  assert.match(body("exp-base-study-summary"), /inverse le sens/);
  assert.match(body("exp-real-powers-summary"), /extensions séparément/);
  assert.match(body("exp-powers-primitives-summary"), /alpha<-1/);
  assert.match(body("exp-growth-summary"), /alpha>0/);
  const primitive = topics.find(topic => topic.id === "exp-powers-primitives-summary")!.examples![0];
  assert.match(primitive.solution!, /x>e\^2/);
  const graphs = topics.flatMap(topic => topic.interaction ? [topic.interaction] : []);
  assert.equal(graphs.length, 2); assert.ok(graphs.every(graph => graph.kind === "curve"));
});
test("sous-questions distinctes, modèles rédigés non notés, aucune notice de coquille publique", () => {
  const examples = [...topics.flatMap(topic => topic.examples ?? []), ...course.evaluations.flatMap(group => group.examples)];
  const ids = examples.flatMap(example => [example.id, ...example.parts?.map(part => part.id) ?? []]);
  assert.equal(new Set(ids).size, ids.length);
  for (const example of examples) {
    assert.equal(Boolean(example.solution) !== Boolean(example.parts?.length), true);
    for (const part of example.parts ?? []) assert.ok(part.solution.length > 40, part.id);
  }
  for (const group of course.evaluations) {
    assert.ok(group.statement);
    for (const item of [...group.questions, ...group.writtenTasks ?? []]) assert.ok(topics.some(topic => topic.id === item.topicId));
  }
  const { source, ...visible } = course;
  assert.ok(source.editorialNotes?.length); assert.doesNotMatch(JSON.stringify(visible), /coquille|Excellence rétablit|Solution commentée/i);
  assert.match(course.evaluations[0].writtenTasks![0].model, /x\\ne4/);
  assert.match(course.evaluations[2].writtenTasks![0].model, /deux bornes/);
});
test("diagnostic sur quatre résultats seulement et brouillons bornés sans score cru", () => {
  const answers = Object.fromEntries(questions.map(q => [q.id, q.answer.kind === "short" ? q.answer.accepted[0] : ""]));
  assert.deepEqual(documentAssessmentScore(questions, answers), { earned: 4, possible: 4, correct: 4, total: 4, percentage: 100, outOf20: 20 });
  assert.equal(documentAnswerStatus(questions[0], "sqrt(1+ln(3))"), "correct");
  assert.equal(documentAnswerStatus(questions[0], "√(ln3+1)"), "correct");
  assert.equal(documentAnswerStatus(questions[1], "-sqrt(1+ln3)"), "correct");
  assert.equal(documentAnswerStatus(questions[1], "sqrt(1+ln(3))"), "incorrect");
  assert.equal(documentAnswerStatus(questions[2], "-3"), "incorrect");
  assert.equal(documentAnswerStatus(questions[3], ""), "unanswered");
  const task = course.evaluations[0].writtenTasks![0];
  const draft = restoreDocumentDraft(JSON.stringify({ answers: { ...answers, unknown: "20" }, written: { [task.id]: "x".repeat(20000) }, submitted: true, score: 100 }), course);
  assert.equal(Object.keys(draft.answers).length, 4); assert.equal(draft.written[task.id].length, 10000);
  assert.notEqual(documentDraftKey("a", path.id, course), documentDraftKey("b", path.id, course));
});
