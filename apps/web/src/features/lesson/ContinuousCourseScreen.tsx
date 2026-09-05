import {
  ArrowLeft,
  BookOpenText,
  CheckCircle,
  ChatCircleDots,
  Clock,
  Keyboard,
  Lightbulb,
  ListChecks,
  ListNumbers,
  SlidersHorizontal,
  Sparkle,
  XCircle,
} from "@phosphor-icons/react";
import { useEffect, useId, useMemo, useRef, useState, type RefObject } from "react";
import { MarkdownContent } from "../../components/MarkdownContent";
import { MathFormula, MathText } from "../../components/MathText";
import type { AuthUser } from "../../domain/auth";
import type { SchoolLevel, SubjectDefinition } from "../../domain/learning";
import type { LearningLesson, LearningPath, LessonQuestion } from "../../domain/paths";
import { getPathLessons } from "../paths/pathLessons";
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

type QuickAnswer = number | string | null;

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

function normalizeAnswer(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[−–—]/g, "-")
    .replace(/∞/g, "infini")
    .replace(/[×·*]/g, "")
    .replace(/÷/g, "/")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/√/g, "sqrt")
    .replace(/π/g, "pi")
    .replace(/\+inf(?:inity|ini)?/g, "+infini")
    .replace(/-inf(?:inity|ini)?/g, "-infini")
    .replace(/\s+/g, "")
    .replace(/[{}$]/g, "");
}

function isCorrect(question: LessonQuestion, answer: QuickAnswer) {
  if (question.type !== "short-answer") {
    return typeof answer === "number" && answer === question.correctIndex;
  }
  if (typeof answer !== "string" || !answer.trim()) return false;
  const normalized = normalizeAnswer(answer);
  return (question.acceptedAnswers ?? []).some((accepted) => normalizeAnswer(accepted) === normalized);
}

function correctAnswerLabel(question: LessonQuestion) {
  if (question.type === "short-answer") return question.acceptedAnswers?.[0] ?? "Voir l’explication";
  return question.options[question.correctIndex] ?? "Voir l’explication";
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
}: {
  lessonId: string;
  question: LessonQuestion;
  index: number;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [answer, setAnswer] = useState<QuickAnswer>(question.type === "short-answer" ? "" : null);
  const [checked, setChecked] = useState(false);
  const correct = checked && isCorrect(question, answer);

  const updateAnswer = (next: QuickAnswer, checkImmediately = false) => {
    setAnswer(next);
    setChecked(checkImmediately);
  };

  return (
    <article className={`course-reader-question${checked ? correct ? " is-correct" : " is-incorrect" : ""}`}>
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
            onChange={(event) => updateAnswer(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && String(answer).trim()) setChecked(true);
            }}
            placeholder="Écris ta réponse"
            autoComplete="off"
          />
          <CourseFormulaKeyboard
            inputRef={inputRef}
            value={typeof answer === "string" ? answer : ""}
            onChange={(value) => updateAnswer(value)}
          />
          <button
            className="course-reader-action"
            type="button"
            disabled={!String(answer).trim()}
            onClick={() => setChecked(true)}
          >
            Vérifier ma réponse
          </button>
        </div>
      ) : (
        <div className="course-reader-choices" role="group" aria-label={`Réponses à la vérification ${index + 1}`}>
          {question.options.map((option, optionIndex) => (
            <button
              type="button"
              key={`${lessonId}-${index}-${optionIndex}`}
              className={answer === optionIndex ? "is-selected" : ""}
              aria-pressed={answer === optionIndex}
              onClick={() => updateAnswer(optionIndex, true)}
            >
              <span>{String.fromCharCode(65 + optionIndex)}</span>
              <MathText>{option}</MathText>
            </button>
          ))}
        </div>
      )}

      {checked && (
        <div className="course-reader-result" aria-live="polite">
          {correct
            ? <CheckCircle size={22} weight="fill" aria-hidden="true" />
            : <XCircle size={22} weight="fill" aria-hidden="true" />}
          <div>
            <strong>{correct ? "Exact, tu peux poursuivre." : "Pas encore. Reprends le raisonnement."}</strong>
            {!correct && <p>Réponse attendue : <MathText>{correctAnswerLabel(question)}</MathText></p>}
            <p><MathText>{question.explanation}</MathText></p>
          </div>
        </div>
      )}
    </article>
  );
}

function lessonQuestions(lesson: LearningLesson) {
  return (lesson.questions?.length ? lesson.questions : [lesson.question]).slice(0, 2);
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

                <CoursePracticePanel lesson={lesson} />

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
                      <p>Réponds puis lis tout de suite l’explication. Il n’y a ni note ni pénalité.</p>
                    </header>
                    <div>
                      {quickChecks.map((question, questionIndex) => (
                        <CourseQuickCheck
                          key={`${lesson.id}-quick-check-${questionIndex}`}
                          lessonId={lesson.id}
                          question={question}
                          index={questionIndex}
                        />
                      ))}
                    </div>
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
