import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  calculateHomeworkReviewTotals,
  createHomeworkReviewDrafts,
  createHomeworkReviewPayload,
  validateHomeworkReviewDrafts,
} from "../apps/web/src/features/admin/homework/homeworkReviewModel.ts";
import {
  inspectHomeworkImportPackage,
  parseHomeworkImportText,
} from "../apps/web/src/features/admin/homework/homeworkImportModel.ts";
import type {
  HomeworkReviewDetail,
  HomeworkReviewQuestion,
} from "../apps/web/src/features/admin/homework/homeworkReviewTypes.ts";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

test("le pilotage admin ne présente pas le quota personnel comme un total de copies", () => {
  const source = readFileSync(
    `${projectRoot}/apps/web/src/features/admin/homework/HomeworkPublicationManager.tsx`,
    "utf8",
  );
  assert.doesNotMatch(source, /copie.*sur cette version/);
  assert.match(source, /Publication du sujet et du corrigé séparée/);
});

function validPackage() {
  return {
    importId: "58f87884-e8db-4f4c-8d4b-2db1af502a6d",
    stableId: "lsy-tc-maths-devoir-1-2025",
    slug: "lsy-tc-maths-devoir-1-2025",
    title: "Devoir de Mathématiques n° 1",
    number: 1,
    institution: "Lycée Scientifique de Yamoussoukro",
    academicYear: "2025-2026",
    subject: { id: "mathematics", name: "Mathématiques" },
    level: { id: "terminale-c", name: "Terminale C" },
    series: { id: "c", name: "C" },
    durationSeconds: 10_800,
    gradingMode: "hybrid",
    maxAttempts: 3,
    subjectPublished: false,
    correctionsPublished: false,
    sections: [{
      id: "maths",
      title: "Mathématiques",
      order: 1,
      exercises: [{
        id: "exercise-1",
        title: "Exercice 1",
        order: 1,
        questions: [
          {
            id: "q-1",
            label: "1.",
            promptMarkdown: "Choisis la bonne réponse.",
            type: "qcm",
            answerKind: "single-choice",
            gradingMode: "auto",
            points: 2,
            autoPoints: 2,
            manualPoints: 0,
            choices: [
              { id: "a", label: "A", contentMarkdown: "1" },
              { id: "b", label: "B", contentMarkdown: "2" },
            ],
            expectedAnswer: "b",
            explanationMarkdown: "La seconde proposition est obtenue après calcul détaillé.",
          },
          {
            id: "q-2",
            label: "2.",
            promptMarkdown: "Donne le résultat final puis démontre-le.",
            type: "texte",
            answerKind: "essay",
            gradingMode: "hybrid",
            points: 4,
            autoPoints: 1,
            manualPoints: 3,
            expectedAnswer: ["2", "x=2"],
            explanationMarkdown: "On isole les termes, puis on vérifie la valeur dans l’équation.",
            rubricCriteria: [
              { id: "method", label: "Choix de la méthode", pointsMax: 1 },
              { id: "proof", label: "Démonstration rigoureuse", pointsMax: 2 },
            ],
          },
          {
            id: "q-3",
            label: "3.",
            promptMarkdown: "Rédige une démonstration complète.",
            type: "texte",
            answerKind: "essay",
            gradingMode: "manual",
            points: 4,
            autoPoints: 0,
            manualPoints: 4,
            explanationMarkdown: "La rédaction attendue cite le théorème puis justifie chaque étape.",
            rubricCriteria: [
              { id: "theorem", label: "Théorème pertinent", pointsMax: 1.5 },
              { id: "reasoning", label: "Enchaînement logique", pointsMax: 2.5 },
            ],
          },
        ],
      }],
    }],
  };
}

function reviewQuestion(overrides: Partial<HomeworkReviewQuestion>): HomeworkReviewQuestion {
  return {
    id: "question",
    order: 1,
    label: "Question",
    promptMarkdown: "Énoncé",
    type: "texte",
    answerKind: "essay",
    gradingMode: "manual",
    points: 4,
    autoPoints: 0,
    autoPointsAwarded: 0,
    manualPoints: 4,
    isNeutralized: false,
    studentAnswer: { finalAnswer: "2", reasoning: "Ma démonstration" },
    attachmentUrls: [],
    expectedAnswer: "2",
    explanationMarkdown: "Correction",
    rubricCriteria: [],
    ...overrides,
  };
}

function reviewDetail(questions: HomeworkReviewQuestion[]): HomeworkReviewDetail {
  return {
    attempt: {
      id: "00000000-0000-4000-8000-000000000001",
      homeworkId: "homework",
      attemptNumber: 1,
      status: "awaiting-review",
      startedAt: "2026-09-03T08:00:00.000Z",
      submittedAt: "2026-09-03T09:00:00.000Z",
      serverNow: "2026-09-03T09:00:00.000Z",
      answers: {},
      answeredCount: questions.length,
      questionCount: questions.length,
    },
    homework: {
      id: "homework",
      stableId: "homework",
      slug: "homework",
      title: "Devoir",
      number: 1,
      institution: "Lycée Scientifique",
      academicYear: "2025-2026",
      subject: { id: "mathematics", name: "Mathématiques" },
      level: { id: "terminale-c", name: "Terminale" },
      series: { id: "c", name: "C" },
      durationSeconds: 10_800,
      gradingMode: "hybrid",
      questionCount: questions.length,
      totalPoints: questions.reduce((sum, question) => sum + question.points, 0),
      attemptsUsed: 1,
      maxAttempts: 3,
      status: "completed",
    },
    student: { id: "student", name: "Awa", email: "awa@example.com", levelId: "terminale-c" },
    questions,
  };
}

test("l’import privé résume le devoir sans exposer ses réponses", () => {
  const inspection = inspectHomeworkImportPackage(validPackage());
  assert.equal(inspection.valid, true);
  assert.deepEqual(inspection.counts, {
    sections: 1,
    exercises: 1,
    questions: 3,
    auto: 1,
    manual: 1,
    hybrid: 1,
    rubricCriteria: 4,
    detailedCorrections: 3,
  });
  assert.equal(inspection.totalPoints, 10);
  assert.equal(inspection.metadata.institution, "Lycée Scientifique de Yamoussoukro");
  assert.equal("expectedAnswer" in inspection.metadata, false, "l’aperçu ne remonte jamais le corrigé");
});

test("une question neutralisée peut rester fidèle sans inventer une fausse réponse", () => {
  const homework = validPackage();
  (homework as unknown as Record<string, unknown>).sourceNotice = "Transcription fidèle du sujet original.";
  const neutralized = homework.sections[0].exercises[0].questions[0] as {
    expectedAnswer?: string;
    isNeutralized?: boolean;
  };
  neutralized.isNeutralized = true;
  delete neutralized.expectedAnswer;

  const inspection = inspectHomeworkImportPackage(homework);
  assert.equal(inspection.valid, true);
  assert.equal(
    inspection.issues.some((issue) => issue.path.endsWith("expectedAnswer")),
    false,
  );
});

test("le validateur exige les enveloppes et les critères attendus par l’API", () => {
  const homework = validPackage();
  delete (homework.sections[0].exercises[0].questions[0] as { autoPoints?: number }).autoPoints;
  homework.sections[0].exercises[0].questions[2].rubricCriteria = [];
  const inspection = inspectHomeworkImportPackage(homework);
  assert.equal(inspection.valid, false);
  assert.ok(inspection.issues.some((issue) => issue.path.endsWith("autoPoints")));
  assert.ok(inspection.issues.some((issue) => issue.message.includes("barème humain détaillé")));
});

test("le validateur bloque les barèmes hybrides incohérents et les ids dupliqués", () => {
  const homework = validPackage();
  homework.sections[0].exercises[0].questions[1].manualPoints = 4;
  homework.sections[0].exercises[0].questions[2].id = "q-2";
  const inspection = inspectHomeworkImportPackage(homework);
  assert.equal(inspection.valid, false);
  assert.ok(inspection.issues.some((issue) => issue.message.includes("autoPoints + manualPoints")));
  assert.ok(inspection.issues.some((issue) => issue.message.includes("utilisé plusieurs fois")));
});

test("le collage JSON invalide produit une erreur lisible", () => {
  const inspection = parseHomeworkImportText('{ "title": ');
  assert.equal(inspection.valid, false);
  assert.match(inspection.issues[0].message, /^JSON invalide/);
});

test("les points automatiques hybrides restent immuables pendant la revue", () => {
  const questions = [
    reviewQuestion({
      id: "hybrid",
      gradingMode: "hybrid",
      points: 4,
      autoPoints: 1,
      autoPointsAwarded: 1,
      manualPoints: 3,
      rubricCriteria: [
        { id: "method", label: "Méthode", pointsMax: 1 },
        { id: "proof", label: "Preuve", pointsMax: 2 },
      ],
    }),
    reviewQuestion({
      id: "auto",
      type: "qcm",
      answerKind: "single-choice",
      gradingMode: "auto",
      points: 2,
      autoPoints: 2,
      autoPointsAwarded: 2,
      manualPoints: 0,
      pointsAwarded: 2,
    }),
    reviewQuestion({
      id: "manual",
      points: 4,
      manualPoints: 4,
      rubricCriteria: [{ id: "reasoning", label: "Raisonnement", pointsMax: 4 }],
    }),
  ];
  const drafts = createHomeworkReviewDrafts(reviewDetail(questions));
  assert.deepEqual(calculateHomeworkReviewTotals(questions, drafts), {
    automatic: 3,
    manual: 0,
    awarded: 3,
    maximum: 10,
    manualMaximum: 7,
    scoreOutOf20: 6,
  });

  drafts.hybrid.criteria.method = 1;
  drafts.hybrid.criteria.proof = 1;
  drafts.manual.criteria.reasoning = 4;
  assert.deepEqual(calculateHomeworkReviewTotals(questions, drafts), {
    automatic: 3,
    manual: 6,
    awarded: 9,
    maximum: 10,
    manualMaximum: 7,
    scoreOutOf20: 18,
  });

  const payload = createHomeworkReviewPayload(questions, drafts, "Bonne copie");
  assert.equal(payload.reviews.length, 2);
  assert.deepEqual(payload.reviews.map((review) => [review.questionId, review.pointsAwarded]), [
    ["hybrid", 2],
    ["manual", 4],
  ]);
  assert.equal(payload.reviews.some((review) => review.questionId === "auto"), false);
});

test("la somme des critères humains ne peut jamais dépasser manualPoints", () => {
  const question = reviewQuestion({
    id: "hybrid",
    gradingMode: "hybrid",
    points: 5,
    autoPoints: 2,
    autoPointsAwarded: 2,
    manualPoints: 3,
    rubricCriteria: [
      { id: "method", label: "Méthode", pointsMax: 1 },
      { id: "proof", label: "Preuve", pointsMax: 2 },
    ],
  });
  const drafts = createHomeworkReviewDrafts(reviewDetail([question]));
  drafts.hybrid.criteria.method = 1;
  drafts.hybrid.criteria.proof = 2.25;
  const errors = validateHomeworkReviewDrafts([question], drafts);
  assert.match(errors.hybrid, /ne peut pas dépasser 3 points/);
});

test("une réponse libre non remise reste à zéro et n’est pas envoyée à la revue", () => {
  const unanswered = reviewQuestion({
    id: "unanswered",
    studentAnswer: null,
    attachmentUrls: [],
    manualPoints: 4,
    rubricCriteria: [{ id: "proof", label: "Preuve", pointsMax: 4 }],
  });
  const answered = reviewQuestion({
    id: "answered",
    manualPoints: 4,
    rubricCriteria: [{ id: "proof", label: "Preuve", pointsMax: 4 }],
  });
  const detail = reviewDetail([unanswered, answered]);
  const drafts = createHomeworkReviewDrafts(detail);
  assert.deepEqual(Object.keys(drafts), ["answered"]);
  assert.equal(calculateHomeworkReviewTotals(detail.questions, drafts).manualMaximum, 4);
  const payload = createHomeworkReviewPayload(detail.questions, drafts, "");
  assert.deepEqual(payload.reviews.map((review) => review.questionId), ["answered"]);
});

test("l’administration retrouve les devoirs après F5 et publie le corrigé seulement après fermeture", () => {
  const importerSource = readFileSync(
    `${projectRoot}/apps/web/src/features/admin/homework/HomeworkPackageImporter.tsx`,
    "utf8",
  );
  const managerSource = readFileSync(
    `${projectRoot}/apps/web/src/features/admin/homework/HomeworkPublicationManager.tsx`,
    "utf8",
  );
  const workspaceSource = readFileSync(
    `${projectRoot}/apps/web/src/features/admin/homework/HomeworkReviewWorkspace.tsx`,
    "utf8",
  );
  const apiSource = readFileSync(
    `${projectRoot}/apps/web/src/features/admin/homework/homeworkReviewApi.ts`,
    "utf8",
  );

  assert.doesNotMatch(importerSource, /disabled=\{!homework\.subjectPublished\}/);
  assert.match(importerSource, /Fermer le sujet avant le corrigé/);
  assert.match(workspaceSource, /Publier les devoirs/);
  assert.match(workspaceSource, /HomeworkPublicationManager/);
  assert.match(workspaceSource, /setHomeworkPublication\(detail\.homework\.id, payload\)/);
  assert.match(workspaceSource, /Cette action vise exactement la version utilisée par cette copie/);
  assert.match(apiSource, /useAdminHomeworkCatalog/);
  assert.match(apiSource, /apiRequest<\{ items: HomeworkSummary\[\] \}>\("\/homeworks"/);
  assert.match(managerSource, /Ferme d’abord le sujet/);
  assert.match(managerSource, /correctionsPublished: !homework\.correctionsPublished/);
  assert.match(managerSource, /homework\.editorialStatus === "archived"/);
  assert.match(managerSource, /Version archivée/);
  assert.match(managerSource, /setHomeworkPublication\(intent\.homework\.id, intent\.payload\)/);
  assert.doesNotMatch(managerSource, /stableId \|\| intent\.homework\.slug/);
  assert.match(managerSource, /subjectPublished: false, correctionsPublished: false/);
});
