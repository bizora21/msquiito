"use client";

import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSession, type UserRole } from "@/utils/auth";
import { useSupabaseSession } from "@/integrations/supabase/useSupabaseSession";

export default function ProtectedRoute({ children, roles }: { children: React.ReactElement; roles?: UserRole[] }) {
  const location = useLocation();
  const { session, loading } = useSupabaseSession();
  const appSession = getSession();

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-sm text-slate-600" role="status" aria-live="polite">
        Carregando...
      </div>
    );
  }

  // Se não há sessão Supabase, pede login
  if (!session) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Se existe sessão Supabase mas não existe profile local, direciona ao cadastro
  if (session && !appSession) {
    return <Navigate to={`/cliente/register`} replace />;
  }

  // Se rota exige roles específicos, verificar se o usuário tem pelo menos um dos roles necessários
  if (roles && appSession) {
    const hasRequiredRole = roles.some(requiredRole => 
      appSession.roles.includes(requiredRole)
    );
    
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}