import { useId,useState } from "react";
import { MathText } from "../../components/MathText";
import { bivariateStatistics,statisticsData,statsFormat,statsTex,transformedStatistics, type StatisticsData } from "./statisticsModels";
const niceStep=(span:number)=>{
  const power=10**Math.floor(Math.log10(span/5)),q=span/5/power;
  return (q<=1?1:q<=2?2:q<=5?5:10)*power;
};
const ticks=(min:number,max:number,step:number)=>{
  const first=Math.ceil((min-1e-9)/step)*step;
  return Array.from({length:Math.min(40,Math.max(0,Math.floor((max-first)/step+1.000001)))},(_,i)=>first+i*step);
};
function StatisticsPlot({d,mode,blank,selected,customSlope}:{d:StatisticsData;mode:string;blank:boolean;selected:number;customSlope?:number}){
  const id=useId().replace(/:/g,""),s=bivariateStatistics(d);
  const rawXmin=Math.min(...d.x),rawXmax=Math.max(...d.x),rawYmin=Math.min(...d.y),rawYmax=Math.max(...d.y);
  const dx=rawXmax-rawXmin||1,dy=rawYmax-rawYmin||1;
  const xmin=d.origin?.[0]??rawXmin-.08*dx,xmax=rawXmax+.08*dx;
  const ymin=d.origin?.[1]??rawYmin-.08*dy,ymax=rawYmax+.08*dy;
  const width=420,height=d.scale?width*(ymax-ymin)/(xmax-xmin)*d.scale[0]/d.scale[1]:285;
  const sx=(x:number)=>90+width*(x-xmin)/(xmax-xmin),sy=(y:number)=>30+height-height*(y-ymin)/(ymax-ymin);
  const xt=ticks(xmin,xmax,d.scale?.[0]??niceStep(xmax-xmin)),yt=ticks(ymin,ymax,d.scale?.[1]??niceStep(ymax-ymin));
  // Keep each grid interval, leaving room between dense four-digit labels.
  const labelledX=xt.length>9?xt.filter((_,i)=>i%2===0):xt;
  const yAxis=sx(Math.max(xmin,Math.min(xmax,0))),xAxis=sy(Math.max(ymin,Math.min(ymax,0)));
  const a=customSlope??s.a,b=customSlope===undefined?s.b:s.meanY-customSlope*s.meanX;
  const xFromY=(y:number)=>s.aPrime!*y+s.bPrime!;
  const showY=!blank&&(mode==="y"||mode==="both"),showX=!blank&&(mode==="x"||mode==="both");
  const i=Math.min(d.x.length-1,selected),px=d.x[i],py=d.y[i];
  return <div className="stats-canvas" tabIndex={0} role="region" aria-label={d.title+" · graphique défilable horizontalement"}>
    <svg viewBox={"0 0 560 "+(height+80)} style={{height:height+80}} role="img" aria-label={d.title}>
      <defs><clipPath id={id}><rect x="90" y="30" width={width} height={height}/></clipPath></defs>
      <g className="stats-grid">{xt.map(x=><line key={"x"+x} x1={sx(x)} x2={sx(x)} y1="30" y2={30+height}/>)}{yt.map(y=><line key={"y"+y} x1="90" x2="510" y1={sy(y)} y2={sy(y)}/>)}</g>
      <g className="stats-axes"><line x1="90" x2="510" y1={xAxis} y2={xAxis}/><line x1={yAxis} x2={yAxis} y1="30" y2={height+30}/></g>
      <g clipPath={"url(#"+id+")"}>
        {showY&&a!==null&&b!==null&&<line className="stats-line-y" x1={sx(xmin)} y1={sy(a*xmin+b)} x2={sx(xmax)} y2={sy(a*xmax+b)}/>}
        {showX&&s.aPrime!==null&&<line className="stats-line-x" x1={sx(xFromY(ymin))} y1={sy(ymin)} x2={sx(xFromY(ymax))} y2={sy(ymax)}/>}
        {showY&&a!==null&&b!==null&&<line className="stats-residual" x1={sx(px)} x2={sx(px)} y1={sy(py)} y2={sy(a*px+b)}/>}
        {showX&&s.aPrime!==null&&<line className="stats-residual" x1={sx(px)} x2={sx(xFromY(py))} y1={sy(py)} y2={sy(py)}/>}
      </g>
      {d.x.map((x,j)=><g key={j}><circle className={d.weights?.[j]===0?"stats-empty":"stats-point"} cx={sx(x)} cy={sy(d.y[j])} r={d.weights?4+Math.sqrt(d.weights[j]):5}/></g>)}
      {!blank&&<g className="stats-mean"><path d={"M"+(sx(s.meanX)-6)+","+sy(s.meanY)+"h12 M"+sx(s.meanX)+","+(sy(s.meanY)-6)+"v12"}/><text x={Math.min(485,sx(s.meanX)+9)} y={Math.max(20,sy(s.meanY)-10)}>G</text></g>}
      <g className="stats-ticks">{labelledX.map(x=><text key={"x"+x} x={sx(x)} y={height+52} textAnchor="middle">{statsFormat(x,2)}</text>)}
        {yt.map(y=><text key={"y"+y} x="80" y={sy(y)+5} textAnchor="end">{statsFormat(y,2)}</text>)}</g>
    </svg>
  </div>;
}
const plainSeries:Record<string,StatisticsData>={
  positive:{title:"Tendance croissante",x:[-2,-1,0,1,2],y:[-2,-.5,0,.5,2],xLabel:"x",yLabel:"y"},
  negative:{title:"Tendance décroissante",x:[-2,-1,0,1,2],y:[2,.5,0,-.5,-2],xLabel:"x",yLabel:"y"},
  quadratic:{title:"Une relation non linéaire",x:[-2,-1,0,1,2],y:[4,1,0,1,4],xLabel:"x",yLabel:"y"},
};
export function StatisticsFigure({preset,blank=false}:{preset:string|number;blank?:boolean}){
  const id=useId(),[mode,setMode]=useState("none"),[selected,setSelected]=useState(0),[offset,setOffset]=useState(0),[lab,setLab]=useState("positive"),[transformed,setTransformed]=useState(false),[weighted,setWeighted]=useState(true);
  const key=String(preset),isResidual=key==="residuals",isCorrelation=key==="correlation";
  const original=isCorrelation?plainSeries[lab]:statisticsData[isResidual?"regression":key];
  if(!original)return null;
  const transformedData=(key==="32"||key==="33")&&transformed?transformedStatistics(key):original;
  const d=key==="35"&&!weighted?{...original,weights:undefined}:transformedData,s=bivariateStatistics(d);
  const currentMode=isResidual?"y":mode;
  const customSlope=isResidual?s.a!+offset:undefined;
  const sse=customSlope===undefined?null:d.x.reduce((sum,x,i)=>sum+(d.y[i]-(s.meanY+customSlope*(x-s.meanX)))**2,0);
  return <figure className="statistics-figure" data-statistics-preset={key}>
    <figcaption>{d.title}</figcaption>
    <p className="stats-axis-units">Horizontal : {d.xLabel} · Vertical : {d.yLabel}</p>
    <StatisticsPlot d={d} mode={currentMode} selected={selected} blank={blank} customSlope={customSlope}/>
    {d.scale&&<p>Échelles : 1 unité de longueur pour {statsFormat(d.scale[0])} en abscisse et {statsFormat(d.scale[1])} en ordonnée.{d.origin?" Intersection des axes : ("+d.origin.map(n=>statsFormat(n)).join(" ; ")+").":""}</p>}
    {!blank&&<div className="stats-controls">
      {isCorrelation&&<><label htmlFor={id+"-lab"}>Relation observée</label><select id={id+"-lab"} value={lab} onChange={e=>{setLab(e.target.value);setSelected(0);}}><option value="positive">Croissante</option><option value="negative">Décroissante</option><option value="quadratic">En U : y = x²</option></select></>}
      {(key==="32"||key==="33")&&<label className="stats-check"><input type="checkbox" checked={transformed} onChange={e=>setTransformed(e.target.checked)}/>Variables logarithmiques</label>}
      {key==="35"&&<label className="stats-check"><input type="checkbox" checked={weighted} onChange={e=>setWeighted(e.target.checked)}/>Tenir compte des fréquences du tableau</label>}
      {!isResidual&&<><label htmlFor={id+"-line"}>Ajustement</label><select id={id+"-line"} value={mode} onChange={e=>setMode(e.target.value)}><option value="none">Nuage et point moyen</option><option value="y" disabled={s.a===null}>Droite de Y en X</option><option value="x" disabled={s.aPrime===null}>Droite de X en Y</option><option value="both" disabled={s.a===null||s.aPrime===null}>Les deux droites</option></select></>}
      <label htmlFor={id+"-point"}>Observation</label><select id={id+"-point"} value={Math.min(selected,d.x.length-1)} onChange={e=>setSelected(Number(e.target.value))}>{d.x.map((x,i)=><option key={i} value={i}>({statsFormat(x)} ; {statsFormat(d.y[i])}){d.weights?" · fréquence "+d.weights[i]+" %":""}</option>)}</select>
      <p className="stats-key"><span className="stats-point-key">● Observations</span><span className="stats-mean-key">+ Point moyen G</span>{(currentMode==="y"||currentMode==="both")&&<span className="stats-y-key">— Y en X</span>}{(currentMode==="x"||currentMode==="both")&&<span className="stats-x-key">— X en Y</span>}</p>
      <p><MathText>{String.raw`$G(${statsTex(s.meanX,4)};${statsTex(s.meanY,4)})$ · $r${s.r===null?"\\text{ non défini}":"\\approx "+statsTex(s.r,4)}$`}</MathText></p>
      {(currentMode==="y"||currentMode==="both")&&s.a!==null&&<p><MathText>{String.raw`$Y\approx (${statsTex(customSlope??s.a)})X+(${statsTex(customSlope===undefined?s.b!:s.meanY-customSlope*s.meanX)})$`}</MathText> · Écart vertical en pointillé.</p>}
      {(currentMode==="x"||currentMode==="both")&&s.aPrime!==null&&<p><MathText>{String.raw`$X\approx (${statsTex(s.aPrime)})Y+(${statsTex(s.bPrime!)})$`}</MathText> · Écart horizontal en pointillé.</p>}
      {isResidual&&<><label htmlFor={id+"-slope"}>Écart à la pente optimale : {offset}</label><input id={id+"-slope"} type="range" min="-80" max="80" step="5" value={offset} onChange={e=>setOffset(Number(e.target.value))}/>
        <p>La droite passe toujours par G. Somme des carrés des écarts verticaux : <strong>{statsFormat(sse!,2)}</strong>. Elle est minimale lorsque l’écart de pente vaut 0.</p><button type="button" onClick={()=>setOffset(0)}>Retrouver la pente optimale</button></>}
      {isCorrelation&&lab==="quadratic"&&<p>Ici r = 0, mais y = x² : une relation non linéaire existe bien.</p>}
      {key==="35"&&<p>{weighted?"Les disques sont pondérés par les pourcentages. Le cercle vide correspond à une fréquence nulle.":"Les neuf couples possibles sont pris avec le même poids, uniquement pour la comparaison demandée : ce n’est pas la distribution pondérée des voitures."}</p>}
    </div>}
  </figure>;
}
