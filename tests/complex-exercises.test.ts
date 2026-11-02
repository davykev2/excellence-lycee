import assert from "node:assert/strict";
import test from "node:test";
import { terminalCComplexExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCComplexExercises";
import { terminalCComplexDocument as course } from "../apps/web/src/data/courseDocuments/terminalCComplexDocument";
import { arenaPayloadSchema } from "../apps/api/src/arenaExerciseSchema";
import { loadExerciseCollection } from "../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import { exerciseAssessment,exerciseAnswerStatus } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { complexScenes } from "../apps/web/src/features/mathematics/complexScenes";
import { complexAdd as add,complexMultiply as mul,complexDivide as div,complexNorm as norm,complexSubtract as sub,complexPower as pow,type ComplexPair } from "../apps/web/src/features/mathematics/complexMath";
const es=bank.sections.flatMap(s=>s.exercises),qs=es.flatMap(e=>e.questions??[]),find=(n:number)=>es.find(e=>e.sourceNumber===n)!;
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-7,a+" ≠ "+b),zero=(z:ComplexPair)=>near(norm(z),0);
const poly=(z:ComplexPair,coeffs:ComplexPair[])=>coeffs.reduce((s,a)=>add(mul(s,z),a),[0,0] as ComplexPair);
test("80 exercices numérotés,54/24/2,19 rubriques bleues,266 sous-questions",()=>{
 assert.deepEqual(es.map(e=>e.sourceNumber),Array.from({length:80},(_,i)=>i+1));
 assert.deepEqual(["fixation","deepening","complex"].map(c=>bank.sections.filter(s=>s.category===c).flatMap(s=>s.exercises).length),[54,24,2]);
 assert.equal(bank.sections.filter(s=>s.category==="fixation").length,19);
 assert.deepEqual(["short","choice","written"].map(k=>qs.filter(q=>q.answer.kind===k).length),[100,21,145]);
 assert.equal(new Set(qs.map(q=>q.id)).size,266);assert.equal(new Set(es.map(e=>e.id)).size,80);
 const topicIds=course.sections.flatMap(s=>s.topics).map(t=>t.id);
 for(const s of bank.sections)assert.ok(topicIds.includes(s.courseTopicId),s.courseTopicId);
});
test("le contrat fermé Web/API conserve les symboles,21 catégories et26 figures de correction",()=>{
 for(const[s,i]of bank.sections.map((s,i)=>[s,i] as const)){
  const parsed=arenaPayloadSchema.parse({levelId:bank.levelId,subjectId:bank.subjectId,lessonKey:bank.lessonKey,lessonTitle:"Nombres complexes",difficulty:"easy",category:s.category,stageNumber:i+1,title:s.title,instructionsMarkdown:"",sourceSectionId:s.id,courseTopicId:s.courseTopicId,exercises:s.exercises});
  assert.deepEqual(parsed.exercises,s.exercises);
 }
 assert.deepEqual(es.filter(e=>e.figureKey).map(e=>e.sourceNumber),[76,77]);assert.equal(es.filter(e=>e.correctionFigureKey).length,26);
 for(const e of es.filter(e=>e.correctionFigureKey))assert.ok(complexScenes("",e.sourceNumber).length,e.id);
});
test("121 résultats objectifs,145 rédactions sans fausse note, corrections indépendantes",()=>{
 for(const e of es){const answers:Record<string,string>={};
  for(const q of e.questions!){assert.ok(q.explanation.length>30,e.id+"/"+q.label);assert.ok(e.correctionMarkdown.includes(q.explanation));
   if(q.answer.kind==="written"){assert.equal(q.points,0);assert.equal(exerciseAnswerStatus(q,"Ma preuve"),"written");}
   else{assert.equal(exerciseAnswerStatus(q,""),"unanswered");answers[q.id]=q.answer.kind==="choice"?String(q.answer.correctIndex):q.answer.accepted[0];assert.equal(exerciseAnswerStatus(q,answers[q.id]),"correct",e.id+"/"+q.label);}
  }
  const r=exerciseAssessment(e,answers);assert.equal(r.outOf20,r.total?20:null);
 }
 assert.equal(exerciseAssessment(find(79),{}).outOf20,null);assert.equal(exerciseAssessment(find(80),{}).outOf20,null);
});
test("saisies complexes : ordre des termes, fractions, racines et puissances sont équivalents",()=>{
 for(const[n,i,v]of[[7,1,"i√2"],[10,0,"(1-i)/2"],[11,2,"-4"],[18,2,"(1+i)/2"],[26,0,"2i-3"],[56,5,"(sqrt3+i)/3"],[67,0,"(1-3i)/2"],[69,1,"-2i/3"],[78,5,"-i*(1+sqrt3)"]] as const){
  assert.equal(exerciseAnswerStatus(find(n).questions![i],v),"correct",n+"/"+i+"="+v);
  assert.equal(exerciseAnswerStatus(find(n).questions![i],"999"),"incorrect");
 }
});
test("équations52,61,62,63 : les racines annoncées annulent chaque polynôme",()=>{
 for(const z of[[Math.sqrt(3)/2-1,-.5],[Math.sqrt(3)/2+1,.5]] as ComplexPair[])zero(poly(z,[[0,1],[0,-Math.sqrt(3)],[1,0]]));
 for(const z of[[2,0],[0,1],[-1,-1]] as ComplexPair[])zero(poly(z,[[1,0],[-1,0],[-1,-1],[-2,2]]));
 for(const z of[[2,0],[-2,0],[0,1],[0,-1]] as ComplexPair[])zero(poly(z,[[1,0],[0,0],[-3,0],[0,0],[-4,0]]));
 for(const z of[[0,2],[1,1],[-2,2]] as ComplexPair[])zero(poly(z,[[1,0],[1,-5],[-10,-2],[0,8]]));
});
test("racines, équations paramétrées et degré6 validés algébriquement",()=>{
 for(const theta of[0,Math.PI/6,.7,Math.PI/2,5*Math.PI/6,Math.PI-.01]){
  const r=2**theta;for(const z of[[r*Math.cos(theta),r*Math.sin(theta)],[r*Math.cos(theta),-r*Math.sin(theta)]] as ComplexPair[])zero(poly(z,[[1,0],[-2*r*Math.cos(theta),0],[r*r,0]]));
 }
 const a:ComplexPair=[4.5*Math.sqrt(3),-13.5];near(norm(a),9*Math.sqrt(3));
 for(let k=0;k<5;k++){const t=-Math.PI/15+2*k*Math.PI/5;zero(sub(pow([Math.sqrt(3)*Math.cos(t),Math.sqrt(3)*Math.sin(t)],5),a));}
 for(const s of complexScenes("",72))for(const p of s.points)zero(poly(p.p,[[1,0],[0,0],[0,0],[7,-1],[0,0],[0,0],[-8,-8]]));
});
test("lieux66/67 : domaine, inclusion du quotient nul et demi-droite, pas droite entière",()=>{
 const scene=complexScenes("",66)[1];
 for(let k=0;k<40;k++){const t=k*.173,z:ComplexPair=[1+Math.sqrt(5)/2*Math.cos(t),.5+Math.sqrt(5)/2*Math.sin(t)];if(norm(sub(z,[0,1]))<1e-6)continue;near(div(sub(mul([2,0],z),[4,0]),sub(z,[0,1]))[0],0);}
 const b:ComplexPair=[.5,-1.5];zero(sub(div(mul([0,1],b),add(b,[0,1])),[1,2]));
 near(norm(add(b,[0,1])),Math.SQRT1_2);assert.ok(complexScenes("",67)[0].lines![0].ray);
 assert.ok(scene.points.some(p=>p.label==="U"&&!p.excluded));assert.ok(scene.points.some(p=>p.label==="V"&&p.excluded));
});
test("rotation78 et demi-cercle79 : signes, angles et extrémités exclus validés",()=>{
 const s=complexScenes("",78)[0],p=Object.fromEntries(s.points.map(p=>[p.label,p.p])),u:ComplexPair=[.5,-Math.sqrt(3)/2];
 zero(sub(sub(p.E,p.C),mul(u,sub(p.B,p.C))));zero(sub(sub(p.F,p.C),mul(u,sub(p.D,p.C))));near(div(sub(p.A,p.E),sub(p.A,p.F))[0],2-Math.sqrt(3));near(div(sub(p.A,p.E),sub(p.A,p.F))[1],0);
 const arc=complexScenes("",79)[0].arcs![0];for(let k=1;k<100;k++){const t=arc.start+(arc.end-arc.start)*k/100,z:ComplexPair=[arc.center[0]+arc.r*Math.cos(t),arc.center[1]+arc.r*Math.sin(t)],q=div(sub(z,[0,2]),sub(z,[1,-1]));near(q[0],0);assert.ok(q[1]>0);}
 assert.ok(complexScenes("",79)[0].points.every(p=>p.excluded));
});
test("linéarisations58/59 et hexagone80 : identités et côtés égaux au rayon",()=>{
 for(let k=-50;k<=50;k++){const x=k*.123,c=Math.cos(x),s=Math.sin(x);
  near(c*c*s**3,(2*s+Math.sin(3*x)-Math.sin(5*x))/16);
  near(c**5-s**4,(10*c+8*Math.cos(2*x)+5*Math.cos(3*x)-2*Math.cos(4*x)+Math.cos(5*x)-6)/16);
  near(Math.cos(5*x)+Math.cos(6*x),32*c**6+16*c**5-48*c**4-20*c**3+18*c*c+5*c-1);
  near(s-Math.sin(2*x)+Math.sin(3*x)-Math.sin(4*x),s*(-8*c**3+4*c*c+2*c));
 }
 for(const r of[.5,1,2,4]){const ps=complexScenes("",80,45,3,r)[0].points;for(let i=0;i<6;i++)near(norm(sub(ps[i].p,ps[(i+1)%6].p)),r);}
});
test("réservé au bon contexte de catalogue",async()=>{
 assert.equal((await loadExerciseCollection("terminale-c","mathematics",bank.lessonKey))?.id,bank.id);
 assert.equal(await loadExerciseCollection("terminale-d","mathematics",bank.lessonKey),null);assert.equal(await loadExerciseCollection("terminale-c","physics",bank.lessonKey),null);
});
