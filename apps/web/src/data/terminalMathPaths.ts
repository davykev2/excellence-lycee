import type { LearningPath } from "../domain/paths";
import { terminalAAdditionalMathPaths } from "./terminalAMathFaithfulCoursePaths";
import { terminalAPolynomialRationalPath } from "./terminalAPolynomialRationalPath";
import { terminalCMathematicsPaths } from "./terminalCMathPaths";

export { terminalAPolynomialRationalPath };

export const terminalMathematicsPaths: LearningPath[] = [
  terminalAPolynomialRationalPath,
  ...terminalAAdditionalMathPaths,
  ...terminalCMathematicsPaths,
];
