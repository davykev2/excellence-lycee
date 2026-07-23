import { useState } from "react";
import {
  ArrowClockwise,
  ChatCircleDots,
  Heart,
  Lightbulb,
  PaperPlaneTilt,
  PencilSimple,
  Smiley,
  Trash,
  WarningDiamond,
} from "@phosphor-icons/react";
import type { AuthUser, UserRole } from "../../domain/auth";
import type { LessonReaction } from "../../domain/lessonFeedback";
import { ProfileAvatar } from "../../ui/ProfileAvatar";
import { useLessonFeedback } from "./useLessonFeedback";

interface LessonFeedbackPanelProps {
  pathId: string;
  lessonId: string;
  currentUser: Pick<AuthUser, "id" | "name" | "photoUrl" | "role">;
  localOnly?: boolean;
  context?: "lesson" | "correction";
}

const reactions: Array<{
  id: LessonReaction;
  label: string;
  hint: string;
  icon: typeof Smiley;
}> = [
  { id: "useful", label: "Utile", hint: "Cette partie m’aide", icon: Smiley },
  { id: "love", label: "J’adore", hint: "J’aime cette leçon", icon: Heart },
  { id: "clear", label: "Très clair", hint: "J’ai bien compris", icon: Lightbulb },
  { id: "confusing", label: "À améliorer", hint: "Une partie reste difficile", icon: WarningDiamond },
];

const roleLabels: Record<UserRole, string> = {
  student: "Élève",
  teacher: "Enseignant",
  content_editor: "Équipe pédagogique",
  admin: "Administration",
};

function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function LessonFeedbackPanel({
  pathId,
  lessonId,
  currentUser,
  localOnly = false,
  context = "lesson",
}: LessonFeedbackPanelProps) {
  const {
    feedback,
    loading,
    pendingAction,
    error,
    reload,
    react,
    addComment,
    editComment,
    deleteComment,
  } = useLessonFeedback({ pathId, lessonId, currentUser, localOnly });
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const isCorrection = context === "correction";

  const submitComment = async () => {
    const body = draft.trim();
    if (!body || body.length > 1000) return;
    if (await addComment(body)) setDraft("");
  };

  const saveEdit = async (commentId: string) => {
    const body = editingBody.trim();
    if (!body || body.length > 1000) return;
    if (await editComment(commentId, body)) {
      setEditingId(null);
      setEditingBody("");
    }
  };

  return (
    <section
      className={`mastery-feedback-panel${isCorrection ? " is-correction" : ""}`}
      aria-labelledby={`lesson-feedback-title-${context}`}
    >
      <header className="lesson-feedback-heading">
        <span><ChatCircleDots size={25} weight="duotone" /></span>
        <div>
          <p className="path-kicker">{isCorrection ? "Retour sur la correction" : "Ton avis compte"}</p>
          <h2 id={`lesson-feedback-title-${context}`}>
            {isCorrection ? "Cette correction t’a-t-elle aidé ?" : "Aide-nous à améliorer ce niveau"}
          </h2>
          <p>{isCorrection
            ? "Dis-nous si les explications sont claires ou ce qu’il faudrait détailler davantage."
            : "Une réaction ou un commentaire suffit pour guider l’équipe pédagogique."}
          </p>
        </div>
      </header>

      {loading ? (
        <div className="lesson-feedback-loading" role="status">
          <span aria-hidden="true" />
          Chargement des retours…
        </div>
      ) : (
        <>
          <div className="lesson-reactions" aria-label="Réagir à ce niveau">
            {reactions.map((reaction) => {
              const Icon = reaction.icon;
              const selected = feedback.reactions.myReaction === reaction.id;
              return (
                <button
                  className={selected ? "is-selected" : ""}
                  type="button"
                  aria-pressed={selected}
                  title={reaction.hint}
                  disabled={pendingAction?.startsWith("reaction:")}
                  onClick={() => void react(reaction.id)}
                  key={reaction.id}
                >
                  <Icon size={21} weight={selected ? "fill" : "duotone"} />
                  <span>{reaction.label}</span>
                  <strong>{feedback.reactions.counts[reaction.id]}</strong>
                </button>
              );
            })}
          </div>

          <div className="lesson-comment-composer">
            <ProfileAvatar name={currentUser.name} photoUrl={currentUser.photoUrl} />
            <label>
              <span className="sr-only">Ton commentaire sur ce niveau</span>
              <textarea
                value={draft}
                maxLength={1000}
                rows={3}
                placeholder={isCorrection
                  ? "Qu’est-ce qui est clair dans la correction, ou quelle étape faut-il mieux expliquer ?"
                  : "Qu’est-ce qui t’a aidé ou qu’est-ce qui mérite une meilleure explication ?"}
                onChange={(event) => setDraft(event.target.value)}
              />
              <small>{draft.length}/1 000</small>
            </label>
            <button
              className="primary-action is-compact"
              type="button"
              disabled={!draft.trim() || pendingAction === "comment:create"}
              onClick={() => void submitComment()}
            >
              <PaperPlaneTilt size={18} weight="bold" />
              {pendingAction === "comment:create" ? "Envoi…" : "Commenter"}
            </button>
          </div>

          <div className="lesson-comment-list-heading">
            <strong>{feedback.commentCount} commentaire{feedback.commentCount === 1 ? "" : "s"}</strong>
            <span>Les 50 plus récents sont affichés.</span>
          </div>

          {feedback.comments.length === 0 ? (
            <div className="lesson-comment-empty">
              <ChatCircleDots size={30} weight="duotone" />
              <strong>{isCorrection
                ? "Sois le premier à évaluer cette correction."
                : "Sois le premier à donner un avis précis."}
              </strong>
              <span>{isCorrection
                ? "Ton retour nous aidera à rendre les prochaines corrections plus simples et plus complètes."
                : "Ton retour nous aidera à rendre cette partie plus simple pour les prochains élèves."}
              </span>
            </div>
          ) : (
            <ol className="lesson-comment-list">
              {feedback.comments.map((comment) => {
                const editing = editingId === comment.id;
                const deleting = pendingAction === `comment:delete:${comment.id}`;
                return (
                  <li key={comment.id}>
                    <ProfileAvatar name={comment.authorName} photoUrl={comment.authorPhotoUrl} />
                    <div className="lesson-comment-content">
                      <header>
                        <div>
                          <strong>{comment.authorName}</strong>
                          <span>{roleLabels[comment.authorRole]}</span>
                        </div>
                        <time dateTime={comment.createdAt}>
                          {formatCommentDate(comment.createdAt)}
                          {comment.updatedAt ? " · modifié" : ""}
                        </time>
                      </header>

                      {editing ? (
                        <div className="lesson-comment-edit">
                          <textarea
                            value={editingBody}
                            maxLength={1000}
                            rows={3}
                            aria-label="Modifier le commentaire"
                            onChange={(event) => setEditingBody(event.target.value)}
                          />
                          <div>
                            <button type="button" onClick={() => setEditingId(null)}>Annuler</button>
                            <button
                              className="is-save"
                              type="button"
                              disabled={!editingBody.trim() || pendingAction === `comment:edit:${comment.id}`}
                              onClick={() => void saveEdit(comment.id)}
                            >
                              Enregistrer
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p>{comment.body}</p>
                      )}

                      {!editing && (comment.canEdit || comment.canDelete) && (
                        <div className="lesson-comment-actions">
                          {comment.canEdit && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(comment.id);
                                setEditingBody(comment.body);
                                setConfirmDeleteId(null);
                              }}
                            >
                              <PencilSimple size={15} /> Modifier
                            </button>
                          )}
                          {comment.canDelete && (
                            confirmDeleteId === comment.id ? (
                              <>
                                <span>Supprimer ce commentaire ?</span>
                                <button type="button" onClick={() => setConfirmDeleteId(null)}>Annuler</button>
                                <button
                                  className="is-danger"
                                  type="button"
                                  disabled={deleting}
                                  onClick={async () => {
                                    if (await deleteComment(comment.id)) setConfirmDeleteId(null);
                                  }}
                                >
                                  {deleting ? "Suppression…" : "Confirmer"}
                                </button>
                              </>
                            ) : (
                              <button className="is-danger" type="button" onClick={() => setConfirmDeleteId(comment.id)}>
                                <Trash size={15} /> Supprimer
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </>
      )}

      {error && (
        <div className="lesson-feedback-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => void reload()}>
            <ArrowClockwise size={17} weight="bold" /> Réessayer
          </button>
        </div>
      )}
    </section>
  );
}
