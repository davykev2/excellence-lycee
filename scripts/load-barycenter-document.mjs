/** Explicit dependency graph for the historical CommonJS source audits. */
export function loadBarycenterDocument(load){
  return load("apps/web/src/data/courseDocuments/terminalCBarycenterDocument.ts",{
    "./terminalCBarycenterSummaryA":load("apps/web/src/data/courseDocuments/terminalCBarycenterSummaryA.ts"),
    "./terminalCBarycenterSummaryB":load("apps/web/src/data/courseDocuments/terminalCBarycenterSummaryB.ts"),
    "./terminalCBarycenterEvaluations":load("apps/web/src/data/courseDocuments/terminalCBarycenterEvaluations.ts"),
  });
}
