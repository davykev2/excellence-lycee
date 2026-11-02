import { choice, exercise, short, tf, written } from "./builders";
const r = String.raw;

export const limitsFixationB = [
  exercise(15, "Déduire une limite par comparaison", r`On donne les fonctions numériques $f,g,h,t$ et les informations suivantes. Déduis, si possible, la limite de $f$ au point considéré.`, [
    short("1)", r`$f\ge g$ et $\displaystyle\lim_{x\to-2}g(x)=+\infty$.`, "$+\\infty$", ["+∞", "∞", "+infini"], r`Pour tout seuil $M$, $g(x)>M$ lorsque $x$ est suffisamment proche de $-2$. Alors $f(x)\ge g(x)>M$. **Par comparaison, $\lim_{x\to-2}f(x)=+\infty$.**`),
    short("2)", r`$h\ge f$ et $\displaystyle\lim_{x\to1}h(x)=-\infty$.`, "$-\\infty$", ["-∞", "-infini"], r`Pour tout seuil négatif, $h$ finit par lui être inférieur et $f\le h$ aussi. **Par comparaison, $\lim_{x\to1}f(x)=-\infty$.**`),
    choice("3)", r`$t\le f\le g$, $\displaystyle\lim_{x\to1}g(x)=2$ et $\displaystyle\lim_{x\to1}t(x)=1{,}9$.`, ["La limite vaut 2", "La limite vaut 1,9", "On ne peut pas déterminer la limite"], 2, r`Les deux bornes ont des limites **différentes**. Le théorème des gendarmes ne s’applique donc pas. Par exemple, $f(x)=1{,}95$ convient, mais une fonction oscillant entre $1{,}9$ et $2$ peut aussi convenir. On ne peut même pas assurer l’existence d’une limite. Si une limite existe, elle appartient à $[1{,}9;2]$.`),
  ]),
  exercise(16, "Vérifier les conditions d’un théorème", "Dis si chaque déduction est vraie ou fausse.", [
    tf("1)", r`$f\ge g$ et $\lim_{x\to x_0}g(x)=-\infty$, donc $\lim_{x\to x_0}f(x)=-\infty$.`, false, r`Être **au-dessus** d’une fonction qui tend vers $-\infty$ n’impose aucune limite. Contre-exemple : $g(x)=-1/x^2$ et $f(x)=0$ au voisinage de $0$. **Faux.**`),
    tf("2)", r`$g\ge f$ et $\lim_{x\to x_0}g(x)=-\infty$, donc $\lim_{x\to x_0}f(x)=-\infty$.`, true, r`On a $f\le g$ et la borne supérieure tend vers $-\infty$. Le théorème de comparaison donne la limite annoncée. **Vrai.**`),
    tf("3)", r`$h\le f\le g$, $\lim_{x\to x_0}h(x)=-1$ et $\lim_{x\to x_0}g(x)=-0{,}9999$, donc $\lim_{x\to x_0}f(x)=-1$.`, false, r`Les limites des bornes ne sont pas égales. On peut prendre $f$ constante égale à $-0{,}99995$, qui vérifie l’encadrement sans tendre vers $-1$. **Faux.**`),
    tf("4)", r`$|f|\le g$ et $\lim_{x\to x_0}g(x)=0$, donc $\lim_{x\to x_0}f(x)=0$.`, true, r`L’inégalité implique $-g(x)\le f(x)\le g(x)$. Les deux bornes tendent vers $0$. **Par le théorème des gendarmes, $f(x)\to0$ : vrai.**`),
  ]),
  exercise(17, "Encadrer une fonction trigonométrique", r`Soit $f$ définie sur $]0;+\infty[$ par $f(x)=\frac{\sqrt x\sin x}{x^2}$.`, [
    written("1)", r`Justifie que, pour $x>0$, $-\frac1{x\sqrt x}\le f(x)\le\frac1{x\sqrt x}$.`, r`On sait que $-1\le\sin x\le1$. Pour $x>0$, $\frac{\sqrt x}{x^2}=\frac1{x\sqrt x}>0$ : la multiplication conserve l’ordre. On obtient donc bien
$$-\frac1{x\sqrt x}\le\frac{\sqrt x\sin x}{x^2}\le\frac1{x\sqrt x}.$$`),
    short("2)", r`Déduis-en la limite de $f$ en $+\infty$.`, "$0$", ["0"], r`Les deux fonctions qui encadrent $f$ tendent vers $0$ en $+\infty$. Le théorème des gendarmes permet de conclure : **$\lim_{x\to+\infty}f(x)=0$.**`),
  ]),
  exercise(18, "Choisir un encadrement efficace", r`Calcule la limite de $f$ en $x_0$ dans chacun des cas suivants.`, [
    short("1)", r`$|f(x)-2|\le\frac3{1+\sqrt x}$, avec $x_0=+\infty$.`, "$2$", ["2"], r`Le majorant $\frac3{1+\sqrt x}$ tend vers $0$. De $-\frac3{1+\sqrt x}\le f(x)-2\le\frac3{1+\sqrt x}$, les gendarmes donnent $f(x)-2\to0$, donc **$f(x)\to2$**.`),
    short("2)", r`$f(x)=x^2\cos\frac1x$, avec $x_0=0$. On pourra poser $u=1/x$.`, "$0$", ["0"], r`Pour $x\ne0$, $-x^2\le x^2\cos(1/x)\le x^2$. Les deux bornes tendent vers $0$ ; **la limite vaut $0$**. Avec $u=1/x$, cela s’écrit $-1/u^2\le(\cos u)/u^2\le1/u^2$, lorsque $|u|\to+\infty$.`),
    short("3)", r`$f(x)>\frac3{x^2}$, avec $x_0=0$.`, "$+\\infty$", ["+∞", "∞", "+infini"], r`Quand $x\to0$ avec $x\ne0$, $\frac3{x^2}\to+\infty$. Comme $f$ est au-dessus, **le théorème de comparaison donne $f(x)\to+\infty$**.`),
  ]),
  exercise(19, "Compléter des propriétés de monotonie", r`Soient $f$ et $g$, respectivement croissante et décroissante sur $]a;b[$.

Utilise les lettres, mots ou expressions : **1)** $f$ ; **2)** $a$ ; **3)** $b$ ; **4)** finie ; **5)** droite ; **6)** $g$ ; **7)** minorée ; **8)** gauche ; **9)** $-\infty$ ; **10)** non minorée.

- Si … est … sur $]a;b[$, alors … a pour limite … à … en … .
- Si … est … sur $]a;b[$, alors … admet une limite … à … en … .`, [
    written("Propriétés", "Complète les deux propriétés de façon à obtenir des énoncés corrects.", r`**Deux complétions correctes possibles :**

1. Si **$f$ est non minorée** sur $]a;b[$, alors **$f$ a pour limite $-\infty$ à droite en $a$**. Codes : **1, 10, 1, 9, 5, 2**.

2. Si **$g$ est minorée** sur $]a;b[$, alors **$g$ admet une limite finie à gauche en $b$**. Codes : **6, 7, 6, 4, 8, 3**.

D’autres complétions sont valides : une fonction $f$ croissante minorée a une limite finie à droite en $a$ ; une fonction $g$ décroissante non minorée tend vers $-\infty$ à gauche en $b$. **Le modèle n’est donc pas l’unique rédaction possible.**`),
  ]),
  exercise(20, "Limites d’une fonction croissante", r`On considère une fonction $f$ croissante sur l’intervalle ouvert $]a;b[$.`, [
    written("1)", r`Il existe un réel $m$ tel que, pour tout $x\in]a;b[$, $m<f(x)$. Déduis la nature de la limite de $f$ à droite en $a$.`, r`Le même réel $m$ minore toutes les valeurs de $f$ : $f$ est minorée. Une fonction croissante et minorée sur $]a;b[$ admet donc **une limite finie à droite en $a$**. Sa valeur exacte ne peut pas être calculée avec ces seules données. Le minorant doit être commun à tous les $x$.`),
    short("2)", r`Il n’existe aucun réel $M$ tel que, pour tout $x\in]a;b[$, $f(x)\le M$. Détermine la limite de $f$ à gauche en $b$.`, "$+\\infty$", ["+∞", "∞", "+infini"], r`L’hypothèse signifie que $f$ n’est pas majorée. Comme elle est croissante, elle tend vers **$+\infty$ à gauche en $b$**. Il ne faut pas confondre « non majorée » avec « majorée par un nombre que l’on ne connaît pas ».`),
  ]),
  exercise(21, "Continuité et domaine de définition", r`On donne $f(x)=\frac{2x-x^2}{x(x+1)}$ et $g(x)=|1-x^2|$.`, [
    written("1)", r`Étudie la continuité de $f$ en $0$ et en $2$.`, r`**En $0$ :** le dénominateur est nul, donc $f(0)$ n’est pas défini. La fonction donnée n’est pas continue en $0$. Pour $x\ne0,-1$, on a $f(x)=\frac{2-x}{x+1}$ et $\lim_{x\to0}f(x)=2$ ; cela permettrait un prolongement, mais ne définit pas rétroactivement $f(0)$.

**En $2$ :** le dénominateur vaut $6\ne0$. Le quotient de polynômes est donc continu en $2$ et $f(2)=0$.`),
    written("2)", r`Étudie la continuité de $g$ en $-1$.`, r`Le polynôme $x\mapsto1-x^2$ est continu sur $\mathbb R$, et la valeur absolue aussi. Leur composée $g$ est donc continue sur $\mathbb R$, notamment en $-1$, avec $g(-1)=0$.`),
  ]),
  exercise(22, "Vérifier la valeur au point de raccordement", r`Dis si chaque fonction est continue au point indiqué. Justifie chaque réponse.`, [
    written("f en 0", r`$f(x)=\frac{x(x-2)}x$ si $x\ne0$, et $f(0)=2$.`, r`Pour $x\ne0$, $f(x)=x-2$, donc $\lim_{x\to0}f(x)=-2$. Or $f(0)=2$. La limite n’est pas égale à la valeur au point : **$f$ n’est pas continue en $0$**.`),
    written("g en 1", r`$g(x)=\frac{\sqrt x-1}{x-1}$ si $x\ge0$ et $x\ne1$, et $g(1)=\frac12$.`, r`Par conjugaison, pour $x\ne1$, $g(x)=\frac1{\sqrt x+1}\to\frac12$. Cette limite égale $g(1)$ : **$g$ est continue en $1$**.`),
    written("h en −1", r`$h(x)=-2x^2+3$ pour $x<-1$, $h(x)=2+x$ pour $-1\le x<2$, et $h(x)=0$ pour $x\ge2$. Étudie la continuité en $-1$.`, r`Les limites à gauche et à droite valent respectivement $-2(-1)^2+3=1$ et $2-1=1$. De plus, $h(-1)=1$. **La fonction est continue en $-1$.**`),
    written("h en 2", r`Pour la même fonction $h$, étudie la continuité en $2$.`, r`À gauche, $h(x)\to4$ ; à droite, $h(x)\to0=h(2)$. La limite bilatérale n’existe pas, donc **$h$ n’est pas continue en $2$**.`),
  ]),
  exercise(23, "Déterminer deux paramètres de continuité", r`Soit $f$ définie par
$$f(x)=\begin{cases}-3x+2&x\le-1,\\2x^2+ax+1&-1<x<0,\\\dfrac{x^2-1+b}{x+1}&x\ge0.\end{cases}$$
Détermine $a$ et $b$ pour que $f$ soit continue en $-1$ et en $0$.`, [
    short("a", "Valeur de a", "$-2$", ["-2"], r`En $-1$, la première branche donne $f(-1)=5$ ; la limite à droite vaut $2-a+1=3-a$. La continuité impose $3-a=5$, donc **$a=-2$**.`),
    short("b", "Valeur de b", "$2$", ["2"], r`En $0$, la limite à gauche vaut $1$ et la valeur de la troisième branche est $b-1$. On impose $b-1=1$, donc **$b=2$**. Les deux raccordements sont alors continus.`),
  ]),
  exercise(24, "Repérer un prolongement possible", r`On donne $f(x)=\frac{x^3-5x^2+4x}{x^2-1}$. Dis si chaque affirmation est vraie ou fausse.`, [
    tf("1)", r`$f$ admet un prolongement par continuité en $1$.`, true, r`Le numérateur se factorise en $x(x-1)(x-4)$. Pour $x\ne\pm1$, $f(x)=\frac{x(x-4)}{x+1}$. La limite en $1$ vaut $-\frac32$, donc un prolongement existe en posant $\widetilde f(1)=-\frac32$. **Vrai.**`),
    tf("2)", r`$f$ admet un prolongement par continuité en $-1$.`, false, r`Dans l’expression simplifiée, le numérateur tend vers $5>0$ et $x+1\to0$. Les limites sont $-\infty$ à gauche et $+\infty$ à droite. Aucun prolongement réel continu n’est possible. **Faux.**`),
  ]),
  exercise(25, "Justifier la valeur d’un prolongement", r`Soit
$$f(x)=\frac{\sqrt{16-x}-2\sqrt{x+4}}x,\qquad x\in[-4;16]\setminus\{0\}.$$
On définit $h(x)=f(x)$ pour $x\ne0$ et $h(0)=-\frac58$.`, [
    written("Justification", r`Justifie que $h$ est le prolongement par continuité de $f$ en $0$.`, r`Multiplions par $\sqrt{16-x}+2\sqrt{x+4}$ :
$$f(x)=\frac{(16-x)-4(x+4)}{x(\sqrt{16-x}+2\sqrt{x+4})}
=\frac{-5}{\sqrt{16-x}+2\sqrt{x+4}}.$$
Quand $x\to0$, le dénominateur tend vers $4+4=8$, donc $\lim_{x\to0}f(x)=-\frac58=h(0)$. **La fonction $h$ est continue en $0$ et coïncide avec $f$ ailleurs : c’est le prolongement recherché.**`),
  ]),
  exercise(26, "Un prolongement empêché par les limites latérales", r`On donne $f(x)=\frac{x^2+x}{|x|}$ pour $x\ne0$.`, [
    written("Étude", r`Dis si $f$ admet un prolongement par continuité en $0$. Justifie ta réponse.`, r`Pour $x>0$, $f(x)=x+1\to1$. Pour $x<0$, $f(x)=-x-1\to-1$. Les limites latérales étant différentes, **aucune valeur attribuée en $0$ ne peut rendre la fonction continue**.`),
  ]),
  exercise(27, "Prolonger grâce à un encadrement", r`On donne une fonction $f$ continue sur $I=[-2;3]\setminus\{1\}$ et vérifiant, au voisinage de $1$ :
$$|f(x)-2|\le\left|\frac{x^2-1}{x+1}\right|.$$`, [
    written("1)", r`$f$ admet-elle un prolongement par continuité en $1$ ? Justifie.`, r`Au voisinage de $1$, $x+1\ne0$ et $\left|\frac{x^2-1}{x+1}\right|=|x-1|\to0$. L’inégalité donne $-|x-1|\le f(x)-2\le|x-1|$. Le théorème des gendarmes donne **$\lim_{x\to1}f(x)=2$** ; c’est cette limite finie qui permet le prolongement.`),
    written("2)", "Si oui, détermine ce prolongement.", r`On pose $\widetilde f(x)=f(x)$ pour $x\ne1$ et $\widetilde f(1)=2$. Alors $\lim_{x\to1}\widetilde f(x)=\widetilde f(1)$, donc **$\widetilde f$ est le prolongement continu en $1$**.`),
  ]),
  exercise(28, "Trois tests de prolongement", r`Dans chaque cas, $f$ est définie sur $K$ et $a$ est le point où l’on cherche à la prolonger. Dis si un prolongement continu réel est possible ; si oui, détermine-le.`, [
    written("1)", r`$f(x)=\frac{1+|x|}{|x|-1}$, $K=]-1;1[$, $|a|=1$.`, r`Dans $K$, $|x|-1<0$. Quand $x\to1^-$ ou $x\to-1^+$, le numérateur tend vers $2$ et le dénominateur vers $0^-$. La limite est $-\infty$ à chacune des deux extrémités. **Aucun prolongement réel continu en $a=1$ ni en $a=-1$.**`),
    written("2)", r`$f(x)=\frac{\sqrt{x+3}}{x-1}$, $K=[-3;1[$, $a=1$.`, r`Quand $x\to1^-$, $\sqrt{x+3}\to2$ et $x-1\to0^-$. La limite est $-\infty$ : **pas de prolongement continu réel en $1$**.`),
    written("3)", r`$f(x)=\frac{\sin(2x)}x$, $K=]0;1[$, $a=0$.`, r`**Cherchons la limite à droite en $0$**, car $f$ n’est donnée que pour $x>0$. Sur $]0;1[$ :

$$f(x)=2\,\frac{\sin(2x)}{2x}.$$

**Posons $u=2x$.** Lorsque $x\to0^+$, on a $u\to0^+$. La limite de référence en radians donne :

$$\lim_{u\to0^+}\frac{\sin u}{u}=1.$$

Par produit :

$$\boxed{\lim_{x\to0^+}f(x)=2.}$$

Cette limite finie permet de prolonger $f$ en attribuant la valeur $2$ au point $0$. On définit donc :

$$\widetilde f(x)=\begin{cases}
\dfrac{\sin(2x)}x&\text{si }0<x<1,\\[4pt]
2&\text{si }x=0.
\end{cases}$$

La fonction $\widetilde f$ est continue en $0$ relativement à $[0;1[$ et coïncide avec $f$ sur $]0;1[$. **C’est le prolongement continu recherché.**`),
  ]),
  exercise(29, "Continuité d’une somme sur un intervalle", r`Soit $f(x)=\sqrt x+2x^2-\frac2x$.`, [
    written("Justification", r`Justifie que $f$ est continue sur $]0;5[$.`, r`Sur $]0;5[$, la fonction $x\mapsto\sqrt x$ est continue car $x>0$ ; $x\mapsto2x^2$ est polynomiale, donc continue ; $x\mapsto-2/x$ est continue car $x\ne0$. **Une somme de fonctions continues étant continue, $f$ est continue sur $]0;5[$.**`),
  ]),
  exercise(30, "Images d’intervalles : vrai ou faux", "Dis si chaque affirmation est vraie ou fausse.", [
    tf("1)", r`$f(x)=(x-1)^2-3$ et $f([1;2])=[-3;-1]$.`, false, r`Sur $[1;2]$, $x-1\in[0;1]$, donc $(x-1)^2\in[0;1]$ et $f(x)\in[-3;-2]$. Les valeurs intermédiaires sont toutes atteintes par continuité. **L’image est $[-3;-2]$ : faux.**`),
    tf("2)", r`$f(x)=-x^2+8x-3$ et $f([0;+\infty[)=]-\infty;0]$.`, false, r`Écrivons $f(x)=13-(x-4)^2$. Le maximum $13$ est atteint en $x=4$ et $f(x)\to-\infty$ quand $x\to+\infty$. Par continuité, **l’image est $]-\infty;13]$ : faux**.`),
    tf("3)", r`$f(x)=2+\frac1{2x-3}$ et $f(]3/5;5])=[f(3/5);f(5)]$.`, false, r`Le point $\frac32$ appartient à $]3/5;5]$ mais n’est pas dans le domaine de $f$. On ne peut donc pas appliquer le théorème de l’image d’un intervalle continu sur cet intervalle. De plus, les valeurs de $f$ sont non bornées près de $\frac32$, contrairement au segment annoncé. **Faux.**`),
  ]),
  exercise(31, "Image d’un segment par une fonction croissante", r`Soit $f:\mathbb R\to\mathbb R$, continue et croissante sur $[0;1]$, telle que $f(0)=4$ et $f(1)=7$.`, [
    short("Image", r`Détermine $f([0;1])$.`, "$[4;7]$", ["[4;7]", "[4,7]"], r`La croissance donne $4\le f(x)\le7$ sur $[0;1]$. Par continuité et par le théorème des valeurs intermédiaires, chaque valeur entre $4$ et $7$ est atteinte. Ainsi **$f([0;1])=[4;7]$**.`),
  ]),
  exercise(32, "Lire l’image d’un intervalle dans un tableau", r`Soit $f$ définie et continue sur $\mathbb R$. Son tableau de variation est donné ci-dessous.`, [
    short("1)", r`Détermine $f([2;4])$.`, "$[0;4]$", ["[0;4]", "[0,4]"], r`Sur $[2;4]$, $f$ décroît continûment de $4$ à $0$, bornes comprises. **L’image est $[0;4]$.**`),
    short("2)", r`Détermine $f([4;+\infty[)$.`, "$[0;+\\infty[$", ["[0;+∞[", "[0;+infini[", "[0;∞[", "[0,+∞)"], r`Sur $[4;+\infty[$, $f$ croît continûment de $f(4)=0$ vers $+\infty$. La valeur $0$ est atteinte, mais $+\infty$ n’est pas une valeur réelle. **L’image est $[0;+\infty[$.**`),
    short("3)", r`Détermine $f(]-\infty;2[)$.`, "$]-\\infty;4[$", ["]-∞;4[", "]-infini;4[", "(-∞,4)"], r`Sur $]-\infty;2[$, $f$ est croissante, tend vers $-\infty$ à gauche et vers $4$ quand $x\to2^-$. Le point $2$ est exclu et les valeurs y sont strictement inférieures à $4$. **L’image est $]-\infty;4[$.**`),
  ], { figureKey: "tc-l1-variation" }),
];
