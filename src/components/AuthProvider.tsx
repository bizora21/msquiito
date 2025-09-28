"use client";

import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getSession as getAppSession } from "@/utils/auth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    let mounted = true;

    const handleAuthChange = async () => {
      const { data } = await supabase.auth.getSession();
      const sbSession = data.session;
      const appSession = getAppSession();

      // Redireciona após login
      if (sbSession) {
        // se veio com ?redirect= na URL de login
        const params = new URLSearchParams(location.search);
        const redirect = params.get("redirect");
        if (redirect && location.pathname === "/login") {
          navigate(redirect, { replace: true });
          return;
        }

        // Redireciona pela role do app (cliente, vendedor, prestador)
        const role = appSession?.role;
        if (location.pathname === "/login") {
          if (role === "vendor") navigate("/dashboard/vendedor", { replace: true });
          else if (role === "provider") navigate("/dashboard/prestador", { replace: true });
          else navigate("/produtos", { replace: true });
        }
      } else {
        // Deslogado
        if (
          location.pathname.startsWith("/dashboard") ||
          location.pathname === "/checkout"
        ) {
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