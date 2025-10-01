import * as React from "react";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";
import { setSession } from "@/utils/auth";
import { useNavigate, Link } from "react-router-dom";
import HomeButton from "@/components/HomeButton";
import { supabase } from "@/integrations/supabase/client";

export default function RegisterClient() {
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirm, setConfirm] = React.useState<string>("");
  const [whatsapp, setWhatsapp] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "Criar Conta de Cliente — LojaRápida";
  }, []);

  // Função para formatar número de WhatsApp
  const formatWhatsAppNumber = (input: string) => {
    // Remove todos os caracteres não numéricos
    const cleanedNumber = input.replace(/\D/g, '');
    
    // Se já começar com 258, mantém
    if (cleanedNumber.startsWith('258')) {
      return `+${cleanedNumber}`;
    }
    
    // Se começar com 8 ou 9, adiciona 258
    if (cleanedNumber.startsWith('8') || cleanedNumber.startsWith('9')) {
      return `+258${cleanedNumber}`;
    }
    
    // Caso contrário, adiciona 258 e completa
    return `+258${cleanedNumber}`;
  };

  const validate = () => {
    const errors: string[] = [];

    if (!name.trim()) errors.push("Nome completo é obrigatório");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) 
      errors.push("E-mail inválido");
    if (!password || password.length < 6) 
      errors.push("Senha deve ter pelo menos 6 caracteres");
    if (password !== confirm) 
      errors.push("As senhas não coincidem");
    
    // Validação específica para número de WhatsApp de Moçambique
    const cleanedNumber = whatsapp.replace(/\D/g, '');
    if (!cleanedNumber || cleanedNumber.length < 9) 
      errors.push("Número de WhatsApp inválido");

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => showError(error));
      return;
    }

    // Formata o número de WhatsApp
    const formattedWhatsapp = formatWhatsAppNumber(whatsapp);

    setLoading(true);

    try {
      // Signup with Supabase
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            whatsapp: formattedWhatsapp,
            role: 'client',
            user_type: 'client'
          }
        }
      });

      if (signupError) {
        showError(signupError.message || "Erro ao criar conta");
        setLoading(false);
        return;
      }

      // Get the current session
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        showError("Não foi possível completar o cadastro");
        setLoading(false);
        return;
      }

      // Create or update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: name,
          email,
          phone: formattedWhatsapp,
          role: 'client',
          user_type: 'client',
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'user_id' 
        });

      if (profileError) {
        showError("Erro ao salvar perfil");
        setLoading(false);
        return;
      }

      // Set local session
      setSession({
        role: 'client',
        name,
        email,
        phone: formattedWhatsapp
      });

      showSuccess("Conta criada com sucesso!");
      
      // Redirect to client dashboard
      navigate('/dashboard/cliente');

    } catch (err) {
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
                placeholder="Número de WhatsApp"
                required
                maxLength={9}
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