import * as React from "react";
import { useEffect } from "react";
import HomeButton from "@/components/HomeButton";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Link, useSearchParams } from "react-router-dom";

export default function Login() {
  const [search] = useSearchParams();

  useEffect(() => {
    document.title = "Entrar — LojaRápida";
  }, []);

  return (
    <main className="pt-24 max-w-md mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      <div className="bg-white border rounded-md p-6">
        <h1 className="text-xl font-semibold">Entrar</h1>
        <p className="text-sm text-slate-600 mt-1">
          Use seu e-mail para receber o link mágico de acesso.
        </p>

        <div className="mt-4">
          <Auth
            supabaseClient={supabase}
            providers={[]}
            view="magic_link"
            appearance={{
              theme: ThemeSupa,
              style: { container: { borderRadius: "8px" } },
              variables: {
                default: {
                  colors: { brand: "#16a34a", brandAccent: "#22c55e" },
                },
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Seu e-mail",
                  email_input_placeholder: "voce@email.com",
                },
              },
            }}
            theme="light"
          />
        </div>

        <div className="text-xs text-slate-500 mt-4 space-y-1">
          <div>
            É novo?{" "}
            <Link to="/cliente/register" className="text-blue-600">
              Criar conta de Cliente
            </Link>
          </div>
          <div>
            Quer vender?{" "}
            <Link to="/vendedor/register" className="text-blue-600">
              Cadastro de Vendedor
            </Link>
          </div>
          <div>
            Prestar serviços?{" "}
            <Link to="/prestador/register" className="text-blue-600">
              Cadastro de Prestador
            </Link>
          </div>
        </div>

        {search.get("redirect") && (
          <div className="mt-3 text-xs text-slate-500">
            Após entrar, você será levado a:{" "}
            <span className="font-medium">{search.get("redirect")}</span>
          </div>
        )}
      </div>
    </main>
  );
}