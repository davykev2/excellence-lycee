import { CaretDown, Student } from "@phosphor-icons/react";
import type { DashboardContent, SchoolLevel, SubjectDefinition, SubjectId } from "../../domain/learning";
import { ProfileAvatar } from "../../ui/ProfileAvatar";
import { HomeActionGrid, type HomeActionGridProps } from "./HomeActionGrid";
import { HomeSyncNotice, type DashboardSyncIssue } from "./HomeSyncNotice";

interface OriginalDashboardProps extends HomeActionGridProps {
  content: DashboardContent;
  level: SchoolLevel;
  subject: SubjectDefinition;
  subjects: SubjectDefinition[];
  onSubjectChange: (subjectId: SubjectId) => void;
  onResumeLesson: () => void;
  onOpenSpace: () => void;
  syncIssue?: DashboardSyncIssue | null;
}

/** Homepage as it was when this isolated laboratory was created (29 October). */
export function OriginalDashboard({ content, level, subject, subjects, onSubjectChange, onResumeLesson, onOpenSpace, syncIssue, ...actions }: OriginalDashboardProps) {
  return <main className="dashboard home-simple has-home-cards">
    <header className="dashboard-header">
      <div><p className="header-kicker">Un petit pas aujourd’hui</p><h1>Bonjour, {content.learnerName.split(/\s+/)[0]}</h1><p className="home-welcome">Qu’as-tu envie d’apprendre ?</p></div>
      <button className="home-profile-link" type="button" onClick={onOpenSpace} aria-label="Ouvrir mon espace personnel"><ProfileAvatar name={content.learnerName} photoUrl={content.learnerPhotoUrl} /></button>
    </header>
    <div className="home-school-context" aria-label="Contexte scolaire">
      <span className="home-level"><Student size={19} weight="duotone" /><strong>{level.label}</strong></span>
      <label className="home-subject"><span className="sr-only">Matière du cours à reprendre</span><select aria-label="Matière du cours à reprendre" value={subject.id} onChange={event => onSubjectChange(event.target.value as SubjectId)}>{subjects.map(item => <option key={item.id} value={item.id} disabled={!item.enabled}>{item.label}{item.enabled ? "" : " — bientôt"}</option>)}</select><CaretDown size={17} aria-hidden="true" /></label>
    </div>
    <HomeSyncNotice issue={syncIssue} />
    <HomeActionGrid {...actions} resume={{ label: content.lesson.eyebrow, title: content.lesson.title, onOpen: onResumeLesson }} />
  </main>;
}
