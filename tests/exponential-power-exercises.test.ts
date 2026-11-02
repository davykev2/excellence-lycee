import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { arenaPayloadSchema } from "../apps/api/src/arenaExerciseSchema";
import { terminalCExponentialPowerExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCExponentialPowerExercises";
import { terminalCExponentialPowerDocument as course } from "../apps/web/src/data/courseDocuments/terminalCExponentialPowerDocument";
import { loadExerciseCollection } from "../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import { exerciseAnswerStatus, exerciseAssessment, exerciseDraftKey, restoreExerciseDraft } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { boutiques, coolingElapsed, coolingRate, coolingTemperature, exponentialPlotModels, expIteration, expIterationValue, expStudyF, expStudyG, expStudyH, expTwoStudyF, expTwoStudyG, expTwoStudyPrimitive } from "../apps/web/src/features/arena/exercises/exponentialPlotModels";

const exercises = bank.sections.flatMap(s => s.exercises), questions = exercises.flatMap(e => e.questions ?? []);
const find = (n: number) => exercises.find(e => e.sourceNumber === n)!;
const require = createRequire(new URL("../apps/web/package.json", import.meta.url)), katex = require("katex");
const close = (a: number, b: number, tolerance = 1e-7) => assert.ok(Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(b)), `${a} ≠ ${b}`);
const derivative = (f: (x: number) => number, x: number, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);
function root(f: (x: number) => number, a: number, b: number) { for (let i = 0; i < 80; i++) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; } return (a + b) / 2; }
test("41 exercices, cinq rubriques et 239 sous-questions réparties sans trou", () => {
  assert.deepEqual(exercises.map(e => e.sourceNumber), Array.from({ length: 41 }, (_, i) => i + 1));
  assert.deepEqual(["fixation", "deepening", "complex"].map(c => bank.sections.filter(s => s.category === c).flatMap(s => s.exercises).length), [13, 26, 2]);
  assert.equal(bank.sections.filter(s => s.category === "fixation").length, 5);
  assert.equal(questions.length, 239); assert.equal(questions.filter(q => q.answer.kind !== "written").length, 62);
  assert.equal(questions.filter(q => q.answer.kind === "written").length, 177);
  assert.equal(new Set(questions.map(q => q.id)).size, 239); assert.equal(new Set(exercises.map(e => e.id)).size, 41);
  assert.deepEqual(bank.source.pages, [129, 130, 131, 132, 133, 134]);
  for (const section of bank.sections) assert.ok(course.sections.flatMap(s => s.topics).some(t => t.id === section.courseTopicId));
  assert.equal(find(13).sourcePage, 129); assert.equal(find(14).sourcePage, 130); assert.equal(find(40).sourcePage, 134);
});
test("le contrat API conserve les quatorze figures uniquement dans les corrections", () => {
  for (const [index, section] of bank.sections.entries()) {
    const payload = { levelId: bank.levelId, subjectId: bank.subjectId, lessonKey: bank.lessonKey, lessonTitle: "Exponentielles et puissances", difficulty: "easy", category: section.category, stageNumber: index + 1, title: section.title, instructionsMarkdown: "", sourceSectionId: section.id, courseTopicId: section.courseTopicId, exercises: section.exercises };
    assert.deepEqual(arenaPayloadSchema.parse(payload).exercises, section.exercises);
  }
  assert.deepEqual(exercises.filter(e => e.correctionFigureKey).map(e => e.sourceNumber), [15, 19, 24, 25, 26, 27, 28, 33, 36, 37, 38, 39, 40, 41]);
  assert.ok(exercises.every(e => !e.figureKey));
});
test("KaTeX strict, réponses acceptées et zéro point automatique pour les rédactions", () => {
  let formulas = 0;
  const visit = (value: unknown) => { if (typeof value === "string") { for (const m of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)) { katex.renderToString(m[1] ?? m[2], { throwOnError: true, strict: "error", trust: false, displayMode: Boolean(m[1]) }); formulas++; } } else if (Array.isArray(value)) value.forEach(visit); else if (value && typeof value === "object") Object.values(value).forEach(visit); };
  visit(bank); assert.ok(formulas > 1500);
  for (const exercise of exercises) {
    const answers: Record<string, string> = {};
    for (const question of exercise.questions ?? []) {
      assert.ok(question.explanation.length > 20, exercise.id + "/" + question.label);
      assert.ok(exercise.correctionMarkdown.includes(question.explanation));
      if (question.answer.kind === "written") { assert.equal(question.points, 0); assert.equal(exerciseAnswerStatus(question, "ma preuve"), "written"); }
      else { const values = question.answer.kind === "short" ? question.answer.accepted : [String(question.answer.correctIndex)]; for (const value of values) assert.equal(exerciseAnswerStatus(question, value), "correct", `${exercise.id}/${value}`); answers[question.id] = values[0]; assert.equal(exerciseAnswerStatus(question, ""), "unanswered"); }
    }
    const result = exerciseAssessment(exercise, answers); assert.equal(result.outOf20, result.total ? 20 : null);
  }
});
test("domaines, racines cubiques et options d’origine sont protégés", () => {
  assert.match(find(2).questions![8].explanation, /x>2/);
  assert.match(find(16).questions![5].explanation, /x>-3/);
  assert.match(find(20).questions![1].explanation, /pas de dérivée finie/);
  assert.match(find(22).questions![1].explanation, /différentes sur les deux intervalles/);
  assert.match(find(23).questions![7].prompt, /x\\to\+\\infty/);
  const options = find(32).questions!.map(q => q.answer.kind === "choice" ? q.answer.options.length : 0); assert.deepEqual(options, [4, 4, 4, 4]);
  assert.deepEqual(find(32).questions!.map(q => q.answer.kind === "choice" ? q.answer.correctIndex : -1), [1, 2, 0, 1]);
  const { source, ...visible } = bank; assert.ok(source.editorialNotes.some(note => note.includes("H imprimée")));
  assert.doesNotMatch(JSON.stringify(visible), /coquille|Excellence rétablit|affichée dans l’énoncé ne convient pas/i);
});
test("dérivées et primitives indépendamment vérifiées sur plusieurs points", () => {
  const pairs: Array<[(x: number) => number, (x: number) => number, number[]]> = [
    [x => (2 * x + 1) * Math.exp(-x), x => (1 - 2 * x) * Math.exp(-x), [-1, .3, 2]],
    [x => (Math.exp(2 * x) - 2) / (1 - Math.exp(2 * x)), x => -2 * Math.exp(2 * x) / (1 - Math.exp(2 * x)) ** 2, [-1, .3, 2]],
    [expStudyF, x => expStudyG(x) / (1 + x * Math.exp(x)) ** 2, [-2, .3, 2]],
    [x => Math.exp(3 * x * x + 1) / 3, x => 2 * x * Math.exp(3 * x * x + 1), [-.7, .1, .5]],
    [x => .5 * Math.log(2 * x + Math.exp(-2 * x)), x => (1 - Math.exp(-2 * x)) / (2 * x + Math.exp(-2 * x)), [.2, 1, 3]],
    [x => Math.exp(x) - 4 * Math.log(Math.exp(x) + 3) - 1 + 4 * Math.log(4), x => Math.exp(x) * (Math.exp(x) - 1) / (Math.exp(x) + 3), [-1, .1, 2]],
    [x => 5 ** x / Math.log(5) + x * x, x => 5 ** x + 2 * x, [-1, .3, 2]],
    [x => 1.5 ** x / (2 * Math.log(1.5)), x => 3 ** x / 2 ** (x + 1), [-1, .3, 2]],
    [x => -2 / 7 * x ** (-3.5), x => Math.sqrt(x) / x ** 5, [.5, 1, 2]],
    [x => -1.5 * Math.cbrt(1 - x) ** 2, x => 1 / Math.cbrt(1 - x), [-2, .2, 2, 3]],
    [x => (x * x - 1) ** 3.5 / 7, x => x * Math.sqrt((x * x - 1) ** 5), [-2, -1.5, 1.5, 2]],
    [x => -2 / (3 * Math.sqrt(x ** 3 - 1)), x => x * x / Math.sqrt((x ** 3 - 1) ** 3), [1.5, 2, 3]],
    [x => -2 / Math.sqrt(x), x => 1 / (x * Math.sqrt(x)), [.3, 1, 3]],
    [x => (2 * x + 4) * Math.exp(-x / 2) - x, x => -expStudyH(x) * Math.exp(-x / 2), [-2, -.5, 2]],
    [expTwoStudyF, x => 2 * x * Math.exp(x) * (Math.exp(x) - 2), [-2, -.5, .5, 1]],
    [expTwoStudyPrimitive, expTwoStudyF, [-2, 0, .5, 1]],
    [expTwoStudyG, x => 2 * Math.log(x) * (x - 2), [.1, .5, 1, 3]],
    [x => 3 * Math.log(Math.exp(x) + 1) - 3 * Math.log(2), x => 3 * Math.exp(x) / (Math.exp(x) + 1), [-2, 0, 2]],
    [x => x * x + Math.log1p(-Math.exp(x)) - Math.log1p(-1 / Math.E), x => 2 * x + 1 + 1 / Math.expm1(x), [-3, -1, -.3]],
  ];
  for (const [F, f, points] of pairs) for (const x of points) close(derivative(F, x), f(x), 3e-6);
  close(expTwoStudyPrimitive(0), -1);
  close((-1) ** 2 + Math.log1p(-Math.exp(-1)) - Math.log1p(-1 / Math.E), 1);
});
test("racines et extrema des exercices 25 à 27 ne reposent pas sur des arrondis prématurés", () => {
  const a = root(expStudyG, .7, .71); close(a, .7034674224983917); close(expStudyF(a), a * a / (a + 1));
  assert.ok(expStudyF(a) > .29 && expStudyF(a) < .30);
  for (let x = -10; x <= 10; x += .1) assert.ok(1 + x * Math.exp(x) >= 1 - 1 / Math.E - 1e-12);
  const b = root(expStudyH, -.71, -.7); close(b, -a); const fb = (2 * b + 4) * Math.exp(-b / 2) - b;
  close(fb, -2 - b - 4 / b); assert.ok(fb > 4.3 && fb < 4.4);
  const r = root(expTwoStudyF, -1.7, -1.6); close(r, -1.6121769451183363); close(expTwoStudyG(Math.exp(r)), 0);
  for (const x of [.01, .2, 1, 2, 3]) close(expTwoStudyG(x), expTwoStudyF(Math.log(x)));
  close(expTwoStudyG(0), -2); assert.ok((expTwoStudyG(1e-10) + 2) / 1e-10 > 80);
});
test("équations exactes et systèmes : racines positives substituées dans les énoncés", () => {
  for (const x of [-7, -3, 1, 2]) close(x ** 4 + 7 * x ** 3 - 7 * x * x - 43 * x + 42, 0);
  for (const x of [0, Math.log(2)]) close(Math.exp(4 * x) + 7 * Math.exp(3 * x) - 7 * Math.exp(2 * x) - 43 * Math.exp(x) + 42, 0);
  for (const x of [-2, -1]) close(2 ** (2 * x + 3) - 3 * 2 ** (x + 1) + 1, 0);
  const y = (1 + Math.sqrt(1 + 308 * Math.E ** 3)) / 22, x = 7 * Math.E / (y * y);
  close(x * y * y / Math.E, 7); close(Math.E ** 2 * x + 1 / y, 11);
  const a = 3 - Math.sqrt(26) / 2, b = 3 + Math.sqrt(26) / 2; close(2 * a * b, 5); close(a + b, 6);
  for (const t of [Math.log(3 + Math.sqrt(10)) / Math.log(5), Math.log((Math.sqrt(5) - 1) / 2) / Math.log(2 / 3)]) assert.ok(Number.isFinite(t));
});
test("contraction de l’exercice 39 : invariant, constante, rang garanti et signe de l’exposant", () => {
  const alpha = root(x => expIteration(x) - x, -1, 0); close(alpha, -.5569290855221476);
  close(alpha * alpha * Math.exp(-alpha), 4 / Math.E ** 2);
  for (let x = -1; x <= 0; x += .01) { assert.ok(expIteration(x) >= -1 && expIteration(x) <= 0); assert.ok(Math.exp(x / 2) / Math.E <= 1 / Math.E); }
  for (let n = 0; n <= 14; n++) assert.ok(Math.abs(expIterationValue(n) - alpha) <= Math.exp(-n) / 2);
  assert.ok(Math.exp(-13) / 2 > 1e-6); assert.ok(Math.exp(-14) / 2 <= 1e-6);
  assert.equal(exerciseAnswerStatus(find(39).questions!.at(-1)!, "14"), "correct");
});
test("situations complexes : première année entière et conversion correcte des heures", () => {
  close(3936000000 / (164000 * 300), 80); assert.ok(boutiques(13) < 80 && boutiques(14) >= 80);
  const x = root(x => boutiques(x) - 80, 0, 20); close(x, 13.55402340144736);
  assert.equal(2010 + Math.ceil(x), 2024);
  close(coolingTemperature(0), 37); close(coolingTemperature(coolingElapsed), 32); close(coolingTemperature(coolingElapsed + .5), 31);
  close(coolingRate, .17402275397925937); close(coolingElapsed, 2.0015008744760365);
  close((10 - coolingElapsed) * 3600, 7 * 3600 + 59 * 60 + 54.59685188627);
  assert.equal(exerciseAnswerStatus(find(40).questions![2], "2024"), "correct");
});
test("tracés natifs : domaines coupés, points finis et échelle orthonormale des études", () => {
  for (const [number, model] of Object.entries(exponentialPlotModels)) {
    assert.equal(model.orthonormal, true);
    for (const series of model.series) for (const [a, b] of series.ranges) for (let i = 0; i <= 100; i++) assert.ok(Number.isFinite(series.fn(a + (b - a) * i / 100)), number);
    for (const point of model.points ?? []) assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y));
  }
});
test("chargement C seulement, notes recalculées et brouillons indépendants", async () => {
  assert.deepEqual(await loadExerciseCollection("terminale-c", "mathematics", bank.lessonKey), bank);
  assert.equal(await loadExerciseCollection("terminale-d", "mathematics", bank.lessonKey), null);
  assert.equal(await loadExerciseCollection("terminale-c", "physics", bank.lessonKey), null);
  assert.notEqual(exerciseDraftKey("a", bank.id, find(1).id), exerciseDraftKey("b", bank.id, find(1).id));
  const q = find(1).questions![0]; const draft = restoreExerciseDraft(JSON.stringify({ answers: { [q.id]: "0", invalid: "20" }, reasoning: "mon brouillon", submitted: true, score: 100 }), find(1));
  assert.deepEqual(Object.keys(draft.answers), [q.id]); assert.equal(draft.reasoning, "mon brouillon");
});
