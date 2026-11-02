import { complexRoots,type ComplexPair } from "./complexMath";
export interface ComplexScene{
 title:string;note:string;points:Array<{p:ComplexPair;label:string;excluded?:boolean}>;
 circles?:Array<{center:ComplexPair;r:number}>;
 segments?:ComplexPair[][];lines?:Array<{p:ComplexPair;d:ComplexPair;ray?:boolean}>;
 arcs?:Array<{center:ComplexPair;r:number;start:number;end:number}>;
}
const pt=(label:string,x:number,y:number,excluded=false)=>({label,p:[x,y] as ComplexPair,excluded});
const polygon=(points:ComplexScene["points"])=>[...points.map(p=>p.p),points[0].p];
const scene=(title:string,points:ComplexScene["points"],note="",extra:Partial<ComplexScene>={}):ComplexScene=>({title,points,note,...extra});
const roots=(z:ComplexPair,n:number,title:string)=>{const values=complexRoots(z,n);return scene(title,values.map((p,k)=>({p,label:"z"+k})),
 "Les points sont régulièrement espacés sur le cercle centré en O.",{circles:[{center:[0,0],r:Math.hypot(...values[0])}],segments:values.length>2?[[...values,values[0]]]:[values]});};
export function complexScenes(preset:string,exerciseNumber?:number,angle=45,n=3,radius=2):ComplexScene[]{
 const t=angle*Math.PI/180;
 if(exerciseNumber===undefined){
  if(preset==="affix")return[scene("Affixe et coordonnées",[pt("M",radius*Math.cos(t),radius*Math.sin(t))],"z = x + iy ; le module est la distance OM.",{segments:[[[0,0],[radius*Math.cos(t),0],[radius*Math.cos(t),radius*Math.sin(t)]]],circles:[{center:[0,0],r:radius}]})];
  if(preset==="argument")return[scene("Cercle trigonométrique",[pt("M",Math.cos(t),Math.sin(t))],"Un tour complet ajoute 2π à l’argument sans déplacer le point.",{circles:[{center:[0,0],r:1}],segments:[[[0,0],[Math.cos(t),Math.sin(t)]]],arcs:[{center:[0,0],r:.35,start:0,end:t}]})];
  if(preset==="moivre")return[scene("Moivre sur le cercle unité",[pt("z",Math.cos(t),Math.sin(t)),pt("zⁿ",Math.cos(n*t),Math.sin(n*t))],"Le module reste 1 et l’angle est multiplié par n.",{circles:[{center:[0,0],r:1}],segments:[[[0,0],[Math.cos(t),Math.sin(t)]],[[0,0],[Math.cos(n*t),Math.sin(n*t)]]]})];
  if(preset==="roots")return[roots([radius*Math.cos(t),radius*Math.sin(t)],n,"Racines n-ièmes")];
  if(preset==="geometry")return complexScenes("",54);
  if(preset==="eval-quartic")return[scene("Les quatre racines du polynôme",[pt("i√2",0,Math.SQRT2),pt("−i√2",0,-Math.SQRT2),pt("z₃",-.5,Math.sqrt(11)/2),pt("z₄",-.5,-Math.sqrt(11)/2)])];
  if(preset==="eval-geometry"){const points=[pt("A",2,0),pt("B",5,0),pt("C",5,3),pt("D",2,3)],E=pt("E",3.5,1.5*Math.sqrt(3)),F=pt("F",2.75,1.5+.75*Math.sqrt(3));return[scene("Carré et triangle équilatéral",[...points,E,F],"F est le milieu de [ED].",{segments:[polygon(points),[points[0].p,E.p,points[1].p],[points[3].p,E.p]]})];}
  if(preset==="eval-application")return[scene("Cercle de centre E",[pt("A",3,6),pt("B",-1,-2),pt("C",-3,4),pt("E",1,2)],"EA = EB = EC = 2√5.",{circles:[{center:[1,2],r:2*Math.sqrt(5)}]}),scene("Lieu de la question 4",[pt("U",1,-2,true),pt("V",2,0,true)],"Le cercle complet est pris, sauf les deux extrémités.",{circles:[{center:[1.5,-1],r:Math.sqrt(5)/2}]})];
  return[];
 }
 const k=exerciseNumber;
 if(k===19)return[scene("Médiatrice de [AD]",[pt("A",1,0),pt("D",0,-1)],"MA = MD, donc y = −x.",{lines:[{p:[0,0],d:[1,-1]}],segments:[[[1,0],[0,-1]]]}),scene("Cercle de diamètre [CD]",[pt("C",-1,0,true),pt("D",0,-1)],"C exclu ; D inclus.",{circles:[{center:[-.5,-.5],r:Math.SQRT1_2}]})];
 if(k===24)return[scene("Points et vecteur",[pt("A",-7,5),pt("B",0,3),pt("w",-3,9)],"Le vecteur w est représenté depuis O.",{segments:[[[0,0],[-3,9]]]})];
 if(k===25)return[scene("Points et vecteurs images",[pt("1+i",1,1),pt("−3i",0,-3),pt("7",7,0)],"Le vecteur d’affixe 1+i aboutit au point image de 1+i lorsqu’il part de O.",{segments:[[[0,0],[1,1]],[[0,0],[7,0]]]})];
 if(k===26){const p=[pt("A",1,1),pt("B",-2,3),pt("C",4,3)];return[scene("Différences d’affixes",p,"Un vecteur AB a pour affixe zB − zA.",{segments:[polygon(p)]})];}
 if(k===27)return[scene("Trouver B depuis A",[pt("A",-4,3),pt("B",-3,4)],"AB a pour coordonnées (1 ; 1).",{segments:[[[-4,3],[-3,4]]]})];
 if(k===29)return[scene("Milieu de [PQ]",[pt("P",1,-1),pt("Q",4,5),pt("I",2.5,2)],"PI = IQ ; PQ = 3√5.",{segments:[[[1,-1],[4,5]]]})];
 if(k===31)return[scene("Arguments principaux",[pt("1",1,0),pt("i",0,1),pt("−i",0,-1),pt("−1",-1,0),pt("eⁱπ/³",.5,Math.sqrt(3)/2)],"L’argument principal de −1 est π.",{circles:[{center:[0,0],r:1}]})];
 if(k===33)return[scene("Modules et directions",[pt("z₁",1,Math.sqrt(3)),pt("z₂",Math.sqrt(3),-3),pt("z₃",-Math.SQRT2,-Math.sqrt(6))],"Les arguments donnent les directions, les modules donnent les distances à O.")];
 if(k===48)return[roots([1,0],3,"Racines cubiques de 1"),roots([1,-1],3,"Racines cubiques de 1−i"),roots([-2,0],3,"Racines cubiques de −2")];
 if(k===49)return[roots([1,0],4,"Racines quatrièmes de 1")];
 if(k===53)return[scene("Cercle de centre I",[pt("I",0,1)],"Rayon 2.",{circles:[{center:[0,1],r:2}]}),scene("Médiatrice de [AB]",[pt("A",1,-2),pt("B",-2,1)],"La médiatrice a pour équation y = x.",{lines:[{p:[0,0],d:[1,1]}],segments:[[[1,-2],[-2,1]]]})];
 if(k===54){const p=[pt("A",1,0),pt("B",1,2),pt("C",1+Math.sqrt(3),1)];return[scene("Triangle équilatéral indirect",p,"AB = AC = BC = 2 ; angle (AB ; AC) = −π/3.",{segments:[polygon(p)]})];}
 if(k===55)return[scene("E,F,G,H et le milieu I",[pt("E",-3,1),pt("F",0,2),pt("G",-2.5,0),pt("H",1.5,-3),pt("I",-1.5,1.5)],"I est le milieu de [EF].",{segments:[[[-3,1],[0,2],[1.5,-3],[-3,1]]]})];
 if(k===60){const r=2**t;return[scene("Solutions conjuguées",[pt("A",r*Math.cos(t),r*Math.sin(t)),pt("B",r*Math.cos(t),-r*Math.sin(t))],"OAB est équilatéral pour θ = 30° ou 150°.",{circles:[{center:[0,0],r}],segments:[[[0,0],[r*Math.cos(t),r*Math.sin(t)],[r*Math.cos(t),-r*Math.sin(t)],[0,0]]]})];}
 if(k===61){const p=[pt("A",2,0),pt("B",0,1),pt("C",-1,-1)];return[scene("Triangle rectangle isocèle en B",p,"BA = BC = √5 ; AC = √10.",{segments:[polygon(p)]})];}
 if(k===62){const p=[pt("A",2,0),pt("B",0,1),pt("C",-2,0),pt("D",0,-1)];return[scene("Losange, pas carré",p,"Quatre côtés de longueur √5 ; diagonales 4 et 2.",{segments:[polygon(p),[[2,0],[-2,0]],[[0,1],[0,-1]]]})];}
 if(k===65)return[roots([4.5*Math.sqrt(3),-13.5],5,"Cinq racines, rayon √3")];
 if(k===66)return[scene("Z réel",[pt("U",2,0),pt("V",0,1,true)],"Droite x + 2y − 2 = 0, V exclu.",{lines:[{p:[2,0],d:[-2,1]}]}),scene("Z imaginaire pur",[pt("U",2,0),pt("V",0,1,true)],"Cercle de diamètre [UV], V exclu.",{circles:[{center:[1,.5],r:Math.sqrt(5)/2}]})];
 if(k===67)return[scene("Cercle et demi-droite",[pt("A",0,-1,true),pt("B",.5,-1.5)],"B est l’unique intersection ; A est exclu de la demi-droite.",{circles:[{center:[0,-1],r:Math.SQRT1_2}],lines:[{p:[0,-1],d:[1,-1],ray:true}]})];
 if(k===71)return[roots([81,0],4,"Carré de rayon 3")];
 if(k===72)return[roots([1,1],3,"Trois racines de 1+i"),roots([-8,0],3,"Trois racines de −8")];
 if(k===76)return[scene("Vecteur impédance Z",[pt("Z",3,2),pt("R",3,0)],"Exemple illustratif R = 3 Ω et X = 2 Ω, sans valeurs imposées par l’énoncé.",{segments:[[[0,0],[3,0],[3,2]],[[0,0],[3,2]]]})];
 if(k===77)return[scene("Impédance parallèle et gain",[pt("Z",1.5,1.5)],"Exemple illustratif R = Lω = 3 Ω : Z = 1,5 + 1,5i Ω.",{segments:[[[0,0],[1.5,1.5]]]})];
 if(k===78){const p=[pt("A",1,1),pt("B",-1,1),pt("C",-1,-1),pt("D",1,-1)],E=pt("E",-1+Math.sqrt(3),0),F=pt("F",0,-1-Math.sqrt(3));return[scene("Rotation de centre C", [...p,E,F],"E et F sont les images de B et D ; A,E,F sont alignés.",{segments:[polygon(p),[p[2].p,p[1].p],[p[2].p,E.p],[p[2].p,p[3].p],[p[2].p,F.p]],lines:[{p:E.p,d:[1-E.p[0],1]}]})];}
 if(k===79)return[scene("Demi-cercle ouvert",[pt("A",0,2,true),pt("B",1,-1,true)],"Seule la partie 3x + y < 2 convient ; les extrémités sont exclues.",{segments:[[[0,2],[1,-1]]],arcs:[{center:[.5,.5],r:Math.sqrt(2.5),start:Math.atan2(1.5,-.5),end:Math.atan2(1.5,-.5)+Math.PI}]})];
 if(k===80)return[roots([radius**6,0],6,"Hexagone régulier, côté = rayon")];
 return[];
}
