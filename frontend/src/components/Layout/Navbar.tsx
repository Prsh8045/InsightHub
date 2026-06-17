import { Button, Space, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/authSlice";
import { logout } from "../../services/authService";

const { Text } = Typography;

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <header className="app-navbar">
      <div className="navbar-brand">
        <h2>InsightHub</h2>
        <Text type="secondary">Real-time workspace analytics</Text>
      </div>

      <Space size="middle" className="navbar-actions">
        {user ? (
          <Text type="secondary">
            Signed in as {user.name || user.email} ({user.role})
          </Text>
        ) : null}
        <Button type="default" onClick={() => navigate("/workspaces")}>Workspaces</Button>
        <Button danger onClick={handleLogout}>Logout</Button>
      </Space>
    </header>
  );
}

