import type { ArenaExerciseItem, ArenaExerciseQuestion } from "../../domain/arenaExercises";
import { exercise, written } from "./builders";

export function primitiveExercise(number: number, title: string, statement: string, questions: ArenaExerciseQuestion[], options: Partial<ArenaExerciseItem> = {}): ArenaExerciseItem {
  return exercise(number, title, statement, questions, {
    id: `tc-l3-ex-${number}`, sourcePage: number <= 13 ? 86 : number <= 27 ? 87 : 88,
    ...options,
    questions: questions.map((question, index) => ({ ...question, id: `tc-l3-q-${number}-${index + 1}` })),
  });
}

/** Formula productions are reviewed by the learner, never compared as brittle strings. */
export function primitivePart(label: string, prompt: string, formula: string, reasoning: string, interval: string, all = false): ArenaExerciseQuestion {
  return written(label, prompt, `${reasoning}\n\n${all ? "**Toutes les primitives sur" : "**Une primitive sur"} $${interval}$ ${all ? "sont donc :**" : "est donc :**"}\n\n$$\\boxed{F(x)=${formula}${all ? "+C" : ""}.}$$${all ? "\n\nLa constante $C$ est un réel quelconque ; sa dérivée est nulle." : ""}`);
}
