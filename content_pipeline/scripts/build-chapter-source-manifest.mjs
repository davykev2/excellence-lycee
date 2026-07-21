import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { access, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(SCRIPT_DIR, '..', '..')
const REPORTS_DIR = resolve(REPO_ROOT, 'content_pipeline', 'reports')
const CATALOG_PATH = resolve(REPORTS_DIR, 'archive_catalog.json')
const OFFICIAL_SOURCES_PATH = resolve(REPORTS_DIR, 'official_sources.json')
const JSON_OUTPUT = resolve(REPORTS_DIR, 'chapter_source_manifest.json')
const MARKDOWN_OUTPUT = resolve(REPORTS_DIR, 'chapter_source_manifest.md')
const ENV_PATH = resolve(REPO_ROOT, 'frontend', '.env')

const MATCH_MODES = ['exact_hash', 'shared', 'official_program', 'title_match', 'no_source']
const TITLE_MATCH_THRESHOLD = 0.62
const EXPECTED_PUBLISHED_CHAPTERS = 253

const SUBJECT_BY_SLUG = {
  maths: 'mathematics',
  'physique-chimie': 'physics_chemistry',
  svt: 'svt',
  francais: 'french',
  anglais: 'english',
  'histoire-geo': 'history_geography',
  philosophie: 'philosophy',
  espagnol: 'spanish',
}

function fail(message) {
  throw new Error(message)
}

function assert(condition, message) {
  if (!condition) fail(message)
}

function toPosix(value) {
  return value.split(sep).join('/')
}

function repoRelative(value) {
  return toPosix(relative(REPO_ROOT, value))
}

function catalogPath(catalog, relativePath) {
  return [catalog.archive_root, relativePath].filter(Boolean).join('/').replaceAll('\\', '/')
}

function sourcePath(catalog, source, relativePath) {
  return source.path_scope === 'repo'
    ? relativePath.replaceAll('\\', '/')
    : catalogPath(catalog, relativePath)
}

function filesystemPath(posixPath) {
  return resolve(REPO_ROOT, ...posixPath.split('/'))
}

function parseEnv(content) {
  const values = {}
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (!match) continue
    let value = match[2].trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    values[match[1]] = value
  }
  return values
}

async function loadEnvironment() {
  let values = {}
  try {
    values = parseEnv(await readFile(ENV_PATH, 'utf8'))
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }

  return {
    supabaseUrl: process.env.VITE_SUPABASE_URL || values.VITE_SUPABASE_URL,
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || values.VITE_SUPABASE_ANON_KEY,
  }
}

async function fetchPublicRows(baseUrl, anonKey, table, select) {
  const url = new URL(`/rest/v1/${table}`, baseUrl)
  url.searchParams.set('select', select)
  url.searchParams.set('limit', '1000')
  if (table === 'chapitres') url.searchParams.set('published', 'eq.true')

  const response = await fetch(url, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    fail(`Supabase ${table}: HTTP ${response.status} - ${await response.text()}`)
  }

  const rows = await response.json()
  assert(Array.isArray(rows), `Supabase ${table}: réponse inattendue`)
  return rows
}

async function fetchCurriculum(supabaseUrl, anonKey) {
  const [chapters, subjects, series, levels] = await Promise.all([
    fetchPublicRows(supabaseUrl, anonKey, 'chapitres', 'id,matiere_id,serie_id,ordre,code,titre,published'),
    fetchPublicRows(supabaseUrl, anonKey, 'matieres', 'id,nom,slug,ordre'),
    fetchPublicRows(supabaseUrl, anonKey, 'series', 'id,nom,niveau_id'),
    fetchPublicRows(supabaseUrl, anonKey, 'niveaux', 'id,nom,ordre'),
  ])

  return { chapters, subjects, series, levels }
}

function normalize(value) {
  return String(value ?? '')
    .replaceAll('œ', 'oe')
    .replaceAll('Œ', 'OE')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[’‘`']/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function titleWithoutLocator(value) {
  return String(value ?? '')
    .replace(/^\s*(?:physique|chimie)\s*[·.:\-–—]?\s*(?:l(?:eçon)?)?\s*\d+\s*[·.:\-–—]?\s*/iu, '')
    .replace(/^\s*(?:phy|ch|h|g|l)\s*\d+\s*[·.:\-–—]?\s*/iu, '')
    .replace(/\s*\((?:ok|\d+)\)\s*$/iu, '')
}

function normalizedTitle(value) {
  return normalize(titleWithoutLocator(value))
}

function titleSimilarity(left, right) {
  const leftTokens = new Set(normalizedTitle(left).split(' ').filter(Boolean))
  const rightTokens = new Set(normalizedTitle(right).split(' ').filter(Boolean))
  if (!leftTokens.size || !rightTokens.size) return 0
  let intersection = 0
  for (const token of leftTokens) if (rightTokens.has(token)) intersection += 1
  return Number(((2 * intersection) / (leftTokens.size + rightTokens.size)).toFixed(4))
}

function deriveArchiveSeriesCode(levelName, seriesName) {
  return normalize(levelName) === 'terminale' ? `T${String(seriesName).toUpperCase()}` : null
}

function deriveLocator(chapter, subject) {
  const title = String(chapter.titre ?? '')
  let match = title.match(/^\s*H\s*(\d+)/iu)
  if (match) return `H${Number(match[1])}`
  match = title.match(/^\s*G\s*(\d+)/iu)
  if (match) return `G${Number(match[1])}`
  match = title.match(/^\s*L\s*(\d+)/iu)
  if (match) return `L${Number(match[1])}`
  match = title.match(/^\s*Physique\b.*?L\s*(\d+)/iu)
  if (match) return `PHY${Number(match[1])}`
  match = title.match(/^\s*Chimie\b.*?L\s*(\d+)/iu)
  if (match) return `CH${Number(match[1])}`

  if (subject === 'physics_chemistry') {
    return chapter.ordre >= 51 ? `CH${chapter.ordre - 50}` : `PHY${chapter.ordre}`
  }
  if (subject === 'history_geography') {
    return chapter.ordre <= 9 ? `H${chapter.ordre}` : `G${chapter.ordre - 9}`
  }
  return `L${chapter.ordre}`
}

function selectDirectCandidate(candidates, chapter) {
  if (candidates.length <= 1) return candidates[0] ?? null
  return [...candidates]
    .map((source) => ({ source, score: titleSimilarity(chapter.titre, source.title_from_filename) }))
    .sort((left, right) => right.score - left.score || left.source.catalog_id.localeCompare(right.source.catalog_id))[0]
    ?.source ?? null
}

function selectTitleCandidate(candidates, chapter) {
  const ranked = [...candidates]
    .map((source) => ({ source, score: titleSimilarity(chapter.titre, source.title_from_filename) }))
    .sort((left, right) => right.score - left.score || left.source.catalog_id.localeCompare(right.source.catalog_id))

  const best = ranked[0]
  if (!best || best.score < TITLE_MATCH_THRESHOLD) return null
  return best
}

function buildSourceRecord(catalog, source, preferredSeriesCode) {
  const preferredPath = source.all_paths.find((item) => item.split('/').includes(preferredSeriesCode))
    ?? source.representative_path
  const selectedSourcePath = sourcePath(catalog, source, preferredPath)
  const allPaths = source.all_paths.map((item) => sourcePath(catalog, source, item))
  return {
    catalog_id: source.catalog_id,
    source_path: selectedSourcePath,
    sha256: source.sha256,
    locator: source.lesson_code_from_filename,
    title: source.title_from_filename,
    subject: source.subject,
    subdiscipline: source.subdiscipline,
    target_series: source.target_series,
    pages: source.pages,
    bytes: source.bytes,
    physical_copies: source.physical_copies,
    source_url: source.source_url ?? null,
    publisher: source.publisher ?? null,
    rights_status: source.rights_status ?? null,
    all_paths: allPaths,
    physical_duplicate_paths: allPaths.filter((item) => item !== selectedSourcePath),
  }
}

function mapChapter({ chapter, subject, series, level, catalog, semanticDuplicateHashes }) {
  const archiveSeriesCode = deriveArchiveSeriesCode(level.nom, series.nom)
  const catalogSubject = SUBJECT_BY_SLUG[subject.slug] ?? null
  const locator = deriveLocator(chapter, catalogSubject)
  const compatible = catalog.lessons.filter((source) => (
    source.subject === catalogSubject
      && archiveSeriesCode
      && source.target_series.includes(archiveSeriesCode)
      && source.lesson_code_from_filename === locator
  ))

  const directCandidate = selectDirectCandidate(compatible, chapter)
  const officialProgram = catalog.lessons.find((source) => (
    source.official_program === true
      && source.subject === catalogSubject
      && archiveSeriesCode
      && source.target_series.includes(archiveSeriesCode)
  ))

  let selected = directCandidate ?? officialProgram
  let mode = 'no_source'
  let score = null
  let matchBasis = 'none'

  if (!directCandidate && officialProgram) {
    mode = 'official_program'
    score = 1
    matchBasis = 'official_program_subject_series'
  } else if (selected) {
    mode = selected.target_series.length > 1 ? 'shared' : 'exact_hash'
    score = titleSimilarity(chapter.titre, selected.title_from_filename)
    matchBasis = selected.target_series.length > 1
      ? 'catalog_shared_series_subject_locator_sha256'
      : 'same_series_subject_locator_sha256'
  } else if (catalogSubject && archiveSeriesCode) {
    const crossSeriesByLocator = catalog.lessons.filter((source) => (
      source.subject === catalogSubject
        && source.lesson_code_from_filename === locator
        && !source.target_series.includes(archiveSeriesCode)
    ))
    const titleCandidate = selectTitleCandidate(crossSeriesByLocator, chapter)
    if (titleCandidate) {
      selected = titleCandidate.source
      mode = 'title_match'
      score = titleCandidate.score
      matchBasis = 'cross_series_subject_locator_title_similarity'
    }
  }

  const warnings = []
  let noSourceReason = null
  if (normalize(chapter.titre).includes('a venir')) warnings.push('chapter_title_placeholder')
  if (selected && score < TITLE_MATCH_THRESHOLD) warnings.push('title_mismatch_direct_locator')
  if (mode === 'title_match') warnings.push('cross_series_source_reuse')
  if (selected && semanticDuplicateHashes.has(selected.sha256)) warnings.push('catalog_semantic_duplicate_source')

  if (!selected) {
    if (!catalogSubject || !catalog.lessons.some((source) => source.subject === catalogSubject)) {
      noSourceReason = 'subject_absent_from_archive'
    } else if (!archiveSeriesCode) {
      noSourceReason = 'school_level_absent_from_archive'
    } else {
      noSourceReason = 'locator_absent_from_archive'
    }
  }

  const sourceRecord = selected ? buildSourceRecord(catalog, selected, archiveSeriesCode) : null

  return {
    chapter_id: chapter.id,
    level_id: level.id,
    level: level.nom,
    series_id: series.id,
    series: series.nom,
    archive_series_code: archiveSeriesCode,
    subject_id: subject.id,
    subject: subject.nom,
    subject_slug: subject.slug,
    catalog_subject: catalogSubject,
    chapter_order: chapter.ordre,
    chapter_code: chapter.code,
    chapter_title: chapter.titre,
    expected_locator: locator,
    mode,
    match_basis: matchBasis,
    title_match_score: score,
    source: sourceRecord,
    no_source_reason: noSourceReason,
    warnings,
    reusable_duplicates: {
      same_hash_chapters: [],
      physical_duplicate_paths: sourceRecord?.physical_duplicate_paths ?? [],
      semantic_duplicate_hashes: [],
    },
  }
}

function groupBy(items, keyOf) {
  const groups = new Map()
  for (const item of items) {
    const key = keyOf(item)
    const group = groups.get(key) ?? []
    group.push(item)
    groups.set(key, group)
  }
  return groups
}

function countBy(items, keyOf) {
  return Object.fromEntries(
    [...groupBy(items, keyOf).entries()]
      .sort(([left], [right]) => String(left).localeCompare(String(right)))
      .map(([key, values]) => [key, values.length]),
  )
}

function sourceReference(chapter) {
  return {
    chapter_id: chapter.chapter_id,
    archive_series_code: chapter.archive_series_code,
    subject_slug: chapter.subject_slug,
    chapter_order: chapter.chapter_order,
    chapter_title: chapter.chapter_title,
    expected_locator: chapter.expected_locator,
    mode: chapter.mode,
  }
}

function attachReuseInformation(chapters, catalog) {
  const mapped = chapters.filter((chapter) => chapter.source)
  const byHash = groupBy(mapped, (chapter) => chapter.source.sha256)
  const semantic = catalog.deduplication?.semantic_duplicate_outside_binary_hash
  const semanticHashes = new Set(semantic?.binary_sha256 ?? [])

  for (const chapter of mapped) {
    chapter.reusable_duplicates.same_hash_chapters = (byHash.get(chapter.source.sha256) ?? [])
      .filter((candidate) => candidate.chapter_id !== chapter.chapter_id)
      .map(sourceReference)
    chapter.reusable_duplicates.semantic_duplicate_hashes = semanticHashes.has(chapter.source.sha256)
      ? [...semanticHashes].filter((hash) => hash !== chapter.source.sha256)
      : []
  }

  return [...byHash.entries()]
    .filter(([, group]) => group.length > 1)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([sha256, group]) => ({
      sha256,
      catalog_id: group[0].source.catalog_id,
      locator: group[0].source.locator,
      source_path: group[0].source.source_path,
      physical_paths: group[0].source.all_paths,
      chapter_count: group.length,
      chapters: group.map(sourceReference),
    }))
}

function buildCoverage(chapters) {
  const groups = groupBy(chapters, (chapter) => (
    `${chapter.archive_series_code ?? `${chapter.level}-${chapter.series}`}|${chapter.subject_slug}`
  ))

  return [...groups.entries()]
    .map(([key, group]) => {
      const [seriesCode, subjectSlug] = key.split('|')
      const modeCounts = countBy(group, (chapter) => chapter.mode)
      const mapped = group.filter((chapter) => chapter.source).length
      return {
        series_code: seriesCode,
        level: group[0].level,
        series: group[0].series,
        subject: group[0].subject,
        subject_slug: subjectSlug,
        published_chapters: group.length,
        mapped_chapters: mapped,
        coverage_percent: Number(((mapped / group.length) * 100).toFixed(2)),
        exact_hash: modeCounts.exact_hash ?? 0,
        shared: modeCounts.shared ?? 0,
        official_program: modeCounts.official_program ?? 0,
        title_match: modeCounts.title_match ?? 0,
        no_source: modeCounts.no_source ?? 0,
      }
    })
    .sort((left, right) => (
      left.series_code.localeCompare(right.series_code)
        || left.subject_slug.localeCompare(right.subject_slug)
    ))
}

async function sha256File(filePath) {
  await access(filePath)
  return new Promise((resolveHash, reject) => {
    const hash = createHash('sha256')
    const input = createReadStream(filePath)
    input.on('error', reject)
    input.on('data', (chunk) => hash.update(chunk))
    input.on('end', () => resolveHash(hash.digest('hex')))
  })
}

function normalizeOfficialSource(source) {
  assert(source.official_program === true, `${source.catalog_id}: official_program attendu`)
  assert(source.rights_status === 'reference_only', `${source.catalog_id}: rights_status invalide`)
  assert(/^[a-f0-9]{64}$/.test(source.sha256 ?? ''), `${source.catalog_id}: SHA-256 invalide`)
  assert(Array.isArray(source.target_series) && source.target_series.length > 0, `${source.catalog_id}: séries absentes`)
  return {
    ...source,
    lesson_code_from_filename: source.locator,
    title_from_filename: source.title,
    representative_path: source.source_path,
    all_paths: [source.source_path],
    physical_copies: 1,
    exact_duplicate_group: false,
    redundant_bytes: 0,
    path_scope: 'repo',
  }
}

async function verifyCatalogFiles(catalog) {
  let checkedPhysicalFiles = 0
  const mismatches = []
  const missing = []

  for (const source of catalog.lessons) {
    assert(Array.isArray(source.all_paths) && source.all_paths.length > 0, `${source.catalog_id}: all_paths vide`)
    assert(source.all_paths.includes(source.representative_path), `${source.catalog_id}: representative_path absent de all_paths`)
    for (const item of source.all_paths) {
      const reportPath = sourcePath(catalog, source, item)
      try {
        const actual = await sha256File(filesystemPath(reportPath))
        checkedPhysicalFiles += 1
        if (actual !== source.sha256) mismatches.push({ source_path: reportPath, expected: source.sha256, actual })
      } catch (error) {
        if (error?.code === 'ENOENT') missing.push(reportPath)
        else throw error
      }
    }
  }

  assert(missing.length === 0, `PDF absents: ${missing.join(', ')}`)
  assert(mismatches.length === 0, `SHA-256 divergents: ${mismatches.map((item) => item.source_path).join(', ')}`)

  return {
    ok: true,
    checked_physical_files: checkedPhysicalFiles,
    expected_physical_files: catalog.lessons.reduce((total, source) => total + source.all_paths.length, 0),
    missing_files: missing,
    hash_mismatches: mismatches,
  }
}

function stableRows(rows) {
  return [...rows].sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)))
}

function snapshotHash(curriculum) {
  return createHash('sha256')
    .update(JSON.stringify({
      chapters: stableRows(curriculum.chapters),
      subjects: stableRows(curriculum.subjects),
      series: stableRows(curriculum.series),
      levels: stableRows(curriculum.levels),
    }))
    .digest('hex')
}

function validateManifest(manifest, catalog) {
  const chapterIds = new Set()
  for (const chapter of manifest.chapters) {
    assert(!chapterIds.has(chapter.chapter_id), `Chapitre dupliqué: ${chapter.chapter_id}`)
    chapterIds.add(chapter.chapter_id)
    assert(MATCH_MODES.includes(chapter.mode), `${chapter.chapter_id}: mode invalide`)
    assert(Boolean(chapter.source) === (chapter.mode !== 'no_source'), `${chapter.chapter_id}: source/mode incohérent`)
    if (chapter.source) {
      assert(/^[a-f0-9]{64}$/.test(chapter.source.sha256), `${chapter.chapter_id}: SHA-256 invalide`)
      assert(catalog.lessons.some((source) => source.sha256 === chapter.source.sha256), `${chapter.chapter_id}: source hors catalogue`)
    }
  }
  assert(manifest.summary.published_chapters === manifest.chapters.length, 'Total chapitres incohérent')
  assert(manifest.summary.mapped_chapters + manifest.summary.no_source_chapters === manifest.chapters.length, 'Couverture incohérente')
}

function markdownCell(value) {
  if (value == null || value === '') return '-'
  return String(value).replaceAll('|', '\\|').replace(/\r?\n/g, ' ')
}

function buildMarkdown(manifest) {
  const lines = [
    '# Manifeste chapitres -> sources PDF',
    '',
    `Généré le ${manifest.generated_at_utc}. Source distante lue en lecture seule : \`${manifest.remote.project_host}\`.`,
    '',
    '## Résultat',
    '',
    `- Chapitres publiés : **${manifest.summary.published_chapters}**`,
    `- Chapitres avec une source : **${manifest.summary.mapped_chapters}** (${manifest.summary.coverage_percent} %)`,
    `- Chapitres sans source : **${manifest.summary.no_source_chapters}**`,
    `- PDF uniques utilisés : **${manifest.summary.unique_source_hashes_used} / ${manifest.summary.catalog_unique_source_hashes}**`,
    `- Groupes de sources réutilisables : **${manifest.summary.reusable_source_groups}**`,
    `- Copies PDF vérifiées par SHA-256 : **${manifest.verification.source_files.checked_physical_files} / ${manifest.verification.source_files.expected_physical_files}**`,
    '',
    '### Modes',
    '',
    '- `exact_hash` : même série, même matière et même repère de leçon; le SHA-256 physique correspond au catalogue.',
    '- `shared` : le catalogue déclare explicitement le même objet PDF pour plusieurs séries.',
    '- `official_program` : programme institutionnel commun à la matière et aux séries concernées.',
    `- \`title_match\` : réemploi inter-séries, même matière et même repère, avec similarité de titre >= ${manifest.methodology.title_match_threshold}.`,
    '- `no_source` : aucune source suffisamment sûre dans l’archive.',
    '',
    '| Mode | Chapitres |',
    '|---|---:|',
    ...MATCH_MODES.map((mode) => `| ${mode} | ${manifest.summary.by_mode[mode] ?? 0} |`),
    '',
    '## Couverture par série et matière',
    '',
    '| Série | Matière | Publiés | Mappés | Couverture | exact_hash | shared | official_program | title_match | no_source |',
    '|---|---|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...manifest.coverage.map((row) => (
      `| ${markdownCell(row.series_code)} | ${markdownCell(row.subject)} | ${row.published_chapters} | ${row.mapped_chapters} | ${row.coverage_percent} % | ${row.exact_hash} | ${row.shared} | ${row.official_program} | ${row.title_match} | ${row.no_source} |`
    )),
    '',
    '## Lacunes',
    '',
  ]

  const gaps = manifest.chapters.filter((chapter) => chapter.mode === 'no_source')
  if (!gaps.length) {
    lines.push('Aucune lacune.', '')
  } else {
    lines.push(
      '| Série | Matière | Ordre | Repère attendu | Titre | Motif |',
      '|---|---|---:|---|---|---|',
      ...gaps.map((chapter) => (
        `| ${markdownCell(chapter.archive_series_code)} | ${markdownCell(chapter.subject)} | ${chapter.chapter_order} | ${markdownCell(chapter.expected_locator)} | ${markdownCell(chapter.chapter_title)} | ${markdownCell(chapter.no_source_reason)} |`
      )),
      '',
    )
  }

  lines.push(
    '## Groupes réutilisables par SHA-256',
    '',
    '| SHA-256 | Repère | Chapitres | Séries | Source |',
    '|---|---|---:|---|---|',
    ...manifest.reusable_source_groups.map((group) => (
      `| ${group.sha256} | ${markdownCell(group.locator)} | ${group.chapter_count} | ${markdownCell([...new Set(group.chapters.map((chapter) => chapter.archive_series_code))].join(', '))} | ${markdownCell(group.source_path)} |`
    )),
    '',
    '## Alertes de qualité',
    '',
  )

  const warnings = manifest.chapters.filter((chapter) => chapter.warnings.length > 0)
  if (!warnings.length) {
    lines.push('Aucune alerte.', '')
  } else {
    lines.push(
      '| Série | Matière | Ordre | Titre | Alertes |',
      '|---|---|---:|---|---|',
      ...warnings.map((chapter) => (
        `| ${markdownCell(chapter.archive_series_code)} | ${markdownCell(chapter.subject)} | ${chapter.chapter_order} | ${markdownCell(chapter.chapter_title)} | ${markdownCell(chapter.warnings.join(', '))} |`
      )),
      '',
    )
  }

  lines.push(
    '## Cartographie complète',
    '',
    '| Série | Matière | Ordre | Code DB | Titre | Repère | Mode | SHA-256 | Source | Réemplois même hash |',
    '|---|---|---:|---|---|---|---|---|---|---:|',
    ...manifest.chapters.map((chapter) => (
      `| ${markdownCell(chapter.archive_series_code)} | ${markdownCell(chapter.subject)} | ${chapter.chapter_order} | ${markdownCell(chapter.chapter_code)} | ${markdownCell(chapter.chapter_title)} | ${markdownCell(chapter.source?.locator ?? chapter.expected_locator)} | ${chapter.mode} | ${markdownCell(chapter.source?.sha256)} | ${markdownCell(chapter.source?.source_path)} | ${chapter.reusable_duplicates.same_hash_chapters.length} |`
    )),
    '',
    '## Reproduction',
    '',
    '```powershell',
    'node content_pipeline/scripts/build-chapter-source-manifest.mjs',
    '```',
    '',
    'Le script utilise uniquement la clé anonyme du frontend pour lire les tables publiques, vérifie chaque copie PDF, puis remplace les deux rapports de façon atomique.',
    '',
  )

  return lines.join('\n')
}

async function atomicWrite(filePath, content) {
  const temporary = `${filePath}.${process.pid}.tmp`
  await writeFile(temporary, content, 'utf8')
  await rename(temporary, filePath)
}

async function main() {
  const { supabaseUrl, supabaseAnonKey } = await loadEnvironment()
  assert(supabaseUrl, `VITE_SUPABASE_URL manquant (${repoRelative(ENV_PATH)})`)
  assert(supabaseAnonKey, `VITE_SUPABASE_ANON_KEY manquant (${repoRelative(ENV_PATH)})`)

  const catalogRaw = await readFile(CATALOG_PATH)
  const officialSourcesRaw = await readFile(OFFICIAL_SOURCES_PATH)
  const archiveCatalog = JSON.parse(catalogRaw.toString('utf8'))
  const officialSources = JSON.parse(officialSourcesRaw.toString('utf8'))
  assert(Array.isArray(officialSources.sources), 'official_sources.json: sources manquant')
  const catalog = {
    ...archiveCatalog,
    lessons: [
      ...archiveCatalog.lessons,
      ...officialSources.sources.map(normalizeOfficialSource),
    ],
  }
  assert(Array.isArray(catalog.lessons), 'archive_catalog.json: lessons manquant')

  const verification = await verifyCatalogFiles(catalog)
  const curriculum = await fetchCurriculum(supabaseUrl, supabaseAnonKey)
  const subjects = new Map(curriculum.subjects.map((subject) => [subject.id, subject]))
  const series = new Map(curriculum.series.map((item) => [item.id, item]))
  const levels = new Map(curriculum.levels.map((level) => [level.id, level]))
  const semanticDuplicateHashes = new Set(
    catalog.deduplication?.semantic_duplicate_outside_binary_hash?.binary_sha256 ?? [],
  )

  const chapters = curriculum.chapters.map((chapter) => {
    const subject = subjects.get(chapter.matiere_id)
    const currentSeries = series.get(chapter.serie_id)
    const level = currentSeries ? levels.get(currentSeries.niveau_id) : null
    assert(subject, `${chapter.id}: matière introuvable`)
    assert(currentSeries, `${chapter.id}: série introuvable`)
    assert(level, `${chapter.id}: niveau introuvable`)
    return mapChapter({
      chapter,
      subject,
      series: currentSeries,
      level,
      catalog,
      semanticDuplicateHashes,
    })
  }).sort((left, right) => (
    (left.level.localeCompare(right.level))
      || (left.archive_series_code ?? '').localeCompare(right.archive_series_code ?? '')
      || left.subject_slug.localeCompare(right.subject_slug)
      || left.chapter_order - right.chapter_order
      || left.chapter_id.localeCompare(right.chapter_id)
  ))

  const reusableSourceGroups = attachReuseInformation(chapters, catalog)
  const mappedChapters = chapters.filter((chapter) => chapter.source).length
  const usedHashes = new Set(chapters.filter((chapter) => chapter.source).map((chapter) => chapter.source.sha256))
  const byMode = Object.fromEntries(MATCH_MODES.map((mode) => [mode, chapters.filter((chapter) => chapter.mode === mode).length]))
  const unusedSources = catalog.lessons
    .filter((source) => !usedHashes.has(source.sha256))
    .map((source) => ({
      catalog_id: source.catalog_id,
      sha256: source.sha256,
      locator: source.lesson_code_from_filename,
      source_path: sourcePath(catalog, source, source.representative_path),
    }))

  const manifest = {
    schema_version: 1,
    generated_at_utc: new Date().toISOString(),
    remote: {
      project_host: new URL(supabaseUrl).host,
      access: 'public_select_with_anon_key',
      tables: ['chapitres', 'matieres', 'series', 'niveaux'],
      curriculum_snapshot_sha256: snapshotHash(curriculum),
    },
    inputs: {
      archive_catalog_path: repoRelative(CATALOG_PATH),
      archive_catalog_sha256: createHash('sha256').update(catalogRaw).digest('hex'),
      official_sources_path: repoRelative(OFFICIAL_SOURCES_PATH),
      official_sources_sha256: createHash('sha256').update(officialSourcesRaw).digest('hex'),
      archive_root: catalog.archive_root,
    },
    methodology: {
      modes: {
        exact_hash: 'Même série, même matière et même repère; SHA-256 physique vérifié.',
        shared: 'Le catalogue cible explicitement plusieurs séries avec le même SHA-256.',
        official_program: 'Programme institutionnel commun à la matière et aux séries concernées.',
        title_match: 'Réemploi inter-séries du même repère et de la même matière, confirmé par similarité du titre.',
        no_source: 'Aucune correspondance suffisamment sûre dans l’archive.',
      },
      title_normalization: 'Unicode NFD, accents et ponctuation retirés, préfixe de leçon retiré, comparaison Dice sur les mots uniques.',
      title_match_threshold: TITLE_MATCH_THRESHOLD,
      source_rights: catalog.methodology?.rights_note_fr,
    },
    summary: {
      expected_published_chapters_at_creation: EXPECTED_PUBLISHED_CHAPTERS,
      published_chapters: chapters.length,
      expected_count_matches: chapters.length === EXPECTED_PUBLISHED_CHAPTERS,
      mapped_chapters: mappedChapters,
      no_source_chapters: chapters.length - mappedChapters,
      coverage_percent: Number(((mappedChapters / chapters.length) * 100).toFixed(2)),
      by_mode: byMode,
      catalog_unique_source_hashes: new Set(catalog.lessons.map((source) => source.sha256)).size,
      unique_source_hashes_used: usedHashes.size,
      unused_catalog_source_hashes: unusedSources.length,
      reusable_source_groups: reusableSourceGroups.length,
      chapters_reusing_a_hash: chapters.filter((chapter) => chapter.reusable_duplicates.same_hash_chapters.length > 0).length,
    },
    verification: {
      source_files: verification,
      manifest_checks: {
        unique_chapter_ids: true,
        mapped_sources_exist_in_catalog: true,
        mode_source_consistency: true,
      },
    },
    coverage: buildCoverage(chapters),
    reusable_source_groups: reusableSourceGroups,
    semantic_duplicate_sources: catalog.deduplication?.semantic_duplicate_outside_binary_hash ?? null,
    unused_catalog_sources: unusedSources,
    chapters,
  }

  validateManifest(manifest, catalog)
  const markdown = buildMarkdown(manifest)
  await atomicWrite(JSON_OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`)
  await atomicWrite(MARKDOWN_OUTPUT, markdown)

  console.log(JSON.stringify({
    ok: true,
    outputs: [repoRelative(JSON_OUTPUT), repoRelative(MARKDOWN_OUTPUT)],
    published_chapters: manifest.summary.published_chapters,
    mapped_chapters: manifest.summary.mapped_chapters,
    coverage_percent: manifest.summary.coverage_percent,
    by_mode: manifest.summary.by_mode,
    unique_source_hashes_used: manifest.summary.unique_source_hashes_used,
    reusable_source_groups: manifest.summary.reusable_source_groups,
    verified_physical_files: manifest.verification.source_files.checked_physical_files,
    gaps: manifest.summary.no_source_chapters,
  }, null, 2))
}

await main()
