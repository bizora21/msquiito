"use client";

import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getSession, setSession, clearSession, parseRolesFromProfile, getDefaultRole } from "@/utils/auth";

type ProfileRow = {
  user_id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  role?: string | null;
  user_type?: string | null;
  store_name?: string | null;
  store_category?: string | null;
  professional_name?: string | null;
  professional_profession?: string | null;
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = React.useState(false);

  const syncFromSupabase = React.useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const sbSession = data.session;

      if (!sbSession) {
        clearSession();
        setIsInitialized(true);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      
      if (!uid) {
        clearSession();
        setIsInitialized(true);
        return;
      }

      // Buscar perfil
      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", uid)
        .maybeSingle<ProfileRow>();

      if (profErr) {
        console.error('Erro ao buscar perfil:', profErr);
        clearSession();
        setIsInitialized(true);
        return;
      }

      if (!prof) {
        // Sem perfil: redireciona para completar cadastro
        const registerPages = ['/cliente/register', '/vendedor/register', '/prestador/register', '/login'];
        if (!registerPages.includes(location.pathname)) {
          navigate("/cliente/register");
        }
        setIsInitialized(true);
        return;
      }

      // Parsear múltiplos roles
      const roles = parseRolesFromProfile(prof);
      const currentSession = getSession();
      
      // Determinar role ativo (manter o atual se válido, senão usar padrão)
      let activeRole = getDefaultRole(roles);
      if (currentSession && roles.includes(currentSession.activeRole)) {
        activeRole = currentSession.activeRole;
      }

      // Atualizar sessão local
      setSession({
        roles,
        activeRole,
        name: prof.full_name || undefined,
        email: prof.email || undefined,
        phone: prof.phone || undefined,
        address: prof.address || undefined,
      });

      setIsInitialized(true);

    } catch (error) {
      console.error('Erro na sincronização:', error);
      clearSession();
      setIsInitialized(true);
    }
  }, [location.pathname, navigate]);

  React.useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!mounted) return;
      await syncFromSupabase();
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      if (event === 'SIGNED_OUT') {
        clearSession();
        navigate('/');
      } else if (event === 'SIGNED_IN' && session) {
        await syncFromSupabase();
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [syncFromSupabase, navigate]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}