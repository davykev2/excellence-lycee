import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  homeworkExercises,
  homeworkQuestions,
  type HomeworkAnswers,
} from "../apps/web/src/domain/homework.ts";
import {
  LSY_MATH_TC_2025_HOMEWORK_SLUG,
  lsyMathTc2025Homework,
  previewHomeworkByReference,
} from "../apps/web/src/data/homeworkCatalog.ts";
import {
  canRetryHomework,
  homeworkExercisePoints,
  homeworkQuestionPointSplit,
  isClosedHomeworkAttemptCode,
  mergeHomeworkAnswers,
  nextHomeworkAttemptDurationSeconds,
  remainingHomeworkSeconds,
  sanitizeHomeworkAnswers,
  unansweredHomeworkQuestions,
} from "../apps/web/src/features/arena/homework/homeworkModel.ts";
import { normalizePastedExerciseLayout } from "../apps/web/src/components/markdownLayout.ts";
import { HomeworkAnswerSaveQueue } from "../apps/web/src/features/arena/homework/homeworkSaveQueue.ts";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

function nearlyEqual(left: number, right: number) {
  return Math.abs(left - right) <= 0.000_001;
}

function allObjectKeys(value: unknown, keys = new Set<string>()) {
  if (!value || typeof value !== "object") return keys;
  if (Array.isArray(value)) {
    for (const item of value) allObjectKeys(item, keys);
    return keys;
  }
  for (const [key, item] of Object.entries(value)) {
    keys.add(key);
    allObjectKeys(item, keys);
  }
  return keys;
}

test("le premier devoir public conserve la structure LSY et annonce le barème pédagogique proposé", () => {
  const homework = lsyMathTc2025Homework;
  const exercises = homeworkExercises(homework);
  const questions = homeworkQuestions(homework);

  assert.equal(homework.slug, LSY_MATH_TC_2025_HOMEWORK_SLUG);
  assert.equal(homework.institution, "Lycée Scientifique de Yamoussoukro");
  assert.equal(homework.academicYear, "2025-2026");
  assert.equal(homework.level.id, "terminale-c");
  assert.equal(homework.subject.id, "mathematics");
  assert.equal(homework.durationSeconds, 3 * 60 * 60);
  assert.equal(homework.totalPoints, 20);
  assert.equal(homework.questionCount, 23);
  assert.match(homework.sourceNotice ?? "", /aucun barème.*proposé par Excellence/i);
  assert.equal(questions.length, 23);
  assert.deepEqual(exercises.map(homeworkExercisePoints), [2, 2, 6, 6, 4]);

  for (const exercise of exercises) {
    assert.ok(nearlyEqual(
      homeworkExercisePoints(exercise),
      exercise.questions.reduce((total, question) => total + question.points, 0),
    ), `Le barème interne de ${exercise.title} doit être exact.`);
  }
  assert.equal(exercises.reduce((total, exercise) => total + homeworkExercisePoints(exercise), 0), 20);
  assert.equal(previewHomeworkByReference(homework.id), homework);
  assert.equal(previewHomeworkByReference(homework.slug), homework);
});

test("la question fautive du QCM est seule neutralisée et ne bloque pas la copie", () => {
  const questions = homeworkQuestions(lsyMathTc2025Homework);
  const neutralized = questions.filter((question) => question.isNeutralized);

  assert.deepEqual(neutralized.map((question) => question.id), ["ex2-q3"]);
  assert.equal(neutralized[0]?.points, 1);
  assert.equal(neutralized[0]?.choices?.length, 4, "Les quatre propositions imprimées restent visibles.");
  assert.match(neutralized[0]?.sourceNotice ?? "", /aucune proposition/i);
  assert.equal(unansweredHomeworkQuestions(lsyMathTc2025Homework, {}).length, 22);
});

test("le paquet public ne divulgue ni clé de réponse ni correction", () => {
  const keys = allObjectKeys(lsyMathTc2025Homework);
  for (const forbiddenKey of [
    "expectedAnswer",
    "acceptedAnswers",
    "correctIndex",
    "correctAnswer",
    "explanationMarkdown",
    "solutionMarkdown",
  ]) {
    assert.equal(keys.has(forbiddenKey), false, `${forbiddenKey} ne doit jamais être livré dans le catalogue public.`);
  }
});

test("chaque démonstration hybride garde résultat et raisonnement dans une même question", () => {
  const questions = homeworkQuestions(lsyMathTc2025Homework);
  const hybrid = questions.filter((question) => question.gradingMode === "hybrid");
  assert.ok(hybrid.length >= 5, "Le sujet doit réellement exercer le mode hybride.");
  assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);

  for (const question of questions) {
    const split = homeworkQuestionPointSplit(question);
    assert.ok(nearlyEqual(split.automatic + split.manual, question.points), `${question.id}: partage de points invalide.`);
    assert.ok(split.automatic >= 0 && split.manual >= 0);
    if (question.gradingMode === "hybrid") {
      assert.equal(question.type, "texte");
      assert.ok(split.automatic > 0, `${question.id}: la réponse finale doit avoir une part automatique.`);
      assert.ok(split.manual > 0, `${question.id}: le raisonnement doit avoir une part humaine.`);
    }
    if (split.manual > 0) {
      const rubricTotal = question.rubricCriteria?.reduce((total, criterion) => total + criterion.pointsMax, 0) ?? 0;
      assert.ok(nearlyEqual(rubricTotal, split.manual), `${question.id}: le barème public doit couvrir tous les points humains.`);
    }
  }

  const complexSituation = questions.find((question) => question.id === "ex5-q1");
  assert.ok(complexSituation);
  assert.equal(complexSituation.gradingMode, "hybrid");
  assert.deepEqual(homeworkQuestionPointSplit(complexSituation), { automatic: 0.5, manual: 3.5, total: 4 });
});

test("la reprise garde le serveur sauf quand la réponse locale est encore non synchronisée", () => {
  const serverAnswers: HomeworkAnswers = {
    "ex1-q1": { answer: "A", attachmentUrls: [] },
    "ex1-q2": { answer: "A", attachmentUrls: [] },
    "ex1-q3": { answer: "A", attachmentUrls: [] },
  };
  const localAnswers: HomeworkAnswers = {
    "ex1-q1": { answer: "B", attachmentUrls: [] },
    "ex1-q2": { answer: "B", attachmentUrls: [] },
    "ex1-q3": { answer: "", attachmentUrls: [] },
    "ex3-a1a": { answer: { finalAnswer: "$\\mathbb R$", reasoning: "Car $x^2+4>0$." }, attachmentUrls: [] },
    "question-inconnue": { answer: "ne doit pas sortir", attachmentUrls: [] },
  };
  const merged = mergeHomeworkAnswers(
    lsyMathTc2025Homework,
    serverAnswers,
    localAnswers,
    new Set(["ex1-q1", "ex1-q3"]),
  );

  assert.equal(merged["ex1-q1"]?.answer, "B", "La dernière saisie locale non envoyée doit survivre au F5.");
  assert.equal(merged["ex1-q2"]?.answer, "A", "Une réponse déjà synchronisée reste autoritaire côté serveur.");
  assert.equal(merged["ex1-q3"]?.answer, "", "Effacer localement une réponse doit aussi survivre au F5.");
  assert.deepEqual(merged["ex3-a1a"]?.answer, localAnswers["ex3-a1a"]?.answer);
  assert.equal("question-inconnue" in merged, false);
  assert.equal("question-inconnue" in sanitizeHomeworkAnswers(lsyMathTc2025Homework, localAnswers), false);
});

test("la minuterie utilise l'heure serveur et survit à un décalage de l'horloge locale", () => {
  const synchronizedAtMs = Date.parse("2026-09-03T10:00:00.000Z");
  const serverNow = "2026-09-03T12:00:00.000Z";
  const expiresAt = "2026-09-03T15:00:00.000Z";

  assert.equal(remainingHomeworkSeconds({ expiresAt, serverNow, synchronizedAtMs, nowMs: synchronizedAtMs }), 10_800);
  assert.equal(remainingHomeworkSeconds({ expiresAt, serverNow, synchronizedAtMs, nowMs: synchronizedAtMs + 25_500 }), 10_775);
  assert.equal(remainingHomeworkSeconds({ expiresAt, serverNow, synchronizedAtMs, nowMs: synchronizedAtMs + 11_000_000 }), 0);
});

test("l'interface expose le partage hybride, le clavier de formules et le contrat mobile", () => {
  const appSource = readFileSync(`${projectRoot}/apps/web/src/App.tsx`, "utf8");
  const questionSource = readFileSync(
    `${projectRoot}/apps/web/src/features/arena/homework/HomeworkQuestionCard.tsx`,
    "utf8",
  );
  const examSource = readFileSync(
    `${projectRoot}/apps/web/src/features/arena/homework/HomeworkExamPage.tsx`,
    "utf8",
  );
  const apiSource = readFileSync(
    `${projectRoot}/apps/web/src/features/arena/homework/homeworkApi.ts`,
    "utf8",
  );
  const css = readFileSync(`${projectRoot}/apps/web/src/styles/homework.css`, "utf8");
  const librarySource = readFileSync(
    `${projectRoot}/apps/web/src/features/arena/homework/HomeworkLibraryPage.tsx`,
    "utf8",
  );

  assert.match(questionSource, /Réponse finale/);
  assert.match(appSource, /__homework-preview/);
  assert.match(questionSource, /Démonstration ou justification/);
  assert.match(questionSource, /après lecture/);
  assert.match(questionSource, /Lecture par un correcteur<\/span>/);
  assert.doesNotMatch(questionSource, /Lecture par un correcteur ·/);
  assert.match(questionSource, /Clavier de formules/);
  assert.match(questionSource, /homework-question-figure/);
  assert.match(questionSource, /question\.imageUrl/);
  assert.match(questionSource, /question\.imageAlt/);
  assert.match(questionSource, /<MathText>\{question\.sourceNotice\}<\/MathText>/);
  assert.match(examSource, /Question neutralisée/);
  assert.match(examSource, /Davy prépare le devoir/);
  assert.match(examSource, /Davy recharge ton résultat/);
  assert.match(examSource, /Ton résultat n’a pas pu être rechargé/);
  assert.match(examSource, /homework\.sourceNotice/);
  assert.match(examSource, /Information sur la source du devoir/);
  assert.match(examSource, /homework\?\.exerciseCount \?\? exercises\.length/);
  assert.match(examSource, /question\.isNeutralized \|\| isHomeworkAnswerComplete/);
  assert.match(apiSource, /nextHomework\.activeAttemptId/);
  assert.match(apiSource, /Démarrer est idempotent côté serveur/);
  assert.match(apiSource, /homework: attemptHomework/);
  assert.match(apiSource, /hydrateAttempt\(attemptHomework, nextAttempt\)/);
  assert.match(apiSource, /nextAttempt\.status !== "in-progress"/);
  assert.match(apiSource, /response\.attempt\.status !== "in-progress"/);
  assert.match(apiSource, /homework: HomeworkDefinition/);
  assert.match(apiSource, /readHomeworkDraftSnapshot/);
  assert.match(apiSource, /Object\.keys\(draft\.pending\)/);
  assert.match(apiSource, /setAttempt\(null\)/);
  assert.match(apiSource, /setResult\(null\)/);
  assert.match(apiSource, /resultLoading/);
  assert.match(apiSource, /resultError/);
  assert.match(apiSource, /if \(!import\.meta\.env\.DEV\) return \[\]/);
  assert.match(apiSource, /await import\("\.\.\/\.\.\/\.\.\/data\/homeworkCatalog"\)/);
  assert.doesNotMatch(apiSource, /^import .*homeworkCatalog/m, "Le sujet complet ne doit pas entrer dans le bundle de production par un import statique.");
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /\.homework-symbol-pad/);
  assert.match(css, /\.homework-choice-list label:focus-within/);
  assert.match(css, /\.homework-question-figure img/);
  assert.match(css, /max-width:\s*100%/);
  assert.match(css, /position:\s*sticky/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(librarySource, /isAdmin \? \{\} : \{ levelId: profile\.levelId \}/);
  assert.match(librarySource, /Toutes les classes/);
  assert.match(librarySource, /homework\.editorialStatus !== "archived"/);
  assert.match(examSource, /Visible à la publication/);
  assert.match(examSource, /Les résultats détaillés restent fermés/);
  assert.match(examSource, /homework-correction-question/);
  assert.match(examSource, /correction\.promptMarkdown/);
  assert.match(examSource, /correction\.choices/);
});

test("la mise en page des exercices collés ne coupe jamais une formule comme $(D)$", () => {
  const mathematicalName = "Justifie que la droite $(D)$ d’équation $y=x$ est une asymptote.";
  assert.equal(normalizePastedExerciseLayout(mathematicalName), mathematicalName);
  const greekName = "Détermine puis construis l’ensemble $(\\Gamma)$ des points $M$.";
  assert.equal(normalizePastedExerciseLayout(greekName), greekName);
  assert.equal(
    normalizePastedExerciseLayout("Calcule les fonctions suivantes.a) \\(x+1\\)"),
    "Calcule les fonctions suivantes.\na) \\(x+1\\)",
  );
});

test("la dernière réponse attend la sauvegarde lente précédente au lieu d’être écrasée", async () => {
  const queue = new HomeworkAnswerSaveQueue();
  const calls: string[] = [];
  let releaseFirst!: () => void;
  let reportFirstStarted!: () => void;
  const firstGate = new Promise<void>((resolve) => { releaseFirst = resolve; });
  const firstStarted = new Promise<void>((resolve) => { reportFirstStarted = resolve; });

  const first = queue.enqueue("attempt-1:question-1", async () => {
    calls.push("A:start");
    reportFirstStarted();
    await firstGate;
    calls.push("A:end");
  });
  const final = queue.enqueue("attempt-1:question-1", async () => {
    calls.push("B:start");
    calls.push("B:end");
  });

  await firstStarted;
  assert.deepEqual(calls, ["A:start"], "Le PUT final ne doit pas dépasser le PUT déjà parti.");
  releaseFirst();
  await Promise.all([first, final]);
  assert.deepEqual(calls, ["A:start", "A:end", "B:start", "B:end"]);
});

test("la reprise ré-enfile automatiquement les brouillons pending dans la sauvegarde sérialisée", () => {
  const apiSource = readFileSync(
    `${projectRoot}/apps/web/src/features/arena/homework/homeworkApi.ts`,
    "utf8",
  );

  assert.match(apiSource, /Object\.keys\(draft\.pending\)\.flatMap/);
  assert.match(apiSource, /persistAnswer\(currentAttempt, questionId, answer\)/);
  assert.match(apiSource, /completion: Promise\.allSettled\(saves\)/);
  assert.match(apiSource, /requeuePendingHomeworkAnswers\(mergedAttempt, draft, persistAnswer\)/);
  assert.match(apiSource, /saveQueue\.current\.enqueue\(queueKey/);
  assert.match(apiSource, /markHomeworkAnswerSynchronized\(userId, currentAttempt\.id, questionId, storedAnswer\)/);
  assert.match(apiSource, /isHomeworkAnswerComplete\(storedAnswer\) \? "PUT" : "DELETE"/);
});

test("l’effacement, l’expiration et les nouvelles tentatives gardent un contrat explicite", () => {
  assert.equal(isClosedHomeworkAttemptCode("HOMEWORK_TIME_EXPIRED"), true);
  assert.equal(isClosedHomeworkAttemptCode("ATTEMPT_CLOSED"), true);
  assert.equal(isClosedHomeworkAttemptCode("NETWORK_ERROR"), false);

  const summary = {
    ...lsyMathTc2025Homework,
    subjectPublished: true,
    correctionsPublished: false,
    attemptsUsed: 1,
    maxAttempts: 3,
    activeAttemptId: undefined,
  };
  assert.equal(canRetryHomework(summary), true);
  assert.equal(nextHomeworkAttemptDurationSeconds(summary), Math.round(3 * 60 * 60 * 0.66));
  assert.equal(canRetryHomework({ ...summary, correctionsPublished: true }), false);
  assert.equal(canRetryHomework({ ...summary, attemptsUsed: 3 }), false);

  const apiSource = readFileSync(
    `${projectRoot}/apps/web/src/features/arena/homework/homeworkApi.ts`,
    "utf8",
  );
  const examSource = readFileSync(
    `${projectRoot}/apps/web/src/features/arena/homework/HomeworkExamPage.tsx`,
    "utf8",
  );
  assert.match(apiSource, /isHomeworkAnswerComplete\(storedAnswer\) \? "PUT" : "DELETE"/);
  assert.match(apiSource, /isClosedHomeworkAttemptCode\(failure\.code\)/);
  assert.match(apiSource, /Le temps est écoulé, mais la copie remise n’a pas pu être rechargée/);
  assert.match(examSource, /Refaire le devoir/);
  assert.match(examSource, /nextHomeworkAttemptDurationSeconds/);
});
