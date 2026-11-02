import type { ArenaExerciseCollection } from "../../domain/arenaExercises";
import { getTerminalCDMathPair } from "../terminalCDMathSharing";

async function loadTerminalCCollection(lessonKey: string): Promise<ArenaExerciseCollection | null> {
  if(lessonKey==="terminale-c-math-l11-lcm-gcd"){
    return(await import("./terminalCGcdExercises")).terminalCGcdExercises;
  }
  if (lessonKey === "terminale-c-math-l09-complex-numbers") {
    return (await import("./terminalCComplexExercises")).terminalCComplexExercises;
  }
  if (lessonKey === "terminale-c-math-l07-conics") {
    return (await import("./terminalCConicsExercises")).terminalCConicsExercises;
  }
  if (lessonKey === "terminale-c-math-l05-space-analytic-geometry") {
    return (await import("./terminalCSpaceExercises")).terminalCSpaceExercises;
  }
  if (lessonKey === "terminale-c-math-l03-divisibility") {
    return (await import("./terminalCDivisibilityExercises")).terminalCDivisibilityExercises;
  }
  if (lessonKey === "terminale-c-math-l02-barycenter") {
    return (await import("./terminalCBarycenterExercises")).terminalCBarycenterExercises;
  }
  if (lessonKey === "terminale-c-math-l19-statistics") {
    return (await import("./terminalCStatisticsExercises")).terminalCStatisticsExercises;
  }
  if (lessonKey === "terminale-c-math-l17-probability") {
    return (await import("./terminalCProbabilityExercises")).terminalCProbabilityExercises;
  }
  if (lessonKey === "terminale-c-math-l01-limits-continuity") {
    return (await import("./terminalCLimitsExercises")).terminalCLimitsExercises;
  }
  if (lessonKey === "terminale-c-math-l04-derivatives-functions") {
    return (await import("./terminalCDerivativesExercises")).terminalCDerivativesExercises;
  }
  if (lessonKey === "terminale-c-math-l06-primitives") {
    return (await import("./terminalCPrimitivesExercises")).terminalCPrimitivesExercises;
  }
  if (lessonKey === "terminale-c-math-l08-logarithms") {
    return (await import("./terminalCLogarithmsExercises")).terminalCLogarithmsExercises;
  }
  if (lessonKey === "terminale-c-math-l10-exponential-power") {
    return (await import("./terminalCExponentialPowerExercises")).terminalCExponentialPowerExercises;
  }
  if (lessonKey === "terminale-c-math-l12-sequences") {
    return (await import("./terminalCSequencesExercises")).terminalCSequencesExercises;
  }
  if (lessonKey === "terminale-c-math-l15-integral-calculus") {
    return (await import("./terminalCIntegralExercises")).terminalCIntegralExercises;
  }
  if (lessonKey === "terminale-c-math-l18-differential-equations") {
    return (await import("./terminalCDifferentialExercises")).terminalCDifferentialExercises;
  }
  return null;
}

export async function loadExerciseCollection(levelId: string, subjectId: string, lessonKey: string): Promise<ArenaExerciseCollection | null> {
  if (subjectId !== "mathematics") return null;
  if (levelId === "terminale-c") return loadTerminalCCollection(lessonKey);
  if (levelId !== "terminale-d") return null;
  const pair = getTerminalCDMathPair(lessonKey, levelId);
  if (!pair) return null;
  const source = await loadTerminalCCollection(pair.c);
  if (!source) return null;
  // Source exercise/figure/anchor IDs are intentionally stable. The contextual
  // identity isolates D drafts/publications without duplicating any exercise.
  return { ...source, id: `${pair.d}-exercises`, levelId, lessonKey: pair.d };
}
