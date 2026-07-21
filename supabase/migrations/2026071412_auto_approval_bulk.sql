-- EXCELLENCE LYCEE - Approbation automatique et actions admin groupees

begin;

-- Tous les profils crees a l'avenir sont approuves par defaut. Le trigger
-- d'inscription fixe aussi explicitement la valeur afin qu'une metadata client
-- ne puisse ni desactiver ni influencer cette decision serveur.
alter table public.profiles
  alter column approuve set default true;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.profiles (
    id, username, avatar_url, niveau_id, serie_id, etablissement, approuve
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url',
    nullif(new.raw_user_meta_data ->> 'niveau_id', '')::uuid,
    nullif(new.raw_user_meta_data ->> 'serie_id', '')::uuid,
    new.raw_user_meta_data ->> 'etablissement',
    true
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Une seule RPC couvre les deux actions de masse. Elle ne touche jamais les
-- administrateurs. La desapprobation exclut en plus explicitement le demandeur,
-- meme si cette protection est deja impliquee par son statut administrateur.
create or replace function public.set_approbation_utilisateurs_admin_v1(
  p_approuve boolean
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_caller_id uuid := auth.uid();
  v_is_admin boolean;
  v_eligible_count integer := 0;
  v_updated_count integer := 0;
  v_approved_count integer := 0;
  v_pending_count integer := 0;
begin
  if v_caller_id is null then raise exception 'auth_required'; end if;
  if p_approuve is null then raise exception 'statut_approbation_requis'; end if;

  select p.is_admin into v_is_admin
  from public.profiles p
  where p.id = v_caller_id
  for share of p;

  if not coalesce(v_is_admin, false) then raise exception 'admin_required'; end if;

  select count(*)::integer into v_eligible_count
  from public.profiles p
  where p.is_admin = false
    and p.approuve is distinct from p_approuve
    and (p_approuve or p.id <> v_caller_id);

  update public.profiles p
  set approuve = p_approuve,
      updated_at = clock_timestamp()
  where p.is_admin = false
    and p.approuve is distinct from p_approuve
    and (p_approuve or p.id <> v_caller_id);

  get diagnostics v_updated_count = row_count;

  select
    (count(*) filter (where p.approuve))::integer,
    (count(*) filter (where not p.approuve))::integer
  into v_approved_count, v_pending_count
  from public.profiles p
  where p.is_admin = false;

  return jsonb_build_object(
    'action', case when p_approuve then 'approve_all' else 'disapprove_all' end,
    'requested_status', p_approuve,
    'eligible_count', v_eligible_count,
    'updated_count', v_updated_count,
    'approved_count', v_approved_count,
    'pending_count', v_pending_count
  );
end;
$$;

-- Le trigger est prive; seule la RPC groupee est appelee depuis l'interface.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.set_approbation_utilisateurs_admin_v1(boolean)
  from public, anon, authenticated;
grant execute on function public.set_approbation_utilisateurs_admin_v1(boolean)
  to authenticated;

notify pgrst, 'reload schema';

commit;
