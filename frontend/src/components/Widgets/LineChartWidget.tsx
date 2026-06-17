import {
  LineChart,
  Line,
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
  { name: "Mon", value: 2400 },
  { name: "Tue", value: 2210 },
  { name: "Wed", value: 2290 },
  { name: "Thu", value: 2000 },
  { name: "Fri", value: 2780 },
  { name: "Sat", value: 1890 },
  { name: "Sun", value: 2390 },
];

export default function LineChartWidget({ config }: Props) {
  const data = config?.data ?? defaultData;
  const xKey = config?.xKey ?? "name";
  const yKey = config?.yKey ?? "value";

  return (
    <div className="widget-chart">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e5e7f2" strokeDasharray="3 3" />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: "#5e668b", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#5e668b", fontSize: 12 }} />
          <Tooltip cursor={{ stroke: "#dce1f5", strokeWidth: 2 }} />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={config?.color ?? "#5b8ff9"}
            strokeWidth={3}
            dot={{ r: 4, fill: config?.color ?? "#5b8ff9" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
