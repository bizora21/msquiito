import * as React from "react";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";
import { setSession } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import HomeButton from "@/components/HomeButton";
import { sendSignupNotifications } from "@/utils/notifications";
import { supabase } from "@/integrations/supabase/client";

export default function RegisterClient() {
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirm, setConfirm] = React.useState<string>("");
  const [whatsapp, setWhatsapp] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [altPhone, setAltPhone] = React.useState<string>("");
  const [emailSent, setEmailSent] = React.useState(false);

  const [errors, setErrors] = React.useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "Criar conta de Cliente — LojaRápida";
  }, []);

  // Added validate function
  const validate = (): boolean => {
    const nextErrors: Partial<Record<string, string>> = {};
    if (!name?.trim()) nextErrors.name = "Nome é obrigatório";
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Email inválido";
    if (!password || password.length < 6) nextErrors.password = "Senha deve ter pelo menos 6 caracteres";
    if (confirm !== password) nextErrors.confirm = "As senhas não coincidem";
    if (!whatsapp?.trim()) nextErrors.whatsapp = "WhatsApp é obrigatório";
    if (!address?.trim()) nextErrors.address = "Endereço é obrigatório";
    
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/login',
          data: { 
            full_name: name,
            role: 'cliente',
            user_type: 'client'
          }
        }
      });

      if (error) {
        showError(error.message || "Erro ao criar conta");
        return;
      }

      // Rest of the existing signup logic...
      setSubmitting(false);
    } catch (err) {
      showError("Erro inesperado. Tente novamente.");
      setSubmitting(false);
    }
  };

  // Existing render logic...
  return (
    <main className="pt-24 max-w-2xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold">Criar Conta de Cliente</h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          {/* Form fields */}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Cadastrando..." : "Criar Conta"}
          </Button>
        </form>
      </div>
    </main>
  );
}