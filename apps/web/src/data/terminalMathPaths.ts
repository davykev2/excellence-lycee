import type { LearningPath } from "../domain/paths";
import { terminalAAdditionalMathPaths } from "./terminalAMathFaithfulCoursePaths";
import { terminalAPolynomialRationalPath } from "./terminalAPolynomialRationalPath";

export { terminalAPolynomialRationalPath };

export const terminalMathematicsPaths: LearningPath[] = [
  terminalAPolynomialRationalPath,
  ...terminalAAdditionalMathPaths,
];
