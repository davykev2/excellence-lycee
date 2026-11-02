import type { SubjectDefinition } from "../../domain/learning";
import { SubjectPreview } from "./SubjectPreview";

/** Same preview parabola as the historical home; fixed coordinates avoid resize observers on navigation. */
export const homeParabola = { coefficient: .42, constant: -2, xMin: -5, xMax: 5, yMin: -3, yMax: 9 } as const;
const root = Math.sqrt(-homeParabola.constant / homeParabola.coefficient);
const xPixel = (x: number) => 20 + (x - homeParabola.xMin) * 36;
const yPixel = (y: number) => 20 + (homeParabola.yMax - y) * (250 / 12);
function curvePath(start: number, end: number, segments: number) {
  return Array.from({ length: segments + 1 }, (_, i) => {
    const x = start + (end - start) * i / segments;
    return `${i ? "L" : "M"}${xPixel(x).toFixed(3)},${yPixel(.42 * x * x - 2).toFixed(3)}`;
  }).join(" ");
}
const curve = curvePath(-5, 5, 80);
const shadedArea = `${curvePath(-root, root, 40)} L${xPixel(-root)},${yPixel(0)} Z`;

export function HomeSubjectPreview({ subject, lessonTitle }: { subject: SubjectDefinition; lessonTitle: string }) {
  if (subject.id !== "mathematics") return <SubjectPreview subject={subject} lessonTitle={lessonTitle} />;
  return <div className="math-chart home-function-preview" role="img" aria-label="Parabole représentant une fonction du second degré">
    <svg viewBox="0 0 400 290" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <g stroke="#d9e2eb" strokeWidth="1" strokeDasharray="3 3">
        {[-5, -2.5, 0, 2.5, 5].map(x => <path key={`x${x}`} d={`M${xPixel(x)},20 V270`} />)}
        {[-3, 0, 3, 6, 9].map(y => <path key={`y${y}`} d={`M20,${yPixel(y)} H380`} />)}
      </g>
      <path d={shadedArea} fill="#e3f0e3" />
      <path d={`M200,20 V270 M20,${yPixel(0)} H380`} stroke="#8a98a9" strokeWidth="1.4" />
      <path d={curve} stroke="#0b2c67" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {[-root, root].map(x => <circle key={x} cx={xPixel(x)} cy={yPixel(0)} r="5.5" fill="#ed5508" stroke="#fff" strokeWidth="2" />)}
      <circle cx="200" cy={yPixel(-2)} r="5.5" fill="#42a53c" stroke="#fff" strokeWidth="2" />
    </svg>
  </div>;
}
