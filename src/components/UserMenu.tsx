import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession, clearSession, getRole } from "@/utils/auth";
import { Button } from "@/components/ui/button";

export default function UserMenu() {
  const [session, setSession] = React.useState(getSession());
  const navigate = useNavigate();

  React.useEffect(() => {
    const id = setInterval(() => setSession(getSession()), 500);
    return () => clearInterval(id);
  }, []);

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button variant="outline" size="sm">Entrar</Button>
        </Link>
        <Link to="/cliente/register">
          <Button size="sm">Cadastre-se</Button>
        </Link>
      </div>
    );
  }

  const role = getRole();

  return (
    <div className="flex items-center gap-2">
      {role === "client" && (
        <Link to="/dashboard/cliente" className="text-sm text-slate-700 hover:text-slate-900">Minha Conta</Link>
      )}
      {role === "vendor" && (
        <Link to="/dashboard/vendedor" className="text-sm text-slate-700 hover:text-slate-900">Dashboard Vendedor</Link>
      )}
      {role === "provider" && (
        <Link to="/dashboard/prestador" className="text-sm text-slate-700 hover:text-slate-900">Dashboard Prestador</Link>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          clearSession();
          setSession(null);
          navigate("/");
        }}
      >
        Sair
      </Button>
    </div>
  );
}