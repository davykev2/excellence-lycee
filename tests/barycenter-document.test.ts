import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { terminalCBarycenterDocument as course } from "../apps/web/src/data/courseDocuments/terminalCBarycenterDocument";
import { terminalCBarycenterPath as path } from "../apps/web/src/data/terminalCBarycenterPath";
import { terminalDMathematicsPaths } from "../apps/web/src/data/terminalDMathPaths";
import { barycenter,quadraticLevel,apollonius,angleArc,orientedAngle,gridPoints,dot2,sub2,type Point2 } from "../apps/web/src/features/mathematics/barycenterModels";
const topics=course.sections.flatMap(s=>s.topics),near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-9*Math.max(1,Math.abs(b)),a+" ≠ "+b);
const point=(a:Point2,b:Point2)=>{near(a[0],b[0]);near(a[1],b[1]);};
test("Tome2 L1 : deux rubriques, onze sous-sections, neuf exemples, deux méthodes et trois applications rédigées",()=>{
  assert.equal(path.id,"terminale-c-math-l02-barycenter");assert.equal(path.chapterNumber,2);assert.equal(path.theme.title,"Algèbre et géométrie");assert.equal(path.courseDocument,course);
  assert.deepEqual(course.sections.map(s=>s.topics.length),[6,5]);assert.equal(topics.flatMap(t=>t.examples??[]).length,9);
  assert.equal(course.evaluations.length,2);assert.equal(course.evaluations.flatMap(e=>e.examples).length,2);
  assert.equal(course.evaluations.flatMap(e=>e.questions).length,0);assert.equal(course.evaluations.flatMap(e=>e.writtenTasks??[]).length,3);
  assert.deepEqual(course.source.summaryPages,[19,20,21,22,23,24,25]);assert.deepEqual(course.source.evaluationPages,[26,27]);
  assert.equal(course.source.lessonLabel,"Tome 2 · Leçon 1");assert.equal(course.source.sha256?.length,64);
});
test("9 identifiants, poids et79questions préservés ; aucun raccord D artificiel",()=>{
  const levels=path.modules.flatMap(m=>m.lessons);
  assert.deepEqual(levels.map(l=>l.id),Object.keys(course.legacyAnchors));assert.deepEqual(levels.map(l=>l.xp),[50,55,60,65,70,75,80,85,85]);assert.equal(levels.flatMap(l=>l.questions??[]).length,79);
  assert.deepEqual(topics.flatMap(t=>t.legacyLessonIds??[]).sort(),levels.map(l=>l.id).sort());
  for(const anchor of Object.values(course.legacyAnchors))assert.ok(topics.some(t=>t.id===anchor));
  assert.ok(terminalDMathematicsPaths.every(p=>p.courseDocument?.id!==course.id));assert.deepEqual(course.levelIds,["terminale-c"]);
});
test("existence, homogénéité et coordonnées vérifiées numériquement",()=>{
  point(barycenter([[-2,3],[1,5],[0,-7]],[1,3,-2])!,[.5,16]);
  assert.equal(barycenter([[0,0],[1,2]],[1,-1]),null);
  const points:Point2[]=[[1,2],[-3,5],[4,-2]],weights=[2,-4,1];
  point(barycenter(points,weights)!,barycenter(points,weights.map(w=>-7*w))!);
  assert.throws(()=>barycenter(points,[1]));assert.throws(()=>barycenter([[NaN,0]],[1]));
  const g=barycenter(points,weights)!,m:Point2=[5,7],sum=weights.reduce((a,b)=>a+b,0);
  const lhs=points.reduce((v,p,i)=>[v[0]+weights[i]*(p[0]-m[0]),v[1]+weights[i]*(p[1]-m[1])] as Point2,[0,0] as Point2);
  point(lhs,[(g[0]-m[0])*sum,(g[1]-m[1])*sum]);
});
test("formule quadratique : signe de S, niveaux vide/point/cercle",()=>{
  const points:Point2[]=[[0,0],[4,0],[0,3]],weights=[4,-1,-1],f=quadraticLevel(points,weights,-25)!;
  point(f.center,[-2,-1.5]);near(f.radiusSquared,6.25);
  const neg=quadraticLevel([[0,0],[2,0],[0,1]],[1,-2,-1],-3)!;point(neg.center,[2,.5]);near(neg.constant,-.5);near(neg.radiusSquared,1.25);
  assert.equal(quadraticLevel([[0,0],[2,0]],[1,1],1)!.kind,"empty");
  assert.equal(quadraticLevel([[0,0],[2,0]],[1,1],2)!.kind,"point");
  const m:Point2=[3,-4],actual=points.reduce((v,p,i)=>v+weights[i]*dot2(sub2(p,m),sub2(p,m)),0);
  near(actual,f.sum*dot2(sub2(m,f.center),sub2(m,f.center))+f.constant);
});
test("Apollonius : k1 séparé, deux diamètres et sphèreex18",()=>{
  assert.equal(apollonius([0,0],[3,0],1).kind,"bisector");assert.equal(apollonius([0,0],[3,0],-2).kind,"empty");
  for(const [d,k,center,r]of[[3,2,4,2],[9,9,729/80,81/80],[3,.5,-1,2]]){
    const f=apollonius([0,0],[d,0],k);assert.equal(f.kind,"circle");if(f.kind!=="circle")continue;
    point(f.center,[center,0]);near(f.radius,r);point([(f.i[0]+f.j[0])/2,0],f.center);
    const m:Point2=[f.center[0],f.radius];near(Math.hypot(...m)/Math.hypot(m[0]-d,m[1]),k);
  }
  assert.throws(()=>apollonius([0,0],[0,0],2));
});
test("angles orientés : grand et petit arcs, extrémités exclues et signe vérifié sur tous les points",()=>{
  for(const degrees of[-150,-120,-90,-60,-15,15,60,90,120,150]){
    const alpha=degrees*Math.PI/180,f=angleArc(alpha);
    for(const p of f.points.slice(1,-1)){near(orientedAngle(f.a,f.b,p)!,alpha);assert.ok(p[1]*alpha>0);}
  }
  assert.ok(Math.abs(angleArc(-Math.PI/3).sweep)>Math.PI);
  assert.ok(Math.abs(angleArc(-2*Math.PI/3).sweep)<Math.PI);
  assert.equal(orientedAngle([-2,0],[2,0],[-2,0]),null);assert.throws(()=>angleArc(0));assert.throws(()=>angleArc(Math.PI));
  assert.match(topics.find(t=>t.id==="bary-oriented-angles")!.body,/modulo/);
});
test("alignement et concurrence des deux applications calculés indépendamment",()=>{
  const a:Point2=[0,0],b:Point2=[6,0],c:Point2=[1.5,4];
  const i=barycenter([a,b],[1,2])!,m=barycenter([a,c],[1,1])!,p=barycenter([c,i],[1,3])!;
  point(p,barycenter([m,b],[1,1])!);
  const I=barycenter([a,b],[2,1])!,J=barycenter([b,c],[1,3])!,K=barycenter([a,c],[2,3])!,g=barycenter([a,b,c],[2,1,3])!;
  point(g,barycenter([I,c],[3,3])!);point(g,barycenter([a,J],[2,4])!);point(g,barycenter([b,K],[1,5])!);
  point(barycenter(Object.values(gridPoints),[2,-1,3,1,2])!,[1,13/7]);
});
test("rédaction, figures dans les solutions et corrections indépendantes héritées",()=>{
  for(const group of course.evaluations)for(const task of group.writtenTasks??[]){assert.ok(task.model.length>300);assert.equal(task.criteria.length,3);assert.equal(task.nativeFigure?.kind,"barycenter");}
  const {source,...visible}=course;assert.ok(source.editorialNotes!.length>=5);assert.doesNotMatch(JSON.stringify(visible),/coquille|Excellence rétablit|Solution commentée/);
  const ui=readFileSync("apps/web/src/features/lesson/document/DocumentEvaluation.tsx","utf8");
  assert.match(ui,/DocumentCorrection/);assert.match(ui,/writtenTasks/);
  const css=readFileSync("apps/web/src/styles/barycenter-figures.css","utf8");assert.match(css,/font-size:16px/);assert.match(css,/min-height:44px/);assert.match(css,/overflow-x:auto/);
});
