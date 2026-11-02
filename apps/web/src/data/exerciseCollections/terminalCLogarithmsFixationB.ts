import type { ArenaExerciseItem } from "../../domain/arenaExercises";
import { choice, tf, written } from "./builders";
import { logarithmExercise as ex } from "./terminalCLogarithmsBuilders";

export const logarithmsFixationB: ArenaExerciseItem[] = [
  ex(12, "Dérivées de logarithmes", "Choisis la bonne fonction dérivée dans chaque cas.", [
    choice("1", String.raw`$g(x)=\ln(3x-6)$ sur $]2;+\infty[$.`, [String.raw`$1/(3x-6)$`, String.raw`$3/(3x-6)$`, String.raw`$3/\ln(3x-6)$`], 1, String.raw`Posons $u=3x-6>0$. Sa dérivée est $u'=3$, donc $g'=u'/u=3/(3x-6)$. **Réponse B.**`),
    choice("2", String.raw`$f(x)=5\ln x-x$ sur $]0;+\infty[$.`, [String.raw`$5/x-x$`, String.raw`$5/x-1$`, String.raw`$1/x-1$`], 1, String.raw`On dérive les deux termes : $(5\ln x)'=5/x$ et $(-x)'=-1$. Donc **$f'(x)=5/x-1$, réponse B**.`),
    choice("3", String.raw`$h(x)=\ln(x^2+3)$ sur $\mathbb R$.`, [String.raw`$2/(x^2+3)$`, String.raw`$1/(x^2+3)$`, String.raw`$2x/(x^2+3)$`], 2, String.raw`$u=x^2+3>0$ et $u'=2x$. Donc **$h'(x)=2x/(x^2+3)$, réponse C**. Il ne faut pas oublier le facteur $x$ de la dérivée intérieure.`),
  ]),
  ex(13, "Calculer une dérivée composée", "Pour chaque fonction, précise son domaine de dérivabilité puis calcule la dérivée.", [
    written("a", String.raw`$f(x)=\ln(2x-4)$.`, String.raw`L’argument est positif pour $x>2$. Sur cet intervalle, $u=2x-4$ est dérivable avec $u'=2$. Donc :

$$\boxed{f'(x)=\frac2{2x-4}=\frac1{x-2},\quad x>2.}$$`),
    written("b", String.raw`$g(x)=\ln(x^2)$.`, String.raw`Il faut $x^2>0$, donc $x\ne0$. Sur chacun des intervalles $]-\infty;0[$ et $]0;+\infty[$, $u=x^2$ est positif et $u'=2x$ :

$$\boxed{g'(x)=\frac{2x}{x^2}=\frac2x,\quad x\ne0.}$$`),
    written("c", String.raw`$h(x)=\ln(x^2-2x+4)$.`, String.raw`$x^2-2x+4=(x-1)^2+3>0$ pour tout réel $x$. La fonction est donc dérivable sur $\mathbb R$. Avec $u'=2x-2$ :

$$\boxed{h'(x)=\frac{2x-2}{x^2-2x+4}.}$$`),
  ]),
  ex(14, "Primitives de la forme u′/u", "Dans chaque cas, détermine toutes les primitives de f sur l’intervalle K.", [
    written("a", String.raw`$f(x)=1/(x-4)$ et $K=]4;+\infty[$.`, String.raw`Avec $u=x-4>0$ et $u'=1$, on reconnaît $u'/u$. **Les primitives sont $F(x)=\ln(x-4)+C$, $C\in\mathbb R$.** La dérivation donne $1/(x-4)$.`),
    written("b", String.raw`$f(x)=x^2/(x^3-1)$ et $K=]-\infty;1[$.`, String.raw`Posons $u=x^3-1<0$, donc $u'=3x^2$. On écrit $f=(1/3)u'/u$. Les primitives sont $(1/3)\ln|u|+C$. Comme $|u|=1-x^3$ sur $K$ :

$$\boxed{F(x)=\frac13\ln(1-x^3)+C.}$$

Vérification : $F'(x)=-(x^2)/(1-x^3)=x^2/(x^3-1)$.`),
    written("c", String.raw`$f(x)=(\ln x)/x$ et $K=]0;+\infty[$.`, String.raw`Posons $u=\ln x$, donc $u'=1/x$. La fonction est $u'u$, dont une primitive est $u^2/2$ :

$$\boxed{F(x)=\frac{(\ln x)^2}2+C.}$$

En dérivant, le facteur $2$ se simplifie et on retrouve $(\ln x)/x$. Ici, c’est la forme $u'u$, pas $u'/u$.`),
    written("d", String.raw`$f(x)=1/(3x+1)+5/(x-2)$ et $K=]-\infty;-1[$.`, String.raw`Sur $K$, $3x+1<0$ et $x-2<0$. Pour le premier terme, la dérivée intérieure vaut $3$ : une primitive est $(1/3)\ln|3x+1|$. Pour le second, une primitive est $5\ln|x-2|$.

**Toutes les primitives sont :**

$$\boxed{F(x)=\frac13\ln(-3x-1)+5\ln(2-x)+C.}$$

En dérivant, $(-3)/(-3x-1)=3/(3x+1)$ et $(-1)/(2-x)=1/(x-2)$, ce qui redonne $f$.`),
  ]),
  ex(15, "Reconnaître une primitive", "Une seule primitive proposée convient dans chaque ligne.", [
    choice("1", String.raw`$f(x)=1/(5x-1)$ sur $]1/5;+\infty[$.`, [String.raw`$5\ln(5x-1)$`, String.raw`$\ln(5x-1)$`, String.raw`$\frac15\ln(5x-1)$`], 2, String.raw`La dérivée de $\ln(5x-1)$ vaut $5/(5x-1)$. On multiplie donc par $1/5$. **Réponse C.**`),
    choice("2", String.raw`$f(x)=(x+1)/x$ sur $]0;+\infty[$.`, [String.raw`$\ln(x+1)/\ln x$`, String.raw`$x-e+\ln x$`, String.raw`$\ln((x+1)/x)$`], 1, String.raw`On écrit $f=1+1/x$. La dérivée de $x-e+\ln x$ est $1+1/x$ : la constante $-e$ disparaît. **Réponse B.**`),
    choice("3", String.raw`$h(x)=\ln x$ sur $]0;+\infty[$.`, [String.raw`$1/\ln x$`, String.raw`$x\ln x-x+e$`, String.raw`$\ln(1/x)+1$`], 1, String.raw`La règle du produit donne $(x\ln x-x+e)'=\ln x+1-1=\ln x$. **Réponse B.** Une constante quelconque serait aussi permise.`),
  ]),
  ex(16, "Propriétés des autres bases", String.raw`Dans les quatre premières affirmations, $\log$ désigne le logarithme décimal. Réponds Vrai ou Faux.`, [
    tf("1", String.raw`$\log1=0$.`, true, String.raw`Par définition, $\log1=\ln1/\ln10=0$. L’affirmation est **vraie**.`),
    tf("2", String.raw`Le domaine de $\log$ est $[0;+\infty[$.`, false, String.raw`Le logarithme n’est pas défini en $0$. Son domaine est **$]0;+\infty[$**, avec une borne ouverte. L’affirmation est fausse.`),
    tf("3", String.raw`$\displaystyle\lim_{x\to+\infty}\frac{\log x}x=+\infty$.`, false, String.raw`On écrit $(\log x)/x=((\ln x)/x)/\ln10$. Le numérateur tend vers $0$ et $\ln10$ est une constante non nulle. **La limite est $0$**, donc l’affirmation est fausse.`),
    tf("4", String.raw`$\displaystyle\lim_{x\to0^+}\log x=0$.`, false, String.raw`$\log x=\ln x/\ln10$ avec $\ln10>0$. Puisque $\ln x\to-\infty$, **la limite est $-\infty$**, pas zéro.`),
    tf("5", String.raw`$\log_2$ est strictement croissante sur $]0;+\infty[$.`, true, String.raw`Comme $2>1$, $\ln2>0$. La fonction $\log_2 x=\ln x/\ln2$ a le même sens de variation que $\ln$. **Vrai.**`),
    tf("6", String.raw`$\log_{1/2}$ est strictement décroissante sur $]0;+\infty[$.`, true, String.raw`$\ln(1/2)=-\ln2<0$. Diviser la fonction croissante $\ln$ par cette constante négative inverse son sens de variation. **Vrai.**`),
  ]),
  ex(17, "Regrouper en un seul logarithme", String.raw`Écris chaque expression sous la forme $\log_a(b)$.`, [
    written("a", String.raw`$\log_2(4)+\log_2(1/2)$.`, String.raw`Les arguments sont positifs et la base est la même. On utilise la formule de la somme :

$$\log_2(4)+\log_2(1/2)=\log_2(4\times1/2)=\boxed{\log_2(2)}.$$

Cette valeur est aussi égale à $1$.`),
    written("b", String.raw`$\log_3(9)-\log_3(27)$.`, String.raw`La différence devient le logarithme d’un quotient :

$$\log_3(9)-\log_3(27)=\log_3(9/27)=\boxed{\log_3(1/3)}.$$

Cette valeur est aussi égale à $-1$, car $1/3=3^{-1}$.`),
    written("c", String.raw`$\log_4(5)+\log_4(8)$.`, String.raw`On garde la base $4$ et on multiplie les arguments :

$$\log_4(5)+\log_4(8)=\log_4(5\times8)=\boxed{\log_4(40)}.$$`),
  ]),
];
