export type ArenaExerciseDifficulty = "easy" | "medium" | "hard";
export type ArenaExerciseCategory = "fixation" | "deepening" | "complex";
export type ArenaExerciseStatus = "draft" | "review" | "published";

export interface ArenaExerciseQuestion {
  id: string;
  label: string;
  prompt: string;
  explanation: string;
  points: number;
  answer:
    | { kind: "short"; expected: string; accepted: string[]; comparison?: "literal" | "complex" }
    | { kind: "choice"; options: string[]; correctIndex: number; display?: "buttons" | "select" }
    | { kind: "written" };
}

export interface ArenaExerciseItem {
  id: string;
  title: string;
  statementMarkdown: string;
  correctionMarkdown: string;
  sourceNumber?: number;
  sourcePage?: number;
  questions?: ArenaExerciseQuestion[];
  reviewCriteria?: string[];
  figureKey?: "tc-l1-variation" | "tc-l1-asymptotes" | "tc-l1-circle" | "tc-l2-inflection" | "tc-l2-triangle" | "tc-l2-water-wall" | "tc-l2-functions" | "tc-l3-population" | "tc-l4-functions" | "tc-l5-functions" | "tc-l6-sequences" | "tc-l7-integrals" | "tc-l8-differential" | "tc-l9-probability" | "tc-l9-tree-blank" | "tc-l10-statistics" | "tc-l10-scatter-blank" | "tc-t2-l1-barycenter" | "tc-t2-l1-source" | "tc-t2-l2-arithmetic" | "tc-t2-l3-space" | "tc-t2-l4-conic" | "tc-t2-l5-complex" | "tc-t2-l5-circuit" | "tc-t2-l6-gcd";
  correctionFigureKey?: "tc-l1-variation" | "tc-l1-asymptotes" | "tc-l1-circle" | "tc-l2-inflection" | "tc-l2-triangle" | "tc-l2-water-wall" | "tc-l2-functions" | "tc-l3-population" | "tc-l4-functions" | "tc-l5-functions" | "tc-l6-sequences" | "tc-l7-integrals" | "tc-l8-differential" | "tc-l9-probability" | "tc-l9-tree-blank" | "tc-l10-statistics" | "tc-l10-scatter-blank" | "tc-t2-l1-barycenter" | "tc-t2-l1-source" | "tc-t2-l2-arithmetic" | "tc-t2-l3-space" | "tc-t2-l4-conic" | "tc-t2-l5-complex" | "tc-t2-l5-circuit" | "tc-t2-l6-gcd";
}

export interface ArenaExerciseLevelPayload {
  levelId: string;
  subjectId: string;
  lessonKey: string;
  lessonTitle: string;
  difficulty: ArenaExerciseDifficulty;
  category?: ArenaExerciseCategory;
  sourceSectionId?: string;
  courseTopicId?: string;
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
