import { ArrowLeft, ArrowRight, BookOpenText, Clock, LockKey, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useEffect, useState, type CSSProperties } from "react";
import type { SchoolLevel, SubjectDefinition, SubjectId } from "../../domain/learning";
import type { LearningPath } from "../../domain/paths";
import type { CurriculumLessonTitle } from "../../data/curriculumCatalog";
import type { CourseLibraryReference } from "../../domain/courseDocument";
import { isSubjectAvailableForLevel } from "../../data/programme";

export interface LibraryCourse { id: string; subjectId: SubjectId; title: string; strand?: string; }
type LibraryMetadata = {
  subjects: readonly SubjectDefinition[]; levelId: string; paths: readonly LearningPath[];
  catalogLessons: readonly CurriculumLessonTitle[]; references?: readonly CourseLibraryReference[];
};

export function normalizeLibrarySearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").replace(/[’'\-]/g, " ").replace(/\s+/g, " ").trim();
}

/** Published metadata only, deduplicated across catalogue, loaded paths and reference cards. */
export function subjectLibraryCourses({ subjects, levelId, paths, catalogLessons, references = [] }: LibraryMetadata): LibraryCourse[] {
  const permitted = new Set(subjects.filter(subject => subject.enabled && isSubjectAvailableForLevel(subject, levelId)).map(subject => subject.id));
  const courses = new Map<string, LibraryCourse>();
  for (const lesson of catalogLessons) {
    if (lesson.levelId === levelId && lesson.pathId && permitted.has(lesson.subjectId)) {
      courses.set(lesson.pathId, { id: lesson.pathId, subjectId: lesson.subjectId, title: lesson.title, strand: lesson.strand });
    }
  }
  for (const path of paths) {
    if (path.levelIds.includes(levelId) && permitted.has(path.subjectId) && !courses.has(path.id)) {
      courses.set(path.id, { id: path.id, subjectId: path.subjectId, title: path.title });
    }
  }
  for (const reference of references) {
    if (reference.levelIds.includes(levelId) && permitted.has(reference.subjectId) && !courses.has(reference.id)) {
      courses.set(reference.id, { id: reference.id, subjectId: reference.subjectId, title: reference.title });
    }
  }
  return [...courses.values()];
}

/** Lightweight publication metadata only; choosing a card loads that subject's existing bundle. */
export function subjectLibraryItems(metadata: LibraryMetadata) {
  const { subjects, levelId } = metadata;
  const courses = subjectLibraryCourses(metadata);
  return subjects.filter(subject => isSubjectAvailableForLevel(subject, levelId)).map(subject => ({
    subject,
    ready: subject.enabled && courses.some(course => course.subjectId === subject.id),
    courseCount: courses.filter(course => course.subjectId === subject.id).length,
  }));
}

export function SubjectLibraryScreen({ level, subjects, paths, catalogLessons, references, onChooseSubject, onOpenCourse, onBackHome, mode = "courses" }: {
  level: SchoolLevel; subjects: SubjectDefinition[]; paths: LearningPath[]; catalogLessons: CurriculumLessonTitle[];
  references?: CourseLibraryReference[]; onChooseSubject: (subjectId: SubjectId) => void; onOpenCourse?: (course: LibraryCourse) => void; onBackHome: () => void;
  mode?: "courses" | "exercises";
}) {
  const [query, setQuery] = useState("");
  useEffect(() => setQuery(""), [level.id]);
  const metadata = { subjects, levelId: level.id, paths, catalogLessons, references };
  const items = subjectLibraryItems(metadata);
  const needle = normalizeLibrarySearch(query);
  const matchingCourses = needle ? subjectLibraryCourses(metadata).filter(course => normalizeLibrarySearch(`${course.title} ${course.strand ?? ""}`).includes(needle)) : [];
  const matchingItems = items.filter(({ subject }) => !needle || normalizeLibrarySearch(subject.label).includes(needle) || matchingCourses.some(course => course.subjectId === subject.id));
  return <main className="library-page subject-library-page">
    <header className="library-header"><button className="path-back-button" type="button" onClick={onBackHome}><ArrowLeft size={20} aria-hidden="true" />{mode === "exercises" ? "M’entraîner" : "Accueil"}</button><span className="library-level-badge">{level.label}</span></header>
    <section className="subject-library-banner" aria-labelledby="subject-library-title">
      <img className="subject-library-banner-art" src="/illustrations/subjects/library-banner.webp" alt="" width="1440" height="480" fetchPriority="high" />
      <div className="subject-library-heading"><p>{mode === "exercises" ? "Pratiquer, chercher, comprendre" : "Apprendre, comprendre, progresser"}</p><h1 id="subject-library-title">{mode === "exercises" ? "Exercices" : "Mes cours"}</h1></div>
      <div className="subject-library-search"><MagnifyingGlass size={25} aria-hidden="true" /><label className="visually-hidden" htmlFor="subject-library-search">Rechercher une matière, un chapitre, un cours</label><input id="subject-library-search" type="search" placeholder="Rechercher une matière, un chapitre, un cours…" value={query} onChange={event => setQuery(event.target.value)} autoComplete="off" aria-controls="subject-library-results" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Effacer la recherche"><X size={19} aria-hidden="true" /></button>}</div>
    </section>
    <p className="subject-library-results-count" role="status" aria-live="polite">{needle ? `${matchingItems.length} matière${matchingItems.length > 1 ? "s" : ""}${matchingCourses.length ? ` · ${matchingCourses.length} leçon${matchingCourses.length > 1 ? "s" : ""}` : ""}` : "Choisis ta matière"}</p>
    <div id="subject-library-results">
    <section className="subject-library-grid" aria-label="Matières de ma classe">
      {matchingItems.map(({ subject, ready, courseCount }) => {
        return <button className={`subject-library-card${ready ? "" : " is-unavailable"}`} style={{ "--subject-accent": subject.theme.accent, "--subject-soft": subject.theme.accentSoft } as CSSProperties} key={subject.id} type="button" data-subject-id={subject.id} disabled={!ready} onClick={ready ? () => onChooseSubject(subject.id) : undefined}>
          <img className="subject-library-art" src={`/illustrations/subjects/${subject.id}.webp`} alt="" width="220" height="220" loading="eager" decoding="async" />
          <span className="subject-library-copy"><strong>{subject.label}</strong><small>{ready ? <><BookOpenText size={17} aria-hidden="true" />{courseCount} leçon{courseCount > 1 ? "s" : ""}</> : !subject.enabled ? "Bientôt" : "Cours à venir"}</small></span>
          <span className="subject-library-arrow">{ready ? <ArrowRight size={21} aria-hidden="true" /> : !subject.enabled ? <LockKey size={19} aria-hidden="true" /> : <Clock size={19} aria-hidden="true" />}</span>
        </button>;
      })}
    </section>
    {needle && matchingCourses.length > 0 && <section className="subject-library-found" aria-label="Leçons trouvées"><h2>Les leçons</h2>{matchingCourses.map(course => <button type="button" key={course.id} onClick={() => onOpenCourse ? onOpenCourse(course) : onChooseSubject(course.subjectId)}><BookOpenText size={21} aria-hidden="true" /><span><strong>{course.title}</strong><small>{subjects.find(subject => subject.id === course.subjectId)?.label}</small></span><ArrowRight size={19} aria-hidden="true" /></button>)}</section>}
    {needle && matchingItems.length === 0 && <div className="subject-library-empty"><MagnifyingGlass size={30} aria-hidden="true" /><h2>Aucun résultat</h2><p>Essaie un autre mot.</p><button type="button" onClick={() => setQuery("")}>Voir toutes les matières</button></div>}
    </div>
  </main>;
}
