import type { CourseDocumentSection } from "../../domain/courseDocument";

export const probabilitySummaryA: CourseDocumentSection[] = [
  { id: "prob-conditioning", numeral: "I", title: "Probabilité conditionnelle", topics: [
    { id: "prob-condition", title: "Calculer une probabilité sachant un événement", pages: [223], legacyLessonIds: ["conditional-probability"],
      body: String.raw`Soient $A,B$ deux événements d’un univers $\Omega$, avec **$P(A)>0$**. La probabilité que $B$ se réalise **sachant que $A$ est réalisé** se note $P_A(B)$ ou $P(B\mid A)$ :
$$\boxed{P_A(B)=\frac{P(A\cap B)}{P(A)}.}$$
On ne considère plus toutes les issues : on se limite à celles de $A$. Parmi elles, on cherche celles qui réalisent aussi $B$.

En multipliant par $P(A)$ :
$$\boxed{P(A\cap B)=P(A)\,P_A(B).}$$
Pour $A$ fixé de probabilité non nulle, $B\mapsto P_A(B)$ est une probabilité : ses valeurs sont dans $[0;1]$, $P_A(\Omega)=1$ et $P_A(\overline B)=1-P_A(B)$.

**L’ordre compte :** $P_A(B)$ et $P_B(A)$ ne désignent généralement pas le même nombre.`,
      examples: [{ id: "prob-school-example", title: "Se limiter aux filles du lycée", prompt: "On choisit au hasard un élève parmi les 867 élèves du lycée.", solution: String.raw`La répartition est :

| | Seconde | Première | Terminale | Total |
| --- | --- | --- | --- | --- |
| Filles | 203 | 116 | 161 | 480 |
| Garçons | 140 | 134 | 113 | 387 |
| Total | 343 | 250 | 274 | 867 |

Notons $F$ : « l’élève est une fille » et $T$ : « l’élève est en Terminale ». On cherche $P_F(T)$.

Il y a $480$ filles, dont $161$ en Terminale. Donc :
$$P_F(T)=\frac{P(F\cap T)}{P(F)}
=\frac{161/867}{480/867}=\boxed{\frac{161}{480}}.$$
Le dénominateur est $480$, et non $867$, parce qu’on sait déjà que l’élève choisi est une fille.` }],
    },
    { id: "prob-tree", title: "Lire et construire un arbre pondéré", pages: [223,224],
      body: String.raw`Un arbre pondéré organise une expérience en étapes.

1. La racine représente l’univers $\Omega$.
2. Les branches issues d’un même nœud représentent des possibilités **incompatibles deux à deux** qui couvrent tous les cas.
3. Une branche de premier rang porte une probabilité. Une branche de second rang porte une probabilité **conditionnelle**, par exemple $P_A(B)$.
4. Les probabilités des branches partant d’un même nœud ont pour somme $1$.
5. Un chemin représente l’intersection des événements rencontrés. **On multiplie les probabilités inscrites le long de ce chemin.**
6. Si un événement correspond à plusieurs chemins incompatibles, **on additionne leurs probabilités**.

Pour deux étapes :
$$P(A\cap B)=P(A)P_A(B),\qquad
P(\overline A\cap B)=P(\overline A)P_{\overline A}(B).$$
On ne multiplie pas deux probabilités sans vérifier ce qu’elles représentent.`,
      examples: [
        { id: "prob-bag-example", title: "Couleur d’une boule et mention Gagné", prompt: "Un sac contient 20 boules rouges et 30 noires. Parmi les rouges, 15 portent Gagné ; parmi les noires, 9 portent Gagné. On tire une boule au hasard.", solution: String.raw`Notons $R$ : « rouge », $G$ : « Gagné ». On a :
$$P(R)=\frac{20}{50}=\frac25,\qquad P(\overline R)=\frac35.$$
Parmi les rouges, $15$ sur $20$ sont gagnantes ; parmi les noires, $9$ sur $30$ :
$$P_R(G)=\frac34,\qquad P_{\overline R}(G)=\frac3{10}.$$
Les branches complémentaires portent donc $1/4$ et $7/10$.

Le chemin « rouge et Gagné » a pour probabilité :
$$\boxed{P(R\cap G)=\frac25\times\frac34=\frac3{10}.}$$
Le premier facteur choisit les rouges, le second choisit les gagnantes **parmi les rouges**.`, nativeFigure: { kind: "probability", preset: "bag" } },
        { id: "prob-coupon-example", title: "Bons de réduction et achats en ligne", prompt: "40 % des clients ont un bon. Parmi eux, 80 % achètent en ligne ; parmi les autres, 30 % achètent. R désigne la possession d’un bon et A l’achat.", parts: [
          { id: "prob-coupon-data", label: "1.a)", prompt: String.raw`Donner $P(R)$, $P_R(A)$ et $P_{\overline R}(A)$.`,
            solution: String.raw`La phrase « 40 % des clients ont un bon » donne $P(R)=2/5$. Les deux autres proportions sont conditionnelles :
$$\boxed{P_R(A)=\frac45,\qquad P_{\overline R}(A)=\frac3{10}.}$$` },
          { id: "prob-coupon-tree", label: "1.b)", prompt: "Traduire la situation par un arbre pondéré.",
            solution: String.raw`Les premières branches sont $R$ de poids $2/5$ et $\overline R$ de poids $3/5$. Depuis $R$, les poids vers $A,\overline A$ sont $4/5,1/5$. Depuis $\overline R$, ils sont $3/10,7/10$. À chaque nœud, leur somme vaut $1$.` },
          { id: "prob-coupon-complement", label: "2.a)", prompt: String.raw`Calculer $P_R(\overline A)$.`,
            solution: String.raw`Parmi les clients qui ont un bon, acheter ou ne pas acheter sont complémentaires :
$$\boxed{P_R(\overline A)=1-P_R(A)=1-\frac45=\frac15.}$$` },
          { id: "prob-coupon-total", label: "2.b)", prompt: String.raw`Calculer $P(A)$.`,
            solution: String.raw`Un client qui achète a un bon ou n’en a pas : ces deux chemins sont incompatibles.
$$P(A)=P(R)P_R(A)+P(\overline R)P_{\overline R}(A).$$
$$P(A)=\frac25\times\frac45+\frac35\times\frac3{10}
=\frac{16}{50}+\frac9{50}=\boxed{\frac12}.$$
La probabilité d’un achat est donc $50\,\%$.` },
        ], nativeFigure: { kind: "probability", preset: "coupons" } },
      ],
    },
    { id: "prob-total", title: "Formule des probabilités totales", pages: [224,225], legacyLessonIds: ["partition-total-probability"],
      body: String.raw`Soient $A_1,\ldots,A_n$ des événements **de probabilités non nulles**, incompatibles deux à deux et dont l’union est $\Omega$. Ils forment une partition de l’univers.

Pour tout événement $B$ :
$$\boxed{P(B)=\sum_{i=1}^nP(A_i)P_{A_i}(B).}$$
Cela signifie : calculer la probabilité de $B$ dans chaque cas possible, puis additionner les chemins.

Avec $A$ et son contraire, si $0<P(A)<1$ :
$$P(B)=P(A)P_A(B)+P(\overline A)P_{\overline A}(B).$$
Si un cas a une probabilité nulle, sa contribution à l’intersection est nulle ; on ne définit pas une probabilité conditionnelle en divisant par $0$.`,
      examples: [{ id: "prob-tv-example", title: "Téléviseur et magnétoscope", prompt: "Un client achète un téléviseur avec probabilité 0,6. Il achète un magnétoscope avec probabilité 0,4 s’il a acheté un téléviseur, et 0,2 sinon. Calculer la probabilité d’achat d’un magnétoscope.", solution: String.raw`Notons $T$ l’achat du téléviseur et $M$ celui du magnétoscope. Les données sont :
$$P(T)=0,6,\quad P(\overline T)=0,4,\quad P_T(M)=0,4,\quad P_{\overline T}(M)=0,2.$$
Les événements $T,\overline T$ forment une partition :
$$P(M)=0,6\times0,4+0,4\times0,2=0,24+0,08=\boxed{0,32}.$$
Il faut compter les deux possibilités d’achat du magnétoscope.` }],
    },
    { id: "prob-independence", title: "Événements indépendants", pages: [225], legacyLessonIds: ["product-independence"],
      body: String.raw`Deux événements $A,B$ sont **indépendants** si :
$$\boxed{P(A\cap B)=P(A)P(B).}$$
Cette définition reste valable même si l’une des probabilités est nulle.

Si $P(A)>0$, l’indépendance équivaut à $P_A(B)=P(B)$. Si $P(B)>0$, elle équivaut aussi à $P_B(A)=P(A)$.

Connaître la réalisation de l’un ne modifie alors pas la probabilité de l’autre.

**Indépendant ne veut pas dire incompatible.** Deux événements incompatibles de probabilités strictement positives ne sont pas indépendants : leur intersection a une probabilité nulle, mais leur produit est positif.`,
      examples: [
        { id: "prob-indep-numbers", title: "Comparer une intersection à un produit", prompt: "Décider dans chacun des deux cas.", parts: [
          { id: "prob-indep-no", label: "1.", prompt: String.raw`$P(A)=0,2$, $P(B)=0,38$ et $P(A\cap B)=0,08$.`,
            solution: String.raw`$P(A)P(B)=0,2\times0,38=0,076$. Ce nombre n’est pas égal à $0,08$. Donc **$A$ et $B$ ne sont pas indépendants**.` },
          { id: "prob-indep-yes", label: "2.", prompt: String.raw`$P(A)=0,5$, $P(B)=0,6$ et $P(A\cap B)=0,3$.`,
            solution: String.raw`$P(A)P(B)=0,5\times0,6=0,3=P(A\cap B)$. Donc **$A$ et $B$ sont indépendants**.` },
        ] },
        { id: "prob-replacement", title: "Avec ou sans remise", prompt: "Une urne contient 2 boules noires et 8 blanches. A signifie que la première est noire, B que la deuxième est noire.", parts: [
          { id: "prob-with-replacement", label: "a)", prompt: "Les événements sont-ils indépendants avec remise ?",
            solution: String.raw`Après remise et mélange, l’urne contient toujours $2$ noires sur $10$. Donc $P_A(B)=2/10=P(B)$ : **les événements sont indépendants** dans ce modèle de tirages au hasard.` },
          { id: "prob-without-replacement", label: "b)", prompt: "Même question sans remise.",
            solution: String.raw`Si la première est noire, il reste $1$ noire sur $9$ : $P_A(B)=1/9$. Si elle est blanche, il reste $2$ noires sur $9$ : $P_{\overline A}(B)=2/9$.

La probabilité du deuxième résultat dépend du premier : **les événements ne sont pas indépendants**. En particulier $P_A(B)=1/9\ne P(B)=2/10$.` },
        ] },
      ],
    },
    { id: "prob-complements", title: "Indépendance et événements contraires", pages: [226],
      body: String.raw`Si $A,B$ sont indépendants, alors **$A,\overline B$**, **$\overline A,B$** et **$\overline A,\overline B$** le sont aussi.

Par exemple :
$$P(A\cap\overline B)=P(A)-P(A\cap B)
=P(A)(1-P(B))=P(A)P(\overline B).$$
La même propriété s’applique en remplaçant $A$ par son contraire.

Elle permet aussi de raisonner dans l’autre sens : si $\overline A$ et $\overline B$ sont indépendants, prendre de nouveau les contraires prouve l’indépendance de $A,B$.`,
      examples: [
        { id: "prob-complement-number", title: "Vérifier l’indépendance à partir des contraires", prompt: String.raw`$P(A)=0,7$, $P(B)=0,4$ et $P(\overline A\cap\overline B)=0,28$. Les événements $A,B$ sont-ils indépendants ?`,
          solution: String.raw`$P(\overline A)=0,3$ et $P(\overline B)=0,6$. Leur produit vaut $0,3\times0,6=0,18$, différent de $0,28$.

Les événements $\overline A,\overline B$ ne sont donc pas indépendants. Si $A,B$ l’étaient, leurs contraires le seraient aussi, ce qui est impossible. **$A,B$ ne sont donc pas indépendants.**` },
        { id: "prob-stephane", title: "Réveil et panne de scooter", prompt: "R : Stéphane n’entend pas son réveil ; S : le scooter tombe en panne. On suppose R et S indépendants, avec P(R)=0,1 et P(S)=0,05. Il est en retard dès qu’au moins l’un se produit.", parts: [
          { id: "prob-stephane-alarm", label: "1.", prompt: "Calculer la probabilité d’entendre le réveil et d’avoir une panne.",
            solution: String.raw`L’événement est $\overline R\cap S$. Les contraires conservent l’indépendance :
$$\boxed{P(\overline R\cap S)=(1-0,1)\times0,05=0,045.}$$` },
          { id: "prob-stephane-time", label: "2.", prompt: "Calculer la probabilité d’arriver à l’heure.",
            solution: String.raw`Il faut entendre le réveil **et** ne pas avoir de panne, soit $\overline R\cap\overline S$ :
$$\boxed{P(\text{à l’heure})=0,9\times0,95=0,855.}$$
Par complément, la probabilité d’être en retard vaut $1-0,855=0,145$.` },
        ] },
      ],
    },
  ] },
];
