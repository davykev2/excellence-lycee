import {
  ArrowClockwise,
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Check,
  CheckCircle,
  Clock,
  FileText,
  FloppyDisk,
  Hourglass,
  Medal,
  NotePencil,
  SealCheck,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MarkdownContent } from "../../../components/MarkdownContent";
import type {
  HomeworkAnswerValue,
  HomeworkCorrectionEntry,
  HomeworkDefinition,
  HomeworkExercise,
  HomeworkResult,
} from "../../../domain/homework";
import type { LearnerProfile } from "../../../domain/learning";
import {
  formatHomeworkDuration,
  formatHomeworkTimer,
  homeworkQuestions,
  homeworkScoreMax,
  isHomeworkAnswerComplete,
} from "../../../domain/homework";
import { useAuth } from "../../auth/AuthProvider";
import { CompanionAvatar } from "../../companion/CompanionAvatar";
import "../../../styles/homework.css";
import { useHomeworkAttempt } from "./homeworkApi";
import {
  canRetryHomework,
  homeworkExercisePoints,
  nextHomeworkAttemptDurationSeconds,
  remainingHomeworkSeconds,
  unansweredHomeworkQuestions,
} from "./homeworkModel";
import { HomeworkQuestionCard } from "./HomeworkQuestionCard";

function points(value: number) {
  return new Intl.NumberFormat("fr-CI", { maximumFractionDigits: 2 }).format(value);
}

function dateTime(value?: string) {
  if (!value) return "Date non renseignée";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date non renseignée";
  return new Intl.DateTimeFormat("fr-CI", { dateStyle: "long", timeStyle: "short" }).format(date);
}

function answerText(answer?: HomeworkAnswerValue | null) {
  if (!answer) return "";
  if (typeof answer === "string") return answer;
  return [
    answer.finalAnswer?.trim() ? `**Réponse finale :** ${answer.finalAnswer.trim()}` : "",
    answer.reasoning?.trim() ? `**Raisonnement :**\n${answer.reasoning.trim()}` : "",
  ].filter(Boolean).join("\n\n");
}

function CorrectionEntry({ correction }: { correction: HomeworkCorrectionEntry }) {
  const studentAnswer = answerText(correction.studentAnswer);
  return (
    <article className={`homework-correction-entry${correction.correct === true ? " is-correct" : correction.correct === false ? " is-incorrect" : ""}`}>
      <header>
        <span>{correction.label ?? correction.questionId}</span>
        <strong>{points(correction.pointsAwarded)} / {points(correction.pointsMax)} pt</strong>
      </header>
      {correction.promptMarkdown && (
        <section className="homework-correction-question">
          <strong>Énoncé</strong>
          <MarkdownContent markdown={correction.promptMarkdown} preserveLineBreaks />
          {correction.choices && correction.choices.length > 0 && (
            <ol>
              {correction.choices.map((choice) => (
                <li key={choice.id}>
                  <b>{choice.label}</b>
                  <MarkdownContent markdown={choice.contentMarkdown} preserveLineBreaks />
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
      <div className="homework-correction-columns">
        <section>
          <span>Ta réponse</span>
          {studentAnswer
            ? <MarkdownContent markdown={studentAnswer} preserveLineBreaks />
            : <p>Aucune réponse saisie.</p>}
        </section>
        <section>
          <span>Réponse attendue</span>
          {correction.expectedAnswer
            ? <MarkdownContent
              markdown={Array.isArray(correction.expectedAnswer)
                ? correction.expectedAnswer.map((value) => `- ${value}`).join("\n")
                : correction.expectedAnswer}
              preserveLineBreaks
            />
            : <p>Cette réponse a été évaluée à partir du barème.</p>}
        </section>
      </div>
      {correction.explanationMarkdown && (
        <section className="homework-correction-method">
          <SealCheck size={21} weight="duotone" />
          <div><strong>Correction expliquée</strong><MarkdownContent markdown={correction.explanationMarkdown} preserveLineBreaks /></div>
        </section>
      )}
      {correction.rubricCriteria && correction.rubricCriteria.length > 0 && (
        <ul className="homework-correction-rubric">
          {correction.rubricCriteria.map((criterion) => (
            <li key={criterion.id}>
              <span>{criterion.label}</span>
              <strong>{points(criterion.pointsAwarded)} / {points(criterion.pointsMax)}</strong>
            </li>
          ))}
        </ul>
      )}
      {correction.reviewComment && <blockquote>{correction.reviewComment}</blockquote>}
    </article>
  );
}

function HomeworkResultView({
  result,
  homework,
  learnerName,
  onReload,
  onRetry,
  retrying,
  retryError,
  onBack,
}: {
  result: HomeworkResult;
  homework: HomeworkDefinition;
  learnerName: string;
  onReload: () => void;
  onRetry: () => void;
  retrying: boolean;
  retryError?: string | null;
  onBack: () => void;
}) {
  const pending = result.reviewStatus === "pending" || result.status === "awaiting-review" || result.status === "submitted";
  const scorePublished = result.scoreOutOf20 != null;
  const displayedScore = result.scoreOutOf20 ?? result.provisionalScoreOutOf20;
  const retryAvailable = canRetryHomework(homework);
  const nextDuration = nextHomeworkAttemptDurationSeconds(homework);
  return (
    <main className="homework-exam-page is-result">
      <header className="homework-exam-topbar">
        <button className="path-back-button" type="button" onClick={onBack}><ArrowLeft size={20} weight="bold" />Retour aux devoirs</button>
        <span><FileText size={19} weight="duotone" />Résultat de la copie</span>
      </header>

      <section className={`homework-result-hero${pending ? " is-pending" : " is-graded"}`}>
        <div>
          <p className="path-kicker">{pending ? "Copie bien remise" : scorePublished ? "Résultats publiés" : "Correction terminée"}</p>
          <h1>{pending
            ? `${learnerName}, ta démonstration va être relue.`
            : scorePublished
              ? `${learnerName}, voici ta note finale.`
              : `${learnerName}, ta copie est corrigée.`}</h1>
          <p>{pending
            ? "Les réponses courtes ont été vérifiées. Un correcteur attribuera maintenant les points du raisonnement, critère par critère."
            : scorePublished
              ? result.appreciation?.message ?? "Reprends chaque étape de la correction pour consolider tes méthodes."
              : "Davy affichera ta note et la correction dès que l’administration publiera les résultats."}</p>
          <span>Remise le {dateTime(result.submittedAt)}</span>
        </div>
        <div className="homework-result-score">
          {pending ? <Hourglass size={34} weight="duotone" /> : <Medal size={34} weight="duotone" />}
          {displayedScore == null ? (
            <><strong>—</strong><span>/20</span><small>Note en attente</small></>
          ) : (
            <><strong>{points(displayedScore)}</strong><span>/20</span><small>{pending ? "Note provisoire" : result.appreciation?.label ?? "Note finale"}</small></>
          )}
        </div>
      </section>

      <section className="homework-result-breakdown">
        <article>
          <span>Réponses automatiques</span>
          <strong>{result.autoGradedPoints == null ? "Masqué" : `${points(result.autoGradedPoints)} pt`}</strong>
          <small>{result.autoGradedPoints == null ? "Visible à la publication" : "Déjà vérifiées"}</small>
        </article>
        <article>
          <span>{pending ? "Raisonnement à relire" : "Correction humaine"}</span>
          <strong>{pending ? `${points(result.pendingManualPoints)} pt` : "Terminée"}</strong>
          <small>{pending ? "En attente" : "Intégrée dans la note finale"}</small>
        </article>
        <article><span>Questions traitées</span><strong>{result.answeredCount}/{result.questionCount}</strong><small>Question neutralisée incluse</small></article>
      </section>

      {retryAvailable && (
        <section className="homework-result-retry">
          <div>
            <p className="path-kicker">Nouvel entraînement disponible</p>
            <h2>Tu peux refaire ce devoir sans voir le corrigé.</h2>
            <p>
              Tentative {homework.attemptsUsed + 1}/{homework.maxAttempts} · temps accordé : {formatHomeworkDuration(nextDuration)}.
              Ta copie précédente reste enregistrée séparément.
            </p>
          </div>
          <button className="primary-action" type="button" disabled={retrying} onClick={onRetry}>
            {retrying ? "Préparation…" : "Refaire le devoir"}<ArrowRight size={19} weight="bold" />
          </button>
          {retryError && <p className="homework-inline-error" role="alert">{retryError}</p>}
        </section>
      )}

      {pending ? (
        <section className="homework-result-waiting">
          <CompanionAvatar motion="idle" decorative />
          <div>
            <h2>Pourquoi la note n’est-elle pas encore définitive ?</h2>
            <p>
              Une démonstration ne se résume pas à son dernier résultat. Le correcteur lit les propriétés utilisées,
              les calculs, les justifications et la conclusion avant d’attribuer les points du barème.
            </p>
          </div>
          <button className="secondary-action" type="button" onClick={onReload}><ArrowClockwise size={18} weight="bold" />Vérifier maintenant</button>
        </section>
      ) : !scorePublished || !result.correctionsAvailable ? (
        <section className="homework-result-waiting">
          <ShieldCheck size={35} weight="duotone" />
          <div><h2>Les résultats détaillés restent fermés</h2><p>Davy affichera ta note et toutes les méthodes dès que l’administration publiera les résultats et le corrigé.</p></div>
          <button className="secondary-action" type="button" onClick={onReload}>Actualiser</button>
        </section>
      ) : (
        <section className="homework-correction-list">
          <header><p className="path-kicker">Correction détaillée</p><h2>Ta copie, question par question</h2><p>Compare ton raisonnement au modèle et regarde précisément où chaque point a été attribué.</p></header>
          {result.reviewComment && <blockquote className="homework-overall-review"><strong>Appréciation du correcteur</strong>{result.reviewComment}</blockquote>}
          {result.corrections?.map((correction) => <CorrectionEntry correction={correction} key={correction.questionId} />)}
        </section>
      )}
    </main>
  );
}

function ExerciseNavigation({ exercises }: { exercises: HomeworkExercise[] }) {
  return (
    <nav className="homework-exercise-navigation" aria-label="Accéder à un exercice">
      {exercises.map((exercise) => (
        <button
          type="button"
          key={exercise.id}
          onClick={() => document.getElementById(`homework-${exercise.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
        >
          <span>{exercise.order}</span>
          <strong>{points(homeworkExercisePoints(exercise))} pts</strong>
        </button>
      ))}
    </nav>
  );
}

export function HomeworkExamPage({
  homeworkRef,
  profile,
  localOnly = false,
  onBackLibrary,
}: {
  homeworkRef: string;
  profile: LearnerProfile;
  localOnly?: boolean;
  onBackLibrary: () => void;
}) {
  const { user } = useAuth();
  const exam = useHomeworkAttempt({ homeworkRef, userId: user?.id ?? "preview", localOnly });
  const [confirming, setConfirming] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const synchronizedAt = useRef(Date.now());

  const homework = exam.homework;
  const attempt = exam.attempt;
  const exercises = useMemo(() => homework?.sections
    .slice()
    .sort((left, right) => left.order - right.order)
    .flatMap((section) => section.exercises.slice().sort((left, right) => left.order - right.order)) ?? [], [homework]);
  const questions = useMemo(() => homework ? homeworkQuestions(homework) : [], [homework]);
  const exerciseCount = homework?.exerciseCount ?? exercises.length;
  const missing = useMemo(() => homework && attempt
    ? unansweredHomeworkQuestions(homework, attempt.answers)
    : [], [attempt, homework]);

  useEffect(() => {
    setConfirming(false);
    setRemainingSeconds(null);
    setAutoSubmitted(false);
    synchronizedAt.current = Date.now();
  }, [homeworkRef]);

  useEffect(() => {
    setAutoSubmitted(false);
  }, [attempt?.id]);

  useEffect(() => {
    synchronizedAt.current = Date.now();
    if (!attempt || attempt.status !== "in-progress") {
      setRemainingSeconds(null);
      return;
    }
    const refresh = () => setRemainingSeconds(remainingHomeworkSeconds({
      expiresAt: attempt.expiresAt,
      serverNow: attempt.serverNow,
      synchronizedAtMs: synchronizedAt.current,
      nowMs: Date.now(),
    }));
    refresh();
    const intervalId = window.setInterval(refresh, 1_000);
    return () => window.clearInterval(intervalId);
  }, [attempt?.expiresAt, attempt?.id, attempt?.serverNow, attempt?.status]);

  useEffect(() => {
    if (remainingSeconds !== 0 || !attempt || attempt.status !== "in-progress" || exam.submitting || autoSubmitted) return;
    setAutoSubmitted(true);
    void exam.submit().then(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }, [attempt, autoSubmitted, exam, remainingSeconds]);

  if (exam.result) {
    return (
      <HomeworkResultView
        result={exam.result}
        homework={homework!}
        learnerName={profile.name}
        onReload={() => void exam.reloadResult()}
        onRetry={() => void exam.start().then((nextAttempt) => {
          if (nextAttempt) window.scrollTo({ top: 0, behavior: "smooth" });
        })}
        retrying={exam.starting}
        retryError={exam.error}
        onBack={onBackLibrary}
      />
    );
  }

  if (exam.resultLoading) {
    return (
      <main className="homework-exam-page is-result-loading">
        <header className="homework-exam-topbar">
          <button className="path-back-button" type="button" onClick={onBackLibrary}><ArrowLeft size={20} weight="bold" />Retour aux devoirs</button>
          <span><FileText size={19} weight="duotone" />Résultat de la copie</span>
        </header>
        <div className="homework-loading" role="status"><span />Davy recharge ton résultat…</div>
      </main>
    );
  }

  if (exam.resultError && homework && !attempt) {
    return (
      <main className="homework-exam-page is-result-loading">
        <header className="homework-exam-topbar">
          <button className="path-back-button" type="button" onClick={onBackLibrary}><ArrowLeft size={20} weight="bold" />Retour aux devoirs</button>
          <span><FileText size={19} weight="duotone" />Résultat de la copie</span>
        </header>
        <div className="homework-error" role="alert">
          <WarningCircle size={32} weight="duotone" />
          <div><strong>Ton résultat n’a pas pu être rechargé.</strong><p>{exam.resultError}</p></div>
          <button type="button" onClick={() => void exam.reloadResult()}><ArrowClockwise size={18} weight="bold" />Réessayer</button>
        </div>
      </main>
    );
  }

  if (exam.loading || exam.resuming) {
    return (
      <main className="homework-exam-page">
        <div className="homework-loading" role="status">
          <span />{exam.resuming ? "Davy reprend ta copie et restaure tes réponses…" : "Davy prépare le devoir…"}
        </div>
      </main>
    );
  }

  if (!homework || exam.error && !attempt) {
    return (
      <main className="homework-exam-page">
        <button className="path-back-button" type="button" onClick={onBackLibrary}><ArrowLeft size={20} weight="bold" />Retour aux devoirs</button>
        <div className="homework-error" role="alert">
          <WarningCircle size={32} weight="duotone" />
          <div><strong>Ce devoir ne peut pas être ouvert.</strong><p>{exam.error ?? "Le sujet demandé est introuvable."}</p></div>
          <button type="button" onClick={exam.reload}>Réessayer</button>
        </div>
      </main>
    );
  }

  if (!attempt) {
    return (
      <main className="homework-exam-page is-intro">
        <header className="homework-exam-topbar">
          <button className="path-back-button" type="button" onClick={onBackLibrary}><ArrowLeft size={20} weight="bold" />Retour aux devoirs</button>
          <span><FileText size={19} weight="duotone" />Devoir d’établissement</span>
        </header>
        <section className="homework-start-card">
          <div className="homework-official-heading">
            <div><strong>{homework.institution}</strong><span>Année scolaire {homework.academicYear}</span></div>
            <span>Durée : {formatHomeworkDuration(homework.durationSeconds)}</span>
            <hr />
            <h1>{homework.title}</h1>
            <p>{homework.level.name} {homework.series.name} · {homework.subject.name}</p>
          </div>
          <div className="homework-start-stats">
            <article><Clock size={23} weight="duotone" /><span>Temps officiel</span><strong>{formatHomeworkDuration(homework.durationSeconds)}</strong></article>
            <article><BookOpenText size={23} weight="duotone" /><span>Exercices</span><strong>{exerciseCount}</strong></article>
            <article><Medal size={23} weight="duotone" /><span>Barème</span><strong>/{homeworkScoreMax(homework)}</strong></article>
          </div>
          {homework.sourceNotice && (
            <aside className="homework-source-notice" aria-label="Information sur la source du devoir">
              <BookOpenText size={20} weight="duotone" />
              <p>{homework.sourceNotice}</p>
            </aside>
          )}
          <section className="homework-hybrid-explainer">
            <CompanionAvatar motion="wave" decorative />
            <div>
              <p className="path-kicker">Une correction juste, pas une devinette automatique</p>
              <h2>Ton résultat et ta démonstration seront évalués séparément.</h2>
              <p>
                Les QCM et résultats courts sont vérifiés par le serveur. Pour les démonstrations,
                un correcteur lit ta rédaction et attribue chaque partie du barème. La note reste
                provisoire tant que cette lecture n’est pas terminée.
              </p>
            </div>
          </section>
          {homework.instructionsMarkdown && <div className="homework-start-instructions"><MarkdownContent markdown={homework.instructionsMarkdown} preserveLineBreaks /></div>}
          <div className="homework-start-actions">
            <span>{homework.attemptsUsed}/{homework.maxAttempts} tentative{homework.maxAttempts > 1 ? "s" : ""} utilisée{homework.maxAttempts > 1 ? "s" : ""}</span>
            <button className="primary-action" type="button" disabled={exam.starting} onClick={() => void exam.start()}>
              {exam.starting ? "Ouverture de la copie…" : homework.activeAttemptId ? "Reprendre ma tentative" : "Commencer le devoir"}
              <ArrowRight size={20} weight="bold" />
            </button>
          </div>
          {exam.error && <p className="homework-inline-error" role="alert">{exam.error}</p>}
        </section>
      </main>
    );
  }

  const answeredCount = questions.reduce((count, question) => (
    count + (question.isNeutralized || isHomeworkAnswerComplete(attempt.answers[question.id]) ? 1 : 0)
  ), 0);
  const answerProgress = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <main className="homework-exam-page is-composing">
      <header className="homework-exam-topbar is-live">
        <button className="path-back-button" type="button" onClick={onBackLibrary}><ArrowLeft size={20} weight="bold" />Quitter</button>
        <div className="homework-live-progress" aria-label={`${answeredCount} réponse${answeredCount > 1 ? "s" : ""} traitée${answeredCount > 1 ? "s" : ""} sur ${questions.length}`}>
          <span><i style={{ width: `${answerProgress}%` }} /></span>
          <strong>{answeredCount}/{questions.length}</strong>
        </div>
        <span className={remainingSeconds != null && remainingSeconds <= 600 ? "is-urgent" : ""}>
          <Clock size={19} weight="duotone" />
          {remainingSeconds == null ? "Sans limite" : formatHomeworkTimer(remainingSeconds)}
        </span>
      </header>

      <section className="homework-composer-heading">
        <div>
          <p className="path-kicker">{homework.institution} · {homework.academicYear}</p>
          <h1>{homework.title}</h1>
          <p>{homework.level.name} {homework.series.name} · {homework.subject.name} · tentative {attempt.attemptNumber}/{homework.maxAttempts}</p>
        </div>
        <div className={`homework-save-state${exam.saveError ? " is-error" : ""}`} aria-live="polite">
          {exam.saveError ? <WarningCircle size={18} weight="duotone" /> : <FloppyDisk size={18} weight="duotone" />}
          <span>{exam.saveError ?? (exam.saving ? "Enregistrement…" : "Brouillon enregistré")}</span>
        </div>
      </section>

      {homework.sourceNotice && (
        <aside className="homework-source-notice is-compact" aria-label="Information sur la source du devoir">
          <BookOpenText size={19} weight="duotone" />
          <p>{homework.sourceNotice}</p>
        </aside>
      )}

      <ExerciseNavigation exercises={exercises} />

      <article className="homework-paper">
        {exercises.map((exercise) => (
          <section id={`homework-${exercise.id}`} className="homework-exercise" key={exercise.id}>
            <header>
              <div><span>{exercise.order}</span><div><p>Exercice {exercise.order}</p><h2>{points(homeworkExercisePoints(exercise))} points</h2></div></div>
              <strong>{exercise.questions.length} question{exercise.questions.length > 1 ? "s" : ""}</strong>
            </header>
            {exercise.instructionsMarkdown && (
              <div className="homework-exercise-instructions"><MarkdownContent markdown={exercise.instructionsMarkdown} preserveLineBreaks /></div>
            )}
            <div className="homework-question-list">
              {exercise.questions.map((question) => (
                <HomeworkQuestionCard
                  key={question.id}
                  question={question}
                  answer={attempt.answers[question.id]}
                  disabled={attempt.status !== "in-progress"}
                  onAnswer={(answer) => exam.setAnswer(question.id, answer)}
                />
              ))}
            </div>
          </section>
        ))}

        <footer className="homework-submit-panel">
          <div>
            <strong>{answeredCount}/{questions.length} réponses enregistrées</strong>
            <span>{missing.length === 0 ? "Ta copie est complète." : `${missing.length} réponse${missing.length > 1 ? "s" : ""} manque${missing.length > 1 ? "nt" : ""}. Les questions non traitées vaudront 0.`}</span>
            <small>Question neutralisée : ses points sont accordés automatiquement.</small>
          </div>
          <button className="primary-action" type="button" disabled={exam.submitting} onClick={() => setConfirming(true)}>
            {exam.submitting ? "Remise de la copie…" : "Valider ma copie"}<Check size={19} weight="bold" />
          </button>
          {(exam.error || exam.saveError) && <p className="homework-inline-error" role="alert">{exam.error ?? exam.saveError}</p>}
        </footer>
      </article>

      {confirming && (
        <div className="homework-confirm-layer" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="homework-confirm-title">
            <span><NotePencil size={30} weight="duotone" /></span>
            <h2 id="homework-confirm-title">Remettre définitivement ta copie ?</h2>
            <p>
              {missing.length === 0
                ? "Toutes tes réponses seront enregistrées. Tu ne pourras plus les modifier après la remise."
                : `${missing.length} réponse${missing.length > 1 ? "s sont" : " est"} encore vide${missing.length > 1 ? "s" : ""}. Tu peux compléter la copie ou la remettre maintenant.`}
            </p>
            <div>
              <button
                className="secondary-action"
                type="button"
                disabled={exam.submitting}
                onClick={() => {
                  setConfirming(false);
                  if (missing[0]) document.getElementById(`homework-question-${missing[0].id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              >
                {missing.length > 0 ? "Compléter ma copie" : "Relire encore"}
              </button>
              <button
                className="primary-action is-compact"
                type="button"
                disabled={exam.submitting}
                onClick={() => void exam.submit().then((submitted) => {
                  if (submitted) {
                    setConfirming(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                })}
              >
                {exam.submitting ? "Enregistrement…" : <><ShieldCheck size={19} weight="duotone" />{missing.length > 0 ? "Remettre malgré tout" : "Oui, valider"}</>}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
