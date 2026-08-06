-- Administrateur suprême, annuaire d'administration et statut de connexion.
--
-- Trois besoins :
--  1. distinguer le porteur du projet des administrateurs qu'il nomme ;
--  2. lui permettre de filtrer les comptes et de voir qui est en ligne ;
--  3. garantir que les administrateurs nommés ne voient pas SA connectivité.
--
-- Le point 3 ne peut pas être tenu côté API seule : un administrateur possède un
-- jeton valide et pourrait interroger PostgREST directement. Le masquage vit donc
-- dans une fonction `security definer`. C'est déjà solide pour `user_presence`,
-- dont la RLS est active sans aucune politique : la table est inaccessible
-- autrement que par ces fonctions.

alter table public.profiles
  add column if not exists is_owner boolean not null default false;

-- Un seul propriétaire possible, garanti par la base et non par le code.
create unique index if not exists profiles_single_owner_idx
  on public.profiles (is_owner) where is_owner;

-- Aucune fonction n'expose l'écriture de `is_owner` : le drapeau ne se pose que
-- par migration. Un administrateur ne peut donc ni se l'attribuer ni le retirer.
-- Compte du porteur du projet, confirmé par lui le 05/08/2026 : « Davy ».
-- Attention à ne pas le confondre avec « Davy 2 » (kroukevin01@gmail.com), un
-- second compte administrateur qui ne doit PAS porter le drapeau.
update public.profiles set is_owner = false
where is_owner and lower(email) <> 'strober373@gmail.com';

update public.profiles set is_owner = true
where lower(email) = 'strober373@gmail.com';

create or replace function public.is_platform_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select profile.is_owner from public.profiles profile where profile.id = auth.uid()), false);
$$;

/* ---------------------------------------------------------------------------
 * Annuaire d'administration : profils, présence et masquage.
 * ------------------------------------------------------------------------ */

create or replace function public.get_admin_user_directory()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  -- Jamais `current_role` : mot-clé réservé de PostgreSQL.
  v_role text;
  v_viewer_is_owner boolean;
  directory jsonb;
begin
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select coalesce(profile.role, 'student'), coalesce(profile.is_owner, false)
  into v_role, v_viewer_is_owner
  from public.profiles profile
  where profile.id = current_user_id;

  if v_role <> 'admin' then
    raise exception 'Accès réservé à l''administration.' using errcode = '42501';
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', target.id,
        'email', target.email,
        'name', target.name,
        'role', target.role,
        'accountType', target.account_type,
        'levelId', target.level_id,
        'photoUrl', target.photo_url,
        'createdAt', target.created_at,
        'updatedAt', target.updated_at,
        'isOwner', target.is_owner,
        -- Le cœur de la demande : la connectivité du propriétaire ne sort de la
        -- base que pour lui-même. Pour tout autre administrateur, la valeur est
        -- nulle — elle n'est pas seulement cachée à l'affichage, elle n'est
        -- jamais transmise.
        'lastSeenAt', case
          when target.is_owner and not v_viewer_is_owner then null
          else presence.last_seen_at
        end,
        'presenceHidden', target.is_owner and not v_viewer_is_owner
      )
      order by target.created_at desc
    ),
    '[]'::jsonb
  )
  into directory
  from public.profiles target
  left join public.user_presence presence on presence.user_id = target.id;

  return directory;
end;
$$;

/* ---------------------------------------------------------------------------
 * Verrouillage du compte propriétaire.
 * ------------------------------------------------------------------------ */

-- Recréées à l'identique, avec le seul ajout du refus de toucher au compte
-- propriétaire. Sans ce garde-fou, la confidentialité demandée se contournerait
-- en une manipulation : un administrateur retirerait le rôle admin au porteur.
create or replace function public.admin_update_profile_role(p_user_id uuid, p_role text)
returns table(user_id uuid, new_role text, changed_at timestamptz)
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_changed_at timestamptz := now();
  v_target_is_owner boolean;
begin
  if auth.uid() is null or not public.is_platform_admin() then
    raise exception 'Accès administrateur requis.' using errcode = '42501';
  end if;
  if p_role not in ('student', 'teacher', 'content_editor', 'admin') then raise exception 'Rôle invalide.'; end if;
  if p_user_id = auth.uid() and p_role <> 'admin' then
    raise exception 'Tu ne peux pas retirer ton propre accès administrateur.';
  end if;

  select coalesce(profile.is_owner, false) into v_target_is_owner
  from public.profiles profile where profile.id = p_user_id;
  if v_target_is_owner and not public.is_platform_owner() then
    raise exception 'Le compte de l''administrateur suprême ne peut pas être modifié.' using errcode = '42501';
  end if;

  update public.profiles set role = p_role, updated_at = v_changed_at where id = p_user_id;
  if not found then raise exception 'Profil introuvable.' using errcode = 'P0002'; end if;
  insert into public.audit_logs (actor_user_id, action, subject_id, metadata_json)
  values (auth.uid(), 'admin.profile.role.update', p_user_id::text, jsonb_build_object('role', p_role));
  return query select p_user_id, p_role, v_changed_at;
end;
$function$;

create or replace function public.admin_update_profile_level(p_user_id uuid, p_level_id text)
returns table(user_id uuid, new_level_id text, changed_at timestamptz)
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_target_is_owner boolean;
begin
  if auth.uid() is null or not public.is_platform_admin() then
    raise exception 'Accès administrateur requis.' using errcode = '42501';
  end if;

  if p_level_id not in (
    'seconde-a', 'seconde-c',
    'premiere-a', 'premiere-c', 'premiere-d',
    'terminale-a', 'terminale-c', 'terminale-d'
  ) then
    raise exception 'Niveau ou série invalide.' using errcode = '22023';
  end if;

  select coalesce(profile.is_owner, false) into v_target_is_owner
  from public.profiles profile where profile.id = p_user_id;
  if v_target_is_owner and not public.is_platform_owner() then
    raise exception 'Le compte de l''administrateur suprême ne peut pas être modifié.' using errcode = '42501';
  end if;

  return query
    update public.profiles as profile
    set level_id = p_level_id,
        updated_at = now()
    where profile.id = p_user_id
    returning profile.id, profile.level_id, profile.updated_at;

  if not found then
    raise exception 'Profil introuvable.' using errcode = 'P0002';
  end if;

  insert into public.audit_logs (
    actor_user_id,
    action,
    subject_id,
    metadata_json
  ) values (
    auth.uid(),
    'admin.profile.level.update',
    p_user_id::text,
    jsonb_build_object('levelId', p_level_id)
  );
end;
$function$;

revoke all on function public.get_admin_user_directory() from public, anon;
revoke all on function public.is_platform_owner() from public, anon;
grant execute on function public.get_admin_user_directory() to authenticated;
grant execute on function public.is_platform_owner() to authenticated;

notify pgrst, 'reload schema';
