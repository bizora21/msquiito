import * as React from "react";
import { Button } from "@/components/ui/button"; // Added missing import
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showError("Informe e-mail e senha.");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        showError("Credenciais inválidas ou conta não confirmada.");
        return;
      }

      // Buscar perfil do usuário para determinar o tipo
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, user_type')
        .eq('user_id', data.user?.id)
        .single();

      if (profileError) {
        showError("Erro ao carregar perfil do usuário.");
        return;
      }

      // Identificar tipo de usuário
      const role = profileData?.role || profileData?.user_type;

      showSuccess("Login realizado com sucesso.");

      // Redirecionar baseado no tipo de usuário
      switch(role) {
        case 'vendor':
        case 'lojista':
          navigate("/dashboard/vendedor");
          break;
        case 'provider':
          navigate("/dashboard/prestador");
          break;
        case 'admin':
          navigate("/dashboard/admin");
          break;
        default:
          navigate("/produtos");
      }

    } catch (err) {
      showError("Erro inesperado. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-24 max-w-2xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold">Login</h2>
        <form onSubmit={handleLogin} className="mt-4 space-y-3">
          <div>
            <label className="text-sm block mb-1" htmlFor="login-email">E-mail</label>
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
            <label className="text-sm block mb-1" htmlFor="login-password">Senha</label>
            <input 
              id="login-password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full border px-3 py-2 rounded-md" 
              required 
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm">
            Não tem conta? <Link to="/cliente/register" className="text-blue-600 hover:underline">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </main>
  );
}