import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import SignalerErreur from '../ui/SignalerErreur'

function asText(v) {
  if (v == null) return ''
  if (Array.isArray(v)) return v.join(' · ')
  return String(v)
}

const INLINE_MARKDOWN_COMPONENTS = {
  p: ({ children }) => <span>{children}</span>,
}

export default function QuestionCard({
  question,
  selected,
  onSelect,
  textValue = '',
  onTextChange,
  onSubmitText,
  correction,
  disabled,
}) {
  const isCorrection = !!correction
  const isTexte = question.type === 'texte'
  const locked = disabled ?? isCorrection

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 sm:p-5">
      {question.type === 'texte' && (
        <span className="mb-2 inline-block rounded-full border border-[var(--neon-violet)]/50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--neon-violet)]">
          Réponse à saisir
        </span>
      )}
      <div className="resume-content mb-3 overflow-x-auto font-medium">
        <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
          {question.enonce}
        </ReactMarkdown>
      </div>

      {question.image_url && (
        <img
          src={question.image_url}
          alt={question.image_alt || `Illustration associée à la question : ${question.enonce}`}
          className="mb-3 max-h-64 rounded-lg border border-[var(--border)]"
        />
      )}

      {/* ---- Question à saisie libre ---- */}
      {isTexte ? (
        <div className="flex flex-col gap-2">
          {!isCorrection ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!locked && textValue.trim()) onSubmitText?.()
              }}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <input
                value={textValue}
                onChange={(e) => onTextChange?.(e.target.value)}
                placeholder="Écris ta réponse…"
                disabled={locked}
                autoFocus
                className="input flex-1"
              />
              <button
                type="submit"
                disabled={locked || !textValue.trim()}
                className="rounded-lg border border-[var(--neon-cyan)] px-4 py-2 text-sm text-[var(--neon-cyan)] transition hover:bg-[var(--neon-cyan)]/10 disabled:opacity-40"
              >
                Valider
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-1 text-sm">
              <p className={correction.correcte ? 'text-[var(--neon-green)]' : 'text-[var(--neon-magenta)]'}>
                Ta réponse : <span className="font-semibold">{asText(selected) || '—'}</span>
              </p>
              {!correction.correcte && (
                <p className="text-[var(--neon-green)]">
                  Réponse attendue : <span className="font-semibold">{asText(correction.bonnes_reponses)}</span>
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ---- QCM ---- */
        <div className="flex flex-col gap-2">
          {(question.choix ?? []).map((choix, index) => {
            const isSelected = selected === choix
            let extra = 'border-[var(--border)] hover:border-[var(--neon-cyan)]/60'
            if (isCorrection) {
              const isBonne = JSON.stringify(correction.bonnes_reponses) === JSON.stringify(choix)
              if (isBonne) extra = 'border-[var(--neon-green)] bg-[var(--neon-green)]/10 text-[var(--neon-green)]'
              else if (isSelected) extra = 'border-[var(--neon-magenta)] bg-[var(--neon-magenta)]/10 text-[var(--neon-magenta)]'
            } else if (isSelected) {
              extra = 'border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]'
            }
            return (
              <button
                key={choix}
                type="button"
                disabled={locked}
                onClick={() => onSelect?.(choix)}
                className={`flex min-h-12 items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition cursor-pointer disabled:cursor-default ${extra}`}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-current/25 bg-[var(--bg)]/35 text-xs font-black">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="min-w-0 overflow-x-auto">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex]}
                    components={INLINE_MARKDOWN_COMPONENTS}
                  >
                    {String(choix)}
                  </ReactMarkdown>
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* ---- Correction ---- */}
      {isCorrection && (
        <div className="mt-4 flex flex-col gap-2">
          <p className={`text-sm font-semibold ${correction.correcte ? 'text-[var(--neon-green)]' : 'text-[var(--neon-magenta)]'}`}>
            {correction.correcte ? '✔ Bonne réponse' : '✘ Réponse incorrecte'}
          </p>
          {correction.explication && (
            <div className="resume-content rounded-lg border border-[var(--border)] bg-[var(--border)]/20 p-3 text-sm">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Explication</p>
              <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
                {correction.explication}
              </ReactMarkdown>
            </div>
          )}
          <SignalerErreur questionId={question.id} />
        </div>
      )}
    </div>
  )
}
