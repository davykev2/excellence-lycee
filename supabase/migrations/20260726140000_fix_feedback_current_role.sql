-- Correctif : `current_role` est un mot-clé réservé de PostgreSQL (rôle de
-- session, ex. « authenticated »), pas le rôle applicatif. Utilisé comme nom de
-- variable dans les fonctions de feedback, il faussait les contrôles de rôle :
--  - get_mastery_lesson_feedback : canDelete = false pour un admin sur le
--    commentaire d'un autre élève ;
--  - delete_mastery_lesson_comment : un admin ne pouvait pas supprimer le
--    commentaire d'un autre élève (le OR v_role = 'admin' n'était jamais vrai).
-- Les deux fonctions sont recréées avec la variable renommée `v_role`.

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
          'canDelete', recent.author_user_id = current_user_id or v_role = 'admin'
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
  v_role text;
  affected_count integer;
begin
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select profile.role
  into v_role
  from public.profiles profile
  where profile.id = current_user_id;

  delete from public.mastery_lesson_comments comment
  where comment.id = p_comment_id
    and (
      comment.author_user_id = current_user_id
      or v_role = 'admin'
    );

  get diagnostics affected_count = row_count;
  return affected_count = 1;
end;
$$;

notify pgrst, 'reload schema';
