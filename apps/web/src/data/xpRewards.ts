import type { LearningPath } from "../domain/paths";

export const XP_PER_LESSON = 10_000;
const XP_ALLOCATION_UNIT = 10;

interface WeightedLevel {
  id: string;
  weight: number;
}

export function distributeLessonXp(levels: readonly WeightedLevel[], totalXp = XP_PER_LESSON) {
  if (!levels.length) return [];
  if (!Number.isInteger(totalXp) || totalXp <= 0 || totalXp % XP_ALLOCATION_UNIT !== 0) {
    throw new Error(`Le total XP doit être un entier positif divisible par ${XP_ALLOCATION_UNIT}.`);
  }

  const normalizedWeights = levels.map((level) => Math.max(1, level.weight));
  const totalWeight = normalizedWeights.reduce((sum, weight) => sum + weight, 0);
  const totalUnits = totalXp / XP_ALLOCATION_UNIT;
  const allocations = levels.map((level, index) => {
    const rawUnits = totalUnits * normalizedWeights[index] / totalWeight;
    const baseUnits = Math.floor(rawUnits);
    return {
      id: level.id,
      index,
      baseUnits,
      fractionalUnits: rawUnits - baseUnits,
    };
  });
  const remainingUnits = totalUnits - allocations.reduce((sum, allocation) => sum + allocation.baseUnits, 0);
  const bonusIndexes = new Set(
    [...allocations]
      .sort((left, right) => (
        right.fractionalUnits - left.fractionalUnits
        || left.id.localeCompare(right.id, "en")
        || left.index - right.index
      ))
      .slice(0, remainingUnits)
      .map((allocation) => allocation.index),
  );

  return allocations.map((allocation) => (
    allocation.baseUnits + (bonusIndexes.has(allocation.index) ? 1 : 0)
  ) * XP_ALLOCATION_UNIT);
}

export function applyLessonXpBudget(path: LearningPath): LearningPath {
  const levels = path.modules.flatMap((module) => module.lessons);
  const rewards = distributeLessonXp(levels.map((level) => ({ id: level.id, weight: level.xp })));
  let rewardIndex = 0;

  return {
    ...path,
    modules: path.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((level) => ({
        ...level,
        xp: rewards[rewardIndex++],
      })),
    })),
  };
}

export function formatXp(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}
