import assert from "node:assert/strict";
import test from "node:test";
import { arenaPayloadSchema } from "../apps/api/src/arenaExerciseSchema";
import { terminalCProbabilityExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCProbabilityExercises";
import { terminalCProbabilityDocument as course } from "../apps/web/src/data/courseDocuments/terminalCProbabilityDocument";
import { loadExerciseCollection } from "../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import { exerciseAnswerStatus,exerciseAssessment,exerciseDraftKey,restoreExerciseDraft,numericExerciseAnswer } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { binomialProbability,finiteLawParameters,cumulativeProbability,probabilityTree,probabilityCdf,treePaths } from "../apps/web/src/features/mathematics/probabilityModels";
const exercises=bank.sections.flatMap(s=>s.exercises),questions=exercises.flatMap(e=>e.questions??[]),find=(n:number)=>exercises.find(e=>e.sourceNumber===n)!;
const near=(a:number,b:number,tol=1e-9)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),a+" ≠ "+b);
const data=(n:number)=>JSON.stringify(find(n));

test("52 exercices1–52,35/15/2,7rubriques et165sous-questions sans perte d’identifiants",()=>{
  assert.deepEqual(exercises.map(e=>e.sourceNumber),Array.from({length:52},(_,i)=>i+1));
  assert.deepEqual(["fixation","deepening","complex"].map(c=>bank.sections.filter(s=>s.category===c).flatMap(s=>s.exercises).length),[35,15,2]);
  assert.equal(bank.sections.filter(s=>s.category==="fixation").length,7);
  assert.equal(questions.length,165);assert.equal(questions.filter(q=>q.answer.kind==="written").length,95);
  assert.equal(questions.filter(q=>q.answer.kind==="short").length,57);assert.equal(questions.filter(q=>q.answer.kind==="choice").length,13);
  assert.equal(new Set(questions.map(q=>q.id)).size,165);assert.equal(new Set(exercises.map(e=>e.id)).size,52);
  assert.deepEqual(bank.source.pages,[231,232,233,234,235,236,237,238]);
  assert.equal(find(35).sourcePage,235);assert.equal(find(52).sourcePage,238);
  assert.equal(find(42).questions!.length,1);assert.deepEqual(find(45).questions!.map(q=>q.label),["1.","2.a)","2.c)","3.","4."]);
  for(const section of bank.sections)assert.ok(course.sections.flatMap(s=>s.topics).some(t=>t.id===section.courseTopicId));
});
test("9rubriques passent le contrat API ; l’arbre de l’énoncé3 ne contient aucun poids visible",()=>{
  bank.sections.forEach((section,i)=>assert.deepEqual(arenaPayloadSchema.parse({levelId:bank.levelId,subjectId:bank.subjectId,lessonKey:bank.lessonKey,lessonTitle:"Probabilités",difficulty:"easy",category:section.category,stageNumber:i+1,title:section.title,instructionsMarkdown:"",sourceSectionId:section.id,courseTopicId:section.courseTopicId,exercises:section.exercises}).exercises,section.exercises));
  assert.deepEqual(exercises.filter(e=>e.figureKey).map(e=>e.sourceNumber),[3]);assert.equal(find(3).figureKey,"tc-l9-tree-blank");
  assert.deepEqual(exercises.filter(e=>e.correctionFigureKey).map(e=>e.sourceNumber),[2,3,5,6,7,15,16,36,37,38,39,41,43,46,47,49]);
  for(const e of exercises.filter(e=>e.correctionFigureKey))assert.ok(probabilityTree(e.sourceNumber!)||probabilityCdf(e.sourceNumber!));
  assert.equal(probabilityTree(999),undefined);assert.equal(probabilityCdf(999),undefined);
});
test("70 réponses objectives acceptées et95rédactions à0point ; correction détaillée indépendante",()=>{
  for(const e of exercises){
    const answers:Record<string,string>={};
    for(const q of e.questions??[]){
      assert.ok(q.explanation.length>60,e.id+"/"+q.label);assert.ok(e.correctionMarkdown.includes(q.explanation));
      if(q.answer.kind==="written"){assert.equal(q.points,0);assert.equal(exerciseAnswerStatus(q,"ma démonstration"),"written");}
      else{
        assert.ok(q.points>0);assert.equal(exerciseAnswerStatus(q,""),"unanswered");
        if(q.answer.kind==="choice"){answers[q.id]=String(q.answer.correctIndex);assert.equal(exerciseAnswerStatus(q,String((q.answer.correctIndex+1)%q.answer.options.length)),"incorrect");}
        else{for(const a of q.answer.accepted)assert.equal(exerciseAnswerStatus(q,a),"correct");answers[q.id]=q.answer.accepted[0];}
      }
    }
    const score=exerciseAssessment(e,answers);assert.equal(score.outOf20,score.total?20:null);
  }
  assert.equal(exerciseAssessment(find(46),{}).total,1);assert.equal(exerciseAssessment(find(52),{}).outOf20,null);
});
test("les57réponses numériques sont confrontées à des calculs indépendants",()=>{
  const expected:Record<number,number[]>={
    2:[.8,.15,.8*.15,.2*.4],3:[.9,.8,.3,.9*.8,.1*.3,.9*.8+.1*.3],
    4:[.8*.15/(.8*.15+.2*.4)],5:[.2*.8,(.2*.2)/(.8*.1+.2*.2)],
    6:[(1/6+3/4+1/3)/3],7:[.4*.25+.6*.5],9:[(.5-.2)/.8],
    12:[1-(1/18+2/9+5/18+1/9)],18:[(-2+12+20+12)/36],
    19:[(2+12+40+36)/36-(7/6)**2,Math.sqrt(41)/6],21:[1-27.648/43.2,43.2/.36],
    28:[2022/14,2022/14*13/14],30:[44],31:[35*.33,35*.33*.67],
    34:[20*(1/4)**3*(3/4)**3,1-(3/4)**6],35:[6*.1**2*.9**2,4*.1**3*.9+.1**4],
    36:[.8,.6*.8/(.6*.8+.4*.1)],39:[.8*.75/3,.8*.75*2/3,.2+.8*.75*2/3],
    40:[.5,1/6,.5],41:[(1/3*2/5)/(1/3*2/5+2/3/6)],42:[.45*.04+.55*.05],
    43:[.03*.95,.97*.1,.03*.95+.97*.1,.03*.95/(.03*.95+.97*.1),.97*.1/(.03*.95+.97*.1),.03*.05/(.03*.05+.97*.9),.97*.9/(.03*.05+.97*.9)],
    44:[.9**8,28*.1**2*.9**6,1-.9**8],45:[.36/.46],46:[3/4],47:[.47*.9+.53*.8,.47*.9/(.47*.9+.53*.8),.47*.9+.53*.2],49:[1-1/70-1/490],
  };
  let checked=0;
  for(const [n,values]of Object.entries(expected)){
    const qs=find(Number(n)).questions!.filter(q=>q.answer.kind==="short");
    assert.equal(qs.length,values.length,n);
    qs.forEach((q,i)=>{if(q.answer.kind==="short")for(const accepted of q.answer.accepted){const value=numericExerciseAnswer(accepted);assert.notEqual(value,null,n+"/"+q.label);near(value!,values[i]);}checked++;});
  }
  assert.equal(checked,57);
  const vf=find(14).questions!.map(q=>q.answer.kind==="choice"?q.answer.correctIndex:-1);assert.deepEqual(vf,[0,0,1,0]);
});
test("dés physiques, paires non équiprobables et cumul inclusif vérifiés par énumération",()=>{
  const sums=new Map<number,number>();
  for(const a of[-1,-1,0,0,1,1])for(const b of[0,1,1,1,2,2])sums.set(a+b,(sums.get(a+b)??0)+1);
  assert.deepEqual([...sums.entries()].sort((a,b)=>a[0]-b[0]),[[-1,2],[0,8],[1,12],[2,10],[3,4]]);
  const values=[-1,0,1,2,3],masses=values.map(x=>sums.get(x)!/36),stats=finiteLawParameters(values,masses);
  near(stats.expectation,7/6);near(stats.variance,41/36);
  for(const number of[15,16,37,38]){
    const model=probabilityCdf(number)!;
    model.values.forEach((x,i)=>near(cumulativeProbability(model.values,model.masses,x)-cumulativeProbability(model.values,model.masses,x-1e-7),model.masses[i]));
  }
  assert.equal(probabilityCdf(38)!.verticalToHorizontal,21);
  const roulette=finiteLawParameters([-6000,-4000,-1000,2000,3000,5000],Array(6).fill(1/6));
  near(roulette.expectation,-500/3);near(roulette.variance,136250000/9);
  const game=finiteLawParameters([-5000,-4000,8000,10000],[2/7,10/21,2/21,1/7]);
  near(game.expectation,-8000/7);near(game.variance,1658000000/49);
});
test("tous les arbres et chacune de leurs ramifications totalisent1",()=>{
  for(const preset of[2,3,5,6,7,36,38,39,41,43,46,47,49]){
    const tree=probabilityTree(preset)!;
    const walk=(node:typeof tree.root)=>{if(node.children){near(node.children.reduce((s,c)=>s+c.probability!,0),1);node.children.forEach(walk);}};
    walk(tree.root);near(treePaths(tree.root).reduce((sum,p)=>sum+p.probability,0),1);
  }
  const admission=treePaths(probabilityTree(39)!.root);near(admission.filter(p=>p.outcome==="Admis").reduce((sum,p)=>sum+p.probability,0),.6);
  const medical=treePaths(probabilityTree(43)!.root);near(medical.filter(p=>p.labels.at(-1)==="T").reduce((s,p)=>s+p.probability,0),.1255);
});
test("calcul binomial comparé à une récurrence indépendante, compléments et seuils",()=>{
  for(const n of[2,3,4,5,6,8,10,20,35,50,100])for(const p of[0,.01,.1,.25,.33,.36,.49,.52,.88,1]){
    let distribution=[1];
    for(let i=0;i<n;i++){const next=Array(distribution.length+1).fill(0);distribution.forEach((v,k)=>{next[k]+=v*(1-p);next[k+1]+=v*p;});distribution=next;}
    distribution.forEach((v,k)=>near(binomialProbability(n,k,p),v,3e-10));
    near(distribution.reduce((s,x)=>s+x,0),1);
  }
  near(binomialProbability(20,3,.36),.0269694389203372);near([0,1,2].reduce((s,k)=>s+binomialProbability(20,k,.36),0),.00961924916012162);
  near(binomialProbability(5,2,.52),.299040768);near(binomialProbability(50,5,.01),.000134792436045269);
  assert.ok(1-.9**43<.99);assert.ok(1-.9**44>.99);
  assert.match(data(29),/au moins deux/);assert.match(data(31),/0,33/);assert.match(data(32),/1-\(0,12\)/);
  const roots=[(1-Math.sqrt(.4))/2,(1+Math.sqrt(.4))/2];roots.forEach(p=>near(2*p*(1-p),.3));assert.deepEqual(roots.map(p=>Number(p.toFixed(2))),[.18,.82]);
  [.1,.9].forEach(p=>near(Math.sqrt(25*p*(1-p)),1.5));
});
test("ex45 : deux paires sans remise et dix répétitions avec remise des paires",()=>{
  const pairs=(urn:string[])=>{const a:number[]=[];for(let i=0;i<urn.length;i++)for(let j=i+1;j<urn.length;j++)a.push(Number(urn[i]==="B")+Number(urn[j]==="B"));return a;};
  const u=pairs(["B","B","B","N","N"]),v=pairs(["B","B","N","N","N"]),counts=Array(5).fill(0);
  for(const a of u)for(const b of v)counts[a+b]++;
  assert.deepEqual(counts,[3,24,46,24,3]);const stats=finiteLawParameters([0,1,2,3,4],counts.map(x=>x/100));near(stats.expectation,2);
  near(600*stats.expectation-1500,-300);near((u.filter(x=>x===1).length/10)*(v.filter(x=>x===1).length/10)/.46,18/23);
  near(1-.7**10-10*.3*.7**9,.8506916541);
});
test("ex46 : composition restaurée, gain net et seuil25 vérifiés sur n1à40",()=>{
  for(let n=1;n<=40;n++){
    const b=n/(n+3),black=3/(n+3),restore=b*3/4+black*1/2,oneWhite=black*1/2,threeWhite=b/4;
    near(restore,3*(n+2)/(4*(n+3)));near(oneWhite,3/(2*(n+3)));near(restore+oneWhite+threeWhite,1);
    const mean=(n-20)*restore+(2*n-20)*oneWhite-20*threeWhite;
    near(mean,(n-24)*(3*n+10)/(4*(n+3)));
    assert.equal(mean>1e-10,n>=25);if(n===24)near(mean,0);
    const tree=treePaths(probabilityTree(46,n)!.root);near(tree.reduce((s,p)=>s+p.probability,0),1);
  }
  assert.throws(()=>probabilityTree(46,0));assert.match(find(46).questions!.at(-1)!.explanation,/n\\ge25/);
});
test("ex47/49/51/52 : temps moyen, lots cohérents et décisions sans promesse",()=>{
  near((1200/.4)/20,150);assert.match(data(47),/150/);assert.match(data(47),/pas une durée garantie/);
  const a=(1/125-(49/50)/490)*50,r=(13/500-(49/50)/70)*50,b=1-a-r;
  near(a,.3);near(r,.6);near(b,.1);
  const gains=new Map<number,number>();for(const path of treePaths(probabilityTree(49)!.root)){
    const gain=path.labels[0]==="G"?100000:0,lot=path.labels[1]==="A"?100000:path.labels[1]==="B"?200000:0,net=gain+lot-10000;
    gains.set(net,(gains.get(net)??0)+path.probability);
  }
  near(gains.get(-10000)!,241/250);near(gains.get(90000)!,13/500);near(gains.get(190000)!,1/125);near(gains.get(290000)!,1/500);
  near([...gains].reduce((s,[gain,p])=>s+gain*p,0),-5200);
  const mean=400*(.93*(290000-160000)+.07*(150000-160000));near(mean,48080000);assert.ok(mean>45000000);
  near(binomialProbability(3,2,.5),3/8);near(binomialProbability(4,3,.5)+binomialProbability(4,4,.5),5/16);
  assert.match(data(51),/pas une garantie/);assert.match(data(52),/points de pourcentage/);
});
test("brouillons isolés et contenu commun C/D, aucun panneau ni score serveur inventé",async()=>{
  assert.deepEqual(await loadExerciseCollection("terminale-c","mathematics",bank.lessonKey),bank);
  assert.deepEqual((await loadExerciseCollection("terminale-d","mathematics","terminale-d-math-l02-probability"))?.sections,bank.sections);
  assert.equal(await loadExerciseCollection("terminale-c","physics-chemistry",bank.lessonKey),null);
  const e=find(2),q=e.questions![1],draft=restoreExerciseDraft(JSON.stringify({answers:{[q.id]:"4/5",unknown:"x"},reasoning:"Mon arbre",submitted:true,correctionOpen:true,score:20}),e);
  assert.equal(draft.answers[q.id],"4/5");assert.equal(draft.reasoning,"Mon arbre");assert.equal("correctionOpen" in draft,false);assert.equal("score" in draft,false);
  assert.notEqual(exerciseDraftKey("a","v1",e.id),exerciseDraftKey("b","v1",e.id));assert.notEqual(exerciseDraftKey("a","v1",e.id),exerciseDraftKey("a","v2",e.id));
  const {source,...visible}=bank;assert.ok(source.editorialNotes?.length);assert.doesNotMatch(JSON.stringify(visible),/coquille|Solution commentée|Excellence rétablit/i);
});
