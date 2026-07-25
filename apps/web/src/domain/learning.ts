export type SubjectId =
  | "mathematics"
  | "physics-chemistry"
  | "french"
  | "english"
  | "svt"
  | "philosophy"
  | "history-geography";

export type NavigationId =
  | "home"
  | "paths"
  | "arena"
  | "store"
  | "ranking"
  | "messages"
  | "profile"
  | "admin";

export type IconName =
  | "home"
  | "paths"
  | "arena"
  | "store"
  | "ranking"
  | "messages"
  | "profile"
  | "admin"
  | "target"
  | "calendar"
  | "coin";

export interface NavigationItem {
  id: NavigationId;
  label: string;
  mobileLabel?: string;
  icon: IconName;
}

export interface SchoolLevel {
  id: string;
  label: string;
  stage: "seconde" | "premiere" | "terminale";
  series: "A" | "C" | "D";
}

export interface LearnerProfile {
  name: string;
  photoUrl?: string;
  levelId: string;
}

export interface SubjectDefinition {
  id: SubjectId;
  label: string;
  shortLabel: string;
  enabled: boolean;
  /** Omit to expose the subject to every school level. */
  levelIds?: string[];
  theme: {
    accent: string;
    accentSoft: string;
  };
}

export interface ReviewItem {
  id: string;
  title: string;
  dueLabel: string;
}

export interface LessonPreview {
  id: string;
  eyebrow: string;
  title: string;
  progress: number;
  remainingMinutes: number;
  ctaLabel: string;
  hintLabel: string;
}

export interface DashboardContent {
  learnerName: string;
  learnerPhotoUrl?: string;
  levelId: string;
  subjectId: SubjectId;
  lesson: LessonPreview;
  dailyGoal: {
    title: string;
    description: string;
    completed: number;
    target: number;
  };
  arena: {
    title: string;
    description: string;
  };
}
