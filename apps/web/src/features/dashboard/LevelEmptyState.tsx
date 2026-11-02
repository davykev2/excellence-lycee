import { ArrowLeft, ArrowRight, BookOpenText, CaretDown, Student } from "@phosphor-icons/react";
import type { LearnerProfile, SchoolLevel, SubjectDefinition, SubjectId } from "../../domain/learning";
import { ProfileAvatar } from "../../ui/ProfileAvatar";
import { HomeWelcome } from "./HomeWelcome";
import { HomeSyncNotice, type DashboardSyncIssue } from "./HomeSyncNotice";
import { DocumentHomeHeader } from "./DocumentHomeHeader";

interface LevelEmptyStateProps {
  mode: "home" | "paths";
  profile: LearnerProfile;
  level: SchoolLevel;
  subject: SubjectDefinition;
  subjects: SubjectDefinition[];
  onSubjectChange: (subjectId: SubjectId) => void;
  onOpenProfile: () => void;
  onBackHome: () => void;
  userId?: string;
  visitKey?: number;
  onOpenSpace?: () => void;
  onOpenCourses?: () => void;
  syncIssue?: DashboardSyncIssue | null;
  homeStyle?: "document";
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
  userId = "anonymous", visitKey, onOpenSpace, onOpenCourses, syncIssue, homeStyle,
}: LevelEmptyStateProps) {
  if (mode === "home" && homeStyle === "document") return <main className="dashboard document-home"><div className="document-home-content">
    <DocumentHomeHeader name={profile.name} photoUrl={profile.photoUrl} level={level} subject={subject} subjects={subjects} onSubjectChange={onSubjectChange} onOpenSpace={onOpenSpace ?? onOpenProfile} />
    <HomeSyncNotice issue={syncIssue} />
    <section className="document-home-empty" aria-labelledby="document-home-empty-title"><BookOpenText size={32} aria-hidden="true" /><h2 id="document-home-empty-title">Aucun cours disponible pour le moment</h2><p>Les cours seront accessibles ici dès leur publication.</p><button className="document-home-primary" type="button" onClick={onOpenCourses ?? onOpenProfile}>Voir mes cours <ArrowRight size={20} aria-hidden="true" /></button></section>
  </div></main>;
  if (mode === "home") return <HomeWelcome userId={userId} levelId={level.id} visitKey={visitKey} name={profile.name} photoUrl={profile.photoUrl} onOpenSpace={onOpenSpace ?? onOpenProfile}>
    <HomeSyncNotice issue={syncIssue} />
    <section className="home-no-course" aria-labelledby="home-no-course-title">
      <h2 id="home-no-course-title">Aucun cours disponible pour le moment</h2>
      <p>Les cours seront accessibles ici dès leur publication.</p>
      <button className="home-other-course" type="button" onClick={onOpenCourses ?? onOpenProfile}>Voir mes cours <ArrowRight size={18} /></button>
    </section>
  </HomeWelcome>;
  return (
    <main className="level-empty-page">
      {(
        <button className="path-back-button" type="button" onClick={onBackHome}><ArrowLeft size={20} weight="bold" /> Accueil</button>
      )}
      <header className="level-empty-header">
        <div><p className="header-kicker">Contexte scolaire actualisé</p><div className="greeting-title-row"><h1>Bonjour, {profile.name}</h1><ProfileAvatar name={profile.name} photoUrl={profile.photoUrl} /></div></div>
        <div className="dashboard-context" aria-label="Contexte scolaire">
          <div className="context-field"><span className="context-label">Niveau et série</span><div className="fixed-level"><Student size={22} weight="duotone" /><strong>{level.label}</strong></div></div>
          <label className="context-field subject-selector"><span className="context-label">Matière</span><span className="select-control"><select aria-label="Matière" value={subject.id} onChange={(event) => onSubjectChange(event.target.value as SubjectId)}>{subjects.map((item) => <option key={item.id} value={item.id} disabled={!item.enabled}>{item.label}{item.enabled ? "" : " — bientôt"}</option>)}</select><CaretDown size={18} weight="bold" /></span></label>
        </div>
      </header>

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
