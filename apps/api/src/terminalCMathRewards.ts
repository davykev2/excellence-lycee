export const terminalCMathLessonIds = [
  ["terminale-c-math-l01-limits-continuity", [
    "limit-composition", "monotone-finite-limit", "parabolic-branches", "continuous-extension",
    "continuous-image-interval", "continuity-operations", "continuous-bijection-inverse",
    "intermediate-value-theorem", "rational-powers", "complete-function-study-mission",
  ]],
  ["terminale-c-math-l02-barycenter", [
    "weighted-barycenter", "isobarycenter-homogeneity", "weighted-vector-reduction", "barycenter-coordinates",
    "partial-barycenter", "quadratic-level-sets", "apollonius-level-set", "oriented-angle-level-set",
  ]],
  ["terminale-c-math-l03-divisibility", [
    "integer-divisibility", "euclidean-division-z", "remainders-operations", "congruences",
    "numeration-divisibility-tests", "prime-numbers", "prime-factorization", "number-of-divisors",
  ]],
  ["terminale-c-math-l04-derivatives-functions", [
    "one-sided-derivatives", "derivative-at-junction", "vertical-half-tangent", "derivative-composition",
    "inverse-function-derivative", "successive-derivatives", "finite-increments", "lipschitz-bound",
  ]],
  ["terminale-c-math-l05-space-analytic-geometry", [
    "plane-normal-vector", "plane-cartesian-equation", "line-parametric-form", "relative-lines-space",
    "line-plane-position", "relative-planes",
  ]],
  ["terminale-c-math-l06-primitives", [
    "primitive-definition", "primitive-existence", "primitive-initial-value", "usual-primitives",
    "primitive-linearity", "composite-primitives",
  ]],
  ["terminale-c-math-l07-conics", [
    "conic-focus-directrix", "conic-axis-vertices", "conic-region", "parabola-reduced-equation",
    "ellipse-reduced-equation", "hyperbola-reduced-equation",
  ]],
  ["terminale-c-math-l08-logarithms", [
    "natural-log-definition", "log-algebra", "log-equations", "log-limits", "log-derivative",
    "log-primitives", "other-log-bases",
  ]],
  ["terminale-c-math-l09-complex-numbers", [
    "complex-algebra", "complex-powers", "complex-conjugate", "complex-modulus", "complex-arguments",
    "trigonometric-form", "exponential-form", "moivre-linearization", "complex-equations", "roots-of-unity",
  ]],
  ["terminale-c-math-l10-exponential-power", [
    "exp-properties", "exp-equations", "exp-limits", "exp-derivative", "exp-primitives",
    "real-powers", "power-equations", "growth-comparison",
  ]],
  ["terminale-c-math-l11-lcm-gcd", [
    "common-multiples-lcm", "common-divisors-gcd", "euclidean-algorithm", "bezout-identity",
    "gauss-theorem", "gcd-lcm-relation", "diophantine-solvability", "diophantine-congruences",
  ]],
  ["terminale-c-math-l12-sequences", [
    "sequence-induction", "sequence-monotonicity", "sequence-limit-algebra", "monotone-convergence",
    "reference-sequences", "sequence-growth", "small-angle-sequence", "recursive-sequence-limit",
  ]],
  ["terminale-c-math-l13-complex-geometry", [
    "complex-angle", "complex-distance-ratio", "complex-loci", "complex-align-orthogonal", "complex-cyclic-triangles",
    "complex-transformation", "similarity-elements", "similarity-from-data", "similarity-decomposition", "similarity-images",
  ]],
  ["terminale-c-math-l14-plane-isometries", [
    "isometry-invariants", "reflection-compositions", "reflection-translation-rotation", "direct-isometries",
    "opposite-isometries", "glide-reflection", "isometry-fixed-points", "isometry-applications",
  ]],
  ["terminale-c-math-l15-integral-calculus", [
    "definite-integral", "integral-area", "chasles-linearity", "integral-order",
    "integral-bounds-mean", "integration-by-parts", "integral-substitution", "integral-symmetry-function",
  ]],
  ["terminale-c-math-l16-direct-similarities", [
    "similarity-definition", "similarity-composition-inverse", "similarity-invariants", "similarity-canonical",
    "similarity-complex-form", "similarity-center-form", "similarity-from-images", "similarity-center-construction",
    "similarity-applications",
  ]],
  ["terminale-c-math-l17-probability", [
    "conditional-probability", "product-independence", "partition-total-probability", "random-variable-law",
    "expectation-variance", "bernoulli-binomial", "binomial-parameters", "cumulative-distribution",
  ]],
  ["terminale-c-math-l18-differential-equations", [
    "first-order-homogeneous", "first-order-constant", "first-order-initial-value",
    "second-order-hyperbolic", "second-order-oscillatory", "second-order-initial-values",
  ]],
  ["terminale-c-math-l19-statistics", [
    "scatter-plot", "mean-point", "covariance", "correlation", "regression-lines", "statistical-estimation",
  ]],
] as const;

export function terminalCMathRewardWeight(index: number) {
  return 50 + Math.min(index, 7) * 5;
}
