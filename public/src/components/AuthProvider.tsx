"use client";

import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { setSession, clearSession, parseRoleFromProfile } from "@/utils/auth";

type ProfileRow = {
  user_id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  role?: string | null;
  user_type?: string | null;
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

      if (profErr || !prof) {
        const registerPages = ['/cliente/register', '/vendedor/register', '/prestador/register', '/login'];
        if (!registerPages.includes(location.pathname)) {
          navigate("/cliente/register");
        }
        setIsInitialized(true);
        return;
      }

      // Determinar role
      const role = parseRoleFromProfile(prof);

      // Atualizar sessão local
      setSession({
        role,
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