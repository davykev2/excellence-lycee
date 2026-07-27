import { useCallback, useEffect, useState } from "react";
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

  const loadMessages = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await apiRequest<GlobalMessagesResponse>("/messages/global?limit=200");
      setMessages(response.messages.map(({ createdAt, ...message }) => ({ ...message, sentAt: createdAt })));
      setError(null);
    } catch (reason) {
      if (!silent) setError(reason instanceof Error ? reason.message : "Le salon global est momentanément indisponible.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMessages();
    const timer = window.setInterval(() => void loadMessages(true), 10_000);
    return () => window.clearInterval(timer);
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
