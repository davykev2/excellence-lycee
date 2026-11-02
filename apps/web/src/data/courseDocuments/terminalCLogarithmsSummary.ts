import type { CourseDocumentSection } from "../../domain/courseDocument";

/** Pyramide TC tome 1 : folios 99–101, pages PDF 101–103. */
export const terminalCLogarithmsSummary: CourseDocumentSection[] = [
  {
    id: "log-definition-section", numeral: "I", title: "Définition et propriétés",
    topics: [{
      id: "log-definition-summary", title: "Le logarithme népérien", pages: [101], legacyLessonIds: ["natural-log-definition"],
      body: String.raw`La **fonction logarithme népérien**, notée $\ln$, est l’unique primitive de $x\mapsto1/x$ sur $]0;+\infty[$ qui prend la valeur $0$ en $1$.

### Conséquences

- Son domaine de définition est **$]0;+\infty[$** : on ne calcule pas le logarithme réel de $0$ ou d’un nombre négatif.
- Elle est dérivable sur cet intervalle et $\boxed{\ln'(x)=1/x}$.
- Comme $1/x>0$ pour $x>0$, elle est **strictement croissante**.
- On a $\boxed{\ln1=0}$.

Pour comparer deux logarithmes, on peut donc comparer leurs arguments, **à condition qu’ils soient strictement positifs**.`,
      examples: [{ id: "log-definition-examples", title: "Comparer et dériver", prompt: "Appliquons les premières propriétés.", parts: [
        { id: "log-compare-six-ten", label: "a)", prompt: String.raw`Comparer $\ln6$ et $\ln10$.`, solution: String.raw`Les nombres $6$ et $10$ sont positifs et $6<10$. La fonction $\ln$ est strictement croissante, donc **$\ln6<\ln10$**.` },
        { id: "log-derivative-third", label: "b)", prompt: String.raw`Calculer $\ln'(1/3)$.`, solution: String.raw`Il s’agit de la **dérivée** en $1/3$, et non du logarithme de $1/3$. On utilise $\ln'(x)=1/x$ :

$$\ln'(1/3)=\frac1{1/3}=3.$$` },
      ] }],
    }],
  },
  {
    id: "log-algebra-section", numeral: "II", title: "Propriétés algébriques",
    topics: [{
      id: "log-algebra-summary", title: "Produit, quotient et puissance", pages: [101], legacyLessonIds: ["log-algebra", "log-equations"],
      body: String.raw`### Propriété fondamentale

Pour tous réels **$a>0$ et $b>0$** :

$$\boxed{\ln(ab)=\ln a+\ln b.}$$

### Conséquences

Pour $a>0$, $b>0$ et $r\in\mathbb Q$ :

$$\ln\left(\frac1a\right)=-\ln a,$$
$$\ln\left(\frac ab\right)=\ln a-\ln b,$$
$$\ln(a^r)=r\ln a.$$

Le logarithme transforme un **produit en somme**, pas une somme en somme : en général, $\ln(a+b)\ne\ln a+\ln b$.

### Pour les équations et inéquations

Sur les arguments positifs, la stricte croissance donne :

$$\ln a=\ln b\iff a=b,\qquad\ln a<\ln b\iff a<b.$$

On commence toujours par les **conditions de définition**, puis on garde seulement les solutions qui les respectent.`,
      examples: [
        { id: "log-products-examples", title: "Développer un logarithme", prompt: "Écrivons chaque logarithme comme une somme.", parts: [
          { id: "log-product-four-nine", label: "a)", prompt: String.raw`$\ln(4\times9)$.`, solution: String.raw`Les facteurs $4$ et $9$ sont positifs. Par la propriété fondamentale : **$\ln(4\times9)=\ln4+\ln9$.**` },
          { id: "log-product-seven-pi", label: "b)", prompt: String.raw`$\ln(7\pi)$.`, solution: String.raw`$7>0$ et $\pi>0$. On peut donc écrire **$\ln(7\pi)=\ln7+\ln\pi$.**` },
        ] },
        { id: "log-consequences-examples", title: "Inverse, quotient et racine", prompt: "Appliquons les trois conséquences.", parts: [
          { id: "log-inverse-three", label: "a)", prompt: String.raw`$\ln(1/3)$.`, solution: String.raw`Avec $a=3>0$, la formule de l’inverse donne **$\ln(1/3)=-\ln3$.**` },
          { id: "log-quotient-seven-four", label: "b)", prompt: String.raw`$\ln(7/4)$.`, solution: String.raw`Les deux nombres sont positifs. La formule du quotient donne **$\ln(7/4)=\ln7-\ln4$.**` },
          { id: "log-root-two", label: "c)", prompt: String.raw`$\ln(\sqrt2)$.`, solution: String.raw`Comme $\sqrt2=2^{1/2}$, la formule des puissances donne **$\ln(\sqrt2)=\frac12\ln2$.**` },
        ] },
      ],
    }],
  },
  {
    id: "log-study-section", numeral: "III", title: "Étude de la fonction logarithme népérien",
    topics: [
      {
        id: "log-e-summary", title: "Sens de variation et nombre e", pages: [101, 102],
        body: String.raw`$\ln$ est dérivable et strictement croissante sur $]0;+\infty[$. Elle réalise une **bijection de $]0;+\infty[$ sur $\mathbb R$** : tout nombre réel possède un unique antécédent par $\ln$.

On note **$e$** l’unique réel strictement positif dont le logarithme vaut $1$ :

$$\boxed{\ln e=1,\qquad\ln(1/e)=-1.}$$

$e$ est la base du logarithme népérien. C’est un nombre irrationnel ; $e\approx2{,}71828182846$. La notation $e$ a été introduite par Euler.

En particulier, pour un exposant rationnel $r$, $\ln(e^r)=r$.`,
        examples: [{ id: "log-e-examples", title: "Calculer avec le nombre e", prompt: "Utilisons la propriété des puissances.", parts: [
          { id: "log-e-fifth", label: "a)", prompt: String.raw`Calculer $\ln(e^5)$.`, solution: String.raw`$e>0$ et $\ln e=1$. Donc $\ln(e^5)=5\ln e=5\times1=\boxed5$.` },
          { id: "log-e-expression", label: "b)", prompt: String.raw`Calculer $\ln(e^2)+(\ln e)^2$.`, solution: String.raw`On calcule séparément : $\ln(e^2)=2\ln e=2$ et $(\ln e)^2=1^2=1$. La somme vaut donc **$2+1=3$**.` },
        ] }],
      },
      {
        id: "log-limits-summary", title: "Limites de référence", pages: [102],
        legacyLessonIds: ["log-limits", "log-limit-fixation-workshop", "revenue-log-mission", "official-log-workshop", "log-rational-function-mission"],
        body: String.raw`Les limites en $0$ se prennent **à droite**, car $\ln$ n’est définie que pour $x>0$.

$$\lim_{x\to+\infty}\ln x=+\infty,\qquad\lim_{x\to0^+}\ln x=-\infty.$$
$$\lim_{x\to0^+}x\ln x=0,\qquad\lim_{x\to+\infty}\frac{\ln x}{x}=0.$$
$$\lim_{x\to1}\frac{\ln x}{x-1}=1,\qquad\lim_{h\to0}\frac{\ln(1+h)}h=1.$$

La dernière limite est le nombre dérivé de $\ln$ en $1$, avec le changement de variable $x=1+h$.

Dans une forme indéterminée, on transforme l’expression pour faire apparaître une de ces limites. On ne conclut pas directement avec $+\infty-\infty$ ou $0\times\infty$.`,
        examples: [{ id: "log-limit-examples", title: "Lever une forme indéterminée", prompt: "Calculons les deux limites du support.", parts: [
          { id: "log-square-difference-limit", label: "a)", prompt: String.raw`$\displaystyle\lim_{x\to+\infty}(x^2-\ln x)$.`, solution: String.raw`On factorise par $x^2>0$ :

$$x^2-\ln x=x^2\left(1-\frac1x\frac{\ln x}{x}\right).$$

Car :

$$\begin{cases}x^2\to+\infty,\\1/x\to0,\\(\ln x)/x\to0.\end{cases}$$

La parenthèse tend donc vers $1>0$. **Le produit tend vers $+\infty$.**` },
          { id: "log-reciprocal-log-limit", label: "b)", prompt: String.raw`$\displaystyle\lim_{x\to0^+}\left(\ln x+\frac1{\ln x}\right)$.`, solution: String.raw`Lorsque $x\to0^+$, $\ln x\to-\infty$, donc $1/\ln x\to0$. On additionne une expression qui tend vers $-\infty$ et une autre qui tend vers $0$ : **la limite vaut $-\infty$**.

Le point $x=1$, où $\ln x=0$, est exclu du domaine de cette expression, mais il ne gêne pas l’étude au voisinage de $0$.` },
        ] }],
      },
      {
        id: "log-graph-summary", title: "Tableau de variation et courbe", pages: [102],
        body: String.raw`| $x$ | $0^+$ | $]0;+\infty[$ | $+\infty$ |
| --- | --- | --- | --- |
| $\ln'(x)=1/x$ | | $+$ | |
| $\ln x$ | $-\infty$ | strictement croissante | $+\infty$ |

La courbe passe par **$A(1;0)$** et **$B(e;1)$**. L’axe d’équation $x=0$ est une asymptote verticale.

- En $A$, la pente est $\ln'(1)=1$ : la tangente est $y=x-1$.
- En $B$, la pente est $\ln'(e)=1/e$ : la tangente est $y=x/e$.

Le logarithme est négatif sur $]0;1[$, nul en $1$ et positif sur $]1;+\infty[$.`,
        interaction: {
          kind: "curve", eyebrow: "Observer", title: "La courbe de ln et ses deux tangentes",
          instruction: "Déplace le point entre 0 et 8 pour lire les valeurs de ln.",
          observation: "La courbe croît, traverse (1 ; 0) et (e ; 1), et descend sans borne près de 0.",
          formula: "f(x) = ln(x)", formulaTex: String.raw`f(x)=\ln x`,
          rule: { kind: "affine-plus-log", slope: 0, intercept: 0, coefficient: 1 },
          window: { xMin: -.5, xMax: 8, yMin: -4, yMax: 4 },
          guides: [{ kind: "vertical", value: 0, label: "x = 0" }, { kind: "oblique", slope: 1, intercept: -1, label: "y = x − 1" }, { kind: "oblique", slope: 1 / Math.E, intercept: 0, label: "y = x/e" }],
          marker: { min: .05, max: 8, step: .05, initial: 1 },
        },
      },
    ],
  },
  {
    id: "log-composite-section", numeral: "IV", title: String.raw`Fonctions du type $\ln u$ ou $\ln|u|$`,
    topics: [
      {
        id: "log-derivative-summary", title: "Dériver un logarithme composé", pages: [102, 103], legacyLessonIds: ["log-derivative"],
        body: String.raw`### Fonction $\ln u$

Si $u$ est dérivable sur un intervalle $I$ et **$u(x)>0$ pour tout $x\in I$**, alors $\ln u$ est dérivable sur $I$ et :

$$\boxed{(\ln u)'=\frac{u'}u.}$$

### Fonction $\ln|u|$

Si $u$ est dérivable et **ne s’annule pas** sur $I$, alors $\ln|u|$ y est dérivable et :

$$\boxed{(\ln|u|)'=\frac{u'}u.}$$

Lorsque $u<0$, on a $|u|=-u$ et $\ln|u|=\ln(-u)$. La dérivée vaut $(-u)'/(-u)=u'/u$.

On détermine donc le domaine **avant** d’appliquer la formule.`,
        examples: [{ id: "log-composite-derivatives", title: "Deux logarithmes composés", prompt: "Calculons les dérivées sur les intervalles indiqués.", parts: [
          { id: "log-affine-derivative", label: "a)", prompt: String.raw`$f(x)=\ln(5x-2)$, $I=]2/5;+\infty[$.`, solution: String.raw`Pour $x>2/5$, $5x-2>0$. Posons $u(x)=5x-2$, donc $u'(x)=5$. Ainsi :

$$\boxed{f'(x)=\frac5{5x-2}.}$$` },
          { id: "log-negative-argument-absolute", label: "b)", prompt: String.raw`$f(x)=\ln|2x-x^2|$, $I=]2;+\infty[$.`, solution: String.raw`Pour $x>2$, $2x-x^2=x(2-x)<0$, mais sa valeur absolue est positive. Avec $u=2x-x^2$, on a $u'=2-2x$ et $u\ne0$ sur $I$.

$$\boxed{f'(x)=\frac{2-2x}{2x-x^2}.}$$

On pourrait aussi écrire $f(x)=\ln(x^2-2x)$ sur cet intervalle ; la dérivée obtenue est la même.` },
        ] }],
      },
      {
        id: "log-primitives-summary", title: String.raw`Primitiver une fonction de type $u'/u$`, pages: [103], legacyLessonIds: ["log-primitives"],
        body: String.raw`Soit $u$ dérivable et ne s’annulant pas sur un intervalle $I$. **Toutes les primitives de $u'/u$ sur $I$ sont :**

$$\boxed{\ln|u|+C,\qquad C\in\mathbb R.}$$

Si $u>0$, on écrit simplement $\ln u+C$. Si $u<0$, on écrit $\ln(-u)+C$.

Pour reconnaître la forme, on nomme le dénominateur $u$, on calcule $u'$, puis on ajuste un coefficient constant. **La puissance du dénominateur est 1** dans cette formule.`,
        examples: [{ id: "log-primitives-examples", title: "Reconnaître la forme u′/u", prompt: "Déterminons toutes les primitives sur I.", parts: [
          { id: "log-primitive-affine", label: "a)", prompt: String.raw`$f(x)=2/(2x-3)$, $I=]3/2;+\infty[$.`, solution: String.raw`Posons $u=2x-3>0$ sur $I$ ; sa dérivée est $u'=2$. On reconnaît exactement $u'/u$ :

$$\boxed{F(x)=\ln(2x-3)+C.}$$

Vérification : $F'(x)=2/(2x-3)=f(x)$.` },
          { id: "log-primitive-quadratic", label: "b)", prompt: String.raw`$f(x)=(2x+1)/(x^2+x+1)$, $I=\mathbb R$.`, solution: String.raw`Posons $u=x^2+x+1$, donc $u'=2x+1$. De plus $u=(x+1/2)^2+3/4>0$ sur $\mathbb R$.

$$\boxed{F(x)=\ln(x^2+x+1)+C.}$$

Sa dérivée est $u'/u=f$. La positivité permet de retirer les barres de valeur absolue.` },
        ] }],
      },
    ],
  },
  {
    id: "log-bases-section", numeral: "V", title: "Fonction logarithme de base a",
    topics: [{
      id: "log-bases-summary", title: "Définition et propriétés des autres bases", pages: [103], legacyLessonIds: ["other-log-bases"],
      body: String.raw`Soit $a>0$, avec **$a\ne1$**. Le logarithme de base $a$ est défini pour $x>0$ par :

$$\boxed{\log_a x=\frac{\ln x}{\ln a}.}$$

Le **logarithme décimal**, noté $\log$, est celui de base $10$ :

$$\log x=\frac{\ln x}{\ln10},\qquad\log10=1,\qquad\log1=0.$$

Pour $x>0$, $y>0$ et $r\in\mathbb Q$ :

$$\log_a(xy)=\log_a x+\log_a y,$$
$$\log_a(x^r)=r\log_a x,$$
$$\log_a(1/x)=-\log_a x,$$
$$\log_a(x/y)=\log_a x-\log_a y,\qquad\log_a(a^r)=r.$$

Si $a>1$, $\ln a>0$ : $\log_a$ est strictement croissante. Si $0<a<1$, $\ln a<0$ : elle est strictement décroissante. Ce signe compte lorsqu’on résout une inéquation.`,
      examples: [{ id: "log-base-three-product", title: "Un produit en base 3", prompt: String.raw`Décomposer $\log_3(28)$.`, solution: String.raw`On écrit $28=7\times4$, avec deux facteurs positifs. La propriété du produit donne :

$$\boxed{\log_3(28)=\log_3(7)+\log_3(4).}$$` }],
    }],
  },
];
