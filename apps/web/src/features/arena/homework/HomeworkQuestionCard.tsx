import {
  CheckCircle,
  Keyboard,
  PencilLine,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react";
import { useRef, useState, type RefObject } from "react";
import { MarkdownContent } from "../../../components/MarkdownContent";
import { MathText } from "../../../components/MathText";
import type { HomeworkQuestion, HomeworkStoredAnswer } from "../../../domain/homework";
import { freeHomeworkAnswer, homeworkQuestionPointSplit } from "./homeworkModel";

const symbolGroups = [
  {
    label: "Calcul",
    symbols: ["+", "−", "×", "÷", "=", "≠", "≈", "<", ">", "≤", "≥", "±", "(", ")", "[", "]", "{", "}", "|", "/", ",", ";"],
  },
  { label: "Puissances et racines", symbols: ["²", "³", "^", "√(", "∛(", "10^", "e^(", "×10^", "%"] },
  {
    label: "Ensembles et limites",
    symbols: ["+∞", "−∞", "∞", "ℕ", "ℤ", "ℚ", "ℝ", "ℂ", "∈", "∉", "⊂", "∪", "∩", "∅", "→"],
  },
  { label: "Analyse", symbols: ["ln(", "log(", "exp(", "sin(", "cos(", "tan(", "lim", "f′(", "∫", "dx", "Σ"] },
  {
    label: "Géométrie et physique",
    symbols: ["π", "α", "β", "γ", "θ", "φ", "λ", "μ", "ρ", "σ", "ω", "Δ", "°", "⟂", "∥", "·", "‖"],
  },
] as const;

function pointLabel(value: number) {
  return new Intl.NumberFormat("fr-CI", { maximumFractionDigits: 2 }).format(value);
}

function insertAtCursor(
  element: HTMLInputElement | HTMLTextAreaElement | null,
  currentValue: string,
  symbol: string,
  onChange: (next: string) => void,
) {
  const start = element?.selectionStart ?? currentValue.length;
  const end = element?.selectionEnd ?? start;
  const next = `${currentValue.slice(0, start)}${symbol}${currentValue.slice(end)}`;
  onChange(next);
  window.requestAnimationFrame(() => {
    element?.focus();
    element?.setSelectionRange(start + symbol.length, start + symbol.length);
  });
}

function FormulaKeyboard({
  inputRef,
  value,
  onChange,
}: {
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="homework-formula-tools">
      <button
        type="button"
        className="homework-formula-toggle"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Keyboard size={18} weight="duotone" />
        {open ? "Masquer le clavier" : "Clavier de formules"}
      </button>
      {open && (
        <div className="homework-symbol-pad" role="group" aria-label="Clavier de symboles mathématiques">
          {symbolGroups.map((group) => (
            <section key={group.label}>
              <span>{group.label}</span>
              <div>
                {group.symbols.map((symbol) => (
                  <button
                    type="button"
                    key={symbol}
                    onClick={() => insertAtCursor(inputRef.current, value, symbol, onChange)}
                    aria-label={`Insérer ${symbol}`}
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

function GradingBadge({ question }: { question: HomeworkQuestion }) {
  const split = homeworkQuestionPointSplit(question);
  if (question.isNeutralized) {
    return (
      <span className="homework-question-mode is-neutralized">
        <ShieldCheck size={16} weight="duotone" />Question neutralisée · points accordés
      </span>
    );
  }
  if (question.gradingMode === "auto") {
    return <span className="homework-question-mode is-auto">Correction automatique</span>;
  }
  if (question.gradingMode === "manual") {
    return <span className="homework-question-mode is-manual">Lecture par un correcteur</span>;
  }
  return (
    <span className="homework-question-mode is-hybrid">
      {pointLabel(split.automatic)} pt automatique + {pointLabel(split.manual)} pt après lecture
    </span>
  );
}

function AnswerPreview({ value }: { value: string }) {
  if (!value.trim()) return null;
  return (
    <div className="homework-answer-preview" aria-live="polite">
      <span>Aperçu de ta rédaction</span>
      <MarkdownContent markdown={value} preserveLineBreaks />
    </div>
  );
}

export function HomeworkQuestionCard({
  question,
  answer,
  disabled,
  onAnswer,
}: {
  question: HomeworkQuestion;
  answer?: HomeworkStoredAnswer;
  disabled: boolean;
  onAnswer: (answer: HomeworkStoredAnswer) => void;
}) {
  const finalInputRef = useRef<HTMLInputElement>(null);
  const reasoningRef = useRef<HTMLTextAreaElement>(null);
  const freeAnswer = freeHomeworkAnswer(answer);
  const selectedChoice = typeof answer?.answer === "string" ? answer.answer : "";
  const updateFreeAnswer = (patch: Partial<typeof freeAnswer>) => onAnswer({
    answer: { ...freeAnswer, ...patch },
    attachmentUrls: answer?.attachmentUrls ?? [],
  });

  return (
    <article
      id={`homework-question-${question.id}`}
      className={`homework-question-card${question.isNeutralized ? " is-neutralized" : ""}`}
    >
      <header>
        <div>
          <span className="homework-question-label">{question.label}</span>
          <GradingBadge question={question} />
        </div>
        <strong>{pointLabel(question.points)} pt{question.points > 1 ? "s" : ""}</strong>
      </header>

      <div className="homework-question-prompt">
        <MarkdownContent markdown={question.promptMarkdown} preserveLineBreaks />
      </div>

      {question.imageUrl && (
        <figure className="homework-question-figure">
          <img
            src={question.imageUrl}
            alt={question.imageAlt ?? ""}
            loading="lazy"
            decoding="async"
          />
          {question.imageAlt && <figcaption>{question.imageAlt}</figcaption>}
        </figure>
      )}

      {question.sourceNotice && (
        <p className="homework-question-source-note">
          <WarningCircle size={18} weight="duotone" />
          <MathText>{question.sourceNotice}</MathText>
        </p>
      )}

      {question.isNeutralized ? (
        <div className="homework-neutralized-answer">
          <CheckCircle size={22} weight="fill" />
          <p><strong>Aucune réponse à saisir.</strong> Les points de cette question seront ajoutés à toutes les copies.</p>
        </div>
      ) : question.type === "qcm" && question.choices ? (
        <fieldset className="homework-choice-list" disabled={disabled}>
          <legend className="sr-only">Réponse à la question {question.label}</legend>
          {question.choices.map((choice) => {
            const selected = selectedChoice === choice.id;
            return (
              <label className={selected ? "is-selected" : ""} key={choice.id}>
                <input
                  type="radio"
                  name={`homework-answer-${question.id}`}
                  value={choice.id}
                  checked={selected}
                  onChange={() => onAnswer({ answer: choice.id, attachmentUrls: [] })}
                />
                <span className="notranslate" translate="no">{choice.label}</span>
                <strong><MathText>{choice.contentMarkdown}</MathText></strong>
                {selected && <CheckCircle size={20} weight="fill" aria-label="Réponse choisie" />}
              </label>
            );
          })}
        </fieldset>
      ) : question.gradingMode === "hybrid" ? (
        <div className="homework-free-answer is-hybrid">
          <label>
            <span>Réponse finale <small>partie vérifiée automatiquement</small></span>
            <input
              ref={finalInputRef}
              type="text"
              value={freeAnswer.finalAnswer}
              disabled={disabled}
              autoComplete="off"
              placeholder="Écris le résultat, l’intervalle ou l’expression finale"
              onChange={(event) => updateFreeAnswer({ finalAnswer: event.currentTarget.value })}
            />
          </label>
          <FormulaKeyboard
            inputRef={finalInputRef}
            value={freeAnswer.finalAnswer ?? ""}
            onChange={(value) => updateFreeAnswer({ finalAnswer: value })}
          />
          <label>
            <span>Démonstration ou justification <small>lue par un correcteur</small></span>
            <textarea
              ref={reasoningRef}
              rows={7}
              value={freeAnswer.reasoning}
              disabled={disabled}
              placeholder="Rédige les propriétés utilisées, les calculs et ta conclusion…"
              onChange={(event) => updateFreeAnswer({ reasoning: event.currentTarget.value })}
            />
          </label>
          <FormulaKeyboard
            inputRef={reasoningRef}
            value={freeAnswer.reasoning ?? ""}
            onChange={(value) => updateFreeAnswer({ reasoning: value })}
          />
          <AnswerPreview value={freeAnswer.reasoning ?? ""} />
        </div>
      ) : question.gradingMode === "manual" || question.answerKind === "essay" ? (
        <div className="homework-free-answer">
          <label>
            <span>Ta démonstration <small>sera lue avec le barème ci-dessous</small></span>
            <textarea
              ref={reasoningRef}
              rows={8}
              value={freeAnswer.reasoning}
              disabled={disabled}
              placeholder="Rédige chaque étape de ton raisonnement et termine par une conclusion…"
              onChange={(event) => updateFreeAnswer({ reasoning: event.currentTarget.value })}
            />
          </label>
          <FormulaKeyboard
            inputRef={reasoningRef}
            value={freeAnswer.reasoning ?? ""}
            onChange={(value) => updateFreeAnswer({ reasoning: value })}
          />
          <AnswerPreview value={freeAnswer.reasoning ?? ""} />
        </div>
      ) : (
        <div className="homework-free-answer">
          <label>
            <span>Ta réponse</span>
            <input
              ref={finalInputRef}
              type="text"
              value={typeof answer?.answer === "string" ? answer.answer : freeAnswer.finalAnswer}
              disabled={disabled}
              autoComplete="off"
              placeholder="Écris ta réponse"
              onChange={(event) => onAnswer({ answer: event.currentTarget.value, attachmentUrls: [] })}
            />
          </label>
          {(question.answerKind === "formula" || question.answerKind === "number") && (
            <FormulaKeyboard
              inputRef={finalInputRef}
              value={typeof answer?.answer === "string" ? answer.answer : freeAnswer.finalAnswer ?? ""}
              onChange={(value) => onAnswer({ answer: value, attachmentUrls: [] })}
            />
          )}
        </div>
      )}

      {!question.isNeutralized && question.rubricCriteria && question.rubricCriteria.length > 0 && (
        <section className="homework-public-rubric" aria-label="Barème de cette question">
          <header><PencilLine size={18} weight="duotone" /><strong>Ce que le correcteur vérifiera</strong></header>
          <ul>
            {question.rubricCriteria.map((item) => (
              <li key={item.id}>
                <span><MathText>{item.label}</MathText></span>
                <strong>{pointLabel(item.pointsMax)} pt</strong>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
