import {
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Eye,
  ListChecks,
  PencilSimple,
  XCircle,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MarkdownContent } from "../../components/MarkdownContent";
import { MathText } from "../../components/MathText";
import type {
  CourseCategorizeActivity,
  CourseGuidedWritingActivity,
  CourseOrderingActivity,
  LearningLesson,
} from "../../domain/paths";

function ActivitySource({ label }: { label?: string }) {
  return label ? <small className="course-practice-source">{label}</small> : null;
}

function CategorizePractice({ activity }: { activity: CourseCategorizeActivity }) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const groupLabels = useMemo(
    () => new Map(activity.groups.map((group) => [group.id, group.label])),
    [activity.groups],
  );
  const complete = activity.items.every((item) => Boolean(assignments[item.id]));
  const allCorrect = complete && activity.items.every((item) => assignments[item.id] === item.correctGroupId);

  const updateAssignment = (itemId: string, groupId: string) => {
    setAssignments((current) => ({ ...current, [itemId]: groupId }));
    setChecked(false);
  };

  return (
    <article className="course-practice-card is-categorize">
      <header>
        <span className="course-practice-icon"><ListChecks size={22} weight="duotone" aria-hidden="true" /></span>
        <div>
          <p className="path-kicker">Classer et justifier</p>
          <h4><MathText>{activity.title}</MathText></h4>
          <p><MathText>{activity.instruction}</MathText></p>
          <ActivitySource label={activity.sourceLabel} />
        </div>
      </header>

      <div className="course-practice-group-key" aria-label="Catégories disponibles">
        {activity.groups.map((group) => (
          <div key={group.id}>
            <strong>{group.label}</strong>
            {group.description && <span>{group.description}</span>}
          </div>
        ))}
      </div>

      <div className="course-practice-categorize-list">
        {activity.items.map((item, itemIndex) => {
          const itemCorrect = assignments[item.id] === item.correctGroupId;
          return (
            <label
              className={checked ? itemCorrect ? "is-correct" : "is-incorrect" : undefined}
              key={item.id}
            >
              <span><b>{itemIndex + 1}</b><MathText>{item.label}</MathText></span>
              <select
                aria-label={"Catégorie de : " + item.label}
                value={assignments[item.id] ?? ""}
                onChange={(event) => updateAssignment(item.id, event.target.value)}
              >
                <option value="">Choisir une catégorie</option>
                {activity.groups.map((group) => <option key={group.id} value={group.id}>{group.label}</option>)}
              </select>
              {checked && (
                <small>
                  {itemCorrect
                    ? <><CheckCircle size={17} weight="fill" aria-hidden="true" /> {item.explanation}</>
                    : <><XCircle size={17} weight="fill" aria-hidden="true" /> À classer dans « {groupLabels.get(item.correctGroupId)} ». {item.explanation}</>}
                </small>
              )}
            </label>
          );
        })}
      </div>

      <div className="course-practice-actions">
        <button type="button" disabled={!complete} onClick={() => setChecked(true)}>Vérifier mon classement</button>
        <button
          className="is-secondary"
          type="button"
          onClick={() => {
            setAssignments({});
            setChecked(false);
          }}
        >
          Effacer
        </button>
      </div>
      <p className="course-practice-status" aria-live="polite">
        {checked
          ? allCorrect
            ? "Le classement est cohérent. Lis les justifications avant de poursuivre."
            : "Certains choix sont à reprendre. Les explications indiquent pourquoi, sans retirer de point."
          : "Cet entraînement est sans note et sans conséquence sur ta progression."}
      </p>
    </article>
  );
}

function OrderingPractice({ activity }: { activity: CourseOrderingActivity }) {
  const initialOrder = useMemo(() => activity.items.map((item) => item.id), [activity.items]);
  const [order, setOrder] = useState(initialOrder);
  const [checked, setChecked] = useState(false);
  const itemById = useMemo(() => new Map(activity.items.map((item) => [item.id, item])), [activity.items]);
  const allCorrect = order.every((itemId, index) => itemId === activity.correctOrder[index]);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    setOrder((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setChecked(false);
  };

  return (
    <article className="course-practice-card is-ordering">
      <header>
        <span className="course-practice-icon"><ArrowDown size={22} weight="duotone" aria-hidden="true" /></span>
        <div>
          <p className="path-kicker">Construire l’ordre</p>
          <h4><MathText>{activity.title}</MathText></h4>
          <p><MathText>{activity.instruction}</MathText></p>
          <ActivitySource label={activity.sourceLabel} />
        </div>
      </header>

      <ol className="course-practice-order-list">
        {order.map((itemId, index) => {
          const item = itemById.get(itemId);
          if (!item) return null;
          const correctAtPosition = itemId === activity.correctOrder[index];
          return (
            <li className={checked ? correctAtPosition ? "is-correct" : "is-incorrect" : undefined} key={item.id}>
              <span className="course-practice-rank">{index + 1}</span>
              <div><strong><MathText>{item.label}</MathText></strong><small><MathText>{item.detail}</MathText></small></div>
              <div className="course-practice-move-buttons">
                <button type="button" aria-label={"Monter « " + item.label + " »"} disabled={index === 0} onClick={() => move(index, -1)}>
                  <ArrowUp size={18} weight="bold" aria-hidden="true" />
                </button>
                <button type="button" aria-label={"Descendre « " + item.label + " »"} disabled={index === order.length - 1} onClick={() => move(index, 1)}>
                  <ArrowDown size={18} weight="bold" aria-hidden="true" />
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="course-practice-actions">
        <button type="button" onClick={() => setChecked(true)}>Vérifier l’ordre</button>
        <button
          className="is-secondary"
          type="button"
          onClick={() => {
            setOrder(initialOrder);
            setChecked(false);
          }}
        >
          Recommencer
        </button>
      </div>
      <div className="course-practice-status" aria-live="polite">
        {checked && allCorrect
          ? <><CheckCircle size={18} weight="fill" aria-hidden="true" /> L’ordre est juste. {activity.explanation}</>
          : checked
            ? <><XCircle size={18} weight="fill" aria-hidden="true" /> L’ordre n’est pas encore cohérent. Déplace les étapes signalées puis vérifie de nouveau.</>
            : "Utilise les flèches : l’activité fonctionne aussi sans glisser-déposer."}
      </div>
      {checked && !allCorrect && (
        <details className="course-practice-solution">
          <summary>Voir l’ordre expliqué</summary>
          <ol>
            {activity.correctOrder.map((itemId) => {
              const item = itemById.get(itemId);
              return item ? <li key={item.id}><strong>{item.label}</strong> — {item.detail}</li> : null;
            })}
          </ol>
          <p>{activity.explanation}</p>
        </details>
      )}
    </article>
  );
}

interface SavedWritingDraft {
  drafts: Record<string, string>;
  reviewedCriteria: Record<string, boolean>;
}

function persistWritingDraft(storageKey: string, draft: SavedWritingDraft) {
  const hasContent = Object.values(draft.drafts).some((value) => value.trim().length > 0)
    || Object.values(draft.reviewedCriteria).some(Boolean);
  try {
    if (hasContent) {
      window.localStorage.setItem(storageKey, JSON.stringify(draft));
    } else {
      window.localStorage.removeItem(storageKey);
    }
  } catch {
    // Le cours reste utilisable quand le stockage local est indisponible.
  }
}

function readWritingDraft(storageKey?: string): SavedWritingDraft {
  if (!storageKey || typeof window === "undefined") return { drafts: {}, reviewedCriteria: {} };
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "null") as Partial<SavedWritingDraft> | null;
    const drafts = parsed?.drafts && typeof parsed.drafts === "object" && !Array.isArray(parsed.drafts)
      ? Object.fromEntries(Object.entries(parsed.drafts).filter((entry): entry is [string, string] => typeof entry[1] === "string"))
      : {};
    const reviewedCriteria = parsed?.reviewedCriteria
      && typeof parsed.reviewedCriteria === "object"
      && !Array.isArray(parsed.reviewedCriteria)
      ? Object.fromEntries(Object.entries(parsed.reviewedCriteria).filter((entry): entry is [string, boolean] => typeof entry[1] === "boolean"))
      : {};
    return {
      drafts,
      reviewedCriteria,
    };
  } catch {
    return { drafts: {}, reviewedCriteria: {} };
  }
}

function GuidedWritingPractice({
  activity,
  storageKey,
}: {
  activity: CourseGuidedWritingActivity;
  storageKey?: string;
}) {
  const initialDraft = useMemo(() => readWritingDraft(storageKey), [storageKey]);
  const [drafts, setDrafts] = useState<Record<string, string>>(initialDraft.drafts);
  const [reviewedCriteria, setReviewedCriteria] = useState<Record<string, boolean>>(initialDraft.reviewedCriteria);
  const [modelVisible, setModelVisible] = useState(false);
  const latestDraft = useRef<SavedWritingDraft>({ drafts, reviewedCriteria });
  latestDraft.current = { drafts, reviewedCriteria };
  const complete = activity.prompts.every((prompt) => prompt.optional || Boolean(drafts[prompt.id]?.trim()));

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    const timeoutId = window.setTimeout(() => {
      persistWritingDraft(storageKey, { drafts, reviewedCriteria });
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [drafts, reviewedCriteria, storageKey]);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    const flushDraft = () => persistWritingDraft(storageKey, latestDraft.current);
    window.addEventListener("pagehide", flushDraft);
    return () => {
      window.removeEventListener("pagehide", flushDraft);
      flushDraft();
    };
  }, [storageKey]);

  return (
    <article className="course-practice-card is-writing">
      <header>
        <span className="course-practice-icon"><PencilSimple size={22} weight="duotone" aria-hidden="true" /></span>
        <div>
          <p className="path-kicker">Rédiger et se relire</p>
          <h4><MathText>{activity.title}</MathText></h4>
          <p><MathText>{activity.instruction}</MathText></p>
          <ActivitySource label={activity.sourceLabel} />
        </div>
      </header>

      <div className="course-practice-writing-fields">
        {activity.prompts.map((prompt) => {
          const inputId = "course-writing-" + activity.id + "-" + prompt.id;
          return (
            <label htmlFor={inputId} key={prompt.id}>
              <span>{prompt.label}{prompt.optional ? " (facultatif)" : ""}</span>
              {prompt.hint && <small>{prompt.hint}</small>}
              <textarea
                id={inputId}
                rows={prompt.rows ?? 4}
                value={drafts[prompt.id] ?? ""}
                placeholder={prompt.placeholder}
                onChange={(event) => setDrafts((current) => ({ ...current, [prompt.id]: event.target.value }))}
              />
            </label>
          );
        })}
      </div>

      <fieldset className="course-practice-checklist">
        <legend>Ma grille de relecture</legend>
        <p>Coche seulement ce que tu retrouves réellement dans ton brouillon.</p>
        {activity.criteria.map((criterion) => (
          <label key={criterion.id}>
            <input
              type="checkbox"
              checked={Boolean(reviewedCriteria[criterion.id])}
              onChange={(event) => setReviewedCriteria((current) => ({ ...current, [criterion.id]: event.target.checked }))}
            />
            <span><strong>{criterion.label}</strong><small>{criterion.hint}</small></span>
          </label>
        ))}
      </fieldset>

      <div className="course-practice-actions">
        <button
          type="button"
          disabled={!complete}
          aria-expanded={modelVisible}
          onClick={() => setModelVisible((current) => !current)}
        >
          <Eye size={18} weight="duotone" aria-hidden="true" />
          {modelVisible ? "Masquer le corrigé guidé" : "Comparer au corrigé guidé"}
        </button>
        <button
          className="is-secondary"
          type="button"
          onClick={() => {
            setDrafts({});
            setReviewedCriteria({});
            setModelVisible(false);
            if (storageKey && typeof window !== "undefined") {
              persistWritingDraft(storageKey, { drafts: {}, reviewedCriteria: {} });
            }
          }}
        >
          Nouveau brouillon
        </button>
      </div>

      <p className="course-practice-status" aria-live="polite">
        {complete
          ? "Ton brouillon est prêt à être comparé. Excellence ne lui attribue aucune note automatique."
          : "Complète chaque zone obligatoire pour ouvrir le corrigé guidé. Ton texte n’est ni envoyé ni noté."}
        {storageKey ? " Il est sauvegardé uniquement sur cet appareil." : ""}
      </p>

      {modelVisible && (
        <section className="course-practice-model" aria-label={activity.modelTitle}>
          <header><CheckCircle size={20} weight="duotone" aria-hidden="true" /><strong>{activity.modelTitle}</strong></header>
          <MarkdownContent markdown={activity.modelMarkdown} />
          <p>Le modèle n’est pas l’unique formulation possible : vérifie surtout la méthode, la cohérence et la précision du raisonnement.</p>
        </section>
      )}
    </article>
  );
}

export function CoursePracticePanel({
  lesson,
  storageScope,
}: {
  lesson: LearningLesson;
  storageScope?: string;
}) {
  if (!lesson.courseActivities?.length) return null;

  return (
    <section className="course-practice-panel" aria-labelledby={"course-practice-" + lesson.id}>
      <header className="course-practice-panel-head">
        <span><PencilSimple size={24} weight="duotone" aria-hidden="true" /></span>
        <div>
          <p className="path-kicker">Atelier interactif</p>
          <h3 id={"course-practice-" + lesson.id}>À toi de construire le raisonnement</h3>
          <p>Manipule, rédige et compare. Ces activités servent à apprendre : elles ne donnent ni note, ni XP.</p>
        </div>
      </header>
      <div className="course-practice-list">
        {lesson.courseActivities.map((activity) => {
          if (activity.kind === "categorize") return <CategorizePractice key={activity.id} activity={activity} />;
          if (activity.kind === "ordering") return <OrderingPractice key={activity.id} activity={activity} />;
          const storageKey = storageScope
            ? `excellence:course-draft:v1:${storageScope}:${activity.id}`
            : undefined;
          return (
            <GuidedWritingPractice
              key={storageKey ?? activity.id}
              activity={activity}
              storageKey={storageKey}
            />
          );
        })}
      </div>
    </section>
  );
}
