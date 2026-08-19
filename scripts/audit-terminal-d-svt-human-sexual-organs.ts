import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import katex from "../apps/web/node_modules/katex/dist/katex.mjs";
import { curriculumLessonTitles } from "../apps/web/src/data/curriculumCatalog";
import { AVAILABLE_EXERCISES } from "../apps/web/src/data/learningPathMetrics";
import { terminalDSvtHumanSexualOrgansPath } from "../apps/web/src/data/terminalDSvtHumanSexualOrgansPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const expectedIds = [
  "female-sexual-cycle-landmarks",
  "ovarian-follicular-ovulatory-luteal-cycle",
  "uterine-menstrual-proliferative-secretory-cycle",
  "ovarian-pituitary-hormone-curves",
  "hypophysectomy-ovariectomy-experiments",
  "hypothalamic-pituitary-ovarian-control",
  "female-negative-positive-feedback",
  "male-hypothalamic-pituitary-testicular-control",
  "hormonal-contraception-mechanisms",
  "human-sexual-organs-final-mission",
] as const;
const expectedRawWeights = [45, 55, 65, 70, 75, 80, 90, 100, 110, 130];
const expectedXp = [550, 670, 790, 850, 910, 980, 1_100, 1_220, 1_340, 1_590];
const expectedQuestionCounts = [10, 11, 11, 11, 11, 11, 11, 11, 11, 12];
const expectedDocumentTitle = "SVT TD_L9_Le fonctionnement des organes sexuels chez lHomme (ok).pdf";

const sourceFile = new URL(
  "../apps/web/src/data/terminalDSvtHumanSexualOrgansPath.ts",
  import.meta.url,
);
assert.ok(
  statSync(sourceFile).size < 250_000,
  "Le module source dépasse le budget maximal de 250 000 octets.",
);

const rawLessons = terminalDSvtHumanSexualOrgansPath.modules.flatMap((module) => module.lessons);
assert.deepEqual(
  rawLessons.map((lesson) => lesson.xp),
  expectedRawWeights,
  "Les poids bruts Web ont divergé du contrat éditorial.",
);

const path = applyLessonXpBudget(terminalDSvtHumanSexualOrgansPath);
const lessons = path.modules.flatMap((module) => module.lessons);

assert.equal(path.id, "terminale-d-svt-l6-human-sexual-organs");
assert.equal(path.subjectId, "svt");
assert.deepEqual(path.levelIds, ["terminale-d"]);
assert.equal(path.chapterNumber, 6, "La carte doit rester en sixième position dans la progression Terminale D.");
assert.deepEqual(path.theme, { number: 2, title: "La reproduction chez les mammifères" });
assert.equal(path.title, "Le fonctionnement des organes sexuels chez l’Homme");
assert.equal(path.modules.length, 1, "Le parcours autonome doit conserver un module unique.");
assert.equal(path.modules[0]?.id, "human-sexual-organs-mastery");
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
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 110);
assert.equal(lessons.at(-1)?.kind, "challenge", "Le dernier niveau doit rester la mission finale.");
assert.ok(
  lessons.every((lesson) => (lesson.concept.bodyMarkdown?.trim().length ?? 0) >= 1_800),
  "Chaque niveau doit conserver au moins 1 800 caractères de cours rédigé.",
);
assert.ok(
  lessons.every((lesson) => lesson.source?.documentTitle === expectedDocumentTitle),
  "La référence au PDF officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages.trim() && lesson.source.section.trim()));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));
assert.ok(
  lessons.every((lesson) => (lesson.source?.corrections.length ?? 0) >= 3),
  "Chaque niveau doit documenter au moins trois corrections ou précisions scientifiques.",
);

const catalogLesson = curriculumLessonTitles.find((lesson) => (
  lesson.levelId === "terminale-d"
  && lesson.subjectId === "svt"
  && lesson.title === "Le fonctionnement des organes sexuels chez l’Homme"
));
assert.equal(catalogLesson?.sequence, 6, "La leçon a quitté sa sixième position officielle.");
assert.equal(catalogLesson?.pathId, path.id, "La carte du programme n’ouvre plus le parcours publié.");

const registrySource = readFileSync(
  new URL("../apps/web/src/data/learningPaths.ts", import.meta.url),
  "utf8",
);
assert.ok(
  registrySource.includes('import { terminalDSvtHumanSexualOrgansPath } from "./terminalDSvtHumanSexualOrgansPath";'),
  "Le registre Web n’importe plus le parcours L6.",
);
assert.ok(
  registrySource.includes("  terminalDSvtHumanSexualOrgansPath,"),
  "Le registre Web ne publie plus le parcours L6.",
);

const loaderSource = readFileSync(
  new URL("../apps/web/src/data/learningPathLoader.ts", import.meta.url),
  "utf8",
);
assert.ok(
  loaderSource.includes('import("./terminalDSvtHumanSexualOrgansPath")'),
  "Le chargeur Terminale D ne découpe plus le module L6 dans son propre chunk.",
);
assert.ok(
  loaderSource.includes("module.terminalDSvtHumanSexualOrgansPath"),
  "Le chargeur Terminale D ne récupère plus l’export L6 attendu.",
);
assert.match(
  loaderSource,
  /return\s*\[[^\]]*\bhumanSexualOrgans\b[^\]]*\]/,
  "Le chargeur Terminale D importe L6 sans la restituer dans la progression.",
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
  new URL("../supabase/migrations/20260818080000_svt_d_human_sexual_organs_path.sql", import.meta.url),
  "utf8",
);
assert.ok(migration.includes(path.id), "La migration L6 ne référence plus le parcours attendu.");
assert.ok(
  migration.includes(JSON.stringify(expectedIds)),
  "La migration L6 ne conserve plus l’ordre exact des dix identifiants.",
);
assert.ok(
  migration.includes("array[45, 55, 65, 70, 75, 80, 90, 100, 110, 130]"),
  "La migration L6 ne conserve plus les dix poids bruts.",
);
assert.ok(
  migration.includes("550 / 670 / 790 / 850 / 910 / 980 / 1100 / 1220 / 1340 / 1590 = 10 000"),
  "La migration L6 ne documente plus la normalisation exacte à 10 000 XP.",
);

assert.equal(
  AVAILABLE_EXERCISES,
  9_078,
  "Le compteur public doit intégrer les 110 réponses L6 et rester fixé à 9 078.",
);
for (const lesson of lessons) {
  const lessonCorrections = lesson.source?.corrections ?? [];
  assert.ok(
    lessonCorrections.every((correction) => correction.trim().length > 0),
    `Une correction de ${lesson.id} est vide.`,
  );
  assert.equal(
    new Set(lessonCorrections.map((correction) => correction.trim().toLocaleLowerCase("fr"))).size,
    lessonCorrections.length,
    `Des corrections de ${lesson.id} sont dupliquées.`,
  );
}

const interactionCounts = new Map<string, number>();
for (const lesson of lessons) {
  const interaction = lesson.interaction;
  interactionCounts.set(interaction.kind ?? "numeric", (interactionCounts.get(interaction.kind ?? "numeric") ?? 0) + 1);
  assert.ok(interaction.eyebrow.trim());
  assert.ok(interaction.title.trim());
  assert.ok(interaction.instruction.trim());
  assert.ok(interaction.observation.trim());

  if (interaction.kind === "curve") {
    assert.ok(interaction.formula.trim(), `La formule descriptive de ${lesson.id} est vide.`);
    assert.equal(interaction.rule.kind, "samples", `${lesson.id} doit conserver une courbe expérimentale.`);
    if (interaction.rule.kind === "samples") {
      assert.ok(interaction.rule.points.length >= 5, `${lesson.id} ne contient pas assez de mesures.`);
      assert.ok(
        interaction.rule.points.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y)),
        `Une mesure de ${lesson.id} n'est pas un nombre fini.`,
      );
      for (let index = 1; index < interaction.rule.points.length; index += 1) {
        assert.ok(
          interaction.rule.points[index - 1][0] < interaction.rule.points[index][0],
          `Les abscisses de ${lesson.id} doivent être strictement croissantes.`,
        );
      }
      assert.ok(
        interaction.rule.points.every(([x, y]) => (
          x >= interaction.window.xMin
          && x <= interaction.window.xMax
          && y >= interaction.window.yMin
          && y <= interaction.window.yMax
        )),
        `Une mesure de ${lesson.id} sort de la fenêtre de tracé.`,
      );
      assert.ok(
        interaction.marker.min <= interaction.rule.points[0][0]
        && interaction.marker.max >= interaction.rule.points.at(-1)![0],
        `Le curseur de ${lesson.id} ne couvre pas toutes les abscisses mesurées.`,
      );
    }
    assert.ok(
      [
        interaction.window.xMin,
        interaction.window.xMax,
        interaction.window.yMin,
        interaction.window.yMax,
        interaction.marker.min,
        interaction.marker.max,
        interaction.marker.initial,
        interaction.marker.step,
      ].every(Number.isFinite),
      `La fenêtre ou le curseur de ${lesson.id} contient une valeur non finie.`,
    );
    assert.ok(interaction.window.xMin < interaction.window.xMax);
    assert.ok(interaction.window.yMin < interaction.window.yMax);
    assert.ok(interaction.marker.min >= interaction.window.xMin);
    assert.ok(interaction.marker.max <= interaction.window.xMax);
    assert.ok(interaction.marker.initial >= interaction.marker.min);
    assert.ok(interaction.marker.initial <= interaction.marker.max);
    assert.ok(interaction.marker.step > 0);
  }

  if (interaction.kind === "schema") {
    const hotspotIds = interaction.hotspots.map((hotspot) => hotspot.id);
    const hotspotNumbers = interaction.hotspots.map((hotspot) => hotspot.number);
    const viewBox = interaction.viewBox.trim().split(/[\s,]+/).map(Number);
    assert.equal(viewBox.length, 4, `La viewBox de ${lesson.id} doit contenir quatre nombres.`);
    assert.ok(viewBox.every(Number.isFinite), `La viewBox de ${lesson.id} contient une valeur non finie.`);
    const [viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight] = viewBox as [number, number, number, number];
    assert.ok(viewBoxWidth > 0 && viewBoxHeight > 0, `La viewBox de ${lesson.id} doit avoir une aire positive.`);
    assert.ok(interaction.shapes.length > 0, `Le schéma de ${lesson.id} ne contient aucune primitive graphique.`);
    assert.ok(interaction.hotspots.length >= 2, `Le schéma de ${lesson.id} doit conserver au moins deux repères.`);
    assert.equal(new Set(hotspotIds).size, hotspotIds.length, `Des repères de ${lesson.id} partagent le même id.`);
    assert.equal(new Set(hotspotNumbers).size, hotspotNumbers.length, `Des repères de ${lesson.id} partagent le même numéro.`);

    const assertShape = (shape: (typeof interaction.shapes)[number], context: string): void => {
      if (shape.shape === "path") {
        assert.ok(shape.d.trim(), `Un tracé de ${context} est vide.`);
      } else if (shape.shape === "line") {
        assert.ok(
          [shape.x1, shape.y1, shape.x2, shape.y2].every(Number.isFinite),
          `Une ligne de ${context} contient une coordonnée non finie.`,
        );
      } else if (shape.shape === "circle") {
        assert.ok(
          [shape.cx, shape.cy, shape.r].every(Number.isFinite) && shape.r > 0,
          `Un cercle de ${context} est invalide.`,
        );
      } else if (shape.shape === "ellipse") {
        assert.ok(
          [shape.cx, shape.cy, shape.rx, shape.ry, shape.rotate ?? 0].every(Number.isFinite)
          && shape.rx > 0
          && shape.ry > 0,
          `Une ellipse de ${context} est invalide.`,
        );
      } else {
        assert.ok(
          [shape.x, shape.y].every(Number.isFinite) && shape.content.trim().length > 0,
          `Un texte de ${context} est invalide.`,
        );
      }
    };

    for (const shape of interaction.shapes) {
      assertShape(shape, lesson.id);
    }
    for (const hotspot of interaction.hotspots) {
      assert.ok(hotspot.id.trim(), `Un repère de ${lesson.id} a un id vide.`);
      assert.ok(hotspot.label.trim(), `Un repère de ${lesson.id} a un libellé vide.`);
      assert.ok(hotspot.detail.trim(), `Un repère de ${lesson.id} a un détail vide.`);
      assert.ok(Number.isInteger(hotspot.number) && hotspot.number > 0, `Un repère de ${lesson.id} a un numéro invalide.`);
      assert.ok(Number.isFinite(hotspot.x) && Number.isFinite(hotspot.y), `Un repère de ${lesson.id} a des coordonnées invalides.`);
      assert.ok(
        hotspot.x >= viewBoxX
        && hotspot.x <= viewBoxX + viewBoxWidth
        && hotspot.y >= viewBoxY
        && hotspot.y <= viewBoxY + viewBoxHeight,
        `Le repère ${hotspot.id} de ${lesson.id} sort de la viewBox.`,
      );
      for (const shape of hotspot.highlight ?? []) {
        assertShape(shape, `la surbrillance ${hotspot.id} de ${lesson.id}`);
      }
    }
    for (const zone of interaction.zones ?? []) {
      assert.ok(zone.label.trim(), `Une zone de ${lesson.id} a un libellé vide.`);
      assert.ok(
        [zone.xStart, zone.xEnd].every(Number.isFinite)
        && zone.xStart < zone.xEnd
        && zone.xStart >= viewBoxX
        && zone.xEnd <= viewBoxX + viewBoxWidth,
        `Une zone de ${lesson.id} sort de la viewBox ou possède des bornes invalides.`,
      );
    }
    assert.match(
      interaction.caption ?? "",
      /(?:figure|schéma|représentation)[^.]{0,120}(?:original|redessin)/i,
      `Le schéma de ${lesson.id} doit signaler sa reconstruction originale.`,
    );
  }

  if (interaction.kind === "diagram") {
    const nodeIds = interaction.nodes.map((node) => node.id);
    assert.ok(interaction.nodes.length >= 2, `Le diagramme ${lesson.id} doit conserver au moins deux cartes.`);
    assert.equal(new Set(nodeIds).size, nodeIds.length, `Des cartes de ${lesson.id} partagent le même id.`);
    assert.ok(interaction.rootLabel.trim(), `La racine du diagramme ${lesson.id} est vide.`);
    if (interaction.rootDetail !== undefined) {
      assert.ok(interaction.rootDetail.trim(), `Le détail racine du diagramme ${lesson.id} est vide.`);
    }
    for (const node of interaction.nodes) {
      assert.ok(node.id.trim(), `Une carte de ${lesson.id} a un id vide.`);
      assert.ok(node.label.trim(), `Une carte de ${lesson.id} a un libellé vide.`);
      assert.ok(node.role.trim(), `Une carte de ${lesson.id} a un rôle vide.`);
      assert.ok(node.detail.trim(), `Une carte de ${lesson.id} a un détail vide.`);
      if (node.group !== undefined) {
        assert.ok(node.group.trim(), `Une carte de ${lesson.id} a un groupe vide.`);
      }
    }
  }

  if (interaction.kind === "timeline") {
    assert.ok(interaction.items.length >= 2, `La démarche ${lesson.id} doit conserver au moins deux étapes.`);
    for (const item of interaction.items) {
      assert.ok(item.label.trim(), `Une étape de ${lesson.id} a un libellé vide.`);
      assert.ok(item.detail.trim(), `Une étape de ${lesson.id} a un détail vide.`);
      if (item.shortLabel !== undefined) {
        assert.ok(item.shortLabel.trim(), `Une étape de ${lesson.id} a un libellé court vide.`);
      }
    }
  }
}

assert.deepEqual(
  Object.fromEntries([...interactionCounts].sort(([left], [right]) => left.localeCompare(right))),
  { curve: 2, diagram: 3, schema: 2, timeline: 3 },
  "La distribution des dix interactions originales a changé.",
);

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 110);
assert.ok(questions.every((question) => question.prompt.trim().length > 0));
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.every((question) => (question.points ?? 1) > 0));

function normalizedAnswer(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase("fr");
}

function physicalPagesFromSourceLabel(sourceLabel: string): number[] {
  const pageMentions = sourceLabel.match(/(?:\bpages?|\bpp?\.?)\s*:?\s*\d{1,3}(?:\s*(?:(?:-|–|—|à|au|et|,|\/)\s*)\d{1,3})*/gi) ?? [];
  return pageMentions.flatMap((mention) => (mention.match(/\d+/g) ?? []).map(Number));
}

for (const question of questions) {
  if (question.sourceLabel !== undefined) {
    assert.ok(question.sourceLabel.trim(), `Une étiquette source est vide : ${question.prompt}`);
  }
  if (question.sourceLabel && /\b(?:pages?|pp?)(?:\.|\b)/i.test(question.sourceLabel)) {
    const physicalPages = physicalPagesFromSourceLabel(question.sourceLabel);
    assert.ok(physicalPages.length > 0, `Une référence de page est illisible : ${question.sourceLabel}`);
    assert.ok(
      physicalPages.every((pageNumber) => Number.isInteger(pageNumber) && pageNumber >= 1 && pageNumber <= 15),
      `Une référence sort des pages physiques 1 à 15 : ${question.sourceLabel}`,
    );
  }
}

for (const lesson of lessons) {
  const levelQuestions = lesson.questions ?? [];
  assert.deepEqual(lesson.question, levelQuestions[0], `${lesson.id} ne pointe plus vers sa première question.`);
  assert.equal(
    levelQuestions.filter((question) => question.type === "short-answer").length,
    1,
    `${lesson.id} doit conserver exactement une réponse courte.`,
  );
  assert.ok(
    levelQuestions.filter((question) => /page/i.test(question.sourceLabel ?? "")).length >= 8,
    `${lesson.id} doit conserver au moins huit questions rattachées à une page source.`,
  );
}

const choices = questions.filter((question) => question.type === "choice");
const shortAnswers = questions.filter((question) => question.type === "short-answer");
assert.equal(choices.length, 100);
assert.equal(shortAnswers.length, 10);
assert.ok(choices.every((question) => question.options.length === 4));
for (const question of choices) {
  const normalizedOptions = question.options.map(normalizedAnswer);
  assert.ok(normalizedOptions.every((option) => option.length > 0), `Une proposition est vide : ${question.prompt}`);
  assert.equal(
    new Set(normalizedOptions).size,
    normalizedOptions.length,
    `Des propositions sont dupliquées : ${question.prompt}`,
  );
}
assert.ok(
  choices.every((question) => (
    Number.isInteger(question.correctIndex)
    && question.correctIndex >= 0
    && question.correctIndex < question.options.length
  )),
  "Une bonne réponse sort de la liste des propositions.",
);
assert.deepEqual(
  [0, 1, 2, 3].map((index) => choices.filter((question) => question.correctIndex === index).length),
  [25, 25, 25, 25],
  "Les bonnes réponses doivent être parfaitement équilibrées entre A, B, C et D.",
);
assert.ok(shortAnswers.every((question) => question.options.length === 0));
assert.ok(shortAnswers.every((question) => (question.acceptedAnswers?.length ?? 0) > 0));
for (const question of shortAnswers) {
  const normalizedAcceptedAnswers = (question.acceptedAnswers ?? []).map(normalizedAnswer);
  assert.ok(
    normalizedAcceptedAnswers.every((answer) => answer.length > 0),
    `Une réponse courte acceptée est vide : ${question.prompt}`,
  );
  assert.equal(
    new Set(normalizedAcceptedAnswers).size,
    normalizedAcceptedAnswers.length,
    `Des réponses courtes acceptées sont dupliquées : ${question.prompt}`,
  );
}

const serialized = JSON.stringify(path);
assert.deepEqual(JSON.parse(serialized), path, "Le parcours n’est pas intégralement sérialisable.");

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
const formulas: Array<{ formula: string; source: string }> = [];
for (const entry of stringEntries) {
  for (const match of entry.value.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)) {
    formulas.push({ formula: match[1] ?? match[2], source: entry.key });
  }
  if (/\.(?:formulaTex|notationTex)$/.test(entry.key) && entry.value.trim()) {
    formulas.push({ formula: entry.value, source: entry.key });
  }
}
assert.ok(formulas.length > 0, "Aucune notation KaTeX n’est contrôlée.");
for (const { formula, source } of formulas) {
  assert.ok(
    !/(?<!\\)\b(?:mathrm|text|frac|ce|rightleftharpoons)\s*\{/.test(formula),
    `Une commande KaTeX a perdu son antislash dans ${source}.`,
  );
  katex.renderToString(formula, { throwOnError: true, strict: "error" });
}

function nonBlankStrings(values: Array<string | undefined>): string[] {
  return values.filter((value): value is string => typeof value === "string" && value.trim().length > 0);
}

function instructionalSegmentsForLesson(lesson: (typeof lessons)[number]): string[] {
  return nonBlankStrings([
    lesson.concept.explanation,
    lesson.concept.bodyMarkdown,
    lesson.concept.notation,
    lesson.concept.notationTex,
    lesson.concept.example,
    lesson.method.eyebrow,
    lesson.method.title,
    lesson.method.introduction,
    ...lesson.method.steps,
    lesson.method.example.work,
    lesson.method.example.result,
    lesson.method.tip,
    lesson.interaction.observation,
    ...(lesson.questions ?? []).map((question) => question.explanation),
  ]);
}

const instructionalSegments = lessons.flatMap(instructionalSegmentsForLesson);
const correctionSegments = lessons.flatMap((lesson) => lesson.source?.corrections ?? []);
const authoritativeSegments = [...instructionalSegments, ...correctionSegments];
const instructionalText = instructionalSegments.join("\n");
const authoritativeText = authoritativeSegments.join("\n");
const corrections = correctionSegments.join("\n");

function assertAuthoritativeMatch(pattern: RegExp, message: string): void {
  assert.ok(
    authoritativeSegments.some((segment) => pattern.test(segment)),
    message,
  );
}

assert.match(corrections, /(?:nom du fichier|fichier|PDF|document)[^.\n]{0,180}\bL9\b/i);
assert.match(corrections, /(?:progression|catalogue)[^.\n]{0,180}(?:carte|chapitre|position)[^.\n]{0,60}\b6\b/i);
assert.match(
  authoritativeText,
  /(?:portée humaine[^.\n]{0,100}mixte|cycles? féminins?[^.\n]{0,180}(?:axe masculin|fonctionnement testiculaire|chez l[’']homme))/i,
  "La portée humaine mixte de la leçon n’est plus explicite.",
);
assert.match(corrections, /28\s*jours?[^.\n]{0,160}(?:modèle|repère)[^.\n]{0,160}(?:variable|pas (?:une règle|universel|obligatoire))/i);
assert.match(authoritativeText, /ovocyte\s*II/i);
assert.match(authoritativeText, /endomètre[^.\n]{0,220}(?:menstru|prolifér)[^.\n]{0,220}sécrétoire/i);
assert.match(authoritativeText, /estradiol[^.\n]{0,180}(?:follicul|follicule)/i);
assert.match(authoritativeText, /progestérone[^.\n]{0,180}corps jaune/i);
assert.match(authoritativeText, /GnRH[^.\n]{0,180}pulsatil/i);
assert.match(authoritativeText, /FSH[^.\n]{0,180}(?:follicul|Sertoli)/i);
assert.match(authoritativeText, /LH[^.\n]{0,180}(?:ovulation|Leydig)/i);
assert.match(authoritativeText, /estradiol[^.\n]{0,220}élevé[^.\n]{0,160}maintenu[^.\n]{0,180}pic de LH/i);
assert.match(authoritativeText, /rétrocontrôle[^.\n]{0,100}négatif[^.\n]{0,220}positif|rétrocontrôle[^.\n]{0,100}positif[^.\n]{0,220}négatif/i);
assertAuthoritativeMatch(
  /FSH[\s\S]{0,180}(?:agit|active|stimule|cible|se fixe)[\s\S]{0,120}(?:cellules?\s+de\s+)?Sertoli|(?:cellules?\s+de\s+)?Sertoli[\s\S]{0,180}(?:récepteurs?|cibles?|action)[\s\S]{0,100}FSH/i,
  "Le relais FSH vers les cellules de Sertoli n'est pas explicitement protégé.",
);
assertAuthoritativeMatch(
  /LH[\s\S]{0,180}(?:agit|active|stimule|cible|se fixe)[\s\S]{0,120}(?:cellules?\s+de\s+)?Leydig[\s\S]{0,220}(?:produi|sécrè|synth)[\s\S]{0,100}testostérone/i,
  "Le relais LH vers les cellules de Leydig puis la testostérone n'est pas explicite.",
);
assertAuthoritativeMatch(
  /Sertoli[\s\S]{0,180}(?:sécrè|produi)[\s\S]{0,100}inhibine\s*B[\s\S]{0,260}(?:freine|inhibe|rétrocontrôle)[\s\S]{0,120}(?:sécrétion\s+de\s+)?FSH|inhibine\s*B[\s\S]{0,100}(?:produite|sécrétée)[\s\S]{0,80}(?:par\s+)?(?:les\s+cellules?\s+de\s+)?Sertoli[\s\S]{0,180}(?:freine|inhibe|rétrocontrôle)[\s\S]{0,120}(?:sécrétion\s+de\s+)?FSH/i,
  "Le rétrocontrôle Sertoli-inhibine B-FSH n'est pas explicite.",
);
assertAuthoritativeMatch(
  /(?:FSH[\s\S]{0,180}(?:avec|coopèr|synergi|ensemble|conjointement|action combinée)[\s\S]{0,140}testostérone|testostérone[\s\S]{0,180}(?:avec|coopèr|synergi|ensemble|conjointement|action combinée)[\s\S]{0,140}FSH)[\s\S]{0,220}spermatogenèse|(?:coopér|synergi|action combinée)[\s\S]{0,180}(?:FSH[\s\S]{0,140}testostérone|testostérone[\s\S]{0,140}FSH)[\s\S]{0,220}spermatogenèse/i,
  "La coopération entre FSH et testostérone dans la spermatogenèse n'est pas explicite.",
);
assertAuthoritativeMatch(
  /testostérone[\s\S]{0,220}(?:agit|action|diffuse|récepteurs?)[\s\S]{0,120}(?:cellules?\s+de\s+)?Sertoli/i,
  "L'action de la testostérone par les cellules de Sertoli n'est pas explicitée.",
);
assert.doesNotMatch(
  instructionalText,
  /inhibine(?:\s*B)?[^.\n]{0,180}(?:fixation|fixe|lier|liaison|transport)[^.\n]{0,120}testostérone/i,
  "L'inhibine B ne fixe ni ne transporte la testostérone.",
);
assert.doesNotMatch(
  instructionalText,
  /testostérone[^.\n]{0,140}(?:n[’']\s*a\s+(?:pas|aucun)|sans)[^.\n]{0,80}(?:effet|action)[^.\n]{0,100}FSH/i,
  "La testostérone ne doit pas être déclarée absolument sans effet sur la FSH.",
);
assert.doesNotMatch(
  instructionalText,
  /testostérone[^.\n]{0,160}(?:se fixe|stimule directement|agit directement)[^.\n]{0,120}cellules?\s+(?:de la lignée\s+)?germinales/i,
  "La testostérone ne doit pas être présentée comme agissant directement sur les cellules germinales.",
);
assert.match(
  authoritativeText,
  /tubes?\s+séminifères?[\s\S]{0,260}(?:cellules?\s+germinales?)[\s\S]{0,180}(?:cellules?\s+de\s+)?Sertoli|tubes?\s+séminifères?[\s\S]{0,260}(?:cellules?\s+de\s+)?Sertoli[\s\S]{0,180}cellules?\s+germinales?/i,
  "L'organisation cellulaire des tubes séminifères n'est pas décrite.",
);
assert.match(
  authoritativeText,
  /(?:cellules?\s+de\s+)?Leydig[\s\S]{0,180}(?:tissu|compartiment|espace)\s+interstitiel|(?:tissu|compartiment|espace)\s+interstitiel[\s\S]{0,180}(?:cellules?\s+de\s+)?Leydig/i,
  "La localisation interstitielle des cellules de Leydig n'est pas protégée.",
);
assert.match(
  authoritativeText,
  /spermatogon(?:ie|ies)[\s\S]{0,300}spermatocytes?[\s*_]*(?:I|1|primaires?)[\s\S]{0,300}spermatocytes?[\s*_]*(?:II|2|secondaires?)[\s\S]{0,300}spermatides?[\s\S]{0,300}spermatozoïdes?/i,
  "La succession ordonnée des cellules de la spermatogenèse n'est pas protégée.",
);
assert.match(
  authoritativeText,
  /épididyme[\s\S]{0,260}(?:matur|acqui)[\s\S]{0,160}(?:spermatozoïdes?|motilité|pouvoir fécondant)/i,
  "La maturation des spermatozoïdes dans l'épididyme n'est pas explicite.",
);
assert.match(
  authoritativeText,
  /sperme[\s\S]{0,160}(?:ne (?:se réduit|se confond)|≠|=|associe|comprend|contient|mélange)[\s\S]{0,140}spermatozoïdes?[\s\S]{0,240}(?:plasma séminal|liquide séminal|sécrétions?)/i,
  "La distinction entre sperme, spermatozoïdes et sécrétions annexes n'est pas explicite.",
);
assert.match(
  authoritativeText,
  /capacitation[\s\S]{0,260}(?:après l[’']éjaculation|voies génitales (?:féminines|de la femme)|tractus génital féminin)/i,
  "La capacitation post-éjaculatoire n'est pas explicitée.",
);
assert.match(
  authoritativeText,
  /gonadarche[\s\S]{0,220}(?:augmentation|accroissement)[\s\S]{0,120}volume testiculaire|(?:augmentation|accroissement)[\s\S]{0,120}volume testiculaire[\s\S]{0,220}gonadarche/i,
  "La gonadarche et l'augmentation du volume testiculaire ne sont pas reliées.",
);
assert.match(
  authoritativeText,
  /fonctionnement testiculaire[^.\n]{0,180}continu[^.\n]{0,220}rétrocontrôle[^.\n]{0,80}négatif|rétrocontrôle[^.\n]{0,80}négatif[^.\n]{0,220}fonctionnement testiculaire[^.\n]{0,180}continu/i,
);
assert.match(
  corrections,
  /(?:contraception d[’']urgence|pilule du lendemain)[^.\n]{0,260}(?:retarde|inhibe)[^.\n]{0,120}ovulation/i,
);
assert.match(
  corrections,
  /(?:n[’']interrompt pas une grossesse implantée|ne provoque pas l[’']interruption d[’']une grossesse implantée|implantation déjà établie[^.\n]{0,120}(?:non interrompue|n[’']est pas interrompue))/i,
);
assert.match(authoritativeText, /contracepti(?:f|on)[^.\n]{0,220}ovulation[^.\n]{0,220}glaire cervicale/i);
assert.match(
  authoritativeText,
  /mini-?pilule[\s\S]{0,160}(?:progestati(?:f|ve)\s+seul|seulement\s+un\s+progestatif|ne contient[\s\S]{0,80}que[\s\S]{0,50}(?:un\s+)?progestatif)|progestati(?:f|ve)\s+seul[\s\S]{0,160}mini-?pilule/i,
  "La minipilule doit être correctement définie comme progestative seule.",
);
assert.doesNotMatch(
  instructionalText,
  /(?:contraception d[’']urgence|pilule du lendemain)[\s\S]{0,260}(?:empêche|bloque|prévient)\s+(?:une\s+)?(?:éventuelle\s+)?(?:nidation|implantation)|(?:empêche|bloque|prévient)\s+(?:une\s+)?(?:éventuelle\s+)?(?:nidation|implantation)[\s\S]{0,260}(?:contraception d[’']urgence|pilule du lendemain)/i,
  "La contraception d'urgence ne doit pas être présentée comme empêchant la nidation.",
);
assert.doesNotMatch(
  instructionalText,
  /(?:contraception d[’']urgence|pilule du lendemain)[\s\S]{0,240}(?:(?:provoque|déclenche|cause|entraîne)\s+(?:un\s+)?avortement|(?:interrompt|met fin à)\s+(?:une\s+)?grossesse|est\s+abortive)|(?:(?:provoque|déclenche|cause|entraîne)\s+(?:un\s+)?avortement|(?:interrompt|met fin à)\s+(?:une\s+)?grossesse|est\s+abortive)[\s\S]{0,240}(?:contraception d[’']urgence|pilule du lendemain)/i,
  "La contraception d'urgence ne provoque pas un avortement et n'interrompt pas une grossesse établie.",
);

console.log(
  "Audit source SVT Tle D L6 valide : 10 niveaux, 110 réponses, 10 interactions originales et 10 000 XP.",
);
