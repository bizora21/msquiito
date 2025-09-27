import React from "react";
import { showSuccess } from "@/utils/toast";
import { Button } from "@/components/ui/button";

export default function ServiceProviderRegister() {
  const [name, setName] = React.useState("");
  const [service, setService] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Cadastro de prestador recebido! Revisaremos e entraremos em contacto.");
    setName("");
    setService("");
  };

  return (
    <main className="pt-24 max-w-2xl mx-auto px-4">
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold">Cadastro de Prestador de Serviços</h2>
        <p className="text-sm text-slate-600 mt-2">Ofereça entregas, instalações ou suporte na sua área.</p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-sm block mb-1">Nome / Empresa</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
          </div>
          <div>
            <label className="text-sm block mb-1">Serviço oferecido</label>
            <input value={service} onChange={(e) => setService(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
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