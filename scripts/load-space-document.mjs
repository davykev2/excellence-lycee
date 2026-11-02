/** Explicit dependency graph for historical CommonJS source audits. */
export function loadSpaceDocument(load){
  return load("apps/web/src/data/courseDocuments/terminalCSpaceDocument.ts",{
    "./terminalCSpaceSummaryA":load("apps/web/src/data/courseDocuments/terminalCSpaceSummaryA.ts"),
    "./terminalCSpaceSummaryB":load("apps/web/src/data/courseDocuments/terminalCSpaceSummaryB.ts"),
    "./terminalCSpaceEvaluations":load("apps/web/src/data/courseDocuments/terminalCSpaceEvaluations.ts"),
  });
}
