import type { AuthUser } from "../domain/auth";
import type { AppRoute } from "./appRoute";

export function isTerminalLevelId(levelId: string) {
  return levelId === "terminale-a" || levelId === "terminale-c" || levelId === "terminale-d";
}

/**
 * Empêche une URL conservée avant la connexion d'ouvrir un espace qui ne
 * correspond pas au profil scolaire venant d'être chargé.
 */
export function routeAllowedForUser(route: AppRoute, user: AuthUser): AppRoute {
  if (route.navigation === "admin" && user.role !== "admin") {
    return { navigation: "home", subjectId: route.subjectId };
  }
  if (route.navigation === "arena" && route.arenaEditor && user.role !== "admin" && user.role !== "content_editor") {
    return { ...route, arenaEditor: false };
  }
  if (
    route.navigation === "arena"
    && route.arenaMode === "bac"
    && user.role !== "admin"
    && !isTerminalLevelId(user.levelId)
  ) {
    return { navigation: "home", subjectId: route.subjectId };
  }
  return route;
}
