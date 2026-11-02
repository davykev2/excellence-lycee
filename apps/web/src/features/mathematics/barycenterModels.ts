export type Point2=readonly[number,number];
export const add2=(a:Point2,b:Point2):Point2=>[a[0]+b[0],a[1]+b[1]];
export const scale2=(a:Point2,k:number):Point2=>[a[0]*k,a[1]*k];
export const sub2=(a:Point2,b:Point2):Point2=>[a[0]-b[0],a[1]-b[1]];
export const dot2=(a:Point2,b:Point2)=>a[0]*b[0]+a[1]*b[1];
export const norm2=(a:Point2)=>Math.hypot(...a);
export function barycenter(points:readonly Point2[],weights:readonly number[]):Point2|null{
  if(!points.length||points.length!==weights.length||!weights.every(Number.isFinite)||!points.every(p=>p.every(Number.isFinite)))throw new Error("Système pondéré invalide");
  const s=weights.reduce((a,b)=>a+b,0);
  if(!Number.isFinite(s))throw new Error("Somme des coefficients hors limites");
  if(Math.abs(s)<1e-12)return null;
  return points.reduce<Point2>((v,p,i)=>add2(v,scale2(p,weights[i]/s)),[0,0]);
}
export const midpoint=(a:Point2,b:Point2):Point2=>scale2(add2(a,b),.5);
export function apollonius(a:Point2,b:Point2,k:number):{kind:"empty"}|{kind:"point";point:Point2}|{kind:"bisector";point:Point2;normal:Point2}|{kind:"circle";center:Point2;radius:number;i:Point2;j:Point2}{
  if(!Number.isFinite(k)||norm2(sub2(a,b))<1e-12)throw new Error("Deux points distincts et un rapport fini sont requis");
  if(k<0)return{kind:"empty"};
  if(k===0)return{kind:"point",point:a};
  if(Math.abs(k-1)<1e-12)return{kind:"bisector",point:midpoint(a,b),normal:sub2(b,a)};
  const center=barycenter([a,b],[1,-k*k])!;
  return{kind:"circle",center,radius:k*norm2(sub2(center,b)),i:barycenter([a,b],[1,k])!,j:barycenter([a,b],[1,-k])!};
}
export function orientedAngle(a:Point2,b:Point2,m:Point2):number|null{
  const u=sub2(a,m),v=sub2(b,m);
  if(norm2(u)<1e-10||norm2(v)<1e-10)return null;
  return Math.atan2(u[0]*v[1]-u[1]*v[0],dot2(u,v));
}
/** A=(-d/2,0), B=(d/2,0), direct orthonormal frame. */
export function angleArc(alpha:number,d=4,steps=220){
  if(!Number.isFinite(alpha)||!Number.isFinite(d)||d<=0||Math.abs(Math.sin(alpha))<1e-9||alpha<=-Math.PI||alpha>=Math.PI)throw new Error("Angle strictement compris entre -pi et pi, non nul");
  const center:Point2=[0,(d/2)/Math.tan(alpha)],radius=d/(2*Math.abs(Math.sin(alpha)));
  const a=Math.atan2(-center[1],-d/2),b=Math.atan2(-center[1],d/2);
  let sweep=(b-a+2*Math.PI)%(2*Math.PI);
  const middleY=center[1]+radius*Math.sin(a+sweep/2);
  if(middleY*alpha<0)sweep-=2*Math.PI;
  const points=Array.from({length:steps+1},(_,i)=>[radius*Math.cos(a+sweep*i/steps),center[1]+radius*Math.sin(a+sweep*i/steps)] as Point2);
  return{center,radius,sweep,points,a:[-d/2,0] as Point2,b:[d/2,0] as Point2};
}
export function quadraticLevel(points:readonly Point2[],weights:readonly number[],k:number){
  if(!Number.isFinite(k))throw new Error("Niveau fini requis");
  const g=barycenter(points,weights),sum=weights.reduce((a,b)=>a+b,0);
  if(!g)return null;
  const c=points.reduce((v,p,i)=>v+weights[i]*dot2(sub2(p,g),sub2(p,g)),0);
  const r2=(k-c)/sum;
  return{center:g,constant:c,sum,radiusSquared:r2,kind:r2<-1e-10?"empty" as const:Math.abs(r2)<1e-10?"point" as const:"circle" as const};
}
export const gridPoints:Record<string,Point2>={A:[0,3],B:[5,2],C:[2,1],D:[0,0],E:[3,3]};
export const leverBalance=(mass:number,left:number,right:number)=>{
  if(![mass,left,right].every(v=>Number.isFinite(v)&&v>0))throw new Error("Masses et bras positifs requis");
  return mass*right/left;
};
