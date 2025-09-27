export type UserRole = "client" | "vendor" | "provider";

export type Session = {
  role: UserRole;
  name?: string;
  phone?: string;
  email?: string;
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

export function isLoggedIn() {
  return !!getSession();
}