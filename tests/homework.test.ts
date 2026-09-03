import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

const testDirectoryPrefix = resolve(tmpdir(), "excellence-homework-test-");
const testDirectory = mkdtempSync(join(tmpdir(), "excellence-homework-test-"));

process.env.NODE_ENV = "test";
process.env.SUPABASE_URL = "";
process.env.SUPABASE_PUBLISHABLE_KEY = "";
process.env.SUPABASE_ANON_KEY = "";
process.env.DATABASE_PATH = join(testDirectory, "homework.sqlite");
process.env.JWT_SECRET = "test-only-homework-jwt-secret-that-is-long-enough";
process.env.RESEND_API_KEY = "";
process.env.EMAIL_FROM = "";

type TestUser = {
  id: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "content_editor" | "admin";
  accountType: "student" | "parent" | "teacher";
  levelId: string;
};

const admin: TestUser = {
  id: "10000000-0000-4000-8000-000000000001",
  email: "admin.homework@example.test",
  name: "Administration",
  role: "admin",
  accountType: "student",
  levelId: "terminale-a",
};
const learner: TestUser = {
  id: "10000000-0000-4000-8000-000000000002",
  email: "learner.homework@example.test",
  name: "Awa Élève",
  role: "student",
  accountType: "student",
  levelId: "terminale-c",
};
const otherLearner: TestUser = {
  id: "10000000-0000-4000-8000-000000000003",
  email: "other.homework@example.test",
  name: "Koffi Élève",
  role: "student",
  accountType: "student",
  levelId: "terminale-d",
};
const parent: TestUser = {
  id: "10000000-0000-4000-8000-000000000004",
  email: "parent.homework@example.test",
  name: "Compte parent",
  role: "student",
  accountType: "parent",
  levelId: "terminale-c",
};
const teacher: TestUser = {
  id: "10000000-0000-4000-8000-000000000005",
  email: "teacher.homework@example.test",
  name: "Compte enseignant",
  role: "teacher",
  accountType: "teacher",
  levelId: "terminale-c",
};
const editor: TestUser = {
  id: "10000000-0000-4000-8000-000000000006",
  email: "editor.homework@example.test",
  name: "Compte éditeur",
  role: "content_editor",
  accountType: "teacher",
  levelId: "terminale-c",
};

let app: Awaited<ReturnType<(typeof import("../apps/api/src/app.ts"))["buildApp"]>>;
let database: (typeof import("../apps/api/src/database.ts"))["database"];

function authorization(user: TestUser) {
  return { authorization: `Bearer ${app.jwt.sign({ sub: user.id, email: user.email, role: user.role })}` };
}

async function request(
  user: TestUser,
  options: { method: "GET" | "POST" | "PUT" | "PATCH"; url: string; payload?: unknown },
) {
  const response = await app.inject({ ...options, headers: authorization(user) });
  const body = response.body ? response.json() as Record<string, any> : {};
  return { response, body };
}

function packagePayload(importId = "20000000-0000-4000-8000-000000000001", title = "Devoir synthétique de contrat") {
  return {
    importId,
    stableId: "contract-homework-terminale-c-mathematics-1",
    slug: "contract-homework-terminale-c-mathematics-1",
    title,
    number: 1,
    institution: "Établissement de test",
    academicYear: "2025-2026",
    subject: { id: "mathematics", name: "Mathématiques", icon: "📐" },
    level: { id: "terminale-c", name: "Terminale C" },
    series: { id: "c", name: "C" },
    durationSeconds: 3_600,
    gradingMode: "hybrid",
    sourceNotice: "Paquet synthétique sans contenu pédagogique réel, réservé au contrat API.",
    instructionsMarkdown: "Sujet synthétique réservé aux tests automatisés.",
    maxAttempts: 3,
    subjectPublished: false,
    correctionsPublished: false,
    sections: [{
      id: "mathematics",
      title: "Mathématiques",
      order: 1,
      exercises: [{
        id: "exercise-1",
        title: "Exercice 1",
        order: 1,
        instructionsMarkdown: "Utiliser uniquement les hypothèses annoncées dans cet exercice synthétique.",
        questions: [
          {
            id: "question-choice",
            label: "1",
            promptMarkdown: "Choisir la valeur de $1+1$.",
            type: "qcm",
            answerKind: "single-choice",
            gradingMode: "auto",
            points: 2,
            autoPoints: 2,
            manualPoints: 0,
            choices: [
              { id: "A", label: "A", contentMarkdown: "1" },
              { id: "B", label: "B", contentMarkdown: "2" },
              { id: "C", label: "C", contentMarkdown: "3" },
            ],
            expectedAnswer: "B",
            explanationMarkdown: "On additionne une unité à une unité, ce qui donne exactement deux unités.",
          },
          {
            id: "question-hybrid-proof",
            label: "2",
            promptMarkdown: "Donner le résultat final puis démontrer l’égalité demandée.",
            type: "texte",
            answerKind: "formula",
            gradingMode: "hybrid",
            points: 8,
            autoPoints: 2,
            manualPoints: 6,
            expectedAnswer: ["\\frac{3}{2}\\alpha", "3\\alpha/2"],
            sourceNotice: "Question hybride synthétique utilisée pour vérifier la correction en deux temps.",
            explanationMarkdown: "La correction sépare le résultat final des étapes logiques de la démonstration.",
            rubricCriteria: [
              { id: "method", label: "Méthode adaptée et explicitée", pointsMax: 3 },
              { id: "logic", label: "Enchaînement logique et conclusion", pointsMax: 3 },
            ],
          },
          {
            id: "question-manual-proof",
            label: "3",
            promptMarkdown: "Rédiger une justification complète.",
            type: "texte",
            answerKind: "essay",
            gradingMode: "manual",
            points: 10,
            autoPoints: 0,
            manualPoints: 10,
            explanationMarkdown: "Une justification complète annonce les hypothèses, déroule les étapes et formule la conclusion.",
            rubricCriteria: [
              { id: "setup", label: "Hypothèses et démarche", pointsMax: 4 },
              { id: "proof", label: "Démonstration et conclusion", pointsMax: 6 },
            ],
          },
        ],
      }],
    }],
  };
}

test.before(async () => {
  const appModule = await import("../apps/api/src/app.ts");
  const databaseModule = await import("../apps/api/src/database.ts");
  app = await appModule.buildApp();
  database = databaseModule.database;
  const insert = database.prepare(`
    INSERT INTO users (
      id, email, password_hash, name, role, audience, level_id,
      photo_url, email_verified_at, created_at, updated_at
    ) VALUES (?, ?, 'unused', ?, ?, ?, ?, NULL, ?, ?, ?)
  `);
  const now = new Date().toISOString();
  for (const user of [admin, learner, otherLearner, parent, teacher, editor]) {
    insert.run(user.id, user.email, user.name, user.role, user.accountType, user.levelId, now, now, now);
  }
});

test.after(async () => {
  await app?.close();
  database?.close();
  const resolvedDirectory = resolve(testDirectory);
  assert.ok(resolvedDirectory.startsWith(testDirectoryPrefix) && resolvedDirectory !== resolve(tmpdir()));
  rmSync(resolvedDirectory, { recursive: true, force: true });
});

test("a hybrid homework is imported privately, graded in two phases and revealed only after publication", async () => {
  const forbiddenImport = await request(learner, {
    method: "POST",
    url: "/homeworks/admin/import",
    payload: packagePayload(),
  });
  assert.equal(forbiddenImport.response.statusCode, 403);

  const invalid = packagePayload("20000000-0000-4000-8000-000000000099");
  invalid.sections[0].exercises[0].questions[1].manualPoints = 5;
  const invalidImport = await request(admin, { method: "POST", url: "/homeworks/admin/import", payload: invalid });
  assert.equal(invalidImport.response.statusCode, 400);
  assert.match(invalidImport.body.message, /autoPoints \+ manualPoints/);

  const imported = await request(admin, {
    method: "POST",
    url: "/homeworks/admin/import",
    payload: { package: packagePayload(), publish: false },
  });
  assert.equal(imported.response.statusCode, 201);
  assert.equal(imported.body.imported, true);
  assert.equal(imported.body.version, 1);
  assert.equal(imported.body.homework.subjectPublished, false);

  const repeated = await request(admin, {
    method: "POST",
    url: "/homeworks/admin/import",
    payload: packagePayload(),
  });
  assert.equal(repeated.response.statusCode, 200);
  assert.equal(repeated.body.imported, false);
  assert.equal(repeated.body.version, 1);

  const changedSameImport = await request(admin, {
    method: "POST",
    url: "/homeworks/admin/import",
    payload: packagePayload(undefined, "Même clé d’import, contenu différent"),
  });
  assert.equal(changedSameImport.response.statusCode, 409);
  assert.equal(changedSameImport.body.error, "HOMEWORK_IMPORT_ID_CONFLICT");

  const closedLibrary = await request(learner, { method: "GET", url: "/homeworks" });
  assert.deepEqual(closedLibrary.body.items, []);
  for (const blockedActor of [parent, teacher, editor]) {
    const blockedLibrary = await request(blockedActor, { method: "GET", url: "/homeworks" });
    assert.equal(blockedLibrary.response.statusCode, 403);
    assert.equal(blockedLibrary.body.error, "HOMEWORK_COMPOSITION_FORBIDDEN");
  }

  const opened = await request(admin, {
    method: "PATCH",
    url: "/homeworks/admin/contract-homework-terminale-c-mathematics-1/publication",
    payload: { subjectPublished: true },
  });
  assert.equal(opened.response.statusCode, 200);
  assert.equal(opened.body.homework.subjectPublished, true);

  const wrongClass = await request(otherLearner, {
    method: "GET",
    url: "/homeworks/contract-homework-terminale-c-mathematics-1",
  });
  assert.equal(wrongClass.response.statusCode, 403);
  assert.equal(wrongClass.body.error, "HOMEWORK_ACCESS_DENIED");

  const metadataOnly = await request(learner, {
    method: "GET",
    url: "/homeworks/contract-homework-terminale-c-mathematics-1",
  });
  assert.equal(metadataOnly.response.statusCode, 200);
  assert.deepEqual(metadataOnly.body.homework.sections, []);
  assert.equal(metadataOnly.body.homework.exerciseCount, 1);
  assert.equal(metadataOnly.body.homework.questionCount, 3);
  assert.equal(metadataOnly.body.homework.scoreMax, 20);

  for (const blockedActor of [parent, teacher, editor]) {
    const blockedDetail = await request(blockedActor, {
      method: "GET",
      url: "/homeworks/contract-homework-terminale-c-mathematics-1",
    });
    assert.equal(blockedDetail.response.statusCode, 403);
    assert.equal(blockedDetail.body.error, "HOMEWORK_COMPOSITION_FORBIDDEN");
  }

  const started = await request(learner, {
    method: "POST",
    url: "/homeworks/contract-homework-terminale-c-mathematics-1/attempts",
  });
  assert.equal(started.response.statusCode, 201);
  const attemptId = started.body.attempt.id as string;
  const subject = started;
  assert.equal(subject.body.homework.id, started.body.attempt.homeworkId);
  assert.equal(subject.body.homework.sourceNotice, packagePayload().sourceNotice);
  assert.equal(
    subject.body.homework.sections[0].exercises[0].instructionsMarkdown,
    packagePayload().sections[0].exercises[0].instructionsMarkdown,
  );
  const questions = subject.body.homework.sections[0].exercises[0].questions;
  assert.equal(questions.length, 3);
  assert.equal(questions[1].gradingMode, "hybrid");
  assert.equal(questions[1].autoPoints, 2);
  assert.equal(questions[1].manualPoints, 6);
  assert.equal(questions[1].sourceNotice, packagePayload().sections[0].exercises[0].questions[1].sourceNotice);
  assert.equal("expectedAnswer" in questions[1], false);
  assert.equal("explanationMarkdown" in questions[1], false);
  const [choiceId, hybridId, manualId] = questions.map((question: any) => question.id as string);

  const resumed = await request(learner, {
    method: "POST",
    url: "/homeworks/contract-homework-terminale-c-mathematics-1/attempts",
  });
  assert.equal(resumed.body.attempt.id, attemptId);
  assert.equal(resumed.body.homework.id, started.body.homework.id);

  for (const blockedActor of [parent, teacher, editor]) {
    const blockedStart = await request(blockedActor, {
      method: "POST",
      url: "/homeworks/contract-homework-terminale-c-mathematics-1/attempts",
    });
    assert.equal(blockedStart.response.statusCode, 403);
    assert.equal(blockedStart.body.error, "HOMEWORK_COMPOSITION_FORBIDDEN");
  }
  const blockedSave = await request(parent, {
    method: "PUT",
    url: `/homeworks/attempts/${attemptId}/answers/${choiceId}`,
    payload: { answer: "B", attachmentUrls: [] },
  });
  assert.equal(blockedSave.response.statusCode, 403);
  assert.equal(blockedSave.body.error, "HOMEWORK_COMPOSITION_FORBIDDEN");
  const blockedDelete = await request(parent, {
    method: "DELETE",
    url: `/homeworks/attempts/${attemptId}/answers/${choiceId}`,
  });
  assert.equal(blockedDelete.response.statusCode, 403);
  assert.equal(blockedDelete.body.error, "HOMEWORK_COMPOSITION_FORBIDDEN");
  const blockedFinalize = await request(parent, {
    method: "POST",
    url: `/homeworks/attempts/${attemptId}/finalize`,
  });
  assert.equal(blockedFinalize.response.statusCode, 403);
  assert.equal(blockedFinalize.body.error, "HOMEWORK_COMPOSITION_FORBIDDEN");
  const adminPreview = await request(admin, {
    method: "GET",
    url: "/homeworks/contract-homework-terminale-c-mathematics-1",
  });
  assert.equal(adminPreview.response.statusCode, 200);
  assert.equal(adminPreview.body.homework.sections[0].exercises[0].questions.length, 3);

  for (const questionId of [hybridId, manualId]) {
    for (const answer of [null, " \n\t ", {}, { finalAnswer: " ", reasoning: "\t" }]) {
      const emptyAnswer = await request(learner, {
        method: "PUT",
        url: `/homeworks/attempts/${attemptId}/answers/${questionId}`,
        payload: { answer, attachmentUrls: [] },
      });
      assert.equal(emptyAnswer.response.statusCode, 400);
      assert.match(emptyAnswer.body.message, /Ajoute une réponse ou une pièce jointe/);
    }
  }

  for (const attachmentUrls of [[], ["https://example.test/copies/hybrid-proof.pdf"]]) {
    const hybridWithoutFinalAnswer = await request(learner, {
      method: "PUT",
      url: `/homeworks/attempts/${attemptId}/answers/${hybridId}`,
      payload: {
        answer: { finalAnswer: " \t ", reasoning: "Une démarche rédigée mais aucun résultat final." },
        attachmentUrls,
      },
    });
    assert.equal(hybridWithoutFinalAnswer.response.statusCode, 400);
    assert.equal(hybridWithoutFinalAnswer.body.error, "INVALID_HOMEWORK_HYBRID_ANSWER");
  }

  const { HomeworkOperationError, saveLocalHomeworkAnswer } = await import("../apps/api/src/homework.ts");
  for (const answer of [" \n\t ", {}, { finalAnswer: " ", reasoning: "\t" }]) {
    assert.throws(
      () => saveLocalHomeworkAnswer(learner, attemptId, manualId, answer, []),
      (error: unknown) => error instanceof HomeworkOperationError && error.code === "EMPTY_HOMEWORK_ANSWER",
    );
  }

  const attachmentOnly = await request(learner, {
    method: "PUT",
    url: `/homeworks/attempts/${attemptId}/answers/${manualId}`,
    payload: { answer: null, attachmentUrls: ["https://example.test/copies/manual-proof.pdf"] },
  });
  assert.equal(attachmentOnly.response.statusCode, 200);

  for (const [questionId, answer] of [
    [choiceId, "B"],
    [hybridId, { finalAnswer: "1,5 α", reasoning: "Je déroule ici une démonstration structurée." }],
    [manualId, { reasoning: "J’annonce les hypothèses, la méthode, puis je conclus." }],
  ] as const) {
    const saved = await request(learner, {
      method: "PUT",
      url: `/homeworks/attempts/${attemptId}/answers/${questionId}`,
      payload: { answer, attachmentUrls: [] },
    });
    assert.equal(saved.response.statusCode, 200);
    assert.equal("correct" in saved.body, false);
    assert.equal("expectedAnswer" in saved.body, false);
  }

  const finalized = await request(learner, {
    method: "POST",
    url: `/homeworks/attempts/${attemptId}/finalize`,
  });
  assert.equal(finalized.response.statusCode, 200);
  assert.equal(finalized.body.result.status, "awaiting-review");
  assert.equal(finalized.body.result.autoGradedPoints, undefined);
  assert.equal(finalized.body.result.pendingManualPoints, 16);
  assert.equal(finalized.body.result.provisionalScoreOutOf20, undefined);
  assert.equal(finalized.body.result.scoreOutOf20, undefined);
  assert.equal(finalized.body.result.correctionsAvailable, false);
  assert.equal(finalized.body.result.corrections, undefined);

  const prematureCorrections = await request(admin, {
    method: "PATCH",
    url: "/homeworks/admin/contract-homework-terminale-c-mathematics-1/publication",
    payload: { correctionsPublished: true },
  });
  assert.equal(prematureCorrections.response.statusCode, 409);
  assert.equal(prematureCorrections.body.error, "HOMEWORK_CORRECTION_REQUIRES_CLOSED_SUBJECT");

  const closedBeforeCorrection = await request(admin, {
    method: "PATCH",
    url: "/homeworks/admin/contract-homework-terminale-c-mathematics-1/publication",
    payload: { subjectPublished: false },
  });
  assert.equal(closedBeforeCorrection.response.statusCode, 200);

  const pendingReviewCorrections = await request(admin, {
    method: "PATCH",
    url: "/homeworks/admin/contract-homework-terminale-c-mathematics-1/publication",
    payload: { correctionsPublished: true },
  });
  assert.equal(pendingReviewCorrections.response.statusCode, 409);
  assert.equal(pendingReviewCorrections.body.error, "HOMEWORK_REVIEWS_PENDING");

  const adminCopy = await request(admin, {
    method: "GET",
    url: `/homeworks/admin/attempts/${attemptId}`,
  });
  assert.equal(adminCopy.response.statusCode, 200);
  const reviewQuestions = adminCopy.body.review.questions as any[];
  assert.equal(reviewQuestions.find((question) => question.id === hybridId).autoPointsAwarded, 2);
  assert.deepEqual(
    reviewQuestions.find((question) => question.id === hybridId).expectedAnswer,
    ["\\frac{3}{2}\\alpha", "3\\alpha/2"],
  );

  const reviewed = await request(admin, {
    method: "PUT",
    url: `/homeworks/admin/attempts/${attemptId}/review`,
    payload: {
      reviews: [
        {
          questionId: hybridId,
          pointsAwarded: 5,
          comment: "Bonne démarche ; la conclusion pouvait être plus explicite.",
          criteria: [{ id: "method", pointsAwarded: 3 }, { id: "logic", pointsAwarded: 2 }],
        },
        {
          questionId: manualId,
          pointsAwarded: 9,
          comment: "Rédaction claire et presque complète.",
          criteria: [{ id: "setup", pointsAwarded: 4 }, { id: "proof", pointsAwarded: 5 }],
        },
      ],
      overallComment: "Très bonne copie.",
    },
  });
  assert.equal(reviewed.response.statusCode, 200);
  assert.equal(reviewed.body.result.status, "graded");
  assert.equal(reviewed.body.result.scoreOutOf20, 18);
  assert.equal(reviewed.body.result.correctionsAvailable, true);

  const hiddenAfterReview = await request(learner, {
    method: "GET",
    url: `/homeworks/attempts/${attemptId}/result`,
  });
  assert.equal(hiddenAfterReview.body.result.scoreOutOf20, undefined);
  assert.equal(hiddenAfterReview.body.result.autoGradedPoints, undefined);
  assert.equal(hiddenAfterReview.body.result.correctionsAvailable, false);
  assert.equal(hiddenAfterReview.body.result.corrections, undefined);

  const publishedCorrections = await request(admin, {
    method: "PATCH",
    url: "/homeworks/admin/contract-homework-terminale-c-mathematics-1/publication",
    payload: { correctionsPublished: true },
  });
  assert.equal(publishedCorrections.response.statusCode, 200);

  const visibleResult = await request(learner, {
    method: "GET",
    url: `/homeworks/attempts/${attemptId}/result`,
  });
  assert.equal(visibleResult.body.result.correctionsAvailable, true);
  assert.equal(visibleResult.body.result.autoGradedPoints, 4);
  assert.equal(visibleResult.body.result.scoreOutOf20, 18);
  assert.equal(visibleResult.body.result.corrections.length, 3);
  const hybridCorrection = visibleResult.body.result.corrections.find((entry: any) => entry.questionId === hybridId);
  assert.equal(hybridCorrection.label, "2");
  assert.equal(hybridCorrection.promptMarkdown, packagePayload().sections[0].exercises[0].questions[1].promptMarkdown);
  const choiceCorrection = visibleResult.body.result.corrections.find((entry: any) => entry.questionId === choiceId);
  assert.deepEqual(choiceCorrection.choices, packagePayload().sections[0].exercises[0].questions[0].choices);
  assert.equal(hybridCorrection.pointsAwarded, 7);
  assert.deepEqual(hybridCorrection.rubricCriteria.map((criterion: any) => criterion.pointsAwarded), [3, 2]);

  const reopenedWithoutCorrection = await request(admin, {
    method: "PATCH",
    url: "/homeworks/admin/contract-homework-terminale-c-mathematics-1/publication",
    payload: { subjectPublished: true, correctionsPublished: false },
  });
  assert.equal(reopenedWithoutCorrection.response.statusCode, 200);

  const secondAttempt = await request(learner, {
    method: "POST",
    url: "/homeworks/contract-homework-terminale-c-mathematics-1/attempts",
  });
  assert.equal(secondAttempt.response.statusCode, 201);
  const secondAttemptId = secondAttempt.body.attempt.id as string;
  database.prepare("UPDATE homework_attempts SET expires_at = ? WHERE id = ?")
    .run(new Date(Date.now() - 1_000).toISOString(), secondAttemptId);
  const resumedAfterDeadline = await request(learner, {
    method: "POST",
    url: "/homeworks/contract-homework-terminale-c-mathematics-1/attempts",
  });
  assert.equal(resumedAfterDeadline.response.statusCode, 201);
  assert.equal(resumedAfterDeadline.body.attempt.id, secondAttemptId);
  assert.equal(resumedAfterDeadline.body.attempt.status, "graded");
  assert.deepEqual(resumedAfterDeadline.body.homework.sections, []);
  const expired = await request(learner, {
    method: "GET",
    url: `/homeworks/attempts/${secondAttemptId}/result`,
  });
  assert.equal(expired.response.statusCode, 200);
  assert.equal(expired.body.result.status, "graded");
  assert.equal(expired.body.result.scoreOutOf20, undefined);

  const thirdAttempt = await request(learner, {
    method: "POST",
    url: "/homeworks/contract-homework-terminale-c-mathematics-1/attempts",
  });
  assert.equal(thirdAttempt.response.statusCode, 201);
  const thirdAttemptId = thirdAttempt.body.attempt.id as string;

  const blockedWhileAttemptActive = await request(admin, {
    method: "PATCH",
    url: "/homeworks/admin/contract-homework-terminale-c-mathematics-1/publication",
    payload: { subjectPublished: false, correctionsPublished: true },
  });
  assert.equal(blockedWhileAttemptActive.response.statusCode, 409);
  assert.equal(blockedWhileAttemptActive.body.error, "HOMEWORK_ATTEMPTS_ACTIVE");

  const secondVersion = await request(admin, {
    method: "POST",
    url: "/homeworks/admin/import",
    payload: packagePayload("20000000-0000-4000-8000-000000000002", "Devoir synthétique de contrat — version 2"),
  });
  assert.equal(secondVersion.response.statusCode, 201);
  assert.equal(secondVersion.body.version, 2);
  assert.equal(secondVersion.body.homework.subjectPublished, false);

  const openedSecondVersion = await request(admin, {
    method: "PATCH",
    url: "/homeworks/admin/contract-homework-terminale-c-mathematics-1/publication",
    payload: { subjectPublished: true },
  });
  assert.equal(openedSecondVersion.response.statusCode, 200);

  const adminVersions = await request(admin, {
    method: "GET",
    url: "/homeworks?levelId=terminale-c",
  });
  const versionedEntries = adminVersions.body.items
    .filter((item: any) => item.stableId === "contract-homework-terminale-c-mathematics-1");
  assert.deepEqual(
    versionedEntries.map((item: any) => [item.version, item.editorialStatus]),
    [[2, "published"], [1, "archived"]],
  );

  const currentDefinition = await request(learner, {
    method: "GET",
    url: "/homeworks/contract-homework-terminale-c-mathematics-1",
  });
  assert.equal(currentDefinition.response.statusCode, 200);
  assert.equal(currentDefinition.body.homework.id, started.body.homework.id);
  assert.equal(currentDefinition.body.homework.title, packagePayload().title);
  assert.equal(currentDefinition.body.homework.activeAttemptId, thirdAttemptId);
  assert.equal(currentDefinition.body.homework.latestAttemptId, secondAttemptId);
  const resumedQuestionIds = currentDefinition.body.homework.sections[0].exercises[0].questions
    .map((question: any) => question.id);
  assert.deepEqual(resumedQuestionIds, [choiceId, hybridId, manualId]);

  const savedAfterRepublication = await request(learner, {
    method: "PUT",
    url: `/homeworks/attempts/${thirdAttemptId}/answers/${choiceId}`,
    payload: { answer: "B", attachmentUrls: [] },
  });
  assert.equal(savedAfterRepublication.response.statusCode, 200);
  assert.equal(savedAfterRepublication.body.saved, true);

  const currentLibrary = await request(learner, { method: "GET", url: "/homeworks" });
  assert.equal(currentLibrary.response.statusCode, 200);
  assert.equal(currentLibrary.body.items[0].activeAttemptId, thirdAttemptId);
  assert.equal(currentLibrary.body.items[0].latestAttemptId, secondAttemptId);
  assert.equal(currentLibrary.body.items[0].attemptsUsed, 3);

  const resumedAcrossVersions = await request(learner, {
    method: "POST",
    url: "/homeworks/contract-homework-terminale-c-mathematics-1/attempts",
  });
  assert.equal(resumedAcrossVersions.response.statusCode, 201);
  assert.equal(resumedAcrossVersions.body.attempt.id, thirdAttemptId);
  assert.equal(resumedAcrossVersions.body.attempt.homeworkId, started.body.attempt.homeworkId);
  assert.equal(resumedAcrossVersions.body.homework.id, started.body.homework.id);
  assert.deepEqual(
    resumedAcrossVersions.body.homework.sections[0].exercises[0].questions.map((question: any) => question.id),
    [choiceId, hybridId, manualId],
  );
  database.prepare("UPDATE homework_attempts SET expires_at = ? WHERE id = ?")
    .run(new Date(Date.now() - 1_000).toISOString(), thirdAttemptId);
  const autoSubmittedAcrossVersions = await request(learner, {
    method: "POST",
    url: "/homeworks/contract-homework-terminale-c-mathematics-1/attempts",
  });
  assert.equal(autoSubmittedAcrossVersions.response.statusCode, 201);
  assert.equal(autoSubmittedAcrossVersions.body.attempt.id, thirdAttemptId);
  assert.equal(autoSubmittedAcrossVersions.body.attempt.status, "graded");
  assert.equal(autoSubmittedAcrossVersions.body.homework.id, started.body.homework.id);
  assert.equal(autoSubmittedAcrossVersions.body.homework.title, packagePayload().title);
  assert.deepEqual(autoSubmittedAcrossVersions.body.homework.sections, []);
  const historicalResult = await request(learner, {
    method: "GET",
    url: `/homeworks/attempts/${attemptId}/result`,
  });
  assert.equal(historicalResult.response.statusCode, 200);
  assert.equal(historicalResult.body.result.homeworkId, started.body.homework.id);
  assert.equal(historicalResult.body.result.scoreOutOf20, undefined);
});

test("a saved answer can be cleared, stays cleared after resume, and an expired flush auto-submits", async () => {
  const clearable: any = packagePayload(
    "20000000-0000-4000-8000-000000000040",
    "Devoir effacement et expiration",
  );
  clearable.stableId = "contract-homework-answer-clearing";
  clearable.slug = "contract-homework-answer-clearing";
  clearable.number = 10;
  clearable.institution = "Lycée Effacement";
  clearable.gradingMode = "auto";
  clearable.maxAttempts = 1;
  clearable.subjectPublished = true;
  clearable.sections[0].exercises[0].questions = [
    clearable.sections[0].exercises[0].questions[0],
  ];

  const imported = await request(admin, {
    method: "POST",
    url: "/homeworks/admin/import",
    payload: clearable,
  });
  assert.equal(imported.response.statusCode, 201);
  const started = await request(learner, {
    method: "POST",
    url: "/homeworks/contract-homework-answer-clearing/attempts",
  });
  assert.equal(started.response.statusCode, 201);
  const attemptId = started.body.attempt.id as string;
  const questionId = started.body.homework.sections[0].exercises[0].questions[0].id as string;

  const saved = await request(learner, {
    method: "PUT",
    url: `/homeworks/attempts/${attemptId}/answers/${questionId}`,
    payload: { answer: "B", attachmentUrls: [] },
  });
  assert.equal(saved.response.statusCode, 200);
  const cleared = await request(learner, {
    method: "DELETE",
    url: `/homeworks/attempts/${attemptId}/answers/${questionId}`,
  });
  assert.equal(cleared.response.statusCode, 200);
  assert.equal(cleared.body.deleted, true);

  const resumed = await request(learner, {
    method: "POST",
    url: "/homeworks/contract-homework-answer-clearing/attempts",
  });
  assert.equal(resumed.response.statusCode, 201);
  assert.equal(resumed.body.attempt.id, attemptId);
  assert.equal(questionId in resumed.body.attempt.answers, false);
  assert.equal(resumed.body.attempt.answeredCount, 0);

  database.prepare("UPDATE homework_attempts SET expires_at = ? WHERE id = ?")
    .run(new Date(Date.now() - 1_000).toISOString(), attemptId);
  const lateFlush = await request(learner, {
    method: "PUT",
    url: `/homeworks/attempts/${attemptId}/answers/${questionId}`,
    payload: { answer: "B", attachmentUrls: [] },
  });
  assert.equal(lateFlush.response.statusCode, 409);
  assert.equal(lateFlush.body.error, "HOMEWORK_TIME_EXPIRED");
  assert.equal(lateFlush.body.attemptStatus, "graded");

  const result = await request(learner, {
    method: "GET",
    url: `/homeworks/attempts/${attemptId}/result`,
  });
  assert.equal(result.response.statusCode, 200);
  assert.equal(result.body.result.status, "graded");
  assert.equal(result.body.result.answeredCount, 0);
});

test("a neutralized question needs no invented answer and never reveals one", async () => {
  const neutralized: any = packagePayload(
    "20000000-0000-4000-8000-000000000010",
    "Devoir synthétique avec question neutralisée",
  );
  neutralized.stableId = "contract-homework-neutralized";
  neutralized.slug = "contract-homework-neutralized";
  neutralized.number = 2;
  neutralized.gradingMode = "auto";
  neutralized.maxAttempts = 1;
  neutralized.sourceNotice = "Provenance synthétique servant uniquement à tester la neutralisation sans fausse réponse.";
  neutralized.sections = [{
    id: "neutralized-section",
    title: "Partie neutralisée",
    order: 1,
    exercises: [{
      id: "neutralized-exercise",
      title: "Exercice neutralisé",
      order: 1,
      instructionsMarkdown: "Cette consigne doit survivre au trajet import, stockage puis lecture publique.",
      questions: [{
        id: "neutralized-question",
        label: "1",
        promptMarkdown: "Choisir une proposition ; la question est neutralisée car la source ne contient aucune réponse juste.",
        type: "qcm",
        answerKind: "single-choice",
        gradingMode: "auto",
        points: 1,
        autoPoints: 1,
        manualPoints: 0,
        isNeutralized: true,
        choices: [
          { id: "A", label: "A", contentMarkdown: "Proposition A" },
          { id: "B", label: "B", contentMarkdown: "Proposition B" },
        ],
        explanationMarkdown: "Le point est accordé à tous, sans créer artificiellement une bonne réponse parmi les choix.",
        sourceNotice: "Question neutralisée : aucune option du document source n’est mathématiquement correcte.",
      }],
    }],
  }];

  const invalid = structuredClone(neutralized);
  invalid.importId = "20000000-0000-4000-8000-000000000011";
  invalid.sections[0].exercises[0].questions[0].expectedAnswer = "A";
  const rejected = await request(admin, {
    method: "POST",
    url: "/homeworks/admin/import",
    payload: invalid,
  });
  assert.equal(rejected.response.statusCode, 400);
  assert.match(rejected.body.message, /neutralisée/i);

  const imported = await request(admin, {
    method: "POST",
    url: "/homeworks/admin/import",
    payload: { package: neutralized, publish: true },
  });
  assert.equal(imported.response.statusCode, 201);

  const subject = await request(learner, {
    method: "GET",
    url: "/homeworks/contract-homework-neutralized",
  });
  assert.equal(subject.response.statusCode, 200);
  assert.deepEqual(subject.body.homework.sections, []);

  const started = await request(learner, {
    method: "POST",
    url: "/homeworks/contract-homework-neutralized/attempts",
  });
  assert.equal(started.response.statusCode, 201);
  assert.equal(started.body.homework.sourceNotice, neutralized.sourceNotice);
  assert.equal(
    started.body.homework.sections[0].exercises[0].instructionsMarkdown,
    neutralized.sections[0].exercises[0].instructionsMarkdown,
  );
  assert.equal(
    started.body.homework.sections[0].exercises[0].questions[0].sourceNotice,
    neutralized.sections[0].exercises[0].questions[0].sourceNotice,
  );
  const attemptId = started.body.attempt.id as string;
  const finalized = await request(learner, {
    method: "POST",
    url: `/homeworks/attempts/${attemptId}/finalize`,
  });
  assert.equal(finalized.body.result.autoGradedPoints, undefined);
  assert.equal(finalized.body.result.scoreOutOf20, undefined);

  await request(admin, {
    method: "PATCH",
    url: "/homeworks/admin/contract-homework-neutralized/publication",
    payload: { subjectPublished: false, correctionsPublished: true },
  });
  const result = await request(learner, {
    method: "GET",
    url: `/homeworks/attempts/${attemptId}/result`,
  });
  assert.equal(result.body.result.autoGradedPoints, 1);
  assert.equal(result.body.result.scoreOutOf20, 20);
  assert.equal(result.body.result.corrections[0].correct, true);
  assert.equal(result.body.result.corrections[0].pointsAwarded, 1);
  assert.equal(result.body.result.answeredCount, 1);
  assert.equal(result.body.result.questionCount, 1);
  assert.equal("expectedAnswer" in result.body.result.corrections[0], false);
});

test("homework identity includes the institution and academic year without hijacking another stable subject", async () => {
  const alpha: any = packagePayload("20000000-0000-4000-8000-000000000020", "Devoir n°7 — Lycée Alpha");
  alpha.stableId = "homework-lycee-alpha-2025-2026-tc-maths-7";
  alpha.slug = "homework-lycee-alpha-2025-2026-tc-maths-7";
  alpha.number = 7;
  alpha.institution = "Lycée Alpha";
  alpha.academicYear = "2025-2026";
  alpha.subjectPublished = true;

  const beta = structuredClone(alpha);
  beta.importId = "20000000-0000-4000-8000-000000000021";
  beta.stableId = "homework-lycee-beta-2026-2027-tc-maths-7";
  beta.slug = "homework-lycee-beta-2026-2027-tc-maths-7";
  beta.title = "Devoir n°7 — Lycée Beta";
  beta.institution = "Lycée Beta";
  beta.academicYear = "2026-2027";

  const [importedAlpha, importedBeta] = await Promise.all([
    request(admin, { method: "POST", url: "/homeworks/admin/import", payload: alpha }),
    request(admin, { method: "POST", url: "/homeworks/admin/import", payload: beta }),
  ]);
  assert.equal(importedAlpha.response.statusCode, 201);
  assert.equal(importedBeta.response.statusCode, 201);
  assert.notEqual(importedAlpha.body.homework.stableId, importedBeta.body.homework.stableId);

  const conflictingIdentity = structuredClone(alpha);
  conflictingIdentity.importId = "20000000-0000-4000-8000-000000000022";
  conflictingIdentity.stableId = "homework-other-stable-same-school-year";
  conflictingIdentity.slug = "homework-other-stable-same-school-year";
  const rejected = await request(admin, {
    method: "POST",
    url: "/homeworks/admin/import",
    payload: conflictingIdentity,
  });
  assert.equal(rejected.response.statusCode, 409);
  assert.equal(rejected.body.error, "HOMEWORK_IDENTITY_CONFLICT");

  const catalog = await request(admin, { method: "GET", url: "/homeworks?levelId=terminale-c" });
  const identities = catalog.body.items
    .filter((item: any) => item.number === 7)
    .map((item: any) => `${item.institution}/${item.academicYear}`)
    .sort();
  assert.deepEqual(identities, ["Lycée Alpha/2025-2026", "Lycée Beta/2026-2027"]);
});

test("the attempt quota and numbering stay attached to the stable homework across versions", async () => {
  const firstVersion: any = packagePayload(
    "20000000-0000-4000-8000-000000000030",
    "Devoir quota stable — version 1",
  );
  firstVersion.stableId = "contract-homework-stable-quota";
  firstVersion.slug = "contract-homework-stable-quota";
  firstVersion.number = 9;
  firstVersion.institution = "Lycée Quota";
  firstVersion.gradingMode = "auto";
  firstVersion.maxAttempts = 2;
  firstVersion.subjectPublished = true;
  firstVersion.sections[0].exercises[0].questions = [
    firstVersion.sections[0].exercises[0].questions[0],
  ];

  const importedV1 = await request(admin, {
    method: "POST",
    url: "/homeworks/admin/import",
    payload: firstVersion,
  });
  assert.equal(importedV1.response.statusCode, 201);
  const attemptV1 = await request(learner, {
    method: "POST",
    url: "/homeworks/contract-homework-stable-quota/attempts",
  });
  assert.equal(attemptV1.body.attempt.attemptNumber, 1);
  await request(learner, {
    method: "POST",
    url: `/homeworks/attempts/${attemptV1.body.attempt.id}/finalize`,
  });

  const secondVersion = structuredClone(firstVersion);
  secondVersion.importId = "20000000-0000-4000-8000-000000000031";
  secondVersion.title = "Devoir quota stable — version 2";
  const importedV2 = await request(admin, {
    method: "POST",
    url: "/homeworks/admin/import",
    payload: secondVersion,
  });
  assert.equal(importedV2.response.statusCode, 201);
  assert.equal(importedV2.body.version, 2);

  const summaryV2 = await request(learner, {
    method: "GET",
    url: "/homeworks/contract-homework-stable-quota",
  });
  assert.equal(summaryV2.body.homework.version, 2);
  assert.equal(summaryV2.body.homework.attemptsUsed, 1);
  assert.equal(summaryV2.body.homework.status, "completed");
  assert.equal(summaryV2.body.homework.latestAttemptId, attemptV1.body.attempt.id);

  const attemptV2 = await request(learner, {
    method: "POST",
    url: "/homeworks/contract-homework-stable-quota/attempts",
  });
  assert.equal(attemptV2.response.statusCode, 201);
  assert.equal(attemptV2.body.attempt.homeworkId, importedV2.body.homework.id);
  assert.equal(attemptV2.body.attempt.attemptNumber, 2);
  await request(learner, {
    method: "POST",
    url: `/homeworks/attempts/${attemptV2.body.attempt.id}/finalize`,
  });

  const quotaReached = await request(learner, {
    method: "POST",
    url: "/homeworks/contract-homework-stable-quota/attempts",
  });
  assert.equal(quotaReached.response.statusCode, 409);
  assert.equal(quotaReached.body.error, "HOMEWORK_ATTEMPT_LIMIT");
});

test("free math answers tolerate keyboard, Unicode, LaTeX and interval variants without accepting ambiguous tuples", async () => {
  const { homeworkAnswersEquivalent, normalizeHomeworkAnswer } = await import("../apps/api/src/homework.ts");

  assert.equal(homeworkAnswersEquivalent("D_g=\\mathbb R", "Dg = ℝ"), true);
  assert.equal(homeworkAnswersEquivalent("\\mathbb R", "R"), true);
  assert.equal(homeworkAnswersEquivalent("[1,1;1,2]", "[1.1, 1.2]"), true);
  assert.equal(homeworkAnswersEquivalent("\\frac{3}{2}\\alpha", "1,5 α"), true);
  assert.equal(homeworkAnswersEquivalent("3α/2", "1.5\\alpha"), true);
  assert.equal(homeworkAnswersEquivalent("m\\neq2", "m≠2"), true);
  assert.equal(homeworkAnswersEquivalent("\\mathbb R\\setminus\\{0;2\\}", "ℝ \\ {0,2}"), true);
  assert.equal(homeworkAnswersEquivalent("α\\approx-0,367934", "-0.3679"), true);
  assert.equal(homeworkAnswersEquivalent("α\\approx-0,367934", "-0.36"), false);
  assert.equal(
    homeworkAnswersEquivalent(
      "lim(x->-infinity)=-infinity;lim(x->+infinity)=+infinity",
      "(-∞,+∞)",
    ),
    false,
  );
  assert.equal(normalizeHomeworkAnswer("m≤2\n"), normalizeHomeworkAnswer("m\\leq 2"));
});

test("the Supabase migration exposes the same private, hybrid and reviewed contract", () => {
  const sql = readFileSync(resolve(
    import.meta.dirname,
    "../supabase/migrations/20260903120000_secure_homework_attempts.sql",
  ), "utf8");
  for (const rpc of [
    "import_homework_package_v1",
    "list_homeworks_v1",
    "get_homework_public_v1",
    "start_homework_attempt_v1",
    "save_homework_answer_v1",
    "delete_homework_answer_v1",
    "finalize_homework_attempt_v1",
    "get_homework_result_v1",
    "list_homework_reviews_v1",
    "get_homework_review_v1",
    "review_homework_attempt_v1",
    "set_homework_publication_v1",
  ]) {
    assert.match(sql, new RegExp(`create or replace function public\\.${rpc}\\b`));
  }
  assert.match(sql, /homework_auto_points \+ homework_manual_points - homework_points/);
  assert.match(sql, /v_mode = 'hybrid'.*v_auto <= 0 or v_manual <= 0 or v_type <> 'texte'/s);
  assert.match(sql, /homework_neutralized_expected_answer_forbidden/);
  assert.match(sql, /case when q\.homework_neutralized then 'expectedAnswer' else '' end/);
  assert.match(sql, /v_profile\.role <> 'student' or v_profile\.account_type <> 'student'/);
  assert.match(sql, /homework_exercise_instructions_markdown/);
  assert.match(sql, /homework_source_notice/);
  assert.match(sql, /'exerciseCount', v_exercise_count/);
  assert.match(sql, /'scoreMax', 20/);
  assert.match(sql, /'version', v_quiz\.version_devoir/);
  assert.match(sql, /'editorialStatus', case/);
  assert.match(sql, /public\.is_admin\(\)\s+or \(\s+q\.statut_editorial = 'publie' and q\.published/);
  assert.match(sql, /count\(\*\) filter \(where q\.homework_neutralized or r\.id is not null\)/);
  assert.match(sql, /homework_corrections_published and v_attempt\.homework_review_status <> 'pending'/);
  assert.match(sql, /homework_review_status = 'pending'/);
  assert.match(sql, /perform public\.finalize_homework_attempt_internal_v1\(v_attempt\.id\)/);
  assert.match(sql, /drop constraint if exists devoirs_editoriaux_matiere_id_serie_id_numero_key/);
  assert.match(sql, /drop index if exists public\.uniq_quiz_devoir_numero_publie/);
  assert.match(sql, /devoirs_editoriaux_homework_identity_idx[\s\S]*lower\(btrim\(institution\)\)[\s\S]*academic_year/);
  assert.match(sql, /attempt_devoir\.homework_stable_id = v_devoir\.homework_stable_id/);
  assert.doesNotMatch(sql, /Adopte proprement l'entité/);
  assert.match(sql, /homework_payload_hash/);
  assert.match(sql, /v_existing\.homework_payload_hash is distinct from v_payload_hash/);
  assert.match(sql, /homework_identity_conflict/);
  assert.match(sql, /create policy "questions_select_admin"[\s\S]*using \(public\.is_admin\(\)\)/);
  assert.match(sql, /create policy "tentatives_select_own"[\s\S]*q\.homework_import_id is null/);
  assert.match(sql, /create policy "reponses_select_own"[\s\S]*q\.homework_import_id is null/);
  assert.match(sql, /before insert or update or delete on public\.tentatives/);
  assert.match(sql, /before insert or update or delete on public\.reponses/);
  assert.match(sql, /v_include_questions := true/);
  assert.match(sql, /else\s+v_questions := '\[\]'::jsonb/);
  assert.match(sql, /get_homework_public_v1\(p_homework_ref text\)[\s\S]*?language plpgsql\s+volatile/);
  assert.match(sql, /v_attempt\.date_fin_theorique <= now\(\)[\s\S]*?finalize_homework_attempt_internal_v1\(v_attempt\.id\)[\s\S]*?v_attempt := null/);
  assert.match(sql, /Même contrat qu'en local[\s\S]*?return public\.homework_attempt_json_v1\(v_attempt\.id\)/);
  assert.match(sql, /homework_correction_requires_closed_subject/);
  assert.match(sql, /for v_expired_attempt_id in[\s\S]*?finalize_homework_attempt_internal_v1\(v_expired_attempt_id\)/);
  assert.match(sql, /homework_attempts_active/);
  assert.match(sql, /length\(p_answer::text\) > 60000/);
  assert.match(sql, /length\(url #>> '\{\}'\) > 2048/);
  assert.match(sql, /create or replace function public\.homework_normalize_answer_v1/);
  assert.match(sql, /create or replace function public\.homework_answer_matches_v1/);
  assert.match(sql, /v_correct := public\.homework_answer_matches_v1/);
  assert.match(sql, /revoke all on function public\.homework_answer_matches_v1\(jsonb, text\) from public, anon, authenticated/);
  assert.match(sql, /create or replace function public\.delete_homework_answer_v1\([\s\S]*?delete from public\.reponses[\s\S]*?'deleted', true/);
  assert.match(sql, /revoke all on function public\.delete_homework_answer_v1\(uuid, uuid\) from public, anon/);
  assert.match(sql, /grant execute on function public\.delete_homework_answer_v1\(uuid, uuid\) to authenticated/);
  assert.match(sql, /'autoGradedPoints', case when v_corrections_available/);
  assert.match(sql, /'promptMarkdown', q\.enonce/);
  assert.match(sql, /'choices', q\.homework_choices/);
  assert.match(sql, /alter function public\.answer_question\(uuid, uuid, jsonb\)\s+rename to answer_question_legacy_v1/);
  assert.match(sql, /alter function public\.finalize_tentative\(uuid\)\s+rename to finalize_tentative_legacy_v1/);
  assert.match(sql, /create or replace function public\.answer_question\([\s\S]*?q\.homework_import_id[\s\S]*?secure_homework_rpc_required[\s\S]*?answer_question_legacy_v1/);
  assert.match(sql, /create or replace function public\.finalize_tentative\(p_tentative_id uuid\)[\s\S]*?q\.homework_import_id[\s\S]*?secure_homework_rpc_required[\s\S]*?finalize_tentative_legacy_v1/);
  assert.match(sql, /revoke all on function public\.answer_question_legacy_v1\(uuid, uuid, jsonb\) from public, anon, authenticated/);
  assert.match(sql, /revoke all on function public\.finalize_tentative_legacy_v1\(uuid\) from public, anon, authenticated/);
  const saveBody = sql.slice(
    sql.indexOf("create or replace function public.save_homework_answer_v1"),
    sql.indexOf("create or replace function public.finalize_homework_attempt_v1"),
  );
  assert.match(
    saveBody,
    /jsonb_array_length\(coalesce\(p_attachment_urls, '\[\]'::jsonb\)\) = 0[\s\S]*?p_answer is null[\s\S]*?p_answer = 'null'::jsonb/,
  );
  assert.match(
    saveBody,
    /jsonb_typeof\(p_answer\) = 'string'[\s\S]*?nullif\(btrim\(p_answer #>> '\{\}'\), ''\) is null/,
  );
  assert.match(
    saveBody,
    /jsonb_typeof\(p_answer\) = 'object'[\s\S]*?nullif\(btrim\(coalesce\(p_answer ->> 'finalAnswer', ''\)\), ''\) is null[\s\S]*?nullif\(btrim\(coalesce\(p_answer ->> 'reasoning', ''\)\), ''\) is null/,
  );
  assert.doesNotMatch(saveBody, /'expectedAnswer'|'explanationMarkdown'|'correct'/);
  const publicBody = sql.slice(
    sql.indexOf("create or replace function public.get_homework_public_v1"),
    sql.indexOf("create or replace function public.finalize_homework_attempt_internal_v1"),
  );
  assert.doesNotMatch(publicBody, /homework_expected_answer|homework_explanation_markdown|bonnes_reponses|correcte/);
  assert.match(sql, /revoke all on function public\.finalize_homework_attempt_internal_v1\(uuid\) from public, anon, authenticated/);
  assert.match(sql, /notify pgrst, 'reload schema'/);
});
