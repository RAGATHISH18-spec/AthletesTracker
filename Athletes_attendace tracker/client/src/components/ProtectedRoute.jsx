import { Navigate, Outlet } from "react-router-dom";
import { roleHome, useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-100">Loading tracker...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={roleHome[user.role] || "/profile"} replace />;
  }

  return children || <Outlet />;
}
