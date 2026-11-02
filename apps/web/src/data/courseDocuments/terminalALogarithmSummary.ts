import type {CourseDocumentSection,CourseDocumentTopic,CourseWorkedExample} from "../../domain/courseDocument";
export const logExample=(id:string,title:string,parts:[string,string,string][]):CourseWorkedExample=>({id,title,prompt:"",parts:parts.map(([label,prompt,solution],i)=>({id:id+"-"+(i+1),label,prompt,solution}))});
const e=logExample,r=String.raw;
const t=(id:string,title:string,pages:number[],body:string,examples:CourseWorkedExample[]=[]):CourseDocumentTopic=>({id,title,pages,body,examples});

export const logBacExample=e("ta-log-bac-example","Étude de f(x) = −2x + 1 + ln(x)",[
 ["1.",r`Justifier la limite en $0^+$ et l’interpréter graphiquement.`,r`La fonction est définie pour $x>0$. Quand $x\to0^+$ :
$$-2x+1\longrightarrow1\qquad\text{et}\qquad\ln x\longrightarrow-\infty.$$
La somme tend donc vers $\boxed{-\infty}$. La droite d’équation $\boxed{x=0}$ est une asymptote verticale à la courbe.`],
 ["2.",r`Calculer la limite en $+\infty$.`,r`La somme contient des termes de signes opposés qui deviennent infinis. On ne conclut pas directement. Pour $x>0$, on factorise par $x$ :
$$f(x)=x\left(-2+\frac1x+\frac{\ln x}{x}\right).$$
Quand $x\to+\infty$, les deux quotients tendent vers $0$. La parenthèse tend vers $-2$, et $x$ tend vers $+\infty$. Donc $\boxed{\lim_{x\to+\infty}f(x)=-\infty}$.`],
 ["3.a)",r`Calculer $f'(x)$.`,r`On dérive chaque terme sur $]0;+\infty[$ :
$$f'(x)=-2+0+\frac1x.$$
Au même dénominateur, $\boxed{f'(x)=\dfrac{1-2x}{x}}$.`],
 ["3.b)","Étudier le signe de la dérivée et les variations.",r`Sur le domaine, $x>0$ ; le dénominateur est donc positif. La dérivée a le signe de $1-2x$.

| $x$ | $]0;1/2[$ | $1/2$ | $]1/2;+\infty[$ |
|---|---|---|---|
| $f'(x)$ | $+$ | $0$ | $-$ |
| Sens de variation | croissante | maximum | décroissante |

La fonction est strictement croissante sur $]0;1/2]$, puis strictement décroissante sur $[1/2;+\infty[$.`],
 ["3.c)","Calculer le maximum et dresser le tableau de variations.",r`Au sommet :
$$f(1/2)=-1+1+\ln(1/2)=\boxed{-\ln2}.$$

| $x$ | $0^+$ | $1/2$ | $+\infty$ |
|---|---|---|---|
| $f'(x)$ | $+$ | $0$ | $-$ |
| $f(x)$ | $-\infty\;\nearrow$ | $-\ln2$ | $\searrow\;-\infty$ |

Comme $\ln2>0$, même le maximum est négatif : toute la courbe est sous l’axe des abscisses.`],
 ["4.","Compléter le tableau de valeurs au dixième.",r`On remplace $x$ par chaque abscisse dans $-2x+1+\ln x$, puis on arrondit à la fin. Par exemple :
$$f(0{,}25)=0{,}5+\ln(0{,}25)\approx-0{,}8863,$$
soit $-0,9$ au dixième.

| $x$ | $0,25$ | $0,5$ | $1$ | $1,5$ | $2$ | $2,5$ | $3$ | $3,5$ | $4$ |
|---|---|---|---|---|---|---|---|---|---|
| $f(x)$ au dixième | $-0,9$ | $-0,7$ | $-1,0$ | $-1,6$ | $-2,3$ | $-3,1$ | $-3,9$ | $-4,7$ | $-5,6$ |`],
 ["5.","Construire la courbe sur ]0 ; 4].",r`Tracer l’asymptote $x=0$, placer le sommet $(1/2;-\ln2)$ et les points du tableau. Relier en respectant la croissance, puis la décroissance. Au voisinage de $0$, la branche descend sans atteindre l’axe des ordonnées. Le sommet reste sous l’axe des abscisses.`],
]);

export const terminalALogarithmSections:CourseDocumentSection[]=[
 {id:"ta-log-basics",numeral:"I",title:"Définition et propriétés algébriques",topics:[
  t("ta-log-definition","Définir le logarithme népérien",[1,2],r`La fonction **logarithme népérien**, notée $\ln$, est la fonction définie sur $]0;+\infty[$ dont la dérivée est $x\mapsto1/x$ et dont la valeur en $1$ est $0$.

$$\boxed{\ln1=0}\qquad\boxed{(\ln x)'=\frac1x\quad(x>0)}.$$

Avant d’écrire $\ln(u)$ dans les réels, il faut donc vérifier $\boxed{u>0}$. Ni $\ln0$ ni le logarithme d’un réel négatif n’existent dans ce cadre.

Le logarithme est une **primitive** de $1/x$ sur $]0;+\infty[$, et non sa dérivée.`,[
   e("ta-log-validity-example","Contrôler l’expression dans le logarithme",[
    ["a)",r`Quand $\ln(2x-1)$ existe-t-il ?`,r`Il faut que $2x-1>0$. On ajoute $1$, puis on divise par $2>0$ : $x>1/2$. Le domaine est $\boxed{]1/2;+\infty[}$. La borne $1/2$ est exclue car elle donnerait $\ln0$.`],
    ["b)",r`La fonction $x\mapsto\ln(-x^2+2x-1)$ a-t-elle un domaine réel ?`,r`On factorise l’argument : $-x^2+2x-1=-(x-1)^2$. Un carré étant positif ou nul, son opposé est toujours négatif ou nul. Il n’est jamais strictement positif. Le domaine réel est donc $\boxed{\varnothing}$.`],
   ]),
  ]),
  t("ta-log-algebra","Transformer un logarithme ou une somme de logarithmes",[2],r`Pour $a>0$, $b>0$ et tout entier relatif $n$ :

| Opération | Propriété |
|---|---|
| Produit | $\ln(ab)=\ln a+\ln b$ |
| Quotient | $\ln(a/b)=\ln a-\ln b$ |
| Inverse | $\ln(1/b)=-\ln b$ |
| Puissance | $\ln(a^n)=n\ln a$ |
| Racine carrée | $\ln\sqrt a=\frac12\ln a$ |

**Attention :** il n’existe pas de règle $\ln(a+b)=\ln a+\ln b$. C’est le produit, pas la somme à l’intérieur, qui devient une somme de logarithmes.`,[
   e("ta-log-expand-example","Exprimer avec ln 2 et ln 3",[
    ["a)",r`Développer $A=\ln24$.`,r`On décompose $24=2^3\times3$. Donc :
$$A=\ln(2^3)+\ln3=\boxed{3\ln2+\ln3}.$$`],
    ["b)",r`Développer $B=\ln(2/3)$.`,r`Les deux nombres sont positifs. Avec la règle du quotient : $\boxed{B=\ln2-\ln3}$.`],
    ["c)",r`Développer $C=\ln(3^5)-\ln(2^4)$.`,r`La puissance sort devant chaque logarithme : $\boxed{C=5\ln3-4\ln2}$.`],
   ]),
   e("ta-log-combine-example","Écrire sous la forme ln(k)",[
    ["a)",r`Regrouper $D=\ln5+\ln3$.`,r`Une somme de logarithmes est le logarithme du produit : $D=\ln(5\times3)=\boxed{\ln15}$.`],
    ["b)",r`Regrouper $E=\ln2-\ln(0,1)$.`,r`Une différence devient un quotient : $E=\ln(2/0,1)$. Comme $2/0,1=20$, $\boxed{E=\ln20}$.`],
    ["c)",r`Regrouper $F=4\ln5$.`,r`Le coefficient devient un exposant : $F=\ln(5^4)=\boxed{\ln625}$.`],
   ]),
  ]),
 ]},
 {id:"ta-log-limits-graph",numeral:"II",title:"Limites, variations et courbe",topics:[
  t("ta-log-limits","Les quatre limites de référence",[3],r`| Lorsque… | Limite à connaître |
|---|---|
| $x\to0^+$ | $\ln x\to-\infty$ |
| $x\to+\infty$ | $\ln x\to+\infty$ |
| $x\to0^+$ | $x\ln x\to0$ |
| $x\to+\infty$ | $\dfrac{\ln x}{x}\to0$ |

En $0$, l’approche se fait uniquement **par valeurs positives**. À l’infini, le logarithme augmente, mais beaucoup moins vite que $x$ : leur quotient tend vers $0$.

Dans une forme indéterminée, transforme l’expression avant de conclure : développer près de $0$, factoriser par $x$ à l’infini.`,[
   e("ta-log-four-limits","Quatre calculs de limites",[
    ["1)",r`Calculer $\lim_{x\to0^+}(x+\ln x)$.`,r`Quand $x\to0^+$, $x\to0$ et $\ln x\to-\infty$. La somme d’un terme tendant vers $0$ et d’un terme tendant vers $-\infty$ tend vers $\boxed{-\infty}$.`],
    ["2)",r`Calculer $\lim_{x\to+\infty}(x+\ln x)$.`,r`Les deux termes tendent vers $+\infty$. Leur somme tend donc vers $\boxed{+\infty}$.`],
    ["3)",r`Calculer $\lim_{x\to+\infty}x\left(1-\dfrac{\ln x}{x}\right)$.`,r`On sait que $\ln x/x\to0$, donc la parenthèse tend vers $1$. Comme $x\to+\infty$, le produit tend vers $\boxed{+\infty}$.`],
    ["4)",r`Calculer $\lim_{x\to0^+}x(1+\ln x)$.`,r`Le produit direct donne une forme indéterminée. On développe :
$$x(1+\ln x)=x+x\ln x.$$
Les deux termes tendent vers $0$, d’où $\boxed{\lim_{x\to0^+}x(1+\ln x)=0}$.`],
   ]),
  ]),
  t("ta-log-curve","Croissance, signe et nombre e",[3,4],r`Pour $x>0$, $\ln'(x)=1/x>0$. La fonction $\ln$ est donc **strictement croissante** sur $]0;+\infty[$.

| $x$ | $0^+$ | $1$ | $e$ | $+\infty$ |
|---|---|---|---|---|
| $\ln x$ | $-\infty\;\nearrow$ | $0\;\nearrow$ | $1\;\nearrow$ | $+\infty$ |

Il existe un unique nombre $e\in]2;3[$ tel que $\ln e=1$ ; $e\approx2,718$. Plus généralement, le nombre positif dont le logarithme vaut $a$ se note $e^a$ : $\ln x=a\iff x=e^a$.

| Condition sur $x$ | Signe de $\ln x$ |
|---|---|
| $0<x<1$ | négatif |
| $x=1$ | nul |
| $x>1$ | positif |

La courbe passe par $(1;0)$ et $(e;1)$. La droite $x=0$ est une asymptote verticale. Pour $a,b>0$, la croissance donne $\ln a=\ln b\iff a=b$ et $\ln a>\ln b\iff a>b$.`),
  t("ta-log-function-study","Déduire les variations d’une fonction",[4],r`La dérivée donne les variations **sur le domaine**. Commence donc toujours par les conditions d’existence.`,[
   e("ta-log-increasing-example","Étudier f(x) = 2x + ln x",[
    ["1.","Déterminer le domaine.",r`Le terme $2x$ existe pour tout réel, mais $\ln x$ exige $x>0$. Donc $\boxed{D_f=]0;+\infty[}$.`],
    ["2.","Calculer la dérivée.",r`La dérivée de $2x$ est $2$ et celle de $\ln x$ est $1/x$. En dérivant la somme terme à terme, on obtient $\boxed{f'(x)=2+1/x}$.`],
    ["3.","Étudier les variations.",r`Pour tout $x>0$, $1/x>0$, donc $2+1/x>0$. La dérivée est strictement positive : $f$ est **strictement croissante** sur $]0;+\infty[$.`],
   ]),
   e("ta-log-maximum-example","Étudier g(x) = 1 − x + ln x",[
    ["1.","Déterminer le domaine et la dérivée.",r`Le domaine est $]0;+\infty[$. Sur cet intervalle :
$$g'(x)=-1+\frac1x=\frac{1-x}{x}.$$`],
    ["2.","Déterminer les variations et le maximum.",r`Le dénominateur est positif. Le numérateur $1-x$ est positif avant $1$, nul en $1$ et négatif après. Ainsi $g$ croît sur $]0;1]$, puis décroît sur $[1;+\infty[$. Son maximum vaut $\boxed{g(1)=0}$.`],
   ]),
  ]),
 ]},
 {id:"ta-log-solving",numeral:"III",title:"Équations et inéquations",topics:[
  t("ta-log-equations","Résoudre une équation avec des logarithmes",[4,5],r`**Trois étapes :** déterminer l’ensemble de validité, transformer l’équation sur cet ensemble, puis vérifier les solutions.

Si les deux arguments sont positifs, $\ln u=\ln v\iff u=v$. Pour un second membre égal à $1$, on peut écrire $1=\ln e$.`,[
   e("ta-log-equations-example","Deux équations, deux conditions d’existence",[
    ["1)",r`Résoudre $\ln(2x-1)=\ln(x+5)$.`,r`Les conditions sont $2x-1>0$ et $x+5>0$, donc $V=]1/2;+\infty[$.

Sur $V$, l’égalité des logarithmes équivaut à $2x-1=x+5$, d’où $x=6$. Comme $6\in V$, $\boxed{S=\{6\}}$.`],
    ["2)",r`Résoudre $\ln(x-2)=1$.`,r`Il faut $x>2$. Puis :
$$\ln(x-2)=\ln e\iff x-2=e\iff x=e+2.$$
Le nombre $e+2$ est supérieur à $2$, donc $\boxed{S=\{e+2\}}$.`],
   ]),
  ]),
  t("ta-log-substitution","Poser X = ln x",[4,5],r`Lorsque $\ln x$ apparaît au carré, on pose $X=\ln x$ après avoir imposé $x>0$. On résout l’équation en $X$, puis on revient à $x$ : une valeur $X=a$ donne $x=e^a$.`,[
   e("ta-log-quadratic-example","Une équation du second degré en ln x",[
    ["a)",r`Résoudre $(\ln x)^2+\ln x-6=0$.`,r`Le domaine de validité est $]0;+\infty[$. Avec $X=\ln x$, l’équation devient $X^2+X-6=0$.

On factorise : $(X+3)(X-2)=0$. Donc $X=-3$ ou $X=2$.`],
    ["b)","Revenir à l’inconnue x.",r`On obtient $\ln x=-3$ ou $\ln x=2$, soit $x=e^{-3}$ ou $x=e^2$. Ces deux nombres sont positifs. Ainsi $\boxed{S=\{e^{-3};e^2\}}$.`],
   ]),
  ]),
  t("ta-log-inequalities","Résoudre une inéquation",[5],r`La fonction logarithme étant croissante, comparer deux logarithmes **ne change pas** le sens de l’inégalité. En revanche, diviser par un nombre négatif le change. Les conditions d’existence doivent rester vérifiées jusqu’à la conclusion.`,[
   e("ta-log-inequalities-example","Une inéquation simple et une inéquation du second degré",[
    ["1)",r`Résoudre $\ln(2x-3)<1$.`,r`L’argument doit être positif : $x>3/2$. Sur cet ensemble :
$$\ln(2x-3)<\ln e\iff2x-3<e.$$
On en déduit $x<(3+e)/2$. En gardant la condition de départ :
$$\boxed{S=\left]\frac32;\frac{3+e}{2}\right[}.$$`],
    ["2)",r`Résoudre $(\ln x)^2-5\ln x-6\geq0$.`,r`On impose $x>0$, puis on pose $X=\ln x$. L’expression devient :
$$X^2-5X-6=(X+1)(X-6).$$

| $X$ | $]-\infty;-1[$ | $-1$ | $]-1;6[$ | $6$ | $]6;+\infty[$ |
|---|---|---|---|---|---|
| $(X+1)(X-6)$ | $+$ | $0$ | $-$ | $0$ | $+$ |

Le produit est positif ou nul pour $X\leq-1$ ou $X\geq6$. On revient à $x$ : $\ln x\leq-1$ donne $0<x\leq e^{-1}$ ; $\ln x\geq6$ donne $x\geq e^6$.
$$\boxed{S=]0;e^{-1}]\cup[e^6;+\infty[}.$$`],
   ]),
  ]),
 ]},
 {id:"ta-log-calculus",numeral:"IV",title:"Dérivées et primitives",topics:[
  t("ta-log-composite","Dériver ln(u)",[5,6],r`Si $u$ est dérivable et **strictement positive** sur un intervalle $I$, alors :
$$\boxed{(\ln u)'=\frac{u'}u}.$$
Le numérateur est la dérivée de l’argument ; le dénominateur est l’argument lui-même.`,[
   e("ta-log-derivatives-example","Deux logarithmes composés",[
    ["1)",r`Dériver $f(x)=\ln(5x+2)$ sur $]0;13[$.`,r`Sur l’intervalle donné, $5x+2>0$. On pose $u(x)=5x+2$, donc $u'(x)=5$. Ainsi $\boxed{f'(x)=5/(5x+2)}$.`],
    ["2)",r`Dériver $g(x)=\ln(2x^2-x-1)$ sur $]-\infty;-1/2[$.`,r`On a $u(x)=(2x+1)(x-1)$. Sur l’intervalle donné, les deux facteurs sont négatifs, donc $u(x)>0$. Puis $u'(x)=4x-1$, d’où :
$$\boxed{g'(x)=\frac{4x-1}{2x^2-x-1}}.$$`],
   ]),
  ]),
  t("ta-log-primitives","Reconnaître une primitive logarithmique",[6],r`Si $u$ est dérivable et strictement positive sur un intervalle $I$, les primitives de $u'/u$ sur $I$ sont $\ln u+C$, où $C\in\mathbb R$.

| Fonction à intégrer | Primitives, sous les conditions indiquées |
|---|---|
| $1/x$, avec $x>0$ | $\ln x+C$ |
| $a/(cx+d)$, avec $c\neq0$ et $cx+d>0$ | $\dfrac ac\ln(cx+d)+C$ |
| $u'/u$, avec $u>0$ | $\ln u+C$ |

Pour vérifier un résultat, **dérive la primitive proposée**. Le facteur placé devant le logarithme compense celui qui apparaît en dérivant son argument.`,[
   e("ta-log-primitives-example","Trois primitives sur les intervalles donnés",[
    ["a)",r`Déterminer les primitives de $1/x$ sur $]0;+\infty[$.`,r`La dérivée de $\ln x$ vaut $1/x$. Toutes les primitives sont donc $\boxed{F(x)=\ln x+C}$, avec $C\in\mathbb R$.`],
    ["b)",r`Déterminer les primitives de $2/(-3x+7)$ sur $]-\infty;7/3[$.`,r`Sur cet intervalle, $u(x)=-3x+7>0$ et $u'(x)=-3$. On écrit :
$$\frac2{-3x+7}=-\frac23\frac{u'}u.$$
Donc $\boxed{F(x)=-\frac23\ln(-3x+7)+C}$. Vérification : le coefficient $-2/3$ multiplié par $-3$ redonne $2$.`],
    ["c)",r`Déterminer les primitives de $(2x+1)/(x^2+x+3)$ sur $]0;+\infty[$.`,r`On pose $u(x)=x^2+x+3$. Sur l’intervalle donné, $u(x)>0$ et $u'(x)=2x+1$. La fonction est donc exactement $u'/u$.
$$\boxed{F(x)=\ln(x^2+x+3)+C},\qquad C\in\mathbb R.$$`],
   ]),
  ]),
 ]},
 {id:"ta-log-applications",numeral:"V",title:"Applications et étude type Bac",topics:[
  t("ta-log-integer-threshold","Déterminer un nombre entier minimal",[7],r`Dans le modèle probabiliste de l’exercice, la probabilité d’avoir au moins un élève non atteint de la maladie parmi $n$ élèves examinés est $1-(0,325)^n$. On cherche le plus petit entier $n$ pour lequel cette probabilité est **supérieure à 98 %**.

La formule est admise dans cet exercice : elle décrit un modèle, pas une recommandation de dépistage.`,[
   e("ta-log-threshold-example","Passer d’une puissance à une inéquation en n",[
    ["1.","Traduire l’objectif.",r`L’objectif s’écrit $1-(0,325)^n>0,98$. En soustrayant $1$, puis en multipliant par $-1$ :
$$\boxed{(0{,}325)^n<0{,}02}.$$`],
    ["2.","Utiliser le logarithme et isoler n.",r`Les deux membres sont positifs et $\ln$ est croissante. Donc :
$$n\ln(0{,}325)<\ln(0{,}02).$$
Comme $0<0,325<1$, $\ln(0,325)<0$. En divisant par ce nombre **négatif**, on inverse le sens :
$$n>\frac{\ln(0{,}02)}{\ln(0{,}325)}\approx3{,}48.$$`],
    ["3.","Conclure sur le plus petit entier.",r`Le premier entier strictement supérieur à $3,48$ est $4$. On vérifie : pour $n=3$, la probabilité vaut environ $0,9657<0,98$ ; pour $n=4$, elle vaut environ $0,9888>0,98$.

Le nombre minimal demandé dans ce modèle est donc $\boxed{4}$ élèves.`],
   ]),
  ]),
  t("ta-log-bac-study","Étudier entièrement une fonction avec ln",[9,10],r`On considère la fonction $f(x)=-2x+1+\ln x$, définie sur $]0;+\infty[$. On note $\mathcal C$ sa courbe dans un repère orthonormé.`,[logBacExample]),
 ]},
];
