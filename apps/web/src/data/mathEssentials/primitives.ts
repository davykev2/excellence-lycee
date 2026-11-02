import { section, sheet } from "./types";

export default sheet("primitives", "Primitives", [26, 27], [
  section("essential-primitive-definition", "I", "Reconnaître une primitive", [26], String.raw`
Une fonction $F$ est une primitive de $f$ sur un intervalle $I$ si $F$ est dérivable sur $I$ et si

$$F'(x)=f(x)\quad\text{pour tout }x\in I.$$

Si $f$ est continue sur $I$, elle y admet des primitives. Dès que l’une d’elles est connue, **toutes** s’écrivent $F+C$, où $C$ est une constante réelle.

**Exemple.** Pour $f(x)=x^2-5$ :

$$F(x)=\frac{x^3}{3}-5x+\pi,\qquad G(x)=\frac{x^3}{3}-5x+\sqrt2$$

sont deux primitives, car les constantes disparaissent à la dérivation.

Pour trouver la primitive $H$ telle que $H(3)=0$, écrire

$$H(x)=\frac{x^3}{3}-5x+C.$$

Alors $H(3)=9-15+C=0$, donc $C=6$ et

$$H(x)=\frac{x^3}{3}-5x+6.$$
`),
  section("essential-primitive-table", "II", "Le tableau des primitives", [26, 27], String.raw`
Chaque ligne donne **une** primitive ; ajouter une constante pour les obtenir toutes. Les formules s’appliquent sur un intervalle du domaine indiqué.

| Fonction | Une primitive |
| --- | --- |
| $a$ | $ax$ |
| $ax$ | $\frac a2x^2$ |
| $ax+b$ | $\frac a2x^2+bx$ |
| $ax^n$, $n\ne-1$ | $\frac a{n+1}x^{n+1}$ |
| $\frac ax$ | $a\ln\lvert x\rvert$ |
| $\frac a{x^n}$, $n\ne1$ | $-\frac a{(n-1)x^{n-1}}$ |
| $\sqrt x$ | $\frac23x\sqrt x$ |
| $\frac1{\sqrt x}$ | $2\sqrt x$ |
| $\sqrt{ax+b}$, $a\ne0$ | $\frac2{3a}(ax+b)^{3/2}$ |
| $\frac1{\cos^2x}=1+\tan^2x$ | $\tan x$ |

Pour les puissances réelles quelconques et les racines, prendre $x>0$ ou $ax+b>0$ selon le cas. Pour $1/x$ et les puissances négatives entières, exclure $0$.

Si $F'=f$ et $G'=g$, alors $F+G$ est une primitive de $f+g$, et $\lambda F$ est une primitive de $\lambda f$.

**On ne multiplie pas les primitives entre elles.** En général, $FG$ n’est pas une primitive de $fg$, et $F/G$ n’est pas une primitive de $f/g$.

Par exemple, la dérivée de $\frac{x^2}2\sin x$ n’est pas simplement $x\cos x$ ; celle de $\frac{x^2}{2\sin x}$ n’est pas simplement $\frac x{\cos x}$.
`),
  section("essential-primitive-examples", "III", "Appliquer les formules sans sauter les coefficients", [27], String.raw`
| Fonction à intégrer | Une primitive |
| --- | --- |
| $3$ | $3x$ |
| $\sqrt3\,x$ | $\frac{\sqrt3}{2}x^2$ |
| $\frac13x^3$ | $\frac{x^4}{12}$ |
| $\frac2{x^3}$ | $-\frac1{x^2}$ |
| $\sqrt{3x+5}$ | $\frac29(3x+5)\sqrt{3x+5}$ |
| $x^7$ | $\frac{x^8}{8}$ |
| $\frac1{x^4}$ | $-\frac1{3x^3}$ |
| $\frac1{x^2}-3x+5$ | $-\frac1x-\frac32x^2+5x$ |
| $3x$ | $\frac32x^2$ |
| $4\sqrt x$ | $\frac83x\sqrt x$ |

**Vérification du coefficient pour une racine :**

$$\left((3x+5)^{3/2}\right)'=\frac32\times3\sqrt{3x+5}=\frac92\sqrt{3x+5}.$$

Il faut donc multiplier cette expression par $\frac29$ pour retrouver exactement $\sqrt{3x+5}$.
`),
  section("essential-primitive-trigonometry", "IV", "Primitives trigonométriques", [26], String.raw`
Les angles sont mesurés en radians.

| Fonction | Une primitive |
| --- | --- |
| $\sin x$ | $-\cos x$ |
| $-\cos x$ | $-\sin x$ |
| $-\sin x$ | $\cos x$ |
| $\cos x$ | $\sin x$ |
| $\sin(ax+b)$ | $-\frac1a\cos(ax+b)$ |
| $-\cos(ax+b)$ | $-\frac1a\sin(ax+b)$ |
| $-\sin(ax+b)$ | $\frac1a\cos(ax+b)$ |
| $\cos(ax+b)$ | $\frac1a\sin(ax+b)$ |

Dans les quatre dernières lignes, $a\ne0$ : le facteur $1/a$ compense la dérivée de $ax+b$.

**Exemples du même type :**

1. Une primitive de $\sin(\frac x2+\pi)$ est $-2\cos(\frac x2+\pi)$.
2. Une primitive de $-\cos(2x)$ est $-\frac12\sin(2x)$.
3. Une primitive de $-\sin(4x)$ est $\frac14\cos(4x)$.
4. Pour $\omega\ne0$, une primitive de $\cos(\omega t+\pi)$ est $\frac1\omega\sin(\omega t+\pi)$.
`),
  section("essential-primitive-composition", "V", "Reconnaître la dérivée intérieure", [27], String.raw`
| Fonction composée | Une primitive | Conditions |
| --- | --- | --- |
| $u'u^n$ | $\frac{u^{n+1}}{n+1}$ | $n\ne-1$, puissances définies |
| $\frac{u'}{u^n}$ | $-\frac1{(n-1)u^{n-1}}$ | $n\ne1$, $u\ne0$ |
| $\frac{u'}u$ | $\ln\lvert u\rvert$ | $u\ne0$ |
| $\frac{u'}{\sqrt u}$ | $2\sqrt u$ | $u>0$ |

**a) $2x(x^2+5)^7$.** Poser $u=x^2+5$, donc $u'=2x$. Une primitive est

$$\frac{(x^2+5)^8}{8}.$$

**b) $\frac{\cos x}{\sin^9x}$.** Poser $u=\sin x$, donc $u'=\cos x$. Sur un intervalle où $\sin x\ne0$, une primitive est

$$-\frac1{8\sin^8x}.$$

**c) $\frac{-1/x^2}{\sqrt{1/x+2}}$.** Poser $u=1/x+2$, donc $u'=-1/x^2$. Sur un intervalle où $x\ne0$ et $1/x+2>0$, une primitive est

$$2\sqrt{\frac1x+2}.$$

Pour contrôler une réponse, la dériver : on doit retrouver **toute** la fonction de départ, avec son signe et son coefficient.
`),
], [
  "P26 : définition F'=f rétablie ; famille x³/3−5x+C et condition C=6 contrôlées.",
  "P27 : primitives x³/3, 1/x⁴ et √(ax+b) corrigées ; facteur 1/a et signe de (1/x)' conservés.",
]);
