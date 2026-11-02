import{gcdExercise as e,proof,written,numberAnswer as num}from"./terminalCGcdBuilders";
export const gcdDeepeningB=[
e(71,"La fête de promotion","Un groupe de garçons et de filles a dépensé 100 000 000FCFA pour une fête de promotion. Chaque garçon a payé 19 000FCFA et chaque fille 13 000FCFA. Déterminer les nombres possibles de garçons et de filles.",[proof("Modéliser puis déterminer tous les effectifs possibles.",String.raw`Notons $g$ le nombre de garçons et $f$ celui de filles. En divisant la dépense par 1000 :
$$19g+13f=100000.$$
Modulo13, $6g\equiv4$, donc $g\equiv5\pmod{13}$. Posons $g=5+13k$. Alors
$$f=\frac{100000-19(5+13k)}{13}=7685-19k.$$
Les effectifs doivent être positifs : $g>0$ impose $k\geq0$ et $f>0$ impose $k\leq404$. Réciproquement, ces valeurs conviennent.
$$\boxed{(g;f)=(5+13k;7685-19k),\quad k=0,1,\ldots,404.}$$
Le problème admet donc 405 répartitions, pas un effectif unique.`)]),
e(72,"Le banquet","Un banquet rassemble 41 personnes : des hommes, des femmes et des enfants. La dépense totale est 3 600 000FCFA. Un homme a payé 360 000FCFA, une femme 270 000FCFA, un enfant 30 000FCFA. Déterminer les trois effectifs.",[proof("Trouver les effectifs et vérifier.",String.raw`Notons $h,f,e$ les trois effectifs. Les conditions donnent $h+f+e=41$ et, après division par 30000, $12h+9f+e=120$.

On soustrait : $11h+8f=79$. Modulo8, $3h\equiv7$, donc $h\equiv5\pmod8$. Posons $h=5+8k$. Alors $f=3-11k$. La positivité de $h$ impose $k\geq0$ et celle de $f$ impose $k\leq0$ : $k=0$.

Donc $\boxed{h=5,\ f=3,\ e=33}$. Vérification : $5+3+33=41$ et $5(360000)+3(270000)+33(30000)=3600000$.`)]),
e(73,"La pile de livres","Quand je range mes livres par 10, il en reste 3 ; par 17, il en reste 2.",[
written("1.","Déterminer tous les nombres possibles de livres.",String.raw`Le nombre $N$ vérifie $N\equiv3\pmod{10}$ et $N\equiv2\pmod{17}$. Posons $N=10t+3$. Alors $10t\equiv-1\equiv16\pmod{17}$. L’inverse de10 est12, car $120\equiv1$ ; donc $t\equiv5\pmod{17}$.

On obtient $\boxed{N=53+170k,\ k\in\mathbb N}$. Les valeurs négatives de $k$ donneraient un nombre de livres négatif.`),
num("2.","Quel est le nombre minimal de livres ?",53,String.raw`La famille commence à $k=0$, donc $\boxed{53}$ livres. On vérifie $53=5\times10+3=3\times17+2$.`)]),
e(74,"Le phare","Un phare émet un signal jaune toutes les 15 secondes et un signal rouge toutes les 28 secondes. Le jaune est aperçu2 secondes après minuit et le rouge8 secondes après minuit. Déterminer le premier instant où ils sont émis ensemble.",[proof("Déterminer l’heure exacte.",String.raw`Notons $t$ le nombre de secondes écoulées depuis minuit. Alors $t=2+15u=8+28v$, avec $u,v\geq0$. Modulo28, $15u\equiv6$. Comme $15^2\equiv1\pmod{28}$, on obtient $u\equiv90\equiv6\pmod{28}$.

Ainsi $t=92+420k$. Le premier instant positif est $\boxed{92\ \text{ secondes après minuit, soit }00\text{ h }01\text{ min }32\text{ s}}$. Vérification : $92-2=6\times15$ et $92-8=3\times28$.`)],true),
e(75,"Le cuisinier chinois","Dix-sept pirates ont un butin de pièces d’or de même valeur. Un partage égal entre eux laisserait3 pièces au cuisinier. Après la mort de6 pirates, il en resterait4 au cuisinier. Plus tard, un naufrage laisse6 pirates et le cuisinier : il en resterait alors5. Le cuisinier envisage de garder tout le butin. Déterminer le nombre minimal de pièces compatible avec les trois partages.",[num("Minimum","Nombre minimal de pièces d’or.",785,String.raw`Le récit donne $N\equiv3\pmod{17}$, $N\equiv4\pmod{11}$ et $N\equiv5\pmod6$.

**1. Deux premières conditions.** Posons $N=17u+3$. Modulo11, $6u\equiv1$, donc $u\equiv2\pmod{11}$. Ainsi $N=37+187v$.

**2. Troisième condition.** Modulo6 : $1+v\equiv5$, donc $v\equiv4\pmod6$. On obtient $N=785+1122k$.

**3. Minimum.** La plus petite valeur naturelle est $\boxed{785}$, car la précédente serait négative. On vérifie $785=17\times46+3=11\times71+4=6\times130+5$. Le récit est un problème arithmétique fictif ; le calcul porte uniquement sur les partages.`)]),
e(76,"Le petit théorème de Fermat",String.raw`Soit $p$ un nombre premier. On note $\binom pk$ le coefficient binomial. `,[
written("1.",String.raw`Montrer que $p\mid\binom pk$ pour $1\leq k\leq p-1$.`,String.raw`L’identité $k\binom pk=p\binom{p-1}{k-1}$ montre que $p$ divise $k\binom pk$. Or $1\leq k<p$ et $p$ est premier, donc $p$ et $k$ sont premiers entre eux. Gauss donne $\boxed{p\mid\binom pk}$.`),
written("2.a)",String.raw`Montrer que $a^p\equiv a\pmod p$ pour tout $a\in\mathbb Z$.`,String.raw`Par le binôme et la question 1, $(a+1)^p\equiv a^p+1\pmod p$. En partant de $0^p\equiv0$, une récurrence donne $a^p\equiv a$ pour tous les naturels.

Pour $a<0$, prendre son reste $r\in\{0,\ldots,p-1\}$ : $a\equiv r$ implique $a^p\equiv r^p\equiv r\equiv a\pmod p$.`),
written("2.b)",String.raw`Si $p\nmid a$, déduire $a^{p-1}\equiv1\pmod p$.`,String.raw`De $a^p\equiv a$, on déduit $a\cdot a^{p-1}\equiv a\cdot1$. Comme $a$ est premier avec $p$, on simplifie ce facteur : $\boxed{a^{p-1}\equiv1\pmod p}$.`),
written("3.a)",String.raw`Montrer que $a^{13}-a$ est divisible par 26 pour tout $a\in\mathbb Z$.`,String.raw`Fermat avec $p=13$ donne la divisibilité par13. Le nombre $a^{13}$ a la même parité que $a$, donc leur différence est paire. Les entiers2 et13 sont premiers entre eux : le produit 26 divise la différence.`),
written("3.b)",String.raw`Montrer que $3^{6n}-1$ est divisible par 7 pour tout $n\in\mathbb N$.`,String.raw`Fermat donne $3^6\equiv1\pmod7$. Donc $3^{6n}=(3^6)^n\equiv1^n=1\pmod7$, y compris pour $n=0$.`),
written("3.c)",String.raw`Montrer que $n^5-n$ est divisible par 30 pour tout $n\in\mathbb Z$.`,String.raw`Fermat donne la divisibilité par 5. Modulo3, on teste les restes $0,1,-1$, qui vérifient tous $r^5-r\equiv0$. La différence est aussi paire. Comme2,3,5 sont deux à deux premiers entre eux, leur produit30 divise $n^5-n$.`),
]),
e(77,"Nombres de Mersenne et nombres brésiliens",String.raw`Pour $n\geq2$, on pose $M_n=2^n-1$. Un entier $N\geq3$ est dit brésilien s’il possède, dans une base $b$ telle que $2\leq b\leq N-1$, une écriture dont tous les chiffres sont égaux.`,[
written("1.a)",String.raw`Montrer que si $M_n$ est premier, alors $n$ est premier.`,String.raw`Raisonnons par contraposée. Si $n=rs$, avec $r,s\geq2$, alors
$$2^{rs}-1=(2^r-1)(1+2^r+\cdots+2^{r(s-1)}).$$
Les deux facteurs sont strictement supérieurs à 1 ; $M_n$ n’est donc pas premier.`),
written("1.b)",String.raw`Vérifier $2^{11}=89\times23+1$.`,String.raw`$89\times23=2047$ et $2^{11}=2048$. L’identité est exacte, donc $M_{11}=89\times23$.`),
written("1.c)","En déduire que la réciproque de1.a est fausse.",String.raw`Le nombre11 est premier, mais $M_{11}=2047$ est composé d’après1.b. La primalité de l’exposant ne suffit donc pas.`),
written("2.",String.raw`Si $p,s\geq2$ et $M_s\equiv0\pmod p$, montrer que le plus petit entier $m\geq1$ tel que $M_m\equiv0\pmod p$ divise $s$.`,String.raw`On effectue la division $s=qm+r$, $0\leq r<m$. Comme $2^m\equiv1\pmod p$, on a $2^s\equiv(2^m)^q2^r\equiv2^r$. Or $2^s\equiv1$, donc $2^r\equiv1$. Si $r>0$, cela contredit la minimalité de $m$. Ainsi $r=0$, d’où $\boxed{m\mid s}$. Le modulo $p$ est nécessairement impair puisque $2^s-1$ est impair.`),
written("3.a)",String.raw`Soit $q>2$ premier. Si $p>2$ est un diviseur premier de $M_q$, montrer que $q$ est le plus petit exposant positif donnant $2^q\equiv1\pmod p$.`,String.raw`D’après2, le plus petit exposant $m$ divise $q$. Puisque $q$ est premier, $m=1$ ou $m=q$. Le cas $m=1$ donnerait $p\mid2-1=1$, impossible. Donc $m=q$.`),
written("3.b)",String.raw`En déduire $p=2kq+1$ pour un entier $k\geq1$.`,String.raw`Fermat donne $2^{p-1}\equiv1\pmod p$. D’après2 et3.a, $q\mid p-1$. Comme $p-1$ est pair et $q$ impair, $2q\mid p-1$, donc $p=2kq+1$, avec $k\geq1$.`),
written("4.a)","Écrire171 en base7 et26 en base3.",String.raw`$171=3\times7^2+3\times7+3$, donc $\boxed{171=\overline{333}_7}$. De même $26=2\times3^2+2\times3+2$, donc $\boxed{26=\overline{222}_3}$.`),
written("4.b)","Donner deux exemples de nombres brésiliens.",String.raw`Les deux nombres précédents conviennent :171 s’écrit333 en base7, et26 s’écrit222 en base3. Les chiffres sont bien inférieurs à leur base et les bases appartiennent aux intervalles exigés.`),
written("4.c)",String.raw`Montrer que tous les $M_n$, pour $n\geq3$, sont brésiliens.`,String.raw`$M_n=1+2+\cdots+2^{n-1}$ : son écriture en base2 est constituée de $n$ chiffres1. Pour $n\geq3$, $M_n\geq7$ et $2\leq M_n-1$, donc cette base est autorisée. Il est donc brésilien.`),
]),
e(78,"Les nombres parfaits",String.raw`Pour un entier $n\geq1$, $\sigma(n)$ désigne la somme de ses diviseurs positifs. On dit que $n$ est parfait si $\sigma(n)=2n$.`,[
written("1.","Les nombres6,28 et32 sont-ils parfaits ?",String.raw`**6 :** $1+2+3+6=12=2\times6$, donc il est parfait.

**28 :** $1+2+4+7+14+28=56=2\times28$, donc il est parfait.

**32 :** $1+2+4+8+16+32=63\ne64$, donc il ne l’est pas.`),
written("2.a)",String.raw`Pour $n\geq2$, montrer que $\sigma(n)\geq n+1$.`,String.raw`Les diviseurs positifs1 et $n$ sont distincts et appartiennent à la somme. Les autres termes éventuels sont positifs ; donc $\sigma(n)\geq1+n$.`),
written("2.b)",String.raw`Montrer que $n$ est premier si et seulement si $\sigma(n)=n+1$.`,String.raw`Si $n$ est premier, ses seuls diviseurs positifs sont1 et $n$. Réciproquement, un diviseur supplémentaire ajouterait un terme strictement positif à $1+n$ ; l’égalité l’exclut. Donc $n$ est premier.`),
written("3.a)",String.raw`Soient $a,b>0$ premiers entre eux, de décompositions $a=\prod p_i^{\alpha_i}$, $b=\prod q_j^{\beta_j}$. Montrer que $p_i\ne q_j$.`,String.raw`Une égalité $p_i=q_j$ donnerait un nombre premier divisant simultanément $a$ et $b$, contrairement à leur coprimalité.`),
written("3.b)","Décrire les diviseurs positifs de a, b et ab.",String.raw`Les diviseurs de $a$ sont les $\prod p_i^{u_i}$, avec $0\leq u_i\leq\alpha_i$ ; ceux de $b$ sont les $\prod q_j^{v_j}$, avec $0\leq v_j\leq\beta_j$. Comme les listes de premiers sont disjointes, un diviseur de $ab$ s’écrit de façon unique comme le produit de ces deux formes.`),
written("3.c)",String.raw`Montrer que l’application $D_a\times D_b\to D_{ab}$, $(u;v)\mapsto uv$, est bijective, où les $D$ sont ici les ensembles de diviseurs positifs.`,String.raw`**Surjectivité :** dans tout diviseur de $ab$, regrouper les facteurs premiers provenant de $a$ dans $u$ et ceux provenant de $b$ dans $v$.

**Injectivité :** si $uv=u'v'$, l’unicité de la décomposition en facteurs premiers impose les mêmes exposants sur la liste des $p_i$ puis des $q_j$. Ainsi $u=u'$ et $v=v'$.`),
written("3.d)",String.raw`En déduire $\sigma(ab)=\sigma(a)\sigma(b)$.`,String.raw`La bijection précédente permet d’énumérer chaque diviseur de $ab$ exactement une fois :
$$\sigma(ab)=\sum_{u\mid a,\ u>0}\sum_{v\mid b,\ v>0}uv
=\left(\sum_{u\mid a,\ u>0}u\right)\left(\sum_{v\mid b,\ v>0}v\right).$$
La distributivité donne donc l’égalité voulue.`),
written("3.e)",String.raw`Si $p$ est premier et $2^p-1$ est premier, montrer que $E_p=2^{p-1}(2^p-1)$ est parfait.`,String.raw`Les facteurs $2^{p-1}$ et $2^p-1$ sont premiers entre eux. Par3.d :
$$\sigma(E_p)=(1+2+\cdots+2^{p-1})(1+(2^p-1))$$
$$=(2^p-1)2^p=2E_p.$$
Le nombre $E_p$ est donc parfait.`),
]),
];
