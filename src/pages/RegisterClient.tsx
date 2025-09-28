import * as React from "react";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";
import { setSession } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import HomeButton from "@/components/HomeButton";
import { sendSignupNotifications } from "@/utils/notifications";

export default function RegisterClient() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [whatsapp, setWhatsapp] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [altPhone, setAltPhone] = React.useState("");
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // salva sessão do cliente
    setSession({ role: "client", name, email, phone: whatsapp, address, altPhone });
    showSuccess("Cadastro de cliente criado!");
    sendSignupNotifications({ name, email, whatsapp, address, altPhone });
    // direciona a produtos reais
    navigate("/produtos");
  };

  return (
    <main className="pt-24 max-w-xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent">
      <HomeButton />
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold">Criar conta de Cliente</h2>
        <p className="text-sm text-slate-600 mt-1">Finalize suas compras mais rápido e acompanhe seus pedidos.</p>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-sm block mb-1">Nome completo *</label>
            <input className="w-full border px-3 py-3 rounded-md" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm block mb-1">Email *</label>
            <input type="email" className="w-full border px-3 py-3 rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm block mb-1">Número do WhatsApp *</label>
            <input inputMode="tel" className="w-full border px-3 py-3 rounded-md" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required placeholder="Ex: 84xxxxxxx" />
          </div>
          <div>
            <label className="text-sm block mb-1">Endereço completo *</label>
            <input className="w-full border px-3 py-3 rounded-md" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Rua, bairro, cidade" />
          </div>
          <div>
            <label className="text-sm block mb-1">Telefone adicional</label>
            <input inputMode="tel" className="w-full border px-3 py-3 rounded-md" value={altPhone} onChange={(e) => setAltPhone(e.target.value)} placeholder="Opcional" />
          </div>
          <Button type="submit" className="w-full h-11 text-base">Criar conta</Button>
        </form>
      </div>
    </main>
  );
}