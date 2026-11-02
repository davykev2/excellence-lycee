import type { ArenaExerciseItem,ArenaExerciseQuestion } from "../../domain/arenaExercises";
import { exercise,short,written } from "./builders";
import { centralConicDetails,centralConicEquation,conicRoot,conicRootInput,type CentralConicSpec } from "./conicSolutions";
export { short,written,choice,tf } from "./builders";
export function conicsExercise(n:number,title:string,statement:string,qs:ArenaExerciseQuestion[],figure=false):ArenaExerciseItem{
  const normalized=qs.map((q,i)=>({...q,id:"tc-t2-l4-q-"+n+"-"+(i+1),prompt:q.prompt.trim(),explanation:q.explanation.trim()}));
  return exercise(n,title,statement.trim(),normalized,{id:"tc-t2-l4-ex-"+n,sourcePage:n<=11?107:n<=26?108:n<=38?109:110,
    ...(figure?{correctionFigureKey:"tc-t2-l4-conic" as const}:{}),questions:normalized});
}
export function centralTask(label:string,s:CentralConicSpec,prefix=""):ArenaExerciseQuestion{
  return written(label,String.raw`Déterminer la nature, les éléments et les éventuelles asymptotes de $${centralConicEquation(s)}$.`,
    prefix+centralConicDetails(s));
}
export function centralQuestions(label:string,s:CentralConicSpec,asymptotes=false):ArenaExerciseQuestion[]{
  const c2=s.kind==="ellipse"?s.a2-s.b2:s.a2+s.b2,c=conicRoot(c2),e=conicRoot(c2/s.a2),details=centralConicDetails(s);
  return[
    short(label+".1",String.raw`Pour $${centralConicEquation(s)}$, calculer $c$, distance du centre à un foyer.`,"$"+c+"$",[c,conicRootInput(c2)],
      String.raw`Le demi-axe focal au carré vaut $${s.a2}$, l’autre $${s.b2}$. Pour ${s.kind==="ellipse"?"une ellipse, on soustrait":"une hyperbole, on additionne"} :
$$c^2=${s.a2}${s.kind==="ellipse"?"-":"+"}${s.b2}=${c2},\qquad\boxed{c=${c}.}$$`),
    short(label+".2","Calculer l’excentricité.","$"+e+"$",[e,conicRootInput(c2/s.a2)],String.raw`L’excentricité est $c$ divisé par le demi-axe focal :
$$e=\frac{\sqrt{${c2}}}{\sqrt{${s.a2}}}=\boxed{${e}}.$$`),
    written(label+".3","Déterminer les coordonnées des foyers.",details),
    written(label+".4","Déterminer les équations des directrices.",details),
    ...(asymptotes?[written(label+".5","Déterminer les équations des asymptotes.",details)]:[]),
    written(label+(asymptotes?".6":".5"),"Associer chaque foyer à sa directrice.",
      details+String.raw`

Le foyer portant le signe $+$ est associé à la directrice portant le signe $+$. Le foyer portant le signe $-$ est associé à l’autre directrice. Avec l’un ou l’autre couple, le rapport $MF/d(M,D)$ vaut la même excentricité.`),
  ];
}
export const plotSteps=String.raw`

**Construction.** Je place le centre ou le sommet, puis les axes et les sommets. Pour une hyperbole, j’ajoute les deux asymptotes et je trace les branches du côté du terme carré positif. Pour une ellipse, je trace une courbe fermée par les quatre sommets. Pour une parabole, je calcule quelques points avec son équation et je complète par symétrie de part et d’autre de son axe. L’échelle est identique sur les deux axes.`;
