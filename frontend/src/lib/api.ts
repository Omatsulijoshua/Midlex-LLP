function resolveApiUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();

  // If in browser on local network/localhost, prioritize local NestJS server running on port 3001
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
      return `${window.location.protocol}//${hostname}:3001`;
    }
  }

  if (fromEnv && !fromEnv.includes("run.app")) {
    return fromEnv.replace(/\/+$/, "");
  }

  return "https://midlex-backend.onrender.com";
}

export function getApiBaseUrl() {
  return resolveApiUrl();
}

export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const API_URL = resolveApiUrl();
  const token = typeof window !== 'undefined' ? localStorage.getItem('midlex_token') : null;
  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers);

  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Network error. Can't reach API at ${API_URL} (calling ${endpoint}). ${message ? `(${message}) ` : ""}Set NEXT_PUBLIC_API_URL if needed.`,
    );
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    let message = 'API request failed';
    if (typeof data === 'object' && data) {
      message = 'message' in data ? String(data.message) : 'error' in data ? String(data.error) : message;
    } else if (data) {
      message = data;
    }

    if (typeof window !== 'undefined') {
      console.error(`[apiFetch Error ${response.status}] ${API_URL}${endpoint}: ${message}`);
      if (response.status === 401) {
        localStorage.removeItem('midlex_token');
        localStorage.removeItem('midlex_user');
      }
    }

    throw new Error(message);
  }

  return data as T;
}
