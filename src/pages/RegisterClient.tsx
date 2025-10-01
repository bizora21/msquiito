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

  const validate = () => {
    const errors: string[] = [];

    if (!name.trim()) errors.push("Nome completo é obrigatório");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) 
      errors.push("E-mail inválido");
    if (!password || password.length < 6) 
      errors.push("Senha deve ter pelo menos 6 caracteres");
    if (password !== confirm) 
      errors.push("As senhas não coincidem");
    if (!whatsapp.trim()) 
      errors.push("Número de WhatsApp é obrigatório");

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => showError(error));
      return;
    }

    setLoading(true);

    try {
      // Signup with Supabase
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            whatsapp,
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
          phone: whatsapp,
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
        phone: whatsapp
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
            <input 
              id="whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              placeholder="Número com DDD"
              required
            />
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