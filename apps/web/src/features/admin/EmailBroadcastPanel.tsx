import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle,
  EnvelopeSimple,
  PaperPlaneTilt,
  Users,
  WarningCircle,
} from "@phosphor-icons/react";
import { ApiError, apiRequest } from "../../lib/api";

type EmailAudience = "students" | "students-and-parents" | "everyone";

const audienceOptions: { id: EmailAudience; label: string; detail: string }[] = [
  { id: "students", label: "Élèves", detail: "Les comptes d’apprenants uniquement" },
  { id: "students-and-parents", label: "Élèves et parents", detail: "Ajoute les comptes parents" },
  { id: "everyone", label: "Tout le monde", detail: "Inclut enseignants, éditeurs et administrateurs" },
];

interface BroadcastHistoryEntry {
  id: string;
  audience: EmailAudience;
  subject: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  authorName: string;
  createdAt: string;
}

const audienceLabel = (audience: EmailAudience) =>
  audienceOptions.find((option) => option.id === audience)?.label ?? audience;

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

/**
 * Diffusion d'un message par e-mail à l'ensemble des inscrits.
 *
 * Deux garde-fous délibérés : l'envoi est impossible tant qu'aucun domaine
 * d'expédition n'est vérifié, et la confirmation affiche le nombre exact de
 * destinataires — nombre que le serveur revérifie avant d'envoyer quoi que ce soit.
 */
export function EmailBroadcastPanel({ preview }: { preview: boolean }) {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [sender, setSender] = useState<string | null>(null);
  const [audience, setAudience] = useState<EmailAudience>("students");
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [history, setHistory] = useState<BroadcastHistoryEntry[]>([]);

  const loadHistory = useCallback(async () => {
    if (preview) return;
    try {
      const response = await apiRequest<{ items: BroadcastHistoryEntry[] }>("/notifications/history");
      setHistory(response.items ?? []);
    } catch {
      /* l'historique est un confort : son échec ne doit pas bloquer l'envoi */
    }
  }, [preview]);

  useEffect(() => {
    if (preview) {
      setConfigured(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const status = await apiRequest<{ configured: boolean; from: string | null }>("/notifications/status");
        if (cancelled) return;
        setConfigured(status.configured);
        setSender(status.from);
      } catch (reason) {
        if (cancelled) return;
        setConfigured(false);
        setError(reason instanceof ApiError ? reason.message : "État de la messagerie indisponible.");
      }
    })();
    void loadHistory();
    return () => { cancelled = true; };
  }, [preview, loadHistory]);

  useEffect(() => {
    if (preview) return;
    let cancelled = false;
    setRecipientCount(null);
    setConfirming(false);
    void (async () => {
      try {
        const response = await apiRequest<{ count: number }>(`/notifications/audience?audience=${audience}`);
        if (!cancelled) setRecipientCount(response.count);
      } catch {
        if (!cancelled) setRecipientCount(null);
      }
    })();
    return () => { cancelled = true; };
  }, [audience, preview]);

  const canCompose = subject.trim().length >= 3 && body.trim().length >= 10;
  const canSend = Boolean(configured) && canCompose && (recipientCount ?? 0) > 0 && !sending;

  const send = async () => {
    if (!canSend || recipientCount === null) return;
    setSending(true);
    setError(null);
    setNotice(null);
    try {
      const result = await apiRequest<{ recipientCount: number; sent: number; failed: number }>("/notifications/broadcast", {
        method: "POST",
        body: JSON.stringify({
          audience,
          subject: subject.trim(),
          body: body.trim(),
          confirmRecipientCount: recipientCount,
        }),
      });
      setNotice(result.failed > 0
        ? `${result.sent} e-mail(s) envoyé(s), ${result.failed} en échec. Le détail est enregistré.`
        : `${result.sent} e-mail(s) envoyé(s).`);
      setSubject("");
      setBody("");
      setConfirming(false);
      void loadHistory();
    } catch (reason) {
      if (reason instanceof ApiError && reason.code === "RECIPIENT_COUNT_MISMATCH") {
        // La cible a bougé entre l'affichage et la validation : on repart d'un compte frais.
        setConfirming(false);
        const refreshed = await apiRequest<{ count: number }>(`/notifications/audience?audience=${audience}`).catch(() => null);
        if (refreshed) setRecipientCount(refreshed.count);
      }
      setError(reason instanceof ApiError ? reason.message : "L’envoi n’a pas pu aboutir.");
    } finally {
      setSending(false);
    }
  };

  return (
    <article className="admin-panel admin-broadcast">
      <header className="admin-panel-header">
        <div>
          <p className="admin-eyebrow">Communication</p>
          <h2>Message à tous les inscrits</h2>
        </div>
        <span className={`admin-bac-status ${configured ? "is-published" : "is-locked"}`}>
          {configured ? <CheckCircle size={18} weight="fill" /> : <WarningCircle size={18} weight="duotone" />}
          {configured ? "Envoi actif" : "Envoi désactivé"}
        </span>
      </header>

      {configured === false && (
        <p className="admin-broadcast-warning">
          <WarningCircle size={18} weight="duotone" />
          <span>
            L’envoi d’e-mails attend un <strong>domaine d’expédition vérifié</strong>. Sans lui, Gmail refuse
            le courrier. Tu peux déjà rédiger et vérifier la cible : l’envoi s’activera tout seul une fois le
            domaine configuré, sans toucher au code.
          </span>
        </p>
      )}
      {configured && sender && (
        <p className="admin-broadcast-sender"><EnvelopeSimple size={16} weight="duotone" /> Expéditeur : <strong>{sender}</strong></p>
      )}

      <div className="admin-broadcast-audience" role="group" aria-label="Destinataires">
        {audienceOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            className={audience === option.id ? "is-active" : ""}
            aria-pressed={audience === option.id}
            onClick={() => setAudience(option.id)}
          >
            <strong>{option.label}</strong>
            <small>{option.detail}</small>
          </button>
        ))}
      </div>

      <p className="admin-broadcast-count">
        <Users size={17} weight="duotone" />
        {recipientCount === null
          ? "Calcul du nombre de destinataires…"
          : <>Cette cible représente <strong>{recipientCount}</strong> destinataire(s), désabonnés exclus.</>}
      </p>

      <label className="admin-broadcast-field">
        <span>Objet</span>
        <input
          type="text"
          value={subject}
          maxLength={160}
          placeholder="Ex. Nouvelle leçon de Terminale C disponible"
          onChange={(event) => { setSubject(event.target.value); setConfirming(false); }}
        />
      </label>

      <label className="admin-broadcast-field">
        <span>Message</span>
        <textarea
          value={body}
          rows={7}
          maxLength={5000}
          placeholder="Écris ton message. Les sauts de ligne sont conservés dans l’e-mail."
          onChange={(event) => { setBody(event.target.value); setConfirming(false); }}
        />
        <small>{body.trim().length} / 5000 caractères</small>
      </label>

      {error && <p className="admin-broadcast-error" role="alert">{error}</p>}
      {notice && <p className="admin-broadcast-notice">{notice}</p>}

      <div className="admin-broadcast-actions">
        {confirming ? (
          <>
            <button type="button" className="admin-broadcast-send" disabled={!canSend} onClick={() => void send()}>
              <PaperPlaneTilt size={18} weight="fill" />
              {sending ? "Envoi en cours…" : `Confirmer l’envoi à ${recipientCount} destinataire(s)`}
            </button>
            <button type="button" className="admin-broadcast-cancel" onClick={() => setConfirming(false)}>Annuler</button>
          </>
        ) : (
          <button
            type="button"
            className="admin-broadcast-send"
            disabled={!canSend}
            onClick={() => setConfirming(true)}
          >
            <PaperPlaneTilt size={18} weight="duotone" />
            Préparer l’envoi
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className="admin-broadcast-history">
          <h3>Diffusions précédentes</h3>
          <ul>
            {history.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.subject}</strong>
                <small>
                  {audienceLabel(entry.audience)} · {entry.sentCount}/{entry.recipientCount} envoyé(s)
                  {entry.failedCount > 0 && <> · {entry.failedCount} en échec</>}
                  {" · "}{entry.authorName} · {formatDate(entry.createdAt)}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
