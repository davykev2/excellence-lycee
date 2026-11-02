import { useId, useState } from "react";
import { MathText } from "../../../components/MathText";

const notableAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, -150, -135, -120, -90, -60, -45, -30];
const angleLabels: Record<number, string> = { 0: "0", 30: "π/6", 45: "π/4", 60: "π/3", 90: "π/2", 120: "2π/3", 135: "3π/4", 150: "5π/6", 180: "π", [-150]: "−5π/6", [-135]: "−3π/4", [-120]: "−2π/3", [-90]: "−π/2", [-60]: "−π/3", [-45]: "−π/4", [-30]: "−π/6" };
const round = (value: number) => (Math.abs(value) < 1e-10 ? "0" : value.toFixed(3).replace(".", ","));

/** Original orthonormal drawing, independent of the textbook's raster circle. */
export function EssentialUnitCircle() {
  const [degrees, setDegrees] = useState(30);
  const id = useId();
  const radians = degrees * Math.PI / 180;
  const x = 210 + 140 * Math.cos(radians);
  const y = 205 - 140 * Math.sin(radians);
  return <figure className="essential-circle">
    <div className="essential-circle-scroll" tabIndex={0} role="region" aria-label="Cercle trigonométrique">
      <svg viewBox="0 0 420 410" role="img" aria-labelledby={`${id}-title ${id}-description`}>
        <title id={`${id}-title`}>Point sur le cercle trigonométrique</title>
        <desc id={`${id}-description`}>Repère orthonormé. Le point M se projette sur le cosinus horizontal et le sinus vertical de l’angle choisi.</desc>
        <line x1="25" y1="205" x2="397" y2="205" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="210" y1="25" x2="210" y2="386" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="210" cy="205" r="140" fill="none" stroke="currentColor" strokeWidth="1.6"/>
        {notableAngles.map(angle => {
          const a = angle * Math.PI / 180;
          return <circle key={angle} cx={210 + 140 * Math.cos(a)} cy={205 - 140 * Math.sin(a)} r="2.7" fill="#8b96a5"/>;
        })}
        {[0, 30, 60, 90, 120, 150, 180, -150, -120, -90, -60, -30].map(angle => {
          const a = angle * Math.PI / 180;
          return <text key={angle} x={210 + 166 * Math.cos(a)} y={210 - 166 * Math.sin(a)} textAnchor="middle">{angleLabels[angle]}</text>;
        })}
        <line x1={x} y1={y} x2={x} y2="205" stroke="#2563eb" strokeDasharray="5 4"/>
        <line x1={x} y1={y} x2="210" y2={y} stroke="#0e806d" strokeDasharray="5 4"/>
        <line x1="210" y1="205" x2={x} y2={y} stroke="#7c3aed" strokeWidth="2.4"/>
        <line x1="210" y1="205" x2={x} y2="205" stroke="#2563eb" strokeWidth="4"/>
        <line x1="210" y1="205" x2="210" y2={y} stroke="#0e806d" strokeWidth="4"/>
        <circle cx={x} cy={y} r="5.5" fill="#7c3aed"/>
        <text x={210 + 112 * Math.cos(radians) + 12 * Math.sin(radians)} y={210 - 112 * Math.sin(radians) + 12 * Math.cos(radians)} textAnchor="middle" className="essential-circle-point">M</text>
        <text x="198" y="223">O</text>
        <text x="386" y="225">Re</text>
        <text x="220" y="27">Im</text>
      </svg>
    </div>
    <figcaption>
      <label htmlFor={id}>Angle <strong>{degrees}°{angleLabels[degrees] ? ` · ${angleLabels[degrees]} rad` : ""}</strong></label>
      <input id={id} type="range" min="-180" max="180" step="5" value={degrees} onChange={event => setDegrees(Number(event.target.value))}/>
      <div className="essential-circle-angles">{[0, 30, 45, 60, 90, 180, -90].map(angle => <button key={angle} type="button" aria-pressed={degrees === angle} onClick={() => setDegrees(angle)}>{angleLabels[angle]}</button>)}</div>
      <p><MathText>{String.raw`$M(\cos\theta;\sin\theta)$`}</MathText></p>
      <div className="essential-circle-values"><span>Cosinus ≈ {round(Math.cos(radians))}</span><span>Sinus ≈ {round(Math.sin(radians))}</span></div>
    </figcaption>
  </figure>;
}
