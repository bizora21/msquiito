import * as React from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { setSession, type UserRole } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";

export default function Login() {
  const [role, setRole] = React.useState<UserRole>("client");
  const [phone, setPhone] = React.useState("");
  const [name, setName] = React.useState("");
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const redirect = search.get("redirect");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSession({ role, phone, name });
    showSuccess("Login efetuado!");
    if (redirect) {
      navigate(redirect);
      return;
    }
    if (role === "client") navigate("/dashboard/cliente");
    if (role === "vendor") navigate("/dashboard/vendedor");
    if (role === "provider") navigate("/dashboard/prestador");
  };

  return (
    <main className="pt-24 max-w-md mx-auto px-4">
      <div className="bg-white border rounded-md p-6">
        <h1 className="text-xl font-semibold">Entrar</h1>
        <p className="text-sm text-slate-600 mt-1">Use seu telefone ou WhatsApp para entrar.</p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-sm block mb-1">Nome</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
          </div>
          <div>
            <label className="text-sm block mb-1">Telefone/WhatsApp</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border px-3 py-2 rounded-md" required />
          </div>
          <div>
            <label className="text-sm block mb-1">Entrar como</label>
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full border px-3 py-2 rounded-md">
              <option value="client">Cliente</option>
              <option value="vendor">Vendedor</option>
              <option value="provider">Prestador de Serviço</option>
            </select>
          </div>

          <Button type="submit" className="w-full">Entrar</Button>
        </form>

        <div className="text-xs text-slate-500 mt-4">
          Não tem conta? <Link to="/cliente/register" className="text-blue-600">Cadastre-se</Link>
        </div>
      </div>
    </main>
  );
}