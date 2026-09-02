import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BookOpenText,
  Check,
  CheckCircle,
  ClipboardText,
  Eye,
  FloppyDisk,
  Lightbulb,
  LockKey,
  Monitor,
  NotePencil,
  Plus,
  RocketLaunch,
  Sparkle,
  DeviceMobile,
  Trash,
  WarningCircle,
} from "@phosphor-icons/react";
import { MarkdownContent } from "../../components/MarkdownContent";
import { getCurriculumLessonTitles, type CurriculumLessonTitle } from "../../data/curriculumCatalog";
import { isSubjectAvailableForLevel, schoolLevels, subjects } from "../../data/programme";
import type {
  ArenaExerciseDifficulty,
  ArenaExerciseItem,
  ArenaExerciseLevelDocument,
  ArenaExerciseLevelPayload,
  ArenaExerciseStatus,
  PublishedArenaExerciseLevel,
} from "../../domain/arenaExercises";
import type { LearnerProfile, SchoolLevel, SubjectDefinition, SubjectId } from "../../domain/learning";
import { useArenaExercises } from "./useArenaExercises";

const difficulties: Array<{
  id: ArenaExerciseDifficulty;
  label: string;
  description: string;
  tone: string;
}> = [
  { id: "easy", label: "Facile", description: "Comprendre et appliquer directement", tone: "green" },
  { id: "medium", label: "Moyen", description: "Combiner plusieurs notions", tone: "orange" },
  { id: "hard", label: "Difficile", description: "Raisonner comme en examen", tone: "navy" },
];

const statusLabels: Record<ArenaExerciseStatus, string> = {
  draft: "Brouillon",
  review: "À valider",
  published: "Publié",
};

function exerciseId() {
  return crypto.randomUUID();
}

function emptyExercise(index = 1): ArenaExerciseItem {
  return {
    id: exerciseId(),
    title: `Exercice ${index}`,
    statementMarkdown: "",
    correctionMarkdown: "",
  };
}

function lessonKey(lesson: CurriculumLessonTitle) {
  return lesson.pathId ?? lesson.id;
}

function difficultyLabel(difficulty: ArenaExerciseDifficulty) {
  return difficulties.find((item) => item.id === difficulty)?.label ?? difficulty;
}

function levelSummary(level: Pick<PublishedArenaExerciseLevel, "instructionsMarkdown" | "exercises">) {
  const plainText = level.instructionsMarkdown
    .replace(/\$([^$]+)\$/g, "$1")
    .replace(/[#*_`>\\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const fallback = `${level.exercises.length} exercice${level.exercises.length > 1 ? "s" : ""} avec des corrections détaillées.`;
  return plainText.length > 165 ? `${plainText.slice(0, 162).trim()}…` : plainText || fallback;
}

type ArenaExerciseSeries = Pick<
  PublishedArenaExerciseLevel,
  "id" | "stageNumber" | "title" | "instructionsMarkdown" | "exercises"
>;

function ArenaSeriesList({
  series,
  onSelect,
  preview = false,
}: {
  series: ArenaExerciseSeries[];
  onSelect?: (series: ArenaExerciseSeries) => void;
  preview?: boolean;
}) {
  const orderedSeries = [...series].sort((left, right) => left.stageNumber - right.stageNumber);
  return (
    <section className={`arena-series-list ${preview ? "is-editor-preview" : ""}`} aria-label={preview ? "Aperçu de la liste des séries" : "Séries d’exercices disponibles"}>
      {!preview && (
        <header className="arena-series-list__header">
          <div><p>Séries disponibles</p><h2>Travaille à ton rythme</h2></div>
          <span>{orderedSeries.length} série{orderedSeries.length > 1 ? "s" : ""}</span>
        </header>
      )}
      <ol>
        {orderedSeries.map((item) => {
          const titleId = `arena-series-title-${item.id}`;
          return (
            <li key={item.id}>
              <article className="arena-series-card" aria-labelledby={titleId}>
                <div className="arena-series-card__meta">
                  <span>Série {String(item.stageNumber).padStart(2, "0")}</span>
                  <span>{item.exercises.length} exercice{item.exercises.length > 1 ? "s" : ""}</span>
                </div>
                <h3 id={titleId}>{item.title}</h3>
                <p>{levelSummary(item)}</p>
                <div className="arena-series-card__footer">
                  <span>Correction détaillée pour chaque exercice</span>
                  {onSelect
                    ? <button className="arena-series-card__open" type="button" onClick={() => onSelect(item)}>Ouvrir la série</button>
                    : <strong>Aperçu</strong>}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-CI", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function ExerciseLevelPlayer({ level, onClose }: { level: PublishedArenaExerciseLevel; onClose: () => void }) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const toggleCorrection = (exerciseIdValue: string) => {
    setRevealed((current) => {
      const next = new Set(current);
      if (next.has(exerciseIdValue)) next.delete(exerciseIdValue);
      else next.add(exerciseIdValue);
      return next;
    });
  };

  return (
    <section className="arena-exercise-player" aria-labelledby="arena-exercise-player-title">
      <header>
        <button type="button" onClick={onClose}><ArrowLeft size={18} weight="bold" />Toutes les séries</button>
        <div><span>{difficultyLabel(level.difficulty)} • Série {level.stageNumber}</span><h2 id="arena-exercise-player-title">{level.title}</h2></div>
        <strong>{level.exercises.length} exercice{level.exercises.length > 1 ? "s" : ""}</strong>
      </header>
      {level.instructionsMarkdown && <div className="arena-level-instructions"><Lightbulb size={21} weight="duotone" /><MarkdownContent markdown={level.instructionsMarkdown} /></div>}
      <div className="arena-player-exercises">
        {level.exercises.map((exercise, index) => {
          const correctionVisible = revealed.has(exercise.id);
          const correctionId = `arena-correction-${level.id}-${exercise.id}`;
          return (
            <article key={exercise.id}>
              <div className="arena-player-exercise-heading"><span>{index + 1}</span><h3>{exercise.title}</h3></div>
              <div className="arena-player-statement"><MarkdownContent markdown={exercise.statementMarkdown} preserveLineBreaks /></div>
              <button className="arena-correction-toggle" type="button" onClick={() => toggleCorrection(exercise.id)} aria-expanded={correctionVisible} aria-controls={correctionId}>
                <Eye size={18} weight={correctionVisible ? "fill" : "duotone"} />
                {correctionVisible ? "Masquer la correction" : "Afficher la correction"}
              </button>
              <div className="arena-player-correction" id={correctionId} role="region" aria-label={`Correction de ${exercise.title}`} hidden={!correctionVisible}><strong><Check size={18} weight="bold" />Correction expliquée</strong><MarkdownContent markdown={exercise.correctionMarkdown} preserveLineBreaks /></div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ExerciseLibrary({
  levels,
  difficulty,
  loading,
  error,
  onReload,
}: {
  levels: PublishedArenaExerciseLevel[];
  difficulty: ArenaExerciseDifficulty;
  loading: boolean;
  error: string | null;
  onReload: () => void;
}) {
  const [activeLevel, setActiveLevel] = useState<PublishedArenaExerciseLevel | null>(null);
  const visibleLevels = levels
    .filter((level) => level.difficulty === difficulty)
    .sort((left, right) => left.stageNumber - right.stageNumber);

  useEffect(() => { setActiveLevel(null); }, [difficulty, levels]);
  if (activeLevel) return <ExerciseLevelPlayer level={activeLevel} onClose={() => setActiveLevel(null)} />;
  if (loading) return <div className="arena-bank-feedback" role="status"><span />Chargement des exercices…</div>;
  if (error) return <div className="arena-bank-feedback is-error" role="alert"><WarningCircle size={22} /><span>{error}</span><button type="button" onClick={onReload}>Réessayer</button></div>;
  if (!visibleLevels.length) {
    return (
      <div className="arena-bank-empty">
        <BookOpenText size={42} weight="duotone" />
        <h3>Aucune série publiée pour le moment</h3>
        <p>L’équipe pédagogique est en train d’alimenter cette partie. Reviens bientôt.</p>
      </div>
    );
  }
  return <ArenaSeriesList series={visibleLevels} onSelect={(item) => setActiveLevel(item as PublishedArenaExerciseLevel)} />;
}

interface ExerciseEditorProps {
  document?: ArenaExerciseLevelDocument;
  series: ArenaExerciseSeries[];
  target: {
    levelId: string;
    subjectId: SubjectId;
    lesson: CurriculumLessonTitle;
    difficulty: ArenaExerciseDifficulty;
    stageNumber: number;
  };
  canPublish: boolean;
  onSave: (payload: ArenaExerciseLevelPayload, documentId?: string, note?: string) => Promise<ArenaExerciseLevelDocument>;
  onSetStatus: (documentId: string, status: ArenaExerciseStatus) => Promise<ArenaExerciseLevelDocument>;
  onSaved: (document: ArenaExerciseLevelDocument) => void;
}

function ExerciseEditor({ document, series, target, canPublish, onSave, onSetStatus, onSaved }: ExerciseEditorProps) {
  const [title, setTitle] = useState("");
  const [instructionsMarkdown, setInstructionsMarkdown] = useState("");
  const [exercises, setExercises] = useState<ArenaExerciseItem[]>([emptyExercise()]);
  const [documentId, setDocumentId] = useState<string | undefined>();
  const [status, setStatus] = useState<ArenaExerciseStatus>("draft");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewMode, setPreviewMode] = useState<"list" | "content">("list");

  useEffect(() => {
    setDocumentId(document?.id);
    setStatus(document?.status ?? "draft");
    setTitle(document?.title ?? `${difficultyLabel(target.difficulty)} • Série ${target.stageNumber}`);
    setInstructionsMarkdown(document?.instructionsMarkdown ?? "Résous les exercices dans l’ordre, puis consulte les corrections pour comprendre tes erreurs.");
    setExercises(document?.exercises.length ? document.exercises : [emptyExercise()]);
    setError(null);
    setMessage(null);
  }, [document?.id, target.difficulty, target.lesson.id, target.levelId, target.stageNumber, target.subjectId]);

  const updateExercise = (exerciseIdValue: string, patch: Partial<ArenaExerciseItem>) => {
    setExercises((current) => current.map((exercise) => exercise.id === exerciseIdValue ? { ...exercise, ...patch } : exercise));
  };

  const addExercise = () => setExercises((current) => [...current, emptyExercise(current.length + 1)]);
  const removeExercise = (exerciseIdValue: string) => {
    setExercises((current) => current.length === 1 ? [emptyExercise()] : current.filter((exercise) => exercise.id !== exerciseIdValue));
  };
  const moveExercise = (index: number, direction: -1 | 1) => {
    setExercises((current) => {
      const destination = index + direction;
      if (destination < 0 || destination >= current.length) return current;
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
  };

  const seriesPreview = useMemo<ArenaExerciseSeries[]>(() => {
    const otherSeries = series
      .filter((item) => item.stageNumber !== target.stageNumber)
      .map((item) => ({ ...item }));
    return [...otherSeries, {
      id: documentId ?? `arena-editor-preview-${target.stageNumber}`,
      stageNumber: target.stageNumber,
      title: title || `Série ${target.stageNumber}`,
      instructionsMarkdown,
      exercises,
    }].sort((left, right) => left.stageNumber - right.stageNumber);
  }, [documentId, exercises, instructionsMarkdown, series, target.stageNumber, title]);

  const payload = (): ArenaExerciseLevelPayload => ({
    levelId: target.levelId,
    subjectId: target.subjectId,
    lessonKey: lessonKey(target.lesson),
    lessonTitle: target.lesson.title,
    difficulty: target.difficulty,
    stageNumber: target.stageNumber,
    title: title.trim(),
    instructionsMarkdown: instructionsMarkdown.trim(),
    exercises: exercises.map((exercise) => ({
      ...exercise,
      title: exercise.title.trim(),
      statementMarkdown: exercise.statementMarkdown.trim(),
      correctionMarkdown: exercise.correctionMarkdown.trim(),
    })),
  });

  const validate = () => {
    if (title.trim().length < 2) return "Donne un titre à cette série.";
    const incomplete = exercises.findIndex((exercise) => exercise.title.trim().length < 2 || !exercise.statementMarkdown.trim() || !exercise.correctionMarkdown.trim());
    return incomplete >= 0 ? `Complète le titre, l’énoncé et la correction de l’exercice ${incomplete + 1}.` : null;
  };

  const saveDraft = async () => {
    const issue = validate();
    if (issue) { setError(issue); return null; }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const saved = await onSave(payload(), documentId, "Mise à jour depuis l’atelier de l’Arène");
      setDocumentId(saved.id);
      setStatus(saved.status);
      onSaved(saved);
      setMessage(`Brouillon enregistré • version ${saved.draftVersion}`);
      return saved;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Le brouillon n’a pas pu être enregistré.");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (nextStatus: ArenaExerciseStatus) => {
    const saved = await saveDraft();
    if (!saved) return;
    setSaving(true);
    try {
      const updated = await onSetStatus(saved.id, nextStatus);
      setStatus(updated.status);
      onSaved(updated);
      setMessage(nextStatus === "published" ? "Série publiée dans l’Arène." : "Série envoyée à l’administrateur pour validation.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Le statut n’a pas pu être modifié.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="arena-editor-shell">
      <header className="arena-editor-header">
        <div><span className={`arena-editor-status is-${status}`}>{statusLabels[status]}</span><div><small>{target.lesson.title}</small><strong>{difficultyLabel(target.difficulty)} • Série {target.stageNumber}</strong></div></div>
        <div className="arena-editor-actions">
          <button type="button" onClick={() => void saveDraft()} disabled={saving}><FloppyDisk size={18} weight="duotone" />{saving ? "Enregistrement…" : "Sauvegarder"}</button>
          {status !== "review" && !canPublish && <button className="is-review" type="button" onClick={() => void changeStatus("review")} disabled={saving}><CheckCircle size={18} />Envoyer en validation</button>}
          {canPublish && <button className="is-publish" type="button" onClick={() => void changeStatus("published")} disabled={saving}><RocketLaunch size={18} weight="fill" />Publier</button>}
        </div>
      </header>

      <div className="arena-editor-view-toggle" aria-label="Vue de l’atelier">
        <button aria-pressed={mobileView === "edit"} className={mobileView === "edit" ? "is-active" : ""} type="button" onClick={() => setMobileView("edit")}><NotePencil size={17} />Éditeur</button>
        <button aria-pressed={mobileView === "preview"} className={mobileView === "preview" ? "is-active" : ""} type="button" onClick={() => setMobileView("preview")}><Eye size={17} />Aperçu</button>
      </div>

      {(message || error) && <div className={`arena-editor-message ${error ? "is-error" : ""}`} role={error ? "alert" : "status"}>{error ? <WarningCircle size={19} /> : <CheckCircle size={19} weight="fill" />}<span>{error ?? message}</span></div>}

      <div className={`arena-editor-layout show-${mobileView}`}>
        <div className="arena-editor-form">
          <section className="arena-editor-card">
            <div className="arena-editor-card-title"><span>1</span><div><strong>Présentation de la série</strong><small>Ce que l’élève verra avant les exercices</small></div></div>
            <label><span>Titre de la série</span><input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={180} placeholder="Ex. Applications directes" /></label>
            <label><span>Consigne générale <small>Markdown et formules LaTeX détectés automatiquement</small></span><textarea value={instructionsMarkdown} onChange={(event) => setInstructionsMarkdown(event.target.value)} rows={4} placeholder="Explique brièvement comment aborder cette série…" /></label>
          </section>

          <section className="arena-editor-card">
            <div className="arena-editor-card-title"><span>2</span><div><strong>Exercices de la série</strong><small>Colle les énoncés et leurs corrections</small></div><b>{exercises.length}</b></div>
            <div className="arena-editor-exercise-list">
              {exercises.map((exercise, index) => (
                <article key={exercise.id}>
                  <header><span>{index + 1}</span><strong>{exercise.title || `Exercice ${index + 1}`}</strong><div><button type="button" aria-label="Monter l’exercice" disabled={index === 0} onClick={() => moveExercise(index, -1)}><ArrowUp size={15} /></button><button type="button" aria-label="Descendre l’exercice" disabled={index === exercises.length - 1} onClick={() => moveExercise(index, 1)}><ArrowDown size={15} /></button><button className="is-delete" type="button" aria-label="Supprimer l’exercice" onClick={() => removeExercise(exercise.id)}><Trash size={15} /></button></div></header>
                  <label><span>Titre</span><input value={exercise.title} onChange={(event) => updateExercise(exercise.id, { title: event.target.value })} maxLength={160} /></label>
                  <label><span>Énoncé <small>Colle le texte et les formules directement</small></span><textarea value={exercise.statementMarkdown} onChange={(event) => updateExercise(exercise.id, { statementMarkdown: event.target.value })} rows={7} placeholder={"## Situation\n\nÉcris l’énoncé complet. Les commandes LaTeX comme \\frac ou \\lim sont détectées."} /></label>
                  <label><span>Correction expliquée</span><textarea value={exercise.correctionMarkdown} onChange={(event) => updateExercise(exercise.id, { correctionMarkdown: event.target.value })} rows={7} placeholder={"## Correction\n\n1. Première étape…\n2. Calcul…\n\n**Réponse :** ..."} /></label>
                </article>
              ))}
            </div>
            <button className="arena-add-exercise" type="button" onClick={addExercise}><Plus size={18} weight="bold" />Ajouter un exercice à cette série</button>
          </section>
        </div>

        <aside className={`arena-editor-preview is-${previewDevice}-device`}>
          <div className="arena-preview-browser">
            <div className="arena-preview-lights" aria-hidden="true"><i /><i /><i /></div>
            <span>Aperçu élève • actualisé instantanément</span>
            <div className="arena-preview-device-toggle" aria-label="Format de l’aperçu">
              <button type="button" aria-pressed={previewDevice === "desktop"} className={previewDevice === "desktop" ? "is-active" : ""} onClick={() => setPreviewDevice("desktop")}><Monitor size={15} weight="duotone" />Ordinateur</button>
              <button type="button" aria-pressed={previewDevice === "mobile"} className={previewDevice === "mobile" ? "is-active" : ""} onClick={() => setPreviewDevice("mobile")}><DeviceMobile size={15} weight="duotone" />Mobile</button>
            </div>
          </div>
          <div className="arena-preview-mode-toggle" aria-label="Type d’aperçu">
            <button type="button" aria-pressed={previewMode === "list"} className={previewMode === "list" ? "is-active" : ""} onClick={() => setPreviewMode("list")}><ClipboardText size={16} weight="duotone" />Liste des séries</button>
            <button type="button" aria-pressed={previewMode === "content"} className={previewMode === "content" ? "is-active" : ""} onClick={() => setPreviewMode("content")}><BookOpenText size={16} weight="duotone" />Contenu de la série</button>
          </div>
          {previewMode === "list"
            ? <div className="arena-editor-series-preview"><ArenaSeriesList series={seriesPreview} preview /></div>
            : <article className="arena-preview-sheet">
                <header><p>{difficultyLabel(target.difficulty)} • Série {target.stageNumber}</p><h2>{title || "Titre de la série"}</h2><span>{target.lesson.title}</span></header>
                <div className="arena-preview-instructions"><MarkdownContent markdown={instructionsMarkdown} emptyState={<p>La consigne apparaîtra ici.</p>} /></div>
                <div className="arena-preview-exercises">
                  {exercises.map((exercise, index) => (
                    <section key={exercise.id}>
                      <div><span>{index + 1}</span><h3>{exercise.title || `Exercice ${index + 1}`}</h3></div>
                      <MarkdownContent markdown={exercise.statementMarkdown} preserveLineBreaks emptyState={<p className="is-empty">L’énoncé apparaîtra ici pendant la saisie.</p>} />
                      <details open><summary>Correction (visible dans l’aperçu)</summary><MarkdownContent markdown={exercise.correctionMarkdown} preserveLineBreaks emptyState={<p className="is-empty">La correction apparaîtra ici.</p>} /></details>
                    </section>
                  ))}
                </div>
              </article>}
        </aside>
      </div>
    </section>
  );
}

export function ArenaExercisesPage({
  profile,
  level,
  subject,
  canEdit,
  canPublish,
  editorOpen,
  localOnly = false,
  onBackArena,
  onOpenEditor,
  onCloseEditor,
}: {
  profile: LearnerProfile;
  level: SchoolLevel;
  subject: SubjectDefinition;
  canEdit: boolean;
  canPublish: boolean;
  editorOpen: boolean;
  localOnly?: boolean;
  onBackArena: () => void;
  onOpenEditor: () => void;
  onCloseEditor: () => void;
}) {
  const [selectedLevelId, setSelectedLevelId] = useState(level.id);
  const editorSubjects = useMemo(
    () => Object.values(subjects).filter((item) => isSubjectAvailableForLevel(item, selectedLevelId)),
    [selectedLevelId],
  );
  const initialSubjectId = editorOpen && editorSubjects.some((item) => item.id === subject.id) ? subject.id : "mathematics";
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>(initialSubjectId);
  const lessons = useMemo(() => getCurriculumLessonTitles(selectedLevelId, selectedSubjectId), [selectedLevelId, selectedSubjectId]);
  const [selectedLessonKey, setSelectedLessonKey] = useState("");
  const [difficulty, setDifficulty] = useState<ArenaExerciseDifficulty>("easy");
  const [stageNumber, setStageNumber] = useState(1);

  useEffect(() => {
    if (!editorOpen) {
      setSelectedLevelId(level.id);
      setSelectedSubjectId(subject.id);
    }
  }, [editorOpen, level.id, subject.id]);

  useEffect(() => {
    if (!editorSubjects.some((item) => item.id === selectedSubjectId)) setSelectedSubjectId(editorSubjects[0]?.id ?? "mathematics");
  }, [editorSubjects, selectedSubjectId]);

  useEffect(() => {
    if (!lessons.some((lesson) => lessonKey(lesson) === selectedLessonKey)) setSelectedLessonKey(lessons[0] ? lessonKey(lessons[0]) : "");
  }, [lessons, selectedLessonKey]);

  const selectedLesson = lessons.find((lesson) => lessonKey(lesson) === selectedLessonKey) ?? lessons[0];
  const exerciseData = useArenaExercises({
    filters: { levelId: selectedLevelId, subjectId: selectedSubjectId, lessonKey: selectedLesson ? lessonKey(selectedLesson) : undefined },
    canEdit,
    localOnly,
  });

  const allTargetDocuments = exerciseData.editorLevels.filter((document) =>
    document.levelId === selectedLevelId
    && document.subjectId === selectedSubjectId
    && document.lessonKey === selectedLessonKey
  );
  const targetDocuments = allTargetDocuments.filter((document) => document.difficulty === difficulty);
  const selectedDocument = targetDocuments.find((document) => document.stageNumber === stageNumber);
  const publishedDifficultyLevels = exerciseData.publishedLevels.filter((item) => item.difficulty === difficulty);
  const nextStage = Math.max(
    0,
    ...targetDocuments.map((document) => document.stageNumber),
    ...publishedDifficultyLevels.map((document) => document.stageNumber),
  ) + 1;
  const seriesByStage = new Map<number, ArenaExerciseSeries>();
  publishedDifficultyLevels.forEach((item) => seriesByStage.set(item.stageNumber, item));
  targetDocuments.forEach((item) => seriesByStage.set(item.stageNumber, {
    id: item.id,
    stageNumber: item.stageNumber,
    title: item.title,
    instructionsMarkdown: item.instructionsMarkdown,
    exercises: item.exercises,
  }));
  const seriesPreviewSources = [...seriesByStage.values()];

  useEffect(() => { setStageNumber(1); }, [difficulty, selectedLessonKey, selectedLevelId, selectedSubjectId]);

  const selectLevel = (nextLevelId: string) => {
    setSelectedLevelId(nextLevelId);
    setSelectedLessonKey("");
  };
  const selectSubject = (nextSubjectId: SubjectId) => {
    setSelectedSubjectId(nextSubjectId);
    setSelectedLessonKey("");
  };

  return (
    <main className={`arena-exercises-page ${editorOpen ? "is-editor" : ""}`}>
      <header className="arena-exercises-topbar">
        <button type="button" onClick={editorOpen ? onCloseEditor : onBackArena}><ArrowLeft size={19} weight="bold" />{editorOpen ? "Quitter l’atelier" : "Retour à l’Arène"}</button>
        <div><p>{editorOpen ? "Atelier pédagogique" : "Entraînement libre"}</p><h1>{editorOpen ? "Créer des exercices" : "Exercices"}</h1></div>
        {canEdit && !editorOpen && <button className="arena-editor-entry" type="button" onClick={onOpenEditor}><NotePencil size={19} weight="duotone" />Alimenter la banque</button>}
        {editorOpen && <span className="arena-editor-secure"><LockKey size={17} weight="duotone" />Accès contributeur</span>}
      </header>

      <section className="arena-exercise-target" aria-labelledby="arena-target-title">
        <div className="arena-target-heading"><span><ClipboardText size={25} weight="duotone" /></span><div><p>{editorOpen ? "1. Choisir la destination" : `Exercices adaptés à ${profile.name.split(" ")[0]}`}</p><h2 id="arena-target-title">{editorOpen ? "Où veux-tu ajouter ces exercices ?" : "Choisis une leçon"}</h2></div></div>
        <div className="arena-target-fields">
          <label><span>Niveau et série</span><select value={selectedLevelId} disabled={!editorOpen} onChange={(event) => selectLevel(event.target.value)}>{schoolLevels.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
          <label><span>Matière</span><select value={selectedSubjectId} disabled={!editorOpen} onChange={(event) => selectSubject(event.target.value as SubjectId)}>{(editorOpen ? editorSubjects : [subject]).map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
          <label className="is-lesson"><span>Leçon</span><select value={selectedLessonKey} onChange={(event) => setSelectedLessonKey(event.target.value)}>{lessons.map((lesson) => <option value={lessonKey(lesson)} key={lesson.id}>{String(lesson.sequence).padStart(2, "0")} — {lesson.title}</option>)}</select></label>
        </div>
      </section>

      {selectedLesson ? (
        <>
          <section className="arena-difficulty-section" aria-labelledby="arena-difficulty-title">
            <div><p>{editorOpen ? "2. Classer les séries" : "Choisis une difficulté"}</p><h2 id="arena-difficulty-title">Niveau de difficulté</h2></div>
            <div className="arena-difficulty-tabs" aria-label="Difficulté des exercices">
              {difficulties.map((item) => {
                const publishedCount = exerciseData.publishedLevels.filter((levelItem) => levelItem.difficulty === item.id).length;
                const draftCount = allTargetDocuments.filter((levelItem) => levelItem.difficulty === item.id).length;
                return <button type="button" aria-pressed={difficulty === item.id} className={`is-${item.tone} ${difficulty === item.id ? "is-active" : ""}`} key={item.id} onClick={() => setDifficulty(item.id)}><span>{item.label}</span><small>{item.description}</small><b>{editorOpen ? `${draftCount} série${draftCount > 1 ? "s" : ""}` : `${publishedCount} série${publishedCount > 1 ? "s" : ""}`}</b></button>;
              })}
            </div>
          </section>

          {editorOpen ? (
            <>
              <section className="arena-stage-picker">
                <div><span>3</span><div><strong>Choisis la série à modifier</strong><small>Tu peux ajouter autant de séries que nécessaire dans chaque difficulté.</small></div></div>
                <div className="arena-stage-buttons">
                  {targetDocuments.sort((left, right) => left.stageNumber - right.stageNumber).map((document) => <button className={stageNumber === document.stageNumber ? "is-active" : ""} type="button" key={document.id} onClick={() => setStageNumber(document.stageNumber)}><span>Série {document.stageNumber}</span><i className={`is-${document.status}`} />{statusLabels[document.status]}</button>)}
                  <button className={`is-new ${stageNumber === nextStage ? "is-active" : ""}`} type="button" onClick={() => setStageNumber(nextStage)}><Plus size={17} weight="bold" />Nouvelle série {nextStage}</button>
                </div>
              </section>
              <ExerciseEditor
                key={`${selectedLevelId}-${selectedSubjectId}-${selectedLessonKey}-${difficulty}-${stageNumber}-${selectedDocument?.id ?? "new"}`}
                document={selectedDocument}
                series={seriesPreviewSources}
                target={{ levelId: selectedLevelId, subjectId: selectedSubjectId, lesson: selectedLesson, difficulty, stageNumber }}
                canPublish={canPublish}
                onSave={exerciseData.save}
                onSetStatus={exerciseData.setStatus}
                onSaved={(saved) => setStageNumber(saved.stageNumber)}
              />
            </>
          ) : (
            <ExerciseLibrary levels={exerciseData.publishedLevels} difficulty={difficulty} loading={exerciseData.loading} error={exerciseData.error} onReload={() => void exerciseData.reload()} />
          )}
        </>
      ) : (
        <div className="arena-bank-empty"><Sparkle size={40} weight="duotone" /><h3>Aucune leçon disponible</h3><p>Cette combinaison niveau, série et matière n’a pas encore de programme enregistré.</p></div>
      )}
    </main>
  );
}
