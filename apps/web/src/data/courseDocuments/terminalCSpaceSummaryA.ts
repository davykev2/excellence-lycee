import type { CourseDocumentSection } from "../../domain/courseDocument";
export const spaceSummaryA:CourseDocumentSection[]=[{
  id:"space-cartesian",numeral:"I",title:"Équations cartésiennes",topics:[
    {id:"space-normal",title:"Vecteur normal à un plan",pages:[72,73],legacyLessonIds:["plane-normal-vector"],
      body:String.raw`Soit $(P)$ un plan dirigé par deux vecteurs **non colinéaires** $\vec u,\vec v$. Un vecteur normal à $(P)$ est un vecteur $\vec n\ne\vec0$ orthogonal à ces deux directions :
$$\boxed{\vec n\cdot\vec u=0\quad\text{et}\quad\vec n\cdot\vec v=0.}$$
Il dirige une droite orthogonale au plan. Il est donc orthogonal à tout vecteur $\overrightarrow{MN}$ lorsque $M,N\in(P)$.

Un plan possède une infinité de vecteurs normaux, tous colinéaires : tout multiple **non nul** d’un vecteur normal convient.

**Propriété 1.** Un point $A$ et un vecteur $\vec n\ne\vec0$ déterminent un unique plan passant par $A$ et de normale $\vec n$.

**Propriété 2.** Si $A\in(P)$ et $\vec n$ est normal à $(P)$, alors, pour tout point $M$ :
$$M\in(P)\iff\overrightarrow{AM}\perp\vec n.$$
**Propriété 3.** La même appartenance s’écrit avec un produit scalaire :
$$\boxed{M\in(P)\iff\overrightarrow{AM}\cdot\vec n=0.}$$

Il faut deux directions non colinéaires du plan pour établir la normalité. Être orthogonal à une seule droite du plan ne suffit pas.`,
      nativeFigure:{kind:"space",preset:"normal"},
      examples:[{id:"space-cube-normal",title:"Dans un cube ABCDEFGH",prompt:"Les sommets E, F, G et H sont respectivement au-dessus de A, B, C et D.",parts:[
        {id:"space-cube-top",label:"1.",prompt:String.raw`Pourquoi $\overrightarrow{AE}$ est-il normal au plan $(EFG)$ ?`,solution:String.raw`Dans le cube, l’arête $(AE)$ est perpendiculaire aux deux arêtes $(EF)$ et $(EH)$, qui sont sécantes dans le plan de la face supérieure. Le vecteur $\overrightarrow{AE}\ne\vec0$ est donc orthogonal à deux directions non colinéaires de $(EFG)$. C’est un vecteur normal à ce plan.`},
        {id:"space-cube-base",label:"2.",prompt:String.raw`Quel est le plan passant par $A$ et de normale $\overrightarrow{AE}$ ?`,solution:String.raw`Les arêtes $(AB)$ et $(AD)$ sont perpendiculaires à $(AE)$ et non colinéaires. Donc $\overrightarrow{AE}$ est normal au plan de la face $(ABC)$. Comme ce plan passe par $A$, l’unicité de la propriété1 donne $\boxed{(ABC)}$.`},
      ],nativeFigure:{kind:"space",preset:"cube"}}],
    },
    {id:"space-plane-equation",title:"Équation cartésienne d’un plan",pages:[73],legacyLessonIds:["plane-cartesian-equation","official-applications-workshop","containing-plane-reinforcement"],
      body:String.raw`Dans un **repère orthonormé**, tout plan de normale $\vec n(a;b;c)\ne\vec0$ a une équation :
$$\boxed{ax+by+cz+d=0.}$$
Réciproquement, si $(a,b,c)\ne(0,0,0)$, une telle équation définit un plan de vecteur normal $(a;b;c)$.

Pour le plan passant par $A(x_A;y_A;z_A)$ :
$$\boxed{a(x-x_A)+b(y-y_A)+c(z-z_A)=0.}$$
On développe ensuite si nécessaire. Cette formule vient directement de $\overrightarrow{AM}\cdot\vec n=0$.

**Remarques.** Dans un repère quelconque, un plan possède encore une équation $ax+by+cz+d=0$, mais les coordonnées $(a;b;c)$ ne donnent pas forcément une normale si le repère n’est pas orthonormé.

Multiplier toute l’équation par $k\ne0$ ne change pas le plan. Par exemple, $x+y+z-1=0$, $2x-y+4=0$ et $x=0$ définissent des plans, car leurs trois coefficients ne sont pas tous nuls. En revanche, $0x+0y+0z+d=0$ ne définit pas un plan.`,
      examples:[{id:"space-plane-worked",title:"Un point et une normale",prompt:String.raw`Déterminer une équation du plan passant par $A(1;-1;2)$ et de normale $\vec n(1;2;3)$.`,solution:String.raw`Le plan a une équation $x+2y+3z+d=0$. Comme il contient $A$ :
$$1+2(-1)+3(2)+d=0,$$
soit $5+d=0$ et $d=-5$. Ainsi :
$$\boxed{x+2y+3z-5=0.}$$
Vérification : les coefficients donnent bien la normale $(1;2;3)$ et les coordonnées de $A$ annulent le membre de gauche.`}],
    },
    {id:"space-distance",title:"Distance d’un point à un plan",pages:[73,74],legacyLessonIds:["point-plane-distance"],
      body:String.raw`Dans un repère orthonormé, soit $(P):ax+by+cz+d=0$, avec $(a,b,c)\ne(0,0,0)$, et $A(x_A;y_A;z_A)$. La distance de $A$ à $(P)$ est :
$$\boxed{d(A,P)=\frac{|ax_A+by_A+cz_A+d|}{\sqrt{a^2+b^2+c^2}}.}$$
Si $H$ est le projeté orthogonal de $A$ sur $(P)$, cette distance vaut $AH$. Elle est toujours positive ou nulle et vaut $0$ exactement lorsque $A\in(P)$.

Le numérateur prend la **valeur absolue**. Le dénominateur est la norme du vecteur normal, pas son carré.

On peut retrouver $H$ en intersectant le plan avec la droite passant par $A$ et dirigée par $\vec n$. La formule obtenue est :
$$H=A-\frac{ax_A+by_A+cz_A+d}{a^2+b^2+c^2}\,\vec n.$$
Cette écriture complète la formule de distance ; elle permet de vérifier que $H$ appartient au plan et que $(AH)$ est orthogonale au plan.`,
      nativeFigure:{kind:"space",preset:"projection"},
      examples:[{id:"space-distance-worked",title:"Calculer une distance",prompt:String.raw`$(P):x+2y-3z+5=0$ et $A(-1;2;5)$. Calculer $d(A,P)$.`,solution:String.raw`Un vecteur normal est $(1;2;-3)$, de norme $\sqrt{1+4+9}=\sqrt{14}$.

En remplaçant par **les coordonnées de A** :
$$|-1+2(2)-3(5)+5|=|-7|=7.$$
Donc $\boxed{d(A,P)=\frac7{\sqrt{14}}=\frac{\sqrt{14}}2}$. La valeur absolue garantit une distance positive.`}],
    },
  ],
}];
