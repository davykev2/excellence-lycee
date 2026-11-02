import assert from "node:assert/strict";
import {createRequire} from "node:module";
import {readFileSync} from "node:fs";
import test from "node:test";
import {learningPaths} from "../apps/web/src/data/learningPaths";
import {loadLearningPathsForSubject} from "../apps/web/src/data/learningPathLoader";
import {curriculumLessonTitles} from "../apps/web/src/data/curriculumCatalog";
import {createHumanitiesCourseSummary} from "../apps/web/src/data/courseDocuments/humanitiesCourseSummary";
import {humanitiesReadingText} from "../apps/web/src/data/courseDocuments/humanitiesSummaryEditorial";
import {humanitiesWritingStorageKey,restoreHumanitiesWriting,serializeHumanitiesWriting} from "../apps/web/src/features/lesson/document/humanitiesWritingDraft";
import {getPathLessons} from "../apps/web/src/features/paths/pathLessons";
import {AVAILABLE_EXERCISES} from "../apps/web/src/data/learningPathMetrics";
import {appRouteUrl,readAppRoute} from "../apps/web/src/routing/appRoute";
const require=createRequire(new URL("../apps/web/package.json",import.meta.url)),React=require("react");
(globalThis as {React?:unknown}).React=React;require.extensions[".css"]=()=>{};
const {renderToStaticMarkup}=require("react-dom/server"),{MarkdownContent}=require("./src/components/MarkdownContent");
const {WorkedExampleContent}=require("./src/features/lesson/document/WorkedExampleContent");
const {HumanitiesWritingPanel}=require("./src/features/lesson/document/HumanitiesWritingPanel");
const katex=require("katex");
const source=(name:string)=>readFileSync(new URL("../apps/web/src/"+name,import.meta.url),"utf8");
const paths=learningPaths.filter(path=>path.subjectId==="history-geography");
const readers=paths.map(createHumanitiesCourseSummary);
const strings=()=>readers.flatMap(reader=>[
 ...reader.summary.sections.flatMap(section=>[section.title,...section.topics.flatMap(topic=>[topic.title,topic.body,topic.detail??"",
   ...topic.examples?.flatMap(example=>[example.prompt,example.solution??"",...example.parts?.flatMap(part=>[part.prompt,part.solution])??[]])??[]])]),
 ...reader.summary.essentials?.flatMap(card=>[card.title,card.body])??[],
 reader.writing.context,...reader.writing.tasks.flatMap(task=>[task.prompt,task.model,...task.criteria]),
]);

test("15 leçons existantes et45 accès Terminales A/C/D, sans inventer G5",async()=>{
 assert.equal(paths.length,15);
 assert.equal(paths.filter(path=>/-h\d+-/.test(path.id)).length,9);
 assert.equal(paths.filter(path=>/-g\d+-/.test(path.id)).length,6);
 for(const level of ["terminale-a","terminale-c","terminale-d"]){
  const bundle=await loadLearningPathsForSubject(level,"history-geography");
  assert.equal(bundle.length,15);
  for(const path of bundle){
   assert.ok(createHumanitiesCourseSummary(path).summary.levelIds.includes(level));
   assert.ok(curriculumLessonTitles.some(lesson=>lesson.levelId===level&&lesson.pathId===path.id&&lesson.published!==false));
  }
 }
 assert.ok(paths.every(path=>!path.id.includes("-g5-")));
 for(const reader of readers)assert.deepEqual(reader.summary.levelIds,["terminale-a","terminale-c","terminale-d"]);
});

test("les trois axes d’origine regroupent45 rubriques et90 parties sans cacher le cours",()=>{
 let sections=0,topics=0,examples=0;
 for(const path of paths){
  const {summary}=createHumanitiesCourseSummary(path),lessons=getPathLessons(path);
  assert.equal(summary.sections.length,3);
  const overview=lessons.find(lesson=>lesson.id.endsWith("-overview"))!;
  assert.equal(overview.interaction.kind,"timeline");
  if(overview.interaction.kind==="timeline")assert.deepEqual(summary.sections.map(section=>section.title),overview.interaction.items.map(item=>item.label));
  for(const topic of summary.sections.flatMap(section=>section.topics)){
   assert.equal(topic.optional,topic.legacyLessonIds![0].endsWith("-mission-finale"));
   assert.ok(topic.body.length>100,topic.id);
   topics++;examples+=topic.examples?.length??0;
  }
  sections+=summary.sections.length;
 }
 assert.deepEqual({sections,topics,examples},{sections:45,topics:90,examples:75});
 const updated=createHumanitiesCourseSummary({...paths[0],description:"Cette introduction actualisée présente directement le sujet du cours."});
 assert.match(updated.summary.sections[0].topics[0].body,/Cette introduction actualisée/);
 assert.notStrictEqual(updated,readers[0],"le cache tient compte de l’introduction éditoriale");
});

test("aucun identifiant historique, lien profond, fil de feedback ou outil ne disparaît",()=>{
 for(const path of paths){
  const summary=createHumanitiesCourseSummary(path).summary,lessons=getPathLessons(path),topics=summary.sections.flatMap(section=>section.topics);
  assert.equal(topics.length,lessons.length);
  assert.deepEqual(topics.flatMap(topic=>topic.legacyLessonIds!),lessons.map(lesson=>lesson.id));
  for(const lesson of lessons){
   const topic=topics.find(topic=>topic.legacyLessonIds!.includes(lesson.id))!;
   assert.equal(summary.legacyAnchors[lesson.id],topic.id);
   assert.strictEqual(topic.interaction,lesson.interaction);
  }
  assert.equal(new Set([...summary.sections.map(section=>section.id),...topics.map(topic=>topic.id)]).size,summary.sections.length+topics.length);
 }
});

test("le même contenu est partagé A/C/D sans muter les760 questions ni les XP",async()=>{
 const before=JSON.stringify(learningPaths);
 const a=await loadLearningPathsForSubject("terminale-a","history-geography"),d=await loadLearningPathsForSubject("terminale-d","history-geography");
 for(const path of a){
  const same=d.find(other=>other.id===path.id)!;
  assert.strictEqual(createHumanitiesCourseSummary(path),createHumanitiesCourseSummary(same));
  assert.equal(getPathLessons(path).reduce((sum,lesson)=>sum+lesson.xp,0),10_000);
 }
 assert.equal(paths.reduce((sum,path)=>sum+getPathLessons(path).reduce((n,lesson)=>n+(lesson.questions?.length??1),0),0),760);
 assert.equal(JSON.stringify(learningPaths),before);
 assert.equal(learningPaths.reduce((sum,path)=>sum+getPathLessons(path).reduce((n,lesson)=>n+(lesson.questions?.length??1),0),0),AVAILABLE_EXERCISES);
});

test("L’essentiel contient60 cartes provenant uniquement des repères déjà rédigés",()=>{
 let count=0;
 for(const path of paths){
  const summary=createHumanitiesCourseSummary(path).summary,lessons=getPathLessons(path);
  assert.equal(summary.essentials?.length,4);
  const points=lessons.map(lesson=>humanitiesReadingText(lesson.concept.notation));
  for(const card of summary.essentials!){
   assert.ok(card.body.split("\n\n").every(point=>points.includes(point)));
   assert.ok(summary.sections.flatMap(section=>section.topics).some(topic=>topic.id===card.topicId));
   count++;
  }
  assert.ok(!("source" in summary),"pas de fausse transcription d’un nouveau PDF");
 }
 assert.equal(count,60);
});

test("les modèles rédigés séparent chaque question, sa réponse et sa justification",()=>{
 let written=0;
 for(const reader of readers){
  assert.equal(reader.writing.tasks.length,3);
  const mission=reader.summary.sections.flatMap(section=>section.topics).find(topic=>topic.optional)!;
  assert.equal(mission.examples![0].parts?.length,3);
  for(const task of reader.writing.tasks){
   assert.ok(task.prompt.length>10);
   assert.ok(task.model.includes("**Réponse possible.**"));
   assert.ok(task.model.includes("**Explication.**"));
   assert.ok(task.criteria.length>=2);
   written++;
  }
 }
 assert.equal(written,45);
 const component=source("features/lesson/document/HumanitiesWritingPanel.tsx");
 assert.match(component,/sans note automatique/);
 assert.match(component,/<DocumentCorrection>/);
 assert.doesNotMatch(component,/score|submitAttempt|xpAwarded|checked|correctIndex/);
});

test("brouillons bornés, signés et séparés par compte, classe et cours ; jamais de score stocké",()=>{
 const tasks=readers[0].writing.tasks,answers={[tasks[0].id]:"Je justifie avec un fait daté."};
 const raw=serializeHumanitiesWriting(tasks,answers);
 assert.deepEqual(restoreHumanitiesWriting(tasks,raw),answers);
 assert.deepEqual(restoreHumanitiesWriting(tasks,"invalid"),{});
 assert.deepEqual(restoreHumanitiesWriting(tasks.map((task,index)=>index===0?{...task,prompt:"Nouveau sujet"}:task),raw),{});
 assert.deepEqual(restoreHumanitiesWriting(tasks,serializeHumanitiesWriting(tasks,{[tasks[0].id]:"x".repeat(10001)})),{});
 assert.doesNotMatch(raw,/score|xpAwarded|correctIndex|checked|open/);
 const scopes=["a:terminale-a:course","a:terminale-c:course","a:terminale-d:course","b:terminale-a:course","a:terminale-a:other"];
 assert.equal(new Set(scopes.map(humanitiesWritingStorageKey)).size,5);
});

test("URL, F5 et historique gardent les trois vues sans domaine mathématique",()=>{
 for(const view of ["evaluation","essentiel"]){
  const route=readAppRoute({pathname:"/parcours/terminale-hg-h1-united-nations",search:"?matiere=history-geography&vue="+view+"&domaine=analyse"},{navigation:"home"});
  assert.equal(route.courseTab,view==="evaluation"?"assessment":"essentials");
  assert.equal(route.mathDomain,undefined);
  const url=new URL(appRouteUrl(route,"?__level-preview=terminale-a"),"http://localhost");
  assert.equal(url.searchParams.get("vue"),view);
  assert.equal(url.searchParams.get("domaine"),null);
  assert.deepEqual(readAppRoute(url,{navigation:"home"}),route);
 }
});

test("la lecture affiche les faits établis, pas les commentaires de fabrication",()=>{
 const text=strings().join("\n");
 assert.doesNotMatch(text,/Correction du document|Correction de source|Correction \/ précision|Correction (?:botanique|statistique|de nom)|coquille|imprime le PDF|Mission finale|Niveau [1-6] •/i);
 for(const value of ["24 octobre 1945","neuf voix","U Thant","1963 à 1979","25 décembre 1991","25 mars 1957","12 janvier 1994"])assert.ok(text.includes(value),value);
 assert.ok(humanitiesReadingText("Une émission radiophonique.").includes("émission"));
 assert.ok(text.includes("**2016**"),"les données économiques restent datées");
});

test("rendu complet sans dollars bruts, erreurs de formule, scans ou marqueurs de citation vides",()=>{
 for(const value of strings()){
  for(const match of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g))katex.renderToString(match[1]??match[2],{displayMode:match[1]!==undefined,throwOnError:true,strict:"error",trust:false});
  const html=renderToStaticMarkup(React.createElement(MarkdownContent,{markdown:value}));
  assert.doesNotMatch(html,/katex-error|\$|<script|<img|<span>&gt;<\/span>/,value.slice(0,150));
 }
 for(const reader of readers){
  for(const topic of reader.summary.sections.flatMap(section=>section.topics))for(const example of topic.examples??[]){
   const html=renderToStaticMarkup(React.createElement(WorkedExampleContent,{example}));
   assert.equal((html.match(/data-example-part=/g)??[]).length,example.parts?.length??0);
  }
  const html=renderToStaticMarkup(React.createElement(HumanitiesWritingPanel,{writing:reader.writing,storageScope:"test"}));
  assert.equal((html.match(/<textarea/g)??[]).length,3);
  assert.equal((html.match(/Voir la correction/g)??[]).length,3);
  assert.doesNotMatch(html,/document-correction-panel/);
 }
});

test("le lecteur documentaire et les corrigés indépendants sont communs aux trois matières",()=>{
 const reader=source("features/lesson/ContinuousCourseScreen.tsx"),document=source("features/lesson/document/LessonDocumentScreen.tsx");
 assert.match(reader,/if \(humanitiesReader\)/);
 assert.match(reader,/document=\{humanitiesReader\.summary\}/);
 assert.match(reader,/className="humanities-course-document"/);
 assert.match(reader,/<HistoricalCourseAssessment/);
 assert.match(reader,/independentCorrection && <DocumentCorrection>/);
 assert.match(document,/cards=\{course\.essentials\}/);
 assert.match(document,/course\.essentials !== undefined/);
 assert.match(source("styles/humanities-document.css"),/font-size: 16px/);
 assert.match(source("styles/humanities-document.css"),/min-height: 44px/);
 assert.doesNotMatch(source("data/courseDocuments/humanitiesCourseSummary.ts"),/lesson\.(?:id|xp|questions)\s*=(?!=)|fetch\(|submitAttempt/);
});
