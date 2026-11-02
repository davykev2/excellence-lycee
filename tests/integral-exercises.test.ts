import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { arenaPayloadSchema } from "../apps/api/src/arenaExerciseSchema";
import { terminalCIntegralExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCIntegralExercises";
import { terminalCIntegralDocument as course } from "../apps/web/src/data/courseDocuments/terminalCIntegralDocument";
import { loadExerciseCollection } from "../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import { exerciseAnswerStatus, exerciseAssessment, exerciseDraftKey, restoreExerciseDraft } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { integralPlotModel, integrateForPlot, rectangleSums, rectangleDisplayError } from "../apps/web/src/features/mathematics/integralModels";
const exercises=bank.sections.flatMap(s=>s.exercises),questions=exercises.flatMap(e=>e.questions??[]);
const find=(n:number)=>exercises.find(e=>e.sourceNumber===n)!;
const near=(a:number,b:number,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol*Math.max(1,Math.abs(b)),a+" ≠ "+b);
const require=createRequire(new URL("../apps/web/package.json",import.meta.url)),katex=require("katex");
test("67 exercices sans trou : 37 fixation, 27 approfondissement, 3 situations ; 224 sous-questions",()=>{
  assert.deepEqual(exercises.map(e=>e.sourceNumber),Array.from({length:67},(_,i)=>i+1));
  assert.deepEqual(["fixation","deepening","complex"].map(c=>bank.sections.filter(s=>s.category===c).flatMap(s=>s.exercises).length),[37,27,3]);
  assert.equal(bank.sections.filter(s=>s.category==="fixation").length,13);
  assert.equal(questions.length,224);assert.equal(questions.filter(q=>q.answer.kind!=="written").length,47);assert.equal(questions.filter(q=>q.answer.kind==="written").length,177);
  assert.equal(new Set(questions.map(q=>q.id)).size,224);assert.equal(new Set(exercises.map(e=>e.id)).size,67);
  assert.deepEqual(bank.source.pages,Array.from({length:10},(_,i)=>181+i));
  for(const s of bank.sections)assert.ok(course.sections.flatMap(s=>s.topics).some(t=>t.id===s.courseTopicId));
  assert.equal(find(38).sourcePage,186);assert.equal(find(67).sourcePage,190);
});
test("contrat JSON des 15 rubriques et figures indépendantes",()=>{
  bank.sections.forEach((s,i)=>assert.deepEqual(arenaPayloadSchema.parse({levelId:bank.levelId,subjectId:bank.subjectId,lessonKey:bank.lessonKey,lessonTitle:"Calcul intégral",difficulty:"easy",category:s.category,stageNumber:i+1,title:s.title,instructionsMarkdown:"",sourceSectionId:s.id,courseTopicId:s.courseTopicId,exercises:s.exercises}).exercises,s.exercises));
  assert.deepEqual(exercises.filter(e=>e.figureKey).map(e=>e.sourceNumber),[31,32,33,34,53,65,66]);
  assert.deepEqual(exercises.filter(e=>e.correctionFigureKey).map(e=>e.sourceNumber),[36,37,52,58,64,67]);
});
test("formules strictes, solutions complètes et seulement47 réponses objectives",()=>{
  let formulas=0;
  function visit(v:unknown){if(typeof v==="string"){for(const m of v.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)){katex.renderToString(m[1]??m[2],{throwOnError:true,strict:"error",trust:false,displayMode:Boolean(m[1])});formulas++;}}else if(Array.isArray(v))v.forEach(visit);else if(v&&typeof v==="object")Object.values(v).forEach(visit);}
  visit(bank);assert.ok(formulas>1700);
  for(const e of exercises){
    const a:Record<string,string>={};
    for(const q of e.questions??[]){
      assert.ok(q.explanation.length>50,e.id+"/"+q.label);assert.ok(e.correctionMarkdown.includes(q.explanation));
      if(q.answer.kind==="written"){assert.equal(q.points,0);assert.equal(exerciseAnswerStatus(q,"ma preuve"),"written");}
      else {const values=q.answer.kind==="short"?q.answer.accepted:[String(q.answer.correctIndex)];for(const v of values)assert.equal(exerciseAnswerStatus(q,v),"correct");a[q.id]=values[0];assert.equal(exerciseAnswerStatus(q,""),"unanswered");}
    }
    const result=exerciseAssessment(e,a);assert.equal(result.outOf20,result.total?20:null);
  }
});
test("47 calculs vérifiés indépendamment par quadrature, pas par lecture de la réponse",()=>{
  const pi=Math.PI,e=Math.E;
  const cases:Array<[(x:number)=>number,number,number,number]>=[
    [x=>x**-4,-1,-2,-7/24],[Math.sqrt,1,2,(4*Math.SQRT2-2)/3],[x=>Math.exp(2*x),0,Math.log(3),4],
    [x=>2/(2*x-1),1,e,Math.log(2*e-1)],[x=>Math.sin(3*x-pi/6),0,pi/2,(1+Math.sqrt(3))/6],
    [x=>Math.sin(x)**2,-pi/6,pi/2,pi/3-Math.sqrt(3)/8],
    [x=>(x-1)*Math.log(x),2,1,-.25],[x=>x/Math.sqrt(x+1),3,8,32/3],[x=>x/Math.cos(x)**2,0,pi/4,pi/4-Math.log(2)/2],
    [x=>(1-x)*Math.cos(4*x),0,pi/2,0],[x=>Math.log(x)/x**2,e,e*e,2/e-3/e**2],
    [x=>(x+1)*Math.exp(2*x),-1,1,(3*e**2+e**-2)/4],[x=>x*x*Math.sin(x),0,pi,pi*pi-4],
    [x=>(x+1)**2*Math.exp(-x),-1,0,2*e-5],[x=>x*Math.log(x)**2,1,e,(e*e-1)/4],
    [x=>Math.exp(x)*Math.cos(x),0,pi,-(Math.exp(pi)+1)/2],[x=>x/(2*x+1)**4,0,1,5/162],
    [x=>x*(4-x)**5,1,2,3133/21],[x=>x/Math.sqrt(1+2*x),0,1,1/3],
    [x=>x*x/(x+1),1,3,2+Math.log(2)],[x=>x*x*Math.exp(x),-1,0,2-5/e],
    [x=>1/(x*Math.log(x)**3),e,e**2,3/8],[x=>(x*x-1)*(3*x-x**3+1)**6,0,1,-2186/21],
    [x=>2*x/(x*x+1)**(2/3),0,2,3*(Math.cbrt(5)-1)],[x=>(2*x+1)*Math.sin(x*x+x),-1,0,0],
    [x=>Math.exp(1/x)/x**2,.5,1,e*e-e],[x=>Math.exp(x)/(Math.exp(x)+1),0,2,Math.log((e*e+1)/2)],
    [x=>2*x*x*(1-x**3)**2,-1,1,16/9],[x=>Math.log(x)**2/x,1,e,1/3],
    [x=>1/(Math.sqrt(x-1)+Math.sqrt(x+1)),3,5,(6*Math.sqrt(6)+2*Math.SQRT2-16)/3],
    [x=>Math.exp(-x)/(Math.exp(-x)+2)**4,0,2,1/(3*(e**-2+2)**3)-1/81],
    [x=>Math.cos(2*x)*Math.sin(2*x)**4,0,pi/4,.1],[x=>1/(x*Math.sqrt(Math.log(x)-1)),e**2,e**5,2],
    [x=>(x+1)/(2*x*x+4*x+3),0,1,Math.log(3)/4],
    [x=>Math.cos(x)*Math.exp(-2*Math.sin(x)),pi/2,pi/4,(e**-2-Math.exp(-Math.SQRT2))/2],
    [x=>(Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x)),Math.log(3),Math.log(5),Math.log(39/25)],
    [x=>1/(x*Math.log(x)),e,e*e,Math.log(2)],[x=>Math.sin(2*x)/(1+Math.cos(x)**2),pi/4,pi/2,Math.log(1.5)],
    [x=>Math.exp(-2*x)*Math.cos(x),0,pi/2,(2+Math.exp(-pi))/5],
    [x=>x*x*Math.log(x),1,e,(2*e**3+1)/9],
    [x=>(1-x)*Math.sin(2*x)*Math.cos(2*x)**3,0,pi/4,1/8-3*pi/256],
    [x=>Math.cos(x)**4,0,2*pi,3*pi/4],[x=>Math.sin(x)**2*Math.cos(x)**2,0,2*pi,pi/4],
    [x=>Math.sin(2*x)**5,0,pi/2,8/15],[x=>1/Math.sin(x)**4,pi/6,pi/2,2*Math.sqrt(3)],
    [x=>(x*x-1)/(x*(x*x+1)),1,3,Math.log(5/3)],[x=>(x**3-x*x-8*x+8)/(x-2)**2,3,5,34/3],
  ];
  assert.equal(cases.length,47);
  for(const [f,a,b,result]of cases)near(integrateForPlot(f,a,b,4000),result,2e-8);
});
test("primitives, aires et unités testées numériquement",()=>{
  near(integrateForPlot(x=>x*x+2*x,0,2)*2,40/3);
  near((-integrateForPlot(x=>x*x+2*x,-1,0)+integrateForPlot(x=>x*x+2*x,0,1))*2,4);
  near(integrateForPlot(x=>4/(x-1)**2,2,4),8/3);
  near(integrateForPlot(x=>-x*Math.exp(-x),-1,0)*4,4);
  near(integrateForPlot(x=>x/Math.sqrt(1+x*x),0,Math.sqrt(3))*6,6);
  const F=(x:number)=>-2*(3-x)**1.5+.4*(3-x)**2.5;
  for(const x of [-2,0,1,2])near((F(x+1e-5)-F(x-1e-5))/2e-5,x*Math.sqrt(3-x));
  near(integrateForPlot(x=>Math.log(x)/(x+2)**3,1,2),Math.log(3)/8-5*Math.log(2)/32-1/48);
  near(integrateForPlot(x=>Math.exp(x)*Math.cos(x)**2,0,Math.PI),3*(Math.exp(Math.PI)-1)/5);
});
test("suites d’intégrales et relations de récurrence contrôlées aux premiers rangs",()=>{
  const I=(n:number)=>integrateForPlot(x=>x**n*Math.exp(x),0,1,2000);
  for(let n=0;n<6;n++)near(I(n+1),Math.E-(n+1)*I(n));
  const W=(n:number)=>integrateForPlot(x=>Math.sin(x)**n,0,Math.PI/2,2000);
  for(let n=2;n<12;n++)near(n*W(n),(n-1)*W(n-2));
  const L=(n:number)=>integrateForPlot(x=>x*x*Math.log(x)**n,1,Math.E,2000);
  near(L(2),(5*Math.E**3-2)/27);
  for(let n=1;n<7;n++){near(3*L(n+1)+(n+1)*L(n),Math.E**3);assert.ok(L(n)<=Math.E**3/(n+1));}
  for(let n=1;n<10;n++){
    const j=integrateForPlot(x=>x**n/(1+x*x),0,1,2000);assert.ok(j>=1/(2*(n+1)));assert.ok(j<=1/(n+1));
    near(integrateForPlot(x=>2*Math.log(x)/x,Math.exp(n-1),Math.exp(n),2000),2*n-1);
  }
});
test("encadrements de rectangles, erreur garantie et borne renforcée de F",()=>{
  const a=rectangleSums(x=>-2/Math.log(x),.1,.7,6);assert.ok(a.left<1.27558&&a.left>1.27557);assert.ok(a.right<1.74946&&a.right>1.74945);
  const b=rectangleSums(x=>Math.exp(x)/(1+x*x),-1,4,10);assert.ok(b.left<6.69613&&b.left>6.69612);assert.ok(b.right<8.20999&&b.right>8.20998);
  for(const sums of[a,b,rectangleSums(x=>Math.sqrt(4-x*x),.4,.6,10)])assert.ok(rectangleDisplayError(sums)>=sums.error+Math.abs(Number(sums.midpoint.toFixed(6))-sums.midpoint));
  const M=Math.sqrt(2/Math.E);assert.ok(M/(2*4289)<=1e-4);assert.ok(M/(2*4288)>1e-4);
  for(const t of [1.1,2,3,10])assert.ok(Math.exp(t)>t*Math.exp(t/2));
  assert.match(find(52).questions![7].explanation,/e\^\{x\/2\}/);
  assert.match(find(10).questions![0].prompt,/int_b\^a/);assert.equal(find(10).questions![0].answer.kind,"choice");
  assert.equal(find(10).questions![1].answer.kind==="choice"&&find(10).questions![1].answer.correctIndex,0);
  assert.equal(find(15).questions![0].answer.kind==="choice"&&find(15).questions![0].answer.correctIndex,2);
});
test("situations : aire sous le pont, hectares et exponentielle positive",()=>{
  near(integrateForPlot(x=>x*x/1600-x/4+125,0,550),65598.9583333333);
  assert.match(find(65).correctionMarkdown,/65\\,599/);
  near(Math.E+integrateForPlot(x=>2-Math.log(x),Math.E,Math.E**2),Math.E**2-Math.E);
  assert.equal(Math.round(Math.E**2-Math.E),5);assert.match(find(66).correctionMarkdown,/hectares/);
  near(integrateForPlot(x=>x*x*Math.exp(x/30),0,30)/30,900*Math.E-1800);
  assert.match(find(67).statementMarkdown,/e\^\{x\/30\}/);assert.doesNotMatch(find(67).statementMarkdown,/e\^\{-/);
});
test("figures : domaines fixes, échelles géométriques et quadrature bornée",()=>{
  for(const p of ["between-curves",31,32,33,34,52,58,64,65,66,67] as const){
    const m=integralPlotModel(p)!;assert.ok(m);assert.ok(m.bounds[0]<m.bounds[1]);assert.ok(m.bounds[2]<m.bounds[3]);
    for(const s of m.series)for(const[a,b]of s.ranges)for(let i=0;i<=20;i++)assert.ok(Number.isFinite(s.fn(a+(b-a)*i/20)));
  }
  assert.equal(integralPlotModel(58)!.unitRatio,1.5);assert.equal(integralPlotModel(32)!.unitRatio,.5);assert.equal(integralPlotModel(64)!.unitRatio,1);
  near(integrateForPlot(t=>Math.exp(t)/t,1,1),0);assert.throws(()=>rectangleSums(x=>x,0,1,0));assert.throws(()=>integrateForPlot(x=>x,0,1,3));assert.equal(integralPlotModel(999),null);
});
test("brouillons par compte et C uniquement, aucun XP pour la banque",async()=>{
  assert.deepEqual(await loadExerciseCollection("terminale-c","mathematics",bank.lessonKey),bank);
  assert.equal(await loadExerciseCollection("terminale-d","mathematics",bank.lessonKey),null);
  assert.equal(await loadExerciseCollection("terminale-c","physics",bank.lessonKey),null);
  const e=find(1),q=e.questions![0];const draft=restoreExerciseDraft(JSON.stringify({answers:{[q.id]:"0",foreign:"x"},submitted:true}),e);
  assert.equal(draft.answers[q.id],"0");assert.equal(draft.answers.foreign,undefined);
  assert.notEqual(exerciseDraftKey("a",bank.id,1,e.id),exerciseDraftKey("b",bank.id,1,e.id));
  const {source,...visible}=bank;assert.ok(source.editorialNotes.length>10);assert.doesNotMatch(JSON.stringify(visible),/coquille|Excellence rétablit|Solution commentée/i);
});
