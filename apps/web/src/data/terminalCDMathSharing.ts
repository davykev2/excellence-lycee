/** Programme correspondence only: no lesson content or learner state is copied here. */
export const terminalCDMathPairs = [
  { key: "limits", c: "terminale-c-math-l01-limits-continuity", d: "terminale-d-math-l01-limits-continuity", chapterD: 1, skillsPdfPageD: 10 },
  { key: "derivatives", c: "terminale-c-math-l04-derivatives-functions", d: "terminale-d-math-l03-derivatives-functions", chapterD: 3, skillsPdfPageD: 80 },
  { key: "primitives", c: "terminale-c-math-l06-primitives", d: "terminale-d-math-l04-primitives", chapterD: 4, skillsPdfPageD: 106 },
  { key: "logarithms", c: "terminale-c-math-l08-logarithms", d: "terminale-d-math-l05-logarithms", chapterD: 5, skillsPdfPageD: 120 },
  { key: "complex", c: "terminale-c-math-l09-complex-numbers", d: "terminale-d-math-l06-complex-numbers", chapterD: 6, skillsPdfPageD: 140 },
  { key: "exponential", c: "terminale-c-math-l10-exponential-power", d: "terminale-d-math-l07-exponential-power", chapterD: 7, skillsPdfPageD: 176 },
  { key: "sequences", c: "terminale-c-math-l12-sequences", d: "terminale-d-math-l09-sequences", chapterD: 9, skillsPdfPageD: 232 },
  { key: "geometry", c: "terminale-c-math-l13-complex-geometry", d: "terminale-d-math-l08-complex-geometry", chapterD: 8, skillsPdfPageD: 200 },
  { key: "integrals", c: "terminale-c-math-l15-integral-calculus", d: "terminale-d-math-l10-integral-calculus", chapterD: 10, skillsPdfPageD: 254 },
  { key: "probability", c: "terminale-c-math-l17-probability", d: "terminale-d-math-l02-probability", chapterD: 2, skillsPdfPageD: 50 },
  { key: "differential", c: "terminale-c-math-l18-differential-equations", d: "terminale-d-math-l12-differential-equations", chapterD: 12, skillsPdfPageD: 312 },
  { key: "statistics", c: "terminale-c-math-l19-statistics", d: "terminale-d-math-l11-statistics", chapterD: 11, skillsPdfPageD: 288 },
] as const;

/** Inspected for programme compatibility, not falsely attributed as the content's source. */
export const terminalDMathProgrammeSource = {
  title: "Pyramide-Tle-D-maths.pdf",
  pageCount: 343,
  sha256: "F18EBEB14490B81F21C74957181B61F321077C9E237B9F78ADAE8AEEDA17396E",
  contentsPdfPage: 8,
} as const;

export function getTerminalCDMathPair(pathId: string, levelId: string) {
  if (levelId === "terminale-c") return terminalCDMathPairs.find(pair => pair.c === pathId) ?? null;
  if (levelId === "terminale-d") return terminalCDMathPairs.find(pair => pair.d === pathId) ?? null;
  return null;
}
