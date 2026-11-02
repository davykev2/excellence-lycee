import { probabilityExercise as ex, num, written as w, choice, tf, lawTable } from "./terminalCProbabilityBuilders";

const dice = String.raw`On lance deux dés cubiques équilibrés. Les faces du dé blanc portent $-1,-1,0,0,1,1$ ; celles du dé noir portent $0,1,1,1,2,2$. Les deux lancers sont indépendants. $X$ est la somme des nombres obtenus.`;
const diceLaw = lawTable(["-1","0","1","2","3"],["1/18","2/9","1/3","5/18","1/9"]);
const diceLawSolution = String.raw`Les $6\times6=36$ couples de faces physiques sont équiprobables. Les sommes possibles sont $-1,0,1,2,3$.

| Somme | Décomposition blanc + noir | Nombre de couples |
| --- | --- | --- |
| $-1$ | $-1+0$ | $2\times1=2$ |
| $0$ | $-1+1$ ou $0+0$ | $2\times3+2\times1=8$ |
| $1$ | $-1+2$, $0+1$ ou $1+0$ | $2\times2+2\times3+2\times1=12$ |
| $2$ | $0+2$ ou $1+1$ | $2\times2+2\times3=10$ |
| $3$ | $1+2$ | $2\times2=4$ |

On divise ces effectifs par $36$. Leur somme vaut $36$, donc les probabilités totalisent bien $1$.`;
const smallLaw = lawTable(["-1","1","2"],["2/7","4/7","1/7"]);
const smallCdf = String.raw`Par définition, $F(t)=P(X\le t)$. On ajoute donc les masses situées **à gauche de $t$, y compris en $t$** :
$$F(t)=\begin{cases}0&t<-1,\\ \frac27&-1\le t<1,\\ \frac67&1\le t<2,\\ 1&t\ge2.\end{cases}$$
En particulier $F(-1)=2/7$, $F(1)=6/7$ et $F(2)=1$. Chaque borne de gauche est incluse.`;
const diceCdf = String.raw`On cumule les effectifs $2,8,12,10,4$ dans l’ordre des valeurs :
$$F(t)=\begin{cases}
0&t<-1,\\
\frac2{36}&-1\le t<0,\\
\frac{10}{36}&0\le t<1,\\
\frac{22}{36}&1\le t<2,\\
\frac{32}{36}&2\le t<3,\\
1&t\ge3.
\end{cases}$$
Les fractions peuvent être simplifiées. À un point de saut, la valeur est celle du palier qui commence : par exemple $F(1)=22/36$.`;
export const probabilityFixationB = [
  ex(11,"Reconnaître une loi de probabilité",lawTable(["-93","0","200","730"],["1/3","1/3","1/6","1/6"]),[
    w("1.","Justifie que ce tableau définit une loi de probabilité.",String.raw`Les quatre nombres de la seconde ligne sont positifs. De plus :
$$\frac13+\frac13+\frac16+\frac16=\frac{2+2+1+1}{6}=1.$$
Ils peuvent donc être les probabilités des quatre valeurs distinctes affichées. **Le tableau définit bien une loi de probabilité.** Les valeurs de $X$ peuvent être négatives : ce sont les probabilités qui ne doivent pas l’être.`),
  ]),
  ex(12,"Compléter une loi de probabilité",lawTable(["-1999","2002","1","2022","2041"],["1/18","2/9","a","5/18","1/9"]),[
    num("1.","Détermine a pour que le tableau soit une loi de probabilité.",String.raw`\frac13`,["1/3"],String.raw`La somme doit être $1$ :
$$a=1-\left(\frac1{18}+\frac29+\frac5{18}+\frac19\right)
=1-\frac{1+4+5+2}{18}=\boxed{\frac13}.$$
Cette valeur est positive ; les deux conditions d’une loi de probabilité sont satisfaites.`),
  ]),
  ex(13,"Somme de deux dés numérotés",dice,[
    w("1.a)","Justifie que X est une variable aléatoire.",String.raw`À chaque couple de faces obtenu, la somme associe **un unique nombre réel**. Cette application de l’univers des couples de faces vers $\mathbb R$ est donc une variable aléatoire.`),
    w("1.b)","Donne l’ensemble des valeurs prises par X.",String.raw`La plus petite somme est $-1+0=-1$ ; la plus grande est $1+2=3$. Les valeurs intermédiaires $0,1,2$ sont aussi possibles. Ainsi $\boxed{X(\Omega)=\{-1;0;1;2;3\}}$.`),
    w("2.","Détermine la loi de probabilité de X.",diceLawSolution+"\n\n"+diceLaw),
  ]),
  ex(14,"Fonction de répartition : vrai ou faux","On considère une variable aléatoire à valeurs finies et sa fonction de répartition F.",[
    tf("1.",String.raw`$F$ est une application de $\mathbb R$ dans $\mathbb R$.`,true,String.raw`Pour chaque réel $t$, $F(t)=P(X\le t)$ est un nombre de $[0;1]$, donc un réel. La proposition est **vraie**. Dire que les valeurs sont dans $[0;1]$ est plus précis, mais ne rend pas fausse l’arrivée dans $\mathbb R$.`),
    tf("2.","F est croissante.",true,String.raw`Si $s<t$, alors $\{X\le s\}\subset\{X\le t\}$. Donc $P(X\le s)\le P(X\le t)$. La fonction est **croissante au sens large**, pas nécessairement strictement croissante.`),
    tf("3.","La courbe de F n’est pas une courbe en escalier.",false,String.raw`Entre deux valeurs successives de $X$, aucun nouvel événement n’est ajouté au cumul : $F$ reste constante. Aux valeurs de $X$, elle saute de la masse correspondante. Pour une variable à valeurs finies, sa représentation est donc **en escalier** : la proposition est fausse.`),
    tf("4.","F est affine par intervalles.",true,String.raw`Sur chaque intervalle entre deux valeurs successives, $F$ est constante. Or une fonction constante s’écrit $t\mapsto0t+b$ : c’est une fonction affine de pente nulle. La proposition est donc **vraie** ; cela ne signifie pas que $F$ est une seule fonction affine sur tout $\mathbb R$.`),
  ]),
  ex(15,"Construire une fonction de répartition",smallLaw,[
    w("1.","Détermine la fonction de répartition F de X.",smallCdf),
    w("2.","Représente graphiquement F.",String.raw`Trace les quatre paliers donnés en 1 : hauteurs $0,2/7,6/7,1$. À chaque saut, place un point plein à la hauteur de la nouvelle valeur et un point vide au bout du palier précédent. Ainsi le point d’abscisse $1$ retenu est $(1;6/7)$, et non $(1;2/7)$. Il ne faut pas relier les paliers par des segments verticaux appartenant au graphe.`),
  ],{correctionFigureKey:"tc-l9-probability"}),
  ex(16,"Des dés à la fonction de répartition",dice,[
    w("1.","Détermine la loi de X.",diceLawSolution+"\n\n"+diceLaw),
    w("2.a)","Détermine sa fonction de répartition F.",diceCdf),
    w("2.b)","Représente F dans un repère.",String.raw`Trace les six paliers de hauteurs $0,2/36,10/36,22/36,32/36,1$. Les sauts ont pour abscisses $-1,0,1,2,3$. Le point plein se situe toujours sur le palier qui commence : $F(0)=10/36$, par exemple. Le tracé ci-dessous distingue les extrémités incluses et exclues.`),
  ],{correctionFigureKey:"tc-l9-probability"}),
  ex(17,"Paramètres d’une loi binomiale",String.raw`$X$ suit $\mathcal B(n,p)$, avec $n\ge2$ et $0<p<1$. Choisis la bonne réponse dans chaque cas.`,[
    choice("1.",String.raw`$E(X)$ est égal à…`,["$np$","$n(1-p)$","$pn(1-p)$","$n^2p$"],0,String.raw`La formule de l’espérance est $\boxed{E(X)=np}$ : nombre d’essais multiplié par la probabilité de succès. $np(1-p)$ est la variance, pas l’espérance.`),
    choice("2.",String.raw`$\sigma(X)$ est égal à…`,[String.raw`$\sqrt{np}$`,String.raw`$\sqrt{n(1-p)}$`,String.raw`$\sqrt{pn(1-p)}$`,String.raw`$\sqrt{n^2p}$`],2,String.raw`La variance vaut $np(1-p)$. L’écart type est sa racine carrée positive :
$$\boxed{\sigma(X)=\sqrt{np(1-p)}}.$$
Il faut garder à la fois $p$ et $1-p$ sous la racine.`),
  ]),
  ex(18,"Calculer une espérance",diceLaw,[
    num("1.",String.raw`Calcule $E(X)$.`,String.raw`\frac76`,["7/6"],String.raw`On multiplie chaque valeur par sa probabilité :
$$E(X)=\frac{-1\times2+0\times8+1\times12+2\times10+3\times4}{36}.$$
Le numérateur vaut $-2+12+20+12=42$. Donc $\boxed{E(X)=42/36=7/6}$.`),
  ]),
  ex(19,"Variance et écart type",diceLaw+"\n\n"+String.raw`On donne $E(X)=7/6$.`,[
    num("1.",String.raw`Calcule $V(X)$.`,String.raw`\frac{41}{36}`,["41/36"],String.raw`Calculons d’abord l’espérance du carré :
$$E(X^2)=\frac{(-1)^2\,2+0^2\,8+1^2\,12+2^2\,10+3^2\,4}{36}
=\frac{90}{36}=\frac52.$$
Puis $V(X)=E(X^2)-E(X)^2=\frac52-\frac{49}{36}=\boxed{\frac{41}{36}}$. On ne soustrait pas $E(X)$ mais **son carré**.`),
    num("2.",String.raw`Déduis-en $\sigma(X)$.`,String.raw`\frac{\sqrt{41}}6`,["sqrt(41)/6","√41/6"],String.raw`L’écart type est la racine carrée positive de la variance :
$$\sigma(X)=\sqrt{\frac{41}{36}}=\boxed{\frac{\sqrt{41}}6}\approx1,067.$$
On conserve la valeur exacte jusqu’à ce dernier arrondi.`),
  ]),
  ex(20,"Paramètres d’une variable de Bernoulli",String.raw`$X$ prend $0$ avec probabilité $1-p$ et $1$ avec probabilité $p$, où $0\le p\le1$.`,[
    w("1.",String.raw`Démontre que $E(X)=p$ et $V(X)=p(1-p)$.`,String.raw`Par la définition de l’espérance :
$$E(X)=0(1-p)+1p=p.$$
Comme $0^2=0$ et $1^2=1$, on a aussi $E(X^2)=p$. Par conséquent :
$$V(X)=E(X^2)-E(X)^2=p-p^2=\boxed{p(1-p)}.$$
La démonstration reste valable pour $p=0$ ou $p=1$.`),
  ]),
  ex(21,"Retrouver les paramètres",String.raw`$X$ suit une loi binomiale $\mathcal B(n,p)$ avec $E(X)=43,2$ et $V(X)=27,648$.`,[
    w("1.",String.raw`Justifie que $1-p=0,64$.`,String.raw`Les formules donnent $np=43,2$ et $np(1-p)=27,648$. Puisque $43,2>0$, on peut diviser la seconde égalité par la première :
$$1-p=\frac{27,648}{43,2}=\boxed{0,64}.$$`),
    num("2.a)","Détermine p.",String.raw`0,36`,["0.36","0,36","9/25"],String.raw`La probabilité de succès est le complément de $1-p$. Ainsi $p=1-0,64=\boxed{0,36}$.`),
    num("2.b)","Détermine n.",String.raw`120`,["120"],String.raw`Comme $np=43,2$ et $p=0,36$, on a $n=43,2/0,36=\boxed{120}$. Vérification : $120\times0,36\times0,64=27,648$.`),
  ]),
  ex(22,"Deux paramètres possibles",String.raw`$X$ suit $\mathcal B(25,p)$ et $\sigma(X)=1,5$.`,[
    w("1.","Détermine toutes les valeurs possibles de p.",String.raw`Il faut d’abord élever l’écart type au carré :
$$V(X)=1,5^2=2,25=25p(1-p).$$
Ainsi $p(1-p)=0,09$, soit $p^2-p+0,09=0$. Le discriminant vaut $1-4\times0,09=0,64$, de racine $0,8$. Les solutions sont :
$$p=\frac{1-0,8}{2}=\boxed{0,1}\quad\text{ou}\quad
p=\frac{1+0,8}{2}=\boxed{0,9}.$$
Toutes deux appartiennent à $[0;1]$. L’écart type seul ne permet pas de choisir entre elles.`),
  ]),
];
