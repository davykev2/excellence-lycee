import type { ArenaExerciseItem, ArenaExerciseQuestion } from "../../domain/arenaExercises";
import { exercise, short, written } from "./builders";
export function exponentialExercise(number: number, title: string, statement: string, questions: ArenaExerciseQuestion[], options: Partial<ArenaExerciseItem> = {}): ArenaExerciseItem {
  const page = number <= 13 ? 129 : number <= 25 ? 130 : number <= 27 ? 131 : number <= 31 ? 132 : number <= 38 ? 133 : 134;
  return exercise(number, title, statement, questions, { id: `tc-l5-ex-${number}`, sourcePage: page, ...options, questions: questions.map((question, index) => ({ ...question, id: `tc-l5-q-${number}-${index + 1}` })) });
}
export const expLimit = (label: string, prompt: string, expected: "0" | "1" | "2" | "+infini" | "-infini", explanation: string) => short(label, prompt, expected.includes("infini") ? `$${expected.startsWith("-") ? "-" : "+"}\\infty$` : `$${expected}$`, expected.includes("infini") ? [expected, expected.startsWith("-") ? "-∞" : "+∞"] : [expected], explanation);
export const expWritten = (label: string, prompt: string, solution: string) => written(label, prompt, solution);
