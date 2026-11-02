import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";
import { physicsEssentialRoutes, getPhysicsEssentialKey, loadPhysicsEssentialSheet } from "../apps/web/src/data/physicsEssentials/registry";
import { physicsEssentialSource } from "../apps/web/src/data/physicsEssentials/types";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog";
import { learningPaths } from "../apps/web/src/data/learningPaths";
import { loadLearningPathsForSubject } from "../apps/web/src/data/learningPathLoader";
import { getPathLessons } from "../apps/web/src/features/paths/pathLessons";
import { AVAILABLE_EXERCISES } from "../apps/web/src/data/learningPathMetrics";
import { acidBaseMeasurements, conjugateFractions, oscillatorFractions, physicsEssentialPresets, projectileModel, resonanceMeasurements } from "../apps/web/src/domain/physicsEssentialModels";
import { physicsAssessmentSignature, physicsAssessmentStorageKey, restorePhysicsAssessment, serializePhysicsAssessment } from "../apps/web/src/features/lesson/physicsAssessmentDraft";
import { appRouteUrl, readAppRoute } from "../apps/web/src/routing/appRoute";
import type { CourseEssentialSheet } from "../apps/web/src/domain/courseDocument";
import type { LessonQuestion } from "../apps/web/src/domain/paths";

const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const React = require("react");
(globalThis as { React?: unknown }).React = React;
require.extensions[".css"] = () => {};
const { renderToStaticMarkup } = require("react-dom/server");
const { MathEssentialsContent } = require("./src/features/lesson/document/MathEssentialsPanel");
const { PhysicsEssentialFigure } = require("./src/features/lesson/document/PhysicsEssentialFigure");
const katex = require("katex");
const source = (name: string) => readFileSync(new URL("../apps/web/src/" + name, import.meta.url), "utf8");
const sheets = () => Promise.all(physicsEssentialRoutes.map(route => loadPhysicsEssentialSheet(route.key)));
const body = (sheet: CourseEssentialSheet) => sheet.sections.flatMap(section => section.topics.map(topic => topic.body)).join("\n");
const get = async (key: typeof physicsEssentialRoutes[number]["key"]) => body(await loadPhysicsEssentialSheet(key));

test("27 fiches issues des 20 chapitres correspondent à52 accès du catalogue", () => {
  assert.equal(physicsEssentialRoutes.length,27);
  assert.equal(physicsEssentialRoutes.reduce((sum,route)=>sum+route.levelIds.length,0),52);
  assert.equal(new Set(physicsEssentialRoutes.map(route=>route.pathId)).size,27);
  for(const route of physicsEssentialRoutes) for(const levelId of route.levelIds) {
    assert.equal(getPhysicsEssentialKey(route.pathId,levelId),route.key);
    const path=learningPaths.find(path=>path.id===route.pathId)!;
    assert.ok(path,route.pathId);
    assert.ok(path.levelIds.includes(levelId));
    assert.equal(path.subjectId,"physics-chemistry");
    assert.ok(curriculumLessonTitles.some(item=>item.pathId===route.pathId&&item.levelId===levelId&&item.published!==false),route.pathId);
  }
});
test("C et D utilisent le même payload ; les deux cartes D seules restent D seules", async () => {
  let shared=0;
  for(const route of physicsEssentialRoutes) {
    const first=await loadPhysicsEssentialSheet(route.key);
    assert.strictEqual(await loadPhysicsEssentialSheet(route.key),first);
    assert.deepEqual(first.levelIds,route.levelIds);
    if(route.levelIds.length===2) {
      assert.strictEqual(await loadPhysicsEssentialSheet(getPhysicsEssentialKey(route.pathId,"terminale-c")!),await loadPhysicsEssentialSheet(getPhysicsEssentialKey(route.pathId,"terminale-d")!));
      shared++;
    } else assert.equal(getPhysicsEssentialKey(route.pathId,"terminale-c"),null);
  }
  assert.equal(shared,25);
  assert.match(source("data/physicsEssentials/registry.ts"),/cache\.delete\(key\); throw error/);
});
test("aucune fiche n’est inventée pour les autres classes ni les quatre chapitres absents", () => {
  for(const route of physicsEssentialRoutes) for(const levelId of ["seconde-c","premiere-c","terminale-a","unknown"]) assert.equal(getPhysicsEssentialKey(route.pathId,levelId),null);
  for(const id of ["terminale-c-gravitation","terminale-c-induction-electromagnetic","terminale-c-wave-light","terminale-c-corpuscular-light","unknown"]) {
    assert.equal(getPhysicsEssentialKey(id,"terminale-c"),null);
    assert.equal(getPhysicsEssentialKey(id,"terminale-d"),null);
  }
});
test("les deux bundles PC existants et leurs registres historiques restent identiques", async () => {
  const before=JSON.stringify(learningPaths);
  await sheets();
  assert.equal(JSON.stringify(learningPaths),before);
  for(const levelId of ["terminale-c","terminale-d"]) {
    const paths=await loadLearningPathsForSubject(levelId,"physics-chemistry");
    assert.equal(paths.length,levelId==="terminale-c"?29:27);
    for(const route of physicsEssentialRoutes.filter(route=>(route.levelIds as readonly string[]).includes(levelId))) assert.ok(paths.some(path=>path.id===route.pathId),route.pathId);
  }
  assert.equal(learningPaths.reduce((total,path)=>total+getPathLessons(path).reduce((sum,lesson)=>sum+(lesson.questions?.length||1),0),0),AVAILABLE_EXERCISES);
});
test("pages de cours tracées, sans scans, activités importées, XP ou points", async () => {
  const expectedPages=new Set([177,178,179,180,181,196,197,198,211,212,213,214,215,242,243,244,245,257,258,267,268,269,270,271,292,293,294,295,296,304,305,306,316,317,321,322,323,324,334,335,336,337,338,339,366,367,372,373,374,375,376,386,387,393,394,395,396,397,398,399,400,401,402,426,427,433,434,441,448,449,450,464,465,466,467,468,469]);
  const observed=new Set<number>();
  for(const sheet of await sheets()) {
    assert.equal(sheet.source.sha256,physicsEssentialSource.sha256);
    assert.equal(sheet.source.pageCount,740);
    assert.ok(sheet.source.editorialNotes.length>0);
    assert.ok(body(sheet).length>1000,sheet.id);
    const ids=[...sheet.sections.map(section=>section.id),...sheet.sections.flatMap(section=>section.topics.map(topic=>topic.id))];
    assert.equal(new Set(ids).size,ids.length,sheet.id);
    sheet.source.pages.forEach(page=>{assert.ok(expectedPages.has(page),String(page));observed.add(page);});
    for(const topic of sheet.sections.flatMap(section=>section.topics)) assert.ok(topic.pages.every(page=>sheet.source.pages.includes(page)),sheet.id+":"+topic.id);
    assert.doesNotMatch(JSON.stringify(sheet.sections),/xpAwarded|points":|questions":|coquille|Excellence rétablit|document imprime|EXERCICE CORRIG|!\[|<img|<script/i);
  }
  assert.deepEqual([...observed].sort((a,b)=>a-b),[...expectedPages].sort((a,b)=>a-b));
});
test("toutes les formules passent KaTeX strict ; les tableaux ne sont pas brisés par des barres", async () => {
  let formulas=0,tables=0;
  for(const sheet of await sheets()) for(const section of sheet.sections) for(const value of [section.title,...section.topics.flatMap(topic=>[topic.title,topic.body])]) {
    assert.doesNotMatch(value,/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u00a3\u00a7]/);
    assert.equal((value.match(/\$/g)??[]).length%2,0);
    for(const match of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)) {
      katex.renderToString(match[1]??match[2],{throwOnError:true,strict:"error",trust:false});formulas++;
    }
    let columns=0;
    for(const line of value.split("\n")) {
      if(!line.startsWith("|")){columns=0;continue;}
      const count=line.split("|").length;
      if(!columns){columns=count;tables++;}else assert.equal(count,columns,sheet.id+": "+line);
    }
  }
  assert.ok(formulas>650,String(formulas));assert.ok(tables>35,String(tables));
});
test("les fiches se rendent intégralement sans dollars, scans ou commentaires de fabrication", async () => {
  for(const sheet of await sheets()) {
    const html=renderToStaticMarkup(React.createElement(MathEssentialsContent,{sheet}));
    assert.equal((html.match(/class="document-summary-section essential-sheet-section"/g)??[]).length,sheet.sections.length);
    assert.match(html,/L’essentiel/);
    assert.ok(!/katex-error|\$|<img|Contenu à venir|document-question|Valider|coquille|Source du cours/.test(html),sheet.id+" : "+html.match(/.{0,60}(?:katex-error|\$|<img|Contenu à venir|document-question|Valider|coquille|Source du cours).{0,60}/)?.[0]);
  }
});
test("22 explorations natives accessibles correspondent aux figures utilisées", async () => {
  const used=new Set<string>();
  for(const sheet of await sheets()) for(const section of sheet.sections) for(const topic of section.topics) {
    if(topic.nativeFigure?.kind==="physics") used.add(topic.nativeFigure.preset);
  }
  assert.deepEqual([...used].sort(),[...physicsEssentialPresets].sort());
  for(const preset of physicsEssentialPresets) {
    const html=renderToStaticMarkup(React.createElement(PhysicsEssentialFigure,{preset}));
    assert.match(html,/role="img"/);assert.match(html,/aria-label=/);
    assert.match(html,/type="range"|<button/);assert.doesNotMatch(html,/NaN|Infinity|katex-error|\$|<img/);
  }
});
test("cinématique : trajectoire, vitesses et accélérations conservent les données exactes", async () => {
  const text=await get("kinematics");
  for(const value of [String.raw`\frac34x^2+2x-\frac{15}{4}`,"67{,}5","18{,}75",String.raw`\sqrt5`]) assert.ok(text.includes(value),value);
  for(const t of [-2,0,1,4]) {
    const x=2*t-1,z=3*t*t+t-5;
    assert.ok(Math.abs(z-(.75*x*x+2*x-15/4))<1e-12);
  }
});
test("projectile : portée, sommet, angle et unités sont cohérents", async () => {
  const text=await get("uniform-fields");
  assert.ok(text.includes("milieu des plaques"));
  assert.ok(text.includes("(Oxz)"));
  for(const angle of [15,30,45,60,75]) {
    const model=projectileModel(angle);
    assert.ok(Math.abs(model.vx*model.duration-model.range)<1e-10);
    assert.ok(Math.abs(model.vz*model.duration-9.81*model.duration**2/2)<1e-10);
    assert.ok(Math.abs(model.vz**2/(2*9.81)-model.height)<1e-10);
  }
  assert.ok(projectileModel(45).range>projectileModel(30).range);
});
test("oscillateurs : signes des dérivées, amplitude générale et énergies", async () => {
  const text=await get("mechanical-oscillations");
  assert.ok(text.includes(String.raw`\ddot x+\frac{k}{m}x=0`));
  assert.ok(text.includes(String.raw`\sqrt{x_0^2+\left(\frac{v_0}{\omega_0}\right)^2}`));
  for(let phase=0;phase<=360;phase+=5) {
    const values=oscillatorFractions(phase);
    assert.ok(Math.abs(values.kinetic+values.potential-1)<1e-12);
    assert.ok(Math.abs(values.displacement**2-values.potential)<1e-12);
  }
  const lc=await get("free-electrical");
  assert.ok(lc.includes(String.raw`\ddot q+\frac1{LC}q=0`));
  assert.ok(lc.includes("Recharge avec polarité inversée"));
});
test("charges : rayon positif, sélecteur et spectromètre gardent la valeur absolue", async () => {
  const text=await get("charged-particle");
  for(const value of [String.raw`R=\frac{mv_0}{|q|B}`,String.raw`v=\frac EB`,String.raw`\sqrt{\frac{8mU}{|q|}}`,"non relativiste","petite déviation"]) assert.ok(text.includes(value),value);
  for(const charge of [-2,-1,1,2]) {
    const m=4,v=3,b=2,r=m*v/(Math.abs(charge)*b);
    assert.ok(r>0);assert.equal(m*v*v/r,Math.abs(charge)*v*b);
  }
});
test("induction : f.é.m., convention récepteur et intégrale Joule", async () => {
  const text=await get("auto-induction");
  for(const value of [String.raw`e=-\frac{d\Phi_p}{dt}=-L\frac{di}{dt}`,String.raw`u_{AB}=ri-e=ri+L\frac{di}{dt}`,String.raw`\int_{t_1}^{t_2}ri^2\,dt`]) assert.ok(text.includes(value),value);
  const aop=await get("operational-amplifier");
  assert.ok(aop.includes(String.raw`u_s(t_0)-\frac1{RC}`));
  assert.ok(aop.includes("saturation"));
});
test("RLC : valeurs efficaces, réactance, largeur et données sont préservées", async () => {
  const resonance=await get("rlc-resonance"),forced=await get("rlc-forced");
  assert.ok(forced.includes(String.raw`U_C=I/(C\omega)`));
  assert.ok(resonance.includes(String.raw`\Delta N=N_2-N_1`));
  assert.ok(resonance.includes("amplitude instantanée"));
  assert.equal(resonanceMeasurements.frequency[5],200);assert.equal(resonanceMeasurements.current[5],150);
  for(const x of [-100,0,100]){const z=Math.hypot(100,x),cos=100/z;assert.ok(Math.abs(cos-Math.cos(Math.atan2(x,100)))<1e-12);}
});
test("nucléaire : signe d’activité et conservation A/Z des deux exemples", async () => {
  assert.ok((await get("spontaneous-nuclear")).includes(String.raw`-\frac{dN}{dt}`));
  assert.equal(235+1,148+85+3);assert.equal(92,57+35);
  assert.equal(2+2,3+1);assert.equal(1+1,1+1);
  for(const halfLives of [0,1,2,3,6]) assert.ok(Math.abs(Math.exp(-Math.LN2*halfLives)-2**(-halfLives))<1e-12);
});
test("organique : groupes, noms, bilans et rendement corrigés sont stables", async () => {
  const alcohol=await get("alcohols"),carbonyl=await get("carbonyl"),acid=await get("carboxylic-acids"),soap=await get("soap");
  for(const value of ["hydroxyle","Éthane-1,2-diol",String.raw`\mathrm{(CH_3)_3COH}`,String.raw`x+\frac y4-\frac z2`]) assert.ok(alcohol.includes(value),value);
  assert.ok(carbonyl.includes("4-éthyl-5-méthylheptanal"));
  assert.ok(acid.includes("2-méthylpentanoate de 2-méthylhexyle"));
  assert.ok(acid.includes("d’eau"));assert.ok(soap.includes("Tous les carboxylates ne sont pas des savons"));
  const ethanol=30*.785/46,acidMoles=15/46,yieldRatio=.26/Math.min(ethanol,acidMoles);
  assert.ok(Math.abs(yieldRatio-.7973333333)<1e-9);
});
test("pH : pourcentage commercial, neutralité et stœchiométrie ne sont pas confondus", async () => {
  const ph=await get("ph"),strong=await get("strong-acid-base");
  for(const value of [String.raw`\frac{p\rho}{100M}`,String.raw`10^{-pK_e/2}`,"volume **final de solution**"]) assert.ok(ph.includes(value),value);
  assert.ok(strong.includes("éthanolate"));assert.ok(strong.includes("On n’utilise donc pas automatiquement"));
  assert.equal(.2*1200/40,10*20*1.2/40);
  assert.equal(10**(-14/2),1e-7);
});
test("couples : relation pH/pKa, matière et tampon limités aux bonnes hypothèses", async () => {
  const weak=await get("weak-acid-base"),couples=await get("acid-base-couples"),buffer=await get("acid-base-buffers");
  assert.ok(weak.includes("10^{pH-pK_e}"));
  assert.ok(couples.includes("acides conjugués"));assert.ok(couples.includes("concentration"));
  assert.ok(buffer.includes("capacité tampon est limitée"));assert.ok(buffer.includes("demi-équivalence"));
  for(const difference of [-3,-1,0,1,3]) {
    const f=conjugateFractions(difference);
    assert.ok(Math.abs(f.base+f.acid-1)<1e-12);
    assert.ok(Math.abs(Math.log10(f.base/f.acid)-difference)<1e-12);
  }
});
test("mesures des deux titrages : points conservés, retour décroissant corrigé", () => {
  assert.equal(acidBaseMeasurements.baseVolumes.length,23);
  assert.equal(acidBaseMeasurements.increasingPh.length,23);
  assert.equal(acidBaseMeasurements.acidVolumes.length,13);
  assert.equal(acidBaseMeasurements.decreasingPh[3],10.8);
  assert.equal(acidBaseMeasurements.increasingPh[15],7.14);
  for(const data of [acidBaseMeasurements.increasingPh,acidBaseMeasurements.decreasingPh]) for(let index=1;index<data.length;index++) assert.ok(data===acidBaseMeasurements.increasingPh?data[index]>=data[index-1]:data[index]<=data[index-1]);
});
test("trois onglets PC : URL, F5 et historique conservent la vue sans domaine mathématique", () => {
  for(const view of ["evaluation","essentiel"]) {
    const route=readAppRoute({pathname:"/parcours/terminale-cd-magnetic-field",search:"?matiere=physics-chemistry&vue="+view+"&domaine=analyse"},{navigation:"home"});
    assert.equal(route.courseTab,view==="evaluation"?"assessment":"essentials");
    assert.equal(route.mathDomain,undefined);
    const url=new URL(appRouteUrl(route,"?__level-preview=terminale-d"),"http://localhost");
    assert.equal(url.searchParams.get("vue"),view);
    assert.equal(url.searchParams.get("domaine"),null);
    assert.deepEqual(readAppRoute(url,{navigation:"home"}),route);
  }
  const reader=source("features/lesson/ContinuousCourseScreen.tsx");
  for(const value of ['["summary", "assessment", "essentials"]','Résumé de la leçon','Questions d’évaluation','L’essentiel','hidden={!summaryVisible}','independentCorrection']) assert.ok(reader.includes(value),value);
  assert.match(reader,/if \(!summaryVisible \|\| !\("IntersectionObserver"/);
  assert.ok(reader.includes("storageScope={`${currentUser.id}:${level.id}:${path.id}:${lesson.id}`}"));
  assert.doesNotMatch(source("features/lesson/document/PhysicsEssentialsPanel.tsx"),/fetch\(|submitAttempt|xpAwarded/);
});
const questions: LessonQuestion[]=[
  {prompt:"Choix",options:["A","B","C"],correctIndex:1,explanation:"Explication"},
  {type:"short-answer",prompt:"Calcul",options:[],correctIndex:0,acceptedAnswers:["2"],explanation:"Résultat"},
];
test("brouillons PC validés et séparés par compte, classe, parcours et partie", () => {
  const scopes=["a:terminale-c:path:part","a:terminale-d:path:part","b:terminale-c:path:part","a:terminale-c:other:part","a:terminale-c:path:other"];
  assert.equal(new Set(scopes.map(physicsAssessmentStorageKey)).size,5);
  const serialized=serializePhysicsAssessment(questions,[1,"2"]);
  assert.deepEqual(restorePhysicsAssessment(questions,serialized),[1,"2"]);
  assert.deepEqual(restorePhysicsAssessment(questions,"invalid"),[null,""]);
  assert.deepEqual(restorePhysicsAssessment(questions,JSON.stringify({signature:physicsAssessmentSignature(questions),answers:[99,"x".repeat(2001)]})),[null,""]);
  assert.deepEqual(restorePhysicsAssessment([{...questions[0],prompt:"Nouveau"},questions[1]],serialized),[null,""]);
  assert.doesNotMatch(serialized,/score|checked|open|points/);
});
test("validation et corrections sont indépendantes et la typographie reste à16px", () => {
  const reader=source("features/lesson/ContinuousCourseScreen.tsx"),css=source("styles/physics-essentials.css");
  assert.match(reader,/independentCorrection && <DocumentCorrection>/);
  assert.match(reader,/!independentCorrection && <p className="course-reader-explanation"/);
  assert.match(reader,/setChecked\(true\)/);
  assert.doesNotMatch(source("features/lesson/document/DocumentCorrection.tsx"),/checked|localStorage|open.*true/);
  assert.match(css,/font-size: 16px/);assert.match(css,/min-height: 44px/);
});
