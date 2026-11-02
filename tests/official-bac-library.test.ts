import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { existsSync, readFileSync, statSync } from "node:fs";
import { appRouteUrl, readAppRoute, type AppRoute } from "../apps/web/src/routing/appRoute";
import { getOfficialBacPaper, officialBacCatalog, officialBacPapersFor, officialBacYears } from "../apps/web/src/data/officialBacCatalog";
import { INP_HB_COLLECTION_LOCKED } from "../apps/web/src/config/examCollections";
const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const React = require("react"), { renderToStaticMarkup } = require("react-dom/server");
(globalThis as {React?:unknown}).React = React;
const { OfficialBacLibrary } = require("./src/features/arena/OfficialBacLibrary");
const { OfficialBacReader } = require("./src/features/arena/OfficialBacReader");
const render = (component: unknown, props: Record<string, unknown>) => renderToStaticMarkup(React.createElement(component, props));
const asset = (url: string) => new URL("../apps/web/public" + url, import.meta.url);

test("31 documents authentiques, 307 pages et uniquement les deux années fournies", () => {
  assert.equal(officialBacCatalog.length, 31);
  assert.equal(officialBacCatalog.reduce((sum, paper) => sum + paper.pageCount, 0), 307);
  assert.deepEqual(officialBacYears, [2026, 2025]);
  assert.equal(new Set(officialBacCatalog.map(p => p.id)).size, 31);
  assert.equal(officialBacCatalog.filter(p => p.year === 2025).length, 17);
  assert.equal(officialBacCatalog.filter(p => p.year === 2026).length, 14);
  assert.equal(INP_HB_COLLECTION_LOCKED, true);
});

test("les PDF sont des copies binaires intactes et chaque page/miniature existe", () => {
  for (const paper of officialBacCatalog) {
    const bytes = readFileSync(asset(paper.pdfUrl));
    assert.equal(bytes.length, paper.pdfBytes, paper.id);
    assert.equal(bytes.subarray(0, 4).toString(), "%PDF");
    assert.equal(createHash("sha256").update(bytes).digest("hex"), paper.sha256, paper.id);
    assert.equal(paper.pages.length, paper.pageCount);
    assert.ok(existsSync(asset(paper.coverUrl)));
    for (const [i, page] of paper.pages.entries()) {
      assert.ok(page.url.endsWith(`page-${String(i + 1).padStart(3, "0")}.webp`));
      assert.ok(statSync(asset(page.url)).size > 1000, page.url);
      assert.equal(page.width, 1800);
      assert.ok(page.height > 1000);
    }
  }
});

test("chaque série ne reçoit que ses sujets, jamais maths B/G1 ni physique en A", () => {
  for (const year of officialBacYears) for (const level of ["terminale-a", "terminale-c", "terminale-d"]) {
    const papers = officialBacPapersFor(year, level);
    assert.ok(papers.length >= 5);
    assert.ok(papers.every(paper => paper.levelIds.includes(level)));
    const maths = papers.filter(p => p.subject === "Mathématiques");
    assert.deepEqual(maths.map(p => p.series), level === "terminale-a" ? ["A1", "A2"] : [level.slice(-1).toUpperCase()]);
    if (level === "terminale-a") assert.ok(!papers.some(p => /Physique|SVT/.test(p.subject)));
    else assert.ok(papers.some(p => p.subject === "Physique-Chimie") && papers.some(p => p.subject === "SVT"));
  }
  assert.ok(officialBacCatalog.every(p => p.levelIds.every(level => ["terminale-a", "terminale-c", "terminale-d"].includes(level))));
  assert.ok(!officialBacCatalog.some(p => /mathematiques-(b|g1)$/.test(p.id)));
  assert.ok(!officialBacPapersFor(2026, "terminale-a").some(p => p.subject.startsWith("Anglais")));
});

test("les sujets communs utilisent le même objet et les variantes restent distinctes", () => {
  for (const year of officialBacYears) for (const subject of ["Français", "Histoire-Géographie"]) {
    const a = officialBacPapersFor(year, "terminale-a").find(p => p.subject === subject);
    assert.ok(a);
    assert.equal(a, officialBacPapersFor(year, "terminale-c").find(p => p.subject === subject));
    assert.equal(a, officialBacPapersFor(year, "terminale-d").find(p => p.subject === subject));
  }
  assert.notEqual(getOfficialBacPaper(2025, "2025-mathematiques-c", "terminale-c")?.sha256, getOfficialBacPaper(2025, "2025-mathematiques-d", "terminale-d")?.sha256);
  assert.equal(officialBacPapersFor(2025, "terminale-c").find(p => p.subject === "Arts plastiques"), officialBacPapersFor(2025, "terminale-d").find(p => p.subject === "Arts plastiques"));
});

test("un lien d’une autre série ou une classe non prise en charge ne donne aucun document", () => {
  assert.equal(getOfficialBacPaper(2026, "2026-mathematiques-c", "terminale-a"), undefined);
  assert.equal(getOfficialBacPaper(2026, "2025-mathematiques-c", "terminale-c"), undefined);
  assert.equal(getOfficialBacPaper(2026, "2026-mathematiques-d", "terminale-c"), undefined);
  for (const level of ["seconde-c", "premiere-c", "terminale-b", "terminale-g1", "inconnu"]) assert.deepEqual(officialBacPapersFor(2026, level), []);
});

test("année et document survivent à F5 et gardent le contexte de classe/matière", () => {
  const route: AppRoute = {navigation:"arena",arenaMode:"bac",subjectId:"mathematics",examCollection:"bac",bacArchiveYear:2026,bacArchivePaper:"2026-mathematiques-c"};
  const url = appRouteUrl(route,"?__paths-preview=1&__level-preview=terminale-c");
  const params = new URL(url,"http://127.0.0.2:4174");
  assert.equal(params.searchParams.get("__level-preview"),"terminale-c");
  const parsed = readAppRoute(params,{navigation:"home"});
  assert.equal(parsed.bacArchiveYear,2026); assert.equal(parsed.bacArchivePaper,"2026-mathematiques-c");
  assert.equal(parsed.examCollection,"bac");assert.equal(parsed.bacExamSlug,undefined);
  const back = appRouteUrl({...route,bacArchivePaper:undefined},params.search);
  assert.equal(new URL(back,params).searchParams.has("document"),false);
  assert.equal(new URL(appRouteUrl({...route,bacArchiveYear:undefined,bacArchivePaper:undefined},params.search),params).searchParams.has("annee"),false);
});

test("les paramètres d’archive n’affectent ni les concours, ni les autres pages", () => {
  for (const pathname of ["/parcours","/arene/exercices","/arene/exos-types-bac/2024","/arene/concours-bac-ci-2024/resultats"]) {
    const route=readAppRoute({pathname,search:"?collection=bac&annee=2026&document=2026-mathematiques-c"},{navigation:"home"});
    assert.equal(route.bacArchiveYear,undefined);assert.equal(route.bacArchivePaper,undefined);
  }
  for(const search of ["?collection=inp-hb&annee=2026&document=2026-svt-c","?collection=bac&annee=2030&document=2026-svt-c","?collection=bac&document=2026-svt-c"]) {
    assert.equal(readAppRoute({pathname:"/arene/exos-types-bac",search},{navigation:"home"}).bacArchivePaper,undefined);
  }
  assert.equal(readAppRoute({pathname:"/arene/exos-types-bac",search:"?collection=bac&annee=2026&document=../../api"},{navigation:"home"}).bacArchivePaper,undefined);
});

test("les cartes de matières sont filtrées par profil, sans sélecteur de série ni formulaire", () => {
  for (const levelId of ["terminale-a","terminale-c","terminale-d"]) {
    const html = render(OfficialBacLibrary,{levelId,archiveYear:2025,onArchiveSelection:()=>{}});
    assert.equal((html.match(/class="official-bac-subject"/g)??[]).length,officialBacPapersFor(2025,levelId).length);
    assert.doesNotMatch(html,/<select|<input|<textarea|>Valider<|>[^<]*\/20\s*<|>[^<]*\bXP\b[^<]*</);
    assert.match(html,new RegExp(`Série ${levelId.slice(-1).toUpperCase()}`));
  }
  const unavailable = render(OfficialBacLibrary,{levelId:"terminale-a",archiveYear:2026,archivePaperId:"2026-mathematiques-c",onArchiveSelection:()=>{}});
  assert.match(unavailable,/Ce document n’est pas disponible pour ta série/);
});

test("le lecteur affiche toutes les pages dans l’ordre avec PDF original et zoom", () => {
  for(const paper of officialBacCatalog) {
    const html=render(OfficialBacReader,{paper,onBack:()=>{}});
    assert.equal((html.match(/<figure class="official-bac-page"/g)??[]).length,paper.pageCount);
    let previous=-1;
    for(const page of paper.pages){const position=html.indexOf(`src="${page.url}"`);assert.ok(position>previous);previous=position;}
    assert.match(html,/Télécharger le PDF/);assert.match(html,/Agrandir les pages/);assert.match(html,/Ouvrir le PDF/);
    assert.doesNotMatch(html,/<iframe|<input|<textarea|>Valider<|J’ai fini|>[^<]*\bXP\b[^<]*<|>[^<]*\/20\s*</);
  }
});
