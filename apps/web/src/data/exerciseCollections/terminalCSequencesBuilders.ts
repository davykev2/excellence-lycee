import type { ArenaExerciseItem, ArenaExerciseQuestion } from "../../domain/arenaExercises";
import { exercise, short, written } from "./builders";
export function sequenceExercise(number: number, title: string, statement: string, questions: ArenaExerciseQuestion[], options: Partial<ArenaExerciseItem> = {}): ArenaExerciseItem {
  const page = number <= 14 ? 151 : number <= 30 ? 152 : number <= 38 ? 153 : number <= 47 ? 154 : number <= 52 ? 155 : 156;
  return exercise(number, title, statement, questions, { id: "tc-l6-ex-" + number, sourcePage: page, ...options, questions: questions.map((question, index) => ({ ...question, id: "tc-l6-q-" + number + "-" + (index + 1) })) });
}
export const seqWritten = written;
export const seqValue = (label: string, prompt: string, expected: string, accepted: string[], solution: string) => short(label, prompt, expected, accepted, solution);
export const seqLimit = (label: string, prompt: string, expected: string, solution: string) => {
  const infinite = expected.includes("infini");
  return short(label, prompt, infinite ? "$" + (expected.startsWith("-") ? "-" : "+") + "\\infty$" : "$" + expected + "$", infinite ? [expected, expected.startsWith("-") ? "-∞" : "+∞"] : [expected], solution);
};
