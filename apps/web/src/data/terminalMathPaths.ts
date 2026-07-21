import type { LearningPath } from "../domain/paths";
import { terminalAAdditionalMathPaths } from "./terminalAMathCoursePaths";
import { terminalAPolynomialRationalPath } from "./terminalAPolynomialRationalPath";

export { terminalAPolynomialRationalPath };

export const terminalMathematicsPaths: LearningPath[] = [
  terminalAPolynomialRationalPath,
  ...terminalAAdditionalMathPaths,
];
