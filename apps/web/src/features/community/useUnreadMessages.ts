import { useEffect, useState } from "react";
import type { MessageThread } from "../../domain/community";
import { apiRequest } from "../../lib/api";

export function useUnreadMessages(disabled = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (disabled) return;
    let active = true;
    const refresh = () => {
      void apiRequest<{ threads: MessageThread[] }>("/messages/threads?archived=false")
        .then((response) => {
          if (active) setCount(response.threads.reduce((total, thread) => total + thread.unreadCount, 0));
        })
        .catch(() => undefined);
    };
    refresh();
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener("excellence:messages-updated", refresh);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("excellence:messages-updated", refresh);
    };
  }, [disabled]);

  return count;
}
