import { Card, Statistic, Progress, Typography } from "antd";

const { Text } = Typography;

interface Props {
  config?: {
    title?: string;
    value?: number;
    prefix?: string;
    suffix?: string;
    change?: number;
    description?: string;
  };
}

export default function KPIWidget({ config }: Props) {
  const title = config?.title ?? "Revenue";
  const value = config?.value ?? 102400;
  const change = config?.change ?? 12.4;
  const direction = change >= 0 ? "up" : "down";

  return (
    <Card className="kpi-card" bodyStyle={{ padding: 16 }}>
      <Statistic
        title={title}
        value={value}
        prefix={config?.prefix ?? "₹"}
        suffix={config?.suffix ?? ""}
      />
      <div className="kpi-meta">
        <Text type="secondary">{config?.description ?? "Live workspace performance snapshot."}</Text>
        <div className="kpi-progress">
          <Progress
            percent={Math.min(Math.max(Math.abs(change), 0), 100)}
            showInfo={false}
            strokeColor={direction === "up" ? "#52c41a" : "#f5222d"}
          />
          <Text type={direction === "up" ? "success" : "danger"}>
            {direction === "up" ? "+" : "-"}
            {Math.abs(change)}% since last week
          </Text>
        </div>
      </div>
    </Card>
  );
}
