import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { terminalCDivisibilityDocument as course } from "../apps/web/src/data/courseDocuments/terminalCDivisibilityDocument";
import { terminalCDivisibilityExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCDivisibilityExercises";
const require=createRequire(new URL("../apps/web/package.json",import.meta.url)),katex=require("katex");
let count=0;
function visit(value:unknown,location="root"){
  if(typeof value==="string"){
    assert.doesNotMatch(value,/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/,location);
    for(const m of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)){
      try{katex.renderToString(m[1]??m[2],{throwOnError:true,strict:"error",trust:false,displayMode:Boolean(m[1])});}
      catch(error){throw new Error(location+" : "+m[0]+"\n"+String(error));}
      count++;
    }
    assert.equal((value.match(/\$/g)??[]).length%2,0,location+" : délimiteurs incomplets");
  }else if(Array.isArray(value))value.forEach((v,i)=>visit(v,location+"["+i+"]"));
  else if(value&&typeof value==="object")for(const[key,v]of Object.entries(value))visit(v,location+"."+key);
}
visit(course);visit(bank);
const es=bank.sections.flatMap(s=>s.exercises),qs=es.flatMap(e=>e.questions??[]);
assert.equal(course.sections.length,3);assert.equal(es.length,60);assert.ok(count>1200,String(count));
console.log("Divisibilité TC · Tome2 L2 : "+JSON.stringify({
  topics:course.sections.map(s=>s.topics.length),examples:course.sections.flatMap(s=>s.topics).flatMap(t=>t.examples??[]).length,
  exercises:es.length,questions:qs.length,kinds:["short","choice","written"].map(k=>[k,qs.filter(q=>q.answer.kind===k).length]),
  figures:es.filter(e=>e.correctionFigureKey).map(e=>e.sourceNumber),sections:bank.sections.map(s=>[s.id,s.exercises.length]),katex:count,
}));
