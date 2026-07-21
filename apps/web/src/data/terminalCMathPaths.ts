import type { LearningPath } from "../domain/paths";
import { terminalCMathPaths01to05 } from "./terminalCMathPaths01to05";
import { terminalCMathPaths06to10 } from "./terminalCMathPaths06to10";
import { terminalCMathPaths11to15 } from "./terminalCMathPaths11to15";
import { terminalCMathPaths16to19 } from "./terminalCMathPaths16to19";

export const terminalCMathematicsPaths: LearningPath[] = [
  ...terminalCMathPaths01to05,
  ...terminalCMathPaths06to10,
  ...terminalCMathPaths11to15,
  ...terminalCMathPaths16to19,
];
