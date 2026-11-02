import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";
import { courseLibraryReferences } from "../apps/web/src/data/courseLibraryReferences";
import { terminalCDAnalysisReminderDocument as course } from "../apps/web/src/data/courseDocuments/terminalCDAnalysisReminderDocument";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog";
import { AVAILABLE_EXERCISES } from "../apps/web/src/data/learningPathMetrics";
import { learningPaths } from "../apps/web/src/data/learningPaths";
import { subjects, schoolLevels } from "../apps/web/src/data/programme";
import { canAccessLearningPath, levelIdForLearningPath } from "../apps/web/src/routing/routeAccess";

const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
(globalThis as { React?: unknown }).React = require("react");
require.extensions[".css"] = () => {};
const { createElement } = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { LearningLibraryScreen } = require("./src/features/paths/LearningLibraryScreen");
const katex = require("katex");
const topics = course.sections.flatMap(section => section.topics);
const topic = (id: string) => topics.find(topic => topic.id === id)!;
const noAction = () => {};
const reference = courseLibraryReferences.find(reference => reference.id === "terminale-cd-math-l00-reminder")!;
const source = (name: string) => readFileSync(new URL(`../apps/web/src/${name}`, import.meta.url), "utf8");

test("le rappel correspond exactement aux deux pages identifiées et aux séries C et D", () => {
  assert.deepEqual(course.source.summaryPages, [9, 10]);
  assert.equal(course.source.pageCount, 740);
  assert.equal(course.source.sha256, "59886C625771AD627E104FAB36C52927DCA046FE6083AAD9791927C7923F2362");
  assert.deepEqual(course.levelIds, ["terminale-c", "terminale-d"]);
  assert.deepEqual(reference.levelIds, course.levelIds);
  assert.equal(reference.chapterNumber, 0);
  assert.equal(reference.title, "Rappel");
  assert.equal(reference.theme.title, "Analyse et probabilité");
  assert.equal(course.sections.length, 3);
  assert.equal(topics.length, 9);
  assert.ok(topics.every(topic => topic.pages.length && topic.pages.every(page => page === 9 || page === 10)));
});

test("les huit tableaux de signes sont reconstruits avec les zéros et dans le bon ordre", () => {
  const tables = topics.flatMap(topic => topic.body.split("\n").filter(line => /^\| \$(ax\+b|ax\^2\+bx\+c)\$/.test(line)));
  assert.deepEqual(tables.map(line => line.split("|").slice(2, -1).map(cell => cell.trim())), [
    ["$-$", "$0$", "$+$"], ["$+$", "$0$", "$-$"],
    ["$+$", "$0$", "$-$", "$0$", "$+$"], ["$-$", "$0$", "$+$", "$0$", "$-$"],
    ["$+$", "$0$", "$+$"], ["$-$", "$0$", "$-$"], ["$+$"], ["$-$"],
  ]);
  assert.match(topic("reminder-affine-sign").body, /a\\ne0/);
  assert.match(topic("reminder-affine-sign").body, /x=x_0=-\\frac ba/);
  assert.match(topic("reminder-quadratic-positive").body, /x_1<x_2/);
  assert.match(topic("reminder-quadratic-positive").body, /l’ordre croissant/);
  assert.match(topic("reminder-quadratic-negative").body, /facteurs du premier degré à coefficients réels/);
});

test("formules du second degré, facteurs, somme et produit conservent leurs hypothèses", () => {
  const content = topics.map(topic => topic.body).join("\n");
  for (const formula of [
    String.raw`\Delta=b^2-4ac`, String.raw`\frac{-b-\sqrt{\Delta}}{2a}`,
    String.raw`\frac{-b+\sqrt{\Delta}}{2a}`, "a(x-x_1)(x-x_2)", String.raw`x_0=-\frac b{2a}`,
    "a(x-x_0)^2", String.raw`x_1+x_2=-\frac ba`, String.raw`x_1x_2=\frac ca`,
  ]) assert.ok(content.includes(formula), formula);
  for (const a of [-3, -1, 1, 4]) for (const b of [-6, -2, 1, 5]) for (const c of [-4, 0, 3]) {
    const delta = b * b - 4 * a * c;
    if (delta <= 0) continue;
    const roots = [(-b - Math.sqrt(delta)) / (2 * a), (-b + Math.sqrt(delta)) / (2 * a)].sort((left, right) => left - right);
    assert.ok(Math.abs(roots[0] + roots[1] + b / a) < 1e-10);
    assert.ok(Math.abs(roots[0] * roots[1] - c / a) < 1e-10);
    for (const [x, sign] of [[roots[0] - 1, Math.sign(a)], [(roots[0] + roots[1]) / 2, -Math.sign(a)], [roots[1] + 1, Math.sign(a)]]) {
      assert.equal(Math.sign(a * x * x + b * x + c), sign);
    }
  }
});

test("les neuf identités remarquables sont toutes présentes et vérifiées indépendamment", () => {
  const identities = course.sections[2].topics.flatMap(topic => [...topic.body.matchAll(/\$\$([\s\S]*?)\$\$/g)].map(match => match[1].replace(/[,.]$/, "")));
  assert.deepEqual(identities, [
    "(a-b)^2=a^2-2ab+b^2", "(a+b)^2=a^2+2ab+b^2", "a^2-b^2=(a-b)(a+b)",
    "(a+b)^3=a^3+3a^2b+3ab^2+b^3", "(a-b)^3=a^3-3a^2b+3ab^2-b^3",
    "a^3-b^3=(a-b)(a^2+ab+b^2)", "a^3+b^3=(a+b)(a^2-ab+b^2)",
    "a^3-1=(a-1)(a^2+a+1)", "a^3+1=(a+1)(a^2-a+1)",
  ]);
  for (let a = -5; a <= 5; a++) for (let b = -5; b <= 5; b++) {
    const equalityPairs = [
      [(a - b) ** 2, a * a - 2 * a * b + b * b], [(a + b) ** 2, a * a + 2 * a * b + b * b],
      [a * a - b * b, (a - b) * (a + b)], [(a + b) ** 3, a ** 3 + 3 * a * a * b + 3 * a * b * b + b ** 3],
      [(a - b) ** 3, a ** 3 - 3 * a * a * b + 3 * a * b * b - b ** 3],
      [a ** 3 - b ** 3, (a - b) * (a * a + a * b + b * b)],
      [a ** 3 + b ** 3, (a + b) * (a * a - a * b + b * b)],
      [a ** 3 - 1, (a - 1) * (a * a + a + 1)], [a ** 3 + 1, (a + 1) * (a * a - a + 1)],
    ];
    for (const [left, right] of equalityPairs) assert.ok(left === right);
  }
});

test("le contenu entier rend ses formules en KaTeX strict, sans image ni notices publiques", () => {
  let formulaCount = 0;
  function visit(value: unknown) {
    if (typeof value === "string") {
      assert.doesNotMatch(value, /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/);
      assert.equal((value.match(/\$/g) ?? []).length % 2, 0);
      for (const match of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)) {
        katex.renderToString(match[1] ?? match[2], { throwOnError: true, strict: "error", trust: false });
        formulaCount++;
      }
    } else if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object") Object.values(value).forEach(visit);
  }
  visit(course.sections);
  assert.ok(formulaCount > 100);
  assert.doesNotMatch(JSON.stringify(course.sections), /coquille|document imprime|Excellence rétablit|!\[|<img|scan/i);
  assert.equal(course.evaluations.length, 0);
  assert.equal(course.essentials, undefined);
  assert.deepEqual(course.legacyAnchors, {});
});

test("la carte 00 est active et première en Analyse pour C et D, jamais en Algèbre ou autre classe", () => {
  for (const [levelId, expected] of [["terminale-c", 11], ["terminale-d", 11], ["terminale-a", 8], ["seconde-c", 4]] as const) {
    const props = {
      level: schoolLevels.find(level => level.id === levelId)!, subjects: [subjects.mathematics],
      selectedSubjectId: "mathematics", paths: [], catalogLessons: curriculumLessonTitles, references: courseLibraryReferences,
      onSelectReference: noAction, onSubjectChange: noAction, onSelectPath: noAction, onBackHome: noAction, onMathDomainChange: noAction,
    };
    const html = renderToStaticMarkup(createElement(LearningLibraryScreen, { ...props, mathDomain: "analyse" }));
    assert.equal((html.match(/class="lesson-library-card /g) ?? []).length, expected);
    if (reference.levelIds.includes(levelId)) {
      assert.match(html, /class="lesson-library-card is-ready"[^>]*><span class="lesson-library-number">00<\/span>/);
      assert.ok(html.indexOf(">Rappel<") < html.indexOf("Limites et continuité"));
    } else assert.doesNotMatch(html, />Rappel</);
    const algebra = renderToStaticMarkup(createElement(LearningLibraryScreen, { ...props, mathDomain: "algebre" }));
    assert.doesNotMatch(algebra, />Rappel</);
  }
});

test("l’accès reste cloisonné et le rappel ne devient jamais un parcours XP ni un exercice publié", () => {
  for (const levelId of ["terminale-c", "terminale-d"]) assert.ok(canAccessLearningPath({ role: "student", levelId }, reference));
  for (const levelId of ["terminale-a", "premiere-c", "seconde-c"]) assert.equal(canAccessLearningPath({ role: "student", levelId }, reference), false);
  assert.equal(canAccessLearningPath({ role: "admin", levelId: "premiere-a" }, reference), true);
  assert.equal(levelIdForLearningPath({ role: "admin", levelId: "terminale-d" }, reference), "terminale-d");
  assert.ok(learningPaths.every(path => path.id !== reference.id));
  assert.ok(curriculumLessonTitles.every(lesson => lesson.pathId !== reference.id));
  const canonicalQuestionCount = learningPaths.reduce((total, path) => total + path.modules.reduce((sum, module) => sum + module.lessons.reduce((count, lesson) => count + (lesson.questions?.length ?? 1), 0), 0), 0);
  assert.equal(AVAILABLE_EXERCISES, canonicalQuestionCount);
  assert.equal(curriculumLessonTitles.filter(lesson => lesson.levelId === "terminale-c" && lesson.subjectId === "mathematics").length, 19);
  assert.equal(curriculumLessonTitles.filter(lesson => lesson.levelId === "terminale-d" && lesson.subjectId === "mathematics").length, 12);
});

test("le lecteur de référence n’affiche ni évaluation inventée ni feedback lié à des niveaux inexistants", () => {
  const reader = source("features/lesson/document/LessonDocumentScreen.tsx");
  assert.match(reader, /readingOnly \? "lesson-document lesson-reference-document" : "lesson-document"/);
  assert.match(reader, /className=\{\(readingOnly[^\n]+\+\(className \? " "\+className : ""\)\}/);
  assert.doesNotMatch(reader, /\u00a3|\u00a7/);
  assert.match(reader, /!readingOnly && <button[^>]*assessment/);
  assert.match(reader, /!readingOnly && <div className="document-summary-end"/);
  assert.match(reader, /!readingOnly && <footer className="document-feedback"/);
  assert.match(source("features/lesson/document/CourseReferenceScreen.tsx"), /document=\{terminalCDAnalysisReminderDocument\} readingOnly/);
  const shell = source("LearningApp.tsx");
  assert.match(shell, /canAccessLearningPath\(user, routedReference\)/);
  assert.match(shell, /activeNavigation === "paths" && selectedReference/);
  assert.match(shell, /route.courseTab === "assessment"/);
  assert.match(shell, /references=\{courseLibraryReferences\}/);
});
