import { complexExercise as ex,complexExact,written } from "./terminalCComplexBuilders";
export const complexDeepeningC=[
 ex(75,"Inégalité triangulaire et égalité","Démontrer chaque propriété, en traitant aussi les cas d’égalité.",[
  written("1.a",String.raw`Pour tout z, $\operatorname{Re}z\le|z|$.`,String.raw`Écrivons $z=x+iy$. Alors $|z|=\sqrt{x^2+y^2}\ge\sqrt{x^2}=|x|\ge x$. Donc $\boxed{\operatorname{Re}z\le|z|}$. Les deux inégalités successives expliquent pourquoi la partie réelle négative ne pose pas de difficulté.`),
  written("1.b",String.raw`Quand a-t-on $\operatorname{Re}z=|z|$ ?`,String.raw`L’égalité impose simultanément $\sqrt{x^2+y^2}=|x|$ et $|x|=x$. La première donne $y=0$ et la seconde $x\ge0$. Réciproquement ces conditions conviennent. Donc $\boxed{z\in\mathbb R_+}$, zéro compris.`),
  written("2.a",String.raw`Démontrer $|z_1+z_2|\le|z_1|+|z_2|$.`,String.raw`On calcule le carré :
$$|z_1+z_2|^2=|z_1|^2+|z_2|^2+2\operatorname{Re}(z_1\bar z_2).$$
D’après 1.a, $\operatorname{Re}(z_1\bar z_2)\le|z_1\bar z_2|=|z_1||z_2|$. Donc $|z_1+z_2|^2\le(|z_1|+|z_2|)^2$. Les deux côtés étant positifs ou nuls, on peut prendre les racines carrées.`),
  written("2.b",String.raw`Pour $z_1,z_2\ne0$, caractériser l’égalité par $z_2=\lambda z_1$, $\lambda>0$.`,String.raw`La seule inégalité de 2.a porte sur $\operatorname{Re}(z_1\bar z_2)$. L’égalité a lieu exactement si $z_1\bar z_2$ est réel positif. Comme $z_1\ne0$, cela équivaut à $z_2/z_1$ réel positif. Le quotient ne peut être nul car $z_2\ne0$. Donc $z_2=\lambda z_1$ avec $\lambda>0$. Réciproquement, $|z_1+\lambda z_1|=(1+\lambda)|z_1|=|z_1|+|z_2|$.`),
  written("3.a",String.raw`Démontrer par récurrence $|\sum_{k=1}^nz_k|\le\sum_{k=1}^n|z_k|$ pour $n\ge2$.`,String.raw`**Initialisation.** Pour $n=2$, c’est 2.a.

**Hérédité.** Supposons le résultat au rang n. Alors :
$$\left|\sum_{k=1}^{n+1}z_k\right|
\le\left|\sum_{k=1}^nz_k\right|+|z_{n+1}|
\le\sum_{k=1}^{n+1}|z_k|.$$
Le résultat est donc vrai pour tout $n\ge2$.`),
  written("3.b",String.raw`Pour des $z_k$ tous non nuls, caractériser l’égalité par $z_k=\lambda_kz_1$, $\lambda_k>0$.`,String.raw`Développons :
$$\left(\sum|z_k|\right)^2-\left|\sum z_k\right|^2
=2\sum_{j<k}\left(|z_j||z_k|-\operatorname{Re}(z_j\bar z_k)\right).$$
Chaque terme est positif ou nul par 1.a. La somme est nulle si et seulement si tous ces termes le sont. En particulier, pour les paires $(1;k)$, la question 2.b donne $z_k=\lambda_kz_1$ avec $\lambda_k>0$ et $\lambda_1=1$.
Réciproquement, si tous les nombres ont cette forme, leur somme vaut $(\sum\lambda_k)z_1$. Son module est $(\sum\lambda_k)|z_1|=\sum|z_k|$.`)
 ]),
 ex(76,"Association RLC en série",String.raw`En régime sinusoïdal, les impédances complexes sont $Z_R=R$, $Z_L=iL\omega$, $Z_C=1/(iC\omega)$. On suppose $R,L,C,\omega>0$. Ici le j des notations électriques désigne i. Les dipôles sont en série : $Z=Z_R+Z_L+Z_C$. R est en ohms, L en henrys, C en farads et $\omega$ en radians par seconde.`,[
  written("1.","Déterminer la partie réelle de Z.",String.raw`$1/i=-i$, donc $Z_C=-i/(C\omega)$. Ainsi $Z=R+i(L\omega-1/(C\omega))$. On lit $\boxed{\operatorname{Re}Z=R}$.`),
  written("2.","Déterminer la réactance X, partie imaginaire de Z.",String.raw`Le coefficient réel de i vaut $\boxed{X=L\omega-1/(C\omega)}$. X s’exprime en ohms ; il peut être positif, négatif ou nul. La résistance R, elle, est la partie réelle.`),
  written("3.","Déterminer le module de l’impédance.",String.raw`Le module représente la longueur du vecteur $(R;X)$. Donc :
$$\boxed{|Z|=\sqrt{R^2+\left(L\omega-\frac1{C\omega}\right)^2}.}$$
Il est exprimé en ohms. À la résonance $L\omega=1/(C\omega)$, il vaut R.`),
  written("4.","Déterminer le déphasage tension/courant.",String.raw`Comme $R>0$, l’argument principal de Z est dans $]-\pi/2;\pi/2[$ et sa tangente vaut $X/R$. Donc :
$$\boxed{\varphi=\arctan\left(\frac{L\omega-1/(C\omega)}R\right).}$$
Il est positif si la contribution inductive domine, négatif si la contribution capacitive domine, nul à la résonance.`)
 ],true,true),
 ex(77,"Association parallèle et filtre RC",String.raw`On suppose $R,L,C,\omega>0$ et on note i l’unité imaginaire. Une résistance R et une bobine d’impédance $iL\omega$ sont en parallèle : $Z=\frac{R\,iL\omega}{R+iL\omega}$. On étudie aussi le filtre passe-bas $T=1/(1+iRC\omega)$.`,[
  written("1.","Déterminer le module de l’impédance parallèle.",String.raw`Posons $X=L\omega>0$. Alors :
$$Z=\frac{RiX(R-iX)}{R^2+X^2}
=\frac{RX^2+iR^2X}{R^2+X^2}.$$
On peut calculer le module par quotient : $\boxed{|Z|=RX/\sqrt{R^2+X^2}=RL\omega/\sqrt{R^2+(L\omega)^2}}$, en ohms.`),
  written("2.","Déterminer le déphasage de cette association.",String.raw`Les parties réelle et imaginaire de Z sont positives. Le quotient de ces parties vaut $(R^2X)/(RX^2)=R/X$. Donc :
$$\boxed{\varphi=\arctan(R/(L\omega))\in]0;\pi/2[.}$$`),
  written("3.a","Déterminer l’amplification du filtre RC.",String.raw`$|T|=1/|1+iRC\omega|$, donc $\boxed{|T|=1/\sqrt{1+(RC\omega)^2}}$. Ce gain est sans unité, entre 0 et 1 ; il décroît quand la pulsation augmente.`),
  written("3.b","Déterminer le déphasage sortie/entrée du filtre.",String.raw`L’argument d’un inverse est l’opposé de l’argument. Comme $1+iRC\omega$ a une partie réelle 1 et une partie imaginaire positive :
$$\boxed{\arg T=-\arctan(RC\omega)\in]-\pi/2;0[.}$$
Le signe négatif traduit le retard de la sortie sur l’entrée.`)
 ],true,true),
 ex(78,"Racines, rotation et alignement",String.raw`On considère $z^4=-4$. Pour la suite, $A(1+i)$, $B(-1+i)$, $C(-1-i)$, $D(1-i)$. L’application vérifie $z'-z_C=e^{-i\pi/3}(z-z_C)$. E est l’image de B et F celle de D.`,[
  written("1.",String.raw`Si z est solution, montrer que $-z$ et $\bar z$ le sont aussi.`,String.raw`$(-z)^4=z^4=-4$. De plus $(\bar z)^4=\overline{z^4}=\overline{-4}=-4$. Les deux transformations conservent donc les solutions.`),
  written("2.a",String.raw`Écrire $z_0=1+i$ sous forme exponentielle.`,String.raw`Son module vaut $\sqrt2$, son argument $\pi/4$ : $\boxed{z_0=\sqrt2e^{i\pi/4}}$.`),
  written("2.b","Vérifier que z₀ est solution.",String.raw`$z_0^4=(\sqrt2)^4e^{i\pi}=4(-1)=\boxed{-4}$.`),
  written("3.","Déduire les trois autres solutions.",String.raw`Les propriétés de 1 donnent $-1-i$, $1-i$ et $-1+i$. Avec $1+i$, ce sont quatre solutions distinctes ; un polynôme de degré 4 ne peut en avoir davantage. Donc $\boxed{S=\{1+i,-1+i,-1-i,1-i\}}$.`),
  complexExact("4.","Justifier l’affixe de E.",String.raw`-1+\sqrt3`,"-1+sqrt3",String.raw`$z_B-z_C=2i$ et $e^{-i\pi/3}=1/2-i\sqrt3/2$. Donc
$$z_E=-1-i+(1/2-i\sqrt3/2)2i=-1-i+i+\sqrt3=\boxed{-1+\sqrt3}.$$`),
  complexExact("5.","Déterminer l’affixe de F.",String.raw`-i(1+\sqrt3)`,"-i*(1+sqrt3)",String.raw`$z_D-z_C=2$. Donc $z_F=-1-i+2(1/2-i\sqrt3/2)=\boxed{-i(1+\sqrt3)}$.`),
  written("6.",String.raw`Montrer que $(z_A-z_E)/(z_A-z_F)$ est réel.`,String.raw`Le numérateur vaut $2-\sqrt3+i$ et le dénominateur $1+i(2+\sqrt3)\ne0$. Or :
$$(2-\sqrt3)\bigl(1+i(2+\sqrt3)\bigr)=2-\sqrt3+i,$$
car $(2-\sqrt3)(2+\sqrt3)=1$. Le quotient vaut donc $\boxed{2-\sqrt3\in\mathbb R}$.`),
  written("7.","Conclure sur A,E,F.",String.raw`Le quotient précédent est réel et son dénominateur est non nul. Les vecteurs $\overrightarrow{FA}$ et $\overrightarrow{EA}$ sont colinéaires : $\boxed{A,E,F\text{ sont alignés}}$. La transformation utilisée est une rotation de centre C et d’angle $-\pi/3$.`)
 ],true)
];
