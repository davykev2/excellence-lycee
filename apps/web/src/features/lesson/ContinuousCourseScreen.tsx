import {
  ArrowLeft,
  BookOpenText,
  ChartBar,
  CheckCircle,
  ChatCircleDots,
  Clock,
  Keyboard,
  Lightbulb,
  ListChecks,
  ListNumbers,
  SlidersHorizontal,
  Sparkle,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react";
import { useEffect, useId, useMemo, useRef, useState, type RefObject } from "react";
import { MarkdownContent } from "../../components/MarkdownContent";
import { MathFormula, MathText } from "../../components/MathText";
import type { AuthUser } from "../../domain/auth";
import type { SchoolLevel, SubjectDefinition } from "../../domain/learning";
import type { LearningLesson, LearningPath, LessonQuestion } from "../../domain/paths";
import { getPathLessons } from "../paths/pathLessons";
import {
  calculateCourseCorrection,
  formatCourseScore,
  getCourseQuestionCorrection,
  type CourseQuickAnswer,
} from "./courseCorrection";
import { CoursePracticePanel } from "./CoursePracticePanel";
import { LessonFeedbackPanel } from "./LessonFeedbackPanel";
import { LessonInteractionPanel } from "./LessonWorkspace";

interface ContinuousCourseScreenProps {
  path: LearningPath;
  level: SchoolLevel;
  subject: SubjectDefinition;
  currentUser: Pick<AuthUser, "id" | "name" | "photoUrl" | "role">;
  localOnly?: boolean;
  focusedSectionId?: string;
  onBackToLibrary: () => void;
}

const formulaKeyboardGroups = [
  {
    label: "Calcul",
    symbols: ["+", "−", "×", "÷", "=", "≠", "≈", "<", ">", "≤", "≥", "±", "(", ")", "[", "]", "{", "}", "|", "/", ",", ";"],
  },
  {
    label: "Puissances et racines",
    symbols: ["²", "³", "^", "√(", "∛(", "10^", "e^(", "×10^", "%"],
  },
  {
    label: "Ensembles et limites",
    symbols: ["+∞", "−∞", "∞", "ℕ", "ℤ", "ℚ", "ℝ", "ℂ", "∈", "∉", "⊂", "∪", "∩", "∅", "→"],
  },
  {
    label: "Analyse",
    symbols: ["ln(", "log(", "exp(", "sin(", "cos(", "tan(", "lim", "f′(", "∫", "dx", "Σ"],
  },
  {
    label: "Géométrie et physique",
    symbols: ["π", "α", "β", "γ", "θ", "φ", "λ", "μ", "ρ", "σ", "ω", "Δ", "°", "⟂", "∥", "·", "‖"],
  },
] as const;

function sectionDomId(sectionId: string) {
  return `course-section-${sectionId}`;
}

function insertAtCursor(
  element: HTMLInputElement | null,
  value: string,
  symbol: string,
  onChange: (next: string) => void,
) {
  const start = element?.selectionStart ?? value.length;
  const end = element?.selectionEnd ?? start;
  const next = `${value.slice(0, start)}${symbol}${value.slice(end)}`;
  onChange(next);
  window.requestAnimationFrame(() => {
    element?.focus();
    element?.setSelectionRange(start + symbol.length, start + symbol.length);
  });
}

function CourseFormulaKeyboard({
  inputRef,
  value,
  onChange,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="course-reader-formula-tools">
      <button
        className="course-reader-formula-toggle"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Keyboard size={18} weight="duotone" aria-hidden="true" />
        {open ? "Masquer le clavier" : "Clavier de formules"}
      </button>
      {open && (
        <div className="course-reader-symbol-pad" role="group" aria-label="Clavier de symboles mathématiques">
          {formulaKeyboardGroups.map((group) => (
            <section key={group.label}>
              <span>{group.label}</span>
              <div>
                {group.symbols.map((symbol) => (
                  <button
                    type="button"
                    key={symbol}
                    aria-label={`Insérer ${symbol}`}
                    onClick={() => insertAtCursor(inputRef.current, value, symbol, onChange)}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function CourseQuickCheck({
  lessonId,
  question,
  index,
  answer,
  checked,
  onAnswer,
}: {
  lessonId: string;
  question: LessonQuestion;
  index: number;
  answer: CourseQuickAnswer;
  checked: boolean;
  onAnswer: (answer: CourseQuickAnswer) => void;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const correction = checked ? getCourseQuestionCorrection(question, answer) : null;
  const status = correction?.status;

  return (
    <article className={`course-reader-question${status ? ` is-${status}` : ""}`}>
      <header>
        <span>Vérification {index + 1}</span>
        {question.sourceLabel && <small>{question.sourceLabel}</small>}
      </header>
      <p className="course-reader-question-prompt"><MathText>{question.prompt}</MathText></p>

      {question.type === "short-answer" ? (
        <div className="course-reader-short-answer">
          <label htmlFor={inputId}>Ta réponse</label>
          <input
            id={inputId}
            ref={inputRef}
            type="text"
            value={typeof answer === "string" ? answer : ""}
            onChange={(event) => onAnswer(event.target.value)}
            placeholder="Écris ta réponse"
            autoComplete="off"
            aria-invalid={status === "incorrect" || status === "unanswered" ? true : undefined}
          />
          <CourseFormulaKeyboard
            inputRef={inputRef}
            value={typeof answer === "string" ? answer : ""}
            onChange={onAnswer}
          />
        </div>
      ) : (
        <div className="course-reader-choices" role="group" aria-label={`Réponses à la vérification ${index + 1}`}>
          {question.options.map((option, optionIndex) => (
            (() => {
              const selected = answer === optionIndex;
              const expected = question.correctIndex === optionIndex;
              const stateClass = checked
                ? selected && status === "correct"
                  ? " is-answer-correct"
                  : selected
                    ? " is-answer-wrong"
                    : expected
                      ? " is-answer-expected"
                      : ""
                : "";
              return (
                <button
                  type="button"
                  key={`${lessonId}-${index}-${optionIndex}`}
                  className={`${selected ? "is-selected" : ""}${stateClass}`}
                  aria-pressed={selected}
                  onClick={() => onAnswer(optionIndex)}
                >
                  <span>{String.fromCharCode(65 + optionIndex)}</span>
                  <MathText>{option}</MathText>
                </button>
              );
            })()
          ))}
        </div>
      )}

      {correction && (
        <div className={`course-reader-result is-${correction.status}`} aria-live="polite">
          {correction.status === "correct"
            ? <CheckCircle size={24} weight="fill" aria-hidden="true" />
            : correction.status === "unanswered"
              ? <WarningCircle size={24} weight="fill" aria-hidden="true" />
              : <XCircle size={24} weight="fill" aria-hidden="true" />}
          <div>
            <strong>
              {correction.status === "correct"
                ? "Bonne réponse"
                : correction.status === "unanswered"
                  ? "Pas de réponse"
                  : "Réponse incorrecte"}
            </strong>
            {correction.status === "correct" && correction.answerLabel && (
              <p className="course-reader-answer is-correct-answer">
                <span>Ta réponse</span><MathText>{correction.answerLabel}</MathText>
              </p>
            )}
            {correction.status === "incorrect" && correction.answerLabel && (
              <p className="course-reader-answer is-student-wrong">
                <span>Ta réponse</span><del><MathText>{correction.answerLabel}</MathText></del>
              </p>
            )}
            {correction.status !== "correct" && (
              <p className="course-reader-answer is-expected-answer">
                <span>{correction.status === "unanswered" ? "Solution attendue" : "Réponse correcte"}</span>
                <MathText>{correction.expectedAnswerLabel}</MathText>
              </p>
            )}
            <p className="course-reader-explanation"><span>Pourquoi ?</span><MathText>{question.explanation}</MathText></p>
          </div>
        </div>
      )}
    </article>
  );
}

function emptyQuickAnswer(question: LessonQuestion): CourseQuickAnswer {
  return question.type === "short-answer" ? "" : null;
}

function CourseQuickCheckGroup({
  lessonId,
  questions,
}: {
  lessonId: string;
  questions: LessonQuestion[];
}) {
  const [answers, setAnswers] = useState<CourseQuickAnswer[]>(() => questions.map(emptyQuickAnswer));
  const [checked, setChecked] = useState(false);
  const summary = checked ? calculateCourseCorrection(questions, answers) : null;

  useEffect(() => {
    setAnswers(questions.map(emptyQuickAnswer));
    setChecked(false);
  }, [lessonId]);

  const updateAnswer = (index: number, answer: CourseQuickAnswer) => {
    setAnswers((current) => current.map((value, answerIndex) => answerIndex === index ? answer : value));
    setChecked(false);
  };

  return (
    <form
      className="course-reader-check-form"
      onSubmit={(event) => {
        event.preventDefault();
        setChecked(true);
      }}
    >
      <div className="course-reader-question-list">
        {questions.map((question, questionIndex) => (
          <CourseQuickCheck
            key={`${lessonId}-quick-check-${questionIndex}`}
            lessonId={lessonId}
            question={question}
            index={questionIndex}
            answer={answers[questionIndex] ?? emptyQuickAnswer(question)}
            checked={checked}
            onAnswer={(answer) => updateAnswer(questionIndex, answer)}
          />
        ))}
      </div>

      <div className="course-reader-check-actions">
        <button className="course-reader-action" type="submit">Valider mes réponses</button>
        <span>Tu peux valider même si une réponse est vide.</span>
      </div>

      {summary && (
        <section className="course-reader-score" aria-live="polite" aria-label="Résultat de cette vérification">
          <ChartBar size={28} weight="duotone" aria-hidden="true" />
          <div>
            <p className="path-kicker">Résultat</p>
            <strong>{summary.percentage} %</strong>
            <span>{formatCourseScore(summary.scoreOutOf20)} / 20</span>
          </div>
          <p>
            {summary.correctAnswers} bonne{summary.correctAnswers > 1 ? "s" : ""} réponse{summary.correctAnswers > 1 ? "s" : ""}
            {" sur "}{summary.totalQuestions}. Ce bilan est un repère d’entraînement, sans XP ni pénalité.
          </p>
        </section>
      )}
    </form>
  );
}

function lessonQuestions(lesson: LearningLesson) {
  return lesson.questions?.length ? lesson.questions : [lesson.question];
}

export function ContinuousCourseScreen({
  path,
  level,
  subject,
  currentUser,
  localOnly = false,
  focusedSectionId,
  onBackToLibrary,
}: ContinuousCourseScreenProps) {
  const lessons = useMemo(() => getPathLessons(path), [path]);
  const [activeSectionId, setActiveSectionId] = useState(focusedSectionId ?? lessons[0]?.id ?? "");
  const [feedbackSectionIds, setFeedbackSectionIds] = useState<Set<string>>(() => new Set());
  const chapterNumber = path.chapterNumberByLevel?.[level.id] ?? path.chapterNumber;

  useEffect(() => {
    const requestedSectionId = focusedSectionId && lessons.some((lesson) => lesson.id === focusedSectionId)
      ? focusedSectionId
      : lessons[0]?.id ?? "";
    setActiveSectionId(requestedSectionId);
    if (!focusedSectionId || requestedSectionId !== focusedSectionId) return;
    const animationFrame = window.requestAnimationFrame(() => {
      const section = document.getElementById(sectionDomId(focusedSectionId));
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(animationFrame);
  }, [focusedSectionId, lessons]);

  useEffect(() => {
    setFeedbackSectionIds(new Set());
  }, [path.id]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const sections = lessons
      .map((lesson) => document.getElementById(sectionDomId(lesson.id)))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        const sectionId = visible?.target.getAttribute("data-course-section-id");
        if (sectionId) setActiveSectionId(sectionId);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.2, 0.5, 0.8] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [lessons]);

  const scrollToSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    document.getElementById(sectionDomId(sectionId))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleFeedback = (sectionId: string) => {
    setFeedbackSectionIds((current) => {
      const next = new Set(current);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  return (
    <main className="course-reader-page">
      <header className="course-reader-topbar">
        <button className="path-back-button course-reader-back" type="button" onClick={onBackToLibrary}>
          <ArrowLeft size={20} weight="bold" aria-hidden="true" />
          <span>Toutes les leçons</span>
        </button>
        <div className="course-reader-meta">
          <span>{level.label}</span>
          <strong>{subject.label}</strong>
        </div>
      </header>

      <section className="course-reader-hero" aria-labelledby="continuous-course-title">
        <div className="course-reader-hero-copy">
          <p className="path-kicker">Chapitre {chapterNumber} · {path.theme.title}</p>
          <h1 id="continuous-course-title">{path.title}</h1>
          <p><MathText>{path.description}</MathText></p>
          <div className="course-reader-badges" aria-label="Informations sur le cours">
            <span><BookOpenText size={19} weight="duotone" aria-hidden="true" /> Cours complet</span>
            <span><ListNumbers size={19} weight="duotone" aria-hidden="true" /> {lessons.length} partie{lessons.length > 1 ? "s" : ""}</span>
            <span><Clock size={19} weight="duotone" aria-hidden="true" /> {path.estimatedMinutes} min environ</span>
          </div>
        </div>
        <aside className="course-reader-lead" aria-label="Objectifs du cours">
          <span><ListChecks size={22} weight="duotone" aria-hidden="true" /> À la fin de ce cours</span>
          <ul>{path.outcomes.map((outcome) => <li key={outcome}><MathText>{outcome}</MathText></li>)}</ul>
        </aside>
      </section>

      <div className="course-reader-layout">
        <aside className="course-reader-sidebar" aria-label="Sommaire du cours">
          <div>
            <p className="path-kicker">Sommaire</p>
            <strong>Dans ce chapitre</strong>
          </div>
          <nav className="course-reader-toc">
            {lessons.map((lesson, index) => (
              <button
                type="button"
                key={lesson.id}
                className={`course-reader-toc-link${activeSectionId === lesson.id ? " is-active" : ""}`}
                aria-current={activeSectionId === lesson.id ? "location" : undefined}
                onClick={() => scrollToSection(lesson.id)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <MathText>{lesson.title}</MathText>
              </button>
            ))}
          </nav>
        </aside>

        <div className="course-reader-content">
          {lessons.map((lesson, lessonIndex) => {
            const quickChecks = lessonQuestions(lesson);
            const feedbackOpen = feedbackSectionIds.has(lesson.id);
            return (
              <article
                id={sectionDomId(lesson.id)}
                className="course-reader-section"
                data-course-section-id={lesson.id}
                key={lesson.id}
              >
                <header className="course-reader-section-head">
                  <span className="course-reader-section-index">Partie {String(lessonIndex + 1).padStart(2, "0")}</span>
                  <p className="path-kicker">Cours et exemples</p>
                  <h2><MathText>{lesson.title}</MathText></h2>
                  <p><MathText>{lesson.summary}</MathText></p>
                </header>

                <section className="mastery-course-card is-concept course-reader-rich-content">
                  <div>
                    <span className="mastery-course-icon"><BookOpenText size={25} weight="duotone" aria-hidden="true" /></span>
                    <p className="path-kicker">Comprendre</p>
                    <h3><MathText>{lesson.concept.title}</MathText></h3>
                  </div>
                  {lesson.concept.bodyMarkdown
                    ? <MarkdownContent markdown={lesson.concept.bodyMarkdown} />
                    : <p><MathText>{lesson.concept.explanation}</MathText></p>}
                  <div className="lesson-notation course-reader-callout">
                    <span>À retenir</span>
                    <strong>
                      {lesson.concept.notationTex
                        ? <MathFormula tex={lesson.concept.notationTex} block fallback={lesson.concept.notation} />
                        : <MathText>{lesson.concept.notation}</MathText>}
                    </strong>
                  </div>
                  <div className="lesson-example course-reader-example">
                    <Lightbulb size={24} weight="duotone" aria-hidden="true" />
                    <div><strong>Exemple expliqué</strong><p><MathText>{lesson.concept.example}</MathText></p></div>
                  </div>
                </section>

                <section className="mastery-course-card is-lab course-reader-interaction">
                  <div>
                    <span className="mastery-course-icon"><SlidersHorizontal size={25} weight="duotone" aria-hidden="true" /></span>
                    <p className="path-kicker">Manipuler</p>
                    <h3><MathText>{lesson.interaction.title}</MathText></h3>
                  </div>
                  <p><MathText>{lesson.interaction.instruction}</MathText></p>
                  <LessonInteractionPanel lesson={lesson} />
                  <p className="mastery-observation"><Sparkle size={21} weight="duotone" aria-hidden="true" /><MathText>{lesson.interaction.observation}</MathText></p>
                </section>

                <section className="mastery-course-card is-method course-reader-method">
                  <div>
                    <span className="mastery-course-icon"><ListNumbers size={25} weight="duotone" aria-hidden="true" /></span>
                    <p className="path-kicker">Méthode</p>
                    <h3><MathText>{lesson.method.title}</MathText></h3>
                  </div>
                  <p><MathText>{lesson.method.introduction}</MathText></p>
                  <ol>
                    {lesson.method.steps.map((step, index) => (
                      <li key={`${lesson.id}-method-${index}`}><span>{index + 1}</span><p><MathText>{step}</MathText></p></li>
                    ))}
                  </ol>
                  <div className="mastery-worked-example">
                    <strong><MathText>{lesson.method.example.prompt}</MathText></strong>
                    <span><MathText>{lesson.method.example.work}</MathText></span>
                    <b><MathText>{lesson.method.example.result}</MathText></b>
                  </div>
                  {lesson.method.tip && <p className="course-reader-callout"><Lightbulb size={19} weight="duotone" aria-hidden="true" /><MathText>{lesson.method.tip}</MathText></p>}
                </section>

                <CoursePracticePanel
                  lesson={lesson}
                  storageScope={`${currentUser.id}:${path.id}:${lesson.id}`}
                />

                {lesson.source && (
                  <aside className="course-reader-source">
                    <div>
                      <strong>Source du cours</strong>
                      <span>{lesson.source.documentTitle} · pages {lesson.source.pages} · {lesson.source.section}</span>
                    </div>
                    {lesson.source.corrections.length > 0 && (
                      <details className="course-reader-corrections">
                        <summary>Précisions et corrections apportées ({lesson.source.corrections.length})</summary>
                        <ul>{lesson.source.corrections.map((correction, correctionIndex) => <li key={`${lesson.id}-correction-${correctionIndex}`}><MathText>{correction}</MathText></li>)}</ul>
                      </details>
                    )}
                  </aside>
                )}

                {quickChecks.length > 0 && (
                  <section className="course-reader-quick-check" aria-labelledby={`course-checks-${lesson.id}`}>
                    <header>
                      <p className="path-kicker">Vérifie ta compréhension</p>
                      <h3 id={`course-checks-${lesson.id}`}>Quelques secondes pour faire le point</h3>
                      <p>Réponds à ton rythme, puis valide l’ensemble pour voir la correction et ton bilan sur 20. Il n’y a ni XP ni pénalité.</p>
                    </header>
                    <CourseQuickCheckGroup lessonId={lesson.id} questions={quickChecks} />
                  </section>
                )}

                <section className="course-reader-feedback-toggle">
                  <div><ChatCircleDots size={24} weight="duotone" aria-hidden="true" /><span><strong>Une remarque sur cette partie ?</strong><small>Ton retour aide l’équipe à rendre le cours plus clair.</small></span></div>
                  <button type="button" aria-expanded={feedbackOpen} onClick={() => toggleFeedback(lesson.id)}>
                    {feedbackOpen ? "Fermer les avis" : "Donner mon avis"}
                  </button>
                </section>
                {feedbackOpen && (
                  <LessonFeedbackPanel
                    pathId={path.id}
                    lessonId={lesson.id}
                    currentUser={currentUser}
                    localOnly={localOnly}
                  />
                )}
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
