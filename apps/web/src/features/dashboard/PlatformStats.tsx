import { Exam, UsersThree } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import type { LearningPath } from "../../domain/paths";
import { apiRequest } from "../../lib/api";

export interface PlatformStatsValue {
  registeredUsers: number | null;
  availableExercises: number;
}

function countAvailableExercises(paths: LearningPath[]) {
  return paths.reduce((pathTotal, path) => pathTotal + path.modules.reduce(
    (moduleTotal, module) => moduleTotal + module.lessons.reduce(
      (lessonTotal, lesson) => lessonTotal + (lesson.questions?.length || 1),
      0,
    ),
    0,
  ), 0);
}

export function usePlatformStats(paths: LearningPath[], localOnly = false): PlatformStatsValue {
  const [registeredUsers, setRegisteredUsers] = useState<number | null>(localOnly ? 1 : null);
  const availableExercises = useMemo(() => countAvailableExercises(paths), [paths]);

  useEffect(() => {
    if (localOnly) return;
    let active = true;
    apiRequest<{ registeredUsers: number }>("/stats/public", {}, false)
      .then((stats) => active && setRegisteredUsers(stats.registeredUsers))
      .catch(() => active && setRegisteredUsers(null));
    return () => { active = false; };
  }, [localOnly]);

  return { registeredUsers, availableExercises };
}

function formatCount(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export function PlatformStats({ stats }: { stats: PlatformStatsValue }) {
  return (
    <section className="platform-stats" aria-label="Statistiques de la plateforme Excellence Lycée">
      <div className="platform-stats-intro">
        <span className="platform-stats-pulse" aria-hidden="true" />
        <div><strong>Excellence grandit avec toi</strong><span>Les chiffres de la communauté en temps réel</span></div>
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

