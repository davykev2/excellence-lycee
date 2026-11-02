import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LearnerProfile, NavigationId, SubjectId } from "./domain/learning";
import type { LearningPath } from "./domain/paths";
import { schoolLevels, subjects, initialDashboard, isSubjectAvailableForLevel } from "./data/programme";
import { loadLearningPathsForLevel, loadLearningPathsForSubject } from "./data/learningPathLoader";
import { curriculumLessonTitles } from "./data/curriculumCatalog";
import { courseLibraryReferences } from "./data/courseLibraryReferences";
import { mathDomainForLesson } from "./domain/mathLibrary";
import { Sidebar } from "./features/navigation/Sidebar";
import { MobileHeader, MobileNavigation } from "./features/navigation/MobileNavigation";
import { getNextLesson, getPathLessons } from "./features/paths/pathLessons";
import { TutorPanel } from "./features/tutor/TutorPanel";
import {
  completedLevelsToday,
  selectDashboardPath,
} from "./features/dashboard/dashboardLearningState";
import { readDashboardPreferences, recordDashboardPreference, selectHomeResumeTarget } from "./features/dashboard/homeResume";
import { useAuth } from "./features/auth/AuthProvider";
import { useLearningProgress } from "./features/progress/useLearningProgress";
import type { AuthUser } from "./domain/auth";
import type { BacExamSlug } from "./data/bacExamCatalog";
import { CompanionGuide } from "./features/companion/CompanionGuide";
import { FirstVisitTour } from "./features/companion/FirstVisitTour";
import { useStoreWallet } from "./features/store/useStoreWallet";
import { usePublishedLessonContents } from "./features/content/usePublishedLessonContents";
import { useUnreadMessages } from "./features/community/useUnreadMessages";
import {
  appRouteUrl,
  readAppRoute,
  routeForNavigation,
  type AppRoute,
} from "./routing/appRoute";
import {
  canAccessLearningPath,
  canAccessHomeworks,
  canAccessBacExams,
  initialSubjectIdForLocation,
  levelIdForLearningPath,
  routeAllowedForUser,
} from "./routing/routeAccess";
import { canOpenMasteryLevel } from "./config/masteryAccess";
import { showDocumentHome, showHistoricalHome, showOriginalHome } from "./config/homeLayout";
import { homeCourseViews } from "./features/dashboard/homeCourseViews";

const AdminScreen = lazy(() =>
  import("./features/admin/AdminScreen").then((module) => ({ default: module.AdminScreen })),
);
const ContinuousCourseScreen = lazy(() =>
  import("./features/lesson/ContinuousCourseScreen").then((module) => ({ default: module.ContinuousCourseScreen })),
);
const CourseReferenceScreen = lazy(() =>
  import("./features/lesson/document/CourseReferenceScreen").then(module => ({ default: module.CourseReferenceScreen })),
);
const ArenaScreen = lazy(() =>
  import("./features/arena/ArenaScreen").then((module) => ({ default: module.ArenaScreen })),
);
const Dashboard = lazy(() =>
  import("./features/dashboard/Dashboard").then((module) => ({ default: module.Dashboard })),
);
const OriginalDashboard = lazy(() =>
  import("./features/dashboard/OriginalDashboard").then(module => ({ default: module.OriginalDashboard })),
);
const HistoricalDashboard = lazy(() =>
  import("./features/dashboard/HistoricalDashboard").then(module => ({ default: module.HistoricalDashboard })),
);
const DocumentDashboard = lazy(() =>
  import("./features/dashboard/DocumentDashboard").then(module => ({ default: module.DocumentDashboard })),
);
const LearningLibraryScreen = lazy(() =>
  import("./features/paths/LearningLibraryScreen").then((module) => ({ default: module.LearningLibraryScreen })),
);
const SubjectLibraryScreen = lazy(() =>
  import("./features/paths/SubjectLibraryScreen").then(module => ({ default: module.SubjectLibraryScreen })),
);
const LevelEmptyState = lazy(() =>
  import("./features/dashboard/LevelEmptyState").then((module) => ({ default: module.LevelEmptyState })),
);
const MessagesScreen = lazy(() =>
  import("./features/community/MessagesScreen").then((module) => ({ default: module.MessagesScreen })),
);
const ProfileScreen = lazy(() =>
  import("./features/profile/ProfileScreen").then((module) => ({ default: module.ProfileScreen })),
);
const PersonalSpaceScreen = lazy(() =>
  import("./features/profile/PersonalSpaceScreen").then(module => ({ default: module.PersonalSpaceScreen })),
);
const LearnerResultsScreen = lazy(() =>
  import("./features/profile/LearnerResultsScreen").then(module => ({ default: module.LearnerResultsScreen })),
);
const RankingScreen = lazy(() =>
  import("./features/community/RankingScreen").then((module) => ({ default: module.RankingScreen })),
);
const StoreScreen = lazy(() =>
  import("./features/store/StoreScreen").then((module) => ({ default: module.StoreScreen })),
);

type OpenDialog = "tutor" | null;

const emptyCompletedLessons = new Set<string>();
const previewParams = new URLSearchParams(window.location.search);
const isPathPreview = import.meta.env.DEV && previewParams.has("__paths-preview");
const isAdminContentPreview = import.meta.env.DEV && previewParams.has("__admin-content-preview");
const isArenaExerciseEditorPreview = import.meta.env.DEV && previewParams.has("__arena-exercise-editor-preview");
const isDuelPreview = import.meta.env.DEV && previewParams.has("__duel-preview");
const isHomeworkPreview = import.meta.env.DEV && previewParams.has("__homework-preview");
const isBacExamPreview = import.meta.env.DEV && previewParams.has("__bac-exam-preview");
const forceDavyTourPreview = import.meta.env.DEV && previewParams.has("__davy-tour-preview");
const requestedPreviewLevel = previewParams.get("__level-preview");
const previewLevelId = schoolLevels.some((level) => level.id === requestedPreviewLevel) ? requestedPreviewLevel! : "seconde-c";
const requestedPreviewPathId = previewParams.get("__path-preview");
const requestedPreviewLessonId = previewParams.get("__lesson-preview");
const previewUser: AuthUser = {
  id: "preview-user",
  email: "apprenant@excellence.local",
  name: "Kévin",
  role: "student",
  accountType: "student",
  levelId: previewLevelId,
  emailVerified: true,
};
const adminPreviewUser: AuthUser = {
  ...previewUser,
  id: "admin-preview-user",
  email: "admin@excellence.local",
  name: "Administrateur",
  role: "admin",
  accountType: "teacher",
};
const arenaEditorPreviewUser: AuthUser = {
  ...previewUser,
  id: "arena-editor-preview-user",
  email: "editeur@excellence.local",
  name: "Éditeur pédagogique",
  role: "content_editor",
  accountType: "teacher",
};

function createRouteFallback(
  previewPath?: LearningPath,
  previewLessonId?: string | null,
  fallbackSubjectId: SubjectId = initialDashboard.subjectId,
): AppRoute {
  return isArenaExerciseEditorPreview
    ? { navigation: "arena", subjectId: "mathematics", arenaMode: "exercises", arenaEditor: true }
    : isHomeworkPreview
    ? { navigation: "arena", subjectId: "mathematics", arenaMode: "homework" }
    : isBacExamPreview
    ? { navigation: "arena", subjectId: "mathematics", arenaMode: "bac", bacExamSlug: "2024" }
    : isDuelPreview
    ? { navigation: "arena", subjectId: "mathematics", arenaMode: "duel" }
    : isAdminContentPreview
    ? { navigation: "admin", subjectId: "mathematics", adminSection: "content", adminStudio: true }
    : isPathPreview
      ? {
          navigation: previewPath ? "paths" : "home",
          subjectId: previewPath?.subjectId ?? fallbackSubjectId,
          pathId: previewPath?.id,
          lessonId: previewLessonId ?? undefined,
        }
      : { navigation: "home", subjectId: fallbackSubjectId };
}

function mergeLearningPaths(current: LearningPath[], incoming: LearningPath[]) {
  const byId = new Map(current.map((path) => [path.id, path]));
  for (const path of incoming) byId.set(path.id, path);
  return [...byId.values()];
}

export function LearningApp({ user }: { user?: AuthUser }) {
  const effectiveUser = isArenaExerciseEditorPreview
    ? arenaEditorPreviewUser
    : isAdminContentPreview
      ? adminPreviewUser
      : isBacExamPreview || isHomeworkPreview || isDuelPreview || isPathPreview
        ? previewUser
        : user;
  if (!effectiveUser) throw new Error("Session apprenant indisponible.");
  return <LearningAppWithPaths user={effectiveUser} />;
}

function LearningAppWithPaths({ user }: { user: AuthUser }) {
  const [baseLearningPaths, setBaseLearningPaths] = useState<LearningPath[] | null>(null);
  const [pathLoadingError, setPathLoadingError] = useState<Error | null>(null);
  const loadedSubjectIds = useRef(new Set<SubjectId>());
  const pendingSubjectLoads = useRef(new Map<SubjectId, Promise<void>>());
  const loadGeneration = useRef(0);
  const includeAllPaths = user.role === "admin" || isAdminContentPreview || isPathPreview;
  const requestedInitialSubjectId = useMemo(
    () => initialSubjectIdForLocation(
      window.location,
      initialDashboard.subjectId,
      curriculumLessonTitles,
      requestedPreviewPathId,
      user,
    ),
    [user.id, user.levelId, user.role],
  );

  const ensureSubjectPaths = useCallback((subjectId: SubjectId) => {
    if (includeAllPaths || loadedSubjectIds.current.has(subjectId)) return Promise.resolve();
    const pending = pendingSubjectLoads.current.get(subjectId);
    if (pending) return pending;

    const generation = loadGeneration.current;
    const loading = loadLearningPathsForSubject(user.levelId, subjectId)
      .then((paths) => {
        if (generation !== loadGeneration.current) return;
        loadedSubjectIds.current.add(subjectId);
        setBaseLearningPaths((current) => mergeLearningPaths(current ?? [], paths));
      })
      .catch((error: unknown) => {
        const normalized = error instanceof Error ? error : new Error("Chargement de la matière impossible.");
        if (generation === loadGeneration.current) setPathLoadingError(normalized);
        throw normalized;
      })
      .finally(() => {
        if (pendingSubjectLoads.current.get(subjectId) === loading) {
          pendingSubjectLoads.current.delete(subjectId);
        }
      });

    pendingSubjectLoads.current.set(subjectId, loading);
    return loading;
  }, [includeAllPaths, user.levelId]);

  useEffect(() => {
    let active = true;
    const generation = ++loadGeneration.current;
    loadedSubjectIds.current.clear();
    pendingSubjectLoads.current.clear();
    setBaseLearningPaths(null);
    setPathLoadingError(null);
    const initialLoading = includeAllPaths
      ? loadLearningPathsForLevel(user.levelId, true)
      : loadLearningPathsForSubject(user.levelId, requestedInitialSubjectId);
    initialLoading
      .then((paths) => {
        if (!active || generation !== loadGeneration.current) return;
        if (!includeAllPaths) loadedSubjectIds.current.add(requestedInitialSubjectId);
        setBaseLearningPaths(paths);
      })
      .catch((error: unknown) => {
        if (active) setPathLoadingError(error instanceof Error ? error : new Error("Chargement des cours impossible."));
      });
    return () => { active = false; };
  }, [includeAllPaths, requestedInitialSubjectId, user.levelId]);

  if (pathLoadingError) throw pathLoadingError;
  if (!baseLearningPaths) {
    return <main className="session-loading" role="status"><span className="session-loading-mark" />Chargement de tes cours…</main>;
  }

  const previewPath = isPathPreview
    ? baseLearningPaths.find((path) => path.id === requestedPreviewPathId && path.levelIds.includes(previewLevelId))
    : undefined;
  const previewPathLessons = previewPath ? getPathLessons(previewPath) : [];
  const previewLessonId = requestedPreviewLessonId === "last"
    ? previewPathLessons[previewPathLessons.length - 1]?.id ?? null
    : previewPathLessons.some((lesson) => lesson.id === requestedPreviewLessonId) ? requestedPreviewLessonId : null;
  const routeFallback = createRouteFallback(previewPath, previewLessonId, requestedInitialSubjectId);

  return (
    <LearningAppShell
      user={user}
      baseLearningPaths={baseLearningPaths}
      previewPath={previewPath}
      routeFallback={routeFallback}
      ensureSubjectPaths={ensureSubjectPaths}
    />
  );
}

function LearningAppShell({
  user,
  baseLearningPaths,
  previewPath,
  routeFallback,
  ensureSubjectPaths,
}: {
  user: AuthUser;
  baseLearningPaths: LearningPath[];
  previewPath?: LearningPath;
  routeFallback: AppRoute;
  ensureSubjectPaths: (subjectId: SubjectId) => Promise<void>;
}) {
  const [route, setRoute] = useState<AppRoute>(() => routeAllowedForUser(readAppRoute(window.location, routeFallback), user));
  const [openDialog, setOpenDialog] = useState<OpenDialog>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [tourReplayKey, setTourReplayKey] = useState(0);
  const [bundleNavigationLoading, setBundleNavigationLoading] = useState(false);
  const [bundleNavigationError, setBundleNavigationError] = useState<Error | null>(null);
  const [homeVisitKey, setHomeVisitKey] = useState(0);
  const navigationRequest = useRef(0);
  const { logout, updateUser } = useAuth();
  const localPreview = isPathPreview || isAdminContentPreview || isArenaExerciseEditorPreview || isDuelPreview || isHomeworkPreview || isBacExamPreview;
  const {
    progressByPath,
    completedLessonsByPath,
    totalXp,
    loading: progressLoading,
    error: progressError,
    retry: retryProgress,
  } = useLearningProgress({ localOnly: localPreview });
  const store = useStoreWallet({ localOnly: localPreview, localTotalXp: totalXp });
  const availablePaths = usePublishedLessonContents(baseLearningPaths, localPreview);
  const {
    count: unreadMessages,
    error: unreadMessagesError,
    retry: retryUnreadMessages,
  } = useUnreadMessages(localPreview);
  const profile: LearnerProfile = useMemo(() => ({ name: user.name, photoUrl: user.photoUrl, levelId: user.levelId }), [user]);
  const activeNavigation = route.navigation;
  const isFocusedHomework = route.navigation === "arena"
    && route.arenaMode === "homework"
    && Boolean(route.homeworkRef);
  const subjectId = route.subjectId ?? previewPath?.subjectId ?? initialDashboard.subjectId;
  const selectedPathId = route.pathId ?? null;
  const activeLessonId = route.lessonId ?? null;

  const prepareRoute = useCallback((nextRoute: AppRoute, commit: (allowedRoute: AppRoute) => void) => {
    const allowedRoute = routeAllowedForUser(nextRoute, user);
    const nextSubjectId = allowedRoute.subjectId ?? initialDashboard.subjectId;
    if (nextSubjectId === subjectId) {
      commit(allowedRoute);
      return;
    }

    const request = ++navigationRequest.current;
    setBundleNavigationLoading(true);
    setBundleNavigationError(null);
    void ensureSubjectPaths(nextSubjectId)
      .then(() => {
        if (request === navigationRequest.current) commit(allowedRoute);
      })
      .catch((error: unknown) => {
        if (request === navigationRequest.current) {
          setBundleNavigationError(error instanceof Error ? error : new Error("Chargement de la matière impossible."));
        }
      })
      .finally(() => {
        if (request === navigationRequest.current) setBundleNavigationLoading(false);
      });
  }, [ensureSubjectPaths, subjectId, user]);

  const navigate = useCallback((nextRoute: AppRoute, options?: { replace?: boolean; scroll?: boolean }) => {
    prepareRoute(nextRoute, (allowedRoute) => {
      const url = appRouteUrl(allowedRoute);
      const state = { excellenceRoute: true };
      if (options?.replace) window.history.replaceState(state, "", url);
      else window.history.pushState(state, "", url);
      setRoute(allowedRoute);
      if (allowedRoute.navigation === "home") setHomeVisitKey(value => value + 1);
      if (options?.scroll !== false) window.scrollTo({ top: 0, behavior: "auto" });
    });
  }, [prepareRoute]);

  useEffect(() => {
    const canonicalUrl = appRouteUrl(route);
    if (`${window.location.pathname}${window.location.search}` !== canonicalUrl) {
      window.history.replaceState({ excellenceRoute: true }, "", canonicalUrl);
    }

    const onPopState = () => {
      setOpenDialog(null);
      prepareRoute(readAppRoute(window.location, routeFallback), allowedRoute => {
        setRoute(allowedRoute);
        if (allowedRoute.navigation === "home") setHomeVisitKey(value => value + 1);
      });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [prepareRoute, route, routeFallback, user]);

  const routedPath = useMemo(
    () => availablePaths.find((path) => path.id === selectedPathId) ?? null,
    [availablePaths, selectedPathId],
  );
  const routedReference = courseLibraryReferences.find(reference => reference.id === selectedPathId) ?? null;
  const selectedReference = routedReference && canAccessLearningPath(user, routedReference) ? routedReference : null;
  const routeLevelId = levelIdForLearningPath(user, routedPath ?? routedReference);
  const level = useMemo(
    () => schoolLevels.find((item) => item.id === routeLevelId) ?? schoolLevels[0],
    [routeLevelId],
  );
  const subjectOptions = useMemo(
    () => Object.values(subjects).filter((item) => isSubjectAvailableForLevel(item, level.id)),
    [level.id],
  );
  const subject = subjectOptions.find((item) => item.id === subjectId) ?? subjects.mathematics;

  const dashboardPreferences = useMemo(() => {
    let storage: Storage | undefined;
    try { storage = window.localStorage; } catch { /* Resume also works without optional storage. */ }
    return readDashboardPreferences(storage, user.id, level.id, Object.keys(subjects) as SubjectId[]);
  }, [level.id, user.id, route]);
  const homeResumeTarget = useMemo(() => selectHomeResumeTarget({
    catalog: curriculumLessonTitles, loadedPaths: availablePaths, levelId: level.id,
    allowedSubjects: subjectOptions.filter(item => item.enabled).map(item => item.id),
    progressByPath, preferences: dashboardPreferences, fallbackSubjectId: subject.id,
  }), [availablePaths, dashboardPreferences, level.id, progressByPath, subject.id, subjectOptions]);
  const dashboardPathPreference = dashboardPreferences.filter(item => showOriginalHome
    ? availablePaths.some(path => path.id === item.pathId && path.subjectId === subject.id && path.levelIds.includes(level.id))
    : item.pathId === homeResumeTarget?.pathId)
    .sort((a, b) => Date.parse(b.openedAt) - Date.parse(a.openedAt))[0] ?? null;
  const homeSubjectChanging = !showOriginalHome && activeNavigation === "home" && Boolean(homeResumeTarget && homeResumeTarget.subjectId !== subject.id);
  useEffect(() => {
    if (progressLoading || !homeSubjectChanging || !homeResumeTarget) return;
    navigate({ navigation: "home", subjectId: homeResumeTarget.subjectId }, { replace: true, scroll: false });
  }, [homeResumeTarget?.subjectId, homeSubjectChanging, navigate, progressLoading]);
  const dashboardPath = useMemo(
    () => activeNavigation === "home" && !showOriginalHome
    ? availablePaths.find(path => path.id === homeResumeTarget?.pathId && path.levelIds.includes(level.id)) ?? null
    : selectDashboardPath({
      paths: availablePaths,
      progressByPath,
      levelId: level.id,
      subjectId: subject.id,
      preference: dashboardPathPreference,
    }),
    [activeNavigation, availablePaths, dashboardPathPreference, homeResumeTarget?.pathId, level.id, progressByPath, subject.id],
  );
  const selectedPath = routedPath && canAccessLearningPath(user, routedPath) ? routedPath : null;
  const activePath = selectedPath ?? dashboardPath;
  const completedLessonIds = activePath
    ? completedLessonsByPath[activePath.id] ?? emptyCompletedLessons
    : emptyCompletedLessons;
  const pathLessons = useMemo(() => activePath ? getPathLessons(activePath) : [], [activePath]);
  const currentLesson = useMemo(
    () => activePath ? getNextLesson(activePath, completedLessonIds) ?? pathLessons[pathLessons.length - 1] : undefined,
    [activePath, completedLessonIds, pathLessons],
  );
  const activePathIsContinuousCourse = Boolean(activePath);
  const activePathHasHistory = completedLessonIds.size > 0 || dashboardPreferences.some(preference => preference.pathId === activePath?.id);
  const completedToday = useMemo(() => completedLevelsToday(progressByPath), [progressByPath]);
  const activeLessonIndex = activeLessonId ? pathLessons.findIndex((lesson) => lesson.id === activeLessonId) : -1;
  const activeLesson = activeLessonIndex >= 0 ? pathLessons[activeLessonIndex] : null;

  const dashboardContent = useMemo(
    () => ({
      ...initialDashboard,
      learnerName: profile.name,
      learnerPhotoUrl: profile.photoUrl,
      levelId: profile.levelId,
      dailyGoal: {
        ...initialDashboard.dailyGoal,
        completed: Math.min(completedToday, initialDashboard.dailyGoal.target),
      },
      lesson: {
        ...initialDashboard.lesson,
        id: currentLesson?.id ?? initialDashboard.lesson.id,
        eyebrow: activePathHasHistory ? "Là où tu en étais" : "Pour commencer",
        title: activePath?.title ?? "Nouveau cours",
        remainingMinutes: activePathIsContinuousCourse ? activePath?.estimatedMinutes ?? 0 : currentLesson?.durationMinutes ?? 0,
        ctaLabel: activePathHasHistory ? "Reprendre mon cours" : "Commencer ce cours",
      },
    }),
    [activePath, activePathHasHistory, activePathIsContinuousCourse, completedLessonIds.size, completedToday, currentLesson, pathLessons.length, profile],
  );
  const dashboardSyncIssue = useMemo(() => {
    const unavailable: string[] = [];
    if (progressError) unavailable.push("ta progression");
    if (store.syncError) unavailable.push("ton solde d’or");
    if (unreadMessagesError) unavailable.push("tes messages non lus");
    if (unavailable.length === 0) return null;

    return {
      message: `La synchronisation de ${unavailable.join(", ")} a échoué. Tes données enregistrées restent protégées.`,
      onRetry: () => {
        if (progressError) retryProgress();
        if (store.syncError) store.refresh();
        if (unreadMessagesError) retryUnreadMessages();
      },
    };
  }, [progressError, retryProgress, retryUnreadMessages, store.refresh, store.syncError, unreadMessagesError]);

  useEffect(() => {
    if (!selectedPath) return;
    const preference = { pathId: selectedPath.id, openedAt: new Date().toISOString() };
    let storage: Storage | undefined;
    try { storage = window.localStorage; } catch { /* Memory-only resume in this tab remains available. */ }
    recordDashboardPreference(storage, user.id, level.id, selectedPath.subjectId, preference);
  }, [level.id, selectedPath, subject.id, user.id]);

  const handleNavigate = (id: NavigationId) => {
    setOpenDialog(null);
    navigate(routeForNavigation(id, subject.id));
  };

  const handleSubjectChange = (nextSubjectId: SubjectId) => {
    navigate(route.navigation === "paths"
      ? { navigation: "paths", subjectId: nextSubjectId, libraryView: "lessons", ...(nextSubjectId === "mathematics" && subject.id === "mathematics" ? { mathDomain: route.mathDomain } : {}) }
      : { ...route, subjectId: nextSubjectId });
  };

  const openPathCourse = () => {
    if (!activePath) return;
    setOpenDialog(null);
    navigate({
      navigation: "paths",
      subjectId: activePath.subjectId,
      pathId: activePath.id,
    }, { scroll: false });
  };

  useEffect(() => {
    if (subject.id !== subjectId) {
      navigate({ ...route, subjectId: subject.id }, { replace: true, scroll: false });
    }
  }, [navigate, route, subject.id, subjectId]);

  useEffect(() => {
    if (progressLoading || route.navigation !== "paths" || !route.pathId) return;
    if (selectedReference) {
      if (route.lessonId || subjectId !== selectedReference.subjectId || route.courseTab === "assessment") {
        navigate({ navigation: "paths", subjectId: selectedReference.subjectId, pathId: selectedReference.id, mathDomain: "analyse",
          ...(route.courseTab === "essentials" ? { courseTab: "essentials" as const } : {}) }, { replace: true, scroll: false });
      }
      return;
    }
    const requestedPath = availablePaths.find((path) => (
      path.id === route.pathId && canAccessLearningPath(user, path)
    ));
    if (!requestedPath) {
      navigate({ navigation: "paths", subjectId: subject.id }, { replace: true, scroll: false });
      return;
    }
    if (route.lessonId) {
      const requestedLessons = getPathLessons(requestedPath);
      const requestedLessonIndex = requestedLessons.findIndex((lesson) => lesson.id === route.lessonId);
      const completedForRequestedPath = completedLessonsByPath[requestedPath.id] ?? emptyCompletedLessons;
      const lessonIsUnlocked = requestedLessonIndex >= 0 && canOpenMasteryLevel({
        isAdmin: user.role === "admin",
        lessonIndex: requestedLessonIndex,
        lessonCompleted: completedForRequestedPath.has(route.lessonId),
        previousLessonCompleted: requestedLessonIndex > 0
          && completedForRequestedPath.has(requestedLessons[requestedLessonIndex - 1].id),
      });
      if (requestedLessonIndex < 0 || !lessonIsUnlocked) {
        navigate({
          navigation: "paths",
          subjectId: requestedPath.subjectId,
          pathId: requestedPath.id,
        }, { replace: true, scroll: false });
        return;
      }
    }
    if (subjectId !== requestedPath.subjectId) {
      navigate({ ...route, subjectId: requestedPath.subjectId }, { replace: true, scroll: false });
    }
  }, [availablePaths, completedLessonsByPath, level.id, navigate, progressLoading, route, selectedReference, subject.id, subjectId, user.role]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDialog(null);
        if (route.lessonId && route.pathId) {
          navigate({
            navigation: "paths",
            subjectId: subject.id,
            pathId: route.pathId,
          }, { replace: true, scroll: false });
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate, route.lessonId, route.pathId, subject.id]);

  if (bundleNavigationError) throw bundleNavigationError;
  if (progressLoading || bundleNavigationLoading || homeSubjectChanging) {
    return <main className="session-loading" role="status"><span className="session-loading-mark" />Synchronisation de ta progression…</main>;
  }

  return (
    <div className="app-shell" data-page={activeNavigation} style={{ "--subject-accent": subject.theme.accent, "--subject-accent-soft": subject.theme.accentSoft } as React.CSSProperties}>
      <Sidebar activeItem={activeNavigation} onNavigate={handleNavigate} canAccessAdmin={user.role === "admin"} unreadMessages={unreadMessages} />
      {activeNavigation === "home" && <MobileHeader unreadMessages={unreadMessages} onOpenMessages={() => handleNavigate("messages")} onOpenAdmin={user.role === "admin" ? () => handleNavigate("admin") : undefined} />}

      <Suspense fallback={<main className="admin-loading" role="status">Chargement de ton espace…</main>}>
        {activeNavigation === "admin" ? (
          <AdminScreen
            preview={isAdminContentPreview}
            activeSection={route.adminSection ?? "overview"}
            contentStudioOpen={Boolean(route.adminStudio)}
            onNavigate={(adminSection, adminStudio = false) => navigate({
              navigation: "admin",
              subjectId: subject.id,
              adminSection,
              adminStudio,
            })}
            onOpenLesson={(pathId, lessonId) => {
              const targetPath = availablePaths.find((path) => path.id === pathId)
                ?? baseLearningPaths.find((path) => path.id === pathId);
              navigate({
                navigation: "paths",
                subjectId: targetPath?.subjectId ?? subject.id,
                pathId,
                lessonId,
              });
            }}
          />
      ) : activeNavigation === "space" && route.spaceSection === "results" ? (
        <LearnerResultsScreen
          level={level}
          progressByPath={progressByPath}
          progressError={progressError?.message ?? null}
          onRetryProgress={retryProgress}
          onBack={() => handleNavigate("space")}
          onOpenCourse={(pathId, lessonId, targetSubjectId) => navigate({ navigation: "paths", pathId, lessonId, subjectId: targetSubjectId })}
          onOpenHomeworks={canAccessHomeworks(user) ? () => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "homework" }) : undefined}
          onOpenExams={canAccessBacExams(user) ? () => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "bac" }) : undefined}
        />
      ) : activeNavigation === "space" ? (
        <PersonalSpaceScreen
          profile={profile}
          level={level}
          roleLabel={user.role === "admin" ? "Administrateur" : user.accountType === "teacher" ? "Enseignant" : user.accountType === "parent" ? "Parent" : "Élève"}
          unreadMessages={unreadMessages}
          goldBalance={store.loading || store.syncError ? null : store.wallet.goldBalance}
          isAdmin={user.role === "admin"}
          onNavigate={handleNavigate}
          onOpenResults={() => navigate({ navigation: "space", subjectId: subject.id, spaceSection: "results" })}
          onReplayTour={() => setTourReplayKey(current => current + 1)}
        />
      ) : activeNavigation === "profile" ? (
        <ProfileScreen
          profile={profile}
          currentLevel={level}
          onBackHome={() => handleNavigate("space")}
          backLabel="Mon espace"
          email={user.email}
          roleLabel={user.role === "admin" ? "Administrateur" : user.accountType === "teacher" ? "Enseignant" : user.accountType === "parent" ? "Parent" : "Élève"}
          onLogout={() => void logout()}
          onReplayDavyTour={() => setTourReplayKey((current) => current + 1)}
          onOpenSupport={() => window.location.assign("/soutenir")}
          onProfileUpdated={updateUser}
        />
      ) : activeNavigation === "ranking" ? (
        <RankingScreen profile={profile} level={level} totalXp={totalXp} localOnly={isPathPreview} />
      ) : activeNavigation === "arena" ? (
        <ArenaScreen
          userId={user.id}
          philoMemoryOpen={route.arenaMode === "philo-memory"}
          frenchWorkshopOpen={route.arenaMode === "french-workshop"}
          frenchSection={route.frenchSection}
          onOpenFrenchWorkshop={() => navigate({ navigation: "arena", subjectId: "french", arenaMode: "french-workshop" })}
          onFrenchSectionChange={frenchSection => navigate({ navigation: "arena", subjectId: "french", arenaMode: "french-workshop", ...(frenchSection === "figures" || frenchSection === "argumentation" ? { frenchSection } : {}) }, { scroll: false })}
          philoNotion={route.philoNotion}
          onOpenPhiloMemory={() => navigate({ navigation: "arena", subjectId: "philosophy", arenaMode: "philo-memory" })}
          onPhiloNotionChange={philoNotion => navigate({ navigation: "arena", subjectId: "philosophy", arenaMode: "philo-memory", philoNotion }, { scroll: false })}
          onReviewPhiloCourse={pathId => navigate({ navigation: "paths", subjectId: "philosophy", ...(availablePaths.some(path => path.id === pathId) ? { pathId } : {}) })}
          exerciseSelection={route.exerciseSelection}
          exerciseView={route.exerciseView}
          onChooseExerciseSubject={subjectId => navigate({ navigation: "arena", subjectId, arenaMode: "exercises", exerciseView: "lessons" })}
          onOpenExerciseLesson={(subjectId, lessonKey) => navigate({ navigation: "arena", subjectId, arenaMode: "exercises", exerciseSelection: { lessonKey, category: "fixation" } })}
          onBackExerciseSubjects={() => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "exercises" })}
          onExerciseSelection={selection => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "exercises", arenaEditor: route.arenaEditor, exerciseSelection: selection })}
          onReviewExerciseCourse={(pathId, topicId) => navigate({ navigation: "paths", subjectId: subject.id, pathId, lessonId: topicId })}
          profile={profile}
          level={level}
          subject={subject}
          subjects={subjectOptions}
          totalXp={totalXp}
          role={user.role}
          homeworkAvailable={canAccessHomeworks(user)}
          exercisesOpen={route.arenaMode === "exercises"}
          codexOpen={route.arenaMode === "codex"}
          homeworkOpen={route.arenaMode === "homework"}
          homeworkRef={route.homeworkRef}
          duelOpen={route.arenaMode === "duel"}
          bacExamOpen={route.arenaMode === "bac"}
          bacExamSlug={route.bacExamSlug}
          examCollection={route.examCollection}
          bacArchiveYear={route.bacArchiveYear}
          bacArchivePaper={route.bacArchivePaper}
          onBacArchiveSelection={(bacArchiveYear, bacArchivePaper) => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "bac", examCollection: "bac", bacArchiveYear, bacArchivePaper })}
          onExamCollectionChange={examCollection => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "bac", examCollection }, { scroll: false })}
          bacResultsOpen={Boolean(route.bacResults)}
          exerciseEditorOpen={Boolean(route.arenaEditor)}
          localOnly={localPreview}
          onSubjectChange={handleSubjectChange}
          onBackHome={() => handleNavigate("home")}
          onOpenExercises={() => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "exercises" })}
          onOpenCodex={() => navigate({ navigation: "arena", subjectId: "mathematics", arenaMode: "codex" })}
          onOpenHomeworks={() => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "homework" })}
          onSelectHomework={(homeworkRef: string) => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "homework", homeworkRef })}
          onOpenDuel={() => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "duel" })}
          onOpenBacExam={() => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "bac" })}
          onSelectBacExam={(slug: BacExamSlug) => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "bac", bacExamSlug: slug })}
          onOpenBacResults={() => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "bac", bacExamSlug: route.bacExamSlug ?? "2024", bacResults: true })}
          onBackBacExam={() => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "bac", bacExamSlug: route.bacExamSlug ?? "2024" })}
          onBackArena={() => navigate({ navigation: "arena", subjectId: subject.id })}
          onOpenExerciseEditor={() => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "exercises", arenaEditor: true })}
          onCloseExerciseEditor={() => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "exercises" })}
        />
      ) : activeNavigation === "store" ? (
        <StoreScreen profile={profile} level={level} store={store} />
      ) : activeNavigation === "messages" ? (
        <MessagesScreen key={level.id} profile={profile} level={level} />
      ) : activeNavigation === "paths" && selectedReference ? (
        <CourseReferenceScreen
          key={selectedReference.id}
          reference={selectedReference}
          level={level}
          subject={subjects[selectedReference.subjectId]}
          currentUser={{ id: user.id, name: profile.name, photoUrl: profile.photoUrl, role: user.role }}
          localOnly={localPreview}
          tab={route.courseTab ?? "summary"}
          onTabChange={courseTab => navigate({ navigation: "paths", subjectId: selectedReference.subjectId, pathId: selectedReference.id, mathDomain: "analyse", courseTab }, { scroll: false })}
          onBackToLibrary={() => navigate({ navigation: "paths", subjectId: selectedReference.subjectId, libraryView: "lessons", mathDomain: "analyse" })}
        />
      ) : activeNavigation === "paths" && selectedPath ? (
        <ContinuousCourseScreen
          path={selectedPath}
          level={level}
          subject={subjects[selectedPath.subjectId]}
          currentUser={{
            id: user.id,
            name: profile.name,
            photoUrl: profile.photoUrl,
            role: user.role,
          }}
          localOnly={localPreview}
          focusedSectionId={activeLessonId ?? undefined}
          documentTab={route.courseTab ?? "summary"}
          onDocumentTabChange={(courseTab) => navigate({ navigation: "paths", subjectId: selectedPath.subjectId, pathId: selectedPath.id, courseTab, mathDomain: route.mathDomain }, { scroll: false })}
          onBackToLibrary={() => navigate({ navigation: "paths", subjectId: selectedPath.subjectId, libraryView: "lessons", mathDomain: route.mathDomain ?? mathDomainForLesson(curriculumLessonTitles.find(lesson => lesson.pathId === selectedPath.id && lesson.levelId === level.id) ?? selectedPath) })}
        />
      ) : activeNavigation === "paths" && route.libraryView !== "lessons" ? (
        <SubjectLibraryScreen
          level={level}
          subjects={subjectOptions}
          paths={availablePaths}
          catalogLessons={curriculumLessonTitles}
          references={courseLibraryReferences}
          onChooseSubject={handleSubjectChange}
          onOpenCourse={course => navigate({ navigation: "paths", subjectId: course.subjectId, pathId: course.id, ...(course.subjectId === "mathematics" ? { mathDomain: mathDomainForLesson(course) ?? "analyse" } : {}) })}
          onBackHome={() => handleNavigate("home")}
        />
      ) : activeNavigation === "paths" ? (
        <LearningLibraryScreen
          level={level}
          subjects={subjectOptions}
          selectedSubjectId={subject.id}
          paths={availablePaths}
          catalogLessons={curriculumLessonTitles}
          references={courseLibraryReferences}
          onSelectReference={pathId => navigate({ navigation: "paths", subjectId: "mathematics", pathId, mathDomain: "analyse" })}
          mathDomain={route.mathDomain ?? "analyse"}
          onMathDomainChange={(mathDomain) => navigate({ navigation: "paths", subjectId: "mathematics", libraryView: "lessons", mathDomain }, { scroll: false })}
          onSubjectChange={handleSubjectChange}
          onSelectPath={(pathId) => {
            const path = availablePaths.find((item) => item.id === pathId);
            if (path) navigate({ navigation: "paths", subjectId: path.subjectId, pathId: path.id, ...(path.subjectId === "mathematics" ? { mathDomain: route.mathDomain ?? "analyse" } : {}) });
          }}
          onBackHome={() => handleNavigate("home")}
          onBackSubjects={() => navigate({ navigation: "paths", subjectId: subject.id, mathDomain: route.mathDomain })}
        />
      ) : !activePath ? (
        <LevelEmptyState
          mode="home"
          homeStyle={showDocumentHome ? "document" : undefined}
          profile={profile}
          level={level}
          subject={subject}
          subjects={subjectOptions}
          onSubjectChange={handleSubjectChange}
          onOpenProfile={() => handleNavigate("profile")}
          onBackHome={() => handleNavigate("home")}
          userId={user.id}
          visitKey={homeVisitKey}
          onOpenSpace={() => handleNavigate("space")}
          onOpenCourses={() => handleNavigate("paths")}
          syncIssue={dashboardSyncIssue}
        />
      ) : showDocumentHome ? (
        <DocumentDashboard
          content={dashboardContent}
          progress={progressError ? null : pathLessons.length ? 100 * pathLessons.filter(lesson => completedLessonIds.has(lesson.id)).length / pathLessons.length : 0}
          level={level}
          subject={subject}
          subjects={subjectOptions}
          courseViews={homeCourseViews(activePath, level.id)}
          onSubjectChange={handleSubjectChange}
          onResumeLesson={() => dashboardPath && navigate({ navigation: "paths", subjectId: dashboardPath.subjectId, pathId: dashboardPath.id })}
          onOpenCourseView={courseTab => dashboardPath && navigate({ navigation: "paths", subjectId: dashboardPath.subjectId, pathId: dashboardPath.id, courseTab })}
          onAskHint={() => setOpenDialog("tutor")}
          onOpenGoal={() => handleNavigate("paths")}
          onOpenArena={() => handleNavigate("arena")}
          onOpenSpace={() => handleNavigate("space")}
          syncIssue={dashboardSyncIssue}
        />
      ) : showHistoricalHome ? (
        <HistoricalDashboard
          content={dashboardContent}
          progress={pathLessons.length ? 100 * pathLessons.filter(lesson => completedLessonIds.has(lesson.id)).length / pathLessons.length : 0}
          level={level}
          subject={subject}
          subjects={subjectOptions}
          onSubjectChange={handleSubjectChange}
          onResumeLesson={() => dashboardPath && navigate({ navigation: "paths", subjectId: dashboardPath.subjectId, pathId: dashboardPath.id })}
          onAskHint={() => setOpenDialog("tutor")}
          onOpenGoal={() => handleNavigate("paths")}
          onOpenArena={() => handleNavigate("arena")}
          syncIssue={dashboardSyncIssue}
        />
      ) : showOriginalHome ? (
        <OriginalDashboard
          content={dashboardContent}
          level={level}
          subject={subject}
          subjects={subjectOptions}
          onSubjectChange={handleSubjectChange}
          onResumeLesson={() => dashboardPath && navigate({ navigation: "paths", subjectId: dashboardPath.subjectId, pathId: dashboardPath.id })}
          onOpenCourses={() => handleNavigate("paths")}
          onOpenExercises={() => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "exercises" })}
          onOpenHomeworks={canAccessHomeworks(user) ? () => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "homework" }) : undefined}
          onOpenExams={canAccessBacExams(user) ? () => navigate({ navigation: "arena", subjectId: subject.id, arenaMode: "bac" }) : undefined}
          onOpenResults={() => navigate({ navigation: "space", subjectId: subject.id, spaceSection: "results" })}
          onOpenMessages={() => handleNavigate("messages")}
          onOpenSupport={() => window.location.assign("/soutenir")}
          onOpenSpace={() => handleNavigate("space")}
          unreadMessages={unreadMessages}
          syncIssue={dashboardSyncIssue}
        />
      ) : (
        <Dashboard
          userId={user.id}
          visitKey={homeVisitKey}
          content={dashboardContent}
          onResumeLesson={() => dashboardPath && navigate({ navigation: "paths", subjectId: dashboardPath.subjectId, pathId: dashboardPath.id })}
          onOpenCourses={() => handleNavigate("paths")}
          onOpenSpace={() => handleNavigate("space")}
          syncIssue={dashboardSyncIssue}
        />
        )}
      </Suspense>

      {!isFocusedHomework && (
        <MobileNavigation activeItem={activeNavigation} onNavigate={handleNavigate} unreadMessages={unreadMessages} />
      )}

      {activeNavigation !== "admin" && !isFocusedHomework && (
        <CompanionGuide
          learnerName={profile.name}
          level={level}
          activeNavigation={activeNavigation}
          currentLessonTitle={activePath?.title}
          activeLessonTitle={activeLesson?.title}
          hasActivePath={Boolean(activePath)}
          celebrationKey={completedLessonIds.size}
          onNavigate={handleNavigate}
          onResumeLesson={openPathCourse}
          onAskHint={() => setOpenDialog("tutor")}
        />
      )}

      {activeNavigation !== "admin" && !isFocusedHomework && (
        <FirstVisitTour
          userId={user.id}
          learnerName={profile.name}
          replayKey={tourReplayKey}
          forceOpen={forceDavyTourPreview}
        />
      )}

      {openDialog === "tutor" && (
        <TutorPanel
          lessonTitle={activeLesson?.title ?? currentLesson?.title}
          onClose={() => setOpenDialog(null)}
        />
      )}
      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}
