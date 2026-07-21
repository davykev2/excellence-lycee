import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeMathMarkdown } from '../src/lib/mathMarkdown.js'

test('le collage LaTeX de l’admin devient un Markdown mathématique lisible', () => {
  const colle = String.raw`2. Simplification de \(f(x)\)
Pour \(x\neq2\) :
\[
f(x)=\frac{(x-2)(x+2)}{x-2}
\]On simplifie par \(x-2\) :
\[
f(x)=x+2
\]3. Calcul de la limite
Comme \(f(x)=x+2\) pour \(x\neq2\) :
\[
\lim_{x\to2}f(x)=\lim_{x\to2}(x+2)=4
\]`

  const markdown = normalizeMathMarkdown(colle, { numberedHeadings: true })

  assert.match(markdown, /^### 2\. Simplification de \$f\(x\)\$/)
  assert.match(markdown, /\$\$\nf\(x\)=\\frac\{\(x-2\)\(x\+2\)\}\{x-2\}\n\$\$/)
  assert.match(markdown, /\n\n### 3\. Calcul de la limite\n/)
  assert.match(markdown, /\\lim_\{x\\to2\}f\(x\)=\\lim_\{x\\to2\}\(x\+2\)=4/)
  assert.doesNotMatch(markdown, /\\\(|\\\)|\\\[|\\\]/)
})

test('le Markdown et les dollars déjà valides sont conservés', () => {
  const markdown = 'Calculer $x^2$ puis :\n\n$$\nx=2\n$$'
  assert.equal(normalizeMathMarkdown(markdown), markdown)
})

test('la normalisation est idempotente et ne touche jamais au code', () => {
  const source = [
    String.raw`Texte \(x+1\), puis ` + '`' + String.raw`\(code\)` + '`' + '.',
    '',
    '```tex',
    String.raw`\[bloc_de_code\]`,
    '```',
  ].join('\n')
  const normalise = normalizeMathMarkdown(source)

  assert.equal(normalizeMathMarkdown(normalise), normalise)
  assert.match(normalise, /Texte \$x\+1\$/)
  assert.match(normalise, /`\\\(code\\\)`/)
  assert.match(normalise, /\\\[bloc_de_code\\\]/)
})

test('un délimiteur incomplet reste visible au lieu de casser le rendu', () => {
  assert.equal(normalizeMathMarkdown(String.raw`Calcul \(x+1`), String.raw`Calcul \(x+1`)
})
