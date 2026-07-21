import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import {
  Archive,
  ArrowCounterClockwise,
  ArrowRight,
  BellSimple,
  BellSimpleSlash,
  ChatCircleDots,
  Check,
  Checks,
  GlobeHemisphereWest,
  MagnifyingGlass,
  NotePencil,
  PaperPlaneTilt,
  PencilSimple,
  Plus,
  Trash,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import type { LearnerProfile, SchoolLevel } from "../../domain/learning";
import type { ChatMessage, MessageRecipient } from "../../domain/community";
import { ProfileAvatar } from "../../ui/ProfileAvatar";
import { GlobalChatPanel } from "./GlobalChatPanel";
import { useMessaging } from "./useMessaging";

interface MessagesScreenProps {
  profile: LearnerProfile;
  level: SchoolLevel;
}

function avatarTone(id: string) {
  const palette = ["#2c9734", "#2878c8", "#7253a4", "#d85c2f", "#a8497e", "#4c7b78"];
  const hash = [...id].reduce((value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0, 7);
  return palette[hash % palette.length];
}

function roleLabel(recipient: MessageRecipient) {
  if (recipient.role === "admin") return "Administration Excellence";
  if (recipient.role === "content_editor") return "Équipe pédagogique";
  if (recipient.role === "teacher" || recipient.accountType === "teacher") return "Enseignant";
  if (recipient.accountType === "parent") return "Parent";
  return "Élève";
}

function formatDate(value: string, detailed = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) return new Intl.DateTimeFormat("fr-CI", { hour: "2-digit", minute: "2-digit" }).format(date);
  if (detailed) return new Intl.DateTimeFormat("fr-CI", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
  return new Intl.DateTimeFormat("fr-CI", { day: "2-digit", month: "short" }).format(date);
}

function MessageChannelSwitch({ channel, onChange }: { channel: "global" | "private"; onChange: (channel: "global" | "private") => void }) {
  return (
    <nav className="message-channel-switch" aria-label="Choisir un espace de discussion">
      <button className={channel === "global" ? "is-active" : ""} type="button" onClick={() => onChange("global")}><GlobeHemisphereWest size={20} weight="duotone" /><span><strong>Salon global</strong><small>Toute la communauté</small></span></button>
      <button className={channel === "private" ? "is-active" : ""} type="button" onClick={() => onChange("private")}><ChatCircleDots size={20} weight="duotone" /><span><strong>Messages privés</strong><small>Échanges personnels</small></span></button>
    </nav>
  );
}

export function MessagesScreen({ profile, level }: MessagesScreenProps) {
  const [channel, setChannel] = useState<"global" | "private">("global");
  const [showArchived, setShowArchived] = useState(false);
  const messaging = useMessaging(showArchived);
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editing, setEditing] = useState<ChatMessage | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState("");
  const [newRecipientId, setNewRecipientId] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newBody, setNewBody] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const visibleThreads = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr");
    return messaging.threads.filter((thread) => {
      if (showArchived !== thread.archived) return false;
      return !query || `${thread.participant.name} ${thread.subject} ${thread.lastMessage.body}`.toLocaleLowerCase("fr").includes(query);
    });
  }, [messaging.threads, search, showArchived]);
  const activeThread = messaging.threads.find((thread) => thread.id === messaging.activeId);
  const unreadTotal = messaging.threads.reduce((total, thread) => total + thread.unreadCount, 0);
  const visibleRecipients = useMemo(() => {
    const query = recipientSearch.trim().toLocaleLowerCase("fr");
    return messaging.recipients.filter((recipient) => !query
      || `${recipient.name} ${roleLabel(recipient)} ${recipient.levelId}`.toLocaleLowerCase("fr").includes(query));
  }, [messaging.recipients, recipientSearch]);

  useEffect(() => {
    if (visibleThreads.some((thread) => thread.id === messaging.activeId)) return;
    messaging.setActiveId(visibleThreads[0]?.id ?? null);
  }, [showArchived, visibleThreads]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: messaging.loadingMessages ? "auto" : "smooth", block: "end" });
  }, [messaging.messages, messaging.loadingMessages]);

  useEffect(() => {
    setReply("");
    setReplyTo(null);
    setEditing(null);
  }, [messaging.activeId]);

  const openCompose = () => {
    setFormError(null);
    setComposeOpen(true);
    setNewRecipientId(messaging.recipients[0]?.id ?? "");
  };

  const closeCompose = () => {
    if (messaging.mutating) return;
    setComposeOpen(false);
    setRecipientSearch("");
    setNewRecipientId("");
    setNewSubject("");
    setNewBody("");
    setFormError(null);
  };

  const sendReply = async (event?: FormEvent) => {
    event?.preventDefault();
    const body = reply.trim();
    if (!body || !activeThread || messaging.mutating) return;
    try {
      if (editing) await messaging.editMessage(activeThread.id, editing.id, body);
      else await messaging.sendMessage(activeThread.id, body, replyTo?.id);
      setReply("");
      setReplyTo(null);
      setEditing(null);
    } catch {
      // The shared error banner already describes the failure.
    }
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendReply();
    }
  };

  const createThread = async (event: FormEvent) => {
    event.preventDefault();
    if (!newRecipientId || !newSubject.trim() || !newBody.trim()) return;
    setFormError(null);
    try {
      await messaging.createThread({ recipientId: newRecipientId, subject: newSubject.trim(), body: newBody.trim() });
      closeCompose();
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : "Le message n’a pas pu être envoyé.");
    }
  };

  const beginEdit = (message: ChatMessage) => {
    setEditing(message);
    setReplyTo(null);
    setReply(message.body);
  };

  const removeMessage = async (message: ChatMessage) => {
    if (!activeThread || !window.confirm("Supprimer ce message ? Il restera indiqué comme supprimé dans la conversation.")) return;
    try {
      await messaging.deleteMessage(activeThread.id, message.id);
    } catch {
      // The shared error banner already describes the failure.
    }
  };

  if (channel === "global") {
    return (
      <main className="community-page messages-page">
        <header className="community-header">
          <div><p className="header-kicker">La communauté Excellence en direct</p><h1>Messages</h1><p>Échange avec les élèves, enseignants et membres de l’équipe dans un espace commun.</p></div>
        </header>
        <MessageChannelSwitch channel={channel} onChange={setChannel} />
        <GlobalChatPanel profile={profile} level={level} />
      </main>
    );
  }

  return (
    <main className="community-page messages-page">
      <header className="community-header">
        <div><p className="header-kicker">Échanges privés et accompagnement</p><h1>Messages</h1><p>Discute avec les personnes autorisées de ta classe et l’équipe Excellence.</p></div>
        <div className="message-header-actions">
          <button className="secondary-action is-compact" type="button" onClick={() => void messaging.reload()} disabled={messaging.loadingThreads} aria-label="Actualiser les messages"><ArrowCounterClockwise size={19} weight="bold" /> Actualiser</button>
          <button className="primary-action is-compact" type="button" onClick={openCompose}><Plus size={20} weight="bold" /> Nouveau message</button>
        </div>
      </header>

      {messaging.error && <div className="message-error" role="alert"><span>{messaging.error}</span><button type="button" onClick={() => void messaging.reload()}>Réessayer</button></div>}

      <MessageChannelSwitch channel={channel} onChange={setChannel} />

      <section className="messages-shell" aria-busy={messaging.loadingThreads}>
        <aside className="thread-sidebar">
          <div className="thread-sidebar-heading">
            <div><span>{showArchived ? "Conversations archivées" : "Boîte de réception"}</span><strong>{unreadTotal} non lu{unreadTotal > 1 ? "s" : ""}</strong></div>
            <button type="button" className={showArchived ? "is-active" : ""} onClick={() => setShowArchived((current) => !current)} aria-label={showArchived ? "Afficher la boîte de réception" : "Afficher les archives"} title={showArchived ? "Boîte de réception" : "Archives"}>
              {showArchived ? <ChatCircleDots size={24} weight="duotone" /> : <Archive size={24} weight="duotone" />}
            </button>
          </div>
          <label className="message-search"><MagnifyingGlass size={19} /><input aria-label="Rechercher une conversation" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nom, objet ou message…" /></label>
          <div className="thread-list">
            {messaging.loadingThreads && <div className="message-loading" role="status"><span />Chargement des conversations…</div>}
            {!messaging.loadingThreads && visibleThreads.map((thread) => (
              <button className={activeThread?.id === thread.id ? "is-active" : ""} key={thread.id} type="button" onClick={() => messaging.setActiveId(thread.id)}>
                <span className="thread-avatar" style={{ background: avatarTone(thread.participant.id) }}>{thread.participant.photoUrl ? <img src={thread.participant.photoUrl} alt="" /> : thread.participant.name.slice(0, 1).toLocaleUpperCase("fr")}</span>
                <span className="thread-preview"><strong>{thread.participant.name}</strong><span>{thread.subject}</span><small>{thread.lastMessage.body}</small></span>
                <span className="thread-meta"><time>{formatDate(thread.lastMessage.createdAt)}</time>{thread.muted && <BellSimpleSlash size={13} />}{thread.unreadCount > 0 && <b>{thread.unreadCount}</b>}</span>
              </button>
            ))}
            {!messaging.loadingThreads && visibleThreads.length === 0 && <div className="thread-empty"><ChatCircleDots size={28} weight="duotone" /><p>{showArchived ? "Aucune conversation archivée." : search ? "Aucune conversation trouvée." : "Ta boîte de réception est vide."}</p>{!showArchived && !search && <button type="button" onClick={openCompose}>Écrire un premier message</button>}</div>}
          </div>
        </aside>

        {activeThread ? (
          <article className="conversation-panel">
            <header className="conversation-header">
              <span className="thread-avatar is-large" style={{ background: avatarTone(activeThread.participant.id) }}>{activeThread.participant.photoUrl ? <img src={activeThread.participant.photoUrl} alt="" /> : activeThread.participant.name.slice(0, 1).toLocaleUpperCase("fr")}</span>
              <div><strong>{activeThread.participant.name}</strong><span>{roleLabel(activeThread.participant)}</span></div>
              <div className="conversation-header-tools">
                <span className="conversation-level"><UsersThree size={18} weight="duotone" /> {level.label}</span>
                <button type="button" onClick={() => void messaging.updatePreferences(activeThread.id, { muted: !activeThread.muted })} aria-label={activeThread.muted ? "Réactiver les notifications" : "Couper les notifications"} title={activeThread.muted ? "Réactiver les notifications" : "Mettre en sourdine"}>
                  {activeThread.muted ? <BellSimpleSlash size={19} weight="duotone" /> : <BellSimple size={19} weight="duotone" />}
                </button>
                <button type="button" onClick={() => void messaging.updatePreferences(activeThread.id, { archived: !activeThread.archived })} aria-label={activeThread.archived ? "Restaurer la conversation" : "Archiver la conversation"} title={activeThread.archived ? "Restaurer" : "Archiver"}><Archive size={19} weight="duotone" /></button>
              </div>
            </header>
            <div className="conversation-subject"><span>Objet</span><strong>{activeThread.subject}</strong></div>
            <div className="conversation-messages" aria-live="polite">
              {messaging.loadingMessages && <div className="message-loading is-conversation" role="status"><span />Synchronisation des messages…</div>}
              {!messaging.loadingMessages && messaging.messages.map((message) => (
                <div className={`message-bubble-row ${message.isMine ? "is-learner" : ""} ${message.deletedAt ? "is-deleted" : ""}`} key={message.id}>
                  {message.isMine ? <ProfileAvatar name={profile.name} photoUrl={profile.photoUrl} /> : <ProfileAvatar name={message.senderName} photoUrl={message.senderPhotoUrl} />}
                  <div className="message-bubble">
                    {message.replyTo && <button className="message-quote" type="button" onClick={() => document.getElementById(`message-${message.replyTo?.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}><strong>{message.replyTo.senderName}</strong><span>{message.replyTo.body}</span></button>}
                    <p id={`message-${message.id}`}>{message.body}</p>
                    <footer>
                      <span>{formatDate(message.sentAt, true)}{message.editedAt && !message.deletedAt ? " · modifié" : ""}</span>
                      {!message.deletedAt && <button type="button" onClick={() => { setReplyTo(message); setEditing(null); setReply(""); }} title="Répondre"><NotePencil size={13} /> Répondre</button>}
                      {message.isMine && !message.deletedAt && <button type="button" onClick={() => beginEdit(message)} title="Modifier"><PencilSimple size={13} /></button>}
                      {message.isMine && !message.deletedAt && <button type="button" onClick={() => void removeMessage(message)} title="Supprimer"><Trash size={13} /></button>}
                      {message.isMine && !message.deletedAt && <span title={message.readByRecipient ? "Lu" : "Envoyé"}>{message.readByRecipient ? <Checks size={15} weight="bold" /> : <Check size={14} weight="bold" />}</span>}
                    </footer>
                  </div>
                </div>
              ))}
              {!messaging.loadingMessages && messaging.messages.length === 0 && <p className="conversation-empty">Aucun message dans cette conversation.</p>}
              <div ref={messagesEndRef} />
            </div>
            <form className="message-reply" onSubmit={(event) => void sendReply(event)}>
              {(replyTo || editing) && <div className="message-composer-context"><div><strong>{editing ? "Modifier ton message" : `Répondre à ${replyTo?.senderName}`}</strong><span>{editing?.body ?? replyTo?.body}</span></div><button type="button" onClick={() => { setReplyTo(null); setEditing(null); setReply(""); }} aria-label="Annuler"><X size={16} weight="bold" /></button></div>}
              <textarea aria-label="Écrire une réponse" value={reply} onChange={(event) => setReply(event.target.value)} onKeyDown={handleComposerKeyDown} placeholder="Écris ta réponse… Entrée pour envoyer" rows={2} maxLength={2000} />
              <button type="submit" disabled={!reply.trim() || messaging.mutating} aria-label={editing ? "Enregistrer la modification" : "Envoyer la réponse"}>{editing ? <Check size={22} weight="bold" /> : <PaperPlaneTilt size={22} weight="fill" />}</button>
              <small>{reply.length}/2000</small>
            </form>
          </article>
        ) : (
          <article className="conversation-placeholder"><ChatCircleDots size={58} weight="duotone" /><h2>{showArchived ? "Aucune archive sélectionnée" : "Commence une conversation"}</h2><p>Choisis un échange dans la liste ou écris à une personne autorisée.</p>{!showArchived && <button className="primary-action is-compact" type="button" onClick={openCompose}><Plus size={19} /> Nouveau message</button>}</article>
        )}
      </section>

      {composeOpen && (
        <div className="compose-overlay" role="presentation" onMouseDown={closeCompose}>
          <section className="compose-dialog" role="dialog" aria-modal="true" aria-labelledby="compose-title" onMouseDown={(event) => event.stopPropagation()}>
            <header><div><p className="path-kicker">Nouvelle conversation privée</p><h2 id="compose-title">Écrire un message</h2></div><button type="button" onClick={closeCompose} aria-label="Fermer"><X size={22} weight="bold" /></button></header>
            <form onSubmit={(event) => void createThread(event)}>
              <label><span>Rechercher le destinataire</span><div className="compose-recipient-search"><MagnifyingGlass size={18} /><input value={recipientSearch} onChange={(event) => setRecipientSearch(event.target.value)} placeholder="Nom, rôle ou classe…" /></div></label>
              <fieldset className="compose-recipient-list"><legend>Destinataire</legend>{visibleRecipients.map((recipient) => <label className={newRecipientId === recipient.id ? "is-selected" : ""} key={recipient.id}><input type="radio" name="recipient" value={recipient.id} checked={newRecipientId === recipient.id} onChange={() => setNewRecipientId(recipient.id)} /><span className="thread-avatar" style={{ background: avatarTone(recipient.id) }}>{recipient.photoUrl ? <img src={recipient.photoUrl} alt="" /> : recipient.name.slice(0, 1).toLocaleUpperCase("fr")}</span><span><strong>{recipient.name}</strong><small>{roleLabel(recipient)} · {recipient.levelId.replaceAll("-", " ")}</small></span></label>)}{visibleRecipients.length === 0 && <p>Aucun destinataire autorisé ne correspond à cette recherche.</p>}</fieldset>
              <label><span>Objet</span><input value={newSubject} onChange={(event) => setNewSubject(event.target.value)} placeholder="Ex. Besoin d’aide sur un exercice" maxLength={120} /></label>
              <label><span>Message</span><textarea value={newBody} onChange={(event) => setNewBody(event.target.value)} placeholder="Explique clairement ta demande…" rows={5} maxLength={2000} /></label>
              {formError && <p className="compose-error" role="alert">{formError}</p>}
              <button className="primary-action is-compact" type="submit" disabled={!newRecipientId || !newSubject.trim() || !newBody.trim() || messaging.mutating}>{messaging.mutating ? "Envoi…" : <>Envoyer <ArrowRight size={20} weight="bold" /></>}</button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
