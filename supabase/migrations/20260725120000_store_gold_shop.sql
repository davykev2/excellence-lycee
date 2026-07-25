-- Boutique « or » : les élèves dépensent une monnaie virtuelle (l'or) gagnée
-- comme reflet de l'XP. Taux : 50 XP = 1 or.
--
-- Solde = floor(total_xp / 50) − or dépensé. Le classement continue d'utiliser
-- l'XP à vie ; il n'est donc jamais affecté par les achats.
--
-- Les prix ci-dessous doivent rester synchronisés avec deux autres sources :
--   apps/api/src/storeCatalog.ts (validation + seed SQLite de repli)
--   apps/web/src/data/storeCatalog.ts (catalogue d'affichage du frontend).
--
-- Les écritures passent exclusivement par le RPC security-definer
-- public.purchase_store_item, sur le modèle de public.complete_lesson : les
-- élèves n'ont aucun droit d'INSERT direct sur store_purchases.

-- 1. Catalogue des articles (registre de prix côté serveur).
create table if not exists public.store_items (
  id text primary key,
  category text not null check (category in ('frame', 'theme', 'badge', 'title')),
  title text not null,
  price integer not null check (price >= 0),
  active boolean not null default true,
  sort_order integer not null default 0
);

insert into public.store_items (id, category, title, price, sort_order) values
  ('frame-gold', 'frame', 'Cadre Or', 60, 0),
  ('frame-neon', 'frame', 'Cadre Néon', 60, 1),
  ('frame-laurel', 'frame', 'Cadre Laurier', 60, 2),
  ('theme-ocean', 'theme', 'Thème Océan', 150, 3),
  ('theme-sunset', 'theme', 'Thème Coucher de soleil', 150, 4),
  ('theme-forest', 'theme', 'Thème Forêt', 150, 5),
  ('badge-studious', 'badge', 'Badge Studieux', 40, 6),
  ('badge-perfectionist', 'badge', 'Badge Perfectionniste', 40, 7),
  ('badge-streak', 'badge', 'Badge Assidu', 40, 8),
  ('title-rigorous', 'title', 'Le/La Rigoureux·se', 80, 9),
  ('title-bac-ace', 'title', 'As du BAC', 80, 10),
  ('title-scholar', 'title', 'Érudit·e', 80, 11)
on conflict (id) do update set
  category = excluded.category,
  title = excluded.title,
  price = excluded.price,
  sort_order = excluded.sort_order;

-- 2. Journal des achats (une ligne par article possédé).
create table if not exists public.store_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null references public.store_items(id) on delete cascade,
  price_paid integer not null check (price_paid >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, item_id)
);

create index if not exists store_purchases_user_idx
  on public.store_purchases(user_id, created_at desc);

-- 3. Lecture du porte-monnaie : solde, or dépensé, XP total, articles possédés.
create or replace function public.get_store_wallet()
returns table(gold_balance integer, gold_spent integer, total_xp integer, owned_item_ids text[])
language plpgsql
security definer set search_path = ''
as $$
declare
  current_user_id uuid;
  v_total_xp integer;
  v_spent integer;
begin
  current_user_id := auth.uid();
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select coalesce(sum(xp_awarded), 0) into v_total_xp
  from public.lesson_progress where user_id = current_user_id;

  select coalesce(sum(price_paid), 0) into v_spent
  from public.store_purchases where user_id = current_user_id;

  return query
  select
    (v_total_xp / 50) - v_spent,
    v_spent,
    v_total_xp,
    coalesce(
      (select array_agg(sp.item_id) from public.store_purchases sp where sp.user_id = current_user_id),
      array[]::text[]
    );
end;
$$;

-- 4. Achat d'un article : valide le solde de façon atomique, débite l'or.
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
  v_balance integer;
begin
  current_user_id := auth.uid();
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select price into v_price
  from public.store_items where id = p_item_id and active;
  if v_price is null then
    raise exception 'Article introuvable dans la boutique.' using errcode = 'P0002';
  end if;

  if exists (
    select 1 from public.store_purchases as sp
    where sp.user_id = current_user_id and sp.item_id = p_item_id
  ) then
    raise exception 'Tu possèdes déjà cet article.' using errcode = 'P0001';
  end if;

  select coalesce(sum(lp.xp_awarded), 0) into v_total_xp
  from public.lesson_progress as lp where lp.user_id = current_user_id;
  select coalesce(sum(sp.price_paid), 0) into v_spent
  from public.store_purchases as sp where sp.user_id = current_user_id;

  v_balance := (v_total_xp / 50) - v_spent;
  if v_balance < v_price then
    raise exception 'Solde d''or insuffisant.' using errcode = 'P0001';
  end if;

  insert into public.store_purchases (user_id, item_id, price_paid)
  values (current_user_id, p_item_id, v_price);

  return query select (v_balance - v_price), p_item_id;
end;
$$;

-- 5. Sécurité : RLS + droits.
alter table public.store_items enable row level security;
alter table public.store_purchases enable row level security;

revoke all on table public.store_items from anon, authenticated;
revoke all on table public.store_purchases from anon, authenticated;

grant select on table public.store_items to authenticated;
grant select on table public.store_purchases to authenticated;

drop policy if exists "store_items_select_active" on public.store_items;
create policy "store_items_select_active"
  on public.store_items for select to authenticated
  using (active);

drop policy if exists "store_purchases_select_own_or_admin" on public.store_purchases;
create policy "store_purchases_select_own_or_admin"
  on public.store_purchases for select to authenticated
  using ((select auth.uid()) = user_id or (select public.is_platform_admin()));

-- Aucune politique d'INSERT/UPDATE/DELETE pour les élèves : les achats passent
-- uniquement par le RPC security-definer ci-dessous.

revoke all on function public.get_store_wallet() from public, anon;
grant execute on function public.get_store_wallet() to authenticated;
revoke all on function public.purchase_store_item(text) from public, anon;
grant execute on function public.purchase_store_item(text) to authenticated;
