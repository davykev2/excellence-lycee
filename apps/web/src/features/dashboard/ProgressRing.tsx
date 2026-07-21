import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface ProgressRingProps {
  value: number;
}

export function ProgressRing({ value }: ProgressRingProps) {
  const data = [
    { name: "Maîtrisé", value, fill: "#4caf43" },
    { name: "À poursuivre", value: 100 - value, fill: "#e5e7e8" },
  ];

  return (
    <div className="progress-ring" aria-label={`Progression : ${value} %`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius="73%"
            outerRadius="93%"
            startAngle={90}
            endAngle={-270}
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((item) => <Cell key={item.name} fill={item.fill} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <strong>{value} %</strong>
    </div>
  );
}
