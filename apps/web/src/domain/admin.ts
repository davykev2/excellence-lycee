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
  /** Dernière activité pédagogique, déjà mise en forme. */
  lastActive: string;
  progress: number;
  completedLessons?: number;
  totalXp?: number;
  /** Administrateur suprême : un seul compte sur la plateforme. */
  isOwner: boolean;
  /**
   * Dernier signe de vie, brut, pour que l'affichage reste juste sans recharger.
   * Absent si la personne ne s'est jamais connectée depuis la mise en place du
   * suivi, ou si la connectivité est volontairement retenue par le serveur.
   */
  lastSeenAt?: string;
  /** Le serveur a retenu la connectivité : à afficher en tiret, pas en « hors ligne ». */
  presenceHidden: boolean;
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
