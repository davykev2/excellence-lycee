import { useEffect,useId,useRef,useState } from "react";
import { barycenter,apollonius,angleArc,quadraticLevel,type Point2 } from "./barycenterModels";
import { barycenterScene,type GeoScene } from "./BarycenterScenes";
import "../../styles/barycenter-figures.css";
const fmt=(n:number)=>Number(n.toFixed(3)).toLocaleString("fr-FR");
const presets=new Set(["partial","alignment-worked","alignment-application","concurrence-worked","concurrence-application","weights","quadratic","ratio","angle","angle-example","zero-sum","10","14","15","16","17","18","19","21","22","22-a","22-c","22-d","23","23-a","23-b","24","25","26","27","29","30","32","33","34","35","36","37","38","38-ceva","38-menelaus","39","40","41"]);
function useFigureWidth(minimum:number){
  const ref=useRef<HTMLDivElement>(null),[width,setWidth]=useState(560);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const update=()=>setWidth(Math.max(minimum,Math.round(el.clientWidth)));
    update();const observer=new ResizeObserver(update);observer.observe(el);return()=>observer.disconnect();
  },[minimum]);
  return{ref,width};
}
function Geometry({scene,arc,openEndpoints=false}:{scene:GeoScene;arc?:Point2[];openEndpoints?:boolean}){
  const id=useId();
  const minimum=Object.keys(scene.points).length>8?440:280,{ref,width}=useFigureWidth(minimum);
  const height=Math.min(430,Math.max(300,width*.7+80));
  const values=Object.values(scene.points);
  for(const c of scene.circles??[])values.push([c.center[0]-c.radius,c.center[1]-c.radius],[c.center[0]+c.radius,c.center[1]+c.radius]);
  if(arc)values.push(...arc);
  let minX=Math.min(...values.map(p=>p[0])),maxX=Math.max(...values.map(p=>p[0])),minY=Math.min(...values.map(p=>p[1])),maxY=Math.max(...values.map(p=>p[1]));
  if(scene.grid){minX=Math.min(minX,-.4);maxX=Math.max(maxX,6);minY=Math.min(minY,-.4);maxY=Math.max(maxY,4);}
  if(maxX-minX<1){minX-=2;maxX+=2;}if(maxY-minY<1){minY-=1.5;maxY+=1.5;}
  const scale=Math.min((width-80)/(maxX-minX),(height-95)/(maxY-minY));
  const sx=(x:number)=>width/2+(x-(minX+maxX)/2)*scale,sy=(y:number)=>height/2-(y-(minY+maxY)/2)*scale;
  const line=([a,b]:[string,string],index:number)=>{const p=scene.points[a],q=scene.points[b];return <line key={a+b+index} x1={sx(p[0])} y1={sy(p[1])} x2={sx(q[0])} y2={sy(q[1])}/>;};
  return <div ref={ref} className="barycenter-canvas" role="region" tabIndex={0} aria-label={scene.title+", figure défilable horizontalement"}>
    <svg style={{minWidth:minimum}} viewBox={"0 0 "+width+" "+height} aria-labelledby={id} role="img">
      <title id={id}>{scene.title}</title>
      {scene.grid&&<g className="bary-grid">{Array.from({length:7},(_,i)=><line key={"x"+i} x1={sx(i)} x2={sx(i)} y1={sy(-.4)} y2={sy(3.7)}/>)}{Array.from({length:5},(_,i)=><line key={"y"+i} x1={sx(-.4)} x2={sx(6)} y1={sy(i)} y2={sy(i)}/>)}</g>}
      {scene.polygons?.map((pts,i)=><polygon key={i} className={"bary-area bary-area-"+i} points={pts.map(p=>sx(p[0])+","+sy(p[1])).join(" ")}/>)}
      <g className="bary-segments">{scene.segments.map(line)}</g>
      {(scene.circles??[]).map((c,i)=><g key={i} className={arc?"bary-reference-circle":"bary-circle"}>
        <circle cx={sx(c.center[0])} cy={sy(c.center[1])} r={c.radius*scale}/>
        {c.sphere&&<><ellipse cx={sx(c.center[0])} cy={sy(c.center[1])} rx={c.radius*scale} ry={c.radius*scale*.32}/><ellipse cx={sx(c.center[0])} cy={sy(c.center[1])} rx={c.radius*scale*.32} ry={c.radius*scale}/></>}
      </g>)}
      <g className="bary-highlight">{scene.highlight?.map(line)}</g>
      {arc&&<path className="bary-highlight bary-arc" d={arc.map((p,i)=>(i?"L":"M")+sx(p[0])+","+sy(p[1])).join(" ")}/>}
      {Object.entries(scene.points).filter(([label])=>!["P","Q"].includes(label)||!scene.title.includes("perpendiculaire")).map(([label,p],i)=>{
        const open=openEndpoints&&["A","B","C","D"].includes(label);
        return <g key={label}><circle className={open?"bary-open-point":"bary-point"} cx={sx(p[0])} cy={sy(p[1])} r={open?5:3.5}/><text className="bary-label" x={sx(p[0])+7} y={sy(p[1])+(i%3===1?20:-9)}>{label}</text></g>;
      })}
    </svg>
  </div>;
}
function Lever({blank}:{blank:boolean}){
  const {ref,width}=useFigureWidth(300),start=45,end=width-45,unit=(end-start)/5,g=start+3*unit;
  return <><div ref={ref} className="barycenter-canvas" tabIndex={0} role="region" aria-label="Balance : trois unités entre B et G, deux entre G et A">
    <svg style={{minWidth:300}} viewBox={"0 0 "+width+" 300"} role="img" aria-label={"Balance en équilibre ; BG trois unités, GA deux unités ; lingot rouge 18 kg, lingot vert "+(blank?"de masse inconnue":"12 kg")}>
      <path d={"M"+start+" 100H"+end} className="bary-segments"/>{Array.from({length:6},(_,i)=>start+i*unit).map(x=><path key={x} d={"M"+x+" 91V109"} className="bary-segments"/>)}
      <path d={"M"+g+" 102L"+(g-24)+" 160H"+(g+24)+"Z"} fill="#edf3f6" stroke="#425b6e" strokeWidth="2"/>
      <path d={"M"+start+" 100V175M"+end+" 100V175"} className="bary-segments"/>
      <rect x={start-30} y="175" width="60" height="48" rx="6" fill="#d8eee0" stroke="#267b51" strokeWidth="2"/>
      <rect x={end-30} y="175" width="60" height="48" rx="6" fill="#f9dddd" stroke="#ad3838" strokeWidth="2"/>
      <g className="bary-label"><text x={start-7} y="80">B</text><text x={g-7} y="80">G</text><text x={end-7} y="80">A</text><text x={start-24} y="250">{blank?"m′ = ?":"12 kg"}</text><text x={end-24} y="250">18 kg</text><text x={(start+g)/2-28} y="65">3 unités</text><text x={(g+end)/2-28} y="65">2 unités</text></g>
    </svg></div><figcaption>Graduations régulières ; tige de masse négligée.</figcaption></>;
}
export function BarycenterFigure({preset,blank=false}:{preset:string|number;blank?:boolean}){
  const key=String(preset),id=useId(),[weight,setWeight]=useState(1),[ratio,setRatio]=useState(2),[angle,setAngle]=useState(-60),[level,setLevel]=useState(20);
  if(!presets.has(key))return null;
  if(key==="22"||key==="23"||key==="38")return <div className="bary-figure-group" data-barycenter-group={key}>{(key==="22"?["22-a","22-c","22-d"]:key==="23"?["23-a","23-b"]:["38-ceva","38-menelaus"]).map(p=><BarycenterFigure key={p} preset={p}/>)}</div>;
  let scene:GeoScene,arc:Point2[]|undefined,control,detail:string|undefined,openEndpoints=false;
  if(key==="41")return <figure className="barycenter-figure" data-barycenter-preset={key} data-blank={blank}><Lever blank={blank}/></figure>;
  if(key==="weights"){
    const g=barycenter([[0,0],[4,0]],[1,weight]);
    scene={title:"G barycentre de (A,1) et (B,b)",points:{A:[0,0],B:[4,0],...(g?{G:g}:{})},segments:[["A","B"]]};
    control=<label htmlFor={id}>Coefficient b : {fmt(weight)}<input id={id} type="range" min="-2" max="3" step=".25" value={weight} onChange={e=>setWeight(Number(e.target.value))}/></label>;
    detail=g?"Somme 1 + b = "+fmt(1+weight)+" ; AG / AB (orienté) = "+fmt(weight/(1+weight))+".":"Somme nulle : ce système ne définit pas de barycentre.";
  }else if(key==="quadratic"){
    const pts:Point2[]=[[-1,0],[1,0],[0,Math.sqrt(3)]],f=quadraticLevel(pts,[1,1,1],level)!;
    scene={title:"MA² + MB² + MC² = k, triangle de côté 2",points:{A:pts[0],B:pts[1],C:pts[2],G:f.center},segments:[["A","B"],["B","C"],["C","A"]],circles:f.kind==="circle"?[{center:f.center,radius:Math.sqrt(f.radiusSquared)}]:[]};
    control=<label htmlFor={id}>Niveau k : {level}<input id={id} type="range" min="0" max="28" step="1" value={level} onChange={e=>setLevel(Number(e.target.value))}/></label>;
    detail="MG² = (k − 4) / 3. "+(f.kind==="empty"?"Ensemble vide.":f.kind==="point"?"L’ensemble est le seul point G.":"Cercle de rayon "+fmt(Math.sqrt(f.radiusSquared))+".");
  }else if(key==="ratio"){
    const f=apollonius([0,0],[3,0],ratio);
    scene={title:"MA / MB = k",points:{A:[0,0],B:[3,0]},segments:[["A","B"]]};
    if(f.kind==="circle"){scene.points.G=f.center;scene.points.I=f.i;scene.points.J=f.j;scene.circles=[{center:f.center,radius:f.radius}];detail="Cercle : centre d’abscisse "+fmt(f.center[0])+", rayon "+fmt(f.radius)+". B est exclu.";}
    else if(f.kind==="bisector"){scene.points.P=[1.5,-2];scene.points.Q=[1.5,2];scene.highlight=[["P","Q"]];detail="k = 1 : médiatrice de [AB], pas un cercle.";}
    control=<label htmlFor={id}>Rapport k<select id={id} value={ratio} onChange={e=>setRatio(Number(e.target.value))}>{[.5,1,2,3].map(k=><option key={k} value={k}>{fmt(k)}</option>)}</select></label>;
  }else if(["angle","angle-example","19","27"].includes(key)){
    const degrees=key==="19"?-120:key==="angle"?angle:-60;
    if(degrees===0){
      scene={title:"Angle nul : extérieur du segment",points:{A:[-2,0],B:[2,0],P:[-5,0],Q:[5,0]},segments:[],highlight:[["P","A"],["B","Q"]]};openEndpoints=true;detail="Angle 0 : droite (AB) privée du segment fermé [AB].";
    }else{
      const f=angleArc(degrees*Math.PI/180);scene={title:key==="27"?"Angle −π/3 modulo π":"Angle orienté "+degrees+"° modulo 2π",points:{[key==="27"?"C":"A"]:f.a,[key==="27"?"D":"B"]:f.b,O:f.center},segments:[],circles:[{center:f.center,radius:f.radius}]};
      if(key!=="27")arc=f.points;
      openEndpoints=true;detail=key==="27"?"Modulo π : les deux arcs conviennent. C et D sont exclus.":"Seul l’arc bleu convient ; A et B sont exclus.";
    }
    if(key==="angle")control=<label htmlFor={id}>Angle α : {angle}°<input id={id} type="range" min="-150" max="150" step="15" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label>;
  }else if(key==="zero-sum"){
    scene={title:"Différence de carrés : une droite",points:{A:[0,0],B:[4,0],H:[3,0],P:[3,-3],Q:[3,3]},segments:[["A","B"]],highlight:[["P","Q"]]};
    detail="Exemple : MA² − MB² = 8 équivaut à x = 3. La droite de niveau est perpendiculaire à (AB).";
  }else{scene=barycenterScene(key,blank);detail=scene.caption;}
  return <figure className="barycenter-figure" data-barycenter-preset={key} data-blank={blank}>
    <div className="bary-figure-title">{scene.title}</div>
    {control&&<div className="bary-controls">{control}</div>}
    <Geometry scene={scene} arc={arc} openEndpoints={openEndpoints}/>
    {detail&&<figcaption aria-live={control?"polite":undefined}>{detail}</figcaption>}
  </figure>;
}
