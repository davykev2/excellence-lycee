import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { initialDashboard, schoolLevels, subjects } from "../apps/web/src/data/programme";
import { showOriginalHome } from "../apps/web/src/config/homeLayout";
const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const React=require("react"), {renderToStaticMarkup}=require("react-dom/server");
(globalThis as {React?:unknown}).React=React;require.extensions[".css"]=()=>{};
const {OriginalDashboard}=require("./src/features/dashboard/OriginalDashboard");
const noop=()=>{};
test("l’accueil initial de la copie revient sans supprimer la variante simplifiée",()=>{
 assert.equal(showOriginalHome,true);
 const html=renderToStaticMarkup(React.createElement(OriginalDashboard,{
  content:initialDashboard,level:schoolLevels.find(l=>l.id==="terminale-a"),subject:subjects.mathematics,subjects:[subjects.mathematics,subjects.philosophy],
  onSubjectChange:noop,onResumeLesson:noop,onOpenSpace:noop,onOpenCourses:noop,onOpenExercises:noop,onOpenHomeworks:noop,onOpenExams:noop,onOpenResults:noop,onOpenMessages:noop,onOpenSupport:noop,
  syncIssue:{message:"Erreur de synchronisation",onRetry:noop},
 }));
 assert.match(html,/Bonjour, Aïcha/);assert.match(html,/Un petit pas aujourd’hui/);assert.match(html,/Qu’as-tu envie d’apprendre/);
 assert.match(html,/Terminale A/);assert.match(html,/Matière du cours à reprendre/);assert.equal((html.match(/data-home-card=/g)??[]).length,8);
 assert.match(html,/Erreur de synchronisation/);assert.match(html,/Réessayer/);assert.doesNotMatch(html,/home-learning-tip|home-focused|platform-stats/);
 assert.match(readFileSync(new URL("../apps/web/src/features/dashboard/Dashboard.tsx",import.meta.url),"utf8"),/<HomeWelcome/);
 const root=readFileSync(new URL("../apps/web/src/LearningApp.tsx",import.meta.url),"utf8");
 assert.match(root,/!showOriginalHome && activeNavigation === "home"/);assert.match(root,/: showOriginalHome \? \(/);
 assert.match(root,/onOpenHomeworks=\{canAccessHomeworks\(user\)/);assert.match(root,/onOpenExams=\{canAccessBacExams\(user\)/);
});
