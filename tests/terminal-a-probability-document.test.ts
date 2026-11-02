import assert from "node:assert/strict";
import test from "node:test";
import {terminalA1ProbabilityDocument as a1,terminalA2ProbabilityDocument as a2} from "../apps/web/src/data/courseDocuments/terminalAProbabilityDocument";
import {terminalA1ProbabilityPath as p1,terminalA2ProbabilityPath as p2} from "../apps/web/src/data/terminalAProbabilityPath";
import {applyLessonXpBudget} from "../apps/web/src/data/xpRewards";
import {documentAnswerStatus,documentAssessmentScore,documentDraftKey,restoreDocumentDraft} from "../apps/web/src/features/lesson/document/documentAssessment";
import {appRouteUrl,readAppRoute} from "../apps/web/src/routing/appRoute";

const topics=(course:typeof a1)=>course.sections.flatMap(section=>section.topics);
const qs=(course:typeof a1)=>course.evaluations.flatMap(group=>group.questions);
const choose=(n:number,k:number)=>{if(k>n)return 0;let value=1;for(let i=1;i<=k;i++)value=value*(n-i+1)/i;return Math.round(value);};
const near=(actual:number,expected:number)=>assert.ok(Math.abs(actual-expected)<1e-12,actual+" ≠ "+expected);

test("A1 et A2 ont trois vues, une source authentique et leurs variantes distinctes",()=>{
 assert.equal(p1.courseDocument,a1);assert.equal(p2.courseDocument,a2);
 assert.equal(p1.presentation,"continuous-course");assert.equal(p2.presentation,"continuous-course");
 for(const course of [a1,a2]){assert.equal(course.source.pageCount,13);assert.equal(course.source.sha256,"b8257b893e47ff3506cb12d5e61e24db05a265361e1572a6e9b9bb7a30d20f35");assert.deepEqual(course.levelIds,["terminale-a"]);}
 assert.equal(a1.sections.length,4);assert.equal(a2.sections.length,3);
 assert.equal(topics(a1).length,14);assert.equal(topics(a2).length,8);
 assert.equal(qs(a1).length,40);assert.equal(qs(a2).length,25);
 assert.equal(a1.essentials?.length,10);assert.equal(a2.essentials?.length,6);
 assert.equal(a1.evaluations.flatMap(group=>group.writtenTasks??[]).length,9);
 assert.equal(a2.evaluations.flatMap(group=>group.writtenTasks??[]).length,5);
 const publicA2=JSON.stringify([a2.sections,a2.evaluations,a2.essentials]);
 assert.doesNotMatch(publicA2,/espérance|variance|variable aléatoire|kermesse de Mariam|ta-proba-model/i);
});
test("le tronc commun est partagé par référence, jamais dupliqué ni remplacé par les données A1",()=>{
 for(let i=0;i<3;i++)assert.equal(a1.sections[i],a2.sections[i]);
 for(let i=0;i<5;i++)assert.equal(a1.evaluations[i],a2.evaluations[i]);
 for(let i=0;i<6;i++)assert.equal(a1.essentials![i],a2.essentials![i]);
 assert.notEqual(a1.id,a2.id);
});
test("les treize identifiants historiques, les poids et les 20 000 XP restent intacts",()=>{
 for(const [course,path,weights,count] of [[a1,p1,[45,45,55,60,60,75,85],50],[a2,p2,[45,45,55,60,60,75],38]] as const){
  const lessons=path.modules.flatMap(module=>module.lessons);
  assert.deepEqual(lessons.map(lesson=>lesson.id),Object.keys(course.legacyAnchors));
  assert.deepEqual(lessons.map(lesson=>lesson.xp),weights);assert.equal(lessons.flatMap(lesson=>lesson.questions??[lesson.question]).length,count);
  assert.equal(applyLessonXpBudget(path).modules.flatMap(module=>module.lessons).reduce((sum,lesson)=>sum+lesson.xp,0),10000);
  for(const [id,target] of Object.entries(course.legacyAnchors))assert.ok(topics(course).some(topic=>topic.id===target&&topic.legacyLessonIds?.includes(id)),id);
 }
});
test("les réponses attendues sont toutes acceptées et aucune rédaction n’entre au barème",()=>{
 for(const course of [a1,a2]){
  const questions=qs(course),answers=Object.fromEntries(questions.map(q=>[q.id,q.answer.kind==="short"?q.answer.accepted[0]:""]));
  assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
  for(const q of questions){assert.ok(q.correction.length>30);assert.equal(documentAnswerStatus(q,answers[q.id]),"correct",q.id);assert.equal(documentAnswerStatus(q,""),"unanswered");assert.equal(documentAnswerStatus(q,"hors réponse"),"incorrect");assert.ok(topics(course).some(t=>t.id===q.topicId));}
  assert.equal(documentAssessmentScore(questions,answers).outOf20,20);
  for(const task of course.evaluations.flatMap(g=>g.writtenTasks??[])){assert.ok(task.model.length>200);assert.ok(task.criteria.length>=3);assert.equal("points" in task,false);}
 }
});
test("dénombrements indépendants : pièces, Yasmine et desserts",()=>{
 assert.equal(choose(30,4),27405);assert.equal(choose(20,3),1140);assert.equal(choose(28,4),20475);
 near(choose(15,4)/choose(30,4),13/261);near(choose(10,4)/choose(30,4),2/261);near(1-choose(25,4)/choose(30,4),2951/5481);
 near((choose(5,2)*10*15+choose(10,2)*5*15+choose(15,2)*5*10)/choose(30,4),75/203);
 near(5*choose(15,2)/1140,35/76);near(choose(5,2)*15/1140,5/38);near(choose(5,3)/1140,1/114);near(1-choose(15,3)/1140,137/228);
 near((choose(10,4)+choose(3,4)+choose(4,4)+choose(5,4)+choose(6,4))/20475,11/975);
 near(3*choose(4,3)/20475,4/6825);near(1-choose(18,4)/20475,387/455);
});
test("loi, espérance, variance et seuil sont calculés indépendamment sans arrondi prématuré",()=>{
 const values=[0,1,2],probs=[.3,.6,.1],mean=values.reduce((sum,x,i)=>sum+x*probs[i],0),variance=values.reduce((sum,x,i)=>sum+x*x*probs[i],0)-mean*mean;
 near(mean,4/5);near(variance,9/25);near(Math.sqrt(variance),3/5);
 const other=[-15,0,15,30],p=[1/8,3/8,3/8,1/8],E=other.reduce((sum,x,i)=>sum+x*p[i],0),V=other.reduce((sum,x,i)=>sum+x*x*p[i],0)-E*E;
 near(E,15/2);near(V,675/4);near(Math.sqrt(V),15*Math.sqrt(3)/2);
 near((20*4+30*3+90*2+100)/10,45);
 const f=(x:number)=>98*x/(97*x+1);near(f(19/117),.95);assert.ok(f(.16)<.95&&f(.17)>.95);
 const threshold=qs(a1).find(q=>q.id==="ta-proba-9.2")!;assert.equal(documentAnswerStatus(threshold,"19/117"),"correct");assert.equal(documentAnswerStatus(threshold,"0,162"),"incorrect");
 assert.equal(documentAnswerStatus(qs(a1).find(q=>q.id==="ta-proba-8.4")!,"3/5"),"correct");
});
test("URLs et brouillons isolent A1/A2, même pour les questions communes",()=>{
 const key1=documentDraftKey("eleve",p1.id,a1),key2=documentDraftKey("eleve",p2.id,a2);assert.notEqual(key1,key2);
 for(const path of [p1,p2])for(const [tab,view] of [["assessment","evaluation"],["essentials","essentiel"]] as const){
  const url=appRouteUrl({navigation:"paths",subjectId:"mathematics",pathId:path.id,courseTab:tab},"");assert.ok(url.includes("vue="+view));assert.equal(readAppRoute(new URL(url,"http://127.0.0.2:4174")).courseTab,tab);
 }
 const restored=restoreDocumentDraft(JSON.stringify({answers:{"ta-proba-1.1":"Vrai","ta-proba-9.2":"19/117"},written:{inconnu:"texte"}}),a2);
 assert.equal(restored.answers["ta-proba-1.1"],"Vrai");assert.equal(restored.answers["ta-proba-9.2"],undefined);
});
test("les exemples ont des points séparés et les interactions ne réutilisent aucun scan",()=>{
 for(const course of [a1,a2]){
  for(const example of topics(course).flatMap(topic=>topic.examples??[])){assert.ok(example.parts?.length);for(const part of example.parts!){assert.ok(part.label);assert.ok(part.prompt);assert.ok(part.solution.length>40);}}
  assert.doesNotMatch(JSON.stringify([course.sections,course.evaluations,course.essentials]),/data:image|\.png|<img|coquille|erreur du PDF/);
 }
 assert.equal(topics(a2).filter(t=>t.interaction).length,2);assert.equal(topics(a1).filter(t=>t.interaction).length,4);
 const graph=topics(a1).find(t=>t.id==="ta-proba-model")!.interaction!;
 assert.equal(graph.kind,"curve");if(graph.kind==="curve"){assert.equal(graph.window.xMin,0);assert.equal(graph.window.xMax,1);}
 const model=topics(a1).find(t=>t.id==="ta-proba-model")!.body;
 assert.ok(model.includes("$98$ personnes sur $100$"));assert.ok(model.includes("$1$ personne sur $100$"));assert.ok(model.includes("sachant que son test est positif"));
 assert.ok(a1.source.editorialNotes?.some(note=>note.includes("16,2393")));
});
