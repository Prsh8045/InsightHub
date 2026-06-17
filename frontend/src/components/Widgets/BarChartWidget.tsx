import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  config?: {
    data?: Array<Record<string, any>>;
    xKey?: string;
    yKey?: string;
    color?: string;
  };
}

const defaultData = [
  { name: "Q1", value: 4000 },
  { name: "Q2", value: 3000 },
  { name: "Q3", value: 2000 },
  { name: "Q4", value: 2780 },
];

export default function BarChartWidget({ config }: Props) {
  const data = config?.data ?? defaultData;
  const xKey = config?.xKey ?? "name";
  const yKey = config?.yKey ?? "value";

  return (
    <div className="widget-chart">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e5e7f2" strokeDasharray="3 3" />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: "#5e668b", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#5e668b", fontSize: 12 }} />
          <Tooltip cursor={{ stroke: "#dce1f5", strokeWidth: 2 }} />
          <Bar dataKey={yKey} fill={config?.color ?? "#60d4a4"} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
