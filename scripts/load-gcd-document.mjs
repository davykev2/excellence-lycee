/** Explicit dependency map; the legacy audits never resolve arbitrary imports. */
export function loadGcdDocument(load){
 const math=load("apps/web/src/features/mathematics/gcdMath.ts");
 const writing=load("apps/web/src/data/courseDocuments/gcdWriting.ts",{"../../features/mathematics/gcdMath":math});
 const deps={"./gcdWriting":writing};
 return load("apps/web/src/data/courseDocuments/terminalCGcdDocument.ts",{
  "./terminalCGcdSummaryA":load("apps/web/src/data/courseDocuments/terminalCGcdSummaryA.ts",deps),
  "./terminalCGcdSummaryB":load("apps/web/src/data/courseDocuments/terminalCGcdSummaryB.ts",deps),
  "./terminalCGcdEvaluations":load("apps/web/src/data/courseDocuments/terminalCGcdEvaluations.ts",deps),
 });
}
