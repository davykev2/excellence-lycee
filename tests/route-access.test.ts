import assert from "node:assert/strict";
import test from "node:test";

import type { AccountType, AuthUser, UserRole } from "../apps/web/src/domain/auth.ts";
import { schoolLevels } from "../apps/web/src/data/programme.ts";
import { readAppRoute } from "../apps/web/src/routing/appRoute.ts";
import {
  canAccessBacExams,
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
      assert.equal(routeAllowedForUser(bacRoute, user) === bacRoute, terminalExpected, `${accountType}/${level.id}`);
    }

    const editor = createUser({ levelId: level.id, accountType: "teacher", role: "content_editor" });
    assert.equal(canAccessBacExams(editor), terminalExpected, `content_editor/${level.id}`);

    const admin = createUser({ levelId: level.id, accountType: "teacher", role: "admin" });
    assert.equal(canAccessBacExams(admin), true, `admin/${level.id}`);
    assert.equal(routeAllowedForUser(bacRoute, admin), bacRoute, `admin/${level.id}`);
  }

  const invalidProfile = createUser({ levelId: "niveau-inconnu", accountType: "student" });
  assert.equal(canAccessBacExams(invalidProfile), false, "Un profil scolaire invalide doit échouer fermé.");
  assert.deepEqual(routeAllowedForUser(bacRoute, invalidProfile), { navigation: "home", subjectId: "mathematics" });
});

test("les espaces d'administration et d'édition restent cloisonnés par rôle", () => {
  const adminRoute = readAppRoute(
    { pathname: "/administration/contenus/studio", search: "?matiere=mathematics" },
    { navigation: "home" },
  );
  const editorRoute = readAppRoute(
    { pathname: "/arene/exercices/editeur", search: "?matiere=mathematics" },
    { navigation: "home" },
  );

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
