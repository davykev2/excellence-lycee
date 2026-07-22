export type MathNode =
  | { type: "number"; value: number }
  | { type: "variable" }
  | { type: "unary"; operator: "+" | "-"; operand: MathNode }
  | { type: "binary"; operator: "+" | "-" | "*" | "/" | "^"; left: MathNode; right: MathNode }
  | { type: "function"; name: SupportedFunction; argument: MathNode };

type SupportedFunction = "sin" | "cos" | "tan" | "asin" | "acos" | "atan" | "sqrt" | "abs" | "exp" | "ln" | "log" | "floor" | "ceil";

type Token =
  | { type: "number"; value: number }
  | { type: "identifier"; value: string }
  | { type: "operator"; value: "+" | "-" | "*" | "/" | "^" }
  | { type: "left" }
  | { type: "right" };

const functionAliases: Record<string, SupportedFunction> = {
  sin: "sin",
  cos: "cos",
  tan: "tan",
  tg: "tan",
  asin: "asin",
  arcsin: "asin",
  acos: "acos",
  arccos: "acos",
  atan: "atan",
  arctan: "atan",
  sqrt: "sqrt",
  racine: "sqrt",
  abs: "abs",
  exp: "exp",
  ln: "ln",
  log: "log",
  floor: "floor",
  ceil: "ceil",
};

function normalizeSource(source: string) {
  return source
    .trim()
    .toLowerCase()
    .replace(/(\d),(\d)/g, "$1.$2")
    .replace(/[−–—]/g, "-")
    .replace(/[×·]/g, "*")
    .replace(/÷/g, "/")
    .replace(/π/g, "pi")
    .replace(/√/g, "sqrt")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/\s+/g, "");
}

function tokenize(source: string): Token[] {
  const normalized = normalizeSource(source);
  if (!normalized) throw new Error("Saisis une fonction de x.");
  const tokens: Token[] = [];
  let index = 0;

  while (index < normalized.length) {
    const character = normalized[index];
    if (/\d|\./.test(character)) {
      const match = /^(?:\d+(?:\.\d*)?|\.\d+)/.exec(normalized.slice(index));
      if (!match) throw new Error(`Nombre invalide près de « ${normalized.slice(index, index + 6)} ».`);
      const value = Number(match[0]);
      if (!Number.isFinite(value)) throw new Error("Le nombre saisi est trop grand.");
      tokens.push({ type: "number", value });
      index += match[0].length;
      continue;
    }
    if (/[a-z]/.test(character)) {
      const match = /^[a-z]+/.exec(normalized.slice(index));
      if (!match) throw new Error("Nom mathématique invalide.");
      tokens.push({ type: "identifier", value: match[0] });
      index += match[0].length;
      continue;
    }
    if (character === "(") {
      tokens.push({ type: "left" });
      index += 1;
      continue;
    }
    if (character === ")") {
      tokens.push({ type: "right" });
      index += 1;
      continue;
    }
    if (character === "+" || character === "-" || character === "*" || character === "/" || character === "^") {
      tokens.push({ type: "operator", value: character });
      index += 1;
      continue;
    }
    throw new Error(`Le symbole « ${character} » n’est pas reconnu.`);
  }
  return tokens;
}

class ExpressionParser {
  private index = 0;

  constructor(private readonly tokens: Token[]) {}

  parse() {
    const node = this.parseAdditive();
    if (this.peek()) throw new Error("Vérifie les parenthèses et les opérations de la fonction.");
    return node;
  }

  private peek() {
    return this.tokens[this.index];
  }

  private consume() {
    const token = this.tokens[this.index];
    this.index += 1;
    return token;
  }

  private parseAdditive(): MathNode {
    let left = this.parseMultiplicative();
    while (this.peek()?.type === "operator" && (this.peek() as Extract<Token, { type: "operator" }>).value.match(/^[+-]$/)) {
      const operator = (this.consume() as Extract<Token, { type: "operator" }>).value as "+" | "-";
      left = { type: "binary", operator, left, right: this.parseMultiplicative() };
    }
    return left;
  }

  private startsPrimary(token: Token | undefined) {
    return token?.type === "number" || token?.type === "identifier" || token?.type === "left";
  }

  private parseMultiplicative(): MathNode {
    let left = this.parseUnary();
    while (true) {
      const token = this.peek();
      if (token?.type === "operator" && (token.value === "*" || token.value === "/")) {
        const operator = (this.consume() as Extract<Token, { type: "operator" }>).value as "*" | "/";
        left = { type: "binary", operator, left, right: this.parseUnary() };
        continue;
      }
      if (this.startsPrimary(token)) {
        left = { type: "binary", operator: "*", left, right: this.parseUnary() };
        continue;
      }
      return left;
    }
  }

  private parseUnary(): MathNode {
    const token = this.peek();
    if (token?.type === "operator" && (token.value === "+" || token.value === "-")) {
      this.consume();
      return { type: "unary", operator: token.value, operand: this.parseUnary() };
    }
    return this.parsePower();
  }

  private parsePower(): MathNode {
    const left = this.parsePrimary();
    const token = this.peek();
    if (token?.type === "operator" && token.value === "^") {
      this.consume();
      return { type: "binary", operator: "^", left, right: this.parseUnary() };
    }
    return left;
  }

  private parsePrimary(): MathNode {
    const token = this.consume();
    if (!token) throw new Error("La fonction est incomplète.");
    if (token.type === "number") return { type: "number", value: token.value };
    if (token.type === "left") {
      const node = this.parseAdditive();
      if (this.consume()?.type !== "right") throw new Error("Une parenthèse fermante est manquante.");
      return node;
    }
    if (token.type === "identifier") {
      if (token.value === "x") return { type: "variable" };
      if (token.value === "pi") return { type: "number", value: Math.PI };
      if (token.value === "e") return { type: "number", value: Math.E };
      const functionName = functionAliases[token.value];
      if (!functionName) throw new Error(`« ${token.value} » n’est pas une fonction reconnue.`);
      if (this.peek()?.type === "left") {
        this.consume();
        const argument = this.parseAdditive();
        if (this.consume()?.type !== "right") throw new Error(`Ferme la parenthèse de ${token.value}.`);
        return { type: "function", name: functionName, argument };
      }
      return { type: "function", name: functionName, argument: this.parseUnary() };
    }
    throw new Error("Un nombre, x ou une parenthèse était attendu.");
  }
}

export function evaluateNode(node: MathNode, x: number): number {
  if (node.type === "number") return node.value;
  if (node.type === "variable") return x;
  if (node.type === "unary") {
    const value = evaluateNode(node.operand, x);
    return node.operator === "-" ? -value : value;
  }
  if (node.type === "binary") {
    const left = evaluateNode(node.left, x);
    const right = evaluateNode(node.right, x);
    if (node.operator === "+") return left + right;
    if (node.operator === "-") return left - right;
    if (node.operator === "*") return left * right;
    if (node.operator === "/") return left / right;
    return left ** right;
  }
  const value = evaluateNode(node.argument, x);
  if (node.name === "sin") return Math.sin(value);
  if (node.name === "cos") return Math.cos(value);
  if (node.name === "tan") return Math.tan(value);
  if (node.name === "asin") return Math.asin(value);
  if (node.name === "acos") return Math.acos(value);
  if (node.name === "atan") return Math.atan(value);
  if (node.name === "sqrt") return Math.sqrt(value);
  if (node.name === "abs") return Math.abs(value);
  if (node.name === "exp") return Math.exp(value);
  if (node.name === "ln") return Math.log(value);
  if (node.name === "log") return Math.log10(value);
  if (node.name === "floor") return Math.floor(value);
  return Math.ceil(value);
}

export interface ParsedExpression {
  source: string;
  node: MathNode;
  evaluate: (x: number) => number;
}

export function parseMathExpression(source: string): ParsedExpression {
  const node = new ExpressionParser(tokenize(source)).parse();
  return {
    source,
    node,
    evaluate: (x: number) => evaluateNode(node, x),
  };
}

export function numericalDerivative(evaluate: (x: number) => number, x: number) {
  const step = Math.max(1e-5, Math.abs(x) * 1e-5);
  return (evaluate(x + step) - evaluate(x - step)) / (2 * step);
}

function collectDenominators(node: MathNode, result: MathNode[] = []) {
  if (node.type === "binary") {
    if (node.operator === "/") result.push(node.right);
    collectDenominators(node.left, result);
    collectDenominators(node.right, result);
  } else if (node.type === "unary") {
    collectDenominators(node.operand, result);
  } else if (node.type === "function") {
    collectDenominators(node.argument, result);
  }
  return result;
}

function bisection(node: MathNode, left: number, right: number) {
  let leftValue = evaluateNode(node, left);
  for (let iteration = 0; iteration < 48; iteration += 1) {
    const middle = (left + right) / 2;
    const middleValue = evaluateNode(node, middle);
    if (Math.abs(middleValue) < 1e-10) return middle;
    if (Math.sign(leftValue) !== Math.sign(middleValue)) {
      right = middle;
    } else {
      left = middle;
      leftValue = middleValue;
    }
  }
  return (left + right) / 2;
}

function newtonRoot(node: MathNode, initial: number) {
  let x = initial;
  for (let iteration = 0; iteration < 24; iteration += 1) {
    const value = evaluateNode(node, x);
    const step = Math.max(1e-5, Math.abs(x) * 1e-5);
    const derivative = (evaluateNode(node, x + step) - evaluateNode(node, x - step)) / (2 * step);
    if (!Number.isFinite(value) || !Number.isFinite(derivative) || Math.abs(derivative) < 1e-10) break;
    x -= value / derivative;
    if (Math.abs(value) < 1e-10) break;
  }
  return x;
}

function rootsInRange(node: MathNode, minimum: number, maximum: number) {
  const roots: number[] = [];
  const samples = 900;
  const step = (maximum - minimum) / samples;
  let previousX = minimum;
  let previousValue = evaluateNode(node, previousX);
  let beforePreviousAbs = Number.POSITIVE_INFINITY;

  for (let index = 1; index <= samples; index += 1) {
    const x = minimum + index * step;
    const value = evaluateNode(node, x);
    if (Number.isFinite(value) && Number.isFinite(previousValue) && Math.sign(value) !== Math.sign(previousValue)) {
      roots.push(bisection(node, previousX, x));
    }
    const currentAbs = Math.abs(value);
    const previousAbs = Math.abs(previousValue);
    if (Number.isFinite(previousAbs) && previousAbs < beforePreviousAbs && previousAbs < currentAbs && previousAbs < Math.max(0.02, step)) {
      const candidate = newtonRoot(node, previousX);
      if (candidate >= minimum - step && candidate <= maximum + step && Math.abs(evaluateNode(node, candidate)) < 1e-5) roots.push(candidate);
    }
    beforePreviousAbs = previousAbs;
    previousX = x;
    previousValue = value;
  }

  return roots
    .filter(Number.isFinite)
    .sort((left, right) => left - right)
    .filter((root, index, values) => index === 0 || Math.abs(root - values[index - 1]) > step * 1.5);
}

export type DetectedAsymptote =
  | { kind: "vertical"; x: number; label: string }
  | { kind: "horizontal"; y: number; direction: "positive" | "negative" | "both"; label: string }
  | { kind: "oblique"; slope: number; intercept: number; direction: "positive" | "negative" | "both"; label: string };

function rounded(value: number) {
  return Math.abs(value) < 1e-9 ? 0 : Number(value.toFixed(4));
}

function lineAtInfinity(evaluate: (x: number) => number, direction: 1 | -1): DetectedAsymptote | null {
  const x1 = direction * 200;
  const x2 = direction * 400;
  const x3 = direction * 800;
  const y1 = evaluate(x1);
  const y2 = evaluate(x2);
  const y3 = evaluate(x3);
  if (![y1, y2, y3].every(Number.isFinite)) return null;
  const side = direction === 1 ? "positive" : "negative";
  const horizontalVariation = Math.max(Math.abs(y2 - y1), Math.abs(y3 - y2));
  if (horizontalVariation < Math.max(0.025, Math.abs(y3) * 0.0025)) {
    const y = rounded(y3);
    return { kind: "horizontal", y, direction: side, label: `y = ${formatNumber(y)} (${direction === 1 ? "+∞" : "−∞"})` };
  }
  const slope = (y2 - y1) / (x2 - x1);
  const intercept = y2 - slope * x2;
  const residual = Math.abs(y3 - (slope * x3 + intercept));
  if (Math.abs(slope) > 1e-5 && residual < Math.max(0.05, Math.abs(y3) * 0.0025)) {
    const cleanSlope = rounded(slope);
    const cleanIntercept = rounded(intercept);
    return {
      kind: "oblique",
      slope: cleanSlope,
      intercept: cleanIntercept,
      direction: side,
      label: `y = ${formatLinear(cleanSlope, cleanIntercept)} (${direction === 1 ? "+∞" : "−∞"})`,
    };
  }
  return null;
}

export function detectAsymptotes(expression: ParsedExpression, minimum: number, maximum: number) {
  const asymptotes: DetectedAsymptote[] = [];
  collectDenominators(expression.node).forEach((denominator) => {
    rootsInRange(denominator, minimum, maximum).forEach((root) => {
      const step = Math.max(1e-5, (maximum - minimum) * 1e-5);
      const left = Math.abs(expression.evaluate(root - step));
      const right = Math.abs(expression.evaluate(root + step));
      if (!Number.isFinite(left) || !Number.isFinite(right) || Math.max(left, right) > 100) {
        asymptotes.push({ kind: "vertical", x: rounded(root), label: `x = ${formatNumber(rounded(root))}` });
      }
    });
  });

  const negative = lineAtInfinity(expression.evaluate, -1);
  const positive = lineAtInfinity(expression.evaluate, 1);
  if (negative && positive && negative.kind === positive.kind) {
    if (negative.kind === "horizontal" && positive.kind === "horizontal" && Math.abs(negative.y - positive.y) < 0.02) {
      asymptotes.push({ ...positive, y: rounded((negative.y + positive.y) / 2), direction: "both", label: `y = ${formatNumber(rounded((negative.y + positive.y) / 2))} (±∞)` });
      return deduplicateAsymptotes(asymptotes);
    }
    if (negative.kind === "oblique" && positive.kind === "oblique" && Math.abs(negative.slope - positive.slope) < 0.02 && Math.abs(negative.intercept - positive.intercept) < 0.1) {
      const slope = rounded((negative.slope + positive.slope) / 2);
      const intercept = rounded((negative.intercept + positive.intercept) / 2);
      asymptotes.push({ kind: "oblique", slope, intercept, direction: "both", label: `y = ${formatLinear(slope, intercept)} (±∞)` });
      return deduplicateAsymptotes(asymptotes);
    }
  }
  if (negative) asymptotes.push(negative);
  if (positive) asymptotes.push(positive);
  return deduplicateAsymptotes(asymptotes);
}

function deduplicateAsymptotes(asymptotes: DetectedAsymptote[]) {
  return asymptotes.filter((item, index, values) => {
    if (item.kind !== "vertical") return true;
    return values.findIndex((candidate) => candidate.kind === "vertical" && Math.abs(candidate.x - item.x) < 0.01) === index;
  });
}

export interface CurvePoint {
  x: number;
  y: number;
}

export function sampleCurve(evaluate: (x: number) => number, xMin: number, xMax: number, yMin: number, yMax: number, samples = 900) {
  const segments: CurvePoint[][] = [];
  let segment: CurvePoint[] = [];
  const step = (xMax - xMin) / samples;
  const visibleHeight = yMax - yMin;

  for (let index = 0; index <= samples; index += 1) {
    const x = xMin + index * step;
    const y = evaluate(x);
    const previous = segment.at(-1);
    const invalid = !Number.isFinite(y)
      || Math.abs(y) > Math.max(1e6, visibleHeight * 100)
      || Boolean(previous && Math.abs(previous.y - y) > visibleHeight * 3);
    if (invalid) {
      if (segment.length > 1) segments.push(segment);
      segment = [];
      continue;
    }
    segment.push({ x, y });
  }
  if (segment.length > 1) segments.push(segment);
  return segments;
}

export function formatNumber(value: number, digits = 3) {
  if (!Number.isFinite(value)) return "indéfini";
  if (Math.abs(value) < 1e-10) return "0";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: digits }).format(value);
}

export function formatLinear(slope: number, intercept: number) {
  const slopeText = Math.abs(slope - 1) < 1e-10 ? "x" : Math.abs(slope + 1) < 1e-10 ? "−x" : `${formatNumber(slope)}x`;
  if (Math.abs(intercept) < 1e-10) return slopeText;
  return `${slopeText} ${intercept >= 0 ? "+" : "−"} ${formatNumber(Math.abs(intercept))}`;
}

