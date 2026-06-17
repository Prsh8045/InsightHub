import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, Button, Row, Col, Spin, Space, Tag, Select, Divider, Empty, Typography } from "antd";
import { Responsive } from "react-grid-layout";
import type { Widget } from "../../types/widget";

type Layout = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
};
import socket from "../../socket/socket";
import { getWorkspace } from "../../services/workspaceService";
import { updateWidget } from "../../services/widgetService";
import LineChartWidget from "../../components/Widgets/LineChartWidget";
import BarChartWidget from "../../components/Widgets/BarChartWidget";
import KPIWidget from "../../components/Widgets/KPIWidget";
import DataTableWidget from "../../components/Widgets/DataTableWidget";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = Responsive;
const { Title, Text } = Typography;

type WorkspaceResponse = {
  workspace: {
    id: number;
    name: string;
    role: string;
  };
  widgets: Widget[];
};

type WorkspaceFilter = {
  range: "24h" | "7d" | "30d";
  metric: "revenue" | "users" | "sessions";
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const user = useSelector((state: any) => state.auth.user);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [filterDraft, setFilterDraft] = useState<WorkspaceFilter>({ range: "7d", metric: "revenue" });
  const [activeFilter, setActiveFilter] = useState<WorkspaceFilter>({ range: "7d", metric: "revenue" });
  const [isSavingLayout, setIsSavingLayout] = useState(false);

  const workspaceKey = ["workspace", workspaceId] as const;
  const workspaceQuery = useQuery<WorkspaceResponse>({
    queryKey: workspaceKey,
    queryFn: () => getWorkspace(Number(workspaceId)),
    enabled: !!workspaceId,
  });

  const { data, isLoading } = workspaceQuery;

  useEffect(() => {
    if (workspaceQuery.data) {
      setWidgets(workspaceQuery.data.widgets || []);
    }
  }, [workspaceQuery.data]);

  const role = user?.role;
  const canEdit = ["ADMIN", "ANALYST"].includes(role);

  useEffect(() => {
    if (!workspaceId) return;

    const workspaceNumber = Number(workspaceId);
    socket.emit("joinWorkspace", workspaceNumber);

    const handleWorkspaceUpdate = (payload: any) => {
      if (payload.workspaceId !== workspaceNumber) return;
      if (payload.type === "filter") {
        setActiveFilter(payload.filter);
        return;
      }

      if (payload.widget) {
        setWidgets((current) =>
          current.map((widget) => (widget.id === payload.widget.id ? payload.widget : widget))
        );
      }
    };

    socket.on("workspaceUpdate", handleWorkspaceUpdate);

    return () => {
      socket.emit("leaveWorkspace", workspaceNumber);
      socket.off("workspaceUpdate", handleWorkspaceUpdate);
    };
  }, [workspaceId]);

  const handlePin = async (widget: Widget) => {
    if (!canEdit) return;

    try {
      const response = await updateWidget(widget.id, { pinned: !widget.pinned });
      setWidgets((current) => current.map((item) => (item.id === response.widget.id ? response.widget : item)));
      socket.emit("workspaceUpdate", {
        workspaceId: Number(workspaceId),
        widget: response.widget,
        type: "widget",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterApply = () => {
    setActiveFilter(filterDraft);
    socket.emit("workspaceUpdate", {
      workspaceId: Number(workspaceId),
      type: "filter",
      filter: filterDraft,
    });
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case "LINE":
        return <LineChartWidget config={widget.config} />;
      case "BAR":
        return <BarChartWidget config={widget.config} />;
      case "TABLE":
        return <DataTableWidget config={widget.config} />;
      case "KPI":
        return <KPIWidget config={widget.config} />;
      default:
        return <div>Unsupported widget type: {widget.type}</div>;
    }
  };

  const layouts = useMemo(
    () => ({
      lg: widgets.map((widget) => ({
        i: String(widget.id),
        x: widget.layout?.x ?? 0,
        y: widget.layout?.y ?? 0,
        w: widget.layout?.w ?? 4,
        h: widget.layout?.h ?? 6,
        minW: 3,
        minH: 4,
      })),
    }),
    [widgets]
  );

  const handleLayoutChange = (layout: Layout[]) => {
    setWidgets((current) =>
      current.map((widget) => {
        const item = layout.find((entry) => entry.i === String(widget.id));
        if (!item) return widget;

        return {
          ...widget,
          layout: {
            ...widget.layout,
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
          },
        };
      })
    );
  };

  const handleLayoutSave = async (layout: Layout[]) => {
    if (!canEdit) return;

    const updates = layout
      .map((entry) => {
        const widget = widgets.find((item) => String(item.id) === entry.i);
        if (!widget) return null;

        const nextLayout = {
          ...widget.layout,
          x: entry.x,
          y: entry.y,
          w: entry.w,
          h: entry.h,
        };

        const changed =
          widget.layout?.x !== nextLayout.x ||
          widget.layout?.y !== nextLayout.y ||
          widget.layout?.w !== nextLayout.w ||
          widget.layout?.h !== nextLayout.h;

        return changed ? { widget, layout: nextLayout } : null;
      })
      .filter(Boolean) as Array<{ widget: Widget; layout: any }>;

    if (!updates.length) return;

    try {
      setIsSavingLayout(true);
      const results = await Promise.all(
        updates.map(({ widget, layout: nextLayout }) => updateWidget(widget.id, { layout: nextLayout }))
      );

      setWidgets((current) =>
        current.map((item) => {
          const updated = results.find((result) => result.widget.id === item.id);
          return updated ? updated.widget : item;
        })
      );

      results.forEach((result) => {
        socket.emit("workspaceUpdate", {
          workspaceId: Number(workspaceId),
          widget: result.widget,
          type: "layout",
        });
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingLayout(false);
    }
  };

  const sortedWidgets = useMemo(
    () => [...widgets].sort((a, b) => Number(b.pinned) - Number(a.pinned)),
    [widgets]
  );

  if (isLoading) {
    return (
      <div className="page-shell">
        <div className="page-loading">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="app-content">
        <div className="dashboard-heading">
          <div>
            <Title level={2}>{data?.workspace?.name || "Workspace Dashboard"}</Title>
            <Space size="middle" wrap>
              <Tag color="blue">{role}</Tag>
              <Tag color={canEdit ? "green" : "default"}>{canEdit ? "Editable" : "Viewer"}</Tag>
            </Space>
          </div>

          <div className="dashboard-actions">
            <Button onClick={() => navigate("/workspaces")}>Back to Workspaces</Button>
            <Button type="primary" disabled={!canEdit}>
              Configure widgets
            </Button>
          </div>
        </div>

        <Card className="workspace-overview-card">
          <Row gutter={[20, 20]} align="middle">
            <Col xs={24} lg={16}>
              <div className="overview-summary">
                <Text strong>Live workspace analytics</Text>
                <p className="overview-subtitle">
                  This dashboard updates in real time for all users in the workspace. Admin and Analysts can rearrange widgets and pin the most important insights.
                </p>
              </div>
            </Col>
            <Col xs={24} lg={8}>
              <div className="overview-stats">
                <div className="overview-stat">
                  <span>Active widgets</span>
                  <strong>{sortedWidgets.length}</strong>
                </div>
                <div className="overview-stat">
                  <span>Current filter</span>
                  <strong>{activeFilter.metric.toUpperCase()}</strong>
                </div>
                <div className="overview-stat">
                  <span>Date window</span>
                  <strong>{activeFilter.range}</strong>
                </div>
              </div>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Text type="secondary">Metric</Text>
              <Select
                value={filterDraft.metric}
                onChange={(metric) => setFilterDraft((prev) => ({ ...prev, metric }))}
                options={[
                  { label: "Revenue", value: "revenue" },
                  { label: "Users", value: "users" },
                  { label: "Sessions", value: "sessions" },
                ]}
                style={{ width: "100%" }}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Text type="secondary">Date range</Text>
              <Select
                value={filterDraft.range}
                onChange={(range) => setFilterDraft((prev) => ({ ...prev, range }))}
                options={[
                  { label: "Last 24 hours", value: "24h" },
                  { label: "Last 7 days", value: "7d" },
                  { label: "Last 30 days", value: "30d" },
                ]}
                style={{ width: "100%" }}
              />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Text type="secondary">Sharing status</Text>
              <Space>
                <Button type="primary" onClick={handleFilterApply} disabled={!canEdit}>
                  Apply filter
                </Button>
                <Button type="default" disabled={!canEdit}>
                  Reset view
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <div className="dashboard-grid-shell">
          {sortedWidgets.length ? (
            <ResponsiveGridLayout
              className="dashboard-grid"
              layouts={layouts}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={44}
              margin={[20, 20]}
              isDraggable={canEdit}
              isResizable={canEdit}
              onLayoutChange={handleLayoutChange}
              onDragStop={handleLayoutSave}
              onResizeStop={handleLayoutSave}
              measureBeforeMount
              useCSSTransforms
              draggableHandle=".widget-card-header"
            >
              {sortedWidgets.map((widget) => (
                <div key={String(widget.id)} className="dashboard-widget">
                  <div className="widget-card-header">
                    <div>
                      <Text strong>{widget.title}</Text>
                      <div className="widget-meta">
                        <Tag color={widget.pinned ? "blue" : "default"}>{widget.pinned ? "Pinned" : "Live"}</Tag>
                        <Text type="secondary">{widget.type.toUpperCase()}</Text>
                      </div>
                    </div>
                    <Space size="small">
                      <Button size="small" disabled={!canEdit} onClick={() => handlePin(widget)}>
                        {widget.pinned ? "Unpin" : "Pin"}
                      </Button>
                      <Button size="small" type="text" disabled={!canEdit}>
                        Configure
                      </Button>
                    </Space>
                  </div>

                  <div className="widget-card-body">{renderWidget(widget)}</div>
                </div>
              ))}
            </ResponsiveGridLayout>
          ) : (
            <Card className="empty-state-card">
              <Empty
                description={
                  <span>
                    No widgets configured yet. If you have permission, add a widget in the workspace settings.
                  </span>
                }
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
