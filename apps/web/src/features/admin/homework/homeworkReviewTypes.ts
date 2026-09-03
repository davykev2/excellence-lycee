export type HomeworkReviewStatus = "pending" | "completed";

export type HomeworkAttemptStatus = "awaiting-review" | "graded";

export type HomeworkGradingMode = "auto" | "manual" | "hybrid";

export type HomeworkAnswerKind =
  | "single-choice"
  | "true-false"
  | "short-text"
  | "number"
  | "formula"
  | "essay";

export interface HomeworkReviewStudent {
  id: string;
  name: string;
  email: string;
  levelId: string;
}

export interface HomeworkReviewItem {
  attemptId: string;
  homeworkId: string;
  homeworkTitle: string;
  institution: string;
  academicYear: string;
  student: HomeworkReviewStudent;
  submittedAt: string;
  reviewStatus: HomeworkReviewStatus;
  autoGradedPoints: number;
  pendingManualPoints: number;
  totalPoints: number;
}

export interface HomeworkAttemptAnswer {
  answer: string;
  attachmentUrls: string[];
}

export type HomeworkReviewAnswer = string | {
  finalAnswer?: string;
  reasoning?: string;
} | null;

export interface HomeworkAttempt {
  id: string;
  homeworkId: string;
  attemptNumber: number;
  status: HomeworkAttemptStatus;
  startedAt: string;
  expiresAt?: string;
  submittedAt?: string;
  serverNow: string;
  answers: Record<string, HomeworkAttemptAnswer>;
  answeredCount: number;
  questionCount: number;
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
  attemptsUsed: number;
  maxAttempts: number;
  activeAttemptId?: string;
  status: "available" | "in-progress" | "completed";
}

export interface HomeworkRubricCriterion {
  id: string;
  label: string;
  pointsMax: number;
  pointsAwarded?: number;
  status?: string;
}

export interface HomeworkReviewChoice {
  id: string;
  label: string;
  contentMarkdown: string;
}

export interface HomeworkReviewQuestion {
  id: string;
  order: number;
  label: string;
  promptMarkdown: string;
  type: "qcm" | "texte";
  answerKind: HomeworkAnswerKind;
  gradingMode: HomeworkGradingMode;
  choices?: HomeworkReviewChoice[];
  points: number;
  /** Enveloppe maximale réservée à la correction automatique. */
  autoPoints?: number;
  /** Points déjà accordés par le moteur. Ils ne sont jamais modifiables dans la revue. */
  autoPointsAwarded?: number;
  /** Enveloppe maximale réservée à l'évaluation humaine. */
  manualPoints?: number;
  /** Points humains déjà enregistrés sur une copie terminée. */
  manualPointsAwarded?: number;
  imageUrl?: string;
  imageAlt?: string;
  isNeutralized: boolean;
  studentAnswer: HomeworkReviewAnswer;
  attachmentUrls: string[];
  expectedAnswer: unknown;
  explanationMarkdown: string;
  rubricCriteria: HomeworkRubricCriterion[];
  pointsAwarded?: number;
  reviewComment?: string;
}

export interface HomeworkReviewDetail {
  attempt: HomeworkAttempt;
  homework: HomeworkSummary;
  student: HomeworkReviewStudent;
  questions: HomeworkReviewQuestion[];
}

export interface HomeworkReviewCriterionPayload {
  id: string;
  pointsAwarded: number;
}

export interface HomeworkQuestionReviewPayload {
  questionId: string;
  pointsAwarded: number;
  comment?: string;
  criteria?: HomeworkReviewCriterionPayload[];
}

export interface HomeworkReviewPayload {
  reviews: HomeworkQuestionReviewPayload[];
  overallComment?: string;
}

export interface HomeworkResult {
  status: "graded";
  reviewStatus: "completed";
  scoreOutOf20: number;
  correctionsAvailable: boolean;
}

export type HomeworkImportPackage = Record<string, unknown>;

export interface HomeworkImportIssue {
  path?: string;
  message: string;
}

export interface HomeworkImportServerValidation {
  valid?: boolean;
  errors?: Array<string | HomeworkImportIssue>;
  warnings?: Array<string | HomeworkImportIssue>;
}

export interface HomeworkImportResponse {
  homework: HomeworkSummary & {
    subjectPublished?: boolean;
    correctionsPublished?: boolean;
  };
  validation?: HomeworkImportServerValidation;
  imported?: boolean;
  version?: number;
}

export interface HomeworkPublicationPayload {
  subjectPublished?: boolean;
  correctionsPublished?: boolean;
}
