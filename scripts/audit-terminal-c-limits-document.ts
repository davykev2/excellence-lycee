import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { terminalCLimitsContinuityDocument as course } from "../apps/web/src/data/courseDocuments/terminalCLimitsContinuityDocument";

const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const katex = require("katex");
let formulas = 0;
function inspect(value: unknown) {
  if (typeof value === "string") {
    for (const match of value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)) {
      katex.renderToString(match[1] ?? match[2], { displayMode: Boolean(match[1]), throwOnError: true, strict: "error", trust: false });
      formulas++;
    }
  } else if (Array.isArray(value)) value.forEach(inspect);
  else if (value && typeof value === "object") Object.values(value).forEach(inspect);
}
inspect(course);
assert.ok(formulas > 200);
assert.equal(course.sections.length, 4);
assert.equal(course.evaluations.flatMap(group => group.questions).length, 7);
console.log(`Document TC L1 : 4 rubriques, 20 sous-sections, 7 réponses objectives + 1 rédaction ; ${formulas} formules KaTeX valides.`);
