import { ArrowLeft, NotePencil, Plus, WarningCircle } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MathText } from "../../components/MathText";
import { getCurriculumLessonTitles } from "../../data/curriculumCatalog";
import { loadExerciseCollection } from "../../data/exerciseCollections/loadExerciseCollection";
import { isSubjectAvailableForLevel, schoolLevels, subjects } from "../../data/programme";
import type { ArenaExerciseCollection, ArenaExerciseLevelPayload, ArenaExerciseSelection } from "../../domain/arenaExercises";
import type { LearnerProfile, SchoolLevel, SubjectDefinition, SubjectId } from "../../domain/learning";
import { ExerciseEditor } from "./exercises/ExerciseEditor";
import { ExerciseLibrary } from "./exercises/ExerciseLibrary";
import { exerciseCategories, exerciseLibrarySections } from "./exercises/exerciseLibraryModel";
import { useArenaExercises } from "./useArenaExercises";

export function ArenaExercisesPage({ userId, selection, onSelection, onReviewCourse, profile, level, subject, canEdit, canPublish, editorOpen, localOnly = false, onBackArena, onBackSubjects, onOpenEditor, onCloseEditor }: {
  userId: string; selection?: ArenaExerciseSelection; onSelection: (selection: ArenaExerciseSelection) => void;
  onReviewCourse: (pathId: string, topicId: string) => void;
  profile: LearnerProfile; level: SchoolLevel; subject: SubjectDefinition; canEdit: boolean; canPublish: boolean; editorOpen: boolean; localOnly?: boolean;
  onBackArena: () => void; onOpenEditor: () => void; onCloseEditor: () => void;
  onBackSubjects?: () => void;
}) {
  const [targetLevel, setTargetLevel] = useState(level.id);
  const [targetSubject, setTargetSubject] = useState<SubjectId>(subject.id);
  const [collection, setCollection] = useState<ArenaExerciseCollection | null>(null);
  const [collectionLoading, setCollectionLoading] = useState(true);
  const [collectionError, setCollectionError] = useState("");
  const [editing, setEditing] = useState<{ initial: ArenaExerciseLevelPayload; documentId?: string } | null>(null);
  const [editorDirty, setEditorDirty] = useState(false), [message, setMessage] = useState("");
  const onDirty = useCallback((dirty: boolean) => setEditorDirty(dirty), []);
  const levelId = editorOpen ? targetLevel : level.id;
  const subjectId = editorOpen ? targetSubject : subject.id;
  const availableSubjects = useMemo(() => Object.values(subjects).filter(item => isSubjectAvailableForLevel(item, levelId)), [levelId]);
  const lessons = useMemo(() => getCurriculumLessonTitles(levelId, subjectId), [levelId, subjectId]);
  const lesson = lessons.find(item => (item.pathId ?? item.id) === selection?.lessonKey) ?? lessons[0];
  const lessonKey = lesson?.pathId ?? lesson?.id ?? "";
  const category = selection?.category ?? "fixation";
  const currentSelection: ArenaExerciseSelection = { ...selection, lessonKey, category };
  const bank = useArenaExercises({ filters: { levelId, subjectId, lessonKey: lessonKey || undefined }, canEdit: editorOpen && canEdit, localOnly });
  const documents = bank.editorLevels.filter(item => item.levelId === levelId && item.subjectId === subjectId && item.lessonKey === lessonKey);
  const published = useMemo(() => bank.publishedLevels.filter(item => item.levelId === levelId && item.subjectId === subjectId && item.lessonKey === lessonKey), [bank.publishedLevels, levelId, subjectId, lessonKey]);
  const sections = useMemo(() => exerciseLibrarySections(collection, published), [collection, published]);
  const sectionPageRequested = !editorOpen && category === "fixation" && Boolean(selection?.sectionId);
  const currentSection = sectionPageRequested ? sections.find(item => item.category === "fixation" && item.id === selection?.sectionId) : undefined;
  useEffect(() => {
    let cancelled = false;
    setCollection(null); setCollectionLoading(true); setCollectionError(""); setEditing(null);
    loadExerciseCollection(levelId, subjectId, lessonKey)
      .then(value => { if (!cancelled) setCollection(value); })
      .catch(() => { if (!cancelled) setCollectionError("Le document d’exercices n’a pas pu être chargé. Actualise la page pour réessayer."); })
      .finally(() => { if (!cancelled) setCollectionLoading(false); });
    return () => { cancelled = true; };
  }, [levelId, subjectId, lessonKey]);
  useEffect(() => {
    if (!availableSubjects.some(item => item.id === targetSubject)) setTargetSubject(availableSubjects[0]?.id ?? "mathematics");
  }, [availableSubjects, targetSubject]);
  const mayLeave = () => !editorDirty || window.confirm("Quitter ce brouillon sans enregistrer les dernières modifications ?");
  const choose = (next: ArenaExerciseSelection) => { if (!mayLeave()) return; setEditing(null); setMessage(""); onSelection(next); };
  const nextStage = Math.max(0, ...documents.map(item => item.stageNumber), ...published.map(item => item.stageNumber)) + 1;
  const basePayload = (): ArenaExerciseLevelPayload => ({
    levelId, subjectId, lessonKey, lessonTitle: lesson?.title ?? "Leçon", category,
    // Compatibility storage slot only: classification uses category, never difficulty.
    difficulty: "easy", stageNumber: nextStage, title: "", instructionsMarkdown: "", exercises: [],
  });
  const editSource = (source: ArenaExerciseCollection["sections"][number]) => {
    if (!mayLeave()) return;
    const existing = documents.find(document => document.sourceSectionId === source.id && document.category === source.category);
    setMessage("");
    if (existing) setEditing({ initial: existing, documentId: existing.id });
    else setEditing({ initial: { ...basePayload(), category: source.category, title: source.title, sourceSectionId: source.id, courseTopicId: source.courseTopicId, exercises: structuredClone(source.exercises) } });
  };
  return <main className={`practice-page${editorOpen ? " is-editor" : ""}`}>
    <header className="practice-topbar">
      <button type="button" onClick={() => {
        if (sectionPageRequested) choose({ lessonKey, category: "fixation" });
        else if (mayLeave()) (editorOpen ? onCloseEditor : onBackSubjects ?? onBackArena)();
      }}><ArrowLeft size={19} />{editorOpen ? "Quitter l’atelier" : sectionPageRequested ? "Toutes les rubriques" : onBackSubjects ? "Les matières" : "M’entraîner"}</button>
      {canEdit && !editorOpen && <button type="button" onClick={onOpenEditor}><NotePencil size={18} />Alimenter la banque</button>}
    </header>
    <header className="practice-heading">
      <p>{editorOpen ? "Atelier pédagogique" : `${level.label} · ${subject.label}${sectionPageRequested ? " · Exercices de fixation" : ""}`}</p>
      <h1><MathText>{editorOpen ? "Créer et améliorer les exercices" : sectionPageRequested ? currentSection?.title ?? (collectionLoading ? "Chargement de la rubrique…" : "Rubrique indisponible") : "Exercices"}</MathText></h1>
      {sectionPageRequested && <p>{`${lesson?.title ?? "Leçon"}${currentSection ? ` · ${currentSection.exercises.length} exercice${currentSection.exercises.length > 1 ? "s" : ""}` : ""}`}</p>}
    </header>
    {!sectionPageRequested && <><section className="practice-target" aria-label="Choix de la leçon">
      {editorOpen && <>
        <label><span>Niveau et série</span><select value={targetLevel} onChange={event => { if (mayLeave()) { setTargetLevel(event.target.value); onSelection({ lessonKey: "", category }); } }}>{schoolLevels.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <label><span>Matière</span><select value={targetSubject} onChange={event => { if (mayLeave()) { setTargetSubject(event.target.value as SubjectId); onSelection({ lessonKey: "", category }); } }}>{availableSubjects.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      </>}
      <label className="practice-lesson-picker"><span>Leçon</span><select aria-label="Leçon" value={lessonKey} onChange={event => choose({ lessonKey: event.target.value, category })}>{lessons.map(item => <option key={item.id} value={item.pathId ?? item.id}>{String(item.sequence).padStart(2, "0")} — {item.title}</option>)}</select></label>
      {!editorOpen && <span className="practice-profile-context">Classe du compte : {profile.levelId === level.id ? level.label : profile.levelId}</span>}
    </section>
    <div className="practice-categories" role="tablist" aria-label="Catégories d’exercices">
      {exerciseCategories.map((item, index) => {
        const count = sections.filter(section => section.category === item.id).reduce((sum, section) => sum + section.exercises.length, 0);
        return <button id={`practice-tab-${item.id}`} aria-controls="practice-category-panel" role="tab" aria-selected={category === item.id} tabIndex={category === item.id ? 0 : -1} type="button" key={item.id}
          onClick={() => choose({ lessonKey, category: item.id })} onKeyDown={event => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            const next = event.key === "Home" ? 0 : event.key === "End" ? 2 : (index + (event.key === "ArrowRight" ? 1 : 2)) % 3;
            choose({ lessonKey, category: exerciseCategories[next].id });
            document.getElementById(`practice-tab-${exerciseCategories[next].id}`)?.focus();
          }}><strong>{item.label}</strong><span>{item.description}</span><small>{count} exercice{count > 1 ? "s" : ""}</small></button>;
      })}
    </div></>}
    {collectionError && <p className="practice-error" role="alert">{collectionError}</p>}
    {bank.error && <div className="practice-error" role="alert"><WarningCircle size={19} /><span>{bank.error} {collection ? "Les exercices du document restent accessibles." : ""}</span><button type="button" onClick={() => void bank.reload()}>Réessayer</button></div>}
    {message && <p className="practice-editor-message" role="status">{message}</p>}
    <div id="practice-category-panel" role={sectionPageRequested ? undefined : "tabpanel"} aria-labelledby={sectionPageRequested ? undefined : `practice-tab-${category}`}>
      {editorOpen ? <section className="practice-editor-workspace">
        <div className="practice-rubric-picker"><h2>Choisir une rubrique</h2><div>
          {documents.filter(item => item.category === category).map(item => <button key={item.id} type="button" aria-pressed={editing?.documentId === item.id} onClick={() => { if (mayLeave()) { setEditing({ initial: item, documentId: item.id }); setMessage(""); } }}>{item.title}<small>{item.status === "published" ? "Publiée" : item.status === "review" ? "À valider" : "Brouillon"}</small></button>)}
          {collection?.sections.filter(item => item.category === category && !documents.some(document => document.sourceSectionId === item.id)).map(item => <button type="button" key={item.id} onClick={() => editSource(item)}>{item.title}<small>Utiliser comme modèle · {item.exercises.length} exercices</small></button>)}
          <button type="button" disabled={nextStage > 99} onClick={() => { if (mayLeave()) { setEditing({ initial: basePayload() }); setMessage(""); } }}><Plus size={17} />Nouvelle rubrique</button>
        </div></div>
        {editing ? <ExerciseEditor key={`${editing.documentId ?? editing.initial.sourceSectionId ?? "new"}:${editing.initial.stageNumber}:${levelId}:${subjectId}:${lessonKey}`}
          initial={editing.initial} documentId={editing.documentId} canPublish={canPublish} localOnly={localOnly} onSave={bank.save} onStatus={bank.setStatus} onDirty={onDirty}
          onSaved={saved => { setEditing({ initial: saved, documentId: saved.id }); setMessage(saved.status === "published" ? "Rubrique publiée dans les exercices." : saved.status === "review" ? "Rubrique envoyée en validation." : "Brouillon enregistré."); }} />
          : null}
      </section>
        : collectionLoading || (!collection && bank.loading) ? <p className="practice-loading" role="status">Chargement des exercices…</p>
          : <ExerciseLibrary sections={sections} selection={currentSelection} onSelection={onSelection} userId={userId} lessonKey={lessonKey} subjectId={subjectId} onReviewCourse={onReviewCourse} />}
    </div>
  </main>;
}
