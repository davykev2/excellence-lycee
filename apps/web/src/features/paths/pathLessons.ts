import type { LearningPath } from "../../domain/paths";

export function getPathLessons(path: LearningPath) {
  return path.modules.flatMap((module) => module.lessons);
}

export function getNextLesson(path: LearningPath, completedLessonIds: Set<string>) {
  return getPathLessons(path).find((lesson) => !completedLessonIds.has(lesson.id));
}
