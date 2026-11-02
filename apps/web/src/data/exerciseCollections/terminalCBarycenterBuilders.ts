import type { ArenaExerciseItem,ArenaExerciseQuestion } from "../../domain/arenaExercises";
import { exercise } from "./builders";
export { written,short,choice } from "./builders";
export function baryExercise(n:number,title:string,statement:string,qs:ArenaExerciseQuestion[],options:Partial<ArenaExerciseItem>={}):ArenaExerciseItem{
  const page=n<=10?28:n<=20?29:n<=31?30:n<=38?31:32;
  const normalized=qs.map((q,i)=>({...q,id:"tc-t2-l1-q-"+n+"-"+(i+1),prompt:q.prompt.trim(),explanation:q.explanation.trim()}));
  return exercise(n,title,statement.trim(),normalized,{id:"tc-t2-l1-ex-"+n,sourcePage:page,...options,questions:normalized});
}
