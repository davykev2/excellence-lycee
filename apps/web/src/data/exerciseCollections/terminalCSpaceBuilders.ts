import type { ArenaExerciseItem,ArenaExerciseQuestion } from "../../domain/arenaExercises";
import { exercise } from "./builders";
export { short,written,choice,tf } from "./builders";
export function spaceExercise(n:number,title:string,statement:string,qs:ArenaExerciseQuestion[],options:Partial<ArenaExerciseItem>={}):ArenaExerciseItem{
  const normalized=qs.map((q,i)=>({...q,id:"tc-t2-l3-q-"+n+"-"+(i+1),prompt:q.prompt.trim(),explanation:q.explanation.trim()}));
  const {figureKey,...rest}=options;
  return exercise(n,title,statement.trim(),normalized,{id:"tc-t2-l3-ex-"+n,sourcePage:n<=13?80:n<=25?81:82,
    ...(figureKey?(n<=2?{figureKey}:{correctionFigureKey:figureKey}):{}),...rest,questions:normalized});
}
