import { ArrowRight, CaretDown, Hammer, Lightbulb, Student } from "@phosphor-icons/react";
import type { DashboardContent, SchoolLevel, SubjectDefinition, SubjectId } from "../../domain/learning";
import { AppIcon } from "../../ui/AppIcon";
import { ProfileAvatar } from "../../ui/ProfileAvatar";
import heroDecoration from "../../assets/hero-math-decoration.png";
import { MathPreviewChart } from "./MathPreviewChart";
import { ProgressRing } from "./ProgressRing";
import { PlatformStats, type PlatformStatsValue } from "./PlatformStats";

interface DashboardProps {
  content: DashboardContent;
  progress: number;
  level: SchoolLevel;
  subject: SubjectDefinition;
  subjects: SubjectDefinition[];
  onSubjectChange: (subjectId: SubjectId) => void;
  onResumeLesson: () => void;
  onAskHint: () => void;
  onOpenGoal: () => void;
  onOpenArena: () => void;
  stats: PlatformStatsValue;
}

export function Dashboard({
  content,
  progress,
  level,
  subject,
  subjects,
  onSubjectChange,
  onResumeLesson,
  onAskHint,
  onOpenGoal,
  onOpenArena,
  stats,
}: DashboardProps) {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="header-kicker">Heureux de te revoir</p>
          <div className="greeting-title-row">
            <h1>Bonjour, {content.learnerName}</h1>
            <ProfileAvatar name={content.learnerName} photoUrl={content.learnerPhotoUrl} />
          </div>
        </div>
        <div className="dashboard-context" aria-label="Contexte scolaire">
          <div className="context-field">
            <span className="context-label">Niveau et série</span>
            <div className="fixed-level" aria-label={`Niveau et série définis à l’inscription : ${level.label}`}>
              <Student aria-hidden="true" size={22} weight="duotone" />
              <strong>{level.label}</strong>
            </div>
          </div>

          <label className="context-field subject-selector">
            <span className="context-label">Matière</span>
            <span className="select-control">
              <select
                aria-label="Matière"
                value={subject.id}
                onChange={(event) => onSubjectChange(event.target.value as SubjectId)}
              >
                {subjects.map((item) => (
                  <option key={item.id} value={item.id} disabled={!item.enabled}>
                    {item.label}{item.enabled ? "" : " — bientôt"}
                  </option>
                ))}
              </select>
              <CaretDown aria-hidden="true" size={18} weight="bold" />
            </span>
          </label>
        </div>
      </header>

      <section
        className="dashboard-construction-notice"
        role="status"
        aria-label="Information sur la version de l’application"
      >
        <span className="dashboard-construction-icon" aria-hidden="true">
          <Hammer size={24} weight="duotone" />
        </span>
        <div>
          <p>Version en construction</p>
          <h2>Excellence Lycée continue de grandir.</h2>
          <span>
            Certaines leçons et fonctionnalités sont encore en cours d’ajout ou d’amélioration.
            Tu peux déjà utiliser les espaces disponibles et nous partager tes retours.
          </span>
        </div>
        <strong>Bêta</strong>
      </section>

      <PlatformStats stats={stats} />

      <section className="lesson-hero" aria-labelledby="lesson-title">
        <div className="lesson-copy">
          <p className="lesson-eyebrow">{content.lesson.eyebrow}</p>
          <h2 id="lesson-title">{content.lesson.title}</h2>

          <div className="lesson-progress-row">
            <ProgressRing value={progress} />
            <span className="lesson-time"><strong>{content.lesson.remainingMinutes}</strong> min restantes</span>
          </div>

          <button className="primary-action" type="button" onClick={onResumeLesson}>
            <span>{content.lesson.ctaLabel}</span>
            <ArrowRight size={25} weight="bold" aria-hidden="true" />
          </button>

          <button className="hint-action" type="button" onClick={onAskHint}>
            <Lightbulb size={25} weight="duotone" aria-hidden="true" />
            <span>{content.lesson.hintLabel}</span>
          </button>
        </div>

        <div className="lesson-visual" aria-label="Aperçu interactif de la leçon">
          <img src={heroDecoration} className="hero-decoration" alt="" aria-hidden="true" />
          <MathPreviewChart />
        </div>
      </section>

      <section className="quick-actions" aria-label="À faire aujourd’hui">
        <button className="quick-action quick-action--goal" type="button" onClick={onOpenGoal}>
          <span className="quick-action-icon"><AppIcon name="target" size={29} weight="duotone" /></span>
          <span className="quick-action-copy">
            <strong>{content.dailyGoal.title}</strong>
            <span>{content.dailyGoal.completed}/{content.dailyGoal.target} étapes terminées</span>
          </span>
          <ArrowRight className="quick-action-arrow" size={25} weight="bold" aria-hidden="true" />
        </button>

        <span className="quick-action-divider" aria-hidden="true" />

        <button className="quick-action quick-action--reviews" type="button" onClick={onOpenArena}>
          <span className="quick-action-icon"><AppIcon name="arena" size={29} weight="duotone" /></span>
          <span className="quick-action-copy">
            <strong>{content.arena.title}</strong>
            <span>{content.arena.description}</span>
          </span>
          <ArrowRight className="quick-action-arrow" size={25} weight="bold" aria-hidden="true" />
        </button>
      </section>
    </main>
  );
}
