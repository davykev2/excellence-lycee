import assert from "node:assert/strict";
import test from "node:test";
import { terminalCComplexDocument as course } from "../apps/web/src/data/courseDocuments/terminalCComplexDocument";
import { terminalCComplexNumbersPath as path } from "../apps/web/src/data/terminalCComplexNumbersPath";
import { terminalDMathematicsPaths } from "../apps/web/src/data/terminalDMathPaths";
import { complexAdd as add,complexMultiply as mul,complexSubtract as sub,complexNorm as norm,complexPower as pow,complexRoots,type ComplexPair } from "../apps/web/src/features/mathematics/complexMath";
import { complexScenes } from "../apps/web/src/features/mathematics/complexScenes";
const topics=course.sections.flatMap(s=>s.topics),levels=path.modules.flatMap(m=>m.lessons);
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-7,a+" ≠ "+b),zero=(z:ComplexPair)=>near(norm(z),0);
const poly=(z:ComplexPair,coeffs:ComplexPair[])=>coeffs.reduce((s,a)=>add(mul(s,z),a),[0,0] as ComplexPair);
test("Nombres complexes : quatre rubriques,16 sous-sections,27 groupes et trois méthodes",()=>{
 assert.deepEqual(course.sections.map(s=>s.topics.length),[7,6,2,1]);assert.equal(topics.flatMap(t=>t.examples??[]).length,27);
 assert.equal(course.evaluations.length,3);assert.equal(course.evaluations.flatMap(g=>g.examples).length,3);
 assert.equal(course.evaluations.flatMap(g=>g.writtenTasks??[]).length,6);assert.equal(course.evaluations.flatMap(g=>g.questions).length,0);
 assert.deepEqual(course.source.summaryPages,Array.from({length:12},(_,i)=>124+i));assert.deepEqual(course.source.evaluationPages,[136,137,138]);
 assert.equal(path.presentation,"continuous-course");assert.equal(path.courseDocument,course);assert.equal(path.theme.title,"Algèbre et géométrie");assert.equal(path.chapterNumber,9);
 const model=course.evaluations[2].writtenTasks![0].model;for(const n of[2,3,4])assert.ok(model.includes("\n\n**"+n+"."),"Chaque sous-question garde son paragraphe.");
});
test("les dix identifiants/poids et110 questions historiques sont conservés, contenu partagé avec D",()=>{
 assert.deepEqual(levels.map(l=>l.id),Object.keys(course.legacyAnchors));assert.deepEqual(levels.map(l=>l.xp),[50,55,60,65,70,75,80,85,85,85]);assert.equal(levels.flatMap(l=>l.questions).length,110);
 assert.deepEqual(topics.flatMap(t=>t.legacyLessonIds??[]).sort(),levels.map(l=>l.id).sort());
 for(const id of Object.values(course.legacyAnchors))assert.ok(topics.some(t=>t.id===id),id);
 assert.deepEqual(course.levelIds,["terminale-c"]);
 const d=terminalDMathematicsPaths.find(p=>p.id==="terminale-d-math-l06-complex-numbers")!;assert.equal(d.modules.flatMap(m=>m.lessons).length,10);assert.deepEqual(d.courseDocument?.levelIds,["terminale-d"]);
 assert.strictEqual(d.courseDocument?.sections,course.sections);assert.strictEqual(d.courseDocument?.evaluations,course.evaluations);
});
test("racines des exemples et évaluations vérifiées par substitution indépendante",()=>{
 for(const z of[[1,-2],[3,-1]] as ComplexPair[])zero(poly(z,[[1,0],[-4,3],[1,-7]]));
 for(const z of[[0,Math.SQRT2],[0,-Math.SQRT2],[-.5,Math.sqrt(11)/2],[-.5,-Math.sqrt(11)/2]] as ComplexPair[])zero(poly(z,[[1,0],[1,0],[5,0],[2,0],[6,0]]));
 const four=[-1,3,7,11].map(k=>[Math.cos(k*Math.PI/10),Math.sin(k*Math.PI/10)] as ComplexPair);
 for(const z of four)zero(poly(z,[[1,0],[0,-1],[-1,0],[0,1],[1,0]]));
 assert.ok(norm(poly([0,-1],[[1,0],[0,-1],[-1,0],[0,1],[1,0]]))>1);
 for(const z of complexRoots([-3,4],2))zero(sub(pow(z,2),[-3,4]));
});
test("les quatre linéarisations et l’exemple sont des identités, pas seulement une valeur témoin",()=>{
 for(let k=-100;k<=100;k++){const x=k*.073,c=Math.cos(x),s=Math.sin(x);
  near(c**3,(Math.cos(3*x)+3*c)/4);near(s*s*c**3,(2*c-Math.cos(3*x)-Math.cos(5*x))/16);
  near(c**4,(3+4*Math.cos(2*x)+Math.cos(4*x))/8);near(s**5,(Math.sin(5*x)-5*Math.sin(3*x)+10*s)/16);
 }
});
test("les figures du document existent et restent finies aux réglages extrêmes",()=>{
 const figs=[...topics.map(t=>t.nativeFigure),...topics.flatMap(t=>t.examples??[]).map(e=>e.nativeFigure),...course.evaluations.flatMap(g=>g.examples).map(e=>e.nativeFigure),...course.evaluations.flatMap(g=>g.writtenTasks??[]).map(t=>t.nativeFigure)].filter(Boolean);
 assert.equal(figs.length,8);
 for(const f of figs)for(const angle of[-180,-90,0,45,180])for(const n of[2,3,8]){
  const scenes=complexScenes(f!.preset,undefined,angle,n);assert.ok(scenes.length,f!.preset);
  for(const s of scenes){assert.ok(s.points.length);for(const p of s.points)assert.ok(p.p.every(Number.isFinite));for(const c of s.circles??[])assert.ok(c.r>0&&Number.isFinite(c.r));}
 }
});
test("carré et application géométrique : distances et milieu exacts",()=>{
 const s=complexScenes("eval-geometry")[0],p=Object.fromEntries(s.points.map(p=>[p.label,p.p]));
 for(const a of["A","C"])near(norm(sub(p[a],p.B)),3);
 for(const a of["A","B"])near(norm(sub(p[a],p.E)),3);
 zero(sub(p.F,[(p.D[0]+p.E[0])/2,(p.D[1]+p.E[1])/2]));
 const a=complexScenes("eval-application")[0],E=a.points.find(p=>p.label==="E")!.p;
 for(const p of a.points.filter(p=>p.label!=="E"))near(norm(sub(p.p,E)),2*Math.sqrt(5));
});
