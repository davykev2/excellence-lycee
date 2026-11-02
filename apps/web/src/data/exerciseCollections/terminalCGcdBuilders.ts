import type{ArenaExerciseItem,ArenaExerciseQuestion}from"../../domain/arenaExercises";
import{exercise,short,written}from"./builders";
import{euclidSolution,diophantineSolution,extendedGcd,divisors,gcdValue,lcmValue}from"../courseDocuments/gcdWriting";
import{linearCongruence}from"../../features/mathematics/gcdMath";
export{short,written,choice,tf}from"./builders";
export{euclidSolution,diophantineSolution,extendedGcd,divisors,gcdValue,lcmValue};
export function gcdExercise(n:number,title:string,statement:string,qs:ArenaExerciseQuestion[],figure=false):ArenaExerciseItem{
 const questions=qs.map((q,i)=>({...q,id:"tc-t2-l6-q-"+n+"-"+(i+1),prompt:q.prompt.trim(),explanation:q.explanation.trim()}));
 return exercise(n,title,statement.trim(),questions,{id:"tc-t2-l6-ex-"+n,sourcePage:n<=17?175:n<=52?176:n<=74?177:n<=78?178:n<=81?179:180,questions,...(figure?{correctionFigureKey:"tc-t2-l6-gcd" as const}:{})});
}
export const numberAnswer=(label:string,prompt:string,value:number|bigint,solution:string)=>short(label,prompt,"$"+value+"$",[String(value)],solution);
export const proof=(prompt:string,solution:string)=>written("Solution",prompt,solution);
export function congruenceSolution(a:number,b:number,n:number){
 const r=linearCongruence(BigInt(a),BigInt(b),BigInt(n)),z=extendedGcd(BigInt(a),BigInt(n));
 if(!r)return String.raw`Le PGCD de $${a}$ et $${n}$ vaut $${z.gcd}$ et ne divise pas $${b}$. L’équation n’admet donc aucune solution entière.`;
 return String.raw`**1. Existence.** $\operatorname{PGCD}(${a};${n})=${z.gcd}$ divise $${b}$.

**2. Réduction.** On divise le coefficient, le second membre **et le modulo** par $${z.gcd}$ :
$$${a/Number(z.gcd)}x\equiv${b/Number(z.gcd)}\pmod{${r.step}}.$$
L’identité $${a}\times(${z.u})+${n}\times(${z.v})=${z.gcd}$ montre que $${z.u}$ est un inverse du coefficient réduit.

**3. Résolution.** En multipliant par cet inverse puis en prenant le reste positif, on obtient
$$\boxed{x\equiv${r.residue}\pmod{${r.step}}},\qquad
\boxed{x=${r.residue}+${r.step}k,\ k\in\mathbb Z}.$$
La substitution vérifie la réciproque. Il s’agit d’une classe modulo $${r.step}$, soit $${r.count}$ classe(s) distincte(s) modulo $${n}$.`;
}
export function particularSolution(a:number,b:number,c:number){
 const z=extendedGcd(BigInt(a),BigInt(b));if(BigInt(c)%z.gcd)return diophantineSolution(a,b,c);
 return euclidSolution(a,b,true)+String.raw`

On multiplie cette identité par $${BigInt(c)/z.gcd}$. Un couple qui convient est donc
$$\boxed{(x;y)=(${z.u*(BigInt(c)/z.gcd)};${z.v*(BigInt(c)/z.gcd)}).}$$
On le vérifie en remplaçant dans l’équation. Ce couple n’est pas unique.`;
}
