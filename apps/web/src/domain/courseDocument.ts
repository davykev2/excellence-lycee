import type { LessonInteraction, LearningPath } from "./paths";

/** A readable document, independent of the historical progression/XP structure. */
export interface CourseWorkedExamplePart {
  id: string;
  label: string;
  prompt: string;
  solution: string;
}

export interface CourseWorkedExample {
  id: string;
  title: string;
  prompt: string;
  solution?: string;
  parts?: CourseWorkedExamplePart[];
  nativeFigure?: CourseNativeFigure;
}

export type CourseNativeFigure =
  | { kind: "physics"; preset: string }
  | { kind: "biology"; preset: string }
  | { kind: "integral"; preset: "between-curves" | "rectangles" }
  | { kind: "differential"; preset: "first-order" | "oscillator" }
  | { kind: "probability"; preset: "bag" | "coupons" | "urns" | "cdf" | "binomial" }
  | { kind: "statistics"; preset: string }
  | { kind: "barycenter"; preset: string }
  | { kind: "arithmetic"; preset: string }
  | { kind: "space"; preset: string }
  | { kind: "conic"; preset: string }
  | { kind: "complex"; preset: string }
  | { kind: "gcd"; preset: string };

export interface CourseDocumentTopic {
  id: string;
  title: string;
  pages: number[];
  body: string;
  examples?: CourseWorkedExample[];
  detail?: string;
  interaction?: LessonInteraction;
  nativeFigure?: CourseNativeFigure;
  optional?: boolean;
  /** Existing feedback threads and deep links keep their original identifiers. */
  legacyLessonIds?: string[];
}

export interface CourseDocumentSection {
  id: string;
  numeral: string;
  title: string;
  topics: CourseDocumentTopic[];
}

/** Reading-only reference data, shared without sharing learner answers or rewards. */
export interface CourseEssentialSheet {
  id: string;
  title: string;
  levelIds: readonly string[];
  source: { title: string; sha256: string; pageCount: number; pages: number[]; editorialNotes: string[] };
  sections: CourseDocumentSection[];
  visuals?: Record<string, "unit-circle">;
}

export interface CourseDocumentQuestion {
  id: string;
  label: string;
  prompt: string;
  points: number;
  topicId: string;
  expected: string;
  correction: string;
  answer: { kind: "short"; accepted: string[] } | { kind: "interval"; lower: number; upper: number; variable: string };
}

export interface CourseWrittenTask {
  id: string;
  nativeFigure?: CourseNativeFigure;
  beforeQuestionId?: string;
  prompt: string;
  model: string;
  criteria: string[];
  topicId: string;
}

export interface CourseEvaluationGroup {
  id: string;
  title: string;
  pages: number[];
  method: string;
  statement?: string;
  examples: CourseWorkedExample[];
  questions: CourseDocumentQuestion[];
  writtenTasks?: CourseWrittenTask[];
}

export type CourseDocumentTab = "summary" | "assessment" | "essentials";

export interface CourseEssentialCard {
  id: string;
  title: string;
  body: string;
  topicId?: string;
}

/** Reading-only material has no mastery levels, XP registry or automatic evaluation. */
export type CourseLibraryReference = Pick<LearningPath, "id" | "subjectId" | "levelIds" | "title" | "theme" | "chapterNumber" | "chapterNumberByLevel">;

/** Reading content can be reorganized without claiming a new PDF transcription. */
export interface CourseSummary {
  id: string;
  version: number;
  levelIds: string[];
  sections: CourseDocumentSection[];
  /** A separately authored quick sheet, or existing key points explicitly reused. */
  essentials?: CourseEssentialCard[];
  /** A legacy link is resolved to a document anchor, never a visible level. */
  legacyAnchors: Record<string, string>;
}

export interface CourseDocument extends CourseSummary {
  source: { title: string; pageCount: number; summaryPages: number[]; evaluationPages: number[]; lessonLabel?: string; sha256?: string; editorialNotes?: string[] };
  evaluations: CourseEvaluationGroup[];
}
