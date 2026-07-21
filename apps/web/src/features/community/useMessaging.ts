import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, MessageRecipient, MessageThread } from "../../domain/community";
import { apiRequest } from "../../lib/api";

interface ThreadsResponse {
  threads: MessageThread[];
  updatedAt: string;
}

interface RecipientsResponse {
  recipients: MessageRecipient[];
}

interface MessagesResponse {
  messages: Array<Omit<ChatMessage, "sentAt"> & { createdAt: string }>;
}

export function useMessaging(includeArchived: boolean) {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [recipients, setRecipients] = useState<MessageRecipient[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  const loadThreads = useCallback(async (silent = false) => {
    if (!silent) setLoadingThreads(true);
    try {
      const response = await apiRequest<ThreadsResponse>(`/messages/threads?archived=${includeArchived}`);
      setThreads(response.threads);
      setActiveId((current) => current && response.threads.some((thread) => thread.id === current)
        ? current
        : response.threads[0]?.id ?? null);
      setError(null);
    } catch (reason) {
      if (!silent) setError(reason instanceof Error ? reason.message : "La messagerie n’a pas pu être chargée.");
    } finally {
      if (!silent) setLoadingThreads(false);
    }
  }, [includeArchived]);

  const loadRecipients = useCallback(async () => {
    try {
      const response = await apiRequest<RecipientsResponse>("/messages/recipients");
      setRecipients(response.recipients);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Les destinataires sont indisponibles.");
    }
  }, []);

  const loadMessages = useCallback(async (threadId: string, silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const response = await apiRequest<MessagesResponse>(`/messages/threads/${threadId}/messages`);
      if (activeIdRef.current !== threadId) return;
      setMessages(response.messages.map(({ createdAt, ...message }) => ({ ...message, sentAt: createdAt })));
      setError(null);
      await apiRequest<void>(`/messages/threads/${threadId}/read`, { method: "POST" });
      setThreads((current) => current.map((thread) => thread.id === threadId ? { ...thread, unreadCount: 0 } : thread));
      window.dispatchEvent(new Event("excellence:messages-updated"));
    } catch (reason) {
      if (!silent) setError(reason instanceof Error ? reason.message : "Les messages sont indisponibles.");
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    void Promise.all([loadThreads(), loadRecipients()]);
  }, [loadRecipients, loadThreads]);

  useEffect(() => {
    setMessages([]);
    if (activeId) void loadMessages(activeId);
  }, [activeId, loadMessages]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void loadThreads(true);
      if (activeIdRef.current) void loadMessages(activeIdRef.current, true);
    }, 15_000);
    return () => window.clearInterval(timer);
  }, [loadMessages, loadThreads]);

  const runMutation = useCallback(async (operation: () => Promise<void>) => {
    setMutating(true);
    setError(null);
    try {
      await operation();
      window.dispatchEvent(new Event("excellence:messages-updated"));
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "L’action n’a pas pu être enregistrée.";
      setError(message);
      throw reason;
    } finally {
      setMutating(false);
    }
  }, []);

  const createThread = useCallback(async (input: { recipientId: string; subject: string; body: string }) => {
    let createdId = "";
    await runMutation(async () => {
      const response = await apiRequest<{ threadId: string }>("/messages/threads", { method: "POST", body: JSON.stringify(input) });
      createdId = response.threadId;
      await loadThreads(true);
      setActiveId(response.threadId);
    });
    return createdId;
  }, [loadThreads, runMutation]);

  const sendMessage = useCallback(async (threadId: string, body: string, replyToId?: string) => {
    await runMutation(async () => {
      await apiRequest(`/messages/threads/${threadId}/messages`, {
        method: "POST",
        body: JSON.stringify({ body, replyToId: replyToId ?? null }),
      });
      await Promise.all([loadMessages(threadId, true), loadThreads(true)]);
    });
  }, [loadMessages, loadThreads, runMutation]);

  const editMessage = useCallback(async (threadId: string, messageId: string, body: string) => {
    await runMutation(async () => {
      await apiRequest(`/messages/messages/${messageId}`, { method: "PATCH", body: JSON.stringify({ body }) });
      await Promise.all([loadMessages(threadId, true), loadThreads(true)]);
    });
  }, [loadMessages, loadThreads, runMutation]);

  const deleteMessage = useCallback(async (threadId: string, messageId: string) => {
    await runMutation(async () => {
      await apiRequest<void>(`/messages/messages/${messageId}`, { method: "DELETE" });
      await Promise.all([loadMessages(threadId, true), loadThreads(true)]);
    });
  }, [loadMessages, loadThreads, runMutation]);

  const updatePreferences = useCallback(async (threadId: string, preferences: { muted?: boolean; archived?: boolean }) => {
    await runMutation(async () => {
      await apiRequest(`/messages/threads/${threadId}/preferences`, { method: "PATCH", body: JSON.stringify(preferences) });
      await loadThreads(true);
    });
  }, [loadThreads, runMutation]);

  return {
    threads,
    recipients,
    messages,
    activeId,
    setActiveId,
    loadingThreads,
    loadingMessages,
    mutating,
    error,
    reload: () => Promise.all([loadThreads(), loadRecipients()]),
    createThread,
    sendMessage,
    editMessage,
    deleteMessage,
    updatePreferences,
  };
}
