import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { terminalCStatisticsDocument as course } from "../apps/web/src/data/courseDocuments/terminalCStatisticsDocument";
import { terminalCStatisticsPath as path } from "../apps/web/src/data/terminalCStatisticsPath";
import { terminalDMathematicsPaths } from "../apps/web/src/data/terminalDMathPaths";
import { bivariateStatistics as calc,marginalDistributions,statisticsData as d } from "../apps/web/src/features/mathematics/statisticsModels";
import { documentAnswerStatus,documentAssessmentScore,documentDraftKey,restoreDocumentDraft } from "../apps/web/src/features/lesson/document/documentAssessment";
const topics=course.sections.flatMap(s=>s.topics);
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-9*Math.max(1,Math.abs(b)),a+" ≠ "+b);
test("Pyramide L10 : sept rubriques, huit sous-sections, quatre méthodes, exemples et applications complets",()=>{
  assert.equal(path.id,"terminale-c-math-l19-statistics");assert.equal(path.chapterNumber,19);assert.equal(path.courseDocument,course);
  assert.equal(path.theme.title,"Analyse et probabilité");assert.deepEqual(course.levelIds,["terminale-c"]);
  assert.equal(course.source.lessonLabel,"Tome 1 · Leçon 10");assert.deepEqual(course.source.summaryPages,[248,249,250,251,252]);assert.deepEqual(course.source.evaluationPages,[253,254,255,256,257]);
  assert.deepEqual(course.sections.map(s=>s.topics.length),[1,1,1,1,1,2,1]);assert.equal(topics.flatMap(t=>t.examples??[]).length,7);
  assert.equal(course.evaluations.length,4);assert.equal(course.evaluations.flatMap(e=>e.examples).length,4);assert.equal(course.evaluations.flatMap(e=>e.questions).length,3);assert.equal(course.evaluations.flatMap(e=>e.writtenTasks??[]).length,4);
});
test("les six IDs,poids,83 questions et fils historiques restent stables ; contenu partagé C/D",()=>{
  const lessons=path.modules.flatMap(m=>m.lessons);
  assert.deepEqual(lessons.map(l=>l.id),Object.keys(course.legacyAnchors));assert.deepEqual(lessons.map(l=>l.xp),[50,55,60,65,70,75]);
  assert.equal(lessons.flatMap(l=>l.questions??[]).length,83);
  assert.deepEqual(topics.flatMap(t=>t.legacyLessonIds??[]).sort(),lessons.map(l=>l.id).sort());
  for(const topic of topics)for(const id of topic.legacyLessonIds??[])assert.equal(course.legacyAnchors[id],topic.id);
  const d=terminalDMathematicsPaths.find(p=>p.id==="terminale-d-math-l11-statistics")!;
  assert.ok(d);assert.deepEqual(d.courseDocument?.levelIds,["terminale-d"]);
  assert.strictEqual(d.courseDocument?.sections,course.sections);assert.strictEqual(d.courseDocument?.evaluations,course.evaluations);
});
test("propriétés, hypothèses et erreurs internes corrigées sans notice publique",()=>{
  const by=(id:string)=>topics.find(t=>t.id===id)!;
  assert.match(by("stats-regressions").body,/V\(X\)>0/);assert.match(by("stats-regressions").body,/V\(Y\)>0/);
  assert.match(by("stats-regressions").body,/écarts verticaux/);assert.match(by("stats-regressions").body,/écarts horizontaux/);
  assert.match(by("stats-correlation").body,/repère/);assert.match(by("stats-correlation").body,/pas une règle universelle/);
  assert.match(by("stats-correlation").body,/causalité/);assert.match(by("stats-adjustment").body,/extrapolation/);
  assert.equal(d.salary.y[2],217000);assert.equal(d["evaluation-plot"].y[2],35);
  const examples=[...topics.flatMap(t=>t.examples??[]),...course.evaluations.flatMap(e=>e.examples)],ids=examples.flatMap(e=>[e.id,...(e.parts??[]).map(p=>p.id)]);
  assert.equal(ids.length,new Set(ids).size);
  for(const e of examples){assert.ok(Boolean(e.solution)!==Boolean(e.parts?.length));for(const p of e.parts??[]){assert.ok(p.label);assert.ok(p.prompt);assert.ok(p.solution.length>80);}}
  const {source,...visible}=course;assert.ok(source.editorialNotes!.length>=7);assert.doesNotMatch(JSON.stringify(visible),/coquille|Excellence rétablit|Solution commentée|\? Non/);
});
test("marges : dénominateur total et fréquences exactes, sans forcer les arrondis à 100",()=>{
  const m=marginalDistributions([1,7,13],[4,9,14,19],[[2,5,3,2],[1,2,2,1],[4,6,1,1]]);
  assert.equal(m.total,30);assert.deepEqual(m.columnTotals,[7,13,6,4]);assert.deepEqual(m.rowTotals,[12,6,12]);
  near(m.columnFrequencies.reduce((s,v)=>s+v,0),1);near(m.rowFrequencies.reduce((s,v)=>s+v,0),1);
  assert.equal(Number((700/30).toFixed(2)),23.33);
  assert.throws(()=>marginalDistributions([1],[1,2],[[1]]));assert.throws(()=>marginalDistributions([1],[1],[[0]]));
});
test("les exemples numériques et les deux directions de régression sont vérifiés par sommes indépendantes",()=>{
  const s=calc(d.regression);
  near(s.meanX,42/6);near(s.meanY,3465/6);near(s.varianceX,328/6-7**2);
  near(s.varianceY,2358125/6-(3465/6)**2);near(s.covariance,27730/6-7*577.5);
  near(s.a!,3475/34);near(s.b!,-2345/17);near(s.aPrime!,278/28567);near(s.bPrime!,39424/28567);
  near(s.a!*s.aPrime!,s.r!**2);assert.notEqual(s.aPrime,1/s.a!);
  const worked=calc(d["evaluation-regression"]);near(worked.covariance,-6250);near(worked.b!,1300);near(worked.bPrime!,126100/179);
  near(calc(d.height).covariance,940/4-2.5*89.25);
  const pop=calc(d["evaluation-correlation"]);near(pop.covariance,115/49);near(pop.varianceX,1420/49);near(pop.varianceY,509/2450);near(pop.r!,.9564885580388033);
  assert.equal(d["evaluation-employees"].x.length,9);near(21.5/Math.sqrt(11.6*40.2),.9956264800800944);
});
test("paramètres dégénérés, corrélation négative et lien non linéaire ne produisent pas de fausses conclusions",()=>{
  const constantX=calc({x:[1,1,1],y:[2,3,4]});assert.equal(constantX.a,null);assert.equal(constantX.r,null);near(constantX.aPrime!,0);
  const constantY=calc({x:[1,2,3],y:[4,4,4]});assert.equal(constantY.aPrime,null);assert.equal(constantY.r,null);
  near(calc({x:[1,2,3],y:[3,2,1]}).r!,-1);
  const u=calc({x:[-2,-1,0,1,2],y:[4,1,0,1,4]});near(u.r!,0);near(u.varianceY,2.8);
  for(const bad of[{x:[],y:[]},{x:[1,2],y:[1]},{x:[NaN],y:[1]},{x:[1],y:[2],weights:[-1]},{x:[1],y:[2],weights:[0]}])assert.throws(()=>calc(bad));
});
test("trois résultats objectifs, quatre modèles libres, score local et brouillons isolés",()=>{
  const qs=course.evaluations.flatMap(g=>g.questions),tasks=course.evaluations.flatMap(g=>g.writtenTasks??[]);
  assert.equal(documentAnswerStatus(qs[0],"5/2"),"correct");assert.equal(documentAnswerStatus(qs[0],"2"),"incorrect");assert.equal(documentAnswerStatus(qs[1],""),"unanswered");
  const all=Object.fromEntries(qs.map(q=>[q.id,q.answer.kind==="short"?q.answer.accepted[0]:""]));
  assert.equal(documentAssessmentScore(qs,all).outOf20,20);
  assert.equal(documentAssessmentScore(qs,{[qs[0].id]:"2.5"}).percentage,33);
  assert.equal(documentAssessmentScore(qs,{[qs[0].id]:"2.5"}).outOf20,6.7);
  const restored=restoreDocumentDraft(JSON.stringify({answers:{...all,unknown:"1"},written:{[tasks[0].id]:"Mes points",unknown:"bad"},submitted:true,correctionsOpen:true}),course);
  assert.equal(Object.keys(restored.answers).length,3);assert.equal(Object.keys(restored.written).length,1);assert.equal("correctionsOpen" in restored,false);
  assert.notEqual(documentDraftKey("a",path.id,course),documentDraftKey("b",path.id,course));
  for(const task of tasks){assert.equal(task.criteria.length,3);assert.ok(task.model.length>200);assert.ok(topics.some(t=>t.id===task.topicId));}
  const renderer=readFileSync(new URL("../apps/web/src/features/lesson/document/DocumentEvaluation.tsx",import.meta.url),"utf8");
  assert.match(renderer,/<DocumentCorrection><div className="document-writing-model">/);assert.match(renderer,/task.nativeFigure && <DocumentNativeFigure/);
});
test("graphes natifs : échelles explicites, unités, police16px et contrôles44px",()=>{
  assert.deepEqual(d["evaluation-plot"].scale,[1,5]);assert.deepEqual(d["18"].origin,[1900,160]);assert.deepEqual(d["21"].scale,[4,4]);
  assert.deepEqual(d["22"].scale,[2,50]);assert.deepEqual(d["24"].scale,[1,1]);
  const css=readFileSync(new URL("../apps/web/src/styles/statistics-figures.css",import.meta.url),"utf8");
  assert.match(css,/font-size: 16px/);assert.match(css,/min-height: 44px/);assert.match(css,/overflow-x: auto/);
  const component=readFileSync(new URL("../apps/web/src/features/mathematics/StatisticsFigure.tsx",import.meta.url),"utf8");
  assert.doesNotMatch(component,/\beval\s*\(|new Function/);assert.match(component,/r = 0, mais y = x²/);
});
