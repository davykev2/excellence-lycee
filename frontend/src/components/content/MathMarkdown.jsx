import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { normalizeMathMarkdown } from '../../lib/mathMarkdown'

const REMARK_PLUGINS = [remarkMath, remarkGfm]
const REHYPE_PLUGINS = [[rehypeKatex, {
  trust: false,
  strict: 'warn',
  maxExpand: 1000,
  maxSize: 20,
  errorColor: '#ff4da6',
}]]

export default function MathMarkdown({ children, className = '', numberedHeadings = false }) {
  const markdown = normalizeMathMarkdown(children, { numberedHeadings })
  if (!markdown) return null

  return (
    <div className={`resume-content overflow-x-auto ${className}`}>
      <ReactMarkdown skipHtml remarkPlugins={REMARK_PLUGINS} rehypePlugins={REHYPE_PLUGINS}>
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
