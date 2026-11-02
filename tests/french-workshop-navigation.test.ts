import assert from "node:assert/strict";
import test from "node:test";
import {createRequire} from "node:module";
import {readAppRoute,appRouteUrl} from "../apps/web/src/routing/appRoute";
import {canAccessFrenchWorkshop,routeAllowedForUser,initialSubjectIdForLocation} from "../apps/web/src/routing/routeAccess";
import {subjects,schoolLevels} from "../apps/web/src/data/programme";
import type {AccountType,AuthUser} from "../apps/web/src/domain/auth";
const require=createRequire(new URL("../apps/web/package.json",import.meta.url));
const React=require("react");(globalThis as {React?:unknown}).React=React;
const {renderToStaticMarkup}=require("react-dom/server");const {FrenchWorkshopPage}=require("./src/features/french/FrenchWorkshopPage");const {TrainingHub}=require("./src/features/arena/TrainingHub");
const noop=()=>{};
const read=(text:string)=>readAppRoute(new URL(text,"http://localhost"),{navigation:"home"});
const route=read("/arene/atelier-francais?matiere=svt&rubrique=figures");
test("route dédiée au français, rubrique et F5 canoniques sans fuite des paramètres d’exercice",()=>{
 assert.equal(route.subjectId,"french");assert.equal(route.arenaMode,"french-workshop");assert.equal(route.frenchSection,"figures");
 const url=appRouteUrl(route,"?__paths-preview=1&__level-preview=terminale-c&notion=liberte&lecon=obsolete&exercice=x");
 assert.ok(url.startsWith("/arene/atelier-francais?"));assert.match(url,/matiere=french/);assert.match(url,/rubrique=figures/);assert.match(url,/__level-preview=terminale-c/);
 assert.doesNotMatch(url,/notion=|lecon=|exercice=/);assert.deepEqual(read(url),route);
});
test("les deux rubriques sont autorisées, les valeurs libres ignorées",()=>{
 assert.equal(read("/arene/atelier-francais?rubrique=argumentation").frenchSection,"argumentation");
 for(const value of ["conscience","%3Cscript%3E","../../../admin"])assert.equal(read("/arene/atelier-francais?rubrique="+value).frenchSection,undefined);
 assert.equal(appRouteUrl({navigation:"arena",subjectId:"french"},"?rubrique=figures"),"/arene?matiere=french");
});
test("le sujet de l’activité prime même sur une ancienne matière restée dans l’URL",()=>{
 assert.equal(initialSubjectIdForLocation({pathname:"/arene/atelier-francais",search:"?matiere=mathematics"},"svt",[]),"french");
 assert.equal(initialSubjectIdForLocation({pathname:"/arene/memoire-philo",search:"?matiere=mathematics"},"svt",[]),"philosophy");
});
test("accès Terminales A/C/D, profils adultes associés à ces classes et administrateur ; pas de fuite en Seconde/Première",()=>{
 for(const level of schoolLevels)for(const accountType of ["student","teacher","parent"] satisfies AccountType[]){
  const user:AuthUser={id:"test",name:"Test",email:"test@example.test",emailVerified:true,levelId:level.id,accountType,role:accountType==="teacher"?"teacher":"student"};
  assert.equal(canAccessFrenchWorkshop(user),level.stage==="terminale");assert.equal(routeAllowedForUser(route,user).arenaMode,level.stage==="terminale"?"french-workshop":undefined);
 }
 assert.equal(canAccessFrenchWorkshop({levelId:"seconde-a",role:"admin"}),true);
});
test("la carte est affichée seulement si le callback est autorisé et ne prétend plus que ce quiz est à venir",()=>{
 const props={level:schoolLevels.find(l=>l.id==="terminale-c"),subject:subjects.french,subjects:[subjects.french],onSubjectChange:noop,onOpenExercises:noop,onOpenCodex:noop,onOpenDuel:noop};
 const html=renderToStaticMarkup(React.createElement(TrainingHub,{...props,onOpenFrenchWorkshop:noop}));assert.match(html,/Atelier de français/);assert.match(html,/Ouvrir l’atelier/);assert.doesNotMatch(html,/Quiz, bientôt disponible/);
 const absent=renderToStaticMarkup(React.createElement(TrainingHub,props));assert.doesNotMatch(absent,/Atelier de français/);
});
test("l’entrée ne montre que deux rubriques réelles et n’invente ni cours ni mode supplémentaire",()=>{
 const html=renderToStaticMarkup(React.createElement(FrenchWorkshopPage,{userId:"test",levelId:"terminale-c",onSectionChange:noop,onBack:noop}));
 for(const label of ["Atelier de français","Figures de style","Argumentation","12 repères","14 repères"])assert.ok(html.includes(label));
 assert.doesNotMatch(html,/Auteurs et œuvres|Genres et registres|Gagner|XP|Débloquer/);
});
test("ouvrir une rubrique affiche immédiatement ses actions, pas un nouveau mur de cartes",()=>{
 const html=renderToStaticMarkup(React.createElement(FrenchWorkshopPage,{userId:"test",levelId:"terminale-c",section:"figures",onSectionChange:noop,onBack:noop}));
 assert.match(html,/<h1>Figures de style<\/h1>/);assert.match(html,/Fiches repères et exemples/);assert.doesNotMatch(html,/Choisir une rubrique/);
});
test("philo et devoirs gardent leurs anciennes URLs et leurs paramètres propres",()=>{
 assert.equal(read("/arene/memoire-philo?notion=conscience").philoNotion,"conscience");
 assert.equal(read("/arene/devoirs/as49").homeworkRef,"as49");
 assert.equal(read("/arene/exos-types-bac/2024/resultats").bacResults,true);
});
