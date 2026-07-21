export type UserRole = "student" | "teacher" | "content_editor" | "admin";
export type AccountType = "student" | "parent" | "teacher";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  accountType: AccountType;
  levelId: string;
  photoUrl?: string;
  emailVerified: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  levelId: string;
  accountType: AccountType;
}

export interface LoginInput {
  email: string;
  password: string;
}
