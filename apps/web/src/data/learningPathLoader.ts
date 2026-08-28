import type { LearningPath } from "../domain/paths";
import type { SubjectId } from "../domain/learning";
import { applyLessonXpBudget } from "./xpRewards";

const bundleCache = new Map<string, Promise<LearningPath[]>>();

function uniquePaths(paths: LearningPath[]) {
  const byId = new Map<string, LearningPath>();
  for (const path of paths) {
    if (!byId.has(path.id)) byId.set(path.id, applyLessonXpBudget(path));
  }
  return [...byId.values()];
}

async function loadTerminalHistoryGeographyPaths() {
  const [geography, history] = await Promise.all([
    import("./terminalGeographyPaths").then((module) => module.terminalGeographyPaths),
    import("./terminalHistoryPaths").then((module) => module.terminalHistoryPaths),
  ]);
  return [...geography, ...history];
}

async function loadTerminalPhilosophyPaths() {
  const [philosophy, advancedPhilosophy] = await Promise.all([
    import("./terminalPhilosophyPaths").then((module) => module.terminalPhilosophyPaths),
    import("./terminalPhilosophyAdvancedPaths").then((module) => module.terminalPhilosophyAdvancedPaths),
  ]);
  return [...philosophy, ...advancedPhilosophy];
}

async function loadTerminalPhysicsPaths(levelId: string) {
  const [kinematics, inertia, uniformFields, freeOscillations, magneticField, chargedParticle, laplaceLaw, induction, autoInduction, derivatorIntegrator, freeElectricalOscillations, rlcForcedSinusoidal, rlcIntensityResonance, acPower, waveLight, corpuscularLight, spontaneousNuclear, provokedNuclear, chemistry, gravitation] = await Promise.all([
    import("./physicsPaths").then((module) => module.physicsPaths),
    import("./terminalCDInertiaMotionPath").then((module) => module.inertiaMotionPaths),
    import("./terminalCDUniformFieldsPath").then((module) => module.uniformFieldsPaths),
    import("./terminalCDFreeMechanicalOscillationsPath").then((module) => module.freeMechanicalOscillationsPaths),
    import("./terminalCDMagneticFieldPath").then((module) => module.magneticFieldPaths),
    import("./terminalCDChargedParticlePath").then((module) => module.chargedParticlePaths),
    import("./terminalCDLaplaceLawPath").then((module) => module.laplaceLawPaths),
    levelId === "terminale-c"
      ? import("./terminalCInductionElectromagneticPath").then((module) => module.inductionElectromagneticPaths)
      : Promise.resolve([] as LearningPath[]),
    import("./terminalCDAutoInductionPath").then((module) => module.autoInductionPaths),
    import("./terminalCDDerivatorIntegratorPath").then((module) => module.derivatorIntegratorPaths),
    import("./terminalCDFreeElectricalOscillationsPath").then((module) => module.freeElectricalOscillationsPaths),
    import("./terminalCDRlcForcedPath").then((module) => module.rlcForcedSinusoidalPaths),
    import("./terminalCDRlcResonancePath").then((module) => module.rlcIntensityResonancePaths),
    import("./terminalCDAcPowerPath").then((module) => module.acPowerPaths),
    levelId === "terminale-c"
      ? import("./terminalCWaveLightPath").then((module) => module.waveLightPaths)
      : Promise.resolve([] as LearningPath[]),
    levelId === "terminale-c"
      ? import("./terminalCCorpuscularLightPath").then((module) => module.corpuscularLightPaths)
      : Promise.resolve([] as LearningPath[]),
    import("./terminalCDSpontaneousNuclearPath").then((module) => module.spontaneousNuclearPaths),
    import("./terminalCDProvokedNuclearPath").then((module) => module.provokedNuclearPaths),
    import("./chemistryPaths").then((module) => module.chemistryPaths),
    levelId === "terminale-c"
      ? import("./terminalCGravitationPath").then((module) => module.gravitationPaths)
      : Promise.resolve([] as LearningPath[]),
  ]);
  return [...kinematics, ...inertia, ...gravitation, ...uniformFields, ...freeOscillations, ...magneticField, ...chargedParticle, ...laplaceLaw, ...induction, ...autoInduction, ...derivatorIntegrator, ...freeElectricalOscillations, ...rlcForcedSinusoidal, ...rlcIntensityResonance, ...acPower, ...waveLight, ...corpuscularLight, ...spontaneousNuclear, ...provokedNuclear, ...chemistry];
}

async function loadSvtPaths(levelId: string) {
  if (levelId === "terminale-a") {
    return Promise.all([
      import("./terminalASvtEmotionalReactionsPath").then((module) => module.terminalASvtEmotionalReactionsPath),
      import("./terminalASvtBrainActivityPath").then((module) => module.terminalASvtBrainActivityPath),
      import("./terminalASvtOriginOfLifePath").then((module) => module.terminalASvtOriginOfLifePath),
      import("./terminalASvtHumanLineagePath").then((module) => module.terminalASvtHumanLineagePath),
      import("./terminalASvtSexBloodHeredityPath").then((module) => module.terminalASvtSexBloodHeredityPath),
      import("./terminalASvtGeneticPredictionsPath").then((module) => module.terminalASvtGeneticPredictionsPath),
      import("./terminalASvtProteinBiosynthesisPath").then((module) => module.terminalASvtProteinBiosynthesisPath),
    ]);
  }
  if (levelId === "terminale-c") {
    const [nervousSystem, drugsNervousSystem, cellEnergyProduction, muscleEnergyUse, immuneDefense, hivInfection, femaleCycles, humanHeredity, petroleumFormation, petroleumExploitation, soilFertility] = await Promise.all([
      import("./terminalCSvtNervousPath").then((module) => [module.terminalCSvtNervousPath]),
      import("./terminalCSvtDrugsPath").then((module) => [module.terminalCSvtDrugsPath]),
      import("./terminalCSvtCellEnergyPath").then((module) => [module.terminalCSvtCellEnergyPath]),
      import("./terminalCSvtMuscleEnergyPath").then((module) => [module.terminalCSvtMuscleEnergyPath]),
      import("./terminalCSvtImmuneDefensePath").then((module) => [module.terminalCSvtImmuneDefensePath]),
      import("./terminalCSvtHivInfectionPath").then((module) => [module.terminalCSvtHivInfectionPath]),
      import("./terminalCSvtFemaleCyclesPath").then((module) => [module.terminalCSvtFemaleCyclesPath]),
      import("./terminalCSvtHumanHeredityPath").then((module) => [module.terminalCSvtHumanHeredityPath]),
      import("./terminalCSvtPetroleumFormationPath").then((module) => [module.terminalCSvtPetroleumFormationPath]),
      import("./terminalCSvtPetroleumExploitationPath").then((module) => [module.terminalCSvtPetroleumExploitationPath]),
      import("./terminalCSvtSoilFertilityPath").then((module) => [module.terminalCSvtSoilFertilityPath]),
    ]);
    return [...nervousSystem, ...drugsNervousSystem, ...cellEnergyProduction, ...muscleEnergyUse, ...immuneDefense, ...hivInfection, ...femaleCycles, ...humanHeredity, ...petroleumFormation, ...petroleumExploitation, ...soilFertility];
  }
  if (levelId === "terminale-d") {
    const [conditionedReflex, nervousTissue, skeletalMuscle, heart, gameteFate, humanSexualOrgans, spermaphyteReproduction, singleTraitHeredity, twoTraitHeredity, internalEnvironment, immuneDefense, hivInfection] = await Promise.all([
      import("./terminalDSvtConditionedReflexPath").then((module) => module.terminalDSvtConditionedReflexPath),
      import("./terminalDSvtNervousTissuePath").then((module) => module.terminalDSvtNervousTissuePath),
      import("./terminalDSvtSkeletalMusclePath").then((module) => module.terminalDSvtSkeletalMusclePath),
      import("./terminalDSvtHeartPath").then((module) => module.terminalDSvtHeartPath),
      import("./terminalDSvtGameteFatePath").then((module) => module.terminalDSvtGameteFatePath),
      import("./terminalDSvtHumanSexualOrgansPath").then((module) => module.terminalDSvtHumanSexualOrgansPath),
      import("./terminalDSvtSpermaphyteReproductionPath").then((module) => module.terminalDSvtSpermaphyteReproductionPath),
      import("./terminalDSvtSingleTraitHeredityPath").then((module) => module.terminalDSvtSingleTraitHeredityPath),
      import("./terminalDSvtTwoTraitHeredityPath").then((module) => module.terminalDSvtTwoTraitHeredityPath),
      import("./terminalDSvtInternalEnvironmentPath").then((module) => module.terminalDSvtInternalEnvironmentPath),
      import("./terminalDSvtImmuneDefensePath").then((module) => module.terminalDSvtImmuneDefensePath),
      import("./terminalDSvtHivInfectionPath").then((module) => module.terminalDSvtHivInfectionPath),
    ]);
    return [conditionedReflex, nervousTissue, skeletalMuscle, heart, gameteFate, humanSexualOrgans, spermaphyteReproduction, singleTraitHeredity, twoTraitHeredity, internalEnvironment, immuneDefense, hivInfection];
  }
  return [];
}

async function loadMathematicsPaths(levelId: string) {
  if (levelId === "seconde-c") {
    return import("./mathPaths").then((module) => module.mathematicsPaths);
  }
  if (levelId === "terminale-a") {
    return import("./terminalAMathPaths").then((module) => module.terminalAMathematicsPaths);
  }
  if (levelId === "terminale-c") {
    return import("./terminalCMathPaths").then((module) => module.terminalCMathematicsPaths);
  }
  if (levelId === "terminale-d") {
    return import("./terminalDMathPaths").then((module) => module.terminalDMathematicsPaths);
  }
  return [];
}

async function loadPathsForSubject(levelId: string, subjectId: SubjectId) {
  if (subjectId === "mathematics") return loadMathematicsPaths(levelId);
  if (subjectId === "physics-chemistry" && (levelId === "terminale-c" || levelId === "terminale-d")) {
    return loadTerminalPhysicsPaths(levelId);
  }
  if (subjectId === "history-geography" && levelId.startsWith("terminale-")) {
    return loadTerminalHistoryGeographyPaths();
  }
  if (subjectId === "philosophy" && levelId.startsWith("terminale-")) {
    return loadTerminalPhilosophyPaths();
  }
  if (subjectId === "svt") return loadSvtPaths(levelId);
  return [];
}

const loadableSubjectIds: SubjectId[] = [
  "mathematics",
  "physics-chemistry",
  "french",
  "english",
  "svt",
  "philosophy",
  "history-geography",
];

async function loadPathsForLevel(levelId: string) {
  const subjectBundles = await Promise.all(
    loadableSubjectIds.map((subjectId) => loadLearningPathsForSubject(levelId, subjectId)),
  );
  return uniquePaths(subjectBundles.flat());
}

/** Charge un seul domaine pédagogique pour éviter de télécharger toute la classe à la connexion. */
export function loadLearningPathsForSubject(levelId: string, subjectId: SubjectId): Promise<LearningPath[]> {
  const cacheKey = `subject:${levelId}:${subjectId}`;
  const cached = bundleCache.get(cacheKey);
  if (cached) return cached;

  const loading = loadPathsForSubject(levelId, subjectId)
    .then((paths) => paths.filter((path) => (
      path.levelIds.includes(levelId) && path.subjectId === subjectId
    )))
    .then(uniquePaths)
    .catch((error) => {
      bundleCache.delete(cacheKey);
      throw error;
    });

  bundleCache.set(cacheKey, loading);
  return loading;
}

/**
 * Charge uniquement les parcours utiles à la classe courante. Les comptes
 * administrateurs conservent le référentiel intégral pour leurs outils de
 * contrôle et de prévisualisation.
 */
export function loadLearningPathsForLevel(levelId: string, includeAll = false): Promise<LearningPath[]> {
  const cacheKey = includeAll ? "all" : `level:${levelId}`;
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
