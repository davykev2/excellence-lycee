export type RankingPeriod = "week" | "month" | "all-time";

export interface LeaderboardEntry {
  id: string;
  name: string;
  photoUrl?: string;
  score: number;
  streakDays: number;
  completedLessons: number;
  rank: number;
  avatarTone: string;
  isCurrentLearner: boolean;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId?: string;
  senderName: string;
  senderPhotoUrl?: string;
  body: string;
  sentAt: string;
  editedAt?: string;
  deletedAt?: string;
  isMine: boolean;
  readByRecipient: boolean;
  replyTo?: {
    id: string;
    body: string;
    senderName: string;
    deleted: boolean;
  };
}

export interface GlobalChatMessage extends ChatMessage {
  senderRole: "student" | "teacher" | "content_editor" | "admin";
  senderLevelId: string;
}

export interface MessageRecipient {
  id: string;
  name: string;
  role: "student" | "teacher" | "content_editor" | "admin";
  accountType: "student" | "parent" | "teacher";
  levelId: string;
  photoUrl?: string;
  online?: boolean;
  lastSeenAt?: string;
}

export interface MessageThread {
  id: string;
  subject: string;
  participant: MessageRecipient;
  lastMessage: {
    body: string;
    senderId?: string;
    createdAt: string;
    deleted: boolean;
  };
  unreadCount: number;
  muted: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}
