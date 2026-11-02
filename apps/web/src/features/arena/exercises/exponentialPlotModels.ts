import type { DerivativePlotModel } from "./derivativePlotModels";

/** Fixed reviewed expressions, never interpreted learner code. */
export const expStudyF = (x: number) => x / (1 + x * Math.exp(x));
export const expStudyG = (x: number) => 1 - x * x * Math.exp(x);
export const expStudyH = (x: number) => x + Math.exp(x / 2);
export const expTwoStudyF = (x: number) => (x - .5) * Math.exp(2 * x) - 4 * (x - 1) * Math.exp(x) - 2;
export const expTwoStudyG = (x: number) => x === 0 ? -2 : (x * x - 4 * x) * Math.log(x) - .5 * (x * x - 8 * x + 4);
export const expTwoStudyPrimitive = (x: number) => (x - 1) / 2 * Math.exp(2 * x) + 4 * (2 - x) * Math.exp(x) - 2 * x - 17 / 2;
export const expIteration = (x: number) => -2 / Math.E * Math.exp(x / 2);
export const expIterationValue = (n: number) => { let value = -.5; for (let i = 0; i < n; i++) value = expIteration(value); return value; };
export const boutiques = (x: number) => 5 + x * Math.exp(.2 * x - 1);
export const coolingRate = 2 * Math.log(12 / 11);
export const coolingElapsed = Math.log(17 / 12) / coolingRate;
export const coolingTemperature = (t: number) => 17 * Math.exp(-coolingRate * t) + 20;
export const exponentialPlotModels: Record<number, DerivativePlotModel> = {
  15: { bounds: [-3, 3, -3, 3], orthonormal: true, series: [{ fn: x => x === 0 ? 0 : x * x / -Math.expm1(x), ranges: [[-3, 0], [0, 3]], label: "f(x) = x²/(1 − eˣ), f(0)=0" }], guides: [{ label: "Tangente y = −x", from: [-3, 3], to: [3, -3] }], points: [{ x: 0, y: 0, label: "O" }] },
  19: { bounds: [-1, 5, -1, 1], orthonormal: true, series: [{ fn: x => x / 3 ** x, ranges: [[-1, 5]], label: "f(x) = x/3ˣ" }], guides: [{ label: "Asymptote y = 0", from: [-1, 0], to: [5, 0] }], points: [{ x: 1 / Math.log(3), y: 1 / (Math.E * Math.log(3)), label: "Maximum" }] },
  24: { bounds: [-3, 3, -3, 7], orthonormal: true, series: [{ fn: x => Math.exp(2 * x) / Math.expm1(x), ranges: [[-3, -.015], [.015, 3]], label: "Courbe de f" }, { fn: x => 1 + Math.exp(x), ranges: [[-3, 3]], label: "Γ : y = 1 + eˣ", secondary: true }], guides: [{ label: "x = 0", from: [0, -3], to: [0, 7] }, { label: "y = 0 à gauche", from: [-3, 0], to: [3, 0] }], points: [{ x: Math.log(2), y: 4, label: "Minimum" }] },
  25: { bounds: [-2, 4, -2, 1], orthonormal: true, series: [{ fn: expStudyF, ranges: [[-2, 4]], label: "Courbe de f" }], guides: [{ label: "y = x à gauche", from: [-2, -2], to: [1, 1] }, { label: "y = 0 à droite", from: [-2, 0], to: [4, 0] }], points: [{ x: .7034674224983917, y: .2905053586470908, label: "Maximum" }, { x: 0, y: 0, label: "O" }] },
  26: { bounds: [-3, 4, -2, 5], orthonormal: true, series: [{ fn: x => (2 * x + 4) * Math.exp(-x / 2) - x, ranges: [[-3, 4]], label: "Courbe de f" }], guides: [{ label: "D : y = −x", from: [-3, 3], to: [4, -4] }], points: [{ x: -.7034674224983917, y: 4.389587166030858, label: "Maximum" }, { x: 0, y: 4, label: "(0 ; 4)" }] },
  27: { bounds: [-3, 2, -2.5, 2.5], orthonormal: true, series: [{ fn: expTwoStudyF, ranges: [[-3, 2]], label: "Partie A · f" }], guides: [{ label: "Asymptote y = −2", from: [-3, -2], to: [2, -2] }], points: [{ x: -1.6121769451183363, y: 0, label: "α" }, { x: 0, y: 1.5, label: "Max." }, { x: Math.log(2), y: 4 - 4 * Math.log(2), label: "Min." }] },
  28: { bounds: [-3, 2.5, -3, 2], orthonormal: true, series: [{ fn: x => 2 ** (x + 1) - 4 ** x, ranges: [[-3, 2.5]], label: "f(x) = 2ˣ⁺¹ − 4ˣ" }], guides: [{ label: "y = 0", from: [-3, 0], to: [2.5, 0] }, { label: "y = 3/4", from: [-3, .75], to: [2.5, .75] }, { label: "y = −2", from: [-3, -2], to: [2.5, -2] }], points: [{ x: 0, y: 1, label: "Maximum" }, { x: 1, y: 0, label: "(1 ; 0)" }] },
  33: { bounds: [-.5, 4.5, -.5, 4.5], orthonormal: true, series: [{ fn: x => 1 / x, ranges: [[.025, 4.5]], label: "f(x) = 1/x, x > 0" }], guides: [{ label: "x = 0", from: [0, -.5], to: [0, 4.5] }, { label: "y = 0", from: [-.5, 0], to: [4.5, 0] }], points: [{ x: 1, y: 1, label: "(1 ; 1)" }] },
  37: { bounds: [-4, 4, -2, 6], orthonormal: true, series: [{ fn: x => (Math.exp(x) - 3) / Math.expm1(x), ranges: [[-4, -.015], [.015, 4]], label: "Courbe de f" }], guides: [{ label: "x = 0", from: [0, -2], to: [0, 6] }, { label: "y = 1 à droite", from: [-4, 1], to: [4, 1] }, { label: "y = 3 à gauche", from: [-4, 3], to: [4, 3] }], points: [{ x: Math.log(3), y: 0, label: "(ln 3 ; 0)" }] },
  38: { bounds: [-3, 3, -6, 7], orthonormal: true, series: [{ fn: x => 2 * x + 1 + 1 / Math.expm1(x), ranges: [[-3, -.015], [.015, 3]], label: "Courbe de f" }], guides: [{ label: "D : y = 2x + 1", from: [-3, -5], to: [3, 7] }, { label: "D′ : y = 2x", from: [-3, -6], to: [3, 6] }, { label: "x = 0", from: [0, -6], to: [0, 7] }], points: [{ x: -Math.log(2), y: -2 * Math.log(2) - 1, label: "Maximum à gauche" }, { x: Math.log(2), y: 2 * Math.log(2) + 2, label: "Minimum à droite" }] },
  39: { bounds: [-1, 5, -.5, 3], orthonormal: true, series: [{ fn: x => x * x * Math.exp(-x), ranges: [[-1, 5]], label: "f(x) = x² e⁻ˣ" }], guides: [{ label: "y = 4/e²", from: [-1, 4 / Math.E ** 2], to: [5, 4 / Math.E ** 2] }], points: [{ x: 2, y: 4 / Math.E ** 2, label: "Maximum local" }, { x: -.5569290855221476, y: 4 / Math.E ** 2, label: "α" }, { x: 0, y: 0, label: "O" }] },
};
