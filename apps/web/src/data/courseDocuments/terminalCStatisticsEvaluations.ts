import type { CourseEvaluationGroup,CourseWrittenTask } from "../../domain/courseDocument";
import { tableFor,meanSolution,varianceSolution,covarianceSolution,regressionSolution,correlationSolution } from "./statisticsWriting";
import { statisticsData as d } from "../../features/mathematics/statisticsModels";
const task=(id:string,topicId:string,prompt:string,model:string,nativeFigure?:CourseWrittenTask["nativeFigure"]):CourseWrittenTask=>({
  id,topicId,prompt,model,nativeFigure,
  criteria:["Je précise les données et la formule utilisée.","Je montre les calculs sans arrondir les résultats intermédiaires.","Je conclus avec les unités et les limites éventuelles de l’estimation."],
});
export const statisticsEvaluations:CourseEvaluationGroup[]=[
  {id:"stats-eval-scatter",title:"Représenter un nuage de points",pages:[253],
    method:String.raw`1. Lire les couples par colonne, sans mélanger les observations.
2. Tracer deux axes orthogonaux, nommés avec leurs unités, et choisir des échelles adaptées.
3. Placer chaque point à son abscisse et son ordonnée. Ne pas relier les points.`,
    examples:[{id:"stats-eval-scatter-worked",title:"Six points à placer",prompt:"Construire le nuage : 1 cm représente 1 unité de x et 5 unités de y.",
      solution:tableFor("evaluation-plot")+String.raw`

Les points à placer sont :
$$M_1(0;15),\ M_2(1;24),\ M_3(2;35),$$
$$M_4(3;42),\ M_5(4;49),\ M_6(5;55).$$
Par exemple, pour $M_3$, on avance de $2$ cm horizontalement, puis de $35/5=7$ cm verticalement. Le graphique ci-dessous conserve ce rapport d’échelles.`,
      nativeFigure:{kind:"statistics",preset:"evaluation-plot"}}],
    statement:"Application : production de cacao pendant cinq années.\n\n"+tableFor("evaluation-cacao"),
    questions:[],writtenTasks:[task("stats-app-cacao","stats-scatter","Représenter le nuage de points dans un repère orthogonal.",
      String.raw`En abscisse, plaçons le rang de l’année ; en ordonnée, la production en tonnes.

Les cinq points sont $(1;18)$, $(2;20)$, $(3;19)$, $(4;17)$ et $(5;22)$.

Choisissons une échelle lisible, nommons les axes, puis plaçons ces cinq couples. Il ne faut pas relier les points pour former un polygone : on représente un nuage.`,
      {kind:"statistics",preset:"evaluation-cacao"})],
  },
  {id:"stats-eval-mean",title:"Déterminer le point moyen",pages:[254],
    method:String.raw`1. Compter les $n$ observations.
2. Calculer séparément $\sum x_i$ et $\sum y_i$.
3. Diviser chaque somme par $n$, puis écrire $G(\bar x;\bar y)$.`,
    examples:[{id:"stats-eval-mean-worked",title:"Température et pluie",prompt:"Déterminer le point moyen.",
      solution:tableFor("evaluation-mean")+"\n\n"+meanSolution(d["evaluation-mean"]),nativeFigure:{kind:"statistics",preset:"evaluation-mean"}}],
    statement:"Application : une moto perd de sa valeur avec les années. La valeur est exprimée en milliers de francs CFA.\n\n"+tableFor("evaluation-motorbike"),
    questions:[
      {id:"stats-app-moto-x",label:"1.",topicId:"stats-mean",prompt:"Quelle est l’abscisse du point moyen ?",points:1,expected:"2,5",answer:{kind:"short",accepted:["2.5","5/2"]},
        correction:String.raw`Il y a $6$ âges :
$$\bar x=\frac{0+1+2+3+4+5}{6}=\frac{15}{6}=\boxed{2{,}5\text{ ans}}.$$`},
      {id:"stats-app-moto-y",label:"2.",topicId:"stats-mean",prompt:"Quelle est son ordonnée, en milliers de francs CFA ?",points:1,expected:"163",answer:{kind:"short",accepted:["163"]},
        correction:String.raw`On additionne les six valeurs, puis on divise par $6$ :
$$\bar y=\frac{280+225+180+100+98+95}{6}=\frac{978}{6}=\boxed{163}.$$
Le point moyen est $G(2{,}5;163)$. L’ordonnée correspond à $163000$ F CFA.`},
    ],
  },
  {id:"stats-eval-regressions",title:"Déterminer les deux droites de régression",pages:[255],
    method:String.raw`1. Calculer les moyennes, les deux variances et la covariance.
2. Pour $Y$ en $X$, utiliser $a=\operatorname{Cov}(X,Y)/V(X)$, puis $b=\bar y-a\bar x$.
3. Pour $X$ en $Y$, utiliser $a'=\operatorname{Cov}(X,Y)/V(Y)$, puis $b'=\bar x-a'\bar y$.
4. Contrôler que les deux droites passent par $G$.`,
    examples:[{id:"stats-eval-regression-worked",title:"Argent de poche et épargne de quatre élèves",prompt:"Déterminer les deux droites.",parts:[
      {id:"stats-eval-reg-parameters",label:"1.",prompt:"Calculer les paramètres.",solution:tableFor("evaluation-regression")+"\n\n"+varianceSolution(d["evaluation-regression"])+"\n\n"+covarianceSolution(d["evaluation-regression"],false)},
      {id:"stats-eval-reg-y",label:"2.",prompt:"Déterminer Y en X.",solution:String.raw`
$$a=\frac{-6250}{12500}=-\frac12,\qquad b=975-\left(-\frac12\right)650=1300.$$
Donc $\boxed{Y=-\frac12X+1300}$. Pour $X=650$, on obtient $Y=975$.`},
      {id:"stats-eval-reg-x",label:"3.",prompt:"Déterminer X en Y.",solution:String.raw`
$$a'=\frac{-6250}{111875}=-\frac{10}{179}.$$
$$b'=650-\left(-\frac{10}{179}\right)975=\frac{126100}{179}.$$
Ainsi $\boxed{X=-\frac{10}{179}Y+\frac{126100}{179}}$. En $Y=975$, le résultat est bien $X=650$.`},
    ],nativeFigure:{kind:"statistics",preset:"evaluation-regression"}}],
    statement:"Application : déterminer les deux droites pour ce tableau.\n\n"+tableFor("evaluation-regression-application"),
    questions:[],writtenTasks:[
      task("stats-app-reg-y","stats-regressions","Déterminer une équation de la droite de Y en X.",regressionSolution(d["evaluation-regression-application"],"y")),
      task("stats-app-reg-x","stats-regressions","Déterminer une équation de la droite de X en Y.",regressionSolution(d["evaluation-regression-application"],"x"),{kind:"statistics",preset:"evaluation-regression-application"}),
    ],
  },
  {id:"stats-eval-correlation",title:"Calculer et interpréter une corrélation",pages:[256,257],
    method:String.raw`1. Vérifier que les deux variances sont positives.
2. Calculer $r=\operatorname{Cov}(X,Y)/\sqrt{V(X)V(Y)}$ avec les valeurs non arrondies.
3. Arrondir seulement à la fin ; interpréter le signe et la proximité de $|r|$ avec $1$.
4. Ne pas confondre corrélation, causalité et certitude d’une prévision.`,
    examples:[{id:"stats-eval-correlation-worked",title:"Population de 1993 à 2009",prompt:"Le rang est compté depuis 1992. Calculer r à trois décimales.",
      solution:tableFor("evaluation-correlation")+"\n\n"+correlationSolution(d["evaluation-correlation"])+String.raw`

Avec les valeurs exactes :
$$\operatorname{Cov}(X,Y)=115/49,\quad V(X)=1420/49,\quad V(Y)=509/2450.$$
Finalement $\boxed{r\approx0{,}956}$ à trois décimales. La tendance linéaire est fortement croissante selon le repère du chapitre.`,
      nativeFigure:{kind:"statistics",preset:"evaluation-correlation"}}],
    statement:"Application : âge et salaire de neuf salariés.\n\n"+tableFor("evaluation-employees"),
    questions:[{id:"stats-app-employees-r",label:"1.",topicId:"stats-correlation",prompt:"Calculer r et donner son arrondi à trois décimales.",points:1,expected:"0,778",answer:{kind:"short",accepted:["0.778"]},
      correction:correlationSolution(d["evaluation-employees"])+String.raw`

À trois décimales : $\boxed{r\approx0{,}778}$.`}],
    writtenTasks:[task("stats-app-employees-interpret","stats-correlation","Interpréter la valeur du coefficient obtenu.",
      String.raw`Le calcul donne $r\approx0{,}778$. Il est positif : les salaires présentent globalement une tendance croissante avec l’âge dans cet échantillon.

Mais $|r|<0{,}87$ : selon le repère retenu dans le chapitre, on ne parle pas de forte corrélation linéaire. La série ne permet pas de prédire avec certitude le salaire d’un salarié ni d’attribuer une causalité à l’âge.`)],
  },
];
