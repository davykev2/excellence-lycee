import { useEffect, useMemo, useState } from "react";
import type { LearningPath } from "../../domain/paths";
import type { PublishedLessonContent } from "../../domain/content";
import { apiRequest } from "../../lib/api";

function applyPublishedContents(paths: LearningPath[], contents: PublishedLessonContent[]) {
  if (!contents.length) return paths;
  const byLesson = new Map(contents.map((content) => [`${content.pathId}:${content.lessonId}`, content]));
  return paths.map((path) => ({
    ...path,
    modules: path.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) => {
        const content = byLesson.get(`${path.id}:${lesson.id}`);
        if (!content) return lesson;
        return {
          ...lesson,
          title: content.title,
          summary: content.summary,
          concept: {
            ...lesson.concept,
            eyebrow: content.eyebrow,
            bodyMarkdown: content.bodyMarkdown,
            explanation: content.bodyMarkdown,
            notation: content.keyPoint,
            example: content.example,
          },
          question: content.questions[0] ?? lesson.question,
          questions: content.questions.length ? content.questions : lesson.questions,
          source: content.source ?? lesson.source,
        };
      }),
    })),
  }));
}

export function usePublishedLessonContents(basePaths: LearningPath[], localOnly = false) {
  const [contents, setContents] = useState<PublishedLessonContent[]>([]);

  useEffect(() => {
    if (localOnly) return;
    let active = true;
    apiRequest<{ contents: PublishedLessonContent[] }>("/content/published")
      .then((response) => active && setContents(response.contents))
      .catch(() => active && setContents([]));
    return () => { active = false; };
  }, [localOnly]);

  return useMemo(() => applyPublishedContents(basePaths, contents), [basePaths, contents]);
}
