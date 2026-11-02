import { useId, useState } from "react";
import { derivativePlotModels, type DerivativePlotModel, type DerivativePlotSeries } from "./derivativePlotModels";

const ticks = (min: number, max: number, step: number) => Array.from({ length: Math.max(0, Math.floor((max - Math.ceil(min / step) * step) / step + 1.000001)) }, (_, i) => Number((Math.ceil(min / step) * step + i * step).toFixed(6)));

export function Plot({ model, title, compact = false, axisLabels = ["x", "y"] }: { model: DerivativePlotModel; title: string; compact?: boolean; axisLabels?: [string, string] }) {
  const clip = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [xmin, xmax, ymin, ymax] = model.bounds;
  const height = model.orthonormal ? 410 * (ymax - ymin) / (xmax - xmin) : 270;
  const bottom = 25 + height;
  const sx = (x: number) => 45 + 410 * (x - xmin) / (xmax - xmin);
  const sy = (y: number) => bottom - height * (y - ymin) / (ymax - ymin);
  const xticks = ticks(xmin, xmax, model.step?.[0] ?? 1), yticks = ticks(ymin, ymax, model.step?.[1] ?? 1);
  const axisY = sy(Math.min(ymax, Math.max(ymin, 0))), axisX = sx(Math.min(xmax, Math.max(xmin, 0)));
  const path = (series: DerivativePlotSeries, min: number, max: number) => {
    let d = "", connected = false;
    for (let i = 0; i <= 500; i++) {
      const x = min + (max - min) * i / 500, y = series.fn(x);
      if (!Number.isFinite(y) || Math.abs(y) > 1e6) { connected = false; continue; }
      d += `${connected ? "L" : "M"}${sx(x).toFixed(2)},${sy(y).toFixed(2)}`;
      connected = true;
    }
    return d;
  };
  return <figure className={`practice-native-figure practice-function-figure${compact ? " is-compact" : ""}`}>
    <div className="practice-figure-canvas" tabIndex={0} role="region" aria-label={`${title} · repère défilable horizontalement`}><svg viewBox={`0 0 500 ${bottom + 35}`} role="img" aria-label={title}>
      <defs><clipPath id={clip}><rect x="45" y="25" width="410" height={height} /></clipPath></defs>
      <g className="practice-graph-grid">{xticks.map(x => <line key={`x${x}`} x1={sx(x)} x2={sx(x)} y1="25" y2={bottom} />)}{yticks.map(y => <line key={`y${y}`} x1="45" x2="455" y1={sy(y)} y2={sy(y)} />)}</g>
      <g className="practice-graph-axes"><line x1="45" x2="455" y1={axisY} y2={axisY} /><line x1={axisX} x2={axisX} y1="25" y2={bottom} /></g>
      <g className="practice-graph-guides" clipPath={`url(#${clip})`}>{model.guides?.map((guide, i) => <line key={i} x1={sx(guide.from[0])} y1={sy(guide.from[1])} x2={sx(guide.to[0])} y2={sy(guide.to[1])} />)}</g>
      <g className="practice-graph-curve" clipPath={`url(#${clip})`}>{model.series.flatMap((series, i) => series.ranges.map(([a, b], j) => <path key={`${i}-${j}`} className={series.secondary ? "is-secondary" : undefined} d={path(series, a, b)} />))}</g>
      <g className="practice-graph-labels">
        {xticks.map(x => <text key={`x${x}`} x={sx(x)} y={bottom + 20} textAnchor="middle">{String(x).replace(".", ",")}</text>)}
        {yticks.map(y => <text key={`y${y}`} x="36" y={sy(y) + 4} textAnchor="end">{String(y).replace(".", ",")}</text>)}
        <text x="468" y={axisY - 7}>{axisLabels[0]}</text><text x={axisX + 7} y="17">{axisLabels[1]}</text>
        {model.points?.map((point, i) => <g key={i}><circle cx={sx(point.x)} cy={sy(point.y)} r="3.7" fill="#123a61" /><text x={Math.min(340, Math.max(50, sx(point.x) + 7))} y={sy(point.y) - (i % 2 ? -19 : 10)}>{point.label}</text></g>)}
      </g>
    </svg></div>
    <figcaption>{title}</figcaption>
    {!compact && <ul className="practice-plot-legend">
      {Array.from(new Map(model.series.map(series => [series.label, series])).values()).map(series => <li key={series.label} className={series.secondary ? "is-secondary" : "is-curve"}>{series.label}</li>)}
      {model.guides?.map((guide, i) => <li key={i} className="is-guide">{guide.label}</li>)}
    </ul>}
  </figure>;
}

export function DerivativeInflectionFigure() {
  const common = { bounds: [-2.7, 2.7, -2, 4] as [number, number, number, number], points: [{ x: 0, y: 1, label: "A" }] };
  const functions = [
    { fn: (x: number) => x ** 3 / 3 - x + 1, slope: -1 },
    { fn: (x: number) => -x * x + 2 * x + 1, slope: 2 },
    { fn: (x: number) => 2 * x * x + 2 * x + 1, slope: 2 },
  ];
  return <div className="practice-inflection-figures">{functions.map(({ fn, slope }, i) => <Plot key={i} compact title={`Figure ${i + 1}`} model={{ ...common, series: [{ fn, ranges: [[-2.7, 2.7]], label: "C" }], guides: [{ label: "Tangente en A", from: [-2.7, 1 - 2.7 * slope], to: [2.7, 1 + 2.7 * slope] }] }} />)}</div>;
}

export function DerivativeTriangleFigure() {
  const [ratio, setRatio] = useState(20);
  const id = useId(), r = ratio / 100, height = 320 * Math.sqrt(3) / 2;
  const qx = 60 + 320 * r, px = 380 - 320 * r, top = 325 - 2 * height * r;
  return <figure className="practice-native-figure practice-geometry-figure">
    <div className="practice-figure-canvas" tabIndex={0} role="region" aria-label="Triangle et rectangle inscrits, figure défilable horizontalement"><svg viewBox="0 0 440 370" role="img" aria-label={`Triangle équilatéral ABC, rectangle MNPQ inscrit et BQ égal à ${ratio} centièmes du côté a.`}>
      <path d={`M60,325 L220,${325 - height} L380,325 Z`} className="practice-circle-triangle" />
      <rect x={qx} y={top} width={px - qx} height={325 - top} className="practice-inscribed-rectangle" />
      <line x1="220" x2="220" y1={325 - height} y2="325" className="practice-geometry-guide" />
      <path d="M220,313 L232,313 L232,325" className="practice-geometry-line" fill="none" />
      <g className="practice-graph-labels"><text x="216" y="35">A</text><text x="40" y="341">B</text><text x="388" y="341">C</text><text x="216" y="346">H</text><text x={qx - 17} y={top - 6}>M</text><text x={px + 7} y={top - 6}>N</text><text x={px + 7} y="341">P</text><text x={qx - 14} y="341">Q</text><text x="111" y="172">a</text><text x={(60 + qx) / 2} y="360">x</text></g>
    </svg></div>
    <label htmlFor={id}>Position de Q : x / a = {String(r).replace(".", ",")}</label>
    <input id={id} type="range" min="3" max="47" value={ratio} onChange={event => setRatio(Number(event.target.value))} />
    <figcaption>ABC équilatéral · MNPQ rectangle · BQ = CP = x.</figcaption>
  </figure>;
}

export function DerivativeWaterWallFigure() {
  const [angle, setAngle] = useState(22);
  const id = useId(), theta = angle * Math.PI / 180, my = 55 + 160 * Math.tan(theta);
  return <figure className="practice-native-figure practice-geometry-figure">
    <div className="practice-figure-canvas" tabIndex={0} role="region" aria-label="Mur et tuyaux, figure défilable horizontalement"><svg viewBox="0 0 440 330" role="img" aria-label={`Mur ABCD de largeur dix et hauteur six, tuyaux AM, MB et MH. Angle BMQ égal à ${angle} degrés.`}>
      <rect x="50" y="55" width="320" height="192" fill="#fff8eb" stroke="#ddb46d" strokeWidth="1.5" />
      <path d={`M50,55 L210,${my} L370,55 M210,${my} L210,247`} className="practice-water-pipes" />
      <line x1="210" x2="370" y1={my} y2={my} className="practice-geometry-guide" />
      <path d={`M358,${my} L358,${my - 12} L370,${my - 12}`} fill="none" className="practice-geometry-line" />
      <path d={`M240,${my} A30,30 0 0 0 ${210 + 30 * Math.cos(theta)},${my - 30 * Math.sin(theta)}`} fill="none" className="practice-geometry-line" />
      <g className="practice-graph-labels"><text x="34" y="49">A</text><text x="374" y="49">B</text><text x="378" y="260">C</text><text x="33" y="260">D</text><text x="193" y={my + 3}>M</text><text x="202" y="266">H</text><text x="378" y={my + 4}>Q</text><text x="167" y="38">AB = 10</text><text x="376" y="133">6</text><text x="247" y={my - 5}>θ</text></g>
      <circle cx="210" cy={my} r="4" fill="#a83439" />
    </svg></div>
    <label htmlFor={id}>Angle BMQ : {angle}°</label>
    <input id={id} type="range" min="2" max="49" value={angle} onChange={event => setAngle(Number(event.target.value))} />
    <figcaption>AB = 10 · BC = 6 · MH perpendiculaire à DC, H milieu de DC.</figcaption>
  </figure>;
}

export function DerivativeFunctionFigure({ sourceNumber }: { sourceNumber?: number }) {
  const model = sourceNumber === undefined ? undefined : derivativePlotModels[sourceNumber];
  return model ? <Plot model={model} title={`Exercice ${sourceNumber} · Courbe de correction`} /> : null;
}
