import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";
import { initialDashboard, schoolLevels, subjects } from "../apps/web/src/data/programme";
import { canAccessBacExams, canAccessHomeworks } from "../apps/web/src/routing/routeAccess";
import { primaryNavigationItems } from "../apps/web/src/config/navigation";
import type { AuthUser, AccountType } from "../apps/web/src/domain/auth";

const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const React = require("react");
(globalThis as { React?: unknown }).React = React;
require.extensions[".css"] = () => {};
const { renderToStaticMarkup } = require("react-dom/server");
const { HomeActionGrid } = require("./src/features/dashboard/HomeActionGrid");
const { Dashboard } = require("./src/features/dashboard/Dashboard");
const { LevelEmptyState } = require("./src/features/dashboard/LevelEmptyState");
const source = (file: string) => readFileSync(new URL("../apps/web/src/" + file, import.meta.url), "utf8");
const action = () => {};
const baseActions = {
  onOpenCourses: action, onOpenExercises: action, onOpenResults: action, onOpenMessages: action,
  onOpenSupport: action,
};
const allActions = { ...baseActions, onOpenHomeworks: action, onOpenExams: action };
const render = (component: unknown, props: Record<string, unknown>) => renderToStaticMarkup(React.createElement(component, props));
const ids = (html: string) => [...html.matchAll(/data-home-card="([^"]+)"/g)].map(match => match[1]);

test("le composant archivé du prototype garde ses sept destinations sans vidéo fictive", () => {
  const html = render(HomeActionGrid, allActions);
  assert.deepEqual(ids(html), ["courses", "exercises", "homeworks", "exams", "results", "messages", "support"]);
  assert.equal((html.match(/<button/g) ?? []).length, 7);
  for (const label of ["Cours", "Exercices", "Devoirs", "Sujets d’examen", "Mes résultats", "Messages", "Offrir un café"]) {
    assert.ok(html.includes(`aria-label="${label}"`));
  }
  assert.doesNotMatch(html, /Vidéo|Quiz|Flashcard|javascript:|<a|<img/);
  assert.equal((html.match(/aria-describedby=/g) ?? []).length, 7);
  assert.match(html, /aria-label="Accès rapides"/);
});

test("les cartes réservées n’existent pas sans les actions autorisées", () => {
  assert.deepEqual(ids(render(HomeActionGrid, baseActions)), ["courses", "exercises", "results", "messages", "support"]);
  assert.deepEqual(ids(render(HomeActionGrid, { ...baseActions, onOpenHomeworks: action })), ["courses", "exercises", "homeworks", "results", "messages", "support"]);
  assert.deepEqual(ids(render(HomeActionGrid, { ...baseActions, onOpenExams: action })), ["courses", "exercises", "exams", "results", "messages", "support"]);
});

test("la reprise rejoint la grille sans inventer de dernier cours ni afficher du LaTeX brut", () => {
  assert.ok(!ids(render(HomeActionGrid, allActions)).includes("resume"));
  const html = render(HomeActionGrid, { ...allActions, resume: { label: "Là où tu en étais", title: String.raw`Limites en $+\infty$`, onOpen: action } });
  assert.deepEqual(ids(html), ["resume", "courses", "exercises", "homeworks", "exams", "results", "messages", "support"]);
  assert.match(html, /aria-label="Là où tu en étais"/);
  assert.match(html, /katex/);
  assert.doesNotMatch(html, /katex-error|\$|home-resume-card/);
});

test("toutes les classes et audiences suivent les gardes Devoirs/BAC existantes", () => {
  for (const schoolLevel of schoolLevels) for (const accountType of ["student", "parent", "teacher"] satisfies AccountType[]) {
    const user = {
      id: "test", email: "test@example.test", name: "Test", emailVerified: true,
      levelId: schoolLevel.id, accountType, role: accountType === "teacher" ? "teacher" : "student",
    } satisfies AuthUser;
    const actual = ids(render(HomeActionGrid, {
      ...baseActions,
      onOpenHomeworks: canAccessHomeworks(user) ? action : undefined,
      onOpenExams: canAccessBacExams(user) ? action : undefined,
    }));
    assert.equal(actual.includes("homeworks"), accountType === "student");
    assert.equal(actual.includes("exams"), schoolLevel.stage === "terminale");
    assert.ok(actual.includes("messages"));
  }
  const shell = source("LearningApp.tsx");
  assert.match(shell, /onOpenHomeworks=\{canAccessHomeworks\(user\) \?/);
  assert.match(shell, /onOpenExams=\{canAccessBacExams\(user\) \?/);
  assert.match(shell, /onOpenMessages=\{\(\) => handleNavigate\("messages"\)\}/);
  assert.doesNotMatch(source("features/dashboard/Dashboard.tsx"), /HomeActionGrid/);
});

test("Messages garde le vrai compteur non lu, borné visuellement et explicite au lecteur d’écran", () => {
  const unread = render(HomeActionGrid, { ...allActions, unreadMessages: 124 });
  assert.match(unread, /Messages, 124 messages non lus/);
  assert.match(unread, /home-action-card-badge[^>]*>99\+</);
  assert.match(render(HomeActionGrid, { ...allActions, unreadMessages: 1 }), /Messages, 1 message non lu/);
  for (const value of [0, -5, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.doesNotMatch(render(HomeActionGrid, { ...allActions, unreadMessages: value }), /home-action-card-badge/);
  }
});

test("l’accueil simplifié conserve reprise et pannes sans grille ni contexte visible", () => {
  const dashboard = source("features/dashboard/Dashboard.tsx");
  assert.doesNotMatch(dashboard, /\{level.label\}|Matière du cours à reprendre|HomeActionGrid/);
  assert.match(source("features/dashboard/HomeWelcome.tsx"), /Ouvrir mon espace personnel/);
  assert.match(dashboard, /<HomeSyncNotice issue=\{syncIssue\}/);
  assert.doesNotMatch(dashboard, /Excellence Lycée est en construction|home-construction|home-about/);
  assert.match(dashboard, /content.lesson.eyebrow/);
  assert.match(dashboard, /home-resume-card/);
  const level = schoolLevels.find(item => item.id === "terminale-c")!;
  for (const eyebrow of ["Là où tu en étais", "Pour commencer"]) {
    const html = render(Dashboard, {
      ...allActions, userId: "render-home", content: { ...initialDashboard, lesson: { ...initialDashboard.lesson, eyebrow, title: "L’ONU" } },
      level, subject: subjects["history-geography"], subjects: [subjects["history-geography"]],
      onSubjectChange: action, onResumeLesson: action, onOpenSpace: action,
      syncIssue: { message: "Synchronisation interrompue.", onRetry: action },
    });
    assert.equal(ids(html).length, 0);
    assert.match(html, /L’ONU/);
    assert.match(html, new RegExp(eyebrow));
    assert.match(html, /Synchronisation interrompue/);
    assert.match(html, /Bienvenue, Aïcha !/);
    assert.match(html, /Astuce à retenir/);
    assert.match(html, /Choisir un autre cours/);
    assert.match(html, /Réessayer/);
    assert.doesNotMatch(html, /Offrir un café|<select|Niveau et série|Bonjour/);
    assert.doesNotMatch(html, /platform-stats|support-entry-card/);
    assert.doesNotMatch(html, /est en construction|home-construction|home-about/);
  }
});

test("les compteurs et leur requête publique disparaissent de tous les accueils sans toucher au référentiel", () => {
  const home = source("features/dashboard/Dashboard.tsx") + source("features/dashboard/LevelEmptyState.tsx") + source("LearningApp.tsx");
  assert.doesNotMatch(home, /PlatformStats|usePlatformStats|platformStats/);
  assert.match(source("data/learningPathMetrics.ts"), /AVAILABLE_EXERCISES = 10_326/);
});

test("un accueil sans cours ne recrée ni grille ni reprise de Terminale inventée", () => {
  const empty = source("features/dashboard/LevelEmptyState.tsx");
  assert.match(empty, /if \(mode === "home"\) return <HomeWelcome/);
  assert.doesNotMatch(empty, /HomeActionGrid/);
  assert.match(empty, /Les parcours de \{level.label\} sont en préparation/);
  assert.doesNotMatch(empty, /Terminale|Sujets d’examen/);
  const level = schoolLevels.find(item => item.id === "premiere-a")!;
  const html = render(LevelEmptyState, { mode: "home", profile: { name: "Test", levelId: level.id }, level,
    subject: subjects.mathematics, subjects: [subjects.mathematics], onSubjectChange: action,
    onOpenProfile: action, onBackHome: action, homeActions: baseActions });
  assert.deepEqual(ids(html), []);
  assert.match(html, /Aucun cours disponible pour le moment/);
  assert.doesNotMatch(html, /<select|Niveau et série|Bonjour|home-resume-card/);
  assert.doesNotMatch(html, /platform-stats|data-home-card="resume"/);
});

test("la grille reste mobile, accessible et compatible avec les animations réduites", () => {
  const css = source("styles/home-cards.css");
  assert.match(css, /repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /animation: none; transition: none/);
  assert.match(css, /hover: hover/);
  assert.match(css, /font-size: 16px/);
  assert.match(css, /min-height: 128px/);
  assert.ok(source("styles.css").indexOf("styles/home-cards.css") > source("styles.css").indexOf("styles/usability.css"));
  assert.match(source("features/dashboard/HomeActionGrid.tsx"), /type="button"/);
});

test("les cartes ne recréent ni navigation, ni compteur, ni accès administratif", () => {
  assert.deepEqual(primaryNavigationItems.map(item => item.id), ["home", "paths", "arena", "space"]);
  const component = source("features/dashboard/HomeActionGrid.tsx");
  assert.doesNotMatch(component, /localStorage|fetch\(|apiRequest|submitAttempt|xpAwarded|admin|Vidéo|Flashcard/);
  assert.match(component, /onClick=\{onOpen\}/);
  assert.doesNotMatch(source("LearningApp.tsx"), /homeActions=\{\{/);
  assert.match(source("LearningApp.tsx"), /navigation: previewPath \? "paths" : "home"/);
});
