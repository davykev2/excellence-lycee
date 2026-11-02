import { useId, useState } from "react";
import { annualSalary, cobwebFunctions, cobwebSteps, cumulativeCases, salaryTotal, sequenceValue } from "./sequencePlotModels";
import { Plot } from "./DerivativeExerciseFigures";
import "../../../styles/sequence-figures.css";

const number = (value: number) => value.toLocaleString("fr-FR", { maximumFractionDigits: 6 });
const colors = ["#17618a", "#ae4d15"];

function NumberLine({ sourceNumber, branch = 0, count = 5 }: { sourceNumber: number; branch?: number; count?: number }) {
  const values = Array.from({ length: count }, (_, n) => sequenceValue(sourceNumber, n, branch));
  const min = Math.floor(Math.min(0, ...values)) - 1, max = Math.ceil(Math.max(1, ...values)) + 1;
  const sx = (x: number) => 45 + 465 * (x - min) / (max - min);
  const label = branch ? "v" : "u";
  const title = "Termes sur l’axe · " + label;
  return <figure className="practice-native-figure practice-sequence-figure">
    <div className="practice-figure-canvas" tabIndex={0} role="region" aria-label={title + " · axe défilable horizontalement"}>
      <svg viewBox="0 0 550 155" role="img" aria-label={title}>
        <line x1="38" x2="520" y1="92" y2="92" className="practice-graph-axes" />
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(x => <g key={x}><line x1={sx(x)} x2={sx(x)} y1="87" y2="97" stroke="#758395" /><text x={sx(x)} y="119" textAnchor="middle">{x}</text></g>)}
        {values.map((value, n) => <g key={n} fill={colors[branch]}><line x1={sx(value)} x2={sx(value)} y1={32 + (n % 3) * 18} y2="88" stroke={colors[branch]} opacity=".5" /><circle cx={sx(value)} cy="92" r="4.3" /><text x={sx(value)} y={27 + (n % 3) * 18} textAnchor="middle">{label}{n}</text></g>)}
        <text x="528" y="87">x</text>
      </svg>
    </div>
    <figcaption>{values.map((value, n) => label + n + " = " + number(value)).join(" ; ")}</figcaption>
  </figure>;
}

function Cobweb({ sourceNumber, rank }: { sourceNumber: number; rank: number }) {
  const clip = useId().replace(/[^a-zA-Z0-9_-]/g, ""), model = cobwebFunctions[sourceNumber], max = model.max;
  const sx = (x: number) => 46 + 400 * x / max, sy = (y: number) => 425 - 400 * y / max;
  const curve = Array.from({ length: 500 }, (_, i) => {
    const x = max * (i + .1) / 500;
    return (i ? "L" : "M") + sx(x) + "," + sy(model.fn(x));
  }).join(" ");
  const steps = cobwebSteps(sourceNumber, rank).map(([x, y], i) => (i ? "L" : "M") + sx(x) + "," + sy(y)).join(" ");
  return <figure className="practice-native-figure practice-sequence-figure practice-cobweb">
    <div className="practice-figure-canvas" tabIndex={0} role="region" aria-label="Construction en escalier · repère orthonormé défilable horizontalement">
      <svg viewBox="0 0 500 466" role="img" aria-label={"Construction des termes avec " + model.label + " et la droite y égale x, jusqu’au rang " + rank}>
        <defs><clipPath id={clip}><rect x="46" y="25" width="400" height="400" /></clipPath></defs>
        <g className="practice-graph-grid">{[0, .5, 1, 1.5, 2, 2.5, 3].filter(t => t <= max).map(t => <g key={t}><line x1={sx(t)} x2={sx(t)} y1="25" y2="425" /><line x1="46" x2="446" y1={sy(t)} y2={sy(t)} /></g>)}</g>
        <g className="practice-graph-axes"><line x1="46" x2="452" y1="425" y2="425" /><line x1="46" x2="46" y1="20" y2="425" /></g>
        <g clipPath={"url(#" + clip + ")"}><path d={curve} className="sequence-function-line" /><line x1={sx(0)} y1={sy(0)} x2={sx(max)} y2={sy(max)} className="sequence-diagonal" /><path d={steps} className="sequence-staircase" /></g>
        {[0, 1, 2, 3].filter(t => t <= max).map(t => <g key={t}><text x={sx(t)} y="446" textAnchor="middle">{t}</text><text x="35" y={sy(t) + 4} textAnchor="end">{t}</text></g>)}
        <circle cx={sx(sequenceValue(sourceNumber, rank))} cy="425" r="4" fill="#ae4d15" />
        <text x="464" y="420">x</text><text x="53" y="16">y</text>
      </svg>
    </div>
    <figcaption>{model.label} · diagonale y = x · construction en orange</figcaption>
  </figure>;
}

function DiscretePlot({ title, series, maxRank, yMax, yStep, guide, unit = "u" }: {
  title: string; series: Array<{ label: string; value: (n: number) => number }>; maxRank: number; yMax: number; yStep: number; guide?: number; unit?: string;
}) {
  const sx = (n: number) => 52 + 420 * n / maxRank, sy = (value: number) => 300 - 260 * value / yMax;
  const ranks = Array.from({ length: maxRank + 1 }, (_, n) => n), yTicks = Array.from({ length: Math.floor(yMax / yStep) + 1 }, (_, i) => i * yStep);
  return <figure className="practice-native-figure practice-sequence-figure">
    <div className="practice-figure-canvas" tabIndex={0} role="region" aria-label={title + " · points discrets défilables horizontalement"}>
      <svg viewBox="0 0 530 350" role="img" aria-label={title}>
        <g className="practice-graph-grid">{yTicks.map(y => <line key={y} x1="52" x2="472" y1={sy(y)} y2={sy(y)} />)}</g>
        <g className="practice-graph-axes"><line x1="52" x2="480" y1="300" y2="300" /><line x1="52" x2="52" y1="30" y2="300" /></g>
        {guide !== undefined && <line x1="52" x2="472" y1={sy(guide)} y2={sy(guide)} className="sequence-diagonal" />}
        {series.map((row, index) => <g key={row.label} fill={colors[index]}>{ranks.map(n => <circle key={n} cx={sx(n)} cy={sy(row.value(n))} r="3.8" />)}</g>)}
        {ranks.filter(n => maxRank <= 10 || n % 2 === 0).map(n => <text key={n} x={sx(n)} y="322" textAnchor="middle">{n}</text>)}
        {yTicks.map(y => <text key={y} x="43" y={sy(y) + 4} textAnchor="end">{number(y)}</text>)}
        <text x="490" y="294">n</text><text x="57" y="22">{unit}</text>
      </svg>
    </div>
    <figcaption>{title}</figcaption><ul className="practice-plot-legend">{series.map((row, index) => <li key={row.label} style={{ color: colors[index] }}>{row.label}</li>)}{guide !== undefined && <li className="is-guide" style={{ color: "#5f7183" }}>Repère : {number(guide)}</li>}</ul>
  </figure>;
}

export function SequenceExerciseFigure({ sourceNumber }: { sourceNumber?: number }) {
  const id = useId(), [rank, setRank] = useState(3), [years, setYears] = useState(9), [day, setDay] = useState(13);
  if (sourceNumber === undefined) return null;
  if ([1, 2, 39, 46].includes(sourceNumber)) return <div><NumberLine sourceNumber={sourceNumber} count={sourceNumber === 2 ? 4 : 5} />{sourceNumber === 2 && <NumberLine sourceNumber={2} branch={1} count={4} />}</div>;
  if (cobwebFunctions[sourceNumber]) return <div className="practice-parameter-figure">
    {sourceNumber === 31 && <NumberLine sourceNumber={31} count={4} />}
    {sourceNumber === 49 && <Plot title="Étude de f sur ]0 ; +∞[ · repère orthonormé" model={{
      bounds: [-.5, 8, -4.5, 4.5], orthonormal: true,
      series: [{ fn: x => 4 - 3 / x, ranges: [[.05, 8]], label: "f(x) = 4 − 3/x" }],
      guides: [
        { label: "Asymptote x = 0", from: [0, -4.5], to: [0, 4.5] },
        { label: "Asymptote y = 4", from: [-.5, 4], to: [8, 4] },
        { label: "Droite y = x", from: [-.5, -.5], to: [8, 8] },
      ], points: [{ x: 1, y: 1, label: "A(1 ; 1)" }, { x: 3, y: 3, label: "B(3 ; 3)" }],
    }} />}
    <Cobweb sourceNumber={sourceNumber} rank={rank} />
    <label htmlFor={id}>Rang construit : n = {rank}</label><input id={id} type="range" min="0" max="8" step="1" value={rank} onChange={event => setRank(Number(event.target.value))} />
    <p aria-live="polite">u{rank} = {number(sequenceValue(sourceNumber, rank))}</p>
  </div>;
  if (sourceNumber === 48) return <div className="practice-parameter-figure">
    <DiscretePlot title="Deux suites de même limite 38/7" maxRank={9} yMax={8} yStep={1} guide={38 / 7} series={[{ label: "uₙ croissante · points bleus", value: n => sequenceValue(48, n) }, { label: "vₙ décroissante · points orange", value: n => sequenceValue(48, n, 1) }]} />
    <label htmlFor={id}>Rang n = {rank}</label><input id={id} type="range" min="0" max="9" step="1" value={rank} onChange={event => setRank(Number(event.target.value))} />
    <p aria-live="polite">u{rank} = {number(sequenceValue(48, rank))} ; v{rank} = {number(sequenceValue(48, rank, 1))} ; écart = {number(6 * (5 / 12) ** rank)}</p>
  </div>;
  if (sourceNumber === 53) return <div className="practice-parameter-figure">
    <DiscretePlot title="Salaires annuels · axe vertical en milliers de F CFA" maxRank={8} yMax={1200} yStep={200} unit="kF" series={[{ label: "Augmentation de 4 % · bleu", value: n => annualSalary(n, true) / 1000 }, { label: "Augmentation de 30 000 F · orange", value: n => annualSalary(n, false) / 1000 }]} />
    <label htmlFor={id}>Durée de contrat : {years} {years > 1 ? "années" : "année"}</label><input id={id} type="range" min="1" max="9" step="1" value={years} onChange={event => setYears(Number(event.target.value))} />
    <p aria-live="polite">Total à 4 % : {number(salaryTotal(years, true))} F CFA ; total à hausse fixe : {number(salaryTotal(years, false))} F CFA.</p>
  </div>;
  if (sourceNumber === 54) return <div className="practice-parameter-figure">
    <DiscretePlot title="Total cumulé de cas dans le modèle" maxRank={15} yMax={16000} yStep={4000} guide={10000} unit="C" series={[{ label: "Cₙ = (n + 1)(60n + 1)", value: cumulativeCases }]} />
    <label htmlFor={id}>Jour n = {day}</label><input id={id} type="range" min="0" max="15" step="1" value={day} onChange={event => setDay(Number(event.target.value))} />
    <p aria-live="polite">Jour {day} : {number(cumulativeCases(day))} cas cumulés ; seuil {cumulativeCases(day) > 10000 ? "dépassé" : "non dépassé"}.</p>
  </div>;
  return null;
}
