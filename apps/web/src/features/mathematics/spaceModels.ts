export type Vec3=readonly[number,number,number];
export const add3=(a:Vec3,b:Vec3):Vec3=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
export const sub3=(a:Vec3,b:Vec3):Vec3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
export const scale3=(a:Vec3,k:number):Vec3=>[k*a[0],k*a[1],k*a[2]];
export const dot3=(a:Vec3,b:Vec3)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
export const cross3=(a:Vec3,b:Vec3):Vec3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const norm3=(a:Vec3)=>Math.hypot(...a);
const valid=(a:Vec3)=>a.length===3&&a.every(Number.isFinite);
export function unit3(a:Vec3):Vec3{
  if(!valid(a)||norm3(a)<1e-12)throw new Error("Un vecteur fini non nul est nécessaire.");
  return scale3(a,1/norm3(a));
}
export interface Plane3{normal:Vec3;d:number}
export interface Line3{point:Vec3;direction:Vec3}
export function planeThrough(point:Vec3,normal:Vec3):Plane3{
  unit3(normal);if(!valid(point))throw new Error("Point invalide.");
  return{normal,d:-dot3(normal,point)};
}
export const planeValue=(plane:Plane3,p:Vec3)=>dot3(plane.normal,p)+plane.d;
export function orthogonalProjection(p:Vec3,plane:Plane3):Vec3{
  unit3(plane.normal);if(!valid(p)||!Number.isFinite(plane.d))throw new Error("Données de projection invalides.");
  return sub3(p,scale3(plane.normal,planeValue(plane,p)/dot3(plane.normal,plane.normal)));
}
export function pointPlaneDistance(p:Vec3,plane:Plane3):number{
  return norm3(sub3(p,orthogonalProjection(p,plane)));
}
export function linePlanePosition(line:Line3,plane:Plane3):
  {kind:"contained"}|{kind:"parallel"}|{kind:"secant";t:number;point:Vec3}{
  const n=unit3(plane.normal),u=unit3(line.direction),b=planeValue(plane,line.point);
  if(Math.abs(dot3(n,u))<1e-10)return Math.abs(b)/norm3(plane.normal)<1e-10?{kind:"contained"}:{kind:"parallel"};
  const t=-b/dot3(plane.normal,line.direction);
  return{kind:"secant",t,point:add3(line.point,scale3(line.direction,t))};
}
export function twoPlanesPosition(p:Plane3,q:Plane3):"coincident"|"parallel"|"secant"{
  const n=unit3(p.normal),m=unit3(q.normal);
  if(norm3(cross3(n,m))>1e-10)return"secant";
  const point=scale3(p.normal,-p.d/dot3(p.normal,p.normal));
  return Math.abs(planeValue(q,point))/norm3(q.normal)<1e-10?"coincident":"parallel";
}
export function twoLinesPosition(a:Line3,b:Line3):"coincident"|"parallel"|"secant"|"skew"{
  const u=unit3(a.direction),v=unit3(b.direction),n=cross3(u,v),delta=sub3(b.point,a.point);
  if(norm3(n)<1e-10)return norm3(cross3(delta,u))<1e-10?"coincident":"parallel";
  return Math.abs(dot3(delta,unit3(n)))<1e-10?"secant":"skew";
}
export function planeBasis(normal:Vec3):[Vec3,Vec3]{
  const n=unit3(normal),reference:Vec3=Math.abs(n[2])<.8?[0,0,1]:[0,1,0];
  const u=unit3(cross3(n,reference)),v=unit3(cross3(n,u));
  return[u,v];
}
export function planePatch(point:Vec3,normal:Vec3,size:number):Vec3[]{
  if(!Number.isFinite(size)||size<=0)throw new Error("Taille de plan invalide.");
  const[u,v]=planeBasis(normal);
  return[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>add3(point,add3(scale3(u,a*size),scale3(v,b*size))));
}
export function circleInPlane(center:Vec3,normal:Vec3,radius:number,steps=96):Vec3[]{
  if(!Number.isFinite(radius)||radius<0||steps<8)throw new Error("Cercle invalide.");
  const[u,v]=planeBasis(normal);
  return Array.from({length:steps+1},(_,i)=>add3(center,add3(scale3(u,radius*Math.cos(2*Math.PI*i/steps)),scale3(v,radius*Math.sin(2*Math.PI*i/steps)))));
}
/** Orthographic projection: angles are in degrees; no perspective distortion of coordinates. */
export function projectSpace(p:Vec3,yaw:number,pitch:number):readonly[number,number]{
  const y=yaw*Math.PI/180,t=pitch*Math.PI/180;
  return[Math.cos(y)*p[0]-Math.sin(y)*p[1],Math.sin(t)*(Math.sin(y)*p[0]+Math.cos(y)*p[1])-Math.cos(t)*p[2]];
}
export interface SpacePlane{point:Vec3;normal:Vec3;size:number;label:string;color?:string}
export interface SpaceLine extends Line3{length:number;label:string;color?:string}
export interface SpacePoint{point:Vec3;label:string;color?:string}
export interface SpacePath{points:Vec3[];color?:string;dashed?:boolean;arrow?:boolean}
export interface SpaceScene{title:string;description:string;planes:SpacePlane[];lines:SpaceLine[];points:SpacePoint[];paths:SpacePath[]}
export const lineEnds=(line:SpaceLine):[Vec3,Vec3]=>[sub3(line.point,scale3(unit3(line.direction),line.length)),add3(line.point,scale3(unit3(line.direction),line.length))];
