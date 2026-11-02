import type { CourseLibraryReference } from "../domain/courseDocument";

/** Separate from historical progress/XP paths and their official numbering. */
export const courseLibraryReferences: CourseLibraryReference[] = [{
  id: "terminale-cd-math-l00-reminder",
  subjectId: "mathematics",
  levelIds: ["terminale-c", "terminale-d"],
  title: "Rappel",
  theme: { number: 0, title: "Analyse et probabilité" },
  chapterNumber: 0,
}];
