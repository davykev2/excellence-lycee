import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Clock,
  FileText,
  Hourglass,
  LockKey,
  Medal,
  SealCheck,
  WarningCircle,
} from "@phosphor-icons/react";
import { MathText } from "../../components/MathText";
import { MarkdownContent } from "../../components/MarkdownContent";
import {
  bacCi2024Exam,
  bacCi2024Questions,
  bacExamQuestionKey,
  type BacExamAnswers,
  type BacExamChoiceId,
  type BacExamQuestion,
} from "../../data/bacCi2024Exam";
import type { LearnerProfile } from "../../domain/learning";
import type { BacExamCorrectionEntry } from "../../domain/bacExam";
import { useAuth } from "../auth/AuthProvider";
import { CompanionAvatar } from "../companion/CompanionAvatar";
import { useBacExam } from "./useBacExam";

interface BacCi2024ExamPageProps {
  profile: LearnerProfile;
  resultsOpen: boolean;
  localOnly?: boolean;
  onBackArena: () => void;
  onOpenResults: () => void;
  onBackExam: () => void;
}

function choiceId(index: number): BacExamChoiceId {
  return String.fromCharCode(65 + index) as BacExamChoiceId;
}

function formatSubmissionDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

function draftStorageKey(userId: string) {
  return `excellence-bac-ci-2024-draft:${userId}`;
}

function readDraft(userId: string): BacExamAnswers {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(draftStorageKey(userId)) ?? "{}") as BacExamAnswers;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function QuestionClues({ question }: { question: BacExamQuestion }) {
  if (!question.clueRows) return null;
  return (
    <div className="bac-exam-clues" aria-label={`Données de la question ${question.id}`}>
      {question.clueRows.map((row, index) => (
        <div key={`${row.value}-${index}`}>
          <code>{row.value}</code>
          {row.clue && <strong>{row.clue}</strong>}
        </div>
      ))}
      <span>↓ réponse</span>
    </div>
  );
}

function QuestionCard({
  question,
  answer,
  readOnly,
  correction,
  onAnswer,
}: {
  question: BacExamQuestion;
  answer?: BacExamChoiceId;
  readOnly: boolean;
  correction?: BacExamCorrectionEntry;
  onAnswer: (answer: BacExamChoiceId) => void;
}) {
  return (
    <fieldset
      id={`bac-question-${question.id}`}
      className={`bac-exam-question ${correction ? (answer === correction.answer ? "is-correct" : "is-incorrect") : ""}`}
    >
      <legend>
        <span>Q{String(question.id).padStart(2, "0")}</span>
        <MathText>{question.prompt}</MathText>
      </legend>
      <QuestionClues question={question} />
      <div className="bac-exam-choices">
        {question.choices.map((choice, index) => {
          const id = choiceId(index);
          const selected = answer === id;
          const expected = correction?.answer === id;
          return (
            <label
              className={`${selected ? "is-selected" : ""} ${expected ? "is-expected" : ""}`}
              key={id}
            >
              <input
                type="radio"
                name={bacExamQuestionKey(question.id)}
                value={id}
                checked={selected}
                disabled={readOnly}
                onChange={() => onAnswer(id)}
              />
              <span>{id}</span>
              <strong><MathText>{choice}</MathText></strong>
              {expected && <CheckCircle size={20} weight="fill" aria-label="Bonne réponse" />}
            </label>
          );
        })}
      </div>
      {correction && (
        <div className="bac-exam-correction">
          <SealCheck size={22} weight="duotone" />
          <div>
            <strong>Bonne réponse : {correction.answer}</strong>
            <MarkdownContent
              markdown={correction.explanation || "La correction détaillée sera complétée par l’équipe pédagogique."}
              preserveLineBreaks
            />
            {correction.warning && (
              <p className="bac-exam-correction-warning">
                <WarningCircle size={18} weight="fill" />
                <span>{correction.warning}</span>
              </p>
            )}
            {correction.sourceUrl && (
              <a href={correction.sourceUrl} target="_blank" rel="noreferrer">
                {correction.sourceLabel || "Consulter la source de vérification"}
                <ArrowRight size={15} weight="bold" />
              </a>
            )}
          </div>
        </div>
      )}
    </fieldset>
  );
}

export function BacCi2024ExamPage({
  profile,
  resultsOpen,
  localOnly = false,
  onBackArena,
  onOpenResults,
  onBackExam,
}: BacCi2024ExamPageProps) {
  const { user } = useAuth();
  const exam = useBacExam({ preview: localOnly });
  const storageUserId = user?.id ?? "preview";
  const [answers, setAnswers] = useState<BacExamAnswers>(() => readDraft(storageUserId));
  const [confirming, setConfirming] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const state = exam.state;

  useEffect(() => {
    if (state?.submittedAnswers) {
      setAnswers(state.submittedAnswers);
      window.localStorage.removeItem(draftStorageKey(storageUserId));
    }
  }, [state?.submittedAnswers, storageUserId]);

  useEffect(() => {
    if (!state?.submittedAt) {
      window.localStorage.setItem(draftStorageKey(storageUserId), JSON.stringify(answers));
    }
  }, [answers, state?.submittedAt, storageUserId]);

  const answeredCount = Object.keys(answers).filter((key) => answers[key]).length;
  const missingQuestions = useMemo(
    () => bacCi2024Questions.filter((question) => !answers[bacExamQuestionKey(question.id)]),
    [answers],
  );
  const submitted = Boolean(state?.submittedAt);
  const readOnly = submitted || resultsOpen;

  const answerQuestion = (question: BacExamQuestion, choice: BacExamChoiceId) => {
    if (readOnly) return;
    setAnswers((current) => ({ ...current, [bacExamQuestionKey(question.id)]: choice }));
  };

  const submitCopy = async () => {
    if (missingQuestions.length > 0) {
      document.getElementById(`bac-question-${missingQuestions[0].id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    await exam.submit(answers);
    setSubmitSuccess(true);
    setConfirming(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (exam.loading) {
    return <main className="bac-exam-page"><div className="bac-exam-loading" role="status"><span />Davy prépare le sujet officiel…</div></main>;
  }

  if (exam.error && !state) {
    return (
      <main className="bac-exam-page">
        <button className="path-back-button" type="button" onClick={onBackArena}><ArrowLeft size={20} weight="bold" />Retour à l’Arène</button>
        <div className="bac-exam-error" role="alert">
          <WarningCircle size={30} weight="duotone" />
          <div><strong>Le sujet n’a pas pu être chargé.</strong><p>{exam.error}</p></div>
          <button type="button" onClick={() => void exam.reload()}>Réessayer</button>
        </div>
      </main>
    );
  }

  if (state?.subjectPublished === false && !state.canManageSubject && !submitted) {
    return (
      <main className="bac-exam-page">
        <button className="path-back-button" type="button" onClick={onBackArena}>
          <ArrowLeft size={20} weight="bold" />Retour à l’Arène
        </button>
        <section className="bac-result-lock">
          <CompanionAvatar motion="idle" className="bac-result-davy" decorative />
          <span className="bac-result-lock-icon"><LockKey size={27} weight="duotone" /></span>
          <h1>Le sujet est actuellement fermé</h1>
          <p>Davy te préviendra dès que l’administrateur ouvrira cette épreuve aux candidats.</p>
          <button className="secondary-action" type="button" onClick={() => void exam.reload()}>
            Vérifier maintenant
          </button>
        </section>
      </main>
    );
  }

  if (resultsOpen) {
    const corrections = state?.result?.corrections ?? {};
    return (
      <main className="bac-exam-page is-results">
        <header className="bac-exam-topbar">
          <button className="path-back-button" type="button" onClick={onBackExam}><ArrowLeft size={20} weight="bold" />Retour au sujet</button>
          <span><FileText size={19} weight="duotone" />Correction officielle</span>
        </header>

        {!submitted ? (
          <section className="bac-result-lock">
            <LockKey size={54} weight="duotone" />
            <h1>Valide d’abord ta copie</h1>
            <p>La page de résultat est réservée aux candidats ayant envoyé leurs 69 réponses.</p>
            <button className="primary-action is-compact" type="button" onClick={onBackExam}>Revenir au sujet</button>
          </section>
        ) : !state?.resultsPublished || !state.result ? (
          <section className="bac-result-lock">
            <CompanionAvatar motion="idle" className="bac-result-davy" decorative />
            <span className="bac-result-lock-icon"><LockKey size={27} weight="duotone" /></span>
            <h1>Les résultats ne sont pas encore activés</h1>
            <p>Attends que Davy active les résultats pour voir ta note et la correction.</p>
            <small>Copie validée le {formatSubmissionDate(state?.submittedAt ?? "")}</small>
            <button className="secondary-action" type="button" onClick={() => void exam.reload()}>Vérifier maintenant</button>
          </section>
        ) : (
          <>
            <section className="bac-result-hero">
              <div>
                <p className="path-kicker">Résultat officiel</p>
                <h1>{profile.name}, voici ta note</h1>
                <p>Chaque bonne réponse vaut un point. Consulte ensuite le corrigé détaillé question par question.</p>
              </div>
              <div className="bac-result-score">
                <Medal size={31} weight="duotone" />
                <strong>{state.result.correctAnswers}</strong>
                <span>/{state.result.scoreMax}</span>
                <small>1 point par bonne réponse</small>
                <div className="bac-result-appreciation">
                  <strong>{state.result.appreciation.label}</strong>
                  <p>{state.result.appreciation.message}</p>
                </div>
              </div>
            </section>
            <div className="bac-exam-paper is-correction">
              {bacCi2024Exam.sections.map((section) => (
                <section className="bac-exam-section" key={section.id}>
                  <header><p>{section.eyebrow}</p><h2>{section.title}</h2></header>
                  {section.groups.map((group, groupIndex) => (
                    <div className="bac-exam-group" key={`${section.id}-${groupIndex}`}>
                      {group.questions.map((question) => (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          answer={answers[bacExamQuestionKey(question.id)]}
                          readOnly
                          correction={corrections[bacExamQuestionKey(question.id)]}
                          onAnswer={() => undefined}
                        />
                      ))}
                    </div>
                  ))}
                </section>
              ))}
            </div>
          </>
        )}
      </main>
    );
  }

  return (
    <main className="bac-exam-page">
      <header className="bac-exam-topbar">
        <button className="path-back-button" type="button" onClick={onBackArena}><ArrowLeft size={20} weight="bold" />Retour à l’Arène</button>
        <div className="bac-exam-live-progress" aria-label={`${answeredCount} réponses sur 69`}>
          <span><i style={{ width: `${(answeredCount / 69) * 100}%` }} /></span>
          <strong>{answeredCount}/69</strong>
        </div>
        <span><Clock size={19} weight="duotone" />3 h 00</span>
      </header>

      {(submitted || submitSuccess) && (
        <section className={`bac-submission-banner ${state?.resultsPublished ? "is-published" : ""}`} role="status">
          <CompanionAvatar motion={state?.resultsPublished ? "celebrate" : "wave"} className="bac-submission-davy" decorative />
          <div>
            <p className="path-kicker">{state?.resultsPublished ? "Résultats disponibles" : "Copie bien enregistrée"}</p>
            <h2>{state?.resultsPublished ? "Davy a activé les résultats." : "Attends que Davy active les résultats pour voir ta note et la correction."}</h2>
            {state?.submittedAt && <span>Validée le {formatSubmissionDate(state.submittedAt)}</span>}
          </div>
          {state?.resultsPublished
            ? <button className="primary-action is-compact" type="button" onClick={onOpenResults}>Voir ma note et la correction <ArrowRight size={19} weight="bold" /></button>
            : <button className="secondary-action" type="button" onClick={() => void exam.reload()}>Actualiser</button>}
        </section>
      )}

      <article className="bac-exam-paper">
        <header className="bac-exam-official-header">
          <div>
            <strong>{bacCi2024Exam.institution}</strong>
            <span>{bacCi2024Exam.direction}</span>
          </div>
          <div>
            <strong>{bacCi2024Exam.country}</strong>
            <span>{bacCi2024Exam.motto}</span>
          </div>
          <hr />
          <p>{bacCi2024Exam.title} <b>{bacCi2024Exam.session}</b></p>
          <h1>Composition : {bacCi2024Exam.composition}</h1>
          <div className="bac-exam-official-meta">
            <span><Clock size={19} weight="duotone" />Durée : 3H00mn</span>
            <span><FileText size={19} weight="duotone" />69 questions</span>
            <span>{bacCi2024Exam.originalDate}</span>
          </div>
        </header>

        <section className="bac-exam-instructions">
          <SealCheck size={27} weight="duotone" />
          <div>
            <strong>Consignes pour les candidats</strong>
            <ul>{bacCi2024Exam.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ul>
          </div>
        </section>

        {bacCi2024Exam.sections.map((section) => (
          <section className={`bac-exam-section ${section.continuation ? "is-continuation" : ""}`} key={section.id}>
            <header>
              <p>{section.eyebrow}</p>
              <h2>{section.title}</h2>
            </header>
            {section.groups.map((group, groupIndex) => (
              <div className="bac-exam-group" key={`${section.id}-${groupIndex}`}>
                {(group.title || group.instructions) && (
                  <div className="bac-exam-group-heading">
                    {group.title && <h3>{group.title}</h3>}
                    {group.instructions && <p>{group.instructions}</p>}
                  </div>
                )}
                {group.passage && (
                  <article className="bac-exam-passage">
                    {group.passageTitle && <strong>{group.passageTitle}</strong>}
                    {group.passage.split("\n\n").map((paragraph) => <p key={paragraph.slice(0, 36)}>{paragraph}</p>)}
                  </article>
                )}
                {group.questions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    answer={answers[bacExamQuestionKey(question.id)]}
                    readOnly={readOnly}
                    onAnswer={(choice) => answerQuestion(question, choice)}
                  />
                ))}
              </div>
            ))}
          </section>
        ))}

        <footer className="bac-exam-submit-panel">
          {submitted ? (
            <>
              <CheckCircle size={35} weight="fill" />
              <div>
                <strong>Ta copie a été validée.</strong>
                <p>Tu ne peux plus modifier tes réponses. Davy te préviendra dès que la correction sera activée.</p>
              </div>
            </>
          ) : (
            <>
              <div className="bac-exam-submit-summary">
                <strong>{answeredCount} réponse{answeredCount > 1 ? "s" : ""} sur 69</strong>
                <span>{missingQuestions.length === 0 ? "Ta copie est prête à être envoyée." : `Il reste ${missingQuestions.length} question${missingQuestions.length > 1 ? "s" : ""}.`}</span>
              </div>
              <button
                className="primary-action"
                type="button"
                disabled={exam.submitting}
                onClick={() => missingQuestions.length > 0
                  ? document.getElementById(`bac-question-${missingQuestions[0].id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
                  : setConfirming(true)}
              >
                {missingQuestions.length > 0 ? `Aller à la question ${missingQuestions[0].id}` : exam.submitting ? "Enregistrement…" : "Valider ma copie"}
                <ArrowRight size={20} weight="bold" />
              </button>
            </>
          )}
          {exam.error && <p className="bac-exam-inline-error" role="alert">{exam.error}</p>}
        </footer>
      </article>

      {!submitted && (
        <aside className="bac-exam-floating-progress">
          <span><i style={{ height: `${(answeredCount / 69) * 100}%` }} /></span>
          <strong>{answeredCount}</strong>
          <small>sur 69</small>
        </aside>
      )}

      {confirming && (
        <div className="overlay bac-exam-confirm-overlay" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="bac-confirm-title">
            <span><Hourglass size={30} weight="duotone" /></span>
            <h2 id="bac-confirm-title">Valider définitivement ta copie ?</h2>
            <p>Tes 69 réponses seront enregistrées et tu ne pourras plus les modifier.</p>
            <div>
              <button className="secondary-action" type="button" disabled={exam.submitting} onClick={() => setConfirming(false)}>Relire encore</button>
              <button className="primary-action is-compact" type="button" disabled={exam.submitting} onClick={() => void submitCopy()}>
                {exam.submitting ? "Enregistrement…" : <><Check size={19} weight="bold" />Oui, valider</>}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
