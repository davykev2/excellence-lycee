import { useEffect,useId,useRef,useState } from "react";
import { complexScenes } from "./complexScenes";
import type { ComplexPair } from "./complexMath";
import "../../styles/complex-figures.css";
const fmt=(n:number)=>Math.abs(n)<1e-8?"0":n.toLocaleString("fr-FR",{maximumFractionDigits:3});
export function ComplexFigure({preset="affix",exerciseNumber,blank=false}:{preset?:string;exerciseNumber?:number;blank?:boolean}){
 const [angle,setAngle]=useState(45),[n,setN]=useState(3),[radius,setRadius]=useState(2),[caseIndex,setCase]=useState(0),[zoom,setZoom]=useState(false),[width,setWidth]=useState(560);
 const ref=useRef<HTMLDivElement>(null),uid=useId().replace(/:/g,"");
 useEffect(()=>{const node=ref.current;if(!node)return;const observer=new ResizeObserver(([e])=>setWidth(e.contentRect.width));observer.observe(node);return()=>observer.disconnect();},[]);
 useEffect(()=>{setCase(0);setZoom(false);},[preset,exerciseNumber]);
 const scenes=complexScenes(preset,exerciseNumber,angle,n,radius),s=scenes[Math.min(caseIndex,scenes.length-1)];
 const circuit=blank&&(exerciseNumber===76||exerciseNumber===77);
 if(!s)return null;
 const extent:ComplexPair[]=[[0,0],...s.points.map(p=>p.p)];
 for(const c of [...s.circles??[],...s.arcs??[]])extent.push([c.center[0]-c.r,c.center[1]-c.r],[c.center[0]+c.r,c.center[1]+c.r]);
 const xmin=Math.min(...extent.map(p=>p[0])),xmax=Math.max(...extent.map(p=>p[0])),ymin=Math.min(...extent.map(p=>p[1])),ymax=Math.max(...extent.map(p=>p[1]));
 const cx=(xmin+xmax)/2,cy=(ymin+ymax)/2,scale=Math.min(410/Math.max(2,xmax-xmin),270/Math.max(2,ymax-ymin));
 const to=(p:ComplexPair):ComplexPair=>[280+(p[0]-cx)*scale,180-(p[1]-cy)*scale];
 const plotWidth=zoom?Math.max(560,width*1.4):Math.max(180,width),font=16*560/plotWidth,clip="complex-"+uid;
 const path=(ps:readonly ComplexPair[])=>ps.map((p,i)=>(i?"L":"M")+to(p).join(",")).join(" ");
 const range=560/scale,ox=to([0,0])[0],oy=to([0,0])[1];
 const target=2.6*font/scale,baseTick=10**Math.floor(Math.log10(target)),unit=target/baseTick;
 const tick=baseTick*(unit<=1?1:unit<=2?2:unit<=5?5:10);
 const ticks=Array.from({length:31},(_,k)=>(k-15)*tick);
 return <figure className="complex-figure" data-complex-preset={exerciseNumber??preset}>
  {!circuit&&scenes.length>1&&<label>Construction<select value={caseIndex} onChange={e=>setCase(Number(e.target.value))}>{scenes.map((v,i)=><option key={i} value={i}>{v.title}</option>)}</select></label>}
  {!circuit&&<div className="complex-controls">
   {(exerciseNumber===60||(exerciseNumber===undefined&&["affix","argument","moivre","roots"].includes(preset)))&&<label>{exerciseNumber===60?"θ":"Angle"} = {angle}°<input type="range" min={exerciseNumber===60?0:-180} max={exerciseNumber===60?179:180} step="1" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label>}
   {exerciseNumber===undefined&&["moivre","roots"].includes(preset)&&<label>n = {n}<input type="range" min="2" max="8" step="1" value={n} onChange={e=>setN(Number(e.target.value))}/></label>}
   {(exerciseNumber===80||(exerciseNumber===undefined&&["affix","roots"].includes(preset)))&&<label>{preset==="roots"?"Module du nombre donné":"Rayon"} = {radius}<input type="range" min=".5" max="4" step=".5" value={radius} onChange={e=>setRadius(Number(e.target.value))}/></label>}
  </div>}
  <div ref={ref} className="complex-scroll" tabIndex={0} role="region" aria-label={circuit?"Schéma électrique défilable":"Plan complexe défilable"}>
  {circuit?<svg viewBox="0 0 560 270" style={{width:Math.max(width,460),minWidth:460}} role="img" aria-label={exerciseNumber===76?"Résistance, bobine et condensateur en série":"Résistance et bobine en parallèle"}>
   <g stroke="#175c8c" fill="none" strokeWidth="2.5">
    {exerciseNumber===76?<><path d="M30 140H95 M175 140H215 M295 140H355 M370 140H525"/><rect x="95" y="124" width="80" height="32"/><path d="M215 140q0-30 10-30t10 30q0-30 10-30t10 30q0-30 10-30t10 30q0-30 10-30t10 30"/><path d="M355 110V170 M370 110V170"/></>:<><path d="M70 80H465V220H70Z M285 80V125 M285 185V220"/><circle cx="70" cy="150" r="25" fill="white"/><path d="M285 125q30 0 30 10t-30 10q30 0 30 10t-30 10q30 0 30 10t-30 10"/><rect x="450" y="125" width="30" height="60" fill="white"/></>}
   </g><g fontSize="20" fill="#15394b">{exerciseNumber===76?<><text x="125" y="99">R</text><text x="245" y="92">L</text><text x="353" y="92">C</text><text x="35" y="120">I →</text></>:<><text x="340" y="150">L</text><text x="490" y="150">R</text><text x="30" y="140">U</text><text x="125" y="65">I →</text></>}</g>
   <text x="25" y="255" fontSize="18" fill="#475569">{exerciseNumber===76?"Association en série":"Association en parallèle"}</text>
  </svg>:<svg className="complex-plot" viewBox="0 0 560 370" style={{width:plotWidth,minWidth:plotWidth}} role="img" aria-label={s.title}>
   <defs><clipPath id={clip}><rect x="28" y="15" width="505" height="325"/></clipPath></defs>
   <g clipPath={"url(#"+clip+")"}>
    <g stroke="#e8eeeb" strokeWidth=".8">{ticks.map(v=><g key={v}><line x1={to([v,0])[0]} x2={to([v,0])[0]} y1="15" y2="340"/><line x1="28" x2="533" y1={to([0,v])[1]} y2={to([0,v])[1]}/></g>)}</g>
    <g stroke="#64748b" strokeWidth="1.3"><line x1="28" x2="533" y1={oy} y2={oy}/><line x1={ox} x2={ox} y1="15" y2="340"/></g>
    <g fill="#475569" fontSize={font}>{ticks.filter(v=>v!==0).map(v=><g key={v}><text x={to([v,0])[0]+3} y={oy+font+2}>{fmt(v)}</text><text x={ox+4} y={to([0,v])[1]-3}>{fmt(v)}</text></g>)}</g>
    <g fill="none" stroke="#287aa3" strokeWidth="2">
     {s.circles?.map((c,i)=><circle key={"c"+i} cx={to(c.center)[0]} cy={to(c.center)[1]} r={c.r*scale}/>)}
     {s.arcs?.map((a,i)=><path key={"a"+i} stroke="#178144" strokeWidth="3" d={path(Array.from({length:161},(_,j)=>[a.center[0]+a.r*Math.cos(a.start+(a.end-a.start)*j/160),a.center[1]+a.r*Math.sin(a.start+(a.end-a.start)*j/160)]))}/>)}
     {s.segments?.map((ps,i)=><path key={"s"+i} d={path(ps)} stroke="#92732a"/>)}
     {s.lines?.map((l,i)=>{const len=Math.hypot(...l.d);return <path key={"l"+i} d={path([(l.ray?l.p:[l.p[0]-l.d[0]*range/len,l.p[1]-l.d[1]*range/len]),[l.p[0]+l.d[0]*range/len,l.p[1]+l.d[1]*range/len]])} stroke="#168047"/>;})}
    </g>
    <text x={ox+5} y={oy-7} fontSize={font} fill="#475569">O</text>
    {s.points.map((p,i)=>{const[x,y]=to(p.p),tx=Math.max(31,Math.min(529-p.label.length*font*.7,x+7)),ty=Math.max(19+font,Math.min(333,y<20+font*1.5?y+font:y+(i%2?-font*.15:-font*.5)));return <g key={i}><circle cx={x} cy={y} r={p.excluded?5:3.8} fill={p.excluded?"white":"#175180"} stroke="#175180" strokeWidth="1.8"/><text className="complex-point-label" x={tx} y={ty} fontSize={font} fill="#153b50" paintOrder="stroke" stroke="white" strokeWidth="3">{p.label}</text></g>;})}
   </g>
  </svg>}
  </div>
  {!circuit&&<><figcaption>{s.note}</figcaption><button className="complex-zoom" type="button" aria-pressed={zoom} onClick={()=>setZoom(!zoom)}>{zoom?"Adapter à l’écran":"Agrandir la figure"}</button></>}
 </figure>;
}
