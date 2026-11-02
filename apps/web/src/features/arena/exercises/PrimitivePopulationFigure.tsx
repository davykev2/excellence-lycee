import { useId, useState } from "react";
import { Plot } from "./DerivativeExerciseFigures";
import { population, populationDisplayRange, populationThreshold } from "./primitivePopulationModel";

export function PrimitivePopulationFigure() {
  const [time, setTime] = useState(2);
  const id = useId();
  return <div className="practice-population-figure">
    <Plot title="Temps en heures · population en milliers de bactéries" axisLabels={["t", "milliers"]} model={{
      bounds: [0, 8, 0, 50], step: [1, 10],
      series: [{ fn: t => population(t) / 1000, ranges: [populationDisplayRange], label: "Population f(t), en milliers" }],
      guides: [{ from: [0, populationThreshold / 1000], to: [8, populationThreshold / 1000], label: "Seuil de 46 000 bactéries" }],
      points: [{ x: time, y: population(time) / 1000, label: "P" }],
    }} />
    <label htmlFor={id}>Temps : {String(time).replace(".", ",")} h</label>
    <input id={id} type="range" min="0" max="8" step="0.1" value={time} onChange={event => setTime(Number(event.target.value))} />
    <p aria-live="polite">Population : {population(time).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} bactéries.</p>
  </div>;
}
