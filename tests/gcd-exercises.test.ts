import assert from"node:assert/strict";
import test from"node:test";
import{terminalCGcdExercises as bank}from"../apps/web/src/data/exerciseCollections/terminalCGcdExercises";
import{terminalCGcdDocument as doc}from"../apps/web/src/data/courseDocuments/terminalCGcdDocument";
import{loadExerciseCollection}from"../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import{arenaPayloadSchema}from"../apps/api/src/arenaExerciseSchema";
import{exerciseAssessment,exerciseAnswerStatus}from"../apps/web/src/features/arena/exercises/exerciseAssessment";
import{gcdValue,lcmValue,affineCipher,primeFactorization}from"../apps/web/src/features/mathematics/gcdMath";
const es=bank.sections.flatMap(s=>s.exercises),qs=es.flatMap(e=>e.questions??[]),find=(n:number)=>es.find(e=>e.sourceNumber===n)!;
test("82 exercices1–82,48/33/1,153 sous-questions et11 rubriques de fixation",()=>{
 assert.deepEqual(es.map(e=>e.sourceNumber),Array.from({length:82},(_,i)=>i+1));
 assert.deepEqual(["fixation","deepening","complex"].map(c=>bank.sections.filter(s=>s.category===c).flatMap(s=>s.exercises).length),[48,33,1]);
 assert.equal(bank.sections.filter(s=>s.category==="fixation").length,11);
 assert.deepEqual(["short","choice","written"].map(k=>qs.filter(q=>q.answer.kind===k).length),[21,11,121]);
 assert.equal(new Set(qs.map(q=>q.id)).size,153);assert.equal(new Set(es.map(e=>e.id)).size,82);
 const ids=doc.sections.flatMap(s=>s.topics).map(t=>t.id);for(const s of bank.sections)assert.ok(ids.includes(s.courseTopicId));
});
test("JSON Web/API conserve les corrections et les17 figures, aucune dans les énoncés",()=>{
 for(const[s,i]of bank.sections.map((s,i)=>[s,i]as const)){
  const input={levelId:bank.levelId,subjectId:bank.subjectId,lessonKey:bank.lessonKey,lessonTitle:"PPCM et PGCD",difficulty:"easy",category:s.category,stageNumber:i+1,title:s.title,instructionsMarkdown:"",sourceSectionId:s.id,courseTopicId:s.courseTopicId,exercises:s.exercises};
  assert.deepEqual(arenaPayloadSchema.parse(JSON.parse(JSON.stringify(input))).exercises,JSON.parse(JSON.stringify(s.exercises)));
 }
 assert.equal(es.filter(e=>e.figureKey).length,0);assert.equal(es.filter(e=>e.correctionFigureKey).length,17);
});
test("32 décisions objectives et121 rédactions : pas de fausse note pour une preuve",()=>{
 for(const e of es){const answers:Record<string,string>={};
  for(const q of e.questions!){assert.ok(q.explanation.length>25,e.id+"/"+q.label);assert.ok(e.correctionMarkdown.includes(q.explanation));
   if(q.answer.kind==="written"){assert.equal(q.points,0);assert.equal(exerciseAnswerStatus(q,"Une autre preuve"),"written");}
   else{assert.equal(exerciseAnswerStatus(q,""),"unanswered");const answer=q.answer.kind==="choice"?String(q.answer.correctIndex):q.answer.accepted[0];answers[q.id]=answer;assert.equal(exerciseAnswerStatus(q,answer),"correct");assert.equal(exerciseAnswerStatus(q,"99999999"),"incorrect");}
  }
  const score=exerciseAssessment(e,answers);assert.equal(score.outOf20,score.total?20:null);
 }
 assert.equal(exerciseAssessment(find(82),{}).outOf20,null);assert.equal(exerciseAnswerStatus(find(38).questions![0],"108*150/2700"),"correct");
 for(const n of[16,23,24,25,26,27])assert.ok(find(n).questions!.every(q=>q.answer.kind==="written"),"Une solution particulière ne doit pas être comparée à un couple unique.");
});
test("calculs objectifs indépendants et données de source corrigées",()=>{
 const value=(n:number,i=0)=>{const a=find(n).questions![i].answer;assert.equal(a.kind,"short");return Number(a.kind==="short"?a.accepted[0]:NaN);};
 for(const[n,a,b]of[[18,2096,3182],[19,14865,7976],[20,756,990],[38,108,150]])assert.equal(value(n),Number(gcdValue(BigInt(a),BigInt(b))));
 assert.equal(value(10),585);assert.equal(value(14),300);assert.equal(value(68),270);
 assert.deepEqual(find(7).questions!.map(q=>q.answer.kind==="choice"?q.answer.correctIndex:-1),[0,0,0,1,1]);
 assert.equal(find(4).questions![0].answer.kind==="choice"&&find(4).questions![0].answer.correctIndex,1);
});
test("identités paramétriques, sommes et PPCM vérifiés sur une plage de valeurs",()=>{
 for(let n=0;n<100;n++){
  assert.equal(gcdValue(BigInt(3*n+4),BigInt(2*n+2)),n%2?1n:2n);
  assert.equal(gcdValue(BigInt(n*n+n),BigInt(2*n+1)),1n);
  assert.equal(gcdValue(BigInt(5*n*n+7*n+4),BigInt(5*n+2)),n%2?1n:2n);
  for(const[a,b]of[[n+1,n+3],[2*n+1,3*n+2]]){assert.equal(gcdValue(BigInt(7*a+5*b),BigInt(4*a+3*b)),gcdValue(BigInt(a),BigInt(b)));assert.equal(gcdValue(BigInt(a+b),lcmValue(BigInt(a),BigInt(b))),gcdValue(BigInt(a),BigInt(b)));}
 }
 for(let k=-50;k<=50;k++){
  assert.equal(gcdValue(BigInt(9*k+13),BigInt(2*k+1)),((k-8)%17===0)?17n:1n);
  assert.equal(gcdValue(BigInt(2*k+3),BigInt(3*k+2)),((k-1)%5===0)?5n:1n);
  assert.equal(gcdValue(BigInt(2*k+2),BigInt(3*k+1)),k%2===0?1n:(k-1)%4===0?4n:2n);
 }
});
test("problèmes : effets de bord des effectifs, congruences et année bissextile",()=>{
 for(const k of[0,1,404]){const g=5+13*k,f=7685-19*k;assert.ok(g>0&&f>0);assert.equal(19000*g+13000*f,100000000);}
 assert.equal(5*360000+3*270000+33*30000,3600000);
 for(const k of[0,1,10]){assert.equal((53+170*k)%10,3);assert.equal((53+170*k)%17,2);}
 assert.equal(92%15,2);assert.equal(92%28,8);assert.equal(785%17,3);assert.equal(785%11,4);assert.equal(785%6,5);
 assert.equal(new Date(Date.UTC(2019,11,7)+735*86400000).toISOString().slice(0,10),"2021-12-11");
 assert.equal(lcmValue(105n,81n),2835n);assert.equal(735%105,0);assert.equal(735%81,6);
 for(let d=1;d<735;d++)assert.ok(d%105!==0||d%81!==6);
});
test("Fermat, Mersenne, nombres parfaits et codage : résultats contrôlés",()=>{
 assert.deepEqual(primeFactorization(65537),[{prime:65537,exponent:1}]);assert.equal(641n*6700417n,2n**32n+1n);
 assert.equal(89*23,2**11-1);
 assert.equal(3*49+3*7+3,171);assert.equal(2*9+2*3+2,26);
 assert.equal(affineCipher("GAUSS",5,7),"LHDTT");assert.equal(affineCipher("AWA",5,7,true),"JDJ");assert.equal(affineCipher("KX",18,7),"FF");assert.throws(()=>affineCipher("FF",18,7,true));
 for(let n=0;n<26;n++)assert.equal(affineCipher(affineCipher(String.fromCharCode(65+n),5,7),5,7,true),String.fromCharCode(65+n));
 assert.match(find(80).questions!.find(q=>q.label==="5.a)")!.prompt,/25/);
 assert.match(find(80).questions!.find(q=>q.label==="5.a)")!.explanation,/sur tout/);
});
test("la collection est chargée uniquement pour Terminale C, leçon11",async()=>{
 assert.deepEqual(await loadExerciseCollection("terminale-c","mathematics",bank.lessonKey),bank);
 assert.equal(await loadExerciseCollection("terminale-d","mathematics",bank.lessonKey),null);
 assert.equal(await loadExerciseCollection("terminale-c","physics-chemistry",bank.lessonKey),null);
});
