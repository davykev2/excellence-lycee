import { useId, useState } from "react";
import { Plot } from "./DerivativeExerciseFigures";
import { boutiques, coolingElapsed, coolingTemperature, expIteration, expIterationValue, exponentialPlotModels, expStudyF, expTwoStudyG } from "./exponentialPlotModels";

function inverseBranch(y: number) {
  let a = .7034674224983917, b = 500;
  for (let i = 0; i < 70; i++) { const x = (a + b) / 2; if (expStudyF(x) > y) a = x; else b = x; }
  return (a + b) / 2;
}
export function ExponentialFunctionFigure({ sourceNumber }: { sourceNumber?: number }) {
  const id = useId(), [rank, setRank] = useState(0), [years, setYears] = useState(14), [hours, setHours] = useState(2);
  if (sourceNumber === 36) return <div>{[
    { title: "1 · f(x) = x³⁄⁴, x > 0", fn: (x: number) => x ** .75, ranges: [[.001, 5] as [number, number]], bounds: [-.5, 5, -.5, 4] as [number, number, number, number] },
    { title: "2 · f(x) = (1/2)ˣ", fn: (x: number) => .5 ** x, ranges: [[-3, 4] as [number, number]], bounds: [-3, 4, -.5, 6.5] as [number, number, number, number] },
    { title: "3 · f(x) = 2ˣ − 2", fn: (x: number) => 2 ** x - 2, ranges: [[-3, 3] as [number, number]], bounds: [-3, 3, -2.5, 3.5] as [number, number, number, number] },
  ].map(({ title, fn, ranges, bounds }) => <Plot key={title} title={title} model={{ bounds, orthonormal: true, series: [{ fn, ranges, label: title }] }} />)}</div>;
  if (sourceNumber === 40) return <div className="practice-parameter-figure">
    <Plot title="Réseau de boutiques et seuil de 80 magasins" axisLabels={["x", "N"]} model={{ bounds: [0, 20, 0, 450], step: [2, 50], series: [{ fn: boutiques, ranges: [[0, 20]], label: "N(x) = 5 + x exp(0,2x − 1)" }], guides: [{ label: "Seuil 80 magasins", from: [0, 80], to: [20, 80] }], points: [{ x: years, y: boutiques(years), label: "Année choisie" }] }} />
    <label htmlFor={id}>Année : {2010 + years}</label><input id={id} type="range" min="0" max="20" step="1" value={years} onChange={event => setYears(Number(event.target.value))} />
    <p aria-live="polite">Modèle : {boutiques(years).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} magasins ; chiffre d’affaires annuel : {(boutiques(years) * 164000 * 300).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} F CFA.</p>
  </div>;
  if (sourceNumber === 41) return <div className="practice-parameter-figure">
    <Plot title="Refroidissement selon le modèle · temps depuis le décès" axisLabels={["t", "T"]} model={{ bounds: [0, 8, 18, 38], step: [1, 4], series: [{ fn: coolingTemperature, ranges: [[0, 8]], label: "T(t) = 17 exp(−kt) + 20" }], guides: [{ label: "Température ambiante : 20 °C", from: [0, 20], to: [8, 20] }], points: [{ x: coolingElapsed, y: 32, label: "10 h · 32 °C" }, { x: coolingElapsed + .5, y: 31, label: "10 h 30 · 31 °C" }, { x: hours, y: coolingTemperature(hours), label: "P" }] }} />
    <label htmlFor={id}>Temps depuis le décès : {hours.toLocaleString("fr-FR")} h</label><input id={id} type="range" min="0" max="8" step=".1" value={hours} onChange={event => setHours(Number(event.target.value))} /><p aria-live="polite">Température du modèle : {coolingTemperature(hours).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} °C.</p>
  </div>;
  const model = sourceNumber === undefined ? undefined : exponentialPlotModels[sourceNumber];
  if (!model) return null;
  return <div>
    <Plot title={`Tracé de la correction · exercice ${sourceNumber}`} model={model} />
    {sourceNumber === 25 && <Plot title="Partie C · branche k et sa réciproque" model={{ bounds: [0, 1.5, 0, 1.5], orthonormal: true, step: [.25, .25], series: [{ fn: expStudyF, ranges: [[.7034674224983917, 1.5]], label: "Branche k" }, { fn: inverseBranch, ranges: [[.02, .2905053586470908]], secondary: true, label: "Réciproque de k" }], guides: [{ label: "Symétrie : y = x", from: [0, 0], to: [1.5, 1.5] }] }} />}
    {sourceNumber === 27 && <Plot title="Partie B · g et sa demi-tangente verticale" model={{ bounds: [0, 3.5, -2.5, 2], orthonormal: true, series: [{ fn: expTwoStudyG, ranges: [[0, 3.5]], label: "Courbe de g" }], guides: [{ label: "Demi-tangente x = 0", from: [0, -2.5], to: [0, 2] }], points: [{ x: 0, y: -2, label: "A(0 ; −2)" }, { x: 1, y: 1.5, label: "Max." }, { x: 2, y: 4 - 4 * Math.log(2), label: "Min." }] }} />}
    {sourceNumber === 39 && <div className="practice-parameter-figure">
      <Plot title="Point fixe et itérations sur I = [−1 ; 0]" model={{ bounds: [-1, 0, -1, 0], orthonormal: true, step: [.2, .2], series: [{ fn: expIteration, ranges: [[-1, 0]], label: "g(x) = −(2/e) exp(x/2)" }], guides: [{ label: "y = x", from: [-1, -1], to: [0, 0] }], points: [{ x: expIterationValue(rank), y: expIteration(expIterationValue(rank)), label: "P" }] }} />
      <label htmlFor={id}>Rang n = {rank}</label><input id={id} type="range" min="0" max="14" step="1" value={rank} onChange={event => setRank(Number(event.target.value))} /><p aria-live="polite">u{rank} = {expIterationValue(rank).toLocaleString("fr-FR", { minimumFractionDigits: 9, maximumFractionDigits: 9 })} ; erreur garantie au plus {(Math.exp(-rank) / 2).toLocaleString("fr-FR", { maximumSignificantDigits: 4 })}.</p>
    </div>}
  </div>;
}
