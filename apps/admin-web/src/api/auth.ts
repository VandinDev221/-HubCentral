const TOKEN_KEY = 'hub_central_token';
const USER_KEY = 'hub_central_user';

export function getApiBase() {
  return (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
}

export function assertApiConfigured() {
  if (import.meta.env.PROD && !getApiBase()) {
    throw new Error('VITE_API_URL não configurada na Vercel. Defina a URL da API (Render) e faça redeploy.');
  }
}

export async function authPost<T>(path: string, body: unknown): Promise<T> {
  assertApiConfigured();
  const res = await fetch(`${getApiBase()}/v1/auth${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Erro na autenticação');
  }
  return res.json();
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

export function saveSession(session: AuthSession) {
  localStorage.setItem(TOKEN_KEY, session.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function loadStoredSession(): { token: string | null; user: AuthUser | null } {
  const token = localStorage.getItem(TOKEN_KEY);
  const raw = localStorage.getItem(USER_KEY);
  return { token, user: raw ? JSON.parse(raw) : null };
}
