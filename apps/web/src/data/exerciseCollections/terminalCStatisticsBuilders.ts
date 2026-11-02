import type { ArenaExerciseItem,ArenaExerciseQuestion } from "../../domain/arenaExercises";
import { exercise,short } from "./builders";
import { bivariateStatistics,statisticsData as d,statsFormat,statsTex } from "../../features/mathematics/statisticsModels";
export { written,choice,short } from "./builders";
export { tableFor,statisticsTable,meanSolution,varianceSolution,covarianceSolution,regressionSolution,correlationSolution } from "../courseDocuments/statisticsWriting";
export { statisticsData,bivariateStatistics,statsTex,statsFormat } from "../../features/mathematics/statisticsModels";
export const statQuestion=(label:string,key:string,field:keyof ReturnType<typeof bivariateStatistics>,prompt:string,explanation:string,digits=3):ArenaExerciseQuestion=>{
  const value=bivariateStatistics(d[key])[field]!;
  const rounded=Number(value.toFixed(digits));
  return short(label,prompt+" Si nécessaire, arrondir à "+(digits===2?"deux":"trois")+" décimales.",statsFormat(rounded,digits),[String(rounded)],explanation+String.raw`

Avec cet arrondi, la réponse est $\boxed{${statsTex(rounded,digits)}}$.`);
};
export function statisticsExercise(number:number,title:string,statement:string,questions:ArenaExerciseQuestion[],options:Partial<ArenaExerciseItem>={}):ArenaExerciseItem{
  const page=number<=9?256:number<=16?257:number<=20?258:number<=24?259:number<=29?260:number<=35?261:262;
  const normalized=questions.map(q=>({...q,prompt:q.prompt.trim(),explanation:q.explanation.trim()}));
  return exercise(number,title,statement.trim(),normalized,{id:"tc-l10-ex-"+number,sourcePage:page,...options,
    questions:normalized.map((q,i)=>({...q,id:"tc-l10-q-"+number+"-"+(i+1)}))});
}
