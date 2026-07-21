-- Salon communautaire global Excellence Lycée.

create table if not exists public.global_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.profiles(id) on delete set null,
  body text not null check (char_length(trim(body)) between 1 and 2000),
  reply_to_id uuid references public.global_messages(id) on delete set null,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

create index if not exists global_messages_created_idx
  on public.global_messages(created_at desc);
create index if not exists global_messages_sender_idx
  on public.global_messages(sender_id, created_at desc);

alter table public.global_messages enable row level security;
revoke all on table public.global_messages from public, anon, authenticated;

create or replace function public.get_global_messages(p_limit integer default 150)
returns table (
  message_id uuid,
  sender_id uuid,
  sender_name text,
  sender_photo_url text,
  sender_role text,
  sender_level_id text,
  message_body text,
  message_created_at timestamptz,
  message_edited_at timestamptz,
  message_deleted_at timestamptz,
  is_mine boolean,
  reply_to_id uuid,
  reply_to_body text,
  reply_to_sender_name text,
  reply_to_deleted boolean
)
language plpgsql
stable
security definer set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  return query
  select
    message.id,
    message.sender_id,
    coalesce(sender.name, 'Utilisateur supprimé'),
    sender.photo_url,
    coalesce(sender.role, 'student'),
    coalesce(sender.level_id, ''),
    case when message.deleted_at is not null then 'Message supprimé' else message.body end,
    message.created_at,
    message.edited_at,
    message.deleted_at,
    message.sender_id = auth.uid(),
    reply.id,
    case when reply.deleted_at is not null then 'Message supprimé' else reply.body end,
    coalesce(reply_sender.name, 'Utilisateur supprimé'),
    reply.deleted_at is not null
  from (
    select recent.*
    from public.global_messages recent
    order by recent.created_at desc
    limit greatest(1, least(coalesce(p_limit, 150), 200))
  ) message
  left join public.profiles sender on sender.id = message.sender_id
  left join public.global_messages reply on reply.id = message.reply_to_id
  left join public.profiles reply_sender on reply_sender.id = reply.sender_id
  order by message.created_at asc;
end;
$$;

create or replace function public.send_global_message(p_body text, p_reply_to_id uuid default null)
returns uuid
language plpgsql
security definer set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  new_message_id uuid;
begin
  if actor_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;
  if char_length(trim(coalesce(p_body, ''))) not between 1 and 2000 then
    raise exception 'Message invalide.' using errcode = '22023';
  end if;
  if p_reply_to_id is not null and not exists (
    select 1 from public.global_messages where id = p_reply_to_id
  ) then
    raise exception 'Message cité introuvable.' using errcode = 'P0003';
  end if;

  insert into public.global_messages (sender_id, body, reply_to_id)
  values (actor_id, trim(p_body), p_reply_to_id)
  returning id into new_message_id;

  return new_message_id;
end;
$$;

create or replace function public.edit_own_global_message(p_message_id uuid, p_body text)
returns boolean
language plpgsql
security definer set search_path = ''
as $$
begin
  if char_length(trim(coalesce(p_body, ''))) not between 1 and 2000 then
    raise exception 'Message invalide.' using errcode = '22023';
  end if;
  update public.global_messages
  set body = trim(p_body), edited_at = now()
  where id = p_message_id and sender_id = auth.uid() and deleted_at is null;
  return found;
end;
$$;

create or replace function public.delete_global_message(p_message_id uuid)
returns boolean
language plpgsql
security definer set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  actor_role text;
begin
  select role into actor_role from public.profiles where id = actor_id;
  update public.global_messages
  set deleted_at = now()
  where id = p_message_id
    and deleted_at is null
    and (sender_id = actor_id or actor_role = 'admin');
  if found then
    insert into public.audit_logs (actor_user_id, action, subject_id)
    values (actor_id, 'message.global.delete', p_message_id::text);
    return true;
  end if;
  return false;
end;
$$;

revoke all on function public.get_global_messages(integer) from public, anon;
revoke all on function public.send_global_message(text, uuid) from public, anon;
revoke all on function public.edit_own_global_message(uuid, text) from public, anon;
revoke all on function public.delete_global_message(uuid) from public, anon;

grant execute on function public.get_global_messages(integer) to authenticated;
grant execute on function public.send_global_message(text, uuid) to authenticated;
grant execute on function public.edit_own_global_message(uuid, text) to authenticated;
grant execute on function public.delete_global_message(uuid) to authenticated;

