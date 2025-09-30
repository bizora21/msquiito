import * as React from "react";
import HomeButton from "@/components/HomeButton";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { showError, showSuccess } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [forgot, setForgot] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState("");

  React.useEffect(() => {
    document.title = "Entrar — LojaRápida";
  }, []);

  const redirectHint = search.get("redirect")
    ? `Após entrar, você será redirecionado para: ${search.get("redirect")}`
    : null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showError("Informe e-mail e senha.");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      showError("Credenciais inválidas ou conta não confirmada.");
      return;
    }
    showSuccess("Login realizado com sucesso.");
    // Após login, o AuthProvider sincroniza sessão local e redireciona se você estiver em /login.
    // Caso haja um redirect na URL, vamos para lá.
    const redirect = search.get("redirect");
    if (redirect) {
      navigate(redirect, { replace: true });
    } else {
      // Direciona para a loja por padrão; o AuthProvider poderá redirecionar por role
      navigate("/produtos", { replace: true });
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      showError("Informe um e-mail válido para recuperação.");
      return;
    }
    const redirectTo = typeof window !== "undefined" ? window.location.origin + "/login" : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, { redirectTo });
    if (error) {
      showError("Falha ao solicitar recuperação. Tente novamente.");
    } else {
      showSuccess("Link de recuperação enviado por e-mail.");
      setForgot(false);
      setResetEmail("");
    }
  };

  return (
    <main className="pt-24 max-w-md mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      <div className="bg-white border rounded-md p-6" role="main" aria-label="Área de login">
        <h1 className="text-xl font-semibold">Entrar</h1>
        <p className="text-sm text-slate-600 mt-1">Acesse sua conta com e-mail e senha.</p>

        {redirectHint && (
          <div role="status" aria-live="polite" className="mt-3 text-sm text-slate-600">
            {redirectHint}
          </div>
        )}

        {!forgot ? (
          <>
            <form onSubmit={handleLogin} className="mt-4 space-y-3">
              <div>
                <label htmlFor="login-email" className="block text-sm mb-1">E-mail</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-sm mb-1">Senha</label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md py-2"
              >
                {submitting ? "Entrando..." : "Entrar"}
              </button>
            </form>

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
              <label htmlFor="reset-email" className="block text-sm mb-1">E-mail para recuperar senha</label>
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