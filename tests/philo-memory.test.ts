import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {philoMemoryItems as items,philoNotions as notions} from "../apps/web/src/data/philosophyMemory/bank";
import {createMemoryQuestions,createMemorySession,emptyMemoryState,memoryAnswerCorrect,memoryBankSignature,memoryConsolidated,memoryDay,memoryFingerprint,memoryShuffle,memoryStorageKey,normalizeMemoryAnswer,restoreMemoryState,reviewMemoryItem,submitMemoryAnswer} from "../apps/web/src/features/philosophy/memoryEngine";
import type {MemoryReview,MemoryState,PhiloQuotation} from "../apps/web/src/features/philosophy/memoryModel";

const questions=createMemoryQuestions(items),quotes=items.filter(i=>i.kind==="quote"),definitions=items.filter(i=>i.kind==="definition");
const now=Date.UTC(2026,9,24,12);
const source=(path:string)=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const makeSession=(notion="all",count=10)=>createMemorySession(items,{},questions,notion,"notion",count,"test-seed",now)!;
const reviewed=(item=items[0],format="meaning" as const)=>reviewMemoryItem(item,undefined,format,true,false,now);

test("banque distincte de la progression : 16 notions, 26 citations, 34 définitions et 224 variantes",()=>{
  assert.equal(notions.length,16);assert.equal(quotes.length,26);assert.equal(definitions.length,34);assert.equal(questions.length,224);
  assert.equal(new Set(items.map(i=>i.id)).size,items.length);assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
  for(const notion of notions){
    assert.ok(quotes.filter(q=>q.notions.includes(notion.id)).length>=2,notion.id);
    assert.ok(definitions.filter(q=>q.notions.includes(notion.id)).length>=2,notion.id);
    assert.match(notion.coursePathId,/^terminale-philo-l[3-9]|^terminale-philo-l10/);
  }
  for(const item of items){assert.ok(item.notions.every(id=>notions.some(n=>n.id===id)));assert.ok(item.explanation.length>50);}
});
test("chaque citation conserve auteur, ouvrage, emplacement, édition et lien HTTPS sans secret",()=>{
  for(const item of quotes){
    for(const field of [item.text,item.author,item.work,item.location,item.edition,item.application])assert.ok(field.length>4,item.id);
    const url=new URL(item.url);assert.equal(url.protocol,"https:");assert.equal(url.username,"");assert.equal(url.password,"");
    assert.doesNotMatch(url.href,/api_key|token=|javascript:/i);
  }
});
test("les variantes reprennent exactement le texte de l’édition, sans ajout ni coupure silencieuse",()=>{
  for(const item of quotes){
    const cloze=questions.find(q=>q.id===item.id+":cloze")!;
    assert.equal(cloze.parts!.map((p,i)=>p+(cloze.expected[i]??"")).join(""),item.text);
    const completion=questions.find(q=>q.id===item.id+":completion")!;
    assert.equal(completion.prefix+" "+completion.expected[0],item.text);
    const order=questions.find(q=>q.id===item.id+":order")!;
    assert.equal(order.expected.join(" "),item.text);assert.ok(order.expected.length>=2);
    assert.equal(new Set(order.chunks).size,order.chunks!.length);
  }
});
test("les trous ciblent des mots entiers : raison n’efface pas le début de raisons",()=>{
  const item=quotes.find(q=>q.id==="quote-pascal-coeur")!;
  const cloze=questions.find(q=>q.id===item.id+":cloze")!;
  assert.ok(cloze.parts!.some(part=>part.includes("raisons")));
  assert.throws(()=>createMemoryQuestions([{...item,gaps:["rais"]}]),/partiel/);
});
test("chaque QCM possède quatre propositions distinctes et une réponse unique",()=>{
  for(const q of questions.filter(q=>q.options)){
    assert.equal(q.options!.length,4,q.id);
    assert.equal(new Set(q.options!.map(normalizeMemoryAnswer)).size,4,q.id);
    assert.equal(q.options!.filter(v=>v===q.expected[0]).length,1,q.id);
    assert.equal(q.expected.length,1);
  }
});
test("les définitions sont des formulations pédagogiques originales, pas des citations faussement attribuées",()=>{
  for(const item of definitions){assert.ok(item.example.length>30);assert.equal("author" in item,false);assert.equal(item.distractors.length,3);}
});
test("les pièges d’attribution et les nuances essentielles sont conservés",()=>{
  assert.match(quotes.find(q=>q.author==="Sigmund Freud")!.location,/Une difficulté de la psychanalyse/);
  assert.match(quotes.find(q=>q.id==="quote-descartes-nature")!.text,/^comme /);
  assert.match(quotes.find(q=>q.id==="quote-marx-opium")?.text??quotes.find(q=>q.text.includes("opium"))!.text,/\[…\]/);
  assert.match(quotes.find(q=>q.id==="quote-pascal-pyrenees")!.explanation,/justice|coutumes/);
});
test("comparaison tolérante aux accents, majuscules, ligatures et ponctuation, mais pas aux mots inventés",()=>{
  assert.equal(normalizeMemoryAnswer("L’ÂME, c’est l’ŒUVRE !"),normalizeMemoryAnswer("l'ame c'est l'oeuvre"));
  for(const q of questions)assert.equal(memoryAnswerCorrect(q,q.expected),true,q.id);
  assert.equal(memoryAnswerCorrect(questions[0],[]),false);
  assert.equal(memoryAnswerCorrect(questions[0],[""]),false);
  const order=questions.find(q=>q.format==="order")!;
  assert.equal(memoryAnswerCorrect(order,[...order.expected].reverse()),false);
  assert.equal(memoryAnswerCorrect(order,[order.expected.join(" ")]),false);
});
test("ordre aléatoire déterministe sans mutation, positions variées sur les séances",()=>{
  const values=[1,2,3,4],copy=[...values];assert.deepEqual(memoryShuffle(values,"a"),memoryShuffle(values,"a"));assert.deepEqual(values,copy);
  const positions=new Set(Array.from({length:50},(_,i)=>memoryShuffle(values,"seed"+i).indexOf(1)));
  assert.equal(positions.size,4);
});
test("séances filtrées par notion, bornées et reproductibles, huit formats au fil des répétitions",()=>{
  assert.deepEqual(makeSession(),makeSession());
  for(const count of [-4,5,10,15,20,30,NaN]){
    const s=makeSession("conscience",count);assert.ok(s.queue.length>=5&&s.queue.length<=20);
    assert.ok(s.queue.every(id=>items.find(i=>i.id===questions.find(q=>q.id===id)!.itemId)!.notions.includes("conscience")));
  }
  assert.equal(createMemorySession(items,{},questions,"absent","notion",10,"seed",now),null);
  for(let attempts=0;attempts<6;attempts++){
    const review={...reviewed(),attempts};const s=createMemorySession(items,{[items[0].id]:review},questions,"conscience","notion",20,"seed",now)!;
    assert.ok(s.queue.some(id=>id===items[0].id+":"+["meaning","cloze","author","completion","work","order"][attempts]));
  }
});
test("pas de répétition immédiate avec une banque normale et priorité aux cartes dues",()=>{
  const s=makeSession();const itemIds=s.queue.map(id=>questions.find(q=>q.id===id)!.itemId);
  for(let index=1;index<itemIds.length;index++)assert.ok(!itemIds.slice(Math.max(0,index-3),index).includes(itemIds[index]));
  const first=items[0],review={...reviewed(),dueAt:now-1};
  const daily=createMemorySession(items,{[first.id]:review},questions,"all","daily",10,"seed",now)!;
  assert.equal(questions.find(q=>q.id===daily.queue[0])!.itemId,first.id);
});
test("une carte consolidée exige trois jours distincts, rappel et compréhension, jamais un seul QCM",()=>{
  const item=quotes[0];let r:MemoryReview|undefined;
  r=reviewMemoryItem(item,r,"meaning",true,false,now);
  for(let i=0;i<10;i++)r=reviewMemoryItem(item,r,"cloze",true,false,now+i*1000);
  assert.equal(r.box,1);assert.equal(memoryConsolidated(item,r),false);
  r=reviewMemoryItem(item,r,"author",true,false,now+memoryDay);assert.equal(memoryConsolidated(item,r),false);
  r=reviewMemoryItem(item,r,"cloze",true,false,now+4*memoryDay);assert.equal(memoryConsolidated(item,r),true);
  const failed=reviewMemoryItem(item,r,"meaning",false,false,now+5*memoryDay);
  assert.equal(failed.box,0);assert.deepEqual(failed.days,[]);assert.equal(failed.recall,false);assert.equal(failed.understood,false);
  assert.equal(failed.dueAt,now+5*memoryDay+600_000);assert.equal(memoryConsolidated(item,failed),false);
});
test("un indice ne consolide pas et déclenche une reprise, même avec une réponse juste",()=>{
  const item=quotes[0],r=reviewMemoryItem(item,undefined,"cloze",true,true,now);
  assert.equal(r.successes,0);assert.equal(r.lapses,1);assert.equal(r.box,0);assert.equal(r.recall,false);
});
test("une erreur revient après trois questions intercalées avec un autre format",()=>{
  const state:MemoryState={...emptyMemoryState(),session:makeSession()};
  const q=questions.find(q=>q.id===state.session!.queue[0])!;
  const next=submitMemoryAnswer(state,items,questions,[],now);
  const repeated=questions.find(q=>q.id===next.session!.queue[4])!;
  assert.equal(repeated.itemId,q.itemId);assert.notEqual(repeated.format,q.format);
  assert.equal(next.session!.queue.length,state.session!.queue.length);assert.equal(state.session!.responses.length,0);
});
test("validation atomique : ni double comptage ni ouverture du prochain exercice",()=>{
  const state:MemoryState={...emptyMemoryState(),session:makeSession()};
  const q=questions.find(q=>q.id===state.session!.queue[0])!;
  const next=submitMemoryAnswer(state,items,questions,q.expected,now);
  assert.equal(next.session!.index,0);assert.equal(next.session!.responses.length,1);
  assert.equal(next.reviews[q.itemId].attempts,1);assert.equal(submitMemoryAnswer(next,items,questions,[],now+1),next);
});
test("la séance erreurs ne contient que les cartes à reprendre",()=>{
  const id=quotes[0].id,s=createMemorySession(items,{},questions,"all","errors",5,"seed",now,[id])!;
  assert.ok(s.queue.every(id=>questions.find(q=>q.id===id)!.itemId===quotes[0].id));
  assert.equal(createMemorySession(items,{},questions,"all","errors",5,"seed",now,[]),null);
});
test("aucune révision artificiellement due : le mode du jour ignore les cartes futures",()=>{
  const reviews=Object.fromEntries(items.map(i=>[i.id,reviewed(i)]));
  assert.equal(createMemorySession(items,reviews,questions,"all","daily",10,"seed",now),null);
  assert.ok(createMemorySession(items,reviews,questions,"all","notion",10,"seed",now));
});
test("brouillon et validation résistent à F5 avec réponses et progression cohérentes",()=>{
  const session=makeSession();session.draft=["brouillon"];
  const initial={...emptyMemoryState(),session};
  assert.deepEqual(restoreMemoryState(JSON.stringify(initial),items,questions,now),initial);
  const validated=submitMemoryAnswer(initial,items,questions,[],now);
  assert.deepEqual(restoreMemoryState(JSON.stringify(validated),items,questions,now),validated);
});
test("stockage séparé par utilisateur ET classe, encodé sans collision de séparateurs",()=>{
  assert.notEqual(memoryStorageKey("alice","terminale-c"),memoryStorageKey("bob","terminale-c"));
  assert.notEqual(memoryStorageKey("alice","terminale-c"),memoryStorageKey("alice","terminale-d"));
  assert.notEqual(memoryStorageKey("a:b","c"),memoryStorageKey("a","b:c"));
});
test("stockage absent, corrompu, trop grand ou incompatible ignoré sans bloquer le quiz",()=>{
  for(const raw of [null,"{","null",JSON.stringify({version:7}),"x".repeat(120001)])assert.deepEqual(restoreMemoryState(raw,items,questions,now),emptyMemoryState());
  for(const patch of [{attempts:1.5},{box:9},{successes:8},{dueAt:Infinity},{days:[-1]}]){
    const raw=JSON.stringify({version:1,reviews:{[items[0].id]:{...reviewed(),...patch}},session:null});
    assert.equal(restoreMemoryState(raw,items,questions,now).reviews[items[0].id],undefined);
  }
});
test("aucune note stockée ne fait autorité ; session incompatible abandonnée sans perdre les autres révisions",()=>{
  const s=makeSession(),valid=submitMemoryAnswer({...emptyMemoryState(),session:s},items,questions,[],now);
  const raw=JSON.stringify({...valid,score:100,session:{...valid.session,score:100}});
  const restored=restoreMemoryState(raw,items,questions,now);assert.equal("score" in restored,false);assert.equal("score" in restored.session!,false);
  const changed=questions.map((q,i)=>i===0?{...q,prompt:q.prompt+" révisée"}:q);
  assert.notEqual(memoryBankSignature(questions),memoryBankSignature(changed));
  const revised=restoreMemoryState(raw,items,changed,now);assert.equal(revised.session,null);assert.ok(Object.keys(revised.reviews).length);
  const changedItems=items.map((i,index)=>index===0?{...i,explanation:i.explanation+" ajustée"}:i);
  assert.equal(memoryFingerprint(changedItems[0]),memoryFingerprint(items[0]));
  const revisedQuote={...quotes[0],text:quotes[0].text+" version corrigée"} as PhiloQuotation;
  assert.equal(memoryConsolidated(revisedQuote,reviewed()),false);
  assert.notEqual(memoryFingerprint({...quotes[0],meaning:"Interprétation corrigée"}),memoryFingerprint(quotes[0]));
});
test("réponses ou index incohérents ne sont jamais restaurés comme une séance valide",()=>{
  for(const patch of [{index:99},{queue:["inconnu"]},{draft:[42]},{responses:[{questionId:"faux",answer:[],at:now}]}]){
    const state=restoreMemoryState(JSON.stringify({...emptyMemoryState(),session:{...makeSession(),...patch}}),items,questions,now);
    if("draft" in patch)assert.deepEqual(state.session!.draft,[]);else assert.equal(state.session,null);
  }
});
test("le lot mémoire ne modifie ni compteur, ni XP, ni API et reste chargé à la demande",()=>{
  const engine=source("apps/web/src/features/philosophy/memoryEngine.ts"),page=source("apps/web/src/features/philosophy/PhiloMemoryPage.tsx");
  assert.doesNotMatch(engine+page,/fetch\(|\/progress\/attempt|apiClient|supabase/);
  const arena=source("apps/web/src/features/arena/ArenaScreen.tsx");assert.match(arena,/lazy\(\(\) => import\("\.\.\/philosophy\/PhiloMemoryPage"\)/);
  assert.match(arena,/key=\{`\$\{userId\}:\$\{level.id\}`\}/);
  assert.match(page,/noopener noreferrer/);assert.match(page,/Révisions enregistrées pour ton compte sur cet appareil/);
  assert.match(page,/Reprendre mes erreurs/);assert.match(page,/<del>/);assert.match(page,/Pas de réponse/);
  assert.match(source("apps/web/src/data/learningPathMetrics.ts"),/10_326/);
});
