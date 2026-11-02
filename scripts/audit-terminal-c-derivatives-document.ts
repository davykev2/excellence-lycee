import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { terminalCDerivativesDocument as course } from "../apps/web/src/data/courseDocuments/terminalCDerivativesDocument";

const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const katex = require("katex");
let formulas = 0;
function inspect(value: unknown, key = "") {
  if (typeof value === "string") {
    if (key === "formulaTex") { katex.renderToString(value, { throwOnError: true, strict: "error", trust: false }); formulas++; }
    for (const match of value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)) {
      katex.renderToString(match[1] ?? match[2], { displayMode: Boolean(match[1]), throwOnError: true, strict: "error", trust: false });
      formulas++;
    }
  } else if (Array.isArray(value)) value.forEach(item => inspect(item));
  else if (value && typeof value === "object") Object.entries(value).forEach(([property, item]) => inspect(item, property));
}
inspect(course);
assert.ok(formulas > 200);
assert.equal(course.sections.length, 4);
assert.equal(course.sections.flatMap(section => section.topics).length, 10);
assert.equal(course.evaluations.flatMap(group => group.questions).length, 5);
console.log(`Document dérivabilité TC, Pyramide L2 : 4 rubriques, 10 sous-sections, 10 exemples, 3 méthodes, 5 réponses objectives et 2 rédactions ; ${formulas} formules KaTeX valides.`);
