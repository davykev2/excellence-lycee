import { section, sheet } from "./types";

export default sheet("logarithms", "Fonctions logarithmes", [51, 52], [
  section("essential-log-definition", "I", "Définition, signe et ordre", [51], String.raw`
La fonction logarithme népérien, notée $\ln$, est définie sur $]0;+\infty[$. C’est la primitive de $x\mapsto1/x$ qui s’annule en $1$ :

$$\ln1=0,\qquad (\ln x)'=\frac1x.$$

Elle est strictement croissante. Le nombre $e\approx2{,}718$ vérifie $\ln e=1$.

Pour $a,b>0$ :

$$\ln a=\ln b\iff a=b,\qquad \ln a<\ln b\iff a<b.$$

| Valeur de $x$ | Signe de $\ln x$ |
| --- | --- |
| $0<x<1$ | Négatif |
| $x=1$ | Nul |
| $x>1$ | Positif |

Le lien avec l’exponentielle est $\ln x=y\iff x=e^y$, avec $x>0$.
`),
  section("essential-log-algebra", "II", "Transformer un logarithme", [51], String.raw`
Pour $a,b>0$ et $n\in\mathbb Z$ :

| Expression | Écriture utile |
| --- | --- |
| $\ln(ab)$ | $\ln a+\ln b$ |
| $\ln(a/b)$ | $\ln a-\ln b$ |
| $\ln(1/a)$ | $-\ln a$ |
| $\ln(a^n)$ | $n\ln a$ |
| $\ln\sqrt a$ | $\frac12\ln a$ |

Ces propriétés portent sur un **produit**, un **quotient** ou une **puissance**. Elles ne permettent pas de remplacer $\ln(a+b)$ par $\ln a+\ln b$.
`),
  section("essential-log-domains", "III", "Trouver le domaine avant de calculer", [51], String.raw`
L’argument placé à l’intérieur d’un logarithme doit être strictement positif.

| Expression | Condition exacte |
| --- | --- |
| $\ln u$ | $u>0$ |
| $\ln\lvert u\rvert$ | $u\ne0$ |
| $\ln(u^2)$ | $u\ne0$ |
| $(\ln u)^2$ | $u>0$ |
| $\ln\sqrt u$ | $u>0$ |
| $\ln(u/v)$ | $v\ne0$ et $u/v>0$ |
| $\ln\lvert u/v\rvert$ | $u\ne0$ et $v\ne0$ |
| $\ln(uv)$ | $uv>0$ |

Pour $\ln(uv)$ ou $\ln(u/v)$, $u$ et $v$ peuvent être tous deux négatifs. Dans ce cas, ne pas écrire séparément $\ln u$ et $\ln v$ ; utiliser les valeurs absolues si l’on décompose.
`),
  section("essential-log-limits", "IV", "Limites et croissances comparées", [52], String.raw`
$$\lim_{x\to0^+}\ln x=-\infty,\qquad \lim_{x\to+\infty}\ln x=+\infty.$$

$$\lim_{x\to+\infty}\frac{\ln x}{x}=0,\qquad
\lim_{x\to-\infty}\frac{\ln\lvert x\rvert}{x}=0.$$

Pour tout réel $\alpha>0$ :

$$\lim_{x\to+\infty}\frac{\ln x}{x^\alpha}=0,\qquad
\lim_{x\to0^+}x^\alpha\ln x=0.$$

En particulier, $\lim_{x\to0^+}x\ln x=0$.

De plus, $\ln\lvert x\rvert\to+\infty$ quand $x\to+\infty$ ou $x\to-\infty$.

**Les deux taux de référence :**

$$\lim_{x\to0}\frac{\ln(1+x)}x=1,\qquad
\lim_{x\to1}\frac{\ln x}{x-1}=1.$$

La première limite est étudiée pour $x>-1$. Ces formules sont des taux d’accroissement de $\ln$ en $1$.
`),
  section("essential-log-derivative", "V", "Dériver et trouver une primitive", [52], String.raw`
Si $u$ est dérivable :

| Fonction | Dérivée |
| --- | --- |
| $\ln u$, avec $u>0$ | $\frac{u'}u$ |
| $\ln\lvert u\rvert$, avec $u\ne0$ | $\frac{u'}u$ |
| $\ln(uv)$, avec $uv>0$ | $\frac{u'}u+\frac{v'}v$ |
| $\ln(u/v)$, avec $u/v>0$ | $\frac{u'}u-\frac{v'}v$ |
| $\ln\lvert u^n\rvert$, $u\ne0$, $n\in\mathbb Z$ | $n\frac{u'}u$ |
| $(\ln u)^n$, $u>0$ | $n\frac{u'}u(\ln u)^{n-1}$ |
| $(\ln\lvert u\rvert)^n$, $u\ne0$ | $n\frac{u'}u(\ln\lvert u\rvert)^{n-1}$ |

Les puissances et quotients supplémentaires doivent eux-mêmes être définis.

**Primitives à reconnaître :**

$$\frac1x\longmapsto\ln\lvert x\rvert,\qquad
\frac{u'}u\longmapsto\ln\lvert u\rvert.$$

Pour $a\ne0$, sur un intervalle où $ax+b\ne0$ :

$$\frac{k}{ax+b}\longmapsto\frac ka\ln\lvert ax+b\rvert.$$

Le facteur $1/a$ compense la dérivée intérieure de $ax+b$. Ajouter une constante pour obtenir toutes les primitives.
`),
], [
  "P52 : ln(1+x)/x en 0 et ln(x)/(x−1) en 1 rétablis ; pas de ln(x) réel en −∞.",
  "Domaines des produits/quotients et logarithmes de valeurs absolues séparés.",
]);
