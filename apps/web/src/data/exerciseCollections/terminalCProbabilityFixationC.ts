import { probabilityExercise as ex, num, written as w } from "./terminalCProbabilityBuilders";

export const probabilityFixationC = [
  ex(23,"Reconnaître une épreuve de Bernoulli","Dans le modèle de l’exercice, une naissance unique est décrite par deux issues : fille ou garçon.",[
    w("1.","Justifie qu’il s’agit d’une épreuve de Bernoulli.",String.raw`On choisit, par exemple, « fille » comme succès ; l’autre issue, « garçon », est l’échec. Le modèle contient exactement deux issues incompatibles et complémentaires : c’est une **épreuve de Bernoulli**. Le mot succès est une convention mathématique, pas un jugement de valeur.`),
  ]),
  ex(24,"Résultats au BAC et schéma de Bernoulli","Une classe compte 60 élèves qui présentent le BAC. Pour la modélisation, on suppose leurs résultats indépendants et la même probabilité p de réussite pour chacun.",[
    w("1.","Explique pourquoi ces 60 résultats forment un schéma de Bernoulli dans ce modèle.",String.raw`Pour chaque élève, le succès est « est admis » et l’échec « n’est pas admis » : deux issues. On répète cette épreuve $60$ fois, avec **la même probabilité $p$** et **indépendance**, par hypothèse. Ce sont les conditions d’un schéma de Bernoulli.

L’effectif $60$ ne suffit pas à lui seul à prouver l’indépendance ou l’égalité des probabilités ; ce sont des hypothèses de modélisation.`),
  ]),
  ex(25,"Cinq enfants",String.raw`On modélise les naissances de cinq enfants par des épreuves indépendantes, avec $P(\text{fille})=0,51$ à chaque naissance. $X$ compte les filles.`,[
    w("1.","Justifie que X suit une loi binomiale et précise ses paramètres.",String.raw`À chaque naissance, le succès choisi est « fille », de probabilité $0,51$ ; l’échec a pour probabilité $0,49$. Les cinq épreuves sont indépendantes et ont le même paramètre. Puisque $X$ compte les succès, $\boxed{X\sim\mathcal B(5;0,51)}$. Les valeurs possibles sont $0,1,2,3,4,5$.`),
  ]),
  ex(26,"Utiliser une loi binomiale",String.raw`$X\sim\mathcal B(20;0,36)$.`,[
    w("1.","Donne la loi de probabilité de X.",String.raw`Les valeurs possibles sont les entiers $k$ de $0$ à $20$. Pour chacun :
$$\boxed{P(X=k)=\binom{20}{k}\left(\frac9{25}\right)^k
\left(\frac{16}{25}\right)^{20-k}}.$$
Le coefficient compte les places possibles des $k$ succès ; les puissances décrivent les succès et les échecs d’un chemin.`),
    w("2.a)",String.raw`Calcule $P(X=3)$.`,String.raw`On remplace $k$ par $3$ ; il reste $20-3=17$ échecs :
$$P(X=3)=\binom{20}{3}(0,36)^3(0,64)^{17}.$$
Comme $\binom{20}{3}=20\times19\times18/(3\times2\times1)=1140$,
$$\boxed{P(X=3)=1140(0,36)^3(0,64)^{17}\approx0,0269694}.$$`),
    w("2.b)",String.raw`Calcule $P(X\le2)$.`,String.raw`« Au plus deux » réunit les cas $0,1,2$, qui sont incompatibles :
$$P(X\le2)=(0,64)^{20}+20(0,36)(0,64)^{19}
+190(0,36)^2(0,64)^{18}.$$
La somme vaut environ $\boxed{0,00961925}$. Il ne faut pas calculer seulement $P(X=2)$.`),
    w("2.c)",String.raw`Calcule $P(X\ge1)$.`,String.raw`Le contraire de « au moins un succès » est « aucun succès ». Donc :
$$P(X\ge1)=1-P(X=0)=\boxed{1-(0,64)^{20}}
\approx0,9998671.$$`),
  ]),
  ex(27,"Un paramètre déterminé par une probabilité",String.raw`$X\sim\mathcal B(2,p)$ et $P(X=1)=0,3$. Donne les valeurs de $p$ arrondies au centième.`,[
    w("1.","Détermine les deux valeurs de p.",String.raw`La formule binomiale donne $P(X=1)=2p(1-p)$. L’équation est donc
$$2p(1-p)=0,3\iff p^2-p+0,15=0.$$
Son discriminant vaut $1-0,6=0,4$. Ainsi :
$$p=\frac{1-\sqrt{0,4}}2\approx0,18377
\quad\text{ou}\quad p=\frac{1+\sqrt{0,4}}2\approx0,81623.$$
Les deux valeurs appartiennent à $[0;1]$. Au centième, $\boxed{p\approx0,18\text{ ou }0,82}$.`),
  ]),
  ex(28,"Paramètres d’une grande binomiale",String.raw`$X\sim\mathcal B(2022;1/14)$.`,[
    num("1.",String.raw`Calcule $E(X)$.`,String.raw`\frac{1011}7`,["1011/7","2022/14"],String.raw`$E(X)=np=2022\times1/14=\boxed{1011/7}$. Une espérance n’est pas nécessairement un entier, même si $X$ est entière.`),
    num("2.",String.raw`Calcule $V(X)$.`,String.raw`\frac{13143}{98}`,["13143/98","2022*13/196"],String.raw`Le complément de $p$ vaut $13/14$. Donc :
$$V(X)=np(1-p)=2022\times\frac1{14}\times\frac{13}{14}
=\boxed{\frac{13143}{98}}.$$`),
  ]),
  ex(29,"Cent tickets à gratter",String.raw`Cent personnes jouent indépendamment. Chaque ticket a une probabilité $0,1$ d’être gagnant. $X$ compte les gagnants.`,[
    w("1.","Justifie la loi de X.",String.raw`Chaque partie a deux issues : gagner ou ne pas gagner. Les $100$ épreuves sont indépendantes et ont toutes la probabilité de succès $0,1$. Ainsi $\boxed{X\sim\mathcal B(100;0,1)}$.`),
    w("2.a)","Calcule la probabilité qu’il y ait exactement 12 gagnants.",String.raw`Il faut $12$ succès et $88$ échecs, dans n’importe quel ordre :
$$\boxed{P(X=12)=\binom{100}{12}(0,1)^{12}(0,9)^{88}}.$$
Le coefficient binomial est indispensable : il compte les choix des douze joueurs gagnants.`),
    w("2.b)","Calcule la probabilité qu’il y ait plus d’un gagnant.",String.raw`« Plus d’un » signifie **au moins deux**. Son contraire est « zéro ou un » :
$$\boxed{P(X\ge2)=1-(0,9)^{100}-100(0,1)(0,9)^{99}}.$$
Soustraire uniquement $P(X=0)$ donnerait « au moins un », qui n’est pas la demande.`),
  ]),
  ex(30,"Combien de participants ?",String.raw`$n>1$ personnes jouent indépendamment à un jeu, chacune avec probabilité de gain $0,1$. $X$ est le nombre de gagnants.`,[
    w("1.a)","Justifie la loi suivie par X.",String.raw`Il y a $n$ épreuves de Bernoulli indépendantes, de même probabilité de succès $0,1$. La variable compte les succès, donc $\boxed{X\sim\mathcal B(n;0,1)}$.`),
    w("1.b)","Donne sa loi de probabilité.",String.raw`Pour chaque entier $k$ entre $0$ et $n$ :
$$\boxed{P(X=k)=\binom nk(0,1)^k(0,9)^{n-k}}.$$
En particulier $P(X=0)=(0,9)^n$.`),
    num("2.","Détermine le plus petit n pour que la probabilité d’au moins un gagnant soit strictement supérieure à 0,99.",String.raw`44`,["44"],String.raw`On utilise le contraire :
$$1-(0,9)^n>0,99\iff(0,9)^n<0,01.$$
Le logarithme est croissant ; mais $\ln(0,9)<0$, donc la division inverse le sens :
$$n>\frac{\ln(0,01)}{\ln(0,9)}\approx43,7087.$$
Le plus petit entier admissible est $\boxed{44}$. Vérification : $1-0,9^{43}\approx0,989225<0,99$ et $1-0,9^{44}\approx0,990302>0,99$.`),
  ]),
  ex(31,"Élèves mineurs",String.raw`Une enquête donne une proportion $0,67$ d’élèves qui auront au moins 18 ans en fin d’année. Pour un groupe de 35 élèves, on suppose les âges indépendants et la même proportion applicable à chacun. $X$ compte les élèves qui auront moins de 18 ans.`,[
    w("1.","Justifie la loi de X.",String.raw`Le succès est « aura **moins de 18 ans** », donc $p=1-0,67=0,33$. Sous les hypothèses du modèle, $X$ compte $35$ succès possibles indépendants : $\boxed{X\sim\mathcal B(35;0,33)}$. Utiliser $0,67$ compterait l’autre groupe.`),
    w("2.a)","Calcule la probabilité d’avoir exactement dix élèves mineurs.",String.raw`Il faut dix succès et vingt-cinq échecs :
$$\boxed{P(X=10)=\binom{35}{10}(0,33)^{10}(0,67)^{25}}
\approx0,1261344.$$`),
    w("2.b)","Calcule la probabilité d’avoir au moins deux élèves mineurs.",String.raw`Le contraire regroupe zéro et un mineur :
$$\boxed{P(X\ge2)=1-(0,67)^{35}-35(0,33)(0,67)^{34}}
\approx0,9999851.$$`),
    num("3.a)",String.raw`Calcule $E(X)$.`,String.raw`11,55`,["11.55","11,55","231/20"],String.raw`$E(X)=35\times0,33=\boxed{11,55}$. C’est le nombre moyen dans ce modèle, pas l’affirmation qu’un groupe contient une fraction d’élève.`),
    num("3.b)",String.raw`Calcule $V(X)$.`,String.raw`7,7385`,["7.7385","7,7385","15477/2000"],String.raw`$V(X)=35\times0,33\times0,67=\boxed{7,7385}$. On utilise le complément $1-p=0,67$.`),
  ]),
  ex(32,"Dix boîtes de café",String.raw`Dans un grand stock, $88\,\%$ des boîtes ne présentent aucune trace de matières grasses végétales. On prélève dix boîtes ; le stock est assez grand pour assimiler le prélèvement à dix tirages indépendants avec remise. $X$ compte les boîtes sans trace.`,[
    w("1.","Justifie la loi suivie par X.",String.raw`On appelle succès « boîte sans trace », de probabilité $p=0,88$. Le modèle fournit dix essais indépendants à paramètre constant. Donc $\boxed{X\sim\mathcal B(10;0,88)}$.`),
    w("2.","Calcule la probabilité que les dix boîtes soient sans trace.",String.raw`L’événement est $X=10$. Le seul type de chemin comporte dix succès :
$$\boxed{P(X=10)=(0,88)^{10}}\approx0,278501.$$`),
    w("3.","Calcule la probabilité qu’au moins une boîte soit sans trace.",String.raw`Le contraire est « les dix boîtes présentent des traces », dont la probabilité vaut $(0,12)^{10}$ :
$$\boxed{P(X\ge1)=1-(0,12)^{10}}.$$
On ne soustrait pas $(0,88)^{10}$ : cela répondrait à « au moins une boîte avec des traces ».`),
  ]),
  ex(33,"Une espérance égale à l’écart type",String.raw`Une urne contient une boule verte et trois rouges. On effectue trois tirages **avec remise**. $X$ est le nombre de boules vertes obtenues.`,[
    w("1.","Justifie la loi de X.",String.raw`Grâce à la remise, la proportion verte reste $1/4$ et les tirages peuvent être modélisés indépendamment. On compte les succès dans trois épreuves : $\boxed{X\sim\mathcal B(3;1/4)}$.`),
    w("2.",String.raw`Démontre que $E(X)=\sigma(X)$.`,String.raw`Les paramètres donnent
$$E(X)=3\times\frac14=\frac34,\qquad
V(X)=3\times\frac14\times\frac34=\frac9{16}.$$
Donc $\sigma(X)=\sqrt{9/16}=3/4$. Ainsi $\boxed{E(X)=\sigma(X)=3/4}$. Cette égalité est propre à ces paramètres, pas à toutes les lois binomiales.`),
  ]),
  ex(34,"Répondre au hasard à un QCM",String.raw`Un QCM comporte six questions indépendantes, chacune avec quatre propositions dont une seule juste. Le candidat choisit chaque réponse au hasard, uniformément. $X$ compte les réponses justes.`,[
    w("1.","Justifie la loi de X.",String.raw`À chaque question, le succès « réponse juste » a pour probabilité $1/4$. Les six choix sont indépendants et ont le même paramètre : $\boxed{X\sim\mathcal B(6;1/4)}$.`),
    num("2.a)","Calcule la probabilité d’avoir exactement trois réponses justes.",String.raw`\frac{135}{1024}`,["135/1024","0.1318359375"],String.raw`Il faut trois réponses justes et trois fausses :
$$P(X=3)=\binom63\left(\frac14\right)^3\left(\frac34\right)^3
=20\times\frac{27}{4096}=\boxed{\frac{135}{1024}}.$$`),
    num("2.b)","Calcule la probabilité d’avoir au moins une réponse juste.",String.raw`\frac{3367}{4096}`,["3367/4096","0.822021484375"],String.raw`Le contraire est « six réponses fausses », de probabilité $(3/4)^6$ :
$$P(X\ge1)=1-\left(\frac34\right)^6
=1-\frac{729}{4096}=\boxed{\frac{3367}{4096}}.$$`),
    w("3.","Calcule et interprète l’espérance de X.",String.raw`$E(X)=6\times1/4=\boxed{1,5}$. Si ce QCM et ces choix aléatoires étaient répétés un grand nombre de fois, la moyenne du nombre de réponses justes se rapprocherait de $1,5$. Un candidat n’obtient jamais « une réponse et demie » sur une copie réelle.`),
  ]),
  ex(35,"Transmission d’un caractère génétique",String.raw`Dans le modèle de l’exercice, une mère a une probabilité $0,1$ de transmettre un caractère à chacun de ses quatre enfants. Les transmissions sont supposées indépendantes. $X$ compte les enfants auxquels le caractère est transmis.`,[
    num("1.a)","Calcule la probabilité de le transmettre à exactement deux enfants.",String.raw`\frac{243}{5000}`,["243/5000","0.0486","0,0486"],String.raw`On compte quatre essais indépendants de paramètre $0,1$, donc $X\sim\mathcal B(4;0,1)$.
$$P(X=2)=\binom42(0,1)^2(0,9)^2
=6\times0,01\times0,81=\boxed{0,0486}.$$`),
    num("1.b)","Calcule la probabilité de le transmettre à au moins trois enfants.",String.raw`\frac{37}{10000}`,["37/10000","0.0037","0,0037"],String.raw`« Au moins trois » réunit $X=3$ et $X=4$ :
$$P(X\ge3)=4(0,1)^3(0,9)+(0,1)^4
=0,0036+0,0001=\boxed{0,0037}.$$`),
    w("2.","Calcule et interprète l’espérance de X.",String.raw`$E(X)=np=4\times0,1=\boxed{0,4}$. Ce nombre est une moyenne théorique sur de nombreuses familles soumises aux mêmes hypothèses. Il ne prédit pas le nombre d’enfants concernés dans une famille donnée.`),
  ]),
];
