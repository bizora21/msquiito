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
  const [whatsapp, setWhatsapp] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [altPhone, setAltPhone] = React.useState<string>("");

  const [errors, setErrors] = React.useState<Partial<Record<string, string>>>({});
  const [hasSbSession, setHasSbSession] = React.useState(false);
  const [sendingLink, setSendingLink] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "Criar conta de Cliente — LojaRápida";
  }, []);

  // Pré-preencher com dados do Supabase, se disponível
  React.useEffect(() => {
    let mounted = true;
    const fetchSbSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sb = data?.session;
      setHasSbSession(!!sb);
      if (sb && mounted) {
        const user = sb.user;
        const defaultName =
          (user?.user_metadata as any)?.full_name ||
          (user?.user_metadata as any)?.name ||
          (user?.email?.split("@")[0] ?? "");
        const defaultEmail = user?.email ?? "";
        if (!name) setName(defaultName);
        if (!email) setEmail(defaultEmail);
      }
    };
    fetchSbSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async () => {
      const { data } = await supabase.auth.getSession();
      const sb = data?.session;
      setHasSbSession(!!sb);
      if (sb) {
        const user = sb.user;
        const nm =
          (user?.user_metadata as any)?.full_name ||
          (user?.user_metadata as any)?.name ||
          (user?.email?.split("@")[0] ?? "");
        const em = user?.email ?? "";
        if (!name) setName(nm);
        if (!email) setEmail(em);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []); // eslint-disable-line

  const validate = (): boolean => {
    const nextErrors: Partial<Record<string, string>> = {};
    if (!name?.trim()) nextErrors.name = "Nome é obrigatório";
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Email inválido";
    if (!whatsapp?.trim()) nextErrors.whatsapp = "WhatsApp é obrigatório";
    if (!address?.trim()) nextErrors.address = "Endereço é obrigatório";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const sendMagicLink = async () => {
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Informe um e-mail válido.");
      return;
    }
    setSendingLink(true);
    try {
      const redirectTo = `${window.location.origin}/cliente/register`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) {
        showError("Não foi possível enviar o link. Tente novamente.");
      } else {
        showSuccess("Enviamos um link de confirmação para seu e-mail.");
      }
    } finally {
      setSendingLink(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Garante sessão Supabase antes de gravar perfil
    const { data: authData } = await supabase.auth.getSession();
    if (!authData.session) {
      showError("Confirme o link enviado ao seu e-mail para continuar.");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      showError("Sessão inválida. Tente entrar novamente.");
      return;
    }

    // Salva/atualiza perfil no Supabase
    const payload = {
      user_id: userData.user.id,
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
      showError("Não foi possível salvar seu cadastro.");
      return;
    }

    // Cria sessão local coerente com o perfil (fonte: Supabase)
    setSession({ role: "client", name, email, phone: whatsapp, address, altPhone });
    showSuccess("Cadastro de cliente criado!");
    sendSignupNotifications({ name, email, whatsapp, address, altPhone });

    // Redireciona
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
        <p className="text-sm text-slate-600 mt-1">Finalize suas compras mais rápido e acompanhe seus pedidos.</p>

        {!hasSbSession && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
            <div className="text-sm text-slate-700">
              Primeiro, crie sua conta com seu e-mail. Enviaremos um link de confirmação.
            </div>
            <div className="mt-2 flex gap-2">
              <input
                placeholder="seu@email.com"
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

        <form onSubmit={onSubmit} className="mt-4 space-y-3" noValidate>
          <div>
            <label className="text-sm block mb-1" htmlFor="client-name">Nome completo *</label>
            <input
              id="client-name"
              className="w-full border px-3 py-3 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm block mb-1" htmlFor="client-email">Email *</label>
            <input
              id="client-email"
              type="email"
              className="w-full border px-3 py-3 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-sm block mb-1" htmlFor="client-whatsapp">Número do WhatsApp *</label>
            <input
              id="client-whatsapp"
              inputMode="tel"
              className="w-full border px-3 py-3 rounded-md"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
              aria-invalid={!!errors.whatsapp}
            />
            {errors.whatsapp && <p className="text-xs text-red-600 mt-1">{errors.whatsapp}</p>}
          </div>
          <div>
            <label className="text-sm block mb-1" htmlFor="client-address">Endereço completo *</label>
            <input
              id="client-address"
              className="w-full border px-3 py-3 rounded-md"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              aria-invalid={!!errors.address}
            />
            {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
          </div>
          <div>
            <label className="text-sm block mb-1" htmlFor="client-altphone">Telefone adicional</label>
            <input
              id="client-altphone"
              inputMode="tel"
              className="w-full border px-3 py-3 rounded-md"
              value={altPhone}
              onChange={(e) => setAltPhone(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full h-11 text-base" disabled={!hasSbSession}>
            {hasSbSession ? "Salvar cadastro" : "Crie sua conta para continuar"}
          </Button>
        </form>
      </div>
    </main>
  );
}