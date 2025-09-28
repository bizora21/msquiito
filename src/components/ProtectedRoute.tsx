import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSession as getAppSession, type UserRole } from "@/utils/auth";
import { useSupabaseSession } from "@/integrations/supabase/useSupabaseSession";

export default function ProtectedRoute({ children, roles }: { children: React.ReactElement; roles?: UserRole[] }) {
  const location = useLocation();
  const { session, loading } = useSupabaseSession();
  const appSession = getAppSession();

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-sm text-slate-600">
        Carregando...
      </div>
    );
  }

  if (!session) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (roles && (!appSession || !roles.includes(appSession.role))) {
    return <Navigate to="/" replace />;
  }

  return children;
}