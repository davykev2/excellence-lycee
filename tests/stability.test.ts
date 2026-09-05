import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { getLessonReward, getPathRewardTotal, XP_PER_LESSON } from "../apps/api/src/curriculum.ts";
import { resolveDataProvider, resolveJwtSecret } from "../apps/api/src/config.ts";
import { storeItems } from "../apps/api/src/storeCatalog.ts";
import {
  clearLearningPathBundleCacheForTests,
  loadLearningPathsForLevel,
  loadLearningPathsForSubject,
} from "../apps/web/src/data/learningPathLoader.ts";
import { learningPaths } from "../apps/web/src/data/learningPaths.ts";
import { AVAILABLE_EXERCISES } from "../apps/web/src/data/learningPathMetrics.ts";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog.ts";
import { initialDashboard, schoolLevels, subjects } from "../apps/web/src/data/programme.ts";
import {
  buildEditorialAudits,
  editorialStatusOf,
} from "../apps/web/src/features/admin/editorialAudit.ts";
import { storeCatalog } from "../apps/web/src/data/storeCatalog.ts";
import {
  completedLevelsToday,
  selectDashboardPath,
} from "../apps/web/src/features/dashboard/dashboardLearningState.ts";
import { numericalDerivative, parseMathExpression } from "../apps/web/src/features/codex/mathEngine.ts";
import {
  canOpenMasteryLevel,
  MASTERY_LEVELS_REQUIRE_SEQUENCE,
} from "../apps/web/src/config/masteryAccess.ts";
import type { AuthUser, AccountType } from "../apps/web/src/domain/auth.ts";
import { routeAllowedForUser } from "../apps/web/src/routing/routeAccess.ts";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

test("la production exige un JWT_SECRET explicite et suffisamment long", () => {
  assert.throws(
    () => resolveJwtSecret({}, true),
    /défini explicitement en production/,
  );
  assert.throws(
    () => resolveJwtSecret({ JWT_SECRET: "trop-court" }, true),
    /au moins 32 caractères/,
  );

  const productionSecret = "production-test-secret-with-32-characters";
  assert.equal(resolveJwtSecret({ JWT_SECRET: `  ${productionSecret}  ` }, true), productionSecret);
  assert.ok(resolveJwtSecret({}, false).length >= 32, "Le repli local doit rester utilisable en développement.");
});

test("la production refuse le repli SQLite implicite", () => {
  assert.equal(resolveDataProvider({}, false), "sqlite");
  assert.throws(
    () => resolveDataProvider({ SUPABASE_URL: "https://example.supabase.co" }, false),
    /doivent être définis ensemble/,
  );
  assert.throws(
    () => resolveDataProvider({}, true),
    /configuré explicitement en production/,
  );
  assert.equal(resolveDataProvider({
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
  }, true), "supabase");
});

test("les niveaux publiés sont librement accessibles pendant la phase ouverte", () => {
  assert.equal(MASTERY_LEVELS_REQUIRE_SEQUENCE, false);
  assert.equal(canOpenMasteryLevel({
    isAdmin: false,
    lessonIndex: 8,
    lessonCompleted: false,
    previousLessonCompleted: false,
  }), true);
});

test("chaque parcours publié garde un registre XP Web/API cohérent", () => {
  const pathIds = new Set<string>();
  const levelKeys = new Set<string>();

  for (const path of learningPaths) {
    assert.equal(pathIds.has(path.id), false, `Parcours dupliqué : ${path.id}`);
    pathIds.add(path.id);

    const lessons = path.modules.flatMap((module) => module.lessons);
    assert.ok(lessons.length > 0, `Parcours vide : ${path.id}`);
    assert.equal(
      lessons.reduce((total, lesson) => total + lesson.xp, 0),
      XP_PER_LESSON,
      `Budget frontend incorrect : ${path.id}`,
    );
    assert.equal(getPathRewardTotal(path.id), XP_PER_LESSON, `Budget API incorrect : ${path.id}`);

    for (const lesson of lessons) {
      const key = `${path.id}:${lesson.id}`;
      assert.equal(levelKeys.has(key), false, `Niveau dupliqué : ${key}`);
      levelKeys.add(key);
      assert.equal(getLessonReward(path.id, lesson.id), lesson.xp, `Décalage XP Web/API : ${key}`);
    }
  }
});

test("la leçon Limites et continuité adopte le cours continu sans casser ses identifiants", () => {
  const path = learningPaths.find((item) => item.id === "terminale-c-math-l01-limits-continuity");
  assert.ok(path, "Le parcours Limites et continuité doit rester publié.");
  assert.equal(path.presentation, "continuous-course");
  assert.deepEqual(
    path.modules.flatMap((module) => module.lessons).map((lesson) => lesson.id),
    [
      "limit-composition",
      "monotone-finite-limit",
      "parabolic-branches",
      "continuous-extension",
      "continuous-image-interval",
      "continuity-operations",
      "continuous-bijection-inverse",
      "intermediate-value-theorem",
      "rational-powers",
      "complete-function-study-mission",
    ],
    "La nouvelle lecture ne doit pas invalider les progressions et retours historiques.",
  );

  const appSource = readFileSync(resolve(projectRoot, "apps/web/src/LearningApp.tsx"), "utf8");
  const librarySource = readFileSync(resolve(projectRoot, "apps/web/src/features/paths/LearningLibraryScreen.tsx"), "utf8");
  const readerSource = readFileSync(resolve(projectRoot, "apps/web/src/features/lesson/ContinuousCourseScreen.tsx"), "utf8");

  assert.match(appSource, /selectedPath\?\.presentation === "continuous-course"/);
  assert.match(appSource, /activePath\.presentation !== "continuous-course"/);
  assert.match(librarySource, /Cours complet/);
  assert.match(librarySource, /\{levelCount\} parties/);
  assert.match(readerSource, /Sommaire/);
  assert.doesNotMatch(readerSource, /J[’']ai compris|niveau suivant|Gagner[^\n]*XP|Débloquer/i);
});

test("la dissertation philosophique reste un cours continu avec des ateliers non notés", () => {
  const path = learningPaths.find((item) => item.id === "terminale-philo-l1-dissertation");
  assert.ok(path, "Le parcours Dissertation philosophique doit rester publié.");
  assert.equal(path.presentation, "continuous-course");
  assert.deepEqual(path.levelIds, ["terminale-a", "terminale-c", "terminale-d"]);

  const lessons = path.modules.flatMap((module) => module.lessons);
  assert.deepEqual(
    lessons.map((lesson) => lesson.id),
    [
      "terminale-philo-l1-dissertation-overview",
      "terminale-philo-l1-dissertation-study-subject",
      "terminale-philo-l1-dissertation-problematisation",
      "terminale-philo-l1-dissertation-introduction",
      "terminale-philo-l1-dissertation-development-conclusion",
      "terminale-philo-l1-dissertation-mission-finale",
    ],
    "Les liens profonds et progressions historiques de Philosophie L1 doivent rester stables.",
  );
  assert.deepEqual(lessons.map((lesson) => lesson.xp), [1080, 1490, 1620, 1760, 1890, 2160]);
  assert.equal(
    lessons.reduce((total, lesson) => total + lesson.questions.length, 0),
    33,
    "Les ateliers de cours ne doivent pas gonfler le compteur des exercices évaluables.",
  );

  const activities = lessons.flatMap((lesson) => lesson.courseActivities ?? []);
  assert.equal(activities.length, 8);
  assert.deepEqual(
    [...new Set(activities.map((activity) => activity.kind))].sort(),
    ["categorize", "guided-writing", "ordering"],
  );
  assert.ok(lessons.every((lesson) => lesson.source?.pages), "Chaque partie doit citer ses pages sources.");

  const readerSource = readFileSync(resolve(projectRoot, "apps/web/src/features/lesson/ContinuousCourseScreen.tsx"), "utf8");
  assert.match(readerSource, /CoursePracticePanel/);
  assert.doesNotMatch(readerSource, /J[’']ai compris|niveau suivant|Gagner[^\n]*XP|Débloquer/i);
});

test("la dissertation littéraire reste un cours continu avec des ateliers libres non notés", () => {
  const path = learningPaths.find((item) => item.id === "terminale-french-l2-literary-dissertation");
  assert.ok(path, "Le parcours Dissertation littéraire doit rester publié.");
  assert.equal(path.subjectId, "french");
  assert.equal(path.presentation, "continuous-course");
  assert.deepEqual(path.levelIds, ["terminale-a", "terminale-c", "terminale-d"]);

  const lessons = path.modules.flatMap((module) => module.lessons);
  assert.deepEqual(
    lessons.map((lesson) => lesson.id),
    [
      "terminale-french-l2-literary-dissertation-overview-barreme",
      "terminale-french-l2-literary-dissertation-analyze-subject",
      "terminale-french-l2-literary-dissertation-find-ideas",
      "terminale-french-l2-literary-dissertation-build-plan",
      "terminale-french-l2-literary-dissertation-write-introduction",
      "terminale-french-l2-literary-dissertation-write-development",
      "terminale-french-l2-literary-dissertation-write-conclusion",
      "terminale-french-l2-literary-dissertation-bac-2025-workshop",
    ],
    "Les liens profonds du premier cours continu de Français doivent rester stables.",
  );
  assert.equal(
    lessons.reduce((total, lesson) => total + lesson.questions.length, 0),
    32,
    "Les ateliers libres ne doivent pas gonfler le compteur des exercices évaluables.",
  );
  assert.equal(
    lessons.reduce((total, lesson) => total + lesson.xp, 0),
    XP_PER_LESSON,
  );

  const activities = lessons.flatMap((lesson) => lesson.courseActivities ?? []);
  assert.ok(activities.length > 0, "Le cours doit proposer au moins un atelier interactif.");
  assert.ok(
    activities.some((activity) => activity.kind === "guided-writing"),
    "Les productions écrites doivent être proposées comme ateliers guidés libres.",
  );
  const serializedActivities = JSON.stringify(activities);
  assert.doesNotMatch(
    serializedActivities,
    /"(?:points|correctIndex|acceptedAnswers|xp)"\s*:/,
    "Un atelier libre de Français ne doit embarquer ni note automatique ni XP.",
  );

  assert.ok(lessons.every((lesson) => lesson.source?.pages), "Chaque partie doit citer ses pages sources.");
  const practiceSource = readFileSync(
    resolve(projectRoot, "apps/web/src/features/lesson/CoursePracticePanel.tsx"),
    "utf8",
  );
  const readerSource = readFileSync(
    resolve(projectRoot, "apps/web/src/features/lesson/ContinuousCourseScreen.tsx"),
    "utf8",
  );
  assert.match(practiceSource, /localStorage\.setItem\(storageKey/);
  assert.match(practiceSource, /localStorage\.removeItem\(storageKey/);
  assert.match(practiceSource, /window\.setTimeout/);
  assert.match(practiceSource, /prompt\.optional/);
  assert.match(practiceSource, /sauvegardé uniquement sur cet appareil/);
  assert.match(readerSource, /currentUser\.id.*path\.id.*lesson\.id/s);
  assert.doesNotMatch(readerSource, /\.slice\(0, 2\)/);
  const conclusionWriting = activities.find(
    (activity) => activity.kind === "guided-writing" && activity.id === "write-bac-conclusion",
  );
  assert.ok(conclusionWriting?.kind === "guided-writing");
  assert.equal(
    conclusionWriting.prompts.find((prompt) => prompt.id === "opening")?.optional,
    true,
    "L’ouverture facultative ne doit pas bloquer l’accès au corrigé guidé.",
  );
  assert.deepEqual(
    curriculumLessonTitles
      .filter((lesson) => lesson.pathId === path.id)
      .map((lesson) => lesson.levelId)
      .sort(),
    ["terminale-a", "terminale-c", "terminale-d"],
    "Le même cours doit être publié dans les trois catalogues de Terminale.",
  );
});

test("le chargement à la demande restitue exactement les parcours de chaque classe", async () => {
  clearLearningPathBundleCacheForTests();

  for (const level of schoolLevels) {
    const expectedIds = learningPaths
      .filter((path) => path.levelIds.includes(level.id))
      .map((path) => path.id)
      .sort();
    const loaded = await loadLearningPathsForLevel(level.id);
    const loadedIds = loaded.map((path) => path.id).sort();

    assert.deepEqual(loadedIds, expectedIds, `Bundle incomplet pour ${level.id}`);
    assert.equal(new Set(loadedIds).size, loadedIds.length, `Doublon dans le bundle ${level.id}`);
    for (const path of loaded) {
      assert.equal(
        path.modules.flatMap((module) => module.lessons).reduce((total, lesson) => total + lesson.xp, 0),
        XP_PER_LESSON,
        `Budget du bundle incorrect : ${path.id}`,
      );
    }
  }

  const administrativePaths = await loadLearningPathsForLevel("terminale-a", true);
  assert.deepEqual(
    administrativePaths.map((path) => path.id).sort(),
    learningPaths.map((path) => path.id).sort(),
    "Le bundle administrateur doit conserver le référentiel intégral",
  );
});

test("le compteur public d'exercices reste aligné sur le catalogue complet", () => {
  const exerciseCount = learningPaths.reduce((pathTotal, path) => pathTotal + path.modules.reduce(
    (moduleTotal, module) => moduleTotal + module.lessons.reduce(
      (lessonTotal, lesson) => lessonTotal + (lesson.questions?.length || 1),
      0,
    ),
    0,
  ), 0);

  assert.equal(AVAILABLE_EXERCISES, exerciseCount);
});

test("l'audit éditorial reste aligné sur les leçons publiées et celles encore à construire", () => {
  const audits = buildEditorialAudits(learningPaths, curriculumLessonTitles);
  const terminalCPhysics = audits.filter((audit) => (
    audit.subjectId === "physics-chemistry" && audit.levelIds.includes("terminale-c")
  ));
  const terminalCCatalogCount = curriculumLessonTitles.filter((lesson) => (
    lesson.subjectId === "physics-chemistry" && lesson.levelId === "terminale-c"
  )).length;

  assert.equal(terminalCPhysics.length, terminalCCatalogCount);
  assert.ok(terminalCPhysics.every((audit) => audit.published), "La Physique-Chimie de Terminale C doit être entièrement publiée.");
  assert.ok(terminalCPhysics.every((audit) => editorialStatusOf(audit) === "complete"), "Une leçon de Terminale C est encore marquée incomplète.");
  const terminalDPhysicsCoverage = audits.filter((audit) => (
    audit.subjectId === "physics-chemistry" && audit.levelIds.includes("terminale-d")
  ));
  const terminalDCatalogCount = curriculumLessonTitles.filter((lesson) => (
    lesson.subjectId === "physics-chemistry" && lesson.levelId === "terminale-d"
  )).length;
  assert.equal(terminalDPhysicsCoverage.length, terminalDCatalogCount);
  assert.ok(terminalDPhysicsCoverage.every((audit) => audit.published), "La Physique-Chimie de Terminale D doit être entièrement publiée.");
  assert.ok(terminalDPhysicsCoverage.every((audit) => editorialStatusOf(audit) === "complete"), "Une leçon de Terminale D est encore marquée incomplète.");
  const chargedParticle = terminalCPhysics.find((audit) => audit.id === "terminale-cd-charged-particle-magnetic-field");
  assert.equal(chargedParticle?.published, true);
  assert.equal(chargedParticle && editorialStatusOf(chargedParticle), "complete");
  assert.equal(learningPaths.find((path) => path.id === "terminale-cd-charged-particle-magnetic-field")?.chapterNumberByLevel?.["terminale-c"], 7);
  const oscillations = terminalCPhysics.find((audit) => audit.id === "terminale-cd-free-mechanical-oscillations");
  assert.equal(oscillations?.published, true);
  assert.equal(oscillations && editorialStatusOf(oscillations), "complete");
  const magneticField = terminalCPhysics.find((audit) => audit.id === "terminale-cd-magnetic-field");
  assert.equal(magneticField?.published, true);
  assert.equal(magneticField && editorialStatusOf(magneticField), "complete");
  const laplaceLaw = terminalCPhysics.find((audit) => audit.id === "terminale-cd-laplace-law");
  assert.equal(laplaceLaw?.published, true);
  assert.equal(laplaceLaw && editorialStatusOf(laplaceLaw), "complete");
  const amines = audits.find((audit) => audit.id === "terminale-d-chemistry-amines");
  assert.equal(amines?.published, true);
  assert.equal(amines && editorialStatusOf(amines), "complete");
  assert.deepEqual(amines?.levelIds, ["terminale-d"]);
  assert.equal(amines?.chapterNumber, 18);
  const alphaAminoAcids = audits.find((audit) => audit.title === "Les acides α-aminés");
  assert.equal(alphaAminoAcids?.published, true);
  assert.equal(alphaAminoAcids && editorialStatusOf(alphaAminoAcids), "complete");
  assert.deepEqual(alphaAminoAcids?.levelIds, ["terminale-d"]);
  assert.equal(alphaAminoAcids?.chapterNumber, 21);
  const induction = terminalCPhysics.find((audit) => audit.id === "terminale-c-induction-electromagnetic");
  assert.equal(induction?.published, true);
  assert.equal(induction && editorialStatusOf(induction), "complete");
  const autoInduction = terminalCPhysics.find((audit) => audit.id === "terminale-cd-auto-induction");
  assert.equal(autoInduction?.published, true);
  assert.equal(autoInduction && editorialStatusOf(autoInduction), "complete");
  const derivatorIntegrator = terminalCPhysics.find((audit) => audit.id === "terminale-cd-derivator-integrator");
  assert.equal(derivatorIntegrator?.published, true);
  assert.equal(derivatorIntegrator && editorialStatusOf(derivatorIntegrator), "complete");
  const freeElectricalOscillations = terminalCPhysics.find((audit) => audit.id === "terminale-cd-free-electrical-oscillations");
  assert.equal(freeElectricalOscillations?.published, true);
  assert.equal(freeElectricalOscillations && editorialStatusOf(freeElectricalOscillations), "complete");
  const rlcForcedSinusoidal = terminalCPhysics.find((audit) => audit.id === "terminale-cd-rlc-forced-sinusoidal");
  assert.equal(rlcForcedSinusoidal?.published, true);
  assert.equal(rlcForcedSinusoidal && editorialStatusOf(rlcForcedSinusoidal), "complete");
  const rlcIntensityResonance = terminalCPhysics.find((audit) => audit.id === "terminale-cd-rlc-intensity-resonance");
  assert.equal(rlcIntensityResonance?.published, true);
  assert.equal(rlcIntensityResonance && editorialStatusOf(rlcIntensityResonance), "complete");
  const acPower = terminalCPhysics.find((audit) => audit.id === "terminale-cd-ac-power");
  assert.equal(acPower?.published, true);
  assert.equal(acPower && editorialStatusOf(acPower), "complete");
  const waveLight = terminalCPhysics.find((audit) => audit.id === "terminale-c-wave-light");
  assert.equal(waveLight?.published, true);
  assert.equal(waveLight && editorialStatusOf(waveLight), "complete");
  const corpuscularLight = terminalCPhysics.find((audit) => audit.id === "terminale-c-corpuscular-light");
  assert.equal(corpuscularLight?.published, true);
  assert.equal(corpuscularLight && editorialStatusOf(corpuscularLight), "complete");
  const spontaneousNuclear = terminalCPhysics.find((audit) => audit.id === "terminale-cd-spontaneous-nuclear");
  assert.equal(spontaneousNuclear?.published, true);
  assert.equal(spontaneousNuclear && editorialStatusOf(spontaneousNuclear), "complete");
  const provokedNuclear = terminalCPhysics.find((audit) => audit.id === "terminale-cd-provoked-nuclear");
  assert.equal(provokedNuclear?.published, true);
  assert.equal(provokedNuclear && editorialStatusOf(provokedNuclear), "complete");
  const terminalDPhysics = audits.filter((audit) => (
    audit.subjectId === "physics-chemistry" && audit.levelIds.includes("terminale-d")
  ));
  const spontaneousNuclearD = terminalDPhysics.find((audit) => audit.id === "terminale-cd-spontaneous-nuclear");
  assert.equal(spontaneousNuclearD?.published, true);
  assert.equal(spontaneousNuclearD && editorialStatusOf(spontaneousNuclearD), "complete");
  assert.equal(learningPaths.find((path) => path.id === "terminale-cd-spontaneous-nuclear")?.chapterNumberByLevel?.["terminale-d"], 14);
  const provokedNuclearD = terminalDPhysics.find((audit) => audit.id === "terminale-cd-provoked-nuclear");
  assert.equal(provokedNuclearD?.published, true);
  assert.equal(provokedNuclearD && editorialStatusOf(provokedNuclearD), "complete");
  assert.equal(learningPaths.find((path) => path.id === "terminale-cd-provoked-nuclear")?.chapterNumberByLevel?.["terminale-d"], 15);
  const chargedParticleD = terminalDPhysics.find((audit) => audit.id === "terminale-cd-charged-particle-magnetic-field");
  assert.equal(chargedParticleD?.published, true);
  assert.equal(chargedParticleD && editorialStatusOf(chargedParticleD), "complete");
  assert.equal(learningPaths.find((path) => path.id === "terminale-cd-charged-particle-magnetic-field")?.chapterNumberByLevel?.["terminale-d"], 6);
});

test("une session Seconde ou Première ne peut jamais reprendre une page BAC de Terminale", () => {
  const terminalBacRoute = {
    navigation: "arena" as const,
    subjectId: "mathematics" as const,
    arenaMode: "bac" as const,
    bacExamSlug: "2018",
  };
  const accountTypes: AccountType[] = ["student", "parent", "teacher"];
  const nonTerminalLevels = schoolLevels.filter((level) => level.stage !== "terminale");

  for (const level of nonTerminalLevels) {
    for (const accountType of accountTypes) {
      const user: AuthUser = {
        id: `${accountType}-${level.id}`,
        email: `${accountType}-${level.id}@example.test`,
        name: "Compte de contrôle",
        role: accountType === "teacher" ? "teacher" : "student",
        accountType,
        levelId: level.id,
        emailVerified: true,
      };
      assert.deepEqual(
        routeAllowedForUser(terminalBacRoute, user),
        { navigation: "home", subjectId: "mathematics" },
        `${accountType}/${level.id} ne doit pas ouvrir un sujet de Terminale après la connexion.`,
      );
    }
  }

  const terminalStudent: AuthUser = {
    id: "student-terminale-c",
    email: "student-terminale-c@example.test",
    name: "Élève Terminale C",
    role: "student",
    accountType: "student",
    levelId: "terminale-c",
    emailVerified: true,
  };
  assert.deepEqual(routeAllowedForUser(terminalBacRoute, terminalStudent), terminalBacRoute);

  const admin: AuthUser = {
    ...terminalStudent,
    id: "admin-seconde-c",
    email: "admin-seconde-c@example.test",
    name: "Administrateur de contrôle",
    role: "admin",
    accountType: "teacher",
    levelId: "seconde-c",
  };
  assert.deepEqual(
    routeAllowedForUser(terminalBacRoute, admin),
    terminalBacRoute,
    "Un administrateur conserve l'accès aux sujets BAC pour les contrôler.",
  );
});

test("l'accueil reprend le parcours réellement utilisé et calcule l'objectif du jour", () => {
  assert.equal(initialDashboard.dailyGoal.completed, 0, "Le seed d'accueil ne doit simuler aucune étape terminée.");
  assert.equal(subjects["history-geography"].enabled, true);
  assert.deepEqual(
    subjects["history-geography"].levelIds,
    ["terminale-a", "terminale-c", "terminale-d"],
    "L'Histoire-Géographie publiée ne doit être proposée qu'aux Terminales.",
  );
  const candidates = learningPaths.filter((path) => (
    path.subjectId === "mathematics" && path.levelIds.includes("terminale-c")
  ));
  assert.ok(candidates.length >= 2, "Le test de reprise exige au moins deux parcours de Terminale C.");
  const [firstPath, recentPath] = candidates;
  const progress = {
    [firstPath.id]: {
      first: {
        pathId: firstPath.id,
        lessonId: "first",
        xpAwarded: 500,
        bestScore: 20,
        attemptCount: 1,
        completedAt: "2026-08-18T10:00:00.000Z",
      },
    },
    [recentPath.id]: {
      recent: {
        pathId: recentPath.id,
        lessonId: "recent",
        xpAwarded: 500,
        bestScore: 20,
        attemptCount: 1,
        completedAt: "2026-08-19T09:00:00.000Z",
      },
      todayAgain: {
        pathId: recentPath.id,
        lessonId: "today-again",
        xpAwarded: 500,
        bestScore: 15,
        attemptCount: 2,
        completedAt: "2026-08-19T11:00:00.000Z",
      },
    },
  };

  assert.equal(selectDashboardPath({
    paths: candidates,
    progressByPath: progress,
    levelId: "terminale-c",
    subjectId: "mathematics",
    preference: { pathId: firstPath.id, openedAt: "2026-08-18T12:00:00.000Z" },
  })?.id, recentPath.id, "Une préférence locale ancienne ne doit pas masquer une progression plus récente.");

  assert.equal(selectDashboardPath({
    paths: candidates,
    progressByPath: progress,
    levelId: "terminale-c",
    subjectId: "mathematics",
    preference: { pathId: firstPath.id, openedAt: "2026-08-19T12:00:00.000Z" },
  })?.id, firstPath.id, "Le dernier parcours ouvert doit rester reprenable avant sa première validation.");

  assert.equal(
    completedLevelsToday(progress, new Date("2026-08-19T15:00:00.000Z")),
    2,
    "L'objectif doit compter les niveaux validés pendant la journée en Côte d'Ivoire.",
  );
});

test("le chargement par matière ne récupère aucun contenu des autres matières", async () => {
  clearLearningPathBundleCacheForTests();

  for (const level of schoolLevels) {
    for (const subject of Object.values(subjects)) {
      const expectedIds = learningPaths
        .filter((path) => path.levelIds.includes(level.id) && path.subjectId === subject.id)
        .map((path) => path.id)
        .sort();
      const loaded = await loadLearningPathsForSubject(level.id, subject.id);
      const loadedIds = loaded.map((path) => path.id).sort();

      assert.deepEqual(loadedIds, expectedIds, `Bundle matière incorrect pour ${level.id}/${subject.id}`);
      assert.ok(loaded.every((path) => path.subjectId === subject.id));
    }
  }
});

test("le catalogue de la boutique reste synchronisé entre Web, API et Supabase", () => {
  const webItems = new Map(storeCatalog.map((item) => [item.id, item]));
  const apiItems = new Map(storeItems.map((item) => [item.id, item]));
  assert.deepEqual([...webItems.keys()].sort(), [...apiItems.keys()].sort());

  const migration = readFileSync(
    resolve(projectRoot, "supabase/migrations/20260725120000_store_gold_shop.sql"),
    "utf8",
  );
  for (const [id, apiItem] of apiItems) {
    assert.equal(webItems.get(id)?.price, apiItem.price, `Prix Web/API différent : ${id}`);
    assert.match(migration, new RegExp(`\\('${id.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}',\\s*'[^']+',\\s*'[^']+',\\s*${apiItem.price},`));
  }
});

test("le moteur Codex évalue les écritures scolaires usuelles sans exécuter de code", () => {
  const polynomial = parseMathExpression("x² + 5x + 4");
  assert.equal(polynomial.evaluate(2), 18);

  const decimalComma = parseMathExpression("2,5x - 1");
  assert.equal(decimalComma.evaluate(4), 9);

  const logarithm = parseMathExpression("ln(x)");
  assert.ok(Math.abs(logarithm.evaluate(Math.E) - 1) < 1e-10);
  assert.ok(Math.abs(numericalDerivative(polynomial.evaluate, 3) - 11) < 1e-4);

  assert.throws(() => parseMathExpression("fetch(x)"), /fonction|reconnu|invalide/i);
});
