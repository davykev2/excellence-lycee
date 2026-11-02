import type { ArenaExerciseItem, ArenaExerciseQuestion } from "../../../domain/arenaExercises";
import { normalizeCourseAnswer } from "../../lesson/courseCorrection";
import { parseComplexAnswer,complexSubtract,complexNorm } from "../../mathematics/complexMath";

/** Small, bounded numeric grammar, never eval/Function or arbitrary function names. */
export function numericExerciseAnswer(value: string): number | null {
  const text = value.replace(/²/g, "^2").replace(/³/g, "^3").normalize("NFKC").toLowerCase().replace(/[−–]/g, "-").replace(/,/g, ".")
    .replace(/[×·]/g, "*").replace(/÷/g, "/")
    .replace(/π/g, "pi").replace(/√/g, "sqrt").replace(/∛/g, "cbrt").replace(/\s/g, "")
    .replace(/(\d)(pi|sqrt|cbrt|sin|cos|ln|exp|\()/g, "$1*$2");
  if (!text || text.length > 500) return null;
  const tokens = text.match(/(?:\d+(?:\.\d*)?|\.\d+)|[a-z]+|[()+*/^-]/g) ?? [];
  if (tokens.join("") !== text || tokens.length > 100) return null;
  let index = 0;
  let depth = 0;
  const functions: Record<string, (x: number) => number> = { sqrt: Math.sqrt, cbrt: Math.cbrt, sin: Math.sin, cos: Math.cos, ln: Math.log, exp: Math.exp };
  function atom(): number {
    if (++depth > 30) throw new Error("deep");
    const token = tokens[index++];
    let result: number;
    if (token === "(") { result = sum(); if (tokens[index++] !== ")") throw new Error("paren"); }
    else if (token === "pi") result = Math.PI;
    else if (Object.hasOwn(functions, token ?? "")) {
      if (tokens[index] === "(") { index++; result = sum(); if (tokens[index++] !== ")") throw new Error("paren"); }
      else result = power();
      result = functions[token](result);
    } else if (token && /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(token)) result = Number(token);
    else throw new Error("syntax");
    depth--;
    return result;
  }
  function power(): number { const a = atom(); if (tokens[index] !== "^") return a; index++; return a ** unary(); }
  function unary(): number { if (tokens[index] === "+") { index++; return unary(); } if (tokens[index] === "-") { index++; return -unary(); } return power(); }
  function product(): number { let a = unary(); while (tokens[index] === "*" || tokens[index] === "/") { const op = tokens[index++]; const b = unary(); if (op === "/" && b === 0) throw new Error("zero"); a = op === "*" ? a * b : a / b; } return a; }
  function sum(): number { let a = product(); while (tokens[index] === "+" || tokens[index] === "-") { const op = tokens[index++]; const b = product(); a = op === "+" ? a + b : a - b; } return a; }
  try { const result = sum(); return index === tokens.length && Number.isFinite(result) && Math.abs(result) <= 1e100 ? result : null; } catch { return null; }
}
const normalize = (value: string) => normalizeCourseAnswer(value.replace(/\\infty/g, "∞")).replace(/[’']/g, "'");
export function exerciseAnswerStatus(question: ArenaExerciseQuestion, answer = ""): "correct" | "incorrect" | "unanswered" | "written" {
  if (question.answer.kind === "written") return "written";
  if (!answer.trim()) return "unanswered";
  if (question.answer.kind === "choice") return answer === String(question.answer.correctIndex) ? "correct" : "incorrect";
  if(question.answer.comparison==="complex"){
    const actual=parseComplexAnswer(answer);
    return actual!==null&&question.answer.accepted.some(value=>{
      const expected=parseComplexAnswer(value);
      return expected!==null&&complexNorm(complexSubtract(actual,expected))<=1e-10*Math.max(1,complexNorm(expected));
    })?"correct":"incorrect";
  }
  if (question.answer.comparison === "literal") {
    const literal = (value: string) => value.trim().toUpperCase().replace(/\s+/g, "");
    return question.answer.accepted.some(expected => literal(answer) === literal(expected)) ? "correct" : "incorrect";
  }
  const numeric = numericExerciseAnswer(answer);
  return question.answer.accepted.some(expected => {
    const expectedNumeric = numericExerciseAnswer(expected);
    // Numeric expectations must be compared by value: stripping the multiplication sign
    // before comparison would incorrectly accept "4*2" as the literal answer "42".
    if (expectedNumeric !== null) return numeric !== null && Math.abs(numeric - expectedNumeric) <= 1e-10 * Math.max(1, Math.abs(expectedNumeric));
    return normalize(answer) === normalize(expected);
  }) ? "correct" : "incorrect";
}
export function exerciseExpectedAnswer(question: ArenaExerciseQuestion): string {
  return question.answer.kind === "short" ? question.answer.expected : question.answer.kind === "choice" ? question.answer.options[question.answer.correctIndex] : "Comparer avec le modèle";
}
export function exerciseAssessment(exercise: ArenaExerciseItem, answers: Record<string, string>) {
  const questions = (exercise.questions ?? []).filter(question => question.answer.kind !== "written");
  const possible = questions.reduce((sum, question) => sum + question.points, 0);
  const correct = questions.filter(question => exerciseAnswerStatus(question, answers[question.id]) === "correct");
  const earned = correct.reduce((sum, question) => sum + question.points, 0);
  return { total: questions.length, correct: correct.length, possible, earned, percentage: possible ? Math.round(earned * 100 / possible) : null, outOf20: possible ? Math.round(earned * 200 / possible) / 10 : null };
}
export interface ExerciseDraft { answers: Record<string, string>; reasoning: string; submitted: boolean }
export const emptyExerciseDraft = (): ExerciseDraft => ({ answers: {}, reasoning: "", submitted: false });
export function exerciseDraftKey(userId: string, context: string, exerciseId: string) {
  return `excellence-exercise:${encodeURIComponent(userId)}:${encodeURIComponent(context)}:${encodeURIComponent(exerciseId)}`;
}
export function restoreExerciseDraft(raw: string | null, exercise: ArenaExerciseItem): ExerciseDraft {
  const result = emptyExerciseDraft();
  if (!raw || raw.length > 700_000) return result;
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return result;
    for (const question of exercise.questions ?? []) {
      if (typeof data.answers?.[question.id] === "string") result.answers[question.id] = data.answers[question.id].slice(0, question.answer.kind === "written" ? 10000 : 500);
    }
    result.reasoning = typeof data.reasoning === "string" ? data.reasoning.slice(0, 10000) : "";
    result.submitted = data.submitted === true;
  } catch { /* Optional local draft never blocks the exercise. */ }
  return result;
}
