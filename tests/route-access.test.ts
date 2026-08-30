import assert from "node:assert/strict";
import test from "node:test";

import type { AccountType, AuthUser, UserRole } from "../apps/web/src/domain/auth.ts";
import { canProfileAccessBacExam } from "../apps/api/src/bacExam.ts";
import {
  isSubjectAvailableForLevel,
  schoolLevels,
  subjects,
} from "../apps/web/src/data/programme.ts";
import { isMissingSessionRefresh } from "../apps/web/src/features/auth/sessionRefreshState.ts";
import { appRouteUrl, readAppRoute } from "../apps/web/src/routing/appRoute.ts";
import {
  canAccessLearningPath,
  canAccessBacExams,
  canAccessSubject,
  initialSubjectIdForLocation,
  levelIdForLearningPath,
  routeAllowedForUser,
} from "../apps/web/src/routing/routeAccess.ts";

const bacDeepLink = {
  pathname: "/arene/exos-types-bac/2018/resultats",
  search: "?matiere=mathematics",
};

const bacRoute = readAppRoute(bacDeepLink, { navigation: "home" });

function createUser({
  levelId,
  accountType,
  role = accountType === "teacher" ? "teacher" : "student",
}: {
  levelId: string;
  accountType: AccountType;
  role?: UserRole;
}): AuthUser {
  const id = `${role}-${accountType}-${levelId}`;
  return {
    id,
    email: `${id}@example.test`,
    name: "Compte de contrôle",
    role,
    accountType,
    levelId,
    emailVerified: true,
  };
}

test("un deep-link BAC conservé avant création ou connexion est filtré avec le niveau chargé", () => {
  assert.deepEqual(bacRoute, {
    navigation: "arena",
    subjectId: "mathematics",
    arenaMode: "bac",
    arenaEditor: false,
    bacExamSlug: "2018",
    bacResults: true,
  });

  for (const level of schoolLevels) {
    for (const accountType of ["student", "parent", "teacher"] satisfies AccountType[]) {
      const user = createUser({ levelId: level.id, accountType });
      const expected = level.stage === "terminale"
        ? bacRoute
        : { navigation: "home", subjectId: "mathematics" };

      assert.deepEqual(
        routeAllowedForUser(bacRoute, user),
        expected,
        `${accountType}/${level.id} reçoit une route incompatible après authentification.`,
      );
    }
  }
});

test("le même garde-fou reste déterministe après F5 et navigation arrière", () => {
  const secondeParent = createUser({ levelId: "seconde-a", accountType: "parent" });
  const firstPass = routeAllowedForUser(bacRoute, secondeParent);
  const refreshPass = routeAllowedForUser(readAppRoute(bacDeepLink, { navigation: "home" }), secondeParent);
  const historyPass = routeAllowedForUser(bacRoute, secondeParent);

  assert.deepEqual(firstPass, { navigation: "home", subjectId: "mathematics" });
  assert.deepEqual(refreshPass, firstPass);
  assert.deepEqual(historyPass, firstPass);
  assert.deepEqual(routeAllowedForUser(firstPass, secondeParent), firstPass);
});

test("la visibilité BAC et l'accès direct partagent exactement la même décision", () => {
  for (const level of schoolLevels) {
    const terminalExpected = level.stage === "terminale";
    for (const accountType of ["student", "parent", "teacher"] satisfies AccountType[]) {
      const user = createUser({ levelId: level.id, accountType });
      assert.equal(canAccessBacExams(user), terminalExpected, `${accountType}/${level.id}`);
      assert.equal(canProfileAccessBacExam(user), terminalExpected, `API/${accountType}/${level.id}`);
      assert.equal(routeAllowedForUser(bacRoute, user) === bacRoute, terminalExpected, `${accountType}/${level.id}`);
    }

    const editor = createUser({ levelId: level.id, accountType: "teacher", role: "content_editor" });
    assert.equal(canAccessBacExams(editor), terminalExpected, `content_editor/${level.id}`);
    assert.equal(canProfileAccessBacExam(editor), terminalExpected, `API/content_editor/${level.id}`);

    const admin = createUser({ levelId: level.id, accountType: "teacher", role: "admin" });
    assert.equal(canAccessBacExams(admin), true, `admin/${level.id}`);
    assert.equal(canProfileAccessBacExam(admin), true, `API/admin/${level.id}`);
    assert.equal(routeAllowedForUser(bacRoute, admin), bacRoute, `admin/${level.id}`);
  }

  const invalidProfile = createUser({ levelId: "niveau-inconnu", accountType: "student" });
  assert.equal(canAccessBacExams(invalidProfile), false, "Un profil scolaire invalide doit échouer fermé.");
  assert.equal(canProfileAccessBacExam(invalidProfile), false, "L'API doit aussi échouer fermée.");
  assert.deepEqual(routeAllowedForUser(bacRoute, invalidProfile), { navigation: "home", subjectId: "mathematics" });
});

test("une panne de reprise après F5 n'est pas confondue avec une absence de session", () => {
  assert.equal(isMissingSessionRefresh({ status: 401, code: "UNAUTHORIZED" }), true);
  assert.equal(isMissingSessionRefresh({ status: 500, code: "INTERNAL_ERROR" }), false);
  assert.equal(isMissingSessionRefresh({ status: 408, code: "REQUEST_TIMEOUT" }), false);
  assert.equal(isMissingSessionRefresh({ status: 0, code: "NETWORK_ERROR" }), false);
});

test("les espaces d'administration et d'édition restent cloisonnés par rôle", () => {
  const adminRoute = readAppRoute(
    { pathname: "/admin/contenus/studio", search: "?matiere=mathematics" },
    { navigation: "home" },
  );
  const editorRoute = readAppRoute(
    { pathname: "/arene/exercices/editeur", search: "?matiere=mathematics" },
    { navigation: "home" },
  );

  assert.deepEqual(adminRoute, {
    navigation: "admin",
    subjectId: "mathematics",
    adminSection: "content",
    adminStudio: true,
  });

  const roles: UserRole[] = ["student", "teacher", "content_editor", "admin"];
  for (const role of roles) {
    const user = createUser({
      levelId: "terminale-c",
      accountType: role === "student" ? "parent" : "teacher",
      role,
    });

    assert.deepEqual(
      routeAllowedForUser(adminRoute, user),
      role === "admin" ? adminRoute : { navigation: "home", subjectId: "mathematics" },
      `Administration exposée au rôle ${role}.`,
    );
    assert.deepEqual(
      routeAllowedForUser(editorRoute, user),
      role === "admin" || role === "content_editor" ? editorRoute : { ...editorRoute, arenaEditor: false },
      `Éditeur exposé au rôle ${role}.`,
    );
  }
});

test("une nouvelle session recalcule la matière demandée depuis l'URL courante", () => {
  const pathSubjects = [
    { pathId: "math-path", subjectId: "mathematics" as const },
    { pathId: "svt-path", subjectId: "svt" as const },
  ];

  assert.equal(
    initialSubjectIdForLocation(
      { pathname: "/", search: "?matiere=mathematics" },
      "mathematics",
      pathSubjects,
    ),
    "mathematics",
  );
  assert.equal(
    initialSubjectIdForLocation(
      { pathname: "/profil", search: "?matiere=svt" },
      "mathematics",
      pathSubjects,
    ),
    "svt",
    "Une reconnexion sans F5 doit suivre l'URL modifiée depuis le premier montage.",
  );
  assert.equal(
    initialSubjectIdForLocation(
      { pathname: "/parcours/svt-path", search: "" },
      "mathematics",
      pathSubjects,
    ),
    "svt",
    "Un deep-link de parcours sans paramètre matière doit charger son propre bundle.",
  );

  const secondeStudent = createUser({ levelId: "seconde-c", accountType: "student" });
  assert.equal(
    initialSubjectIdForLocation(
      { pathname: "/parcours", search: "?matiere=french" },
      "mathematics",
      pathSubjects,
      null,
      secondeStudent,
    ),
    "mathematics",
    "Une matière désactivée ne doit pas devenir le bundle initial après F5.",
  );
});

test("un administrateur peut contrôler un parcours d'une autre classe sans l'exposer aux autres profils", () => {
  const terminalPath = { id: "terminale-d-svt", levelIds: ["terminale-d"] };
  const student = createUser({ levelId: "seconde-c", accountType: "student" });
  const parent = createUser({ levelId: "seconde-c", accountType: "parent" });
  const teacher = createUser({ levelId: "seconde-c", accountType: "teacher" });
  const admin = createUser({ levelId: "seconde-c", accountType: "teacher", role: "admin" });

  for (const user of [student, parent, teacher]) {
    assert.equal(canAccessLearningPath(user, terminalPath), false, `${user.accountType} ne doit pas changer de classe par URL.`);
    assert.equal(levelIdForLearningPath(user, terminalPath), "seconde-c");
  }

  assert.equal(canAccessLearningPath(admin, terminalPath), true);
  assert.equal(
    levelIdForLearningPath(admin, terminalPath),
    "terminale-d",
    "La prévisualisation admin doit employer le contexte scolaire du parcours ciblé.",
  );
});

test("une matière hors programme est corrigée avant affichage, sauf pour le contrôle administrateur", () => {
  const historyRoute = readAppRoute(
    { pathname: "/parcours", search: "?matiere=history-geography" },
    { navigation: "home" },
  );
  const secondeStudent = createUser({ levelId: "seconde-c", accountType: "student" });
  const secondeParent = createUser({ levelId: "seconde-c", accountType: "parent" });
  const secondeTeacher = createUser({ levelId: "seconde-c", accountType: "teacher" });
  const secondeAdmin = createUser({ levelId: "seconde-c", accountType: "teacher", role: "admin" });

  for (const user of [secondeStudent, secondeParent, secondeTeacher]) {
    assert.deepEqual(routeAllowedForUser(historyRoute, user), {
      navigation: "paths",
      subjectId: "mathematics",
      pathId: undefined,
      lessonId: undefined,
    });
  }
  assert.deepEqual(routeAllowedForUser(historyRoute, secondeAdmin), historyRoute);

  const disabledFrenchRoute = readAppRoute(
    { pathname: "/parcours", search: "?matiere=french" },
    { navigation: "home" },
  );
  assert.equal(routeAllowedForUser(disabledFrenchRoute, secondeStudent).subjectId, "mathematics");
  assert.deepEqual(routeAllowedForUser(disabledFrenchRoute, secondeAdmin), disabledFrenchRoute);
});

test("chaque classe expose exactement ses matières visibles et bloque celles encore désactivées", () => {
  const expectedVisibleSubjects: Record<string, string[]> = {
    "seconde-a": ["mathematics", "physics-chemistry", "french", "english", "svt"],
    "seconde-c": ["mathematics", "physics-chemistry", "french", "english", "svt"],
    "premiere-a": ["mathematics", "physics-chemistry", "french", "english", "svt", "philosophy"],
    "premiere-c": ["mathematics", "physics-chemistry", "french", "english", "svt", "philosophy"],
    "premiere-d": ["mathematics", "physics-chemistry", "french", "english", "svt", "philosophy"],
    "terminale-a": ["mathematics", "french", "english", "svt", "philosophy", "history-geography"],
    "terminale-c": ["mathematics", "physics-chemistry", "french", "english", "svt", "philosophy", "history-geography"],
    "terminale-d": ["mathematics", "physics-chemistry", "french", "english", "svt", "philosophy", "history-geography"],
  };

  for (const level of schoolLevels) {
    const visibleSubjects = Object.values(subjects)
      .filter((subject) => isSubjectAvailableForLevel(subject, level.id))
      .map((subject) => subject.id);
    assert.deepEqual(visibleSubjects, expectedVisibleSubjects[level.id], `Matières visibles incorrectes pour ${level.id}.`);

    for (const accountType of ["student", "parent", "teacher"] satisfies AccountType[]) {
      const user = createUser({ levelId: level.id, accountType });
      const accessibleSubjects = visibleSubjects.filter((subjectId) => canAccessSubject(user, subjectId));
      assert.deepEqual(
        accessibleSubjects,
        visibleSubjects.filter((subjectId) => subjects[subjectId].enabled),
        `Matières actives incorrectes pour ${accountType}/${level.id}.`,
      );
    }
  }
});

test("les URL principales restent canoniques après lecture, F5 et historique", () => {
  const locations = [
    { pathname: "/", search: "?matiere=svt" },
    { pathname: "/parcours", search: "?matiere=mathematics" },
    { pathname: "/parcours/path-test/niveaux/lesson-test", search: "?matiere=svt" },
    { pathname: "/arene", search: "?matiere=mathematics" },
    { pathname: "/arene/exercices/editeur", search: "?matiere=mathematics" },
    { pathname: "/arene/exos-types-bac/2024/resultats", search: "?matiere=mathematics" },
    { pathname: "/boutique", search: "?matiere=svt" },
    { pathname: "/classement", search: "?matiere=svt" },
    { pathname: "/messages", search: "?matiere=svt" },
    { pathname: "/profil", search: "?matiere=svt" },
    { pathname: "/admin/contenus/studio", search: "?matiere=mathematics" },
  ];

  for (const location of locations) {
    const firstRead = readAppRoute(location, { navigation: "home" });
    const canonicalUrl = new URL(appRouteUrl(firstRead, ""), "https://excellence.test");
    const refreshedRead = readAppRoute(
      { pathname: canonicalUrl.pathname, search: canonicalUrl.search },
      { navigation: "home" },
    );
    assert.deepEqual(refreshedRead, firstRead, `${location.pathname} ne survit pas à une relecture canonique.`);
  }
});
