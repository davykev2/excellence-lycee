import type {CourseDocumentQuestion,CourseEvaluationGroup,CourseWrittenTask} from "../../domain/courseDocument";
import {probabilityExample as e} from "./terminalAProbabilitySummary";
const r=String.raw;
const q=(id:string,prompt:string,accepted:string[],correction:string,topicId:string):CourseDocumentQuestion=>({id:"ta-proba-"+id,label:id,prompt,answer:{kind:"short",accepted},expected:accepted[0],correction,topicId,points:1});
const w=(id:string,prompt:string,model:string,criteria:string[],topicId:string):CourseWrittenTask=>({id:"ta-proba-writing-"+id,prompt,model,criteria,topicId});

/** Common A1/A2 applications. No random-variable exercise is included here. */
export const probabilityCommonEvaluations:CourseEvaluationGroup[]=[
 {id:"ta-proba-eval-events",title:"Décrire et comparer des événements",pages:[2,3,4],method:"Écris d’abord les issues. Pour deux événements contraires, vérifie qu’ils sont incompatibles et que leur réunion est tout l’univers.",examples:[],questions:[
  q("1.1","Deux événements contraires sont incompatibles. Réponds par vrai ou faux.",["Vrai","V"],r`Une issue ne peut pas appartenir à $A$ et à son contraire en même temps. Donc $A\cap\overline A=\varnothing$ : l’affirmation est vraie.`,"ta-proba-opposite"),
  q("1.2","Un événement qui ne se réalise jamais est appelé événement certain. Vrai ou faux ?",["Faux","F"],"L’événement qui ne se réalise jamais est impossible. L’événement certain, au contraire, se réalise quelle que soit l’issue. L’affirmation est fausse.","ta-proba-opposite"),
  q("1.3","Deux événements incompatibles sont nécessairement contraires. Vrai ou faux ?",["Faux","F"],r`Deux événements peuvent être disjoints sans couvrir tout l’univers. Par exemple, $\{1\}$ et $\{2\}$ au lancer d’un dé sont incompatibles mais non contraires.`,"ta-proba-opposite"),
  q("1.4","Le nombre d’éléments d’un ensemble fini est appelé son cardinal. Vrai ou faux ?",["Vrai","V"],r`C’est la définition du cardinal. Par exemple, $\operatorname{card}(\{1;2;3;4;5;6\})=6$. L’affirmation est vraie.`,"ta-proba-universe"),
 ],writtenTasks:[
  w("coin-universe","On lance deux fois une pièce. Écris l’univers et l’événement B : « face au premier lancer ».",r`Avec $P$ pour pile et $F$ pour face, l’univers est :
$$\Omega=\{(P,P);(P,F);(F,P);(F,F)\}.$$
Le premier symbole donne le premier lancer. L’événement demandé retient donc les couples commençant par $F$ :
$$B=\{(F,P);(F,F)\}.$$
On ne remplace pas ces couples par de simples nombres de faces : l’ordre des lancers compte.`,["Les quatre couples sont présents.","L’ordre des deux lancers est respecté.","B contient exactement FP et FF."],"ta-proba-universe"),
  w("incompatible","Donne un exemple de deux événements incompatibles qui ne sont pas contraires, puis justifie.",r`Au lancer d’un dé à six faces, prenons $A=\{1\}$ et $B=\{2\}$.

Leur intersection est vide, donc ils sont incompatibles. Mais $A\cup B=\{1;2\}$ n’est pas égal à l’univers $\{1;2;3;4;5;6\}$. Ils ne sont donc pas contraires. Il manque, par exemple, l’issue $3$ dans leur réunion.`,["Un univers est précisé.","L’intersection est vide.","La réunion ne couvre pas l’univers."],"ta-proba-opposite"),
 ]},
 {id:"ta-proba-eval-properties",title:"Probabilités d’issues, réunion et contraire",pages:[5,6,10,11],method:"La somme des probabilités des issues vaut 1. Pour une réunion, retranche l’intersection ; pour un contraire, retranche la probabilité de l’événement à 1.",examples:[],questions:[
  q("2.1",r`Un dé vérifie $P(1)=P(3)=P(4)=1/8$ et $P(2)=P(6)=1/4$. Calculer $P(5)$.`,["1/8","0,125"],r`Les cinq probabilités connues ont pour somme $3\times1/8+2\times1/4=7/8$. Donc $P(5)=1-7/8=\boxed{1/8}$.`,"ta-proba-weights"),
  q("2.2",r`Un autre dé vérifie $P(1)=\cdots=P(5)$ et $P(6)=3P(1)$. Calculer $P(6)$.`,["3/8","0,375"],r`Posons $p=P(1)$. La somme des probabilités vaut $5p+3p=1$, donc $p=1/8$. Ainsi $P(6)=3p=\boxed{3/8}$.`,"ta-proba-weights"),
  q("2.3",r`On donne $P(A)=0,3$, $P(B)=0,5$, $P(A\cap B)=0,1$. Calculer $P(A\cup B)$.`,["0,7","7/10"],r`$P(A\cup B)=P(A)+P(B)-P(A\cap B)$. Donc $0,3+0,5-0,1=\boxed{0,7}$.`,"ta-proba-properties"),
  q("2.4",r`Avec les mêmes données, calculer $P(\overline A)$.`,["0,7","7/10"],r`La probabilité d’un événement contraire vaut $1$ moins celle de l’événement : $P(\overline A)=1-0,3=\boxed{0,7}$.`,"ta-proba-properties"),
  q("2.5",r`Avec les mêmes données, calculer $P(\overline B)$.`,["0,5","1/2"],r`$P(\overline B)=1-P(B)=1-0,5=\boxed{0,5}$.`,"ta-proba-properties"),
  q("2.6",r`Avec les mêmes données, calculer $P(\overline{A\cup B})$.`,["0,3","3/10"],r`On a déjà $P(A\cup B)=0,7$. On prend le contraire de cette réunion : $1-0,7=\boxed{0,3}$. La barre porte sur toute la réunion.`,"ta-proba-properties"),
 ]},
 {id:"ta-proba-eval-coins",title:"Quatre pièces dans un sac",pages:[6],statement:r`Un sac contient cinq pièces de $500$ F, dix pièces de $250$ F et quinze pièces de $25$ F. Les pièces sont indiscernables au toucher. On en tire quatre simultanément au hasard, sans remise.`,method:r`Les issues sont les ensembles de quatre pièces physiques. Il y en a $\binom{30}{4}$. Pour « au moins une », pense au contraire « aucune ».`,examples:[],questions:[
  q("3.1","Combien y a-t-il de tirages possibles ?",["27405","27 405"],r`Il y a $30$ pièces et l’ordre ne compte pas. Donc :
$$\binom{30}{4}=\frac{30\times29\times28\times27}{4\times3\times2\times1}=\boxed{27405}.$$`,"ta-proba-combinations"),
  q("3.2","Calculer la probabilité de ne tirer aucune pièce de 25 F.",["13/261","1365/27405"],r`Les pièces qui ne valent pas $25$ F sont au nombre de $15$. On choisit quatre pièces parmi elles :
$$P(C)=\frac{\binom{15}{4}}{\binom{30}{4}}=\frac{1365}{27405}=\boxed{\frac{13}{261}}.$$`,"ta-proba-combinations"),
  q("3.3","Calculer la probabilité de ne tirer que des pièces de 250 F.",["2/261","210/27405"],r`Les quatre pièces doivent provenir des dix pièces de $250$ F :
$$P(D)=\frac{\binom{10}{4}}{27405}=\frac{210}{27405}=\boxed{\frac2{261}}.$$`,"ta-proba-combinations"),
  q("3.4","Calculer la probabilité de tirer au moins une pièce de 500 F.",["2951/5481","14755/27405"],r`On soustrait à $1$ la probabilité de ne tirer aucune pièce de $500$ F. Le choix se fait alors parmi $25$ pièces :
$$P(E)=1-\frac{\binom{25}{4}}{27405}.$$
Comme $\binom{25}{4}=12650$, le résultat est $\boxed{2951/5481}$.`,"ta-proba-combinations"),
  q("3.5","Calculer la probabilité d’obtenir au moins une pièce de chaque valeur.",["75/203","10125/27405"],r`Une catégorie fournit deux pièces et les deux autres en fournissent une chacune. Les trois nombres de choix sont $1500$, $3375$ et $5250$. Les cas étant incompatibles, on additionne :
$$P(F)=\frac{1500+3375+5250}{27405}=\boxed{\frac{75}{203}}.$$`,"ta-proba-combinations"),
 ],writtenTasks:[w("three-values","Explique pourquoi les tirages comportant au moins une pièce de chaque valeur se répartissent en trois cas, puis détaille le calcul.",r`Il faut répartir quatre pièces entre trois valeurs en utilisant chaque valeur au moins une fois. La seule forme possible est $2+1+1$.

- Deux pièces de $500$ F : $\binom52\binom{10}{1}\binom{15}{1}=1500$ choix.
- Deux pièces de $250$ F : $\binom{10}{2}\binom51\binom{15}{1}=3375$ choix.
- Deux pièces de $25$ F : $\binom{15}{2}\binom51\binom{10}{1}=5250$ choix.

Un tirage ne peut appartenir qu’à un de ces cas. Il y a donc $10125$ choix favorables parmi $27405$, d’où $P(F)=75/203$.`,["La répartition 2 + 1 + 1 est expliquée.","Les choix des différentes catégories sont multipliés.","Les trois cas incompatibles sont additionnés.","Le dénominateur compte tous les tirages possibles."],"ta-proba-combinations")]},
 {id:"ta-proba-eval-yasmine",title:"Les trois boules de Yasmine",pages:[11,12],statement:"Une urne contient cinq boules noires et quinze rouges. On tire trois boules simultanément au hasard, toutes les boules ayant les mêmes chances d’être choisies.",method:"Compte les ensembles de trois boules. Pour exactement une noire, choisis aussi les deux rouges ; pour au moins une noire, le contraire est « trois rouges ».",examples:[],questions:[
  q("4.1","Compter tous les tirages possibles.",["1140","1 140"],r`On choisit trois boules parmi vingt : $\binom{20}{3}=20\times19\times18/(3\times2\times1)=\boxed{1140}$.`,"ta-proba-combinations"),
  q("4.2","Calculer la probabilité d’obtenir exactement une boule noire.",["35/76","105/228","525/1140"],r`On choisit une noire parmi cinq et deux rouges parmi quinze. Le nombre favorable est $5\times\binom{15}{2}=525$. Ainsi :
$$P(A)=\frac{525}{1140}=\boxed{\frac{35}{76}}.$$`,"ta-proba-combinations"),
  q("4.3","Calculer la probabilité d’obtenir exactement deux boules noires.",["5/38","150/1140"],r`On choisit deux noires et une rouge : $\binom52\times15=150$. Donc $P(B)=150/1140=\boxed{5/38}$.`,"ta-proba-combinations"),
  q("4.4","Calculer la probabilité d’obtenir exactement trois boules noires.",["1/114","10/1140"],r`Les trois boules sont choisies parmi les cinq noires. Il y a $\binom53=10$ choix, donc $P(C)=10/1140=\boxed{1/114}$.`,"ta-proba-combinations"),
  q("4.5","Calculer la probabilité d’obtenir au moins une boule noire.",["137/228","685/1140"],r`Le contraire correspond à trois rouges : $\binom{15}{3}=455$ choix. Donc :
$$P(D)=1-\frac{455}{1140}=\boxed{\frac{137}{228}}.$$`,"ta-proba-properties"),
 ],writtenTasks:[w("yasmine-complement",r`Retrouve $P(D)=137/228$ par deux méthodes : événement contraire, puis réunion de cas incompatibles.`,r`Par le contraire, $D$ ne se réalise pas si les trois boules sont rouges :
$$P(D)=1-\frac{\binom{15}{3}}{1140}=\frac{685}{1140}.$$
Par réunion de cas, « au moins une noire » signifie exactement une, deux ou trois noires. Ces cas sont incompatibles :
$$P(D)=\frac{525+150+10}{1140}=\frac{685}{1140}.$$
Dans les deux méthodes, on obtient $\boxed{137/228}$.`,["Le contraire est correctement identifié.","Les trois cas couvrent D sans chevauchement.","Les nombres de tirages favorables sont justifiés.","Les deux méthodes donnent le même résultat."],"ta-proba-combinations")]},
 {id:"ta-proba-eval-desserts",title:"Choisir quatre desserts",pages:[12],statement:"Le chariot contient dix desserts à la vanille, trois à la fraise, quatre au chocolat, cinq à la menthe et six au caramel. Un enfant choisit au hasard quatre desserts, sans remise ; tous les choix de quatre desserts sont supposés équiprobables.",method:"Les desserts sont des objets distincts. Une seule sorte peut être de la vanille, de la menthe, du caramel ou du chocolat ; trois desserts à la fraise ne suffisent pas à en choisir quatre.",examples:[],questions:[
  q("5.1","Combien de choix de quatre desserts sont possibles ?",["20475","20 475"],r`Il y a $10+3+4+5+6=28$ desserts. Le nombre de choix vaut $\binom{28}{4}=\boxed{20475}$.`,"ta-proba-combinations"),
  q("5.2","Calculer la probabilité de ne choisir que des desserts à la vanille.",["14/1365","2/195","210/20475"],r`On choisit les quatre desserts parmi les dix à la vanille :
$$P(A)=\frac{\binom{10}{4}}{20475}=\frac{210}{20475}=\boxed{\frac{14}{1365}}.$$`,"ta-proba-combinations"),
  q("5.3","Calculer la probabilité de ne choisir qu’une seule sorte de desserts.",["11/975","231/20475"],r`Les choix possibles sont $\binom{10}{4}=210$ pour la vanille, $\binom54=5$ pour la menthe, $\binom64=15$ pour le caramel et $\binom44=1$ pour le chocolat. Pour la fraise, aucun choix de quatre n’est possible. Ainsi :
$$P(B)=\frac{210+5+15+1}{20475}=\boxed{\frac{11}{975}}.$$`,"ta-proba-combinations"),
  q("5.4","Calculer la probabilité de choisir un dessert à la fraise et trois au chocolat.",["4/6825","12/20475"],r`Il y a trois choix du dessert à la fraise et $\binom43=4$ choix des trois chocolats. Donc $3\times4=12$ choix favorables et $P(C)=\boxed{4/6825}$.`,"ta-proba-combinations"),
  q("5.5","Calculer la probabilité de choisir au moins un dessert à la vanille.",["387/455","1161/1365","17415/20475"],r`Le contraire est « aucune vanille ». Il reste dix-huit desserts, donc :
$$P(D)=1-\frac{\binom{18}{4}}{20475}=1-\frac{3060}{20475}.$$
On obtient $\boxed{P(D)=387/455}$.`,"ta-proba-properties"),
 ],writtenTasks:[w("dessert-cases","Justifie pourquoi on additionne quatre nombres de choix pour l’événement « une seule sorte de desserts ».",r`On sépare les choix en fonction de la sorte : quatre vanilles, quatre fraises, quatre chocolats, quatre menthes ou quatre caramels.

Le cas « quatre fraises » est impossible car il n’y en a que trois. Pour les quatre autres cas, les nombres de choix sont respectivement $210$, $1$, $5$ et $15$.

Ces cas sont incompatibles : un choix de quatre vanilles n’est pas aussi un choix de quatre menthes. On additionne donc leurs nombres de choix : $210+1+5+15=231$, puis on divise par $20475$.`,["Toutes les sortes sont envisagées.","Le cas fraise est exclu pour la bonne raison.","L’incompatibilité justifie l’addition.","Le nombre total de choix reste le même."],"ta-proba-combinations")]},
];

export const probabilityVariableEvaluations:CourseEvaluationGroup[]=[
 {id:"ta-proba-eval-urn-law",title:"Loi et indicateurs d’une variable aléatoire",pages:[8,9],statement:"Une urne contient deux boules noires et trois rouges. On tire simultanément deux boules au hasard. X désigne le nombre de boules noires tirées.",method:"Commence par les valeurs de X. Construis sa loi en comptant les tirages, puis calcule successivement l’espérance, la variance et l’écart type.",examples:[],questions:[
  q("6.1",r`Calculer $P(X=0)$.`,["3/10","0,3"],r`Aucune noire signifie deux rouges. Il y a $\binom32=3$ choix parmi $\binom52=10$, donc $P(X=0)=\boxed{3/10}$.`,"ta-proba-law"),
  q("6.2",r`Calculer $P(X=1)$.`,["3/5","6/10","0,6"],r`Une noire parmi deux et une rouge parmi trois donnent $2\times3=6$ choix parmi dix. Donc $P(X=1)=\boxed{3/5}$.`,"ta-proba-law"),
  q("6.3",r`Calculer $P(X=2)$.`,["1/10","0,1"],r`On doit tirer les deux noires : un seul choix parmi dix. Donc $P(X=2)=\boxed{1/10}$.`,"ta-proba-law"),
  q("6.4",r`Calculer $E(X)$.`,["4/5","0,8"],r`On pondère les valeurs par leurs probabilités :
$$E(X)=0\times\frac3{10}+1\times\frac6{10}+2\times\frac1{10}=\boxed{\frac45}.$$`,"ta-proba-expectation"),
  q("6.5",r`Calculer $V(X)$.`,["9/25","0,36"],r`La somme pondérée des carrés vaut $0+6/10+4/10=1$. On retranche le carré de l’espérance :
$$V(X)=1-(4/5)^2=\boxed{9/25}.$$`,"ta-proba-variance"),
  q("6.6",r`Calculer $\sigma(X)$.`,["3/5","0,6"],r`L’écart type est la racine carrée positive de la variance : $\sigma(X)=\sqrt{9/25}=\boxed{3/5}$.`,"ta-proba-variance"),
 ],writtenTasks:[w("urn-law","Présente la loi complète de X et explique pourquoi ses trois valeurs ne sont pas équiprobables.",r`$X$ peut valoir $0$, $1$ ou $2$. Sur les dix tirages possibles, trois donnent deux rouges, six donnent une noire et une rouge, un donne deux noires.

| $x_i$ | $0$ | $1$ | $2$ |
|---|---|---|---|
| $P(X=x_i)$ | $3/10$ | $6/10$ | $1/10$ |

Les dix tirages de boules sont équiprobables, mais les trois valeurs de $X$ regroupent des nombres de tirages différents. Elles ne sont donc pas équiprobables. La somme des probabilités vaut bien $1$.`,["Les trois valeurs possibles sont données.","Chaque probabilité est justifiée par un comptage.","La somme vaut 1.","Issues et valeurs de X sont distinguées."],"ta-proba-law")]},
 {id:"ta-proba-eval-moments",title:"Lire une loi donnée",pages:[11],statement:r`La variable $X$ prend les valeurs $-15$, $0$, $15$, $30$ avec les probabilités respectives $1/8$, $3/8$, $3/8$, $1/8$.`,method:"Calcule l’espérance avant la variance. Les valeurs négatives deviennent positives lorsqu’on les élève au carré.",examples:[e("ta-proba-moments-example","Calculer la somme pondérée des carrés",[
  ["a)","Calculer la moyenne des carrés des valeurs de X.",r`$$(-15)^2\times\frac18+0^2\times\frac38+15^2\times\frac38+30^2\times\frac18.$$
Le numérateur vaut $225+0+675+900=1800$, donc la somme vaut $1800/8=\boxed{225}$.`],
 ])],questions:[
  q("7.1",r`Calculer $E(X)$.`,["15/2","7,5","60/8"],r`$$E(X)=\frac{-15+0+45+30}{8}=\frac{60}{8}=\boxed{\frac{15}{2}}.$$`,"ta-proba-expectation"),
  q("7.2",r`Calculer $V(X)$.`,["675/4","168,75","1350/8"],r`La moyenne des carrés vaut $225$. On retranche le carré de $E(X)=15/2$ :
$$V(X)=225-\frac{225}{4}=\boxed{\frac{675}{4}}.$$`,"ta-proba-variance"),
 ],writtenTasks:[w("standard-deviation",r`Donne la valeur exacte de l’écart type, puis une valeur approchée au centième.`,r`On part de $V(X)=675/4$ :
$$\sigma(X)=\sqrt{\frac{675}{4}}.$$
Comme $675=225\times3$, on obtient :
$$\boxed{\sigma(X)=\frac{15\sqrt3}{2}}.$$
La calculatrice donne environ $12,99038$, soit $\boxed{12,99}$ au centième. On ne confond pas cet écart type avec la variance $168,75$.`,["La racine carrée porte sur la variance entière.","La simplification de 675 est correcte.","L’arrondi est effectué à la fin."],"ta-proba-variance")]},
 {id:"ta-proba-eval-kermesse",title:"La kermesse de Mariam",pages:[9,10],statement:"L’urne contient quatre boules vertes, trois jaunes, deux bleues et une rouge. On tire une boule au hasard. Les sommes reçues sont respectivement 20 F, 30 F, m F et 100 F, où m > 0. X désigne la somme reçue ; aucune mise n’est donnée.",method:"Calcule l’espérance par couleurs. Pour « en moyenne au moins 45 F », résous E(X) ≥ 45. Ce n’est pas une garantie de gain à chaque partie.",examples:[],questions:[
  q("8.1","Calculer la probabilité de tirer une boule verte.",["2/5","4/10","0,4"],r`Il y a quatre boules vertes parmi dix boules équiprobables. La probabilité vaut $4/10=\boxed{2/5}$.`,"ta-proba-kermesse"),
  q("8.2",r`Pour $m=90$, calculer $E(X)$.`,["45"],r`On a $E(X)=(270+2m)/10$. Pour $m=90$, cela donne $(270+180)/10=\boxed{45}$.`,"ta-proba-kermesse"),
  q("8.3",r`Quelle est la valeur minimale de $m$ pour avoir $E(X)\geq45$ ?`,["90"],r`$(270+2m)/10\geq45$ équivaut à $270+2m\geq450$, puis $2m\geq180$, soit $m\geq90$. La valeur minimale est $\boxed{90}$ F.`,"ta-proba-kermesse"),
  q("8.4",r`Si $m=20$, calculer $P(X=20)$.`,["3/5","6/10","0,6"],r`Quand $m=20$, les quatre boules vertes **et les deux bleues** donnent toutes $20$ F. Les deux catégories doivent être regroupées :
$$P(X=20)=\frac{4+2}{10}=\boxed{\frac35}.$$`,"ta-proba-law"),
 ],writtenTasks:[w("minimum-gain","Rédige le raisonnement qui permet à Mariam d’obtenir une espérance d’au moins 45 F.",r`Les dix boules sont équiprobables. On calcule l’espérance en pondérant les sommes reçues par les probabilités des couleurs :
$$E(X)=20\times\frac4{10}+30\times\frac3{10}+m\times\frac2{10}+100\times\frac1{10}.$$
On obtient $E(X)=(270+2m)/10$. L’objectif se traduit par $E(X)\geq45$.

En multipliant par $10>0$, puis en isolant $m$, on obtient successivement $270+2m\geq450$, $2m\geq180$ et $m\geq90$.

La valeur minimale est donc **90 F**. Ce résultat porte sur une moyenne théorique ; des parties individuelles peuvent rapporter moins de $45$ F. L’énoncé donne la somme reçue, pas un gain net après paiement d’une mise.`,["Les probabilités sont associées aux bonnes couleurs.","L’espérance est une somme pondérée.","L’inéquation traduit « au moins ».","La valeur minimale et le sens du résultat sont expliqués."],"ta-proba-kermesse")]},
 {id:"ta-proba-eval-model",title:"Un seuil dans un modèle de probabilité",pages:[12,13],statement:r`Dans une population théorique, $x\in[0;1]$ est la proportion de personnes malades. Un test est positif pour $98$ personnes sur $100$ parmi les malades et pour $1$ personne sur $100$ parmi les non-malades. On admet que la probabilité d’être malade sachant que le test est positif vaut $f(x)=98x/(97x+1)$. Le critère mathématique étudié est $f(x)\geq0,95$.`,method:"Le dénominateur est strictement positif sur [0;1]. On peut donc multiplier par ce dénominateur sans changer le sens de l’inégalité. Distingue la proportion exacte de son pourcentage arrondi.",examples:[],questions:[
  q("9.1",r`Calculer $f(0,05)$, arrondi au centième.`,["0,84","0.84"],r`$f(0,05)=4,9/5,85\approx0,8376068$. L’arrondi au centième est $\boxed{0,84}$, inférieur à $0,95$.`,"ta-proba-model"),
  q("9.2",r`Donner la proportion seuil exacte, sous forme de fraction.`,["19/117"],r`Le dénominateur est positif. L’inéquation devient $98x\geq0,95(97x+1)$, soit $5,85x\geq0,95$. Donc :
$$x\geq\frac{0,95}{5,85}=\boxed{\frac{19}{117}}.$$
Il s’agit d’une proportion, pas d’un nombre directement exprimé en pourcent.`,"ta-proba-model"),
  q("9.3","Si on exprime la proportion seulement en pourcentages entiers, quel est le plus petit pourcentage satisfaisant le critère ? Répondre sans le signe %.",["17"],r`Le seuil exact vaut environ $16,2393\,\%$. Le pourcentage entier $16\,\%$ est trop petit ; $17\,\%$ est le premier entier suffisant. La réponse est donc $\boxed{17}$.`,"ta-proba-model"),
 ],writtenTasks:[w("exact-threshold",r`Résous $98x/(97x+1)\geq0,95$ sur $[0;1]$ et précise ce que signifie le seuil.`,r`Pour $x\in[0;1]$, $97x+1\geq1>0$. On multiplie donc sans inverser l’inégalité :
$$98x\geq0,95(97x+1).$$
En développant, $98x\geq92,15x+0,95$, donc $5,85x\geq0,95$. Il vient $x\geq19/117$.

Les solutions sur le domaine sont $[19/117;1]$. Le seuil représente environ $16,24\,\%$. Si l’on exige un pourcentage entier, le minimum est $17\,\%$, mais ce dernier nombre n’est pas le seuil exact. Cette interprétation concerne seulement le modèle et le critère donnés dans l’exercice.`,["Le domaine est pris en compte.","Le signe du dénominateur est justifié.","Le seuil exact est conservé.","Proportion, pourcentage approché et pourcentage entier sont distingués."],"ta-proba-model")]},
];
