/** Explicit, bounded dependency map for the historical curriculum audits. */
export function loadComplexDocument(load){
 const math=load("apps/web/src/features/mathematics/complexMath.ts");
 const writing=load("apps/web/src/data/courseDocuments/complexWriting.ts",{"../../features/mathematics/complexMath":math});
 return load("apps/web/src/data/courseDocuments/terminalCComplexDocument.ts",{
  "./terminalCComplexSummaryA":load("apps/web/src/data/courseDocuments/terminalCComplexSummaryA.ts",{"./complexWriting":writing}),
  "./terminalCComplexSummaryB":load("apps/web/src/data/courseDocuments/terminalCComplexSummaryB.ts"),
  "./terminalCComplexSummaryC":load("apps/web/src/data/courseDocuments/terminalCComplexSummaryC.ts"),
  "./terminalCComplexEvaluations":load("apps/web/src/data/courseDocuments/terminalCComplexEvaluations.ts"),
 });
}
