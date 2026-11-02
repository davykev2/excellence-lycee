import assert from "node:assert/strict";
import test from "node:test";
import { arenaPayloadSchema } from "../apps/api/src/arenaExerciseSchema";
import { terminalCBarycenterExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCBarycenterExercises";
import { loadExerciseCollection } from "../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import { exerciseAnswerStatus,exerciseAssessment,numericExerciseAnswer,exerciseDraftKey,restoreExerciseDraft } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { barycenterScene } from "../apps/web/src/features/mathematics/BarycenterScenes";
import { barycenter,leverBalance,type Point2 } from "../apps/web/src/features/mathematics/barycenterModels";
const es=bank.sections.flatMap(s=>s.exercises),qs=es.flatMap(e=>e.questions??[]),find=(n:number)=>es.find(e=>e.sourceNumber===n)!;
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-9*Math.max(1,Math.abs(b)),a+" ≠ "+b);
test("41 exercices1–41,19/21/1,10rubriques,97sous-questions sans doublon",()=>{
  assert.deepEqual(es.map(e=>e.sourceNumber),Array.from({length:41},(_,i)=>i+1));
  assert.deepEqual(["fixation","deepening","complex"].map(c=>bank.sections.filter(s=>s.category===c).flatMap(s=>s.exercises).length),[19,21,1]);
  assert.equal(bank.sections.filter(s=>s.category==="fixation").length,10);assert.equal(qs.length,97);
  assert.deepEqual(["short","choice","written"].map(k=>qs.filter(q=>q.answer.kind===k).length),[11,4,82]);
  assert.equal(new Set(qs.map(q=>q.id)).size,97);assert.equal(new Set(es.map(e=>e.id)).size,41);assert.deepEqual(bank.source.pages,[28,29,30,31,32]);
});
test("contrat fermé Web/API : six figures sources,26corrigés, aucune réponse dans la grille initiale",()=>{
  for(const[s,i]of bank.sections.map((s,i)=>[s,i] as const))assert.deepEqual(arenaPayloadSchema.parse({levelId:bank.levelId,subjectId:bank.subjectId,lessonKey:bank.lessonKey,lessonTitle:"Barycentre",difficulty:"easy",category:s.category,stageNumber:i+1,title:s.title,instructionsMarkdown:"",sourceSectionId:s.id,courseTopicId:s.courseTopicId,exercises:s.exercises}).exercises,s.exercises);
  assert.deepEqual(es.filter(e=>e.figureKey).map(e=>e.sourceNumber),[24,32,34,36,37,41]);assert.equal(es.filter(e=>e.correctionFigureKey).length,26);
  assert.equal(barycenterScene("24",true).points.G,undefined);near(barycenterScene("24").points.G[1],13/7);
});
test("les15réponses objectives acceptées,82rédactions sans note automatique",()=>{
  for(const e of es){
    const answers:Record<string,string>={};
    for(const q of e.questions??[]){
      assert.ok(q.explanation.length>80,e.id+"/"+q.label);assert.ok(e.correctionMarkdown.includes(q.explanation));
      if(q.answer.kind==="written"){assert.equal(q.points,0);assert.equal(exerciseAnswerStatus(q,"Mon raisonnement"),"written");}
      else{assert.equal(exerciseAnswerStatus(q,""),"unanswered");answers[q.id]=q.answer.kind==="choice"?String(q.answer.correctIndex):q.answer.accepted[0];assert.equal(exerciseAnswerStatus(q,answers[q.id]),"correct");}
    }
    const score=exerciseAssessment(e,answers);assert.equal(score.outOf20,score.total?20:null);
  }
  assert.equal(exerciseAssessment(find(38),{}).outOf20,null);
});
test("11résultats numériques contrôlés sans recopier les solutions",()=>{
  const expected:Record<number,number[]>={8:[1/14,2-3*Math.sqrt(2)/7],9:[2-Math.sqrt(3)/4,33/4,-19/4],30:[3/5,14/5],32:[4,2/3],41:[18*2/3,18*2/3*2500]};
  let count=0;
  for(const e of es){const short=e.questions!.filter(q=>q.answer.kind==="short");assert.equal(short.length,expected[e.sourceNumber!]?.length??0);short.forEach((q,i)=>{if(q.answer.kind==="short"){near(numericExerciseAnswer(q.answer.accepted[0])!,expected[e.sourceNumber!][i]);count++;}});}
  assert.equal(count,11);assert.deepEqual(find(20).questions!.map(q=>q.answer.kind==="choice"&&q.answer.correctIndex),[1,0,2]);
  near(leverBalance(18,3,2),12);assert.throws(()=>leverBalance(18,0,2));
});
test("toutes les scènes sont finies, sources fidèles et constructions non notées",()=>{
  for(const e of es.filter(e=>e.correctionFigureKey)){
    const n=e.sourceNumber!;if([19,27,41].includes(n))continue;
    for(const key of n===22?["22-a","22-c","22-d"]:n===23?["23-a","23-b"]:n===38?["38-ceva","38-menelaus"]:[String(n)]){
      const s=barycenterScene(key);assert.ok(Object.values(s.points).flat().every(Number.isFinite));
      for(const[a,b]of[...s.segments,...s.highlight??[]]){assert.ok(s.points[a]);assert.ok(s.points[b]);}
      for(const c of s.circles??[]){assert.ok(c.radius>0);assert.ok(Number.isFinite(c.radius));}
    }
  }
  for(const id of["alignment-worked","alignment-application","concurrence-worked","concurrence-application","partial"])assert.ok(barycenterScene(id).points);
  assert.throws(()=>barycenterScene("inconnu"));assert.equal(find(24).questions![0].answer.kind,"written");
});
test("points dégénérés et modulos : erreurs de source corrigées sans avis public",()=>{
  for(const n of[15,17]){assert.match(find(n).statementMarkdown,/trois points/);assert.doesNotMatch(find(n).statementMarkdown,/triangle/);}
  assert.doesNotMatch(find(16).statementMarkdown,/BD/);assert.match(find(17).correctionMarkdown,/MC\^2\+2/);
  assert.match(find(19).statementMarkdown,/2\\pi/);assert.match(find(27).statementMarkdown,/\\pmod\{\\pi\}/);assert.match(find(27).correctionMarkdown,/cercle entier/);
  assert.match(find(37).statementMarkdown,/G=\(DJ\)/);assert.match(find(38).correctionMarkdown,/parallélisme/);assert.match(find(39).statementMarkdown,/intersections uniques/);
  for(const e of es)assert.doesNotMatch(e.statementMarkdown+e.correctionMarkdown,/coquille|Excellence rétablit|Solution commentée/);
});
test("regroupements et alignements avancés contrôlés dans un repère affine",()=>{
  const A:Point2=[0,0],B:Point2=[6,0],C:Point2=[1,4],G=barycenter([A,B,C],[1,-2,3])!;
  near(G[0],-4.5);near(G[1],6);
  const s=barycenterScene("32"),k=s.points.K;
  near((k[0]-s.points.A[0])/(s.points.J[0]-s.points.A[0]),.8);
  const t=barycenterScene("36"),mean=barycenter([t.points.A,t.points.B,t.points.C],[1,1,1])!;
  for(const pair of[["I","L"],["J","M"],["K","N"]]){const g=barycenter(pair.map(x=>t.points[x]),[1,1])!;near(g[0],mean[0]);near(g[1],mean[1]);}
  const z=barycenterScene("37");near(z.points.G[0],(3*z.points.I[0]+z.points.C[0])/4);near(z.points.G[1],(3*z.points.I[1]+z.points.C[1])/4);
});
test("Ceva inclut le parallélisme ; Ménélaüs utilise un produit orienté positif",()=>{
  const criterion=(a:number,b:number,c:number)=>a*b*c-(1-a)*(1-b)*(1-c);
  near(criterion(.5,.5,.5),0);
  // Three parallel cevians : A′=(2,-1), B′=(0,1/2), C′=(2,0).
  near(criterion(2,.5,-1),0);
  const a=.5,b=2,c=1/3,p=-(1-a)*(1-b)*(1-c)/(a*b*c);near(p,1);
  assert.match(find(38).questions!.find(q=>q.label==="3.")!.explanation,/D=0/);
});
test("chargement réservé à C et brouillon isolé par exercice",async()=>{
  assert.deepEqual(await loadExerciseCollection("terminale-c","mathematics",bank.lessonKey),bank);
  assert.equal(await loadExerciseCollection("terminale-d","mathematics",bank.lessonKey),null);
  const e=find(20),answers={[e.questions![0].id]:"1"},raw=JSON.stringify({answers,reasoning:"Mes étapes",submitted:true});
  assert.deepEqual(restoreExerciseDraft(raw,e).answers,answers);assert.equal(restoreExerciseDraft(raw,find(8)).answers[e.questions![0].id],undefined);
  assert.notEqual(exerciseDraftKey("s","bary",e.id),exerciseDraftKey("s","bary",find(21).id));
});
test("équations de Ceva et alignement de Desargues vérifiés indépendamment des textes",()=>{
  for(const a of[-2,.2,.5,2,3])for(const b of[-3,.3,.5,1.5]){
    const t=(1-a)*(1-b),den=t+a*b;if(Math.abs(den)<1e-10)continue;
    const c=t/den,D=1-a+a*b;if(Math.abs(D)<1e-10)continue;
    const x=a*b/D,y=b*(1-a)/D;
    near((1-a)*x-a*y,0);near(b*x+y,b);near(x+(1-c)*y,1-c);
  }
  const s=barycenterScene("39"),[i,j,k]=[s.points.I,s.points.J,s.points.K];
  near((j[0]-i[0])*(k[1]-i[1])-(j[1]-i[1])*(k[0]-i[0]),0);
  const parallel={a:2,b:.5,c:-1};near(1-parallel.a+parallel.a*parallel.b,0);
  near(parallel.a+(1-parallel.a)*(1-parallel.c),0);
});
test("lieux de normes et aires : les figures satisfont les équations annoncées",()=>{
  const sq=barycenterScene("22-d"),k=sq.points.K,r=sq.circles![0].radius,M:Point2=[k[0]+r,k[1]],c=sq.points.C,h=sq.points.H;
  near(Math.hypot(M[0]-h[0],M[1]-h[1]),2*Math.hypot(M[0]-c[0],M[1]-c[1]));
  const circle=barycenterScene("35"),g=circle.points.G,rr=circle.circles![0].radius,m:Point2=[g[0],g[1]+rr];
  const d2=(p:Point2,q:Point2)=>(p[0]-q[0])**2+(p[1]-q[1])**2;
  near(2*d2(m,circle.points.A)+d2(m,circle.points.B)+d2(m,circle.points.C),2);
  const ar=barycenterScene("40"),area=(a:Point2,b:Point2,c:Point2)=>Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/2;
  const weights=[area(ar.points.M,ar.points.B,ar.points.C),area(ar.points.M,ar.points.C,ar.points.A),area(ar.points.M,ar.points.A,ar.points.B)];
  const mean=barycenter([ar.points.A,ar.points.B,ar.points.C],weights)!;near(mean[0],ar.points.M[0]);near(mean[1],ar.points.M[1]);
  assert.doesNotMatch(find(38).correctionMarkdown,/\\tag\{\*/);
});
