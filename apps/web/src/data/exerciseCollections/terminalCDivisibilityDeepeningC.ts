import { divExercise as ex,written as w,short as s } from "./terminalCDivisibilityBuilders";
export const divisibilityDeepeningC=[
  ex(53,"Les deux derniers chiffres d’une suite",String.raw`$u_0=14$ et, pour tout $n\in\mathbb N$, $u_{n+1}=5u_n-6$.`,[
    ...([64,314,1564,7814,39064] as const).map((v,i)=>s("1. u"+(i+1),"$u_{"+(i+1)+"}$ :",String(v),[String(v)],"On applique la relation au terme précédent : $u_{"+(i+1)+"}=5"+String.raw`\times`+([14,64,314,1564,7814][i])+"-6="+v+"$. Le calcul est fait à partir de la valeur déjà obtenue, en commençant par $u_0=14$.")),
    w("2.","Que constate-t-on pour les deux derniers chiffres ?",String.raw`Les termes calculés se terminent successivement par $14,64,14,64,14,64$ à partir de $u_0$.

On peut conjecturer : les indices pairs donnent la terminaison $14$ et les indices impairs la terminaison $64$. Ces premiers calculs ne prouvent pas encore cette alternance pour tous les rangs ; les questions suivantes vont la justifier.`),
    w("3.a)",String.raw`Démontrer $u_{n+2}\equiv u_n\pmod4$.`,String.raw`En appliquant deux fois la relation :
$$u_{n+2}=5(5u_n-6)-6=25u_n-36.$$
Donc $u_{n+2}-u_n=24u_n-36=4(6u_n-9)$ est divisible par $4$. Ainsi $\boxed{u_{n+2}\equiv u_n\pmod4}$.`),
    w("3.b)",String.raw`Démontrer $u_{2k}\equiv2\pmod4$ et $u_{2k+1}\equiv0\pmod4$ pour tout $k\in\mathbb N$.`,String.raw`On a $u_0=14\equiv2\pmod4$ et $u_1=64\equiv0\pmod4$.

La relation $u_{n+2}\equiv u_n\pmod4$ conserve le reste lorsqu’on avance de deux rangs. Par récurrence sur $k$, les termes d’indice pair ont donc le reste de $u_0$, soit $2$, et ceux d’indice impair celui de $u_1$, soit $0$.`),
    w("3.c)",String.raw`Démontrer par récurrence $2u_n=5^{n+2}+3$.`,String.raw`**Initialisation.** $2u_0=28=5^2+3$.

**Hérédité.** Si $2u_n=5^{n+2}+3$, alors :
$$2u_{n+1}=5(2u_n)-12=5(5^{n+2}+3)-12=5^{n+3}+3.$$
C’est la formule au rang suivant. **Par récurrence**, $\boxed{2u_n=5^{n+2}+3}$ pour tout $n\ge0$.`),
    w("4.a)",String.raw`Démontrer $5^{n+2}\equiv25\pmod{100}$.`,String.raw`On a $5^2=25$ et $25\times5=125\equiv25\pmod{100}$. Ainsi, dès qu’une puissance est congrue à $25$, la suivante l’est encore.

En initialisant à l’exposant $2$, une récurrence donne $5^{n+2}\equiv25\pmod{100}$ pour tout $n\in\mathbb N$.`),
    w("4.b)",String.raw`En déduire $2u_n\equiv28\pmod{100}$.`,String.raw`D’après $2u_n=5^{n+2}+3$ et la question précédente :
$$2u_n\equiv25+3=28\pmod{100}.$$
On en déduit $u_n\equiv14\pmod{50}$, et non automatiquement modulo $100$ : on divise le facteur et le modulo par $2$.`),
    w("5.","Confirmer les terminaisons conjecturées.",String.raw`La congruence $u_n\equiv14\pmod{50}$ laisse deux restes possibles modulo $100$ : $14$ et $64$.

Or $14\equiv2\pmod4$ et $64\equiv0\pmod4$. La question 3.b impose donc :

- si $n$ est pair, $u_n$ se termine par **14** ;
- si $n$ est impair, $u_n$ se termine par **64**.

Cette fois, les deux congruences démontrent l’alternance pour tous les rangs, et pas seulement pour les termes calculés.`),
  ]),
  ex(54,"Les rep-units",String.raw`Pour $k\ge1$, $N_k$ est l’entier décimal formé de $k$ chiffres $1$ : $N_1=1$, $N_2=11$, etc.`,[
    w("1.","Citer deux nombres premiers inférieurs à 10 qui ne divisent jamais un rep-unit.",String.raw`Les nombres $\boxed2$ et $\boxed5$ conviennent. Tout $N_k$ se termine par $1$ : il n’est donc ni pair, ni terminé par $0$ ou $5$. Les critères de divisibilité montrent que ni $2$ ni $5$ n’apparaît dans sa décomposition en facteurs premiers. Pour $N_1=1$, aucun facteur premier n’apparaît.`),
    w("2.",String.raw`À quelle condition $3$ divise-t-il $N_k$ ?`,String.raw`La somme des $k$ chiffres de $N_k$ vaut $k$. Le critère de divisibilité par $3$ donne :
$$\boxed{3\mid N_k\iff3\mid k.}$$
Ainsi $3$ apparaît dans la décomposition en facteurs premiers exactement lorsque la longueur du rep-unit est un multiple de $3$.`),
    w("3.a)",String.raw`Écrire $N_k$ à l’aide des puissances de $10$.`,String.raw`Le chiffre de chaque rang, de $0$ à $k-1$, est $1$. Donc :
$$\boxed{N_k=1+10+10^2+\cdots+10^{k-1}=\sum_{j=0}^{k-1}10^j.}$$
Il y a bien $k$ termes, et la plus grande puissance est $10^{k-1}$, non $10^k$.`),
    w("3.b)",String.raw`En déduire $9N_k=10^k-1$.`,String.raw`En multipliant la somme par $10$, on décale tous les termes :
$$10N_k=10+10^2+\cdots+10^k.$$
Soustrayons $N_k=1+10+\cdots+10^{k-1}$. Tous les termes intermédiaires s’annulent, et $10N_k-N_k=10^k-1$. Donc $\boxed{9N_k=10^k-1}$.`),
    w("4.a)",String.raw`Pour $n\ge1$, démontrer $10^n\equiv1\pmod7\iff6\mid n$.`,String.raw`Comme $10\equiv3\pmod7$, les restes des puissances d’exposants $0$ à $6$ sont :
$$1,\ 3,\ 2,\ 6,\ 4,\ 5,\ 1.$$
Écrivons $n=6q+r$, $0\le r<6$. Alors $10^n\equiv10^r\pmod7$. Parmi les six premiers restes, seul celui de $r=0$ vaut $1$.

Ainsi $10^n\equiv1\pmod7$ si et seulement si $r=0$, c’est-à-dire si et seulement si $6\mid n$.`),
    w("4.b)",String.raw`En déduire que $7\mid N_k$ entraîne $6\mid k$.`,String.raw`Si $7\mid N_k$, alors $7\mid9N_k$. Or $9N_k=10^k-1$. Donc $10^k\equiv1\pmod7$.

La question précédente donne aussitôt $\boxed{6\mid k}$. Il est important d’utiliser la période exacte $6$, établie par le tableau des restes.`),
  ]),
  ex(55,"Nombres premiers jumeaux",String.raw`Un couple $(n,m)$ de nombres premiers est dit jumeau lorsque $m=n+2$. Pour les questions a), b), c), on suppose $n>3$.`,[
    w("Exemples","Citer quatre couples de nombres premiers jumeaux.",String.raw`On peut citer $\boxed{(3;5),(5;7),(11;13),(17;19)}$. Dans chaque couple, les deux entiers sont premiers et leur différence vaut $2$. Le couple $(3;5)$ est autorisé ici ; la restriction $n>3$ concerne seulement la suite de l’exercice.`),
    w("a)",String.raw`Si $(n,n+2)$ est un couple jumeau, démontrer $n\equiv2\pmod3$.`,String.raw`Puisque $n>3$ est premier, il n’est pas divisible par $3$, donc $n\not\equiv0\pmod3$. Si $n\equiv1\pmod3$, alors $n+2\equiv0\pmod3$ ; or $n+2>3$ est aussi premier : impossible.

Il ne reste que $\boxed{n\equiv2\pmod3}$.`),
    w("b)",String.raw`En déduire que $n+4$ n’est pas premier.`,String.raw`La question a) donne $n+4\equiv2+4=6\equiv0\pmod3$. De plus, $n+4>7>3$.

Le nombre $n+4$ possède donc le diviseur propre $3$ : il n’est pas premier. La condition $n>3$ évite notamment le cas du triplet $3,5,7$.`),
    w("c)",String.raw`Démontrer que $(n,n+2)$ est un couple de premiers jumeaux si et seulement si $n^2+2n$ a exactement quatre diviseurs positifs.`,String.raw`On a $n^2+2n=n(n+2)$.

**Sens direct.** Si $n$ et $n+2$ sont deux premiers distincts, les diviseurs positifs de leur produit sont exactement $1,n,n+2,n(n+2)$ : il y en a quatre.

**Réciproque.** Ces quatre nombres sont déjà des diviseurs distincts pour $n>3$. Si $n$ était composé, un diviseur $d$ tel que $1<d<n$ fournirait un cinquième diviseur du produit. Donc $n$ est premier.

Si $n+2$ était composé, il posséderait un diviseur $e$ avec $1<e<n+2$. Celui-ci ne pourrait être égal à $n$, car $n\mid n+2$ entraînerait $n\mid2$, impossible pour $n>3$. Il fournirait encore un cinquième diviseur. Donc $n+2$ est premier. L’équivalence est démontrée.`),
  ]),
  ex(56,"Factoriser avant de tester",String.raw`Soit $n\in\mathbb N$, $n\ge4$.`,[
    w("Démonstration",String.raw`Démontrer que $n^2+n-6$ n’est pas premier.`,String.raw`On factorise :
$$n^2+n-6=(n+3)(n-2).$$
Pour $n\ge4$, $n-2\ge2$ et $n+3\ge7$. Les deux facteurs sont donc strictement supérieurs à $1$. Leur produit est un entier composé, et $\boxed{n^2+n-6\text{ n’est pas premier}}$.`),
  ]),
  ex(57,"Une identité remarquable",String.raw`Soit $n\in\mathbb N$.`,[
    w("Démonstration",String.raw`Démontrer que $n^4+64$ n’est pas premier.`,String.raw`Ajoutons puis retranchons $16n^2$ :
$$n^4+64=(n^2+8)^2-(4n)^2.$$
C’est une différence de carrés :
$$\boxed{n^4+64=(n^2-4n+8)(n^2+4n+8).}$$
Le premier facteur vaut $(n-2)^2+4\ge4$ ; le second vaut $(n+2)^2+4\ge8$. Les deux sont entiers et supérieurs à $1$. Leur produit n’est donc pas premier, y compris pour $n=0$.`),
  ]),
  ex(58,"Une infinité de premiers congrus à 3",String.raw`Soit $X$ l’ensemble des nombres premiers de la forme $4k+3$, avec $k\in\mathbb N$.`,[
    w("1.",String.raw`Démontrer que $X$ est non vide.`,String.raw`Le nombre $3$ est premier et s’écrit $3=4\times0+3$. Donc $3\in X$ et $\boxed{X\ne\varnothing}$. Cet exemple suffit à prouver la non-vacuité.`),
    w("2.",String.raw`Démontrer que le produit de deux entiers congrus à $3$ modulo $4$ est congru à $1$ modulo $4$.`,String.raw`Si $a=4u+3$ et $b=4v+3$, alors :
$$ab=16uv+12u+12v+9=4(4uv+3u+3v+2)+1.$$
Donc $\boxed{ab\equiv1\pmod4}$. En particulier, un produit d’un nombre pair de facteurs congrus à $3$ vaut $1$ modulo $4$, tandis qu’un nombre impair de tels facteurs donne $3$.`),
    w("3.",String.raw`Supposons $X=\{p_1,\ldots,p_s\}$ fini et posons $A=4p_1\cdots p_s-1$. Démontrer que $A$ a un diviseur premier congru à $3$ modulo $4$.`,String.raw`Le nombre $A>1$ est impair et $A\equiv3\pmod4$. Ses facteurs premiers sont impairs, donc chacun est congru à $1$ ou à $3$ modulo $4$.

Si aucun n’était congru à $3$, tous seraient congrus à $1$, et leur produit aussi. On aurait $A\equiv1\pmod4$, contradiction.

Ainsi $A$ possède au moins un diviseur premier $q\equiv3\pmod4$, donc $q\in X$.`),
    w("4.",String.raw`En déduire que $X$ est infini.`,String.raw`D’après la question précédente, un premier $q\in X$ divise $A$. Puisque $X$ est supposé égal à $\{p_1,\ldots,p_s\}$, ce $q$ divise aussi $P=p_1\cdots p_s$.

Il divise donc $4P-A=1$, impossible pour un nombre premier. L’hypothèse de finitude conduit à une contradiction. Donc $\boxed{X\text{ est infini}}$.`),
  ]),
];
