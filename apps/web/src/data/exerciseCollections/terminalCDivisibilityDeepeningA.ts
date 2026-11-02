import { divExercise as ex,written as w,short as s } from "./terminalCDivisibilityBuilders";
export const divisibilityDeepeningA=[
  ex(27,"Une somme de longueur impaire",String.raw`Soit $p\in\mathbb N^\ast$.`,[
    w("Démonstration",String.raw`Démontrer que la somme de $2p+1$ entiers naturels consécutifs est divisible par $2p+1$.`,String.raw`Notons $a$ le premier entier. Les entiers sont $a,a+1,\ldots,a+2p$. Leur somme vaut :
$$S=(2p+1)a+(0+1+\cdots+2p).$$
Or $0+\cdots+2p=\frac{2p(2p+1)}2=p(2p+1)$. Donc :
$$\boxed{S=(2p+1)(a+p).}$$
Le facteur $a+p$ est entier : la somme est bien divisible par $2p+1$. C’est aussi le produit du nombre de termes par le terme central.`),
  ]),
  ex(28,"Somme nulle de trois naturels",String.raw`Soient $a,b,c\in\mathbb N$.`,[
    w("Démonstration",String.raw`Démontrer $a+b+c=0\iff a=b=c=0$.`,String.raw`Si $a=b=c=0$, leur somme est évidemment nulle.

Réciproquement, supposons $a+b+c=0$. Comme les trois nombres sont positifs ou nuls, $0\le a\le a+b+c=0$, donc $a=0$. De même, $b=0$ et $c=0$.

Les deux implications établissent l’équivalence. Dans $\mathbb Z$, sans la positivité, elle serait fausse : $1+(-1)+0=0$.`),
  ]),
  ex(29,"Somme nulle de n naturels",String.raw`Soient $n\ge2$ et $a_1,\ldots,a_n\in\mathbb N$.`,[
    w("Démonstration",String.raw`Démontrer $a_1+\cdots+a_n=0\iff a_1=\cdots=a_n=0$.`,String.raw`Si tous les termes sont nuls, leur somme est nulle.

Inversement, supposons la somme nulle. Pour tout indice $i$, tous les autres termes sont positifs ou nuls, donc :
$$0\le a_i\le\sum_{j=1}^n a_j=0.$$
Ainsi $a_i=0$ pour chaque indice $i$. On a donc démontré les deux sens, pour tout $n\ge2$.`),
  ]),
  ex(30,"Différence de carrés dans ℕ",String.raw`On cherche $(x,y)\in\mathbb N^2$.`,[
    w("Résolution",String.raw`Résoudre $x^2-y^2=25$.`,String.raw`Factorisons : $(x-y)(x+y)=25$. Comme $x^2>y^2$ avec $x,y\ge0$, on a $x>y$, donc les deux facteurs sont positifs et $x-y\le x+y$.

Les seuls couples possibles sont $(x-y,x+y)=(1,25)$ ou $(5,5)$. Ils ont bien des composantes de même parité.

- Premier cas : en additionnant et soustrayant, $2x=26$ et $2y=24$, soit $(13,12)$.
- Second cas : $2x=10$ et $2y=0$, soit $(5,0)$.

Les deux couples vérifient l’équation. L’ensemble des solutions est $\boxed{\{(13;12),(5;0)\}}$.`),
  ]),
  ex(31,"Différence de carrés dans ℤ",String.raw`On cherche $(x,y)\in\mathbb Z^2$.`,[
    w("Résolution",String.raw`Résoudre $x^2-y^2=25$.`,String.raw`On pose $u=x-y$, $v=x+y$ : $uv=25$. Les couples de facteurs signés sont :
$$(1,25),(5,5),(25,1),(-1,-25),(-5,-5),(-25,-1).$$
Ils ont tous des composantes impaires, donc $x=(u+v)/2$, $y=(v-u)/2$ sont entiers.

On obtient les six solutions :
$$\boxed{(13;12),(5;0),(13;-12),(-13;-12),(-5;0),(-13;12).}$$
Elles sont distinctes et leurs carrés satisfont l’équation. Les signes ne doivent pas être oubliés dans $\mathbb Z$.`),
  ]),
  ex(32,"Un reste dépendant de n",String.raw`Soit $n\in\mathbb N^\ast$. Déterminer les restes des divisions suivantes. Il faut tenir compte des petites valeurs de $n$.`,[
    w("a)",String.raw`$n^2+2n$ par $n+1$.`,String.raw`On écrit :
$$n^2+2n=n(n+1)+n.$$
Puisque $n\ge1$, on a $0\le n<n+1$. C’est donc bien une division euclidienne, de quotient $n$ et de reste $\boxed n$.`),
    w("b)",String.raw`$7n+15$ par $3n+2$.`,String.raw`Une égalité utile est $7n+15=2(3n+2)+(n+11)$, mais son reste n’est admissible que si $n+11<3n+2$, soit $n\ge5$.

Pour les autres rangs :

| $n$ | Quotient | Reste |
|---|---|---|
| $1$ | $4$ | $2$ |
| $2$ | $3$ | $5$ |
| $3$ | $3$ | $3$ |
| $4$ | $3$ | $1$ |

Ainsi le reste vaut **2** si $n=1$, **$9-2n$** si $2\le n\le4$, et **$n+11$** si $n\ge5$. Dans chaque cas il est positif ou nul et strictement inférieur à $3n+2$.`),
  ]),
  ex(33,"Découper un entier en blocs",String.raw`On travaille modulo $37$.`,[
    w("1.",String.raw`Démontrer, pour tout $n\in\mathbb N$, $10^{3n}\equiv1\pmod{37}$.`,String.raw`Comme $1000=37\times27+1$, on a $10^3\equiv1\pmod{37}$. En élevant à la puissance $n$ :
$$10^{3n}=(10^3)^n\equiv1^n=1\pmod{37}.$$
Le cas $n=0$ donne également $1\equiv1$.`),
    s("2.","Déterminer le reste de 1002037 par 37.","3",["3"],String.raw`Le nombre se décompose en blocs de trois chiffres :
$$1002037=1\times10^6+2\times10^3+37.$$
D’après la question précédente, il est congru à $1+2+37=40\equiv3\pmod{37}$. Comme $0\le3<37$, son reste est $\boxed3$.`),
  ]),
  ex(34,"Récurrence et divisibilité par 17",String.raw`Pour $n\in\mathbb N$, posons $A_n=3\times5^{2n+1}+2^{3n+1}$.`,[
    w("Démonstration",String.raw`Démontrer par récurrence que $17\mid A_n$.`,String.raw`**Initialisation.** $A_0=3\times5+2=17$, divisible par $17$.

**Hérédité.** Fixons $n\ge0$ et supposons $A_n=17k$. Le premier terme est multiplié par $25$ au rang suivant, et le second par $8$ :
$$A_{n+1}=25A_n+(8-25)2^{3n+1}.$$
Donc $A_{n+1}=25A_n-17\times2^{3n+1}=17(25k-2^{3n+1})$, divisible par $17$.

Par récurrence, la divisibilité est vraie pour tout $n\in\mathbb N$.`),
  ]),
  ex(35,"Le chiffre des unités",String.raw`On considère $3548^{31}\times2537^{19}$.`,[
    s("Résultat","Déterminer son chiffre des unités.","6",["6"],String.raw`On travaille modulo $10$. Le produit est congru à $8^{31}7^{19}$.

Les puissances de $8$ suivent le cycle $8,4,2,6$, et celles de $7$ le cycle $7,9,3,1$, de période $4$. Comme $31\equiv19\equiv3\pmod4$ :
$$8^{31}\equiv2,\quad7^{19}\equiv3\pmod{10}.$$
Le produit est donc congru à $2\times3=6$. Son chiffre des unités est $\boxed6$.`),
  ]),
  ex(36,"Retrouver une base",String.raw`Le nombre décimal $12551$ s’écrit $\overline{30407}_{\,b}$.`,[
    s("Base","Déterminer b.","8",["8"],String.raw`La présence du chiffre $7$ impose $b\ge8$. La valeur de l’écriture est :
$$3b^4+4b^2+7=12551.$$
Pour $b=8$, $3(4096)+4(64)+7=12288+256+7=12551$. La base $8$ convient.

La fonction entière $3b^4+4b^2+7$ est strictement croissante pour $b\ge1$ : une base plus grande donne une valeur plus grande. Il n’y a donc pas d’autre solution. $\boxed{b=8}$.`),
  ]),
  ex(37,"Deux chiffres à déterminer",String.raw`$a,b$ sont des chiffres décimaux. Le nombre $\overline{1a8b2}$ doit être divisible à la fois par $4$ et par $9$.`,[
    w("Recherche","Déterminer tous les couples (a ; b).",String.raw`Le nombre formé des deux derniers chiffres est $10b+2$. Modulo $4$, il vaut $2b+2$. La divisibilité par $4$ impose donc $b$ impair :
$$b\in\{1,3,5,7,9\}.$$
La somme des chiffres vaut $1+a+8+b+2=a+b+11$. Comme $0\le a\le9$, cette somme est un multiple de $9$ seulement si $a+b=7$ ou $a+b=16$.

- Pour $a+b=7$ : $(a,b)=(6,1),(4,3),(2,5),(0,7)$.
- Pour $a+b=16$ : $(a,b)=(9,7),(7,9)$.

Ces six couples respectent les deux critères et épuisent toutes les possibilités.`),
  ]),
  ex(38,"Une addition dans une base inconnue",String.raw`Dans une même base $b$, $\overline{36}_{\,b}+\overline{45}_{\,b}=\overline{103}_{\,b}$.`,[
    s("1.","Déterminer la base b.","8",["8"],String.raw`Le chiffre $6$ impose $b\ge7$. En passant à la valeur décimale :
$$(3b+6)+(4b+5)=b^2+3.$$
Donc $b^2-7b-8=(b-8)(b+1)=0$. La seule base entière admissible est $\boxed8$.`),
    s("2.",String.raw`Calculer $\overline{36}_{\,b}\times\overline{45}_{\,b}$ dans cette base.`,String.raw`$\overline{2126}_{\,8}$`,["2126"],String.raw`Avec $b=8$, les deux valeurs décimales sont $30$ et $37$, de produit $1110$.
$$1110=8(138)+6,\quad138=8(17)+2,$$
$$17=8(2)+1,\quad2=8(0)+2.$$
La lecture à rebours donne $\boxed{\overline{2126}_{\,8}}$. Vérification : $2(512)+1(64)+2(8)+6=1110$.`),
  ],{correctionFigureKey:"tc-t2-l2-arithmetic"}),
  ex(39,"Une multiplication dans une base inconnue",String.raw`Dans une même base $b$, $\overline{122}_{\,b}\times\overline{103}_{\,b}=\overline{13121}_{\,b}$.`,[
    s("Base","Déterminer b.","5",["5"],String.raw`On doit avoir $b\ge4$. En développant :
$$(b^2+2b+2)(b^2+3)=b^4+3b^3+b^2+2b+1.$$
Après simplification, $b^3-4b^2-4b-5=0$. Or :
$$b^3-4b^2-4b-5=(b-5)(b^2+b+1).$$
Le facteur $b^2+b+1$ est strictement positif pour $b\ge4$. La seule base possible est donc $\boxed5$. Vérification décimale : $37\times28=1036=\overline{13121}_{\,5}$.`),
  ]),
  ex(40,"Nombre de chiffres et encadrement",String.raw`$x>0$ s’écrit $\overline{a_n a_{n-1}\ldots a_0}_{\,b}$, avec $a_n\ne0$ et $b\ge2$.`,[
    w("Démonstration",String.raw`Démontrer $b^n\le x<b^{n+1}$.`,String.raw`Comme $a_n\ge1$ et tous les termes sont positifs ou nuls :
$$x=a_nb^n+\cdots+a_0\ge b^n.$$
Pour la borne supérieure, chaque chiffre est au plus $b-1$ :
$$x\le(b-1)(1+b+\cdots+b^n).$$
La somme géométrique donne $(b-1)(1+\cdots+b^n)=b^{n+1}-1$. Donc :
$$\boxed{b^n\le x\le b^{n+1}-1<b^{n+1}.}$$
L’entier possède exactement $n+1$ chiffres dans cette base.`),
  ]),
  ex(41,"Une multiplication en grands blocs",String.raw`Soit $N=39678472\times8752338$, dans le système décimal.`,[
    w("1.",String.raw`Écrire $N$ en base $10^4$.`,String.raw`Posons $B=10000$. Les facteurs s’écrivent $3967B+8472$ et $875B+2338$.
$$N=3471125B^2+16687846B+19807536.$$
On effectue les retenues en base $B$ :
$19807536=1980B+7536$ ;
$16687846+1980=16689826=1668B+9826$ ;
$3471125+1668=3472793=347B+2793$.

Ainsi :
$$\boxed{N=347B^3+2793B^2+9826B+7536.}$$
Ses quatre « chiffres » en base $10000$ sont donc $(347;\,2793;\,9826;\,7536)$, chacun inférieur à $10000$.`),
    w("2.","En déduire sa valeur en base 10.",String.raw`Chaque chiffre de base $10000$ occupe un bloc de quatre chiffres décimaux, sauf le premier qui n’a pas besoin de zéro initial :
$$347\ |\ 2793\ |\ 9826\ |\ 7536.$$
Par conséquent $\boxed{N=347279398267536}$. Les blocs intérieurs doivent garder leurs quatre positions, y compris les éventuels zéros.`),
  ]),
  ex(42,"Un autre critère pour 4",String.raw`On considère un entier naturel dont le chiffre des dizaines est $d$ et le chiffre des unités $u$.`,[
    w("Démonstration",String.raw`Démontrer qu’il est divisible par $4$ si et seulement si $2d+u$ l’est.`,String.raw`Le nombre s’écrit $N=100A+10d+u$, avec $A\in\mathbb N$. Modulo $4$, $100A\equiv0$ et $10d\equiv2d$ ; ainsi :
$$N\equiv2d+u\pmod4.$$
Les deux nombres ont le même reste dans la division par $4$. Donc $4\mid N$ si et seulement si $4\mid(2d+u)$, ce qui prouve les deux implications d’un seul calcul.`),
  ]),
];
