import type { LessonQuestion, LessonSourceMetadata } from "../domain/paths";

export const q = (
  prompt: string,
  answer: string,
  wrong1: string,
  wrong2: string,
  wrong3: string,
  explanation = answer,
): LessonQuestion => ({
  prompt,
  options: [answer, wrong1, wrong2, wrong3],
  correctIndex: 0,
  explanation,
});

export const choice = (
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  sourceLabel?: string,
): LessonQuestion => ({ prompt, options, correctIndex, explanation, sourceLabel });

export const trueFalse = (
  prompt: string,
  answer: boolean,
  explanation: string,
  sourceLabel?: string,
): LessonQuestion => choice(prompt, ["Vrai", "Faux"], answer ? 0 : 1, explanation, sourceLabel);

export const createSvtSource = (documentTitle: string) => (
  pages: string,
  section: string,
  corrections: string[] = [],
): LessonSourceMetadata => ({
  documentTitle,
  pages,
  section,
  fidelity: corrections.length > 0 ? "faithful-corrected" : "faithful",
  corrections,
});
