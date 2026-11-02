import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
import {appRouteUrl,readAppRoute} from "../apps/web/src/routing/appRoute";
import {schoolLevels,subjects} from "../apps/web/src/data/programme";
import {curriculumLessonTitles} from "../apps/web/src/data/curriculumCatalog";
const require=createRequire(new URL("../apps/web/package.json",import.meta.url));
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");(globalThis as {React?:unknown}).React=React;
const {TrainingHub}=require("./src/features/arena/TrainingHub"),{SubjectLibraryScreen}=require("./src/features/paths/SubjectLibraryScreen");
const noOp=()=>{},level=schoolLevels.find(item=>item.id==="terminale-d")!;
const source=(path:string)=>readFileSync(new URL("../apps/web/src/"+path,import.meta.url),"utf8");
const render=(component:unknown,props:Record<string,unknown>)=>renderToStaticMarkup(React.createElement(component,props));
const hubProps={level,subject:subjects.mathematics,subjects:Object.values(subjects),onSubjectChange:noOp,onOpenExercises:noOp,onOpenHomeworks:noOp,onOpenExams:noOp,onOpenPhiloMemory:noOp,onOpenFrenchWorkshop:noOp,onOpenCodex:noOp,onOpenDuel:noOp};
test("entraînement : cinq cartes illustrées utiles, sans sélecteur de matière préalable",()=>{
 const html=render(TrainingHub,hubProps);assert.match(html,/training-page is-illustrated/);assert.match(html,/M’entraîner/);
 assert.equal((html.match(/class="training-card-art"/g)??[]).length,5);
 for(const title of ["Exercices","Devoirs","Sujets d’examen","Citations &amp; notions","Atelier de français"])assert.ok(html.includes(title),title);
 assert.doesNotMatch(html,/<select|Matière de l’entraînement/);assert.match(html,/is-blue is-locked" type="button" disabled/);assert.match(html,/Temporairement verrouillé/);
});
test("la disponibilité des cartes et outils dépend toujours des actions autorisées",()=>{
 const html=render(TrainingHub,{...hubProps,onOpenHomeworks:undefined,onOpenExams:undefined,onOpenPhiloMemory:undefined,onOpenFrenchWorkshop:undefined});
 assert.doesNotMatch(html,/training\/homeworks|training\/exams|Ouvrir Mémoire philo|Ouvrir l’atelier/);
 assert.match(html,/Courbes et géométrie/);assert.match(html,/Défier un camarade/);assert.match(html,/Quiz, bientôt disponible/);
 const screen=source("features/arena/ArenaScreen.tsx");assert.match(screen,/onOpenPhiloMemory=\{canAccessPhiloMemory/);assert.match(screen,/onOpenFrenchWorkshop=\{canAccessFrenchWorkshop/);
});
test("les trois images d’entraînement sont des WebP réels optimisés et décoratifs",()=>{
 for(const name of ["exercises","homeworks","exams"]){const file=readFileSync(new URL(`../apps/web/public/illustrations/training/${name}.webp`,import.meta.url));assert.equal(file.subarray(0,4).toString(),"RIFF");assert.equal(file.subarray(8,12).toString(),"WEBP");assert.ok(file.byteLength<100000);}
 assert.match(source("features/arena/TrainingHub.tsx"),/alt="" width="220"/);
 const css=source("styles/training-illustrated.css");assert.match(css,/#0d6c68/);assert.match(css,/#142c4b/);assert.match(css,/object-fit: contain/);assert.match(css,/prefers-reduced-motion/);assert.match(css,/grid-template-columns: minmax\(0, 1fr\)/);
});
test("Exercices entre par les cartes matières sans monter la banque ni l’éditeur",()=>{
 const html=render(SubjectLibraryScreen,{level,subjects:Object.values(subjects),paths:[],catalogLessons:curriculumLessonTitles,mode:"exercises",onChooseSubject:noOp,onBackHome:noOp});
 assert.match(html,/<h1 id="subject-library-title">Exercices<\/h1>/);assert.match(html,/M’entraîner/);assert.match(html,/data-subject-id="english" disabled/);assert.doesNotMatch(html,/practice-categories|exercise-player|Rappel/);
 const screen=source("features/arena/ArenaScreen.tsx");const gate=screen.indexOf('if (exercisesOpen && !exerciseEditorOpen && !exerciseSelection?.lessonKey && exerciseView !== "lessons")');assert.ok(gate>0);assert.ok(gate<screen.indexOf('if (exercisesOpen) return <ArenaExercisesPage'));
 assert.match(screen,/SubjectLibraryScreen mode="exercises"/);assert.match(screen,/onBackSubjects=\{onBackExerciseSubjects\}/);
});
test("le choix de matière exercices résiste à F5 sans altérer les anciennes URL précises",()=>{
 const list={navigation:"arena" as const,subjectId:"svt" as const,arenaMode:"exercises" as const,exerciseView:"lessons" as const};
 const url=appRouteUrl(list,"");assert.equal(url,"/arene/exercices?matiere=svt&vue=lecons");assert.equal(readAppRoute({pathname:"/arene/exercices",search:"?matiere=svt&vue=lecons"},{navigation:"home"}).exerciseView,"lessons");
 for(const path of ["/arene/exercices","/arene/exercices/editeur","/arene/exercices/rubriques/tc-l1-reference"]){
  const parsed=readAppRoute({pathname:path,search:"?matiere=mathematics&lecon=terminale-d-math-l01-limits-continuity&categorie=fixation&vue=lecons"},{navigation:"home"});
  assert.equal(parsed.exerciseView,undefined);assert.equal(parsed.exerciseSelection?.lessonKey,"terminale-d-math-l01-limits-continuity");assert.ok(!appRouteUrl(parsed,"").includes("vue=lecons"));
 }
 assert.equal(readAppRoute({pathname:"/arene/exercices",search:"?matiere=svt"},{navigation:"home"}).exerciseView,undefined);
});
test("retour aux matières, sélection et corrections gardent leurs contrats existants",()=>{
 const page=source("features/arena/ArenaExercisesPage.tsx"),shell=source("LearningApp.tsx");
 assert.match(page,/onBackSubjects \?\? onBackArena/);assert.match(page,/sectionPageRequested \? "Toutes les rubriques"/);assert.match(page,/mayLeave\(\)/);
 assert.match(shell,/onChooseExerciseSubject=.*exerciseView: "lessons"/);assert.match(shell,/onOpenExerciseLesson=.*exerciseSelection: \{ lessonKey, category: "fixation" \}/);
 assert.match(shell,/onBackExerciseSubjects=/);assert.match(page,/ExerciseLibrary sections=\{sections\} selection=\{currentSelection\}/);
});
