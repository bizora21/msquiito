import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession, clearSession, type UserRole } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { User, Store, Briefcase, Shield } from "lucide-react";

const roleIcons = {
  client: User,
  vendor: Store,
  provider: Briefcase,
  admin: Shield
};

const roleLabels = {
  client: "Cliente",
  vendor: "Vendedor", 
  provider: "Prestador",
  admin: "Admin"
};

const roleDashboards = {
  client: "/dashboard/cliente",
  vendor: "/dashboard/vendedor",
  provider: "/dashboard/prestador", 
  admin: "/dashboard/admin"
};

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

  const handleLogout = () => {
    clearSession();
    setSession(null);
    navigate("/");
  };

  const Icon = roleIcons[session.role];

  return (
    <div className="flex items-center gap-2">
      <Link to={roleDashboards[session.role]}>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Icon size={16} />
          {roleLabels[session.role]}
        </Button>
      </Link>

      <Button variant="ghost" size="sm" onClick={handleLogout}>
        Sair
      </Button>
    </div>
  );
}