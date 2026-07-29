import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  BAC_CI_2024_EXAM_ID,
  type BacExamAnswers,
  type BacExamChoice,
  type BacExamCorrectionEntry,
  type BacExamState,
} from "../bacExam.js";
import { database, writeAuditLog } from "../database.js";
import {
  getSupabaseBacExamState,
  setSupabaseBacExamResultsPublished,
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
  results_published: number;
  answer_key_json: string;
  corrections_json: string;
}

interface LocalExamSubmissionRow {
  answers_json: string;
  submitted_at: string;
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

function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  if (request.authContext.role !== "admin") {
    reply.code(403).send({ error: "FORBIDDEN", message: "Seul un administrateur peut publier les résultats." });
    return false;
  }
  return true;
}

function localExamState(userId: string, isAdmin: boolean): BacExamState {
  const settings = database.prepare(`
    SELECT exam_id, title, duration_minutes, question_count, results_published,
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
  const corrections = JSON.parse(settings.corrections_json) as Record<string, BacExamCorrectionEntry>;
  const answerKeyReady = isCompleteAnswerSet(answerKey, settings.question_count);
  const published = settings.results_published === 1;
  const state: BacExamState = {
    examId: settings.exam_id,
    title: settings.title,
    durationMinutes: settings.duration_minutes,
    questionCount: settings.question_count,
    resultsPublished: published,
    answerKeyReady,
    canPublishResults: isAdmin && answerKeyReady,
    submittedAt: submission?.submitted_at,
    submittedAnswers: submission ? JSON.parse(submission.answers_json) as BacExamAnswers : undefined,
  };

  if (isAdmin) {
    const count = database.prepare(`
      SELECT COUNT(*) AS total FROM bac_exam_submissions WHERE exam_id = ?
    `).get(BAC_CI_2024_EXAM_ID) as { total: number };
    state.totalSubmissions = count.total;
  }

  if (published && answerKeyReady && submission) {
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
      scoreOutOf20: Math.round((correctAnswers * 2_000) / settings.question_count) / 100,
      corrections: resultCorrections,
    };
  }
  return state;
}

function submitLocalExam(userId: string, answers: BacExamAnswers) {
  const settings = database.prepare(`
    SELECT question_count FROM bac_exam_settings WHERE exam_id = ?
  `).get(BAC_CI_2024_EXAM_ID) as { question_count: number } | undefined;
  if (!settings) throw Object.assign(new Error("Épreuve introuvable."), { statusCode: 404 });
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
    SELECT question_count, answer_key_json FROM bac_exam_settings WHERE exam_id = ?
  `).get(BAC_CI_2024_EXAM_ID) as { question_count: number; answer_key_json: string } | undefined;
  if (!settings) throw Object.assign(new Error("Épreuve introuvable."), { statusCode: 404 });
  const answerKey = JSON.parse(settings.answer_key_json) as Record<string, unknown>;
  if (published && !isCompleteAnswerSet(answerKey, settings.question_count)) {
    throw Object.assign(new Error("La correction complète doit être chargée avant la publication."), { statusCode: 409 });
  }
  database.prepare(`
    UPDATE bac_exam_settings
    SET results_published = ?, updated_by = ?, updated_at = ?
    WHERE exam_id = ?
  `).run(published ? 1 : 0, actorId, new Date().toISOString(), BAC_CI_2024_EXAM_ID);
  writeAuditLog(actorId, published ? "bac_exam.results.publish" : "bac_exam.results.hide", BAC_CI_2024_EXAM_ID);
}

export async function bacExamRoutes(app: FastifyInstance) {
  app.get("/:examId", { preHandler: app.authenticate }, async (request, reply) => {
    const parsed = paramsSchema.safeParse(request.params);
    if (!parsed.success) return reply.code(404).send({ error: "EXAM_NOT_FOUND", message: "Épreuve introuvable." });
    const state = supabaseConfigured
      ? await getSupabaseBacExamState(request.authContext.accessToken!, parsed.data.examId)
      : localExamState(request.authContext.id, request.authContext.role === "admin");
    return state;
  });

  app.post("/:examId/submissions", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 5, timeWindow: "1 hour" } },
  }, async (request, reply) => {
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

  async function getSupabaseOrLocalState(request: FastifyRequest) {
    return supabaseConfigured
      ? getSupabaseBacExamState(request.authContext.accessToken!, BAC_CI_2024_EXAM_ID)
      : localExamState(request.authContext.id, request.authContext.role === "admin");
  }
}
