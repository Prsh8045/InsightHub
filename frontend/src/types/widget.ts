export interface Widget {
  id: number;
  title: string;
  type: "LINE" | "BAR" | "KPI" | "TABLE" | string;
  config: any;
  pinned?: boolean;
  description?: string;
  updatedAt?: string;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string;
    minW?: number;
    minH?: number;
  };
}
