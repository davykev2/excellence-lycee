import type { CourseDocumentSection } from "../../domain/courseDocument";
export const complexSummaryB:CourseDocumentSection[]=[{id:"complex-polar-section",numeral:"II",title:"Formes trigonométrique et exponentielle",topics:[
 {id:"complex-argument-definition",title:"Argument et argument principal",pages:[130],legacyLessonIds:["complex-arguments"],
 body:String.raw`Pour $z\ne0$, de point-image $M$, un argument de $z$ est une mesure en radians de l’angle orienté $(\vec u;\overrightarrow{OM})$.
Si $\theta$ est un argument, tous les arguments sont $\theta+2k\pi$, avec $k\in\mathbb Z$. L’**argument principal**, noté $\operatorname{Arg}(z)$, est l’unique représentant dans $]-\pi;\pi]$.
**Zéro n’a pas d’argument.** Deux complexes non nuls sont égaux si et seulement s’ils ont le même module et des arguments égaux modulo $2\pi$. On peut aussi comparer leurs arguments principaux.`,
 nativeFigure:{kind:"complex",preset:"argument"},
 examples:[
 {id:"complex-argument-first",title:"Lire un angle sur le cercle",prompt:String.raw`Déterminer l’argument principal de $\frac{\sqrt3}2-\frac i2$.`,
 solution:String.raw`Le module vaut $1$. Sur le cercle trigonométrique, l’abscisse $\sqrt3/2$ et l’ordonnée $-1/2$ correspondent au quatrième quadrant. On reconnaît $\boxed{\operatorname{Arg}(z)=-\pi/6}$. Les autres arguments sont $-\pi/6+2k\pi$.`},
 {id:"complex-argument-equal",title:"Comparer deux descriptions",prompt:String.raw`$z$ a pour module $2$ et argument $-\pi/3$ ; $z'$ a pour module $2$ et argument $5\pi/3$. Montrer que $z=z'$.`,
 solution:String.raw`Les modules sont égaux et $5\pi/3=-\pi/3+2\pi$. Les deux directions sont donc les mêmes, et $\boxed{z=z'}$. On tient compte du tour complet.`}]},
 {id:"complex-trigonometric-form",title:"Écrire et retrouver une forme trigonométrique",pages:[130,131,132],legacyLessonIds:["trigonometric-form"],
 body:String.raw`Si $z=x+iy\ne0$, de module $r$ et d’argument $\theta$ :
$$r=OM=\sqrt{x^2+y^2},\qquad\cos\theta=\frac xr,\quad\sin\theta=\frac yr.$$
Sa forme trigonométrique est :
$$\boxed{z=r(\cos\theta+i\sin\theta),\qquad r>0.}$$
**De la forme algébrique à la forme trigonométrique :** calculer $r$, puis les deux rapports $x/r,y/r$ ; choisir l’angle dans le bon quadrant. Le cosinus seul ne suffit pas.
**Dans l’autre sens :** calculer $\cos\theta,\sin\theta$, puis multiplier chacun par $r$ pour obtenir les parties réelle et imaginaire.`,
 examples:[
 {id:"complex-trig-worked",title:"Quatre passages à la forme trigonométrique",prompt:"Calculer le module et un argument de chaque nombre.",parts:[
 {id:"complex-trig-a",label:"a)",prompt:String.raw`$\sqrt3+i$.`,solution:String.raw`$r=\sqrt{3+1}=2$. On a $\cos\theta=\sqrt3/2$, $\sin\theta=1/2$, donc $\theta=\pi/6$. Ainsi $\boxed{z=2(\cos(\pi/6)+i\sin(\pi/6))}$.`},
 {id:"complex-trig-b",label:"b)",prompt:String.raw`$1+i$.`,solution:String.raw`$r=\sqrt2$ et les deux rapports valent $\sqrt2/2$. Donc $\boxed{1+i=\sqrt2(\cos(\pi/4)+i\sin(\pi/4))}$.`},
 {id:"complex-trig-c",label:"c)",prompt:String.raw`$(\sqrt3+i)(1+i)$.`,solution:String.raw`Le module vaut $2\sqrt2$ et un argument est $\pi/6+\pi/4=5\pi/12$. Donc $\boxed{z=2\sqrt2(\cos(5\pi/12)+i\sin(5\pi/12))}$.`},
 {id:"complex-trig-d",label:"d)",prompt:String.raw`$(\sqrt3+i)/(1+i)$.`,solution:String.raw`Le module vaut $2/\sqrt2=\sqrt2$ et un argument est $\pi/6-\pi/4=-\pi/12$. Donc $\boxed{z=\sqrt2(\cos(-\pi/12)+i\sin(-\pi/12))}$.`}]},
 {id:"complex-trig-to-algebra",title:"Retrouver les deux coordonnées",prompt:"Écrire sous forme algébrique.",parts:[
 {id:"complex-trig-back-a",label:"a)",prompt:String.raw`$\sqrt2(\cos(\pi/2)+i\sin(\pi/2))$.`,solution:String.raw`$\cos(\pi/2)=0$, $\sin(\pi/2)=1$. Le nombre vaut $\boxed{i\sqrt2}$.`},
 {id:"complex-trig-back-b",label:"b)",prompt:String.raw`$4(\cos(-\pi/3)+i\sin(-\pi/3))$.`,solution:String.raw`Le cosinus vaut $1/2$, le sinus $-\sqrt3/2$. On obtient $4(1/2-i\sqrt3/2)=\boxed{2-2\sqrt3i}$.`},
 {id:"complex-trig-back-c",label:"c)",prompt:String.raw`$\sqrt2(\cos(-3\pi/4)+i\sin(-3\pi/4))$.`,solution:String.raw`Les deux valeurs trigonométriques sont $-\sqrt2/2$. Ainsi $\boxed{z=-1-i}$.`}]}]},
 {id:"complex-argument-calculus",title:"Arguments d’un produit, d’un quotient et d’une puissance",pages:[131],
 body:String.raw`Pour $z,z'\ne0$, $\theta$ argument de $z$, $\theta'$ argument de $z'$ et $n\in\mathbb Z$ :

| Nombre | Un argument |
| --- | --- |
| $zz'$ | $\theta+\theta'$ |
| $1/z$ | $-\theta$ |
| $z/z'$ | $\theta-\theta'$ |
| $z^n$ | $n\theta$ |

Dans chaque ligne, les autres arguments s’obtiennent en ajoutant $2k\pi$. Pour obtenir l’argument principal, on ramène le résultat dans $]-\pi;\pi]$ en retirant ou ajoutant des tours complets.`,
 examples:[{id:"complex-argument-calculus-worked",title:"Additionner et soustraire les angles",prompt:String.raw`On donne $\operatorname{Arg}(z)=-\pi/2$ et $\operatorname{Arg}(z')=\pi/3$. Déterminer un argument.`,parts:[
 {id:"complex-arg-product",label:"a)",prompt:String.raw`$zz'$.`,solution:String.raw`$-\pi/2+\pi/3=(-3+2)\pi/6=\boxed{-\pi/6}$.`},
 {id:"complex-arg-inverse",label:"b)",prompt:String.raw`$1/z$.`,solution:String.raw`On change le signe : $-(-\pi/2)=\boxed{\pi/2}$.`},
 {id:"complex-arg-quotient",label:"c)",prompt:String.raw`$z/z'$.`,solution:String.raw`On soustrait l’argument du dénominateur : $-\pi/2-\pi/3=\boxed{-5\pi/6}$.`}]}]},
 {id:"complex-exponential-form",title:"Forme exponentielle",pages:[132,133],legacyLessonIds:["exponential-form"],
 body:String.raw`Pour $\theta\in\mathbb R$, on pose $e^{i\theta}=\cos\theta+i\sin\theta$. Tout complexe non nul s’écrit :
$$\boxed{z=re^{i\theta},\quad r=|z|>0.}$$
Le module $r$ est unique ; l’angle $\theta$ n’est unique qu’à un multiple de $2\pi$ près.
$$e^{-i\theta}=\frac1{e^{i\theta}}=\cos\theta-i\sin\theta,\quad |e^{i\theta}|=1,$$
$$e^{i\theta}e^{i\theta'}=e^{i(\theta+\theta')},\qquad \frac{e^{i\theta}}{e^{i\theta'}}=e^{i(\theta-\theta')}.$$
Une expression $-re^{i\theta}$, avec $r>0$, n’est pas encore sous la forme exponentielle usuelle : écrire $re^{i(\theta+\pi)}$.`,
 examples:[
 {id:"complex-exponential-worked",title:"Passer à l’écriture exponentielle",prompt:"Écrire sous forme exponentielle.",parts:[
 {id:"complex-exp-a",label:"a)",prompt:String.raw`$\sqrt2(\cos(\pi/2)+i\sin(\pi/2))$.`,solution:String.raw`On remplace la parenthèse par $e^{i\pi/2}$ : $\boxed{\sqrt2e^{i\pi/2}}$.`},
 {id:"complex-exp-b",label:"b)",prompt:String.raw`$1-\sqrt3i$.`,solution:String.raw`Le module vaut $2$, le cosinus de l’argument $1/2$ et le sinus $-\sqrt3/2$. Un argument est $-\pi/3$, donc $\boxed{2e^{-i\pi/3}}$.`}]},
 {id:"complex-exponential-calculus",title:"Calculer des angles dans un exponentiel",prompt:"Réduire à un seul exponentiel.",parts:[
 {id:"complex-exp-calc-a",label:"a)",prompt:String.raw`$e^{-i\pi/3}e^{i\pi/4}$.`,solution:String.raw`$-\pi/3+\pi/4=-\pi/12$. Le résultat est $\boxed{e^{-i\pi/12}}$.`},
 {id:"complex-exp-calc-b",label:"b)",prompt:String.raw`$e^{i\pi/2}/e^{i\pi/5}$.`,solution:String.raw`$\pi/2-\pi/5=3\pi/10$. Le résultat est $\boxed{e^{3i\pi/10}}$.`},
 {id:"complex-exp-calc-c",label:"c)",prompt:String.raw`$e^{i\pi/5}/(e^{2i\pi/5}e^{-4i\pi/5})$.`,solution:String.raw`Le dénominateur vaut $e^{-2i\pi/5}$. On obtient $e^{i(\pi/5+2\pi/5)}=\boxed{e^{3i\pi/5}}$.`}]}]},
 {id:"complex-moivre-formula",title:"Formule de Moivre",pages:[133],legacyLessonIds:["moivre-linearization"],
 body:String.raw`Pour $\theta\in\mathbb R$ et $n\in\mathbb Z$ :
$$\boxed{(\cos\theta+i\sin\theta)^n=\cos(n\theta)+i\sin(n\theta).}$$
Ainsi, si $z=re^{i\theta}\ne0$, alors $z^n=r^n e^{in\theta}$. On élève **le module** à la puissance $n$ et on **multiplie l’angle** par $n$.`,
 nativeFigure:{kind:"complex",preset:"moivre"},
 examples:[{id:"complex-moivre-worked",title:"Une puissance de 1+i",prompt:String.raw`Écrire $(1+i)^3$ sous forme exponentielle.`,
 solution:String.raw`On sait que $1+i=\sqrt2e^{i\pi/4}$. Donc :
$$(1+i)^3=(\sqrt2)^3e^{3i\pi/4}=\boxed{2\sqrt2e^{3i\pi/4}}.$$
Vérification : $(1+i)^2=2i$, puis $2i(1+i)=-2+2i$, dont le module est $2\sqrt2$ et l’argument $3\pi/4$.`}]},
 {id:"complex-euler-linearization",title:"Formules d’Euler et linéarisation",pages:[133,134],
 body:String.raw`Pour $\theta\in\mathbb R$ :
$$\boxed{\cos\theta=\frac{e^{i\theta}+e^{-i\theta}}2,\qquad
\sin\theta=\frac{e^{i\theta}-e^{-i\theta}}{2i}.}$$
Ces identités s’appliquent aussi à $n\theta$. Pour linéariser une puissance ou un produit de sinus et cosinus, on veut une **somme de sinus ou cosinus d’angles multiples**, sans produits ni puissances.
On remplace les sinus/cosinus par Euler, on développe avec le binôme, puis on regroupe les exponentielles opposées. On peut également partir des formules d’addition. Une puissance de tangente donne en général un **quotient**, pas une somme finie de sinus/cosinus sur tout son domaine.`,
 examples:[
 {id:"complex-euler-worked",title:"Reconnaître un cosinus",prompt:String.raw`Calculer $\frac{e^{i\pi/4}+e^{-i\pi/4}}2$.`,solution:String.raw`C’est $\cos(\pi/4)$ par Euler, donc $\boxed{\sqrt2/2}$.`},
 {id:"complex-linearization-worked",title:"Linéariser un cube de sinus",prompt:String.raw`Linéariser $\sin^3x$.`,
 solution:String.raw`On part de $\sin x=(e^{ix}-e^{-ix})/(2i)$ :
$$\sin^3x=\frac{e^{3ix}-3e^{ix}+3e^{-ix}-e^{-3ix}}{-8i}.$$
On regroupe :
$$\sin^3x=-\frac{(e^{3ix}-e^{-3ix})-3(e^{ix}-e^{-ix})}{8i}.$$
Chaque différence vaut deux fois $i$ fois le sinus correspondant :
$$\boxed{\sin^3x=\frac{3\sin x-\sin(3x)}4.}$$`}]},
]}];
