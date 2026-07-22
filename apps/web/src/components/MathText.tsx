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

const explicitMathPattern = /(\$\$[\s\S]+?\$\$|\$[^$]+\$)/g;

function normalizeExplicitLatexDelimiters(value: string) {
  return value
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, formula: string) => `$$${formula}$$`)
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, formula: string) => `$${formula}$`);
}

function replaceOutsideMath(value: string, pattern: RegExp, block = false) {
  return value
    .split(explicitMathPattern)
    .map((part) => {
      if (part.startsWith("$") && part.endsWith("$")) return part;
      return part.replace(pattern, (formula) => block ? `$$${formula}$$` : `$${formula.trim()}$`);
    })
    .join("");
}

function delimitImplicitLatex(value: string) {
  if (!value.includes("\\")) return value;

  let normalized = replaceOutsideMath(value, /\\begin\{([a-zA-Z*]+)\}[\s\S]*?\\end\{\1\}/g, true);
  normalized = replaceOutsideMath(normalized, /\\lim(?:_\{(?:[^{}]|\{[^{}]*\})*\})?\s*\\frac\{(?:[^{}]|\{[^{}]*\})*\}\{(?:[^{}]|\{[^{}]*\})*\}(?:\s*=\s*[-+]?[^,;.()]+)?/g);
  normalized = replaceOutsideMath(normalized, /\\(?:d?frac)\{(?:[^{}]|\{[^{}]*\})*\}\{(?:[^{}]|\{[^{}]*\})*\}|\\sqrt\{(?:[^{}]|\{[^{}]*\})*\}/g);
  normalized = replaceOutsideMath(normalized, /\\(?:mathbb|mathcal|mathbf|mathrm|operatorname)\{[^{}]+\}/g);
  return replaceOutsideMath(normalized, /[A-Za-z0-9]+(?:_\{[^{}]+\}|\^\{[^{}]+\})+/g);
}

function normalizeMathDelimiters(value: string) {
  return normalizeExplicitLatexDelimiters(value)
    .split(explicitMathPattern)
    .map((part) => part.startsWith("$") && part.endsWith("$") ? part : delimitImplicitLatex(part))
    .join("");
}

export function MathText({ children, className = "" }: MathTextProps) {
  const parts = normalizeMathDelimiters(children).split(explicitMathPattern).filter(Boolean);
  return (
    <span className={`math-text ${className}`.trim()}>
      {parts.map((part, index) => {
        const isBlockFormula = part.startsWith("$$") && part.endsWith("$$");
        const isFormula = isBlockFormula || (part.startsWith("$") && part.endsWith("$"));
        const formula = isBlockFormula ? part.slice(2, -2) : part.slice(1, -1);
        return isFormula
          ? <MathFormula key={`${part}-${index}`} tex={formula} block={isBlockFormula} fallback={formula} />
          : <span key={`${part}-${index}`}>{part}</span>;
      })}
    </span>
  );
}
