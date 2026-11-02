import type {CourseDocumentQuestion,CourseEvaluationGroup,CourseWorkedExample,CourseWrittenTask} from "../../domain/courseDocument";
const r=String.raw;
const question=(id:string,prompt:string,accepted:string[],correction:string,topicId:string):CourseDocumentQuestion=>({id:"ta-fn-"+id,label:id,prompt,answer:{kind:"short",accepted},expected:accepted[0],correction,topicId,points:1});
const writing=(id:string,prompt:string,model:string,criteria:string[],topicId:string):CourseWrittenTask=>({id:"ta-fn-writing-"+id,prompt,model,criteria,topicId});

export const rationalStudyExample:CourseWorkedExample={id:"ta-rational-complete-example",title:"Étude de $f(x)=(x^2+3x+3)/(x+1)$",prompt:r`On considère $f(x)=\dfrac{x^2+3x+3}{x+1}$ et sa courbe $\mathcal C_f$.`,parts:[
 {id:"ta-study-domain",label:"1)",prompt:"Déterminer le domaine de définition.",solution:r`Le dénominateur ne doit pas s’annuler : $x+1\neq0$, soit $x\neq-1$. Ainsi :
$$\boxed{D_f=]-\infty;-1[\,\cup\,]-1;+\infty[}.$$`},
 {id:"ta-study-limits",label:"2)",prompt:"Calculer les limites aux bornes du domaine.",solution:r`Près de $-1$, le numérateur tend vers $1-3+3=1>0$. Le signe du quotient est donc celui de $x+1$ :
$$\lim_{x\to-1^-}f(x)=-\infty.$$
$$\lim_{x\to-1^+}f(x)=+\infty.$$
À l’infini, le quotient des termes de plus haut degré est $x^2/x=x$. Donc :
$$\lim_{x\to-\infty}f(x)=-\infty.$$
$$\lim_{x\to+\infty}f(x)=+\infty.$$`},
 {id:"ta-study-decomposition",label:"3)",prompt:"Faire apparaître une expression affine et un reste.",solution:r`On développe $(x+1)(x+2)+1=x^2+3x+3$. Pour $x\neq-1$, on peut diviser cette identité par $x+1$ :
$$\boxed{f(x)=x+2+\frac1{x+1}}.$$`},
 {id:"ta-study-asymptotes",label:"4)",prompt:"Déterminer les asymptotes et la position relative.",solution:r`Les limites infinies en $-1$ donnent l’asymptote verticale $\boxed{x=-1}$.

De plus, $f(x)-(x+2)=1/(x+1)$ tend vers $0$ aux deux infinis : $\boxed{y=x+2}$ est asymptote oblique aux deux extrémités.

Pour $x<-1$, $1/(x+1)<0$ : la courbe est **au-dessous** de la droite. Pour $x>-1$, elle est **au-dessus**.`},
 {id:"ta-study-derivative",label:"5)",prompt:"Calculer la dérivée et étudier son signe.",solution:r`À partir de la décomposition :
$$f'(x)=1-\frac1{(x+1)^2}.$$
On met au même dénominateur :
$$f'(x)=\frac{(x+1)^2-1}{(x+1)^2}.$$
Puis on développe et factorise :
$$f'(x)=\boxed{\frac{x(x+2)}{(x+1)^2}}.$$
Sur le domaine, le dénominateur est strictement positif. Le produit $x(x+2)$ est positif si $x<-2$ ou $x>0$, et négatif si $-2<x<0$. On conserve la coupure en $x=-1$.`},
 {id:"ta-study-variations",label:"6)",prompt:"Donner les variations et les extrema relatifs.",solution:r`On calcule $f(-2)=-1$ et $f(0)=3$.

| Intervalle | Variation de $f$ |
|---|---|
| $]-\infty;-2]$ | croissante de $-\infty$ à $-1$ |
| $[-2;-1[$ | décroissante de $-1$ vers $-\infty$ |
| $]-1;0]$ | décroissante de $+\infty$ à $3$ |
| $[0;+\infty[$ | croissante de $3$ vers $+\infty$ |

Le changement de signe $+\to-$ en $-2$ donne le maximum relatif $-1$. Le changement $-\to+$ en $0$ donne le minimum relatif $3$.`},
 {id:"ta-study-symmetry",label:"7)",prompt:"Vérifier que $A(-1;1)$ est centre de symétrie.",solution:r`Le domaine est symétrique par rapport à $-1$ : pour tout $h\neq0$, les nombres $-1+h$ et $-1-h$ sont admissibles.
$$f(-1+h)=1+h+\frac1h,$$
$$f(-1-h)=1-h-\frac1h.$$
La somme vaut $2=2\times1$. **Le point $A(-1;1)$ est donc centre de symétrie de la courbe.**`},
 {id:"ta-study-points",label:"8)",prompt:"Préparer le tracé avec quelques points.",solution:r`On place d’abord les asymptotes $x=-1$ et $y=x+2$, puis les extrema $(-2;-1)$ et $(0;3)$.

| $x$ | $-3$ | $-2$ | $-1,8$ | $-1,5$ | $-1$ | $-0,8$ | $-0,5$ | $0$ | $1$ | $2$ |
|---|---|---|---|---|---|---|---|---|---|---|
| $f(x)$ | $-1,5$ | $-1$ | $-1,05$ | $-1,5$ | non défini | $6,2$ | $3,5$ | $3$ | $3,5$ | $13/3$ |

On trace deux branches séparées par $x=-1$, en respectant les variations et la position relative. On ne relie jamais les points en traversant la valeur interdite.`},
]};

export const terminalAPolynomialEvaluations:CourseEvaluationGroup[]=[
 {id:"ta-eval-polynomials",title:"Limites d’un polynôme",pages:[2,3,4,21,22],method:r`En un réel, remplace la variable. À l’infini, repère le terme de plus haut degré, puis utilise son signe et la parité de la puissance.`,examples:[],questions:[
  question("1.1",r`Une limite, si elle existe, peut-elle avoir deux valeurs différentes ? Réponds par vrai ou faux.`,["Faux","F"],"Une limite, lorsqu’elle existe au point étudié, est unique. L’affirmation est donc fausse.","ta-polynomial-finite"),
  question("1.2",r`Calculer $\lim_{x\to5}(2x+1)$.`,["11"],r`$2x+1$ est un polynôme, donc la limite vaut sa valeur en $5$ : $2\times5+1=\boxed{11}$.`,"ta-polynomial-finite"),
  question("1.3",r`Calculer $\lim_{x\to4}(-x+10x^3)$.`,["636"],r`On remplace $x$ par $4$ : $-4+10\times4^3=-4+640=\boxed{636}$.`,"ta-polynomial-finite"),
  question("1.4",r`Calculer $\lim_{x\to-2}(3x^3-x^2+2x-1)$.`,["-33"],r`La limite vaut $3(-2)^3-(-2)^2+2(-2)-1=-24-4-4-1=\boxed{-33}$.`,"ta-polynomial-finite"),
  question("1.5",r`Calculer $\lim_{x\to-\infty}(-3x^3+2x+x^5)$.`,["-∞","-infini"],r`Le terme de plus haut degré est $x^5$. La puissance est impaire : lorsque $x\to-\infty$, $x^5\to-\infty$. Donc la limite du polynôme est $\boxed{-\infty}$.`,"ta-polynomial-infinite"),
  question("1.6",r`Calculer $\lim_{x\to-\infty}(-x^4-6x^3+1)$.`,["-∞","-infini"],r`On étudie le terme de plus haut degré $-x^4$. Puisque $4$ est pair, $x^4\to+\infty$, et donc $-x^4\to-\infty$. La limite cherchée est $\boxed{-\infty}$.`,"ta-polynomial-infinite"),
 ]},
 {id:"ta-eval-rational",title:"Limites d’une fonction rationnelle",pages:[5,6,7,22,23,24],method:r`Vérifie si le dénominateur s’annule. S’il ne s’annule pas, remplace directement. S’il tend vers zéro, étudie son signe du côté demandé. À l’infini, compare les termes de plus haut degré.`,examples:[],questions:[
  question("2.1",r`Calculer $\lim_{x\to1}\dfrac{x}{x+2}$.`,["1/3"],r`Le dénominateur tend vers $3\neq0$. La fonction est définie en $1$ et la limite vaut $1/(1+2)=\boxed{1/3}$.`,"ta-rational-finite"),
  question("2.2",r`Calculer $\lim_{x\to-1}\dfrac{x^2}{x-2}$.`,["-1/3"],r`Le numérateur tend vers $1$ et le dénominateur vers $-3\neq0$. La limite du quotient est $\boxed{-1/3}$.`,"ta-rational-finite"),
  question("2.3",r`Calculer $\lim_{x\to2^-}\dfrac{x^2-5x+7}{x-2}$.`,["-∞","-infini"],r`Le numérateur tend vers $4-10+7=1>0$. Quand $x\to2^-$, $x-2\to0^-$ ; l’inverse tend vers $-\infty$. La limite du quotient est donc $\boxed{-\infty}$.`,"ta-rational-sided"),
  question("2.4",r`Calculer $\lim_{x\to2^+}\dfrac{x^2-5x+7}{x-2}$.`,["+∞","∞","+infini"],r`Le numérateur tend vers $1>0$. Cette fois, $x-2\to0^+$, donc son inverse tend vers $+\infty$. La limite vaut $\boxed{+\infty}$.`,"ta-rational-sided"),
  question("2.5",r`Calculer $\lim_{x\to-4^+}\dfrac{x^2+6x-10}{x+4}$.`,["-∞","-infini"],r`Le numérateur tend vers $16-24-10=-18<0$ ; le dénominateur tend vers $0$ par valeurs positives. Le produit d’un nombre négatif non nul par un inverse qui tend vers $+\infty$ donne $\boxed{-\infty}$.`,"ta-limits-inverse-quotient"),
  question("2.6",r`Calculer $\lim_{x\to-\infty}\dfrac{-20x^3+75}{4x^3-2x-90}$.`,["-5"],r`Les deux polynômes ont le même degré $3$. La limite est le quotient des coefficients dominants : $-20/4=\boxed{-5}$.`,"ta-rational-infinite"),
  question("2.7",r`Calculer $\lim_{x\to+\infty}\dfrac{5x^4-x^2+5}{4x^4+2x-7}$.`,["5/4","1,25","1.25"],r`Le numérateur et le dénominateur ont tous deux le degré $4$. Leur quotient tend donc vers le rapport $5/4$, soit $\boxed{1,25}$.`,"ta-rational-infinite"),
 ]},
 {id:"ta-eval-operations",title:"Opérations et asymptotes",pages:[8,9,10,11,12,13,21,27,28],method:r`Calcule d’abord les limites simples. Pour une asymptote, précise toujours si la droite est horizontale, verticale ou oblique et indique l’extrémité étudiée.`,examples:[],questions:[
  question("3.1",r`Calculer $\lim_{x\to-2}\left(\dfrac{2x+3}{x+1}+x-8\right)$.`,["-9"],r`Le quotient tend vers $(-1)/(-1)=1$ et $x-8$ tend vers $-10$. La limite de la somme est $1-10=\boxed{-9}$.`,"ta-limits-sum"),
  question("3.2",r`Calculer $\lim_{x\to+\infty}\dfrac{x+6}{x-4}(6-x)$.`,["-∞","-infini"],r`Le quotient $(x+6)/(x-4)$ tend vers $1>0$. L’autre facteur $6-x$ tend vers $-\infty$. Le produit tend donc vers $\boxed{-\infty}$.`,"ta-limits-product"),
  question("3.3",r`Pour $f(x)=(3x-2)/(x-1)$, quelle est la valeur de $b$ dans l’asymptote horizontale $y=b$ en $+\infty$ ?`,["3"],r`Les plus hauts degrés donnent $3x/x=3$. La limite vaut $3$, donc l’asymptote est $y=3$ et $\boxed{b=3}$.`,"ta-asymptote-horizontal"),
  question("3.4",r`Pour $f(x)=(3x-4)/(x-5)$, quelle est la valeur de $a$ dans l’asymptote verticale $x=a$ ?`,["5"],r`En $5$, le numérateur tend vers $11>0$ alors que le dénominateur tend vers zéro. Les limites latérales sont $-\infty$ et $+\infty$ : l’asymptote est $x=5$ et $\boxed{a=5}$.`,"ta-asymptote-vertical"),
 ],writtenTasks:[writing("oblique",r`Pour $h(x)=x-8+1/(x-3)$ : justifier les asymptotes et situer la courbe par rapport à $y=x-8$.`,r`Le domaine est $\mathbb R\setminus\{3\}$. En $3$, la partie affine tend vers $-5$, mais l’inverse impose les limites : $\lim_{x\to3^-}h(x)=-\infty$ et $\lim_{x\to3^+}h(x)=+\infty$. La droite $x=3$ est donc asymptote verticale.

On calcule ensuite la différence : $h(x)-(x-8)=1/(x-3)$. Elle tend vers zéro aux deux infinis ; $y=x-8$ est asymptote oblique aux deux extrémités.

Enfin, cette différence est négative sur $]-\infty;3[$ et positive sur $]3;+\infty[$. La courbe est donc **au-dessous à gauche de $3$**, et **au-dessus à droite de $3$**.`,["Le domaine exclut 3.","Les deux limites latérales sont justifiées par le signe.","La différence avec la droite tend vers zéro.","Le signe de cette différence justifie la position relative."],"ta-asymptote-oblique")]},
 {id:"ta-eval-derivation",title:"Dériver et reconnaître un extremum",pages:[14,15,16,17],method:r`Écris la règle de dérivation avant le calcul. Pour un extremum, ne t’arrête pas à $f'(a)=0$ : étudie le signe de la dérivée de chaque côté.`,examples:[],questions:[
  question("4.1",r`Pour $f(x)=-5x^3+7x^2-8$, calculer $f'(1)$.`,["-1"],r`$f'(x)=-15x^2+14x$. En $1$, $f'(1)=-15+14=\boxed{-1}$.`,"ta-derivative-rules"),
  question("4.2",r`Pour $g(x)=(x-4)/(5x+3)$, calculer $g'(1)$.`,["23/64","0,359375","0.359375"],r`La règle du quotient donne :
$$g'(x)=\frac{5x+3-5(x-4)}{(5x+3)^2}.$$
Au numérateur, $5x+3-5x+20=23$, donc :
$$g'(x)=\frac{23}{(5x+3)^2}.$$
En $1$, le dénominateur vaut $8^2=64$, donc $\boxed{g'(1)=23/64}$.`,"ta-derivative-rules"),
  question("4.3",r`Pour $f(x)=-x^2-2$, quelle est la pente de la tangente en $x=1$ ?`,["-2"],r`La pente est $f'(1)$, pas $f(1)$. Puisque $f'(x)=-2x$, on obtient $\boxed{f'(1)=-2}$.`,"ta-tangent"),
  question("4.4",r`Pour $f(x)=x-2+1/x$, donner le minimum relatif atteint sur $]0;+\infty[$.`,["0"],r`Sur $]0;1[$, $f'$ est négative ; sur $]1;+\infty[$, elle est positive. Il y a donc un minimum relatif en $x=1$, de valeur $f(1)=1-2+1=\boxed0$.`,"ta-relative-extrema"),
 ],writtenTasks:[writing("tangent",r`Déterminer la tangente à $f(x)=-x^2-2$ au point d’abscisse $1$.`,r`On calcule d’abord $f(1)=-3$ et $f'(1)=-2$. La formule de la tangente est $y=f'(1)(x-1)+f(1)$, donc :
$$y=-2(x-1)-3=\boxed{-2x-1}.$$
La droite passe bien par $(1;-3)$ et son coefficient directeur vaut $-2$.`,["La dérivée est calculée.","f(1) et f′(1) ne sont pas confondus.","La formule de la tangente est appliquée puis simplifiée."],"ta-tangent")]},
 {id:"ta-eval-root",title:"Justifier puis encadrer une solution",pages:[18,19],method:r`La continuité et le changement de signe donnent l’existence. La monotonie stricte donne l’unicité. Un encadrement se justifie par les signes aux deux bornes.`,examples:[],questions:[
  question("5.1",r`Pour $f(x)=x^3-12x+10$, calculer $f(0)$.`,["10"],r`On remplace $x$ par zéro : $0^3-12\times0+10=\boxed{10}$.`,"ta-intermediate-values"),
  question("5.2",r`Pour la même fonction, calculer $f(0,5)$.`,["4,125","4.125","33/8"],r`$f(0,5)=(0,5)^3-12\times0,5+10=0,125-6+10=\boxed{4,125}$.`,"ta-bisection"),
  question("5.3",r`Pour la même fonction, calculer $f(0,9)$.`,["-0,071","-0.071","-71/1000"],r`$f(0,9)=0,729-10,8+10=\boxed{-0,071}$.`,"ta-intermediate-values"),
 ],writtenTasks:[writing("unique-root",r`Prouver que $x^3-12x+10=0$ a une unique solution $\alpha$ sur $[0;1]$, puis justifier $0,8<\alpha<0,9$.`,r`La fonction $f(x)=x^3-12x+10$ est continue sur $[0;1]$ car c’est un polynôme. Ses valeurs $f(0)=10$ et $f(1)=-1$ sont de signes contraires : une solution existe dans $]0;1[$.

Pour $x\in[0;1]$, $f'(x)=3x^2-12\leq-9<0$. La fonction est strictement décroissante, donc la solution est unique.

Enfin, $f(0,8)=0,912>0$ et $f(0,9)=-0,071<0$. Par continuité et unicité, $\boxed{0,8<\alpha<0,9}$.`,["Continuité sur [0;1] justifiée.","Valeurs aux bornes de signes contraires.","Monotonie stricte pour l’unicité.","Deux calculs et conclusion de l’encadrement."],"ta-intermediate-values")]},
 {id:"ta-eval-study",title:"Étude complète et application",pages:[19,20,25,26,27,28],method:r`Relie chaque calcul à son rôle : un dénominateur non nul donne le domaine ; des limites donnent les asymptotes ; le signe de la dérivée donne les variations.`,examples:[rationalStudyExample],questions:[
  question("6.1",r`Pour $f(x)=(x^2+3x+3)/(x+1)$, calculer $f(0)$.`,["3"],r`$f(0)=(0+0+3)/(0+1)=\boxed3$. Ce point est aussi le minimum relatif de la branche située à droite de l’asymptote verticale.`,"ta-rational-study"),
  question("6.2",r`Pour cette même fonction, calculer $f(-2)$.`,["-1"],r`$f(-2)=(4-6+3)/(-2+1)=1/(-1)=\boxed{-1}$.`,"ta-rational-study"),
  question("6.3",r`On étudie $B(x)=-x^2+7200x-7\,760\,000$ pour $x\geq0$. Pour quelle valeur de $x$ le maximum est-il atteint ?`,["3600"],r`$B'(x)=-2x+7200$. Elle s’annule lorsque $-2x+7200=0$, soit $x=3600$. Elle est positive avant et négative après : le maximum est atteint pour $\boxed{x=3600}$.`,"ta-complete-study"),
  question("6.4",r`Quelle est la valeur de ce maximum ?`,["5200000","5 200 000"],r`$B(3600)=-(3600)^2+7200\times3600-7\,760\,000$. Donc :
$$B(3600)=-12\,960\,000+25\,920\,000-7\,760\,000=\boxed{5\,200\,000}.$$`,"ta-complete-study"),
 ],writtenTasks:[writing("rational-study",r`Étudier $f(x)=(x^2+3x+3)/(x+1)$ : domaine, limites, asymptotes, dérivée, variations et centre de symétrie.`,r`Le domaine est $\mathbb R\setminus\{-1\}$. La décomposition $f(x)=x+2+1/(x+1)$ simplifie l’étude.

Les limites en $-1^-$ et $-1^+$ valent respectivement $-\infty$ et $+\infty$ : l’asymptote verticale est $x=-1$. Aux deux infinis, $1/(x+1)\to0$, donc $y=x+2$ est asymptote oblique. La courbe est sous cette droite à gauche de $-1$ et au-dessus à droite.

La dérivée est $f'(x)=x(x+2)/(x+1)^2$. Elle est positive pour $x<-2$ et pour $x>0$, négative sur $]-2;-1[$ et $]-1;0[$. Les valeurs remarquables sont $f(-2)=-1$, maximum relatif, et $f(0)=3$, minimum relatif.

Enfin, pour $h\neq0$, $f(-1+h)+f(-1-h)=2$. Le domaine est symétrique par rapport à $-1$, donc le centre est $A(-1;1)$. Les huit étapes de la solution ci-dessus détaillent chaque calcul.`,["Domaine et séparation des deux branches.","Quatre limites et asymptotes justifiées.","Signe de la différence avec l’asymptote oblique.","Dérivée, signe et valeurs aux extrema.","Identité et domaine pour la symétrie."],"ta-rational-study")]},
];
