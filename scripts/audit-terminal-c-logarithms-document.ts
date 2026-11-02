import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { terminalCLogarithmsDocument as course } from "../apps/web/src/data/courseDocuments/terminalCLogarithmsDocument";
import { terminalCLogarithmsExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCLogarithmsExercises";

const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const katex = require("katex");
let formulas = 0;
function inspect(value: unknown, key = "") {
  if (typeof value === "string") {
    if (key === "formulaTex") { katex.renderToString(value, { throwOnError: true, strict: "error", trust: false }); formulas++; }
    for (const match of value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)) {
      katex.renderToString(match[1] ?? match[2], { displayMode: Boolean(match[1]), throwOnError: true, strict: "error", trust: false }); formulas++;
    }
  } else if (Array.isArray(value)) value.forEach(item => inspect(item));
  else if (value && typeof value === "object") Object.entries(value).forEach(([property, item]) => inspect(item, property));
}
inspect(course); inspect(bank);
assert.equal(course.sections.length, 5);
assert.equal(course.sections.flatMap(section => section.topics).length, 8);
assert.equal(bank.sections.flatMap(section => section.exercises).length, 42);
assert.ok(formulas > 1500, String(formulas));
console.log(`Logarithmes TC · Pyramide L4 : 5 rubriques, 8 sous-sections, 3 méthodes, 42 exercices ; ${formulas} formules KaTeX valides.`);
