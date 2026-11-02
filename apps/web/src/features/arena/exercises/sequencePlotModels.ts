/** Reviewed definitions only. No expression from a pupil is executed. */
export function sequenceValue(sourceNumber: number, rank: number, branch = 0): number {
  const n = Math.max(0, Math.min(60, Math.trunc(rank)));
  switch (sourceNumber) {
    case 1: return 6 - 5 * .5 ** n;
    case 2: return branch ? 3 - 5 * (1 / 3) ** n : 2 + n;
    case 31: return 2.5 * (1 - .6 ** n);
    case 36: { const v = .4 * (-.5) ** n; return (1 + 2 * v) / (1 - v); }
    case 39: return -6 + 10 * .5 ** n;
    case 46: return -5 + 1.5 * n;
    case 48: return 38 / 7 + (branch ? 18 / 7 : -24 / 7) * (5 / 12) ** n;
    case 49: { const v = -((1 / 3) ** n); return (3 - v) / (1 - v); }
    case 52: { let u = 0; for (let i = 0; i < n; i++) u = Math.sqrt(u + 6); return u; }
    default: return NaN;
  }
}
export const annualSalary = (rank: number, proportional: boolean) => proportional ? 750000 * 1.04 ** rank : 750000 + 30000 * rank;
export const salaryTotal = (years: number, proportional: boolean) => proportional ? 750000 * (1.04 ** years - 1) / .04 : years * 750000 + 30000 * years * (years - 1) / 2;
export const cumulativeCases = (day: number) => (day + 1) * (60 * day + 1);
export const inflationFactor = 1.06 ** 3 * 1.07 ** 2 * 1.075 * 1.08 * 1.1;
export const cobwebFunctions: Readonly<Record<number, { fn: (x: number) => number; max: number; label: string }>> = {
  31: { fn: x => .6 * x + 1, max: 2.8, label: "f(x) = 3x/5 + 1" },
  36: { fn: x => 2 / (1 + x), max: 3.2, label: "f(x) = 2/(1 + x)" },
  49: { fn: x => 4 - 3 / x, max: 3.3, label: "f(x) = 4 − 3/x" },
  52: { fn: x => Math.sqrt(x + 6), max: 3.4, label: "f(x) = √(x + 6)" },
};
export function cobwebSteps(sourceNumber: number, rank: number): Array<[number, number]> {
  const model = cobwebFunctions[sourceNumber];
  if (!model) return [];
  let x = sequenceValue(sourceNumber, 0);
  const result: Array<[number, number]> = [[x, 0]];
  for (let i = 0; i < Math.min(12, Math.max(0, Math.trunc(rank))); i++) {
    const y = model.fn(x);
    result.push([x, y], [y, y]); x = y;
  }
  return result;
}
