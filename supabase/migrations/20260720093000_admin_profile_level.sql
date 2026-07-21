-- Excellence Lycée: modification sécurisée du niveau d'un profil par un administrateur.

create or replace function public.admin_update_profile_level(
  p_user_id uuid,
  p_level_id text
)
returns table (
  user_id uuid,
  new_level_id text,
  changed_at timestamptz
)
language plpgsql
security definer set search_path = ''
as $$
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
$$;

revoke all on function public.admin_update_profile_level(uuid, text) from public, anon;
grant execute on function public.admin_update_profile_level(uuid, text) to authenticated;
