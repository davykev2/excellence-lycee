import { baryExercise as E,written as W,short as S,choice as C } from "./terminalCBarycenterBuilders";
export const barycenterTheorems=[
 E(38,"Ceva et Ménélaüs",String.raw`$ABC$ est un triangle. Les points $A'\in(BC)$, $B'\in(CA)$, $C'\in(AB)$ sont distincts des sommets. Les rapports de cette question sont **orientés** : $\overline{A'B}/\overline{A'C}$, par exemple, compare deux mesures algébriques sur la même droite. `,[
 W("1.",String.raw`Justifier l’existence de $\alpha,\beta,\gamma$ tels que $\alpha\overrightarrow{A'B}+(1-\alpha)\overrightarrow{A'C}=\vec0$, $\beta\overrightarrow{B'C}+(1-\beta)\overrightarrow{B'A}=\vec0$, $\gamma\overrightarrow{C'A}+(1-\gamma)\overrightarrow{C'B}=\vec0$.`,
 String.raw`Tout point d’une droite passant par deux points distincts s’écrit comme leur barycentre de somme $1$.

On obtient donc :
$$A'=\operatorname{bar}\{(B,\alpha),(C,1-\alpha)\},$$
$$B'=\operatorname{bar}\{(C,\beta),(A,1-\beta)\},$$
$$C'=\operatorname{bar}\{(A,\gamma),(B,1-\gamma)\}.$$
Les paramètres ne valent ni $0$ ni $1$, sinon l’un des points serait un sommet. Les trois relations demandées sont exactement les définitions de ces barycentres. `),
 W("2.a",String.raw`Écrire $A'$ avec les coefficients $\alpha\beta(1-\gamma)$ et $(1-\alpha)\beta(1-\gamma)$.`,
 String.raw`Multiplions les coefficients de $A'$ par $\beta(1-\gamma)\ne0$. Par homogénéité :
$$A'=\operatorname{bar}\{(B,\alpha\beta(1-\gamma)),(C,(1-\alpha)\beta(1-\gamma))\}.$$
Leur somme vaut $\beta(1-\gamma)\ne0$.`),
 W("2.b",String.raw`Écrire $B'$ avec les coefficients $(1-\alpha)\beta(1-\gamma)$ et $(1-\alpha)(1-\beta)(1-\gamma)$.`,
 String.raw`Multiplions les coefficients de $B'$ par $(1-\alpha)(1-\gamma)\ne0$ :
$$B'=\operatorname{bar}\{(C,(1-\alpha)\beta(1-\gamma)),(A,(1-\alpha)(1-\beta)(1-\gamma))\}.$$
Là encore la somme, $(1-\alpha)(1-\gamma)$, est non nulle.`),
 W("2.c",String.raw`Écrire $C'$ avec les coefficients $\alpha\beta\gamma$ et $\alpha\beta(1-\gamma)$.`,
 String.raw`En multipliant les coefficients de $C'$ par $\alpha\beta\ne0$ :
$$C'=\operatorname{bar}\{(A,\alpha\beta\gamma),(B,\alpha\beta(1-\gamma))\}.$$
La somme vaut $\alpha\beta\ne0$.`),
 W("3.",String.raw`Démontrer que $(AA'),(BB'),(CC')$ sont parallèles ou concourantes si et seulement si $\frac{\overline{A'B}}{\overline{A'C}}\frac{\overline{B'C}}{\overline{B'A}}\frac{\overline{C'A}}{\overline{C'B}}=-1$.`,
 String.raw`**Traduire les rapports.** La première relation de la question 1 donne :
$$\frac{\overline{A'B}}{\overline{A'C}}=-\frac{1-\alpha}{\alpha}.$$
Les deux autres donnent $-(1-\beta)/\beta$ et $-(1-\gamma)/\gamma$. Le produit vaut $-1$ exactement lorsque :
$$\boxed{\alpha\beta\gamma=(1-\alpha)(1-\beta)(1-\gamma).}\tag{1}$$

**Vérifier les droites, dans les deux sens.** Dans le repère $(A;\overrightarrow{AB},\overrightarrow{AC})$ :
$$A'(\alpha;1-\alpha),\quad B'(0;\beta),\quad C'(1-\gamma;0).$$
Les trois droites ont pour équations :
$$L_1:(1-\alpha)x-\alpha y=0,$$
$$L_2:\beta x+y=\beta,$$
$$L_3:x+(1-\gamma)y=1-\gamma.$$
Posons $D=1-\alpha+\alpha\beta$.

Comme $\alpha\ne0$, $L_1$ donne $y=(1-\alpha)x/\alpha$. En remplaçant dans $L_2$ et en multipliant par $\alpha$, on obtient $Dx=\alpha\beta$.

Si $D\ne0$, les deux premières se coupent donc en $x=\alpha\beta/D$, $y=\beta(1-\alpha)/D$. Ce point appartient à $L_3$ si et seulement si :
$$\alpha\beta+(1-\gamma)\beta(1-\alpha)=(1-\gamma)D,$$
ce qui se simplifie précisément en $(1)$. C’est donc exactement le cas de concurrence.

Si $D=0$, $L_1$ et $L_2$ sont parallèles et distinctes (leurs seconds membres sont $0$ et $\beta\ne0$). La troisième leur est parallèle si et seulement si $\alpha+(1-\alpha)(1-\gamma)=0$. Quand $D=0$, cette dernière égalité équivaut aussi à $(1)$.

Ainsi le produit $-1$ caractérise **la concurrence ou le parallélisme**. Il ne faut pas supprimer le cas parallèle. `),
 W("4.",String.raw`Démontrer que $A',B',C'$ sont alignés si et seulement si le même produit vaut $1$.`,
 String.raw`Le produit vaut $1$ si et seulement si :
$$\alpha\beta\gamma+(1-\alpha)(1-\beta)(1-\gamma)=0.\tag{2}$$
Dans le repère précédent, une équation de la droite $(A'B')$ est :
$$ (\alpha+\beta-1)x+\alpha y=\alpha\beta.$$
On vérifie cette équation en remplaçant par les coordonnées de $A'$ puis de $B'$ ; comme $\alpha\ne0$, elle définit bien une droite.

Le point $C'(1-\gamma;0)$ appartient à cette droite exactement lorsque :
$$ (\alpha+\beta-1)(1-\gamma)=\alpha\beta.$$
En développant et réorganisant, on retrouve $(2)$. C’est donc bien une équivalence : **le produit orienté $1$ caractérise l’alignement**. C’est le théorème de Ménélaüs. `),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(39,"Deux triangles en perspective",String.raw`Les droites $(AA'),(BB'),(CC')$ de deux triangles sont concourantes en $O$, distinct des six sommets. On note $K=(AB)\cap(A'B')$, $J=(AC)\cap(A'C')$, $I=(BC)\cap(B'C')$. On suppose ces intersections uniques, distinctes des sommets, et les trois droites issues de $O$ distinctes. `,[
 W("1.",String.raw`Démontrer $\frac{\overline{AK}}{\overline{BK}}\frac{\overline{BI}}{\overline{CI}}\frac{\overline{CJ}}{\overline{AJ}}=1$.`,
 String.raw`Prenons $O$ pour origine et écrivons $\overrightarrow{OA'}=a\overrightarrow{OA}$, $\overrightarrow{OB'}=b\overrightarrow{OB}$, $\overrightarrow{OC'}=c\overrightarrow{OC}$. Les paramètres sont non nuls.

Dans le plan de $O,A,B$, écrivons $K=(1-t)A+tB=(1-u)aA+ubB$. En comparant les coefficients :
$$1-t=a(1-u),\qquad t=bu.$$
En remplaçant $u=t/b$ dans la première égalité, puis en multipliant par $b$, on trouve $(a-b)t=b(a-1)$. Ainsi $t=b(a-1)/(a-b)$, puis :
$$\frac{\overline{AK}}{\overline{BK}}=-\frac{t}{1-t}
=\frac{b(a-1)}{a(b-1)}.$$
Les hypothèses sur les intersections garantissent que les dénominateurs utiles ne s’annulent pas. Le même calcul sur les deux autres côtés donne :
$$\frac{\overline{BI}}{\overline{CI}}=\frac{c(b-1)}{b(c-1)},\qquad
\frac{\overline{CJ}}{\overline{AJ}}=\frac{a(c-1)}{c(a-1)}.$$
En multipliant, tous les facteurs se simplifient : le produit est $\boxed1$.`),
 W("2.","En déduire que I, J et K sont alignés.",String.raw`Les points $K,I,J$ sont respectivement sur $(AB),(BC),(CA)$. De plus $\overline{AK}/\overline{BK}=\overline{KA}/\overline{KB}$ : changer les deux sens ne change pas le quotient. Il en va de même pour les autres rapports.

La question 1 est donc exactement le critère de Ménélaüs dans le triangle $ABC$. **Les points I, J et K sont alignés.** On retrouve le théorème de Desargues dans cette configuration. `),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(40,"Barycentres et aires",String.raw`$ABC$ est un triangle. Les aires sont positives et notées $\mathcal A(\cdot)$. Les rapports de longueurs de la partie 3 concernent des points intérieurs aux segments. `,[
 W("1.",String.raw`Si $M$ est distinct des sommets et $M=\operatorname{bar}\{(A,\alpha),(B,\beta),(C,\gamma)\}$, montrer $(AM)\parallel(BC)\iff\beta+\gamma=0$.`,
 String.raw`Posons $S=\alpha+\beta+\gamma\ne0$. La réduction en $A$ donne :
$$S\overrightarrow{AM}=\beta\overrightarrow{AB}+\gamma\overrightarrow{AC}.$$
Comme $ABC$ est non aplati, $\overrightarrow{AB},\overrightarrow{AC}$ sont indépendants. Être parallèle à $\overrightarrow{BC}=\overrightarrow{AC}-\overrightarrow{AB}$ signifie que les deux coefficients sont opposés, donc $\beta+\gamma=0$.

Réciproquement, si $\beta=-\gamma$, alors $S\overrightarrow{AM}=\gamma\overrightarrow{BC}$. Le vecteur est non nul puisque $M\ne A$. Les droites sont donc parallèles. `),
 W("2.",String.raw`Pour $P\in(BC)$, $Q\in(CA)$, $R\in(AB)$ distincts des sommets, montrer que $(AP),(BQ),(CR)$ sont concourantes si et seulement s’il existe $\alpha,\beta,\gamma$ de somme non nulle tels que $P=\operatorname{bar}\{(B,\beta),(C,\gamma)\}$, $Q=\operatorname{bar}\{(C,\gamma),(A,\alpha)\}$, $R=\operatorname{bar}\{(A,\alpha),(B,\beta)\}$.`,
 String.raw`**Si les coefficients existent**, posons $G=\operatorname{bar}\{(A,\alpha),(B,\beta),(C,\gamma)\}$. Les trois sommes partielles sont non nulles puisque les trois barycentres donnés sont définis.

En regroupant les points de chaque côté :
$$G=\operatorname{bar}\{(A,\alpha),(P,\beta+\gamma)\}\in(AP),$$
et de même $G\in(BQ)$ et $G\in(CR)$. Les droites sont concourantes.

**Réciproquement**, soit $G$ leur point commun. Comme $ABC$ est un triangle, $G$ admet des coordonnées barycentriques $\alpha,\beta,\gamma$ de somme $1$. Il n’est pas un sommet, car les points $P,Q,R$ sont distincts des sommets.

Si $\beta+\gamma=0$, la question 1 rendrait $(AG)$ parallèle à $(BC)$, impossible puisqu’elle rencontre $(BC)$ en $P$. Les autres sommes partielles sont non nulles de la même façon.

Le regroupement de $B,C$ donne un point $P'$ sur $(BC)$ tel que $G\in(AP')$. L’intersection de $(AG)$ avec $(BC)$ étant unique, $P'=P$. On obtient pareillement les écritures de $Q,R$. Cela démontre la réciproque. `),
 W("3.a",String.raw`Supposons $M$ intérieur à $ABC$ et $P=(AM)\cap[BC]$. Si $H,h$ sont les distances respectives de $A,M$ à $(BC)$, montrer $\mathcal A(MCA)=\frac12(H-h)PC$.`,
 String.raw`Le point $M$ est intérieur au segment $[AP]$. Le triangle $APC$ se partage en $AMC$ et $MPC$.

En prenant la base $PC$, leurs aires donnent :
$$\mathcal A(MCA)=\mathcal A(APC)-\mathcal A(MPC)
=\frac12H\,PC-\frac12h\,PC=\boxed{\frac12(H-h)PC}.$$`),
 W("3.b",String.raw`Montrer $\mathcal A(MAB)=\frac12(H-h)PB$.`,
 String.raw`Le triangle $APB$ se partage en $AMB$ et $MPB$. Avec la base $PB$ :
$$\mathcal A(MAB)=\frac12H\,PB-\frac12h\,PB=\boxed{\frac12(H-h)PB}.$$`),
 W("3.c","Exprimer P à l’aide des aires.",String.raw`Les deux résultats donnent :
$$\frac{\mathcal A(MAB)}{\mathcal A(MCA)}=\frac{PB}{PC}.$$
Pour un point $P$ intérieur à $[BC]$, le rapport $PB/PC$ est le coefficient de $C$ divisé par celui de $B$.

Ainsi :
$$\boxed{P=\operatorname{bar}\{(B,\mathcal A(MCA)),(C,\mathcal A(MAB))\}.}$$
Les deux aires sont strictement positives. `),
 W("3.d","Exprimer M comme barycentre des trois sommets avec des aires.",String.raw`Posons $a_1=\mathcal A(MBC)$, $a_2=\mathcal A(MCA)$, $a_3=\mathcal A(MAB)$. Leur somme est l’aire du triangle $ABC$, donc elle est non nulle.

La question 3.c et ses deux analogues sur les autres côtés montrent que le barycentre de $(A,a_1),(B,a_2),(C,a_3)$ est sur chacune des droites $(AM),(BM),(CM)$. Il est donc $M$ :
$$\boxed{M=\operatorname{bar}\{(A,\mathcal A(MBC)),(B,\mathcal A(MCA)),(C,\mathcal A(MAB))\}.}$$`),
 W("4.","Énoncer et démontrer la propriété du centre de gravité relative aux aires.",String.raw`Si les trois petits triangles $MBC,MCA,MAB$ ont la même aire, l’écriture précédente a trois coefficients égaux. Le point $M$ est donc le centre de gravité.

Réciproquement, si $M$ est le centre de gravité, ses coordonnées barycentriques normalisées valent $1/3,1/3,1/3$. Par la question 3.d, chacune des trois aires vaut donc le tiers de $\mathcal A(ABC)$.

**Le centre de gravité partage ABC en trois triangles de même aire.**`),
 W("5.",String.raw`En déduire que le centre $I$ du cercle inscrit est $\operatorname{bar}\{(A,BC),(B,CA),(C,AB)\}$.`,
 String.raw`Le centre du cercle inscrit est intérieur au triangle et situé à la même distance $r>0$ des trois côtés. Donc :
$$\mathcal A(IBC)=\frac12r\,BC,\quad
\mathcal A(ICA)=\frac12r\,CA,\quad
\mathcal A(IAB)=\frac12r\,AB.$$
En appliquant 3.d, puis en divisant les trois coefficients par le même nombre $r/2\ne0$, on obtient :
$$\boxed{I=\operatorname{bar}\{(A,BC),(B,CA),(C,AB)\}.}$$
Chaque sommet est affecté de la longueur du **côté opposé**. `),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
];
export const barycenterComplex=[
 E(41,"Acheter un lingot avec une balance",String.raw`Un lingot rouge, de masse $18$ kg, est suspendu en $A$ ; un lingot vert de masse inconnue $m'$ est suspendu en $B$. La tige horizontale est en équilibre autour de l’appui $G$. Les graduations régulières donnent $BG=3$ unités et $GA=2$ unités ; la masse de la tige est négligée.

Le lingot vert est vendu $2500$ F CFA par kilogramme. Un client dispose de $27000$ F CFA. Peut-il acheter ce lingot ? Justifier la réponse. `,[
 S("1.","Déterminer la masse du lingot vert, en kg.","12",["12"],String.raw`À l’équilibre, les moments des deux poids autour de $G$ se compensent. Le facteur commun de pesanteur s’élimine :
$$m'\times GB=18\times GA.$$
Avec les graduations, $3m'=18\times2$, donc $\boxed{m'=12\text{ kg}}$. Le côté le plus long porte bien la masse la plus faible. `),
 S("2.","Calculer le prix du lingot vert, en F CFA.","30000",["30000"],String.raw`Le prix est proportionnel à la masse :
$$12\times2500=\boxed{30000\text{ F CFA}}.$$`),
 C("3.","Le budget permet-il l’achat ?",["Oui","Non"],1,String.raw`Le prix $30000$ F dépasse le budget $27000$ F. Il manque $30000-27000=\boxed{3000\text{ F CFA}}$.

**Non, le client ne peut pas acheter le lingot avec ce budget.** `),
 ],{figureKey:"tc-t2-l1-source",correctionFigureKey:"tc-t2-l1-barycenter"}),
];
