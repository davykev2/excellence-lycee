import type { ChatMessage } from "../../domain/community";

type MessageWithGlobalMetadata = ChatMessage & {
  senderRole?: string;
  senderLevelId?: string;
};

function messageRevision(message: ChatMessage) {
  const globalMessage = message as MessageWithGlobalMetadata;
  return [
    message.id,
    message.threadId,
    message.senderId ?? "",
    message.senderName,
    message.senderPhotoUrl ?? "",
    message.body,
    message.sentAt,
    message.editedAt ?? "",
    message.deletedAt ?? "",
    message.isMine ? "1" : "0",
    message.readByRecipient ? "1" : "0",
    message.replyTo?.id ?? "",
    message.replyTo?.body ?? "",
    message.replyTo?.senderName ?? "",
    message.replyTo?.deleted ? "1" : "0",
    globalMessage.senderRole ?? "",
    globalMessage.senderLevelId ?? "",
  ].join("\u001f");
}

/**
 * Garde une seule occurrence de chaque message. La première position reste
 * stable, tandis que la dernière version reçue fournit le contenu affiché.
 */
export function normalizeMessageList<T extends ChatMessage>(messages: readonly T[]) {
  const normalized: T[] = [];
  const indexById = new Map<string, number>();

  for (const message of messages) {
    const existingIndex = indexById.get(message.id);
    if (existingIndex === undefined) {
      indexById.set(message.id, normalized.length);
      normalized.push(message);
    } else {
      normalized[existingIndex] = message;
    }
  }

  return normalized;
}

/**
 * Réutilise le tableau React courant quand aucune donnée visible n'a changé.
 * Cela évite un nouveau rendu et conserve la position de défilement pendant
 * les rafraîchissements silencieux.
 */
export function reconcileMessageList<T extends ChatMessage>(current: T[], incoming: readonly T[]): T[] {
  const normalized = normalizeMessageList(incoming);
  const unchanged = current.length === normalized.length
    && current.every((message, index) => messageRevision(message) === messageRevision(normalized[index]));
  return unchanged ? current : normalized;
}
