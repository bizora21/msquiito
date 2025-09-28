import * as React from "react";
import { showSuccess } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import HomeButton from "@/components/HomeButton";
import { setSession } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function ServiceProviderRegister() {
  const [name, setName] = React.useState<string>("");
  const [service, setService] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");

  const navigate = useNavigate();

  // Pré-preencher com dados do Supabase
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Notificação simples de confirmação
    showSuccess("Cadastro de Prestador recebido! Enviamos uma mensagem de confirmação ao seu e-mail.");
    // cria sessão e redireciona ao painel do prestador
    setSession({ role: "provider", name, phone, email });
    navigate("/dashboard/prestador");
    // limpa formulário
    setName("");
    setService("");
    setEmail("");
    setPhone("");
  };

  return (
    <main className="pt-24 max-w-2xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold">Cadastro de Prestador de Serviços</h2>
        <p className="text-sm text-slate-600 mt-2">Ofereça entregas, instalações ou suporte na sua área.</p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-sm block mb-1" htmlFor="provider-name">Nome da Empresa</label>
            <input
              id="provider-name"
              aria-label="Nome da Empresa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="text-sm block mb-1" htmlFor="provider-service">Serviço oferecido</label>
            <input
              id="provider-service"
              aria-label="Serviço oferecido"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="text-sm block mb-1" htmlFor="provider-phone">Telefone/WhatsApp</label>
            <input
              id="provider-phone"
              aria-label="Telefone/WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="text-sm block mb-1" htmlFor="provider-email">E-mail (para confirmação)</label>
            <input
              id="provider-email"
              aria-label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit">Enviar Cadastro</Button>
            <Button variant="outline" type="button" onClick={() => navigate("/servicos")}>Ajuda</Button>
          </div>
        </form>
      </div>
    </main>
  );
}