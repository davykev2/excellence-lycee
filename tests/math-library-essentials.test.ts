import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog";
import { schoolLevels, subjects } from "../apps/web/src/data/programme";
import type { CourseDocument } from "../apps/web/src/domain/courseDocument";
import { isMathDomain, mathDomainForLesson, mathDomains } from "../apps/web/src/domain/mathLibrary";
import { appRouteUrl, readAppRoute } from "../apps/web/src/routing/appRoute";

const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const { createElement } = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
(globalThis as { React?: unknown }).React = require("react");
require.extensions[".css"] = () => {};
const { LearningLibraryScreen } = require("./src/features/paths/LearningLibraryScreen");
const { DocumentEssentials } = require("./src/features/lesson/document/DocumentEssentials");
const source = (file: string) => readFileSync(new URL(`../apps/web/src/${file}`, import.meta.url), "utf8");
const mathLessons = curriculumLessonTitles.filter(lesson => lesson.subjectId === "mathematics");
const noAction = () => {};

test("les deux domaines classent toutes les leçons actuelles sans changer le catalogue", () => {
  const before = JSON.stringify(curriculumLessonTitles);
  assert.deepEqual(mathDomains.map(domain => domain.label), ["Analyse et probabilité", "Algèbre et géométrie"]);
  const counts = {
    "seconde-a": [4, 4], "seconde-c": [4, 11], "premiere-a": [5, 3], "premiere-c": [9, 8],
    "premiere-d": [9, 6], "terminale-a": [8, 1], "terminale-c": [10, 9], "terminale-d": [10, 2],
  };
  for (const [level, expected] of Object.entries(counts)) {
    const lessons = mathLessons.filter(lesson => lesson.levelId === level);
    assert.deepEqual(mathDomains.map(domain => lessons.filter(lesson => mathDomainForLesson(lesson) === domain.id).length), expected);
    assert.ok(lessons.every(lesson => mathDomainForLesson(lesson)), level);
  }
  assert.ok(curriculumLessonTitles.filter(lesson => lesson.subjectId !== "mathematics").every(lesson => !mathDomainForLesson(lesson)));
  assert.equal(JSON.stringify(curriculumLessonTitles), before);
});

test("la bibliothèque expose deux boutons accessibles et filtre sans renuméroter", () => {
  const props = {
    level: schoolLevels.find(level => level.id === "terminale-c")!, subjects: Object.values(subjects),
    selectedSubjectId: "mathematics", paths: [], catalogLessons: curriculumLessonTitles,
    onSubjectChange: noAction, onSelectPath: noAction, onBackHome: noAction, onMathDomainChange: noAction,
  };
  const analysis = renderToStaticMarkup(createElement(LearningLibraryScreen, { ...props, mathDomain: "analyse" }));
  const algebra = renderToStaticMarkup(createElement(LearningLibraryScreen, { ...props, mathDomain: "algebre" }));
  for (const html of [analysis, algebra]) {
    assert.match(html, /aria-label="Domaines de mathématiques"/);
    assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 1);
    assert.equal((html.match(/aria-pressed="false"/g) ?? []).length, 1);
  }
  assert.equal((analysis.match(/class="lesson-library-card /g) ?? []).length, 10);
  assert.equal((algebra.match(/class="lesson-library-card /g) ?? []).length, 9);
  assert.match(analysis, /Limites et continuité/);
  assert.doesNotMatch(analysis, /PPCM et PGCD/);
  assert.match(algebra, /PPCM et PGCD/);
  assert.match(algebra, /lesson-library-number">11</);
  assert.doesNotMatch(algebra, /Limites et continuité/);
  const svt = renderToStaticMarkup(createElement(LearningLibraryScreen, { ...props, selectedSubjectId: "svt", mathDomain: "analyse" }));
  assert.doesNotMatch(svt, /Domaines de mathématiques/);
});

test("un titre futur non classé reste visible sans attribuer un domaine inventé", () => {
  const future = { id: "future", levelId: "terminale-c", subjectId: "mathematics" as const, title: "Nouveau chapitre", sequence: 20 };
  assert.equal(mathDomainForLesson(future), undefined);
  for (const mathDomain of ["analyse", "algebre"]) {
    const html = renderToStaticMarkup(createElement(LearningLibraryScreen, {
      level: schoolLevels.find(level => level.id === future.levelId)!, subjects: [subjects.mathematics],
      selectedSubjectId: "mathematics", paths: [], catalogLessons: [future], mathDomain,
      onSubjectChange: noAction, onSelectPath: noAction, onBackHome: noAction, onMathDomainChange: noAction,
    }));
    assert.match(html, /Nouveau chapitre/);
  }
});

test("les adresses du domaine et de L’essentiel survivent à F5 et aux liens profonds", () => {
  for (const pathname of ["/parcours", "/parcours/terminale-c-math-l11-lcm-gcd"]) {
    for (const mathDomain of ["analyse", "algebre"] as const) {
      const route = readAppRoute({ pathname, search: `?matiere=mathematics&domaine=${mathDomain}&vue=essentiel` }, { navigation: "home" });
      assert.equal(route.mathDomain, mathDomain);
      assert.equal(route.courseTab, pathname === "/parcours" ? undefined : "essentials");
      const url = new URL(appRouteUrl(route, "?__paths-preview=1&__level-preview=terminale-c"), "https://example.test");
      assert.equal(url.searchParams.get("domaine"), mathDomain);
      assert.equal(url.searchParams.get("vue"), pathname === "/parcours" ? null : "essentiel");
      assert.equal(url.searchParams.get("__level-preview"), "terminale-c");
      assert.deepEqual(readAppRoute(url, { navigation: "home" }), route);
    }
  }
  const route = readAppRoute({ pathname: "/parcours/cours", search: "?vue=essentiel&domaine=algebre" }, { navigation: "home", subjectId: "mathematics" });
  assert.equal(route.courseTab, "essentials");
  assert.equal(route.mathDomain, "algebre");
});

test("les valeurs invalides ou destinées à une autre matière ne contaminent pas la navigation", () => {
  for (const subject of ["english", "french"]) {
    const route = readAppRoute({ pathname: "/parcours/cours", search: `?matiere=${subject}&domaine=algebre&vue=essentiel` }, { navigation: "home" });
    assert.equal(route.mathDomain, undefined);
    assert.equal(route.courseTab, undefined);
    assert.doesNotMatch(appRouteUrl({ ...route, mathDomain: "algebre", courseTab: "essentials" }, ""), /domaine=|vue=/);
  }
  for (const subject of ["svt", "physics-chemistry", "history-geography", "philosophy"]) {
    const route = readAppRoute({ pathname: "/parcours/cours", search: `?matiere=${subject}&domaine=algebre&vue=essentiel` }, { navigation: "home" });
    assert.equal(route.mathDomain, undefined);
    assert.equal(route.courseTab, "essentials");
    const url = appRouteUrl(route, "");
    assert.doesNotMatch(url, /domaine=/);
    assert.match(url, /vue=essentiel/);
  }
  assert.equal(isMathDomain("analyse"), true);
  for (const value of [null, undefined, "unknown", "Analyse", "<script>"]) assert.equal(isMathDomain(value), false);
  const invalid = readAppRoute({ pathname: "/parcours/cours", search: "?matiere=mathematics&domaine=unknown&vue=unknown" }, { navigation: "home" });
  assert.equal(invalid.mathDomain, undefined);
  assert.equal(invalid.courseTab, undefined);
  assert.equal(appRouteUrl(invalid, ""), "/parcours/cours?matiere=mathematics");
  assert.equal(appRouteUrl({ navigation: "home", subjectId: "mathematics", mathDomain: "algebre", courseTab: "essentials" }, ""), "/?matiere=mathematics");
});

const course: CourseDocument = {
  id: "fixture-only", version: 1, levelIds: ["terminale-c"],
  source: { title: "Test", pageCount: 1, summaryPages: [1], evaluationPages: [] },
  sections: [{ id: "section", numeral: "I", title: "Résumé", topics: [{ id: "rule", title: "Règle", pages: [1], body: "Explication complète conservée." }] }],
  evaluations: [], legacyAnchors: {},
};
const reader = (document: CourseDocument) => renderToStaticMarkup(createElement(DocumentEssentials, {
  cards: document.essentials, topicIds: document.sections.flatMap(section => section.topics.map(topic => topic.id)), onReview: noAction,
}));

test("le troisième onglet est accessible et n’invente aucun contenu en attente du porteur", () => {
  const html = reader(course);
  assert.match(html, /L’essentiel/);
  assert.match(html, /Contenu à venir\./);
  assert.doesNotMatch(html, /document-essential-card|Revoir dans le résumé/);
  const screen = source("features/lesson/document/LessonDocumentScreen.tsx");
  assert.equal((screen.match(/role="tab"/g) ?? []).length, 3);
  assert.match(screen, /const hasEssentialsTab = subject.id === "mathematics"/);
  assert.match(screen, /tabs.includes\(requestedTab\) \? requestedTab : "summary"/);
  assert.match(screen, /data-tab="essentials" aria-selected=\{tab === "essentials"\}/);
  assert.match(screen, /\["summary", "assessment", "essentials"\]/);
  assert.match(screen, /event.key === "Home"/);
  assert.match(screen, /event.key === "End"/);
  assert.match(screen, /tabs.length\) % tabs.length/);
  assert.match(screen, /hidden=\{tab !== "assessment"\}/);
  assert.match(screen, /hidden=\{tab !== "summary"\}/);
  assert.doesNotMatch(screen, /submitAttempt|xpAwarded/);
});

test("le futur contenu fourni accepte les formules et les liens uniquement vers de vraies rubriques", () => {
  // Synthetic fixture only. No actual lesson receives authored essentials in this task.
  const html = reader({ ...course, essentials: [
    { id: "valid", title: "Rappel $x^2$", body: "Pour $x=2$, on a $x^2=4$.", topicId: "rule" },
    { id: "invalid", title: "Sans lien", body: "Texte fourni.", topicId: "missing" },
  ] });
  assert.equal((html.match(/class="document-essential-card"/g) ?? []).length, 2);
  assert.equal((html.match(/Revoir dans le résumé/g) ?? []).length, 1);
  assert.match(html, /class="katex"/);
  assert.doesNotMatch(html, /katex-error|Contenu à venir/);
});

test("les boutons et fiches ont des styles mobiles, un focus visible et une police lisible", () => {
  const library = source("styles/usability.css");
  const reader = source("styles/course-document.css");
  assert.match(library, /\.math-domain-picker > button:focus-visible/);
  assert.match(library, /\.math-domain-picker > button[^}]*min-height: 78px/);
  assert.match(reader, /\.document-tabs-three[^}]*grid-template-columns: 1fr 1fr .8fr/);
  assert.match(reader, /\.document-tabs-three > button[^}]*min-height: 64px/);
  assert.match(reader, /\.document-essential-card \.lesson-rich-content[^}]*font-size: 16px/);
});
