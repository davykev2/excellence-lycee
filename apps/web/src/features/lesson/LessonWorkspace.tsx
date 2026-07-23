import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowClockwise,
  BookOpenText,
  CheckCircle,
  Lightbulb,
  ListNumbers,
  Medal,
  SlidersHorizontal,
  Sparkle,
  Trophy,
  X,
  XCircle,
} from "@phosphor-icons/react";
import type { FunctionRule, LearningLesson, LearningPath, LessonQuestion } from "../../domain/paths";
import type { AttemptResult, ProgressLesson } from "../progress/useLearningProgress";
import { CompanionAvatar } from "../companion/CompanionAvatar";
import { MathFormula, MathText } from "../../components/MathText";
import { MarkdownContent } from "../../components/MarkdownContent";
import { ApiError } from "../../lib/api";
import { formatXp } from "../../data/xpRewards";
import type { AuthUser } from "../../domain/auth";
import { LessonFeedbackPanel } from "./LessonFeedbackPanel";

interface LessonWorkspaceProps {
  lesson: LearningLesson;
  path: LearningPath;
  nextLesson?: LearningLesson;
  currentProgress?: ProgressLesson;
  currentUser: Pick<AuthUser, "id" | "name" | "photoUrl" | "role">;
  localOnly?: boolean;
  onClose: () => void;
  onSubmitAttempt: (lessonId: string, scoreOutOf20: number) => Promise<AttemptResult>;
  onOpenNext: (lessonId: string) => void;
}

type Phase = "learn" | "quiz" | "result";
type LessonAnswer = number | string | null;
const mathInputSymbols = ["+∞", "−∞", "∞", "≤", "≥", "∈", "ℝ", "√", "π", "∅"];

function normalizeAnswer(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[−–—]/g, "-")
    .replace(/∞/g, "infini")
    .replace(/\+inf(?:inity|ini)?/g, "+infini")
    .replace(/-inf(?:inity|ini)?/g, "-infini")
    .replace(/\s+/g, "")
    .replace(/[{}$]/g, "");
}

function isQuestionCorrect(question: LessonQuestion, answer: LessonAnswer) {
  if (question.type !== "short-answer") return typeof answer === "number" && answer === question.correctIndex;
  if (typeof answer !== "string" || !answer.trim()) return false;
  const normalized = normalizeAnswer(answer);
  return (question.acceptedAnswers ?? []).some((accepted) => normalizeAnswer(accepted) === normalized);
}

function answerLabel(question: LessonQuestion, answer: LessonAnswer) {
  if (answer === null) return "Aucune réponse";
  if (question.type === "short-answer") return String(answer);
  return typeof answer === "number" ? question.options[answer] ?? "Aucune réponse" : "Aucune réponse";
}

function correctAnswerLabel(question: LessonQuestion) {
  if (question.type === "short-answer") return question.acceptedAnswers?.[0] ?? "Voir la correction";
  return question.options[question.correctIndex] ?? "Voir la correction";
}

function evaluateRule(rule: FunctionRule, input: number) {
  if (rule.kind === "linear") return rule.coefficient * input + rule.constant;
  if (rule.kind === "quadratic") return rule.coefficient * input * input + rule.constant;
  const denominator = input - rule.shift;
  return Math.abs(denominator) < 0.00001 ? null : 1 / denominator;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(value);
}

function initialInteractionValue(lesson: LearningLesson) {
  return lesson.interaction.kind === "timeline" ? 0 : lesson.interaction.input.initial;
}

function synchronizationErrorMessage(reason: unknown) {
  if (reason instanceof ApiError) {
    if (reason.code === "LESSON_NOT_FOUND") {
      return "Ce niveau n’est pas encore activé dans le catalogue XP. La réponse est conservée à l’écran, mais le serveur doit être mis à jour avant la synchronisation.";
    }
    if (reason.status === 401) return "Ta session a expiré. Reconnecte-toi, puis réessaie de synchroniser tes XP.";
    return reason.message;
  }
  if (reason instanceof TypeError) {
    return "Le serveur de progression est momentanément injoignable. Tes réponses restent affichées : réessaie la synchronisation sans refaire le cours.";
  }
  return "La progression n’a pas pu être enregistrée. Réessaie la synchronisation dans quelques instants.";
}

export function LessonWorkspace({
  lesson,
  path,
  nextLesson,
  currentProgress,
  currentUser,
  localOnly = false,
  onClose,
  onSubmitAttempt,
  onOpenNext,
}: LessonWorkspaceProps) {
  const questions = lesson.questions?.length ? lesson.questions : [lesson.question];
  const [phase, setPhase] = useState<Phase>("learn");
  const [answers, setAnswers] = useState<LessonAnswer[]>(() => questions.map(() => null));
  const [inputValue, setInputValue] = useState(() => initialInteractionValue(lesson));
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [resultSynced, setResultSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setPhase("learn");
    setAnswers(questions.map(() => null));
    setInputValue(initialInteractionValue(lesson));
    setResult(null);
    setScore(0);
    setResultSynced(false);
    setError(null);
  }, [lesson.id]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [phase]);

  const outputValue = useMemo(
    () => lesson.interaction.kind === "timeline" ? null : evaluateRule(lesson.interaction.rule, inputValue),
    [inputValue, lesson.interaction],
  );
  const timelineItem = lesson.interaction.kind === "timeline"
    ? lesson.interaction.items[Math.min(Math.round(inputValue), lesson.interaction.items.length - 1)]
    : null;
  const answeredCount = answers.filter((answer) => answer !== null && (typeof answer !== "string" || Boolean(answer.trim()))).length;
  const allAnswered = answers.every((answer) => answer !== null && (typeof answer !== "string" || Boolean(answer.trim())));

  const synchronizeAttempt = async (scoreOutOf20: number) => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const attempt = await onSubmitAttempt(lesson.id, scoreOutOf20);
      setResult(attempt);
      setResultSynced(true);
    } catch (reason) {
      setResultSynced(false);
      setError(synchronizationErrorMessage(reason));
    } finally {
      setSubmitting(false);
    }
  };

  const submitQuiz = async () => {
    if (!allAnswered || submitting) return;
    const totalPoints = questions.reduce((sum, question) => sum + (question.points ?? 1), 0);
    const earnedPoints = questions.reduce((sum, question, index) => sum + (isQuestionCorrect(question, answers[index]) ? question.points ?? 1 : 0), 0);
    const scoreOutOf20 = Math.round((earnedPoints / totalPoints) * 20);
    setScore(scoreOutOf20);
    setResult({
      passed: scoreOutOf20 >= 10,
      improved: false,
      xpDelta: 0,
      xpAwarded: currentProgress?.xpAwarded ?? 0,
      bestScore: Math.max(currentProgress?.bestScore ?? 0, scoreOutOf20),
      attemptCount: (currentProgress?.attemptCount ?? 0) + 1,
    });
    setResultSynced(false);
    setPhase("result");
    await synchronizeAttempt(scoreOutOf20);
  };

  const insertAnswerSymbol = (questionIndex: number, symbol: string) => {
    setAnswers((current) => current.map((answer, index) => {
      if (index !== questionIndex) return answer;
      const currentValue = typeof answer === "string" ? answer : "";
      return `${currentValue}${symbol}`;
    }));
  };

  const retry = () => {
    setAnswers(questions.map(() => null));
    setResult(null);
    setScore(0);
    setResultSynced(false);
    setError(null);
    setPhase("quiz");
  };

  return (
    <div className="lesson-player lesson-player--mastery" role="dialog" aria-modal="true" aria-labelledby="lesson-player-title">
      <header className="lesson-player-header">
        <button className="lesson-player-close" type="button" onClick={onClose} aria-label="Quitter le niveau"><X size={22} weight="bold" /><span>Quitter</span></button>
        <div className="lesson-player-progress" aria-label={`Phase ${phase}`}>
          <div className="lesson-player-progress-bars" aria-hidden="true"><span className="is-done" /><span className={phase !== "learn" ? "is-done" : ""} /><span className={phase === "result" ? "is-done" : ""} /></div>
          <strong>{phase === "learn" ? "Apprendre" : phase === "quiz" ? "S’entraîner" : "Résultat"}</strong>
        </div>
        <div className="lesson-player-xp"><Medal size={20} weight="duotone" /><strong>{formatXp(currentProgress?.xpAwarded ?? 0)}/{formatXp(lesson.xp)} XP</strong></div>
      </header>

      <main key={phase} ref={mainRef} className="lesson-player-main mastery-lesson-main">
        {phase === "learn" && (
          <article className="mastery-course" aria-labelledby="lesson-player-title">
            <header className="mastery-course-heading">
              <p className="path-kicker">{lesson.concept.eyebrow}</p>
              <h1 id="lesson-player-title">{lesson.title}</h1>
              <p>{lesson.summary}</p>
            </header>

            <section className="mastery-course-card is-concept">
              <div><span className="mastery-course-icon"><BookOpenText size={25} weight="duotone" /></span><p className="path-kicker">Comprendre</p><h2>{lesson.concept.title}</h2></div>
              {lesson.concept.bodyMarkdown
                ? <MarkdownContent markdown={lesson.concept.bodyMarkdown} />
                : <p><MathText>{lesson.concept.explanation}</MathText></p>}
              <div className="lesson-notation">
                <span>À retenir</span>
                <strong>{lesson.concept.notationTex
                  ? <MathFormula tex={lesson.concept.notationTex} block fallback={lesson.concept.notation} />
                  : <MathText>{lesson.concept.notation}</MathText>}
                </strong>
              </div>
              <div className="lesson-example"><Lightbulb size={24} weight="duotone" /><div><strong>Exemple</strong><p><MathText>{lesson.concept.example}</MathText></p></div></div>
            </section>

            <section className="mastery-course-card is-lab">
              <div><span className="mastery-course-icon"><SlidersHorizontal size={25} weight="duotone" /></span><p className="path-kicker">Manipuler</p><h2>{lesson.interaction.title}</h2></div>
              <p><MathText>{lesson.interaction.instruction}</MathText></p>
              {lesson.interaction.kind === "timeline" && timelineItem ? (
                <div className="mastery-timeline-lab">
                  <div className="mastery-timeline-focus" aria-live="polite"><strong>{timelineItem.label}</strong><span>{timelineItem.detail}</span></div>
                  <label htmlFor={`mastery-timeline-${lesson.id}`}>Repère {Math.round(inputValue) + 1} sur {lesson.interaction.items.length}</label>
                  <input id={`mastery-timeline-${lesson.id}`} className="lesson-slider" type="range" min={0} max={lesson.interaction.items.length - 1} step={1} value={inputValue} onInput={(event) => setInputValue(Number(event.currentTarget.value))} />
                  <div className="mastery-timeline-markers">{lesson.interaction.items.map((item, index) => <button aria-pressed={index === Math.round(inputValue)} className={index === Math.round(inputValue) ? "is-active" : ""} key={`${item.label}-${index}`} onClick={() => setInputValue(index)} type="button">{item.shortLabel ?? item.label}</button>)}</div>
                </div>
              ) : lesson.interaction.kind !== "timeline" ? (
                <div className="mastery-mini-lab">
                  <strong>{lesson.interaction.formulaTex
                    ? <MathFormula tex={lesson.interaction.formulaTex} fallback={lesson.interaction.formula} />
                    : <MathText>{lesson.interaction.formula}</MathText>}
                  </strong>
                  <label htmlFor={`mastery-slider-${lesson.id}`}>{lesson.interaction.inputSymbol ?? "x"} = {formatNumber(inputValue)}</label>
                  <input id={`mastery-slider-${lesson.id}`} className="lesson-slider" type="range" min={lesson.interaction.input.min} max={lesson.interaction.input.max} step={lesson.interaction.input.step} value={inputValue} onChange={(event) => setInputValue(Number(event.target.value))} />
                  <span className={outputValue === null ? "is-undefined" : ""}>{outputValue === null ? "Non définie" : `${formatNumber(outputValue)}${lesson.interaction.outputSuffix ? ` ${lesson.interaction.outputSuffix}` : ""}`}</span>
                </div>
              ) : null}
              <p className="mastery-observation"><Sparkle size={21} weight="duotone" /><MathText>{lesson.interaction.observation}</MathText></p>
            </section>

            <section className="mastery-course-card is-method">
              <div><span className="mastery-course-icon"><ListNumbers size={25} weight="duotone" /></span><p className="path-kicker">Méthode</p><h2>{lesson.method.title}</h2></div>
              <p><MathText>{lesson.method.introduction}</MathText></p>
              <ol>{lesson.method.steps.map((methodStep, index) => <li key={methodStep}><span>{index + 1}</span><p><MathText>{methodStep}</MathText></p></li>)}</ol>
              <div className="mastery-worked-example"><strong><MathText>{lesson.method.example.prompt}</MathText></strong><span><MathText>{lesson.method.example.work}</MathText></span><b><MathText>{lesson.method.example.result}</MathText></b></div>
            </section>

            <LessonFeedbackPanel
              pathId={path.id}
              lessonId={lesson.id}
              currentUser={currentUser}
              localOnly={localOnly}
            />

            <div className="mastery-understood-card">
              <CompanionAvatar motion="wave" className="mastery-understood-davy" decorative />
              <div><strong>Prêt pour le défi ?</strong><span>Tu peux relire cette partie avant de lancer les exercices.</span></div>
              <button className="primary-action is-compact" type="button" onClick={() => setPhase("quiz")}>J’ai compris cette partie <ArrowRight size={20} weight="bold" /></button>
            </div>
          </article>
        )}

        {phase === "quiz" && (
          <section className="mastery-quiz" aria-labelledby="lesson-player-title">
            <header><p className="path-kicker">Évaluation du niveau</p><h1 id="lesson-player-title">À toi de jouer</h1><p>Réponds aux {questions.length} questions. 20/20 donne tous les XP, à partir de 10/20 tu en gagnes la moitié.</p></header>
            <div className="mastery-question-list">
              {questions.map((question, questionIndex) => (
                <fieldset className="mastery-question-card" key={question.prompt}>
                  <legend><span>{questionIndex + 1}</span><span><MathText>{question.prompt}</MathText>{question.sourceLabel && <small className="mastery-question-source">{question.sourceLabel}</small>}</span></legend>
                  {question.type === "short-answer" ? (
                    <div className="mastery-short-answer">
                      <label>
                        <span>Ta réponse</span>
                        <input
                          type="text"
                          value={typeof answers[questionIndex] === "string" ? answers[questionIndex] : ""}
                          onChange={(event) => setAnswers((current) => current.map((answer, index) => index === questionIndex ? event.target.value : answer))}
                          placeholder="Écris le résultat ou utilise les symboles ci-dessous"
                          autoComplete="off"
                        />
                      </label>
                      {path.subjectId === "mathematics" && (
                        <div className="mastery-symbol-pad" aria-label="Clavier de symboles mathématiques">
                          <span>Symboles utiles</span>
                          {mathInputSymbols.map((symbol) => <button type="button" key={symbol} onClick={() => insertAnswerSymbol(questionIndex, symbol)} aria-label={`Insérer ${symbol}`}>{symbol}</button>)}
                        </div>
                      )}
                      <small className="mastery-answer-hint">Tu peux aussi écrire « +infini » ou « -infini » : les deux formes sont acceptées.</small>
                    </div>
                  ) : <div>{question.options.map((option, optionIndex) => {
                    const optionId = `question-${lesson.id}-${questionIndex}-${optionIndex}`;
                    return (
                      <label htmlFor={optionId} className={answers[questionIndex] === optionIndex ? "is-selected" : ""} key={option}>
                        <input id={optionId} type="radio" name={`question-${questionIndex}`} checked={answers[questionIndex] === optionIndex} onChange={() => setAnswers((current) => current.map((answer, index) => index === questionIndex ? optionIndex : answer))} />
                        <span>{String.fromCharCode(65 + optionIndex)}</span><strong><MathText>{option}</MathText></strong>
                      </label>
                    );
                  })}</div>}
                </fieldset>
              ))}
            </div>
            {error && <p className="mastery-submit-error" role="alert">{error}</p>}
          </section>
        )}

        {phase === "result" && result && (
          <section className={`mastery-result is-${score === 20 ? "perfect" : score >= 10 ? "passed" : "failed"}`} aria-labelledby="lesson-player-title">
            <CompanionAvatar motion={score >= 10 ? "celebrate" : "idle"} className="mastery-result-davy" decorative />
            <span className="mastery-result-icon">{score >= 10 ? <Trophy size={42} weight="duotone" /> : <XCircle size={42} weight="duotone" />}</span>
            <p className="path-kicker">Résultat</p>
            <h1 id="lesson-player-title">{score === 20 ? "Parfait, niveau maîtrisé !" : score >= 10 ? "Bien joué, niveau validé !" : "Tu y es presque !"}</h1>
            <div className="mastery-score"><strong>{score}</strong><span>/20</span></div>
            <p>{score === 20
              ? "Tu as trouvé toutes les réponses et gagné la totalité des XP."
              : score >= 10
                ? resultSynced
                  ? "Le niveau suivant est débloqué. Refais cet exercice pour atteindre 20/20 et récupérer les XP restants."
                  : "Tu as atteint le score requis. La validation du niveau et les XP seront confirmés dès que la progression sera synchronisée."
                : "Relis les explications et recommence : tu peux faire autant d’essais que nécessaire."}
            </p>
            <ol className="mastery-answer-review" aria-label="Correction des réponses">
              {questions.map((question, index) => {
                const selectedIndex = answers[index];
                const isCorrect = isQuestionCorrect(question, selectedIndex);
                return (
                  <li className={isCorrect ? "is-correct" : "is-wrong"} key={question.prompt}>
                    <span>{isCorrect ? <CheckCircle size={22} weight="fill" /> : <XCircle size={22} weight="fill" />}</span>
                    <div>
                      <strong>Question {index + 1} • {isCorrect ? "Bonne réponse" : "À corriger"}</strong>
                      <p>Ta réponse : <MathText>{answerLabel(question, selectedIndex)}</MathText></p>
                      {!isCorrect && <p>Bonne réponse : <MathText>{correctAnswerLabel(question)}</MathText></p>}
                      <small><MathText>{question.explanation}</MathText></small>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className={`mastery-reward ${resultSynced ? "is-synced" : "is-pending"}`}>
              <Medal size={25} weight="duotone" />
              <span>{resultSynced
                ? <><strong>+{formatXp(result.xpDelta)} XP</strong> cet essai • {formatXp(result.xpAwarded)}/{formatXp(lesson.xp)} XP obtenus</>
                : submitting ? "Enregistrement de tes XP…" : "Score calculé • XP non synchronisés"}
              </span>
            </div>
            {error && <p className="mastery-submit-error" role="alert">{error}</p>}
            <div className="mastery-result-actions">
              {error && !submitting && score >= 10 && <button className="secondary-action" type="button" onClick={() => void synchronizeAttempt(score)}><ArrowClockwise size={19} weight="bold" />Synchroniser mes XP</button>}
              {score < 20 && <button className="primary-action is-compact" type="button" onClick={retry}>Refaire les exercices</button>}
              {resultSynced && result.passed && nextLesson && <button className="secondary-action" type="button" onClick={() => onOpenNext(nextLesson.id)}>Niveau suivant <ArrowRight size={19} weight="bold" /></button>}
              <button className="lesson-footer-back" type="button" onClick={onClose}>Retour au parcours</button>
            </div>
          </section>
        )}
      </main>

      {phase === "quiz" && (
        <footer className="lesson-player-footer">
          <button className="lesson-footer-back" type="button" onClick={() => setPhase("learn")}><ArrowLeft size={20} weight="bold" />Relire le cours</button>
          <span className="mastery-answer-count">{answeredCount}/{questions.length} réponses</span>
          <button className="primary-action is-compact" type="button" disabled={!allAnswered || submitting} onClick={() => void submitQuiz()}>{submitting ? "Correction…" : allAnswered ? "Voir mon résultat" : "Réponds à toutes les questions"}<CheckCircle size={20} weight="bold" /></button>
        </footer>
      )}
    </div>
  );
}
