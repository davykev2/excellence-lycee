import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { initialDashboard, schoolLevels, subjects } from "../apps/web/src/data/programme";
import { showHistoricalHome } from "../apps/web/src/config/homeLayout";
const require=createRequire(new URL("../apps/web/package.json",import.meta.url));
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");(globalThis as {React?:unknown}).React=React;require.extensions[".css"]=()=>{};
require.extensions[".png"]=(module: {exports:unknown})=>{module.exports="decoration.png";};
const {HistoricalDashboard}=require("./src/features/dashboard/HistoricalDashboard");const noop=()=>{};
test("la toute première structure historique remplace les cartes sans perdre les vrais accès",()=>{
 assert.equal(showHistoricalHome,true);
 const html=renderToStaticMarkup(React.createElement(HistoricalDashboard,{content:initialDashboard,progress:0,level:schoolLevels.find(l=>l.id==="terminale-a"),subject:subjects.mathematics,subjects:[subjects.mathematics],onSubjectChange:noop,onResumeLesson:noop,onAskHint:noop,onOpenGoal:noop,onOpenArena:noop,syncIssue:{message:"Synchronisation indisponible",onRetry:noop}}));
 assert.match(html,/historical-home/);assert.match(html,/Heureux de te revoir/);assert.match(html,/lesson-hero/);assert.match(html,/lesson-visual/);assert.match(html,/quick-action--goal/);assert.match(html,/quick-action--reviews/);assert.match(html,/Progression : 0 %/);assert.match(html,/Synchronisation indisponible/);assert.doesNotMatch(html,/home-action-grid|home-learning-tip|platform-stats/);
});
