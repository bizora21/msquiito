import * as React from "react";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";
import { setSession } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

export default function RegisterClient() {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Cadastro de cliente criado!");
    setSession({ role: "client", name, phone, email });
    navigate("/dashboard/cliente");
  };

  return (
    <main className="pt-24 max-w-md mx-auto px-4">
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold">Criar conta de Cliente</h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-sm block mb-1">Nome completo</label>
            <input className="w-full border px-3 py-2 rounded-md" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm block mb-1">Telefone/WhatsApp</label>
            <input className="w-full border px-3 py-2 rounded-md" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm block mb-1">Email (opcional)</label>
            <input className="w-full border px-3 py-2 rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">Criar conta</Button>
        </form>
      </div>
    </main>
  );
}