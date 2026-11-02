import type {CourseDocument,CourseEssentialCard} from "../../domain/courseDocument";
import type {CurveLessonInteraction} from "../../domain/paths";
import {terminalALogarithmSections} from "./terminalALogarithmSummary";
import {terminalALogarithmEvaluations} from "./terminalALogarithmEvaluations";
const r=String.raw;
const legacyAnchors:Record<string,string>={
 "log-definition-properties":"ta-log-definition","log-algebraic-properties":"ta-log-algebra",
 "log-limits-variations":"ta-log-limits","log-derivative-variation":"ta-log-function-study",
 "log-equations-inequalities":"ta-log-equations","log-inequalities":"ta-log-inequalities",
 "log-composite-derivatives":"ta-log-composite","log-primitives":"ta-log-primitives",
};
const curves:Record<string,CurveLessonInteraction>={
 "ta-log-curve":{kind:"curve",eyebrow:"Explorer",title:"La courbe de ln",instruction:"Déplace le point et retrouve les abscisses 1 et e.",observation:"La fonction est croissante. Elle passe par (1 ; 0) et (e ; 1), et descend vers −∞ quand x se rapproche de 0 par valeurs positives.",formula:"f(x) = ln(x)",formulaTex:r`f(x)=\ln x`,rule:{kind:"affine-plus-log",slope:0,intercept:0,coefficient:1},window:{xMin:-.3,xMax:8,yMin:-4,yMax:3},guides:[{kind:"vertical",value:0,label:"asymptote x = 0"},{kind:"horizontal",value:1,label:"y = 1"},{kind:"vertical",value:Math.E,label:"x = e"}],marker:{min:.05,max:8,step:.05,initial:1}},
 "ta-log-bac-study":{kind:"curve",eyebrow:"Explorer",title:"La courbe de l’étude type Bac",instruction:"Place le point près de 0, au sommet en 0,5, puis plus à droite.",observation:"Le maximum est −ln 2 ≈ −0,69, atteint en x = 0,5. La courbe reste négative et tend vers −∞ aux deux extrémités du domaine.",formula:"f(x) = -2x + 1 + ln(x)",formulaTex:r`f(x)=-2x+1+\ln x`,rule:{kind:"affine-plus-log",slope:-2,intercept:1,coefficient:1},window:{xMin:-.2,xMax:4.2,yMin:-7,yMax:1},guides:[{kind:"vertical",value:0,label:"x = 0"},{kind:"vertical",value:.5,label:"x = 1/2"},{kind:"horizontal",value:-Math.LN2,label:"maximum : −ln 2"}],marker:{min:.05,max:4,step:.05,initial:.5}},
};
const essentials:CourseEssentialCard[]=[
 {id:"ta-log-essential-domain",title:"D’abord le domaine",topicId:"ta-log-definition",body:r`$\ln u$ existe dans les réels seulement si $u>0$. $\ln1=0$ et $(\ln x)'=1/x$ pour $x>0$.`},
 {id:"ta-log-essential-algebra",title:"Produit, quotient, puissance",topicId:"ta-log-algebra",body:r`Pour $a,b>0$ : $\ln(ab)=\ln a+\ln b$, $\ln(a/b)=\ln a-\ln b$, $\ln(a^n)=n\ln a$ pour $n\in\mathbb Z$. Pas de règle analogue pour $\ln(a+b)$.`},
 {id:"ta-log-essential-limits",title:"Quatre limites",topicId:"ta-log-limits",body:r`En $0^+$ : $\ln x\to-\infty$ et $x\ln x\to0$. En $+\infty$ : $\ln x\to+\infty$ et $\ln x/x\to0$.`},
 {id:"ta-log-essential-sign",title:"Croissance et signe",topicId:"ta-log-curve",body:r`$\ln$ est strictement croissante. Pour $x>0$, son signe est celui de $x-1$. $\ln e=1$ ; la courbe passe par $(1;0)$ et $(e;1)$.`},
 {id:"ta-log-essential-equations",title:"Équations",topicId:"ta-log-equations",body:r`Sous les conditions de positivité, $\ln u=\ln v\iff u=v$. Pour $\ln x=a$, $x=e^a$. Pour un polynôme en logarithme, poser $X=\ln x$, puis revenir à $x$.`},
 {id:"ta-log-essential-inequalities",title:"Inéquations : attention au signe",topicId:"ta-log-inequalities",body:r`Comparer deux logarithmes conserve le sens de l’inégalité car $\ln$ est croissante. Diviser par un logarithme négatif inverse le sens. Toujours garder le domaine et le caractère strict ou large des bornes.`},
 {id:"ta-log-essential-derivative",title:"Dériver ln(u)",topicId:"ta-log-composite",body:r`Si $u$ est dérivable et positive sur l’intervalle : $\boxed{(\ln u)'=u'/u}$. Identifier $u$, calculer $u'$, puis former le quotient.`},
 {id:"ta-log-essential-primitive",title:"Primitives logarithmiques",topicId:"ta-log-primitives",body:r`Pour $u>0$, les primitives de $u'/u$ sont $\ln u+C$. Celles de $a/(cx+d)$, avec $c\neq0$ et $cx+d>0$, sont $(a/c)\ln(cx+d)+C$. Vérifier en dérivant.`},
];
export const terminalALogarithmDocument:CourseDocument={
 id:"ta-l03-natural-logarithm-document",version:1,levelIds:["terminale-a"],
 source:{title:"TA Maths leçon 03 · Fonction logarithme népérien",pageCount:10,sha256:"38be6e570af32e3c583cbfba6f3fe70a2042886238ea37b8e7b8b5d86f5869eb",summaryPages:[1,2,3,4,5,6,7,9,10],evaluationPages:[1,2,3,4,5,6,7,8,9,10],editorialNotes:[
  "Dix pages inspectées à l’image ; situation d’apprentissage initiale ignorée. Cours, applications corrigées et sélection d’évaluations rédigés à nouveau ; ce lot n’est pas une banque exhaustive des exercices annexes.",
  "Propriétés et hypothèses conservées : ln est une primitive de 1/x, non sa dérivée ; argument strictement positif ; primitives sur l’intervalle indiqué et constante réelle.",
  "L’inéquation imprimée (ln x)^2−5ln x−6≥0 est conservée : son corrigé source remplace à tort −6 par +6. Les racines correctes sont −1 et6, donc ]0;e^(−1)] union [e^6;+infini[.",
  "L’argument −x²+2x−1=−(x−1)² n’est jamais strictement positif : domaine réel vide, aucune dérivée réelle. Ne pas inventer un argument différent.",
  "Étude type Bac : f(0,25)≈−0,9, f(1)=−1 et f(3)≈−3,9. Tableau recalculé, maximum −ln2 en1/2, courbe toujours sous l’axe. Ancienne donnée arrondie −3,2/1/−4 non réintroduite.",
  "Situation complexe : conserver le strict supérieur à98% de l’énoncé. n>ln(0,02)/ln(0,325)≈3,48 ; minimum4. Le corrigé source utilise ≥, mais le minimum entier est identique. Modèle probabiliste admis, pas conseil médical.",
  "L’exercice12 demande une droite Delta sans la définir : pas de droite inventée. Les fonctions données à tort sur R sont rétablies sur leur domaine réel. Pas de notice de coquille dans le texte public.",
 ]},
 sections:terminalALogarithmSections.map(section=>({...section,topics:section.topics.map(topic=>({...topic,legacyLessonIds:Object.keys(legacyAnchors).filter(id=>legacyAnchors[id]===topic.id),interaction:curves[topic.id]}))})),
 evaluations:terminalALogarithmEvaluations,essentials,legacyAnchors,
};
