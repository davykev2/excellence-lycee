import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getMathEssentialKey, loadMathEssentialSheet, mathEssentialPairs } from "../apps/web/src/data/mathEssentials/registry";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog";
import { learningPaths } from "../apps/web/src/data/learningPaths";
import { AVAILABLE_EXERCISES } from "../apps/web/src/data/learningPathMetrics";
import { getPathLessons } from "../apps/web/src/features/paths/pathLessons";
import type { MathEssentialSheet } from "../apps/web/src/data/mathEssentials/types";

const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const React = require("react");
(globalThis as { React?: unknown }).React = React;
require.extensions[".css"] = () => {};
const { renderToStaticMarkup } = require("react-dom/server");
const { MathEssentialsContent } = require("./src/features/lesson/document/MathEssentialsPanel");
const katex = require("katex");
const source = (name: string) => readFileSync(new URL(`../apps/web/src/${name}`, import.meta.url), "utf8");
const sheets = () => Promise.all(mathEssentialPairs.map(([key]) => loadMathEssentialSheet(key)));
const bodies = (sheet: MathEssentialSheet) => sheet.sections.flatMap(section => section.topics.map(topic => topic.body)).join("\n");
const get = async (key: typeof mathEssentialPairs[number][0]) => bodies(await loadMathEssentialSheet(key));

test("les douze paires sont de vraies leçons publiées, pas de nouveaux parcours", () => {
  assert.equal(mathEssentialPairs.length, 12);
  const aliases = new Set<string>();
  for (const [key, c, d] of mathEssentialPairs) {
    for (const [id, levelId] of [[c, "terminale-c"], [d, "terminale-d"]]) {
      assert.equal(getMathEssentialKey(id, levelId), key);
      const path = learningPaths.find(path => path.id === id);
      assert.ok(path, id);
      assert.ok(path.levelIds.includes(levelId), id);
      assert.equal(path.subjectId, "mathematics");
      assert.ok(curriculumLessonTitles.some(lesson => lesson.pathId === id && lesson.levelId === levelId && lesson.published !== false), id);
      assert.ok(!aliases.has(id)); aliases.add(id);
    }
  }
  assert.equal(aliases.size, 24);
});

test("C et D chargent exactement le même objet ; un échec n'est pas figé dans le cache", async () => {
  for (const [key, c, d] of mathEssentialPairs) {
    const left = await loadMathEssentialSheet(getMathEssentialKey(c, "terminale-c")!);
    const right = await loadMathEssentialSheet(getMathEssentialKey(d, "terminale-d")!);
    assert.strictEqual(left, right);
    assert.deepEqual(left.levelIds, ["terminale-c", "terminale-d"]);
    assert.strictEqual(await loadMathEssentialSheet(key), left);
  }
  assert.match(source("data/mathEssentials/registry.ts"), /cache\.delete\(key\); throw error/);
});

test("les autres classes, les alias croisés, le rappel et les chapitres absents ne reçoivent pas une fausse fiche", () => {
  for (const [, c, d] of mathEssentialPairs) {
    for (const other of ["seconde-c", "premiere-c", "terminale-a", "inconnu"]) {
      assert.equal(getMathEssentialKey(c, other), null);
      assert.equal(getMathEssentialKey(d, other), null);
    }
    assert.equal(getMathEssentialKey(c, "terminale-d"), null);
    assert.equal(getMathEssentialKey(d, "terminale-c"), null);
  }
  for (const id of ["terminale-c-math-l02-barycenter", "terminale-c-math-l03-divisibility", "terminale-c-math-l05-space-analytic-geometry", "terminale-c-math-l07-conics", "terminale-c-math-l11-lcm-gcd", "terminale-cd-math-l00-reminder"]) {
    assert.equal(getMathEssentialKey(id, "terminale-c"), null);
  }
});

test("la traçabilité ne prend que les pages de cours inspectées, avec des IDs uniques et aucun barème", async () => {
  const expected = [[11,12,13,14], [21,22,31,32,33,34], [26,27], [51,52], [136,137,138,139,140,141], [61,62,94], [103,104,105,106,107], [137,140,141,151,152], [96,97], [122,123,124], [118], [165]];
  const loaded = await sheets();
  assert.deepEqual(loaded.map(sheet => sheet.source.pages), expected);
  for (const sheet of loaded) {
    assert.equal(sheet.source.sha256, "59886C625771AD627E104FAB36C52927DCA046FE6083AAD9791927C7923F2362");
    assert.equal(sheet.source.pageCount, 740);
    assert.ok(sheet.source.editorialNotes.length);
    const ids = [...sheet.sections.map(section => section.id), ...sheet.sections.flatMap(section => section.topics.map(topic => topic.id))];
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(bodies(sheet).length > 1400, sheet.id);
    for (const topic of sheet.sections.flatMap(section => section.topics)) {
      assert.ok(topic.pages.every(page => sheet.source.pages.includes(page)));
    }
    assert.doesNotMatch(JSON.stringify(sheet.sections), /xpAwarded|points":|questions":|coquille|Excellence rétablit|document imprime|!\[|<img|<script/i);
  }
});

test("toutes les formules sont rendues en KaTeX strict et les tableaux restent cohérents", async () => {
  let formulas = 0, tables = 0;
  for (const sheet of await sheets()) for (const section of sheet.sections) {
    for (const value of [section.title, ...section.topics.flatMap(topic => [topic.title, topic.body])]) {
      assert.doesNotMatch(value, /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u00a3\u00a7]/);
      assert.equal((value.match(/\$/g) ?? []).length % 2, 0);
      for (const match of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)) {
        katex.renderToString(match[1] ?? match[2], { throwOnError: true, strict: "error", trust: false });
        formulas++;
      }
      let columns = 0;
      for (const line of value.split("\n")) {
        if (!line.startsWith("|")) { columns = 0; continue; }
        const count = line.split("|").length;
        if (!columns) { columns = count; tables++; }
        else assert.equal(count, columns, `${sheet.id}: ${line}`);
      }
    }
  }
  assert.ok(formulas > 700, String(formulas));
  assert.ok(tables >= 35, String(tables));
});

test("les douze fiches se rendent sans dollars bruts, scans, notes de fabrication ou évaluations", async () => {
  for (const sheet of await sheets()) {
    const html = renderToStaticMarkup(React.createElement(MathEssentialsContent, { sheet }));
    assert.equal((html.match(/class="document-summary-section essential-sheet-section"/g) ?? []).length, sheet.sections.length);
    assert.match(html, /L’essentiel/);
    assert.match(html, /class="katex"/);
    assert.doesNotMatch(html, /katex-error|\$|<img|Contenu à venir|document-question|Valider|coquille|Source du cours/);
    if (sheet.visuals) assert.match(html, /Cercle trigonométrique|cercle trigonométrique/);
  }
});

test("limites : signes, racines, composition, prolongement et taux sont protégés", async () => {
  const body = await get("limits");
  for (const value of [String.raw`\lvert x\rvert`, String.raw`\sqrt a-d`, String.raw`\frac{a_n}{b_q}`, String.raw`\frac{1-\cos x}{x^2}=\frac12`, "n’appartient pas au domaine", "continue en $b$", "valeurs effectivement prises"]) assert.ok(body.includes(value), value);
  for (const a of [-3, 2]) for (const n of [1,2,3,4]) for (const x of [-1e5, 1e5]) {
    const predicted = Math.sign(a) * (x < 0 && n % 2 ? -1 : 1);
    assert.equal(Math.sign(a * x ** n), predicted);
  }
});

test("primitives : coefficients, signes et dérivées intérieures sont contrôlés numériquement", async () => {
  const body = await get("primitives");
  for (const value of [String.raw`F'(x)=f(x)`, String.raw`\frac2{3a}`, String.raw`\frac{x^4}{12}`, String.raw`-\frac1{3x^3}`, String.raw`u'=-1/x^2`, "C=6"]) assert.ok(body.includes(value), value);
  const pairs: [((x: number) => number), ((x: number) => number)][] = [
    [x => x ** 4 / 12, x => x ** 3 / 3],
    [x => -1 / (3 * x ** 3), x => 1 / x ** 4],
    [x => 2 / 9 * (3 * x + 5) ** 1.5, x => Math.sqrt(3 * x + 5)],
    [x => 2 * Math.sqrt(1 / x + 2), x => -1 / x ** 2 / Math.sqrt(1 / x + 2)],
  ];
  for (const [F,f] of pairs) for (const x of [.5, 1, 2, 3]) {
    const derivative = (F(x + 1e-5) - F(x - 1e-5)) / 2e-5;
    assert.ok(Math.abs(derivative - f(x)) < 1e-5);
  }
});

test("suites : exemples, sommes, q=1 et point fixe sont cohérents", async () => {
  const body = await get("sequences");
  for (const value of ["v_0=-4", String.raw`u_1=1`, String.raw`u_2=\frac52`, String.raw`u_3=\frac{13}4`, String.raw`\frac N2(u_p+u_d)`, String.raw`\frac5{81}(3^n-1)`, "si $g$ est continue en", "$q=1$ | $q^n=1$"]) assert.ok(body.includes(value), value);
  for (let n = 1; n <= 9; n++) {
    const arithmetic = Array.from({length:n+1}, (_, k) => 5-3*k).reduce((a,b)=>a+b,0);
    assert.equal(arithmetic, (n+1)*(10-3*n)/2);
    const geometric = Array.from({length:n}, (_, k) => 10/81*3**k).reduce((a,b)=>a+b,0);
    assert.ok(Math.abs(geometric - 5/81*(3**n-1)) < 1e-9);
  }
});

test("probabilité : univers, variance nulle et coefficient binomial sont exacts", async () => {
  const body = await get("probability");
  for (const value of [String.raw`\operatorname{card}(\Omega)`, String.raw`\binom nk p^k(1-p)^{n-k}`, "**indépendamment**", "La variance peut être nulle", "sans répétition", "gain net"]) assert.ok(body.includes(value), value);
  const choose = (n: number, k: number) => Array.from({length:k},(_,i)=>(n-i)/(i+1)).reduce((a,b)=>a*b,1);
  for (const n of [1,2,5,10]) for (const p of [.1,.5,.8]) {
    const probabilities=Array.from({length:n+1},(_,k)=>choose(n,k)*p**k*(1-p)**(n-k));
    const mean=probabilities.reduce((a,b,k)=>a+k*b,0);
    const variance=probabilities.reduce((a,b,k)=>a+(k-mean)**2*b,0);
    assert.ok(Math.abs(probabilities.reduce((a,b)=>a+b,0)-1)<1e-12);
    assert.ok(Math.abs(mean-n*p)<1e-12);
    assert.ok(Math.abs(variance-n*p*(1-p))<1e-12);
  }
});

test("complexes et transformations conservent les conditions qui évitent de fausses conclusions", async () => {
  const complex=await get("complex"), geometry=await get("geometry");
  for (const value of [String.raw`\lvert re^{i\theta}\rvert=r`, String.raw`e^{i\theta}e^{i\varphi}`, String.raw`$\sqrt3/3$`, "Le nombre $0$ n’a pas d’argument"]) assert.ok(complex.includes(value), value);
  for (const value of ["$a+b+c\\ne0$", "non alignés", "quatre points alignés", String.raw`t_u^{-1}=t_{-u}`, String.raw`H_{\Omega,\alpha\beta}`, "la seule longueur $BD/AC$ donne"]) assert.ok(geometry.includes(value), value);
  const z={re:2,im:-3}, w={re:-1,im:4};
  const product={re:z.re*w.re-z.im*w.im,im:z.re*w.im+z.im*w.re};
  assert.ok(Math.abs(Math.hypot(product.re,product.im)-Math.hypot(z.re,z.im)*Math.hypot(w.re,w.im))<1e-12);
  for(const n of [2,3,4,5]) for(let k=0;k<n;k++) {
    const r=3**(1/n), a=(.7+2*k*Math.PI)/n;
    assert.ok(Math.abs(r**n*Math.cos(n*a)-3*Math.cos(.7))<1e-11);
    assert.ok(Math.abs(r**n*Math.sin(n*a)-3*Math.sin(.7))<1e-11);
  }
});

test("aucun registre, compteur, barème historique ou document C n'est remplacé", async () => {
  const snapshot = JSON.stringify(learningPaths);
  await sheets();
  assert.equal(JSON.stringify(learningPaths), snapshot);
  const count=learningPaths.reduce((total,path)=>total+getPathLessons(path).reduce((sum,lesson)=>sum+(lesson.questions?.length || 1),0),0);
  assert.equal(count, AVAILABLE_EXERCISES);
  const reader=source("features/lesson/ContinuousCourseScreen.tsx");
  assert.match(reader, /course\?\.levelIds\.includes\(props\.level\.id\)/);
  assert.match(reader, /hidden=\{!summaryVisible\}/);
  const screen=source("features/lesson/document/LessonDocumentScreen.tsx");
  assert.match(screen, /active=\{tab === "essentials"\}/);
  const panel=source("features/lesson/document/MathEssentialsPanel.tsx");
  assert.match(panel, /if \(!active\) return/);
  assert.match(panel, /cancelled = true/);
  assert.match(panel, /Réessayer/);
  assert.doesNotMatch(panel, /submitAttempt|fetch\(|localStorage|xpAwarded/);
});

test("logarithme, exponentielle et puissances conservent domaines et taux de référence", async () => {
  const log=await get("logarithms"), exp=await get("exponential");
  assert.ok(log.includes(String.raw`\frac{\ln(1+x)}x=1`));
  assert.ok(log.includes(String.raw`\frac{\ln x}{x-1}=1`));
  assert.ok(exp.includes(String.raw`x^\alpha=e^{\alpha\ln x}`));
  assert.ok(exp.includes(String.raw`\lvert x\rvert^\alpha`));
  for(const x of [.001,.0001,-.0001,-.001]) {
    assert.ok(Math.abs(Math.log1p(x)/x-1)<.0006);
    assert.ok(Math.abs(Math.expm1(x)/x-1)<.0006);
  }
  for(const x of [.2,1,3,8]) for(const a of [-2,.5,Math.sqrt(2),3]) {
    assert.ok(Math.abs(x**a-Math.exp(a*Math.log(x)))<1e-10);
  }
});

test("intégrales, dérivées et équations différentielles restent mathématiquement cohérentes", async () => {
  const integral=await get("integrals"), derivative=await get("derivatives"), ode=await get("differential");
  assert.ok(integral.includes(String.raw`\int_a^a f(x)\,dx=0`));
  assert.ok(integral.includes("la courbe du bas à celle du haut"));
  assert.ok(derivative.includes("valeur atteinte"));
  assert.ok(derivative.includes("change de signe"));
  assert.ok(derivative.includes(String.raw`\frac{u'v-uv'}{v^2}`));
  for(const value of ["$m=0$", "$m<0$", "$m>0$"]) assert.ok(ode.includes(value));
  for(const m of [-3,0,4]) for(const x of [-1,0,2]) {
    const f=2*Math.exp(-m*x), first=-m*2*Math.exp(-m*x);
    assert.ok(Math.abs(first+m*f)<1e-10);
  }
  for(const w of [.5,2,3]) for(const x of [-1,0,2]) {
    const f=2*Math.cos(w*x)-3*Math.sin(w*x), second=-(w**2)*f;
    assert.ok(Math.abs(second+w**2*f)<1e-12);
  }
  const area=(a:number,b:number)=>(b**3-a**3)/3;
  for(const a of [-2,0,1]) for(const b of [2,3,4]) {
    assert.ok(Math.abs(area(a,b)+area(b,a))<1e-12);
    assert.ok(Math.abs(area(a,b)-area(a,1)-area(1,b))<1e-12);
  }
});

test("statistiques : les deux droites passent par G, sans être abusivement inversées", async () => {
  const body=await get("statistics");
  assert.ok(body.includes(String.raw`b'=\overline x-a'\overline y`));
  assert.ok(body.includes("ce seuil n’est pas une règle universelle"));
  assert.ok(body.includes("cause à effet"));
  assert.ok(body.includes("$r=-1$"));
  const x=[1,2,4,6], y=[7,6,3,2];
  const mean=(v:number[])=>v.reduce((a,b)=>a+b,0)/v.length;
  const xb=mean(x),yb=mean(y);
  const vx=mean(x.map(t=>(t-xb)**2)),vy=mean(y.map(t=>(t-yb)**2));
  const cov=mean(x.map((t,i)=>(t-xb)*(y[i]-yb)));
  const a=cov/vx,b=yb-a*xb,ap=cov/vy,bp=xb-ap*yb;
  assert.ok(Math.abs(a*xb+b-yb)<1e-12);
  assert.ok(Math.abs(ap*yb+bp-xb)<1e-12);
  assert.ok(Math.abs(a*ap-1)>.01);
  assert.ok(cov/Math.sqrt(vx*vy)<0);
});

test("chargement différé, clavier et ancrages restent accessibles sans progression", () => {
  const panel=source("features/lesson/document/MathEssentialsPanel.tsx");
  const css=source("styles/math-essentials.css");
  const continuous=source("features/lesson/ContinuousCourseScreen.tsx");
  assert.match(panel,/window\.location\.reload\(\)/);
  assert.match(panel,/aria-expanded=\{tocOpen\}/);
  assert.match(panel,/prefers-reduced-motion/);
  assert.match(css,/\.legacy-course-essentials \.math-essentials-sheet \.essential-sheet-section \{ scroll-margin-top: 175px/);
  assert.match(css,/\.essential-circle-scroll[^}]*overflow-x: auto/);
  assert.match(continuous,/function legacyTabKeys/);
  assert.match(continuous,/onKeyDown=\{legacyTabKeys\}/);
  for(const value of [panel,css,continuous])assert.doesNotMatch(value,/[\u00a3\u00a7]/);
});
