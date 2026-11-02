import { section, sheet } from "./types";

export default sheet("limits", "Limites et continuité", [11, 12, 13, 14], [
  section("essential-limits-language", "I", "Lire une limite", [11, 13], String.raw`
Écrire $\lim_{x\to a}f(x)=\ell$ signifie que les valeurs de $f(x)$ se rapprochent de $\ell$ lorsque $x$ se rapproche de $a$, dans le domaine de $f$.

| Approche | Notation |
| --- | --- |
| Par valeurs inférieures à $a$ | $\lim_{x\to a^-}f(x)$ |
| Par valeurs supérieures à $a$ | $\lim_{x\to a^+}f(x)$ |
| Vers les grands réels positifs | $\lim_{x\to+\infty}f(x)$ |
| Vers les réels négatifs de grande valeur absolue | $\lim_{x\to-\infty}f(x)$ |

Lorsque les deux côtés de $a$ sont accessibles, une limite en $a$ existe si les deux limites latérales existent et sont égales. Si elles sont différentes, il n’y a pas de limite commune.

**Composer deux fonctions.** Si $g(x)\to b$ et si $f(t)\to\ell$ lorsque $t\to b$ dans les valeurs effectivement prises par $g$, alors $f(g(x))\to\ell$. En particulier, si $f$ est continue en $b$, la limite est $f(b)$.

**Encadrer une fonction.** Si $h(x)\le f(x)\le g(x)$ au voisinage étudié et si $h(x)\to\ell$ et $g(x)\to\ell$, alors $f(x)\to\ell$ : c’est le théorème des gendarmes.
`),
  section("essential-limits-reference", "II", "Les limites de référence", [11, 12], String.raw`
| Fonction | Quand $x\to+\infty$ | Quand $x\to-\infty$ |
| --- | --- | --- |
| $x$ | $+\infty$ | $-\infty$ |
| $x^2$ | $+\infty$ | $+\infty$ |
| $x^3$ | $+\infty$ | $-\infty$ |
| $\sqrt{x}$ | $+\infty$ | Non définie sur les réels négatifs |
| $1/x$ | $0$ | $0$ |
| $1/x^2$ | $0$ | $0$ |
| $1/x^3$ | $0$ | $0$ |
| $1/\sqrt{x}$ | $0$ | Non définie sur les réels négatifs |

**Au voisinage de zéro :**

$$\lim_{x\to0^+}\frac1x=+\infty,\qquad \lim_{x\to0^-}\frac1x=-\infty.$$

$$\lim_{x\to0}\frac1{x^2}=+\infty.$$

Pour tout entier $n\ge1$, $\frac1{(x-a)^n}\to+\infty$ à droite de $a$. À gauche, la limite est $+\infty$ si $n$ est pair, $-\infty$ s’il est impair.

**Trigonométrie : les angles sont en radians.**

$$\lim_{x\to0}\frac{\sin x}{x}=1,\qquad \lim_{x\to0}\frac{\tan x}{x}=1.$$

$$\lim_{x\to0}\frac{1-\cos x}{x}=0,\qquad \lim_{x\to0}\frac{1-\cos x}{x^2}=\frac12.$$

Les fonctions sinus et cosinus n’ont pas de limite en $+\infty$ ni en $-\infty$ : elles continuent à osciller.
`),
  section("essential-limits-polynomials", "III", "Polynômes et fractions rationnelles", [11, 12, 14], String.raw`
**À l’infini, on se ramène aux termes de plus haut degré.**

Si $P(x)=a_nx^n+\cdots+a_0$, avec $a_n\ne0$, alors $P(x)$ a la même limite que $a_nx^n$ en $+\infty$ ou en $-\infty$. Pour le justifier, on factorise par $x^n$.

Si $Q(x)=b_qx^q+\cdots+b_0$, avec $b_q\ne0$, on étudie de la même façon

$$\frac{P(x)}{Q(x)}\quad\text{à partir de}\quad\frac{a_n}{b_q}x^{n-q}.$$

| Degrés | Résultat à l’infini |
| --- | --- |
| $n<q$ | La limite vaut $0$ |
| $n=q$ | La limite vaut $a_n/b_q$ |
| $n>q$ | On détermine le signe de $(a_n/b_q)x^{n-q}$ |

Pour $n\ge1$ :

| Signe de $a$ et parité | $ax^n$ en $+\infty$ | $ax^n$ en $-\infty$ |
| --- | --- | --- |
| $a>0$, $n$ pair | $+\infty$ | $+\infty$ |
| $a>0$, $n$ impair | $+\infty$ | $-\infty$ |
| $a<0$, $n$ pair | $-\infty$ | $-\infty$ |
| $a<0$, $n$ impair | $-\infty$ | $+\infty$ |

**En un réel $a$**, remplacer directement $x$ par $a$ est permis pour une fonction continue en $a$ et définie en ce point. Pour une fraction rationnelle, vérifier d’abord que le dénominateur ne s’annule pas.
`),
  section("essential-limits-indeterminate", "IV", "Lever une forme indéterminée", [12, 13], String.raw`
Les écritures $\frac00$, $\frac{\infty}{\infty}$, $\infty-\infty$ et $0\times\infty$ ne donnent pas un résultat : elles indiquent qu’il faut transformer l’expression.

| Forme rencontrée | Une méthode à essayer |
| --- | --- |
| $\frac00$ avec des polynômes | Factoriser, puis simplifier pour $x\ne a$ |
| $\frac00$ avec une racine | Multiplier par l’expression conjuguée |
| $\frac{\infty}{\infty}$ | Factoriser par les puissances dominantes |
| $\infty-\infty$ | Réduire au même dénominateur ou utiliser la conjuguée |
| $0\times\infty$ | Transformer le produit en quotient |

**Avec une racine**, l’identité utile est

$$\sqrt{A}-B=\frac{A-B^2}{\sqrt{A}+B},$$

lorsque les expressions sont définies et que le nouveau dénominateur est non nul.

Pour $\sqrt{ax^2+bx+c}-dx$, avec $a>0$, penser d’abord à $\sqrt{x^2}=\lvert x\rvert$ :

- en $+\infty$, le coefficient dominant est $\sqrt a-d$ ;
- en $-\infty$, écrire la racine comme $\lvert x\rvert\sqrt{a+b/x+c/x^2}$.

Si les termes dominants se compensent, la conjuguée permet de poursuivre le calcul.

**Reconnaître un taux d’accroissement :**

$$\lim_{x\to a}\frac{f(x)-f(a)}{x-a}=f'(a)$$

si $f$ est dérivable en $a$.
`),
  section("essential-limits-sign", "V", "Garder le bon signe", [13, 14], String.raw`
**Un numérateur de limite non nulle sur un dénominateur tendant vers zéro :** étudier le signe du dénominateur du côté choisi.

| Numérateur tend vers… | Dénominateur tend vers… | Quotient tend vers… |
| --- | --- | --- |
| Un réel positif | $0^+$ | $+\infty$ |
| Un réel positif | $0^-$ | $-\infty$ |
| Un réel négatif | $0^+$ | $-\infty$ |
| Un réel négatif | $0^-$ | $+\infty$ |

Un numérateur qui tend vers un réel fini divisé par un dénominateur dont la valeur absolue tend vers l’infini donne une limite nulle.

**Passer à la racine.** Si $u(x)\ge0$ au voisinage étudié :

- si $u(x)\to\ell\ge0$, alors $\sqrt{u(x)}\to\sqrt\ell$ ;
- si $u(x)\to+\infty$, alors $\sqrt{u(x)}\to+\infty$.
`),
  section("essential-limits-continuity", "VI", "Continuité et prolongement", [14], String.raw`
Une fonction est **continue en $a$** lorsqu’elle est définie en $a$ et que

$$\lim_{x\to a}f(x)=f(a).$$

Elle est continue à droite en $a$ si sa limite à droite vaut $f(a)$ ; même principe à gauche. Lorsque les deux côtés sont accessibles, la continuité exige ces deux égalités.

**Prolonger une fonction en un point manquant.** Si $a$ n’appartient pas au domaine de $f$ et si $f(x)\to\ell$ avec $\ell$ fini quand $x\to a$, on pose

$$g(x)=\begin{cases}f(x)&\text{si }x\ne a,\\ \ell&\text{si }x=a.\end{cases}$$

La fonction $g$ est alors le prolongement par continuité de $f$ en $a$. Une limite infinie ne permet pas un tel prolongement à valeur réelle.
`),
], [
  "P11 : quotient des coefficients dominants rétabli en a_n/b_q ; composition sans restriction artificielle b∈N.",
  "P13 : radical dominant traité avec |x|, pas la condition a²=d ; substitution directe réservée à la continuité.",
  "P14 : continuité de la racine et point absent du domaine pour le prolongement rectifiés.",
]);
