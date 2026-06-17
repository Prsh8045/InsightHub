import { useState } from "react";
import { Card, Input, Button, Typography, Form, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { setUser } from "../../features/auth/authSlice";

const { Title, Text } = Typography;

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsSubmitting(true);
    try {
      const response = await loginUser(values);
      dispatch(setUser(response.user));
      navigate("/workspaces");
    } catch (error) {
      console.error(error);
      message.error("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-shell">
      <Card className="login-card" bordered={false}>
        <div style={{ marginBottom: 24 }}>
          <Title level={3}>InsightHub</Title>
          <Text type="secondary">Collaborative analytics dashboards with workspace-level access controls.</Text>
        </div>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email." }]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password." }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isSubmitting}>
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
