-- Suppression de message = suppression réelle, sans laisser de trace
-- (« Message supprimé »). Les fonctions passent d'un soft delete (deleted_at)
-- à un hard delete. La clé étrangère reply_to_id est `on delete set null`,
-- donc supprimer un message ne casse pas les réponses (elles perdent juste leur
-- citation). Les fonctions d'affichage conservent leur branche deleted_at, mais
-- elle ne se déclenchera plus puisque plus aucune ligne n'est marquée supprimée.

-- Messages privés : hard delete.
create or replace function public.delete_own_message(p_message_id uuid)
returns boolean
language plpgsql
security definer set search_path = ''
as $$
declare
  affected_thread uuid;
begin
  delete from public.messages
  where id = p_message_id and sender_id = (select auth.uid())
  returning thread_id into affected_thread;
  if affected_thread is not null then
    update public.message_threads set updated_at = now() where id = affected_thread;
    insert into public.audit_logs (actor_user_id, action, subject_id)
    values ((select auth.uid()), 'message.delete', p_message_id::text);
  end if;
  return affected_thread is not null;
end;
$$;

-- Salon global : hard delete (l'auteur, ou un admin en modération).
create or replace function public.delete_global_message(p_message_id uuid)
returns boolean
language plpgsql
security definer set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  actor_role text;
  affected integer;
begin
  select role into actor_role from public.profiles where id = actor_id;
  delete from public.global_messages
  where id = p_message_id
    and (sender_id = actor_id or actor_role = 'admin');
  get diagnostics affected = row_count;
  if affected = 1 then
    insert into public.audit_logs (actor_user_id, action, subject_id)
    values (actor_id, 'message.global.delete', p_message_id::text);
    return true;
  end if;
  return false;
end;
$$;

-- Purge des traces existantes : les messages déjà « soft supprimés » (qui
-- s'affichaient encore comme « Message supprimé ») sont retirés définitivement.
delete from public.messages where deleted_at is not null;
delete from public.global_messages where deleted_at is not null;

notify pgrst, 'reload schema';
