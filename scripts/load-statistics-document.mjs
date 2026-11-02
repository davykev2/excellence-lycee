/** Explicit dependency graph for the historical CommonJS source audits. */
export function loadStatisticsDocument(load) {
  const models=load("apps/web/src/features/mathematics/statisticsModels.ts");
  const writing=load("apps/web/src/data/courseDocuments/statisticsWriting.ts",{"../../features/mathematics/statisticsModels":models});
  const deps={"./statisticsWriting":writing,"../../features/mathematics/statisticsModels":models};
  return load("apps/web/src/data/courseDocuments/terminalCStatisticsDocument.ts",{
    "./terminalCStatisticsSummaryA":load("apps/web/src/data/courseDocuments/terminalCStatisticsSummaryA.ts",deps),
    "./terminalCStatisticsSummaryB":load("apps/web/src/data/courseDocuments/terminalCStatisticsSummaryB.ts",deps),
    "./terminalCStatisticsEvaluations":load("apps/web/src/data/courseDocuments/terminalCStatisticsEvaluations.ts",deps),
  });
}
