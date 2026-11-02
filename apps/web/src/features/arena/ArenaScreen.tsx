import type { LearnerProfile, SchoolLevel, SubjectDefinition, SubjectId } from "../../domain/learning";
import type { UserRole } from "../../domain/auth";
import { getBacExamBySlug, type BacExamSlug } from "../../data/bacExamCatalog";
import { canAccessBacExams, canAccessFrenchWorkshop, canAccessPhiloMemory } from "../../routing/routeAccess";
import { lazy, Suspense } from "react";
import { ArenaExercisesPage } from "./ArenaExercisesPage";
import { MathCodexPage } from "../codex/MathCodexPage";
import { DuelPreviewPage } from "./DuelPreviewPage";
import { BacCi2024ExamPage } from "./BacCi2024ExamPage";
import { BacExamLibraryPage } from "./BacExamLibraryPage";
import { BacArchiveExamPage } from "./BacArchiveExamPage";
import { HomeworkExamPage, HomeworkLibraryPage } from "./homework";
import { TrainingHub } from "./TrainingHub";
import type { ArenaExerciseSelection } from "../../domain/arenaExercises";
import { isCurrentExamSubjectLocked } from "../../config/examCollections";
import { HOMEWORKS_TEMPORARILY_LOCKED } from "../../config/homeworkAccess";
import { HomeworkLockedPage } from "./homework/HomeworkLockedPage";
import { SubjectLibraryScreen } from "../paths/SubjectLibraryScreen";
import { curriculumLessonTitles } from "../../data/curriculumCatalog";
const PhiloMemoryPage = lazy(() => import("../philosophy/PhiloMemoryPage").then(module => ({default:module.PhiloMemoryPage})));
const FrenchWorkshopPage = lazy(() => import("../french/FrenchWorkshopPage").then(module => ({default:module.FrenchWorkshopPage})));

interface ArenaScreenProps {
  userId: string;
  philoMemoryOpen: boolean;
  philoNotion?: string;
  onOpenPhiloMemory: () => void;
  onPhiloNotionChange: (notion?: string) => void;
  onReviewPhiloCourse: (pathId: string) => void;
  frenchWorkshopOpen: boolean;
  frenchSection?: string;
  onOpenFrenchWorkshop: () => void;
  onFrenchSectionChange: (section?: string) => void;
  exerciseSelection?: ArenaExerciseSelection;
  exerciseView?: "lessons";
  onChooseExerciseSubject: (subjectId: SubjectId) => void;
  onOpenExerciseLesson: (subjectId: SubjectId, lessonKey: string) => void;
  onBackExerciseSubjects: () => void;
  onExerciseSelection: (selection: ArenaExerciseSelection) => void;
  onReviewExerciseCourse: (pathId: string, topicId: string) => void;
  profile: LearnerProfile;
  level: SchoolLevel;
  subject: SubjectDefinition;
  subjects: SubjectDefinition[];
  totalXp: number;
  role: UserRole;
  homeworkAvailable: boolean;
  exercisesOpen: boolean;
  codexOpen: boolean;
  homeworkOpen: boolean;
  homeworkRef?: string;
  duelOpen: boolean;
  bacExamOpen: boolean;
  bacExamSlug?: string;
  examCollection?: "inp-hb" | "bac";
  bacArchiveYear?: number;
  bacArchivePaper?: string;
  onBacArchiveSelection: (year?: number, paperId?: string) => void;
  onExamCollectionChange: (collection: "inp-hb" | "bac") => void;
  bacResultsOpen: boolean;
  exerciseEditorOpen: boolean;
  localOnly?: boolean;
  onSubjectChange: (subjectId: SubjectId) => void;
  onBackHome: () => void;
  onOpenExercises: () => void;
  onOpenCodex: () => void;
  onOpenHomeworks: () => void;
  onSelectHomework: (homeworkRef: string) => void;
  onOpenDuel: () => void;
  onOpenBacExam: () => void;
  onSelectBacExam: (slug: BacExamSlug) => void;
  onOpenBacResults: () => void;
  onBackBacExam: () => void;
  onBackArena: () => void;
  onOpenExerciseEditor: () => void;
  onCloseExerciseEditor: () => void;
}

export function ArenaScreen({ userId, philoMemoryOpen, philoNotion, onOpenPhiloMemory, onPhiloNotionChange, onReviewPhiloCourse, frenchWorkshopOpen, frenchSection, onOpenFrenchWorkshop, onFrenchSectionChange, exerciseSelection, exerciseView, onChooseExerciseSubject, onOpenExerciseLesson, onBackExerciseSubjects, onExerciseSelection, onReviewExerciseCourse, profile, level, subject, subjects, role, homeworkAvailable, exercisesOpen, codexOpen, homeworkOpen, homeworkRef, duelOpen, bacExamOpen, bacExamSlug, examCollection, bacArchiveYear, bacArchivePaper, onBacArchiveSelection, onExamCollectionChange, bacResultsOpen, exerciseEditorOpen, localOnly = false, onSubjectChange, onOpenExercises, onOpenCodex, onOpenHomeworks, onSelectHomework, onOpenDuel, onOpenBacExam, onSelectBacExam, onOpenBacResults, onBackBacExam, onBackArena, onOpenExerciseEditor, onCloseExerciseEditor }: ArenaScreenProps) {
  if (frenchWorkshopOpen && canAccessFrenchWorkshop({levelId:level.id,role})) return <Suspense fallback={<main className="philo-memory-page" role="status">Chargement de l’atelier de français…</main>}><FrenchWorkshopPage key={`${userId}:${level.id}`} userId={userId} levelId={level.id} section={frenchSection} onSectionChange={onFrenchSectionChange} onBack={onBackArena}/></Suspense>;
  if (philoMemoryOpen && canAccessPhiloMemory({levelId:level.id,role})) return <Suspense fallback={<main className="philo-memory-page" role="status">Chargement de Mémoire philo…</main>}><PhiloMemoryPage key={`${userId}:${level.id}`} userId={userId} levelId={level.id} notion={philoNotion} onNotionChange={onPhiloNotionChange} onBack={onBackArena} onOpenCourse={onReviewPhiloCourse}/></Suspense>;
  if (exercisesOpen && !exerciseEditorOpen && !exerciseSelection?.lessonKey && exerciseView !== "lessons") return <SubjectLibraryScreen mode="exercises" level={level} subjects={subjects} paths={[]} catalogLessons={curriculumLessonTitles} onChooseSubject={onChooseExerciseSubject} onOpenCourse={course => onOpenExerciseLesson(course.subjectId, course.id)} onBackHome={onBackArena} />;
  if (exercisesOpen) return <ArenaExercisesPage userId={userId} selection={exerciseSelection} onSelection={onExerciseSelection} onReviewCourse={onReviewExerciseCourse} profile={profile} level={level} subject={subject} canEdit={role === "admin" || role === "content_editor"} canPublish={role === "admin"} editorOpen={exerciseEditorOpen} localOnly={localOnly} onBackArena={onBackArena} onBackSubjects={onBackExerciseSubjects} onOpenEditor={onOpenExerciseEditor} onCloseEditor={onCloseExerciseEditor} />;
  if (codexOpen) return <MathCodexPage onBackArena={onBackArena} />;
  if (homeworkOpen) {
    if (HOMEWORKS_TEMPORARILY_LOCKED) return <HomeworkLockedPage onBack={onBackArena} />;
    if (homeworkRef) return <HomeworkExamPage homeworkRef={homeworkRef} profile={profile} localOnly={localOnly} onBackLibrary={onOpenHomeworks} />;
    return <HomeworkLibraryPage profile={profile} isAdmin={role === "admin"} localOnly={localOnly} onBackArena={onBackArena} onOpenHomework={onSelectHomework} />;
  }
  if (duelOpen) return <DuelPreviewPage profile={profile} level={level} subject={subject} subjects={subjects} onBackArena={onBackArena} />;
  if (bacExamOpen) {
    const selectedBacExam = getBacExamBySlug(bacExamSlug);
    if (!selectedBacExam || isCurrentExamSubjectLocked(selectedBacExam.slug)) return <BacExamLibraryPage preview={localOnly} collection={selectedBacExam ? "inp-hb" : examCollection} levelId={level.id} archiveYear={bacArchiveYear} archivePaperId={bacArchivePaper} onArchiveSelection={onBacArchiveSelection} onCollectionChange={onExamCollectionChange} onBackArena={onBackArena} onOpenExam={onSelectBacExam} />;
    if (selectedBacExam.format === "facsimile") return <BacArchiveExamPage exam={selectedBacExam} preview={localOnly} onBackLibrary={onOpenBacExam} />;
    return <BacCi2024ExamPage profile={profile} resultsOpen={bacResultsOpen} localOnly={localOnly} onBackArena={onOpenBacExam} onOpenResults={onOpenBacResults} onBackExam={onBackBacExam} />;
  }
  return <TrainingHub level={level} subject={subject} subjects={subjects} onSubjectChange={onSubjectChange} onOpenExercises={onOpenExercises} onOpenHomeworks={homeworkAvailable ? onOpenHomeworks : undefined} onOpenExams={canAccessBacExams({ levelId: level.id, role }) ? onOpenBacExam : undefined} onOpenCodex={onOpenCodex} onOpenDuel={onOpenDuel} onOpenPhiloMemory={canAccessPhiloMemory({levelId:level.id,role}) ? onOpenPhiloMemory : undefined} onOpenFrenchWorkshop={canAccessFrenchWorkshop({levelId:level.id,role}) ? onOpenFrenchWorkshop : undefined} />;
}
