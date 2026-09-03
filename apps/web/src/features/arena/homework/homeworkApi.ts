import { useCallback, useEffect, useRef, useState } from "react";
import type {
  HomeworkAnswers,
  HomeworkAttempt,
  HomeworkDefinition,
  HomeworkFilters,
  HomeworkResult,
  HomeworkStoredAnswer,
  HomeworkSummary,
} from "../../../domain/homework";
import { homeworkAnsweredCount, homeworkQuestions, isHomeworkAnswerComplete } from "../../../domain/homework";
import { apiRequest, describeApiFailure } from "../../../lib/api";
import {
  clearHomeworkDraft,
  homeworkQuestionPointSplit,
  isClosedHomeworkAttemptCode,
  markHomeworkAnswerSynchronized,
  mergeHomeworkAnswers,
  readHomeworkDraftSnapshot,
  sanitizeHomeworkAnswers,
  type HomeworkDraftSnapshot,
  writePendingHomeworkAnswer,
} from "./homeworkModel";
import { HomeworkAnswerSaveQueue } from "./homeworkSaveQueue";

type HomeworkAnswerPersistor = (
  attempt: HomeworkAttempt,
  questionId: string,
  answer: HomeworkStoredAnswer,
) => Promise<void>;

export function requeuePendingHomeworkAnswers(
  currentAttempt: HomeworkAttempt,
  draft: HomeworkDraftSnapshot,
  persistAnswer: HomeworkAnswerPersistor,
) {
  const saves = Object.keys(draft.pending).flatMap((questionId) => {
    const answer = draft.answers[questionId];
    if (!answer || !Object.prototype.hasOwnProperty.call(currentAttempt.answers, questionId)) return [];
    // persistAnswer réutilise la file par tentative/question et ne retire le
    // marqueur pending que si son empreinte correspond encore à cette valeur.
    return [persistAnswer(currentAttempt, questionId, answer)];
  });
  return {
    count: saves.length,
    completion: Promise.allSettled(saves),
  };
}

async function loadPreviewHomeworkCatalog() {
  if (!import.meta.env.DEV) return [];
  const { homeworkPreviewCatalog } = await import("../../../data/homeworkCatalog");
  return [...homeworkPreviewCatalog];
}

async function loadPreviewHomework(reference: string) {
  if (!import.meta.env.DEV) return null;
  const { previewHomeworkByReference } = await import("../../../data/homeworkCatalog");
  return previewHomeworkByReference(reference) ?? null;
}

function queryString(filters: HomeworkFilters) {
  const search = new URLSearchParams();
  if (filters.subjectId) search.set("subjectId", filters.subjectId);
  if (filters.academicYear) search.set("academicYear", filters.academicYear);
  if (filters.institution) search.set("institution", filters.institution);
  if (filters.levelId) search.set("levelId", filters.levelId);
  const value = search.toString();
  return value ? `?${value}` : "";
}

function message(reason: unknown, fallback: string) {
  return describeApiFailure(reason, fallback).message;
}

function previewAttempt(homework: HomeworkDefinition): HomeworkAttempt {
  const startedAt = new Date();
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `preview-${startedAt.getTime()}`,
    homeworkId: homework.id,
    attemptNumber: 1,
    status: "in-progress",
    startedAt: startedAt.toISOString(),
    expiresAt: new Date(startedAt.getTime() + homework.durationSeconds * 1000).toISOString(),
    serverNow: startedAt.toISOString(),
    answers: {},
    answeredCount: 0,
    questionCount: homework.questionCount,
  };
}

export function useHomeworkLibrary({
  filters,
  localOnly = false,
}: {
  filters: HomeworkFilters;
  localOnly?: boolean;
}) {
  const [items, setItems] = useState<HomeworkSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((current) => current + 1), []);

  useEffect(() => {
    if (localOnly) {
      let active = true;
      setLoading(true);
      setError(null);
      void loadPreviewHomeworkCatalog().then((catalog) => {
        if (!active) return;
        setItems(catalog.filter((homework) => (
          (!filters.levelId || homework.level.id === filters.levelId)
          && (!filters.subjectId || homework.subject.id === filters.subjectId)
          && (!filters.academicYear || homework.academicYear === filters.academicYear)
          && (!filters.institution || homework.institution.toLocaleLowerCase("fr").includes(filters.institution.toLocaleLowerCase("fr")))
        )));
      }).catch((reason) => {
        if (active) setError(message(reason, "L’aperçu local des devoirs n’a pas pu être chargé."));
      }).finally(() => {
        if (active) setLoading(false);
      });
      return () => { active = false; };
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    void apiRequest<{ items: HomeworkSummary[] }>(`/homeworks${queryString(filters)}`, {
      signal: controller.signal,
    }).then((response) => setItems(response.items)).catch((reason) => {
      if (!controller.signal.aborted) setError(message(reason, "Les devoirs n’ont pas pu être chargés."));
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [filters.academicYear, filters.institution, filters.levelId, filters.subjectId, localOnly, revision]);

  return { items, loading, error, reload };
}

export function useHomeworkAttempt({
  homeworkRef,
  userId,
  localOnly = false,
}: {
  homeworkRef: string;
  userId: string;
  localOnly?: boolean;
}) {
  const [homework, setHomework] = useState<HomeworkDefinition | null>(null);
  const [loadedHomeworkRef, setLoadedHomeworkRef] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<HomeworkAttempt | null>(null);
  const [result, setResult] = useState<HomeworkResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [resuming, setResuming] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);
  const [resultError, setResultError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savingCount, setSavingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const attemptRef = useRef<HomeworkAttempt | null>(null);
  const homeworkRefState = useRef<HomeworkDefinition | null>(homework);
  const saveTimers = useRef(new Map<string, number>());
  const saveQueue = useRef(new HomeworkAnswerSaveQueue());
  const contextRevisionRef = useRef(0);

  const updateAttempt = useCallback((next: HomeworkAttempt | null | ((current: HomeworkAttempt | null) => HomeworkAttempt | null)) => {
    setAttempt((current) => {
      const value = typeof next === "function" ? next(current) : next;
      attemptRef.current = value;
      return value;
    });
  }, []);

  useEffect(() => { homeworkRefState.current = homework; }, [homework]);

  const reload = useCallback(() => setRevision((current) => current + 1), []);

  const clearSaveTimers = useCallback(() => {
    for (const timeoutId of saveTimers.current.values()) window.clearTimeout(timeoutId);
    saveTimers.current.clear();
  }, []);

  const hydrateAttempt = useCallback((nextHomework: HomeworkDefinition, nextAttempt: HomeworkAttempt) => {
    const draft = readHomeworkDraftSnapshot(userId, nextAttempt.id);
    const answers = mergeHomeworkAnswers(
      nextHomework,
      nextAttempt.answers ?? {},
      draft.answers,
      Object.keys(draft.pending),
    );
    return {
      ...nextAttempt,
      answers,
      answeredCount: homeworkAnsweredCount(answers),
    };
  }, [userId]);

  const persistAnswer = useCallback((
    currentAttempt: HomeworkAttempt,
    questionId: string,
    storedAnswer: HomeworkStoredAnswer,
  ) => {
    if (localOnly) return Promise.resolve();
    const queueKey = `${currentAttempt.id}:${questionId}`;
    return saveQueue.current.enqueue(queueKey, async () => {
      setSavingCount((count) => count + 1);
      setSaveError(null);
      try {
        await apiRequest(`/homeworks/attempts/${encodeURIComponent(currentAttempt.id)}/answers/${encodeURIComponent(questionId)}`, {
          method: isHomeworkAnswerComplete(storedAnswer) ? "PUT" : "DELETE",
          body: isHomeworkAnswerComplete(storedAnswer) ? JSON.stringify(storedAnswer) : undefined,
        });
        markHomeworkAnswerSynchronized(userId, currentAttempt.id, questionId, storedAnswer);
      } catch (reason) {
        if (attemptRef.current?.id === currentAttempt.id) {
          setSaveError(message(reason, "Cette réponse n’a pas encore été synchronisée."));
        }
        throw reason;
      } finally {
        setSavingCount((count) => Math.max(0, count - 1));
      }
    });
  }, [localOnly, userId]);

  useEffect(() => {
    const contextRevision = contextRevisionRef.current + 1;
    contextRevisionRef.current = contextRevision;
    clearSaveTimers();
    attemptRef.current = null;
    homeworkRefState.current = null;
    setAttempt(null);
    setResult(null);
    setHomework(null);
    setLoadedHomeworkRef(null);
    setResultError(null);
    setSaveError(null);
    setSavingCount(0);
    setStarting(false);
    setSubmitting(false);
    setResuming(false);
    setResultLoading(false);

    if (localOnly) {
      let active = true;
      setLoading(true);
      setError(null);
      void loadPreviewHomework(homeworkRef).then((nextHomework) => {
        if (!active || contextRevisionRef.current !== contextRevision) return;
        homeworkRefState.current = nextHomework;
        setHomework(nextHomework);
        setLoadedHomeworkRef(homeworkRef);
        if (!nextHomework) setError("Ce devoir d’aperçu est introuvable.");
      }).catch((reason) => {
        if (active && contextRevisionRef.current === contextRevision) {
          setError(message(reason, "Le devoir d’aperçu n’a pas pu être chargé."));
        }
      }).finally(() => {
        if (active && contextRevisionRef.current === contextRevision) setLoading(false);
      });
      return () => { active = false; };
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const { homework: nextHomework } = await apiRequest<{ homework: HomeworkDefinition }>(
          `/homeworks/${encodeURIComponent(homeworkRef)}`,
          { signal: controller.signal },
        );
        if (controller.signal.aborted || contextRevisionRef.current !== contextRevision) return;
        if (nextHomework.activeAttemptId) setResuming(true);
        else if (nextHomework.latestAttemptId) setResultLoading(true);
        homeworkRefState.current = nextHomework;
        setHomework(nextHomework);
        setLoadedHomeworkRef(homeworkRef);
        setLoading(false);

        if (nextHomework.activeAttemptId) {
          try {
            // Démarrer est idempotent côté serveur : lorsqu'une tentative active
            // existe, cette route renvoie sa copie et ses réponses sans en créer une.
            const { attempt: nextAttempt, homework: attemptHomework } = await apiRequest<{
              attempt: HomeworkAttempt;
              homework: HomeworkDefinition;
            }>(
              `/homeworks/${encodeURIComponent(homeworkRef)}/attempts`,
              { method: "POST", signal: controller.signal },
            );
            if (controller.signal.aborted || contextRevisionRef.current !== contextRevision) return;
            homeworkRefState.current = attemptHomework;
            setHomework(attemptHomework);
            if (nextAttempt.status !== "in-progress") {
              updateAttempt(nextAttempt);
              clearHomeworkDraft(userId, nextAttempt.id);
              const response = await apiRequest<{ result: HomeworkResult }>(
                `/homeworks/attempts/${encodeURIComponent(nextAttempt.id)}/result`,
                { signal: controller.signal },
              );
              if (!controller.signal.aborted && contextRevisionRef.current === contextRevision) {
                setResult(response.result);
              }
              return;
            }
            const draft = readHomeworkDraftSnapshot(userId, nextAttempt.id);
            const mergedAttempt = hydrateAttempt(attemptHomework, nextAttempt);
            updateAttempt(mergedAttempt);
            const pendingReplay = requeuePendingHomeworkAnswers(mergedAttempt, draft, persistAnswer);
            const pendingCount = pendingReplay.count;
            if (pendingCount > 0) {
              setSaveError(`${pendingCount} réponse${pendingCount > 1 ? "s locales restent" : " locale reste"} à synchroniser.`);
              void pendingReplay.completion;
            }
          } catch (reason) {
            if (!controller.signal.aborted && contextRevisionRef.current === contextRevision) {
              setError(message(reason, "Ta tentative en cours n’a pas pu être reprise."));
            }
          } finally {
            if (!controller.signal.aborted && contextRevisionRef.current === contextRevision) setResuming(false);
          }
          return;
        }

        if (nextHomework.latestAttemptId) {
          try {
            const response = await apiRequest<{ result: HomeworkResult }>(
              `/homeworks/attempts/${encodeURIComponent(nextHomework.latestAttemptId)}/result`,
              { signal: controller.signal },
            );
            if (!controller.signal.aborted && contextRevisionRef.current === contextRevision) setResult(response.result);
          } catch (reason) {
            if (!controller.signal.aborted && contextRevisionRef.current === contextRevision) {
              setResultError(message(reason, "Ton résultat n’a pas pu être rechargé."));
            }
          } finally {
            if (!controller.signal.aborted && contextRevisionRef.current === contextRevision) setResultLoading(false);
          }
        }
      } catch (reason) {
        if (!controller.signal.aborted && contextRevisionRef.current === contextRevision) {
          setError(message(reason, "Le devoir n’a pas pu être chargé."));
        }
      } finally {
        if (!controller.signal.aborted && contextRevisionRef.current === contextRevision) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [clearSaveTimers, homeworkRef, hydrateAttempt, localOnly, persistAnswer, revision, updateAttempt, userId]);

  useEffect(() => () => clearSaveTimers(), [clearSaveTimers]);

  const start = useCallback(async () => {
    const currentHomework = homeworkRefState.current;
    if (!currentHomework || starting) return null;
    const contextRevision = contextRevisionRef.current;
    setStarting(true);
    setError(null);
    try {
      const response = localOnly
        ? { attempt: previewAttempt(currentHomework), homework: currentHomework }
        : await apiRequest<{ attempt: HomeworkAttempt; homework: HomeworkDefinition }>(
          `/homeworks/${encodeURIComponent(homeworkRef)}/attempts`,
          { method: "POST" },
        );
      if (contextRevisionRef.current !== contextRevision) return null;
      homeworkRefState.current = response.homework;
      setHomework(response.homework);
      if (response.attempt.status !== "in-progress") {
        updateAttempt(response.attempt);
        clearHomeworkDraft(userId, response.attempt.id);
        if (!localOnly) {
          const restored = await apiRequest<{ result: HomeworkResult }>(
            `/homeworks/attempts/${encodeURIComponent(response.attempt.id)}/result`,
          );
          if (contextRevisionRef.current !== contextRevision) return null;
          setResult(restored.result);
        }
        return response.attempt;
      }
      const merged = hydrateAttempt(response.homework, response.attempt);
      updateAttempt(merged);
      setResult(null);
      return merged;
    } catch (reason) {
      if (contextRevisionRef.current === contextRevision) setError(message(reason, "La tentative n’a pas pu démarrer."));
      return null;
    } finally {
      if (contextRevisionRef.current === contextRevision) setStarting(false);
    }
  }, [homeworkRef, hydrateAttempt, localOnly, starting, updateAttempt, userId]);

  const setAnswer = useCallback((questionId: string, storedAnswer: HomeworkStoredAnswer) => {
    const currentAttempt = attemptRef.current;
    const currentHomework = homeworkRefState.current;
    if (!currentAttempt || !currentHomework || currentAttempt.status !== "in-progress") return;
    const answers = sanitizeHomeworkAnswers(currentHomework, {
      ...currentAttempt.answers,
      [questionId]: storedAnswer,
    });
    const nextAttempt = { ...currentAttempt, answers, answeredCount: homeworkAnsweredCount(answers) };
    updateAttempt(nextAttempt);
    writePendingHomeworkAnswer(userId, currentAttempt.id, answers, questionId, storedAnswer);

    const prior = saveTimers.current.get(questionId);
    if (prior) window.clearTimeout(prior);
    const timeoutId = window.setTimeout(() => {
      saveTimers.current.delete(questionId);
      void persistAnswer(nextAttempt, questionId, storedAnswer).catch(() => undefined);
    }, 650);
    saveTimers.current.set(questionId, timeoutId);
  }, [persistAnswer, updateAttempt, userId]);

  const submit = useCallback(async () => {
    const currentAttempt = attemptRef.current;
    const currentHomework = homeworkRefState.current;
    if (!currentAttempt || !currentHomework || submitting) return null;
    setSubmitting(true);
    setError(null);
    try {
      for (const timeoutId of saveTimers.current.values()) window.clearTimeout(timeoutId);
      saveTimers.current.clear();
      if (!localOnly) {
        await Promise.all(Object.entries(currentAttempt.answers).map(([questionId, answer]) => (
          persistAnswer(currentAttempt, questionId, answer)
        )));
      }
      const nextResult = localOnly
        ? (() => {
          const manualPoints = homeworkQuestions(currentHomework).reduce(
            (total, question) => total + homeworkQuestionPointSplit(question).manual,
            0,
          );
          return {
          attemptId: currentAttempt.id,
          homeworkId: currentHomework.id,
          status: "awaiting-review" as const,
          submittedAt: new Date().toISOString(),
          timeSpentSeconds: Math.max(0, Math.round((Date.now() - Date.parse(currentAttempt.startedAt)) / 1000)),
          gradingMode: currentHomework.gradingMode,
          reviewStatus: "pending" as const,
          answeredCount: homeworkAnsweredCount(currentAttempt.answers),
          questionCount: homeworkQuestions(currentHomework).length,
          autoGradedPoints: 0,
          pendingManualPoints: manualPoints,
          totalPoints: currentHomework.totalPoints,
          correctionsAvailable: false,
          };
        })()
        : (await apiRequest<{ result: HomeworkResult }>(
          `/homeworks/attempts/${encodeURIComponent(currentAttempt.id)}/finalize`,
          { method: "POST" },
        )).result;
      setResult(nextResult);
      updateAttempt({
        ...currentAttempt,
        status: nextResult.status,
        submittedAt: nextResult.submittedAt,
      });
      clearHomeworkDraft(userId, currentAttempt.id);
      return nextResult;
    } catch (reason) {
      const failure = describeApiFailure(reason, "La copie n’a pas pu être remise.");
      if (!localOnly && isClosedHomeworkAttemptCode(failure.code)) {
        try {
          const response = await apiRequest<{ result: HomeworkResult }>(
            `/homeworks/attempts/${encodeURIComponent(currentAttempt.id)}/result`,
          );
          setResult(response.result);
          updateAttempt({
            ...currentAttempt,
            status: response.result.status,
            submittedAt: response.result.submittedAt,
          });
          setSaveError(null);
          clearHomeworkDraft(userId, currentAttempt.id);
          return response.result;
        } catch (reloadReason) {
          setError(message(reloadReason, "Le temps est écoulé, mais la copie remise n’a pas pu être rechargée."));
          return null;
        }
      }
      setError(failure.message);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [localOnly, persistAnswer, submitting, updateAttempt, userId]);

  const reloadResult = useCallback(async () => {
    const attemptId = attemptRef.current?.id ?? homework?.latestAttemptId;
    if (!attemptId || localOnly) return result;
    const contextRevision = contextRevisionRef.current;
    setResultLoading(true);
    setResultError(null);
    try {
      const response = await apiRequest<{ result: HomeworkResult }>(
        `/homeworks/attempts/${encodeURIComponent(attemptId)}/result`,
      );
      if (contextRevisionRef.current !== contextRevision) return null;
      setResult(response.result);
      return response.result;
    } catch (reason) {
      if (contextRevisionRef.current === contextRevision) {
        setResultError(message(reason, "Le résultat n’a pas pu être actualisé."));
      }
      return null;
    } finally {
      if (contextRevisionRef.current === contextRevision) setResultLoading(false);
    }
  }, [homework?.latestAttemptId, localOnly, result]);

  const contextMatches = loadedHomeworkRef === homeworkRef;

  return {
    homework: contextMatches ? homework : null,
    attempt: contextMatches ? attempt : null,
    result: contextMatches ? result : null,
    loading: loading || !contextMatches,
    resuming,
    resultLoading,
    resultError,
    starting,
    submitting,
    saving: savingCount > 0,
    error,
    saveError,
    reload,
    start,
    setAnswer,
    submit,
    reloadResult,
  };
}
