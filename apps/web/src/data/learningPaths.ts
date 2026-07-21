import type { LearningPath } from "../domain/paths";
import { mathematicsPaths } from "./mathPaths";
import { physicsPaths } from "./physicsPaths";
import { terminalGeographyPaths } from "./terminalGeographyPaths";
import { terminalHistoryPaths } from "./terminalHistoryPaths";
import { terminalMathematicsPaths } from "./terminalMathPaths";
import { terminalPhilosophyAdvancedPaths } from "./terminalPhilosophyAdvancedPaths";
import { terminalPhilosophyPaths } from "./terminalPhilosophyPaths";
import { terminalSvtPaths } from "./terminalSvtPaths";
import { applyLessonXpBudget } from "./xpRewards";

const baseLearningPaths: LearningPath[] = [
  ...mathematicsPaths,
  ...terminalMathematicsPaths,
  ...physicsPaths,
  ...terminalGeographyPaths,
  ...terminalHistoryPaths,
  ...terminalPhilosophyPaths,
  ...terminalPhilosophyAdvancedPaths,
  ...terminalSvtPaths,
];

export const learningPaths: LearningPath[] = baseLearningPaths.map(applyLessonXpBudget);
