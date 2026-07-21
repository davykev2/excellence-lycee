import katex from "katex";
import "katex/dist/katex.min.css";

interface MathFormulaProps {
  tex: string;
  block?: boolean;
  className?: string;
  fallback?: string;
}

export function MathFormula({ tex, block = false, className = "", fallback }: MathFormulaProps) {
  const html = katex.renderToString(tex, {
    displayMode: block,
    throwOnError: false,
    strict: "warn",
    trust: false,
    output: "htmlAndMathml",
  });

  return (
    <span
      className={`math-formula ${block ? "is-block" : "is-inline"} ${className}`.trim()}
      aria-label={fallback ?? tex}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

interface MathTextProps {
  children: string;
  className?: string;
}

export function MathText({ children, className = "" }: MathTextProps) {
  const parts = children.split(/(\$[^$]+\$)/g).filter(Boolean);
  return (
    <span className={`math-text ${className}`.trim()}>
      {parts.map((part, index) => {
        const isFormula = part.startsWith("$") && part.endsWith("$");
        return isFormula
          ? <MathFormula key={`${part}-${index}`} tex={part.slice(1, -1)} fallback={part.slice(1, -1)} />
          : <span key={`${part}-${index}`}>{part}</span>;
      })}
    </span>
  );
}
