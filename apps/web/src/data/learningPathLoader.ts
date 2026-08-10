import type { LearningPath } from "../domain/paths";
import { applyLessonXpBudget } from "./xpRewards";

const bundleCache = new Map<string, Promise<LearningPath[]>>();

function uniquePaths(paths: LearningPath[]) {
  const byId = new Map<string, LearningPath>();
  for (const path of paths) {
    if (!byId.has(path.id)) byId.set(path.id, applyLessonXpBudget(path));
  }
  return [...byId.values()];
}

async function loadTerminalCommonPaths() {
  const [geography, history, philosophy, advancedPhilosophy] = await Promise.all([
    import("./terminalGeographyPaths").then((module) => module.terminalGeographyPaths),
    import("./terminalHistoryPaths").then((module) => module.terminalHistoryPaths),
    import("./terminalPhilosophyPaths").then((module) => module.terminalPhilosophyPaths),
    import("./terminalPhilosophyAdvancedPaths").then((module) => module.terminalPhilosophyAdvancedPaths),
  ]);
  return [...geography, ...history, ...philosophy, ...advancedPhilosophy];
}

async function loadTerminalPhysicsPaths(levelId: string) {
  const [kinematics, inertia, uniformFields, freeOscillations, magneticField, laplaceLaw, induction, autoInduction, derivatorIntegrator, freeElectricalOscillations, rlcForcedSinusoidal, chemistry, gravitation] = await Promise.all([
    import("./physicsPaths").then((module) => module.physicsPaths),
    import("./terminalCDInertiaMotionPath").then((module) => module.inertiaMotionPaths),
    import("./terminalCDUniformFieldsPath").then((module) => module.uniformFieldsPaths),
    import("./terminalCDFreeMechanicalOscillationsPath").then((module) => module.freeMechanicalOscillationsPaths),
    import("./terminalCDMagneticFieldPath").then((module) => module.magneticFieldPaths),
    import("./terminalCDLaplaceLawPath").then((module) => module.laplaceLawPaths),
    levelId === "terminale-c"
      ? import("./terminalCInductionElectromagneticPath").then((module) => module.inductionElectromagneticPaths)
      : Promise.resolve([] as LearningPath[]),
    import("./terminalCDAutoInductionPath").then((module) => module.autoInductionPaths),
    import("./terminalCDDerivatorIntegratorPath").then((module) => module.derivatorIntegratorPaths),
    import("./terminalCDFreeElectricalOscillationsPath").then((module) => module.freeElectricalOscillationsPaths),
    import("./terminalCDRlcForcedPath").then((module) => module.rlcForcedSinusoidalPaths),
    import("./chemistryPaths").then((module) => module.chemistryPaths),
    levelId === "terminale-c"
      ? import("./terminalCGravitationPath").then((module) => module.gravitationPaths)
      : Promise.resolve([] as LearningPath[]),
  ]);
  return [...kinematics, ...inertia, ...gravitation, ...uniformFields, ...freeOscillations, ...magneticField, ...laplaceLaw, ...induction, ...autoInduction, ...derivatorIntegrator, ...freeElectricalOscillations, ...rlcForcedSinusoidal, ...chemistry];
}

async function loadPathsForLevel(levelId: string) {
  if (levelId === "seconde-c") {
    return import("./mathPaths").then((module) => module.mathematicsPaths);
  }

  if (levelId === "terminale-a") {
    const [mathematics, common, svt] = await Promise.all([
      import("./terminalAMathPaths").then((module) => module.terminalAMathematicsPaths),
      loadTerminalCommonPaths(),
      import("./terminalSvtPaths").then((module) => module.terminalSvtPaths),
    ]);
    return [...mathematics, ...common, ...svt];
  }

  if (levelId === "terminale-c") {
    const [mathematics, physics, common, nervousSystem] = await Promise.all([
      import("./terminalCMathPaths").then((module) => module.terminalCMathematicsPaths),
      loadTerminalPhysicsPaths(levelId),
      loadTerminalCommonPaths(),
      import("./terminalCSvtNervousPath").then((module) => [module.terminalCSvtNervousPath]),
    ]);
    return [...mathematics, ...physics, ...common, ...nervousSystem];
  }

  if (levelId === "terminale-d") {
    const [mathematics, physics, common] = await Promise.all([
      import("./terminalDMathPaths").then((module) => module.terminalDMathematicsPaths),
      loadTerminalPhysicsPaths(levelId),
      loadTerminalCommonPaths(),
    ]);
    return [...mathematics, ...physics, ...common];
  }

  return [];
}

/**
 * Charge uniquement les parcours utiles à la classe courante. Les comptes
 * administrateurs conservent le référentiel intégral pour leurs outils de
 * contrôle et de prévisualisation.
 */
export function loadLearningPathsForLevel(levelId: string, includeAll = false): Promise<LearningPath[]> {
  const cacheKey = includeAll ? "all" : levelId;
  const cached = bundleCache.get(cacheKey);
  if (cached) return cached;

  const loading = (includeAll
    ? import("./learningPaths").then((module) => module.learningPaths)
    : loadPathsForLevel(levelId)
        .then((paths) => paths.filter((path) => path.levelIds.includes(levelId)))
        .then(uniquePaths)
  ).catch((error) => {
    bundleCache.delete(cacheKey);
    throw error;
  });

  bundleCache.set(cacheKey, loading);
  return loading;
}

export function clearLearningPathBundleCacheForTests() {
  bundleCache.clear();
}
