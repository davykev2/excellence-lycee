import { useMemo, useState } from "react";
import { BookOpenText, CheckCircle, Circle, MagnifyingGlass, Sparkle, Warning } from "@phosphor-icons/react";
import type { LearningPath } from "../../domain/paths";
import type { SubjectId } from "../../domain/learning";
import { learningPaths } from "../../data/learningPaths";
import { subjects, schoolLevels } from "../../data/programme";

// Interactions considérées comme « riches » (au-delà de la frise/numérique de base).
const richInteractionKinds = new Set(["diagram", "curve", "orbit", "schema"]);

const seriesByLevelId = new Map(schoolLevels.map((level) => [level.id, level.series] as const));

interface PathAudit {
  id: string;
  subjectId: SubjectId;
  title: string;
  chapterNumber: number;
  themeTitle: string;
  series: string[];
  levels: number;
  enrichedLevels: number;
  bodyLevels: number;
  richLevels: number;
  questions: number;
  xp: number;
}

function auditPath(path: LearningPath): PathAudit {
  const lessons = path.modules.flatMap((module) => module.lessons);
  let enrichedLevels = 0;
  let bodyLevels = 0;
  let richLevels = 0;
  let questions = 0;
  let xp = 0;
  for (const lesson of lessons) {
    const hasBody = Boolean(lesson.concept.bodyMarkdown);
    const hasRich = richInteractionKinds.has(lesson.interaction.kind ?? "");
    if (hasBody) bodyLevels += 1;
    if (hasRich) richLevels += 1;
    if (hasBody || hasRich) enrichedLevels += 1;
    questions += lesson.questions?.length ?? 1;
    xp += lesson.xp;
  }
  const series = [...new Set(path.levelIds.map((id) => seriesByLevelId.get(id) ?? id))];
  return {
    id: path.id,
    subjectId: path.subjectId,
    title: path.title,
    chapterNumber: path.chapterNumber,
    themeTitle: path.theme.title,
    series,
    levels: lessons.length,
    enrichedLevels,
    bodyLevels,
    richLevels,
    questions,
    xp,
  };
}

type StatusFilter = "all" | "complete" | "partial" | "todo";

function statusOf(audit: PathAudit): Exclude<StatusFilter, "all"> {
  if (audit.enrichedLevels === 0) return "todo";
  if (audit.enrichedLevels >= audit.levels) return "complete";
  return "partial";
}

const statusMeta: Record<Exclude<StatusFilter, "all">, { label: string; className: string }> = {
  complete: { label: "Complet", className: "is-complete" },
  partial: { label: "Partiel", className: "is-partial" },
  todo: { label: "À enrichir", className: "is-todo" },
};

export function EditorialOverview() {
  const [query, setQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<SubjectId | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const audits = useMemo(() => learningPaths.map(auditPath), []);

  const totals = useMemo(() => {
    const levels = audits.reduce((sum, a) => sum + a.levels, 0);
    const enriched = audits.reduce((sum, a) => sum + a.enrichedLevels, 0);
    const questions = audits.reduce((sum, a) => sum + a.questions, 0);
    const subjectsCovered = new Set(audits.map((a) => a.subjectId)).size;
    return { paths: audits.length, levels, enriched, questions, subjectsCovered };
  }, [audits]);

  const perSubject = useMemo(() => {
    return Object.values(subjects).map((subject) => {
      const rows = audits.filter((a) => a.subjectId === subject.id);
      const levels = rows.reduce((sum, a) => sum + a.levels, 0);
      const enriched = rows.reduce((sum, a) => sum + a.enrichedLevels, 0);
      return {
        id: subject.id,
        label: subject.label,
        accent: subject.theme.accent,
        paths: rows.length,
        levels,
        enriched,
        coverage: levels === 0 ? 0 : Math.round((enriched / levels) * 100),
      };
    }).filter((row) => row.paths > 0)
      .sort((a, b) => a.coverage - b.coverage);
  }, [audits]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return audits
      .filter((a) => subjectFilter === "all" || a.subjectId === subjectFilter)
      .filter((a) => statusFilter === "all" || statusOf(a) === statusFilter)
      .filter((a) => !q || a.title.toLowerCase().includes(q) || a.themeTitle.toLowerCase().includes(q) || subjects[a.subjectId].label.toLowerCase().includes(q))
      .sort((a, b) => {
        const ra = a.levels ? a.enrichedLevels / a.levels : 1;
        const rb = b.levels ? b.enrichedLevels / b.levels : 1;
        if (ra !== rb) return ra - rb; // les moins enrichis d'abord
        return subjects[a.subjectId].label.localeCompare(subjects[b.subjectId].label, "fr");
      });
  }, [audits, query, subjectFilter, statusFilter]);

  const coveragePct = totals.levels === 0 ? 0 : Math.round((totals.enriched / totals.levels) * 100);

  return (
    <section className="admin-section editorial-overview" data-testid="admin-editorial">
      <div className="admin-section-heading">
        <div>
          <p className="admin-eyebrow">Vue d’ensemble éditoriale</p>
          <h2>Couverture du catalogue</h2>
          <p>Tous les parcours en ligne, leur découpage et l’état d’enrichissement de chaque niveau — calculé en direct depuis le contenu réel de l’application.</p>
        </div>
      </div>

      <div className="editorial-kpis">
        <article className="editorial-kpi is-navy">
          <span>Parcours publiés</span>
          <strong>{totals.paths}</strong>
          <small>{totals.subjectsCovered} matières couvertes</small>
        </article>
        <article className="editorial-kpi">
          <span>Niveaux au total</span>
          <strong>{totals.levels}</strong>
          <small>{totals.questions.toLocaleString("fr-FR")} questions</small>
        </article>
        <article className="editorial-kpi is-accent">
          <span>Niveaux enrichis</span>
          <strong>{totals.enriched} <em>/ {totals.levels}</em></strong>
          <small>{coveragePct}% du catalogue</small>
        </article>
        <article className="editorial-kpi">
          <span>Reste à enrichir</span>
          <strong>{totals.levels - totals.enriched}</strong>
          <small>niveaux sans cours rédigé ni interaction riche</small>
        </article>
      </div>

      <div className="editorial-legend">
        <Sparkle size={16} weight="fill" />
        <span>Un niveau est <strong>enrichi</strong> s’il possède un cours rédigé (bodyMarkdown) <em>ou</em> une interaction riche (organigramme, courbe, orbite, schéma).</span>
      </div>

      <section className="editorial-subject-panel">
        <h3>Par matière</h3>
        <div className="editorial-subject-grid">
          {perSubject.map((row) => (
            <article key={row.id} style={{ "--subj-accent": row.accent } as React.CSSProperties}>
              <div className="editorial-subject-head">
                <strong>{row.label}</strong>
                <b>{row.coverage}%</b>
              </div>
              <div className="editorial-bar"><i style={{ width: `${row.coverage}%` }} /></div>
              <small>{row.paths} parcours • {row.enriched}/{row.levels} niveaux enrichis</small>
            </article>
          ))}
        </div>
      </section>

      <div className="admin-toolbar">
        <label className="admin-search"><MagnifyingGlass size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un parcours, un thème, une matière…" /></label>
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
          const status = statusOf(audit);
          const pct = audit.levels === 0 ? 0 : Math.round((audit.enrichedLevels / audit.levels) * 100);
          const subject = subjects[audit.subjectId];
          return (
            <div className={`editorial-row ${statusMeta[status].className}`} role="row" key={audit.id}>
              <span className="editorial-cell-path" role="cell">
                <i className="editorial-subject-dot" style={{ background: subject.theme.accent }} aria-hidden="true" />
                <span>
                  <strong>{audit.title}</strong>
                  <small>{subject.label} • Ch. {audit.chapterNumber} • {audit.themeTitle}</small>
                </span>
              </span>
              <span className="editorial-cell-series" role="cell">{audit.series.join(" · ")}</span>
              <span className="editorial-cell-enrich" role="cell">
                <span className="editorial-mini-bar"><i style={{ width: `${pct}%` }} /></span>
                <b>{audit.enrichedLevels}/{audit.levels}</b>
              </span>
              <span role="cell">{audit.questions}</span>
              <span role="cell">{audit.xp.toLocaleString("fr-FR")}</span>
              <span className={`editorial-status ${statusMeta[status].className}`} role="cell">
                {status === "complete" ? <CheckCircle size={15} weight="fill" /> : status === "todo" ? <Warning size={15} weight="fill" /> : <Circle size={15} weight="fill" />}
                {statusMeta[status].label}
              </span>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="admin-empty-state"><BookOpenText size={22} /> Aucun parcours ne correspond à ces filtres.</div>}
      </div>
    </section>
  );
}
