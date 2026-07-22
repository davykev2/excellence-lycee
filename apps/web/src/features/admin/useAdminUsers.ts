import { useCallback, useEffect, useState } from "react";
import type { AdminUser, UserRole } from "../../domain/admin";
import { schoolLevels } from "../../data/programme";
import { apiRequest } from "../../lib/api";

interface AdminApiUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  levelId: string;
  lastActiveAt: string;
  completedLessons: number;
  totalXp: number;
}

const publishedLessonCount = 7;

function levelLabel(levelId: string) {
  return schoolLevels.find((level) => level.id === levelId)?.label ?? levelId;
}

function formatLastActive(value: string) {
  const date = new Date(value);
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (!Number.isFinite(elapsedSeconds)) return "Activité inconnue";
  if (elapsedSeconds < 60) return "À l’instant";
  if (elapsedSeconds < 3600) return `Il y a ${Math.floor(elapsedSeconds / 60)} min`;
  if (elapsedSeconds < 86400) return `Il y a ${Math.floor(elapsedSeconds / 3600)} h`;
  if (elapsedSeconds < 604800) return `Il y a ${Math.floor(elapsedSeconds / 86400)} j`;
  return new Intl.DateTimeFormat("fr-CI", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function mapAdminUser(user: AdminApiUser): AdminUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    levelId: user.levelId,
    levelLabel: levelLabel(user.levelId),
    status: "active",
    lastActive: formatLastActive(user.lastActiveAt),
    progress: Math.min(100, Math.round((user.completedLessons / publishedLessonCount) * 100)),
    completedLessons: user.completedLessons,
    totalXp: user.totalXp,
  };
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<{ users: AdminApiUser[] }>("/users");
      setUsers(response.users.map(mapAdminUser));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const updateUserLevel = async (userId: string, levelId: string) => {
    setUpdatingUserId(userId);
    try {
      const response = await apiRequest<{ user: { id: string; levelId: string; updatedAt: string } }>(
        `/users/${encodeURIComponent(userId)}/level`,
        { method: "PATCH", body: JSON.stringify({ levelId }) },
      );
      setUsers((current) => current.map((user) => user.id === response.user.id
        ? {
            ...user,
            levelId: response.user.levelId,
            levelLabel: levelLabel(response.user.levelId),
            lastActive: formatLastActive(response.user.updatedAt),
          }
        : user));
    } finally {
      setUpdatingUserId(null);
    }
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    setUpdatingUserId(userId);
    try {
      const response = await apiRequest<{ user: { id: string; role: UserRole; updatedAt: string } }>(
        `/users/${encodeURIComponent(userId)}/role`,
        { method: "PATCH", body: JSON.stringify({ role }) },
      );
      setUsers((current) => current.map((user) => user.id === response.user.id
        ? { ...user, role: response.user.role, lastActive: formatLastActive(response.user.updatedAt) }
        : user));
    } finally {
      setUpdatingUserId(null);
    }
  };

  return {
    users,
    loading,
    error,
    updatingUserId,
    reload,
    updateUserLevel,
    updateUserRole,
  };
}
