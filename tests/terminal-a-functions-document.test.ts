import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {terminalAPolynomialDocument as course} from "../apps/web/src/data/courseDocuments/terminalAPolynomialDocument";
import {terminalAPolynomialRationalPath as path} from "../apps/web/src/data/terminalAPolynomialRationalPath";
import {appRouteUrl,readAppRoute} from "../apps/web/src/routing/appRoute";
import {documentAnswerStatus,documentAssessmentScore} from "../apps/web/src/features/lesson/document/documentAssessment";
import {applyLessonXpBudget} from "../apps/web/src/data/xpRewards";

const topics=course.sections.flatMap(section=>section.topics);
const questions=course.evaluations.flatMap(group=>group.questions);
const lessons=path.modules.flatMap(module=>module.lessons);

test("la leçon 1 de Terminale A est autonome : sept rubriques et trois vues, sans changement historique",()=>{
 assert.equal(path.courseDocument,course);assert.equal(path.presentation,"continuous-course");
 assert.equal(course.sections.length,7);assert.equal(topics.length,21);assert.equal(course.evaluations.length,6);assert.equal(course.essentials?.length,8);
 assert.deepEqual(course.levelIds,["terminale-a"]);assert.equal(course.source.pageCount,28);
 assert.equal(course.source.sha256,"9eaa927eae1332ac3463860a3724203d8ff7455e7e2d0501687e794826c02b93");
 assert.equal(lessons.length,19);assert.deepEqual(lessons.map(lesson=>lesson.id),Object.keys(course.legacyAnchors));
 assert.deepEqual(lessons.map(lesson=>lesson.xp),[50,55,40,60,55,45,45,60,45,45,65,50,60,75,45,60,55,50,100]);
 assert.equal(lessons.flatMap(lesson=>lesson.questions??[lesson.question]).length,120);
 assert.equal(applyLessonXpBudget(path).modules.flatMap(module=>module.lessons).reduce((sum,lesson)=>sum+lesson.xp,0),10000);
 for(const [id,target] of Object.entries(course.legacyAnchors))assert.ok(topics.some(topic=>topic.id===target&&topic.legacyLessonIds?.includes(id)),id);
 assert.equal(new Set(topics.map(topic=>topic.id)).size,topics.length);
});
test("les exemples sont séparés et les courbes ne sont pas des scans",()=>{
 const examples=topics.flatMap(topic=>topic.examples??[]);
 assert.equal(examples.length,19);
 for(const example of examples){assert.ok(example.parts?.length);for(const part of example.parts!){assert.ok(part.prompt.length>5);assert.ok(part.solution.length>30,part.id);}}
 assert.equal(topics.filter(topic=>topic.interaction?.kind==="curve").length,4);
 assert.doesNotMatch(JSON.stringify(course),/data:image|\.png|<img|SITUATION D.APPRENTISSAGE|Niveau \d/);
});
test("les hypothèses et les calculs corrigés sont explicites sans avertissement de coquille aux élèves",()=>{
 const body=topics.map(topic=>topic.body).join("\n");
 assert.match(body,/au moins une solution/);assert.match(body,/strictement monotone/);assert.match(body,/seul ne suffit pas/);
 const displayed=JSON.stringify([course.sections,course.evaluations,course.essentials]);
 assert.doesNotMatch(displayed,/erreur du (?:PDF|support)|coquille|le PDF indique|20\}.*5x\+3/);
 assert.match(displayed,/23/);assert.match(displayed,/-2x-1/);assert.match(displayed,/4[,.]125/);
 assert.ok(course.source.editorialNotes!.some(note=>note.includes("5/4")));
});
test("chaque réponse objective attendue est corrigée ; toutes les rédactions restent hors barème",()=>{
 assert.equal(questions.length,28);assert.equal(course.evaluations.flatMap(group=>group.writtenTasks??[]).length,4);
 const answers=Object.fromEntries(questions.map(q=>[q.id,q.answer.kind==="short"?q.answer.accepted[0]:""]));
 for(const q of questions){assert.equal(q.answer.kind,"short");assert.ok(q.correction.length>30,q.id);assert.ok(topics.some(topic=>topic.id===q.topicId));assert.equal(documentAnswerStatus(q,answers[q.id]),"correct",q.id);assert.equal(documentAnswerStatus(q,""),"unanswered");assert.equal(documentAnswerStatus(q,"sans réponse valable"),"incorrect");}
 assert.equal(documentAssessmentScore(questions,answers).outOf20,20);
 for(const written of course.evaluations.flatMap(g=>g.writtenTasks??[])){assert.ok(written.model.length>200);assert.ok(written.criteria.length>=3);assert.equal("points" in written,false);}
});
test("calculs indépendants : quotient, tangente, racine, extremum et étude complète",()=>{
 const g=(x:number)=>(x-4)/(5*x+3),h=1e-6;
 assert.ok(Math.abs((g(1+h)-g(1-h))/(2*h)-23/64)<1e-8);
 const f=(x:number)=>-x*x-2;
 assert.ok(Math.abs((f(1+h)-f(1-h))/(2*h)+2)<1e-8);assert.equal(-2*1-1,f(1));
 const cubic=(x:number)=>x*x*x-12*x+10;assert.equal(cubic(0),10);assert.equal(cubic(.5),4.125);assert.ok(cubic(.8)>0&&cubic(.9)<0);
 const rational=(x:number)=>(x*x+3*x+3)/(x+1);
 for(const x of [-4,-2,-.8,0,2]){assert.ok(Math.abs(rational(x)-(x+2+1/(x+1)))<1e-10);assert.ok(Math.abs((rational(x+h)-rational(x-h))/(2*h)-x*(x+2)/(x+1)**2)<1e-6);}
 for(const u of [.1,1,3])assert.ok(Math.abs(rational(-1+u)+rational(-1-u)-2)<1e-10);
 assert.equal(-(3600**2)+7200*3600-7760000,5200000);
});
test("la leçon ouvre ses trois onglets par URL, avec les réponses courtes et corrections partagées",()=>{
 for(const [tab,vue] of [["assessment","evaluation"],["essentials","essentiel"]] as const){
  const url=appRouteUrl({navigation:"paths",pathId:path.id,subjectId:"mathematics",courseTab:tab},"");assert.ok(url.includes("vue="+vue));
  const parsed=readAppRoute(new URL(url,"http://127.0.0.2:4174"));assert.equal(parsed.courseTab,tab);
 }
 const screen=readFileSync(new URL("../apps/web/src/features/lesson/document/DocumentEvaluation.tsx",import.meta.url),"utf8");
 assert.match(screen,/DocumentCorrection/);assert.match(screen,/DocumentFormulaKeyboard/);assert.match(screen,/réda[ct]+ion n’est pas notée automatiquement/);
});
