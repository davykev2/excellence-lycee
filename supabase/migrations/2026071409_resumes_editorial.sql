-- ============================================================================
-- EXCELLENCE LYCÉE — atelier éditorial des résumés
-- Brouillons privés, historique immuable, publication atomique et suivi des
-- commentaires. Cette migration suppose 2026071301 déjà appliquée.
-- ============================================================================

begin;

-- La colonne `resume` reste exclusivement la version visible par les élèves.
alter table public.chapitres
  add column if not exists resume_revision bigint not null default 0,
  add column if not exists resume_updated_at timestamptz,
  add column if not exists resume_updated_by uuid references public.profiles(id) on delete set null;

alter table public.chapitres drop constraint if exists chapitres_resume_revision_positive;
alter table public.chapitres
  add constraint chapitres_resume_revision_positive check (resume_revision >= 0);

-- Les résumés déjà publiés deviennent la révision initiale sans modifier leur
-- contenu ni leur état de publication.
update public.chapitres
set
  resume_revision = 1,
  resume_updated_at = coalesce(resume_updated_at, created_at)
where resume_revision = 0
  and resume_published = true
  and nullif(btrim(resume), '') is not null;

create table if not exists public.resume_brouillons (
  chapitre_id uuid primary key references public.chapitres(id) on delete cascade,
  contenu text not null default '',
  base_revision bigint not null default 0 check (base_revision >= 0),
  revision bigint not null default 0 check (revision >= 0),
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- Un ancien résumé non publié était jusque-là conservé dans la colonne live,
-- donc techniquement lisible via l'API dès que le chapitre était public. Il
-- devient un vrai brouillon privé avant d'être retiré de la ligne élève.
insert into public.resume_brouillons (
  chapitre_id,
  contenu,
  base_revision,
  revision,
  updated_by,
  updated_at
)
select
  c.id,
  c.resume,
  0,
  1,
  c.resume_updated_by,
  coalesce(c.resume_updated_at, c.created_at, now())
from public.chapitres c
where c.resume_published = false
  and nullif(btrim(c.resume), '') is not null
on conflict (chapitre_id) do nothing;

update public.chapitres
set
  resume = '',
  resume_revision = 0,
  resume_updated_at = null,
  resume_updated_by = null
where resume_published = false
  and nullif(btrim(resume), '') is not null;

create table if not exists public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  chapitre_id uuid not null references public.chapitres(id) on delete cascade,
  revision bigint not null check (revision > 0),
  contenu text not null,
  published_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz not null default now(),
  unique (chapitre_id, revision)
);

create index if not exists idx_resume_versions_chapitre
  on public.resume_versions(chapitre_id, revision desc);

-- Le texte original du commentaire reste immuable. Seul ce suivi éditorial,
-- invisible aux élèves, peut être modifié par un administrateur.
create table if not exists public.lecon_commentaire_suivi (
  commentaire_id uuid primary key references public.lecon_commentaires(id) on delete cascade,
  statut text not null default 'nouveau' check (statut in ('nouveau', 'traite', 'ignore')),
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- Conserver une première version restaurable de chaque résumé historique.
insert into public.resume_versions (
  chapitre_id,
  revision,
  contenu,
  published_by,
  published_at
)
select
  c.id,
  c.resume_revision,
  c.resume,
  c.resume_updated_by,
  coalesce(c.resume_updated_at, c.created_at, now())
from public.chapitres c
where c.resume_revision > 0
  and c.resume_published = true
  and nullif(btrim(c.resume), '') is not null
on conflict (chapitre_id, revision) do nothing;

-- ---------------------------------------------------------------------------
-- RLS : aucun brouillon, historique ou statut interne n'est exposé aux élèves.
-- ---------------------------------------------------------------------------

alter table public.resume_brouillons enable row level security;
alter table public.resume_versions enable row level security;
alter table public.lecon_commentaire_suivi enable row level security;

drop policy if exists "resume_brouillons_admin" on public.resume_brouillons;
create policy "resume_brouillons_admin" on public.resume_brouillons
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "resume_versions_admin_read" on public.resume_versions;
create policy "resume_versions_admin_read" on public.resume_versions
  for select using (public.is_admin());

drop policy if exists "lecon_commentaire_suivi_admin" on public.lecon_commentaire_suivi;
create policy "lecon_commentaire_suivi_admin" on public.lecon_commentaire_suivi
  for all using (public.is_admin()) with check (public.is_admin());

revoke all on public.resume_brouillons, public.resume_versions, public.lecon_commentaire_suivi
  from anon, authenticated;
grant select, insert, update, delete on public.resume_brouillons, public.lecon_commentaire_suivi
  to authenticated;
grant select on public.resume_versions to authenticated;

-- ---------------------------------------------------------------------------
-- Lecture de l'atelier. Au premier accès, le live est copié dans un brouillon
-- privé afin que les résumés existants soient immédiatement modifiables.
-- ---------------------------------------------------------------------------

create or replace function public.get_resume_admin(p_chapitre_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_chapitre public.chapitres%rowtype;
  v_result jsonb;
begin
  if v_uid is null then
    raise exception 'auth_required';
  end if;
  if not public.is_admin() then
    raise exception 'admin_required';
  end if;

  select * into v_chapitre
  from public.chapitres
  where id = p_chapitre_id;

  if not found then
    raise exception 'chapitre_introuvable';
  end if;

  insert into public.resume_brouillons (
    chapitre_id,
    contenu,
    base_revision,
    revision,
    updated_by
  )
  values (
    v_chapitre.id,
    coalesce(v_chapitre.resume, ''),
    v_chapitre.resume_revision,
    0,
    v_uid
  )
  on conflict (chapitre_id) do nothing;

  select jsonb_build_object(
    'chapitre_id', c.id,
    'titre', c.titre,
    'description', c.description,
    'ordre', c.ordre,
    'chapitre_published', c.published,
    'resume_published', c.resume_published,
    'contenu_publie', coalesce(c.resume, ''),
    'revision', c.resume_revision,
    'resume_updated_at', c.resume_updated_at,
    'brouillon', jsonb_build_object(
      'contenu', b.contenu,
      'base_revision', b.base_revision,
      'revision', b.revision,
      'updated_at', b.updated_at
    ),
    'versions', coalesce((
      select jsonb_agg(v.obj order by v.revision desc)
      from (
        select
          rv.revision,
          jsonb_build_object(
            'revision', rv.revision,
            'contenu', rv.contenu,
            'published_at', rv.published_at,
            'published_by', rv.published_by,
            'published_by_username', p.username
          ) as obj
        from public.resume_versions rv
        left join public.profiles p on p.id = rv.published_by
        where rv.chapitre_id = c.id
        order by rv.revision desc
        limit 20
      ) v
    ), '[]'::jsonb),
    'commentaires', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', lc.id,
          'user_id', lc.user_id,
          'contenu', lc.contenu,
          'created_at', lc.created_at,
          'username', p.username,
          'avatar_url', p.avatar_url,
          'statut', coalesce(s.statut, 'nouveau'),
          'statut_updated_at', s.updated_at
        )
        order by lc.created_at desc
      )
      from public.lecon_commentaires lc
      left join public.profiles p on p.id = lc.user_id
      left join public.lecon_commentaire_suivi s on s.commentaire_id = lc.id
      where lc.chapitre_id = c.id
    ), '[]'::jsonb)
  ) into v_result
  from public.chapitres c
  join public.resume_brouillons b on b.chapitre_id = c.id
  where c.id = p_chapitre_id;

  return v_result;
end;
$$;

-- Sauvegarde privée avec contrôle de la version live ET de la version du
-- brouillon : deux onglets administrateur ne peuvent pas s'écraser en silence.
create or replace function public.sauvegarder_brouillon_resume_admin(
  p_chapitre_id uuid,
  p_contenu text,
  p_revision_attendue bigint,
  p_brouillon_revision_attendue bigint
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_live_revision bigint;
  v_base_revision bigint;
  v_brouillon_revision bigint;
  v_updated_at timestamptz;
begin
  if v_uid is null then
    raise exception 'auth_required';
  end if;
  if not public.is_admin() then
    raise exception 'admin_required';
  end if;
  if octet_length(coalesce(p_contenu, '')) > 2097152 then
    raise exception 'contenu_trop_volumineux';
  end if;

  select resume_revision into v_live_revision
  from public.chapitres
  where id = p_chapitre_id
  for update;

  if not found then
    raise exception 'chapitre_introuvable';
  end if;
  if p_revision_attendue is distinct from v_live_revision then
    raise exception 'resume_revision_conflit';
  end if;

  select base_revision, revision
  into v_base_revision, v_brouillon_revision
  from public.resume_brouillons
  where chapitre_id = p_chapitre_id
  for update;

  if not found then
    if coalesce(p_brouillon_revision_attendue, 0) <> 0 then
      raise exception 'brouillon_revision_conflit';
    end if;
    insert into public.resume_brouillons (
      chapitre_id,
      contenu,
      base_revision,
      revision,
      updated_by,
      updated_at
    ) values (
      p_chapitre_id,
      coalesce(p_contenu, ''),
      v_live_revision,
      1,
      v_uid,
      now()
    )
    returning base_revision, revision, updated_at
    into v_base_revision, v_brouillon_revision, v_updated_at;
  else
    if v_base_revision <> v_live_revision then
      raise exception 'resume_revision_conflit';
    end if;
    if p_brouillon_revision_attendue is distinct from v_brouillon_revision then
      raise exception 'brouillon_revision_conflit';
    end if;

    update public.resume_brouillons
    set
      contenu = coalesce(p_contenu, ''),
      revision = revision + 1,
      updated_by = v_uid,
      updated_at = now()
    where chapitre_id = p_chapitre_id
    returning base_revision, revision, updated_at
    into v_base_revision, v_brouillon_revision, v_updated_at;
  end if;

  return jsonb_build_object(
    'chapitre_id', p_chapitre_id,
    'base_revision', v_base_revision,
    'brouillon_revision', v_brouillon_revision,
    'updated_at', v_updated_at
  );
end;
$$;

-- Publication transactionnelle : la nouvelle version live, son historique et
-- le brouillon synchronisé sont validés ensemble ou pas du tout.
create or replace function public.publier_resume_admin(
  p_chapitre_id uuid,
  p_contenu text,
  p_revision_attendue bigint,
  p_brouillon_revision_attendue bigint
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_live_revision bigint;
  v_base_revision bigint;
  v_brouillon_revision bigint;
  v_nouvelle_revision bigint;
  v_published_at timestamptz := now();
begin
  if v_uid is null then
    raise exception 'auth_required';
  end if;
  if not public.is_admin() then
    raise exception 'admin_required';
  end if;
  if nullif(btrim(coalesce(p_contenu, '')), '') is null then
    raise exception 'resume_vide';
  end if;
  if octet_length(coalesce(p_contenu, '')) > 2097152 then
    raise exception 'contenu_trop_volumineux';
  end if;

  select resume_revision into v_live_revision
  from public.chapitres
  where id = p_chapitre_id
  for update;

  if not found then
    raise exception 'chapitre_introuvable';
  end if;
  if p_revision_attendue is distinct from v_live_revision then
    raise exception 'resume_revision_conflit';
  end if;

  select base_revision, revision
  into v_base_revision, v_brouillon_revision
  from public.resume_brouillons
  where chapitre_id = p_chapitre_id
  for update;

  if not found then
    if coalesce(p_brouillon_revision_attendue, 0) <> 0 then
      raise exception 'brouillon_revision_conflit';
    end if;
    v_base_revision := v_live_revision;
    v_brouillon_revision := 0;
  end if;

  if v_base_revision <> v_live_revision then
    raise exception 'resume_revision_conflit';
  end if;
  if p_brouillon_revision_attendue is distinct from v_brouillon_revision then
    raise exception 'brouillon_revision_conflit';
  end if;

  v_nouvelle_revision := v_live_revision + 1;

  insert into public.resume_versions (
    chapitre_id,
    revision,
    contenu,
    published_by,
    published_at
  ) values (
    p_chapitre_id,
    v_nouvelle_revision,
    p_contenu,
    v_uid,
    v_published_at
  );

  update public.chapitres
  set
    resume = p_contenu,
    resume_published = true,
    resume_revision = v_nouvelle_revision,
    resume_updated_by = v_uid,
    resume_updated_at = v_published_at
  where id = p_chapitre_id;

  insert into public.resume_brouillons (
    chapitre_id,
    contenu,
    base_revision,
    revision,
    updated_by,
    updated_at
  ) values (
    p_chapitre_id,
    p_contenu,
    v_nouvelle_revision,
    v_brouillon_revision + 1,
    v_uid,
    v_published_at
  )
  on conflict (chapitre_id) do update
  set
    contenu = excluded.contenu,
    base_revision = excluded.base_revision,
    revision = excluded.revision,
    updated_by = excluded.updated_by,
    updated_at = excluded.updated_at;

  return jsonb_build_object(
    'chapitre_id', p_chapitre_id,
    'revision', v_nouvelle_revision,
    'brouillon_revision', v_brouillon_revision + 1,
    'published_at', v_published_at
  );
end;
$$;

create or replace function public.changer_statut_commentaire_resume_admin(
  p_commentaire_id uuid,
  p_statut text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_updated_at timestamptz := now();
begin
  if v_uid is null then
    raise exception 'auth_required';
  end if;
  if not public.is_admin() then
    raise exception 'admin_required';
  end if;
  if p_statut not in ('nouveau', 'traite', 'ignore') then
    raise exception 'statut_commentaire_invalide';
  end if;
  if not exists (
    select 1 from public.lecon_commentaires where id = p_commentaire_id
  ) then
    raise exception 'commentaire_introuvable';
  end if;

  insert into public.lecon_commentaire_suivi (
    commentaire_id,
    statut,
    updated_by,
    updated_at
  ) values (
    p_commentaire_id,
    p_statut,
    v_uid,
    v_updated_at
  )
  on conflict (commentaire_id) do update
  set
    statut = excluded.statut,
    updated_by = excluded.updated_by,
    updated_at = excluded.updated_at;

  return jsonb_build_object(
    'commentaire_id', p_commentaire_id,
    'statut', p_statut,
    'updated_at', v_updated_at
  );
end;
$$;

revoke all on function public.get_resume_admin(uuid) from public, anon;
revoke all on function public.sauvegarder_brouillon_resume_admin(uuid, text, bigint, bigint) from public, anon;
revoke all on function public.publier_resume_admin(uuid, text, bigint, bigint) from public, anon;
revoke all on function public.changer_statut_commentaire_resume_admin(uuid, text) from public, anon;

grant execute on function public.get_resume_admin(uuid) to authenticated;
grant execute on function public.sauvegarder_brouillon_resume_admin(uuid, text, bigint, bigint) to authenticated;
grant execute on function public.publier_resume_admin(uuid, text, bigint, bigint) to authenticated;
grant execute on function public.changer_statut_commentaire_resume_admin(uuid, text) to authenticated;

notify pgrst, 'reload schema';

commit;
