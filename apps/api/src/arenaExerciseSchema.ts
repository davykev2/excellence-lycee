import { z } from "zod";
const id = z.string().trim().regex(/^[a-zA-Z0-9-]{1,80}$/);
const figureKey = z.enum(["tc-l1-variation", "tc-l1-asymptotes", "tc-l1-circle", "tc-l2-inflection", "tc-l2-triangle", "tc-l2-water-wall", "tc-l2-functions", "tc-l3-population", "tc-l4-functions", "tc-l5-functions", "tc-l6-sequences", "tc-l7-integrals", "tc-l8-differential", "tc-l9-probability", "tc-l9-tree-blank", "tc-l10-statistics", "tc-l10-scatter-blank", "tc-t2-l1-barycenter", "tc-t2-l1-source", "tc-t2-l2-arithmetic", "tc-t2-l3-space", "tc-t2-l4-conic", "tc-t2-l5-complex", "tc-t2-l5-circuit", "tc-t2-l6-gcd"]);
const answer = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("short"), expected: z.string().trim().min(1).max(1000), accepted: z.array(z.string().trim().min(1).max(500)).min(1).max(30), comparison: z.enum(["literal","complex"]).optional() }),
  z.object({ kind: z.literal("choice"), options: z.array(z.string().trim().min(1).max(2000)).min(2).max(12), correctIndex: z.number().int().min(0), display: z.enum(["buttons", "select"]).optional() }),
  z.object({ kind: z.literal("written") }),
]);
export const arenaQuestionSchema = z.object({
  id, label: z.string().trim().min(1).max(100),
  prompt: z.string().trim().min(1).max(6000),
  explanation: z.string().trim().min(1).max(16000),
  points: z.number().min(0).max(100), answer,
}).superRefine((question, context) => {
  if (question.answer.kind === "choice" && question.answer.correctIndex >= question.answer.options.length) context.addIssue({ code: "custom", message: "La bonne réponse doit faire partie des propositions." });
  if (question.answer.kind !== "written" && question.points <= 0) context.addIssue({ code: "custom", message: "Une question corrigée doit avoir un barème positif." });
  if (question.answer.kind === "written" && question.points !== 0) context.addIssue({ code: "custom", message: "Une rédaction ne peut pas recevoir de note automatique." });
});
export const arenaExerciseSchema = z.object({
  id: z.string().trim().regex(/^[a-zA-Z0-9-]{4,80}$/),
  title: z.string().trim().min(2).max(160),
  statementMarkdown: z.string().trim().min(1).max(25_000),
  correctionMarkdown: z.string().trim().min(1).max(25_000),
  sourceNumber: z.number().int().min(1).max(9999).optional(),
  sourcePage: z.number().int().min(1).max(9999).optional(),
  questions: z.array(arenaQuestionSchema).min(1).max(60).optional(),
  reviewCriteria: z.array(z.string().trim().min(1).max(500)).max(12).optional(),
  figureKey: figureKey.optional(),
  correctionFigureKey: figureKey.optional(),
}).superRefine((exercise, context) => {
  if (exercise.questions && new Set(exercise.questions.map(question => question.id)).size !== exercise.questions.length) context.addIssue({ code: "custom", message: "Les questions doivent avoir des identifiants distincts." });
});
export const arenaPayloadSchema = z.object({
  levelId: z.string().regex(/^(seconde|premiere|terminale)-(a|c|d)$/),
  subjectId: z.enum(["mathematics", "physics-chemistry", "french", "english", "svt", "philosophy", "history-geography"]),
  lessonKey: z.string().trim().regex(/^[a-z0-9-]{3,180}$/),
  lessonTitle: z.string().trim().min(2).max(240),
  difficulty: z.enum(["easy", "medium", "hard"]),
  category: z.enum(["fixation", "deepening", "complex"]).optional(),
  sourceSectionId: id.optional(),
  courseTopicId: id.optional(),
  stageNumber: z.number().int().min(1).max(99),
  title: z.string().trim().min(2).max(180),
  instructionsMarkdown: z.string().trim().max(6_000),
  exercises: z.array(arenaExerciseSchema).min(1).max(30),
}).superRefine((payload, context) => {
  if (new Set(payload.exercises.map(exercise => exercise.id)).size !== payload.exercises.length) context.addIssue({ code: "custom", message: "Chaque exercice doit avoir un identifiant unique." });
});
