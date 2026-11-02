import { section, sheet } from "./types";

export default sheet("geometry", "Nombres complexes et géométrie du plan", [137, 140, 141, 151, 152], [
  section("essential-geometry-affixes", "I", "Traduire une configuration en affixes", [137, 140, 141], String.raw`
On travaille dans un repère orthonormé direct.

Les configurations de type triangle ou parallélogramme sont supposées non dégénérées.

| Objet géométrique | Écriture complexe |
| --- | --- |
| Point $M(x;y)$ | $z_M=x+iy$ |
| Vecteur $\overrightarrow{AB}$ | $z_B-z_A$ |
| Distance $AB$ | $\lvert z_B-z_A\rvert$ |
| Milieu $I$ de $[AB]$ | $z_I=\frac{z_A+z_B}{2}$ |
| Centre de gravité $G$ de $ABC$ | $z_G=\frac{z_A+z_B+z_C}{3}$ |
| Parallélogramme $ABCD$ | $z_B-z_A=z_C-z_D$ |

Pour le barycentre de $(A;a)$, $(B;b)$ et $(C;c)$, avec $a+b+c\ne0$ :

$$z_G=\frac{az_A+bz_B+cz_C}{a+b+c}.$$

Les coefficients sont réels ; leur **somme non nulle** est indispensable.
`),
  section("essential-geometry-angles", "II", "Alignement, orthogonalité et angles", [140], String.raw`
Pour les quotients ci-dessous, les vecteurs au dénominateur sont non nuls.

$$\big(\overrightarrow{AB},\overrightarrow{CD}\big)
=\arg\left(\frac{z_D-z_C}{z_B-z_A}\right)\pmod{2\pi}.$$

L’angle entre l’axe réel positif et $\overrightarrow{AB}$ a pour mesure $\arg(z_B-z_A)$.

| Configuration | Critère |
| --- | --- |
| $A,B,C$ alignés, avec $A\ne B$ | $\frac{z_C-z_A}{z_B-z_A}\in\mathbb R$ |
| $(AB)\perp(CD)$, avec $A\ne B$ et $C\ne D$ | $\frac{z_D-z_C}{z_B-z_A}$ imaginaire pur non nul |

**Quatre points cocycliques.** Pour quatre points distincts, avec $A,B,C$ non alignés, ils sont sur un même cercle si et seulement si

$$\frac{(z_C-z_B)/(z_C-z_A)}{(z_D-z_B)/(z_D-z_A)}\in\mathbb R.$$

Sans l’hypothèse de non-alignement, ce quotient réel peut aussi correspondre à quatre points alignés.
`),
  section("essential-geometry-triangles", "III", "Reconnaître un triangle", [140, 141], String.raw`
On suppose que $A,B,C$ forment un triangle et on pose

$$q=\frac{z_C-z_A}{z_B-z_A}.$$

Alors $\lvert q\rvert=AC/AB$ et $\arg q$ mesure l’angle orienté $(\overrightarrow{AB},\overrightarrow{AC})$.

| Nature du triangle | Critère complexe |
| --- | --- |
| Isocèle en $A$ | $\lvert q\rvert=1$ |
| Rectangle en $A$ | $q=ib$, avec $b\in\mathbb R$ non nul |
| Rectangle et isocèle en $A$ | $q=i$ ou $q=-i$ |
| Équilatéral | $q=e^{i\pi/3}$ ou $q=e^{-i\pi/3}$ |

Dans le cas isocèle, on peut écrire $q=e^{i\theta}$ ; le triangle non dégénéré impose $\theta\notin\pi\mathbb Z$.
`),
  section("essential-geometry-transformations", "IV", "Reconnaître une transformation $z'=az+b$", [151, 152], String.raw`
Pour $a\ne0$, l’application $z'=az+b$ est une similitude directe. Elle multiplie les distances par $\lvert a\rvert$ et tourne les vecteurs d’un angle $\arg a$.

| Coefficients | Transformation |
| --- | --- |
| $a=1$ et $b=0$ | Identité |
| $a=1$ et $b\ne0$ | Translation de vecteur d’affixe $b$ |
| $a\in\mathbb R$, $a\ne0,1$ | Homothétie de rapport signé $a$ |
| $\lvert a\rvert=1$ et $a\ne1$ | Rotation d’angle $\arg a$ |
| $a\ne0,1$ quelconque | Similitude de rapport $\lvert a\rvert$, d’angle $\arg a$ |

Si $a\ne1$, le centre $\Omega$ est le point fixe :

$$z_\Omega=az_\Omega+b
\quad\Longrightarrow\quad z_\Omega=\frac b{1-a}.$$

La même application s’écrit alors

$$z'-z_\Omega=a(z-z_\Omega).$$

Si $a=0$, l’application est constante : ce n’est pas une similitude.
`),
  section("essential-geometry-special", "V", "Translations, homothéties et rotations", [151], String.raw`
**Translation de vecteur d’affixe $u$ :** $z'=z+u$.

$$t_u\circ t_v=t_{u+v},\qquad t_u^{-1}=t_{-u}.$$

**Homothétie de centre $\Omega$ et de rapport $\alpha\ne0$ :**

$$z'-z_\Omega=\alpha(z-z_\Omega).$$

Pour deux homothéties de même centre :

$$H_{\Omega,\alpha}\circ H_{\Omega,\beta}=H_{\Omega,\alpha\beta},
\qquad H_{\Omega,\alpha}^{-1}=H_{\Omega,1/\alpha}.$$

Les distances sont multipliées par $\lvert\alpha\rvert$, même si le rapport signé $\alpha$ est négatif. De centre $O$, l’écriture est $z'=\alpha z$.

**Rotation de centre $\Omega$ et d’angle $\theta$ :**

$$z'-z_\Omega=e^{i\theta}(z-z_\Omega).$$

Pour deux rotations de même centre :

$$R_{\Omega,\theta}\circ R_{\Omega,\varphi}=R_{\Omega,\theta+\varphi},
\qquad R_{\Omega,\theta}^{-1}=R_{\Omega,-\theta}.$$

De centre $O$, l’écriture devient $z'=e^{i\theta}z$.
`),
  section("essential-geometry-similarity", "VI", "Similitudes : propriétés et composition", [151, 152], String.raw`
Une similitude directe de centre $\Omega$, de rapport $k>0$ et d’angle $\theta$ s’écrit

$$z'-z_\Omega=ke^{i\theta}(z-z_\Omega).$$

Elle peut se voir comme une homothétie de rapport $k$ suivie d’une rotation de même centre.

- Elle multiplie les longueurs par $k$, les aires par $k^2$.
- Elle conserve les angles orientés.
- L’image d’une droite est une droite.
- L’image d’un cercle de rayon $r$ est un cercle de rayon $kr$.
- Son centre est invariant.

Pour deux similitudes **de même centre**, on multiplie les rapports et on additionne les angles :

$$S_{\Omega,k,\theta}\circ S_{\Omega,k',\theta'}
=S_{\Omega,kk',\theta+\theta'}.$$

La réciproque a pour rapport $1/k$ et pour angle $-\theta$.
`),
  section("essential-geometry-two-images", "VII", "Déterminer une application à partir de deux images", [152], String.raw`
On cherche $z'=az+b$ telle que $A$ ait pour image $B$ et $C$ pour image $D$, avec $A\ne C$.

**1. Écrire les deux égalités :**

$$z_B=az_A+b,\qquad z_D=az_C+b.$$

**2. Soustraire pour trouver $a$ :**

$$z_D-z_B=a(z_C-z_A)
\quad\Longrightarrow\quad a=\frac{z_D-z_B}{z_C-z_A}.$$

**3. Retrouver $b$ :**

$$b=z_B-az_A.$$

**4. Identifier la transformation :**

- rapport de similitude $k=\lvert a\rvert=BD/AC$, si $a\ne0$ ;
- angle $\theta=\arg a$, mesuré de $\overrightarrow{AC}$ vers $\overrightarrow{BD}$ ;
- centre $z_\Omega=b/(1-a)$, si $a\ne1$.

Pour une homothétie, le rapport signé est le réel $a$ : la seule longueur $BD/AC$ donne $\lvert a\rvert$, pas son signe. Vérifier enfin les deux images demandées.
`),
], [
  "P137 : somme des coefficients du barycentre non nulle. P140 : quotient réel pour alignement inclut0 ; cocyclicité avec non-alignement pour exclure le cas aligné.",
  "P151 : composition d'homothéties = produit des rapports ; inverse d'une translation de vecteur opposé ; z'=ke^(iθ)z+b avec z rétabli.",
  "P152 : distance multipliée par |a|, rapport signé homothétique distingué ; identité/a=0 et centre a≠1 explicités.",
]);
