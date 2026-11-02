import assert from "node:assert/strict";
import {createRequire} from "node:module";
import {terminalAExponentialDocument as d} from "../apps/web/src/data/courseDocuments/terminalAExponentialDocument";
const require=createRequire(new URL("../apps/web/package.json",import.meta.url)),katex=require("katex");let formulas=0;
function inspect(value:unknown){if(typeof value==="string")for(const m of value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)){katex.renderToString(m[1]??m[2],{displayMode:Boolean(m[1]),throwOnError:true,strict:"error",trust:false});formulas++;}else if(Array.isArray(value))value.forEach(inspect);else if(value&&typeof value==="object")Object.values(value).forEach(inspect);}
inspect(d);assert.equal(d.sections.flatMap(s=>s.topics).length,15);assert.equal(d.evaluations.flatMap(g=>g.questions).length,40);assert.ok(formulas>400);console.log(`Exponentielle TA : 15 parties / 40 réponses / 10 rédactions ; ${formulas} expressions KaTeX valides.`);
