import { useCallback, useEffect, useState } from "react";
import type {
  ArenaExerciseLevelDocument,
  ArenaExerciseLevelPayload,
  ArenaExerciseStatus,
  PublishedArenaExerciseLevel,
} from "../../domain/arenaExercises";
import type { SubjectId } from "../../domain/learning";
import { apiRequest } from "../../lib/api";

interface ArenaExerciseFilters {
  levelId: string;
  subjectId: SubjectId;
  lessonKey?: string;
}

function previewDocument(payload: ArenaExerciseLevelPayload, id: string = crypto.randomUUID()): ArenaExerciseLevelDocument {
  return {
    id,
    ...payload,
    status: "draft",
    draftVersion: 1,
    hasPublishedVersion: false,
    createdBy: "preview-user",
    updatedAt: new Date().toISOString(),
  };
}

export function useArenaExercises({
  filters,
  canEdit,
  localOnly = false,
}: {
  filters: ArenaExerciseFilters;
  canEdit: boolean;
  localOnly?: boolean;
}) {
  const [publishedLevels, setPublishedLevels] = useState<PublishedArenaExerciseLevel[]>([]);
  const [editorLevels, setEditorLevels] = useState<ArenaExerciseLevelDocument[]>([]);
  const [loading, setLoading] = useState(!localOnly);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (localOnly) {
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const search = new URLSearchParams({ levelId: filters.levelId, subjectId: filters.subjectId });
      if (filters.lessonKey) search.set("lessonKey", filters.lessonKey);
      const [publishedResponse, editorResponse] = await Promise.all([
        apiRequest<{ levels: PublishedArenaExerciseLevel[] }>(`/arena-exercises?${search}`),
        canEdit
          ? apiRequest<{ levels: ArenaExerciseLevelDocument[] }>("/arena-exercises/editor")
          : Promise.resolve({ levels: [] as ArenaExerciseLevelDocument[] }),
      ]);
      setPublishedLevels(publishedResponse.levels);
      setEditorLevels(editorResponse.levels);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "La banque d’exercices n’a pas pu être chargée.");
    } finally {
      setLoading(false);
    }
  }, [canEdit, filters.lessonKey, filters.levelId, filters.subjectId, localOnly]);

  useEffect(() => { void reload(); }, [reload]);

  const upsertEditorLevel = (level: ArenaExerciseLevelDocument) => {
    setEditorLevels((current) => [level, ...current.filter((item) => item.id !== level.id)]);
    if (level.status === "published") {
      setPublishedLevels((current) => [{
        id: level.id,
        levelId: level.levelId,
        subjectId: level.subjectId,
        lessonKey: level.lessonKey,
        lessonTitle: level.lessonTitle,
        difficulty: level.difficulty,
        stageNumber: level.stageNumber,
        title: level.title,
        instructionsMarkdown: level.instructionsMarkdown,
        exercises: level.exercises,
        version: level.publishedVersion ?? level.draftVersion,
        publishedAt: level.publishedAt ?? level.updatedAt,
      }, ...current.filter((item) => item.id !== level.id)]);
    }
    return level;
  };

  const save = async (payload: ArenaExerciseLevelPayload, documentId?: string, note?: string) => {
    if (localOnly) {
      const existing = editorLevels.find((item) => item.id === documentId);
      const level = previewDocument(payload, existing?.id);
      if (existing) {
        level.draftVersion = existing.draftVersion + 1;
        level.hasPublishedVersion = existing.hasPublishedVersion;
        level.publishedVersion = existing.publishedVersion;
        level.publishedAt = existing.publishedAt;
      }
      return upsertEditorLevel(level);
    }
    const response = await apiRequest<{ level: ArenaExerciseLevelDocument }>("/arena-exercises/editor", {
      method: "PUT",
      body: JSON.stringify({ documentId, payload, note }),
    });
    return upsertEditorLevel(response.level);
  };

  const setStatus = async (documentId: string, status: ArenaExerciseStatus) => {
    if (localOnly) {
      const existing = editorLevels.find((item) => item.id === documentId);
      if (!existing) throw new Error("Enregistre d’abord le brouillon.");
      return upsertEditorLevel({
        ...existing,
        status,
        hasPublishedVersion: status === "published" || existing.hasPublishedVersion,
        publishedVersion: status === "published" ? existing.draftVersion : existing.publishedVersion,
        publishedAt: status === "published" ? new Date().toISOString() : existing.publishedAt,
        updatedAt: new Date().toISOString(),
      });
    }
    const response = await apiRequest<{ level: ArenaExerciseLevelDocument }>(
      `/arena-exercises/editor/${encodeURIComponent(documentId)}/status`,
      { method: "POST", body: JSON.stringify({ status }) },
    );
    return upsertEditorLevel(response.level);
  };

  return { publishedLevels, editorLevels, loading, error, reload, save, setStatus };
}
