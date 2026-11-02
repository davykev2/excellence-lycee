import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { schoolLevels, subjects } from "../apps/web/src/data/programme";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog";
import { courseLibraryReferences } from "../apps/web/src/data/courseLibraryReferences";
import { appRouteUrl, readAppRoute, routeForNavigation } from "../apps/web/src/routing/appRoute";
import { HOMEWORKS_TEMPORARILY_LOCKED } from "../apps/web/src/config/homeworkAccess";
import type { LearningPath } from "../apps/web/src/domain/paths";
const require=createRequire(new URL("../apps/web/package.json",import.meta.url));
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");(globalThis as {React?:unknown}).React=React;require.extensions[".css"]=()=>{};
const {SubjectLibraryScreen,subjectLibraryItems,subjectLibraryCourses,normalizeLibrarySearch}=require("./src/features/paths/SubjectLibraryScreen");
const {LearningLibraryScreen}=require("./src/features/paths/LearningLibraryScreen");
const {TrainingHub}=require("./src/features/arena/TrainingHub");
const {HomeworkLockedPage}=require("./src/features/arena/homework/HomeworkLockedPage");
const noop=()=>{},source=(path:string)=>readFileSync(new URL("../apps/web/src/"+path,import.meta.url),"utf8");
const level=schoolLevels.find(l=>l.id==="terminale-d")!;
const allSubjects=Object.values(subjects),catalog={subjects:allSubjects,paths:[],catalogLessons:curriculumLessonTitles,references:courseLibraryReferences};
const render=(component:unknown,props:Record<string,unknown>)=>renderToStaticMarkup(React.createElement(component,props));

test("Mes cours entre par les matières autorisées de la classe, sans Physique-Chimie en A",()=>{
 for(const levelId of ["terminale-a","terminale-c","terminale-d"]){
  const items=subjectLibraryItems({...catalog,levelId});assert.equal(items.length,levelId==="terminale-a"?6:7);
  assert.equal(items.some((item:{subject:{id:string}})=>item.subject.id==="physics-chemistry"),levelId!=="terminale-a");
  assert.equal(items.find((item:{subject:{id:string}})=>item.subject.id==="english").ready,false);
  for(const item of items.filter((item:{subject:{enabled:boolean}})=>item.subject.enabled))assert.equal(item.ready,true,item.subject.id+levelId);
 }
});
test("aucun contenu d’une autre classe ou sans publication n’est présenté comme prêt",()=>{
 const items=subjectLibraryItems({...catalog,levelId:"premiere-d"});assert.ok(items.length>0);assert.ok(items.every((item:{ready:boolean})=>!item.ready));
 const fake={id:"x",subjectId:"mathematics",levelIds:["terminale-d"]} as LearningPath;
 assert.equal(subjectLibraryItems({subjects:[subjects.mathematics],levelId:"terminale-d",paths:[fake],catalogLessons:[]})[0].ready,true);
 assert.equal(subjectLibraryItems({subjects:[subjects.mathematics],levelId:"terminale-a",paths:[fake],catalogLessons:[]})[0].ready,false);
});
test("les cartes restent compactes, nommées et réellement désactivées quand indisponibles",()=>{
 const html=render(SubjectLibraryScreen,{...catalog,level,onChooseSubject:noop,onBackHome:noop});
 assert.equal((html.match(/data-subject-id=/g)??[]).length,7);assert.match(html,/Matières de ma classe/);assert.match(html,/data-subject-id="english" disabled/);assert.match(html,/Bientôt/);assert.match(html,/leçons/);assert.doesNotMatch(html,/<select|XP|niveaux débloqués/);
 const css=source("styles/subject-library.css");assert.match(css,/repeat\(3, minmax\(0, 1fr\)\)/);assert.match(css,/repeat\(2, minmax\(0, 1fr\)\)/);assert.match(css,/min-height: 152px/);assert.match(css,/min-height: 137px/);assert.doesNotMatch(css,/animation:|height: 100vh/);
});
test("les illustrations sont des assets réels, avec texte HTML et palette du produit",()=>{
 const html=render(SubjectLibraryScreen,{...catalog,level,onChooseSubject:noop,onBackHome:noop});
 assert.equal((html.match(/class="subject-library-art"/g)??[]).length,7);
 for(const id of Object.keys(subjects))assert.match(html,new RegExp(`/illustrations/subjects/${id}\\.webp`));
 assert.match(html,/type="search"/);assert.match(html,/Rechercher une matière, un chapitre, un cours/);assert.match(html,/aria-controls="subject-library-results"/);
 const css=source("styles/subject-library.css");assert.match(css,/#142c4b/);assert.match(css,/#0d6c68/);assert.match(css,/object-fit: contain/);assert.match(css,/prefers-reduced-motion/);
});
test("les huit illustrations livrées sont des WebP locaux légers, pas des images de maquette",()=>{
 for(const name of [...Object.keys(subjects),"library-banner"]){
  const file=readFileSync(new URL(`../apps/web/public/illustrations/subjects/${name}.webp`,import.meta.url));
  assert.equal(file.subarray(0,4).toString(),"RIFF");assert.equal(file.subarray(8,12).toString(),"WEBP");
  assert.ok(file.byteLength>1000&&file.byteLength<100000,name+" asset size");
 }
});
test("les vrais nombres de leçons dédupliquent les publications et excluent les cartes à fournir",()=>{
 const courses=subjectLibraryCourses({...catalog,levelId:level.id});
 assert.equal(new Set(courses.map((course:{id:string})=>course.id)).size,courses.length);
 assert.ok(courses.every((course:{subjectId:string,title:string})=>course.subjectId!=="english"&&!course.title.includes("document à fournir")));
 const math=courses.find((course:{subjectId:string})=>course.subjectId==="mathematics");
 const duplicated=subjectLibraryCourses({...catalog,levelId:level.id,paths:[{id:math.id,title:math.title,subjectId:math.subjectId,levelIds:[level.id]} as LearningPath]});
 assert.equal(duplicated.length,courses.length);
 const cards=subjectLibraryItems({...catalog,levelId:level.id});
 for(const item of cards)assert.equal(item.courseCount,courses.filter((course:{subjectId:string})=>course.subjectId===item.subject.id).length);
 assert.ok(subjectLibraryCourses({...catalog,levelId:"premiere-d"}).length===0);
});
test("la recherche tolère accents, casse et apostrophes sans toucher aux titres sources",()=>{
 assert.equal(normalizeLibrarySearch("  ÉQUATIONS   différentielles "),"equations differentielles");
 assert.equal(normalizeLibrarySearch("Histoire-Géographie"),"histoire geographie");
 assert.equal(normalizeLibrarySearch("L’HOMME"),normalizeLibrarySearch("l'homme"));
 const courses=subjectLibraryCourses({...catalog,levelId:level.id});
 const matches=courses.filter((course:{title:string})=>normalizeLibrarySearch(course.title).includes("limites"));
 assert.ok(matches.length>0);assert.ok(matches.every((course:{subjectId:string})=>course.subjectId==="mathematics"));
 assert.match(source("features/paths/SubjectLibraryScreen.tsx"),/onOpenCourse\(course\)/);
 assert.match(source("LearningApp.tsx"),/onOpenCourse=.*navigate\(/);
});
test("le sélecteur de matières ne charge pas tous les cours et ne modifie aucun contenu",()=>{
 const before=JSON.stringify([subjects,curriculumLessonTitles,courseLibraryReferences]);subjectLibraryItems({...catalog,levelId:level.id});assert.equal(JSON.stringify([subjects,curriculumLessonTitles,courseLibraryReferences]),before);
 assert.doesNotMatch(source("features/paths/SubjectLibraryScreen.tsx"),/loadLearningPaths|apiRequest|fetch\(|\.modules|localStorage/);
});
test("menu Mes cours et URL des matières distincts de la liste d’une matière, stables après F5",()=>{
 const hub=routeForNavigation("paths","mathematics");assert.equal(hub.libraryView,undefined);assert.equal(appRouteUrl(hub,""),"/parcours?matiere=mathematics");
 const lessons=readAppRoute({pathname:"/parcours",search:"?matiere=mathematics&vue=lecons&domaine=algebre"},{navigation:"home"});
 assert.equal(lessons.libraryView,"lessons");assert.equal(lessons.mathDomain,"algebre");assert.equal(appRouteUrl(lessons,""),"/parcours?matiere=mathematics&vue=lecons&domaine=algebre");
 for(const view of ["evaluation","essentiel"]){const path=readAppRoute({pathname:"/parcours/test",search:"?matiere=mathematics&vue="+view},{navigation:"home"});assert.equal(path.libraryView,undefined);assert.equal(path.courseTab,view==="evaluation"?"assessment":"essentials");}
 assert.equal(readAppRoute({pathname:"/parcours",search:"?vue=inconnu"},{navigation:"home"}).libraryView,undefined);
});
test("le contenu existant d’une matière conserve recherche, domaines et retour aux matières",()=>{
 const html=render(LearningLibraryScreen,{level,subjects:allSubjects,selectedSubjectId:"mathematics",paths:[],catalogLessons:curriculumLessonTitles,onSubjectChange:noop,onSelectPath:noop,onBackHome:noop,onBackSubjects:noop,mathDomain:"analyse",onMathDomainChange:noop,references:courseLibraryReferences});
 assert.match(html,/Les matières/);assert.match(html,/<h1>Mathématiques<\/h1>/);assert.match(html,/Rechercher une leçon/);assert.match(html,/Analyse et probabilité/);assert.match(html,/Algèbre et géométrie/);assert.doesNotMatch(html,/class="subject-picker"/);
 const shell=source("LearningApp.tsx");assert.match(shell,/activeNavigation === "paths" && route.libraryView !== "lessons"/);assert.match(shell,/libraryView: "lessons", mathDomain: route.mathDomain/);assert.match(shell,/onBackSubjects=/);
});
test("Devoirs conserve sa carte avec cadenas mais n’a plus d’action ni de focus activable",()=>{
 assert.equal(HOMEWORKS_TEMPORARILY_LOCKED,true);
 const html=render(TrainingHub,{level,subject:subjects.mathematics,subjects:allSubjects,onSubjectChange:noop,onOpenExercises:noop,onOpenHomeworks:noop,onOpenExams:noop,onOpenCodex:noop,onOpenDuel:noop});
 assert.match(html,/is-blue is-locked" type="button" disabled/);assert.match(html,/Temporairement verrouillé/);assert.match(html,/Devoirs/);assert.match(html,/Faire des exercices/);assert.match(html,/Voir les sujets/);
 const noHomework=render(TrainingHub,{level,subject:subjects.mathematics,subjects:allSubjects,onSubjectChange:noop,onOpenExercises:noop,onOpenCodex:noop,onOpenDuel:noop});assert.doesNotMatch(noHomework,/Devoirs/);
});
test("les liens directs de Devoirs rencontrent le verrou avant le montage des bibliothèques et copies",()=>{
 const screen=source("features/arena/ArenaScreen.tsx"),gate=screen.indexOf("if (HOMEWORKS_TEMPORARILY_LOCKED) return <HomeworkLockedPage");
 assert.ok(gate>screen.indexOf("if (homeworkOpen)"));assert.ok(gate<screen.indexOf("if (homeworkRef) return <HomeworkExamPage"));assert.ok(gate<screen.indexOf("return <HomeworkLibraryPage"));
 const html=render(HomeworkLockedPage,{onBack:noop});assert.match(html,/Devoirs temporairement verrouillés/);assert.match(html,/M’entraîner/);assert.doesNotMatch(html,/<input|<form|télécharger|Soumettre|<textarea/);
 assert.doesNotMatch(source("features/arena/homework/HomeworkLockedPage.tsx"),/apiRequest|useHomework|fetch\(|submit/);
 assert.match(source("config/homeworkAccess.ts"),/does not delete|Does not delete/);
});
