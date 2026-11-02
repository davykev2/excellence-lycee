import { complexExercise as ex,complexShort as cs,short,written,choice,tf,coordinateQuestions } from "./terminalCComplexBuilders";
export const complexFixationB=[
 ex(19,"Distances et lieux géométriques",String.raw`Dans le plan complexe orthonormé direct, $A(1)$, $B(i)$, $C(-1)$ et $D(-i)$. Choisir la réponse exacte.`,[
  choice("1.",String.raw`L’ensemble défini par $|z+i|=|z-1|$ est :`,["La médiatrice de [BD]","Le cercle de centre O et de rayon 1","La médiatrice de [AD]"],2,String.raw`$|z+i|=MD$ et $|z-1|=MA$. La condition est donc $MD=MA$ : c’est la médiatrice de $[AD]$. En coordonnées, $x^2+(y+1)^2=(x-1)^2+y^2$, donc $y=-x$.`),
  choice("2.",String.raw`L’ensemble défini par $\frac{z+i}{z+1}$ imaginaire pur est :`,["Le cercle de diamètre [BD] privé de C","Le cercle de diamètre [CD] privé de C","La médiatrice de [AB]"],1,String.raw`Il faut d’abord $z\ne-1$, donc $M\ne C$. Pour $z=x+iy$, multiplier par $\bar z+1$ donne une partie réelle de numérateur $x(x+1)+y(y+1)$. Elle s’annule si $(x+\frac12)^2+(y+\frac12)^2=\frac12$. C’est le cercle de diamètre $[CD]$, privé de $C$. Le point $D$ est bien admis : le quotient vaut alors 0.`)
 ],true),
 ex(20,"Calculer des modules","Déterminer chaque module.",[
  short("1.",String.raw`$|3+4i|$.`,"5",["5"],String.raw`$|3+4i|=\sqrt{3^2+4^2}=\sqrt{25}=\boxed5$.`),
  short("2.",String.raw`$|6-8i|$.`,"10",["10"],String.raw`$|6-8i|=\sqrt{6^2+(-8)^2}=\sqrt{100}=\boxed{10}$.`),
  short("3.",String.raw`$|\sqrt2+i\sqrt7|$.`,"3",["3"],String.raw`$|\sqrt2+i\sqrt7|=\sqrt{(\sqrt2)^2+(\sqrt7)^2}=\sqrt9=\boxed3$.`)
 ]),
 ex(21,"Même module",String.raw`Un élève affirme : $|z|=|z'|\iff z=z'$ ou $z=-z'$. Donner un avis argumenté.`,[
  written("1.","Examiner les deux implications.",String.raw`L’implication de droite à gauche est vraie : $z=z'$ ou $z=-z'$ entraîne $|z|=|z'|$. Mais la réciproque est fausse : prenons $z=1$ et $z'=i$. Les modules valent 1, alors que $1\ne i$ et $1\ne-i$. L’équivalence proposée est donc fausse. Géométriquement, tous les points d’un même cercle centré en O ont le même module.`)
 ]),
 ex(22,"Modules de deux conjugués",String.raw`Justifier que $1+i$ et $1-i$ ont le même module.`,[
  written("1.","Justifier.",String.raw`Ces nombres sont conjugués. On peut vérifier directement : $|1+i|=\sqrt{1^2+1^2}=\sqrt2$ et $|1-i|=\sqrt{1^2+(-1)^2}=\sqrt2$. Les deux modules sont donc égaux.`)
 ]),
 ex(23,"Opérations sur les modules",String.raw`On suppose $|z|=2$ et $|z'|=3$. Calculer les cinq modules.`,[
  short("1.",String.raw`$|\bar z|$.`,"2",["2"],String.raw`Un nombre et son conjugué ont le même module : $|\bar z|=|z|=\boxed2$.`),
  short("2.",String.raw`$|-\bar z|$.`,"2",["2"],String.raw`$|-\bar z|=|-1|\,|\bar z|=1\times2=\boxed2$.`),
  short("3.",String.raw`$|zz'|$.`,"6",["6"],String.raw`$|zz'|=|z|\,|z'|=2\times3=\boxed6$.`),
  short("4.",String.raw`$|1/z|$.`,"1/2",["1/2"],String.raw`$|z|=2\ne0$, donc $z\ne0$. Ainsi $|1/z|=1/|z|=\boxed{1/2}$.`),
  short("5.",String.raw`$|z/z'|$.`,"2/3",["2/3"],String.raw`$z'\ne0$ et $|z/z'|=|z|/|z'|=\boxed{2/3}$.`)
 ]),
 ex(24,"Affixes de points et d’un vecteur",String.raw`Dans un repère orthonormé direct, $A(-7;5)$, $B(0;3)$ et $\vec w(-3;9)$. Déterminer leurs affixes.`,[
  cs("1.","Affixe de A.",[-7,5],String.raw`On utilise $z=x+iy$. Donc $z_A=\boxed{-7+5i}$.`),
  cs("2.","Affixe de B.",[0,3],String.raw`La première coordonnée est nulle et la seconde vaut 3. Donc $z_B=0+3i=\boxed{3i}$.`),
  cs("3.",String.raw`Affixe de $\vec w$.`,[-3,9],String.raw`La même règle s’applique aux vecteurs : $z_{\vec w}=\boxed{-3+9i}$.`)
 ],true),
 ex(25,"Du nombre aux coordonnées","Déterminer les coordonnées des points ou vecteurs images.",[
  ...coordinateQuestions("1.","Point image de $1+i$.",[1,1]),
  ...coordinateQuestions("2.","Point image de $-3i$.",[0,-3]),
  ...coordinateQuestions("3.","Vecteur image de $7$.",[7,0]),
  ...coordinateQuestions("4.","Vecteur image de $1+i$.",[1,1])
 ],true),
 ex(26,"Affixes des vecteurs",String.raw`On donne $A(1;1)$, $B(-2;3)$, $C(4;3)$. Déterminer les affixes demandées.`,[
  cs("1.",String.raw`$\overrightarrow{AB}$.`,[-3,2],String.raw`$z_{\overrightarrow{AB}}=z_B-z_A=(-2+3i)-(1+i)=\boxed{-3+2i}$.`),
  cs("2.",String.raw`$\overrightarrow{BC}$.`,[6,0],String.raw`$z_C-z_B=(4+3i)-(-2+3i)=\boxed6$.`),
  cs("3.",String.raw`$\overrightarrow{AC}$.`,[3,2],String.raw`$z_C-z_A=(4+3i)-(1+i)=\boxed{3+2i}$.`)
 ],true),
 ex(27,"Retrouver un point",String.raw`$A(-4;3)$ et $\overrightarrow{AB}$ a pour affixe $1+i$. Déterminer les coordonnées de B.`,[
  ...coordinateQuestions("1.","Coordonnées de B.",[-3,4]),
  written("2.","Justifier les coordonnées.",String.raw`$z_B-z_A=1+i$, donc $z_B=(-4+3i)+(1+i)=-3+4i$. Ainsi $\boxed{B(-3;4)}$.`)
 ],true),
 ex(28,"Unicité de l’affixe","Indiquer Vrai ou Faux et lire la justification.",[
  tf("1.","Deux nombres complexes ayant le même point image sont égaux.",true,"Un même point possède un unique couple de coordonnées ; ces coordonnées sont les parties réelle et imaginaire."),
  tf("2.","Deux vecteurs ayant la même affixe sont égaux.",true,"Ils ont les mêmes coordonnées, donc même direction, même sens et même norme."),
  tf("3.","Deux vecteurs opposés ont la même affixe.",false,String.raw`Leurs affixes sont opposées : $z_{-\vec u}=-z_{\vec u}$. Elles ne sont égales que pour le vecteur nul.`)
 ]),
 ex(29,"Milieu, somme et distance",String.raw`$P(1;-1)$, $Q(4;5)$, $\vec w(1;-2)$, $\vec v(3;4)$.`,[
  cs("1.","Affixe du milieu I de [PQ].",[2.5,2],String.raw`$z_I=(z_P+z_Q)/2=((1-i)+(4+5i))/2=\boxed{5/2+2i}$.`),
  cs("2.",String.raw`Affixe de $\vec w+\vec v$.`,[4,2],String.raw`On additionne les affixes : $(1-2i)+(3+4i)=\boxed{4+2i}$.`),
  short("3.","Distance PQ.",String.raw`$3\sqrt5$`,["3sqrt5","sqrt45"],String.raw`$PQ=|z_Q-z_P|=|3+6i|=\sqrt{9+36}=\boxed{3\sqrt5}$.`)
 ],true),
 ex(30,"Combinaisons de vecteurs",String.raw`$\vec w$ et $\vec v$ ont pour affixes $2+3i$ et $4-5i$.`,[
  cs("1.",String.raw`Affixe de $3\vec w$.`,[6,9],String.raw`On multiplie les deux coordonnées du vecteur par 3 : $3(2+3i)=\boxed{6+9i}$.`),
  cs("2.",String.raw`Affixe de $2\vec w-3\vec v$.`,[-8,21],String.raw`$2(2+3i)-3(4-5i)=4+6i-12+15i=\boxed{-8+21i}$.`)
 ]),
 ex(31,"Argument principal",String.raw`Déterminer l’argument principal, choisi dans $]-\pi;\pi]$, de chaque nombre.`,[
  ...[["1","0"],["i","pi/2"],["-i","-pi/2"],["-1","pi"],[String.raw`\frac12+i\frac{\sqrt3}2`,"pi/3"]].map(([z,a],i)=>short(String(i+1),"$"+z+"$.","$"+a.replace(/pi/g,String.raw`\pi`)+"$",[a],String.raw`On repère le point sur le cercle trigonométrique. Son angle dans $]-\pi;\pi]$ est $\boxed{${a.replace(/pi/g,String.raw`\pi`)}}$. Pour le point $-1$, on retient $\pi$, pas $-\pi$.`))
 ],true),
 ex(32,"Ce que détermine un argument","Indiquer Vrai ou Faux.",[
  tf("a.",String.raw`Un complexe non nul est déterminé par son module et son argument principal.`,true,String.raw`Ces données donnent $z=r(\cos\theta+i\sin\theta)$, donc les deux coordonnées.`),
  tf("b.","Deux complexes non nuls de même argument sont égaux.",false,String.raw`$1$ et $2$ ont le même argument 0 mais ne sont pas égaux : leurs modules diffèrent.`)
 ]),
 ex(33,"Module et argument","Déterminer le module et un argument de chaque nombre.",[
  written("1.",String.raw`$1+i\sqrt3$.`,String.raw`$r=\sqrt{1+3}=2$. Puis $\cos\theta=1/2$ et $\sin\theta=\sqrt3/2$ ; un argument est donc $\boxed{\pi/3}$, et le module vaut $\boxed2$.`),
  written("2.",String.raw`$\sqrt3-3i$.`,String.raw`$r=\sqrt{3+9}=2\sqrt3$. On divise les deux parties par ce module : $\cos\theta=1/2$, $\sin\theta=-\sqrt3/2$. Donc $\boxed{\theta=-\pi/3}$ convient et $\boxed{r=2\sqrt3}$.`),
  written("3.",String.raw`$-\sqrt2-i\sqrt6$.`,String.raw`$r=\sqrt{2+6}=2\sqrt2$. Les coordonnées réduites sont $-1/2$ et $-\sqrt3/2$. Un argument est donc $\boxed{-2\pi/3}$ ; le module est $\boxed{2\sqrt2}$.`)
 ],true),
 ex(34,"Écrire une forme trigonométrique","Écrire chaque nombre sous forme trigonométrique.",[
  written("1.",String.raw`$1-i$.`,String.raw`$r=\sqrt2$, $\cos\theta=1/\sqrt2$, $\sin\theta=-1/\sqrt2$, donc $\theta=-\pi/4$ convient. Ainsi $\boxed{\sqrt2(\cos(-\pi/4)+i\sin(-\pi/4))}$.`),
  written("2.",String.raw`$\sqrt3-3i$.`,String.raw`Le module est $2\sqrt3$ et un argument est $-\pi/3$. Donc $\boxed{2\sqrt3(\cos(-\pi/3)+i\sin(-\pi/3))}$.`),
  written("3.",String.raw`$-\sqrt2+i\sqrt6$.`,String.raw`Le module est $2\sqrt2$. Les coordonnées réduites sont $-1/2$ et $\sqrt3/2$, donc l’angle est $2\pi/3$. Ainsi $\boxed{2\sqrt2(\cos(2\pi/3)+i\sin(2\pi/3))}$.`)
 ]),
 ex(35,"Arguments d’opérations",String.raw`On suppose $\operatorname{ARG}(z)=\pi/4$ et $\operatorname{ARG}(z')=-\pi/3$. Donner un argument des six expressions.`,[
  ...[[String.raw`zz'`,String.raw`\pi/4-\pi/3=-\pi/12`],
   ["1/z",String.raw`-\pi/4`],["z'/z",String.raw`-\pi/3-\pi/4=-7\pi/12`],
   ["z/z'",String.raw`\pi/4+\pi/3=7\pi/12`],["z^2",String.raw`2(\pi/4)=\pi/2`],
   ["z^2/z'",String.raw`2(\pi/4)+\pi/3=5\pi/6`]].map(([s,a],i)=>written(String(i+1),"$"+s+"$.",String.raw`Pour un produit, on additionne les arguments ; pour un quotient, on les soustrait ; pour une puissance, on multiplie l’argument par l’exposant. On obtient ici : $$\boxed{${a}.}$$ Tout angle obtenu en ajoutant $2k\pi$ convient aussi.`))
 ])
];
