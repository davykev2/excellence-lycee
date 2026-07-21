-- Excellence Lycée: identité, profils et progression sécurisés.
-- Cette migration est idempotente et peut être rejouée depuis le SQL Editor Supabase.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  account_type text not null default 'student'
    check (account_type in ('student', 'parent', 'teacher')),
  role text not null default 'student'
    check (role in ('student', 'teacher', 'content_editor', 'admin')),
  level_id text not null default 'seconde-c'
    check (level_id in (
      'seconde-a', 'seconde-c', 'premiere-a', 'premiere-c', 'premiere-d',
      'terminale-a', 'terminale-c', 'terminale-d'
    )),
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_rewards (
  path_id text not null,
  lesson_id text not null,
  xp_awarded integer not null check (xp_awarded between 0 and 1000),
  primary key (path_id, lesson_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  path_id text not null,
  lesson_id text not null,
  xp_awarded integer not null check (xp_awarded >= 0),
  completed_at timestamptz not null default now(),
  unique (user_id, path_id, lesson_id)
);

create index if not exists lesson_progress_user_idx
  on public.lesson_progress(user_id, completed_at);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  subject_id text,
  metadata_json jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_actor_idx
  on public.audit_logs(actor_user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  requested_type text;
  requested_level text;
begin
  requested_type := case
    when new.raw_user_meta_data ->> 'account_type' in ('student', 'parent', 'teacher')
      then new.raw_user_meta_data ->> 'account_type'
    else 'student'
  end;

  requested_level := case
    when new.raw_user_meta_data ->> 'level_id' in (
      'seconde-a', 'seconde-c', 'premiere-a', 'premiere-c', 'premiere-d',
      'terminale-a', 'terminale-c', 'terminale-d'
    ) then new.raw_user_meta_data ->> 'level_id'
    else 'seconde-c'
  end;

  insert into public.profiles (id, email, name, account_type, role, level_id)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), split_part(coalesce(new.email, 'Utilisateur'), '@', 1)),
    requested_type,
    case when requested_type = 'teacher' then 'teacher' else 'student' end,
    requested_level
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Rattrape les éventuels comptes créés avant l'installation de cette migration.
insert into public.profiles (id, email, name, account_type, role, level_id)
select
  id,
  coalesce(email, ''),
  coalesce(nullif(trim(raw_user_meta_data ->> 'name'), ''), split_part(coalesce(email, 'Utilisateur'), '@', 1)),
  case when raw_user_meta_data ->> 'account_type' in ('student', 'parent', 'teacher')
    then raw_user_meta_data ->> 'account_type' else 'student' end,
  case when raw_user_meta_data ->> 'account_type' = 'teacher' then 'teacher' else 'student' end,
  case when raw_user_meta_data ->> 'level_id' in (
    'seconde-a', 'seconde-c', 'premiere-a', 'premiere-c', 'premiere-d',
    'terminale-a', 'terminale-c', 'terminale-d'
  ) then raw_user_meta_data ->> 'level_id' else 'seconde-c' end
from auth.users
on conflict (id) do nothing;

insert into public.lesson_rewards (path_id, lesson_id, xp_awarded) values
  ('seconde-c-general-functions', 'function-machine', 30),
  ('seconde-c-general-functions', 'function-domain', 40),
  ('seconde-c-general-functions', 'images-antecedents', 40),
  ('seconde-c-general-functions', 'graph-reading', 50),
  ('seconde-c-general-functions', 'interval-images', 40),
  ('seconde-c-general-functions', 'variations-extrema', 50),
  ('seconde-c-general-functions', 'functions-challenge', 80)
on conflict (path_id, lesson_id) do update
  set xp_awarded = excluded.xp_awarded;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.complete_lesson(p_path_id text, p_lesson_id text)
returns table(created boolean, xp_awarded integer)
language plpgsql
security definer set search_path = ''
as $$
declare
  current_user_id uuid;
  reward integer;
  inserted_count integer;
begin
  current_user_id := auth.uid();
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select r.xp_awarded into reward
  from public.lesson_rewards r
  where r.path_id = p_path_id and r.lesson_id = p_lesson_id;

  if reward is null then
    raise exception 'Leçon introuvable dans le programme publié.' using errcode = 'P0002';
  end if;

  insert into public.lesson_progress (user_id, path_id, lesson_id, xp_awarded)
  values (current_user_id, p_path_id, p_lesson_id, reward)
  on conflict (user_id, path_id, lesson_id) do nothing;

  get diagnostics inserted_count = row_count;
  return query select inserted_count = 1, reward;
end;
$$;

alter table public.profiles enable row level security;
alter table public.lesson_rewards enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.audit_logs enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.lesson_rewards from anon, authenticated;
revoke all on table public.lesson_progress from anon, authenticated;
revoke all on table public.audit_logs from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (name, photo_url, updated_at) on table public.profiles to authenticated;
grant select on table public.lesson_progress to authenticated;
grant insert on table public.audit_logs to authenticated;
grant select on table public.audit_logs to authenticated;

revoke all on function public.complete_lesson(text, text) from public, anon;
grant execute on function public.complete_lesson(text, text) to authenticated;
revoke all on function public.is_platform_admin() from public, anon;
grant execute on function public.is_platform_admin() to authenticated;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id or (select public.is_platform_admin()));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "progress_select_own_or_admin" on public.lesson_progress;
create policy "progress_select_own_or_admin"
  on public.lesson_progress for select to authenticated
  using ((select auth.uid()) = user_id or (select public.is_platform_admin()));

drop policy if exists "audit_insert_own" on public.audit_logs;
create policy "audit_insert_own"
  on public.audit_logs for insert to authenticated
  with check ((select auth.uid()) = actor_user_id);

drop policy if exists "audit_select_admin" on public.audit_logs;
create policy "audit_select_admin"
  on public.audit_logs for select to authenticated
  using ((select public.is_platform_admin()));
