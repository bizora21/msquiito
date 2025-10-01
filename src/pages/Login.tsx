import * as React from "react";
import { Button } from "@/components/ui/button";
import HomeButton from "@/components/HomeButton";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { showError, showSuccess } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { setSession } from "@/utils/auth";

export default function Login() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    document.title = "Login — LojaRápida";
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showError("Informe e-mail e senha.");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Login no Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (authError) {
        showError("E-mail ou senha incorretos.");
        return;
      }

      if (!authData.user) {
        showError("Erro na autenticação.");
        return;
      }

      // Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (profileError || !profileData) {
        showError("Perfil não encontrado. Complete seu cadastro.");
        navigate("/cliente/register");
        return;
      }

      // Mapear role
      const role = profileData.user_type || profileData.role || 'client';
      let mappedRole: "client" | "vendor" | "provider" | "admin" = 'client';
      
      if (role.includes('vendor') || role.includes('lojista')) {
        mappedRole = 'vendor';
      } else if (role.includes('provider') || role.includes('prestador')) {
        mappedRole = 'provider';
      } else if (role.includes('admin')) {
        mappedRole = 'admin';
      }

      // Definir sessão local
      setSession({
        role: mappedRole,
        name: profileData.full_name || undefined,
        email: profileData.email || undefined,
        phone: profileData.phone || undefined,
        address: profileData.address || undefined,
      });

      showSuccess("Login realizado com sucesso!");

      // Redirecionar baseado no tipo de usuário
      const redirectTo = search.get('redirect');
      if (redirectTo) {
        navigate(redirectTo);
      } else {
        switch(mappedRole) {
          case 'vendor':
            navigate("/dashboard/vendedor");
            break;
          case 'provider':
            navigate("/dashboard/prestador");
            break;
          case 'admin':
            navigate("/dashboard/admin");
            break;
          default:
            navigate("/dashboard/cliente");
        }
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
        <h2 className="text-xl font-semibold">Entrar na sua conta</h2>
        <p className="text-sm text-slate-600 mt-2">Acesse sua conta LojaRápida</p>
        
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
              disabled={submitting}
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
              disabled={submitting}
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 mb-4">
            Não tem conta ainda?
          </p>
          <div className="space-y-2">
            <Link to="/cliente/register" className="block">
              <Button variant="outline" className="w-full">
                Cadastrar como Cliente
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/vendedor/register">
                <Button variant="outline" size="sm" className="w-full">
                  Sou Vendedor
                </Button>
              </Link>
              <Link to="/prestador/register">
                <Button variant="outline" size="sm" className="w-full">
                  Sou Prestador
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}