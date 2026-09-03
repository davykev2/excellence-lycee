import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LearnerProfile, NavigationId, SubjectId } from "./domain/learning";
import type { LearningPath } from "./domain/paths";
import { schoolLevels, subjects, initialDashboard, isSubjectAvailableForLevel } from "./data/programme";
import { loadLearningPathsForLevel, loadLearningPathsForSubject } from "./data/learningPathLoader";
import { curriculumLessonTitles } from "./data/curriculumCatalog";
import { Sidebar } from "./features/navigation/Sidebar";
import { MobileHeader, MobileNavigation } from "./features/navigation/MobileNavigation";
import { getNextLesson, getPathLessons } from "./features/paths/pathLessons";
import { TutorPanel } from "./features/tutor/TutorPanel";
import { DetailsDialog } from "./features/details/DetailsDialog";
import { usePlatformStats } from "./features/dashboard/PlatformStats";
import {
  completedLevelsToday,
  dashboardPathPreferenceKey,
  selectDashboardPath,
  type DashboardPathPreference,
} from "./features/dashboard/dashboardLearningState";
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
  initialSubjectIdForLocation,
  levelIdForLearningPath,
  routeAllowedForUser,
} from "./routing/routeAccess";
import {
  canOpenMasteryLevel,
  MASTERY_LEVELS_REQUIRE_SEQUENCE,
} from "./config/masteryAccess";

const AdminScreen = lazy(() =>
  import("./features/admin/AdminScreen").then((module) => ({ default: module.AdminScreen })),
);
const LessonWorkspace = lazy(() =>
  import("./features/lesson/LessonWorkspace").then((module) => ({ default: module.LessonWorkspace })),
);
const MathPathScreen = lazy(() =>
  import("./features/paths/MathPathScreen").then((module) => ({ default: module.MathPathScreen })),
);
const ArenaScreen = lazy(() =>
  import("./features/arena/ArenaScreen").then((module) => ({ default: module.ArenaScreen })),
);
const Dashboard = lazy(() =>
  import("./features/dashboard/Dashboard").then((module) => ({ default: module.Dashboard })),
);
const LearningLibraryScreen = lazy(() =>
  import("./features/paths/LearningLibraryScreen").then((module) => ({ default: module.LearningLibraryScreen })),
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
const RankingScreen = lazy(() =>
  import("./features/community/RankingScreen").then((module) => ({ default: module.RankingScreen })),
);
const StoreScreen = lazy(() =>
  import("./features/store/StoreScreen").then((module) => ({ default: module.StoreScreen })),
);

type OpenDialog = "tutor" | "goal" | null;

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
          navigation: "paths",
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
  const [dashboardPathPreference, setDashboardPathPreference] = useState<DashboardPathPreference | null>(null);
  const navigationRequest = useRef(0);
  const { logout, updateUser } = useAuth();
  const localPreview = isPathPreview || isAdminContentPreview || isArenaExerciseEditorPreview || isDuelPreview || isHomeworkPreview || isBacExamPreview;
  const {
    progressByPath,
    completedLessonsByPath,
    submitAttempt,
    totalXp,
    loading: progressLoading,
    error: progressError,
    retry: retryProgress,
  } = useLearningProgress({ localOnly: localPreview });
  const store = useStoreWallet({ localOnly: localPreview, localTotalXp: totalXp });
  const availablePaths = usePublishedLessonContents(baseLearningPaths, localPreview);
  const platformStats = usePlatformStats(localPreview);
  const {
    count: unreadMessages,
    error: unreadMessagesError,
    retry: retryUnreadMessages,
  } = useUnreadMessages(localPreview);
  const profile: LearnerProfile = useMemo(() => ({ name: user.name, photoUrl: user.photoUrl, levelId: user.levelId }), [user]);
  const activeNavigation = route.navigation;
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
      prepareRoute(readAppRoute(window.location, routeFallback), setRoute);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [prepareRoute, route, routeFallback, user]);

  const routedPath = useMemo(
    () => availablePaths.find((path) => path.id === selectedPathId) ?? null,
    [availablePaths, selectedPathId],
  );
  const routeLevelId = levelIdForLearningPath(user, routedPath);
  const level = useMemo(
    () => schoolLevels.find((item) => item.id === routeLevelId) ?? schoolLevels[0],
    [routeLevelId],
  );
  const subjectOptions = useMemo(
    () => Object.values(subjects).filter((item) => isSubjectAvailableForLevel(item, level.id)),
    [level.id],
  );
  const subject = subjectOptions.find((item) => item.id === subjectId) ?? subjects.mathematics;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(dashboardPathPreferenceKey(user.id, level.id, subject.id));
      if (!stored) {
        setDashboardPathPreference(null);
        return;
      }
      const parsed = JSON.parse(stored) as Partial<DashboardPathPreference>;
      setDashboardPathPreference(
        typeof parsed.pathId === "string" && typeof parsed.openedAt === "string"
          ? { pathId: parsed.pathId, openedAt: parsed.openedAt }
          : null,
      );
    } catch {
      setDashboardPathPreference(null);
    }
  }, [level.id, subject.id, user.id]);

  const dashboardPath = useMemo(
    () => selectDashboardPath({
      paths: availablePaths,
      progressByPath,
      levelId: level.id,
      subjectId: subject.id,
      preference: dashboardPathPreference,
    }),
    [availablePaths, dashboardPathPreference, level.id, progressByPath, subject.id],
  );
  const selectedPath = routedPath && canAccessLearningPath(user, routedPath) ? routedPath : null;
  const activePath = selectedPath ?? dashboardPath;
  const completedLessonIds = activePath
    ? completedLessonsByPath[activePath.id] ?? emptyCompletedLessons
    : emptyCompletedLessons;
  const progressByLesson = activePath ? progressByPath[activePath.id] ?? {} : {};
  const pathLessons = useMemo(() => activePath ? getPathLessons(activePath) : [], [activePath]);
  const currentLesson = useMemo(
    () => activePath ? getNextLesson(activePath, completedLessonIds) ?? pathLessons[pathLessons.length - 1] : undefined,
    [activePath, completedLessonIds, pathLessons],
  );
  const progress = pathLessons.length > 0 ? Math.round((completedLessonIds.size / pathLessons.length) * 100) : 0;
  const completedToday = useMemo(() => completedLevelsToday(progressByPath), [progressByPath]);
  const activeLessonIndex = activeLessonId ? pathLessons.findIndex((lesson) => lesson.id === activeLessonId) : -1;
  const activeLesson = activeLessonIndex >= 0 ? pathLessons[activeLessonIndex] : null;
  const nextLesson = activeLessonIndex >= 0 ? pathLessons[activeLessonIndex + 1] : undefined;

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
        eyebrow: "Ton parcours :",
        title: currentLesson?.title ?? "Nouveau parcours",
        remainingMinutes: currentLesson?.durationMinutes ?? 0,
        ctaLabel: completedLessonIds.size === pathLessons.length ? "Revoir la leçon" : "Continuer le parcours",
      },
    }),
    [completedLessonIds.size, completedToday, currentLesson, pathLessons.length, profile],
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
    try {
      window.localStorage.setItem(
        dashboardPathPreferenceKey(user.id, level.id, selectedPath.subjectId),
        JSON.stringify(preference),
      );
    } catch {
      // La progression serveur reste le repli si le stockage local est indisponible.
    }
    if (selectedPath.subjectId === subject.id) setDashboardPathPreference(preference);
  }, [level.id, selectedPath, subject.id, user.id]);

  const handleNavigate = (id: NavigationId) => {
    setOpenDialog(null);
    navigate(routeForNavigation(id, subject.id));
  };

  const handleSubjectChange = (nextSubjectId: SubjectId) => {
    navigate(route.navigation === "paths"
      ? { navigation: "paths", subjectId: nextSubjectId }
      : { ...route, subjectId: nextSubjectId });
  };

  const submitLessonAttempt = (lessonId: string, scoreOutOf20: number) => {
    if (!activePath) return Promise.reject(new Error("Parcours indisponible"));
    const lessonReward = pathLessons.find((lesson) => lesson.id === lessonId)?.xp ?? 0;
    return submitAttempt(activePath.id, lessonId, scoreOutOf20, lessonReward);
  };

  const openPathLesson = (lessonId: string) => {
    if (!activePath) return;
    setOpenDialog(null);
    navigate({
      navigation: "paths",
      subjectId: activePath.subjectId,
      pathId: activePath.id,
      lessonId,
    }, { scroll: false });
  };

  useEffect(() => {
    if (subject.id !== subjectId) {
      navigate({ ...route, subjectId: subject.id }, { replace: true, scroll: false });
    }
  }, [navigate, route, subject.id, subjectId]);

  useEffect(() => {
    if (progressLoading || route.navigation !== "paths" || !route.pathId) return;
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
  }, [availablePaths, completedLessonsByPath, level.id, navigate, progressLoading, route, subject.id, subjectId, user.role]);

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
  if (progressLoading || bundleNavigationLoading) {
    return <main className="session-loading" role="status"><span className="session-loading-mark" />Synchronisation de ta progression…</main>;
  }

  return (
    <div className="app-shell" style={{ "--subject-accent": subject.theme.accent, "--subject-accent-soft": subject.theme.accentSoft } as React.CSSProperties}>
      <Sidebar activeItem={activeNavigation} onNavigate={handleNavigate} canAccessAdmin={user.role === "admin"} unreadMessages={unreadMessages} goldBalance={store.loading || store.syncError ? null : store.wallet.goldBalance} />
      <MobileHeader goldBalance={store.loading || store.syncError ? null : store.wallet.goldBalance} onOpenStore={() => handleNavigate("store")} />

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
      ) : activeNavigation === "profile" ? (
        <ProfileScreen
          profile={profile}
          currentLevel={level}
          onBackHome={() => handleNavigate("home")}
          email={user.email}
          roleLabel={user.role === "admin" ? "Administrateur" : user.accountType === "teacher" ? "Enseignant" : user.accountType === "parent" ? "Parent" : "Élève"}
          onLogout={() => void logout()}
          onReplayDavyTour={() => setTourReplayKey((current) => current + 1)}
          onProfileUpdated={updateUser}
        />
      ) : activeNavigation === "ranking" ? (
        <RankingScreen profile={profile} level={level} totalXp={totalXp} localOnly={isPathPreview} />
      ) : activeNavigation === "arena" ? (
        <ArenaScreen
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
      ) : activeNavigation === "paths" && selectedPath ? (
        <MathPathScreen
          path={selectedPath}
          level={level}
          subject={subjects[selectedPath.subjectId]}
          progressByLesson={progressByPath[selectedPath.id] ?? {}}
          completedLessonIds={completedLessonIds}
          allLessonsAccessible={user.role === "admin" || !MASTERY_LEVELS_REQUIRE_SEQUENCE}
          onOpenLesson={openPathLesson}
          onBackToLibrary={() => navigate({ navigation: "paths", subjectId: selectedPath.subjectId })}
        />
      ) : activeNavigation === "paths" ? (
        <LearningLibraryScreen
          level={level}
          subjects={subjectOptions}
          selectedSubjectId={subject.id}
          paths={availablePaths}
          catalogLessons={curriculumLessonTitles}
          onSubjectChange={handleSubjectChange}
          onSelectPath={(pathId) => {
            const path = availablePaths.find((item) => item.id === pathId);
            if (path) navigate({ navigation: "paths", subjectId: path.subjectId, pathId: path.id });
          }}
          onBackHome={() => handleNavigate("home")}
        />
      ) : !activePath ? (
        <LevelEmptyState
          mode="home"
          profile={profile}
          level={level}
          subject={subject}
          subjects={subjectOptions}
          onSubjectChange={handleSubjectChange}
          onOpenProfile={() => handleNavigate("profile")}
          onBackHome={() => handleNavigate("home")}
          stats={platformStats}
        />
      ) : (
        <Dashboard
          content={dashboardContent}
          progress={progress}
          level={level}
          subject={subject}
          subjects={subjectOptions}
          onSubjectChange={handleSubjectChange}
          onResumeLesson={() => currentLesson && openPathLesson(currentLesson.id)}
          onAskHint={() => setOpenDialog("tutor")}
          onOpenGoal={() => setOpenDialog("goal")}
          onOpenArena={() => handleNavigate("arena")}
          stats={platformStats}
          dailyGoal={dashboardContent.dailyGoal}
          syncIssue={dashboardSyncIssue}
        />
        )}
      </Suspense>

      <MobileNavigation activeItem={activeNavigation} onNavigate={handleNavigate} canAccessAdmin={user.role === "admin"} unreadMessages={unreadMessages} />

      {activeNavigation !== "admin" && (
        <CompanionGuide
          learnerName={profile.name}
          level={level}
          activeNavigation={activeNavigation}
          currentLessonTitle={currentLesson?.title}
          activeLessonTitle={activeLesson?.title}
          hasActivePath={Boolean(activePath)}
          celebrationKey={completedLessonIds.size}
          onNavigate={handleNavigate}
          onResumeLesson={() => currentLesson && openPathLesson(currentLesson.id)}
          onAskHint={() => setOpenDialog("tutor")}
        />
      )}

      {activeNavigation !== "admin" && (
        <FirstVisitTour
          userId={user.id}
          learnerName={profile.name}
          replayKey={tourReplayKey}
          forceOpen={forceDavyTourPreview}
        />
      )}

      {activeLesson && activePath && (
        <Suspense fallback={<main className="admin-loading" role="status">Chargement de la leçon…</main>}>
          <LessonWorkspace
            key={activeLesson.id}
            lesson={activeLesson}
            path={activePath}
            nextLesson={nextLesson}
            currentProgress={progressByLesson[activeLesson.id]}
            currentUser={{
              id: user.id,
              name: profile.name,
              photoUrl: profile.photoUrl,
              role: user.role,
            }}
            localOnly={localPreview}
            onClose={() => navigate({
              navigation: "paths",
              subjectId: activePath.subjectId,
              pathId: activePath.id,
            }, { replace: true, scroll: false })}
            onSubmitAttempt={submitLessonAttempt}
            onOpenNext={openPathLesson}
          />
        </Suspense>
      )}
      {openDialog === "tutor" && (
        <TutorPanel
          lessonTitle={activeLesson?.title ?? currentLesson?.title}
          onClose={() => setOpenDialog(null)}
        />
      )}
      {openDialog === "goal" && (
        <DetailsDialog content={dashboardContent} onClose={() => setOpenDialog(null)} />
      )}
      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}
