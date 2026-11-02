import type { ArenaExerciseItem, ArenaExerciseQuestion } from "../../domain/arenaExercises";
import { exercise, written } from "./builders";
export { choice, short, tf, written } from "./builders";
export function integralExercise(number: number, title: string, statement: string, questions: ArenaExerciseQuestion[], options: Partial<ArenaExerciseItem> = {}): ArenaExerciseItem {
  const page = number <= 6 ? 181 : number <= 17 ? 182 : number <= 26 ? 183 : number <= 33 ? 184 : number <= 37 ? 185 : number <= 47 ? 186 : number <= 54 ? 187 : number <= 60 ? 188 : number <= 64 ? 189 : 190;
  return exercise(number, title, statement || "Résous les questions suivantes.", questions, { id: "tc-l7-ex-" + number, sourcePage: page, ...options, questions: questions.map((q, i) => ({ ...q, id: "tc-l7-q-" + number + "-" + (i + 1) })) });
}
/** Calculations asking for a method remain written work, not fragile symbolic string matching. */
export function integralCalculation(label: string, prompt: string, method: string, primitive: string, evaluation: string, result: string): ArenaExerciseQuestion {
  return written(label, prompt, method + "\n\nUne primitive sur l’intervalle considéré est :\n\n$$F(x)=" + primitive + ".$$\n\nOn prend la valeur à la borne du haut **moins** celle à la borne du bas :\n\n$$" + evaluation + ".$$\n\n**Résultat :** $" + result + "$.");
}
