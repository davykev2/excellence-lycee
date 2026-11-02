import type { CourseDocumentSection } from "../../domain/courseDocument";

/** L1.pdf, pages PDF 1–14 (pages imprimées 23–36). Native text and graphs only. */
export const terminalCLimitsSummary: CourseDocumentSection[] = [
  {
    id: "limits", numeral: "I", title: "Limite",
    topics: [
      {
        id: "reference-limits", title: "Limites de référence", pages: [1],
        body: String.raw`### Propriété

Pour tout réel $a$ et tout entier naturel non nul $n$, on dispose des limites suivantes.

| Fonction | En $+\infty$ | En $-\infty$ |
| --- | --- | --- |
| $x^n$ | $+\infty$ | $+\infty$ si $n$ est pair ; $-\infty$ si $n$ est impair |
| $\dfrac1{x^n}$ | $0$ | $0$ |
| $\sqrt x$ | $+\infty$ | La fonction n’est pas définie sur un voisinage de $-\infty$ |

Pour une puissance au dénominateur, le résultat dépend de la parité de $n$ :

- Si $n$ est **pair**, $\displaystyle\lim_{x\to a}\frac1{(x-a)^n}=+\infty$.
- Si $n$ est **impair**, $\displaystyle\lim_{x\to a^-}\frac1{(x-a)^n}=-\infty$ et $\displaystyle\lim_{x\to a^+}\frac1{(x-a)^n}=+\infty$.

Les deux limites trigonométriques à connaître (angles en radians) sont :

$$\lim_{x\to0}\frac{\sin x}{x}=1
\qquad\text{et}\qquad
\lim_{x\to0}\frac{\cos x-1}{x}=0.$$
`,
        examples: [{
          id: "reference-examples", title: "Quatre limites de référence",
          prompt: "Calculons chacune des limites en précisant la propriété utilisée.",
          parts: [
            {
              id: "reference-a", label: "a)", prompt: String.raw`Limite de $\dfrac1{x^6}$ en $0$.`,
              solution: String.raw`$$\lim_{x\to0}\frac1{x^6}=+\infty.$$

**Car :**

$$\left\{\begin{aligned}
&6\text{ est pair} ;\\
&x^6>0\text{ pour }x\ne0 ;\\
&\lim_{x\to0}x^6=0.
\end{aligned}\right.$$

Le dénominateur tend donc vers $0$ en restant strictement positif.`,
            },
            {
              id: "reference-b", label: "b)", prompt: String.raw`Limite de $x^3$ en $-\infty$.`,
              solution: String.raw`$$\lim_{x\to-\infty}x^3=-\infty.$$

**Car :**

$$\left\{\begin{aligned}
&3\text{ est impair} ;\\
&\lim_{x\to-\infty}x^n=-\infty\text{ si }n\text{ est impair}.
\end{aligned}\right.$$
`,
            },
            {
              id: "reference-c", label: "c)", prompt: String.raw`Limite de $\dfrac1{x^7}$ en $-\infty$.`,
              solution: String.raw`$$\lim_{x\to-\infty}\frac1{x^7}=0.$$

**Car :**

$$\left\{\begin{aligned}
&7\text{ est impair, donc }\lim_{x\to-\infty}x^7=-\infty ;\\
&\lim_{u\to-\infty}\frac1u=0.
\end{aligned}\right.$$
`,
            },
            {
              id: "reference-d", label: "d)", prompt: String.raw`Limite de $x^6$ en $-\infty$.`,
              solution: String.raw`$$\lim_{x\to-\infty}x^6=+\infty.$$

**Car :**

$$\left\{\begin{aligned}
&6\text{ est pair} ;\\
&\lim_{x\to-\infty}x^n=+\infty\text{ si }n\text{ est pair}.
\end{aligned}\right.$$
`,
            },
          ],
        }],
        detail: String.raw`Une limite décrit le comportement **à proximité** du point, pas nécessairement la valeur au point. Ainsi $1/x^6$ n’est pas défini en $0$, mais sa limite y est bien $+\infty$.`,
      },
      {
        id: "restriction-limit", title: "Limite d’une restriction", pages: [1],
        body: String.raw`### Propriété

Soit $f$ la restriction d’une fonction $g$ à un ensemble $A$. On suppose que $A$ contient tous les points d’un intervalle autour de $a$, sauf éventuellement $a$ lui-même.

Si $g$ admet une limite $\ell$ en $a$, alors $f$ admet la même limite :

$$\lim_{x\to a}g(x)=\ell\quad\Longrightarrow\quad\lim_{x\to a}f(x)=\ell.$$
`,
        examples: [{
          id: "restriction-factor", title: "Simplifier avant de passer à la limite",
          prompt: String.raw`Calcule $\lim_{x\to2}\dfrac{4-x^2}{x-2}$.`,
          solution: String.raw`**Simplifions l’expression.** Pour $x\ne2$ :

$$\frac{4-x^2}{x-2}=\frac{(2-x)(2+x)}{x-2}=-(x+2).$$

La fonction $f$ est donc la restriction de $g:x\mapsto-x-2$ à $\mathbb R\setminus\{2\}$.

Or :

$$\lim_{x\to2}g(x)=-2-2=-4.$$

Par la propriété de la limite d’une restriction :

$$\boxed{\lim_{x\to2}\frac{4-x^2}{x-2}=-4.}$$
`,
        }],
      },
      {
        id: "one-sided-limits", title: "Limite à gauche et limite à droite", pages: [2],
        body: String.raw`### Propriété

Pour étudier une limite en $a$, on peut calculer séparément la limite à gauche et la limite à droite.

La fonction admet une limite $\ell$ en $a$ si ces deux limites existent et valent toutes les deux $\ell$ :

$$\lim_{x\to a^-}f(x)=\lim_{x\to a^+}f(x)=\ell
\quad\Longleftrightarrow\quad
\lim_{x\to a}f(x)=\ell.$$

Si les deux limites sont différentes, il n’y a pas de limite en $a$.

Lorsque $f$ est aussi définie en $a$ et que les deux limites valent $f(a)$, la fonction est **continue en $a$**.`,
        examples: [
          {
            id: "unequal-sides", title: "Deux limites différentes",
            prompt: String.raw`Étudie la limite en $-1$ de $f(x)=\begin{cases}x^2+1&x<-1\\x^3&x\ge-1.\end{cases}$`,
            solution: String.raw`**À gauche de $-1$**, on utilise $f(x)=x^2+1$ :

$$\lim_{x\to-1^-}f(x)=(-1)^2+1=2.$$

**À droite de $-1$**, on utilise $f(x)=x^3$ :

$$\lim_{x\to-1^+}f(x)=(-1)^3=-1.$$

Les deux limites sont différentes. **Donc $f$ n’admet pas de limite en $-1$.**`,
          },
          {
            id: "equal-sides", title: "Deux limites qui coïncident",
            prompt: String.raw`Étudie la limite en $-2$ de $g(x)=\begin{cases}x^2+1&x<-2\\-2x+1&x\ge-2.\end{cases}$`,
            solution: String.raw`**À gauche de $-2$**, on utilise $g(x)=x^2+1$ :

$$\lim_{x\to-2^-}g(x)=(-2)^2+1=5.$$

**À droite de $-2$**, on utilise $g(x)=-2x+1$ :

$$\lim_{x\to-2^+}g(x)=-2(-2)+1=5.$$

Les deux limites sont égales. **Donc $\lim_{x\to-2}g(x)=5$.**

De plus $g(-2)=5$, donc $g$ est continue en $-2$.`,
          },
        ],
      },
      {
        id: "limit-operations", title: "Opérations sur les limites", pages: [2, 3],
        body: String.raw`On étudie les limites de $f$ et de $g$ au même point, réel ou infini. Les lettres $L$ et $L'$ représentent des limites finies.

### Somme

| Limite de $f$ | Limite de $g$ | Limite de $f+g$ |
| --- | --- | --- |
| $L$ | $L'$ | $L+L'$ |
| $L$ | $+\infty$ | $+\infty$ |
| $L$ | $-\infty$ | $-\infty$ |
| $+\infty$ | $+\infty$ | $+\infty$ |
| $-\infty$ | $-\infty$ | $-\infty$ |
| $+\infty$ | $-\infty$ | Forme indéterminée |

### Produit

| Limite de $f$ | Limite de $g$ | Limite de $fg$ |
| --- | --- | --- |
| $L$ | $L'$ | $LL'$ |
| $L>0$ | $+\infty$ | $+\infty$ |
| $L<0$ | $+\infty$ | $-\infty$ |
| $L>0$ | $-\infty$ | $-\infty$ |
| $L<0$ | $-\infty$ | $+\infty$ |
| $+\infty$ | $+\infty$ | $+\infty$ |
| $-\infty$ | $-\infty$ | $+\infty$ |
| $+\infty$ | $-\infty$ | $-\infty$ |
| $0$ | $+\infty$ ou $-\infty$ | Forme indéterminée |

### Quotient

| Situation | Limite de $f/g$ |
| --- | --- |
| $f\to L$, $g\to L'\ne0$ | $L/L'$ |
| $f\to L$, $g\to+\infty$ ou $-\infty$ | $0$ |
| $f\to+\infty$, $g\to L'>0$ | $+\infty$ |
| $f\to+\infty$, $g\to L'<0$ | $-\infty$ |
| $f\to-\infty$, $g\to L'>0$ | $-\infty$ |
| $f\to-\infty$, $g\to L'<0$ | $+\infty$ |
| $f\to L>0$ ou $+\infty$, $g\to0^+$ | $+\infty$ |
| $f\to L<0$ ou $-\infty$, $g\to0^+$ | $-\infty$ |
| $f\to L>0$ ou $+\infty$, $g\to0^-$ | $-\infty$ |
| $f\to L<0$ ou $-\infty$, $g\to0^-$ | $+\infty$ |
| $f\to0$, $g\to0$ | Forme indéterminée $0/0$ |
| $f\to\pm\infty$, $g\to\pm\infty$ | Forme indéterminée $\infty/\infty$ |

Une **forme indéterminée** signifie que ces règles ne permettent pas de conclure directement. On transforme alors l’expression : factorisation, expression conjuguée ou autre méthode adaptée.

La notation $g(x)\to0^+$ signifie que $g(x)$ tend vers $0$ en restant positif ; $g(x)\to0^-$ signifie qu’il reste négatif.`,
        examples: [
          {
            id: "sum-examples", title: "Somme déterminée, puis indéterminée",
            prompt: "Calculons séparément les deux limites en +∞.",
            parts: [
              {
                id: "sum-a", label: "a)", prompt: String.raw`Limite de $x+\sqrt x$.`,
                solution: String.raw`$$\lim_{x\to+\infty}(x+\sqrt x)=+\infty.$$

**Car :**

$$\left\{\begin{aligned}
&\lim_{x\to+\infty}x=+\infty ;\\
&\lim_{x\to+\infty}\sqrt x=+\infty.
\end{aligned}\right.$$

On applique la règle de la somme de deux fonctions de limite $+\infty$.`,
              },
              {
                id: "sum-b", label: "b)", prompt: String.raw`Limite de $-x+\sqrt x$.`,
                solution: String.raw`Les limites des deux termes sont $-\infty$ et $+\infty$ : on ne peut pas conclure directement.

**Utilisons une factorisation :**

$$-x+\sqrt x=x\left(-1+\frac1{\sqrt x}\right).$$

Or :

$$\lim_{x\to+\infty}x=+\infty,\qquad
\lim_{x\to+\infty}\left(-1+\frac1{\sqrt x}\right)=-1<0.$$

Donc :

$$\boxed{\lim_{x\to+\infty}(-x+\sqrt x)=-\infty.}$$
`,
              },
            ],
          },
          {
            id: "product-examples", title: "Limites de deux produits",
            prompt: "Calculons chaque limite en −∞ en étudiant les facteurs.",
            parts: [
              {
                id: "product-a", label: "a)", prompt: String.raw`$(x^3-2x^2+x-1)\dfrac{2x^2+x-3}{-3x^2-1}$.`,
                solution: String.raw`On a :

$$\lim_{x\to-\infty}(x^3-2x^2+x-1)=-\infty,$$

car le terme de plus haut degré est $x^3$. D’autre part :

$$\lim_{x\to-\infty}\frac{2x^2+x-3}{-3x^2-1}
=\lim_{x\to-\infty}\frac{2+1/x-3/x^2}{-3-1/x^2}
=-\frac23.$$

Par la règle du produit, une quantité tendant vers $-\infty$ multipliée par une quantité de limite strictement négative tend vers $+\infty$.

**Donc la limite du produit est $+\infty$.**`,
              },
              {
                id: "product-b", label: "b)", prompt: String.raw`$(x^3-2x^2+x-1)\dfrac{2x^2+x-3}{-3x^3+5}$.`,
                solution: String.raw`Le premier facteur tend vers $-\infty$ et la fraction tend vers $0$. C’est une forme indéterminée.

**Factorisons par les puissances dominantes :**

$$x^3-2x^2+x-1=x^3\left(1-\frac2x+\frac1{x^2}-\frac1{x^3}\right).$$

Le produit s’écrit alors :

$$x^2
\frac{\left(1-\frac2x+\frac1{x^2}-\frac1{x^3}\right)
\left(2+\frac1x-\frac3{x^2}\right)}
{-3+\frac5{x^3}}.$$

La fraction tend vers $-2/3$ et $x^2\to+\infty$. **Donc la limite du produit est $-\infty$.**`,
              },
            ],
          },
          {
            id: "quotient-examples", title: "Quotients en $-1$",
            prompt: "Calculons chaque limite en −1 en étudiant le numérateur et le dénominateur.",
            parts: [
              {
                id: "quotient-a", label: "a)", prompt: String.raw`$\dfrac{-2x^2+x-1}{(x+3)/(x-1)}$.`,
                solution: String.raw`**On calcule les deux limites :**

$$\left\{\begin{aligned}
&\lim_{x\to-1}(-2x^2+x-1)=-2-1-1=-4 ;\\
&\lim_{x\to-1}\frac{x+3}{x-1}=\frac{-1+3}{-1-1}=-1.
\end{aligned}\right.$$

La limite du dénominateur est non nulle. Par la règle du quotient :

$$\boxed{\lim_{x\to-1}\frac{-2x^2+x-1}{(x+3)/(x-1)}
=\frac{-4}{-1}=4.}$$
`,
              },
              {
                id: "quotient-b", label: "b)", prompt: String.raw`$\dfrac{x^3+1}{(2x^2+x-1)/(-3x^3+5)}$.`,
                solution: String.raw`Le numérateur et le dénominateur tendent vers $0$. On ne peut donc pas appliquer directement la règle du quotient.

**Utilisons une factorisation.** Pour $x\ne-1$ proche de $-1$ :

$$\frac{x^3+1}{(2x^2+x-1)/(-3x^3+5)}
=\frac{(x^3+1)(-3x^3+5)}{2x^2+x-1}.$$

Comme $x^3+1=(x+1)(x^2-x+1)$ et $2x^2+x-1=(x+1)(2x-1)$, on simplifie par $x+1$ :

$$\frac{(x^2-x+1)(-3x^3+5)}{2x-1}.$$

En remplaçant maintenant $x$ par $-1$, on obtient :

$$\boxed{\lim_{x\to-1}\frac{x^3+1}{(2x^2+x-1)/(-3x^3+5)}
=\frac{3\times8}{-3}=-8.}$$
`,
              },
            ],
          },
        ],
      },
      {
        id: "composition-limit", title: "Limite d’une fonction composée", pages: [4],
        legacyLessonIds: ["limit-composition"],
        body: String.raw`### Propriété

Pour calculer la limite d’une composée $g\circ f$, on commence par la limite de $f$, puis on utilise celle de $g$.

Si $\lim_{x\to a}f(x)=\ell$ et $\lim_{u\to\ell}g(u)=L$, on obtient :

$$\lim_{x\to a}g(f(x))=L.$$

On vérifie que $g(f(x))$ est définie près de $a$. Si $g$ n’est pas continue en $\ell$, on vérifie aussi que $f(x)$ reste différent de $\ell$ près de $a$.

### Conséquences

Pour une racine carrée, on suppose que $f$ est positive ou nulle près du point étudié :

- Si $\lim_{x\to a}f(x)=\ell\ge0$, alors $\lim_{x\to a}\sqrt{f(x)}=\sqrt\ell$.
- Si $\lim_{x\to a}f(x)=+\infty$, alors $\lim_{x\to a}\sqrt{f(x)}=+\infty$.

Pour une valeur absolue :

- Si $\lim_{x\to a}f(x)=\ell\in\mathbb R$, alors $\lim_{x\to a}\lvert f(x)\rvert=\lvert\ell\rvert$.
- Si $\lim_{x\to a}f(x)=+\infty$, alors $\lim_{x\to a}\lvert f(x)\rvert=+\infty$.
- Si $\lim_{x\to a}f(x)=-\infty$, alors $\lim_{x\to a}\lvert f(x)\rvert=+\infty$.
`,
        examples: [{
          id: "composition-cos", title: "Revenir à une limite de référence",
          prompt: String.raw`Calcule $\lim_{x\to+\infty}x\left(\cos\frac1x-1\right)$.`,
          solution: String.raw`**Utilisons un changement de variable.** Posons $u=1/x$. Quand $x$ tend vers $+\infty$, $u$ tend vers $0^+$.

Pour $x>0$, on a :

$$x\left(\cos\frac1x-1\right)=\frac{\cos u-1}{u}.$$

Or, d’après les limites de référence :

$$\lim_{u\to0}\frac{\cos u-1}{u}=0.$$

Par composition, on conclut :

$$\boxed{\lim_{x\to+\infty}x\left(\cos\frac1x-1\right)=0.}$$
`,
        }],
      },
      {
        id: "comparison-limit", title: "Comparaison et encadrement", pages: [4, 5],
        body: String.raw`### Propriété 1 · Limite infinie

On suppose que les inégalités suivantes sont vérifiées pour $x$ assez grand.

- Si $f(x)\ge g(x)$ et $\lim_{x\to+\infty}g(x)=+\infty$, alors $\lim_{x\to+\infty}f(x)=+\infty$.
- Si $f(x)\le g(x)$ et $\lim_{x\to+\infty}g(x)=-\infty$, alors $\lim_{x\to+\infty}f(x)=-\infty$.

### Propriété 2 · Limite finie

- Si $g(x)\le f(x)\le h(x)$ pour $x$ assez grand, et si $g$ et $h$ ont la même limite $\ell$, alors $f$ tend aussi vers $\ell$.
- Si $\lvert f(x)-\ell\rvert\le g(x)$ pour $x$ assez grand et si $g(x)$ tend vers $0$, alors $f(x)$ tend vers $\ell$.

Ces deux règles permettent de conclure grâce à un **encadrement**.

Les mêmes propriétés s’appliquent en $-\infty$ ou en un réel, à condition que les inégalités soient vérifiées près du point étudié.`,
        examples: [
          {
            id: "comparison-infinity", title: "Minorer pour prouver une limite infinie",
            prompt: String.raw`Sur $]-5;+\infty[$, on sait que $f(x)+\frac67\ge\dfrac{x^2}{x+5}$. Détermine la limite de $f$ en $+\infty$.`,
            solution: String.raw`**Utilisons une comparaison.** L’inégalité donnée entraîne, pour tout $x>-5$ :

$$f(x)\ge\frac{x^2}{x+5}-\frac67.$$

Or :

$$\frac{x^2}{x+5}=\frac{x}{1+5/x},$$

avec $x\to+\infty$ et $1+5/x\to1$. Ainsi :

$$\lim_{x\to+\infty}\left(\frac{x^2}{x+5}-\frac67\right)=+\infty.$$

Par comparaison, on conclut :

$$\boxed{\lim_{x\to+\infty}f(x)=+\infty.}$$
`,
          },
          {
            id: "sandwich-cos", title: "Encadrer une oscillation",
            prompt: String.raw`Calcule $\lim_{x\to+\infty}\left(1-\dfrac{\cos x}{x^2}\right)$.`,
            solution: String.raw`Pour $x\ne0$, $-1\le\cos x\le1$ implique :

$$1-\frac1{x^2}\le1-\frac{\cos x}{x^2}\le1+\frac1{x^2}.$$

Or :

$$\lim_{x\to+\infty}\left(1-\frac1{x^2}\right)=1,\qquad
\lim_{x\to+\infty}\left(1+\frac1{x^2}\right)=1.$$

Par le théorème d’encadrement :

$$\boxed{\lim_{x\to+\infty}\left(1-\frac{\cos x}{x^2}\right)=1.}$$
`,
          },
        ],
      },
      {
        id: "monotone-limit", title: "Limite d’une fonction monotone", pages: [6],
        legacyLessonIds: ["monotone-finite-limit"],
        body: String.raw`On considère une fonction $f$ définie sur un intervalle ouvert $]a;b[$.

### Propriété 1 · Fonction croissante et limite finie

Si $f$ est croissante sur $]a;b[$ :

- si elle est **majorée**, elle possède une limite finie à gauche de $b$ ;
- si elle est **minorée**, elle possède une limite finie à droite de $a$.

### Propriété 2 · Fonction décroissante et limite finie

Si $f$ est décroissante sur $]a;b[$ :

- si elle est **majorée**, elle possède une limite finie à droite de $a$ ;
- si elle est **minorée**, elle possède une limite finie à gauche de $b$.

### Propriété 3 · Fonction croissante et limite infinie

Si $f$ est croissante sur $]a;b[$ :

- si elle n’est **pas majorée**, sa limite à gauche de $b$ est $+\infty$ ;
- si elle n’est **pas minorée**, sa limite à droite de $a$ est $-\infty$.

### Propriété 4 · Fonction décroissante et limite infinie

Si $f$ est décroissante sur $]a;b[$ :

- si elle n’est **pas majorée**, sa limite à droite de $a$ est $+\infty$ ;
- si elle n’est **pas minorée**, sa limite à gauche de $b$ est $-\infty$.

Pour une borne infinie, on lit la limite à l’infini correspondant. Ces propriétés donnent l’existence d’une limite finie, mais pas nécessairement sa valeur.`,
        examples: [{
          id: "tan-monotone", title: "La tangente au bord de son intervalle",
          prompt: String.raw`Que vaut $\lim_{x\to(\pi/2)^-}\tan x$ ?`,
          solution: String.raw`La fonction tangente est croissante sur $]-\pi/2;\pi/2[$ et elle n’est pas majorée sur cet intervalle.

On applique la propriété 3 :

$$\boxed{\lim_{x\to(\pi/2)^-}\tan x=+\infty.}$$
`,
        }],
      },
    ],
  },
  {
    id: "continuity", numeral: "II", title: "Continuité",
    topics: [
      {
        id: "continuity-point", title: "Continuité en un point", pages: [6, 7],
        body: String.raw`### Définition

Soit $f$ définie sur un intervalle contenant $a$. On dit que $f$ est continue en $a$ si sa limite en $a$ est égale à sa valeur $f(a)$ :

$$\lim_{x\to a}f(x)=f(a).$$

À une extrémité de l’intervalle, on utilise la limite du côté où la fonction est définie.

### Propriété

Une somme, un produit ou un quotient de fonctions de référence continues reste continu en chaque point où l’expression est définie. Pour un quotient, le dénominateur doit être non nul.`,
        examples: [{
          id: "square-at-two", title: "Vérifier la définition",
          prompt: String.raw`Montre que $x\mapsto x^2$ est continue en $2$.`,
          solution: String.raw`La fonction est définie en $2$ et $f(2)=2^2=4$. De plus :

$$\lim_{x\to2}f(x)=\lim_{x\to2}x^2=4.$$

On a donc $\lim_{x\to2}f(x)=f(2)$. **Par définition, $f$ est continue en $2$.**`,
        }],
        interaction: {
          kind: "curve", eyebrow: "Observer", title: "Approcher le point d’abscisse 2",
          instruction: "Déplace le point sur la parabole et rapproche son abscisse de 2.",
          observation: "Quand l’abscisse approche 2, l’ordonnée approche 4, qui est aussi la valeur au point.",
          formula: "f(x) = x²", formulaTex: "f(x)=x^2",
          rule: { kind: "polynomial", coefficients: [0, 0, 1] },
          window: { xMin: -1, xMax: 4, yMin: -1, yMax: 10 },
          guides: [{ kind: "vertical", value: 2, label: "x = 2" }, { kind: "horizontal", value: 4, label: "y = 4" }],
          marker: { min: 0, max: 3, step: 0.01, initial: 1.5 },
        },
      },
      {
        id: "continuous-extension", title: "Prolongement par continuité", pages: [7],
        legacyLessonIds: ["continuous-extension"],
        body: String.raw`### Propriété et définition

On suppose que $a$ n’appartient pas au domaine $D_f$ de $f$ et que $f$ possède une limite finie $\ell$ en $a$.

On définit $g$ sur $D_f\cup\{a\}$ par :

$$g(x)=\begin{cases}f(x)&x\in D_f\\\ell&x=a.\end{cases}$$

Alors $g$ est continue en $a$. On l’appelle le **prolongement par continuité de $f$ en $a$**.

Autrement dit, on conserve les valeurs de $f$ et on attribue au point manquant la valeur de la limite.`,
        examples: [{
          id: "sinc-extension", title: "Donner la valeur qui manque",
          prompt: String.raw`Prolonge par continuité en $0$ la fonction $f(x)=\dfrac{\sin x}{x}$.`,
          solution: String.raw`Le domaine de $f$ est $\mathbb R\setminus\{0\}$ : $f$ n’est donc pas définie en $0$. Or :

$$\lim_{x\to0}\frac{\sin x}{x}=1.$$

Définissons $g$ par :

$$g(x)=\begin{cases}\dfrac{\sin x}{x}&\text{si }x\ne0,\\[3pt]1&\text{si }x=0.\end{cases}$$

On a $\lim_{x\to0}g(x)=1=g(0)$. **Donc $g$ est continue en $0$ : c’est le prolongement par continuité recherché.**`,
        }],
      },
      {
        id: "continuity-interval", title: "Continuité sur un intervalle", pages: [8],
        body: String.raw`### Définition

Une fonction $f$ est continue sur un intervalle $I$ lorsqu’elle est continue en chacun des points de $I$.

### Fonctions à connaître

- Les fonctions polynômes sont continues sur $\mathbb R$.
- Les fonctions sinus et cosinus sont continues sur $\mathbb R$.
- Une fonction rationnelle est continue sur tout intervalle où son dénominateur ne s’annule pas.

Pour un intervalle fermé $[a;b]$, la continuité en $a$ s’apprécie à droite, et en $b$ à gauche.`,
      },
      {
        id: "continuity-operations", title: "Opérations sur les fonctions continues", pages: [8],
        legacyLessonIds: ["continuity-operations"],
        body: String.raw`### Propriété

Soient $f$ et $g$ deux fonctions continues sur un intervalle $I$, et $\lambda$ un réel.

- Les fonctions $f+g$, $fg$, $\lambda f$ et $\lvert f\rvert$ sont continues sur $I$.
- Si $g(x)\ne0$ pour tout $x\in I$, les fonctions $1/g$ et $f/g$ sont continues sur $I$.
- Si $f(x)\ge0$ pour tout $x\in I$, la fonction $\sqrt f$ est continue sur $I$.

**Avant d’appliquer une règle, vérifie ses conditions** : le dénominateur doit rester non nul et le radicand doit être positif ou nul.`,
        examples: [{
          id: "positive-quadratic", title: "Vérifier que le dénominateur ne s’annule pas",
          prompt: String.raw`Justifie que $x\mapsto\dfrac1{x^2-x+5}$ est continue sur $\mathbb R$.`,
          solution: String.raw`Posons $f(x)=x^2-x+5$. Comme $f$ est un polynôme, elle est continue sur $\mathbb R$.

**Vérifions qu’elle ne s’annule pas :**

$$x^2-x+5=\left(x-\frac12\right)^2+\frac{19}4>0.$$

La somme d’un carré et de $19/4$ est strictement positive. Donc $f(x)\ne0$ pour tout réel $x$.

Par la propriété sur l’inverse d’une fonction continue, **$x\mapsto\dfrac1{x^2-x+5}$ est continue sur $\mathbb R$.**`,
        }],
      },
      {
        id: "image-interval", title: "Image d’un intervalle", pages: [8, 9],
        legacyLessonIds: ["continuous-image-interval"],
        body: String.raw`### Propriété 1

Si $f$ est continue sur un intervalle $I$, alors son image $f(I)$ est également un intervalle.

Si $f$ est continue sur un intervalle fermé borné $[a;b]$, elle atteint un minimum $m$ et un maximum $M$, et :

$$f([a;b])=[m;M].$$

Les nombres $m$ et $M$ sont respectivement le minimum et le maximum de $f$ sur $[a;b]$. Ils ne sont pas forcément $f(a)$ et $f(b)$.

### Propriété 2 · Cas d’une fonction strictement monotone

On note $\ell=\lim_{x\to a^+}f(x)$ et $L=\lim_{x\to b^-}f(x)$.

| Fonction continue et strictement monotone | Image de $[a;b]$ | Image de $]a;b[$ |
| --- | --- | --- |
| Croissante | $[f(a);f(b)]$ | $]\ell;L[$ |
| Décroissante | $[f(b);f(a)]$ | $]L;\ell[$ |

On écrit toujours la plus petite borne à gauche. Pour un intervalle semi-ouvert, on conserve ou exclut la borne suivant que l’extrémité correspondante appartient ou non à l’intervalle de départ.`,
        examples: [{
          id: "sin-image", title: "Déterminer une image",
          prompt: String.raw`Détermine l’image de $[0;\pi/2]$ par la fonction sinus.`,
          solution: String.raw`La fonction sinus est continue et strictement croissante sur $[0;\pi/2]$. Par la propriété 2 :

$$\sin([0;\pi/2])=[\sin0;\sin(\pi/2)].$$

Or $\sin0=0$ et $\sin(\pi/2)=1$. **Donc $\sin([0;\pi/2])=[0;1]$.**`,
        }],
      },
      {
        id: "continuity-composition", title: "Continuité d’une composée", pages: [9],
        body: String.raw`### Propriété

Soient $I$ et $J$ deux intervalles. Si $f$ est continue sur $I$, si son image $f(I)$ est incluse dans $J$, et si $g$ est continue sur $J$, alors la composée $g\circ f$ est continue sur $I$.`,
        examples: [{
          id: "tan-composite", title: "Contrôler l’intervalle d’arrivée",
          prompt: String.raw`Justifie la continuité sur $\mathbb R$ de $h(x)=\tan\left(\dfrac{x^2+1}{x^2+3}\right)$.`,
          solution: String.raw`**Écrivons $h$ comme une composée.** Posons :

$$f(x)=\frac{x^2+1}{x^2+3},\qquad g(u)=\tan u.$$

On a $h=g\circ f$.

La fonction $f$ est continue sur $\mathbb R$ car son dénominateur $x^2+3$ ne s’annule pas.

Comme $f(x)=1-\frac2{x^2+3}$ et $x^2+3\ge3$, on obtient $f(\mathbb R)=[1/3;1[$.

Or $[1/3;1[\subset]-\pi/2;\pi/2[$, intervalle sur lequel $g$ est continue.

Par la propriété de continuité d’une composée, **$h$ est continue sur $\mathbb R$.**`,
        }],
      },
      {
        id: "intermediate-value", title: "Théorème des valeurs intermédiaires", pages: [9, 10],
        legacyLessonIds: ["intermediate-value-theorem"],
        body: String.raw`### Théorème

Soit $f$ continue sur un intervalle $I$, et soient $a,b\in I$ avec $a<b$.

Tout réel compris entre $f(a)$ et $f(b)$ possède au moins un antécédent dans $[a;b]$.

### Conséquence

En particulier, si $f$ est continue sur $[a;b]$ et $f(a)f(b)<0$, alors il existe au moins un $\alpha\in]a;b[$ tel que $f(\alpha)=0$.

La continuité et le changement de signe prouvent **l’existence**, pas l’unicité. Pour l’unicité, on peut ajouter la stricte monotonie.`,
        examples: [{
          id: "quadratic-root", title: "Prouver l’existence d’une solution",
          prompt: String.raw`Montre que $x^2+x-1=0$ admet une solution dans $]0;1[$.`,
          solution: String.raw`Soit $f(x)=x^2+x-1$. C’est une fonction polynôme, donc elle est continue sur $[0;1]$.

Calculons ses valeurs aux bornes :

$$f(0)=-1,\qquad f(1)=1.$$

On a $f(0)f(1)=-1<0$.

Par le théorème des valeurs intermédiaires, **il existe au moins un $\alpha\in]0;1[$ tel que $f(\alpha)=0$**. L’équation possède donc une solution dans $]0;1[$.`,
        }],
      },
      {
        id: "bijection-inverse", title: "Bijection et fonction réciproque", pages: [10],
        legacyLessonIds: ["continuous-bijection-inverse"],
        body: String.raw`### Propriété 1 · Bijection

Si une fonction $f$ est continue et strictement monotone sur un intervalle $I$, alors elle réalise une bijection de $I$ sur $f(I)$.

Cela signifie que chaque élément de $f(I)$ a un seul antécédent dans $I$.

### Propriété 2 · Bijection réciproque

Dans ces conditions, la fonction réciproque $f^{-1}$ est continue et strictement monotone sur $f(I)$. Elle varie dans le **même sens** que $f$.

La notation $f^{-1}$ désigne ici la fonction réciproque, pas la fonction $1/f$.`,
        examples: [
          {
            id: "tan-bijection", title: "Une bijection vers tous les réels",
            prompt: String.raw`Que permet d’affirmer l’étude de $\tan$ sur $]-\pi/2;\pi/2[$ ?`,
            solution: String.raw`La fonction tangente est continue et strictement croissante sur $]-\pi/2;\pi/2[$. De plus :

$$\lim_{x\to(-\pi/2)^+}\tan x=-\infty,\qquad
\lim_{x\to(\pi/2)^-}\tan x=+\infty.$$

Son image est donc $\mathbb R$.

Par la propriété 1, **la tangente réalise une bijection de $]-\pi/2;\pi/2[$ sur $\mathbb R$**.`,
          },
          {
            id: "cos-inverse", title: "Le sens de variation est conservé",
            prompt: String.raw`Étudie la réciproque de la restriction de $\cos$ à $[0;\pi]$.`,
            solution: String.raw`La fonction cosinus est continue sur $[0;\pi]$ et strictement décroissante sur cet intervalle. Comme $\cos0=1$ et $\cos\pi=-1$ :

$$\cos([0;\pi])=[-1;1].$$

La restriction de $\cos$ à $[0;\pi]$ réalise donc une bijection sur $[-1;1]$.

Par la propriété 2, sa réciproque est **continue et strictement décroissante sur $[-1;1]$**, à valeurs dans $[0;\pi]$.`,
          },
        ],
      },
    ],
  },
  {
    id: "infinite-branches", numeral: "III", title: "Étude d’une branche infinie",
    topics: [
      {
        id: "asymptotes", title: "Reconnaître une asymptote", pages: [11],
        body: String.raw`Soit $\mathcal C_f$ la courbe représentative d’une fonction $f$.

### Asymptote horizontale

La droite $y=\ell$ est une asymptote horizontale à $\mathcal C_f$ en $+\infty$ ou en $-\infty$ lorsque $f$ tend vers la limite finie $\ell$ à cette extrémité.

### Asymptote verticale

La droite $x=x_0$ est une asymptote verticale à $\mathcal C_f$ lorsque $f$ possède une limite infinie à gauche ou à droite de $x_0$.

### Asymptote oblique

Pour $a\ne0$, la droite $y=ax+b$ est une asymptote oblique à $\mathcal C_f$ à l’extrémité étudiée si :

$$\lim_{x\to+\infty}\big(f(x)-(ax+b)\big)=0$$

ou, pour l’étude en $-\infty$, si la même différence tend vers $0$ quand $x\to-\infty$.

Pour chercher $a$ puis $b$, on calcule d’abord $f(x)/x$, puis $f(x)-ax$ si la première limite est finie.`,
        examples: [
          {
            id: "rational-asymptotes", title: "Une asymptote verticale et une horizontale",
            prompt: String.raw`Étudie les asymptotes de $f(x)=\dfrac{2x+3}{x-1}$ sur $]1;+\infty[$.`,
            parts: [
              {
                id: "asymptote-horizontal", label: "a)", prompt: "Asymptote horizontale en +∞.",
                solution: String.raw`**Réécrivons la fonction :**

$$f(x)=\frac{2(x-1)+5}{x-1}=2+\frac5{x-1}.$$

Comme $\lim_{x\to+\infty}\frac5{x-1}=0$, on obtient :

$$\lim_{x\to+\infty}f(x)=2.$$

**Donc la droite d’équation $y=2$ est une asymptote horizontale à $\mathcal C_f$ en $+\infty$.**`,
              },
              {
                id: "asymptote-vertical", label: "b)", prompt: "Asymptote verticale au voisinage de 1.",
                solution: String.raw`**Calculons la limite à droite de $1$.** On a :

$$\lim_{x\to1^+}(2x+3)=5>0,\qquad
\lim_{x\to1^+}(x-1)=0^+.$$

Par la règle du quotient :

$$\lim_{x\to1^+}\frac{2x+3}{x-1}=+\infty.$$

**Donc la droite d’équation $x=1$ est une asymptote verticale à $\mathcal C_f$.**`,
              },
            ],
          },
          {
            id: "oblique-asymptote", title: "Soustraire la droite",
            prompt: String.raw`Montre que $y=x-5$ est une asymptote en $+\infty$ de $f(x)=\dfrac{x^3-5x^2+x-4}{x^2+1}$.`,
            solution: String.raw`**Calculons la différence entre la fonction et l’expression de la droite.** La division de $x^3-5x^2+x-4$ par $x^2+1$ donne :

$$f(x)=x-5+\frac1{x^2+1}.$$

Ainsi :

$$f(x)-(x-5)=\frac1{x^2+1}.$$

Or $\lim_{x\to+\infty}\frac1{x^2+1}=0$. Donc :

$$\lim_{x\to+\infty}\big(f(x)-(x-5)\big)=0.$$

**La droite d’équation $y=x-5$ est une asymptote oblique à $\mathcal C_f$ en $+\infty$.**`,
          },
        ],
        interaction: {
          kind: "curve", eyebrow: "Observer", title: "La courbe et ses asymptotes",
          instruction: "Déplace le point : compare son comportement près de x = 1 et loin vers la droite.",
          observation: "La courbe s’élève près de x = 1 et se rapproche de y = 2 lorsque x augmente.",
          formula: "f(x) = (2x + 3)/(x − 1)", formulaTex: "f(x)=\\frac{2x+3}{x-1}",
          rule: { kind: "rational-linear", numerator: [2, 3], denominator: [1, -1] },
          window: { xMin: 0, xMax: 12, yMin: 0, yMax: 12 },
          guides: [{ kind: "vertical", value: 1, label: "x = 1" }, { kind: "horizontal", value: 2, label: "y = 2" }],
          marker: { min: 1.5, max: 12, step: 0.1, initial: 3 },
        },
      },
      {
        id: "parabolic-branches", title: "Branches paraboliques et directions asymptotiques", pages: [12, 13],
        legacyLessonIds: ["parabolic-branches"],
        body: String.raw`### Propriété

On suppose que $f(x)$ tend vers $+\infty$ ou $-\infty$ lorsque $x$ tend vers l’infini étudié.

Pour déterminer la direction de la branche infinie, on calcule la limite de $f(x)/x$.

| Limite de $f(x)/x$ | Étape suivante | Interprétation |
| --- | --- | --- |
| $+\infty$ ou $-\infty$ | — | Branche parabolique de direction $(Oy)$ |
| $0$ | — | Branche parabolique de direction $(Ox)$ |
| $a\ne0$ fini | Calculer $f(x)-ax$ | Étudier la direction $y=ax$ |

La direction $(Ox)$ est celle de l’axe des abscisses ; la direction $(Oy)$ est celle de l’axe des ordonnées.`,
        examples: [{
          id: "axis-branches", title: "Deux directions de branches paraboliques",
          prompt: "Étudions la branche infinie en +∞ de chacune des fonctions suivantes.",
          parts: [
            {
              id: "axis-branch-y", label: "a)", prompt: String.raw`$f(x)=\dfrac1x+x^3$.`,
              solution: String.raw`On a $\lim_{x\to+\infty}f(x)=+\infty$. D’autre part :

$$\frac{f(x)}x=\frac1{x^2}+x^2.$$

Comme $1/x^2\to0$ et $x^2\to+\infty$ :

$$\lim_{x\to+\infty}\frac{f(x)}x=+\infty.$$

**La courbe de $f$ admet donc une branche parabolique de direction $(Oy)$ en $+\infty$.**`,
            },
            {
              id: "axis-branch-x", label: "b)", prompt: String.raw`$f(x)=\sqrt x$.`,
              solution: String.raw`On a $\lim_{x\to+\infty}\sqrt x=+\infty$. Pour $x>0$ :

$$\frac{f(x)}x=\frac{\sqrt x}{x}=\frac1{\sqrt x}.$$

Comme $\sqrt x\to+\infty$ :

$$\lim_{x\to+\infty}\frac{f(x)}x=0.$$

**La courbe de $f$ admet donc une branche parabolique de direction $(Ox)$ en $+\infty$.**`,
            },
          ],
        }],
        detail: String.raw`Une branche parabolique est une description du comportement de la courbe, pas l’affirmation que toute la courbe est une parabole. Il faut vérifier **les deux limites** : celle de $f$ et celle de $f/x$.`,
      },
      {
        id: "other-directions", title: "Autres directions : aller plus loin", pages: [12, 13], optional: true,
        body: String.raw`### Propriété

Toujours sous l’hypothèse d’une limite infinie de $f$, si $f(x)/x$ tend vers un réel non nul $a$, on calcule ensuite la limite de $f(x)-ax$ :

| Limite de $f(x)-ax$ | Conclusion |
| --- | --- |
| $b\in\mathbb R$, y compris $b=0$ | Asymptote $y=ax+b$ |
| $+\infty$ ou $-\infty$ | Branche parabolique de direction $y=ax$ |
| Pas de limite | Direction asymptotique $y=ax$, sans asymptote de la forme $y=ax+b$ |

Si $f(x)/x$ n’a pas de limite, on ne conclut à aucune de ces directions par ce critère.`,
        examples: [
          {
            id: "zero-intercept", title: "Le cas où $b=0$",
            prompt: String.raw`Étudie $g(x)=\dfrac{2x^2}{\sqrt{x^2+1}}$ en $+\infty$.`,
            solution: String.raw`On a $g(x)/x=\frac{2}{\sqrt{1+1/x^2}}\to2$.

Pour $x>0$, en utilisant l’expression conjuguée :

$$g(x)-2x=\frac{-2x}{\sqrt{x^2+1}\big(x+\sqrt{x^2+1}\big)}\longrightarrow0.$$

La droite **$y=2x$** est une asymptote oblique.`,
          },
          {
            id: "slanted-parabolic", title: "Une branche de direction oblique",
            prompt: String.raw`Étudie $f(x)=2x+\sqrt x$ en $+\infty$.`,
            solution: String.raw`$f(x)/x=2+1/\sqrt x\to2$, mais $f(x)-2x=\sqrt x\to+\infty$. Il s’agit d’une **branche parabolique de direction $y=2x$**, et non d’une asymptote.`,
          },
          {
            id: "oscillating-distance", title: "Une direction sans asymptote",
            prompt: String.raw`Étudie $f(x)=3x+\sin x$ en $+\infty$.`,
            solution: String.raw`$f(x)\to+\infty$ et $f(x)/x=3+\sin x/x\to3$. Mais $f(x)-3x=\sin x$ n’a pas de limite. La droite **$y=3x$ donne une direction asymptotique**, pas une asymptote.`,
          },
          {
            id: "no-direction", title: "Quand le quotient n’a pas de limite",
            prompt: String.raw`Étudie $f(x)=\frac\pi2x+x\cos x$ en $+\infty$.`,
            solution: String.raw`Comme $f(x)\ge x(\pi/2-1)$ et $\pi/2-1>0$, on a $f(x)\to+\infty$. En revanche, $f(x)/x=\pi/2+\cos x$ n’a pas de limite : ce critère ne fournit **ni direction asymptotique ni branche parabolique**.`,
          },
        ],
      },
    ],
  },
  {
    id: "rational-powers", numeral: "IV", title: "Fonction puissance d’exposant rationnel",
    topics: [
      {
        id: "nth-root", title: "Racine n-ième d’un réel positif", pages: [13, 14],
        body: String.raw`### Définition

Pour un entier $n\ge2$, la fonction $x\mapsto x^n$ réalise une bijection de $[0;+\infty[$ sur $[0;+\infty[$.

On appelle **fonction racine n-ième** la fonction réciproque de cette bijection.

### Notation

$$y\ge0,\qquad \sqrt[n]{y}=y^{1/n}.$$

$\sqrt[n]{y}$ est l’unique nombre positif ou nul dont la puissance $n$ vaut $y$.

Dans un repère orthonormé, les courbes de $x\mapsto x^n$ et de $x\mapsto\sqrt[n]x$, sur $[0;+\infty[$, sont symétriques par rapport à la droite $y=x$.`,
        examples: [{
          id: "fifth-root", title: "Lire la relation dans les deux sens",
          prompt: String.raw`Quelle est la réciproque de $x\mapsto x^5$ sur $[0;+\infty[$ ?`,
          solution: String.raw`Pour $x,y\ge0$ :

$$y=x^5\quad\Longleftrightarrow\quad x=y^{1/5}=\sqrt[5]y.$$

La réciproque est la **fonction racine cinquième**.`,
        }],
      },
      {
        id: "power-laws", title: "Définition et calcul des puissances rationnelles", pages: [14],
        legacyLessonIds: ["rational-powers", "complete-function-study-mission"],
        body: String.raw`### Propriété et définition

Pour un rationnel positif $r=p/q$, avec $p,q\in\mathbb N^*$, et un réel $x\ge0$, on pose :

$$x^{p/q}=\sqrt[q]{x^p}.$$

Cette valeur ne dépend pas de l’écriture de $r$ : si $p/q=p'/q'$, alors $(x^p)^{1/q}=(x^{p'})^{1/q'}$.

Pour un rationnel négatif $r$ et un réel $x>0$, on définit $x^r=1/x^{-r}$. On pose aussi $x^0=1$ pour $x>0$.

### Propriétés de calcul

Pour $x,y>0$ et $r,r'\in\mathbb Q$ :

| Opération | Propriété |
| --- | --- |
| Même exposant, produit | $x^ry^r=(xy)^r$ |
| Puissance d’une puissance | $(x^r)^{r'}=x^{rr'}$ |
| Même exposant, quotient | $\dfrac{x^r}{y^r}=\left(\dfrac xy\right)^r$ |
| Même base, produit | $x^rx^{r'}=x^{r+r'}$ |
| Même base, quotient | $\dfrac{x^r}{x^{r'}}=x^{r-r'}$ |

Les hypothèses sur la base évitent notamment les divisions par zéro et les racines paires de nombres négatifs.`,
        examples: [{
          id: "rational-exponents-example", title: "Décomposer les bases en facteurs premiers",
          prompt: String.raw`Simplifie $\dfrac{6^{2/5}}{18^{5/7}}$.`,
          solution: String.raw`On utilise $6=2\times3$ et $18=2\times3^2$ :

$$\frac{6^{2/5}}{18^{5/7}}
=2^{\,2/5-5/7}\,3^{\,2/5-10/7}
=2^{-11/35}\,3^{-36/35}.$$

Les exposants se **soustraient** lorsqu’on divise des puissances de même base. Ici $2/5=14/35$, $5/7=25/35$ et $10/7=50/35$.`,
        }],
      },
    ],
  },
];
