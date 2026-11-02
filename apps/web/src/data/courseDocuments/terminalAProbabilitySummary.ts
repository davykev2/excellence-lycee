import type {CourseDocumentSection,CourseDocumentTopic,CourseWorkedExample} from "../../domain/courseDocument";
import type {LessonInteraction} from "../../domain/paths";
export const probabilityTopic=(id:string,title:string,pages:number[],body:string,examples:CourseWorkedExample[]=[]):CourseDocumentTopic=>({id,title,pages,body,examples});
export const probabilityExample=(id:string,title:string,parts:[string,string,string][]):CourseWorkedExample=>({id,title,prompt:"",parts:parts.map(([label,prompt,solution],i)=>({id:id+"-"+(i+1),label,prompt,solution}))});
const t=probabilityTopic,e=probabilityExample,r=String.raw;

const outcomes:LessonInteraction={kind:"diagram",eyebrow:"Explorer",title:"Les quatre issues de deux lancers",instruction:"Choisis une issue et lis les deux résultats dans l’ordre.",observation:"PF et FP sont deux issues différentes. Pour avoir face au premier lancer, on retient FP et FF.",rootLabel:"Premier lancer, puis deuxième lancer",nodes:[
 {id:"PP",label:"PP",role:"Pile, puis pile",detail:"Le premier lancer donne pile et le deuxième donne pile. L’événement « face au premier lancer » n’est pas réalisé."},
 {id:"PF",label:"PF",role:"Pile, puis face",detail:"Le premier lancer donne pile. Cette issue ne réalise donc pas « face au premier lancer », même si le deuxième donne face."},
 {id:"FP",label:"FP",role:"Face, puis pile",detail:"Le premier lancer donne face : cette issue appartient à l’événement B, quel que soit le résultat du deuxième lancer."},
 {id:"FF",label:"FF",role:"Face, puis face",detail:"Le premier lancer donne face : cette issue appartient également à B. Ainsi B = {FP ; FF}."},
]};
const operations:LessonInteraction={kind:"diagram",eyebrow:"Explorer",title:"Pair ou multiple de trois",instruction:"Sélectionne une carte pour comparer les événements.",observation:"L’intersection contient seulement 6 ; la réunion contient 2, 3, 4 et 6. Le « ou » inclut le cas où les deux événements se réalisent.",rootLabel:"Dé : Ω = {1 ; 2 ; 3 ; 4 ; 5 ; 6}",nodes:[
 {id:"A",label:"A",role:"Nombre pair",detail:"A = {2 ; 4 ; 6}. L’issue 2 réalise A, même si ce n’est pas un multiple de trois."},
 {id:"B",label:"B",role:"Multiple de trois",detail:"B = {3 ; 6}. L’issue 3 réalise B, même si elle ne réalise pas A."},
 {id:"intersection",label:"A ∩ B",role:"Les deux à la fois",detail:"A ∩ B = {6}. Seul 6 est à la fois pair et multiple de trois."},
 {id:"union",label:"A ∪ B",role:"Au moins un des deux",detail:"A ∪ B = {2 ; 3 ; 4 ; 6}. On ne compte pas deux fois 6."},
]};

export const probabilityCommonSections:CourseDocumentSection[]=[
 {id:"ta-proba-experiments",numeral:"I",title:"Expérience aléatoire et événements",topics:[
  {...t("ta-proba-universe","Décrire les résultats possibles",[1,2],r`### Expérience aléatoire

Une expérience est **aléatoire** lorsqu’on ne peut pas prévoir avec certitude le résultat avant de la réaliser. Dans cette leçon, les ensembles de résultats étudiés sont finis.

Chaque résultat possible est une **issue**, aussi appelée **éventualité**. L’ensemble de toutes les issues est l’**univers**, noté $\Omega$.

Par exemple, pour un lancer de dé à six faces numérotées de $1$ à $6$ :
$$\Omega=\{1;2;3;4;5;6\}.$$
Le nombre $6$ est une issue ; $\Omega$ est l’ensemble des issues.`,[
   e("ta-proba-two-tosses","Deux lancers d’une pièce",[
    ["a)","Écrire l’univers des deux lancers successifs.",r`On note $P$ pour pile et $F$ pour face. Une issue précise **les deux lancers dans l’ordre** :
$$\Omega=\{(P,P);(P,F);(F,P);(F,F)\}.$$
Les couples $(P,F)$ et $(F,P)$ sont différents : le premier résultat n’est pas le même.`],
    ["b)","Combien cet univers contient-il d’issues ?",r`Il y a deux possibilités au premier lancer et deux au deuxième. Donc :
$$\operatorname{card}(\Omega)=2\times2=\boxed4.$$
Le cardinal est simplement le nombre d’éléments d’un ensemble fini.`],
   ]),
  ]),interaction:outcomes},
  t("ta-proba-events","Reconnaître un événement et sa réalisation",[2,3],r`Un **événement** est une partie de l’univers : il réunit les issues qui vérifient une condition.

| Écriture | Lecture |
|---|---|
| $\omega\in\Omega$ | $\omega$ est une issue de l’expérience |
| $A\subseteq\Omega$ | $A$ est un événement |
| $\omega\in A$ | l’issue $\omega$ réalise l’événement $A$ |

L’événement est réalisé si le résultat obtenu appartient à son ensemble d’issues. Un **événement élémentaire** contient une seule issue.`,[
   e("ta-proba-event-examples","Traduire la condition en ensemble",[
    ["a)","Au lancer d’un dé, écrire A : « obtenir un nombre pair ».",r`Les nombres pairs de l’univers sont $2$, $4$ et $6$. Donc $\boxed{A=\{2;4;6\}}$. Si le dé donne $4$, alors $4\in A$ : $A$ est réalisé.`],
    ["b)","Aux deux lancers de pièce, écrire B : « obtenir face au premier lancer ».",r`Le premier symbole doit être $F$. Le deuxième peut être $P$ ou $F$. Ainsi :
$$\boxed{B=\{(F,P);(F,F)\}}.$$`],
   ]),
  ]),
  {...t("ta-proba-operations","Intersection, réunion et inclusion",[3,4],r`### « Et » et « ou »

- $A\cap B$ est l’événement **« A et B »** : les deux conditions doivent être vérifiées.
- $A\cup B$ est l’événement **« A ou B »** : au moins une condition doit être vérifiée, éventuellement les deux.
- $A\subseteq B$ signifie que toute réalisation de $A$ réalise aussi $B$ : **A implique B**.

Pour le dé, « obtenir un multiple de $6$ » implique « obtenir un nombre pair », car $\{6\}\subseteq\{2;4;6\}$. L’implication inverse n’est pas vraie : $2$ est pair sans être multiple de $6$.`,[
   e("ta-proba-set-example","Comparer A = {2 ; 4 ; 6} et B = {3 ; 6}",[
    ["a)",r`Déterminer $A\cap B$.`,r`On retient les éléments présents **dans les deux ensembles**. Seul $6$ convient : $\boxed{A\cap B=\{6\}}$.`],
    ["b)",r`Déterminer $A\cup B$.`,r`On rassemble les éléments qui figurent dans **au moins un** des deux ensembles, sans les répéter : $\boxed{A\cup B=\{2;3;4;6\}}$.`],
   ]),
  ]),interaction:operations},
  t("ta-proba-opposite","Certain, impossible, contraire et incompatible",[3,4],r`| Notion | Signification | Notation |
|---|---|---|
| Événement certain | toutes les issues le réalisent | $\Omega$ |
| Événement impossible | aucune issue ne le réalise | $\varnothing$ |
| Événement contraire de $A$ | les issues qui ne réalisent pas $A$ | $\overline A=\Omega\setminus A$ |
| Événements incompatibles | aucune issue ne les réalise ensemble | $A\cap B=\varnothing$ |

Deux événements contraires sont toujours incompatibles. Mais deux événements incompatibles ne sont pas forcément contraires : pour être contraires, ils doivent aussi **couvrir tout l’univers**.`,[
   e("ta-proba-opposite-example","Distinguer deux mots proches",[
    ["a)","« Deux événements contraires sont incompatibles. »",r`**Vrai.** Une issue ne peut pas à la fois appartenir à $A$ et ne pas y appartenir. Donc $A\cap\overline A=\varnothing$.`],
    ["b)","« Deux événements incompatibles sont toujours contraires. »",r`**Faux.** Au lancer d’un dé, $A=\{1\}$ et $B=\{2\}$ sont incompatibles, mais $A\cup B=\{1;2\}\neq\Omega$. Les issues $3$, $4$, $5$ et $6$ ne sont dans aucun des deux.`],
   ]),
  ]),
 ]},
 {id:"ta-proba-finite",numeral:"II",title:"Probabilité sur un univers fini",topics:[
  t("ta-proba-weights","Attribuer une probabilité à chaque issue",[5,10,11],r`Pour définir une probabilité sur $\Omega=\{\omega_1;\ldots;\omega_n\}$, on associe à chaque issue un nombre $p_i\geq0$, de sorte que :
$$p_1+p_2+\cdots+p_n=1.$$

La probabilité d’un événement $A$ est la **somme des probabilités de ses issues**. On la note $P(A)$ ; elle vérifie $0\leq P(A)\leq1$.

Avec un dé pipé, les six probabilités ne sont pas forcément égales. On utilise les données de l’énoncé, pas automatiquement $1/6$.`,[
   e("ta-proba-loaded-dice","Retrouver une probabilité manquante",[
    ["a)",r`Un dé vérifie $P(1)=P(3)=P(4)=1/8$ et $P(2)=P(6)=1/4$. Calculer $P(5)$.`,r`La somme des six probabilités vaut $1$. Cinq sont connues, donc :
$$P(5)=1-\left(3\times\frac18+2\times\frac14\right).$$
Comme $3/8+2/4=3/8+4/8=7/8$, on obtient $\boxed{P(5)=1/8}$.`],
    ["b)",r`Un autre dé vérifie $P(1)=\cdots=P(5)$ et $P(6)=3P(1)$. Déterminer les probabilités.`,r`Posons $p=P(1)$. Les cinq premières faces ont chacune la probabilité $p$ et la dernière a la probabilité $3p$. Donc $5p+3p=1$, soit $p=1/8$.

Ainsi $\boxed{P(1)=\cdots=P(5)=1/8}$ et $\boxed{P(6)=3/8}$.`],
   ]),
  ]),
  t("ta-proba-properties","Utiliser les propriétés des probabilités",[5,6],r`Pour deux événements $A$ et $B$ du même univers :

| Propriété | Formule |
|---|---|
| Événement certain | $P(\Omega)=1$ |
| Événement impossible | $P(\varnothing)=0$ |
| Inclusion | si $A\subseteq B$, alors $P(A)\leq P(B)$ |
| Réunion de deux événements | $P(A\cup B)=P(A)+P(B)-P(A\cap B)$ |
| Réunion de deux événements incompatibles | $P(A\cup B)=P(A)+P(B)$ |
| Événement contraire | $P(\overline A)=1-P(A)$ |

Dans une réunion, on retranche l’intersection parce que ses issues ont été comptées deux fois. Pour un événement « au moins un », le contraire « aucun » est souvent plus simple à calculer.`,[
   e("ta-proba-properties-example","Réunion et événements contraires",[
    ["a)",r`On donne $P(A)=0,3$, $P(B)=0,5$ et $P(A\cap B)=0,1$. Calculer $P(A\cup B)$.`,r`On applique la formule, sans oublier l’intersection :
$$P(A\cup B)=0{,}3+0{,}5-0{,}1=\boxed{0{,}7}.$$`],
    ["b)",r`Calculer $P(\overline A)$ et $P(\overline B)$.`,r`L’événement et son contraire ont des probabilités de somme $1$. Donc $P(\overline A)=1-0,3=\boxed{0,7}$ et $P(\overline B)=1-0,5=\boxed{0,5}$.`],
    ["c)",r`Calculer $P(\overline{A\cup B})$.`,r`La barre porte sur **toute la réunion** : on cherche la probabilité que ni $A$ ni $B$ ne se réalise.
$$P(\overline{A\cup B})=1-P(A\cup B)=1-0{,}7=\boxed{0{,}3}.$$`],
   ]),
  ]),
 ]},
 {id:"ta-proba-equiprobability",numeral:"III",title:"Équiprobabilité et dénombrement",topics:[
  t("ta-proba-equal","Reconnaître une situation d’équiprobabilité",[6],r`Il y a **équiprobabilité** lorsque toutes les issues élémentaires ont la même probabilité. Si l’univers contient $n$ issues, chacune a pour probabilité $1/n$.

Dans ce cas seulement :
$$\boxed{P(A)=\frac{\operatorname{card}(A)}{\operatorname{card}(\Omega)}}.$$
Autrement dit : **nombre de cas favorables / nombre de cas possibles**.

Un dé équilibré ou un tirage uniforme d’objets indiscernables au toucher permet d’utiliser ce modèle. Les catégories — couleurs, valeurs ou sommes — ne sont pas automatiquement équiprobables : il faut compter leurs issues.`,[
   e("ta-proba-equal-example","Un dé équilibré",[
    ["a)","Calculer la probabilité d’obtenir un nombre pair.",r`Il y a six issues équiprobables et trois favorables, $2$, $4$ et $6$. Donc $\boxed{P(A)=3/6=1/2}$.`],
   ]),
  ]),
  t("ta-proba-combinations","Compter un tirage simultané",[6,11,12],r`### Choisir sans tenir compte de l’ordre

Tirer simultanément $k$ objets parmi $n$, sans remise, revient à choisir un ensemble de $k$ objets. Le nombre de choix est une **combinaison**, notée $\binom nk$ ou $C_n^k$ :
$$\binom nk=\frac{n!}{k!(n-k)!}.$$
Le nombre $n!$ est le produit des entiers de $1$ à $n$, avec $0!=1$.

Par exemple :
$$\binom{20}{3}=\frac{20\times19\times18}{3\times2\times1}=1140.$$

### Choisir la bonne méthode

- Pour choisir dans plusieurs catégories, on **multiplie** les nombres de choix.
- Pour réunir plusieurs répartitions incompatibles, on **additionne** leurs nombres de choix.
- Pour « au moins un », on peut utiliser le contraire « aucun ».

Même si plusieurs objets ont la même couleur ou la même valeur, on compte les **objets physiques distincts**. On ne considère pas les seules répartitions de couleurs comme des issues équiprobables.`,[
   e("ta-proba-coins","Quatre pièces choisies dans un sac",[
    ["a)","Le sac contient 5 pièces de 500 F, 10 de 250 F et 15 de 25 F. Compter les tirages de quatre pièces.",r`Le sac contient $5+10+15=30$ pièces. Comme le choix est simultané et sans remise :
$$\operatorname{card}(\Omega)=\binom{30}{4}=27405.$$`],
    ["b)","Calculer la probabilité de n’obtenir aucune pièce de 25 F.",r`Il faut choisir les quatre pièces parmi les $5+10=15$ autres pièces. Donc :
$$P(C)=\frac{\binom{15}{4}}{27405}=\frac{1365}{27405}=\boxed{\frac{13}{261}}.$$`],
    ["c)","Calculer la probabilité de n’obtenir que des pièces de 250 F.",r`On choisit quatre pièces parmi les dix pièces de $250$ F :
$$P(D)=\frac{\binom{10}{4}}{27405}=\frac{210}{27405}=\boxed{\frac2{261}}.$$`],
    ["d)","Calculer la probabilité d’obtenir au moins une pièce de 500 F.",r`Le contraire est « aucune pièce de $500$ F ». Il reste $25$ pièces dans les deux autres catégories. Ainsi :
$$P(E)=1-\frac{\binom{25}{4}}{27405}.$$
Comme $\binom{25}{4}=12650$, on obtient :
$$P(E)=\frac{14755}{27405}=\boxed{\frac{2951}{5481}}.$$`],
    ["e)","Calculer la probabilité d’obtenir au moins une pièce de chaque valeur.",r`Avec quatre pièces et trois valeurs, une valeur apparaît deux fois et les deux autres une fois chacune. On distingue trois cas incompatibles :

- deux pièces de $500$ F : $\binom52\times10\times15=1500$ ;
- deux pièces de $250$ F : $\binom{10}{2}\times5\times15=3375$ ;
- deux pièces de $25$ F : $\binom{15}{2}\times5\times10=5250$.

On additionne les cas favorables : $1500+3375+5250=10125$. Donc :
$$P(F)=\frac{10125}{27405}=\boxed{\frac{75}{203}}.$$`],
   ]),
  ]),
 ]},
];
