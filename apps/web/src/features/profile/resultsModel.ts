import type { LearningPath } from "../../domain/paths";
import type { ProgressLesson } from "../progress/useLearningProgress";
import { getPathLessons } from "../paths/pathLessons";

export function recordedCourseResults(paths: LearningPath[], progressByPath: Record<string, Record<string, ProgressLesson>>, levelId: string) {
  return paths.filter(path => path.levelIds.includes(levelId)).flatMap(path => {
    const lessons = getPathLessons(path);
    return Object.values(progressByPath[path.id] ?? {}).flatMap(progress => {
      const lesson = lessons.find(item => item.id === progress.lessonId);
      if (!lesson || progress.attemptCount < 1) return [];
      return [{ ...progress, pathId: path.id, pathTitle: path.title, subjectId: path.subjectId, lessonTitle: lesson.title }];
    });
  }).sort((left, right) => (Date.parse(right.completedAt) || 0) - (Date.parse(left.completedAt) || 0));
}
