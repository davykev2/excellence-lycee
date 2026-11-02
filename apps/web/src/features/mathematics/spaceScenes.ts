import { add3,scale3,sub3,unit3,orthogonalProjection,planeThrough,circleInPlane,type Vec3,type SpaceScene,type SpacePlane,type SpaceLine } from "./spaceModels";
export const SPACE_BLUE="#176194",SPACE_GREEN="#23795d",SPACE_ORANGE="#b46d1b",SPACE_PURPLE="#7950a0";
const pl=(point:Vec3,normal:Vec3,label="P",size=4,color=SPACE_BLUE):SpacePlane=>({point,normal,label,size,color});
const ln=(point:Vec3,direction:Vec3,label="D",length=5,color=SPACE_ORANGE):SpaceLine=>({point,direction,label,length,color});
const points=(entries:Record<string,Vec3>)=>Object.entries(entries).map(([label,point])=>({label,point}));
const blank=(title:string,description:string):SpaceScene=>({title,description,planes:[],lines:[],points:[],paths:[]});
function cube(pavé=false):SpaceScene{
  const z=pavé?2.5:4,P:Record<string,Vec3>={A:[0,0,0],B:[4,0,0],C:[4,4,0],D:[0,4,0],E:[0,0,z],F:[4,0,z],G:[4,4,z],H:[0,4,z]};
  const scene=blank(pavé?"Pavé droit ABCDEFGH":"Cube ABCDEFGH","Les arêtes qui se rejoignent en un sommet sont perpendiculaires deux à deux.");
  scene.points=points(P);
  for(const[a,b]of["AB","BC","CD","DA","EF","FG","GH","HE","AE","BF","CG","DH"])scene.paths.push({points:[P[a],P[b]],color:SPACE_BLUE});
  return scene;
}
export function summarySpaceScene(preset:string,caseIndex=0,t=1):SpaceScene{
  if(preset==="cube")return cube();
  const scene=blank("Géométrie de l’espace","");
  if(preset==="normal"){
    scene.title="Un vecteur normal et deux directions du plan";scene.description="n est orthogonal à u et à v. Les deux directions u et v ne sont pas colinéaires.";
    const A:Vec3=[0,0,0],n:Vec3=[1,1,2],u:Vec3=[2,0,-1],v:Vec3=[0,2,-1];
    scene.planes=[pl(A,n)];scene.points=points({A});
    scene.paths=[{points:[A,n],color:SPACE_ORANGE,arrow:true},{points:[A,u],color:SPACE_GREEN,arrow:true},{points:[A,v],color:SPACE_PURPLE,arrow:true}];
    scene.points.push(...points({n,u,v}));return scene;
  }
  if(preset==="projection"){
    scene.title="Distance d’un point à un plan";const H:Vec3=[0,0,0],n:Vec3=[1,2,-3],A=add3(H,scale3(unit3(n),t));
    scene.description="H est le projeté orthogonal de A. Distance AH = "+Math.abs(t).toFixed(1)+" unité(s). Le signe du déplacement change le côté, pas la distance.";
    scene.planes=[pl(H,n,"P",3.5)];scene.points=points({A,H});scene.paths=[{points:[H,A],color:SPACE_ORANGE,dashed:true}];return scene;
  }
  if(preset==="parameter"){
    scene.title="Un même paramètre pour trois coordonnées";const A:Vec3=[1,2,3],u:Vec3=[-1,1,2],M=add3(A,scale3(u,t));
    scene.description="A(1 ; 2 ; 3), u(−1 ; 1 ; 2). Pour t = "+t.toFixed(1)+", M("+M.map(x=>x.toFixed(1)).join(" ; ")+").";
    scene.lines=[ln(A,u,"D",7)];scene.points=points({A,M});scene.paths=[{points:[A,M],color:SPACE_GREEN,arrow:true}];return scene;
  }
  if(preset==="two-lines"){
    const labels=["Sécantes","Strictement parallèles","Non coplanaires","Confondues"];
    scene.title="Deux droites : "+labels[caseIndex];scene.description=["Les deux droites se coupent en I.","Même direction, aucun point commun.","Directions non parallèles et aucun point commun.","Les deux représentations définissent la même droite."][caseIndex];
    scene.lines=[ln([0,0,0],[1,0,0],"D",4,SPACE_BLUE),ln(caseIndex===1?[0,2,0]:caseIndex===2?[0,0,2]:[0,0,0],caseIndex===1||caseIndex===3?[1,0,0]:[0,1,0],"D′",caseIndex===3?3:4,SPACE_ORANGE)];
    if(caseIndex===0)scene.points=points({I:[0,0,0]});return scene;
  }
  if(preset==="line-plane"){
    scene.title=["Droite sécante au plan","Droite strictement parallèle","Droite incluse dans le plan","Droite orthogonale au plan"][caseIndex];scene.description=["Un seul point commun I.","Aucun point commun.","Tous les points de la droite appartiennent au plan.","La direction de la droite est une normale au plan."][caseIndex];
    scene.planes=[pl([0,0,0],[0,0,1])];scene.lines=[ln([0,0,caseIndex===1?2:0],caseIndex===3?[0,0,1]:caseIndex===0?[1,1,1]:[1,1,0])];
    if(caseIndex===0||caseIndex===3)scene.points=points({I:[0,0,0]});return scene;
  }
  if(preset==="two-planes"){
    scene.title=["Plans sécants","Plans strictement parallèles","Plans confondus","Plans perpendiculaires"][caseIndex];scene.description=["L’intersection est une droite D.","Les normales sont colinéaires, mais les plans n’ont aucun point commun.","Les deux équations décrivent le même ensemble de points.","Les normales sont orthogonales ; l’intersection est une droite."][caseIndex];
    scene.planes=[pl([0,0,0],[0,0,1],"P",4),pl([0,0,caseIndex===1?2:0],caseIndex===0?[1,0,1]:caseIndex===3?[1,0,0]:[0,0,1],"Q",caseIndex===2?3:4,SPACE_GREEN)];
    if(caseIndex===0||caseIndex===3)scene.lines=[ln([0,0,0],[0,1,0],"D",4.5)];
    return scene;
  }
  if(preset==="eval-line-plane"){
    scene.title="Droite parallèle et droite sécante";scene.description="AB est strictement parallèle à P. D coupe P en I(−2 ; 2 ; 1).";
    scene.planes=[pl([-2,2,1],[2,-1,1],"P",4)];scene.lines=[ln([1,2,-3],[-1,-1,1],"AB",5,SPACE_GREEN),ln([-2,2,1],[1,-1,4])];scene.points=points({A:[1,2,-3],B:[0,1,-2],I:[-2,2,1]});return scene;
  }
  if(preset==="apply-line-plane"){
    scene.title="Intersection I(6 ; 1 ; 13)";scene.description="La valeur t = 4 donne le point commun.";
    scene.planes=[pl([6,1,13],[3,-2,-1])];scene.lines=[ln([6,1,13],[1,-1,3])];scene.points=points({I:[6,1,13]});return scene;
  }
  if(preset==="eval-three-points"||preset==="apply-three-points"){
    const apply=preset.startsWith("apply"),A:Vec3=apply?[2,1,3]:[1,2,-3],B:Vec3=apply?[-1,2,-3]:[0,1,-2],C:Vec3=apply?[3,-2,-1]:[1,-1,0],n:Vec3=apply?[11,9,-4]:[0,1,1];
    scene.title="Le plan passant par A, B et C";scene.description=apply?"11x + 9y − 4z − 19 = 0.":"y + z + 1 = 0.";
    scene.planes=[pl(A,n,"ABC",5)];scene.points=points({A,B,C});scene.paths=[{points:[A,B,C,A],color:SPACE_GREEN}];return scene;
  }
  if(preset==="eval-two-lines"||preset==="apply-two-lines"){
    const apply=preset.startsWith("apply");scene.title="Comparer les trois coordonnées";scene.description=apply?"D₁ et D₂ sont non coplanaires.":"D₁ ∥ D₂ ; D₁ et D₃ sont non coplanaires.";
    scene.lines=apply?[ln([4,-1,3],[1,1,5],"D₁",6,SPACE_BLUE),ln([2,7,2],[4,-6,3],"D₂",6)]:[ln([3,1,0],[1,2,3],"D₁",6,SPACE_BLUE),ln([1,4,-2],[-2,-4,-6],"D₂",6,SPACE_GREEN),ln([0,-2,7],[3,1,-2],"D₃",6)];return scene;
  }
  if(preset==="eval-two-planes"||preset==="apply-two-planes"){
    const apply=preset.startsWith("apply");scene.title=apply?"Deux plans perpendiculaires":"Des normales aux positions relatives";scene.description=apply?"(3 ; 1 ; −4) · (1 ; −3 ; 0) = 0.":"P₁ et P₂ sont sécants. P₂ et P₃ sont strictement parallèles.";
    scene.planes=apply?[pl([-1,0,1],[3,1,-4],"P"),pl([-1,0,1],[1,-3,0],"Q",4,SPACE_GREEN)]:[pl([-1,0,0],[1,1,1],"P₁"),pl([2,0,0],[2,-1,1],"P₂",4,SPACE_GREEN),pl([5,0,0],[2,-1,1],"P₃",4,SPACE_PURPLE)];return scene;
  }
  return scene;
}
export function bankSpaceScene(n:number):SpaceScene{
  if(n===1||n===2)return cube(n===1);
  const s=blank("Exercice "+n+" · Construction dans l’espace","");
  if(n===7){s.lines=[ln([-2,2,1],[1,-1,4],"D",6,SPACE_BLUE),ln([3,-2,1],[1,3,1],"D′",6)];s.description="Deux droites non coplanaires.";}
  if(n===8){const M:Vec3=[8,10,5],H:Vec3=[2,1,8];s.planes=[pl(H,[2,3,-1],"ABC",5)];s.lines=[ln(scale3(add3(M,H),.5),[2,3,-1],"D",9)];s.points=points({A:[-1,1,2],B:[0,0,1],C:[0,-1,-2],M,H});s.description="La droite de normale (2 ; 3 ; −1) passe par M et coupe le plan en H(2 ; 1 ; 8).";}
  if(n===9){const I:Vec3=[-1,0,-1];s.planes=[pl(I,[2,-1,5]),pl(I,[-3,4,2],"P′",4,SPACE_GREEN)];s.lines=[ln(I,[-22,-19,5])];s.points=points({I});s.description="D est l’intersection des deux plans.";}
  if(n===10){s.planes=[pl([-2,0,0],[2,-1,3]),pl([.25,0,0],[2,-1,3],"P′",4,SPACE_GREEN)];s.description="Deux plans strictement parallèles.";}
  if(n===11){const E:Vec3=[4,2,-1],P=planeThrough([-2,0,0],[3,-4,0]),H=orthogonalProjection(E,P);s.planes=[pl(H,P.normal,"Q")];s.points=points({E,H});s.paths=[{points:[E,H],color:SPACE_ORANGE,dashed:true}];s.description="EH = 2. H est le projeté orthogonal de E.";}
  if(n===12){const A:Vec3=[3,0,0],Q=planeThrough([.5,0,0],[1,1,-2]),H=orthogonalProjection(A,Q);s.planes=[pl(A,Q.normal),pl(H,Q.normal,"P′",4,SPACE_GREEN)];s.points=points({A,H});s.paths=[{points:[A,H],color:SPACE_ORANGE,dashed:true}];s.description="La distance est AH = 5/(2√6).";}
  if(n===13){const A:Vec3=[5,2,3],B:Vec3=[4,-2,1],C:Vec3=[2,4,-5],H=orthogonalProjection(A,planeThrough(C,[1,4,2]));s.planes=[pl(H,[1,4,2],"P",7)];s.lines=[ln(A,sub3(B,A),"AB",8)];s.points=points({A,B,C});s.description="P passe par C ; sa normale est parallèle à AB.";}
  if(n===17){const A:Vec3=[0,1,1],B:Vec3=[2,3,-1],C:Vec3=[-3,4,1];s.planes=[pl(A,[1,1,2],"ABC",5)];s.points=points({A,B,C});s.paths=[{points:[A,B,C,A],color:SPACE_GREEN}];s.description="x + y + 2z − 3 = 0.";}
  if(n===18){s.planes=[pl([-2,0,0],[6,-4,3],"ABC"),pl([-2,0,0],[2,3,0],"Q",4,SPACE_GREEN)];s.points=points({A:[-2,0,0],B:[0,3,0],C:[0,0,-4]});s.description="Q : 2x + 3y + 4 = 0 est l’un des plans possibles.";}
  if(n===19){s.planes=[pl([-3,0,0],[1,-1,0],"P"),pl([2,-5,0],[1,1,-2],"Π",5,SPACE_GREEN)];s.lines=[ln([2,-5,0],[1,1,1])];s.description="D est incluse dans Π et strictement parallèle à P ; Π est perpendiculaire à P.";}
  if(n===20){s.planes=[pl([-1,0,1],[1,1,1],"P"),pl([-1,0,1],[2,1,1],"Q",4,SPACE_GREEN)];s.lines=[ln([-1,0,1],[0,1,-1],"D"),ln([1,-3,-1],[0,1,1],"D′",5,SPACE_PURPLE)];s.description="Cas particulier a = 2, b = 1. Les directions de D et D′ sont orthogonales.";}
  if(n===21){s.planes=[pl([-2,1,-1],[3,1,-2],"P₁"),pl([-2,1,-1],[1,0,-2],"P₂",4,SPACE_GREEN),pl([-2,1,-1],[2,-1,-1],"ABC",4,SPACE_PURPLE)];s.lines=[ln([-2,1,-1],[2,-4,1])];s.points=points({I:[-2,1,-1]});s.description="Les trois plans se rencontrent en I(−2 ; 1 ; −1).";}
  if(n===22){s.planes=[pl([1,0,1],[1,1,-1])];s.lines=[ln([1,-3,-2],[2,1,3])];s.points=points({A:[1,0,1],B:[1,-3,-2]});s.description="Le plan x + y − z = 0 contient A et toute la droite D.";}
  if(n===23){s.planes=[pl([1,0,0],[1,-2,1]),pl([1,0,0],[2,-1,1],"P′",4,SPACE_GREEN)];s.lines=[ln([1,0,0],[-1,1,3])];s.description="D : (1 − t ; t ; 3t).";}
  if(n===24){const A:Vec3=[.5,-1,.75];s.lines=[ln(A,[1.5,4,-1])];s.points=points({A});s.description="A(1/2 ; −1 ; 3/4), directeur (3/2 ; 4 ; −1).";}
  if(n===25){const A:Vec3=[3,2,0];s.planes=[pl(A,[0,-5,1])];s.points=points({A});s.paths=[{points:[A,add3(A,[2,1,5])],color:SPACE_GREEN,arrow:true},{points:[A,add3(A,[-4,-1,-5])],color:SPACE_ORANGE,arrow:true}];s.description="Deux directions non colinéaires ; plan z − 5y + 10 = 0.";}
  if(n===26){const I:Vec3=[-3,4,3];s.planes=[pl(I,[2,1,0])];s.lines=[ln(I,[1,-2,1],"D",5,SPACE_GREEN),ln(I,[-1,2,1],"Δ")];s.points=points({I});s.description="D et Δ sont sécantes en I, et contenues dans P.";}
  if(n===27){s.planes=[pl([2,1,4],[1,0,-2])];s.lines=[ln([1,-2,2],[1,-1,3],"D",6,SPACE_GREEN),ln([0,1,3],[2,-1,1],"Δ",6)];s.points=points({A:[2,1,4]});s.description="Le plan x − 2z + 6 = 0 contient A et Δ, pas toute la droite D.";}
  if(n===28){
    const G:Vec3=[2,0,-5],H:Vec3=[-1,-3,-2],nP:Vec3=[1,1,-1];
    s.planes=[pl(H,nP,"P",6)];s.points=points({G,H});s.paths=[{points:[G,H],color:SPACE_ORANGE,dashed:true},{points:circleInPlane(H,nP,3),color:SPACE_GREEN}];
    for(const n of [[1,0,0],[0,1,0],[0,0,1]] as Vec3[])s.paths.push({points:circleInPlane(G,n,6),color:SPACE_BLUE,dashed:true});
    s.description="Sphère de centre G et rayon 6 ; cercle de centre H et rayon 3. Les pointillés représentent trois grands cercles de la sphère.";
  }
  if(n===29){const I:Vec3=[58,69/2,-185/2];s.planes=[pl(I,[17,3,11],"P",5)];s.lines=[ln(I,[2,1,-3],"D",7)];s.points=points({I});s.description="Vue locale près de I(58 ; 69/2 ; −185/2). La droite et le plan entiers se coupent ; le dessin ne représente pas des dimensions réelles.";}
  return s;
}
