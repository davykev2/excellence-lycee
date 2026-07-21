import { terminalCMathLessonIds } from "./terminalCMathRewards.js";

export const terminalDMathPathSources = [
  ["terminale-d-math-l01-limits-continuity", "terminale-c-math-l01-limits-continuity"],
  ["terminale-d-math-l02-probability", "terminale-c-math-l17-probability"],
  ["terminale-d-math-l03-derivatives-functions", "terminale-c-math-l04-derivatives-functions"],
  ["terminale-d-math-l04-primitives", "terminale-c-math-l06-primitives"],
  ["terminale-d-math-l05-logarithms", "terminale-c-math-l08-logarithms"],
  ["terminale-d-math-l06-complex-numbers", "terminale-c-math-l09-complex-numbers"],
  ["terminale-d-math-l07-exponential-power", "terminale-c-math-l10-exponential-power"],
  ["terminale-d-math-l08-complex-geometry", "terminale-c-math-l13-complex-geometry"],
  ["terminale-d-math-l09-sequences", "terminale-c-math-l12-sequences"],
  ["terminale-d-math-l10-integral-calculus", "terminale-c-math-l15-integral-calculus"],
  ["terminale-d-math-l11-statistics", "terminale-c-math-l19-statistics"],
  ["terminale-d-math-l12-differential-equations", "terminale-c-math-l18-differential-equations"],
] as const;

const terminalCLessonsByPath = new Map<string, readonly string[]>(
  terminalCMathLessonIds.map(([pathId, lessonIds]) => [pathId, lessonIds]),
);

export const terminalDMathLessonIds = terminalDMathPathSources.map(([pathId, sourcePathId]) => {
  const lessonIds = terminalCLessonsByPath.get(sourcePathId);
  if (!lessonIds) throw new Error(`Parcours source Terminale C introuvable : ${sourcePathId}`);
  return [pathId, lessonIds] as const;
});
