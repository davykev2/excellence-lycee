import { useCallback, useEffect, useState } from "react";
import type {
  LessonContentDocument,
  LessonContentPayload,
  LessonContentRevision,
  LessonContentStatus,
} from "../../domain/content";
import { apiRequest } from "../../lib/api";

export function useAdminLessonContents({ disabled = false }: { disabled?: boolean } = {}) {
  const [contents, setContents] = useState<LessonContentDocument[]>([]);
  const [loading, setLoading] = useState(!disabled);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (disabled) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<{ contents: LessonContentDocument[] }>("/content/admin");
      setContents(response.contents);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Les contenus n’ont pas pu être chargés.");
    } finally {
      setLoading(false);
    }
  }, [disabled]);

  useEffect(() => { void reload(); }, [reload]);

  const upsertLocal = (content: LessonContentDocument) => {
    setContents((current) => [content, ...current.filter((item) => item.id !== content.id)]);
    return content;
  };

  const save = async (pathId: string, lessonId: string, payload: LessonContentPayload, note?: string) => {
    const response = await apiRequest<{ content: LessonContentDocument }>("/content/admin", {
      method: "PUT",
      body: JSON.stringify({ pathId, lessonId, payload, note }),
    });
    return upsertLocal(response.content);
  };

  const setStatus = async (documentId: string, status: LessonContentStatus, unpublish = false) => {
    const response = await apiRequest<{ content: LessonContentDocument }>(`/content/admin/${documentId}/status`, {
      method: "POST",
      body: JSON.stringify({ status, unpublish }),
    });
    return upsertLocal(response.content);
  };

  const loadRevisions = async (documentId: string) => {
    const response = await apiRequest<{ revisions: LessonContentRevision[] }>(`/content/admin/${documentId}/revisions`);
    return response.revisions;
  };

  const restoreRevision = async (documentId: string, revisionId: string) => {
    const response = await apiRequest<{ content: LessonContentDocument }>(`/content/admin/${documentId}/restore`, {
      method: "POST",
      body: JSON.stringify({ revisionId }),
    });
    return upsertLocal(response.content);
  };

  return {
    contents,
    loading,
    error,
    reload,
    save,
    setStatus,
    loadRevisions,
    restoreRevision,
  };
}
