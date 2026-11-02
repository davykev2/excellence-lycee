import { ArrowDown, ArrowUp, DeviceMobile, Eye, FloppyDisk, Monitor, Plus, Trash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { MathText } from "../../../components/MathText";
import type { ArenaExerciseItem, ArenaExerciseLevelDocument, ArenaExerciseLevelPayload, ArenaExerciseQuestion, ArenaExerciseStatus } from "../../../domain/arenaExercises";
import { ExercisePlayer } from "./ExercisePlayer";

const freshExercise = (): ArenaExerciseItem => ({
  id: `exercise-${crypto.randomUUID()}`, title: "Nouvel exercice", statementMarkdown: "", correctionMarkdown: "",
});
function freshQuestion(index: number): ArenaExerciseQuestion {
  return { id: `q-${crypto.randomUUID()}`, label: `${index})`, prompt: "", explanation: "", points: 1, answer: { kind: "short", expected: "", accepted: [] } };
}
function QuestionEditor({ question, onChange, onRemove }: {
  question: ArenaExerciseQuestion; onChange: (update: Partial<ArenaExerciseQuestion>) => void; onRemove: () => void;
}) {
  const answer = question.answer;
  return <fieldset className="practice-edit-question">
    <legend>Question {question.label}</legend>
    <div className="practice-editor-question-meta">
      <label><span>Repère</span><input value={question.label} maxLength={100} onChange={event => onChange({ label: event.target.value })} /></label>
      <label><span>Type de réponse</span><select aria-label="Type de réponse" value={answer.kind} onChange={event => onChange({
        points: event.target.value === "written" ? 0 : 1,
        answer: event.target.value === "written" ? { kind: "written" }
          : event.target.value === "choice" ? { kind: "choice", options: ["Vrai", "Faux"], correctIndex: 0 }
          : { kind: "short", expected: "", accepted: [] },
      })}><option value="short">Réponse courte</option><option value="choice">Choix / Vrai ou Faux / Association</option><option value="written">Raisonnement rédigé</option></select></label>
    </div>
    <label><span>Question</span><textarea aria-label="Question" value={question.prompt} maxLength={6000} rows={3} onChange={event => onChange({ prompt: event.target.value })} /></label>
    {answer.kind === "short" && <>
      <label><span>Réponse attendue affichée à la correction</span><input value={answer.expected} maxLength={1000} onChange={event => onChange({ answer: { ...answer, expected: event.target.value } })} /></label>
      <label><span>Formes acceptées · une par ligne</span><textarea aria-label="Formes acceptées · une par ligne" value={answer.accepted.join("\n")} rows={3} onChange={event => onChange({ answer: { ...answer, accepted: event.target.value.split("\n") } })} /></label>
      <label><span>Comparaison</span><select aria-label="Comparaison" value={answer.comparison??"value"} onChange={event=>onChange({answer:{...answer,comparison:event.target.value==="literal"?"literal":event.target.value==="complex"?"complex":undefined}})}><option value="value">Valeur numérique ou texte</option><option value="literal">Écriture exacte · base de numération, code</option><option value="complex">Nombre complexe · formes équivalentes</option></select></label>
    </>}
    {answer.kind === "choice" && <>
      <label><span>Propositions · une par ligne</span><textarea aria-label="Propositions · une par ligne" value={answer.options.join("\n")} rows={4} onChange={event => onChange({ answer: { ...answer, options: event.target.value.split("\n") } })} /></label>
      <label><span>Bonne réponse</span><select aria-label="Bonne réponse" value={answer.correctIndex} onChange={event => onChange({ answer: { ...answer, correctIndex: Number(event.target.value) } })}>{answer.options.map((option, index) => <option key={index} value={index}>{index + 1} · {option.replace(/[$\\]/g, "")}</option>)}</select></label>
      <label><span>Présentation</span><select aria-label="Présentation" value={answer.display ?? "buttons"} onChange={event => onChange({ answer: { ...answer, display: event.target.value as "buttons" | "select" } })}><option value="buttons">Boutons de choix</option><option value="select">Liste déroulante / association</option></select></label>
    </>}
    {answer.kind !== "written" && <label><span>Points pour cette réponse objective</span><input type="number" min={0.25} max={100} step={0.25} value={question.points} onChange={event => onChange({ points: Number(event.target.value) })} /></label>}
    <label><span>Explication · la correction complète sera utilisée si ce champ reste vide</span><textarea aria-label="Explication de la réponse" value={question.explanation} maxLength={16000} rows={4} onChange={event => onChange({ explanation: event.target.value })} /></label>
    <button type="button" onClick={onRemove}><Trash size={16} />Retirer cette question</button>
  </fieldset>;
}

export function ExerciseEditor({ initial, documentId, canPublish, localOnly, onSave, onStatus, onSaved, onDirty }: {
  initial: ArenaExerciseLevelPayload; documentId?: string; canPublish: boolean; localOnly: boolean;
  onSave: (payload: ArenaExerciseLevelPayload, id?: string, note?: string) => Promise<ArenaExerciseLevelDocument>;
  onStatus: (id: string, status: ArenaExerciseStatus) => Promise<ArenaExerciseLevelDocument>;
  onSaved: (document: ArenaExerciseLevelDocument) => void; onDirty: (dirty: boolean) => void;
}) {
  const [payload, setPayload] = useState<ArenaExerciseLevelPayload>(() => structuredClone({ ...initial, exercises: initial.exercises.length ? initial.exercises : [freshExercise()] }));
  const [busy, setBusy] = useState(false), [dirty, setDirty] = useState(false), [error, setError] = useState("");
  const [previewMobile, setPreviewMobile] = useState(false), [pane, setPane] = useState<"edit" | "preview">("edit");
  useEffect(() => { onDirty(dirty); return () => onDirty(false); }, [dirty, onDirty]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const change = (update: Partial<ArenaExerciseLevelPayload>) => { setPayload(current => ({ ...current, ...update })); setDirty(true); };
  const updateExercise = (id: string, update: Partial<ArenaExerciseItem>) => change({ exercises: payload.exercises.map(exercise => exercise.id === id ? { ...exercise, ...update } : exercise) });
  const prepared = (): ArenaExerciseLevelPayload => ({
    ...payload, title: payload.title.trim(),
    exercises: payload.exercises.map(exercise => ({
      ...exercise,
      questions: exercise.questions?.length ? exercise.questions.map(question => ({
        ...question, explanation: question.explanation.trim() || exercise.correctionMarkdown,
        answer: question.answer.kind === "short" ? { ...question.answer, accepted: question.answer.accepted.map(value => value.trim()).filter(Boolean) } : question.answer,
      })) : undefined,
    })),
  });
  const validate = () => {
    if (payload.title.trim().length < 2) return "Donne un titre à la rubrique.";
    for (const [index, exercise] of prepared().exercises.entries()) {
      if (exercise.title.trim().length < 2 || !exercise.statementMarkdown.trim() || !exercise.correctionMarkdown.trim()) return `Complète le titre, l’énoncé et la correction de l’exercice ${index + 1}.`;
      for (const question of exercise.questions ?? []) {
        if (!question.label.trim() || !question.prompt.trim()) return `Complète l’énoncé de la question ${question.label}.`;
        if (question.answer.kind === "short" && (!question.answer.expected.trim() || !question.answer.accepted.length)) return `Renseigne la réponse attendue et les formes acceptées pour la question ${question.label}.`;
        if (question.answer.kind === "choice" && (question.answer.options.length < 2 || question.answer.options.length > 12 || question.answer.options.some(option => !option.trim()) || !question.answer.options[question.answer.correctIndex])) return `Vérifie les propositions et la bonne réponse de la question ${question.label}.`;
        if (question.answer.kind !== "written" && (!Number.isFinite(question.points) || question.points <= 0)) return "Le barème d’une réponse objective doit être strictement positif.";
      }
    }
    return "";
  };
  const save = async (nextStatus?: ArenaExerciseStatus) => {
    const issue = validate(); if (issue) { setError(issue); return; }
    setBusy(true); setError("");
    try {
      const saved = await onSave(prepared(), documentId, "Atelier · catégories et réponses interactives");
      const result = nextStatus ? await onStatus(saved.id, nextStatus) : saved;
      setDirty(false); onSaved(result);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "L’enregistrement n’a pas abouti."); }
    finally { setBusy(false); }
  };
  return <section className="practice-editor">
    {localOnly && <p className="practice-local-notice">Aperçu local : les essais de sauvegarde et de publication restent dans cette session de démonstration. Aucune donnée de production n’est modifiée.</p>}
    <div className="practice-editor-actions">
      <button type="button" disabled={busy} onClick={() => void save()}><FloppyDisk size={18} />{busy ? "Enregistrement…" : "Sauvegarder le brouillon"}</button>
      <button className="practice-primary-button" type="button" disabled={busy} onClick={() => void save(canPublish ? "published" : "review")}>{canPublish ? "Publier la rubrique" : "Envoyer en validation"}</button>
    </div>
    {error && <p className="practice-error" role="alert">{error}</p>}
    <div className="practice-editor-pane-toggle"><button type="button" aria-pressed={pane === "edit"} onClick={() => setPane("edit")}>Éditer</button><button type="button" aria-pressed={pane === "preview"} onClick={() => setPane("preview")}><Eye size={17} />Aperçu élève</button></div>
    <div className={`practice-editor-layout show-${pane}`}>
      <div className="practice-editor-form">
        <label><span>Titre de la rubrique</span><input value={payload.title} maxLength={180} placeholder="Ex. : Limites de référence" onChange={event => change({ title: event.target.value })} /></label>
        <label><span>Consigne générale facultative</span><textarea aria-label="Consigne générale facultative" value={payload.instructionsMarkdown} rows={3} maxLength={6000} onChange={event => change({ instructionsMarkdown: event.target.value })} /></label>
        {payload.exercises.map((exercise, index) => <section className="practice-edit-exercise" key={exercise.id}>
          <header><strong>Exercice {exercise.sourceNumber ?? index + 1}</strong><div>
            <button aria-label="Monter l’exercice" type="button" disabled={!index} onClick={() => { const list = [...payload.exercises]; [list[index - 1], list[index]] = [list[index], list[index - 1]]; change({ exercises: list }); }}><ArrowUp size={17} /></button>
            <button aria-label="Descendre l’exercice" type="button" disabled={index === payload.exercises.length - 1} onClick={() => { const list = [...payload.exercises]; [list[index], list[index + 1]] = [list[index + 1], list[index]]; change({ exercises: list }); }}><ArrowDown size={17} /></button>
            <button aria-label="Retirer l’exercice du brouillon" type="button" disabled={payload.exercises.length === 1} onClick={() => { if (window.confirm("Retirer cet exercice du brouillon ? La version publiée ne change pas avant une nouvelle publication.")) change({ exercises: payload.exercises.filter(item => item.id !== exercise.id) }); }}><Trash size={17} /></button>
          </div></header>
          <label><span>Numéro dans le document, facultatif</span><input type="number" min={1} max={9999} value={exercise.sourceNumber ?? ""} onChange={event => updateExercise(exercise.id, { sourceNumber: event.target.value ? Math.min(9999, Math.max(1, Number(event.target.value))) : undefined })} /></label>
          <label><span>Titre</span><input value={exercise.title} maxLength={160} onChange={event => updateExercise(exercise.id, { title: event.target.value })} /></label>
          <label><span>Énoncé · texte et formules</span><textarea aria-label="Énoncé · texte et formules" value={exercise.statementMarkdown} maxLength={25000} rows={7} onChange={event => updateExercise(exercise.id, { statementMarkdown: event.target.value })} /></label>
          <label><span>Correction complète et expliquée</span><textarea aria-label="Correction complète et expliquée" value={exercise.correctionMarkdown} maxLength={25000} rows={8} onChange={event => updateExercise(exercise.id, { correctionMarkdown: event.target.value })} /></label>
          <details className="practice-edit-questions"><summary>Questions interactives · {exercise.questions?.length ?? 0}</summary>
            <p>Sans questions définies, l’exercice propose une rédaction et une correction modèle, sans note automatique.</p>
            {exercise.questions?.map(question => <QuestionEditor key={question.id} question={question} onChange={update => updateExercise(exercise.id, { questions: exercise.questions?.map(item => item.id === question.id ? { ...item, ...update } : item) })} onRemove={() => updateExercise(exercise.id, { questions: exercise.questions?.filter(item => item.id !== question.id) })} />)}
            <button type="button" disabled={(exercise.questions?.length ?? 0) >= 60} onClick={() => updateExercise(exercise.id, { questions: [...(exercise.questions ?? []), freshQuestion((exercise.questions?.length ?? 0) + 1)] })}><Plus size={17} />Ajouter une question</button>
          </details>
        </section>)}
        <button type="button" className="practice-add-button" disabled={payload.exercises.length >= 30} onClick={() => change({ exercises: [...payload.exercises, freshExercise()] })}><Plus size={18} />Ajouter un exercice à la rubrique</button>
      </div>
      <aside className={`practice-editor-preview${previewMobile ? " is-mobile" : ""}`}>
        <header><strong>Aperçu en temps réel</strong><div><button type="button" aria-pressed={!previewMobile} onClick={() => setPreviewMobile(false)}><Monitor size={17} />PC</button><button type="button" aria-pressed={previewMobile} onClick={() => setPreviewMobile(true)}><DeviceMobile size={17} />Mobile</button></div></header>
        <div className="practice-preview-sheet"><h2><MathText>{payload.title || "Titre de la rubrique"}</MathText></h2>
          {payload.exercises.map((exercise, index) => <section key={exercise.id}><h3>Exercice {exercise.sourceNumber ?? index + 1} · <MathText>{exercise.title}</MathText></h3><ExercisePlayer key={exercise.id} exercise={{ ...exercise, questions: exercise.questions?.map(question => ({ ...question, explanation: question.explanation || exercise.correctionMarkdown })) }} userId="editor-preview" context="preview" preview /></section>)}
        </div>
      </aside>
    </div>
  </section>;
}
