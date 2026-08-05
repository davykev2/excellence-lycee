import type { LearningPath } from "../domain/paths";
import { terminalAMathematicsPaths, terminalAPolynomialRationalPath } from "./terminalAMathPaths";
import { terminalCMathematicsPaths } from "./terminalCMathPaths";
import { terminalDMathematicsPaths } from "./terminalDMathPaths";

export { terminalAPolynomialRationalPath };

export const terminalMathematicsPaths: LearningPath[] = [
  ...terminalAMathematicsPaths,
  ...terminalCMathematicsPaths,
  ...terminalDMathematicsPaths,
];
