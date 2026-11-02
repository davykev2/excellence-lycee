import type { DerivativePlotModel, DerivativePlotSeries } from "./derivativePlotModels";

const curve = (fn: (x: number) => number, ranges: Array<[number, number]>, label: string, secondary = false): DerivativePlotSeries => ({ fn, ranges, label, secondary });
const vertical = (x: number, lo: number, hi: number) => ({ label: `x = ${x}`, from: [x, lo] as [number, number], to: [x, hi] as [number, number] });
const line = (label: string, m: number, b: number, lo: number, hi: number) => ({ label, from: [lo, m * lo + b] as [number, number], to: [hi, m * hi + b] as [number, number] });

/** Fixed mathematical definitions, never a user-supplied expression evaluator. */
export const logarithmFunctions = {
  28: (x: number) => x === 0 ? 0 : x === 1 ? -1 : x > 0 ? x * Math.log(x) / (1 - x) : NaN,
  29: (x: number) => x !== 1 ? (x + Math.log(Math.abs(1 - x))) / (1 - x) : NaN,
  31: (x: number) => x === 0 ? 0 : x > 0 ? .5 * x * x * Math.log(x) - .75 * x * x : NaN,
  34: (x: number) => x > 1 ? Math.log(x) / (x - 1) : NaN,
  35: (x: number) => x < -1 ? Math.log(-x) : (x + 1) ** 2,
  36: (x: number) => x > 0 ? (1 + Math.log(x)) / x : NaN,
  37: (x: number) => x === 0 ? 1 : x > 0 ? Math.log1p(x) / x : NaN,
  38: (x: number) => x > 4 ? -2 * x + 5 + 3 * Math.log((x + 1) / (x - 4)) : NaN,
};
export const logAuxiliaryG = (x: number) => x > 0 ? x * Math.log(x) - x + 1 : NaN;
export const logIterationH = (x: number) => Math.log(x) + x / 2 + .5;
export const logFamily = (x: number, n: number) => x > 0 && Number.isInteger(n) && n >= 1 ? (1 + n * Math.log(x)) / (x * x) : NaN;
export const festivalLevel = (distance: number) => distance > 0 ? 110 - 20 * Math.log10(distance / 10) : NaN;

export const logarithmPlotModels: Readonly<Record<number, DerivativePlotModel>> = {
  28: { bounds: [0, 5, -3, 2], orthonormal: true, series: [curve(logarithmFunctions[28], [[0, 5]], "Courbe du prolongement g")], guides: [vertical(0, -3, 2), line("Tangente en (1 ; −1)", -.5, -.5, 0, 5)], points: [{ x: 0, y: 0, label: "O" }, { x: 1, y: -1, label: "A" }] },
  29: { bounds: [-4, 6, -6, 4], orthonormal: true, series: [curve(logarithmFunctions[29], [[-4, .995], [1.005, 6]], "Courbe de f")], guides: [vertical(1, -6, 4), line("y = −1", 0, -1, -4, 6)], points: [{ x: 1, y: -1, label: "Centre A(1 ; −1)" }] },
  31: { bounds: [-1, 7, -3, 5], orthonormal: true, series: [curve(logarithmFunctions[31], [[0, 7]], "Courbe de h")], guides: [line("T : y = −x + 1/4", -1, .25, -1, 7)], points: [{ x: 0, y: 0, label: "O" }, { x: Math.E, y: -(Math.E ** 2) / 4, label: "Minimum" }, { x: Math.exp(1.5), y: 0, label: "e^(3/2)" }] },
  34: { bounds: [0, 5, -1, 2], orthonormal: true, step: [1, .5], series: [curve(logarithmFunctions[34], [[1.001, 5]], "f(x) = ln(x)/(x−1)")], guides: [line("y = 1/2", 0, .5, 0, 5), line("Asymptote y = 0", 0, 0, 0, 5)], points: [{ x: 3.5128624172523386, y: .5, label: "α" }] },
  35: { bounds: [-4, 2, -2, 4], orthonormal: true, series: [curve(logarithmFunctions[35], [[-4, -1], [-1, 2]], "Courbe de g")], guides: [line("Demi-tangente gauche", -1, -1, -4, -1), line("Demi-tangente droite", 0, 0, -1, 2)], points: [{ x: -1, y: 0, label: "A(−1 ; 0)" }] },
  36: { bounds: [0, 4, -2, 2], orthonormal: true, step: [.5, .5], series: [curve(logarithmFunctions[36], [[.03, 4]], "Courbe de f")], guides: [vertical(0, -2, 2), line("T : y = e²x − e", Math.E ** 2, -Math.E, 0, 4), line("Asymptote y = 0", 0, 0, 0, 4)], points: [{ x: 1 / Math.E, y: 0, label: "A" }, { x: 1, y: 1, label: "B(1 ; 1)" }] },
  37: { bounds: [-.2, 4.8, -1.5, 1.5], orthonormal: true, step: [1, .5], series: [curve(logarithmFunctions[37], [[0, 4.8]], "Courbe du prolongement f")], guides: [line("Demi-tangente y = 1 − x/2", -.5, 1, 0, 4.8), line("Asymptote y = 0", 0, 0, 0, 4.8)], points: [{ x: 0, y: 1, label: "A(0 ; 1)" }] },
  38: { bounds: [3, 11, -9, 7], orthonormal: true, step: [1, 2], series: [curve(logarithmFunctions[38], [[4.01, 11]], "Courbe de f")], guides: [vertical(4, -9, 7), line("D : y = −2x + 5", -2, 5, 3, 11), line("Tangente en x = 5", -4.5, 17.5 + 3 * Math.log(6), 3, 11)], points: [{ x: 5, y: logarithmFunctions[38](5), label: "A" }, { x: 5.085641561497029, y: 0, label: "x₀" }] },
};
