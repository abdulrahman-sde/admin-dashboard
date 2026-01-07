import { useAuth } from "../../hooks/useAuth";
import { Outlet, useLocation, Navigate } from "react-router";
import { Loader2 } from "lucide-react";

export default function AuthInitializer() {
  const { isCheckingAuth, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-gray-500 font-medium font-inter">
            Securing Environment...
          </p>
        </div>
      </div>
    );
  }

  const isAuthPath = location.pathname.startsWith("/dashboard");
  const isRoot = location.pathname === "/";
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  if (isAuthenticated) {
    if (isRoot || isLogin || isRegister) {
      return <Navigate to="/dashboard" replace />;
    }
  } else {
    if (isAuthPath || isRoot) {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
}
