import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, MessageRecipient, MessageThread } from "../../domain/community";
import { apiRequest } from "../../lib/api";
import { normalizeMessageList, reconcileMessageList } from "./messageSync";

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
  const lastMessageIdByThreadRef = useRef(new Map<string, string | undefined>());
  const refreshInFlightRef = useRef(false);
  const threadsRequestVersionRef = useRef(0);
  const recipientsRequestVersionRef = useRef(0);
  const messagesRequestVersionRef = useRef(0);
  activeIdRef.current = activeId;

  const loadThreads = useCallback(async (silent = false) => {
    const requestVersion = ++threadsRequestVersionRef.current;
    if (!silent) setLoadingThreads(true);
    try {
      const response = await apiRequest<ThreadsResponse>(`/messages/threads?archived=${includeArchived}`);
      if (requestVersion !== threadsRequestVersionRef.current) return;
      setThreads(response.threads);
      setActiveId((current) => current && response.threads.some((thread) => thread.id === current)
        ? current
        : response.threads[0]?.id ?? null);
      setError(null);
    } catch (reason) {
      if (requestVersion === threadsRequestVersionRef.current) {
        setError(reason instanceof Error ? reason.message : "La messagerie n’a pas pu être chargée.");
      }
    } finally {
      if (requestVersion === threadsRequestVersionRef.current) setLoadingThreads(false);
    }
  }, [includeArchived]);

  const loadRecipients = useCallback(async () => {
    const requestVersion = ++recipientsRequestVersionRef.current;
    try {
      const response = await apiRequest<RecipientsResponse>("/messages/recipients");
      if (requestVersion !== recipientsRequestVersionRef.current) return;
      setRecipients(response.recipients);
    } catch (reason) {
      if (requestVersion === recipientsRequestVersionRef.current) {
        setError(reason instanceof Error ? reason.message : "Les destinataires sont indisponibles.");
      }
    }
  }, []);

  const loadMessages = useCallback(async (threadId: string, silent = false) => {
    const requestVersion = ++messagesRequestVersionRef.current;
    if (!silent) setLoadingMessages(true);
    try {
      const response = await apiRequest<MessagesResponse>(`/messages/threads/${threadId}/messages`);
      if (requestVersion !== messagesRequestVersionRef.current || activeIdRef.current !== threadId) return;
      const nextMessages = normalizeMessageList(
        response.messages.map(({ createdAt, ...message }) => ({ ...message, sentAt: createdAt })),
      );
      const lastMessageId = nextMessages.at(-1)?.id;
      const hasNewMessage = lastMessageIdByThreadRef.current.get(threadId) !== lastMessageId;
      lastMessageIdByThreadRef.current.set(threadId, lastMessageId);
      setMessages((current) => reconcileMessageList(current, nextMessages));
      setError(null);
      if (!silent || (hasNewMessage && document.visibilityState === "visible")) {
        await apiRequest<void>(`/messages/threads/${threadId}/read`, { method: "POST" });
        setThreads((current) => current.map((thread) => thread.id === threadId ? { ...thread, unreadCount: 0 } : thread));
        window.dispatchEvent(new Event("excellence:messages-updated"));
      }
    } catch (reason) {
      if (requestVersion === messagesRequestVersionRef.current && activeIdRef.current === threadId) {
        setError(reason instanceof Error ? reason.message : "Les messages sont indisponibles.");
      }
    } finally {
      if (requestVersion === messagesRequestVersionRef.current) setLoadingMessages(false);
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
    const refreshWhenVisible = async () => {
      if (document.visibilityState !== "visible" || refreshInFlightRef.current) return;
      refreshInFlightRef.current = true;
      try {
        await Promise.all([
          loadThreads(true),
          activeIdRef.current ? loadMessages(activeIdRef.current, true) : Promise.resolve(),
        ]);
      } finally {
        refreshInFlightRef.current = false;
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") void refreshWhenVisible();
    };
    const requestRefresh = () => void refreshWhenVisible();
    const timer = window.setInterval(requestRefresh, 2_500);
    window.addEventListener("focus", requestRefresh);
    window.addEventListener("online", requestRefresh);
    window.addEventListener("excellence:messages-updated", requestRefresh);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", requestRefresh);
      window.removeEventListener("online", requestRefresh);
      window.removeEventListener("excellence:messages-updated", requestRefresh);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
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
