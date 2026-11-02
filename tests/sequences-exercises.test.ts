import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { arenaPayloadSchema } from "../apps/api/src/arenaExerciseSchema";
import { terminalCSequencesExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCSequencesExercises";
import { terminalCSequencesDocument as course } from "../apps/web/src/data/courseDocuments/terminalCSequencesDocument";
import { loadExerciseCollection } from "../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import { exerciseAnswerStatus, exerciseAssessment, exerciseDraftKey, restoreExerciseDraft } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { annualSalary, cobwebFunctions, cobwebSteps, cumulativeCases, inflationFactor, salaryTotal, sequenceValue } from "../apps/web/src/features/arena/exercises/sequencePlotModels";

const exercises = bank.sections.flatMap(s => s.exercises), questions = exercises.flatMap(e => e.questions ?? []);
const find = (n: number) => exercises.find(e => e.sourceNumber === n)!;
const require = createRequire(new URL("../apps/web/package.json", import.meta.url)), katex = require("katex");
const close = (a: number, b: number, tolerance = 1e-10) => assert.ok(Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(b)), a + " ≠ " + b);
test("55 exercices, sept rubriques, 171 sous-questions sans trou ni doublon", () => {
  assert.deepEqual(exercises.map(e => e.sourceNumber), Array.from({ length: 55 }, (_, i) => i + 1));
  assert.deepEqual(["fixation", "deepening", "complex"].map(c => bank.sections.filter(s => s.category === c).flatMap(s => s.exercises).length), [27, 25, 3]);
  assert.equal(bank.sections.filter(s => s.category === "fixation").length, 7);
  assert.equal(questions.length, 171); assert.equal(questions.filter(q => q.answer.kind !== "written").length, 62);
  assert.equal(questions.filter(q => q.answer.kind === "written").length, 109);
  assert.equal(new Set(questions.map(q => q.id)).size, 171); assert.equal(new Set(exercises.map(e => e.id)).size, 55);
  assert.deepEqual(bank.source.pages, [151, 152, 153, 154, 155, 156]);
  for (const section of bank.sections) assert.ok(course.sections.flatMap(s => s.topics).some(t => t.id === section.courseTopicId));
  assert.equal(find(31).sourcePage, 152); assert.equal(find(39).sourcePage, 153); assert.equal(find(53).sourcePage, 156);
});
test("les onze figures restent uniquement dans les corrections et passent le contrat API", () => {
  for (const [index, section] of bank.sections.entries()) {
    const payload = { levelId: bank.levelId, subjectId: bank.subjectId, lessonKey: bank.lessonKey, lessonTitle: "Suites numériques", difficulty: "easy", category: section.category, stageNumber: index + 1, title: section.title, instructionsMarkdown: "", sourceSectionId: section.id, courseTopicId: section.courseTopicId, exercises: section.exercises };
    assert.deepEqual(arenaPayloadSchema.parse(payload).exercises, section.exercises);
  }
  assert.deepEqual(exercises.filter(e => e.correctionFigureKey).map(e => e.sourceNumber), [1, 2, 31, 36, 39, 46, 48, 49, 52, 53, 54]);
  assert.ok(exercises.every(e => !e.figureKey));
});
test("KaTeX strict, réponses acceptées et rédactions à zéro point automatique", () => {
  let formulas = 0;
  const visit = (value: unknown) => { if (typeof value === "string") { for (const m of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)) { katex.renderToString(m[1] ?? m[2], { throwOnError: true, strict: "error", trust: false, displayMode: Boolean(m[1]) }); formulas++; } } else if (Array.isArray(value)) value.forEach(visit); else if (value && typeof value === "object") Object.values(value).forEach(visit); };
  visit(bank); assert.ok(formulas > 1400);
  for (const exercise of exercises) {
    const answers: Record<string, string> = {};
    for (const question of exercise.questions ?? []) {
      assert.ok(question.explanation.length > 20, exercise.id + "/" + question.label);
      assert.ok(exercise.correctionMarkdown.includes(question.explanation));
      if (question.answer.kind === "written") { assert.equal(question.points, 0); assert.equal(exerciseAnswerStatus(question, "ma preuve"), "written"); }
      else { const values = question.answer.kind === "short" ? question.answer.accepted : [String(question.answer.correctIndex)]; for (const value of values) assert.equal(exerciseAnswerStatus(question, value), "correct", exercise.id + "/" + value); answers[question.id] = values[0]; assert.equal(exerciseAnswerStatus(question, ""), "unanswered"); }
    }
    const result = exerciseAssessment(exercise, answers); assert.equal(result.outOf20, result.total ? 20 : null);
  }
});
test("conditions initiales, erreurs de rang et limites fausses ne reviennent pas", () => {
  assert.match(find(4).questions![0].prompt, /n\\ge1/);
  assert.match(find(8).correctionMarkdown, /u_\{3k\+2\}=-1/);
  assert.match(find(14).questions![2].explanation, /rangs pairs/);
  assert.match(find(15).questions![2].explanation, /majorant géométrique/);
  assert.match(find(18).statementMarkdown, /n\\sqrt n\+1/);
  assert.match(find(34).correctionMarkdown, /deux rangs/);
  assert.match(find(39).questions![5].prompt, /U_0\+6/);
  assert.doesNotMatch(find(39).questions![5].prompt, /frac12/);
  assert.match(find(41).questions!.at(-1)!.explanation, /ne suffit pas/);
  assert.match(find(43).statementMarkdown, /1\\times2\+2\\times3/);
  assert.match(find(51).questions!.at(-1)!.explanation, /ne peut pas conclure/);
  assert.match(find(52).statementMarkdown, /x\\ge-6/);
  const { source, ...visible } = bank; assert.ok(source.editorialNotes.length >= 10);
  assert.doesNotMatch(JSON.stringify(visible), /coquille|Excellence rétablit|Solution commentée/i);
});
test("termes, constructions et formules explicites vérifiés indépendamment", () => {
  const recurrences: Array<[number, number, (u: number) => number]> = [[1, 1, u => u / 2 + 3], [31, 0, u => .6 * u + 1], [36, 3, u => 2 / (1 + u)], [39, 4, u => u / 2 - 3], [46, -5, u => u + 1.5], [49, 2, u => 4 - 3 / u], [52, 0, u => Math.sqrt(u + 6)]];
  for (const [number, initial, next] of recurrences) {
    let u = initial;
    for (let n = 0; n <= 15; n++) { close(sequenceValue(number, n), u); u = next(u); }
  }
  let a = 2, b = -2;
  for (let n = 0; n < 10; n++) { close(sequenceValue(2, n), a); close(sequenceValue(2, n, 1), b); a++; b = b / 3 + 2; }
  for (const number of [31, 36, 49, 52]) {
    const points = cobwebSteps(number, 5); assert.equal(points.length, 11);
    for (let n = 0; n < 5; n++) {
      close(points[2 * n + 1][0], sequenceValue(number, n)); close(points[2 * n + 1][1], sequenceValue(number, n + 1));
      close(points[2 * n + 2][0], points[2 * n + 2][1]);
      close(cobwebFunctions[number].fn(sequenceValue(number, n)), sequenceValue(number, n + 1));
    }
  }
  assert.deepEqual(cobwebSteps(999, 2), []); assert.equal(cobwebSteps(49, 10000).length, 25);
});
test("récurrences transformées, sommes et produits vérifiés aux premiers rangs", () => {
  let u32 = 2 / 3, sum32 = 0, u37 = 9 * Math.E, u38 = 0, u40 = 1 / 3, product40 = 1, u50 = 0;
  for (let n = 0; n <= 10; n++) {
    close(u32, n / Math.SQRT2 + 2 / 3 * .5 ** n); sum32 += u32;
    close(sum32, n * (n + 1) / (2 * Math.SQRT2) + 4 / 3 * (1 - .5 ** (n + 1)));
    close(u37, 9 * Math.exp(.5 ** n)); close(u38, 2 / (n + 1) - 2);
    close(u40, 2 / 3 * 2 ** (-(2 ** n))); close(u50, 3 ** n + n - 1);
    if (n > 0) close(product40, (2 / 3) ** n * 2 ** (1 - 2 ** n));
    product40 *= u40; u40 = 1.5 * u40 * u40;
    u32 = u32 / 2 + (n + 2) / (2 * Math.SQRT2); u37 = 3 * Math.sqrt(u37); u38 = -4 / (4 + u38); u50 = 3 * u50 - 2 * n + 3;
  }
  close(Array.from({ length: 11 }, (_, n) => 2 ** n / 3).reduce((a, b) => a + b, 0), 2047 / 3);
  close(Array.from({ length: 11 }, (_, n) => 3 ** -n).reduce((a, b) => a + b, 0), 88573 / 59049);
  for (const r of [6, -6]) close((17 - r) * 17 * (17 + r), 4301);
  for (const q of [2, .5]) { const t = Array.from({ length: 5 }, (_, k) => 5 * q ** (k - 2)); close(t[0] * t[4], 25); close(t[1] + t[2] + t[3], 17.5); }
});
test("les suites couplées ont la raison5/12 et la limite38/7, pas la moyenne5", () => {
  let u = 2, v = 8;
  for (let n = 0; n <= 20; n++) {
    close(sequenceValue(48, n), u); close(sequenceValue(48, n, 1), v);
    close(v - u, 6 * (5 / 12) ** n); close(3 * u + 4 * v, 38);
    const nextU = (2 * u + v) / 3, nextV = (u + 3 * v) / 4;
    close(nextU - u, (v - u) / 3); close(nextV - v, -(v - u) / 4);
    u = nextU; v = nextV;
  }
  close(sequenceValue(48, 60), 38 / 7); close(sequenceValue(48, 60, 1), 38 / 7);
});
test("positivité, transformations logarithmiques et modèle de sélection vérifiés", () => {
  let u = 1, sum = 0, mice = .5;
  for (let n = 0; n < 20; n++) {
    sum += u; const next = u * Math.exp(-u);
    assert.ok(next > 0 && next < u); close(next, Math.exp(-sum)); close(-Math.log(next), sum);
    u = next;
    close(mice, 1 - 2 / (n + 4)); close(1 / (mice - 1), -(n + 4) / 2);
    mice = (1 + mice) / (3 - mice);
    const value = sequenceValue(52, n); assert.ok(Math.abs(value - 3) <= 3 * (1 / 3) ** n + 1e-12);
  }
});
test("les trois situations utilisent cumuls, dates et coefficients exacts", () => {
  close(salaryTotal(9, true), 7937096.4829028435); close(salaryTotal(9, false), 7830000);
  for (let years = 1; years <= 9; years++) {
    for (const proportional of [true, false]) close(salaryTotal(years, proportional), Array.from({ length: years }, (_, n) => annualSalary(n, proportional)).reduce((a, b) => a + b, 0));
  }
  assert.ok(salaryTotal(9, true) > salaryTotal(9, false));
  assert.equal(cumulativeCases(10), 6611); assert.equal(cumulativeCases(12), 9373); assert.equal(cumulativeCases(13), 10934);
  for (let n = 0; n <= 15; n++) assert.equal(cumulativeCases(n), Array.from({ length: n + 1 }, (_, t) => 120 * t + 1).reduce((a, b) => a + b, 0));
  close(100 * (inflationFactor - 1), 74.14461763186404); assert.ok(inflationFactor > 1.6);
  assert.match(find(53).statementMarkdown, /deuxième année/); assert.match(find(54).correctionMarkdown, /jour \$13\$/);
  assert.match(find(55).correctionMarkdown, /3\+2\+1\+1\+1=8/);
});
test("identités d’induction, variations et limite factorielle sont numériquement cohérentes", () => {
  for (let n = 1; n <= 15; n++) {
    close(Array.from({ length: n }, (_, k) => (k + 1) ** 2).reduce((a, b) => a + b, 0), n * (n + 1) * (2 * n + 1) / 6);
    close(Array.from({ length: n }, (_, k) => (k + 1) ** 3).reduce((a, b) => a + b, 0), n ** 2 * (n + 1) ** 2 / 4);
    close(Array.from({ length: n }, (_, k) => (k + 1) * (k + 2)).reduce((a, b) => a + b, 0), n * (n + 1) * (n + 2) / 3);
    const a = (n + 2) / (2 * n + 1), b = (n + 3) / (2 * n + 3); close(b - a, -3 / ((2 * n + 3) * (2 * n + 1)));
    close((n + 2 + 2 / (n + 2)) - (n + 1 + 2 / (n + 1)), 1 - 2 / ((n + 1) * (n + 2)));
  }
  for (let n = 0; n <= 8; n++) assert.equal((3 ** (2 * n) - 1) % 8, 0);
  let factorialTerm = 2 ** 3 / 6;
  for (let n = 3; n < 20; n++) { assert.ok(2 / (n + 1) <= .5); assert.ok(factorialTerm <= (8 / 6) * .5 ** (n - 3) + 1e-15); factorialTerm *= 2 / (n + 1); }
});
test("notes locales et brouillons restent indépendants par exercice et par compte", () => {
  const exercise = find(15), first = exercise.questions![0];
  assert.equal(exerciseAnswerStatus(first, "1"), "correct"); assert.equal(exerciseAnswerStatus(first, "0"), "incorrect");
  const saved = restoreExerciseDraft(JSON.stringify({ answers: { [first.id]: "1", unknown: "20" }, submitted: true }), exercise);
  assert.equal(saved.answers[first.id], "1"); assert.equal(saved.answers.unknown, undefined);
  assert.notEqual(exerciseDraftKey("student-a", bank.id, exercise.id), exerciseDraftKey("student-b", bank.id, exercise.id));
  assert.notEqual(exerciseDraftKey("student-a", bank.id, exercise.id), exerciseDraftKey("student-a", bank.id, find(16).id));
});
test("la banque est chargée seulement pour la Terminale C et la bonne matière", async () => {
  assert.deepEqual(await loadExerciseCollection("terminale-c", "mathematics", bank.lessonKey), bank);
  assert.equal(await loadExerciseCollection("terminale-d", "mathematics", bank.lessonKey), null);
  assert.equal(await loadExerciseCollection("terminale-c", "physics-chemistry", bank.lessonKey), null);
});
