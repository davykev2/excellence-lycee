import { useId, useState } from "react";
import { Plot } from "./DerivativeExerciseFigures";
import { festivalLevel, logAuxiliaryG, logFamily, logarithmPlotModels } from "./logarithmPlotModels";

export function LogarithmFunctionFigure({ sourceNumber }: { sourceNumber?: number }) {
  const id = useId(), [parameter, setParameter] = useState(1), [distance, setDistance] = useState(500);
  if (sourceNumber === 39) {
    const a = Math.exp((parameter - 2) / (2 * parameter));
    return <div className="practice-parameter-figure">
      <Plot title={`Courbes de f${parameter} et f${parameter + 1}`} model={{ bounds: [0, 4, -2, 2], orthonormal: true, step: [.5, .5],
        series: [{ fn: x => logFamily(x, parameter), ranges: [[.05, 4]], label: `f${parameter}` }, { fn: x => logFamily(x, parameter + 1), ranges: [[.05, 4]], label: `f${parameter + 1}`, secondary: true }],
        points: [{ x: 1, y: 1, label: "A(1 ; 1)" }, { x: a, y: logFamily(a, parameter), label: "Maximum" }],
      }} />
      <label htmlFor={id}>Paramètre n = {parameter}</label><input id={id} type="range" min="1" max="6" step="1" value={parameter} onChange={event => setParameter(Number(event.target.value))} />
    </div>;
  }
  if (sourceNumber === 40) return <div className="practice-parameter-figure">
    <Plot title="Distance en mètres · niveau sonore en décibels" axisLabels={["r", "S"]} model={{ bounds: [0, 1000, 40, 120], step: [200, 20],
      series: [{ fn: festivalLevel, ranges: [[10, 1000]], label: "S(r) = 110 − 20 log(r/10)" }], guides: [{ label: "Limite demandée : 70 dB", from: [0, 70], to: [1000, 70] }], points: [{ x: distance, y: festivalLevel(distance), label: "P" }],
    }} />
    <label htmlFor={id}>Distance : {distance} m</label><input id={id} type="range" min="10" max="1000" step="10" value={distance} onChange={event => setDistance(Number(event.target.value))} />
    <p aria-live="polite">Niveau selon le modèle : {festivalLevel(distance).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} dB.</p>
  </div>;
  const model = sourceNumber === undefined ? undefined : logarithmPlotModels[sourceNumber];
  if (!model) return null;
  return <div>
    {sourceNumber === 34 && <Plot title="Partie I · g(x) = x ln(x) − x + 1" model={{ bounds: [0, 5, -.5, 4.5], orthonormal: true, series: [{ fn: logAuxiliaryG, ranges: [[.001, 5]], label: "Courbe de g" }], points: [{ x: 1, y: 0, label: "Minimum" }] }} />}
    <Plot title={sourceNumber === 34 ? "Partie II · courbe de f et solution α" : `Tracé de la correction · exercice ${sourceNumber}`} model={model} />
  </div>;
}
