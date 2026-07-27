import { useCallback, useEffect, useRef, useState } from "react";
import type { GlobalChatMessage } from "../../domain/community";
import { apiRequest } from "../../lib/api";

interface GlobalMessagesResponse {
  messages: Array<Omit<GlobalChatMessage, "sentAt"> & { createdAt: string }>;
  updatedAt: string;
}

export function useGlobalChat() {
  const [messages, setMessages] = useState<GlobalChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestInFlightRef = useRef(false);

  const loadMessages = useCallback(async (silent = false) => {
    if (requestInFlightRef.current) return;
    requestInFlightRef.current = true;
    if (!silent) setLoading(true);
    try {
      const response = await apiRequest<GlobalMessagesResponse>("/messages/global?limit=200");
      setMessages(response.messages.map(({ createdAt, ...message }) => ({ ...message, sentAt: createdAt })));
      setError(null);
    } catch (reason) {
      if (!silent) setError(reason instanceof Error ? reason.message : "Le salon global est momentanément indisponible.");
    } finally {
      if (!silent) setLoading(false);
      requestInFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    void loadMessages();
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void loadMessages(true);
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") void loadMessages(true);
    };
    const timer = window.setInterval(refreshWhenVisible, 2_500);
    window.addEventListener("focus", refreshWhenVisible);
    window.addEventListener("online", refreshWhenVisible);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshWhenVisible);
      window.removeEventListener("online", refreshWhenVisible);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [loadMessages]);

  const runMutation = useCallback(async (operation: () => Promise<void>) => {
    setMutating(true);
    setError(null);
    try {
      await operation();
      await loadMessages(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "L’action n’a pas pu être enregistrée.");
      throw reason;
    } finally {
      setMutating(false);
    }
  }, [loadMessages]);

  const sendMessage = useCallback(async (body: string, replyToId?: string) => {
    await runMutation(async () => {
      await apiRequest("/messages/global", {
        method: "POST",
        body: JSON.stringify({ body, replyToId: replyToId ?? null }),
      });
    });
  }, [runMutation]);

  const editMessage = useCallback(async (messageId: string, body: string) => {
    await runMutation(async () => {
      await apiRequest(`/messages/global/${messageId}`, { method: "PATCH", body: JSON.stringify({ body }) });
    });
  }, [runMutation]);

  const deleteMessage = useCallback(async (messageId: string) => {
    await runMutation(async () => {
      await apiRequest<void>(`/messages/global/${messageId}`, { method: "DELETE" });
      await loadMessages(true);
    });
  }, [loadMessages, runMutation]);

  return {
    messages,
    loading,
    mutating,
    error,
    reload: () => loadMessages(),
    sendMessage,
    editMessage,
    deleteMessage,
  };
}
