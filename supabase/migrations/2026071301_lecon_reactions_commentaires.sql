-- ============================================================================
-- Réactions (❤️ 👍 😐 ❌) et commentaires publics sur les résumés de leçons
-- Idempotent, rejouable. À coller dans Supabase SQL Editor > New query.
-- ============================================================================

-- ---- Tables ----------------------------------------------------------------

-- Une réaction unique par (chapitre, utilisateur), modifiable à volonté.
create table if not exists public.lecon_reactions (
  chapitre_id uuid not null references public.chapitres(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  reaction    text not null check (reaction in ('love','up','meh','bad')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (chapitre_id, user_id)
);
create index if not exists idx_lecon_reactions_chapitre on public.lecon_reactions(chapitre_id);

-- Commentaires libres (max 1000 caractères).
create table if not exists public.lecon_commentaires (
  id          uuid primary key default gen_random_uuid(),
  chapitre_id uuid not null references public.chapitres(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  contenu     text not null check (char_length(btrim(contenu)) between 1 and 1000),
  created_at  timestamptz not null default now()
);
create index if not exists idx_lecon_commentaires_chapitre on public.lecon_commentaires(chapitre_id, created_at);

-- ---- Row Level Security ----------------------------------------------------

alter table public.lecon_reactions enable row level security;
alter table public.lecon_commentaires enable row level security;

-- Réactions : lecture publique (compteurs), écriture uniquement sur sa ligne.
drop policy if exists "lecon_reactions_select" on public.lecon_reactions;
create policy "lecon_reactions_select" on public.lecon_reactions for select using (true);
drop policy if exists "lecon_reactions_write_own" on public.lecon_reactions;
create policy "lecon_reactions_write_own" on public.lecon_reactions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Commentaires : lecture publique, création par l'auteur, suppression auteur ou admin.
drop policy if exists "lecon_commentaires_select" on public.lecon_commentaires;
create policy "lecon_commentaires_select" on public.lecon_commentaires for select using (true);
drop policy if exists "lecon_commentaires_insert_own" on public.lecon_commentaires;
create policy "lecon_commentaires_insert_own" on public.lecon_commentaires
  for insert with check (user_id = auth.uid());
drop policy if exists "lecon_commentaires_delete_own" on public.lecon_commentaires;
create policy "lecon_commentaires_delete_own" on public.lecon_commentaires
  for delete using (user_id = auth.uid() or public.is_admin());

grant select on public.lecon_reactions to anon, authenticated;
grant insert, update, delete on public.lecon_reactions to authenticated;
grant select on public.lecon_commentaires to anon, authenticated;
grant insert, delete on public.lecon_commentaires to authenticated;

-- ---- RPC -------------------------------------------------------------------

-- Compteurs agrégés + réaction de l'utilisateur courant (consultable par tous).
create or replace function public.get_lecon_reactions(p_chapitre_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'love',  count(*) filter (where reaction = 'love'),
    'up',    count(*) filter (where reaction = 'up'),
    'meh',   count(*) filter (where reaction = 'meh'),
    'bad',   count(*) filter (where reaction = 'bad'),
    'total', count(*),
    'ma_reaction', (
      select r.reaction from public.lecon_reactions r
      where r.chapitre_id = p_chapitre_id and r.user_id = auth.uid()
    )
  )
  from public.lecon_reactions
  where chapitre_id = p_chapitre_id;
$$;

-- Poser / modifier / retirer sa réaction. Renvoie les compteurs à jour.
-- p_reaction = null (ou identique à l'actuelle) => on retire la réaction.
create or replace function public.set_lecon_reaction(p_chapitre_id uuid, p_reaction text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_current text;
begin
  if v_uid is null then raise exception 'auth_required'; end if;
  if p_reaction is not null and p_reaction not in ('love','up','meh','bad') then
    raise exception 'reaction_invalide';
  end if;

  select reaction into v_current from public.lecon_reactions
  where chapitre_id = p_chapitre_id and user_id = v_uid;

  if p_reaction is null or p_reaction = v_current then
    delete from public.lecon_reactions where chapitre_id = p_chapitre_id and user_id = v_uid;
  else
    insert into public.lecon_reactions (chapitre_id, user_id, reaction)
    values (p_chapitre_id, v_uid, p_reaction)
    on conflict (chapitre_id, user_id) do update set reaction = excluded.reaction, updated_at = now();
  end if;

  return public.get_lecon_reactions(p_chapitre_id);
end;
$$;

grant execute on function public.get_lecon_reactions(uuid) to anon, authenticated;
grant execute on function public.set_lecon_reaction(uuid, text) to authenticated;
