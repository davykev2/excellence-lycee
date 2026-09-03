import { createHash, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { config } from "./config.js";
import { database, writeAuditLog, type AccountAudience, type UserRole } from "./database.js";
import { SupabaseOperationError } from "./supabase.js";

export type HomeworkGradingMode = "auto" | "manual" | "hybrid";
export type HomeworkQuestionType = "qcm" | "texte";
export type HomeworkAnswerKind =
  | "single-choice"
  | "true-false"
  | "short-text"
  | "number"
  | "formula"
  | "essay";
export type HomeworkReviewStatus = "not-required" | "pending" | "completed";

export interface HomeworkActor {
  id: string;
  role: UserRole;
  accountType: AccountAudience;
  levelId: string;
}

export interface HomeworkChoice {
  id: string;
  label: string;
  contentMarkdown: string;
}

export interface HomeworkRubricCriterion {
  id: string;
  label: string;
  pointsMax: number;
  pointsAwarded?: number;
  status?: "pending" | "reviewed";
}

export interface HomeworkPublicQuestion {
  id: string;
  order: number;
  label: string;
  promptMarkdown: string;
  type: HomeworkQuestionType;
  answerKind: HomeworkAnswerKind;
  gradingMode: HomeworkGradingMode;
  isNeutralized: boolean;
  choices?: HomeworkChoice[];
  points: number;
  autoPoints: number;
  manualPoints: number;
  imageUrl?: string;
  imageAlt?: string;
  sourceNotice?: string;
  rubricCriteria?: HomeworkRubricCriterion[];
}

export interface HomeworkSummary {
  id: string;
  stableId: string;
  slug: string;
  title: string;
  number: number;
  version: number;
  editorialStatus: "published" | "archived";
  institution: string;
  academicYear: string;
  subject: { id: string; name: string; icon?: string };
  level: { id: string; name: string };
  series: { id: string; name: string };
  durationSeconds: number;
  gradingMode: HomeworkGradingMode;
  subjectPublished: boolean;
  correctionsPublished: boolean;
  exerciseCount: number;
  questionCount: number;
  totalPoints: number;
  scoreMax: number;
  attemptsUsed: number;
  maxAttempts: number;
  activeAttemptId?: string;
  latestAttemptId?: string;
  status: "available" | "in-progress" | "completed";
}

export interface HomeworkDefinition extends HomeworkSummary {
  instructionsMarkdown?: string;
  sourceNotice?: string;
  sections: Array<{
    id: string;
    title: string;
    order: number;
    exercises: Array<{
      id: string;
      title: string;
      order: number;
      instructionsMarkdown?: string;
      questions: HomeworkPublicQuestion[];
    }>;
  }>;
}

export interface HomeworkAttempt {
  id: string;
  homeworkId: string;
  attemptNumber: number;
  status: "in-progress" | "submitted" | "awaiting-review" | "graded";
  startedAt: string;
  expiresAt?: string;
  submittedAt?: string;
  serverNow: string;
  answers: Record<string, { answer: unknown; attachmentUrls: string[] }>;
  answeredCount: number;
  questionCount: number;
}

export interface HomeworkCorrection {
  questionId: string;
  label: string;
  promptMarkdown: string;
  choices?: HomeworkChoice[];
  studentAnswer: unknown;
  attachmentUrls: string[];
  expectedAnswer?: unknown;
  correct?: boolean;
  pointsAwarded: number;
  pointsMax: number;
  explanationMarkdown: string;
  reviewComment?: string;
  rubricCriteria?: HomeworkRubricCriterion[];
}

export interface HomeworkResult {
  attemptId: string;
  homeworkId: string;
  status: "submitted" | "awaiting-review" | "graded";
  submittedAt: string;
  timeSpentSeconds: number;
  gradingMode: HomeworkGradingMode;
  reviewStatus: HomeworkReviewStatus;
  answeredCount: number;
  questionCount: number;
  autoGradedPoints?: number;
  pendingManualPoints: number;
  totalPoints: number;
  provisionalScoreOutOf20?: number;
  scoreOutOf20?: number;
  appreciation?: { label: string; message: string };
  reviewComment?: string;
  correctionsAvailable: boolean;
  corrections?: HomeworkCorrection[];
}

export interface HomeworkReviewItem {
  attemptId: string;
  homeworkId: string;
  homeworkTitle: string;
  institution: string;
  academicYear: string;
  student: { id: string; name: string; email: string; levelId: string };
  submittedAt: string;
  reviewStatus: HomeworkReviewStatus;
  autoGradedPoints: number;
  pendingManualPoints: number;
  totalPoints: number;
}

export interface HomeworkReviewInput {
  reviews: Array<{
    questionId: string;
    pointsAwarded: number;
    comment?: string;
    criteria?: Array<{ id: string; pointsAwarded: number }>;
  }>;
  overallComment?: string;
}

export interface HomeworkImportQuestion {
  id: string;
  label: string;
  promptMarkdown: string;
  type: HomeworkQuestionType;
  answerKind: HomeworkAnswerKind;
  gradingMode: HomeworkGradingMode;
  points: number;
  autoPoints: number;
  manualPoints: number;
  isNeutralized?: boolean;
  choices?: HomeworkChoice[];
  expectedAnswer?: unknown;
  explanationMarkdown: string;
  rubricCriteria?: HomeworkRubricCriterion[];
  imageUrl?: string;
  imageAlt?: string;
  sourceNotice?: string;
}

export interface HomeworkImportPackage {
  importId: string;
  stableId: string;
  slug: string;
  title: string;
  number: number;
  institution: string;
  academicYear: string;
  subject: { id: string; name: string; icon?: string };
  level: { id: string; name: string };
  series: { id: string; name: string };
  durationSeconds: number;
  gradingMode: HomeworkGradingMode;
  instructionsMarkdown?: string;
  sourceNotice?: string;
  maxAttempts: number;
  subjectPublished: boolean;
  correctionsPublished: boolean;
  sections: Array<{
    id: string;
    title: string;
    order: number;
    exercises: Array<{
      id: string;
      title: string;
      order: number;
      instructionsMarkdown?: string;
      questions: HomeworkImportQuestion[];
    }>;
  }>;
}

export interface HomeworkImportResult {
  homework: HomeworkSummary;
  imported: boolean;
  version: number;
}

export class HomeworkOperationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function isoNow() {
  return new Date().toISOString();
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  return `{${Object.entries(value as Record<string, unknown>)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
    .join(",")}}`;
}

function homeworkPayloadHash(input: HomeworkImportPackage) {
  return createHash("sha256").update(canonicalJson(input)).digest("hex");
}

function normalizeChoices(value: unknown): HomeworkChoice[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((choice, index) => {
    const fallback = labels[index] ?? String(index + 1);
    if (choice && typeof choice === "object" && !Array.isArray(choice)) {
      const candidate = choice as Partial<HomeworkChoice>;
      return {
        id: String(candidate.id ?? fallback),
        label: String(candidate.label ?? candidate.id ?? fallback),
        contentMarkdown: String(candidate.contentMarkdown ?? ""),
      };
    }
    return { id: fallback, label: fallback, contentMarkdown: String(choice) };
  });
}

function appreciation(score: number) {
  if (score >= 16) return { label: "Excellent", message: "La maîtrise est solide." };
  if (score >= 14) return { label: "Très bien", message: "Les méthodes sont bien installées." };
  if (score >= 12) return { label: "Bien", message: "L’essentiel est acquis." };
  if (score >= 10) return { label: "Encourageant", message: "Quelques points restent à consolider." };
  return { label: "À consolider", message: "Reprends la correction pas à pas avant une nouvelle tentative." };
}

function publicQuestion(row: LocalQuestionRow): HomeworkPublicQuestion {
  const choices = normalizeChoices(parseJson<unknown>(row.choices_json, null));
  return {
    id: row.id,
    order: row.order_number,
    label: row.question_label,
    promptMarkdown: row.prompt_markdown,
    type: row.question_type,
    answerKind: row.answer_kind,
    gradingMode: row.grading_mode,
    isNeutralized: row.is_neutralized === 1,
    choices,
    points: row.points,
    autoPoints: row.auto_points_max,
    manualPoints: row.manual_points_max,
    imageUrl: row.image_url ?? undefined,
    imageAlt: row.image_alt ?? undefined,
    sourceNotice: row.source_notice ?? undefined,
    rubricCriteria: parseJson<HomeworkRubricCriterion[]>(row.rubric_json, []).map((criterion) => ({
      id: criterion.id,
      label: criterion.label,
      pointsMax: criterion.pointsMax,
    })),
  };
}

export function groupHomeworkQuestions(
  summary: HomeworkSummary,
  instructionsMarkdown: string | undefined,
  rows: Array<HomeworkPublicQuestion & {
    sectionId?: string;
    sectionTitle?: string;
    sectionOrder?: number;
    exerciseId?: string;
    exerciseTitle?: string;
    exerciseOrder?: number;
    exerciseInstructionsMarkdown?: string;
  }>,
  sourceNotice?: string,
): HomeworkDefinition {
  const sectionMap = new Map<string, HomeworkDefinition["sections"][number]>();
  for (const question of rows) {
    const sectionId = question.sectionId || "subject";
    const section = sectionMap.get(sectionId) ?? {
      id: sectionId,
      title: question.sectionTitle || "Sujet",
      order: question.sectionOrder ?? 1,
      exercises: [],
    };
    if (!sectionMap.has(sectionId)) sectionMap.set(sectionId, section);
    const exerciseId = question.exerciseId || `exercise-${question.exerciseOrder ?? 1}`;
    let exercise = section.exercises.find((item) => item.id === exerciseId);
    if (!exercise) {
      exercise = {
        id: exerciseId,
        title: question.exerciseTitle || `Exercice ${question.exerciseOrder ?? 1}`,
        order: question.exerciseOrder ?? 1,
        instructionsMarkdown: question.exerciseInstructionsMarkdown,
        questions: [],
      };
      section.exercises.push(exercise);
    }
    const {
      sectionId: _sectionId,
      sectionTitle: _sectionTitle,
      sectionOrder: _sectionOrder,
      exerciseId: _exerciseId,
      exerciseTitle: _exerciseTitle,
      exerciseOrder: _exerciseOrder,
      exerciseInstructionsMarkdown: _exerciseInstructionsMarkdown,
      ...cleanQuestion
    } = question;
    exercise.questions.push(cleanQuestion);
  }
  const sections = [...sectionMap.values()]
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      ...section,
      exercises: section.exercises
        .sort((a, b) => a.order - b.order)
        .map((exercise) => ({
          ...exercise,
          questions: exercise.questions.sort((a, b) => a.order - b.order),
        })),
    }));
  return { ...summary, instructionsMarkdown, sourceNotice, sections };
}

interface LocalQuizRow {
  id: string;
  stable_id: string;
  slug: string;
  title: string;
  number: number;
  institution: string;
  academic_year: string;
  subject_id: string;
  subject_name: string;
  subject_icon: string | null;
  level_id: string;
  level_name: string;
  series_id: string;
  series_name: string;
  duration_seconds: number;
  grading_mode: HomeworkGradingMode;
  instructions_markdown: string | null;
  source_notice: string | null;
  published: number;
  subject_open: number;
  corrections_published: number;
  max_attempts: number;
  version: number;
  import_id: string | null;
  payload_hash: string | null;
}

interface LocalQuestionRow {
  id: string;
  quiz_id: string;
  section_id: string;
  section_title: string;
  section_order: number;
  exercise_id: string;
  exercise_title: string;
  exercise_order: number;
  exercise_instructions_markdown: string | null;
  order_number: number;
  question_label: string;
  prompt_markdown: string;
  question_type: HomeworkQuestionType;
  answer_kind: HomeworkAnswerKind;
  grading_mode: HomeworkGradingMode;
  is_neutralized: number;
  choices_json: string | null;
  expected_answer_json: string;
  points: number;
  auto_points_max: number;
  manual_points_max: number;
  explanation_markdown: string;
  rubric_json: string;
  image_url: string | null;
  image_alt: string | null;
  source_notice: string | null;
}

interface LocalAttemptRow {
  id: string;
  user_id: string;
  quiz_id: string;
  attempt_number: number;
  status: "in-progress" | "awaiting-review" | "graded";
  started_at: string;
  expires_at: string | null;
  submitted_at: string | null;
  time_spent_seconds: number | null;
  auto_points: number;
  pending_manual_points: number;
  total_points: number;
  score_out_of_20: number | null;
  review_status: HomeworkReviewStatus;
  review_comment: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

interface LocalAnswerRow {
  attempt_id: string;
  question_id: string;
  answer_json: string;
  attachment_urls_json: string;
  correct: number | null;
  auto_points: number;
  manual_points: number | null;
  review_comment: string | null;
  rubric_awards_json: string | null;
  updated_at: string;
}

export function ensureLocalHomeworkSchema() {
  database.exec(`
    CREATE TABLE IF NOT EXISTS homework_quizzes (
      id TEXT PRIMARY KEY,
      stable_id TEXT NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      number INTEGER NOT NULL CHECK (number > 0),
      institution TEXT NOT NULL,
      academic_year TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      subject_name TEXT NOT NULL,
      subject_icon TEXT,
      level_id TEXT NOT NULL,
      level_name TEXT NOT NULL,
      series_id TEXT NOT NULL,
      series_name TEXT NOT NULL,
      duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0),
      grading_mode TEXT NOT NULL CHECK (grading_mode IN ('auto', 'manual', 'hybrid')),
      instructions_markdown TEXT,
      source_notice TEXT,
      published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
      subject_open INTEGER NOT NULL DEFAULT 0 CHECK (subject_open IN (0, 1)),
      corrections_published INTEGER NOT NULL DEFAULT 0 CHECK (corrections_published IN (0, 1)),
      max_attempts INTEGER NOT NULL DEFAULT 3 CHECK (max_attempts BETWEEN 1 AND 10),
      version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
      import_id TEXT UNIQUE,
      payload_hash TEXT
    );

    CREATE UNIQUE INDEX IF NOT EXISTS homework_quizzes_published_slug_idx
      ON homework_quizzes(slug) WHERE published = 1;

    CREATE INDEX IF NOT EXISTS homework_quizzes_catalog_idx
      ON homework_quizzes(level_id, subject_id, published, academic_year);

    CREATE TABLE IF NOT EXISTS homework_questions (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL REFERENCES homework_quizzes(id) ON DELETE CASCADE,
      section_id TEXT NOT NULL DEFAULT 'subject',
      section_title TEXT NOT NULL DEFAULT 'Sujet',
      section_order INTEGER NOT NULL DEFAULT 1,
      exercise_id TEXT NOT NULL,
      exercise_title TEXT NOT NULL,
      exercise_order INTEGER NOT NULL,
      exercise_instructions_markdown TEXT,
      order_number INTEGER NOT NULL,
      question_label TEXT NOT NULL,
      prompt_markdown TEXT NOT NULL,
      question_type TEXT NOT NULL CHECK (question_type IN ('qcm', 'texte')),
      answer_kind TEXT NOT NULL CHECK (answer_kind IN ('single-choice', 'true-false', 'short-text', 'number', 'formula', 'essay')),
      grading_mode TEXT NOT NULL CHECK (grading_mode IN ('auto', 'manual', 'hybrid')),
      is_neutralized INTEGER NOT NULL DEFAULT 0 CHECK (is_neutralized IN (0, 1)),
      choices_json TEXT,
      expected_answer_json TEXT NOT NULL,
      points REAL NOT NULL CHECK (points > 0),
      auto_points_max REAL NOT NULL DEFAULT 0 CHECK (auto_points_max >= 0),
      manual_points_max REAL NOT NULL DEFAULT 0 CHECK (manual_points_max >= 0),
      explanation_markdown TEXT NOT NULL,
      rubric_json TEXT NOT NULL DEFAULT '[]',
      image_url TEXT,
      image_alt TEXT,
      source_notice TEXT,
      CHECK (ABS((auto_points_max + manual_points_max) - points) < 0.0001),
      UNIQUE (quiz_id, order_number)
    );

    CREATE TABLE IF NOT EXISTS homework_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      quiz_id TEXT NOT NULL REFERENCES homework_quizzes(id) ON DELETE RESTRICT,
      attempt_number INTEGER NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('in-progress', 'awaiting-review', 'graded')),
      started_at TEXT NOT NULL,
      expires_at TEXT,
      submitted_at TEXT,
      time_spent_seconds INTEGER,
      auto_points REAL NOT NULL DEFAULT 0,
      pending_manual_points REAL NOT NULL DEFAULT 0,
      total_points REAL NOT NULL DEFAULT 0,
      score_out_of_20 REAL,
      review_status TEXT NOT NULL DEFAULT 'not-required' CHECK (review_status IN ('not-required', 'pending', 'completed')),
      review_comment TEXT,
      reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      reviewed_at TEXT,
      UNIQUE (user_id, quiz_id, attempt_number)
    );

    CREATE UNIQUE INDEX IF NOT EXISTS homework_attempts_active_idx
      ON homework_attempts(user_id, quiz_id) WHERE status = 'in-progress';

    CREATE TABLE IF NOT EXISTS homework_answers (
      attempt_id TEXT NOT NULL REFERENCES homework_attempts(id) ON DELETE CASCADE,
      question_id TEXT NOT NULL REFERENCES homework_questions(id) ON DELETE CASCADE,
      answer_json TEXT NOT NULL,
      attachment_urls_json TEXT NOT NULL DEFAULT '[]',
      correct INTEGER CHECK (correct IS NULL OR correct IN (0, 1)),
      auto_points REAL NOT NULL DEFAULT 0,
      manual_points REAL,
      review_comment TEXT,
      rubric_awards_json TEXT,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (attempt_id, question_id)
    );
  `);

  const quizColumns = database.prepare("PRAGMA table_info(homework_quizzes)").all() as Array<{ name: string }>;
  if (!quizColumns.some((column) => column.name === "import_id")) {
    database.exec("ALTER TABLE homework_quizzes ADD COLUMN import_id TEXT");
  }
  if (!quizColumns.some((column) => column.name === "source_notice")) {
    database.exec("ALTER TABLE homework_quizzes ADD COLUMN source_notice TEXT");
  }
  if (!quizColumns.some((column) => column.name === "payload_hash")) {
    database.exec("ALTER TABLE homework_quizzes ADD COLUMN payload_hash TEXT");
  }
  database.exec("CREATE UNIQUE INDEX IF NOT EXISTS homework_quizzes_import_id_idx ON homework_quizzes(import_id) WHERE import_id IS NOT NULL");

  const questionColumns = database.prepare("PRAGMA table_info(homework_questions)").all() as Array<{ name: string }>;
  if (!questionColumns.some((column) => column.name === "auto_points_max")) {
    database.exec("ALTER TABLE homework_questions ADD COLUMN auto_points_max REAL NOT NULL DEFAULT 0 CHECK (auto_points_max >= 0)");
  }
  if (!questionColumns.some((column) => column.name === "manual_points_max")) {
    database.exec("ALTER TABLE homework_questions ADD COLUMN manual_points_max REAL NOT NULL DEFAULT 0 CHECK (manual_points_max >= 0)");
    database.prepare(`
      UPDATE homework_questions
      SET auto_points_max = CASE WHEN grading_mode = 'auto' THEN points ELSE 0 END,
          manual_points_max = CASE WHEN grading_mode = 'manual' THEN points ELSE 0 END
    `).run();
  }
  if (!questionColumns.some((column) => column.name === "exercise_instructions_markdown")) {
    database.exec("ALTER TABLE homework_questions ADD COLUMN exercise_instructions_markdown TEXT");
  }
  if (!questionColumns.some((column) => column.name === "source_notice")) {
    database.exec("ALTER TABLE homework_questions ADD COLUMN source_notice TEXT");
  }
}

ensureLocalHomeworkSchema();

function localQuiz(quizId: string) {
  return database.prepare("SELECT * FROM homework_quizzes WHERE id = ?").get(quizId) as LocalQuizRow | undefined;
}

function localQuizByReference(reference: string) {
  return database.prepare(`
    SELECT * FROM homework_quizzes
    WHERE (id = ? OR slug = ? OR stable_id = ?) AND published = 1
    ORDER BY version DESC LIMIT 1
  `).get(reference, reference, reference) as LocalQuizRow | undefined;
}

function localActiveAttemptByReference(actorId: string, reference: string) {
  return database.prepare(`
    SELECT attempt.*
    FROM homework_attempts attempt
    JOIN homework_quizzes quiz ON quiz.id = attempt.quiz_id
    WHERE attempt.user_id = ? AND attempt.status = 'in-progress'
      AND (quiz.id = ? OR quiz.slug = ? OR quiz.stable_id = ?)
    ORDER BY attempt.started_at DESC LIMIT 1
  `).get(actorId, reference, reference, reference) as LocalAttemptRow | undefined;
}

function localOwnedAttemptForExactQuiz(actorId: string, quizId: string) {
  return database.prepare(`
    SELECT attempt.*
    FROM homework_attempts attempt
    WHERE attempt.user_id = ? AND attempt.quiz_id = ?
    ORDER BY attempt.started_at DESC LIMIT 1
  `).get(actorId, quizId) as LocalAttemptRow | undefined;
}

function assertLocalAccess(actor: HomeworkActor, quiz: LocalQuizRow) {
  if (actor.role !== "admin" && actor.levelId !== quiz.level_id) {
    throw new HomeworkOperationError(
      "Ce devoir est réservé à la classe concernée.",
      403,
      "HOMEWORK_ACCESS_DENIED",
    );
  }
}

function assertLocalCanCompose(actor: HomeworkActor) {
  if (actor.role === "admin") return;
  if (actor.role !== "student" || actor.accountType !== "student") {
    throw new HomeworkOperationError(
      "Seuls les élèves peuvent composer ce devoir.",
      403,
      "HOMEWORK_COMPOSITION_FORBIDDEN",
    );
  }
}

function localQuestions(quizId: string) {
  return database.prepare(`
    SELECT * FROM homework_questions WHERE quiz_id = ? ORDER BY order_number
  `).all(quizId) as LocalQuestionRow[];
}

function localAnswers(attemptId: string) {
  return database.prepare(`
    SELECT * FROM homework_answers WHERE attempt_id = ? ORDER BY updated_at
  `).all(attemptId) as LocalAnswerRow[];
}

function localAttempt(attemptId: string) {
  return database.prepare("SELECT * FROM homework_attempts WHERE id = ?").get(attemptId) as LocalAttemptRow | undefined;
}

function homeworkSummary(quiz: LocalQuizRow, actor: HomeworkActor): HomeworkSummary {
  const stableAttempts = database.prepare(`
    SELECT attempt.id, attempt.status, attempt.expires_at
    FROM homework_attempts attempt
    JOIN homework_quizzes version ON version.id = attempt.quiz_id
    WHERE attempt.user_id = ? AND version.stable_id = ?
    ORDER BY attempt.started_at DESC
  `).all(actor.id, quiz.stable_id) as Array<{
    id: string;
    status: LocalAttemptRow["status"];
    expires_at: string | null;
  }>;
  const active = stableAttempts.find((attempt) => (
    attempt.status === "in-progress" && (!attempt.expires_at || Date.parse(attempt.expires_at) > Date.now())
  ));
  const latestCompleted = stableAttempts.find((attempt) => attempt.status !== "in-progress");
  const questionStats = database.prepare(`
    SELECT
      COUNT(*) AS question_count,
      COUNT(DISTINCT section_id || ':' || exercise_id) AS exercise_count,
      COALESCE(SUM(points), 0) AS total_points
    FROM homework_questions WHERE quiz_id = ?
  `).get(quiz.id) as { question_count: number; exercise_count: number; total_points: number };
  return {
    id: quiz.id,
    stableId: quiz.stable_id,
    slug: quiz.slug,
    title: quiz.title,
    number: quiz.number,
    version: quiz.version,
    editorialStatus: quiz.published === 1 ? "published" : "archived",
    institution: quiz.institution,
    academicYear: quiz.academic_year,
    subject: { id: quiz.subject_id, name: quiz.subject_name, icon: quiz.subject_icon ?? undefined },
    level: { id: quiz.level_id, name: quiz.level_name },
    series: { id: quiz.series_id, name: quiz.series_name },
    durationSeconds: quiz.duration_seconds,
    gradingMode: quiz.grading_mode,
    subjectPublished: quiz.subject_open === 1,
    correctionsPublished: quiz.corrections_published === 1,
    exerciseCount: questionStats.exercise_count,
    questionCount: questionStats.question_count,
    totalPoints: questionStats.total_points,
    scoreMax: 20,
    attemptsUsed: stableAttempts.length,
    maxAttempts: quiz.max_attempts,
    activeAttemptId: active?.id,
    latestAttemptId: latestCompleted?.id,
    status: active ? "in-progress" : latestCompleted ? "completed" : "available",
  };
}

export function listLocalHomeworks(
  actor: HomeworkActor,
  filters: { subjectId?: string; academicYear?: string; institution?: string; levelId?: string },
) {
  if (actor.role !== "admin") assertLocalCanCompose(actor);
  const clauses = actor.role === "admin" ? ["1 = 1"] : ["published = 1"];
  const params: string[] = [];
  const levelId = actor.role === "admin" ? filters.levelId : actor.levelId;
  if (actor.role !== "admin") {
    clauses.push(`(
      subject_open = 1 OR EXISTS (
        SELECT 1 FROM homework_attempts visible_attempt
        JOIN homework_quizzes attempted_quiz ON attempted_quiz.id = visible_attempt.quiz_id
        WHERE visible_attempt.user_id = ?
          AND attempted_quiz.stable_id = homework_quizzes.stable_id
      )
    )`);
    params.push(actor.id);
  }
  if (levelId) { clauses.push("level_id = ?"); params.push(levelId); }
  if (filters.subjectId) { clauses.push("subject_id = ?"); params.push(filters.subjectId); }
  if (filters.academicYear) { clauses.push("academic_year = ?"); params.push(filters.academicYear); }
  if (filters.institution) { clauses.push("LOWER(institution) LIKE LOWER(?)"); params.push(`%${filters.institution}%`); }
  const quizzes = database.prepare(`
    SELECT * FROM homework_quizzes WHERE ${clauses.join(" AND ")}
    ORDER BY academic_year DESC, institution, subject_name, number, version DESC
  `).all(...params) as LocalQuizRow[];
  return quizzes.map((quiz) => homeworkSummary(quiz, actor));
}

export function getLocalHomework(actor: HomeworkActor, homeworkReference: string): HomeworkDefinition {
  if (actor.role !== "admin") assertLocalCanCompose(actor);
  let active = actor.role === "admin" ? undefined : localActiveAttemptByReference(actor.id, homeworkReference);
  if (active && isExpired(active)) {
    finalizeLocalHomeworkAttempt(actor, active.id, true);
    active = undefined;
  }
  // Le POST de reprise peut rendre une ancienne version juste auto-finalisée.
  // Son UUID exact reste lisible par son propriétaire en métadonnées, même si
  // une nouvelle version a archivé ce quiz entre-temps.
  const exactOwnedAttempt = actor.role === "admin" || active
    ? undefined
    : localOwnedAttemptForExactQuiz(actor.id, homeworkReference);
  const quiz = active
    ? localQuiz(active.quiz_id)
    : actor.role === "admin"
      ? localQuiz(homeworkReference) ?? localQuizByReference(homeworkReference)
      : exactOwnedAttempt
        ? localQuiz(exactOwnedAttempt.quiz_id)
        : localQuizByReference(homeworkReference);
  if (!quiz || (
    !active && actor.role !== "admin" && !exactOwnedAttempt
    && (quiz.published !== 1 || quiz.subject_open !== 1)
  )) {
    throw new HomeworkOperationError("Devoir introuvable.", 404, "HOMEWORK_NOT_FOUND");
  }
  assertLocalAccess(actor, quiz);
  // Avant le démarrage chronométré, un élève ne reçoit que les métadonnées.
  // L'aperçu administrateur et une tentative active reçoivent le sujet complet,
  // toujours depuis le quiz immuable lié à cette tentative.
  if (actor.role !== "admin" && !active) {
    return groupHomeworkQuestions(
      homeworkSummary(quiz, actor),
      quiz.instructions_markdown ?? undefined,
      [],
      quiz.source_notice ?? undefined,
    );
  }
  const questions = localQuestions(quiz.id).map((row) => ({
    ...publicQuestion(row),
    sectionId: row.section_id,
    sectionTitle: row.section_title,
    sectionOrder: row.section_order,
    exerciseId: row.exercise_id,
    exerciseTitle: row.exercise_title,
    exerciseOrder: row.exercise_order,
    exerciseInstructionsMarkdown: row.exercise_instructions_markdown ?? undefined,
  }));
  return groupHomeworkQuestions(
    homeworkSummary(quiz, actor),
    quiz.instructions_markdown ?? undefined,
    questions,
    quiz.source_notice ?? undefined,
  );
}

function toAttempt(row: LocalAttemptRow): HomeworkAttempt {
  const answers = Object.fromEntries(localAnswers(row.id).map((answer) => [
    answer.question_id,
    {
      answer: parseJson<unknown>(answer.answer_json, null),
      attachmentUrls: parseJson<string[]>(answer.attachment_urls_json, []),
    },
  ]));
  const questions = localQuestions(row.quiz_id);
  const questionCount = questions.length;
  const answeredCount = questions.reduce((total, question) => (
    question.is_neutralized === 1 || question.id in answers ? total + 1 : total
  ), 0);
  return {
    id: row.id,
    homeworkId: row.quiz_id,
    attemptNumber: row.attempt_number,
    status: row.status,
    startedAt: row.started_at,
    expiresAt: row.expires_at ?? undefined,
    submittedAt: row.submitted_at ?? undefined,
    serverNow: isoNow(),
    answers,
    answeredCount,
    questionCount,
  };
}

function isExpired(attempt: LocalAttemptRow) {
  return Boolean(attempt.expires_at && Date.parse(attempt.expires_at) <= Date.now());
}

export function startLocalHomeworkAttempt(actor: HomeworkActor, homeworkReference: string): HomeworkAttempt {
  assertLocalCanCompose(actor);
  const referencedActive = localActiveAttemptByReference(actor.id, homeworkReference);
  const referencedQuiz = referencedActive ? localQuiz(referencedActive.quiz_id) : localQuizByReference(homeworkReference);
  if (!referencedQuiz || referencedQuiz.published !== 1 || (referencedQuiz.subject_open !== 1 && actor.role !== "admin")) {
    if (!referencedActive) throw new HomeworkOperationError("Devoir introuvable.", 404, "HOMEWORK_NOT_FOUND");
  }
  if (!referencedQuiz) throw new HomeworkOperationError("Devoir introuvable.", 404, "HOMEWORK_NOT_FOUND");
  let quiz: LocalQuizRow = referencedQuiz;
  assertLocalAccess(actor, quiz);
  return database.transaction(() => {
    let active = referencedActive ?? database.prepare(`
      SELECT * FROM homework_attempts WHERE user_id = ? AND quiz_id = ? AND status = 'in-progress'
      ORDER BY attempt_number DESC LIMIT 1
    `).get(actor.id, quiz.id) as LocalAttemptRow | undefined;
    if (active && isExpired(active)) {
      finalizeLocalHomeworkAttempt(actor, active.id, true);
      const finalized = localAttempt(active.id);
      if (!finalized) throw new HomeworkOperationError("Tentative introuvable.", 404, "ATTEMPT_NOT_FOUND");
      // Un clic parti depuis une page devenue périmée ne doit jamais créer en
      // silence la tentative suivante. Le client reçoit d'abord la copie que
      // le serveur vient de remettre automatiquement, puis peut choisir de
      // recommencer explicitement.
      return toAttempt(finalized);
    }
    if (active) return toAttempt(active);
    if (quiz.corrections_published === 1) {
      throw new HomeworkOperationError(
        "Le corrigé est déjà publié : aucune nouvelle tentative ne peut démarrer.",
        409,
        "HOMEWORK_CORRECTIONS_ALREADY_PUBLISHED",
      );
    }
    const quizId = quiz.id;
    const attemptsUsed = (database.prepare(`
      SELECT COUNT(*) AS total
      FROM homework_attempts attempt
      JOIN homework_quizzes version ON version.id = attempt.quiz_id
      WHERE attempt.user_id = ? AND version.stable_id = ?
    `).get(actor.id, quiz.stable_id) as { total: number }).total;
    if (attemptsUsed >= quiz.max_attempts) {
      throw new HomeworkOperationError("Tu as utilisé toutes tes tentatives pour ce devoir.", 409, "HOMEWORK_ATTEMPT_LIMIT");
    }
    const attemptNumber = attemptsUsed + 1;
    const durationFactor = attemptNumber === 1 ? 1 : attemptNumber === 2 ? 0.66 : 0.33;
    const startedAt = isoNow();
    const expiresAt = new Date(Date.now() + Math.max(60, Math.round(quiz.duration_seconds * durationFactor)) * 1000).toISOString();
    const row: LocalAttemptRow = {
      id: randomUUID(),
      user_id: actor.id,
      quiz_id: quizId,
      attempt_number: attemptNumber,
      status: "in-progress",
      started_at: startedAt,
      expires_at: expiresAt,
      submitted_at: null,
      time_spent_seconds: null,
      auto_points: 0,
      pending_manual_points: 0,
      total_points: 0,
      score_out_of_20: null,
      review_status: "not-required",
      review_comment: null,
      reviewed_by: null,
      reviewed_at: null,
    };
    database.prepare(`
      INSERT INTO homework_attempts (
        id, user_id, quiz_id, attempt_number, status, started_at, expires_at,
        auto_points, pending_manual_points, total_points, review_status
      ) VALUES (?, ?, ?, ?, 'in-progress', ?, ?, 0, 0, 0, 'not-required')
    `).run(row.id, row.user_id, row.quiz_id, row.attempt_number, row.started_at, row.expires_at);
    writeAuditLog(actor.id, "homework.attempt.start", row.id, { quizId, attemptNumber });
    return toAttempt(row);
  })();
}

function resolveQcmAnswer(question: LocalQuestionRow, answer: unknown) {
  if (typeof answer !== "string") return { valid: false, value: undefined };
  const choices = normalizeChoices(parseJson<unknown>(question.choices_json, [])) ?? [];
  const selected = choices.find((choice) => choice.id === answer || choice.label === answer);
  return selected ? { valid: true, value: selected.id } : { valid: false, value: undefined };
}

function replaceLatexFractions(value: string) {
  let normalized = value;
  for (let depth = 0; depth < 5; depth += 1) {
    const next = normalized.replace(
      /\\(?:dfrac|tfrac|frac)\s*\{([^{}]+)\}\s*\{([^{}]+)\}/gi,
      "($1)/($2)",
    );
    if (next === normalized) break;
    normalized = next;
  }
  return normalized;
}

function normalizeInterval(value: string) {
  const french = value.match(/^([\[\]])(.+);(.+)([\[\]])$/);
  if (french) {
    const [, rawLeft, rawStart, rawEnd, rawRight] = french;
    const left = rawLeft === "]" ? "(" : "[";
    const right = rawRight === "[" ? ")" : "]";
    return `${left}${rawStart.replace(/,/g, ".")};${rawEnd.replace(/,/g, ".")}${right}`;
  }
  const international = value.match(
    /^([[(])([+-]?(?:\d+(?:\.\d+)?|infinity)),([+-]?(?:\d+(?:\.\d+)?|infinity))([\])])$/,
  );
  if (international) {
    const [, left, start, end, right] = international;
    return `${left}${start};${end}${right}`;
  }
  return undefined;
}

/**
 * Canonicalise les notations usuelles saisies sur téléphone sans essayer de
 * devenir un moteur de calcul symbolique. Les alternatives sémantiques qui ne
 * sont pas déductibles du texte (par exemple m≠2 dans un contexte m∈R*)
 * restent à déclarer explicitement dans le tableau expectedAnswer.
 */
export function normalizeHomeworkAnswer(value: unknown) {
  let normalized = replaceLatexFractions(String(value ?? ""))
    .replace(/[−–—]/g, "-")
    .replace(/＋/g, "+")
    .replace(/∞/g, "infinity")
    .replace(/[≤⩽]/g, "<=")
    .replace(/[≥⩾]/g, ">=")
    .replace(/[≠]/g, "!=")
    .replace(/[≈≃]/g, "~")
    .replace(/ℝ/g, "r")
    .replace(/α/g, "alpha")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\\(?:left|right|displaystyle)\b/gi, "")
    .replace(/\\mathbb\s*(?:\{\s*r\s*\}|r)/gi, "r")
    .replace(/\\infty(?![a-z])/gi, "infinity")
    .replace(/\\alpha(?![a-z])/gi, "alpha")
    .replace(/\\(?:leq|le)(?![a-z])/gi, "<=")
    .replace(/\\(?:geq|ge)(?![a-z])/gi, ">=")
    .replace(/\\(?:neq|ne)(?![a-z])/gi, "!=")
    .replace(/\\(?:approx|simeq)(?![a-z])/gi, "~")
    .replace(/\\(?:setminus|backslash)(?![a-z])/gi, "\\")
    .replace(/\\[,;!:]/g, "")
    .replace(/\\\{/g, "{")
    .replace(/\\\}/g, "}")
    .replace(/\\cdot|\\times/g, "*")
    .replace(/[\s$]/g, "")
    .toLowerCase();

  normalized = normalized.replace(/\(([+-]?\d+(?:\.\d+)?)\)/g, "$1");
  const interval = normalizeInterval(normalized);
  if (interval) normalized = interval;
  else if (!/[\[\](){}]/.test(normalized)) {
    normalized = normalized.replace(/(\d),(\d)/g, "$1.$2");
  }

  // Les notations Dg=R, D_f=R et « domaine=R » portent la même réponse.
  normalized = normalized.replace(/^(?:d_?[a-z]+|domaine(?:de)?[a-z]*)=/, "");

  const excludedSet = normalized.match(/^r\\?\{(.+)\}$/);
  if (excludedSet) {
    const separator = excludedSet[1].includes(";") ? ";" : ",";
    const items = excludedSet[1]
      .split(separator)
      .map((item) => item.trim().replace(/(\d),(\d)/g, "$1.$2"))
      .filter(Boolean)
      .sort();
    normalized = `r\\{${items.join(",")}}`;
  }
  return normalized;
}

function numericExpression(value: string) {
  let candidate = value;
  const assignment = candidate.match(/^(?:alpha|[a-z])(?:=|~)(.+)$/);
  if (assignment) candidate = assignment[1];
  if (/^[+-]?\d+(?:\.\d+)?$/.test(candidate)) return Number(candidate);
  const fraction = candidate.match(/^([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)$/);
  if (!fraction || Number(fraction[2]) === 0) return undefined;
  return Number(fraction[1]) / Number(fraction[2]);
}

function alphaCoefficient(value: string) {
  let candidate = value.replace(/^f\(alpha\)=/, "").replace(/\*/g, "");
  if (candidate === "alpha" || candidate === "+alpha") return 1;
  if (candidate === "-alpha") return -1;
  let match = candidate.match(/^([+-]?\d+(?:\.\d+)?)alpha$/);
  if (match) return Number(match[1]);
  match = candidate.match(/^([+-]?\d+(?:\.\d+)?)alpha\/([+-]?\d+(?:\.\d+)?)$/);
  if (match && Number(match[2]) !== 0) return Number(match[1]) / Number(match[2]);
  match = candidate.match(/^([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)alpha$/);
  if (match && Number(match[2]) !== 0) return Number(match[1]) / Number(match[2]);
  return undefined;
}

function singleHomeworkAnswerEquivalent(expected: unknown, actual: unknown) {
  const canonicalExpected = normalizeHomeworkAnswer(expected);
  const canonicalActual = normalizeHomeworkAnswer(actual);
  if (!canonicalExpected || !canonicalActual) return false;
  if (canonicalExpected === canonicalActual) return true;

  const expectedNumber = numericExpression(canonicalExpected);
  const actualNumber = numericExpression(canonicalActual);
  if (expectedNumber != null && actualNumber != null && Number.isFinite(expectedNumber) && Number.isFinite(actualNumber)) {
    const approximate = canonicalExpected.includes("~");
    const tolerance = approximate ? Math.max(1e-4, Math.abs(expectedNumber) * 1e-6) : 1e-10;
    return Math.abs(expectedNumber - actualNumber) <= tolerance;
  }

  const expectedAlpha = alphaCoefficient(canonicalExpected);
  const actualAlpha = alphaCoefficient(canonicalActual);
  return expectedAlpha != null && actualAlpha != null && Math.abs(expectedAlpha - actualAlpha) <= 1e-10;
}

export function homeworkAnswersEquivalent(expected: unknown, actual: unknown) {
  const accepted = Array.isArray(expected) ? expected : [expected];
  return accepted.some((candidate) => singleHomeworkAnswerEquivalent(candidate, actual));
}

function answerFinalValue(answer: unknown) {
  if (answer && typeof answer === "object" && !Array.isArray(answer) && "finalAnswer" in answer) {
    return (answer as { finalAnswer?: unknown }).finalAnswer;
  }
  return answer;
}

function isHomeworkAnswerEmpty(answer: unknown) {
  if (answer == null) return true;
  if (typeof answer === "string") return answer.trim().length === 0;
  if (typeof answer !== "object" || Array.isArray(answer)) return false;
  const structured = answer as { finalAnswer?: unknown; reasoning?: unknown };
  return ![structured.finalAnswer, structured.reasoning].some(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
}

function autoCorrection(question: LocalQuestionRow, answer: unknown) {
  if (question.auto_points_max <= 0) return { correct: null, points: 0 };
  const expected = parseJson<unknown>(question.expected_answer_json, null);
  if (question.question_type === "qcm") {
    const resolved = resolveQcmAnswer(question, answer);
    if (!resolved.valid) throw new HomeworkOperationError("Choix invalide.", 400, "INVALID_HOMEWORK_ANSWER");
    const correct = JSON.stringify(resolved.value) === JSON.stringify(expected);
    return { correct, points: correct ? question.auto_points_max : 0 };
  }
  const finalAnswer = answerFinalValue(answer);
  if (typeof finalAnswer !== "string") throw new HomeworkOperationError("La réponse finale doit être du texte.", 400, "INVALID_HOMEWORK_ANSWER");
  const correct = homeworkAnswersEquivalent(expected, finalAnswer);
  return { correct, points: correct ? question.auto_points_max : 0 };
}

export function saveLocalHomeworkAnswer(
  actor: HomeworkActor,
  attemptId: string,
  questionId: string,
  answer: unknown,
  attachmentUrls: string[],
) {
  assertLocalCanCompose(actor);
  return database.transaction(() => {
    const attempt = localAttempt(attemptId);
    if (!attempt || attempt.user_id !== actor.id) throw new HomeworkOperationError("Tentative introuvable.", 404, "ATTEMPT_NOT_FOUND");
    if (attempt.status !== "in-progress") {
      return { saved: false, expired: false, questionId, serverNow: isoNow(), attemptStatus: attempt.status };
    }
    if (isExpired(attempt)) {
      const result = finalizeLocalHomeworkAttempt(actor, attemptId, true);
      return { saved: false, expired: true, questionId, serverNow: isoNow(), attemptStatus: result.status };
    }
    const question = database.prepare(`
      SELECT * FROM homework_questions WHERE id = ? AND quiz_id = ?
    `).get(questionId, attempt.quiz_id) as LocalQuestionRow | undefined;
    if (!question) throw new HomeworkOperationError("Question introuvable.", 404, "QUESTION_NOT_FOUND");
    if (isHomeworkAnswerEmpty(answer) && attachmentUrls.length === 0) {
      throw new HomeworkOperationError("Ajoute une réponse ou une pièce jointe.", 400, "EMPTY_HOMEWORK_ANSWER");
    }
    if (question.question_type === "qcm" && attachmentUrls.length > 0) {
      throw new HomeworkOperationError("Une question à choix ne reçoit pas de pièce jointe.", 400, "INVALID_HOMEWORK_ATTACHMENT");
    }
    if (question.grading_mode === "hybrid" && (
      !answer
      || typeof answer !== "object"
      || Array.isArray(answer)
      || typeof (answer as { finalAnswer?: unknown }).finalAnswer !== "string"
      || !(answer as { finalAnswer: string }).finalAnswer.trim()
    )) {
      throw new HomeworkOperationError(
        "Une réponse hybride doit séparer le résultat final de la démonstration.",
        400,
        "INVALID_HOMEWORK_HYBRID_ANSWER",
      );
    }
    const correction = autoCorrection(question, answer);
    const now = isoNow();
    database.prepare(`
      INSERT INTO homework_answers (
        attempt_id, question_id, answer_json, attachment_urls_json, correct, auto_points, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(attempt_id, question_id) DO UPDATE SET
        answer_json = excluded.answer_json,
        attachment_urls_json = excluded.attachment_urls_json,
        correct = excluded.correct,
        auto_points = excluded.auto_points,
        manual_points = NULL,
        review_comment = NULL,
        rubric_awards_json = NULL,
        updated_at = excluded.updated_at
    `).run(
      attemptId,
      questionId,
      JSON.stringify(answer ?? null),
      JSON.stringify(attachmentUrls),
      correction.correct == null ? null : correction.correct ? 1 : 0,
      correction.points,
      now,
    );
    return {
      saved: true,
      expired: false,
      questionId,
      answer,
      attachmentUrls,
      serverNow: now,
      attemptStatus: "in-progress" as const,
    };
  })();
}

export function deleteLocalHomeworkAnswer(
  actor: HomeworkActor,
  attemptId: string,
  questionId: string,
) {
  assertLocalCanCompose(actor);
  return database.transaction(() => {
    const attempt = localAttempt(attemptId);
    if (!attempt || attempt.user_id !== actor.id) {
      throw new HomeworkOperationError("Tentative introuvable.", 404, "ATTEMPT_NOT_FOUND");
    }
    if (attempt.status !== "in-progress") {
      return { deleted: false, expired: false, questionId, serverNow: isoNow(), attemptStatus: attempt.status };
    }
    if (isExpired(attempt)) {
      const result = finalizeLocalHomeworkAttempt(actor, attemptId, true);
      return { deleted: false, expired: true, questionId, serverNow: isoNow(), attemptStatus: result.status };
    }
    const question = database.prepare(`
      SELECT id FROM homework_questions WHERE id = ? AND quiz_id = ?
    `).get(questionId, attempt.quiz_id) as { id: string } | undefined;
    if (!question) throw new HomeworkOperationError("Question introuvable.", 404, "QUESTION_NOT_FOUND");

    database.prepare(`DELETE FROM homework_answers WHERE attempt_id = ? AND question_id = ?`)
      .run(attemptId, questionId);
    const now = isoNow();
    return {
      deleted: true,
      expired: false,
      questionId,
      serverNow: now,
      attemptStatus: "in-progress" as const,
    };
  })();
}

function finalizeLocalHomeworkAttempt(actor: HomeworkActor, attemptId: string, expired = false): HomeworkResult {
  assertLocalCanCompose(actor);
  return database.transaction(() => {
    let attempt = localAttempt(attemptId);
    if (!attempt || (attempt.user_id !== actor.id && actor.role !== "admin")) {
      throw new HomeworkOperationError("Tentative introuvable.", 404, "ATTEMPT_NOT_FOUND");
    }
    if (attempt.status === "in-progress") {
      const questions = localQuestions(attempt.quiz_id);
      const answers = new Map(localAnswers(attempt.id).map((answer) => [answer.question_id, answer]));
      const totalPoints = questions.reduce((total, question) => total + question.points, 0);
      const autoPoints = questions.reduce((total, question) => {
        if (question.is_neutralized === 1) return total + question.points;
        return total + (answers.get(question.id)?.auto_points ?? 0);
      }, 0);
      const pendingManualPoints = questions.reduce((total, question) => (
        question.is_neutralized !== 1 && question.manual_points_max > 0 && answers.has(question.id)
          ? total + question.manual_points_max
          : total
      ), 0);
      const submittedAt = isoNow();
      const deadline = attempt.expires_at ? Date.parse(attempt.expires_at) : Date.now();
      const actuallyExpired = expired || isExpired(attempt);
      const elapsedEnd = actuallyExpired ? Math.min(Date.now(), deadline) : Date.now();
      const timeSpent = Math.max(0, Math.round((elapsedEnd - Date.parse(attempt.started_at)) / 1000));
      const needsReview = pendingManualPoints > 0;
      const answeredCount = questions.reduce((total, question) => (
        question.is_neutralized === 1 || answers.has(question.id) ? total + 1 : total
      ), 0);
      const score = needsReview || totalPoints <= 0 ? null : Math.round((autoPoints / totalPoints) * 2000) / 100;
      database.prepare(`
        UPDATE homework_attempts SET
          status = ?, submitted_at = ?, time_spent_seconds = ?, auto_points = ?,
          pending_manual_points = ?, total_points = ?, score_out_of_20 = ?, review_status = ?
        WHERE id = ? AND status = 'in-progress'
      `).run(
        needsReview ? "awaiting-review" : "graded",
        submittedAt,
        timeSpent,
        autoPoints,
        pendingManualPoints,
        totalPoints,
        score,
        needsReview ? "pending" : "not-required",
        attemptId,
      );
      writeAuditLog(actor.id, actuallyExpired ? "homework.attempt.expire" : "homework.attempt.submit", attemptId, {
        answeredCount,
        questionCount: questions.length,
        pendingManualPoints,
      });
      attempt = localAttempt(attemptId)!;
    }
    return localHomeworkResult(actor, attempt, false);
  })();
}

export function submitLocalHomeworkAttempt(actor: HomeworkActor, attemptId: string) {
  return finalizeLocalHomeworkAttempt(actor, attemptId, false);
}

function localHomeworkResult(actor: HomeworkActor, attempt: LocalAttemptRow, allowAdminSecrets: boolean): HomeworkResult {
  const quiz = localQuiz(attempt.quiz_id);
  if (!quiz) throw new HomeworkOperationError("Devoir introuvable.", 404, "HOMEWORK_NOT_FOUND");
  assertLocalAccess(actor, quiz);
  if (attempt.status === "in-progress") throw new HomeworkOperationError("La copie n’est pas encore remise.", 409, "ATTEMPT_IN_PROGRESS");
  const questions = localQuestions(attempt.quiz_id);
  const answers = new Map(localAnswers(attempt.id).map((answer) => [answer.question_id, answer]));
  const answeredCount = questions.reduce((total, question) => (
    question.is_neutralized === 1 || answers.has(question.id) ? total + 1 : total
  ), 0);
  const correctionsAvailable = allowAdminSecrets || (quiz.corrections_published === 1 && attempt.review_status !== "pending");
  const result: HomeworkResult = {
    attemptId: attempt.id,
    homeworkId: attempt.quiz_id,
    status: attempt.status,
    submittedAt: attempt.submitted_at ?? attempt.started_at,
    timeSpentSeconds: attempt.time_spent_seconds ?? 0,
    gradingMode: quiz.grading_mode,
    reviewStatus: attempt.review_status,
    answeredCount,
    questionCount: questions.length,
    pendingManualPoints: attempt.pending_manual_points,
    totalPoints: attempt.total_points,
    correctionsAvailable,
  };
  if (correctionsAvailable) {
    result.autoGradedPoints = attempt.auto_points;
    result.scoreOutOf20 = attempt.score_out_of_20 ?? undefined;
    result.appreciation = attempt.score_out_of_20 == null ? undefined : appreciation(attempt.score_out_of_20);
    result.reviewComment = attempt.review_comment ?? undefined;
  }
  if (correctionsAvailable) {
    result.corrections = questions.map((question) => {
      const answer = answers.get(question.id);
      const rubric = parseJson<HomeworkRubricCriterion[]>(question.rubric_json, []);
      const awarded = parseJson<Array<{ id: string; pointsAwarded: number }>>(answer?.rubric_awards_json, []);
      return {
        questionId: question.id,
        label: question.question_label,
        promptMarkdown: question.prompt_markdown,
        choices: normalizeChoices(parseJson<unknown>(question.choices_json, null)),
        studentAnswer: parseJson<unknown>(answer?.answer_json, null),
        attachmentUrls: parseJson<string[]>(answer?.attachment_urls_json, []),
        ...(question.is_neutralized === 1
          ? {}
          : { expectedAnswer: parseJson<unknown>(question.expected_answer_json, null) }),
        correct: question.is_neutralized === 1 ? true : question.auto_points_max > 0 ? Boolean(answer?.correct) : undefined,
        pointsAwarded: question.is_neutralized === 1
          ? question.points
          : (answer?.auto_points ?? 0) + (answer?.manual_points ?? 0),
        pointsMax: question.points,
        explanationMarkdown: question.explanation_markdown,
        reviewComment: answer?.review_comment ?? undefined,
        rubricCriteria: rubric.length > 0 ? rubric.map((criterion) => ({
          ...criterion,
          pointsAwarded: awarded.find((item) => item.id === criterion.id)?.pointsAwarded ?? 0,
          status: "reviewed" as const,
        })) : undefined,
      };
    });
  }
  return result;
}

export function getLocalHomeworkResult(actor: HomeworkActor, attemptId: string) {
  const attempt = localAttempt(attemptId);
  if (!attempt || (attempt.user_id !== actor.id && actor.role !== "admin")) {
    throw new HomeworkOperationError("Tentative introuvable.", 404, "ATTEMPT_NOT_FOUND");
  }
  if (attempt.status === "in-progress" && isExpired(attempt)) return finalizeLocalHomeworkAttempt(actor, attemptId, true);
  return localHomeworkResult(actor, attempt, actor.role === "admin");
}

export function listLocalHomeworkReviews(status: HomeworkReviewStatus): HomeworkReviewItem[] {
  return database.prepare(`
    SELECT
      attempt.id AS attempt_id, attempt.quiz_id, quiz.title, quiz.institution, quiz.academic_year,
      user.id AS user_id, user.name, user.email, user.level_id, attempt.submitted_at,
      attempt.review_status, attempt.auto_points, attempt.pending_manual_points, attempt.total_points
    FROM homework_attempts attempt
    JOIN homework_quizzes quiz ON quiz.id = attempt.quiz_id
    JOIN users user ON user.id = attempt.user_id
    WHERE attempt.review_status = ?
    ORDER BY attempt.submitted_at
  `).all(status).map((raw) => {
    const row = raw as Record<string, string | number | null>;
    return {
      attemptId: String(row.attempt_id),
      homeworkId: String(row.quiz_id),
      homeworkTitle: String(row.title),
      institution: String(row.institution),
      academicYear: String(row.academic_year),
      student: {
        id: String(row.user_id),
        name: String(row.name),
        email: String(row.email),
        levelId: String(row.level_id),
      },
      submittedAt: String(row.submitted_at),
      reviewStatus: row.review_status as HomeworkReviewStatus,
      autoGradedPoints: Number(row.auto_points),
      pendingManualPoints: Number(row.pending_manual_points),
      totalPoints: Number(row.total_points),
    };
  });
}

export function getLocalHomeworkReview(attemptId: string) {
  const attempt = localAttempt(attemptId);
  if (!attempt || attempt.status === "in-progress") throw new HomeworkOperationError("Copie introuvable.", 404, "ATTEMPT_NOT_FOUND");
  const profile = database.prepare("SELECT id, name, email, level_id FROM users WHERE id = ?").get(attempt.user_id) as {
    id: string; name: string; email: string; level_id: string;
  };
  const quiz = localQuiz(attempt.quiz_id)!;
  const answers = new Map(localAnswers(attempt.id).map((answer) => [answer.question_id, answer]));
  return {
    attempt: toAttempt(attempt),
    homework: homeworkSummary(quiz, {
      id: profile.id,
      role: "admin",
      accountType: "student",
      levelId: profile.level_id,
    }),
    student: { id: profile.id, name: profile.name, email: profile.email, levelId: profile.level_id },
    questions: localQuestions(attempt.quiz_id).map((question) => {
      const answer = answers.get(question.id);
      return {
        ...publicQuestion(question),
        studentAnswer: parseJson<unknown>(answer?.answer_json, null),
        attachmentUrls: parseJson<string[]>(answer?.attachment_urls_json, []),
        ...(question.is_neutralized === 1
          ? {}
          : { expectedAnswer: parseJson<unknown>(question.expected_answer_json, null) }),
        explanationMarkdown: question.explanation_markdown,
        rubricCriteria: parseJson<HomeworkRubricCriterion[]>(question.rubric_json, []),
        autoPointsAwarded: answer?.auto_points ?? 0,
        manualPointsAwarded: question.manual_points_max > 0 ? answer?.manual_points ?? undefined : 0,
        pointsAwarded: question.manual_points_max > 0
          ? answer?.manual_points ?? undefined
          : answer?.auto_points ?? 0,
        reviewComment: answer?.review_comment ?? undefined,
      };
    }),
  };
}

export function reviewLocalHomeworkAttempt(actor: HomeworkActor, attemptId: string, input: HomeworkReviewInput) {
  return database.transaction(() => {
    const attempt = localAttempt(attemptId);
    if (!attempt || attempt.review_status !== "pending") {
      throw new HomeworkOperationError("Cette copie n’attend pas de correction.", 409, "REVIEW_NOT_PENDING");
    }
    const questions = localQuestions(attempt.quiz_id).filter((question) => question.manual_points_max > 0);
    const answers = new Map(localAnswers(attempt.id).map((answer) => [answer.question_id, answer]));
    const expectedQuestions = questions.filter((question) => question.is_neutralized !== 1 && answers.has(question.id));
    if (input.reviews.length !== expectedQuestions.length || new Set(input.reviews.map((review) => review.questionId)).size !== input.reviews.length) {
      throw new HomeworkOperationError("Chaque réponse rédigée doit être évaluée une seule fois.", 400, "INCOMPLETE_HOMEWORK_REVIEW");
    }
    for (const question of expectedQuestions) {
      const review = input.reviews.find((item) => item.questionId === question.id);
      if (!review) throw new HomeworkOperationError("Correction incomplète.", 400, "INCOMPLETE_HOMEWORK_REVIEW");
      const rubric = parseJson<HomeworkRubricCriterion[]>(question.rubric_json, []);
      if (review.pointsAwarded < 0 || review.pointsAwarded > question.manual_points_max) {
        throw new HomeworkOperationError(`Barème invalide pour ${question.question_label}.`, 400, "INVALID_REVIEW_SCORE");
      }
      if (rubric.length > 0) {
        const criteria = review.criteria ?? [];
        if (criteria.length !== rubric.length || new Set(criteria.map((item) => item.id)).size !== criteria.length) {
          throw new HomeworkOperationError(`Tous les critères de ${question.question_label} doivent être notés.`, 400, "INCOMPLETE_RUBRIC");
        }
        const sum = rubric.reduce((total, criterion) => {
          const award = criteria.find((item) => item.id === criterion.id);
          if (!award || award.pointsAwarded < 0 || award.pointsAwarded > criterion.pointsMax) {
            throw new HomeworkOperationError(`Critère invalide : ${criterion.label}.`, 400, "INVALID_RUBRIC_SCORE");
          }
          return total + award.pointsAwarded;
        }, 0);
        if (Math.abs(sum - review.pointsAwarded) > 0.0001) {
          throw new HomeworkOperationError("Le total des critères ne correspond pas aux points attribués.", 400, "RUBRIC_TOTAL_MISMATCH");
        }
      }
    }
    const now = isoNow();
    for (const review of input.reviews) {
      database.prepare(`
        UPDATE homework_answers SET manual_points = ?, review_comment = ?, rubric_awards_json = ?, updated_at = ?
        WHERE attempt_id = ? AND question_id = ?
      `).run(
        review.pointsAwarded,
        review.comment?.trim() || null,
        JSON.stringify(review.criteria ?? []),
        now,
        attemptId,
        review.questionId,
      );
    }
    const manualPoints = (database.prepare(`
      SELECT COALESCE(SUM(manual_points), 0) AS total FROM homework_answers WHERE attempt_id = ?
    `).get(attemptId) as { total: number }).total;
    const score = attempt.total_points > 0
      ? Math.round(((attempt.auto_points + manualPoints) / attempt.total_points) * 2000) / 100
      : 0;
    database.prepare(`
      UPDATE homework_attempts SET status = 'graded', review_status = 'completed',
        pending_manual_points = 0, score_out_of_20 = ?, review_comment = ?, reviewed_by = ?, reviewed_at = ?
      WHERE id = ? AND review_status = 'pending'
    `).run(score, input.overallComment?.trim() || null, actor.id, now, attemptId);
    writeAuditLog(actor.id, "homework.attempt.review", attemptId, { scoreOutOf20: score, reviewedQuestions: input.reviews.length });
    return localHomeworkResult(actor, localAttempt(attemptId)!, true);
  })();
}

export function importLocalHomeworkPackage(
  actor: HomeworkActor,
  input: HomeworkImportPackage,
): HomeworkImportResult {
  return database.transaction(() => {
    const payloadHash = homeworkPayloadHash(input);
    const alreadyImported = database.prepare(`
      SELECT * FROM homework_quizzes WHERE import_id = ? LIMIT 1
    `).get(input.importId) as LocalQuizRow | undefined;
    if (alreadyImported) {
      if (alreadyImported.stable_id !== input.stableId || alreadyImported.payload_hash !== payloadHash) {
        throw new HomeworkOperationError(
          "Cet identifiant d’import a déjà été utilisé avec un paquet différent.",
          409,
          "HOMEWORK_IMPORT_ID_CONFLICT",
        );
      }
      return {
        homework: homeworkSummary(alreadyImported, actor),
        imported: false,
        version: alreadyImported.version,
      };
    }

    const slugConflict = database.prepare(`
      SELECT stable_id FROM homework_quizzes
      WHERE slug = ? AND stable_id <> ? LIMIT 1
    `).get(input.slug, input.stableId) as { stable_id: string } | undefined;
    if (slugConflict) {
      throw new HomeworkOperationError(
        "Ce slug appartient déjà à un autre devoir.",
        409,
        "HOMEWORK_SLUG_CONFLICT",
      );
    }

    const identityConflict = database.prepare(`
      SELECT stable_id FROM homework_quizzes
      WHERE subject_id = ? AND level_id = ? AND series_id = ? AND number = ?
        AND LOWER(TRIM(institution)) = LOWER(TRIM(?)) AND academic_year = ?
        AND stable_id <> ?
      LIMIT 1
    `).get(
      input.subject.id,
      input.level.id,
      input.series.id,
      input.number,
      input.institution,
      input.academicYear,
      input.stableId,
    ) as { stable_id: string } | undefined;
    if (identityConflict) {
      throw new HomeworkOperationError(
        "Un autre devoir possède déjà ce numéro pour cet établissement et cette année scolaire.",
        409,
        "HOMEWORK_IDENTITY_CONFLICT",
      );
    }

    const stableVersion = database.prepare(`
      SELECT * FROM homework_quizzes
      WHERE stable_id = ? ORDER BY version DESC LIMIT 1
    `).get(input.stableId) as LocalQuizRow | undefined;
    if (stableVersion && (
      stableVersion.slug !== input.slug
      || stableVersion.number !== input.number
      || stableVersion.institution !== input.institution
      || stableVersion.academic_year !== input.academicYear
      || stableVersion.subject_id !== input.subject.id
      || stableVersion.level_id !== input.level.id
      || stableVersion.series_id !== input.series.id
    )) {
      throw new HomeworkOperationError(
        "L’identifiant stable appartient déjà à un devoir dont les métadonnées sont différentes.",
        409,
        "HOMEWORK_STABLE_METADATA_CONFLICT",
      );
    }

    const version = (database.prepare(`
      SELECT COALESCE(MAX(version), 0) AS version
      FROM homework_quizzes WHERE stable_id = ?
    `).get(input.stableId) as { version: number }).version + 1;
    const quizId = randomUUID();

    database.prepare(`
      UPDATE homework_quizzes
      SET published = 0, subject_open = 0
      WHERE stable_id = ? AND published = 1
    `).run(input.stableId);

    database.prepare(`
      INSERT INTO homework_quizzes (
        id, stable_id, slug, title, number, institution, academic_year,
        subject_id, subject_name, subject_icon, level_id, level_name,
        series_id, series_name, duration_seconds, grading_mode,
        instructions_markdown, source_notice, published, subject_open, corrections_published,
        max_attempts, version, import_id, payload_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)
    `).run(
      quizId,
      input.stableId,
      input.slug,
      input.title,
      input.number,
      input.institution,
      input.academicYear,
      input.subject.id,
      input.subject.name,
      input.subject.icon ?? null,
      input.level.id,
      input.level.name,
      input.series.id,
      input.series.name,
      input.durationSeconds,
      input.gradingMode,
      input.instructionsMarkdown?.trim() || null,
      input.sourceNotice?.trim() || null,
      input.subjectPublished ? 1 : 0,
      input.correctionsPublished ? 1 : 0,
      input.maxAttempts,
      version,
      input.importId,
      payloadHash,
    );

    let order = 0;
    const insertQuestion = database.prepare(`
      INSERT INTO homework_questions (
        id, quiz_id, section_id, section_title, section_order,
        exercise_id, exercise_title, exercise_order, exercise_instructions_markdown, order_number,
        question_label, prompt_markdown, question_type, answer_kind,
        grading_mode, is_neutralized, choices_json, expected_answer_json,
        points, auto_points_max, manual_points_max, explanation_markdown,
        rubric_json, image_url, image_alt, source_notice
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const section of input.sections) {
      for (const exercise of section.exercises) {
        for (const question of exercise.questions) {
          order += 1;
          insertQuestion.run(
            randomUUID(),
            quizId,
            section.id,
            section.title,
            section.order,
            exercise.id,
            exercise.title,
            exercise.order,
            exercise.instructionsMarkdown?.trim() || null,
            order,
            question.label,
            question.promptMarkdown,
            question.type,
            question.answerKind,
            question.gradingMode,
            question.isNeutralized ? 1 : 0,
            question.choices ? JSON.stringify(question.choices) : null,
            JSON.stringify(question.expectedAnswer ?? null),
            question.points,
            question.autoPoints,
            question.manualPoints,
            question.explanationMarkdown,
            JSON.stringify(question.rubricCriteria ?? []),
            question.imageUrl ?? null,
            question.imageAlt ?? null,
            question.sourceNotice?.trim() || null,
          );
        }
      }
    }

    writeAuditLog(actor.id, "homework.version.import", input.stableId, {
      quizId,
      importId: input.importId,
      version,
      questionCount: order,
      subjectPublished: input.subjectPublished,
      correctionsPublished: input.correctionsPublished,
    });
    return { homework: homeworkSummary(localQuiz(quizId)!, actor), imported: true, version };
  })();
}

export function setLocalHomeworkPublication(
  actor: HomeworkActor,
  homeworkReference: string,
  input: { subjectPublished?: boolean; correctionsPublished?: boolean },
) {
  return database.transaction(() => {
    const quiz = localQuiz(homeworkReference) ?? localQuizByReference(homeworkReference);
    if (!quiz) throw new HomeworkOperationError("Devoir introuvable.", 404, "HOMEWORK_NOT_FOUND");
    if (quiz.published !== 1 && input.subjectPublished != null) {
      throw new HomeworkOperationError(
        "Une version archivée ne peut pas redevenir un sujet actif.",
        409,
        "HOMEWORK_ARCHIVED_SUBJECT_IMMUTABLE",
      );
    }
    const nextSubjectOpen = input.subjectPublished ?? quiz.subject_open === 1;
    const nextCorrectionsPublished = input.correctionsPublished ?? quiz.corrections_published === 1;
    if (nextSubjectOpen && nextCorrectionsPublished) {
      throw new HomeworkOperationError(
        "Ferme d’abord le sujet avant de publier son corrigé.",
        409,
        "HOMEWORK_CORRECTION_REQUIRES_CLOSED_SUBJECT",
      );
    }
    if (input.correctionsPublished === true) {
      const expiredAttempts = database.prepare(`
        SELECT id FROM homework_attempts
        WHERE quiz_id = ? AND status = 'in-progress'
          AND expires_at IS NOT NULL AND expires_at <= ?
      `).all(quiz.id, isoNow()) as Array<{ id: string }>;
      for (const expiredAttempt of expiredAttempts) {
        finalizeLocalHomeworkAttempt(actor, expiredAttempt.id, true);
      }
      const active = (database.prepare(`
        SELECT COUNT(*) AS total FROM homework_attempts WHERE quiz_id = ? AND status = 'in-progress'
      `).get(quiz.id) as { total: number }).total;
      const pending = (database.prepare(`
        SELECT COUNT(*) AS total FROM homework_attempts WHERE quiz_id = ? AND review_status = 'pending'
      `).get(quiz.id) as { total: number }).total;
      const incomplete = (database.prepare(`
        SELECT COUNT(*) AS total FROM homework_questions
        WHERE quiz_id = ? AND TRIM(explanation_markdown) = ''
      `).get(quiz.id) as { total: number }).total;
      if (active > 0 || pending > 0 || incomplete > 0) {
        throw new HomeworkOperationError(
          active > 0
            ? "Toutes les tentatives actives doivent être remises avant de publier le corrigé."
            : pending > 0
              ? "Toutes les copies en attente doivent être corrigées avant de publier le corrigé."
              : "La correction détaillée est incomplète.",
          409,
          active > 0
            ? "HOMEWORK_ATTEMPTS_ACTIVE"
            : pending > 0
              ? "HOMEWORK_REVIEWS_PENDING"
              : "HOMEWORK_CORRECTION_INCOMPLETE",
        );
      }
    }
    database.prepare(`
      UPDATE homework_quizzes SET
        subject_open = COALESCE(?, subject_open),
        corrections_published = COALESCE(?, corrections_published)
      WHERE id = ?
    `).run(
      input.subjectPublished == null ? null : input.subjectPublished ? 1 : 0,
      input.correctionsPublished == null ? null : input.correctionsPublished ? 1 : 0,
      quiz.id,
    );
    writeAuditLog(actor.id, "homework.publication.update", quiz.stable_id, input);
    return homeworkSummary(localQuiz(quiz.id)!, actor);
  })();
}

function homeworkSupabaseClient(accessToken: string) {
  return createClient(config.supabaseUrl, config.supabasePublishableKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

function homeworkRpcError(error: { message: string; code?: string }) {
  const message = error.message;
  const status = error.code === "42501" || /admin_required|contenu_non_autorise|homework_access_denied|homework_composition_forbidden/.test(message) ? 403
    : /introuvable|not_found/.test(message) ? 404
      : /tentative_close|temps_ecoule|quota|non_terminee|review_not_pending|attempt_limit|attempt_required|attempts_active|reviews_pending|correction_requires_closed|correction_incomplete|archived_subject_immutable|_conflict/.test(message) ? 409
        : error.code === "PGRST202" ? 503
          : 400;
  const domainCode = message.trim().replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "").toUpperCase();
  return new SupabaseOperationError(message, status, domainCode || error.code);
}

async function homeworkRpc<T>(accessToken: string, name: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await homeworkSupabaseClient(accessToken).rpc(name, args);
  if (error) throw homeworkRpcError(error);
  return data as T;
}

export function listSupabaseHomeworks(
  accessToken: string,
  filters: { subjectId?: string; academicYear?: string; institution?: string; levelId?: string },
) {
  return homeworkRpc<HomeworkSummary[]>(accessToken, "list_homeworks_v1", {
    p_subject_id: filters.subjectId ?? null,
    p_academic_year: filters.academicYear ?? null,
    p_institution: filters.institution ?? null,
    p_level_id: filters.levelId ?? null,
  });
}

export async function getSupabaseHomework(accessToken: string, homeworkReference: string): Promise<HomeworkDefinition> {
  const payload = await homeworkRpc<{
    summary: HomeworkSummary;
    instructionsMarkdown?: string;
    sourceNotice?: string;
    questions: Array<HomeworkPublicQuestion & {
      sectionId?: string; sectionTitle?: string; sectionOrder?: number;
      exerciseId?: string; exerciseTitle?: string; exerciseOrder?: number;
      exerciseInstructionsMarkdown?: string;
    }>;
  }>(accessToken, "get_homework_public_v1", { p_homework_ref: homeworkReference });
  return groupHomeworkQuestions(payload.summary, payload.instructionsMarkdown, payload.questions, payload.sourceNotice);
}

export function startSupabaseHomeworkAttempt(accessToken: string, homeworkReference: string) {
  return homeworkRpc<HomeworkAttempt>(accessToken, "start_homework_attempt_v1", { p_homework_ref: homeworkReference });
}

export function saveSupabaseHomeworkAnswer(
  accessToken: string,
  attemptId: string,
  questionId: string,
  answer: unknown,
  attachmentUrls: string[],
) {
  return homeworkRpc<{
    saved: boolean; expired: boolean; questionId: string; answer?: unknown; attachmentUrls?: string[];
    serverNow: string; attemptStatus: HomeworkAttempt["status"];
  }>(accessToken, "save_homework_answer_v1", {
    p_attempt_id: attemptId,
    p_question_id: questionId,
    p_answer: answer ?? null,
    p_attachment_urls: attachmentUrls,
  });
}

export function deleteSupabaseHomeworkAnswer(
  accessToken: string,
  attemptId: string,
  questionId: string,
) {
  return homeworkRpc<{
    deleted: boolean; expired: boolean; questionId: string;
    serverNow: string; attemptStatus: HomeworkAttempt["status"];
  }>(accessToken, "delete_homework_answer_v1", {
    p_attempt_id: attemptId,
    p_question_id: questionId,
  });
}

export function submitSupabaseHomeworkAttempt(accessToken: string, attemptId: string) {
  return homeworkRpc<HomeworkResult>(accessToken, "finalize_homework_attempt_v1", { p_attempt_id: attemptId });
}

export function getSupabaseHomeworkResult(accessToken: string, attemptId: string) {
  return homeworkRpc<HomeworkResult>(accessToken, "get_homework_result_v1", { p_attempt_id: attemptId });
}

export function listSupabaseHomeworkReviews(accessToken: string, status: HomeworkReviewStatus) {
  return homeworkRpc<HomeworkReviewItem[]>(accessToken, "list_homework_reviews_v1", { p_status: status });
}

export function getSupabaseHomeworkReview(accessToken: string, attemptId: string) {
  return homeworkRpc<Record<string, unknown>>(accessToken, "get_homework_review_v1", { p_attempt_id: attemptId });
}

export function reviewSupabaseHomeworkAttempt(
  accessToken: string,
  attemptId: string,
  input: HomeworkReviewInput,
) {
  return homeworkRpc<HomeworkResult>(accessToken, "review_homework_attempt_v1", {
    p_attempt_id: attemptId,
    p_reviews: input.reviews,
    p_comment: input.overallComment ?? null,
  });
}

export function setSupabaseHomeworkPublication(
  accessToken: string,
  homeworkReference: string,
  input: { subjectPublished?: boolean; correctionsPublished?: boolean },
) {
  return homeworkRpc<HomeworkSummary>(accessToken, "set_homework_publication_v1", {
    p_homework_ref: homeworkReference,
    p_subject_open: input.subjectPublished ?? null,
    p_corrections_published: input.correctionsPublished ?? null,
  });
}

export function importSupabaseHomeworkPackage(accessToken: string, input: HomeworkImportPackage) {
  return homeworkRpc<HomeworkImportResult>(accessToken, "import_homework_package_v1", {
    p_payload: input,
  });
}
