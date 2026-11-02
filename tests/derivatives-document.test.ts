import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { terminalCDerivativesDocument as course } from "../apps/web/src/data/courseDocuments/terminalCDerivativesDocument";
import { terminalCDerivativesPath as path } from "../apps/web/src/data/terminalCDerivativesPath";
import { terminalDMathematicsPaths } from "../apps/web/src/data/terminalDMathPaths";
import { documentAnswerStatus, documentAssessmentScore, documentDraftKey, restoreDocumentDraft } from "../apps/web/src/features/lesson/document/documentAssessment";

const topics = course.sections.flatMap(section => section.topics);
const questions = course.evaluations.flatMap(group => group.questions);
const lessons = path.modules.flatMap(module => module.lessons);

test("le chapitre 2 Pyramide reprend les six pages de résumé et trois évaluations sans déplacer les parcours", () => {
  assert.equal(path.id, "terminale-c-math-l04-derivatives-functions");
  assert.equal(path.chapterNumber, 4);
  assert.equal(path.theme.title, "Analyse et probabilité");
  assert.equal(path.courseDocument, course);
  assert.equal(course.source.lessonLabel, "Tome 1 · Leçon 2");
  assert.deepEqual(course.levelIds, ["terminale-c"]);
  assert.deepEqual(course.sections.map(section => section.topics.length), [4, 3, 2, 1]);
  assert.deepEqual(course.source.summaryPages, [59, 60, 61, 62, 63, 64]);
  assert.deepEqual([...new Set(topics.flatMap(topic => topic.pages))], course.source.summaryPages);
  assert.deepEqual(course.evaluations.flatMap(group => group.pages), [65, 66, 67]);
  assert.equal(topics.flatMap(topic => topic.examples ?? []).length, 10);
  assert.equal(course.evaluations.flatMap(group => group.examples).length, 3);
  assert.equal(questions.length, 5);
  assert.equal(course.evaluations.flatMap(group => group.writtenTasks ?? []).length, 2);
  assert.equal(topics.filter(topic => topic.interaction).length, 2);
});

test("les quinze parties historiques, poids, 101 questions et fils de feedback restent inchangés", () => {
  assert.deepEqual(lessons.map(lesson => lesson.id), Object.keys(course.legacyAnchors));
  assert.deepEqual(lessons.map(lesson => lesson.xp), [50, 55, 60, 65, 70, 75, 80, 85, 85, 85, 85, 85, 85, 85, 85]);
  assert.equal(lessons.flatMap(lesson => lesson.questions ?? [lesson.question]).length, 101);
  assert.deepEqual(topics.flatMap(topic => topic.legacyLessonIds ?? []).sort(), lessons.map(lesson => lesson.id).sort());
  for (const topic of topics) for (const id of topic.legacyLessonIds ?? []) assert.equal(course.legacyAnchors[id], topic.id);
  assert.ok(Object.values(course.legacyAnchors).every(id => topics.some(topic => topic.id === id)));
  const d = terminalDMathematicsPaths.find(item => item.id === "terminale-d-math-l03-derivatives-functions")!;
  assert.ok(d);
  assert.deepEqual(d.courseDocument?.levelIds, ["terminale-d"]);
  assert.strictEqual(d.courseDocument?.sections, course.sections);
  assert.strictEqual(d.courseDocument?.evaluations, course.evaluations);
  assert.equal(d.modules.flatMap(module => module.lessons).length, 15);
});

test("les propriétés latérales, de composition, réciproque et accroissements gardent leurs hypothèses", () => {
  const get = (id: string) => topics.find(topic => topic.id === id)!.body;
  assert.match(get("lateral-derivatives"), /finis.*égaux/);
  assert.match(get("vertical-tangent"), /continue en/);
  const half = get("vertical-half-tangents-summary");
  assert.match(half, /gauche.*\+\\infty.*bas/);
  assert.match(half, /gauche.*-\\infty.*haut/);
  assert.match(half, /droite.*\+\\infty.*haut/);
  assert.match(half, /droite.*-\\infty.*bas/);
  assert.match(get("chain-rule"), /g'\(f\(a\)\)/);
  assert.match(get("usual-composites"), /u\(x\)>0/);
  assert.match(get("inverse-derivative-summary"), /f'\(f\^{-1\}\(b\)\)\\ne0/);
  assert.match(get("inflection-point"), /changeant de signe/);
  const iaf = get("finite-increments-summary");
  assert.match(iaf, /### Propriété 1/);
  assert.match(iaf, /### Propriété 2/);
  assert.match(iaf, /m\(b-a\)\\le f\(b\)-f\(a\)\\le M\(b-a\)/);
  assert.match(iaf, /M\\ge0/);
});

test("les exemples composés séparent tous leurs points et gardent une rédaction développée", () => {
  const examples = [...topics.flatMap(topic => topic.examples ?? []), ...course.evaluations.flatMap(group => group.examples)];
  const ids = examples.flatMap(example => [example.id, ...(example.parts?.map(part => part.id) ?? [])]);
  assert.equal(new Set(ids).size, ids.length);
  for (const example of examples) {
    assert.equal(Boolean(example.solution) !== Boolean(example.parts?.length), true, example.id);
    for (const part of example.parts ?? []) {
      assert.ok(part.prompt.length > 8);
      assert.ok(part.solution.length > 60, part.id);
    }
  }
  const interval = examples.find(example => example.id === "closed-interval-example")!;
  assert.deepEqual(interval.parts?.map(part => part.label), ["a)", "b)", "c)"]);
  assert.match(interval.parts![1].solution, /x\^2-x\+1/);
});

test("le style du graphique ne modifie pas les SVG internes des racines KaTeX", () => {
  const styles = readFileSync(new URL("../apps/web/src/styles/mastery.css", import.meta.url), "utf8");
  assert.match(styles, /\.mastery-curve-lab > svg\s*\{/);
  assert.doesNotMatch(styles, /\.mastery-curve-lab svg\s*\{/);
});

test("les coquilles sont tracées en interne seulement, domaines et résultats corrects", () => {
  const { source, ...visible } = course;
  assert.ok(source.editorialNotes!.some(note => note.includes("x<0/x>=0")));
  assert.doesNotMatch(JSON.stringify(visible), /coquille|support imprime|Excellence rétablit|erreur du document/i);
  const first = topics[0].examples![0];
  assert.match(first.prompt, /x<1/);
  assert.match(first.prompt, /x\\ge1/);
  const evalText = course.evaluations[0].statement!;
  assert.match(evalText, /\\mathbb R\\setminus\\\{2\\\}/);
  assert.match(course.evaluations[1].writtenTasks![0].model, /2\\sin x/);
  for (const group of course.evaluations) {
    assert.ok(group.statement);
    for (const question of group.questions) assert.ok(topics.some(topic => topic.id === question.topicId));
    for (const task of group.writtenTasks ?? []) assert.ok(topics.some(topic => topic.id === task.topicId));
  }
});

test("le raccord en 3 est continu mais ses deux pentes valent 1 et 27", () => {
  assert.equal(1 / (2 - 3), -1);
  assert.equal(3 ** 3 - 28, -1);
  const epsilon = 1e-6;
  assert.ok(Math.abs((1 / (2 - (3 - epsilon)) + 1) / (-epsilon) - 1) < 1e-4);
  assert.ok(Math.abs(((3 + epsilon) ** 3 - 27) / epsilon - 27) < 1e-3);
  assert.equal(documentAnswerStatus(questions[0], "1,00"), "correct");
  assert.equal(documentAnswerStatus(questions[1], "54/2"), "correct");
  assert.equal(documentAnswerStatus(questions[2], "NON"), "correct");
  assert.equal(documentAnswerStatus(questions[2], "oui"), "incorrect");
  assert.equal(documentAnswerStatus(questions[2], ""), "unanswered");
});

test("l’inflexion de tan et la réciproque du sinus donnent 0 puis 2", () => {
  const second = (x: number) => 2 * Math.sin(x) / Math.cos(x) ** 3;
  assert.ok(second(-0.1) < 0);
  assert.equal(second(0), 0);
  assert.ok(second(0.1) > 0);
  assert.ok(Math.abs(1 / Math.cos(Math.PI / 3) - 2) < 1e-12);
  assert.equal(documentAnswerStatus(questions[3], "0"), "correct");
  assert.equal(documentAnswerStatus(questions[4], "2"), "correct");
});

test("seules les cinq réponses objectives entrent dans le diagnostic ; brouillons cloisonnés et bornés", () => {
  const answers = Object.fromEntries(questions.map(question => [question.id, question.answer.kind === "short" ? question.answer.accepted[0] : ""]));
  assert.deepEqual(documentAssessmentScore(questions, answers), { earned: 5, possible: 5, correct: 5, total: 5, percentage: 100, outOf20: 20 });
  assert.equal(documentAssessmentScore(questions, {}).outOf20, 0);
  const task = course.evaluations[1].writtenTasks![0];
  const restored = restoreDocumentDraft(JSON.stringify({ answers: { ...answers, unknown: "20" }, written: { [task.id]: "x".repeat(20000), unknown: "texte" }, submitted: true, score: 100 }), course);
  assert.equal(Object.keys(restored.answers).length, 5);
  assert.equal(restored.written[task.id].length, 10000);
  assert.equal(restored.written.unknown, undefined);
  assert.notEqual(documentDraftKey("a", path.id, course), documentDraftKey("b", path.id, course));
  const source = readFileSync(new URL("../apps/web/src/features/lesson/document/DocumentEvaluation.tsx", import.meta.url), "utf8");
  assert.ok(source.includes("group.statement"));
  assert.doesNotMatch(source, /placeholder="Explique la continuité, les signes aux bornes/);
});
