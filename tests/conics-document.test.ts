import assert from "node:assert/strict";
import test from "node:test";
import { terminalCConicsDocument as course } from "../apps/web/src/data/courseDocuments/terminalCConicsDocument";
import { terminalCConicsPath as path } from "../apps/web/src/data/terminalCConicsPath";
import { terminalDMathematicsPaths } from "../apps/web/src/data/terminalDMathPaths";
import { classifyConic,conicFeatures,conicFrame,conicEquationValue,conicPointAt,conicMetric,dotConic,subConic,conicNorm,type ConicModel } from "../apps/web/src/features/mathematics/conicModels";
import { conicScenes } from "../apps/web/src/features/mathematics/conicScenes";
import { centralConicDetails,conicRoot,conicTex } from "../apps/web/src/data/exerciseCollections/conicSolutions";
const levels=path.modules.flatMap(m=>m.lessons),topics=course.sections.flatMap(s=>s.topics);
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-7,a+" ≠ "+b);
test("Coniques : cinq rubriques, dix sous-sections, deux méthodes et cinq applications rédigées",()=>{
  assert.equal(path.id,"terminale-c-math-l07-conics");assert.equal(path.chapterNumber,7);assert.equal(path.presentation,"continuous-course");assert.equal(path.courseDocument,course);assert.equal(path.theme.title,"Algèbre et géométrie");
  assert.deepEqual(course.sections.map(s=>s.topics.length),[2,2,2,2,2]);assert.equal(topics.flatMap(t=>t.examples??[]).length,8);
  assert.equal(course.evaluations.length,2);assert.equal(course.evaluations.flatMap(g=>g.examples).length,3);
  assert.equal(course.evaluations.flatMap(g=>g.writtenTasks??[]).length,5);assert.equal(course.evaluations.flatMap(g=>g.questions).length,0);
  assert.deepEqual(course.source.summaryPages,Array.from({length:11},(_,i)=>i+92));assert.deepEqual(course.source.evaluationPages,[103,104,105,106]);
  assert.deepEqual(course.levelIds,["terminale-c"]);assert.equal(course.source.lessonLabel,"Tome 2 · Leçon 4");
});
test("11IDs,94 questions, poids et liaisons de feedback historiques inchangés ; aucun document D ajouté",()=>{
  assert.deepEqual(levels.map(l=>l.id),Object.keys(course.legacyAnchors));assert.deepEqual(levels.map(l=>l.xp),[50,55,60,65,70,75,80,85,85,85,85]);assert.equal(levels.flatMap(l=>l.questions).length,94);
  assert.deepEqual(topics.flatMap(t=>t.legacyLessonIds??[]).sort(),levels.map(l=>l.id).sort());
  for(const anchor of Object.values(course.legacyAnchors))assert.ok(topics.some(t=>t.id===anchor));
  assert.ok(terminalDMathematicsPaths.every(p=>p.courseDocument?.id!==course.id));
});
test("toutes les orientations et translations vérifient l’équation, les foyers et les deux directrices",()=>{
  for(const kind of ["ellipse","hyperbola","parabola"] as const)for(const axis of ["x","y"] as const)for(const rotation of[0,Math.PI/6,-Math.PI/4])for(const sign of[-1,1]){
    const model:ConicModel=kind==="parabola"?{kind,axis,vertex:[1,-2],parameter:sign*2,rotation}:{kind,axis,center:[1,-2],a:5,b:3,rotation};
    const f=conicFeatures(model),frame=conicFrame(model);near(dotConic(frame.u,frame.v),0);near(conicNorm(frame.u),1);near(conicNorm(frame.v),1);
    for(const t of[-1.2,-.4,0,.8,1.5])for(const branch of(kind==="hyperbola"?[-1,1]:[1])){
      near(conicEquationValue(model,conicPointAt(model,t,branch)),0);
      for(let i=0;i<f.directrices.length;i++){const metric=conicMetric(model,t,i,branch);near(metric.ratio!,f.e);near(dotConic(subConic(metric.foot!,f.directrices[i].point),f.directrices[i].normal),0);}
    }
  }
});
test("paraboles : paramètre signé, sommet distinct du foyer et cercle sans directrice finie",()=>{
  const p=conicFeatures({kind:"parabola",axis:"y",parameter:1,vertex:[0,0]});near(p.focuses[0][1],.5);near(p.directrices[0].point[1],-.5);
  const q=conicFeatures({kind:"parabola",axis:"x",parameter:.5,vertex:[0,0]});near(q.focuses[0][0],.25);near(q.c,.25);
  const circle=conicFeatures({kind:"ellipse",axis:"x",a:3,b:3,center:[0,0]});assert.equal(circle.e,0);assert.equal(circle.directrices.length,0);
  assert.equal(conicMetric({kind:"ellipse",axis:"x",a:3,b:3,center:[0,0]},1).ratio,null);
  assert.throws(()=>conicFeatures({kind:"ellipse",axis:"x",a:1,b:2,center:[0,0]}));
  assert.throws(()=>conicFeatures({kind:"parabola",axis:"x",parameter:0,vertex:[0,0]}));
  assert.throws(()=>conicPointAt({kind:"hyperbola",axis:"x",a:2,b:1,center:[0,0]},6));
  assert.throws(()=>classifyConic(0,0,1,2,3));
});
test("évaluation : les équations des énoncés sont conservées, pas les signes contradictoires du corrigé source",()=>{
  const examples=course.evaluations.flatMap(g=>g.examples),one=examples[0].parts!;
  assert.ok(one[1].prompt.includes("-"));assert.ok(one[1].solution.includes("hyperbole"));
  const ellipse=examples[1].solution!,parabola=examples[2].solution!;
  assert.ok(ellipse.includes("5\\sqrt{15}/4"));assert.ok(parabola.includes("(y+4)^2=4(x+1)"));
  for(const y of[-8,-7,-6,-5,-4,-3,-2,-1,0]){const x=(y+4)**2/4-1;near(y*y-4*x+8*y+12,0);}
  for(const [id,A,B,C,D,E]of[["application-1a",1,0,-3,-2,13],["application-1b",-1,.25,0,0,-1],["application-1c",-2,5,0,-5,15],["application-plot-p",4,-9,0,0,36],["application-plot-q",1,5,0,-5,0]]as const){
    const scene=conicScenes(id)[0],s=scene.sets[0];assert.ok(s.kind==="ellipse"||s.kind==="hyperbola"||s.kind==="parabola");
    if(s.kind==="ellipse"||s.kind==="hyperbola"||s.kind==="parabola")for(const t of[-1,0,.7]){const[x,y]=conicPointAt(s,t);near(A*x*x+B*y*y+2*C*x+2*D*y+E,0);}
  }
});
test("chaque figure de document existe et tous ses modèles sont valides",()=>{
  const figures=[...topics.map(t=>t.nativeFigure),...topics.flatMap(t=>t.examples??[]).map(e=>e.nativeFigure),...course.evaluations.flatMap(g=>g.examples).map(e=>e.nativeFigure),...course.evaluations.flatMap(g=>g.writtenTasks??[]).map(t=>t.nativeFigure)].filter(Boolean);
  for(const fig of figures){assert.equal(fig!.kind,"conic");const scenes=conicScenes(fig!.preset);assert.ok(scenes.length>0,fig!.preset);for(const s of scenes)for(const model of s.sets)if(model.kind==="ellipse"||model.kind==="hyperbola"||model.kind==="parabola")conicFeatures(model);}
});
test("rédaction et racines exactes : aucun arrondi dans les coordonnées attendues",()=>{
  assert.equal(conicRoot(45),String.raw`3\sqrt{5}`);assert.equal(conicRoot(3/2),String.raw`\frac{\sqrt{6}}{2}`);assert.equal(conicTex(-1/6),String.raw`-\frac{1}{6}`);
  assert.throws(()=>conicRoot(-1));
  const details=centralConicDetails({kind:"hyperbola",axis:"y",h:-1/3,k:0,a2:2/3,b2:2/9});
  assert.ok(details.includes("hyperbole"));assert.ok(details.includes("directrices"));assert.ok(details.includes("asymptotes"));assert.ok(!details.includes("NaN"));
});
