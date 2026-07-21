import type { LessonQuestion, LessonSourceMetadata } from "./paths";

export type LessonContentStatus = "draft" | "review" | "published";

export interface LessonContentPayload {
  title: string;
  summary: string;
  eyebrow: string;
  bodyMarkdown: string;
  keyPoint: string;
  example: string;
  questions: LessonQuestion[];
  source?: LessonSourceMetadata;
}

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
