import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface MathPreviewChartProps {
  coefficient?: number;
  compact?: boolean;
}

function buildParabola(coefficient: number) {
  return Array.from({ length: 41 }, (_, index) => {
    const x = -5 + index * 0.25;
    return { x, y: coefficient * x * x - 2 };
  });
}

export function MathPreviewChart({ coefficient = 0.42, compact = false }: MathPreviewChartProps) {
  const data = buildParabola(coefficient);
  const root = Math.sqrt(2 / coefficient);

  return (
    <div className={`math-chart ${compact ? "is-compact" : ""}`} role="img" aria-label="Parabole représentant une fonction du second degré">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 14, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid stroke="#d9dee3" strokeDasharray="3 3" vertical horizontal />
          <XAxis type="number" dataKey="x" domain={[-5, 5]} tick={false} axisLine={false} />
          <YAxis type="number" domain={[-3, 9]} tick={false} axisLine={false} width={0} />
          <ReferenceArea x1={-2.5} x2={2.5} y1={-3} y2={0} fill="#dcefd8" fillOpacity={0.55} stroke="none" />
          <ReferenceLine x={0} stroke="#808a9a" strokeWidth={1.5} />
          <ReferenceLine y={0} stroke="#808a9a" strokeWidth={1.5} />
          <Line type="monotone" dataKey="y" stroke="#0b2c67" strokeWidth={4} dot={false} isAnimationActive={false} />
          <ReferenceDot x={-root} y={0} r={7} fill="#f45d08" stroke="#ffffff" strokeWidth={2} />
          <ReferenceDot x={root} y={0} r={7} fill="#f45d08" stroke="#ffffff" strokeWidth={2} />
          <ReferenceDot x={0} y={-2} r={7} fill="#42a53c" stroke="#ffffff" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
