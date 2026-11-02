import type { SubjectId } from "../../domain/learning";
import type { LearningPath } from "../../domain/paths";
import type { CurriculumLessonTitle } from "../../data/curriculumCatalog";
import { dashboardPathPreferenceKey, type DashboardPathPreference, type ProgressByPath } from "./dashboardLearningState";

interface ResumeStorage { getItem(key: string): string | null; setItem(key: string, value: string): void; }
const memory = new Map<string, string>();
export const dashboardLatestPathKey = (userId: string, levelId: string) => `excellence:last-path:${userId}:${levelId}:all`;

function parsePreference(value: string | null | undefined): DashboardPathPreference | undefined {
  try {
    const parsed = value ? JSON.parse(value) as Partial<DashboardPathPreference> : null;
    if (parsed && typeof parsed.pathId === "string" && typeof parsed.openedAt === "string" && Number.isFinite(Date.parse(parsed.openedAt))) {
      return { pathId: parsed.pathId, openedAt: parsed.openedAt };
    }
  } catch { /* Ignore malformed local preferences, never alter learner progress. */ }
  return undefined;
}

export function readDashboardPreferences(storage: ResumeStorage | undefined, userId: string, levelId: string, subjectIds: SubjectId[]) {
  const preferences: DashboardPathPreference[] = [];
  for (const key of [dashboardLatestPathKey(userId, levelId), ...subjectIds.map(id => dashboardPathPreferenceKey(userId, levelId, id))]) {
    let stored: string | null | undefined;
    try { stored = storage?.getItem(key); } catch { /* Browser storage is optional. */ }
    for (const candidate of [stored, memory.get(key)]) {
      const parsed = parsePreference(candidate);
      if (parsed) preferences.push(parsed);
    }
  }
  return preferences;
}

export function recordDashboardPreference(storage: ResumeStorage | undefined, userId: string, levelId: string, subjectId: SubjectId, preference: DashboardPathPreference) {
  const value = JSON.stringify(preference);
  for (const key of [dashboardLatestPathKey(userId, levelId), dashboardPathPreferenceKey(userId, levelId, subjectId)]) {
    memory.set(key, value);
    try { storage?.setItem(key, value); } catch { /* Keep in-memory resume when local storage is blocked. */ }
  }
}

export interface HomeResumeTarget { pathId: string; subjectId: SubjectId; hasActivity: boolean; }
/** Select from lightweight catalogue metadata before requesting only the needed subject bundle. */
export function selectHomeResumeTarget({ catalog, loadedPaths, levelId, allowedSubjects, progressByPath, preferences, fallbackSubjectId }: {
  catalog: readonly CurriculumLessonTitle[];
  loadedPaths: readonly LearningPath[];
  levelId: string;
  allowedSubjects: readonly SubjectId[];
  progressByPath: ProgressByPath;
  preferences: readonly DashboardPathPreference[];
  fallbackSubjectId: SubjectId;
}): HomeResumeTarget | null {
  const candidates = new Map<string, SubjectId>();
  catalog.filter(entry => entry.levelId === levelId && entry.pathId && allowedSubjects.includes(entry.subjectId))
    .sort((a, b) => a.sequence - b.sequence)
    .forEach(entry => candidates.set(entry.pathId!, entry.subjectId));
  loadedPaths.filter(path => path.levelIds.includes(levelId) && allowedSubjects.includes(path.subjectId))
    .forEach(path => candidates.set(path.id, path.subjectId));
  let selected: HomeResumeTarget | null = null;
  let latest = Number.NEGATIVE_INFINITY;
  for (const [pathId, subjectId] of candidates) {
    const opened = preferences.filter(item => item.pathId === pathId).map(item => Date.parse(item.openedAt));
    const completed = Object.values(progressByPath[pathId] ?? {}).map(item => Date.parse(item.completedAt));
    const activity = Math.max(Number.NEGATIVE_INFINITY, ...opened.filter(Number.isFinite), ...completed.filter(Number.isFinite));
    if (activity > latest) { latest = activity; selected = { pathId, subjectId, hasActivity: true }; }
  }
  if (selected) return selected;
  const fallback = [...candidates].find(([, subjectId]) => subjectId === fallbackSubjectId) ?? [...candidates][0];
  return fallback ? { pathId: fallback[0], subjectId: fallback[1], hasActivity: false } : null;
}
