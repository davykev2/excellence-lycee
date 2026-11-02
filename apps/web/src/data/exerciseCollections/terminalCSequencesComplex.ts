import { sequenceExercise as ex, seqWritten as w } from "./terminalCSequencesBuilders";

export const sequencesComplex = [
  ex(53, "Choisir un contrat de salaire", String.raw`Monsieur Koudou propose un salaire annuel initial de **750 000 F CFA**. Deux contrats sont possibles : augmentation de **4 % par an** du salaire précédent, ou augmentation annuelle fixe de **30 000 F CFA**.

Monsieur Yao veut s’engager pour **neuf années**. Détermine le contrat le plus avantageux sur cette durée. La première année est rémunérée au salaire initial ; la première augmentation prend effet la deuxième année.`, [
    w("1.", "Modélise les deux salaires et compare les sommes reçues sur neuf années.", String.raw`### 1. Numéroter les années

Le rang $0$ désigne la première année. Les neuf salaires vont donc des rangs $0$ à $8$.

### 2. Contrat avec augmentation de 4 %

Une hausse de $4\,\%$ multiplie le salaire par $1{,}04$. Le salaire $A_n$ est géométrique :

$$A_0=750\,000,\qquad A_n=750\,000(1{,}04)^n.$$

Le total des neuf années est :

$$S_A=750\,000\frac{1{,}04^9-1}{1{,}04-1}
\approx7\,937\,096{,}48\text{ F CFA}.$$

### 3. Contrat avec augmentation fixe

On ajoute $30\,000$ chaque année. Le salaire $B_n$ est arithmétique :

$$B_n=750\,000+30\,000n.$$

Le dernier salaire vaut $B_8=990\,000$. Donc :

$$S_B=9\frac{750\,000+990\,000}{2}=7\,830\,000\text{ F CFA}.$$

### 4. Décision

$$S_A-S_B\approx107\,096{,}48\text{ F CFA}>0.$$

**Le contrat à $4\,\%$ est le plus avantageux sur neuf années**, selon les salaires et la convention de dates donnés. On a comparé les totaux, pas seulement le dernier salaire, et on a arrondi à la fin.`),
  ], { correctionFigureKey: "tc-l6-sequences" }),
  ex(54, "Un seuil sur le nombre total de cas", String.raw`Dans un modèle mathématique d’épidémie, le nombre de nouveaux cas du jour $t$ est $f(t)=120t+1$, pour $t\in\mathbb N$. Le jour $0$ compte donc un cas.

Dans cette situation fictive, un couvre-feu est prévu lorsque le **total cumulé dépasse 10 000**. Un camarade affirme que le seuil sera franchi dix jours après le premier cas. Détermine le premier jour de franchissement et vérifie son affirmation.`, [
    w("1.", "Calcule le cumul et détermine le premier jour où il dépasse 10 000.", String.raw`### 1. Distinguer nouveaux cas et cumul

Le nombre $f(n)$ ne compte que les nouveaux cas du jour $n$. Le total du jour $0$ au jour $n$ est :

$$C_n=\sum_{t=0}^n(120t+1)
=120\frac{n(n+1)}2+(n+1).$$
$$\boxed{C_n=(n+1)(60n+1).}$$

### 2. Repérer le premier franchissement

Chaque jour ajoute $120n+1>0$ : le cumul est strictement croissant. Calculons aux deux jours consécutifs qui encadrent le seuil :

$$C_{12}=13\times721=9\,373<10\,000,$$
$$C_{13}=14\times781=10\,934>10\,000.$$

Ainsi **le premier jour de dépassement est le jour $13$**, soit treize jours après la déclaration initiale.

### 3. Vérifier l’affirmation

Au jour $10$, $C_{10}=11\times601=6\,611$, encore inférieur au seuil. **Le camarade a tort dans le cadre de ce modèle.**

Ce calcul décrit le scénario mathématique donné ; il ne constitue ni une prévision épidémiologique réelle ni une règle générale de santé publique.`),
  ], { correctionFigureKey: "tc-l6-sequences" }),
  ex(55, "Inflation sur huit années", String.raw`Un modèle de coût de la vie utilise les taux annuels suivants, de janvier 2014 à janvier 2022 :

| Période | 2014–2017 | 2017–2019 | 2019–2020 | 2020–2021 | 2021–2022 |
| --- | --- | --- | --- | --- | --- |
| Taux annuel | 6 % | 7 % | 7,5 % | 8 % | 10 % |

Le taux indiqué s’applique à chacune des années de la période. Selon le critère de l’exercice, le coût de la vie est qualifié d’élevé si l’inflation cumulée sur huit ans est **supérieure à 60 %**. Coulibaly estime ce critère rempli ; Yao pense le contraire. Départage-les.`, [
    w("1.", "Détermine le coefficient global, puis le taux cumulé.", String.raw`### 1. Compter les durées

De 2014 à 2017 : **$3$ années** ; de 2017 à 2019 : **$2$ années** ; chacune des trois périodes suivantes dure **$1$ année**. On retrouve $3+2+1+1+1=8$.

### 2. Multiplier les coefficients

Si le prix initial est $P>0$, une hausse de $6\,\%$ donne $1{,}06P$. Trois hausses successives de ce taux donnent $1{,}06^3P$.

Le coefficient multiplicateur global est donc :

$$K=1{,}06^3\times1{,}07^2\times1{,}075\times1{,}08\times1{,}10
\approx1{,}7414461763.$$

On ne peut pas simplement additionner les taux : chaque hausse s’applique au prix déjà augmenté.

### 3. Comparer au critère

Le taux cumulé vaut :

$$100(K-1)\approx74{,}14\,\%.$$

Il dépasse $60\,\%$. **Coulibaly a raison selon le critère de l’exercice.** Cette conclusion porte sur les données et le seuil conventionnel du modèle, pas sur une mesure générale de la pauvreté.`),
  ]),
];
