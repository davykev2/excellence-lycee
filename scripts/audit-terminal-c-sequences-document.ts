import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { terminalCSequencesDocument as course } from "../apps/web/src/data/courseDocuments/terminalCSequencesDocument";
import { terminalCSequencesExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCSequencesExercises";
const require = createRequire(new URL("../apps/web/package.json", import.meta.url)), katex = require("katex");
let formulas = 0;
function visit(value: unknown, key = "") {
  if (typeof value === "string") {
    if (key === "formulaTex") { katex.renderToString(value, { throwOnError: true, strict: "error", trust: false }); formulas++; }
    for (const match of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)) {
      katex.renderToString(match[1] ?? match[2], { throwOnError: true, strict: "error", trust: false, displayMode: Boolean(match[1]) }); formulas++;
    }
  } else if (Array.isArray(value)) value.forEach(item => visit(item));
  else if (value && typeof value === "object") Object.entries(value).forEach(([property, item]) => visit(item, property));
}
visit(course); visit(bank);
assert.equal(course.sections.length, 8); assert.equal(course.sections.flatMap(section => section.topics).length, 10);
assert.equal(bank.sections.flatMap(section => section.exercises).length, 55); assert.ok(formulas > 1800, String(formulas));
console.log("Suites numériques TC · Pyramide L6 : 8 rubriques, 10 sous-sections, 3 méthodes, 55 exercices ; " + formulas + " formules KaTeX valides.");
