import type { SubjectId } from "./learning";

export type AdminSection = "overview" | "editorial" | "content" | "users" | "operations" | "settings";
export type PublicationStatus = "published" | "review" | "draft";
export type UserStatus = "active" | "suspended";
export type UserRole = "student" | "teacher" | "content_editor" | "admin";
export type TaskPriority = "urgent" | "normal" | "low";

export interface AdminContentItem {
  id: string;
  title: string;
  subjectId: SubjectId;
  levelLabel: string;
  kind: "path" | "chapter" | "lesson";
  lessonCount: number;
  status: PublicationStatus;
  updatedAt: string;
  author: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  levelId?: string;
  levelLabel?: string;
  status: UserStatus;
  lastActive: string;
  progress: number;
  completedLessons?: number;
  totalXp?: number;
}

export interface AdminTask {
  id: string;
  title: string;
  detail: string;
  category: "content" | "support" | "security" | "programme";
  priority: TaskPriority;
  createdAt: string;
  resolved: boolean;
}

export interface AdminSettings {
  registrationsOpen: boolean;
  maintenanceMode: boolean;
  tutorEnabled: boolean;
  contentRequiresReview: boolean;
  dailyExerciseGoal: number;
  sessionTimeoutMinutes: number;
}

export interface AdminWorkspaceState {
  version: 1;
  contents: AdminContentItem[];
  users: AdminUser[];
  tasks: AdminTask[];
  settings: AdminSettings;
}

export interface NewAdminContent {
  title: string;
  subjectId: SubjectId;
  levelLabel: string;
  kind: AdminContentItem["kind"];
}
