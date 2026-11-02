import { useEffect,useId,useRef,useState } from "react";
import { bankSpaceScene,summarySpaceScene,SPACE_BLUE } from "./spaceScenes";
import { add3,lineEnds,planeBasis,planePatch,projectSpace,scale3,type SpaceScene,type Vec3 } from "./spaceModels";
import "../../styles/space-figures.css";

function SpaceCanvas({scene,yaw,pitch}:{scene:SpaceScene;yaw:number;pitch:number}){
  const host=useRef<HTMLDivElement>(null),[width,setWidth]=useState(600);
  const id=useId().replace(/:/g,""),height=width<440?350:390;
  useEffect(()=>{
    const element=host.current;if(!element)return;
    const update=()=>setWidth(Math.max(240,Math.round(element.getBoundingClientRect().width)));
    update();const observer=new ResizeObserver(update);observer.observe(element);
    return()=>observer.disconnect();
  },[]);
  const polygons=scene.planes.map(p=>planePatch(p.point,p.normal,p.size));
  const ends=scene.lines.map(lineEnds);
  const raw=[...polygons.flat(),...ends.flat(),...scene.points.map(p=>p.point),...scene.paths.flatMap(p=>p.points)];
  const projected=(raw.length?raw:[[0,0,0] as Vec3]).map(p=>projectSpace(p,yaw,pitch));
  const xs=projected.map(p=>p[0]),ys=projected.map(p=>p[1]);
  const xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
  const scale=Math.min((width-48)/Math.max(xmax-xmin,1),(height-82)/Math.max(ymax-ymin,1));
  const xy=(p:Vec3)=>{const q=projectSpace(p,yaw,pitch);return[width/2+(q[0]-(xmin+xmax)/2)*scale,height/2+(q[1]-(ymin+ymax)/2)*scale]as const;};
  const path=(ps:readonly Vec3[])=>ps.map((p,i)=>(i?"L":"M")+xy(p).map(x=>x.toFixed(2)).join(",")).join(" ");
  const usedLabels:{x:number;y:number;w:number}[]=[];
  const label=(p:Vec3,text:string,color:string,offset=0)=>{
    const[x,y]=xy(p),w=Math.max(12,text.length*9);
    const candidates=[[8,-10+offset],[-w-8,-10+offset],[8,23],[-w-8,23],[8,-32],[-w-8,-32],[8,43]];
    const locations=candidates.map(([dx,dy])=>({x:Math.max(8,Math.min(width-w-8,x+dx)),y:Math.max(21,Math.min(height-12,y+dy)),w}));
    const position=locations.find(q=>usedLabels.every(r=>q.x+q.w+4<r.x||r.x+r.w+4<q.x||Math.abs(q.y-r.y)>21))??locations[0];
    usedLabels.push(position);return <text x={position.x} y={position.y} fill={color}>{text}</text>;
  };
  return <div className="space-canvas" ref={host}>
    <svg viewBox={"0 0 "+width+" "+height} style={{height}} role="img" aria-labelledby={id+"title "+id+"desc"}>
      <title id={id+"title"}>{scene.title}</title><desc id={id+"desc"}>{scene.description+" Vue en projection orthographique. Les surfaces affichées sont des morceaux de plans."}</desc>
      <defs>{[SPACE_BLUE,"#23795d","#b46d1b","#7950a0"].map((color,i)=><marker key={color} id={id+"arrow"+i} markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L8,4 L0,8 Z" fill={color}/></marker>)}</defs>
      {scene.planes.map((p,i)=>{const[u,v]=planeBasis(p.normal);return <g key={i} className="space-plane">
        <path d={path(polygons[i])+" Z"} fill={p.color??SPACE_BLUE} fillOpacity=".12" stroke={p.color??SPACE_BLUE} strokeWidth="1.5"/>
        {[-.5,0,.5].flatMap(k=>[
          <path key={"u"+k} d={path([-1,1].map(t=>add3(p.point,add3(scale3(u,t*p.size),scale3(v,k*p.size)))))} stroke={p.color??SPACE_BLUE} strokeOpacity=".2" fill="none"/>,
          <path key={"v"+k} d={path([-1,1].map(t=>add3(p.point,add3(scale3(v,t*p.size),scale3(u,k*p.size)))))} stroke={p.color??SPACE_BLUE} strokeOpacity=".2" fill="none"/>,
        ])}
        {label(polygons[i][2],p.label,p.color??SPACE_BLUE)}
      </g>;})}
      {scene.paths.map((p,i)=>{const colors=[SPACE_BLUE,"#23795d","#b46d1b","#7950a0"],index=Math.max(0,colors.indexOf(p.color??SPACE_BLUE));return <path key={i} d={path(p.points)} fill="none" stroke={p.color??SPACE_BLUE} strokeWidth="2.2" strokeDasharray={p.dashed?"6 5":undefined} markerEnd={p.arrow?"url(#"+id+"arrow"+index+")":undefined}/>;})}
      {scene.lines.map((l,i)=><g key={i}><path d={path(ends[i])} fill="none" stroke={l.color??"#b46d1b"} strokeWidth="2.5"/>{label(ends[i][1],l.label,l.color??"#b46d1b",18)}</g>)}
      {scene.points.map((p,i)=>{const[x,y]=xy(p.point);return <g key={i}><circle cx={x} cy={y} r="4" fill={p.color??"#172d47"} stroke="white" strokeWidth="1.3"/>{label(p.point,p.label,p.color??"#172d47")}</g>;})}
      <g aria-label="Orientation des axes" className="space-orientation">{([[1,0,0],[0,1,0],[0,0,1]] as Vec3[]).map((a,i)=>{
        const q=projectSpace(a,yaw,pitch),x=width-45+q[0]*23,y=height-42+q[1]*23,color=["#9b3942","#277450","#2d6096"][i];
        return <g key={i}><line x1={width-45} y1={height-42} x2={x} y2={y} stroke={color} strokeWidth="2"/><text x={x+(q[0]<0?-13:3)} y={y+(q[1]<0?-4:15)} fill={color}>{["x","y","z"][i]}</text></g>;
      })}</g>
    </svg>
  </div>;
}
export function SpaceGeometryFigure({preset}:{preset:string|number}){
  const key=String(preset),id=useId(),[yaw,setYaw]=useState(35),[pitch,setPitch]=useState(25),[choice,setChoice]=useState(0),[t,setT]=useState(key==="projection"?2:1);
  const bank=/^\d+$/.test(key),scene=bank?bankSpaceScene(Number(key)):summarySpaceScene(key,choice,t);
  const choices=key==="two-lines"?["Sécantes","Strictement parallèles","Non coplanaires","Confondues"]:key==="line-plane"?["Sécante","Strictement parallèle","Incluse","Orthogonale"]:key==="two-planes"?["Sécants","Strictement parallèles","Confondus","Perpendiculaires"]:null;
  const parameter=key==="projection"||key==="parameter";
  const reset=()=>{setYaw(35);setPitch(25);};
  return <figure className="space-figure" data-space-preset={key}>
    <h4>{scene.title}</h4>
    {choices&&<label className="space-case" htmlFor={id+"case"}>Configuration<select id={id+"case"} value={choice} onChange={e=>setChoice(Number(e.target.value))}>{choices.map((c,i)=><option key={c} value={i}>{c}</option>)}</select></label>}
    <SpaceCanvas scene={scene} yaw={yaw} pitch={pitch}/>
    <div className="space-controls">
      <label htmlFor={id+"yaw"}>Rotation : {yaw}°<input id={id+"yaw"} aria-label="Rotation de la figure" type="range" min="-180" max="180" step="5" value={yaw} onChange={e=>setYaw(Number(e.target.value))}/></label>
      <label htmlFor={id+"pitch"}>Inclinaison : {pitch}°<input id={id+"pitch"} aria-label="Inclinaison de la figure" type="range" min="-70" max="70" step="5" value={pitch} onChange={e=>setPitch(Number(e.target.value))}/></label>
      {parameter&&<label htmlFor={id+"t"}>{key==="projection"?"Déplacement signé":"Paramètre t"} : {t.toFixed(1)}<input id={id+"t"} aria-label={key==="projection"?"Déplacement signé":"Paramètre t"} type="range" min="-4" max="4" step=".1" value={t} onChange={e=>setT(Number(e.target.value))}/></label>}
    </div>
    <button type="button" className="space-reset" onClick={reset}>Vue initiale</button>
    <figcaption aria-live={parameter||choices?"polite":undefined}>{scene.description}</figcaption>
  </figure>;
}
