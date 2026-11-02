import type { ArenaExerciseItem,ArenaExerciseQuestion } from "../../domain/arenaExercises";
import { exercise } from "./builders";
export { short,written,choice,tf } from "./builders";
export function divExercise(n:number,title:string,statement:string,qs:ArenaExerciseQuestion[],options:Partial<ArenaExerciseItem>={}):ArenaExerciseItem{
  const normalized=qs.map((q,i)=>({...q,id:"tc-t2-l2-q-"+n+"-"+(i+1),prompt:q.prompt.trim(),explanation:q.explanation.trim(),
    answer:q.answer.kind==="short"&&(n===10||n===11||(n===38&&i===1))?{...q.answer,comparison:"literal" as const}:q.answer}));
  return exercise(n,title,statement.trim(),normalized,{id:"tc-t2-l2-ex-"+n,sourcePage:n<=26?64:n<=53?65:66,...options,questions:normalized});
}
