import assert from "node:assert/strict";
import {createRequire} from "node:module";
import {terminalAPolynomialDocument as course} from "../apps/web/src/data/courseDocuments/terminalAPolynomialDocument";
import {terminalAPolynomialRationalPath as path} from "../apps/web/src/data/terminalAPolynomialRationalPath";
const require=createRequire(new URL("../apps/web/package.json",import.meta.url));
const katex=require("katex");
let formulas=0;
function inspect(value:unknown){
 if(typeof value==="string")for(const match of value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)){
  try{katex.renderToString(match[1]??match[2],{displayMode:Boolean(match[1]),throwOnError:true,strict:"error",trust:false});}
  catch(error){throw new Error("Formule invalide : "+(match[1]??match[2])+" / "+error);}
  formulas++;
 }else if(Array.isArray(value))value.forEach(inspect);
 else if(value&&typeof value==="object")Object.values(value).forEach(inspect);
}
inspect(course);
assert.equal(course.sections.length,7);assert.equal(course.sections.flatMap(section=>section.topics).length,21);
assert.equal(course.evaluations.flatMap(group=>group.questions).length,28);
assert.equal(course.evaluations.flatMap(group=>group.writtenTasks??[]).length,4);
assert.equal(path.modules.flatMap(module=>module.lessons).length,19);
assert.ok(formulas>500,String(formulas));
console.log(`Terminale A · fonctions : 7 rubriques, 21 sous-sections, 28 réponses courtes, 4 rédactions, ${formulas} formules valides.`);
