import assert from "node:assert/strict";
import test from "node:test";
import {createRequire} from "node:module";
import {readFileSync} from "node:fs";
import {learningPaths} from "../apps/web/src/data/learningPaths";
import {curriculumLessonTitles} from "../apps/web/src/data/curriculumCatalog";
import {loadLearningPathsForSubject} from "../apps/web/src/data/learningPathLoader";
import {AVAILABLE_EXERCISES} from "../apps/web/src/data/learningPathMetrics";
import {getPathLessons} from "../apps/web/src/features/paths/pathLessons";
import {appRouteUrl,readAppRoute} from "../apps/web/src/routing/appRoute";
import {buildPhilosophyReader,choice,exercise,short,writing,type PhilosophyDocumentSeed,type PhilosophyExercise} from "../apps/web/src/data/philosophyDocuments/model";
import {philosophyDocumentIds,loadPhilosophyDocument} from "../apps/web/src/data/philosophyDocuments/registry";
import {philosophyAnswerStatus,philosophyAssessmentKey,philosophyExerciseScore,normalizePhilosophyAnswer,restorePhilosophyAssessment,serializePhilosophyAssessment} from "../apps/web/src/features/lesson/document/philosophyAssessmentDraft";
const require=createRequire(new URL("../apps/web/package.json",import.meta.url)),React=require("react");
(globalThis as {React?:unknown}).React=React;require.extensions[".css"]=()=>{};
const {renderToStaticMarkup}=require("react-dom/server"),{MarkdownContent}=require("./src/components/MarkdownContent"),{PhilosophyAssessment}=require("./src/features/lesson/document/PhilosophyAssessment");
const source=(name:string)=>readFileSync(new URL("../apps/web/src/"+name,import.meta.url),"utf8");
const seedsPromise=Promise.all(philosophyDocumentIds.map(loadPhilosophyDocument));
const pathFor=(seed:PhilosophyDocumentSeed)=>learningPaths.find(path=>path.id===seed.pathId)!;
const contents=(seed:PhilosophyDocumentSeed)=>[
 ...seed.sections.flatMap(s=>[s.title,...s.topics.flatMap(t=>[t.title,t.body,...t.examples?.flatMap(e=>[e.prompt,e.solution??"",...e.parts?.flatMap(p=>[p.label,p.prompt,p.solution])??[]])??[]])]),
 ...seed.essentials.flatMap(e=>[e.title,e.body]),...seed.exercises.flatMap(e=>[e.title,e.statement??"",...e.tasks.flatMap(t=>[t.prompt,...t.kind==="writing"?[t.model,...t.criteria]:t.kind==="choice"?[...t.options,t.explanation]:[...t.accepted,t.explanation]])]),
];
const sample=exercise("sample","Application",[1],[choice("single","Choisis.",["A","B","C"],1,"B est attendu."),choice("multi","Sélectionne.",["A","B","C"],[0,2],"A et C."),short("term","Le terme ?",["État","l’État"],"L’État."),writing("draft","Explique.","Un modèle raisonné.",["Une raison."])]);

test("10 documents issus de101 pages, sources et empreintes explicites",async()=>{
 const seeds=await seedsPromise;assert.equal(seeds.length,10);assert.equal(new Set(seeds.map(s=>s.pathId)).size,10);
 assert.equal(seeds.reduce((n,s)=>n+s.source.pageCount,0),101);
 for(const seed of seeds){assert.match(seed.source.sha256,/^[a-f0-9]{64}$/);assert.ok(seed.source.title.length>25);assert.ok(seed.source.editorialNotes.length>=3);}
});
test("35 rubriques,77 parties,53 applications et41 fiches réellement remplies",async()=>{
 const seeds=await seedsPromise;
 assert.deepEqual(seeds.reduce((a,s)=>({sections:a.sections+s.sections.length,topics:a.topics+s.sections.flatMap(s=>s.topics).length,exercises:a.exercises+s.exercises.length,essentials:a.essentials+s.essentials.length}),{sections:0,topics:0,exercises:0,essentials:0}),{sections:35,topics:77,exercises:53,essentials:41});
 for(const seed of seeds)for(const section of seed.sections){assert.ok(section.topics.length);for(const topic of section.topics){assert.ok(topic.body.length>250,topic.id);assert.equal(topic.optional,undefined);}}
});
test("10 cartes visibles et mêmes documents dans chaque série A/C/D",async()=>{
 for(const level of ["terminale-a","terminale-c","terminale-d"]){
  const bundle=await loadLearningPathsForSubject(level,"philosophy");assert.equal(bundle.length,10);
  for(const id of philosophyDocumentIds){
   const path=bundle.find(p=>p.id===id)!;assert.ok(path);
   assert.ok(curriculumLessonTitles.some(l=>l.levelId===level&&l.pathId===id&&l.published!==false),level+id);
   const seed=await loadPhilosophyDocument(id);assert.strictEqual(seed,await loadPhilosophyDocument(id));
   assert.ok(buildPhilosophyReader(seed,path).summary.levelIds.includes(level));
  }
 }
});
test("les60 ancres et fils de commentaires historiques sont conservés sans mutation",async()=>{
 for(const seed of await seedsPromise){
  const path=pathFor(seed),before=JSON.stringify(path),reader=buildPhilosophyReader(seed,path),lessons=getPathLessons(path),topics=reader.summary.sections.flatMap(s=>s.topics);
  assert.equal(lessons.length,6);assert.equal(Object.keys(reader.summary.legacyAnchors).length,6);
  assert.deepEqual(new Set(topics.flatMap(t=>t.legacyLessonIds??[])),new Set(lessons.map(l=>l.id)));
  for(const lesson of lessons)assert.ok(topics.some(t=>t.id===reader.summary.legacyAnchors[lesson.id]&&t.legacyLessonIds!.includes(lesson.id)));
  assert.equal(JSON.stringify(path),before);assert.equal(lessons.reduce((n,l)=>n+l.xp,0),10000);
 }
});
test("les289 questions historiques, XP et compteur canonique ne sont pas remplacés",async()=>{
 const paths=learningPaths.filter(p=>philosophyDocumentIds.includes(p.id));
 assert.equal(paths.reduce((n,p)=>n+getPathLessons(p).reduce((m,l)=>m+(l.questions?.length??1),0),0),289);
 assert.equal(AVAILABLE_EXERCISES,10326);
 assert.equal(learningPaths.reduce((n,p)=>n+getPathLessons(p).reduce((m,l)=>m+(l.questions?.length??1),0),0),AVAILABLE_EXERCISES);
 assert.doesNotMatch(source("data/philosophyDocuments/model.ts"),/fetch\(|supabase|\.xp\s*=/);
});
test("117 tâches dont67 choix,12 réponses courtes et38 rédactions sans note automatique",async()=>{
 const tasks=(await seedsPromise).flatMap(s=>s.exercises.flatMap(e=>e.tasks));assert.equal(tasks.length,117);
 assert.equal(tasks.filter(t=>t.kind==="choice").length,67);assert.equal(tasks.filter(t=>t.kind==="short").length,12);assert.equal(tasks.filter(t=>t.kind==="writing").length,38);
 for(const task of tasks){
  if(task.kind==="writing"){assert.ok(task.model.length>200);assert.ok(task.criteria.length>=2);assert.equal(philosophyAnswerStatus(task,"un raisonnement quelconque"),"writing");}
  else {assert.ok(task.explanation.length>45);if(task.kind==="choice"){assert.ok(task.options.length>=2);assert.ok(task.correct.length);assert.equal(new Set(task.correct).size,task.correct.length);assert.equal(new Set(task.options).size,task.options.length);assert.ok(task.correct.every(i=>Number.isInteger(i)&&i>=0&&i<task.options.length));}}
 }
});
test("identifiants uniques, pages dans le PDF et cartes reliées au résumé",async()=>{
 for(const seed of await seedsPromise){
  const topics=seed.sections.flatMap(s=>s.topics),ids=[...seed.sections.map(s=>s.id),...topics.map(t=>t.id),...seed.exercises.map(e=>e.id),...seed.exercises.flatMap(e=>e.tasks.map(t=>t.id))];
  assert.equal(new Set(ids).size,ids.length,seed.pathId);
  for(const item of [...topics,...seed.exercises])assert.ok(item.pages.length&&item.pages.every(p=>Number.isInteger(p)&&p>0&&p<=seed.source.pageCount));
  for(const essential of seed.essentials)assert.ok(topics.some(t=>t.id===essential.topic));
 }
});
test("UTF8 et rendu de tous les textes sans dollars ni balises dangereuses",async()=>{
 for(const seed of await seedsPromise)for(const text of contents(seed)){
  assert.doesNotMatch(text,/�|\$|undefined|<script|javascript:/,seed.pathId);
  const html=renderToStaticMarkup(React.createElement(MarkdownContent,{markdown:text}));assert.doesNotMatch(html,/katex-error|<script|undefined/);
 }
});
test("les modèles expliquent chaque étape et ne révèlent pas un paquet de solutions",async()=>{
 const seeds=await seedsPromise;
 for(const seed of seeds)for(const t of seed.sections.flatMap(s=>s.topics))for(const ex of t.examples??[]){
  assert.ok(ex.parts&&ex.parts.length>=2);for(const part of ex.parts!){assert.ok(part.label.length>0);assert.ok(part.prompt.length>5);assert.ok(part.solution.length>45);}
 }
 const ui=source("features/lesson/document/PhilosophyAssessment.tsx");
 assert.match(ui,/setValidated\(true\)/);assert.doesNotMatch(ui,/setOpen|localStorage\.clear|fetch\(/);
 assert.match(ui,/<DocumentCorrection>/);assert.match(ui,/key=\{\[userId,levelId,pathId,exercise.id\]/);
 assert.match(source("features/lesson/document/DocumentCorrection.tsx"),/useState\(false\)/);
});
test("SSR :53 corrections fermées, champs accessibles et aucun ancien niveau affiché",async()=>{
 for(const seed of await seedsPromise){
  const html=renderToStaticMarkup(React.createElement(PhilosophyAssessment,{exercises:seed.exercises,userId:"ssr",levelId:"terminale-c",pathId:seed.pathId}));
  assert.equal((html.match(/Voir la correction/g)??[]).length,seed.exercises.length);
  assert.doesNotMatch(html,/document-correction-panel|philosophy-score|Mission finale|Niveau [1-9]/);
  assert.match(html,/<fieldset/);assert.match(html,/<legend/);assert.match(html,/<label/);
 }
});
test("correctifs pédagogiques sensibles explicités dans le contenu, sans avis de coquille à l’élève",async()=>{
 const seeds=await seedsPromise,all=(part:string)=>contents(seeds.find(s=>s.pathId.includes(part))!).join(" ");
 assert.match(all("text-commentary"),/raisonnement/);assert.match(all("god-religion"),/autonomie/);
 assert.match(all("history-humanity"),/ironi|ironie/);assert.match(all("language-truth"),/langues des signes/i);
 assert.match(all("language-truth"),/prémisse fausse|prémisses fausses/);assert.match(all("scientific-knowledge"),/régression/);
 assert.match(all("scientific-knowledge"),/consentement/);assert.match(all("progress-happiness"),/Contribuer n’est pas suffire/);
 for(const seed of seeds)assert.doesNotMatch(contents(seed).join(" "),/coquille du support|erreur dans le PDF|Excellence rétablit/);
});
test("le lecteur est chargé à la demande avec reprise d’erreur et sans ancien cours gamifié",()=>{
 const ui=source("features/lesson/ContinuousCourseScreen.tsx"),loader=source("features/lesson/document/PhilosophyCourseDocument.tsx"),registry=source("data/philosophyDocuments/registry.ts");
 assert.match(ui,/lazy\(\(\) => import\("\.\/document\/PhilosophyCourseDocument"\)/);assert.match(ui,/philosophyDocumentIds.includes/);
 assert.match(loader,/active=false/);assert.match(loader,/Réessayer/);assert.match(loader,/assessmentContent/);assert.doesNotMatch(loader,/HistoricalCourseAssessment|LegacyContinuousCourse/);
 assert.equal((registry.match(/=>import\(/g)??[]).length,10);
});
test("une demande inconnue ou un raccord d’ancre invalide est refusé",async()=>{
 await assert.rejects(loadPhilosophyDocument("inconnu"),/indisponible/);
 const seed=(await seedsPromise)[0];assert.throws(()=>buildPhilosophyReader(seed,{...pathFor(seed),id:"autre"}),/hors parcours/);
 assert.throws(()=>buildPhilosophyReader({...seed,legacy:{}},pathFor(seed)),/Ancre/);
});
test("choix simples et multiples : ensembles exacts, ni doublon ni demi-point trompeur",()=>{
 const [single,multi]=sample.tasks;
 assert.equal(philosophyAnswerStatus(single,[1]),"correct");assert.equal(philosophyAnswerStatus(single,[0]),"incorrect");assert.equal(philosophyAnswerStatus(single,[]),"unanswered");
 assert.equal(philosophyAnswerStatus(multi,[2,0]),"correct");assert.equal(philosophyAnswerStatus(multi,[0]),"incorrect");assert.equal(philosophyAnswerStatus(multi,[0,0]),"incorrect");assert.equal(philosophyAnswerStatus(multi,[0,1,2]),"incorrect");
});
test("réponses courtes : accents, casse et apostrophes acceptés, pas les phrases arbitraires",()=>{
 const task=sample.tasks[2];assert.equal(normalizePhilosophyAnswer("  L’ÉTAT.  "),"l'etat");
 for(const answer of ["État","ETAT","l’etat","L'ÉTAT."])assert.equal(philosophyAnswerStatus(task,answer),"correct");
 assert.equal(philosophyAnswerStatus(task,"Etat et religion"),"incorrect");assert.equal(philosophyAnswerStatus(task,"  "),"unanswered");
});
test("la note d’entraînement exclut absolument les rédactions",()=>{
 assert.deepEqual(philosophyExerciseScore(sample,{single:[1],multi:[0,2],term:"etat",draft:"n’importe quoi"}),{total:3,correct:3,percent:100,score20:20});
 assert.deepEqual(philosophyExerciseScore(sample,{}),{total:3,correct:0,percent:0,score20:0});
 const onlyWriting:PhilosophyExercise={...sample,tasks:[sample.tasks[3]]};assert.equal(philosophyExerciseScore(onlyWriting,{draft:"oui"}),null);
});
test("brouillons séparés compte, classe, cours et activité, y compris les séparateurs",()=>{
 const base=philosophyAssessmentKey("u","terminale-c","p","e");
 for(const args of [["u2","terminale-c","p","e"],["u","terminale-d","p","e"],["u","terminale-c","p2","e"],["u","terminale-c","p","e2"]])assert.notEqual(philosophyAssessmentKey(...args as [string,string,string,string]),base);
 assert.notEqual(philosophyAssessmentKey("a:b","c","p","e"),philosophyAssessmentKey("a","b:c","p","e"));
});
test("restauration bornée, résistance aux données corrompues et changements d’énoncé",()=>{
 const answers={single:[1],multi:[2,0],term:"État",draft:"Mon argument"},serialized=serializePhilosophyAssessment(sample,answers);
 assert.deepEqual(restorePhilosophyAssessment(sample,serialized),{...answers,multi:[0,2]});
 for(const raw of [null,"bad",JSON.stringify({answers}),"x".repeat(200001)])assert.deepEqual(restorePhilosophyAssessment(sample,raw),{});
 const value=JSON.parse(serialized);value.answers={single:[999],multi:[0,0],term:"x".repeat(501),draft:"x".repeat(10001),intruder:"secret"};
 assert.deepEqual(restorePhilosophyAssessment(sample,JSON.stringify(value)),{});
 assert.deepEqual(restorePhilosophyAssessment({...sample,title:"Nouveau titre"},serialized),{});
});
test("seules les réponses sont persistées : aucun score ni correction ouverte restaurés",()=>{
 const value=JSON.parse(serializePhilosophyAssessment(sample,{draft:"Mon texte"}));
 assert.deepEqual(Object.keys(value).sort(),["answers","signature","version"]);
 value.score20=20;value.validated=true;value.open=true;
 assert.deepEqual(restorePhilosophyAssessment(sample,JSON.stringify(value)),{draft:"Mon texte"});
 assert.match(source("features/lesson/document/PhilosophyAssessment.tsx"),/useState\(false\)/);
});
test("feedback vert/rouge/bleu et police16px : contrats du lecteur",()=>{
 const ui=source("features/lesson/document/PhilosophyAssessment.tsx"),css=source("styles/philosophy-document.css");
 assert.match(ui,/<s>\{answerText/);assert.match(ui,/Pas de réponse/);assert.match(ui,/Réponse attendue/);assert.match(ui,/\/ 20/);
 assert.match(css,/font-size:16px;line-height:1.85/);assert.match(css,/philosophy-answer-expected\{color:#1758a0/);assert.match(css,/philosophy-answer-correct\{color:#28651e/);
 assert.match(ui,/sans note automatique/);assert.match(ui,/maxLength=\{10000\}/);
});
test("les trois vues de philosophie sont conservées dans l’URL et après F5",()=>{
 for(const [courseTab,view] of [["summary",null],["assessment","evaluation"],["essentials","essentiel"]] as const){
  const url=new URL(appRouteUrl({navigation:"paths",subjectId:"philosophy",pathId:philosophyDocumentIds[0],courseTab},"?__paths-preview=1&__level-preview=terminale-c"),"http://localhost");
  assert.equal(url.searchParams.get("vue"),view);assert.equal(url.searchParams.get("__level-preview"),"terminale-c");
  assert.equal(readAppRoute({pathname:url.pathname,search:url.search}).courseTab,courseTab==="summary"?undefined:courseTab);
 }
});
