import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { initialDashboard, schoolLevels, subjects } from "../apps/web/src/data/programme";
import type { LearningPath } from "../apps/web/src/domain/paths";
import { homeCourseViews } from "../apps/web/src/features/dashboard/homeCourseViews";
import { showDocumentHome, showHistoricalHome, showOriginalHome } from "../apps/web/src/config/homeLayout";
const require=createRequire(new URL("../apps/web/package.json",import.meta.url));
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");(globalThis as {React?:unknown}).React=React;require.extensions[".css"]=()=>{};
const {DocumentDashboard}=require("./src/features/dashboard/DocumentDashboard"),{LevelEmptyState}=require("./src/features/dashboard/LevelEmptyState");
const noop=()=>{},source=(file:string)=>readFileSync(new URL("../apps/web/src/"+file,import.meta.url),"utf8");
const level=schoolLevels.find(l=>l.id==="terminale-a")!;
const props={content:{...initialDashboard,levelId:level.id},progress:0,level,subject:subjects.mathematics,subjects:[subjects.mathematics,subjects.philosophy],courseViews:["summary","assessment","essentials"],onSubjectChange:noop,onResumeLesson:noop,onOpenCourseView:noop,onAskHint:noop,onOpenGoal:noop,onOpenArena:noop,onOpenSpace:noop};
const render=(overrides:Record<string,unknown>={})=>renderToStaticMarkup(React.createElement(DocumentDashboard,{...props,...overrides}));
const path=(subjectId:LearningPath["subjectId"],id="test",levelIds=[level.id])=>({id,subjectId,levelIds} as LearningPath);

test("la structure historique adopte les encadrements documentaires sans revenir aux cartes",()=>{
 const html=render();assert.match(html,/document-home-course/);assert.match(html,/document-home-visual/);assert.match(html,/Bonjour, Aïcha/);
 assert.match(html,/Objectif du jour/);assert.match(html,/Choisir une leçon à revoir/);assert.match(html,/M’entraîner/);
 assert.doesNotMatch(html,/home-action-grid|lesson-hero|0\/3|étapes terminées|68 %|min de lecture|platform-stats|home-learning-tip/);
 assert.equal((html.match(/<select/g)??[]).length,1);assert.match(html,/aria-label="Matière"/);assert.match(html,/Terminale A/);
 assert.match(html,/Ouvrir mon espace personnel/);
});
test("la progression affichée est bornée et une panne n’invente pas 0 %",()=>{
 for(const [value,expected] of [[0,0],[42.4,42],[99.8,100],[-5,0],[120,100]])assert.match(render({progress:value}),new RegExp(`Progression enregistrée : ${expected} %`));
 for(const value of [null,Number.NaN,Number.POSITIVE_INFINITY]){const html=render({progress:value});assert.match(html,/Progression indisponible/);assert.doesNotMatch(html,/Progression enregistrée : 0 %|NaN|Infinity/);}
});
test("les trois boutons sont des liens de navigation du cours, pas de faux onglets de page",()=>{
 const html=render();assert.equal((html.match(/data-course-view=/g)??[]).length,3);assert.match(html,/aria-label="Ouvrir une partie du cours"/);
 for(const label of ["Résumé de la leçon","Questions d’évaluation","L’essentiel"])assert.ok(html.includes(label));
 assert.doesNotMatch(html,/role="tab"|aria-selected/);
 assert.equal((render({courseViews:["summary"]}).match(/data-course-view=/g)??[]).length,1);
});
test("les boutons correspondent aux vues effectivement prises en charge par le lecteur",()=>{
 const math=path("mathematics");math.courseDocument={levelIds:[level.id],evaluations:[]} as NonNullable<LearningPath["courseDocument"]>;
 assert.deepEqual(homeCourseViews(math,level.id),["summary","assessment","essentials"]);
 const french={...math,subjectId:"french" as const};assert.deepEqual(homeCourseViews(french,level.id),["summary","assessment"]);
 french.courseDocument={...french.courseDocument!,essentials:[]};assert.deepEqual(homeCourseViews(french,level.id),["summary","assessment"]);
 assert.deepEqual(homeCourseViews(math,"seconde-c"),[]);
 for(const subject of ["svt","history-geography","philosophy"] as const){const p=path(subject,subject==="philosophy"?"terminale-philo-l1-dissertation":"test");assert.deepEqual(homeCourseViews(p,level.id),["summary","assessment","essentials"]);}
 assert.deepEqual(homeCourseViews(path("philosophy","unknown"),level.id),["summary"]);
 assert.deepEqual(homeCourseViews(path("physics-chemistry","test",["terminale-c"]),"terminale-c"),["summary","assessment","essentials"]);
 assert.deepEqual(homeCourseViews(path("mathematics","terminale-d-math-l08-complex-geometry",["terminale-d"]),"terminale-d"),["summary","essentials"]);
});
test("un ancien cours C/D avec fiche garde son accès essentiel sans évaluation distincte inventée",()=>{
 const p=path("mathematics","terminale-c-math-l13-complex-geometry",["terminale-c"]),before=structuredClone(p);
 assert.deepEqual(homeCourseViews(p,"terminale-c"),["summary","essentials"]);assert.deepEqual(p,before);
});
test("les noms restent échappés et les titres mathématiques restent rendus",()=>{
 const html=render({content:{...props.content,learnerName:'<script>alert(1)</script>',lesson:{...props.content.lesson,title:String.raw`Limites en $+\infty$`}}});
 assert.doesNotMatch(html,/<script>|katex-error/);assert.match(html,/&lt;script&gt;/);assert.match(html,/katex/);
});
test("les erreurs de synchronisation et leur bouton de réessai sont conservés",()=>{
 const html=render({progress:null,syncIssue:{message:"Synchronisation interrompue",onRetry:noop}});assert.match(html,/role="alert"/);assert.match(html,/Synchronisation interrompue/);assert.match(html,/Réessayer/);assert.match(html,/Progression indisponible/);
});
test("le même style sait afficher un compte sans cours sans lui inventer une leçon de Terminale",()=>{
 const emptyLevel=schoolLevels.find(l=>l.id==="premiere-d")!;
 const html=renderToStaticMarkup(React.createElement(LevelEmptyState,{mode:"home",homeStyle:"document",profile:{name:"Nadia",levelId:emptyLevel.id},level:emptyLevel,subject:subjects.mathematics,subjects:[subjects.mathematics],onSubjectChange:noop,onOpenProfile:noop,onBackHome:noop,onOpenCourses:noop}));
 assert.match(html,/document-home-empty/);assert.match(html,/Aucun cours disponible/);assert.match(html,/Bonjour, Nadia/);assert.doesNotMatch(html,/document-home-ring|data-course-view|Terminale|home-learning-tip/);
});
test("la variante approuvée est prioritaire mais ne supprime aucun des anciens rendus",()=>{
 assert.equal(showDocumentHome,true);assert.equal(showHistoricalHome,true);assert.equal(showOriginalHome,true);
 const root=source("LearningApp.tsx");assert.ok(root.indexOf(") : showDocumentHome ? (")<root.indexOf(") : showHistoricalHome ? ("));
 assert.match(root,/onOpenCourseView=\{courseTab => dashboardPath && navigate\(\{ navigation: "paths", subjectId: dashboardPath.subjectId, pathId: dashboardPath.id, courseTab \}\)\}/);
 assert.match(root,/progress=\{progressError \? null/);assert.match(root,/homeStyle=\{showDocumentHome \? "document" : undefined\}/);
 for(const name of ["HistoricalDashboard","OriginalDashboard","Dashboard"])assert.ok(source(`features/dashboard/${name}.tsx`).length>0);
});
test("les styles sont contenus à l’accueil, calmes et adaptés à la lecture tactile",()=>{
 const css=source("styles/home-document.css");assert.match(css,/#142c4b/);assert.match(css,/#0d6c68/);assert.match(css,/max-width: 1160px/);assert.match(css,/height: 172px/);assert.match(css,/min-height: 44px/);assert.doesNotMatch(css,/animation:|transition:|100vh|\.lesson-document\s*\{/);
 const shell=source("features/dashboard/DocumentDashboard.tsx");assert.doesNotMatch(shell,/fetch\(|apiRequest|submitAttempt|window\.localStorage/);assert.match(shell,/courseViews.includes\(view.id\)/);
});
test("la courbe d’accueil garde le modèle historique avec un SVG natif sans observateur de taille",()=>{
 const {HomeSubjectPreview,homeParabola}=require("./src/features/dashboard/HomeSubjectPreview");
 assert.deepEqual(homeParabola,{coefficient:.42,constant:-2,xMin:-5,xMax:5,yMin:-3,yMax:9});
 const html=renderToStaticMarkup(React.createElement(HomeSubjectPreview,{subject:subjects.mathematics,lessonTitle:"Fonctions"}));
 assert.match(html,/Parabole représentant une fonction du second degré/);assert.match(html,/<svg/);assert.match(html,/M20.000,30.417/);assert.equal((html.match(/<circle/g)??[]).length,3);
 assert.doesNotMatch(source("features/dashboard/HomeSubjectPreview.tsx"),/ResponsiveContainer|ResizeObserver|new Image|<image/);
});
