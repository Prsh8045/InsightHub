import { Card, Button, Spin, Typography, Row, Col, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "../../services/workspaceService";

type WorkspacesResponse = {
  workspaces: Array<{
    id: number;
    name: string;
    role: string;
  }>;
};

const { Title, Text } = Typography;

export default function Workspaces() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery<WorkspacesResponse>({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });

  const workspaces = data?.workspaces || [];

  if (isLoading) {
    return (
      <div className="page-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="workspaces-shell">
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Your Workspaces</Title>
        <Text type="secondary">Select a workspace to open a shared real-time dashboard with role-based controls.</Text>
      </div>

      {workspaces.length ? (
        <Row gutter={[20, 20]} className="workspace-grid">
          {workspaces.map((workspace) => (
            <Col key={workspace.id} xs={24} sm={12} lg={8}>
              <Card className="workspace-card" bordered={false}>
                <div style={{ marginBottom: 16 }}>
                  <Title level={4}>{workspace.name}</Title>
                  <Text type="secondary">Role: {workspace.role}</Text>
                </div>
                <div className="workspace-actions">
                  <Button type="primary" onClick={() => navigate(`/dashboard/${workspace.id}`)} block>
                    Open Workspace
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="empty-state-card" bordered={false}>
          <Empty description="No workspaces available. Please contact your admin to join or create a workspace." />
        </Card>
      )}
    </div>
  );
}
