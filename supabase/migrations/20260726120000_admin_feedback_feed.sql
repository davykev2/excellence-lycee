-- Flux de notifications pour l'administration : réactions et commentaires
-- déposés par les élèves sur les niveaux publiés, agrégés et triés par date.
--
-- Réservé aux rôles admin et content_editor. Les clients passent par cette
-- fonction (aucun accès direct aux tables mastery_lesson_*).

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
  -- NE PAS renommer en `current_role` : c'est un mot-clé réservé de PostgreSQL
  -- (rôle de session, ex. « authenticated ») qui casserait le test de rôle ci-dessous.
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

revoke all on function public.get_admin_mastery_feedback_feed(integer) from public, anon;
grant execute on function public.get_admin_mastery_feedback_feed(integer) to authenticated;

notify pgrst, 'reload schema';
