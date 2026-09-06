import type { LessonQuestion } from "../../domain/paths";

export type CourseQuickAnswer = number | string | null;
export type CourseAnswerStatus = "correct" | "incorrect" | "unanswered";

export interface CourseQuestionCorrection {
  status: CourseAnswerStatus;
  answerLabel: string | null;
  expectedAnswerLabel: string;
  earnedPoints: number;
  totalPoints: number;
}

export interface CourseCorrectionSummary {
  correctAnswers: number;
  totalQuestions: number;
  earnedPoints: number;
  totalPoints: number;
  percentage: number;
  scoreOutOf20: number;
}

export function normalizeCourseAnswer(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[−–—]/g, "-")
    .replace(/∞/g, "infini")
    .replace(/[×·*]/g, "")
    .replace(/÷/g, "/")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/√/g, "sqrt")
    .replace(/π/g, "pi")
    .replace(/\+inf(?:inity|ini)?/g, "+infini")
    .replace(/-inf(?:inity|ini)?/g, "-infini")
    .replace(/\s+/g, "")
    .replace(/[{}$]/g, "");
}

function questionPoints(question: LessonQuestion) {
  const points = question.points ?? 1;
  return Number.isFinite(points) && points > 0 ? points : 1;
}

export function getCourseAnswerLabel(question: LessonQuestion, answer: CourseQuickAnswer) {
  if (question.type === "short-answer") {
    return typeof answer === "string" && answer.trim() ? answer.trim() : null;
  }
  if (typeof answer !== "number" || !question.options[answer]) return null;
  return `${String.fromCharCode(65 + answer)} — ${question.options[answer]}`;
}

export function getCourseExpectedAnswerLabel(question: LessonQuestion) {
  if (question.type === "short-answer") {
    return question.acceptedAnswers?.[0] ?? "Voir l’explication";
  }
  const label = question.options[question.correctIndex] ?? "Voir l’explication";
  return `${String.fromCharCode(65 + question.correctIndex)} — ${label}`;
}

export function isCourseAnswerCorrect(question: LessonQuestion, answer: CourseQuickAnswer) {
  if (question.type !== "short-answer") {
    return typeof answer === "number" && answer === question.correctIndex;
  }
  if (typeof answer !== "string" || !answer.trim()) return false;
  const normalized = normalizeCourseAnswer(answer);
  return (question.acceptedAnswers ?? []).some(
    (accepted) => normalizeCourseAnswer(accepted) === normalized,
  );
}

export function getCourseQuestionCorrection(
  question: LessonQuestion,
  answer: CourseQuickAnswer,
): CourseQuestionCorrection {
  const totalPoints = questionPoints(question);
  const answerLabel = getCourseAnswerLabel(question, answer);
  const status: CourseAnswerStatus = answerLabel === null
    ? "unanswered"
    : isCourseAnswerCorrect(question, answer)
      ? "correct"
      : "incorrect";

  return {
    status,
    answerLabel,
    expectedAnswerLabel: getCourseExpectedAnswerLabel(question),
    earnedPoints: status === "correct" ? totalPoints : 0,
    totalPoints,
  };
}

export function calculateCourseCorrection(
  questions: LessonQuestion[],
  answers: CourseQuickAnswer[],
): CourseCorrectionSummary {
  const corrections = questions.map((question, index) => (
    getCourseQuestionCorrection(question, answers[index] ?? null)
  ));
  const totalPoints = corrections.reduce((total, correction) => total + correction.totalPoints, 0);
  const earnedPoints = corrections.reduce((total, correction) => total + correction.earnedPoints, 0);
  const ratio = totalPoints > 0 ? earnedPoints / totalPoints : 0;

  return {
    correctAnswers: corrections.filter((correction) => correction.status === "correct").length,
    totalQuestions: questions.length,
    earnedPoints,
    totalPoints,
    percentage: Math.round(ratio * 100),
    scoreOutOf20: Math.round(ratio * 200) / 10,
  };
}

export function formatCourseScore(value: number) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(value);
}
