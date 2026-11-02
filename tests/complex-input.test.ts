import assert from "node:assert/strict";
import test from "node:test";
import { parseComplexAnswer,complexRoots,complexPower,complexNorm,complexSubtract } from "../apps/web/src/features/mathematics/complexMath";
import { exerciseAnswerStatus } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { complexShort } from "../apps/web/src/data/exerciseCollections/terminalCComplexBuilders";
const near=(a:readonly[number,number]|null,b:readonly[number,number])=>{assert.ok(a);assert.ok(complexNorm(complexSubtract(a,b))<1e-10,JSON.stringify(a)+" ≠ "+JSON.stringify(b));};
test("grammaire complexe bornée : formes équivalentes, fractions, racines et i",()=>{
 for(const s of["2+3i","3i+2","(4+6*i)/2","2+√(9)i","(1+i)*(2+i)+1"])near(parseComplexAnswer(s),[2,3]);
 near(parseComplexAnswer("−1,5−i/2"),[-1.5,-.5]);near(parseComplexAnswer("i√2"),[0,Math.sqrt(2)]);
 near(parseComplexAnswer("(5-2i)/(4+3i)"),[14/25,-23/25]);near(parseComplexAnswer("(1+i)^-4"),[-.25,0]);
 near(parseComplexAnswer("-2^2"),[-4,0]);near(parseComplexAnswer("(-2)^2"),[4,0]);near(parseComplexAnswer("sqrt(-3+4i)"),[1,2]);
 near(parseComplexAnswer("i^403"),[0,-1]);near(parseComplexAnswer("i^2030"),[-1,0]);
});
test("aucune exécution, division par zéro ou expression hors bornes",()=>{
 for(const s of["","1/0","1/(i-i)","0^0","i^10001","i^i","2^0.5","NaN","Infinity","process.exit()","constructor","Math.sqrt(4)","alert(1)","z=1","1;2","__proto__","(".repeat(31)+"1"+")".repeat(31),"9".repeat(501)])assert.equal(parseComplexAnswer(s),null,s);
});
test("comparaison complexe opt-in, sans altérer les autres réponses",()=>{
 const q=complexShort("a","Calculer.",[2,3],"On développe.");
 for(const s of["2+3i","3i+2","(4+6i)/2"])assert.equal(exerciseAnswerStatus(q,s),"correct");
 for(const s of["2-3i","23i","2+3","999"])assert.equal(exerciseAnswerStatus(q,s),"incorrect");
 assert.equal(exerciseAnswerStatus(q,""),"unanswered");
});
test("racines n-ièmes : équation, répartition et somme nulle",()=>{
 for(const z of[[1,0],[0,-1],[1,1],[2,-11]] as const)for(const n of[2,3,4,5,6]){
  const roots=complexRoots(z,n);assert.equal(roots.length,n);
  for(const root of roots)near(complexPower(root,n),z);
  near(roots.reduce((sum,p)=>[sum[0]+p[0],sum[1]+p[1]],[0,0]),[0,0]);
 }assert.deepEqual(complexRoots([0,0],5),[[0,0]]);assert.throws(()=>complexRoots([1,0],0));
});
