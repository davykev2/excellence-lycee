import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { terminalCComplexDocument as course } from "../apps/web/src/data/courseDocuments/terminalCComplexDocument";
import { terminalCComplexExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCComplexExercises";
const require=createRequire(new URL("../apps/web/package.json",import.meta.url)),katex=require("katex");
let count=0;
function visit(v:unknown,loc="root"){
 if(typeof v==="string"){
  assert.doesNotMatch(v,/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/,loc);
  assert.equal((v.match(/\$/g)??[]).length%2,0,loc+" : délimiteurs");
  for(const m of v.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)){
   try{katex.renderToString(m[1]??m[2],{throwOnError:true,strict:"error",trust:false,displayMode:Boolean(m[1])});}
   catch(e){throw new Error(loc+" : "+m[0]+"\n"+String(e));}
   count++;
  }
 }else if(Array.isArray(v))v.forEach((x,i)=>visit(x,loc+"["+i+"]"));
 else if(v&&typeof v==="object")for(const[k,x]of Object.entries(v))visit(x,loc+"."+k);
}
visit(course);visit(bank);
const es=bank.sections.flatMap(s=>s.exercises),qs=es.flatMap(e=>e.questions??[]);
assert.equal(es.length,80);assert.equal(course.sections.length,4);
console.log("Nombres complexes TC · Tome2 L5 : "+JSON.stringify({
 topics:course.sections.map(s=>s.topics.length),examples:course.sections.flatMap(s=>s.topics).flatMap(t=>t.examples??[]).length,
 exercises:es.length,questions:qs.length,perExercise:es.map(e=>e.questions!.length),
 kinds:["short","choice","written"].map(k=>[k,qs.filter(q=>q.answer.kind===k).length]),
 figures:es.filter(e=>e.correctionFigureKey).map(e=>e.sourceNumber),sections:bank.sections.map(s=>[s.id,s.exercises.length]),katex:count,
}));
