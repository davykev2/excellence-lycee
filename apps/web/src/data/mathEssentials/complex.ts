import { section, sheet } from "./types";

const content = sheet("complex", "Nombres complexes", [136, 137, 138, 139, 140, 141], [
  section("essential-complex-algebra", "I", "Forme algébrique et opérations", [136], String.raw`
Un nombre complexe s’écrit de manière unique $z=a+ib$, avec $a,b\in\mathbb R$ et $i^2=-1$. L’ensemble de ces nombres est $\mathbb C$.

$$\operatorname{Re}(z)=a,\qquad \operatorname{Im}(z)=b.$$

Deux complexes sont égaux si leurs parties réelles et imaginaires sont égales. En particulier, $z=0$ si et seulement si $a=b=0$.

Pour $z=a+ib$ et $w=c+id$ :

| Opération | Résultat |
| --- | --- |
| Somme | $z+w=(a+c)+i(b+d)$ |
| Produit | $zw=(ac-bd)+i(ad+bc)$ |
| Opposé | $-z=-a-ib$ |
| Inverse, $z\ne0$ | $\frac1z=\frac{a-ib}{a^2+b^2}$ |
| Quotient, $w\ne0$ | $\frac zw=z\times\frac1w$ |

**Pour enlever $i$ du dénominateur**, multiplier numérateur et dénominateur par le conjugué :

$$\frac1{a+ib}=\frac{a-ib}{(a+ib)(a-ib)}
=\frac{a-ib}{a^2+b^2}.$$
`),
  section("essential-complex-conjugate", "II", "Conjugué et module", [136, 137], String.raw`
Le conjugué de $z=a+ib$ est $\overline z=a-ib$. Son module est le réel positif ou nul

$$\lvert z\rvert=\sqrt{a^2+b^2}=\sqrt{z\overline z}.$$

| Conjugaison | Propriété |
| --- | --- |
| Deux conjugaisons | $\overline{\overline z}=z$ |
| Somme ou différence | $\overline{z\pm w}=\overline z\pm\overline w$ |
| Produit | $\overline{zw}=\overline z\,\overline w$ |
| Puissance entière | $\overline{z^n}=\overline z^{\,n}$ |
| Inverse | $\overline{1/z}=1/\overline z$, $z\ne0$ |
| Quotient | $\overline{z/w}=\overline z/\overline w$, $w\ne0$ |

Les puissances d’exposant entier négatif nécessitent aussi $z\ne0$.

$$z\overline z=\operatorname{Re}(z)^2+\operatorname{Im}(z)^2.$$

$$\operatorname{Re}(z)=\frac{z+\overline z}{2},\qquad
\operatorname{Im}(z)=\frac{z-\overline z}{2i}.$$

Un complexe est réel si $\overline z=z$ ; il est imaginaire pur si $\overline z=-z$.

| Modules | Propriété |
| --- | --- |
| Conjugué | $\lvert\overline z\rvert=\lvert z\rvert$ |
| Produit | $\lvert zw\rvert=\lvert z\rvert\lvert w\rvert$ |
| Puissance, $n\ge1$ | $\lvert z^n\rvert=\lvert z\rvert^n$ |
| Inverse | $\lvert1/z\rvert=1/\lvert z\rvert$, $z\ne0$ |
| Quotient | $\lvert z/w\rvert=\lvert z\rvert/\lvert w\rvert$, $w\ne0$ |
| Somme | $\lvert z+w\rvert\le\lvert z\rvert+\lvert w\rvert$ |

Enfin, $\lvert z\rvert=0\iff z=0$, et $z\overline z=\lvert z\rvert^2$.
`),
  section("essential-complex-plane", "III", "Le plan complexe", [137], String.raw`
Dans un repère orthonormé direct, le complexe $z=a+ib$ est l’**affixe** du point $M(a;b)$ et du vecteur de coordonnées $(a;b)$.

- L’axe horizontal est l’axe réel.
- L’axe vertical est l’axe imaginaire.
- $OM=\lvert z\rvert$.
- Pour deux points $A$ et $B$, l’affixe de $\overrightarrow{AB}$ est $z_B-z_A$ et $AB=\lvert z_B-z_A\rvert$.

Le conjugué correspond à la symétrie par rapport à l’axe réel ; l’opposé correspond à la symétrie de centre $O$.
`),
  section("essential-complex-argument", "IV", "Arguments et forme trigonométrique", [138], String.raw`
Pour $z\ne0$, un **argument** est une mesure $\theta$ de l’angle orienté entre l’axe réel positif et $\overrightarrow{OM}$. Tous les arguments sont $\theta+2k\pi$, avec $k\in\mathbb Z$.

On peut choisir un argument principal dans $]-\pi;\pi]$. Le nombre $0$ n’a pas d’argument.

| Complexe | Argument principal |
| --- | --- |
| Réel strictement positif | $0$ |
| Réel strictement négatif | $\pi$ |
| $ib$ avec $b>0$ | $\pi/2$ |
| $ib$ avec $b<0$ | $-\pi/2$ |

Un complexe non nul est réel lorsque ses arguments valent $k\pi$ ; il est imaginaire pur lorsqu’ils valent $\pi/2+k\pi$.

**Forme trigonométrique :**

$$z=r(\cos\theta+i\sin\theta),\qquad r=\lvert z\rvert>0.$$

Pour $z=a+ib$, déterminer $\theta$ avec les **deux** relations

$$\cos\theta=\frac ar,\qquad\sin\theta=\frac br.$$

Le signe des deux coordonnées permet de choisir le bon quadrant.

Deux complexes non nuls sont égaux si leurs modules sont égaux et leurs arguments égaux modulo $2\pi$.

**Arguments des opérations**, toujours modulo $2\pi$ :

| Opération | Argument |
| --- | --- |
| $\overline z$ | $-\arg z$ |
| $-z$ | $\arg z+\pi$ |
| $zw$ | $\arg z+\arg w$ |
| $1/z$ | $-\arg z$ |
| $z/w$ | $\arg z-\arg w$ |
| $z^n$ | $n\arg z$ |
`),
  section("essential-complex-exponential", "V", "Écriture exponentielle, Moivre et Euler", [138, 139], String.raw`
Pour un angle réel $\theta$ :

$$e^{i\theta}=\cos\theta+i\sin\theta.$$

Un complexe non nul s’écrit $z=re^{i\theta}$ avec $r=\lvert z\rvert>0$.

$$\lvert e^{i\theta}\rvert=1,\qquad
\lvert re^{i\theta}\rvert=r,\qquad
\overline{re^{i\theta}}=re^{-i\theta}.$$

| Calcul | Résultat |
| --- | --- |
| $e^{i\theta}e^{i\varphi}$ | $e^{i(\theta+\varphi)}$ |
| $1/e^{i\theta}$ | $e^{-i\theta}$ |
| $e^{i\theta}/e^{i\varphi}$ | $e^{i(\theta-\varphi)}$ |
| $(e^{i\theta})^n$ | $e^{in\theta}$ |

**Formule de Moivre**, pour $n\in\mathbb Z$ :

$$(\cos\theta+i\sin\theta)^n=\cos(n\theta)+i\sin(n\theta).$$

**Formules d’Euler :**

$$\cos\theta=\frac{e^{i\theta}+e^{-i\theta}}2,\qquad
\sin\theta=\frac{e^{i\theta}-e^{-i\theta}}{2i}.$$

Ainsi, $e^{in\theta}+e^{-in\theta}=2\cos(n\theta)$ et $e^{in\theta}-e^{-in\theta}=2i\sin(n\theta)$.
`),
  section("essential-complex-equations", "VI", "Racines carrées et équations du second degré", [139], String.raw`
Une racine carrée de $z_0$ est un complexe $z$ tel que $z^2=z_0$. Si $z_0\ne0$, il possède deux racines carrées opposées. Pour $z_0=0$, la seule racine est $0$.

**Méthode algébrique.** Poser $z=x+iy$ et écrire :

$$\begin{cases}
x^2-y^2=\operatorname{Re}(z_0),\\
2xy=\operatorname{Im}(z_0),\\
x^2+y^2=\lvert z_0\rvert.
\end{cases}$$

La première et la troisième égalité donnent $x^2$ et $y^2$ ; la deuxième fixe les signes compatibles.

Pour $az^2+bz+c=0$, avec $a\ne0$ et $a,b,c\in\mathbb C$, poser

$$\Delta=b^2-4ac.$$

| Discriminant | Solutions |
| --- | --- |
| $\Delta=0$ | $z=-\frac b{2a}$ |
| $\Delta\ne0$, avec $\delta^2=\Delta$ | $z_1=\frac{-b-\delta}{2a}$ et $z_2=\frac{-b+\delta}{2a}$ |

On n’utilise pas un « signe » de $\Delta$ pour un discriminant complexe : on cherche une de ses racines carrées.
`),
  section("essential-complex-roots", "VII", "Racines $n$-ièmes", [140], String.raw`
Soit $z_0=re^{i\theta}\ne0$ et $n\ge2$ entier. Les $n$ solutions distinctes de $z^n=z_0$ sont

$$z_k=\sqrt[n]r\,e^{\,i(\theta+2k\pi)/n},
\qquad k=0,1,\ldots,n-1.$$

Leurs modules valent $\sqrt[n]r$ et les arguments successifs diffèrent de $2\pi/n$. Pour $n\ge3$, leurs points-images forment un polygone régulier.

**Racines de l’unité :** lorsque $z_0=1$,

$$z_k=e^{2ik\pi/n},\qquad k=0,1,\ldots,n-1.$$

Elles sont situées sur le cercle de centre $O$ et de rayon $1$.
`),
  section("essential-complex-trigonometry", "VIII", "Valeurs remarquables et cercle trigonométrique", [141], String.raw`
Sur le cercle de rayon $1$, le point d’angle $\theta$ a pour coordonnées $(\cos\theta;\sin\theta)$. La tangente vaut $\tan\theta=\sin\theta/\cos\theta$ lorsque $\cos\theta\ne0$.

| Angle | Cosinus | Sinus | Tangente |
| --- | --- | --- | --- |
| $0$ | $1$ | $0$ | $0$ |
| $\pi/6$ | $\sqrt3/2$ | $1/2$ | $\sqrt3/3$ |
| $\pi/4$ | $\sqrt2/2$ | $\sqrt2/2$ | $1$ |
| $\pi/3$ | $1/2$ | $\sqrt3/2$ | $\sqrt3$ |
| $\pi/2$ | $0$ | $1$ | Non définie |
| $2\pi/3$ | $-1/2$ | $\sqrt3/2$ | $-\sqrt3$ |
| $3\pi/4$ | $-\sqrt2/2$ | $\sqrt2/2$ | $-1$ |
| $5\pi/6$ | $-\sqrt3/2$ | $1/2$ | $-\sqrt3/3$ |
| $\pi$ | $-1$ | $0$ | $0$ |
| $-\pi/6$ | $\sqrt3/2$ | $-1/2$ | $-\sqrt3/3$ |
| $-\pi/4$ | $\sqrt2/2$ | $-\sqrt2/2$ | $-1$ |
| $-\pi/3$ | $1/2$ | $-\sqrt3/2$ | $-\sqrt3$ |
| $-\pi/2$ | $0$ | $-1$ | Non définie |
| $-2\pi/3$ | $-1/2$ | $-\sqrt3/2$ | $\sqrt3$ |
| $-3\pi/4$ | $-\sqrt2/2$ | $-\sqrt2/2$ | $1$ |
| $-5\pi/6$ | $-\sqrt3/2$ | $-1/2$ | $\sqrt3/3$ |

Ajouter $2\pi$ ne change ni le sinus ni le cosinus. Le cosinus est pair et le sinus impair.
`),
], [
  "P136 : somme complexe avec i devant la partie imaginaire. P139 : produit des exponentielles, pas somme, et module de re^(iθ)=r.",
  "P141 : tangentes π/6 et5π/6 corrigées en ±√3/3 ; propriétés de signes et angles contrôlées.",
  "Les critères géométriques des pages140–141 et les transformations151–152 sont dans la fiche Géométrie complexe partagée C13/D08.",
]);

content.visuals = { "essential-complex-trigonometry-rules": "unit-circle" };
export default content;
