import { useId, useState } from "react";
import { GcdFigure } from "../../mathematics/GcdFigure";
import type { ArenaExerciseItem } from "../../../domain/arenaExercises";
import { DerivativeFunctionFigure, DerivativeInflectionFigure, DerivativeTriangleFigure, DerivativeWaterWallFigure } from "./DerivativeExerciseFigures";
import { PrimitivePopulationFigure } from "./PrimitivePopulationFigure";
import { LogarithmFunctionFigure } from "./LogarithmExerciseFigures";
import { ExponentialFunctionFigure } from "./ExponentialExerciseFigures";
import { SequenceExerciseFigure } from "./SequenceExerciseFigures";
import { IntegralFigure } from "../../mathematics/IntegralFigure";
import { DifferentialFigure } from "../../mathematics/DifferentialFigure";
import { ProbabilityFigure } from "../../mathematics/ProbabilityFigure";
import { StatisticsFigure } from "../../mathematics/StatisticsFigure";
import { BarycenterFigure } from "../../mathematics/BarycenterFigure";
import { ArithmeticFigure } from "../../mathematics/ArithmeticFigure";
import { SpaceGeometryFigure } from "../../mathematics/SpaceGeometryFigure";
import { ConicFigure } from "../../mathematics/ConicFigure";
import { ComplexFigure } from "../../mathematics/ComplexFigure";

function AsymptoteFigure() {
  const id = useId().replace(/:/g, "");
  const sx = (x: number) => 190 + x * 40;
  const sy = (y: number) => 245 - y * 34;
  const segments = [[-4.3, -1.01], [-0.99, 0.99], [1.01, 4.3]];
  const paths = segments.map(([min, max]) => {
    let result = "";
    for (let i = 0; i <= 250; i++) {
      const x = min + (max - min) * i / 250;
      // Qualitative reconstruction: no formula is attributed to the printed source.
      const y = x + 2 + 1 / (1 - x * x);
      result += `${i ? "L" : "M"}${sx(x).toFixed(2)},${sy(y).toFixed(2)}`;
    }
    return result;
  });
  return <figure className="practice-native-figure">
    <svg viewBox="0 0 390 400" role="img" aria-label="Courbe à trois branches : asymptotes verticales x égale moins un et x égale un, asymptote oblique y égale x plus deux.">
      <defs><clipPath id={id}><rect x="15" y="10" width="360" height="370" /></clipPath></defs>
      <g className="practice-graph-grid">{[-4,-3,-2,-1,0,1,2,3,4].map(x => <line key={x} x1={sx(x)} x2={sx(x)} y1="10" y2="380" />)}{[-3,-2,-1,0,1,2,3,4,5,6].map(y => <line key={y} x1="15" x2="375" y1={sy(y)} y2={sy(y)} />)}</g>
      <g className="practice-graph-axes"><line x1="15" x2="375" y1={sy(0)} y2={sy(0)} /><line x1={sx(0)} x2={sx(0)} y1="10" y2="380" /></g>
      <g className="practice-graph-guides" clipPath={`url(#${id})`}><line x1={sx(-1)} x2={sx(-1)} y1="10" y2="380" /><line x1={sx(1)} x2={sx(1)} y1="10" y2="380" /><line x1={sx(-5)} y1={sy(-3)} x2={sx(5)} y2={sy(7)} /></g>
      <g className="practice-graph-curve" clipPath={`url(#${id})`}>{paths.map((d, index) => <path key={index} d={d} />)}</g>
      <g className="practice-graph-labels"><text x={sx(0)+5} y={sy(0)+17}>O</text><text x={sx(1)+3} y={sy(0)+17}>1</text><text x={sx(-1)-18} y={sy(0)+17}>−1</text><text x={sx(1)+5} y="23">D₁</text><text x={sx(-1)-25} y="23">D₂</text><text x="45" y="320">D₃</text><text x="337" y="50">(C)</text></g>
    </svg><figcaption>Courbe et droites redessinées pour la lecture graphique. Les points x = −1 et x = 1 sont exclus.</figcaption>
  </figure>;
}
function CircleFigure() {
  const [angle, setAngle] = useState(75);
  const id = useId();
  const radians = angle * Math.PI / 180;
  const fx = 190 + 115 * Math.cos(radians), fy = 160 - 115 * Math.sin(radians);
  return <figure className="practice-native-figure">
    <svg viewBox="0 0 380 330" role="img" aria-label={`Cercle de rayon un. E est à droite de O, G à gauche, F forme avec OE un angle de ${angle} degrés.`}>
      <circle cx="190" cy="160" r="115" className="practice-circle-outline" />
      <path d={`M305,160 A115,115 0 0 0 ${fx},${fy} L305,160 Z`} className="practice-circle-segment" />
      <path d={`M190,160 L305,160 L${fx},${fy} Z`} className="practice-circle-triangle" />
      <line x1="75" x2="305" y1="160" y2="160" className="practice-circle-line" />
      <line x1="190" x2={fx} y1="160" y2={fy} className="practice-circle-line" />
      <path d={`M220,160 A30,30 0 0 0 ${190+30*Math.cos(radians)},${160-30*Math.sin(radians)}`} className="practice-circle-line" fill="none" />
      <g className="practice-graph-labels"><text x="179" y="180">O</text><text x="312" y="165">E</text><text x="58" y="165">G</text><text x={fx+5} y={fy-8}>F</text><text x="225" y="145">α</text></g>
      {[["O",190,160],["E",305,160],["G",75,160],["F",fx,fy]].map(([name,x,y]) => <circle key={name} cx={x} cy={y} r="4" fill="#175180" />)}
    </svg>
    <label htmlFor={id}>Explorer la figure : α = {angle}°</label>
    <input id={id} type="range" min="1" max="179" step="1" value={angle} onChange={event => setAngle(Number(event.target.value))} />
    <figcaption>Déplace F pour comparer le triangle OEF et la région située entre la corde et l’arc. La figure ne fixe pas la réponse.</figcaption>
  </figure>;
}
export function ExerciseFigure({ kind, sourceNumber }: { kind: ArenaExerciseItem["figureKey"]; sourceNumber?: number }) {
  if(kind==="tc-t2-l6-gcd"&&sourceNumber!==undefined)return <GcdFigure preset={sourceNumber}/>;
  if((kind==="tc-t2-l5-complex"||kind==="tc-t2-l5-circuit")&&sourceNumber!==undefined)return <ComplexFigure exerciseNumber={sourceNumber} blank={kind==="tc-t2-l5-circuit"}/>;
  if(kind==="tc-t2-l4-conic"&&sourceNumber!==undefined)return <ConicFigure exerciseNumber={sourceNumber}/>;
  if(kind==="tc-t2-l3-space"&&sourceNumber!==undefined)return <SpaceGeometryFigure preset={sourceNumber}/>;
  if(kind==="tc-t2-l2-arithmetic"&&sourceNumber!==undefined)return <ArithmeticFigure preset={sourceNumber}/>;
  if ((kind==="tc-t2-l1-barycenter"||kind==="tc-t2-l1-source")&&sourceNumber!==undefined) return <BarycenterFigure preset={sourceNumber} blank={kind==="tc-t2-l1-source"}/>;
  if ((kind === "tc-l10-statistics" || kind === "tc-l10-scatter-blank") && sourceNumber !== undefined) return <StatisticsFigure preset={sourceNumber} blank={kind === "tc-l10-scatter-blank"}/>;
  if ((kind === "tc-l9-probability" || kind === "tc-l9-tree-blank") && sourceNumber !== undefined) return <ProbabilityFigure preset={sourceNumber} blank={kind==="tc-l9-tree-blank"}/>;
  if (kind === "tc-l8-differential" && sourceNumber !== undefined) return <DifferentialFigure preset={sourceNumber} />;
  if (kind === "tc-l7-integrals" && sourceNumber !== undefined) return <IntegralFigure preset={sourceNumber} />;
  if (kind === "tc-l6-sequences") return <SequenceExerciseFigure sourceNumber={sourceNumber} />;
  if (kind === "tc-l5-functions") return <ExponentialFunctionFigure sourceNumber={sourceNumber} />;
  if (kind === "tc-l4-functions") return <LogarithmFunctionFigure sourceNumber={sourceNumber} />;
  if (kind === "tc-l3-population") return <PrimitivePopulationFigure />;
  if (kind === "tc-l2-functions") return <DerivativeFunctionFigure sourceNumber={sourceNumber} />;
  if (kind === "tc-l2-inflection") return <DerivativeInflectionFigure />;
  if (kind === "tc-l2-triangle") return <DerivativeTriangleFigure />;
  if (kind === "tc-l2-water-wall") return <DerivativeWaterWallFigure />;
  if (kind === "tc-l1-asymptotes") return <AsymptoteFigure />;
  if (kind === "tc-l1-circle") return <CircleFigure />;
  if (kind === "tc-l1-variation") return <figure className="practice-native-figure"><div className="practice-table-scroll" tabIndex={0} role="region" aria-label="Tableau de variation de f, défilable horizontalement">
    <table className="practice-variation-table"><caption>Tableau de variation de f</caption><tbody>
      <tr><th>x</th><td>−∞</td><td></td><td>2</td><td></td><td>4</td><td></td><td>+∞</td></tr>
      <tr><th>f′(x)</th><td></td><td>+</td><td>0</td><td>−</td><td>0</td><td>+</td><td></td></tr>
      <tr><th>f(x)</th><td>−∞</td><td>↗</td><td>4</td><td>↘</td><td>0</td><td>↗</td><td>+∞</td></tr>
    </tbody></table>
  </div></figure>;
  return null;
}
