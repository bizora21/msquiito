export type UserRole = "client" | "vendor" | "provider" | "admin";

export type Session = {
  roles: UserRole[];  // Mudança: agora é array de roles
  activeRole: UserRole;  // Role ativo no momento
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
};

const KEY = "lr_session";

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

export function getActiveRole(): UserRole | null {
  return getSession()?.activeRole ?? null;
}

export function getAllRoles(): UserRole[] {
  return getSession()?.roles ?? [];
}

export function hasRole(role: UserRole): boolean {
  const roles = getAllRoles();
  return roles.includes(role);
}

export function switchRole(newRole: UserRole): boolean {
  const session = getSession();
  if (!session || !session.roles.includes(newRole)) {
    return false;
  }
  
  setSession({
    ...session,
    activeRole: newRole
  });
  return true;
}

export function isLoggedIn() {
  return !!getSession();
}

// Função para mapear roles do perfil do Supabase
export function parseRolesFromProfile(profile: any): UserRole[] {
  const roles: UserRole[] = [];
  
  // Verificar role principal
  const mainRole = (profile.role || profile.user_type || "").toLowerCase();
  
  // Verificar se é cliente (padrão para todos)
  if (!mainRole.includes('admin')) {
    roles.push('client');
  }
  
  // Verificar se é vendedor
  if (mainRole.includes('vendor') || mainRole.includes('lojista') || mainRole.includes('vendedor') || 
      profile.store_name || profile.store_category) {
    roles.push('vendor');
  }
  
  // Verificar se é prestador
  if (mainRole.includes('provider') || mainRole.includes('prestador') || 
      profile.professional_name || profile.professional_profession) {
    roles.push('provider');
  }
  
  // Verificar se é admin
  if (mainRole.includes('admin')) {
    roles.push('admin');
  }
  
  return roles.length > 0 ? roles : ['client'];
}

// Função para determinar role padrão baseado nos roles disponíveis
export function getDefaultRole(roles: UserRole[]): UserRole {
  // Prioridade: admin > vendor > provider > client
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('vendor')) return 'vendor';
  if (roles.includes('provider')) return 'provider';
  return 'client';
}