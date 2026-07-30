-- Réactions aux commentaires pédagogiques et remontée dans la cloche Admin.
-- Une personne ne peut conserver qu'une réaction par commentaire.

create table if not exists public.mastery_lesson_comment_reactions (
  comment_id uuid not null
    references public.mastery_lesson_comments(id) on delete cascade,
  user_id uuid not null
    references public.profiles(id) on delete cascade,
  reaction text not null
    check (reaction in ('like', 'love', 'helpful')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create index if not exists mastery_lesson_comment_reactions_comment_idx
  on public.mastery_lesson_comment_reactions(comment_id, updated_at desc);

drop trigger if exists mastery_lesson_comment_reactions_set_updated_at
  on public.mastery_lesson_comment_reactions;
create trigger mastery_lesson_comment_reactions_set_updated_at
  before update on public.mastery_lesson_comment_reactions
  for each row execute procedure public.set_updated_at();

alter table public.mastery_lesson_comment_reactions enable row level security;
revoke all on table public.mastery_lesson_comment_reactions from anon, authenticated;

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
  v_role text;
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
  into v_role
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
          'canDelete', recent.author_user_id = current_user_id or v_role = 'admin',
          'reactions', jsonb_strip_nulls(jsonb_build_object(
            'counts', jsonb_build_object(
              'like', (
                select count(*)::integer
                from public.mastery_lesson_comment_reactions item
                where item.comment_id = recent.id and item.reaction = 'like'
              ),
              'love', (
                select count(*)::integer
                from public.mastery_lesson_comment_reactions item
                where item.comment_id = recent.id and item.reaction = 'love'
              ),
              'helpful', (
                select count(*)::integer
                from public.mastery_lesson_comment_reactions item
                where item.comment_id = recent.id and item.reaction = 'helpful'
              )
            ),
            'adminCounts', jsonb_build_object(
              'like', (
                select count(*)::integer
                from public.mastery_lesson_comment_reactions item
                join public.profiles reactor on reactor.id = item.user_id
                where item.comment_id = recent.id
                  and item.reaction = 'like'
                  and reactor.role = 'admin'
              ),
              'love', (
                select count(*)::integer
                from public.mastery_lesson_comment_reactions item
                join public.profiles reactor on reactor.id = item.user_id
                where item.comment_id = recent.id
                  and item.reaction = 'love'
                  and reactor.role = 'admin'
              ),
              'helpful', (
                select count(*)::integer
                from public.mastery_lesson_comment_reactions item
                join public.profiles reactor on reactor.id = item.user_id
                where item.comment_id = recent.id
                  and item.reaction = 'helpful'
                  and reactor.role = 'admin'
              )
            ),
            'total', (
              select count(*)::integer
              from public.mastery_lesson_comment_reactions item
              where item.comment_id = recent.id
            ),
            'myReaction', (
              select item.reaction
              from public.mastery_lesson_comment_reactions item
              where item.comment_id = recent.id
                and item.user_id = current_user_id
            )
          ))
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

create or replace function public.set_mastery_lesson_comment_reaction(
  p_comment_id uuid,
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
  comment_path_id text;
  comment_lesson_id text;
begin
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  if p_reaction is not null
    and p_reaction not in ('like', 'love', 'helpful') then
    raise exception 'Réaction au commentaire invalide.' using errcode = '22023';
  end if;

  select comment.path_id, comment.lesson_id
  into comment_path_id, comment_lesson_id
  from public.mastery_lesson_comments comment
  where comment.id = p_comment_id;

  if not found then
    raise exception 'Commentaire introuvable.' using errcode = 'P0002';
  end if;

  select item.reaction
  into current_reaction
  from public.mastery_lesson_comment_reactions item
  where item.comment_id = p_comment_id
    and item.user_id = current_user_id;

  if p_reaction is null or current_reaction = p_reaction then
    delete from public.mastery_lesson_comment_reactions item
    where item.comment_id = p_comment_id
      and item.user_id = current_user_id;
  else
    insert into public.mastery_lesson_comment_reactions (
      comment_id, user_id, reaction
    )
    values (
      p_comment_id, current_user_id, p_reaction
    )
    on conflict (comment_id, user_id)
    do update set reaction = excluded.reaction;
  end if;

  return public.get_mastery_lesson_feedback(comment_path_id, comment_lesson_id);
end;
$$;

create or replace function public.get_admin_mastery_feedback_feed(
  p_limit integer default 40
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
  v_limit integer := least(100, greatest(1, coalesce(p_limit, 40)));
  feed jsonb;
begin
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select coalesce(profile.role, 'student')
  into v_role
  from public.profiles profile
  where profile.id = current_user_id;

  if v_role not in ('admin', 'content_editor') then
    raise exception 'Accès réservé à l''administration.' using errcode = '42501';
  end if;

  with events as (
    select
      jsonb_build_object(
        'kind', 'comment',
        'id', comment.id::text,
        'pathId', comment.path_id,
        'lessonId', comment.lesson_id,
        'authorId', comment.author_user_id,
        'authorName', coalesce(profile.name, 'Utilisateur supprimé'),
        'authorPhotoUrl', profile.photo_url,
        'authorRole', coalesce(profile.role, 'student'),
        'body', comment.body,
        'createdAt', comment.created_at
      ) as item,
      comment.created_at as item_created_at
    from public.mastery_lesson_comments comment
    left join public.profiles profile on profile.id = comment.author_user_id
    where coalesce(profile.role, 'student') not in ('admin', 'content_editor')

    union all

    select
      jsonb_build_object(
        'kind', 'reaction',
        'id', reaction.user_id::text || ':' || reaction.path_id || ':' || reaction.lesson_id,
        'pathId', reaction.path_id,
        'lessonId', reaction.lesson_id,
        'authorId', reaction.user_id,
        'authorName', coalesce(profile.name, 'Utilisateur supprimé'),
        'authorPhotoUrl', profile.photo_url,
        'authorRole', coalesce(profile.role, 'student'),
        'reaction', reaction.reaction,
        'createdAt', greatest(reaction.created_at, reaction.updated_at)
      ) as item,
      greatest(reaction.created_at, reaction.updated_at) as item_created_at
    from public.mastery_lesson_reactions reaction
    left join public.profiles profile on profile.id = reaction.user_id
    where coalesce(profile.role, 'student') not in ('admin', 'content_editor')

    union all

    select
      jsonb_build_object(
        'kind', 'comment_reaction',
        'id', reaction.user_id::text || ':' || reaction.comment_id::text,
        'pathId', comment.path_id,
        'lessonId', comment.lesson_id,
        'authorId', reaction.user_id,
        'authorName', coalesce(profile.name, 'Utilisateur supprimé'),
        'authorPhotoUrl', profile.photo_url,
        'authorRole', coalesce(profile.role, 'student'),
        'reaction', reaction.reaction,
        'commentId', comment.id,
        'commentBody', comment.body,
        'commentAuthorName', coalesce(comment_author.name, 'Utilisateur supprimé'),
        'createdAt', greatest(reaction.created_at, reaction.updated_at)
      ) as item,
      greatest(reaction.created_at, reaction.updated_at) as item_created_at
    from public.mastery_lesson_comment_reactions reaction
    join public.mastery_lesson_comments comment on comment.id = reaction.comment_id
    left join public.profiles profile on profile.id = reaction.user_id
    left join public.profiles comment_author on comment_author.id = comment.author_user_id
    where coalesce(profile.role, 'student') not in ('admin', 'content_editor')
  )
  select coalesce(jsonb_agg(recent.item order by recent.item_created_at desc), '[]'::jsonb)
  into feed
  from (
    select item, item_created_at
    from events
    order by item_created_at desc
    limit v_limit
  ) recent;

  return feed;
end;
$$;

revoke all on function public.set_mastery_lesson_comment_reaction(uuid, text)
  from public, anon;
grant execute on function public.set_mastery_lesson_comment_reaction(uuid, text)
  to authenticated;

revoke all on function public.get_mastery_lesson_feedback(text, text)
  from public, anon;
grant execute on function public.get_mastery_lesson_feedback(text, text)
  to authenticated;

revoke all on function public.get_admin_mastery_feedback_feed(integer)
  from public, anon;
grant execute on function public.get_admin_mastery_feedback_feed(integer)
  to authenticated;

notify pgrst, 'reload schema';
