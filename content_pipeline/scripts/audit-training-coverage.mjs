import { readdir, readFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const manifestPath = resolve(root, 'reports', 'chapter_source_manifest.json')
const batchesPath = resolve(root, 'batches')

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const published = manifest.chapters ?? []
const chaptersById = new Map(published.map((chapter) => [chapter.chapter_id, chapter]))
const seenChapterIds = new Map()
const accepted = []
const errors = []

for (const entry of await readdir(batchesPath, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('-v2.json')) continue

  const file = resolve(batchesPath, entry.name)
  let batch
  try {
    batch = JSON.parse(await readFile(file, 'utf8'))
  } catch (error) {
    errors.push(`${entry.name}: JSON invalide (${error.message})`)
    continue
  }

  const chapterId = batch.target?.chapitre_id
  const chapter = chaptersById.get(chapterId)
  if (batch.schema_version !== 2 || batch.status !== 'reviewed') {
    errors.push(`${entry.name}: le lot n'est pas un lot v2 relu`)
    continue
  }
  if (!chapter) {
    errors.push(`${entry.name}: chapitre publié introuvable (${chapterId ?? 'id absent'})`)
    continue
  }
  if (seenChapterIds.has(chapterId)) {
    errors.push(`${entry.name}: doublon du chapitre déjà couvert par ${seenChapterIds.get(chapterId)}`)
    continue
  }
  if (batch.target.matiere_slug !== chapter.subject_slug) {
    errors.push(`${entry.name}: matière différente du manifeste`)
    continue
  }
  if (batch.target.serie !== chapter.series || batch.target.niveau !== chapter.level) {
    errors.push(`${entry.name}: niveau ou série différent du manifeste`)
    continue
  }
  if (!chapter.source) {
    errors.push(`${entry.name}: lot source-dérivé associé à une leçon sans source`)
    continue
  }
  if (batch.source?.sha256 !== chapter.source.sha256) {
    errors.push(`${entry.name}: SHA-256 différent de la source du manifeste`)
    continue
  }

  const levels = batch.levels ?? []
  const exercises = levels.reduce((total, level) => total + (level.exercises?.length ?? 0), 0)
  const questions = levels.reduce(
    (total, level) => total + (level.exercises ?? []).reduce(
      (levelTotal, exercise) => levelTotal + (exercise.questions?.length ?? 0),
      0,
    ),
    0,
  )

  seenChapterIds.set(chapterId, entry.name)
  accepted.push({
    file: basename(file),
    batch_code: batch.batch_code,
    chapter_id: chapterId,
    subject: chapter.subject_slug,
    series: chapter.series,
    exercises,
    subquestions: questions,
  })
}

const chaptersBySubject = new Map()
for (const chapter of published) {
  const chapters = chaptersBySubject.get(chapter.subject_slug) ?? []
  chapters.push(chapter)
  chaptersBySubject.set(chapter.subject_slug, chapters)
}

const coverageBySubject = [...chaptersBySubject.values()]
  .map((chapters) => {
    const subject = chapters[0].subject_slug
    const covered = accepted.filter((batch) => batch.subject === subject).length
    return {
      subject,
      published_chapters: chapters.length,
      source_chapters: chapters.filter((chapter) => chapter.source).length,
      reviewed_batches: covered,
      remaining_source_chapters: chapters.filter((chapter) => chapter.source).length - covered,
    }
  })
  .sort((a, b) => a.subject.localeCompare(b.subject, 'fr'))

const report = {
  ok: errors.length === 0,
  published_chapters: published.length,
  source_chapters: published.filter((chapter) => chapter.source).length,
  no_source_chapters: published.filter((chapter) => !chapter.source).length,
  reviewed_batches: accepted.length,
  exercises: accepted.reduce((total, batch) => total + batch.exercises, 0),
  subquestions: accepted.reduce((total, batch) => total + batch.subquestions, 0),
  coverage_by_subject: coverageBySubject,
  batches: accepted.sort((a, b) => a.batch_code.localeCompare(b.batch_code, 'fr')),
  errors,
}

console.log(JSON.stringify(report, null, 2))
if (!report.ok) process.exitCode = 1
