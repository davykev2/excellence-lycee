import { short, written } from "./builders";
import { derivativeExercise as ex } from "./terminalCDerivativesBuilders";
const r = String.raw;

export const derivativesComplex = [
  ex(48, "Collecter l’eau de pluie avec le moins de tuyaux", r`Un proviseur veut installer un dispositif de collecte des eaux de pluie sur le mur rectangulaire d’une classe. Deux tuyaux obliques récupèrent l’eau et la déversent dans un tuyau vertical aboutissant à un réservoir.

Sur le plan, $ABCD$ représente le mur. Les segments $[AM]$, $[MB]$ et $[MH]$ sont les tuyaux ; $H$ est le réservoir. La droite $(MH)$ est la médiatrice de $[DC]$ et $M$ se trouve à l’intérieur du mur. On donne $AB=10$ et $BC=6$, dans la même unité de longueur.

$Q$ est le projeté orthogonal de $M$ sur $(BC)$. On note $\theta=\widehat{BMQ}$, en radians. Comme $M$ est à l’intérieur du mur, $0<\theta<\arctan(6/5)$.

**Détermine la valeur exacte de $\theta$ qui minimise la longueur totale des tuyaux, en justifiant ta démarche.**

Indication : on pourra établir que $L(\theta)=6+(10-5\sin\theta)/\cos\theta$.`, [
    written("1.", "Exprime la longueur totale en fonction de θ.", r`**a) Les longueurs dans le triangle rectangle $MQB$.**

Comme $(MH)$ est la médiatrice de $[DC]$, le point $M$ est à mi-largeur du rectangle. Ainsi $MQ=AB/2=5$ et $AM=BM$.

Dans le triangle rectangle $MQB$ :

$$\cos\theta=\frac{MQ}{MB}=\frac5{MB},\qquad \tan\theta=\frac{BQ}{MQ}=\frac{BQ}5.$$

Donc $MB=5/\cos\theta$ et $BQ=5\tan\theta$.

**b) Le tuyau vertical.**

Les points $M$ et $Q$ sont à la même hauteur. Par conséquent :

$$MH=QC=BC-BQ=6-5\tan\theta.$$

**c) La somme des trois tuyaux.**

$$L(\theta)=AM+BM+MH=\frac{10}{\cos\theta}+6-5\tan\theta.$$

En mettant les deux termes trigonométriques au même dénominateur :

$$\boxed{L(\theta)=6+\frac{10-5\sin\theta}{\cos\theta}.}$$`),
    written("2.", "Calcule la dérivée et étudie son signe.", r`Sur l’intervalle admissible, $\cos\theta>0$. Appliquons la règle du quotient au terme qui dépend de $\theta$ :

$$L'(\theta)=\frac{(-5\cos\theta)\cos\theta+(10-5\sin\theta)\sin\theta}{\cos^2\theta}.$$

On développe le numérateur et on utilise $\sin^2\theta+\cos^2\theta=1$ :

$$-5\cos^2\theta+10\sin\theta-5\sin^2\theta=10\sin\theta-5.$$

Ainsi $L'(\theta)=5(2\sin\theta-1)/\cos^2\theta$.

Sur $]0;\pi/2[$, le sinus est strictement croissant. La dérivée est donc négative avant $\pi/6$, nulle en $\pi/6$ et positive après.

Cet angle est bien admissible : $\tan(\pi/6)=1/\sqrt3<6/5$. **La longueur décroît puis croît : elle atteint son minimum pour $\theta=\pi/6$.**`),
    short("3.", "Saisis l’angle optimal en radians.", "$\\pi/6$", ["pi/6", "π/6"], r`Le changement de signe de $L'$ donne **$\boxed{\theta=\pi/6}$**, soit $30^\circ$. Un angle en radians est attendu dans le champ.`),
    written("4.", "Donne la position de M et la longueur minimale.", r`On remplace maintenant $\theta$ par $\pi/6$ :

$$MH=6-5\tan(\pi/6)=\boxed{6-\frac5{\sqrt3}}.$$

La hauteur est comprise entre $0$ et $6$ : le point $M$ est bien à l’intérieur du mur.

Comme $\sin(\pi/6)=1/2$ et $\cos(\pi/6)=\sqrt3/2$ :

$$L_{\min}=6+\frac{10-5/2}{\sqrt3/2}=6+\frac{15}{\sqrt3}.$$

**Il faut donc placer $M$ à la hauteur $6-5/\sqrt3$ au-dessus de $H$. La longueur minimale est $6+5\sqrt3$, soit environ $14{,}66$ unités de longueur.**`),
  ], { figureKey: "tc-l2-water-wall" }),
  ex(49, "Optimiser la production de parapluies", r`Pendant les vacances, tu travailles dans une entreprise de fabrication de parapluies en zone industrielle à Abidjan. Elle produit chaque jour $x$ parapluies, avec $x\in[0;60]$.

Dans le modèle proposé, le coût total, en **milliers de francs CFA**, est $C(x)=x^2-81x$. Chaque parapluie est vendu $3\,000$ francs CFA et toute la production est vendue le même jour.

**Quelle quantité l’entreprise doit-elle fabriquer pour maximiser le bénéfice donné par ce modèle ? Donne une solution argumentée.**

On rappelle que le bénéfice est la recette diminuée du coût de production.`, [
    written("1.", "Exprime la recette puis le bénéfice dans une même unité.", r`Le coût est en milliers de francs CFA. Il faut donc écrire le prix unitaire dans la même unité : $3\,000$ francs CFA correspondent à $3$ milliers.

Pour $x$ parapluies, la recette vaut $R(x)=3x$ milliers de francs CFA. Le bénéfice est :

$$B(x)=R(x)-C(x)=3x-(x^2-81x).$$

On distribue le signe moins : **$\boxed{B(x)=84x-x^2}$.**`),
    written("2.", "Étudie les variations du bénéfice sur [0 ; 60].", r`La fonction $B$ est un polynôme, dérivable sur $[0;60]$. Sa dérivée vaut :

$$B'(x)=84-2x=2(42-x).$$

Elle est positive pour $0\le x<42$, nulle en $42$ et négative pour $42<x\le60$.

| $x$ | $0$ | | $42$ | | $60$ |
| --- | --- | --- | --- | --- | --- |
| $B'(x)$ | | $+$ | $0$ | $-$ | |
| $B(x)$ | $0$ | $\nearrow$ | $1\,764$ | $\searrow$ | $1\,440$ |

**Le bénéfice augmente jusqu’à $42$, puis diminue. Son maximum est donc atteint en $42$.**`),
    short("3.", "Combien de parapluies faut-il fabriquer par jour ?", "$42$", ["42"], r`Le maximum sur l’intervalle réel est atteint en $x=42$. Ce nombre est entier et appartient à $[0;60]$ : il convient donc aussi pour une quantité de parapluies. **La réponse du modèle est $\boxed{42\text{ parapluies par jour}}$.**`),
    written("4.", "Vérifie le résultat et précise la portée du modèle.", r`Une seconde vérification consiste à compléter le carré :

$$B(x)=1\,764-(x-42)^2\le1\,764.$$

L’égalité a lieu exactement pour $x=42$.

**Pour interpréter un modèle, on vérifie aussi ses données.** Ici $C(x)=x(x-81)$ est négatif pour $0<x\le60$ : cette expression ne peut pas représenter telle quelle un coût réel de production. Le calcul établit bien le maximum de la fonction donnée, mais il faut un modèle de coût valide avant d’utiliser ce montant pour une décision économique.`),
  ]),
];
