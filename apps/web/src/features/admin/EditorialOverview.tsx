import { useMemo, useState } from "react";
import { BookOpenText, CheckCircle, Circle, MagnifyingGlass, Sparkle, Warning } from "@phosphor-icons/react";
import type { SubjectId } from "../../domain/learning";
import { learningPaths } from "../../data/learningPaths";
import { curriculumLessonTitles } from "../../data/curriculumCatalog";
import { subjects, schoolLevels, isSubjectAvailableForLevel } from "../../data/programme";
import { buildEditorialAudits, editorialStatusOf, type EditorialStatus } from "./editorialAudit";

type StatusFilter = "all" | EditorialStatus;

const statusMeta: Record<Exclude<StatusFilter, "all">, { label: string; className: string }> = {
  complete: { label: "Complet", className: "is-complete" },
  partial: { label: "Partiel", className: "is-partial" },
  todo: { label: "À enrichir", className: "is-todo" },
};

export function EditorialOverview() {
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string | "all">("all");
  const [subjectFilter, setSubjectFilter] = useState<SubjectId | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const audits = useMemo(() => buildEditorialAudits(learningPaths, curriculumLessonTitles), []);

  // Tout est cadré par le niveau choisi (KPI, couverture par matière et tableau).
  const scopedAudits = useMemo(
    () => (levelFilter === "all" ? audits : audits.filter((a) => a.levelIds.includes(levelFilter))),
    [audits, levelFilter],
  );

  const kpiAudits = useMemo(
    () => (subjectFilter === "all" ? scopedAudits : scopedAudits.filter((audit) => audit.subjectId === subjectFilter)),
    [scopedAudits, subjectFilter],
  );

  const totals = useMemo(() => {
    const lessons = kpiAudits.length;
    const published = kpiAudits.filter((audit) => audit.published).length;
    const enriched = kpiAudits.filter((audit) => editorialStatusOf(audit) === "complete").length;
    const questions = kpiAudits.reduce((sum, a) => sum + a.questions, 0);
    const subjectsCovered = new Set(kpiAudits.filter((audit) => audit.published).map((a) => a.subjectId)).size;
    return { lessons, published, enriched, questions, subjectsCovered };
  }, [kpiAudits]);

  const perSubject = useMemo(() => {
    return Object.values(subjects).map((subject) => {
      const available = levelFilter === "all" || isSubjectAvailableForLevel(subject, levelFilter);
      const rows = scopedAudits.filter((a) => a.subjectId === subject.id);
      const lessons = rows.length;
      const published = rows.filter((audit) => audit.published).length;
      const enriched = rows.filter((audit) => editorialStatusOf(audit) === "complete").length;
      return {
        id: subject.id,
        label: subject.label,
        accent: subject.theme.accent,
        available,
        lessons,
        published,
        enriched,
        coverage: lessons === 0 ? 0 : Math.round((enriched / lessons) * 100),
      };
    })
      // Vue globale : tout ce qui a du contenu. Vue par niveau : uniquement les
      // matières réellement enseignées à ce niveau (ex. la Seconde ne fait pas de philo),
      // y compris celles encore vides pour révéler les manques.
      .filter((row) => (levelFilter === "all" ? row.lessons > 0 : row.available))
      .sort((a, b) => a.coverage - b.coverage || b.lessons - a.lessons);
  }, [scopedAudits, levelFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scopedAudits
      .filter((a) => subjectFilter === "all" || a.subjectId === subjectFilter)
      .filter((a) => statusFilter === "all" || editorialStatusOf(a) === statusFilter)
      .filter((a) => !q || a.title.toLowerCase().includes(q) || a.themeTitle.toLowerCase().includes(q) || subjects[a.subjectId].label.toLowerCase().includes(q))
      .sort((a, b) => {
        const ra = a.levels ? a.enrichedLevels / a.levels : 1;
        const rb = b.levels ? b.enrichedLevels / b.levels : 1;
        if (ra !== rb) return ra - rb; // les moins enrichis d'abord
        return subjects[a.subjectId].label.localeCompare(subjects[b.subjectId].label, "fr");
      });
  }, [scopedAudits, query, subjectFilter, statusFilter]);

  const coveragePct = totals.lessons === 0 ? 0 : Math.round((totals.enriched / totals.lessons) * 100);

  return (
    <section className="admin-section editorial-overview" data-testid="admin-editorial">
      <div className="admin-section-heading">
        <div>
          <p className="admin-eyebrow">Vue d’ensemble éditoriale</p>
          <h2>Couverture du catalogue</h2>
          <p>Toutes les leçons du programme, y compris celles qui n’ont pas encore de parcours, comparées au contenu réellement publié dans l’application.</p>
        </div>
      </div>

      <div className="editorial-kpis">
        <article className="editorial-kpi is-navy">
          <span>Leçons au programme</span>
          <strong>{totals.lessons}</strong>
          <small>{totals.subjectsCovered} matières couvertes</small>
        </article>
        <article className="editorial-kpi">
          <span>Parcours publiés</span>
          <strong>{totals.published} <em>/ {totals.lessons}</em></strong>
          <small>{totals.questions.toLocaleString("fr-FR")} questions</small>
        </article>
        <article className="editorial-kpi is-accent">
          <span>Leçons enrichies</span>
          <strong>{totals.enriched} <em>/ {totals.lessons}</em></strong>
          <small>{coveragePct}% du catalogue</small>
        </article>
        <article className="editorial-kpi">
          <span>Reste à enrichir</span>
          <strong>{totals.lessons - totals.enriched}</strong>
          <small>leçons à construire ou à compléter</small>
        </article>
      </div>

      <div className="editorial-legend">
        <Sparkle size={16} weight="fill" />
        <span>Une leçon n’est <strong>complète</strong> que si tous ses niveaux possèdent un cours substantiel, plusieurs exercices ou une interaction riche exploitable. Un simple titre ou un petit résumé automatique reste visible comme travail à faire.</span>
      </div>

      <section className="editorial-subject-panel">
        <h3>Par matière</h3>
        <div className="editorial-subject-grid">
          {perSubject.map((row) => (
            <article className={row.published === 0 ? "is-empty" : ""} key={row.id} style={{ "--subj-accent": row.accent } as React.CSSProperties}>
              <div className="editorial-subject-head">
                <strong>{row.label}</strong>
                <b>{row.lessons === 0 ? "—" : `${row.coverage}%`}</b>
              </div>
              <div className="editorial-bar"><i style={{ width: `${row.coverage}%` }} /></div>
              <small>{row.lessons === 0 ? "Aucune leçon au programme" : `${row.enriched}/${row.lessons} leçons enrichies • ${row.published} publiées`}</small>
            </article>
          ))}
        </div>
      </section>

      <div className="admin-toolbar">
        <label className="admin-search"><MagnifyingGlass size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un parcours, un thème, une matière…" /></label>
        <label className="admin-filter"><span>Niveau et série</span>
          <select value={levelFilter} onChange={(event) => setLevelFilter(event.target.value)}>
            <option value="all">Tous les niveaux</option>
            {schoolLevels.map((level) => <option key={level.id} value={level.id}>{level.label}</option>)}
          </select>
        </label>
        <label className="admin-filter"><span>Matière</span>
          <select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value as SubjectId | "all")}>
            <option value="all">Toutes</option>
            {Object.values(subjects).map((subject) => <option key={subject.id} value={subject.id}>{subject.label}</option>)}
          </select>
        </label>
        <label className="admin-filter"><span>État</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}>
            <option value="all">Tous</option>
            <option value="complete">Complets</option>
            <option value="partial">Partiels</option>
            <option value="todo">À enrichir</option>
          </select>
        </label>
      </div>

      <div className="editorial-table" role="table" aria-label="Parcours et enrichissement">
        <div className="editorial-row is-head" role="row">
          <span role="columnheader">Parcours</span>
          <span role="columnheader">Séries</span>
          <span role="columnheader">Enrichissement</span>
          <span role="columnheader">Questions</span>
          <span role="columnheader">XP</span>
          <span role="columnheader">État</span>
        </div>
        {filtered.map((audit) => {
          const status = editorialStatusOf(audit);
          const pct = audit.levels === 0 ? 0 : Math.round((audit.enrichedLevels / audit.levels) * 100);
          const subject = subjects[audit.subjectId];
          const statusLabel = !audit.published ? "À construire" : statusMeta[status].label;
          return (
            <div className={`editorial-row ${statusMeta[status].className}`} role="row" key={audit.id}>
              <span className="editorial-cell-path" role="cell">
                <i className="editorial-subject-dot" style={{ background: subject.theme.accent }} aria-hidden="true" />
                <span>
                  <strong>{audit.title}</strong>
                  <small>{subject.label} • {audit.themeTitle} • {audit.published ? `Ch. ${audit.chapterNumber}` : "parcours non publié"}</small>
                </span>
              </span>
              <span className="editorial-cell-series" role="cell" data-label="Séries">{audit.series.join(" · ")}</span>
              <span className="editorial-cell-enrich" role="cell" data-label="Enrichissement">
                <span className="editorial-mini-bar"><i style={{ width: `${pct}%` }} /></span>
                <b>{audit.published ? `${audit.enrichedLevels}/${audit.levels}` : "Non publié"}</b>
              </span>
              <span role="cell" data-label="Questions">{audit.published ? audit.questions : "—"}</span>
              <span role="cell" data-label="XP">{audit.published ? audit.xp.toLocaleString("fr-FR") : "—"}</span>
              <span className={`editorial-status ${statusMeta[status].className}`} role="cell" data-label="État">
                {status === "complete" ? <CheckCircle size={15} weight="fill" /> : status === "todo" ? <Warning size={15} weight="fill" /> : <Circle size={15} weight="fill" />}
                {statusLabel}
              </span>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="admin-empty-state"><BookOpenText size={22} /> Aucun parcours ne correspond à ces filtres.</div>}
      </div>
    </section>
  );
}
