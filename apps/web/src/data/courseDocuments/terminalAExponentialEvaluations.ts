import type {CourseDocumentQuestion,CourseEvaluationGroup,CourseWrittenTask} from "../../domain/courseDocument";
import {exponentialFirstStudy,exponentialSecondStudy} from "./terminalAExponentialStudies";
const r=String.raw;
const q=(id:string,prompt:string,accepted:string[],correction:string,topicId:string):CourseDocumentQuestion=>({id:"ta-exp-"+id,label:id,prompt,answer:{kind:"short",accepted},expected:accepted[0],correction,topicId,points:1});
const w=(id:string,prompt:string,model:string,criteria:string[],topicId:string):CourseWrittenTask=>({id:"ta-exp-writing-"+id,prompt,model,criteria,topicId});
export const terminalAExponentialEvaluations:CourseEvaluationGroup[]=[
 {id:"ta-exp-eval-basics",title:"Définition et réciprocité",pages:[1,2],method:"L’exponentielle accepte tout réel et donne un nombre positif. Le logarithme et l’exponentielle se simplifient en respectant le domaine du logarithme.",examples:[],questions:[
  q("1.1",r`La fonction $x\mapsto e^x$ est définie sur $\mathbb R$. Vrai ou faux ?`,["Vrai","V"],r`Tout réel peut être un exposant. Le domaine de l’exponentielle est donc bien $\boxed{\mathbb R}$.`,"ta-exp-definition"),
  q("1.2",r`$e^{-10}$ est négatif. Vrai ou faux ?`,["Faux","F"],r`L’exponentielle est toujours positive. De plus, $e^{-10}=1/e^{10}>0$. L’exposant est négatif, pas le résultat.`,"ta-exp-definition"),
  q("1.3",r`$e^0=0$. Vrai ou faux ?`,["Faux","F"],r`La valeur de référence est $e^0=1$. Elle se retrouve avec $e^{\ln1}=1$ et $\ln1=0$.`,"ta-exp-definition"),
  q("1.4",r`$e^{\ln12}=\ln12$. Vrai ou faux ?`,["Faux","F"],r`Comme $12>0$, $e^{\ln12}=12$, et non $\ln12$. L’exponentielle annule ici l’effet du logarithme.`,"ta-exp-definition"),
  q("1.5",r`$\ln(e^{51})=51$. Vrai ou faux ?`,["Vrai","V"],r`L’identité $\ln(e^a)=a$ s’applique à tout réel $a$. Avec $a=51$, le résultat est bien $51$.`,"ta-exp-definition"),
  q("1.6",r`Calculer $\ln(e^8)$.`,["8"],r`On applique directement $\ln(e^a)=a$ avec $a=8$ : la réponse est $\boxed8$.`,"ta-exp-definition"),
  q("1.7",r`Calculer $\ln(e^{-5})$.`,["-5"],r`Le nombre $e^{-5}$ est positif, donc son logarithme existe. Par réciprocité, le résultat vaut $\boxed{-5}$.`,"ta-exp-definition"),
  q("1.8",r`Calculer $e^{\ln3}$.`,["3"],r`Comme $3>0$, $e^{\ln3}=3$. La condition de positivité de l’argument du logarithme est bien vérifiée.`,"ta-exp-definition"),
  q("1.9",r`Calculer $e^{-\ln2}$.`,["1/2","0,5"],r`On écrit $e^{-\ln2}=1/e^{\ln2}$. Le dénominateur vaut $2$, donc le résultat est $\boxed{1/2}$.`,"ta-exp-definition"),
 ]},
 {id:"ta-exp-eval-algebra",title:"Simplifier les expressions",pages:[2,7,9],method:"Pour un produit, additionne les exposants ; pour un quotient, soustrais l’exposant entier du dénominateur. Réserve ces règles aux produits, pas aux sommes.",examples:[],questions:[
  q("2.1",r`Écrire $e^6e^{-4}=e^k$. Donner $k$.`,["2"],r`Dans un produit, on additionne : $6+(-4)=2$, donc $e^6e^{-4}=e^2$ et $\boxed{k=2}$.`,"ta-exp-algebra"),
  q("2.2",r`Écrire $(e^{-2})^4=e^k$. Donner $k$.`,["-8"],r`On multiplie les exposants : $(-2)\times4=-8$. Le résultat est $e^{-8}$, d’où $\boxed{k=-8}$.`,"ta-exp-algebra"),
  q("2.3",r`Écrire $e^4/e^{-5}=e^k$. Donner $k$.`,["9"],r`On soustrait l’exposant du dénominateur : $4-(-5)=9$. Donc le quotient vaut $e^9$ et $\boxed{k=9}$.`,"ta-exp-algebra"),
  q("2.4",r`Simplifier $(e^x+e^{-x})^2-(e^x-e^{-x})^2$.`,["4"],r`Avec $a=e^x$ et $b=e^{-x}$, l’identité donne $4ab=4e^xe^{-x}=4e^0=\boxed4$.`,"ta-exp-algebra"),
 ]},
 {id:"ta-exp-eval-limits",title:"Calculer des limites",pages:[3,8],method:"Appuie chaque calcul sur une limite de référence. En cas de différence de deux infinis, factorise avant de conclure.",examples:[],questions:[
  q("3.1",r`Calculer $\lim_{x\to-\infty}(e^x+3)$.`,["3"],r`À gauche, $e^x\to0$. La somme tend donc vers $0+3=\boxed3$.`,"ta-exp-limits"),
  q("3.2",r`Calculer $\lim_{x\to-\infty}2xe^x$.`,["0"],r`La limite de référence donne $xe^x\to0$ en $-\infty$. En multipliant par $2$, on obtient encore $\boxed0$.`,"ta-exp-limits"),
  q("3.3",r`Calculer $\lim_{x\to+\infty}(2x-1-e^x)$.`,["-infini","-∞"],r`On écrit $x(2-1/x-e^x/x)$. Comme $e^x/x\to+\infty$, la parenthèse tend vers $-\infty$. Le facteur $x\to+\infty$ est positif : la limite est $\boxed{-\infty}$.`,"ta-exp-limits"),
  q("3.4",r`Calculer $\lim_{x\to0}\left(2\frac{e^x-1}{x}+x^2\right)$.`,["2"],r`Le quotient $(e^x-1)/x$ tend vers $1$ et $x^2\to0$. La limite vaut donc $2\times1+0=\boxed2$.`,"ta-exp-limits"),
 ]},
 {id:"ta-exp-eval-equations",title:"Résoudre les équations",pages:[4,5],method:"Après X = e puissance x, garde uniquement les valeurs X strictement positives. Termine toujours en revenant à x.",examples:[],questions:[
  q("4.1",r`Résoudre $e^{2x-1}=e^{x+5}$. Donner $x$.`,["6"],r`L’injectivité permet d’égaler les exposants : $2x-1=x+5$. En isolant $x$, on obtient $\boxed6$.`,"ta-exp-equations"),
  q("4.2",r`Dans $e^{2x}+e^x-6=0$, on pose $X=e^x$. Donner la racine positive du trinôme en $X$.`,["2"],r`On obtient $X^2+X-6=(X+3)(X-2)=0$. Les racines sont $-3$ et $2$, mais $X=e^x>0$. Seule $\boxed2$ reste possible.`,"ta-exp-substitution"),
  q("4.3",r`L’équation $e^x=-3$ admet une solution réelle. Vrai ou faux ?`,["Faux","F"],r`Pour tout réel $x$, $e^x>0$. L’exponentielle ne peut donc pas être égale à un nombre négatif.`,"ta-exp-substitution"),
 ],writtenTasks:[w("equations",r`Résoudre séparément $e^{x-2}=5$ et $e^{2x}+e^x-6=0$.`,r`**Première équation.** Le nombre $5$ est positif. On prend les logarithmes : $x-2=\ln5$, d’où $\boxed{x=2+\ln5}$.

**Deuxième équation.** Posons $X=e^x>0$. L’équation devient $X^2+X-6=0$, soit $(X+3)(X-2)=0$.

La racine $-3$ est exclue car $X$ doit être positif. Il reste $e^x=2$, donc $\boxed{x=\ln2}$. Chaque équation a une seule solution réelle. Ne pas confondre la valeur intermédiaire $X=2$ avec la solution finale $x=\ln2$.`,["Les deux équations sont traitées séparément.","Le changement d’inconnue est posé avec X > 0.","La racine négative est écartée.","Le retour à x est effectué."],"ta-exp-substitution")]},
 {id:"ta-exp-eval-inequalities",title:"Inéquations et étude de signe",pages:[5,7,9,10],method:"Pour le trinôme, travaille avec X > 0. Pour le quotient, les zéros du dénominateur sont exclus même si l’inégalité est large.",examples:[],questions:[
  q("5.1",r`Le trinôme $X^2-5X+6$ a deux racines. Donner la plus petite.`,["2"],r`On factorise $X^2-5X+6=(X-2)(X-3)$. Les racines sont $2$ et $3$ ; la plus petite est $\boxed2$.`,"ta-exp-inequalities"),
  q("5.2",r`Donner la plus grande racine du même trinôme.`,["3"],r`Le facteur $X-3$ s’annule en $3$. C’est la plus grande des deux racines, d’où $\boxed3$.`,"ta-exp-inequalities"),
  q("5.3",r`Pour quelle valeur de $x$ l’expression $e^{2x}+e^x-2$ est-elle nulle ?`,["0"],r`L’expression vaut $(e^x+2)(e^x-1)$. Le premier facteur est positif ; il faut $e^x=1$, donc $\boxed{x=0}$. Le signe est négatif avant $0$, positif après.`,"ta-exp-signs"),
 ],writtenTasks:[
  w("inequality",r`Résoudre $e^{2x}-5e^x+6\geq0$.`,r`Posons $X=e^x$, avec $X>0$. On factorise : $X^2-5X+6=(X-2)(X-3)$.

Le produit est positif ou nul pour $X\leq2$ ou $X\geq3$. En gardant $X>0$, cela donne $0<X\leq2$ ou $X\geq3$.

On revient à $x$ : $e^x\leq2$ ou $e^x\geq3$. La croissance de l’exponentielle donne :
$$\boxed{S=]-\infty;\ln2]\cup[\ln3;+\infty[}.$$
Les deux bornes sont incluses car elles annulent le trinôme.`,["Le terme constant +6 est conservé.","X > 0 est indiqué.","Le signe du produit est correctement étudié.","Les bornes ln 2 et ln 3 sont incluses."],"ta-exp-inequalities"),
  w("rational-inequality",r`Résoudre $\dfrac{x^2+x-2}{e^{2x}-1}\geq0$.`,r`Le dénominateur est nul si $e^{2x}=1$, donc si $x=0$. Cette valeur est exclue.

Le numérateur est $(x+2)(x-1)$. Il est positif avant $-2$ et après $1$, négatif entre ces deux valeurs. Le dénominateur $e^{2x}-1$ a le signe de $x$.

Le quotient est donc négatif sur $]-\infty;-2[$, positif sur $]-2;0[$, négatif sur $]0;1[$, puis positif sur $]1;+\infty[$. Il est nul en $-2$ et en $1$.

Finalement $\boxed{S=[-2;0[\cup[1;+\infty[}$. L’inégalité large autorise les zéros du numérateur, mais jamais le zéro du dénominateur.`,["Le pôle x = 0 est exclu.","Le numérateur est factorisé.","Les signes sont comparés sur les quatre intervalles.","Les bornes −2 et 1 sont incluses, 0 est exclu."],"ta-exp-signs"),
 ]},
 {id:"ta-exp-eval-derivatives",title:"Calculer une dérivée",pages:[6,8,9],method:"Pour e puissance u, multiplie par u′. Pour un produit, dérive les deux facteurs à tour de rôle puis simplifie.",examples:[],questions:[
  q("6.1",r`Pour $f(x)=e^{-4x+3}$, écrire $f'(x)=a e^{-4x+3}$. Donner $a$.`,["-4"],r`L’exposant a pour dérivée $-4$. La règle donne $f'(x)=-4e^{-4x+3}$, donc $\boxed{a=-4}$.`,"ta-exp-composite"),
  q("6.2",r`Pour $h(x)=(2x+1)e^x$, calculer $h'(0)$.`,["3"],r`La dérivée du produit est $(2x+3)e^x$. En $0$, elle vaut $3e^0=\boxed3$.`,"ta-exp-composite"),
  q("6.3",r`Pour $k(x)=(1-x)e^x$, calculer $k'(1)$. Répondre par un multiple de $e$.`,["-e","−e"],r`On dérive : $k'(x)=-e^x+(1-x)e^x=-xe^x$. En $1$, cela donne $\boxed{-e}$.`,"ta-exp-composite"),
  q("6.4",r`Pour $m(x)=xe^{-2x}$, calculer $m'(0)$.`,["1"],r`La règle du produit donne $m'(x)=e^{-2x}-2xe^{-2x}=(1-2x)e^{-2x}$. En $0$, la valeur est $\boxed1$.`,"ta-exp-composite"),
 ],writtenTasks:[w("product-derivative",r`Dériver $h(x)=(2x+1)e^x$ sur $\mathbb R$.`,r`Les deux facteurs sont dérivables sur $\mathbb R$. On pose $u(x)=2x+1$ et $v(x)=e^x$ ; alors $u'(x)=2$ et $v'(x)=e^x$.

La dérivée du produit est $u'v+uv'$, donc :
$$h'(x)=2e^x+(2x+1)e^x.$$
On met $e^x$ en facteur : $2+(2x+1)=2x+3$. Finalement $\boxed{h'(x)=(2x+3)e^x}$. On ne dérive pas un produit en multipliant simplement les deux dérivées.`,["Les deux facteurs sont identifiés.","La formule du produit est utilisée.","Les deux termes sont présents.","La simplification finale est correcte."],"ta-exp-composite")]},
 {id:"ta-exp-eval-advertising",title:"La campagne publicitaire",pages:[6,7],statement:r`Le modèle est $P(t)=1-e^{-0,21t}$ pour $t\geq0$, où $t$ est en jours. L’objectif est d’informer au moins $90\,\%$ de la population.`,method:"Isole l’exponentielle puis prends les logarithmes. La division par −0,21 inverse l’inégalité ; arrondis vers le haut pour une durée entière suffisante.",examples:[],questions:[
  q("7.1","Quel est le premier nombre entier de jours suffisant ?",["11"],r`Le seuil est $\ln(0,1)/(-0,21)\approx10,9647$ jours. Le premier entier supérieur ou égal à ce seuil est $\boxed{11}$.`,"ta-exp-advertising"),
  q("7.2",r`Calculer $P(10)$, arrondi à quatre décimales.`,["0,8775"],r`$P(10)=1-e^{-2,1}\approx0,8775436$, soit $\boxed{0,8775}$. Dix jours n’atteignent pas encore $90\,\%$.`,"ta-exp-advertising"),
  q("7.3",r`Calculer $P(11)$, arrondi à quatre décimales.`,["0,9007"],r`$P(11)=1-e^{-2,31}\approx0,9007387$, soit $\boxed{0,9007}$. Le seuil de $90\,\%$ est atteint.`,"ta-exp-advertising"),
 ],writtenTasks:[w("advertising",r`Justifier le nombre de jours entiers nécessaire pour avoir $P(t)\geq0,90$.`,r`L’objectif équivaut à $1-e^{-0,21t}\geq0,90$, puis à $e^{-0,21t}\leq0,10$.

Les deux membres sont positifs, donc on peut prendre leurs logarithmes sans changer le sens : $-0,21t\leq\ln(0,10)$.

On divise par $-0,21$, qui est négatif :
$$t\geq\frac{\ln(0{,}10)}{-0{,}21}\approx10{,}9647.$$
Le minimum entier est $11$. La vérification donne $P(10)\approx0,8775$ et $P(11)\approx0,9007$ : il faut bien $\boxed{11}$ jours entiers dans le modèle.`,["L’objectif est une inégalité, pas un arrondi à l’entier le plus proche.","Le logarithme est pris de nombres positifs.","L’inégalité est inversée en divisant par un négatif.","Les deux journées voisines confirment le minimum."],"ta-exp-advertising")]},
 {id:"ta-exp-eval-first-study",title:"Étude de 1 − x + e puissance x",pages:[10,11,12],statement:r`On pose $f(x)=1-x+e^x$ sur $\mathbb R$. La droite $\Delta$ a pour équation $y=-x+1$.`,method:"Relie limites, différence avec la droite et signe de f′. Dans le tableau numérique, arrondis seulement le résultat final.",examples:[exponentialFirstStudy],questions:[
  q("8.1",r`Donner la limite de $f$ en $-\infty$.`,["+infini","+∞","infini"],r`Le terme $1-x$ tend vers $+\infty$ tandis que $e^x\to0$. Leur somme tend vers $\boxed{+\infty}$.`,"ta-exp-first-study"),
  q("8.2","Donner l’abscisse du minimum de f.",["0"],r`La dérivée $f'(x)=e^x-1$ est négative pour $x<0$ et positive pour $x>0$. Le minimum est donc atteint en $\boxed{x=0}$.`,"ta-exp-first-study"),
  q("8.3","Donner la valeur du minimum.",["2"],r`On calcule $f(0)=1-0+e^0=1+1=\boxed2$. Le changement de signe de la dérivée confirme le minimum.`,"ta-exp-first-study"),
  q("8.4",r`Calculer $f(-2)$, arrondi au centième.`,["3,14"],r`$f(-2)=1+2+e^{-2}=3+e^{-2}\approx3,135335$. L’arrondi au centième est $\boxed{3,14}$.`,"ta-exp-first-study"),
  q("8.5",r`Calculer $f(2)$, arrondi au centième.`,["6,39"],r`$f(2)=1-2+e^2=-1+e^2\approx6,389056$. On obtient $\boxed{6,39}$ au centième.`,"ta-exp-first-study"),
 ],writtenTasks:[w("asymptote",r`Démontrer que $y=-x+1$ est asymptote en $-\infty$ et préciser la position de la courbe.`,r`On soustrait l’expression de la droite à celle de la fonction :
$$f(x)-(-x+1)=e^x.$$
Cette différence tend vers $0$ lorsque $x\to-\infty$. La droite est donc asymptote oblique à la courbe en $-\infty$.

Pour la position relative, on ne prend plus seulement la limite : on étudie le signe de la différence. Or $e^x>0$ pour tout réel $x$. La courbe est donc **strictement au-dessus** de la droite sur $\mathbb R$, même si l’écart devient très petit à gauche.`,["La différence fonction moins droite est calculée.","Sa limite est nulle en −∞.","Le signe strictement positif est justifié.","La position au-dessus est donnée sur R."],"ta-exp-first-study")]},
 {id:"ta-exp-eval-second-study",title:"Étude de (−2x + 3)e puissance x",pages:[12,13,14],statement:r`On étudie $g(x)=(-2x+3)e^x$ sur $]-\infty;2]$.`,method:"L’exponentielle étant positive, le signe de g′ vient de 1 − 2x. Respecte la borne finale 2 dans le tableau et la courbe.",examples:[exponentialSecondStudy],questions:[
  q("9.1",r`Calculer la limite de $g$ en $-\infty$.`,["0"],r`On développe $g(x)=-2xe^x+3e^x$. Les deux termes tendent vers $0$, donc $\boxed{g(x)\to0}$.`,"ta-exp-second-study"),
  q("9.2","Donner l’abscisse du maximum de g.",["1/2","0,5"],r`$g'(x)=(1-2x)e^x$ est positive avant $1/2$ et négative après. Le maximum est atteint en $\boxed{x=1/2}$.`,"ta-exp-second-study"),
  q("9.3","La courbe coupe l’axe des abscisses en A. Donner l’abscisse de A.",["3/2","1,5"],r`L’équation $(-2x+3)e^x=0$ impose $-2x+3=0$ car $e^x>0$. Donc $\boxed{x_A=3/2}$.`,"ta-exp-second-study"),
  q("9.4","La courbe coupe l’axe des ordonnées en B. Donner l’ordonnée de B.",["3"],r`Sur cet axe, $x=0$. On calcule $g(0)=3e^0=\boxed3$, donc $B(0;3)$.`,"ta-exp-second-study"),
  q("9.5",r`Calculer $g(2)$, arrondi au dixième.`,["-7,4"],r`$g(2)=(-4+3)e^2=-e^2\approx-7,389056$. L’arrondi au dixième est $\boxed{-7,4}$.`,"ta-exp-second-study"),
 ],writtenTasks:[w("second-variations",r`Dériver g et dresser son tableau de variations sur $]-\infty;2]$.`,r`Par la règle du produit : $g'(x)=-2e^x+(-2x+3)e^x=(1-2x)e^x$.

Comme $e^x>0$, la dérivée est positive pour $x<1/2$, nulle en $1/2$ et négative pour $1/2<x\leq2$.

| $x$ | $-\infty$ | $1/2$ | $2$ |
|---|---|---|---|
| $g'(x)$ | $+$ | $0$ | $-$ |
| $g(x)$ | $0\;\nearrow$ | $2\sqrt e$ | $\searrow\;-e^2$ |

Ainsi $g$ croît sur $]-\infty;1/2]$, puis décroît sur $[1/2;2]$. On s’arrête en $2$, conformément à l’intervalle demandé.`,["La règle du produit est appliquée.","Le signe de l’exponentielle est utilisé.","Le signe négatif après 1/2 n’est pas oublié.","Les valeurs et la borne finale 2 sont présentes."],"ta-exp-second-study")]},
 {id:"ta-exp-eval-a1",title:"Compléments de calcul — Terminale A1",pages:[6,8,10],method:"Ces applications sont réservées à A1 dans le support. Pour les primitives, dérive ta proposition ; pour les limites, simplifie le quotient avant de conclure.",examples:[],questions:[],writtenTasks:[
  w("a1-primitives",r`Déterminer les primitives de $e^{-3x+7}$ et de $xe^{x^2}$ sur $\mathbb R$.`,r`**Première fonction.** La dérivée de l’exposant $-3x+7$ est $-3$. On prend donc :
$$F(x)=-\frac13e^{-3x+7}+C.$$
En dérivant, le coefficient $-1/3$ multiplie $-3$, ce qui redonne $e^{-3x+7}$.

**Deuxième fonction.** La dérivée de $x^2$ est $2x$. La fonction donnée vaut la moitié de $2xe^{x^2}$, donc :
$$G(x)=\frac12e^{x^2}+C.$$
Dans chaque famille, $C$ est une constante réelle arbitraire ; les constantes des deux familles peuvent être différentes.`,["Les deux exposants sont identifiés.","Le coefficient −1/3 est justifié.","Le coefficient 1/2 est justifié.","Les primitives sont vérifiées et les constantes sont présentes."],"ta-exp-primitives"),
  w("a1-log-primitive",r`Donner une primitive de $e^{2x}/(1+e^{2x})$ sur $\mathbb R$.`,r`Posons $u(x)=1+e^{2x}$. Cette fonction est strictement positive sur $\mathbb R$ et $u'(x)=2e^{2x}$.

La fonction donnée est donc $\frac12u'/u$. Une primitive est :
$$\boxed{F(x)=\frac12\ln(1+e^{2x})}.$$
En effet, sa dérivée vaut $\frac12\times2e^{2x}/(1+e^{2x})$, soit exactement la fonction de départ. On peut ajouter une constante réelle pour obtenir toutes les primitives.`,["La positivité de u est contrôlée.","u′ est calculée.","Le facteur 1/2 est présent.","Une vérification par dérivation termine le raisonnement."],"ta-exp-primitives"),
  w("a1-quotient-limits",r`Calculer les limites de $(e^x+1)/(e^x+2)$ aux deux infinis.`,r`Le dénominateur est toujours strictement positif.

En $+\infty$, le quotient initial a la forme indéterminée $\infty/\infty$. On divise le numérateur et le dénominateur par $e^x$ :
$$\frac{e^x+1}{e^x+2}=\frac{1+e^{-x}}{1+2e^{-x}}\longrightarrow\boxed1.$$
En $-\infty$, il n’y a pas de forme indéterminée : $e^x\to0$. Le quotient initial tend directement vers $(0+1)/(0+2)=\boxed{1/2}$.`,["Le dénominateur ne s’annule pas.","La forme indéterminée est identifiée à droite.","La division par e puissance x est correcte.","La limite à gauche est calculée directement."],"ta-exp-a1-quotients"),
 ]},
];
