import type { ArenaExerciseItem, ArenaExerciseQuestion } from "../../domain/arenaExercises";
import { exercise } from "./builders";
export { written, short } from "./builders";
export function differentialExercise(number: number, title: string, statement: string, questions: ArenaExerciseQuestion[], options: Partial<ArenaExerciseItem> = {}): ArenaExerciseItem {
  const page = number <= 22 ? 204 : number <= 30 ? 205 : number <= 35 ? 206 : number <= 38 ? 207 : 208;
  return exercise(number, title, statement || "Résous les questions suivantes.", questions, {
    id: "tc-l8-ex-" + number, sourcePage: page, ...options,
    questions: questions.map((q, i) => ({ ...q, id: "tc-l8-q-" + number + "-" + (i + 1) })),
  });
}
