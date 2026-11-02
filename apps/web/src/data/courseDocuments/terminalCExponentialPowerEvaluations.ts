import type { CourseEvaluationGroup } from "../../domain/courseDocument";

export const terminalCExponentialPowerEvaluations: CourseEvaluationGroup[] = [
  { id: "exp-domain-evaluation", title: "Déterminer le domaine de définition", pages: [129],
    method: String.raw`1. Identifie l’exposant $u(x)$.
2. Détermine son domaine : racine définie, logarithme positif, dénominateur non nul.
3. Conclus : $e^{u(x)}$ existe exactement lorsque $u(x)$ existe.`,
    examples: [{ id: "exp-domain-worked", title: "Exemple corrigé", prompt: String.raw`Déterminons le domaine de $f(x)=e^{\sqrt{2-3x}}$.`, solution: String.raw`La racine existe si et seulement si $2-3x\ge0$.

$$-3x\ge-2\iff x\le\frac23.$$

On a inversé le sens de l’inégalité en divisant par $-3$. L’exponentielle n’ajoute pas de restriction, même lorsque la racine vaut $0$ : **$D_f=]-\infty;2/3]$.**` }],
    statement: String.raw`Détermine le domaine de $g(x)=e^{1/(2-\sqrt x)}$.`, questions: [],
    writtenTasks: [{ id: "exp-domain-writing", topicId: "exp-derivative-summary", prompt: "Rédige les conditions de définition et donne le domaine.", model: String.raw`### a) La racine

$\sqrt x$ existe pour $x\ge0$.

### b) Le dénominateur

Il faut $2-\sqrt x\ne0$. Avec $x\ge0$, cela donne $\sqrt x\ne2$, soit **$x\ne4$**.

### c) Conclusion

L’exponentielle est définie pour toute valeur réelle de son exposant. **$D_g=[0;4[\,\cup\,]4;+\infty[$.** Le nombre $0$ est admis ; seul $4$ est retiré des réels positifs.`, criteria: ["J’impose x ≥ 0 pour la racine.", "J’exclus x = 4, où le dénominateur s’annule.", "Je n’ajoute aucune restriction de signe à l’exposant."] }],
  },
  { id: "exp-equation-evaluation", title: "Résoudre une équation exponentielle", pages: [129],
    method: String.raw`1. Vérifie le domaine et la positivité du membre égal à une exponentielle.
2. Écris les deux membres sous la forme $e^a=e^b$.
3. Résous $a=b$, puis vérifie les solutions.`,
    examples: [{ id: "exp-linear-equation-worked", title: "Exemple corrigé", prompt: String.raw`Résolvons $e^{2x-1}=6$.`, solution: String.raw`Comme $6>0$, on écrit $6=e^{\ln6}$. Par injectivité de l’exponentielle :

$$e^{2x-1}=e^{\ln6}\iff2x-1=\ln6.$$
$$2x=1+\ln6\iff\boxed{x=\frac{1+\ln6}{2}.}$$

Cette valeur est réelle et vérifie l’équation ; c’est l’unique solution.` }],
    statement: String.raw`Résous dans $\mathbb R$ l’équation $e^{x^2-1}=3$.`,
    questions: [{ id: "exp-equation-positive-root", label: "2.a", topicId: "exp-definition-summary", points: 1, prompt: "Donne la solution positive.", expected: String.raw`$\sqrt{1+\ln3}$`, answer: { kind: "short", accepted: ["sqrt(1+ln(3))", "sqrt(1+ln3)", "sqrt(ln(3)+1)", "sqrt(ln3+1)", "√(1+ln(3))"] }, correction: String.raw`$3>0$, donc $x^2-1=\ln3$. On obtient $x^2=1+\ln3>0$. **La racine positive est $\sqrt{1+\ln3}$.**` },
      { id: "exp-equation-negative-root", label: "2.b", topicId: "exp-definition-summary", points: 1, prompt: "Donne la solution négative.", expected: String.raw`$-\sqrt{1+\ln3}$`, answer: { kind: "short", accepted: ["-sqrt(1+ln(3))", "-sqrt(1+ln3)", "-sqrt(ln(3)+1)", "-sqrt(ln3+1)", "-√(1+ln(3))"] }, correction: String.raw`L’équation $x^2=A$ avec $A>0$ a deux solutions opposées. **La seconde est $-\sqrt{1+\ln3}$.** Il ne faut pas la perdre en prenant la racine carrée.` }],
  },
  { id: "exp-inequality-evaluation", title: "Résoudre une inéquation exponentielle", pages: [130],
    method: String.raw`1. Mets les deux membres sous la même base exponentielle.
2. Utilise la stricte croissance de $\exp$ pour comparer les exposants.
3. Résous l’inéquation obtenue. Si tu divises par un nombre négatif, inverse le sens.`,
    examples: [{ id: "exp-linear-inequality-worked", title: "Exemple corrigé", prompt: String.raw`Résolvons $e^{-3x-1}>3$.`, solution: String.raw`$3=e^{\ln3}$. Comme $\exp$ est strictement croissante :

$$-3x-1>\ln3\iff-3x>1+\ln3.$$

On divise par $-3$, ce qui inverse le sens :

$$\boxed{x<\frac{-1-\ln3}{3}.}$$

La borne est exclue puisque l’inégalité est stricte.` }],
    statement: String.raw`Résous dans $\mathbb R$ l’inéquation $e^{2x^2-1}>1$.`, questions: [],
    writtenTasks: [{ id: "exp-inequality-writing", topicId: "exp-definition-summary", prompt: "Rédige l’ensemble des solutions.", model: String.raw`Puisque $1=e^0$ et que l’exponentielle est strictement croissante :

$$e^{2x^2-1}>1\iff2x^2-1>0\iff x^2>\frac12.$$

Un carré est supérieur à $1/2$ lorsque $x$ est à l’extérieur des deux racines : $x<-1/\sqrt2$ ou $x>1/\sqrt2$.

$$\boxed{S=]-\infty;-1/\sqrt2[\,\cup\,]1/\sqrt2;+\infty[.}$$

Les deux bornes ne sont pas solutions : en ces points, l’exponentielle vaut exactement $1$.`, criteria: ["J’écris 1 = e⁰.", "Je conserve les deux intervalles extérieurs.", "J’exclus les deux racines car l’inégalité est stricte."] }],
  },
  { id: "exp-quadratic-evaluation", title: "Poser X = e puissance x", pages: [130],
    method: String.raw`1. Pose $X=e^x$ et rappelle **$X>0$**.
2. Résous le polynôme en $X$.
3. Rejette les racines non positives.
4. Pour chaque racine $X>0$, écris $x=\ln X$.`,
    examples: [{ id: "exp-quadratic-equation-worked", title: "Exemple corrigé", prompt: String.raw`Résolvons $3e^{2x}-5e^x+2=0$.`, solution: String.raw`Avec $X=e^x>0$, l’équation devient :

$$3X^2-5X+2=0\iff(3X-2)(X-1)=0.$$

Les deux racines $X=2/3$ et $X=1$ sont positives, donc toutes deux sont admises. On revient à $x$ :

$$e^x=2/3\iff x=\ln(2/3),\qquad e^x=1\iff x=0.$$

**$S=\{0;\ln(2/3)\}$.**` }],
    statement: String.raw`Résous $e^{2x}-2e^x=15$.`,
    questions: [{ id: "exp-quadratic-positive", label: "4.a", points: 1, topicId: "exp-base-summary", prompt: String.raw`Quelle est la racine admissible $X=e^x$ ?`, expected: "$5$", answer: { kind: "short", accepted: ["5"] }, correction: String.raw`On écrit $X^2-2X-15=0$, soit $(X-5)(X+3)=0$. Les racines sont $5$ et $-3$. **Seule $5$ est positive** et peut être égale à $e^x$.` },
      { id: "exp-quadratic-x", label: "4.b", points: 1, topicId: "exp-base-summary", prompt: "Quelle est la solution x ?", expected: String.raw`$\ln5$`, answer: { kind: "short", accepted: ["ln(5)", "ln5"] }, correction: String.raw`$e^x=5$ équivaut à **$x=\ln5$**. Vérification : $25-2\times5=15$, donc la valeur convient.` }],
  },
];
