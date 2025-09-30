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
  role?: string | null;       // pode vir 'cliente', 'lojista', 'vendor', etc
  user_type?: string | null;  // fallback
};

function mapRole(profile?: ProfileRow): "client" | "vendor" | "provider" | "admin" | null {
  const raw = (profile?.role || profile?.user_type || "").toLowerCase();
  if (["client", "cliente"].includes(raw)) return "client";
  if (["vendor", "lojista", "vendedor"].includes(raw)) return "vendor";
  if (["provider", "prestador"].includes(raw)) return "provider";
  if (raw === "admin") return "admin";
  return null;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const syncFromSupabase = React.useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const sbSession = data.session;

    // Sem sessão no Supabase: limpa sessão local e, se estiver em rota protegida, será tratado na ProtectedRoute.
    if (!sbSession) {
      clearSession();
      return;
    }

    // Existe sessão no Supabase: tentamos obter o perfil.
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

    if (profErr) {
      // Sem perfil por erro – não cria sessão local.
      return;
    }

    if (!prof) {
      // Sem perfil: se estiver em login ou home, leva para completar cadastro.
      if (location.pathname !== "/cliente/register") {
        navigate("/cliente/register", { replace: true });
      }
      return;
    }

    // Temos perfil → mapeia role e cria sessão local do app
    const role = mapRole(prof) ?? "client";
    const appSession = getAppSession();

    // Atualiza sessão local caso não exista ou mudou role/dados principais
    if (
      !appSession ||
      appSession.role !== role ||
      appSession.name !== (prof.full_name || undefined) ||
      appSession.email !== (prof.email || undefined) ||
      appSession.phone !== (prof.phone || undefined) ||
      appSession.address !== (prof.address || undefined)
    ) {
      setSession({
        role,
        name: prof.full_name || undefined,
        email: prof.email || undefined,
        phone: prof.phone || undefined,
        address: prof.address || undefined,
      });
    }

    // Se o usuário está na página de login, redireciona de acordo com o role
    if (location.pathname === "/login") {
      if (role === "vendor") navigate("/dashboard/vendedor", { replace: true });
      else if (role === "provider") navigate("/dashboard/prestador", { replace: true });
      else if (role === "admin") navigate("/dashboard/admin", { replace: true });
      else navigate("/produtos", { replace: true });
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