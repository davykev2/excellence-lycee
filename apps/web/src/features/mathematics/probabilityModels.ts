/** Reviewed, closed numerical models; no formula entered by a user is executed. */
export function binomialProbability(n:number,k:number,p:number):number {
  if(!Number.isInteger(n)||n<0||n>10000||!Number.isInteger(k)||!Number.isFinite(p)||p<0||p>1) throw new RangeError("Paramètres binomiaux invalides");
  if(k<0||k>n)return 0;
  if(p===0)return k===0?1:0;
  if(p===1)return k===n?1:0;
  const r=Math.min(k,n-k);
  let logCoefficient=0;
  for(let i=1;i<=r;i++)logCoefficient+=Math.log(n-r+i)-Math.log(i);
  return Math.min(1,Math.exp(logCoefficient+k*Math.log(p)+(n-k)*Math.log1p(-p)));
}
export function finiteLawParameters(values:readonly number[],masses:readonly number[]){
  validateLaw(values,masses);
  const expectation=values.reduce((sum,x,i)=>sum+x*masses[i],0);
  // Centered formula avoids a negative variance from cancellation.
  const variance=values.reduce((sum,x,i)=>sum+(x-expectation)**2*masses[i],0);
  return {expectation,variance,sigma:Math.sqrt(variance)};
}
function validateLaw(values:readonly number[],masses:readonly number[]){
  if(!values.length||values.length!==masses.length||values.some((x,i)=>!Number.isFinite(x)||(i>0&&x<=values[i-1]))||masses.some(p=>!Number.isFinite(p)||p<0||p>1)||Math.abs(masses.reduce((s,p)=>s+p,0)-1)>1e-9)throw new RangeError("Loi finie invalide");
}
export function cumulativeProbability(values:readonly number[],masses:readonly number[],t:number){
  validateLaw(values,masses);
  if(Number.isNaN(t))throw new RangeError("Abscisse invalide");
  return Math.min(1,values.reduce((sum,x,i)=>sum+(x<=t?masses[i]:0),0));
}
export interface ProbabilityTreeNode{
  label:string; weight?:string; probability?:number; outcome?:string; children?:ProbabilityTreeNode[];
}
export interface ProbabilityTreeModel{title:string;root:ProbabilityTreeNode;legend?:string}
const leaf=(label:string,weight:string,probability:number,outcome?:string):ProbabilityTreeNode=>({label,weight,probability,outcome});
function twoStage(title:string,a:string,pa:string,paValue:number,b:string,pb:string,pbValue:number,c:string,d:string,pcA:string,pcAValue:number,pcB:string,pcBValue:number):ProbabilityTreeModel{
  const complement=(v:number)=>v===.5?"1/2":String(Number((1-v).toPrecision(12))).replace(".",",");
  return {title,root:{label:"Départ",children:[
    {...leaf(a,pa,paValue),children:[leaf(c,pcA,pcAValue),leaf(d,complement(pcAValue),1-pcAValue)]},
    {...leaf(b,pb,pbValue),children:[leaf(c,pcB,pcBValue),leaf(d,complement(pcBValue),1-pcBValue)]},
  ]}};
}
export type ProbabilityCoursePreset="bag"|"coupons"|"urns"|"cdf"|"binomial";
export function probabilityTree(preset:ProbabilityCoursePreset|number,n=25):ProbabilityTreeModel|undefined{
  if(preset==="bag")return twoStage("Boules et numéros gagnants","R","2/5",2/5,"non R","3/5",3/5,"G","non G","3/4",3/4,"3/10",3/10);
  if(preset==="coupons")return twoStage("Coupon et achat","R","0,4",.4,"non R","0,6",.6,"A","non A","0,8",.8,"0,3",.3);
  if(preset==="urns")return twoStage("Choix de l’urne puis couleur","U₁","1/2",.5,"U₂","1/2",.5,"B","non B","5/8",5/8,"1/5",1/5);
  if(preset===2||preset===4)return twoStage("Vaccination puis état observé","V","4/5",4/5,"non V","1/5",1/5,"C","non C","3/20",3/20,"2/5",2/5);
  if(preset===3)return twoStage("Révisions puis résultat au BAC","R","9/10",.9,"non R","1/10",.1,"B","non B","4/5",.8,"3/10",.3);
  if(preset===5)return twoStage("Fournisseur puis présence de traces","A","4/5",.8,"B","1/5",.2,"S","non S","1/10",.1,"1/5",.2);
  if(preset===6)return {title:"Une urne choisie parmi trois",root:{label:"Départ",children:[
    {...leaf("U₁","1/3",1/3),children:[leaf("R","1/6",1/6),leaf("J","5/6",5/6)]},
    {...leaf("U₂","1/3",1/3),children:[leaf("R","3/4",3/4),leaf("J","1/4",1/4)]},
    {...leaf("U₃","1/3",1/3),children:[leaf("R","1/3",1/3),leaf("J","2/3",2/3)]},
  ]}};
  if(preset===7)return twoStage("Couleur de la boule puis du jeton","B","2/5",.4,"R","3/5",.6,"b","r","1/4",.25,"1/2",.5);
  if(preset===36)return twoStage("Groupe du test puis baisse","M","0,6",.6,"N","0,4",.4,"B","non B","0,8",.8,"0,1",.1);
  if(preset===38)return {title:"Les quatre fins possibles du jeu",root:{label:"Départ",children:[
    leaf("R₁","1/7",1/7,"+10 000 F"),
    leaf("J₁","2/7",2/7,"−5 000 F"),
    {...leaf("V₁","4/7",4/7),children:[leaf("R₂","1/6",1/6,"+8 000 F"),leaf("non R₂","5/6",5/6,"−4 000 F")]},
  ]},legend:"Le deuxième tirage n’a lieu que si la première boule est verte."};
  if(preset===39)return {title:"Dossier, écrit puis oral",root:{label:"Départ",children:[
    leaf("D","1/5",.2,"Admis"),
    {...leaf("non D","4/5",.8),children:[
      {...leaf("Écrit réussi","3/4",.75),children:[leaf("Oral réussi","2/3",2/3,"Admis"),leaf("Oral raté","1/3",1/3,"Éliminé")]},
      leaf("Écrit raté","1/4",.25,"Éliminé"),
    ]},
  ]}};
  if(preset===41)return twoStage("Le dé choisit l’urne","U₁","1/3",1/3,"U₂","2/3",2/3,"N","R","2/5",2/5,"1/6",1/6);
  if(preset===43)return twoStage("État puis résultat du test","M","0,03",.03,"non M","0,97",.97,"T","non T","0,95",.95,"0,1",.1);
  if(preset===46){
    if(!Number.isInteger(n)||n<1||n>40)throw new RangeError("n hors de l’exploration");
    const model=twoStage("Premier transfert puis transfert de retour","B",n+"/("+String(n+3)+")",n/(n+3),"N","3/"+String(n+3),3/(n+3),"B","N","3/4",.75,"1/2",.5);
    model.legend="B = blanche, N = noire. Le second tirage se fait dans U₂ après le premier transfert.";
    return model;
  }
  if(preset===47)return twoStage("Déclaration puis sincérité","Déclare A","0,47",.47,"Déclare B","0,53",.53,"Vrai","Mensonge","0,9",.9,"0,8",.8);
  if(preset===49)return {title:"Grattage puis loterie : arbre complété",root:{label:"Départ",children:[
    {...leaf("G","1/50",1/50),children:[leaf("A","3/10",.3,"190 000 F"),leaf("B","1/10",.1,"290 000 F"),leaf("R","6/10",.6,"90 000 F")]},
    {...leaf("non G","49/50",49/50),children:[leaf("A","1/70",1/70,"90 000 F"),leaf("B","1/490",1/490,"190 000 F"),leaf("R","241/245",241/245,"−10 000 F")]},
  ]},legend:"Les nombres placés aux feuilles sont les gains nets, après retrait de la mise."};
  return undefined;
}
export interface CdfModel{title:string;values:number[];masses:number[];labels:string[];xUnit:string;verticalToHorizontal?:number}
export function probabilityCdf(preset:"cdf"|number):CdfModel|undefined{
  if(preset==="cdf")return {title:"Fonction de répartition de l’exemple",values:[1,2,3,4,5],masses:[2/21,4/21,1/21,8/21,6/21],labels:["2/21","6/21","7/21","15/21","1"],xUnit:"t"};
  if(preset===15)return {title:"Fonction de répartition · exercice 15",values:[-1,1,2],masses:[2/7,4/7,1/7],labels:["2/7","6/7","1"],xUnit:"t"};
  if(preset===16)return {title:"Fonction de répartition · exercice 16",values:[-1,0,1,2,3],masses:[2/36,8/36,12/36,10/36,4/36],labels:["2/36","10/36","22/36","32/36","1"],xUnit:"t"};
  if(preset===37)return {title:"Répartition du gain · exercice 37",values:[-6,-4,-1,2,3,5],masses:Array(6).fill(1/6),labels:["1/6","2/6","3/6","4/6","5/6","1"],xUnit:"Gain (milliers de F CFA)"};
  if(preset===38)return {title:"Répartition du gain · exercice 38",values:[-5,-4,8,10],masses:[2/7,10/21,2/21,1/7],labels:["2/7","16/21","6/7","1"],xUnit:"Gain (milliers de F CFA)",verticalToHorizontal:21};
  return undefined;
}
export function treePaths(root:ProbabilityTreeNode):Array<{labels:string[];weights:string[];probability:number;outcome?:string}>{
  const result:Array<{labels:string[];weights:string[];probability:number;outcome?:string}>=[];
  const visit=(node:ProbabilityTreeNode,labels:string[],weights:string[],probability:number)=>{
    if(node.children?.length){for(const child of node.children)visit(child,[...labels,child.label],[...weights,child.weight??""],probability*(child.probability??1));}
    else result.push({labels,weights,probability,outcome:node.outcome});
  };
  visit(root,[],[],1);return result;
}
