import type { ArenaExerciseItem, ArenaExerciseQuestion } from "../../domain/arenaExercises";
import { exercise, short } from "./builders";

export function logarithmExercise(number: number, title: string, statement: string, questions: ArenaExerciseQuestion[], options: Partial<ArenaExerciseItem> = {}): ArenaExerciseItem {
  const page = number <= 10 ? 104 : number <= 17 ? 105 : number <= 28 ? 106 : number <= 34 ? 107 : number <= 37 ? 108 : number <= 39 ? 109 : 110;
  return exercise(number, title, statement, questions, {
    id: `tc-l4-ex-${number}`, sourcePage: page, ...options,
    questions: questions.map((question, index) => ({ ...question, id: `tc-l4-q-${number}-${index + 1}` })),
  });
}
export const limitAnswer = (label: string, prompt: string, value: "0" | "1" | "-1/2" | "+infini" | "-infini", explanation: string) => short(label, prompt,
  value.includes("infini") ? `$${value.startsWith("-") ? "-" : "+"}\\infty$` : value === "-1/2" ? "$-1/2$" : `$${value}$`,
  value.includes("infini") ? [value, value.startsWith("-") ? "-∞" : "+∞"] : [value], explanation);
