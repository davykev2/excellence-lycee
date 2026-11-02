import { complexExercise as ex,written } from "./terminalCComplexBuilders";
export const complexSituations=[
 ex(79,"Départager deux propositions",String.raw`Lors d’un jeu-concours de mathématiques, on demande de caractériser les points M d’affixe z tels que
$$\arg\left(\frac{z-2i}{z-1+i}\right)=\frac\pi2+2k\pi,\qquad k\in\mathbb Z.$$
Deux amis proposent respectivement une droite et un cercle. Départager leurs réponses par une argumentation mathématique complète.`,[
  written("1.","Préciser le domaine et traduire la condition.",String.raw`L’argument existe seulement si $z\ne2i$ et $z\ne1-i$. Un argument $\pi/2$ modulo $2\pi$ signifie que le quotient est **imaginaire pur de partie imaginaire strictement positive**. Le signe distingue une demi-circonférence du cercle complet.`),
  written("2.","Déterminer l’équation du cercle support.",String.raw`Posons $z=x+iy$. En multipliant par le conjugué du dénominateur, le dénominateur vaut $(x-1)^2+(y+1)^2>0$. La partie réelle du numérateur est $x(x-1)+(y-2)(y+1)=x^2+y^2-x-y-2$. Elle s’annule si :
$$\boxed{(x-\tfrac12)^2+(y-\tfrac12)^2=\tfrac52.}$$
C’est le cercle de diamètre $[AB]$, avec $A(0;2)$ et $B(1;-1)$, de centre $(1/2;1/2)$ et de rayon $\sqrt{10}/2$.`),
  written("3.","Tenir compte du signe et conclure.",String.raw`La partie imaginaire du numérateur est $(y-2)(x-1)-x(y+1)=2-3x-y$. Elle doit être strictement positive. Le lieu exact est donc :
$$\boxed{(x-\tfrac12)^2+(y-\tfrac12)^2=\tfrac52,\quad3x+y<2.}$$
Il s’agit du **demi-cercle ouvert** situé du côté $3x+y<2$ de la droite (AB). Les extrémités A et B sont exclues. La réponse « droite » est fausse ; « cercle » n’est correcte que pour le support, pas pour l’ensemble complet demandé.`)
 ],true),
 ex(80,"Construire un hexagone régulier",String.raw`Un jeu-concours propose de construire un hexagone régulier de rayon quelconque et de justifier la construction par les nombres complexes. La piste proposée est de tracer un cercle de centre O, choisir un sommet A, puis reporter le rayon sur le cercle pour obtenir les cinq autres sommets. Présenter une solution argumentée.`,[
  written("1.","Traduire les six sommets en nombres complexes.",String.raw`Choisissons O pour origine et un rayon $R>0$. Si $z_A=Re^{i\theta}$, définissons :
$$\boxed{z_k=Re^{i(\theta+k\pi/3)},\quad k=0,\ldots,5.}$$
Les six modules valent R ; les points sont sur le cercle. Les angles successifs au centre valent $\pi/3=60^\circ$. Les six points sont distincts et le sixième pas revient au premier.`),
  written("2.","Justifier que l’ouverture du compas vaut le rayon.",String.raw`La longueur entre deux sommets successifs vaut :
$$|z_{k+1}-z_k|=R|e^{i\pi/3}-1|
=R|-\tfrac12+i\tfrac{\sqrt3}2|=R.$$
Les six côtés sont donc égaux au rayon. Les rotations successives de $60^\circ$ donnent également six angles égaux : le polygone est un **hexagone régulier**.`),
  written("3.","Décrire la construction pratique.",String.raw`Tracer le cercle, choisir A sur celui-ci et garder l’ouverture du compas égale à R. À chaque étape, tracer l’arc centré au dernier sommet ; prendre l’intersection suivante dans le même sens de parcours, sans revenir au sommet précédent. Après six reports, on revient à A. Relier les six sommets dans l’ordre. Le choix du sens direct ou indirect donne le même hexagone parcouru en sens inverse.`)
 ],true)
];
