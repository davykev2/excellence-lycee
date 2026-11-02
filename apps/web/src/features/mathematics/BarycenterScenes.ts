import { add2,scale2,midpoint,barycenter,apollonius,gridPoints,type Point2 } from "./barycenterModels";
export interface GeoScene {
  title:string;points:Record<string,Point2>;segments:Array<[string,string]>;highlight?:Array<[string,string]>;
  circles?:Array<{center:Point2;radius:number;sphere?:boolean}>;
  polygons?:Point2[][];grid?:boolean;caption?:string;
}
const A:Point2=[0,0],B:Point2=[6,0],C:Point2=[1.5,4],D:Point2=[1.5,4];
const tri=(title:string):GeoScene=>({title,points:{A,B,C},segments:[["A","B"],["B","C"],["C","A"]]});
const para=(title:string):GeoScene=>({title,points:{A,B,C:[7.5,4],D},segments:[["A","B"],["B","C"],["C","D"],["D","A"]]});
const m=(...points:Point2[])=>barycenter(points,points.map(()=>1))!;
export function barycenterScene(preset:string,blank=false):GeoScene{
  if(preset==="partial"){
    const s:GeoScene={title:"Milieux opposés d’un tétraèdre",points:{A:[0,0],B:[5,0],C:[1,3],D:[3,5]},segments:[["A","B"],["A","C"],["A","D"],["B","C"],["B","D"],["C","D"]]};
    s.points.K=midpoint(s.points.A,s.points.B);s.points.L=midpoint(s.points.C,s.points.D);s.points.G=midpoint(s.points.K,s.points.L);s.highlight=[["K","L"]];
    s.caption="Représentation en perspective d’un tétraèdre. G est le milieu de [KL].";return s;
  }
  if(preset.startsWith("alignment-")){
    const s=tri("Alignement par regroupement");
    if(preset==="alignment-worked"){s.points.P=add2(scale2(C,2),scale2(B,-1));s.points.Q=scale2(C,2/3);s.points.R=midpoint(A,B);s.highlight=[["P","R"]];}
    else{s.points.D=C;delete s.points.C;s.segments=[["A","B"],["B","D"],["D","A"]];s.points.I=scale2(B,2/3);s.points.M=scale2(C,.5);s.points.C=barycenter([C,s.points.I],[1,3])!;s.segments.push(["D","I"]);s.highlight=[["B","M"]];}
    return s;
  }
  if(preset.startsWith("concurrence-")){
    const s=tri("Trois droites concourantes");
    const w=preset==="concurrence-worked"?2:3;
    s.points.I=barycenter([A,B],[2,1])!;s.points.J=barycenter([B,C],[1,w])!;s.points.K=barycenter([A,C],[2,w])!;s.points.G=barycenter([A,B,C],[2,1,w])!;
    s.highlight=[["C","I"],["A","J"],["B","K"]];return s;
  }
  const n=Number.parseInt(preset,10);
  if(n===10){const s=tri("Regroupement en I");s.points.I=midpoint(A,B);s.points.G=barycenter([s.points.I,C],[4,3])!;s.highlight=[["I","C"]];return s;}
  if(n===14){const s=tri("Cercle passant par A");s.points.B=[4,0];s.points.C=[0,3];s.points.I=midpoint(s.points.B,s.points.C);s.points.G=scale2(s.points.I,-1);s.highlight=[["I","G"]];s.circles=[{center:s.points.G,radius:2.5}];return s;}
  if(n===15||n===17){return{title:n===15?"Trois points alignés et un cercle":"Le niveau 2 est réduit à C",points:{A:[0,0],B:[2,0],C:[1,0],...(n===15?{G:[3,0] as Point2}:{})},segments:[["A","B"]],circles:n===15?[{center:[3,0],radius:2}]:[],caption:n===17?"Le niveau 0 est vide ; le niveau 2 contient seulement C.":undefined};}
  if(n===16){return{title:"Droite perpendiculaire à (AI)",points:{A:[0,0],B:[4,0],C:[0,2],I:[2,1],H:[1.5,.75],P:[-.5,4.75],Q:[3.5,-3.25]},segments:[["A","B"],["A","C"],["B","C"],["A","I"]],highlight:[["P","Q"]]};}
  if(n===18){const f=apollonius([0,0],[9,0],9);if(f.kind!=="circle")throw new Error("Rapport attendu");return{title:"Sphère de diamètre [IJ]",points:{A:[0,0],B:[9,0],G:f.center,I:f.i,J:f.j},segments:[["A","J"]],circles:[{center:f.center,radius:f.radius,sphere:true}],caption:"Représentation en perspective de la sphère ; son diamètre [IJ] appartient à (AB)."};}
  if(n===21){const s=para("Deux réductions vectorielles");s.points.O=m(s.points.A,s.points.C);s.points.N=scale2(D,-1);s.highlight=[["D","N"],["B","D"]];s.segments.push(["A","C"],["B","D"]);return s;}
  if(n===22){
    const s:GeoScene={title:"Cas "+preset.slice(-1),points:{A:[0,0],B:[2,0],C:[2,2],D:[0,2]},segments:[["A","B"],["B","C"],["C","D"],["D","A"]]};
    if(preset.endsWith("a")){s.points.H=[2,-2];s.circles=[{center:s.points.H,radius:2}];s.caption="a = 2 sur cette figure ; centre H(a ; −a), rayon a.";}
    if(preset.endsWith("c")){s.points.G=[4,2];s.circles=[{center:s.points.C,radius:2*Math.sqrt(5)}];s.caption="Cercle de centre C et de rayon a√5.";}
    if(preset.endsWith("d")){s.points.H=[3,0];s.points.K=[5/3,8/3];s.circles=[{center:s.points.K,radius:2*Math.sqrt(5)/3}];s.caption="MH = 2MC ; centre K(5a/6 ; 4a/3).";}
    return s;
  }
  if(n===23){const s=tri(preset.endsWith("a")?"Cercle de diamètre [IJ]":"Cercle de diamètre [PQ]");const a=preset.endsWith("a");
    const p=a?midpoint(A,B):add2(scale2(B,2),scale2(A,-1)),q=a?midpoint(B,C):barycenter([B,C],[1,2])!;
    s.points[a?"I":"P"]=p;s.points[a?"J":"Q"]=q;s.circles=[{center:midpoint(p,q),radius:Math.hypot(p[0]-q[0],p[1]-q[1])/2}];return s;}
  if(n===24){return{title:"Un grand carreau représente une unité",points:{...gridPoints,...(!blank?{G:barycenter(Object.values(gridPoints),[2,-1,3,1,2])!}:{})},segments:[],grid:true};}
  if(n===25){const s=tri("Cercle d’une égalité de normes");s.points.C=[3,3*Math.sqrt(3)];s.points.G=barycenter([A,B,s.points.C],[1,-2,3])!;s.circles=[{center:s.points.G,radius:3*Math.sqrt(3)}];return s;}
  if(n===26){return{title:"Différence de carrés constante",points:{A:[0,0],B:[4,0],I:[2,0],H:[6,0],P:[6,-3],Q:[6,3]},segments:[["A","H"]],highlight:[["P","Q"]]};}
  if(n===29){const s=tri("Projection et milieu");s.points.C=[3,3*Math.sqrt(3)];s.points.I=midpoint(B,s.points.C);s.points.H=[4.5,0];s.points.K=midpoint(s.points.I,s.points.H);s.highlight=[["I","H"]];return s;}
  if(n===30){const s:GeoScene={title:"Un cercle et une médiatrice",points:{A:[3,4],B:[-1,2],G:[.6,2.8],H:[7/9,26/9],U:[1.4,3.2],V:[4.6,4.8],P:[0,10],Q:[6,-2]},segments:[["A","B"],["U","V"]],highlight:[["P","Q"]],circles:[{center:[7/9,26/9],radius:5}],caption:"Cercle de rayon 5 ; droite 2x + y − 10 = 0."};return s;}
  if(n===32){const s=para("Milieux et intersection K");s.points.I=midpoint(s.points.B,s.points.C);s.points.J=midpoint(s.points.C,s.points.D);s.points.K=add2(scale2(B,.4),scale2(D,.8));s.segments.push(["A","J"],["D","I"]);if(!blank)s.highlight=[["A","K"],["D","K"]];return s;}
  if(n===33){return{title:"Sphère de centre I",points:{A:[0,0],B:[2,0],C:[0,1],I:[2,.5]},segments:[["A","B"],["A","C"],["A","I"]],circles:[{center:[2,.5],radius:Math.sqrt(5)/2,sphere:true}],caption:"Projection de la sphère dans l’espace ; ce n’est pas seulement un cercle du plan (ABC)."};}
  if(n===34){const s=tri("Milieux et symétrique");s.points.I=midpoint(B,C);s.points.J=midpoint(C,A);s.points.K=midpoint(A,B);s.points.L=scale2(C,.75);s.points.M=scale2(B,1.5);s.segments.push(["I","J"],["J","K"],["K","I"],["B","M"]);if(!blank)s.highlight=[["L","M"]];return s;}
  if(n===35){const s=tri("G est le milieu de [AA′]");s.points.B=[1,0];s.points.C=[.5,Math.sqrt(3)/2];s.points["A′"]=midpoint(s.points.B,s.points.C);s.points.G=midpoint(A,s.points["A′"]);s.segments.push(["A","A′"]);s.circles=[{center:s.points.G,radius:Math.sqrt(3)/4}];return s;}
  if(n===36){const s=tri("Partage des trois côtés en tiers");s.points.I=scale2(B,1/3);s.points.J=scale2(B,2/3);s.points.K=barycenter([B,C],[2,1])!;s.points.L=barycenter([B,C],[1,2])!;s.points.M=scale2(C,2/3);s.points.N=scale2(C,1/3);s.segments.push(["I","L"],["J","M"],["K","N"]);if(!blank)s.points.G=m(A,B,C);return s;}
  if(n===37){const s=para("Deux alignements");s.points.K=scale2(D,.5);s.points.I=scale2(B,1/3);s.points.J=scale2(B,2/3);s.points.G=add2(scale2(B,.5),scale2(D,.25));s.points.M=add2(scale2(B,2/3),scale2(D,.5));s.segments.push(["D","J"],["K","B"],["K","M"],["M","J"]);if(!blank)s.highlight=[["C","I"]];return s;}
  if(n===38){const s=tri(preset.endsWith("ceva")?"Ceva : trois droites concourantes":"Ménélaüs : trois points alignés");
    if(preset.endsWith("ceva")){s.points["A′"]=midpoint(B,C);s.points["B′"]=midpoint(C,A);s.points["C′"]=midpoint(A,B);s.points.G=m(A,B,C);s.highlight=[["A","A′"],["B","B′"],["C","C′"]];}
    else{s.points["A′"]=midpoint(B,C);s.points["B′"]=scale2(C,2);s.points["C′"]=scale2(B,2/3);s.highlight=[["B′","C′"]];s.segments.push(["C","B′"]);}
    return s;
  }
  if(n===39){return{title:"Triangles en perspective de centre O",points:{O:[0,0],A:[2,1],B:[5,1],C:[3,4],"A′":[4,2],"B′":[7,1.4],"C′":[3.6,4.8],K:[9,1],J:[3.5,5.5],I:[.2,8.2]},segments:[["O","A′"],["O","B′"],["O","C′"],["A","K"],["A′","K"],["A","J"],["A′","J"],["B","I"],["B′","I"]],highlight:[["I","K"]]};}
  if(n===40){const s=tri("Aires et coordonnées barycentriques");const M=barycenter([A,B,C],[2,3,4])!;s.points.M=M;s.polygons=[[M,B,C],[M,C,A],[M,A,B]];s.segments.push(["M","A"],["M","B"],["M","C"]);s.caption="Les trois aires positives sont les poids des sommets opposés. Le dessin illustre un point M intérieur." ;return s;}
  throw new Error("Figure barycentrique inconnue : "+preset);
}
