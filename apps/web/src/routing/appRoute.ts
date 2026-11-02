import type { AdminSection } from "../domain/admin";
import type { ArenaExerciseSelection } from "../domain/arenaExercises";
import type { NavigationId, SubjectId } from "../domain/learning";
import type { CourseDocumentTab } from "../domain/courseDocument";
import { isMathDomain, type MathDomain } from "../domain/mathLibrary";

export interface AppRoute {
  navigation: NavigationId;
  subjectId?: SubjectId;
  pathId?: string;
  lessonId?: string;
  courseTab?: CourseDocumentTab;
  mathDomain?: MathDomain;
  libraryView?: "lessons";
  exerciseView?: "lessons";
  arenaMode?: "exercises" | "codex" | "homework" | "duel" | "bac" | "philo-memory" | "french-workshop";
  philoNotion?: string;
  frenchSection?: "figures" | "argumentation";
  homeworkRef?: string;
  bacExamSlug?: string;
  examCollection?: "inp-hb" | "bac";
  bacArchiveYear?: number;
  bacArchivePaper?: string;
  arenaEditor?: boolean;
  exerciseSelection?: ArenaExerciseSelection;
  bacResults?: boolean;
  adminSection?: AdminSection;
  adminStudio?: boolean;
  spaceSection?: "results";
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
  "__homework-preview",
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
    const params = new URLSearchParams(location.search);
    const view = params.get("vue");
    const courseTab = pathId && view === "evaluation" ? "assessment" as const
      : pathId && ["mathematics", "physics-chemistry", "svt", "history-geography", "philosophy"].includes(subjectId ?? "") && view === "essentiel" ? "essentials" as const : undefined;
    const domain = params.get("domaine");
    const mathDomain = subjectId === "mathematics" && isMathDomain(domain) ? domain : undefined;
    return { navigation: "paths", subjectId, pathId, lessonId, ...(!pathId && view === "lecons" ? { libraryView: "lessons" as const } : {}), ...(courseTab ? { courseTab } : {}), ...(mathDomain ? { mathDomain } : {}) };
  }

  if (section === "arene") {
    const arenaMode = second === "exercices"
      ? "exercises" as const
      : second === "memoire-philo"
        ? "philo-memory" as const
      : second === "atelier-francais"
        ? "french-workshop" as const
      : second === "codex"
        ? "codex" as const
        : second === "devoirs"
          ? "homework" as const
        : second === "duel"
          ? "duel" as const
          : second === "exos-types-bac" || second === "concours-bac-ci-2024"
            ? "bac" as const
          : undefined;
    const arenaEditor = arenaMode === "exercises" && third === "editeur";
    const exerciseParams = new URLSearchParams(location.search);
    const notion = exerciseParams.get("notion");
    const frenchSection = exerciseParams.get("rubrique");
    const exerciseLesson = exerciseParams.get("lecon");
    const sectionFromPath = arenaMode === "exercises" && third === "rubriques" ? decodeSegment(fourth) : undefined;
    const exerciseCategory = sectionFromPath ? "fixation" : exerciseParams.get("categorie");
    const exerciseSection = sectionFromPath ?? exerciseParams.get("rubrique");
    const exerciseId = exerciseParams.get("exercice");
    const exerciseSelection: ArenaExerciseSelection | undefined = arenaMode === "exercises" && exerciseLesson && /^[a-z0-9-]{3,180}$/.test(exerciseLesson)
      ? {
          lessonKey: exerciseLesson,
          ...(["fixation", "deepening", "complex"].includes(exerciseCategory ?? "") ? { category: exerciseCategory as ArenaExerciseSelection["category"] } : {}),
          ...(exerciseSection && /^[a-zA-Z0-9-]{1,100}$/.test(exerciseSection) ? { sectionId: exerciseSection } : {}),
          ...(exerciseId && /^[a-zA-Z0-9-]{1,100}$/.test(exerciseId) ? { exerciseId } : {}),
        } : undefined;
    const homeworkRef = arenaMode === "homework" ? decodeSegment(third) : undefined;
    const legacyBacRoute = second === "concours-bac-ci-2024";
    const bacExamSlug = arenaMode === "bac"
      ? legacyBacRoute ? "2024" : decodeSegment(third)
      : undefined;
    const bacResults = arenaMode === "bac" && (legacyBacRoute ? third === "resultats" : fourth === "resultats");
    const collection = exerciseParams.get("collection");
    const archiveYear = Number(exerciseParams.get("annee"));
    const archivePaper = exerciseParams.get("document");
    const officialArchive = arenaMode === "bac" && !bacExamSlug && collection === "bac" && (archiveYear === 2025 || archiveYear === 2026);
    return {
      navigation: "arena",
      subjectId: arenaMode === "philo-memory" ? "philosophy" : arenaMode === "french-workshop" ? "french" : subjectId,
      arenaMode,
      ...(arenaMode === "philo-memory" && notion && /^[a-z][a-z0-9-]{0,50}$/.test(notion) ? { philoNotion: notion } : {}),
      ...(arenaMode === "french-workshop" && (frenchSection === "figures" || frenchSection === "argumentation") ? { frenchSection } : {}),
      ...(homeworkRef ? { homeworkRef } : {}),
      arenaEditor,
      ...(arenaMode === "exercises" && !arenaEditor && !exerciseSelection && exerciseParams.get("vue") === "lecons" ? { exerciseView: "lessons" as const } : {}),
      ...(exerciseSelection ? { exerciseSelection } : {}),
      bacExamSlug,
      ...(arenaMode === "bac" && !bacExamSlug && (collection === "inp-hb" || collection === "bac") ? { examCollection: collection } : {}),
      ...(officialArchive ? { bacArchiveYear: archiveYear,
        ...(archivePaper && /^[a-z0-9-]{3,100}$/.test(archivePaper) ? { bacArchivePaper: archivePaper } : {}) } : {}),
      bacResults,
    };
  }
  if (section === "boutique") return { navigation: "store", subjectId };
  if (section === "classement") return { navigation: "ranking", subjectId };
  if (section === "messages") return { navigation: "messages", subjectId };
  if (section === "profil") return { navigation: "profile", subjectId };
  if (section === "mon-espace") return { navigation: "space", subjectId, ...(second === "resultats" ? { spaceSection: "results" as const } : {}) };

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
    if (route.arenaMode === "philo-memory") return "/arene/memoire-philo";
    if (route.arenaMode === "french-workshop") return "/arene/atelier-francais";
    if (route.arenaMode === "exercises") {
      if (route.arenaEditor) return "/arene/exercices/editeur";
      if (route.exerciseSelection?.sectionId && (route.exerciseSelection.category ?? "fixation") === "fixation") {
        return `/arene/exercices/rubriques/${encodeURIComponent(route.exerciseSelection.sectionId)}`;
      }
      return "/arene/exercices";
    }
    if (route.arenaMode === "codex") return "/arene/codex";
    if (route.arenaMode === "homework") {
      return route.homeworkRef ? `/arene/devoirs/${encodeURIComponent(route.homeworkRef)}` : "/arene/devoirs";
    }
    if (route.arenaMode === "duel") return "/arene/duel";
    if (route.arenaMode === "bac") {
      if (!route.bacExamSlug) return "/arene/exos-types-bac";
      const base = `/arene/exos-types-bac/${encodeURIComponent(route.bacExamSlug)}`;
      return route.bacResults ? `${base}/resultats` : base;
    }
    return "/arene";
  }
  if (route.navigation === "store") return "/boutique";
  if (route.navigation === "ranking") return "/classement";
  if (route.navigation === "messages") return "/messages";
  if (route.navigation === "profile") return "/profil";
  if (route.navigation === "space") return route.spaceSection === "results" ? "/mon-espace/resultats" : "/mon-espace";

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
  if (route.navigation === "paths" && !route.pathId && route.libraryView === "lessons") nextParams.set("vue", "lecons");
  if (route.navigation === "arena" && route.arenaMode === "exercises" && !route.arenaEditor && !route.exerciseSelection && route.exerciseView === "lessons") nextParams.set("vue", "lecons");
  if (route.navigation === "arena" && route.arenaMode === "philo-memory") {
    nextParams.set("matiere", "philosophy");
    if (route.philoNotion && /^[a-z][a-z0-9-]{0,50}$/.test(route.philoNotion)) nextParams.set("notion", route.philoNotion);
  }
  if (route.navigation === "arena" && route.arenaMode === "french-workshop") {
    nextParams.set("matiere", "french");
    if (route.frenchSection === "figures" || route.frenchSection === "argumentation") nextParams.set("rubrique", route.frenchSection);
  }
  if (route.navigation === "arena" && route.arenaMode === "exercises" && route.exerciseSelection) {
    nextParams.set("lecon", route.exerciseSelection.lessonKey);
    if (route.exerciseSelection.category) nextParams.set("categorie", route.exerciseSelection.category);
    if (route.exerciseSelection.sectionId && (route.arenaEditor || (route.exerciseSelection.category ?? "fixation") !== "fixation")) nextParams.set("rubrique", route.exerciseSelection.sectionId);
    if (route.exerciseSelection.exerciseId) nextParams.set("exercice", route.exerciseSelection.exerciseId);
  }
  if (route.navigation === "paths" && route.pathId && route.courseTab === "assessment") nextParams.set("vue", "evaluation");
  if (route.navigation === "arena" && route.arenaMode === "bac" && !route.bacExamSlug && (route.examCollection === "inp-hb" || route.examCollection === "bac")) nextParams.set("collection", route.examCollection);
  if (route.navigation === "arena" && route.arenaMode === "bac" && !route.bacExamSlug && route.examCollection === "bac" && (route.bacArchiveYear === 2025 || route.bacArchiveYear === 2026)) {
    nextParams.set("annee", String(route.bacArchiveYear));
    if (route.bacArchivePaper && /^[a-z0-9-]{3,100}$/.test(route.bacArchivePaper)) nextParams.set("document", route.bacArchivePaper);
  }
  if (route.navigation === "paths" && route.pathId && ["physics-chemistry", "svt", "history-geography", "philosophy"].includes(route.subjectId ?? "") && route.courseTab === "essentials") nextParams.set("vue", "essentiel");
  if (route.navigation === "paths" && route.subjectId === "mathematics") {
    if (isMathDomain(route.mathDomain)) nextParams.set("domaine", route.mathDomain);
    if (route.pathId && route.courseTab === "essentials") nextParams.set("vue", "essentiel");
  }
  const search = nextParams.toString();
  return `${pathnameFor(route)}${search ? `?${search}` : ""}`;
}

export function routeForNavigation(navigation: NavigationId, subjectId: SubjectId): AppRoute {
  if (navigation === "admin") {
    return { navigation, subjectId, adminSection: "overview", adminStudio: false };
  }
  return { navigation, subjectId };
}
