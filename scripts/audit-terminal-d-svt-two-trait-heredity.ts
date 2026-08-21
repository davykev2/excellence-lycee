import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import { getLessonReward, getPathRewardTotal } from "../apps/api/src/curriculum";
import { terminalDSvtTwoTraitHeredityPath } from "../apps/web/src/data/terminalDSvtTwoTraitHeredityPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const expectedIds = [
  "dihybridism-evidence",
  "pea-pure-lines-f1",
  "independent-gametes",
  "pea-f2-nine-three-three-one",
  "pea-test-cross",
  "independence-check-method",
  "drosophila-linked-test-cross",
  "cis-crossing-over",
  "genetic-distance-map",
  "genetic-applications-supplement",
  "two-trait-heredity-final-mission",
];
const expectedRawWeights = [45, 55, 65, 70, 75, 80, 90, 100, 110, 120, 130];
const expectedXp = [480, 590, 690, 740, 800, 850, 960, 1060, 1170, 1280, 1380];
const expectedPages = [
  "1–3",
  "1–4, 6",
  "4–7, 12–13",
  "2–5, 7–8",
  "2–3, 5–6, 8–9, 12–13",
  "2–6, 10–14",
  "9–14",
  "12–13, 16–17",
  "13–17",
  "pp. 36-37",
  "1, 18–19",
];
const expectedQuestionCounts = Array.from({ length: 11 }, () => 10);
const sourceDocument =
  "SVT TD_L12_La transmission de deux caractères héréditaires ches les êtres vivants.pdf";
const guideDocument = "Programme éducatif et guide d’exécution SVT Terminale D — DPFC";
const guideUrl = "https://dpfc-ci.net/wp-content/uploads/dpfc_fichiers/2018-2019/programmes_guides/SVT/PROGR_ED_SVT_2018-2019_TLE_D_APC.pdf";

const rawPath = terminalDSvtTwoTraitHeredityPath;
const rawLessons = rawPath.modules.flatMap((module) => module.lessons);

assert.equal(rawPath.id, "terminale-d-svt-l9-two-trait-heredity");
assert.equal(rawPath.subjectId, "svt");
assert.deepEqual(rawPath.levelIds, ["terminale-d"]);
assert.deepEqual(rawPath.theme, { number: 2, title: "La transmission des caractères héréditaires" });
assert.equal(rawPath.chapterNumber, 9);
assert.equal(rawPath.title, "La transmission de deux caractères héréditaires chez les êtres vivants");
assert.equal(rawPath.curriculumSourceUrl, guideUrl);
assert.equal(rawPath.modules.length, 1);
assert.equal(rawPath.modules[0]?.id, "two-trait-heredity-mastery");
assert.deepEqual(rawLessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.equal(new Set(rawLessons.map((lesson) => lesson.id)).size, expectedIds.length, "Deux niveaux partagent le même identifiant.");
assert.deepEqual(rawLessons.map((lesson) => lesson.xp), expectedRawWeights, "Les poids bruts du frontend ont changé.");

const path = applyLessonXpBudget(rawPath);
const lessons = path.modules.flatMap((module) => module.lessons);
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition normalisée des XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.equal(getPathRewardTotal(rawPath.id), 10_000, "Le budget de l’API a changé.");
assert.ok(
  lessons.every((lesson) => getLessonReward(rawPath.id, lesson.id) === lesson.xp),
  "Le registre API n’est plus aligné avec le frontend.",
);

assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 110);
assert.ok(lessons.every((lesson) => lesson.question === lesson.questions?.[0]));
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_800));

const interactionCounts = lessons.reduce<Record<string, number>>((counts, lesson) => {
  counts[lesson.interaction.kind ?? "numeric"] = (counts[lesson.interaction.kind ?? "numeric"] ?? 0) + 1;
  return counts;
}, {});
assert.deepEqual(interactionCounts, { diagram: 3, timeline: 4, schema: 3, numeric: 1 });

for (const lesson of lessons) {
  const interaction = lesson.interaction;
  JSON.stringify(interaction);
  if (interaction.kind === "schema") {
    assert.ok(interaction.shapes.length >= 18, `Schéma trop pauvre : ${lesson.id}`);
    assert.ok(interaction.hotspots.length >= 5, `Repères insuffisants : ${lesson.id}`);
    assert.equal(new Set(interaction.hotspots.map((hotspot) => hotspot.id)).size, interaction.hotspots.length);
    assert.ok(interaction.caption?.toLocaleLowerCase("fr").includes("original"));
  }
  if (interaction.kind === "diagram") {
    assert.ok(interaction.nodes.length >= 5, `Diagramme trop pauvre : ${lesson.id}`);
    assert.equal(new Set(interaction.nodes.map((node) => node.id)).size, interaction.nodes.length);
  }
  if (interaction.kind === "timeline") {
    assert.ok(interaction.items.length >= 5, `Chronologie trop courte : ${lesson.id}`);
    assert.equal(new Set(interaction.items.map((item) => item.label)).size, interaction.items.length);
  }
}

const numeric = lessons.find((lesson) => lesson.id === "genetic-distance-map")?.interaction;
assert.ok(numeric && numeric.kind === "numeric");
if (numeric?.kind === "numeric") {
  assert.equal(numeric.formula, "d = 100 × r");
  assert.deepEqual(numeric.rule, { kind: "linear", coefficient: 100, constant: 0 });
  assert.deepEqual(numeric.input, { min: 0, max: 0.5, step: 0.001, initial: 0.157 });
}

assert.deepEqual(lessons.map((lesson) => lesson.source?.pages), expectedPages);
const guideSupplement = lessons.find((lesson) => lesson.id === "genetic-applications-supplement");
const supportLessons = lessons.filter((lesson) => lesson.id !== "genetic-applications-supplement");
assert.ok(supportLessons.every((lesson) => lesson.source?.documentTitle === sourceDocument));
assert.ok(supportLessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));
assert.equal(guideSupplement?.source?.documentTitle, guideDocument);
assert.equal(guideSupplement?.source?.fidelity, "adapted");
assert.equal(guideSupplement?.source?.pages, "pp. 36-37");
assert.match(guideSupplement?.concept.eyebrow ?? "", /complément adapté du guide DPFC/i);
assert.ok(supportLessons.every((lesson) => /support intégral corrigé/i.test(lesson.concept.eyebrow ?? "")));
assert.doesNotMatch(
  supportLessons.flatMap((lesson) => lesson.questions ?? []).map((question) => question.sourceLabel ?? "").join("\n"),
  /guide DPFC[^\n]*p\.\s*37/i,
  "Un niveau fidèle au support complet cite encore le complément adapté du guide.",
);
assert.ok(lessons.every((lesson) => Boolean(lesson.source?.section.trim())));
assert.ok(lessons.every((lesson) => (lesson.source?.corrections.length ?? 0) >= 3));

const coveredPages = new Set<number>();
for (const pages of expectedPages.filter((_, index) => index !== 9)) {
  for (const token of pages.split(",")) {
    const [startText, endText] = token.trim().split("–");
    const start = Number(startText);
    const end = Number(endText ?? startText);
    for (let page = start; page <= end; page += 1) coveredPages.add(page);
  }
}
assert.deepEqual([...coveredPages].sort((a, b) => a - b), Array.from({ length: 19 }, (_, index) => index + 1));

const allQuestions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(allQuestions.length, 110);
assert.equal(new Set(allQuestions.map((question) => question.prompt)).size, 110, "Deux questions ont le même énoncé.");
assert.ok(allQuestions.every((question) => question.prompt.trim().length > 0));
assert.ok(allQuestions.every((question) => question.explanation.trim().length > 0));
assert.ok(allQuestions.every((question) => /(?:p\.|pages?)\s*\d/i.test(question.sourceLabel ?? "")));
assert.ok(allQuestions.every((question) => !/exercice officiel/i.test(question.sourceLabel ?? "")));

const choices = allQuestions.filter((question) => question.type === "choice");
const shortAnswers = allQuestions.filter((question) => question.type === "short-answer");
assert.equal(choices.length, 99);
assert.equal(shortAnswers.length, 11);
assert.ok(lessons.every((lesson) => lesson.questions?.filter((question) => question.type === "short-answer").length === 1));
assert.ok(choices.every((question) => question.options.length === 4));
assert.ok(choices.every((question) => new Set(question.options).size === question.options.length));
assert.ok(choices.every((question) => question.correctIndex >= 0 && question.correctIndex < question.options.length));
assert.deepEqual([...new Set(choices.map((question) => question.correctIndex))].sort(), [0, 1, 2, 3]);
assert.ok(shortAnswers.every((question) => (question.acceptedAnswers?.length ?? 0) >= 2));
const gameteShortAnswer = lessons
  .find((lesson) => lesson.id === "independent-gametes")
  ?.questions?.find((question) => question.type === "short-answer");
assert.ok(gameteShortAnswer?.acceptedAnswers?.includes("RV ; Rv ; rV ; rv"));

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
  "Un scan ou une image publiée a été intégré au lieu d’une interaction originale.",
);

assert.match(scientificText, /dihybridisme/i);
assert.match(scientificText, /RRVV[^\n]{0,120}rrvv[^\n]{0,160}RrVv/i);
assert.match(scientificText, /assortiment indépendant/i);
assert.match(scientificText, /RV,\s*Rv,\s*rV[^\n]{0,40}rv/i);
assert.match(scientificText, /9:3:3:1/);
assert.match(scientificText, /1:1:1:1/);
assert.match(scientificText, /test-cross/i);
assert.match(scientificText, /classes? parentales?[^\n]{0,180}recombin/i);
assert.match(scientificText, /phase cis/i);
assert.match(scientificText, /crossing-over[^\n]{0,220}prophase I|prophase I[^\n]{0,220}crossing-over/i);
assert.match(scientificText, /15,7[^\n]{0,60}(?:cM|UR)/i);
assert.match(scientificText, /84,3\s*%[^\n]{0,180}(?:liaison|parental)|(?:liaison|parental)[^\n]{0,180}84,3\s*%/i);
assert.match(scientificText, /50\s*%[^\n]{0,180}recombinaison|recombinaison[^\n]{0,180}50\s*%/i);
assert.match(scientificText, /mâle de la drosophile[^\n]{0,180}(?:absence|pas de|ne réalise pas)[^\n]{0,100}crossing-over/i);
assert.match(scientificText, /observ[^\n]{0,180}attendu/i);
assert.match(scientificText, /hybridation[^.\n]{0,240}croisement[^.\n]{0,180}(?:différent|distinct)|croisement[^.\n]{0,240}(?:différent|distinct)[^.\n]{0,180}hybridation/i);
assert.match(scientificText, /hybridation[^.\n]{0,260}(?:combinaison|variabilité|sélection)/i);
assert.match(scientificText, /clonage[^.\n]{0,240}(?:copies?|même modèle|sans croisement)/i);
assert.match(scientificText, /insémination artificielle[^.\n]{0,260}(?:spermatozoïdes|in vivo)/i);
assert.match(scientificText, /FIVETE[^.\n]{0,260}fécondation in vitro[^.\n]{0,180}transfert/i);

const corrections = lessons.flatMap((lesson) => lesson.source?.corrections ?? []).join("\n");
assert.match(corrections, /500[^\n]{0,180}501|501[^\n]{0,180}500/);
assert.match(corrections, /P\/2[^\n]{0,180}recombin|recombin[^\n]{0,180}P\/2/i);
assert.match(corrections, /7,85\s*cm[^\n]{0,180}8\s*cm|8\s*cm[^\n]{0,180}7,85\s*cm/i);
assert.match(corrections, /statistiquement identiques[^\n]{0,180}compatibles|compatibles[^\n]{0,180}statistiquement identiques/i);
assert.match(corrections, /programme-guide[^\n]{0,220}(?:adaptation|adaptées|cours rédigé)/i);

const formulas = allStrings.flatMap((value) =>
  [...value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)].map((match) => match[1] ?? match[2]),
);
assert.ok(formulas.length >= 25, "Le corpus KaTeX contrôlé est trop faible.");
assert.ok(
  formulas.every((formula) => !/(?<!\\)\b(?:dfrac|frac|mathrm|times|longrightarrow)\s*(?:_|\{)/.test(formula)),
  "Une commande KaTeX a perdu son antislash dans une chaîne TypeScript.",
);
for (const formula of formulas) {
  katex.renderToString(formula, { throwOnError: true, strict: "error" });
}

const pathFile = resolve("apps/web/src/data/terminalDSvtTwoTraitHeredityPath.ts");
assert.ok(statSync(pathFile).size < 250_000, "Le fichier source dépasse le budget de 250 kB.");

const catalog = readFileSync(resolve("apps/web/src/data/curriculumCatalog.ts"), "utf8");
const loader = readFileSync(resolve("apps/web/src/data/learningPathLoader.ts"), "utf8");
const registry = readFileSync(resolve("apps/web/src/data/learningPaths.ts"), "utf8");
assert.ok(catalog.includes(`pathId: "${rawPath.id}"`), "La carte du catalogue n’ouvre pas le parcours L9.");
assert.ok(loader.includes("terminalDSvtTwoTraitHeredityPath"), "Le chargeur n’importe pas le parcours L9.");
assert.ok(registry.includes("terminalDSvtTwoTraitHeredityPath"), "Le registre intégral n’importe pas le parcours L9.");

const migration = readFileSync(
  resolve("supabase/migrations/20260821190000_svt_d_two_trait_heredity_path.sql"),
  "utf8",
);
assert.ok(migration.includes(rawPath.id));
assert.ok(migration.includes(JSON.stringify(expectedIds)));
assert.ok(migration.includes("array[45, 55, 65, 70, 75, 80, 90, 100, 110, 120, 130]"));
assert.ok(migration.includes("480 / 590 / 690 / 740 / 800 / 850 / 960 / 1060 / 1170 / 1280 / 1380 = 10 000"));
assert.match(migration, /on conflict \(path_id, lesson_id\) do update/i);
assert.match(migration, /fractional_units/i);
assert.match(migration, /lesson_progress[\s\S]+best_score/i);
assert.ok(!/delete\s+from/i.test(migration), "La migration de création ne doit supprimer aucune récompense.");

console.log(
  "Audit SVT Tle D L9 valide : 11 niveaux, 110 questions, 11 interactions originales et 10 000 XP.",
);
