import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { terminalCProbabilityDocument as course } from "../apps/web/src/data/courseDocuments/terminalCProbabilityDocument";
import { terminalCProbabilityExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCProbabilityExercises";
const require=createRequire(new URL("../apps/web/package.json",import.meta.url)),katex=require("katex");
let count=0;
function visit(value:unknown){
  if(typeof value==="string")for(const m of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)){
    katex.renderToString(m[1]??m[2],{throwOnError:true,strict:"error",trust:false,displayMode:Boolean(m[1])});count++;
  }else if(Array.isArray(value))value.forEach(visit);
  else if(value&&typeof value==="object")Object.values(value).forEach(visit);
}
visit(course);visit(bank);
assert.equal(course.sections.length,3);assert.equal(bank.sections.flatMap(s=>s.exercises).length,52);
assert.ok(count>1000,String(count));
console.log("Probabilité conditionnelle TC · Pyramide L9 : 3 rubriques, 3 méthodes, 52 exercices ; "+count+" formules KaTeX strictes.");
