import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getLessonReward, getPathRewardTotal } from "../apps/api/src/curriculum";
import { terminalDSvtHivInfectionPath } from "../apps/web/src/data/terminalDSvtHivInfectionPath";
import { applyLessonXpBudget } from "../apps/web/src/data/xpRewards";

const moduleSource = readFileSync(
  new URL("../apps/web/src/data/terminalDSvtHivInfectionPath.ts", import.meta.url),
  "utf8",
);
assert.ok(Buffer.byteLength(moduleSource, "utf8") < 250_000, "Le module dépasse le budget source de 250 ko.");
assert.ok(!moduleSource.includes("terminalCSvtHivInfectionPath"), "Le parcours TD ne doit pas dépendre du module TC.");
assert.ok(!/from\s+[\"'][^\"']+\.(?:png|jpe?g|webp|gif|pdf)[\"']/i.test(moduleSource), "Aucun scan ou asset du PDF ne doit être importé.");
assert.ok(!moduleSource.includes("/assets/"), "Aucun scan du PDF ne doit être embarqué comme asset.");

const rawLessons = terminalDSvtHivInfectionPath.modules.flatMap((module) => module.lessons);
const path = applyLessonXpBudget(terminalDSvtHivInfectionPath);
const lessons = path.modules.flatMap((module) => module.lessons);
const expectedIds = [
  "hiv-virion-architecture",
  "hiv-cd4-coreceptor-entry",
  "hiv-reverse-transcription-integration",
  "hiv-expression-assembly-maturation",
  "hiv-acute-infection-seroconversion",
  "hiv-chronic-phase-immune-depletion",
  "hiv-transmission-prevention-treatment",
  "hiv-official-cycle-exercises",
  "hiv-diagnosis-final-mission",
];
const expectedXp = [640, 780, 920, 990, 1060, 1210, 1280, 1420, 1700];
const expectedRawWeights = [45, 55, 65, 70, 75, 85, 90, 100, 120];
const expectedQuestionCounts = [11, 11, 11, 11, 12, 11, 11, 13, 15];

assert.equal(path.id, "terminale-d-svt-l12-hiv-infection");
assert.deepEqual(path.levelIds, ["terminale-d"]);
assert.equal(path.chapterNumber, 12);
assert.equal(path.theme.number, 2);
assert.equal(path.title, "L’infection de l’organisme par le VIH");
assert.deepEqual(rawLessons.map((lesson) => lesson.xp), expectedRawWeights, "Les poids bruts ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.id), expectedIds, "Les identifiants publiés ont changé.");
assert.deepEqual(lessons.map((lesson) => lesson.xp), expectedXp, "La répartition des 10 000 XP a changé.");
assert.equal(lessons.reduce((total, lesson) => total + lesson.xp, 0), 10_000);
assert.equal(getPathRewardTotal(path.id), 10_000, "Le budget API doit rester normalisé à 10 000 XP.");
assert.ok(
  lessons.every((lesson) => getLessonReward(path.id, lesson.id) === lesson.xp),
  "Le registre API doit rester aligné avec le frontend.",
);
assert.deepEqual(
  lessons.map((lesson) => lesson.questions?.length ?? 0),
  expectedQuestionCounts,
  "La banque d’évaluation de la leçon a régressé.",
);
assert.equal(expectedQuestionCounts.reduce((total, count) => total + count, 0), 106);
assert.ok(lessons.every((lesson) => (lesson.concept.bodyMarkdown?.length ?? 0) >= 1_500));
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "diagram").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "timeline").length, 3);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "schema").length, 1);
assert.equal(lessons.filter((lesson) => lesson.interaction.kind === "curve").length, 2);
assert.ok(
  lessons.every(
    (lesson) => lesson.source?.documentTitle === "SVT TD_L7_Linfection de lorganisme pâr le VIH.pdf",
  ),
  "La référence au document officiel a changé.",
);
assert.ok(lessons.every((lesson) => lesson.source?.pages && lesson.source.section));
assert.ok(lessons.every((lesson) => lesson.source?.fidelity === "faithful-corrected"));

const questions = lessons.flatMap((lesson) => lesson.questions ?? []);
assert.equal(questions.length, 106);
assert.ok(questions.every((question) => question.explanation.trim().length > 0));
assert.ok(questions.filter((question) => question.sourceLabel?.includes("page")).length >= 9);

const choices = questions.filter((question) => question.type === "choice");
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
assert.ok(shortAnswers.length >= 10);
assert.ok(shortAnswers.every((question) => (question.acceptedAnswers?.length ?? 0) > 0));

const serialized = JSON.stringify(path);
const courseText = lessons.map((lesson) => lesson.concept.bodyMarkdown ?? "").join("\n");
const corrections = lessons.flatMap((lesson) => lesson.source?.corrections ?? []).join("\n");
const mojibakeMarkers = ["ÃƒÂ©", "ÃƒÂ¨", "ÃƒÂª", "ÃƒÂ´", "ÃƒÂ®", "ÃƒÂ§", "Ã¢â‚¬â„¢", "Ã¢â‚¬Å“", "Ã¢â‚¬", "Ã‚Â°", "Ã‚Âµ", "ï¿½"];
assert.ok(mojibakeMarkers.every((marker) => !serialized.includes(marker)), "Du texte mal décodé a été introduit.");
assert.ok(!serialized.includes("⃗"), "Une flèche combinante illisible a été introduite.");
assert.ok(serialized.includes("CCR5"));
assert.ok(serialized.includes("CXCR4"));
assert.ok(serialized.includes("protéase"));
assert.ok(serialized.includes("fenêtre sérologique"));
assert.ok(serialized.includes("200 cellules par millimètre cube"));
assert.ok(serialized.includes("indétectable = intransmissible"));
assert.ok(serialized.includes("72 heures"));
assert.ok(serialized.includes("IgG maternelles"));
assert.ok(serialized.includes("moins de 18 mois"));
assert.ok(serialized.includes("trois tests distincts consécutivement réactifs"));
assert.ok(serialized.includes("5 C"));
assert.ok(serialized.includes("28 jours"));
assert.ok(serialized.includes("second prélèvement"));
assert.ok(serialized.includes("ARN VIH non détecté à ce prélèvement"));
assert.ok(serialized.includes("suivi virologique"));
assert.ok(serialized.includes("couverture interne « Leçon 15 »"));
assert.ok(serialized.includes("carte 12"));
assert.ok(!serialized.includes("E1 n’est pas infecté"));
assert.ok(!serialized.includes("E1 est considéré comme non infecté"));
assert.ok(courseText.includes("trois tests distincts consécutivement réactifs"));
assert.ok(courseText.includes("il est proposé rapidement, indépendamment du nombre initial de T CD4"));
assert.ok(courseText.includes("prophylaxie antirétrovirale postnatale du nourrisson exposé"));
assert.ok(courseText.includes("indétectable = intransmissible par voie sexuelle"));
assert.ok(courseText.includes("doit être confirmé sur un second prélèvement"));
assert.ok(courseText.includes("employé par certaines classifications"));
assert.ok(corrections.includes("diagnostic confirmé"));
assert.ok(corrections.includes("prophylaxie postnatale"));
assert.ok(!serialized.includes("le résultat virologique est confirmé sur un second prélèvement"));
assert.ok(!serialized.includes("restaurer l’immunité"));
assert.ok(serialized.includes("2 - 4 - 3 - 5 - 1"));
assert.ok(serialized.includes("Figure pédagogique originale"));
assert.ok(serialized.includes("Courbe originale en indice relatif"));

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
const verifySource = readFileSync(new URL("./verify-project.mjs", import.meta.url), "utf8");
assert.ok(catalogSource.includes(`pathId: "${path.id}"`), "La carte du catalogue n’ouvre pas L12.");
assert.ok(loaderSource.includes("terminalDSvtHivInfectionPath"), "Le chargeur différé n’importe pas L12.");
assert.ok(registrySource.includes("terminalDSvtHivInfectionPath"), "Le registre Web intégral n’importe pas L12.");
assert.ok(verifySource.includes("audit-terminal-d-svt-hiv-infection.ts"), "Le vérificateur intégral ignore l’audit L12.");

const migration = readFileSync(
  new URL("../supabase/migrations/20260827020000_svt_d_hiv_infection_path.sql", import.meta.url),
  "utf8",
);
assert.ok(migration.includes(path.id));
assert.ok(migration.includes(JSON.stringify(expectedIds)));
assert.ok(migration.includes("array[45, 55, 65, 70, 75, 85, 90, 100, 120]"));
assert.ok(migration.includes("640 / 780 / 920 / 990 / 1060 / 1210 / 1280 / 1420 / 1700 = 10 000"));
assert.match(migration, /create temporary table/i);
assert.match(migration, /on conflict\s*\(path_id, lesson_id\)\s*do update/i);
assert.match(migration, /1000\s*-\s*sum\(base_units\)/i);
assert.doesNotMatch(migration, /\bdelete\b/i, "Une création de parcours ne doit supprimer aucune récompense.");

console.log("Audit SVT Tle D carte 12 valide : 9 niveaux, 106 questions, 9 interactions originales et 10 000 XP.");
