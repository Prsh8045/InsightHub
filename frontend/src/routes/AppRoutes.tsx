import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login/login";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Workspaces from "../pages/Workspaces/Workspaces";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/workspaces"
          element={
            <ProtectedRoute>
              <Workspaces />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/:workspaceId"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
