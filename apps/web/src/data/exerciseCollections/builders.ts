import type { ArenaExerciseItem, ArenaExerciseQuestion } from "../../domain/arenaExercises";

export const short = (label: string, prompt: string, expected: string, accepted: string[], explanation: string): ArenaExerciseQuestion => ({
  id: label.replace(/[^a-z0-9]/gi, "-"), label, prompt, explanation, points: 1,
  answer: { kind: "short", expected, accepted },
});
export const choice = (label: string, prompt: string, options: string[], correctIndex: number, explanation: string, display: "buttons" | "select" = "buttons"): ArenaExerciseQuestion => ({
  id: label.replace(/[^a-z0-9]/gi, "-"), label, prompt, explanation, points: 1,
  answer: { kind: "choice", options, correctIndex, display },
});
export const tf = (label: string, prompt: string, value: boolean, explanation: string) => choice(label, prompt, ["Vrai", "Faux"], value ? 0 : 1, explanation);
export const written = (label: string, prompt: string, explanation: string): ArenaExerciseQuestion => ({
  id: label.replace(/[^a-z0-9]/gi, "-"), label, prompt, explanation, points: 0, answer: { kind: "written" },
});
export function exercise(sourceNumber: number, title: string, statementMarkdown: string, questions: ArenaExerciseQuestion[], options: Partial<ArenaExerciseItem> = {}): ArenaExerciseItem {
  const sourcePage = sourceNumber <= 13 ? 40 : sourceNumber <= 21 ? 41 : sourceNumber <= 32 ? 42 : sourceNumber <= 45 ? 43 : sourceNumber <= 56 ? 44 : sourceNumber <= 60 ? 45 : 46;
  return {
    id: `tc-l1-ex-${sourceNumber}`, title, statementMarkdown, sourceNumber, sourcePage,
    questions: questions.map((question, index) => ({ ...question, id: `q-${sourceNumber}-${index + 1}` })),
    correctionMarkdown: questions.map(question => `### ${question.label}\n\n${question.prompt}\n\n${question.explanation}`).join("\n\n"),
    reviewCriteria: questions.some(question => question.answer.kind === "written") ? ["J’indique la propriété utilisée et ses hypothèses.", "Je détaille les calculs ou les arguments.", "Je conclus en répondant précisément à la question."] : undefined,
    ...options,
  };
}
