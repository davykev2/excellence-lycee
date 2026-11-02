import type {CourseDocumentQuestion,CourseEvaluationGroup,CourseWrittenTask} from "../../domain/courseDocument";
import {logBacExample} from "./terminalALogarithmSummary";
const r=String.raw;
const q=(id:string,prompt:string,accepted:string[],correction:string,topicId:string):CourseDocumentQuestion=>({id:"ta-log-"+id,label:id,prompt,answer:{kind:"short",accepted},expected:accepted[0],correction,topicId,points:1});
const w=(id:string,prompt:string,model:string,criteria:string[],topicId:string):CourseWrittenTask=>({id:"ta-log-writing-"+id,prompt,model,criteria,topicId});
export const terminalALogarithmEvaluations:CourseEvaluationGroup[]=[
 {id:"ta-log-eval-basics",title:"Définition et propriétés",pages:[1,2,7],method:"Avant tout calcul, vérifie que chaque argument est strictement positif. Distingue la dérivée du logarithme et celle de la fonction 1/x.",examples:[],questions:[
  q("1.1",r`Le domaine réel de $\ln$ est $\mathbb R$. Vrai ou faux ?`,["Faux","F"],r`Le logarithme népérien est défini seulement pour un réel **strictement positif**. Son domaine est $]0;+\infty[$, pas $\mathbb R$.`,"ta-log-definition"),
  q("1.2",r`$\ln1=0$. Vrai ou faux ?`,["Vrai","V"],r`La valeur en $1$ est $0$ par définition du logarithme népérien. Le point $(1;0)$ appartient à sa courbe.`,"ta-log-definition"),
  q("1.3",r`Pour $x>0$, la dérivée de $\ln x$ vaut $1/x$. Vrai ou faux ?`,["Vrai","V"],r`C’est la propriété de dérivation de la fonction logarithme sur son domaine : $\boxed{(\ln x)'=1/x}$.`,"ta-log-definition"),
  q("1.4",r`La dérivée de $1/x$ est $\ln x$ sur $]0;+\infty[$. Vrai ou faux ?`,["Faux","F"],r`On a $(1/x)'=-1/x^2$. C’est dans l’autre sens que le logarithme intervient : **une primitive** de $1/x$ est $\ln x$.`,"ta-log-definition"),
  q("1.5","Le logarithme népérien d’un nombre négatif existe dans les réels. Vrai ou faux ?",["Faux","F"],r`L’argument doit être strictement positif. Pour un nombre négatif, le logarithme népérien réel n’est donc pas défini.`,"ta-log-definition"),
  q("1.6",r`Écrire $\ln5+\ln3=\ln k$. Donner $k$.`,["15"],r`Les arguments sont positifs. On utilise le produit : $\ln5+\ln3=\ln(5\times3)=\ln15$. Donc $\boxed{k=15}$.`,"ta-log-algebra"),
  q("1.7",r`Écrire $\ln2-\ln(0,1)=\ln k$. Donner $k$.`,["20"],r`La différence devient le logarithme du quotient : $\ln(2/0,1)=\ln20$. Donc $\boxed{k=20}$.`,"ta-log-algebra"),
  q("1.8",r`Écrire $4\ln5=\ln k$. Donner $k$.`,["625"],r`On applique la propriété de puissance : $4\ln5=\ln(5^4)=\ln625$, d’où $\boxed{k=625}$.`,"ta-log-algebra"),
 ],writtenTasks:[w("product-proof",r`Justifier que pour tout $x>1$, $\ln(x+1)+\ln(x-1)=\ln(x^2-1)$.`,r`Pour $x>1$, on a $x+1>0$ et $x-1>0$. Les deux logarithmes existent et la propriété du produit s’applique :
$$\ln(x+1)+\ln(x-1)=\ln\big((x+1)(x-1)\big).$$
Avec l’identité remarquable $(x+1)(x-1)=x^2-1$, on obtient bien :
$$\boxed{\ln(x+1)+\ln(x-1)=\ln(x^2-1)}.$$
La condition $x>1$ est importante : demander seulement $x^2-1>0$ ne suffirait pas à définir séparément les deux logarithmes de gauche.`,["La positivité des deux arguments est vérifiée.","La propriété du produit est citée.","L’identité remarquable est utilisée.","La condition x > 1 est conservée."],"ta-log-algebra")]},
 {id:"ta-log-eval-limits",title:"Calculer des limites",pages:[3],method:"Précise le sens d’approche en 0. Développe x(1 + ln x) près de 0 ; à l’infini, utilise ln x/x → 0.",examples:[],questions:[
  q("2.1",r`Calculer $\lim_{x\to0^+}(x+\ln x)$.`,["-infini","-∞"],r`Quand $x\to0^+$, $x\to0$ et $\ln x\to-\infty$. Par somme, la limite est $\boxed{-\infty}$.`,"ta-log-limits"),
  q("2.2",r`Calculer $\lim_{x\to+\infty}(x+\ln x)$.`,["+infini","+∞","infini"],r`Les deux termes tendent vers $+\infty$. Il n’y a pas de compensation : leur somme tend vers $\boxed{+\infty}$.`,"ta-log-limits"),
  q("2.3",r`Calculer $\lim_{x\to+\infty}x\left(1-\frac{\ln x}{x}\right)$.`,["+infini","+∞","infini"],r`Le quotient $\ln x/x$ tend vers $0$, donc la parenthèse tend vers $1$. Le produit de $x\to+\infty$ par ce facteur tendant vers $1$ tend vers $\boxed{+\infty}$.`,"ta-log-limits"),
  q("2.4",r`Calculer $\lim_{x\to0^+}x(1+\ln x)$.`,["0"],r`On développe pour lever la forme indéterminée :
$$x(1+\ln x)=x+x\ln x.$$
Or $x\to0$ et $x\ln x\to0$. Par somme, la limite est $\boxed0$.`,"ta-log-limits"),
 ]},
 {id:"ta-log-eval-equations",title:"Résoudre des équations",pages:[4,5],method:"Écris d’abord l’ensemble de validité. Pour un polynôme en ln x, résous en X = ln x puis reviens à x.",examples:[],questions:[
  q("3.1",r`Résoudre $\ln(2x-1)=\ln(x+5)$. Donner la valeur de $x$.`,["6"],r`Les conditions $2x-1>0$ et $x+5>0$ donnent $x>1/2$. Sur cet ensemble, l’équation équivaut à $2x-1=x+5$, donc $x=6$. Comme $6>1/2$, la réponse est $\boxed6$.`,"ta-log-equations"),
  q("3.2",r`Pour $(\ln x)^2+\ln x-6=0$, on pose $X=\ln x$. Donner la plus petite racine en $X$.`,["-3"],r`Le polynôme est $X^2+X-6=(X+3)(X-2)$. Ses racines sont $-3$ et $2$. La plus petite est $\boxed{-3}$.`,"ta-log-substitution"),
  q("3.3",r`Dans le même calcul, donner la plus grande racine en $X$.`,["2"],r`L’équation $(X+3)(X-2)=0$ donne $X=-3$ ou $X=2$. La plus grande racine est $\boxed2$. Les solutions en $x$ sont ensuite $e^{-3}$ et $e^2$.`,"ta-log-substitution"),
  q("3.4",r`Résoudre $\ln(2-x)=0$. Donner $x$.`,["1"],r`Il faut $2-x>0$, donc $x<2$. Comme $0=\ln1$, l’équation devient $2-x=1$, soit $x=1$. Cette valeur est admissible : $\boxed{x=1}$.`,"ta-log-equations"),
 ],writtenTasks:[
  w("equation-two-arguments",r`Résoudre dans $\mathbb R$ l’équation $\ln(2x^2+3)=\ln(7x)$.`,r`Le premier argument est toujours positif car $2x^2+3\geq3$. Le second impose $7x>0$, donc $V=]0;+\infty[$.

Sur cet ensemble :
$$2x^2+3=7x\iff2x^2-7x+3=0.$$
On factorise $2x^2-7x+3=(2x-1)(x-3)$. Les candidats sont $1/2$ et $3$. Tous deux sont positifs, donc :
$$\boxed{S=\{1/2;3\}}.$$`,["Les deux arguments sont contrôlés.","L’égalité des logarithmes devient une égalité des arguments.","Le trinôme est correctement résolu.","Les deux valeurs sont vérifiées dans le domaine."],"ta-log-equations"),
  w("equation-substitution",r`Résoudre $(\ln x)^2-2\ln x-3=0$.`,r`La condition d’existence est $x>0$. Posons $X=\ln x$. On résout :
$$X^2-2X-3=(X-3)(X+1)=0.$$
Donc $X=3$ ou $X=-1$. On revient à $x$ : $\ln x=3$ donne $x=e^3$ ; $\ln x=-1$ donne $x=e^{-1}$.

Ces deux nombres sont strictement positifs, donc ils sont admissibles. Finalement $\boxed{S=\{e^{-1};e^3\}}$. Les nombres $-1$ et $3$ sont des valeurs de $\ln x$, pas les solutions en $x$.`,["x > 0 est imposé.","Le changement d’inconnue est explicite.","Les deux racines sont retrouvées.","Le retour à x n’est pas oublié."],"ta-log-substitution"),
 ]},
 {id:"ta-log-eval-inequalities",title:"Résoudre des inéquations",pages:[5,7],method:"Garde le polynôme exact après X = ln x. Un tableau de signes indique les intervalles à retenir ; reviens ensuite à x en conservant x > 0.",examples:[],questions:[
  q("4.1",r`Dans $X^2-5X-6=(X+1)(X-6)$, donner la plus petite racine.`,["-1"],r`Le facteur $X+1$ s’annule pour $X=-1$. L’autre s’annule en $6$, donc la plus petite racine est $\boxed{-1}$.`,"ta-log-inequalities"),
  q("4.2",r`Dans le même polynôme, donner la plus grande racine.`,["6"],r`Le facteur $X-6$ s’annule en $X=6$. Les deux racines sont $-1$ et $6$, d’où la réponse $\boxed6$.`,"ta-log-inequalities"),
  q("4.3",r`L’inéquation $\ln x-3\geq0$ équivaut à $\ln x\geq a$. Donner $a$.`,["3"],r`On ajoute $3$ aux deux membres : $\ln x\geq3$. Donc $\boxed{a=3}$ et, en revenant à $x$, l’ensemble des solutions est $[e^3;+\infty[$.`,"ta-log-inequalities"),
  q("4.4",r`On pose $X=\ln x$ dans $2(\ln x)^2-3\ln x-2\leq0$. Donner la plus petite racine du trinôme en $X$.`,["-1/2","-0,5"],r`Le trinôme se factorise en $(2X+1)(X-2)$. Les racines sont $-1/2$ et $2$. La plus petite est $\boxed{-1/2}$.`,"ta-log-inequalities"),
  q("4.5",r`Dans le même calcul, donner la plus grande racine en $X$.`,["2"],r`Le facteur $X-2$ s’annule en $2$. C’est la plus grande des deux racines : $\boxed2$. Le trinôme est négatif ou nul entre ses racines.`,"ta-log-inequalities"),
 ],writtenTasks:[
  w("inequality-negative-six",r`Résoudre $(\ln x)^2-5\ln x-6\geq0$.`,r`Il faut $x>0$. Avec $X=\ln x$, le trinôme vaut $(X+1)(X-6)$. Ses deux racines sont $-1$ et $6$.

Le coefficient de $X^2$ est positif : le trinôme est positif ou nul à l’extérieur des racines. Donc $X\leq-1$ ou $X\geq6$.

On revient au logarithme : $\ln x\leq-1$ ou $\ln x\geq6$. Puis, en tenant compte de $x>0$ :
$$\boxed{S=]0;e^{-1}]\cup[e^6;+\infty[}.$$
Les deux bornes sont incluses car l’inégalité est large ; $0$ est toujours exclu.`,["Le domaine x > 0 est présent.","Le terme constant −6 est conservé.","Les signes sont étudiés autour de −1 et 6.","Les bornes en x et leurs inclusions sont correctes."],"ta-log-inequalities"),
  w("inequality-positive-roots",r`Résoudre $2(\ln x)^2-3\ln x-2\leq0$.`,r`Le domaine de validité est $]0;+\infty[$. Avec $X=\ln x$, on a :
$$2X^2-3X-2=(2X+1)(X-2).$$
Le produit est négatif ou nul entre les deux racines, donc $-1/2\leq X\leq2$.

Cela donne $-1/2\leq\ln x\leq2$. Le logarithme étant croissant, on obtient :
$$\boxed{S=[e^{-1/2};e^2]}.$$
Ces deux bornes sont positives et incluses : elles annulent le trinôme.`,["Le changement X = ln x est posé.","Le trinôme est factorisé.","L’intervalle entre les racines est retenu.","Le retour à x et les bornes incluses sont justifiés."],"ta-log-inequalities"),
 ]},
 {id:"ta-log-eval-calculus",title:"Dériver et reconnaître une primitive",pages:[5,6,8],method:"Pour ln(u), identifie u puis u′. Pour une primitive, ajuste le coefficient puis vérifie en dérivant.",examples:[],questions:[
  q("5.1",r`Pour $f(x)=\ln(5x+2)$, calculer $f'(1)$.`,["5/7"],r`La dérivée est $5/(5x+2)$. En $1$, le dénominateur vaut $7$, donc $\boxed{f'(1)=5/7}$.`,"ta-log-composite"),
  q("5.2",r`Pour $f(x)=\ln(x^2+2)$, calculer $f'(1)$.`,["2/3"],r`L’argument est toujours positif. Avec $u=x^2+2$ et $u'=2x$, on a $f'(x)=2x/(x^2+2)$. Donc $\boxed{f'(1)=2/3}$.`,"ta-log-composite"),
  q("5.3",r`Pour $f(x)=\ln(-3x)$ sur $]-\infty;0[$, calculer $f'(-1)$.`,["-1"],r`Sur ce domaine, $-3x>0$. On a $f'(x)=(-3)/(-3x)=1/x$, puis $\boxed{f'(-1)=-1}$.`,"ta-log-composite"),
  q("5.4",r`Pour $g(x)=\ln(2x^2-x-1)$, calculer $g'(-1)$.`,["-5/2","-2,5"],r`En $-1$, l’argument vaut $2+1-1=2>0$. La dérivée vaut $(4x-1)/(2x^2-x-1)$, donc $\boxed{g'(-1)=-5/2}$.`,"ta-log-composite"),
  q("5.5",r`Une primitive de $2/(-3x+7)$ s’écrit $a\ln(-3x+7)$ sur $]-\infty;7/3[$. Donner $a$.`,["-2/3"],r`En dérivant, le numérateur devient $-3a$. Il doit être égal à $2$, donc $-3a=2$ et $\boxed{a=-2/3}$.`,"ta-log-primitives"),
  q("5.6",r`Une primitive de $1/(2x-3)$ s’écrit $a\ln(2x-3)$ sur $]3/2;+\infty[$. Donner $a$.`,["1/2","0,5"],r`La dérivée de $a\ln(2x-3)$ est $2a/(2x-3)$. Il faut $2a=1$, d’où $\boxed{a=1/2}$.`,"ta-log-primitives"),
 ],writtenTasks:[
  w("primitive-negative-quadratic",r`Déterminer les primitives de $(-4x+5)/(-2x^2+5x-3)$ sur $]1;3/2[$.`,r`Posons $u(x)=-2x^2+5x-3=-(2x-3)(x-1)$. Sur $]1;3/2[$, $2x-3<0$ et $x-1>0$, donc $u(x)>0$.

De plus, $u'(x)=-4x+5$ : le numérateur est exactement la dérivée du dénominateur. La fonction est donc $u'/u$.

Ses primitives sont :
$$\boxed{F(x)=\ln(-2x^2+5x-3)+C},\qquad C\in\mathbb R.$$
En dérivant ce résultat, on retrouve bien la fonction de départ.`,["Le dénominateur est identifié comme u.","Sa positivité sur l’intervalle est prouvée.","Le numérateur est bien u′.","La constante et la vérification sont présentes."],"ta-log-primitives"),
  w("empty-domain",r`Peut-on dériver dans les réels $f(x)=\ln(-x^2+2x-1)$ ? Justifier.`,r`Avant de dériver, on cherche le domaine. On écrit $-x^2+2x-1=-(x-1)^2$.

Comme $(x-1)^2\geq0$, l’argument est toujours négatif ou nul. En $x=1$ il vaut $0$, ce qui ne permet pas davantage de prendre son logarithme.

Il n’existe donc **aucun réel** pour lequel l’expression soit définie. Son domaine réel est vide ; on ne lui attribue pas de dérivée réelle. Écrire seulement $u'/u$ sans vérifier $u>0$ ne serait pas valable.`,["Le domaine est vérifié avant la dérivation.","L’argument est écrit comme l’opposé d’un carré.","Le cas nul n’est pas accepté.","L’absence de dérivée réelle est clairement conclue."],"ta-log-definition"),
 ]},
 {id:"ta-log-eval-threshold",title:"Un nombre minimal d’élèves",pages:[7],statement:r`Dans un modèle théorique, la probabilité d’avoir au moins un élève non atteint de la maladie parmi $n$ élèves est $1-(0,325)^n$. On cherche le plus petit entier donnant une probabilité strictement supérieure à $0,98$.`,method:"Isole la puissance, prends les logarithmes, puis inverse le sens lorsque tu divises par ln(0,325), qui est négatif. Vérifie les deux entiers voisins.",examples:[],questions:[
  q("6.1","Quel est le nombre entier minimal demandé ?",["4"],r`On obtient $n>\ln(0,02)/\ln(0,325)\approx3,48$. Le plus petit entier qui convient est donc $\boxed4$.`,"ta-log-integer-threshold"),
  q("6.2",r`Calculer $1-(0,325)^3$, arrondi à quatre décimales.`,["0,9657"],r`$(0,325)^3=0,034328125$. On soustrait à $1$ : $0,965671875$, soit $\boxed{0,9657}$. C’est inférieur à $0,98$ : trois élèves ne suffisent pas dans le modèle.`,"ta-log-integer-threshold"),
  q("6.3",r`Calculer $1-(0,325)^4$, arrondi à quatre décimales.`,["0,9888"],r`$(0,325)^4=0,011156640625$. Donc la probabilité vaut $0,988843359375$, soit $\boxed{0,9888}$. Elle dépasse $0,98$.`,"ta-log-integer-threshold"),
 ],writtenTasks:[w("integer-threshold","Rédiger la résolution complète qui donne le nombre minimal d’élèves.",r`On résout $1-(0,325)^n>0,98$. On obtient $(0,325)^n<0,02$ en isolant la puissance et en inversant le sens lors de la multiplication par $-1$.

Les deux membres sont strictement positifs. Comme $\ln$ est croissante :
$$n\ln(0{,}325)<\ln(0{,}02).$$
Or $\ln(0,325)<0$. La division par ce nombre négatif inverse à nouveau le sens :
$$n>\frac{\ln(0{,}02)}{\ln(0{,}325)}\approx3{,}48.$$
Ainsi le minimum entier est $4$. La vérification donne environ $96,57\,\%$ pour trois élèves et $98,88\,\%$ pour quatre. La conclusion est donc bien $\boxed4$ dans le modèle donné.`,["La probabilité est traduite par une inéquation.","Les arguments des logarithmes sont positifs.","La division par un nombre négatif inverse le sens.","L’entier minimal et les valeurs voisines sont vérifiés."],"ta-log-integer-threshold")]},
 {id:"ta-log-eval-bac",title:"Étude type Bac",pages:[9,10],statement:r`On étudie $f(x)=-2x+1+\ln x$ sur $]0;+\infty[$.`,method:"Domaine, limites, dérivée, signe, variations et tableau de valeurs : justifie chaque étape avant de tracer la courbe.",examples:[logBacExample],questions:[
  q("7.1",r`Donner la limite de $f$ en $0^+$.`,["-infini","-∞"],r`$-2x+1\to1$ et $\ln x\to-\infty$, donc $\boxed{f(x)\to-\infty}$. La droite $x=0$ est asymptote verticale.`,"ta-log-bac-study"),
  q("7.2",r`Donner la limite de $f$ en $+\infty$.`,["-infini","-∞"],r`On écrit $f(x)=x(-2+1/x+\ln x/x)$. La parenthèse tend vers $-2$, et $x\to+\infty$. Donc $\boxed{f(x)\to-\infty}$.`,"ta-log-bac-study"),
  q("7.3","À quelle abscisse le maximum est-il atteint ?",["1/2","0,5"],r`Sur le domaine positif, $f'(x)=(1-2x)/x$ est positive avant $1/2$ et négative après. Le maximum est atteint en $\boxed{x=1/2}$.`,"ta-log-bac-study"),
  q("7.4",r`Calculer $f(0,25)$, arrondi au dixième.`,["-0,9"],r`$f(0,25)=0,5+\ln(0,25)\approx-0,8863$. L’arrondi au dixième est $\boxed{-0,9}$.`,"ta-log-bac-study"),
  q("7.5",r`Calculer $f(1)$.`,["-1"],r`On remplace $x$ par $1$ dans $-2x+1+\ln x$. Comme $\ln1=0$, cela donne $f(1)=-2\times1+1+0=\boxed{-1}$.`,"ta-log-bac-study"),
  q("7.6",r`Calculer $f(3)$, arrondi au dixième.`,["-3,9"],r`$f(3)=-6+1+\ln3=-5+\ln3\approx-3,9014$. L’arrondi est $\boxed{-3,9}$.`,"ta-log-bac-study"),
 ]},
];
