import { family35,family36,type ConicModel,type ConicSet,type ConicPoint } from "./conicModels";
export interface ConicScene{label:string;sets:ConicSet[];note?:string;extraLines?:{point:ConicPoint;direction:ConicPoint;label:string}[]}
const central=(kind:"ellipse"|"hyperbola",axis:"x"|"y",a2:number,b2:number,h=0,k=0,rotation=0):ConicModel=>({kind,axis,a:Math.sqrt(a2),b:Math.sqrt(b2),center:[h,k],rotation});
const E=(axis:"x"|"y",a2:number,b2:number,h=0,k=0)=>central("ellipse",axis,a2,b2,h,k);
const H=(axis:"x"|"y",a2:number,b2:number,h=0,k=0)=>central("hyperbola",axis,a2,b2,h,k);
const P=(axis:"x"|"y",parameter:number,h=0,k=0,rotation=0):ConicModel=>({kind:"parabola",axis,parameter,vertex:[h,k],rotation});
const scenes=(sets:ConicSet[])=>sets.map((s,i)=>({label:"Cas "+String.fromCharCode(97+i),sets:[s]}));
export function conicScenes(preset:string,n?:number,m=2):ConicScene[]{
  if(n!==undefined){
    const data:Record<number,ConicSet[]>={
      3:[{kind:"point",point:[1.5,0]},{kind:"point",point:[.5,0]},{kind:"empty"},E("x",12,4,-2,0)],
      4:[E("y",1,.25,1,2),P("x",1,2,0),H("x",1,3,1,0),H("y",1,.5,1,0)],
      5:[P("y",1.5),P("x",-.25)],6:[P("y",1),P("x",-1.5),P("y",-2)],
      7:[E("y",49,36),E("x",25,16)],8:[E("x",9,4),E("x",25,16)],9:[E("y",9,4),E("x",25,16)],
      10:[H("x",36,49),H("y",16,25)],11:[H("x",16,4),H("x",1,4)],12:[H("y",8,4),H("y",8,12)],
      14:[P("x",8),P("x",-8)],15:[P("y",5),P("y",-2.5)],16:[E("y",25,9),E("x",4,1)],
      17:[H("y",9,25),H("x",9,1)],18:[E("x",25,9),H("x",4,1)],19:[P("x",-2)],20:[P("y",1.5)],
      21:[P("x",-8,1,2),P("y",3,-1,-1/6)],22:[E("x",16,9),E("y",16,9)],23:[H("x",16,9),H("y",16,9)],
      24:[E("y",16,9),H("y",9,4,1,-2)],25:[P("x",-.75),P("y",-1.5)],26:[P("x",-2),P("y",1.25)],27:[P("x",-1.75),P("y",1.5)],
      28:[H("x",16,9,-1,-1)],29:[{kind:"empty"}],30:[H("x",16,25,5,-2),E("y",16,4,-1,-2)],
      31:[H("y",2/3,2/9,-1/3,0)],32:[E("x",16,12),E("y",64/3,16),H("x",16,128),H("y",2,16)],
      33:[P("x",-2),E("x",1/9,8/81),H("x",9,72)],34:[P("y",1,0,.5),E("y",2,1,0,2),H("y",2,2,0,-1),H("y",.75,1.5,0,-.5)],
      37:[central("hyperbola","x",6,3,0,0,Math.PI/6)],
      38:[central("ellipse","x",8,2,2,-2,-Math.PI/4),E("x",16,4,4,0)],
      39:[central("hyperbola","x",2,6,2,2,-Math.PI/4)],40:[P("x",Math.sqrt(5),1.5,2,Math.atan2(2,1))],
      41:[E("y",400,169,-2,1),E("y",484,169,-2,1)],42:[E("x",4,3,-1,0)],
    };
    if(n===35)return[{label:"Famille 35",sets:[family35(m)],note:"m = "+m.toLocaleString("fr-FR",{maximumFractionDigits:3})}];
    if(n===36)return[{label:"Famille 36",sets:[family36(m)],note:"m = "+m.toLocaleString("fr-FR",{maximumFractionDigits:3})}];
    if(!data[n])return[];
    const result:ConicScene[]=scenes(data[n]);
    if(n===31){result.push({label:"Lieu complet : H et (Ox)",sets:[...data[n],{kind:"lines",lines:[{point:[0,0],direction:[1,0]}]}]});}
    if(n===34)result.forEach(s=>s.note="Exemple de la famille pour F(0;1), pas une solution unique.");
    if(n===38){result[0].label="Courbe C";result[1].label="Image C′";}
    if(n===41){result[0].label="Salle initiale E₁";result[1].label="E₂ · petit axe et centre conservés";result.push({label:"Comparer E₁ et E₂",sets:data[n],note:"Comparaison sous l’hypothèse du petit axe et du centre conservés."});}
    if(n===42)result[0].note="Une unité vaut 2 m. Les deux couples foyer-directrice sont possibles.";
    return result;
  }
  const summary:Record<string,ConicSet[]>={
    reduction:[E("y",16,4,1,2),{kind:"point",point:[0,0]},{kind:"empty"},{kind:"lines",lines:[{point:[0,0],direction:[1,1]},{point:[0,0],direction:[1,-1]}]}],
    parabola:[P("y",1.5),P("y",-1.5),P("x",1.5),P("x",-1.5)],
    "parabola-elements":[P("y",1),P("x",.5)],
    ellipse:[E("x",25,9),E("y",25,9),E("x",9,9)],
    "ellipse-elements":[E("x",9,4),E("y",9,4)],
    hyperbola:[H("x",4,9),H("y",9,4),H("x",4,4)],
    "hyperbola-elements":[H("x",4,9),H("y",9,4)],
    "focus-ratio":[E("x",25,16),P("x",2),H("x",4,9)],
    "evaluation-elements":[H("x",100,25,2,-1),H("x",25,16),P("x",2,-1,4)],
    "application-1a":[P("y",2,3,1)],"application-1b":[H("y",4,1)],"application-1c":[H("x",5,2,0,1)],
    "evaluation-plot-ellipse":[E("x",25,16)],"evaluation-plot-parabola":[P("x",2,-1,-4)],
    "application-plot-p":[H("y",4,9)],"application-plot-q":[E("x",5,1,0,1)],
  };
  return summary[preset]?scenes(summary[preset]):[];
}
