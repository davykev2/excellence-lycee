import assert from "node:assert/strict";
import test from "node:test";
import { arenaPayloadSchema } from "../apps/api/src/arenaExerciseSchema";
import { terminalCSpaceExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCSpaceExercises";
import { loadExerciseCollection } from "../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import { exerciseAnswerStatus,exerciseAssessment } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { add3,sub3,scale3,dot3,norm3,planeValue,pointPlaneDistance,linePlanePosition,twoLinesPosition,type Vec3 } from "../apps/web/src/features/mathematics/spaceModels";
const es=bank.sections.flatMap(s=>s.exercises),qs=es.flatMap(e=>e.questions??[]),find=(n:number)=>es.find(e=>e.sourceNumber===n)!,near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-8,a+" ≠ "+b);
test("29 exercices1–29,13/15/1 et65 sous-questions fidèles aux trois pages",()=>{
  assert.deepEqual(es.map(e=>e.sourceNumber),Array.from({length:29},(_,i)=>i+1));
  assert.deepEqual(["fixation","deepening","complex"].map(c=>bank.sections.filter(s=>s.category===c).flatMap(s=>s.exercises).length),[13,15,1]);
  assert.deepEqual(["short","choice","written"].map(k=>qs.filter(q=>q.answer.kind===k).length),[2,9,54]);
  assert.equal(new Set(qs.map(q=>q.id)).size,65);assert.equal(new Set(es.map(e=>e.id)).size,29);
  assert.deepEqual(es.map(e=>e.questions!.length),[1,2,2,1,1,1,1,2,2,2,1,2,1,3,3,3,3,2,2,2,6,2,2,2,2,2,3,8,1]);
  for(const e of es)assert.equal(e.sourcePage,e.sourceNumber!<=13?80:e.sourceNumber!<=25?81:82);
});
test("contrat JSON Web/API et figures de correction indépendantes",()=>{
  for(const[s,i]of bank.sections.map((s,i)=>[s,i]as const)){
    const parsed=arenaPayloadSchema.parse({levelId:bank.levelId,subjectId:bank.subjectId,lessonKey:bank.lessonKey,lessonTitle:"Géométrie analytique de l’espace",difficulty:"easy",category:s.category,stageNumber:i+1,title:s.title,instructionsMarkdown:"",sourceSectionId:s.id,courseTopicId:s.courseTopicId,exercises:s.exercises});
    assert.deepEqual(parsed.exercises,s.exercises);
  }
  assert.deepEqual(es.filter(e=>e.figureKey).map(e=>e.sourceNumber),[1,2]);
  assert.deepEqual(es.filter(e=>e.correctionFigureKey).map(e=>e.sourceNumber),[7,8,9,10,11,12,13,17,18,19,20,21,22,23,24,25,26,27,28,29]);
});
test("11 réponses objectives sans XP ;54 rédactions sans fausse note automatique",()=>{
  for(const e of es){
    const answers:Record<string,string>={};
    for(const q of e.questions!){
      assert.ok(q.explanation.length>65,e.id+"/"+q.label);assert.ok(e.correctionMarkdown.includes(q.explanation));
      if(q.answer.kind==="written"){assert.equal(q.points,0);assert.equal(exerciseAnswerStatus(q,"Ma preuve"),"written");}
      else{answers[q.id]=q.answer.kind==="choice"?String(q.answer.correctIndex):q.answer.accepted[0];assert.equal(exerciseAnswerStatus(q,""),"unanswered");assert.equal(exerciseAnswerStatus(q,answers[q.id]),"correct");}
    }
    const result=exerciseAssessment(e,answers);assert.equal(result.outOf20,result.total?20:null);
  }
  assert.equal(exerciseAssessment(find(28),{}).outOf20,null);
});
test("équations et distances calculées indépendamment des corrigés",()=>{
  const systems:[number,Vec3[],Vec3,number][]=[
    [3,[[2,0,3]],[1,2,-3],7],
    [4,[[1,1,0],[-1,0,4],[2,2,-1]],[3,-2,1],-1],
    [13,[[2,4,-5]],[1,4,2],-8],
    [17,[[0,1,1],[2,3,-1],[-3,4,1]],[1,1,2],-3],
    [18,[[-2,0,0],[0,3,0],[0,0,-4]],[6,-4,3],12],
    [22,[[1,0,1],[1,-3,-2]],[1,1,-1],0],
    [27,[[2,1,4],[0,1,3]],[1,0,-2],6],
    [28,[[1,2,-1],[-3,-2,3],[0,-2,-3]],[2,-1,1],1],
  ];
  for(const[,points,n,d]of systems)for(const p of points)near(planeValue({normal:n,d},p),0);
  near(pointPlaneDistance([4,2,-1],{normal:[3,-4,0],d:6}),2);
  near(pointPlaneDistance([3,0,0],{normal:[1,1,-2],d:-.5}),5/(2*Math.sqrt(6)));
  assert.equal(exerciseAnswerStatus(find(12).questions![1],"5sqrt(6)/12"),"correct");
  assert.equal(exerciseAnswerStatus(find(12).questions![1],"0"),"incorrect");
});
test("les paramétrages satisfont toutes les équations pour chaque valeur testée",()=>{
  for(const t of[-10,-1,0,.25,1,8]){
    const p9:Vec3=[-1-22*t,-19*t,-1+5*t];near(planeValue({normal:[2,-1,5],d:7},p9),0);near(planeValue({normal:[-3,4,2],d:-1},p9),0);
    const p21:Vec3=[2*t,-4*t-3,t];near(planeValue({normal:[3,1,-2],d:3},p21),0);near(planeValue({normal:[1,0,-2],d:0},p21),0);
    const p23:Vec3=[1-t,t,3*t];near(planeValue({normal:[1,-2,1],d:-1},p23),0);near(planeValue({normal:[2,-1,1],d:-2},p23),0);
    const p24:Vec3=[.5+1.5*t,-1+4*t,.75-t];near((2*p24[0]-1)/3,t);near((p24[1]+1)/4,t);near((3-4*p24[2])/4,t);
    const p26=add3([-3,4,3],scale3([1,-2,1],t));near(planeValue({normal:[2,1,0],d:2},p26),0);
    for(const u of[-2,0,3]){const p25:Vec3=[3+2*t-4*u,2+t-u,5*t-5*u];near(planeValue({normal:[0,-5,1],d:10},p25),0);}
  }
  assert.equal(twoLinesPosition({point:[-2,2,1],direction:[1,-1,4]},{point:[3,-2,1],direction:[1,3,1]}),"skew");
  assert.equal(twoLinesPosition({point:[-2,2,4],direction:[1,-2,1]},{point:[-1,0,1],direction:[-1,2,1]}),"secant");
  assert.equal(twoLinesPosition({point:[1,-2,2],direction:[1,-1,3]},{point:[0,1,3],direction:[2,-1,1]}),"skew");
});
test("sphère et section plane : barycentre, projection et rayon3 vérifiés",()=>{
  const A:Vec3=[1,2,-1],B:Vec3=[-3,-2,3],C:Vec3=[0,-2,-3],G=scale3(add3(sub3(A,B),scale3(C,2)),.5),H:Vec3=[-1,-3,-2];
  assert.deepEqual(G,[2,0,-5]);near(dot3(sub3(G,C),[2,-1,1]),0);
  near(planeValue({normal:[1,1,-1],d:2},H),0);near(norm3(sub3(G,H)),3*Math.sqrt(3));near(Math.sqrt(36-norm3(sub3(G,H))**2),3);
  for(const M of [[0,0,0],[2,3,4],[-3,1,0]] as Vec3[])assert.deepEqual(add3(sub3(sub3(A,M),sub3(B,M)),scale3(sub3(C,M),2)),scale3(sub3(G,M),2));
});
test("situation29 : droite sécante, distance0 ; ne pas inventer un câble parallèle",()=>{
  const n:Vec3=[17,3,11],p={normal:n,d:-72};
  for(const a of [[1,0,5],[0,2,6],[3,7,0]] as Vec3[])near(planeValue(p,a),0);
  assert.equal(dot3(n,[2,1,-3]),4);
  const result=linePlanePosition({point:[-5,3,2],direction:[2,1,-3]},p);assert.equal(result.kind,"secant");
  if(result.kind==="secant"){near(result.t,63/2);assert.deepEqual(result.point,[58,69/2,-185/2]);near(planeValue(p,result.point),0);}
  assert.match(find(29).correctionMarkdown,/distance minimale est donc.*0/);assert.match(find(29).correctionMarkdown,/objets finis/);
});
test("sources rectifiées discrètement, sans fausse unicité ni changements de classe",async()=>{
  assert.match(find(6).questions![0].answer.kind==="choice"?find(6).questions![0].answer.options[0]:"",/y=1-\\lambda/);
  assert.match(find(18).questions![1].prompt,/d’un plan/);assert.doesNotMatch(find(18).questions![1].prompt,/unique/);
  assert.match(find(21).questions![4].prompt,/y=-4t-3/);assert.match(bank.source.editorialNotes.join(" " ),/Ex29/);
  for(const e of es)assert.doesNotMatch(e.statementMarkdown+e.correctionMarkdown,/coquille|Excellence rétablit|Solution commentée/);
  assert.equal((await loadExerciseCollection("terminale-c","mathematics",bank.lessonKey))?.id,bank.id);
  assert.equal(await loadExerciseCollection("terminale-d","mathematics",bank.lessonKey),null);
});
