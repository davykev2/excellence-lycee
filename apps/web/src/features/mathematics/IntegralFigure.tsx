import { useId, useState } from "react";
import { integralPlotModel, rectangleFunctions, rectangleSums, rectangleDisplayError, type IntegralPreset, type IntegralPlotModel } from "./integralModels";

const ticks=(a:number,b:number,h:number)=>Array.from({length:Math.floor((b-Math.ceil(a/h)*h)/h+1.000001)},(_,i)=>Number((Math.ceil(a/h)*h+i*h).toFixed(6)));
const fmt=(x:number)=>x.toLocaleString("fr-FR",{maximumFractionDigits:6});

function IntegralPlot({model,rectangles}:{model:IntegralPlotModel;rectangles?:{fn:(x:number)=>number;a:number;b:number;n:number;side:"left"|"right"}}){
  const id=useId().replace(/[^a-z0-9_-]/gi,"");
  const [xmin,xmax,ymin,ymax]=model.bounds;
  const height=model.unitRatio?420*(ymax-ymin)/(xmax-xmin)*model.unitRatio:280, bottom=height+35;
  const sx=(x:number)=>55+420*(x-xmin)/(xmax-xmin),sy=(y:number)=>bottom-height*(y-ymin)/(ymax-ymin);
  const path=(f:(x:number)=>number,a:number,b:number)=>Array.from({length:401},(_,i)=>{const x=a+(b-a)*i/400;return (i?"L":"M")+sx(x).toFixed(2)+","+sy(f(x)).toFixed(2)}).join("");
  const area=(f:(x:number)=>number,g:(x:number)=>number,a:number,b:number)=>path(f,a,b)+" "+path(g,b,a).replace(/^M/,"L")+" Z";
  const xt=ticks(xmin,xmax,model.step[0]),yt=ticks(ymin,ymax,model.step[1]);
  const ay=sy(Math.max(ymin,Math.min(ymax,0))),ax=sx(Math.max(xmin,Math.min(xmax,0)));
  return <figure className="practice-native-figure practice-integral-figure">
    <div className="practice-figure-canvas" tabIndex={0} role="region" aria-label={model.title+" · figure défilable horizontalement"}>
      <svg viewBox={"0 0 540 "+(bottom+45)} role="img" aria-label={model.title}>
        <defs><clipPath id={id}><rect x="55" y="35" width="420" height={height}/></clipPath></defs>
        <g className="practice-graph-grid">{xt.map(x=><line key={"x"+x} x1={sx(x)} x2={sx(x)} y1="35" y2={bottom}/>)}{yt.map(y=><line key={"y"+y} x1="55" x2="475" y1={sy(y)} y2={sy(y)}/>)}</g>
        <g clipPath={"url(#"+id+")"}>
          {model.shades?.map((s,i)=><path key={i} d={area(s.top,s.bottom,s.a,s.b)} fill={s.color??"#a6dac7"} opacity=".58"/>)}
          {model.verticals?.map((v,i)=><line key={"v"+i} x1={sx(v.x)} x2={sx(v.x)} y1="35" y2={bottom} stroke="#7d4d8c" strokeWidth="1.5" strokeDasharray="6 5"/>)}
          {rectangles&&Array.from({length:rectangles.n},(_,i)=>{const h=(rectangles.b-rectangles.a)/rectangles.n,x=rectangles.a+i*h,y=rectangles.fn(x+(rectangles.side==="right"?h:0));return <rect key={i} x={sx(x)} y={sy(Math.max(0,y))} width={sx(x+h)-sx(x)} height={Math.abs(sy(y)-sy(0))} fill="#8bcdb8" fillOpacity=".4" stroke="#218665" strokeWidth="1"/>})}
          {model.series.flatMap((s,i)=>s.ranges.map(([a,b],j)=><path key={i+"-"+j} d={path(s.fn,a,b)} fill="none" stroke={s.color??"#17618a"} strokeWidth="2.2" strokeDasharray={s.dashed?"6 5":undefined}/>))}
          {model.points?.map((p,i)=><circle key={i} cx={sx(p.x)} cy={sy(p.y)} r="3.3" fill="#173e5b"/>)}
        </g>
        <g className="practice-graph-axes"><line x1="55" x2="475" y1={ay} y2={ay}/><line x1={ax} x2={ax} y1="35" y2={bottom}/></g>
        <g className="practice-graph-labels">
          {xt.map(x=><text key={"x"+x} x={sx(x)} y={bottom+21} textAnchor="middle">{fmt(x)}</text>)}
          {yt.map(y=><text key={"y"+y} x="47" y={sy(y)+4} textAnchor="end">{fmt(y)}</text>)}
          <text x="475" y={bottom+39} textAnchor="end">{model.axes?.[0]??"x"}</text><text x="58" y="20">{model.axes?.[1]??"y"}</text>
          {model.points?.map((p,i)=><text key={i} x={Math.max(60,Math.min(370,sx(p.x)+7))} y={Math.max(48,sy(p.y)-9)}>{p.label}</text>)}
        </g>
      </svg>
    </div>
    <figcaption>{model.title}{model.scale&&<><br/>{model.scale}</>}</figcaption>
    <ul className="practice-plot-legend">{model.series.map((s,i)=><li key={i} style={{color:s.color??"#17618a"}}>{s.label}</li>)}{model.verticals?.map((v,i)=><li key={"v"+i} style={{color:"#7d4d8c"}}>{v.label}</li>)}</ul>
  </figure>;
}
function Rectangles({source}:{source:"summary"|36|37}){
  const config=rectangleFunctions[source], [n,setN]=useState<number>(config.n),[side,setSide]=useState<"left"|"right">("left"), id=useId();
  const sums=rectangleSums(config.fn,config.a,config.b,n),max=Math.max(config.fn(config.a),config.fn(config.b));
  const model:IntegralPlotModel={title:"Rectangles · "+config.label,bounds:[config.a,config.b,0,max*1.2],step:[(config.b-config.a)/(source===37?5:4),source==="summary"?.5:2],series:[{label:"f(x) = "+config.label,fn:config.fn,ranges:[[config.a,config.b]]}]};
  return <div className="integral-lab"><IntegralPlot model={model} rectangles={{...config,n,side}}/>
    <label htmlFor={id}>Nombre de rectangles : {n}</label><input id={id} type="range" min="2" max="40" step="1" value={n} onChange={e=>setN(Number(e.target.value))}/>
    <label htmlFor={id+"-side"}>Hauteur prise au bord</label><select id={id+"-side"} value={side} onChange={e=>setSide(e.target.value as "left"|"right")}><option value="left">Gauche</option><option value="right">Droit</option></select>
    <dl className="integral-values"><div><dt>Somme gauche</dt><dd>{fmt(sums.left)}</dd></div><div><dt>Somme droite</dt><dd>{fmt(sums.right)}</dd></div><div><dt>Milieu</dt><dd>{fmt(sums.midpoint)}</dd></div><div><dt>Erreur au plus</dt><dd>{rectangleDisplayError(sums).toLocaleString("fr-FR",{maximumSignificantDigits:6})}</dd></div></dl>
  </div>;
}
function CircleMean(){
  const [angle,setAngle]=useState(45),id=useId(),t=angle*Math.PI/180,x=2*Math.cos(t)**2,y=2*Math.sin(t)*Math.cos(t),sx=(v:number)=>70+160*v,sy=(v:number)=>240-160*v;
  return <figure className="practice-native-figure practice-integral-figure"><div className="practice-figure-canvas" tabIndex={0} role="region" aria-label="Demi-cercle et projection H, figure défilable"><svg viewBox="0 0 470 295" role="img" aria-label={"Cercle de diamètre AB = 2R ; angle BAM = "+angle+" degrés"}>
    <path d="M70,240 A160,160 0 0 1 390,240" fill="none" stroke="#17618a" strokeWidth="2"/>
    <path d={"M70,240 L"+sx(x)+","+sy(y)+" L390,240 Z"} fill="#b7decf" stroke="#17618a" strokeWidth="1.5"/>
    <line x1={sx(x)} x2={sx(x)} y1={sy(y)} y2="240" stroke="#a14f27" strokeDasharray="5 4"/>
    <path d={"M"+(sx(x)-10)+",240 v-10 h10"} fill="none" stroke="#a14f27"/>
    <g className="practice-graph-labels"><text x="52" y="260">A</text><text x="397" y="260">B</text><text x={sx(x)+7} y={sy(y)-8}>M</text><text x={sx(x)-5} y="260">H</text><text x="220" y="66">C</text><text x="207" y="286">AB = 2R</text><text x="112" y="223">θ</text></g>
  </svg></div><label htmlFor={id}>Angle θ : {angle}°</label><input id={id} type="range" min="5" max="85" value={angle} onChange={e=>setAngle(Number(e.target.value))}/><figcaption>AB est un diamètre · MH est perpendiculaire à AB · AMB est rectangle en M.</figcaption></figure>;
}
export function IntegralFigure({preset}:{preset:IntegralPreset}){
  if(preset==="rectangles"||preset===36||preset===37)return <Rectangles source={preset==="rectangles"?"summary":preset}/>;
  if(preset===53)return <CircleMean/>;
  const model=integralPlotModel(preset);
  return model?<IntegralPlot model={model}/>:null;
}
