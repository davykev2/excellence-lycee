import type { CourseDocumentSection } from "../../domain/courseDocument";
export const conicsSummaryC:CourseDocumentSection[]=[{
  id:"conics-synthesis-section",numeral:"V",title:"Synthèse : foyer, directrice et excentricité",topics:[
    {id:"conics-focus-definition",title:"Une même définition, trois familles",pages:[100,101,102],legacyLessonIds:["conic-focus-directrix","conic-region","conic-from-focus-directrix-reinforcement"],
      body:String.raw`Soient une droite $D$, un point $F$ **n’appartenant pas à $D$**, et un réel $e>0$. L’ensemble des points $M$ vérifiant
$$\boxed{MF=e\,d(M,D)}$$
est une conique de foyer $F$, de directrice associée $D$ et d’excentricité $e$. On peut aussi écrire $MF/d(M,D)=e$, puisque les points de la conique ne sont pas sur $D$.

| Excentricité | Nature | Nombre de foyers et de directrices |
| --- | --- | --- |
| $0<e<1$ | ellipse non circulaire | deux foyers, deux directrices |
| $e=1$ | parabole | un foyer, une directrice |
| $e>1$ | hyperbole | deux foyers, deux directrices |

L’ellipse et l’hyperbole possèdent un centre de symétrie. La parabole possède un sommet, mais pas de centre.

Pour écrire une équation à partir de $F(u;v)$ et $D:\alpha x+\beta y+\gamma=0$, avec $(\alpha,\beta)\ne(0,0)$, on utilise :
$$MF^2=(x-u)^2+(y-v)^2,$$
$$d(M,D)^2=\frac{(\alpha x+\beta y+\gamma)^2}{\alpha^2+\beta^2}.$$
Les deux distances étant positives ou nulles, élever $MF=e\,d(M,D)$ au carré est équivalent :
$$\boxed{(x-u)^2+(y-v)^2
=\frac{e^2}{\alpha^2+\beta^2}(\alpha x+\beta y+\gamma)^2.}$$`,
      nativeFigure:{kind:"conic",preset:"focus-ratio"},
      examples:[{id:"conics-eccentricity-worked",title:"Reconnaître une famille par son excentricité",prompt:"Préciser la nature de la conique.",parts:[
        {id:"conics-eccentricity-2",label:"1.",prompt:"L’excentricité vaut 2.",solution:String.raw`Comme $2>1$, il s’agit d’une **hyperbole**. Elle possède deux foyers, deux directrices associées et un centre.`},
        {id:"conics-eccentricity-1",label:"2.",prompt:"L’excentricité vaut 1.",solution:String.raw`C’est une **parabole**. Elle possède un foyer, une directrice et un sommet, mais pas de centre.`},
        {id:"conics-eccentricity-half",label:"3.",prompt:String.raw`L’excentricité vaut $\frac12$.`,solution:String.raw`Comme $0<\frac12<1$, c’est une **ellipse non circulaire**. Elle possède deux foyers, deux directrices associées et un centre.`},
      ]}],
    },
    {id:"conics-landmarks",title:"Retrouver les éléments sans les confondre",pages:[101,102],legacyLessonIds:["complex-hyperbola-mission"],
      body:String.raw`Voici une méthode commune aux trois familles.

1. Réduire l’équation, en complétant les carrés si nécessaire.
2. Repérer la nouvelle origine : **sommet pour une parabole**, **centre pour une ellipse ou une hyperbole**.
3. Identifier l’axe focal : variable non élevée au carré pour une parabole ; plus grand dénominateur pour une ellipse ; terme carré positif pour une hyperbole.
4. Calculer les foyers et les directrices avec la formule de la famille, puis ajouter les coordonnées de la nouvelle origine.
5. Tracer d’abord les axes et les sommets. Pour une hyperbole, tracer aussi les deux asymptotes.

| Repère utile | Parabole $V^2=2pU$ | Ellipse $U^2/A^2+V^2/B^2=1$, $A>B$ | Hyperbole $U^2/A^2-V^2/B^2=1$ |
| --- | --- | --- | --- |
| Centre ou sommet | sommet $(0;0)$ | centre $(0;0)$ | centre $(0;0)$ |
| Distance au foyer | $|p|/2$ depuis le sommet | $c=\sqrt{A^2-B^2}$ | $c=\sqrt{A^2+B^2}$ |
| Excentricité | $1$ | $c/A<1$ | $c/A>1$ |
| Directrice(s) | $U=-p/2$ | $U=\pm A^2/c$ | $U=\pm A^2/c$ |
| Asymptotes | aucune droite asymptote | aucune | $V=\pm(B/A)U$ |

Ici $U$ est la coordonnée **sur l’axe focal** : elle peut correspondre à $x-h$ ou à $y-k$. Cette notation évite d’appliquer une formule horizontale à une courbe verticale.

Pour vérifier un foyer et sa directrice, on peut choisir un sommet de la courbe et contrôler $MF=e\,d(M,D)$. Ce test simple détecte notamment un facteur 2 oublié pour une parabole.`,
    },
  ],
}];
