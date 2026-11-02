import assert from"node:assert/strict";
import test from"node:test";
import{createRequire}from"node:module";
import{terminalCGcdDocument as doc}from"../apps/web/src/data/courseDocuments/terminalCGcdDocument";
import{terminalCLcmGcdPath as path}from"../apps/web/src/data/terminalCLcmGcdPath";
import{terminalDMathematicsPaths}from"../apps/web/src/data/terminalDMathPaths";
import{extendedGcd,integerEquation,linearCongruence,primeFactorization,gcdValue,lcmValue}from"../apps/web/src/features/mathematics/gcdMath";
const topics=doc.sections.flatMap(s=>s.topics),lessons=path.modules.flatMap(m=>m.lessons);
test("Markdown conserve les astérisques et produits à l’intérieur du LaTeX, même en gras",()=>{
 const require=createRequire(new URL("../apps/web/package.json",import.meta.url));
 const previous=require.extensions[".css"],global=globalThis as unknown as{React?:unknown},previousReact=global.React;
 require.extensions[".css"]=()=>{};global.React=require("react");
 try{
  const{createElement}=require("react"),{renderToStaticMarkup}=require("react-dom/server");
  const{MarkdownContent}=require("./src/components/MarkdownContent.tsx");
  const html=renderToStaticMarkup(createElement(MarkdownContent,{markdown:String.raw`Pour $a,b\in\mathbb N^*$ : **propriété $k\in\mathbb N^*$** et *texte simple*. Produit $a*b$.`}));
  assert.equal((html.match(/class="katex"/g)??[]).length,3);
  assert.doesNotMatch(html,/katex-error|\$|Lesmultiples/);
  assert.match(html,/<strong>/);assert.match(html,/<em>/);
 }finally{if(previous)require.extensions[".css"]=previous;else delete require.extensions[".css"];if(previousReact)global.React=previousReact;else delete global.React;}
});
test("PPCM/PGCD : résumé fidèle en trois rubriques,13 sous-sections,23 exemples et deux méthodes",()=>{
 assert.deepEqual(doc.sections.map(s=>s.topics.length),[2,9,2]);assert.equal(topics.flatMap(t=>t.examples??[]).length,23);
 assert.equal(doc.evaluations.length,2);assert.equal(doc.evaluations.flatMap(g=>g.examples).length,2);assert.equal(doc.evaluations.flatMap(g=>g.writtenTasks??[]).length,2);
 assert.equal(doc.evaluations.flatMap(g=>g.questions).length,0);
 assert.deepEqual(doc.source.summaryPages,Array.from({length:11},(_,i)=>162+i));assert.deepEqual(doc.source.evaluationPages,[173,174]);
 assert.equal(path.courseDocument,doc);assert.equal(path.presentation,"continuous-course");assert.equal(path.chapterNumber,11);assert.equal(path.theme.title,"Algèbre et géométrie");
 assert.deepEqual(doc.levelIds,["terminale-c"]);assert.ok(!terminalDMathematicsPaths.some(p=>p.id.includes("lcm-gcd")));
});
test("les huit IDs,36 questions historiques et poids XP sont conservés",()=>{
 assert.deepEqual(lessons.map(l=>l.id),Object.keys(doc.legacyAnchors));assert.deepEqual(lessons.map(l=>l.xp),[50,55,60,65,70,75,80,85]);
 assert.equal(lessons.flatMap(l=>l.questions).length,36);
 assert.deepEqual(topics.flatMap(t=>t.legacyLessonIds??[]).sort(),lessons.map(l=>l.id).sort());
 for(const id of Object.values(doc.legacyAnchors))assert.ok(topics.some(t=>t.id===id));
});
test("Euclide signé, Bézout et équations : vérification indépendante exhaustive sur petits entiers",()=>{
 const independent=(a:number,b:number)=>{a=Math.abs(a);b=Math.abs(b);while(b){const r=a%b;a=b;b=r;}return a;};
 for(let a=-15;a<=15;a++)for(let b=-15;b<=15;b++){if(!a&&!b)continue;const z=extendedGcd(BigInt(a),BigInt(b));
  assert.equal(z.gcd,BigInt(independent(a,b)));assert.equal(BigInt(a)*z.u+BigInt(b)*z.v,z.gcd);
  for(const r of z.rows){assert.equal(r.a,r.b*r.q+r.r);assert.ok(r.r>=0n&&r.r<r.b);}
  for(const c of[-12,0,5,18]){const s=integerEquation(BigInt(a),BigInt(b),BigInt(c));assert.equal(s!==null,c%independent(a,b)===0);if(s)for(const k of[-3n,0n,4n])assert.equal(BigInt(a)*(s.x+s.dx*k)+BigInt(b)*(s.y+s.dy*k),BigInt(c));}
 }
 assert.throws(()=>extendedGcd(0n,0n));
});
test("congruences : solutions complètes, modulo réduit et cas sans solution",()=>{
 for(let n=1;n<=25;n++)for(let a=-9;a<=9;a++)for(let b=-7;b<=7;b++){const s=linearCongruence(BigInt(a),BigInt(b),BigInt(n));
  const actual=Array.from({length:n},(_,x)=>x).filter(x=>(a*x-b)%n===0);
  const expected=s?Array.from({length:n},(_,x)=>x).filter(x=>(BigInt(x)-s.residue)%s.step===0n):[];
  assert.deepEqual(expected,actual);
 }
 assert.throws(()=>linearCongruence(1n,1n,0n));assert.equal(linearCongruence(8n,6n,10n)!.step,5n);
});
test("facteurs, exemples et évaluations recalculés sans croire le texte des modèles",()=>{
 assert.equal(gcdValue(92276n,30621n),59n);assert.equal(lcmValue(360n,21n),2520n);
 assert.equal(gcdValue(28n,1323n),7n);assert.equal(lcmValue(28n,1323n),5292n);
 for(const n of[1,2,72,65537,1_000_000])assert.equal(primeFactorization(n).reduce((p,f)=>p*f.prime**f.exponent,1),n);
 assert.throws(()=>primeFactorization(1_000_001));assert.throws(()=>primeFactorization(0));
 const pairs=[];for(let a=1;a<=203;a++)for(let b=1;b<=203;b++)if(Number(lcmValue(BigInt(a),BigInt(b)))+11*Number(gcdValue(BigInt(a),BigInt(b)))===203)pairs.push([a,b]);
 assert.deepEqual(pairs,[[1,192],[3,64],[7,126],[14,63],[63,14],[64,3],[126,7],[192,1]]);
 for(const[a,b,c]of[[39,-11,5],[748,-59,12]]){const s=integerEquation(BigInt(a),BigInt(b),BigInt(c))!;assert.equal(BigInt(a)*s.x+BigInt(b)*s.y,BigInt(c));}
});
