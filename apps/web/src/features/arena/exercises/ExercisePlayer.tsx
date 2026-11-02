import { ArrowCounterClockwise, BookOpenText, CheckCircle, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";
import { MarkdownContent } from "../../../components/MarkdownContent";
import { MathText } from "../../../components/MathText";
import type { ArenaExerciseItem, ArenaExerciseQuestion } from "../../../domain/arenaExercises";
import { DocumentFormulaKeyboard } from "../../lesson/document/DocumentFormulaKeyboard";
import { ExerciseFigure } from "./ExerciseFigures";
import { exerciseAnswerStatus, exerciseAssessment, exerciseDraftKey, exerciseExpectedAnswer, restoreExerciseDraft } from "./exerciseAssessment";

function AnswerField({ question, value, onChange, submitted }: { question: ArenaExerciseQuestion; value: string; onChange: (value: string) => void; submitted: boolean }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const writing = useRef<HTMLTextAreaElement>(null);
  const state = submitted ? exerciseAnswerStatus(question, value) : null;
  const Icon = state === "correct" ? CheckCircle : state === "incorrect" ? XCircle : WarningCircle;
  const selected = question.answer.kind === "choice" && /^\d+$/.test(value) ? question.answer.options[Number(value)] ?? value : value;
  // Native option elements cannot render KaTeX. Keep mathematical choices in the rendered button group.
  const nativeSelect = question.answer.kind === "choice" && question.answer.display === "select" && question.answer.options.every(option => !/\$|\\\(|\\\[/.test(option));
  return <section className={`practice-question${state ? ` is-${state}` : ""}`} data-question-id={question.id}>
    <div className="practice-question-heading"><span>{question.label}</span><div><MathText>{question.prompt}</MathText></div></div>
    {question.answer.kind === "written"
      ? <div className="practice-written"><label htmlFor={id}>Ton raisonnement</label><textarea id={id} ref={writing} value={value} maxLength={10000} rows={5} onChange={event => onChange(event.target.value)} placeholder="Étapes et justifications…" /><DocumentFormulaKeyboard inputRef={writing} value={value} onChange={onChange} /></div>
      : question.answer.kind === "choice"
        ? nativeSelect
          ? <label className="practice-answer-field"><span>Ta réponse</span><select value={value} onChange={event => onChange(event.target.value)} aria-invalid={state === "incorrect" ? true : undefined}><option value="">Choisir une réponse</option>{question.answer.options.map((option,index) => <option key={index} value={String(index)}>{option}</option>)}</select></label>
          : <fieldset className="practice-answer-options"><legend>Ta réponse</legend>{question.answer.options.map((option,index) => <label className={value === String(index) ? "is-selected" : ""} key={index}><input type="radio" name={id} value={String(index)} checked={value === String(index)} onChange={() => onChange(String(index))} /><MathText>{option}</MathText></label>)}</fieldset>
        : <div className="practice-short-answer"><label htmlFor={id}>Ta réponse</label><input type="text" id={id} ref={input} value={value} maxLength={500} autoComplete="off" onChange={event => onChange(event.target.value)} placeholder="Ex. : 1/2, √3 ou −∞" aria-invalid={state === "incorrect" ? true : undefined} /><DocumentFormulaKeyboard inputRef={input} value={value} onChange={onChange} /></div>}
    {state && state !== "written" && <div className={`practice-answer-feedback is-${state}`} aria-label={`Correction de la question ${question.label}`}>
      <strong><Icon size={19} weight="fill" aria-hidden="true" />{state === "correct" ? "Bonne réponse" : state === "incorrect" ? "Réponse incorrecte" : "Pas de réponse"}</strong>
      {selected && <p className={state === "correct" ? "practice-correct" : "practice-wrong"}>Ta réponse : {state === "correct" ? <MathText>{selected}</MathText> : <del><MathText>{selected}</MathText></del>}</p>}
      {state !== "correct" && <p className="practice-expected">Réponse attendue : <MathText>{exerciseExpectedAnswer(question)}</MathText></p>}
    </div>}
  </section>;
}

export function ExercisePlayer({ exercise, userId, context, onReview, preview = false }: {
  exercise: ArenaExerciseItem; userId: string; context: string; onReview?: () => void; preview?: boolean;
}) {
  const key = exerciseDraftKey(userId, context, exercise.id);
  const [draft, setDraft] = useState(() => {
    try { return restoreExerciseDraft(preview ? null : localStorage.getItem(key), exercise); } catch { return restoreExerciseDraft(null, exercise); }
  });
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [correctionVisible, setCorrectionVisible] = useState(false);
  const correctionId = useId();
  const resultRef = useRef<HTMLElement>(null);
  const [retryIds, setRetryIds] = useState<Set<string> | null>(null);
  const result = exerciseAssessment(exercise, draft.answers);
  const hasWriting = exercise.questions?.some(question => question.answer.kind === "written");
  const questions = retryIds ? exercise.questions?.filter(question => question.answer.kind === "written" || retryIds.has(question.id)) : exercise.questions;
  useEffect(() => {
    if (preview) return;
    const save = () => { try { localStorage.setItem(key, JSON.stringify(draft)); setStorageAvailable(true); } catch { setStorageAvailable(false); } };
    const timer = window.setTimeout(save, 250);
    window.addEventListener("pagehide", save);
    return () => { clearTimeout(timer); window.removeEventListener("pagehide", save); try { localStorage.setItem(key, JSON.stringify(draft)); } catch { /* Optional local draft. */ } };
  }, [draft, key, preview]);
  return <div className="practice-player" data-exercise-id={exercise.id}>
    <MarkdownContent markdown={exercise.statementMarkdown} />
    <ExerciseFigure kind={exercise.figureKey} sourceNumber={exercise.sourceNumber} />
    {!preview && !storageAvailable && <p className="practice-save-status" role="alert">Enregistrement local indisponible : garde cette page ouverte pour conserver tes réponses.</p>}
    <form onSubmit={event => {
      event.preventDefault();
      if (!result.total) return;
      setDraft(current => ({ ...current, submitted: true })); setRetryIds(null);
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ block: "start", behavior: "auto" }));
    }}>
      {retryIds && <p className="practice-retry-notice" role="status">Reprise des réponses incorrectes<button type="button" onClick={() => setRetryIds(null)}>Tout afficher</button></p>}
      <div className="practice-question-list">{questions?.map(question => <AnswerField key={question.id} question={question} value={draft.answers[question.id] ?? ""} submitted={draft.submitted} onChange={value => setDraft(current => ({ ...current, answers: { ...current.answers, [question.id]: value.slice(0,question.answer.kind==="written"?10000:500) }, submitted: false }))} />)}</div>
      {(!hasWriting || !exercise.questions?.length) && <details className="practice-optional-reasoning"><summary>Mon brouillon et mes justifications</summary><label><span>Non noté automatiquement</span><textarea value={draft.reasoning} maxLength={10000} rows={5} onChange={event => setDraft(current => ({ ...current, reasoning: event.target.value }))} /></label></details>}
      {result.total > 0 && <button className="practice-primary-button" type="submit">Valider cet exercice</button>}
      {hasWriting && <p className="practice-muted">Rédaction non notée automatiquement.</p>}
    </form>
    {draft.submitted && result.total > 0 && <section ref={resultRef} className="practice-result" aria-label="Bilan de cet exercice" role="status">
      <p>Note d’entraînement · réponses objectives uniquement</p><strong>{String(result.outOf20).replace(".", ",")} <small>/20</small><span>{result.percentage} %</span></strong><p>{result.correct} bonne{result.correct > 1 ? "s" : ""} réponse{result.correct > 1 ? "s" : ""} sur {result.total}. {hasWriting && "La rédaction est à comparer au modèle, séparément."}</p>
      <div className="practice-result-actions">
        {result.total > result.correct && <button type="button" onClick={() => { setRetryIds(new Set((exercise.questions ?? []).filter(question => question.answer.kind !== "written" && exerciseAnswerStatus(question, draft.answers[question.id]) !== "correct").map(question => question.id))); setDraft(current => ({ ...current, submitted: false })); setCorrectionVisible(false); }}><ArrowCounterClockwise size={17} />Refaire mes erreurs</button>}
        {onReview && <button type="button" onClick={onReview}>Revoir la règle du cours</button>}
        <button type="button" onClick={() => { if (!preview && !window.confirm("Recommencer les réponses objectives ? Tes rédactions seront conservées.")) return; setDraft(current => ({ ...current, answers: Object.fromEntries((exercise.questions ?? []).filter(question => question.answer.kind === "written").map(question => [question.id, current.answers[question.id] ?? ""])), submitted: false })); setRetryIds(null); setCorrectionVisible(false); }}>Recommencer</button>
      </div>
    </section>}
    <button type="button" className="practice-correction-button" aria-expanded={correctionVisible} aria-controls={correctionId} onClick={() => setCorrectionVisible(visible => !visible)}><BookOpenText size={19} aria-hidden="true" />{correctionVisible ? "Masquer la correction" : "Voir la correction"}</button>
    <section id={correctionId} className="practice-full-correction" role="region" aria-label={`Correction détaillée de l’exercice ${exercise.sourceNumber ?? exercise.title}`} hidden={!correctionVisible}>
      {correctionVisible && <><h3>Correction détaillée</h3><MarkdownContent markdown={exercise.correctionMarkdown} />
        <ExerciseFigure kind={exercise.correctionFigureKey} sourceNumber={exercise.sourceNumber} />
        {exercise.reviewCriteria?.length ? <div className="practice-review-checklist"><h4>Pour relire ton raisonnement</h4>{exercise.reviewCriteria.map(criterion => <label key={criterion}><input type="checkbox" /><MathText>{criterion}</MathText></label>)}</div> : null}
        {onReview && !draft.submitted && <button type="button" className="practice-course-link" onClick={onReview}>Revoir la règle du cours</button>}
      </>}
    </section>
  </div>;
}
