import { divExercise as ex,written as w,short as s,tf } from "./terminalCDivisibilityBuilders";
const pairs=([[65,7,9,2],[-87,8,-11,1],[103,-3,-34,1],[-111,9,-13,6],[-45,5,-9,0],[45,-5,-9,0]] as const);
export const divisibilityFixationB=[
  ex(12,"Prendre l’opposé",String.raw`Soit $a\in\mathbb Z$ positif ou nul.`,[
    w("Démonstration","Démontrer que son opposé est négatif ou nul.",String.raw`L’hypothèse s’écrit $0\le a$. En ajoutant $-a$ aux deux membres, on obtient $-a\le0$. Donc l’opposé de $a$ est négatif ou nul. Si $a=0$, son opposé est $0$ : on ne peut pas conclure à une négativité stricte.`),
  ]),
  ex(13,"Additionner deux inégalités",String.raw`$a,b,c,d\in\mathbb Z$, $a\le b$ et $c\le d$.`,[
    w("Démonstration",String.raw`Démontrer $a+c\le b+d$.`,String.raw`L’addition d’un même relatif conserve l’ordre : $a\le b$ donne $a+c\le b+c$, et $c\le d$ donne $b+c\le b+d$.

La transitivité permet d’enchaîner :
$$a+c\le b+c\le b+d.$$
Ainsi $\boxed{a+c\le b+d}$, sans aucune condition de signe sur les quatre relatifs.`),
  ]),
  ex(14,"Six divisions euclidiennes dans ℤ","Pour chaque couple (a ; b), donner le quotient q et le reste r de la division euclidienne de a par b.",pairs.flatMap(([a,b,q,r],i)=>{
    const label=String.fromCharCode(97+i)+")",check="$"+a+"=("+b+")("+q+")+"+r+String.raw`$, avec $0\le`+r+"<"+Math.abs(b)+"$.";
    return[
      s(label+" q","$a="+a+"$, $b="+b+"$. Quotient :",String(q),[String(q)],String.raw`Le reste doit être positif ou nul, même lorsque le dividende est négatif. L’écriture `+check+" Elle donne le quotient $q="+q+"$."),
      s(label+" r","$a="+a+"$, $b="+b+"$. Reste :",String(r),[String(r)],String.raw`On vérifie l’écriture `+check+" Le reste est donc $r="+r+"$. Il est toujours strictement inférieur à la valeur absolue du diviseur."),
    ];
  }),{correctionFigureKey:"tc-t2-l2-arithmetic"}),
  ex(15,"Repérer des diviseurs de 18","Pour chaque nombre proposé, indiquer s’il divise 18.",[
    ...([[1,true,18],[-4,false,0],[5,false,0],[2,true,9],[36,false,0],[-9,true,-2],[18,true,1],[3,true,6],[7,false,0]] as const).map(([d,valid,k])=>
      tf(String(d),"$"+d+String.raw`\mid18$.`,valid,valid?"L’égalité $18=("+d+")("+k+")$ fournit un multiplicateur entier. Ainsi $"+d+"$ est bien un diviseur de $18$.":String.raw`Il n’existe pas d’entier $k$ tel que $18=`+d+String.raw`k$ : le quotient $18/(`+d+String.raw`)$ n’est pas entier. Donc $`+d+"$ ne divise pas $18$.")),
  ]),
  ex(16,"Un diviseur trop grand",String.raw`$a\in\mathbb N^\ast$, $b\in\mathbb Z$ et $|b|>a$.`,[
    w("Démonstration",String.raw`Justifier que $b$ ne divise pas $a$.`,String.raw`Supposons au contraire $b\mid a$. Comme $a\ne0$, le multiplicateur dans $a=bk$ est un entier non nul, donc $|k|\ge1$. Alors :
$$a=|a|=|b||k|\ge|b|,$$
en contradiction avec $|b|>a$. Donc $\boxed{b\nmid a}$. L’hypothèse $a\ne0$ est indispensable, car tout entier non nul divise $0$.`),
  ]),
  ex(17,"Éliminer l’entier n",String.raw`$n\in\mathbb Z$ et $d\in\mathbb N^\ast$ divise $5n+2$ et $3n+1$.`,[
    w("Démonstration",String.raw`Démontrer $d=1$.`,String.raw`Tout diviseur commun divise les combinaisons linéaires entières. Choisissons les coefficients $3$ et $-5$ pour éliminer $n$ :
$$3(5n+2)-5(3n+1)=15n+6-15n-5=1.$$
Donc $d\mid1$. Comme $d>0$, nécessairement $\boxed{d=1}$.`),
  ]),
  ex(18,"Un représentant négatif",String.raw`$a\in\mathbb N$ et $a\equiv-6\pmod8$.`,[
    s("Reste","Donner le reste de la division de a par 8.","2",["2"],String.raw`Le nombre $-6$ n’est pas un reste admissible. Mais $-6=8(-1)+2$, donc $-6\equiv2\pmod8$. Par transitivité, $a\equiv2\pmod8$. Puisque $0\le2<8$, le reste est $\boxed2$.`),
  ]),
  ex(19,"Justifier une congruence",String.raw`On considère les entiers $577$ et $427$.`,[
    w("Justification",String.raw`Justifier $577\equiv427\pmod3$.`,String.raw`Par définition, il suffit de montrer que $577-427$ est divisible par $3$. Or :
$$577-427=150=3\times50.$$
La différence étant un multiple de $3$, $\boxed{577\equiv427\pmod3}$. On peut aussi vérifier que leurs sommes de chiffres, $19$ et $13$, donnent le même reste $1$ modulo $3$.`),
  ]),
  ex(20,"Vrai ou faux : simplifier une congruence",String.raw`$a,b\in\mathbb Z$. Justifier chaque réponse.`,[
    tf("1.",String.raw`Si $ab\equiv0\pmod6$, alors $a\equiv0\pmod6$ ou $b\equiv0\pmod6$.`,false,String.raw`**Faux.** Prendre $a=2$ et $b=3$. Le produit $ab=6$ est divisible par $6$, mais ni $2$ ni $3$ ne l’est. Ce contre-exemple suffit à réfuter l’implication.`),
    tf("2.",String.raw`Si $2a\equiv4\pmod8$, alors $a\equiv2\pmod8$.`,false,String.raw`**Faux.** Pour $a=6$, $2a=12\equiv4\pmod8$, mais $6\not\equiv2\pmod8$ car $6-2=4$ n’est pas divisible par $8$. On ne peut pas diviser par $2$ en gardant automatiquement le même modulo.`),
    tf("3.",String.raw`Si $2a\equiv4\pmod8$, alors $a\equiv2\pmod4$.`,true,String.raw`**Vrai.** L’hypothèse signifie $2a-4=8k$ avec $k\in\mathbb Z$. En divisant cette égalité par $2$, on obtient $a-2=4k$. C’est exactement $a\equiv2\pmod4$.`),
    tf("4.",String.raw`Si $4-a\equiv5\pmod7$, alors $a\equiv6\pmod7$.`,true,String.raw`**Vrai.** En soustrayant $4$, $-a\equiv1\pmod7$. En multipliant par $-1$, $a\equiv-1\equiv6\pmod7$. Les opérations utilisées conservent la congruence.`),
  ]),
  ex(21,"Reste d’un entier",String.raw`On divise $5219$ par $7$.`,[
    s("Reste","Déterminer le reste.","4",["4"],String.raw`On trouve $7\times745=5215$. Donc :
$$5219=7\times745+4,\qquad0\le4<7.$$
Cette égalité est la division euclidienne, et son reste est $\boxed4$.`),
  ]),
  ex(22,"Une puissance modulo 11",String.raw`On considère $67^{89}-1$.`,[
    w("Démonstration",String.raw`Démontrer que $67^{89}-1$ est divisible par $11$.`,String.raw`On a $67=11\times6+1$, donc $67\equiv1\pmod{11}$. La compatibilité avec les puissances donne :
$$67^{89}\equiv1^{89}=1\pmod{11}.$$
En soustrayant $1$, $67^{89}-1\equiv0\pmod{11}$. L’entier est donc divisible par $11$, sans calculer la grande puissance.`),
  ]),
  ex(23,"Utiliser les critères de divisibilité","Justifier les trois affirmations.",[
    w("a)",String.raw`$2024$ n’est pas divisible par $24$.`,String.raw`On calcule $24\times84=2016$, donc $2024=24\times84+8$. Le reste $8$ est non nul et inférieur à $24$. Ainsi $\boxed{24\nmid2024}$. On peut également remarquer que la somme des chiffres vaut $8$, donc $2024$ n’est pas divisible par $3$, alors que $24$ l’est.`),
    w("b)",String.raw`$2025$ est divisible par $25$.`,String.raw`Les deux derniers chiffres sont $25$, ce qui satisfait le critère de divisibilité par $25$. On vérifie aussi $2025=25\times81$. Donc $\boxed{25\mid2025}$.`),
    w("c)",String.raw`$23761$ n’est pas divisible par $3$.`,String.raw`La somme des chiffres vaut $2+3+7+6+1=19$. Or $19=3\times6+1$ n’est pas divisible par $3$. Le critère donne donc $\boxed{3\nmid23761}$.`),
  ]),
  ex(24,"Un nombre premier",String.raw`On considère l’entier $103$.`,[
    w("Justification","Justifier que 103 est premier.",String.raw`Comme $10^2<103<11^2$, seuls les premiers $2,3,5,7$ doivent être testés.

$103$ est impair ; sa somme de chiffres est $4$ ; son dernier chiffre n’est ni $0$ ni $5$. Il n’est donc divisible ni par $2$, ni par $3$, ni par $5$. Enfin $103=7\times14+5$.

Aucun premier inférieur ou égal à $\sqrt{103}$ ne le divise. Donc $\boxed{103\text{ est premier}}$.`),
  ],{correctionFigureKey:"tc-t2-l2-arithmetic"}),
  ex(25,"Un nombre composé",String.raw`On considère l’entier $221$.`,[
    w("Démonstration","Démontrer que 221 n’est pas premier.",String.raw`On peut chercher un diviseur parmi les premiers inférieurs à $\sqrt{221}<15$. On trouve :
$$221=13\times17.$$
Les facteurs $13$ et $17$ sont strictement compris entre $1$ et $221$. Ainsi $221$ possède un diviseur propre et $\boxed{221\text{ n’est pas premier}}$.`),
  ]),
  ex(26,"Facteurs premiers","Décomposer chaque entier en produit de facteurs premiers.",[
    w("a)",String.raw`$32$.`,String.raw`On divise cinq fois par $2$ : $32\to16\to8\to4\to2\to1$. Tous les facteurs sont premiers, donc $\boxed{32=2^5}$. La puissance $2^5$ vaut bien $32$.`),
    w("b)",String.raw`$72$.`,String.raw`Les divisions donnent $72=2\times36=2^2\times18=2^3\times9$. Or $9=3^2$. Donc $\boxed{72=2^3\times3^2}$, avec les premiers $2$ et $3$.`),
    w("c)",String.raw`$4752$.`,String.raw`On divise quatre fois par $2$ :
$$4752\to2376\to1188\to594\to297.$$
Ensuite $297=3\times99=3^2\times33=3^3\times11$, et $11$ est premier. Donc :
$$\boxed{4752=2^4\times3^3\times11.}$$
Vérification : $16\times27\times11=4752$.`),
  ]),
];
