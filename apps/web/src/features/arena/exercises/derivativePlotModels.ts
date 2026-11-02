export interface DerivativePlotSeries {
  label: string;
  fn: (x: number) => number;
  ranges: Array<[number, number]>;
  secondary?: boolean;
}
export interface DerivativePlotModel {
  bounds: [number, number, number, number];
  orthonormal?: boolean;
  step?: [number, number];
  series: DerivativePlotSeries[];
  guides?: Array<{ label: string; from: [number, number]; to: [number, number] }>;
  points?: Array<{ x: number; y: number; label: string }>;
}
const curve = (fn: (x: number) => number, ranges: Array<[number, number]>, label = "Courbe de f"): DerivativePlotSeries => ({ fn, ranges, label });
const vertical = (x: number, min: number, max: number) => ({ label: `x = ${x}`, from: [x, min] as [number, number], to: [x, max] as [number, number] });
const line = (label: string, m: number, b: number, min: number, max: number) => ({ label, from: [min, m * min + b] as [number, number], to: [max, m * max + b] as [number, number] });

/** Fixed, reviewed mathematical definitions. Never evaluate user-supplied code. */
export const derivativePlotModels: Readonly<Record<number, DerivativePlotModel>> = {
  27: {
    bounds: [-3, 3, -6, 6], series: [curve(x => x ** 3 - 3 * x + 1, [[-3, 3]])],
    guides: [line("T : y = −3x + 1", -3, 1, -3, 3)],
    points: [{ x: -1, y: 3, label: "A(−1 ; 3)" }, { x: 1, y: -1, label: "B(1 ; −1)" }],
  },
  28: {
    bounds: [-4, 4, -7, 7], series: [curve(x => (2 - x) / (2 * x + 1), [[-4, -.501], [-.499, 4]])],
    guides: [vertical(-.5, -7, 7), line("y = −1/2", 0, -.5, -4, 4), line("T : y = −5x + 2", -5, 2, -4, 4)],
    points: [{ x: 0, y: 2, label: "A(0 ; 2)" }],
  },
  29: {
    bounds: [-8, 10, -9, 28], step: [2, 5],
    series: [curve(x => x + 8 + 16 / (x - 1), [[-8, .999], [1.001, 10]])],
    guides: [vertical(1, -9, 28), line("y = x + 8", 1, 8, -8, 10)],
    points: [{ x: -3, y: 1, label: "A(−3 ; 1)" }, { x: 5, y: 17, label: "B(5 ; 17)" }],
  },
  30: {
    bounds: [-3, 5, -5, 5],
    series: [curve(x => .5 + 3 / (2 * x * (x - 2)), [[-3, -.001], [.001, 1.999], [2.001, 5]])],
    guides: [vertical(0, -5, 5), vertical(2, -5, 5), line("y = 1/2", 0, .5, -3, 5)],
    points: [{ x: 1, y: -1, label: "A(1 ; −1)" }],
  },
  31: {
    bounds: [-1, 7, -5, 7],
    series: [curve(x => Math.abs(x - 3) + 1 / (x - 2), [[-1, 1.999], [2.001, 3], [3, 7]])],
    guides: [vertical(2, -5, 7), line("y = −x + 3", -1, 3, -1, 2), line("y = x − 3", 1, -3, 3, 7)],
    points: [{ x: 3, y: 1, label: "A(3 ; 1)" }],
  },
  32: {
    bounds: [-2, 7, -5, 7],
    series: [curve(x => x - 3 + 1 / Math.abs(x - 2), [[-2, 1.999], [2.001, 7]])],
    guides: [vertical(2, -5, 7), line("y = x − 3", 1, -3, -2, 7)],
    points: [{ x: 3, y: 1, label: "A(3 ; 1)" }],
  },
  34: {
    bounds: [-2, 3, -1, 18], step: [1, 3], series: [curve(x => 3 * x * x + 5, [[-2, 3]])],
    guides: [line("T : y = 6x + 2", 6, 2, -2, 3)], points: [{ x: 1, y: 8, label: "A(1 ; 8)" }],
  },
  37: {
    bounds: [-5, 5, 0, 3], step: [1, .5], series: [curve(x => (2 * x * x + 1) / (x * x + 3), [[-5, 5]], "Courbe de g")],
    guides: [line("T : y = −20x/49 + 23/49", -20 / 49, 23 / 49, -5, 5)],
    points: [{ x: -2, y: 9 / 7, label: "A(−2 ; 9/7)" }],
  },
  38: {
    bounds: [-2, 2.5, -3, 4], series: [curve(x => x ** 3 - .5 * x * x - 2 * x + 1, [[-2, 2.5]])],
    points: [{ x: -2 / 3, y: 49 / 27, label: "A(−2/3 ; 49/27)" }, { x: 1, y: -.5, label: "B(1 ; −1/2)" }],
  },
  39: {
    bounds: [-4, 8, -6, 15], step: [2, 3],
    series: [curve(x => x + 3 + 4 / (x - 2), [[-4, 1.999], [2.001, 8]])],
    guides: [vertical(2, -6, 15), line("y = x + 3", 1, 3, -4, 8), line("T : y = −3x + 3", -3, 3, -4, 8)],
    points: [{ x: 0, y: 1, label: "A(0 ; 1)" }, { x: 4, y: 9, label: "B(4 ; 9)" }],
  },
  41: {
    bounds: [-1, 5, -4, 10], step: [1, 2],
    series: [curve(x => -x * x + 3 * x + 2, [[-1, 3]]), curve(x => x * x - 3 * x + 2, [[3, 5]])],
    guides: [line("T_g : y = −3x + 11", -3, 11, 1, 3), line("T_d : y = 3x − 7", 3, -7, 3, 5)],
    points: [{ x: 1.5, y: 17 / 4, label: "A(3/2 ; 17/4)" }, { x: 3, y: 2, label: "B(3 ; 2)" }],
  },
  42: {
    bounds: [-.3, 3.2, -2, 7], series: [curve(x => x * x - 2 * Math.sqrt(x), [[0, 3.2]])],
    guides: [vertical(0, -1, 0)],
    points: [{ x: 0, y: 0, label: "O" }, { x: 2 ** (-2 / 3), y: -3 * 2 ** (-4 / 3), label: "Minimum" }, { x: 2 ** (2 / 3), y: 0, label: "Racine positive" }],
  },
  43: {
    bounds: [-5, 5, -1.5, 1.5], step: [1, .5], series: [curve(x => x / (Math.abs(x) + 1), [[-5, 5]])],
    guides: [line("y = 1", 0, 1, -5, 5), line("y = −1", 0, -1, -5, 5), line("T : y = x", 1, 0, -5, 5)],
    points: [{ x: 0, y: 0, label: "O" }],
  },
  44: {
    bounds: [-7, 6, -13, 9], step: [2, 3],
    series: [curve(x => (x * x + Math.abs(x - 2)) / (x + 1), [[-7, -1.001], [-.999, 2], [2, 6]])],
    guides: [vertical(-1, -13, 9), line("D₁ : y = x − 2", 1, -2, -7, 2), line("D₂ : y = x", 1, 0, 2, 6)],
    points: [{ x: -3, y: -7, label: "A(−3 ; −7)" }, { x: 1, y: 1, label: "B(1 ; 1)" }, { x: 2, y: 4 / 3, label: "K" }],
  },
  45: {
    bounds: [-6, 3, -.6, 6], series: [curve(x => Math.sqrt(Math.max(0, x * x + 3 * x + 2)), [[-6, -2], [-1, 3]])],
    guides: [line("y = −x − 3/2", -1, -1.5, -6, -2), line("y = x + 3/2", 1, 1.5, -1, 3), line("T en 0", 3 / (2 * Math.sqrt(2)), Math.sqrt(2), -1, 3)],
    points: [{ x: -2, y: 0, label: "A(−2 ; 0)" }, { x: -1, y: 0, label: "B(−1 ; 0)" }, { x: 0, y: Math.sqrt(2), label: "C(0 ; √2)" }],
  },
  46: {
    bounds: [-3, 4, -3, 4], orthonormal: true,
    series: [curve(x => 1 + x / Math.sqrt(1 + x * x), [[-3, 4]]), { ...curve(x => (x - 1) / Math.sqrt(1 - (x - 1) ** 2), [[.001, 1.999]], "Courbe de f⁻¹"), secondary: true }],
    guides: [line("y = x", 1, 0, -3, 4), line("y = 0", 0, 0, -3, 4), line("y = 2", 0, 2, -3, 4), vertical(0, -3, 4), vertical(2, -3, 4)],
    points: [{ x: 0, y: 1, label: "A(0 ; 1)" }, { x: 1, y: 0, label: "B(1 ; 0)" }],
  },
  47: {
    bounds: [-.1, 1.2, -.1, 1.2], step: [.25, .25], orthonormal: true,
    series: [curve(x => (1 - Math.sqrt(x)) ** 2, [[0, 1]], "Courbe de f et de f⁻¹")],
    guides: [line("y = x", 1, 0, -.1, 1.2)],
    points: [{ x: 0, y: 1, label: "A(0 ; 1)" }, { x: 1, y: 0, label: "B(1 ; 0)" }, { x: .25, y: .25, label: "I(1/4 ; 1/4)" }],
  },
};
