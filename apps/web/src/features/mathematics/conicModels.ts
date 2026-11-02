export type ConicPoint=readonly[number,number];
export type ConicAxis="x"|"y";
export type ConicModel=
  |{kind:"ellipse"|"hyperbola";center:ConicPoint;axis:ConicAxis;a:number;b:number;rotation?:number}
  |{kind:"parabola";vertex:ConicPoint;axis:ConicAxis;parameter:number;rotation?:number};
export type ConicSet=ConicModel|{kind:"empty"}|{kind:"point";point:ConicPoint}|{kind:"lines";lines:{point:ConicPoint;direction:ConicPoint}[]};
export const addConic=(p:ConicPoint,q:ConicPoint):ConicPoint=>[p[0]+q[0],p[1]+q[1]];
export const subConic=(p:ConicPoint,q:ConicPoint):ConicPoint=>[p[0]-q[0],p[1]-q[1]];
export const scaleConic=(p:ConicPoint,k:number):ConicPoint=>[p[0]*k,p[1]*k];
export const dotConic=(p:ConicPoint,q:ConicPoint)=>p[0]*q[0]+p[1]*q[1];
export const conicNorm=(p:ConicPoint)=>Math.hypot(...p);
export function conicFrame(model:ConicModel){
  const angle=(model.rotation??0)+(model.axis==="y"?Math.PI/2:0);
  const u:ConicPoint=[Math.cos(angle),Math.sin(angle)],v:ConicPoint=[-Math.sin(angle),Math.cos(angle)];
  return{u,v,origin:model.kind==="parabola"?model.vertex:model.center};
}
export function conicFeatures(model:ConicModel){
  const{u,v,origin}=conicFrame(model);
  if(!origin.every(Number.isFinite)||!Number.isFinite(model.rotation??0))throw new Error("Coordonnées de conique invalides.");
  if(model.kind==="parabola"){
    const a=model.parameter;if(!Number.isFinite(a)||Math.abs(a)<1e-9)throw new Error("Le paramètre doit être non nul.");
    return{u,v,origin,e:1,c:Math.abs(a)/2,focuses:[addConic(origin,scaleConic(u,a/2))],directrices:[{point:addConic(origin,scaleConic(u,-a/2)),normal:u}],vertices:[origin],asymptotes:[] as ConicPoint[]};
  }
  if(![model.a,model.b].every(x=>Number.isFinite(x)&&x>0)||model.kind==="ellipse"&&model.a<model.b)throw new Error("Demi-axes invalides.");
  const c=Math.sqrt(model.kind==="ellipse"?Math.max(0,model.a**2-model.b**2):model.a**2+model.b**2),e=c/model.a;
  return{u,v,origin,e,c,focuses:c<1e-10?[origin]:[addConic(origin,scaleConic(u,c)),addConic(origin,scaleConic(u,-c))],
    directrices:c<1e-10?[]:[1,-1].map(s=>({point:addConic(origin,scaleConic(u,s*model.a**2/c)),normal:u})),
    vertices:[...([1,-1].map(s=>addConic(origin,scaleConic(u,s*model.a)))),...(model.kind==="ellipse"?[1,-1].map(s=>addConic(origin,scaleConic(v,s*model.b))):[])],
    asymptotes:model.kind==="hyperbola"?[addConic(scaleConic(u,model.a),scaleConic(v,model.b)),addConic(scaleConic(u,model.a),scaleConic(v,-model.b))]:[],
  };
}
export function conicPointAt(model:ConicModel,t:number,branch=1):ConicPoint{
  const f=conicFeatures(model);if(!Number.isFinite(t)||Math.abs(t)>100)throw new Error("Paramètre de point hors limites.");
  let x:number,y:number;
  if(model.kind==="parabola"){x=t*t/(2*model.parameter);y=t;}
  else if(model.kind==="ellipse"){x=model.a*Math.cos(t);y=model.b*Math.sin(t);}
  else{if(Math.abs(t)>5||![1,-1].includes(branch))throw new Error("Branche ou paramètre hyperbolique invalide.");x=branch*model.a*Math.cosh(t);y=model.b*Math.sinh(t);}
  return addConic(f.origin,addConic(scaleConic(f.u,x),scaleConic(f.v,y)));
}
export function conicEquationValue(model:ConicModel,p:ConicPoint):number{
  const f=conicFeatures(model),d=subConic(p,f.origin),x=dotConic(d,f.u),y=dotConic(d,f.v);
  if(model.kind==="parabola")return y*y-2*model.parameter*x;
  return x*x/model.a**2+(model.kind==="ellipse"?1:-1)*y*y/model.b**2-1;
}
export function conicMetric(model:ConicModel,t:number,focusIndex=0,branch=1){
  const f=conicFeatures(model),m=conicPointAt(model,t,branch),i=Math.max(0,Math.min(focusIndex,f.directrices.length-1));
  if(!f.directrices.length)return{point:m,focus:f.focuses[0],distanceFocus:conicNorm(subConic(m,f.focuses[0])),distanceLine:null,ratio:null,foot:null};
  const D=f.directrices[i],signed=dotConic(subConic(m,D.point),D.normal),foot=subConic(m,scaleConic(D.normal,signed));
  const distanceLine=Math.abs(signed),focus=f.focuses[i],distanceFocus=conicNorm(subConic(m,focus));
  return{point:m,focus,distanceFocus,distanceLine,ratio:distanceLine<1e-12?null:distanceFocus/distanceLine,foot};
}
/** A x² + B y² + 2C x + 2D y + E = 0, without an xy term. */
export function classifyConic(A:number,B:number,C:number,D:number,E:number):ConicSet{
  if(![A,B,C,D,E].every(Number.isFinite)||Math.abs(A)+Math.abs(B)<1e-10)throw new Error("Équation quadratique diagonale requise.");
  const z=(n:number)=>Math.abs(n)<1e-9;
  if(!z(A)&&!z(B)){
    const center:ConicPoint=[-C/A,-D/B],r=C*C/A+D*D/B-E;
    if(A*B>0){
      if(z(r))return{kind:"point",point:center};
      if(r/A<0)return{kind:"empty"};
      const rx=Math.sqrt(r/A),ry=Math.sqrt(r/B);return{kind:"ellipse",center,axis:rx>=ry?"x":"y",a:Math.max(rx,ry),b:Math.min(rx,ry)};
    }
    if(z(r)){const slope=Math.sqrt(-A/B);return{kind:"lines",lines:[1,-1].map(sign=>({point:center,direction:[1,sign*slope] as ConicPoint}))};}
    return r/A>0?{kind:"hyperbola",center,axis:"x",a:Math.sqrt(r/A),b:Math.sqrt(-r/B)}:{kind:"hyperbola",center,axis:"y",a:Math.sqrt(r/B),b:Math.sqrt(-r/A)};
  }
  if(z(A)){
    if(!z(C))return{kind:"parabola",axis:"x",vertex:[-(E-D*D/B)/(2*C),-D/B],parameter:-C/B};
    const k=-D/B,r=(D*D/B-E)/B;if(r<0&&!z(r))return{kind:"empty"};
    return{kind:"lines",lines:(z(r)?[k]:[k+Math.sqrt(r),k-Math.sqrt(r)]).map(y=>({point:[0,y],direction:[1,0]}))};
  }
  if(!z(D))return{kind:"parabola",axis:"y",vertex:[-C/A,-(E-C*C/A)/(2*D)],parameter:-D/A};
  const h=-C/A,r=(C*C/A-E)/A;if(r<0&&!z(r))return{kind:"empty"};
  return{kind:"lines",lines:(z(r)?[h]:[h+Math.sqrt(r),h-Math.sqrt(r)]).map(x=>({point:[x,0],direction:[0,1]}))};
}
export const family35=(m:number)=>classifyConic(m-1,m+1,m-1,-2*m-2,-4*m-3);
export const family36=(m:number)=>classifyConic(m,m+2,m,-2*m-2,-2);
