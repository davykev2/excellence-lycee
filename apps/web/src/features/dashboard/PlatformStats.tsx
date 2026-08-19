import { Exam, UsersThree } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { AVAILABLE_EXERCISES } from "../../data/learningPathMetrics";
import { apiRequest } from "../../lib/api";

export interface PlatformStatsValue {
  registeredUsers: number | null;
  availableExercises: number;
}

export function usePlatformStats(localOnly = false): PlatformStatsValue {
  const [registeredUsers, setRegisteredUsers] = useState<number | null>(localOnly ? 1 : null);

  useEffect(() => {
    if (localOnly) return;
    let active = true;
    apiRequest<{ registeredUsers: number }>("/stats/public", {}, false)
      .then((stats) => active && setRegisteredUsers(stats.registeredUsers))
      .catch(() => active && setRegisteredUsers(null));
    return () => { active = false; };
  }, [localOnly]);

  return { registeredUsers, availableExercises: AVAILABLE_EXERCISES };
}

function formatCount(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export function PlatformStats({ stats }: { stats: PlatformStatsValue }) {
  return (
    <section className="platform-stats" aria-label="Statistiques de la plateforme Excellence Lycée">
      <div className="platform-stats-intro">
        <span className="platform-stats-pulse" aria-hidden="true" />
        <div><strong>Excellence grandit avec toi</strong><span>Les repères actuels de la communauté et du catalogue</span></div>
      </div>
      <div className="platform-stat platform-stat--members">
        <span className="platform-stat-icon"><UsersThree size={25} weight="duotone" /></span>
        <div><strong>{stats.registeredUsers === null ? "—" : formatCount(stats.registeredUsers)}</strong><span>membres inscrits</span></div>
      </div>
      <div className="platform-stat platform-stat--exercises">
        <span className="platform-stat-icon"><Exam size={25} weight="duotone" /></span>
        <div><strong>{formatCount(stats.availableExercises)}</strong><span>exercices disponibles</span></div>
      </div>
    </section>
  );
}
