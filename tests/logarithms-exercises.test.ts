import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { arenaPayloadSchema } from "../apps/api/src/arenaExerciseSchema";
import { terminalCLogarithmsDocument as course } from "../apps/web/src/data/courseDocuments/terminalCLogarithmsDocument";
import { terminalCLogarithmsExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCLogarithmsExercises";
import { loadExerciseCollection } from "../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import { exerciseAnswerStatus, exerciseAssessment, exerciseDraftKey, restoreExerciseDraft } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { festivalLevel, logAuxiliaryG, logFamily, logIterationH, logarithmFunctions as fn, logarithmPlotModels } from "../apps/web/src/features/arena/exercises/logarithmPlotModels";

const exercises = bank.sections.flatMap(section => section.exercises), questions = exercises.flatMap(exercise => exercise.questions ?? []);
const find = (number: number) => exercises.find(exercise => exercise.sourceNumber === number)!;
const require = createRequire(new URL("../apps/web/package.json", import.meta.url)), katex = require("katex");
const close = (actual: number, expected: number, tolerance = 1e-7) => assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${actual} ≠ ${expected}`);
const derivative = (f: (x: number) => number, x: number, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);
function root(f: (x: number) => number, a: number, b: number) { for (let i = 0; i < 100; i++) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; } return (a + b) / 2; }

test("42 exercices fidèles dans 7 rubriques, 201 questions dont 126 rédactions", () => {
  assert.equal(bank.lessonKey, "terminale-c-math-l08-logarithms");
  assert.deepEqual(exercises.map(exercise => exercise.sourceNumber), Array.from({ length: 42 }, (_, i) => i + 1));
  assert.deepEqual(["fixation", "deepening", "complex"].map(category => bank.sections.filter(section => section.category === category).flatMap(section => section.exercises).length), [17, 22, 3]);
  assert.equal(bank.sections.filter(section => section.category === "fixation").length, 7);
  assert.equal(questions.length, 201); assert.equal(questions.filter(question => question.answer.kind !== "written").length, 75);
  assert.equal(questions.filter(question => question.answer.kind === "written").length, 126);
  assert.equal(new Set(questions.map(question => question.id)).size, 201);
  assert.equal(new Set(exercises.map(exercise => exercise.id)).size, 42);
  assert.deepEqual(bank.source.pages, [104, 105, 106, 107, 108, 109, 110]);
  assert.equal(find(10).sourcePage, 104); assert.equal(find(11).sourcePage, 105); assert.equal(find(39).sourcePage, 109); assert.equal(find(40).sourcePage, 110);
  for (const section of bank.sections) assert.ok(course.sections.flatMap(section => section.topics).some(topic => topic.id === section.courseTopicId));
});

test("rubriques et dix figures de correction restent sérialisables dans le contrat API", () => {
  for (const [index, section] of bank.sections.entries()) {
    const parsed = arenaPayloadSchema.parse({ levelId: bank.levelId, subjectId: bank.subjectId, lessonKey: bank.lessonKey, lessonTitle: "Fonctions logarithmes", difficulty: "easy", category: section.category, sourceSectionId: section.id, courseTopicId: section.courseTopicId, stageNumber: index + 1, title: section.title, instructionsMarkdown: "", exercises: section.exercises });
    assert.deepEqual(parsed.exercises, section.exercises);
  }
  assert.deepEqual(exercises.filter(exercise => exercise.correctionFigureKey).map(exercise => exercise.sourceNumber), [28, 29, 31, 34, 35, 36, 37, 38, 39, 40]);
  assert.ok(exercises.every(exercise => !exercise.figureKey));
});

test("formules KaTeX strictes et réponses objectives testées sans jamais noter une preuve", () => {
  let formulas = 0;
  const visit = (value: unknown) => {
    if (typeof value === "string") for (const match of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)) { katex.renderToString(match[1] ?? match[2], { throwOnError: true, strict: "error", trust: false, displayMode: Boolean(match[1]) }); formulas++; }
    else if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object") Object.values(value).forEach(visit);
  };
  visit(bank); assert.ok(formulas > 2000);
  for (const exercise of exercises) {
    const answers: Record<string, string> = {};
    for (const question of exercise.questions ?? []) {
      assert.ok(question.explanation.length > 35, `${exercise.id}/${question.label}`);
      assert.ok(exercise.correctionMarkdown.includes(question.prompt)); assert.ok(exercise.correctionMarkdown.includes(question.explanation));
      if (question.answer.kind === "written") { assert.equal(question.points, 0); assert.equal(exerciseAnswerStatus(question, "preuve à relire"), "written"); }
      else {
        const values = question.answer.kind === "short" ? question.answer.accepted : [String(question.answer.correctIndex)];
        for (const value of values) assert.equal(exerciseAnswerStatus(question, value), "correct", `${exercise.id}/${value}`);
        assert.equal(exerciseAnswerStatus(question, ""), "unanswered"); assert.equal(exerciseAnswerStatus(question, "aucune valeur"), "incorrect"); answers[question.id] = values[0];
      }
    }
    const score = exerciseAssessment(exercise, answers); assert.equal(score.outOf20, score.total ? 20 : null);
  }
});

test("domaines et solutions des équations ne sont jamais perdus après simplification", () => {
  assert.match(find(5).questions![1].answer.kind === "choice" ? find(5).questions![1].answer.options[1] : "", /-2;2/);
  assert.match(find(6).correctionMarkdown, /n’ajoute pas les nombres négatifs/);
  assert.match(find(21).correctionMarkdown, /\[2;\+\\infty\[/);
  assert.match(find(22).correctionMarkdown, /pas la positivité séparée/);
  assert.match(find(23).questions![3].prompt, /\\ln\|x\+1\|/);
  assert.match(find(26).statementMarkdown, /F\(x_0\)=y_0/);
  assert.match(find(29).questions![0].prompt, /t\\ne0/);
  const { source, ...visible } = bank;
  assert.ok(source.editorialNotes.some(note => note.includes("Rolle")));
  assert.doesNotMatch(JSON.stringify(visible), /coquille|Excellence rétablit|le document imprime/i);
  close(Math.log(5 / 2 + 1) - Math.log(5 / 2 - 1), Math.log(7 / 3));
  const x = (-3 + Math.sqrt(65)) / 2; assert.ok(x > 2); close(Math.log(x + 5) + Math.log(x - 2), Math.log(4));
  for (const x of [-3 - Math.sqrt(19), -3 + Math.sqrt(19)]) close(Math.log(Math.abs(x + 1)) + Math.log(Math.abs(x + 5)), Math.log(15));
});

test("primitives et dérivées : 17 vérifications indépendantes à plusieurs points", () => {
  const pairs: Array<[(x: number) => number, (x: number) => number, number[]]> = [
    [x => Math.log(2 * x - 4), x => 1 / (x - 2), [2.2, 3, 4]],
    [x => Math.log(x * x), x => 2 / x, [-3, -.5, .5, 3]],
    [x => Math.log(x * x - 2 * x + 4), x => (2 * x - 2) / (x * x - 2 * x + 4), [-1, .5, 2]],
    [x => Math.log((Math.log(2 * x)) / x), x => (1 - Math.log(2 * x)) / (x * Math.log(2 * x)), [.7, 1, 3]],
    [x => 2 / Math.sqrt(x) - Math.log(Math.sqrt(x)), x => -1 / (x * Math.sqrt(x)) - 1 / (2 * x), [.3, 1, 3]],
    [x => (1 - x) * Math.log(1 - x), x => -Math.log(1 - x) - 1, [-1, 0, .5]],
    [x => x * x + (2 + Math.log(x)) / x, x => 2 * x - (1 + Math.log(x)) / (x * x), [.3, 1, 3]],
    [x => Math.log(x) ** 2 / x, x => Math.log(x) * (2 - Math.log(x)) / (x * x), [.3, 1, 3]],
    [x => Math.log(1 - x ** 3) / 3, x => x * x / (x ** 3 - 1), [-1, .2, .7]],
    [x => Math.log(-3 * x - 1) / 3 + 5 * Math.log(2 - x), x => 1 / (3 * x + 1) + 5 / (x - 2), [-3, -2, -1.5]],
    [x => -2.5 * Math.log(2 * x - 3) + 3, x => 5 / (3 - 2 * x), [1.8, 2, 4]],
    [x => Math.log(Math.log(x)) + Math.log(2), x => 1 / (x * Math.log(x)), [1.5, 2, 4]],
    [x => Math.log(x) ** 2 / 2 + 1, x => Math.log(x) / x, [.3, 1, 3]],
    [x => -x - 2 / 3 * Math.log(3 * x - 1) + 5 * Math.log(x - 1) + 2 + 4 / 3 * Math.log(5), x => (-3 * x * x + 17 * x - 4) / (3 * x * x - 4 * x + 1), [1.5, 2, 4]],
    [logAuxiliaryG, Math.log, [.3, 1, 3]],
    [fn[31], x => x * (Math.log(x) - 1), [.3, 1, 3]],
    [fn[38], x => -2 - 15 / ((x + 1) * (x - 4)), [4.5, 5, 6]],
  ];
  for (const [F, f, points] of pairs) for (const x of points) close(derivative(F, x), f(x), 3e-6);
  close(-2.5 * Math.log(2 * 2 - 3) + 3, 3);
  close(Math.log(Math.log(Math.E ** 2)) + Math.log(2), 2 * Math.log(2));
  close(Math.log(Math.E) ** 2 / 2 + 1, 1.5);
});

test("raccords en 0 et 1 et inégalités de logarithme corrigées sont démontrables", () => {
  close(fn[28](0), 0); close(fn[28](1), -1); close(derivative(fn[28], 1), -.5, 1e-5);
  assert.ok(fn[28](1e-8) / 1e-8 < -15);
  for (const t of [-3, -.3, .3, 3]) close(fn[29](1 + t) + fn[29](1 - t), -2);
  close(derivative(fn[35], -1 - 1e-3, 1e-6), -1 / 1.001, 1e-5);
  close(derivative(fn[35], -1 + 1e-3, 1e-6), .002, 1e-5);
  for (const x of [.001, .1, .5, 1, 3, 10]) {
    assert.ok(Math.log1p(x) >= x - x * x / 2 - 1e-13);
    assert.ok(Math.log1p(x) <= x - x * x / 2 + x ** 3 / 3 + 1e-13);
    const q = (Math.log1p(x) - x) / (x * x);
    assert.ok(q >= -.5 - 1e-10 && q <= -.5 + x / 3 + 1e-10);
  }
  close((fn[37](1e-6) - 1) / 1e-6, -.5, 1e-6);
  assert.match(find(37).questions![2].prompt, /\\ge/);
  assert.match(find(37).questions![3].prompt, /-1\/2\+x\/3/);
});

test("contraction : racine, 38 itérations et majoration sont indépendamment vérifiées", () => {
  const alpha = root(x => fn[34](x) - .5, 3.5, 3.6); close(alpha, 3.5128624172523386);
  close(logIterationH(alpha), alpha);
  for (let x = 3; x <= 4; x += .01) { assert.ok(logIterationH(x) >= 3 && logIterationH(x) <= 4); assert.ok(1 / x + .5 <= 5 / 6 + 1e-12); }
  let u = 3;
  for (let n = 0; n <= 38; n++) { assert.ok(Math.abs(u - alpha) <= (5 / 6) ** n); u = logIterationH(u); }
  assert.ok((5 / 6) ** 37 > .001); assert.ok((5 / 6) ** 38 <= .001);
  assert.ok(Math.abs(3.513 - alpha) < .001);
});

test("aire, tangente et famille paramétrée respectent leurs identités", () => {
  close(derivative(fn[38], 5), -4.5, 1e-6);
  const x0 = root(fn[38], 5, 5.5); assert.ok(x0 > 5.08 && x0 < 5.09);
  const area = 3 * (7 * Math.log(7) - 2 * Math.log(2) - 6 * Math.log(6));
  let numerical = 0; const h = 1 / 10000;
  for (let i = 0; i < 10000; i++) { const x = 5 + (i + .5) * h; numerical += (fn[38](x) - (-2 * x + 5)) * h; }
  close(numerical, area); close(area, 4.453559600696913);
  for (let n = 1; n <= 7; n++) {
    const a = Math.exp((n - 2) / (2 * n)); close(logFamily(a, n), n / 2 * Math.exp(2 / n - 1));
    close(logFamily(1, n), 1);
    for (const x of [.3, .8, 1, 2, 3]) {
      close(logFamily(x, n + 1) - logFamily(x, n), Math.log(x) / (x * x));
      close(derivative(t => logFamily(t, n), x), (n - 2 - 2 * n * Math.log(x)) / x ** 3, 3e-6);
    }
  }
});

test("situations complexes : premier franchissement annuel et propagation sonore", () => {
  assert.ok(500000 * 1.06 ** 15 < 1250000 && 500000 * 1.06 ** 16 >= 1250000);
  assert.ok(10000 * .92 ** 19 >= 2000 && 10000 * .92 ** 20 < 2000);
  assert.equal(2019 + 20, 2039);
  assert.ok(.92 ** 16 >= .25 && .92 ** 17 < .25); assert.equal(2020 + 17, 2037);
  close(festivalLevel(10), 110); close(festivalLevel(500), 76.02059991327963);
  close(festivalLevel(500) + 10 * Math.log10(.25), 70);
  assert.match(find(41).correctionMarkdown, /2039/); assert.match(find(42).correctionMarkdown, /2037/);
  for (const [number, index, value] of [[30, 0, "16"], [34, 15, "38"], [38, 5, "5"], [41, 1, "20"], [42, 1, "17"]] as const) assert.equal(exerciseAnswerStatus(find(number).questions![index], value), "correct", String(number));
});

test("tracés natifs : domaines coupés aux pôles et unités identiques du repère orthonormal", () => {
  for (const [key, model] of Object.entries(logarithmPlotModels)) {
    assert.equal(model.orthonormal, true);
    for (const series of model.series) for (const [a, b] of series.ranges) for (let i = 0; i <= 100; i++) assert.ok(Number.isFinite(series.fn(a + (b - a) * i / 100)), `${key} / ${i}`);
  }
  assert.ok(Number.isNaN(fn[29](1))); assert.ok(Number.isNaN(fn[36](0))); assert.ok(Number.isNaN(fn[38](4)));
  close(fn[31](Math.E), -(Math.E ** 2) / 4);
  close(fn[36](1 / Math.E), 0); close(fn[36](1), 1);
});

test("chargement limité à C, brouillons indépendants et aucune note stockée crue", async () => {
  assert.deepEqual(await loadExerciseCollection("terminale-c", "mathematics", bank.lessonKey), bank);
  assert.equal(await loadExerciseCollection("terminale-d", "mathematics", bank.lessonKey), null);
  assert.equal(await loadExerciseCollection("terminale-c", "english", bank.lessonKey), null);
  assert.notEqual(exerciseDraftKey("a", bank.id, find(1).id), exerciseDraftKey("b", bank.id, find(1).id));
  assert.notEqual(exerciseDraftKey("a", bank.id, find(1).id), exerciseDraftKey("a", bank.id, find(2).id));
  const q = find(19).questions![0];
  const draft = restoreExerciseDraft(JSON.stringify({ answers: { [q.id]: "-1", invalid: "1" }, reasoning: "mon brouillon", submitted: true, score: 100 }), find(19));
  assert.deepEqual(Object.keys(draft.answers), [q.id]); assert.equal(draft.reasoning, "mon brouillon");
});
