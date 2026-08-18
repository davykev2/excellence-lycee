import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog";
import { terminalDSvtInternalEnvironmentPath } from "../apps/web/src/data/terminalDSvtInternalEnvironmentPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const expectedIds = [
  "renal-homeostasis-architecture",
  "nephron-structure-urine-pathway",
  "glomerular-filtration-selectivity",
  "tubular-reabsorption-secretion-excretion",
  "water-load-diuresis-osmolarity",
  "adh-water-balance-feedback",
  "renin-angiotensin-aldosterone-system",
  "renal-acid-base-regulation",
  "renal-experiments-critical-analysis",
  "internal-environment-final-mission",
];
const expectedRawWeights = [45, 55, 65, 75, 85, 90, 95, 100, 110, 140];
const expectedXp = [520, 640, 760, 870, 990, 1050, 1100, 1160, 1280, 1630];
const expectedQuestionCounts = [10, 10, 11, 11, 12, 10, 12, 10, 11, 13];
const expectedDocumentTitle = "SVT TD_L5_Le maintien de la constance du milieu intérieur (4).pdf";

const rawLessons = terminalDSvtInternalEnvironmentPath.modules.flatMap((module) => module.lessons);
assert.deepEqual(
  rawLessons.map((lesson) => lesson.xp),
  expectedRawWeights,
  "Les poids bruts Web ont divergé du futur manifeste API/Supabase.",
);

const path = applyLessonXpBudget(terminalDSvtInternalEnvironmentPath);
const lessons = path.modules.flatMap((module) => module.lessons);

assert.equal(path.id, "terminale-d-svt-l10-internal-environment");
assert.equal(path.subjectId, "svt");
assert.deepEqual(path.levelIds, ["terminale-d"]);
assert.equal(path.chapterNumber, 10);
assert.equal(lessons.length, 10);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, lessons.length, "Les identifiants de niveaux ne sont pas uniques.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 110);
assert.ok(
  lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_800),
  "Chaque niveau doit conserver au moins 1 800 caractères de cours rédigé.",
);

const catalogLesson = curriculumLessonTitles.find((lesson) => (
  lesson.levelId === "terminale-d"
  && lesson.subjectId === "svt"
  && lesson.title === "Le maintien de la constance du milieu intérieur"
));
assert.equal(catalogLesson?.sequence, 10, "La leçon a quitté sa dixième position officielle.");
assert.equal(catalogLesson?.pathId, path.id, "La carte du programme n’ouvre plus le parcours publié.");

const loaderSource = readFileSync(
  new URL("../apps/web/src/data/learningPathLoader.ts", import.meta.url),
  "utf8",
);
assert.ok(loaderSource.includes('import("./terminalDSvtInternalEnvironmentPath")'));
assert.ok(loaderSource.includes("module.terminalDSvtInternalEnvironmentPath"));
assert.ok(loaderSource.includes("return [conditionedReflex, nervousTissue, skeletalMuscle, heart, internalEnvironment];"));

const registrySource = readFileSync(
  new URL("../apps/web/src/data/learningPaths.ts", import.meta.url),
  "utf8",
);
assert.ok(registrySource.includes('import { terminalDSvtInternalEnvironmentPath } from "./terminalDSvtInternalEnvironmentPath";'));
assert.ok(registrySource.includes("  terminalDSvtInternalEnvironmentPath,"));

assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 2);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "timeline").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "curve").length, 2);

const waterCurve = lessons.find((lesson) => lesson.id === "water-load-diuresis-osmolarity")?.interaction;
assert.equal(waterCurve?.kind, "curve");
if (waterCurve?.kind === "curve") {
  assert.deepEqual(waterCurve.rule, {
    kind: "samples",
    points: [[-20, 0.9], [-10, 1.05], [0, 0.85], [10, 0.95], [20, 1.1], [30, 1.8], [40, 2.6], [50, 3.4], [60, 4.3], [65, 3.65], [70, 3.85], [80, 3.95], [90, 3.55]],
  });
  assert.deepEqual(waterCurve.window, { xMin: -20, xMax: 90, yMin: 0, yMax: 5 });
}

const osmolarityCurve = lessons.find((lesson) => lesson.id === "internal-environment-final-mission")?.interaction;
assert.equal(osmolarityCurve?.kind, "curve");
if (osmolarityCurve?.kind === "curve") {
  assert.deepEqual(osmolarityCurve.rule, {
    kind: "samples",
    points: [[0, 300], [20, 298], [40, 294], [60, 291], [80, 292], [100, 295], [120, 297], [150, 300], [180, 300]],
  });
  assert.deepEqual(osmolarityCurve.window, { xMin: 0, xMax: 180, yMin: 289, yMax: 303 });
}

for (const lesson of lessons) {
  const { interaction } = lesson;
  if (interaction.kind === "curve") {
    assert.equal(interaction.rule.kind, "samples", `La courbe ${lesson.id} doit rester expérimentale.`);
    if (interaction.rule.kind !== "samples") {
      throw new Error(`La courbe ${lesson.id} n'utilise pas de points expérimentaux.`);
    }
    assert.ok(interaction.rule.points.length >= 5, `La courbe ${lesson.id} ne contient pas assez de mesures.`);
    assert.ok(
      interaction.rule.points.every((point, index, points) => index === 0 || point[0] > points[index - 1][0]),
      `Les abscisses expérimentales de ${lesson.id} ne sont pas strictement croissantes.`,
    );
  }
  if (interaction.kind === "schema") {
    const hotspotIds = interaction.hotspots.map((hotspot) => hotspot.id);
    const hotspotNumbers = interaction.hotspots.map((hotspot) => hotspot.number);
    assert.equal(new Set(hotspotIds).size, hotspotIds.length, `Des repères de ${lesson.id} partagent le même id.`);
    assert.equal(new Set(hotspotNumbers).size, hotspotNumbers.length, `Des repères de ${lesson.id} partagent le même numéro.`);
  }
  if (interaction.kind === "diagram") {
    const nodeIds = interaction.nodes.map((node) => node.id);
    assert.equal(new Set(nodeIds).size, nodeIds.length, `Des cartes de ${lesson.id} partagent le même id.`);
  }
}

assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === expectedDocumentTitle),
  "La référence exacte au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));
assert.ok(
  lessons.every((lesson) => (lesson.source?.corrections.length ?? 0) >= 3),
  "Chaque niveau doit documenter au moins trois corrections ou précisions de la source.",
);

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 110);
assert.ok(questions.every((question) => question.prompt.trim().length > 0));
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(
  questions.filter((question) => question.sourceLabel?.toLowerCase().includes("page")).length >= 20,
  "Au moins vingt réponses doivent être traçables jusqu’aux pages du PDF.",
);

const choices = questions.filter((question) => question.type !== "short-answer");
const shortAnswers = questions.filter((question) => question.type === "short-answer");
assert.ok(choices.every((question) => question.options.length >= 2));
assert.ok(
  choices.every(
    (question) => question.correctIndex >= 0 && question.correctIndex < question.options.length,
  ),
  "Une bonne réponse sort de la liste des propositions.",
);
assert.deepEqual(
  [...new Set(choices.map((question) => question.correctIndex))].sort(),
  [0, 1, 2, 3],
  "Les bonnes réponses doivent occuper les quatre positions.",
);
assert.ok(shortAnswers.length >= 10, "La banque doit conserver au moins dix réponses courtes.");
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
  new URL("../apps/web/src/data/terminalDSvtInternalEnvironmentPath.ts", import.meta.url),
  "utf8",
);
assert.ok(
  Buffer.byteLength(moduleSource, "utf8") < 250_000,
  "Le module source dépasse le budget de 250 kB.",
);

const apiSource = readFileSync(
  new URL("../apps/api/src/curriculum.ts", import.meta.url),
  "utf8",
);
for (const [index, lessonId] of expectedIds.entries()) {
  assert.ok(
    apiSource.includes(`["${path.id}:${lessonId}", ${expectedRawWeights[index]}]`),
    `Le registre API a divergé pour ${lessonId}.`,
  );
}

const migration = readFileSync(
  new URL("../supabase/migrations/20260818070000_svt_d_internal_environment_path.sql", import.meta.url),
  "utf8",
);
assert.ok(migration.includes(path.id));
assert.ok(migration.includes(JSON.stringify(expectedIds)));
assert.ok(migration.includes("array[45, 55, 65, 75, 85, 90, 95, 100, 110, 140]"));
assert.ok(migration.includes("520 / 640 / 760 / 870 / 990 / 1050 / 1100 / 1160 / 1280 / 1630 = 10 000"));

const mojibakeMarkers = [
  "ÃƒÂ©", "ÃƒÂ¨", "ÃƒÂª", "ÃƒÂ´", "ÃƒÂ®", "ÃƒÂ§", "Ã¢â‚¬â„¢", "Ã¢â‚¬Å“", "Ã¢â‚¬", "Ã‚Â°", "Ã‚Âµ", "ï¿½",
  "Ã©", "Ã¨", "Ãª", "Ã´", "Ã®", "Ã§", "â€™", "â€œ", "â€", "Â°", "Âµ", "�",
];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(!serialized.includes("⃗"), "Une flèche combinante illisible a été introduite.");
assert.ok(!/(?:src\/assets|\/assets\/|data:image|<img\b|!\[[^\]]*\]\s*\()/i.test(serialized), "Un scan ou une image publiée a été intégré au lieu d’une figure originale sérialisable.");
assert.ok(/figure pédagogique originale|représentation pédagogique originale/i.test(scientificText));

assert.match(scientificText, /cortex[^.\n]{0,180}(?:périphérique|externe)/i);
assert.match(scientificText, /médull[^.\n]{0,180}pyramid/i);
assert.match(scientificText, /glucose[^.\n]{0,180}filtr[^.\n]{0,180}réabsorb[^.\n]{0,180}(?:proximal|tube contourné proximal)/i);
assert.match(scientificText, /excrétion[^.\n]{0,120}filtration[^.\n]{0,80}réabsorption[^.\n]{0,80}sécrétion/i);
assert.match(scientificText, /ADH[^.\n]{0,220}(?:synthétisée|produite)[^.\n]{0,160}hypothalam/i);
assert.match(scientificText, /ADH[^.\n]{0,220}(?:libérée|relarguée)[^.\n]{0,160}neurohypophyse/i);
assert.match(scientificText, /AQP2|aquaporine-?2/i);
assert.match(scientificText, /osmorécepteur[^.\n]{0,160}hypothalam/i);
assert.match(scientificText, /angiotensinogène[^.\n]{0,180}(?:substrat|précurseur)/i);
assert.match(scientificText, /rénine[^.\n]{0,180}(?:rein|rénal|juxtaglomérulaire)/i);
assert.match(scientificText, /(?:ECA|enzyme de conversion)[^.\n]{0,180}angiotensine\s*II/i);
assert.match(scientificText, /aldostérone[^.\n]{0,220}(?:tube contourné distal|tubule distal)[^.\n]{0,180}(?:collecteur|collecting duct)/i);
assert.ok(
  allStrings.some((text) => (
    /CO_?2/.test(text)
    && /H_?2O/.test(text)
    && /H_?2CO_?3/.test(text)
    && /H\^?\+/.test(text)
    && /HCO_?3\^?-/.test(text)
    && /(?:\\rightleftharpoons|⇌)/.test(text)
  )),
  "L’équilibre bicarbonate CO2 + H2O ⇌ H2CO3 ⇌ H+ + HCO3- a disparu.",
);
assert.match(scientificText, /mL\/min/i);
assert.match(scientificText, /mOsm\/L/i);

const corrections = lessons.flatMap((lesson) => lesson.source?.corrections ?? []).join("\n");
assert.match(corrections, /cortex[^.\n]{0,220}médull|médull[^.\n]{0,220}cortex/i);
assert.match(corrections, /glucose[^.\n]{0,220}filtr[^.\n]{0,220}réabsorb/i);
assert.match(corrections, /ADH[^.\n]{0,240}hypothalam[^.\n]{0,240}neurohypophyse/i);
assert.match(corrections, /osmorécepteur[^.\n]{0,180}hypothalam/i);
assert.match(corrections, /angiotensinogène[^.\n]{0,180}(?:substrat|précurseur)/i);
assert.match(corrections, /(?:ECA|enzyme de conversion)/i);
assert.match(corrections, /page\s*11[^.\n]{0,240}(?:12[^.\n]{0,100}13|13[^.\n]{0,100}12)[^.\n]{0,100}invers/i);
assert.match(corrections, /page\s*14[^.\n]{0,200}repère\s*12[^.\n]{0,100}manqu/i);
assert.match(corrections, /page\s*15[^.\n]{0,240}courbe[^.\n]{0,120}(?:absente|manquante)/i);
assert.match(corrections, /page\s*15[^.\n]{0,260}glucose[^.\n]{0,180}(?:aucune|fauss|incorrect)/i);
assert.match(corrections, /(?:nom de fichier|fichier)[^.\n]{0,180}L5/i);
assert.match(corrections, /couverture[^.\n]{0,180}(?:LEÇON|Leçon)\s*8/i);
assert.match(corrections, /progression[^.\n]{0,180}(?:chapitre|position)[^.\n]{0,80}10/i);

const formulas = allStrings.flatMap((text) =>
  [...text.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)].map((match) => match[1] ?? match[2]),
);
assert.ok(formulas.length >= 20, "Les équations et unités scientifiques contrôlées ont régressé.");
assert.ok(
  formulas.every((formula) => !/(?<!\\)\b(?:mathrm|text|frac|ce|rightleftharpoons)\s*\{/.test(formula)),
  "Une commande KaTeX a perdu son antislash dans une chaîne TypeScript.",
);
for (const formula of formulas) {
  katex.renderToString(formula, { throwOnError: true, strict: "error" });
}

console.log("Audit SVT Tle D L10 valide : 10 niveaux, 110 réponses, 10 interactions originales et 10 000 XP.");
