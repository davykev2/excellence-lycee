import { divExercise as ex,written as w } from "./terminalCDivisibilityBuilders";
export const divisibilityComplex=[
  ex(59,"La boîte d’allumettes",String.raw`Une boîte contient $40$ allumettes. Deux joueurs, Pierre et Jean, prennent à tour de rôle de $1$ à $4$ allumettes. Celui qui prend la dernière perd.

Pierre cherche une stratégie qui lui permette de gagner à coup sûr. Préciser qui doit commencer, puis justifier les choix de Pierre.`,[
    w("Stratégie","Construire une stratégie gagnante et la justifier.",String.raw`**Pierre doit commencer et retirer 4 allumettes.** Il en laisse $36$, soit un nombre congru à $1$ modulo $5$.

Ensuite, si Jean retire $a$ allumettes, avec $1\le a\le4$, Pierre en retire $5-a$. Sa réponse est toujours autorisée, car $1\le5-a\le4$. À eux deux, ils retirent exactement $5$ allumettes.

Pierre laisse donc successivement à Jean :
$$36,\ 31,\ 26,\ 21,\ 16,\ 11,\ 6,\ 1.$$
Quand Jean reçoit la boîte contenant une seule allumette, il est obligé de la prendre et perd. Avant ce dernier tour, si Jean joue depuis $6$ allumettes, il en laisse au moins $2$ ; la réponse de Pierre en laisse exactement $1$ : Pierre ne prend jamais la dernière.

**Pourquoi commencer ?** Depuis $40$, celui qui joue peut atteindre $36\equiv1\pmod5$. Si Pierre laisse Jean commencer et que Jean suit cette stratégie, Pierre ne peut plus garantir la victoire. Le gain à coup sûr suppose donc que Pierre prenne le premier tour.`),
  ]),
  ex(60,"Le code bancaire",String.raw`Dans le modèle étudié, un numéro de compte $N$ comporte $23$ chiffres :

| Code banque $A$ | Code agence $B$ | Numéro de compte $C$ | Clé RIB $R$ |
|---|---|---|---|
| $23104$ | $15231$ | $00006462113$ | à déterminer |
| $5$ chiffres | $5$ chiffres | $11$ chiffres | $2$ chiffres |

La clé est comprise entre $01$ et $97$. On la choisit pour que le nombre obtenu en concaténant ces quatre blocs soit divisible par $97$. Un agent doit déterminer la clé de ce compte. Proposer une solution argumentée.`,[
    w("Solution","Calculer la clé et vérifier le numéro complet.",String.raw`**1. Placer les blocs.** Avec les positions imposées :
$$N=A\,10^{18}+B\,10^{13}+100C+R.$$
Les zéros initiaux de $C$ gardent sa largeur de onze chiffres ; sa valeur numérique est $6462113$.

**2. Réduire modulo 97.** Des divisions ou des réductions successives donnent :
$$10^{18}\equiv89\pmod{97},$$
$$10^{13}\equiv15\pmod{97},\qquad100\equiv3\pmod{97}.$$
Ainsi $N\equiv89A+15B+3C+R\pmod{97}$.
Avec les données, calculons séparément :

| Terme | Valeur |
|---|---|
| $89A$ | $2056256$ |
| $15B$ | $228465$ |
| $3C$ | $19386339$ |

Leur somme vaut $21671060$.
Or $21671060=97\times223412+96$.

Pour éviter les grands produits, on peut aussi réduire chaque bloc avant de multiplier :
$$A\equiv18,\quad B\equiv2,\quad C\equiv70\pmod{97}.$$
La somme des représentants vaut $89(18)+15(2)+3(70)=1842$. Or $1842=97\times18+96$ : on retrouve le reste $96$.

**3. Calculer le reste exact par blocs.** Repartons des chiffres du numéro sans la clé ; en conservant les largeurs, le nombre suivi de deux zéros est :
$$N_0=23104152310000646211300.$$
La division entière donne $N_0\equiv96\pmod{97}$. Il faut donc $96+R\equiv0$, soit $R\equiv1\pmod{97}$.

**4. Conclusion et vérification.** Dans l’intervalle $1\le R\le97$, l’unique valeur est $\boxed{R=01}$. Le numéro final est :
$$\boxed{23104152310000646211301.}$$
Il vaut $97\times238187137216501507333$, donc il est bien divisible par $97$. La clé doit s’écrire sur deux chiffres : $01$, et non seulement $1$.`),
  ]),
];
