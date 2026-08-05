import type { LearningPath } from "../domain/paths";
import { terminalAExponentialPath } from "./terminalAExponentialPath";
import { terminalALinearSystemsPath } from "./terminalALinearSystemsPath";
import { terminalANaturalLogPath } from "./terminalANaturalLogPath";
import { terminalAPolynomialRationalPath } from "./terminalAPolynomialRationalPath";
import { terminalA1ProbabilityPath, terminalA2ProbabilityPath } from "./terminalAProbabilityPath";
import { terminalAPrimitivesIntegralsPath } from "./terminalAPrimitivesIntegralsPath";
import { terminalASequencesPath } from "./terminalASequencesPath";
import { terminalABivariateStatisticsPath } from "./terminalAStatisticsPath";

/**
 * Bundle Mathématiques réservé aux Terminales A.
 *
 * Le séparer des séries C/D permet à Vite de ne pas télécharger les 31 autres
 * parcours de mathématiques lorsqu'un élève de Terminale A ouvre son espace.
 */
export const terminalAMathematicsPaths: LearningPath[] = [
  terminalAPolynomialRationalPath,
  terminalA1ProbabilityPath,
  terminalA2ProbabilityPath,
  terminalANaturalLogPath,
  terminalAExponentialPath,
  terminalASequencesPath,
  terminalABivariateStatisticsPath,
  terminalALinearSystemsPath,
  terminalAPrimitivesIntegralsPath,
];

export { terminalAPolynomialRationalPath };
