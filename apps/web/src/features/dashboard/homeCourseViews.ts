import type { CourseDocumentTab } from "../../domain/courseDocument";
import type { LearningPath } from "../../domain/paths";
import { getMathEssentialKey } from "../../data/mathEssentials/registry";
import { philosophyDocumentIds } from "../../data/philosophyDocuments/registry";

/** Match the published reader's views without importing or rebuilding any lesson payload. */
export function homeCourseViews(path: LearningPath, levelId: string): CourseDocumentTab[] {
  if (!path.levelIds.includes(levelId)) return [];
  const document = path.courseDocument;
  // French/English do not yet serialize an essentials URL; do not offer a link that would fall back to summary.
  const essentialsUrl = !["french", "english"].includes(path.subjectId);
  if (document?.levelIds.includes(levelId)) return ["summary", "assessment", ...(essentialsUrl && (path.subjectId === "mathematics" || document.essentials !== undefined) ? ["essentials" as const] : [])];
  const terminale = ["terminale-a", "terminale-c", "terminale-d"].includes(levelId);
  if (terminale && (path.subjectId === "history-geography" || path.subjectId === "svt"
    || path.subjectId === "physics-chemistry" && levelId !== "terminale-a"
    || path.subjectId === "philosophy" && philosophyDocumentIds.includes(path.id))) return ["summary", "assessment", "essentials"];
  if (path.subjectId === "mathematics" && getMathEssentialKey(path.id, levelId)) return ["summary", "essentials"];
  return ["summary"];
}
