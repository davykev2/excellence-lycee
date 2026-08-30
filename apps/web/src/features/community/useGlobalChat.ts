import { useCallback, useEffect, useRef, useState } from "react";
import type { GlobalChatMessage } from "../../domain/community";
import { apiRequest } from "../../lib/api";
import { reconcileMessageList } from "./messageSync";

interface GlobalMessagesResponse {
  messages: Array<Omit<GlobalChatMessage, "sentAt"> & { createdAt: string }>;
  updatedAt: string;
}

export function useGlobalChat() {
  const [messages, setMessages] = useState<GlobalChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestVersionRef = useRef(0);

  const loadMessages = useCallback(async (silent = false) => {
    const requestVersion = ++requestVersionRef.current;
    if (!silent) setLoading(true);
    try {
      const response = await apiRequest<GlobalMessagesResponse>("/messages/global?limit=200");
      if (requestVersion !== requestVersionRef.current) return;
      const nextMessages = response.messages.map(({ createdAt, ...message }) => ({ ...message, sentAt: createdAt }));
      setMessages((current) => reconcileMessageList(current, nextMessages));
      setError(null);
    } catch (reason) {
      if (requestVersion === requestVersionRef.current) {
        setError(reason instanceof Error ? reason.message : "Le salon global est momentanément indisponible.");
      }
    } finally {
      if (requestVersion === requestVersionRef.current) setLoading(false);
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
    });
  }, [runMutation]);

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
