import { complexExercise as ex,complexShort as cs,complexExact,written,short,polarSolution } from "./terminalCComplexBuilders";
export const complexDeepeningA=[
 ex(55,"Points, vecteurs et milieu",String.raw`Dans un repère orthonormé direct, $E(-3+i)$, $F(2i)$, $G(-5/2)$ et $H(3/2-3i)$.`,[
  written("1.","Placer E,F,G,H.",String.raw`On lit les coordonnées : $E(-3;1)$, $F(0;2)$, $G(-5/2;0)$, $H(3/2;-3)$. Placer chaque abscisse sur l’axe horizontal puis chaque ordonnée verticalement. Le point G est sur l’axe réel.`),
  cs("2.a",String.raw`Affixe de $\overrightarrow{EF}$.`,[3,1],String.raw`$z_F-z_E=2i-(-3+i)=\boxed{3+i}$.`),
  cs("2.b",String.raw`Affixe de $\overrightarrow{FH}$.`,[1.5,-5],String.raw`$z_H-z_F=3/2-3i-2i=\boxed{3/2-5i}$.`),
  cs("2.c",String.raw`Affixe de $\overrightarrow{HE}$.`,[-4.5,4],String.raw`$z_E-z_H=-3+i-(3/2-3i)=\boxed{-9/2+4i}$.`),
  cs("2.d",String.raw`Affixe de $2\overrightarrow{FE}$.`,[-6,-2],String.raw`$2(z_E-z_F)=2(-3-i)=\boxed{-6-2i}$.`),
  cs("3.","Affixe du milieu I de [EF].",[-1.5,1.5],String.raw`$z_I=(z_E+z_F)/2=(-3+3i)/2=\boxed{-3/2+3i/2}$.`)
 ],true),
 ex(56,"Produits de formes trigonométriques",String.raw`On donne $a=2(\cos(\pi/4)+i\sin(\pi/4))$ et $b=3(\cos(\pi/12)+i\sin(\pi/12))$.`,[
  written("1.a",String.raw`Forme trigonométrique de $ab$.`,polarSolution("6",String.raw`\pi/3`)),
  written("1.b",String.raw`Forme trigonométrique de $ab^2$.`,String.raw`Module $2\times3^2=18$, argument $\pi/4+2\pi/12=5\pi/12$. Donc $\boxed{18(\cos(5\pi/12)+i\sin(5\pi/12))}$.`),
  written("1.c",String.raw`Forme trigonométrique de $a^2b$.`,String.raw`Module $2^2\times3=12$, argument $2\pi/4+\pi/12=7\pi/12$. Donc $\boxed{12(\cos(7\pi/12)+i\sin(7\pi/12))}$.`),
  written("1.d",String.raw`Forme trigonométrique de $b/a^2$.`,String.raw`Module $3/4$, argument $\pi/12-2\pi/4=-5\pi/12$. Donc $\boxed{\frac34(\cos(-5\pi/12)+i\sin(-5\pi/12))}$.`),
  complexExact("2.a","Forme algébrique de $ab$.",String.raw`3+3i\sqrt3`,"3+3i*sqrt3",String.raw`$ab=6(\cos(\pi/3)+i\sin(\pi/3))=6(1/2+i\sqrt3/2)=\boxed{3+3i\sqrt3}$.`),
  complexExact("2.b","Forme algébrique de $a/b$.",String.raw`\frac{\sqrt3}3+\frac i3`,"sqrt3/3+i/3",String.raw`$|a/b|=2/3$ et un argument est $\pi/4-\pi/12=\pi/6$. D’où $(2/3)(\sqrt3/2+i/2)=\boxed{\sqrt3/3+i/3}$.`)
 ]),
 ex(57,"Les valeurs de π/12",String.raw`On donne $u=1+i$, $v=\sqrt3-i$.`,[
  written("1.a","Module et argument de u.",String.raw`$|u|=\sqrt2$. Les parties réelle et imaginaire sont égales et positives : un argument est $\boxed{\pi/4}$.`),
  written("1.b","Module et argument de v.",String.raw`$|v|=\sqrt{3+1}=2$. Les coordonnées réduites sont $\sqrt3/2$ et $-1/2$ : un argument est $\boxed{-\pi/6}$.`),
  written("2.a","Formes algébrique et trigonométrique de uv.",String.raw`On développe :
$$uv=(1+i)(\sqrt3-i)=(\sqrt3+1)+i(\sqrt3-1).$$
Le module du produit est $2\sqrt2$ et son argument $\pi/4-\pi/6=\pi/12$. Donc $uv=2\sqrt2(\cos(\pi/12)+i\sin(\pi/12))$.`),
  written("2.b",String.raw`En déduire $\cos(\pi/12)$ et $\sin(\pi/12)$.`,String.raw`Par égalité des parties réelles et imaginaires :
$$\cos(\pi/12)=\frac{\sqrt3+1}{2\sqrt2}=\boxed{\frac{\sqrt6+\sqrt2}4},$$
$$\sin(\pi/12)=\frac{\sqrt3-1}{2\sqrt2}=\boxed{\frac{\sqrt6-\sqrt2}4}.$$
On a rationalisé en multipliant numérateur et dénominateur par $\sqrt2$.`)
 ]),
 ex(58,"Développer des angles multiples",String.raw`Exprimer les trois expressions en fonction de $\cos x$ et $\sin x$. On pourra prendre les parties réelle ou imaginaire de $(\cos x+i\sin x)^n$.`,[
  written("a.",String.raw`$\cos4x$.`,String.raw`Le développement donne $c^4-6c^2s^2+s^4$, où $c=\cos x$, $s=\sin x$. En remplaçant $s^2=1-c^2$, on obtient $\boxed{8c^4-8c^2+1}$.`),
  written("b.",String.raw`$\cos5x+\cos6x$.`,String.raw`Les développements donnent $\cos5x=c^5-10c^3s^2+5cs^4=16c^5-20c^3+5c$, puis $\cos6x=c^6-15c^4s^2+15c^2s^4-s^6=32c^6-48c^4+18c^2-1$. Ainsi :
$$\boxed{32c^6+16c^5-48c^4-20c^3+18c^2+5c-1.}$$`),
  written("c.",String.raw`$\sin x-\sin2x+\sin3x-\sin4x$.`,String.raw`On remplace $\sin2x=2sc$, $\sin3x=s(4c^2-1)$ et $\sin4x=4sc(2c^2-1)$. En regroupant les quatre termes :
$$s-2sc+4sc^2-s-8sc^3+4sc=\boxed{s(-8c^3+4c^2+2c).}$$`)
 ]),
 ex(59,"Linéarisation et racines carrées","Traiter les deux parties.",[
  written("1.a",String.raw`Linéariser $\cos^4x$.`,String.raw`$\cos^4x=((1+\cos2x)/2)^2$. Après développement puis réduction de $\cos^2(2x)$ :
$$\boxed{\cos^4x=(3+4\cos2x+\cos4x)/8.}$$`),
  written("1.b",String.raw`Linéariser $\cos^2x\sin^3x$.`,String.raw`Écrivons $\cos^2x\sin^3x=\sin^3x-\sin^5x$. Remplaçons $\sin^3x=(3\sin x-\sin3x)/4$ et $\sin^5x=(10\sin x-5\sin3x+\sin5x)/16$. La différence vaut :
$$\boxed{(2\sin x+\sin3x-\sin5x)/16.}$$`),
  written("1.c",String.raw`Linéariser $\cos^5x-\sin^4x$.`,String.raw`Par Euler, $\cos^5x=(10\cos x+5\cos3x+\cos5x)/16$ et $\sin^4x=(3-4\cos2x+\cos4x)/8$. Soustraire en mettant au dénominateur 16 donne :
$$\boxed{\frac{10\cos x+8\cos2x+5\cos3x-2\cos4x+\cos5x-6}{16}.}$$`),
  ...[["2i","1+i"],["3+4i","2+i"],["8+6i","3+i"],["5-12i","3-2i"],["-7+24i","3+4i"]].map(([z,d],i)=>written("2."+String.fromCharCode(97+i),"Racines carrées de $"+z+"$.",String.raw`Pour une racine $x+iy$, on utilise $x^2-y^2=\operatorname{Re}(z)$, $2xy=\operatorname{Im}(z)$ et $x^2+y^2=|z|$. On obtient $${d}$ ; son carré se vérifie en développant. Les deux racines sont donc $\boxed{${d}\ \text{et}\ -(${d})}$.`))
 ]),
 ex(60,"Équation paramétrée et triangle",String.raw`$\theta\in[0;\pi[$. Résoudre $z^2-(2^{\theta+1}\cos\theta)z+2^{2\theta}=0$. Les solutions sont les affixes de A et B.`,[
  written("1.","Donner les solutions sous forme trigonométrique.",String.raw`Posons $r=2^\theta>0$. L’équation devient $z^2-2r\cos\theta\,z+r^2=0$. Son discriminant est $-4r^2\sin^2\theta$ ; une racine carrée est $2ir\sin\theta$. Ainsi :
$$\boxed{z_A=2^\theta(\cos\theta+i\sin\theta),\quad z_B=2^\theta(\cos\theta-i\sin\theta).}$$
Pour $\theta=0$, les deux solutions sont confondues.`),
  written("2.","Déterminer θ pour que OAB soit équilatéral.",String.raw`On a déjà $OA=OB=r$. De plus $AB=|2ir\sin\theta|=2r\sin\theta$, car $\sin\theta\ge0$ sur l’intervalle. Il faut donc $2r\sin\theta=r$, soit $\sin\theta=1/2$. Ainsi $\boxed{\theta=\pi/6\ \text{ou}\ 5\pi/6}$. Dans ces deux cas, les trois sommets sont distincts.`)
 ],true),
 ex(61,"Un cube et un triangle",String.raw`Résoudre $P(z)=z^3-z^2-(1+i)z-2+2i=0$, sachant qu’il existe une solution réelle. Puis étudier le triangle formé par les trois racines.`,[
  written("1.a","Trouver la racine réelle.",String.raw`Pour $x$ réel, $\operatorname{Im}P(x)=-x+2$. Il faut $x=2$ ; la partie réelle vaut alors $8-4-2-2=0$. Donc 2 est bien une racine.`),
  written("1.b","Résoudre entièrement.",String.raw`La division donne $P(z)=(z-2)(z^2+z+1-i)$. Le discriminant du second facteur vaut $-3+4i=(1+2i)^2$. Ses racines sont $(-1\pm(1+2i))/2$, soit $i$ et $-1-i$. Donc $\boxed{S=\{2,i,-1-i\}}$.`),
  written("2.a","Placer A(2), B(i), C(−1−i).",String.raw`Les coordonnées sont $A(2;0)$, $B(0;1)$ et $C(-1;-1)$. Utiliser les mêmes unités sur les deux axes.`),
  written("2.b","Montrer que le triangle est rectangle isocèle.",String.raw`$BA=|2-i|=\sqrt5$, $BC=|-1-2i|=\sqrt5$, et $AC=|-3-i|=\sqrt{10}$. Donc $BA=BC$ et $AC^2=BA^2+BC^2$. Par la réciproque de Pythagore, ABC est $\boxed{\text{rectangle isocèle en B}}$.`)
 ],true),
 ex(62,"Une équation bicarrée et un losange",String.raw`On considère $z^4-3z^2-4=0$.`,[
  written("1.","Vérifier la factorisation.",String.raw`$(z^2+1)(z^2-4)=z^4-4z^2+z^2-4=\boxed{z^4-3z^2-4}$.`),
  written("2.","Résoudre dans ℂ.",String.raw`Le produit nul donne $z^2=-1$ ou $z^2=4$. Donc $\boxed{S=\{i,-i,2,-2\}}$.`),
  written("3.","Placer les quatre points.",String.raw`Choisissons l’ordre autour de O : $A(2;0)$, $B(0;1)$, $C(-2;0)$, $D(0;-1)$. Cet ordre est important pour nommer le quadrilatère sans croiser ses côtés.`),
  written("4.","Montrer que ces points forment un losange.",String.raw`Les quatre côtés ont pour longueur $\sqrt{2^2+1^2}=\sqrt5$. De plus les diagonales ont O pour milieu. Le quadrilatère ABCD est donc un parallélogramme à quatre côtés égaux : un losange. Il n’est pas carré, car $AC=4$ et $BD=2$.`)
 ],true),
 ex(63,"Chercher une racine imaginaire pure",String.raw`Résoudre $z^3+(1-5i)z^2-2(5+i)z+8i=0$, sachant qu’une solution est imaginaire pure.`,[
  written("1.","Déterminer cette racine.",String.raw`Posons $z=it$, $t$ réel. La partie réelle du polynôme est $-t^2+2t=t(2-t)$ et la partie imaginaire $-t^3+5t^2-10t+8$. Il faut donc $t=0$ ou $t=2$. Seul $t=2$ annule aussi la partie imaginaire. La racine cherchée est $2i$.`),
  written("2.","Factoriser puis terminer.",String.raw`Le polynôme vaut $(z-2i)(z^2+(1-3i)z-4)$. Pour le second facteur, $\Delta=8-6i=(3-i)^2$. Les racines sont $(-1+3i\pm(3-i))/2$, soit $1+i$ et $-2+2i$. Ainsi $\boxed{S=\{2i,1+i,-2+2i\}}$.`)
 ]),
 ex(64,"Transporter les racines cubiques","Traiter les trois questions.",[
  written("1.","Déterminer les racines cubiques de 1.",String.raw`Ce sont $\boxed{1,j,j^2}$, avec $j=-1/2+i\sqrt3/2$. Elles vérifient $j^3=1$.`),
  cs("2.",String.raw`Calculer $(2-i)^3$.`,[2,-11],String.raw`$(2-i)^2=3-4i$, puis $(3-4i)(2-i)=6-3i-8i+4i^2=\boxed{2-11i}$.`),
  written("3.","En déduire les racines cubiques de 2−11i.",String.raw`Comme $(2-i)^3=2-11i\ne0$, toute racine s’écrit $(2-i)u$ avec $u^3=1$. Les trois racines sont :
$$\boxed{2-i,\quad(2-i)j,\quad(2-i)j^2.}$$
Multiplier chacune par le cube de $j$ ne change pas son cube ; ces trois nombres sont distincts.`)
 ])
];
