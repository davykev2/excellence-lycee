import { useCallback, useEffect, useState } from "react";
import type { MessageThread } from "../../domain/community";
import { apiRequest, describeApiFailure } from "../../lib/api";
import type { ApiRequestFailure } from "../../lib/api";

export type UnreadMessagesError = ApiRequestFailure;

export interface UseUnreadMessagesResult {
  count: number;
  error: UnreadMessagesError | null;
  retry: () => void;
}

export function useUnreadMessages(disabled = false): UseUnreadMessagesResult {
  const [count, setCount] = useState(0);
  const [error, setError] = useState<UnreadMessagesError | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const retry = useCallback(() => setReloadKey((value) => value + 1), []);

  useEffect(() => {
    if (disabled) {
      setError(null);
      return;
    }
    let active = true;
    let requestInFlight = false;
    let controller: AbortController | null = null;
    const refresh = () => {
      if (requestInFlight) return;
      requestInFlight = true;
      controller = new AbortController();
      void apiRequest<{ threads: MessageThread[] }>("/messages/threads?archived=false", {
        signal: controller.signal,
        timeoutMs: 12_000,
      })
        .then((response) => {
          if (!active) return;
          setCount(response.threads.reduce((total, thread) => total + thread.unreadCount, 0));
          setError(null);
        })
        .catch((reason: unknown) => {
          if (!active) return;
          setError(describeApiFailure(reason, "Les messages non lus n’ont pas pu être actualisés."));
        })
        .finally(() => {
          requestInFlight = false;
        });
    };
    refresh();
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener("excellence:messages-updated", refresh);
    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(timer);
      window.removeEventListener("excellence:messages-updated", refresh);
    };
  }, [disabled, reloadKey]);

  return { count, error, retry };
}
