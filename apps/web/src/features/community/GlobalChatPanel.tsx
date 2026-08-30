import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import {
  Check,
  GlobeHemisphereWest,
  NotePencil,
  PaperPlaneTilt,
  PencilSimple,
  Trash,
  X,
} from "@phosphor-icons/react";
import type { GlobalChatMessage } from "../../domain/community";
import type { LearnerProfile } from "../../domain/learning";
import { ProfileAvatar } from "../../ui/ProfileAvatar";
import { useAuth } from "../auth/AuthProvider";
import { useGlobalChat } from "./useGlobalChat";

interface GlobalChatPanelProps {
  profile: LearnerProfile;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("fr-CI", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function senderStatus(message: GlobalChatMessage) {
  if (message.senderRole === "admin") return "Administration";
  if (message.senderRole === "teacher") return "Enseignant";
  if (message.senderRole === "content_editor") return "Équipe pédagogique";
  return message.senderLevelId ? message.senderLevelId.replaceAll("-", " ") : "Élève";
}

export function GlobalChatPanel({ profile }: GlobalChatPanelProps) {
  const { user } = useAuth();
  const chat = useGlobalChat();
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState<GlobalChatMessage | null>(null);
  const [editing, setEditing] = useState<GlobalChatMessage | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);

  useEffect(() => {
    if (stickToBottomRef.current) {
      endRef.current?.scrollIntoView({ behavior: chat.loading ? "auto" : "smooth", block: "end" });
    }
  }, [chat.loading, chat.messages.length]);

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    const cleanBody = body.trim();
    if (!cleanBody || chat.mutating) return;
    stickToBottomRef.current = true;
    try {
      if (editing) await chat.editMessage(editing.id, cleanBody);
      else await chat.sendMessage(cleanBody, replyTo?.id);
      setBody("");
      setReplyTo(null);
      setEditing(null);
    } catch {
      // Le bandeau d’erreur partagé explique déjà l’échec.
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void submit();
    }
  };

  const startEditing = (message: GlobalChatMessage) => {
    setEditing(message);
    setReplyTo(null);
    setBody(message.body);
  };

  const removeMessage = async (message: GlobalChatMessage) => {
    const wording = message.isMine ? "Supprimer ton message du salon global ?" : "Retirer ce message du salon global ?";
    if (!window.confirm(wording)) return;
    try {
      await chat.deleteMessage(message.id);
    } catch {
      // Le bandeau d’erreur partagé explique déjà l’échec.
    }
  };

  return (
    <section className="global-chat-shell" aria-busy={chat.loading}>
      {chat.error && <div className="message-error is-global" role="alert"><span>{chat.error}</span><button type="button" onClick={() => void chat.reload()}>Réessayer</button></div>}

      <div
        ref={scrollRef}
        className="conversation-messages global-chat-messages"
        aria-live="polite"
        onScroll={() => {
          const container = scrollRef.current;
          if (!container) return;
          stickToBottomRef.current = container.scrollHeight - container.scrollTop - container.clientHeight < 96;
        }}
      >
        {chat.loading && <div className="message-loading is-conversation" role="status"><span />Connexion à la communauté…</div>}
        {!chat.loading && chat.messages.map((message) => (
          <div className={`message-bubble-row ${message.isMine ? "is-learner" : ""} ${message.deletedAt ? "is-deleted" : ""}`} key={message.id}>
            <ProfileAvatar name={message.isMine ? profile.name : message.senderName} photoUrl={message.isMine ? profile.photoUrl : message.senderPhotoUrl} />
            <div className="message-bubble">
              <div className="global-message-author"><strong>{message.senderName}</strong><span>{senderStatus(message)}</span></div>
              {message.replyTo && <button className="message-quote" type="button" onClick={() => document.getElementById(`global-message-${message.replyTo?.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}><strong>{message.replyTo.senderName}</strong><span>{message.replyTo.body}</span></button>}
              <p id={`global-message-${message.id}`}>{message.body}</p>
              <footer>
                <span>{formatDate(message.sentAt)}{message.editedAt && !message.deletedAt ? " · modifié" : ""}</span>
                {!message.deletedAt && <button type="button" onClick={() => { setReplyTo(message); setEditing(null); setBody(""); }} title="Répondre"><NotePencil size={13} /> Répondre</button>}
                {message.isMine && !message.deletedAt && <button type="button" onClick={() => startEditing(message)} title="Modifier"><PencilSimple size={13} /></button>}
                {(message.isMine || user?.role === "admin") && !message.deletedAt && <button type="button" onClick={() => void removeMessage(message)} title={message.isMine ? "Supprimer" : "Modérer"}><Trash size={13} /></button>}
                {message.isMine && !message.deletedAt && <span title="Publié"><Check size={14} weight="bold" /></span>}
              </footer>
            </div>
          </div>
        ))}
        {!chat.loading && chat.messages.length === 0 && <div className="global-chat-empty"><GlobeHemisphereWest size={48} weight="duotone" /><strong>Lance la première discussion</strong><span>Un bonjour, une question ou une astuce suffit pour commencer.</span></div>}
        <div ref={endRef} />
      </div>

      <form className="message-reply global-chat-composer" onSubmit={(event) => void submit(event)}>
        {(replyTo || editing) && <div className="message-composer-context"><div><strong>{editing ? "Modifier ton message" : `Répondre à ${replyTo?.senderName}`}</strong><span>{editing?.body ?? replyTo?.body}</span></div><button type="button" onClick={() => { setReplyTo(null); setEditing(null); setBody(""); }} aria-label="Annuler"><X size={16} weight="bold" /></button></div>}
        <textarea aria-label="Écrire dans le salon global" value={body} onChange={(event) => setBody(event.target.value)} onKeyDown={handleKeyDown} placeholder="Écris à toute la communauté… Entrée pour envoyer" rows={2} maxLength={2000} enterKeyHint="send" autoCapitalize="sentences" autoComplete="off" />
        <button type="submit" disabled={!body.trim() || chat.mutating} aria-label={editing ? "Enregistrer la modification" : "Publier dans le salon global"}>{editing ? <Check size={22} weight="bold" /> : <PaperPlaneTilt size={22} weight="fill" />}</button>
        <small>{body.length}/2000</small>
      </form>
    </section>
  );
}
