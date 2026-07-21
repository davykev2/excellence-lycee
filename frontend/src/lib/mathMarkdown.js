const TITRE_NUMEROTE = /(^|\n)(\d+\.\s+[^\n]+)(?=\n|$)/g

/**
 * Convertit les délimiteurs LaTeX fréquemment produits par ChatGPT, Word ou
 * un PDF (\(...\) et \[...\]) vers le Markdown mathématique compris par
 * remark-math. La fonction est volontairement pure afin d'être utilisée à la
 * fois dans l'aperçu admin et juste avant la publication.
 */
function normaliserSegmentTexte(value) {
  let markdown = value
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, expression) => `\n\n$$\n${expression.trim()}\n$$\n\n`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, expression) => `$${expression.trim()}$`)
    .replace(/([.!?])(?=\d+\.\s+[A-ZÀ-ÖØ-Þ])/g, '$1\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')

  return markdown
}

export function normalizeMathMarkdown(value, { numberedHeadings = false } = {}) {
  if (value == null) return ''

  let markdown = String(value)
    .replace(/\r\n?/g, '\n')
    .replace(/\u00a0/g, ' ')
    .trim()

  if (!markdown) return ''

  // Le code inline et les blocs de code doivent rester strictement inchangés.
  markdown = markdown
    .split(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/g)
    .map((segment, index) => (index % 2 === 1 ? segment : normaliserSegmentTexte(segment)))
    .join('')
    .trim()

  // Les blocs « 2. Simplification », « 3. Calcul de la limite », etc. sont
  // rendus comme de petits titres. Les vraies listes Markdown déjà indentées
  // ou les lignes terminées par une ponctuation restent inchangées.
  if (numberedHeadings) {
    markdown = markdown.replace(TITRE_NUMEROTE, (ligne, prefixe, titre) => {
      const texte = titre.trim()
      if (texte.length > 100 || /[.!?:;]$/.test(texte)) return ligne
      return `${prefixe}### ${texte}`
    })
  }

  return markdown
}
