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
  Quotes,
  Translate,
  MagnifyingGlass,
  X,
  ChartLine,
  Shapes,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { LearningPath } from "../../domain/paths";
import type { SchoolLevel, SubjectDefinition, SubjectId } from "../../domain/learning";
import type { CurriculumLessonTitle } from "../../data/curriculumCatalog";
import type { CourseLibraryReference } from "../../domain/courseDocument";
import { MathText } from "../../components/MathText";
import { mathDomainForLesson, mathDomains, type MathDomain } from "../../domain/mathLibrary";

interface LearningLibraryScreenProps {
  level: SchoolLevel;
  subjects: SubjectDefinition[];
  selectedSubjectId: SubjectId;
  paths: LearningPath[];
  catalogLessons: CurriculumLessonTitle[];
  onSubjectChange: (subjectId: SubjectId) => void;
  onSelectPath: (pathId: string) => void;
  onBackHome: () => void;
  onBackSubjects?: () => void;
  mathDomain: MathDomain;
  onMathDomainChange: (domain: MathDomain) => void;
  references?: CourseLibraryReference[];
  onSelectReference?: (referenceId: string) => void;
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

export function LearningLibraryScreen({ level, subjects, selectedSubjectId, paths, catalogLessons, onSubjectChange, onSelectPath, onBackHome, onBackSubjects, mathDomain, onMathDomainChange, references = [], onSelectReference }: LearningLibraryScreenProps) {
  const [query, setQuery] = useState("");
  useEffect(() => setQuery(""), [selectedSubjectId, level.id]);
  const displayedSequence = (lesson: CurriculumLessonTitle) => {
    const path = paths.find((item) => item.id === lesson.pathId && item.levelIds.includes(level.id));
    return path ? (path.chapterNumberByLevel?.[level.id] ?? path.chapterNumber) : lesson.sequence;
  };
  const referenceLessons: Array<CurriculumLessonTitle & { reference: CourseLibraryReference }> = references.filter(reference => reference.levelIds.includes(level.id)).map(reference => ({
    id: reference.id, levelId: level.id, subjectId: reference.subjectId, title: reference.title,
    sequence: reference.chapterNumber, strand: reference.theme.title, reference,
  }));
  const visibleLessons: Array<CurriculumLessonTitle & { reference?: CourseLibraryReference }> = [...catalogLessons, ...referenceLessons]
    .filter((lesson) => lesson.subjectId === selectedSubjectId && lesson.levelId === level.id)
    .sort((left, right) => displayedSequence(left) - displayedSequence(right) || (left.trackLabel ?? "").localeCompare(right.trackLabel ?? "", "fr"));
  const selectedSubject = subjects.find((subject) => subject.id === selectedSubjectId) ?? subjects[0];
  const SelectedIcon = subjectIcons[selectedSubject.id] ?? Flask;
  const normalizedQuery = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();
  const inDomain = (lesson: CurriculumLessonTitle, domain: MathDomain) => {
    const classified = mathDomainForLesson(lesson);
    // A future unclassified lesson must remain visible until its metadata is completed.
    return !classified || classified === domain;
  };
  const domainLessons = selectedSubjectId === "mathematics" ? visibleLessons.filter(lesson => inDomain(lesson, mathDomain)) : visibleLessons;
  const matchingLessons = domainLessons.filter(lesson => `${lesson.title} ${lesson.strand ?? ""}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").includes(normalizedQuery));

  return (
    <main className={`library-page${onBackSubjects ? " is-subject-lessons" : ""}`}>
      <header className="library-header">
        <button className="path-back-button" type="button" onClick={onBackSubjects ?? onBackHome}><ArrowLeft size={20} weight="bold" />{onBackSubjects ? "Les matières" : "Accueil"}</button>
        <span className="library-level-badge">Programme • {level.label}</span>
      </header>

      <section className="library-intro">
        <div><p className="path-kicker">Le programme de {level.label}</p><h1>{onBackSubjects ? selectedSubject.label : "Mes cours"}</h1></div>
        <SelectedIcon size={58} weight="duotone" aria-hidden="true" />
      </section>

      {!onBackSubjects && <nav className="subject-picker" aria-label="Choisir une matière">
        {subjects.map((subject) => {
          const Icon = subjectIcons[subject.id];
          const isActive = subject.id === selectedSubjectId;
          const hasCatalog = catalogLessons.some((lesson) => lesson.subjectId === subject.id && lesson.levelId === level.id);
          return (
            <button
              className={isActive ? "is-active" : ""}
              type="button"
              key={subject.id}
              disabled={!subject.enabled}
              onClick={() => onSubjectChange(subject.id)}
            >
              <Icon size={22} weight={isActive ? "fill" : "duotone"} />
              <span>{subject.shortLabel}</span>
              {!subject.enabled ? <small>Bientôt</small> : !hasCatalog && <small>À fournir</small>}
            </button>
          );
        })}
      </nav>}

      {selectedSubjectId === "mathematics" && <nav className="math-domain-picker" aria-label="Domaines de mathématiques">
        {mathDomains.map(domain => {
          const Icon = domain.id === "analyse" ? ChartLine : Shapes;
          const count = visibleLessons.filter(lesson => inDomain(lesson, domain.id)).length;
          return <button type="button" key={domain.id} aria-pressed={mathDomain === domain.id} onClick={() => onMathDomainChange(domain.id)}>
            <Icon size={25} weight="duotone" aria-hidden="true" />
            <span>{domain.label}<small>{count} leçon{count > 1 ? "s" : ""}</small></span>
          </button>;
        })}
      </nav>}

      <div className="library-search" role="search"><MagnifyingGlass size={21} aria-hidden="true" /><input type="search" aria-label="Rechercher une leçon" placeholder={`Rechercher une leçon de ${selectedSubject.label.toLocaleLowerCase("fr")}`} value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" aria-label="Effacer la recherche" onClick={() => setQuery("")}><X size={19} /></button>}</div>

      <section className="lesson-library" aria-live="polite">
        <div className="library-section-title"><div><p className="path-kicker">{selectedSubject.label}</p><h2>Mes leçons</h2></div><span>{matchingLessons.length} leçon{matchingLessons.length > 1 ? "s" : ""}</span></div>
        {matchingLessons.length ? (
          <div className="lesson-library-grid">
            {matchingLessons.map((lesson) => {
              const path = lesson.pathId ? paths.find((item) => item.id === lesson.pathId && item.levelIds.includes(level.id)) : undefined;
              const reference = lesson.reference;
              const isReady = Boolean(path || (reference && onSelectReference));
              const levelCount = path?.modules.reduce((count, module) => count + module.lessons.length, 0) ?? 0;
              const hasDocument = path?.courseDocument?.levelIds.includes(level.id);
              const sequence = path ? (path.chapterNumberByLevel?.[level.id] ?? path.chapterNumber) : lesson.sequence;
              return (
                <button className={`lesson-library-card ${isReady ? "is-ready" : "is-planned"}`} type="button" key={lesson.id} disabled={!isReady} onClick={() => reference ? onSelectReference?.(reference.id) : path && onSelectPath(path.id)}>
                  <span className="lesson-library-number">{String(sequence).padStart(2, "0")}</span>
                  <div>
                    <p>{lesson.strand ?? `Leçon ${sequence}`}{lesson.trackLabel ? ` • Série ${lesson.trackLabel}` : ""}</p>
                    <h3><MathText>{lesson.title}</MathText></h3>
                  </div>
                  {isReady ? (
                    <footer><span><BookOpenText size={17} />{reference ? "Résumé" : hasDocument ? "Résumé et évaluation" : `${levelCount} parties`}</span><span className="library-open-label">Ouvrir le cours <ArrowRight className="lesson-library-arrow" size={20} weight="bold" /></span></footer>
                  ) : (
                    <footer><span><Clock size={17} />Contenu à venir</span><span className="lesson-library-source">Progression officielle 2025-2026</span></footer>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="library-empty"><SelectedIcon size={46} weight="duotone" /><h3>{normalizedQuery ? "Aucune leçon trouvée" : "Des cours sont en préparation"}</h3><p>{normalizedQuery ? "Essaie un autre mot, par exemple le début du titre de la leçon." : `Les leçons de ${selectedSubject.label} pour la ${level.label} seront ajoutées ici.`}</p>{query && <button type="button" onClick={() => setQuery("")}>Voir toutes les leçons</button>}</div>
        )}
      </section>
    </main>
  );
}
