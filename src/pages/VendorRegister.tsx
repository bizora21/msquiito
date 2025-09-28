import React from "react";
import { showSuccess } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import HomeButton from "@/components/HomeButton";
import { setSession } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

export default function VendorRegister() {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Notificação clara de confirmação de cadastro (email)
    showSuccess("Cadastro de vendedor recebido! Enviamos uma mensagem de confirmação ao seu e-mail.");
    // cria sessão e redireciona ao painel do vendedor
    setSession({ role: "vendor", name, phone, email });
    navigate("/dashboard/vendedor");
    // limpa formulário
    setName("");
    setPhone("");
    setEmail("");
  };

  return (
    <main className="pt-24 max-w-2xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent">
      <HomeButton />
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold">Cadastro de Vendedor</h2>
        <p className="text-sm text-slate-600 mt-2">Crie sua conta para começar a vender na LojaRápida.</p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-sm block mb-1">Nome da Loja</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
          </div>
          <div>
            <label className="text-sm block mb-1">Telefone/WhatsApp</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
          </div>
          <div>
            <label className="text-sm block mb-1">E-mail (para confirmação)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
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