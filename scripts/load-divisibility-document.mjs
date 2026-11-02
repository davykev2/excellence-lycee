/** Explicit dependency graph for historical CommonJS source audits. */
export function loadDivisibilityDocument(load){
  return load("apps/web/src/data/courseDocuments/terminalCDivisibilityDocument.ts",{
    "./terminalCDivisibilitySummaryA":load("apps/web/src/data/courseDocuments/terminalCDivisibilitySummaryA.ts"),
    "./terminalCDivisibilitySummaryB":load("apps/web/src/data/courseDocuments/terminalCDivisibilitySummaryB.ts"),
    "./terminalCDivisibilitySummaryC":load("apps/web/src/data/courseDocuments/terminalCDivisibilitySummaryC.ts"),
    "./terminalCDivisibilityEvaluations":load("apps/web/src/data/courseDocuments/terminalCDivisibilityEvaluations.ts"),
  });
}
