import assert from "node:assert/strict";
import {createRequire} from "node:module";
import {terminalALogarithmDocument as d} from "../apps/web/src/data/courseDocuments/terminalALogarithmDocument";
const require=createRequire(new URL("../apps/web/package.json",import.meta.url)),katex=require("katex");
let formulas=0;
function inspect(value:unknown){
 if(typeof value==="string")for(const match of value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)){
  const math=match[1]??match[2];try{katex.renderToString(math,{displayMode:Boolean(match[1]),throwOnError:true,strict:"error",trust:false});}catch(error){throw new Error(math+" : "+error);}formulas++;
 }else if(Array.isArray(value))value.forEach(inspect);else if(value&&typeof value==="object")Object.values(value).forEach(inspect);
}
inspect(d);assert.equal(d.sections.flatMap(s=>s.topics).length,12);assert.equal(d.evaluations.flatMap(g=>g.questions).length,36);assert.ok(formulas>300,String(formulas));
console.log(`Logarithme TA : 5 rubriques / 12 parties / 36 réponses / 8 rédactions ; ${formulas} expressions KaTeX valides.`);
