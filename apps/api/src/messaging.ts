import type { AccountAudience, UserRole } from "./database.js";

export interface MessageRecipientSummary {
  id: string;
  name: string;
  role: UserRole;
  accountType: AccountAudience;
  levelId: string;
  photoUrl?: string;
  online?: boolean;
  lastSeenAt?: string;
}

export interface MessageThreadSummary {
  id: string;
  subject: string;
  participant: MessageRecipientSummary;
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

export interface ThreadMessageSummary {
  id: string;
  threadId: string;
  senderId?: string;
  senderName: string;
  senderPhotoUrl?: string;
  body: string;
  createdAt: string;
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

export interface GlobalMessageSummary extends ThreadMessageSummary {
  senderRole: UserRole;
  senderLevelId: string;
}
