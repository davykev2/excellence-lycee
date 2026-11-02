export type IntegralPreset = "between-curves" | "rectangles" | number;
interface Series { label: string; fn: (x: number) => number; ranges: Array<[number,number]>; color?: string; dashed?: boolean }
export interface IntegralPlotModel {
  title: string; bounds: [number,number,number,number]; step: [number,number];
  /** Physical vertical unit / horizontal unit, only when a geometric scale is specified. */
  unitRatio?: number; axes?: [string,string]; scale?: string;
  series: Series[];
  verticals?: Array<{ x: number; label: string }>;
  shades?: Array<{ a: number; b: number; top: (x: number) => number; bottom: (x: number) => number; color?: string }>;
  points?: Array<{ x: number; y: number; label: string }>;
}
export function rectangleSums(fn: (x: number) => number, a: number, b: number, n: number) {
  if (!Number.isInteger(n) || n < 1 || n > 10000 || !(a < b)) throw new RangeError("Subdivision invalide");
  const h=(b-a)/n; let left=0,right=0;
  for(let i=0;i<n;i++){left+=h*fn(a+i*h);right+=h*fn(a+(i+1)*h);}
  return { left,right,midpoint:(left+right)/2,error:Math.abs(right-left)/2 };
}
/** Include rounding of the displayed midpoint, and round the error outwards. */
export function rectangleDisplayError(sums: { midpoint:number;error:number }) {
  const value=sums.error+Math.abs(Number(sums.midpoint.toFixed(6))-sums.midpoint);
  if(value===0)return 0;
  const scale=10**(5-Math.floor(Math.log10(value)));
  return Math.ceil(value*scale)/scale;
}
/** Bounded Simpson quadrature for a fixed plot, never for grading or a proof. */
export function integrateForPlot(fn: (x:number)=>number,a:number,b:number, n=400):number {
  if(!Number.isInteger(n)||n<2||n>10000||n%2) throw new RangeError("Quadrature invalide");
  const h=(b-a)/n; let total=fn(a)+fn(b);
  for(let i=1;i<n;i++) total+=(i%2?4:2)*fn(a+i*h);
  return total*h/3;
}
const zero=()=>0;
const series=(fn:(x:number)=>number,range:[number,number],label:string,color="#17618a",dashed=false):Series=>({fn,ranges:[range],label,color,dashed});
export const rectangleFunctions = {
  summary: { fn:(x:number)=>Math.sqrt(4-x*x),a:.4,b:.6,n:10,label:"√(4 − x²)" },
  36: { fn:(x:number)=>-2/Math.log(x),a:.1,b:.7,n:6,label:"−2 / ln x" },
  37: { fn:(x:number)=>Math.exp(x)/(1+x*x),a:-1,b:4,n:10,label:"eˣ / (1 + x²)" },
} as const;

export function integralPlotModel(preset:IntegralPreset):IntegralPlotModel|null {
  if(preset==="between-curves") {
    const f=(x:number)=>-x*x-x+2,g=(x:number)=>2*x+2;
    return { title:"Aire entre deux courbes · coupure en x = 0",bounds:[-1.4,1.4,-.8,5],step:[.5,1],unitRatio:.5,scale:"OI = 2 cm · OJ = 1 cm",
      series:[series(f,[-1.4,1.4],"f(x) = −x² − x + 2"),series(g,[-1.4,1.4],"g(x) = 2x + 2","#b76517")],
      shades:[{a:-1,b:0,top:f,bottom:g},{a:0,b:1,top:g,bottom:f,color:"#f0c887"}],points:[{x:0,y:2,label:"Intersection"}] };
  }
  if(preset===31) return {title:"Exercice31 · f(x) = 2x / (x² + 1)",bounds:[-1,4.5,-1.5,1.5],step:[1,.5],unitRatio:1,scale:"Repère orthonormé · unité 2 cm",series:[series(x=>2*x/(1+x*x),[-1,4.5],"C_f")]};
  if(preset===32) return {title:"Exercice32 · f(x) = x² + 2x",bounds:[-3,2,-2,8],step:[1,1],unitRatio:.5,scale:"OI = 2 cm · OJ = 1 cm",series:[series(x=>x*x+2*x,[-3,2],"C_f")],points:[{x:0,y:0,label:"O"},{x:-2,y:0,label:"−2"}]};
  if(preset===33) return {title:"Exercice33 · courbe et asymptotes",bounds:[-2,5,-6,4],step:[1,1],unitRatio:1,scale:"Repère orthonormé · unité 1 cm",
    series:[{...series(x=>x-2-4/(x-1)**2,[-2,.999],"C_f"),ranges:[[-2,.999],[1.001,5]]},series(x=>x-2,[-2,5],"Δ : y = x − 2","#a14f27",true)],verticals:[{x:1,label:"D : x = 1"}]};
  if(preset===34) return {title:"Exercice34 · C_f et D",bounds:[-2,2,-2,6],step:[1,1],unitRatio:1,scale:"Repère orthonormé · unité 2 cm",
    series:[series(x=>2*x+1-x*Math.exp(-x),[-2,2],"C_f"),series(x=>2*x+1,[-2,2],"D : y = 2x + 1","#a14f27",true)]};
  if(preset===52) return {title:"Exercice52 · F et sa tangente en 1",bounds:[-1,5,-3,8],step:[1,1],unitRatio:1,scale:"Repère orthonormé · F tracée par quadrature numérique · asymptote x = 0",
    series:[series(x=>integrateForPlot(t=>Math.exp(t)/t,1,x),[.025,5],"F(x) = ∫₁ˣ eᵗ/t dt"),series(x=>Math.E*(x-1),[-1,5],"T : y = e(x − 1)","#a14f27",true)],points:[{x:1,y:0,label:"A(1 ; 0)"}],verticals:[{x:0,label:"Asymptote : x = 0"}]};
  if(preset===58) {const f=(x:number)=>x/Math.sqrt(1+x*x);return {title:"Exercice58 · courbe et aire",bounds:[-3.5,3.5,-1.5,1.5],step:[1,.5],unitRatio:1.5,scale:"OI = 2 cm · OJ = 3 cm",series:[series(f,[-3.5,3.5],"C_f"),series(()=>1,[-3.5,3.5],"y = 1","#a14f27",true),series(()=>-1,[-3.5,3.5],"y = −1","#a14f27",true)],shades:[{a:0,b:Math.sqrt(3),top:f,bottom:zero}]};}
  if(preset===64) return {title:"Exercice64 · C₁, C₂ et tangente en (0 ; 1)",bounds:[-6,3,-5,5],step:[1,1],unitRatio:1,scale:"Repère orthonormé · unité 2 cm",
    series:[series(x=>(1-x)*Math.exp(x/2),[-6,3],"C₁"),series(x=>(1-x)**2*Math.exp(x/2),[-6,3],"C₂","#a14f27"),series(x=>1-x/2,[-6,3],"T : y = 1 − x/2","#667085",true)],points:[{x:0,y:1,label:"A"},{x:1,y:0,label:"B"}]};
  if(preset===65) {const f=(x:number)=>x*x/1600-x/4+125;return {title:"Surface OABC sous le pont",bounds:[0,600,0,225],step:[100,50],axes:["ℓ (m)","h (m)"],series:[series(f,[0,550],"h(ℓ)")],shades:[{a:0,b:550,top:f,bottom:zero}],points:[{x:0,y:125,label:"A"},{x:550,y:f(550),label:"B"},{x:550,y:0,label:"C"}]};}
  if(preset===66) return {title:"Parcelle conservée après le glissement de terrain",bounds:[0,8,0,2],step:[1,.5],unitRatio:1,scale:"Repère orthonormé · une unité = 1 hm",
    series:[series(()=>1,[0,Math.E],"Maïs : hauteur 1"),series(x=>2-Math.log(x),[Math.E,Math.E**2],"Igname : y = 2 − ln x","#a14f27"),series(()=>1,[Math.E,Math.E**2],"Ancienne limite","#667085",true)],
    shades:[{a:0,b:Math.E,top:()=>1,bottom:zero},{a:Math.E,b:Math.E**2,top:x=>2-Math.log(x),bottom:zero,color:"#f0c887"}],
    points:[{x:Math.E,y:1,label:"A(e ; 1)"},{x:Math.E**2,y:0,label:"B(e² ; 0)"}]};
  if(preset===67) {const f=(x:number)=>x*x*Math.exp(x/30);return {title:"Exercice67 · courbe et valeur moyenne",bounds:[0,30,0,2600],step:[5,500],axes:["x (jours)","Personnes"],series:[series(f,[0,30],"Modèle f(x)"),series(()=>900*Math.E-1800,[0,30],"Moyenne ≈ 646,45","#a14f27",true)],shades:[{a:0,b:30,top:f,bottom:zero}]};}
  return null;
}
