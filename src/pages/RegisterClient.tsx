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

  const [errors, setErrors] = React.useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "Criar conta de Cliente — LojaRápida";
  }, []);

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
    const { data: signData, error: signErr } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setSubmitting(false);

    if (signErr) {
      showError("Não foi possível criar sua conta. Verifique o e-mail.");
      return;
    }

    // Tenta obter sessão; se ainda não confirmada, pede para confirmar e-mail
    const { data: authData } = await supabase.auth.getSession();
    if (!authData.session) {
      showSuccess("Cadastro criado! Verifique seu e-mail para confirmar a conta e então faça login.");
      return;
    }

    // Já autenticado → grava/atualiza perfil
    const userId = signData.user?.id;
    if (!userId) {
      showError("Sessão inválida. Tente entrar novamente.");
      return;
    }

    const payload = {
      user_id: userId,
      full_name: name,
      email,
      phone: whatsapp,
      address,
      role: "cliente",
      user_type: "client",
      updated_at: new Date().toISOString(),
    };

    const { error: upsertErr } = await supabase.from("profiles").upsert(payload, { onConflict: "user_id" });
    if (upsertErr) {
      showError("Não foi possível salvar seu perfil.");
      return;
    }

    setSession({ role: "client", name, email, phone: whatsapp, address, altPhone });
    showSuccess("Cadastro concluído com sucesso!");
    sendSignupNotifications({ name, email, whatsapp, address, altPhone });

    const appSess = getAppSession();
    if (appSess?.role === "client") {
      navigate("/produtos");
    } else {
      navigate("/");
    }
  };

  return (
    <main className="pt-24 max-w-xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold">Criar conta de Cliente</h2>
        <p className="text-sm text-slate-600 mt-1">Crie sua conta com e-mail e senha.</p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3" noValidate>
          <div>
            <label className="text-sm block mb-1" htmlFor="client-name">Nome completo *</label>
            <input id="client-name" className="w-full border px-3 py-3 rounded-md" value={name} onChange={(e) => setName(e.target.value)} required aria-invalid={!!errors.name} />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm block mb-1" htmlFor="client-email">Email *</label>
            <input id="client-email" type="email" className="w-full border px-3 py-3 rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} required aria-invalid={!!errors.email} />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1" htmlFor="client-password">Senha *</label>
              <input id="client-password" type="password" className="w-full border px-3 py-3 rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} required aria-invalid={!!errors.password} />
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="text-sm block mb-1" htmlFor="client-confirm">Confirmar senha *</label>
              <input id="client-confirm" type="password" className="w-full border px-3 py-3 rounded-md" value={confirm} onChange={(e) => setConfirm(e.target.value)} required aria-invalid={!!errors.confirm} />
              {errors.confirm && <p className="text-xs text-red-600 mt-1">{errors.confirm}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm block mb-1" htmlFor="client-whatsapp">Número do WhatsApp *</label>
            <input id="client-whatsapp" inputMode="tel" className="w-full border px-3 py-3 rounded-md" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required aria-invalid={!!errors.whatsapp} />
            {errors.whatsapp && <p className="text-xs text-red-600 mt-1">{errors.whatsapp}</p>}
          </div>

          <div>
            <label className="text-sm block mb-1" htmlFor="client-address">Endereço completo *</label>
            <input id="client-address" className="w-full border px-3 py-3 rounded-md" value={address} onChange={(e) => setAddress(e.target.value)} required aria-invalid={!!errors.address} />
            {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="text-sm block mb-1" htmlFor="client-altphone">Telefone adicional</label>
            <input id="client-altphone" inputMode="tel" className="w-full border px-3 py-3 rounded-md" value={altPhone} onChange={(e) => setAltPhone(e.target.value)} />
          </div>

          <Button type="submit" className="w-full h-11 text-base" disabled={submitting}>
            {submitting ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>
      </div>
    </main>
  );
}