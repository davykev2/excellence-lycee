import { useMemo, useState } from "react";
import {
  ArrowClockwise,
  CalendarBlank,
  ChartBar,
  FilePdf,
  LockKey,
  MapPin,
  MagnifyingGlass,
  Medal,
  Student,
  Users,
  WarningCircle,
} from "@phosphor-icons/react";
import { schoolLevels } from "../../data/programme";
import { BAC_CI_2024_EXAM_ID } from "../../data/bacCi2024Exam";
import { bacExamCatalog } from "../../data/bacExamCatalog";
import {
  bacExamZoneLabel,
  bacExamZones,
  type BacExamParticipantResult,
  type BacExamZone,
} from "../../domain/bacExam";
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
  const resultExams = useMemo(() => bacExamCatalog.filter((exam) => (
    exam.responseSheetAvailable && exam.sourceVerified !== false
  )), []);
  const [examId, setExamId] = useState(BAC_CI_2024_EXAM_ID);
  const selectedExam = resultExams.find((exam) => exam.id === examId) ?? resultExams[0];
  const sectionLabels = selectedExam?.sections.length === 3
    ? selectedExam.sections.map((section) => section.label)
    : ["Anglais", "Culture générale", "Culture scientifique"];
  const participants = useBacExamParticipantResults({ examId: selectedExam?.id ?? BAC_CI_2024_EXAM_ID, preview });
  const [query, setQuery] = useState("");
  const [levelId, setLevelId] = useState("all");
  const [candidateZone, setCandidateZone] = useState<BacExamZone | "all" | "unknown">("all");
  const [sort, setSort] = useState<ParticipantSort>("score");
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const availableLevels = useMemo(() => (
    [...new Set(participants.items.map((participant) => participant.levelId).filter(Boolean))]
      .sort((left, right) => levelLabel(left).localeCompare(levelLabel(right), "fr"))
  ), [participants.items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    const next = participants.items.filter((participant) => {
      const matchesLevel = levelId === "all" || participant.levelId === levelId;
      const matchesZone = candidateZone === "all"
        || (candidateZone === "unknown" ? !participant.candidateZone : participant.candidateZone === candidateZone);
      const matchesQuery = !normalizedQuery
        || `${participant.name} ${participant.email} ${bacExamZoneLabel(participant.candidateZone)}`
          .toLocaleLowerCase("fr").includes(normalizedQuery);
      return matchesLevel && matchesZone && matchesQuery;
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
  }, [candidateZone, levelId, participants.items, query, sort]);

  const zoneCounts = useMemo(() => Object.fromEntries(
    bacExamZones.map((zone) => [
      zone.id,
      participants.items.filter((participant) => participant.candidateZone === zone.id).length,
    ]),
  ) as Record<BacExamZone, number>, [participants.items]);

  const average = participants.items.length
    ? Math.round(participants.items.reduce((sum, item) => sum + item.correctAnswers, 0) / participants.items.length * 10) / 10
    : 0;
  const bestScore = participants.items.reduce((best, item) => Math.max(best, item.correctAnswers), 0);

  const downloadRankingPdf = async () => {
    setExportingPdf(true);
    setExportError(null);
    try {
      const { exportBacExamResultsPdf } = await import("./exportBacExamResultsPdf");
      exportBacExamResultsPdf(participants.items, levelLabel, {
        title: selectedExam?.title ?? "Concours BAC & BT 2024",
        sectionLabels: sectionLabels as [string, string, string],
        fileName: `classement-${selectedExam?.slug ?? "concours-2024"}.pdf`,
      });
    } catch {
      setExportError("Le PDF n’a pas pu être généré. Réessaie dans quelques instants.");
    } finally {
      setExportingPdf(false);
    }
  };

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

      <label className="admin-bac-exam-selector">
        <span>Épreuve suivie</span>
        <select value={selectedExam?.id} onChange={(event) => setExamId(event.target.value)}>
          {resultExams.map((exam) => <option key={exam.id} value={exam.id}>{exam.shortTitle}</option>)}
        </select>
      </label>

      <div className="admin-bac-participant-stats" aria-label="Synthèse des résultats">
        <div>
          <span><Users size={22} weight="duotone" /></span>
          <p><strong>{participants.items.length}</strong><small>copies déposées</small></p>
        </div>
        <div>
          <span><ChartBar size={22} weight="duotone" /></span>
          <p><strong>{average.toLocaleString("fr-CI")}/{selectedExam?.questionCount ?? 0}</strong><small>moyenne générale</small></p>
        </div>
        <div>
          <span><Medal size={22} weight="duotone" /></span>
          <p><strong>{bestScore}/{selectedExam?.questionCount ?? 0}</strong><small>meilleure note</small></p>
        </div>
      </div>

      <div className="admin-bac-zone-stats" aria-label="Répartition des copies par zone">
        {bacExamZones.map((zone) => (
          <button
            className={candidateZone === zone.id ? "is-active" : ""}
            type="button"
            key={zone.id}
            onClick={() => setCandidateZone((current) => current === zone.id ? "all" : zone.id)}
          >
            <MapPin size={18} weight={candidateZone === zone.id ? "fill" : "duotone"} />
            <span><strong>{zoneCounts[zone.id]}</strong><small>{zone.label}</small></span>
          </button>
        ))}
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
          <span className="sr-only">Filtrer par zone</span>
          <select value={candidateZone} onChange={(event) => setCandidateZone(event.target.value as BacExamZone | "all" | "unknown")}>
            <option value="all">Toutes les zones</option>
            {bacExamZones.map((zone) => <option key={zone.id} value={zone.id}>{zone.label}</option>)}
            <option value="unknown">Zone non renseignée</option>
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
        <button
          className="primary-action is-compact admin-bac-pdf"
          type="button"
          disabled={participants.loading || participants.items.length === 0 || exportingPdf}
          onClick={() => void downloadRankingPdf()}
        >
          <FilePdf size={19} weight="duotone" />
          {exportingPdf ? "Création du PDF…" : "Télécharger le classement PDF"}
        </button>
      </div>

      {exportError && <p className="admin-bac-export-error" role="alert">{exportError}</p>}

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
              <span role="columnheader">Zone</span>
              <span role="columnheader">Copie déposée</span>
              <span role="columnheader">{sectionLabels[0]}</span>
              <span role="columnheader">{sectionLabels[1]}</span>
              <span role="columnheader">{sectionLabels[2]}</span>
              <span role="columnheader">Total</span>
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
                <span className={`admin-bac-zone ${participant.candidateZone ? "" : "is-unknown"}`} role="cell">
                  <MapPin size={16} weight="duotone" />
                  {bacExamZoneLabel(participant.candidateZone)}
                </span>
                <span className="admin-bac-date" role="cell">
                  <CalendarBlank size={17} weight="duotone" />
                  {formatSubmissionDate(participant.submittedAt)}
                </span>
                <span className="admin-bac-section-score" role="cell">
                  <strong>{participant.sectionScores.english.correctAnswers}</strong>
                  <em>/{participant.sectionScores.english.scoreMax}</em>
                </span>
                <span className="admin-bac-section-score" role="cell">
                  <strong>{participant.sectionScores.generalKnowledge.correctAnswers}</strong>
                  <em>/{participant.sectionScores.generalKnowledge.scoreMax}</em>
                </span>
                <span className="admin-bac-section-score" role="cell">
                  <strong>{participant.sectionScores.scientificKnowledge.correctAnswers}</strong>
                  <em>/{participant.sectionScores.scientificKnowledge.scoreMax}</em>
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
                  <span className="admin-bac-zone"><MapPin size={16} weight="duotone" />{bacExamZoneLabel(participant.candidateZone)}</span>
                  <span><CalendarBlank size={16} weight="duotone" />{formatSubmissionDate(participant.submittedAt)}</span>
                </div>
                <div className="admin-bac-card-section-scores" aria-label="Notes par matière">
                  <span>
                    <small>{sectionLabels[0]}</small>
                    <strong>{participant.sectionScores.english.correctAnswers}/{participant.sectionScores.english.scoreMax}</strong>
                  </span>
                  <span>
                    <small>{sectionLabels[1]}</small>
                    <strong>{participant.sectionScores.generalKnowledge.correctAnswers}/{participant.sectionScores.generalKnowledge.scoreMax}</strong>
                  </span>
                  <span>
                    <small>{sectionLabels[2]}</small>
                    <strong>{participant.sectionScores.scientificKnowledge.correctAnswers}/{participant.sectionScores.scientificKnowledge.scoreMax}</strong>
                  </span>
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
