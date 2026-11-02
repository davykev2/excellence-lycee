import type { ArenaExerciseItem, ArenaExerciseQuestion } from "../../domain/arenaExercises";
import { exercise } from "./builders";

export function derivativeExercise(number: number, title: string, statement: string, questions: ArenaExerciseQuestion[], options: Partial<ArenaExerciseItem> = {}): ArenaExerciseItem {
  const page = number <= 8 ? 66 : number <= 15 ? 67 : number <= 23 ? 68 : number <= 29 ? 69 : number <= 35 ? 70 : number <= 40 ? 71 : number <= 44 ? 72 : number <= 47 ? 73 : 74;
  return exercise(number, title, statement, questions.map((question, index) => ({ ...question, id: `tc-l2-q-${number}-${index + 1}` })), {
    id: `tc-l2-ex-${number}`, sourcePage: page,
    ...options,
    // The shared historical builder supplies L1 ids; keep this collection independent.
    questions: questions.map((question, index) => ({ ...question, id: `tc-l2-q-${number}-${index + 1}` })),
  });
}
