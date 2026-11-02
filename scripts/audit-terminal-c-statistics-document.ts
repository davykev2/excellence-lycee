import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { terminalCStatisticsDocument as course } from "../apps/web/src/data/courseDocuments/terminalCStatisticsDocument";
import { terminalCStatisticsExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCStatisticsExercises";
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
assert.equal(course.sections.length,7);assert.equal(bank.sections.flatMap(s=>s.exercises).length,37);
assert.ok(count>800,String(count));
console.log("Statistique TC · Pyramide L10 : 7 rubriques, 4 méthodes, 37 exercices ; "+count+" formules KaTeX strictes.");
