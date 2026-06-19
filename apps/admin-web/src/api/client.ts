const getToken = () => localStorage.getItem('hub_central_token');

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

function assertApiConfigured() {
  if (import.meta.env.PROD && !API_BASE) {
    throw new Error('VITE_API_URL não configurada na Vercel. Defina a URL da API (Render) e faça redeploy.');
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  assertApiConfigured();
  const token = getToken();
  const url = path.startsWith('http') ? path : `${API_BASE}/v1${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || String(err));
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const apiGet = <T>(path: string) => api<T>(path, { method: 'GET' });
export const apiPost = <T>(path: string, body: unknown) =>
  api<T>(path, { method: 'POST', body: JSON.stringify(body) });
export const apiPatch = <T>(path: string, body: unknown) =>
  api<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
export const apiDelete = (path: string) => api<void>(path, { method: 'DELETE' });
