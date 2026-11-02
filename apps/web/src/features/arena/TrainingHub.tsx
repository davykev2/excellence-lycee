import { ArrowRight, ChartLine, Lightning, LockKey, Sword, Trophy } from "@phosphor-icons/react";
import type { SchoolLevel, SubjectDefinition, SubjectId } from "../../domain/learning";
import { HOMEWORKS_TEMPORARILY_LOCKED } from "../../config/homeworkAccess";

interface TrainingHubProps {
  level: SchoolLevel;
  subject: SubjectDefinition;
  subjects: SubjectDefinition[];
  onSubjectChange: (subjectId: SubjectId) => void;
  onOpenExercises: () => void;
  onOpenHomeworks?: () => void;
  onOpenExams?: () => void;
  onOpenCodex: () => void;
  onOpenDuel: () => void;
  onOpenPhiloMemory?: () => void;
  onOpenFrenchWorkshop?: () => void;
}

export function TrainingHub({ level, onOpenExercises, onOpenHomeworks, onOpenExams, onOpenCodex, onOpenDuel, onOpenPhiloMemory, onOpenFrenchWorkshop }: TrainingHubProps) {
  const choices: Array<{ title: string; label: string; image: string; onOpen: () => void; tone: string; locked?: boolean }> = [
    { title: "Exercices", label: "Faire des exercices", image: "training/exercises", onOpen: onOpenExercises, tone: "green" },
    ...(onOpenHomeworks ? [{ title: "Devoirs", label: HOMEWORKS_TEMPORARILY_LOCKED ? "Temporairement verrouillé" : "Choisir un devoir", image: "training/homeworks", onOpen: onOpenHomeworks, tone: "blue", locked: HOMEWORKS_TEMPORARILY_LOCKED }] : []),
    ...(onOpenExams ? [{ title: "Sujets d’examen", label: "Voir les sujets", image: "training/exams", onOpen: onOpenExams, tone: "orange" }] : []),
    ...(onOpenPhiloMemory ? [{ title: "Citations & notions", label: "Ouvrir Mémoire philo", image: "subjects/philosophy", onOpen: onOpenPhiloMemory, tone: "purple" }] : []),
    ...(onOpenFrenchWorkshop ? [{ title: "Atelier de français", label: "Ouvrir l’atelier", image: "subjects/french", onOpen: onOpenFrenchWorkshop, tone: "rose" }] : []),
  ];

  return (
    <main className="training-page is-illustrated">
      <header className="training-heading"><span className="training-level">{level.label}</span></header>
      <section className="training-banner" aria-labelledby="training-title"><img src="/illustrations/subjects/library-banner.webp" alt="" width="1440" height="480" fetchPriority="high" /><div><p>À toi de jouer</p><h1 id="training-title">M’entraîner</h1></div></section>
      <section className="training-main-grid" aria-label="Choisir mon entraînement">
        {choices.map(({ title, label, image, onOpen, tone, locked }) => <button className={`training-main-card is-${tone}${locked ? " is-locked" : ""}`} type="button" key={title} disabled={locked} onClick={locked ? undefined : onOpen}>
          <img className="training-card-art" src={`/illustrations/${image}.webp`} alt="" width="220" height="220" decoding="async" /><span className="training-card-copy"><h2>{title}</h2><span className="training-card-action">{label}</span></span><span className="training-card-arrow">{locked ? <LockKey size={20} aria-hidden="true" /> : <ArrowRight size={21} weight="bold" aria-hidden="true" />}</span>
        </button>)}
      </section>
      <details className="training-more-tools">
        <summary>Autres outils et défis <span>Courbes, géométrie, duels…</span></summary>
        <div className="training-tools-grid">
          <button type="button" onClick={onOpenCodex}><ChartLine size={25} weight="duotone" /><span><strong>Courbes et géométrie</strong></span><ArrowRight size={19} /></button>
          <button type="button" onClick={onOpenDuel}><Sword size={25} weight="duotone" /><span><strong>Défier un camarade <em>En préparation</em></strong></span><ArrowRight size={19} /></button>
          {!onOpenPhiloMemory && !onOpenFrenchWorkshop && <article aria-label="Quiz, bientôt disponible"><Lightning size={25} weight="duotone" /><span><strong>Quiz <em>Bientôt</em></strong></span></article>}
          <article aria-label="Compétitions, bientôt disponibles"><Trophy size={25} weight="duotone" /><span><strong>Compétitions <em>Bientôt</em></strong></span></article>
        </div>
      </details>
    </main>
  );
}
