import{gcdExercise as e,proof,written}from"./terminalCGcdBuilders";
export const gcdDeepeningC=[
e(79,"Les nombres de Fermat",String.raw`Pour $n\in\mathbb N$, on pose $F_n=2^{2^n}+1$. On étudie la primalité et les diviseurs de cette famille.`,[
written("1.a)",String.raw`Soient $a,m\geq2$. Si $a^m+1$ est premier, montrer que $m=2^n$ pour un $n\in\mathbb N$ et que $a$ est pair.`,String.raw`Si $a$ était impair, $a^m+1$ serait pair et supérieur à2, donc composé. Ainsi $a$ est pair.

Écrivons $m=2^n r$ avec $r$ impair. Si $r>1$, en posant $X=a^{2^n}$, on a
$$a^m+1=X^r+1=(X+1)(X^{r-1}-X^{r-2}+\cdots-X+1).$$
Le premier facteur est strictement compris entre1 et $X^r+1$ : ce dernier ne peut pas être premier. Donc $r=1$ et $m=2^n$. Comme $m\geq2$, on a en fait $n\geq1$.`),
written("1.b)",String.raw`En déduire qu’un nombre premier de la forme $a^m+1$, avec $a,m\geq2$, s’écrit $k^{2^n}+1$, avec $k$ pair.`,String.raw`La question 1.a donne directement $m=2^n$ et $a$ pair. On prend donc $k=a$. C’est une condition **nécessaire**, pas une garantie de primalité. `),
written("2.a)","Montrer que tous les nombres de Fermat sont impairs.",String.raw`$2^n\geq1$ pour tout $n\geq0$. Ainsi $2^{2^n}$ est pair et $F_n$, qui lui ajoute1, est impair.`),
written("2.b)",String.raw`Montrer que $F_0,F_1,F_2,F_3,F_4$ sont premiers.`,String.raw`Ils valent respectivement $3,5,17,257,65537$. Un entier composé possède un diviseur premier inférieur ou égal à sa racine carrée.

Pour $3,5,17$, les vérifications sont immédiates. Pour 257, il suffit de tester $2,3,5,7,11,13$, car $16<\sqrt{257}<17$ : aucun ne le divise.

Pour 65537, $\sqrt{65537}<257$. Les premiers à tester sont :
$$2,3,5,7,11,13,17,19,23,29,31,37,41,43,$$
$$47,53,59,61,67,71,73,79,83,89,97,101,103,107,$$
$$109,113,127,131,137,139,149,151,157,163,167,173,$$
$$179,181,191,193,197,199,211,223,227,229,233,239,241,251.$$
Les divisions euclidiennes donnent toutes un reste non nul ; le tableau de vérification fournit ces 54 restes. Le nombre 65537 est donc premier. Cette vérification finie est plus longue, mais ne suppose aucun théorème de primalité hors programme.`),
written("2.c)",String.raw`Montrer que $F_5$ est divisible par 641.`,String.raw`On remarque $641=5\times2^7+1=5^4+2^4$. Modulo641 :
$$5\times2^7\equiv-1,\qquad5^4\equiv-2^4.$$
On élève la première congruence à la puissance4 :
$$5^4 2^{28}\equiv1.$$
En remplaçant $5^4$ : $-2^{32}\equiv1$, donc $2^{32}+1\equiv0\pmod{641}$. Ainsi $641\mid F_5$. On vérifie $F_5=641\times6700417$.`),
written("3.a)",String.raw`Montrer $F_{n+1}=(F_n-1)^2+1$.`,String.raw`$F_n-1=2^{2^n}$. En élevant au carré, on obtient $2^{2\cdot2^n}=2^{2^{n+1}}$. Ajouter1 donne exactement $F_{n+1}$.`),
written("3.b)",String.raw`Montrer par récurrence que, pour $n\geq2$, le chiffre des unités de $F_n$ est7.`,String.raw`**Initialisation :** $F_2=17$ finit par 7.

**Hérédité :** si $F_n\equiv7\pmod{10}$, alors $(F_n-1)^2+1\equiv6^2+1=37\equiv7\pmod{10}$. Par3.a, $F_{n+1}$ finit aussi par 7. La propriété est établie pour tout $n\geq2$.`),
written("4.a)",String.raw`Montrer $F_n-2=F_0F_1\cdots F_{n-1}$ pour $n\geq1$.`,String.raw`**Initialisation :** $F_1-2=5-2=3=F_0$.

**Hérédité :** si l’égalité vaut au rang $n$, alors
$$F_0\cdots F_n=(F_n-2)F_n=(F_n-1)^2-1=F_{n+1}-2.$$
On a utilisé3.a. La formule est donc vraie pour tout $n\geq1$.`),
written("4.b)",String.raw`Montrer que $F_m$ et $F_n$ sont premiers entre eux si $m\ne n$.`,String.raw`Supposons $m<n$. Tout diviseur commun divise $F_n$ et le produit $F_0\cdots F_{n-1}=F_n-2$, puisque ce produit contient $F_m$. Il divise donc2. Mais les deux nombres sont impairs : leur PGCD est impair et ne peut être que $\boxed1$.`),
written("5.a)",String.raw`Soit $p>2$ premier. Montrer que l’ensemble des $k\geq2$ tels que $2^k\equiv1\pmod p$ possède un plus petit élément $k_0$.`,String.raw`Fermat donne $2^{p-1}\equiv1\pmod p$, et $p-1\geq2$. L’ensemble est donc non vide ; un ensemble non vide d’entiers naturels possède un plus petit élément. De plus, $k=1$ ne convient pas, puisque $p$ ne divise pas $2-1=1$.`),
written("5.b)",String.raw`Si $2^k\equiv1\pmod p$, montrer que $k_0\mid k$.`,String.raw`Écrivons $k=qk_0+r$, $0\leq r<k_0$. Alors $2^k\equiv2^r\pmod p$. On en déduit $2^r\equiv1$. Un reste $r>0$ contredirait la minimalité de $k_0$ ; $r=1$ est également impossible. Ainsi $r=0$ et $k_0\mid k$.`),
written("5.c)",String.raw`Si un premier $p$ divise $F_n$ et est distinct de $F_n$, montrer que $p=2^{n+1}q+1$, où $q$ possède un diviseur impair au moins égal à3.`,String.raw`On a $2^{2^n}\equiv-1\pmod p$, donc $2^{2^{n+1}}\equiv1$ mais $2^{2^n}\not\equiv1$, car $p$ est impair. D’après5.b, $k_0$ divise $2^{n+1}$. Ses diviseurs étant des puissances de2, la seconde condition force $k_0=2^{n+1}$.

Fermat et5.b donnent $2^{n+1}\mid p-1$, donc $p=2^{n+1}q+1$ avec $q\geq1$.

Si $q$ n’avait aucun diviseur impair supérieur à 1, il serait une puissance de2. Alors $p=2^t+1$ pour un certain $t$. La primalité de $p$ impose, par1.a (ou directement si $t=1$), que $t$ soit une puissance de2 : $p$ serait un nombre de Fermat $F_s$. Puisqu’il divise $F_n$, la coprimalité de4.b impose $s=n$, donc $p=F_n$, contradiction. Ainsi $q$ possède bien un diviseur impair $\geq3$. Il n’est pas nécessaire que $q$ lui-même soit impair.`),
],true),
e(80,"Le codage",String.raw`Les lettres A à Z portent les indices 0 à 25. Une lettre d’indice $n$ est codée par l’indice $\varphi(n)$, reste de $an+b$ modulo 26, où $0\leq a,b\leq25$. Deux lettres différentes doivent avoir deux codes différents. On sait que A est codé H et E est codé B.`,[
written("1.",String.raw`Montrer $4a+b\equiv1\pmod{26}$ et $b\equiv7\pmod{26}$.`,String.raw`A a l’indice 0 et H l’indice7 : $b\equiv7$. E a l’indice4 et B l’indice1 : $4a+b\equiv1\pmod{26}$.`),
written("2.","Déterminer les couples (a;b) entre 0 et25.",String.raw`$b=7$, donc $4a\equiv-6\equiv20\pmod{26}$. On réduit par 2 : $2a\equiv10\pmod{13}$, puis on multiplie par 7 : $a\equiv5\pmod{13}$. Dans l’intervalle donné, $\boxed{(a;b)=(5;7)\ \text{ou}\ (18;7)}$.`),
written("3.a)","Avec a=18 et b=7, coder K et X.",String.raw`K a l’indice10 : $18\times10+7=187\equiv5\pmod{26}$, soit F. X a l’indice23 : $18\times23+7=421\equiv5$, encore F. Ainsi $\boxed{K\mapsto F,\ X\mapsto F}$.`),
written("3.b)","Pourquoi ce choix ne convient-il pas ?",String.raw`Deux lettres différentes, K et X, ont le même code F. Le codage n’est pas injectif et ne permet pas de retrouver une lettre de façon unique. Le couple(18;7) doit donc être écarté.`),
written("4.a)","Avec a=5 et b=7, coder K et X.",String.raw`$5\times10+7=57\equiv5$ : K devient F. $5\times23+7=122\equiv18$ : X devient S. Ainsi $\boxed{K\mapsto F,\ X\mapsto S}$.`),
written("4.b)","Coder le message GAUSS.",String.raw`Les indices de G,A,U,S,S sont6,0,20,18,18. Les restes de $5n+7$ sont11,7,3,19,19, soit $\boxed{\text{LHDTT}}$.`),
written("5.a)",String.raw`Montrer que $\varphi$ est injective sur les indices $\{0,\ldots,25\}$.`,String.raw`Si $\varphi(n)=\varphi(m)$, alors $5n+7\equiv5m+7\pmod{26}$, donc $5(n-m)\equiv0$. Comme5 est premier avec26, $n\equiv m\pmod{26}$. Dans l’intervalle0 à 25, cela impose $n=m$. L’application est injective sur cet ensemble fini ; sur tout $\mathbb N$, elle serait périodique et ne le serait pas.`),
written("5.b)","En déduire que deux lettres différentes ne peuvent avoir le même code.",String.raw`Deux lettres différentes ont des indices différents dans0 à 25. L’injectivité de5.a leur associe des indices codés différents, donc des lettres différentes.`),
written("6.a)","Montrer que5 et26 sont premiers entre eux.",String.raw`$26=5\times5+1$. Ainsi $26-5\times5=1$ est une identité de Bézout : le PGCD vaut 1.`),
written("6.b)",String.raw`Donner une solution de $5u\equiv1\pmod{26}$.`,String.raw`$5\times21=105=4\times26+1$. Donc $\boxed{u=21}$ est un inverse de5 modulo 26.`),
written("7.a)",String.raw`Montrer $n\equiv9-5\varphi(n)\pmod{26}$.`,String.raw`$\varphi(n)\equiv5n+7$. En multipliant par l’inverse21, on obtient $n\equiv21\varphi(n)-147$. Or $21\equiv-5$ et $-147\equiv9\pmod{26}$. D’où $\boxed{n\equiv9-5\varphi(n)\pmod{26}}$.`),
written("7.b)","Décoder AWA.",String.raw`Les indices codés sont0,22,0. La formule donne les restes9,3,9 : $9-5\times22=-101\equiv3\pmod{26}$. Le message décodé est donc $\boxed{\text{JDJ}}$. On vérifie en recodant : J devient A, D devient W, J devient A.`),
],true),
e(81,"Le réseau",String.raw`Pour $a,b>0$, $R_{a,b}$ désigne les points à coordonnées entières naturelles $(x;y)$ tels que $0\leq x\leq a$ et $0\leq y\leq b$.`,[
written("A.1.",String.raw`Représenter les points de $R_{8,8}$ tels que $x\equiv2\pmod3$ et $y\equiv1\pmod3$.`,String.raw`Dans0 à8, les valeurs de $x$ sont2,5,8 et celles de $y$ sont1,4,7. On place les9 points de $\{2,5,8\}\times\{1,4,7\}$. Le premier graphique les distingue dans le réseau.`),
written("A.2.",String.raw`Représenter les points de $R_{8,8}$ tels que $x+y\equiv1\pmod3$.`,String.raw`Pour chaque abscisse, les restes possibles des ordonnées sont : $y\equiv1$ si $x\equiv0$, $y\equiv0$ si $x\equiv1$, $y\equiv2$ si $x\equiv2$. Chacune des9 abscisses donne3 ordonnées, soit27 points, représentés sur le deuxième graphique.`),
written("A.3.",String.raw`Représenter les points de $R_{8,8}$ tels que $x\equiv y\pmod3$.`,String.raw`On réunit les trois grilles $\{0,3,6\}^2$, $\{1,4,7\}^2$, $\{2,5,8\}^2$. Il y a27 points, représentés sur le troisième graphique.`),
written("B.1.",String.raw`Donner une solution particulière de $7x-4y=1$.`,String.raw`$7\times3-4\times5=21-20=1$ : $\boxed{(3;5)}$ convient.`),
written("B.2.","Résoudre cette équation dans ℤ².",String.raw`Après soustraction de l’identité précédente : $7(x-3)=4(y-5)$. Comme7 et4 sont premiers entre eux, $x=3+4k$ et $y=5+7k$. La substitution prouve la réciproque : $\boxed{S=\{(3+4k;5+7k)\mid k\in\mathbb Z\}}$.`),
written("B.3.",String.raw`Montrer qu’une seule solution appartient à $R_{4,7}$.`,String.raw`$0\leq3+4k\leq4$ impose $-3/4\leq k\leq1/4$, donc $k=0$. Ce choix donne $y=5\in[0;7]$. L’unique solution du réseau est $\boxed{(3;5)}$.`),
written("C.1.",String.raw`Pour $A(a;b)$, caractériser les points de $[OA]$ par $0\leq x\leq a$, $0\leq y\leq b$, $ay=bx$.`,String.raw`Un point du segment s’écrit $(x;y)=(ta;tb)$, $0\leq t\leq1$, d’où les inégalités et $ay=bx$. Réciproquement, si ces conditions sont remplies, poser $t=x/a$ ; alors $0\leq t\leq1$ et l’égalité impose $y=tb$. Donc le point appartient au segment.`),
written("C.2.","Si a et b sont premiers entre eux, montrer que seuls O et A sont des points entiers de ce segment.",String.raw`Pour un point entier, $ay=bx$ donne $a\mid bx$. Gauss impose $a\mid x$. Avec $0\leq x\leq a$, cela donne $x=0$ ou $x=a$, et alors $y=0$ ou $y=b$. Seuls O et A conviennent.`),
written("C.3.","Si a et b ne sont pas premiers entre eux, montrer qu’il existe un autre point entier du segment.",String.raw`Posons $d=\operatorname{PGCD}(a;b)>1$. Le point $(a/d;b/d)$ a des coordonnées entières et s’écrit $(1/d)A$, avec $0<1/d<1$. Il est strictement entre O et A. Plus généralement, les points sont $(ka/d;kb/d)$ pour $k=0,\ldots,d$, soit $d+1$ points.`),
],true),
];
