-- Run once in Supabase: SQL Editor -> New query.
-- Authentication is handled by Supabase Auth; every row belongs to auth.uid().
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admission_routes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile jsonb not null,
  completed_task_ids jsonb not null default '[]'::jsonb,
  compared_uni_ids jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolios (
  user_id uuid primary key references auth.users(id) on delete cascade,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create unique index if not exists admission_routes_one_active_per_user
  on public.admission_routes (user_id, is_active);

alter table public.profiles enable row level security;
alter table public.admission_routes enable row level security;
alter table public.portfolios enable row level security;

create policy "users manage own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "users manage own routes" on public.admission_routes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own portfolio" on public.portfolios for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
