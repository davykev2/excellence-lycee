import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";
import { learningPaths } from "../apps/web/src/data/learningPaths";
import { loadLearningPathsForSubject } from "../apps/web/src/data/learningPathLoader";
import { createPhysicsCourseSummary, physicsWorkedBlocks, physicsSourcePages } from "../apps/web/src/data/courseDocuments/physicsCourseSummary";
import { physicsSummaryLayouts } from "../apps/web/src/data/courseDocuments/physicsSummaryLayouts";
import { physicsReadingText } from "../apps/web/src/data/courseDocuments/physicsSummaryEditorial";
import { getPathLessons } from "../apps/web/src/features/paths/pathLessons";
import { AVAILABLE_EXERCISES } from "../apps/web/src/data/learningPathMetrics";
import { getPhysicsEssentialKey,loadPhysicsEssentialSheet } from "../apps/web/src/data/physicsEssentials/registry";

const require=createRequire(new URL("../apps/web/package.json",import.meta.url));
const React=require("react");
(globalThis as {React?:unknown}).React=React;
require.extensions[".css"]=()=>{};
const {renderToStaticMarkup}=require("react-dom/server");
const {MarkdownContent}=require("./src/components/MarkdownContent");
const {WorkedExampleContent}=require("./src/features/lesson/document/WorkedExampleContent");
const katex=require("katex");
const paths=learningPaths.filter(path=>path.subjectId==="physics-chemistry"&&path.levelIds.some(id=>["terminale-c","terminale-d"].includes(id)));
const summaries=paths.map(createPhysicsCourseSummary);
const source=(file:string)=>readFileSync(new URL("../apps/web/src/"+file,import.meta.url),"utf8");
const values=()=>summaries.flatMap(summary=>summary.sections.flatMap(section=>[section.title,...section.topics.flatMap(topic=>[
  topic.title,topic.body,topic.detail??"",...topic.examples?.flatMap(example=>[example.title,example.prompt,example.solution??"",...example.parts?.flatMap(part=>[part.prompt,part.solution])??[]])??[],
])]));

test("31 cours PC ont un plan éditorial explicite et couvrent les 56 accès C/D",async()=>{
  assert.equal(paths.length,31);
  assert.deepEqual(Object.keys(physicsSummaryLayouts).sort(),paths.map(path=>path.id).sort());
  let accesses=0;
  for(const level of ["terminale-c","terminale-d"]){
    const bundle=await loadLearningPathsForSubject(level,"physics-chemistry");
    assert.equal(bundle.length,level==="terminale-c"?29:27);
    for(const path of bundle)assert.ok(createPhysicsCourseSummary(path).levelIds.includes(level));
    accesses+=bundle.length;
  }
  assert.equal(accesses,56);
  assert.equal(summaries.reduce((sum,course)=>sum+course.sections.length,0),124);
  assert.equal(summaries.reduce((sum,course)=>sum+course.sections.reduce((n,section)=>n+section.topics.length,0),0),241);
});

test("toutes les parties historiques, leurs ancres et leurs interactions sont conservées",()=>{
  for(const path of paths){
    const summary=createPhysicsCourseSummary(path),lessons=getPathLessons(path),topics=summary.sections.flatMap(section=>section.topics);
    assert.equal(topics.length,lessons.length);
    const ids=[...summary.sections.map(section=>section.id),...topics.map(topic=>topic.id)];
    assert.equal(new Set(ids).size,ids.length,path.id);
    for(let index=0;index<lessons.length;index++){
      assert.deepEqual(topics[index].legacyLessonIds,[lessons[index].id]);
      assert.equal(summary.legacyAnchors[lessons[index].id],topics[index].id);
      assert.strictEqual(topics[index].interaction,lessons[index].interaction);
      assert.ok(topics[index].body.length>250,path.id+":"+topics[index].id);
      assert.ok(topics[index].examples?.length);
    }
  }
});

test("C/D partagent le même résumé sans muter le cours, les questions ou les récompenses",async()=>{
  const before=JSON.stringify(learningPaths);
  for(const path of paths)assert.strictEqual(createPhysicsCourseSummary(path),createPhysicsCourseSummary(path));
  const c=await loadLearningPathsForSubject("terminale-c","physics-chemistry"),d=await loadLearningPathsForSubject("terminale-d","physics-chemistry");
  for(const path of c){
    const shared=d.find(other=>other.id===path.id);
    if(shared)assert.strictEqual(createPhysicsCourseSummary(path),createPhysicsCourseSummary(shared));
  }
  assert.equal(JSON.stringify(learningPaths),before);
  assert.equal(learningPaths.reduce((total,path)=>total+getPathLessons(path).reduce((sum,lesson)=>sum+(lesson.questions?.length||1),0),0),AVAILABLE_EXERCISES);
  for(const path of paths)assert.equal(getPathLessons(path).reduce((sum,lesson)=>sum+lesson.xp,0),10_000);
});

test("le résumé complet reste distinct de la fiche L’essentiel",async()=>{
  for(const path of paths){
    const summary=createPhysicsCourseSummary(path);
    assert.ok(!("source" in summary),"ne pas prétendre à une nouvelle transcription PDF");
    const key=getPhysicsEssentialKey(path.id,path.levelIds.find(id=>["terminale-c","terminale-d"].includes(id))!);
    if(key)assert.notDeepEqual(summary.sections,(await loadPhysicsEssentialSheet(key)).sections);
  }
  assert.doesNotMatch(source("data/courseDocuments/physicsCourseSummary.ts"),/fetch\(|loadPhysicsEssentialSheet|xpAwarded|submitAttempt|createHumanitiesPath/);
});

test("extraction des exemples : définitions et propriétés restent dans le cours",()=>{
  const text="## Définition\nUne force.\n\n## Exemple guidé\nCalcul détaillé.\n\n## Propriété\nUne hypothèse.\n";
  const parsed=physicsWorkedBlocks(text,"test");
  assert.equal(parsed.examples.length,1);
  assert.match(parsed.examples[0].solution!,/Calcul détaillé/);
  assert.match(parsed.body,/Définition[\s\S]+Propriété/);
  assert.doesNotMatch(parsed.body,/Calcul détaillé/);
  assert.deepEqual(physicsSourcePages("1-3, 6 et 8–9"),[1,2,3,6,8,9]);
});

test("cinématique : chaque calcul du modèle est identifié et expliqué séparément",()=>{
  const summary=createPhysicsCourseSummary(paths.find(path=>path.id==="seconde-c-kinematics")!);
  const topics=summary.sections.flatMap(section=>section.topics);
  for(const id of ["position-vector","velocity-vector","acceleration-vector","rectilinear-varied-motion","circular-uniform-motion"]){
    const topic=topics.find(topic=>topic.legacyLessonIds?.includes(id))!;
    const example=topic.examples!.find(example=>example.parts);
    assert.ok(example,id);assert.equal(example.parts!.length,2);
    assert.equal(new Set(example.parts!.map(part=>part.label)).size,2);
    for(const part of example.parts!)assert.ok(part.solution.length>100);
  }
  assert.equal(.2*250,50);assert.equal(50**2/.2,12500);
  assert.equal(500**2/100,2500);assert.equal(500/2500,.2);
});

test("les bonnes relations restent visibles sans notices internes de coquilles",()=>{
  const text=values().join("\n");
  assert.doesNotMatch(text,/coquille|imprim(?:é|ée|és)|corrigé source|document source|Rangement réparé|Correction (?:majeure|de classement)|Corrections de source|tableau source contient|Le PDF (?:écrit|affiche|trouve)|Mission finale|\bquiz\b/);
  for(const value of [String.raw`\vec F`,String.raw`\frac{d`,"solénoïde","407{,}5","0{,}865","12\\,500"])assert.ok(text.includes(value),value);
  assert.equal(physicsReadingText("> **Correction majeure du support.** Note interne."),"");
  assert.ok(physicsReadingText("Le facteur d’émission dépend de la fréquence.").includes("émission"));
});

test("les hypothèses et unités sont explicites, y compris le cas cohérent de résonance",()=>{
  const summary=createPhysicsCourseSummary(paths.find(path=>path.id==="terminale-cd-rlc-intensity-resonance")!);
  const topic=summary.sections.flatMap(section=>section.topics).find(topic=>topic.legacyLessonIds?.includes("resonance-official-evaluation-audit"))!;
  assert.ok(topic.body.includes("0{,}865"));
  assert.ok(!topic.body.includes("15{,}4"));
  const L=1/(6.1e-6*(2*Math.PI*148)**2),Q=2*Math.PI*148*L/407.5;
  assert.ok(Math.abs(Q*2-.865)<.001);
  assert.ok(topic.body.includes("masses"));
  assert.equal(getPathLessons(paths.find(path=>path.id==="terminale-cd-rlc-intensity-resonance")!).find(lesson=>lesson.id==="resonance-official-evaluation-audit")!.concept.bodyMarkdown!.includes("15{,}4"),true);
});

test("toutes les formules des cours, méthodes et solutions passent KaTeX strict",()=>{
  let count=0;
  for(const value of values()){
    assert.doesNotMatch(value,/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/);
    assert.equal((value.match(/\$/g)??[]).length%2,0,value.slice(0,120));
    for(const match of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)){
      assert.doesNotThrow(()=>katex.renderToString(match[1]??match[2],{displayMode:match[1]!==undefined,throwOnError:true,strict:"error",trust:false}),match[1]??match[2]);
      count++;
    }
  }
  assert.ok(count>3000,String(count));
});

test("tout le texte et les exemples se rendent sans dollars bruts, erreur KaTeX ou scans",()=>{
  for(const value of values()){
    const html=renderToStaticMarkup(React.createElement(MarkdownContent,{markdown:value}));
    assert.doesNotMatch(html,/katex-error|\$|<img|<script/,value.slice(0,100));
  }
  for(const summary of summaries)for(const topic of summary.sections.flatMap(section=>section.topics))for(const example of topic.examples??[]){
    const html=renderToStaticMarkup(React.createElement(WorkedExampleContent,{example}));
    assert.doesNotMatch(html,/katex-error|\$/);
    if(example.parts)assert.equal((html.match(/data-example-part=/g)??[]).length,example.parts.length);
  }
});

test("la physique utilise bien le même lecteur documentaire que les maths, pas les anciennes cartes",()=>{
  const reader=source("features/lesson/ContinuousCourseScreen.tsx"),document=source("features/lesson/document/LessonDocumentScreen.tsx");
  assert.match(reader,/if \(physicsSummary\)/);
  assert.match(reader,/document=\{physicsSummary\}/);
  assert.match(reader,/assessmentContent=\{<HistoricalCourseAssessment/);
  assert.match(reader,/essentialsContent=\{<PhysicsEssentialsPanel/);
  assert.match(reader,/if \(course\?\.levelIds\.includes/);
  assert.match(reader,/return <LegacyContinuousCourseScreen/);
  for(const slot of ["assessmentContent","essentialsContent","document-summary-layout","document-summary-example"])assert.ok(document.includes(slot));
  assert.doesNotMatch(document,/mastery-course-card|course-reader-hero/);
});

test("évaluation : brouillons isolés, validation et correction indépendante restent raccordés",()=>{
  const reader=source("features/lesson/ContinuousCourseScreen.tsx");
  assert.match(reader,/storageScope=\{`\$\{currentUser\.id\}:\$\{level\.id\}:\$\{path\.id\}:\$\{lesson\.id\}`\}/);
  assert.match(reader,/independentCorrection && <DocumentCorrection>/);
  assert.match(reader,/setChecked\(true\)/);
  assert.doesNotMatch(source("data/courseDocuments/physicsCourseSummary.ts"),/lesson\.(?:id|xp|questions)\s*=(?!=)/);
});
