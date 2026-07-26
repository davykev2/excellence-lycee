import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminFeedbackItem } from "../../domain/lessonFeedback";
import { ApiError, apiRequest } from "../../lib/api";

const POLL_INTERVAL_MS = 45_000;
const seenKey = (userId: string) => `excellence-admin-feedback-seen:v1:${userId}`;

function readLastSeen(userId: string): string {
  if (!userId) return "";
  try {
    return window.localStorage.getItem(seenKey(userId)) ?? "";
  } catch {
    return "";
  }
}

interface UseAdminFeedbackOptions {
  userId: string;
  /** N'active le flux que pour les rôles admin / éditeur de contenus. */
  enabled: boolean;
}

/**
 * Remonte les réactions et commentaires laissés par les élèves sur les niveaux,
 * tous parcours confondus, pour la cloche de l'administration. Le nombre de
 * non-lus s'appuie sur un repère « dernier consulté » mémorisé par compte.
 */
export function useAdminFeedback({ userId, enabled }: UseAdminFeedbackOptions) {
  const [items, setItems] = useState<AdminFeedbackItem[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [lastSeenAt, setLastSeenAt] = useState<string>(() => readLastSeen(userId));

  const load = useCallback(async (silent = false) => {
    if (!enabled) return;
    if (!silent) setLoading(true);
    try {
      const response = await apiRequest<{ items: AdminFeedbackItem[] }>("/lesson-feedback/admin/feed?limit=40");
      setItems(response.items);
      setError(null);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Notifications momentanément indisponibles.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setItems([]);
      setLoading(false);
      return;
    }
    void load();
    const timer = window.setInterval(() => void load(true), POLL_INTERVAL_MS);
    const onFocus = () => void load(true);
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [enabled, load]);

  useEffect(() => {
    setLastSeenAt(readLastSeen(userId));
  }, [userId]);

  const unreadCount = useMemo(() => {
    if (!lastSeenAt) return items.length;
    const seen = Date.parse(lastSeenAt);
    if (Number.isNaN(seen)) return items.length;
    return items.filter((item) => Date.parse(item.createdAt) > seen).length;
  }, [items, lastSeenAt]);

  const markAllSeen = useCallback(() => {
    const latest = items[0]?.createdAt ?? new Date().toISOString();
    try {
      window.localStorage.setItem(seenKey(userId), latest);
    } catch {
      /* stockage indisponible : le badge se recalculera au prochain chargement */
    }
    setLastSeenAt(latest);
  }, [items, userId]);

  return { items, unreadCount, loading, error, reload: load, markAllSeen, lastSeenAt };
}
