import * as React from "react";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";
import { setSession } from "@/utils/auth";
import { useNavigate, Link } from "react-router-dom";
import HomeButton from "@/components/HomeButton";
import { supabase } from "@/integrations/supabase/client";

export default function RegisterClient() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [whatsapp, setWhatsapp] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "Criar Conta de Cliente — LojaRápida";
  }, []);

  const formatWhatsAppNumber = (input: string) => {
    const cleanedNumber = input.replace(/\D/g, '');
    
    if (cleanedNumber.startsWith('258')) {
      return `+${cleanedNumber}`;
    }
    
    if (cleanedNumber.startsWith('8') || cleanedNumber.startsWith('9')) {
      return `+258${cleanedNumber}`;
    }
    
    return `+258${cleanedNumber}`;
  };

  const validate = () => {
    if (!name.trim()) {
      showError("Nome completo é obrigatório");
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("E-mail inválido");
      return false;
    }
    if (!password || password.length < 6) {
      showError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }
    if (password !== confirm) {
      showError("As senhas não coincidem");
      return false;
    }
    
    const cleanedNumber = whatsapp.replace(/\D/g, '');
    if (!cleanedNumber || cleanedNumber.length < 9) {
      showError("Número de WhatsApp inválido");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const formattedWhatsapp = formatWhatsAppNumber(whatsapp);
    setLoading(true);

    try {
      // 1. Criar conta no Supabase Auth
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            whatsapp: formattedWhatsapp,
          }
        }
      });

      if (signupError) {
        if (signupError.message.includes('already registered')) {
          showError("Este e-mail já está cadastrado. Tente fazer login.");
        } else {
          showError("Erro ao criar conta: " + signupError.message);
        }
        return;
      }

      if (!signupData.user) {
        showError("Erro ao criar usuário");
        return;
      }

      // 2. Verificar se precisa confirmar e-mail
      if (!signupData.session) {
        showSuccess("Conta criada! Verifique seu e-mail para confirmar e depois faça login.");
        navigate("/login");
        return;
      }

      // 3. Criar perfil na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: signupData.user.id,
          full_name: name,
          email,
          phone: formattedWhatsapp,
          role: 'client',
          user_type: 'client',
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        showError("Erro ao criar perfil: " + profileError.message);
        return;
      }

      // 4. Definir sessão local
      setSession({
        role: 'client',
        name,
        email,
        phone: formattedWhatsapp
      });

      showSuccess("Conta criada com sucesso!");
      navigate('/dashboard/cliente');

    } catch (err) {
      console.error('Erro no cadastro:', err);
      showError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 max-w-2xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold">Criar Conta de Cliente</h2>
        <p className="text-sm text-slate-600 mt-2">Junte-se à LojaRápida e comece a comprar</p>
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-sm block mb-1" htmlFor="name">Nome Completo *</label>
            <input 
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm block mb-1" htmlFor="email">E-mail *</label>
            <input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm block mb-1" htmlFor="whatsapp">WhatsApp *</label>
            <div className="flex items-center">
              <span className="border px-3 py-2 rounded-l-md bg-gray-100 text-gray-600">+258</span>
              <input 
                id="whatsapp"
                type="tel"
                value={whatsapp.replace(/^(\+258)?/, '')}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full border border-l-0 px-3 py-2 rounded-r-md"
                placeholder="Digite os 9 dígitos"
                required
                maxLength={9}
                disabled={loading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Digite apenas os 9 dígitos do número</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1" htmlFor="password">Senha *</label>
              <input 
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                minLength={6}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-sm block mb-1" htmlFor="confirm">Confirmar Senha *</label>
              <input 
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                minLength={6}
                required
                disabled={loading}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Já tem conta? 
          <Link 
            to="/login" 
            className="text-blue-600 hover:underline ml-1"
          >
            Faça login
          </Link>
        </div>
      </div>
    </main>
  );
}