import {extendedGcd,integerEquation,divisors,gcdValue,lcmValue} from "../../features/mathematics/gcdMath";
export{extendedGcd,integerEquation,divisors,gcdValue,lcmValue};
export const ex=(id:string,title:string,prompt:string,solution:string)=>({id,title,prompt,solution});
function bezoutBackSubstitution(a:number,b:number){
 const rows=extendedGcd(BigInt(a),BigInt(b)).rows;
 const values=[BigInt(Math.abs(a)),BigInt(Math.abs(b)),...rows.map(r=>r.r)],last=values.length-2;
 if(last<2)return"";
 const coeff=new Map<number,bigint>([[last,1n]]),lines:string[]=[];
 for(let j=last;j>=2;j--){
  const c=coeff.get(j)??0n;if(c===0n)continue;
  coeff.delete(j);coeff.set(j-2,(coeff.get(j-2)??0n)+c);coeff.set(j-1,(coeff.get(j-1)??0n)-c*rows[j-2].q);
  const terms=[...coeff].filter(([,k])=>k!==0n).sort(([i],[j])=>i-j).map(([i,k],n)=>{
   const sign=k<0n?"-":n?"+":"",m=k<0n?-k:k;
   return sign+(m===1n?"":String(m)+String.raw`\times`)+String(values[i]);
  }).join("");
  lines.push(String.raw`$$${values[last]}=${terms}.$$`);
 }
 return"\n\n**Remonter les restes.** On part de la dernière égalité donnant le reste non nul. À chaque ligne, on remplace un reste par « dividende − quotient × diviseur », puis on rassemble :\n"+lines.join("\n");
}
export function euclidSolution(a:number,b:number,bezout=false){
 const z=extendedGcd(BigInt(a),BigInt(b));
 return String.raw`On travaille avec $|${a}|$ et $|${b}|$. On effectue les divisions successives :
${z.rows.map(r=>String.raw`$$${r.a}=${r.b}\times${r.q}+${r.r}.$$`).join("\n")}
Le dernier reste **non nul** est $${z.gcd}$. Donc $\boxed{\operatorname{PGCD}(${a};${b})=${z.gcd}}$.
${bezout?bezoutBackSubstitution(a,b)+String.raw`
Avec les signes des entiers de départ, cette identité s’écrit :
$$${a}\times(${z.u})+${b}\times(${z.v})=${z.gcd}.$$`:""}`;
}
export function diophantineSolution(a:number,b:number,c:number){
 const z=integerEquation(BigInt(a),BigInt(b),BigInt(c)),g=gcdValue(BigInt(a),BigInt(b));
 if(!z)return String.raw`Le PGCD de $${a}$ et $${b}$ vaut $${g}$. Il ne divise pas $${c}$. Tout nombre $${a}x+(${b})y$ est pourtant divisible par $${g}$. L’équation n’a donc **aucune solution entière** : $\boxed{S=\varnothing}$.`;
 return String.raw`**1. Vérifier l’existence.** Le PGCD vaut $${g}$ et divise $${c}$. L’équation admet donc des solutions.

**2. Trouver une solution particulière.** L’algorithme d’Euclide et la remontée des restes donnent :
${euclidSolution(a,b,true)}
L’identité obtenue est donc
$$${a}\times(${z.u})+(${b})\times(${z.v})=${g}.$$
On multiplie par $${BigInt(c)/g}$ :
$$${a}\times(${z.x})+(${b})\times(${z.y})=${c}.$$
Ainsi $(x_0;y_0)=(${z.x};${z.y})$ convient.

**3. Trouver toutes les solutions.** On soustrait cette égalité de l’équation initiale, puis on divise par le PGCD :
$$\frac{${a}}{${g}}(x-(${z.x}))=-\frac{${b}}{${g}}(y-(${z.y})).$$
Les deux coefficients réduits sont premiers entre eux. D’après Gauss, on obtient un entier $k$ tel que
$$x=${z.x}+(${z.dx})k,\qquad y=${z.y}+(${z.dy})k.$$

**4. Vérifier la réciproque.** En remplaçant ces deux expressions, les termes en $k$ s’annulent et le membre de gauche vaut toujours $${c}$.
$$\boxed{S=\{(${z.x}+(${z.dx})k;\ ${z.y}+(${z.dy})k)\mid k\in\mathbb Z\}.}$$
Une autre solution particulière peut donner une écriture différente du même ensemble.`;
}
