import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import { getLessonReward, getPathRewardTotal } from "../apps/api/src/curriculum";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog";
import { terminalDSvtSoilProtectionPath } from "../apps/web/src/data/terminalDSvtSoilProtectionPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const expectedIds = [
  "soil-fertility-diagnosis",
  "mineral-fertilizer-dose-response",
  "earthworms-organic-mineralization",
  "green-manure-nitrogen-cycle",
  "acid-soil-degradation-diagnosis",
  "lime-exchange-neutralization",
  "humus-clay-soil-properties",
  "soil-protection-practices",
  "soil-official-application-exercises",
  "soil-management-final-mission",
];
const expectedRawWeights = [45, 55, 65, 70, 75, 80, 90, 100, 110, 130];
const expectedXp = [550, 670, 790, 850, 910, 980, 1_100, 1_220, 1_340, 1_590];
const expectedPages = [
  "1–5",
  "1–2",
  "2–3",
  "3 et 7–8",
  "3–4",
  "4–5 et 9–10",
  "5",
  "5–6 et 8",
  "8–9",
  "10–11",
];
const expectedQuestionCounts = [10, 10, 10, 12, 10, 12, 10, 15, 12, 15];
const sourceDocument = "SVT TD_L15_Lamélioration et la protection des sols.pdf";
const guideUrl =
  "https://dpfc-ci.net/wp-content/uploads/dpfc_fichiers/2018-2019/programmes_guides/SVT/PROGR_ED_SVT_2018-2019_TLE_D_APC.pdf";

const rawPath = terminalDSvtSoilProtectionPath;
const rawLessons = rawPath.modules.flatMap((module) => module.lessons);

assert.equal(rawPath.id, "terminale-d-svt-l15-soil-protection");
assert.equal(rawPath.subjectId, "svt");
assert.deepEqual(rawPath.levelIds, ["terminale-d"]);
assert.deepEqual(rawPath.theme, { number: 2, title: "La gestion des sols" });
assert.equal(rawPath.chapterNumber, 15);
assert.equal(rawPath.title, "L’amélioration et la protection des sols");
assert.equal(rawPath.curriculumSourceUrl, guideUrl);
assert.equal(rawPath.modules.length, 1);
assert.equal(rawPath.modules[0]?.id, "soil-protection-mastery");
assert.deepEqual(rawLessons.map((lesson) => lesson.id), expectedIds, "Les identifiants autonomes ont changé.");
assert.equal(new Set(rawLessons.map((lesson) => lesson.id)).size, expectedIds.length);
assert.deepEqual(rawLessons.map((lesson) => lesson.xp), expectedRawWeights, "Les poids bruts ont changé.");

const path = applyLessonXpBudget(rawPath);
const lessons = path.modules.flatMap((module) => module.lessons);
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition normalisée a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.equal(getPathRewardTotal(path.id), 10_000, "Le budget API doit rester normalisé à 10 000 XP.");
assert.ok(
  lessons.every((lesson) => getLessonReward(path.id, lesson.id) === lesson.xp),
  "Le registre API doit rester aligné avec le frontend.",
);

assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque autonome a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 116);
assert.ok(lessons.every((lesson) => lesson.question === lesson.questions?.[0]));
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_500));

const interactionCounts = lessons.reduce<Record<string, number>>((counts, lesson) => {
  counts[lesson.interaction.kind ?? "numeric"] = (counts[lesson.interaction.kind ?? "numeric"] ?? 0) + 1;
  return counts;
}, {});
assert.deepEqual(interactionCounts, { diagram: 3, curve: 1, timeline: 3, schema: 3 });

for (const lesson of lessons) {
  const interaction = lesson.interaction;
  JSON.stringify(interaction);
  if (interaction.kind === "schema") {
    assert.ok(interaction.shapes.length >= 20, `Schéma trop pauvre : ${lesson.id}`);
    assert.ok(interaction.hotspots.length >= 6, `Repères insuffisants : ${lesson.id}`);
    assert.equal(new Set(interaction.hotspots.map((hotspot) => hotspot.id)).size, interaction.hotspots.length);
    assert.match(interaction.caption ?? "", /original/i);
  }
  if (interaction.kind === "diagram") {
    assert.ok(interaction.nodes.length >= 6, `Carte trop pauvre : ${lesson.id}`);
    assert.equal(new Set(interaction.nodes.map((node) => node.id)).size, interaction.nodes.length);
  }
  if (interaction.kind === "timeline") {
    assert.ok(interaction.items.length >= 6, `Chaîne trop courte : ${lesson.id}`);
    assert.equal(new Set(interaction.items.map((item) => item.label)).size, interaction.items.length);
  }
}

const doseCurve = lessons.find((lesson) => lesson.id === "mineral-fertilizer-dose-response")?.interaction;
assert.ok(doseCurve && doseCurve.kind === "curve");
if (doseCurve?.kind === "curve") {
  assert.equal(doseCurve.rule.kind, "samples");
  if (doseCurve.rule.kind === "samples") {
    assert.deepEqual(doseCurve.rule.points, [
      [50, 48],
      [100, 67],
      [150, 82.5],
      [200, 80],
      [250, 60],
      [300, 40],
    ]);
  }
  assert.ok(doseCurve.guides?.some((guide) => guide.kind === "vertical" && guide.value === 150));
  assert.ok(doseCurve.guides?.some((guide) => guide.kind === "horizontal" && guide.value === 82.5));
  assert.deepEqual(doseCurve.marker, { min: 50, max: 300, step: 50, initial: 150 });
}

assert.deepEqual(lessons.map((lesson) => lesson.source?.pages), expectedPages);
assert.ok(lessons.every((lesson) => lesson.source?.documentTitle === sourceDocument));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));
assert.ok(lessons.every((lesson) => Boolean(lesson.source?.section.trim())));
assert.ok(lessons.every((lesson) => (lesson.source?.corrections.length ?? 0) >= 4));

const catalogLesson = curriculumLessonTitles.find((lesson) => (
  lesson.levelId === "terminale-d"
  && lesson.subjectId === "svt"
  && lesson.sequence === 15
));
assert.equal(catalogLesson?.title, rawPath.title, "Le titre de la carte 15 a divergé.");
assert.equal(catalogLesson?.pathId, rawPath.id, "La carte 15 n’ouvre plus le parcours publié.");

const coveredPages = new Set<number>();
for (const pages of expectedPages) {
  for (const match of pages.matchAll(/(\d+)(?:–(\d+))?/g)) {
    const start = Number(match[1]);
    const end = Number(match[2] ?? match[1]);
    for (let page = start; page <= end; page += 1) coveredPages.add(page);
  }
}
assert.deepEqual([...coveredPages].sort((a, b) => a - b), Array.from({ length: 11 }, (_, index) => index + 1));
assert.ok(!coveredPages.has(12), "La page 12 blanche ne doit pas être traitée comme une page de cours.");

const allQuestions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(allQuestions.length, 116);
assert.equal(new Set(allQuestions.map((question) => question.prompt)).size, 116, "Deux questions partagent le même énoncé.");
assert.ok(allQuestions.every((question) => question.prompt.trim().length > 0));
assert.ok(allQuestions.every((question) => question.explanation.trim().length > 0));
assert.ok(allQuestions.every((question) => /pages?\s*\d/i.test(question.sourceLabel ?? "")));

const choices = allQuestions.filter((question) => question.type === "choice");
const shortAnswers = allQuestions.filter((question) => question.type === "short-answer");
assert.equal(choices.length, 106);
assert.equal(shortAnswers.length, 10);
assert.ok(choices.every((question) => question.options.length === 4));
assert.ok(choices.every((question) => new Set(question.options).size === question.options.length));
assert.ok(choices.every((question) => question.correctIndex >= 0 && question.correctIndex < 4));
assert.deepEqual(
  [0, 1, 2, 3].map((index) => choices.filter((question) => question.correctIndex === index).length),
  [27, 27, 26, 26],
);
assert.ok(shortAnswers.every((question) => (question.acceptedAnswers?.length ?? 0) >= 3));

const officialQuestions = allQuestions.filter((question) =>
  /^(?:Activité d’application [123]|Situation d’évaluation(?: [12])?)(?:\s|$)/i.test(question.sourceLabel ?? ""),
);
assert.equal(officialQuestions.length, 30, "Le décompte des réponses directement issues des exercices officiels a changé.");
assert.equal(allQuestions.length - officialQuestions.length, 86);
assert.equal(officialQuestions.filter((question) => /^Activité d’application 1\b/i.test(question.sourceLabel ?? "")).length, 4);
assert.equal(officialQuestions.filter((question) => /^Activité d’application 2\b/i.test(question.sourceLabel ?? "")).length, 5);
assert.equal(officialQuestions.filter((question) => /^Activité d’application 3\b/i.test(question.sourceLabel ?? "")).length, 8);
assert.equal(officialQuestions.filter((question) => /^Situation d’évaluation(?:\s| corrigée)/i.test(question.sourceLabel ?? "") && !/Situation d’évaluation [12]/i.test(question.sourceLabel ?? "")).length, 4);
assert.equal(officialQuestions.filter((question) => /^Situation d’évaluation 1\b/i.test(question.sourceLabel ?? "")).length, 4);
assert.equal(officialQuestions.filter((question) => /^Situation d’évaluation 2\b/i.test(question.sourceLabel ?? "")).length, 5);
assert.ok(
  allQuestions.every((question) => !/^Activité (?:interne|de construction|de découverte)/i.test(question.sourceLabel ?? "")),
  "Une activité de construction retirée a été transformée en question.",
);

const collectStrings = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectStrings);
  return [];
};

const allStrings = collectStrings(rawPath);
const scientificText = allStrings.join("\n");
const serialized = JSON.stringify(rawPath);
const mojibakeMarkers = [
  "ÃƒÂ©", "ÃƒÂ¨", "ÃƒÂª", "ÃƒÂ´", "ÃƒÂ®", "ÃƒÂ§", "Ã¢â‚¬â„¢", "Ã¢â‚¬Å“", "Ã¢â‚¬", "Ã‚Â°", "Ã‚Âµ", "ï¿½",
  "Ã©", "Ã¨", "Ãª", "Ã´", "Ã®", "Ã§", "â€™", "â€œ", "â€", "Â°", "Âµ", "�",
];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(!serialized.includes("⃗"), "Une flèche combinante illisible a été introduite.");
assert.ok(
  !/(?:src\/assets|\/assets\/|data:image|<img\b|!\[[^\]]*\]\s*\()/i.test(serialized),
  "Un scan ou une image publiée a été intégré.",
);

assert.match(scientificText, /48[^\n]{0,80}67[^\n]{0,80}82,5[^\n]{0,80}80[^\n]{0,80}60[^\n]{0,80}40/);
assert.match(scientificText, /150\s*kg\/ha[^\n]{0,180}(?:meilleur|maximum) (?:traitement|observé)|(?:meilleur|maximum) (?:traitement|observé)[^\n]{0,180}150\s*kg\/ha/i);
assert.match(scientificText, /vers[^\n]{0,240}(?:microorganismes|bactéries|champignons)|(?:microorganismes|bactéries|champignons)[^\n]{0,240}vers/i);
assert.match(scientificText, /rhizobiums[^\n]{0,220}(?:N₂|diazote)/i);
assert.match(scientificText, /2100\s*<\s*3800\s*<\s*5900/);
assert.match(scientificText, /pH\s*4,5/i);
assert.match(scientificText, /CaO\s*\+\s*H_2O\s*\\rightarrow\s*Ca\(OH\)_2/);
assert.match(scientificText, /Ca\(HCO_3\)_2/);
assert.match(scientificText, /Ca\^\{2\+\}[^\n]{0,180}deux \$?H\^\+/i);
assert.match(scientificText, /assolement[^\n]{0,220}spatiale[^\n]{0,220}rotation[^\n]{0,220}temporelle|rotation[^\n]{0,220}temporelle[^\n]{0,220}assolement[^\n]{0,220}spatiale/i);
const activityOneExplanations = officialQuestions
  .filter((question) => /^Activité d’application 1\b/i.test(question.sourceLabel ?? ""))
  .map((question) => question.explanation)
  .join("\n");
for (const association of ["1-d", "2-b", "3-a", "4-c"]) {
  assert.match(activityOneExplanations, new RegExp(association, "i"));
}
assert.match(scientificText, /seulement 1, 2 et 3|1, 2 et 3[^\n]{0,100}(?:justes|correctes)/i);
assert.match(scientificText, /sels[^\n]{0,160}dissolvent[^\n]{0,160}éléments minéraux/i);
assert.match(scientificText, /46\s*\\?le\s*50[^\n]{0,120}5\{,\}23\s*\\?le\s*23\{,\}6[^\n]{0,120}10\s*\\?le\s*100/);
assert.match(scientificText, /\\Delta N\s*=\s*180-50\s*=\s*130/);
assert.match(scientificText, /\\Delta P\s*=\s*24\{,\}6-23\{,\}6\s*=\s*1/);
assert.match(scientificText, /\\Delta K\s*=\s*250-100\s*=\s*150/);
assert.match(scientificText, /N–P₂O₅–K₂O/i);

const corrections = lessons.flatMap((lesson) => lesson.source?.corrections ?? []).join("\n");
assert.match(corrections, /situation d’apprentissage[^\n]{0,180}retirée/i);
assert.match(corrections, /activités internes de construction[^\n]{0,220}(?:pas|ne sont pas)[^\n]{0,100}(?:évaluation|transformées)/i);
assert.match(corrections, /qtx\/kg[^\n]{0,180}quintaux par hectare/i);
assert.match(corrections, /150\s*kg\/ha[^\n]{0,200}optimum universel/i);
assert.match(corrections, /vers seuls[^\n]{0,180}microbiennes/i);
assert.match(corrections, /activité annoncée page 3[^\n]{0,180}incomplète/i);
assert.match(corrections, /structure compacte[^\n]{0,180}très perméable/i);
assert.match(corrections, /Ca²⁺[^\n]{0,180}deux H⁺[^\n]{0,180}(?:jamais|OH⁻)/i);
assert.match(corrections, /chaulage[^\n]{0,160}élève son pH/i);
assert.match(corrections, /humus[^\n]{0,180}végétale, animale et microbienne/i);
assert.match(corrections, /assolement spatial[^\n]{0,180}rotation temporelle/i);
assert.match(corrections, /j(?:ach|âch)ère[^\n]{0,180}(?:non|pas|conditionnelle)[^\n]{0,160}automatique/i);
assert.match(corrections, /besoins sont inférieurs ou égaux aux disponibilités/i);
assert.match(corrections, /N\s*130,\s*P\s*1\s*et\s*K\s*150\s*kg\/ha/i);
assert.match(corrections, /page 12 blanche[^\n]{0,180}(?:pas|ni)[^\n]{0,100}inventé/i);

const catalogSource = readFileSync(
  new URL("../apps/web/src/data/curriculumCatalog.ts", import.meta.url),
  "utf8",
);
const loaderSource = readFileSync(
  new URL("../apps/web/src/data/learningPathLoader.ts", import.meta.url),
  "utf8",
);
const registrySource = readFileSync(
  new URL("../apps/web/src/data/learningPaths.ts", import.meta.url),
  "utf8",
);
const apiCurriculumSource = readFileSync(
  new URL("../apps/api/src/curriculum.ts", import.meta.url),
  "utf8",
);
const verifySource = readFileSync(new URL("./verify-project.mjs", import.meta.url), "utf8");

assert.ok(
  catalogSource.includes('{ title: "' + rawPath.title + '", pathId: "' + rawPath.id + '" }'),
  "La carte du catalogue n’ouvre pas L15.",
);
assert.ok(
  loaderSource.includes('import("./terminalDSvtSoilProtectionPath")'),
  "Le chargeur différé n’importe pas L15.",
);
assert.ok(
  loaderSource.includes("module.terminalDSvtSoilProtectionPath"),
  "Le chargeur différé ne sélectionne pas l’export L15.",
);
assert.ok(
  registrySource.includes('import { terminalDSvtSoilProtectionPath } from "./terminalDSvtSoilProtectionPath";'),
  "Le registre Web intégral n’importe pas L15.",
);
assert.ok(
  registrySource.includes("  terminalDSvtSoilProtectionPath,"),
  "Le registre Web intégral ne publie pas L15.",
);
assert.ok(
  verifySource.includes("audit-terminal-d-svt-soil-protection.ts"),
  "Le vérificateur intégral ignore l’audit L15.",
);
for (const [index, lessonId] of expectedIds.entries()) {
  assert.ok(
    apiCurriculumSource.includes('["' + rawPath.id + ":" + lessonId + '", ' + expectedRawWeights[index] + "]"),
    "Le registre API ne contient pas le poids de " + lessonId + ".",
  );
}

const migration = readFileSync(
  new URL("../supabase/migrations/20260827040000_svt_d_soil_protection_path.sql", import.meta.url),
  "utf8",
);
assert.ok(migration.includes(rawPath.id));
assert.ok(migration.includes(JSON.stringify(expectedIds)));
assert.ok(migration.includes("array[45, 55, 65, 70, 75, 80, 90, 100, 110, 130]"));
assert.ok(migration.includes("550 / 670 / 790 / 850 / 910 / 980 / 1100 / 1220 / 1340 / 1590 = 10 000"));
assert.match(migration, /create temporary table/i);
assert.match(migration, /on conflict\s*\(path_id, lesson_id\)\s*do update/i);
assert.match(migration, /1000\s*-\s*sum\(base_units\)/i);
assert.match(migration, /update public\.lesson_progress/i);
assert.doesNotMatch(migration, /\bdelete\b/i, "Une création de parcours ne doit supprimer aucune récompense.");

const formulas = allStrings.flatMap((value) =>
  [...value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)].map((match) => match[1] ?? match[2]),
);
assert.ok(formulas.length >= 20, "Le corpus KaTeX contrôlé est trop faible.");
for (const formula of formulas) {
  katex.renderToString(formula, { throwOnError: true, strict: "error" });
}

const pathFile = resolve("apps/web/src/data/terminalDSvtSoilProtectionPath.ts");
assert.ok(statSync(pathFile).size < 250_000, "Le fichier source dépasse le budget de 250 kB.");

console.log(
  "Audit SVT Tle D L15 autonome valide : 10 niveaux, 116 réponses, 10 interactions originales et 10 000 XP.",
);
