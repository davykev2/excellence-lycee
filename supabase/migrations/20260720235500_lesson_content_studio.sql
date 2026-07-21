-- Excellence Lycée : studio éditorial des niveaux de cours.
-- Les brouillons restent séparés du dernier instantané publié visible par les élèves.

create table if not exists public.lesson_contents (
  id uuid primary key default gen_random_uuid(),
  path_id text not null,
  lesson_id text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'draft'
    check (status in ('draft', 'review', 'published')),
  draft_version integer not null default 1 check (draft_version >= 1),
  published_version integer check (published_version is null or published_version >= 1),
  published_payload jsonb,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  unique (path_id, lesson_id),
  check ((published_payload is null) = (published_version is null)),
  check ((published_payload is null) = (published_at is null))
);

create index if not exists lesson_contents_status_idx
  on public.lesson_contents(status, updated_at desc);

create table if not exists public.lesson_content_revisions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.lesson_contents(id) on delete cascade,
  version integer not null check (version >= 1),
  payload jsonb not null,
  note text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (document_id, version)
);

create index if not exists lesson_content_revisions_document_idx
  on public.lesson_content_revisions(document_id, version desc);

drop trigger if exists lesson_contents_set_updated_at on public.lesson_contents;
create trigger lesson_contents_set_updated_at
  before update on public.lesson_contents
  for each row execute procedure public.set_updated_at();

create or replace function public.can_manage_content()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'content_editor')
  );
$$;

-- Les élèves ne lisent jamais directement la ligne éditoriale : cette fonction
-- ne renvoie que l'instantané publié et protège ainsi les brouillons en cours.
create or replace function public.get_published_lesson_contents()
returns table (
  path_id text,
  lesson_id text,
  published_payload jsonb,
  published_version integer,
  published_at timestamptz
)
language sql
stable
security definer set search_path = ''
as $$
  select
    contents.path_id,
    contents.lesson_id,
    contents.published_payload,
    contents.published_version,
    contents.published_at
  from public.lesson_contents as contents
  where contents.published_payload is not null
    and contents.published_version is not null
    and contents.published_at is not null
  order by contents.published_at desc;
$$;

alter table public.lesson_contents enable row level security;
alter table public.lesson_content_revisions enable row level security;

revoke all on table public.lesson_contents from anon, authenticated;
revoke all on table public.lesson_content_revisions from anon, authenticated;

grant select on table public.lesson_contents to authenticated;
grant insert (path_id, lesson_id, payload, status, draft_version, created_by, updated_by, created_at, updated_at)
  on table public.lesson_contents to authenticated;
grant update (payload, status, draft_version, published_version, published_payload, updated_by, updated_at, published_at)
  on table public.lesson_contents to authenticated;
grant select on table public.lesson_content_revisions to authenticated;
grant insert (document_id, version, payload, note, created_by, created_at)
  on table public.lesson_content_revisions to authenticated;

revoke all on function public.can_manage_content() from public, anon;
grant execute on function public.can_manage_content() to authenticated;
revoke all on function public.get_published_lesson_contents() from public, anon;
grant execute on function public.get_published_lesson_contents() to authenticated;

drop policy if exists "lesson_contents_select_published_or_manager" on public.lesson_contents;
drop policy if exists "lesson_contents_select_manager" on public.lesson_contents;
create policy "lesson_contents_select_manager"
  on public.lesson_contents for select to authenticated
  using ((select public.can_manage_content()));

drop policy if exists "lesson_contents_insert_manager" on public.lesson_contents;
create policy "lesson_contents_insert_manager"
  on public.lesson_contents for insert to authenticated
  with check (
    (select public.can_manage_content())
    and created_by = (select auth.uid())
    and updated_by = (select auth.uid())
  );

drop policy if exists "lesson_contents_update_manager" on public.lesson_contents;
create policy "lesson_contents_update_manager"
  on public.lesson_contents for update to authenticated
  using ((select public.can_manage_content()))
  with check (
    (select public.can_manage_content())
    and updated_by = (select auth.uid())
  );

drop policy if exists "lesson_content_revisions_select_manager" on public.lesson_content_revisions;
create policy "lesson_content_revisions_select_manager"
  on public.lesson_content_revisions for select to authenticated
  using ((select public.can_manage_content()));

drop policy if exists "lesson_content_revisions_insert_manager" on public.lesson_content_revisions;
create policy "lesson_content_revisions_insert_manager"
  on public.lesson_content_revisions for insert to authenticated
  with check (
    (select public.can_manage_content())
    and created_by = (select auth.uid())
  );
