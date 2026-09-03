import type {
  HomeworkAnswerValue,
  HomeworkAnswers,
  HomeworkDefinition,
  HomeworkExercise,
  HomeworkFreeAnswer,
  HomeworkQuestion,
  HomeworkStoredAnswer,
  HomeworkSummary,
} from "../../../domain/homework";
import { homeworkQuestions, isHomeworkAnswerComplete } from "../../../domain/homework";

export interface HomeworkPointSplit {
  automatic: number;
  manual: number;
  total: number;
}

interface PendingHomeworkAnswer {
  fingerprint: string;
  updatedAt: string;
}

export interface HomeworkDraftSnapshot {
  answers: HomeworkAnswers;
  pending: Record<string, PendingHomeworkAnswer>;
  updatedAt: string;
}

interface StoredHomeworkDraft extends HomeworkDraftSnapshot {
  version: 2;
}

function answerFingerprint(answer: HomeworkStoredAnswer) {
  return JSON.stringify(answer);
}

export function isClosedHomeworkAttemptCode(code?: string) {
  return code === "HOMEWORK_TIME_EXPIRED" || code === "ATTEMPT_CLOSED";
}

export function canRetryHomework(homework: HomeworkSummary) {
  return homework.subjectPublished === true
    && homework.correctionsPublished !== true
    && !homework.activeAttemptId
    && homework.attemptsUsed < homework.maxAttempts;
}

export function nextHomeworkAttemptDurationSeconds(homework: HomeworkSummary) {
  const nextAttemptNumber = homework.attemptsUsed + 1;
  const factor = nextAttemptNumber === 1 ? 1 : nextAttemptNumber === 2 ? 0.66 : 0.33;
  return Math.max(60, Math.round(homework.durationSeconds * factor));
}

export function homeworkQuestionPointSplit(question: HomeworkQuestion): HomeworkPointSplit {
  if (question.isNeutralized) return { automatic: question.points, manual: 0, total: question.points };
  if (question.gradingMode === "auto") {
    return { automatic: question.autoPoints ?? question.points, manual: 0, total: question.points };
  }
  if (question.gradingMode === "manual") {
    return { automatic: 0, manual: question.manualPoints ?? question.points, total: question.points };
  }
  const automatic = question.autoPoints ?? 0;
  return { automatic, manual: question.manualPoints ?? Math.max(0, question.points - automatic), total: question.points };
}

export function homeworkExercisePoints(exercise: HomeworkExercise) {
  return exercise.points ?? exercise.questions.reduce((sum, question) => sum + question.points, 0);
}

export function emptyHomeworkAnswer(question: HomeworkQuestion): HomeworkStoredAnswer {
  const answer: HomeworkAnswerValue = question.gradingMode === "hybrid" || question.answerKind === "essay"
    ? { finalAnswer: "", reasoning: "" }
    : "";
  return { answer, attachmentUrls: [] };
}

export function freeHomeworkAnswer(value?: HomeworkStoredAnswer): HomeworkFreeAnswer {
  if (!value) return { finalAnswer: "", reasoning: "" };
  if (typeof value.answer === "string") return { finalAnswer: value.answer, reasoning: "" };
  return {
    finalAnswer: value.answer.finalAnswer ?? "",
    reasoning: value.answer.reasoning ?? "",
  };
}

export function mergeHomeworkAnswers(
  homework: HomeworkDefinition,
  serverAnswers: HomeworkAnswers,
  localAnswers: HomeworkAnswers,
  unsyncedQuestionIds: Iterable<string> = [],
) {
  const validIds = new Set(homeworkQuestions(homework).map((question) => question.id));
  const unsyncedIds = new Set(unsyncedQuestionIds);
  const merged: HomeworkAnswers = {};
  for (const [questionId, answer] of Object.entries(serverAnswers)) {
    if (validIds.has(questionId)) merged[questionId] = answer;
  }
  for (const [questionId, answer] of Object.entries(localAnswers)) {
    if (
      validIds.has(questionId)
      && (
        unsyncedIds.has(questionId)
        || (isHomeworkAnswerComplete(answer) && !isHomeworkAnswerComplete(merged[questionId]))
      )
    ) {
      merged[questionId] = answer;
    }
  }
  return merged;
}

export function sanitizeHomeworkAnswers(homework: HomeworkDefinition, answers: HomeworkAnswers) {
  const validIds = new Set(homeworkQuestions(homework).map((question) => question.id));
  return Object.fromEntries(Object.entries(answers).filter(([questionId]) => validIds.has(questionId)));
}

export function remainingHomeworkSeconds({
  expiresAt,
  serverNow,
  synchronizedAtMs,
  nowMs,
}: {
  expiresAt?: string;
  serverNow: string;
  synchronizedAtMs: number;
  nowMs: number;
}) {
  if (!expiresAt) return null;
  const expiryMs = Date.parse(expiresAt);
  const serverNowMs = Date.parse(serverNow);
  if (!Number.isFinite(expiryMs) || !Number.isFinite(serverNowMs)) return 0;
  const elapsedClientMs = Math.max(0, nowMs - synchronizedAtMs);
  return Math.max(0, Math.ceil((expiryMs - serverNowMs - elapsedClientMs) / 1000));
}

export function unansweredHomeworkQuestions(homework: HomeworkDefinition, answers: HomeworkAnswers) {
  return homeworkQuestions(homework).filter((question) => (
    !question.isNeutralized && !isHomeworkAnswerComplete(answers[question.id])
  ));
}

export function homeworkDraftKey(userId: string, attemptId: string) {
  return `excellence-homework-draft:${userId}:${attemptId}`;
}

function emptyHomeworkDraftSnapshot(): HomeworkDraftSnapshot {
  return { answers: {}, pending: {}, updatedAt: new Date(0).toISOString() };
}

export function readHomeworkDraftSnapshot(userId: string, attemptId: string): HomeworkDraftSnapshot {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(homeworkDraftKey(userId, attemptId)) ?? "{}") as StoredHomeworkDraft | HomeworkAnswers;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return emptyHomeworkDraftSnapshot();
    const stored = parsed as Partial<StoredHomeworkDraft>;
    if (stored.version === 2 && stored.answers && typeof stored.answers === "object") {
      return {
        answers: stored.answers,
        pending: stored.pending && typeof stored.pending === "object" ? stored.pending : {},
        updatedAt: typeof stored.updatedAt === "string" ? stored.updatedAt : new Date(0).toISOString(),
      };
    }

    // Les anciens brouillons ne savaient pas indiquer si la dernière requête PUT
    // avait abouti. On les traite donc prudemment comme non synchronisés : une
    // réponse locale complète ne doit jamais disparaître au premier F5.
    const answers = parsed as HomeworkAnswers;
    const now = new Date().toISOString();
    return {
      answers,
      pending: Object.fromEntries(Object.entries(answers).map(([questionId, answer]) => [
        questionId,
        { fingerprint: answerFingerprint(answer), updatedAt: now },
      ])),
      updatedAt: now,
    };
  } catch {
    return emptyHomeworkDraftSnapshot();
  }
}

export function writePendingHomeworkAnswer(
  userId: string,
  attemptId: string,
  answers: HomeworkAnswers,
  questionId: string,
  answer: HomeworkStoredAnswer,
) {
  const current = readHomeworkDraftSnapshot(userId, attemptId);
  const updatedAt = new Date().toISOString();
  const draft: StoredHomeworkDraft = {
    version: 2,
    answers,
    pending: {
      ...current.pending,
      [questionId]: { fingerprint: answerFingerprint(answer), updatedAt },
    },
    updatedAt,
  };
  window.localStorage.setItem(homeworkDraftKey(userId, attemptId), JSON.stringify(draft));
}

export function markHomeworkAnswerSynchronized(
  userId: string,
  attemptId: string,
  questionId: string,
  synchronizedAnswer: HomeworkStoredAnswer,
) {
  const current = readHomeworkDraftSnapshot(userId, attemptId);
  const marker = current.pending[questionId];
  // Une requête plus ancienne peut finir après une nouvelle frappe. Elle ne doit
  // pas marquer la réponse la plus récente comme synchronisée.
  if (!marker || marker.fingerprint !== answerFingerprint(synchronizedAnswer)) return;
  const pending = { ...current.pending };
  delete pending[questionId];
  const draft: StoredHomeworkDraft = {
    version: 2,
    answers: current.answers,
    pending,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(homeworkDraftKey(userId, attemptId), JSON.stringify(draft));
}

export function clearHomeworkDraft(userId: string, attemptId: string) {
  window.localStorage.removeItem(homeworkDraftKey(userId, attemptId));
}
