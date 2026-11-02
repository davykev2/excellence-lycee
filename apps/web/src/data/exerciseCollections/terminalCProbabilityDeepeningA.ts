import { probabilityExercise as ex, num, written as w, lawTable } from "./terminalCProbabilityBuilders";

export const probabilityDeepeningA = [
  ex(36,"Un test de baisse de glycémie",String.raw`Dans les données de cet exercice, $60\,\%$ des participants prennent un médicament ($M$), les autres une substance neutre ($N$). Une baisse de glycémie ($B$) est observée chez $80\,\%$ du groupe $M$. Dans le groupe $N$, $90\,\%$ n’ont pas de baisse. Les cinq contrôles de la question 4 sont supposés indépendants et suivent ces mêmes proportions.`,[
    num("1.",String.raw`Donne $P_M(B)$.`,"0,8",["0.8","0,8","4/5"],String.raw`Le groupe conditionnant est celui qui a pris le médicament. La donnée est directement $P_M(B)=80/100=\boxed{0,8}$.`),
    w("2.",String.raw`Démontre que $P(B)=0,52$.`,String.raw`Dans le groupe neutre, $P_N(B)=1-0,9=0,1$. Les groupes $M,N$ forment une partition. Donc :
$$P(B)=P(M)P_M(B)+P(N)P_N(B)$$
$$=0,6\times0,8+0,4\times0,1=0,48+0,04=\boxed{0,52}.$$
On additionne deux chemins incompatibles de baisse, pas les seules probabilités conditionnelles.`),
    num("3.","Une baisse est observée. Quelle est la probabilité que la personne ait pris le médicament ?",String.raw`\frac{12}{13}`,["12/13"],String.raw`On connaît $B$ et on cherche $M$ : le sens est inversé.
$$P_B(M)=\frac{P(M\cap B)}{P(B)}
=\frac{0,6\times0,8}{0,52}=\frac{0,48}{0,52}
=\boxed{\frac{12}{13}}.$$
Ce calcul sur les données du problème n’est pas un conseil médical.`),
    w("4.a)","Calcule la probabilité d’observer exactement deux baisses sur cinq personnes.",String.raw`Le nombre $Y$ de baisses suit $\mathcal B(5;0,52)$ dans le modèle indépendant. Il faut deux succès et trois échecs :
$$P(Y=2)=\binom52(0,52)^2(0,48)^3
=10(0,52)^2(0,48)^3=\boxed{0,299040768}.$$`),
    w("4.b)","Calcule la probabilité d’observer au moins une baisse.",String.raw`Le contraire est « aucune baisse », de probabilité $(0,48)^5$. Donc :
$$\boxed{P(Y\ge1)=1-(0,48)^5=0,9745196032}.$$`),
  ],{correctionFigureKey:"tc-l9-probability"}),
  ex(37,"Un gain commandé par un dé",String.raw`On lance un dé équilibré. Si le numéro est premier, le joueur gagne $1000$ fois ce numéro en F CFA ; sinon il perd $1000$ fois ce numéro. $X$ est le gain algébrique.`,[
    w("1.","Justifie l’ensemble des valeurs de X.",String.raw`Les nombres premiers entre $1$ et $6$ sont **$2,3,5$** ; $1$ n’est pas premier. On gagne donc $2000,3000,5000$. Pour $1,4,6$, on perd $1000,4000,6000$. Ainsi :
$$\boxed{X(\Omega)=\{-6000;-4000;-1000;2000;3000;5000\}}.$$`),
    w("2.","Détermine la loi de X.",String.raw`Chaque gain correspond à une unique face et toutes les faces ont probabilité $1/6$. On obtient donc :`+"\n\n"+lawTable(["-6000","-4000","-1000","2000","3000","5000"],Array(6).fill("1/6"))),
    w("3.a)","Calcule l’espérance et l’écart type de X.",String.raw`L’espérance est :
$$E(X)=\frac{-6000-4000-1000+2000+3000+5000}{6}
=\boxed{-\frac{500}{3}}\ {\rm F\ CFA}.$$
Pour l’écart type, calculons d’abord
$$E(X^2)=\frac{36+16+1+4+9+25}{6}\times10^6
=\frac{45\,500\,000}{3}.$$
Donc
$$V(X)=\frac{45\,500\,000}{3}-\left(-\frac{500}{3}\right)^2
=\frac{136\,250\,000}{9}.$$
Finalement $\boxed{\sigma(X)=500\sqrt{545}/3\approx3890,87\ {\rm F\ CFA}}$. La variance est en unités monétaires **au carré** ; l’écart type est dans la même unité que le gain.`),
    w("3.b)","Le jeu est-il favorable au joueur ?",String.raw`Un jeu est favorable lorsque l’espérance de gain algébrique est positive. Ici $E(X)=-500/3<0$. Il est donc **défavorable** : la perte moyenne théorique est d’environ $166,67$ F CFA par partie sur un grand nombre de parties, et non une perte certaine à chaque lancer.`),
    w("4.","Définis la fonction de répartition F de X.",String.raw`On range les gains dans l’ordre croissant, puis on cumule $1/6$ à chaque nouveau gain :
$$F(t)=\begin{cases}
0&t<-6000,\\
1/6&-6000\le t<-4000,\\
2/6&-4000\le t<-1000,\\
3/6&-1000\le t<2000,\\
4/6&2000\le t<3000,\\
5/6&3000\le t<5000,\\
1&t\ge5000.
\end{cases}$$
Chaque intervalle inclut sa borne gauche, car $F(t)=P(X\le t)$.`),
  ],{correctionFigureKey:"tc-l9-probability"}),
  ex(38,"Un jeu à tirage conditionnel",String.raw`Une urne contient une rouge, deux jaunes et quatre vertes. Au premier tirage : rouge donne un gain de $10\,000$ F CFA ; jaune une perte de $5000$ F CFA ; verte conduit à un deuxième tirage **sans remise**. Dans ce dernier cas, rouge donne $8000$ F CFA, toute autre couleur une perte de $4000$ F CFA. Notations : $R_1,J_1,V_1$ pour la première couleur, et $R_2$ pour rouge au second tirage lorsqu’il a lieu. $X$ est le gain algébrique.`,[
    w("1.a)",String.raw`Justifie $P(R_1)=1/7$ et $P_{V_1}(\overline{R_2})=5/6$.`,String.raw`Au départ, une boule sur sept est rouge, donc $P(R_1)=1/7$. Si la première boule est verte, il reste six boules : une rouge et cinq non rouges. **Dans ce groupe de tirages**, $P_{V_1}(\overline{R_2})=5/6$. Le dénominateur est $6$, parce que la première boule n’a pas été remise.`),
    w("1.b)","Construis l’arbre pondéré du jeu.",String.raw`Le premier nœud a trois branches : $R_1$ de poids $1/7$, $J_1$ de poids $2/7$, $V_1$ de poids $4/7$. Les branches rouge et jaune s’arrêtent : la partie est terminée. Seule la branche $V_1$ se poursuit vers $R_2$ de poids $1/6$ et $\overline{R_2}$ de poids $5/6$. Les gains de ces quatre feuilles sont $10000,-5000,8000,-4000$.`),
    w("2.a)","Justifie les valeurs possibles de X.",String.raw`Les quatre fins de partie donnent respectivement un gain de $10000$, une perte de $5000$, un gain de $8000$ ou une perte de $4000$. Comme une perte est négative :
$$\boxed{X(\Omega)=\{-5000;-4000;8000;10000\}}.$$`),
    w("2.b)","Établis la loi de X.",String.raw`Les deux chemins prolongés ont pour probabilités $(4/7)(1/6)=2/21$ et $(4/7)(5/6)=10/21$. Les arrêts immédiats ont probabilités $2/7$ et $1/7$. Donc :`+"\n\n"+lawTable(["-5000","-4000","8000","10000"],["2/7","10/21","2/21","1/7"])+String.raw`

La somme vaut $(6+10+2+3)/21=1$.`),
    w("2.c)","Calcule E(X) et interprète le résultat.",String.raw`On utilise les gains avec leurs signes :
$$E(X)=(-5000)\frac27+(-4000)\frac{10}{21}
+8000\frac2{21}+10000\frac17$$
$$=\frac{-30000-40000+16000+30000}{21}
=\boxed{-\frac{8000}{7}}\approx-1142,86\ {\rm F\ CFA}.$$
Le joueur perd en moyenne théorique environ $1142,86$ F CFA par partie ; le jeu est défavorable.`),
    w("2.d)","Calcule V(X).",String.raw`On calcule les carrés avant de faire la moyenne :
$$E(X^2)=25\,000\,000\frac27+16\,000\,000\frac{10}{21}
+64\,000\,000\frac2{21}+100\,000\,000\frac17
=\frac{246\,000\,000}{7}.$$
Ainsi :
$$V(X)=\frac{246\,000\,000}{7}-\left(-\frac{8000}{7}\right)^2
=\boxed{\frac{1\,658\,000\,000}{49}}.$$
La variance est positive, exprimée en $\text{(F CFA)}^2$.`),
    w("3.","Définis F puis trace son graphe : 1 cm pour 1000 F horizontalement, 21 cm pour une unité verticalement.",String.raw`En cumulant les probabilités de la loi :
$$F(t)=\begin{cases}
0&t<-5000,\\
2/7&-5000\le t<-4000,\\
16/21&-4000\le t<8000,\\
6/7&8000\le t<10000,\\
1&t\ge10000.
\end{cases}$$
Les abscisses $-5000,-4000,8000,10000$ sont placées à $-5,-4,8,10$ cm de l’origine. Les hauteurs $2/7,16/21,6/7,1$ correspondent à $6,16,18,21$ cm. Les points pleins sont sur le palier qui commence ; les extrémités droites des paliers précédents sont vides. Le tracé numérique conserve ce rapport d’échelles, avec l’axe horizontal en milliers de F CFA.`),
  ],{correctionFigureKey:"tc-l9-probability"}),
  ex(39,"Un concours en trois étapes",String.raw`Dans une école d’ingénieurs, $20\,\%$ des candidats sont admis sur dossier ($D$). Les autres passent l’écrit ; $75\,\%$ de ces candidats le réussissent ($E$). Ils passent alors l’oral ; deux tiers le réussissent et sont admis ($F$). Un échec à l’écrit ou à l’oral élimine le candidat.`,[
    w("1.","Traduis la situation par un arbre pondéré.",String.raw`La branche $D$ porte $1/5$ et mène directement à l’admission. La branche $\overline D$ porte $4/5$. Depuis celle-ci : réussite écrite $3/4$, échec $1/4$. Seule la réussite écrite mène à l’oral : réussite $2/3$, échec $1/3$. On ne fait pas passer d’oral aux candidats déjà admis sur dossier.`),
    num("2.a)","Calcule la probabilité d’avoir passé et raté l’oral.",String.raw`\frac15`,["1/5","0.2","0,2"],String.raw`Il faut suivre les trois étapes « pas admis sur dossier, réussite écrite, échec oral » :
$$\frac45\times\frac34\times\frac13=\boxed{\frac15}.$$
La probabilité $1/3$ seule est conditionnelle aux candidats arrivés à l’oral.`),
    num("2.b)","Calcule la probabilité d’être admis après avoir passé l’écrit.",String.raw`\frac25`,["2/5","0.4","0,4"],String.raw`Le chemin d’admission après écrit est :
$$P(\overline D\cap E\cap F)=\frac45\times\frac34\times\frac23
=\boxed{\frac25}.$$`),
    num("3.","Calcule la probabilité d’être admis au concours.",String.raw`\frac35`,["3/5","0.6","0,6"],String.raw`Les admissions directes et après épreuves sont incompatibles. On additionne :
$$P(\text{admis})=P(D)+P(\overline D\cap E\cap F)
=\frac15+\frac25=\boxed{\frac35}.$$`),
  ],{correctionFigureKey:"tc-l9-probability"}),
  ex(40,"Somme paire et conditionnement","On lance successivement deux dés équilibrés à six faces numérotées de 1 à 6, indépendamment.",[
    num("1.","Calcule la probabilité que la somme soit paire.",String.raw`\frac12`,["1/2","0.5","0,5"],String.raw`Une somme est paire si les deux nombres sont pairs ou s’ils sont tous deux impairs. Chaque parité a probabilité $1/2$ sur chaque dé :
$$P(\text{somme paire})=\frac12\frac12+\frac12\frac12=\boxed{\frac12}.$$`),
    num("2.","Calcule la probabilité d’obtenir 6 sur le premier dé.",String.raw`\frac16`,["1/6"],String.raw`Une seule des six faces équiprobables porte le numéro $6$, donc la probabilité vaut $\boxed{1/6}$. Le deuxième dé n’impose ici aucune condition.`),
    num("3.","Calcule la probabilité d’une somme paire sachant que le premier dé a donné 6.",String.raw`\frac12`,["1/2"],String.raw`Le premier nombre est déjà fixé et il est pair. La somme est donc paire exactement lorsque le second nombre est pair, soit $2,4,6$. Il reste six issues équiprobables, dont trois conviennent : $\boxed{3/6=1/2}$.`),
  ]),
  ex(41,"De quelle urne vient la boule ?",String.raw`$U_1$ contient trois rouges et deux noires ; $U_2$ cinq rouges et une noire. Un dé équilibré décide de l’urne : 2 ou 6 conduit à $U_1$, toute autre face à $U_2$. On tire ensuite une boule au hasard dans l’urne choisie.`,[
    num("1.","Sachant que la boule est noire, calcule la probabilité qu’elle vienne de U₁.",String.raw`\frac6{11}`,["6/11"],String.raw`Notons $N$ la couleur noire. Le dé donne $P(U_1)=2/6=1/3$ et $P(U_2)=2/3$.
$$P(U_1\cap N)=\frac13\times\frac25=\frac2{15},$$
$$P(N)=\frac13\times\frac25+\frac23\times\frac16
=\frac{6+5}{45}=\frac{11}{45}.$$
On conditionne maintenant par $N$ :
$$P_N(U_1)=\frac{2/15}{11/45}=\boxed{\frac6{11}}.$$
Les urnes ne sont pas choisies avec la même probabilité.`),
  ],{correctionFigureKey:"tc-l9-probability"}),
  ex(42,"Proportion d’un caractère",String.raw`Une population compte $45\,\%$ d’hommes et $55\,\%$ de femmes. Un caractère $P$ est présent chez $4\,\%$ des hommes et $5\,\%$ des femmes. On choisit une personne au hasard.`,[
    num("1.","Détermine la proportion de personnes présentant P.",String.raw`\frac{91}{2000}`,["91/2000","0.0455","0,0455"],String.raw`Les groupes hommes et femmes forment la partition utilisée dans les données. La proportion totale est leur moyenne **pondérée** :
$$P(P)=0,45\times0,04+0,55\times0,05
=0,018+0,0275=\boxed{0,0455}.$$
Cela représente $4,55\,\%$ de la population. Pour saisir une probabilité, on donne $0,0455$, pas $4,55$.`),
  ]),
  ex(43,"Interpréter un test de dépistage",String.raw`Dans les données fictives de cet exercice, $3\,\%$ de la population a une hépatite ($M$). Le test est positif ($T$) avec probabilité $0,95$ chez une personne malade et $0,1$ chez une personne saine. Les calculs portent sur ce modèle, pas sur un diagnostic individuel.`,[
    num("1.a)",String.raw`Calcule $P(M\cap T)$.`,String.raw`\frac{57}{2000}`,["57/2000","0.0285","0,0285"],String.raw`On multiplie le poids du groupe par la probabilité conditionnelle :
$$P(M\cap T)=0,03\times0,95=\boxed{0,0285}.$$`),
    num("1.b)",String.raw`Calcule $P(\overline M\cap T)$.`,String.raw`\frac{97}{1000}`,["97/1000","0.097","0,097"],String.raw`$P(\overline M)=0,97$. Le chemin « sain puis test positif » donne $0,97\times0,1=\boxed{0,097}$.`),
    num("1.c)",String.raw`Calcule $P(T)$.`,String.raw`\frac{251}{2000}`,["251/2000","0.1255","0,1255"],String.raw`Les deux catégories de tests positifs sont incompatibles :
$$P(T)=0,0285+0,097=\boxed{0,1255}.$$`),
    num("2.","Calcule la probabilité d’être malade sachant que le test est positif.",String.raw`\frac{57}{251}`,["57/251"],String.raw`Le groupe connu est celui des tests positifs :
$$P_T(M)=\frac{P(M\cap T)}{P(T)}
=\frac{0,0285}{0,1255}=\boxed{\frac{57}{251}}.$$
Ce résultat est très différent de $P_M(T)=0,95$ : inverser les événements change la question.`),
    num("3.","Calcule la probabilité d’être sain sachant que le test est positif.",String.raw`\frac{194}{251}`,["194/251"],String.raw`Dans le même groupe des tests positifs, « sain » est le contraire de « malade ». Donc $P_T(\overline M)=1-57/251=\boxed{194/251}$. On peut aussi diviser $0,097$ par $0,1255$.`),
    num("4.","Calcule la probabilité d’être malade sachant que le test est négatif.",String.raw`\frac1{583}`,["1/583"],String.raw`$P_M(\overline T)=0,05$, donc $P(M\cap\overline T)=0,03\times0,05=0,0015$.
$$P(\overline T)=1-0,1255=0,8745.$$
Ainsi $P_{\overline T}(M)=0,0015/0,8745=\boxed{1/583}$. Il faut changer aussi le dénominateur lorsque le résultat connu est négatif.`),
    num("5.","Calcule la probabilité d’être sain sachant que le test est négatif.",String.raw`\frac{582}{583}`,["582/583"],String.raw`On prend le complément **à l’intérieur des tests négatifs** :
$$P_{\overline T}(\overline M)=1-\frac1{583}=\boxed{\frac{582}{583}}.$$
Ces deux probabilités conditionnelles totalisent bien $1$.`),
  ],{correctionFigureKey:"tc-l9-probability"}),
];
