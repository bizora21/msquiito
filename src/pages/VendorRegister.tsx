import React from "react";
import { showSuccess } from "@/utils/toast";
import { Button } from "@/components/ui/button";

export default function VendorRegister() {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app we'd submit to an API and require approval
    showSuccess("Cadastro recebido! Verificaremos e ativaremos sua conta em breve.");
    setName("");
    setPhone("");
  };

  return (
    <main className="pt-24 max-w-2xl mx-auto px-4">
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

          <div className="flex items-center gap-3">
            <Button type="submit">Enviar Cadastro</Button>
            <Button variant="outline">Ajuda</Button>
          </div>
        </form>
      </div>
    </main>
  );
}