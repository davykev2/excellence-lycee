import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../../lib/api";
import type {
  HomeworkResult,
  HomeworkSummary,
  HomeworkImportPackage,
  HomeworkImportResponse,
  HomeworkPublicationPayload,
  HomeworkReviewDetail,
  HomeworkReviewItem,
  HomeworkReviewPayload,
  HomeworkReviewStatus,
} from "./homeworkReviewTypes";

function errorMessage(reason: unknown, fallback: string) {
  return reason instanceof Error && reason.message.trim() ? reason.message : fallback;
}

function wasAborted(reason: unknown) {
  return reason instanceof DOMException && reason.name === "AbortError";
}

export function useAdminHomeworkCatalog() {
  const [items, setItems] = useState<HomeworkSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((current) => current + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    void apiRequest<{ items: HomeworkSummary[] }>("/homeworks", { signal: controller.signal })
      .then((response) => setItems(response.items))
      .catch((reason) => {
        if (!wasAborted(reason)) setError(errorMessage(reason, "Les devoirs importés n’ont pas pu être chargés."));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [revision]);

  return { items, loading, error, reload };
}

export function useHomeworkReviewQueue(status: HomeworkReviewStatus) {
  const [items, setItems] = useState<HomeworkReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  const reload = useCallback(() => setRevision((current) => current + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    void apiRequest<{ items: HomeworkReviewItem[] }>(
      `/homeworks/admin/reviews?status=${encodeURIComponent(status)}`,
      { signal: controller.signal },
    ).then((response) => {
      setItems(response.items);
    }).catch((reason) => {
      if (!wasAborted(reason)) {
        setError(errorMessage(reason, "La file de correction n’a pas pu être chargée."));
      }
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });

    return () => controller.abort();
  }, [revision, status]);

  return { items, loading, error, reload };
}

export function useHomeworkReviewDetail(attemptId: string | null) {
  const [detail, setDetail] = useState<HomeworkReviewDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  const reload = useCallback(() => setRevision((current) => current + 1), []);

  useEffect(() => {
    if (!attemptId) {
      setDetail(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    void apiRequest<{ review: HomeworkReviewDetail }>(
      `/homeworks/admin/attempts/${encodeURIComponent(attemptId)}`,
      { signal: controller.signal },
    ).then((response) => {
      setDetail(response.review);
    }).catch((reason) => {
      if (!wasAborted(reason)) {
        setError(errorMessage(reason, "La copie n’a pas pu être chargée."));
      }
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });

    return () => controller.abort();
  }, [attemptId, revision]);

  return { detail, loading, error, reload };
}

export async function submitHomeworkReview(attemptId: string, payload: HomeworkReviewPayload) {
  return apiRequest<{ result: HomeworkResult }>(
    `/homeworks/admin/attempts/${encodeURIComponent(attemptId)}/review`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
}

export async function importHomeworkPackage(homeworkPackage: HomeworkImportPackage) {
  const response = await apiRequest<HomeworkImportResponse | (HomeworkImportResponse["homework"] & {
    validation?: HomeworkImportResponse["validation"];
  })>("/homeworks/admin/import", {
    method: "POST",
    body: JSON.stringify({ package: homeworkPackage, publish: false }),
    timeoutMs: 60_000,
  });

  if ("homework" in response) return response;
  return { homework: response, validation: response.validation } satisfies HomeworkImportResponse;
}

export async function setHomeworkPublication(
  homeworkReference: string,
  payload: HomeworkPublicationPayload,
) {
  return apiRequest<{ homework: HomeworkImportResponse["homework"] }>(
    `/homeworks/admin/${encodeURIComponent(homeworkReference)}/publication`,
    { method: "PATCH", body: JSON.stringify(payload) },
  );
}
