import assert from "node:assert/strict";
import test from "node:test";
import { arenaPayloadSchema } from "../apps/api/src/arenaExerciseSchema";
import { terminalCDivisibilityExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCDivisibilityExercises";
import { loadExerciseCollection } from "../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import { exerciseAnswerStatus,exerciseAssessment,exerciseDraftKey,restoreExerciseDraft } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { euclideanDivision,baseConversion,modPower } from "../apps/web/src/features/mathematics/arithmeticModels";
const es=bank.sections.flatMap(s=>s.exercises),qs=es.flatMap(e=>e.questions??[]),find=(n:number)=>es.find(e=>e.sourceNumber===n)!;
test("60 exercices1–60,26/32/2,127sous-questions ; deux rubriques bleues sources",()=>{
  assert.deepEqual(es.map(e=>e.sourceNumber),Array.from({length:60},(_,i)=>i+1));
  assert.deepEqual(["fixation","deepening","complex"].map(c=>bank.sections.filter(s=>s.category===c).flatMap(s=>s.exercises).length),[26,32,2]);
  assert.equal(bank.sections.filter(s=>s.category==="fixation").length,2);assert.equal(qs.length,127);
  assert.deepEqual(["short","choice","written"].map(k=>qs.filter(q=>q.answer.kind===k).length),[41,13,73]);
  assert.deepEqual(es.map(e=>e.questions!.length),[1,1,2,1,2,2,2,3,3,3,3,1,1,12,9,1,1,1,1,4,1,1,3,1,1,3,1,1,1,1,1,2,2,1,1,1,1,2,1,1,2,1,2,1,1,1,1,1,1,1,1,3,12,6,4,1,1,4,1,1]);
  assert.equal(new Set(qs.map(q=>q.id)).size,127);assert.equal(new Set(es.map(e=>e.id)).size,60);
  assert.deepEqual(bank.source.pages,[64,65,66]);for(const e of es)assert.equal(e.sourcePage,e.sourceNumber!<=26?64:e.sourceNumber!<=53?65:66);
});
test("contrat Web/API : stockage fractionné sous30, outils dans les corrections seulement",()=>{
  for(const[s,i]of bank.sections.map((s,i)=>[s,i]as const)){
    assert.ok(s.exercises.length<=30);
    const parsed=arenaPayloadSchema.parse({levelId:bank.levelId,subjectId:bank.subjectId,lessonKey:bank.lessonKey,lessonTitle:"Divisibilité",difficulty:"easy",category:s.category,stageNumber:i+1,title:s.title,instructionsMarkdown:"",sourceSectionId:s.id,courseTopicId:s.courseTopicId,exercises:s.exercises});
    assert.deepEqual(parsed.exercises,s.exercises);
  }
  assert.equal(es.filter(e=>e.figureKey).length,0);assert.deepEqual(es.filter(e=>e.correctionFigureKey).map(e=>e.sourceNumber),[10,11,14,24,38,48,49]);
});
test("54réponses objectives reconnues ;73rédactions sans note automatique",()=>{
  for(const e of es){
    const answers:Record<string,string>={};
    for(const q of e.questions!){
      assert.ok(q.explanation.length>80,e.id+"/"+q.label);assert.ok(e.correctionMarkdown.includes(q.explanation));
      if(q.answer.kind==="written"){assert.equal(q.points,0);assert.equal(exerciseAnswerStatus(q,"Mon raisonnement"),"written");}
      else{assert.equal(exerciseAnswerStatus(q,""),"unanswered");answers[q.id]=q.answer.kind==="choice"?String(q.answer.correctIndex):q.answer.accepted[0];assert.equal(exerciseAnswerStatus(q,answers[q.id]),"correct");}
    }
    const score=exerciseAssessment(e,answers);assert.equal(score.outOf20,score.total?20:null);
  }
  assert.equal(exerciseAssessment(find(58),{}).outOf20,null);
});
test("résultats courts contrôlés indépendamment, divisions signées et conversions",()=>{
  const values:Record<number,string[]>={
    5:["18","3"],6:["0","45"],7:["1","0"],9:["5135","70","3059"],10:["1145","2240","40BA"],11:["10210","12332","3BAA2"],
    14:["9","2","-11","1","-34","1","-13","6","-9","0","-9","0"],18:["2"],21:["4"],33:["3"],35:["6"],36:["8"],38:["8","2126"],39:["5"],47:["5"],53:["64","314","1564","7814","39064"],
  };
  for(const e of es){const objective=e.questions!.filter(q=>q.answer.kind==="short");assert.equal(objective.length,values[e.sourceNumber!]?.length??0);objective.forEach((q,i)=>{if(q.answer.kind==="short")assert.equal(q.answer.accepted[0],values[e.sourceNumber!][i]);});}
  assert.equal(baseConversion("7054",10,12).result,"40BA");assert.equal(baseConversion("1435A",16,12).result,"3BAA2");
  assert.equal(baseConversion(String(30*37),10,8).result,"2126");
  for(const[a,b,q,r]of[[65,7,9,2],[-87,8,-11,1],[103,-3,-34,1],[-111,9,-13,6],[-45,5,-9,0],[45,-5,-9,0]])assert.deepEqual(euclideanDivision(BigInt(a),BigInt(b)),{q:BigInt(q),r:BigInt(r)});
});
test("base de numération : comparaison littérale, pas de faux calcul décimal accepté",()=>{
  const q=find(10).questions![0];assert.equal(q.answer.kind==="short"&&q.answer.comparison,"literal");
  assert.equal(exerciseAnswerStatus(q,"1145"),"correct");assert.equal(exerciseAnswerStatus(q,"1000+145"),"incorrect");assert.equal(exerciseAnswerStatus(q,"001145"),"incorrect");
  assert.equal(exerciseAnswerStatus(find(10).questions![2],"40ba"),"correct");assert.equal(exerciseAnswerStatus(find(11).questions![2],"3baa2"),"correct");
  assert.equal(exerciseAnswerStatus(find(5).questions![0],"9+9"),"correct");
});
test("petits rangs du resteex32 et six chiffres de l’exercice37 exhaustifs",()=>{
  for(let n=1;n<500;n++){
    assert.equal((n*n+2*n)%(n+1),n);
    const r=n===1?2:n<=4?9-2*n:n+11;assert.equal((7*n+15)%(3*n+2),r);
  }
  const pairs:number[][]=[];for(let a=0;a<=9;a++)for(let b=0;b<=9;b++){const n=10802+1000*a+10*b;if(n%4===0&&n%9===0)pairs.push([a,b]);}
  assert.deepEqual(pairs,[[0,7],[2,5],[4,3],[6,1],[7,9],[9,7]]);
  assert.match(find(32).correctionMarkdown,/n=1/);assert.match(find(32).correctionMarkdown,/n\\ge5/);
});
test("trois erreurs sources rectifiées et tracées seulement en métadonnées",()=>{
  assert.match(find(23).questions![0].prompt,/n’est pas divisible/);assert.notEqual(2024%24,0);
  assert.match(find(43).questions![0].prompt,/somme des carrés/);assert.match(find(58).questions![1].prompt,/1.*mod/);
  for(let k=-40;k<=40;k++){const n=k*k+(k+1)**2;assert.equal(2*n-1,(2*k+1)**2);assert.equal((k**4+64),(k*k-4*k+8)*(k*k+4*k+8));}
  assert.match(bank.source.editorialNotes.join(" "),/Ex43/);assert.match(bank.source.editorialNotes.join(" "),/Ex58/);
  for(const e of es)assert.doesNotMatch(e.statementMarkdown+e.correctionMarkdown,/coquille|Excellence rétablit|Solution commentée/);
});
test("puissances et périodicités évaluées par calcul entier indépendant",()=>{
  for(let n=0;n<60;n++){
    assert.equal((3n*5n**BigInt(2*n+1)+2n**BigInt(3*n+1))%17n,0n);
    assert.equal((9n**BigInt(n)-2n**BigInt(n))%7n,0n);
    assert.equal(modPower(4n,n,11n),BigInt([1,4,5,9,3][n%5]));
    assert.equal(modPower(3n,n,5n),BigInt([1,3,4,2][n%4]));
    assert.equal((modPower(5n,2*n,3n)+modPower(5n,n+1,3n))%3n,BigInt(n%2?2:0));
    assert.equal((modPower(3n,2*n,13n)+modPower(3n,n+1,13n))%13n,BigInt([4,5,4][n%3]));
  }
  assert.equal(modPower(67n,89,11n),1n);assert.equal(modPower(3548n,31,10n)*modPower(2537n,19,10n)%10n,6n);
  assert.equal(999888777666555444333222111000n%7n,5n);
});
test("suiteex53 : formule exacte, mod50 puis mod4 et terminaisons14/64",()=>{
  let u=14n;
  for(let n=0;n<40;n++){
    assert.equal(2n*u,5n**BigInt(n+2)+3n);assert.equal(u%100n,n%2?64n:14n);assert.equal(u%4n,n%2?0n:2n);u=5n*u-6n;
  }
  assert.match(find(53).correctionMarkdown,/mod\{50\}/);assert.match(find(53).correctionMarkdown,/pas seulement/);
});
test("allumettes et cléRIB : stratégies et grand entier sans arrondi flottant",()=>{
  const win:boolean[]=[true,false];for(let n=2;n<=40;n++)win[n]=[1,2,3,4].some(a=>a<n&&!win[n-a]);
  for(let n=1;n<=40;n++)assert.equal(win[n],n%5!==1);
  for(let a=1;a<=4;a++){assert.ok(5-a>=1&&5-a<=4);assert.equal((36-a-(5-a))%5,1);}
  const n0=23104152310000646211300n;assert.equal(n0%97n,96n);assert.equal((n0+1n)%97n,0n);
  assert.equal((n0+1n)/97n,238187137216501507333n);
  assert.match(find(59).correctionMarkdown,/commencer et retirer 4/);assert.match(find(60).correctionMarkdown,/R=01/);
  assert.equal(39678472n*8752338n,347279398267536n);
});
test("chargement C uniquement et brouillons indépendants des exercices",async()=>{
  assert.deepEqual(await loadExerciseCollection("terminale-c","mathematics",bank.lessonKey),bank);
  assert.equal(await loadExerciseCollection("terminale-d","mathematics",bank.lessonKey),null);
  const e=find(10),answers={[e.questions![0].id]:"1145"},raw=JSON.stringify({answers,reasoning:"Mes divisions",submitted:true});
  assert.deepEqual(restoreExerciseDraft(raw,e).answers,answers);assert.equal(restoreExerciseDraft(raw,find(11)).answers[e.questions![0].id],undefined);
  assert.notEqual(exerciseDraftKey("s","div",e.id),exerciseDraftKey("s","div",find(11).id));
});
