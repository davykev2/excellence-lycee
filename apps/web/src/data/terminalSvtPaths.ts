import type { LearningPath } from "../domain/paths";
import { terminalASvtEmotionalReactionsPath } from "./terminalASvtEmotionalReactionsPath";
import { terminalASvtBrainActivityPath } from "./terminalASvtBrainActivityPath";
import { terminalASvtOriginOfLifePath } from "./terminalASvtOriginOfLifePath";
import { terminalASvtHumanLineagePath } from "./terminalASvtHumanLineagePath";
import { terminalASvtSexBloodHeredityPath } from "./terminalASvtSexBloodHeredityPath";
import { terminalASvtGeneticPredictionsPath } from "./terminalASvtGeneticPredictionsPath";
import { terminalASvtProteinBiosynthesisPath } from "./terminalASvtProteinBiosynthesisPath";

export const terminalSvtPaths: LearningPath[] = [
  terminalASvtEmotionalReactionsPath,
  terminalASvtBrainActivityPath,
  terminalASvtOriginOfLifePath,
  terminalASvtHumanLineagePath,
  terminalASvtSexBloodHeredityPath,
  terminalASvtGeneticPredictionsPath,
  terminalASvtProteinBiosynthesisPath,
];
