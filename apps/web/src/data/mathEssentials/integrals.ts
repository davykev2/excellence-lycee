import { section, sheet } from "./types";

export default sheet("integrals", "Calcul intégral", [96, 97], [
  section("essential-integral-definition", "I", "Calculer une intégrale avec une primitive", [96], String.raw`
Soit $f$ continue sur un intervalle contenant $a$ et $b$, et $F$ une primitive de $f$. On définit

$$\int_a^b f(x)\,dx=F(b)-F(a)=\left[F(x)\right]_a^b.$$

Le résultat ne dépend pas de la primitive choisie : la constante s’élimine dans la différence.

La lettre d’intégration est muette :

$$\int_a^b f(x)\,dx=\int_a^b f(t)\,dt.$$

Deux égalités à retenir :

$$\int_a^a f(x)\,dx=0,\qquad
\int_b^a f(x)\,dx=-\int_a^b f(x)\,dx.$$
`),
  section("essential-integral-variable", "II", "Une primitive définie par une intégrale", [96], String.raw`
Si $f$ est continue sur $I$ et $a\in I$, la fonction

$$G(x)=\int_a^x f(t)\,dt$$

est la primitive de $f$ qui s’annule en $a$ :

$$G'(x)=f(x),\qquad G(a)=0.$$

La borne supérieure $x$ varie ; la lettre $t$ reste la variable d’intégration.
`),
  section("essential-integral-properties", "III", "Découper et combiner des intégrales", [96, 97], String.raw`
**Relation de Chasles :**

$$\int_a^b f(x)\,dx=\int_a^c f(x)\,dx+\int_c^b f(x)\,dx.$$

Elle permet de partager un calcul en plusieurs intervalles, notamment aux changements de signe.

**Linéarité**, pour des constantes $\lambda,\mu$ :

$$\int_a^b(\lambda f+\mu g)(x)\,dx
=\lambda\int_a^b f(x)\,dx+\mu\int_a^b g(x)\,dx.$$

**Ordre**, avec $a\le b$ :

- si $f(x)\ge0$ sur $[a;b]$, alors $\int_a^b f(x)\,dx\ge0$ ;
- si $f(x)\le g(x)$ sur $[a;b]$, alors $\int_a^b f(x)\,dx\le\int_a^b g(x)\,dx$.

Si l’on inverse les bornes, le signe de l’intégrale change : il faut en tenir compte dans une inégalité.
`),
  section("essential-integral-parts", "IV", "Intégration par parties", [97], String.raw`
Pour des fonctions $u$ et $v$ de classe $C^1$ sur l’intervalle considéré :

$$\int_a^b u(x)v'(x)\,dx
=\left[u(x)v(x)\right]_a^b-\int_a^b u'(x)v(x)\,dx.$$

**Pour bien rédiger :**

1. Annoncer le choix de $u$ et de $v'$.
2. Calculer $u'$ et une primitive $v$.
3. Écrire le terme aux bornes.
4. Calculer l’intégrale restante, puis conclure.

Le choix est utile lorsque dériver $u$ et intégrer $v'$ rend le nouveau produit plus simple.
`),
  section("essential-integral-symmetry", "V", "Utiliser une symétrie ou une période", [97], String.raw`
Pour $a>0$ et $f$ continue sur $[-a;a]$ :

| Hypothèse | Conséquence |
| --- | --- |
| $f$ paire | $\int_{-a}^{a}f(x)\,dx=2\int_0^a f(x)\,dx$ |
| $f$ impaire | $\int_{-a}^{a}f(x)\,dx=0$ |

Si $f$ est continue et périodique de période $T>0$, son intégrale sur une période ne dépend pas du point de départ :

$$\int_a^{a+T}f(x)\,dx=\int_b^{b+T}f(x)\,dx.$$

Ces propriétés simplifient le calcul, mais il faut d’abord vérifier la parité ou la périodicité.
`),
  section("essential-integral-area", "VI", "Passer de l’intégrale à une aire", [96, 97], String.raw`
On suppose $a<b$.

| Position de la courbe sur $[a;b]$ | Aire en unités d’aire |
| --- | --- |
| $f\ge0$ | $\mathcal A=\int_a^b f(x)\,dx$ |
| $f\le0$ | $\mathcal A=-\int_a^b f(x)\,dx$ |
| $f$ change de signe | Découper aux zéros et additionner les aires positives |

Entre deux courbes, si $f(x)\ge g(x)$ :

$$\mathcal A=\int_a^b\big(f(x)-g(x)\big)\,dx.$$

Si les courbes se croisent, partager l’intervalle aux intersections pour toujours soustraire **la courbe du bas à celle du haut**.

L’aire est positive ou nulle. Pour la convertir en $\text{cm}^2$, multiplier par l’aire physique du rectangle unité du repère.
`),
], [
  "P96 : bornes égales pour l'intégrale nulle et Chasles rétablis ; signes des aires et ordre a≤b explicités.",
  "P97 : intégrale paire sur [-a;a] avec borne 0 rétablie ; aucune figure scannée republiée.",
]);
