import assert from "node:assert/strict";
import test from "node:test";
import { arenaPayloadSchema } from "../apps/api/src/arenaExerciseSchema";
import { terminalCConicsExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCConicsExercises";
import { loadExerciseCollection } from "../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import { exerciseAnswerStatus,exerciseAssessment } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { conicScenes } from "../apps/web/src/features/mathematics/conicScenes";
import { classifyConic,conicPointAt,conicEquationValue,family35,family36,conicFeatures,type ConicSet } from "../apps/web/src/features/mathematics/conicModels";
const es=bank.sections.flatMap(s=>s.exercises),qs=es.flatMap(e=>e.questions??[]),find=(n:number)=>es.find(e=>e.sourceNumber===n)!,near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-7,a+" ≠ "+b);
test("42 exercices1–42,13/27/2,145 sous-questions et sept rubriques",()=>{
  assert.deepEqual(es.map(e=>e.sourceNumber),Array.from({length:42},(_,i)=>i+1));
  assert.deepEqual(["fixation","deepening","complex"].map(c=>bank.sections.filter(s=>s.category===c).flatMap(s=>s.exercises).length),[13,27,2]);
  assert.deepEqual(["short","choice","written"].map(k=>qs.filter(q=>q.answer.kind===k).length),[16,8,121]);
  assert.deepEqual(es.map(e=>e.questions!.length),[5,6,4,4,2,3,2,10,10,2,12,12,3,2,2,2,2,2,1,1,2,2,2,2,2,2,2,3,3,4,3,4,3,4,1,1,3,3,7,3,1,1]);
  assert.equal(new Set(qs.map(q=>q.id)).size,145);assert.equal(new Set(es.map(e=>e.id)).size,42);
  for(const e of es)assert.equal(e.sourcePage,e.sourceNumber!<=11?107:e.sourceNumber!<=26?108:e.sourceNumber!<=38?109:110);
});
test("contrat JSON fermé Web/API, aucune figure dans l’énoncé et corrections indépendantes",()=>{
  for(const[s,i]of bank.sections.map((s,i)=>[s,i]as const)){
    const parsed=arenaPayloadSchema.parse({levelId:bank.levelId,subjectId:bank.subjectId,lessonKey:bank.lessonKey,lessonTitle:"Coniques",difficulty:"easy",category:s.category,stageNumber:i+1,title:s.title,instructionsMarkdown:"",sourceSectionId:s.id,courseTopicId:s.courseTopicId,exercises:s.exercises});
    assert.deepEqual(parsed.exercises,s.exercises);
  }
  assert.ok(es.every(e=>!e.figureKey));assert.equal(es.filter(e=>e.correctionFigureKey).length,39);
  for(const e of es.filter(e=>e.correctionFigureKey)){const scenes=conicScenes("",e.sourceNumber);assert.ok(scenes.length,e.id);}
});
test("24 objectifs corrigés localement sans XP ;121 rédactions non notées automatiquement",()=>{
  for(const e of es){
    const answers:Record<string,string>={};
    for(const q of e.questions!){
      assert.ok(q.explanation.length>60,e.id+"/"+q.label);assert.ok(e.correctionMarkdown.includes(q.explanation));
      if(q.answer.kind==="written"){assert.equal(q.points,0);assert.equal(exerciseAnswerStatus(q,"Ma preuve"),"written");}
      else{answers[q.id]=q.answer.kind==="choice"?String(q.answer.correctIndex):q.answer.accepted[0];assert.equal(exerciseAnswerStatus(q,""),"unanswered");assert.equal(exerciseAnswerStatus(q,answers[q.id]),"correct");}
    }
    const result=exerciseAssessment(e,answers);assert.equal(result.outOf20,result.total?20:null);
  }
  assert.equal(exerciseAssessment(find(39),{}).outOf20,null);assert.equal(exerciseAnswerStatus(find(8).questions![0],"0"),"incorrect");
});
test("les 16 résultats numériques acceptent fractions, radicaux simples et symboles du clavier",()=>{
  const typed:Record<number,string[]>={8:["sqrt(5)","sqrt(5)/3","3","3/5"],9:["√(5)","√(5)/3","3","0,6"],11:["2*sqrt(5)","sqrt(5)/2","sqrt(5)","sqrt(5)"],12:["2*sqrt(3)","sqrt(6)/2","2*sqrt(5)","sqrt(10)/2"]};
  for(const[n,values]of Object.entries(typed)){
    const e=find(Number(n)),shorts=e.questions!.filter(q=>q.answer.kind==="short");
    assert.equal(shorts.length,values.length);
    const answers=Object.fromEntries(shorts.map((q,i)=>[q.id,values[i]]));
    for(const q of shorts)assert.equal(exerciseAnswerStatus(q,answers[q.id]),"correct",n+"/"+q.label+" = "+answers[q.id]);
    assert.equal(exerciseAssessment(e,answers).outOf20,20);
    for(const q of shorts)assert.equal(exerciseAnswerStatus(q,"999"),"incorrect");
  }
});
test("réductions, points isolés, vide et paraboles des exercices3–30",()=>{
  const sets:[number,number[],number][]=[
    [4,[4,1,-4,-2,7],0],[4,[0,1,-1,0,4],1],[4,[3,-1,-3,0,0],2],[4,[2,-1,-2,0,3],3],
    [21,[0,1,8,-2,-12],0],[21,[1,0,1,-3,0],1],
    [28,[9,-16,9,-16,-151],0],[30,[25,-16,-125,-32,161],0],[30,[4,1,4,2,-8],1],
  ];
  for(const[n,c,i]of sets){const scene=conicScenes("",n)[i].sets[0];assert.equal(classifyConic(...c as [number,number,number,number,number]).kind,scene.kind);if(scene.kind==="ellipse"||scene.kind==="hyperbola"||scene.kind==="parabola")for(const t of[-1,0,.6]){const[x,y]=conicPointAt(scene,t);near(c[0]*x*x+c[1]*y*y+2*c[2]*x+2*c[3]*y+c[4],0);}}
  const isolated=classifyConic(4,1,-6,0,9);assert.equal(isolated.kind,"point");if(isolated.kind==="point"){near(isolated.point[0],1.5);near(isolated.point[1],0);}assert.equal(classifyConic(9,1,-3,0,5).kind,"empty");
  assert.equal(classifyConic(1,.5,0,0,.25).kind,"empty");assert.ok(find(29).correctionMarkdown.includes("\\varnothing"));
});
test("familles35 et36 : tous les intervalles, singularités et équations vérifiés indépendamment",()=>{
  for(const[m,kind]of[[-4,"ellipse"],[-1,"lines"],[-.9,"hyperbola"],[-2/3,"lines"],[0,"hyperbola"],[1,"lines"],[3,"ellipse"]]as const)assert.equal(family35(m).kind,kind);
  for(const[m,kind]of[[-4,"ellipse"],[-2,"parabola"],[-1,"hyperbola"],[0,"lines"],[3,"ellipse"]]as const)assert.equal(family36(m).kind,kind);
  for(let n=35;n<=36;n++)for(const m of[-3.5,-2,-1,-2/3,0,.5,1,2.5]){
    const model=n===35?family35(m):family36(m);
    const value=([x,y]:readonly[number,number])=>n===35?(m-1)*x*x+(m+1)*y*y+(2*m-2)*x-(4*m+4)*y-4*m-3:m*x*x+(m+2)*y*y+2*m*x-(4*m+4)*y-2;
    if(model.kind==="ellipse"||model.kind==="hyperbola"||model.kind==="parabola")for(const t of[-1,0,.5])near(value(conicPointAt(model,t)),0);
    else if(model.kind==="lines")for(const l of model.lines)for(const t of[-2,0,1])near(value([l.point[0]+t*l.direction[0],l.point[1]+t*l.direction[1]]),0);
  }
});
test("rotations37/38, directrice oblique39 et parabole40 satisfont les équations sources",()=>{
  const value:Record<number,(x:number,y:number)=>number>={
    37:(x,y)=>x*x+6*Math.sqrt(3)*x*y-5*y*y-24,38:(x,y)=>5*x*x+6*x*y+5*y*y-8*x+8*y,
    39:(x,y)=>(x-4)**2+y*y-2*(x-y-1)**2,40:(x,y)=>5*((x-2)**2+(y-3)**2)-(x+2*y-3)**2,
  };
  for(const n of[37,38,39,40]){const s=conicScenes("",n)[0].sets[0];assert.ok(s.kind==="ellipse"||s.kind==="hyperbola"||s.kind==="parabola");if(s.kind==="ellipse"||s.kind==="hyperbola"||s.kind==="parabola")for(const t of[-1.5,-.2,0,.7,1.3])near(value[n](...conicPointAt(s,t)),0);}
  for(const[x,y]of[[0,4],[4,2]])near(value[40](x,y),0);
  const original=conicScenes("",38)[0].sets[0];if(original.kind==="ellipse")for(const t of[-1,0,.5]){const[x,y]=conicPointAt(original,t),X=x-y,Y=x+y;near((X-4)**2/16+Y*Y/4,1);}
  near((3-4)**2+1,2*(3-1-1)**2);near((1-4)**2+9,2*(1-3-1)**2);
});
test("lieu complexe31 inclut l’axe réel ; ex34 possède une famille de solutions, pas une équation unique",()=>{
  for(const x of[-2,-1,0,1,2])for(const y of[-2,-1,0,1,2])near(y+2*x*y+3*x*x*y-y**3,y*(3*x*x-y*y+2*x+1));
  for(const r of[1,.5,2,3])for(const[u,v]of[[0,1],[-2,3],[1,-1]])for(const Y of[1,3]){
    const x2=r*Y*Y-(Y-v)**2;if(x2<0)continue;
    near((Math.sqrt(x2))**2+(Y-v)**2,r*Y*Y);
    assert.ok(Number.isFinite(u+Math.sqrt(x2)));
  }
  assert.ok(find(31).correctionMarkdown.includes("(Ox)\\cup H"));assert.ok(find(34).correctionMarkdown.includes("famille"));
});
test("situations41/42 : foyers exacts, hypothèse explicite et unité2m conservée",()=>{
  const first=conicScenes("",41)[0].sets[0],second=conicScenes("",41)[1].sets[0];
  if(first.kind!=="ellipse"||second.kind!=="ellipse")assert.fail("Ellipses requises");
  near(conicFeatures(first).c,Math.sqrt(231));near(conicFeatures(second).c,3*Math.sqrt(35));near(2*(conicFeatures(second).c-conicFeatures(first).c),5.099110391456371);
  assert.ok(find(41).correctionMarkdown.includes("conserve le centre"));assert.ok(find(42).statementMarkdown.includes("2 m"));
  const pool=conicScenes("",42)[0].sets[0];if(pool.kind!=="ellipse")assert.fail("Ellipse requise");
  near(pool.a*2*2,8);near(pool.b*2*2,4*Math.sqrt(3));
  for(const t of[-1,0,.5]){const[x,y]=conicPointAt(pool,t);near(Math.hypot(x,y)/Math.abs(x-3),.5);near(Math.hypot(x+2,y)/Math.abs(x+5),.5);}
});
test("banque chargée seulement en TerminaleC/mathématiques/L07",async()=>{
  assert.equal((await loadExerciseCollection("terminale-c","mathematics",bank.lessonKey))?.id,bank.id);
  assert.equal(await loadExerciseCollection("terminale-d","mathematics",bank.lessonKey),null);assert.equal(await loadExerciseCollection("terminale-c","physics",bank.lessonKey),null);
});
