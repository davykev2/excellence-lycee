import { useId, useState } from "react";
import { Plot } from "../arena/exercises/DerivativeExerciseFigures";
import { differentialPlotModel, firstOrderSolution, oscillatorSolution } from "./differentialModels";
import { MathText } from "../../components/MathText";

export function DifferentialFigure({ preset }: { preset: "first-order" | "oscillator" | number }) {
  const [a,setA]=useState(-1),[initial,setInitial]=useState(1),[omega,setOmega]=useState(1),[velocity,setVelocity]=useState(0);
  const id=useId();
  if (typeof preset === "number") {
    const plot=differentialPlotModel(preset);
    return plot ? <Plot title={plot.title} model={plot.model} axisLabels={plot.axes}/> : null;
  }
  const first=preset==="first-order", f=first ? (x:number)=>firstOrderSolution(a,initial,x) : (x:number)=>oscillatorSolution(omega,initial,velocity,x);
  return <div className="practice-parameter-figure differential-lab">
    <Plot title={first?"Solutions de y′ = ay · passage par (0 ; y₀)":"Solutions de y″ = −ω²y · valeur et pente en 0"} model={{
      bounds:first?[-2,2,-4,4]:[0,7,-4,4],step:[1,1],
      series:[{fn:f,ranges:[first?[-2,2]:[0,7]],label:first?"y(x) = y₀eᵃˣ":"y(x) = y₀ cos(ωx) + (v₀/ω) sin(ωx)"}],
      points:[{x:0,y:initial,label:"y₀"}],
    }}/>
    <label htmlFor={id+"-initial"}>Valeur initiale y₀ : {String(initial).replace(".",",")}</label>
    <input id={id+"-initial"} type="range" min="-3" max="3" step=".5" value={initial} onChange={e=>setInitial(Number(e.target.value))}/>
    {first?<><label htmlFor={id+"-a"}>Coefficient a</label><select id={id+"-a"} value={a} onChange={e=>setA(Number(e.target.value))}>{[-2,-1,0,1,2].map(value=><option key={value} value={value}>{value}</option>)}</select>
      <p><MathText>{String.raw`$y'(0)=ay_0=$`+" "+String(a*initial).replace(".",",")}</MathText></p></>
      :<><label htmlFor={id+"-omega"}>Pulsation ω</label><select id={id+"-omega"} value={omega} onChange={e=>setOmega(Number(e.target.value))}>{[.5,1,2,3].map(value=><option key={value} value={value}>{String(value).replace(".",",")}</option>)}</select>
      <label htmlFor={id+"-velocity"}>Pente initiale v₀ : {String(velocity).replace(".",",")}</label><input id={id+"-velocity"} type="range" min="-2" max="2" step=".5" value={velocity} onChange={e=>setVelocity(Number(e.target.value))}/></>}
  </div>;
}
