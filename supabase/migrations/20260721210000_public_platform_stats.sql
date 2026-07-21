create or replace function public.get_public_platform_stats()
returns table (
  registered_users bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::bigint
  from public.profiles;
$$;

revoke all on function public.get_public_platform_stats() from public;
grant execute on function public.get_public_platform_stats() to anon, authenticated;

