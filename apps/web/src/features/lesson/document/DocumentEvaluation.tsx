import { ArrowCounterClockwise, CheckCircle, WarningCircle, XCircle } from "@phosphor-icons/react";
import { Fragment, useEffect, useId, useRef, useState } from "react";
import { MarkdownContent } from "../../../components/MarkdownContent";
import { MathText } from "../../../components/MathText";
import type { CourseDocument, CourseDocumentQuestion, CourseWorkedExample, CourseWrittenTask } from "../../../domain/courseDocument";
import { formatCourseScore } from "../courseCorrection";
import { DocumentFormulaKeyboard } from "./DocumentFormulaKeyboard";
import { DocumentCorrection } from "./DocumentCorrection";
import { WorkedExampleContent } from "./WorkedExampleContent";
import { DocumentNativeFigure } from "./DocumentNativeFigure";
import {
  documentAnswerLabel, documentAnswerStatus, documentAssessmentScore, documentDraftKey,
  emptyDocumentDraft, restoreDocumentDraft, type DocumentAnswer, type DocumentDraft,
} from "./documentAssessment";

function DocumentQuestion({ question, answer, submitted, onAnswer, onReview }: {
  question: CourseDocumentQuestion; answer?: DocumentAnswer; submitted: boolean;
  onAnswer: (answer: DocumentAnswer) => void; onReview: (id: string) => void;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const status = submitted ? documentAnswerStatus(question, answer) : null;
  const label = documentAnswerLabel(question, answer);
  const interval = typeof answer === "object" ? answer : { lower: "", upper: "" };
  const Icon = status === "correct" ? CheckCircle : status === "incorrect" ? XCircle : WarningCircle;
  return <article className={`document-question${status ? ` is-${status}` : ""}`} data-question-id={question.id}>
    <header><span>Question {question.label}</span><span>{question.points} {question.points > 1 ? "points" : "point"}</span></header>
    <p className="document-question-prompt"><MathText>{question.prompt}</MathText></p>
    {question.answer.kind === "interval" ? <fieldset className="document-interval-input">
      <legend>Ton encadrement</legend>
      <label><span>Borne inférieure</span><input aria-invalid={status === "incorrect" ? true : undefined} inputMode="decimal" type="text" value={interval.lower} maxLength={80} placeholder="Ex. : 0,1" onChange={event => onAnswer({ ...interval, lower: event.target.value })} /></label>
      <span aria-hidden="true">&lt; {question.answer.variable} &lt;</span>
      <label><span>Borne supérieure</span><input aria-invalid={status === "incorrect" ? true : undefined} inputMode="decimal" type="text" value={interval.upper} maxLength={80} placeholder="Ex. : 0,2" onChange={event => onAnswer({ ...interval, upper: event.target.value })} /></label>
    </fieldset> : <div className="document-short-input">
      <label htmlFor={id}>Ta réponse</label>
      <input id={id} ref={inputRef} type="text" value={typeof answer === "string" ? answer : ""} maxLength={500} autoComplete="off" placeholder="Ex. : 1, 0 ou −∞" aria-invalid={status === "incorrect" ? true : undefined} onChange={event => onAnswer(event.target.value)} />
      <DocumentFormulaKeyboard inputRef={inputRef} value={typeof answer === "string" ? answer : ""} onChange={onAnswer} />
    </div>}
    {status && <section className={`document-answer-feedback is-${status}`} aria-label={`Correction de la question ${question.label}`}>
      <strong><Icon size={21} weight="fill" aria-hidden="true" />{status === "correct" ? "Bonne réponse" : status === "incorrect" ? "Réponse incorrecte" : "Pas de réponse"}</strong>
      {label && <p className={status === "correct" ? "document-answer-correct" : "document-answer-wrong"}>
        <span>Ta réponse : </span>{status === "correct" ? <MathText>{label}</MathText> : <del><MathText>{label}</MathText></del>}
      </p>}
      {status !== "correct" && <p className="document-answer-expected"><span>Réponse attendue : </span><MathText>{question.expected}</MathText></p>}
    </section>}
    <DocumentCorrection>
      <div className="document-explained-correction"><MarkdownContent markdown={question.correction} /></div>
      <button className="document-rule-link" type="button" onClick={() => onReview(question.topicId)}>Revoir la règle du résumé →</button>
    </DocumentCorrection>
  </article>;
}

function WrittenTask({ task, value, onChange, onReview }: {
  task: CourseWrittenTask; value: string; onChange: (value: string) => void; onReview: (id: string) => void;
}) {
  const id = useId();
  return <article className="document-written-task" data-written-task-id={task.id}>
    <p className="document-small-label">Justification rédigée</p>
    <p className="document-question-prompt"><MathText>{task.prompt}</MathText></p>
    <label htmlFor={id}>Ton raisonnement</label>
    <textarea id={id} value={value} maxLength={10000} rows={6} placeholder="Explique tes étapes et justifie ta conclusion…" onChange={event => onChange(event.target.value)} />
    <p className="document-muted">Cette rédaction n’est pas notée automatiquement. Compare ton raisonnement au modèle ; elle n’entre pas dans la note des réponses courtes.</p>
    <DocumentCorrection><div className="document-writing-model">
      <MarkdownContent markdown={task.model} />
      {task.nativeFigure && <DocumentNativeFigure figure={task.nativeFigure}/>}
      <h4>Vérifie que ton raisonnement contient…</h4>
      <ul>{task.criteria.map(criterion => <li key={criterion}>{criterion}</li>)}</ul>
      <button className="document-rule-link" type="button" onClick={() => onReview(task.topicId)}>Revoir le théorème →</button>
    </div></DocumentCorrection>
  </article>;
}

function EvaluationExample({ example }: { example: CourseWorkedExample }) {
  return <section className="document-evaluation-example" data-evaluation-example-id={example.id}>
    <h4><MathText>{example.title}</MathText></h4>
    <p className="document-example-prompt"><MathText>{example.prompt}</MathText></p>
    <DocumentCorrection><WorkedExampleContent example={example} showPrompt={false} /></DocumentCorrection>
  </section>;
}

function scrollToQuestions() {
  window.requestAnimationFrame(() => window.document.querySelector(".document-evaluation")?.scrollIntoView({ behavior: "auto", block: "start" }));
}

export function DocumentEvaluation({ document, userId, pathId, onReview }: {
  document: CourseDocument; userId: string; pathId: string; onReview: (id: string) => void;
}) {
  const key = documentDraftKey(userId, pathId, document);
  const [draft, setDraft] = useState<DocumentDraft>(() => {
    try { return restoreDocumentDraft(window.localStorage.getItem(key), document); } catch { return emptyDocumentDraft(); }
  });
  const [onlyMistakes, setOnlyMistakes] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const resultRef = useRef<HTMLElement>(null);
  const questions = document.evaluations.flatMap(group => group.questions);
  const summary = documentAssessmentScore(questions, draft.answers);
  const [retryIds, setRetryIds] = useState<Set<string> | null>(null);
  const assessedQuestions = retryIds ? questions.filter(question => retryIds.has(question.id)) : questions;

  useEffect(() => {
    const save = () => {
      try { window.localStorage.setItem(key, JSON.stringify(draft)); setStorageAvailable(true); }
      catch { setStorageAvailable(false); }
    };
    const timeout = window.setTimeout(save, 250);
    window.addEventListener("pagehide", save);
    return () => {
      window.clearTimeout(timeout); window.removeEventListener("pagehide", save);
      try { window.localStorage.setItem(key, JSON.stringify(draft)); } catch { /* Optional draft only. */ }
    };
  }, [draft, key]);

  const updateAnswer = (id: string, answer: DocumentAnswer) => setDraft(current => ({ ...current, answers: { ...current.answers, [id]: answer }, submitted: false }));
  return <div className="document-evaluation">
    <header className="document-panel-intro">
      <h2>Questions d’évaluation</h2>
      {!storageAvailable && <p className="document-save-status" role="alert">Enregistrement local indisponible : garde cette page ouverte pour conserver tes réponses.</p>}
    </header>
    <form onSubmit={event => {
      event.preventDefault(); setDraft(current => ({ ...current, submitted: true })); setOnlyMistakes(false);
      window.requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "auto", block: "start" }));
    }}>
      {retryIds && <div className="document-retry-notice" role="status">Tu refais {assessedQuestions.length} question{assessedQuestions.length > 1 ? "s" : ""}. Les bonnes réponses précédentes sont conservées.<button type="button" onClick={() => setRetryIds(null)}>Tout afficher</button></div>}
      {document.evaluations.map((group, groupIndex) => <section className="document-evaluation-group" key={group.id} data-evaluation-group-id={group.id} aria-labelledby={`eval-${group.id}`}>
        <header><span className="document-small-label">Méthode {groupIndex + 1}</span><h3 id={`eval-${group.id}`}><MathText>{group.title}</MathText></h3></header>
        {!retryIds && <details className="document-method" open><summary>La méthode</summary><MarkdownContent markdown={group.method} /></details>}
        {!retryIds && <div className="document-worked-examples">{group.examples.map(example => <EvaluationExample key={example.id} example={example} />)}</div>}
        {group.statement && <div className="document-evaluation-statement"><MarkdownContent markdown={group.statement} /></div>}
        {group.writtenTasks?.filter(task => !task.beforeQuestionId).map(task => !retryIds && <WrittenTask key={task.id} task={task} value={draft.written[task.id] ?? ""} onChange={value => setDraft(current => ({ ...current, written: { ...current.written, [task.id]: value } }))} onReview={onReview} />)}
        <div className="document-question-list">{group.questions.filter(question => (!retryIds || retryIds.has(question.id)) && (!onlyMistakes || documentAnswerStatus(question, draft.answers[question.id]) !== "correct")).map(question =>
          <Fragment key={question.id}>
            {!retryIds && group.writtenTasks?.filter(task => task.beforeQuestionId === question.id).map(task => <WrittenTask key={task.id} task={task} value={draft.written[task.id] ?? ""} onChange={value => setDraft(current => ({ ...current, written: { ...current.written, [task.id]: value } }))} onReview={onReview} />)}
            <DocumentQuestion question={question} answer={draft.answers[question.id]} submitted={draft.submitted} onAnswer={answer => updateAnswer(question.id, answer)} onReview={onReview} />
          </Fragment>,
        )}</div>
      </section>)}
      {questions.length > 0 && <div className="document-validation">
        <button type="submit" className="document-primary-button">Valider mes réponses</button>
        <p>{questions.length} réponses courtes · {summary.possible} points ramenés sur 20 · rédaction non notée.</p>
      </div>}
    </form>
    {questions.length > 0 && draft.submitted && <section ref={resultRef} className="document-score" role="status" aria-label="Bilan des questions d’évaluation">
      <p className="document-small-label">Ton bilan</p>
      <div><strong>{formatCourseScore(summary.outOf20)} <small>/ 20</small></strong><span>{summary.percentage} %</span></div>
      <p>{summary.correct} bonne{summary.correct > 1 ? "s" : ""} réponse{summary.correct > 1 ? "s" : ""} sur {summary.total}. Note d’entraînement sur les réponses courtes uniquement.</p>
      {summary.correct < summary.total && <div className="document-result-actions">
        <button type="button" className="document-secondary-button" onClick={() => {
          setRetryIds(new Set(questions.filter(question => documentAnswerStatus(question, draft.answers[question.id]) !== "correct").map(question => question.id)));
          setDraft(current => ({ ...current, submitted: false })); setOnlyMistakes(false); scrollToQuestions();
        }}><ArrowCounterClockwise size={18} aria-hidden="true" />Refaire mes erreurs</button>
        <button type="button" aria-pressed={onlyMistakes} onClick={() => { setOnlyMistakes(current => !current); setRetryIds(null); scrollToQuestions(); }}>{onlyMistakes ? "Voir toutes les corrections" : "Voir seulement mes erreurs"}</button>
      </div>}
      <button type="button" className="document-reset-link" onClick={() => {
        if (!window.confirm("Effacer tes réponses courtes pour recommencer ? Ta rédaction sera conservée.")) return;
        setDraft(current => ({ ...current, answers: {}, submitted: false })); setRetryIds(null); setOnlyMistakes(false); scrollToQuestions();
      }}>Recommencer les questions</button>
    </section>}
  </div>;
}
