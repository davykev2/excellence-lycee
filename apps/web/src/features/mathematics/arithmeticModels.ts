const symbols="0123456789ABCDEF";
export function euclideanDivision(a:bigint,b:bigint){
  if(b===0n)throw new Error("Le diviseur ne peut pas être nul.");
  const B=b<0n?-b:b,r=((a%B)+B)%B;
  return{q:(a-r)/b,r};
}
function validBase(b:number){
  if(!Number.isInteger(b)||b<2||b>16)throw new Error("La base doit être un entier compris entre 2 et 16.");
}
export function parseBase(input:string,base:number){
  validBase(base);
  const value=input.trim().toUpperCase();
  if(!/^[0-9A-F]{1,60}$/.test(value))throw new Error("Saisir de 1 à 60 chiffres, sans signe, avec A à F si nécessaire.");
  let result=0n;
  for(const c of value){const d=symbols.indexOf(c);if(d>=base)throw new Error("Le chiffre "+c+" n’existe pas en base "+base+".");result=result*BigInt(base)+BigInt(d);}
  return result;
}
export function baseConversion(input:string,from:number,to:number){
  validBase(to);const decimal=parseBase(input,from),steps:Array<{a:bigint;q:bigint;r:bigint}>=[];
  let a=decimal;
  if(a===0n)steps.push({a:0n,q:0n,r:0n});
  while(a>0n){const d=euclideanDivision(a,BigInt(to));steps.push({a,...d});a=d.q;}
  return{decimal,result:steps.map(s=>symbols[Number(s.r)]).reverse().join(""),steps};
}
export function modPower(base:bigint,exponent:number,modulus:bigint){
  if(!Number.isSafeInteger(exponent)||exponent<0)throw new Error("L’exposant doit être un entier naturel.");
  if(modulus<=0n)throw new Error("Le modulo doit être strictement positif.");
  let n=exponent,b=((base%modulus)+modulus)%modulus,result=1n%modulus;
  while(n>0){if(n%2===1)result=result*b%modulus;b=b*b%modulus;n=Math.floor(n/2);}
  return result;
}
export function powerCycle(base:number,modulus:number){
  if(!Number.isSafeInteger(base)||!Number.isInteger(modulus)||modulus<2||modulus>1000)throw new Error("Paramètres de cycle invalides.");
  const seen=new Map<number,number>(),values:number[]=[];let r=1;
  while(!seen.has(r)){seen.set(r,values.length);values.push(r);r=Number((BigInt(r)*BigInt(base)%BigInt(modulus)+BigInt(modulus))%BigInt(modulus));}
  const start=seen.get(r)!;
  return{prefix:values.slice(0,start),period:values.slice(start),values,start};
}
export function isPrime(n:number){
  if(!Number.isSafeInteger(n)||n<2)return false;
  for(let d=2;d*d<=n;d++)if(n%d===0)return false;
  return true;
}
export function sieveValues(n:number){
  if(!Number.isInteger(n)||n<2||n>500)throw new Error("La borne doit être comprise entre 2 et 500.");
  return Array.from({length:n},(_,i)=>i+1).map(value=>({value,prime:isPrime(value)}));
}
export function primalityTrials(n:number){
  if(!Number.isSafeInteger(n)||n<2||n>1000000)throw new Error("Choisir un entier de 2 à 1 000 000.");
  const rows:Array<{p:number;q:number;r:number}>=[];
  for(let p=2;p*p<=n;p++)if(isPrime(p)){const r=n%p;rows.push({p,q:Math.floor(n/p),r});if(r===0)break;}
  return{rows,prime:rows.every(r=>r.r!==0)};
}
