import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { homeTips, homeTipsForLevel, homeTipStorageKey, nextHomeTip, readHomeTipRotation, saveHomeTipRotation, type HomeTipRotation } from "../apps/web/src/features/dashboard/homeTips";
import { dashboardLatestPathKey, readDashboardPreferences, recordDashboardPreference, selectHomeResumeTarget } from "../apps/web/src/features/dashboard/homeResume";
import { dashboardPathPreferenceKey } from "../apps/web/src/features/dashboard/dashboardLearningState";
import { initialDashboard, schoolLevels, subjects } from "../apps/web/src/data/programme";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog";
import type { SubjectId } from "../apps/web/src/domain/learning";
import type { ProgressByPath } from "../apps/web/src/features/dashboard/dashboardLearningState";
const require = createRequire(new URL("../apps/web/package.json",import.meta.url));
const React = require("react"), {renderToStaticMarkup} = require("react-dom/server");
(globalThis as {React?:unknown}).React = React;
require.extensions[".css"] = () => {};
const {Dashboard} = require("./src/features/dashboard/Dashboard");
const {LevelEmptyState} = require("./src/features/dashboard/LevelEmptyState");
const noop=()=>{};
const render=(component:unknown,props:Record<string,unknown>)=>renderToStaticMarkup(React.createElement(component,props));
const source=(path:string)=>readFileSync(new URL("../apps/web/src/"+path,import.meta.url),"utf8");
function storage(){const values=new Map<string,string>();return {values,getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value);}};}

test("banque de 33 rappels originaux courts, identifiants distincts et sans faux compteurs",()=>{
 assert.equal(homeTips.length,33);assert.equal(new Set(homeTips.map(tip=>tip.id)).size,33);
 for(const tip of homeTips){assert.ok(tip.text.length>=55&&tip.text.length<=200);assert.doesNotMatch(tip.text,/https?:|\$|<script|XP|100 %/);}
 for(const level of schoolLevels)assert.ok(homeTipsForLevel(level.id).length>=10);
 assert.ok(homeTipsForLevel("terminale-a").some(tip=>tip.subjectId==="philosophy"));
 assert.ok(!homeTipsForLevel("terminale-a").some(tip=>tip.subjectId==="physics-chemistry"));
 assert.ok(!homeTipsForLevel("seconde-c").some(tip=>tip.subjectId==="philosophy"));
 assert.ok(homeTipsForLevel("inconnu").every(tip=>!tip.subjectId));
});

test("un cycle propose chaque astuce une fois, sans répétition immédiate au changement de cycle",()=>{
 for(const level of schoolLevels){let previous:HomeTipRotation|undefined;const seen=new Set<string>();
  for(let i=0;i<homeTipsForLevel(level.id).length;i++){const draw=nextHomeTip(level.id,previous,()=>.5);assert.notEqual(draw.tip.id,previous?.lastId);assert.ok(!seen.has(draw.tip.id));seen.add(draw.tip.id);previous=draw.rotation;}
  const fresh=nextHomeTip(level.id,previous,()=>.5);assert.notEqual(fresh.tip.id,previous?.lastId);assert.equal(seen.size,homeTipsForLevel(level.id).length);
 }
});

test("une rotation corrompue ou d’une ancienne classe ne force pas une matière interdite",()=>{
 const previous:HomeTipRotation={version:1,lastId:"math-domain",remainingIds:["pc-units","inconnu","philo-quote","philo-quote"]};
 const copy=structuredClone(previous),draw=nextHomeTip("seconde-c",previous,()=>Number.NaN);
 assert.deepEqual(previous,copy);assert.ok(homeTipsForLevel("seconde-c").some(t=>t.id===draw.tip.id));assert.notEqual(draw.tip.subjectId,"philosophy");
 for(const value of [-1,1,100,Number.NaN])assert.ok(nextHomeTip("terminale-a",undefined,()=>value).tip);
});

test("rotation persistée compte/classe, écriture idempotente et stockage bloqué toléré",()=>{
 const store=storage(),key=homeTipStorageKey("home-focused-user", "terminale-a"),first=nextHomeTip("terminale-a",undefined,()=>0);
 saveHomeTipRotation(store,key,first.rotation);saveHomeTipRotation(store,key,first.rotation);
 assert.deepEqual(readHomeTipRotation(store,key),first.rotation);
 assert.notEqual(nextHomeTip("terminale-a",readHomeTipRotation(store,key),()=>0).tip.id,first.tip.id);
 assert.equal(readHomeTipRotation(store,homeTipStorageKey("another", "terminale-a")),undefined);
 assert.equal(readHomeTipRotation(store,homeTipStorageKey("home-focused-user", "terminale-d")),undefined);
 const blocked={getItem:()=>{throw Error("blocked");},setItem:()=>{throw Error("blocked");}};
 saveHomeTipRotation(blocked,"blocked-test-home",first.rotation);assert.deepEqual(readHomeTipRotation(blocked,"blocked-test-home"),first.rotation);
 store.setItem("bad-test-home","{invalid");assert.equal(readHomeTipRotation(store,"bad-test-home"),undefined);
});

test("l’accueil suit la maquette : bienvenue, astuce au-dessus de la reprise, un bouton et un lien",()=>{
 const html=render(Dashboard,{userId:"render-focused",content:{...initialDashboard,learnerName:" Kévin Davy",levelId:"terminale-a",lesson:{...initialDashboard.lesson,title:"Fonctions rationnelles",eyebrow:"Là où tu en étais",ctaLabel:"Reprendre mon cours"}},onResumeLesson:noop,onOpenCourses:noop,onOpenSpace:noop});
 assert.match(html,/Bienvenue, Kévin !/);assert.match(html,/Astuce à retenir/);assert.match(html,/Reprendre mon cours/);assert.match(html,/Choisir un autre cours/);
 assert.ok(html.indexOf("home-learning-tip")<html.indexOf("home-resume-card"));
 assert.doesNotMatch(html,/Un petit pas|Bonjour|Qu’as-tu|Terminale|<select|home-action-card|data-home-card|Mathématiques|Mes matières|Offrir un café/);
 assert.equal((html.match(/<button/g)??[]).length,3);assert.match(html,/home-book-artwork/);
 assert.match(html,/Ouvrir mon espace personnel/);
});

test("titre en KaTeX, nom échappé et échec de synchronisation restent lisibles",()=>{
 const html=render(Dashboard,{userId:"render-escaped",content:{...initialDashboard,learnerName:"<script> Élève",lesson:{...initialDashboard.lesson,title:String.raw`Limites en $+\infty$`}},onResumeLesson:noop,onOpenCourses:noop,onOpenSpace:noop,syncIssue:{message:"Synchronisation interrompue.",onRetry:noop}});
 assert.match(html,/katex/);assert.doesNotMatch(html,/katex-error|<script>/);assert.match(html,/&lt;script&gt;/);
 assert.match(html,/role="alert"/);assert.match(html,/Réessayer/);assert.match(html,/Synchronisation interrompue/);
});

test("pas de cours disponible : pas de reprise inventée ni classe visible sur l’accueil",()=>{
 const level=schoolLevels.find(l=>l.id==="premiere-d")!;
 const html=render(LevelEmptyState,{mode:"home",profile:{name:"Aya",levelId:level.id},level,subject:subjects.mathematics,subjects:[subjects.mathematics],userId:"empty-focused",onSubjectChange:noop,onOpenProfile:noop,onBackHome:noop,onOpenSpace:noop,onOpenCourses:noop});
 assert.match(html,/Bienvenue, Aya !/);assert.match(html,/Astuce à retenir/);assert.match(html,/Aucun cours disponible/);assert.match(html,/Voir mes cours/);
 assert.doesNotMatch(html,/home-resume-card|data-home-card|Terminale|Première|Niveau et série|<select|Reprendre mon cours/);
 const paths=render(LevelEmptyState,{mode:"paths",profile:{name:"Aya",levelId:level.id},level,subject:subjects.mathematics,subjects:[subjects.mathematics],onSubjectChange:noop,onOpenProfile:noop,onBackHome:noop});
 assert.match(paths,/Première D/);assert.match(paths,/<select/);
});

const allowed=Object.values(subjects).filter(item=>item.enabled&&(!item.levelIds||item.levelIds.includes("terminale-c"))).map(s=>s.id);
const math=curriculumLessonTitles.find(e=>e.levelId==="terminale-c"&&e.subjectId==="mathematics"&&e.pathId)!;
const philo=curriculumLessonTitles.find(e=>e.levelId==="terminale-c"&&e.subjectId==="philosophy"&&e.pathId)!;
const select=(preferences:{pathId:string;openedAt:string}[]=[],progressByPath:ProgressByPath={})=>selectHomeResumeTarget({catalog:curriculumLessonTitles,loadedPaths:[],levelId:"terminale-c",allowedSubjects:allowed,progressByPath,preferences,fallbackSubjectId:"mathematics"});
test("la reprise choisit le cours le plus récent à travers les matières, avec repli honnête",()=>{
 assert.equal(select()?.pathId,math.pathId);assert.equal(select()?.hasActivity,false);
 assert.equal(select([{pathId:math.pathId!,openedAt:"2026-11-01T09:00:00Z"},{pathId:philo.pathId!,openedAt:"2026-11-01T10:00:00Z"}])?.pathId,philo.pathId);
 const server:ProgressByPath={[math.pathId!]:{test:{pathId:math.pathId!,lessonId:"test",xpAwarded:10,bestScore:20,attemptCount:1,completedAt:"2026-11-01T11:00:00Z"}}};
 assert.equal(select([{pathId:philo.pathId!,openedAt:"2026-11-01T10:00:00Z"}],server)?.pathId,math.pathId);
 assert.equal(select([{pathId:philo.pathId!,openedAt:"2026-11-01T12:00:00Z"}],server)?.pathId,philo.pathId);
});

test("reprise cloisonnée : ancien compte, autre classe, cours inconnu et matière fermée exclus",()=>{
 const store=storage(),pref={pathId:philo.pathId!,openedAt:"2026-11-01T10:00:00Z"};
 recordDashboardPreference(store,"resume-a","terminale-c","philosophy",pref);
 assert.ok(store.values.has(dashboardLatestPathKey("resume-a","terminale-c")));
 assert.ok(store.values.has(dashboardPathPreferenceKey("resume-a","terminale-c","philosophy")));
 assert.equal(readDashboardPreferences(store,"resume-a","terminale-c",["philosophy"]).length,4);
 assert.deepEqual(readDashboardPreferences(store,"resume-b","terminale-c",["philosophy"]),[]);
 assert.deepEqual(readDashboardPreferences(store,"resume-a","seconde-c",["philosophy"]),[]);
 assert.equal(select([{pathId:"inconnu",openedAt:pref.openedAt}])?.hasActivity,false);
 assert.equal(selectHomeResumeTarget({catalog:curriculumLessonTitles,loadedPaths:[],levelId:"terminale-c",allowedSubjects:["mathematics"],progressByPath:{},preferences:[pref],fallbackSubjectId:"mathematics"})?.subjectId,"mathematics");
 assert.equal(selectHomeResumeTarget({catalog:curriculumLessonTitles,loadedPaths:[],levelId:"premiere-d",allowedSubjects:allowed,progressByPath:{},preferences:[pref],fallbackSubjectId:"mathematics"}),null);
 store.setItem(dashboardLatestPathKey("bad-resume","terminale-c"),"not-json");assert.deepEqual(readDashboardPreferences(store,"bad-resume","terminale-c",[]),[]);
});

test("ancien stockage par matière repris et stockage bloqué conservé en mémoire",()=>{
 const store=storage(),pref={pathId:philo.pathId!,openedAt:"2026-11-01T10:00:00Z"};
 store.setItem(dashboardPathPreferenceKey("legacy-resume","terminale-c","philosophy"),JSON.stringify(pref));
 assert.equal(select(readDashboardPreferences(store,"legacy-resume","terminale-c",["philosophy"]))?.pathId,philo.pathId);
 const blocked={getItem:()=>{throw Error("blocked");},setItem:()=>{throw Error("blocked");}};
 recordDashboardPreference(blocked,"memory-resume","terminale-c","philosophy",pref);
 assert.ok(readDashboardPreferences(blocked,"memory-resume","terminale-c",["philosophy"]).some(item=>item.pathId===pref.pathId));
});

test("la rotation attend les vraies visites et l’espace reste calme, tactile et sans animation imposée",()=>{
 const welcome=source("features/dashboard/HomeWelcome.tsx"),shell=source("LearningApp.tsx"),css=source("styles/home-focused.css");
 assert.match(welcome,/useState\(\(\) => nextHomeTip/);assert.match(welcome,/saveHomeTipRotation/);assert.doesNotMatch(welcome,/setInterval|setTimeout|apiRequest|fetch\(/);
 assert.match(shell,/allowedRoute.navigation === "home"\) setHomeVisitKey/);assert.match(shell,/visitKey=\{homeVisitKey\}/);assert.match(shell,/recordDashboardPreference/);
 assert.match(css,/max-width: 1080px/);assert.match(css,/min-height: 44px/);assert.match(css,/font-size: 1rem/);assert.match(css,/home-book-artwork \{ display: none/);assert.doesNotMatch(css,/animation:|height: 100vh/);
 assert.match(source("features/dashboard/HomeBookArtwork.tsx"),/<svg/);assert.doesNotMatch(source("features/dashboard/HomeBookArtwork.tsx"),/<image|http/);
});
