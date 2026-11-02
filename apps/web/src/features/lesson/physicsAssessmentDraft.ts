import type { LessonQuestion } from "../../domain/paths";
import type { CourseQuickAnswer } from "./courseCorrection";

export function physicsAssessmentStorageKey(scope: string) {
  return `excellence-physics-assessment:${scope}:v1`;
}
export function physicsAssessmentSignature(questions: LessonQuestion[]) {
  const source = JSON.stringify(questions);
  let hash = 2166136261;
  for (let index = 0; index < source.length; index++) hash = Math.imul(hash ^ source.charCodeAt(index), 16777619);
  return `${questions.length}:${(hash >>> 0).toString(36)}`;
}
export function restorePhysicsAssessment(questions: LessonQuestion[], raw: string | null): CourseQuickAnswer[] {
  const empty = () => questions.map(question => question.type === "short-answer" ? "" : null);
  try {
    const value = JSON.parse(raw ?? "null");
    if (value?.signature !== physicsAssessmentSignature(questions) || !Array.isArray(value.answers) || value.answers.length !== questions.length) return empty();
    return questions.map((question, index) => {
      const answer: unknown = value.answers[index];
      if (question.type === "short-answer") return typeof answer === "string" && answer.length <= 2000 ? answer : "";
      return typeof answer === "number" && Number.isInteger(answer) && answer >= 0 && answer < question.options.length ? answer : null;
    });
  } catch { return empty(); }
}
export function serializePhysicsAssessment(questions: LessonQuestion[], answers: CourseQuickAnswer[]) {
  // Only drafts are persisted. Scores and open corrections are always recomputed/reset.
  return JSON.stringify({ signature: physicsAssessmentSignature(questions), answers });
}
