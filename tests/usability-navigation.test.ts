import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { primaryNavigationFor, primaryNavigationItems } from "../apps/web/src/config/navigation";
import type { NavigationId } from "../apps/web/src/domain/learning";
import type { LearningLesson, LearningPath } from "../apps/web/src/domain/paths";
import type { ProgressLesson } from "../apps/web/src/features/progress/useLearningProgress";
import { recordedCourseResults } from "../apps/web/src/features/profile/resultsModel";
import { appRouteUrl, readAppRoute } from "../apps/web/src/routing/appRoute";

const source = (relative: string) => readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

test("le bandeau de marque est réservé à l'accueil sans retirer les menus intérieurs", () => {
  const shell=source("apps/web/src/LearningApp.tsx");
  const sidebar=source("apps/web/src/features/navigation/Sidebar.tsx");
  assert.match(shell,/activeNavigation === "home" && <MobileHeader/);
  assert.match(shell,/data-page=\{activeNavigation\}/);
  assert.match(sidebar,/activeItem === "home" && <div className="brand-lockup"/);
  assert.match(sidebar,/primaryNavigationItems\.map\(renderNavigationItem\)/);
  assert.match(source("apps/web/src/features/profile/PersonalSpaceScreen.tsx"),/onNavigate\("messages"\)/);
  assert.match(source("apps/web/src/features/profile/PersonalSpaceScreen.tsx"),/isAdmin &&/);
  const css=source("apps/web/src/styles/interface-chrome.css");
  assert.match(css,/--mobile-header-offset: 0px/);
  assert.match(css,/\.messages-page \{[^}]*height: calc\(100dvh - var\(--mobile-header-offset\)\)/);
  assert.match(css,/\.document-tabs[^}]*top: var\(--mobile-header-offset\)/);
});

test("les écrans retirent les commentaires d'interface sans retirer les consignes et avertissements utiles", () => {
  const files=["features/arena/exercises/ExerciseLibrary.tsx","features/arena/ArenaExercisesPage.tsx","features/arena/TrainingHub.tsx","features/paths/LearningLibraryScreen.tsx","features/lesson/ContinuousCourseScreen.tsx","features/lesson/document/LessonDocumentScreen.tsx","features/lesson/document/DocumentEvaluation.tsx","features/profile/PersonalSpaceScreen.tsx","features/arena/BacExamLibraryPage.tsx","features/arena/homework/HomeworkLibraryPage.tsx","features/community/GlobalChatPanel.tsx"];
  const ui=files.map(file=>source(`apps/web/src/${file}`)).join("\n");
  for(const text of ["Tous les exercices sont affichés ci-dessous","Chaque bouton vert","Les exercices sont affichés directement","Choisis une rubrique pour ouvrir sa page","Choisis une matière, puis la leçon","Le résumé pour comprendre.","La correction détaillée apparaît sous chaque question","Lis le cours, explore les exemples","Davy te conseille","Je garde ta copie.","Un bonjour, une question ou une astuce suffit pour commencer."])assert.ok(!ui.includes(text),text);
  const player=source("apps/web/src/features/arena/exercises/ExercisePlayer.tsx");
  assert.match(player,/Rédaction non notée automatiquement/);
  assert.match(player,/Enregistrement local indisponible/);
  assert.match(player,/Voir la correction/);
  assert.doesNotMatch(source("apps/web/src/features/dashboard/Dashboard.tsx"),/Excellence Lycée est en construction|home-construction/);
  assert.doesNotMatch(source("apps/web/src/features/admin/AdminScreen.tsx"),/Pilote les contenus, les utilisateurs/);
});

test("la navigation principale contient exactement quatre destinations explicites", () => {
  assert.deepEqual(primaryNavigationItems.map(({ id, label }) => ({ id, label })), [
    { id: "home", label: "Accueil" },
    { id: "paths", label: "Mes cours" },
    { id: "arena", label: "M’entraîner" },
    { id: "space", label: "Mon espace" },
  ]);
});

test("les services secondaires restent rattachés à Mon espace sans transformer leurs routes", () => {
  for (const id of ["profile", "messages", "ranking", "store"] satisfies NavigationId[]) {
    assert.equal(primaryNavigationFor(id), "space");
  }
  for (const id of ["home", "paths", "arena", "space", "admin"] satisfies NavigationId[]) {
    assert.equal(primaryNavigationFor(id), id);
  }
  for (const [pathname, navigation] of [
    ["/profil", "profile"], ["/messages", "messages"], ["/classement", "ranking"], ["/boutique", "store"],
  ] as const) {
    const route = readAppRoute({ pathname, search: "?matiere=svt" }, { navigation: "home" });
    assert.equal(route.navigation, navigation);
    assert.equal(appRouteUrl(route, ""), `${pathname}?matiere=svt`);
  }
});

test("l'espace personnel et ses résultats ont des liens stables après F5", () => {
  for (const pathname of ["/mon-espace", "/mon-espace/resultats"]) {
    const route = readAppRoute({ pathname, search: "?matiere=mathematics" }, { navigation: "home" });
    assert.equal(route.navigation, "space");
    assert.equal(route.spaceSection, pathname.endsWith("resultats") ? "results" : undefined);
    assert.equal(appRouteUrl(route, ""), `${pathname}?matiere=mathematics`);
    assert.equal(appRouteUrl(route, "?__paths-preview=1&__level-preview=terminale-c"), `${pathname}?__paths-preview=1&__level-preview=terminale-c&matiere=mathematics`);
  }
});

test("les anciennes adresses de cours, parties et entraînements restent inchangées", () => {
  for (const pathname of [
    "/parcours", "/parcours/cours-a", "/parcours/cours-a/niveaux/partie-1",
    "/arene", "/arene/exercices", "/arene/exercices/editeur", "/arene/codex", "/arene/duel",
    "/arene/devoirs", "/arene/devoirs/devoir-a", "/arene/exos-types-bac", "/arene/exos-types-bac/2024/resultats",
  ]) {
    const route = readAppRoute({ pathname, search: "?matiere=mathematics" }, { navigation: "home" });
    assert.equal(appRouteUrl(route, ""), `${pathname}?matiere=mathematics`);
  }
});

const lesson: LearningLesson = {
  id: "partie-1", title: "Première partie", summary: "Cours de contrôle", durationMinutes: 10, xp: 10_000, kind: "concept",
  concept: { eyebrow: "Comprendre", title: "Définition", explanation: "Une définition.", notation: "x", example: "Un exemple." },
  interaction: { kind: "timeline", eyebrow: "Observer", title: "Étapes", instruction: "Choisis une étape.", observation: "Un repère.", items: [{ label: "A", detail: "Première" }, { label: "B", detail: "Deuxième" }] },
  method: { eyebrow: "Méthode", title: "Appliquer", introduction: "Deux étapes.", steps: ["Lire", "Répondre"], example: { prompt: "Question", work: "Calcul", result: "Réponse" } },
  question: { prompt: "Choisis", options: ["A", "B"], correctIndex: 0, explanation: "A convient." },
};

function makePath(id: string, levelId = "terminale-c"): LearningPath {
  return { id, title: `Cours ${id}`, subjectId: "mathematics", levelIds: [levelId], curriculumLabel: "Contrôle", curriculumSourceUrl: "https://example.test/programme", theme: { number: 1, title: "Thème" }, chapterNumber: 1, description: "Cours de contrôle.", estimatedMinutes: 10, outcomes: ["Comprendre"], modules: [{ id: "module", title: "Cours", description: "Partie", lessons: [lesson] }] };
}

function makeProgress(pathId: string, overrides: Partial<ProgressLesson> = {}): ProgressLesson {
  return { pathId, lessonId: lesson.id, xpAwarded: 0, bestScore: 8, attemptCount: 1, completedAt: "2026-10-17T08:00:00Z", ...overrides };
}

test("les résultats n'inventent aucune note et excluent autre classe, partie inconnue et tentative absente", () => {
  const paths = [makePath("travaille"), makePath("jamais-ouvert"), makePath("autre-classe", "seconde-c")];
  const attempt = makeProgress("travaille", { bestScore: 12.5, attemptCount: 3 });
  const results = recordedCourseResults(paths, {
    travaille: { valide: attempt, inconnu: makeProgress("travaille", { lessonId: "supprime" }) },
    "jamais-ouvert": { vide: makeProgress("jamais-ouvert", { attemptCount: 0 }) },
    "autre-classe": { valide: makeProgress("autre-classe", { bestScore: 20 }) },
  }, "terminale-c");
  assert.equal(results.length, 1);
  assert.equal(results[0].bestScore, 12.5);
  assert.equal(results[0].attemptCount, 3);
  assert.equal(results[0].pathTitle, "Cours travaille");
  assert.equal(results[0].lessonTitle, lesson.title);
  assert.deepEqual(attempt, makeProgress("travaille", { bestScore: 12.5, attemptCount: 3 }));
});

test("l'historique est trié par date réelle et une absence reste un historique vide", () => {
  const paths = [makePath("ancien"), makePath("recent")];
  const results = recordedCourseResults(paths, {
    ancien: { partie: makeProgress("ancien", { completedAt: "2026-10-16T08:00:00Z" }) },
    recent: { partie: makeProgress("recent") },
  }, "terminale-c");
  assert.deepEqual(results.map(result => result.pathId), ["recent", "ancien"]);
  assert.deepEqual(recordedCourseResults(paths, {}, "terminale-c"), []);
});
