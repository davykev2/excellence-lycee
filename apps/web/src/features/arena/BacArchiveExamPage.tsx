import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  ClipboardText,
  FileText,
  Hourglass,
  LockKey,
  MapPin,
  Medal,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react";
import type { BacExamAnswers, BacExamChoiceId } from "../../data/bacCi2024Exam";
import type { BacExamCatalogEntry } from "../../data/bacExamCatalog";
import { bacExamZoneLabel, bacExamZones, type BacExamZone } from "../../domain/bacExam";
import { useAuth } from "../auth/AuthProvider";
import { CompanionAvatar } from "../companion/CompanionAvatar";
import { useBacExam } from "./useBacExam";

function answerKey(questionNumber: number) {
  return `q${String(questionNumber).padStart(2, "0")}`;
}

function answerChoices(exam: BacExamCatalogEntry, questionNumber: number) {
  if (exam.slug === "2017" && questionNumber >= 6 && questionNumber <= 12) {
    return [
      { value: "A" as const, label: "V" },
      { value: "B" as const, label: "F" },
    ];
  }
  return exam.choiceIds.map((choice) => ({ value: choice, label: choice }));
}

function displayedAnswer(exam: BacExamCatalogEntry, questionNumber: number, answer?: string) {
  return answerChoices(exam, questionNumber).find((choice) => choice.value === answer)?.label ?? answer ?? "—";
}

function storageKey(examId: string, userId: string, suffix: "answers" | "zone") {
  return `excellence-bac-archive:${examId}:${userId}:${suffix}`;
}

function readAnswers(examId: string, userId: string): BacExamAnswers {
  try {
    const value = JSON.parse(window.localStorage.getItem(storageKey(examId, userId, "answers")) ?? "{}");
    return value && typeof value === "object" ? value as BacExamAnswers : {};
  } catch {
    return {};
  }
}

function readZone(examId: string, userId: string): BacExamZone | undefined {
  const value = window.localStorage.getItem(storageKey(examId, userId, "zone"));
  return bacExamZones.some((zone) => zone.id === value) ? value as BacExamZone : undefined;
}

export function BacArchiveExamPage({
  exam,
  preview = false,
  onBackLibrary,
}: {
  exam: BacExamCatalogEntry;
  preview?: boolean;
  onBackLibrary: () => void;
}) {
  const { user } = useAuth();
  const userId = user?.id ?? "preview-user";
  const remote = useBacExam({ examId: exam.id, preview });
  const [answers, setAnswers] = useState<BacExamAnswers>(() => readAnswers(exam.id, userId));
  const [candidateZone, setCandidateZone] = useState<BacExamZone | undefined>(() => readZone(exam.id, userId));
  const [activePane, setActivePane] = useState<"subject" | "answers">("subject");
  const [confirming, setConfirming] = useState(false);
  const state = remote.state;
  const submitted = Boolean(state?.submittedAt);
  const accessible = Boolean(state?.subjectPublished || state?.canManageSubject || preview);

  useEffect(() => {
    if (state?.submittedAnswers) setAnswers(state.submittedAnswers);
    if (state?.candidateZone) setCandidateZone(state.candidateZone);
  }, [state?.candidateZone, state?.submittedAnswers]);

  useEffect(() => {
    if (!submitted) window.localStorage.setItem(storageKey(exam.id, userId, "answers"), JSON.stringify(answers));
  }, [answers, exam.id, submitted, userId]);

  useEffect(() => {
    if (candidateZone && !submitted) {
      window.localStorage.setItem(storageKey(exam.id, userId, "zone"), candidateZone);
    }
  }, [candidateZone, exam.id, submitted, userId]);

  const answeredCount = Object.keys(answers).filter((key) => answers[key]).length;
  const missingCount = exam.questionCount - answeredCount;
  const questionsBySection = useMemo(() => exam.sections.map((section) => ({
    ...section,
    questionNumbers: Array.from(
      { length: section.lastQuestion - section.firstQuestion + 1 },
      (_, index) => section.firstQuestion + index,
    ),
  })), [exam.sections]);

  const submitCopy = async () => {
    if (!candidateZone || missingCount > 0) return;
    try {
      await remote.submit(answers, candidateZone);
      setConfirming(false);
    } catch {
      // Le hook expose le message serveur sous la feuille de réponses.
    }
  };

  if (remote.loading) {
    return <main className="bac-archive-feedback" role="status"><span /><p>Préparation du sujet {exam.year}…</p></main>;
  }

  if (!state || remote.error && !state) {
    return (
      <main className="bac-archive-feedback is-error">
        <WarningCircle size={42} weight="duotone" />
        <h1>Le sujet n’a pas pu être chargé.</h1>
        <p>{remote.error}</p>
        <button className="secondary-action" type="button" onClick={() => void remote.reload()}>Réessayer</button>
      </main>
    );
  }

  if (!accessible) {
    return (
      <main className="bac-archive-feedback is-locked">
        <LockKey size={45} weight="duotone" />
        <h1>Le sujet {exam.year} est fermé.</h1>
        <p>Davy l’affichera ici dès que l’administrateur l’aura activé.</p>
        <button className="secondary-action" type="button" onClick={onBackLibrary}><ArrowLeft size={19} weight="bold" />Voir les autres sujets</button>
      </main>
    );
  }

  return (
    <main className="bac-archive-page">
      <header className="bac-archive-topbar">
        <button className="path-back-button" type="button" onClick={onBackLibrary}><ArrowLeft size={20} weight="bold" />Tous les sujets</button>
        <div><strong>{exam.shortTitle}</strong><span>{exam.responseSheetAvailable ? `${answeredCount}/${exam.questionCount} réponses` : `${exam.pageCount} pages à consulter`}</span></div>
        <span className={submitted ? "is-submitted" : ""}>{submitted ? <CheckCircle size={18} weight="fill" /> : <FileText size={18} weight="duotone" />}{submitted ? "Copie envoyée" : exam.responseSheetAvailable ? "Sujet en cours" : "Consultation"}</span>
      </header>

      <section className="bac-archive-hero">
        <div>
          <p className="path-kicker">Annale officielle</p>
          <h1>{exam.title}</h1>
          <p>{exam.description}</p>
          <div><span><strong>{exam.pageCount}</strong> pages</span><span><strong>{exam.questionCount}</strong> questions visibles</span><span><strong>{exam.responseSheetAvailable ? "3 h" : "Libre"}</strong> {exam.responseSheetAvailable ? "indicatives" : "consultation"}</span></div>
        </div>
        <CompanionAvatar motion="idle" decorative />
      </section>

      {!state.subjectPublished && state.canManageSubject && (
        <div className="bac-archive-admin-preview"><LockKey size={20} weight="duotone" /><span><strong>Aperçu administrateur.</strong> Ce sujet est encore fermé pour les élèves.</span></div>
      )}

      {exam.responseSheetAvailable && (
        <nav className="bac-archive-mobile-tabs" aria-label="Partie du sujet affichée">
          <button type="button" className={activePane === "subject" ? "is-active" : ""} onClick={() => setActivePane("subject")}><FileText size={19} weight="duotone" />Sujet</button>
          <button type="button" className={activePane === "answers" ? "is-active" : ""} onClick={() => setActivePane("answers")}><ClipboardText size={19} weight="duotone" />Réponses <span>{answeredCount}</span></button>
        </nav>
      )}

      <div className={`bac-archive-workspace ${exam.responseSheetAvailable ? "" : "is-readonly"}`} data-mobile-pane={activePane}>
        <section className="bac-archive-document" aria-label={`Pages du sujet ${exam.year}`}>
          <header><FileText size={22} weight="duotone" /><div><strong>Sujet original</strong><span>Fais défiler les {exam.pageCount} pages sans quitter l’épreuve.</span></div></header>
          <div>
            {exam.pageUrls.map((url, index) => (
              <figure key={url}>
                <img src={url} alt={`Sujet ${exam.year}, page ${index + 1} sur ${exam.pageCount}`} loading={index < 2 ? "eager" : "lazy"} />
                <figcaption>Page {index + 1} / {exam.pageCount}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {exam.responseSheetAvailable && <aside className="bac-archive-answer-sheet" aria-label="Feuille de réponses">
          <header>
            <span><ClipboardText size={25} weight="duotone" /></span>
            <div><strong>Ta feuille de réponses</strong><p>Reporte ici la lettre cochée dans le sujet.</p></div>
            <b>{answeredCount}/{exam.questionCount}</b>
          </header>

          <section className="bac-archive-zone" aria-labelledby="bac-archive-zone-title">
            <div><MapPin size={21} weight="fill" /><span><strong id="bac-archive-zone-title">Ta zone</strong><small>Obligatoire avant l’envoi</small></span></div>
            <div>
              {bacExamZones.map((zone) => (
                <button key={zone.id} type="button" disabled={submitted} className={candidateZone === zone.id ? "is-selected" : ""} onClick={() => setCandidateZone(zone.id)}>{zone.label}</button>
              ))}
            </div>
          </section>

          {questionsBySection.map((section) => (
            <section className="bac-archive-answer-section" key={section.label}>
              <header><div><strong>{section.label}</strong><span>{section.questionNumbers.length} réponse{section.questionNumbers.length > 1 ? "s" : ""}</span></div><small>{section.questionLabels ? "Repères du sujet" : `Questions 1 à ${section.questionNumbers.length}`}</small></header>
              <div>
                {section.questionNumbers.map((questionNumber, questionIndex) => {
                  const key = answerKey(questionNumber);
                  const displayNumber = section.questionLabels?.[questionIndex]
                    ?? String(questionNumber - section.firstQuestion + 1);
                  return (
                    <div className="bac-archive-answer-row" key={key} data-custom-label={section.questionLabels ? "true" : undefined}>
                      <strong>{displayNumber}</strong>
                      <div>
                        {answerChoices(exam, questionNumber).map((choice) => (
                          <button
                            key={choice.value}
                            type="button"
                            disabled={submitted}
                            className={answers[key] === choice.value ? "is-selected" : ""}
                            aria-label={`${section.label}, question ${displayNumber}, réponse ${choice.label}`}
                            onClick={() => setAnswers((current) => ({ ...current, [key]: choice.value as BacExamChoiceId }))}
                          >{choice.label}</button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          <footer className="bac-archive-submit">
            {submitted ? (
              <div className="bac-archive-submitted"><CheckCircle size={28} weight="fill" /><p><strong>Copie envoyée.</strong><span>Attends que Davy active les résultats et la correction.</span><small>Zone : {bacExamZoneLabel(state.candidateZone ?? candidateZone)}</small></p></div>
            ) : (
              <>
                <div><strong>{missingCount === 0 ? "Ta copie est complète" : `${missingCount} réponse${missingCount > 1 ? "s" : ""} restante${missingCount > 1 ? "s" : ""}`}</strong><span>{candidateZone ? bacExamZoneLabel(candidateZone) : "Choisis aussi ta zone."}</span></div>
                <button className="primary-action is-compact" type="button" disabled={remote.submitting || missingCount > 0 || !candidateZone} onClick={() => setConfirming(true)}><Check size={19} weight="bold" />Valider ma copie</button>
              </>
            )}
            {remote.error && <p className="bac-exam-inline-error" role="alert">{remote.error}</p>}
          </footer>

          {state.result && (
            <>
              <section className="bac-archive-result">
                <Medal size={32} weight="duotone" />
                <div><strong>{state.result.correctAnswers}/{state.result.scoreMax}</strong><span>{state.result.appreciation.label}</span><p>{state.result.appreciation.message}</p></div>
              </section>
              <section className="bac-archive-correction" aria-labelledby="bac-archive-correction-title">
                <header>
                  <div><strong id="bac-archive-correction-title">Correction de ta copie</strong><span>Compare chaque réponse avec le corrigé officiel.</span></div>
                </header>
                {questionsBySection.map((section, sectionIndex) => {
                  const sectionScore = sectionIndex === 0
                    ? state.result!.sectionScores.english
                    : sectionIndex === 1
                      ? state.result!.sectionScores.generalKnowledge
                      : state.result!.sectionScores.scientificKnowledge;
                  return (
                    <details key={section.label} open={sectionIndex === 0}>
                      <summary><span>{section.label}</span><strong>{sectionScore.correctAnswers}/{sectionScore.scoreMax}</strong></summary>
                      <div>
                        {section.questionNumbers.map((questionNumber, questionIndex) => {
                          const key = answerKey(questionNumber);
                          const correction = state.result!.corrections[key];
                          const learnerAnswer = state.submittedAnswers?.[key] ?? answers[key];
                          const isCorrect = learnerAnswer === correction?.answer;
                          const displayNumber = section.questionLabels?.[questionIndex]
                            ?? String(questionNumber - section.firstQuestion + 1);
                          return (
                            <article key={key} className={isCorrect ? "is-correct" : "is-incorrect"}>
                              {isCorrect
                                ? <CheckCircle size={20} weight="fill" />
                                : <XCircle size={20} weight="fill" />}
                              <div>
                                <strong>Question {displayNumber}</strong>
                                <span>Ta réponse : <b>{displayedAnswer(exam, questionNumber, learnerAnswer)}</b> · Bonne réponse : <b>{displayedAnswer(exam, questionNumber, correction?.answer)}</b></span>
                                {correction?.explanation && <p>{correction.explanation}</p>}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </details>
                  );
                })}
              </section>
            </>
          )}
        </aside>}
      </div>

      {confirming && (
        <div className="overlay bac-exam-confirm-overlay" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="bac-archive-confirm-title">
            <span><Hourglass size={30} weight="duotone" /></span>
            <h2 id="bac-archive-confirm-title">Envoyer définitivement ta copie {exam.year} ?</h2>
            <p>Tes {exam.questionCount} réponses seront enregistrées et tu ne pourras plus les modifier.</p>
            <p className="bac-exam-confirm-zone"><MapPin size={18} weight="fill" />Zone : <strong>{bacExamZoneLabel(candidateZone)}</strong></p>
            <div>
              <button className="secondary-action" type="button" disabled={remote.submitting} onClick={() => setConfirming(false)}>Relire encore</button>
              <button className="primary-action is-compact" type="button" disabled={remote.submitting} onClick={() => void submitCopy()}>{remote.submitting ? "Enregistrement…" : <><Check size={19} weight="bold" />Oui, valider</>}</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
