import { ArrowLeft, ArrowRight, BookOpenText, CaretDown, Student } from "@phosphor-icons/react";
import type { LearnerProfile, SchoolLevel, SubjectDefinition, SubjectId } from "../../domain/learning";
import { ProfileAvatar } from "../../ui/ProfileAvatar";
import { PlatformStats, type PlatformStatsValue } from "./PlatformStats";

interface LevelEmptyStateProps {
  mode: "home" | "paths";
  profile: LearnerProfile;
  level: SchoolLevel;
  subject: SubjectDefinition;
  subjects: SubjectDefinition[];
  onSubjectChange: (subjectId: SubjectId) => void;
  onOpenProfile: () => void;
  onBackHome: () => void;
  stats: PlatformStatsValue;
}

export function LevelEmptyState({
  mode,
  profile,
  level,
  subject,
  subjects,
  onSubjectChange,
  onOpenProfile,
  onBackHome,
  stats,
}: LevelEmptyStateProps) {
  return (
    <main className="level-empty-page">
      {mode === "paths" && (
        <button className="path-back-button" type="button" onClick={onBackHome}><ArrowLeft size={20} weight="bold" /> Accueil</button>
      )}
      <header className="level-empty-header">
        <div><p className="header-kicker">Contexte scolaire actualisé</p><div className="greeting-title-row"><h1>Bonjour, {profile.name}</h1><ProfileAvatar name={profile.name} photoUrl={profile.photoUrl} /></div></div>
        <div className="dashboard-context" aria-label="Contexte scolaire">
          <div className="context-field"><span className="context-label">Niveau et série</span><div className="fixed-level"><Student size={22} weight="duotone" /><strong>{level.label}</strong></div></div>
          <label className="context-field subject-selector"><span className="context-label">Matière</span><span className="select-control"><select aria-label="Matière" value={subject.id} onChange={(event) => onSubjectChange(event.target.value as SubjectId)}>{subjects.map((item) => <option key={item.id} value={item.id} disabled={!item.enabled}>{item.label}{item.enabled ? "" : " — bientôt"}</option>)}</select><CaretDown size={18} weight="bold" /></span></label>
        </div>
      </header>

      {mode === "home" && <PlatformStats stats={stats} />}

      <section className="level-empty-hero" aria-labelledby="level-empty-title">
        <div className="level-empty-icon"><BookOpenText size={44} weight="duotone" /></div>
        <p className="path-kicker">{subject.label} • {level.label}</p>
        <h2 id="level-empty-title">Les parcours de {level.label} sont en préparation</h2>
        <p>Nous ne t’afficherons que les cours alignés sur le programme ivoirien de la classe enregistrée par l’administration.</p>
        <button className="primary-action is-compact" type="button" onClick={onOpenProfile}>Consulter mon profil scolaire <ArrowRight size={20} weight="bold" /></button>
      </section>

      <section className="level-empty-steps" aria-label="Préparation du programme">
        <article><span>1</span><div><strong>Programme officiel</strong><p>Organisation des thèmes et chapitres de {level.label}.</p></div></article>
        <article><span>2</span><div><strong>Leçons interactives</strong><p>Création des manipulations, méthodes et corrections.</p></div></article>
        <article><span>3</span><div><strong>Validation pédagogique</strong><p>Relecture avant la publication aux élèves.</p></div></article>
      </section>
    </main>
  );
}
