import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { terminalCPrimitivesDocument as course } from "../apps/web/src/data/courseDocuments/terminalCPrimitivesDocument";
import { terminalCPrimitivesExercises as bank } from "../apps/web/src/data/exerciseCollections/terminalCPrimitivesExercises";

const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const katex = require("katex");
let formulas = 0;
function inspect(value: unknown) {
  if (typeof value === "string") for (const match of value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)) {
    katex.renderToString(match[1] ?? match[2], { displayMode: Boolean(match[1]), throwOnError: true, strict: "error", trust: false });
    formulas++;
  }
  else if (Array.isArray(value)) value.forEach(inspect);
  else if (value && typeof value === "object") Object.values(value).forEach(inspect);
}
inspect(course); inspect(bank);
assert.equal(course.sections.length, 4);
assert.equal(course.sections.flatMap(section => section.topics).length, 7);
assert.equal(bank.sections.flatMap(section => section.exercises).length, 38);
assert.ok(formulas > 800, String(formulas));
console.log(`Primitives TC · Pyramide L3 : 4 rubriques, 7 sous-sections, 3 méthodes, 38 exercices ; ${formulas} formules KaTeX valides.`);
