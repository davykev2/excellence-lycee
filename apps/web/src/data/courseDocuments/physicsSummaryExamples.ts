import type { CourseWorkedExample } from "../../domain/courseDocument";

/** Explicit question-by-question writing models, with the existing course data. */
export const physicsSummaryExamples: Record<string,CourseWorkedExample[]> = {
  "position-vector":[{
    id:"physics-position-parametric-example",title:"Passer des équations horaires à la trajectoire",
    prompt:String.raw`Le mouvement est défini par $x(t)=t$ et $y(t)=-\frac12t^2+2$.`,
    parts:[
      {id:"position",label:"1",prompt:"Écrire le vecteur-position.",solution:String.raw`Dans le plan, $\overrightarrow{OM}=x\,\vec i+y\,\vec j$. En remplaçant chaque coordonnée :

$$\boxed{\overrightarrow{OM}(t)=t\,\vec i+\left(-\frac12t^2+2\right)\vec j.}$$`},
      {id:"trajectory",label:"2",prompt:"Déterminer l’équation cartésienne et la nature de la trajectoire.",solution:String.raw`La première équation donne $t=x$. On remplace **le temps** par $x$ dans la seconde :

$$y=-\frac12x^2+2.$$

La trajectoire est donc portée par la **parabole** d’équation $\boxed{y=-\frac12x^2+2}$. On ne conserve que les positions correspondant à l’intervalle de temps étudié.`},
    ],
  }],
  "velocity-vector":[{
    id:"physics-velocity-cartesian-example",title:"Calculer le vecteur-vitesse puis sa valeur",
    prompt:String.raw`Les coordonnées, exprimées en mètres, sont $x(t)=2t$ et $y(t)=-t^2$, avec $t$ en secondes.`,
    parts:[
      {id:"coordinates",label:"1",prompt:"Déterminer les coordonnées du vecteur-vitesse.",solution:String.raw`On dérive **séparément** les deux coordonnées par rapport au temps :

$$v_x(t)=\frac{d(2t)}{dt}=2,\qquad v_y(t)=\frac{d(-t^2)}{dt}=-2t.$$

Donc $\boxed{\vec v(t)=2\,\vec i-2t\,\vec j}$, en $\mathrm{m\cdot s^{-1}}$.`},
      {id:"speed",label:"2",prompt:String.raw`Calculer la valeur de la vitesse à $t=0{,}5\ \mathrm s$.`,solution:String.raw`À cette date, $v_x=2$ et $v_y=-1$. La valeur de la vitesse est la **norme** du vecteur :

$$v=\sqrt{v_x^2+v_y^2}=\sqrt{2^2+(-1)^2}=\sqrt5.$$

Ainsi $\boxed{v\approx2{,}24\ \mathrm{m\cdot s^{-1}}}$. Une composante peut être négative ; la norme reste positive.`},
    ],
  }],
  "acceleration-vector":[{
    id:"physics-acceleration-circular-example",title:"Accélération d’un mouvement circulaire uniforme",
    prompt:String.raw`Un mobile tourne sur un cercle de rayon $R=20\ \mathrm{cm}$ avec $\omega=250\ \mathrm{rad\cdot s^{-1}}$.`,
    parts:[
      {id:"speed",label:"1",prompt:"Calculer sa vitesse linéaire.",solution:String.raw`On convertit d’abord le rayon : $20\ \mathrm{cm}=0{,}20\ \mathrm m$. Puis :

$$v=R\omega=0{,}20\times250=\boxed{50\ \mathrm{m\cdot s^{-1}}}.$$`},
      {id:"acceleration",label:"2",prompt:"Déterminer les composantes de Frenet et la valeur de l’accélération.",solution:String.raw`La valeur de la vitesse est constante : $a_t=dv/dt=0$. Le mouvement reste circulaire :

$$a_n=\frac{v^2}{R}=\frac{50^2}{0{,}20}=\boxed{12\,500\ \mathrm{m\cdot s^{-2}}}.$$

L’accélération est donc **purement normale**, dirigée vers le centre : $\vec a=12\,500\,\vec n$. Sa valeur est $12\,500\ \mathrm{m\cdot s^{-2}}$.`},
    ],
  }],
  "rectilinear-varied-motion":[{
    id:"physics-mruv-identification-example",title:"Identifier les données initiales d’un MRUV",
    prompt:String.raw`Pour chaque équation, identifier $a_x$, $v_0$ et $x_0$. Les longueurs sont en mètres et le temps en secondes.`,
    parts:[
      {id:"first",label:"a",prompt:String.raw`$x(t)=2t^2-t+1$.`,solution:String.raw`On compare terme à terme avec $x(t)=\frac12a_xt^2+v_0t+x_0$ :

$$\frac12a_x=2\quad\Longrightarrow\quad a_x=4.$$

Le coefficient de $t$ est $-1$ et le terme constant vaut $1$. Donc :

$$\boxed{a_x=4\ \mathrm{m\cdot s^{-2}},\quad v_0=-1\ \mathrm{m\cdot s^{-1}},\quad x_0=1\ \mathrm m.}$$`},
      {id:"second",label:"b",prompt:String.raw`$x(t)=-\frac12t^2-3$.`,solution:String.raw`Le coefficient de $t^2$ donne $\frac12a_x=-\frac12$, donc $a_x=-1$. Il n’y a pas de terme en $t$ : **son coefficient est nul**.

$$\boxed{a_x=-1\ \mathrm{m\cdot s^{-2}},\quad v_0=0,\quad x_0=-3\ \mathrm m.}$$`},
    ],
  }],
  "circular-uniform-motion":[{
    id:"physics-loop-example",title:"Rayon et vitesse angulaire d’un looping",
    prompt:String.raw`Un avion décrit un cercle à la vitesse constante $v=500\ \mathrm{m\cdot s^{-1}}$. La valeur de l’accélération normale est $a_n=100\ \mathrm{m\cdot s^{-2}}$.`,
    parts:[
      {id:"radius",label:"1",prompt:"Calculer le rayon du cercle.",solution:String.raw`Dans un mouvement circulaire uniforme, $a_n=v^2/R$. On isole le rayon :

$$R=\frac{v^2}{a_n}=\frac{500^2}{100}=\boxed{2\,500\ \mathrm m}.$$`},
      {id:"angular-speed",label:"2",prompt:"Calculer la vitesse angulaire.",solution:String.raw`La relation $v=R\omega$ donne :

$$\omega=\frac vR=\frac{500}{2\,500}=\boxed{0{,}20\ \mathrm{rad\cdot s^{-1}}}.$$`},
    ],
  }],
};
