/** Source exercise 38. Only the non-negative time/population window is displayed. */
export const population = (t: number) => -1000 * t ** 3 / 3 + 1500 * t ** 2 + 10000 * t + 1000;
export const populationDerivative = (t: number) => -1000 * (t - 5) * (t + 2);
export const populationThreshold = 46000;
export const populationDisplayRange: [number, number] = [0, 8];
