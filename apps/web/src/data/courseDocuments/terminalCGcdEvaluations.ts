import type {CourseEvaluationGroup} from "../../domain/courseDocument";
import{ex,diophantineSolution}from"./gcdWriting";
export const gcdEvaluations:CourseEvaluationGroup[]=[
 {id:"gcd-evaluation-pairs",title:"Déterminer deux entiers à partir de leur PGCD et de leur PPCM",pages:[173],
 method:String.raw`Poser $a=dr$, $b=ds$, avec $d=\operatorname{PGCD}(a;b)$ et $\operatorname{PGCD}(r;s)=1$. Le PPCM vaut $drs$. Traduire les données, chercher les diviseurs possibles de $d$, puis les couples de facteurs $r,s$. Revenir à $a,b$ et vérifier toutes les conditions, sans oublier les couples obtenus en échangeant les deux entiers.`,
 examples:[ex("gcd-evaluation-pair-model","Une relation entre PGCD et PPCM",String.raw`Déterminer les couples d’entiers positifs $(a;b)$ tels que $m+11d=203$, où $m$ est leur PPCM et $d$ leur PGCD.`,
 String.raw`**1. Réduire par le PGCD.** Posons $a=dr$, $b=ds$, avec $\operatorname{PGCD}(r;s)=1$. Alors $m=drs$, d’où
$$d(rs+11)=203=7\times29.$$
Le nombre $d$ divise $203$. Comme $rs\geq1$, on a $203/d\geq12$. Parmi $1,7,29,203$, seules les valeurs $d=1$ et $d=7$ conviennent.

**2. Étudier $d=1$.** Il faut $rs=192=2^6\times3$. Puisque $r,s$ sont premiers entre eux, chaque puissance première doit être entièrement dans l’un des facteurs. Les couples sont $(1;192),(192;1),(3;64),(64;3)$.

**3. Étudier $d=7$.** On a $rs=18=2\times3^2$. Les couples réduits sont $(1;18),(18;1),(2;9),(9;2)$. On multiplie par $7$.

**4. Conclure.** Les huit couples sont :
$$\boxed{(1;192),(192;1),(3;64),(64;3),}$$
$$\boxed{(7;126),(126;7),(14;63),(63;14).}$$
Chaque couple a bien le PGCD annoncé et vérifie $m+11d=203$.`)],
 questions:[],writtenTasks:[{id:"gcd-evaluation-pair-task",topicId:"gcd-lcm-relation",prompt:String.raw`Déterminer les couples d’entiers positifs $(a;b)$ tels que $a+b=105$ et $m=12d$, où $m$ et $d$ sont leur PPCM et leur PGCD.`,
 model:String.raw`**1. Réduction.** Avec $a=dr$, $b=ds$ et $\operatorname{PGCD}(r;s)=1$, on obtient $rs=12$ et $d(r+s)=105$.

**2. Couples réduits.** Les couples de facteurs positifs de $12$ sont $(1;12),(2;6),(3;4)$ et leurs inversés. Le couple $(2;6)$ ne convient pas, car son PGCD vaut $2$.

Si $(r;s)=(1;12)$ ou $(12;1)$, il faudrait $13d=105$, impossible avec $d$ entier. Pour $(3;4)$ ou $(4;3)$, $7d=105$, donc $d=15$.

**3. Retour et vérification.** Les solutions sont $\boxed{(45;60),(60;45)}$. Leur somme vaut $105$, leur PGCD $15$ et leur PPCM $180=12\times15$.`,
 criteria:["Je réduis par le PGCD.","Je conserve seulement les facteurs premiers entre eux.","Je vérifie que d est entier.","Je vérifie les deux couples dans les conditions initiales."]}]},
 {id:"gcd-evaluation-equation",title:String.raw`Résoudre une équation $ax+by=c$`,pages:[173,174],
 method:String.raw`Calculer le PGCD. S’il ne divise pas $c$, conclure qu’il n’y a pas de solution entière. Sinon, trouver une solution particulière par Bézout ou par repérage, soustraire les deux égalités, utiliser Gauss, puis vérifier la réciproque. Une solution particulière n’est pas la solution générale.`,
 examples:[ex("gcd-evaluation-equation-model","Une solution particulière puis toutes les solutions",String.raw`Résoudre $39x-11y=5$ dans $\mathbb Z^2$.`,
 String.raw`**1. Existence.** $11$ est premier et ne divise pas $39$ : le PGCD vaut $1$, qui divise $5$.

**2. Solution particulière.** $39\times2-11\times7=78-77=1$. En multipliant par $5$, on trouve $39\times10-11\times35=5$. Ainsi $(10;35)$ convient.

**3. Solution générale.** En soustrayant cette identité :
$$39(x-10)=11(y-35).$$
Comme $39$ et $11$ sont premiers entre eux, Gauss donne $11\mid x-10$. Il existe donc $k\in\mathbb Z$ tel que $x=10+11k$. En remplaçant, $y=35+39k$.

**4. Réciproque.** $39(10+11k)-11(35+39k)=390-385=5$ pour tout entier $k$.
$$\boxed{S=\{(10+11k;35+39k)\mid k\in\mathbb Z\}.}$$`)],
 questions:[],writtenTasks:[{id:"gcd-evaluation-equation-task",topicId:"gcd-diophantine",prompt:String.raw`Résoudre $748x-59y=12$ dans $\mathbb Z^2$.`,model:diophantineSolution(748,-59,12),
 criteria:["Je calcule le PGCD par les divisions successives.","Je remonte les restes et adapte la constante.","Je donne une famille avec un paramètre entier.","Je vérifie la réciproque."],nativeFigure:{kind:"gcd",preset:"eval-equation"}}]},
];
