-- ============================================================================
-- Editeur admin des exercices guides
--
-- Le navigateur transmet uniquement le chapitre, un identifiant idempotent de
-- publication et les trois niveaux. Toute la cible et la provenance interne
-- sont reconstruites cote serveur, puis l'importeur v2 effectue ses controles
-- transactionnels habituels.
-- ============================================================================

begin;

create or replace function public.publier_exercices_admin_v2(
  p_chapitre_id uuid,
  p_publication_id uuid,
  p_levels jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_meta record;
  v_chapitre_code text;
  v_lot jsonb;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  if not public.is_admin() then
    raise exception 'admin_required';
  end if;

  if p_chapitre_id is null or p_publication_id is null then
    raise exception 'identifiant_publication_requis';
  end if;

  if coalesce(jsonb_typeof(p_levels), 'null') <> 'array' then
    raise exception 'contenu_invalide';
  end if;

  if coalesce(pg_column_size(p_levels), 0) > 1048576 then
    raise exception 'contenu_trop_volumineux';
  end if;

  select
    c.code as chapitre_code,
    c.titre as chapitre_titre,
    c.ordre as chapitre_ordre,
    n.nom as niveau,
    s.nom as serie,
    m.slug as matiere_slug
  into v_meta
  from public.chapitres c
  join public.matieres m on m.id = c.matiere_id
  join public.series s on s.id = c.serie_id
  join public.niveaux n on n.id = s.niveau_id
  where c.id = p_chapitre_id
  for update of c;

  if not found then
    raise exception 'chapitre_introuvable';
  end if;

  v_chapitre_code := coalesce(
    nullif(btrim(v_meta.chapitre_code), ''),
    'ADMIN-' || upper(replace(p_chapitre_id::text, '-', ''))
  );

  update public.chapitres
  set code = v_chapitre_code
  where id = p_chapitre_id
    and nullif(btrim(code), '') is null;

  v_lot := jsonb_build_object(
    'schema_version', 2,
    'batch_code',
      'admin-v2:' || p_chapitre_id::text || ':' || p_publication_id::text,
    'status', 'reviewed',
    'target', jsonb_build_object(
      'chapitre_id', p_chapitre_id,
      'chapitre_code', v_chapitre_code,
      'niveau', v_meta.niveau,
      'serie', v_meta.serie,
      'matiere_slug', v_meta.matiere_slug,
      'chapitre_ordre', v_meta.chapitre_ordre,
      'chapitre_titre', v_meta.chapitre_titre
    ),
    'source', jsonb_build_object(
      'code', 'ADMIN-EDITOR-' || upper(replace(p_chapitre_id::text, '-', '')),
      'titre', 'Saisie manuelle admin - ' || v_meta.chapitre_titre,
      'type', 'autre',
      'auteur_organisme', 'Administration EXCELLENCE',
      'url', null,
      'licence_code', null,
      'licence_url', null,
      'attribution', null,
      'droits_statut', 'permission',
      'storage_path', null,
      'sha256', null,
      'locator', 'Editeur admin des exercices guides',
      'notes', 'Contenu saisi et relu manuellement dans l administration.'
    ),
    'levels', p_levels
  );

  return public.importer_lot_exercices_v2(v_lot);
end;
$$;

revoke all on function public.publier_exercices_admin_v2(uuid, uuid, jsonb)
  from public, anon;
grant execute on function public.publier_exercices_admin_v2(uuid, uuid, jsonb)
  to authenticated;

notify pgrst, 'reload schema';

commit;

