import assert from "node:assert/strict";
import {createRequire} from "node:module";
import {readFileSync} from "node:fs";
import test from "node:test";
import {learningPaths} from "../apps/web/src/data/learningPaths";
import {loadLearningPathsForSubject} from "../apps/web/src/data/learningPathLoader";
import {AVAILABLE_EXERCISES} from "../apps/web/src/data/learningPathMetrics";
import {createSvtCourseSummary,svtWorkedBlocks,svtSourcePages} from "../apps/web/src/data/courseDocuments/svtCourseSummary";
import {svtSummaryLayouts} from "../apps/web/src/data/courseDocuments/svtSummaryLayouts";
import {svtReadingText,svtReadingTitle} from "../apps/web/src/data/courseDocuments/svtSummaryEditorial";
import {getSvtEssentialKey,loadSvtEssentialSheet} from "../apps/web/src/data/svtEssentials/registry";
import {getPathLessons} from "../apps/web/src/features/paths/pathLessons";

const require=createRequire(new URL("../apps/web/package.json",import.meta.url));
const React=require("react");
(globalThis as {React?:unknown}).React=React;
require.extensions[".css"]=()=>{};
for(const extension of [".webp",".png",".jpg",".svg"])require.extensions[extension]=(module,file)=>{module.exports=file;};
// Only the standalone interaction is rendered here: no browser environment or network is needed.
const apiFile=require.resolve("./src/lib/api");
require.cache[apiFile]={id:apiFile,filename:apiFile,loaded:true,exports:{
  ApiError:class extends Error {},apiRequest:()=>{throw new Error("Unexpected network call in interaction SSR");},
}} as NodeModule;
const {renderToStaticMarkup}=require("react-dom/server");
const {MarkdownContent}=require("./src/components/MarkdownContent");
const {WorkedExampleContent}=require("./src/features/lesson/document/WorkedExampleContent");
const {LessonInteractionPanel}=require("./src/features/lesson/LessonWorkspace");
const katex=require("katex");
const paths=learningPaths.filter(path=>path.subjectId==="svt"&&path.levelIds.some(id=>["terminale-a","terminale-c","terminale-d"].includes(id)));
const snapshot=JSON.stringify(paths);
const summaries=paths.map(createSvtCourseSummary);
const source=(file:string)=>readFileSync(new URL("../apps/web/src/"+file,import.meta.url),"utf8");
const topics=()=>summaries.flatMap(summary=>summary.sections.flatMap(section=>section.topics));
const values=()=>summaries.flatMap(summary=>summary.sections.flatMap(section=>[section.title,...section.topics.flatMap(topic=>[
  topic.title,topic.body,topic.detail??"",...topic.examples?.flatMap(example=>[example.title,example.prompt,example.solution??"",...example.parts?.flatMap(part=>[part.prompt,part.solution])??[]])??[],
])]));

test("33 cours SVT ont un plan explicite et gardent les programmes A/C/D",async()=>{
  assert.equal(paths.length,33);
  assert.deepEqual(Object.keys(svtSummaryLayouts).sort(),paths.map(path=>path.id).sort());
  for(const [level,count] of [["terminale-a",7],["terminale-c",11],["terminale-d",15]] as const){
    const bundle=await loadLearningPathsForSubject(level,"svt");
    assert.equal(bundle.length,count);
    for(const path of bundle)assert.ok(createSvtCourseSummary(path).levelIds.includes(level));
  }
  assert.throws(()=>createSvtCourseSummary({...paths[0],id:"unknown-svt"}),/Plan de résumé SVT/);
});

test("chaque partie, ancre et interaction reste reliée au contenu historique",()=>{
  for(const path of paths){
    const summary=createSvtCourseSummary(path),lessons=getPathLessons(path),parts=summary.sections.flatMap(section=>section.topics);
    assert.equal(parts.length,lessons.length,path.id);
    assert.equal(new Set(parts.map(part=>part.id)).size,parts.length);
    for(let index=0;index<parts.length;index++){
      const part=parts[index],lesson=lessons[index];
      assert.deepEqual(part.legacyLessonIds,[lesson.id]);
      assert.equal(summary.legacyAnchors[lesson.id],part.id);
      assert.deepEqual(part.interaction,{...lesson.interaction,title:svtReadingTitle(lesson.interaction.title),
        instruction:svtReadingText(lesson.interaction.instruction),observation:svtReadingText(lesson.interaction.observation)});
      assert.deepEqual(part.pages,svtSourcePages(lesson.source?.pages));
      assert.ok(part.body.length>350,path.id+":"+lesson.id);
      assert.ok(part.detail?.includes("1. "));
    }
  }
});

test("les données canoniques, questions, sources, XP et compteur ne sont pas modifiés",async()=>{
  assert.equal(JSON.stringify(paths),snapshot);
  assert.equal(learningPaths.reduce((n,path)=>n+getPathLessons(path).reduce((m,lesson)=>m+(lesson.questions?.length||1),0),0),AVAILABLE_EXERCISES);
  for(const path of paths){
    assert.strictEqual(createSvtCourseSummary(path),createSvtCourseSummary(path));
    assert.equal(getPathLessons(path).reduce((n,lesson)=>n+lesson.xp,0),10_000);
    const clone={...path};assert.strictEqual(createSvtCourseSummary(path),createSvtCourseSummary(clone));
  }
  assert.doesNotMatch(source("data/courseDocuments/svtCourseSummary.ts"),/fetch\(|submitAttempt|xpAwarded|lesson\.(?:id|xp|questions)\s*=(?!=)/);
});

test("un type challenge ne masque pas automatiquement une notion du cours",()=>{
  const course=createSvtCourseSummary(paths.find(path=>path.id==="terminale-c-svt-l4-muscle-energy-use")!);
  const fatigue=course.sections.flatMap(section=>section.topics).find(topic=>topic.legacyLessonIds?.includes("muscle-response-fatigue-mission"))!;
  assert.equal(fatigue.optional,false);
  for(const term of ["secousse","sommation","tétanos","fatigue"])assert.ok(fatigue.body.toLowerCase().includes(term),term);
  assert.ok(topics().some(topic=>topic.optional));
  assert.doesNotMatch(source("data/courseDocuments/svtCourseSummary.ts"),/lesson\.kind\s*===\s*"challenge"/);
});

test("les applications conservent les exemples et modèles de raisonnement existants",()=>{
  for(const path of paths)for(const part of createSvtCourseSummary(path).sections.flatMap(section=>section.topics)){
    const lesson=getPathLessons(path).find(lesson=>part.legacyLessonIds?.includes(lesson.id))!;
    if(lesson.id.endsWith("-overview"))continue;
    const text=JSON.stringify([part.body,part.examples]);
    assert.ok(text.includes(JSON.stringify(svtReadingText(lesson.concept.example)).slice(1,-1)),lesson.id);
    const work=svtReadingText(lesson.method.example.work);
    assert.ok(text.includes(JSON.stringify(work).slice(1,-1)),lesson.id);
  }
  const parsed=svtWorkedBlocks("## Définition\nUn neurone.\n## 2. Exemple guidé\nUne analyse détaillée.\n## Propriété\nUn mécanisme.","sample");
  assert.equal(parsed.examples.length,1);
  assert.match(parsed.body,/Définition[\s\S]*Propriété/);
  assert.equal(parsed.examples[0].solution,"Une analyse détaillée.");
  assert.deepEqual(svtSourcePages("1–3, 6 et 8-9"),[1,2,3,6,8,9]);
});

test("le résumé ne se substitue pas aux fiches L’essentiel et n’invente pas de provenance",async()=>{
  for(const path of paths){
    const summary=createSvtCourseSummary(path);
    assert.ok(!("source" in summary));assert.ok(!("evaluations" in summary));assert.ok(!summary.essentials);
    for(const level of path.levelIds){
      const key=getSvtEssentialKey(path.id,level);
      if(key)assert.notDeepEqual(summary.sections,(await loadSvtEssentialSheet(key)).sections);
    }
  }
  for(const id of ["terminale-c-svt-l9-petroleum-formation","terminale-c-svt-l10-petroleum-exploitation"]){
    assert.equal(getSvtEssentialKey(id,"terminale-c"),null);
    assert.ok(createSvtCourseSummary(paths.find(path=>path.id===id)!).sections.length>2);
  }
});

test("les corrections scientifiques importantes restent explicites dans la lecture",()=>{
  const text=values().join("\n");
  for(const term of ["ARN polymérase","brin matrice/transcrit","codant/non transcrit","La cocaïne bloque principalement","hémizygote","phagolysosome","angiospermes","Ca(HCO_3)_2","Ca^{2+}","inférieurs ou égaux","A = sombre","I = claire","premier fuseau mitotique commun"]){
    assert.ok(text.includes(term),term);
  }
  assert.ok(svtReadingText("La transmission synaptique").includes("transmission"));
  assert.equal(svtReadingTitle("La carte de la leçon"),"Repères et fil conducteur");
  assert.doesNotMatch(text,/coquille|Correction de classement|Une leçon, trois numérotations|situation d’apprentissage introductive|Mission finale|Niveau \d/);
});

test("les formules du cours, des méthodes et des exemples passent KaTeX strict",()=>{
  let count=0;
  for(const text of values()){
    assert.doesNotMatch(text,/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/);
    assert.equal((text.match(/\$/g)??[]).length%2,0,text.slice(0,100));
    for(const match of text.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)){
      assert.doesNotThrow(()=>katex.renderToString(match[1]??match[2],{displayMode:match[1]!==undefined,throwOnError:true,strict:"error",trust:false}),match[1]??match[2]);count++;
    }
  }
  assert.ok(count>500,String(count));
});

test("tout le résumé se rend sans erreur KaTeX, dollars bruts, scans ou scripts",()=>{
  for(const text of values()){
    const html=renderToStaticMarkup(React.createElement(MarkdownContent,{markdown:text}));
    assert.doesNotMatch(html,/katex-error|\$|<img|<script/,text.slice(0,100));
  }
  for(const topic of topics())for(const example of topic.examples??[]){
    const html=renderToStaticMarkup(React.createElement(WorkedExampleContent,{example}));
    assert.doesNotMatch(html,/katex-error|\$/);
  }
});

test("les légendes, boutons et étapes des figures rendent aussi les génotypes",()=>{
  let states=0;
  for(const topic of topics()){
    const interaction=topic.interaction!;
    if(!["timeline","schema","diagram"].includes(interaction.kind))continue;
    const variations=interaction.kind==="timeline"?interaction.items.map((_,index)=>({...interaction,items:[...interaction.items.slice(index),...interaction.items.slice(0,index)]})):[interaction];
    for(const variation of variations){
      const html=renderToStaticMarkup(React.createElement(LessonInteractionPanel,{lesson:{id:topic.id,interaction:variation}}));
      assert.doesNotMatch(html,/katex-error/);
      assert.doesNotMatch(html.replace(/<[^>]+>/g,""),/\$/,"formules visibles de "+topic.id);
      states++;
    }
  }
  assert.ok(states>400,String(states));
});

test("SVT emploie le même lecteur documentaire, ses trois onglets et les historiques séparés",()=>{
  const reader=source("features/lesson/ContinuousCourseScreen.tsx");
  assert.match(reader,/if \(svtSummary\)/);
  assert.match(reader,/document=\{svtSummary\}/);
  assert.match(reader,/className="svt-course-document svt-summary-document"/);
  assert.match(reader,/essentialsContent=\{<SvtEssentialsPanel/);
  assert.match(reader,/assessmentContent=\{<HistoricalCourseAssessment/);
  assert.match(reader,/storageScope=\{`\$\{currentUser\.id\}:\$\{level\.id\}:\$\{path\.id\}:\$\{lesson\.id\}`\}/);
  assert.match(reader,/independentCorrection && <DocumentCorrection>/);
  assert.match(reader,/return <LegacyContinuousCourseScreen/);
  assert.match(source("features/lesson/document/LessonDocumentScreen.tsx"),/document-summary-layout/);
  assert.match(source("features/lesson/LessonWorkspace.tsx"),/<MathText>\{item.shortLabel \?\? item.label\}<\/MathText>/);
  assert.match(source("features/lesson/LessonWorkspace.tsx"),/<MathText>\{timelineItem.detail\}<\/MathText>/);
  assert.match(source("features/lesson/LessonWorkspace.tsx"),/schema-caption"><MathText>\{interaction.caption\}<\/MathText>/);
});
