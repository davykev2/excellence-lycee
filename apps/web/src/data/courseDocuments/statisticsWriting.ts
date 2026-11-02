import { bivariateStatistics,statisticsData,statsTex, type StatisticsData } from "../../features/mathematics/statisticsModels";
const t=statsTex;
export function statisticsTable(d:StatisticsData,xLabel=d.xLabel,yLabel=d.yLabel){
  return "| "+xLabel+" | "+d.x.map(n=>"$"+t(n)+"$").join(" | ")+" |\n|"+Array(d.x.length+1).fill("---").join("|")+"|\n| "+yLabel+" | "+d.y.map(n=>"$"+t(n)+"$").join(" | ")+" |";
}
export const tableFor=(key:string)=>statisticsTable(statisticsData[key]);
export function meanSolution(d:StatisticsData) {
  const s=bivariateStatistics(d),w=d.weights;
  return String.raw`Chaque couple concerne la même observation. L’effectif total est $n=${t(s.n)}$.

${w?"Les valeurs sont pondérées par leurs effectifs. On additionne les produits « valeur × effectif ».":"On additionne séparément les abscisses et les ordonnées."}
$$\sum ${w?"n_i":""}x_i=${t(s.sumX)},\qquad \sum ${w?"n_i":""}y_i=${t(s.sumY)}.$$
$$\bar x=\frac{${t(s.sumX)}}{${t(s.n)}}\approx ${t(s.meanX)},$$
$$\bar y=\frac{${t(s.sumY)}}{${t(s.n)}}\approx ${t(s.meanY)}.$$
Ainsi $\boxed{G(${t(s.meanX)}\,;${t(s.meanY)})}$, avec les coordonnées arrondies ci-dessus si nécessaire.`;
}
export function covarianceSolution(d:StatisticsData,includeMean=true){
  const s=bivariateStatistics(d);
  return (includeMean?meanSolution(d)+"\n\n":"")+String.raw`On multiplie les deux valeurs de chaque couple, puis on additionne ${d.weights?"en tenant compte de chaque effectif":""} :
$$\sum ${d.weights?"n_i":""}x_iy_i=${t(s.sumXY)}.$$
La formule est $\operatorname{Cov}(X,Y)=\frac1n\sum ${d.weights?"n_i":""}x_iy_i-\bar x\bar y$.
$$\operatorname{Cov}(X,Y)=\frac{${t(s.sumXY)}}{${t(s.n)}}-\frac{${t(s.sumX)}}{${t(s.n)}}\times\frac{${t(s.sumY)}}{${t(s.n)}}.$$
Donc $\boxed{\operatorname{Cov}(X,Y)\approx ${t(s.covariance)}}$. Les fractions ont été gardées pendant le calcul ; seul le résultat affiché est arrondi.`;
}
export function varianceSolution(d:StatisticsData){
  const s=bivariateStatistics(d);
  return meanSolution(d)+String.raw`

On calcule les sommes des carrés :
$$\sum ${d.weights?"n_i":""}x_i^2=${t(s.sumXX)},\qquad \sum ${d.weights?"n_i":""}y_i^2=${t(s.sumYY)}.$$
$$V(X)=\frac{${t(s.sumXX)}}{${t(s.n)}}-\left(\frac{${t(s.sumX)}}{${t(s.n)}}\right)^2\approx ${t(s.varianceX)}.$$
$$V(Y)=\frac{${t(s.sumYY)}}{${t(s.n)}}-\left(\frac{${t(s.sumY)}}{${t(s.n)}}\right)^2\approx ${t(s.varianceY)}.$$
Les écarts-types sont les racines carrées des variances :
$$\boxed{\sigma_X\approx ${t(s.sigmaX)},\qquad \sigma_Y\approx ${t(s.sigmaY)}}.$$`;
}
export function regressionSolution(d:StatisticsData,direction:"y"|"x",includeParameters=true){
  const s=bivariateStatistics(d),forward=direction==="y",a=forward?s.a:s.aPrime,b=forward?s.b:s.bPrime,v=forward?s.varianceX:s.varianceY;
  if(a===null||b===null)return "La variance de la variable explicative est nulle : cette formule de régression ne s’applique pas.";
  return (includeParameters?varianceSolution(d)+"\n\n"+covarianceSolution(d,false)+"\n\n":"")+String.raw`On cherche ${forward?"à estimer $Y$ à partir de $X$":"à estimer $X$ à partir de $Y$"}. L’équation est donc ${forward?"$Y=aX+b$":"$X=a'Y+b'$"}.
La variance au dénominateur est celle de ${forward?"$X$":"$Y$"}, et elle est strictement positive :
$$${forward?"a":"a'"}=\frac{\operatorname{Cov}(X,Y)}{V(${forward?"X":"Y"})}\approx\frac{${t(s.covariance)}}{${t(v)}}\approx ${t(a)}.$$
On utilise le passage par $G(\bar x;\bar y)$ :
$$${forward?"b=\\bar y-a\\bar x":"b'=\\bar x-a'\\bar y"}\approx ${t(forward?s.meanY:s.meanX)}-(${t(a)})\times ${t(forward?s.meanX:s.meanY)}.$$
D’où ${forward?"$b":"$b'"}\approx ${t(b)}$ et l’équation, à coefficients arrondis :
$$\boxed{${forward?"Y":"X"}\approx (${t(a)})${forward?"X":"Y"}${b>=0?"+":""}${t(b)}}.$$
Pour les estimations suivantes, on conserve les coefficients non arrondis dans la calculatrice. ${forward?"La droite de $X$ en $Y$ se calcule séparément ; elle n’est pas obtenue en inversant cette équation.":""}`;
}
export function correlationSolution(d:StatisticsData,includeParameters=true){
  const s=bivariateStatistics(d);
  if(s.r===null)return "Une variance est nulle : le coefficient de corrélation n’est pas défini.";
  return (includeParameters?varianceSolution(d)+"\n\n"+covarianceSolution(d,false)+"\n\n":"")+String.raw`Les deux variances étant positives,
$$r=\frac{\operatorname{Cov}(X,Y)}{\sqrt{V(X)V(Y)}}.$$
Avec les valeurs non arrondies des paramètres :
$$r\approx\frac{${t(s.covariance)}}{\sqrt{${t(s.varianceX)}\times ${t(s.varianceY)}}}\approx ${t(s.r)}.$$
Le signe ${s.r<0?"négatif":"positif"} indique une tendance linéaire ${s.r<0?"décroissante":"croissante"}. ${Math.abs(s.r)>=.87?"La valeur de $|r|$ est proche de $1$ : avec le repère $0{,}87$ retenu dans ce chapitre, la corrélation linéaire est forte.":"La valeur de $|r|$ est inférieure au repère $0{,}87$ du chapitre : la série n’a pas une forte corrélation linéaire selon ce repère."}
Ce constat n’établit ni causalité ni certitude pour une observation individuelle. Une estimation hors de l’intervalle observé est une extrapolation, à interpréter avec prudence.`;
}
