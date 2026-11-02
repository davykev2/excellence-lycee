/** Explicit dependencies for the existing CommonJS curriculum audits. */
export function loadConicsDocument(load){
  const helpers=load("apps/web/src/data/exerciseCollections/conicSolutions.ts");
  const deps={"../exerciseCollections/conicSolutions":helpers};
  return load("apps/web/src/data/courseDocuments/terminalCConicsDocument.ts",{
    "./terminalCConicsSummaryA":load("apps/web/src/data/courseDocuments/terminalCConicsSummaryA.ts"),
    "./terminalCConicsSummaryB":load("apps/web/src/data/courseDocuments/terminalCConicsSummaryB.ts",deps),
    "./terminalCConicsSummaryC":load("apps/web/src/data/courseDocuments/terminalCConicsSummaryC.ts"),
    "./terminalCConicsEvaluations":load("apps/web/src/data/courseDocuments/terminalCConicsEvaluations.ts",deps),
  });
}
