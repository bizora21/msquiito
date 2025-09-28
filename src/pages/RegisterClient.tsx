import * as React from "react";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";
import { setSession } from "@/utils/auth";
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
  const navigate = useNavigate();

  // Pré-preencher com dados do Supabase, se disponível
  React.useEffect(() => {
    let mounted = true;
    const fetchSbSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const sb = data?.session;
        if (sb && mounted) {
          const user = sb.user;
          const defaultName =
            user?.user_metadata?.full_name ||
            user?.user_metadata?.name ||
            (user?.email?.split("@")[0] ?? "");
          const defaultEmail = user?.email ?? "";
          if (!name) setName(defaultName);
          if (!email) setEmail(defaultEmail);
        }
      } catch {
        // ignore
      }
    };
    fetchSbSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async () => {
      if (!mounted) return;
      const { data } = await supabase.auth.getSession();
      const sb = data?.session;
      if (sb) {
        const user = sb.user;
        const nm =
          user?.user_metadata?.full_name ||
          user?.user_metadata?.name ||
          (user?.email?.split("@")[0] ?? "");
        const em = user?.email ?? "";
        if (!name) setName(nm);
        if (!email) setEmail(em);
      }
    });

    return () => {
      mounted = false;
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // salva perfil local (tipo/role); login real é via e-mail (Supabase)
    setSession({ role: "client", name, email, phone: whatsapp, address, altPhone });
    showSuccess("Cadastro de cliente criado!");
    sendSignupNotifications({ name, email, whatsapp, address, altPhone });
    navigate("/produtos");
  };

  return (
    <main className="pt-24 max-w-xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold">Criar conta de Cliente</h2>
        <p className="text-sm text-slate-600 mt-1">Finalize suas compras mais rápido e acompanhe seus pedidos.</p>
        <form onSubmit={onSubmit} className="mt-4 space-y-3" noValidate>
          <div>
            <label className="text-sm block mb-1" htmlFor="client-name">Nome completo *</label>
            <input
              id="client-name"
              aria-label="Nome completo"
              className="w-full border px-3 py-3 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" role="alert" className="text-xs text-red-600 mt-1">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm block mb-1" htmlFor="client-email">Email *</label>
            <input
              id="client-email"
              aria-label="Email"
              type="email"
              className="w-full border px-3 py-3 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="text-xs text-red-600 mt-1">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm block mb-1" htmlFor="client-whatsapp">Número do WhatsApp *</label>
            <input
              id="client-whatsapp"
              aria-label="Número do WhatsApp"
              inputMode="tel"
              className="w-full border px-3 py-3 rounded-md"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
              aria-invalid={!!errors.whatsapp}
              aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
            />
            {errors.whatsapp && (
              <p id="whatsapp-error" role="alert" className="text-xs text-red-600 mt-1">
                {errors.whatsapp}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm block mb-1" htmlFor="client-address">Endereço completo *</label>
            <input
              id="client-address"
              aria-label="Endereço completo"
              className="w-full border px-3 py-3 rounded-md"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? "address-error" : undefined}
            />
            {errors.address && (
              <p id="address-error" role="alert" className="text-xs text-red-600 mt-1">
                {errors.address}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm block mb-1" htmlFor="client-altphone">Telefone adicional</label>
            <input
              id="client-altphone"
              aria-label="Telefone adicional"
              inputMode="tel"
              className="w-full border px-3 py-3 rounded-md"
              value={altPhone}
              onChange={(e) => setAltPhone(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full h-11 text-base">Criar conta</Button>
        </form>
      </div>
    </main>
  );
}