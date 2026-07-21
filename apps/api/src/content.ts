export interface LessonContentQuestion {
  type?: "choice" | "short-answer";
  prompt: string;
  options: string[];
  correctIndex: number;
  acceptedAnswers?: string[];
  points?: number;
  sourceLabel?: string;
  explanation: string;
}

export interface LessonContentSource {
  documentTitle: string;
  pages: string;
  section: string;
  fidelity: "faithful" | "faithful-corrected" | "adapted";
  corrections: string[];
}

export interface LessonContentPayload {
  title: string;
  summary: string;
  eyebrow: string;
  bodyMarkdown: string;
  keyPoint: string;
  example: string;
  questions: LessonContentQuestion[];
  source?: LessonContentSource;
}

export type LessonContentStatus = "draft" | "review" | "published";

export interface LessonContentDocument extends LessonContentPayload {
  id: string;
  pathId: string;
  lessonId: string;
  status: LessonContentStatus;
  draftVersion: number;
  publishedVersion?: number;
  hasPublishedVersion: boolean;
  updatedAt: string;
  publishedAt?: string;
  updatedByName?: string;
}

export interface PublishedLessonContent extends LessonContentPayload {
  pathId: string;
  lessonId: string;
  version: number;
  publishedAt: string;
}

export interface LessonContentRevision {
  id: string;
  documentId: string;
  version: number;
  payload: LessonContentPayload;
  note?: string;
  createdAt: string;
  createdByName?: string;
}
