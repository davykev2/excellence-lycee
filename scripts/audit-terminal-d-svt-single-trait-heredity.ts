import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import { getLessonReward, getPathRewardTotal } from "../apps/api/src/curriculum";
import { terminalCSvtHumanHeredityPath } from "../apps/web/src/data/terminalCSvtHumanHeredityPath";
import { terminalDSvtSingleTraitHeredityPath } from "../apps/web/src/data/terminalDSvtSingleTraitHeredityPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const expectedIds = [
  "hereditary-trait-pedigree-basics",
  "dominance-recessivity",
  "autosomal-inheritance",
  "x-linked-inheritance",
  "codominance-sickle-cell",
  "abo-polyallelism",
  "pedigree-diagnostic-strategy",
  "autosomal-family-case",
  "x-linked-family-case",
  "single-trait-final-mission",
];
const expectedRawWeights = [45, 55, 65, 70, 75, 80, 90, 100, 115, 145];
const expectedXp = [540, 660, 770, 830, 890, 950, 1070, 1190, 1370, 1730];
const expectedQuestionCounts = Array.from({ length: 10 }, () => 10);
const expectedDocumentTitle = "Programme éducatif et guide d’exécution SVT Terminale D — DPFC";
const expectedGuideUrl = "https://dpfc-ci.net/wp-content/uploads/dpfc_fichiers/2018-2019/programmes_guides/SVT/PROGR_ED_SVT_2018-2019_TLE_D_APC.pdf";

const rawLessons = terminalDSvtSingleTraitHeredityPath.modules.flatMap((module) => module.lessons);
assert.deepEqual(
  rawLessons.map((lesson) => lesson.xp),
  expectedRawWeights,
  "Les poids bruts Web ont divergé du manifeste Supabase à consolider avec l’API.",
);

const path = applyLessonXpBudget(terminalDSvtSingleTraitHeredityPath);
const lessons = path.modules.flatMap((module) => module.lessons);

assert.equal(path.id, "terminale-d-svt-l8-single-trait-heredity");
assert.equal(path.subjectId, "svt");
assert.deepEqual(path.levelIds, ["terminale-d"], "Le parcours doit rester réservé à la Terminale D.");
assert.equal(path.chapterNumber, 8, "La leçon doit rester la huitième carte SVT de Terminale D.");
assert.deepEqual(path.theme, { number: 2, title: "La transmission des caractères héréditaires" });
assert.equal(path.title, "La transmission d’un caractère héréditaire chez l’Homme");
assert.equal(path.curriculumSourceUrl, expectedGuideUrl);
assert.equal(path.modules.length, 1, "Le parcours autonome doit conserver un module unique.");
assert.equal(lessons.length, 10);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants prévus ont changé.");
assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, lessons.length, "Les identifiants ne sont pas uniques.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La normalisation des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.equal(getPathRewardTotal(path.id), 10_000, "Le budget de l’API a changé.");
assert.ok(
  lessons.every((lesson) => getLessonReward(path.id, lesson.id) === lesson.xp),
  "Le registre API n’est plus aligné avec le frontend.",
);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "Chaque niveau doit conserver exactement dix réponses évaluables.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 100);
assert.ok(
  lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_200),
  "Chaque niveau doit conserver au moins 1 200 caractères de cours rédigé.",
);

const interactionCounts = lessons.reduce<Record<string, number>>((counts, lesson) => {
  counts[lesson.interaction.kind ?? "numeric"] = (counts[lesson.interaction.kind ?? "numeric"] ?? 0) + 1;
  return counts;
}, {});
assert.deepEqual(
  interactionCounts,
  { diagram: 3, timeline: 3, schema: 4 },
  "Les dix interactions doivent rester réparties en quatre schémas, trois cartes et trois démarches.",
);
assert.equal(new Set(lessons.map((lesson) => lesson.interaction.title)).size, 10, "Les interactions doivent avoir des titres distincts.");

for (const lesson of lessons) {
  const { interaction } = lesson;
  if (interaction.kind === "schema") {
    const hotspotIds = interaction.hotspots.map((hotspot) => hotspot.id);
    const hotspotNumbers = interaction.hotspots.map((hotspot) => hotspot.number);
    assert.ok(interaction.shapes.length >= 8, `Le schéma ${lesson.id} est trop pauvre.`);
    assert.ok(interaction.hotspots.length >= 4, `Le schéma ${lesson.id} manque de repères.`);
    assert.equal(new Set(hotspotIds).size, hotspotIds.length, `Des repères partagent un id dans ${lesson.id}.`);
    assert.equal(new Set(hotspotNumbers).size, hotspotNumbers.length, `Des repères partagent un numéro dans ${lesson.id}.`);
  }
  if (interaction.kind === "diagram") {
    const nodeIds = interaction.nodes.map((node) => node.id);
    assert.ok(interaction.nodes.length >= 4, `La carte ${lesson.id} est trop pauvre.`);
    assert.equal(new Set(nodeIds).size, nodeIds.length, `Des cartes partagent un id dans ${lesson.id}.`);
  }
  if (interaction.kind === "timeline") {
    assert.ok(interaction.items.length >= 4, `La démarche ${lesson.id} est incomplète.`);
  }
}

assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === expectedDocumentTitle),
  "La référence exacte au guide DPFC a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "adapted"));
assert.ok(lessons.every((lesson) => lesson.source?.section.trim()));
assert.doesNotMatch(
  lessons.map((lesson) => `${lesson.source?.pages}\n${lesson.source?.section}`).join("\n"),
  /p\.\s*14|progression\s+2025-2026/i,
  "Une référence extérieure au programme-guide déclaré a été réintroduite.",
);
assert.ok(
  lessons.every((lesson) => /p{1,2}\.\s*(?:13|35|36)/i.test(lesson.source?.pages ?? "")),
  "Chaque niveau doit citer précisément une page utile du programme-guide déclaré.",
);
assert.ok(
  lessons.every((lesson) => (lesson.source?.corrections.length ?? 0) >= 4),
  "Chaque niveau doit expliciter la limite documentaire et au moins trois précisions scientifiques.",
);
assert.ok(
  lessons.every((lesson) => lesson.source?.corrections.some((correction) => (
    /ne fournit ni cours rédigé ni exercices complets/i.test(correction)
  ))),
  "La limite du guide d’exécution doit être rappelée sur chaque niveau.",
);

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 100);
assert.equal(new Set(questions.map((question) => question.prompt)).size, 100, "Des questions ont été dupliquées.");
assert.ok(questions.every((question) => question.prompt.trim().length > 0));
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(
  questions.every((question) => /Guide DPFC SVT Terminale D, p{1,2}\.\s*(?:13|35|36)/i.test(question.sourceLabel ?? "")),
  "Chaque réponse doit citer une page précise du programme-guide déclaré.",
);
assert.ok(
  questions.every((question) => question.sourceLabel?.includes("adaptation évaluative originale")),
  "Aucune évaluation adaptée ne doit être présentée comme un exercice du document source.",
);
assert.doesNotMatch(
  questions.map((question) => question.sourceLabel ?? "").join("\n"),
  /p\.\s*14|progression\s+2025-2026/i,
  "Une réponse cite de nouveau une page non couverte par la source déclarée.",
);

const choices = questions.filter((question) => question.type === "choice");
const shortAnswers = questions.filter((question) => question.type === "short-answer");
assert.equal(choices.length, 90);
assert.equal(shortAnswers.length, 10);
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
assert.deepEqual(
  Object.values(choices.reduce<Record<number, number>>((counts, question) => {
    counts[question.correctIndex] = (counts[question.correctIndex] ?? 0) + 1;
    return counts;
  }, {})).sort((left, right) => left - right),
  [22, 22, 23, 23],
  "Les quatre positions de bonne réponse ne sont plus équilibrées.",
);
assert.ok(shortAnswers.every((question) => question.options.length === 0));
assert.ok(shortAnswers.every((question) => (question.acceptedAnswers?.length ?? 0) >= 2));

const autosomalRiskQuestion = lessons
  .find((lesson) => lesson.id === "autosomal-family-case")
  ?.questions?.find((question) => question.type === "short-answer");
assert.ok(autosomalRiskQuestion && autosomalRiskQuestion.type === "short-answer");
if (autosomalRiskQuestion?.type === "short-answer") {
  assert.match(autosomalRiskQuestion.prompt, /risque théorique/i);
  assert.ok(autosomalRiskQuestion.acceptedAnswers?.some((answer) => /50\s*%|1\/2/.test(answer)));
  assert.doesNotMatch(autosomalRiskQuestion.prompt, /croisement parental/i);
}

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
  new URL("../apps/web/src/data/terminalDSvtSingleTraitHeredityPath.ts", import.meta.url),
  "utf8",
);
assert.ok(Buffer.byteLength(moduleSource, "utf8") < 250_000, "Le module source dépasse le budget de 250 kB.");

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
const textWithoutExplicitDisclaimers = scientificText.replace(
  /n[’']est jamais qualifi(?:é|ée) d[’']exercice officiel/gi,
  "",
);
assert.doesNotMatch(
  textWithoutExplicitDisclaimers,
  /(?:exercice|évaluation|cours)\s+(?:du\s+document\s+)?officiel(?:le)?/i,
  "Une adaptation ne doit pas être attribuée au document officiel.",
);
assert.match(scientificText, /(?:figure|représentation|données|carte|démarche)\s+pédagogique\s+originale/i);

// Garde-fous scientifiques : ces contrôles ciblent les confusions classiques,
// pas une formulation particulière du cours.
assert.match(scientificText, /caractère héréditaire/i);
assert.match(scientificText, /phénotype/i);
assert.match(scientificText, /génotype/i);
assert.match(scientificText, /allèle/i);
assert.match(scientificText, /dominant[^.\n]{0,220}(?:fréquent|supérieur|meilleur|grave)|(?:fréquent|supérieur|meilleur|grave)[^.\n]{0,220}dominant/i);
assert.match(scientificText, /autosomique[^.\n]{0,220}(?:deux sexes|filles et garçons|hommes et femmes)|(?:deux sexes|filles et garçons|hommes et femmes)[^.\n]{0,220}autosomique/i);
assert.match(scientificText, /père[^.\n]{0,220}fils[^.\n]{0,220}(?:liaison à X|lié[e]? à X|chromosome X)/i);
assert.match(
  scientificText,
  /garçon[^.\n]{0,260}(?:allèle lié à X|locus lié à X)[^.\n]{0,180}mère[^.\n]{0,180}(?:Y|père)/i,
  "Le contrôle doit distinguer la transmission d’un locus lié à X chez le garçon.",
);
assert.match(
  scientificText,
  /(?:coexistence|co-occurrence)[^.\n]{0,220}père[^.\n]{0,100}fils[^.\n]{0,240}(?:ne prouve|ne localise)/i,
  "Un père et un fils atteints ne doivent plus être présentés comme une transmission allélique démontrée.",
);
assert.match(scientificText, /hémizygote/i);
assert.match(scientificText, /(?:HbAS|AS)[^.\n]{0,220}(?:trait|porteur)|(?:trait|porteur)[^.\n]{0,220}(?:HbAS|AS)/i);
assert.match(scientificText, /(?:HbSS|SS)[^.\n]{0,220}(?:drépanocyt|maladie)|(?:drépanocyt|maladie)[^.\n]{0,220}(?:HbSS|SS)/i);
assert.match(scientificText, /(?:25\s*%|1\/4)[^.\n]{0,220}(?:50\s*%|1\/2)[^.\n]{0,220}(?:25\s*%|1\/4)/i);
assert.match(
  scientificText,
  /(?:chaque grossesse|grossesses|conceptions?)[^.\n]{0,220}indépend|indépend[^.\n]{0,220}(?:chaque grossesse|grossesses|conceptions?)/i,
);
assert.match(scientificText, /codomin/i);
assert.match(scientificText, /polyallél/i);
assert.match(scientificText, /I\^?\{?A\}?|Iᴬ/i);
assert.match(scientificText, /I\^?\{?B\}?|Iᴮ/i);
assert.match(scientificText, /(?:électrophorèse|test sanguin|analyse biologique)[^.\n]{0,240}(?:pedigree|arbre généalogique|confirmer|diagnostic)|(?:pedigree|arbre généalogique)[^.\n]{0,240}(?:électrophorèse|test sanguin|analyse biologique)/i);
assert.match(scientificText, /(?:observation|observer)/i);
assert.match(scientificText, /hypothèse/i);
assert.match(scientificText, /Dominance,?\s+Localisation,?\s+Génotypes?,?\s+Conclusion/i);

const formulas = allStrings.flatMap((text) =>
  [...text.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)].map((match) => match[1] ?? match[2]),
);
assert.ok(formulas.length >= 10, "Les notations génétiques contrôlées ont régressé.");
assert.ok(
  formulas.every((formula) => !/(?<!\\)\b(?:mathrm|text|frac|times)\s*\{/.test(formula)),
  "Une commande KaTeX a perdu son antislash dans une chaîne TypeScript.",
);
for (const formula of formulas) {
  katex.renderToString(formula, { throwOnError: true, strict: "error" });
}

// Le parcours Terminale C demeure scientifiquement comparable mais isolé :
// aucun identifiant de classe D ne doit lui être ajouté par ce lot.
assert.deepEqual(terminalCSvtHumanHeredityPath.levelIds, ["terminale-c"]);
assert.notEqual(terminalCSvtHumanHeredityPath.id, path.id);
assert.ok(!terminalCSvtHumanHeredityPath.levelIds.includes("terminale-d"));

const catalog = readFileSync(new URL("../apps/web/src/data/curriculumCatalog.ts", import.meta.url), "utf8");
const loader = readFileSync(new URL("../apps/web/src/data/learningPathLoader.ts", import.meta.url), "utf8");
const registry = readFileSync(new URL("../apps/web/src/data/learningPaths.ts", import.meta.url), "utf8");
assert.ok(catalog.includes(`pathId: "${path.id}"`), "La carte du catalogue n’ouvre pas le parcours.");
assert.ok(loader.includes("terminalDSvtSingleTraitHeredityPath"), "Le chargeur n’importe pas le parcours L8.");
assert.ok(registry.includes("terminalDSvtSingleTraitHeredityPath"), "Le registre intégral n’importe pas le parcours L8.");

const migration = readFileSync(
  new URL("../supabase/migrations/20260821180000_svt_d_single_trait_heredity_path.sql", import.meta.url),
  "utf8",
);
assert.ok(migration.includes(path.id));
assert.ok(migration.includes(JSON.stringify(expectedIds)), "Le manifeste SQL ne conserve plus l’ordre exact des niveaux.");
assert.ok(
  migration.includes("array[45, 55, 65, 70, 75, 80, 90, 100, 115, 145]"),
  "Le manifeste SQL ne conserve plus les poids bruts.",
);
assert.ok(
  migration.includes("540 / 660 / 770 / 830 / 890 / 950 / 1070 / 1190 / 1370 / 1730 = 10 000"),
  "La migration ne documente plus la normalisation exacte à 10 000 XP.",
);
assert.match(migration, /create temporary table/i);
assert.match(migration, /on conflict\s*\(path_id, lesson_id\)\s*do update/i);
assert.match(migration, /1000\s*-\s*sum\(base_units\)/i);
assert.doesNotMatch(migration, /\bdelete\b/i, "Une création de parcours ne doit supprimer aucune récompense.");

console.log("Audit SVT Tle D L8 valide : 10 niveaux, 100 réponses, 10 interactions originales et 10 000 XP.");
