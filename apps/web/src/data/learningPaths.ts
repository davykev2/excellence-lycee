import type { LearningPath } from "../domain/paths";
import { chemistryPaths } from "./chemistryPaths";
import { mathematicsPaths } from "./mathPaths";
import { physicsPaths } from "./physicsPaths";
import { inertiaMotionPaths } from "./terminalCDInertiaMotionPath";
import { gravitationPaths } from "./terminalCGravitationPath";
import { uniformFieldsPaths } from "./terminalCDUniformFieldsPath";
import { freeMechanicalOscillationsPaths } from "./terminalCDFreeMechanicalOscillationsPath";
import { magneticFieldPaths } from "./terminalCDMagneticFieldPath";
import { chargedParticlePaths } from "./terminalCDChargedParticlePath";
import { laplaceLawPaths } from "./terminalCDLaplaceLawPath";
import { inductionElectromagneticPaths } from "./terminalCInductionElectromagneticPath";
import { autoInductionPaths } from "./terminalCDAutoInductionPath";
import { derivatorIntegratorPaths } from "./terminalCDDerivatorIntegratorPath";
import { freeElectricalOscillationsPaths } from "./terminalCDFreeElectricalOscillationsPath";
import { rlcForcedSinusoidalPaths } from "./terminalCDRlcForcedPath";
import { rlcIntensityResonancePaths } from "./terminalCDRlcResonancePath";
import { acPowerPaths } from "./terminalCDAcPowerPath";
import { waveLightPaths } from "./terminalCWaveLightPath";
import { corpuscularLightPaths } from "./terminalCCorpuscularLightPath";
import { spontaneousNuclearPaths } from "./terminalCDSpontaneousNuclearPath";
import { provokedNuclearPaths } from "./terminalCDProvokedNuclearPath";
import { terminalGeographyPaths } from "./terminalGeographyPaths";
import { terminalHistoryPaths } from "./terminalHistoryPaths";
import { terminalMathematicsPaths } from "./terminalMathPaths";
import { terminalPhilosophyAdvancedPaths } from "./terminalPhilosophyAdvancedPaths";
import { terminalPhilosophyPaths } from "./terminalPhilosophyPaths";
import { terminalCSvtCellEnergyPath } from "./terminalCSvtCellEnergyPath";
import { terminalCSvtDrugsPath } from "./terminalCSvtDrugsPath";
import { terminalCSvtMuscleEnergyPath } from "./terminalCSvtMuscleEnergyPath";
import { terminalCSvtNervousPath } from "./terminalCSvtNervousPath";
import { terminalSvtPaths } from "./terminalSvtPaths";
import { applyLessonXpBudget } from "./xpRewards";

const baseLearningPaths: LearningPath[] = [
  ...mathematicsPaths,
  ...terminalMathematicsPaths,
  ...physicsPaths,
  ...inertiaMotionPaths,
  ...gravitationPaths,
  ...uniformFieldsPaths,
  ...freeMechanicalOscillationsPaths,
  ...magneticFieldPaths,
  ...chargedParticlePaths,
  ...laplaceLawPaths,
  ...inductionElectromagneticPaths,
  ...autoInductionPaths,
  ...derivatorIntegratorPaths,
  ...freeElectricalOscillationsPaths,
  ...rlcForcedSinusoidalPaths,
  ...rlcIntensityResonancePaths,
  ...acPowerPaths,
  ...waveLightPaths,
  ...corpuscularLightPaths,
  ...spontaneousNuclearPaths,
  ...provokedNuclearPaths,
  ...chemistryPaths,
  ...terminalGeographyPaths,
  ...terminalHistoryPaths,
  ...terminalPhilosophyPaths,
  ...terminalPhilosophyAdvancedPaths,
  ...terminalSvtPaths,
  terminalCSvtNervousPath,
  terminalCSvtDrugsPath,
  terminalCSvtCellEnergyPath,
  terminalCSvtMuscleEnergyPath,
];

export const learningPaths: LearningPath[] = baseLearningPaths.map(applyLessonXpBudget);
