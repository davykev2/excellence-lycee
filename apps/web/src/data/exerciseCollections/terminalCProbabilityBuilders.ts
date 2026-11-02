import type { ArenaExerciseItem, ArenaExerciseQuestion } from "../../domain/arenaExercises";
import { exercise, short } from "./builders";
export { written, choice, tf } from "./builders";
export const num = (label:string,prompt:string,tex:string,accepted:string[],explanation:string) => short(label,prompt,"$"+tex+"$",accepted,explanation);
export const lawTable = (values:string[],probabilities:string[]) =>
  "| $x_i$ | "+values.map(x=>"$"+x+"$").join(" | ")+" |\n| --- | "+values.map(()=>"---").join(" | ")+" |\n| $P(X=x_i)$ | "+probabilities.map(p=>"$"+p+"$").join(" | ")+" |";
export function probabilityExercise(number:number,title:string,statement:string,questions:ArenaExerciseQuestion[],options:Partial<ArenaExerciseItem>={}):ArenaExerciseItem {
  const sourcePage=number<=5?231:number<=14?232:number<=25?233:number<=34?234:number<=39?235:number<=45?236:number<=49?237:238;
  return exercise(number,title,statement||"Résous les questions suivantes.",questions,{
    id:"tc-l9-ex-"+number,sourcePage,...options,questions:questions.map((q,i)=>({...q,id:"tc-l9-q-"+number+"-"+(i+1)})),
  });
}
