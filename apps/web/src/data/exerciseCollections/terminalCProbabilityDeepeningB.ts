import { probabilityExercise as ex, num, written as w, lawTable } from "./terminalCProbabilityBuilders";

export const probabilityDeepeningB = [
  ex(44,"Un contrôle de règles",String.raw`Une usine produit un très grand nombre de règles ; chacune a une probabilité $0,1$ d’avoir un défaut. Un prélèvement aléatoire de huit règles est assimilé à huit tirages indépendants avec remise. $X$ compte les règles défectueuses.`,[
    w("1.","Justifie la loi de X et donne ses paramètres.",String.raw`On choisit « a un défaut » comme succès, de probabilité $0,1$. Le prélèvement est modélisé par huit épreuves indépendantes et identiques. Ainsi $\boxed{X\sim\mathcal B(8;0,1)}$.`),
    num("2.A)","Calcule la probabilité qu’aucune règle n’ait de défaut.","0,43046721",["0.43046721","0,43046721","0.9^8"],String.raw`« Aucune » signifie $X=0$ : les huit règles doivent être sans défaut.
$$P(X=0)=(0,9)^8=\boxed{0,43046721}.$$`),
    num("2.B)","Calcule la probabilité qu’exactement deux règles aient un défaut.","0,14880348",["0.14880348","0,14880348","28*0.1^2*0.9^6"],String.raw`Il y a $\binom82=28$ positions possibles pour les deux défauts :
$$P(X=2)=28(0,1)^2(0,9)^6=\boxed{0,14880348}.$$`),
    num("2.C)","Calcule la probabilité qu’au moins une règle ait un défaut.","0,56953279",["0.56953279","0,56953279","1-0.9^8"],String.raw`Le contraire d’« au moins un défaut » est « aucun défaut » :
$$P(X\ge1)=1-P(X=0)=1-0,43046721=\boxed{0,56953279}.$$`),
    w("3.","Calcule E(X) et interprète.",String.raw`$E(X)=8\times0,1=\boxed{0,8}$. Sur un grand nombre d’échantillons de huit règles soumis aux mêmes hypothèses, le nombre moyen de règles défectueuses se rapprocherait de $0,8$. Cela ne signifie pas que chaque échantillon contient un défaut.`),
  ]),
  ex(45,"Deux boules dans chacune de deux urnes",String.raw`$U_1$ contient trois blanches et deux noires ; $U_2$ deux blanches et trois noires. On tire simultanément deux boules dans chaque urne, indépendamment d’une urne à l’autre. Les paires physiques de chaque urne sont équiprobables. $X$ compte les blanches parmi les quatre boules. Pour jouer, on paie $1500$ F CFA et on reçoit $600$ F CFA par blanche.`,[
    w("1.","Justifie que la probabilité d’obtenir exactement deux blanches est 0,46.",String.raw`Dans chaque urne il y a $\binom52=10$ paires. Si $X_1,X_2$ comptent les blanches tirées dans $U_1,U_2$, on obtient :

| Nombre de blanches | $0$ | $1$ | $2$ |
| --- | --- | --- | --- |
| $P(X_1=k)$ | $1/10$ | $6/10$ | $3/10$ |
| $P(X_2=k)$ | $3/10$ | $6/10$ | $1/10$ |

Pour totaliser deux blanches, les couples possibles sont $(0;2),(1;1),(2;0)$. Par indépendance entre urnes :
$$P(X=2)=0,1\times0,1+0,6\times0,6+0,3\times0,3
=\boxed{0,46}.$$`),
    w("2.a)","Détermine la loi de probabilité de X.",String.raw`On additionne les probabilités des couples donnant le même total :
$$P(X=0)=0,1\times0,3=0,03,$$
$$P(X=1)=0,1\times0,6+0,6\times0,3=0,24,$$
$$P(X=2)=0,46,$$
$$P(X=3)=0,6\times0,1+0,3\times0,6=0,24,$$
$$P(X=4)=0,3\times0,1=0,03.$$
La loi est :`+"\n\n"+lawTable(["0","1","2","3","4"],["0,03","0,24","0,46","0,24","0,03"])),
    w("2.c)","Le jeu est-il équitable ?",String.raw`Le gain algébrique est la recette **moins la mise** : $G=600X-1500$. La loi donne
$$E(X)=0(0,03)+1(0,24)+2(0,46)+3(0,24)+4(0,03)=2.$$
Donc $E(G)=600\times2-1500=\boxed{-300\ {\rm F\ CFA}}$. Un jeu équitable a une espérance de gain nulle. Ici il est **défavorable**, pas équitable. Les $1200$ F reçus en moyenne ne sont pas le gain net.`),
    num("3.","Sachant que le total est de deux blanches, calcule la probabilité qu’une seule provienne de U₁.",String.raw`\frac{18}{23}`,["18/23"],String.raw`Dans l’événement connu $X=2$, « une blanche de $U_1$ » impose aussi une blanche de $U_2$. Le numérateur vaut $0,6\times0,6=0,36$ :
$$P_{X=2}(X_1=1)=\frac{0,36}{0,46}=\boxed{\frac{18}{23}}.$$`),
    w("4.","On utilise seulement U₁. Un succès est le tirage de deux blanches. On répète dix fois, en remettant les deux boules après chaque épreuve. Calcule la probabilité d’au moins deux succès.",String.raw`Dans $U_1$, la probabilité d’une paire blanche est $\binom32/\binom52=3/10$. La remise rétablit le même contenu ; les dix essais sont indépendants. Ainsi $Y\sim\mathcal B(10;0,3)$.
$$P(Y\ge2)=1-P(Y=0)-P(Y=1)$$
$$=\boxed{1-(0,7)^{10}-10(0,3)(0,7)^9}
=0,8506916541.$$
La remise a lieu **entre les paires**, pas entre les deux boules d’une paire simultanée.`),
  ]),
  ex(46,"Un échange de boules",String.raw`$n$ est un entier positif. $U_1$ contient $n$ blanches et trois noires ; $U_2$ contient deux blanches et une noire. On tire une boule de $U_1$, on la place dans $U_2$, puis on tire une boule dans $U_2$ et on la place dans $U_1$. Tous les tirages sont au hasard.

$A$ : « les deux urnes retrouvent leur composition initiale » ; $B$ : « $U_2$ contient finalement une seule blanche ». Pour le jeu, la mise est $20$ F CFA. Si $U_2$ contient finalement une blanche on reçoit $2n$ F CFA ; deux blanches donnent $n$ F CFA ; trois blanches ne donnent rien. $X$ est le gain algébrique.`,[
    w("1.a)",String.raw`Démontre que $P(A)=3(n+2)/[4(n+3)]$.`,String.raw`La composition est restaurée si les deux boules transférées ont **la même couleur**.

Premier chemin : une blanche de $U_1$, de probabilité $n/(n+3)$, puis une blanche parmi les trois blanches et une noire de $U_2$, de probabilité $3/4$.

Second chemin : une noire de $U_1$, de probabilité $3/(n+3)$, puis une noire parmi les deux blanches et deux noires de $U_2$, de probabilité $1/2$.
$$P(A)=\frac{n}{n+3}\frac34+\frac3{n+3}\frac12
=\boxed{\frac{3(n+2)}{4(n+3)}}.$$`),
    num("1.b)",String.raw`Calcule $\lim_{n\to+\infty}P(A)$.`,String.raw`\frac34`,["3/4","0.75","0,75"],String.raw`On divise numérateur et dénominateur par $n$ :
$$P(A)=\frac{3(1+2/n)}{4(1+3/n)}\longrightarrow\boxed{\frac34}.$$
Quand le nombre de blanches de $U_1$ augmente, le premier transfert devient presque sûrement blanc, mais le retour blanc n’a toujours que probabilité $3/4$.`),
    w("2.",String.raw`Démontre que $P(B)=3/[2(n+3)]$.`,String.raw`Pour qu’il ne reste qu’une blanche dans $U_2$, il faut y ajouter une noire puis en retirer une blanche. Après ajout de la noire, l’urne a deux boules de chaque couleur :
$$P(B)=\frac3{n+3}\times\frac24
=\boxed{\frac3{2(n+3)}}.$$`),
    w("3.a)","Montre que si n ≤ 10, le joueur ne peut pas avoir de gain strictement positif.",String.raw`La plus grande recette possible est $2n$. Si $n\le10$, elle est au plus $20$, donc le gain net $2n-20\le0$. Les autres recettes sont encore plus petites. **Aucun gain strictement positif n’est possible** ; pour $n=10$, récupérer exactement sa mise n’est pas gagner.`),
    w("3.b)","On suppose désormais n > 10. Détermine la loi de X.",String.raw`Une blanche finale donne $X=2n-20$ avec probabilité $3/[2(n+3)]$. Deux blanches finales correspondent à la restauration des compositions : $X=n-20$ avec probabilité $3(n+2)/[4(n+3)]$. Trois blanches finales supposent blanche puis noire, de probabilité $[n/(n+3)](1/4)$ : $X=-20$.
La loi est :`+"\n\n"+lawTable(["-20","n-20","2n-20"],["n/[4(n+3)]","3(n+2)/[4(n+3)]","6/[4(n+3)]"])+String.raw`

Les numérateurs totalisent $n+3n+6+6=4(n+3)$, donc la somme des probabilités est $1$.`),
    w("3.c)","Calcule E(X).",String.raw`On multiplie chaque gain net par sa probabilité :
$$E(X)=\frac{-20n+3(n-20)(n+2)+6(2n-20)}{4(n+3)}.$$
Développons : $3(n-20)(n+2)=3n^2-54n-120$, et $6(2n-20)=12n-120$. Ainsi :
$$\boxed{E(X)=\frac{3n^2-62n-240}{4(n+3)}
=\frac{(n-24)(3n+10)}{4(n+3)}}.$$`),
    w("3.d)","Détermine les valeurs de n pour lesquelles le jeu est favorable.",String.raw`Pour $n>10$, les facteurs $3n+10$ et $4(n+3)$ sont positifs. Le signe de l’espérance est donc celui de $n-24$. Le jeu est favorable si $n>24$, soit, puisque $n$ est entier, $\boxed{n\ge25}$. Pour $n=24$, il est équitable ; entre $11$ et $23$, un gain ponctuel reste possible mais le jeu est défavorable en moyenne.`),
  ],{correctionFigureKey:"tc-l9-probability"}),
  ex(47,"Déclarations et intentions de vote",String.raw`Un sondage collecte 1200 réponses. $47\,\%$ des répondants déclarent voter pour $A$, les autres pour $B$. Parmi ceux qui déclarent $A$, $10\,\%$ mentent et voteront $B$ ; parmi ceux qui déclarent $B$, $20\,\%$ mentent et voteront $A$. $V$ désigne une déclaration véridique.

Pour les appels, une personne contactée accepte de répondre avec probabilité $0,4$, constante et indépendante d’un appel à l’autre. On effectue dix appels par demi-heure.`,[
    w("1.","Construis l’arbre pondéré des déclarations et de leur sincérité.",String.raw`Premier niveau : déclaration $A$ de poids $0,47$, déclaration $B$ de poids $0,53$. Depuis $A$, $V$ porte $0,9$ et $\overline V$ porte $0,1$. Depuis $B$, $V$ porte $0,8$ et $\overline V$ porte $0,2$. Les votes réels sont $A,B,B,A$ dans cet ordre de feuilles. Il faut distinguer la **déclaration** de l’intention réelle.`),
    num("2.a)",String.raw`Calcule $P(V)$.`,"0,847",["0.847","0,847","847/1000"],String.raw`La sincérité peut suivre deux chemins incompatibles :
$$P(V)=0,47\times0,9+0,53\times0,8
=0,423+0,424=\boxed{0,847}.$$`),
    num("2.b)","Une déclaration est sincère. Quelle est la probabilité qu’elle soit en faveur de A ?",String.raw`\frac{423}{847}`,["423/847"],String.raw`L’intersection « déclare A et dit vrai » a probabilité $0,423$. Le groupe connu a probabilité $0,847$ :
$$P_V(A_{\text{déclaré}})=\frac{0,423}{0,847}=\boxed{\frac{423}{847}}.$$`),
    num("3.","Détermine la probabilité qu’un répondant vote réellement pour A.","0,529",["0.529","0,529","529/1000"],String.raw`Un vote réel pour $A$ vient soit d’une déclaration $A$ sincère, soit d’une déclaration $B$ mensongère :
$$P(A_{\text{réel}})=0,47\times0,9+0,53\times0,2
=0,423+0,106=\boxed{0,529}.$$`),
    w("4.","Estime le temps moyen nécessaire pour obtenir 1200 réponses.",String.raw`Il faut en moyenne $1/0,4=2,5$ appels pour obtenir une réponse. Pour $1200$ réponses, le nombre moyen d’appels est donc $1200/0,4=3000$.

Le rythme est $10$ appels par demi-heure, soit $20$ par heure. Le temps moyen est :
$$\boxed{\frac{3000}{20}=150\ {\rm heures}}.$$
On retrouve ce résultat par le débit moyen : $20\times0,4=8$ réponses par heure et $1200/8=150$. C’est une moyenne du modèle, pas une durée garantie.`),
  ],{correctionFigureKey:"tc-l9-probability"}),
  ex(48,"Pannes de cinquante ordinateurs",String.raw`Chacun de 50 ordinateurs a une probabilité $0,01$ d’être en panne. Les pannes sont supposées indépendantes. $X$ compte les ordinateurs en panne, donc $X\sim\mathcal B(50;0,01)$.`,[
    w("1.","Calcule la probabilité qu’aucun ordinateur ne soit en panne.",String.raw`Les cinquante ordinateurs doivent fonctionner :
$$\boxed{P(X=0)=(0,99)^{50}\approx0,6050061}.$$`),
    w("2.","Calcule la probabilité qu’exactement cinq ordinateurs soient en panne.",String.raw`On choisit les cinq ordinateurs en panne parmi cinquante :
$$\boxed{P(X=5)=\binom{50}{5}(0,01)^5(0,99)^{45}}
\approx0,0001347924.$$`),
    w("3.","Calcule la probabilité qu’au moins un ordinateur soit en panne.",String.raw`L’événement contraire est « aucune panne ». Donc :
$$\boxed{P(X\ge1)=1-(0,99)^{50}\approx0,3949939}.$$`),
    w("4.a)",String.raw`Calcule $P(X=3)$.`,String.raw`Pour trois pannes et quarante-sept ordinateurs fonctionnels :
$$\boxed{P(X=3)=\binom{50}{3}(0,01)^3(0,99)^{47}}
\approx0,01222110.$$`),
    w("4.b)",String.raw`Calcule et interprète $P(X\le3)$.`,String.raw`On additionne les cas $0,1,2,3$, sans oublier zéro :
$$\boxed{P(X\le3)=\sum_{k=0}^{3}\binom{50}{k}(0,01)^k(0,99)^{50-k}}
\approx0,9984038.$$
C’est la probabilité d’avoir **au plus trois ordinateurs en panne** dans le parc de cinquante.`),
    w("4.c)",String.raw`Calcule et interprète $E(X)$.`,String.raw`$E(X)=np=50\times0,01=\boxed{0,5}$. Sur de nombreux parcs identiques soumis au modèle, on aurait en moyenne un demi-ordinateur en panne par parc de cinquante. Dans un parc réel le nombre de pannes est toujours entier.`),
  ]),
];
