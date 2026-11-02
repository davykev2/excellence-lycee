import type { ComponentProps } from "react";
import { terminalCDAnalysisReminderDocument } from "../../../data/courseDocuments/terminalCDAnalysisReminderDocument";
import type { CourseLibraryReference } from "../../../domain/courseDocument";
import { LessonDocumentScreen } from "./LessonDocumentScreen";

type Props = Omit<ComponentProps<typeof LessonDocumentScreen>, "path" | "document" | "readingOnly"> & {
  reference: CourseLibraryReference;
};

export function CourseReferenceScreen({ reference, ...props }: Props) {
  if (reference.id !== "terminale-cd-math-l00-reminder") throw new Error("Document de rappel inconnu.");
  return <LessonDocumentScreen {...props} path={reference} document={terminalCDAnalysisReminderDocument} readingOnly />;
}
