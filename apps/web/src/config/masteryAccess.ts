/**
 * Active ou désactive les prérequis séquentiels dans les parcours.
 *
 * `false` garde tous les niveaux publiés accessibles aux élèves. Le passer à
 * `true` rétablira l'ouverture progressive sans devoir modifier les écrans ou
 * les liens profonds. Les administrateurs conservent toujours un accès libre.
 */
export const MASTERY_LEVELS_REQUIRE_SEQUENCE = false;

interface MasteryLevelAccessInput {
  isAdmin: boolean;
  lessonIndex: number;
  lessonCompleted: boolean;
  previousLessonCompleted: boolean;
}

export function canOpenMasteryLevel({
  isAdmin,
  lessonIndex,
  lessonCompleted,
  previousLessonCompleted,
}: MasteryLevelAccessInput) {
  if (isAdmin || !MASTERY_LEVELS_REQUIRE_SEQUENCE) return true;
  return lessonIndex === 0 || lessonCompleted || previousLessonCompleted;
}
