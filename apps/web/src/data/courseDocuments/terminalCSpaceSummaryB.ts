import type { CourseDocumentSection } from "../../domain/courseDocument";
export const spaceSummaryB:CourseDocumentSection[]=[
  {id:"space-parametric",numeral:"II",title:"Représentations paramétriques d’une droite",topics:[
    {id:"space-line",title:"Un point, une direction et un paramètre",pages:[74],legacyLessonIds:["line-parametric-form"],
      body:String.raw`Dans un repère de l’espace, la droite passant par $A(x_A;y_A;z_A)$ et dirigée par $\vec u(a;b;c)\ne\vec0$ est l’ensemble des points $M$ tels que $\overrightarrow{AM}=t\vec u$, $t\in\mathbb R$.

Une représentation paramétrique est donc :
$$\boxed{\begin{cases}x=x_A+ta\\y=y_A+tb\\z=z_A+tc\end{cases}\quad(t\in\mathbb R).}$$
Les trois lignes utilisent le **même paramètre**. Pour tester un point, il faut trouver une seule valeur satisfaisant les trois égalités.

La même droite admet plusieurs représentations : on peut choisir un autre point sur elle ou multiplier son directeur par un réel non nul. Pour la droite $(AB)$, avec $A\ne B$, on peut prendre $\overrightarrow{AB}$ comme directeur.`,
      nativeFigure:{kind:"space",preset:"parameter"},
      examples:[{id:"space-line-worked",title:"Paramétrer une droite",prompt:String.raw`La droite passe par $A(1;2;3)$ et a pour directeur $\vec u(-1;1;2)$.`,solution:String.raw`On ajoute $t$ fois chaque coordonnée de $\vec u$ à celle de $A$ :
$$\boxed{x=1-t,\quad y=2+t,\quad z=3+2t,\qquad t\in\mathbb R.}$$
Pour $t=0$, on retrouve $A$. Pour $t=1$, on obtient $(0;3;5)$ ; le vecteur allant de $A$ à ce point est bien $(-1;1;2)$.`}],
    },
  ]},
  {id:"space-positions",numeral:"III",title:"Positions relatives de droites et de plans",topics:[
    {id:"space-two-lines",title:"Deux droites de l’espace",pages:[74,75],legacyLessonIds:["relative-lines-space"],
      body:String.raw`Soient $(D)=A+\mathbb R\vec u$ et $(D')=B+\mathbb R\vec v$, avec $\vec u,\vec v\ne\vec0$.

| Directions | Test complémentaire | Position |
|---|---|---|
| $\vec u,\vec v$ colinéaires | $B\in(D)$ | Droites confondues |
| $\vec u,\vec v$ colinéaires | $B\notin(D)$ | Strictement parallèles |
| Directions non colinéaires | Un point commun | Sécantes |
| Directions non colinéaires | Aucun point commun | Non coplanaires |

Dans le cas non colinéaire, avoir un point commun équivaut à la coplanarité de $\overrightarrow{AB},\vec u,\vec v$. On peut le vérifier en résolvant $A+t\vec u=B+s\vec v$.

Il y a **deux paramètres indépendants** $t,s$. Résoudre deux égalités fournit des candidats ; il faut aussi vérifier la troisième.

Dans un repère orthonormé, $\vec u\cdot\vec v=0$ signifie que les droites sont **orthogonales**. Si elles sont en plus sécantes, on les dit **perpendiculaires**. Des droites non coplanaires peuvent être orthogonales sans se couper.`,
      nativeFigure:{kind:"space",preset:"two-lines"},
    },
    {id:"space-line-plane",title:"Une droite et un plan",pages:[75],legacyLessonIds:["line-plane-position","sculpture-orthogonality-mission"],
      body:String.raw`Soit $(D)=A+\mathbb R\vec u$ et un plan $(P)$ de normale $\vec n$, contenant $B$.

| Test | Position |
|---|---|
| $\vec u\cdot\vec n=0$ et $\overrightarrow{AB}\cdot\vec n\ne0$ | Strictement parallèles |
| $\vec u\cdot\vec n=0$ et $\overrightarrow{AB}\cdot\vec n=0$ | $(D)$ est incluse dans $(P)$ |
| $\vec u\cdot\vec n\ne0$ | Une intersection unique |

Dire qu’une droite est parallèle à un plan peut inclure le cas où elle est contenue dans le plan ; on précise **strictement parallèle** lorsqu’ils n’ont aucun point commun.

**Méthode par substitution.** Pour $(P):ax+by+cz+d=0$, remplacer $(x,y,z)$ par $A+t\vec u$ donne :
$$a x_A+b y_A+c z_A+d+t(\vec n\cdot\vec u)=0.$$
- Coefficient de $t$ non nul : une seule solution.
- Coefficient nul et constante non nulle : aucune solution.
- Deux termes nuls : tout $t$ convient.

Si $\vec u$ et $\vec n$ sont colinéaires, la droite est **orthogonale au plan** ; elle le coupe en son pied.`,
      nativeFigure:{kind:"space",preset:"line-plane"},
    },
    {id:"space-two-planes",title:"Deux plans de l’espace",pages:[72,73,75],legacyLessonIds:["relative-planes","orthogonal-planes-reinforcement","parameterized-planes-mission"],
      body:String.raw`Soient $(P)$ et $(Q)$ de normales respectives $\vec n,\vec n'$.

| Normales | Test complémentaire | Position |
|---|---|---|
| Colinéaires | Un point de $(P)$ appartient à $(Q)$ | Plans confondus |
| Colinéaires | Ce point n’appartient pas à $(Q)$ | Strictement parallèles |
| Non colinéaires | Aucun autre test nécessaire | Sécants suivant une droite |

Si $A\in(P)$ et $B\in(Q)$ et que les normales sont colinéaires, $\overrightarrow{AB}\cdot\vec n=0$ caractérise la coïncidence ; un produit non nul caractérise le parallélisme strict.

Dans un repère orthonormé, les plans sont **perpendiculaires** si et seulement si leurs normales sont orthogonales :
$$\boxed{(P)\perp(Q)\iff\vec n\cdot\vec n'=0.}$$
Deux normales non nulles orthogonales ne sont pas colinéaires : les plans sont alors sécants.

Pour obtenir leur droite d’intersection, résoudre les deux équations avec une coordonnée prise comme paramètre. Des normales colinéaires ne suffisent pas à affirmer que les plans sont distincts : il faut aussi comparer leurs constantes.`,
      nativeFigure:{kind:"space",preset:"two-planes"},
      examples:[{id:"space-parallel-normals",title:"Deux normales proportionnelles",prompt:String.raw`$\vec n$ et $\lambda\vec n$, avec $\lambda\ne0$, sont des normales respectives de $(P)$ et $(Q)$. Que peut-on conclure ?`,solution:String.raw`Ces deux vecteurs sont non nuls et colinéaires. Les plans ont donc la même direction : ils sont parallèles au sens large. Sans information sur un point ou sur leurs constantes, on ne peut pas décider s’ils sont confondus ou strictement parallèles.`}],
    },
  ]},
];
