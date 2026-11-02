import assert from "node:assert/strict";
import test from "node:test";
import {terminalAExponentialDocument as d} from "../apps/web/src/data/courseDocuments/terminalAExponentialDocument";
import {terminalAExponentialPath as path} from "../apps/web/src/data/terminalAExponentialPath";
import {applyLessonXpBudget} from "../apps/web/src/data/xpRewards";
import {documentAnswerStatus,documentAssessmentScore} from "../apps/web/src/features/lesson/document/documentAssessment";
const topics=d.sections.flatMap(s=>s.topics),questions=d.evaluations.flatMap(g=>g.questions);
test("l’exponentielle A restitue le document et ses applications dans le lecteur partagé",()=>{
 assert.equal(path.courseDocument,d);assert.equal(path.presentation,"continuous-course");assert.equal(d.source.pageCount,14);assert.equal(d.source.sha256,"226e875c99012087fb5a490a14efb80338c2711bf86cfc1b68e61c56bb30de37");
 assert.equal(d.sections.length,6);assert.equal(topics.length,15);assert.equal(topics.flatMap(t=>t.examples??[]).length,16);assert.equal(topics.flatMap(t=>t.examples??[]).flatMap(e=>e.parts??[]).length,59);
 assert.equal(questions.length,40);assert.equal(d.evaluations.flatMap(g=>g.writtenTasks??[]).length,10);assert.equal(d.essentials?.length,8);
 assert.match(topics.find(t=>t.id==="ta-exp-primitives")!.title,/A1/);assert.equal(topics.find(t=>t.id==="ta-exp-primitives")!.optional,true);
});
test("les ancres, huit poids, 47 questions historiques et 10 000 XP sont préservés",()=>{
 const lessons=path.modules.flatMap(m=>m.lessons);assert.deepEqual(lessons.map(l=>l.id),Object.keys(d.legacyAnchors));assert.deepEqual(lessons.map(l=>l.xp),[50,55,65,65,75,75,75,80]);assert.equal(lessons.flatMap(l=>l.questions??[l.question]).length,47);assert.equal(applyLessonXpBudget(path).modules.flatMap(m=>m.lessons).reduce((sum,l)=>sum+l.xp,0),10000);
 for(const [id,target] of Object.entries(d.legacyAnchors))assert.ok(topics.some(t=>t.id===target&&t.legacyLessonIds?.includes(id)));
});
test("les réponses sont toutes acceptées et aucune rédaction n’entre au barème",()=>{
 const answers=Object.fromEntries(questions.map(q=>[q.id,q.answer.kind==="short"?q.answer.accepted[0]:""]));
 for(const q of questions){assert.equal(documentAnswerStatus(q,answers[q.id]),"correct",q.id);assert.equal(documentAnswerStatus(q,""),"unanswered");assert.equal(documentAnswerStatus(q,"hors réponse"),"incorrect");assert.ok(q.correction.length>50);}
 assert.equal(documentAssessmentScore(questions,answers).outOf20,20);for(const task of d.evaluations.flatMap(g=>g.writtenTasks??[])){assert.ok(task.model.length>250);assert.equal("points" in task,false);assert.ok(task.criteria.length>=4);}
});
test("tableaux, seuil publicitaire et signes sont calculés indépendamment",()=>{
 const f=(x:number)=>1-x+Math.exp(x),g=(x:number)=>(-2*x+3)*Math.exp(x);
 assert.deepEqual([-3,-2,-1,0,1,2].map(x=>Math.round(f(x)*100)/100),[4.05,3.14,2.37,2,2.72,6.39]);assert.equal(f(0),2);assert.equal(g(1.5),0);assert.equal(g(0),3);assert.equal(g(.5),2*Math.sqrt(Math.E));
 const p=(t:number)=>1-Math.exp(-.21*t);assert.ok(p(10)<.9&&p(11)>.9);assert.equal(Math.ceil(Math.log(.1)/(-.21)),11);assert.equal(Math.round(p(11)*10000)/10000,.9007);
 for(const x of [-2,-.1,0,.1,2]){const B=Math.exp(2*x)+Math.exp(x)-2,C=Math.exp(x)-2*Math.exp(-x)+1;assert.equal(Math.sign(B),Math.sign(x));assert.equal(Math.sign(C),Math.sign(x));}
 assert.equal(documentAnswerStatus(questions.find(q=>q.id==="ta-exp-8.4")!,"3,39"),"incorrect");
});
test("les quatre courbes sont natives, le tracé produit reste dans le domaine demandé",()=>{
 assert.equal(topics.filter(t=>t.interaction?.kind==="curve").length,4);const interaction=topics.find(t=>t.id==="ta-exp-second-study")!.interaction!;assert.equal(interaction.kind,"curve");if(interaction.kind!=="curve")return;
 assert.equal(interaction.marker.max,2);assert.equal(interaction.rule.kind,"samples");if(interaction.rule.kind!=="samples")return;assert.equal(interaction.rule.points.length,321);
 for(const [x,y] of interaction.rule.points){assert.ok(x<=2);assert.equal(y,(-2*x+3)*Math.exp(x));}
 assert.doesNotMatch(JSON.stringify([d.sections,d.evaluations,d.essentials]),/data:image|\.png|coquille|erreur du PDF/);
});
