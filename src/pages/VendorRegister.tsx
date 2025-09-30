import * as React from "react";
import { showSuccess, showError } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import HomeButton from "@/components/HomeButton";
import { setSession } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function VendorRegister() {
  const [storeName, setStoreName] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");

  const [hasSbSession, setHasSbSession] = React.useState(false);
  const [sendingLink, setSendingLink] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "Cadastro de Vendedor — LojaRápida";
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
      const redirectTo = `${window.location.origin}/vendedor/register`;
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
    if (!storeName.trim()) {
      showError("Informe o nome da loja.");
      return;
    }
    if (!phone.trim()) {
      showError("Informe seu WhatsApp/telefone.");
      return;
    }
    if (!address.trim()) {
      showError("Informe o endereço da loja.");
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

    // Upsert profile como VENDEDOR
    const profilePayload = {
      user_id: uid,
      full_name: storeName,
      email,
      phone,
      address,
      role: "lojista",
      user_type: "vendor",
      store_name: storeName,
      store_category: category || null,
      store_description: description || null,
      updated_at: new Date().toISOString(),
    };

    const { error: profErr } = await supabase.from("profiles").upsert(profilePayload, { onConflict: "user_id" });
    if (profErr) {
      showError("Não foi possível salvar o perfil do vendedor.");
      return;
    }

    // Cria loja (1 por vendedor se não existir)
    const { data: existingStores } = await supabase
      .from("lojas")
      .select("id")
      .eq("user_id", uid)
      .limit(1);

    if (!existingStores || existingStores.length === 0) {
      const { error: lojaErr } = await supabase.from("lojas").insert({
        user_id: uid,
        nome: storeName,
        descricao: description || null,
        categoria: category || null,
        endereco: address || null,
        horario_funcionamento: null,
        taxa_entrega: 0,
      });
      if (lojaErr) {
        showError("Não foi possível criar a loja do vendedor.");
        return;
      }
    }

    // Cria sessão local do app coerente
    setSession({ role: "vendor", name: storeName, phone, email, address });
    showSuccess("Cadastro de vendedor concluído!");
    navigate("/dashboard/vendedor");
  };

  return (
    <main className="pt-24 max-w-2xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold">Cadastro de Vendedor</h2>
        <p className="text-sm text-slate-600 mt-2">Crie sua loja e comece a vender para clientes em toda a plataforma.</p>

        {!hasSbSession && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
            <div className="text-sm text-slate-700">Primeiro, crie sua conta com e-mail (enviamos um link de confirmação).</div>
            <div className="mt-2 flex gap-2">
              <input
                placeholder="voce@loja.com"
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
            <label className="text-sm block mb-1" htmlFor="store-name">Nome da Loja *</label>
            <input
              id="store-name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1" htmlFor="store-category">Categoria</label>
              <input
                id="store-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm block mb-1" htmlFor="vendor-phone">WhatsApp/Telefone *</label>
              <input
                id="vendor-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm block mb-1" htmlFor="vendor-email">E-mail *</label>
            <input
              id="vendor-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="text-sm block mb-1" htmlFor="store-address">Endereço *</label>
            <input
              id="store-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="text-sm block mb-1" htmlFor="store-desc">Descrição</label>
            <textarea
              id="store-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              rows={3}
            />
          </div>

          <Button type="submit" disabled={!hasSbSession}>Concluir cadastro</Button>
        </form>
      </div>
    </main>
  );
}