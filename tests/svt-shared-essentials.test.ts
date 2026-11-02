import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getSvtEssentialKey, loadSvtEssentialSheet, svtEssentialRoutes } from "../apps/web/src/data/svtEssentials/registry";
import { svtEssentialSource } from "../apps/web/src/data/svtEssentials/types";
import { learningPaths } from "../apps/web/src/data/learningPaths";
import { loadLearningPathsForSubject } from "../apps/web/src/data/learningPathLoader";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog";
import { getPathLessons } from "../apps/web/src/features/paths/pathLessons";
import { AVAILABLE_EXERCISES } from "../apps/web/src/data/learningPathMetrics";
import { aboCross, biologyEssentialPresets, biologyFlows, bounded, cycleCurves, interpolate, linkageProbabilities, potentialPoints, punnettCross, recruitmentModel } from "../apps/web/src/domain/biologyEssentialModels";
import { appRouteUrl, readAppRoute } from "../apps/web/src/routing/appRoute";
import { physicsAssessmentStorageKey, restorePhysicsAssessment, serializePhysicsAssessment } from "../apps/web/src/features/lesson/physicsAssessmentDraft";
import type { CourseEssentialSheet } from "../apps/web/src/domain/courseDocument";
import type { LessonQuestion } from "../apps/web/src/domain/paths";

const require=createRequire(new URL("../apps/web/package.json",import.meta.url));
const React=require("react");(globalThis as {React?:unknown}).React=React;require.extensions[".css"]=()=>{};
const {renderToStaticMarkup}=require("react-dom/server"),katex=require("katex");
const {MathEssentialsContent}=require("./src/features/lesson/document/MathEssentialsPanel");
const {BiologyEssentialFigure}=require("./src/features/lesson/document/BiologyEssentialFigure");
const source=(file:string)=>readFileSync(new URL("../apps/web/src/"+file,import.meta.url),"utf8");
const keys=[...new Set(svtEssentialRoutes.map(route=>route.key))];
const sheets=()=>Promise.all(keys.map(loadSvtEssentialSheet));
const body=(sheet:CourseEssentialSheet)=>sheet.sections.flatMap(s=>s.topics.map(t=>t.body)).join("\n");
const get=async(key:typeof keys[number])=>body(await loadSvtEssentialSheet(key));

test("SVT : 18 fiches, 24 accès existants, aucun changement de classe ou de numérotation",()=>{
  assert.equal(keys.length,18);assert.equal(svtEssentialRoutes.length,24);
  assert.equal(svtEssentialRoutes.filter(r=>r.levelId==="terminale-c").length,9);
  assert.equal(svtEssentialRoutes.filter(r=>r.levelId==="terminale-d").length,15);
  for(const route of svtEssentialRoutes){
    assert.equal(getSvtEssentialKey(route.pathId,route.levelId),route.key);
    assert.ok(curriculumLessonTitles.some(card=>card.levelId===route.levelId&&card.subjectId==="svt"&&card.pathId===route.pathId&&card.published!==false),route.pathId);
    const path=learningPaths.find(p=>p.id===route.pathId);assert.ok(path);assert.ok(path.levelIds.includes(route.levelId));assert.equal(path.subjectId,"svt");
    assert.equal(getSvtEssentialKey(route.pathId,route.levelId==="terminale-c"?"terminale-d":"terminale-c"),null);
  }
});
test("SVT : six payloads communs strictement identiques et sous-rubriques réutilisées",async()=>{
  const grouped=new Map<string,typeof svtEssentialRoutes[number][]>();
  for(const route of svtEssentialRoutes)grouped.set(route.key,[...(grouped.get(route.key)??[]),route]);
  let shared=0;
  for(const routes of grouped.values()){
    const sheet=await loadSvtEssentialSheet(routes[0].key);
    assert.strictEqual(await loadSvtEssentialSheet(routes[0].key),sheet);
    assert.deepEqual([...sheet.levelIds].sort(),routes.map(r=>r.levelId).sort());
    if(routes.length===2){shared++;assert.strictEqual(await loadSvtEssentialSheet(routes[1].key),sheet);}
  }
  assert.equal(shared,6);
  const female=await loadSvtEssentialSheet("female-cycles"),sexual=await loadSvtEssentialSheet("sexual-organs");
  for(let i=0;i<female.sections.length;i++)assert.strictEqual(female.sections[i].topics,sexual.sections[i].topics);
  const energy=await loadSvtEssentialSheet("cell-energy"),muscle=await loadSvtEssentialSheet("muscle");
  for(const part of energy.sections)assert.strictEqual(part.topics,muscle.sections.find(s=>s.id===part.id)?.topics);
});
test("pas de fausse fiche pétrole, hors programme ou d’amélioration des espèces",()=>{
  for(const id of ["terminale-c-svt-l9-petroleum-formation","terminale-c-svt-l10-petroleum-exploitation","unknown"])
    for(const level of ["terminale-c","terminale-d"])assert.equal(getSvtEssentialKey(id,level),null);
  for(const route of svtEssentialRoutes)for(const level of ["terminale-a","seconde-c","premiere-d","unknown"])assert.equal(getSvtEssentialKey(route.pathId,level),null);
});
test("les parcours, questions historiques, registres XP et compteur restent intacts",async()=>{
  const before=JSON.stringify(learningPaths);await sheets();assert.equal(JSON.stringify(learningPaths),before);
  for(const level of ["terminale-c","terminale-d"]){
    const paths=await loadLearningPathsForSubject(level,"svt");assert.equal(paths.length,level==="terminale-c"?11:15);
    for(const route of svtEssentialRoutes.filter(r=>r.levelId===level))assert.ok(paths.some(p=>p.id===route.pathId));
  }
  assert.equal(learningPaths.reduce((sum,p)=>sum+getPathLessons(p).reduce((n,l)=>n+(l.questions?.length||1),0),0),AVAILABLE_EXERCISES);
});
test("105 pages de cours tracées, sans banque, scan, XP ou commentaire de fabrication",async()=>{
  const ranges=[[505,537],[562,571],[575,584],[600,615],[638,649],[656,661],[671,674],[691,692],[710,715],[726,731]];
  const expected=new Set(ranges.flatMap(([a,b])=>Array.from({length:b-a+1},(_,i)=>a+i))),seen=new Set<number>();
  for(const sheet of await sheets()){
    assert.equal(sheet.source.sha256,svtEssentialSource.sha256);assert.equal(sheet.source.pageCount,740);
    assert.ok(sheet.source.editorialNotes.length);assert.ok(body(sheet).length>1000,sheet.id);
    const ids=sheet.sections.flatMap(s=>[s.id,...s.topics.map(t=>t.id)]);assert.equal(new Set(ids).size,ids.length);
    sheet.source.pages.forEach(p=>{assert.ok(expected.has(p),sheet.id+":"+p);seen.add(p);});
    for(const t of sheet.sections.flatMap(s=>s.topics))assert.ok(t.pages.every(p=>sheet.source.pages.includes(p)));
    assert.doesNotMatch(JSON.stringify(sheet.sections),/xpAwarded|points":|questions":|coquille|Excellence rétablit|document imprime|EXERCICE CORRIG|!\[|<img|<script/i);
  }
  assert.equal(expected.size,105);assert.deepEqual([...seen].sort((a,b)=>a-b),[...expected].sort((a,b)=>a-b));
});
test("formules strictes et tableaux complets dans toutes les fiches",async()=>{
  let formulas=0,tables=0;
  for(const sheet of await sheets())for(const section of sheet.sections)for(const text of [section.title,...section.topics.flatMap(t=>[t.title,t.body])]){
    assert.doesNotMatch(text,/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u00a3\u00a7]/);assert.equal((text.match(/\$/g)??[]).length%2,0);
    for(const m of text.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)){katex.renderToString(m[1]??m[2],{throwOnError:true,strict:"error",trust:false});formulas++;}
    let columns=0;
    for(const line of text.split("\n")){if(!line.startsWith("|")){columns=0;continue;}const n=line.split("|").length;if(!columns){columns=n;tables++;}else assert.equal(n,columns,sheet.id+":"+line);}
  }
  assert.ok(formulas>80,String(formulas));assert.ok(tables>35,String(tables));
});
test("rendu intégral des fiches : pas de LaTeX brut, scan ou points inventés",async()=>{
  for(const sheet of await sheets()){
    const html=renderToStaticMarkup(React.createElement(MathEssentialsContent,{sheet}));
    assert.equal((html.match(/class="document-summary-section essential-sheet-section"/g)??[]).length,sheet.sections.length);
    assert.doesNotMatch(html,/katex-error|\$|<img|Contenu à venir|document-question|coquille|Source du cours/,sheet.id);
  }
});
test("34 figures natives connues, accessibles et sans exécution de saisie",async()=>{
  const used=new Set<string>();
  for(const sheet of await sheets())for(const t of sheet.sections.flatMap(s=>s.topics))if(t.nativeFigure?.kind==="biology")used.add(t.nativeFigure.preset);
  assert.deepEqual([...used].sort(),[...biologyEssentialPresets].sort());assert.equal(used.size,34);
  for(const preset of biologyEssentialPresets){
    const html=renderToStaticMarkup(React.createElement(BiologyEssentialFigure,{preset}));
    assert.match(html,/role="img"/);assert.match(html,/<title/);assert.match(html,/<figcaption/);
    assert.doesNotMatch(html,/NaN|Infinity|<img|<script|\$/);
  }
  assert.equal(renderToStaticMarkup(React.createElement(BiologyEssentialFigure,{preset:"unknown"})),"");
  assert.doesNotMatch(source("features/lesson/document/BiologyEssentialFigure.tsx"),/eval\(|new Function|setInterval|requestAnimationFrame/);
  for(const flow of Object.values(biologyFlows))assert.ok(flow.steps.length>=4&&flow.steps.length<=6);
});
test("potentiel d’action, recrutement et courbes : bornes et modèles qualitatifs",()=>{
  assert.equal(interpolate(potentialPoints,0),-70);assert.equal(interpolate(potentialPoints,2),30);assert.equal(interpolate(potentialPoints,6),-70);
  assert.deepEqual(recruitmentModel(0),{single:0,nerve:0});assert.deepEqual(recruitmentModel(100),{single:1,nerve:1});
  assert.equal(recruitmentModel(24).single,0);assert.equal(recruitmentModel(25).single,1);
  for(const curve of Object.values(cycleCurves))for(let day=1;day<=28;day+=.25)assert.ok(interpolate(curve,day)>=0&&interpolate(curve,day)<=1);
  assert.equal(bounded(Infinity,0,50),0);assert.equal(bounded(-5,0,50),0);assert.equal(bounded(80,0,50),50);
});
test("échiquiers : neuf croisements monohybrides et 36 ABO correctement combinés",()=>{
  assert.deepEqual(punnettCross("Aa","Aa"),["AA","Aa","Aa","aa"]);
  assert.deepEqual(aboCross("AO","BO").sort(),["A","AB","B","O"]);
  for(const a of ["AA","Aa","aa"])for(const b of ["AA","Aa","aa"]){const values=punnettCross(a,b);assert.equal(values.length,4);assert.ok(values.every(v=>["AA","Aa","aa"].includes(v)));}
  for(const a of ["AA","AO","BB","BO","AB","OO"])for(const b of ["AA","AO","BB","BO","AB","OO"]){
    const values=aboCross(a,b);assert.equal(values.length,4);assert.deepEqual([...values].sort(),aboCross(b,a).sort());assert.ok(values.every(v=>["A","B","AB","O"].includes(v)));
  }
});
test("liaison : somme unitaire, cis/trans inversés, indépendance à50%",()=>{
  for(let r=-5;r<=55;r+=.25){
    const cis=linkageProbabilities(r),trans=linkageProbabilities(r,true);
    assert.ok(cis.every(p=>p>=0&&p<=.5));assert.ok(Math.abs(cis.reduce((a,b)=>a+b)-1)<1e-12);assert.deepEqual(trans,[cis[1],cis[0],cis[0],cis[1]]);
  }
  assert.deepEqual(linkageProbabilities(20),[.4,.1,.1,.4]);assert.deepEqual(linkageProbabilities(50),[.25,.25,.25,.25]);
});
test("physiologie : glucose filtré, ADH et hormones pancréatiques non inversés",async()=>{
  const text=await get("internal-environment"),heart=await get("heart"),muscle=await get("muscle");
  for(const word of ["**est filtré**","hypothalamus","Cellules $\\beta$","Cellules $\\alpha$","1,5 L","170 L"])assert.ok(text.includes(word),word);
  assert.ok(heart.includes("B1"));assert.ok(heart.includes("fermeture des valves atrioventriculaires"));
  assert.ok(muscle.includes("ATP"));assert.ok(muscle.includes("actine"));assert.ok(muscle.includes("myosine"));
  assert.equal(70*70/1000,4.9);assert.equal((170-1.5)/170>.99,true);
});
test("reproduction : périmètre angiospermes et rétrocontrôles conservés",async()=>{
  const plants=await get("spermaphytes"),cycles=await get("sexual-organs");
  for(const word of ["angiospermes","gymnospermes","**trois mitoses","sept cellules","(3n)","baie"])assert.ok(plants.includes(word),word);
  for(const word of ["pulsatile","rétrocontrôle positif","augmente habituellement FSH/LH","ne protègent pas"])assert.ok(cycles.includes(word),word);
});
test("VIH et immunité : pas de diagnostic automatique ou de calendrier fatal",async()=>{
  const hiv=await get("hiv-infection"),immune=await get("immune-defense");
  for(const word of ["deux copies","protéase","confirmation","**transmission sexuelle**","n’est pas inévitable"])assert.ok(hiv.includes(word),word);
  for(const word of ["Allogreffe","Xénogreffe","phagolysosome","dendritique"])assert.ok(immune.includes(word),word);
});
test("sol et mines : équation, proportions et coût, sans fausses actualités",async()=>{
  const soil=await get("soil-fertility"),mine=await get("mining-exploitation");
  assert.ok(soil.includes("CaCO_3+2H^+"));assert.ok(soil.includes("L’**assolement**"));
  assert.ok(mine.includes("V_T}{V_M}"));assert.ok(mine.includes("coût d’extraction"));assert.ok(mine.includes("ne fixe pas"));
});
test("trois onglets SVT : URL, F5, classe et état des réponses",()=>{
  for(const view of ["evaluation","essentiel"]){
    const route=readAppRoute({pathname:"/parcours/terminale-c-svt-l1-nervous-communication",search:"?matiere=svt&vue="+view+"&domaine=analyse"},{navigation:"home"});
    assert.equal(route.courseTab,view==="evaluation"?"assessment":"essentials");assert.equal(route.mathDomain,undefined);
    const url=new URL(appRouteUrl(route,"?__level-preview=terminale-c"),"http://localhost");assert.equal(url.searchParams.get("vue"),view);assert.deepEqual(readAppRoute(url,{navigation:"home"}),route);
  }
  const questions:LessonQuestion[]=[{prompt:"Choix",options:["A","B"],correctIndex:1,explanation:"Parce que"}];
  const draft=serializePhysicsAssessment(questions,[1]);assert.deepEqual(restorePhysicsAssessment(questions,draft),[1]);
  assert.notEqual(physicsAssessmentStorageKey("u:terminale-c:c1:x"),physicsAssessmentStorageKey("u:terminale-d:d2:x"));
  assert.doesNotMatch(draft,/score|checked|open/);
  const reader=source("features/lesson/ContinuousCourseScreen.tsx");
  assert.match(reader,/const scienceTabs = physicsTabs \|\| svtTabs/);assert.match(reader,/!scienceTabs && quickChecks/);
  assert.match(reader,/SvtEssentialsPanel sheetKey={svtEssentialKey}/);
  assert.doesNotMatch(source("features/lesson/document/SvtEssentialsPanel.tsx"),/fetch\(|submitAttempt|xpAwarded/);
});
