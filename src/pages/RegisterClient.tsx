import * as React from "react";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";
import { setSession, getSession as getAppSession } from "@/utils/auth";
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

  const onSubmit = async (e: React.FormEvent) => { // Corrected function name
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    
    try {
      // Configuração explícita de confirmação de e-mail
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

      // Rest of the existing code remains the same...
    } catch (err) {
      showError("Erro inesperado. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // Rest of the existing code remains the same...
}