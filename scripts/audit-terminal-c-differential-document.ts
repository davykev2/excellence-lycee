import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { terminalCDifferentialDocument as course } from "../apps/web/src/data/courseDocuments/terminalCDifferentialDocument";
import { terminalCDifferentialExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCDifferentialExercises";
const require=createRequire(new URL("../apps/web/package.json",import.meta.url)),katex=require("katex");
let count=0;
function visit(value:unknown) {
  if(typeof value==="string") for(const m of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)) {
    katex.renderToString(m[1]??m[2],{throwOnError:true,strict:"error",trust:false,displayMode:Boolean(m[1])});count++;
  }
  else if(Array.isArray(value))value.forEach(visit);
  else if(value&&typeof value==="object")Object.values(value).forEach(visit);
}
visit(course);visit(bank);
assert.equal(course.sections.length,5);assert.equal(bank.sections.flatMap(s=>s.exercises).length,39);
assert.ok(count>900,String(count));
console.log("Équations différentielles TC · Pyramide L8 : 5 rubriques, 7 méthodes, 39 exercices ; "+count+" formules KaTeX strictes.");
