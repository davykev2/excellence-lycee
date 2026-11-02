import type { CourseEvaluationGroup } from "../../domain/courseDocument";

/** Pyramide, folios 63–65 : modèles du support et corrections Excellence des trois applications. */
export const terminalCDerivativesEvaluations: CourseEvaluationGroup[] = [
  {
    id: "derivatives-junction-evaluation", title: "Étudier la dérivabilité à un raccord", pages: [65],
    method: String.raw`1. Calcule $f(a)$ avec la formule qui s’applique au point $a$.
2. Calcule séparément les limites du taux $\dfrac{f(x)-f(a)}{x-a}$ à gauche et à droite.
3. Compare les résultats : **deux limites finies égales** donnent la dérivabilité ; des limites différentes, infinies ou inexistantes l’excluent.

La continuité est nécessaire, mais elle ne suffit pas à assurer la dérivabilité.`,
    examples: [{
      id: "junction-source-worked", title: "Exemple corrigé · Un raccord dérivable",
      prompt: String.raw`Soit $f(x)=\sqrt{2-x}$ si $x\le1$, et $f(x)=\dfrac{5-x^2}{4}$ si $x>1$. Étudions sa dérivabilité en $1$.`,
      parts: [
        { id: "junction-worked-left", label: "a)", prompt: "À gauche de 1.", solution: String.raw`La formule applicable en $1$ donne $f(1)=\sqrt{2-1}=1$. Pour $x<1$, multiplions le numérateur et le dénominateur du taux par $\sqrt{2-x}+1$ :

$$\frac{\sqrt{2-x}-1}{x-1}
=\frac{(2-x)-1}{(x-1)(\sqrt{2-x}+1)}.$$

Comme $1-x=-(x-1)$ et $x\ne1$, le taux est :

$$-\frac1{\sqrt{2-x}+1}\longrightarrow-\frac12.$$

Quand $x\to1^-$, $\sqrt{2-x}+1\to2$. **Donc $f'_g(1)=-1/2$.**` },
        { id: "junction-worked-right", label: "b)", prompt: "À droite de 1.", solution: String.raw`Pour $x>1$ :

$$\frac{f(x)-f(1)}{x-1}=\frac{(5-x^2)/4-1}{x-1}
=\frac{1-x^2}{4(x-1)}.$$

On factorise $1-x^2=-(x-1)(x+1)$, puis on simplifie par $x-1$, qui n’est pas nul :

$$\frac{f(x)-f(1)}{x-1}=-\frac{x+1}{4}\longrightarrow-\frac12.$$

Quand $x\to1^+$, $-(x+1)/4\to-2/4=-1/2$. **Donc $f'_d(1)=-1/2$.**` },
        { id: "junction-worked-conclusion", label: "c)", prompt: "Conclusion.", solution: String.raw`On a $f'_g(1)=f'_d(1)=-1/2$. Les deux nombres sont finis : **$f$ est dérivable en $1$ et $f'(1)=-1/2$**.` },
      ],
    }],
    statement: String.raw`Soit $f$, définie sur $\mathbb R\setminus\{2\}$, par :

$$f(x)=\begin{cases}\dfrac1{2-x}&x\le3,\ x\ne2\\x^3-28&x>3.\end{cases}$$

**Étudie la dérivabilité de $f$ en $3$.**`,
    questions: [
      {
        id: "junction-at-three-left", label: "1.a", points: 1, topicId: "lateral-derivatives",
        prompt: String.raw`Quel est le nombre dérivé à gauche $f'_g(3)$ ?`,
        answer: { kind: "short", accepted: ["1"] }, expected: "$1$",
        correction: String.raw`**Calculons le taux d’accroissement à gauche de $3$.** La première expression donne :

$$f(3)=\frac1{2-3}=-1.$$

Pour $x<3$ assez proche de $3$, avec $x\ne3$ :

$$\frac{f(x)-f(3)}{x-3}=\frac{1/(2-x)+1}{x-3}.$$

Mettons au même dénominateur :

$$\frac1{2-x}+1=\frac{3-x}{2-x}=-\frac{x-3}{2-x}.$$

Après simplification par $x-3\ne0$ :

$$\frac{f(x)-f(3)}{x-3}=-\frac1{2-x}.$$

Quand $x\to3^-$, le dénominateur $2-x$ tend vers $-1$, qui n’est pas nul. Par la règle du quotient :

$$\boxed{f'_g(3)=-\frac1{-1}=1.}$$`,
      },
      {
        id: "junction-at-three-right", label: "1.b", points: 1, topicId: "lateral-derivatives",
        prompt: String.raw`Quel est le nombre dérivé à droite $f'_d(3)$ ?`,
        answer: { kind: "short", accepted: ["27"] }, expected: "$27$",
        correction: String.raw`À droite de $3$, on utilise $f(x)=x^3-28$, toujours avec $f(3)=-1$ :

$$\frac{f(x)-f(3)}{x-3}=\frac{x^3-27}{x-3}.$$

L’identité $x^3-3^3=(x-3)(x^2+3x+9)$ donne, pour $x\ne3$ :

$$\frac{f(x)-f(3)}{x-3}=x^2+3x+9.$$

Lorsque $x\to3^+$, cette expression tend vers $9+9+9=27$. **Donc $f'_d(3)=27$.**`,
      },
      {
        id: "junction-at-three-conclusion", label: "1.c", points: 1, topicId: "lateral-derivatives",
        prompt: String.raw`La fonction $f$ est-elle dérivable en $3$ ? Réponds oui ou non.`,
        answer: { kind: "short", accepted: ["non"] }, expected: "Non.",
        correction: String.raw`Les deux nombres dérivés latéraux existent, mais $1\ne27$. **La fonction n’est donc pas dérivable en $3$.**

Elle est pourtant continue : les deux expressions tendent vers $-1=f(3)$. Sa courbe possède en $A(3;-1)$ deux demi-tangentes de pentes différentes :

$$y=x-4\quad\text{à gauche},\qquad y=27x-82\quad\text{à droite}.$$`,
      },
    ],
    writtenTasks: [{
      id: "junction-at-three-writing", topicId: "lateral-derivatives",
      prompt: "Rédige la conclusion de l’étude en comparant les deux nombres dérivés latéraux.",
      model: String.raw`La formule valable en $3$ donne $f(3)=1/(2-3)=-1$.

### a) Nombre dérivé à gauche

Pour $x<3$ assez proche de $3$, on utilise $f(x)=1/(2-x)$ :

$$\frac{f(x)-f(3)}{x-3}
=\frac{1/(2-x)+1}{x-3}.$$

On met le numérateur au même dénominateur :

$$\frac1{2-x}+1=\frac{1+2-x}{2-x}=\frac{3-x}{2-x}.$$

Comme $3-x=-(x-3)$, on simplifie le taux par $x-3\ne0$ :

$$\frac{f(x)-f(3)}{x-3}=-\frac1{2-x}.$$

Quand $x\to3^-$, cette expression tend vers $-1/(-1)=1$. Donc $f'_g(3)=1$.

### b) Nombre dérivé à droite

Pour $x>3$, on utilise $f(x)=x^3-28$, mais la valeur au raccord reste $f(3)=-1$ :

$$\frac{f(x)-f(3)}{x-3}
=\frac{x^3-27}{x-3}.$$

On factorise la différence de deux cubes :

$$x^3-27=(x-3)(x^2+3x+9).$$

Puis on simplifie par $x-3\ne0$ :

$$\frac{f(x)-f(3)}{x-3}=x^2+3x+9.$$

Quand $x\to3^+$, on obtient $3^2+3\times3+9=27$. Donc $f'_d(3)=27$.

### c) Conclusion

Les deux nombres dérivés latéraux sont finis, mais ils sont différents : $1\ne27$.

**La fonction $f$ n’est donc pas dérivable en $3$.**`,
      criteria: ["J’utilise f(3) = −1 des deux côtés.", "Je calcule les deux taux et leurs limites.", "Je compare 1 et 27 avant de conclure."],
      beforeQuestionId: "junction-at-three-left",
    }],
  },
  {
    id: "inflection-evaluation", title: "Justifier l’existence d’un point d’inflexion", pages: [66],
    method: String.raw`1. Calcule la dérivée première $f'$, puis la dérivée seconde $f''$.
2. Résous $f''(x)=0$ dans l’intervalle étudié.
3. Pour chaque solution, vérifie que $f''$ **change de signe**.
4. Calcule $f(a)$ et conclus avec les coordonnées $A(a;f(a))$.

Ne t’arrête pas à $f''(a)=0$ : sans changement de signe, on ne peut pas appliquer la propriété.`,
    examples: [{
      id: "cosine-inflection-worked", title: "Exemple corrigé · La fonction cosinus",
      prompt: String.raw`Soit $f(x)=\cos x$ sur $[0;\pi]$. Déterminons un point d’inflexion de sa courbe.`,
      parts: [
        { id: "cosine-inflection-derivatives", label: "a)", prompt: "Calculer les deux dérivées.", solution: String.raw`Le cosinus est deux fois dérivable. Sa dérivée est l’opposé du sinus, donc $f'(x)=-\sin x$. On dérive ensuite **$f'$** : la dérivée de $-\sin x$ est $-\cos x$.

$$\boxed{f'(x)=-\sin x\quad\text{et}\quad f''(x)=-\cos x.}$$` },
        { id: "cosine-inflection-sign", label: "b)", prompt: "Étudier le zéro et le signe de la dérivée seconde.", solution: String.raw`Sur $[0;\pi]$, $-\cos x=0$ équivaut à $x=\pi/2$.

| $x$ | $[0;\pi/2[$ | $\pi/2$ | $]\pi/2;\pi]$ |
| --- | --- | --- | --- |
| $f''(x)$ | $-$ | $0$ | $+$ |

Ainsi $f''$ s’annule en $\pi/2$ **en changeant de signe**.` },
        { id: "cosine-inflection-point", label: "c)", prompt: "Donner les coordonnées du point.", solution: String.raw`Comme $f(\pi/2)=0$, **$A(\pi/2;0)$ est un point d’inflexion** de la courbe.` },
      ],
    }],
    statement: String.raw`Soit $f(x)=\tan x$ sur $]-\pi/2;\pi/2[$. Détermine un point d’inflexion de sa courbe et justifie ta réponse.`,
    questions: [{
      id: "tangent-inflection-abscissa", label: "2", points: 1, topicId: "inflection-point",
      prompt: "Quelle est l’abscisse du point d’inflexion ?",
      answer: { kind: "short", accepted: ["0"] }, expected: "$0$",
      correction: String.raw`**Calculons les deux dérivées, puis étudions le signe de la seconde.** La fonction tangente est deux fois dérivable sur $I=]-\pi/2;\pi/2[$ et :

$$f'(x)=\frac1{\cos^2x}=(\cos x)^{-2}.$$

On dérive cette composée : l’expression extérieure est une puissance d’exposant $-2$, et la dérivée de $\cos x$ est $-\sin x$. Ainsi :

$$f''(x)=-2(\cos x)^{-3}(-\sin x)
=\frac{2\sin x}{\cos^3x}.$$

Sur $I$, $\cos x>0$ : le dénominateur est strictement positif. La dérivée seconde a donc le signe de $\sin x$, qui est négatif à gauche de $0$ et positif à droite :

| $x$ | $]-\pi/2;0[$ | $0$ | $]0;\pi/2[$ |
| --- | --- | --- | --- |
| $f''(x)$ | $-$ | $0$ | $+$ |

$f''$ s’annule en $0$ en changeant de signe. Comme $f(0)=0$, **le point d’inflexion est $O(0;0)$**.`,
    }],
    writtenTasks: [{
      id: "tangent-inflection-writing", beforeQuestionId: "tangent-inflection-abscissa", topicId: "inflection-point",
      prompt: "Rédige l’étude du signe de la dérivée seconde et la conclusion avec les coordonnées du point.",
      model: String.raw`La fonction $f(x)=\tan x$ est deux fois dérivable sur $I=]-\pi/2;\pi/2[$. Pour $x\in I$ :

$$f'(x)=(\cos x)^{-2}.$$

En dérivant cette composée :

$$f''(x)=-2(\cos x)^{-3}(-\sin x)=\frac{2\sin x}{\cos^3x}.$$

Sur $I$, $\cos x>0$, donc $\cos^3x>0$. La dérivée seconde a le signe de $\sin x$ :

| $x$ | $]-\pi/2;0[$ | $0$ | $]0;\pi/2[$ |
| --- | --- | --- | --- |
| $\sin x$, donc $f''(x)$ | $-$ | $0$ | $+$ |

La dérivée seconde s’annule donc en $0$ en changeant de signe. Puisque $f(0)=0$, **$O(0;0)$ est un point d’inflexion**.`,
      criteria: ["Je calcule f′ puis f″.", "Je justifie le signe positif de cos x dans l’intervalle.", "Je vérifie le changement de signe de f″.", "Je donne les deux coordonnées du point."],
    }],
  },
  {
    id: "inverse-derivative-evaluation", title: "Calculer le nombre dérivé d’une réciproque", pages: [67],
    method: String.raw`Pour calculer $(f^{-1})'(b)$ :

1. Résous $f(a)=b$ dans l’intervalle où $f$ est bijective.
2. Calcule $f'(a)$ et vérifie qu’il est non nul.
3. Utilise $(f^{-1})'(b)=1/f'(a)$.

Il n’est pas nécessaire de trouver une formule de $f^{-1}$ sur tout son domaine.`,
    examples: [{
      id: "inverse-root-worked", title: "Exemple corrigé · Une racine carrée",
      prompt: String.raw`La fonction $f:x\mapsto\sqrt{2x-1}$ est bijective de $]1/2;+\infty[$ sur $]0;+\infty[$. Calculons $(f^{-1})'(2)$.`,
      parts: [
        { id: "inverse-root-antecedent", label: "a)", prompt: "Chercher l’antécédent de 2.", solution: String.raw`On résout $\sqrt{2x-1}=2$. Les deux membres étant positifs, on peut élever au carré :

$$2x-1=4\iff x=\frac52.$$

Ainsi $f^{-1}(2)=5/2$.` },
        { id: "inverse-root-derivative", label: "b)", prompt: "Calculer la dérivée au bon point.", solution: String.raw`On pose $u(x)=2x-1$. Pour $x>1/2$, $u(x)>0$ et $u'(x)=2$. La règle de dérivation de $\sqrt u$ donne :

$$f'(x)=\frac{u'(x)}{2\sqrt{u(x)}}
=\frac2{2\sqrt{2x-1}}
=\frac1{\sqrt{2x-1}}.$$

On remplace ensuite $x$ par $5/2$ :

$$f'(5/2)=\frac1{\sqrt{2\times5/2-1}}=\frac12\ne0.$$` },
        { id: "inverse-root-conclusion", label: "c)", prompt: "Conclure.", solution: String.raw`La réciproque est dérivable en $2$ et :

$$(f^{-1})'(2)=\frac1{f'(5/2)}=\frac1{1/2}=\boxed2.$$` },
      ],
    }],
    statement: String.raw`Soit $f:x\mapsto\sin x$, bijection de $]0;\pi/2[$ sur $]0;1[$. On note $f^{-1}$ sa réciproque.`,
    questions: [{
      id: "inverse-sine-root-three", label: "3", points: 1, topicId: "inverse-derivative-summary",
      prompt: String.raw`Détermine $(f^{-1})'\!\left(\dfrac{\sqrt3}{2}\right)$.`,
      answer: { kind: "short", accepted: ["2"] }, expected: "$2$",
      correction: String.raw`### a) Chercher l’antécédent

On cherche le nombre $a\in]0;\pi/2[$ tel que $f(a)=\sqrt3/2$. Or $\sin(\pi/3)=\sqrt3/2$. Puisque $f$ est bijective sur l’intervalle étudié :

$$f^{-1}\!\left(\frac{\sqrt3}{2}\right)=\frac\pi3.$$

### b) Calculer la dérivée au bon point

Comme $f(x)=\sin x$, on a $f'(x)=\cos x$. Au point $a=\pi/3$ :

$$f'(\pi/3)=\cos(\pi/3)=\frac12\ne0.$$

### c) Appliquer la formule de la réciproque

La dérivée trouvée n’est pas nulle : $f^{-1}$ est donc dérivable en $\sqrt3/2$. On applique $(f^{-1})'(b)=1/f'(f^{-1}(b))$ :

$$(f^{-1})'\!\left(\frac{\sqrt3}{2}\right)=\frac1{f'(\pi/3)}
=\frac1{1/2}
=\boxed2.$$`,
    }],
  },
];
