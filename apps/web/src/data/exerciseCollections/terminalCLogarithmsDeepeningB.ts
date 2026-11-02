import type { ArenaExerciseItem } from "../../domain/arenaExercises";
import { short, written } from "./builders";
import { logarithmExercise as ex, limitAnswer as limit } from "./terminalCLogarithmsBuilders";

export const logarithmsDeepeningB: ArenaExerciseItem[] = [
  ex(28, "Prolonger une fonction en deux points", String.raw`Soit $f(x)=x\ln x/(1-x)$ sur son domaine réel. On notera $g$ son prolongement continu lorsqu’il existe.`, [
    written("1", String.raw`Détermine l’ensemble de définition de $f$.`, String.raw`Il faut $x>0$ pour le logarithme et $x\ne1$ pour le dénominateur. **$D_f=]0;1[\cup]1;+\infty[$.**`),
    written("2", String.raw`Justifie que l’on peut prolonger $f$ par continuité en $0$ et en $1$.`, String.raw`En $0^+$, $x\ln x\to0$ et $1-x\to1$, donc $f(x)\to0$.

En $1$, on écrit $f(x)=-x\,\ln x/(x-1)$. Comme $x\to1$ et $\ln x/(x-1)\to1$, on obtient $f(x)\to-1$.

**On définit donc $g(0)=0$, $g(1)=-1$ et $g(x)=f(x)$ ailleurs sur $[0;+\infty[$.** Les valeurs choisies sont exactement les limites, donc $g$ est continue en ces deux points.`),
    written("3.a", String.raw`Étudie la dérivabilité de $g$ en $0$.`, String.raw`Pour $x>0$ assez proche de $0$ :

$$\frac{g(x)-g(0)}x=\frac{\ln x}{1-x}.$$

Le numérateur tend vers $-\infty$ et le dénominateur vers $1>0$. Le taux tend donc vers $-\infty$. **$g$ n’a pas de dérivée finie à droite en $0$.**`),
    written("3.b", String.raw`Étudie la dérivabilité de $g$ en $1$.`, String.raw`Comme $g(1)=-1$, pour $x>0$, $x\ne1$ :

$$\frac{g(x)-g(1)}{x-1}=-\frac{x\ln x-x+1}{(x-1)^2}.$$

Justifions soigneusement la limite du quotient de droite. Posons $N(t)=t\ln t-t+1$ et, pour $x$ fixé, $A=N(x)/(x-1)^2$. La fonction $\Phi(t)=N(t)-A(t-1)^2$ vaut zéro en $1$ et en $x$.

Elle est continue entre ces deux points et dérivable à l’intérieur. Le théorème de Rolle donne donc un point $c$ strictement entre $1$ et $x$ tel que $\Phi'(c)=0$. Comme $N'(t)=\ln t$ :

$$\ln c-2A(c-1)=0\quad\Longrightarrow\quad A=\frac12\frac{\ln c}{c-1}.$$

Lorsque $x\to1$, le point $c$ tend aussi vers $1$. La limite de référence donne $A\to1/2$.

**Le taux d’accroissement de $g$ tend donc vers $-1/2$ des deux côtés : $g$ est dérivable en $1$ et $g'(1)=-1/2$.**`),
    written("4", "Interprète graphiquement les résultats.", String.raw`En $O(0;0)$, la courbe est continue et le taux à droite tend vers $-\infty$ : elle possède une **demi-tangente verticale**, supportée par $x=0$, dirigée vers le bas.

En $A(1;-1)$, elle possède une tangente de pente $-1/2$. Son équation est $y+1=-(x-1)/2$, soit **$y=-x/2-1/2$**.`),
  ], { correctionFigureKey: "tc-l4-functions" }),
  ex(29, "Un centre de symétrie", String.raw`Soit $f(x)=\dfrac{x+\ln|1-x|}{1-x}$ pour $x\ne1$. Le plan est muni d’un repère orthonormal.`, [
    written("1", String.raw`Pour $t\ne0$, calcule $f(1+t)+f(1-t)$.`, String.raw`La condition $t\ne0$ garantit que $1+t$ et $1-t$ sont dans le domaine. On a $|1-(1\pm t)|=|t|$, donc :

$$f(1+t)=-\frac{1+t+\ln|t|}{t},$$
$$f(1-t)=\frac{1-t+\ln|t|}{t}.$$

En additionnant, les constantes et logarithmes se simplifient. **La somme vaut $-2$.**`),
    written("2", "Justifie l’existence d’un centre de symétrie et donne ses coordonnées.", String.raw`Le domaine $\mathbb R\setminus\{1\}$ est symétrique par rapport à l’abscisse $1$. Pour tout $t\ne0$, $f(1+t)+f(1-t)=-2=2\times(-1)$.

Le milieu des points de la courbe d’abscisses $1+t$ et $1-t$ est donc toujours **$A(1;-1)$**. **C’est un centre de symétrie de la courbe.**`),
  ], { correctionFigureKey: "tc-l4-functions" }),
  ex(30, "Un placement à intérêts composés", String.raw`Amine place $500\,000$ F CFA à intérêts composés au taux annuel de $6\%$. Il envisage l’achat d’un terrain estimé à $1\,250\,000$ F CFA. On suppose ce prix constant. Détermine le nombre d’années à partir duquel le capital permet l’achat.`, [
    short("1", "Quel est le premier nombre entier d’années suffisant ?", "$16$", ["16"], String.raw`Le capital après $n$ années est $C_n=500000\times1{,}06^n$. On cherche $1{,}06^n\ge2{,}5$, soit $n\ge\ln(2{,}5)/\ln(1{,}06)\approx15{,}725$. **Le premier entier est $16$.**`),
    written("2", "Rédige une solution argumentée et vérifie l’arrondi.", String.raw`Chaque année, le capital est multiplié par $1+0{,}06=1{,}06$. Ainsi $C_n=500000\times1{,}06^n$.

Pour acheter le terrain, il faut $C_n\ge1250000$, donc $1{,}06^n\ge2{,}5$. Le logarithme est croissant, d’où $n\ln(1{,}06)\ge\ln(2{,}5)$. Comme $\ln(1{,}06)>0$, le sens est conservé en divisant :

$$n\ge\frac{\ln(2{,}5)}{\ln(1{,}06)}\approx15{,}725.$$

On prend le premier entier supérieur : **$16$ années**. Vérification : $1{,}06^{15}<2{,}5$ et $1{,}06^{16}>2{,}5$. Arrondir à $15$ ne donnerait pas assez d’argent.`),
  ]),
  ex(31, "Étudier une fonction prolongée en zéro", String.raw`Sur $[0;+\infty[$, $h(x)=\dfrac12x^2\ln x-\dfrac34x^2$ si $x>0$ et $h(0)=0$. Sa courbe $(C)$ est tracée dans un repère orthonormal.`, [
    limit("1.a", String.raw`Calcule $\displaystyle\lim_{x\to0^+}h(x)/x$.`, "0", String.raw`$h(x)/x=(1/2)x\ln x-(3/4)x$. Les deux termes tendent vers $0$. **La limite vaut $0$.**`),
    written("1.b", String.raw`Étudie la dérivabilité de $h$ en $0$.`, String.raw`Comme $h(0)=0$, le taux à droite est $(h(x)-h(0))/x=h(x)/x$. D’après 1.a, il tend vers $0$. **$h$ est dérivable à droite en $0$ et $h'_d(0)=0$.**`),
    limit("1.c", String.raw`Calcule $\displaystyle\lim_{x\to0^+}h(x)$.`, "0", String.raw`On écrit $h(x)=x(h(x)/x)$. Les deux facteurs tendent vers $0$. **La limite est $0=h(0)$**, ce qui confirme la continuité.`),
    limit("1.d", String.raw`Calcule $\displaystyle\lim_{x\to+\infty}h(x)/x$.`, "+infini", String.raw`$h(x)/x=x((1/2)\ln x-3/4)$. Les deux facteurs tendent vers $+\infty$. **La limite est $+\infty$.**`),
    written("1.e", "Interprète graphiquement les résultats précédents.", String.raw`En $O(0;0)$, la dérivée à droite est nulle : la **demi-tangente est horizontale**, supportée par $y=0$.

En $+\infty$, $h(x)\to+\infty$ et $h(x)/x\to+\infty$ : la courbe possède une **branche parabolique de direction l’axe des ordonnées**, et non une asymptote oblique.`),
    written("2.a", String.raw`Justifie que $h'(x)=x(\ln x-1)$ pour $x>0$.`, String.raw`On dérive le produit $x^2\ln x$ :

$$h'(x)=\frac12(2x\ln x+x^2/x)-\frac32x.$$

On simplifie $x\ln x+x/2-3x/2$. **On obtient $h'(x)=x\ln x-x=x(\ln x-1)$.**`),
    written("2.b", "Étudie les variations de h.", String.raw`Pour $x>0$, le signe de $h'$ est celui de $\ln x-1$. Cette expression est négative si $x<e$, nulle en $e$ et positive si $x>e$.

**$h$ décroît sur $[0;e]$, puis croît sur $[e;+\infty[$.** Son minimum est $h(e)=e^2/2-3e^2/4=-e^2/4$.`),
    written("2.c", "Dresse le tableau de variation.", String.raw`| $x$ | $0$ | $]0;e[$ | $e$ | $]e;+\infty[$ | $+\infty$ |
| --- | --- | --- | --- | --- | --- |
| $h'(x)$ | $0$ à droite | $-$ | $0$ | $+$ | |
| $h(x)$ | $0$ | décroît | $-e^2/4$ | croît | $+\infty$ |`),
    written("3", "Détermine les intersections avec l’axe des abscisses.", String.raw`Le point $O(0;0)$ appartient à la courbe par définition. Pour $x>0$, on factorise : $h(x)=x^2((1/2)\ln x-3/4)$. Comme $x^2>0$, l’annulation équivaut à $\ln x=3/2$, soit $x=e^{3/2}$.

**Les intersections sont $(0;0)$ et $(e^{3/2};0)$.**`),
    written("4", String.raw`Détermine la tangente $(T)$ au point d’abscisse $1$.`, String.raw`$h(1)=-3/4$ et $h'(1)=1(0-1)=-1$. La tangente est $y=h(1)+h'(1)(x-1)$, soit :

$$\boxed{y=-x+\frac14.}$$`),
    written("5", String.raw`Construis $(T)$ et $(C)$.`, String.raw`Place l’origine, le minimum $(e;-e^2/4)$, le second zéro $(e^{3/2};0)$ et le point $(1;-3/4)$. Trace la tangente $y=-x+1/4$ en ce dernier point, puis une courbe décroissante jusqu’à $e$ et croissante ensuite.

À l’origine, la demi-tangente est horizontale. En l’infini, la courbe monte avec une branche de direction verticale. Le tracé ci-dessous reprend ces points et propriétés ; il ne remplace pas leurs justifications.`),
  ], { correctionFigureKey: "tc-l4-functions" }),
  ex(32, "Niveau sonore et logarithme décimal", String.raw`Le niveau sonore $S$, en décibels, et l’intensité $I$, en $\mathrm{W/m^2}$, sont liés par $S=10\log(I/I_0)$, avec $I_0=10^{-12}\,\mathrm{W/m^2}$. Une conversation possède une intensité $10^4I_0$.`, [
    short("1", "Détermine son niveau sonore, en décibels.", "$40$", ["40"], String.raw`Le rapport $I/I_0$ vaut $10^4$. Donc $S=10\log(10^4)=10\times4=\boxed{40\ \text{dB}}$.`),
    short("2", String.raw`Quelle intensité correspond à $100$ dB, en $\mathrm{W/m^2}$ ?`, "$0{,}01$", ["0,01", "1/100", "10^-2"], String.raw`$100=10\log(I/I_0)$ donne $\log(I/I_0)=10$, donc $I/I_0=10^{10}$. Avec $I_0=10^{-12}$, **$I=10^{-2}=0{,}01\,\mathrm{W/m^2}$**.`),
    written("3", "Comment modifier l’intensité pour abaisser le niveau de 1 décibel ?", String.raw`Notons $I_1$ l’intensité initiale et $I_2$ la nouvelle. La différence des niveaux vaut :

$$S_2-S_1=10\log(I_2/I_1).$$

Pour avoir $S_2-S_1=-1$, il faut $\log(I_2/I_1)=-0{,}1$, donc :

$$\boxed{I_2=10^{-0{,}1}I_1\approx0{,}7943I_1.}$$

**Il faut réduire l’intensité d’environ $20{,}6\%$**, ou la diviser par $10^{0{,}1}\approx1{,}259$. Le niveau en décibels ne varie pas proportionnellement à l’intensité.`),
  ]),
  ex(33, "Comparer des énergies sismiques", String.raw`On utilise dans cet exercice la relation $\log E=11{,}4+1{,}5M$ entre l’énergie $E$ et la magnitude $M$, avec la même unité d’énergie pour tous les calculs.

Les valeurs de magnitude proposées sont $3$, $4{,}5$, $6$, $7$, $7{,}5$ et $9$. Pour les comparaisons demandées, le modèle attribue à Skopje $M=6$, à Los Angeles $M=7{,}5$ et à Lisbonne $M=9$. Il s’agit de comparer les **énergies** libérées.`, [
    short("1", "Par quel facteur l’énergie d’un séisme de magnitude 7 dépasse-t-elle celle d’un séisme de magnitude 3 ?", "$10^6$", ["10^6", "1000000"], String.raw`En soustrayant les relations, $\log(E_7/E_3)=1{,}5(7-3)=6$. Donc **$E_7/E_3=10^6$** : l’énergie est un million de fois plus grande.`),
    short("2", "Le séisme de Skopje libère 1 000 fois l’énergie d’un séisme de magnitude 4. Calcule sa magnitude.", "$6$", ["6"], String.raw`On a $\log(E/E_4)=\log1000=3=1{,}5(M-4)$. Ainsi $M-4=2$, donc **$M=6$**.`),
    written("3.a", "Compare l’énergie du séisme de Skopje à celle du séisme de Lisbonne dans ce modèle.", String.raw`$\log(E_{\mathrm{Lisbonne}}/E_{\mathrm{Skopje}})=1{,}5(9-6)=4{,}5$. Donc $E_{\mathrm{Lisbonne}}/E_{\mathrm{Skopje}}=10^{4{,}5}\approx31623$.

**Avec les magnitudes données, Lisbonne libère environ 31 623 fois l’énergie de Skopje.** L’énergie de Skopje représente donc environ $1/31623$ de celle de Lisbonne.`),
    written("3.b", "Compare l’énergie du séisme de Los Angeles à celle du séisme de Lisbonne dans ce modèle.", String.raw`La différence de magnitude est $9-7{,}5=1{,}5$, donc $\log(E_{\mathrm{Lisbonne}}/E_{\mathrm{Los\ Angeles}})=1{,}5\times1{,}5=2{,}25$.

**Le rapport des énergies vaut $10^{2{,}25}\approx177{,}8$** en faveur de Lisbonne. On n’additionne pas les magnitudes : on utilise leur différence dans le logarithme du rapport.`),
  ]),
];
