import * as React from "react";
import { showSuccess, showError } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import HomeButton from "@/components/HomeButton";
import { setSession } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function ServiceProviderRegister() {
  const [companyName, setCompanyName] = React.useState<string>("");
  const [service, setService] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirm, setConfirm] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");

  const [submitting, setSubmitting] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "Cadastro de Prestador — LojaRápida";
  }, []);

  const validate = () => {
    if (!companyName.trim()) return "Informe o nome da empresa.";
    if (!service.trim()) return "Informe o serviço oferecido.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Informe um e-mail válido.";
    if (!password || password.length < 6) return "Senha deve ter pelo menos 6 caracteres.";
    if (password !== confirm) return "As senhas não coincidem.";
    if (!phone.trim()) return "Informe o telefone/WhatsApp.";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      showError(err);
      return;
    }

    setSubmitting(true);
    const { data: signData, error: signErr } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: companyName } },
    });
    setSubmitting(false);

    if (signErr) {
      showError("Não foi possível criar sua conta.");
      return;
    }

    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) {
      showSuccess("Conta criada! Verifique seu e-mail para confirmar e depois faça login para concluir o cadastro.");
      return;
    }

    const uid = signData.user?.id;
    if (!uid) {
      showError("Sessão inválida.");
      return;
    }

    const profilePayload = {
      user_id: uid,
      full_name: companyName,
      email,
      phone,
      role: "prestador",
      user_type: "provider",
      professional_name: companyName,
      professional_profession: service,
      updated_at: new Date().toISOString(),
    };

    const { error: profErr } = await supabase.from("profiles").upsert(profilePayload, { onConflict: "user_id" });
    if (profErr) {
      showError("Não foi possível salvar o perfil do prestador.");
      return;
    }

    setSession({ role: "provider", name: companyName, phone, email });
    showSuccess("Cadastro de prestador concluído!");
    navigate("/dashboard/prestador");
  };

  return (
    <main className="pt-24 max-w-2xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold">Cadastro de Prestador de Serviços</h2>
        <p className="text-sm text-slate-600 mt-2">Crie sua conta com e-mail e senha.</p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-sm block mb-1" htmlFor="provider-name">Nome da Empresa *</label>
            <input id="provider-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
          </div>
          <div>
            <label className="text-sm block mb-1" htmlFor="provider-service">Serviço oferecido *</label>
            <input id="provider-service" value={service} onChange={(e) => setService(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1" htmlFor="provider-email">E-mail *</label>
              <input id="provider-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
            </div>
            <div>
              <label className="text-sm block mb-1" htmlFor="provider-phone">Telefone/WhatsApp *</label>
              <input id="provider-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1" htmlFor="provider-password">Senha *</label>
              <input id="provider-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
            </div>
            <div>
              <label className="text-sm block mb-1" htmlFor="provider-confirm">Confirmar senha *</label>
              <input id="provider-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
            </div>
          </div>

          <Button type="submit" disabled={submitting}>{submitting ? "Salvando..." : "Concluir cadastro"}</Button>
        </form>
      </div>
    </main>
  );
}