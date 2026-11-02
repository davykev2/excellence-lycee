import { section, sheet } from "./types";

export default sheet("derivatives", "Dérivabilité et étude de fonctions", [21, 22, 31, 32, 33, 34], [
  section("essential-derivative-definition", "I", "Dérivée et tangente", [21, 31, 32], String.raw`
Une fonction $f$ est dérivable en $a$ si son taux d’accroissement admet une **limite réelle finie** :

$$f'(a)=\lim_{x\to a}\frac{f(x)-f(a)}{x-a}.$$

La tangente au point $A(a;f(a))$ a pour équation

$$y=f'(a)(x-a)+f(a).$$

- Si $f'(a)=0$, cette tangente est horizontale.
- Si les taux à gauche et à droite ont la même limite finie, $f$ est dérivable en $a$.
- Si ces limites finies diffèrent, il y a deux demi-tangentes de pentes différentes.
- Si $f$ est continue en $a$ et si un taux latéral tend vers un infini, la demi-tangente correspondante est verticale, d’équation $x=a$.

**Dérivable implique continue.** Une fonction discontinue en $a$ n’y est pas dérivable. En revanche, être continue ne suffit pas pour être dérivable.
`),
  section("essential-derivative-table", "II", "Dérivées à connaître", [21], String.raw`
Les formules s’utilisent sur un intervalle où les fonctions sont définies et dérivables.

| Fonction | Dérivée | Condition utile |
| --- | --- | --- |
| $k$ | $0$ | $k$ constant |
| $x$ | $1$ | Sur $\mathbb R$ |
| $x^r$ | $rx^{r-1}$ | $x>0$ pour un exposant réel quelconque |
| $\sqrt x$ | $\frac1{2\sqrt x}$ | $x>0$ |
| $\frac1x$ | $-\frac1{x^2}$ | $x\ne0$ |
| $e^x$ | $e^x$ | Sur $\mathbb R$ |
| $\ln x$ | $\frac1x$ | $x>0$ |
| $\sin x$ | $\cos x$ | Angles en radians |
| $\cos x$ | $-\sin x$ | Angles en radians |
| $\tan x$ | $\frac1{\cos^2x}$ | $\cos x\ne0$ |

Pour un entier naturel $n\ge1$, $(x^n)'=nx^{n-1}$ sur tout $\mathbb R$.
`),
  section("essential-derivative-operations", "III", "Opérations et fonctions composées", [21, 22], String.raw`
| Fonction | Dérivée |
| --- | --- |
| $u+v$ | $u'+v'$ |
| $ku$ | $ku'$ |
| $uv$ | $u'v+uv'$ |
| $\frac1v$ | $-\frac{v'}{v^2}$ |
| $\frac uv$ | $\frac{u'v-uv'}{v^2}$ |
| $u^r$ | $ru'u^{r-1}$ |
| $\sqrt u$ | $\frac{u'}{2\sqrt u}$ |
| $e^u$ | $u'e^u$ |
| $\ln\lvert u\rvert$ | $\frac{u'}u$ |

Les quotients imposent $v\ne0$, le logarithme de valeur absolue impose $u\ne0$ et les racines dérivées imposent $u>0$. Pour une puissance réelle quelconque, travailler avec $u>0$.

**Composition :**

$$(g\circ u)'(x)=u'(x)\,g'(u(x)).$$

On dérive la fonction extérieure, puis on multiplie par la dérivée de la fonction intérieure.
`),
  section("essential-function-domain", "IV", "Commencer une étude de fonction", [31, 33], String.raw`
**1. Déterminer le domaine.** Exclure les zéros des dénominateurs, imposer un radicand positif ou nul et un argument de logarithme strictement positif.

**2. Chercher les symétries**, en vérifiant d’abord que les points comparés appartiennent au domaine.

| Situation | Égalité à vérifier | Conséquence géométrique |
| --- | --- | --- |
| Fonction paire | $f(-x)=f(x)$ | L’axe des ordonnées est un axe de symétrie |
| Fonction impaire | $f(-x)=-f(x)$ | L’origine est un centre de symétrie |
| Axe $x=a$ | $f(a-h)=f(a+h)$ | Symétrie par rapport à $x=a$ |
| Centre $I(a;b)$ | $f(a-h)+f(a+h)=2b$ | Symétrie de centre $I$ |

**3. Étudier les limites** aux bornes du domaine. Pour une forme indéterminée, transformer l’expression avant de conclure.

**4. Vérifier la continuité aux points particuliers.** Si une fonction n’est pas définie en un point mais y possède une limite finie, cette limite donne la valeur de son prolongement continu.
`),
  section("essential-function-variation", "V", "Variations, extrema et inflexion", [32], String.raw`
Sur un intervalle où $f$ est dérivable :

| Signe de la dérivée | Variation de $f$ |
| --- | --- |
| $f'>0$ | Strictement croissante |
| $f'<0$ | Strictement décroissante |
| $f'\ge0$ | Croissante |
| $f'\le0$ | Décroissante |
| $f'=0$ partout | Constante |

Construire le tableau avec les bornes, les points où $f'$ s’annule ou n’existe pas, puis les valeurs et limites de $f$.

**Minimum et maximum.** Un minimum $m$ est une valeur atteinte telle que $f(x)\ge m$ pour tout $x$ du domaine étudié. Un maximum $M$ est une valeur atteinte telle que $f(x)\le M$. Un simple majorant ou minorant n’est pas nécessairement atteint.

**Point d’inflexion.** Si $f''$ existe autour de $a$ et change de signe en $a$, la courbe change de convexité : $(a;f(a))$ est un point d’inflexion. L’égalité $f''(a)=0$ seule ne suffit pas.
`),
  section("essential-function-images", "VI", "Images d’intervalles, équations et bijections", [22, 31, 32], String.raw`
Une fonction **continue et strictement monotone** sur un intervalle $I$ réalise une bijection de $I$ vers $f(I)$.

| Sur $[a;b]$ | Image |
| --- | --- |
| $f$ continue, strictement croissante | $[f(a);f(b)]$ |
| $f$ continue, strictement décroissante | $[f(b);f(a)]$ |

Pour un intervalle ouvert ou non borné, utiliser les limites aux extrémités, dans le bon ordre, et conserver des bornes ouvertes lorsque les valeurs ne sont pas atteintes.

**Prouver qu’une équation $f(x)=0$ a une unique solution sur $[a;b]$ :**

1. Établir que $f$ est continue.
2. Montrer qu’elle est strictement monotone.
3. Vérifier que $0$ appartient à son image ; en particulier, $f(a)f(b)<0$ donne une solution dans $]a;b[$.

**Encadrer cette solution par balayage.** Partager l’intervalle en dix, repérer deux valeurs consécutives où les signes sont opposés, puis recommencer dans le nouvel intervalle. Chaque étape ajoute un chiffre décimal de précision.

La réciproque $f^{-1}$ possède le même sens de variation que $f$. Dans un repère orthonormé, leurs courbes sont symétriques par rapport à la droite $y=x$.

Si $\beta=f(\alpha)$ et $f'(\alpha)\ne0$, alors

$$\big(f^{-1}\big)'(\beta)=\frac1{f'(\alpha)}.$$
`),
  section("essential-function-branches", "VII", "Asymptotes et branches infinies", [33, 34], String.raw`
| Comportement de $f$ | Lecture géométrique |
| --- | --- |
| $f(x)\to\pm\infty$ quand $x\to a$ d’un côté | Asymptote verticale $x=a$ |
| $f(x)\to b$ quand $x\to\pm\infty$ | Asymptote horizontale $y=b$ |
| $f(x)-(ax+b)\to0$ à l’infini | Asymptote oblique $y=ax+b$ si $a\ne0$ |

Si $f(x)\to\pm\infty$ à l’infini, étudier ensuite $\frac{f(x)}x$ :

- si le quotient tend vers $0$, la branche parabolique a la direction de l’axe des abscisses ;
- si sa valeur absolue tend vers l’infini, la branche parabolique a la direction de l’axe des ordonnées ;
- s’il tend vers un réel $a\ne0$, calculer $f(x)-ax$ : une limite finie $b$ donne l’asymptote $y=ax+b$ ; une limite infinie donne une branche parabolique de direction $y=ax$.

Étudier séparément $+\infty$ et $-\infty$ : les asymptotes peuvent être différentes.
`),
  section("essential-function-relative", "VIII", "Tangentes et positions relatives", [34], String.raw`
**Tangente en $x_0$ :**

$$y=f'(x_0)(x-x_0)+f(x_0).$$

Pour qu’elle soit parallèle à une droite de pente $a$, résoudre $f'(x_0)=a$, puis calculer $f(x_0)$ et l’équation de la tangente.

**Comparer la courbe à une droite $y=ax+b$.** Étudier le signe de $f(x)-(ax+b)$ :

- positif : la courbe est au-dessus de la droite ;
- négatif : elle est en dessous ;
- nul : les deux se rencontrent.

**Points d’intersection :**

| Intersection recherchée | Équation à résoudre | Coordonnées |
| --- | --- | --- |
| Avec $y=ax+b$ | $f(x)=ax+b$ | $(x;f(x))$ |
| Avec l’axe des abscisses | $f(x)=0$ | $(x;0)$ |
| Avec l’axe des ordonnées | Vérifier $0$ dans le domaine | $(0;f(0))$ |
`),
], [
  "Chapitres 2 et 4 regroupés selon le catalogue actif. Les 28 méthodes de l'étude sont conservées et regroupées sans doublons.",
  "Image d'un intervalle décroissant réordonnée ; variation de la réciproque, extrema atteints et condition de changement de signe de f'' explicités.",
  "Dérivées et taux infinis distingués ; continuité requise pour une demi-tangente verticale.",
]);
