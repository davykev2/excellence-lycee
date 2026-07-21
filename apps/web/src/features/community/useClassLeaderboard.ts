import { useCallback, useEffect, useState } from "react";
import type { LeaderboardEntry, RankingPeriod } from "../../domain/community";
import { apiRequest } from "../../lib/api";

interface LeaderboardResponse {
  period: RankingPeriod;
  levelId: string | null;
  entries: Array<Omit<LeaderboardEntry, "avatarTone">>;
  updatedAt: string;
}

interface LocalLearner {
  name: string;
  photoUrl?: string;
  levelId: string;
  totalXp: number;
}

const avatarPalette = ["#2878c8", "#2c9734", "#8a5cc2", "#d85c2f", "#a8497e", "#637d46"];

function avatarTone(id: string) {
  const hash = [...id].reduce((value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0, 7);
  return avatarPalette[hash % avatarPalette.length];
}

export function useClassLeaderboard(period: RankingPeriod, localLearner?: LocalLearner) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((value) => value + 1), []);

  useEffect(() => {
    if (localLearner) {
      setEntries([{
        id: "preview-learner",
        name: localLearner.name,
        photoUrl: localLearner.photoUrl,
        score: period === "all-time" ? localLearner.totalXp : 0,
        completedLessons: 0,
        streakDays: 0,
        rank: 1,
        avatarTone: avatarTone("preview-learner"),
        isCurrentLearner: true,
      }]);
      setUpdatedAt(new Date().toISOString());
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);
    apiRequest<LeaderboardResponse>(`/leaderboard/?period=${period}`)
      .then((response) => {
        if (!active) return;
        setEntries(response.entries.map((entry) => ({ ...entry, avatarTone: avatarTone(entry.id) })));
        setUpdatedAt(response.updatedAt);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setEntries([]);
        setError(reason instanceof Error ? reason.message : "Le classement n’a pas pu être chargé.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [localLearner, period, reloadKey]);

  return { entries, updatedAt, loading, error, reload };
}
