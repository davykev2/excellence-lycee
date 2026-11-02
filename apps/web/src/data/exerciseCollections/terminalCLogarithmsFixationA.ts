import type { ArenaExerciseItem } from "../../domain/arenaExercises";
import { choice, tf, written } from "./builders";
import { logarithmExercise as ex, limitAnswer as limit } from "./terminalCLogarithmsBuilders";

export const logarithmsFixationA: ArenaExerciseItem[] = [
  ex(1, "Définition et premières propriétés", "Indique si chaque égalité ou inégalité est vraie ou fausse.", [
    tf("1", String.raw`$\ln1=e$.`, false, String.raw`Par définition, $\ln1=0$. Comme $e\ne0$, l’égalité proposée est **fausse**.`),
    tf("2", String.raw`$\ln(1/e)=-1$.`, true, String.raw`La formule de l’inverse donne $\ln(1/e)=-\ln e=-1$. L’égalité est **vraie**.`),
    tf("3", String.raw`$\dfrac{\ln1}{\ln e}=\ln(1-e)$.`, false, String.raw`Le membre de gauche vaut $0/1=0$. Mais $e>1$, donc $1-e<0$ et $\ln(1-e)$ n’est pas défini dans $\mathbb R$. L’affirmation est **fausse**.`),
    tf("4", String.raw`$\ln5>\ln2+\ln3$.`, false, String.raw`$\ln2+\ln3=\ln6$. Comme $5<6$ et que $\ln$ est croissante, $\ln5<\ln6$. L’inégalité proposée est **fausse**.`),
    tf("5", String.raw`$3\ln2<2\ln3$.`, true, String.raw`On transforme les deux termes : $3\ln2=\ln8$ et $2\ln3=\ln9$. Comme $8<9$, $\ln8<\ln9$. L’affirmation est **vraie**.`),
    tf("6", String.raw`$\ln\sqrt e=1/2$.`, true, String.raw`$\sqrt e=e^{1/2}$. Donc $\ln\sqrt e=(1/2)\ln e=1/2$. L’égalité est **vraie**.`),
  ]),
  ex(2, "Choisir une écriture équivalente", String.raw`Dans chaque ligne, une seule proposition est correcte. Les nombres $a$, $x$ et $y$ sont strictement positifs.`, [
    choice("1", String.raw`$\ln(a^2/16)$ est égal à :`, [String.raw`$(\ln(a/4))^2$`, String.raw`$2(\ln a-\ln4)$`, String.raw`$\dfrac{\ln(a^2)}{\ln16}$`], 1, String.raw`$a^2/16=(a/4)^2$. Donc $\ln(a^2/16)=2\ln(a/4)=2(\ln a-\ln4)$. **Réponse B.**`),
    choice("2", String.raw`$\ln(3a)$ est égal à :`, [String.raw`$\ln3\times\ln a$`, String.raw`$3\ln a$`, String.raw`$\ln3+\ln a$`], 2, String.raw`Le logarithme d’un produit de deux nombres positifs est la somme de leurs logarithmes : $\ln(3a)=\ln3+\ln a$. **Réponse C.**`),
    choice("3", "Quelle identité est vraie ?", [String.raw`$\ln(x^2y^2)=2\ln x-\ln y$`, String.raw`$\ln(x/\sqrt y)=\ln x-\frac12\ln y$`, String.raw`$\ln(x+y)=\ln x+\ln y$`], 1, String.raw`Par quotient puis puissance, $\ln(x/\sqrt y)=\ln x-\ln(y^{1/2})=\ln x-\frac12\ln y$. **Réponse B.** Dans A, il faudrait $2\ln x+2\ln y$ ; le logarithme d’une somme ne se développe pas comme en C.`),
  ]),
  ex(3, "Équations et domaine", String.raw`Résous les équations dans $\mathbb R$. Commence par les conditions de définition.`, [
    written("a", String.raw`$\ln(1-x)=0$.`, String.raw`Il faut $1-x>0$, soit $x<1$. Comme $0=\ln1$, l’injectivité du logarithme donne $1-x=1$, donc $x=0$. Cette valeur respecte le domaine. **$S=\{0\}$.**`),
    written("b", String.raw`$\ln(4-x)=\ln(x-1)$.`, String.raw`Les deux arguments doivent être positifs : $x<4$ et $x>1$, donc $1<x<4$. Sur ce domaine, les logarithmes sont égaux si et seulement si $4-x=x-1$. On obtient $2x=5$, donc $x=5/2$, qui appartient au domaine. **$S=\{5/2\}$.**`),
    written("c", String.raw`$\ln(x^2-5x+4)=\ln(x^2-x-6)$.`, String.raw`On factorise les arguments : $(x-1)(x-4)>0$ et $(x+2)(x-3)>0$. Leur intersection donne $x<-2$ ou $x>4$.

Sur ce domaine, on égalise les arguments : $x^2-5x+4=x^2-x-6$, soit $4x=10$, donc $x=5/2$. Mais cette valeur n’appartient pas au domaine. **L’équation n’a aucune solution : $S=\varnothing$.**`),
  ]),
  ex(4, "Produits et regroupements de logarithmes", String.raw`Résous les équations dans $\mathbb R$.`, [
    written("a", String.raw`$(x^2-1)\ln x=0$.`, String.raw`Le domaine est $x>0$. Un produit est nul si l’un de ses facteurs est nul : $x^2-1=0$ ou $\ln x=0$. On obtient $x=-1$ ou $x=1$, mais $-1$ est interdit. Les deux facteurs s’annulent en $1$. **$S=\{1\}$.**`),
    written("b", String.raw`$\ln(x+5)=2\ln2-\ln(x-2)$.`, String.raw`Il faut $x+5>0$ et $x-2>0$, donc $x>2$. On regroupe les logarithmes :

$$\ln((x+5)(x-2))=\ln4.$$

Ainsi $(x+5)(x-2)=4$, soit $x^2+3x-14=0$. Le discriminant vaut $65$ et les racines sont $(-3\pm\sqrt{65})/2$. Seule la racine avec le signe $+$ est supérieure à $2$.

**$S=\{(-3+\sqrt{65})/2\}$.**`),
    written("c", String.raw`$\ln x=1$.`, String.raw`Il faut $x>0$. Par définition, $\ln e=1$. L’injectivité de $\ln$ donne **$x=e$**, donc **$S=\{e\}$.**`),
  ]),
  ex(5, "Domaines des logarithmes", "Pour chaque fonction, choisis son domaine de définition.", [
    choice("1", String.raw`$x\mapsto\ln(-x)$.`, [String.raw`$]-\infty;0[$`, String.raw`$]-\infty;-1[$`, String.raw`$]0;+\infty[$`], 0, String.raw`Il faut $-x>0$, donc $x<0$. **Le domaine est $]-\infty;0[$, réponse A.**`),
    choice("2", String.raw`$x\mapsto\ln(4-x^2)$.`, [String.raw`$]-\infty;-4[\cup]4;+\infty[$`, String.raw`$]-2;2[$`, String.raw`$]-\infty;-4[$`], 1, String.raw`L’argument doit être positif : $4-x^2>0$, soit $x^2<4$, donc $-2<x<2$. **Le domaine est $]-2;2[$, réponse B.**`),
    choice("3", String.raw`$x\mapsto\ln|x|$.`, [String.raw`$\mathbb R$`, String.raw`$]0;+\infty[$`, String.raw`$\mathbb R\setminus\{0\}$`], 2, String.raw`$|x|>0$ équivaut à $x\ne0$. Les nombres négatifs sont permis grâce à la valeur absolue. **Le domaine est $\mathbb R\setminus\{0\}$, réponse C.**`),
  ]),
  ex(6, "Déterminer un domaine", "Détermine l’ensemble de définition de chaque fonction.", [
    written("a", String.raw`$f(x)=\ln(x^2)$.`, String.raw`Il faut $x^2>0$, ce qui équivaut à $x\ne0$. **$D_f=\mathbb R\setminus\{0\}$.** On peut écrire $\ln(x^2)=2\ln|x|$, mais pas $2\ln x$ sur tout ce domaine.`),
    written("b", String.raw`$f(x)=\ln(x(x+2))$.`, String.raw`Il faut $x(x+2)>0$. Les deux facteurs sont de même signe pour $x<-2$ ou $x>0$. **$D_f=]-\infty;-2[\cup]0;+\infty[$.** Les racines $-2$ et $0$ sont exclues.`),
    written("c", String.raw`$f(x)=\ln x-\ln(2x)$.`, String.raw`Chaque logarithme doit exister : $x>0$ et $2x>0$. Donc **$D_f=]0;+\infty[$**. Sur ce domaine seulement, on peut simplifier $f(x)=\ln(x/(2x))=-\ln2$. La simplification n’ajoute pas les nombres négatifs au domaine initial.`),
  ]),
  ex(7, "Inéquations simples", String.raw`Résous dans $\mathbb R$.`, [
    written("a", String.raw`$\ln(2+3x)<\ln(x-1)$.`, String.raw`Il faut $2+3x>0$ et $x-1>0$, donc $x>1$. Comme $\ln$ est croissante, l’inégalité équivaut à $2+3x<x-1$, soit $x<-3/2$. Cette condition est incompatible avec $x>1$. **$S=\varnothing$.**`),
    written("b", String.raw`$\ln(-x)\ge0$.`, String.raw`Le domaine est $x<0$. En comparant à $\ln1=0$, on obtient $-x\ge1$, donc $x\le-1$. Toutes ces valeurs sont dans le domaine. **$S=]-\infty;-1]$.**`),
  ]),
  ex(8, "Inéquations avec un argument composé", String.raw`Résous dans $\mathbb R$.`, [
    written("a", String.raw`$\ln(1-x^2)>1$.`, String.raw`Il faut $1-x^2>0$, donc $-1<x<1$. Or $1-x^2\le1$, d’où $\ln(1-x^2)\le\ln1=0$. Le logarithme ne peut donc pas être supérieur à $1$. **$S=\varnothing$.**`),
    written("b", String.raw`$\ln(x^2-4e^2)<1+\ln(3x)$.`, String.raw`Le domaine impose $x^2-4e^2>0$ et $3x>0$, donc $x>2e$. Avec $1=\ln e$, le membre de droite devient $\ln(3ex)$.

La croissance du logarithme donne $x^2-4e^2<3ex$, soit $(x-4e)(x+e)<0$. Cette inégalité est vérifiée pour $-e<x<4e$. En l’intersectant avec le domaine : **$S=]2e;4e[$.**`),
  ]),
  ex(9, "Reconnaître les limites de référence", "Dans chaque cas, une seule limite est correcte.", [
    choice("1", String.raw`$\displaystyle\lim_{x\to0^+}(1+\ln x)$.`, ["$1$", "$+\\infty$", "$-\\infty$"], 2, String.raw`$\ln x\to-\infty$ en $0^+$. Ajouter $1$ ne change pas cette limite : **$-\infty$, réponse C.**`),
    choice("2", String.raw`$\displaystyle\lim_{x\to+\infty}\frac{\ln x}x$.`, ["$0$", "$+\\infty$", "$1$"], 0, String.raw`C’est une limite de référence du cours : le logarithme croît moins vite que $x$. **La limite est $0$, réponse A.**`),
    choice("3", String.raw`$\displaystyle\lim_{x\to0^+}\left(x+\frac1{\ln x}\right)$.`, ["$0$", "$+\\infty$", "$-\\infty$"], 0, String.raw`$x\to0$ et $\ln x\to-\infty$, donc $1/\ln x\to0$. La somme tend vers **$0$, réponse A.**`),
    choice("4", String.raw`$\displaystyle\lim_{x\to1}\frac{\ln x}{x-1}$.`, ["$-1$", "$1$", "$0$"], 1, String.raw`C’est le taux d’accroissement de $\ln$ en $1$, dont la limite est $\ln'(1)=1$. **Réponse B.**`),
  ]),
  ex(10, "Limites en l’infini", "Calcule les limites suivantes.", [
    limit("a", String.raw`$\displaystyle\lim_{x\to+\infty}\frac x{\ln x}$.`, "+infini", String.raw`Pour $x>1$, $(\ln x)/x>0$ et ce quotient tend vers $0$. Son inverse $x/\ln x$ tend donc vers **$+\infty$**.`),
    limit("b", String.raw`$\displaystyle\lim_{x\to+\infty}(x-\ln x)$.`, "+infini", String.raw`On factorise : $x-\ln x=x(1-(\ln x)/x)$. Le premier facteur tend vers $+\infty$ et la parenthèse vers $1>0$. **La limite est $+\infty$.**`),
    limit("c", String.raw`$\displaystyle\lim_{x\to+\infty}\frac{\ln x}{x^3}$.`, "0", String.raw`On écrit $(\ln x)/x^3=((\ln x)/x)\times(1/x^2)$. Les deux facteurs tendent vers $0$. **La limite est $0$.**`),
  ]),
  ex(11, "Changements de variable et taux d’accroissement", "Calcule les limites suivantes, en respectant les domaines.", [
    limit("a", String.raw`$\displaystyle\lim_{x\to0^+}\ln\left(\frac{x+1}x\right)$.`, "+infini", String.raw`Près de $0$, le domaine impose $x>0$. On a $(x+1)/x=1+1/x\to+\infty$. Par composition avec la limite du logarithme en $+\infty$, **la limite vaut $+\infty$**.`),
    limit("b", String.raw`$\displaystyle\lim_{x\to1}\frac{\ln x}{1-x^2}$.`, "-1/2", String.raw`Pour $x\ne1$, $1-x^2=-(x-1)(x+1)$, donc :

$$\frac{\ln x}{1-x^2}=-\frac{\ln x}{x-1}\frac1{x+1}.$$

Le premier quotient tend vers $1$ et $1/(x+1)$ vers $1/2$. **La limite est $-1/2$.**`),
    limit("c", String.raw`$\displaystyle\lim_{x\to0^+}\sqrt x\ln x$.`, "0", String.raw`Posons $t=\sqrt x$. Alors $x=t^2$, $t\to0^+$ et $\ln x=2\ln t$. L’expression devient $2t\ln t$, qui tend vers **$0$** par la limite de référence.`),
  ]),
];
