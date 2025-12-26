import React from "react";
import { Navigate, useLocation } from "react-router";

type Props = { children: React.ReactNode };

const isAuthenticated = () => {
  return true;
};
export default function ProtectedRoute({ children }: Props) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
