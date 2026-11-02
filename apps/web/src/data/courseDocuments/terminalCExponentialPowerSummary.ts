import type { CourseDocumentSection } from "../../domain/courseDocument";

/** Pyramide TC, tome 1, folios 122–126 (pages PDF 124–128). */
export const terminalCExponentialPowerSummary: CourseDocumentSection[] = [
  { id: "exp-definition-section", numeral: "I", title: "Fonction exponentielle népérienne", topics: [
    { id: "exp-definition-summary", title: "Définition et propriétés algébriques", pages: [124], legacyLessonIds: ["exp-properties", "exp-equations"],
      body: String.raw`La **fonction exponentielle népérienne**, notée $\exp$, est la bijection réciproque de la fonction logarithme népérien. On écrit $\exp(x)=e^x$.

### Conséquences

- Elle est définie sur **$\mathbb R$** et prend ses valeurs dans **$]0;+\infty[$**. En particulier, $e^x>0$ pour tout réel $x$.
- Pour $a\in\mathbb R$ et $b>0$ : $e^a=b\iff a=\ln b$, et $\ln b=a\iff b=e^a$.
- $e^{\ln x}=x$ pour $x>0$ et $\ln(e^y)=y$ pour tout réel $y$.
- Pour tous réels $a,b$, $e^a=e^b\iff a=b$ et $e^a<e^b\iff a<b$.
- Elle est dérivable sur $\mathbb R$ et **$(e^x)'=e^x$**.

### Propriétés algébriques

Pour $a,b\in\mathbb R$ et $r\in\mathbb Q$ :

$$e^{a+b}=e^ae^b,\qquad e^{-a}=\frac1{e^a},\qquad e^{a-b}=\frac{e^a}{e^b}.$$
$$e^{ab}=(e^a)^b=(e^b)^a,\qquad e^{ra}=(e^a)^r.$$

On **additionne les exposants dans un produit**, on les soustrait dans un quotient et on les multiplie pour une puissance de puissance. En général, $e^{a+b}\ne e^a+e^b$.

Les valeurs de départ sont **$e^0=1$** et **$e^1=e$**.`,
      examples: [{ id: "exp-algebra-worked", title: "Simplifier des exponentielles", prompt: "Appliquons une règle à la fois.", parts: [
        { id: "exp-product-worked", label: "a)", prompt: String.raw`$e^5\times e^2$.`, solution: String.raw`C’est un produit d’exponentielles de même base. On additionne les exposants : $e^5e^2=e^{5+2}=\boxed{e^7}$.` },
        { id: "exp-negative-worked", label: "b)", prompt: String.raw`$e^{-4}$.`, solution: String.raw`Un exposant négatif donne un inverse : $e^{-4}=1/e^4$. On peut aussi décomposer $-4=-2-2$, donc **$e^{-4}=e^{-2}e^{-2}$**.` },
        { id: "exp-quotient-worked", label: "c)", prompt: String.raw`$e^{-2}/e^8$.`, solution: String.raw`Le dénominateur n’est jamais nul. On soustrait son exposant : $e^{-2}/e^8=e^{-2-8}=\boxed{e^{-10}}$.` },
        { id: "exp-power-worked", label: "d)", prompt: String.raw`$(e^{-5})^3$.`, solution: String.raw`Pour une puissance de puissance, on multiplie les exposants : $(e^{-5})^3=e^{-5\times3}=\boxed{e^{-15}}$.` },
      ] }],
    },
  ] },
  { id: "exp-study-section", numeral: "II", title: "Étude de la fonction exponentielle", topics: [
    { id: "exp-study-summary", title: "Variation et courbe représentative", pages: [124],
      body: String.raw`Comme $e^x>0$, la dérivée de l’exponentielle est positive : la fonction est **strictement croissante sur $\mathbb R$**.

| $x$ | $-\infty$ | $\mathbb R$ | $+\infty$ |
| --- | --- | --- | --- |
| $\exp'(x)=e^x$ | | $+$ | |
| $e^x$ | $0$ | strictement croissante | $+\infty$ |

Sa courbe passe par **$(0;1)$**. La droite $y=0$ est une asymptote horizontale en $-\infty$. La tangente au point d’abscisse $0$ a pour équation **$y=x+1$**.

Dans un repère **orthonormal**, les courbes de $\exp$ et de $\ln$ sont symétriques par rapport à la droite $y=x$, car ce sont deux fonctions réciproques. Par exemple, $(0;1)$ sur la première correspond à $(1;0)$ sur la seconde.`,
      interaction: { kind: "curve", eyebrow: "Observer", title: "L’exponentielle et sa tangente en 0", instruction: "Déplace le point pour lire e puissance x.", observation: "L’exponentielle reste positive et croît sur tout R.", formula: "f(x) = e^x", formulaTex: String.raw`f(x)=e^x`, rule: { kind: "affine-plus-exp", slope: 0, intercept: 0, coefficient: 1, rate: 1 }, window: { xMin: -4, xMax: 3, yMin: -1, yMax: 8 }, guides: [{ kind: "horizontal", value: 0, label: "y = 0" }, { kind: "oblique", slope: 1, intercept: 1, label: "y = x + 1" }], marker: { min: -4, max: 2, step: .05, initial: 0 } },
    },
  ] },
  { id: "exp-limits-section", numeral: "III", title: "Limites de référence", topics: [
    { id: "exp-limits-summary", title: "Cinq limites à connaître", pages: [125], legacyLessonIds: ["exp-limits"],
      body: String.raw`$$\boxed{\lim_{x\to0}\frac{e^x-1}{x}=1.}$$
$$\lim_{x\to-\infty}e^x=0,\qquad\lim_{x\to-\infty}xe^x=0.$$
$$\lim_{x\to+\infty}e^x=+\infty,\qquad\lim_{x\to+\infty}\frac{e^x}{x}=+\infty.$$

La première limite est le nombre dérivé de $\exp$ en $0$. Dans $xe^x$, le produit est négatif lorsque $x<0$ : il tend vers zéro **par valeurs négatives**.

Pour utiliser ces références avec $e^{u(x)}$, pose une nouvelle variable et vérifie vers quoi elle tend. Une différence $+\infty-\infty$ ou un produit $0\times\infty$ demande d’abord une transformation.`,
      examples: [{ id: "exp-limits-worked", title: "Lever une forme indéterminée", prompt: "Calculons les deux limites du support.", parts: [
        { id: "exp-minus-x-worked", label: "1.", prompt: String.raw`$\displaystyle\lim_{x\to+\infty}(e^x-x)$.`, solution: String.raw`On factorise par $x$ :

$$e^x-x=x\left(\frac{e^x}{x}-1\right).$$

Car $x\to+\infty$ et $e^x/x\to+\infty$, la parenthèse tend vers $+\infty$. **Le produit tend donc vers $+\infty$.**` },
        { id: "exp-sine-worked", label: "2.", prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{\sin x}{e^x-1}$.`, solution: String.raw`Pour $x\ne0$, écrivons :

$$\frac{\sin x}{e^x-1}=\frac{\sin x}{x}\frac{x}{e^x-1}.$$

En radians, $\sin x/x\to1$. De plus, $(e^x-1)/x\to1$, donc son inverse tend aussi vers $1$. **La limite est $1\times1=1$.**` },
      ] }],
    },
  ] },
  { id: "exp-calculus-section", numeral: "IV", title: "Dérivées et primitives", topics: [
    { id: "exp-derivative-summary", title: "Dériver une exponentielle composée", pages: [125], legacyLessonIds: ["exp-derivative"],
      body: String.raw`Si $u$ est dérivable sur un intervalle $I$, alors la fonction $x\mapsto e^{u(x)}$ est dérivable sur $I$ et :

$$\boxed{(e^u)'=u'e^u.}$$

On garde la même exponentielle et on la multiplie par **la dérivée de l’exposant**. Le domaine est celui de $u$ ; l’exponentielle n’ajoute aucune restriction.`,
      examples: [{ id: "exp-derivative-worked", title: "Une exponentielle de carré", prompt: String.raw`Dérivons $g(x)=e^{-x^2}$ sur $\mathbb R$.`, solution: String.raw`Posons $u(x)=-x^2$, donc $u'(x)=-2x$. La règle de composition donne :

$$g'(x)=(-2x)e^{-x^2}=\boxed{-2xe^{-x^2}}.$$

Le facteur $-2x$ est indispensable : il provient de la dérivation de $-x^2$.` }],
    },
    { id: "exp-primitives-summary", title: String.raw`Reconnaître $u'e^u$`, pages: [125], legacyLessonIds: ["exp-primitives"],
      body: String.raw`Si $u$ est dérivable sur $I$, les primitives de $u'e^u$ sur $I$ sont :

$$\boxed{F(x)=e^{u(x)}+C,\qquad C\in\mathbb R.}$$

Avant d’intégrer, on compare le facteur devant l’exponentielle à $u'$. Si un coefficient manque, on l’ajuste. On vérifie le résultat **en le dérivant**.`,
      examples: [{ id: "exp-primitives-worked", title: "Deux primitives par reconnaissance", prompt: "Identifions l’exposant dans chaque cas.", parts: [
        { id: "exp-square-primitive-worked", label: "a)", prompt: String.raw`Une primitive de $x e^{x^2}$ sur $\mathbb R$.`, solution: String.raw`Pour $u(x)=x^2$, on a $u'(x)=2x$. Or $x=\frac12u'(x)$. Ainsi **$F(x)=\frac12e^{x^2}$** convient, car $F'(x)=\frac12(2x)e^{x^2}=xe^{x^2}$.` },
        { id: "exp-sine-primitive-worked", label: "b)", prompt: String.raw`Une primitive de $\cos x\,e^{\sin x}$ sur $\mathbb R$.`, solution: String.raw`Posons $u(x)=\sin x$. Sa dérivée est $u'(x)=\cos x$ : le facteur attendu est déjà présent. **$F(x)=e^{\sin x}$** convient ; sa dérivée vaut bien $\cos x\,e^{\sin x}$.` },
      ] }],
    },
  ] },
  { id: "exp-base-section", numeral: "V", title: "Exponentielle de base a", topics: [
    { id: "exp-base-summary", title: "Définition et règles de calcul", pages: [126], legacyLessonIds: ["power-equations"],
      body: String.raw`Soit **$a>0$**. Pour tout réel $x$, on définit :

$$\boxed{a^x=e^{x\ln a}.}$$

La fonction $\exp_a:x\mapsto a^x$ est l’exponentielle de base $a$. Pour $a=e$, on retrouve $\exp$. Pour $a=10$, c’est la réciproque du logarithme décimal. Pour **$a=1$**, la fonction est constante, égale à $1$.

### Propriétés

Pour $a,b>0$ et $x,y\in\mathbb R$ :

$$\ln(a^x)=x\ln a.$$
$$a^{x+y}=a^xa^y,\quad a^{-y}=\frac1{a^y},\quad a^{x-y}=\frac{a^x}{a^y}.$$
$$ (ab)^x=a^xb^x,\quad \left(\frac ab\right)^x=\frac{a^x}{b^x},\quad(a^x)^y=a^{xy}.$$

Dans une équation où apparaissent $a^{2x}$ et $a^x$, poser **$X=a^x>0$** permet de résoudre un polynôme. On écarte les racines $X\le0$ avant de revenir à $x$.`,
      examples: [
        { id: "exp-base-log-worked", title: "Passer au logarithme", prompt: "Calculons chaque expression.", parts: [
          { id: "exp-ln-three-power", label: "a)", prompt: String.raw`$\ln(3^x)$.`, solution: String.raw`La base $3$ est positive. La formule donne directement **$\ln(3^x)=x\ln3$** pour tout réel $x$.` },
          { id: "exp-ln-five-x", label: "b)", prompt: String.raw`$\ln(e^{5x})$.`, solution: String.raw`Le logarithme et l’exponentielle sont réciproques : **$\ln(e^{5x})=5x$** pour tout réel $x$.` },
          { id: "exp-ln-minus-five", label: "c)", prompt: String.raw`$\ln(e^{-5})$.`, solution: String.raw`On applique la même règle avec l’exposant $-5$ : **$\ln(e^{-5})=-5$**.` },
        ] },
        { id: "exp-base-quadratic-worked", title: "Une équation du second degré en 2 puissance x", prompt: String.raw`Résolvons $4^x-2^{x+2}-5=0$.`, solution: String.raw`$4^x=(2^x)^2$ et $2^{x+2}=4\times2^x$. Posons **$X=2^x>0$** :

$$X^2-4X-5=0\iff(X-5)(X+1)=0.$$

Les racines sont $5$ et $-1$. On rejette $-1$, puisque $X>0$. Il reste $2^x=5$, donc $x\ln2=\ln5$ :

$$\boxed{S=\left\{\frac{\ln5}{\ln2}\right\}.}$$` },
      ],
    },
  ] },
  { id: "exp-base-study-section", numeral: "VI", title: "Étude de x ↦ a puissance x", topics: [
    { id: "exp-base-study-summary", title: "Comparer les deux types de bases", pages: [126, 127],
      body: String.raw`On suppose **$a>0$ et $a\ne1$**. La fonction $f_a(x)=a^x$ est définie et dérivable sur $\mathbb R$ :

$$\boxed{f_a'(x)=(\ln a)a^x.}$$

Comme $a^x>0$, le signe de la dérivée est celui de $\ln a$.

| Propriété | $0<a<1$ | $a>1$ |
| --- | --- | --- |
| Signe de $\ln a$ | négatif | positif |
| Variation | strictement décroissante | strictement croissante |
| Limite en $-\infty$ | $+\infty$ | $0$ |
| Limite en $+\infty$ | $0$ | $+\infty$ |
| Asymptote $y=0$ | en $+\infty$ | en $-\infty$ |
| Branche parabolique de direction $(OJ)$ | en $-\infty$ | en $+\infty$ |

Les deux types de courbes passent par **$(0;1)$** et $(1;a)$. Chaque fonction est une bijection de $\mathbb R$ sur $]0;+\infty[$.

Pour toute base $a>0$, $a\ne1$, **$a^x=a^y\iff x=y$**. Pour les inégalités, le sens dépend de la base :

$$a>1:\quad a^x<a^y\iff x<y;$$
$$0<a<1:\quad a^x<a^y\iff x>y.$$

Si $0<a<1$, on **inverse le sens** en comparant les exposants. Une primitive de $a^x$ est $a^x/\ln a$.`,
      interaction: { kind: "curve", eyebrow: "Observer", title: "Une base comprise entre 0 et 1", instruction: "Déplace le point pour lire les valeurs de (1/2) puissance x.", observation: "La base 1/2 est inférieure à 1 : la courbe décroît et se rapproche de y = 0 à droite.", formula: "f(x) = (1/2)^x", formulaTex: String.raw`f(x)=\left(\frac12\right)^x`, rule: { kind: "affine-plus-exp", slope: 0, intercept: 0, coefficient: 1, rate: Math.log(.5) }, window: { xMin: -3, xMax: 4, yMin: -1, yMax: 9 }, guides: [{ kind: "horizontal", value: 0, label: "y = 0" }], marker: { min: -3, max: 4, step: .05, initial: 0 } },
    },
  ] },
  { id: "exp-powers-section", numeral: "VII", title: "Fonctions puissances d’exposant réel", topics: [
    { id: "exp-real-powers-summary", title: "Définition et domaine", pages: [127, 128], legacyLessonIds: ["real-powers"],
      body: String.raw`Pour un réel $\alpha$ et **$x>0$**, on pose :

$$\boxed{x^\alpha=e^{\alpha\ln x}.}$$

On appelle $x\mapsto x^\alpha$ la fonction puissance d’exposant $\alpha$. Pour $\alpha=1/3$, on retrouve $x^{1/3}=\sqrt[3]x$ sur $]0;+\infty[$.

La définition générale par $\ln$ est utilisée sur **$]0;+\infty[$**. Certaines puissances possèdent un prolongement naturel : un entier positif donne un polynôme sur $\mathbb R$, une racine cubique est définie sur $\mathbb R$. On étudie ces extensions séparément, sans appliquer $\ln x$ à un nombre négatif.

Pour $u>0$, **$u(x)^\alpha=e^{\alpha\ln u(x)}$**. Si $\alpha$ est irrationnel et $u$ change de signe, on commence par résoudre $u(x)>0$.`,
    },
    { id: "exp-powers-derivative-summary", title: "Dérivées et variations des puissances", pages: [128],
      body: String.raw`Si $u$ est dérivable et **strictement positive** sur un intervalle $I$, alors :

$$\boxed{(u^\alpha)'=\alpha u' u^{\alpha-1}.}$$

Pour $u(x)=x$, on retrouve $(x^\alpha)'=\alpha x^{\alpha-1}$ sur $]0;+\infty[$.

| Exposant | Variation de $x^\alpha$ | Limite en $0^+$ | Limite en $+\infty$ |
| --- | --- | --- | --- |
| $\alpha<0$ | décroissante | $+\infty$ | $0$ |
| $\alpha>0$ | croissante | $0$ | $+\infty$ |

Pour $\alpha=0$, la fonction vaut $1$. À l’infini, $x^\alpha/x=x^{\alpha-1}$ : si $0<\alpha<1$, la branche parabolique a la direction $(OI)$ ; si $\alpha>1$, elle a la direction $(OJ)$ ; si $\alpha=1$, c’est la droite $y=x$.`,
      examples: [{ id: "exp-power-derivative-worked", title: "Une puissance de logarithme", prompt: String.raw`Dérivons $f(x)=(\ln x)^\pi$ sur $]1;+\infty[$.`, solution: String.raw`On impose $\ln x>0$, donc $x>1$. Posons $u(x)=\ln x$, d’où $u'(x)=1/x$. Avec $\alpha=\pi$ :

$$\boxed{f'(x)=\pi\frac1x(\ln x)^{\pi-1}.}$$

Les trois facteurs sont positifs sur $]1;+\infty[$ : $f$ y est strictement croissante.` }],
    },
    { id: "exp-powers-primitives-summary", title: String.raw`Primitives de $u'u^\alpha$`, pages: [128],
      body: String.raw`Soient **$\alpha\ne-1$** et $u$ dérivable et **strictement positive** sur $I$. Une primitive de $u'u^\alpha$ est :

$$\boxed{F=\frac{u^{\alpha+1}}{\alpha+1}.}$$

Toutes les primitives sur l’intervalle sont $F+C$, avec $C\in\mathbb R$. La formule vaut aussi pour $\alpha<-1$ ; elle ne se limite pas aux exposants positifs. Pour $\alpha=-1$, on utilise plutôt $\ln u+C$.`,
      examples: [{ id: "exp-power-primitive-worked", title: "Une puissance réelle composée", prompt: String.raw`Déterminons une primitive de $\dfrac{(-2+\ln x)^{\sqrt3}}x$.`, solution: String.raw`La base $u(x)=-2+\ln x$ doit être strictement positive : **$x>e^2$**. Sur cet intervalle, $u'(x)=1/x$. Avec $\alpha=\sqrt3\ne-1$ :

$$\boxed{F(x)=\frac{(-2+\ln x)^{\sqrt3+1}}{\sqrt3+1}.}$$

Vérification : en dérivant, le facteur $\sqrt3+1$ se simplifie et il reste bien $(-2+\ln x)^{\sqrt3}/x$.` }],
    },
    { id: "exp-growth-summary", title: "Croissances comparées", pages: [128], legacyLessonIds: ["growth-comparison"],
      body: String.raw`Pour tout **$\alpha>0$** :

$$\lim_{x\to+\infty}\frac{\ln x}{x^\alpha}=0,\qquad\lim_{x\to0^+}x^\alpha\ln x=0.$$
$$\lim_{x\to+\infty}\frac{e^x}{x^\alpha}=+\infty,\qquad\lim_{x\to+\infty}x^\alpha e^{-x}=0.$$

En $+\infty$, l’exponentielle croît plus vite qu’une puissance positive, laquelle croît plus vite que le logarithme. Ce repère sert à **reconnaître** la limite ; la rédaction doit encore faire apparaître le quotient ou le produit de référence.

Dans $e^{kx}$ avec $k>0$, poser $t=kx$ ramène à $e^t$ et $t\to+\infty$. Pour une limite en $-\infty$, poser $t=-x$ permet souvent de revenir à une limite en $+\infty$.`,
    },
  ] },
];
