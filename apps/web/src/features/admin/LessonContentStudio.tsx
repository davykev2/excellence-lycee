import {
  ArrowLeft,
  BookOpenText,
  Check,
  CheckCircle,
  ClockCounterClockwise,
  CloudArrowUp,
  Eye,
  FloppyDisk,
  ImageSquare,
  ListBullets,
  MagnifyingGlass,
  Plus,
  Quotes,
  RocketLaunch,
  TextB,
  TextHTwo,
  Trash,
  VideoCamera,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MarkdownContent } from "../../components/MarkdownContent";
import { MathText } from "../../components/MathText";
import type {
  LessonContentDocument,
  LessonContentPayload,
  LessonContentRevision,
  LessonContentStatus,
} from "../../domain/content";
import type { LearningLesson, LearningPath, LessonQuestion } from "../../domain/paths";
import type { SubjectId } from "../../domain/learning";
import { learningPaths } from "../../data/learningPaths";
import { schoolLevels, subjects } from "../../data/programme";

interface LessonEntry {
  key: string;
  path: LearningPath;
  lesson: LearningLesson;
  levelIds: string[];
  levelNumber: number;
}

interface LessonContentStudioProps {
  contents: LessonContentDocument[];
  loading: boolean;
  error: string | null;
  onReload: () => Promise<void>;
  onSave: (pathId: string, lessonId: string, payload: LessonContentPayload, note?: string) => Promise<LessonContentDocument>;
  onSetStatus: (documentId: string, status: LessonContentStatus, unpublish?: boolean) => Promise<LessonContentDocument>;
  onLoadRevisions: (documentId: string) => Promise<LessonContentRevision[]>;
  onRestoreRevision: (documentId: string, revisionId: string) => Promise<LessonContentDocument>;
  onClose: () => void;
  onNotify: (message: string) => void;
}

const statusLabels: Record<LessonContentStatus, string> = {
  draft: "Brouillon",
  review: "À valider",
  published: "Publié",
};

const lessonEntries: LessonEntry[] = learningPaths.flatMap((path) => {
  let levelNumber = 0;
  return path.modules.flatMap((module) => module.lessons.map((lesson) => ({
    key: `${path.id}:${lesson.id}`,
    path,
    lesson,
    levelIds: path.levelIds,
    levelNumber: ++levelNumber,
  })));
});

function sourcePayload(lesson: LearningLesson): LessonContentPayload {
  return {
    title: lesson.title,
    summary: lesson.summary,
    eyebrow: lesson.concept.eyebrow,
    bodyMarkdown: lesson.concept.bodyMarkdown ?? lesson.concept.explanation,
    keyPoint: lesson.concept.notation,
    example: lesson.concept.example,
    questions: (lesson.questions?.length ? lesson.questions : [lesson.question]).map((question) => ({
      ...question,
      options: [...question.options],
      acceptedAnswers: question.acceptedAnswers ? [...question.acceptedAnswers] : undefined,
    })),
    source: lesson.source ? { ...lesson.source, corrections: [...lesson.source.corrections] } : undefined,
  };
}

function documentPayload(document: LessonContentDocument): LessonContentPayload {
  return {
    title: document.title,
    summary: document.summary,
    eyebrow: document.eyebrow,
    bodyMarkdown: document.bodyMarkdown,
    keyPoint: document.keyPoint,
    example: document.example,
    questions: document.questions.map((question) => ({
      ...question,
      options: [...question.options],
      acceptedAnswers: question.acceptedAnswers ? [...question.acceptedAnswers] : undefined,
    })),
    source: document.source ? { ...document.source, corrections: [...document.source.corrections] } : undefined,
  };
}

function formatDate(value?: string) {
  if (!value) return "Jamais";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function emptyQuestion(index: number): LessonQuestion {
  return {
    type: "choice",
    prompt: `Nouvelle question ${index + 1}`,
    options: ["Bonne réponse", "Proposition B", "Proposition C", "Proposition D"],
    correctIndex: 0,
    points: 1,
    explanation: "Explique ici pourquoi cette réponse est correcte.",
  };
}

export function LessonContentStudio({
  contents,
  loading,
  error,
  onReload,
  onSave,
  onSetStatus,
  onLoadRevisions,
  onRestoreRevision,
  onClose,
  onNotify,
}: LessonContentStudioProps) {
  const [subjectId, setSubjectId] = useState<SubjectId>("svt");
  const [levelId, setLevelId] = useState("terminale-a");
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<LessonContentPayload | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"split" | "edit" | "preview">("split");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [revisions, setRevisions] = useState<LessonContentRevision[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const selectionRef = useRef(selectedKey);

  const filteredEntries = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fr");
    return lessonEntries.filter((entry) => (
      entry.path.subjectId === subjectId
      && entry.levelIds.includes(levelId)
      && (!normalized || `${entry.path.title} ${entry.lesson.title}`.toLocaleLowerCase("fr").includes(normalized))
    ));
  }, [levelId, query, subjectId]);

  const selectedEntry = lessonEntries.find((entry) => entry.key === selectedKey) ?? null;
  const currentDocument = selectedEntry
    ? contents.find((content) => content.pathId === selectedEntry.path.id && content.lessonId === selectedEntry.lesson.id)
    : undefined;

  useEffect(() => {
    if (selectedKey && filteredEntries.some((entry) => entry.key === selectedKey)) return;
    setSelectedKey(filteredEntries[0]?.key ?? null);
  }, [filteredEntries, selectedKey]);

  useEffect(() => {
    selectionRef.current = selectedKey;
    if (!selectedEntry) {
      setDraft(null);
      setDirty(false);
      return;
    }
    setDraft(currentDocument ? documentPayload(currentDocument) : sourcePayload(selectedEntry.lesson));
    setDirty(false);
    setSaveError(null);
    setHistoryOpen(false);
  }, [currentDocument?.id, selectedKey]);

  const updateDraft = (patch: Partial<LessonContentPayload>) => {
    setDraft((current) => current ? { ...current, ...patch } : current);
    setDirty(true);
    setSaveError(null);
  };

  const updateQuestion = (index: number, patch: Partial<LessonQuestion>) => {
    if (!draft) return;
    updateDraft({
      questions: draft.questions.map((question, questionIndex) => questionIndex === index ? { ...question, ...patch } : question),
    });
  };

  const updateSource = (patch: Partial<NonNullable<LessonContentPayload["source"]>>) => {
    if (!draft) return;
    const current = draft.source ?? {
      documentTitle: "Document source",
      pages: "À renseigner",
      section: "À renseigner",
      fidelity: "faithful-corrected" as const,
      corrections: [],
    };
    updateDraft({ source: { ...current, ...patch } });
  };

  const validationIssues = useMemo(() => {
    if (!draft) return ["Sélectionne un niveau."];
    const issues: string[] = [];
    if (draft.title.trim().length < 2) issues.push("Ajoute un titre.");
    if (draft.summary.trim().length < 5) issues.push("Ajoute un résumé d’au moins 5 caractères.");
    if (!draft.bodyMarkdown.trim()) issues.push("Le corps du cours est vide.");
    if (draft.keyPoint.trim().length < 3) issues.push("Ajoute l’essentiel à retenir.");
    if (draft.example.trim().length < 3) issues.push("Ajoute un exemple.");
    if (!draft.questions.length) issues.push("Ajoute au moins un exercice.");
    draft.questions.forEach((question, index) => {
      if (question.prompt.trim().length < 3) issues.push(`La question ${index + 1} est incomplète.`);
      if (question.type === "short-answer" && !question.acceptedAnswers?.some((answer) => answer.trim())) issues.push(`La question ${index + 1} doit avoir une réponse acceptée.`);
      if (question.type !== "short-answer" && (question.options.length < 2 || question.options.some((option) => !option.trim()) || question.correctIndex >= question.options.length)) issues.push(`La question ${index + 1} doit avoir de 2 à 6 propositions et une bonne réponse.`);
      if (!question.explanation.trim()) issues.push(`Ajoute l’explication de la question ${index + 1}.`);
    });
    return issues;
  }, [draft]);

  const persist = async (note = "Sauvegarde automatique") => {
    if (!draft || !selectedEntry || saving || validationIssues.length) return currentDocument;
    const requestedKey = selectedEntry.key;
    setSaving(true);
    setSaveError(null);
    try {
      const saved = await onSave(selectedEntry.path.id, selectedEntry.lesson.id, draft, note);
      if (selectionRef.current === requestedKey) setDirty(false);
      return saved;
    } catch (reason) {
      if (selectionRef.current === requestedKey) {
        setSaveError(reason instanceof Error ? reason.message : "La sauvegarde a échoué.");
      }
      return undefined;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!dirty || saving || validationIssues.length) return;
    const timer = window.setTimeout(() => { void persist(); }, 1800);
    return () => window.clearTimeout(timer);
  }, [dirty, draft, saving, selectedKey, validationIssues.length]);

  const chooseEntry = async (entry: LessonEntry) => {
    if (entry.key === selectedKey) return;
    if (dirty && !validationIssues.length) await persist("Sauvegarde avant changement de niveau");
    setSelectedKey(entry.key);
  };

  const changeStatus = async (status: LessonContentStatus, unpublish = false) => {
    if (!selectedEntry || !draft || validationIssues.length) return;
    const saved = dirty || !currentDocument ? await persist("Point de contrôle avant changement de statut") : currentDocument;
    if (!saved) return;
    setSaving(true);
    setSaveError(null);
    try {
      await onSetStatus(saved.id, status, unpublish);
      onNotify(status === "published" ? "La nouvelle version est publiée pour les élèves." : status === "review" ? "Le contenu est envoyé en validation." : unpublish ? "Le contenu est dépublié." : "Le contenu repasse en brouillon.");
    } catch (reason) {
      setSaveError(reason instanceof Error ? reason.message : "Le statut n’a pas pu être modifié.");
    } finally {
      setSaving(false);
    }
  };

  const openHistory = async () => {
    if (!currentDocument) return;
    setHistoryOpen(true);
    setHistoryLoading(true);
    try {
      setRevisions(await onLoadRevisions(currentDocument.id));
    } catch (reason) {
      setSaveError(reason instanceof Error ? reason.message : "L’historique est indisponible.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const restore = async (revision: LessonContentRevision) => {
    if (!currentDocument) return;
    setHistoryLoading(true);
    try {
      const restored = await onRestoreRevision(currentDocument.id, revision.id);
      setDraft(documentPayload(restored));
      setDirty(false);
      setHistoryOpen(false);
      onNotify(`Version ${revision.version} restaurée dans un nouveau brouillon.`);
    } catch (reason) {
      setSaveError(reason instanceof Error ? reason.message : "La restauration a échoué.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const insertMarkup = (prefix: string, suffix = "", placeholder = "texte") => {
    if (!draft) return;
    const textarea = bodyRef.current;
    const start = textarea?.selectionStart ?? draft.bodyMarkdown.length;
    const end = textarea?.selectionEnd ?? start;
    const selected = draft.bodyMarkdown.slice(start, end) || placeholder;
    const value = `${draft.bodyMarkdown.slice(0, start)}${prefix}${selected}${suffix}${draft.bodyMarkdown.slice(end)}`;
    updateDraft({ bodyMarkdown: value });
    window.requestAnimationFrame(() => {
      textarea?.focus();
      const cursor = start + prefix.length + selected.length + suffix.length;
      textarea?.setSelectionRange(cursor, cursor);
    });
  };

  const wordCount = draft?.bodyMarkdown.trim() ? draft.bodyMarkdown.trim().split(/\s+/).length : 0;
  const status = currentDocument?.status ?? "draft";
  const publishedIsOlder = Boolean(currentDocument?.hasPublishedVersion && currentDocument.publishedVersion !== currentDocument.draftVersion);

  return (
    <section className="content-studio" aria-label="Studio de création de cours">
      <header className="content-studio-header">
        <div>
          <button type="button" onClick={onClose}><ArrowLeft size={19} weight="bold" /> Retour aux contenus</button>
          <span>Studio éditorial</span>
          <strong>{selectedEntry?.lesson.title ?? "Choisir un niveau"}</strong>
        </div>
        <div className="content-studio-save-state" aria-live="polite">
          {saving ? <><CloudArrowUp size={20} className="is-spinning" /> Enregistrement…</>
            : saveError ? <><WarningCircle size={20} /> Non enregistré</>
              : dirty ? <><span className="is-dot" /> Modifications en attente</>
                : <><CheckCircle size={20} weight="fill" /> Tout est enregistré</>}
        </div>
        <div className="content-studio-actions">
          <button type="button" onClick={() => void openHistory()} disabled={!currentDocument || saving}><ClockCounterClockwise size={19} /> Historique</button>
          <button type="button" onClick={() => void persist("Sauvegarde manuelle")} disabled={!dirty || saving || Boolean(validationIssues.length)}><FloppyDisk size={19} /> Enregistrer</button>
          {status === "draft" && <button type="button" onClick={() => void changeStatus("review")} disabled={saving || Boolean(validationIssues.length)}>Envoyer en validation</button>}
          {status === "review" && <button className="is-primary" type="button" onClick={() => void changeStatus("published")} disabled={saving || Boolean(validationIssues.length)}><RocketLaunch size={19} /> Publier</button>}
          {status === "published" && <button type="button" onClick={() => void changeStatus("draft", true)} disabled={saving}>Dépublier</button>}
        </div>
      </header>

      <div className="content-studio-layout">
        <aside className="content-studio-library">
          <div className="content-studio-library-heading"><BookOpenText size={23} weight="duotone" /><div><strong>Programme</strong><small>{lessonEntries.length} niveaux éditables</small></div></div>
          <label><span>Matière</span><select value={subjectId} onChange={(event) => setSubjectId(event.target.value as SubjectId)}>{Object.values(subjects).filter((subject) => lessonEntries.some((entry) => entry.path.subjectId === subject.id)).map((subject) => <option key={subject.id} value={subject.id}>{subject.label}</option>)}</select></label>
          <label><span>Niveau et série</span><select value={levelId} onChange={(event) => setLevelId(event.target.value)}>{schoolLevels.filter((level) => lessonEntries.some((entry) => entry.levelIds.includes(level.id))).map((level) => <option key={level.id} value={level.id}>{level.label}</option>)}</select></label>
          <label className="content-studio-search"><MagnifyingGlass size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une leçon…" /></label>
          <div className="content-studio-lesson-list">
            {filteredEntries.map((entry) => {
              const document = contents.find((content) => content.pathId === entry.path.id && content.lessonId === entry.lesson.id);
              return (
                <button type="button" className={entry.key === selectedKey ? "is-active" : ""} key={entry.key} onClick={() => void chooseEntry(entry)}>
                  <span>{entry.path.chapterNumber}.{entry.levelNumber}</span>
                  <div><small>{entry.path.title}</small><strong>{entry.lesson.title}</strong></div>
                  <i className={`is-${document?.status ?? "source"}`} title={document ? statusLabels[document.status] : "Contenu source"} />
                </button>
              );
            })}
            {!loading && !filteredEntries.length && <p>Aucun niveau ne correspond aux filtres.</p>}
            {loading && <p>Chargement des brouillons…</p>}
            {error && <div className="content-studio-error"><span>{error}</span><button type="button" onClick={() => void onReload()}>Réessayer</button></div>}
          </div>
        </aside>

        {draft && selectedEntry ? (
          <div className="content-studio-workspace">
            <div className="content-studio-meta">
              <div><span className={`admin-status is-${status}`}>{statusLabels[status]}</span>{currentDocument?.hasPublishedVersion && <span className="content-live-badge"><Eye size={16} /> Version {currentDocument.publishedVersion} visible</span>}{publishedIsOlder && <span className="content-changes-badge">Modifications non publiées</span>}</div>
              <small>Version de travail {currentDocument?.draftVersion ?? 0} • dernière sauvegarde {formatDate(currentDocument?.updatedAt)}</small>
            </div>
            <div className="content-studio-view-toggle" aria-label="Mode d’affichage">
              <button className={previewMode === "edit" ? "is-active" : ""} type="button" onClick={() => setPreviewMode("edit")}>Éditeur</button>
              <button className={previewMode === "split" ? "is-active" : ""} type="button" onClick={() => setPreviewMode("split")}>Côte à côte</button>
              <button className={previewMode === "preview" ? "is-active" : ""} type="button" onClick={() => setPreviewMode("preview")}>Aperçu</button>
            </div>

            <div className={`content-studio-split is-${previewMode}`}>
              {previewMode !== "preview" && (
                <div className="content-editor-pane">
                  <section className="content-editor-section">
                    <header><span>1</span><div><strong>Présentation</strong><small>Ce que l’élève voit dans le parcours</small></div></header>
                    <label><span>Titre du niveau</span><input value={draft.title} onChange={(event) => updateDraft({ title: event.target.value })} /></label>
                    <label><span>Résumé</span><textarea rows={2} value={draft.summary} onChange={(event) => updateDraft({ summary: event.target.value })} /></label>
                    <label><span>Libellé supérieur</span><input value={draft.eyebrow} onChange={(event) => updateDraft({ eyebrow: event.target.value })} /></label>
                  </section>

                  <section className="content-editor-section is-body">
                    <header><span>2</span><div><strong>Corps du cours</strong><small>Colle ton texte puis structure-le simplement</small></div><b>{wordCount} mots • ~{Math.max(1, Math.ceil(wordCount / 180))} min</b></header>
                    <div className="content-markdown-toolbar" aria-label="Mise en forme du cours">
                      <button type="button" title="Sous-titre" onClick={() => insertMarkup("## ", "", "Sous-titre")}><TextHTwo size={18} /> Titre</button>
                      <button type="button" title="Gras" onClick={() => insertMarkup("**", "**", "important")}><TextB size={18} /> Gras</button>
                      <button type="button" title="Liste" onClick={() => insertMarkup("- ", "", "élément de liste")}><ListBullets size={18} /> Liste</button>
                      <button type="button" title="Citation ou remarque" onClick={() => insertMarkup("> ", "", "Remarque importante")}><Quotes size={18} /> Encadré</button>
                      <button type="button" title="Formule KaTeX" onClick={() => insertMarkup("$", "$", "x^2 + y^2")}><span>∑</span> Formule</button>
                      <button type="button" title="Image par URL" onClick={() => insertMarkup("![", "](https://exemple.com/image.jpg)", "Description de l’image")}><ImageSquare size={18} /> Image</button>
                      <button type="button" title="Vidéo MP4 ou WebM par URL" onClick={() => insertMarkup("@[video](", ")", "https://exemple.com/video.mp4")}><VideoCamera size={18} /> Vidéo</button>
                    </div>
                    <textarea ref={bodyRef} className="content-main-textarea" value={draft.bodyMarkdown} onChange={(event) => updateDraft({ bodyMarkdown: event.target.value })} placeholder="Colle ici le contenu du cours…\n\n## Un sous-titre\n- Une idée essentielle\n- Un exemple\n\n> Une remarque importante" />
                    <p>Syntaxe acceptée : titres <code>##</code>, listes <code>-</code>, gras <code>**texte**</code>, liens, formules <code>$...$</code>, images et vidéos par URL.</p>
                  </section>

                  <section className="content-editor-section">
                    <header><span>3</span><div><strong>Mémorisation</strong><small>L’essentiel et l’exemple guidé</small></div></header>
                    <label><span>À retenir</span><textarea rows={3} value={draft.keyPoint} onChange={(event) => updateDraft({ keyPoint: event.target.value })} /></label>
                    <label><span>Exemple</span><textarea rows={4} value={draft.example} onChange={(event) => updateDraft({ example: event.target.value })} /></label>
                  </section>

                  <section className="content-editor-section is-source">
                    <header><span>4</span><div><strong>Fidélité à la source</strong><small>Référence du PDF et corrections pédagogiques traçables</small></div><b className={`content-fidelity is-${draft.source?.fidelity ?? "adapted"}`}>{draft.source?.fidelity === "faithful-corrected" ? "Fidèle et corrigé" : draft.source?.fidelity === "faithful" ? "Fidèle" : "Adapté"}</b></header>
                    <label><span>Document source</span><input value={draft.source?.documentTitle ?? ""} onChange={(event) => updateSource({ documentTitle: event.target.value })} placeholder="Titre du PDF" /></label>
                    <div className="content-source-grid">
                      <label><span>Pages</span><input value={draft.source?.pages ?? ""} onChange={(event) => updateSource({ pages: event.target.value })} placeholder="Ex. 2-3" /></label>
                      <label><span>Section d’origine</span><input value={draft.source?.section ?? ""} onChange={(event) => updateSource({ section: event.target.value })} placeholder="Ex. I-1" /></label>
                    </div>
                    <label><span>Niveau de fidélité</span><select value={draft.source?.fidelity ?? "adapted"} onChange={(event) => updateSource({ fidelity: event.target.value as NonNullable<LessonContentPayload["source"]>["fidelity"] })}><option value="faithful">Fidèle au document</option><option value="faithful-corrected">Fidèle avec corrections signalées</option><option value="adapted">Adaptation pédagogique</option></select></label>
                    <label><span>Corrections apportées, une par ligne</span><textarea rows={3} value={draft.source?.corrections.join("\n") ?? ""} onChange={(event) => updateSource({ corrections: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) })} placeholder="Ex. Signe de la limite corrigé conformément au calcul." /></label>
                  </section>

                  <section className="content-editor-section is-questions">
                    <header><span>5</span><div><strong>Exercices du niveau</strong><small>Énoncés fidèles, réponses courtes ou choix multiples</small></div><button type="button" onClick={() => updateDraft({ questions: [...draft.questions, emptyQuestion(draft.questions.length)] })} disabled={draft.questions.length >= 20}><Plus size={17} /> Ajouter</button></header>
                    {draft.questions.map((question, questionIndex) => (
                      <article key={`question-${questionIndex}`}>
                        <div><strong>Question {questionIndex + 1}</strong>{draft.questions.length > 1 && <button type="button" onClick={() => updateDraft({ questions: draft.questions.filter((_, index) => index !== questionIndex) })} aria-label={`Supprimer la question ${questionIndex + 1}`}><Trash size={17} /></button>}</div>
                        <div className="content-source-grid">
                          <label><span>Type de réponse</span><select value={question.type ?? "choice"} onChange={(event) => updateQuestion(questionIndex, event.target.value === "short-answer" ? { type: "short-answer", options: [], correctIndex: 0, acceptedAnswers: question.acceptedAnswers?.length ? question.acceptedAnswers : [""] } : { type: "choice", options: question.options.length >= 2 ? question.options : ["Bonne réponse", "Autre réponse"], correctIndex: 0, acceptedAnswers: undefined })}><option value="choice">Choix / vrai-faux</option><option value="short-answer">Réponse courte</option></select></label>
                          <label><span>Référence dans le PDF</span><input value={question.sourceLabel ?? ""} onChange={(event) => updateQuestion(questionIndex, { sourceLabel: event.target.value })} placeholder="Exercice de fixation 1" /></label>
                        </div>
                        <label><span>Énoncé</span><textarea rows={2} value={question.prompt} onChange={(event) => updateQuestion(questionIndex, { prompt: event.target.value })} /></label>
                        {question.type === "short-answer" ? <label><span>Réponses acceptées, une par ligne</span><textarea rows={3} value={question.acceptedAnswers?.join("\n") ?? ""} onChange={(event) => updateQuestion(questionIndex, { acceptedAnswers: event.target.value.split("\n") })} placeholder="Résultat attendu\nAutre écriture équivalente" /></label> : <div className="content-question-options">
                          {question.options.map((option, optionIndex) => (
                            <label key={`option-${optionIndex}`} className={question.correctIndex === optionIndex ? "is-correct" : ""}>
                              <input type="radio" name={`correct-${questionIndex}`} checked={question.correctIndex === optionIndex} onChange={() => updateQuestion(questionIndex, { correctIndex: optionIndex })} />
                              <span>{String.fromCharCode(65 + optionIndex)}</span>
                              <input value={option} onChange={(event) => updateQuestion(questionIndex, { options: question.options.map((item, index) => index === optionIndex ? event.target.value : item) })} />
                              {question.options.length > 2 && <button type="button" onClick={() => updateQuestion(questionIndex, { options: question.options.filter((_, index) => index !== optionIndex), correctIndex: question.correctIndex === optionIndex ? 0 : question.correctIndex > optionIndex ? question.correctIndex - 1 : question.correctIndex })} aria-label={`Supprimer la proposition ${optionIndex + 1}`}><X size={15} /></button>}
                            </label>
                          ))}
                          {question.options.length < 6 && <button className="content-add-option" type="button" onClick={() => updateQuestion(questionIndex, { options: [...question.options, `Proposition ${String.fromCharCode(65 + question.options.length)}`] })}><Plus size={15} /> Ajouter une proposition</button>}
                        </div>}
                        <label><span>Poids dans la note</span><input type="number" min={1} max={20} value={question.points ?? 1} onChange={(event) => updateQuestion(questionIndex, { points: Math.max(1, Number(event.target.value) || 1) })} /></label>
                        <label><span>Explication de la correction</span><textarea rows={2} value={question.explanation} onChange={(event) => updateQuestion(questionIndex, { explanation: event.target.value })} /></label>
                      </article>
                    ))}
                  </section>

                  <section className={`content-quality-check ${validationIssues.length ? "has-issues" : "is-ready"}`}>
                    {validationIssues.length ? <WarningCircle size={24} /> : <CheckCircle size={24} weight="fill" />}
                    <div><strong>{validationIssues.length ? `${validationIssues.length} point${validationIssues.length > 1 ? "s" : ""} à corriger` : "Contenu prêt à publier"}</strong>{validationIssues.length ? <ul>{validationIssues.map((issue) => <li key={issue}>{issue}</li>)}</ul> : <p>Tous les champs indispensables et les exercices sont complets.</p>}</div>
                  </section>
                  {saveError && <p className="content-studio-save-error" role="alert">{saveError}</p>}
                </div>
              )}

              {previewMode !== "edit" && (
                <aside className="content-preview-pane">
                  <div className="content-preview-device"><span /><span /><span /><b>Aperçu élève • instantané</b></div>
                  <article className="content-preview-course">
                    <header><p className="path-kicker">{draft.eyebrow}</p><h1>{draft.title}</h1><p><MathText>{draft.summary}</MathText></p></header>
                    <section className="mastery-course-card is-concept">
                      <div><span className="mastery-course-icon"><BookOpenText size={25} weight="duotone" /></span><p className="path-kicker">Comprendre</p><h2>{selectedEntry.lesson.concept.title}</h2></div>
                      <MarkdownContent markdown={draft.bodyMarkdown} emptyState={<p>Le contenu apparaîtra ici.</p>} />
                      <div className="lesson-notation"><span>À retenir</span><strong><MathText>{draft.keyPoint}</MathText></strong></div>
                      <div className="lesson-example"><div><strong>Exemple</strong><p><MathText>{draft.example}</MathText></p></div></div>
                    </section>
                    <section className="content-preview-quiz">
                      <p className="path-kicker">Évaluation du niveau</p><h2>À toi de jouer</h2>
                      {draft.questions.map((question, index) => <div key={`preview-${index}`}><strong>{index + 1}. <MathText>{question.prompt}</MathText></strong>{question.sourceLabel && <small className="content-preview-source">{question.sourceLabel}</small>}{question.type === "short-answer" ? <label className="content-preview-short-answer"><span>Réponse courte</span><input disabled placeholder="L’élève saisira son résultat ici" /></label> : <ul>{question.options.map((option, optionIndex) => <li className={question.correctIndex === optionIndex ? "is-correct" : ""} key={`${option}-${optionIndex}`}><span>{String.fromCharCode(65 + optionIndex)}</span><MathText>{option}</MathText>{question.correctIndex === optionIndex && <Check size={15} weight="bold" />}</li>)}</ul>}</div>)}
                    </section>
                  </article>
                </aside>
              )}
            </div>
          </div>
        ) : <div className="content-studio-no-selection"><BookOpenText size={44} weight="duotone" /><h2>Choisis un niveau à modifier</h2><p>Le brouillon et son aperçu apparaîtront ici.</p></div>}
      </div>

      {historyOpen && currentDocument && (
        <div className="content-history-overlay" role="presentation">
          <aside className="content-history" role="dialog" aria-modal="true" aria-labelledby="content-history-title">
            <header><div><span>Historique</span><h2 id="content-history-title">Versions du niveau</h2><p>Restaurer crée un nouveau brouillon sans effacer les versions précédentes.</p></div><button type="button" onClick={() => setHistoryOpen(false)} aria-label="Fermer l’historique"><X size={21} /></button></header>
            {historyLoading ? <p className="content-history-feedback">Chargement…</p> : <div>{revisions.map((revision) => <article key={revision.id}><span>v{revision.version}</span><div><strong>{revision.note ?? "Sauvegarde"}</strong><small>{formatDate(revision.createdAt)}{revision.createdByName ? ` • ${revision.createdByName}` : ""}</small></div><button type="button" onClick={() => void restore(revision)} disabled={revision.version === currentDocument.draftVersion}>Restaurer</button></article>)}{!revisions.length && <p className="content-history-feedback">Aucune version enregistrée.</p>}</div>}
          </aside>
        </div>
      )}
    </section>
  );
}
