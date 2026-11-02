import { choice, short, tf, written } from "./builders";
import { derivativeExercise as ex } from "./terminalCDerivativesBuilders";
const r = String.raw;

export const derivativesFixationA = [
  ex(1, "Dérivabilité à gauche et à droite : vrai ou faux", r`La fonction $f$ est définie en $a$. Indique si chaque affirmation est vraie ou fausse.`, [
    tf("1.", r`Si $\displaystyle\lim_{x\to a}\frac{f(x)-f(a)}{x-a}=+\infty$, alors $f$ est dérivable à gauche en $a$.`, false, r`Un nombre dérivé est **un réel fini**. Ici, le taux tend vers $+\infty$, ce qui ne donne pas un nombre dérivé à gauche. **Faux.**`),
    tf("2.", r`Si $f'_g(a)\ne f'_d(a)$, alors $f$ n’est pas dérivable en $a$.`, true, r`Pour être dérivable en $a$, une fonction doit avoir deux nombres dérivés latéraux finis **et égaux**. Deux valeurs différentes excluent la dérivabilité. **Vrai.**`),
    tf("3.", r`Si les limites des taux à gauche et à droite valent respectivement $2$ et $1{,}999$, alors $f$ est dérivable en $a$.`, false, r`On compare les valeurs exactes, pas leur proximité : $2\ne1{,}999$. Les deux nombres dérivés sont différents. **Faux.**`),
    tf("4.", r`$f$ est dérivable en $a$ si et seulement si elle est dérivable à gauche et à droite en $a$.`, false, r`Il manque une condition : **les deux nombres dérivés doivent être égaux**. Par exemple, $f(x)=|x-a|$ a les nombres dérivés $-1$ et $1$, mais n’est pas dérivable en $a$. **Faux.**`),
  ]),
  ex(2, "Étudier un raccord avec une valeur absolue", r`Soit $g(x)=x^2+|x-2|$ sur $\mathbb R$. Étudie la dérivabilité de $g$ en $2$.`, [
    short("a)", r`Calcule $g'_g(2)$.`, "$3$", ["3"], r`On a $g(2)=4$. Si $x<2$, $|x-2|=2-x$, donc :

$$\frac{g(x)-g(2)}{x-2}=\frac{x^2-x-2}{x-2}.$$

On factorise $x^2-x-2=(x-2)(x+1)$. Pour $x\ne2$, le taux vaut $x+1$, qui tend vers $3$ en $2^-$. **Donc $g'_g(2)=3$.**`),
    short("b)", r`Calcule $g'_d(2)$.`, "$5$", ["5"], r`Si $x>2$, $|x-2|=x-2$. En gardant $g(2)=4$ :

$$\frac{g(x)-g(2)}{x-2}=\frac{x^2+x-6}{x-2}=x+3,$$

car $x^2+x-6=(x-2)(x+3)$. Le taux tend vers $5$ en $2^+$. **Donc $g'_d(2)=5$.**`),
    written("c)", "Conclus sur la dérivabilité.", r`Les deux nombres dérivés existent mais $3\ne5$. **$g$ n’est pas dérivable en $2$**. La courbe a deux demi-tangentes distinctes en $(2;4)$.`),
  ]),
  ex(3, "Un raccord dérivable en zéro", r`Sur $\mathbb R$, on définit :

$$f(x)=\begin{cases}x^3+3x-1&x\le0,\\3x-1&x>0.\end{cases}$$

Étudie la dérivabilité de $f$ en $0$.`, [
    short("a)", r`Calcule $f'_g(0)$.`, "$3$", ["3"], r`On a $f(0)=-1$. Pour $x<0$ :

$$\frac{f(x)-f(0)}x=\frac{x^3+3x}{x}=x^2+3\longrightarrow3.$$

La division est autorisée car $x\ne0$. **Donc $f'_g(0)=3$.**`),
    short("b)", r`Calcule $f'_d(0)$.`, "$3$", ["3"], r`Pour $x>0$, le taux vaut $(3x-1+1)/x=3$. **Donc $f'_d(0)=3$.**`),
    written("c)", "Conclus.", r`Les deux limites sont finies et égales : $f'_g(0)=f'_d(0)=3$. **$f$ est dérivable en $0$ et $f'(0)=3$.**`),
  ]),
  ex(4, "Dérivabilité sur un intervalle fermé", r`La fonction $f$ est définie sur $[a;b]$, avec $a<b$. Indique Vrai ou Faux.`, [
    tf("1.", r`Si $f$ est dérivable à droite en $a$ et à gauche en $b$, alors elle est dérivable sur $[a;b]$.`, false, r`Les extrémités ne suffisent pas : il faut aussi la dérivabilité en chaque point de $]a;b[$. Une fonction peut présenter un point anguleux à l’intérieur. **Faux.**`),
    tf("2.", r`Si $f$ est dérivable en tout point de $]a;b[$, alors elle est dérivable sur $[a;b]$.`, false, r`Il faut encore vérifier les nombres dérivés à droite en $a$ et à gauche en $b$. Par exemple, $\sqrt{x-a}$ n’a pas de nombre dérivé réel à droite en $a$. **Faux.**`),
    tf("3.", r`Si $f$ est dérivable sur $]a;b[$, à droite en $a$ et à gauche en $b$, alors elle est dérivable sur $[a;b]$.`, true, r`Ce sont exactement les trois conditions de la définition de la dérivabilité sur un intervalle fermé. **Vrai.**`),
  ]),
  ex(5, "Vérifier la dérivabilité aux deux extrémités", r`Soit $f(x)=(x+1)\sqrt{x+1}-1$ sur $[-1;0]$. Étudie sa dérivabilité sur cet intervalle.`, [
    short("a)", r`Calcule $f'_d(-1)$.`, "$0$", ["0"], r`On a $f(-1)=-1$. Pour $x>-1$ :

$$\frac{f(x)-f(-1)}{x+1}=\sqrt{x+1}\longrightarrow0.$$

**Donc $f'_d(-1)=0$.**`),
    short("b)", r`Calcule $f'_g(0)$.`, "$3/2$", ["3/2", "1,5"], r`On a $f(0)=0$. Pour $-1<x<0$, on multiplie le numérateur et le dénominateur par $(x+1)\sqrt{x+1}+1$ :

$$\frac{f(x)}x=\frac{(x+1)^3-1}{x((x+1)\sqrt{x+1}+1)}.$$

Or $(x+1)^3-1=x(x^2+3x+3)$. Après simplification par $x\ne0$ :

$$\frac{f(x)}x=\frac{x^2+3x+3}{(x+1)\sqrt{x+1}+1}\longrightarrow\frac32.$$

**Donc $f'_g(0)=3/2$.**`),
    written("c)", "Justifie la dérivabilité sur tout l’intervalle.", r`Sur $]-1;0[$, les fonctions $x+1$ et $\sqrt{x+1}$ sont dérivables : leur produit, puis sa différence avec $1$, sont dérivables. Les deux nombres dérivés aux extrémités sont finis. **$f$ est donc dérivable sur $[-1;0]$.**`),
  ]),
  ex(6, "Tangentes et demi-tangentes : vrai ou faux", r`La fonction $f$ est continue en $a$. Sa courbe est notée $(C)$. Indique Vrai ou Faux.`, [
    tf("1.", r`Si le taux d’accroissement tend vers $+\infty$ en $a$, alors $(C)$ admet une tangente horizontale en ce point.`, false, r`Une tangente horizontale correspond à un nombre dérivé nul. Une limite infinie du taux donne ici une **tangente verticale** $x=a$. **Faux.**`),
    tf("2.", r`Si le taux à gauche tend vers un réel $b$, alors $(C)$ admet une demi-tangente à gauche de coefficient directeur $b$.`, true, r`La limite finie est le nombre dérivé à gauche. La droite support a pour équation $y=f(a)+b(x-a)$. **Vrai.**`),
    tf("3.", r`Si les taux à gauche et à droite tendent tous deux vers $k\in\mathbb R$, alors $(C)$ admet deux demi-tangentes en $a$.`, true, r`Les deux demi-tangentes existent et ont le **même support** $y=f(a)+k(x-a)$. Elles constituent une tangente complète, car $f$ est dérivable en $a$. **Vrai.**`),
    tf("4.", r`Si le taux à gauche tend vers $-\infty$, alors $(C)$ admet nécessairement une tangente verticale complète en $a$.`, false, r`Cette information ne concerne que la gauche. On peut conclure à une **demi-tangente verticale à gauche**, mais pas à une tangente complète sans étudier l’autre côté. **Faux.**`),
  ]),
  ex(7, "Interpréter un taux infini", r`Soit $f(x)=\sqrt{x-1}+2$, définie sur $[1;+\infty[$. Calcule la limite du taux à droite en $1$, puis interprète-la graphiquement.`, [
    short("a)", r`Calcule $\displaystyle\lim_{x\to1^+}\frac{f(x)-f(1)}{x-1}$.`, "$+\\infty$", ["+∞", "∞", "+infini"], r`On a $f(1)=2$. Pour $x>1$ :

$$\frac{f(x)-f(1)}{x-1}=\frac{\sqrt{x-1}}{x-1}=\frac1{\sqrt{x-1}}.$$

Le dénominateur tend vers $0$ en restant positif. **La limite est $+\infty$.**`),
    written("b)", "Donne l’interprétation graphique.", r`La fonction est continue à droite en $1$. Sa courbe possède au point $A(1;2)$ une **demi-tangente verticale vers le haut**, de support $x=1$. Il n’existe pas de nombre dérivé réel à droite en $1$.`),
  ]),
  ex(8, "Reconnaître des dérivées successives", "Choisis l’unique réponse juste pour chaque énoncé.", [
    choice("1.", r`La dérivée troisième de $x\mapsto x^3$ est…`, ["$x\\mapsto3x$", "$x\\mapsto3x^2$", "$x\\mapsto6$"], 2, r`On dérive trois fois : $x^3\to3x^2\to6x\to6$. **La bonne réponse est la troisième.**`),
    choice("2.", r`La dérivée quatrième de $f$ se note…`, ["$f^4$", "$\\dfrac{d^4f}{dx^4}$", "$\\dfrac{df^4}{d^4x}$"], 1, r`La notation $d^4f/dx^4$ désigne quatre dérivations successives. $f^4$ désigne une puissance, pas une dérivée. **La bonne réponse est la deuxième.**`),
    choice("3.", r`La dérivée cinquième de $f$ est la dérivée de…`, ["La dérivée quatrième de f", "La dérivée sixième de f", "$f^{(5)}$"], 0, r`Par définition, $f^{(5)}=(f^{(4)})'$. **Il faut dériver la dérivée quatrième.**`),
  ]),
  ex(9, "Calculer une dérivée troisième", "Calcule la dérivée troisième dans chaque cas, sur l’intervalle indiqué.", [
    written("1.", r`$f(x)=3x^4-5x^2+7$, $I=\mathbb R$.`, r`On dérive chaque résultat avant de passer au suivant :

$$f'(x)=12x^3-10x,\qquad f''(x)=36x^2-10.$$

Une troisième dérivation donne **$f'''(x)=72x$**.`),
    written("2.", r`$f(x)=2\sin x-3\cos x$, $I=\mathbb R$.`, r`On utilise $(\sin x)'=\cos x$ et $(\cos x)'=-\sin x$ :

$$f'(x)=2\cos x+3\sin x.$$

$$f''(x)=-2\sin x+3\cos x.$$

Donc **$f'''(x)=-2\cos x-3\sin x$**.`),
    written("3.", r`$f(x)=1/(x-1)$, $I=]1;+\infty[$.`, r`Écrivons $f(x)=(x-1)^{-1}$. La dérivée de l’expression intérieure $x-1$ vaut $1$ :

$$f'(x)=-(x-1)^{-2},\qquad f''(x)=2(x-1)^{-3}.$$

Ainsi **$f'''(x)=-6/(x-1)^4$** sur $I$.`),
  ]),
  ex(10, "Associer une composée à sa dérivée", r`Les fonctions $u$ et $v$ sont dérivables. Associe chaque fonction à sa dérivée, sur les intervalles où les expressions sont définies et dérivables. Pour $\sqrt u$ et $u^r$, on suppose $u>0$.`, [
    choice("1.", "$u\\circ v$", ["$u'\\times(v'\\circ u)$", "$v'\\times(u'\\circ v)$"], 1, r`La fonction extérieure est $u$, l’expression intérieure est $v$. On multiplie la dérivée intérieure par la dérivée extérieure évaluée en $v$ : **$(u\circ v)'=v'\times(u'\circ v)$.**`, "select"),
    choice("2.", "$v\\circ u$", ["$u'\\times(v'\\circ u)$", "$v'\\times(u'\\circ v)$"], 0, r`Cette fois l’expression intérieure est $u$. **$(v\circ u)'=u'\times(v'\circ u)$.**`, "select"),
    choice("3.", "$\\sqrt u$", ["$u'/(2\\sqrt u)$", "$2u'\\sqrt u$", "$1/(2\\sqrt u)$"], 0, r`La dérivée extérieure de la racine est $1/(2\sqrt u)$ ; on multiplie par $u'$. **$(\sqrt u)'=u'/(2\sqrt u)$.**`, "select"),
    choice("4.", "$u^r$", ["$ru'u^{r-1}$", "$ru^{r-1}$", "$u'u^r$"], 0, r`La règle de la composée donne **$(u^r)'=r\,u'\,u^{r-1}$.**`, "select"),
    choice("5.", "$\\cos u$", ["$-u'\\sin u$", "$u'\\cos u$", "$-\\sin u$"], 0, r`On dérive le cosinus et on multiplie par $u'$ : **$(\cos u)'=-u'\sin u$.**`, "select"),
    choice("6.", "$\\sin u$", ["$u'\\cos u$", "$u'\\sin u$", "$-u'\\cos u$"], 0, r`On dérive le sinus et on multiplie par $u'$ : **$(\sin u)'=u'\cos u$.**`, "select"),
  ]),
  ex(11, "Choisir la dérivée d’une composée", "Choisis l’unique réponse juste.", [
    choice("1.", r`La dérivée de $x\mapsto\sin(x^2)$ sur $\mathbb R$ est…`, ["$\\cos(x^2)$", "$2x\\cos(x^2)$", "$-2x\\cos(x^2)$"], 1, r`Posons $u(x)=x^2$, donc $u'(x)=2x$. Alors $(\sin u)'=u'\cos u$, soit **$2x\cos(x^2)$**.`),
    choice("2.", r`Si $f$ est dérivable sur $\mathbb R$, la dérivée de $x\mapsto f(\cos x)$ est…`, ["$\\sin x\,f'(\\cos x)$", "$-\\sin x\,f'(\\cos x)$", "$-\\sin x\,f'(\\sin x)$"], 1, r`L’expression intérieure est $\cos x$, de dérivée $-\sin x$. La règle de composition donne **$-\sin x\,f'(\cos x)$**.`),
    choice("3.", r`La dérivée de $x\mapsto\sqrt{x^2-1}$ sur $]1;+\infty[$ est…`, ["$x/\\sqrt{x^2-1}$", "$1/(2\\sqrt{x^2-1})$", "$1/\\sqrt{x^2-1}$"], 0, r`On pose $u=x^2-1$, donc $u'=2x$ et $u>0$. Alors $f'=2x/(2\sqrt{x^2-1})$, soit **$x/\sqrt{x^2-1}$**.`),
  ]),
  ex(12, "Dériver des fonctions composées", "Calcule la dérivée sur l’intervalle indiqué.", [
    written("1.", r`$f(x)=\sin(3x-4)$, $I=\mathbb R$.`, r`On pose $u(x)=3x-4$, donc $u'(x)=3$. La règle $(\sin u)'=u'\cos u$ donne **$f'(x)=3\cos(3x-4)$**.`),
    written("2.", r`$f(x)=(-2x+5)^6$, $I=\mathbb R$.`, r`On pose $u(x)=-2x+5$, donc $u'(x)=-2$. Ainsi :

$$f'(x)=6u'(x)u(x)^5=6(-2)(-2x+5)^5.$$

**Donc $f'(x)=-12(-2x+5)^5$.**`),
    written("3.", r`$f(x)=\sqrt[3]{x^2+1}$, $I=]0;+\infty[$.`, r`On écrit $f=(x^2+1)^{1/3}$. L’expression intérieure est positive et a pour dérivée $2x$ :

$$f'(x)=\frac13(x^2+1)^{-2/3}\times2x.$$

**Donc $f'(x)=2x/(3\sqrt[3]{(x^2+1)^2})$.**`),
    written("4.", r`$f(x)=\cos^4x$, $I=\mathbb R$.`, r`Ici $f(x)=(\cos x)^4$. On utilise la puissance quatrième et $(\cos x)'=-\sin x$ :

$$f'(x)=4(\cos x)^3(-\sin x).$$

**Donc $f'(x)=-4\sin x\cos^3x$.**`),
  ]),
];
