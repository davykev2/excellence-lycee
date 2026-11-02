import { baryExercise as E,written as W,short as S } from "./terminalCBarycenterBuilders";
export const barycenterFixationA=[
 E(1,"Existence et position de deux barycentres",String.raw`Les points $A,B,C,D,E$ sont fixés. On considère :
$$S_1=\{(A,2),(B,-3),(C,-1),(D,-1),(E,6)\},$$
$$S_2=\{(A,-5),(B,3),(C,-4),(D,2),(E,8)\}.$$`,[
 W("1.a","Justifier l’existence du barycentre G₁ de S₁.",String.raw`La somme des coefficients est $2-3-1-1+6=3\ne0$. Le système $S_1$ possède donc un unique barycentre $G_1$.`),
 W("1.b","Justifier l’existence du barycentre G₂ de S₂.",String.raw`On obtient $-5+3-4+2+8=4\ne0$. Le système $S_2$ possède donc un unique barycentre $G_2$.`),
 W("2.a",String.raw`Exprimer $\overrightarrow{AG_1}$ à l’aide de $\overrightarrow{AB},\overrightarrow{AC},\overrightarrow{AD},\overrightarrow{AE}$.`,String.raw`La formule de réduction, appliquée en $A$, donne :
$$-3\overrightarrow{AB}-\overrightarrow{AC}-\overrightarrow{AD}+6\overrightarrow{AE}=3\overrightarrow{AG_1}.$$
Donc :
$$\boxed{\overrightarrow{AG_1}=-\overrightarrow{AB}-\frac13\overrightarrow{AC}-\frac13\overrightarrow{AD}+2\overrightarrow{AE}.}$$`),
 W("2.b",String.raw`Exprimer de même $\overrightarrow{AG_2}$.`,String.raw`En prenant $M=A$ dans la réduction du système $S_2$ :
$$3\overrightarrow{AB}-4\overrightarrow{AC}+2\overrightarrow{AD}+8\overrightarrow{AE}=4\overrightarrow{AG_2}.$$
Ainsi :
$$\boxed{\overrightarrow{AG_2}=\frac34\overrightarrow{AB}-\overrightarrow{AC}+\frac12\overrightarrow{AD}+2\overrightarrow{AE}.}$$`),
 ]),
 E(2,"Une somme indépendante du point M",String.raw`On considère :
$$\vec u=-6\overrightarrow{MA}+4\overrightarrow{MB}-\overrightarrow{MC}-2\overrightarrow{MD}+5\overrightarrow{ME},$$
$$\vec v=5\overrightarrow{MA}+2\overrightarrow{MB}-3\overrightarrow{MC}-2\overrightarrow{MD}-2\overrightarrow{ME}.$$`,[
 W("1.","Montrer que les deux sommes sont indépendantes de M.",String.raw`Dans $\vec u$, la somme des coefficients vaut $-6+4-1-2+5=0$. Dans $\vec v$, elle vaut $5+2-3-2-2=0$.

En écrivant chaque $\overrightarrow{MX}=\overrightarrow{MA}+\overrightarrow{AX}$, le coefficient total de $\overrightarrow{MA}$ est nul. Les deux sommes ne dépendent donc pas de $M$.`),
 W("2.","Exprimer les deux vecteurs à partir de A.",String.raw`Puisque les sommes sont constantes, choisissons $M=A$. Le vecteur $\overrightarrow{AA}$ est nul :
$$\boxed{\vec u=4\overrightarrow{AB}-\overrightarrow{AC}-2\overrightarrow{AD}+5\overrightarrow{AE},}$$
$$\boxed{\vec v=2\overrightarrow{AB}-3\overrightarrow{AC}-2\overrightarrow{AD}-2\overrightarrow{AE}.}$$`),
 ]),
 E(3,"Déterminer les coefficients autorisés","On cherche les valeurs des paramètres pour lesquelles les systèmes possèdent un barycentre.",[
 W("a.",String.raw`$(A,7),(B,-8),(C,\alpha)$.`,String.raw`La somme est $7-8+\alpha=\alpha-1$. Elle est non nulle si et seulement si $\boxed{\alpha\ne1}$.`),
 W("b.",String.raw`$(A,\frac13),(B,\beta),(C,2),(D,5)$.`,String.raw`La somme vaut $\frac13+\beta+2+5=\beta+\frac{22}{3}$. Le barycentre existe si et seulement si $\boxed{\beta\ne-\frac{22}{3}}$.`),
 ]),
 E(4,"Reconnaître des systèmes homogènes",String.raw`Les coefficients, dans l’ordre $A,B,C,D,E$, sont :

| Système | A | B | C | D | E |
|---|---|---|---|---|---|
| $S_1$ | 6 | 4 | −3 | −2 | 2 |
| $S_2$ | 12 | 8 | 9 | −6 | 6 |
| $S_3$ | 18 | −12 | 9 | −6 | −6 |
| $S_4$ | 2 | $4/3$ | −1 | $-2/3$ | $2/3$ |`,[
 W("1.","Quels systèmes ont nécessairement le même barycentre par homogénéité ?",String.raw`Chaque coefficient de $S_4$ est celui de $S_1$ multiplié par $1/3$. Ainsi $S_1$ et $S_4$ ont le même barycentre.

Pour les autres paires, les rapports ne sont pas tous égaux. On ne peut donc pas conclure par homogénéité. Des coïncidences particulières entre les points restent possibles, mais elles ne sont pas garanties par ces coefficients. Les sommes $7,29,3,7/3$ sont toutes non nulles.`),
 W("2.","Remplacer S₂ par un système de même barycentre et de somme 2.",String.raw`La somme des coefficients de $S_2$ est $12+8+9-6+6=29$. Multiplions tous ses coefficients par $2/29$ :
$$\boxed{\left(A,\frac{24}{29}\right),\left(B,\frac{16}{29}\right),\left(C,\frac{18}{29}\right),\left(D,-\frac{12}{29}\right),\left(E,\frac{12}{29}\right).}$$
Le numérateur de la somme vaut $24+16+18-12+12=58$, donc la nouvelle somme est bien $2$.`),
 ]),
 E(5,"Écrire trois systèmes équivalents",String.raw`On considère $(A,-\frac23),(B,-7),(C,5),(D,2),(E,-\frac34)$.`,[
 W("1.","Donner trois autres systèmes ayant le même barycentre.",String.raw`La somme initiale vaut :
$$-\frac23-7+5+2-\frac34=-\frac{17}{12}\ne0.$$
On peut multiplier tous les coefficients par n’importe quel même réel non nul. Par exemple :

| Multiplicateur | A | B | C | D | E |
|---|---|---|---|---|---|
| $12$ | −8 | −84 | 60 | 24 | −9 |
| $-12$ | 8 | 84 | −60 | −24 | 9 |
| $2$ | $-4/3$ | −14 | 10 | 4 | $-3/2$ |

Ces trois systèmes ont tous le même barycentre que le système initial. Le signe du multiplicateur n’a pas d’importance ; il doit seulement être non nul.`),
 ]),
 E(6,"Réduire cinq sommes vectorielles","Les points P, Q et R sont fixés. Réduire chaque somme.",[
 W("a.",String.raw`$-13\overrightarrow{MP}+21\overrightarrow{MQ}-17\overrightarrow{MR}$.`,String.raw`La somme vaut $-13+21-17=-9$. Si $G=\operatorname{bar}\{(P,-13),(Q,21),(R,-17)\}$, alors la somme est $\boxed{-9\overrightarrow{MG}}$.`),
 W("b.",String.raw`$3\overrightarrow{MP}+2\overrightarrow{MQ}-5\overrightarrow{MR}$.`,String.raw`La somme des coefficients est $0$. En remplaçant $M$ par $P$, on obtient la constante $\boxed{2\overrightarrow{PQ}-5\overrightarrow{PR}}$.`),
 W("c.",String.raw`$4\overrightarrow{MP}-\frac13\overrightarrow{MQ}-\overrightarrow{MR}$.`,String.raw`On a $4-\frac13-1=\frac83\ne0$. Avec $G=\operatorname{bar}\{(P,4),(Q,-\frac13),(R,-1)\}$, on obtient $\boxed{\frac83\overrightarrow{MG}}$.`),
 W("d.",String.raw`$2\overrightarrow{MP}-5\overrightarrow{MQ}+3\overrightarrow{MR}$.`,String.raw`Les coefficients ont pour somme $0$. La somme vaut donc sa valeur en $M=P$, soit $\boxed{-5\overrightarrow{PQ}+3\overrightarrow{PR}}$.`),
 W("e.",String.raw`$11\overrightarrow{MP}-7\overrightarrow{MQ}+\overrightarrow{MR}$.`,String.raw`La somme vaut $11-7+1=5$. En posant $G=\operatorname{bar}\{(P,11),(Q,-7),(R,1)\}$, on trouve $\boxed{5\overrightarrow{MG}}$.`),
 ]),
 E(7,"Attention au sens des vecteurs","Réduire les sommes suivantes.",[
 W("1.",String.raw`$21\overrightarrow{MP}-9\overrightarrow{QM}-13\overrightarrow{MR}$.`,String.raw`D’abord $\overrightarrow{QM}=-\overrightarrow{MQ}$. L’expression devient $21\overrightarrow{MP}+9\overrightarrow{MQ}-13\overrightarrow{MR}$.

La somme vaut $17$. Avec $G=\operatorname{bar}\{(P,21),(Q,9),(R,-13)\}$, le résultat est $\boxed{17\overrightarrow{MG}}$.`),
 W("2.",String.raw`$3\overrightarrow{MP}-7\overrightarrow{MQ}+4\overrightarrow{MR}$.`,String.raw`Puisque $3-7+4=0$, choisissons $M=P$ : la somme est constante et vaut $\boxed{-7\overrightarrow{PQ}+4\overrightarrow{PR}}$.`),
 W("3.",String.raw`$\overrightarrow{MP}+\overrightarrow{MQ}-\frac34\overrightarrow{RM}$.`,String.raw`On a $-\frac34\overrightarrow{RM}=\frac34\overrightarrow{MR}$. La somme des coefficients devient $1+1+\frac34=\frac{11}{4}$.

Si $G=\operatorname{bar}\{(P,1),(Q,1),(R,\frac34)\}$, le résultat est $\boxed{\frac{11}{4}\overrightarrow{MG}}$.`),
 ]),
 E(8,"Coordonnées dans le plan",String.raw`Dans un repère, $A(-1;5)$, $B(0;2)$, $C(\frac12;\sqrt2)$. Déterminer $G=\operatorname{bar}\{(A,-\frac23),(B,4),(C,-1)\}$.`,[
 S("a.",String.raw`Déterminer $x_G$ sous forme exacte.`,String.raw`$\frac1{14}$`,["1/14"],String.raw`La somme vaut $-\frac23+4-1=\frac73$. Ainsi :
$$x_G=\frac{(-\frac23)(-1)+4(0)-\frac12}{7/3}=\frac{2/3-1/2}{7/3}=\frac{1/6}{7/3}=\boxed{\frac1{14}}.$$`),
 S("b.",String.raw`Déterminer $y_G$ sous forme exacte.`,String.raw`$2-\frac{3\sqrt2}{7}$`,["2-3sqrt(2)/7"],String.raw`On utilise le même dénominateur :
$$y_G=\frac{(-\frac23)5+4(2)-\sqrt2}{7/3}=\frac{14/3-\sqrt2}{7/3}=\boxed{2-\frac{3\sqrt2}{7}}.$$
Donc $G(\frac1{14};2-\frac{3\sqrt2}{7})$.`),
 ]),
 E(9,"Coordonnées dans l’espace",String.raw`On donne $A(2;-1;5)$, $B(0;2;-4)$, $C(3;6;\frac12)$ et $D(\sqrt3;-1;-1)$. Déterminer $G=\operatorname{bar}\{(A,-2),(B,3),(C,4),(D,-1)\}$.`,[
 S("a.",String.raw`Calculer $x_G$.`,String.raw`$2-\frac{\sqrt3}{4}$`,["2-sqrt(3)/4"],String.raw`La somme des coefficients est $-2+3+4-1=4$. On a :
$$x_G=\frac{-2(2)+3(0)+4(3)-\sqrt3}{4}=\frac{8-\sqrt3}{4}=\boxed{2-\frac{\sqrt3}{4}}.$$`),
 S("b.",String.raw`Calculer $y_G$.`,String.raw`$\frac{33}{4}$`,["33/4","8.25"],String.raw`On pondère les quatre ordonnées avec les mêmes coefficients, puis on divise par leur somme $4$ :
$$y_G=\frac{-2(-1)+3(2)+4(6)-(-1)}4=\frac{2+6+24+1}4=\boxed{\frac{33}{4}}.$$`),
 S("c.",String.raw`Calculer $z_G$.`,String.raw`$-\frac{19}{4}$`,["-19/4","-4.75"],String.raw`$$z_G=\frac{-2(5)+3(-4)+4(\frac12)-(-1)}4=\frac{-10-12+2+1}4=\boxed{-\frac{19}{4}}.$$
Ainsi $G(2-\frac{\sqrt3}{4};\frac{33}{4};-\frac{19}{4})$.`),
 ]),
 E(10,"Regrouper un milieu",String.raw`$ABC$ est un triangle, $I$ est le milieu de $[AB]$ et $G=\operatorname{bar}\{(A,1),(B,1),(I,2),(C,3)\}$.`,[
 W("a.","Écrire G comme barycentre de I et C.",String.raw`Le groupe $(A,1),(B,1)$ a pour barycentre $I$ et pour somme $2$. Il se remplace par $(I,2)$ :
$$G=\operatorname{bar}\{(I,2),(I,2),(C,3)\}=\boxed{\operatorname{bar}\{(I,4),(C,3)\}}.$$
Les sommes partielles $2$ et totale $7$ sont non nulles.`),
 W("b.",String.raw`Exprimer $\overrightarrow{IG}$ en fonction de $\overrightarrow{IC}$.`,String.raw`Pour le système $(I,4),(C,3)$, la réduction en $I$ donne $3\overrightarrow{IC}=7\overrightarrow{IG}$.

Donc $\boxed{\overrightarrow{IG}=\frac37\overrightarrow{IC}}$. Le point $G$ est situé sur $[IC]$, aux trois septièmes à partir de $I$.`),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
];
