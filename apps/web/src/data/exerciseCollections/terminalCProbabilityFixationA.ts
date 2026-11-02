import { probabilityExercise as ex, num, written as w, choice } from "./terminalCProbabilityBuilders";

const vaccine=String.raw`Dans une ville, $80\,\%$ de la population est vaccinée. Parmi les vaccinés, $15\,\%$ ont la COVID-19 ; parmi les non-vaccinés, $40\,\%$ l’ont. On choisit une personne au hasard. $V$ : « vaccinée » ; $C$ : « a la COVID-19 ». Les données sont celles de cet exercice. Les résultats sont demandés en fractions irréductibles.`;
export const probabilityFixationA = [
  ex(1,"Probabilité conditionnelle : choisir la formule",String.raw`$A,B$ sont deux événements du même univers. Pour les probabilités conditionnelles utilisées, les événements conditionnants ont une probabilité non nulle. Choisis l’unique réponse juste.`,[
    choice("1.",String.raw`La probabilité de $B$ sachant $A$ se note…`,[String.raw`$P_B(A)$`,String.raw`$P_A(B)$`,String.raw`$P(A\cap B)$`],1,String.raw`Dans $P_A(B)$, l’indice $A$ est ce que l’on sait déjà. On cherche alors la probabilité de $B$. La bonne réponse est **b** ; $P_B(A)$ conditionne dans l’autre sens.`),
    choice("2.",String.raw`La probabilité de $B$ sachant $A$ est égale à…`,[String.raw`$\frac{P(A\cap B)}{P(A)}$`,String.raw`$\frac{P(A\cap B)}{P(B)}$`,String.raw`$P(A\cap B)$`],0,String.raw`La définition donne $P_A(B)=P(A\cap B)/P(A)$, avec $P(A)>0$. Le dénominateur correspond à l’événement connu. La bonne réponse est **a**.`),
    choice("3.",String.raw`La probabilité de $A$ et $B$ est égale à…`,[String.raw`$P(B)P_A(B)$`,String.raw`$P(A)+P_A(B)$`,String.raw`$P(A)P_A(B)$`],2,String.raw`De $P_A(B)=P(A\cap B)/P(A)$, on déduit $P(A\cap B)=P(A)P_A(B)$ en multipliant par $P(A)$. La bonne réponse est **c**. Aucune indépendance n’est nécessaire.`),
    choice("4.",String.raw`La probabilité de $B$ est égale à…`,[String.raw`$P(A\cap B)+P(A)$`,String.raw`$P(A\cap B)+P(\overline A\cap B)$`,String.raw`$P(A\cap\overline B)+P(\overline A\cap B)$`],1,String.raw`$B$ se décompose en deux parties incompatibles : $A\cap B$ et $\overline A\cap B$. On additionne leurs probabilités. La bonne réponse est **b** ; la réponse c décrit un autre événement.`),
  ]),
  ex(2,"Vaccination et conditionnement",vaccine,[
    w("1.a)","Construis l’arbre pondéré.",String.raw`Premières branches : $V$ de poids $4/5$ et $\overline V$ de poids $1/5$. Depuis $V$, les branches vers $C,\overline C$ portent $3/20,17/20$. Depuis $\overline V$, elles portent $2/5,3/5$. À chaque nœud, la somme des deux poids est $1$.`),
    num("1.b.i)",String.raw`Donne $P(V)$.`,String.raw`\frac45`,["4/5"],String.raw`$80\,\%=80/100=4/5$. C’est la proportion de vaccinés **dans toute la population**, donc $\boxed{P(V)=4/5}$.`),
    num("1.b.ii)",String.raw`Donne $P_V(C)$.`,String.raw`\frac3{20}`,["3/20"],String.raw`On se limite aux vaccinés ; $15\,\%$ d’entre eux ont la maladie. Ainsi $\boxed{P_V(C)=15/100=3/20}$. Ce n’est pas encore une intersection.`),
    num("2.a)",String.raw`Calcule $P(V\cap C)$.`,String.raw`\frac3{25}`,["3/25"],String.raw`On multiplie les poids du chemin « vacciné puis malade » :
$$P(V\cap C)=P(V)P_V(C)=\frac45\times\frac3{20}=\boxed{\frac3{25}}.$$`),
    num("2.b)",String.raw`Calcule $P(\overline V\cap C)$.`,String.raw`\frac2{25}`,["2/25"],String.raw`Pour « non vacciné et malade », le chemin donne :
$$P(\overline V\cap C)=\frac15\times\frac25=\boxed{\frac2{25}}.$$
Le contraire porte sur $V$ seulement, pas sur $C$.`),
  ],{correctionFigureKey:"tc-l9-probability"}),
  ex(3,"Révisions et réussite au BAC",String.raw`Après le BAC, un sondage indique que $90\,\%$ des élèves ont révisé sérieusement ; parmi eux, $80\,\%$ ont réussi. Parmi ceux qui n’ont pas révisé sérieusement, $30\,\%$ ont réussi. $R$ : « a révisé sérieusement » ; $B$ : « a obtenu le BAC ».`,[
    num("1.a.i)",String.raw`Donne $P(R)$.`,String.raw`\frac9{10}`,["9/10","0.9","0,9"],String.raw`La proportion d’élèves qui ont révisé est donnée directement : $\boxed{P(R)=90/100=9/10}$. Le complément $P(\overline R)$ vaut $1/10$.`),
    num("1.a.ii)",String.raw`Donne $P_R(B)$.`,String.raw`\frac45`,["4/5","0.8","0,8"],String.raw`Parmi les élèves ayant révisé, $80\,\%$ ont réussi. Il s’agit donc de $\boxed{P_R(B)=4/5}$, et non de $P(R\cap B)$.`),
    num("1.a.iii)",String.raw`Donne $P_{\overline R}(B)$.`,String.raw`\frac3{10}`,["3/10","0.3","0,3"],String.raw`Le groupe connu est ici celui des élèves n’ayant pas révisé : $30\,\%$ d’entre eux ont réussi. Donc $\boxed{P_{\overline R}(B)=3/10}$.`),
    w("1.b)","Complète l’arbre pondéré.",String.raw`Les premières branches ont pour poids $9/10$ et $1/10$. Depuis $R$ : $B$ porte $4/5$, $\overline B$ porte $1/5$. Depuis $\overline R$ : $B$ porte $3/10$, $\overline B$ porte $7/10$. Les poids complémentaires se trouvent en soustrayant de $1$.`),
    num("2.a.i)",String.raw`Calcule $P(R\cap B)$.`,String.raw`\frac{18}{25}`,["18/25","0.72","0,72"],String.raw`Le chemin correspondant a pour probabilité $P(R)P_R(B)=\frac9{10}\times\frac45=\boxed{18/25}$.`),
    num("2.a.ii)",String.raw`Calcule $P(\overline R\cap B)$.`,String.raw`\frac3{100}`,["3/100","0.03","0,03"],String.raw`On suit l’autre chemin de réussite : $P(\overline R)P_{\overline R}(B)=\frac1{10}\times\frac3{10}=\boxed{3/100}$.`),
    num("2.b)",String.raw`Déduis-en $P(B)$.`,String.raw`\frac34`,["3/4","0.75","0,75"],String.raw`Les deux chemins de réussite sont incompatibles :
$$P(B)=\frac{18}{25}+\frac3{100}=\frac{72+3}{100}=\boxed{\frac34}.$$`),
  ],{figureKey:"tc-l9-tree-blank",correctionFigureKey:"tc-l9-probability"}),
  ex(4,"Remonter une probabilité conditionnelle",vaccine,[
    w("1.",String.raw`Justifie que $P(C)=1/5$.`,String.raw`Les événements $V,\overline V$ forment une partition. Par probabilités totales :
$$P(C)=\frac45\times\frac3{20}+\frac15\times\frac25
=\frac3{25}+\frac2{25}=\boxed{\frac15}.$$
On a compté les malades vaccinés et les malades non vaccinés.`),
    num("2.","Une personne a la COVID-19. Quelle est la probabilité qu’elle soit vaccinée ?",String.raw`\frac35`,["3/5","0.6","0,6"],String.raw`On cherche $P_C(V)$, pas $P_V(C)$. Comme $P(C)=1/5>0$ :
$$P_C(V)=\frac{P(V\cap C)}{P(C)}=\frac{3/25}{1/5}
=\boxed{\frac35}.$$
Le dénominateur est la proportion totale de malades.`),
  ]),
  ex(5,"Deux fournisseurs de beurre de cacao",String.raw`Un grossiste achète $80\,\%$ des boîtes au fournisseur $A$, le reste au fournisseur $B$. Des traces de matières grasses végétales sont présentes dans $10\,\%$ des boîtes de $A$ et $20\,\%$ de celles de $B$. $S$ désigne la présence de traces. On choisit une boîte au hasard.`,[
    w("1.","Construis l’arbre pondéré.",String.raw`Les premières branches portent $P(A)=4/5$ et $P(B)=1/5$. Depuis $A$, les poids vers $S,\overline S$ sont $1/10,9/10$. Depuis $B$, ils sont $1/5,4/5$. $A$ et $B$ sont ici des fournisseurs distincts couvrant tout le stock.`),
    num("2.",String.raw`Calcule $P(B\cap\overline S)$.`,String.raw`\frac4{25}`,["4/25","0.16","0,16"],String.raw`Pour une boîte venant de $B$ **sans traces**, on utilise $P_B(\overline S)=1-1/5=4/5$ :
$$P(B\cap\overline S)=\frac15\times\frac45=\boxed{\frac4{25}}.$$`),
    w("3.","Justifie que la probabilité de ne trouver aucune trace est 0,88.",String.raw`Les deux chemins sans traces sont $A\cap\overline S$ et $B\cap\overline S$ :
$$P(\overline S)=\frac45\times\frac9{10}+\frac15\times\frac45
=\frac{36}{50}+\frac8{50}=\boxed{0,88}.$$`),
    num("4.","Une boîte présente des traces. Quelle est la probabilité qu’elle provienne de B ?",String.raw`\frac13`,["1/3"],String.raw`$P(B\cap S)=\frac15\times\frac15=1/25$. Le complément du résultat précédent donne $P(S)=1-0,88=0,12=3/25$.
$$P_S(B)=\frac{1/25}{3/25}=\boxed{\frac13}.$$`),
  ],{correctionFigureKey:"tc-l9-probability"}),
  ex(6,"Choisir une urne parmi trois",String.raw`$U_1$ contient 1 rouge et 5 jaunes ; $U_2$ contient 3 rouges et 1 jaune ; $U_3$ contient 1 rouge et 2 jaunes. Les trois urnes ont la même probabilité d’être choisies. On tire ensuite une boule au hasard dans l’urne choisie.`,[
    num("1.","Calcule la probabilité de tirer une boule rouge.",String.raw`\frac5{12}`,["5/12"],String.raw`Chaque urne est choisie avec probabilité $1/3$. Les proportions rouges sont $1/6,3/4,1/3$. Par probabilités totales :
$$P(R)=\frac13\left(\frac16+\frac34+\frac13\right)
=\frac13\times\frac{2+9+4}{12}=\boxed{\frac5{12}}.$$
Il ne faut pas mélanger toutes les boules : les urnes, et non les boules du stock total, sont choisies équiprobablement.`),
  ],{correctionFigureKey:"tc-l9-probability"}),
  ex(7,"Une boule puis un jeton",String.raw`Une urne contient 2 boules bleues $B$ et 3 rouges $R$. Le sac bleu contient 1 jeton bleu $b$ et 3 rouges $r$ ; le sac rouge contient 2 jetons bleus et 2 rouges. On tire une boule puis un jeton dans le sac de même couleur. Les issues sont décrites par les couleurs obtenues.`,[
    w("1.","Combien y a-t-il d’issues possibles ? Justifie.",String.raw`Pour les couleurs, les issues sont $(B,b),(B,r),(R,b),(R,r)$ : **quatre issues**. Si on distinguait physiquement les boules et jetons, il y aurait $5\times4=20$ couples ; mais l’expérience est ici décrite par ses couleurs, dont les probabilités ne sont pas toutes égales.`),
    w("2.","À l’aide d’un arbre pondéré, calcule la probabilité de chaque issue.",String.raw`Les premières branches portent $2/5$ pour $B$ et $3/5$ pour $R$. Depuis $B$, les poids sont $1/4,3/4$ ; depuis $R$, ils sont $1/2,1/2$.
$$P(B,b)=\frac25\frac14=\frac1{10},\quad P(B,r)=\frac25\frac34=\frac3{10},$$
$$P(R,b)=\frac35\frac12=\frac3{10},\quad P(R,r)=\frac35\frac12=\frac3{10}.$$
La somme vaut $1$.`),
    num("3.","Calcule la probabilité que la boule et le jeton soient de même couleur.",String.raw`\frac25`,["2/5","0.4","0,4"],String.raw`L’événement rassemble les chemins $(B,b)$ et $(R,r)$, incompatibles. On additionne :
$$P(\text{même couleur})=\frac1{10}+\frac3{10}=\boxed{\frac25}.$$`),
  ],{correctionFigureKey:"tc-l9-probability"}),
  ex(8,"Football et tennis",String.raw`Une association a 96 membres. Parmi eux, 12 sont inscrits au football, 32 au tennis et 4 aux deux. On choisit une fiche au hasard. $A$ : « inscrit au football » ; $B$ : « inscrit au tennis ».`,[
    w("1.","Démontre que A et B sont indépendants.",String.raw`Les fiches sont équiprobables :
$$P(A)=\frac{12}{96}=\frac18,\quad P(B)=\frac{32}{96}=\frac13,\quad P(A\cap B)=\frac4{96}=\frac1{24}.$$
Le produit vaut $P(A)P(B)=\frac18\times\frac13=\frac1{24}=P(A\cap B)$. Donc **$A$ et $B$ sont indépendants**. Ils ne sont pas incompatibles puisqu’il existe quatre membres inscrits aux deux.`),
  ]),
  ex(9,"Indépendance et réunion",String.raw`$A,B$ sont indépendants, $P(A)=1/5$ et $P(A\cup B)=1/2$.`,[
    num("1.",String.raw`Calcule $P(B)$.`,String.raw`\frac38`,["3/8","0.375","0,375"],String.raw`Posons $b=P(B)$. L’indépendance donne $P(A\cap B)=b/5$. La formule de la réunion devient :
$$\frac12=\frac15+b-\frac b5=\frac15+\frac45b.$$
Donc $(4/5)b=3/10$, d’où $\boxed{P(B)=3/8}$.`),
  ]),
  ex(10,"Langues et activités sportives",String.raw`On choisit au hasard un des 150 stagiaires.

| | Handball | Natation | Basket |
| --- | --- | --- | --- |
| Anglais | 45 | 18 | 27 |
| Espagnol | 33 | 9 | 18 |`,[
    w("1.","Démontre que « étudier l’espagnol » et « pratiquer le handball » ne sont pas indépendants.",String.raw`Notons $E,H$ ces événements. Les totaux sont $60$ pour l’espagnol et $78$ pour le handball :
$$P(E)=\frac{60}{150}=\frac25,\quad P(H)=\frac{78}{150}=\frac{13}{25}.$$
Or $P(E\cap H)=33/150=11/50$, tandis que $P(E)P(H)=26/125$. Ces nombres sont différents ($0,22\ne0,208$). **Les événements ne sont pas indépendants.**`),
    w("2.","Démontre que « étudier l’anglais » et « pratiquer le basket » sont indépendants.",String.raw`Notons $A,K$ ces événements. Les totaux sont $90$ pour l’anglais et $45$ pour le basket :
$$P(A)=\frac35,\quad P(K)=\frac3{10},\quad P(A\cap K)=\frac{27}{150}=\frac9{50}.$$
Le produit $P(A)P(K)=\frac35\times\frac3{10}=9/50$ est égal à la probabilité de l’intersection. **Les événements sont indépendants.**`),
  ]),
];
