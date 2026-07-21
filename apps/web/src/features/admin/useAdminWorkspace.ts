import { useEffect, useState } from "react";
import type {
  AdminContentItem,
  AdminSettings,
  AdminWorkspaceState,
  NewAdminContent,
  PublicationStatus,
} from "../../domain/admin";
import { initialAdminWorkspace } from "../../data/admin";

const storageKey = "excellence-admin-workspace-v1";

function loadWorkspace(): AdminWorkspaceState {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return initialAdminWorkspace;
    const parsed = JSON.parse(stored) as AdminWorkspaceState;
    return parsed.version === 1 ? parsed : initialAdminWorkspace;
  } catch {
    return initialAdminWorkspace;
  }
}

export function useAdminWorkspace() {
  const [workspace, setWorkspace] = useState<AdminWorkspaceState>(loadWorkspace);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(workspace));
  }, [workspace]);

  const resolveTask = (taskId: string) => {
    setWorkspace((current) => ({
      ...current,
      tasks: current.tasks.map((task) => task.id === taskId ? { ...task, resolved: true } : task),
    }));
  };

  const toggleUserStatus = (userId: string) => {
    setWorkspace((current) => ({
      ...current,
      users: current.users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "suspended" : "active" }
          : user,
      ),
    }));
  };

  const updateContentStatus = (contentId: string, status: PublicationStatus) => {
    setWorkspace((current) => ({
      ...current,
      contents: current.contents.map((content) =>
        content.id === contentId
          ? { ...content, status, updatedAt: "À l’instant" }
          : content,
      ),
    }));
  };

  const createContent = (content: NewAdminContent) => {
    const newItem: AdminContentItem = {
      ...content,
      id: `content-${Date.now()}`,
      lessonCount: 0,
      status: "draft",
      updatedAt: "À l’instant",
      author: "Kevin Krou",
    };
    setWorkspace((current) => ({
      ...current,
      contents: [newItem, ...current.contents],
    }));
  };

  const updateSettings = (patch: Partial<AdminSettings>) => {
    setWorkspace((current) => ({
      ...current,
      settings: { ...current.settings, ...patch },
    }));
  };

  return {
    workspace,
    resolveTask,
    toggleUserStatus,
    updateContentStatus,
    createContent,
    updateSettings,
  };
}
