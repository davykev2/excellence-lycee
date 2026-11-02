import { probabilityExercise as ex, num, written as w, tf, lawTable } from "./terminalCProbabilityBuilders";

export const probabilityDeepeningC = [
  ex(49,"Grattage puis loterie",String.raw`Un ticket coûte $10\,000$ F CFA. Le grattage donne $100\,000$ F CFA avec probabilité $1/50$ ($G$), sinon rien. Une seconde phase, la loterie, attribue soit le lot $A$ de $100\,000$ F CFA, soit le lot $B$ de $200\,000$ F CFA, soit rien ($R$).

Sachant que le grattage est perdant : $P_{\overline G}(A)=1/70$ et $P_{\overline G}(B)=1/490$. Les probabilités de la loterie après un grattage gagnant sont à déterminer. $X$ est le gain total **net de la mise**. On donne $P(X=90000)=13/500$ et $P(X=190000)=1/125$.`,[
    w("1.","Construis un arbre de choix avec les probabilités déjà connues.",String.raw`Premières branches : $G$ de poids $1/50$ et $\overline G$ de poids $49/50$. Chaque branche se partage ensuite en $A,B,R$.

Depuis $\overline G$, les poids sont $1/70,1/490$ et $1-1/70-1/490$. Depuis $G$, notons provisoirement $a,b,r$ les poids, avec $a+b+r=1$. Les questions 4 permettront de les calculer ; on ne les devine pas.`),
    num("2.",String.raw`Calcule $P_{\overline G}(R)$.`,String.raw`\frac{241}{245}`,["241/245","482/490"],String.raw`Les trois issues de la loterie sont incompatibles et couvrent tous les cas :
$$P_{\overline G}(R)=1-\frac1{70}-\frac1{490}
=1-\frac{7+1}{490}=\boxed{\frac{241}{245}}.$$`),
    w("3.a)","Détermine le gain algébrique sur chacun des six chemins.",String.raw`On additionne les recettes des deux phases puis on retire **une seule fois** la mise de $10000$ :

| Chemin | Gain net en F CFA |
| --- | --- |
| $G,A$ | $100000+100000-10000=190000$ |
| $G,B$ | $100000+200000-10000=290000$ |
| $G,R$ | $100000-10000=90000$ |
| $\overline G,A$ | $100000-10000=90000$ |
| $\overline G,B$ | $200000-10000=190000$ |
| $\overline G,R$ | $-10000$ |`),
    w("3.b)","Déduis-en les valeurs possibles de X.",String.raw`Deux gains apparaissent chacun sur deux chemins. Après regroupement des valeurs identiques :
$$\boxed{X(\Omega)=\{-10000;90000;190000;290000\}}.$$
Il y a six feuilles dans l’arbre mais seulement quatre gains distincts.`),
    w("4.a)",String.raw`Démontre que $P_G(A)=3/10$.`,String.raw`Le gain $190000$ vient de $(G,A)$ ou $(\overline G,B)$. Posons $a=P_G(A)$ :
$$\frac1{125}=\frac1{50}a+\frac{49}{50}\frac1{490}
=\frac a{50}+\frac1{500}.$$
Comme $1/125=4/500$, on obtient $a/50=3/500$, puis $\boxed{a=3/10}$.`),
    w("4.b)",String.raw`Démontre que $P_G(R)=6/10$.`,String.raw`Le gain $90000$ vient de $(G,R)$ ou $(\overline G,A)$. Posons $r=P_G(R)$ :
$$\frac{13}{500}=\frac r{50}+\frac{49}{50}\frac1{70}
=\frac r{50}+\frac7{500}.$$
Ainsi $r/50=6/500$, donc $\boxed{r=6/10}$. Le dernier poids vaut alors $P_G(B)=1-3/10-6/10=1/10$.`),
    w("5.a)","Détermine la loi de probabilité de X.",String.raw`Le gain $-10000$ ne vient que du chemin $(\overline G,R)$ :
$$P(X=-10000)=\frac{49}{50}\frac{241}{245}=\frac{241}{250}.$$
Le gain $290000$ ne vient que de $(G,B)$ : $P(X=290000)=(1/50)(1/10)=1/500$. Les deux autres probabilités sont données et ont été utilisées pour compléter l’arbre. La loi est :`+"\n\n"+lawTable(["-10000","90000","190000","290000"],["241/250","13/500","1/125","1/500"])+String.raw`

La somme vaut $(482+13+4+1)/500=1$.`),
    w("5.b)","Calcule E(X) et interprète.",String.raw`On calcule avec les gains nets :
$$E(X)=(-10000)\frac{241}{250}
+90000\frac{13}{500}+190000\frac1{125}+290000\frac1{500}$$
$$=-9640+2340+1520+580=\boxed{-5200\ {\rm F\ CFA}}.$$
Le jeu est défavorable au joueur : la perte moyenne théorique est de $5200$ F CFA par ticket. De gros gains possibles ne suffisent pas à rendre l’espérance positive.`),
  ],{correctionFigureKey:"tc-l9-probability"}),
  ex(50,"Couleur d’une fléchette et réussite",String.raw`On prend au hasard une fléchette : elle est bleue avec probabilité $0,25$, rouge avec probabilité $0,75$. La probabilité d’atteindre la cible avec une bleue est $0,7$ ; celle de manquer avec une rouge est $0,3$. $R$ : « rouge » ; $C$ : « cible atteinte ». Pour chaque couple, indique s’il est indépendant.`,[
    tf("1.",String.raw`$R$ et $C$ sont indépendants.`,true,String.raw`Avec une rouge, $P_R(C)=1-0,3=0,7$, la même probabilité qu’avec une bleue. Les probabilités totales donnent $P(C)=0,75(0,7)+0,25(0,7)=0,7$. Comme $P_R(C)=P(C)$ et $P(R)>0$, **$R$ et $C$ sont indépendants**.`),
    tf("2.",String.raw`$\overline R$ et $C$ sont indépendants.`,true,String.raw`L’indépendance de $R,C$ entraîne celle de $\overline R,C$. On peut aussi vérifier directement :
$$P(\overline R\cap C)=0,25\times0,7=0,175
=P(\overline R)P(C).$$
Le couple est donc **indépendant**.`),
    tf("3.",String.raw`$R$ et $\overline R$ sont indépendants.`,false,String.raw`Ces deux événements sont incompatibles, donc $P(R\cap\overline R)=0$. Mais $P(R)P(\overline R)=0,75\times0,25=0,1875>0$. Les deux nombres ne sont pas égaux : **ils ne sont pas indépendants**. Un événement non certain et non impossible n’est jamais indépendant de son propre contraire.`),
  ]),
];
