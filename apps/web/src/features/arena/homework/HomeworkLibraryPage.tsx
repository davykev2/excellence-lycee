import {
  ArrowLeft,
  ArrowRight,
  Books,
  Buildings,
  CheckCircle,
  Clock,
  FileText,
  Funnel,
  MagnifyingGlass,
  PlayCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import type { HomeworkSummary } from "../../../domain/homework";
import type { LearnerProfile } from "../../../domain/learning";
import { formatHomeworkDuration } from "../../../domain/homework";
import { CompanionAvatar } from "../../companion/CompanionAvatar";
import "../../../styles/homework.css";
import { useHomeworkLibrary } from "./homeworkApi";

function statusLabel(homework: HomeworkSummary) {
  if (homework.status === "in-progress") return "À reprendre";
  if (homework.status === "completed") return "Déjà composé";
  return "Disponible";
}

function cardAction(homework: HomeworkSummary) {
  if (homework.status === "in-progress") return "Reprendre ma copie";
  if (homework.status === "completed" && homework.latestAttemptId) return "Voir mon résultat";
  return "Ouvrir le devoir";
}

function HomeworkCard({
  homework,
  onOpen,
}: {
  homework: HomeworkSummary;
  onOpen: () => void;
}) {
  return (
    <article className={`homework-library-card is-${homework.status}`}>
      <header>
        <span className="homework-library-school-mark"><Buildings size={22} weight="duotone" /></span>
        <div>
          <p>{homework.institution}</p>
          <h2>{homework.title} {homework.number > 0 ? `n° ${homework.number}` : ""}</h2>
        </div>
        <span className="homework-library-status">{statusLabel(homework)}</span>
      </header>
      <div className="homework-library-meta">
        <span><strong>{homework.subject.name}</strong></span>
        <span>{homework.level.name} {homework.series.name}</span>
        <span>{homework.academicYear}</span>
      </div>
      <dl>
        <div><dt><Clock size={17} weight="duotone" />Durée</dt><dd>{formatHomeworkDuration(homework.durationSeconds)}</dd></div>
        <div><dt><FileText size={17} weight="duotone" />Questions</dt><dd>{homework.questionCount}</dd></div>
        <div><dt><CheckCircle size={17} weight="duotone" />Barème</dt><dd>/{homework.scoreMax ?? 20}</dd></div>
      </dl>
      <footer>
        <span>{homework.attemptsUsed}/{homework.maxAttempts} tentative{homework.maxAttempts > 1 ? "s" : ""} utilisée{homework.maxAttempts > 1 ? "s" : ""}</span>
        <button type="button" className="primary-action is-compact" onClick={onOpen}>
          {cardAction(homework)} <ArrowRight size={18} weight="bold" />
        </button>
      </footer>
    </article>
  );
}

export function HomeworkLibraryPage({
  profile,
  isAdmin = false,
  localOnly = false,
  onBackArena,
  onOpenHomework,
}: {
  profile: LearnerProfile;
  isAdmin?: boolean;
  localOnly?: boolean;
  onBackArena: () => void;
  onOpenHomework: (homeworkRef: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const library = useHomeworkLibrary({ filters: isAdmin ? {} : { levelId: profile.levelId }, localOnly });
  const activeItems = useMemo(
    () => library.items.filter((homework) => homework.editorialStatus !== "archived"),
    [library.items],
  );
  const subjects = useMemo(() => Array.from(new Map(
    activeItems.map((homework) => [homework.subject.id, homework.subject.name]),
  ).entries()), [activeItems]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("fr");
    return activeItems.filter((homework) => (
      (!subjectId || homework.subject.id === subjectId)
      && (!needle || `${homework.title} ${homework.institution} ${homework.academicYear} ${homework.subject.name}`
        .toLocaleLowerCase("fr")
        .includes(needle))
    ));
  }, [activeItems, query, subjectId]);

  return (
    <main className="homework-library-page">
      <header className="homework-library-topbar">
        <button className="path-back-button" type="button" onClick={onBackArena}>
          <ArrowLeft size={20} weight="bold" />Retour à l’Arène
        </button>
        <span><Books size={19} weight="duotone" />Devoirs d’établissements</span>
      </header>

      <section className="homework-library-hero">
        <div>
          <p className="path-kicker">Conditions réelles · Correction expliquée</p>
          <h1>Compose les devoirs des écoles d’excellence.</h1>
          <p>
            Retrouve les anciens sujets par établissement, matière et année. Ta copie reste enregistrée,
            même si tu actualises la page.
          </p>
          <div>
            <span><PlayCircle size={18} weight="duotone" />Chronomètre officiel</span>
            <span><CheckCircle size={18} weight="duotone" />Note sur 20</span>
            <span><FileText size={18} weight="duotone" />Démonstrations relues</span>
          </div>
        </div>
        <div className="homework-library-davy">
          <CompanionAvatar motion="wave" decorative />
          <p><strong>Je garde ta copie.</strong><span>Avance à ton rythme, sans perdre tes réponses.</span></p>
        </div>
      </section>

      <section className="homework-library-filters" aria-label="Filtrer les devoirs">
        <label>
          <MagnifyingGlass size={19} weight="bold" />
          <span className="sr-only">Rechercher un devoir</span>
          <input
            type="search"
            value={query}
            placeholder="École, matière ou année…"
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>
        <label>
          <Funnel size={18} weight="duotone" />
          <span className="sr-only">Choisir une matière</span>
          <select value={subjectId} onChange={(event) => setSubjectId(event.currentTarget.value)}>
            <option value="">Toutes les matières</option>
            {subjects.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
        </label>
        <span>{isAdmin ? "Toutes les classes" : profile.levelId.replace("-", " ")} · {filtered.length} devoir{filtered.length > 1 ? "s" : ""}</span>
      </section>

      {library.loading && library.items.length === 0 && (
        <div className="homework-library-feedback" role="status"><span />Davy rassemble les sujets…</div>
      )}
      {library.error && (
        <div className="homework-library-feedback is-error" role="alert">
          <WarningCircle size={30} weight="duotone" />
          <div><strong>Impossible de charger les devoirs.</strong><p>{library.error}</p></div>
          <button type="button" onClick={library.reload}>Réessayer</button>
        </div>
      )}
      {!library.loading && !library.error && filtered.length === 0 && (
        <div className="homework-library-empty">
          <Books size={38} weight="duotone" />
          <h2>{query || subjectId ? "Aucun devoir ne correspond à ce filtre" : "Les premiers devoirs arrivent"}</h2>
          <p>{query || subjectId ? "Modifie ta recherche pour retrouver les autres sujets." : "Cette classe n’a pas encore de devoir publié."}</p>
        </div>
      )}
      {!library.error && filtered.length > 0 && (
        <section className="homework-library-grid" aria-label="Devoirs disponibles">
          {filtered.map((homework) => (
            <HomeworkCard
              homework={homework}
              key={homework.id}
              onOpen={() => onOpenHomework(homework.slug)}
            />
          ))}
        </section>
      )}
    </main>
  );
}
