import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { terminalCProbabilityDocument as course } from "../apps/web/src/data/courseDocuments/terminalCProbabilityDocument";
import { terminalCProbabilityPath as path } from "../apps/web/src/data/terminalCProbabilityPath";
import { terminalDMathematicsPaths } from "../apps/web/src/data/terminalDMathPaths";
import { documentAnswerStatus,documentAssessmentScore,documentDraftKey,restoreDocumentDraft } from "../apps/web/src/features/lesson/document/documentAssessment";
import { binomialProbability,finiteLawParameters,cumulativeProbability,probabilityTree,probabilityCdf,treePaths } from "../apps/web/src/features/mathematics/probabilityModels";
const topics=course.sections.flatMap(s=>s.topics),near=(a:number,b:number,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol*Math.max(1,Math.abs(b)),a+" ≠ "+b);

test("Pyramide L9 : résumé complet en3rubriques/13sous-sections/15exemples et3méthodes",()=>{
  assert.equal(path.id,"terminale-c-math-l17-probability");assert.equal(path.chapterNumber,17);assert.equal(path.courseDocument,course);
  assert.equal(path.theme.title,"Analyse et probabilité");assert.deepEqual(course.levelIds,["terminale-c"]);
  assert.equal(course.source.lessonLabel,"Tome 1 · Leçon 9");assert.deepEqual(course.source.summaryPages,[223,224,225,226,227,228,229,230]);assert.deepEqual(course.source.evaluationPages,[231,232]);
  assert.deepEqual(course.sections.map(s=>s.topics.length),[5,5,3]);assert.equal(topics.flatMap(t=>t.examples??[]).length,15);
  assert.equal(course.evaluations.length,3);assert.equal(course.evaluations.flatMap(g=>g.questions).length,2);assert.equal(course.evaluations.flatMap(g=>g.writtenTasks??[]).length,3);
});
test("8IDs/poids/132questions et8fils conservés ; la Terminale D partage le contenu C",()=>{
  const lessons=path.modules.flatMap(m=>m.lessons);
  assert.deepEqual(lessons.map(l=>l.id),Object.keys(course.legacyAnchors));assert.deepEqual(lessons.map(l=>l.xp),[50,55,60,65,70,75,80,85]);
  assert.equal(lessons.reduce((sum,l)=>sum+(l.questions?.length??1),0),132);
  assert.deepEqual(topics.flatMap(t=>t.legacyLessonIds??[]).sort(),lessons.map(l=>l.id).sort());
  for(const t of topics)for(const id of t.legacyLessonIds??[])assert.equal(course.legacyAnchors[id],t.id);
  const d=terminalDMathematicsPaths.find(p=>p.id==="terminale-d-math-l02-probability")!;
  assert.ok(d);assert.deepEqual(d.courseDocument?.levelIds,["terminale-d"]);
  assert.strictEqual(d.courseDocument?.sections,course.sections);assert.strictEqual(d.courseDocument?.evaluations,course.evaluations);
});
test("hypothèses et corrections scientifiques restent explicites, sans notices publiques",()=>{
  const by=(id:string)=>topics.find(t=>t.id===id)!;
  assert.match(by("prob-condition").body,/P\(A\)>0/);assert.match(by("prob-total").body,/partition/);assert.match(by("prob-independence").body,/incompatibles/);
  assert.match(by("prob-bernoulli").body,/indépendantes/);assert.match(by("prob-cdf").body,/inférieures ou égales/);
  assert.match(by("prob-complements").examples![0].solution!,/0,18/);assert.match(by("prob-complements").examples![0].solution!,/ne sont donc pas indépendants/);
  assert.match(by("prob-variable").examples![0].parts![1].solution,/BB,OB,BV,OO/);
  const examples=[...topics.flatMap(t=>t.examples??[]),...course.evaluations.flatMap(g=>g.examples)];
  const ids=examples.flatMap(e=>[e.id,...(e.parts??[]).map(p=>p.id)]);assert.equal(new Set(ids).size,ids.length);
  for(const e of examples){assert.ok(Boolean(e.solution)!==Boolean(e.parts?.length));for(const part of e.parts??[]){assert.ok(part.label);assert.ok(part.prompt);assert.ok(part.solution.length>50);}}
  const {source,...visible}=course;assert.ok(source.editorialNotes?.length);assert.doesNotMatch(JSON.stringify(visible),/coquille|Excellence rétablit|Solution commentée/i);
});
test("exemples : dénominateurs, gains nets, variance et modèle familial vérifiés indépendamment",()=>{
  near((161/867)/(480/867),161/480);near(.4*.8+.6*.3,.5);near(.6*.4+.4*.2,.32);
  near((.5*5/8)/(.5*5/8+.5/5),25/33);
  near((-100*19+100*18)/37,-100/37);
  const law=finiteLawParameters([-20,-10,10,20,30],[1/5,3/10,1/6,1/12,1/4]);
  near(law.expectation,23/6);near(law.variance,13331/36);near(law.sigma,Math.sqrt(13331)/6);
  const family=[.132651,.382347,.367353,.117649];
  family.forEach((p,k)=>near(binomialProbability(3,k,.49),p));
  const stats=finiteLawParameters([0,1,2,3],family);near(stats.expectation,1.47);near(stats.variance,.7497);
  for(const p of[.001,.02,.5,.99])near(.99*p/(.99*p+.01*(1-p)),99*p/(98*p+1));
});
test("arbres et répartition : sommes, chemins, points de saut et paramètres extrêmes",()=>{
  for(const preset of["bag","coupons","urns"] as const){
    const model=probabilityTree(preset)!;near(treePaths(model.root).reduce((sum,p)=>sum+p.probability,0),1);
    const walk=(node:typeof model.root)=>{if(node.children){near(node.children.reduce((sum,c)=>sum+c.probability!,0),1);node.children.forEach(walk);}};walk(model.root);
  }
  const cdf=probabilityCdf("cdf")!;
  near(cumulativeProbability(cdf.values,cdf.masses,3),1/3);
  near(cumulativeProbability(cdf.values,cdf.masses,3)-cumulativeProbability(cdf.values,cdf.masses,3-1e-6),1/21);
  near(cumulativeProbability(cdf.values,cdf.masses,-Infinity),0);near(cumulativeProbability(cdf.values,cdf.masses,Infinity),1);
  for(const n of[0,1,3,20]){near(binomialProbability(n,0,0),1);near(binomialProbability(n,n,1),1);if(n){near(binomialProbability(n,1,0),0);near(binomialProbability(n,0,1),0);}}
  assert.throws(()=>binomialProbability(3,1,1.1));assert.throws(()=>binomialProbability(-1,0,.5));
  assert.throws(()=>cumulativeProbability([1,1],[.5,.5],1));assert.throws(()=>cumulativeProbability([1,2],[.2,.3],1));
});
test("deux notes objectives, trois rédactions sans score et brouillons cloisonnés",()=>{
  const qs=course.evaluations.flatMap(g=>g.questions),tasks=course.evaluations.flatMap(g=>g.writtenTasks??[]);
  assert.equal(documentAnswerStatus(qs[0],"20/6"),"correct");assert.equal(documentAnswerStatus(qs[0],"3"),"incorrect");assert.equal(documentAnswerStatus(qs[1],""),"unanswered");
  assert.equal(documentAssessmentScore(qs,{[qs[0].id]:"10/3"}).outOf20,10);
  assert.equal(documentAssessmentScore(qs,{[qs[0].id]:"10/3",[qs[1].id]:"20/9"}).outOf20,20);
  const restored=restoreDocumentDraft(JSON.stringify({answers:{[qs[0].id]:"10/3",unknown:"1"},written:{[tasks[0].id]:"Mon calcul",unknown:"x"},submitted:true,correctionsOpen:true}),course);
  assert.equal(Object.keys(restored.answers).length,1);assert.equal(Object.keys(restored.written).length,1);assert.equal("correctionsOpen" in restored,false);
  for(const t of tasks){assert.ok(topics.some(topic=>topic.id===t.topicId));assert.equal(t.criteria.length,3);assert.ok(t.model.length>200);}
  assert.notEqual(documentDraftKey("a",path.id,course),documentDraftKey("b",path.id,course));
  const worked=readFileSync(new URL("../apps/web/src/features/lesson/document/WorkedExampleContent.tsx",import.meta.url),"utf8");
  assert.match(worked,/example\.nativeFigure && <DocumentNativeFigure/);
  const css=readFileSync(new URL("../apps/web/src/styles/probability-figures.css",import.meta.url),"utf8");
  assert.match(css,/min-height: 44px/);assert.match(css,/font-size: 16px/);
});
