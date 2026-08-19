import type { SubjectId } from "../../domain/learning";
import type { LearningPath } from "../../domain/paths";
import type { ProgressLesson } from "../progress/useLearningProgress";

export type ProgressByPath = Record<string, Record<string, ProgressLesson>>;
export interface DashboardPathPreference {
  pathId: string;
  openedAt: string;
}

const abidjanDayFormatter = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Africa/Abidjan",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function abidjanDayKey(date: Date) {
  const parts = abidjanDayFormatter.formatToParts(date);
  const day = parts.find((part) => part.type === "day")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const year = parts.find((part) => part.type === "year")?.value;
  return day && month && year ? `${year}-${month}-${day}` : "";
}

function latestPathActivity(pathId: string, progressByPath: ProgressByPath) {
  return Object.values(progressByPath[pathId] ?? {}).reduce((latest, lesson) => {
    const timestamp = Date.parse(lesson.completedAt);
    return Number.isFinite(timestamp) ? Math.max(latest, timestamp) : latest;
  }, Number.NEGATIVE_INFINITY);
}

/**
 * Choisit le parcours à reprendre sur l'accueil.
 *
 * Une ouverture explicite (mémorisée localement) reste prioritaire, même si
 * aucun niveau n'y a encore été validé. Sinon, la progression serveur permet
 * de reprendre le parcours utilisé le plus récemment sur n'importe quel
 * appareil. Le premier parcours du programme n'est qu'un dernier repli.
 */
export function selectDashboardPath({
  paths,
  progressByPath,
  levelId,
  subjectId,
  preference,
}: {
  paths: LearningPath[];
  progressByPath: ProgressByPath;
  levelId: string;
  subjectId: SubjectId;
  preference?: DashboardPathPreference | null;
}) {
  const candidates = paths.filter((path) => (
    path.subjectId === subjectId && path.levelIds.includes(levelId)
  ));
  if (candidates.length === 0) return null;

  const latestProgressed = candidates.reduce((latest, candidate) => (
    latestPathActivity(candidate.id, progressByPath) > latestPathActivity(latest.id, progressByPath)
      ? candidate
      : latest
  ));
  const preferred = preference
    ? candidates.find((path) => path.id === preference.pathId)
    : undefined;
  const preferredAt = preference ? Date.parse(preference.openedAt) : Number.NaN;

  return preferred && Number.isFinite(preferredAt)
    && preferredAt > latestPathActivity(latestProgressed.id, progressByPath)
    ? preferred
    : latestProgressed;
}

/** Compte les niveaux réellement validés pendant la journée ivoirienne. */
export function completedLevelsToday(progressByPath: ProgressByPath, now = new Date()) {
  const today = abidjanDayKey(now);
  if (!today) return 0;

  return Object.values(progressByPath).reduce((total, lessons) => (
    total + Object.values(lessons).filter((lesson) => {
      const completedAt = new Date(lesson.completedAt);
      return Number.isFinite(completedAt.getTime()) && abidjanDayKey(completedAt) === today;
    }).length
  ), 0);
}

export function dashboardPathPreferenceKey(userId: string, levelId: string, subjectId: SubjectId) {
  return `excellence:last-path:${userId}:${levelId}:${subjectId}`;
}
