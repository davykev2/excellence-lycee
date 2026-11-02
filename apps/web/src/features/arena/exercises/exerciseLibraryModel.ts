import type { ArenaExerciseCategory, ArenaExerciseCollection, PublishedArenaExerciseLevel } from "../../../domain/arenaExercises";
export const exerciseCategories: Array<{ id: ArenaExerciseCategory; label: string; shortLabel: string; description: string }> = [
  { id: "fixation", label: "Exercices de fixation", shortLabel: "Fixation", description: "Appliquer une notion à la fois" },
  { id: "deepening", label: "Approfondissement", shortLabel: "Approfondissement", description: "Combiner les méthodes de la leçon" },
  { id: "complex", label: "Situations complexes", shortLabel: "Situations complexes", description: "Construire une réponse argumentée" },
];
export type ExerciseLibrarySection = ArenaExerciseCollection["sections"][number] & { revision: string };
export function exerciseLibrarySections(collection: ArenaExerciseCollection | null, published: PublishedArenaExerciseLevel[]): ExerciseLibrarySection[] {
  // Old difficulty-only publications are deliberately outside this new pedagogical bank.
  const classified = published.filter(level => exerciseCategories.some(category => category.id === level.category)
    && (!collection || (level.levelId === collection.levelId && level.subjectId === collection.subjectId && level.lessonKey === collection.lessonKey)));
  const sorted = [...classified].sort((a,b) => b.publishedAt.localeCompare(a.publishedAt) || b.version-a.version);
  const base = (collection?.sections ?? []).map(section => {
    const replacement = sorted.find(level => level.sourceSectionId === section.id && level.category === section.category);
    return replacement
      ? { ...section, title: replacement.title, exercises: replacement.exercises, courseTopicId: replacement.courseTopicId ?? section.courseTopicId, revision: `published-${replacement.id}-v${replacement.version}` }
      : { ...section, revision: `${collection!.id}-v${collection!.version}` };
  });
  const additions = sorted.filter(level => !level.sourceSectionId || !collection?.sections.some(section => section.id === level.sourceSectionId && section.category === level.category))
    .sort((a,b) => a.stageNumber-b.stageNumber)
    .map(level => ({ id: `bank-${level.id}`, title: level.title, category: level.category!, courseTopicId: level.courseTopicId ?? "", exercises: level.exercises, revision: `published-${level.id}-v${level.version}` }));
  return [...base, ...additions];
}
