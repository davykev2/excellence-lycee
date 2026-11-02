import { complexAdd,complexMultiply,complexDivide,complexPower,complexConjugate,type ComplexPair } from "../../features/mathematics/complexMath";
export { complexAdd,complexMultiply,complexDivide,complexPower,complexConjugate };
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);
export function complexFraction(x:number):string{
  if(Math.abs(x)<1e-12)return"0";
  for(let d=1;d<=10000;d++)if(Math.abs(x*d-Math.round(x*d))<1e-8){const n=Math.round(x*d),g=gcd(n,d),a=n/g,b=d/g;return b===1?String(a):(a<0?"-":"")+String.raw`\frac{${Math.abs(a)}}{${b}}`;}
  throw new Error("Fraction rationnelle requise : "+x);
}
export function complexTex(z:ComplexPair):string{
  const [a,b]=z,re=complexFraction(a),im=Math.abs(b)===1?"i":complexFraction(Math.abs(b))+"i";
  return Math.abs(b)<1e-12?re:Math.abs(a)<1e-12?(b<0?"-":"")+im:re+(b<0?"-":"+")+im;
}
export const complexInput=(z:ComplexPair)=>"("+z[0]+")+("+z[1]+")*i";
export const complexPolar=(r:string,t:string)=>String.raw`${r}\left(\cos\left(${t}\right)+i\sin\left(${t}\right)\right)`;
export function complexProductSolution(a:ComplexPair,b:ComplexPair):string{
  return String.raw`Je développe, puis je remplace $i^2$ par $-1$ :
$$ (${complexTex(a)})(${complexTex(b)})
=${complexFraction(a[0])}\times(${complexFraction(b[0])})+${complexFraction(a[0])}\times(${complexFraction(b[1])})i$$
$$\quad+${complexFraction(a[1])}\times(${complexFraction(b[0])})i+${complexFraction(a[1])}\times(${complexFraction(b[1])})i^2.$$
Je rassemble les parties réelle et imaginaire :
$$\boxed{${complexTex(complexMultiply(a,b))}.}$$`;
}
