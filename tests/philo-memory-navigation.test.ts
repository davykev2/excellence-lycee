import assert from "node:assert/strict";
import {createRequire} from "node:module";
import test from "node:test";
import {appRouteUrl,readAppRoute} from "../apps/web/src/routing/appRoute";
import {canAccessPhiloMemory,initialSubjectIdForLocation,routeAllowedForUser} from "../apps/web/src/routing/routeAccess";
import {schoolLevels,subjects} from "../apps/web/src/data/programme";
import type {AccountType,AuthUser} from "../apps/web/src/domain/auth";

const require=createRequire(new URL("../apps/web/package.json",import.meta.url));
const React=require("react");(globalThis as {React?:unknown}).React=React;
const {renderToStaticMarkup}=require("react-dom/server");
const {TrainingHub}=require("./src/features/arena/TrainingHub");
const {PhiloMemoryPage}=require("./src/features/philosophy/PhiloMemoryPage");
const noOp=()=>{};
const url="/arene/memoire-philo?matiere=philosophy&notion=liberte";
const read=(value:string)=>{const u=new URL(value,"http://localhost");return readAppRoute(u,{navigation:"home"});};

test("URL dédiée, notion et matière sont conservées après relecture F5",()=>{
  const route=read(url);assert.equal(route.arenaMode,"philo-memory");assert.equal(route.philoNotion,"liberte");assert.equal(route.subjectId,"philosophy");
  const encoded=appRouteUrl(route,"?__paths-preview=1&__level-preview=terminale-c&lecon=obsolete");
  assert.ok(encoded.startsWith("/arene/memoire-philo?"));assert.ok(encoded.includes("notion=liberte"));
  assert.ok(encoded.includes("__level-preview=terminale-c"));assert.ok(encoded.includes("__paths-preview=1"));
  assert.deepEqual(read(encoded),route);assert.ok(!encoded.includes("lecon="));
  assert.equal(initialSubjectIdForLocation({pathname:"/arene/memoire-philo",search:""},"mathematics",[]),"philosophy");
});
test("la page impose la philosophie et ne transporte pas de notion sur les autres routes",()=>{
  assert.equal(read("/arene/memoire-philo?matiere=svt").subjectId,"philosophy");
  assert.equal(read("/arene/memoire-philo?notion=%3Cscript%3E").philoNotion,undefined);
  const other=appRouteUrl({navigation:"paths",subjectId:"philosophy"},"?notion=conscience&matiere=philosophy");
  assert.equal(other,"/parcours?matiere=philosophy");
});
test("accès réservé aux Terminales et à l’administrateur sans ouvrir du contenu à Seconde/Première",()=>{
  for(const level of schoolLevels)for(const accountType of ["student","parent","teacher"] satisfies AccountType[]){
    const user:AuthUser={id:"test",name:"Test",email:"test@example.test",emailVerified:true,levelId:level.id,accountType,role:accountType==="teacher"?"teacher":"student"};
    assert.equal(canAccessPhiloMemory(user),level.stage==="terminale");
    assert.equal(routeAllowedForUser(read(url),user).arenaMode,level.stage==="terminale"?"philo-memory":undefined);
  }
  assert.equal(canAccessPhiloMemory({levelId:"seconde-c",role:"admin"}),true);
});
test("la carte Citations & notions apparaît uniquement quand l’action est autorisée",()=>{
  const props={level:schoolLevels.find(l=>l.id==="terminale-c"),subject:subjects.philosophy,subjects:[subjects.philosophy],onSubjectChange:noOp,onOpenExercises:noOp,onOpenCodex:noOp,onOpenDuel:noOp};
  const available=renderToStaticMarkup(React.createElement(TrainingHub,{...props,onOpenPhiloMemory:noOp}));
  assert.match(available,/Citations &amp; notions/);assert.match(available,/Ouvrir Mémoire philo/);assert.doesNotMatch(available,/Quiz, bientôt disponible/);
  const absent=renderToStaticMarkup(React.createElement(TrainingHub,props));
  assert.doesNotMatch(absent,/Ouvrir Mémoire philo/);assert.match(absent,/Quiz, bientôt disponible/);
});
test("l’entrée affiche seize notions accessibles et une séance réglable, sans ancien système XP",()=>{
  const html=renderToStaticMarkup(React.createElement(PhiloMemoryPage,{userId:"test",levelId:"terminale-c",onNotionChange:noOp,onBack:noOp,onOpenCourse:noOp}));
  assert.match(html,/Mémoire philo/);assert.match(html,/Choisir une notion/);assert.match(html,/Inconscient/);assert.match(html,/État et droit/);
  assert.match(html,/20 questions/);assert.doesNotMatch(html,/gagner.*XP|débloquer|Classement|Niveau [0-9]/);
});
test("une notion ouverte ne repousse pas son contenu après les seize cartes",()=>{
  const html=renderToStaticMarkup(React.createElement(PhiloMemoryPage,{userId:"test",levelId:"terminale-c",notion:"liberte",onNotionChange:noOp,onBack:noOp,onOpenCourse:noOp}));
  assert.match(html,/<h1>Liberté<\/h1>/);assert.doesNotMatch(html,/Choisir une notion/);
  assert.match(html,/Apprendre les citations et définitions/);assert.match(html,/Toutes les notions/);
});
test("les anciennes routes d’exercices, BAC et devoirs restent indépendantes",()=>{
  assert.equal(read("/arene/exercices?matiere=mathematics").arenaMode,"exercises");
  assert.equal(read("/arene/devoirs/as49?matiere=mathematics").homeworkRef,"as49");
  assert.equal(read("/arene/exos-types-bac/2024/resultats").bacResults,true);
  assert.equal(read("/parcours/terminale-philo-l3-knowledge-of-man").pathId,"terminale-philo-l3-knowledge-of-man");
});
