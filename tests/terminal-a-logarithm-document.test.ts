import assert from "node:assert/strict";
import test from "node:test";
import {terminalALogarithmDocument as d} from "../apps/web/src/data/courseDocuments/terminalALogarithmDocument";
import {terminalANaturalLogPath as path} from "../apps/web/src/data/terminalANaturalLogPath";
import {applyLessonXpBudget} from "../apps/web/src/data/xpRewards";
import {documentAnswerStatus,documentAssessmentScore,documentDraftKey,restoreDocumentDraft} from "../apps/web/src/features/lesson/document/documentAssessment";
import {appRouteUrl,readAppRoute} from "../apps/web/src/routing/appRoute";
const topics=d.sections.flatMap(s=>s.topics),questions=d.evaluations.flatMap(g=>g.questions);

test("le logarithme A a un document autonome en cinq rubriques et trois vues",()=>{
 assert.equal(path.courseDocument,d);assert.equal(path.presentation,"continuous-course");
 assert.equal(d.source.pageCount,10);assert.equal(d.source.sha256,"38be6e570af32e3c583cbfba6f3fe70a2042886238ea37b8e7b8b5d86f5869eb");
 assert.deepEqual(d.levelIds,["terminale-a"]);assert.equal(d.sections.length,5);assert.equal(topics.length,12);
 const examples=topics.flatMap(t=>t.examples??[]);assert.equal(examples.length,13);assert.equal(examples.flatMap(e=>e.parts??[]).length,38);
 assert.equal(questions.length,36);assert.equal(d.evaluations.flatMap(g=>g.writtenTasks??[]).length,8);assert.equal(d.essentials?.length,8);
 for(const example of examples)for(const part of example.parts!){assert.ok(part.label);assert.ok(part.prompt);assert.ok(part.solution.length>60);}
});
test("les huit ancres, poids et 56 questions historiques gardent leurs 10 000 XP",()=>{
 const lessons=path.modules.flatMap(m=>m.lessons);
 assert.deepEqual(lessons.map(l=>l.id),Object.keys(d.legacyAnchors));assert.deepEqual(lessons.map(l=>l.xp),[50,55,60,65,75,75,70,75]);
 assert.equal(lessons.flatMap(l=>l.questions??[l.question]).length,56);
 assert.equal(applyLessonXpBudget(path).modules.flatMap(m=>m.lessons).reduce((sum,l)=>sum+l.xp,0),10000);
 for(const [id,target] of Object.entries(d.legacyAnchors))assert.ok(topics.some(t=>t.id===target&&t.legacyLessonIds?.includes(id)));
});
test("chaque question est corrigée et les rédactions n’entrent jamais dans la note",()=>{
 const answers=Object.fromEntries(questions.map(q=>[q.id,q.answer.kind==="short"?q.answer.accepted[0]:""]));
 assert.equal(new Set(questions.map(q=>q.id)).size,36);
 for(const q of questions){assert.ok(q.correction.length>50);assert.equal(documentAnswerStatus(q,answers[q.id]),"correct",q.id);assert.equal(documentAnswerStatus(q,""),"unanswered");assert.equal(documentAnswerStatus(q,"hors réponse"),"incorrect");assert.ok(topics.some(t=>t.id===q.topicId));}
 assert.equal(documentAssessmentScore(questions,answers).outOf20,20);
 for(const task of d.evaluations.flatMap(g=>g.writtenTasks??[])){assert.equal("points" in task,false);assert.ok(task.model.length>250);assert.ok(task.criteria.length>=4);}
});
test("le polynôme imprimé avec −6 est résolu avec les bonnes racines −1 et 6",()=>{
 const topic=topics.find(t=>t.id==="ta-log-inequalities")!;
 const solution=topic.examples![0].parts![1].solution;
 assert.ok(solution.includes("(X+1)(X-6)"));assert.ok(solution.includes("e^{-1}"));assert.ok(solution.includes("e^6"));
 assert.ok(!solution.includes("e^3"));
 for(const X of [-3,-1,0,2,3,5,6,8])assert.equal(X*X-5*X-6>=0,X<=-1||X>=6);
 const threshold=questions.find(q=>q.id==="4.1"||q.id==="ta-log-4.1")!;assert.equal(documentAnswerStatus(threshold,"2"),"incorrect");
});
test("l’étude type Bac recalcule le sommet et les neuf arrondis",()=>{
 const f=(x:number)=>-2*x+1+Math.log(x),xs=[.25,.5,1,1.5,2,2.5,3,3.5,4];
 assert.deepEqual(xs.map(x=>Math.round(f(x)*10)/10),[-.9,-.7,-1,-1.6,-2.3,-3.1,-3.9,-4.7,-5.6]);
 assert.equal(f(.5),-Math.LN2);assert.ok(xs.every(x=>f(x)<0));
 const bac=topics.find(t=>t.id==="ta-log-bac-study")!;
 assert.ok(bac.examples![0].parts![5].solution.includes("$-0,9$"));
 assert.equal(documentAnswerStatus(questions.find(q=>q.id==="ta-log-7.4")!,"-3,2"),"incorrect");
 assert.equal(documentAnswerStatus(questions.find(q=>q.id==="ta-log-7.5")!,"1"),"incorrect");
 assert.equal(documentAnswerStatus(questions.find(q=>q.id==="ta-log-7.6")!,"-4"),"incorrect");
});
test("le seuil entier et les dérivées de primitives sont vérifiés indépendamment",()=>{
 const p=(n:number)=>1-.325**n,threshold=Math.log(.02)/Math.log(.325);
 assert.ok(threshold>3&&threshold<4);assert.ok(p(3)<.98&&p(4)>.98);assert.equal(Math.round(p(3)*10000)/10000,.9657);assert.equal(Math.round(p(4)*10000)/10000,.9888);
 const primitives=[{F:(x:number)=>-2/3*Math.log(-3*x+7),f:(x:number)=>2/(-3*x+7),x:1},{F:(x:number)=>Math.log(-2*x*x+5*x-3),f:(x:number)=>(-4*x+5)/(-2*x*x+5*x-3),x:1.2}];
 for(const {F,f,x} of primitives){const h=1e-6;assert.ok(Math.abs((F(x+h)-F(x-h))/(2*h)-f(x))<1e-7);}
 for(const x of [-10,-1,0,1,2,10])assert.ok(-((x-1)**2)<=0);
 assert.ok(topics.find(t=>t.id==="ta-log-definition")!.examples![0].parts![1].solution.includes("\\varnothing"));
});
test("le lecteur garde les URL, les brouillons et deux figures originales",()=>{
 for(const [tab,view] of [["assessment","evaluation"],["essentials","essentiel"]] as const){const url=appRouteUrl({navigation:"paths",subjectId:"mathematics",pathId:path.id,courseTab:tab},"");assert.ok(url.includes("vue="+view));assert.equal(readAppRoute(new URL(url,"http://127.0.0.2:4174")).courseTab,tab);}
 assert.notEqual(documentDraftKey("A",path.id,d),documentDraftKey("B",path.id,d));
 const restored=restoreDocumentDraft(JSON.stringify({answers:{"ta-log-1.1":"Faux",foreign:"intrus"},written:{"ta-log-writing-product-proof":"justification",foreign:"intrus"}}),d);
 assert.equal(restored.answers.foreign,undefined);assert.equal(restored.written.foreign,undefined);assert.equal(restored.answers["ta-log-1.1"],"Faux");
 assert.equal(topics.filter(t=>t.interaction?.kind==="curve").length,2);
 assert.doesNotMatch(JSON.stringify([d.sections,d.evaluations,d.essentials]),/\.png|data:image|coquille|erreur du PDF/);
});
