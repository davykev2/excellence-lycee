import { useId, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChartLine,
  CirclesThreePlus,
  Compass,
  Function as FunctionIcon,
  GridFour,
  MathOperations,
  Polygon,
  Sparkle,
  Target,
  WaveSine,
} from "@phosphor-icons/react";
import {
  detectAsymptotes,
  formatLinear,
  formatNumber,
  numericalDerivative,
  parseMathExpression,
  sampleCurve,
  type CurvePoint,
  type DetectedAsymptote,
} from "./mathEngine";

type CodexToolId = "functions" | "analytic" | "similarities" | "complex";
type PlotTone = "green" | "orange" | "blue" | "purple" | "navy" | "gold";

interface Point2D {
  x: number;
  y: number;
}

interface PlotPoint extends Point2D {
  label: string;
  tone?: PlotTone;
}

interface PlotSegment {
  from: Point2D;
  to: Point2D;
  tone?: PlotTone;
  dashed?: boolean;
}

interface PlotPolygon {
  points: Point2D[];
  tone?: PlotTone;
  dashed?: boolean;
}

interface PlotCircle {
  center: Point2D;
  radius: number;
  tone?: PlotTone;
  dashed?: boolean;
}

interface PlotCurve {
  segments: CurvePoint[][];
  tone?: PlotTone;
}

const codexTools = [
  {
    id: "functions" as const,
    label: "Fonctions",
    description: "Courbe, asymptotes et tangente",
    icon: FunctionIcon,
  },
  {
    id: "analytic" as const,
    label: "Géométrie analytique",
    description: "Points, vecteurs, droites et cercles",
    icon: GridFour,
  },
  {
    id: "similarities" as const,
    label: "Similitudes",
    description: "Centre, rapport, angle et construction",
    icon: Compass,
  },
  {
    id: "complex" as const,
    label: "Nombres complexes",
    description: "Plan complexe et opérations",
    icon: CirclesThreePlus,
  },
];

function niceTickStep(range: number) {
  const rough = range / 10;
  const power = 10 ** Math.floor(Math.log10(Math.max(rough, 1e-9)));
  const normalized = rough / power;
  if (normalized <= 1) return power;
  if (normalized <= 2) return 2 * power;
  if (normalized <= 5) return 5 * power;
  return 10 * power;
}

function ticks(minimum: number, maximum: number) {
  const step = niceTickStep(maximum - minimum);
  const first = Math.ceil(minimum / step) * step;
  const values: number[] = [];
  for (let value = first; value <= maximum + step * 0.1; value += step) values.push(Number(value.toFixed(8)));
  return values;
}

function CoordinatePlane({
  title,
  description,
  xMin = -10,
  xMax = 10,
  yMin = -10,
  yMax = 10,
  curves = [],
  segments = [],
  polygons = [],
  circles = [],
  points = [],
}: {
  title: string;
  description: string;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  curves?: PlotCurve[];
  segments?: PlotSegment[];
  polygons?: PlotPolygon[];
  circles?: PlotCircle[];
  points?: PlotPoint[];
}) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");
  const width = 840;
  const height = 520;
  const margin = { left: 58, right: 28, top: 26, bottom: 48 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const mapX = (value: number) => margin.left + ((value - xMin) / (xMax - xMin)) * innerWidth;
  const mapY = (value: number) => margin.top + ((yMax - value) / (yMax - yMin)) * innerHeight;
  const xTicks = ticks(xMin, xMax);
  const yTicks = ticks(yMin, yMax);
  const axisX = Math.min(height - margin.bottom, Math.max(margin.top, mapY(0)));
  const axisY = Math.min(width - margin.right, Math.max(margin.left, mapX(0)));

  const pathFor = (segment: CurvePoint[]) => segment
    .map((point, index) => `${index === 0 ? "M" : "L"}${mapX(point.x).toFixed(2)},${mapY(point.y).toFixed(2)}`)
    .join(" ");

  return (
    <div className="codex-plane-wrap">
      <svg className="codex-plane" viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>{title}</title>
        <desc id={`${id}-desc`}>{description}</desc>
        <defs>
          <clipPath id={`${id}-clip`}><rect x={margin.left} y={margin.top} width={innerWidth} height={innerHeight} rx="10" /></clipPath>
          <marker id={`${id}-arrow`} markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L8,3 z" className="codex-plane-arrow" />
          </marker>
        </defs>
        <rect className="codex-plane-background" x={margin.left} y={margin.top} width={innerWidth} height={innerHeight} rx="10" />
        <g className="codex-plane-grid" aria-hidden="true">
          {xTicks.map((value) => <line key={`gx-${value}`} x1={mapX(value)} x2={mapX(value)} y1={margin.top} y2={height - margin.bottom} />)}
          {yTicks.map((value) => <line key={`gy-${value}`} x1={margin.left} x2={width - margin.right} y1={mapY(value)} y2={mapY(value)} />)}
        </g>
        <g className="codex-plane-axes" aria-hidden="true">
          <line x1={margin.left} x2={width - margin.right} y1={axisX} y2={axisX} markerEnd={`url(#${id}-arrow)`} />
          <line x1={axisY} x2={axisY} y1={height - margin.bottom} y2={margin.top} markerEnd={`url(#${id}-arrow)`} />
        </g>
        <g className="codex-plane-ticks" aria-hidden="true">
          {xTicks.filter((value) => Math.abs(value) > 1e-9).map((value) => <text key={`tx-${value}`} x={mapX(value)} y={height - margin.bottom + 24} textAnchor="middle">{formatNumber(value, 1)}</text>)}
          {yTicks.filter((value) => Math.abs(value) > 1e-9).map((value) => <text key={`ty-${value}`} x={margin.left - 13} y={mapY(value) + 5} textAnchor="end">{formatNumber(value, 1)}</text>)}
          <text x={width - margin.right + 3} y={axisX - 9}>x</text>
          <text x={axisY + 10} y={margin.top + 3}>y</text>
        </g>
        <g clipPath={`url(#${id}-clip)`}>
          {circles.map((circle, index) => (
            <circle
              key={`circle-${index}`}
              className={`codex-plot-line is-${circle.tone ?? "blue"} ${circle.dashed ? "is-dashed" : ""}`}
              cx={mapX(circle.center.x)}
              cy={mapY(circle.center.y)}
              r={Math.abs(mapX(circle.center.x + circle.radius) - mapX(circle.center.x))}
              fill="none"
            />
          ))}
          {polygons.map((polygon, index) => (
            <polygon
              key={`polygon-${index}`}
              className={`codex-plot-polygon is-${polygon.tone ?? "green"} ${polygon.dashed ? "is-dashed" : ""}`}
              points={polygon.points.map((point) => `${mapX(point.x)},${mapY(point.y)}`).join(" ")}
            />
          ))}
          {segments.map((segment, index) => (
            <line
              key={`segment-${index}`}
              className={`codex-plot-line is-${segment.tone ?? "navy"} ${segment.dashed ? "is-dashed" : ""}`}
              x1={mapX(segment.from.x)}
              y1={mapY(segment.from.y)}
              x2={mapX(segment.to.x)}
              y2={mapY(segment.to.y)}
            />
          ))}
          {curves.flatMap((curve, curveIndex) => curve.segments.map((segment, segmentIndex) => (
            <path key={`curve-${curveIndex}-${segmentIndex}`} className={`codex-plot-curve is-${curve.tone ?? "green"}`} d={pathFor(segment)} fill="none" />
          )))}
          {points.map((point, index) => (
            <g key={`${point.label}-${index}`} className={`codex-plot-point is-${point.tone ?? "navy"}`}>
              <circle cx={mapX(point.x)} cy={mapY(point.y)} r="5.5" />
              <text x={mapX(point.x) + 9} y={mapY(point.y) - 9}>{point.label}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

function NumberField({ label, value, onChange, step = 0.5, min, max }: { label: string; value: number; onChange: (value: number) => void; step?: number; min?: number; max?: number }) {
  return (
    <label className="codex-number-field">
      <span>{label}</span>
      <input type="number" value={value} step={step} min={min} max={max} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function asymptoteSegments(asymptotes: DetectedAsymptote[], xMin: number, xMax: number, yMin: number, yMax: number): PlotSegment[] {
  return asymptotes.map((asymptote) => {
    if (asymptote.kind === "vertical") return { from: { x: asymptote.x, y: yMin }, to: { x: asymptote.x, y: yMax }, tone: "purple", dashed: true };
    if (asymptote.kind === "horizontal") return { from: { x: xMin, y: asymptote.y }, to: { x: xMax, y: asymptote.y }, tone: "purple", dashed: true };
    return { from: { x: xMin, y: asymptote.slope * xMin + asymptote.intercept }, to: { x: xMax, y: asymptote.slope * xMax + asymptote.intercept }, tone: "purple", dashed: true };
  });
}

const functionPresets = [
  { label: "Rationnelle", value: "(x^2+5*x+4)/(2*x^2-8)" },
  { label: "Parabole", value: "x^2-4*x+3" },
  { label: "Trigonométrique", value: "2*sin(x)" },
  { label: "Logarithme", value: "ln(x)" },
];

function FunctionLab() {
  const [expressionSource, setExpressionSource] = useState(functionPresets[0].value);
  const [tangentX, setTangentX] = useState(0);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);

  const parsed = useMemo(() => {
    try {
      return { expression: parseMathExpression(expressionSource), error: null };
    } catch (error) {
      return { expression: null, error: error instanceof Error ? error.message : "Fonction invalide." };
    }
  }, [expressionSource]);

  const result = useMemo(() => {
    if (!parsed.expression || xMin >= xMax || yMin >= yMax) return null;
    const curve = sampleCurve(parsed.expression.evaluate, xMin, xMax, yMin, yMax);
    const asymptotes = detectAsymptotes(parsed.expression, xMin, xMax);
    const value = parsed.expression.evaluate(tangentX);
    const derivative = numericalDerivative(parsed.expression.evaluate, tangentX);
    const tangentAvailable = Number.isFinite(value) && Number.isFinite(derivative) && Math.abs(derivative) < 1e7;
    return { curve, asymptotes, value, derivative, tangentAvailable };
  }, [parsed.expression, tangentX, xMax, xMin, yMax, yMin]);

  const tangentSegments: PlotSegment[] = result?.tangentAvailable ? [{
    from: { x: xMin, y: result.derivative * (xMin - tangentX) + result.value },
    to: { x: xMax, y: result.derivative * (xMax - tangentX) + result.value },
    tone: "orange",
  }] : [];
  const tangentPoint: PlotPoint[] = result?.tangentAvailable ? [{ x: tangentX, y: result.value, label: `T(${formatNumber(tangentX)} ; ${formatNumber(result.value)})`, tone: "orange" }] : [];

  return (
    <section className="codex-workspace" aria-labelledby="codex-function-title">
      <div className="codex-control-panel">
        <div className="codex-panel-heading"><span><FunctionIcon size={24} weight="duotone" /></span><div><p>Analyse interactive</p><h2 id="codex-function-title">Étudier une fonction</h2></div></div>
        <label className="codex-expression-field"><span>f(x) =</span><input value={expressionSource} onChange={(event) => setExpressionSource(event.target.value)} spellCheck={false} aria-describedby="codex-expression-help" /></label>
        <p id="codex-expression-help" className="codex-field-help">Utilise x, +, −, *, /, ^ et les fonctions sin, cos, tan, sqrt, abs, exp, ln ou log. Exemple : <code>2x+sin(x)</code>.</p>
        <div className="codex-presets" aria-label="Exemples de fonctions">{functionPresets.map((preset) => <button type="button" key={preset.label} onClick={() => setExpressionSource(preset.value)}>{preset.label}</button>)}</div>
        {parsed.error && <div className="codex-inline-error" role="alert">{parsed.error}</div>}
        <div className="codex-control-group"><div><strong>Fenêtre graphique</strong><small>Ajuste les axes si la courbe sort du cadre.</small></div><div className="codex-number-grid"><NumberField label="x min" value={xMin} onChange={setXMin} /><NumberField label="x max" value={xMax} onChange={setXMax} /><NumberField label="y min" value={yMin} onChange={setYMin} /><NumberField label="y max" value={yMax} onChange={setYMax} /></div></div>
        <div className="codex-control-group"><div><strong>Tangente au point d’abscisse a</strong><small>Déplace a pour suivre la tangente.</small></div><label className="codex-range-field"><span>a = {formatNumber(tangentX)}</span><input type="range" min={xMin} max={xMax} step={(xMax - xMin) / 200} value={tangentX} onChange={(event) => setTangentX(Number(event.target.value))} /></label></div>
      </div>
      <div className="codex-visual-panel">
        <CoordinatePlane
          title={`Courbe de f(x) = ${expressionSource}`}
          description="Courbe de la fonction saisie, ses asymptotes détectées numériquement et sa tangente au point choisi."
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
          curves={result ? [{ segments: result.curve, tone: "green" }] : []}
          segments={[...(result ? asymptoteSegments(result.asymptotes, xMin, xMax, yMin, yMax) : []), ...tangentSegments]}
          points={tangentPoint}
        />
        <div className="codex-live-results">
          <div><span>Valeur au point</span><strong>{result?.tangentAvailable ? `f(${formatNumber(tangentX)}) = ${formatNumber(result.value)}` : "Indéfinie"}</strong></div>
          <div><span>Nombre dérivé</span><strong>{result?.tangentAvailable ? `f′(${formatNumber(tangentX)}) ≈ ${formatNumber(result.derivative)}` : "Indisponible"}</strong></div>
          <div><span>Équation de la tangente</span><strong>{result?.tangentAvailable ? `y = ${formatLinear(result.derivative, result.value - result.derivative * tangentX)}` : "Choisis un autre point"}</strong></div>
        </div>
        <div className="codex-asymptotes">
          <div><WaveSine size={21} weight="duotone" /><div><strong>Asymptotes détectées</strong><small>Estimation numérique à vérifier par le calcul dans une démonstration.</small></div></div>
          {result?.asymptotes.length ? <ul>{result.asymptotes.map((item) => <li key={item.label}>{item.label}</li>)}</ul> : <p>Aucune asymptote détectée dans cette fenêtre.</p>}
        </div>
      </div>
    </section>
  );
}

function distance(first: Point2D, second: Point2D) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function AnalyticGeometryLab() {
  const [a, setA] = useState<Point2D>({ x: -3, y: -1 });
  const [b, setB] = useState<Point2D>({ x: 3, y: 2 });
  const [c, setC] = useState<Point2D>({ x: 0, y: 5 });
  const [showLine, setShowLine] = useState(true);
  const [showCircle, setShowCircle] = useState(true);
  const midpoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const vector = { x: b.x - a.x, y: b.y - a.y };
  const slope = Math.abs(vector.x) < 1e-10 ? null : vector.y / vector.x;
  const intercept = slope === null ? null : a.y - slope * a.x;
  const xMin = -10;
  const xMax = 10;
  const lineSegment: PlotSegment[] = showLine ? slope === null
    ? [{ from: { x: a.x, y: -10 }, to: { x: a.x, y: 10 }, tone: "purple", dashed: true }]
    : [{ from: { x: xMin, y: slope * xMin + (intercept ?? 0) }, to: { x: xMax, y: slope * xMax + (intercept ?? 0) }, tone: "purple", dashed: true }]
    : [];

  const pointEditor = (label: string, point: Point2D, update: (point: Point2D) => void) => (
    <fieldset className="codex-point-editor"><legend>Point {label}</legend><NumberField label="x" value={point.x} onChange={(x) => update({ ...point, x })} /><NumberField label="y" value={point.y} onChange={(y) => update({ ...point, y })} /></fieldset>
  );

  return (
    <section className="codex-workspace" aria-labelledby="codex-analytic-title">
      <div className="codex-control-panel">
        <div className="codex-panel-heading"><span><GridFour size={24} weight="duotone" /></span><div><p>Repère cartésien</p><h2 id="codex-analytic-title">Géométrie analytique</h2></div></div>
        <div className="codex-point-grid">{pointEditor("A", a, setA)}{pointEditor("B", b, setB)}{pointEditor("C", c, setC)}</div>
        <div className="codex-toggle-list">
          <label><input type="checkbox" checked={showLine} onChange={(event) => setShowLine(event.target.checked)} /><span>Afficher la droite (AB)</span></label>
          <label><input type="checkbox" checked={showCircle} onChange={(event) => setShowCircle(event.target.checked)} /><span>Cercle de centre A passant par B</span></label>
        </div>
        <div className="codex-method-note"><Sparkle size={20} weight="duotone" /><p>Déplace les coordonnées : les constructions et les résultats se mettent à jour instantanément.</p></div>
      </div>
      <div className="codex-visual-panel">
        <CoordinatePlane
          title="Construction de géométrie analytique"
          description="Les points A, B et C, le triangle ABC, le vecteur AB, la droite AB et le cercle de centre A passant par B."
          curves={[]}
          polygons={[{ points: [a, b, c], tone: "green" }]}
          segments={[{ from: a, to: b, tone: "orange" }, ...lineSegment]}
          circles={showCircle ? [{ center: a, radius: distance(a, b), tone: "blue", dashed: true }] : []}
          points={[{ ...a, label: "A", tone: "navy" }, { ...b, label: "B", tone: "orange" }, { ...c, label: "C", tone: "green" }, { ...midpoint, label: "I milieu", tone: "purple" }]}
        />
        <div className="codex-live-results is-four">
          <div><span>Vecteur AB</span><strong>({formatNumber(vector.x)} ; {formatNumber(vector.y)})</strong></div>
          <div><span>Distance AB</span><strong>{formatNumber(distance(a, b))}</strong></div>
          <div><span>Milieu I</span><strong>({formatNumber(midpoint.x)} ; {formatNumber(midpoint.y)})</strong></div>
          <div><span>Droite (AB)</span><strong>{slope === null ? `x = ${formatNumber(a.x)}` : `y = ${formatLinear(slope, intercept ?? 0)}`}</strong></div>
        </div>
      </div>
    </section>
  );
}

function rotateAndScale(point: Point2D, center: Point2D, ratio: number, angleDegrees: number): Point2D {
  const angle = (angleDegrees * Math.PI) / 180;
  const x = point.x - center.x;
  const y = point.y - center.y;
  return {
    x: center.x + ratio * (x * Math.cos(angle) - y * Math.sin(angle)),
    y: center.y + ratio * (x * Math.sin(angle) + y * Math.cos(angle)),
  };
}

function SimilarityLab() {
  const original = [{ x: -3, y: -2 }, { x: 2, y: -2 }, { x: 0, y: 2.5 }];
  const [center, setCenter] = useState<Point2D>({ x: 0, y: 0 });
  const [ratio, setRatio] = useState(1.4);
  const [angle, setAngle] = useState(40);
  const transformed = original.map((point) => rotateAndScale(point, center, ratio, angle));

  return (
    <section className="codex-workspace" aria-labelledby="codex-similarity-title">
      <div className="codex-control-panel">
        <div className="codex-panel-heading"><span><Compass size={24} weight="duotone" /></span><div><p>Transformation du plan</p><h2 id="codex-similarity-title">Construire une similitude directe</h2></div></div>
        <div className="codex-number-grid"><NumberField label="Centre Ω — x" value={center.x} onChange={(x) => setCenter({ ...center, x })} /><NumberField label="Centre Ω — y" value={center.y} onChange={(y) => setCenter({ ...center, y })} /></div>
        <label className="codex-range-field"><span>Rapport k = {formatNumber(ratio, 2)}</span><input type="range" min="0.2" max="3" step="0.05" value={ratio} onChange={(event) => setRatio(Number(event.target.value))} /></label>
        <label className="codex-range-field"><span>Angle θ = {formatNumber(angle, 0)}°</span><input type="range" min="-180" max="180" step="1" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></label>
        <div className="codex-method-note"><Target size={20} weight="duotone" /><p>Chaque point est d’abord tourné de θ autour de Ω, puis sa distance à Ω est multipliée par k.</p></div>
      </div>
      <div className="codex-visual-panel">
        <CoordinatePlane
          title="Construction d’une similitude directe"
          description="Triangle initial en vert, son image en orange et segments de construction depuis le centre de la similitude."
          polygons={[{ points: original, tone: "green" }, { points: transformed, tone: "orange" }]}
          segments={original.flatMap((point, index) => [{ from: center, to: point, tone: "green", dashed: true } as PlotSegment, { from: center, to: transformed[index], tone: "orange", dashed: true } as PlotSegment])}
          points={[
            { ...center, label: "Ω", tone: "purple" },
            ...original.map((point, index) => ({ ...point, label: ["A", "B", "C"][index], tone: "green" as PlotTone })),
            ...transformed.map((point, index) => ({ ...point, label: `${["A", "B", "C"][index]}′`, tone: "orange" as PlotTone })),
          ]}
        />
        <div className="codex-live-results">
          <div><span>Centre</span><strong>Ω({formatNumber(center.x)} ; {formatNumber(center.y)})</strong></div>
          <div><span>Rapport</span><strong>k = {formatNumber(ratio, 2)}</strong></div>
          <div><span>Angle</span><strong>θ = {formatNumber(angle, 0)}°</strong></div>
        </div>
      </div>
    </section>
  );
}

function multiplyComplex(first: Point2D, second: Point2D) {
  return { x: first.x * second.x - first.y * second.y, y: first.x * second.y + first.y * second.x };
}

function complexLabel(point: Point2D) {
  const imaginary = `${point.y >= 0 ? "+" : "−"} ${formatNumber(Math.abs(point.y))}i`;
  return `${formatNumber(point.x)} ${imaginary}`;
}

function ComplexLab() {
  const [z, setZ] = useState<Point2D>({ x: 3, y: 2 });
  const [w, setW] = useState<Point2D>({ x: -1, y: 2 });
  const sum = { x: z.x + w.x, y: z.y + w.y };
  const product = multiplyComplex(z, w);
  const conjugate = { x: z.x, y: -z.y };
  const allValues = [z, w, sum, product, conjugate];
  const bound = Math.max(6, ...allValues.flatMap((point) => [Math.abs(point.x), Math.abs(point.y)])) + 1;

  return (
    <section className="codex-workspace" aria-labelledby="codex-complex-title">
      <div className="codex-control-panel">
        <div className="codex-panel-heading"><span><CirclesThreePlus size={24} weight="duotone" /></span><div><p>Plan d’Argand</p><h2 id="codex-complex-title">Visualiser les nombres complexes</h2></div></div>
        <fieldset className="codex-complex-editor"><legend>z = a + bi</legend><NumberField label="a — partie réelle" value={z.x} onChange={(x) => setZ({ ...z, x })} /><NumberField label="b — partie imaginaire" value={z.y} onChange={(y) => setZ({ ...z, y })} /></fieldset>
        <fieldset className="codex-complex-editor"><legend>w = c + di</legend><NumberField label="c — partie réelle" value={w.x} onChange={(x) => setW({ ...w, x })} /><NumberField label="d — partie imaginaire" value={w.y} onChange={(y) => setW({ ...w, y })} /></fieldset>
        <div className="codex-method-note"><MathOperations size={20} weight="duotone" /><p>Le module est la distance à l’origine et l’argument est l’angle orienté avec l’axe réel.</p></div>
      </div>
      <div className="codex-visual-panel">
        <CoordinatePlane
          title="Représentation dans le plan complexe"
          description="Affixes z, w, leur somme, leur produit et le conjugué de z dans le plan complexe."
          xMin={-bound}
          xMax={bound}
          yMin={-bound}
          yMax={bound}
          segments={[
            { from: { x: 0, y: 0 }, to: z, tone: "green" },
            { from: { x: 0, y: 0 }, to: w, tone: "blue" },
            { from: { x: 0, y: 0 }, to: sum, tone: "orange" },
            { from: { x: 0, y: 0 }, to: product, tone: "purple" },
            { from: { x: 0, y: 0 }, to: conjugate, tone: "gold", dashed: true },
          ]}
          points={[
            { ...z, label: "z", tone: "green" },
            { ...w, label: "w", tone: "blue" },
            { ...sum, label: "z + w", tone: "orange" },
            { ...product, label: "zw", tone: "purple" },
            { ...conjugate, label: "z̄", tone: "gold" },
          ]}
        />
        <div className="codex-live-results is-four">
          <div><span>z</span><strong>{complexLabel(z)}</strong></div>
          <div><span>Module |z|</span><strong>{formatNumber(Math.hypot(z.x, z.y))}</strong></div>
          <div><span>Argument de z</span><strong>{formatNumber((Math.atan2(z.y, z.x) * 180) / Math.PI, 1)}°</strong></div>
          <div><span>z + w</span><strong>{complexLabel(sum)}</strong></div>
          <div><span>z × w</span><strong>{complexLabel(product)}</strong></div>
          <div><span>Conjugué de z</span><strong>{complexLabel(conjugate)}</strong></div>
        </div>
      </div>
    </section>
  );
}

export function MathCodexPage({ onBackArena }: { onBackArena: () => void }) {
  const [activeTool, setActiveTool] = useState<CodexToolId>("functions");

  return (
    <main className="codex-page">
      <header className="codex-page-header">
        <button type="button" onClick={onBackArena}><ArrowLeft size={19} weight="bold" />Retour à l’Arène</button>
        <div><p><Sparkle size={16} weight="fill" /> Laboratoire interactif Excellence</p><h1>Codex Mathématiques</h1><span>Observe, manipule et vérifie tes conjectures avant de démontrer.</span></div>
        <div className="codex-header-mark"><ChartLine size={26} weight="duotone" /><span>Mode exploration</span></div>
      </header>

      <nav className="codex-tool-tabs" aria-label="Outils du Codex">
        {codexTools.map((tool) => {
          const Icon = tool.icon;
          const active = activeTool === tool.id;
          return <button type="button" key={tool.id} className={active ? "is-active" : ""} aria-pressed={active} onClick={() => setActiveTool(tool.id)}><Icon size={24} weight="duotone" /><span><strong>{tool.label}</strong><small>{tool.description}</small></span></button>;
        })}
      </nav>

      {activeTool === "functions" && <FunctionLab />}
      {activeTool === "analytic" && <AnalyticGeometryLab />}
      {activeTool === "similarities" && <SimilarityLab />}
      {activeTool === "complex" && <ComplexLab />}

      <footer className="codex-disclaimer"><Polygon size={21} weight="duotone" /><p><strong>Le graphique aide à comprendre.</strong> Pour un devoir, rédige toujours les calculs et les justifications attendues.</p></footer>
    </main>
  );
}

