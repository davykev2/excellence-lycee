-- Excellence Lycée : studio collaboratif des exercices de l'Arène.
-- Un contributeur prépare ses brouillons, l'administrateur reste le seul à publier.

create or replace function public.is_content_manager()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('content_editor', 'admin')
  );
$$;

create table if not exists public.arena_exercise_levels (
  id uuid primary key default gen_random_uuid(),
  level_id text not null check (level_id ~ '^(seconde|premiere|terminale)-(a|c|d)$'),
  subject_id text not null check (subject_id in (
    'mathematics', 'physics-chemistry', 'french', 'english', 'svt', 'philosophy', 'history-geography'
  )),
  lesson_key text not null check (lesson_key ~ '^[a-z0-9-]{3,180}$'),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  stage_number integer not null check (stage_number between 1 and 99),
  payload jsonb not null,
  status text not null default 'draft' check (status in ('draft', 'review', 'published')),
  draft_version integer not null default 1 check (draft_version > 0),
  published_version integer,
  published_payload jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  unique (level_id, subject_id, lesson_key, difficulty, stage_number)
);

create index if not exists arena_exercise_levels_target_idx
  on public.arena_exercise_levels(level_id, subject_id, lesson_key, difficulty, stage_number);
create index if not exists arena_exercise_levels_status_idx
  on public.arena_exercise_levels(status, updated_at desc);
create index if not exists arena_exercise_levels_author_idx
  on public.arena_exercise_levels(created_by, updated_at desc);

create table if not exists public.arena_exercise_level_revisions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.arena_exercise_levels(id) on delete cascade,
  version integer not null check (version > 0),
  payload jsonb not null,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (document_id, version)
);

create index if not exists arena_exercise_level_revisions_document_idx
  on public.arena_exercise_level_revisions(document_id, version desc);

alter table public.arena_exercise_levels enable row level security;
alter table public.arena_exercise_level_revisions enable row level security;

drop policy if exists "arena_exercise_levels_read" on public.arena_exercise_levels;
create policy "arena_exercise_levels_read" on public.arena_exercise_levels
  for select using (
    -- Le brouillon peut évoluer sans retirer aux élèves la dernière copie publiée.
    published_payload is not null
    or public.is_platform_admin()
    or (public.is_content_manager() and created_by = auth.uid())
  );

drop policy if exists "arena_exercise_level_revisions_read" on public.arena_exercise_level_revisions;
create policy "arena_exercise_level_revisions_read" on public.arena_exercise_level_revisions
  for select using (
    public.is_platform_admin()
    or (
      public.is_content_manager()
      and exists (
        select 1 from public.arena_exercise_levels level
        where level.id = document_id and level.created_by = auth.uid()
      )
    )
  );

revoke all on public.arena_exercise_levels, public.arena_exercise_level_revisions from public, anon;
grant select on public.arena_exercise_levels, public.arena_exercise_level_revisions to authenticated;

create or replace function public.save_arena_exercise_level(
  p_document_id uuid,
  p_payload jsonb,
  p_note text default 'Sauvegarde du brouillon'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_role text;
  v_document public.arena_exercise_levels%rowtype;
  v_document_id uuid;
  v_version integer;
  v_level_id text := btrim(coalesce(p_payload ->> 'levelId', ''));
  v_subject_id text := btrim(coalesce(p_payload ->> 'subjectId', ''));
  v_lesson_key text := btrim(coalesce(p_payload ->> 'lessonKey', ''));
  v_difficulty text := btrim(coalesce(p_payload ->> 'difficulty', ''));
  v_stage_number integer;
  v_exercise jsonb;
begin
  if auth.uid() is null then raise exception 'Authentification requise.' using errcode = '42501'; end if;
  select role into v_actor_role from public.profiles where id = auth.uid();
  if v_actor_role not in ('content_editor', 'admin') then
    raise exception 'Accès à l’atelier d’exercices requis.' using errcode = '42501';
  end if;

  begin
    v_stage_number := (p_payload ->> 'stageNumber')::integer;
  exception when others then
    raise exception 'Numéro de niveau invalide.';
  end;

  if v_level_id !~ '^(seconde|premiere|terminale)-(a|c|d)$'
     or v_subject_id not in ('mathematics', 'physics-chemistry', 'french', 'english', 'svt', 'philosophy', 'history-geography')
     or v_lesson_key !~ '^[a-z0-9-]{3,180}$'
     or v_difficulty not in ('easy', 'medium', 'hard')
     or v_stage_number not between 1 and 99 then
    raise exception 'Cible pédagogique invalide.';
  end if;
  if length(btrim(coalesce(p_payload ->> 'lessonTitle', ''))) not between 2 and 240
     or length(btrim(coalesce(p_payload ->> 'title', ''))) not between 2 and 180
     or length(coalesce(p_payload ->> 'instructionsMarkdown', '')) > 6000 then
    raise exception 'Titre ou consigne invalide.';
  end if;
  if jsonb_typeof(p_payload -> 'exercises') <> 'array'
     or jsonb_array_length(p_payload -> 'exercises') not between 1 and 30 then
    raise exception 'Ajoute entre 1 et 30 exercices.';
  end if;
  for v_exercise in select value from jsonb_array_elements(p_payload -> 'exercises') loop
    if coalesce(v_exercise ->> 'id', '') !~ '^[a-zA-Z0-9-]{4,80}$'
       or length(btrim(coalesce(v_exercise ->> 'title', ''))) not between 2 and 160
       or length(btrim(coalesce(v_exercise ->> 'statementMarkdown', ''))) not between 1 and 25000
       or length(btrim(coalesce(v_exercise ->> 'correctionMarkdown', ''))) not between 1 and 25000 then
      raise exception 'Un exercice est incomplet ou trop long.';
    end if;
  end loop;
  if (
    select count(*) <> count(distinct value ->> 'id')
    from jsonb_array_elements(p_payload -> 'exercises')
  ) then raise exception 'Les identifiants d’exercices doivent être uniques.'; end if;

  if p_document_id is not null then
    select * into v_document from public.arena_exercise_levels where id = p_document_id for update;
  else
    select * into v_document from public.arena_exercise_levels
    where level_id = v_level_id and subject_id = v_subject_id and lesson_key = v_lesson_key
      and difficulty = v_difficulty and stage_number = v_stage_number
    for update;
  end if;

  if p_document_id is not null and v_document.id is null then
    raise exception 'Niveau d’exercices introuvable.' using errcode = 'P0002';
  end if;
  if v_document.id is not null and v_actor_role <> 'admin' and v_document.created_by is distinct from auth.uid() then
    raise exception 'Ce brouillon appartient à un autre contributeur.' using errcode = '42501';
  end if;
  if v_document.id is not null and (
    v_document.level_id <> v_level_id or v_document.subject_id <> v_subject_id
    or v_document.lesson_key <> v_lesson_key or v_document.difficulty <> v_difficulty
    or v_document.stage_number <> v_stage_number
  ) then raise exception 'La cible d’un brouillon existant ne peut pas être déplacée.'; end if;

  if v_document.id is null then
    insert into public.arena_exercise_levels (
      level_id, subject_id, lesson_key, difficulty, stage_number, payload,
      status, draft_version, created_by, updated_by
    ) values (
      v_level_id, v_subject_id, v_lesson_key, v_difficulty, v_stage_number,
      p_payload, 'draft', 1, auth.uid(), auth.uid()
    ) returning id, draft_version into v_document_id, v_version;
  else
    v_version := v_document.draft_version + 1;
    update public.arena_exercise_levels set
      payload = p_payload,
      status = 'draft',
      draft_version = v_version,
      updated_by = auth.uid(),
      updated_at = now()
    where id = v_document.id
    returning id into v_document_id;
  end if;

  insert into public.arena_exercise_level_revisions (document_id, version, payload, note, created_by)
  values (v_document_id, v_version, p_payload, left(nullif(btrim(p_note), ''), 240), auth.uid());
  return v_document_id;
end;
$$;

create or replace function public.set_arena_exercise_level_status(
  p_document_id uuid,
  p_status text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_role text;
  v_document public.arena_exercise_levels%rowtype;
begin
  if auth.uid() is null then raise exception 'Authentification requise.' using errcode = '42501'; end if;
  select role into v_actor_role from public.profiles where id = auth.uid();
  if v_actor_role not in ('content_editor', 'admin') then
    raise exception 'Accès à l’atelier d’exercices requis.' using errcode = '42501';
  end if;
  if p_status not in ('draft', 'review', 'published') then raise exception 'Statut invalide.'; end if;
  select * into v_document from public.arena_exercise_levels where id = p_document_id for update;
  if v_document.id is null then raise exception 'Niveau d’exercices introuvable.' using errcode = 'P0002'; end if;
  if v_actor_role <> 'admin' and v_document.created_by is distinct from auth.uid() then
    raise exception 'Accès refusé.' using errcode = '42501';
  end if;
  if p_status = 'published' and v_actor_role <> 'admin' then
    raise exception 'Seul un administrateur peut publier.' using errcode = '42501';
  end if;

  update public.arena_exercise_levels set
    status = p_status,
    published_payload = case when p_status = 'published' then payload else published_payload end,
    published_version = case when p_status = 'published' then draft_version else published_version end,
    published_at = case when p_status = 'published' then now() else published_at end,
    updated_by = auth.uid(),
    updated_at = now()
  where id = p_document_id;
  return p_document_id;
end;
$$;

create or replace function public.admin_update_profile_role(
  p_user_id uuid,
  p_role text
)
returns table(user_id uuid, new_role text, changed_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_changed_at timestamptz := now();
begin
  if auth.uid() is null or not public.is_platform_admin() then
    raise exception 'Accès administrateur requis.' using errcode = '42501';
  end if;
  if p_role not in ('student', 'teacher', 'content_editor', 'admin') then raise exception 'Rôle invalide.'; end if;
  if p_user_id = auth.uid() and p_role <> 'admin' then
    raise exception 'Tu ne peux pas retirer ton propre accès administrateur.';
  end if;
  update public.profiles set role = p_role, updated_at = v_changed_at where id = p_user_id;
  if not found then raise exception 'Profil introuvable.' using errcode = 'P0002'; end if;
  insert into public.audit_logs (actor_user_id, action, subject_id, metadata_json)
  values (auth.uid(), 'admin.profile.role.update', p_user_id::text, jsonb_build_object('role', p_role));
  return query select p_user_id, p_role, v_changed_at;
end;
$$;

revoke all on function public.is_content_manager() from public, anon;
revoke all on function public.save_arena_exercise_level(uuid, jsonb, text) from public, anon;
revoke all on function public.set_arena_exercise_level_status(uuid, text) from public, anon;
revoke all on function public.admin_update_profile_role(uuid, text) from public, anon;
grant execute on function public.is_content_manager() to authenticated;
grant execute on function public.save_arena_exercise_level(uuid, jsonb, text) to authenticated;
grant execute on function public.set_arena_exercise_level_status(uuid, text) to authenticated;
grant execute on function public.admin_update_profile_role(uuid, text) to authenticated;

notify pgrst, 'reload schema';
