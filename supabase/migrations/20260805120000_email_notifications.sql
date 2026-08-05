-- Notifications par e-mail : diffusion depuis l'administration et avis de
-- réponse aux retours laissés sur les niveaux.
--
-- Deux principes repris du reste du projet :
--  * aucun accès direct aux tables (RLS fermée), tout passe par des fonctions
--    security definer ;
--  * le désabonnement ne concerne QUE les diffusions. Un élève qui a laissé un
--    avis reçoit toujours la réponse de l'administration : c'est un échange
--    qu'il a lui-même initié.

alter table public.profiles
  add column if not exists email_opt_out boolean not null default false;

create table if not exists public.email_broadcasts (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  audience text not null check (audience in ('students', 'students-and-parents', 'everyone')),
  subject text not null,
  body text not null,
  recipient_count integer not null default 0,
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.email_deliveries (
  id uuid primary key default gen_random_uuid(),
  broadcast_id uuid references public.email_broadcasts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  kind text not null check (kind in ('broadcast', 'feedback_reply')),
  email text not null,
  status text not null check (status in ('sent', 'failed')),
  provider_message_id text,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists email_deliveries_broadcast_idx
  on public.email_deliveries (broadcast_id, created_at desc);

alter table public.email_broadcasts enable row level security;
alter table public.email_deliveries enable row level security;

revoke all on table public.email_broadcasts from anon, authenticated;
revoke all on table public.email_deliveries from anon, authenticated;

/* ---------------------------------------------------------------------------
 * Sélection des destinataires.
 * ------------------------------------------------------------------------ */

-- Renvoie les destinataires d'une cible. Réservé à l'administration : la liste
-- contient des adresses e-mail, elle ne doit jamais sortir d'un rôle admin.
create or replace function public.get_email_broadcast_audience(
  p_audience text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  -- Jamais `current_role` : c'est un mot-clé réservé de PostgreSQL.
  v_role text;
  recipients jsonb;
begin
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select coalesce(profile.role, 'student')
  into v_role
  from public.profiles profile
  where profile.id = current_user_id;

  if v_role <> 'admin' then
    raise exception 'Accès réservé à l''administration.' using errcode = '42501';
  end if;

  if p_audience not in ('students', 'students-and-parents', 'everyone') then
    raise exception 'Cible inconnue.' using errcode = '22023';
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object('id', target.id, 'email', target.email, 'name', target.name)
      order by target.created_at
    ),
    '[]'::jsonb
  )
  into recipients
  from public.profiles target
  where target.email_opt_out = false
    and target.email is not null
    and target.email <> ''
    and (
      case p_audience
        when 'students' then target.role = 'student' and target.account_type = 'student'
        when 'students-and-parents' then target.role = 'student'
        else true
      end
    );

  return recipients;
end;
$$;

-- Même filtre, mais ne renvoie que le nombre : l'écran d'administration affiche
-- un compte avant confirmation sans jamais rapatrier les adresses.
create or replace function public.count_email_broadcast_audience(
  p_audience text
)
returns integer
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  v_role text;
  total integer;
begin
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select coalesce(profile.role, 'student')
  into v_role
  from public.profiles profile
  where profile.id = current_user_id;

  if v_role <> 'admin' then
    raise exception 'Accès réservé à l''administration.' using errcode = '42501';
  end if;

  if p_audience not in ('students', 'students-and-parents', 'everyone') then
    raise exception 'Cible inconnue.' using errcode = '22023';
  end if;

  select count(*)::integer
  into total
  from public.profiles target
  where target.email_opt_out = false
    and target.email is not null
    and target.email <> ''
    and (
      case p_audience
        when 'students' then target.role = 'student' and target.account_type = 'student'
        when 'students-and-parents' then target.role = 'student'
        else true
      end
    );

  return coalesce(total, 0);
end;
$$;

/* ---------------------------------------------------------------------------
 * Journalisation.
 * ------------------------------------------------------------------------ */

-- Enregistre une diffusion et le détail par destinataire, en une transaction.
-- `p_deliveries` : tableau d'objets {userId, email, status, providerMessageId, error}.
create or replace function public.record_email_broadcast(
  p_audience text,
  p_subject text,
  p_body text,
  p_recipient_count integer,
  p_deliveries jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  v_role text;
  new_broadcast_id uuid;
  sent integer;
  failed integer;
begin
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select coalesce(profile.role, 'student')
  into v_role
  from public.profiles profile
  where profile.id = current_user_id;

  if v_role <> 'admin' then
    raise exception 'Accès réservé à l''administration.' using errcode = '42501';
  end if;

  select
    count(*) filter (where entry->>'status' = 'sent')::integer,
    count(*) filter (where entry->>'status' = 'failed')::integer
  into sent, failed
  from jsonb_array_elements(coalesce(p_deliveries, '[]'::jsonb)) entry;

  insert into public.email_broadcasts (
    actor_user_id, audience, subject, body, recipient_count, sent_count, failed_count
  )
  values (
    current_user_id, p_audience, p_subject, p_body,
    coalesce(p_recipient_count, 0), coalesce(sent, 0), coalesce(failed, 0)
  )
  returning id into new_broadcast_id;

  insert into public.email_deliveries (broadcast_id, user_id, kind, email, status, provider_message_id, error)
  select
    new_broadcast_id,
    nullif(entry->>'userId', '')::uuid,
    'broadcast',
    entry->>'email',
    entry->>'status',
    nullif(entry->>'providerMessageId', ''),
    nullif(entry->>'error', '')
  from jsonb_array_elements(coalesce(p_deliveries, '[]'::jsonb)) entry;

  return new_broadcast_id;
end;
$$;

-- Journalise un e-mail transactionnel (réponse de l'administration à un avis).
create or replace function public.record_email_delivery(
  p_user_id uuid,
  p_email text,
  p_status text,
  p_provider_message_id text,
  p_error text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  v_role text;
begin
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select coalesce(profile.role, 'student')
  into v_role
  from public.profiles profile
  where profile.id = current_user_id;

  if v_role <> 'admin' then
    raise exception 'Accès réservé à l''administration.' using errcode = '42501';
  end if;

  insert into public.email_deliveries (user_id, kind, email, status, provider_message_id, error)
  values (p_user_id, 'feedback_reply', p_email, p_status, nullif(p_provider_message_id, ''), nullif(p_error, ''));
end;
$$;

-- Historique des diffusions pour l'écran d'administration.
create or replace function public.list_email_broadcasts(
  p_limit integer default 10
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  v_role text;
  v_limit integer := least(50, greatest(1, coalesce(p_limit, 10)));
  history jsonb;
begin
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select coalesce(profile.role, 'student')
  into v_role
  from public.profiles profile
  where profile.id = current_user_id;

  if v_role <> 'admin' then
    raise exception 'Accès réservé à l''administration.' using errcode = '42501';
  end if;

  select coalesce(jsonb_agg(recent.entry order by recent.created_at desc), '[]'::jsonb)
  into history
  from (
    select
      jsonb_build_object(
        'id', broadcast.id,
        'audience', broadcast.audience,
        'subject', broadcast.subject,
        'recipientCount', broadcast.recipient_count,
        'sentCount', broadcast.sent_count,
        'failedCount', broadcast.failed_count,
        'authorName', coalesce(author.name, 'Administration'),
        'createdAt', broadcast.created_at
      ) as entry,
      broadcast.created_at
    from public.email_broadcasts broadcast
    left join public.profiles author on author.id = broadcast.actor_user_id
    order by broadcast.created_at desc
    limit v_limit
  ) recent;

  return history;
end;
$$;

/* ---------------------------------------------------------------------------
 * Désabonnement.
 * ------------------------------------------------------------------------ */

-- Appelée depuis le lien des e-mails, donc sans session. Le jeton est vérifié
-- par l'API (HMAC signé avec JWT_SECRET) avant d'arriver ici. Cette fonction ne
-- peut que **désabonner** : se réabonner exige une session authentifiée. Le pire
-- abus possible avec la clé publiable reste donc de couper les annonces d'un
-- compte dont on connaîtrait déjà l'identifiant, ce que l'intéressé peut défaire.
create or replace function public.unsubscribe_from_emails(
  p_user_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected_count integer;
begin
  update public.profiles target
  set email_opt_out = true, updated_at = now()
  where target.id = p_user_id and target.email_opt_out = false;

  get diagnostics affected_count = row_count;
  -- Vrai aussi si la personne était déjà désabonnée : le lien reste idempotent.
  return affected_count = 1 or exists (
    select 1 from public.profiles target where target.id = p_user_id
  );
end;
$$;

-- Réabonnement, réservé au titulaire du compte connecté.
create or replace function public.set_my_email_opt_out(
  p_value boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  update public.profiles target
  set email_opt_out = coalesce(p_value, false), updated_at = now()
  where target.id = current_user_id;

  return coalesce(p_value, false);
end;
$$;

revoke all on function public.get_email_broadcast_audience(text) from public, anon;
revoke all on function public.count_email_broadcast_audience(text) from public, anon;
revoke all on function public.record_email_broadcast(text, text, text, integer, jsonb) from public, anon;
revoke all on function public.record_email_delivery(uuid, text, text, text, text) from public, anon;
revoke all on function public.list_email_broadcasts(integer) from public, anon;
revoke all on function public.set_my_email_opt_out(boolean) from public, anon;

grant execute on function public.get_email_broadcast_audience(text) to authenticated;
grant execute on function public.count_email_broadcast_audience(text) to authenticated;
grant execute on function public.record_email_broadcast(text, text, text, integer, jsonb) to authenticated;
grant execute on function public.record_email_delivery(uuid, text, text, text, text) to authenticated;
grant execute on function public.list_email_broadcasts(integer) to authenticated;
grant execute on function public.set_my_email_opt_out(boolean) to authenticated;

revoke all on function public.unsubscribe_from_emails(uuid) from public;
grant execute on function public.unsubscribe_from_emails(uuid) to anon, authenticated;

notify pgrst, 'reload schema';
