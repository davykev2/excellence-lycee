import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { terminalDSvtMiningFormationPath } from "../apps/web/src/data/terminalDSvtMiningFormationPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";
import { getLessonReward, getPathRewardTotal } from "../apps/api/src/curriculum";

const expectedIds = [
  "ivorian-mineral-resources-map",
  "host-rock-mineral-ore-vocabulary",
  "primary-gold-deposit-formation",
  "weathering-gold-liberation",
  "transport-density-sorting",
  "secondary-alluvial-gold-deposit",
  "primary-secondary-deposit-comparison",
  "gold-deposit-synthesis-annotation",
  "mineral-deposit-final-mission",
];
const expectedRawWeights = [45, 55, 60, 70, 75, 85, 95, 110, 135];
const expectedXp = [620, 750, 820, 960, 1030, 1160, 1300, 1510, 1850];
const expectedPages = [
  "p. 9 et p. 19",
  "p. 9 et p. 19",
  "p. 9 et p. 19",
  "p. 19",
  "p. 19",
  "p. 9 et p. 19",
  "p. 19",
  "p. 9 et p. 19",
  "pp. 9, 19 et 44",
];
const sourceDocument = "Programme éducatif et guide d’exécution SVT Terminale D — DPFC";
const sourceUrl =
  "https://dpfc-ci.net/wp-content/uploads/dpfc_fichiers/2018-2019/programmes_guides/SVT/PROGR_ED_SVT_2018-2019_TLE_D_APC.pdf";

const rawPath = terminalDSvtMiningFormationPath;
const rawLessons = rawPath.modules.flatMap((module) => module.lessons);

assert.equal(rawPath.id, "terminale-d-svt-l13-mining-formation");
assert.equal(rawPath.subjectId, "svt");
assert.deepEqual(rawPath.levelIds, ["terminale-d"]);
assert.deepEqual(rawPath.theme, { number: 1, title: "Les ressources minières" });
assert.equal(rawPath.chapterNumber, 13);
assert.equal(rawPath.title, "La mise en place des gisements miniers en Côte d’Ivoire");
assert.equal(rawPath.curriculumSourceUrl, sourceUrl);
assert.equal(rawPath.modules.length, 1);
assert.equal(rawPath.modules[0]?.id, "mining-formation-mastery");
assert.deepEqual(rawLessons.map((lesson) => lesson.id), expectedIds, "Les identifiants autonomes ont changé.");
assert.equal(new Set(rawLessons.map((lesson) => lesson.id)).size, expectedIds.length);
assert.deepEqual(rawLessons.map((lesson) => lesson.xp), expectedRawWeights, "Les poids bruts ont changé.");

const path = applyLessonXpBudget(rawPath);
const lessons = path.modules.flatMap((module) => module.lessons);
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition normalisée a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.equal(getPathRewardTotal(path.id), 10_000, "Le budget XP de l’API n’est plus de 10 000.");
assert.ok(
  lessons.every((lesson) => getLessonReward(path.id, lesson.id) === lesson.xp),
  "Le registre XP de l’API n’est plus aligné avec le frontend.",
);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  Array.from({ length: 9 }, () => 10),
  "Chaque niveau doit conserver ses dix réponses évaluables.",
);
assert.equal(lessons.flatMap((lesson) => lesson.questions ?? []).length, 90);
assert.ok(lessons.every((lesson) => lesson.question === lesson.questions?.[0]));
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_500));

const interactionCounts = lessons.reduce<Record<string, number>>((counts, lesson) => {
  const kind = lesson.interaction.kind ?? "numeric";
  counts[kind] = (counts[kind] ?? 0) + 1;
  return counts;
}, {});
assert.deepEqual(interactionCounts, { diagram: 3, schema: 3, timeline: 3 });

for (const lesson of lessons) {
  const interaction = lesson.interaction;
  JSON.stringify(interaction);
  if (interaction.kind === "schema") {
    assert.ok(interaction.shapes.length >= 16, `Schéma trop pauvre : ${lesson.id}`);
    assert.ok(interaction.hotspots.length >= 6, `Repères insuffisants : ${lesson.id}`);
    assert.equal(new Set(interaction.hotspots.map((hotspot) => hotspot.id)).size, interaction.hotspots.length);
    assert.match(interaction.caption ?? "", /original/i);
  }
  if (interaction.kind === "diagram") {
    assert.ok(interaction.nodes.length >= 8, `Dossier trop pauvre : ${lesson.id}`);
    assert.equal(new Set(interaction.nodes.map((node) => node.id)).size, interaction.nodes.length);
  }
  if (interaction.kind === "timeline") {
    assert.ok(interaction.items.length >= 6, `Mécanisme trop court : ${lesson.id}`);
    assert.equal(new Set(interaction.items.map((item) => item.label)).size, interaction.items.length);
  }
}

assert.deepEqual(lessons.map((lesson) => lesson.source?.pages), expectedPages);
assert.ok(lessons.every((lesson) => lesson.source?.documentTitle === sourceDocument));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "adapted"));
assert.ok(lessons.every((lesson) => Boolean(lesson.source?.section.trim())));
assert.ok(lessons.every((lesson) => (lesson.source?.corrections.length ?? 0) >= 5));
assert.ok(
  lessons.every((lesson) =>
    lesson.source?.corrections.some(
      (correction) =>
        correction.includes("progression annuelle officielle SVT 2025-2026 (p. 14)") &&
        correction.includes("« Leçon 1 »"),
    ),
  ),
  "La progression officielle p. 14 et la numérotation distincte du guide 2018 doivent rester explicites.",
);
assert.ok(lessons.every((lesson) => /Adaptation enrichie du guide DPFC/i.test(lesson.concept.eyebrow)));

const allQuestions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(new Set(allQuestions.map((question) => question.prompt)).size, 90, "Deux questions partagent le même énoncé.");
assert.ok(allQuestions.every((question) => question.prompt.trim().length > 0));
assert.ok(allQuestions.every((question) => question.explanation.trim().length > 0));
assert.ok(allQuestions.every((question) => /DPFC/.test(question.sourceLabel ?? "")));
assert.ok(allQuestions.every((question) => /original/i.test(question.sourceLabel ?? "")));

const choices = allQuestions.filter((question) => question.type === "choice");
const shortAnswers = allQuestions.filter((question) => question.type === "short-answer");
assert.equal(choices.length, 81);
assert.equal(shortAnswers.length, 9);
assert.ok(lessons.every((lesson) => lesson.questions?.filter((question) => question.type === "short-answer").length === 1));
assert.ok(choices.every((question) => question.options.length === 4));
assert.ok(choices.every((question) => new Set(question.options).size === question.options.length));
assert.ok(choices.every((question) => question.correctIndex >= 0 && question.correctIndex < 4));
assert.deepEqual(
  [0, 1, 2, 3].map((index) => choices.filter((question) => question.correctIndex === index).length),
  [21, 20, 20, 20],
);
assert.ok(shortAnswers.every((question) => (question.acceptedAnswers?.length ?? 0) >= 2));

const collectStrings = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectStrings);
  return [];
};

const scientificText = collectStrings(rawPath).join("\n");
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
assert.doesNotMatch(scientificText, /(?:exercice|carte|schéma|données)\s+officiel(?:le|les)?/i);

assert.match(scientificText, /fer[^.\n]{0,180}(?:absent|ajoute)|(?:absent|ajoute)[^.\n]{0,180}fer/i);
assert.match(scientificText, /aluminium[^.\n]{0,180}bauxite|bauxite[^.\n]{0,180}aluminium/i);
assert.match(scientificText, /roche encaissante[^.\n]{0,220}(?:contient|entoure)/i);
assert.match(scientificText, /minerai[^.\n]{0,260}(?:concentration|volume|conditions)|(?:concentration|volume|conditions)[^.\n]{0,260}minerai/i);
assert.match(scientificText, /primaire[^.\n]{0,220}(?:âge|ancien|riche)|(?:âge|ancien|riche)[^.\n]{0,220}primaire/i);
assert.match(scientificText, /altération[^.\n]{0,180}érosion|érosion[^.\n]{0,180}altération/i);
assert.match(scientificText, /tri hydraulique/i);
assert.match(scientificText, /gisement aurifère secondaire/i);
assert.match(scientificText, /transfert de démarche/i);
assert.match(scientificText, /ne signifie pas que[^.\n]{0,240}même genèse|pas généralisé[^.\n]{0,220}toutes les ressources/i);
assert.match(scientificText, /vallée de Kôla/i);
assert.match(scientificText, /entièrement originale/i);

const corrections = lessons.flatMap((lesson) => lesson.source?.corrections ?? []).join("\n");
assert.match(corrections, /fer[^\n]{0,180}page 19[^\n]{0,180}page 9|page 19[^\n]{0,180}fer[^\n]{0,180}page 9/i);
assert.match(corrections, /aluminium[^\n]{0,180}bauxite|bauxite[^\n]{0,180}aluminium/i);
assert.match(corrections, /transfert de démarche/i);
assert.match(corrections, /ni ancien, ni riche, ni rentable|âge[^\n]{0,180}richesse/i);
assert.match(corrections, /aucun PDF complet|n’étant pas reproduit/i);
assert.match(corrections, /questions[^\n]{0,120}origin|évaluations[^\n]{0,120}origin/i);

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
const agentsSource = readFileSync(new URL("../apps/web/AGENTS.md", import.meta.url), "utf8");

assert.ok(catalogSource.includes(`pathId: "${rawPath.id}"`), "La carte du catalogue n’ouvre pas L13.");
assert.ok(loaderSource.includes("terminalDSvtMiningFormationPath"), "Le chargeur différé n’importe pas L13.");
assert.ok(registrySource.includes("terminalDSvtMiningFormationPath"), "Le registre Web intégral n’importe pas L13.");
assert.ok(
  verifySource.includes("audit-terminal-d-svt-mining-formation.ts"),
  "Le vérificateur intégral ignore l’audit L13.",
);
for (const [index, lessonId] of expectedIds.entries()) {
  assert.ok(
    apiCurriculumSource.includes(`["${rawPath.id}:${lessonId}", ${expectedRawWeights[index]}]`),
    `Le registre API ne contient pas le poids de ${lessonId}.`,
  );
}

const migration = readFileSync(
  new URL("../supabase/migrations/20260902010000_svt_d_mining_formation_path.sql", import.meta.url),
  "utf8",
);
assert.ok(migration.includes(rawPath.id));
assert.ok(migration.includes(JSON.stringify(expectedIds)));
assert.ok(migration.includes("array[45, 55, 60, 70, 75, 85, 95, 110, 135]"));
assert.ok(migration.includes("620 / 750 / 820 / 960 / 1030 / 1160 / 1300 / 1510 / 1850 = 10 000"));
assert.match(migration, /create temporary table/i);
assert.match(migration, /on conflict\s*\(path_id, lesson_id\)\s*do update/i);
assert.match(migration, /1000\s*-\s*sum\(base_units\)/i);
assert.doesNotMatch(migration, /\bdelete\b/i, "Une création de parcours ne doit supprimer aucune récompense.");
assert.ok(agentsSource.includes(rawPath.id), "La décision durable L13 manque dans AGENTS.md.");
assert.ok(
  agentsSource.includes("20260902010000_svt_d_mining_formation_path.sql"),
  "La migration L13 manque dans la décision durable.",
);

const pathFile = resolve("apps/web/src/data/terminalDSvtMiningFormationPath.ts");
assert.ok(statSync(pathFile).size < 250_000, "Le fichier source dépasse le budget de 250 kB.");

console.log(
  "Audit SVT Tle D carte 13 valide : 9 niveaux, 90 réponses, 9 interactions originales et 10 000 XP.",
);
