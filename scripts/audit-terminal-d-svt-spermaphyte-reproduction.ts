import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog";
import { terminalDSvtSpermaphyteReproductionPath } from "../apps/web/src/data/terminalDSvtSpermaphyteReproductionPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const expectedIds = [
  "flowering-plant-scope-pollination",
  "anther-pollen-sacs-dehiscence",
  "microsporogenesis-pollen-grain",
  "ovary-ovule-anatomy",
  "megasporogenesis-embryo-sac",
  "pollination-pollen-tube-guidance",
  "double-fertilization-seed-fruit",
  "official-vocabulary-order-ploidy",
  "spermaphyte-reproduction-final-mission",
];
const expectedRawWeights = [45, 55, 65, 70, 80, 90, 100, 115, 140];
const expectedXp = [590, 720, 860, 920, 1050, 1190, 1320, 1510, 1840];
const expectedQuestionCounts = [10, 10, 11, 10, 11, 11, 12, 12, 15];
const expectedDocumentTitle = "SVT TD_L10_La reproduction chez les spermaphytes.pdf";

const rawLessons = terminalDSvtSpermaphyteReproductionPath.modules.flatMap((module) => module.lessons);
assert.deepEqual(
  rawLessons.map((lesson) => lesson.xp),
  expectedRawWeights,
  "Les poids bruts Web ont divergé du futur manifeste API/Supabase.",
);

const path = applyLessonXpBudget(terminalDSvtSpermaphyteReproductionPath);
const lessons = path.modules.flatMap((module) => module.lessons);

assert.equal(path.id, "terminale-d-svt-l7-spermaphyte-reproduction");
assert.equal(path.subjectId, "svt");
assert.deepEqual(path.levelIds, ["terminale-d"]);
assert.equal(path.chapterNumber, 7);
assert.deepEqual(path.theme, { number: 2, title: "La reproduction chez les mammifères et chez les spermaphytes" });
assert.equal(path.title, "La reproduction chez les spermaphytes");
assert.equal(path.modules.length, 1, "Le parcours autonome doit conserver un module unique.");
assert.equal(lessons.length, 9);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, lessons.length, "Les identifiants de niveaux ne sont pas uniques.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 102);
assert.ok(
  lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 2_200),
  "Chaque niveau doit conserver au moins 2 200 caractères de cours rédigé.",
);

assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 4);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "timeline").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 2);

for (const lesson of lessons) {
  const { interaction } = lesson;
  if (interaction.kind === "schema") {
    const hotspotIds = interaction.hotspots.map((hotspot) => hotspot.id);
    const hotspotNumbers = interaction.hotspots.map((hotspot) => hotspot.number);
    assert.equal(new Set(hotspotIds).size, hotspotIds.length, "Des repères de schéma partagent le même id dans " + lesson.id + ".");
    assert.equal(new Set(hotspotNumbers).size, hotspotNumbers.length, "Des repères de schéma partagent le même numéro dans " + lesson.id + ".");
    assert.ok(interaction.shapes.length >= 5, "Le schéma " + lesson.id + " est trop pauvre.");
  }
  if (interaction.kind === "diagram") {
    const nodeIds = interaction.nodes.map((node) => node.id);
    assert.equal(new Set(nodeIds).size, nodeIds.length, "Des cartes partagent le même id dans " + lesson.id + ".");
    assert.ok(interaction.nodes.length >= 5, "La carte " + lesson.id + " est trop pauvre.");
  }
  if (interaction.kind === "timeline") {
    assert.ok(interaction.items.length >= 6, "La chronologie " + lesson.id + " est incomplète.");
  }
}

assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === expectedDocumentTitle),
  "La référence exacte au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));
assert.ok(
  lessons.every((lesson) => (lesson.source?.corrections.length ?? 0) >= 4),
  "Chaque niveau doit documenter au moins quatre corrections ou précisions de la source.",
);

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 102);
assert.ok(questions.every((question) => question.prompt.trim().length > 0));
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(
  questions.filter((question) => question.sourceLabel?.toLowerCase().includes("page")).length >= 95,
  "Au moins 95 réponses doivent être traçables jusqu’aux pages du PDF.",
);

const choices = questions.filter((question) => question.type !== "short-answer");
const shortAnswers = questions.filter((question) => question.type === "short-answer");
assert.equal(choices.length, 93);
assert.equal(shortAnswers.length, 9);
assert.ok(choices.every((question) => question.options.length === 4));
assert.ok(
  choices.every((question) => question.correctIndex >= 0 && question.correctIndex < question.options.length),
  "Une bonne réponse sort de la liste des propositions.",
);
assert.deepEqual(
  [...new Set(choices.map((question) => question.correctIndex))].sort(),
  [0, 1, 2, 3],
  "Les bonnes réponses doivent occuper les quatre positions.",
);
assert.ok(shortAnswers.every((question) => (question.acceptedAnswers?.length ?? 0) > 0));

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(collectStrings);
  }
  return [];
}

const allStrings = collectStrings(path);
const scientificText = allStrings.join("\n");
const serialized = JSON.stringify(path);
assert.deepEqual(JSON.parse(serialized), path, "Le parcours n’est pas intégralement sérialisable.");

const moduleSource = readFileSync(
  new URL("../apps/web/src/data/terminalDSvtSpermaphyteReproductionPath.ts", import.meta.url),
  "utf8",
);
assert.ok(
  Buffer.byteLength(moduleSource, "utf8") < 250_000,
  "Le module source dépasse le budget de 250 kB.",
);

const catalogLesson = curriculumLessonTitles.find((lesson) => (
  lesson.levelId === "terminale-d"
  && lesson.subjectId === "svt"
  && lesson.title === "La reproduction chez les spermaphytes"
));
assert.equal(catalogLesson?.sequence, 7, "La leçon a quitté sa septième position officielle.");
assert.equal(catalogLesson?.pathId, path.id, "La carte du programme n’ouvre plus le parcours publié.");

const registrySource = readFileSync(
  new URL("../apps/web/src/data/learningPaths.ts", import.meta.url),
  "utf8",
);
assert.ok(
  registrySource.includes('import { terminalDSvtSpermaphyteReproductionPath } from "./terminalDSvtSpermaphyteReproductionPath";'),
  "Le registre Web n’importe plus le parcours L7.",
);
assert.equal(
  registrySource.split("  terminalDSvtSpermaphyteReproductionPath,").length - 1,
  1,
  "Le registre Web doit publier exactement une fois le parcours L7.",
);

const loaderSource = readFileSync(
  new URL("../apps/web/src/data/learningPathLoader.ts", import.meta.url),
  "utf8",
);
assert.equal(
  loaderSource.split('import("./terminalDSvtSpermaphyteReproductionPath")').length - 1,
  1,
  "Le chargeur Terminale D doit découper L7 dans un unique chunk.",
);
assert.ok(
  loaderSource.includes("module.terminalDSvtSpermaphyteReproductionPath"),
  "Le chargeur Terminale D ne récupère plus l’export L7 attendu.",
);
assert.match(
  loaderSource,
  /return\s*\[[^\]]*\bhumanSexualOrgans\b[^\]]*\bspermaphyteReproduction\b[^\]]*\binternalEnvironment\b[^\]]*\]/,
  "Le chargeur doit restituer L7 entre les cartes 6 et 10.",
);

const apiSource = readFileSync(
  new URL("../apps/api/src/curriculum.ts", import.meta.url),
  "utf8",
);
for (const [index, lessonId] of expectedIds.entries()) {
  const expectedEntry = `["${path.id}:${lessonId}", ${expectedRawWeights[index]}]`;
  assert.equal(
    apiSource.split(expectedEntry).length - 1,
    1,
    `Le registre API doit contenir exactement une entrée conforme pour ${lessonId}.`,
  );
}

const migration = readFileSync(
  new URL("../supabase/migrations/20260818090000_svt_d_spermaphyte_reproduction_path.sql", import.meta.url),
  "utf8",
);
assert.ok(migration.includes(path.id), "La migration L7 ne référence plus le parcours attendu.");
assert.ok(
  migration.includes(JSON.stringify(expectedIds)),
  "La migration L7 ne conserve plus l’ordre exact des neuf identifiants.",
);
assert.ok(
  migration.includes("array[45, 55, 65, 70, 80, 90, 100, 115, 140]"),
  "La migration L7 ne conserve plus les neuf poids bruts.",
);
assert.ok(
  migration.includes("590 / 720 / 860 / 920 / 1050 / 1190 / 1320 / 1510 / 1840 = 10 000"),
  "La migration L7 ne documente plus la normalisation exacte à 10 000 XP.",
);

const verifierSource = readFileSync(
  new URL("./verify-project.mjs", import.meta.url),
  "utf8",
);
assert.equal(
  verifierSource.split("audit-terminal-d-svt-spermaphyte-reproduction.ts").length - 1,
  2,
  "Le vérificateur global doit nommer et exécuter exactement une fois l’audit L7.",
);

const mojibakeMarkers = [
  "ÃƒÂ©", "ÃƒÂ¨", "ÃƒÂª", "ÃƒÂ´", "ÃƒÂ®", "ÃƒÂ§", "Ã¢â‚¬â„¢", "Ã¢â‚¬Å“", "Ã¢â‚¬", "Ã‚Â°", "Ã‚Âµ", "ï¿½",
  "Ã©", "Ã¨", "Ãª", "Ã´", "Ã®", "Ã§", "â€™", "â€œ", "â€", "Â°", "Âµ", "�",
];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(!serialized.includes("⃗"), "Une flèche combinante illisible a été introduite.");
assert.ok(
  !/(?:src\/assets|\/assets\/|data:image|<img\b|!\[[^\]]*\]\s*\()/i.test(serialized),
  "Un scan ou une image publiée a été intégré au lieu d’une figure originale sérialisable.",
);
assert.ok(/figure pédagogique originale|représentation pédagogique originale|reconstruction pédagogique originale/i.test(scientificText));

assert.match(scientificText, /spermaphytes[^.\n]{0,220}(?:gymnospermes|angiospermes)/i);
assert.match(scientificText, /(?:double fécondation|zygote[^.\n]{0,120}endosperme)[^.\n]{0,220}angiospermes/i);
assert.match(scientificText, /tapetum[^.\n]{0,180}(?:nourric|microspore)/i);
assert.match(scientificText, /endothèce[^.\n]{0,180}(?:mécan|déhiscence)/i);
assert.match(scientificText, /stomium[^.\n]{0,180}(?:fente|rupture|déhiscence)/i);
assert.match(scientificText, /cellule mère[^.\n]{0,160}2n[^.\n]{0,220}(?:méiose|microspore)/i);
assert.match(scientificText, /gamétophyte mâle[^.\n]{0,220}(?:pollen|cellule végétative|génératrice)/i);
assert.match(scientificText, /type Polygonum[^.\n]{0,220}(?:sept cellules|sept|huit noyaux|dominant)/i);
assert.match(scientificText, /spermatozoïdes? végétaux?[^.\n]{0,160}(?:non mobile|transport)/i);
assert.match(scientificText, /oosphère[^.\n]{0,180}zygote[^.\n]{0,120}2n/i);
assert.match(scientificText, /cellule centrale[^.\n]{0,220}endosperme[^.\n]{0,120}3n/i);
assert.match(scientificText, /ovule[^.\n]{0,120}(?:devient|devenir)[^.\n]{0,80}graine/i);
assert.match(scientificText, /ovaire[^.\n]{0,160}(?:péricarpe|fruit)/i);
assert.match(scientificText, /anthères jeunes[^.\n]{0,120}sacs polliniques/i);
assert.match(scientificText, /2\s*(?:→|-|→)\s*3\s*(?:→|-|→)\s*4\s*(?:→|-|→)\s*1/);
assert.match(scientificText, /a\s*=\s*tube[^.\n]{0,160}b\s*=\s*gamète[^.\n]{0,180}c\s*=\s*cellule végétative/i);
assert.match(scientificText, /1\s+tube[^.\n]{0,220}2\s+et\s+5\s+gamètes[^.\n]{0,220}3\s+oosphère[^.\n]{0,220}4\s+nucelle[^.\n]{0,220}6\s+noyau central/i);

const corrections = lessons.flatMap((lesson) => lesson.source?.corrections ?? []).join("\n");
assert.match(corrections, /angiospermes[^.\n]{0,240}(?:toutes les spermaphytes|spermaphytes)/i);
assert.match(corrections, /gaze[^.\n]{0,220}témoin/i);
assert.match(corrections, /tissus foliaires[^.\n]{0,220}sporophytiques/i);
assert.match(corrections, /tapetum[^.\n]{0,180}endothèce/i);
assert.match(corrections, /tétrade[^.\n]{0,160}microspores/i);
assert.match(corrections, /type Polygonum[^.\n]{0,220}(?:universelle|dominant)/i);
assert.match(corrections, /anthérozoïdes[^.\n]{0,220}(?:spermatozoïdes|gamètes mâles)/i);
assert.match(corrections, /œuf principal[^.\n]{0,220}zygote/i);
assert.match(corrections, /blnucléée[^.\n]{0,120}binucléée/i);
assert.match(corrections, /figure 2[^.\n]{0,260}2 et 5 gamètes[^.\n]{0,220}6 noyau central/i);

const formulas = allStrings.flatMap((text) =>
  [...text.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)].map((match) => match[1] ?? match[2]),
);
assert.ok(formulas.length >= 20, "Les équations de ploïdie contrôlées ont régressé.");
assert.ok(
  formulas.every((formula) => !/(?<!\\)\b(?:mathrm|text|frac|longrightarrow|xrightarrow)\s*\{/.test(formula)),
  "Une commande KaTeX a perdu son antislash dans une chaîne TypeScript.",
);
for (const formula of formulas) {
  katex.renderToString(formula, { throwOnError: true, strict: "error" });
}

console.log("Audit SVT Tle D L7 valide : 9 niveaux, 102 réponses, 9 interactions originales et 10 000 XP.");
