import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { terminalCSpaceDocument as course } from "../apps/web/src/data/courseDocuments/terminalCSpaceDocument";
import { terminalCSpaceGeometryPath as path } from "../apps/web/src/data/terminalCSpaceGeometryPath";
import { terminalDMathematicsPaths } from "../apps/web/src/data/terminalDMathPaths";
import { add3,sub3,scale3,dot3,cross3,norm3,planeThrough,planeValue,orthogonalProjection,pointPlaneDistance,linePlanePosition,twoPlanesPosition,twoLinesPosition,planeBasis,planePatch,circleInPlane,projectSpace,type Vec3 } from "../apps/web/src/features/mathematics/spaceModels";
import { summarySpaceScene,bankSpaceScene } from "../apps/web/src/features/mathematics/spaceScenes";
const topics=course.sections.flatMap(s=>s.topics),levels=path.modules.flatMap(m=>m.lessons),near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-8,a+" ≠ "+b);
test("Tome2 L3 : sept sous-sections, quatre méthodes et cinq applications rédigées",()=>{
  assert.equal(path.id,"terminale-c-math-l05-space-analytic-geometry");assert.equal(path.chapterNumber,5);assert.equal(path.courseDocument,course);assert.equal(path.presentation,"continuous-course");
  assert.equal(path.theme.title,"Algèbre et géométrie");assert.deepEqual(course.sections.map(s=>s.topics.length),[3,1,3]);
  assert.equal(topics.flatMap(t=>t.examples??[]).length,5);assert.equal(course.evaluations.length,4);assert.equal(course.evaluations.flatMap(g=>g.examples).length,4);
  assert.equal(course.evaluations.flatMap(g=>g.writtenTasks??[]).length,5);assert.equal(course.evaluations.flatMap(g=>g.questions).length,0);
  assert.deepEqual(course.source.summaryPages,[72,73,74,75]);assert.deepEqual(course.source.evaluationPages,[76,77,78,79]);
  assert.equal(course.source.lessonLabel,"Tome 2 · Leçon 3");assert.deepEqual(course.levelIds,["terminale-c"]);
});
test("douze IDs,82 questions et poids historiques conservés ; D ne reçoit pas ce document",()=>{
  assert.deepEqual(levels.map(l=>l.id),Object.keys(course.legacyAnchors));
  assert.deepEqual(levels.map(l=>l.xp),[50,55,60,65,70,75,80,85,85,85,85,85]);
  assert.equal(levels.flatMap(l=>l.questions).length,82);
  assert.deepEqual(topics.flatMap(t=>t.legacyLessonIds??[]).sort(),levels.map(l=>l.id).sort());
  for(const anchor of Object.values(course.legacyAnchors))assert.ok(topics.some(t=>t.id===anchor));
  assert.ok(terminalDMathematicsPaths.every(p=>p.courseDocument?.id!==course.id));
});
test("normales et projections : invariants indépendants et distances positives",()=>{
  for(const n of [[1,2,-3],[0,0,2],[0,3,0],[-2,1,5]] as Vec3[]){
    const a:Vec3=[1,-2,3],plane=planeThrough(a,n),[u,v]=planeBasis(n);
    near(dot3(n,u),0);near(dot3(n,v),0);near(dot3(u,v),0);near(norm3(u),1);near(norm3(v),1);
    for(const p of planePatch(a,n,3))near(planeValue(plane,p),0);
    for(const p of circleInPlane(a,n,2)){near(planeValue(plane,p),0);near(norm3(sub3(p,a)),2);}
    for(const p of [[1,1,1],[-2,3,0],[0,0,0]] as Vec3[]){const h=orthogonalProjection(p,plane);near(planeValue(plane,h),0);near(norm3(cross3(sub3(p,h),n)),0);near(pointPlaneDistance(p,plane),norm3(sub3(p,h)));}
  }
  near(pointPlaneDistance([-1,2,5],{normal:[1,2,-3],d:5}),Math.sqrt(14)/2);
  near(planeValue({normal:[1,2,3],d:-5},[1,-1,2]),0);
  assert.throws(()=>planeBasis([0,0,0]));assert.throws(()=>planePatch([0,0,0],[1,0,0],0));
});
test("toutes les positions relatives sans confondre parallélisme et non-coplanarité",()=>{
  const p=planeThrough([0,0,0],[0,0,1]);
  assert.equal(linePlanePosition({point:[0,0,0],direction:[1,1,0]},p).kind,"contained");
  assert.equal(linePlanePosition({point:[0,0,2],direction:[1,1,0]},p).kind,"parallel");
  const x=linePlanePosition({point:[2,5,1],direction:[1,-1,3]},{normal:[3,-2,-1],d:-3});assert.equal(x.kind,"secant");if(x.kind==="secant"){assert.equal(x.t,4);assert.deepEqual(x.point,[6,1,13]);}
  assert.equal(twoPlanesPosition(p,{normal:[0,0,-2],d:0}),"coincident");assert.equal(twoPlanesPosition(p,{normal:[0,0,-2],d:2}),"parallel");assert.equal(twoPlanesPosition(p,{normal:[1,0,0],d:1}),"secant");
  const a={point:[0,0,0] as Vec3,direction:[1,0,0] as Vec3};
  assert.equal(twoLinesPosition(a,{point:[2,0,0],direction:[-2,0,0]}),"coincident");
  assert.equal(twoLinesPosition(a,{point:[0,1,0],direction:[2,0,0]}),"parallel");
  assert.equal(twoLinesPosition(a,{point:[1,0,0],direction:[0,1,0]}),"secant");
  assert.equal(twoLinesPosition(a,{point:[0,0,1],direction:[0,1,0]}),"skew");
});
test("équations et comparaisons des quatre méthodes calculées indépendamment",()=>{
  const plane={normal:[11,9,-4] as Vec3,d:-19};for(const p of [[2,1,3],[-1,2,-3],[3,-2,-1]] as Vec3[])near(planeValue(plane,p),0);
  const A={point:[3,1,0] as Vec3,direction:[1,2,3] as Vec3},B={point:[1,4,-2] as Vec3,direction:[-2,-4,-6] as Vec3},C={point:[0,-2,7] as Vec3,direction:[3,1,-2] as Vec3};
  assert.equal(twoLinesPosition(A,B),"parallel");assert.equal(twoLinesPosition(A,C),"skew");
  const D2={point:[2,7,2] as Vec3,direction:[4,-6,3] as Vec3};
  assert.equal(twoLinesPosition({point:[4,-1,3],direction:[1,1,5]},D2),"skew");
  assert.equal(twoLinesPosition(D2,{point:[-5,3,8],direction:[-2,3,1.5]}),"skew");
  assert.equal(twoPlanesPosition({normal:[2,-1,1],d:-4},{normal:[-1,.5,-.5],d:5}),"parallel");
});
test("figures natives : coordonnées finies, bases de plans et configurations cohérentes",()=>{
  const presets=["normal","cube","projection","parameter","two-lines","line-plane","two-planes","eval-line-plane","apply-line-plane","eval-three-points","apply-three-points","eval-two-lines","apply-two-lines","eval-two-planes","apply-two-planes"];
  const scenes=[...presets.flatMap(p=>[0,1,2,3].map(i=>summarySpaceScene(p,i,-2))),...[1,2,7,8,9,10,11,12,13,17,18,19,20,21,22,23,24,25,26,27,28,29].map(bankSpaceScene)];
  for(const scene of scenes){
    assert.ok(scene.title.length>0);assert.ok(scene.description.length>0);
    for(const pl of scene.planes){assert.ok(norm3(pl.normal)>0);for(const p of planePatch(pl.point,pl.normal,pl.size))near(dot3(sub3(p,pl.point),pl.normal),0);}
    const ps=[...scene.planes.map(p=>p.point),...scene.lines.flatMap(l=>[l.point,l.direction]),...scene.points.map(p=>p.point),...scene.paths.flatMap(p=>p.points)];
    for(const p of ps){assert.ok(p.every(Number.isFinite));for(const y of[-180,-35,0,90,180])for(const pitch of[-70,0,25,70])assert.ok(projectSpace(p,y,pitch).every(Number.isFinite));}
  }
  const d=summarySpaceScene("parameter",0,2);assert.deepEqual(d.points.find(p=>p.label==="M")!.point,[-1,4,7]);
  const projection=summarySpaceScene("projection",0,-3);near(norm3(sub3(projection.points[0].point,projection.points[1].point)),3);
});
test("corrections faciles à lire, notes de source internes et figures accessibles",()=>{
  for(const g of course.evaluations)for(const task of g.writtenTasks??[]){assert.ok(task.model.length>280);assert.equal(task.criteria.length,3);}
  const {source,...visible}=course;assert.ok(source.editorialNotes!.length>=5);assert.doesNotMatch(JSON.stringify(visible),/coquille|Excellence rétablit|Solution commentée/);
  const ui=readFileSync("apps/web/src/features/mathematics/SpaceGeometryFigure.tsx","utf8"),css=readFileSync("apps/web/src/styles/space-figures.css","utf8");
  assert.match(ui,/aria-labelledby/);assert.match(ui,/Rotation de la figure/);assert.match(ui,/Inclinaison de la figure/);assert.match(ui,/ResizeObserver/);
  assert.match(css,/font-size:16px/);assert.match(css,/min-height:44px/);assert.doesNotMatch(ui,/requestAnimationFrame|setInterval/);
});
