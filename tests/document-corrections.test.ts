import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { terminalCLimitsEvaluations } from "../apps/web/src/data/courseDocuments/terminalCLimitsEvaluations";
import { terminalCDerivativesEvaluations } from "../apps/web/src/data/courseDocuments/terminalCDerivativesEvaluations";
import { DocumentCorrection } from "../apps/web/src/features/lesson/document/DocumentCorrection";

const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const { createElement } = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const evaluation = readFileSync(new URL("../apps/web/src/features/lesson/document/DocumentEvaluation.tsx", import.meta.url), "utf8");
const toggle = readFileSync(new URL("../apps/web/src/features/lesson/document/DocumentCorrection.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../apps/web/src/styles/course-document.css", import.meta.url), "utf8");

test("chaque corrigé est fermé initialement avec un véritable bouton accessible sans validation", () => {
  const html = renderToStaticMarkup(createElement(DocumentCorrection, { children: "CORRIGE_PRIVE_TEST" }));
  assert.match(html, /<button[^>]+type="button"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /aria-controls="solution-/);
  assert.match(html, /Voir la correction/);
  assert.doesNotMatch(html, /CORRIGE_PRIVE_TEST|document-correction-panel/);
  assert.match(toggle, /useState\(false\)/);
  assert.match(toggle, /Masquer la correction/);
  assert.doesNotMatch(toggle, /submitted|localStorage|setDraft|scrollIntoView|window\./);
});

test("exemples, réponses objectives et rédactions ont leur propre bouton et le titre Solution", () => {
  assert.equal((evaluation.match(/<DocumentCorrection>/g) ?? []).length, 3);
  assert.match(evaluation, /function EvaluationExample/);
  assert.match(evaluation, /data-written-task-id=\{task.id\}/);
  assert.match(evaluation, /data-question-id=\{question.id\}/);
  assert.match(toggle, /<h4[^>]*>Solution<\/h4>/);
  assert.doesNotMatch(evaluation, /Solution commentée|Comparer avec le modèle expliqué|Un modèle de rédaction/);
  const status = evaluation.slice(evaluation.indexOf("{status && <section"), evaluation.indexOf("<DocumentCorrection>"));
  assert.match(status, /Réponse attendue/);
  assert.doesNotMatch(status, /question\.correction|MarkdownContent/);
});

test("les solutions et leurs tableaux gardent une taille de lecture de 16 px", () => {
  assert.match(styles, /\.document-correction-button\s*\{[^}]*background:\s*#18713c/);
  assert.match(styles, /\.document-correction-panel \.lesson-rich-content,[\s\S]*?font-size: 1rem/);
  assert.match(styles, /\.document-correction-panel \.lesson-table-scroll table,[\s\S]*?font-size: 1rem/);
  assert.match(styles, /\.document-correction-button:focus-visible/);
});

test("les démonstrations détaillent substitutions, simplifications, signes et conclusions sans changer les réponses", () => {
  const first = terminalCDerivativesEvaluations[0];
  const left = first.questions[0];
  assert.match(left.correction, /f\(3\)=\\frac1\{2-3\}=-1/);
  assert.match(left.correction, /x-3\\ne0/);
  assert.match(left.correction, /x\\to3\^-/);
  assert.deepEqual(left.answer, { kind: "short", accepted: ["1"] });
  const model = first.writtenTasks![0].model;
  for (const step of ["### a)", "### b)", "### c)"]) assert.ok(model.includes(step));
  assert.match(model, /x\^3-27/);
  assert.match(model, /1\\ne27/);
  const inflection = terminalCDerivativesEvaluations[1].questions[0];
  assert.match(inflection.correction, /-2\(\\cos x\)\^\{-3\}\(-\\sin x\)/);
  assert.match(inflection.correction, /changeant de signe/);
  const inverse = terminalCDerivativesEvaluations[2].questions[0];
  assert.match(inverse.correction, /### a\) Chercher l’antécédent/);
  assert.match(inverse.correction, /### b\) Calculer la dérivée/);
  assert.match(inverse.correction, /### c\) Appliquer la formule/);
  assert.deepEqual(inverse.answer, { kind: "short", accepted: ["2"] });
  const bounds = terminalCLimitsEvaluations[2].questions;
  assert.match(bounds[0].correction, /\\frac65\\times\(0\{,\}6\)\^5/);
  assert.match(bounds[1].correction, /2\\times\(0\{,\}19\)\^3/);
  assert.deepEqual(bounds[1].answer, { kind: "interval", lower: 0.19, upper: 0.2, variable: "α" });
});
