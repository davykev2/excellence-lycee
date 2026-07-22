export type ArenaExerciseDifficulty = "easy" | "medium" | "hard";
export type ArenaExerciseStatus = "draft" | "review" | "published";

export interface ArenaExerciseItem {
  id: string;
  title: string;
  statementMarkdown: string;
  correctionMarkdown: string;
}

export interface ArenaExerciseLevelPayload {
  levelId: string;
  subjectId: string;
  lessonKey: string;
  lessonTitle: string;
  difficulty: ArenaExerciseDifficulty;
  stageNumber: number;
  title: string;
  instructionsMarkdown: string;
  exercises: ArenaExerciseItem[];
}

export interface ArenaExerciseLevelDocument extends ArenaExerciseLevelPayload {
  id: string;
  status: ArenaExerciseStatus;
  draftVersion: number;
  publishedVersion?: number;
  hasPublishedVersion: boolean;
  createdBy?: string;
  updatedByName?: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface PublishedArenaExerciseLevel extends ArenaExerciseLevelPayload {
  id: string;
  version: number;
  publishedAt: string;
}
