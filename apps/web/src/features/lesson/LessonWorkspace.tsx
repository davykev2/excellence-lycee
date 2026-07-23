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
import type { CurveLessonInteraction, CurveRule, FunctionRule, LearningLesson, LearningPath, LessonQuestion } from "../../domain/paths";
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

function evaluateCurveRule(rule: CurveRule, input: number): number | null {
  if (rule.kind === "polynomial") return rule.coefficients.reduce((sum, coefficient, degree) => sum + coefficient * input ** degree, 0);
  if (rule.kind === "rational-linear") {
    const denominator = rule.denominator[0] * input + rule.denominator[1];
    return Math.abs(denominator) < 0.00001 ? null : (rule.numerator[0] * input + rule.numerator[1]) / denominator;
  }
  if (rule.kind === "affine-plus-reciprocal") {
    const denominator = input - rule.shift;
    return Math.abs(denominator) < 0.00001 ? null : rule.slope * input + rule.intercept + rule.coefficient / denominator;
  }
  return evaluateRule(rule, input);
}

function niceTicks(min: number, max: number) {
  const rawStep = (max - min) / 8;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const residual = rawStep / magnitude;
  const step = (residual >= 5 ? 5 : residual >= 2 ? 2 : 1) * magnitude;
  const ticks: number[] = [];
  for (let value = Math.ceil(min / step) * step; value <= max + step / 1000; value += step) ticks.push(Number(value.toFixed(10)));
  return ticks;
}

function buildCurveSegments(rule: CurveRule, window: CurveLessonInteraction["window"], samples = 480) {
  const segments: Array<Array<[number, number]>> = [];
  let current: Array<[number, number]> = [];
  const overflow = window.yMax - window.yMin;
  for (let index = 0; index <= samples; index += 1) {
    const x = window.xMin + ((window.xMax - window.xMin) * index) / samples;
    const y = evaluateCurveRule(rule, x);
    if (y === null || !Number.isFinite(y) || y < window.yMin - overflow || y > window.yMax + overflow) {
      if (current.length > 1) segments.push(current);
      current = [];
      continue;
    }
    current.push([x, y]);
  }
  if (current.length > 1) segments.push(current);
  return segments;
}

function CurveLab({ interaction, inputValue, outputValue, lessonId, onInputChange }: {
  interaction: CurveLessonInteraction;
  inputValue: number;
  outputValue: number | null;
  lessonId: string;
  onInputChange: (value: number) => void;
}) {
  const { window, guides = [], marker } = interaction;
  const width = 560;
  const height = 330;
  const px = (x: number) => ((x - window.xMin) / (window.xMax - window.xMin)) * width;
  const py = (y: number) => height - ((y - window.yMin) / (window.yMax - window.yMin)) * height;
  const segments = useMemo(() => buildCurveSegments(interaction.rule, window), [interaction.rule, window]);
  const ticksX = useMemo(() => niceTicks(window.xMin, window.xMax), [window.xMin, window.xMax]);
  const ticksY = useMemo(() => niceTicks(window.yMin, window.yMax), [window.yMin, window.yMax]);
  const markerVisible = outputValue !== null && outputValue >= window.yMin && outputValue <= window.yMax;
  return (
    <div className="mastery-curve-lab">
      <strong>{interaction.formulaTex
        ? <MathFormula tex={interaction.formulaTex} fallback={interaction.formula} />
        : <MathText>{interaction.formula}</MathText>}
      </strong>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Représentation graphique : ${interaction.formula}`}>
        {ticksX.map((tick) => <line className="curve-grid" key={`gx-${tick}`} x1={px(tick)} y1={0} x2={px(tick)} y2={height} />)}
        {ticksY.map((tick) => <line className="curve-grid" key={`gy-${tick}`} x1={0} y1={py(tick)} x2={width} y2={py(tick)} />)}
        {window.yMin < 0 && window.yMax > 0 && <line className="curve-axis" x1={0} y1={py(0)} x2={width} y2={py(0)} />}
        {window.xMin < 0 && window.xMax > 0 && <line className="curve-axis" x1={px(0)} y1={0} x2={px(0)} y2={height} />}
        {ticksX.filter((tick) => tick !== 0).map((tick) => window.yMin < 0 && window.yMax > 0
          ? <text className="curve-tick" key={`tx-${tick}`} x={px(tick)} y={Math.min(py(0) + 15, height - 4)} textAnchor="middle">{formatNumber(tick)}</text>
          : null)}
        {ticksY.filter((tick) => tick !== 0).map((tick) => window.xMin < 0 && window.xMax > 0
          ? <text className="curve-tick" key={`ty-${tick}`} x={Math.max(px(0) - 6, 2)} y={py(tick) + 4} textAnchor="end">{formatNumber(tick)}</text>
          : null)}
        {guides.map((guide, index) => {
          if (guide.kind === "vertical" && guide.value !== undefined) {
            return (
              <g key={`guide-${index}`}>
                <line className="curve-guide" x1={px(guide.value)} y1={0} x2={px(guide.value)} y2={height} />
                <text className="curve-guide-label" x={px(guide.value) + 7} y={16}>{guide.label}</text>
              </g>
            );
          }
          if (guide.kind === "horizontal" && guide.value !== undefined) {
            return (
              <g key={`guide-${index}`}>
                <line className="curve-guide" x1={0} y1={py(guide.value)} x2={width} y2={py(guide.value)} />
                <text className="curve-guide-label" x={width - 6} y={py(guide.value) - 6} textAnchor="end">{guide.label}</text>
              </g>
            );
          }
          if (guide.kind === "oblique" && guide.slope !== undefined && guide.intercept !== undefined) {
            const yStart = guide.slope * window.xMin + guide.intercept;
            const yEnd = guide.slope * window.xMax + guide.intercept;
            const labelX = window.xMin + (window.xMax - window.xMin) * 0.72;
            const labelY = guide.slope * labelX + guide.intercept;
            return (
              <g key={`guide-${index}`}>
                <line className="curve-guide" x1={px(window.xMin)} y1={py(yStart)} x2={px(window.xMax)} y2={py(yEnd)} />
                <text className="curve-guide-label" x={px(labelX)} y={py(labelY) - 8}>{guide.label}</text>
              </g>
            );
          }
          return null;
        })}
        {segments.map((segment, index) => (
          <path
            className="curve-path"
            key={`segment-${index}`}
            d={segment.map(([x, y], pointIndex) => `${pointIndex === 0 ? "M" : "L"}${px(x).toFixed(1)} ${py(y).toFixed(1)}`).join(" ")}
          />
        ))}
        {markerVisible && outputValue !== null && (
          <g>
            <circle className="curve-marker" cx={px(inputValue)} cy={py(outputValue)} r={6.5} />
            <text
              className="curve-marker-label"
              x={Math.min(Math.max(px(inputValue) + 11, 8), width - 8)}
              y={Math.min(Math.max(py(outputValue) - 11, 16), height - 8)}
              textAnchor={px(inputValue) > width - 130 ? "end" : "start"}
            >({formatNumber(inputValue)} ; {formatNumber(outputValue)})</text>
          </g>
        )}
      </svg>
      <label htmlFor={`mastery-curve-${lessonId}`}>x = {formatNumber(inputValue)}</label>
      <input
        id={`mastery-curve-${lessonId}`}
        className="lesson-slider"
        type="range"
        min={marker.min}
        max={marker.max}
        step={marker.step}
        value={inputValue}
        onChange={(event) => onInputChange(Number(event.target.value))}
      />
      <span className={outputValue === null ? "is-undefined" : ""}>
        {outputValue === null ? "f(x) non définie : valeur interdite !" : `f(${formatNumber(inputValue)}) = ${formatNumber(outputValue)}`}
      </span>
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(value);
}

function initialInteractionValue(lesson: LearningLesson) {
  if (lesson.interaction.kind === "timeline") return 0;
  if (lesson.interaction.kind === "curve") return lesson.interaction.marker.initial;
  return lesson.interaction.input.initial;
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

  const outputValue = useMemo(() => {
    if (lesson.interaction.kind === "timeline") return null;
    if (lesson.interaction.kind === "curve") return evaluateCurveRule(lesson.interaction.rule, inputValue);
    return evaluateRule(lesson.interaction.rule, inputValue);
  }, [inputValue, lesson.interaction]);
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
              <p><MathText>{lesson.summary}</MathText></p>
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
              ) : lesson.interaction.kind === "curve" ? (
                <CurveLab
                  interaction={lesson.interaction}
                  inputValue={inputValue}
                  outputValue={outputValue}
                  lessonId={lesson.id}
                  onInputChange={setInputValue}
                />
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
            <LessonFeedbackPanel
              pathId={path.id}
              lessonId={lesson.id}
              currentUser={currentUser}
              localOnly={localOnly}
              context="correction"
            />
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
