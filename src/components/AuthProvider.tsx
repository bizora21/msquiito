"use client";

import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getSession as getAppSession, setSession } from "@/utils/auth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    let mounted = true;

    const handleAuthChange = async () => {
      const { data } = await supabase.auth.getSession();
      const sbSession = data.session;
      const appSession = getAppSession();

      // Quando houver sessão Supabase
      if (sbSession) {
        // Se não existe session local do app, criamos uma básica para desbloquear fluxo
        // e direcionamos o usuário a completar o cadastro (perfil) — evita "entrar aleatoriamente".
        if (!appSession) {
          const user = sbSession.user;
          // Preenchemos o mínimo: role client e email (se disponível)
          setSession({
            role: "client",
            name: (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || user.email || undefined,
            email: user.email || undefined,
            phone: undefined,
            address: undefined,
            altPhone: undefined,
          });

          // Se o usuário estava na página de login, levamos ao form de cadastro para completar dados
          if (location.pathname === "/login" || location.pathname === "/") {
            navigate("/cliente/register", { replace: true });
            return;
          }
        } else {
          // Se já existe session local, e estivermos na página de login, redirecionamos por role
          if (location.pathname === "/login") {
            const role = appSession.role;
            if (role === "vendor") navigate("/dashboard/vendedor", { replace: true });
            else if (role === "provider") navigate("/dashboard/prestador", { replace: true });
            else navigate("/produtos", { replace: true });
            return;
          }
        }
      } else {
        // Sem sessão Supabase: se estiver em rota protegida, manda para login
        if (location.pathname.startsWith("/dashboard") || location.pathname === "/checkout") {
          navigate("/login", { replace: true });
        }
      }
    };

    handleAuthChange();

    const { data: listener } = supabase.auth.onAuthStateChange(async () => {
      if (!mounted) return;
      handleAuthChange();
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [location.pathname, location.search, navigate]);

  return <>{children}</>;
}