import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { arenaPayloadSchema } from "../apps/api/src/arenaExerciseSchema";
import { terminalCDerivativesDocument as course } from "../apps/web/src/data/courseDocuments/terminalCDerivativesDocument";
import { terminalCDerivativesExercises as collection } from "../apps/web/src/data/exerciseCollections/terminalCDerivativesExercises";
import { terminalCLimitsExercises } from "../apps/web/src/data/exerciseCollections/terminalCLimitsExercises";
import { loadExerciseCollection } from "../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import { derivativePlotModels } from "../apps/web/src/features/arena/exercises/derivativePlotModels";
import { exerciseAnswerStatus, exerciseAssessment, exerciseDraftKey, restoreExerciseDraft } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { exerciseLibrarySections } from "../apps/web/src/features/arena/exercises/exerciseLibraryModel";

const exercises = collection.sections.flatMap(section => section.exercises);
const questions = exercises.flatMap(exercise => exercise.questions ?? []);
const find = (number: number) => exercises.find(exercise => exercise.sourceNumber === number)!;
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const katex = require("katex");
const close = (actual: number, expected: number, tolerance = 1e-6) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≠ ${expected}`);

test("Pyramide leçon 2 : 49 exercices consécutifs, 9 rubriques de fixation et trois catégories", () => {
  assert.equal(collection.lessonKey, "terminale-c-math-l04-derivatives-functions");
  assert.deepEqual(exercises.map(exercise => exercise.sourceNumber), Array.from({ length: 49 }, (_, i) => i + 1));
  assert.deepEqual(["fixation", "deepening", "complex"].map(category => collection.sections.filter(section => section.category === category).flatMap(section => section.exercises).length), [25, 22, 2]);
  assert.deepEqual(collection.sections.slice(0, 9).map(section => section.exercises.length), [3, 2, 2, 2, 3, 3, 3, 3, 4]);
  assert.equal(questions.length, 203);
  assert.equal(questions.filter(question => question.answer.kind !== "written").length, 63);
  assert.equal(questions.filter(question => question.answer.kind === "written").length, 140);
  assert.equal(new Set(questions.map(question => question.id)).size, 203);
  assert.equal(new Set(exercises.map(exercise => exercise.id)).size, 49);
  assert.ok(exercises.every(exercise => /^tc-l2-ex-\d+$/.test(exercise.id)));
  assert.deepEqual(collection.source.pages, [66, 67, 68, 69, 70, 71, 72, 73, 74]);
  assert.equal(collection.source.sha256, "893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4");
  assert.equal(find(8).sourcePage, 66);
  assert.equal(find(23).sourcePage, 68);
  const topics = new Set(course.sections.flatMap(section => section.topics).map(topic => topic.id));
  for (const section of collection.sections) assert.ok(topics.has(section.courseTopicId), section.id);
});

test("chaque rubrique est éditable et toutes les figures survivent au contrat JSON Web/API", () => {
  for (const [index, section] of collection.sections.entries()) {
    const parsed = arenaPayloadSchema.parse({
      levelId: collection.levelId, subjectId: collection.subjectId, lessonKey: collection.lessonKey,
      lessonTitle: "Dérivabilité et étude de fonctions", difficulty: "easy", category: section.category,
      sourceSectionId: section.id, courseTopicId: section.courseTopicId, stageNumber: index + 1,
      title: section.title, instructionsMarkdown: "", exercises: section.exercises,
    });
    assert.deepEqual(parsed.exercises, section.exercises);
    assert.ok(section.exercises.length <= 30);
  }
  assert.equal(arenaPayloadSchema.safeParse({ levelId: "terminale-c", subjectId: "mathematics", lessonKey: collection.lessonKey, lessonTitle: "Dérivabilité", difficulty: "easy", category: "fixation", stageNumber: 1, title: "Test", instructionsMarkdown: "", exercises: [{ ...find(16), figureKey: "arbitrary-code" }] }).success, false);
});

test("toutes les formules des énoncés et des corrigés passent KaTeX strict", () => {
  let count = 0;
  const visit = (value: unknown) => {
    if (typeof value === "string") {
      for (const match of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)) {
        const tex = match[1] ?? match[2];
        assert.doesNotMatch(tex, /(?<!\\)\binfty\b/);
        katex.renderToString(tex, { throwOnError: true, strict: "error", trust: false, displayMode: match[1] !== undefined });
        count++;
      }
    } else if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object") Object.values(value).forEach(visit);
  };
  visit(collection);
  assert.ok(count > 1000, `${count} formules`);
});

test("chaque réponse objective accepte ses variantes, les 140 rédactions ne sont jamais notées", () => {
  for (const exercise of exercises) {
    const answers: Record<string, string> = {};
    for (const question of exercise.questions ?? []) {
      assert.ok(question.explanation.length > 35, `${exercise.id} / ${question.label}`);
      assert.ok(exercise.correctionMarkdown.includes(question.prompt));
      assert.ok(exercise.correctionMarkdown.includes(question.explanation));
      if (question.answer.kind === "written") {
        assert.equal(question.points, 0);
        assert.equal(exerciseAnswerStatus(question, "raisonnement non vérifié"), "written");
      } else {
        const variants = question.answer.kind === "short" ? question.answer.accepted : [String(question.answer.correctIndex)];
        for (const variant of variants) assert.equal(exerciseAnswerStatus(question, variant), "correct", `${exercise.id} : ${variant}`);
        assert.equal(exerciseAnswerStatus(question, ""), "unanswered");
        assert.equal(exerciseAnswerStatus(question, "faux résultat"), "incorrect");
        answers[question.id] = variants[0];
      }
    }
    const result = exerciseAssessment(exercise, answers);
    assert.equal(result.outOf20, result.total ? 20 : null, exercise.id);
    assert.equal(result.percentage, result.total ? 100 : null);
    if (exercise.questions?.some(question => question.answer.kind === "written")) assert.equal(exercise.reviewCriteria?.length, 3);
  }
});

test("les calculs de raccord et d’inverse sont exacts", () => {
  const check = (number: number, i: number, value: string) => assert.equal(exerciseAnswerStatus(find(number).questions![i], value), "correct", `${number}.${i} ${value}`);
  check(2, 0, "3"); check(2, 1, "5"); check(3, 0, "3"); check(3, 1, "3");
  check(5, 0, "0"); check(5, 1, "1,5"); check(7, 0, "+infini");
  check(17, 0, "1"); check(17, 1, "0");
  check(20, 0, "2/√3"); check(20, 0, "2×√3÷3"); check(21, 0, "0,4"); check(21, 1, "27/25");
  check(27, 0, "0"); check(27, 1, "-3"); check(28, 0, "-1");
  check(29, 0, "7"); check(29, 1, "8");
  check(45, 9, "2√2/3"); check(46, 1, "1");
  assert.match(find(19).correctionMarkdown, /g'\(1\)=0/);
  assert.match(find(33).correctionMarkdown, /Aucun des deux nombres dérivés/);
  for (const wrong of ["4*2", "4×2", "4·2", "4 ** 2", "4*2*1"]) assert.equal(exerciseAnswerStatus(find(49).questions![2], wrong), "incorrect", wrong);
  for (const correct of ["6×7", "84÷2", "42", "40+2"]) assert.equal(exerciseAnswerStatus(find(49).questions![2], correct), "correct", correct);
});

test("les hypothèses corrigées du support sont conservées sans bandeau de coquille", () => {
  assert.match(find(6).statementMarkdown, /continue/);
  assert.match(find(7).statementMarkdown, /\[1;\+\\infty\[/);
  assert.match(find(10).statementMarkdown, /suppose \$u>0\$/);
  assert.match(find(14).statementMarkdown, /\\frac13\\le f'\(x\)\\le\\frac12/);
  assert.match(find(14).correctionMarkdown, /\\frac a3\\le f\(a\)\\le\\frac a2/);
  assert.match(find(36).statementMarkdown, /racine cubique réelle/);
  assert.match(find(44).statementMarkdown, /\\mathbb R\\setminus\\\{-1\\\}/);
  for (const exercise of exercises) assert.doesNotMatch(exercise.statementMarkdown, /coquille|document imprime|source erronée|Excellence rétablit/i);
});

test("les encadrements et optimisations numériques sont vérifiés indépendamment", () => {
  const lower = 10 * Math.sqrt(10) + 1 / 64, upper = 10 * Math.sqrt(10) + 1 / 62;
  assert.ok(lower <= Math.sqrt(1001) && Math.sqrt(1001) <= upper);
  for (const x of [0, .05, .2, .5]) {
    assert.ok(1 + x / Math.sqrt(6) <= Math.sqrt(1 + x) + 1e-12);
    assert.ok(Math.sqrt(1 + x) <= 1 + x / 2 + 1e-12);
  }
  const length = (theta: number) => 6 + (10 - 5 * Math.sin(theta)) / Math.cos(theta);
  const optimum = Math.PI / 6;
  assert.ok(optimum < Math.atan(6 / 5));
  close(length(optimum), 6 + 5 * Math.sqrt(3));
  for (let theta = .01; theta < Math.atan(6 / 5); theta += .01) assert.ok(length(theta) >= length(optimum) - 1e-10);
  assert.equal(exerciseAnswerStatus(find(48).questions![2], "π/6"), "correct");
  for (let x = 0; x <= 60; x++) assert.ok(84 * x - x * x <= 1764);
  assert.equal(exerciseAnswerStatus(find(49).questions![2], "42"), "correct");
  assert.match(find(49).correctionMarkdown, /ne peut pas représenter telle quelle un coût réel/);
  assert.match(find(48).statementMarkdown, /arctan\(6\/5\)/);
});

test("les constructions ont un tracé corrigé, jamais une courbe-réponse visible dans l’énoncé", () => {
  const graphs = exercises.filter(exercise => exercise.correctionFigureKey);
  assert.deepEqual(graphs.map(exercise => exercise.sourceNumber), [27, 28, 29, 30, 31, 32, 34, 37, 38, 39, 41, 42, 43, 44, 45, 46, 47]);
  assert.deepEqual(exercises.filter(exercise => exercise.figureKey).map(exercise => exercise.sourceNumber), [16, 40, 48]);
  for (const exercise of graphs) {
    assert.equal(exercise.figureKey, undefined);
    assert.ok(derivativePlotModels[exercise.sourceNumber!]);
  }
  const player = source("apps/web/src/features/arena/exercises/ExercisePlayer.tsx");
  assert.ok(player.indexOf("exercise.correctionFigureKey") > player.indexOf("{correctionVisible &&"));
  const submit = player.slice(player.indexOf("<form onSubmit"), player.indexOf('<div className="practice-question-list"'));
  assert.doesNotMatch(submit, /setCorrectionVisible|correctionFigureKey/);
  assert.doesNotMatch(player, /progress\/attempt|xpAwarded|submitAttempt/);
});

test("les points remarquables des 17 courbes sont sur les fonctions et les domaines excluent les pôles", () => {
  for (const number of [46, 47]) assert.equal(derivativePlotModels[number].orthonormal, true, `la symétrie de la réciproque exige un repère orthonormal : ${number}`);
  for (const [number, model] of Object.entries(derivativePlotModels)) {
    assert.ok(model.bounds[0] < model.bounds[1] && model.bounds[2] < model.bounds[3]);
    for (const point of model.points ?? []) {
      const onCurve = model.series.some(series => series.ranges.some(([a, b]) => point.x >= a - 1e-9 && point.x <= b + 1e-9) && Math.abs(series.fn(point.x) - point.y) < 1e-8);
      assert.ok(onCurve, `exercice ${number} : ${point.label}`);
    }
    for (const series of model.series) for (const [a, b] of series.ranges) {
      assert.ok(a < b);
      for (let i = 0; i <= 100; i++) assert.ok(Number.isFinite(series.fn(a + (b - a) * i / 100)), `${number} / ${i}`);
    }
  }
  for (const [number, pole] of [[28, -.5], [29, 1], [30, 0], [30, 2], [31, 2], [32, 2], [39, 2], [44, -1]]) {
    for (const series of derivativePlotModels[number].series) for (const [a, b] of series.ranges) assert.ok(!(a <= pole && pole <= b), `${number} pôle ${pole}`);
  }
  const derivative = (n: number, x: number) => { const f = derivativePlotModels[n].series[0].fn; return (f(x + 1e-5) - f(x - 1e-5)) / 2e-5; };
  close(derivative(27, 0), -3); close(derivative(28, 0), -5); close(derivative(34, 1), 6);
  close(derivative(37, -2), -20 / 49); close(derivative(39, 1), -3); close(derivative(43, 0), 1, 2e-5);
});

test("les figures géométriques restent manipulables et les formules ne se transforment pas en SVG de graphique", () => {
  const figures = source("apps/web/src/features/arena/exercises/DerivativeExerciseFigures.tsx");
  assert.equal((figures.match(/type="range"/g) ?? []).length, 2);
  assert.match(figures, /min="2" max="49"/);
  assert.match(figures, /min="3" max="47"/);
  const css = source("apps/web/src/styles/exercise-bank.css");
  assert.doesNotMatch(css, /\.practice-native-figure svg\s*\{/);
  assert.match(css, /\.practice-native-figure > svg/);
  assert.match(css, /\.practice-figure-canvas \{[^}]*overflow-x: auto/);
  assert.match(css, /\.practice-player \{[^}]*font-size: 1rem/);
});

test("les listes déroulantes contenant des formules basculent en vrais choix rendus par KaTeX", () => {
  const player = source("apps/web/src/features/arena/exercises/ExercisePlayer.tsx");
  assert.match(player, /const nativeSelect =/);
  assert.match(player, /options\.every/);
  assert.match(player, /\? nativeSelect/);
  assert.ok(find(10).questions!.every(question => question.answer.kind === "choice" && question.answer.options.every(option => option.includes("$"))));
});

test("les brouillons, les publications et les deux leçons restent cloisonnés", async () => {
  assert.deepEqual(await loadExerciseCollection("terminale-c", "mathematics", collection.lessonKey), collection);
  assert.equal(await loadExerciseCollection("terminale-d", "mathematics", collection.lessonKey), null);
  assert.equal(await loadExerciseCollection("terminale-a", "mathematics", collection.lessonKey), null);
  assert.equal(await loadExerciseCollection("terminale-c", "physics-chemistry", collection.lessonKey), null);
  assert.deepEqual(await loadExerciseCollection("terminale-c", "mathematics", terminalCLimitsExercises.lessonKey), terminalCLimitsExercises);
  assert.equal(terminalCLimitsExercises.sections.flatMap(section => section.exercises).length, 62);
  const section = collection.sections[0];
  const published = { id: "published-derivatives-test", version: 2, publishedAt: "2026-10-18T12:00:00Z", levelId: collection.levelId, subjectId: collection.subjectId, lessonKey: collection.lessonKey, lessonTitle: "Dérivabilité", difficulty: "easy" as const, stageNumber: 1, title: "Révision", instructionsMarkdown: "", exercises: section.exercises };
  assert.equal(exerciseLibrarySections(collection, [published])[0].title, section.title);
  assert.equal(exerciseLibrarySections(collection, [{ ...published, category: "fixation", sourceSectionId: section.id }])[0].title, "Révision");
  const key = exerciseDraftKey("learner-a", `${collection.id}-v1`, find(2).id);
  assert.notEqual(key, exerciseDraftKey("learner-b", `${collection.id}-v1`, find(2).id));
  assert.notEqual(key, exerciseDraftKey("learner-a", `${terminalCLimitsExercises.id}-v1`, find(2).id));
  const restored = restoreExerciseDraft(JSON.stringify({ answers: { [find(2).questions![0].id]: "3", other: "bad" }, score: 20, submitted: true }), find(2));
  assert.deepEqual(restored.answers, { [find(2).questions![0].id]: "3" });
  assert.equal("score" in restored, false);
});
