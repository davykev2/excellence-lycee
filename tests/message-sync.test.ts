import assert from "node:assert/strict";
import test from "node:test";
import type { ChatMessage } from "../apps/web/src/domain/community";
import { normalizeMessageList, reconcileMessageList } from "../apps/web/src/features/community/messageSync";

function message(id: string, overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id,
    threadId: "thread-a",
    senderId: "learner-a",
    senderName: "Awa",
    body: `Message ${id}`,
    sentAt: `2026-08-30T10:00:0${id}.000Z`,
    isMine: true,
    readByRecipient: false,
    ...overrides,
  };
}

test("normalizeMessageList retire les doublons sans déplacer la conversation", () => {
  const first = message("1");
  const second = message("2");
  const updatedFirst = message("1", { body: "Version la plus récente", readByRecipient: true });

  const normalized = normalizeMessageList([first, second, updatedFirst]);

  assert.deepEqual(normalized.map((item) => item.id), ["1", "2"]);
  assert.equal(normalized[0], updatedFirst);
});

test("reconcileMessageList conserve la référence pendant un rafraîchissement identique", () => {
  const current = [message("1"), message("2")];
  const incoming = current.map((item) => ({ ...item }));

  assert.equal(reconcileMessageList(current, incoming), current);
});

test("reconcileMessageList détecte une modification de citation ou d'accusé de lecture", () => {
  const current = [message("1", {
    replyTo: { id: "source", body: "Ancien texte", senderName: "Koffi", deleted: false },
  })];
  const incoming = [message("1", {
    readByRecipient: true,
    replyTo: { id: "source", body: "Texte corrigé", senderName: "Koffi", deleted: false },
  })];

  const reconciled = reconcileMessageList(current, incoming);
  assert.notEqual(reconciled, current);
  assert.equal(reconciled[0]?.replyTo?.body, "Texte corrigé");
  assert.equal(reconciled[0]?.readByRecipient, true);
});
