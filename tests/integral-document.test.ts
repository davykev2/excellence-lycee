import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { terminalCIntegralDocument as course } from "../apps/web/src/data/courseDocuments/terminalCIntegralDocument";
import { terminalCIntegralCalculusPath as path } from "../apps/web/src/data/terminalCIntegralCalculusPath";
import { terminalDMathematicsPaths } from "../apps/web/src/data/terminalDMathPaths";
import { documentAnswerStatus, documentAssessmentScore, documentDraftKey, restoreDocumentDraft } from "../apps/web/src/features/lesson/document/documentAssessment";
import { integrateForPlot, rectangleSums } from "../apps/web/src/features/mathematics/integralModels";
const topics=course.sections.flatMap(s=>s.topics),questions=course.evaluations.flatMap(g=>g.questions);
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-8*Math.max(1,Math.abs(b)),a+" ≠ "+b);
test("Pyramide L7 : 8 rubriques, 15 sous-sections, 15 exemples, 3 méthodes ; path historique L15",()=>{
  assert.equal(path.id,"terminale-c-math-l15-integral-calculus");assert.equal(path.chapterNumber,15);
  assert.equal(path.theme.title,"Analyse et probabilité");assert.equal(path.courseDocument,course);
  assert.equal(course.sections.length,8);assert.equal(topics.length,15);assert.equal(topics.flatMap(t=>t.examples??[]).length,15);
  assert.equal(course.evaluations.length,3);assert.equal(questions.length,3);assert.equal(course.evaluations.flatMap(g=>g.writtenTasks??[]).length,1);
  assert.equal(course.source.lessonLabel,"Tome 1 · Leçon 7");assert.deepEqual(course.levelIds,["terminale-c"]);
  assert.deepEqual(course.source.summaryPages,Array.from({length:9},(_,i)=>170+i));assert.deepEqual(course.source.evaluationPages,[179,180,181,182]);
});
test("les 8 IDs/poids/153 questions restent inchangés,contenu partagé avec D",()=>{
  const lessons=path.modules.flatMap(m=>m.lessons);
  assert.deepEqual(lessons.map(l=>l.id),Object.keys(course.legacyAnchors));assert.deepEqual(lessons.map(l=>l.xp),[50,55,60,65,70,75,80,85]);
  assert.equal(lessons.reduce((n,l)=>n+(l.questions?.length??1),0),153);
  assert.deepEqual(topics.flatMap(t=>t.legacyLessonIds??[]).sort(),lessons.map(l=>l.id).sort());
  for(const t of topics)for(const id of t.legacyLessonIds??[])assert.equal(course.legacyAnchors[id],t.id);
  const d=terminalDMathematicsPaths.find(p=>p.id==="terminale-d-math-l10-integral-calculus")!;
  assert.ok(d);assert.deepEqual(d.courseDocument?.levelIds,["terminale-d"]);
  assert.strictEqual(d.courseDocument?.sections,course.sections);assert.strictEqual(d.courseDocument?.evaluations,course.evaluations);
});
test("hypothèses, orientation, unités, n rectangles et solutions séparées sont explicites",()=>{
  assert.match(topics.find(t=>t.id==="int-order")!.body,/a\\le b/);
  assert.match(topics.find(t=>t.id==="int-affine")!.body,/alpha<0/);
  assert.match(topics.find(t=>t.id==="int-average")!.body,/a<b/);
  assert.match(topics.find(t=>t.id==="int-area-sign")!.body,/pq/);
  assert.match(topics.find(t=>t.id==="int-rectangles")!.body,/n rectangles/);
  assert.equal(topics.filter(t=>t.nativeFigure).length,2);
  const css=readFileSync(new URL("../apps/web/src/styles/course-document.css",import.meta.url),"utf8");
  assert.match(css,/\.lesson-document \.lesson-rich-content \{[^}]*font-size: 16px/);
  assert.doesNotMatch(css,/\.lesson-document \.lesson-rich-content \{[^}]*font-size: \.88rem/);
  const examples=[...topics.flatMap(t=>t.examples??[]),...course.evaluations.flatMap(g=>g.examples)];
  const ids=examples.flatMap(e=>[e.id,...e.parts?.map(p=>p.id)??[]]);assert.equal(new Set(ids).size,ids.length);
  for(const e of examples){assert.equal(Boolean(e.solution)!==Boolean(e.parts?.length),true);for(const p of e.parts??[]){assert.ok(p.prompt);assert.ok(p.solution.length>60);}}
  const {source,...visible}=course;assert.ok(source.editorialNotes?.length);assert.doesNotMatch(JSON.stringify(visible),/coquille|Excellence rétablit|Solution commentée/i);
});
test("exemples et applications vérifiés par intégration numérique indépendante",()=>{
  near(integrateForPlot(x=>Math.cos(x)**2*Math.sin(x)**4,0,Math.PI/12),(2*Math.PI-3*Math.sqrt(3)-1)/384);
  near(integrateForPlot(x=>Math.cos(x)**5*Math.sin(x)**2,0,Math.PI/2),8/105);
  near(integrateForPlot(x=>Math.sin(2*x)**3*Math.cos(2*x)**2,-Math.PI/4,Math.PI/2),1/15);
  near(integrateForPlot(x=>Math.cos(x)**4,-Math.PI/2,Math.PI/4),9*Math.PI/32+.25);
  near(integrateForPlot(x=>Math.log(2-x),-1,1),3*Math.log(3)-2);
  near(integrateForPlot(x=>Math.abs((-x*x-x+2)-(2*x+2)),-1,0)+integrateForPlot(x=>Math.abs((-x*x-x+2)-(2*x+2)),0,1),3);
  const r=rectangleSums(x=>Math.sqrt(4-x*x),.4,.6,10);near(r.left,.3876280836851042);near(r.right,.38659381585725117);assert.ok(r.error<.00053);assert.ok(r.error>.0005);
  const F=(x:number)=>-(Math.log(x)+1)/x+2/Math.E;near(F(Math.E),0);
  for(const x of [.2,1,Math.E,4])near((F(x+1e-5)-F(x-1e-5))/2e-5,Math.log(x)/x**2);
});
test("trois réponses notées, rédaction non automatique et brouillons isolés",()=>{
  const answers=Object.fromEntries(questions.map(q=>[q.id,q.answer.kind==="short"?q.answer.accepted[0]:""]));
  assert.equal(documentAssessmentScore(questions,answers).outOf20,20);
  for(const q of questions){if(q.answer.kind==="short")for(const a of q.answer.accepted)assert.equal(documentAnswerStatus(q,a),"correct");assert.equal(documentAnswerStatus(q,""),"unanswered");}
  assert.equal(documentAnswerStatus(questions[0],"1/10"),"incorrect");
  const task=course.evaluations[2].writtenTasks![0];assert.equal(task.criteria.length,3);assert.match(task.prompt,/0;.*infty/);
  const restored=restoreDocumentDraft(JSON.stringify({answers:{...answers,unknown:"x"},written:{[task.id]:"Ma démonstration"},submitted:true}),course);
  assert.equal(Object.keys(restored.answers).length,3);assert.equal(restored.written[task.id],"Ma démonstration");
  assert.notEqual(documentDraftKey("a",path.id,course),documentDraftKey("b",path.id,course));
});
