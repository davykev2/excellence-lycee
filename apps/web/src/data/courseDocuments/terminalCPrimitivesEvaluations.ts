import type { CourseEvaluationGroup } from "../../domain/courseDocument";

export const terminalCPrimitivesEvaluations: CourseEvaluationGroup[] = [
  {
    id: "primitive-verification-evaluation", title: "Vérifier qu’une fonction est une primitive", pages: [86],
    method: String.raw`1. Vérifie que la fonction proposée est dérivable sur l’intervalle.
2. Calcule sa dérivée, terme à terme.
3. Compare la dérivée obtenue à la fonction donnée et conclus.`,
    examples: [{ id: "primitive-verification-worked", title: "Exemple corrigé",
      prompt: String.raw`Justifions que $F(x)=x^5/5+2x^2-5x+3$ est une primitive de $g(x)=x^4+4x-5$ sur $\mathbb R$.`,
      solution: String.raw`$F$ est un polynôme, donc dérivable sur $\mathbb R$. On obtient :

$$F'(x)=\frac55x^4+2\times2x-5+0=x^4+4x-5.$$

Ainsi $F'(x)=g(x)$ pour tout réel $x$. **$F$ est donc une primitive de $g$ sur $\mathbb R$.**`,
    }],
    statement: String.raw`Soit $f(x)=x^3+7x-10$ et $g(x)=3x^2+7$. Justifie que $f$ est une primitive de $g$ sur $\mathbb R$.`,
    questions: [{ id: "primitive-verification-yes", label: "1", points: 1, topicId: "primitive-definition-summary",
      prompt: String.raw`A-t-on bien $f'=g$ sur $\mathbb R$ ? Réponds oui ou non.`,
      expected: "Oui.", answer: { kind: "short", accepted: ["oui"] },
      correction: String.raw`$f$ est un polynôme, donc dérivable sur $\mathbb R$. Sa dérivée est $f'(x)=3x^2+7$. C’est exactement $g(x)$ : **oui, $f$ est une primitive de $g$ sur $\mathbb R$.**`,
    }],
    writtenTasks: [{ id: "primitive-verification-writing", topicId: "primitive-definition-summary", beforeQuestionId: "primitive-verification-yes",
      prompt: "Rédige la vérification complète par dérivation.",
      model: String.raw`La fonction $f:x\mapsto x^3+7x-10$ est polynomiale, donc dérivable sur $\mathbb R$.

Pour tout $x\in\mathbb R$ :

$$f'(x)=(x^3)'+(7x)'-(10)'=3x^2+7-0=g(x).$$

**Par définition, $f$ est une primitive de $g$ sur $\mathbb R$.**`,
      criteria: ["Je justifie la dérivabilité de f.", "Je calcule f′, pas g′.", "Je compare f′ à g et je conclus sur R."],
    }],
  },
  {
    id: "primitive-existence-evaluation", title: "Justifier l’existence de primitives", pages: [86],
    method: "Indique l’intervalle étudié, justifie que la fonction y est continue, puis applique la propriété d’existence. Il n’est pas nécessaire de trouver une formule si la question demande seulement l’existence.",
    examples: [{ id: "primitive-root-existence-worked", title: "Exemple corrigé",
      prompt: String.raw`Justifions que $f(x)=1/\sqrt{x-1}$ admet des primitives sur $]1;+\infty[$.`,
      solution: String.raw`Pour $x>1$, $x-1>0$, donc $\sqrt{x-1}>0$. La fonction $x\mapsto\sqrt{x-1}$ est continue sur $]1;+\infty[$ et n’y est jamais nulle.

Son inverse $f:x\mapsto1/\sqrt{x-1}$ y est donc continue. **Puisque $]1;+\infty[$ est un intervalle, $f$ y admet des primitives.**

Le point $1$ est exclu : le dénominateur y serait nul.`,
    }],
    statement: String.raw`Justifie que $f(x)=x^2+3x-1$ admet des primitives sur $\mathbb R$.`,
    questions: [{ id: "primitive-polynomial-continuity", label: "2", points: 1, topicId: "primitive-existence-summary",
      prompt: String.raw`La fonction $f$ est-elle continue sur $\mathbb R$ ? Réponds oui ou non.`,
      expected: "Oui.", answer: { kind: "short", accepted: ["oui"] },
      correction: String.raw`Oui : $f$ est une fonction polynomiale. Elle est continue sur $\mathbb R$ et admet donc des primitives sur cet intervalle.`,
    }],
    writtenTasks: [{ id: "primitive-existence-writing", topicId: "primitive-existence-summary", beforeQuestionId: "primitive-polynomial-continuity",
      prompt: "Rédige la justification, sans avoir à chercher une primitive.",
      model: String.raw`$f:x\mapsto x^2+3x-1$ est une fonction polynomiale, donc continue sur $\mathbb R$.

Or toute fonction continue sur un intervalle admet des primitives sur cet intervalle. **Ainsi $f$ admet des primitives sur $\mathbb R$.**`,
      criteria: ["Je reconnais une fonction polynomiale.", "Je cite sa continuité sur R.", "J’applique la propriété sur un intervalle."],
    }],
  },
  {
    id: "primitive-initial-evaluation", title: "Déterminer la primitive prenant une valeur donnée", pages: [87],
    method: String.raw`1. Trouve une primitive $F_0$ à l’aide du tableau.
2. Écris toutes les primitives : $F=F_0+C$.
3. Remplace $x$ par l’abscisse donnée pour déterminer $C$.
4. Vérifie à la fois $F'=f$ et la valeur imposée.`,
    examples: [{ id: "primitive-polynomial-initial-worked", title: "Exemple corrigé",
      prompt: String.raw`Déterminons la primitive de $f(x)=x^3+2x^2-2x+3$ sur $\mathbb R$ qui s’annule en $1$.`,
      parts: [
        { id: "primitive-polynomial-initial-family", label: "a)", prompt: "Déterminer toutes les primitives.", solution: String.raw`$f$ est continue sur $\mathbb R$. On primitive chaque terme :

$$x^3\longmapsto\frac{x^4}4,\quad 2x^2\longmapsto\frac{2x^3}3,$$
$$-2x\longmapsto-x^2,\quad 3\longmapsto3x.$$

Donc $F(x)=x^4/4+2x^3/3-x^2+3x+C$.` },
        { id: "primitive-polynomial-initial-constant", label: "b)", prompt: "Imposer F(1) = 0.", solution: String.raw`En $1$, on obtient :

$$F(1)=\frac14+\frac23-1+3+C=\frac{35}{12}+C.$$

L’égalité $F(1)=0$ donne $C=-35/12$. **La primitive cherchée est :**

$$\boxed{F(x)=\frac{x^4}4+\frac{2x^3}3-x^2+3x-\frac{35}{12}.}$$

Sa dérivée est $f$ et sa valeur en $1$ est bien nulle.` },
      ],
    }],
    statement: String.raw`Détermine la primitive $F$ de $f(x)=1/\sqrt{x-1}$ sur $]1;+\infty[$ telle que $F(2)=3$.`,
    questions: [{ id: "primitive-root-initial-constant", label: "3", points: 1, topicId: "primitive-initial-summary",
      prompt: String.raw`On écrit $F(x)=2\sqrt{x-1}+C$. Quelle est la valeur de $C$ ?`,
      expected: "$1$", answer: { kind: "short", accepted: ["1"] },
      correction: String.raw`On remplace $x$ par $2$ : $F(2)=2\sqrt{2-1}+C=2+C$. La condition $F(2)=3$ donne $2+C=3$, donc **$C=1$**.`,
    }],
    writtenTasks: [{ id: "primitive-root-initial-writing", topicId: "primitive-initial-summary", beforeQuestionId: "primitive-root-initial-constant",
      prompt: "Écris la primitive cherchée et vérifie ta réponse.",
      model: String.raw`Sur $]1;+\infty[$, $x-1>0$. Posons $u(x)=x-1$ ; alors $u'(x)=1$. Le tableau donne toutes les primitives :

$$F(x)=2\sqrt{x-1}+C.$$

Comme $F(2)=3$, on résout $2\sqrt1+C=3$, soit $C=1$.

$$\boxed{F(x)=2\sqrt{x-1}+1.}$$

Vérifions : $F'(x)=2\times1/(2\sqrt{x-1})=f(x)$ et $F(2)=2+1=3$. **La continuité de $f$ sur l’intervalle garantit l’unicité de cette primitive avec la valeur imposée.**`,
      criteria: ["Je reconnais u′/√u et conserve le facteur 2.", "Je calcule la constante avec F(2) = 3.", "Je vérifie la dérivée et la condition initiale."],
    }],
  },
];
