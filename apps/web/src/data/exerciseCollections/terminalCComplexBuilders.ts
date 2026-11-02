import type { ArenaExerciseItem,ArenaExerciseQuestion } from "../../domain/arenaExercises";
import type { ComplexPair } from "../../features/mathematics/complexMath";
import { complexInput,complexTex,complexProductSolution } from "../courseDocuments/complexWriting";
import { exercise,short } from "./builders";
export { short,written,choice,tf } from "./builders";
export { complexTex,complexProductSolution };
export function complexExercise(n:number,title:string,statement:string,qs:ArenaExerciseQuestion[],figure=false,sourceFigure=false):ArenaExerciseItem{
 const questions=qs.map((q,i)=>({...q,id:"tc-t2-l5-q-"+n+"-"+(i+1),prompt:q.prompt.trim(),explanation:q.explanation.trim()}));
 return exercise(n,title,statement.trim(),questions,{id:"tc-t2-l5-ex-"+n,sourcePage:n<=8?139:n<=23?140:n<=35?141:n<=50?142:n<=61?143:n<=74?144:n<=78?145:146,questions,
 ...(figure?{correctionFigureKey:"tc-t2-l5-complex" as ArenaExerciseItem["correctionFigureKey"]}:{}),
 ...(sourceFigure?{figureKey:"tc-t2-l5-circuit" as ArenaExerciseItem["figureKey"]}:{})});
}
export function complexShort(label:string,prompt:string,value:ComplexPair,solution:string):ArenaExerciseQuestion{
 const q=short(label,prompt,"$"+complexTex(value)+"$",[complexInput(value)],solution);
 if(q.answer.kind!=="short")throw new Error("Réponse courte requise.");q.answer.comparison="complex";return q;
}
export function complexExact(label:string,prompt:string,tex:string,input:string,solution:string):ArenaExerciseQuestion{
 const q=short(label,prompt,"$"+tex+"$",[input],solution);
 if(q.answer.kind!=="short")throw new Error("Réponse courte requise.");q.answer.comparison="complex";return q;
}
export const polarSolution=(r:string,t:string)=>String.raw`Le module est $${r}$ et un argument est $${t}$. On écrit donc :
$$\boxed{${r}\left(\cos\left(${t}\right)+i\sin\left(${t}\right)\right).}$$
Le module est positif ; les autres arguments s’obtiennent en ajoutant $2k\pi$.`;
export function coordinateQuestions(label:string,prompt:string,p:ComplexPair):ArenaExerciseQuestion[]{
 return ["x","y"].map((axis,i)=>short(label+"."+axis,prompt+" Coordonnée "+axis+".","$"+complexTex([p[i],0])+"$",[String(p[i])],
  String.raw`Le point ou le vecteur a pour coordonnées $(${complexTex([p[0],0])};${complexTex([p[1],0])})$. La première coordonnée est la partie réelle de l’affixe, la seconde sa partie imaginaire. Ainsi $${axis}=${complexTex([p[i],0])}$.`));
}
