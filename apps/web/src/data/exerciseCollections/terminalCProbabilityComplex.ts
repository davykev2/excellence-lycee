import { probabilityExercise as ex, written as w } from "./terminalCProbabilityBuilders";

export const probabilityComplex = [
  ex(51,"Un projet de consoles de jeux",String.raw`Une entreprise prévoit de produire $400$ consoles par mois. Fabriquer une console coûte $160\,000$ F CFA. Le test de conformité est réussi avec probabilité $0,93$ : la console est alors vendue $290\,000$ F CFA ; sinon elle est vendue $150\,000$ F CFA. Le projet doit dégager un bénéfice mensuel moyen d’au moins $45\,000\,000$ F CFA.

À partir de ce modèle, présente un argument chiffré pour décider si l’objectif moyen est atteint.`,[
    w("1.","Détermine les deux bénéfices possibles par console.",String.raw`Le bénéfice est le prix de vente **moins le coût de fabrication** :
$$b_{\rm conforme}=290000-160000=\boxed{130000\ {\rm F\ CFA}},$$
$$b_{\rm non\ conforme}=150000-160000=\boxed{-10000\ {\rm F\ CFA}}.$$
Le second cas est une perte, même si l’entreprise encaisse un prix de vente.`),
    w("2.","Calcule le bénéfice moyen par console puis pour un mois.",String.raw`Pour une console :
$$E(B)=130000(0,93)+(-10000)(0,07)$$
$$=120900-700=\boxed{120200\ {\rm F\ CFA}}.$$
Pour $400$ consoles ayant chacune cette même loi, la linéarité de l’espérance donne
$$E(B_{\rm mois})=400\times120200
=\boxed{48\,080\,000\ {\rm F\ CFA}}.$$
Cette égalité d’espérances n’exige pas l’indépendance entre consoles.`),
    w("3.","Conclus en précisant ce que le calcul permet d’affirmer.",String.raw`Le bénéfice mensuel moyen calculé dépasse l’objectif de
$$48\,080\,000-45\,000\,000=\boxed{3\,080\,000\ {\rm F\ CFA}}.$$
**L’objectif moyen est donc atteint dans ce modèle**, ce qui est un argument favorable au projet. Mais une espérance n’est pas une garantie de bénéfice chaque mois. Pour estimer le risque de manquer l’objectif, il faudrait compléter l’étude avec les hypothèses nécessaires sur les productions et les coûts réellement pris en compte.`),
  ]),
  ex(52,"Choisir la meilleure option d’un jeu",String.raw`On utilise une pièce équilibrée, avec des lancers indépendants. Option 1 : lancer trois fois et gagner si l’on obtient exactement deux faces. Option 2 : lancer quatre fois et gagner si l’on obtient au moins trois faces.

Compare les probabilités de gain et conseille l’option la plus avantageuse.`,[
    w("1.","Calcule la probabilité de gagner avec l’option 1.",String.raw`Le nombre $X$ de faces en trois lancers suit $\mathcal B(3;1/2)$. Pour gagner il faut exactement deux faces :
$$P(X=2)=\binom32\left(\frac12\right)^2\left(\frac12\right)
=\boxed{\frac38}.$$
On peut aussi compter les trois suites FFP, FPF, PFF parmi huit suites équiprobables.`),
    w("2.","Calcule la probabilité de gagner avec l’option 2.",String.raw`Ici $Y\sim\mathcal B(4;1/2)$. « Au moins trois faces » signifie trois **ou** quatre :
$$P(Y\ge3)=\binom43\left(\frac12\right)^4
+\binom44\left(\frac12\right)^4
=\frac4{16}+\frac1{16}=\boxed{\frac5{16}}.$$`),
    w("3.","Compare et justifie ton conseil.",String.raw`Avec le même dénominateur, $3/8=6/16>5/16$. **L’option 1 est la plus avantageuse** pour maximiser la probabilité de gain.

La différence est $6/16-5/16=1/16=0,0625$, soit **6,25 points de pourcentage**. Ce conseil dépend des hypothèses d’équilibre et d’indépendance de la pièce utilisées dans le calcul.`),
  ]),
];
