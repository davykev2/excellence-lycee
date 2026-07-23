import type { LearningPath } from "../domain/paths";
import { terminalAAdditionalMathPaths } from "./terminalAMathFaithfulCoursePaths";
import { terminalAPolynomialRationalPath } from "./terminalAPolynomialRationalPath";
import { terminalA1ProbabilityPath, terminalA2ProbabilityPath } from "./terminalAProbabilityPath";
import { terminalANaturalLogPath } from "./terminalANaturalLogPath";
import { terminalAExponentialPath } from "./terminalAExponentialPath";
import { terminalASequencesPath } from "./terminalASequencesPath";
import { terminalABivariateStatisticsPath } from "./terminalAStatisticsPath";
import { terminalALinearSystemsPath } from "./terminalALinearSystemsPath";
import { terminalCMathematicsPaths } from "./terminalCMathPaths";
import { terminalDMathematicsPaths } from "./terminalDMathPaths";

export { terminalAPolynomialRationalPath };

export const terminalMathematicsPaths: LearningPath[] = [
  terminalAPolynomialRationalPath,
  terminalA1ProbabilityPath,
  terminalA2ProbabilityPath,
  terminalANaturalLogPath,
  terminalAExponentialPath,
  terminalASequencesPath,
  terminalABivariateStatisticsPath,
  terminalALinearSystemsPath,
  ...terminalAAdditionalMathPaths,
  ...terminalCMathematicsPaths,
  ...terminalDMathematicsPaths,
];
