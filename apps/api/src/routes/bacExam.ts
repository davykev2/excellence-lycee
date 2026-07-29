import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  BAC_CI_2024_EXAM_ID,
  getBacExamAppreciation,
  type BacExamAnswers,
  type BacExamChoice,
  type BacExamCorrectionEntry,
  type BacExamParticipantResult,
  type BacExamState,
} from "../bacExam.js";
import { database, writeAuditLog } from "../database.js";
import {
  getSupabaseBacExamState,
  listSupabaseBacExamParticipantResults,
  setSupabaseBacExamResultsPublished,
  setSupabaseBacExamSubjectPublished,
  submitSupabaseBacExam,
  supabaseConfigured,
  writeSupabaseAudit,
} from "../supabase.js";

const paramsSchema = z.object({
  examId: z.literal(BAC_CI_2024_EXAM_ID),
});

const answerChoiceSchema = z.enum(["A", "B", "C", "D"]);
const submitSchema = z.object({
  answers: z.record(z.string(), answerChoiceSchema),
});
const publicationSchema = z.object({ published: z.boolean() });

interface LocalExamSettingsRow {
  exam_id: string;
  title: string;
  duration_minutes: number;
  question_count: number;
  subject_published: number;
  results_published: number;
  answer_key_json: string;
  corrections_json: string;
}

interface LocalExamSubmissionRow {
  answers_json: string;
  submitted_at: string;
}

interface LocalExamParticipantRow extends LocalExamSubmissionRow {
  user_id: string;
  name: string;
  email: string;
  level_id: string;
  photo_url: string | null;
}

function questionKey(index: number) {
  return `q${String(index).padStart(2, "0")}`;
}

function isCompleteAnswerSet(answers: Record<string, unknown>, questionCount: number) {
  const keys = Object.keys(answers);
  return keys.length === questionCount
    && Array.from({ length: questionCount }, (_, index) => questionKey(index + 1))
      .every((key) => ["A", "B", "C", "D"].includes(String(answers[key])));
}

function isCompleteCorrectionSet(corrections: Record<string, unknown>, questionCount: number) {
  const keys = Object.keys(corrections);
  return keys.length === questionCount
    && Array.from({ length: questionCount }, (_, index) => questionKey(index + 1))
      .every((key) => {
        const entry = corrections[key];
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
        return typeof (entry as { explanation?: unknown }).explanation === "string"
          && (entry as { explanation: string }).explanation.trim().length > 0;
      });
}

function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  if (request.authContext.role !== "admin") {
    reply.code(403).send({ error: "FORBIDDEN", message: "Seul un administrateur peut gérer cette épreuve." });
    return false;
  }
  return true;
}

function localExamState(userId: string, isAdmin: boolean): BacExamState {
  const settings = database.prepare(`
    SELECT exam_id, title, duration_minutes, question_count, subject_published, results_published,
      answer_key_json, corrections_json
    FROM bac_exam_settings
    WHERE exam_id = ?
  `).get(BAC_CI_2024_EXAM_ID) as LocalExamSettingsRow | undefined;
  if (!settings) throw Object.assign(new Error("Épreuve introuvable."), { statusCode: 404 });

  const submission = database.prepare(`
    SELECT answers_json, submitted_at
    FROM bac_exam_submissions
    WHERE exam_id = ? AND user_id = ?
  `).get(BAC_CI_2024_EXAM_ID, userId) as LocalExamSubmissionRow | undefined;
  const answerKey = JSON.parse(settings.answer_key_json) as Record<string, BacExamChoice>;
  const corrections = JSON.parse(settings.corrections_json) as Record<string, Partial<BacExamCorrectionEntry>>;
  const answerKeyReady = isCompleteAnswerSet(answerKey, settings.question_count);
  const correctionReady = answerKeyReady && isCompleteCorrectionSet(corrections, settings.question_count);
  const published = settings.results_published === 1;
  const state: BacExamState = {
    examId: settings.exam_id,
    title: settings.title,
    durationMinutes: settings.duration_minutes,
    questionCount: settings.question_count,
    subjectPublished: settings.subject_published === 1,
    resultsPublished: published,
    answerKeyReady,
    correctionReady,
    canPublishResults: isAdmin && correctionReady,
    canManageSubject: isAdmin,
    submittedAt: submission?.submitted_at,
    submittedAnswers: submission ? JSON.parse(submission.answers_json) as BacExamAnswers : undefined,
  };

  if (isAdmin) {
    const count = database.prepare(`
      SELECT COUNT(*) AS total FROM bac_exam_submissions WHERE exam_id = ?
    `).get(BAC_CI_2024_EXAM_ID) as { total: number };
    state.totalSubmissions = count.total;
  }

  if (published && correctionReady && submission) {
    const answers = JSON.parse(submission.answers_json) as BacExamAnswers;
    const correctAnswers = Object.entries(answerKey)
      .reduce((total, [key, answer]) => total + (answers[key] === answer ? 1 : 0), 0);
    const resultCorrections = Object.fromEntries(
      Object.entries(answerKey).map(([key, answer]) => [
        key,
        { ...(corrections[key] ?? {}), answer },
      ]),
    );
    state.result = {
      correctAnswers,
      scoreMax: settings.question_count,
      scoreOutOf20: Math.round((correctAnswers * 2_000) / settings.question_count) / 100,
      appreciation: getBacExamAppreciation(correctAnswers, settings.question_count),
      corrections: resultCorrections,
    };
  }
  return state;
}

function localExamParticipantResults(examId: string): BacExamParticipantResult[] {
  const settings = database.prepare(`
    SELECT question_count, answer_key_json
    FROM bac_exam_settings
    WHERE exam_id = ?
  `).get(examId) as Pick<LocalExamSettingsRow, "question_count" | "answer_key_json"> | undefined;
  if (!settings) throw Object.assign(new Error("Épreuve introuvable."), { statusCode: 404 });

  const answerKey = JSON.parse(settings.answer_key_json) as Record<string, BacExamChoice>;
  if (!isCompleteAnswerSet(answerKey, settings.question_count)) {
    throw Object.assign(
      new Error("La clé de réponses complète doit être chargée avant de calculer les notes."),
      { statusCode: 409 },
    );
  }

  const rows = database.prepare(`
    SELECT
      submission.user_id,
      profile.name,
      profile.email,
      profile.level_id,
      profile.photo_url,
      submission.answers_json,
      submission.submitted_at
    FROM bac_exam_submissions AS submission
    INNER JOIN users AS profile ON profile.id = submission.user_id
    WHERE submission.exam_id = ?
  `).all(examId) as LocalExamParticipantRow[];

  return rows
    .map((row) => {
      const answers = JSON.parse(row.answers_json) as BacExamAnswers;
      const correctAnswers = Object.entries(answerKey)
        .reduce((total, [key, answer]) => total + (answers[key] === answer ? 1 : 0), 0);
      return {
        userId: row.user_id,
        name: row.name,
        email: row.email,
        levelId: row.level_id,
        photoUrl: row.photo_url ?? undefined,
        submittedAt: row.submitted_at,
        correctAnswers,
        scoreMax: settings.question_count,
        appreciation: getBacExamAppreciation(correctAnswers, settings.question_count),
      };
    })
    .sort((left, right) => (
      right.correctAnswers - left.correctAnswers
      || left.name.localeCompare(right.name, "fr", { sensitivity: "base" })
      || left.userId.localeCompare(right.userId)
    ));
}

function submitLocalExam(userId: string, answers: BacExamAnswers) {
  const settings = database.prepare(`
    SELECT question_count, subject_published FROM bac_exam_settings WHERE exam_id = ?
  `).get(BAC_CI_2024_EXAM_ID) as { question_count: number; subject_published: number } | undefined;
  if (!settings) throw Object.assign(new Error("Épreuve introuvable."), { statusCode: 404 });
  if (settings.subject_published !== 1) {
    throw Object.assign(new Error("Ce sujet est actuellement fermé par l’administrateur."), { statusCode: 409 });
  }
  if (!isCompleteAnswerSet(answers, settings.question_count)) {
    throw Object.assign(new Error("Réponds aux 69 questions avant de valider ta copie."), { statusCode: 400 });
  }
  const existing = database.prepare(`
    SELECT 1 FROM bac_exam_submissions WHERE exam_id = ? AND user_id = ?
  `).get(BAC_CI_2024_EXAM_ID, userId);
  if (existing) throw Object.assign(new Error("Ta copie a déjà été validée."), { statusCode: 409 });
  const submittedAt = new Date().toISOString();
  database.prepare(`
    INSERT INTO bac_exam_submissions (id, exam_id, user_id, answers_json, submitted_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(randomUUID(), BAC_CI_2024_EXAM_ID, userId, JSON.stringify(answers), submittedAt);
  writeAuditLog(userId, "bac_exam.submit", BAC_CI_2024_EXAM_ID, { questionCount: settings.question_count });
  return submittedAt;
}

function setLocalResultsPublished(actorId: string, published: boolean) {
  const settings = database.prepare(`
    SELECT question_count, answer_key_json, corrections_json
    FROM bac_exam_settings
    WHERE exam_id = ?
  `).get(BAC_CI_2024_EXAM_ID) as {
    question_count: number;
    answer_key_json: string;
    corrections_json: string;
  } | undefined;
  if (!settings) throw Object.assign(new Error("Épreuve introuvable."), { statusCode: 404 });
  const answerKey = JSON.parse(settings.answer_key_json) as Record<string, unknown>;
  const corrections = JSON.parse(settings.corrections_json) as Record<string, unknown>;
  if (published && (
    !isCompleteAnswerSet(answerKey, settings.question_count)
    || !isCompleteCorrectionSet(corrections, settings.question_count)
  )) {
    throw Object.assign(new Error("La correction complète doit être chargée avant la publication."), { statusCode: 409 });
  }
  database.prepare(`
    UPDATE bac_exam_settings
    SET results_published = ?, updated_by = ?, updated_at = ?
    WHERE exam_id = ?
  `).run(published ? 1 : 0, actorId, new Date().toISOString(), BAC_CI_2024_EXAM_ID);
  writeAuditLog(actorId, published ? "bac_exam.results.publish" : "bac_exam.results.hide", BAC_CI_2024_EXAM_ID);
}

function setLocalSubjectPublished(actorId: string, published: boolean) {
  const result = database.prepare(`
    UPDATE bac_exam_settings
    SET subject_published = ?, updated_by = ?, updated_at = ?
    WHERE exam_id = ?
  `).run(published ? 1 : 0, actorId, new Date().toISOString(), BAC_CI_2024_EXAM_ID);
  if (result.changes === 0) {
    throw Object.assign(new Error("Épreuve introuvable."), { statusCode: 404 });
  }
  writeAuditLog(actorId, published ? "bac_exam.subject.publish" : "bac_exam.subject.hide", BAC_CI_2024_EXAM_ID);
}

export async function bacExamRoutes(app: FastifyInstance) {
  app.get("/:examId", { preHandler: app.authenticate }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    const parsed = paramsSchema.safeParse(request.params);
    if (!parsed.success) return reply.code(404).send({ error: "EXAM_NOT_FOUND", message: "Épreuve introuvable." });
    const state = supabaseConfigured
      ? await getSupabaseBacExamState(request.authContext.accessToken!, parsed.data.examId)
      : localExamState(request.authContext.id, request.authContext.role === "admin");
    return state;
  });

  app.get("/:examId/participant-results", { preHandler: app.authenticate }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    if (!requireAdmin(request, reply)) return;
    const parsed = paramsSchema.safeParse(request.params);
    if (!parsed.success) return reply.code(404).send({ error: "EXAM_NOT_FOUND", message: "Épreuve introuvable." });
    const items = supabaseConfigured
      ? await listSupabaseBacExamParticipantResults(request.authContext.accessToken!, parsed.data.examId)
      : localExamParticipantResults(parsed.data.examId);
    return { items, total: items.length };
  });

  app.post("/:examId/submissions", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 5, timeWindow: "1 hour" } },
  }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    const params = paramsSchema.safeParse(request.params);
    const body = submitSchema.safeParse(request.body);
    if (!params.success) return reply.code(404).send({ error: "EXAM_NOT_FOUND", message: "Épreuve introuvable." });
    if (!body.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: "Les réponses sont incomplètes ou invalides." });
    const submittedAt = supabaseConfigured
      ? await submitSupabaseBacExam(request.authContext.accessToken!, params.data.examId, body.data.answers)
      : submitLocalExam(request.authContext.id, body.data.answers);
    if (supabaseConfigured) {
      await writeSupabaseAudit(
        request.authContext.accessToken!,
        request.authContext.id,
        "bac_exam.submit",
        params.data.examId,
        { questionCount: Object.keys(body.data.answers).length },
      ).catch((error) => request.log.warn(error, "Supabase audit log failed"));
    }
    return reply.code(201).send({ submittedAt });
  });

  app.patch("/:examId/results-publication", { preHandler: app.authenticate }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    if (!requireAdmin(request, reply)) return;
    const params = paramsSchema.safeParse(request.params);
    const body = publicationSchema.safeParse(request.body);
    if (!params.success) return reply.code(404).send({ error: "EXAM_NOT_FOUND", message: "Épreuve introuvable." });
    if (!body.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: "État de publication invalide." });
    if (supabaseConfigured) {
      await setSupabaseBacExamResultsPublished(request.authContext.accessToken!, params.data.examId, body.data.published);
      await writeSupabaseAudit(
        request.authContext.accessToken!,
        request.authContext.id,
        body.data.published ? "bac_exam.results.publish" : "bac_exam.results.hide",
        params.data.examId,
      ).catch((error) => request.log.warn(error, "Supabase audit log failed"));
    } else {
      setLocalResultsPublished(request.authContext.id, body.data.published);
    }
    return getSupabaseOrLocalState(request);
  });

  app.patch("/:examId/subject-publication", { preHandler: app.authenticate }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    if (!requireAdmin(request, reply)) return;
    const params = paramsSchema.safeParse(request.params);
    const body = publicationSchema.safeParse(request.body);
    if (!params.success) return reply.code(404).send({ error: "EXAM_NOT_FOUND", message: "Épreuve introuvable." });
    if (!body.success) return reply.code(400).send({ error: "VALIDATION_ERROR", message: "État du sujet invalide." });
    if (supabaseConfigured) {
      await setSupabaseBacExamSubjectPublished(request.authContext.accessToken!, params.data.examId, body.data.published);
      await writeSupabaseAudit(
        request.authContext.accessToken!,
        request.authContext.id,
        body.data.published ? "bac_exam.subject.publish" : "bac_exam.subject.hide",
        params.data.examId,
      ).catch((error) => request.log.warn(error, "Supabase audit log failed"));
    } else {
      setLocalSubjectPublished(request.authContext.id, body.data.published);
    }
    return getSupabaseOrLocalState(request);
  });

  async function getSupabaseOrLocalState(request: FastifyRequest) {
    return supabaseConfigured
      ? getSupabaseBacExamState(request.authContext.accessToken!, BAC_CI_2024_EXAM_ID)
      : localExamState(request.authContext.id, request.authContext.role === "admin");
  }
}
