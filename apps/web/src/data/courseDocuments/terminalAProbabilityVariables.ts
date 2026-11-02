import type {CourseDocumentSection} from "../../domain/courseDocument";
import {probabilityTopic as t,probabilityExample as e} from "./terminalAProbabilitySummary";
const r=String.raw;

/** The source expressly reserves this entire part to Terminale A1. */
export const probabilityVariableSection:CourseDocumentSection={id:"ta-proba-variables",numeral:"IV",title:"Variables aléatoires et applications",topics:[
 t("ta-proba-variable","Associer un nombre à chaque issue",[7],r`Une **variable aléatoire** est une fonction qui associe un nombre réel à chaque issue de l’expérience :
$$X:\Omega\longrightarrow\mathbb R.$$
L’ensemble de ses valeurs possibles est noté $\Omega'=X(\Omega)$.

L’événement $\{X=x\}$ réunit les issues qui donnent la valeur $x$. Il faut distinguer **l’issue** de l’expérience et **la valeur** attribuée à cette issue.`,[
  e("ta-proba-parity-variable","Associer 0 ou 1 au résultat d’un dé",[
   ["a)","On pose X = 0 si le nombre est pair et X = 1 s’il est impair. Quelles valeurs X peut-elle prendre ?",r`Les nombres pairs donnent $0$ et les nombres impairs donnent $1$. Donc $\boxed{\Omega'=\{0;1\}}$. Il y a six issues pour le dé, mais seulement deux valeurs pour $X$.`],
   ["b)",r`Écrire les événements $\{X=0\}$ et $\{X=1\}$.`,r`$\{X=0\}=\{2;4;6\}$ et $\{X=1\}=\{1;3;5\}$. Si le dé est équilibré, chaque événement a pour probabilité $3/6=1/2$.`],
  ]),
 ]),
 {...t("ta-proba-law","Construire la loi de probabilité",[7,8,9],r`La loi de $X$ associe à chaque **valeur distincte** $x_i$ la probabilité $P(X=x_i)$.

| Valeur | $x_1$ | $x_2$ | $\cdots$ | $x_m$ |
|---|---|---|---|---|
| Probabilité | $p_1$ | $p_2$ | $\cdots$ | $p_m$ |

Les probabilités sont positives ou nulles et leur somme vaut $1$.

Pour construire ce tableau, on liste d’abord les valeurs possibles, puis on regroupe les issues qui donnent chacune de ces valeurs. **Deux issues différentes peuvent donner la même valeur de $X$.**`,[
  e("ta-proba-urn-law","Deux boules parmi deux noires et trois rouges",[
   ["a)","On tire deux boules simultanément. X compte les boules noires. Donner ses valeurs possibles.",r`On peut obtenir aucune boule noire, une boule noire ou deux boules noires : $\boxed{\Omega'=\{0;1;2\}}$. Ces trois cas sont tous possibles.`],
   ["b)","Déterminer chaque probabilité.",r`Le nombre de tirages de deux boules parmi cinq est $\binom52=10$.

- $X=0$ : deux rouges, soit $\binom32=3$ tirages, donc $P(X=0)=3/10$.
- $X=1$ : une noire et une rouge, soit $2\times3=6$ tirages, donc $P(X=1)=6/10$.
- $X=2$ : les deux noires, soit un tirage, donc $P(X=2)=1/10$.`],
   ["c)","Présenter et vérifier la loi.",r`| $x_i$ | $0$ | $1$ | $2$ |
|---|---|---|---|
| $P(X=x_i)$ | $3/10$ | $6/10$ | $1/10$ |

La somme vaut $(3+6+1)/10=1$ : toutes les possibilités sont prises en compte.`],
  ]),
 ]),interaction:{kind:"diagram",eyebrow:"Explorer",title:"Trois valeurs, dix tirages possibles",instruction:"Sélectionne une valeur de X pour retrouver les tirages correspondants.",observation:"Les valeurs 0, 1 et 2 ne sont pas équiprobables : leurs probabilités dépendent du nombre de tirages qui les réalisent.",rootLabel:"X : nombre de boules noires parmi deux boules",nodes:[
  {id:"zero",label:"X = 0",role:"Deux rouges",detail:"Trois choix de deux rouges parmi trois : P(X = 0) = 3/10."},
  {id:"one",label:"X = 1",role:"Une noire et une rouge",detail:"Deux choix de la noire et trois choix de la rouge : 2 × 3 = 6 tirages, donc P(X = 1) = 6/10."},
  {id:"two",label:"X = 2",role:"Deux noires",detail:"Un seul choix des deux noires : P(X = 2) = 1/10. La somme 3/10 + 6/10 + 1/10 vaut 1."},
 ]}},
 t("ta-proba-expectation","Calculer et interpréter l’espérance",[8,9,11],r`L’espérance est la moyenne des valeurs de $X$, **pondérée par leurs probabilités** :
$$\boxed{E(X)=p_1x_1+\cdots+p_mx_m}.$$
Elle donne la moyenne théorique vers laquelle se rapproche la moyenne des résultats sur un grand nombre de répétitions indépendantes dans le même modèle. Elle ne prévoit pas le résultat d’une partie isolée.

Si $X$ représente un **gain algébrique**, après prise en compte de la mise :

| Espérance | Interprétation pour le joueur |
|---|---|
| $E(X)=0$ | jeu équitable |
| $E(X)>0$ | jeu favorable |
| $E(X)<0$ | jeu défavorable |

Si l’énoncé donne seulement une somme reçue, une éventuelle mise doit être retranchée avant de conclure sur le gain net.`,[
  e("ta-proba-urn-expectation","Espérance du nombre de boules noires",[
   ["a)",r`Utiliser la loi $P(X=0)=3/10$, $P(X=1)=6/10$, $P(X=2)=1/10$.`,r`On multiplie chaque valeur par sa probabilité, puis on additionne :
$$E(X)=0\times\frac3{10}+1\times\frac6{10}+2\times\frac1{10}.$$
Donc $\boxed{E(X)=8/10=4/5=0,8}$. La moyenne théorique est $0,8$ boule noire par tirage, même si chaque tirage contient un nombre entier de boules noires.`],
  ]),
 ]),
 t("ta-proba-variance","Variance et écart type",[8,9,11],r`### Formules

$$\boxed{V(X)=p_1x_1^2+\cdots+p_mx_m^2-[E(X)]^2}.$$
$$\boxed{\sigma(X)=\sqrt{V(X)}}.$$

La variance et l’écart type mesurent la dispersion autour de l’espérance. La variance est positive ou nulle. L’écart type s’exprime dans la même unité que $X$.

Dans la somme, on élève les **valeurs** $x_i$ au carré, pas les probabilités. On garde les fractions exactes jusqu’à la fin et on retranche bien le carré de l’espérance.`,[
  e("ta-proba-urn-variance","Terminer l’étude de l’urne",[
   ["a)","Calculer la variance de X.",r`La moyenne des carrés vaut :
$$0^2\times\frac3{10}+1^2\times\frac6{10}+2^2\times\frac1{10}=1.$$
Comme $E(X)=4/5$, on obtient :
$$V(X)=1-\left(\frac45\right)^2=1-\frac{16}{25}=\boxed{\frac9{25}}.$$`],
   ["b)","Calculer l’écart type de X.",r`On prend la racine carrée positive de la variance :
$$\sigma(X)=\sqrt{\frac9{25}}=\boxed{\frac35}=0{,}6.$$`],
  ]),
 ]),
 t("ta-proba-kermesse","Utiliser une espérance pour déterminer un gain",[9,10],r`On tire une boule dans une urne contenant trois jaunes, deux bleues, une rouge et quatre vertes. Les dix boules sont indiscernables au toucher.

| Couleur | Verte | Jaune | Bleue | Rouge |
|---|---|---|---|---|
| Somme reçue en F | $20$ | $30$ | $m$ | $100$ |
| Probabilité | $4/10$ | $3/10$ | $2/10$ | $1/10$ |

On cherche le réel $m>0$ pour lequel la somme reçue a une espérance d’au moins $45$ F.

Ce tableau distingue les **couleurs**. Si $m$ est égal à un autre gain, les probabilités correspondantes doivent être regroupées dans la loi de $X$ ; le calcul de l’espérance par couleurs reste valable.`,[
  e("ta-proba-kermesse-example","Résoudre la question de Mariam",[
   ["a)","Exprimer l’espérance en fonction de m.",r`On additionne les gains pondérés :
$$E(X)=20\times\frac4{10}+30\times\frac3{10}+m\times\frac2{10}+100\times\frac1{10}.$$
Les contributions connues donnent $8+9+10=27$. Donc :
$$\boxed{E(X)=27+\frac m5=\frac{270+2m}{10}}.$$`],
   ["b)","Déterminer la valeur minimale de m.",r`On traduit « en moyenne au moins $45$ F » par $E(X)\geq45$ :
$$\frac{270+2m}{10}\geq45.$$
En multipliant par $10>0$, $270+2m\geq450$, puis $2m\geq180$. Ainsi $\boxed{m\geq90}$ et la valeur minimale est **90 F**.

Cette conclusion concerne la moyenne théorique ; elle ne garantit pas un gain de $45$ F à chaque partie.`],
  ]),
 ]),
 {...t("ta-proba-model","Exploiter un modèle de probabilité",[12,13],r`Dans une population théorique, $x$ désigne la proportion de personnes atteintes d’une maladie. On suppose que le test étudié donne un résultat positif :

- pour $98$ personnes sur $100$ parmi les personnes malades ;
- pour $1$ personne sur $100$ parmi les personnes non malades.

On note $f(x)$ la probabilité qu’une personne soit malade **sachant que son test est positif**. Pour $x\in[0;1]$, on admet le modèle :
$$f(x)=\frac{98x}{97x+1}.$$
Le critère retenu dans cet exercice est $f(x)\geq0,95$. Pour résoudre cette inéquation, on remarque d’abord que $97x+1\geq1>0$ : multiplier par ce dénominateur ne change pas le sens de l’inégalité.

Le seuil est ici une **convention de l’exercice mathématique**, pas un critère médical universel.`,[
  e("ta-proba-model-example","Valeur en 0,05 et seuil exact",[
   ["a)",r`Calculer $f(0,05)$ et comparer à $0,95$.`,r`$$f(0{,}05)=\frac{98\times0{,}05}{97\times0{,}05+1}=\frac{4{,}9}{5{,}85}.$$
On obtient environ $0,8376$, soit $\boxed{0,84}$ au centième. Cette valeur est inférieure à $0,95$ : le critère n’est pas atteint.`],
   ["b)",r`Résoudre $f(x)\geq0,95$ sur $[0;1]$.`,r`Le dénominateur est strictement positif. Donc :
$$98x\geq0{,}95(97x+1).$$
Après développement : $98x\geq92,15x+0,95$, puis $5,85x\geq0,95$. Ainsi :
$$\boxed{x\geq\frac{19}{117}}.$$
Le seuil exact représente environ **16,24 %**. Si les proportions sont exprimées uniquement en pourcentages entiers, le plus petit entier qui satisfait le critère est $17\,\%$.`],
  ]),
 ]),interaction:{kind:"curve",eyebrow:"Explorer",title:"Une proportion et le seuil du modèle",instruction:"Déplace x et compare f(x) à la droite horizontale d’ordonnée 0,95.",observation:"Le seuil exact est x = 19/117, soit environ 16,24 %. En x = 0,05, la valeur est environ 0,84.",formula:"f(x) = 98x/(97x + 1)",formulaTex:r`f(x)=\frac{98x}{97x+1}`,rule:{kind:"rational-linear",numerator:[98,0],denominator:[97,1]},window:{xMin:0,xMax:1,yMin:0,yMax:1.05},guides:[{kind:"horizontal",value:.95,label:"seuil : 0,95"},{kind:"vertical",value:19/117,label:"x = 19/117"}],marker:{min:0,max:1,step:.005,initial:.05}}},
]};
