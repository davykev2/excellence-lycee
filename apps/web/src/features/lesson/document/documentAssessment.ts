import type { CourseDocument, CourseDocumentQuestion } from "../../../domain/courseDocument";
import { normalizeCourseAnswer, type CourseAnswerStatus } from "../courseCorrection";

export type DocumentAnswer = string | { lower: string; upper: string };
export interface DocumentDraft {
  answers: Record<string, DocumentAnswer>;
  written: Record<string, string>;
  submitted: boolean;
}
export const emptyDocumentDraft = (): DocumentDraft => ({ answers: {}, written: {}, submitted: false });

/** Strict numeric syntax only: no evaluation of user-supplied JavaScript. */
export function parseDocumentNumber(value: string): number | null {
  const text = value.trim().replace(/[−–]/g, "-").replace(/,/g, ".").replace(/\s/g, "");
  const decimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
  if (decimal.test(text)) {
    const number = Number(text);
    return Number.isFinite(number) ? number : null;
  }
  const fraction = text.split("/");
  if (fraction.length !== 2 || !fraction.every(part => decimal.test(part))) return null;
  const denominator = Number(fraction[1]);
  const number = Number(fraction[0]) / denominator;
  return denominator !== 0 && Number.isFinite(number) ? number : null;
}

export function documentAnswerStatus(question: CourseDocumentQuestion, answer?: DocumentAnswer): CourseAnswerStatus {
  if (question.answer.kind === "interval") {
    if (!answer || typeof answer === "string" || !answer.lower.trim() || !answer.upper.trim()) return "unanswered";
    const lower = parseDocumentNumber(answer.lower);
    const upper = parseDocumentNumber(answer.upper);
    return lower === question.answer.lower && upper === question.answer.upper ? "correct" : "incorrect";
  }
  if (typeof answer !== "string" || !answer.trim()) return "unanswered";
  const normalized = normalizeCourseAnswer(answer.replace(/\\infty/g, "∞"));
  const numeric = parseDocumentNumber(answer);
  return question.answer.accepted.some(expected =>
    normalizeCourseAnswer(expected) === normalized
    || (numeric !== null && parseDocumentNumber(expected) === numeric),
  ) ? "correct" : "incorrect";
}

export function documentAnswerLabel(question: CourseDocumentQuestion, answer?: DocumentAnswer) {
  if (typeof answer === "string") return answer.trim();
  if (!answer || question.answer.kind !== "interval") return "";
  return `${answer.lower.trim() || "…"} < ${question.answer.variable} < ${answer.upper.trim() || "…"}`;
}

export function documentAssessmentScore(questions: CourseDocumentQuestion[], answers: DocumentDraft["answers"]) {
  const possible = questions.reduce((sum, question) => sum + question.points, 0);
  const earned = questions.reduce((sum, question) => sum + (documentAnswerStatus(question, answers[question.id]) === "correct" ? question.points : 0), 0);
  return {
    earned, possible,
    correct: questions.filter(question => documentAnswerStatus(question, answers[question.id]) === "correct").length,
    total: questions.length,
    percentage: possible ? Math.round(100 * earned / possible) : 0,
    outOf20: possible ? Math.round(200 * earned / possible) / 10 : 0,
  };
}

export function documentDraftKey(userId: string, pathId: string, document: Pick<CourseDocument, "id" | "version">) {
  return `excellence-course-document:${encodeURIComponent(userId)}:${encodeURIComponent(pathId)}:${document.id}:v${document.version}`;
}

/** Whitelist known keys, bounded strings, and validate restored answer shapes. */
export function restoreDocumentDraft(raw: string | null, document: CourseDocument): DocumentDraft {
  const draft = emptyDocumentDraft();
  if (!raw) return draft;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return draft;
    for (const question of document.evaluations.flatMap(group => group.questions)) {
      const answer: unknown = parsed.answers?.[question.id];
      if (question.answer.kind === "short" && typeof answer === "string") draft.answers[question.id] = answer.slice(0, 500);
      else if (question.answer.kind === "interval" && answer && typeof answer === "object" && "lower" in answer && "upper" in answer && typeof answer.lower === "string" && typeof answer.upper === "string") {
        draft.answers[question.id] = { lower: answer.lower.slice(0, 80), upper: answer.upper.slice(0, 80) };
      }
    }
    for (const task of document.evaluations.flatMap(group => group.writtenTasks ?? [])) {
      const answer: unknown = parsed.written?.[task.id];
      if (typeof answer === "string") draft.written[task.id] = answer.slice(0, 10000);
    }
    draft.submitted = parsed.submitted === true;
  } catch { /* Un brouillon invalide ne doit jamais empêcher de lire le cours. */ }
  return draft;
}
