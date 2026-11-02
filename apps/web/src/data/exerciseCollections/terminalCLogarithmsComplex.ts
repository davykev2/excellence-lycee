import type { ArenaExerciseItem } from "../../domain/arenaExercises";
import { choice, short, written } from "./builders";
import { logarithmExercise as ex } from "./terminalCLogarithmsBuilders";

export const logarithmsComplex: ArenaExerciseItem[] = [
  ex(40, "Le festival et les riverains", String.raw`Lors d’un festival destiné aux meilleurs élèves d’une classe de Terminale, la sonorisation produit $110$ dB au premier rang, situé à $10$ m. Les riverains à $500$ m ne souhaitent pas recevoir un niveau supérieur à $70$ dB. Monsieur Konan, organisateur, te demande si leur souhait est respecté.

On utilise $S=10\log(I/I_0)$, avec $I_0=10^{-12}\,\mathrm{W/m^2}$. **Dans le modèle de l’exercice**, l’intensité sonore est inversement proportionnelle au carré de la distance. Propose une solution argumentée.`, [
    written("1", "Exprime l’intensité à 500 m en fonction de celle à 10 m.", String.raw`Notons $I_{10}$ et $I_{500}$ les intensités. Comme $I(r)=k/r^2$, leur rapport vaut :

$$\frac{I_{500}}{I_{10}}=\left(\frac{10}{500}\right)^2=\frac1{2500}.$$

**À 500 m, l’intensité est donc 2 500 fois plus faible qu’à 10 m**, selon le modèle donné.`),
    written("2", "Calcule le niveau sonore reçu par les riverains.", String.raw`On soustrait les deux relations de niveau :

$$S_{500}-S_{10}=10\log(I_{500}/I_{10})=-10\log2500.$$

Avec $S_{10}=110$, on obtient :

$$\boxed{S_{500}=110-10\log2500\approx76{,}02\ \text{dB}.}$$

On pouvait aussi écrire $S(r)=110-20\log(r/10)$.`),
    choice("3.a", "Le souhait de ne pas dépasser 70 dB est-il respecté avec cette sonorisation ?", ["Oui", "Non"], 1, String.raw`**Non.** Le modèle donne environ $76{,}02$ dB, donc plus de $70$ dB. On compare les niveaux calculés dans les mêmes unités.`),
    written("3.b", "Rédige la conclusion et propose un ajustement dans ce modèle.", String.raw`Le niveau prévu à 500 m est environ $76{,}02$ dB : **la demande des riverains n’est pas respectée**.

Pour atteindre au plus $70$ dB au même endroit, il faut multiplier l’intensité par un facteur $q$ vérifiant $76{,}0206+10\log q\le70$. On trouve $q\le10^{(70-76{,}0206)/10}=1/4$.

**Diviser l’intensité de la source par au moins 4 satisfait la contrainte dans ce modèle de propagation.** Cela correspond à un niveau maximal d’environ $103{,}98$ dB à 10 m. Le calcul dépend des hypothèses données ; il n’est pas une mesure réelle sur place.`),
  ], { correctionFigureKey: "tc-l4-functions" }),
  ex(41, "Réduire une consommation de charbon", String.raw`Un pays décide de réduire de $8\%$ chaque année sa consommation de charbon, estimée à $10\,000$ tonnes en 2019. Le ministre annonce que l’objectif sera considéré comme atteint si cette consommation devient **strictement inférieure à $2\,000$ tonnes avant l’année 2030**.

Ton père te demande si cet objectif peut être atteint avec cette politique de réduction constante. Réponds par une production argumentée fondée sur le modèle mathématique.`, [
    written("1", "Écris la consommation après n années.", String.raw`Réduire de $8\%$ revient à conserver $92\%$ de la valeur précédente, donc à multiplier par $0{,}92$.

En notant $C_n$ la consommation de l’année $2019+n$, **$C_n=10000\times0{,}92^n$** pour tout entier $n\ge0$.`),
    short("2.a", "Quel est le premier entier n pour lequel la consommation devient strictement inférieure à 2 000 tonnes ?", "$20$", ["20"], String.raw`Il faut $0{,}92^n<0{,}2$. En prenant le logarithme puis en divisant par $\ln(0{,}92)<0$, on obtient $n>\ln(0{,}2)/\ln(0{,}92)\approx19{,}302$. **Le premier entier est $20$.**`),
    short("2.b", "En quelle année ce seuil est-il franchi ?", "$2039$", ["2039"], String.raw`L’année correspondante est $2019+n$. Avec $n=20$, on obtient **$2039$**, bien après la date limite annoncée.`),
    choice("3.a", "L’objectif strictement avant 2030 est-il atteint dans ce modèle ?", ["Oui", "Non"], 1, String.raw`**Non.** Le franchissement n’a lieu qu’en 2039. La consommation décroît chaque année, mais pas assez vite pour respecter la date donnée.`),
    written("3.b", "Rédige la conclusion en distinguant le seuil et la date limite.", String.raw`La consommation est $C_n=10000\times0{,}92^n$. La condition $C_n<2000$ donne $n>19{,}302$, donc le premier franchissement correspond à $n=20$, c’est-à-dire **2039**.

Avant 2030, la dernière année entière est 2029, soit $n=10$. Or $C_{10}\approx4343{,}88$ tonnes, encore supérieur à $2000$.

**Le pays n’atteint donc pas l’objectif chiffré avant 2030 avec une baisse annuelle constante de 8 %.** Cette conclusion porte sur l’objectif de consommation du problème ; elle ne suffit pas à résumer toute la lutte contre le réchauffement climatique.`),
  ]),
  ex(42, "La voiture d’Henriette", String.raw`Le 1er janvier 2020, M. Kouassi achète une voiture neuve à $8\,000\,000$ F CFA. Le concessionnaire affirme qu’elle perd $8\%$ de sa valeur chaque année. M. Kouassi la donnera à sa fille Henriette lorsqu’elle vaudra **strictement moins du quart de son prix initial**.

On suppose que la baisse s’applique à chaque anniversaire de l’achat. En quelle année Henriette pourra-t-elle recevoir la voiture ? Présente une solution argumentée.`, [
    short("1", "Quel est le quart du prix initial, en F CFA ?", "$2000000$", ["2000000", "8*10^6/4"], String.raw`Le quart vaut $8000000/4=\boxed{2000000\ \text{F CFA}}$. C’est le seuil à comparer à la valeur de la voiture.`),
    short("2", "Après combien d’années entières la valeur passe-t-elle strictement sous ce seuil ?", "$17$", ["17"], String.raw`La valeur est $V_n=8000000\times0{,}92^n$. Il faut $0{,}92^n<1/4$, soit $n>\ln(1/4)/\ln(0{,}92)\approx16{,}626$. **Le premier entier est $17$.**`),
    short("3", "Quelle est l’année correspondante ?", "$2037$", ["2037"], String.raw`Dix-sept années après le 1er janvier 2020 donnent **le 1er janvier 2037**. L’année demandée est donc 2037.`),
    written("4", "Rédige le raisonnement et vérifie le premier franchissement.", String.raw`Chaque année, la voiture conserve $92\%$ de sa valeur : $V_n=8000000\times0{,}92^n$ à la date du $n$-ième anniversaire de l’achat.

La condition $V_n<8000000/4$ équivaut à $0{,}92^n<1/4$. Après logarithme : $n\ln(0{,}92)<\ln(1/4)$. Comme on divise par un nombre négatif, le sens change :

$$n>\frac{\ln(1/4)}{\ln(0{,}92)}\approx16{,}626.$$

Il faut donc **17 années**, et non 16. Vérification : $0{,}92^{16}>1/4$ mais $0{,}92^{17}<1/4$.

**Henriette pourra recevoir la voiture le 1er janvier 2037**, sous les hypothèses de dépréciation annuelle du problème.`),
  ]),
];
