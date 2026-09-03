import {
  ArrowClockwise,
  ArrowLeft,
  Check,
  CheckCircle,
  ClipboardText,
  FileMagnifyingGlass,
  MagnifyingGlass,
  NotePencil,
  Paperclip,
  RocketLaunch,
  Scales,
  ShieldCheck,
  Student,
  UploadSimple,
  WarningCircle,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { MarkdownContent } from "../../../components/MarkdownContent";
import "../../../styles/admin-homework.css";
import { HomeworkPackageImporter } from "./HomeworkPackageImporter";
import { HomeworkPublicationManager } from "./HomeworkPublicationManager";
import {
  setHomeworkPublication,
  submitHomeworkReview,
  useHomeworkReviewDetail,
  useHomeworkReviewQueue,
} from "./homeworkReviewApi";
import {
  calculateHomeworkReviewTotals,
  createHomeworkReviewDrafts,
  createHomeworkReviewPayload,
  manualQuestionPoints,
  questionAutomaticPoints,
  questionHasStudentSubmission,
  questionManualMaximum,
  questionMaximum,
  questionNeedsManualReview,
  validateHomeworkReviewDrafts,
  type HomeworkQuestionReviewDraft,
  type HomeworkReviewDrafts,
} from "./homeworkReviewModel";
import type {
  HomeworkReviewDetail,
  HomeworkReviewItem,
  HomeworkReviewQuestion,
  HomeworkReviewStatus,
} from "./homeworkReviewTypes";

const pointFormatter = new Intl.NumberFormat("fr-CI", { maximumFractionDigits: 2 });

function formatPoints(value: number) {
  return pointFormatter.format(value);
}

function formatDate(value?: string) {
  if (!value) return "Date non renseignée";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date non renseignée";
  return new Intl.DateTimeFormat("fr-CI", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function answerKindLabel(question: HomeworkReviewQuestion) {
  if (question.isNeutralized) return "Question neutralisée";
  if (question.gradingMode === "auto") return "Correction automatique";
  if (question.gradingMode === "hybrid") return "Correction mixte";
  if (question.answerKind === "essay") return "Démonstration à corriger";
  if (question.attachmentUrls.length > 0) return "Copie manuscrite à corriger";
  return "Réponse libre à corriger";
}

function isSafeAttachmentUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function isImageAttachment(value: string) {
  try {
    return /\.(?:avif|gif|jpe?g|png|webp)$/i.test(new URL(value).pathname);
  } catch {
    return false;
  }
}

function attachmentLabel(value: string, index: number) {
  try {
    const path = decodeURIComponent(new URL(value).pathname);
    return path.split("/").filter(Boolean).at(-1) || `Pièce jointe ${index + 1}`;
  } catch {
    return `Pièce jointe ${index + 1}`;
  }
}

function reviewAnswerParts(answer: HomeworkReviewQuestion["studentAnswer"]) {
  if (typeof answer === "string") {
    return { finalAnswer: answer.trim(), reasoning: "" };
  }
  if (!answer || typeof answer !== "object") return { finalAnswer: "", reasoning: "" };
  return {
    finalAnswer: typeof answer.finalAnswer === "string" ? answer.finalAnswer.trim() : "",
    reasoning: typeof answer.reasoning === "string" ? answer.reasoning.trim() : "",
  };
}

function expectedAnswerMarkdown(question: HomeworkReviewQuestion) {
  const answer = question.expectedAnswer;
  if (typeof answer === "string") return answer;
  if (Array.isArray(answer)) {
    const values = answer.filter((value): value is string => typeof value === "string" && Boolean(value.trim()));
    return values.length > 0 ? values.map((value) => `- ${value}`).join("\n") : "";
  }
  if (answer != null && typeof answer === "object") {
    const candidate = answer as { finalAnswer?: unknown; value?: unknown };
    if (typeof candidate.finalAnswer === "string") return candidate.finalAnswer;
    if (typeof candidate.value === "string") return candidate.value;
  }
  return "";
}

function StudentCopy({ question }: { question: HomeworkReviewQuestion }) {
  const attachments = question.attachmentUrls.filter(isSafeAttachmentUrl);
  const answer = reviewAnswerParts(question.studentAnswer);
  return (
    <section className="homework-review-answer" aria-label="Réponse de l’élève">
      <div className="homework-review-section-label">
        <Student size={18} weight="duotone" />
        <strong>Réponse de l’élève</strong>
      </div>
      {answer.finalAnswer || answer.reasoning ? (
        <div className="homework-review-answer-parts">
          {answer.finalAnswer && (
            <div>
              <span>Réponse finale</span>
              <MarkdownContent markdown={answer.finalAnswer} preserveLineBreaks />
            </div>
          )}
          {answer.reasoning && (
            <div className="is-reasoning">
              <span>Démonstration / raisonnement</span>
              <MarkdownContent markdown={answer.reasoning} preserveLineBreaks />
            </div>
          )}
        </div>
      ) : (
        <p className="homework-review-empty-answer">Aucun texte saisi.</p>
      )}
      {attachments.length > 0 && (
        <div className="homework-review-attachments">
          <strong><Paperclip size={17} weight="bold" /> Pièces jointes ({attachments.length})</strong>
          <div>
            {attachments.map((url, index) => (
              <a href={url} target="_blank" rel="noreferrer" key={url}>
                {isImageAttachment(url) && <img src={url} alt={`Aperçu de la pièce jointe ${index + 1}`} loading="lazy" />}
                <span>{attachmentLabel(url, index)}</span>
                <small>Ouvrir dans un nouvel onglet</small>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function CorrectionReference({ question }: { question: HomeworkReviewQuestion }) {
  const expectedAnswerId = typeof question.expectedAnswer === "string" ? question.expectedAnswer : null;
  const expectedChoice = expectedAnswerId
    ? question.choices?.find((choice) => choice.id === expectedAnswerId)
    : undefined;
  const expectedAnswer = expectedChoice
    ? `${expectedChoice.label}. ${expectedChoice.contentMarkdown}`
    : expectedAnswerMarkdown(question);
  return (
    <section className="homework-review-reference" aria-label="Corrigé et barème de référence">
      <div className="homework-review-section-label">
        <ShieldCheck size={18} weight="duotone" />
        <strong>Corrigé réservé à l’administration</strong>
      </div>
      <div className="homework-review-reference-grid">
        <div>
          <span>Réponse attendue</span>
          <MarkdownContent
            markdown={expectedAnswer}
            preserveLineBreaks
            emptyState={<p>Réponse attendue non renseignée.</p>}
          />
        </div>
        <div>
          <span>Correction expliquée</span>
          <MarkdownContent
            markdown={question.explanationMarkdown}
            preserveLineBreaks
            emptyState={<p>Explication non renseignée.</p>}
          />
        </div>
      </div>
    </section>
  );
}

function NumberField({
  id,
  value,
  maximum,
  disabled,
  label,
  onChange,
}: {
  id: string;
  value: number;
  maximum: number;
  disabled: boolean;
  label: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="homework-review-number-field" htmlFor={id}>
      <span>{label}</span>
      <span className="homework-review-number-control">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          max={maximum}
          step="0.25"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
        />
        <em>/ {formatPoints(maximum)}</em>
      </span>
    </label>
  );
}

function ManualRubric({
  question,
  draft,
  disabled,
  error,
  onChange,
}: {
  question: HomeworkReviewQuestion;
  draft: HomeworkQuestionReviewDraft;
  disabled: boolean;
  error?: string;
  onChange: (draft: HomeworkQuestionReviewDraft) => void;
}) {
  const points = manualQuestionPoints(question, draft);
  const maximum = questionManualMaximum(question);
  return (
    <section className={`homework-review-rubric${error ? " has-error" : ""}`}>
      <header>
        <div>
          <Scales size={20} weight="duotone" />
          <span><strong>Barème de correction</strong><small>Attribue uniquement les points réellement démontrés.</small></span>
        </div>
        <strong>{formatPoints(points)} / {formatPoints(maximum)}</strong>
      </header>

      {question.rubricCriteria.length > 0 ? (
        <div className="homework-review-criteria">
          {question.rubricCriteria.map((criterion, index) => (
            <NumberField
              key={criterion.id}
              id={`review-${question.id}-criterion-${criterion.id}`}
              label={`${index + 1}. ${criterion.label}`}
              value={draft.criteria[criterion.id] ?? 0}
              maximum={criterion.pointsMax}
              disabled={disabled}
              onChange={(value) => onChange({
                ...draft,
                criteria: {
                  ...draft.criteria,
                  [criterion.id]: Number.isFinite(value) ? value : 0,
                },
              })}
            />
          ))}
          <p className="homework-review-rubric-total">
            <span>Total calculé automatiquement</span>
            <strong>{formatPoints(points)} / {formatPoints(maximum)}</strong>
          </p>
        </div>
      ) : (
        <NumberField
          id={`review-${question.id}-points`}
          label="Points attribués"
          value={draft.pointsAwarded}
          maximum={maximum}
          disabled={disabled}
          onChange={(value) => onChange({
            ...draft,
            pointsAwarded: Number.isFinite(value) ? value : 0,
          })}
        />
      )}

      <label className="homework-review-comment" htmlFor={`review-${question.id}-comment`}>
        <span>Retour à l’élève <small>(facultatif)</small></span>
        <textarea
          id={`review-${question.id}-comment`}
          rows={3}
          value={draft.comment}
          disabled={disabled}
          maxLength={1000}
          placeholder="Explique ce qui est acquis et ce qui doit être repris…"
          onChange={(event) => onChange({ ...draft, comment: event.currentTarget.value })}
        />
      </label>
      {error && <p className="homework-review-field-error" role="alert">{error}</p>}
    </section>
  );
}

function QuestionReviewCard({
  question,
  draft,
  disabled,
  error,
  onDraftChange,
}: {
  question: HomeworkReviewQuestion;
  draft?: HomeworkQuestionReviewDraft;
  disabled: boolean;
  error?: string;
  onDraftChange: (draft: HomeworkQuestionReviewDraft) => void;
}) {
  const automaticAwarded = questionAutomaticPoints(question);
  const manualAwarded = manualQuestionPoints(question, draft);
  const awarded = automaticAwarded + manualAwarded;
  const isManual = questionNeedsManualReview(question);
  const hasSubmission = questionHasStudentSubmission(question);

  return (
    <article className={`homework-review-question${isManual ? " is-manual" : " is-automatic"}`}>
      <header className="homework-review-question-header">
        <div>
          <span className="homework-review-question-order">{question.label || `Question ${question.order}`}</span>
          <span className={`homework-review-question-mode${question.isNeutralized ? " is-neutralized" : ""}`}>
            {answerKindLabel(question)}
          </span>
        </div>
        <strong>{formatPoints(awarded)} / {formatPoints(questionMaximum(question))}</strong>
      </header>

      <section className="homework-review-prompt" aria-label="Énoncé">
        <span>Énoncé</span>
        <MarkdownContent markdown={question.promptMarkdown} preserveLineBreaks />
        {question.choices && question.choices.length > 0 && (
          <ol className="homework-review-choices" aria-label="Propositions de réponse">
            {question.choices.map((choice) => (
              <li key={choice.id}>
                <strong>{choice.label}</strong>
                <MarkdownContent markdown={choice.contentMarkdown} preserveLineBreaks />
              </li>
            ))}
          </ol>
        )}
        {question.imageUrl && (
          <figure>
            <img src={question.imageUrl} alt={question.imageAlt || "Illustration de la question"} loading="lazy" />
            {question.imageAlt && <figcaption>{question.imageAlt}</figcaption>}
          </figure>
        )}
      </section>

      <StudentCopy question={question} />
      <CorrectionReference question={question} />

      {question.gradingMode === "hybrid" && !question.isNeutralized && (
        <div className="homework-review-hybrid-score" aria-label="Part automatique non modifiable">
          <CheckCircle size={21} weight="duotone" />
          <span>
            <strong>Réponse finale corrigée automatiquement</strong>
            {formatPoints(automaticAwarded)} / {formatPoints(question.autoPoints ?? 0)} point{(question.autoPoints ?? 0) > 1 ? "s" : ""} déjà attribué{automaticAwarded > 1 ? "s" : ""}.
          </span>
          <em>Non modifiable</em>
        </div>
      )}

      {question.isNeutralized ? (
        <div className="homework-review-auto-note is-neutralized">
          <WarningCircle size={21} weight="duotone" />
          <span><strong>Question neutralisée</strong>Les {formatPoints(questionMaximum(question))} points sont accordés automatiquement.</span>
        </div>
      ) : question.gradingMode === "auto" ? (
        <div className="homework-review-auto-note">
          <CheckCircle size={21} weight="duotone" />
          <span><strong>Correction automatique terminée</strong>Le serveur a attribué {formatPoints(awarded)} point{awarded > 1 ? "s" : ""}.</span>
        </div>
      ) : !hasSubmission ? (
        <div className="homework-review-auto-note is-unanswered">
          <WarningCircle size={21} weight="duotone" />
          <span><strong>Réponse non remise</strong>Aucun point humain n’est attribué et aucune saisie n’est nécessaire.</span>
        </div>
      ) : isManual && draft ? (
        <ManualRubric
          question={question}
          draft={draft}
          disabled={disabled}
          error={error}
          onChange={onDraftChange}
        />
      ) : null}
    </article>
  );
}

function ReviewScoreSummary({
  detail,
  drafts,
}: {
  detail: HomeworkReviewDetail;
  drafts: HomeworkReviewDrafts;
}) {
  const totals = calculateHomeworkReviewTotals(detail.questions, drafts);
  return (
    <aside className="homework-review-score" aria-label="Note calculée">
      <div>
        <span>Automatique</span>
        <strong>{formatPoints(totals.automatic)} pts</strong>
      </div>
      <div>
        <span>Correction humaine</span>
        <strong>{formatPoints(totals.manual)} / {formatPoints(totals.manualMaximum)} pts</strong>
      </div>
      <div>
        <span>Total brut</span>
        <strong>{formatPoints(totals.awarded)} / {formatPoints(totals.maximum)}</strong>
      </div>
      <div className="is-final">
        <span>Note calculée</span>
        <strong>{formatPoints(totals.scoreOutOf20)} / 20</strong>
      </div>
    </aside>
  );
}

function HomeworkReviewCopy({
  detail,
  onBack,
  onCompleted,
}: {
  detail: HomeworkReviewDetail;
  onBack: () => void;
  onCompleted: (scoreOutOf20: number) => void;
}) {
  const completed = detail.attempt.status === "graded";
  const [drafts, setDrafts] = useState(() => createHomeworkReviewDrafts(detail));
  const [overallComment, setOverallComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [publishingResults, setPublishingResults] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [publicationState, setPublicationState] = useState({
    subjectPublished: Boolean(detail.homework.subjectPublished),
    correctionsPublished: Boolean(detail.homework.correctionsPublished),
  });
  const totals = calculateHomeworkReviewTotals(detail.questions, drafts);

  const updateDraft = (questionId: string, next: HomeworkQuestionReviewDraft) => {
    setDrafts((current) => ({ ...current, [questionId]: next }));
    setErrors((current) => {
      if (!current[questionId]) return current;
      const nextErrors = { ...current };
      delete nextErrors[questionId];
      return nextErrors;
    });
  };

  const prepareSubmission = () => {
    const nextErrors = validateHomeworkReviewDrafts(detail.questions, drafts);
    setErrors(nextErrors);
    setSubmitError(null);
    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(`homework-review-${Object.keys(nextErrors)[0]}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    setConfirmationOpen(true);
  };

  const confirmSubmission = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = createHomeworkReviewPayload(detail.questions, drafts, overallComment);
      const response = await submitHomeworkReview(detail.attempt.id, payload);
      setConfirmationOpen(false);
      onCompleted(response.result.scoreOutOf20);
    } catch (reason) {
      setSubmitError(reason instanceof Error
        ? reason.message
        : "La correction n’a pas pu être enregistrée.");
      setConfirmationOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const advanceResultPublication = async () => {
    setPublishingResults(true);
    setSubmitError(null);
    try {
      const payload = publicationState.subjectPublished
        ? { subjectPublished: false, correctionsPublished: false }
        : { correctionsPublished: true };
      const response = await setHomeworkPublication(detail.homework.id, payload);
      setPublicationState({
        subjectPublished: Boolean(response.homework.subjectPublished),
        correctionsPublished: Boolean(response.homework.correctionsPublished),
      });
    } catch (reason) {
      setSubmitError(reason instanceof Error
        ? reason.message
        : "Les résultats n’ont pas pu être publiés.");
    } finally {
      setPublishingResults(false);
    }
  };

  return (
    <div className="homework-review-copy">
      <button className="homework-review-mobile-back" type="button" onClick={onBack}>
        <ArrowLeft size={18} weight="bold" />
        Retour aux copies
      </button>

      <header className="homework-review-copy-header">
        <div>
          <p className="admin-eyebrow">Correction humaine · {detail.homework.subject.name}</p>
          <h2>{detail.homework.title}</h2>
          <p>{detail.homework.institution} · {detail.homework.academicYear}</p>
        </div>
        <span className={`homework-review-copy-status ${completed ? "is-completed" : "is-pending"}`}>
          {completed ? <CheckCircle size={18} weight="fill" /> : <NotePencil size={18} weight="duotone" />}
          {completed ? "Correction validée" : "À corriger"}
        </span>
      </header>

      <div className="homework-review-student-meta">
        <span aria-hidden="true">{detail.student.name.trim().charAt(0).toLocaleUpperCase("fr") || "É"}</span>
        <div>
          <strong>{detail.student.name}</strong>
          <small>{detail.student.email} · {detail.homework.level.name} {detail.homework.series.name}</small>
        </div>
        <dl>
          <div><dt>Copie</dt><dd>Essai {detail.attempt.attemptNumber}/{detail.homework.maxAttempts}</dd></div>
          <div><dt>Déposée</dt><dd>{formatDate(detail.attempt.submittedAt)}</dd></div>
          <div><dt>Réponses</dt><dd>{detail.attempt.answeredCount}/{detail.attempt.questionCount}</dd></div>
        </dl>
      </div>

      <div className="homework-review-privacy-note">
        <ShieldCheck size={20} weight="duotone" />
        <p><strong>Corrigé confidentiel.</strong> La réponse attendue et les explications ci-dessous restent dans cet espace administrateur.</p>
      </div>

      <ReviewScoreSummary detail={detail} drafts={drafts} />

      <div className="homework-review-question-list">
        {detail.questions.map((question) => (
          <div id={`homework-review-${question.id}`} key={question.id}>
            <QuestionReviewCard
              question={question}
              draft={drafts[question.id]}
              disabled={completed || submitting}
              error={errors[question.id]}
              onDraftChange={(draft) => updateDraft(question.id, draft)}
            />
          </div>
        ))}
      </div>

      <section className="homework-review-final-comment">
        <label htmlFor={`homework-review-overall-${detail.attempt.id}`}>
          <span>Appréciation générale <small>(facultatif)</small></span>
          <textarea
            id={`homework-review-overall-${detail.attempt.id}`}
            rows={4}
            maxLength={1500}
            value={overallComment}
            disabled={completed || submitting}
            placeholder="Résume les points forts et la priorité de travail pour cette copie…"
            onChange={(event) => setOverallComment(event.currentTarget.value)}
          />
        </label>
      </section>

      {submitError && (
        <p className="homework-review-submit-error" role="alert">
          <WarningCircle size={19} weight="duotone" />{submitError}
        </p>
      )}

      {!completed && (
        <footer className="homework-review-validation-bar">
          <div>
            <span>Note qui sera enregistrée</span>
            <strong>{formatPoints(totals.scoreOutOf20)} / 20</strong>
          </div>
          <button className="primary-action is-compact" type="button" disabled={submitting} onClick={prepareSubmission}>
            <Check size={18} weight="bold" />
            Relire et valider la correction
          </button>
        </footer>
      )}

      {completed && (
        <footer className="homework-review-result-publication">
          <div>
            <span>Diffusion à l’élève</span>
            <strong>{publicationState.correctionsPublished
              ? "Note et corrigé publiés"
              : publicationState.subjectPublished
                ? "Ferme d’abord le sujet"
                : "Résultats encore masqués"}</strong>
            <small>Cette action vise exactement la version utilisée par cette copie, même si un nouveau devoir a depuis été importé.</small>
          </div>
          {!publicationState.correctionsPublished && (
            <button className="primary-action is-compact" type="button" disabled={publishingResults} onClick={() => void advanceResultPublication()}>
              <RocketLaunch size={18} weight="duotone" />
              {publishingResults
                ? "Mise à jour…"
                : publicationState.subjectPublished
                  ? "Fermer le sujet"
                  : "Publier note + corrigé"}
            </button>
          )}
        </footer>
      )}

      {confirmationOpen && (
        <div className="homework-review-confirmation-layer" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="homework-review-confirmation-title">
            <span><ShieldCheck size={26} weight="duotone" /></span>
            <h3 id="homework-review-confirmation-title">Valider définitivement cette correction ?</h3>
            <p>
              La note <strong>{formatPoints(totals.scoreOutOf20)}/20</strong> sera enregistrée pour {detail.student.name}.
              La copie quittera la file « À corriger ».
            </p>
            <div>
              <button className="secondary-action" type="button" disabled={submitting} onClick={() => setConfirmationOpen(false)}>
                Revenir à la copie
              </button>
              <button className="primary-action is-compact" type="button" disabled={submitting} onClick={() => void confirmSubmission()}>
                {submitting ? "Validation…" : "Confirmer la note"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function QueueItem({
  item,
  selected,
  onSelect,
}: {
  item: HomeworkReviewItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={`homework-review-queue-item${selected ? " is-selected" : ""}`}
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
    >
      <span className="homework-review-queue-avatar" aria-hidden="true">
        {item.student.name.trim().charAt(0).toLocaleUpperCase("fr") || "É"}
      </span>
      <span className="homework-review-queue-copy">
        <strong>{item.student.name}</strong>
        <small>{item.homeworkTitle}</small>
        <em>{item.institution} · {formatDate(item.submittedAt)}</em>
      </span>
      <span className="homework-review-queue-points">
        {item.reviewStatus === "completed" ? (
          <CheckCircle size={19} weight="fill" aria-label="Correction terminée" />
        ) : (
          <><strong>{formatPoints(item.pendingManualPoints)}</strong><small>pts à corriger</small></>
        )}
      </span>
    </button>
  );
}

function HomeworkReviewQueue({
  initialAttemptId,
  onReviewCompleted,
}: {
  initialAttemptId?: string;
  onReviewCompleted?: (scoreOutOf20: number) => void;
}) {
  const [status, setStatus] = useState<HomeworkReviewStatus>("pending");
  const [query, setQuery] = useState("");
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(initialAttemptId ?? null);
  const [success, setSuccess] = useState<string | null>(null);
  const queue = useHomeworkReviewQueue(status);
  const detail = useHomeworkReviewDetail(selectedAttemptId);

  useEffect(() => {
    if (!selectedAttemptId && queue.items.length > 0 && window.matchMedia("(min-width: 861px)").matches) {
      setSelectedAttemptId(queue.items[0].attemptId);
    }
  }, [queue.items, selectedAttemptId]);

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("fr");
    if (!needle) return queue.items;
    return queue.items.filter((item) => (
      `${item.student.name} ${item.student.email} ${item.homeworkTitle} ${item.institution} ${item.academicYear}`
        .toLocaleLowerCase("fr")
        .includes(needle)
    ));
  }, [query, queue.items]);

  const changeStatus = (next: HomeworkReviewStatus) => {
    setStatus(next);
    setSelectedAttemptId(null);
    setSuccess(null);
  };

  const completedReview = (scoreOutOf20: number) => {
    setSuccess(`Correction validée : ${formatPoints(scoreOutOf20)}/20.`);
    queue.reload();
    detail.reload();
    onReviewCompleted?.(scoreOutOf20);
  };

  return (
    <article className={`admin-panel homework-review-workspace${selectedAttemptId ? " has-open-copy" : ""}`}>
      <header className="homework-review-heading">
        <div>
          <p className="admin-eyebrow"><ClipboardText size={16} weight="duotone" /> Corrections des devoirs</p>
          <h2>Copies à relire</h2>
          <p>Les QCM sont notés automatiquement. Les démonstrations suivent le barème critère par critère avant la note finale.</p>
        </div>
        <span><ShieldCheck size={18} weight="duotone" /> Accès administrateur</span>
      </header>

      {success && <p className="homework-review-success" role="status"><CheckCircle size={19} weight="fill" />{success}</p>}

      <div className="homework-review-layout">
        <aside className="homework-review-queue" aria-label="File des copies">
          <div className="homework-review-status-tabs" role="tablist" aria-label="État des corrections">
            <button
              type="button"
              role="tab"
              aria-selected={status === "pending"}
              className={status === "pending" ? "is-active" : ""}
              onClick={() => changeStatus("pending")}
            >
              À corriger
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={status === "completed"}
              className={status === "completed" ? "is-active" : ""}
              onClick={() => changeStatus("completed")}
            >
              Terminées
            </button>
          </div>

          <label className="homework-review-search">
            <MagnifyingGlass size={18} weight="bold" />
            <span className="sr-only">Rechercher une copie</span>
            <input
              type="search"
              value={query}
              placeholder="Élève, devoir ou école"
              onChange={(event) => setQuery(event.currentTarget.value)}
            />
          </label>

          <div className="homework-review-queue-summary">
            <span>{filteredItems.length} copie{filteredItems.length > 1 ? "s" : ""}</span>
            <button type="button" onClick={queue.reload} disabled={queue.loading} aria-label="Actualiser les copies">
              <ArrowClockwise size={18} weight="bold" />
            </button>
          </div>

          {queue.loading && queue.items.length === 0 && (
            <p className="homework-review-queue-feedback" role="status">Davy rassemble les copies…</p>
          )}
          {queue.error && (
            <div className="homework-review-queue-feedback is-error" role="alert">
              <WarningCircle size={22} weight="duotone" />
              <span>{queue.error}</span>
              <button type="button" onClick={queue.reload}>Réessayer</button>
            </div>
          )}
          {!queue.loading && !queue.error && filteredItems.length === 0 && (
            <div className="homework-review-queue-feedback">
              <CheckCircle size={26} weight="duotone" />
              <strong>{query ? "Aucune copie trouvée" : status === "pending" ? "La file est à jour" : "Aucune correction terminée"}</strong>
              <span>{query ? "Essaie une autre recherche." : status === "pending" ? "Aucune démonstration n’attend de relecture." : "Les copies validées apparaîtront ici."}</span>
            </div>
          )}
          {!queue.error && filteredItems.map((item) => (
            <QueueItem
              key={item.attemptId}
              item={item}
              selected={selectedAttemptId === item.attemptId}
              onSelect={() => {
                setSelectedAttemptId(item.attemptId);
                setSuccess(null);
              }}
            />
          ))}
        </aside>

        <main className="homework-review-detail">
          {!selectedAttemptId && (
            <div className="homework-review-detail-empty">
              <FileMagnifyingGlass size={42} weight="duotone" />
              <h3>Sélectionne une copie</h3>
              <p>Tu verras l’énoncé, la réponse de l’élève, les pièces jointes et le barème détaillé.</p>
            </div>
          )}
          {selectedAttemptId && detail.loading && !detail.detail && (
            <div className="homework-review-detail-empty" role="status">
              <span className="homework-review-spinner" />
              <p>Ouverture de la copie…</p>
            </div>
          )}
          {selectedAttemptId && detail.error && (
            <div className="homework-review-detail-empty is-error" role="alert">
              <WarningCircle size={35} weight="duotone" />
              <h3>Impossible d’ouvrir cette copie</h3>
              <p>{detail.error}</p>
              <button className="secondary-action" type="button" onClick={detail.reload}>Réessayer</button>
            </div>
          )}
          {detail.detail && !detail.error && (
            <HomeworkReviewCopy
              key={`${detail.detail.attempt.id}-${detail.detail.attempt.status}`}
              detail={detail.detail}
              onBack={() => setSelectedAttemptId(null)}
              onCompleted={completedReview}
            />
          )}
        </main>
      </div>
    </article>
  );
}

export function HomeworkReviewWorkspace({
  initialAttemptId,
  onReviewCompleted,
}: {
  initialAttemptId?: string;
  onReviewCompleted?: (scoreOutOf20: number) => void;
}) {
  const [workspace, setWorkspace] = useState<"reviews" | "publication" | "import">("reviews");

  return (
    <div className="homework-admin-workspace">
      <nav className="homework-admin-tabs" aria-label="Gestion des devoirs">
        <button
          type="button"
          className={workspace === "publication" ? "is-active" : ""}
          aria-current={workspace === "publication" ? "page" : undefined}
          onClick={() => setWorkspace("publication")}
        >
          <ShieldCheck size={18} weight="duotone" />
          Publier les devoirs
        </button>
        <button
          type="button"
          className={workspace === "reviews" ? "is-active" : ""}
          aria-current={workspace === "reviews" ? "page" : undefined}
          onClick={() => setWorkspace("reviews")}
        >
          <ClipboardText size={18} weight="duotone" />
          Corriger les copies
        </button>
        <button
          type="button"
          className={workspace === "import" ? "is-active" : ""}
          aria-current={workspace === "import" ? "page" : undefined}
          onClick={() => setWorkspace("import")}
        >
          <UploadSimple size={18} weight="duotone" />
          Importer un devoir
        </button>
      </nav>

      {workspace === "reviews" ? (
        <HomeworkReviewQueue
          initialAttemptId={initialAttemptId}
          onReviewCompleted={onReviewCompleted}
        />
      ) : workspace === "publication" ? (
        <HomeworkPublicationManager />
      ) : (
        <HomeworkPackageImporter />
      )}
    </div>
  );
}
