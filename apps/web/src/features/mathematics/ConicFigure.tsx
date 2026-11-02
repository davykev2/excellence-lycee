import { useId,useMemo,useRef,useEffect,useState } from "react";
import { addConic,scaleConic,conicFeatures,conicPointAt,conicMetric,type ConicPoint,type ConicModel,type ConicSet } from "./conicModels";
import { conicScenes } from "./conicScenes";
import "../../styles/conic-figures.css";
const number=(n:number)=>Math.abs(n)<.00001?"0":n.toLocaleString("fr-FR",{maximumFractionDigits:3});
const isModel=(s:ConicSet):s is ConicModel=>["ellipse","hyperbola","parabola"].includes(s.kind);
export function ConicFigure({preset="focus-ratio",exerciseNumber}:{preset?:string;exerciseNumber?:number}){
  const [caseIndex,setCase]=useState(0),[position,setPosition]=useState(12),[branch,setBranch]=useState(1),[focusIndex,setFocus]=useState(0),[m,setM]=useState(2),[zoomed,setZoomed]=useState(false);
  const root=useRef<HTMLDivElement>(null),[width,setWidth]=useState(560);
  const uid=useId().replace(/:/g,""),clip="conic-"+uid;
  const scenes=useMemo(()=>conicScenes(preset,exerciseNumber,m),[preset,exerciseNumber,m]);
  const scene=scenes[Math.min(caseIndex,scenes.length-1)];
  useEffect(()=>{setCase(0);setPosition(12);setFocus(0);setBranch(1);setZoomed(false);},[preset,exerciseNumber]);
  useEffect(()=>{const node=root.current;if(!node)return;const observer=new ResizeObserver(([entry])=>setWidth(entry.contentRect.width));observer.observe(node);return()=>observer.disconnect();},[]);
  if(!scene)return null;
  const models=scene.sets.filter(isModel),active=models[0];
  const features=active?conicFeatures(active):null;
  const extent:ConicPoint[]=[];
  for(const set of scene.sets){
    if(isModel(set)){
      const f=conicFeatures(set);extent.push(f.origin,...f.vertices,...f.focuses,...f.directrices.map(d=>d.point));
      if(set.kind==="parabola"){for(const t of [-2.5,2.5])extent.push(conicPointAt(set,t*Math.sqrt(Math.abs(set.parameter))));}
      else if(set.kind==="hyperbola"){for(const b of [-1,1])for(const t of [-.9,.9])extent.push(conicPointAt(set,t,b));}
    }else if(set.kind==="point")extent.push(set.point);
    else if(set.kind==="lines")extent.push(...set.lines.map(l=>l.point));
  }
  if(!extent.length)extent.push([-3,-3],[3,3]);
  const xmid=(Math.min(...extent.map(p=>p[0]))+Math.max(...extent.map(p=>p[0])))/2;
  const ymid=(Math.min(...extent.map(p=>p[1]))+Math.max(...extent.map(p=>p[1])))/2;
  const yrange=Math.max(2,...extent.map(p=>Math.abs(p[1]-ymid)))*1.3;
  const xrange=Math.max(2,...extent.map(p=>Math.abs(p[0]-xmid)))*1.25;
  const scale=Math.min(470/(2*xrange),300/(2*yrange));
  const to=(p:ConicPoint):ConicPoint=>[280+(p[0]-xmid)*scale,195-(p[1]-ymid)*scale];
  const plotWidth=zoomed?Math.max(560,width*1.4):Math.max(200,width);
  const maxLength=700/scale,font=16*560/plotWidth;
  const gridStep=10**Math.floor(Math.log10(Math.max(xrange,yrange)/3));
  const originPixel=to([0,0]),tick=gridStep*Math.max(1,Math.ceil(1.5*font/(gridStep*scale)));
  const line=(p:ConicPoint,d:ConicPoint,color:string,dash?:string)=>{
    const len=Math.hypot(...d);if(len<1e-10)return null;
    const a=to(addConic(p,scaleConic(d,-maxLength/len))),b=to(addConic(p,scaleConic(d,maxLength/len)));
    return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth="1.6" strokeDasharray={dash}/>;
  };
  const point=(p:ConicPoint,label:string,color="#0f766e",dx=7,dy=-8)=>{
    const q=to(p);
    return <g><circle cx={q[0]} cy={q[1]} r="3.4" fill={color}/><text x={q[0]+dx} y={q[1]+dy} fontSize={font} fill={color} paintOrder="stroke" stroke="white" strokeWidth="3">{label}</text></g>;
  };
  const t=active?.kind==="ellipse"?position*Math.PI/50:active?.kind==="parabola"?position/40*Math.sqrt(Math.abs(active.parameter)):position/120;
  const metric=active?conicMetric(active,t,focusIndex,branch):null;
  const drawCurve=(model:ConicModel,index:number)=>{
    const domain=model.kind==="parabola"?5*Math.sqrt(Math.abs(model.parameter)):model.kind==="ellipse"?Math.PI:2.5;
    const branches=model.kind==="hyperbola"?[-1,1]:[1];
    return branches.map(b=>{
      const points=Array.from({length:241},(_,i)=>to(conicPointAt(model,-domain+2*domain*i/240,b)));
      return <polyline key={index+"-"+b} points={points.map(p=>p.join(",")).join(" ")} fill="none" stroke={index===0?"#2563eb":"#a16207"} strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>;
    });
  };
  const family=exerciseNumber===35||exerciseNumber===36;
  const ticks=(mid:number,range:number)=>Array.from({length:Math.min(28,Math.ceil(2*range/gridStep)+1)},(_,i)=>(Math.floor((mid-range)/gridStep)+i)*gridStep);
  return <div className="conic-figure" ref={root}>
    {scenes.length>1&&<label>Figure<select aria-label="Choisir la figure de conique" value={Math.min(caseIndex,scenes.length-1)} onChange={e=>{setCase(Number(e.target.value));setFocus(0);}}>{scenes.map((s,i)=><option value={i} key={i}>{s.label}</option>)}</select></label>}
    {family&&<div className="conic-family"><label>Paramètre m<input aria-label="Paramètre m de la famille" type="range" min="-4" max="4" step=".05" value={m} onChange={e=>setM(Number(e.target.value))}/></label><output>m = {number(m)}</output><div className="conic-buttons">{(exerciseNumber===35?[-1,-2/3,0,1,2]:[-3,-2,-1,0,2]).map(value=><button type="button" key={value} onClick={()=>setM(value)}>m={value===-2/3?"−2/3":number(value)}</button>)}</div></div>}
    <div className="conic-buttons conic-zoom-control"><button type="button" aria-pressed={zoomed} onClick={()=>setZoomed(v=>!v)}>{zoomed?"Ajuster à l’écran":"Agrandir la figure"}</button></div>
    <div className="conic-plot-scroll" tabIndex={zoomed?0:undefined} aria-label={zoomed?"Figure agrandie, défilement horizontal":undefined}>
    <svg className={"conic-plot"+(zoomed?" conic-plot-large":"")} style={zoomed?{width:plotWidth,minWidth:plotWidth}:undefined} viewBox="0 0 560 400" role="img" aria-label={"Construction de conique : "+scene.label}>
      <defs><clipPath id={clip}><rect x="28" y="22" width="504" height="348"/></clipPath></defs>
      <rect x="28" y="22" width="504" height="348" rx="8" fill="#fafcfb"/>
      <g clipPath={"url(#"+clip+")"}>
        {ticks(xmid,xrange).map(x=><g key={"x"+x}>{line([x,0],[0,1],"#e2e8f0")}</g>)}
        {ticks(ymid,yrange).map(y=><g key={"y"+y}>{line([0,y],[1,0],"#e2e8f0")}</g>)}
        {line([0,0],[1,0],"#94a3b8")}{line([0,0],[0,1],"#94a3b8")}
        {originPixel[1]>42&&originPixel[1]<350&&<g>
          <text x="508" y={originPixel[1]-10} fontSize={font} fill="#475569">x</text>
          {[tick,-tick].filter(v=>to([v,0])[0]>60&&to([v,0])[0]<495).map(v=><text key={v} x={to([v,0])[0]} y={originPixel[1]+font+7} fontSize={font} textAnchor="middle" fill="#64748b">{number(v)}</text>)}
        </g>}
        {originPixel[0]>40&&originPixel[0]<510&&<g>
          <text x={originPixel[0]+8} y={36+font/2} fontSize={font} fill="#475569">y</text>
          {[tick,-tick].filter(v=>to([0,v])[1]>60&&to([0,v])[1]<325).map(v=><text key={v} x={originPixel[0]-8} y={to([0,v])[1]+font/3} fontSize={font} textAnchor="end" fill="#64748b">{number(v)}</text>)}
        </g>}
        {features&&<g>
          {line(features.origin,features.u,"#64748b","3 5")}
          {active?.kind!=="parabola"&&line(features.origin,features.v,"#cbd5e1","3 5")}
          {features.directrices.map((d,i)=><g key={"d"+i}>{line(d.point,[-d.normal[1],d.normal[0]],i===focusIndex?"#d97706":"#b45309","7 5")}{point(d.point,features.directrices.length===1?"D":i?"D₋":"D₊","#b45309",8,16)}</g>)}
          {features.asymptotes.map((d,i)=><g key={"a"+i}>{line(features.origin,d,"#7c3aed","8 5")}</g>)}
        </g>}
        {scene.sets.map((set,i)=>isModel(set)?<g key={i}>{drawCurve(set,i)}</g>:set.kind==="point"?<g key={i}>{point(set.point,"Point")}</g>:set.kind==="lines"?<g key={i}>{set.lines.map((l,j)=><g key={j}>{line(l.point,l.direction,"#2563eb")}</g>)}</g>:null)}
        {features&&<g>
          {point(features.origin,active?.kind==="parabola"?"S":"Ω","#334155",-18,22)}
          {active?.kind!=="parabola"&&features.vertices.map((p,i)=><g key={"v"+i}>{point(p,active?.kind==="ellipse"&&active.axis==="y"?["B","B′","A′","A"][i]:["A","A′","B","B′"][i],"#475569",7,20)}</g>)}
          {features.focuses.map((p,i)=><g key={"f"+i}>{point(p,features.focuses.length===1?"F":i?"F₋":"F₊","#b45309",7,-12)}</g>)}
        </g>}
        {metric&&<g>
          <line x1={to(metric.point)[0]} y1={to(metric.point)[1]} x2={to(metric.focus)[0]} y2={to(metric.focus)[1]} stroke="#e11d48" strokeWidth="2"/>
          {metric.foot&&<><line x1={to(metric.point)[0]} y1={to(metric.point)[1]} x2={to(metric.foot)[0]} y2={to(metric.foot)[1]} stroke="#0f766e" strokeWidth="2"/>{point(metric.foot,"H","#0f766e",-18,20)}</>}
          {point(metric.point,"M","#e11d48",8,-14)}
        </g>}
      </g>
    </svg>
    </div>
    {scene.sets.every(s=>s.kind==="empty")&&<p className="conic-empty-note">Ensemble vide : aucun point réel.</p>}
    <p className="conic-scale-note">Même unité sur les deux axes.</p>
    {scene.sets.some(s=>s.kind!=="empty")&&<div className="conic-legend"><span>Bleu : courbe</span>{features&&<span>Orange : foyers/directrices</span>}{active?.kind==="hyperbola"&&<span>Violet : asymptotes</span>}</div>}
    {scene.note&&<p>{scene.note}</p>}
    {family&&<p className="conic-kind">Ensemble : {scene.sets[0].kind==="ellipse"?"ellipse":scene.sets[0].kind==="hyperbola"?"hyperbole":scene.sets[0].kind==="parabola"?"parabole":scene.sets[0].kind==="lines"?"droites":scene.sets[0].kind==="point"?"point":"vide"}</p>}
    {active&&metric&&<div className="conic-controls">
      <label>Déplacer M sur la courbe<input type="range" min="-100" max="100" value={position} onChange={e=>setPosition(Number(e.target.value))}/></label>
      <div className="conic-buttons">{active.kind==="hyperbola"&&<button type="button" onClick={()=>setBranch(b=>-b)}>Changer de branche</button>}
        {features&&features.directrices.length===2&&<button type="button" onClick={()=>setFocus(i=>1-i)}>Couple {focusIndex?"F₋ / D₋":"F₊ / D₊"}</button>}</div>
      <dl><div><dt>M</dt><dd>({number(metric.point[0])} ; {number(metric.point[1])})</dd></div><div><dt>MF</dt><dd>{number(metric.distanceFocus)}</dd></div>
        {metric.distanceLine!==null&&<><div><dt>d(M,D)</dt><dd>{number(metric.distanceLine)}</dd></div><div><dt>MF / d(M,D)</dt><dd>{metric.ratio===null?"—":number(metric.ratio)}</dd></div><div><dt>e</dt><dd>{number(features!.e)}</dd></div></>}
      </dl>
      {active.kind==="ellipse"&&features?.e===0&&<p>Cercle : pas de directrice finie.</p>}
    </div>}
  </div>;
}
