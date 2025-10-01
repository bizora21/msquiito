"use client";

import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getSession as getAppSession, setSession, clearSession } from "@/utils/auth";

type ProfileRow = {
  user_id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  role?: string | null;
  user_type?: string | null;
};

function mapRole(profile?: ProfileRow): "client" | "vendor" | "provider" | "admin" | null {
  const raw = (profile?.role || profile?.user_type || "").toLowerCase();
  
  const roleMap = {
    'client': ['cliente', 'client'],
    'vendor': ['vendor', 'lojista', 'vendedor'],
    'provider': ['provider', 'prestador'],
    'admin': ['admin']
  };

  for (const [role, matches] of Object.entries(roleMap)) {
    if (matches.some(match => raw.includes(match))) {
      return role as "client" | "vendor" | "provider" | "admin";
    }
  }

  return null;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const syncFromSupabase = React.useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const sbSession = data.session;

    if (!sbSession) {
      clearSession();
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) {
      clearSession();
      return;
    }

    const { data: prof, error: profErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", uid)
      .maybeSingle<ProfileRow>();

    if (profErr || !prof) {
      // Sem perfil: redireciona para completar cadastro
      if (!['/cliente/register', '/vendedor/register', '/prestador/register'].includes(location.pathname)) {
        navigate("/cliente/register");
      }
      return;
    }

    const role = mapRole(prof) ?? "client";

    // Atualiza sessão local
    setSession({
      role,
      name: prof.full_name || undefined,
      email: prof.email || undefined,
      phone: prof.phone || undefined,
      address: prof.address || undefined,
    });

    // Redireciona após login de acordo com o papel
    if (location.pathname === "/login") {
      switch(role) {
        case "vendor":
          navigate("/dashboard/vendedor");
          break;
        case "provider":
          navigate("/dashboard/prestador");
          break;
        case "admin":
          navigate("/dashboard/admin");
          break;
        default:
          navigate("/produtos");
      }
    }
  }, [location.pathname, navigate]);

  React.useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!mounted) return;
      await syncFromSupabase();
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async () => {
      if (!mounted) return;
      await syncFromSupabase();
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [syncFromSupabase]);

  return <>{children}</>;
}