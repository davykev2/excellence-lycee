export type ComplexPair=readonly[number,number];
export const complexAdd=(a:ComplexPair,b:ComplexPair):ComplexPair=>[a[0]+b[0],a[1]+b[1]];
export const complexScale=(a:ComplexPair,k:number):ComplexPair=>[a[0]*k,a[1]*k];
export const complexSubtract=(a:ComplexPair,b:ComplexPair)=>complexAdd(a,complexScale(b,-1));
export const complexMultiply=(a:ComplexPair,b:ComplexPair):ComplexPair=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
export const complexNorm=(a:ComplexPair)=>Math.hypot(...a);
export const complexConjugate=(a:ComplexPair):ComplexPair=>[a[0],-a[1]];
export function complexDivide(a:ComplexPair,b:ComplexPair):ComplexPair{
  const d=b[0]**2+b[1]**2;if(d===0||!Number.isFinite(d))throw new Error("Division complexe non définie.");
  return complexScale(complexMultiply(a,complexConjugate(b)),1/d);
}
export function complexPower(a:ComplexPair,n:number):ComplexPair{
  if(!Number.isInteger(n)||Math.abs(n)>10000)throw new Error("Exposant entier borné requis.");
  if(n===0){if(complexNorm(a)===0)throw new Error("0^0 non défini.");return[1,0];}
  if(n<0)return complexPower(complexDivide([1,0],a),-n);
  let r:ComplexPair=[1,0],factor=a,k=n;
  while(k>0){if(k%2)r=complexMultiply(r,factor);k=Math.floor(k/2);if(k)factor=complexMultiply(factor,factor);}
  return r;
}
export function complexRoots(z:ComplexPair,n:number):ComplexPair[]{
  if(!Number.isInteger(n)||n<1||n>24)throw new Error("Indice entre 1 et 24 requis.");
  if(complexNorm(z)===0)return[[0,0]];
  const r=complexNorm(z)**(1/n),theta=Math.atan2(z[1],z[0]);
  return Array.from({length:n},(_,k)=>[r*Math.cos((theta+2*k*Math.PI)/n),r*Math.sin((theta+2*k*Math.PI)/n)] as ComplexPair);
}
/** Bounded algebraic input. No JavaScript evaluation, assignments or property access. */
export function parseComplexAnswer(value:string):ComplexPair|null{
  const text=value.replace(/²/g,"^2").replace(/³/g,"^3").normalize("NFKC").toLowerCase()
    .replace(/[−–]/g,"-").replace(/,/g,".").replace(/[×·]/g,"*").replace(/÷/g,"/")
    .replace(/√/g,"sqrt").replace(/π/g,"pi").replace(/\s/g,"");
  if(!text||text.length>500)return null;
  const tokens=text.match(/(?:\d+(?:\.\d*)?|\.\d+)|sqrt|pi|i|[a-z]+|[()+*/^-]/g)??[];
  if(tokens.join("")!==text||tokens.length>100)return null;
  let index=0,depth=0,operations=0;
  const safe=(z:ComplexPair):ComplexPair=>{if(++operations>250||!z.every(Number.isFinite)||complexNorm(z)>1e100)throw new Error("Bornes de calcul.");return z;};
  function atom():ComplexPair{
    if(++depth>30)throw new Error("Imbrication excessive.");const t=tokens[index++];let z:ComplexPair;
    if(t==="("){z=sum();if(tokens[index++]!==")")throw new Error("Parenthèse.");}
    else if(t==="i")z=[0,1];else if(t==="pi")z=[Math.PI,0];
    else if(t==="sqrt"){
      let a:ComplexPair;if(tokens[index]==="("){index++;a=sum();if(tokens[index++]!==")")throw new Error("Parenthèse.");}else a=power();
      const r=complexNorm(a),x=Math.sqrt(Math.max(0,(r+a[0])/2)),y=Math.sqrt(Math.max(0,(r-a[0])/2));z=[x,a[1]<0?-y:y];
    }else if(t&&/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(t))z=[Number(t),0];
    else throw new Error("Symbole interdit.");
    depth--;return safe(z);
  }
  function power():ComplexPair{const z=atom();if(tokens[index]!=="^")return z;index++;const n=unary();if(n[1]!==0)throw new Error("Exposant non réel.");return safe(complexPower(z,n[0]));}
  function unary():ComplexPair{if(tokens[index]==="+"){index++;return unary();}if(tokens[index]==="-"){index++;return complexScale(unary(),-1);}return power();}
  function product():ComplexPair{
    let z=unary();while(index<tokens.length){
      const t=tokens[index],implicit=t==="("||t==="i"||t==="pi"||t==="sqrt"||/^(?:\d|\.)/.test(t);
      if(t!=="*"&&t!=="/"&&!implicit)break;if(!implicit)index++;const b=unary();z=safe(t==="/"?complexDivide(z,b):complexMultiply(z,b));
    }return z;
  }
  function sum():ComplexPair{let z=product();while(tokens[index]==="+"||tokens[index]==="-"){const t=tokens[index++],b=product();z=safe(t==="+"?complexAdd(z,b):complexSubtract(z,b));}return z;}
  try{const z=sum();return index===tokens.length?safe(z):null;}catch{return null;}
}
