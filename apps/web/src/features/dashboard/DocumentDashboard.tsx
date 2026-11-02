import { ArrowRight, BookOpenText, Lightbulb, Lightning, PencilLine } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import type { CourseDocumentTab } from "../../domain/courseDocument";
import type { DashboardContent, SchoolLevel, SubjectDefinition, SubjectId } from "../../domain/learning";
import { MathText } from "../../components/MathText";
import { AppIcon } from "../../ui/AppIcon";
import { HomeSubjectPreview } from "./HomeSubjectPreview";
import { HomeSyncNotice, type DashboardSyncIssue } from "./HomeSyncNotice";
import { DocumentHomeHeader } from "./DocumentHomeHeader";

interface DocumentDashboardProps {
  content: DashboardContent;
  progress: number | null;
  level: SchoolLevel;
  subject: SubjectDefinition;
  subjects: SubjectDefinition[];
  courseViews: readonly CourseDocumentTab[];
  onSubjectChange: (subjectId: SubjectId) => void;
  onResumeLesson: () => void;
  onOpenCourseView: (view: CourseDocumentTab) => void;
  onAskHint: () => void;
  onOpenGoal: () => void;
  onOpenArena: () => void;
  onOpenSpace: () => void;
  syncIssue?: DashboardSyncIssue | null;
}

const viewLinks = [
  { id: "summary", label: "Résumé de la leçon", icon: BookOpenText },
  { id: "assessment", label: "Questions d’évaluation", icon: PencilLine },
  { id: "essentials", label: "L’essentiel", icon: Lightning },
] as const;

/** Historical home composition, styled like the current document-first lesson reader. */
export function DocumentDashboard({ content, progress, level, subject, subjects, courseViews, onSubjectChange, onResumeLesson, onOpenCourseView, onAskHint, onOpenGoal, onOpenArena, onOpenSpace, syncIssue }: DocumentDashboardProps) {
  const value = progress !== null && Number.isFinite(progress) ? Math.max(0, Math.min(100, Math.round(progress))) : null;
  return <main className="dashboard document-home">
    <div className="document-home-content">
      <DocumentHomeHeader name={content.learnerName} photoUrl={content.learnerPhotoUrl} level={level} subject={subject} subjects={subjects} onSubjectChange={onSubjectChange} onOpenSpace={onOpenSpace} />
      <HomeSyncNotice issue={syncIssue} />
      <section className="document-home-course" aria-labelledby="home-course-title">
        <div className="document-home-hero">
          <div className="document-home-copy"><p className="document-home-eyebrow">{content.lesson.eyebrow}</p><h2 id="home-course-title"><MathText>{content.lesson.title}</MathText></h2></div>
          <div className="document-home-visual"><HomeSubjectPreview subject={subject} lessonTitle={content.lesson.title} /></div>
          <div className="document-home-study">
            <div className="document-home-progress">
              <div className={`document-home-ring${value === null ? " is-unavailable" : ""}`} style={{ "--home-progress": `${value ?? 0}%` } as CSSProperties} role="img" aria-label={value === null ? "Progression indisponible" : `Progression enregistrée : ${value} %`}><strong>{value === null ? "—" : `${value} %`}</strong></div>
              <p>{value === null ? "Progression indisponible" : "Progression enregistrée"}</p>
            </div>
            <button className="document-home-primary" type="button" onClick={onResumeLesson}><span>{content.lesson.ctaLabel}</span><ArrowRight size={22} aria-hidden="true" /></button>
            <button className="document-home-hint" type="button" onClick={onAskHint}><Lightbulb size={22} weight="duotone" aria-hidden="true" /><span>{content.lesson.hintLabel}</span></button>
          </div>
        </div>
        <nav className="document-home-course-links" aria-label="Ouvrir une partie du cours">
          {viewLinks.filter(view => courseViews.includes(view.id)).map(({ id, label, icon: Icon }) => <button type="button" data-course-view={id} key={id} onClick={() => onOpenCourseView(id)}><Icon size={21} aria-hidden="true" /><span>{label}</span><ArrowRight size={18} className="document-home-view-arrow" aria-hidden="true" /></button>)}
        </nav>
      </section>
      <section className="document-home-shortcuts" aria-label="Pour continuer">
        <button type="button" onClick={onOpenGoal}><span className="document-home-shortcut-icon"><AppIcon name="target" size={28} weight="duotone" /></span><span><strong>Objectif du jour</strong><small>Choisir une leçon à revoir</small></span><ArrowRight size={22} aria-hidden="true" /></button>
        <button type="button" onClick={onOpenArena}><span className="document-home-shortcut-icon is-practice"><AppIcon name="arena" size={28} weight="duotone" /></span><span><strong>M’entraîner</strong><small>Exercices, devoirs et sujets de BAC</small></span><ArrowRight size={22} aria-hidden="true" /></button>
      </section>
    </div>
  </main>;
}
