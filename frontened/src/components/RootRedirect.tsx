import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

export default function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}
