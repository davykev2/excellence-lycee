import assert from "node:assert/strict";
import test from "node:test";
import { arenaPayloadSchema } from "../apps/api/src/arenaExerciseSchema";
import { terminalCDifferentialExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCDifferentialExercises";
import { terminalCDifferentialDocument as course } from "../apps/web/src/data/courseDocuments/terminalCDifferentialDocument";
import { loadExerciseCollection } from "../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import { exerciseAnswerStatus, exerciseAssessment, exerciseDraftKey, restoreExerciseDraft } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { coolingTemperature, modelConcentration, dissolvedMass, objectTemperature, coolingTime45, objectThresholdTime, concentrationCrossings, differentialPlotModel } from "../apps/web/src/features/mathematics/differentialModels";
const exercises=bank.sections.flatMap(s=>s.exercises),questions=exercises.flatMap(e=>e.questions??[]), find=(n:number)=>exercises.find(e=>e.sourceNumber===n)!;
const near=(a:number,b:number,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol*Math.max(1,Math.abs(b)),a+" ≠ "+b);
const d=(f:(x:number)=>number,x:number)=>(f(x+1e-5)-f(x-1e-5))/2e-5;
const dd=(f:(x:number)=>number,x:number)=>(f(x+1e-4)-2*f(x)+f(x-1e-4))/1e-8;
test("39 exercices continus,22/16/1,10 rubriques et87 sous-questions fidèles",()=>{
  assert.deepEqual(exercises.map(e=>e.sourceNumber),Array.from({length:39},(_,i)=>i+1));
  assert.deepEqual(["fixation","deepening","complex"].map(c=>bank.sections.filter(s=>s.category===c).flatMap(s=>s.exercises).length),[22,16,1]);
  assert.equal(bank.sections.filter(s=>s.category==="fixation").length,10);
  assert.equal(questions.length,87);assert.equal(questions.filter(q=>q.answer.kind==="written").length,85);
  assert.equal(new Set(questions.map(q=>q.id)).size,87);assert.equal(new Set(exercises.map(e=>e.id)).size,39);
  assert.deepEqual(bank.source.pages,[204,205,206,207,208]);assert.equal(find(22).sourcePage,204);assert.equal(find(39).sourcePage,208);
  for(const s of bank.sections)assert.ok(course.sections.flatMap(s=>s.topics).some(t=>t.id===s.courseTopicId));
  assert.deepEqual(find(37).questions!.map(q=>q.label),["1.","2.","4.a)","4.b)","4.c)"]);
});
test("12 sections passent le contrat API ; quatre tracés seulement dans les corrections",()=>{
  bank.sections.forEach((s,i)=>assert.deepEqual(arenaPayloadSchema.parse({levelId:bank.levelId,subjectId:bank.subjectId,lessonKey:bank.lessonKey,lessonTitle:"Équations différentielles",difficulty:"easy",category:s.category,stageNumber:i+1,title:s.title,instructionsMarkdown:"",sourceSectionId:s.id,courseTopicId:s.courseTopicId,exercises:s.exercises}).exercises,s.exercises));
  assert.equal(exercises.filter(e=>e.figureKey).length,0);
  assert.deepEqual(exercises.filter(e=>e.correctionFigureKey).map(e=>e.sourceNumber),[34,37,38,39]);
  for(const n of[34,37,38,39]){const p=differentialPlotModel(n)!;assert.ok(p);for(const s of p.model.series)for(const[a,b]of s.ranges)for(const x of[a,(a+b)/2,b])assert.ok(Number.isFinite(s.fn(x)));}
  assert.equal(differentialPlotModel(37)!.model.orthonormal,true);assert.equal(differentialPlotModel(500),null);
});
test("85 rédactions sans fausse notation ; deux réponses numériques et modèles indépendants",()=>{
  for(const e of exercises){
    const answers:Record<string,string>={};
    for(const q of e.questions??[]){
      assert.ok(q.explanation.length>50,e.id+"/"+q.label);assert.ok(e.correctionMarkdown.includes(q.explanation));
      if(q.answer.kind==="written"){assert.equal(q.points,0);assert.equal(exerciseAnswerStatus(q,"ma preuve"),"written");}
      else if(q.answer.kind==="short"){for(const a of q.answer.accepted)assert.equal(exerciseAnswerStatus(q,a),"correct");answers[q.id]=q.answer.accepted[0];assert.equal(exerciseAnswerStatus(q,""),"unanswered");}
    }
    const result=exerciseAssessment(e,answers);assert.equal(result.outOf20,result.total?20:null);
  }
  const q=find(34).questions![2];assert.equal(exerciseAnswerStatus(q,"38.9"),"incorrect");assert.equal(exerciseAnswerStatus(q,"3*13"),"correct");
  assert.equal(exerciseAssessment(find(39),{}).outOf20,null);
});
test("solutions des exercices1–29 contrôlées par dérivation et valeurs initiales",()=>{
  const r=Math.sqrt(2),s=Math.sqrt(3),pi=Math.PI;
  const cases:Array<[(x:number)=>number,1|2,number,number,Array<[number,number,number?]>]>=[
    [x=>2*Math.exp(r*x),1,r,0,[]],[x=>2*Math.exp(1+5*x)-.6,1,5,3,[]],
    [x=>x*Math.sqrt(5)+Math.log(3),2,0,0,[]],[x=>2*Math.exp(2*r*x)-3*Math.exp(-2*r*x),2,8,0,[]],
    [x=>pi*Math.cos(13*x)+r*Math.sin(13*x),2,-169,0,[]],
    [x=>2*Math.exp(3*x),1,3,0,[]],[x=>-2*Math.exp(-4*x),1,-4,0,[]],
    [x=>Math.exp(2*x-1),1,2,0,[[1,Math.E]]],[x=>5*Math.exp(2-2*x/3),1,-2/3,0,[[3,5]]],
    [x=>2*Math.exp(2*x)+2.5,1,2,-5,[]],[x=>2*Math.exp(4*x)-.75,1,4,3,[]],
    [x=>.4-.8*Math.exp(5*x),1,5,-2,[[0,-.4]]],[x=>4/3-Math.exp(-3*x-1)/3,1,-3,4,[[-1/3,1]]],
    [x=>-2*x+5,2,0,0,[[1,3],[2,1]]],[x=>x,2,0,0,[[1,1],[2,2]]],[()=>2,2,0,0,[[-1,2],[5,2]]],
    [x=>Math.exp(2*x)+2*Math.exp(-2*x),2,4,0,[]],[x=>Math.exp(Math.sqrt(5)*x)-Math.exp(-Math.sqrt(5)*x),2,5,0,[]],
    [x=>3*Math.exp(x/2)+Math.exp(-x/2),2,.25,0,[[0,4,1]]],
    [x=>(Math.exp(3*x/r-3)+Math.exp(-3*x/r+3))/2,2,4.5,0,[[r,1,0]]],
    [x=>2*Math.cos(s*x)+Math.sin(s*x),2,-3,0,[]],[x=>2*Math.cos(7*x)-Math.sin(7*x),2,-49,0,[]],
    [x=>-Math.cos(3*x)+2*Math.sin(3*x),2,-9,0,[[pi/3,1,-6]]],[x=>2*Math.sin(x),2,-1,0,[[pi/6,1,s]]],
    [x=>2*Math.exp(-2*x/3),1,-2/3,0,[[0,2]]],
    [x=>16/3*Math.exp(.75*x)+8/3,1,.75,-2,[[0,8,4]]],
    [x=>-2*x/3+2,2,0,0,[[3,0]]],
    [x=>(3-s)/2*Math.cos(5*x)+(1+3*s)/2*Math.sin(5*x),2,-25,0,[[pi/15,3,5]]],
    [x=>Math.exp(1.5*x)/3+5*Math.exp(-1.5*x)/3,2,2.25,0,[[0,2,-2]]],
    [x=>.5*Math.cos(2*x)+2*Math.sin(2*x),2,-4,0,[[pi/4,2,-1]]],
    [x=>Math.cos(1.5*x)+Math.sin(1.5*x),2,-2.25,0,[[0,1],[pi/6,Math.SQRT2,0]]],
  ];
  for(const[f,order,a,b,initials]of cases){
    for(const x of[-.2,0,.2])near(order===1?d(f,x):dd(f,x),a*f(x)+b,5e-6);
    for(const[x0,y0,v0]of initials){near(f(x0),y0);if(v0!==undefined)near(d(f,x0),v0,1e-6);}
  }
});
test("solutions particulières30–36 et équivalences cohérentes avec les ED sources",()=>{
  const p=(x:number)=>-3/32*Math.exp(2*x)+x/12-1/6;
  const h=(x:number)=>.75*Math.exp(6*x)+49/96*Math.exp(-6*x)+p(x);
  const cases:Array<[(x:number)=>number,(x:number)=>number,1|2,number]>=[
    [x=>(x-1)*Math.exp(2*x),Math.exp,1,2],
    [x=>-2/5*Math.cos(x)+Math.sin(x)/5,Math.cos,1,2],
    [x=>x*x/3-11*x/9+47/27,x=>x*x-3*x+4,1,-3],
  ];
  for(const[f,forcing,order,a]of cases)for(const x of[-.2,0,.3]){
    const right=forcing===Math.exp?Math.exp(2*x):forcing(x);near((order===1?d(f,x):dd(f,x))-a*f(x),right,1e-6);
  }
  for(const n of[2,3,10])for(const x of[-1,0,2]){const f=(t:number)=>2*Math.exp(t/n)+t/(n+1)+1;near(d(f,x)-f(x)/n,-(x+1)/(n*(n+1)));}
  for(const x of[-.2,0,.3]){near(dd(p,x)/3-12*p(x)-Math.exp(2*x)+x-2,0,2e-6);near(dd(h,x)/3-12*h(x)-Math.exp(2*x)+x-2,0,5e-6);}
  near(h(0),1);near(d(h,0),4/3);
  const f=(x:number)=>3*Math.cos(Math.PI*x/3)-Math.sqrt(3)*Math.sin(Math.PI*x/3);
  near(f(3),-3);near(d(f,3),Math.PI/Math.sqrt(3));
  for(const x of[-1,0,2,3])near(f(x),2*Math.sqrt(3)*Math.cos(Math.PI/3*(x+.5)));
  assert.match(find(36).statementMarkdown,/-\\frac3/);assert.match(find(35).questions![3].prompt,/x\+\\frac12/);
});
test("modèles : conversions, masse restante, deux seuils et relevés discrets",()=>{
  near(coolingTemperature(0),80);near(coolingTemperature(.5),15+65/Math.E);near(coolingTemperature(coolingTime45),45);
  assert.equal(Math.round(coolingTemperature(.5)),39);assert.equal(Math.floor(60*coolingTime45),23);assert.equal(Math.round((60*coolingTime45-23)*60),12);
  near(dissolvedMass(0),0);near(dissolvedMass(10),20);
  for(const t of[0,1,10,50]){near(d(dissolvedMass,t),Math.log(5/3)/10*(50-dissolvedMass(t)));assert.ok(dissolvedMass(t)>=0&&dissolvedMass(t)<50);}
  const [t1,t2]=concentrationCrossings();near(modelConcentration(t1),.9);near(modelConcentration(t2),.9);
  assert.ok(t1<1&&t2>1);assert.ok(modelConcentration(0)<.9);assert.ok(modelConcentration(1)>.9);assert.ok(modelConcentration(3)<.9);
  near(d(modelConcentration,1),0);assert.match(find(37).statementMarkdown,/f\(0\)=0/);
  near(objectTemperature(0),100);near(objectTemperature(objectThresholdTime),15);
  assert.ok(objectTemperature(2)>15);assert.ok(objectTemperature(3)<15);assert.equal(Math.ceil(objectThresholdTime),3);
});
test("brouillons isolés et contenu commun C/D, sans faux score ni correction persistée",async()=>{
  assert.deepEqual(await loadExerciseCollection("terminale-c","mathematics",bank.lessonKey),bank);
  assert.deepEqual((await loadExerciseCollection("terminale-d","mathematics","terminale-d-math-l12-differential-equations"))?.sections,bank.sections);
  assert.equal(await loadExerciseCollection("terminale-c","physics-chemistry",bank.lessonKey),null);
  const item=find(36),q=item.questions![0];
  const restored=restoreExerciseDraft(JSON.stringify({answers:{[q.id]:"Ma preuve",other:"x"},reasoning:"Mes calculs",submitted:true,open:true}),item);
  assert.deepEqual(restored.answers,{[q.id]:"Ma preuve"});assert.equal(restored.reasoning,"Mes calculs");assert.equal("open"in restored,false);
  assert.notEqual(exerciseDraftKey("a",bank.id,item.id),exerciseDraftKey("b",bank.id,item.id));
  assert.notEqual(exerciseDraftKey("a",bank.id,item.id),exerciseDraftKey("a",bank.id,find(37).id));
});
