import { Keyboard } from "@phosphor-icons/react";
import { useId, useState, type RefObject } from "react";

const groups = [
  { label: "Calcul", symbols: ["+", "−", "×", "÷", "=", "≠", "≈", "≤", "≥", "±", "(", ")", "[", "]", "/", ",", ";", "i"] },
  { label: "Puissances et limites", symbols: ["+∞", "−∞", "∞", "²", "³", "^", "√(", "∛(", "→", "lim", "ℝ", "∈"] },
  { label: "Fonctions et géométrie", symbols: ["π", "α", "β", "θ", "ln(", "exp(", "sin(", "cos(", "tan(", "∫", "Σ", "°"] },
  { label: "Ensembles et raisonnement", symbols: ["ℕ", "ℤ", "ℚ", "ℂ", "∀", "∃", "∉", "⊂", "∪", "∩", "∅", "⇒", "⇔"] },
];

export function DocumentFormulaKeyboard({ inputRef, value, onChange }: {
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  value: string;
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <div className="document-formula-tools">
    <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(current => !current)}>
      <Keyboard size={19} aria-hidden="true" />{open ? "Masquer le clavier" : "Clavier de formules"}
    </button>
    {open && <div id={id} className="document-symbol-pad" aria-label="Symboles mathématiques">
      {groups.map(group => <section key={group.label}><strong>{group.label}</strong><div>{group.symbols.map(symbol =>
        <button type="button" key={symbol} aria-label={`Insérer ${symbol}`} onMouseDown={event => event.preventDefault()} onClick={() => {
          const input = inputRef.current;
          const start = input?.selectionStart ?? value.length;
          const end = input?.selectionEnd ?? start;
          onChange(value.slice(0, start) + symbol + value.slice(end));
          window.requestAnimationFrame(() => { input?.focus(); input?.setSelectionRange(start + symbol.length, start + symbol.length); });
        }}>{symbol}</button>,
      )}</div></section>)}
    </div>}
  </div>;
}
