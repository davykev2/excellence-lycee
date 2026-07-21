import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const here = dirname(fileURLToPath(import.meta.url))
const frontend = resolve(here, '..')
const page = readFileSync(resolve(frontend, 'src/pages/Communaute.jsx'), 'utf8')

test('la messagerie privee peut etre ouverte directement sans changer le chat par defaut', () => {
  assert.match(page, /useSearchParams\(\)/)
  assert.match(page, /searchParams\.get\('tab'\)\s*===\s*'mp'\s*\?\s*'mp'\s*:\s*'chat'/)
  assert.match(page, /nextParams\.set\('tab',\s*'mp'\)/)
  assert.match(page, /nextParams\.delete\('tab'\)/)
  assert.match(page, /tab\s*===\s*'chat'\s*\?\s*<ChatGlobal\s*\/>\s*:\s*<MessageriePrivee\s*\/>/)
})
