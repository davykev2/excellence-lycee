import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../lib/api";

export interface ProgressLesson {
  pathId: string;
  lessonId: string;
  xpAwarded: number;
  bestScore: number;
  attemptCount: number;
  completedAt: string;
}

export interface AttemptResult {
  passed: boolean;
  improved: boolean;
  xpDelta: number;
  xpAwarded: number;
  bestScore: number;
  attemptCount: number;
}

interface ProgressResponse {
  lessons: ProgressLesson[];
  totals: { completedLessons: number; totalXp: number };
}

interface LearningProgressOptions {
  localOnly?: boolean;
}

const previewProgressStorageKey = "excellence-preview-progress-v1";

function groupProgress(lessons: ProgressLesson[]) {
  const grouped: Record<string, Record<string, ProgressLesson>> = {};
  lessons.forEach((lesson) => {
    grouped[lesson.pathId] ??= {};
    grouped[lesson.pathId][lesson.lessonId] = lesson;
  });
  return grouped;
}

export function useLearningProgress({ localOnly = false }: LearningProgressOptions = {}) {
  const [progressByPath, setProgressByPath] = useState<Record<string, Record<string, ProgressLesson>>>({});
  const [totalXp, setTotalXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localOnly) {
      try {
        const stored = window.localStorage.getItem(previewProgressStorageKey);
        const lessons = stored ? JSON.parse(stored) as ProgressLesson[] : [];
        setProgressByPath(groupProgress(lessons));
        setTotalXp(lessons.reduce((sum, lesson) => sum + lesson.xpAwarded, 0));
      } catch {
        window.localStorage.removeItem(previewProgressStorageKey);
      } finally {
        setLoading(false);
      }
      return;
    }

    let active = true;
    apiRequest<ProgressResponse>("/progress/")
      .then((response) => {
        if (!active) return;
        setProgressByPath(groupProgress(response.lessons));
        setTotalXp(response.totals.totalXp);
      })
      .catch(() => undefined)
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [localOnly]);

  const completedLessonsByPath = useMemo(() => {
    const grouped: Record<string, Set<string>> = {};
    Object.entries(progressByPath).forEach(([pathId, lessons]) => {
      grouped[pathId] = new Set(Object.keys(lessons));
    });
    return grouped;
  }, [progressByPath]);

  const submitAttempt = useCallback(async (pathId: string, lessonId: string, scoreOutOf20: number, lessonReward = 0) => {
    if (localOnly) {
      const existing = progressByPath[pathId]?.[lessonId];
      const desiredXp = scoreOutOf20 === 20 ? lessonReward : scoreOutOf20 >= 10 ? Math.floor(lessonReward / 2) : 0;
      const nextXp = Math.max(existing?.xpAwarded ?? 0, desiredXp);
      const xpDelta = nextXp - (existing?.xpAwarded ?? 0);
      const attemptCount = (existing?.attemptCount ?? 0) + 1;
      const bestScore = Math.max(existing?.bestScore ?? 0, scoreOutOf20);
      const passed = scoreOutOf20 >= 10;

      if (passed || existing) {
        const completedAt = existing?.completedAt ?? new Date().toISOString();
        const nextProgress = {
          ...progressByPath,
          [pathId]: {
            ...(progressByPath[pathId] ?? {}),
            [lessonId]: { pathId, lessonId, xpAwarded: nextXp, bestScore, attemptCount, completedAt },
          },
        };
        setProgressByPath(nextProgress);
        window.localStorage.setItem(
          previewProgressStorageKey,
          JSON.stringify(Object.values(nextProgress).flatMap((lessons) => Object.values(lessons))),
        );
      }
      if (xpDelta > 0) setTotalXp((value) => value + xpDelta);
      return { passed, improved: xpDelta > 0, xpDelta, xpAwarded: nextXp, bestScore, attemptCount };
    }

    const result = await apiRequest<AttemptResult>("/progress/attempt", {
      method: "POST",
      body: JSON.stringify({ pathId, lessonId, scoreOutOf20 }),
    });
    if (result.passed) {
      const completedAt = new Date().toISOString();
      setProgressByPath((current) => ({
        ...current,
        [pathId]: {
          ...(current[pathId] ?? {}),
          [lessonId]: { pathId, lessonId, xpAwarded: result.xpAwarded, bestScore: result.bestScore, attemptCount: result.attemptCount, completedAt },
        },
      }));
      if (result.xpDelta > 0) setTotalXp((value) => value + result.xpDelta);
    }
    return result;
  }, [localOnly, progressByPath]);

  return { progressByPath, completedLessonsByPath, submitAttempt, totalXp, loading };
}
