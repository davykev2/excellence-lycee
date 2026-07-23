-- Réactions et commentaires pédagogiques sur chaque niveau publié du parcours.

create extension if not exists pgcrypto;

create table if not exists public.mastery_lesson_reactions (
  user_id uuid not null references public.profiles(id) on delete cascade,
  path_id text not null
    check (char_length(path_id) between 2 and 120 and path_id ~ '^[a-z0-9-]+$'),
  lesson_id text not null
    check (char_length(lesson_id) between 2 and 120 and lesson_id ~ '^[a-z0-9-]+$'),
  reaction text not null
    check (reaction in ('useful', 'love', 'clear', 'confusing')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, path_id, lesson_id)
);

create index if not exists mastery_lesson_reactions_target_idx
  on public.mastery_lesson_reactions(path_id, lesson_id);

create table if not exists public.mastery_lesson_comments (
  id uuid primary key default gen_random_uuid(),
  path_id text not null
    check (char_length(path_id) between 2 and 120 and path_id ~ '^[a-z0-9-]+$'),
  lesson_id text not null
    check (char_length(lesson_id) between 2 and 120 and lesson_id ~ '^[a-z0-9-]+$'),
  author_user_id uuid references public.profiles(id) on delete set null,
  body text not null
    check (char_length(trim(body)) between 1 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mastery_lesson_comments_target_idx
  on public.mastery_lesson_comments(path_id, lesson_id, created_at desc);

drop trigger if exists mastery_lesson_reactions_set_updated_at
  on public.mastery_lesson_reactions;
create trigger mastery_lesson_reactions_set_updated_at
  before update on public.mastery_lesson_reactions
  for each row execute procedure public.set_updated_at();

drop trigger if exists mastery_lesson_comments_set_updated_at
  on public.mastery_lesson_comments;
create trigger mastery_lesson_comments_set_updated_at
  before update on public.mastery_lesson_comments
  for each row execute procedure public.set_updated_at();

alter table public.mastery_lesson_reactions enable row level security;
alter table public.mastery_lesson_comments enable row level security;

-- Les clients passent exclusivement par les fonctions ci-dessous.
revoke all on table public.mastery_lesson_reactions from anon, authenticated;
revoke all on table public.mastery_lesson_comments from anon, authenticated;

create or replace function public.get_mastery_lesson_feedback(
  p_path_id text,
  p_lesson_id text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_role text;
  own_reaction text;
  useful_count integer;
  love_count integer;
  clear_count integer;
  confusing_count integer;
  comments_json jsonb;
  comments_count integer;
begin
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.lesson_rewards reward
    where reward.path_id = p_path_id and reward.lesson_id = p_lesson_id
  ) then
    raise exception 'Niveau introuvable dans le programme publié.' using errcode = 'P0002';
  end if;

  select coalesce(profile.role, 'student')
  into current_role
  from public.profiles profile
  where profile.id = current_user_id;

  select reaction.reaction
  into own_reaction
  from public.mastery_lesson_reactions reaction
  where reaction.user_id = current_user_id
    and reaction.path_id = p_path_id
    and reaction.lesson_id = p_lesson_id;

  select
    count(*) filter (where reaction.reaction = 'useful')::integer,
    count(*) filter (where reaction.reaction = 'love')::integer,
    count(*) filter (where reaction.reaction = 'clear')::integer,
    count(*) filter (where reaction.reaction = 'confusing')::integer
  into useful_count, love_count, clear_count, confusing_count
  from public.mastery_lesson_reactions reaction
  where reaction.path_id = p_path_id
    and reaction.lesson_id = p_lesson_id;

  select count(*)::integer
  into comments_count
  from public.mastery_lesson_comments comment
  where comment.path_id = p_path_id
    and comment.lesson_id = p_lesson_id;

  select coalesce(
    jsonb_agg(
      jsonb_strip_nulls(
        jsonb_build_object(
          'id', recent.id,
          'authorId', recent.author_user_id,
          'authorName', coalesce(profile.name, 'Utilisateur supprimé'),
          'authorPhotoUrl', profile.photo_url,
          'authorRole', coalesce(profile.role, 'student'),
          'body', recent.body,
          'createdAt', recent.created_at,
          'updatedAt', case
            when recent.updated_at > recent.created_at then recent.updated_at
            else null
          end,
          'isMine', recent.author_user_id = current_user_id,
          'canEdit', recent.author_user_id = current_user_id,
          'canDelete', recent.author_user_id = current_user_id or current_role = 'admin'
        )
      )
      order by recent.created_at desc
    ),
    '[]'::jsonb
  )
  into comments_json
  from (
    select comment.*
    from public.mastery_lesson_comments comment
    where comment.path_id = p_path_id
      and comment.lesson_id = p_lesson_id
    order by comment.created_at desc
    limit 50
  ) recent
  left join public.profiles profile on profile.id = recent.author_user_id;

  return jsonb_build_object(
    'reactions', jsonb_strip_nulls(jsonb_build_object(
      'counts', jsonb_build_object(
        'useful', coalesce(useful_count, 0),
        'love', coalesce(love_count, 0),
        'clear', coalesce(clear_count, 0),
        'confusing', coalesce(confusing_count, 0)
      ),
      'total', coalesce(useful_count, 0) + coalesce(love_count, 0)
        + coalesce(clear_count, 0) + coalesce(confusing_count, 0),
      'myReaction', own_reaction
    )),
    'comments', comments_json,
    'commentCount', coalesce(comments_count, 0)
  );
end;
$$;

create or replace function public.set_mastery_lesson_reaction(
  p_path_id text,
  p_lesson_id text,
  p_reaction text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_reaction text;
begin
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  if p_reaction is not null
    and p_reaction not in ('useful', 'love', 'clear', 'confusing') then
    raise exception 'Réaction invalide.' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.lesson_rewards reward
    where reward.path_id = p_path_id and reward.lesson_id = p_lesson_id
  ) then
    raise exception 'Niveau introuvable dans le programme publié.' using errcode = 'P0002';
  end if;

  select reaction.reaction
  into current_reaction
  from public.mastery_lesson_reactions reaction
  where reaction.user_id = current_user_id
    and reaction.path_id = p_path_id
    and reaction.lesson_id = p_lesson_id;

  if p_reaction is null or current_reaction = p_reaction then
    delete from public.mastery_lesson_reactions reaction
    where reaction.user_id = current_user_id
      and reaction.path_id = p_path_id
      and reaction.lesson_id = p_lesson_id;
  else
    insert into public.mastery_lesson_reactions (
      user_id, path_id, lesson_id, reaction
    )
    values (
      current_user_id, p_path_id, p_lesson_id, p_reaction
    )
    on conflict (user_id, path_id, lesson_id)
    do update set reaction = excluded.reaction;
  end if;

  return public.get_mastery_lesson_feedback(p_path_id, p_lesson_id);
end;
$$;

create or replace function public.create_mastery_lesson_comment(
  p_path_id text,
  p_lesson_id text,
  p_body text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  comment_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  if char_length(trim(coalesce(p_body, ''))) not between 1 and 1000 then
    raise exception 'Le commentaire doit contenir entre 1 et 1 000 caractères.'
      using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.lesson_rewards reward
    where reward.path_id = p_path_id and reward.lesson_id = p_lesson_id
  ) then
    raise exception 'Niveau introuvable dans le programme publié.' using errcode = 'P0002';
  end if;

  insert into public.mastery_lesson_comments (
    path_id, lesson_id, author_user_id, body
  )
  values (
    p_path_id, p_lesson_id, current_user_id, trim(p_body)
  )
  returning id into comment_id;

  return comment_id;
end;
$$;

create or replace function public.edit_mastery_lesson_comment(
  p_comment_id uuid,
  p_body text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  affected_count integer;
begin
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  if char_length(trim(coalesce(p_body, ''))) not between 1 and 1000 then
    raise exception 'Le commentaire doit contenir entre 1 et 1 000 caractères.'
      using errcode = '22023';
  end if;

  update public.mastery_lesson_comments comment
  set body = trim(p_body)
  where comment.id = p_comment_id
    and comment.author_user_id = current_user_id;

  get diagnostics affected_count = row_count;
  return affected_count = 1;
end;
$$;

create or replace function public.delete_mastery_lesson_comment(
  p_comment_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_role text;
  affected_count integer;
begin
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select profile.role
  into current_role
  from public.profiles profile
  where profile.id = current_user_id;

  delete from public.mastery_lesson_comments comment
  where comment.id = p_comment_id
    and (
      comment.author_user_id = current_user_id
      or current_role = 'admin'
    );

  get diagnostics affected_count = row_count;
  return affected_count = 1;
end;
$$;

revoke all on function public.get_mastery_lesson_feedback(text, text)
  from public, anon;
revoke all on function public.set_mastery_lesson_reaction(text, text, text)
  from public, anon;
revoke all on function public.create_mastery_lesson_comment(text, text, text)
  from public, anon;
revoke all on function public.edit_mastery_lesson_comment(uuid, text)
  from public, anon;
revoke all on function public.delete_mastery_lesson_comment(uuid)
  from public, anon;

grant execute on function public.get_mastery_lesson_feedback(text, text)
  to authenticated;
grant execute on function public.set_mastery_lesson_reaction(text, text, text)
  to authenticated;
grant execute on function public.create_mastery_lesson_comment(text, text, text)
  to authenticated;
grant execute on function public.edit_mastery_lesson_comment(uuid, text)
  to authenticated;
grant execute on function public.delete_mastery_lesson_comment(uuid)
  to authenticated;

notify pgrst, 'reload schema';
