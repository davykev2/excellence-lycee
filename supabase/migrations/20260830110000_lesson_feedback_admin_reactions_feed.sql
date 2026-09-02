-- Distingue les réactions de l'administration des réactions de la communauté
-- et réserve la cloche « Courrier des élèves » aux comptes élèves réels.

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
            -- Ces compteurs alimentent les boutons de la communauté. Une
            -- réaction admin n'y est jamais répétée : elle vit uniquement
            -- dans adminCounts et dans le badge Administration du Web.
            'counts', jsonb_build_object(
              'like', (
                select count(*)::integer
                from public.mastery_lesson_comment_reactions item
                join public.profiles reactor on reactor.id = item.user_id
                where item.comment_id = recent.id
                  and item.reaction = 'like'
                  and reactor.role <> 'admin'
              ),
              'love', (
                select count(*)::integer
                from public.mastery_lesson_comment_reactions item
                join public.profiles reactor on reactor.id = item.user_id
                where item.comment_id = recent.id
                  and item.reaction = 'love'
                  and reactor.role <> 'admin'
              ),
              'helpful', (
                select count(*)::integer
                from public.mastery_lesson_comment_reactions item
                join public.profiles reactor on reactor.id = item.user_id
                where item.comment_id = recent.id
                  and item.reaction = 'helpful'
                  and reactor.role <> 'admin'
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
        'authorName', profile.name,
        'authorPhotoUrl', profile.photo_url,
        'authorRole', profile.role,
        'body', comment.body,
        'createdAt', comment.created_at
      ) as item,
      comment.created_at as item_created_at
    from public.mastery_lesson_comments comment
    join public.profiles profile on profile.id = comment.author_user_id
    where profile.role = 'student'
      and profile.account_type = 'student'

    union all

    select
      jsonb_build_object(
        'kind', 'reaction',
        'id', reaction.user_id::text || ':' || reaction.path_id || ':' || reaction.lesson_id,
        'pathId', reaction.path_id,
        'lessonId', reaction.lesson_id,
        'authorId', reaction.user_id,
        'authorName', profile.name,
        'authorPhotoUrl', profile.photo_url,
        'authorRole', profile.role,
        'reaction', reaction.reaction,
        'createdAt', greatest(reaction.created_at, reaction.updated_at)
      ) as item,
      greatest(reaction.created_at, reaction.updated_at) as item_created_at
    from public.mastery_lesson_reactions reaction
    join public.profiles profile on profile.id = reaction.user_id
    where profile.role = 'student'
      and profile.account_type = 'student'

    union all

    select
      jsonb_build_object(
        'kind', 'comment_reaction',
        'id', reaction.user_id::text || ':' || reaction.comment_id::text,
        'pathId', comment.path_id,
        'lessonId', comment.lesson_id,
        'authorId', reaction.user_id,
        'authorName', profile.name,
        'authorPhotoUrl', profile.photo_url,
        'authorRole', profile.role,
        'reaction', reaction.reaction,
        'commentId', comment.id,
        'commentBody', comment.body,
        'commentAuthorName', coalesce(comment_author.name, 'Utilisateur supprimé'),
        'createdAt', greatest(reaction.created_at, reaction.updated_at)
      ) as item,
      greatest(reaction.created_at, reaction.updated_at) as item_created_at
    from public.mastery_lesson_comment_reactions reaction
    join public.mastery_lesson_comments comment on comment.id = reaction.comment_id
    join public.profiles profile on profile.id = reaction.user_id
    left join public.profiles comment_author on comment_author.id = comment.author_user_id
    where profile.role = 'student'
      and profile.account_type = 'student'
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

revoke all on function public.get_mastery_lesson_feedback(text, text)
  from public, anon;
grant execute on function public.get_mastery_lesson_feedback(text, text)
  to authenticated;

revoke all on function public.get_admin_mastery_feedback_feed(integer)
  from public, anon;
grant execute on function public.get_admin_mastery_feedback_feed(integer)
  to authenticated;

notify pgrst, 'reload schema';
