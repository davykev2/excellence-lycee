import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { getLessonReward, getPathRewardTotal, XP_PER_LESSON } from "../apps/api/src/curriculum.ts";
import { storeItems } from "../apps/api/src/storeCatalog.ts";
import {
  clearLearningPathBundleCacheForTests,
  loadLearningPathsForLevel,
} from "../apps/web/src/data/learningPathLoader.ts";
import { learningPaths } from "../apps/web/src/data/learningPaths.ts";
import { AVAILABLE_EXERCISES } from "../apps/web/src/data/learningPathMetrics.ts";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog.ts";
import { schoolLevels } from "../apps/web/src/data/programme.ts";
import {
  buildEditorialAudits,
  editorialStatusOf,
} from "../apps/web/src/features/admin/editorialAudit.ts";
import { storeCatalog } from "../apps/web/src/data/storeCatalog.ts";
import { numericalDerivative, parseMathExpression } from "../apps/web/src/features/codex/mathEngine.ts";
import {
  canOpenMasteryLevel,
  MASTERY_LEVELS_REQUIRE_SEQUENCE,
} from "../apps/web/src/config/masteryAccess.ts";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

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

test("l'audit éditorial révèle les leçons du programme encore non publiées", () => {
  const audits = buildEditorialAudits(learningPaths, curriculumLessonTitles);
  const terminalCPhysics = audits.filter((audit) => (
    audit.subjectId === "physics-chemistry" && audit.levelIds.includes("terminale-c")
  ));
  const terminalCCatalogCount = curriculumLessonTitles.filter((lesson) => (
    lesson.subjectId === "physics-chemistry" && lesson.levelId === "terminale-c"
  )).length;

  assert.equal(terminalCPhysics.length, terminalCCatalogCount);
  assert.ok(terminalCPhysics.some((audit) => !audit.published), "Les leçons seulement titrées ont disparu de l'audit.");
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
