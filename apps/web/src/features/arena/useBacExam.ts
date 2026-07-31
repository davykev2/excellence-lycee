import { useCallback, useEffect, useState } from "react";
import { BAC_CI_2024_EXAM_ID, type BacExamAnswers } from "../../data/bacCi2024Exam";
import { bacExamById } from "../../data/bacExamCatalog";
import type { BacExamState, BacExamZone } from "../../domain/bacExam";
import { apiRequest } from "../../lib/api";

function previewStateFor(examId: string): BacExamState {
  const definition = bacExamById.get(examId);
  return {
    examId,
    title: definition?.title ?? "Sujet type BAC",
    durationMinutes: definition?.durationMinutes ?? 180,
    questionCount: definition?.questionCount ?? 60,
    subjectPublished: false,
    resultsPublished: false,
    answerKeyReady: false,
    correctionReady: false,
    canPublishResults: false,
    canManageSubject: true,
    totalSubmissions: 0,
  };
}

export function useBacExam({
  preview = false,
  examId = BAC_CI_2024_EXAM_ID,
}: { preview?: boolean; examId?: string } = {}) {
  const previewState = previewStateFor(examId);
  const [state, setState] = useState<BacExamState | null>(preview ? previewState : null);
  const [loading, setLoading] = useState(!preview);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reload = useCallback(async () => {
    if (preview) {
      setState(previewState);
      setLoading(false);
      return previewState;
    }
    setLoading(true);
    setError(null);
    try {
      const next = await apiRequest<BacExamState>(`/bac-exams/${examId}`);
      setState(next);
      return next;
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "L’épreuve est momentanément indisponible.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [examId, preview]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const submit = useCallback(async (answers: BacExamAnswers, candidateZone: BacExamZone) => {
    if (preview) {
      const submittedAt = new Date().toISOString();
      setState((current) => ({
        ...(current ?? previewState),
        submittedAt,
        submittedAnswers: answers,
        candidateZone,
      }));
      return submittedAt;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await apiRequest<{ submittedAt: string }>(
        `/bac-exams/${examId}/submissions`,
        { method: "POST", body: JSON.stringify({ answers, candidateZone }) },
      );
      await reload();
      return response.submittedAt;
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "La copie n’a pas pu être enregistrée.";
      setError(message);
      throw submitError;
    } finally {
      setSubmitting(false);
    }
  }, [examId, preview, reload]);

  const setResultsPublished = useCallback(async (published: boolean) => {
    if (preview) {
      setState((current) => ({ ...(current ?? previewState), resultsPublished: published }));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const next = await apiRequest<BacExamState>(
        `/bac-exams/${examId}/results-publication`,
        { method: "PATCH", body: JSON.stringify({ published }) },
      );
      setState(next);
    } catch (publicationError) {
      const message = publicationError instanceof Error ? publicationError.message : "La publication n’a pas pu être modifiée.";
      setError(message);
      throw publicationError;
    } finally {
      setSubmitting(false);
    }
  }, [examId, preview]);

  const setSubjectPublished = useCallback(async (published: boolean) => {
    if (preview) {
      setState((current) => ({ ...(current ?? previewState), subjectPublished: published }));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const next = await apiRequest<BacExamState>(
        `/bac-exams/${examId}/subject-publication`,
        { method: "PATCH", body: JSON.stringify({ published }) },
      );
      setState(next);
    } catch (publicationError) {
      const message = publicationError instanceof Error ? publicationError.message : "L’accès au sujet n’a pas pu être modifié.";
      setError(message);
      throw publicationError;
    } finally {
      setSubmitting(false);
    }
  }, [examId, preview]);

  return {
    state,
    loading,
    error,
    submitting,
    reload,
    submit,
    setResultsPublished,
    setSubjectPublished,
  };
}
