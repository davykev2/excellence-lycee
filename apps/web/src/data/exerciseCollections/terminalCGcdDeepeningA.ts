import{gcdExercise as e,proof,written,numberAnswer as num}from"./terminalCGcdBuilders";
const pairMethod=String.raw`On pose $a=dr$, $b=ds$, avec $d$ leur PGCD et $\operatorname{PGCD}(r;s)=1$. Le PPCM est alors $drs$.`;
export const gcdDeepeningA=[
e(49,"PGCD de deux expressions",String.raw`Soit $n\in\mathbb N^*$. Déterminer le PGCD dans chaque cas.`,[
written("1.",String.raw`$n^2+n$ et $2n+1$.`,String.raw`Tout diviseur commun divise $4(n^2+n)-(2n+1)^2=-1$. Il est donc égal à1 en valeur absolue. Ainsi $\boxed{\operatorname{PGCD}(n^2+n;2n+1)=1}$.`),
written("2.",String.raw`$5n^2+7n+4$ et $5n+2$.`,String.raw`Posons $A=5n^2+7n+4$, $B=5n+2$. On calcule $5A-(5n+5)B=10$. Le PGCD divise donc10. Mais $B\equiv2\pmod5$, donc5 ne le divise pas. Les seules valeurs possibles sont1 et2.

Si $n$ est pair, $A$ et $B$ sont pairs : le PGCD vaut2. Si $n$ est impair, $B$ est impair : il vaut 1. Les deux cas sont ainsi entièrement déterminés.`)]),
e(50,"Conserver les diviseurs communs",String.raw`Soient $a,b>0$, $x=7a+5b$, $y=4a+3b$.`,[proof(String.raw`Démontrer $\operatorname{PGCD}(x;y)=\operatorname{PGCD}(a;b)$.`,String.raw`Tout diviseur commun de $a,b$ divise $x,y$, qui sont des combinaisons entières. Réciproquement :
$$3x-5y=a,\qquad -4x+7y=b.$$
Tout diviseur commun de $x,y$ divise donc aussi $a,b$. Les ensembles de diviseurs communs sont identiques, donc leurs plus grands éléments sont égaux.`)]),
e(51,"Somme ou produit avec PGCD imposé","Déterminer les couples d’entiers naturels.",[
written("a)","PGCD18 et somme360.",pairMethod+String.raw` Ici $d=18$ et $r+s=20$. Avec $r,s>0$, on a $\operatorname{PGCD}(r;20-r)=\operatorname{PGCD}(r;20)$. Les valeurs de $r$ sont $1,3,7,9,11,13,17,19$.

Les couples sont donc $(18;342),(54;306),(126;234),(162;198)$ et leurs inversés.`),
written("b)","PGCD18 et produit6480.",pairMethod+String.raw` On obtient $rs=6480/18^2=20$. Les facteurs premiers entre eux sont $(1;20),(4;5)$ et leurs inversés. D’où $\boxed{(18;360),(72;90),(90;72),(360;18)}$.`)]),
e(52,"PGCD18 et PPCM540","Déterminer les couples d’entiers positifs (x;y) de PGCD18 et PPCM540.",[proof("Donner tous les couples.",pairMethod+String.raw` Ici $rs=540/18=30$. Les couples de facteurs premiers entre eux sont $(1;30),(2;15),(3;10),(5;6)$ et leurs inversés.

En multipliant par18, on obtient $\boxed{(18;540),(36;270),(54;180),(90;108)}$ et leurs inversés.`)]),
e(53,"Somme du PGCD et du PPCM",String.raw`Déterminer les couples d’entiers positifs $(x;y)$ tels que $\operatorname{PGCD}(x;y)+\operatorname{PPCM}(x;y)=203$.`,[proof("Trouver toutes les possibilités.",pairMethod+String.raw` La relation devient $d(1+rs)=203$. Comme $rs\geq1$, les valeurs possibles de $d$ sont1,7,29.

**d=1 :** $rs=202=2\times101$, donc $(x;y)=(1;202),(2;101)$ et leurs inversés.

**d=7 :** $rs=28=4\times7$, donc $(7;196),(28;49)$ et leurs inversés.

**d=29 :** $rs=6=2\times3$, donc $(29;174),(58;87)$ et leurs inversés.

Ces douze couples sont les solutions ; la valeur $d=203$ donnerait un PPCM nul, impossible pour deux entiers positifs.`)]),
e(54,"Somme1008 et PGCD24",String.raw`Déterminer les couples d’entiers positifs $x\leq y$ de somme1008 et de PGCD24.`,[proof("Chercher tous les couples.",String.raw`Posons $x=24r$, $y=24s$, avec $r,s$ premiers entre eux. Alors $r+s=42$ et $1\leq r\leq21$. La condition devient $\operatorname{PGCD}(r;42)=1$ : $r$ ne doit être divisible ni par 2, ni par 3, ni par 7.

On obtient $r\in\{1,5,11,13,17,19\}$. Les solutions sont donc
$$\boxed{(24;984),(120;888),(264;744),}$$
$$\boxed{(312;696),(408;600),(456;552).}$$`)]),
e(55,"Somme et produit premiers entre eux",String.raw`Soient $a,b\in\mathbb N^*$.`,[
written("1.",String.raw`Si $a,b$ sont premiers entre eux, montrer que $a+b$ et $ab$ le sont.`,String.raw`Supposons qu’un nombre premier $p$ divise $a+b$ et $ab$. Comme $p\mid ab$, il divise $a$ ou $b$. S’il divise $a$, il divise aussi $(a+b)-a=b$ ; l’autre cas est analogue. Cela contredit la coprimalité de $a,b$. Aucun premier ne divise les deux nombres : leur PGCD est1.`),
written("2.","Démontrer la réciproque.",String.raw`Si $a,b$ n’étaient pas premiers entre eux, ils auraient un diviseur premier commun $p$. Alors $p$ diviserait $a+b$ et $ab$, qui ne seraient pas premiers entre eux. Par contraposée, la réciproque est vraie.`)]),
e(56,"Des restes presque égaux aux diviseurs","Déterminer le plus petit entier naturel qui, divisé par 8,15,18 et24, donne respectivement les restes7,14,17 et23.",[num("Minimum","Donner cet entier.",359,String.raw`Pour chaque diviseur $d$, le reste vaut $d-1$. Ainsi $N+1$ est divisible par 8,15,18 et24. Leur PPCM est $2^3 3^2 5=360$. Donc $N=360k-1$. Avec $N\geq0$, le plus petit choix est $k=1$, d’où $\boxed{N=359}$. Chaque reste est bien inférieur au diviseur.`)]),
e(57,"PGCD, somme et PPCM",String.raw`Soient $a,b>0$.`,[
written("1.",String.raw`Montrer que $\operatorname{PGCD}(a;b)=\operatorname{PGCD}(a+b;\operatorname{PPCM}(a;b))$.`,pairMethod+String.raw` On a $a+b=d(r+s)$ et PPCM$=drs$. D’après l’exercice55, $r+s$ et $rs$ sont premiers entre eux. Le PGCD des deux nombres vaut donc $d$, comme celui de $a,b$.`),
written("2.","Déterminer deux entiers positifs de somme68 et de PPCM240.",String.raw`D’après1, leur PGCD est $\operatorname{PGCD}(68;240)=4$. On pose $a=4r$, $b=4s$ : $r+s=17$, $rs=60$. Les entiers $r,s$ sont les racines de $t^2-17t+60=(t-5)(t-12)$. Donc $\boxed{(a;b)=(20;48)\ \text{ou}\ (48;20)}$.`)]),
e(58,"Un diviseur commun et des restes","Les divisions de6355,1705,1271 par le même entier naturel non nul n donnent les restes55,25,11. Déterminer n.",[proof("Donner tous les diviseurs convenables.",String.raw`Le nombre $n$ divise $6355-55=6300$, $1705-25=1680$ et $1271-11=1260$. Leur PGCD vaut420. Il faut aussi $n>55$, pour que tous les restes soient strictement inférieurs à $n$.

Les diviseurs de420 supérieurs à55 sont $\boxed{60,70,84,105,140,210,420}$. Réciproquement, chacun divise les trois différences et dépasse les trois restes, donc convient.`)]),
e(59,"Deux expressions affines",String.raw`Soit $n\in\mathbb N$. Déterminer le PGCD de $6n+4$ et $4n+2$.`,[proof("Calculer le PGCD.",String.raw`On extrait2 :
$$\operatorname{PGCD}(6n+4;4n+2)=2\operatorname{PGCD}(3n+2;2n+1).$$
Or $2(3n+2)-3(2n+1)=1$. Bézout donne un PGCD réduit égal à1, donc le résultat est toujours $\boxed2$.`)]),
e(60,"Discussion modulo17",String.raw`Soit $k\in\mathbb Z$, $a=9k+13$, $b=2k+1$.`,[
written("1.","Montrer que tout diviseur positif commun de a et b divise17.",String.raw`On calcule $2a-9b=18k+26-18k-9=17$. Tout diviseur commun divise cette combinaison entière, donc17.`),
written("2.","Déterminer le PGCD suivant k.",String.raw`Le PGCD vaut 1 ou17. Le nombre17 divise $b=2k+1$ si et seulement si $k\equiv8\pmod{17}$. Pour $k=17t+8$, $a=153t+85$ est aussi multiple de17. Donc $\boxed{d=17\ \text{si}\ k\equiv8\pmod{17},\ d=1\ \text{sinon}}$.`)]),
e(61,"Discussion modulo 5",String.raw`Soit $k\in\mathbb Z$, $a=2k+3$, $b=3k+2$. Déterminer leur PGCD.`,[proof("Discuter suivant k.",String.raw`$3a-2b=5$, donc le PGCD vaut 1 ou5. La condition $5\mid a$ donne $2k\equiv2\pmod5$, soit $k\equiv1\pmod5$. Alors $b$ est aussi divisible par 5. Le PGCD vaut donc $\boxed5$ dans cette classe et $\boxed1$ dans les autres.`)]),
e(62,"Discussion selon la parité",String.raw`Soit $k\in\mathbb Z$, $a=2k+2$, $b=3k+1$. Déterminer leur PGCD.`,[proof("Discuter suivant k.",String.raw`$3a-2b=4$, donc le PGCD est1,2 ou4.

Si $k$ est pair, $b$ est impair : le PGCD vaut 1. Si $k\equiv1\pmod4$, $a$ et $b$ sont divisibles par 4 : il vaut4. Si $k\equiv3\pmod4$, ils sont pairs mais $b\equiv2\pmod4$ : il vaut2.

Ainsi $\boxed{d=1\ (k\text{ pair}),\quad d=4\ (k\equiv1[4]),\quad d=2\ (k\equiv3[4])}$. Ces conclusions couvrent aussi les entiers négatifs.`)]),
e(63,"Un produit modulo 5",String.raw`Résoudre $(x+1)(2x-1)\equiv0\pmod5$.`,[proof("Déterminer les classes solutions.",String.raw`$5$ est premier, donc $x+1\equiv0$ ou $2x-1\equiv0\pmod5$. Cela donne $x\equiv4$ ou $x\equiv3\pmod5$, car l’inverse de2 modulo 5 est3. Ainsi $\boxed{x=4+5k\ \text{ou}\ x=3+5k}$.`)]),
...[
 [64,4,2,9,7,34,36],
 [65,4,3,7,3,3,28],
 [66,9,2,11,3,47,99],
 [67,5,4,8,6,14,40],
].map(([n,m,r,p,s,answer,step])=>e(n,"Système de congruences",
 n===65?String.raw`Résoudre $3x\equiv-3\pmod{12}$, $4x\equiv5\pmod7$.`:
 n===67?String.raw`Résoudre $2x\equiv3\pmod5$, $3x\equiv2\pmod8$.`:
 String.raw`Résoudre $x\equiv${r}\pmod{${m}}$, $x\equiv${s}\pmod{${p}}$.`,
 [proof("Donner toutes les solutions.",(n===65?String.raw`On réduit la première congruence à $x\equiv3\pmod4$. L’inverse de4 modulo7 est2 : la seconde donne $x\equiv3\pmod7$. `:n===67?String.raw`L’inverse de2 modulo 5 est 3 : $x\equiv4\pmod5$. L’inverse de3 modulo8 est 3 : $x\equiv6\pmod8$. `:"")+
 String.raw`Posons $x=${r}+${m}t$. La seconde congruence donne $${m}t\equiv${s-r}\pmod{${p}}$. On vérifie que $t=${(answer-r)/m}$ convient. Les modulos $${m}$ et $${p}$ sont premiers entre eux : toutes les solutions de cette congruence en $t$ s’obtiennent en ajoutant un multiple de $${p}$. Ainsi
$$\boxed{x=${answer}+${step}k,\qquad k\in\mathbb Z}.$$
On vérifie les deux congruences initiales par substitution.`)])),
e(68,"Diviseurs d’une factorielle",String.raw`Déterminer le nombre de diviseurs positifs de $10!$.`,[num("Nombre","Combien de diviseurs positifs ?",270,String.raw`Dans $10!$, l’exposant de2 est $5+2+1=8$, celui de3 vaut $3+1=4$, celui de5 vaut2 et celui de7 vaut 1. Ainsi $10!=2^8 3^4 5^2 7$.
Le nombre de diviseurs positifs est $(8+1)(4+1)(2+1)(1+1)=\boxed{270}$.`)]),
e(69,"Une relation entre deux entiers",String.raw`Pour $n\geq1$, on pose $a=2n^2$, $b=n(2n+1)$, $d=\operatorname{PGCD}(a;b)$, $m=\operatorname{PPCM}(a;b)$.`,[proof(String.raw`Montrer que $b-a=d$ et $b^2-a^2=m-d^2$.`,String.raw`Les entiers $2n$ et $2n+1$ sont consécutifs, donc premiers entre eux. Ainsi $d=n$ et $m=ab/d=2n^2(2n+1)$.

**Première égalité :** $b-a=2n^2+n-2n^2=n=d$.

**Deuxième égalité :** $b^2-a^2=(b-a)(b+a)=n(4n^2+n)=n^2(4n+1)$. D’autre part, $m-d^2=2n^2(2n+1)-n^2=n^2(4n+1)$. Les deux expressions sont égales.`)]),
e(70,"Une suite et des PGCD",String.raw`$u_0=14$ et $u_{n+1}=5u_n-6$ pour $n\in\mathbb N$.`,[
written("1.",String.raw`Montrer que $\operatorname{PGCD}(u_n;u_{n+1})$ divise 6.`,String.raw`La récurrence montre d’abord que tous les termes sont des entiers positifs : $u_0=14$ et $u_{n+1}\geq5\times14-6\geq14$ dès que $u_n\geq14$. Tout diviseur commun de deux termes consécutifs divise $5u_n-u_{n+1}=6$.`),
written("2.a)","Montrer que tous les termes sont pairs.",String.raw`$u_0=14$ est pair. Si $u_n$ est pair, $5u_n-6$ est pair. La propriété est donc vraie pour tout $n$ par récurrence.`),
written("2.b)","Montrer qu’aucun terme n’est multiple de3.",String.raw`Modulo3, $u_{n+1}\equiv2u_n$. Comme $u_0\equiv2$, les restes alternent entre2 et1 : multiplier par 2 échange ces deux restes. Ils ne sont jamais nuls.`),
num("3.",String.raw`En déduire $\operatorname{PGCD}(u_n;u_{n+1})$.`,2,String.raw`Le PGCD divise 6 ; il est pair car les deux termes sont pairs, mais n’est pas divisible par 3. Parmi les diviseurs positifs de6, il ne reste que $\boxed2$.`)]),
];
