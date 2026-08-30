import type { AuthUser } from "../domain/auth";
import type { SubjectId } from "../domain/learning";
import type { LearningPath } from "../domain/paths";
import { isSubjectAvailableForLevel, subjects } from "../data/programme";
import { readAppRoute, type AppRoute } from "./appRoute";

type LearningPathAccess = Pick<LearningPath, "id" | "levelIds">;
type PathSubject = { pathId?: string; subjectId: SubjectId };

export function initialSubjectIdForLocation(
  location: Pick<Location, "pathname" | "search">,
  fallbackSubjectId: SubjectId,
  pathSubjects: readonly PathSubject[],
  previewPathId?: string | null,
  user?: Pick<AuthUser, "levelId" | "role">,
) {
  const explicitSubjectId = new URLSearchParams(location.search).get("matiere");
  if (explicitSubjectId && Object.prototype.hasOwnProperty.call(subjects, explicitSubjectId)) {
    const requestedSubjectId = explicitSubjectId as SubjectId;
    return !user || canAccessSubject(user, requestedSubjectId) ? requestedSubjectId : fallbackSubjectId;
  }

  const route = readAppRoute(location, { navigation: "home" });
  const requestedPathId = previewPathId ?? route.pathId;
  const requestedSubjectId = pathSubjects.find((path) => path.pathId === requestedPathId)?.subjectId ?? fallbackSubjectId;
  return !user || canAccessSubject(user, requestedSubjectId) ? requestedSubjectId : fallbackSubjectId;
}

export function canAccessSubject(user: Pick<AuthUser, "levelId" | "role">, subjectId: SubjectId) {
  const subject = subjects[subjectId];
  return user.role === "admin" || (subject.enabled && isSubjectAvailableForLevel(subject, user.levelId));
}

export function canAccessLearningPath(user: Pick<AuthUser, "levelId" | "role">, path: LearningPathAccess) {
  return user.role === "admin" || path.levelIds.includes(user.levelId);
}

export function levelIdForLearningPath(
  user: Pick<AuthUser, "levelId" | "role">,
  path?: LearningPathAccess | null,
) {
  if (!path || user.role !== "admin" || path.levelIds.includes(user.levelId)) return user.levelId;
  return path.levelIds[0] ?? user.levelId;
}

export function isTerminalLevelId(levelId: string) {
  return levelId === "terminale-a" || levelId === "terminale-c" || levelId === "terminale-d";
}

export function canAccessBacExams(user: Pick<AuthUser, "levelId" | "role">) {
  return user.role === "admin" || isTerminalLevelId(user.levelId);
}

/**
 * Empêche une URL conservée avant la connexion d'ouvrir un espace qui ne
 * correspond pas au profil scolaire venant d'être chargé.
 */
export function routeAllowedForUser(route: AppRoute, user: AuthUser): AppRoute {
  const subjectRoute = route.subjectId
    && !canAccessSubject(user, route.subjectId)
    ? { ...route, subjectId: "mathematics" as const }
    : route;

  if (subjectRoute.navigation === "admin" && user.role !== "admin") {
    return { navigation: "home", subjectId: subjectRoute.subjectId };
  }
  if (subjectRoute.navigation === "arena" && subjectRoute.arenaEditor && user.role !== "admin" && user.role !== "content_editor") {
    return { ...subjectRoute, arenaEditor: false };
  }
  if (
    subjectRoute.navigation === "arena"
    && subjectRoute.arenaMode === "bac"
    && !canAccessBacExams(user)
  ) {
    return { navigation: "home", subjectId: subjectRoute.subjectId };
  }
  return subjectRoute;
}
