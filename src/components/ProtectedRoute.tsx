import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSession, type UserRole } from "@/utils/auth";

export default function ProtectedRoute({ children, roles }: { children: React.ReactElement; roles?: UserRole[] }) {
  const session = getSession();
  const location = useLocation();

  if (!session) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (roles && !roles.includes(session.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}