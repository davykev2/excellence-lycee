import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  FlagCheckered,
  Gauge,
  LockKey,
  Medal,
  Play,
  RocketLaunch,
  Target,
} from "@phosphor-icons/react";
import type { LearningLesson, LearningPath } from "../../domain/paths";
import type { SchoolLevel, SubjectDefinition } from "../../domain/learning";
import type { ProgressLesson } from "../progress/useLearningProgress";
import { CompanionAvatar } from "../companion/CompanionAvatar";
import { formatXp } from "../../data/xpRewards";

interface MathPathScreenProps {
  path: LearningPath;
  level: SchoolLevel;
  subject: SubjectDefinition;
  progressByLesson: Record<string, ProgressLesson>;
  completedLessonIds: Set<string>;
  unlockAllLessons?: boolean;
  onOpenLesson: (lessonId: string) => void;
  onBackToLibrary: () => void;
}

export function getPathLessons(path: LearningPath) {
  return path.modules.flatMap((module) => module.lessons);
}

export function getNextLesson(path: LearningPath, completedLessonIds: Set<string>) {
  return getPathLessons(path).find((lesson) => !completedLessonIds.has(lesson.id));
}

function getLessonState(
  lesson: LearningLesson,
  lessonIndex: number,
  lessons: LearningLesson[],
  completedLessonIds: Set<string>,
  unlockAllLessons: boolean,
) {
  if (completedLessonIds.has(lesson.id)) return "completed";
  if (unlockAllLessons) return "available";
  if (lessonIndex === 0 || completedLessonIds.has(lessons[lessonIndex - 1].id)) return "available";
  return "locked";
}

const levelIcons = [Play, Gauge, RocketLaunch, Target, FlagCheckered];

export function MathPathScreen({
  path,
  level,
  subject,
  progressByLesson,
  completedLessonIds,
  unlockAllLessons = false,
  onOpenLesson,
  onBackToLibrary,
}: MathPathScreenProps) {
  const lessons = getPathLessons(path);
  const completedCount = lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;
  const progress = Math.round((completedCount / lessons.length) * 100);
  const nextLesson = getNextLesson(path, completedLessonIds) ?? lessons[lessons.length - 1];

  return (
    <main className="mastery-page">
      <header className="mastery-header">
        <button className="path-back-button" type="button" onClick={onBackToLibrary}>
          <ArrowLeft size={20} weight="bold" aria-hidden="true" />
          <span>Toutes les leçons</span>
        </button>
        <div className="path-context"><span>{level.label}</span><strong>{subject.label}</strong></div>
      </header>

      <section className="mastery-hero" aria-labelledby="mastery-title">
        <div className="mastery-hero-copy">
          <p className="path-kicker">Chapitre {path.chapterNumber} • {path.theme.title}</p>
          <h1 id="mastery-title">{path.title}</h1>
          <p>{path.description}</p>
          <div className="mastery-metrics">
            <span><Clock size={19} weight="duotone" /> {path.estimatedMinutes} min</span>
            <span><Medal size={19} weight="duotone" /> {formatXp(lessons.reduce((sum, lesson) => sum + lesson.xp, 0))} XP</span>
            <span><Target size={19} weight="duotone" /> {completedCount}/{lessons.length} niveaux</span>
          </div>
        </div>
        <div className="mastery-progress-card" aria-label={`Progression ${progress} %`}>
          <div className="mastery-progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
            <span><strong>{progress}%</strong><small>maîtrisé</small></span>
          </div>
          <button className="primary-action is-compact" type="button" onClick={() => onOpenLesson(nextLesson.id)}>
            {completedCount === 0 ? "Commencer" : completedCount === lessons.length ? "Revoir le défi" : "Continuer"}
            <ArrowRight size={19} weight="bold" />
          </button>
        </div>
      </section>

      <section className="mastery-road-section" aria-label="Parcours de maîtrise">
        <div className="mastery-davy-intro">
          <CompanionAvatar motion="wave" className="mastery-davy-avatar" decorative />
          <div className="mastery-davy-bubble">
            <strong>{unlockAllLessons ? "Accès administrateur actif" : "On avance ensemble !"}</strong>
            <span>
              {unlockAllLessons
                ? "Tous les niveaux publiés de cette leçon sont accessibles. Les scores et XP restent ceux réellement obtenus."
                : "Termine un niveau avec au moins 10/20 pour débloquer le suivant. Tu peux le refaire jusqu’à gagner tous ses XP."}
            </span>
          </div>
        </div>

        <div className="mastery-road">
          <span className="mastery-road-line" aria-hidden="true" />
          <ol>
            {lessons.map((lesson, index) => {
              const state = getLessonState(lesson, index, lessons, completedLessonIds, unlockAllLessons);
              const progressEntry = progressByLesson[lesson.id];
              const Icon = levelIcons[index % levelIcons.length];
              return (
                <li className={`mastery-stop is-${state} ${index % 2 === 0 ? "is-left" : "is-right"}`} key={lesson.id}>
                  <button
                    className="mastery-level-node"
                    type="button"
                    disabled={state === "locked"}
                    onClick={() => onOpenLesson(lesson.id)}
                    aria-label={`Niveau ${index + 1} : ${lesson.title}${state === "locked" ? ", verrouillé" : ""}`}
                  >
                    {state === "completed" ? <Check size={36} weight="bold" /> : state === "locked" ? <LockKey size={31} weight="fill" /> : <Icon size={36} weight="duotone" />}
                  </button>
                  <div className="mastery-level-card">
                    <div className="mastery-level-meta">
                      <span>Niveau {index + 1}</span>
                      <span>+{formatXp(lesson.xp)} XP</span>
                    </div>
                    <h2>{lesson.title}</h2>
                    <p>{lesson.summary}</p>
                    <div className="mastery-level-footer">
                      <span>{lesson.durationMinutes} min</span>
                      {state === "completed" ? (
                        <strong>{progressEntry?.bestScore ?? 20}/20 • {formatXp(progressEntry?.xpAwarded ?? lesson.xp)}/{formatXp(lesson.xp)} XP</strong>
                      ) : state === "available" ? <strong>{unlockAllLessons && index > 0 ? "Accessible en tant qu’administrateur" : "Prêt à commencer"}</strong> : <strong>Termine le niveau {index}</strong>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </main>
  );
}
