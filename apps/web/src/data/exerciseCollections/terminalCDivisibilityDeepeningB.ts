import { divExercise as ex,written as w,short as s } from "./terminalCDivisibilityBuilders";
export const divisibilityDeepeningB=[
  ex(43,"Somme de deux carrés consécutifs",String.raw`Soit $n\in\mathbb Z$.`,[
    w("1.",String.raw`Si $n$ est la somme des carrés de deux entiers relatifs consécutifs, démontrer que $2n-1$ est le carré d’un entier relatif.`,String.raw`Il existe $k\in\mathbb Z$ tel que $n=k^2+(k+1)^2=2k^2+2k+1$. Alors :
$$2n-1=4k^2+4k+1=(2k+1)^2.$$
Le nombre $2k+1$ est entier, ce qui démontre la propriété demandée.`),
    w("2.",String.raw`Réciproquement, si $2n-1$ est le carré d’un entier relatif, démontrer que $n$ est la somme des carrés de deux entiers relatifs consécutifs.`,String.raw`Supposons $2n-1=m^2$ avec $m\in\mathbb Z$. Le carré $m^2$ est impair, donc $m$ est impair : écrivons $m=2k+1$ avec $k\in\mathbb Z$.
$$2n=(2k+1)^2+1=4k^2+4k+2.$$
En divisant par $2$, $n=2k^2+2k+1=k^2+(k+1)^2$. Les entiers $k$ et $k+1$ sont consécutifs : la réciproque est démontrée.`),
  ]),
  ex(44,"Un impair comme différence de carrés",String.raw`Soit $N\in\mathbb Z$ impair.`,[
    w("Démonstration","Démontrer qu’il est la différence des carrés de deux entiers relatifs consécutifs.",String.raw`Puisque $N$ est impair, il existe $k\in\mathbb Z$ tel que $N=2k+1$. Or :
$$(k+1)^2-k^2=k^2+2k+1-k^2=2k+1=N.$$
Les entiers $k$ et $k+1$ sont consécutifs, même si $k$ est négatif. Ainsi $\boxed{N=(k+1)^2-k^2}$. L’ordre des deux carrés permet aussi d’obtenir les impairs négatifs.`),
  ]),
  ex(45,"Deux diviseurs communs possibles",String.raw`Soit $n\in\mathbb Z$.`,[
    w("Démonstration",String.raw`Démontrer que tout diviseur positif commun de $2n+3$ et $3n+2$ vaut $1$ ou $5$.`,String.raw`Si $d>0$ divise les deux nombres, il divise :
$$3(2n+3)-2(3n+2)=6n+9-6n-4=5.$$
Les seuls diviseurs positifs de $5$ sont $1$ et $5$. Ainsi $\boxed{d\in\{1,5\}}$. Cela ne signifie pas que $5$ divise les deux expressions pour chaque $n$ : on décrit seulement les valeurs possibles d’un diviseur commun.`),
  ]),
  ex(46,"Carrés modulo 5",String.raw`Soit $n\in\mathbb Z$.`,[
    w("Démonstration",String.raw`Démontrer que $n^2$ est de la forme $5k-1$, $5k$ ou $5k+1$, avec $k\in\mathbb Z$.`,String.raw`Le reste de $n$ modulo $5$ est l’un des nombres $0,1,2,3,4$. En élevant ces cinq possibilités au carré :

| $n$ modulo $5$ | $0$ | $1$ | $2$ | $3$ | $4$ |
|---|---|---|---|---|---|
| $n^2$ modulo $5$ | $0$ | $1$ | $4$ | $4$ | $1$ |

Ainsi $n^2\equiv0,1$ ou $-1\pmod5$. Cela signifie exactement $n^2=5k$, $5k+1$ ou $5k-1$ pour un entier $k$. La dernière forme correspond au reste $4$.`),
  ]),
  ex(47,"Un très grand entier modulo 7",String.raw`On considère $N=999888777666555444333222111000$.`,[
    s("Reste","Déterminer le reste de N par 7.","5",["5"],String.raw`Découpons en blocs de trois chiffres :
$$N=999\ |\ 888\ |\ 777\ |\ 666\ |\ 555\ |\ 444\ |\ 333\ |\ 222\ |\ 111\ |\ 000.$$
Comme $1000\equiv-1\pmod7$, les puissances successives de $1000$ alternent entre $1$ et $-1$. En partant du bloc des unités :
$$N\equiv0-111+222-333+444-555+666-777+888-999.$$
Chaque paire vaut $-111$ ; il y en a cinq. Donc $N\equiv-555\equiv5\pmod7$, car $-555=7(-80)+5$. Le reste est $\boxed5$.`),
  ]),
  ex(48,"Période des puissances de 4",String.raw`Soit $n\in\mathbb N$.`,[
    w("Recherche",String.raw`Déterminer, suivant $n$, le reste de $4^n$ par $11$.`,String.raw`Les puissances d’exposants $0$ à $5$ donnent les restes $1,4,5,9,3,1$ modulo $11$. Ainsi $4^5\equiv1\pmod{11}$.

Écrivons $n=5k+r$, $0\le r<5$. Alors $4^n=(4^5)^k4^r\equiv4^r$.

| $n$ modulo $5$ | $0$ | $1$ | $2$ | $3$ | $4$ |
|---|---|---|---|---|---|
| Reste de $4^n$ par $11$ | $1$ | $4$ | $5$ | $9$ | $3$ |

Les cinq restes sont admissibles et le tableau inclut le cas $n=0$.`),
  ],{correctionFigureKey:"tc-t2-l2-arithmetic"}),
  ex(49,"Période des puissances de 3",String.raw`Soit $n\in\mathbb N$.`,[
    w("Recherche",String.raw`Déterminer, suivant $n$, le reste de $3^n$ par $5$.`,String.raw`On calcule modulo $5$ : $3^0\equiv1$, $3^1\equiv3$, $3^2\equiv4$, $3^3\equiv2$, $3^4\equiv1$.

Pour $n=4k+r$, $0\le r<4$, on a $3^n=(3^4)^k3^r\equiv3^r$.

| $n$ modulo $4$ | $0$ | $1$ | $2$ | $3$ |
|---|---|---|---|---|
| Reste de $3^n$ par $5$ | $1$ | $3$ | $4$ | $2$ |

Le cycle est obtenu en multipliant chaque reste par $3$ puis en réduisant modulo $5$.`),
  ],{correctionFigureKey:"tc-t2-l2-arithmetic"}),
  ex(50,"Deux puissances de 5",String.raw`Soit $n\in\mathbb N$.`,[
    w("Recherche",String.raw`Déterminer le reste de $5^{2n}+5^{n+1}$ par $3$.`,String.raw`Comme $5\equiv-1\pmod3$ :
$$5^{2n}+5^{n+1}\equiv1+(-1)^{n+1}\pmod3.$$
- Si $n$ est pair, $n+1$ est impair : la somme est congrue à $1-1=0$.
- Si $n$ est impair, $n+1$ est pair : elle est congrue à $1+1=2$.

Le reste vaut donc $\boxed0$ pour $n$ pair, et $\boxed2$ pour $n$ impair. Ces deux nombres appartiennent à $\{0,1,2\}$.`),
  ]),
  ex(51,"Deux puissances de 3",String.raw`Soit $n\in\mathbb N$.`,[
    w("Recherche",String.raw`Déterminer le reste de $3^{2n}+3^{n+1}$ par $13$.`,String.raw`On remarque $3^3=27\equiv1\pmod{13}$. Il suffit donc d’étudier $n$ modulo $3$ :

| $n$ | $3^{2n}$ modulo $13$ | $3^{n+1}$ modulo $13$ | Somme réduite |
|---|---|---|---|
| $3k$ | $1$ | $3$ | $4$ |
| $3k+1$ | $9$ | $9$ | $5$ |
| $3k+2$ | $3$ | $1$ | $4$ |

Par exemple, à la deuxième ligne $9+9=18\equiv5\pmod{13}$. Le reste vaut $\boxed5$ si $n\equiv1\pmod3$, et $\boxed4$ dans les deux autres cas.`),
  ]),
  ex(52,"Un modulo dépendant de l’inconnue","Résoudre les congruences dans les domaines indiqués.",[
    w("1.",String.raw`$n\in\mathbb N$, $n\ge6$ et $n+1\equiv0\pmod{n-5}$.`,String.raw`Le modulo $n-5$ est positif. Comme $n+1=(n-5)+6$, la condition équivaut à $n-5\mid6$. Les diviseurs positifs de $6$ sont $1,2,3,6$.

Donc $n-5\in\{1,2,3,6\}$ et $\boxed{n\in\{6,7,8,11\}}$. Chaque valeur respecte $n\ge6$ et satisfait la congruence.`),
    w("2.",String.raw`$n\in\mathbb N$, $n\ge3$ et $n+8\equiv0\pmod{n-2}$.`,String.raw`On écrit $n+8=(n-2)+10$. La condition devient $n-2\mid10$, avec $n-2>0$.

Ainsi $n-2\in\{1,2,5,10\}$, d’où $\boxed{n\in\{3,4,7,12\}}$. Le raisonnement est une équivalence : aucune autre valeur n’est possible.`),
    w("3.",String.raw`$n\in\mathbb Z$, $n\ge-2$ et $3n+27\equiv0\pmod{n+3}$.`,String.raw`Ici $n+3\ge1$. L’égalité $3n+27=3(n+3)+18$ montre que la condition équivaut à $n+3\mid18$.

Donc $n+3\in\{1,2,3,6,9,18\}$. On soustrait $3$ :
$$\boxed{n\in\{-2,-1,0,3,6,15\}.}$$
Toutes ces valeurs respectent le domaine demandé.`),
  ]),
];
