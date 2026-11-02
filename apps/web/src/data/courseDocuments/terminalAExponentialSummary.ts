import type {CourseDocumentSection,CourseDocumentTopic,CourseWorkedExample} from "../../domain/courseDocument";
import {exponentialFirstStudy,exponentialSecondStudy} from "./terminalAExponentialStudies";
export const expExample=(id:string,title:string,parts:[string,string,string][]):CourseWorkedExample=>({id,title,prompt:"",parts:parts.map(([label,prompt,solution],i)=>({id:id+"-"+(i+1),label,prompt,solution}))});
const e=expExample,r=String.raw;
const t=(id:string,title:string,pages:number[],body:string,examples:CourseWorkedExample[]=[]):CourseDocumentTopic=>({id,title,pages,body,examples});

export const terminalAExponentialSections:CourseDocumentSection[]=[
 {id:"ta-exp-basics",numeral:"I",title:"Définition et propriétés algébriques",topics:[
  t("ta-exp-definition","Comprendre le lien entre exp et ln",[1,2],r`La fonction **exponentielle népérienne**, notée $\exp$, est la fonction réciproque du logarithme népérien. Pour tout réel $x$, on écrit aussi $\exp(x)=e^x$.

Elle associe à chaque réel $x$ l’unique nombre **strictement positif** dont le logarithme vaut $x$.

| Propriété | Conditions |
|---|---|
| $\ln a=b\iff a=e^b$ | $a>0$, $b\in\mathbb R$ |
| $\ln(e^x)=x$ | tout réel $x$ |
| $e^{\ln a}=a$ | $a>0$ |
| $e^0=1$ et $e^1=e$ | valeurs de référence |
| $e^x>0$ | tout réel $x$ |

Le domaine de l’exponentielle est $\mathbb R$. Un exposant négatif ne rend pas l’exponentielle négative : par exemple $e^{-10}=1/e^{10}>0$.`,[
   e("ta-exp-reciprocal-example","Calculer quatre nombres",[
    ["a)",r`Calculer $A=\ln(e^8)$.`,r`Le logarithme et l’exponentielle sont réciproques : $\ln(e^a)=a$. Avec $a=8$, on obtient $\boxed{A=8}$.`],
    ["b)",r`Calculer $B=\ln(e^{-5})$.`,r`Même si l’exposant est négatif, $e^{-5}>0$ : le logarithme existe. La même identité donne $\boxed{B=-5}$.`],
    ["c)",r`Calculer $C=e^{\ln3}$.`,r`Le nombre $3$ est positif. On applique $e^{\ln a}=a$ avec $a=3$, donc $\boxed{C=3}$.`],
    ["d)",r`Calculer $D=e^{-\ln2}$.`,r`On peut écrire $-\ln2=\ln(1/2)$. Ainsi $D=e^{\ln(1/2)}=\boxed{1/2}$. On peut aussi utiliser $e^{-\ln2}=1/e^{\ln2}=1/2$.`],
   ]),
  ]),
  t("ta-exp-algebra","Calculer avec les exposants",[2,7,9],r`Pour tous réels $a,b$ et tout rationnel $r$ :

| Opération | Règle |
|---|---|
| Produit | $e^ae^b=e^{a+b}$ |
| Quotient | $e^a/e^b=e^{a-b}$ |
| Puissance | $(e^a)^r=e^{ar}$ |
| Inverse | $1/e^a=e^{-a}$ |

Dans un produit, on **additionne** les exposants. Dans un quotient, on **soustrait tout l’exposant du dénominateur**, avec ses signes. Ces règles ne s’appliquent pas à une somme : $e^a+e^b$ n’est pas $e^{a+b}$.`,[
   e("ta-exp-powers-example","Écrire sous la forme e puissance k",[
    ["a)",r`Simplifier $E=e^6e^{-4}$.`,r`On additionne les exposants : $6+(-4)=2$. Donc $\boxed{E=e^2}$.`],
    ["b)",r`Simplifier $F=(e^{-2})^4$.`,r`L’exposant de la puissance multiplie l’exposant initial : $(-2)\times4=-8$. Donc $\boxed{F=e^{-8}}$.`],
    ["c)",r`Simplifier $G=e^4/e^{-5}$.`,r`On soustrait l’exposant du dénominateur : $4-(-5)=9$. Ainsi $\boxed{G=e^9}$.`],
    ["d)",r`Simplifier $A=\dfrac{e^{5x}e^{-2x}}{e^{-x+2}}$.`,r`Le numérateur vaut $e^{5x-2x}=e^{3x}$. Au quotient, on retire **tout** $-x+2$ :
$$3x-(-x+2)=4x-2.$$
Donc $\boxed{A=e^{4x-2}}$.`],
   ]),
   e("ta-exp-identities-example","Utiliser une identité remarquable",[
    ["a)",r`Simplifier $(e^{2x})^2(e^{-x})^2$.`,r`Les deux puissances valent $e^{4x}$ et $e^{-2x}$. Leur produit vaut $e^{4x-2x}=\boxed{e^{2x}}$.`],
    ["b)",r`Simplifier $(e^x+e^{-x})^2-(e^x-e^{-x})^2$.`,r`Avec $a=e^x$ et $b=e^{-x}$, l’identité $(a+b)^2-(a-b)^2=4ab$ donne :
$$4e^xe^{-x}=4e^0=\boxed4.$$
Le résultat ne dépend pas de $x$.`],
   ]),
  ]),
 ]},
 {id:"ta-exp-limits-variation",numeral:"II",title:"Limites, variations et courbe",topics:[
  t("ta-exp-limits","Les limites de référence",[2,3,8],r`| Lorsque… | Résultat |
|---|---|
| $x\to+\infty$ | $e^x\to+\infty$ |
| $x\to-\infty$ | $e^x\to0$ |
| $x\to+\infty$ | $e^x/x\to+\infty$ |
| $x\to-\infty$ | $xe^x\to0$ |

À droite, l’exponentielle l’emporte sur $x$. À gauche, elle se rapproche de $0$ assez vite pour que $xe^x$ tende vers $0$.

On utilise aussi, près de $0$ : $\displaystyle\lim_{x\to0}\frac{e^x-1}{x}=1$. Ce quotient correspond au nombre dérivé de l’exponentielle en $0$.`,[
   e("ta-exp-limits-example","Calculer quatre limites",[
    ["a)",r`Calculer $\lim_{x\to-\infty}(e^x+3)$.`,r`Quand $x\to-\infty$, $e^x\to0$ et la constante $3$ reste égale à $3$. Donc $\boxed{\lim_{x\to-\infty}(e^x+3)=3}$.`],
    ["b)",r`Calculer $\lim_{x\to-\infty}2xe^x$.`,r`La limite de référence donne $xe^x\to0$. Multiplier par la constante $2$ donne donc $\boxed0$.`],
    ["c)",r`Calculer $\lim_{x\to+\infty}(2x-1-e^x)$.`,r`On ne soustrait pas directement deux infinis. Pour $x>0$, on factorise :
$$2x-1-e^x=x\left(2-\frac1x-\frac{e^x}{x}\right).$$
La parenthèse tend vers $-\infty$ car $e^x/x\to+\infty$, et $x\to+\infty$. Donc la limite est $\boxed{-\infty}$.`],
    ["d)",r`Calculer $\lim_{x\to0}\left(2\frac{e^x-1}{x}+x^2\right)$.`,r`Le quotient tend vers $1$ et $x^2\to0$. La limite vaut donc $2\times1+0=\boxed2$. Il s’agit d’une limite : l’expression initiale n’est pas définie en $x=0$.`],
   ]),
  ]),
  t("ta-exp-curve","Dérivée et croissance de l’exponentielle",[3,4],r`La fonction exponentielle est dérivable sur $\mathbb R$ et :
$$\boxed{(e^x)'=e^x}.$$
Comme $e^x>0$, elle est **strictement croissante** sur $\mathbb R$.

| $x$ | $-\infty$ | $0$ | $1$ | $+\infty$ |
|---|---|---|---|---|
| Signe de la dérivée | $+$ | $+$ | $+$ | $+$ |
| $e^x$ | $0\;\nearrow$ | $1\;\nearrow$ | $e\;\nearrow$ | $+\infty$ |

La courbe passe par $(0;1)$ et $(1;e)$. Elle est toujours au-dessus de l’axe des abscisses. La droite $y=0$ est une asymptote horizontale **en $-\infty$**, sans être atteinte.`),
  t("ta-exp-simple-variation","Étudier une somme avec e puissance x",[3],r`Pour étudier une fonction, calcule sa dérivée et justifie son signe avant d’annoncer les variations.`,[
   e("ta-exp-sum-example","Étudier f(x) = 2x + e puissance x",[
    ["1.","Calculer la dérivée de f.",r`La fonction est définie sur $\mathbb R$. On dérive terme à terme : $(2x)'=2$ et $(e^x)'=e^x$, donc $\boxed{f'(x)=2+e^x}$.`],
    ["2.","Donner le sens de variation.",r`Pour tout réel $x$, $e^x>0$. Par conséquent, $2+e^x>0$. La dérivée est strictement positive : $f$ est **strictement croissante sur $\mathbb R$**.`],
   ]),
  ]),
 ]},
 {id:"ta-exp-solving",numeral:"III",title:"Équations, inéquations et signes",topics:[
  t("ta-exp-equations","Comparer les exposants ou prendre un logarithme",[4,5],r`Pour tous réels $a,b$ :
$$e^a=e^b\iff a=b.$$
Pour $k>0$, $e^u=k\iff u=\ln k$. En revanche, $e^u=0$ ou $e^u<0$ sont impossibles.

La croissance stricte donne aussi $e^a<e^b\iff a<b$, avec le même principe pour $\leq$, $>$ et $\geq$.`,[
   e("ta-exp-equations-example","Résoudre deux équations",[
    ["1)",r`Résoudre $e^{2x-1}=e^{x+5}$.`,r`Les deux expressions existent pour tout réel $x$. Par injectivité de l’exponentielle :
$$2x-1=x+5\iff x=6.$$
Ainsi $\boxed{S=\{6\}}$.`],
    ["2)",r`Résoudre $e^{x-2}=5$.`,r`Le second membre est positif. On peut écrire $5=e^{\ln5}$, puis comparer les exposants : $x-2=\ln5$. Donc $\boxed{S=\{2+\ln5\}}$.`],
   ]),
  ]),
  t("ta-exp-substitution","Poser X = e puissance x et garder X positif",[5],r`On peut remplacer $e^{2x}$ par $(e^x)^2$. Pour une équation du second degré en $e^x$, on pose :
$$X=e^x\quad\text{avec}\quad\boxed{X>0}.$$
Après résolution en $X$, on écarte les valeurs non positives. Une valeur $X=a>0$ donne ensuite $x=\ln a$.`,[
   e("ta-exp-substitution-example","Résoudre e puissance 2x + e puissance x − 6 = 0",[
    ["a)","Effectuer le changement d’inconnue.",r`Posons $X=e^x>0$. L’équation devient $X^2+X-6=0$, soit $(X+3)(X-2)=0$. Les racines sont $-3$ et $2$.`],
    ["b)","Revenir à x.",r`La valeur $X=-3$ est impossible car $X=e^x>0$. Il reste $e^x=2$, donc $x=\ln2$. L’unique solution est $\boxed{S=\{\ln2\}}$.`],
   ]),
  ]),
  t("ta-exp-inequalities","Résoudre une inéquation avec l’exponentielle",[5],r`Le logarithme est croissant sur les positifs : prendre les logarithmes des deux membres positifs ne change pas le sens. On doit ensuite surveiller le signe du nombre par lequel on divise.`,[
   e("ta-exp-inequalities-example","Deux méthodes selon la forme de l’inéquation",[
    ["1)",r`Résoudre $e^{2x-1}<8$.`,r`Les deux membres sont positifs. En prenant les logarithmes : $2x-1<\ln8$. Donc $x<(1+\ln8)/2$ et :
$$\boxed{S=\left]-\infty;\frac{1+\ln8}{2}\right[}.$$`],
    ["2)",r`Résoudre $e^{2x}-5e^x+6\geq0$.`,r`Posons $X=e^x>0$. Le trinôme vaut $(X-2)(X-3)$.

| $X$ | $]0;2[$ | $2$ | $]2;3[$ | $3$ | $]3;+\infty[$ |
|---|---|---|---|---|---|
| $(X-2)(X-3)$ | $+$ | $0$ | $-$ | $0$ | $+$ |

On retient $0<X\leq2$ ou $X\geq3$. Cela donne $e^x\leq2$ ou $e^x\geq3$, puis $x\leq\ln2$ ou $x\geq\ln3$.
$$\boxed{S=]-\infty;\ln2]\cup[\ln3;+\infty[}.$$`],
   ]),
  ]),
  t("ta-exp-signs","Étudier le signe d’un produit ou d’un quotient",[7,9,10],r`Une exponentielle est toujours positive, mais une expression comme $e^{2x}-1$ peut s’annuler. Dans un quotient, commence par exclure les zéros du dénominateur.`,[
   e("ta-exp-sign-example","Comparer trois expressions",[
    ["a)",r`Étudier le signe de $B=e^{2x}+e^x-2$.`,r`On factorise avec $X=e^x$ : $X^2+X-2=(X+2)(X-1)$. Comme $e^x+2>0$, $B$ a le signe de $e^x-1$, donc celui de $x$.

Ainsi $B<0$ pour $x<0$, $B=0$ pour $x=0$ et $B>0$ pour $x>0$.`],
    ["b)",r`Étudier le signe de $C=e^x-2e^{-x}+1$.`,r`On réduit au même dénominateur :
$$C=\frac{e^{2x}+e^x-2}{e^x}=\frac B{e^x}.$$
Le dénominateur est positif : $C$ a le même signe que $B$, donc que $x$. En particulier, les deux expressions valent bien $0$ en $x=0$.`],
    ["c)",r`Résoudre $\dfrac{x^2+x-2}{e^{2x}-1}\geq0$.`,r`Le dénominateur s’annule en $x=0$, valeur exclue. Le numérateur vaut $(x+2)(x-1)$ ; ses zéros sont $-2$ et $1$. Le dénominateur est négatif pour $x<0$ et positif pour $x>0$.

| $x$ | $]-\infty;-2[$ | $-2$ | $]-2;0[$ | $0$ | $]0;1[$ | $1$ | $]1;+\infty[$ |
|---|---|---|---|---|---|---|---|
| Quotient | $-$ | $0$ | $+$ | interdit | $-$ | $0$ | $+$ |

On garde les signes positifs et les zéros du numérateur, pas le pôle : $\boxed{S=[-2;0[\cup[1;+\infty[}$.`],
   ]),
  ]),
 ]},
 {id:"ta-exp-calculus",numeral:"IV",title:"Dérivées et primitives",topics:[
  t("ta-exp-composite","Dériver e puissance u et un produit",[5,6,8],r`Si $u$ est dérivable sur un intervalle $I$, alors $e^u$ est dérivable sur $I$ et :
$$\boxed{(e^u)'=u'e^u}.$$
On garde la même exponentielle et on multiplie par la dérivée de son exposant. Pour un produit, on utilise aussi $(uv)'=u'v+uv'$.`,[
   e("ta-exp-derivatives-example","Trois dérivées",[
    ["1)",r`Dériver $f(x)=e^{-4x+3}$.`,r`L’exposant $u(x)=-4x+3$ a pour dérivée $-4$. Donc $\boxed{f'(x)=-4e^{-4x+3}}$.`],
    ["2)",r`Dériver $g(x)=e^{x+3}-2x+5$.`,r`L’exposant $x+3$ a pour dérivée $1$. Les autres termes donnent $-2$ et $0$. Donc $\boxed{g'(x)=e^{x+3}-2}$.`],
    ["3)",r`Dériver $h(x)=(2x+1)e^x$.`,r`On dérive le produit :
$$h'(x)=2e^x+(2x+1)e^x.$$
En mettant $e^x$ en facteur, $\boxed{h'(x)=(2x+3)e^x}$.`],
   ]),
  ]),
  {...t("ta-exp-primitives","Primitives — Terminale A1",[6,8,10],r`Si $u$ est dérivable sur un intervalle, une primitive de $u'e^u$ est $e^u$. Les primitives s’obtiennent en ajoutant une constante réelle $C$.

| Fonction | Primitives |
|---|---|
| $e^x$ | $e^x+C$ |
| $e^{ax+b}$ avec $a\neq0$ | $\dfrac1a e^{ax+b}+C$ |
| $u'e^u$ | $e^u+C$ |

Vérifie toujours en dérivant : le coefficient devant l’exponentielle compense celui provenant de l’exposant.`,[
   e("ta-exp-primitives-example","Trois primitives sur R",[
    ["a)",r`Déterminer les primitives de $e^x$.`,r`L’exponentielle est sa propre dérivée. Ses primitives sont donc $\boxed{F(x)=e^x+C}$, où $C\in\mathbb R$.`],
    ["b)",r`Déterminer les primitives de $e^{-3x+7}$.`,r`La dérivée de $e^{-3x+7}$ fait apparaître $-3$. On compense par $-1/3$ :
$$\boxed{F(x)=-\frac13e^{-3x+7}+C}.$$
En dérivant, $(-1/3)\times(-3)=1$, comme attendu.`],
    ["c)",r`Déterminer les primitives de $xe^{x^2}$.`,r`On pose $u(x)=x^2$, donc $u'(x)=2x$. La fonction vaut $\frac12u'e^u$. Ses primitives sont $\boxed{F(x)=\frac12e^{x^2}+C}$, avec $C\in\mathbb R$.`],
   ]),
   e("ta-exp-mixed-primitives","Deux formes à reconnaître",[
    ["a)",r`Donner une primitive de $e^{3x}-e^{-x/2}+5$.`,r`On intègre chaque terme. Le coefficient du deuxième terme est $(-1)/(-1/2)=2$ :
$$\boxed{F(x)=\frac13e^{3x}+2e^{-x/2}+5x}.$$
La dérivée de $2e^{-x/2}$ est bien $-e^{-x/2}$.`],
    ["b)",r`Donner une primitive de $\dfrac{e^{2x}}{1+e^{2x}}$.`,r`Posons $u(x)=1+e^{2x}>0$. Alors $u'(x)=2e^{2x}$, donc la fonction vaut $\frac12u'/u$. Une primitive est $\boxed{F(x)=\frac12\ln(1+e^{2x})}$.`],
    ["c)",r`Donner une primitive de $(2x-3)e^{-x^2+3x+1}$.`,r`L’exposant $u(x)=-x^2+3x+1$ a pour dérivée $-2x+3$. Le facteur $2x-3$ est donc $-u'(x)$. La fonction est $-u'e^u$, d’où $\boxed{F(x)=-e^{-x^2+3x+1}}$.`],
   ]),
  ]),optional:true},
 ]},
 {id:"ta-exp-applications",numeral:"V",title:"Applications et études de fonctions",topics:[
  t("ta-exp-advertising","Déterminer une durée minimale",[6,7],r`Un modèle de diffusion publicitaire donne la proportion de personnes informées après $t$ jours :
$$P(t)=1-e^{-0,21t},\qquad t\geq0.$$
On cherche à atteindre **au moins 90 %** de la population. On distingue le seuil réel en jours et le premier nombre entier de jours suffisant.`,[
   e("ta-exp-advertising-example","Combien de jours de publicité ?",[
    ["1.","Traduire l’objectif.",r`La condition est $P(t)\geq0,90$, soit $1-e^{-0,21t}\geq0,90$. On isole l’exponentielle : $\boxed{e^{-0,21t}\leq0,10}$.`],
    ["2.","Résoudre l’inéquation.",r`Les deux membres sont positifs. En prenant leurs logarithmes : $-0,21t\leq\ln(0,10)$. On divise par $-0,21<0$, en inversant le sens :
$$t\geq\frac{\ln(0{,}10)}{-0{,}21}\approx10{,}9647.$$
L’égalité donne le seuil exact ; au-delà, la proportion est supérieure à $90\,\%$.`],
    ["3.","Conclure pour des journées entières.",r`Le premier entier au-dessus du seuil est $11$. Pour vérifier : $P(10)\approx0,8775<0,90$ et $P(11)\approx0,9007\geq0,90$. Il faut donc $\boxed{11}$ jours entiers dans ce modèle.`],
   ]),
  ]),
  t("ta-exp-first-study","Étude de f(x) = 1 − x + e puissance x",[10,11,12],r`On considère $f(x)=1-x+e^x$ sur $\mathbb R$ et sa courbe $\mathcal C$. On étudie aussi la droite $\Delta$ d’équation $y=-x+1$.`,[exponentialFirstStudy]),
  t("ta-exp-second-study","Étude de g(x) = (−2x + 3)e puissance x",[12,13,14],r`On étudie $g(x)=(-2x+3)e^x$ sur $]-\infty;2]$. L’expression existe sur $\mathbb R$, mais l’étude demandée est restreinte à cet intervalle.`,[exponentialSecondStudy]),
 ]},
 {id:"ta-exp-a1-extension",numeral:"VI",title:"Complément de limites — Terminale A1",topics:[
  {...t("ta-exp-a1-quotients","Comparer des expressions à l’infini",[10],r`Dans un quotient donnant une forme indéterminée, on factorise par un terme adapté. Cette partie du support est réservée à A1.`,[
   e("ta-exp-a1-limits-example","Deux quotients exponentiels",[
    ["a)",r`Calculer les limites de $h(x)=(e^x+1)/(e^x+2)$ en $+\infty$ et $-\infty$.`,r`Le dénominateur est toujours positif. En $+\infty$, on divise en haut et en bas par $e^x$ :
$$h(x)=\frac{1+e^{-x}}{1+2e^{-x}}\longrightarrow\boxed1.$$
En $-\infty$, $e^x\to0$ ; on utilise directement le quotient initial et on obtient $\boxed{1/2}$.`],
    ["b)",r`Calculer les limites de $k(x)=xe^x/(x+1)$ aux deux infinis.`,r`Le domaine est $\mathbb R\setminus\{-1\}$. Près des deux infinis, on peut écrire :
$$k(x)=\frac{e^x}{1+1/x}.$$
Le dénominateur tend vers $1$. En $+\infty$, le numérateur tend vers $+\infty$ ; la limite est donc $\boxed{+\infty}$. En $-\infty$, le numérateur tend vers $0$, donc la limite est $\boxed0$.`],
   ]),
  ]),optional:true},
 ]},
];
