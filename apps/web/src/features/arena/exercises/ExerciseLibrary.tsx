import { BookOpenText, CaretRight } from "@phosphor-icons/react";
import { MathText } from "../../../components/MathText";
import type { ArenaExerciseSelection } from "../../../domain/arenaExercises";
import type { SubjectId } from "../../../domain/learning";
import { appRouteUrl } from "../../../routing/appRoute";
import type { ExerciseLibrarySection } from "./exerciseLibraryModel";
import { ExercisePlayer } from "./ExercisePlayer";

export function ExerciseLibrary({ sections, selection, onSelection, userId, lessonKey, subjectId, onReviewCourse }: {
  sections: ExerciseLibrarySection[]; selection: ArenaExerciseSelection; onSelection: (selection: ArenaExerciseSelection) => void;
  userId: string; lessonKey: string; subjectId: SubjectId; onReviewCourse: (pathId: string, topicId: string) => void;
}) {
  const category = selection.category ?? "fixation";
  const visible = sections.filter(section => section.category === category);
  const renderExercises = (section: ExerciseLibrarySection) => <div className="practice-exercise-list">{section.exercises.map((exercise, index) => {
    const headingId = `practice-exercise-heading-${section.id}-${exercise.id}`;
    const objectiveCount = exercise.questions?.filter(question => question.answer.kind !== "written").length ?? 0;
    return <article className="practice-exercise" key={exercise.id} aria-labelledby={headingId} id={`exercice-${exercise.id}`}>
      <header className="practice-exercise-heading">
        <span className="practice-exercise-number">Exercice {exercise.sourceNumber ?? index+1}</span>
        <div><h2 id={headingId}><MathText>{exercise.title}</MathText></h2><p>{objectiveCount ? `${objectiveCount} question${objectiveCount > 1 ? "s" : ""}` : "Raisonnement rédigé"}</p></div>
      </header>
      <ExercisePlayer key={`${userId}:${section.revision}:${exercise.id}`} exercise={exercise} userId={userId} context={`${lessonKey}:${section.revision}`} onReview={section.courseTopicId ? () => onReviewCourse(lessonKey, section.courseTopicId) : undefined} />
    </article>;
  })}</div>;
  if (!visible.length) return <section className="practice-empty"><BookOpenText size={34} aria-hidden="true" /><h2>Les exercices arrivent bientôt</h2><p>Aucun exercice n’est encore proposé dans cette catégorie pour cette leçon.</p></section>;
  if (category === "fixation" && selection.sectionId) {
    const section = visible.find(item => item.id === selection.sectionId);
    if (!section) return <p className="practice-error" role="alert">Cette rubrique n’est pas disponible pour cette leçon. Reviens à la liste des rubriques.</p>;
    return <section className="practice-library practice-rubric-page" aria-label="Tous les exercices de cette rubrique">
      {renderExercises(section)}
    </section>;
  }
  return <section className="practice-library" aria-label="Exercices de la catégorie sélectionnée">
    {visible.map(section => {
      if (category !== "fixation") return <div key={section.id}>{renderExercises(section)}</div>;
      const next: ArenaExerciseSelection = { lessonKey, category: "fixation", sectionId: section.id };
      return <section className="practice-section" key={section.id}>
        <h2><a className="practice-section-link" href={appRouteUrl({ navigation: "arena", subjectId, arenaMode: "exercises", exerciseSelection: next })} onClick={event => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault(); onSelection(next);
        }}>
          <span><MathText>{section.title}</MathText></span><small>{section.exercises.length} exercice{section.exercises.length > 1 ? "s" : ""}</small><CaretRight size={20} aria-hidden="true" />
        </a></h2>
      </section>;
    })}
  </section>;
}
