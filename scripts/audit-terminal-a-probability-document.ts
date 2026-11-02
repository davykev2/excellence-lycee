import assert from "node:assert/strict";
import {createRequire} from "node:module";
import {terminalA1ProbabilityDocument as a1,terminalA2ProbabilityDocument as a2} from "../apps/web/src/data/courseDocuments/terminalAProbabilityDocument";
const require=createRequire(new URL("../apps/web/package.json",import.meta.url)),katex=require("katex");
let formulas=0;
function inspect(value:unknown){
 if(typeof value==="string")for(const match of value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)){
  const math=match[1]??match[2];try{katex.renderToString(math,{displayMode:Boolean(match[1]),throwOnError:true,strict:"error",trust:false});}catch(error){throw new Error(math+" : "+error);}formulas++;
 }else if(Array.isArray(value))value.forEach(inspect);else if(value&&typeof value==="object")Object.values(value).forEach(inspect);
}
inspect(a1);inspect(a2);
assert.equal(a1.sections.flatMap(section=>section.topics).length,14);assert.equal(a2.sections.flatMap(section=>section.topics).length,8);
assert.equal(a1.evaluations.flatMap(group=>group.questions).length,40);assert.equal(a2.evaluations.flatMap(group=>group.questions).length,25);
assert.ok(formulas>700,String(formulas));
console.log(`Probabilité TA : A1 14 parties / 40 réponses / 9 rédactions ; A2 8 parties / 25 réponses / 5 rédactions ; ${formulas} formules KaTeX valides.`);
