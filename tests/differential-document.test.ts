import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { terminalCDifferentialDocument as course } from "../apps/web/src/data/courseDocuments/terminalCDifferentialDocument";
import { terminalCDifferentialEquationsPath as path } from "../apps/web/src/data/terminalCDifferentialEquationsPath";
import { terminalDMathematicsPaths } from "../apps/web/src/data/terminalDMathPaths";
import { documentDraftKey, restoreDocumentDraft } from "../apps/web/src/features/lesson/document/documentAssessment";
import { firstOrderSolution, oscillatorSolution } from "../apps/web/src/features/mathematics/differentialModels";
const topics=course.sections.flatMap(s=>s.topics);
const near=(a:number,b:number,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol*Math.max(1,Math.abs(b)),a+" ≠ "+b);
const d=(f:(x:number)=>number,x:number)=>(f(x+1e-5)-f(x-1e-5))/2e-5;
const dd=(f:(x:number)=>number,x:number)=>(f(x+1e-4)-2*f(x)+f(x-1e-4))/1e-8;

test("Pyramide L8 : 5 rubriques,8 sous-sections,8 exemples,7 méthodes et9 applications rédigées",()=>{
  assert.equal(path.id,"terminale-c-math-l18-differential-equations");assert.equal(path.chapterNumber,18);
  assert.equal(path.courseDocument,course);assert.equal(path.theme.title,"Analyse et probabilité");
  assert.equal(course.sections.length,5);assert.equal(topics.length,8);assert.equal(topics.flatMap(t=>t.examples??[]).length,8);
  assert.equal(course.evaluations.length,7);assert.equal(course.evaluations.flatMap(g=>g.writtenTasks??[]).length,9);
  assert.equal(course.evaluations.flatMap(g=>g.questions).length,0);
  assert.equal(course.source.lessonLabel,"Tome 1 · Leçon 8");
  assert.deepEqual(course.source.summaryPages,[198,199,200]);assert.deepEqual(course.source.evaluationPages,[201,202,203,204,205]);
  assert.deepEqual(course.levelIds,["terminale-c"]);
});
test("6 IDs/poids/106 questions historiques inchangés, contenu partagé avec D",()=>{
  const lessons=path.modules.flatMap(m=>m.lessons);
  assert.deepEqual(lessons.map(l=>l.id),Object.keys(course.legacyAnchors));
  assert.deepEqual(lessons.map(l=>l.xp),[50,55,60,65,70,75]);
  assert.deepEqual(lessons.map(l=>l.questions?.length),[18,20,22,14,14,18]);
  assert.equal(lessons.reduce((s,l)=>s+(l.questions?.length??1),0),106);
  assert.deepEqual(topics.flatMap(t=>t.legacyLessonIds??[]).sort(),lessons.map(l=>l.id).sort());
  for(const t of topics)for(const id of t.legacyLessonIds??[])assert.equal(course.legacyAnchors[id],t.id);
  const d=terminalDMathematicsPaths.find(p=>p.id==="terminale-d-math-l12-differential-equations")!;
  assert.ok(d);assert.deepEqual(d.courseDocument?.levelIds,["terminale-d"]);
  assert.strictEqual(d.courseDocument?.sections,course.sections);assert.strictEqual(d.courseDocument?.evaluations,course.evaluations);
});
test("conditions d’unicité, signes et solutions par sous-question restent explicites",()=>{
  assert.match(topics.find(t=>t.id==="ode-definition")!.body,/a\\ne0/);
  assert.match(topics.find(t=>t.id==="ode-second-zero")!.body,/x_0\\ne x_1/);
  assert.match(topics.find(t=>t.id==="ode-second-initial")!.body,/même point/);
  assert.match(topics.find(t=>t.id==="ode-affine-general")!.body,/a=0/);
  const examples=[...topics.flatMap(t=>t.examples??[]),...course.evaluations.flatMap(g=>g.examples)];
  const ids=examples.flatMap(e=>[e.id,...e.parts?.map(p=>p.id)??[]]);assert.equal(new Set(ids).size,ids.length);
  for(const e of examples){assert.ok(Boolean(e.solution)!==Boolean(e.parts?.length));for(const p of e.parts??[]){assert.ok(p.label);assert.ok(p.prompt);assert.ok(p.solution.length>60);}}
  assert.equal(topics.filter(t=>t.nativeFigure?.kind==="differential").length,2);
  const {source,...visible}=course;assert.ok(source.editorialNotes?.length);assert.doesNotMatch(JSON.stringify(visible),/coquille|Excellence rétablit|Solution commentée/i);
  const component=readFileSync(new URL("../apps/web/src/features/lesson/document/DocumentEvaluation.tsx",import.meta.url),"utf8");
  assert.match(component,/questions\.length > 0 && <div className="document-validation"/);
  assert.match(component,/questions\.length > 0 && draft\.submitted/);
});
test("solutions des exemples et conditions initiales contrôlées par dérivation numérique",()=>{
  const first:Array<[(x:number)=>number,number,number,number,number]>=[
    [x=>Math.exp(2*(x+1)/3),2/3,0,2,Math.E**2],
    [x=>-3*Math.exp(2*x+2),2,0,-1,-3],
    [x=>3*Math.exp(4*x+8),4,0,-2,3],
    [x=>3.5*Math.exp(2*x)-1.5,2,3,0,2],
    [x=>(Math.E-2.1)*Math.exp(5*x+1)+.6,5,-3,-.2,Math.E-1.5],
    [x=>-3*x+2,0,-3,1/3,1],
  ];
  for(const [f,a,b,x0,y0]of first){near(f(x0),y0);for(const x of[-.3,0,.2])near(d(f,x),a*f(x)+b,2e-6);}
  const second:Array<[(x:number)=>number,number,number,number,number]>=[
    [x=>-1.5*Math.exp(x/2)+4.5*Math.exp(-x/2),.25,0,3,-3],
    [x=>-2*Math.SQRT2/7*(Math.cos(3.5*x)+Math.sin(3.5*x)),-12.25,0,-2*Math.SQRT2/7,-Math.SQRT2],
    [x=>2*Math.SQRT2*Math.cos(2*x)+Math.SQRT2/2*Math.sin(2*x),-4,Math.PI/8,2.5,-3],
    [x=>.5*Math.exp(Math.sqrt(3)*x)+1.5*Math.exp(-Math.sqrt(3)*x),3,0,2,-Math.sqrt(3)],
    [x=>(1+Math.sqrt(3)/10)*Math.cos(5*x)+(.1-Math.sqrt(3))*Math.sin(5*x),-25,Math.PI/3,2,1],
    [x=>1.5*Math.exp(x)-.5*Math.exp(2-x),1,1,Math.E,2*Math.E],
  ];
  for(const[f,m,x0,y0,z0]of second){near(f(x0),y0);near(d(f,x0),z0,1e-6);for(const x of[-.3,.2,.7])near(dd(f,x),m*f(x),3e-6);}
  const final=second[1][0];near(final(Math.PI/2),0);
});
test("les explorations respectent y0, v0 et leur équation pour tous les choix proposés",()=>{
  for(const a of[-2,-1,0,1,2])for(const y0 of[-3,0,1,3]){
    const f=(x:number)=>firstOrderSolution(a,y0,x);near(f(0),y0);
    for(const x of[-1,0,1])near(d(f,x),a*f(x),2e-7);
  }
  for(const omega of[.5,1,2,3])for(const y0 of[-3,0,1,3])for(const v0 of[-2,0,2]){
    const f=(x:number)=>oscillatorSolution(omega,y0,v0,x);near(f(0),y0);near(d(f,0),v0);
    for(const x of[0,.5,2])near(dd(f,x),-omega*omega*f(x),3e-6);
  }
});
test("rédactions sauvegardées et isolées sans score automatique ni panneaux persistants",()=>{
  const tasks=course.evaluations.flatMap(g=>g.writtenTasks??[]), written=Object.fromEntries(tasks.map(t=>[t.id,"Ma résolution"]));
  const restored=restoreDocumentDraft(JSON.stringify({answers:{invented:"42"},written:{...written,invented:"x"},submitted:true,correctionsOpen:true}),course);
  assert.deepEqual(restored.answers,{});assert.equal(Object.keys(restored.written).length,9);assert.equal(restored.written[tasks[0].id],"Ma résolution");
  assert.equal("correctionsOpen" in restored,false);
  for(const t of tasks){assert.ok(topics.some(topic=>topic.id===t.topicId));assert.equal(t.criteria.length,3);assert.ok(t.model.length>150);assert.ok(t.model.includes("boxed"));}
  assert.notEqual(documentDraftKey("a",path.id,course),documentDraftKey("b",path.id,course));
});
