-- Crédits d'or exceptionnels, indépendants de l'XP.
--
-- Le portefeuille reste fondé sur l'XP (50 XP = 1 or), mais un administrateur
-- peut désormais accorder un crédit de test ou de récompense sans fausser le
-- classement. Les élèves ne disposent d'aucun droit d'écriture sur ce journal.

create table if not exists public.store_gold_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null check (amount > 0),
  reason text not null default 'Crédit administrateur',
  reference text unique,
  created_at timestamptz not null default now()
);

create index if not exists store_gold_grants_user_idx
  on public.store_gold_grants(user_id, created_at desc);

alter table public.store_gold_grants enable row level security;

revoke all on table public.store_gold_grants from anon, authenticated;
grant select on table public.store_gold_grants to authenticated;

drop policy if exists "store_gold_grants_select_own_or_admin"
  on public.store_gold_grants;
create policy "store_gold_grants_select_own_or_admin"
  on public.store_gold_grants for select to authenticated
  using ((select auth.uid()) = user_id or (select public.is_platform_admin()));

create or replace function public.get_store_wallet()
returns table(
  gold_balance integer,
  gold_spent integer,
  total_xp integer,
  owned_item_ids text[]
)
language plpgsql
security definer set search_path = ''
as $$
declare
  current_user_id uuid;
  v_total_xp integer;
  v_spent integer;
  v_granted integer;
begin
  current_user_id := auth.uid();
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select coalesce(sum(lp.xp_awarded), 0) into v_total_xp
  from public.lesson_progress as lp
  where lp.user_id = current_user_id;

  select coalesce(sum(sp.price_paid), 0) into v_spent
  from public.store_purchases as sp
  where sp.user_id = current_user_id;

  select coalesce(sum(sgg.amount), 0) into v_granted
  from public.store_gold_grants as sgg
  where sgg.user_id = current_user_id;

  return query
  select
    (v_total_xp / 50) + v_granted - v_spent,
    v_spent,
    v_total_xp,
    coalesce(
      (
        select array_agg(sp.item_id)
        from public.store_purchases as sp
        where sp.user_id = current_user_id
      ),
      array[]::text[]
    );
end;
$$;

create or replace function public.purchase_store_item(p_item_id text)
returns table(gold_balance integer, item_id text)
language plpgsql
security definer set search_path = ''
as $$
declare
  current_user_id uuid;
  v_price integer;
  v_total_xp integer;
  v_spent integer;
  v_granted integer;
  v_balance integer;
begin
  current_user_id := auth.uid();
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select si.price into v_price
  from public.store_items as si
  where si.id = p_item_id and si.active;
  if v_price is null then
    raise exception 'Article introuvable dans la boutique.' using errcode = 'P0002';
  end if;

  if exists (
    select 1
    from public.store_purchases as sp
    where sp.user_id = current_user_id and sp.item_id = p_item_id
  ) then
    raise exception 'Tu possèdes déjà cet article.' using errcode = 'P0001';
  end if;

  select coalesce(sum(lp.xp_awarded), 0) into v_total_xp
  from public.lesson_progress as lp
  where lp.user_id = current_user_id;

  select coalesce(sum(sp.price_paid), 0) into v_spent
  from public.store_purchases as sp
  where sp.user_id = current_user_id;

  select coalesce(sum(sgg.amount), 0) into v_granted
  from public.store_gold_grants as sgg
  where sgg.user_id = current_user_id;

  v_balance := (v_total_xp / 50) + v_granted - v_spent;
  if v_balance < v_price then
    raise exception 'Solde d''or insuffisant.' using errcode = 'P0001';
  end if;

  insert into public.store_purchases (user_id, item_id, price_paid)
  values (current_user_id, p_item_id, v_price);

  return query select (v_balance - v_price), p_item_id;
end;
$$;

revoke all on function public.get_store_wallet() from public, anon;
grant execute on function public.get_store_wallet() to authenticated;
revoke all on function public.purchase_store_item(text) from public, anon;
grant execute on function public.purchase_store_item(text) to authenticated;

-- Crédit de test demandé par le propriétaire du projet. La référence rend
-- l'opération idempotente si la migration est rejouée.
insert into public.store_gold_grants (user_id, amount, reason, reference)
select
  au.id,
  10000,
  'Crédit de test boutique — 27 juillet 2026',
  'test-credit-strober373-20260727'
from auth.users as au
where lower(au.email) = 'strober373@gmail.com'
on conflict (reference) do nothing;
