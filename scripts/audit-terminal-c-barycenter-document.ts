import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { terminalCBarycenterDocument as course } from "../apps/web/src/data/courseDocuments/terminalCBarycenterDocument";
import { terminalCBarycenterExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCBarycenterExercises";
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
assert.equal(course.sections.length,2);assert.equal(bank.sections.flatMap(s=>s.exercises).length,41);assert.ok(count>1000,String(count));
console.log("Barycentre TC · Tome2 L1 : 2 rubriques, 11 sous-sections, 2 méthodes, 41 exercices ; "+count+" formules KaTeX strictes.");
