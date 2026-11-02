import { divExercise as ex,written as w,short as s } from "./terminalCDivisibilityBuilders";
export const divisibilityFixationA=[
  ex(1,"Ordre et produit",String.raw`$a,b,c,d\in\mathbb N$, $a\le b$ et $c\le d$.`,[
    w("Démonstration",String.raw`Démontrer $ac\le bd$.`,String.raw`Comme $c\ge0$, on multiplie $a\le b$ par $c$ : $ac\le bc$.

Comme $b\ge0$, on multiplie $c\le d$ par $b$ : $bc\le bd$.

Par transitivité, $\boxed{ac\le bd}$. La positivité des facteurs justifie que les inégalités gardent leur sens.`),
  ]),
  ex(2,"Comparer somme et produit",String.raw`$a,b,c$ sont des entiers naturels non nuls et $ab<c$.`,[
    w("Démonstration",String.raw`Démontrer $a+b\le c$.`,String.raw`Les naturels $a-1$ et $b-1$ sont positifs ou nuls. Donc :
$$0\le(a-1)(b-1)=ab-a-b+1.$$
Ainsi $a+b\le ab+1$. Comme $ab$ et $c$ sont entiers, $ab<c$ entraîne $ab+1\le c$. Par conséquent $\boxed{a+b\le c}$. La non-nullité de $a$ et $b$ est utilisée dès la première ligne.`),
  ]),
  ex(3,"Une somme avec des factorielles",String.raw`Pour $n\in\mathbb N^\ast$, on pose $S_n=\sum_{k=1}^n k\,k!$, où $k!=1\times2\times\cdots\times k$.`,[
    w("1.",String.raw`Démontrer par récurrence $S_n=(n+1)!-1$.`,String.raw`**Initialisation.** $S_1=1\times1!=1=2!-1$.

**Hérédité.** Supposons $S_n=(n+1)!-1$ pour un $n\ge1$. Alors :
$$S_{n+1}=S_n+(n+1)(n+1)!$$
$$=(n+1)!-1+(n+1)(n+1)!=(n+2)(n+1)!-1=(n+2)!-1.$$
La propriété est vraie au rang suivant. **Par récurrence**, elle est vraie pour tout $n\ge1$.`),
    w("2.","Donner une démonstration directe.",String.raw`Pour chaque $k\ge1$ :
$$k\,k!=((k+1)-1)k!=(k+1)!-k!.$$
En sommant de $1$ à $n$, les termes intermédiaires s’annulent :
$$S_n=(2!-1!)+(3!-2!)+\cdots+((n+1)!-n!).$$
Il reste $\boxed{S_n=(n+1)!-1}$. C’est une somme télescopique.`),
  ]),
  ex(4,"Une autre somme par récurrence",String.raw`Soit $n\in\mathbb N^\ast$.`,[
    w("Démonstration",String.raw`Démontrer $\sum_{k=1}^n k(k+1)=\frac{n(n+1)(n+2)}3$.`,String.raw`**Initialisation.** Pour $n=1$, les deux membres valent $2$.

**Hérédité.** Supposons la formule vraie au rang $n\ge1$. En ajoutant le terme $(n+1)(n+2)$ :
$$S_{n+1}=\frac{n(n+1)(n+2)}3+(n+1)(n+2).$$
On factorise :
$$S_{n+1}=\frac{(n+1)(n+2)(n+3)}3.$$
C’est bien la formule au rang $n+1$. **Conclusion :** l’égalité est démontrée pour tout $n\ge1$.`),
  ]),
  ...([[5,129,7,18,3],[6,45,80,0,45],[7,59,59,1,0]] as const).map(([n,a,b,q,r])=>
    ex(n,"Quotient et reste","Déterminer le quotient et le reste de la division euclidienne de $"+a+"$ par $"+b+"$.",[
      s("Quotient","Donner le quotient.",String(q),[String(q)],String.raw`On a $`+a+"="+b+String.raw`\times`+q+"+"+r+String.raw`$ et $0\le`+r+"<"+b+String.raw`$. L’égalité et l’encadrement du reste montrent que le quotient est $`+q+"$."),
      s("Reste","Donner le reste.",String(r),[String(r)],String.raw`Une fois le quotient $`+q+String.raw`$ obtenu, on calcule $r=a-bq=`+a+"-"+b+String.raw`\times`+q+"="+r+String.raw`$. Il est bien compris entre $0$ et $`+(b-1)+"$."),
    ])),
  ex(8,"Développer une écriture en base b","Écrire chaque nombre suivant les puissances de sa base.",[
    w("a)",String.raw`$x=4253$ en base $10$.`,String.raw`Les chiffres $4,2,5,3$ occupent les rangs $3,2,1,0$. Ainsi :
$$\boxed{x=4\times10^3+2\times10^2+5\times10+3.}$$
Le dernier terme est $3\times10^0=3$ ; il ne faut pas décaler les exposants.`),
    w("b)",String.raw`$x=\overline{4203}_{\,5}$.`,String.raw`Chaque chiffre est inférieur à $5$, donc l’écriture est admissible. En respectant le zéro au rang $1$ :
$$\boxed{x=4\times5^3+2\times5^2+0\times5+3.}$$
Sa valeur décimale est $500+50+3=553$.`),
    w("c)",String.raw`$x=\overline{BA481}_{\,12}$, avec $A=10$, $B=11$.`,String.raw`Il y a cinq chiffres ; le premier multiplie donc $12^4$. Ainsi :
$$\boxed{x=11\times12^4+10\times12^3+4\times12^2+8\times12+1.}$$
Les lettres $A$ et $B$ désignent des chiffres de valeurs $10$ et $11$, autorisés en base $12$.`),
  ]),
  ex(9,"Vers la base 10","Écrire les nombres suivants dans le système décimal.",[
    s("a)",String.raw`$\overline{7035}_{\,9}$.`,"5135",["5135"],String.raw`On développe :
$$7\times9^3+0\times9^2+3\times9+5=5103+27+5=\boxed{5135}.$$
Le chiffre $0$ conserve sa place mais sa contribution est nulle.`),
    s("b)",String.raw`$\overline{240}_{\,5}$.`,"70",["70"],String.raw`Le premier chiffre est au rang $2$, donc :
$$2\times5^2+4\times5+0=50+20=\boxed{70}.$$
On a bien $70=2(25)+4(5)$ dans le système décimal.`),
    s("c)",String.raw`$\overline{BF3}_{\,16}$.`,"3059",["3059"],String.raw`En base $16$, $B=11$ et $F=15$. Donc :
$$11\times16^2+15\times16+3=2816+240+3=\boxed{3059}.$$
Les lettres sont remplacées par leur valeur avant le calcul.`),
  ]),
  ex(10,"Depuis la base 10","Convertir chaque entier dans la base indiquée.",[
    s("a)",String.raw`$425$ en base $7$.`,String.raw`$\overline{1145}_{\,7}$`,["1145"],String.raw`Les divisions successives donnent :
$$425=7(60)+5,\quad60=7(8)+4,\quad8=7(1)+1,\quad1=7(0)+1.$$
En lisant les restes du dernier au premier, $\boxed{425=\overline{1145}_{\,7}}$.`),
    s("b)",String.raw`$320$ en base $5$.`,String.raw`$\overline{2240}_{\,5}$`,["2240"],String.raw`On divise successivement :
$$320=5(64)+0,\quad64=5(12)+4,\quad12=5(2)+2,\quad2=5(0)+2.$$
Les restes lus à rebours donnent $\boxed{\overline{2240}_{\,5}}$. Vérification : $2(125)+2(25)+4(5)=320$.`),
    s("c)",String.raw`$7054$ en base $12$.`,String.raw`$\overline{40BA}_{\,12}$`,["40BA","40ba"],String.raw`On calcule :
$$7054=12(587)+10,\quad587=12(48)+11,$$
$$48=12(4)+0,\quad4=12(0)+4.$$
Avec $10=A$ et $11=B$, les restes donnent $\boxed{\overline{40BA}_{\,12}}$. Le zéro entre $4$ et $B$ doit être conservé.`),
  ],{correctionFigureKey:"tc-t2-l2-arithmetic"}),
  ex(11,"Changer de base","Convertir les écritures suivantes dans la base demandée.",[
    s("a)",String.raw`$\overline{402}_{\,5}$ en base $3$.`,String.raw`$\overline{10210}_{\,3}$`,["10210"],String.raw`D’abord $\overline{402}_{\,5}=4(25)+2=102$.
$$102=3(34)+0,\quad34=3(11)+1,\quad11=3(3)+2,$$
$$3=3(1)+0,\quad1=3(0)+1.$$
La lecture à rebours donne $\boxed{\overline{10210}_{\,3}}$.`),
    s("b)",String.raw`$\overline{1205}_{\,7}$ en base $4$.`,String.raw`$\overline{12332}_{\,4}$`,["12332"],String.raw`La valeur décimale est $1(343)+2(49)+5=446$.
$$446=4(111)+2,\quad111=4(27)+3,\quad27=4(6)+3,$$
$$6=4(1)+2,\quad1=4(0)+1.$$
Ainsi $\boxed{\overline{1205}_{\,7}=\overline{12332}_{\,4}}$.`),
    s("c)",String.raw`$\overline{1435A}_{\,16}$ en base $12$.`,String.raw`$\overline{3BAA2}_{\,12}$`,["3BAA2","3baa2"],String.raw`La valeur décimale est :
$$16^4+4(16^3)+3(16^2)+5(16)+10=82778.$$
Puis $82778=12(6898)+2$, $6898=12(574)+10$, $574=12(47)+10$, $47=12(3)+11$ et $3=12(0)+3$.

Les restes lus à rebours sont $3,11,10,10,2$, soit $\boxed{\overline{3BAA2}_{\,12}}$.`),
  ],{correctionFigureKey:"tc-t2-l2-arithmetic"}),
];
