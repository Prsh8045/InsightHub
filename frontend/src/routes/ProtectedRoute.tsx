import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "../components/Layout/MainLayout";

export default function ProtectedRoute({ children }: any) {
  const { isAuthenticated, status } = useSelector((state: any) => state.auth);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <MainLayout>{children}</MainLayout>;
}

