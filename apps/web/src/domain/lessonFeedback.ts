import type { UserRole } from "./auth";

export const lessonReactionValues = ["useful", "love", "clear", "confusing"] as const;
export const commentReactionValues = ["like", "love", "helpful"] as const;

export type LessonReaction = typeof lessonReactionValues[number];
export type CommentReaction = typeof commentReactionValues[number];

export interface LessonReactionSummary {
  counts: Record<LessonReaction, number>;
  total: number;
  myReaction?: LessonReaction;
}

export interface CommentReactionSummary {
  counts: Record<CommentReaction, number>;
  adminCounts: Record<CommentReaction, number>;
  total: number;
  myReaction?: CommentReaction;
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
  reactions: CommentReactionSummary;
}

export interface LessonFeedbackSummary {
  reactions: LessonReactionSummary;
  comments: LessonFeedbackComment[];
  commentCount: number;
}

export interface AdminFeedbackItem {
  kind: "comment" | "reaction" | "comment_reaction";
  id: string;
  pathId: string;
  lessonId: string;
  authorId?: string;
  authorName: string;
  authorPhotoUrl?: string;
  authorRole: UserRole;
  body?: string;
  reaction?: LessonReaction | CommentReaction;
  commentId?: string;
  commentBody?: string;
  commentAuthorName?: string;
  createdAt: string;
}
