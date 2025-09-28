import * as React from "react";
import { useEffect, useState } from "react";
import HomeButton from "@/components/HomeButton";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Link, useSearchParams } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";

export default function Login() {
  const [search] = useSearchParams();
  const [forgot, setForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    document.title = "Entrar — LojaRápida";
  }, []);

  // Redirect hint (para acessibilidade)
  const redirectHint = search.get("redirect")
    ? `Após entrar, você será redirecionado para: ${search.get("redirect")}`
    : null;

  const handlePasswordReset = async () => {
    if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      showError("Informe um e-mail válido para recuperação.");
      return;
    }
    try {
      // redirectTo opcional
      const redirectTo = typeof window !== "undefined" ? window.location.origin + "/login" : undefined;
      // Corrigido: usar a API correta no Supabase v2
      const { data, error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo,
      });
      // Em geral, a chamada retorna um objeto; erros são tratados pela API
      if (error) {
        showError("Falha ao solicitar recuperação. Tente novamente.");
      } else {
        showSuccess("Link de recuperação enviado por e-mail.");
        setForgot(false);
        setResetEmail("");
      }
    } catch {
      showError("Erro ao solicitar recuperação de senha.");
    }
  };

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

        {!forgot ? (
          <>
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
                  variables: { default: { colors: { brand: "#16a34a", brandAccent: "#22c55e" } } },
                }}
                theme="light"
              />
            </div>

            <div className="text-xs text-slate-500 mt-4 space-y-1" aria-label="Links de cadastro">
              <div>É novo por aqui? <Link to="/cliente/register" className="text-blue-600">Criar conta de Cliente</Link></div>
              <div>Vender no marketplace? <Link to="/vendedor/register" className="text-blue-600">Cadastro de Vendedor</Link></div>
              <div>Prestar serviços? <Link to="/prestador/register" className="text-blue-600">Cadastro de Prestador</Link></div>
            </div>

            <button className="mt-3 text-sm text-blue-600 hover:underline" onClick={() => setForgot(true)}>
              Esqueceu a senha?
            </button>
          </>
        ) : (
          <>
            <div className="mt-4" aria-label="Recuperação de senha">
              <label htmlFor="reset-email" className="block text-sm mb-1">Informe seu e-mail para recuperar senha</label>
              <input
                id="reset-email"
                aria-label="Email para recuperação de senha"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
              />
              <div className="flex items-center gap-2 mt-2">
                <button type="button" className="text-sm text-blue-600 hover:underline" onClick={() => setForgot(false)}>
                  Cancelar
                </button>
                <button type="button" className="px-3 py-2 bg-green-600 text-white rounded-md" onClick={handlePasswordReset}>
                  Enviar link de recuperação
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}