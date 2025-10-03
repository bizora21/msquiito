export type UserRole = "client" | "vendor" | "provider" | "admin";

export type Session = {
  role: UserRole;
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

export function getRole(): UserRole | null {
  return getSession()?.role ?? null;
}

export function hasRole(role: UserRole): boolean {
  return getRole() === role;
}

export function isLoggedIn() {
  return !!getSession();
}

export function parseRoleFromProfile(profile: any): UserRole {
  const mainRole = (profile.role || profile.user_type || "").toLowerCase();
  
  if (mainRole.includes('vendor') || mainRole.includes('lojista')) return 'vendor';
  if (mainRole.includes('provider') || mainRole.includes('prestador')) return 'provider';
  if (mainRole.includes('admin')) return 'admin';
  
  return 'client';
}