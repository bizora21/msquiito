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

  // Extra: exibir um aviso simples de redirect esperado (acessível)
  const redirectHint = search.get("redirect")
    ? `Após entrar, você será redirecionado para: ${search.get("redirect")}`
    : null;

  return (
    <main className="pt-24 max-w-md mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      <div className="bg-white border rounded-md p-6" role="main" aria-label="Área de login">
        <h1 className="text-xl font-semibold">Entrar</h1>
        <p className="text-sm text-slate-600 mt-1">
          Acesse com seu e-mail. Enviaremos um link seguro de login (confirmação por e-mail).
        </p>

        {redirectHint && (
          <div role="status" aria-live="polite" className="mt-3 text-sm text-slate-600">
            {redirectHint}
          </div>
        )}

        <div className="mt-4" aria-label="Componente de autenticação">
          <Auth
            supabaseClient={supabase}
            providers={[]}
            localization={{
              variables: {
                sign_in: { email_label: "Seu e-mail", email_input_placeholder: "voce@email.com" },
              },
            }}
            view="magic_link"
            appearance={{
              theme: ThemeSupa,
              style: { container: { borderRadius: "8px" } },
              // mantenha as cores consistentes com o tema do app
              variables: { default: { colors: { brand: "#16a34a", brandAccent: "#22c55e" } } },
            }}
            // Mantém o fluxo de login com suporte a redirecionamento via AuthProvider
            theme="light"
          />
        </div>

        <div className="text-xs text-slate-500 mt-4 space-y-1" aria-label="Links de cadastro">
          <div>É novo por aqui? <Link to="/cliente/register" className="text-blue-600">Criar conta de Cliente</Link></div>
          <div>Vender no marketplace? <Link to="/vendedor/register" className="text-blue-600">Cadastro de Vendedor</Link></div>
          <div>Prestar serviços? <Link to="/prestador/register" className="text-blue-600">Cadastro de Prestador</Link></div>
        </div>
      </div>
    </main>
  );
}