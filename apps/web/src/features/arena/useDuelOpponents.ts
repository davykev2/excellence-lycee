import { useCallback, useEffect, useState } from "react";
import type { MessageRecipient } from "../../domain/community";
import { apiRequest } from "../../lib/api";

interface RecipientsResponse {
  recipients: MessageRecipient[];
}

const previewOpponents: MessageRecipient[] = [
  { id: "preview-aicha", name: "Aïcha Koné", role: "student", accountType: "student", levelId: "terminale-c", online: true },
  { id: "preview-yann", name: "Yann Kouassi", role: "student", accountType: "student", levelId: "terminale-c", online: true },
  { id: "preview-mariam", name: "Mariam Traoré", role: "student", accountType: "student", levelId: "terminale-c", online: false, lastSeenAt: new Date(Date.now() - 12 * 60_000).toISOString() },
  { id: "preview-ange", name: "Ange N’Guessan", role: "student", accountType: "student", levelId: "terminale-c", online: false, lastSeenAt: new Date(Date.now() - 95 * 60_000).toISOString() },
];

export function useDuelOpponents() {
  const [opponents, setOpponents] = useState<MessageRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await apiRequest<RecipientsResponse>("/messages/recipients");
      setOpponents(response.recipients);
      setError(null);
    } catch (reason) {
      if (import.meta.env.DEV) {
        setOpponents(previewOpponents);
        setError(null);
        return;
      }
      if (!silent) {
        setError(reason instanceof Error
          ? reason.message
          : "Les adversaires disponibles n’ont pas pu être chargés.");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void load(true);
    }, 45_000);
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void load(true);
    };
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [load]);

  const invite = useCallback(async (recipientId: string, subject: string, body: string) => {
    setInviting(true);
    setError(null);
    try {
      if (import.meta.env.DEV && recipientId.startsWith("preview-")) {
        return { threadId: `preview-${recipientId}` };
      }
      return await apiRequest<{ threadId: string }>("/messages/threads", {
        method: "POST",
        body: JSON.stringify({ recipientId, subject, body }),
      });
    } catch (reason) {
      setError(reason instanceof Error
        ? reason.message
        : "L’invitation n’a pas pu être envoyée.");
      throw reason;
    } finally {
      setInviting(false);
    }
  }, []);

  return {
    opponents,
    loading,
    inviting,
    error,
    reload: () => load(),
    invite,
  };
}
