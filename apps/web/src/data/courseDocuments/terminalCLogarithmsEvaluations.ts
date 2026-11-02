import type { CourseEvaluationGroup } from "../../domain/courseDocument";

export const terminalCLogarithmsEvaluations: CourseEvaluationGroup[] = [
  {
    id: "log-limits-evaluation", title: "Calculer les limites aux bornes du domaine", pages: [104],
    method: String.raw`1. Détermine les bornes du domaine et le côté d’approche.
2. Transforme l’expression pour faire apparaître une limite de référence.
3. Donne les limites de chaque facteur ou terme, puis conclus avec la règle appropriée.`,
    examples: [{ id: "log-limits-worked", title: "Exemple corrigé", prompt: String.raw`Soit $f(x)=(1+\ln x)/x$ sur $]0;+\infty[$. Calculons ses limites en $0$ et en $+\infty$.`, parts: [
      { id: "log-limits-worked-infinity", label: "a)", prompt: String.raw`Limite en $+\infty$.`, solution: String.raw`On sépare le quotient :

$$f(x)=\frac1x+\frac{\ln x}{x}.$$

Les deux termes tendent vers $0$ lorsque $x\to+\infty$. **Donc $\lim_{x\to+\infty}f(x)=0$.**` },
      { id: "log-limits-worked-zero", label: "b)", prompt: String.raw`Limite en $0^+$.`, solution: String.raw`On écrit $f(x)=(1/x)(1+\ln x)$. Lorsque $x\to0^+$, $1/x\to+\infty$ et $1+\ln x\to-\infty$. Le premier facteur est positif, le second est négatif près de $0$ : **le produit tend vers $-\infty$**.` },
    ] }],
    statement: String.raw`Soit $f(x)=2\ln x+1/x$ sur $]0;+\infty[$. Calcule les limites de $f$ en $0$ et en $+\infty$.`,
    questions: [
      { id: "log-evaluation-limit-zero", label: "1.a", points: 1, topicId: "log-limits-summary", prompt: String.raw`Quelle est $\displaystyle\lim_{x\to0^+}f(x)$ ?`, expected: "$+\\infty$", answer: { kind: "short", accepted: ["+infini", "infini", "+∞", "∞"] },
        correction: String.raw`La somme $2\ln x+1/x$ donne une forme indéterminée $-\infty+\infty$. On factorise donc par $1/x$ :

$$f(x)=\frac1x(1+2x\ln x).$$

Quand $x\to0^+$, $x\ln x\to0$, donc la parenthèse tend vers $1>0$. Puisque $1/x\to+\infty$, **la limite vaut $+\infty$**.` },
      { id: "log-evaluation-limit-infinity", label: "1.b", points: 1, topicId: "log-limits-summary", prompt: String.raw`Quelle est $\displaystyle\lim_{x\to+\infty}f(x)$ ?`, expected: "$+\\infty$", answer: { kind: "short", accepted: ["+infini", "infini", "+∞", "∞"] },
        correction: String.raw`Lorsque $x\to+\infty$, $2\ln x\to+\infty$ et $1/x\to0$. Leur somme tend donc vers **$+\infty$**. Ici, il n’y a plus de forme indéterminée.` },
    ],
  },
  {
    id: "log-derivative-evaluation", title: "Déterminer le domaine puis dériver", pages: [104, 105],
    method: String.raw`1. Repère l’argument $u$ du logarithme et son domaine de dérivabilité.
2. Résous $u(x)>0$ : le logarithme doit recevoir un nombre strictement positif.
3. Calcule $u'$, puis applique $(\ln u)'=u'/u$ sur le domaine obtenu.`,
    examples: [{ id: "log-rational-derivative-worked", title: "Exemple corrigé", prompt: String.raw`Déterminons le domaine de dérivabilité de $g(x)=\ln\left((1-x)/(2+x)\right)$, puis sa dérivée.`, parts: [
      { id: "log-rational-domain-worked", label: "a)", prompt: "Étudier le signe de l’argument.", solution: String.raw`Posons $u(x)=(1-x)/(2+x)$. Il faut $x\ne-2$ et $u(x)>0$.

| $x$ | $]-\infty;-2[$ | $]-2;1[$ | $]1;+\infty[$ |
| --- | --- | --- | --- |
| $1-x$ | $+$ | $+$ | $-$ |
| $2+x$ | $-$ | $+$ | $+$ |
| $u(x)$ | $-$ | $+$ | $-$ |

Le quotient est positif exactement sur **$]-2;1[$**. L’argument y est dérivable, donc $g$ aussi.` },
      { id: "log-rational-derivative-formula", label: "b)", prompt: "Calculer la dérivée.", solution: String.raw`La règle du quotient donne :

$$u'(x)=\frac{-(2+x)-(1-x)}{(2+x)^2}=-\frac3{(2+x)^2}.$$

On divise ensuite par $u(x)$, ce qui revient à multiplier par son inverse :

$$g'(x)=-\frac3{(2+x)^2}\frac{2+x}{1-x}=-\frac3{(2+x)(1-x)}.$$

**Ainsi $g'(x)=3/((x-1)(x+2))$ sur $]-2;1[$.**` },
    ] }],
    statement: String.raw`Soit $k(x)=\ln\left(\sqrt{1-x^2}\right)$. Détermine le plus grand intervalle $I$ sur lequel $k$ est dérivable, puis calcule $k'(x)$ sur $I$.`,
    questions: [
      { id: "log-root-domain", label: "2.a", points: 1, topicId: "log-derivative-summary", prompt: String.raw`Quelles sont les bornes de l’intervalle ouvert $I$ ?`, expected: "$-1<x<1$", answer: { kind: "interval", lower: -1, upper: 1, variable: "x" },
        correction: String.raw`Il faut que la racine existe et qu’elle soit **strictement positive** pour entrer dans le logarithme : $1-x^2>0$. Cela équivaut à $-1<x<1$. **Donc $I=]-1;1[$.** Les bornes sont exclues, car la racine y vaut zéro.` },
      { id: "log-root-derivative-half", label: "2.b", points: 1, topicId: "log-derivative-summary", prompt: String.raw`À partir de ta formule de $k'$, calcule $k'(1/2)$.`, expected: String.raw`$-\dfrac23$`, answer: { kind: "short", accepted: ["-2/3"] },
        correction: String.raw`Sur $]-1;1[$, $k(x)=\frac12\ln(1-x^2)$, donc $k'(x)=\frac12\times(-2x)/(1-x^2)=-x/(1-x^2)$.

En $1/2$, on obtient $k'(1/2)=-(1/2)/(1-1/4)=-(1/2)/(3/4)=\boxed{-2/3}$.` },
    ],
    writtenTasks: [{ id: "log-root-derivative-writing", topicId: "log-derivative-summary", beforeQuestionId: "log-root-domain", prompt: "Rédige l’étude du domaine et le calcul de la dérivée.",
      model: String.raw`### a) Domaine

La racine doit être strictement positive : $1-x^2>0$. On obtient **$I=]-1;1[$**. Sur cet intervalle, la racine est dérivable et son image est positive, donc le logarithme composé est dérivable.

### b) Dérivée

Puisque $1-x^2>0$, on peut écrire :

$$k(x)=\frac12\ln(1-x^2).$$

Avec $u(x)=1-x^2$ et $u'(x)=-2x$ :

$$\boxed{k'(x)=\frac12\frac{-2x}{1-x^2}=-\frac{x}{1-x^2}.}$$

On peut vérifier le résultat en dérivant d’abord la racine, puis en divisant par cette même racine.`,
      criteria: ["Je résous 1 − x² > 0, pas seulement ≥ 0.", "J’exclus les deux bornes −1 et 1.", "Je conserve les facteurs 1/2 et −2x avant de simplifier."],
    }],
  },
  {
    id: "log-primitive-evaluation", title: String.raw`Reconnaître la forme $u'/u$`, pages: [105],
    method: String.raw`1. Identifie le dénominateur $u$ et vérifie qu’il ne s’annule pas sur l’intervalle.
2. Calcule $u'$ et ajuste le coefficient pour retrouver $u'/u$.
3. Utilise $\ln|u|$, puis simplifie la valeur absolue selon le signe de $u$.
4. Ajoute une constante et vérifie par dérivation.`,
    examples: [{ id: "log-negative-affine-primitive-worked", title: "Exemple corrigé", prompt: String.raw`Déterminons toutes les primitives de $f(x)=1/(5x-1)$ sur $]-\infty;1/5[$.`,
      solution: String.raw`Posons $u=5x-1$, donc $u'=5$. On écrit $f=(1/5)u'/u$. Les primitives sont donc $F(x)=(1/5)\ln|5x-1|+C$.

Sur l’intervalle, $5x-1<0$, donc $|5x-1|=1-5x$ :

$$\boxed{F(x)=\frac15\ln(1-5x)+C.}$$

Vérifions le signe : $F'(x)=\frac15\times(-5)/(1-5x)=-1/(1-5x)=1/(5x-1)$.` }],
    statement: String.raw`Détermine toutes les primitives de $f(x)=x^2/(x^3-1)$ sur $]-\infty;1[$.`,
    questions: [{ id: "log-primitive-coefficient", label: "3", points: 1, topicId: "log-primitives-summary", prompt: String.raw`Avec $u(x)=x^3-1$, quel coefficient $a$ donne $f=a\,u'/u$ ?`, expected: String.raw`$\dfrac13$`, answer: { kind: "short", accepted: ["1/3"] },
      correction: String.raw`$u'(x)=3x^2$. Le numérateur de $f$ est $x^2$, donc on multiplie $u'/u$ par $1/3$ : **$a=1/3$**.` }],
    writtenTasks: [{ id: "log-cubic-primitive-writing", topicId: "log-primitives-summary", beforeQuestionId: "log-primitive-coefficient", prompt: "Rédige le calcul de la famille des primitives et vérifie par dérivation.",
      model: String.raw`Sur $]-\infty;1[$, $x^3-1<0$ et ne s’annule pas. Posons $u(x)=x^3-1$ ; alors $u'(x)=3x^2$ et :

$$f(x)=\frac13\frac{u'(x)}{u(x)}.$$

Les primitives sont $F(x)=\frac13\ln|x^3-1|+C$. Comme $|x^3-1|=1-x^3$ sur l’intervalle :

$$\boxed{F(x)=\frac13\ln(1-x^3)+C,\qquad C\in\mathbb R.}$$

Vérification : $F'(x)=\frac13\times(-3x^2)/(1-x^3)=x^2/(x^3-1)=f(x)$.`,
      criteria: ["Je choisis u = x³ − 1 et je calcule u′ = 3x².", "J’ajuste le coefficient 1/3.", "Je traite le signe de u et j’ajoute la constante."],
    }],
  },
];
