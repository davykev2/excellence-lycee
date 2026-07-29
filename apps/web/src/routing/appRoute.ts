import type { AdminSection } from "../domain/admin";
import type { NavigationId, SubjectId } from "../domain/learning";

export interface AppRoute {
  navigation: NavigationId;
  subjectId?: SubjectId;
  pathId?: string;
  lessonId?: string;
  arenaMode?: "exercises" | "codex" | "duel" | "bac-2024";
  arenaEditor?: boolean;
  bacResults?: boolean;
  adminSection?: AdminSection;
  adminStudio?: boolean;
}

const subjectIds = new Set<SubjectId>([
  "mathematics",
  "physics-chemistry",
  "french",
  "english",
  "svt",
  "philosophy",
  "history-geography",
]);

const adminSectionBySegment: Record<string, AdminSection> = {
  editorial: "editorial",
  contenus: "content",
  utilisateurs: "users",
  operations: "operations",
  reglages: "settings",
};

const adminSegmentBySection: Record<AdminSection, string> = {
  overview: "",
  editorial: "editorial",
  content: "contenus",
  users: "utilisateurs",
  operations: "operations",
  settings: "reglages",
};

const preservedPreviewParams = [
  "__paths-preview",
  "__admin-content-preview",
  "__level-preview",
  "__path-preview",
  "__lesson-preview",
  "__davy-tour-preview",
  "__arena-exercise-editor-preview",
  "__duel-preview",
  "__bac-exam-preview",
] as const;

function decodeSegment(value: string | undefined) {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return undefined;
  }
}

function subjectFrom(searchParams: URLSearchParams) {
  const value = searchParams.get("matiere") as SubjectId | null;
  return value && subjectIds.has(value) ? value : undefined;
}

export function readAppRoute(location: Pick<Location, "pathname" | "search">, fallback: AppRoute): AppRoute {
  const segments = location.pathname.split("/").filter(Boolean);
  const subjectId = subjectFrom(new URLSearchParams(location.search)) ?? fallback.subjectId;
  const [section, second, third, fourth] = segments;

  if (!section) return { ...fallback, subjectId };

  if (section === "parcours") {
    const pathId = decodeSegment(second);
    const lessonId = third === "niveaux" ? decodeSegment(fourth) : undefined;
    return { navigation: "paths", subjectId, pathId, lessonId };
  }

  if (section === "arene") {
    const arenaMode = second === "exercices"
      ? "exercises" as const
      : second === "codex"
        ? "codex" as const
        : second === "duel"
          ? "duel" as const
          : second === "concours-bac-ci-2024"
            ? "bac-2024" as const
          : undefined;
    const arenaEditor = arenaMode === "exercises" && third === "editeur";
    const bacResults = arenaMode === "bac-2024" && third === "resultats";
    return { navigation: "arena", subjectId, arenaMode, arenaEditor, bacResults };
  }
  if (section === "boutique") return { navigation: "store", subjectId };
  if (section === "classement") return { navigation: "ranking", subjectId };
  if (section === "messages") return { navigation: "messages", subjectId };
  if (section === "profil") return { navigation: "profile", subjectId };

  if (section === "admin") {
    const adminSection = adminSectionBySegment[second ?? ""] ?? "overview";
    const adminStudio = adminSection === "content" && third === "studio";
    return { navigation: "admin", subjectId, adminSection, adminStudio };
  }

  return { navigation: "home", subjectId };
}

function pathnameFor(route: AppRoute) {
  if (route.navigation === "paths") {
    if (!route.pathId) return "/parcours";
    const path = `/parcours/${encodeURIComponent(route.pathId)}`;
    return route.lessonId ? `${path}/niveaux/${encodeURIComponent(route.lessonId)}` : path;
  }

  if (route.navigation === "arena") {
    if (route.arenaMode === "exercises") return route.arenaEditor ? "/arene/exercices/editeur" : "/arene/exercices";
    if (route.arenaMode === "codex") return "/arene/codex";
    if (route.arenaMode === "duel") return "/arene/duel";
    if (route.arenaMode === "bac-2024") {
      return route.bacResults ? "/arene/concours-bac-ci-2024/resultats" : "/arene/concours-bac-ci-2024";
    }
    return "/arene";
  }
  if (route.navigation === "store") return "/boutique";
  if (route.navigation === "ranking") return "/classement";
  if (route.navigation === "messages") return "/messages";
  if (route.navigation === "profile") return "/profil";

  if (route.navigation === "admin") {
    const section = route.adminSection ?? "overview";
    const segment = adminSegmentBySection[section];
    if (section === "content" && route.adminStudio) return "/admin/contenus/studio";
    return segment ? `/admin/${segment}` : "/admin";
  }

  return "/";
}

export function appRouteUrl(route: AppRoute, currentSearch = window.location.search) {
  const currentParams = new URLSearchParams(currentSearch);
  const nextParams = new URLSearchParams();

  preservedPreviewParams.forEach((name) => {
    const value = currentParams.get(name);
    if (value !== null) nextParams.set(name, value);
  });

  if (route.subjectId) nextParams.set("matiere", route.subjectId);
  const search = nextParams.toString();
  return `${pathnameFor(route)}${search ? `?${search}` : ""}`;
}

export function routeForNavigation(navigation: NavigationId, subjectId: SubjectId): AppRoute {
  if (navigation === "admin") {
    return { navigation, subjectId, adminSection: "overview", adminStudio: false };
  }
  return { navigation, subjectId };
}
