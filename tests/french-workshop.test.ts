import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {frenchCards,frenchPracticeItems as items,frenchQuestionExplanation,frenchQuestions as questions,frenchSections,frenchStorageKey} from "../apps/web/src/data/frenchWorkshop/bank";
import {createMemorySession,emptyMemoryState,memoryAnswerCorrect,memoryConsolidated,memoryDay,memoryFingerprint,normalizeMemoryAnswer,restoreMemoryState,reviewMemoryItem,submitMemoryAnswer} from "../apps/web/src/features/philosophy/memoryEngine";
import type {MemoryReview,MemoryState} from "../apps/web/src/features/philosophy/memoryModel";
const now=Date.UTC(2026,9,27,12);
const source=(path:string)=>readFileSync(new URL("../apps/web/src/"+path,import.meta.url),"utf8");
const session=(section="all",count=10)=>createMemorySession(items,{},questions,section,"notion",count,"french-seed",now)!;

test("deux rubriques réellement remplies : 12 figures, 14 repères d’argumentation, 110 variantes",()=>{
 assert.deepEqual(frenchSections.map(s=>s.id),["figures","argumentation"]);
 assert.equal(frenchCards.length,26);assert.equal(frenchCards.filter(c=>c.section==="figures").length,12);assert.equal(frenchCards.filter(c=>c.section==="argumentation").length,14);
 assert.equal(questions.length,110);assert.equal(items.length,26);assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
 assert.equal(new Set(items.map(i=>i.id)).size,items.length);
});
test("chaque repère possède une définition, deux exemples distincts et des explications concrètes",()=>{
 for(const card of frenchCards){
  assert.ok(card.definition.length>30);assert.equal(card.distractors.length,3);assert.ok(card.tip.length>50);
  assert.notEqual(card.identify.text,card.interpret.text);assert.ok(card.identify.text.length>35);
  assert.ok(card.identify.explanation.length>75);assert.ok(card.interpret.explanation.length>75);
  assert.ok(!("author" in card),"les exemples originaux ne sont pas de fausses citations d’auteurs");
 }
});
test("les références pédagogiques sont HTTPS, nommées et séparées des exemples originaux",()=>{
 for(const card of frenchCards){
  const url=new URL(card.reference.url);assert.equal(url.protocol,"https:");assert.equal(url.username,"");assert.equal(url.password,"");
  assert.ok(card.reference.publisher.length>8);assert.ok(card.reference.title.length>5);assert.doesNotMatch(url.href,/token=|key=|javascript:/);
 }
});
test("tous les QCM ont quatre choix distincts et une seule réponse attendue",()=>{
 for(const q of questions.filter(q=>q.options)){
  assert.equal(q.options!.length,4,q.id);assert.equal(new Set(q.options!.map(normalizeMemoryAnswer)).size,4,q.id);
  for(const option of q.options!)assert.equal(memoryAnswerCorrect(q,[option]),option===q.expected[0],q.id);
 }
});
test("cinq formats effectifs sans question de citation ou d’ouvrage hors sujet",()=>{
 assert.deepEqual(new Set(questions.map(q=>q.format)),new Set(["recognition","meaning","cloze","definition","completion"]));
 for(const q of questions){
  assert.ok(items.some(i=>i.id===q.itemId));assert.ok(frenchQuestionExplanation(q).length>50);
  assert.ok(memoryAnswerCorrect(q,q.expected));assert.equal(memoryAnswerCorrect(q,[]),false);
 }
 assert.ok(questions.filter(q=>q.format==="cloze").every(q=>!q.options&&q.expected.length===1));
});
test("les phrases à trous acceptent plusieurs connecteurs réellement adaptés, sans confondre cause et conséquence",()=>{
 const q=questions.find(q=>q.id==="fr-but:completion")!;
 for(const answer of ["pour","afin de","de manière à","dans le but de","EN VUE DE"])assert.equal(memoryAnswerCorrect(q,[answer]),true,answer);
 for(const answer of ["parce que","car","donc",""])assert.equal(memoryAnswerCorrect(q,[answer]),false,answer);
 const consequence=questions.find(q=>q.id==="fr-consequence:completion")!;
 assert.equal(memoryAnswerCorrect(consequence,["par conséquent"]),true);assert.equal(memoryAnswerCorrect(consequence,["parce que"]),false);
 const addition=questions.find(q=>q.id==="fr-addition:completion")!;assert.equal(memoryAnswerCorrect(addition,["en outre"]),true);
});
test("les six phrases lacunaires restent complètes autour de leur champ",()=>{
 const completions=questions.filter(q=>q.format==="completion");assert.equal(completions.length,6);
 for(const q of completions){assert.ok(q.prefix&&q.suffix);assert.ok((q.prefix+q.expected[0]+q.suffix).endsWith("."));assert.ok(q.acceptedAnswers!.length>=2);}
});
test("accents, casse et variantes de termes prévues sont acceptés, mais pas une interprétation libre arbitraire",()=>{
 assert.equal(memoryAnswerCorrect(questions.find(q=>q.id==="fr-metaphore:cloze")!,["METAPHORE"]),true);
 assert.equal(memoryAnswerCorrect(questions.find(q=>q.id==="fr-metaphore:cloze")!,["une métaphore"]),true);
 assert.equal(memoryAnswerCorrect(questions.find(q=>q.id==="fr-metaphore:cloze")!,["le métaphore"]),false);
 assert.equal(memoryAnswerCorrect(questions.find(q=>q.id==="fr-oxymore:cloze")!,["un oxymore"]),true);
 assert.equal(memoryAnswerCorrect(questions.find(q=>q.id==="fr-oxymore:cloze")!,["oxymoron"]),true);
 assert.equal(memoryAnswerCorrect(questions.find(q=>q.id==="fr-anaphore:cloze")!,["anaphore rhétorique"]),true);
 assert.equal(memoryAnswerCorrect(questions.find(q=>q.id==="fr-metaphore:cloze")!,["comparaison"]),false);
 assert.equal(memoryAnswerCorrect(questions.find(q=>q.id==="fr-metaphore:cloze")!,["une longue analyse du texte"]),false);
});
test("repères délicats : contexte de litote, gradation décroissante, métonymie et limites d’un exemple",()=>{
 const card=(id:string)=>frenchCards.find(c=>c.id===id)!;
 assert.match(card("fr-litote").identify.text,/19\/20/);assert.match(card("fr-litote").tip,/contexte|négative/);
 assert.match(card("fr-gradation").definition,/diminue/);assert.match(card("fr-gradation").interpret.answer,/décroissante/);
 assert.match(card("fr-metonymie").tip,/auteur et œuvre/);assert.match(card("fr-exemple").tip,/isolé|pas toujours/);
 assert.match(card("fr-but").definition,/sans garantir/);assert.match(card("fr-persuader").tip,/pas forcément mentir/);
 assert.match(card("fr-opposition").identify.explanation,/pas principalement/);
});
test("les séances restent dans la rubrique choisie, sans répéter immédiatement un même repère",()=>{
 for(const section of frenchSections){
  const s=session(section.id,20),ids=s.queue.map(id=>questions.find(q=>q.id===id)!.itemId);
  assert.ok(ids.every(id=>frenchCards.find(c=>c.id===id)!.section===section.id));
  for(let i=1;i<ids.length;i++)assert.ok(!ids.slice(Math.max(0,i-3),i).includes(ids[i]));
 }
});
test("le moteur réutilisé visite tous les formats déclarés, y compris les connecteurs",()=>{
 const item=items.find(i=>i.id==="fr-but")!;
 for(let attempts=0;attempts<5;attempts++){
  const review={...reviewMemoryItem(item,undefined,"recognition",true,false,now),attempts};
  const s=createMemorySession(items,{[item.id]:review},questions,"argumentation","errors",5,"seed",now,[item.id])!;
  const expected=item.formats![attempts];assert.equal(questions.find(q=>q.id===s.queue[0])!.format,expected);
 }
});
test("validation atomique et reprise d’une erreur avec un autre format après trois questions",()=>{
 const state:MemoryState={...emptyMemoryState(),session:session()};const before=questions.find(q=>q.id===state.session!.queue[0])!;
 const next=submitMemoryAnswer(state,items,questions,[],now);const repeat=questions.find(q=>q.id===next.session!.queue[4])!;
 assert.equal(repeat.itemId,before.itemId);assert.notEqual(repeat.format,before.format);
 assert.equal(next.session!.index,0);assert.equal(next.reviews[before.itemId].attempts,1);
 assert.equal(submitMemoryAnswer(next,items,questions,[],now),next);
});
test("retenir en français exige trois jours et des preuves de compréhension ET de rappel sans indice",()=>{
 const item=items[0];let review:MemoryReview|undefined;
 for(let day=0;day<3;day++)review=reviewMemoryItem(item,review,"recognition",true,false,now+day*memoryDay);
 assert.equal(memoryConsolidated(item,review),false);
 review=reviewMemoryItem(item,review,"meaning",true,false,now+3*memoryDay);assert.equal(memoryConsolidated(item,review),false);
 review=reviewMemoryItem(item,review,"cloze",true,false,now+4*memoryDay);assert.equal(memoryConsolidated(item,review),true);
 review=reviewMemoryItem(item,review,"cloze",true,true,now+5*memoryDay);assert.equal(memoryConsolidated(item,review),false);assert.equal(review.box,0);
});
test("les révisions dues ne sont pas inventées et la séance erreurs ne prend que ses cartes",()=>{
 const reviews=Object.fromEntries(items.map(item=>[item.id,reviewMemoryItem(item,undefined,"meaning",true,false,now)]));
 assert.equal(createMemorySession(items,reviews,questions,"all","daily",10,"seed",now),null);
 const s=createMemorySession(items,{},questions,"all","errors",5,"seed",now,[items[1].id])!;
 assert.ok(s.queue.every(id=>questions.find(q=>q.id===id)!.itemId===items[1].id));
});
test("F5 conserve brouillon, réponses et progression, mais aucune note stockée ne fait autorité",()=>{
 const state:MemoryState={...emptyMemoryState(),session:{...session(),draft:["métaphore"]}};
 const raw=JSON.stringify(state);assert.deepEqual(restoreMemoryState(raw,items,questions,now),state);
 const validated=submitMemoryAnswer(state,items,questions,[],now);assert.deepEqual(restoreMemoryState(JSON.stringify({...validated,score:20}),items,questions,now),validated);
});
test("stockage séparé de la philo et séparé par compte et classe",()=>{
 assert.notEqual(frenchStorageKey("alice","terminale-c"),frenchStorageKey("bob","terminale-c"));
 assert.notEqual(frenchStorageKey("alice","terminale-c"),frenchStorageKey("alice","terminale-d"));
 assert.notEqual(frenchStorageKey("a:b","c"),frenchStorageKey("a","b:c"));
 assert.match(frenchStorageKey("alice","terminale-c"),/^excellence-french-workshop:/);
 assert.doesNotMatch(frenchStorageKey("alice","terminale-c"),/excellence-philo-memory/);
});
test("une correction de question ou d’exemple invalide la séance et les révisions de la carte concernée",()=>{
 const item=items[0],state={...emptyMemoryState(),session:session(),reviews:{[item.id]:reviewMemoryItem(item,undefined,"meaning",true,false,now)}};
 const changedQuestions=questions.map((q,i)=>i===0?{...q,prompt:"Question corrigée"}:q);
 assert.equal(restoreMemoryState(JSON.stringify(state),items,changedQuestions,now).session,null);
 const changedItems=items.map((i,index)=>index===0?{...i,reviewSignature:i.reviewSignature+" corrigé"}:i);
 assert.notEqual(memoryFingerprint(changedItems[0]),memoryFingerprint(item));
 assert.equal(restoreMemoryState(JSON.stringify(state),changedItems,questions,now).reviews[item.id],undefined);
});
test("pas de résultat serveur, nouvelle récompense ou catalogue recréé pour cet atelier",()=>{
 const code=source("features/french/FrenchWorkshopPage.tsx")+source("features/memory/useMemoryStore.ts");
 assert.doesNotMatch(code,/fetch\(|apiClient|supabase|submit_level_attempt|\/progress\/attempt/);
 assert.match(code,/Révisions enregistrées pour ton compte sur cet appareil/);assert.match(code,/<del>/);
 assert.match(source("data/learningPathMetrics.ts"),/10_326/);
 assert.match(source("features/arena/ArenaScreen.tsx"),/lazy\(\(\) => import\("\.\.\/french\/FrenchWorkshopPage"\)/);
});
test("le stockage ne peut pas recopier un état du compte précédent quand la clé change",()=>{
 const hook=source("features/memory/useMemoryStore.ts");
 assert.match(hook,/if\(snapshot.key!==key\)return/);assert.match(hook,/previous.key===key\?previous.value:initial/);
 assert.match(hook,/event.key!==key&&event.key!==null/);
});
