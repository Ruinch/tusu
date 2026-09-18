import React, { useEffect, useState } from 'react';
import { ArrowRight, LockKeyhole, Sparkles } from 'lucide-react';
import { getStoredSession, isSupabaseConfigured } from '../../lib/supabase';

const ACCOUNT_KEY = 'tusu_account_v1';

function hasAuthenticatedAccount() {
  if (isSupabaseConfigured) return Boolean(getStoredSession()?.access_token);
  return Boolean(localStorage.getItem(ACCOUNT_KEY));
}

/** Blocks the planner until the visitor creates an account or signs in. */
export const AuthGate: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthenticatedAccount);

  useEffect(() => {
    const refresh = () => setIsAuthenticated(hasAuthenticatedAccount());
    window.addEventListener('tusu-auth-changed', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('tusu-auth-changed', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  if (isAuthenticated) return null;

  return (
    <div className="punch-auth-overlay fixed inset-0 z-[70] grid place-items-center overflow-y-auto p-4 anim-fade-in">
      <section className="punch-auth-card w-full max-w-3xl overflow-hidden border border-zinc-700 bg-zinc-950 anim-scale-in">
        <div className="relative border-b border-zinc-800 px-8 py-9 sm:px-14 sm:py-12">
          <div className="punch-auth-rail left-5" />
          <div className="punch-auth-rail right-5" />
          <div className="relative flex h-11 w-11 items-center justify-center bg-emerald-400 text-zinc-950">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="relative mt-6 text-xs font-mono uppercase tracking-[0.18em] text-emerald-400">// AUTH_SESSION_REQUIRED</div>
          <h1 className="relative mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Сначала сохраним твой путь</h1>
          <p className="relative mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">Регистрация нужна, чтобы профиль, выбранные университеты и roadmap были доступны после возвращения в сервис.</p>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
          <button onClick={() => window.dispatchEvent(new Event('open-account-hub'))} className="punch-auth-action group bg-zinc-100 p-5 text-left text-zinc-950 transition hover:bg-white">
            <span className="text-sm font-bold">Создать аккаунт</span>
            <span className="mt-2 block text-xs leading-relaxed text-zinc-600">Для нового пользователя: имя, email и пароль.</span>
            <ArrowRight className="mt-5 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button onClick={() => window.dispatchEvent(new Event('open-login-hub'))} className="punch-auth-action group border border-zinc-700 bg-zinc-900/50 p-5 text-left transition hover:border-emerald-700 hover:bg-zinc-900">
            <span className="flex items-center gap-2 text-sm font-bold text-white"><LockKeyhole className="h-4 w-4 text-emerald-400" />Войти</span>
            <span className="mt-2 block text-xs leading-relaxed text-zinc-400">Уже есть аккаунт? Продолжи с сохранённым маршрутом.</span>
            <ArrowRight className="mt-5 h-4 w-4 text-emerald-400 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </div>
  );
};
