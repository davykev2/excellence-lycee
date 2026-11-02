import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { terminalCDivisibilityDocument as course } from "../apps/web/src/data/courseDocuments/terminalCDivisibilityDocument";
import { terminalCDivisibilityPath as path } from "../apps/web/src/data/terminalCDivisibilityPath";
import { terminalDMathematicsPaths } from "../apps/web/src/data/terminalDMathPaths";
import { euclideanDivision,baseConversion,modPower,powerCycle,isPrime,sieveValues,primalityTrials } from "../apps/web/src/features/mathematics/arithmeticModels";
const topics=course.sections.flatMap(s=>s.topics),levels=path.modules.flatMap(m=>m.lessons);
test("Tome2 L2 : trois rubriques complètes, douze sous-sections, trois méthodes et trois applications",()=>{
  assert.equal(path.id,"terminale-c-math-l03-divisibility");assert.equal(path.chapterNumber,3);assert.equal(path.theme.title,"Algèbre et géométrie");assert.equal(path.courseDocument,course);
  assert.deepEqual(course.sections.map(s=>s.topics.length),[4,5,3]);assert.equal(topics.flatMap(t=>t.examples??[]).length,19);
  assert.equal(course.evaluations.length,3);assert.equal(course.evaluations.flatMap(e=>e.examples).length,3);
  assert.equal(course.evaluations.flatMap(e=>e.questions).length,0);assert.equal(course.evaluations.flatMap(e=>e.writtenTasks??[]).length,3);
  assert.deepEqual(course.source.summaryPages,Array.from({length:13},(_,i)=>49+i));assert.deepEqual(course.source.evaluationPages,[62,63]);
  assert.equal(course.source.lessonLabel,"Tome 2 · Leçon 2");
});
test("contrat historique : douze IDs, 114 questions et poids inchangés ; aucun accès D ajouté",()=>{
  assert.deepEqual(levels.map(l=>l.id),Object.keys(course.legacyAnchors));
  assert.deepEqual(levels.map(l=>l.xp),[50,55,60,65,70,75,80,85,85,85,85,85]);
  assert.equal(levels.flatMap(l=>l.questions??[]).length,114);
  assert.deepEqual(topics.flatMap(t=>t.legacyLessonIds??[]).sort(),levels.map(l=>l.id).sort());
  for(const a of Object.values(course.legacyAnchors))assert.ok(topics.some(t=>t.id===a));
  assert.deepEqual(course.levelIds,["terminale-c"]);assert.ok(terminalDMathematicsPaths.every(p=>p.courseDocument?.id!==course.id));
});
test("division signée : identité et reste admissible dans les quatre combinaisons de signes",()=>{
  for(let a=-150;a<=150;a++)for(let b=-15;b<=15;b++)if(b){
    const d=euclideanDivision(BigInt(a),BigInt(b));assert.equal(BigInt(b)*d.q+d.r,BigInt(a));assert.ok(d.r>=0n&&d.r<BigInt(Math.abs(b)));
  }
  assert.deepEqual(euclideanDivision(-43n,7n),{q:-7n,r:6n});assert.deepEqual(euclideanDivision(94n,-13n),{q:-7n,r:3n});
  assert.throws(()=>euclideanDivision(5n,0n));
});
test("conversions : tous les allers-retours entre bases2–16, grands entiers et zéros",()=>{
  for(let b=2;b<=16;b++)for(const n of[0,1,61,698,82778,1000000]){
    const encoded=baseConversion(String(n),10,b);assert.equal(encoded.result,n.toString(b).toUpperCase());
    assert.equal(baseConversion(encoded.result,b,10).result,String(n));
    for(const step of encoded.steps)assert.equal(step.a,BigInt(b)*step.q+step.r);
  }
  const large="123456789123456789123456789";assert.equal(baseConversion(baseConversion(large,10,16).result,16,10).result,large);
  assert.equal(baseConversion("0000",10,2).result,"0");
  for(const [x,b]of[["2",2],["G",16],["-1",10],["",10],["10",1],["10",17]]as const)assert.throws(()=>baseConversion(x,b,10));
});
test("cycles : cas copremiers et phase transitoire non inversible",()=>{
  for(let b=1;b<=12;b++)for(let m=2;m<=20;m++){
    const c=powerCycle(b,m);assert.ok(c.period.length>0);assert.ok(c.values.every(r=>r>=0&&r<m));
    for(let n=0;n<80;n++){const r=n<c.start?c.prefix[n]:c.period[(n-c.start)%c.period.length];assert.equal(BigInt(r),modPower(BigInt(b),n,BigInt(m)));}
  }
  assert.deepEqual(powerCycle(2,9).period,[1,2,4,8,7,5]);assert.deepEqual(powerCycle(2,4),{prefix:[1,2],period:[0],values:[1,2,0],start:2});
  assert.equal(modPower(2n,2023,5n),3n);assert.throws(()=>modPower(2n,-1,5n));assert.throws(()=>modPower(2n,2,0n));
});
test("primalité et crible : 25 premiers,0/1 exclus,101/103/161/221 contrôlés",()=>{
  assert.equal(isPrime(0),false);assert.equal(isPrime(1),false);assert.equal(isPrime(-3),false);
  assert.deepEqual(sieveValues(100).filter(x=>x.prime).map(x=>x.value),[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97]);
  for(let n=2;n<=1000;n++)assert.equal(primalityTrials(n).prime,isPrime(n));
  assert.equal(primalityTrials(161).rows.at(-1)!.p,7);assert.equal(primalityTrials(221).rows.at(-1)!.p,13);
  assert.throws(()=>sieveValues(501));assert.throws(()=>primalityTrials(1));
});
test("rédaction et corrections indépendantes sans fausse note ni notice de coquille",()=>{
  for(const group of course.evaluations)for(const task of group.writtenTasks??[]){assert.ok(task.model.length>300);assert.equal(task.criteria.length,3);}
  const {source,...visible}=course;assert.ok(source.editorialNotes!.length>=5);assert.doesNotMatch(JSON.stringify(visible),/coquille|Excellence rétablit|Solution commentée/);
  const ui=readFileSync("apps/web/src/features/lesson/document/DocumentEvaluation.tsx","utf8");assert.match(ui,/DocumentCorrection/);
  const css=readFileSync("apps/web/src/styles/arithmetic-figures.css","utf8");assert.match(css,/font-size:16px/);assert.match(css,/min-height:44px/);assert.match(css,/overflow-x:auto/);
});
