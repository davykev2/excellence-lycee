const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);
export function conicFraction(x:number):[number,number]{
  for(let d=1;d<=10000;d++)if(Math.abs(x*d-Math.round(x*d))<1e-8){const n=Math.round(x*d),g=gcd(n,d);return[n/g,d/g];}
  throw new Error("Coefficient non rationnel dans un corrigé exact : "+x);
}
export const conicTex=(x:number)=>{const[n,d]=conicFraction(x);return d===1?String(n):(n<0?"-":"")+String.raw`\frac{${Math.abs(n)}}{${d}}`;};
export function conicRoot(x:number):string{
  if(x<0)throw new Error("Racine négative dans un élément réel.");
  if(x===0)return"0";const[n,d]=conicFraction(x);let inside=n*d,outside=1;
  for(let q=2;q*q<=inside;q++)while(inside%(q*q)===0){inside/=q*q;outside*=q;}
  const g=gcd(outside,d),num=outside/g,den=d/g;
  const top=(num===1&&inside!==1?"":String(num))+(inside===1?"":String.raw`\sqrt{${inside}}`);
  return den===1?top:String.raw`\frac{${top}}{${den}}`;
}
/** Equivalent expression understood by the bounded answer parser, without TeX syntax. */
export function conicRootInput(x:number):string{
  if(x<0)throw new Error("Racine négative dans une réponse réelle.");
  const[n,d]=conicFraction(x);
  return d===1?"sqrt("+n+")":"sqrt("+n*d+")/"+d;
}
const shifted=(v:string,h:number)=>h===0?v:h>0?String.raw`(${v}-${conicTex(h)})`:String.raw`(${v}+${conicTex(-h)})`;
const offset=(v:number,s:number,r:string)=>v===0?(s<0?"-":"")+r:conicTex(v)+(s<0?"-":"+")+r;
const pt=(x:string,y:string)=>String.raw`(${x};${y})`;
export interface CentralConicSpec{kind:"ellipse"|"hyperbola";axis:"x"|"y";h:number;k:number;a2:number;b2:number}
export function centralConicEquation(s:CentralConicSpec){
  const X=shifted("x",s.h),Y=shifted("y",s.k),x2=s.axis==="x"?s.a2:s.b2,y2=s.axis==="y"?s.a2:s.b2;
  const frac=(v:string,n:number)=>String.raw`\frac{${v}^2}{${conicTex(n)}}`;
  if(s.kind==="ellipse")return frac(X,x2)+"+"+frac(Y,y2)+"=1";
  return(s.axis==="x"?"":"-")+frac(X,x2)+(s.axis==="x"?"-":"+")+frac(Y,y2)+"=1";
}
export function centralConicDetails(s:CentralConicSpec):string{
  const{h,k,a2,b2}=s,axis=s.axis==="x"?"y":"x",fixed=s.axis==="x"?k:h,c2=s.kind==="ellipse"?a2-b2:a2+b2;
  const c=conicRoot(c2),a=conicRoot(a2),b=conicRoot(b2);
  const pointAlong=(sgn:number,r:string)=>s.axis==="x"?pt(offset(h,sgn,r),conicTex(k)):pt(conicTex(h),offset(k,sgn,r));
  const pointAcross=(sgn:number,r:string)=>s.axis==="y"?pt(offset(h,sgn,r),conicTex(k)):pt(conicTex(h),offset(k,sgn,r));
  let result=String.raw`C’est une **${s.kind==="ellipse"?"ellipse":"hyperbole"}** de centre $\Omega${pt(conicTex(h),conicTex(k))}$ et d’axe focal $${axis}=${conicTex(fixed)}$.

Le demi-axe sur l’axe focal mesure $${a}$ et l’autre demi-axe $${b}$. On calcule :
$$c^2=${conicTex(a2)}${s.kind==="ellipse"?"-":"+"}${conicTex(b2)}=${conicTex(c2)},\qquad c=${c}.$$
L’excentricité est le rapport de $c$ au demi-axe focal :
$$\boxed{e=${conicRoot(c2/a2)}.}$$

Les sommets sur l’axe focal sont $${pointAlong(1,a)}$ et $${pointAlong(-1,a)}$.`;
  if(s.kind==="ellipse")result+=String.raw` Les deux autres sommets sont $${pointAcross(1,b)}$ et $${pointAcross(-1,b)}$.`;
  if(c2===0)return result+String.raw` Ici les deux demi-axes sont égaux : c’est un cercle, d’excentricité $0$, sans directrice associée. Son foyer limite est le centre.`;
  const delta=conicRoot(a2*a2/c2),moving=s.axis==="x"?"x":"y",centerCoordinate=s.axis==="x"?h:k;
  result+=String.raw`

Les foyers sont $F_+${pointAlong(1,c)}$ et $F_-${pointAlong(-1,c)}$.

Les directrices, associées **dans le même ordre**, sont :
$$D_+:\ ${moving}=${offset(centerCoordinate,1,delta)},$$
$$D_-:\ ${moving}=${offset(centerCoordinate,-1,delta)}.$$
Le décalage d’une directrice au centre est le carré du demi-axe focal divisé par $c$, soit $${delta}$.`;
  if(s.kind==="hyperbola"){
    const slope=conicRoot(s.axis==="x"?b2/a2:a2/b2);
    result+=String.raw`

Les asymptotes passent par le centre et ont pour équations :
$$\boxed{${shifted("y",k)}=\pm ${slope}\,${shifted("x",h)}.}$$`;
  }else result+="\n\nCette ellipse est bornée ; elle n’a pas d’asymptote.";
  return result;
}
export function parabolaConicDetails(axis:"x"|"y",a:number,h=0,k=0):string{
  const X=shifted("x",h),Y=shifted("y",k),focus=axis==="x"?pt(conicTex(h+a/2),conicTex(k)):pt(conicTex(h),conicTex(k+a/2));
  return String.raw`L’équation s’écrit $${axis==="x"?Y:X}^2=${conicTex(2*a)}\,${axis==="x"?X:Y}$. En la comparant à $${axis==="x"?"Y^2=2aX":"X^2=2aY"}$, on obtient $a=${conicTex(a)}$.

C’est une **parabole**, de sommet $S${pt(conicTex(h),conicTex(k))}$, d’axe focal $${axis==="x"?"y":"x"}=${conicTex(axis==="x"?k:h)}$ et d’excentricité $1$. **Elle n’a pas de centre de symétrie.**

Le foyer est décalé du sommet de $a/2$ sur l’axe :
$$\boxed{F${focus}.}$$
La directrice est située de l’autre côté :
$$\boxed{D:\ ${axis}=${conicTex(axis==="x"?h-a/2:k-a/2)}.}$$
Le paramètre positif vaut $|a|=${conicTex(Math.abs(a))}$ ; la distance du sommet au foyer est $|a|/2=${conicTex(Math.abs(a)/2)}$.

La parabole s’ouvre vers ${axis==="x"?(a>0?"la droite":"la gauche"):(a>0?"le haut":"le bas")}.`;
}
