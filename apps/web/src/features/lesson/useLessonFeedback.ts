import { useCallback, useEffect, useState } from "react";
import type { AuthUser } from "../../domain/auth";
import type {
  LessonFeedbackComment,
  LessonFeedbackSummary,
  LessonReaction,
} from "../../domain/lessonFeedback";
import { ApiError, apiRequest } from "../../lib/api";

interface LessonFeedbackOptions {
  pathId: string;
  lessonId: string;
  currentUser: Pick<AuthUser, "id" | "name" | "photoUrl" | "role">;
  localOnly?: boolean;
}

function emptyFeedback(): LessonFeedbackSummary {
  return {
    reactions: {
      counts: { useful: 0, love: 0, clear: 0, confusing: 0 },
      total: 0,
    },
    comments: [],
    commentCount: 0,
  };
}

function errorMessage(reason: unknown) {
  if (reason instanceof ApiError) return reason.message;
  if (reason instanceof TypeError) {
    return "Les retours pédagogiques sont momentanément injoignables. Réessaie dans un instant.";
  }
  return "Une erreur empêche d’enregistrer ton retour pour le moment.";
}

function previewKey(pathId: string, lessonId: string) {
  return `excellence-preview-lesson-feedback-v1:${pathId}:${lessonId}`;
}

function readPreview(pathId: string, lessonId: string) {
  try {
    const raw = window.localStorage.getItem(previewKey(pathId, lessonId));
    if (!raw) return emptyFeedback();
    return JSON.parse(raw) as LessonFeedbackSummary;
  } catch {
    return emptyFeedback();
  }
}

function writePreview(pathId: string, lessonId: string, feedback: LessonFeedbackSummary) {
  window.localStorage.setItem(previewKey(pathId, lessonId), JSON.stringify(feedback));
  return feedback;
}

export function useLessonFeedback({
  pathId,
  lessonId,
  currentUser,
  localOnly = false,
}: LessonFeedbackOptions) {
  const [feedback, setFeedback] = useState<LessonFeedbackSummary>(() => emptyFeedback());
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const next = localOnly
        ? readPreview(pathId, lessonId)
        : await apiRequest<LessonFeedbackSummary>(`/lesson-feedback/${pathId}/${lessonId}`);
      setFeedback(next);
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      if (!silent) setLoading(false);
    }
  }, [lessonId, localOnly, pathId]);

  useEffect(() => {
    void load();
  }, [load]);

  const react = useCallback(async (reaction: LessonReaction) => {
    setPendingAction(`reaction:${reaction}`);
    setError(null);
    try {
      if (localOnly) {
        setFeedback((current) => {
          const previous = current.reactions.myReaction;
          const nextReaction = previous === reaction ? undefined : reaction;
          const counts = { ...current.reactions.counts };
          if (previous) counts[previous] = Math.max(0, counts[previous] - 1);
          if (nextReaction) counts[nextReaction] += 1;
          return writePreview(pathId, lessonId, {
            ...current,
            reactions: {
              counts,
              total: Object.values(counts).reduce((sum, count) => sum + count, 0),
              myReaction: nextReaction,
            },
          });
        });
      } else {
        const next = await apiRequest<LessonFeedbackSummary>(
          `/lesson-feedback/${pathId}/${lessonId}/reaction`,
          { method: "PUT", body: JSON.stringify({ reaction }) },
        );
        setFeedback(next);
      }
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setPendingAction(null);
    }
  }, [lessonId, localOnly, pathId]);

  const addComment = useCallback(async (body: string) => {
    setPendingAction("comment:create");
    setError(null);
    try {
      if (localOnly) {
        const now = new Date().toISOString();
        const comment: LessonFeedbackComment = {
          id: crypto.randomUUID(),
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorPhotoUrl: currentUser.photoUrl,
          authorRole: currentUser.role,
          body: body.trim(),
          createdAt: now,
          isMine: true,
          canEdit: true,
          canDelete: true,
        };
        setFeedback((current) => writePreview(pathId, lessonId, {
          ...current,
          comments: [comment, ...current.comments],
          commentCount: current.commentCount + 1,
        }));
      } else {
        const next = await apiRequest<LessonFeedbackSummary>(
          `/lesson-feedback/${pathId}/${lessonId}/comments`,
          { method: "POST", body: JSON.stringify({ body }) },
        );
        setFeedback(next);
      }
      return true;
    } catch (reason) {
      setError(errorMessage(reason));
      return false;
    } finally {
      setPendingAction(null);
    }
  }, [currentUser.id, currentUser.name, currentUser.photoUrl, currentUser.role, lessonId, localOnly, pathId]);

  const editComment = useCallback(async (commentId: string, body: string) => {
    setPendingAction(`comment:edit:${commentId}`);
    setError(null);
    try {
      if (localOnly) {
        setFeedback((current) => writePreview(pathId, lessonId, {
          ...current,
          comments: current.comments.map((comment) => comment.id === commentId
            ? { ...comment, body: body.trim(), updatedAt: new Date().toISOString() }
            : comment),
        }));
      } else {
        await apiRequest<{ updated: true }>(`/lesson-feedback/comments/${commentId}`, {
          method: "PATCH",
          body: JSON.stringify({ body }),
        });
        await load(true);
      }
      return true;
    } catch (reason) {
      setError(errorMessage(reason));
      return false;
    } finally {
      setPendingAction(null);
    }
  }, [lessonId, load, localOnly, pathId]);

  const deleteComment = useCallback(async (commentId: string) => {
    setPendingAction(`comment:delete:${commentId}`);
    setError(null);
    try {
      if (!localOnly) {
        await apiRequest<void>(`/lesson-feedback/comments/${commentId}`, { method: "DELETE" });
      }
      setFeedback((current) => {
        const next = {
          ...current,
          comments: current.comments.filter((comment) => comment.id !== commentId),
          commentCount: Math.max(0, current.commentCount - 1),
        };
        return localOnly ? writePreview(pathId, lessonId, next) : next;
      });
      return true;
    } catch (reason) {
      setError(errorMessage(reason));
      return false;
    } finally {
      setPendingAction(null);
    }
  }, [lessonId, localOnly, pathId]);

  return {
    feedback,
    loading,
    pendingAction,
    error,
    reload: load,
    react,
    addComment,
    editComment,
    deleteComment,
  };
}
