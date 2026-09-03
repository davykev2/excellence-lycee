export type HomeworkGradingMode = "auto" | "manual" | "hybrid";

export type HomeworkStatus = "available" | "in-progress" | "completed";
export type HomeworkAttemptStatus = "in-progress" | "submitted" | "awaiting-review" | "graded";
export type HomeworkReviewStatus = "not-required" | "pending" | "completed";
export type HomeworkQuestionType = "qcm" | "texte";
export type HomeworkAnswerKind =
  | "single-choice"
  | "true-false"
  | "short-text"
  | "number"
  | "formula"
  | "essay";

export interface HomeworkChoice {
  id: string;
  label: string;
  contentMarkdown: string;
}

export interface HomeworkRubricCriterion {
  id: string;
  label: string;
  pointsMax: number;
}

export interface HomeworkQuestion {
  id: string;
  order: number;
  label: string;
  promptMarkdown: string;
  type: HomeworkQuestionType;
  answerKind: HomeworkAnswerKind;
  gradingMode: HomeworkGradingMode;
  isNeutralized?: boolean;
  choices?: HomeworkChoice[];
  points: number;
  /** Portion checked immediately from the final answer. */
  autoPoints?: number;
  /** Portion awarded after a human reads the reasoning. */
  manualPoints?: number;
  imageUrl?: string;
  imageAlt?: string;
  sourceNotice?: string;
  rubricCriteria?: HomeworkRubricCriterion[];
}

export interface HomeworkExercise {
  id: string;
  title: string;
  order: number;
  points?: number;
  instructionsMarkdown?: string;
  questions: HomeworkQuestion[];
}

export interface HomeworkSection {
  id: string;
  title: string;
  order: number;
  exercises: HomeworkExercise[];
}

export interface HomeworkSummary {
  id: string;
  stableId: string;
  slug: string;
  title: string;
  version?: number;
  editorialStatus?: "published" | "archived";
  number: number;
  institution: string;
  academicYear: string;
  subject: { id: string; name: string; icon?: string };
  level: { id: string; name: string };
  series: { id: string; name: string };
  durationSeconds: number;
  gradingMode: HomeworkGradingMode;
  subjectPublished?: boolean;
  correctionsPublished?: boolean;
  exerciseCount?: number;
  questionCount: number;
  totalPoints: number;
  scoreMax?: number;
  attemptsUsed: number;
  maxAttempts: number;
  activeAttemptId?: string;
  latestAttemptId?: string;
  status: HomeworkStatus;
}

export interface HomeworkDefinition extends HomeworkSummary {
  instructionsMarkdown?: string;
  sourceNotice?: string;
  pointsScale?: number;
  sections: HomeworkSection[];
}

export interface HomeworkFreeAnswer {
  finalAnswer?: string;
  reasoning?: string;
}

export type HomeworkAnswerValue = string | HomeworkFreeAnswer;

export interface HomeworkStoredAnswer {
  answer: HomeworkAnswerValue;
  attachmentUrls: string[];
}

export type HomeworkAnswers = Record<string, HomeworkStoredAnswer>;

export interface HomeworkAttempt {
  id: string;
  homeworkId: string;
  attemptNumber: number;
  status: HomeworkAttemptStatus;
  startedAt: string;
  expiresAt?: string;
  submittedAt?: string;
  serverNow: string;
  answers: HomeworkAnswers;
  answeredCount: number;
  questionCount: number;
}

export interface HomeworkCorrectionRubricCriterion extends HomeworkRubricCriterion {
  pointsAwarded: number;
  status?: "met" | "partial" | "not-met";
}

export interface HomeworkCorrectionEntry {
  questionId: string;
  label?: string;
  promptMarkdown?: string;
  choices?: HomeworkChoice[];
  studentAnswer?: HomeworkAnswerValue | null;
  attachmentUrls: string[];
  expectedAnswer?: string | string[];
  correct?: boolean;
  pointsAwarded: number;
  pointsMax: number;
  explanationMarkdown?: string;
  reviewComment?: string;
  rubricCriteria?: HomeworkCorrectionRubricCriterion[];
}

export interface HomeworkResult {
  attemptId: string;
  homeworkId: string;
  status: Exclude<HomeworkAttemptStatus, "in-progress">;
  submittedAt: string;
  timeSpentSeconds: number;
  gradingMode: HomeworkGradingMode;
  reviewStatus: HomeworkReviewStatus;
  answeredCount: number;
  questionCount: number;
  /** Hidden until the administration publishes the result and correction. */
  autoGradedPoints?: number;
  pendingManualPoints: number;
  totalPoints: number;
  provisionalScoreOutOf20?: number;
  scoreOutOf20?: number;
  appreciation?: { label: string; message: string };
  reviewComment?: string;
  correctionsAvailable: boolean;
  corrections?: HomeworkCorrectionEntry[];
}

export interface HomeworkFilters {
  subjectId?: string;
  academicYear?: string;
  institution?: string;
  levelId?: string;
}

export function homeworkQuestions(homework: Pick<HomeworkDefinition, "sections">) {
  return homework.sections
    .flatMap((section) => section.exercises)
    .sort((left, right) => left.order - right.order)
    .flatMap((exercise) => exercise.questions.slice().sort((left, right) => left.order - right.order));
}

export function homeworkExercises(homework: Pick<HomeworkDefinition, "sections">) {
  return homework.sections
    .slice()
    .sort((left, right) => left.order - right.order)
    .flatMap((section) => section.exercises.slice().sort((left, right) => left.order - right.order));
}

export function isHomeworkAnswerComplete(answer?: HomeworkStoredAnswer) {
  if (!answer) return false;
  if (typeof answer.answer === "string") return Boolean(answer.answer.trim());
  return Boolean(answer.answer.finalAnswer?.trim() || answer.answer.reasoning?.trim() || answer.attachmentUrls.length);
}

export function homeworkAnsweredCount(answers: HomeworkAnswers) {
  return Object.values(answers).filter(isHomeworkAnswerComplete).length;
}

export function homeworkDisplayPoints(points: number, homework: Pick<HomeworkDefinition, "pointsScale">) {
  return points / (homework.pointsScale ?? 1);
}

export function homeworkScoreMax(homework: Pick<HomeworkDefinition, "scoreMax" | "totalPoints" | "pointsScale">) {
  return homework.scoreMax ?? homeworkDisplayPoints(homework.totalPoints, homework);
}

export function formatHomeworkDuration(durationSeconds: number) {
  const totalMinutes = Math.max(0, Math.round(durationSeconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!hours) return `${minutes} min`;
  if (!minutes) return `${hours} h`;
  return `${hours} h ${String(minutes).padStart(2, "0")}`;
}

export function formatHomeworkTimer(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;
  return [hours, minutes, remainingSeconds].map((value) => String(value).padStart(2, "0")).join(":");
}
