import * as React from "react";
import { showSuccess, showError } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import HomeButton from "@/components/HomeButton";
import { setSession } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Categorias pré-definidas para lojas
const STORE_CATEGORIES = [
  "Alimentação",
  "Moda e Vestuário",
  "Eletrônicos",
  "Móveis e Decoração",
  "Beleza e Cosméticos",
  "Artesanato",
  "Serviços",
  "Tecnologia",
  "Papelaria",
  "Automotivo",
  "Saúde e Bem-estar",
  "Esportes",
  "Brinquedos",
  "Livraria",
  "Outro"
];

export default function VendorRegister() {
  const [storeName, setStoreName] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirm, setConfirm] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");

  const [submitting, setSubmitting] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "Cadastro de Vendedor — LojaRápida";
  }, []);

  const validate = () => {
    if (!storeName.trim()) return "Informe o nome da loja.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Informe um e-mail válido.";
    if (!password || password.length < 6) return "Senha deve ter pelo menos 6 caracteres.";
    if (password !== confirm) return "As senhas não coincidem.";
    if (!phone.trim()) return "Informe seu WhatsApp/telefone.";
    if (!address.trim()) return "Informe o endereço da loja.";
    if (!category) return "Selecione uma categoria para sua loja.";
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
      options: { data: { full_name: storeName } },
    });
    setSubmitting(false);

    if (signErr) {
      showError("Não foi possível criar sua conta de vendedor.");
      return;
    }

    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) {
      showSuccess("Conta criada! Verifique seu e-mail para confirmar e depois faça login para concluir o cadastro da loja.");
      return;
    }

    const uid = signData.user?.id;
    if (!uid) {
      showError("Sessão inválida.");
      return;
    }

    const profilePayload = {
      user_id: uid,
      full_name: storeName,
      email,
      phone,
      address,
      role: "lojista",
      user_type: "vendor",
      store_name: storeName,
      store_category: category,
      store_description: description || null,
      updated_at: new Date().toISOString(),
    };

    const { error: profErr } = await supabase.from("profiles").upsert(profilePayload, { onConflict: "user_id" });
    if (profErr) {
      showError("Não foi possível salvar o perfil do vendedor.");
      return;
    }

    // Cria loja (uma por vendedor, se não existir)
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
        categoria: category,
        endereco: address || null,
        horario_funcionamento: null,
        taxa_entrega: 0,
      });
      if (lojaErr) {
        showError("Não foi possível criar a loja do vendedor.");
        return;
      }
    }

    setSession({ role: "vendor", name: storeName, phone, email, address });
    showSuccess("Cadastro de vendedor concluído!");
    navigate("/dashboard/vendedor");
  };

  return (
    <main className="pt-24 max-w-2xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold">Cadastro de Vendedor</h2>
        <p className="text-sm text-slate-600 mt-2">Crie sua conta e sua loja para começar a vender.</p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-sm block mb-1" htmlFor="store-name">Nome da Loja *</label>
            <input id="store-name" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1" htmlFor="vendor-email">E-mail *</label>
              <input id="vendor-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
            </div>
            <div>
              <label className="text-sm block mb-1" htmlFor="vendor-phone">WhatsApp/Telefone *</label>
              <input id="vendor-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1" htmlFor="vendor-password">Senha *</label>
              <input id="vendor-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
            </div>
            <div>
              <label className="text-sm block mb-1" htmlFor="vendor-confirm">Confirmar senha *</label>
              <input id="vendor-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1" htmlFor="store-category">Categoria da Loja *</label>
              <select 
                id="store-category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full border px-3 py-2 rounded-md"
                required
              >
                <option value="">Selecione uma categoria</option>
                {STORE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm block mb-1" htmlFor="store-address">Endereço *</label>
              <input id="store-address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
            </div>
          </div>

          <div>
            <label className="text-sm block mb-1" htmlFor="store-desc">Descrição</label>
            <textarea id="store-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded-md" rows={3} />
          </div>

          <Button type="submit" disabled={submitting}>{submitting ? "Salvando..." : "Concluir cadastro"}</Button>
        </form>
      </div>
    </main>
  );
}