export interface StatisticsData {
  title: string;
  x: number[];
  y: number[];
  xLabel: string;
  yLabel: string;
  weights?: number[];
  /** One physical unit on each axis represents these quantities, when specified. */
  scale?: [number, number];
  origin?: [number, number];
}
const data = (title: string, x: number[], y: number[], xLabel = "x", yLabel = "y", extra: Partial<StatisticsData> = {}): StatisticsData =>
  ({ title, x, y, xLabel, yLabel, ...extra });

/** Reviewed source tables, shared by the native figures and their worked calculations. */
export const statisticsData: Readonly<Record<string, StatisticsData>> = {
  salary: data("Heures de travail et salaire", [120,130,145,150,160], [180000,195000,217000,225000,240000], "Heures", "Salaire (F CFA)"),
  advertising: data("Publicité et ventes", [2,4,5,6,8,9,10], [50,70,80,100,110,120,150], "Publicité (millions F)", "Ventes (millions F)"),
  mean: data("Point moyen", [25,35,40,50], [2,3,7,11]),
  height: data("Âge et taille", [1,2,3,4], [74,85,96,102], "Âge (ans)", "Taille (cm)"),
  regression: data("Deux droites de régression", [3,5,7,8,9,10], [160,380,600,650,800,875]),
  "evaluation-plot": data("Construire un nuage de points", [0,1,2,3,4,5], [15,24,35,42,49,55], "x", "y", {scale:[1,5],origin:[0,0]}),
  "evaluation-cacao": data("Production de cacao", [1,2,3,4,5], [18,20,19,17,22], "Rang de l’année", "Production (t)"),
  "evaluation-mean": data("Température et pluviométrie", [27,28,29,31,32], [160,140,135,90,80], "Température (°C)", "Pluie (mm)"),
  "evaluation-motorbike": data("Valeur d’une moto", [0,1,2,3,4,5], [280,225,180,100,98,95], "Âge (ans)", "Valeur (milliers F)"),
  "evaluation-regression": data("Argent de poche et épargne", [500,600,700,800], [1000,800,1500,600], "Argent quotidien (F)", "Épargne hebdomadaire (F)"),
  "evaluation-regression-application": data("Application : deux régressions", [10,15,12,20], [10,12,14,16]),
  "evaluation-correlation": data("Évolution d’une population", [1,3,7,10,12,14,17], [4.4,4.7,4.8,4.9,5.5,5.5,5.7], "Rang depuis 1992", "Population (milliers)"),
  "evaluation-employees": data("Âge et salaire de neuf salariés", [15,20,26,34,37,43,44,50,52], [600,750,740,990,820,820,1075,995,910], "Âge (ans)", "Salaire (milliers F)"),
  "4": data("Salaires horaires et jours travaillés", [1000,1250,1450,1650,1850,2150], [24,20,18,16,14,12], "Salaire horaire (F)", "Jours par mois"),
  "6": data("Vitesse et consommation", [70,90,115,145], [6,9,8,11], "Vitesse (km/h)", "Consommation (L)"),
  "7": data("Chiffre d’affaires et bénéfice", [4,6,8,12], [3,2,5,4], "Chiffre d’affaires (millions F)", "Bénéfice (millions F)"),
  "8": data("Calculer une covariance", [80,92,96,120,130], [5,15,20,10,5]),
  "9": data("Salaire et personnes à charge", [35000,40000,45000,50000,55000], [2,3,1,5,2], "Salaire mensuel (F)", "Personnes à charge"),
  "11": data("Production et achat d’engrais", [4,6,8,10,14,20], [14,8,13,16,50,40], "Production (t)", "Engrais (milliers F)"),
  "12": data("Télévision et déplacements", [4,5,7,8,10], [6,2,5,4,3], "Télévision (h/semaine)", "Déplacements/semaine"),
  "14": data("Température et jours de pluie", [27,28,29,30], [5,7,6,9], "Température (°C)", "Jours de pluie"),
  "15": data("Chiffres d’affaires annuels", [0,1,2,3,4], [504,580,644,691,735], "Rang depuis 2017", "Chiffre d’affaires (millions F)"),
  "16": data("Notes de musique et dessin", [4,6,12,18], [4,8,10,14], "Musique (/20)", "Dessin (/20)"),
  "17": data("Masse et taille de dix nouveau-nés", [2.4,2.6,2.7,3,3.2,3.3,3.5,3.6,3.8,4], [45,47,48,80,51,52,53,54,55,56], "Masse (kg)", "Taille (cm)"),
  "18": data("Prix et ventes de colliers", [2500,1900,2300,3000], [200,240,220,160], "Prix unitaire (F)", "Exemplaires vendus", {scale:[100,10],origin:[1900,160]}),
  "19": data("Taille et diamètre des troncs", [40,41,42,43,45], [148,147,151,149,150], "Taille (m)", "Diamètre (cm)"),
  "20": data("Six premiers mois d’un magasin", [1,2,3,4,5,6], [120,130,150,190,210,220], "Mois", "Chiffre d’affaires (milliers F)"),
  "21": data("Prix d’un forfait et clientèle", [28,30,32,35,37,40,43,46,48,51], [47,44,40,38,35,28,25,22,17,14], "Forfait (centaines F)", "Clientèle", {scale:[4,4],origin:[20,0]}),
  "22": data("Ancienneté et prime", [2,8,11,17,20,22,26], [270,390,460,590,650,710,830], "Ancienneté (ans)", "Prime (€)", {scale:[2,50],origin:[0,250]}),
  "23": data("Lecture d’un nuage", [1,3,4,5,7,8,9], [0,1,1.5,2.5,4,4.5,4], "x", "y", {scale:[1,1],origin:[0,0]}),
  "24": data("Départs à la retraite", [0,1,2,3,4,5,6,7], [50,53,53,58,57,59,63,64], "Rang depuis 2007", "Départs", {scale:[1,1],origin:[0,50]}),
  "25": data("Âge et tension systolique", [26,39,40,50,53,56], [128,126,118,136,142,145], "Âge (ans)", "TAS (mm Hg)"),
  "26": data("Deux ajustements linéaires", [0,1,2,3,4,5,6,7,8], [160,110,100,72,36,29,20,10,3]),
  "27": data("Travailleurs et superficie d’hévéa", [2,4,4,5,7,7,8,8], [3,5,6,7,10,11,8,12], "Travailleurs", "Superficie (ha)", {scale:[1,1],origin:[0,0]}),
  "28": data("Âge et salaire", [25,30,35,40,50], [600,750,820,1075,910], "Âge (ans)", "Salaire (milliers F)"),
  "29": data("Régression et estimation", [8.1,11,14.4,15.2,21.5], [9.7,12.8,18.5,22.8,31.5]),
  "31": data("Une valeur manquante", [1.2,1.4,1.6,1.8,2], [13,12,14,16,20]),
  "32": data("Revenu et dépenses alimentaires", [39800,60300,79400,100000,151400,251000,398100], [30000,37150,41700,45700,55100,70800,87100], "Revenu (F)", "Dépenses (F)"),
  "33": data("Un ajustement logarithmique", [1,2,3,4,5,6,7,8,9,10,11,13], [198,881,1256,1489,1804,1983,2104,2247,2312,2468,2541,2639]),
  "34": data("Notes mensuelles", [1,2,3,4,5], [8,9,9,12,13], "Mois", "Note (/20)"),
  "35": data("Puissance et durée des pneus", [20,20,20,25,25,25,30,30,30], [2,3,4,2,3,4,2,3,4], "Puissance (cv)", "Durée (milliers km)", {weights:[0,8,30,5,20,7,25,3,2]}),
  "36": data("Taille et masse de cinq personnes", [150,160,165,170,179], [50,55,57,60,70], "Taille (cm)", "Masse (kg)"),
  "37": data("Adhérents du club de mathématiques", [1,2,3,4,5,6,7,8,9,10,11,12], [1100,1160,1220,1370,1620,1550,1600,1500,1790,1940,2060,1980], "Mois depuis janvier 2018", "Adhérents"),
};

export function bivariateStatistics(d: Pick<StatisticsData,"x"|"y"|"weights">) {
  const {x,y}=d, w=d.weights??x.map(()=>1);
  if(!x.length||x.length!==y.length||w.length!==x.length||[...x,...y,...w].some(n=>!Number.isFinite(n))||w.some(n=>n<0))throw new Error("Série double invalide");
  const n=w.reduce((s,v)=>s+v,0);
  if(!(n>0))throw new Error("L’effectif doit être positif");
  const sumX=x.reduce((s,v,i)=>s+w[i]*v,0),sumY=y.reduce((s,v,i)=>s+w[i]*v,0);
  const meanX=sumX/n,meanY=sumY/n;
  const varianceX=x.reduce((s,v,i)=>s+w[i]*(v-meanX)**2,0)/n;
  const varianceY=y.reduce((s,v,i)=>s+w[i]*(v-meanY)**2,0)/n;
  const covariance=x.reduce((s,v,i)=>s+w[i]*(v-meanX)*(y[i]-meanY),0)/n;
  const a=varianceX>0?covariance/varianceX:null,aPrime=varianceY>0?covariance/varianceY:null;
  const r=varianceX>0&&varianceY>0?Math.max(-1,Math.min(1,covariance/Math.sqrt(varianceX*varianceY))):null;
  return {n,sumX,sumY,meanX,meanY,varianceX,varianceY,covariance,r,
    sigmaX:Math.sqrt(varianceX),sigmaY:Math.sqrt(varianceY),a,b:a===null?null:meanY-a*meanX,
    aPrime,bPrime:aPrime===null?null:meanX-aPrime*meanY,
    sumXX:x.reduce((s,v,i)=>s+w[i]*v*v,0),sumYY:y.reduce((s,v,i)=>s+w[i]*v*v,0),
    sumXY:x.reduce((s,v,i)=>s+w[i]*v*y[i],0)};
}
export function marginalDistributions(rows: readonly number[],columns: readonly number[],counts: readonly (readonly number[])[]) {
  if(counts.length!==rows.length||!rows.length||!columns.length||counts.some(r=>r.length!==columns.length||r.some(n=>!Number.isFinite(n)||n<0)))throw new Error("Tableau invalide");
  const rowTotals=counts.map(r=>r.reduce((s,n)=>s+n,0)),columnTotals=columns.map((_,j)=>counts.reduce((s,r)=>s+r[j],0));
  const total=rowTotals.reduce((s,n)=>s+n,0);
  if(!total)throw new Error("Tableau vide");
  return {total,rowTotals,columnTotals,rowFrequencies:rowTotals.map(n=>n/total),columnFrequencies:columnTotals.map(n=>n/total)};
}
export function transformedStatistics(key:"32"|"33"):StatisticsData {
  const d=statisticsData[key];
  return {...d,title:key==="32"?"Ajustement de ln y en ln x":"Ajustement de y en ln x",x:d.x.map(Math.log),
    y:key==="32"?d.y.map(Math.log):d.y,xLabel:"ln x",yLabel:key==="32"?"ln y":"y",scale:key==="32"?[1,1]:undefined,origin:undefined};
}
export function mayerLine(d:StatisticsData){
  if(d.x.length%2!==0)throw new Error("Deux groupes de même taille sont requis");
  const k=d.x.length/2,first=bivariateStatistics({x:d.x.slice(0,k),y:d.y.slice(0,k)}),second=bivariateStatistics({x:d.x.slice(k),y:d.y.slice(k)});
  const a=(second.meanY-first.meanY)/(second.meanX-first.meanX);
  return {first,second,a,b:first.meanY-a*first.meanX};
}
export const statsFormat=(n:number,digits=4)=>{
  const rounded=Number(n.toFixed(digits));
  return (Object.is(rounded,-0)?0:rounded).toLocaleString("fr-FR",{maximumFractionDigits:digits,useGrouping:false});
};
export const statsTex=(n:number,digits=6)=>statsFormat(n,digits).replace(",","{,}");
