import { useMemo, useState } from "react";
import {
  ArrowClockwise,
  CalendarBlank,
  ChartBar,
  LockKey,
  MagnifyingGlass,
  Medal,
  Student,
  Users,
  WarningCircle,
} from "@phosphor-icons/react";
import { schoolLevels } from "../../data/programme";
import type { BacExamParticipantResult } from "../../domain/bacExam";
import { useBacExamParticipantResults } from "./useBacExamParticipantResults";

type ParticipantSort = "score" | "recent" | "name" | "level";

const levelLabels = new Map(schoolLevels.map((level) => [level.id, level.label]));

function levelLabel(levelId: string) {
  return levelLabels.get(levelId) ?? (levelId || "Classe non renseignée");
}

function formatSubmissionDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date inconnue";
  return new Intl.DateTimeFormat("fr-CI", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function appreciationTone(label: string) {
  const normalized = label.toLocaleLowerCase("fr").normalize("NFD").replace(/\p{Diacritic}/gu, "");
  if (normalized === "excellent" || normalized === "tres bien") return "is-excellent";
  if (normalized === "bien" || normalized === "assez bien") return "is-good";
  if (normalized === "passable") return "is-passable";
  return "is-insufficient";
}

function ParticipantAvatar({ participant }: { participant: BacExamParticipantResult }) {
  if (participant.photoUrl) {
    return <img src={participant.photoUrl} alt="" loading="lazy" />;
  }
  return <span aria-hidden="true">{participant.name.trim().charAt(0).toLocaleUpperCase("fr") || "É"}</span>;
}

export function BacExamParticipantResults({ preview = false }: { preview?: boolean }) {
  const participants = useBacExamParticipantResults({ preview });
  const [query, setQuery] = useState("");
  const [levelId, setLevelId] = useState("all");
  const [sort, setSort] = useState<ParticipantSort>("score");

  const availableLevels = useMemo(() => (
    [...new Set(participants.items.map((participant) => participant.levelId).filter(Boolean))]
      .sort((left, right) => levelLabel(left).localeCompare(levelLabel(right), "fr"))
  ), [participants.items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    const next = participants.items.filter((participant) => {
      const matchesLevel = levelId === "all" || participant.levelId === levelId;
      const matchesQuery = !normalizedQuery
        || `${participant.name} ${participant.email}`.toLocaleLowerCase("fr").includes(normalizedQuery);
      return matchesLevel && matchesQuery;
    });

    return next.sort((left, right) => {
      if (sort === "recent") {
        return Date.parse(right.submittedAt) - Date.parse(left.submittedAt)
          || left.name.localeCompare(right.name, "fr");
      }
      if (sort === "name") return left.name.localeCompare(right.name, "fr");
      if (sort === "level") {
        return levelLabel(left.levelId).localeCompare(levelLabel(right.levelId), "fr")
          || left.name.localeCompare(right.name, "fr");
      }
      return right.correctAnswers - left.correctAnswers
        || left.name.localeCompare(right.name, "fr");
    });
  }, [levelId, participants.items, query, sort]);

  const average = participants.items.length
    ? Math.round(participants.items.reduce((sum, item) => sum + item.correctAnswers, 0) / participants.items.length * 10) / 10
    : 0;
  const bestScore = participants.items.reduce((best, item) => Math.max(best, item.correctAnswers), 0);

  return (
    <article className="admin-panel admin-bac-participants">
      <header className="admin-panel-header admin-bac-participants-header">
        <div>
          <p className="admin-eyebrow">Suivi des copies</p>
          <h2>Notes des participants</h2>
          <p>Consulte les résultats de tous les élèves ayant validé l’épreuve.</p>
        </div>
        <span className="admin-bac-private-pill">
          <LockKey size={17} weight="duotone" />
          Visible uniquement par les administrateurs
        </span>
      </header>

      <div className="admin-bac-participant-stats" aria-label="Synthèse des résultats">
        <div>
          <span><Users size={22} weight="duotone" /></span>
          <p><strong>{participants.items.length}</strong><small>copies déposées</small></p>
        </div>
        <div>
          <span><ChartBar size={22} weight="duotone" /></span>
          <p><strong>{average.toLocaleString("fr-CI")}/69</strong><small>moyenne générale</small></p>
        </div>
        <div>
          <span><Medal size={22} weight="duotone" /></span>
          <p><strong>{bestScore}/69</strong><small>meilleure note</small></p>
        </div>
      </div>

      <div className="admin-bac-participant-toolbar">
        <label className="admin-bac-participant-search">
          <MagnifyingGlass size={18} weight="bold" />
          <span className="sr-only">Rechercher un élève</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un nom ou un e-mail"
          />
        </label>
        <label>
          <span className="sr-only">Filtrer par classe</span>
          <select value={levelId} onChange={(event) => setLevelId(event.target.value)}>
            <option value="all">Toutes les classes</option>
            {availableLevels.map((id) => <option key={id} value={id}>{levelLabel(id)}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Trier les notes</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as ParticipantSort)}>
            <option value="score">Meilleures notes</option>
            <option value="recent">Copies récentes</option>
            <option value="name">Nom de l’élève</option>
            <option value="level">Classe</option>
          </select>
        </label>
        <button
          className="secondary-action admin-bac-refresh"
          type="button"
          disabled={participants.loading}
          onClick={() => void participants.reload()}
        >
          <ArrowClockwise size={18} weight="bold" />
          {participants.loading ? "Actualisation…" : "Actualiser"}
        </button>
      </div>

      {participants.loading && participants.items.length === 0 && (
        <div className="admin-bac-participants-feedback" role="status">
          <span className="admin-bac-results-spinner" />
          Davy rassemble les copies…
        </div>
      )}

      {participants.error && (
        <div className="admin-bac-participants-feedback is-error" role="alert">
          <WarningCircle size={23} weight="duotone" />
          <div>
            <strong>Les notes n’ont pas pu être chargées.</strong>
            <span>{participants.error}</span>
          </div>
          <button type="button" onClick={() => void participants.reload()}>Réessayer</button>
        </div>
      )}

      {!participants.loading && !participants.error && participants.items.length === 0 && (
        <div className="admin-bac-participants-feedback is-empty">
          <Student size={34} weight="duotone" />
          <div>
            <strong>Aucune copie pour le moment</strong>
            <span>Les notes apparaîtront ici dès qu’un élève aura validé l’épreuve.</span>
          </div>
        </div>
      )}

      {!participants.error && participants.items.length > 0 && filteredItems.length === 0 && (
        <div className="admin-bac-participants-feedback is-empty">
          <MagnifyingGlass size={30} weight="duotone" />
          <div>
            <strong>Aucun élève ne correspond à ces filtres</strong>
            <span>Modifie la recherche ou affiche toutes les classes.</span>
          </div>
        </div>
      )}

      {!participants.error && filteredItems.length > 0 && (
        <>
          <div className="admin-bac-results-table" role="table" aria-label="Notes des participants">
            <div className="admin-bac-results-head" role="row">
              <span role="columnheader">Élève</span>
              <span role="columnheader">Classe</span>
              <span role="columnheader">Copie déposée</span>
              <span role="columnheader">Note</span>
              <span role="columnheader">Appréciation</span>
            </div>
            {filteredItems.map((participant, index) => (
              <div className="admin-bac-results-row" role="row" key={participant.userId}>
                <div className="admin-bac-student" role="cell">
                  <ParticipantAvatar participant={participant} />
                  <p>
                    <strong>{participant.name}</strong>
                    <small>{participant.email || "E-mail non renseigné"}</small>
                  </p>
                </div>
                <span className="admin-bac-class" role="cell">{levelLabel(participant.levelId)}</span>
                <span className="admin-bac-date" role="cell">
                  <CalendarBlank size={17} weight="duotone" />
                  {formatSubmissionDate(participant.submittedAt)}
                </span>
                <span className="admin-bac-score" role="cell">
                  {sort === "score" && <small>#{index + 1}</small>}
                  <strong>{participant.correctAnswers}</strong>
                  <em>/{participant.scoreMax}</em>
                </span>
                <div className="admin-bac-appreciation-cell" role="cell">
                  <span className={`admin-bac-appreciation ${appreciationTone(participant.appreciation.label)}`}>
                    {participant.appreciation.label}
                  </span>
                  <small>{participant.appreciation.message}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-bac-results-cards">
            {filteredItems.map((participant, index) => (
              <article key={participant.userId}>
                <header>
                  <div className="admin-bac-student">
                    <ParticipantAvatar participant={participant} />
                    <p><strong>{participant.name}</strong><small>{participant.email}</small></p>
                  </div>
                  <span className="admin-bac-score">
                    {sort === "score" && <small>#{index + 1}</small>}
                    <strong>{participant.correctAnswers}</strong><em>/{participant.scoreMax}</em>
                  </span>
                </header>
                <div className="admin-bac-result-card-meta">
                  <span>{levelLabel(participant.levelId)}</span>
                  <span><CalendarBlank size={16} weight="duotone" />{formatSubmissionDate(participant.submittedAt)}</span>
                </div>
                <footer>
                  <span className={`admin-bac-appreciation ${appreciationTone(participant.appreciation.label)}`}>
                    {participant.appreciation.label}
                  </span>
                  <p>{participant.appreciation.message}</p>
                </footer>
              </article>
            ))}
          </div>
        </>
      )}
    </article>
  );
}
