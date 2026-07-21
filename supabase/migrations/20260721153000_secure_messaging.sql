-- Excellence Lycée: messagerie privée persistante et sécurisée.
-- Migration idempotente, conçue pour être rejouée depuis le SQL Editor Supabase.

create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  subject text not null check (char_length(trim(subject)) between 1 and 120),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create table if not exists public.message_thread_members (
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  last_read_at timestamptz,
  muted boolean not null default false,
  archived boolean not null default false,
  primary key (thread_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  body text not null check (char_length(trim(body)) between 1 and 2000),
  reply_to_id uuid references public.messages(id) on delete set null,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

create index if not exists message_thread_members_user_idx
  on public.message_thread_members(user_id, archived, thread_id);
create index if not exists message_threads_activity_idx
  on public.message_threads(last_message_at desc);
create index if not exists messages_thread_created_idx
  on public.messages(thread_id, created_at desc);
create index if not exists messages_sender_idx
  on public.messages(sender_id, created_at desc);

alter table public.message_threads enable row level security;
alter table public.message_thread_members enable row level security;
alter table public.messages enable row level security;

revoke all on table public.message_threads from public, anon, authenticated;
revoke all on table public.message_thread_members from public, anon, authenticated;
revoke all on table public.messages from public, anon, authenticated;

create or replace function public.message_recipient_allowed(p_actor_id uuid, p_recipient_id uuid)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles actor
    join public.profiles recipient on recipient.id = p_recipient_id
    where actor.id = p_actor_id
      and actor.id <> recipient.id
      and (
        actor.role = 'admin'
        or recipient.role in ('teacher', 'content_editor', 'admin')
        or (
          actor.account_type <> 'parent'
          and actor.role in ('teacher', 'content_editor')
          and actor.level_id = recipient.level_id
        )
        or (
          actor.account_type = 'student'
          and recipient.account_type = 'student'
          and actor.level_id = recipient.level_id
        )
      )
  );
$$;

create or replace function public.list_message_recipients(p_search text default '')
returns table (
  user_id uuid,
  user_name text,
  user_role text,
  user_account_type text,
  user_level_id text,
  user_photo_url text
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
    recipient.photo_url
  from public.profiles recipient
  where recipient.id <> (select auth.uid())
    and public.message_recipient_allowed((select auth.uid()), recipient.id)
    and (
      nullif(trim(p_search), '') is null
      or recipient.name ilike '%' || trim(p_search) || '%'
      or recipient.level_id ilike '%' || trim(p_search) || '%'
      or recipient.role ilike '%' || trim(p_search) || '%'
    )
  order by recipient.name asc
  limit 100;
$$;

create or replace function public.get_message_threads(p_include_archived boolean default false)
returns table (
  thread_id uuid,
  thread_subject text,
  participant_id uuid,
  participant_name text,
  participant_role text,
  participant_account_type text,
  participant_level_id text,
  participant_photo_url text,
  last_message_body text,
  last_message_sender_id uuid,
  last_message_created_at timestamptz,
  last_message_deleted boolean,
  unread_count bigint,
  is_muted boolean,
  is_archived boolean,
  thread_created_at timestamptz,
  thread_updated_at timestamptz
)
language sql
stable
security definer set search_path = ''
as $$
  select
    thread.id,
    thread.subject,
    participant.id,
    participant.name,
    participant.role,
    participant.account_type,
    participant.level_id,
    participant.photo_url,
    case when latest.deleted_at is not null then 'Message supprimé' else latest.body end,
    latest.sender_id,
    latest.created_at,
    latest.deleted_at is not null,
    (
      select count(*)
      from public.messages unread
      where unread.thread_id = thread.id
        and unread.sender_id is distinct from (select auth.uid())
        and (
          (self_member.last_read_at is null and unread.created_at >= self_member.joined_at)
          or (self_member.last_read_at is not null and unread.created_at > self_member.last_read_at)
        )
    ),
    self_member.muted,
    self_member.archived,
    thread.created_at,
    thread.updated_at
  from public.message_thread_members self_member
  join public.message_threads thread on thread.id = self_member.thread_id
  join public.message_thread_members other_member
    on other_member.thread_id = thread.id and other_member.user_id <> self_member.user_id
  join public.profiles participant on participant.id = other_member.user_id
  left join lateral (
    select message.body, message.sender_id, message.created_at, message.deleted_at
    from public.messages message
    where message.thread_id = thread.id
    order by message.created_at desc
    limit 1
  ) latest on true
  where self_member.user_id = (select auth.uid())
    and (p_include_archived or not self_member.archived)
  order by thread.last_message_at desc;
$$;

create or replace function public.get_thread_messages(p_thread_id uuid, p_limit integer default 150)
returns table (
  message_id uuid,
  thread_id uuid,
  sender_id uuid,
  sender_name text,
  sender_photo_url text,
  message_body text,
  message_created_at timestamptz,
  message_edited_at timestamptz,
  message_deleted_at timestamptz,
  is_mine boolean,
  read_by_recipient boolean,
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
  if not exists (
    select 1 from public.message_thread_members membership
    where membership.thread_id = p_thread_id and membership.user_id = (select auth.uid())
  ) then
    raise exception 'Conversation introuvable.' using errcode = 'P0002';
  end if;

  return query
  select
    message.id,
    message.thread_id,
    message.sender_id,
    coalesce(sender.name, 'Utilisateur supprimé'),
    sender.photo_url,
    case when message.deleted_at is not null then 'Message supprimé' else message.body end,
    message.created_at,
    message.edited_at,
    message.deleted_at,
    message.sender_id = (select auth.uid()),
    exists (
      select 1 from public.message_thread_members reader
      where reader.thread_id = message.thread_id
        and reader.user_id is distinct from message.sender_id
        and reader.last_read_at >= message.created_at
    ),
    reply.id,
    case when reply.deleted_at is not null then 'Message supprimé' else reply.body end,
    coalesce(reply_sender.name, 'Utilisateur supprimé'),
    reply.deleted_at is not null
  from (
    select recent.*
    from public.messages recent
    where recent.thread_id = p_thread_id
    order by recent.created_at desc
    limit greatest(1, least(coalesce(p_limit, 150), 200))
  ) message
  left join public.profiles sender on sender.id = message.sender_id
  left join public.messages reply on reply.id = message.reply_to_id
  left join public.profiles reply_sender on reply_sender.id = reply.sender_id
  order by message.created_at asc;
end;
$$;

create or replace function public.start_message_thread(p_recipient_id uuid, p_subject text, p_body text)
returns uuid
language plpgsql
security definer set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  new_thread_id uuid;
begin
  if actor_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;
  if not exists (select 1 from public.profiles where id = p_recipient_id) then
    raise exception 'Destinataire introuvable.' using errcode = 'P0002';
  end if;
  if not public.message_recipient_allowed(actor_id, p_recipient_id) then
    raise exception 'Destinataire non autorisé.' using errcode = '42501';
  end if;
  if char_length(trim(coalesce(p_subject, ''))) not between 2 and 120
    or char_length(trim(coalesce(p_body, ''))) not between 1 and 2000 then
    raise exception 'Message invalide.' using errcode = '22023';
  end if;

  insert into public.message_threads (subject, created_by)
  values (trim(p_subject), actor_id)
  returning id into new_thread_id;

  insert into public.message_thread_members (thread_id, user_id, last_read_at)
  values
    (new_thread_id, actor_id, now()),
    (new_thread_id, p_recipient_id, null);

  insert into public.messages (thread_id, sender_id, body)
  values (new_thread_id, actor_id, trim(p_body));

  insert into public.audit_logs (actor_user_id, action, subject_id, metadata_json)
  values (actor_id, 'message.thread.create', new_thread_id::text, jsonb_build_object('recipientId', p_recipient_id));

  return new_thread_id;
end;
$$;

create or replace function public.send_thread_message(p_thread_id uuid, p_body text, p_reply_to_id uuid default null)
returns uuid
language plpgsql
security definer set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  new_message_id uuid;
  event_time timestamptz := now();
begin
  if actor_id is null or not exists (
    select 1 from public.message_thread_members
    where thread_id = p_thread_id and user_id = actor_id
  ) then
    raise exception 'Conversation introuvable.' using errcode = 'P0002';
  end if;
  if char_length(trim(coalesce(p_body, ''))) not between 1 and 2000 then
    raise exception 'Message invalide.' using errcode = '22023';
  end if;
  if p_reply_to_id is not null and not exists (
    select 1 from public.messages where id = p_reply_to_id and thread_id = p_thread_id
  ) then
    raise exception 'Message cité introuvable.' using errcode = 'P0003';
  end if;

  insert into public.messages (thread_id, sender_id, body, reply_to_id, created_at)
  values (p_thread_id, actor_id, trim(p_body), p_reply_to_id, event_time)
  returning id into new_message_id;

  update public.message_threads
  set updated_at = event_time, last_message_at = event_time
  where id = p_thread_id;
  update public.message_thread_members set archived = false where thread_id = p_thread_id;
  update public.message_thread_members set last_read_at = event_time
  where thread_id = p_thread_id and user_id = actor_id;
  return new_message_id;
end;
$$;

create or replace function public.mark_thread_read(p_thread_id uuid)
returns boolean
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.message_thread_members
  set last_read_at = now()
  where thread_id = p_thread_id and user_id = (select auth.uid());
  return found;
end;
$$;

create or replace function public.update_thread_preferences(
  p_thread_id uuid,
  p_muted boolean default null,
  p_archived boolean default null
)
returns boolean
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.message_thread_members
  set muted = coalesce(p_muted, muted), archived = coalesce(p_archived, archived)
  where thread_id = p_thread_id and user_id = (select auth.uid());
  return found;
end;
$$;

create or replace function public.edit_own_message(p_message_id uuid, p_body text)
returns boolean
language plpgsql
security definer set search_path = ''
as $$
declare
  affected_thread uuid;
begin
  if char_length(trim(coalesce(p_body, ''))) not between 1 and 2000 then
    raise exception 'Message invalide.' using errcode = '22023';
  end if;
  update public.messages
  set body = trim(p_body), edited_at = now()
  where id = p_message_id and sender_id = (select auth.uid()) and deleted_at is null
  returning thread_id into affected_thread;
  if affected_thread is not null then
    update public.message_threads set updated_at = now() where id = affected_thread;
  end if;
  return affected_thread is not null;
end;
$$;

create or replace function public.delete_own_message(p_message_id uuid)
returns boolean
language plpgsql
security definer set search_path = ''
as $$
declare
  affected_thread uuid;
begin
  update public.messages
  set deleted_at = now()
  where id = p_message_id and sender_id = (select auth.uid()) and deleted_at is null
  returning thread_id into affected_thread;
  if affected_thread is not null then
    update public.message_threads set updated_at = now() where id = affected_thread;
    insert into public.audit_logs (actor_user_id, action, subject_id)
    values ((select auth.uid()), 'message.delete', p_message_id::text);
  end if;
  return affected_thread is not null;
end;
$$;

revoke all on function public.message_recipient_allowed(uuid, uuid) from public, anon;
revoke all on function public.list_message_recipients(text) from public, anon;
revoke all on function public.get_message_threads(boolean) from public, anon;
revoke all on function public.get_thread_messages(uuid, integer) from public, anon;
revoke all on function public.start_message_thread(uuid, text, text) from public, anon;
revoke all on function public.send_thread_message(uuid, text, uuid) from public, anon;
revoke all on function public.mark_thread_read(uuid) from public, anon;
revoke all on function public.update_thread_preferences(uuid, boolean, boolean) from public, anon;
revoke all on function public.edit_own_message(uuid, text) from public, anon;
revoke all on function public.delete_own_message(uuid) from public, anon;

grant execute on function public.list_message_recipients(text) to authenticated;
grant execute on function public.get_message_threads(boolean) to authenticated;
grant execute on function public.get_thread_messages(uuid, integer) to authenticated;
grant execute on function public.start_message_thread(uuid, text, text) to authenticated;
grant execute on function public.send_thread_message(uuid, text, uuid) to authenticated;
grant execute on function public.mark_thread_read(uuid) to authenticated;
grant execute on function public.update_thread_preferences(uuid, boolean, boolean) to authenticated;
grant execute on function public.edit_own_message(uuid, text) to authenticated;
grant execute on function public.delete_own_message(uuid) to authenticated;
