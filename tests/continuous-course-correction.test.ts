import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import type { LessonQuestion } from "../apps/web/src/domain/paths";
import {
  calculateCourseCorrection,
  getCourseQuestionCorrection,
  normalizeCourseAnswer,
} from "../apps/web/src/features/lesson/courseCorrection";

const projectRoot = resolve(import.meta.dirname, "..");

const choiceQuestion: LessonQuestion = {
  prompt: "Quelle proposition est juste ?",
  options: ["La première", "La deuxième", "La troisième"],
  correctIndex: 1,
  explanation: "La deuxième proposition applique la règle.",
  points: 3,
};

const shortQuestion: LessonQuestion = {
  type: "short-answer",
  prompt: "Donne la limite.",
  options: [],
  correctIndex: 0,
  acceptedAnswers: ["+∞", "+infini"],
  explanation: "Le terme dominant est positif.",
  points: 1,
};

test("la correction distingue réponse juste, fausse et absente", () => {
  assert.deepEqual(getCourseQuestionCorrection(choiceQuestion, 1), {
    status: "correct",
    answerLabel: "B — La deuxième",
    expectedAnswerLabel: "B — La deuxième",
    earnedPoints: 3,
    totalPoints: 3,
  });

  const incorrect = getCourseQuestionCorrection(choiceQuestion, 0);
  assert.equal(incorrect.status, "incorrect");
  assert.equal(incorrect.answerLabel, "A — La première");
  assert.equal(incorrect.expectedAnswerLabel, "B — La deuxième");
  assert.equal(incorrect.earnedPoints, 0);

  const unanswered = getCourseQuestionCorrection(shortQuestion, "   ");
  assert.equal(unanswered.status, "unanswered");
  assert.equal(unanswered.answerLabel, null);
  assert.equal(unanswered.expectedAnswerLabel, "+∞");
});

test("les écritures scolaires équivalentes restent acceptées", () => {
  assert.equal(normalizeCourseAnswer(" +∞ "), normalizeCourseAnswer("+infini"));
  assert.equal(getCourseQuestionCorrection(shortQuestion, "+infini").status, "correct");
});

test("le bilan pondéré fournit un pourcentage et une note sur 20", () => {
  const summary = calculateCourseCorrection([choiceQuestion, shortQuestion], [1, ""]);
  assert.deepEqual(summary, {
    correctAnswers: 1,
    totalQuestions: 2,
    earnedPoints: 3,
    totalPoints: 4,
    percentage: 75,
    scoreOutOf20: 15,
  });
});

test("le rendu documente les quatre états demandés sans divulguer avant validation", () => {
  const screen = readFileSync(
    resolve(projectRoot, "apps/web/src/features/lesson/ContinuousCourseScreen.tsx"),
    "utf8",
  );
  const css = readFileSync(resolve(projectRoot, "apps/web/src/styles/course-reader.css"), "utf8");

  assert.match(screen, /Bonne réponse/);
  assert.match(screen, /Réponse incorrecte/);
  assert.match(screen, /Pas de réponse/);
  assert.match(screen, /Solution attendue/);
  assert.match(screen, /scoreOutOf20/);
  assert.match(screen, /type="submit">Valider mes réponses/);
  assert.match(css, /is-student-wrong del/);
  assert.match(css, /is-expected-answer/);
  assert.match(css, /course-reader-score/);
});
