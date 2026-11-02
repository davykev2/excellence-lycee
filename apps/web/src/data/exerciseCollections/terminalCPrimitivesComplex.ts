import type { ArenaExerciseItem } from "../../domain/arenaExercises";
import { short, choice, written } from "./builders";
import { primitiveExercise as ex } from "./terminalCPrimitivesBuilders";

export const primitivesComplex: ArenaExerciseItem[] = [
  ex(38, "Apprécier l’efficacité d’un bactéricide", String.raw`Lors d’une expérience, des élèves introduisent un bactéricide dans un milieu nutritif où une population de bactéries croît. La population continue d’augmenter pendant un certain temps, puis cesse de croître et commence à diminuer.

Le nombre de bactéries est modélisé par une fonction $f$ continue pour $t\ge0$, dérivable pour $t>0$, où $t$ est le temps en heures. On donne :

$$f'(t)=-10^3t^2+3\times10^3t+10^4,\qquad f(0)=10^3.$$

Selon l’expérience, le produit est jugé efficace si le maximum de la population après son introduction est **strictement inférieur à $46\,000$ bactéries**. Le modèle est utilisé seulement pendant la période où $f(t)\ge0$.

Propose à tes camarades une solution argumentée pour apprécier l’efficacité du bactéricide.`, [
    written("1", "Détermine la fonction f à partir de sa dérivée et de la population initiale.", String.raw`On primitive chaque terme de $f'$ :

$$f(t)=-\frac{1000}3t^3+1500t^2+10000t+C.$$

La continuité en $0$ permet d’utiliser la population initiale : $f(0)=C=1000$. **Ainsi :**

$$\boxed{f(t)=-\frac{1000}3t^3+1500t^2+10000t+1000.}$$

Sa dérivée est bien $-1000t^2+3000t+10000$ et sa valeur en $0$ vaut $1000$.`),
    short("2.a", "À quel instant t, en heures, la population atteint-elle son maximum ?", "$5$", ["5"], String.raw`On factorise $f'(t)=-1000(t^2-3t-10)=-1000(t-5)(t+2)$. Pour $t\ge0$, $t+2>0$ : la dérivée est positive avant $5$ et négative après $5$. **Le maximum est atteint à $t=5$ heures.**`),
    short("2.b", "Quelle est la valeur exacte de ce maximum dans le modèle ?", String.raw`$\dfrac{140500}3$`, ["140500/3"], String.raw`On remplace $t$ par $5$ :

$$f(5)=-\frac{125000}3+37500+50000+1000.$$

On met au même dénominateur : $f(5)=(-125000+265500)/3=140500/3$. **Cela représente environ $46\,833$ bactéries**, donc plus de $46\,000$.`),
    choice("3.a", "Le bactéricide est-il jugé efficace selon le critère donné ?", ["Oui", "Non"], 1, String.raw`**Non.** La différence exacte est $140500/3-46000=2500/3>0$. Le maximum dépasse donc le seuil ; il n’est pas strictement inférieur à $46\,000$.`),
    written("3.b", "Rédige la solution complète, avec les variations et une conclusion répondant au problème.", String.raw`### a) Retrouver la population

En primitivant $f'$, puis en utilisant $f(0)=1000$, on obtient :

$$f(t)=-\frac{1000}3t^3+1500t^2+10000t+1000.$$

### b) Étudier les variations

$$f'(t)=-1000(t-5)(t+2).$$

Pour $t\ge0$, $t+2$ est positif. Le facteur $-1000$ inverse le signe de $t-5$.

| Temps $t$ | $[0;5[$ | $5$ | $]5;\ldots[$ |
| --- | --- | --- | --- |
| Signe de $f'(t)$ | $+$ | $0$ | $-$ |
| Population | croissante | maximum | décroissante |

Le maximum est donc $f(5)=140500/3\approx46\,833{,}3$. L’instant $5$ appartient à la période où la population est positive.

### c) Apprécier l’efficacité

Comme $140500/3>46000$, **le bactéricide n’est pas jugé efficace selon le critère de l’expérience**.

Le polynôme est un modèle : on ne prolonge pas son interprétation à des temps où il annoncerait une population négative.`),
  ], { correctionFigureKey: "tc-l3-population" }),
];
