import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession, clearSession, switchRole, type UserRole } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User, Store, Briefcase, Shield } from "lucide-react";

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

  const handleRoleSwitch = (newRole: UserRole) => {
    if (switchRole(newRole)) {
      setSession(getSession()); // Atualizar estado local
      navigate(roleDashboards[newRole]);
    }
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    navigate("/");
  };

  const ActiveIcon = roleIcons[session.activeRole];

  return (
    <div className="flex items-center gap-2">
      {/* Menu de Roles (se tiver múltiplos) */}
      {session.roles.length > 1 ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ActiveIcon size={16} />
              {roleLabels[session.activeRole]}
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Alternar Perfil</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {session.roles.map((role) => {
              const Icon = roleIcons[role];
              return (
                <DropdownMenuItem 
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className={session.activeRole === role ? "bg-gray-100" : ""}
                >
                  <Icon size={16} className="mr-2" />
                  {roleLabels[role]}
                  {session.activeRole === role && " (Ativo)"}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to={roleDashboards[session.activeRole]}>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ActiveIcon size={16} />
            {roleLabels[session.activeRole]}
          </Button>
        </Link>
      )}

      {/* Dashboard Link */}
      <Link to={roleDashboards[session.activeRole]} className="text-sm text-slate-700 hover:text-slate-900 hidden sm:inline">
        Dashboard
      </Link>

      {/* Logout */}
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        Sair
      </Button>
    </div>
  );
}