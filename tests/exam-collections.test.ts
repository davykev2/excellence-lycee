import assert from "node:assert/strict";
import test from "node:test";
import {createRequire} from "node:module";
import {readFileSync} from "node:fs";
import {appRouteUrl,readAppRoute} from "../apps/web/src/routing/appRoute";
import {bacExamCatalog} from "../apps/web/src/data/bacExamCatalog";
import {INP_HB_COLLECTION_LOCKED,isCurrentExamSubjectLocked} from "../apps/web/src/config/examCollections";
import ts from "../apps/api/node_modules/typescript/lib/typescript.js";
const require=createRequire(new URL("../apps/web/package.json",import.meta.url)),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
(globalThis as {React?:unknown}).React=React;
const officialCatalog=require("./src/data/officialBacCatalog");
const officialLibrary=require("./src/features/arena/OfficialBacLibrary");
const officialReader=require("./src/features/arena/OfficialBacReader");
// UI-only render: isolate the network hook; the real hook is exercised in browser QA.
const pageSource=readFileSync(new URL("../apps/web/src/features/arena/BacExamLibraryPage.tsx",import.meta.url),"utf8");
const compiled=ts.transpileModule(pageSource,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
let examHookCalls=0;
const render=(collection?:"inp-hb"|"bac",locked=INP_HB_COLLECTION_LOCKED)=>{
 const pageModule={exports:{} as Record<string,unknown>};
 new Function("exports","require",compiled)(pageModule.exports,(name:string)=>name==="./useBacExam"?{useBacExam:()=>{examHookCalls++;return {state:{subjectPublished:true},loading:false};}}:name==="../../data/bacExamCatalog"?{bacExamCatalog}:name==="../../config/examCollections"?{INP_HB_COLLECTION_LOCKED:locked}:name==="../../data/officialBacCatalog"?officialCatalog:name==="./OfficialBacLibrary"?officialLibrary:name==="./OfficialBacReader"?officialReader:require(name));
 return renderToStaticMarkup(React.createElement(pageModule.exports.BacExamLibraryPage,{preview:true,collection,levelId:"terminale-a",onArchiveSelection:()=>{},onCollectionChange:()=>{},onBackArena:()=>{},onOpenExam:()=>{}}));
};
test("les deux accès restent accessibles, mais le contenu INP-HB est verrouillé même en aperçu",()=>{
 examHookCalls=0;const html=render();assert.match(html,/>INP-HB<|>INP-HB<\/span>/);assert.match(html,/Anciens sujets de BAC/);assert.match(html,/role="tablist"/);
 assert.match(html,/Contenu INP-HB verrouillé/);assert.match(html,/Verrouillé/);assert.doesNotMatch(html,/bac-library-card|Session 20|sessions disponibles|Commencer le sujet/);assert.equal(examHookCalls,0);
 assert.match(html,/id="exam-tab-inp-hb"[^>]*aria-selected="true"/);
 assert.equal((html.match(/aria-controls="exam-collection-panel"/g)??[]).length,2);assert.match(html,/id="exam-collection-panel"/);
});
test("désactiver le verrou ultérieurement restitue toutes les cartes sans modifier les données",()=>{
 const html=render("inp-hb",false);
 assert.equal((html.match(/<article class="bac-library-card/g)??[]).length,bacExamCatalog.length);
 assert.match(html,/Annales ESATIC/);assert.match(html,/Sujets INP-HB/);assert.match(html,/id="exam-tab-inp-hb"[^>]*aria-selected="true"/);
 assert.equal((html.match(/aria-controls="exam-collection-panel"/g)??[]).length,2);assert.match(html,/id="exam-collection-panel"/);
});
test("tous les anciens liens de sujets et résultats passent par le verrou avant les lecteurs",()=>{
 assert.equal(INP_HB_COLLECTION_LOCKED,true);for(const exam of bacExamCatalog)assert.equal(isCurrentExamSubjectLocked(exam.slug),true,exam.slug);
 assert.equal(isCurrentExamSubjectLocked(undefined),false);assert.equal(isCurrentExamSubjectLocked("inconnu"),false);
 const source=readFileSync(new URL("../apps/web/src/features/arena/ArenaScreen.tsx",import.meta.url),"utf8");
 const guard=source.indexOf("isCurrentExamSubjectLocked(selectedBacExam.slug)");assert.ok(guard>0);assert.ok(guard<source.indexOf('selectedBacExam.format === "facsimile"'));assert.ok(guard<source.indexOf("return <BacCi2024ExamPage"));
});
test("BAC propose les années fournies, sans lien de dépôt ni appel d’examen",()=>{
 examHookCalls=0;const html=render("bac");assert.match(html,/Choisis une année/);assert.match(html,/>2025</);assert.match(html,/>2026</);assert.doesNotMatch(html,/bac-library-card|Commencer le sujet|sessions disponibles/);assert.equal(examHookCalls,0);
 assert.match(html,/id="exam-tab-bac"[^>]*aria-selected="true"/);
});
test("les collections survivent aux URL, F5 et à l’historique sans changer les liens de sujets",()=>{
 for(const collection of ["inp-hb","bac"] as const){
  const route={navigation:"arena" as const,subjectId:"mathematics" as const,arenaMode:"bac" as const,examCollection:collection};
  const url=appRouteUrl(route,"?__paths-preview=1&__level-preview=terminale-a");assert.ok(url.includes("collection="+collection));assert.equal(readAppRoute(new URL(url,"http://127.0.0.2:4174"),{navigation:"home"}).examCollection,collection);
 }
 for(const exam of bacExamCatalog){const url=appRouteUrl({navigation:"arena",arenaMode:"bac",bacExamSlug:exam.slug,examCollection:"bac"},"");assert.ok(url.startsWith("/arene/exos-types-bac/"+exam.slug));assert.ok(!url.includes("collection="));}
});
test("les valeurs invalides et les autres pages ne récupèrent aucune collection",()=>{
 for(const pathname of ["/parcours","/arene/exercices","/arene/exos-types-bac/2024"]){assert.equal(readAppRoute({pathname,search:"?collection=bac"},{navigation:"home"}).examCollection,undefined);}
 assert.equal(readAppRoute({pathname:"/arene/exos-types-bac",search:"?collection=autre"},{navigation:"home"}).examCollection,undefined);
});
test("clavier, présentation mobile et raccord du routeur sont explicites",()=>{
 const source=readFileSync(new URL("../apps/web/src/features/arena/BacExamLibraryPage.tsx",import.meta.url),"utf8"),css=readFileSync(new URL("../apps/web/src/styles/bac-library.css",import.meta.url),"utf8");
 for(const key of ["ArrowRight","ArrowLeft","Home","End"])assert.ok(source.includes(key));assert.match(css,/grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);assert.match(css,/min-height: 56px/);
});
