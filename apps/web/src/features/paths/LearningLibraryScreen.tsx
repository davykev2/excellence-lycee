import {
  ArrowLeft,
  ArrowRight,
  Atom,
  BookOpenText,
  Calculator,
  Clock,
  Flask,
  GlobeHemisphereWest,
  Leaf,
  Medal,
  Quotes,
  Translate,
} from "@phosphor-icons/react";
import type { LearningPath } from "../../domain/paths";
import type { SchoolLevel, SubjectDefinition, SubjectId } from "../../domain/learning";
import type { CurriculumLessonTitle } from "../../data/curriculumCatalog";
import { formatXp } from "../../data/xpRewards";

interface LearningLibraryScreenProps {
  level: SchoolLevel;
  subjects: SubjectDefinition[];
  selectedSubjectId: SubjectId;
  paths: LearningPath[];
  catalogLessons: CurriculumLessonTitle[];
  onSubjectChange: (subjectId: SubjectId) => void;
  onSelectPath: (pathId: string) => void;
  onBackHome: () => void;
}

const subjectIcons = {
  mathematics: Calculator,
  "physics-chemistry": Atom,
  french: BookOpenText,
  english: Translate,
  svt: Leaf,
  philosophy: Quotes,
  "history-geography": GlobeHemisphereWest,
} satisfies Record<SubjectId, typeof Calculator>;

export function LearningLibraryScreen({ level, subjects, selectedSubjectId, paths, catalogLessons, onSubjectChange, onSelectPath, onBackHome }: LearningLibraryScreenProps) {
  const displayedSequence = (lesson: CurriculumLessonTitle) => {
    const path = paths.find((item) => item.id === lesson.pathId && item.levelIds.includes(level.id));
    return path ? (path.chapterNumberByLevel?.[level.id] ?? path.chapterNumber) : lesson.sequence;
  };
  const visibleLessons = catalogLessons
    .filter((lesson) => lesson.subjectId === selectedSubjectId && lesson.levelId === level.id)
    .sort((left, right) => displayedSequence(left) - displayedSequence(right) || (left.trackLabel ?? "").localeCompare(right.trackLabel ?? "", "fr"));
  const selectedSubject = subjects.find((subject) => subject.id === selectedSubjectId) ?? subjects[0];
  const SelectedIcon = subjectIcons[selectedSubject.id] ?? Flask;

  return (
    <main className="library-page">
      <header className="library-header">
        <button className="path-back-button" type="button" onClick={onBackHome}><ArrowLeft size={20} weight="bold" />Accueil</button>
        <span className="library-level-badge">Programme • {level.label}</span>
      </header>

      <section className="library-intro">
        <div><p className="path-kicker">Parcours d’apprentissage</p><h1>Qu’est-ce que tu veux maîtriser ?</h1><p>Choisis une matière, puis une leçon. Davy te guidera niveau après niveau.</p></div>
        <SelectedIcon size={58} weight="duotone" aria-hidden="true" />
      </section>

      <nav className="subject-picker" aria-label="Choisir une matière">
        {subjects.map((subject) => {
          const Icon = subjectIcons[subject.id];
          const isActive = subject.id === selectedSubjectId;
          const hasCatalog = catalogLessons.some((lesson) => lesson.subjectId === subject.id && lesson.levelId === level.id);
          return (
            <button className={isActive ? "is-active" : ""} type="button" key={subject.id} onClick={() => onSubjectChange(subject.id)}>
              <Icon size={22} weight={isActive ? "fill" : "duotone"} />
              <span>{subject.shortLabel}</span>
              {!hasCatalog && <small>À fournir</small>}
            </button>
          );
        })}
      </nav>

      <section className="lesson-library" aria-live="polite">
        <div className="library-section-title"><div><p className="path-kicker">{selectedSubject.label}</p><h2>Leçons du programme</h2></div><span>{visibleLessons.length} leçon{visibleLessons.length > 1 ? "s" : ""}</span></div>
        {visibleLessons.length ? (
          <div className="lesson-library-grid">
            {visibleLessons.map((lesson) => {
              const path = lesson.pathId ? paths.find((item) => item.id === lesson.pathId && item.levelIds.includes(level.id)) : undefined;
              const levelCount = path?.modules.reduce((count, module) => count + module.lessons.length, 0) ?? 0;
              const totalXp = path?.modules.flatMap((module) => module.lessons).reduce((sum, item) => sum + item.xp, 0) ?? 0;
              const sequence = path ? (path.chapterNumberByLevel?.[level.id] ?? path.chapterNumber) : lesson.sequence;
              return (
                <button className={`lesson-library-card ${path ? "is-ready" : "is-planned"}`} type="button" key={lesson.id} disabled={!path} onClick={() => path && onSelectPath(path.id)}>
                  <span className="lesson-library-number">{String(sequence).padStart(2, "0")}</span>
                  <div>
                    <p>{lesson.strand ?? `Leçon ${sequence}`}{lesson.trackLabel ? ` • Série ${lesson.trackLabel}` : ""}</p>
                    <h3>{lesson.title}</h3>
                    <span>{path ? path.description : "Titre officiel ajouté. Le contenu détaillé sera publié prochainement."}</span>
                  </div>
                  {path ? (
                    <footer><span><Clock size={17} />{path.estimatedMinutes} min</span><span><BookOpenText size={17} />{levelCount} niveaux</span><span><Medal size={17} />{formatXp(totalXp)} XP</span><ArrowRight className="lesson-library-arrow" size={22} weight="bold" /></footer>
                  ) : (
                    <footer><span><Clock size={17} />Contenu à venir</span><span className="lesson-library-source">Progression officielle 2025-2026</span></footer>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="library-empty"><SelectedIcon size={46} weight="duotone" /><h3>Progression à fournir</h3><p>Nous n’avons pas encore reçu la liste officielle des leçons de {selectedSubject.label} pour la {level.label}.</p></div>
        )}
      </section>
    </main>
  );
}
