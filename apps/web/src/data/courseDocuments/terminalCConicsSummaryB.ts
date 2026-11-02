import type { CourseDocumentSection } from "../../domain/courseDocument";
import { centralConicDetails } from "../exerciseCollections/conicSolutions";
export const conicsSummaryB:CourseDocumentSection[]=[
  {id:"conics-ellipse-section",numeral:"III",title:"Ellipse",topics:[
    {id:"conics-ellipse-form",title:"Axes et sommets d’une ellipse",pages:[94,95],legacyLessonIds:["ellipse-reduced-equation","pool-ellipse-mission"],
      body:String.raw`Pour $a,b>0$, l’équation
$$\boxed{\frac{x^2}{a^2}+\frac{y^2}{b^2}=1}$$
définit une ellipse de centre $O$. Les axes $(Ox)$ et $(Oy)$ sont ses axes de symétrie. Ses quatre sommets sont :
$$A(a;0),\quad A'(-a;0),\quad B(0;b),\quad B'(0;-b).$$
Les longueurs des axes sont $2a$ et $2b$. **Le grand axe correspond au plus grand dénominateur**, puisqu’un dénominateur est le carré d’un demi-axe.

| Comparaison | Grand axe, ou axe focal | Demi-grand axe |
| --- | --- | --- |
| $a>b$ | $(Ox)$ | $a$ |
| $b>a$ | $(Oy)$ | $b$ |
| $a=b$ | cercle | rayon $a=b$ |

L’ellipse est bornée : elle reste dans le rectangle $[-a,a]\times[-b,b]$. Elle n’a pas d’asymptote.`,
      nativeFigure:{kind:"conic",preset:"ellipse"},
    },
    {id:"conics-ellipse-elements",title:"Foyers, excentricité et directrices",pages:[95,96,97],
      body:String.raw`Pour une ellipse non circulaire, on note $c$ la distance du centre à un foyer. On soustrait le **carré du petit demi-axe** au **carré du grand demi-axe** :

| Élément | $a>b$, axe focal $(Ox)$ | $b>a$, axe focal $(Oy)$ |
| --- | --- | --- |
| $c$ | $\sqrt{a^2-b^2}$ | $\sqrt{b^2-a^2}$ |
| Excentricité $e$ | $c/a$ | $c/b$ |
| Foyers | $F_\pm(\pm c;0)$ | $F_\pm(0;\pm c)$ |
| Directrices associées | $D_\pm:x=\pm a^2/c$ | $D_\pm:y=\pm b^2/c$ |

On associe **les mêmes signes** : $F_+$ avec $D_+$, $F_-$ avec $D_-$. Pour chacun des deux couples :
$$\boxed{MF=e\,d(M,D).}$$
Pour une ellipse non circulaire, $0<e<1$. Les foyers sont à l’intérieur de l’ellipse ; les directrices sont à l’extérieur. La distance entre les foyers vaut $2c$.

**Cas du cercle.** Lorsque $a=b$, on a $c=0$ et $e=0$. Le cercle est bien une ellipse, mais les expressions $a^2/c$ ne sont plus définies : on ne lui attribue pas de directrice finie par ces formules.`,
      examples:[{id:"conics-ellipse-worked",title:"Changer l’orientation du grand axe",prompt:"Déterminer tous les éléments de chaque ellipse.",parts:[
        {id:"conics-ellipse-worked-x",label:"1.",prompt:String.raw`$\dfrac{x^2}{9}+\dfrac{y^2}{4}=1$.`,solution:centralConicDetails({kind:"ellipse",axis:"x",h:0,k:0,a2:9,b2:4})},
        {id:"conics-ellipse-worked-y",label:"2.",prompt:String.raw`$\dfrac{x^2}{4}+\dfrac{y^2}{9}=1$.`,solution:centralConicDetails({kind:"ellipse",axis:"y",h:0,k:0,a2:9,b2:4})},
      ],nativeFigure:{kind:"conic",preset:"ellipse-elements"}}],
    },
  ]},
  {id:"conics-hyperbola-section",numeral:"IV",title:"Hyperbole",topics:[
    {id:"conics-hyperbola-form",title:"Branches, axes, sommets et asymptotes",pages:[97,98],legacyLessonIds:["hyperbola-reduced-equation"],
      body:String.raw`Pour $a,b>0$, les deux orientations sont :
$$\boxed{\frac{x^2}{a^2}-\frac{y^2}{b^2}=1}\qquad\text{ou}\qquad
\boxed{-\frac{x^2}{a^2}+\frac{y^2}{b^2}=1.}$$
Le centre est $O$ et $(Ox),(Oy)$ sont les deux axes de symétrie. Une hyperbole possède **deux branches**. L’axe focal correspond au **terme carré positif**.

| Forme | Axe focal | Sommets |
| --- | --- | --- |
| $x^2/a^2-y^2/b^2=1$ | $(Ox)$ | $(a;0)$ et $(-a;0)$ |
| $-x^2/a^2+y^2/b^2=1$ | $(Oy)$ | $(0;b)$ et $(0;-b)$ |

Dans les deux formes, les asymptotes sont :
$$\boxed{y=\frac ba x\quad\text{et}\quad y=-\frac ba x.}$$
On peut les tracer comme les diagonales du rectangle de demi-largeur $a$ et de demi-hauteur $b$. Elles passent par le centre ; la courbe s’en approche à l’infini sans les rejoindre.

**Attention aux lettres.** Dans ce tableau, $a^2$ reste le dénominateur de $x^2$ et $b^2$ celui de $y^2$. Pour l’orientation verticale, le demi-axe focal est donc $b$, et non $a$.`,
      nativeFigure:{kind:"conic",preset:"hyperbola"},
    },
    {id:"conics-hyperbola-elements",title:"Éléments et hyperbole équilatère",pages:[98,99],
      body:String.raw`Pour une hyperbole, les carrés des deux demi-axes **s’ajoutent** :
$$\boxed{c=\sqrt{a^2+b^2}.}$$

| Élément | Axe focal $(Ox)$ | Axe focal $(Oy)$ |
| --- | --- | --- |
| Excentricité $e$ | $c/a$ | $c/b$ |
| Foyers | $F_\pm(\pm c;0)$ | $F_\pm(0;\pm c)$ |
| Directrices associées | $D_\pm:x=\pm a^2/c$ | $D_\pm:y=\pm b^2/c$ |

On a toujours **$e>1$**. Les mêmes signes désignent un foyer et sa directrice associée. Les directrices ne rencontrent pas l’hyperbole.

Si $a=b$, les deux asymptotes sont $y=x$ et $y=-x$ : elles sont perpendiculaires. On parle d’**hyperbole équilatère**. Une équation $x^2-y^2=k$ avec $k\ne0$ en est un exemple ; le signe de $k$ fixe l’axe focal.

Après translation vers $\Omega(h;k)$, les asymptotes deviennent $y-k=\pm(b/a)(x-h)$, tandis que les coordonnées des foyers et des sommets sont décalées de $(h;k)$.`,
      examples:[{id:"conics-hyperbola-worked",title:"Deux orientations d’une hyperbole",prompt:"Déterminer les éléments et les asymptotes.",parts:[
        {id:"conics-hyperbola-worked-x",label:"1.",prompt:String.raw`$\dfrac{x^2}{4}-\dfrac{y^2}{9}=1$.`,solution:centralConicDetails({kind:"hyperbola",axis:"x",h:0,k:0,a2:4,b2:9})},
        {id:"conics-hyperbola-worked-y",label:"2.",prompt:String.raw`$-\dfrac{x^2}{4}+\dfrac{y^2}{9}=1$.`,solution:centralConicDetails({kind:"hyperbola",axis:"y",h:0,k:0,a2:9,b2:4})},
      ],nativeFigure:{kind:"conic",preset:"hyperbola-elements"}}],
    },
  ]},
];
