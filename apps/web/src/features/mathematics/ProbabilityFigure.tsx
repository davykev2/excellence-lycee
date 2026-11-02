import { useId, useState } from "react";
import { MathText } from "../../components/MathText";
import { binomialProbability, cumulativeProbability, probabilityCdf, probabilityTree, treePaths } from "./probabilityModels";
import type { CdfModel, ProbabilityCoursePreset, ProbabilityTreeModel, ProbabilityTreeNode } from "./probabilityModels";

const number=(value:number,digits=6)=>new Intl.NumberFormat("fr-FR",{maximumFractionDigits:digits}).format(value);

export function ProbabilityTree({model,blank=false}:{model:ProbabilityTreeModel;blank?:boolean}){
  const [selected,setSelected]=useState(0);
  const paths=treePaths(model.root);
  const rows:Array<{node:ProbabilityTreeNode;x:number;y:number;parent?:{x:number;y:number};path:number[]}>= [];
  let leafIndex=0,maxDepth=0;
  const measure=(node:ProbabilityTreeNode,depth:number,path:number[],parent?:{x:number;y:number})=>{
    maxDepth=Math.max(maxDepth,depth);
    const current={x:80+depth*235,y:0};
    const item={node,...current,parent,path};rows.push(item);
    if(node.children?.length){
      const children=node.children.map((child,i)=>measure(child,depth+1,[...path,i],current));
      current.y=children.reduce((sum,child)=>sum+child.y,0)/children.length;
    }else{current.y=50+leafIndex*76;leafIndex++;}
    item.y=current.y;return current;
  };
  measure(model.root,0,[]);
  const width=80+maxDepth*235+155,height=Math.max(270,leafIndex*76+40);
  const chosen=paths[Math.min(selected,paths.length-1)];
  const isSelected=(path:number[])=>{
    const labels=rows.filter(row=>row.path.length&&row.path.every((v,i)=>v===path[i])&&row.path.length<=path.length).sort((a,b)=>a.path.length-b.path.length).map(row=>row.node.label);
    return !blank&&labels.every((label,i)=>chosen.labels[i]===label);
  };
  return <figure className="probability-figure probability-tree" data-probability-tree={blank?"blank":"weighted"}>
    <figcaption>{blank?"Arbre à compléter":model.title}</figcaption>
    <div className="probability-canvas" role="region" tabIndex={0} aria-label={blank?"Arbre sans pondérations, défilable horizontalement":model.title+", défilable horizontalement"}>
      <svg width={width} height={height} viewBox={"0 0 "+width+" "+height} role="img" aria-label={blank?"Deux branches R et non R, chacune suivie de B et non B. Poids à compléter.":model.title}>
        <title>{blank?"Arbre à compléter":model.title}</title>
        {rows.filter(row=>row.parent).map((row,i)=>{
          const parent=row.parent!,mx=parent.x+.72*(row.x-parent.x),my=parent.y+.72*(row.y-parent.y),active=isSelected(row.path);
          const weight=blank?"?":row.node.weight??"",labelWidth=Math.max(30,weight.length*8.5+16);
          return <g key={"edge"+i} className={active?"probability-tree-edge is-selected":"probability-tree-edge"}>
            <line x1={parent.x} y1={parent.y} x2={row.x} y2={row.y}/>
            <rect x={mx-labelWidth/2} y={my-16} width={labelWidth} height="26" rx="5"/>
            <text x={mx} y={my+3} textAnchor="middle">{weight}</text>
          </g>;
        })}
        {rows.map((row,i)=><g key={"node"+i} className="probability-tree-node">
          <circle cx={row.x} cy={row.y} r="4"/>
          <rect className="probability-node-label-background" x={row.x+(i===0?-30:6)} y={row.y-35} width={row.node.label.length*8.5+14} height="25" rx="4"/>
          <text x={row.x+(i===0?-25:9)} y={row.y-16}>{row.node.label}</text>
          {!blank&&row.node.outcome&&<text x={row.x+9} y={row.y+18} className="probability-outcome">{row.node.outcome}</text>}
        </g>)}
      </svg>
    </div>
    {!blank&&<><div className="probability-paths" aria-label="Chemin à explorer">{paths.map((path,i)=><button key={i} type="button" aria-pressed={selected===i} onClick={()=>setSelected(i)}>{path.labels.join(" → ")}</button>)}</div>
      <p className="probability-readout" aria-live="polite">{chosen.weights.join(" × ")} = <strong>{number(chosen.probability,8)}</strong>{chosen.outcome&&" · "+chosen.outcome}</p></>}
    {!blank&&model.legend&&<p>{model.legend}</p>}
  </figure>;
}

export function CdfFigure({model}:{model:CdfModel}){
  const id=useId(),[t,setT]=useState(model.values[0]);
  const min=model.values[0]-1,max=model.values.at(-1)!+1,width=680,left=90,right=30,top=38,bottom=64;
  const plotWidth=width-left-right;
  const plotHeight=model.verticalToHorizontal?plotWidth/(max-min)*model.verticalToHorizontal:340;
  const height=plotHeight+top+bottom,sx=(x:number)=>left+(x-min)/(max-min)*plotWidth,sy=(p:number)=>top+(1-p)*plotHeight;
  const levels=[0,...model.masses.map((_,i)=>cumulativeProbability(model.values,model.masses,model.values[i]))];
  const boundaries=[min,...model.values,max],value=cumulativeProbability(model.values,model.masses,t);
  const yAxis=sx(Math.min(max,Math.max(min,0)));
  return <figure className="probability-figure probability-cdf" data-probability-cdf>
    <figcaption>{model.title}</figcaption>
    <div className="probability-canvas" role="region" tabIndex={0} aria-label={model.title+", défilable horizontalement"}>
      <svg width={width} height={height} viewBox={"0 0 "+width+" "+height} role="img" aria-label={model.title+". Paliers fermés à gauche et ouverts à droite."}>
        <title>{model.title}</title>
        {[0,...levels.slice(1)].map((level,i)=><g key={"y"+i}><line className="probability-grid" x1={left} x2={width-right} y1={sy(level)} y2={sy(level)}/><text x={left-12} y={sy(level)+5} textAnchor="end">{i===0?"0":model.labels[i-1]}</text></g>)}
        <line className="probability-axis" x1={left} x2={width-right} y1={sy(0)} y2={sy(0)}/>
        <line className="probability-axis" x1={yAxis} x2={yAxis} y1={top-10} y2={sy(0)+8}/>
        {model.values.map(x=><g key={"x"+x}><line className="probability-grid" x1={sx(x)} x2={sx(x)} y1={top} y2={sy(0)}/><text x={sx(x)} y={sy(0)+25} textAnchor="middle">{number(x)}</text></g>)}
        <text x={width-right} y={height-8} textAnchor="end">{model.xUnit}</text><text x={yAxis+10} y={top-14}>F</text>
        {levels.map((level,i)=><g key={"step"+i} className="probability-step">
          <line x1={sx(boundaries[i])} x2={sx(boundaries[i+1])} y1={sy(level)} y2={sy(level)}/>
          {i>0&&<circle className="is-closed" cx={sx(boundaries[i])} cy={sy(level)} r="5"/>}
          {i<levels.length-1&&<circle className="is-open" cx={sx(boundaries[i+1])} cy={sy(level)} r="5"/>}
        </g>)}
        <line className="probability-cursor" x1={sx(t)} x2={sx(t)} y1={sy(0)} y2={sy(value)}/>
        <circle className="probability-cursor-dot" cx={sx(t)} cy={sy(value)} r="6"/>
      </svg>
    </div>
    <label htmlFor={id}>Abscisse {model.xUnit==="t"?"t":"(milliers de F CFA)"} : {number(t,2)}</label>
    <input id={id} type="range" min={min} max={max} step=".05" value={t} onChange={event=>setT(Number(event.target.value))}/>
    <p className="probability-readout" aria-live="polite">F({number(t,2)}) = <strong>{number(value,8)}</strong></p>
    <p>Point plein : valeur incluse. Point vide : valeur exclue de ce palier.</p>
  </figure>;
}

export function BinomialFigure(){
  const id=useId(),[n,setN]=useState(10),[p,setP]=useState(.3),[k,setK]=useState(3);
  const chosen=Math.min(k,n),width=680,height=330,left=55,bottom=280,plotHeight=235,barWidth=570/(n+1);
  const masses=Array.from({length:n+1},(_,i)=>binomialProbability(n,i,p));
  const cumulative=masses.slice(0,chosen+1).reduce((sum,mass)=>sum+mass,0);
  return <figure className="probability-figure probability-binomial" data-probability-binomial>
    <figcaption>Explorer une loi binomiale</figcaption>
    <div className="probability-canvas" role="region" tabIndex={0} aria-label="Diagramme des probabilités binomiales, défilable horizontalement">
      <svg width={width} height={height} viewBox="0 0 680 330" role="img" aria-label={"Loi binomiale n="+n+", p="+number(p)+". Chaque barre représente P(X=k)."}>
        {[0,.25,.5,.75,1].map(y=><g key={y}><line className="probability-grid" x1={left} x2="635" y1={bottom-y*plotHeight} y2={bottom-y*plotHeight}/><text x={left-8} y={bottom-y*plotHeight+5} textAnchor="end">{number(y)}</text></g>)}
        {masses.map((mass,i)=><g key={i}><rect className={i===chosen?"probability-bar is-selected":"probability-bar"} x={left+i*barWidth+2} y={bottom-mass*plotHeight} width={Math.max(2,barWidth-4)} height={mass*plotHeight}/><text x={left+(i+.5)*barWidth} y={bottom+23} textAnchor="middle">{i}</text></g>)}
        <text x="635" y="322" textAnchor="end">Nombre de succès k</text><text x="55" y="23">P(X = k)</text>
      </svg>
    </div>
    <label htmlFor={id+"-n"}>Nombre d’essais n : {n}</label><input id={id+"-n"} type="range" min="1" max="20" step="1" value={n} onChange={e=>setN(Number(e.target.value))}/>
    <label htmlFor={id+"-p"}>Probabilité de succès p : {number(p,2)}</label><input id={id+"-p"} type="range" min="0" max="1" step=".05" value={p} onChange={e=>setP(Number(e.target.value))}/>
    <label htmlFor={id+"-k"}>Nombre de succès étudié k : {chosen}</label><input id={id+"-k"} type="range" min="0" max={n} step="1" value={chosen} onChange={e=>setK(Number(e.target.value))}/>
    <div className="probability-readout" aria-live="polite"><p>P(X = {chosen}) = <strong>{number(masses[chosen],8)}</strong></p><p>P(X ≤ {chosen}) = <strong>{number(cumulative,8)}</strong></p><p>E(X) = {number(n*p)} · V(X) = {number(n*p*(1-p))}</p></div>
    <p><MathText>{String.raw`$P(X=k)=\binom nkp^k(1-p)^{n-k}$. Les barres correspondent aux valeurs entières de $X$, pas à une densité continue.`}</MathText></p>
  </figure>;
}

export function ProbabilityFigure({preset,blank=false}:{preset:ProbabilityCoursePreset|number;blank?:boolean}){
  const [n,setN]=useState(25),id=useId();
  if(preset==="binomial")return <BinomialFigure/>;
  const tree=probabilityTree(preset,n),cdf=probabilityCdf(preset==="cdf"?"cdf":typeof preset==="number"?preset:-1);
  return <div className="probability-exploration">
    {preset===46&&<div className="probability-figure"><label htmlFor={id}>Blanches dans U₁ au départ : n = {n}</label><input id={id} type="range" min="1" max="40" step="1" value={n} onChange={e=>setN(Number(e.target.value))}/><p>Espérance du gain net : <strong>{number((n-24)*(3*n+10)/(4*(n+3)),3)} F CFA</strong></p></div>}
    {tree&&<ProbabilityTree model={tree} blank={blank}/>}
    {cdf&&!blank&&<CdfFigure model={cdf}/>}
  </div>;
}
