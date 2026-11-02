import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { arenaPayloadSchema } from "../apps/api/src/arenaExerciseSchema";
import { terminalCPrimitivesDocument as course } from "../apps/web/src/data/courseDocuments/terminalCPrimitivesDocument";
import { terminalCPrimitivesExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCPrimitivesExercises";
import { loadExerciseCollection } from "../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import { exerciseAnswerStatus, exerciseAssessment, exerciseDraftKey, restoreExerciseDraft } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { population, populationDerivative, populationDisplayRange, populationThreshold } from "../apps/web/src/features/arena/exercises/primitivePopulationModel";

const exercises = bank.sections.flatMap(section => section.exercises);
const questions = exercises.flatMap(exercise => exercise.questions ?? []);
const find = (number: number) => exercises.find(exercise => exercise.sourceNumber === number)!;
const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const katex = require("katex");
const close = (actual: number, expected: number, tolerance = 1e-6) => assert.ok(Math.abs(actual - expected) < tolerance * Math.max(1, Math.abs(expected)), `${actual} ≠ ${expected}`);

test("38 exercices du support, six rubriques de fixation, 127 sous-questions séparées", () => {
  assert.equal(bank.lessonKey, "terminale-c-math-l06-primitives");
  assert.deepEqual(exercises.map(item => item.sourceNumber), Array.from({ length: 38 }, (_, i) => i + 1));
  assert.deepEqual(["fixation", "deepening", "complex"].map(category => bank.sections.filter(section => section.category === category).flatMap(section => section.exercises).length), [12, 25, 1]);
  assert.equal(bank.sections.filter(section => section.category === "fixation").length, 6);
  assert.equal(questions.length, 127);
  assert.equal(questions.filter(question => question.answer.kind !== "written").length, 30);
  assert.equal(questions.filter(question => question.answer.kind === "written").length, 97);
  assert.equal(new Set(questions.map(question => question.id)).size, 127);
  assert.equal(new Set(exercises.map(exercise => exercise.id)).size, 38);
  assert.deepEqual(bank.source.pages, [86, 87, 88]);
  assert.equal(find(13).sourcePage, 86);
  assert.equal(find(14).sourcePage, 87);
  assert.equal(find(28).sourcePage, 88);
  assert.ok(bank.sections.every(section => course.sections.flatMap(section => section.topics).some(topic => topic.id === section.courseTopicId)));
});

test("les huit rubriques, dont 25 approfondissements et la figure, passent le contrat API", () => {
  for (const [index, section] of bank.sections.entries()) {
    const parsed = arenaPayloadSchema.parse({
      levelId: bank.levelId, subjectId: bank.subjectId, lessonKey: bank.lessonKey, lessonTitle: "Primitives",
      difficulty: "easy", category: section.category, sourceSectionId: section.id, courseTopicId: section.courseTopicId,
      stageNumber: index + 1, title: section.title, instructionsMarkdown: "", exercises: section.exercises,
    });
    assert.deepEqual(parsed.exercises, section.exercises);
  }
  assert.equal(find(38).figureKey, undefined);
  assert.equal(find(38).correctionFigureKey, "tc-l3-population");
});

test("toutes les formules passent KaTeX strict, sans commande perdue", () => {
  let count = 0;
  const visit = (value: unknown) => {
    if (typeof value === "string") for (const match of value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)) {
      const tex = match[1] ?? match[2];
      assert.doesNotMatch(tex, /(?<!\\)\binfty\b/);
      katex.renderToString(tex, { throwOnError: true, strict: "error", trust: false, displayMode: Boolean(match[1]) }); count++;
    }
    else if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object") Object.values(value).forEach(visit);
  };
  visit(bank); assert.ok(count > 1500, String(count));
});

test("les 97 rédactions ne sont jamais notées et chaque correction reste complète", () => {
  for (const exercise of exercises) {
    const answers: Record<string, string> = {};
    for (const question of exercise.questions ?? []) {
      assert.ok(question.explanation.length > 35, `${exercise.id}/${question.label}`);
      assert.ok(exercise.correctionMarkdown.includes(question.prompt));
      assert.ok(exercise.correctionMarkdown.includes(question.explanation));
      if (question.answer.kind === "written") {
        assert.equal(question.points, 0);
        assert.equal(exerciseAnswerStatus(question, "démonstration quelconque"), "written");
      } else {
        const variants = question.answer.kind === "short" ? question.answer.accepted : [String(question.answer.correctIndex)];
        for (const variant of variants) assert.equal(exerciseAnswerStatus(question, variant), "correct");
        assert.equal(exerciseAnswerStatus(question, ""), "unanswered");
        assert.equal(exerciseAnswerStatus(question, "faux résultat"), "incorrect");
        answers[question.id] = variants[0];
      }
    }
    const score = exerciseAssessment(exercise, answers);
    assert.equal(score.outOf20, score.total ? 20 : null);
    if (exercise.questions?.some(question => question.answer.kind === "written")) assert.equal(exercise.reviewCriteria?.length, 3);
  }
});

test("domaines, pôle interne, unicité et preuve de non-existence sont explicites", () => {
  assert.match(find(4).correctionMarkdown, /C_-/);
  assert.match(find(4).correctionMarkdown, /C_\+/);
  assert.match(find(4).correctionMarkdown, /extrémité/);
  assert.match(find(11).statementMarkdown, /5\/2/);
  assert.match(find(13).questions![2].prompt, /cette même condition/);
  assert.match(find(22).correctionMarkdown, /Raisonnons par l’absurde/);
  assert.match(find(22).correctionMarkdown, /F'_g\(1\)=0/);
  assert.match(find(31).correctionMarkdown, /ne détermine pas une constante sur l’autre intervalle/);
  assert.match(find(19).correctionMarkdown, /16\}5/);
  assert.match(find(18).questions!.at(-1)!.prompt, /H\(2\)=0/);
  const { source, ...visible } = bank;
  assert.ok(source.editorialNotes.length >= 6);
  assert.doesNotMatch(JSON.stringify(visible), /coquille|Excellence rétablit|le document imprime/i);
});

test("primitives calculées : vérification indépendante par différences centrées", () => {
  const pairs: Array<[string, (x: number) => number, (x: number) => number, number[]]> = [
    ["9.2", x => 1 / (3 * x ** 4), x => -4 / (3 * x ** 5), [-2, -.7, .5, 2]],
    ["10.6", x => x ** 3 / 3 - x ** 2 / 2 - 2 * x, x => (x + 1) * (x - 2), [.4, 1, 3]],
    ["11.a", x => Math.cos(-3 * x), x => 3 * Math.sin(-3 * x), [.4, 1, 2]],
    ["11.b", x => 2 * Math.sqrt(2 * x + 1), x => 2 / Math.sqrt(2 * x + 1), [.4, 1, 2]],
    ["11.c", x => 1 / (2 * x - 5), x => -2 / (2 * x - 5) ** 2, [1, 2, 3, 4]],
    ["11.d", x => (x * x + 7) ** 3 / 3, x => 2 * x * (x * x + 7) ** 2, [.4, 1, 2]],
    ["12.a", x => (x * x - x + 6) ** 4 / 4, x => (2 * x - 1) * (x * x - x + 6) ** 3, [.4, 1, 2]],
    ["12.b", x => -1 / (2 * (x * x + 3 * x + 2) ** 2), x => (2 * x + 3) / (x * x + 3 * x + 2) ** 3, [.4, 1, 2]],
    ["12.d", x => -(Math.cos(x) ** 3) / 3, x => Math.sin(x) * Math.cos(x) ** 2, [.4, 1, 2]],
    ["14.4", x => .75 * x ** (4 / 3), x => Math.cbrt(x), [.4, 1, 2]],
    ["15.3", x => 5 * Math.sqrt(2 * x - 1), x => 5 / Math.sqrt(2 * x - 1), [.8, 1, 2]],
    ["15.4", x => Math.sin(x * x - 1), x => 2 * x * Math.cos(x * x - 1), [-1, .4, 1]],
    ["15.5", x => 2 / 3 * (x * x - x + 5) ** 1.5, x => (2 * x - 1) * Math.sqrt(x * x - x + 5), [-1, .4, 1]],
    ["18", x => x * x - 3 * x - 2 / (x - 1) + 4, x => (2 * x ** 3 - 7 * x * x + 8 * x - 1) / (x - 1) ** 2, [1.5, 2, 3]],
    ["19", x => 2 / 5 * (x * x - x - 6) * Math.sqrt(3 - x) + 16 / 5, x => x * Math.sqrt(3 - x), [-2, -.5, 1, 2.5]],
    ["20", x => -Math.cos(x) + Math.cos(x) ** 3 / 3, x => Math.sin(x) ** 3, [.4, 1, 2]],
    ["21", x => Math.sin(x) ** 7 / 7 - Math.sin(x) ** 9 / 9, x => Math.cos(x) ** 3 * Math.sin(x) ** 6, [.4, 1, 2]],
    ["24.a", x => x ** 4 / 4 + x ** 3 / 3 + 3 * x - 43 / 12, x => (x ** 5 + x ** 4 + 3 * x * x) / (x * x), [.4, 1, 2]],
    ["24.b", x => 2 / 5 * x ** 5 + 4 / 3 * x ** 3, x => 2 * x * (x ** 3 + 2 * x), [-1, .4, 1]],
    ["24.c", x => -1 / Math.sin(x) + 1 + Math.SQRT2, x => Math.cos(x) / Math.sin(x) ** 2, [.4, .8, 1.2]],
    ["25.f", x => 3 * x / 8 + Math.sin(4 * x) / 32 + Math.sin(2 * x) / 4, x => Math.cos(x) ** 4, [.4, 1, 2]],
    ["25.g", x => 3 * x / 8 + Math.sin(4 * x) / 32 - Math.sin(2 * x) / 4, x => Math.sin(x) ** 4, [.4, 1, 2]],
    ["25.h", x => x / 4 - Math.sin(4 * x) / 16, x => 2 * Math.cos(x) ** 2 * Math.sin(x) ** 2, [.4, 1, 2]],
    ["26.1", x => (3 * x + 1) ** 5 / 5, x => 3 * (3 * x + 1) ** 4, [-1, .4, 1]],
    ["26.2", x => (2 * x + 7) ** 7 / 14, x => (2 * x + 7) ** 6, [-1, .4, 1]],
    ["26.3", x => (3 * x * x - 2 * x + 3) ** 6 / 6, x => (6 * x - 2) * (3 * x * x - 2 * x + 3) ** 5, [-1, .4, 1]],
    ["27.2", x => 2 / (3 * (4 - 3 * x)), x => 2 / (4 - 3 * x) ** 2, [-1, .4, 1, 2]],
    ["27.3", x => -1 / (x * x - 5 * x + 6) ** 2, x => (4 * x - 10) / (x * x - 5 * x + 6) ** 3, [1, 2.4, 4]],
    ["28.2", x => -2 / 7 * Math.sqrt(2 - 7 * x), x => 1 / Math.sqrt(2 - 7 * x), [-1, -.4, 0]],
    ["28.3", x => 2 * Math.sqrt(x * x + x + 1), x => (2 * x + 1) / Math.sqrt(x * x + x + 1), [-1, .4, 1]],
    ["28.4", x => 2 * Math.sqrt(2 + Math.sin(x)), x => Math.cos(x) / Math.sqrt(2 + Math.sin(x)), [-1, .4, 1]],
    ["30", x => -3 / (x + 1) - 1 / (2 * (x + 1) ** 2), x => (3 * x + 4) / (x + 1) ** 3, [-.5, 1, 2]],
    ["31", x => x * x - 3 * x - 5 / (x + 2) + 11 / 2, x => (2 * x ** 3 + 5 * x * x - 4 * x - 7) / (x + 2) ** 2, [-1, .4, 1]],
    ["32", x => 3 * x - 1 / (x + 1) - 20 / 3, x => (3 * x * x + 6 * x + 4) / (x + 1) ** 2, [-.5, 1, 2]],
    ["34", x => 3 * x + 13 / (x + 2) - 10 / 3, x => (3 * x * x + 12 * x - 1) / (x + 2) ** 2, [-1, .4, 1]],
    ["36", x => x * x / 2 + 3 * x - 1 / (x + 1) + 8, x => (x ** 3 + 5 * x * x + 7 * x + 4) / (x + 1) ** 2, [-4, -3, -2]],
    ["37", x => -3 / (4 * (x - 1)) - 1 / (4 * (x + 1)) + 5 / 6, x => (x * x + x + 1) / (x * x - 1) ** 2, [1.5, 2, 3]],
  ];
  for (const [label, F, f, samples] of pairs) for (const x of samples) {
    const h = 1e-5;
    assert.ok(Number.isFinite(F(x)), label);
    close((F(x + h) - F(x - h)) / (2 * h), f(x), 2e-6);
  }
});

test("les constantes initiales et coefficients répondent aux valeurs sources", () => {
  close(1 - 2 + 7 - 3, 3);
  close(Math.sin(3 * Math.PI / 4) / 3 - Math.sin(Math.PI / 4) / 2 + Math.SQRT2 / 12, 0);
  close(4 - 6 - 2 + 4, 0);
  close(2 / 5 * (1 + 1 - 6) * 2 + 16 / 5, 0);
  close(-Math.cos(Math.PI) + Math.cos(Math.PI) ** 3 / 3, 2 / 3);
  close(1 / 4 + 1 / 3 + 3 - 43 / 12, 0);
  close(-1 / Math.sin(Math.PI / 4) + 1 + Math.SQRT2, 1);
  close(-5 / 2 + 11 / 2, 3);
  close(6 - 1 / 3 - 20 / 3, -1);
  close(3 + 13 / 3 - 10 / 3, 4);
  close(2 - 6 + 1 + 8, 5);
  close(-3 / 4 - 1 / 12 + 5 / 6, 0);
});

test("bactéricide : maximum exact en cinq heures, seuil dépassé et courbe physiquement valide", () => {
  assert.equal(population(0), 1000);
  close(population(5), 140500 / 3);
  close(populationDerivative(5), 0);
  assert.equal(populationThreshold, 46000);
  assert.ok(population(5) > populationThreshold);
  for (let t = .1; t < 5; t += .1) assert.ok(populationDerivative(t) > 0);
  for (let t = 5.1; t <= 8; t += .1) assert.ok(populationDerivative(t) < 0);
  for (let t = populationDisplayRange[0]; t <= populationDisplayRange[1]; t += .1) assert.ok(population(t) >= 0);
  const maxQuestion = find(38).questions![2];
  assert.equal(exerciseAnswerStatus(maxQuestion, "140500÷3"), "correct");
  assert.equal(exerciseAnswerStatus(maxQuestion, "46833"), "incorrect");
});

test("chargement limité à C et brouillons séparés entre exercices et utilisateurs", async () => {
  assert.deepEqual(await loadExerciseCollection("terminale-c", "mathematics", bank.lessonKey), bank);
  assert.equal(await loadExerciseCollection("terminale-d", "mathematics", bank.lessonKey), null);
  assert.equal(await loadExerciseCollection("terminale-c", "physics-chemistry", bank.lessonKey), null);
  assert.notEqual(exerciseDraftKey("a", bank.id, find(7).id), exerciseDraftKey("b", bank.id, find(7).id));
  assert.notEqual(exerciseDraftKey("a", bank.id, find(7).id), exerciseDraftKey("a", bank.id, find(8).id));
  const q = find(7).questions![0];
  const draft = restoreExerciseDraft(JSON.stringify({ answers: { [q.id]: "0", invalid: "1" }, reasoning: "ma preuve", submitted: true, score: 100 }), find(7));
  assert.equal(draft.reasoning, "ma preuve");
  assert.deepEqual(Object.keys(draft.answers), [q.id]);
});
