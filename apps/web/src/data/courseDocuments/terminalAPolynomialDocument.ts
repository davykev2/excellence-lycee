import type {CourseDocument} from "../../domain/courseDocument";
import type {CurveLessonInteraction as Curve} from "../../domain/paths";
import {terminalAPolynomialSections} from "./terminalAPolynomialSummary";
import {rationalStudyExample,terminalAPolynomialEvaluations} from "./terminalAPolynomialEvaluations";

const legacyAnchors:Record<string,string>={
 "polynomial-limit-at-point":"ta-polynomial-finite",
 "polynomial-limit-at-infinity":"ta-polynomial-infinite",
 "rational-limit-defined-point":"ta-rational-finite",
 "one-sided-rational-limits":"ta-rational-sided",
 "rational-limit-at-infinity":"ta-rational-infinite",
 "sum-of-limits":"ta-limits-sum",
 "product-of-limits":"ta-limits-product",
 "inverse-and-quotient-limits":"ta-limits-inverse-quotient",
 "horizontal-asymptote":"ta-asymptote-horizontal",
 "vertical-asymptote":"ta-asymptote-vertical",
 "oblique-asymptote":"ta-asymptote-oblique",
 "elementary-derivatives":"ta-derivative-reference",
 "derivative-operations":"ta-derivative-rules",
 "variations-and-relative-extrema":"ta-derivative-variation",
 "tangent-equation":"ta-tangent",
 "intermediate-value-theorem":"ta-intermediate-values",
 "bisection-method":"ta-bisection",
 "scanning-method":"ta-scanning",
 "complete-function-study-mission":"ta-rational-study",
};
const curves:Record<string,Curve>={
 "ta-asymptote-vertical":{kind:"curve",eyebrow:"Courbe",title:"Deux branches autour de x = 5",instruction:"Déplace le point et rapproche-toi de 5, d’un côté puis de l’autre.",observation:"À gauche de 5, la fonction tend vers −∞ ; à droite, elle tend vers +∞. La droite verticale x = 5 sépare les deux branches.",formula:"f(x) = (3x − 4)/(x − 5)",formulaTex:String.raw`f(x)=\frac{3x-4}{x-5}`,rule:{kind:"rational-linear",numerator:[3,-4],denominator:[1,-5]},window:{xMin:-3,xMax:13,yMin:-12,yMax:18},guides:[{kind:"vertical",value:5,label:"x = 5"},{kind:"horizontal",value:3,label:"y = 3"}],marker:{min:-2.9,max:12.9,step:.1,initial:7}},
 "ta-relative-extrema":{kind:"curve",eyebrow:"Courbe",title:"Observer les deux extrema relatifs",instruction:"Déplace le point vers −1, puis vers 1. Compare les valeurs proches sur chaque branche.",observation:"La branche de gauche atteint un maximum relatif −4 en −1 ; celle de droite atteint un minimum relatif 0 en 1. La fonction n’est pas définie en 0.",formula:"f(x) = x − 2 + 1/x",formulaTex:String.raw`f(x)=x-2+\frac1x`,rule:{kind:"affine-plus-reciprocal",slope:1,intercept:-2,coefficient:1,shift:0},window:{xMin:-5,xMax:5,yMin:-10,yMax:7},guides:[{kind:"vertical",value:0,label:"x = 0"}],marker:{min:-4.9,max:4.9,step:.1,initial:1}},
 "ta-tangent":{kind:"curve",eyebrow:"Courbe",title:"Une tangente de pente −2",instruction:"Place le point en abscisse 1 : il se trouve au point de contact A(1 ; −3).",observation:"La droite y = −2x − 1 et la parabole ont le même point et la même pente en A.",formula:"f(x) = −x² − 2",formulaTex:String.raw`f(x)=-x^2-2`,rule:{kind:"polynomial",coefficients:[-2,0,-1]},window:{xMin:-3,xMax:3,yMin:-12,yMax:1},guides:[{kind:"oblique",slope:-2,intercept:-1,label:"tangente : y = −2x − 1"}],marker:{min:-2.9,max:2.9,step:.1,initial:1}},
 "ta-rational-study":{kind:"curve",eyebrow:"Courbe",title:"Relier la courbe aux résultats de l’étude",instruction:"Retrouve les extrema, puis compare chaque branche à la droite oblique.",observation:"Les deux asymptotes se coupent au centre A(−1 ; 1). Le maximum relatif est (−2 ; −1), et le minimum relatif est (0 ; 3).",formula:"f(x) = x + 2 + 1/(x + 1)",formulaTex:String.raw`f(x)=x+2+\frac1{x+1}`,rule:{kind:"affine-plus-reciprocal",slope:1,intercept:2,coefficient:1,shift:-1},window:{xMin:-5,xMax:4,yMin:-6,yMax:9},guides:[{kind:"vertical",value:-1,label:"x = −1"},{kind:"oblique",slope:1,intercept:2,label:"y = x + 2"}],marker:{min:-4.9,max:3.9,step:.1,initial:0}},
};

const sections=terminalAPolynomialSections.map(section=>({...section,topics:section.topics.map(topic=>({...topic,
 legacyLessonIds:Object.keys(legacyAnchors).filter(id=>legacyAnchors[id]===topic.id),interaction:curves[topic.id],
}))}));
sections[sections.length-1].topics.push({id:"ta-rational-study",title:"Une étude complète, question par question",pages:[25,26,27],body:"On étudie les deux branches de la fonction en séparant chaque question et son raisonnement.",examples:[rationalStudyExample],legacyLessonIds:["complete-function-study-mission"],interaction:curves["ta-rational-study"]});

export const terminalAPolynomialDocument:CourseDocument={
 id:"ta-l01-polynomial-rational-document",version:1,levelIds:["terminale-a"],
 source:{title:"TA Maths leçon 01 · Fonctions polynômes et fonctions rationnelles",pageCount:28,
  sha256:"9eaa927eae1332ac3463860a3724203d8ff7455e7e2d0501687e794826c02b93",summaryPages:[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,25,26,27,28],evaluationPages:[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
  editorialNotes:[
   "Situation d’apprentissage initiale et activités de découverte ignorées ; les propriétés et applications corrigées utiles sont reformulées. Ce document ne prétend pas remplacer une banque intégrale des exercices annexes.",
   "Le TVI seul donne l’existence, pas l’unicité : ajouter la monotonie stricte. La dérivée nulle en un point n’est pas un critère suffisant d’extremum.",
   "p.12 : domaine de (3x−4)/(x−5) = R privé de 5 ; limites −∞ à gauche et +∞ à droite.",
   "p.15 : dérivée de (x−4)/(5x+3) = 23/(5x+3)², non 20/(5x+3)².",
   "p.17 : pour −x²−2, f′(1)=−2 et la tangente est y=−2x−1.",
   "p.19 : x³−12x+10 donne f(0)=10 et f(0,5)=4,125.",
   "p.23 : quotient des degrés 4 donne 5/4 ; p.28 : 1/(x−3) est négatif à gauche de 3 et positif à droite.",
   "Le calcul de B est posé explicitement sur x≥0, sans déduire un nombre de jours ni une contrainte totale de production absents du modèle fourni. Coût de construction 5 179 000 F ; pas de 5 170 000.",
  ]},
 sections,legacyAnchors,evaluations:terminalAPolynomialEvaluations,
 essentials:[
  {id:"ta-essential-finite",title:"En un réel : vérifier, puis remplacer",topicId:"ta-rational-finite",body:String.raw`Pour un polynôme : $\lim_{x\to a}P(x)=P(a)$. Pour $P/Q$, cette substitution est valable si **$Q(a)\neq0$**.`},
  {id:"ta-essential-infinity",title:"À l’infini : garder les termes dominants",topicId:"ta-rational-infinite",body:String.raw`Pour un polynôme, garder le terme de plus haut degré. Pour un quotient, comparer les degrés : inférieur → $0$ ; égal → rapport des coefficients ; supérieur → étudier le signe du monôme restant.`},
  {id:"ta-essential-sided",title:"Près d’une valeur interdite : le signe décide",topicId:"ta-rational-sided",body:String.raw`$\lim_{x\to a^-}1/(x-a)=-\infty$ et $\lim_{x\to a^+}1/(x-a)=+\infty$. Ne pas confondre la gauche et la droite.`},
  {id:"ta-essential-asymptotes",title:"Trois types d’asymptotes",topicId:"ta-asymptote-oblique",body:String.raw`Limite finie $b$ à l’infini → **$y=b$**. Limite infinie près de $a$ → **$x=a$**. Différence $f(x)-(ax+b)\to0$ à l’infini → **$y=ax+b$**. La différence donne aussi la position relative.`},
  {id:"ta-essential-derivatives",title:"Dérivées à connaître",topicId:"ta-derivative-rules",body:String.raw`$$(x^n)'=nx^{n-1},\qquad (1/u)'=-u'/u^2.$$
$$(uv)'=u'v+uv',\qquad (u/v)'=(u'v-uv')/v^2.$$
Le dénominateur doit rester non nul.`},
  {id:"ta-essential-variations",title:"Le signe de f′ donne les variations",topicId:"ta-relative-extrema",body:String.raw`$f'\geq0$ → croissance ; $f'\leq0$ → décroissance. Passage $+\to-$ → maximum relatif ; passage $-\to+$ → minimum relatif. Séparer les intervalles du domaine.`},
  {id:"ta-essential-tangent",title:"Une tangente : une formule, deux valeurs",topicId:"ta-tangent",body:String.raw`$$y=f'(a)(x-a)+f(a).$$
Calculer séparément $f(a)$, l’ordonnée, et $f'(a)$, la pente.`},
  {id:"ta-essential-root",title:"Existence, unicité et encadrement",topicId:"ta-intermediate-values",body:String.raw`Continuité + signes contraires → existence. Monotonie stricte en plus → unicité. Dichotomie : conserver la bonne moitié ; balayage : repérer le changement de signe à pas régulier.`},
 ],
};
