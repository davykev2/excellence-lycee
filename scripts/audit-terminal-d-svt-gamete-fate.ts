import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog";
import { terminalDSvtGameteFatePath } from "../apps/web/src/data/terminalDSvtGameteFatePath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const expectedIds = [
  "gamete-migration-capacitation",
  "ovocyte-encounter",
  "acrosomal-reaction",
  "ovocyte-activation",
  "pronuclei-zygote",
  "cleavage-morula",
  "blastocyst-hatching",
  "implantation-hcg",
  "fertilization-official-assessment",
  "gamete-fate-final-mission",
] as const;
const expectedRawWeights = [45, 55, 65, 70, 75, 80, 90, 100, 110, 130];
const expectedXp = [550, 670, 790, 850, 910, 980, 1_100, 1_220, 1_340, 1_590];
const expectedQuestionCounts = [11, 11, 11, 11, 11, 11, 11, 12, 14, 15];
const expectedInteractionKinds = [
  "timeline",
  "schema",
  "timeline",
  "diagram",
  "schema",
  "curve",
  "schema",
  "diagram",
  "schema",
  "timeline",
];
const expectedPages = [
  "1 et 3",
  "1-3",
  "2-3",
  "2-3",
  "2-3",
  "4",
  "4-5",
  "4-5",
  "6",
  "1-6, hors situation d’apprentissage de la page 1",
];
const expectedDocumentTitle = "SVT TD_L8_Le devenir des cellules sexuelles chez les mammifères.pdf";

const sourceFile = new URL(
  "../apps/web/src/data/terminalDSvtGameteFatePath.ts",
  import.meta.url,
);
assert.ok(
  statSync(sourceFile).size < 250_000,
  "Le module source dépasse le budget maximal de 250 000 octets.",
);

const rawLessons = terminalDSvtGameteFatePath.modules.flatMap((module) => module.lessons);
assert.deepEqual(
  rawLessons.map((lesson) => lesson.xp),
  expectedRawWeights,
  "Les poids bruts Web ont divergé du manifeste API/Supabase.",
);

const path = applyLessonXpBudget(terminalDSvtGameteFatePath);
const lessons = path.modules.flatMap((module) => module.lessons);

assert.equal(path.id, "terminale-d-svt-l5-gamete-fate");
assert.equal(path.subjectId, "svt");
assert.deepEqual(path.levelIds, ["terminale-d"]);
assert.equal(path.chapterNumber, 5, "La leçon doit rester la cinquième carte SVT de Terminale D.");
assert.deepEqual(path.theme, { number: 2, title: "La reproduction chez les mammifères" });
assert.equal(path.title, "Le devenir des cellules sexuelles chez les mammifères");
assert.equal(path.modules.length, 1, "Le parcours autonome doit conserver un module unique.");
assert.equal(path.modules[0]?.id, "gamete-fate-mastery");
assert.equal(lessons.length, 10);
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, lessons.length, "Les identifiants de niveaux ne sont pas uniques.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition normalisée des XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La répartition des réponses évaluables par niveau a changé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 118);
assert.equal(lessons.at(-2)?.kind, "practice", "L’évaluation officielle doit rester l’avant-dernier niveau.");
assert.equal(lessons.at(-1)?.kind, "challenge", "Le dernier niveau doit rester la mission finale.");
assert.ok(
  lessons.every((lesson) => (lesson.concept.bodyMarkdown?.trim().length ?? 0) >= 2_000),
  "Chaque niveau doit conserver au moins 2 000 caractères de cours rédigé.",
);

assert.deepEqual(
  lessons.map((lesson) => lesson.source?.pages),
  expectedPages,
  "Le rattachement des niveaux aux six pages officielles a changé.",
);
assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === expectedDocumentTitle),
  "La référence exacte au PDF L8 a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.section.trim()));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));
assert.ok(
  lessons.every((lesson) => (lesson.source?.corrections.length ?? 0) >= 3),
  "Chaque niveau doit documenter au moins trois corrections ou précisions scientifiques.",
);

assert.deepEqual(
  lessons.map((lesson) => lesson.interaction.kind),
  expectedInteractionKinds,
  "La succession des dix interactions originales a changé.",
);
const interactionCounts = new Map<string, number>();
for (const lesson of lessons) {
  const interaction = lesson.interaction;
  interactionCounts.set(interaction.kind, (interactionCounts.get(interaction.kind) ?? 0) + 1);
  assert.ok(interaction.eyebrow.trim());
  assert.ok(interaction.title.trim());
  assert.ok(interaction.instruction.trim());
  assert.ok(interaction.observation.trim());

  if (interaction.kind === "schema") {
    const hotspotIds = interaction.hotspots.map((hotspot) => hotspot.id);
    const hotspotNumbers = interaction.hotspots.map((hotspot) => hotspot.number);
    assert.equal(new Set(hotspotIds).size, hotspotIds.length, `Des repères de ${lesson.id} partagent le même id.`);
    assert.equal(new Set(hotspotNumbers).size, hotspotNumbers.length, `Des repères de ${lesson.id} partagent le même numéro.`);
    assert.match(
      interaction.caption ?? "",
      /(?:figure|schéma|reconstruction|redessin)[^.]{0,160}(?:original|reconstruit|redessin)/i,
      `Le schéma de ${lesson.id} doit signaler sa reconstruction originale.`,
    );
  }

  if (interaction.kind === "diagram") {
    const nodeIds = interaction.nodes.map((node) => node.id);
    assert.equal(new Set(nodeIds).size, nodeIds.length, `Des cartes de ${lesson.id} partagent le même id.`);
  }

  if (interaction.kind === "timeline") {
    assert.ok(interaction.items.length >= 5, `La chronologie ${lesson.id} doit conserver au moins cinq étapes.`);
  }

  if (interaction.kind === "curve") {
    assert.equal(interaction.rule.kind, "samples", `${lesson.id} doit conserver une courbe par échantillons.`);
    if (interaction.rule.kind === "samples") {
      assert.ok(interaction.rule.points.length >= 5, `${lesson.id} ne contient pas assez de points.`);
      assert.ok(
        interaction.rule.points.every((point, index, points) => index === 0 || point[0] > points[index - 1][0]),
        `Les abscisses de ${lesson.id} doivent être strictement croissantes.`,
      );
      assert.ok(
        interaction.rule.points.every(([x, y]) => (
          x >= interaction.window.xMin
          && x <= interaction.window.xMax
          && y >= interaction.window.yMin
          && y <= interaction.window.yMax
        )),
        `Un point de ${lesson.id} sort de la fenêtre de tracé.`,
      );
    }
  }
}
assert.deepEqual(
  Object.fromEntries([...interactionCounts].sort(([left], [right]) => left.localeCompare(right))),
  { curve: 1, diagram: 2, schema: 4, timeline: 3 },
  "La distribution des dix interactions originales a changé.",
);

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 118);
assert.ok(questions.every((question) => question.prompt.trim().length > 0));
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.every((question) => (question.points ?? 1) > 0));
for (const lesson of lessons) {
  assert.deepEqual(lesson.question, lesson.questions?.[0], `${lesson.id} ne pointe plus vers sa première question.`);
}

const choices = questions.filter((question) => question.type === "choice");
const shortAnswers = questions.filter((question) => question.type === "short-answer");
assert.equal(choices.length, 99);
assert.equal(shortAnswers.length, 19);
assert.ok(choices.every((question) => question.options.length >= 2));
assert.ok(
  choices.every((question) => question.correctIndex >= 0 && question.correctIndex < question.options.length),
  "Une bonne réponse sort de la liste des propositions.",
);
assert.deepEqual(
  [...new Set(choices.map((question) => question.correctIndex))].sort(),
  [0, 1, 2, 3],
  "Les bonnes réponses doivent occuper les quatre positions.",
);
assert.ok(shortAnswers.every((question) => question.options.length === 0));
assert.ok(shortAnswers.every((question) => (question.acceptedAnswers?.length ?? 0) > 0));
assert.equal(
  questions.filter((question) => /page/i.test(question.sourceLabel ?? "")).length,
  44,
  "La traçabilité exacte des questions vers les pages officielles a changé.",
);

const officialAssessment = lessons.find((lesson) => lesson.id === "fertilization-official-assessment");
assert.ok(officialAssessment, "Le niveau consacré à la situation d’évaluation de la page 6 a disparu.");
assert.equal(officialAssessment.source?.pages, "6");
assert.equal(
  officialAssessment.questions?.filter((question) => /page 6/i.test(question.sourceLabel ?? "")).length,
  14,
  "Les quatorze questions de l’évaluation officielle doivent rester rattachées à la page 6.",
);
assert.equal(officialAssessment.interaction.kind, "schema");
if (officialAssessment.interaction.kind === "schema") {
  assert.equal(officialAssessment.interaction.hotspots.length, 15);
  assert.deepEqual(
    officialAssessment.interaction.hotspots.map((hotspot) => hotspot.id),
    Array.from({ length: 15 }, (_, index) => `official-${index + 1}`),
    "Les quinze repères officiels ont changé d’identifiant ou d’ordre.",
  );
  assert.deepEqual(
    officialAssessment.interaction.hotspots.map((hotspot) => hotspot.number),
    Array.from({ length: 15 }, (_, index) => index + 1),
    "Les repères de la page 6 doivent rester numérotés de 1 à 15.",
  );
  assert.deepEqual(
    officialAssessment.interaction.hotspots.map((hotspot) => hotspot.label),
    [
      "Zone pellucide",
      "Spermatozoïde",
      "Premier globule polaire",
      "Fuseau et chromosomes d’anaphase II",
      "Granules corticaux en exocytose",
      "Corona radiata",
      "Zone pellucide modifiée",
      "Pronoyau mâle",
      "Deux globules polaires",
      "Corona radiata",
      "Pronoyau femelle",
      "Pronoyau mâle rapproché",
      "Pronoyau femelle rapproché",
      "Corona radiata",
      "Chromosomes parentaux sur le premier fuseau",
    ],
    "Le corrigé des quinze légendes officielles a changé.",
  );
}

const officialText = JSON.stringify(officialAssessment);
assert.match(officialText, /A[^.\n]{0,220}(?:pénétration|activation)[^.\n]{0,180}méiose II/i);
assert.match(officialText, /B[^.\n]{0,180}(?:deux|2) pronoyaux/i);
assert.match(officialText, /C[^.\n]{0,180}rapprochement[^.\n]{0,180}(?:répli|première mitose)/i);
assert.match(officialText, /D[^.\n]{0,220}(?:désassembl|chromosomes parentaux)[^.\n]{0,180}fuseau/i);
assert.ok(officialText.includes("5 → 4 → 2 → 3 → 1"));

const orderingQuestion = officialAssessment.questions?.find((question) => /ordre exact/i.test(question.prompt));
assert.ok(orderingQuestion && orderingQuestion.type === "choice", "La question de classement officielle a disparu.");
assert.deepEqual(
  [...orderingQuestion.options[orderingQuestion.correctIndex].matchAll(/\d+/g)].map((match) => Number(match[0])),
  [5, 4, 2, 3, 1],
  "La bonne réponse de l’exercice de classement de la page 6 a changé.",
);

const finalMission = lessons.find((lesson) => lesson.id === "gamete-fate-final-mission");
assert.ok(finalMission, "La mission finale a disparu.");
assert.equal(
  finalMission.questions?.filter((question) => /page 6/i.test(question.sourceLabel ?? "")).length,
  6,
  "Les six reprises évaluables de l’exercice de classement doivent rester rattachées à la page 6.",
);
assert.equal(finalMission.interaction.kind, "timeline");
if (finalMission.interaction.kind === "timeline") {
  assert.deepEqual(finalMission.interaction.items.map((item) => item.shortLabel), ["5", "4", "2", "3", "1"]);
}

const catalogLesson = curriculumLessonTitles.find((lesson) => (
  lesson.levelId === "terminale-d"
  && lesson.subjectId === "svt"
  && lesson.title === "Le devenir des cellules sexuelles chez les mammifères"
));
assert.equal(catalogLesson?.sequence, 5, "La leçon a quitté sa cinquième position officielle.");
assert.equal(catalogLesson?.pathId, path.id, "La carte du programme n’ouvre plus le parcours publié.");

const loaderSource = readFileSync(
  new URL("../apps/web/src/data/learningPathLoader.ts", import.meta.url),
  "utf8",
);
assert.ok(loaderSource.includes('import("./terminalDSvtGameteFatePath")'));
assert.ok(loaderSource.includes("module.terminalDSvtGameteFatePath"));

const registrySource = readFileSync(
  new URL("../apps/web/src/data/learningPaths.ts", import.meta.url),
  "utf8",
);
assert.ok(registrySource.includes('import { terminalDSvtGameteFatePath } from "./terminalDSvtGameteFatePath";'));
assert.ok(registrySource.includes("  terminalDSvtGameteFatePath,"));

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
  new URL("../supabase/migrations/20260818050000_svt_d_gamete_fate_path.sql", import.meta.url),
  "utf8",
);
assert.ok(migration.includes(path.id));
assert.ok(migration.includes(JSON.stringify(expectedIds)));
assert.ok(migration.includes("array[45, 55, 65, 70, 75, 80, 90, 100, 110, 130]"));
assert.ok(migration.includes("550 / 670 / 790 / 850 / 910 / 980 / 1100 / 1220 / 1340 / 1590 = 10 000"));

interface StringEntry {
  key: string;
  value: string;
}

function collectStrings(value: unknown, key = "path", entries: StringEntry[] = []): StringEntry[] {
  if (typeof value === "string") {
    entries.push({ key, value });
    return entries;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${key}[${index}]`, entries));
    return entries;
  }
  if (value && typeof value === "object") {
    for (const [property, child] of Object.entries(value)) {
      collectStrings(child, `${key}.${property}`, entries);
    }
  }
  return entries;
}

const stringEntries = collectStrings(path);
const scientificText = stringEntries.map((entry) => entry.value).join("\n");
const corrections = lessons.flatMap((lesson) => lesson.source?.corrections ?? []).join("\n");
const serialized = JSON.stringify(path);
const reparsedPath = JSON.parse(serialized) as { id?: string; modules?: Array<{ lessons?: unknown[] }> };
assert.equal(reparsedPath.id, path.id, "Le parcours n’est pas sérialisable avec son identifiant.");
assert.equal(reparsedPath.modules?.[0]?.lessons?.length, 10, "Les dix niveaux ne survivent pas à la sérialisation.");

const mojibakeMarkers = [
  "ÃƒÂ©", "ÃƒÂ¨", "ÃƒÂª", "ÃƒÂ´", "ÃƒÂ®", "ÃƒÂ§", "Ã¢â‚¬â„¢", "Ã¢â‚¬Å“", "Ã¢â‚¬", "Ã‚Â°", "Ã‚Âµ", "ï¿½",
  "Ã©", "Ã¨", "Ãª", "Ã´", "Ã®", "Ã§", "â€™", "â€œ", "â€", "Â°", "Âµ", "�",
];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(!serialized.includes("⃗"), "Une flèche combinante illisible a été introduite.");
assert.ok(
  !/(?:src\/assets|\/assets\/|data:image|<img\b|!\[[^\]]*\]\s*\(|https?:\/\/[^\s"']+\.(?:png|jpe?g|webp|gif|svg))/i.test(serialized),
  "Un scan ou une image publiée a été intégré au lieu d’une figure originale sérialisable.",
);

assert.match(scientificText, /ampoule tubaire/i);
assert.match(scientificText, /ovocyte II[^.\n]{0,220}métaphase II/i);
assert.match(scientificText, /corona radiata/i);
assert.match(scientificText, /espace périvitellin/i);
assert.match(scientificText, /motilité hyperactivée/i);
assert.match(scientificText, /réaction acrosomique/i);
assert.match(scientificText, /oscillations de calcium|oscillations de Ca/i);
assert.match(scientificText, /deuxième globule polaire/i);
assert.match(scientificText, /pronoyaux[^.\n]{0,260}fuseau mitotique commun/i);
assert.match(scientificText, /morula[^.\n]{0,180}(?:16 à 32|J3-J4)/i);
assert.match(scientificText, /blastocyste[^.\n]{0,180}(?:blastocèle|trophoblaste|embryoblaste)/i);
assert.match(scientificText, /éclosion[^.\n]{0,180}implantation/i);
assert.match(scientificText, /syncytiotrophoblaste[^.\n]{0,180}hCG/i);
assert.match(scientificText, /hCG[^.\n]{0,180}corps jaune[^.\n]{0,180}progestérone/i);

assert.match(corrections, /fichier source[^.\n]{0,100}L8[^.\n]{0,220}cinquième position[^.\n]{0,120}chapterNumber 5/i);
assert.match(corrections, /72\s*h[^.\n]{0,220}12-24\s*h/i);
assert.match(corrections, /capacitation[^.\n]{0,180}remodelage membranaire[^.\n]{0,100}ionique/i);
assert.match(corrections, /dépôt vaginal[^.\n]{0,180}dépôt utérin[^.\n]{0,180}espèces/i);
assert.match(corrections, /zone pellucide[^.\n]{0,180}enzymes acrosomiales[^.\n]{0,180}flagelle[^.\n]{0,220}motilité/i);
assert.match(corrections, /membrane de fécondation[^.\n]{0,180}réaction corticale[^.\n]{0,180}zone pellucide/i);
assert.match(corrections, /polyspermie[^.\n]{0,180}non absolu/i);
assert.match(corrections, /enveloppes des pronoyaux[^.\n]{0,180}désassemblent[^.\n]{0,240}fuseau mitotique commun[^.\n]{0,180}pas de fusion littérale/i);
assert.match(corrections, /segmentation[^.\n]{0,180}sans croissance globale/i);
assert.match(corrections, /morula[^.\n]{0,120}J3-J4[^.\n]{0,180}blastocyste[^.\n]{0,100}J5[^.\n]{0,180}éclosion[^.\n]{0,100}J5-J6[^.\n]{0,180}implantation[^.\n]{0,100}J6-J7/i);
assert.match(corrections, /hCG[^.\n]{0,180}gonadotrophine chorionique humaine[^.\n]{0,180}syncytiotrophoblaste/i);
assert.match(corrections, /placenta[^.\n]{0,220}composante fœtale[^.\n]{0,180}composante maternelle/i);
assert.match(corrections, /invasion trophoblastique[^.\n]{0,220}enzyme unique[^.\n]{0,180}protéases/i);
assert.match(corrections, /ovovyte[^.\n]{0,100}ovocyte/i);
assert.match(corrections, /flèches 1 et 7[^.\n]{0,220}zone pellucide initiale[^.\n]{0,180}zone pellucide modifiée/i);
assert.match(corrections, /5 → 4 → 2 → 3 → 1/);

const formulas: Array<{ formula: string; source: string }> = [];
for (const entry of stringEntries) {
  for (const match of entry.value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)) {
    formulas.push({ formula: match[1] ?? match[2], source: entry.key });
  }
  if (/\.(?:formulaTex|notationTex)$/.test(entry.key) && entry.value.trim()) {
    formulas.push({ formula: entry.value, source: entry.key });
  }
}
assert.ok(formulas.length >= 6, "Les notations KaTeX contrôlées ont régressé.");
for (const { formula, source } of formulas) {
  assert.ok(
    !/(?<!\\)\b(?:mathrm|text|frac|ce|rightleftharpoons)\s*\{/.test(formula),
    `Une commande KaTeX a perdu son antislash dans ${source}.`,
  );
  katex.renderToString(formula, { throwOnError: true, strict: "error" });
}

console.log(
  "Audit SVT Tle D L5 valide : 10 niveaux, 118 réponses, 10 interactions originales, 15 repères officiels et 10 000 XP.",
);
