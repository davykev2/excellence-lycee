import { complexExercise as ex,complexShort as cs,written } from "./terminalCComplexBuilders";
export const complexDeepeningB=[
 ex(65,"Racines cinquièmes",String.raw`On pose $a=\frac92(\sqrt3-3i)$.`,[
  written("1.","Écrire a sous forme trigonométrique.",String.raw`$|a|=(9/2)\sqrt{3+9}=9\sqrt3$. En divisant les parties par ce module, on obtient $\cos\theta=1/2$ et $\sin\theta=-\sqrt3/2$. Donc $\boxed{a=9\sqrt3(\cos(-\pi/3)+i\sin(-\pi/3))}$.`),
  written("2.a","Déterminer les racines cinquièmes de a.",String.raw`Comme $(\sqrt3)^5=9\sqrt3$, leur module est $\sqrt3$. Leurs arguments sont $-\pi/15+2k\pi/5$. Ainsi :
$$\boxed{z_k=\sqrt3(\cos(-\pi/15+2k\pi/5)+i\sin(-\pi/15+2k\pi/5)),\quad k=0,\ldots,4.}$$`),
  written("2.b","Représenter les cinq points.",String.raw`Tracer le cercle centré en O de rayon $\sqrt3$. Le premier point est à l’angle $-\pi/15=-12^\circ$. Placer ensuite les points aux angles $60^\circ,132^\circ,204^\circ,276^\circ$. Ils forment un pentagone régulier.`)
 ],true),
 ex(66,"Un quotient réel ou imaginaire pur",String.raw`Pour $z\ne i$, on pose $Z=(2z-4)/(z-i)$. Déterminer et construire les lieux demandés.`,[
  written("1.","Z réel.",String.raw`Écrivons $z=x+iy$. On multiplie par le conjugué du dénominateur. Le dénominateur réel vaut $x^2+(y-1)^2>0$ et la partie imaginaire du numérateur vaut $2x+4y-4$. Donc :
$$Z\in\mathbb R\iff x+2y-2=0.$$
Le lieu est $\boxed{\text{la droite passant par }(2;0)\text{ et }(0;1),\text{ privée de }(0;1)}$.
Le point $(2;0)$ reste admis : Z y vaut 0.`),
  written("2.","Z imaginaire pur.",String.raw`La partie réelle du même numérateur est $2x(x-2)+2y(y-1)$. Elle s’annule si :
$$x^2-2x+y^2-y=0\iff (x-1)^2+(y-\tfrac12)^2=\tfrac54.$$
Le lieu est $\boxed{\text{le cercle de diamètre }[(2;0),(0;1)],\text{ privé de }(0;1)}$. Il contient $(2;0)$, car 0 est imaginaire pur. Tracer le centre $(1;1/2)$ et le rayon $\sqrt5/2$.`)
 ],true),
 ex(67,"Une transformation par quotient",String.raw`Pour $z\ne-i$, on pose $f(z)=iz/(z+i)$. On note $A(-i)$.`,[
  cs("1.","Trouver b tel que f(b)=1+2i.",[.5,-1.5],String.raw`$ib=(1+2i)(b+i)$, donc $(-1-i)b=-2+i$. On divise par $-1-i$ et multiplie par son conjugué :
$$b=\frac{(-2+i)(-1+i)}2=\boxed{\frac12-\frac32i}.$$
Cette valeur est différente de $-i$, donc elle appartient bien au domaine.`),
  written("2.",String.raw`Si $z+i=re^{it}$, exprimer $f(z)-i$ sous forme trigonométrique.`,String.raw`On soustrait avec le même dénominateur :
$$f(z)-i=\frac{iz-i(z+i)}{z+i}=\frac1{z+i}.$$
Comme $r>0$, $\boxed{f(z)-i=\frac1r(\cos(-t)+i\sin(-t))}$.`),
  written("3.a",String.raw`Déterminer le lieu $\mathcal C$ défini par $|f(z)-i|=\sqrt2$.`,String.raw`L’identité précédente donne $1/|z+i|=\sqrt2$, soit $|z+i|=1/\sqrt2$. C’est $\boxed{\mathcal C(A;\sqrt2/2)}$. Son centre A n’est pas sur le cercle ; aucun point supplémentaire n’est à retirer.`),
  written("3.b",String.raw`Déterminer le lieu $\Gamma$ pour lequel $\pi/4$ est un argument de $f(z)-i$.`,String.raw`Il faut $-t\equiv\pi/4\pmod{2\pi}$, soit $t\equiv-\pi/4$. Donc $z+i$ est un réel strictement positif fois $1-i$. Le lieu est $\boxed{z=-i+s(1-i),\ s>0}$ : la demi-droite d’origine A, de direction $(1;-1)$, privée de A. Une droite complète donnerait aussi l’argument opposé, qui ne convient pas.`),
  written("3.c","Vérifier que B appartient aux deux lieux.",String.raw`$b+i=(1-i)/2$. Son module est $\sqrt2/2$ et son argument $-\pi/4$. Ainsi B appartient à $\mathcal C$ et à $\Gamma$. On peut aussi utiliser $f(b)-i=1+i$, de module $\sqrt2$ et d’argument $\pi/4$.`),
  written("3.d","Construire les deux lieux.",String.raw`Placer A(0;−1), tracer le cercle de rayon $\sqrt2/2$ et la demi-droite partant de A vers B(1/2;−3/2), sans inclure A. Leur unique intersection est B.`)
 ],true),
 ex(68,"Égalité de deux modules",String.raw`On suppose $|1+iz|=|1-iz|$. Montrer que z est réel.`,[
  written("1.","Démontrer.",String.raw`Posons $z=x+iy$. Alors $1+iz=1-y+ix$ et $1-iz=1+y-ix$. Les modules sont positifs ou nuls, donc leur égalité équivaut à celle de leurs carrés :
$$(1-y)^2+x^2=(1+y)^2+x^2\iff -4y=0.$$
Ainsi $y=0$ et $\boxed{z\in\mathbb R}$.`)
 ]),
 ex(69,"Calcul exponentiel","Donner les formes algébriques.",[
  cs("1.",String.raw`$2e^{-i\pi/4}e^{3i\pi/4}$.`,[0,2],String.raw`On additionne les arguments : $-\pi/4+3\pi/4=\pi/2$. Donc $2e^{i\pi/2}=\boxed{2i}$.`),
  cs("2.",String.raw`$\frac{2e^{i\pi/4}}{3e^{3i\pi/4}}$.`,[0,-2/3],String.raw`On divise les modules et soustrait les arguments : $(2/3)e^{-i\pi/2}=\boxed{-2i/3}$.`),
  cs("3.",String.raw`$\frac{2e^{-i\pi/3}}{3e^{-5i\pi/6}}$.`,[0,2/3],String.raw`$-\pi/3-(-5\pi/6)=\pi/2$. Le quotient vaut $(2/3)e^{i\pi/2}=\boxed{2i/3}$.`)
 ]),
 ex(70,"La tangente et la forme trigonométrique",String.raw`On suppose $-\pi/2<\theta<\pi/2$. Dans cet intervalle $\cos\theta>0$. Écrire chaque nombre sous forme trigonométrique.`,[
  written("1.",String.raw`$\frac{\tan\theta-i}{\tan\theta+i}$.`,String.raw`En multipliant numérateur et dénominateur par $\cos\theta$, on obtient $(\sin\theta-i\cos\theta)/(\sin\theta+i\cos\theta)$. Les deux modules valent 1. Leurs arguments sont respectivement $\theta-\pi/2$ et $\pi/2-\theta$. Le quotient vaut donc $\boxed{\cos(2\theta-\pi)+i\sin(2\theta-\pi)}$. L’angle $2\theta+\pi$ convient aussi.`),
  written("2.",String.raw`$\frac1{1+i\tan\theta}$.`,String.raw`$1+i\tan\theta=e^{i\theta}/\cos\theta$. Son inverse est $\boxed{\cos\theta(\cos(-\theta)+i\sin(-\theta))}$. Ici $\cos\theta$ est bien un module positif.`),
  written("3.",String.raw`$e^{i\theta}+e^{2i\theta}$.`,String.raw`On factorise par $e^{3i\theta/2}$ :
$$e^{i\theta}+e^{2i\theta}=e^{3i\theta/2}(e^{-i\theta/2}+e^{i\theta/2})
=2\cos(\theta/2)e^{3i\theta/2}.$$
Le coefficient est positif. La forme demandée est $\boxed{2\cos(\theta/2)(\cos(3\theta/2)+i\sin(3\theta/2))}$.`),
  written("4.",String.raw`$\frac{1+i\tan\theta}{1-i\tan\theta}$.`,String.raw`On remplace chaque terme par sa forme exponentielle : $(e^{i\theta}/\cos\theta)/(e^{-i\theta}/\cos\theta)=e^{2i\theta}$. Donc $\boxed{\cos2\theta+i\sin2\theta}$.`)
 ]),
 ex(71,"Racines quatrièmes de 81","Déterminer les racines et les placer.",[
  written("1.","Résoudre et construire.",String.raw`$81=3^4e^{0i}$. Les quatre racines sont $3e^{ik\pi/2}$, $k=0,1,2,3$, soit $\boxed{3,3i,-3,-3i}$. Placer $(3;0),(0;3),(-3;0),(0;-3)$ : le carré obtenu est centré en O et inscrit dans le cercle de rayon 3.`)
 ],true),
 ex(72,"Réduire le degré avec z³",String.raw`Soit $n\ge2$. On étudie des racines n-ièmes puis l’équation $z^6+(7-i)z^3-8-8i=0$.`,[
  written("1.a","Racines n-ièmes de −i.",String.raw`$-i=e^{-i\pi/2}$. Les racines sont $\boxed{e^{i(-\pi/(2n)+2k\pi/n)},\ k=0,\ldots,n-1}$.`),
  written("1.b","Racines n-ièmes de 1+i.",String.raw`$1+i=\sqrt2e^{i\pi/4}$. Les racines sont $\boxed{2^{1/(2n)}e^{i(\pi/(4n)+2k\pi/n)},\ k=0,\ldots,n-1}$.`),
  cs("2.a",String.raw`Calculer $(9+i)^2$.`,[80,18],String.raw`$(9+i)^2=81+18i+i^2=\boxed{80+18i}$.`),
  written("2.b","Résoudre l’équation de degré 6.",String.raw`Posons $u=z^3$. L’équation devient $u^2+(7-i)u-8-8i=0$. Son discriminant est $(7-i)^2+32+32i=80+18i=(9+i)^2$. Ainsi $u=1+i$ ou $u=-8$.
Les six solutions sont les deux groupes :
$$\boxed{2^{1/6}e^{i(\pi/12+2k\pi/3)},\quad k=0,1,2,}$$
$$\boxed{2e^{i(\pi/3+2k\pi/3)},\quad k=0,1,2.}$$
Les groupes sont disjoints car leurs cubes sont différents.`)
 ],true),
 ex(73,"Puissance réelle positive",String.raw`Trouver les entiers naturels n tels que $(1+i\sqrt3)^n$ soit réel positif.`,[
  written("1.","Déterminer tous les entiers.",String.raw`$1+i\sqrt3=2e^{i\pi/3}$, donc la puissance vaut $2^ne^{in\pi/3}$. Son module est toujours strictement positif. Pour être réelle positive, son argument doit valoir $0$ modulo $2\pi$, pas seulement modulo $\pi$. Ainsi $n\pi/3=2k\pi$, donc $\boxed{n=6k,\ k\in\mathbb N}$. En particulier $n=0$ donne 1 et convient.`)
 ]),
 ex(74,"Cercle unité et quotient imaginaire",String.raw`Pour $z\ne1$, démontrer $|z|=1\iff(1+z)/(1-z)$ est imaginaire pur.`,[
  written("1.","Démontrer l’équivalence.",String.raw`On multiplie par $1-\bar z$, et $|1-z|^2>0$ :
$$\frac{1+z}{1-z}=\frac{(1+z)(1-\bar z)}{|1-z|^2}
=\frac{1-|z|^2+(z-\bar z)}{|1-z|^2}.$$
Le terme $z-\bar z$ est imaginaire pur ; la partie réelle du quotient est donc $(1-|z|^2)/|1-z|^2$. Elle est nulle exactement lorsque $|z|^2=1$, soit $\boxed{|z|=1}$. Le cas $z=-1$ donne le quotient nul, qui est bien imaginaire pur.`)
 ])
];
