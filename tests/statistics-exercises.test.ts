import assert from "node:assert/strict";
import test from "node:test";
import { arenaPayloadSchema } from "../apps/api/src/arenaExerciseSchema";
import { terminalCStatisticsExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCStatisticsExercises";
import { terminalCStatisticsDocument as course } from "../apps/web/src/data/courseDocuments/terminalCStatisticsDocument";
import { loadExerciseCollection } from "../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import { exerciseAnswerStatus,exerciseAssessment,exerciseDraftKey,restoreExerciseDraft,numericExerciseAnswer } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { bivariateStatistics as calc,statisticsData as d,transformedStatistics,mayerLine,marginalDistributions } from "../apps/web/src/features/mathematics/statisticsModels";
const es=bank.sections.flatMap(s=>s.exercises),qs=es.flatMap(e=>e.questions??[]),find=(n:number)=>es.find(e=>e.sourceNumber===n)!;
const near=(a:number,b:number,tolerance=1e-9)=>assert.ok(Math.abs(a-b)<=tolerance*Math.max(1,Math.abs(b)),a+" ≠ "+b);
test("37 exercices1–37,14/21/2,5rubriques bleues et130sous-questions",()=>{
  assert.deepEqual(es.map(e=>e.sourceNumber),Array.from({length:37},(_,i)=>i+1));
  assert.deepEqual(["fixation","deepening","complex"].map(c=>bank.sections.filter(s=>s.category===c).flatMap(s=>s.exercises).length),[14,21,2]);
  assert.equal(bank.sections.filter(s=>s.category==="fixation").length,5);assert.equal(qs.length,130);
  assert.deepEqual(["short","choice","written"].map(k=>qs.filter(q=>q.answer.kind===k).length),[33,3,94]);
  assert.equal(new Set(qs.map(q=>q.id)).size,130);assert.equal(new Set(es.map(e=>e.id)).size,37);
  assert.deepEqual(bank.source.pages,[256,257,258,259,260,261,262]);assert.equal(find(14).sourcePage,257);assert.equal(find(37).sourcePage,262);
  for(const section of bank.sections)assert.ok(course.sections.flatMap(s=>s.topics).some(t=>t.id===section.courseTopicId));
});
test("contrat JSON API fermé, nuage23 sans réponse, 24 figures exclusivement dans les solutions",()=>{
  bank.sections.forEach((s,i)=>assert.deepEqual(arenaPayloadSchema.parse({levelId:bank.levelId,subjectId:bank.subjectId,lessonKey:bank.lessonKey,lessonTitle:"Statistique",difficulty:"easy",category:s.category,stageNumber:i+1,title:s.title,instructionsMarkdown:"",sourceSectionId:s.id,courseTopicId:s.courseTopicId,exercises:s.exercises}).exercises,s.exercises));
  assert.deepEqual(es.filter(e=>e.figureKey).map(e=>e.sourceNumber),[23]);assert.equal(find(23).figureKey,"tc-l10-scatter-blank");
  assert.equal(es.filter(e=>e.correctionFigureKey).length,24);
  for(const e of es.filter(e=>e.correctionFigureKey)){assert.equal(e.correctionFigureKey,"tc-l10-statistics");assert.ok(d[e.sourceNumber!]);}
});
test("36 réponses objectives et94rédactions ; notation honnête, correction et validation indépendantes",()=>{
  for(const e of es){
    const answers:Record<string,string>={};
    for(const q of e.questions??[]){
      assert.ok(q.explanation.length>80,e.id+"/"+q.label);assert.ok(e.correctionMarkdown.includes(q.explanation));
      if(q.answer.kind==="written"){assert.equal(q.points,0);assert.equal(exerciseAnswerStatus(q,"Mon raisonnement"),"written");}
      else{
        assert.equal(exerciseAnswerStatus(q,""),"unanswered");assert.ok(q.points>0);
        if(q.answer.kind==="choice")answers[q.id]=String(q.answer.correctIndex);
        else{q.answer.accepted.forEach(a=>assert.equal(exerciseAnswerStatus(q,a),"correct"));answers[q.id]=q.answer.accepted[0];}
      }
    }
    const s=exerciseAssessment(e,answers);assert.equal(s.outOf20,s.total?20:null);
  }
  assert.equal(exerciseAssessment(find(35),{}).outOf20,null);assert.equal(exerciseAssessment(find(36),{}).outOf20,null);
});
test("les33résultats numériques sont recalculés indépendamment des corrigés",()=>{
  const r14=(775/4-28.5*6.75)/Math.sqrt((3254/4-28.5**2)*(191/4-6.75**2));
  const expected:Record<number,number[]>={
    8:[5550/5-(518/5)*11],9:[595000/5-45000*(13/5)],14:[Math.round(r14*1000)/1000],
    15:[5*(57.3*2+516.2)-(504+580+644+735),2017+(1433-516.2)/57.3],16:[4*10-36,4*9-22],
    17:[32.1/10,541/10,60.466,4.591],18:[1143],19:[151.27,86.6],20:[3960/6-3.5*170,270.286],
    21:[Math.round(185/281)],22:[1,896.7],24:[.97],26:[-125.667],27:[.9,Math.round(491/45)],
    28:[154700/5-36*831],29:[34.52],30:[58.06,21.37],31:[5*(9*1.6+.6)-55,.9],32:[22031],33:[.999],34:[166/5-3*10.2,.948],
  };
  let count=0;
  for(const e of es){
    const actual=e.questions!.filter(q=>q.answer.kind==="short");assert.equal(actual.length,expected[e.sourceNumber!]?.length??0,e.id);
    actual.forEach((q,i)=>{if(q.answer.kind==="short"){near(numericExerciseAnswer(q.answer.accepted[0])!,expected[e.sourceNumber!][i]);count++;}});
  }
  assert.equal(count,33);assert.deepEqual([5,10,13].map(n=>find(n).questions![0].answer.kind==="choice"&&find(n).questions![0].answer.correctIndex),[3,1,0]);
});
test("paramètres exacts : calculs centrés indépendants, régressions dans le bon sens et passage par G",()=>{
  for(const data of Object.values(d)){
    const s=calc(data),weights=data.weights??data.x.map(()=>1),n=weights.reduce((a,b)=>a+b,0);
    near(s.covariance,s.sumXY/n-s.meanX*s.meanY);
    near(s.varianceX,s.sumXX/n-s.meanX**2,1e-7);near(s.varianceY,s.sumYY/n-s.meanY**2,1e-7);
    if(s.a!==null){near(s.a*s.meanX+s.b!,s.meanY);near(data.x.reduce((sum,x,i)=>sum+weights[i]*(data.y[i]-s.a!*x-s.b!),0),0,1e-5);}
    if(s.aPrime!==null)near(s.aPrime*s.meanY+s.bPrime!,s.meanX);
    if(s.r!==null)near(s.a!*s.aPrime!,s.r*s.r);
  }
  const p=calc(d["27"]);near(p.varianceX,271/64);near(p.covariance,173/32);near(p.aPrime!,173/270);near(p.bPrime!,89/135);
  near(p.aPrime!*16+p.bPrime!,491/45);assert.notEqual((16-p.b!)/p.a!,p.aPrime!*16+p.bPrime!);
  near(calc(d["22"]).varianceX,3030/49);near(calc(d["22"]).varianceY,1591400/49);
  near(calc(d["23"]).a!,203/346);near(calc(d["23"]).b!,-104/173);near(calc(d["24"]).b!,50.25);
});
test("la donnée80cm reste conservée, Mayer et estimations inverses sont distincts des régressions inverses",()=>{
  assert.equal(d["17"].y[3],80);
  const m=mayerLine(d["17"]);near(m.first.meanX,2.78);near(m.first.meanY,54.2);near(m.second.meanX,3.64);near(m.second.meanY,54);
  near(m.a,-10/43);near(m.b,11792/215);
  for(const [key,x,y,expectedY,expectedX]of [["17",4.7,60,60.465672812867794,4.591000918273646],["18",0,300,384.7011952191235,1143.0107526881723],["19",47,170,151.2702702702703,86.6]] as const){
    const s=calc(d[key]);near(s.a!*x+s.b!,expectedY);near((y-s.b!)/s.a!,expectedX);assert.notEqual(s.aPrime!*y+s.bPrime!,expectedX);
  }
  assert.match(find(17).questions![7].explanation,/non une estimation clinique/);assert.match(find(18).questions![5].explanation,/pas une régression/);
});
test("logarithmes et modèle puissance ne changent ni les couples ni la précision des calculs",()=>{
  const t32=transformedStatistics("32"),s=calc(t32);
  d["32"].x.forEach((x,i)=>near(t32.x[i],Math.log(x)));d["32"].y.forEach((y,i)=>near(t32.y[i],Math.log(y)));
  assert.deepEqual(t32.scale,[1,1]);near(s.a!,.4590581445090766);near(Math.exp(s.b!),233.66990966657985);
  const value=Math.exp(s.b!)*20000**s.a!;near(value,22030.565236557526);assert.ok(value>20000);
  const t33=transformedStatistics("33");assert.deepEqual(t33.y,d["33"].y);assert.equal(d["33"].x.at(-1),13);assert.equal(d["33"].x.includes(12),false);
  near(calc(t33).r!,.9989972521939713);assert.match(find(32).questions![4].explanation,/inadapté/);
});
test("pondération des pourcentages : tableau35 différent de la grille de neuf couples",()=>{
  const w=calc(d["35"]),grid=calc({...d["35"],weights:undefined});
  near(w.meanX,24.6);near(w.meanY,3.09);near(w.varianceX,16.84);near(w.varianceY,.6819);near(w.covariance,-2.614);near(w.r!,-.7713903372963922);
  near(grid.meanX,25);near(grid.meanY,3);near(grid.covariance,0);near(grid.r!,0);assert.equal(d["35"].weights![0],0);
  const m=marginalDistributions([20,25,30],[2,3,4],[[0,8,30],[5,20,7],[25,3,2]]);
  assert.deepEqual(m.rowTotals,[38,32,30]);assert.deepEqual(m.columnTotals,[30,31,39]);assert.equal(m.total,100);
});
test("situations : critère statistique ≠ causalité, seuil strict et calendrier entier",()=>{
  const s=calc(d["36"]);near(s.a!,1567/2354);near(s.b!,-60384/1177);near(s.a!*185+s.b!,71.8466440101954);
  assert.match(find(36).questions![2].explanation,/ne prouve pas l’efficacité/);
  const c=calc(d["37"]);near(c.a!,12305/143);near(c.b!,33490/33);
  const threshold=(3000-c.b!)/c.a!;near(threshold,23.07002573479615);assert.equal(Math.floor(threshold)+1,24);
  assert.ok(c.a!*23+c.b!<3000);assert.ok(c.a!*24+c.b!>3000);
  assert.match(find(37).questions![2].explanation,/décembre 2019/);
});
test("chargement C seulement, brouillons par exercice et correction fermée après recharge",async()=>{
  assert.deepEqual(await loadExerciseCollection("terminale-c","mathematics",bank.lessonKey),bank);
  assert.equal(await loadExerciseCollection("terminale-d","mathematics",bank.lessonKey),null);assert.equal(await loadExerciseCollection("terminale-c","physics",bank.lessonKey),null);
  const one=find(5),two=find(13),draft=restoreExerciseDraft(JSON.stringify({answers:{[one.questions![0].id]:"3",unknown:"1"},submitted:true,correctionOpen:true}),one);
  assert.equal(Object.keys(draft.answers).length,1);assert.equal("correctionOpen" in draft,false);
  assert.notEqual(exerciseDraftKey("a",bank.id,one.id),exerciseDraftKey("a",bank.id,two.id));assert.notEqual(exerciseDraftKey("a",bank.id,one.id),exerciseDraftKey("b",bank.id,one.id));
});
