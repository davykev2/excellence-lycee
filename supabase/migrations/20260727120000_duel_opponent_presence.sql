-- Présence minimale et privée pour classer les adversaires de duel.
-- Le statut n'est exposé qu'aux destinataires déjà autorisés par la messagerie.

create table if not exists public.user_presence (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  last_seen_at timestamptz not null default now()
);

create index if not exists user_presence_last_seen_idx
  on public.user_presence(last_seen_at desc);

alter table public.user_presence enable row level security;
revoke all on table public.user_presence from public, anon, authenticated;

create or replace function public.touch_user_presence()
returns timestamptz
language plpgsql
volatile
security definer set search_path = ''
as $$
declare
  seen_at timestamptz := now();
  actor_id uuid := (select auth.uid());
begin
  if actor_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  insert into public.user_presence (user_id, last_seen_at)
  values (actor_id, seen_at)
  on conflict (user_id) do update
    set last_seen_at = excluded.last_seen_at;

  return seen_at;
end;
$$;

drop function if exists public.list_message_recipients(text);

create function public.list_message_recipients(p_search text default '')
returns table (
  user_id uuid,
  user_name text,
  user_role text,
  user_account_type text,
  user_level_id text,
  user_photo_url text,
  user_online boolean,
  user_last_seen_at timestamptz
)
language sql
stable
security definer set search_path = ''
as $$
  select
    recipient.id,
    recipient.name,
    recipient.role,
    recipient.account_type,
    recipient.level_id,
    recipient.photo_url,
    coalesce(presence.last_seen_at >= now() - interval '2 minutes', false),
    presence.last_seen_at
  from public.profiles recipient
  left join public.user_presence presence on presence.user_id = recipient.id
  where recipient.id <> (select auth.uid())
    and public.message_recipient_allowed((select auth.uid()), recipient.id)
    and (
      nullif(trim(p_search), '') is null
      or recipient.name ilike '%' || trim(p_search) || '%'
      or recipient.level_id ilike '%' || trim(p_search) || '%'
      or recipient.role ilike '%' || trim(p_search) || '%'
    )
  order by
    coalesce(presence.last_seen_at >= now() - interval '2 minutes', false) desc,
    presence.last_seen_at desc nulls last,
    recipient.name asc
  limit 100;
$$;

revoke all on function public.touch_user_presence() from public, anon;
revoke all on function public.list_message_recipients(text) from public, anon;
grant execute on function public.touch_user_presence() to authenticated;
grant execute on function public.list_message_recipients(text) to authenticated;
