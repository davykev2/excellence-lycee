import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  deleteLocalHomeworkAnswer,
  deleteSupabaseHomeworkAnswer,
  getLocalHomework,
  getLocalHomeworkResult,
  getLocalHomeworkReview,
  getSupabaseHomework,
  getSupabaseHomeworkResult,
  getSupabaseHomeworkReview,
  importLocalHomeworkPackage,
  importSupabaseHomeworkPackage,
  listLocalHomeworks,
  listLocalHomeworkReviews,
  listSupabaseHomeworks,
  listSupabaseHomeworkReviews,
  reviewLocalHomeworkAttempt,
  reviewSupabaseHomeworkAttempt,
  saveLocalHomeworkAnswer,
  saveSupabaseHomeworkAnswer,
  setLocalHomeworkPublication,
  setSupabaseHomeworkPublication,
  startLocalHomeworkAttempt,
  startSupabaseHomeworkAttempt,
  submitLocalHomeworkAttempt,
  submitSupabaseHomeworkAttempt,
  type HomeworkActor,
} from "../homework.js";
import { supabaseConfigured } from "../supabase.js";

const canonicalLevel = /^(seconde|premiere|terminale)-(a|c|d)$/;
const publicReference = /^[a-zA-Z0-9][a-zA-Z0-9-]{2,119}$/;
const canonicalLevels = new Set([
  "seconde-a", "seconde-c", "premiere-a", "premiere-c", "premiere-d",
  "terminale-a", "terminale-c", "terminale-d",
]);
const canonicalSubjects = new Set([
  "mathematics", "physics-chemistry", "french", "english", "svt", "philosophy", "history-geography",
]);

const listSchema = z.object({
  subjectId: z.string().trim().min(2).max(80).optional(),
  academicYear: z.string().trim().min(4).max(30).optional(),
  institution: z.string().trim().min(2).max(160).optional(),
  levelId: z.string().regex(canonicalLevel).optional(),
});
const homeworkParamsSchema = z.object({ homeworkRef: z.string().regex(publicReference) });
const attemptParamsSchema = z.object({ attemptId: z.string().uuid() });
const answerParamsSchema = z.object({
  attemptId: z.string().uuid(),
  questionId: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{2,119}$/),
});
const freeAnswerSchema = z.object({
  finalAnswer: z.string().max(10_000).optional(),
  reasoning: z.string().max(50_000).optional(),
}).strict();
const answerSchema = z.object({
  answer: z.union([z.string().max(50_000), freeAnswerSchema, z.null()]).optional(),
  attachmentUrls: z.array(z.string().url().refine((url) => url.startsWith("https://"), "Une pièce jointe doit utiliser HTTPS.")).max(5).default([]),
}).superRefine((input, context) => {
  const structuredAnswer = input.answer && typeof input.answer === "object" ? input.answer : undefined;
  const hasText = typeof input.answer === "string"
    ? input.answer.trim().length > 0
    : Boolean(structuredAnswer?.finalAnswer?.trim() || structuredAnswer?.reasoning?.trim());
  if (!hasText && input.attachmentUrls.length === 0) {
    context.addIssue({ code: "custom", message: "Ajoute une réponse ou une pièce jointe." });
  }
});
const reviewListSchema = z.object({ status: z.enum(["pending", "completed"]).default("pending") });
const reviewSchema = z.object({
  reviews: z.array(z.object({
    questionId: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{2,119}$/),
    pointsAwarded: z.number().min(0).max(10_000),
    comment: z.string().trim().max(4_000).optional(),
    criteria: z.array(z.object({
      id: z.string().trim().min(1).max(120),
      pointsAwarded: z.number().min(0).max(10_000),
    })).max(50).optional(),
  })).max(200),
  overallComment: z.string().trim().max(6_000).optional(),
});
const publicationSchema = z.object({
  subjectPublished: z.boolean().optional(),
  correctionsPublished: z.boolean().optional(),
}).refine(
  (input) => input.subjectPublished != null || input.correctionsPublished != null,
  "Choisis au moins un état de publication.",
);

const importIdentifierSchema = z.string().trim().regex(publicReference);
const importChoiceSchema = z.object({
  id: z.string().trim().min(1).max(20),
  label: z.string().trim().min(1).max(20),
  contentMarkdown: z.string().trim().min(1).max(10_000),
}).strict();
const importRubricSchema = z.object({
  id: z.string().trim().min(1).max(120),
  label: z.string().trim().min(2).max(500),
  pointsMax: z.number().positive().max(1_000),
}).strict();
const importQuestionSchema = z.object({
  id: importIdentifierSchema,
  label: z.string().trim().min(1).max(80),
  promptMarkdown: z.string().trim().min(2).max(60_000),
  type: z.enum(["qcm", "texte"]),
  answerKind: z.enum(["single-choice", "true-false", "short-text", "number", "formula", "essay"]),
  gradingMode: z.enum(["auto", "manual", "hybrid"]),
  points: z.number().positive().max(1_000),
  autoPoints: z.number().min(0).max(1_000),
  manualPoints: z.number().min(0).max(1_000),
  isNeutralized: z.boolean().default(false),
  choices: z.array(importChoiceSchema).min(2).max(8).optional(),
  expectedAnswer: z.unknown().optional(),
  explanationMarkdown: z.string().trim().min(20).max(100_000),
  rubricCriteria: z.array(importRubricSchema).max(30).optional(),
  imageUrl: z.string().url().refine((url) => url.startsWith("https://"), "Une image doit utiliser HTTPS.").optional(),
  imageAlt: z.string().trim().min(3).max(500).optional(),
  sourceNotice: z.string().trim().min(3).max(4_000).optional(),
}).strict().superRefine((question, context) => {
  const nearlyEqual = (left: number, right: number) => Math.abs(left - right) <= 0.0001;
  if (!nearlyEqual(question.autoPoints + question.manualPoints, question.points)) {
    context.addIssue({ code: "custom", path: ["points"], message: "autoPoints + manualPoints doit être égal au barème de la question." });
  }
  if (question.gradingMode === "auto" && (!nearlyEqual(question.autoPoints, question.points) || question.manualPoints !== 0)) {
    context.addIssue({ code: "custom", path: ["gradingMode"], message: "Une question automatique attribue tous ses points automatiquement." });
  }
  if (question.gradingMode === "manual" && (!nearlyEqual(question.manualPoints, question.points) || question.autoPoints !== 0)) {
    context.addIssue({ code: "custom", path: ["gradingMode"], message: "Une question manuelle attribue tous ses points lors de la correction humaine." });
  }
  if (question.gradingMode === "hybrid" && (question.autoPoints <= 0 || question.manualPoints <= 0)) {
    context.addIssue({ code: "custom", path: ["gradingMode"], message: "Une question hybride doit réserver des points au résultat et à la rédaction." });
  }
  if (question.isNeutralized && question.expectedAnswer != null) {
    context.addIssue({
      code: "custom",
      path: ["expectedAnswer"],
      message: "Une question neutralisée ne doit déclarer aucune réponse attendue.",
    });
  }
  if (question.type === "qcm") {
    if (!question.choices) {
      context.addIssue({ code: "custom", path: ["choices"], message: "Un QCM doit proposer au moins deux choix." });
    } else {
      const ids = question.choices.map((choice) => choice.id);
      if (new Set(ids).size !== ids.length) {
        context.addIssue({ code: "custom", path: ["choices"], message: "Les identifiants des choix doivent être uniques." });
      }
      if (!question.isNeutralized && question.gradingMode !== "manual" && (typeof question.expectedAnswer !== "string" || !ids.includes(question.expectedAnswer))) {
        context.addIssue({ code: "custom", path: ["expectedAnswer"], message: "La bonne réponse du QCM doit être l’identifiant d’un choix." });
      }
    }
    if (question.answerKind !== "single-choice" && question.answerKind !== "true-false") {
      context.addIssue({ code: "custom", path: ["answerKind"], message: "Le type de réponse d’un QCM doit être single-choice ou true-false." });
    }
    if (question.gradingMode === "hybrid") {
      context.addIssue({ code: "custom", path: ["gradingMode"], message: "Une réponse hybride utilise un champ texte avec résultat final et démonstration." });
    }
  } else {
    if (question.choices?.length) {
      context.addIssue({ code: "custom", path: ["choices"], message: "Une question rédigée ne doit pas contenir de choix." });
    }
    if (!question.isNeutralized && question.gradingMode !== "manual") {
      const accepted = Array.isArray(question.expectedAnswer) ? question.expectedAnswer : [question.expectedAnswer];
      if (accepted.length === 0 || accepted.some((answer) => typeof answer !== "string" || !answer.trim())) {
        context.addIssue({ code: "custom", path: ["expectedAnswer"], message: "Une question auto ou hybride doit déclarer au moins une réponse finale acceptée." });
      }
    }
  }
  if (question.manualPoints > 0) {
    const rubric = question.rubricCriteria ?? [];
    if (rubric.length === 0) {
      context.addIssue({ code: "custom", path: ["rubricCriteria"], message: "Le barème manuel doit être découpé en critères explicites." });
    } else {
      const ids = rubric.map((criterion) => criterion.id);
      if (new Set(ids).size !== ids.length) {
        context.addIssue({ code: "custom", path: ["rubricCriteria"], message: "Les identifiants des critères doivent être uniques." });
      }
      const total = rubric.reduce((sum, criterion) => sum + criterion.pointsMax, 0);
      if (!nearlyEqual(total, question.manualPoints)) {
        context.addIssue({ code: "custom", path: ["rubricCriteria"], message: "La somme des critères doit être égale aux points manuels." });
      }
    }
  } else if (question.rubricCriteria?.length) {
    context.addIssue({ code: "custom", path: ["rubricCriteria"], message: "Une question sans correction humaine ne doit pas avoir de barème manuel." });
  }
  if (question.imageUrl && !question.imageAlt) {
    context.addIssue({ code: "custom", path: ["imageAlt"], message: "Décris toute image pour l’accessibilité." });
  }
});
const importExerciseSchema = z.object({
  id: importIdentifierSchema,
  title: z.string().trim().min(2).max(200),
  order: z.number().int().positive().max(100),
  instructionsMarkdown: z.string().trim().min(2).max(30_000).optional(),
  questions: z.array(importQuestionSchema).min(1).max(100),
}).strict();
const importSectionSchema = z.object({
  id: importIdentifierSchema,
  title: z.string().trim().min(2).max(200),
  order: z.number().int().positive().max(30),
  exercises: z.array(importExerciseSchema).min(1).max(50),
}).strict();
const importPackageSchema = z.object({
  importId: z.string().uuid(),
  stableId: importIdentifierSchema,
  slug: importIdentifierSchema,
  title: z.string().trim().min(3).max(240),
  number: z.number().int().positive().max(1_000),
  institution: z.string().trim().min(2).max(240),
  academicYear: z.string().trim().regex(/^20\d{2}[–-]20\d{2}$/),
  subject: z.object({
    id: z.string().refine((value) => canonicalSubjects.has(value), "Matière invalide."),
    name: z.string().trim().min(2).max(100),
    icon: z.string().trim().max(20).optional(),
  }).strict(),
  level: z.object({
    id: z.string().refine((value) => canonicalLevels.has(value), "Niveau ou série invalide."),
    name: z.string().trim().min(2).max(100),
  }).strict(),
  series: z.object({ id: z.string().trim().min(1).max(40), name: z.string().trim().min(1).max(100) }).strict(),
  durationSeconds: z.number().int().min(60).max(8 * 60 * 60),
  gradingMode: z.enum(["auto", "manual", "hybrid"]),
  instructionsMarkdown: z.string().trim().max(30_000).optional(),
  sourceNotice: z.string().trim().min(3).max(4_000).optional(),
  maxAttempts: z.number().int().min(1).max(10).default(3),
  subjectPublished: z.boolean().default(false),
  correctionsPublished: z.boolean().default(false),
  sections: z.array(importSectionSchema).min(1).max(20),
}).strict().superRefine((homework, context) => {
  const questions = homework.sections.flatMap((section) => section.exercises.flatMap((exercise) => exercise.questions));
  const sectionIds = homework.sections.map((section) => section.id);
  if (new Set(sectionIds).size !== sectionIds.length) {
    context.addIssue({ code: "custom", path: ["sections"], message: "Les identifiants des parties doivent être uniques." });
  }
  homework.sections.forEach((section, sectionIndex) => {
    const exerciseIds = section.exercises.map((exercise) => exercise.id);
    if (new Set(exerciseIds).size !== exerciseIds.length) {
      context.addIssue({
        code: "custom",
        path: ["sections", sectionIndex, "exercises"],
        message: "Les identifiants des exercices doivent être uniques dans une partie.",
      });
    }
  });
  const questionIds = questions.map((question) => question.id);
  if (new Set(questionIds).size !== questionIds.length) {
    context.addIssue({ code: "custom", path: ["sections"], message: "Les identifiants des questions doivent être uniques dans le devoir." });
  }
  const expectedMode = questions.every((question) => question.manualPoints === 0)
    ? "auto"
    : questions.every((question) => question.autoPoints === 0) ? "manual" : "hybrid";
  if (homework.gradingMode !== expectedMode) {
    context.addIssue({ code: "custom", path: ["gradingMode"], message: `Le mode global attendu est ${expectedMode}.` });
  }
  const expectedSeriesId = homework.level.id.split("-").at(-1)?.toLowerCase();
  if (!expectedSeriesId || homework.series.id.toLowerCase() !== expectedSeriesId) {
    context.addIssue({
      code: "custom",
      path: ["series", "id"],
      message: "La série doit correspondre exactement au niveau sélectionné.",
    });
  }
  for (const [path, values] of [
    [["sections"], homework.sections],
    ...homework.sections.map((section, index) => [["sections", index, "exercises"], section.exercises] as const),
  ] as Array<[Array<string | number>, Array<{ order: number; id: string }>]>) {
    const orders = values.map((value) => value.order).sort((a, b) => a - b);
    if (orders.some((order, index) => order !== index + 1)) {
      context.addIssue({ code: "custom", path, message: "La numérotation doit être continue à partir de 1." });
    }
  }
  if (homework.correctionsPublished && homework.subjectPublished) {
    context.addIssue({ code: "custom", path: ["correctionsPublished"], message: "Ferme le sujet avant de publier son corrigé." });
  }
});
const importRequestSchema = z.union([
  importPackageSchema,
  z.object({
    package: importPackageSchema,
    publish: z.boolean().default(false),
    publishCorrections: z.boolean().default(false),
  }).strict(),
]).transform((input) => {
  if (!("package" in input)) return input;
  return {
    ...input.package,
    subjectPublished: input.publish,
    correctionsPublished: input.publishCorrections,
  };
}).superRefine((homework, context) => {
  if (homework.correctionsPublished && homework.subjectPublished) {
    context.addIssue({
      code: "custom",
      path: ["correctionsPublished"],
      message: "Ferme le sujet avant de publier son corrigé.",
    });
  }
});

function actor(request: FastifyRequest): HomeworkActor {
  return {
    id: request.authContext.id,
    role: request.authContext.role,
    accountType: request.authContext.accountType,
    levelId: request.authContext.levelId,
  };
}

function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  if (request.authContext.role !== "admin") {
    reply.code(403).send({ error: "FORBIDDEN", message: "Seul un administrateur peut corriger les copies." });
    return false;
  }
  return true;
}

function validationError(reply: FastifyReply, message = "Données invalides.") {
  return reply.code(400).send({ error: "VALIDATION_ERROR", message });
}

export async function homeworkRoutes(app: FastifyInstance) {
  app.post("/admin/import", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 20, timeWindow: "1 hour" } },
  }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    if (!requireAdmin(request, reply)) return;
    const parsed = importRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: "VALIDATION_ERROR",
        message: parsed.error.issues[0]?.message ?? "Paquet de devoir invalide.",
        fields: parsed.error.flatten().fieldErrors,
        issues: parsed.error.issues.map((issue) => ({ path: issue.path, message: issue.message })),
      });
    }
    const imported = supabaseConfigured
      ? await importSupabaseHomeworkPackage(request.authContext.accessToken!, parsed.data)
      : importLocalHomeworkPackage(actor(request), parsed.data);
    return reply.code(imported.imported ? 201 : 200).send(imported);
  });

  app.patch("/admin/:homeworkRef/publication", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 60, timeWindow: "1 hour" } },
  }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    if (!requireAdmin(request, reply)) return;
    const params = homeworkParamsSchema.safeParse(request.params);
    const body = publicationSchema.safeParse(request.body);
    if (!params.success || !body.success) {
      return validationError(reply, body.success ? "Référence de devoir invalide." : body.error.issues[0]?.message);
    }
    const homework = supabaseConfigured
      ? await setSupabaseHomeworkPublication(request.authContext.accessToken!, params.data.homeworkRef, body.data)
      : setLocalHomeworkPublication(actor(request), params.data.homeworkRef, body.data);
    return { homework };
  });

  app.get("/admin/reviews", { preHandler: app.authenticate }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    if (!requireAdmin(request, reply)) return;
    const parsed = reviewListSchema.safeParse(request.query);
    if (!parsed.success) return validationError(reply, parsed.error.issues[0]?.message);
    const items = supabaseConfigured
      ? await listSupabaseHomeworkReviews(request.authContext.accessToken!, parsed.data.status)
      : listLocalHomeworkReviews(parsed.data.status);
    return { items };
  });

  app.get("/admin/attempts/:attemptId", { preHandler: app.authenticate }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    if (!requireAdmin(request, reply)) return;
    const parsed = attemptParamsSchema.safeParse(request.params);
    if (!parsed.success) return validationError(reply, "Identifiant de copie invalide.");
    const review = supabaseConfigured
      ? await getSupabaseHomeworkReview(request.authContext.accessToken!, parsed.data.attemptId)
      : getLocalHomeworkReview(parsed.data.attemptId);
    return { review };
  });

  app.put("/admin/attempts/:attemptId/review", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 120, timeWindow: "1 hour" } },
  }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    if (!requireAdmin(request, reply)) return;
    const params = attemptParamsSchema.safeParse(request.params);
    const body = reviewSchema.safeParse(request.body);
    if (!params.success || !body.success) {
      return validationError(reply, body.success ? "Identifiant de copie invalide." : body.error.issues[0]?.message);
    }
    const result = supabaseConfigured
      ? await reviewSupabaseHomeworkAttempt(request.authContext.accessToken!, params.data.attemptId, body.data)
      : reviewLocalHomeworkAttempt(actor(request), params.data.attemptId, body.data);
    return { result };
  });

  app.put("/attempts/:attemptId/answers/:questionId", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 600, timeWindow: "1 hour" } },
  }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    const params = answerParamsSchema.safeParse(request.params);
    const body = answerSchema.safeParse(request.body);
    if (!params.success || !body.success) {
      return validationError(reply, body.success ? "Identifiant de réponse invalide." : body.error.issues[0]?.message);
    }
    const saved = supabaseConfigured
      ? await saveSupabaseHomeworkAnswer(
        request.authContext.accessToken!,
        params.data.attemptId,
        params.data.questionId,
        body.data.answer,
        body.data.attachmentUrls,
      )
      : saveLocalHomeworkAnswer(
        actor(request),
        params.data.attemptId,
        params.data.questionId,
        body.data.answer,
        body.data.attachmentUrls,
      );
    if (saved.expired || !saved.saved) {
      return reply.code(409).send({
        error: saved.expired ? "HOMEWORK_TIME_EXPIRED" : "ATTEMPT_CLOSED",
        message: saved.expired ? "Le temps est écoulé : la copie a été remise automatiquement." : "Cette copie est déjà remise.",
        ...saved,
      });
    }
    return saved;
  });

  app.delete("/attempts/:attemptId/answers/:questionId", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 600, timeWindow: "1 hour" } },
  }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    const params = answerParamsSchema.safeParse(request.params);
    if (!params.success) return validationError(reply, "Identifiant de réponse invalide.");
    const deleted = supabaseConfigured
      ? await deleteSupabaseHomeworkAnswer(
        request.authContext.accessToken!,
        params.data.attemptId,
        params.data.questionId,
      )
      : deleteLocalHomeworkAnswer(
        actor(request),
        params.data.attemptId,
        params.data.questionId,
      );
    if (deleted.expired || !deleted.deleted) {
      return reply.code(409).send({
        error: deleted.expired ? "HOMEWORK_TIME_EXPIRED" : "ATTEMPT_CLOSED",
        message: deleted.expired
          ? "Le temps est écoulé : la copie a été remise automatiquement."
          : "Cette copie est déjà remise.",
        ...deleted,
      });
    }
    return deleted;
  });

  app.post("/attempts/:attemptId/finalize", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 20, timeWindow: "1 hour" } },
  }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    const parsed = attemptParamsSchema.safeParse(request.params);
    if (!parsed.success) return validationError(reply, "Identifiant de copie invalide.");
    const result = supabaseConfigured
      ? await submitSupabaseHomeworkAttempt(request.authContext.accessToken!, parsed.data.attemptId)
      : submitLocalHomeworkAttempt(actor(request), parsed.data.attemptId);
    return { result };
  });

  app.get("/attempts/:attemptId/result", { preHandler: app.authenticate }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    const parsed = attemptParamsSchema.safeParse(request.params);
    if (!parsed.success) return validationError(reply, "Identifiant de copie invalide.");
    const result = supabaseConfigured
      ? await getSupabaseHomeworkResult(request.authContext.accessToken!, parsed.data.attemptId)
      : getLocalHomeworkResult(actor(request), parsed.data.attemptId);
    return { result };
  });

  app.get("/", { preHandler: app.authenticate }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    const parsed = listSchema.safeParse(request.query);
    if (!parsed.success) return validationError(reply, parsed.error.issues[0]?.message);
    const items = supabaseConfigured
      ? await listSupabaseHomeworks(request.authContext.accessToken!, parsed.data)
      : listLocalHomeworks(actor(request), parsed.data);
    return { items };
  });

  app.get("/:homeworkRef", { preHandler: app.authenticate }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    const parsed = homeworkParamsSchema.safeParse(request.params);
    if (!parsed.success) return reply.code(404).send({ error: "HOMEWORK_NOT_FOUND", message: "Devoir introuvable." });
    const homework = supabaseConfigured
      ? await getSupabaseHomework(request.authContext.accessToken!, parsed.data.homeworkRef)
      : getLocalHomework(actor(request), parsed.data.homeworkRef);
    return { homework };
  });

  app.post("/:homeworkRef/attempts", {
    preHandler: app.authenticate,
    config: { rateLimit: { max: 20, timeWindow: "1 hour" } },
  }, async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    const parsed = homeworkParamsSchema.safeParse(request.params);
    if (!parsed.success) return reply.code(404).send({ error: "HOMEWORK_NOT_FOUND", message: "Devoir introuvable." });
    const attempt = supabaseConfigured
      ? await startSupabaseHomeworkAttempt(request.authContext.accessToken!, parsed.data.homeworkRef)
      : startLocalHomeworkAttempt(actor(request), parsed.data.homeworkRef);
    const homework = supabaseConfigured
      ? await getSupabaseHomework(request.authContext.accessToken!, attempt.homeworkId)
      : getLocalHomework(actor(request), attempt.homeworkId);
    return reply.code(201).send({ attempt, homework });
  });
}
