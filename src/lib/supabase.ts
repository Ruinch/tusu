declare const __TUSU_SUPABASE_URL__: string;
declare const __TUSU_SUPABASE_PUBLIC_KEY__: string;

const url = __TUSU_SUPABASE_URL__ || import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = __TUSU_SUPABASE_PUBLIC_KEY__ || import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const SESSION_KEY = 'tusu_supabase_session_v1';

export const isSupabaseConfigured = Boolean(url && anonKey);

async function request(path: string, init: RequestInit = {}) {
  if (!url || !anonKey) throw new Error('Supabase is not configured');
  const response = await fetch(`${url}${path}`, {
    ...init,
    headers: { apikey: anonKey, 'Content-Type': 'application/json', ...(init.headers || {}) }
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.msg || data?.message || 'Supabase request failed');
  return data;
}

export const supabaseAuth = {
  signUp: (email: string, password: string) => request('/auth/v1/signup', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signIn: (email: string, password: string) => request('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) })
};

export type SupabaseSession = { access_token: string; user: { id: string; email?: string } };
type StoredRoute = { profile: unknown; completed_task_ids: string[]; compared_uni_ids: string[] };

export function getStoredSession(): SupabaseSession | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}

export function storeSession(session: SupabaseSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function saveUserProfile(session: SupabaseSession, displayName: string) {
  return request('/rest/v1/profiles?on_conflict=id', {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}`, Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ id: session.user.id, display_name: displayName, onboarding_complete: true, updated_at: new Date().toISOString() })
  });
}

export async function saveUserRoute(session: SupabaseSession, profile: unknown, completedTaskIds: string[], comparedUniIds: string[]) {
  return request('/rest/v1/admission_routes?on_conflict=user_id,is_active', {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}`, Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ user_id: session.user.id, profile, completed_task_ids: completedTaskIds, compared_uni_ids: comparedUniIds, is_active: true, updated_at: new Date().toISOString() })
  });
}

export async function loadUserRoute(session: SupabaseSession): Promise<StoredRoute | null> {
  const query = `/rest/v1/admission_routes?user_id=eq.${encodeURIComponent(session.user.id)}&is_active=eq.true&select=profile,completed_task_ids,compared_uni_ids&order=updated_at.desc&limit=1`;
  const routes = await request(query, { headers: { Authorization: `Bearer ${session.access_token}` } }) as StoredRoute[];
  return routes[0] ?? null;
}
