import { Table } from "antd";

interface Props {
  config?: {
    columns?: Array<any>;
    rows?: Array<Record<string, any>>;
  };
}

const defaultColumns = [
  { title: "User", dataIndex: "user", key: "user" },
  { title: "Visits", dataIndex: "visits", key: "visits" },
  { title: "Conversion", dataIndex: "conversion", key: "conversion" },
  { title: "Revenue", dataIndex: "revenue", key: "revenue" },
];

const defaultRows = [
  { id: 1, user: "Acme Corp", visits: 672, conversion: "12%", revenue: "$18.4k" },
  { id: 2, user: "Brightloop", visits: 511, conversion: "9%", revenue: "$13.6k" },
  { id: 3, user: "Nova Studio", visits: 443, conversion: "11%", revenue: "$10.1k" },
  { id: 4, user: "Luna Tech", visits: 384, conversion: "8%", revenue: "$7.8k" },
];

export default function DataTableWidget({ config }: Props) {
  const columns = config?.columns ?? defaultColumns;
  const rows = config?.rows ?? defaultRows;

  return (
    <div className="widget-table-wrap">
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey={(record) => record.id || record.user}
        size="small"
        className="widget-table"
      />
    </div>
  );
}
