import * as React from "react";
import { Button } from "@/components/ui/button";
import HomeButton from "@/components/HomeButton";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { showError, showSuccess } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [userType, setUserType] = React.useState<"client" | "vendor" | "provider">("client");
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

      // Validar se o tipo de usuário corresponde ao selecionado
      const roleMap = {
        'client': ['cliente', 'client'],
        'vendor': ['vendor', 'lojista', 'vendedor'],
        'provider': ['provider', 'prestador']
      };

      const isValidRole = roleMap[userType].some(r => 
        role?.toLowerCase().includes(r.toLowerCase())
      );

      if (!isValidRole) {
        showError(`Você está tentando entrar como ${userType}, mas seu perfil não corresponde.`);
        return;
      }

      showSuccess("Login realizado com sucesso.");

      // Redirecionar baseado no tipo de usuário
      switch(userType) {
        case 'vendor':
          navigate("/dashboard/vendedor");
          break;
        case 'provider':
          navigate("/dashboard/prestador");
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
          <div className="mb-4">
            <Label>Tipo de Usuário</Label>
            <RadioGroup 
              defaultValue={userType} 
              onValueChange={(value: "client" | "vendor" | "provider") => setUserType(value)}
              className="grid grid-cols-3 gap-2 mt-2"
            >
              <div>
                <RadioGroupItem value="client" id="client" className="peer sr-only" />
                <Label
                  htmlFor="client"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Cliente
                </Label>
              </div>
              <div>
                <RadioGroupItem value="vendor" id="vendor" className="peer sr-only" />
                <Label
                  htmlFor="vendor"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Vendedor
                </Label>
              </div>
              <div>
                <RadioGroupItem value="provider" id="provider" className="peer sr-only" />
                <Label
                  htmlFor="provider"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Prestador
                </Label>
              </div>
            </RadioGroup>
          </div>
          
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
            Não tem conta? 
            <Link to="/cliente/register" className="text-blue-600 hover:underline ml-1">
              Cadastre-se como Cliente
            </Link>
          </p>
          <div className="mt-2 text-sm">
            <Link to="/vendedor/register" className="text-green-600 hover:underline mr-2">
              Sou Vendedor
            </Link>
            <Link to="/prestador/register" className="text-purple-600 hover:underline">
              Sou Prestador de Serviços
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}