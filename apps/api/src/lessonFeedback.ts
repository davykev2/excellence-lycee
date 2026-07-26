import type { UserRole } from "./database.js";

export const lessonReactionValues = ["useful", "love", "clear", "confusing"] as const;

export type LessonReaction = typeof lessonReactionValues[number];

export interface LessonReactionSummary {
  counts: Record<LessonReaction, number>;
  total: number;
  myReaction?: LessonReaction;
}

export interface LessonFeedbackComment {
  id: string;
  authorId?: string;
  authorName: string;
  authorPhotoUrl?: string;
  authorRole: UserRole;
  body: string;
  createdAt: string;
  updatedAt?: string;
  isMine: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface LessonFeedbackSummary {
  reactions: LessonReactionSummary;
  comments: LessonFeedbackComment[];
  commentCount: number;
}

export interface AdminFeedbackItem {
  kind: "comment" | "reaction";
  id: string;
  pathId: string;
  lessonId: string;
  authorId?: string;
  authorName: string;
  authorPhotoUrl?: string;
  authorRole: UserRole;
  body?: string;
  reaction?: LessonReaction;
  createdAt: string;
}
