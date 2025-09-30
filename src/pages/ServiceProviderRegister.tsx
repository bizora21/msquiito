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
  const [phone, setPhone] = React.useState<string>("");

  const [hasSbSession, setHasSbSession] = React.useState(false);
  const [sendingLink, setSendingLink] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "Cadastro de Prestador — LojaRápida";
  }, []);

  // Pré-preencher com dados do Supabase
  React.useEffect(() => {
    let mounted = true;
    const sync = async () => {
      const { data } = await supabase.auth.getSession();
      const sb = data?.session;
      setHasSbSession(!!sb);
      if (sb && mounted) {
        const user = sb.user;
        const defaultEmail = user?.email ?? "";
        if (!email) setEmail(defaultEmail);
      }
    };
    sync();

    const { data: listener } = supabase.auth.onAuthStateChange(async () => {
      const { data } = await supabase.auth.getSession();
      const sb = data?.session;
      setHasSbSession(!!sb);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []); // eslint-disable-line

  const sendMagicLink = async () => {
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Informe um e-mail válido.");
      return;
    }
    setSendingLink(true);
    try {
      const redirectTo = `${window.location.origin}/prestador/register`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) showError("Não foi possível enviar o link. Tente novamente.");
      else showSuccess("Enviamos um link de confirmação para seu e-mail.");
    } finally {
      setSendingLink(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      showError("Informe o nome da empresa.");
      return;
    }
    if (!service.trim()) {
      showError("Informe o serviço oferecido.");
      return;
    }
    if (!phone.trim()) {
      showError("Informe o telefone/WhatsApp.");
      return;
    }

    const { data: sb } = await supabase.auth.getSession();
    if (!sb.session) {
      showError("Confirme o link de e-mail para continuar.");
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      showError("Sessão inválida.");
      return;
    }
    const uid = userData.user.id;

    // Upsert profile como PRESTADOR
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

    // Cria sessão local coerente
    setSession({ role: "provider", name: companyName, phone, email });
    showSuccess("Cadastro de prestador concluído!");
    navigate("/dashboard/prestador");
  };

  return (
    <main className="pt-24 max-w-2xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold">Cadastro de Prestador de Serviços</h2>
        <p className="text-sm text-slate-600 mt-2">Ofereça entregas, instalações ou suporte na sua área.</p>

        {!hasSbSession && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
            <div className="text-sm text-slate-700">Primeiro, crie sua conta com e-mail (enviamos um link de confirmação).</div>
            <div className="mt-2 flex gap-2">
              <input
                placeholder="voce@empresa.com"
                className="flex-1 border px-3 py-2 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={sendMagicLink} disabled={sendingLink}>
                {sendingLink ? "Enviando..." : "Criar conta"}
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-sm block mb-1" htmlFor="provider-name">Nome da Empresa *</label>
            <input
              id="provider-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="text-sm block mb-1" htmlFor="provider-service">Serviço oferecido *</label>
            <input
              id="provider-service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1" htmlFor="provider-phone">Telefone/WhatsApp *</label>
              <input
                id="provider-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
            </div>
            <div>
              <label className="text-sm block mb-1" htmlFor="provider-email">E-mail *</label>
              <input
                id="provider-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={!hasSbSession}>Concluir cadastro</Button>
        </form>
      </div>
    </main>
  );
}